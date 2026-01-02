---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 599
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 599 of 867)

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

---[FILE: opensearch_service_domains_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_not_publicly_accessible/opensearch_service_domains_not_publicly_accessible_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_WEST_2,
    set_mocked_aws_provider,
)

domain_name = "test-domain"

policy_data_restricted = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": [f"{AWS_ACCOUNT_NUMBER}"]},
            "Action": ["es:*"],
            "Resource": f"arn:aws:es:us-west-2:{AWS_ACCOUNT_NUMBER}:domain/{domain_name}/*",
        }
    ],
}

policy_data_not_restricted = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": ["*"]},
            "Action": ["es:*"],
            "Resource": f"arn:aws:es:us-west-2:{AWS_ACCOUNT_NUMBER}:domain/{domain_name}/*",
        }
    ],
}

policy_data_not_restricted_principal = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["es:*"],
            "Resource": f"arn:aws:es:us-west-2:{AWS_ACCOUNT_NUMBER}:domain/{domain_name}/*",
        }
    ],
}

policy_data_source_ip_full = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": ["es:ESHttp*"],
            "Condition": {"IpAddress": {"aws:SourceIp": ["*"]}},
            "Resource": f"arn:aws:es:us-west-2:{AWS_ACCOUNT_NUMBER}:domain/{domain_name}/*",
        }
    ],
}

policy_data_source_whole_internet = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": ["es:ESHttp*"],
            "Condition": {"IpAddress": {"aws:SourceIp": ["0.0.0.0/0"]}},
            "Resource": f"arn:aws:es:us-west-2:{AWS_ACCOUNT_NUMBER}:domain/{domain_name}/*",
        }
    ],
}


