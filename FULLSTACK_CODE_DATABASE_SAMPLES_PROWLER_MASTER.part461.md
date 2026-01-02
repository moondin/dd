---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 461
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 461 of 867)

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

---[FILE: cloudfront_distributions_field_level_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_field_level_encryption_enabled/cloudfront_distributions_field_level_encryption_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    DefaultCacheConfigBehaviour,
    Distribution,
    ViewerProtocolPolicy,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "eu-west-1"


class Test_cloudfront_distributions_field_level_encryption_enabled:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_field_level_encryption_enabled.cloudfront_distributions_field_level_encryption_enabled import (
                cloudfront_distributions_field_level_encryption_enabled,
            )

            check = cloudfront_distributions_field_level_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_one_distribution_field_level_encryption_enabled(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.https_only,
                    field_level_encryption_id="AAAAAAAA",
                ),
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_field_level_encryption_enabled.cloudfront_distributions_field_level_encryption_enabled import (
                cloudfront_distributions_field_level_encryption_enabled,
            )

            check = cloudfront_distributions_field_level_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has Field Level Encryption enabled."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_field_level_encryption_disabled(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.https_only,
                    field_level_encryption_id="",
                ),
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_field_level_encryption_enabled.cloudfront_distributions_field_level_encryption_enabled import (
                cloudfront_distributions_field_level_encryption_enabled,
            )

            check = cloudfront_distributions_field_level_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has Field Level Encryption disabled."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_geo_restrictions_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_geo_restrictions_enabled/cloudfront_distributions_geo_restrictions_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    Distribution,
    GeoRestrictionType,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "eu-west-1"


class Test_cloudfront_distributions_geo_restrictions_enabled:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_geo_restrictions_enabled.cloudfront_distributions_geo_restrictions_enabled import (
                cloudfront_distributions_geo_restrictions_enabled,
            )

            check = cloudfront_distributions_geo_restrictions_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_one_distribution_geo_restriction_disabled(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                geo_restriction_type=GeoRestrictionType.none,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_geo_restrictions_enabled.cloudfront_distributions_geo_restrictions_enabled import (
                cloudfront_distributions_geo_restrictions_enabled,
            )

            check = cloudfront_distributions_geo_restrictions_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has Geo restrictions disabled."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_geo_restriction_enabled_whitelist(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                geo_restriction_type=GeoRestrictionType.whitelist,
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_geo_restrictions_enabled.cloudfront_distributions_geo_restrictions_enabled import (
                cloudfront_distributions_geo_restrictions_enabled,
            )

            check = cloudfront_distributions_geo_restrictions_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has Geo restrictions enabled."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_geo_restriction_enabled_blacklist(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                geo_restriction_type=GeoRestrictionType.blacklist,
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_geo_restrictions_enabled.cloudfront_distributions_geo_restrictions_enabled import (
                cloudfront_distributions_geo_restrictions_enabled,
            )

            check = cloudfront_distributions_geo_restrictions_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has Geo restrictions enabled."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_https_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_https_enabled/cloudfront_distributions_https_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    DefaultCacheConfigBehaviour,
    Distribution,
    ViewerProtocolPolicy,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "eu-west-1"


class Test_cloudfront_distributions_https_enabled:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_https_enabled.cloudfront_distributions_https_enabled import (
                cloudfront_distributions_https_enabled,
            )

            check = cloudfront_distributions_https_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_one_distribution_https_disabled(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.allow_all,
                    field_level_encryption_id="",
                ),
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_https_enabled.cloudfront_distributions_https_enabled import (
                cloudfront_distributions_https_enabled,
            )

            check = cloudfront_distributions_https_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} viewers can use HTTP or HTTPS."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_https_redirect(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.redirect_to_https,
                    field_level_encryption_id="",
                ),
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_https_enabled.cloudfront_distributions_https_enabled import (
                cloudfront_distributions_https_enabled,
            )

            check = cloudfront_distributions_https_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has redirect to HTTPS."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_https_only(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.https_only,
                    field_level_encryption_id="",
                ),
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_https_enabled.cloudfront_distributions_https_enabled import (
                cloudfront_distributions_https_enabled,
            )

            check = cloudfront_distributions_https_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has HTTPS only."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_https_sni_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_https_sni_enabled/cloudfront_distributions_https_sni_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    Distribution,
    SSLSupportMethod,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "us-east-1"


