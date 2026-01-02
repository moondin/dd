---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 633
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 633 of 867)

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

---[FILE: sns_topics_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/sns/sns_topics_not_publicly_accessible/sns_topics_not_publicly_accessible_test.py

```python
from typing import Any, Dict
from unittest import mock
from uuid import uuid4

import pytest

from prowler.providers.aws.services.sns.sns_service import Topic
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

kms_key_id = str(uuid4())
topic_name = "test-topic"
org_id = "o-123456"
topic_arn = f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}"
test_policy_restricted = {
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": f"{AWS_ACCOUNT_NUMBER}"},
            "Action": ["sns:Publish"],
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
        }
    ]
}

test_policy_restricted_condition = {
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": ["sns:Publish"],
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
            "Condition": {"StringEquals": {"aws:SourceAccount": AWS_ACCOUNT_NUMBER}},
        }
    ]
}

test_policy_restricted_default_condition = {
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": ["sns:Publish"],
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
            "Condition": {"StringEquals": {"aws:SourceOwner": AWS_ACCOUNT_NUMBER}},
        }
    ]
}

test_policy_not_restricted = {
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": ["sns:Publish"],
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
        }
    ]
}

test_policy_restricted_principal_org_id = {
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": ["sns:Publish"],
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
            "Condition": {"StringEquals": {"aws:PrincipalOrgID": org_id}},
        }
    ]
}

test_policy_restricted_all_org = {
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": ["sns:Publish"],
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
            "Condition": {"StringEquals": {"aws:PrincipalOrgID": "*"}},
        }
    ]
}


test_policy_restricted_principal_account_organization = {
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": ["sns:Publish"],
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
            "Condition": {
                "StringEquals": {
                    "aws:PrincipalOrgID": org_id,
                    "aws:SourceAccount": AWS_ACCOUNT_NUMBER,
                }
            },
        }
    ]
}

test_policy_restricted_source_arn = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": "SNS:Publish",
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
            "Condition": {
                "ArnLike": {"aws:SourceArn": "arn:aws:s3:::test-bucket-name"}
            },
        }
    ],
}

test_policy_invalid_source_arn = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": "SNS:Publish",
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
            "Condition": {"ArnLike": {"aws:SourceArn": "invalid-arn-format"}},
        }
    ],
}

test_policy_unrestricted_source_arn_wildcard = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": "SNS:Publish",
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
            "Condition": {"ArnLike": {"aws:SourceArn": "*"}},
        }
    ],
}

test_policy_unrestricted_source_arn_service_wildcard = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": "SNS:Publish",
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
            "Condition": {"ArnLike": {"aws:SourceArn": "arn:aws:s3:::*"}},
        }
    ],
}

test_policy_unrestricted_source_arn_multi_wildcard = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": "SNS:Publish",
            "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
            "Condition": {"ArnLike": {"aws:SourceArn": "arn:aws:*:*:*:*"}},
        }
    ],
}


def generate_policy_restricted_on_sns_endpoint(endpoint: str) -> Dict[str, Any]:
    return {
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"AWS": "*"},
                "Action": ["sns:Publish"],
                "Resource": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
                "Condition": {"StringEquals": {"SNS:Endpoint": endpoint}},
            }
        ]
    }


class Test_sns_topics_not_publicly_accessible:
    def test_no_topics(self):
        sns_client = mock.MagicMock
        sns_client.topics = []
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    def test_topic_not_public(self):
        sns_client = mock.MagicMock
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_restricted,
                region=AWS_REGION_EU_WEST_1,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is not publicly accessible."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_no_policy(self):
        sns_client = mock.MagicMock
        sns_client.topics = []
        sns_client.topics.append(
            Topic(arn=topic_arn, name=topic_name, region=AWS_REGION_EU_WEST_1)
        )

        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is not publicly accessible."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public_with_condition(self):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_restricted_condition,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is not public because its policy only allows access from the account {AWS_ACCOUNT_NUMBER}."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public_with_default_condition(self):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_restricted_default_condition,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is not public because its policy only allows access from the account {AWS_ACCOUNT_NUMBER}."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public(self):
        sns_client = mock.MagicMock
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_policy_not_restricted,
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is public because its policy allows public access."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public_with_principal_organization(self):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_restricted_principal_org_id,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.provider = mock.MagicMock()
        sns_client.provider.organizations_metadata = mock.MagicMock()
        sns_client.provider.organizations_metadata.organization_id = org_id
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is not public because its policy only allows access from an organization."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public_not_with_principal_organization(self):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_restricted_all_org,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.provider = mock.MagicMock()
        sns_client.provider.organizations_metadata = mock.MagicMock()
        sns_client.provider.organizations_metadata.organization_id = org_id
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is public because its policy allows public access."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public_with_principal_account_and_organization(self):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_restricted_principal_account_organization,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.provider = mock.MagicMock()
        sns_client.provider.organizations_metadata = mock.MagicMock()
        sns_client.provider.organizations_metadata.organization_id = org_id
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is not public because its policy only allows access from the account {AWS_ACCOUNT_NUMBER} and an organization."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public_with_source_arn_restriction(self):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_restricted_source_arn,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.provider = mock.MagicMock()
        sns_client.provider.organizations_metadata = mock.MagicMock()
        sns_client.provider.organizations_metadata.organization_id = org_id
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is not publicly accessible."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public_with_invalid_source_arn(self):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_invalid_source_arn,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.provider = mock.MagicMock()
        sns_client.provider.organizations_metadata = mock.MagicMock()
        sns_client.provider.organizations_metadata.organization_id = org_id
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is not publicly accessible."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @pytest.mark.parametrize(
        "endpoint",
        [
            ("*@example.com"),
            ("user@example.com"),
            ("https://events.pagerduty.com/integration/987654321/enqueue"),
            (
                "arn:aws:sns:eu-west-2:123456789012:example-topic:995be20c-a7e3-44ca-8c18-77cb263d15e7"
            ),
        ],
    )
    def test_topic_public_with_sns_endpoint(self, endpoint: str):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=generate_policy_restricted_on_sns_endpoint(endpoint=endpoint),
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.provider = mock.MagicMock()
        sns_client.provider.organizations_metadata = mock.MagicMock()
        sns_client.provider.organizations_metadata.organization_id = org_id
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is not public because its policy only allows access from an endpoint."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public_with_unrestricted_source_arn_wildcard(self):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_unrestricted_source_arn_wildcard,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.provider = mock.MagicMock()
        sns_client.provider.organizations_metadata = mock.MagicMock()
        sns_client.provider.organizations_metadata.organization_id = org_id
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is public because its policy allows public access."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public_with_unrestricted_source_arn_service_wildcard(self):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_unrestricted_source_arn_service_wildcard,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.provider = mock.MagicMock()
        sns_client.provider.organizations_metadata = mock.MagicMock()
        sns_client.provider.organizations_metadata.organization_id = org_id
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is public because its policy allows public access."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    def test_topic_public_with_unrestricted_source_arn_multi_wildcard(self):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=test_policy_unrestricted_source_arn_multi_wildcard,
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.provider = mock.MagicMock()
        sns_client.provider.organizations_metadata = mock.MagicMock()
        sns_client.provider.organizations_metadata.organization_id = org_id
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is public because its policy allows public access."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @pytest.mark.parametrize(
        "endpoint",
        [
            ("*@*"),
            ("https://events.pagerduty.com/integration/*/enqueue"),
            ("arn:aws:sns:eu-west-2:*:example-topic:*"),
        ],
    )
    def test_topic_public_with_unrestricted_sns_endpoint(self, endpoint: str):
        sns_client = mock.MagicMock
        sns_client.audited_account = AWS_ACCOUNT_NUMBER
        sns_client.topics = []
        sns_client.topics.append(
            Topic(
                arn=topic_arn,
                name=topic_name,
                policy=generate_policy_restricted_on_sns_endpoint(endpoint=endpoint),
                region=AWS_REGION_EU_WEST_1,
            )
        )
        sns_client.provider = mock.MagicMock()
        sns_client.provider.organizations_metadata = mock.MagicMock()
        sns_client.provider.organizations_metadata.organization_id = org_id
        with mock.patch(
            "prowler.providers.aws.services.sns.sns_service.SNS",
            sns_client,
        ):
            from prowler.providers.aws.services.sns.sns_topics_not_publicly_accessible.sns_topics_not_publicly_accessible import (
                sns_topics_not_publicly_accessible,
            )

            check = sns_topics_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SNS topic {topic_name} is public because its policy allows public access."
            )
            assert result[0].resource_id == topic_name
            assert result[0].resource_arn == topic_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: sqs_service_test.py]---
Location: prowler-master/tests/providers/aws/services/sqs/sqs_service_test.py

```python
from json import dumps
from unittest.mock import patch
from uuid import uuid4

import botocore
from boto3 import client
from botocore.exceptions import ClientError
from moto import mock_aws

from prowler.providers.aws.services.sqs.sqs_service import SQS
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_queue = "test-queue"
test_key = str(uuid4())
test_queue_arn = f"arn:aws:sqs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{test_queue}"
test_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": "sqs:SendMessage",
            "Resource": test_queue_arn,
        }
    ],
}

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "GetQueueAttributes":
        return {
            "Attributes": {"Policy": dumps(test_policy), "KmsMasterKeyId": test_key}
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
class Test_SQS_Service:
    # Test SQS Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sqs = SQS(aws_provider)
        assert sqs.service == "sqs"

    # Test SQS client
    def test_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sqs = SQS(aws_provider)
        for reg_client in sqs.regional_clients.values():
            assert reg_client.__class__.__name__ == "SQS"

    # Test SQS session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sqs = SQS(aws_provider)
        assert sqs.session.__class__.__name__ == "Session"

    @mock_aws
    # Test SQS list queues
    def test_list_queues(self):
        sqs_client = client("sqs", region_name=AWS_REGION_EU_WEST_1)
        queue = sqs_client.create_queue(QueueName=test_queue, tags={"test": "test"})
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sqs = SQS(aws_provider)
        assert len(sqs.queues) == 1
        assert sqs.queues[0].id == queue["QueueUrl"]
        assert sqs.queues[0].name == test_queue
        assert sqs.queues[0].name == sqs.queues[0].arn.split(":")[-1]
        assert sqs.queues[0].name == sqs.queues[0].id.split("/")[-1]
        assert sqs.queues[0].arn == test_queue_arn
        assert sqs.queues[0].region == AWS_REGION_EU_WEST_1
        assert sqs.queues[0].tags == [{"test": "test"}]

    # moto does not properly mock this and is hardcoded to return 1000 queues
    # so this test currently always fails
    # @mock_aws
    # # Test SQS list queues for over 1000 queues
    # def test_list_queuespagination_over_a_thousand(self):
    #     sqs_client = client("sqs", region_name=AWS_REGION_EU_WEST_1)
    #     for i in range(0,1050):
    #         sqs_client.create_queue(QueueName=f"{test_queue}-{i}", tags={"test": "test"})
    #     aws_provider =set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
    #     sqs = SQS(aws_provider)
    #     assert len(sqs.queues) > 1000

    @mock_aws
    # Test SQS list queues
    def test_get_queue_attributes(self):
        sqs_client = client("sqs", region_name=AWS_REGION_EU_WEST_1)
        queue = sqs_client.create_queue(
            QueueName=test_queue,
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sqs = SQS(aws_provider)
        assert len(sqs.queues) == 1
        assert sqs.queues[0].id == queue["QueueUrl"]
        assert sqs.queues[0].region == AWS_REGION_EU_WEST_1
        assert sqs.queues[0].policy
        assert sqs.queues[0].kms_key_id == test_key

    @mock_aws
    def test_get_queue_attributes_nonexistent_queue(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        sqs_service = SQS(aws_provider)

        queue_url = f"https://sqs.{AWS_REGION_EU_WEST_1}.amazonaws.com/{AWS_ACCOUNT_NUMBER}/{test_queue}"
        sqs_service.queues = [
            type(
                "Queue",
                (),
                {
                    "id": queue_url,
                    "name": test_queue,
                    "arn": test_queue_arn,
                    "region": AWS_REGION_EU_WEST_1,
                },
            )()
        ]

        def mock_get_queue_attributes(**kwargs):
            raise ClientError(
                {
                    "Error": {
                        "Code": "AWS.SimpleQueueService.NonExistentQueue",
                        "Message": "The specified queue does not exist.",
                    }
                },
                "GetQueueAttributes",
            )

        with patch.object(
            sqs_service.regional_clients[AWS_REGION_EU_WEST_1],
            "get_queue_attributes",
            side_effect=mock_get_queue_attributes,
        ):
            sqs_service._get_queue_attributes()

        assert sqs_service.queues == []
```

--------------------------------------------------------------------------------

---[FILE: sqs_queues_not_publicly_accessible_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/sqs/sqs_queues_not_publicly_accessible/sqs_queues_not_publicly_accessible_fixer_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_sqs_queues_not_publicly_accessible_fixer:
    @mock_aws
    def test_queue_public(self):
        sqs_client = client("sqs", region_name=AWS_REGION_EU_WEST_1)

        queue_url = sqs_client.create_queue(QueueName="test-queue")["QueueUrl"]

        sqs_client.set_queue_attributes(
            QueueUrl=queue_url,
            Attributes={
                "Policy": dumps({"Statement": [{"Effect": "Allow", "Principal": "*"}]})
            },
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.sqs.sqs_service import SQS

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible_fixer.sqs_client",
                new=SQS(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible_fixer import (
                fixer,
            )

            assert fixer(queue_url, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_queue_public_with_aws(self):
        sqs_client = client("sqs", region_name=AWS_REGION_EU_WEST_1)

        queue_url = sqs_client.create_queue(QueueName="test-queue")["QueueUrl"]

        sqs_client.set_queue_attributes(
            QueueUrl=queue_url,
            Attributes={
                "Policy": dumps(
                    {"Statement": [{"Effect": "Allow", "Principal": {"AWS": "*"}}]}
                )
            },
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.sqs.sqs_service import SQS

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible_fixer.sqs_client",
                new=SQS(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible_fixer import (
                fixer,
            )

            assert fixer(queue_url, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_queue_public_error(self):
        sqs_client = client("sqs", region_name=AWS_REGION_EU_WEST_1)

        queue_url = sqs_client.create_queue(QueueName="test-queue")["QueueUrl"]

        sqs_client.set_queue_attributes(
            QueueUrl=queue_url,
            Attributes={
                "Policy": dumps(
                    {"Statement": [{"Effect": "Allow", "Principal": {"AWS": "*"}}]}
                )
            },
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.sqs.sqs_service import SQS

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible_fixer.sqs_client",
                new=SQS(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible_fixer import (
                fixer,
            )

            assert not fixer("queue_url_non_existing", AWS_REGION_EU_WEST_1)
```

--------------------------------------------------------------------------------

````