class Test_opensearch_service_domains_not_publicly_accessible:
    @mock_aws
    def test_no_domains(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible import (
                opensearch_service_domains_not_publicly_accessible,
            )

            check = opensearch_service_domains_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_policy_data_restricted(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_WEST_2)
        domain_arn = opensearch_client.create_domain(
            DomainName=domain_name, AccessPolicies=str(policy_data_restricted)
        )["DomainStatus"]["ARN"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible import (
                opensearch_service_domains_not_publicly_accessible,
            )

            check = opensearch_service_domains_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Opensearch domain {domain_name} is not publicly accessible."
            )
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == domain_arn
            assert result[0].region == AWS_REGION_US_WEST_2
            assert result[0].resource_tags == []

    @mock_aws
    def test_policy_data_not_restricted_with_principal_AWS(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_WEST_2)
        domain_arn = opensearch_client.create_domain(
            DomainName=domain_name, AccessPolicies=dumps(policy_data_not_restricted)
        )["DomainStatus"]["ARN"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible import (
                opensearch_service_domains_not_publicly_accessible,
            )

            check = opensearch_service_domains_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Opensearch domain {domain_name} is publicly accessible via access policy."
            )
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == domain_arn
            assert result[0].region == AWS_REGION_US_WEST_2
            assert result[0].resource_tags == []

    @mock_aws
    def test_policy_data_not_restricted_with_principal_no_AWS(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_WEST_2)
        domain_arn = opensearch_client.create_domain(
            DomainName=domain_name,
            AccessPolicies=dumps(policy_data_not_restricted_principal),
        )["DomainStatus"]["ARN"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible import (
                opensearch_service_domains_not_publicly_accessible,
            )

            check = opensearch_service_domains_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Opensearch domain {domain_name} is publicly accessible via access policy."
            )
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == domain_arn
            assert result[0].region == AWS_REGION_US_WEST_2
            assert result[0].resource_tags == []

    @mock_aws
    def test_policy_data_not_restricted_ip_full(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_WEST_2)
        domain_arn = opensearch_client.create_domain(
            DomainName=domain_name,
            AccessPolicies=dumps(policy_data_source_ip_full),
        )["DomainStatus"]["ARN"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible import (
                opensearch_service_domains_not_publicly_accessible,
            )

            check = opensearch_service_domains_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Opensearch domain {domain_name} is publicly accessible via access policy."
            )
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == domain_arn
            assert result[0].region == AWS_REGION_US_WEST_2
            assert result[0].resource_tags == []

    @mock_aws
    def test_policy_data_not_restricted_whole_internet(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_WEST_2)
        domain_arn = opensearch_client.create_domain(
            DomainName=domain_name,
            AccessPolicies=dumps(policy_data_source_whole_internet),
        )["DomainStatus"]["ARN"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_WEST_2])

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible.opensearch_client",
                new=OpenSearchService(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_not_publicly_accessible.opensearch_service_domains_not_publicly_accessible import (
                opensearch_service_domains_not_publicly_accessible,
            )

            check = opensearch_service_domains_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Opensearch domain {domain_name} is publicly accessible via access policy."
            )
            assert result[0].resource_id == domain_name
            assert result[0].resource_arn == domain_arn
            assert result[0].region == AWS_REGION_US_WEST_2
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_use_cognito_authentication_for_kibana_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_domains_use_cognito_authentication_for_kibana/opensearch_service_domains_use_cognito_authentication_for_kibana_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_opensearch_service_domains_use_cognito_authentication_for_kibana:
    @mock_aws
    def test_no_domains(self):
        client("opensearch", region_name=AWS_REGION_US_EAST_1)

        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_service_domains_use_cognito_authentication_for_kibana import (
                opensearch_service_domains_use_cognito_authentication_for_kibana,
            )

            check = opensearch_service_domains_use_cognito_authentication_for_kibana()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_neither_cognito_nor_saml_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-no-cognito-no-saml",
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_service_domains_use_cognito_authentication_for_kibana import (
                opensearch_service_domains_use_cognito_authentication_for_kibana,
            )

            check = opensearch_service_domains_use_cognito_authentication_for_kibana()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-no-cognito-no-saml has neither Amazon Cognito nor SAML authentication for Kibana enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_cognito_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-cognito",
            CognitoOptions={"Enabled": True},
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_service_domains_use_cognito_authentication_for_kibana import (
                opensearch_service_domains_use_cognito_authentication_for_kibana,
            )

            check = opensearch_service_domains_use_cognito_authentication_for_kibana()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-cognito has either Amazon Cognito or SAML authentication for Kibana enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )

    @mock_aws
    def test_saml_enabled(self):
        opensearch_client = client("opensearch", region_name=AWS_REGION_US_EAST_1)
        domain = opensearch_client.create_domain(
            DomainName="test-domain-saml",
            AdvancedSecurityOptions={"SAMLOptions": {"Enabled": True}},
        )
        from prowler.providers.aws.services.opensearch.opensearch_service import (
            OpenSearchService,
        )

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.opensearch.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_client",
                new=OpenSearchService(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.opensearch.opensearch_service_domains_use_cognito_authentication_for_kibana.opensearch_service_domains_use_cognito_authentication_for_kibana import (
                opensearch_service_domains_use_cognito_authentication_for_kibana,
            )

            check = opensearch_service_domains_use_cognito_authentication_for_kibana()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Opensearch domain test-domain-saml has either Amazon Cognito or SAML authentication for Kibana enabled."
            )
            assert result[0].resource_id == domain["DomainStatus"]["DomainName"]
            assert (
                result[0].resource_arn
                == f"arn:aws:es:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:domain/{domain['DomainStatus']['DomainName']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: organizations_service_test.py]---
Location: prowler-master/tests/providers/aws/services/organizations/organizations_service_test.py

```python
import json

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.organizations.organizations_service import (
    Organizations,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


def scp_restrict_regions_with_deny():
    return '{"Version":"2012-10-17","Statement":{"Effect":"Deny","NotAction":"s3:*","Resource":"*","Condition":{"StringNotEquals":{"aws:RequestedRegion":["eu-central-1"]}}}}'


class Test_Organizations_Service:
    @mock_aws
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        organizations = Organizations(aws_provider)
        assert organizations.service == "organizations"

    @mock_aws
    def test_describe_organization(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1],
        )
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.describe_organization()
        organizations = Organizations(aws_provider)
        assert organizations.organization.arn == response["Organization"]["Arn"]
        assert organizations.organization.id == response["Organization"]["Id"]
        assert (
            organizations.organization.master_id
            == response["Organization"]["MasterAccountId"]
        )
        assert organizations.organization.status == "ACTIVE"
        assert organizations.organization.delegated_administrators == []

    @mock_aws
    def test_list_policies(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.create_policy(
            Content=scp_restrict_regions_with_deny(),
            Description="Test",
            Name="Test",
            Type="SERVICE_CONTROL_POLICY",
        )
        organizations = Organizations(aws_provider)
        for policy in organizations.policies:
            if policy.arn == response["Policy"]["PolicySummary"]["Arn"]:
                assert policy.type == "SERVICE_CONTROL_POLICY"
                assert policy.aws_managed is False
                assert policy.content == json.loads(response["Policy"]["Content"])
                assert policy.targets == []

    @mock_aws
    def test_describe_policy(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.create_policy(
            Content=scp_restrict_regions_with_deny(),
            Description="Test",
            Name="Test",
            Type="SERVICE_CONTROL_POLICY",
        )
        organizations = Organizations(aws_provider)
        policy = organizations._describe_policy(
            response["Policy"]["PolicySummary"]["Id"]
        )
        assert policy == json.loads(response["Policy"]["Content"])
```

--------------------------------------------------------------------------------

---[FILE: organizations_account_part_of_organizations_test.py]---
Location: prowler-master/tests/providers/aws/services/organizations/organizations_account_part_of_organizations/organizations_account_part_of_organizations_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.organizations.organizations_service import (
    Organizations,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_organizations_account_part_of_organizations:
    @mock_aws
    def test_no_organization(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_account_part_of_organizations.organizations_account_part_of_organizations.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_account_part_of_organizations.organizations_account_part_of_organizations import (
                    organizations_account_part_of_organizations,
                )

                check = organizations_account_part_of_organizations()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "AWS Organizations is not in-use for this AWS Account."
                )
                assert result[0].resource_id == "unknown"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations::123456789012:unknown"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_organization(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        # Create Organization
        conn = client("organizations")
        response = conn.describe_organization()
        org_id = response["Organization"]["Id"]

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_account_part_of_organizations.organizations_account_part_of_organizations.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_account_part_of_organizations.organizations_account_part_of_organizations import (
                    organizations_account_part_of_organizations,
                )

                check = organizations_account_part_of_organizations()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"AWS Organization {org_id} contains this AWS account."
                )
                assert result[0].resource_id == response["Organization"]["Id"]
                assert result[0].resource_arn == response["Organization"]["Arn"]
                assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: organizations_delegated_administrators_test.py]---
