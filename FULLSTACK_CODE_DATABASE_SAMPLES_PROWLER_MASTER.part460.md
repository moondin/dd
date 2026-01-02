---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 460
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 460 of 867)

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

---[FILE: cloudformation_stacks_termination_protection_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudformation/cloudformation_stacks_termination_protection_enabled/cloudformation_stacks_termination_protection_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudformation.cloudformation_service import Stack

# Mock Test Region
AWS_REGION = "eu-west-1"


class Test_cloudformation_stacks_termination_protection_enabled:
    def test_no_stacks(self):
        cloudformation_client = mock.MagicMock
        cloudformation_client.stacks = []
        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                new=cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudformation.cloudformation_stacks_termination_protection_enabled.cloudformation_stacks_termination_protection_enabled import (
                cloudformation_stacks_termination_protection_enabled,
            )

            check = cloudformation_stacks_termination_protection_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_stack_termination_protection_enabled(self):
        cloudformation_client = mock.MagicMock
        stack_name = "Test-Stack"
        cloudformation_client.stacks = [
            Stack(
                arn="arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60",
                name=stack_name,
                outputs=[],
                region=AWS_REGION,
            )
        ]
        cloudformation_client.stacks[0].enable_termination_protection = True

        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            from prowler.providers.aws.services.cloudformation.cloudformation_stacks_termination_protection_enabled.cloudformation_stacks_termination_protection_enabled import (
                cloudformation_stacks_termination_protection_enabled,
            )

            check = cloudformation_stacks_termination_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFormation Stack {stack_name} has termination protection enabled."
            )
            assert result[0].resource_id == "Test-Stack"
            assert (
                result[0].resource_arn
                == "arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_stack_termination_protection_disabled(self):
        cloudformation_client = mock.MagicMock
        stack_name = "Test-Stack"
        cloudformation_client.stacks = [
            Stack(
                arn="arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60",
                name=stack_name,
                outputs=[],
                region=AWS_REGION,
            )
        ]
        cloudformation_client.stacks[0].enable_termination_protection = False

        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            from prowler.providers.aws.services.cloudformation.cloudformation_stacks_termination_protection_enabled.cloudformation_stacks_termination_protection_enabled import (
                cloudformation_stacks_termination_protection_enabled,
            )

            check = cloudformation_stacks_termination_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFormation Stack {stack_name} has termination protection disabled."
            )
            assert result[0].resource_id == "Test-Stack"
            assert (
                result[0].resource_arn
                == "arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudformation_stack_cdktoolkit_bootstrap_version_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudformation/cloudformation_stack_cdktoolkit_bootstrap_version/cloudformation_stack_cdktoolkit_bootstrap_version_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudformation.cloudformation_service import Stack

# Mock Test Region
AWS_REGION = "eu-west-1"


class Test_cloudformation_stack_cdktoolkit_bootstrap_version:
    def test_no_stacks(self):
        cloudformation_client = mock.MagicMock
        cloudformation_client.stacks = []
        cloudformation_client.audit_config = {"recommended_cdk_bootstrap_version": 21}
        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                new=cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            from prowler.providers.aws.services.cloudformation.cloudformation_stack_cdktoolkit_bootstrap_version.cloudformation_stack_cdktoolkit_bootstrap_version import (
                cloudformation_stack_cdktoolkit_bootstrap_version,
            )

            check = cloudformation_stack_cdktoolkit_bootstrap_version()
            result = check.execute()

            assert len(result) == 0

    def test_stack_with_valid_bootstrap_version(self):
        cloudformation_client = mock.MagicMock
        cloudformation_client.stacks = [
            Stack(
                arn="arn:aws:cloudformation:eu-west-1:123456789012:stack/CDKToolkit/1234abcd",
                name="CDKToolkit",
                outputs=["BootstrapVersion:21"],
                region=AWS_REGION,
            )
        ]
        cloudformation_client.audit_config = {"recommended_cdk_bootstrap_version": 21}

        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                new=cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            from prowler.providers.aws.services.cloudformation.cloudformation_stack_cdktoolkit_bootstrap_version.cloudformation_stack_cdktoolkit_bootstrap_version import (
                cloudformation_stack_cdktoolkit_bootstrap_version,
            )

            check = cloudformation_stack_cdktoolkit_bootstrap_version()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "CloudFormation Stack CDKToolkit has a Bootstrap version 21, which meets the recommended version."
            )
            assert result[0].resource_id == "CDKToolkit"
            assert (
                result[0].resource_arn
                == "arn:aws:cloudformation:eu-west-1:123456789012:stack/CDKToolkit/1234abcd"
            )
            assert result[0].region == AWS_REGION

    def test_stack_with_invalid_bootstrap_version(self):
        cloudformation_client = mock.MagicMock
        cloudformation_client.stacks = [
            Stack(
                arn="arn:aws:cloudformation:eu-west-1:123456789012:stack/CDKToolkit/1234abcd",
                name="CDKToolkit",
                outputs=["BootstrapVersion:20"],
                region=AWS_REGION,
            )
        ]
        cloudformation_client.audit_config = {"recommended_cdk_bootstrap_version": 21}

        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                new=cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            from prowler.providers.aws.services.cloudformation.cloudformation_stack_cdktoolkit_bootstrap_version.cloudformation_stack_cdktoolkit_bootstrap_version import (
                cloudformation_stack_cdktoolkit_bootstrap_version,
            )

            check = cloudformation_stack_cdktoolkit_bootstrap_version()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "CloudFormation Stack CDKToolkit has a Bootstrap version 20, which is less than the recommended version 21."
            )
            assert result[0].resource_id == "CDKToolkit"
            assert (
                result[0].resource_arn
                == "arn:aws:cloudformation:eu-west-1:123456789012:stack/CDKToolkit/1234abcd"
            )
            assert result[0].region == AWS_REGION
