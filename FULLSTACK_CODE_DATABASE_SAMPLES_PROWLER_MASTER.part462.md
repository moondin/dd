---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 462
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 462 of 867)

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

---[FILE: cloudfront_distributions_origin_traffic_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_origin_traffic_encrypted/cloudfront_distributions_origin_traffic_encrypted_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    DefaultCacheConfigBehaviour,
    Distribution,
    Origin,
    ViewerProtocolPolicy,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "eu-west-1"


class Test_cloudfront_distributions_origin_traffic_encrypted:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_origin_traffic_encrypted.cloudfront_distributions_origin_traffic_encrypted import (
                cloudfront_distributions_origin_traffic_encrypted,
            )

            check = cloudfront_distributions_origin_traffic_encrypted()
            result = check.execute()

            assert len(result) == 0

    def test_distribution_no_traffic_encryption(self):
        cloudfront_client = mock.MagicMock
        id = "origin1"
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id=id,
                        domain_name="asdf.s3.us-east-1.amazonaws.com",
                        origin_protocol_policy="",
                        origin_ssl_protocols=[],
                    )
                ],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.allow_all,
                    field_level_encryption_id="",
                ),
                default_root_object="",
                viewer_protocol_policy="",
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_origin_traffic_encrypted.cloudfront_distributions_origin_traffic_encrypted import (
                cloudfront_distributions_origin_traffic_encrypted,
            )

            check = cloudfront_distributions_origin_traffic_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} does not encrypt traffic to custom origins {id}."
            )
            assert result[0].resource_tags == []

    def test_distribution_http_only(self):
        cloudfront_client = mock.MagicMock
        id = "origin1"
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id=id,
                        domain_name="asdf.s3.us-east-1.amazonaws.com",
                        origin_protocol_policy="http-only",
                        origin_ssl_protocols=[],
                    )
                ],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.allow_all,
                    field_level_encryption_id="",
                ),
                default_root_object="index.html",
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_origin_traffic_encrypted.cloudfront_distributions_origin_traffic_encrypted import (
                cloudfront_distributions_origin_traffic_encrypted,
            )

            check = cloudfront_distributions_origin_traffic_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} does not encrypt traffic to custom origins {id}."
            )
            assert result[0].resource_tags == []

    def test_distribution_match_viewer_allow_all(self):
        cloudfront_client = mock.MagicMock
        id = "origin1"
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id=id,
                        domain_name="asdf.s3.us-east-1.amazonaws.com",
                        origin_protocol_policy="match-viewer",
                        origin_ssl_protocols=[],
                    )
                ],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.allow_all,
                    field_level_encryption_id="",
                ),
                default_root_object="index.html",
                viewer_protocol_policy="allow-all",
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_origin_traffic_encrypted.cloudfront_distributions_origin_traffic_encrypted import (
                cloudfront_distributions_origin_traffic_encrypted,
            )

            check = cloudfront_distributions_origin_traffic_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} does not encrypt traffic to custom origins {id}."
            )
            assert result[0].resource_tags == []

    def test_distribution_traffic_encrypted(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id="origin1",
                        domain_name="asdf.s3.us-east-1.amazonaws.com",
                        origin_protocol_policy="https-only",
                        origin_ssl_protocols=[],
                    )
                ],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.allow_all,
                    field_level_encryption_id="",
                ),
                default_root_object="index.html",
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_origin_traffic_encrypted.cloudfront_distributions_origin_traffic_encrypted import (
                cloudfront_distributions_origin_traffic_encrypted,
            )

            check = cloudfront_distributions_origin_traffic_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} does encrypt traffic to custom origins."
            )
            assert result[0].resource_tags == []

    def test_distribution_traffic_encrypted_with_s3_config(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id="origin1",
                        domain_name="asdf.s3.us-east-1.amazonaws.com",
                        origin_protocol_policy="",
                        origin_ssl_protocols=[],
                        s3_origin_config={
                            "OriginAccessIdentity": "origin-access-identity/cloudfront/1234567890123456"
                        },
                    )
                ],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.redirect_to_https,
                    field_level_encryption_id="",
                ),
                default_root_object="index.html",
                viewer_protocol_policy="redirect-to-https",
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_origin_traffic_encrypted.cloudfront_distributions_origin_traffic_encrypted import (
                cloudfront_distributions_origin_traffic_encrypted,
            )

            check = cloudfront_distributions_origin_traffic_encrypted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} does encrypt traffic to custom origins."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_s3_origin_access_control_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_s3_origin_access_control/cloudfront_distributions_s3_origin_access_control_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    Distribution,
    Origin,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "eu-west-1"


