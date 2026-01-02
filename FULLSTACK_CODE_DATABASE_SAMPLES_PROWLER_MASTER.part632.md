---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 632
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 632 of 867)

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

---[FILE: shield_advanced_protection_in_route53_hosted_zones_test.py]---
Location: prowler-master/tests/providers/aws/services/shield/shield_advanced_protection_in_route53_hosted_zones/shield_advanced_protection_in_route53_hosted_zones_test.py

```python
from unittest import mock

from prowler.providers.aws.services.route53.route53_service import HostedZone
from prowler.providers.aws.services.shield.shield_service import Protection
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1


class Test_shield_advanced_protection_in_route53_hosted_zones:
    def test_no_shield_not_active(self):
        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False
        # Route53 Client
        route53_client = mock.MagicMock
        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.route53.route53_service.Route53",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_route53_hosted_zones.shield_advanced_protection_in_route53_hosted_zones.route53_client",
                new=route53_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_route53_hosted_zones.shield_advanced_protection_in_route53_hosted_zones import (
                shield_advanced_protection_in_route53_hosted_zones,
            )

            check = shield_advanced_protection_in_route53_hosted_zones()
            result = check.execute()

            assert len(result) == 0

    def test_shield_enabled_route53_hosted_zone_protected(self):
        # Route53 Client
        route53_client = mock.MagicMock
        hosted_zone_id = "ABCDEF12345678"
        hosted_zone_arn = f"arn:aws:route53:::hostedzone/{hosted_zone_id}"
        hosted_zone_name = "test-hosted-zone"

        route53_client.hosted_zones = {
            hosted_zone_id: HostedZone(
                id=hosted_zone_id,
                arn=hosted_zone_arn,
                name=hosted_zone_name,
                hosted_zone_name=hosted_zone_name,
                private_zone=False,
                region=AWS_REGION_EU_WEST_1,
            )
        }

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        protection_id = "test-protection"
        shield_client.protections = {
            protection_id: Protection(
                id=protection_id,
                name="",
                resource_arn=hosted_zone_arn,
                protection_arn="",
                region=AWS_REGION_EU_WEST_1,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.route53.route53_service.Route53",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_route53_hosted_zones.shield_advanced_protection_in_route53_hosted_zones.route53_client",
                new=route53_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_route53_hosted_zones.shield_advanced_protection_in_route53_hosted_zones import (
                shield_advanced_protection_in_route53_hosted_zones,
            )

            check = shield_advanced_protection_in_route53_hosted_zones()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == hosted_zone_id
            assert result[0].resource_arn == hosted_zone_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Route53 Hosted Zone {hosted_zone_id} is protected by AWS Shield Advanced."
            )

    def test_shield_enabled_route53_hosted_zone_not_protected(self):
        # Route53 Client
        route53_client = mock.MagicMock
        hosted_zone_id = "ABCDEF12345678"
        hosted_zone_arn = f"arn:aws:route53:::hostedzone/{hosted_zone_id}"
        hosted_zone_name = "test-hosted-zone"

        route53_client.hosted_zones = {
            hosted_zone_id: HostedZone(
                id=hosted_zone_id,
                arn=hosted_zone_arn,
                name=hosted_zone_name,
                hosted_zone_name=hosted_zone_name,
                private_zone=False,
                region=AWS_REGION_EU_WEST_1,
            )
        }

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.route53.route53_service.Route53",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_route53_hosted_zones.shield_advanced_protection_in_route53_hosted_zones.route53_client",
                new=route53_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_route53_hosted_zones.shield_advanced_protection_in_route53_hosted_zones import (
                shield_advanced_protection_in_route53_hosted_zones,
            )

            check = shield_advanced_protection_in_route53_hosted_zones()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == hosted_zone_id
            assert result[0].resource_arn == hosted_zone_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Route53 Hosted Zone {hosted_zone_id} is not protected by AWS Shield Advanced."
            )

    def test_shield_disabled_route53_hosted_zone_not_protected(self):
        # Route53 Client
        route53_client = mock.MagicMock
        hosted_zone_id = "ABCDEF12345678"
        hosted_zone_arn = f"arn:aws:route53:::hostedzone/{hosted_zone_id}"
        hosted_zone_name = "test-hosted-zone"

        route53_client.hosted_zones = {
            hosted_zone_id: HostedZone(
                id=hosted_zone_id,
                arn=hosted_zone_arn,
                name=hosted_zone_name,
                hosted_zone_name=hosted_zone_name,
                private_zone=False,
                region=AWS_REGION_EU_WEST_1,
            )
        }

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.route53.route53_service.Route53",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_route53_hosted_zones.shield_advanced_protection_in_route53_hosted_zones.route53_client",
                new=route53_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_route53_hosted_zones.shield_advanced_protection_in_route53_hosted_zones import (
                shield_advanced_protection_in_route53_hosted_zones,
            )

            check = shield_advanced_protection_in_route53_hosted_zones()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: sns_service_test.py]---
Location: prowler-master/tests/providers/aws/services/sns/sns_service_test.py

```python
from json import dumps
from unittest.mock import patch
from uuid import uuid4

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.sns.sns_service import SNS
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