```

--------------------------------------------------------------------------------

---[FILE: cloudformation_stack_outputs_find_secrets_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudformation/cloudformation_stack_outputs_find_secrets/cloudformation_stack_outputs_find_secrets_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudformation.cloudformation_service import Stack

# Mock Test Region
AWS_REGION = "eu-west-1"


class Test_cloudformation_stack_outputs_find_secrets:
    def test_no_stacks(self):
        cloudformation_client = mock.MagicMock
        cloudformation_client.stacks = []
        cloudformation_client.audit_config = {"secrets_ignore_patterns": []}
        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                new=cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudformation.cloudformation_stack_outputs_find_secrets.cloudformation_stack_outputs_find_secrets import (
                cloudformation_stack_outputs_find_secrets,
            )

            check = cloudformation_stack_outputs_find_secrets()
            result = check.execute()

            assert len(result) == 0

    def test_stack_secret_in_outputs(self):
        cloudformation_client = mock.MagicMock
        stack_name = "Test-Stack"
        cloudformation_client.stacks = [
            Stack(
                arn="arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60",
                name=stack_name,
                outputs=["DB_PASSWORD:foobar123", "ENV:DEV"],
                region=AWS_REGION,
            )
        ]

        cloudformation_client.audit_config = {"secrets_ignore_patterns": []}

        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            from prowler.providers.aws.services.cloudformation.cloudformation_stack_outputs_find_secrets.cloudformation_stack_outputs_find_secrets import (
                cloudformation_stack_outputs_find_secrets,
            )

            check = cloudformation_stack_outputs_find_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in CloudFormation Stack {stack_name} Outputs -> Secret Keyword in Output 1."
            )
            assert result[0].resource_id == "Test-Stack"
            assert (
                result[0].resource_arn
                == "arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_stack_secret_in_outputs_false_case(self):
        cloudformation_client = mock.MagicMock
        stack_name = "Test-Stack"
        cloudformation_client.stacks = [
            Stack(
                arn="arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60",
                name=stack_name,
                outputs=[
                    "LocalSecurityTopic:arn:aws:sns:eu-west-1:123456789012:LocalSecurityTopic"
                ],
                region=AWS_REGION,
            )
        ]

        cloudformation_client.audit_config = {"secrets_ignore_patterns": []}

        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            from prowler.providers.aws.services.cloudformation.cloudformation_stack_outputs_find_secrets.cloudformation_stack_outputs_find_secrets import (
                cloudformation_stack_outputs_find_secrets,
            )

            check = cloudformation_stack_outputs_find_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in CloudFormation Stack {stack_name} Outputs."
            )
            assert result[0].resource_id == "Test-Stack"
            assert (
                result[0].resource_arn
                == "arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_stack_no_secret_in_outputs(self):
        cloudformation_client = mock.MagicMock
        stack_name = "Test-Stack"
        cloudformation_client.stacks = [
            Stack(
                arn="arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60",
                name=stack_name,
                outputs=["ENV:DEV"],
                region=AWS_REGION,
            )
        ]

        cloudformation_client.audit_config = {"secrets_ignore_patterns": []}

        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            from prowler.providers.aws.services.cloudformation.cloudformation_stack_outputs_find_secrets.cloudformation_stack_outputs_find_secrets import (
                cloudformation_stack_outputs_find_secrets,
            )

            check = cloudformation_stack_outputs_find_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in CloudFormation Stack {stack_name} Outputs."
            )
            assert result[0].resource_id == "Test-Stack"
            assert (
                result[0].resource_arn
                == "arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_stack_no_outputs(self):
        cloudformation_client = mock.MagicMock
        stack_name = "Test-Stack"
        cloudformation_client.stacks = [
            Stack(
                arn="arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60",
                name=stack_name,
                outputs=[],
                region=AWS_REGION,
            )
        ]

        cloudformation_client.audit_config = {"secrets_ignore_patterns": []}

        with (
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_service.CloudFormation",
                cloudformation_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudformation.cloudformation_client.cloudformation_client",
                new=cloudformation_client,
            ),
        ):
            from prowler.providers.aws.services.cloudformation.cloudformation_stack_outputs_find_secrets.cloudformation_stack_outputs_find_secrets import (
                cloudformation_stack_outputs_find_secrets,
            )

            check = cloudformation_stack_outputs_find_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFormation Stack {stack_name} has no Outputs."
            )
            assert result[0].resource_id == "Test-Stack"
            assert (
                result[0].resource_arn
                == "arn:aws:cloudformation:eu-west-1:123456789012:stack/Test-Stack/796c8d26-b390-41d7-a23c-0702c4e78b60"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_service_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_service_test.py

```python
from unittest import mock
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    CloudFront,
    DefaultCacheConfigBehaviour,
    Distribution,
    GeoRestrictionType,
    Origin,
    SSLSupportMethod,
    ViewerProtocolPolicy,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