class Test_cloudfront_distributions_s3_origin_access_control:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_access_control.cloudfront_distributions_s3_origin_access_control import (
                cloudfront_distributions_s3_origin_access_control,
            )

            check = cloudfront_distributions_s3_origin_access_control()
            result = check.execute()

            assert len(result) == 0

    def test_no_s3_origin_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id="string",
                        domain_name="string",
                        origin_protocol_policy="https-only",
                        origin_ssl_protocols=["TLSv1", "TLSv1.1"],
                        s3_origin_config={},
                    ),
                ],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_access_control.cloudfront_distributions_s3_origin_access_control import (
                cloudfront_distributions_s3_origin_access_control,
            )

            check = cloudfront_distributions_s3_origin_access_control()
            result = check.execute()

            assert len(result) == 0

    def test_distribution_using_origin_access_control(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id="string",
                        domain_name="string",
                        origin_protocol_policy="https-only",
                        origin_ssl_protocols=["TLSv1", "TLSv1.1"],
                        origin_access_control="EXAMPLE-OAC-ID",
                        s3_origin_config={
                            "OriginAccessIdentity": "origin-access-identity/cloudfront/EXAMPLE-OAI-ID"
                        },
                    ),
                ],
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_access_control.cloudfront_distributions_s3_origin_access_control import (
                cloudfront_distributions_s3_origin_access_control,
            )

            check = cloudfront_distributions_s3_origin_access_control()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is using origin access control (OAC) for S3 origins."
            )
            assert result[0].resource_tags == []

    def test_distribution_not_using_origin_access_control(self):
        cloudfront_client = mock.MagicMock
        id = "EXAMPLE-OAC-ID"
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id=id,
                        domain_name="string",
                        origin_protocol_policy="https-only",
                        origin_ssl_protocols=["TLSv1", "TLSv1.1"],
                        origin_access_control="",
                        s3_origin_config={
                            "OriginAccessIdentity": "origin-access-identity/cloudfront/EXAMPLE-OAI-ID"
                        },
                    ),
                ],
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_access_control.cloudfront_distributions_s3_origin_access_control import (
                cloudfront_distributions_s3_origin_access_control,
            )

            check = cloudfront_distributions_s3_origin_access_control()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is not using origin access control (OAC) in S3 origins {id}."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_s3_origin_non_existent_bucket_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_s3_origin_non_existent_bucket/cloudfront_distributions_s3_origin_non_existent_bucket_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    Distribution,
    Origin,
)
from prowler.providers.aws.services.s3.s3_service import Bucket
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)


