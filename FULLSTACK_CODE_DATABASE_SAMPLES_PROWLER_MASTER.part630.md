---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 630
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 630 of 867)

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

---[FILE: servicecatalog_portfolio_shared_within_organization_only_test.py]---
Location: prowler-master/tests/providers/aws/services/servicecatalog/servicecatalog_portfolio_shared_within_organization_only/servicecatalog_portfolio_shared_within_organization_only_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.organizations.organizations_service import (
    Organizations,
)
from prowler.providers.aws.services.servicecatalog.servicecatalog_service import (
    ServiceCatalog,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListPortfolios":
        return {
            "PortfolioDetails": [
                {
                    "Id": "portfolio-account-test",
                    "ARN": "arn:aws:servicecatalog:eu-west-1:123456789012:portfolio/portfolio-account-test",
                    "DisplayName": "portfolio-account",
                }
            ],
        }
    elif operation_name == "DescribePortfolioShares":
        return {
            "PortfolioShareDetails": [
                {
                    "Type": "ACCOUNT",
                    "Accepted": True,
                }
            ],
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "ListPortfolios":
        return {
            "PortfolioDetails": [
                {
                    "Id": "portfolio-org-test",
                    "ARN": "arn:aws:servicecatalog:eu-west-1:123456789012:portfolio/portfolio-org-test",
                    "DisplayName": "portfolio-org",
                }
            ],
        }
    elif operation_name == "DescribePortfolioShares":
        if kwarg["type"] == "ACCOUNT":
            return {
                "PortfolioShareDetails": [
                    {
                        "Type": "ORGANIZATION",
                        "Accepted": True,
                    }
                ],
            }
    return make_api_call(self, operation_name, kwarg)


class Test_servicecatalog_portfolio_shared_within_organization_only:
    def test_no_portfolios(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_client",
                new=ServiceCatalog(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only import (
                servicecatalog_portfolio_shared_within_organization_only,
            )

            check = servicecatalog_portfolio_shared_within_organization_only()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_organizations_not_active(self):
        client("servicecatalog", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_client",
                new=ServiceCatalog(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only.organizations_client",
                new=Organizations(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only import (
                servicecatalog_portfolio_shared_within_organization_only,
            )

            check = servicecatalog_portfolio_shared_within_organization_only()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_portfolio_share_account(self):
        client("servicecatalog", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_client",
                new=ServiceCatalog(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only.organizations_client",
                new=Organizations(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only import (
                servicecatalog_portfolio_shared_within_organization_only,
            )

            check = servicecatalog_portfolio_shared_within_organization_only()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ServiceCatalog Portfolio portfolio-account is shared with an account."
            )
            assert result[0].resource_id == "portfolio-account-test"
            assert (
                result[0].resource_arn
                == f"arn:aws:servicecatalog:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:portfolio/portfolio-account-test"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_portfolio_share_organization(self):
        client("servicecatalog", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        conn = client("organizations")
        conn.describe_organization()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_client",
                new=ServiceCatalog(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only.organizations_client",
                new=Organizations(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.servicecatalog.servicecatalog_portfolio_shared_within_organization_only.servicecatalog_portfolio_shared_within_organization_only import (
                servicecatalog_portfolio_shared_within_organization_only,
            )

            check = servicecatalog_portfolio_shared_within_organization_only()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ServiceCatalog Portfolio portfolio-org is shared within your AWS Organization."
            )
            assert result[0].resource_id == "portfolio-org-test"
            assert (
                result[0].resource_arn
                == f"arn:aws:servicecatalog:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:portfolio/portfolio-org-test"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: ses_service_test.py]---
Location: prowler-master/tests/providers/aws/services/ses/ses_service_test.py

```python
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.ses.ses_service import SES
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListEmailIdentities":
        return {
            "EmailIdentities": [
                {
                    "IdentityType": "EMAIL_ADDRESS",
                    "IdentityName": "test-email-identity",
                }
            ],
        }
    elif operation_name == "GetEmailIdentity":
        return {
            "Policies": {
                "policy1": '{"policy1": "value1"}',
            },
            "Tags": {"tag1": "value1", "tag2": "value2"},
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
class Test_SES_Service:
    # Test SES Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        ses = SES(aws_provider)
        assert ses.service == "sesv2"

    # Test SES client
    def test_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        ses = SES(aws_provider)
        for reg_client in ses.regional_clients.values():
            assert reg_client.__class__.__name__ == "SESV2"

    # Test SES session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        ses = SES(aws_provider)
        assert ses.session.__class__.__name__ == "Session"

    @mock_aws
    # Test SES list queues
    def test_list_identities(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        ses = SES(aws_provider)
        arn = f"arn:aws:ses:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:identity/test-email-identity"
        assert ses.email_identities[arn].name == "test-email-identity"
        assert ses.email_identities[arn].type == "EMAIL_ADDRESS"
        assert ses.email_identities[arn].arn == arn
        assert ses.email_identities[arn].region == AWS_REGION_EU_WEST_1
        assert ses.email_identities[arn].policy == {"policy1": "value1"}
        assert ses.email_identities[arn].tags == {"tag1": "value1", "tag2": "value2"}
```

--------------------------------------------------------------------------------

---[FILE: ses_identity_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/ses/ses_identity_not_publicly_accessible/ses_identity_not_publicly_accessible_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.ses.ses_service import SES
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListEmailIdentities":
        return {
            "EmailIdentities": [
                {
                    "IdentityType": "DOMAIN",
                    "IdentityName": "test-email-identity-not-public",
                }
            ],
        }
    elif operation_name == "GetEmailIdentity":
        return {
            "Policies": {
                "policy1": '{"policy1": "value1"}',
            },
            "Tags": {"tag1": "value1", "tag2": "value2"},
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "ListEmailIdentities":
        return {
            "EmailIdentities": [
                {
                    "IdentityType": "EMAIL_ADDRESS",
                    "IdentityName": "test-email-identity-public",
                }
            ],
        }
    elif operation_name == "GetEmailIdentity":
        return {
            "Policies": {
                "policy1": '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"ses:SendEmail","Resource":"*"}]}',
            },
            "Tags": {"tag1": "value1", "tag2": "value2"},
        }
    return make_api_call(self, operation_name, kwarg)


class Test_ses_identities_not_publicly_accessible:
    @mock_aws
    def test_no_identities(self):
        client("sesv2", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ses.ses_identity_not_publicly_accessible.ses_identity_not_publicly_accessible.ses_client",
                new=SES(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ses.ses_identity_not_publicly_accessible.ses_identity_not_publicly_accessible import (
                ses_identity_not_publicly_accessible,
            )

            check = ses_identity_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_email_identity_not_public(self):
        client("sesv2", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ses.ses_identity_not_publicly_accessible.ses_identity_not_publicly_accessible.ses_client",
                new=SES(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ses.ses_identity_not_publicly_accessible.ses_identity_not_publicly_accessible import (
                ses_identity_not_publicly_accessible,
            )

            check = ses_identity_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "SES identity test-email-identity-not-public is not publicly accessible."
            )
            assert result[0].resource_id == "test-email-identity-not-public"
            assert (
                result[0].resource_arn
                == f"arn:aws:ses:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:identity/test-email-identity-not-public"
            )
            assert result[0].resource_tags == {"tag1": "value1", "tag2": "value2"}
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_email_identity_public(self):
        client("sesv2", region_name=AWS_REGION_EU_WEST_1)
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ses.ses_identity_not_publicly_accessible.ses_identity_not_publicly_accessible.ses_client",
                new=SES(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ses.ses_identity_not_publicly_accessible.ses_identity_not_publicly_accessible import (
                ses_identity_not_publicly_accessible,
            )

            check = ses_identity_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "SES identity test-email-identity-public is publicly accessible due to its resource policy."
            )
            assert result[0].resource_id == "test-email-identity-public"
            assert (
                result[0].resource_arn
                == f"arn:aws:ses:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:identity/test-email-identity-public"
            )
            assert result[0].resource_tags == {"tag1": "value1", "tag2": "value2"}
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: shield_service_test.py]---
Location: prowler-master/tests/providers/aws/services/shield/shield_service_test.py

```python
import botocore
from mock import patch

from prowler.providers.aws.services.shield.shield_service import Shield
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "ListProtections":
        return {
            "Protections": [
                {
                    "Id": "a1b2c3d4-5678-90ab-cdef-EXAMPLE11111",
                    "Name": "Protection for CloudFront distribution",
                    "ResourceArn": f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/E198WC25FXOWY8",
                }
            ]
        }
    if operation_name == "GetSubscriptionState":
        return {"SubscriptionState": "ACTIVE"}

    return make_api_call(self, operation_name, kwarg)


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_Shield_Service:
    # Test Shield Service
    def test_service(self):
        # Shield client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        shield = Shield(aws_provider)
        assert shield.service == "shield"

    # Test Shield Client
    def test_client(self):
        # Shield client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        shield = Shield(aws_provider)
        assert shield.client.__class__.__name__ == "Shield"

    # Test Shield Session
    def test__get_session__(self):
        # Shield client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        shield = Shield(aws_provider)
        assert shield.session.__class__.__name__ == "Session"

    def test_get_subscription_state(self):
        # Shield client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        shield = Shield(aws_provider)
        assert shield.enabled

    def test_list_protections(self):
        # Shield client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        shield = Shield(aws_provider)
        protection_id = "a1b2c3d4-5678-90ab-cdef-EXAMPLE11111"
        protection_name = "Protection for CloudFront distribution"
        cloudfront_distribution_id = "E198WC25FXOWY8"
        resource_arn = (
            f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{cloudfront_distribution_id}",
        )

        assert shield.protections
        assert len(shield.protections) == 1
        assert shield.protections[protection_id]
        assert shield.protections[protection_id].id == protection_id
        assert shield.protections[protection_id].name == protection_name
        assert not shield.protections[protection_id].protection_arn
        assert not shield.protections[protection_id].resource_arn == resource_arn
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_associated_elastic_ips_test.py]---
Location: prowler-master/tests/providers/aws/services/shield/shield_advanced_protection_in_associated_elastic_ips/shield_advanced_protection_in_associated_elastic_ips_test.py

```python
from unittest import mock

from boto3 import client
from mock import patch
from moto import mock_aws

from prowler.providers.aws.services.shield.shield_service import Protection
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_shield_advanced_protection_in_associated_elastic_ips:
    @mock_aws
    def test_no_shield_not_active(self):
        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_associated_elastic_ips.shield_advanced_protection_in_associated_elastic_ips.ec2_client",
                new=EC2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_associated_elastic_ips.shield_advanced_protection_in_associated_elastic_ips import (
                shield_advanced_protection_in_associated_elastic_ips,
            )

            check = shield_advanced_protection_in_associated_elastic_ips()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_shield_enabled_ip_protected(self):
        # EC2 Client
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        resp = ec2_client.allocate_address(Domain="vpc", Address="127.38.43.222")
        allocation_id = resp["AllocationId"]
        elastic_ip_arn = f"arn:aws:ec2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:eip-allocation/{allocation_id}"

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        protection_id = "test-protection"
        shield_client.protections = {
            protection_id: Protection(
                id=protection_id,
                name="",
                resource_arn=elastic_ip_arn,
                protection_arn="",
                region=AWS_REGION_EU_WEST_1,
            )
        }

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_associated_elastic_ips.shield_advanced_protection_in_associated_elastic_ips.ec2_client",
                new=EC2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_associated_elastic_ips.shield_advanced_protection_in_associated_elastic_ips import (
                shield_advanced_protection_in_associated_elastic_ips,
            )

            check = shield_advanced_protection_in_associated_elastic_ips()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == allocation_id
            assert result[0].resource_arn == elastic_ip_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Elastic IP {allocation_id} is protected by AWS Shield Advanced."
            )

    @mock_aws
    def test_shield_enabled_ip_not_protected(self):
        # EC2 Client
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        resp = ec2_client.allocate_address(Domain="vpc", Address="127.38.43.222")
        allocation_id = resp["AllocationId"]
        elastic_ip_arn = f"arn:aws:ec2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:eip-allocation/{allocation_id}"

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_associated_elastic_ips.shield_advanced_protection_in_associated_elastic_ips.ec2_client",
                new=EC2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_associated_elastic_ips.shield_advanced_protection_in_associated_elastic_ips import (
                shield_advanced_protection_in_associated_elastic_ips,
            )

            check = shield_advanced_protection_in_associated_elastic_ips()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == allocation_id
            assert result[0].resource_arn == elastic_ip_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Elastic IP {allocation_id} is not protected by AWS Shield Advanced."
            )

    @mock_aws
    def test_shield_disabled_ip_not_protected(self):
        # EC2 Client
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        resp = ec2_client.allocate_address(Domain="vpc", Address="127.38.43.222")
        allocation_id = resp["AllocationId"]
        _ = f"arn:aws:ec2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:eip-allocation/{allocation_id}"

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_associated_elastic_ips.shield_advanced_protection_in_associated_elastic_ips.ec2_client",
                new=EC2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_associated_elastic_ips.shield_advanced_protection_in_associated_elastic_ips import (
                shield_advanced_protection_in_associated_elastic_ips,
            )

            check = shield_advanced_protection_in_associated_elastic_ips()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