def example_distribution_config(ref):
    """Return a basic example distribution config for use in tests."""
    return {
        "CallerReference": ref,
        "Origins": {
            "Quantity": 1,
            "Items": [
                {
                    "Id": "origin1",
                    "DomainName": "asdf.s3.us-east-1.amazonaws.com",
                    "S3OriginConfig": {"OriginAccessIdentity": ""},
                },
            ],
        },
        "OriginGroups": {
            "Quantity": 1,
            "Items": [
                {
                    "Id": "origin-group1",
                    "FailoverCriteria": {
                        "StatusCodes": {"Quantity": 1, "Items": [500]}
                    },
                    "Members": {
                        "Quantity": 2,
                        "Items": [
                            {
                                "OriginId": "origin1",
                            },
                            {
                                "OriginId": "origin2",
                            },
                        ],
                    },
                }
            ],
        },
        "DefaultCacheBehavior": {
            "TargetOriginId": "origin1",
            "ViewerProtocolPolicy": "allow-all",
            "MinTTL": 10,
            "ForwardedValues": {
                "QueryString": False,
                "Cookies": {"Forward": "none"},
            },
        },
        "ViewerCertificate": {
            "SSLSupportMethod": "static-ip",
            "Certificate": "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012",
        },
        "Comment": "an optional comment that's not actually optional",
        "Enabled": False,
    }


# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """
    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816

    We have to mock every AWS API call using Boto3
    """
    if operation_name == "GetDistributionConfig":
        if kwarg["Id"]:
            return {
                "DistributionConfig": {
                    "Origins": {"Quantity": 123, "Items": []},
                    "OriginGroups": {"Quantity": 123, "Items": []},
                    "DefaultCacheBehavior": {
                        "TargetOriginId": "",
                        "TrustedSigners": {
                            "Enabled": False,
                            "Quantity": 123,
                            "Items": [
                                "",
                            ],
                        },
                        "TrustedKeyGroups": {
                            "Enabled": False,
                            "Quantity": 123,
                            "Items": [
                                "",
                            ],
                        },
                        "ViewerProtocolPolicy": "https-only",
                        "AllowedMethods": {
                            "Quantity": 123,
                            "Items": [
                                "GET",
                            ],
                            "CachedMethods": {
                                "Quantity": 123,
                                "Items": [
                                    "GET",
                                ],
                            },
                        },
                        "SmoothStreaming": False,
                        "Compress": False,
                        "LambdaFunctionAssociations": {},
                        "FunctionAssociations": {},
                        "FieldLevelEncryptionId": "enabled",
                        "RealtimeLogConfigArn": "test-log-arn",
                        "CachePolicyId": "",
                        "OriginRequestPolicyId": "",
                        "ResponseHeadersPolicyId": "",
                        "ForwardedValues": {
                            "QueryString": False,
                            "Cookies": {},
                            "Headers": {},
                            "QueryStringCacheKeys": {},
                        },
                        "MinTTL": 123,
                        "DefaultTTL": 123,
                        "MaxTTL": 123,
                    },
                    "CacheBehaviors": {},
                    "CustomErrorResponses": {},
                    "Comment": "",
                    "Logging": {
                        "Enabled": True,
                        "IncludeCookies": False,
                        "Bucket": "",
                        "Prefix": "",
                    },
                    "PriceClass": "PriceClass_All",
                    "Enabled": False,
                    "ViewerCertificate": {},
                    "Restrictions": {
                        "GeoRestriction": {
                            "RestrictionType": "blacklist",
                            "Quantity": 123,
                            "Items": [
                                "",
                            ],
                        }
                    },
                    "WebACLId": "test-web-acl",
                    "HttpVersion": "http2and3",
                    "IsIPV6Enabled": False,
                },
                "ETag": "",
            }
    if operation_name == "ListTagsForResource":
        return {
            "Tags": {
                "Items": [
                    {"Key": "test", "Value": "test"},
                ]
            }
        }
    return make_api_call(self, operation_name, kwarg)


# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_CloudFront_Service:
    # Test CloudFront Client
    @mock_aws
    def test_get_client(self):
        cloudfront = CloudFront(set_mocked_aws_provider())
        assert cloudfront.client.__class__.__name__ == "CloudFront"

    # Test CloudFront Session
    @mock_aws
    def test__get_session__(self):
        cloudfront = CloudFront(set_mocked_aws_provider())
        assert cloudfront.session.__class__.__name__ == "Session"

    # Test CloudFront Service
    @mock_aws
    def test__get_service__(self):
        cloudfront = CloudFront(set_mocked_aws_provider())
        assert cloudfront.service == "cloudfront"

    @mock_aws
    def test_list_distributionszero(self):
        cloudfront = CloudFront(set_mocked_aws_provider())

        assert len(cloudfront.distributions) == 0

    def test_list_distributionscomplete(self):
        from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

        DISTRIBUTION_ID = "E27LVI50CSW06W"
        DISTRIBUTION_ARN = (
            f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
        )
        REGION = "us-east-1"
        LOGGING_ENABLED = True
        ORIGINS = [
            Origin(
                id="origin1",
                domain_name="asdf.s3.us-east-1.amazonaws.com",
                origin_protocol_policy="",
                origin_ssl_protocols=[],
            ),
        ]
        DEFAULT_CACHE_CONFIG = DefaultCacheConfigBehaviour(
            realtime_log_config_arn="test-log-arn",
            viewer_protocol_policy=ViewerProtocolPolicy.https_only,
            field_level_encryption_id="enabled",
        )
        GEO_RESTRICTION_TYPE = GeoRestrictionType.blacklist
        WEB_ACL_ID = "test-web-acl"
        TAGS = [
            {"Key": "test", "Value": "test"},
        ]
        SSL_SUPPORT_METHOD = SSLSupportMethod.sni_only
        CERTIFICATE = "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"

        cloudfront = mock.MagicMock
        cloudfront.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                logging_enabled=LOGGING_ENABLED,
                origins=ORIGINS,
                default_cache_config=DEFAULT_CACHE_CONFIG,
                geo_restriction_type=GEO_RESTRICTION_TYPE,
                web_acl_id=WEB_ACL_ID,
                tags=TAGS,
                ssl_support_method=SSL_SUPPORT_METHOD,
                certificate=CERTIFICATE,
            )
        }

        assert len(cloudfront.distributions) == 1
        assert cloudfront.distributions[DISTRIBUTION_ID].arn == DISTRIBUTION_ARN
        assert cloudfront.distributions[DISTRIBUTION_ID].id == DISTRIBUTION_ID
        assert cloudfront.distributions[DISTRIBUTION_ID].region == AWS_REGION_US_EAST_1
        assert (
            cloudfront.distributions[DISTRIBUTION_ID].logging_enabled is LOGGING_ENABLED
        )
        for origin in cloudfront.distributions[DISTRIBUTION_ID].origins:
            assert origin.id == "origin1"
            assert origin.domain_name == "asdf.s3.us-east-1.amazonaws.com"
            assert origin.origin_protocol_policy == ""
            assert origin.origin_ssl_protocols == []
        assert (
            cloudfront.distributions[DISTRIBUTION_ID].geo_restriction_type
            == GEO_RESTRICTION_TYPE
        )
        assert cloudfront.distributions[DISTRIBUTION_ID].web_acl_id == "test-web-acl"
        assert (
            cloudfront.distributions[
                DISTRIBUTION_ID
            ].default_cache_config.realtime_log_config_arn
            == DEFAULT_CACHE_CONFIG.realtime_log_config_arn
        )
        assert (
            cloudfront.distributions[
                DISTRIBUTION_ID
            ].default_cache_config.viewer_protocol_policy
            == DEFAULT_CACHE_CONFIG.viewer_protocol_policy
        )
        assert (
            cloudfront.distributions[
                DISTRIBUTION_ID
            ].default_cache_config.field_level_encryption_id
            == DEFAULT_CACHE_CONFIG.field_level_encryption_id
        )
        assert cloudfront.distributions[DISTRIBUTION_ID].tags == TAGS
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_custom_ssl_certificate_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_custom_ssl_certificate/cloudfront_distributions_custom_ssl_certificate_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import Distribution
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

DISTRIBUTION_ID = "E27LVI50CSW06W"
DISTRIBUTION_ARN = (
    f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{DISTRIBUTION_ID}"
)
REGION = "eu-west-1"


class Test_cloudfront_distributions_custom_ssl_certificate:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_custom_ssl_certificate.cloudfront_distributions_custom_ssl_certificate import (
                cloudfront_distributions_custom_ssl_certificate,
            )

            check = cloudfront_distributions_custom_ssl_certificate()
            result = check.execute()

            assert len(result) == 0

    def test_distribution_default_certificate(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                logging_enabled=True,
                origins=[],
                default_certificate=True,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_custom_ssl_certificate.cloudfront_distributions_custom_ssl_certificate import (
                cloudfront_distributions_custom_ssl_certificate,
            )

            check = cloudfront_distributions_custom_ssl_certificate()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is using the default SSL/TLS certificate."
            )

    def test_distribution_custom_certificate(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {
            DISTRIBUTION_ID: Distribution(
                arn=DISTRIBUTION_ARN,
                id=DISTRIBUTION_ID,
                region=REGION,
                logging_enabled=True,
                origins=[],
                default_certificate=False,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_custom_ssl_certificate.cloudfront_distributions_custom_ssl_certificate import (
                cloudfront_distributions_custom_ssl_certificate,
            )

            check = cloudfront_distributions_custom_ssl_certificate()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} is using a custom SSL/TLS certificate."
            )
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_default_root_object_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudfront/cloudfront_distributions_default_root_object/cloudfront_distributions_default_root_object_test.py

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


class Test_cloudfront_distributions_default_root_object:
    def test_no_distributions(self):
        cloudfront_client = mock.MagicMock
        cloudfront_client.distributions = {}
        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_default_root_object.cloudfront_distributions_default_root_object import (
                cloudfront_distributions_default_root_object,
            )

            check = cloudfront_distributions_default_root_object()
            result = check.execute()

            assert len(result) == 0

    def test_distribution_no_root_object(self):
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
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_default_root_object.cloudfront_distributions_default_root_object import (
                cloudfront_distributions_default_root_object,
            )

            check = cloudfront_distributions_default_root_object()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} does not have a default root object configured."
            )
            assert result[0].resource_tags == []

    def test_distribution_root_object(self):
        cloudfront_client = mock.MagicMock
        dro = "index.html"
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
                default_root_object=dro,
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
            new=cloudfront_client,
        ):
            # Test Check
            from prowler.providers.aws.services.cloudfront.cloudfront_distributions_default_root_object.cloudfront_distributions_default_root_object import (
                cloudfront_distributions_default_root_object,
            )

            check = cloudfront_distributions_default_root_object()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == REGION
            assert result[0].resource_arn == DISTRIBUTION_ARN
            assert result[0].resource_id == DISTRIBUTION_ID
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront Distribution {DISTRIBUTION_ID} does have a default root object ({dro}) configured."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