class Test_cloudfront_s3_origin_non_existent_bucket:
    @mock.patch(
        "prowler.providers.aws.services.s3.s3_service.S3._head_bucket",
        new=mock.MagicMock(return_value=False),
    )
    def test_no_distributions(self):
        # Distributions
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        s3_client = mock.MagicMock()
        # Buckets
        s3_client.buckets = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.s3.s3_service.S3", new=s3_client
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
                new=cloudfront_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_non_existent_bucket.cloudfront_distributions_s3_origin_non_existent_bucket import (
                cloudfront_distributions_s3_origin_non_existent_bucket,
            )

            check = cloudfront_distributions_s3_origin_non_existent_bucket()
            result = check.execute()

            assert len(result) == 0

    def test_distribution_nonexistent_origins(self):
        # Distributions
        domain = "nonexistent-bucket.s3.eu-west-1.amazonaws.com"
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=AWS_REGION_EU_WEST_1,
                logging_enabled=True,
                origins=[
                    Origin(
                        domain_name=domain,
                        id="S3-ORIGIN",
                        origin_protocol_policy="",
                        origin_ssl_protocols=[],
                        s3_origin_config={"OriginAccessIdentity": ""},
                    ),
                ],
            )
        }
        # Buckets
        nonexistent_bucket = "nonexistent-bucket"
        s3_client = mock.MagicMock()
        s3_client.buckets = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.s3.s3_service.S3", new=s3_client
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
                new=cloudfront_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_non_existent_bucket.cloudfront_distributions_s3_origin_non_existent_bucket.s3_client._head_bucket",
                new=mock.MagicMock(return_value=False),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_non_existent_bucket.cloudfront_distributions_s3_origin_non_existent_bucket import (
                cloudfront_distributions_s3_origin_non_existent_bucket,
            )

            check = cloudfront_distributions_s3_origin_non_existent_bucket()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has non-existent S3 buckets as origins: {nonexistent_bucket}."
            )

    def test_distribution_no_nonexistent_origins(self):
        # Distributions
        domain = "existent-bucket.s3.eu-west-1.amazonaws.com"
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=AWS_REGION_EU_WEST_1,
                logging_enabled=True,
                origins=[
                    Origin(
                        domain_name=domain,
                        id="S3-ORIGIN",
                        origin_protocol_policy="",
                        origin_ssl_protocols=[],
                        s3_origin_config={"OriginAccessIdentity": ""},
                    ),
                ],
            )
        }
        # Buckets
        bucket_name = "existent-bucket"
        s3_client = mock.MagicMock()
        s3_client.audited_account = AWS_ACCOUNT_NUMBER
        s3_client.buckets = {
            f"arn:aws:s3:::{bucket_name}": Bucket(
                arn=f"arn:aws:s3:::{bucket_name}",
                name=bucket_name,
                region=AWS_REGION_EU_WEST_1,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.s3.s3_service.S3", new=s3_client
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
                new=cloudfront_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_non_existent_bucket.cloudfront_distributions_s3_origin_non_existent_bucket.s3_client._head_bucket",
                new=mock.MagicMock(return_value=True),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_non_existent_bucket.cloudfront_distributions_s3_origin_non_existent_bucket import (
                cloudfront_distributions_s3_origin_non_existent_bucket,
            )

            check = cloudfront_distributions_s3_origin_non_existent_bucket()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} does not have non-existent S3 buckets as origins."
            )

    def test_distribution_bucket_name_with_dots(self):
        # Distributions
        domain = "existent-bucket.dev.s3.eu-west-1.amazonaws.com"
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=AWS_REGION_EU_WEST_1,
                logging_enabled=True,
                origins=[
                    Origin(
                        domain_name=domain,
                        id="S3-ORIGIN",
                        origin_protocol_policy="",
                        origin_ssl_protocols=[],
                        s3_origin_config={"OriginAccessIdentity": ""},
                    ),
                ],
            )
        }
        # Buckets
        bucket_name = "existent-bucket.dev"
        s3_client = mock.MagicMock()
        s3_client.audited_account = AWS_ACCOUNT_NUMBER
        s3_client.buckets = {
            f"arn:aws:s3:::{bucket_name}": Bucket(
                arn=f"arn:aws:s3:::{bucket_name}",
                name=bucket_name,
                region=AWS_REGION_EU_WEST_1,
            )
        }
        head_bucket_return_value = bucket_name == domain.split(".s3")[0]

        with (
            mock.patch(
                "prowler.providers.aws.services.s3.s3_service.S3", new=s3_client
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
                new=cloudfront_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_non_existent_bucket.cloudfront_distributions_s3_origin_non_existent_bucket.s3_client._head_bucket",
                new=mock.MagicMock(return_value=head_bucket_return_value),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_s3_origin_non_existent_bucket.cloudfront_distributions_s3_origin_non_existent_bucket import (
                cloudfront_distributions_s3_origin_non_existent_bucket,
            )

            check = cloudfront_distributions_s3_origin_non_existent_bucket()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} does not have non-existent S3 buckets as origins."
            )
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_using_deprecated_ssl_protocols_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_using_deprecated_ssl_protocols/cloudfront_distributions_using_deprecated_ssl_protocols_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    Distribution,
    Origin,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "eu-west-1"