topic_name = "test-topic"
test_policy = {
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": f"{AWS_ACCOUNT_NUMBER}"},
            "Action": ["sns:Publish"],
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
        }
    ]
}
kms_key_id = str(uuid4())

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "GetTopicAttributes":
        return {
            "Attributes": {"Policy": dumps(test_policy), "KmsMasterKeyId": kms_key_id}
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
class Test_SNS_Service:
    # Test SNS Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sns = SNS(aws_provider)
        assert sns.service == "sns"

    # Test SNS client
    def test_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sns = SNS(aws_provider)
        for reg_client in sns.regional_clients.values():
            assert reg_client.__class__.__name__ == "SNS"

    # Test SNS session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sns = SNS(aws_provider)
        assert sns.session.__class__.__name__ == "Session"

    @mock_aws
    # Test SNS session
    def test_list_topics(self):
        sns_client = client("sns", region_name=AWS_REGION_EU_WEST_1)
        sns_client.create_topic(
            Name=topic_name,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sns = SNS(aws_provider)

        assert len(sns.topics) == 1
        assert sns.topics[0].name == topic_name
        assert (
            sns.topics[0].arn
            == f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}"
        )
        assert sns.topics[0].region == AWS_REGION_EU_WEST_1
        assert sns.topics[0].tags == [
            {"Key": "test", "Value": "test"},
        ]

    @mock_aws
    # Test SNS session
    def test_get_topic_attributes(self):
        sns_client = client("sns", region_name=AWS_REGION_EU_WEST_1)
        sns_client.create_topic(Name=topic_name)

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sns = SNS(aws_provider)

        assert len(sns.topics) == 1
        assert (
            sns.topics[0].arn
            == f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}"
        )
        assert sns.topics[0].region == AWS_REGION_EU_WEST_1
        assert sns.topics[0].policy
        assert sns.topics[0].kms_master_key_id == kms_key_id

    @mock_aws
    def test_list_subscriptions_by_topic(self):
        sns_client = client("sns", region_name=AWS_REGION_EU_WEST_1)
        topic_response = sns_client.create_topic(Name=topic_name)
        topic_arn = topic_response["TopicArn"]

        # Create subscriptions for the topic
        sns_client.subscribe(
            TopicArn=topic_arn, Protocol="http", Endpoint="http://www.endpoint.com"
        )
        sns_client.subscribe(
            TopicArn=topic_arn, Protocol="https", Endpoint="https://www.endpoint.com"
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sns = SNS(aws_provider)

        assert len(sns.topics) == 1
        assert sns.topics[0].arn == topic_arn
        assert len(sns.topics[0].subscriptions) == 2
        assert sns.topics[0].subscriptions[0].protocol == "http"
        assert sns.topics[0].subscriptions[1].protocol == "https"
        assert sns.topics[0].subscriptions[0].endpoint == "http://www.endpoint.com"
        assert sns.topics[0].subscriptions[1].endpoint == "https://www.endpoint.com"
```

--------------------------------------------------------------------------------

---[FILE: sns_subscription_not_using_http_endpoints_test.py]---
Location: prowler-master/tests/providers/aws/services/sns/sns_subscription_not_using_http_endpoints/sns_subscription_not_using_http_endpoints_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sns.sns_service import Subscription, Topic
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

kms_key_id = str(uuid4())
topic_name = "test-topic"
topic_arn = f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}"
subscription_id_1 = str(uuid4())
subscription_id_2 = str(uuid4())
subscription_arn_1 = f"{topic_arn}:{subscription_id_1}"
subscription_arn_2 = f"{topic_arn}:{subscription_id_2}"


class Test_sns_subscription_not_using_http_endpoints:
    def test_no_topics(self):
        sns_client = mock.MagicMock
        sns_client.topics = []
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_subscription_not_using_http_endpoints.sns_subscription_not_using_http_endpoints import (
                sns_subscription_not_using_http_endpoints,
            )

            check = sns_subscription_not_using_http_endpoints()
            result = check.execute()
            assert len(result) == 0

    def test_no_subscriptions(self):
        sns_client = mock.MagicMock
        subscriptions = []
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                kms_master_key_id=kms_key_id,
                region=AWS_REGION_EU_WEST_1,
                subscriptions=subscriptions,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_subscription_not_using_http_endpoints.sns_subscription_not_using_http_endpoints import (
                sns_subscription_not_using_http_endpoints,
            )

            check = sns_subscription_not_using_http_endpoints()
            result = check.execute()
            assert len(result) == 0

    def test_subscriptions_with_pending_confirmation(self):
        sns_client = mock.MagicMock
        subscriptions = []
        subscriptions.append(
            Subscription(
                id="PendingConfirmation",
                arn="PendingConfirmation",
                owner=AWS_ACCOUNT_NUMBER,
                protocol="https",
                endpoint="https://www.endpoint.com",
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                kms_master_key_id=kms_key_id,
                region=AWS_REGION_EU_WEST_1,
                subscriptions=subscriptions,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_subscription_not_using_http_endpoints.sns_subscription_not_using_http_endpoints import (
                sns_subscription_not_using_http_endpoints,
            )

            check = sns_subscription_not_using_http_endpoints()
            result = check.execute()
            assert len(result) == 0

    def test_subscriptions_with_https(self):
        sns_client = mock.MagicMock
        subscriptions = []
        subscriptions.append(
            Subscription(
                id=subscription_id_1,
                arn=subscription_arn_1,
                owner=AWS_ACCOUNT_NUMBER,
                protocol="https",
                endpoint="https://www.endpoint.com",
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                kms_master_key_id=kms_key_id,
                region=AWS_REGION_EU_WEST_1,
                subscriptions=subscriptions,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_subscription_not_using_http_endpoints.sns_subscription_not_using_http_endpoints import (
                sns_subscription_not_using_http_endpoints,
            )

            check = sns_subscription_not_using_http_endpoints()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Subscription {subscription_arn_1} is using an HTTPS endpoint."
            )
            assert result[0].resource_id == subscription_id_1
            assert result[0].resource_arn == subscription_arn_1
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_subscriptions_with_http(self):
        sns_client = mock.MagicMock
        subscriptions = []
        subscriptions.append(
            Subscription(
                id=subscription_id_2,
                arn=subscription_arn_2,
                owner=AWS_ACCOUNT_NUMBER,
                protocol="http",
                endpoint="http://www.endpoint.com",
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                kms_master_key_id=kms_key_id,
                region=AWS_REGION_EU_WEST_1,
                subscriptions=subscriptions,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_subscription_not_using_http_endpoints.sns_subscription_not_using_http_endpoints import (
                sns_subscription_not_using_http_endpoints,
            )

            check = sns_subscription_not_using_http_endpoints()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Subscription {subscription_arn_2} is using an HTTP endpoint."
            )
            assert result[0].resource_id == subscription_id_2
            assert result[0].resource_arn == subscription_arn_2
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_subscriptions_with_http_and_https(self):
        sns_client = mock.MagicMock
        subscriptions = []
        subscriptions.append(
            Subscription(
                id=subscription_id_1,
                arn=subscription_arn_1,
                owner=AWS_ACCOUNT_NUMBER,
                protocol="https",
                endpoint="https://www.endpoint.com",
                region=AWS_REGION_EU_WEST_1,
            )
        )
        subscriptions.append(
            Subscription(
                id=subscription_id_2,
                arn=subscription_arn_2,
                owner=AWS_ACCOUNT_NUMBER,
                protocol="http",
                endpoint="http://www.endpoint.com",
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                kms_master_key_id=kms_key_id,
                region=AWS_REGION_EU_WEST_1,
                subscriptions=subscriptions,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_subscription_not_using_http_endpoints.sns_subscription_not_using_http_endpoints import (
                sns_subscription_not_using_http_endpoints,
            )

            check = sns_subscription_not_using_http_endpoints()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Subscription {subscription_arn_1} is using an HTTPS endpoint."
            )
            assert result[0].resource_id == subscription_id_1
            assert result[0].resource_arn == subscription_arn_1
            assert result[0].region == AWS_REGION_EU_WEST_1

            assert result[1].status == "FAIL"
            assert (
                result[1].status_extended
                == f"Subscription {subscription_arn_2} is using an HTTP endpoint."
            )
            assert result[1].resource_id == subscription_id_2
            assert result[1].resource_arn == subscription_arn_2
            assert result[1].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: sns_topics_kms_encryption_at_rest_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/sns/sns_topics_kms_encryption_at_rest_enabled/sns_topics_kms_encryption_at_rest_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sns.sns_service import Topic
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

kms_key_id = str(uuid4())
topic_name = "test-topic"
topic_arn = f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}"


class Test_sns_topics_kms_encryption_at_rest_enabled:
    def test_no_topics(self):
        sns_client = mock.MagicMock
        sns_client.topics = []
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_kms_encryption_at_rest_enabled.sns_topics_kms_encryption_at_rest_enabled import (
                sns_topics_kms_encryption_at_rest_enabled,
            )

            check = sns_topics_kms_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_topics_with_key(self):
        sns_client = mock.MagicMock
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                kms_master_key_id=kms_key_id,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_kms_encryption_at_rest_enabled.sns_topics_kms_encryption_at_rest_enabled import (
                sns_topics_kms_encryption_at_rest_enabled,
            )

            check = sns_topics_kms_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == f"SNS topic {topic_name} is encrypted."
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn

    def test_topics_no_key(self):
        sns_client = mock.MagicMock
        sns_client.topics = []
        sns_client.topics.append(
            Topic(arn=topic_arn, name=topic_name, region=AWS_REGION_EU_WEST_1)
        )
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_kms_encryption_at_rest_enabled.sns_topics_kms_encryption_at_rest_enabled import (
                sns_topics_kms_encryption_at_rest_enabled,
            )

            check = sns_topics_kms_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended == f"SNS topic {topic_name} is not encrypted."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
```

--------------------------------------------------------------------------------

````