Location: prowler-master/tests/providers/aws/services/organizations/organizations_delegated_administrators/organizations_delegated_administrators_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.organizations.organizations_service import (
    Organizations,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_organizations_delegated_administrators:
    @mock_aws
    def test_no_organization(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )
        aws_provider._audit_config = {
            "organizations_trusted_delegated_administrators": []
        }
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_delegated_administrators.organizations_delegated_administrators.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_delegated_administrators.organizations_delegated_administrators import (
                    organizations_delegated_administrators,
                )

                check = organizations_delegated_administrators()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_organization_no_delegations(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._audit_config = {
            "organizations_trusted_delegated_administrators": []
        }

        # Create Organization
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.describe_organization()
        org_id = response["Organization"]["Id"]

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_delegated_administrators.organizations_delegated_administrators.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_delegated_administrators.organizations_delegated_administrators import (
                    organizations_delegated_administrators,
                )

                check = organizations_delegated_administrators()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].resource_id == response["Organization"]["Id"]
                assert result[0].resource_arn == response["Organization"]["Arn"]
                assert (
                    result[0].status_extended
                    == f"AWS Organization {org_id} has no Delegated Administrators."
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_organization_trusted_delegated(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        # Create Organization
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.describe_organization()
        # Create Dummy Account
        account = conn.create_account(
            Email="test@test.com",
            AccountName="test",
        )
        # Delegate Administrator
        conn.register_delegated_administrator(
            AccountId=account["CreateAccountStatus"]["AccountId"],
            ServicePrincipal="config-multiaccountsetup.amazonaws.com",
        )
        org_id = response["Organization"]["Id"]
        account_id = account["CreateAccountStatus"]["AccountId"]

        # Set config variable
        aws_provider._audit_config = {
            "organizations_trusted_delegated_administrators": [
                account["CreateAccountStatus"]["AccountId"]
            ]
        }

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_delegated_administrators.organizations_delegated_administrators.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_delegated_administrators.organizations_delegated_administrators import (
                    organizations_delegated_administrators,
                )

                check = organizations_delegated_administrators()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].resource_id == response["Organization"]["Id"]
                assert result[0].resource_arn == response["Organization"]["Arn"]
                assert (
                    result[0].status_extended
                    == f"AWS Organization {org_id} has a trusted Delegated Administrator: {account_id}."
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_organization_untrusted_delegated(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        # Create Organization
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.describe_organization()
        # Create Dummy Account
        account = conn.create_account(
            Email="test@test.com",
            AccountName="test",
        )
        # Delegate Administrator
        conn.register_delegated_administrator(
            AccountId=account["CreateAccountStatus"]["AccountId"],
            ServicePrincipal="config-multiaccountsetup.amazonaws.com",
        )
        org_id = response["Organization"]["Id"]
        account_id = account["CreateAccountStatus"]["AccountId"]

        # Set config variable
        aws_provider._audit_config = {
            "organizations_trusted_delegated_administrators": []
        }

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_delegated_administrators.organizations_delegated_administrators.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_delegated_administrators.organizations_delegated_administrators import (
                    organizations_delegated_administrators,
                )

                check = organizations_delegated_administrators()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].resource_id == response["Organization"]["Id"]
                assert result[0].resource_arn == response["Organization"]["Arn"]
                assert (
                    result[0].status_extended
                    == f"AWS Organization {org_id} has an untrusted Delegated Administrator: {account_id}."
                )
                assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

````