class Test_cloudfront_distributions_using_deprecated_ssl_protocols:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_using_deprecated_ssl_protocols.cloudfront_distributions_using_deprecated_ssl_protocols import (
                cloudfront_distributions_using_deprecated_ssl_protocols,
            )

            check = cloudfront_distributions_using_deprecated_ssl_protocols()
            result = check.execute()

            assert len(result) == 0

    def test_one_distribution_using_deprecated_ssl_protocols(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id="string",
                        domain_name="string",
                        origin_protocol_policy="https-only",
                        origin_ssl_protocols=["SSLv3"],
                    )
                ],
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_using_deprecated_ssl_protocols.cloudfront_distributions_using_deprecated_ssl_protocols import (
                cloudfront_distributions_using_deprecated_ssl_protocols,
            )

            check = cloudfront_distributions_using_deprecated_ssl_protocols()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is using a deprecated SSL protocol."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_using_SSL_and_TLS(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id="string",
                        domain_name="string",
                        origin_protocol_policy="https-only",
                        origin_ssl_protocols=[
                            "SSLv3",
                            "TLSv1.2",
                        ],
                    )
                ],
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_using_deprecated_ssl_protocols.cloudfront_distributions_using_deprecated_ssl_protocols import (
                cloudfront_distributions_using_deprecated_ssl_protocols,
            )

            check = cloudfront_distributions_using_deprecated_ssl_protocols()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is using a deprecated SSL protocol."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_using_SSL_and_bad_TLS(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id="string",
                        domain_name="string",
                        origin_protocol_policy="https-only",
                        origin_ssl_protocols=[
                            "SSLv3",
                            "TLSv1.1",
                        ],
                    )
                ],
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_using_deprecated_ssl_protocols.cloudfront_distributions_using_deprecated_ssl_protocols import (
                cloudfront_distributions_using_deprecated_ssl_protocols,
            )

            check = cloudfront_distributions_using_deprecated_ssl_protocols()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is using a deprecated SSL protocol."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_not_using_deprecated_ssl_protocols(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[
                    Origin(
                        id="string",
                        domain_name="string",
                        origin_protocol_policy="https-only",
                        origin_ssl_protocols=[
                            "TLSv1.2",
                        ],
                    )
                ],
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_using_deprecated_ssl_protocols.cloudfront_distributions_using_deprecated_ssl_protocols import (
                cloudfront_distributions_using_deprecated_ssl_protocols,
            )

            check = cloudfront_distributions_using_deprecated_ssl_protocols()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is not using a deprecated SSL protocol."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_using_waf_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_using_waf/cloudfront_distributions_using_waf_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import Distribution
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "eu-west-1"


class Test_cloudfront_distributions_using_waf:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_using_waf.cloudfront_distributions_using_waf import (
                cloudfront_distributions_using_waf,
            )

            check = cloudfront_distributions_using_waf()
            result = check.execute()

            assert len(result) == 0

    def test_one_distribution_waf(self):
        wef_acl_id = "TEST-WAF-ACL"
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                web_acl_id=wef_acl_id,
                origins=[],
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_using_waf.cloudfront_distributions_using_waf import (
                cloudfront_distributions_using_waf,
            )

            check = cloudfront_distributions_using_waf()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is using AWS WAF web ACL {wef_acl_id}."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_no_waf(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_using_waf.cloudfront_distributions_using_waf import (
                cloudfront_distributions_using_waf,
            )

            check = cloudfront_distributions_using_waf()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is not using AWS WAF web ACL."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