class Test_cloudfront_distributions_https_sni_enabled:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_https_sni_enabled.cloudfront_distributions_https_sni_enabled import (
                cloudfront_distributions_https_sni_enabled,
            )

            check = cloudfront_distributions_https_sni_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_distribution_no_certificate(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                logging_enabled=True,
                origins=[],
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_https_sni_enabled.cloudfront_distributions_https_sni_enabled import (
                cloudfront_distributions_https_sni_enabled,
            )

            check = cloudfront_distributions_https_sni_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_distribution_certificate_not_set_up(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                logging_enabled=True,
                origins=[],
                ssl_support_method=SSLSupportMethod.static_ip,
                certificate="arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012",
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_https_sni_enabled.cloudfront_distributions_https_sni_enabled import (
                cloudfront_distributions_https_sni_enabled,
            )

            check = cloudfront_distributions_https_sni_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is not serving HTTPS requests using SNI."
            )

    def test_distribution_valid_configuration(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                logging_enabled=True,
                origins=[],
                ssl_support_method=SSLSupportMethod.sni_only,
                certificate="arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012",
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_https_sni_enabled.cloudfront_distributions_https_sni_enabled import (
                cloudfront_distributions_https_sni_enabled,
            )

            check = cloudfront_distributions_https_sni_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is serving HTTPS requests using SNI."
            )
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_logging_enabled/cloudfront_distributions_logging_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    DefaultCacheConfigBehaviour,
    Distribution,
    ViewerProtocolPolicy,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "eu-west-1"


class Test_cloudfront_distributions_logging_enabled:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_logging_enabled.cloudfront_distributions_logging_enabled import (
                cloudfront_distributions_logging_enabled,
            )

            check = cloudfront_distributions_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_one_distribution_logging_enabled(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                logging_enabled=True,
                origins=[],
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_logging_enabled.cloudfront_distributions_logging_enabled import (
                cloudfront_distributions_logging_enabled,
            )

            check = cloudfront_distributions_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has logging enabled."
            )

    def test_one_distribution_logging_disabled_realtime_disabled(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                logging_enabled=False,
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.https_only,
                    field_level_encryption_id="",
                ),
                origins=[],
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_logging_enabled.cloudfront_distributions_logging_enabled import (
                cloudfront_distributions_logging_enabled,
            )

            check = cloudfront_distributions_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has logging disabled."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_logging_disabled_realtime_enabled(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                logging_enabled=False,
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn=DISTRIBUTION_ARN,
                    viewer_protocol_policy=ViewerProtocolPolicy.https_only,
                    field_level_encryption_id="",
                ),
                origins=[],
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_logging_enabled.cloudfront_distributions_logging_enabled import (
                cloudfront_distributions_logging_enabled,
            )

            check = cloudfront_distributions_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has logging enabled."
            )
            assert result[0].resource_tags == []

    def test_one_distribution_logging_enabled_realtime_enabled(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                logging_enabled=True,
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn=DISTRIBUTION_ARN,
                    viewer_protocol_policy=ViewerProtocolPolicy.https_only,
                    field_level_encryption_id="",
                ),
                origins=[],
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_logging_enabled.cloudfront_distributions_logging_enabled import (
                cloudfront_distributions_logging_enabled,
            )

            check = cloudfront_distributions_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has logging enabled."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_multiple_origin_failover_configured_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_multiple_origin_failover_configured/cloudfront_distributions_multiple_origin_failover_configured_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    DefaultCacheConfigBehaviour,
    Distribution,
    ViewerProtocolPolicy,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "eu-west-1"


class Test_cloudfront_distributions_multiple_origin_failover_configured:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_multiple_origin_failover_configured.cloudfront_distributions_multiple_origin_failover_configured import (
                cloudfront_distributions_multiple_origin_failover_configured,
            )

            check = cloudfront_distributions_multiple_origin_failover_configured()
            result = check.execute()

            assert len(result) == 0

    def test_no_origin_failover(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.allow_all,
                    field_level_encryption_id="",
                ),
                origin_failover=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_multiple_origin_failover_configured.cloudfront_distributions_multiple_origin_failover_configured import (
                cloudfront_distributions_multiple_origin_failover_configured,
            )

            check = cloudfront_distributions_multiple_origin_failover_configured()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} does not have an origin group configured with at least 2 origins."
            )
            assert result[0].resource_tags == []

    def test_origin_failover(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                origins=[],
                default_cache_config=DefaultCacheConfigBehaviour(
                    realtime_log_config_arn="",
                    viewer_protocol_policy=ViewerProtocolPolicy.allow_all,
                    field_level_encryption_id="",
                ),
                origin_failover=True,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_multiple_origin_failover_configured.cloudfront_distributions_multiple_origin_failover_configured import (
                cloudfront_distributions_multiple_origin_failover_configured,
            )

            check = cloudfront_distributions_multiple_origin_failover_configured()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} has an origin group with at least 2 origins configured."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
