---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 489
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 489 of 867)

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

---[FILE: cognito_service_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_service_test.py

```python
import mock
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.cognito.cognito_service import (
    AccountTakeoverRiskConfiguration,
    CognitoIdentity,
    CognitoIDP,
    CompromisedCredentialsRiskConfiguration,
    IdentityPoolRoles,
    RiskConfiguration,
    UserPoolClient,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_Cognito_Service:
    # Test Cognito Service
    @mock_aws
    def test_service_idp(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito = CognitoIDP(aws_provider)
        assert cognito.service == "cognito-idp"

    # Test Cognito client
    @mock_aws
    def test_client_idp(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito = CognitoIDP(aws_provider)
        for regional_client in cognito.regional_clients.values():
            assert regional_client.__class__.__name__ == "CognitoIdentityProvider"

    # Test Cognito session
    @mock_aws
    def test__get_session_idp__(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito = CognitoIDP(aws_provider)
        assert cognito.session.__class__.__name__ == "Session"

    # Test Cognito Session
    @mock_aws
    def test_audited_account_idp(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito = CognitoIDP(aws_provider)
        assert cognito.audited_account == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_list_user_pools(self):
        user_pool_name_1 = "user_pool_test_1"
        user_pool_name_2 = "user_pool_test_2"
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito_client_eu_west_1 = client("cognito-idp", region_name="eu-west-1")
        cognito_client_us_east_1 = client("cognito-idp", region_name="us-east-1")
        cognito_client_eu_west_1.create_user_pool(PoolName=user_pool_name_1)
        cognito_client_us_east_1.create_user_pool(PoolName=user_pool_name_2)
        cognito = CognitoIDP(aws_provider)
        assert len(cognito.user_pools) == 2
        for user_pool in cognito.user_pools.values():
            assert (
                user_pool.name == user_pool_name_1 or user_pool.name == user_pool_name_2
            )
            assert user_pool.region == "eu-west-1" or user_pool.region == "us-east-1"

    @mock_aws
    def test_describe_user_pools(self):
        user_pool_name_1 = "user_pool_test_1"
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito_client_eu_west_1 = client("cognito-idp", region_name="eu-west-1")
        user_pool_id = cognito_client_eu_west_1.create_user_pool(
            PoolName=user_pool_name_1
        )["UserPool"]["Id"]
        cognito = CognitoIDP(aws_provider)
        assert len(cognito.user_pools) == 1
        for user_pool in cognito.user_pools.values():
            assert user_pool.name == user_pool_name_1
            assert user_pool.region == "eu-west-1"
            assert user_pool.id == user_pool_id
            assert user_pool.password_policy is not None
            assert user_pool.deletion_protection is not None
            assert user_pool.advanced_security_mode is not None
            assert user_pool.tags is not None
            assert user_pool.account_recovery_settings is not None
            assert user_pool.tags is not None

    @mock_aws
    def test_list_user_pool_clients(self):
        cognito_client = mock.MagicMock()
        user_pool_arn = "user_pool_test_1"
        cognito_client[user_pool_arn].id = "user_pool_id"
        cognito_client[user_pool_arn].arn = user_pool_arn
        cognito_client[user_pool_arn].name = "user_pool_name"
        cognito_client[user_pool_arn].region = "eu-west-1"
        cognito_client[user_pool_arn].user_pool_clients["user_pool_client_id"] = (
            UserPoolClient(
                id="user_pool_client_id",
                name="user_pool_client_name",
                arn=f"{user_pool_arn}/client/user_pool_client_id",
                region="eu-west-1",
            )
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            for user_pool in cognito_client.user_pools.values():
                assert user_pool.region == "eu-west-1"
                assert user_pool.name == "user_pool_name"
                assert user_pool.id == "user_pool_id"
                assert (
                    user_pool.user_pool_clients["user_pool_client_id"].id
                    == "user_pool_client_id"
                )
                assert (
                    user_pool.user_pool_clients["user_pool_client_id"].name
                    == "user_pool_client_name"
                )
                assert (
                    user_pool.user_pool_clients["user_pool_client_id"].region
                    == "eu-west-1"
                )
                assert (
                    user_pool.user_pool_clients["user_pool_client_id"].arn
                    == f"{user_pool_arn}/client/user_pool_client_id"
                )

    @mock_aws
    def test_describe_user_pool_clients(self):
        cognito_client = mock.MagicMock()
        user_pool_arn = "user_pool_test_1"
        cognito_client[user_pool_arn].id = "user_pool_id"
        cognito_client[user_pool_arn].arn = user_pool_arn
        cognito_client[user_pool_arn].name = "user_pool_name"
        cognito_client[user_pool_arn].region = "eu-west-1"
        cognito_client[user_pool_arn].user_pool_clients["user_pool_client_id"] = (
            UserPoolClient(
                id="user_pool_client_id",
                name="user_pool_client_name",
                region="eu-west-1",
                arn=f"{user_pool_arn}/client/user_pool_client_id",
                prevent_user_existence_errors="ENABLED",
                enable_token_revocation=True,
            )
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            for user_pool in cognito_client.user_pools.values():
                assert user_pool.region == "eu-west-1"
                assert user_pool.name == "user_pool_name"
                assert user_pool.id == "user_pool_id"
                assert (
                    user_pool.user_pool_clients["user_pool_client_id"].id
                    == "user_pool_client_id"
                )
                assert (
                    user_pool.user_pool_clients["user_pool_client_id"].name
                    == "user_pool_client_name"
                )
                assert (
                    user_pool.user_pool_clients["user_pool_client_id"].region
                    == "eu-west-1"
                )
                assert (
                    user_pool.user_pool_clients["user_pool_client_id"].arn
                    == f"{user_pool_arn}/client/user_pool_client_id"
                )
                assert (
                    user_pool.user_pool_clients[
                        "user_pool_client_id"
                    ].prevent_user_existence_errors
                    == "ENABLED"
                )
                assert (
                    user_pool.user_pool_clients[
                        "user_pool_client_id"
                    ].enable_token_revocation
                    is True
                )

    @mock_aws
    def test_get_user_pool_mfa_config(self):
        user_pool_name_1 = "user_pool_test_1"
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito_client_eu_west_1 = client("cognito-idp", region_name="eu-west-1")
        user_pool_id = cognito_client_eu_west_1.create_user_pool(
            PoolName=user_pool_name_1
        )["UserPool"]["Id"]
        cognito_client_eu_west_1.set_user_pool_mfa_config(
            UserPoolId=user_pool_id,
            SoftwareTokenMfaConfiguration={"Enabled": True},
            MfaConfiguration="ON",
        )
        cognito = CognitoIDP(aws_provider)
        assert len(cognito.user_pools) == 1
        for user_pool in cognito.user_pools.values():
            assert user_pool.name == user_pool_name_1
            assert user_pool.region == "eu-west-1"
            assert user_pool.id == user_pool_id
            assert user_pool.mfa_config is not None
            assert user_pool.mfa_config.sms_authentication == {}
            assert user_pool.mfa_config.software_token_mfa_authentication == {
                "Enabled": True
            }
            assert user_pool.mfa_config.status == "ON"

    def test_get_user_pool_risk_configuration(self):
        cognito_client = mock.MagicMock()
        user_pool_arn = "user_pool_test_1"
        cognito_client.user_pools[user_pool_arn].id = "user_pool_id"
        cognito_client.user_pools[user_pool_arn].arn = user_pool_arn
        cognito_client.user_pools[user_pool_arn].name = "user_pool_name"
        cognito_client.user_pools[user_pool_arn].region = "eu-west-1"
        cognito_client.user_pools[user_pool_arn].risk_configuration = RiskConfiguration(
            compromised_credentials_risk_configuration=CompromisedCredentialsRiskConfiguration(
                event_filter=["PASSWORD_CHANGE", "SIGN_UP", "SIGN_IN"],
                actions="BLOCK",
            ),
            account_takeover_risk_configuration=AccountTakeoverRiskConfiguration(
                low_action="BLOCK",
                medium_action="BLOCK",
                high_action="BLOCK",
            ),
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            for user_pool in cognito_client.user_pools.values():
                assert user_pool.region == "eu-west-1"
                assert user_pool.name == "user_pool_name"
                assert user_pool.id == "user_pool_id"
                assert (
                    user_pool.risk_configuration.compromised_credentials_risk_configuration
                    == CompromisedCredentialsRiskConfiguration(
                        event_filter=["PASSWORD_CHANGE", "SIGN_UP", "SIGN_IN"],
                        actions="BLOCK",
                    )
                )
                assert (
                    user_pool.risk_configuration.account_takeover_risk_configuration.low_action
                    == "BLOCK"
                )
                assert (
                    user_pool.risk_configuration.account_takeover_risk_configuration.medium_action
                    == "BLOCK"
                )
                assert (
                    user_pool.risk_configuration.account_takeover_risk_configuration.high_action
                    == "BLOCK"
                )

    @mock_aws
    def test_service_identity(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito = CognitoIdentity(aws_provider)
        assert cognito.service == "cognito-identity"

    # Test Cognito client
    @mock_aws
    def test_client_identity(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito = CognitoIdentity(aws_provider)
        for regional_client in cognito.regional_clients.values():
            assert regional_client.__class__.__name__ == "CognitoIdentity"

    # Test Cognito session
    @mock_aws
    def test__get_session_identity__(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito = CognitoIdentity(aws_provider)
        assert cognito.session.__class__.__name__ == "Session"

    # Test Cognito Session
    @mock_aws
    def test_audited_account_identity(self):
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito = CognitoIdentity(aws_provider)
        assert cognito.audited_account == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_list_identity_pools(self):
        identity_pool_name_1 = "identity_pool_test_1"
        identity_pool_name_2 = "identity_pool_test_2"
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito_client_eu_west_1 = client("cognito-identity", region_name="eu-west-1")
        cognito_client_us_east_1 = client("cognito-identity", region_name="us-east-1")
        cognito_client_eu_west_1.create_identity_pool(
            IdentityPoolName=identity_pool_name_1, AllowUnauthenticatedIdentities=True
        )
        cognito_client_us_east_1.create_identity_pool(
            IdentityPoolName=identity_pool_name_2, AllowUnauthenticatedIdentities=True
        )
        cognito = CognitoIdentity(aws_provider)
        assert len(cognito.identity_pools) == 2
        for identity_pool in cognito.identity_pools.values():
            assert (
                identity_pool.name == identity_pool_name_1
                or identity_pool.name == identity_pool_name_2
            )
            assert (
                identity_pool.region == "eu-west-1"
                or identity_pool.region == "us-east-1"
            )

    @mock_aws
    def test_describe_identity_pools(self):
        identity_pool_name_1 = "identity_pool_test_1"
        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        cognito_client_eu_west_1 = client("cognito-identity", region_name="eu-west-1")
        identity_pool_id = cognito_client_eu_west_1.create_identity_pool(
            IdentityPoolName=identity_pool_name_1, AllowUnauthenticatedIdentities=True
        )["IdentityPoolId"]
        cognito = CognitoIdentity(aws_provider)
        assert len(cognito.identity_pools) == 1
        for identity_pool in cognito.identity_pools.values():
            assert identity_pool.name == identity_pool_name_1
            assert identity_pool.region == "eu-west-1"
            assert identity_pool.id == identity_pool_id
            assert identity_pool.associated_pools is not None
            assert identity_pool.tags is not None
            assert identity_pool.allow_unauthenticated_identities is not None

    @mock_aws
    def test_get_identity_pool_tags(self):
        cognito_identity_client = mock.MagicMock()
        identity_pool_arn = "identity_pool_test_1"
        cognito_identity_client[identity_pool_arn].id = "identity_pool_id"
        cognito_identity_client[identity_pool_arn].arn = identity_pool_arn
        cognito_identity_client[identity_pool_arn].name = "identity_pool_name"
        cognito_identity_client[identity_pool_arn].region = "eu-west-1"
        cognito_identity_client[identity_pool_arn].tags = {"tag_key": "tag_value"}
        cognito_identity_client[identity_pool_arn].allow_unauthenticated_identities = (
            True
        )
        cognito_identity_client[identity_pool_arn].roles = IdentityPoolRoles(
            authenticated="authenticated_role",
            unauthenticated="unauthenticated_role",
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_identity_client.cognito_identity_client",
                new=cognito_identity_client,
            ),
        ):
            for identity_pool in cognito_identity_client.identity_pools.values():
                assert identity_pool.region == "eu-west-1"
                assert identity_pool.name == "identity_pool_name"
                assert identity_pool.id == "identity_pool_id"
                assert identity_pool.tags == {"tag_key": "tag_value"}
                assert identity_pool.allow_unauthenticated_identities is True
                assert identity_pool.roles.authenticated == "authenticated_role"
                assert identity_pool.roles.unauthenticated == "unauthenticated_role"
```

--------------------------------------------------------------------------------

---[FILE: cognito_identity_pool_guest_access_disabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_identity_pool_guest_access_disabled/cognito_identity_pool_guest_access_disabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import (
    IdentityPool,
    IdentityPoolRoles,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_identity_pool_guest_access_disabled:
    def test_cognito_no_identity_pools(self):
        cognito_identity_client = mock.MagicMock
        cognito_identity_client.identity_pools = {}
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIdentity",
                cognito_identity_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_identity_client.cognito_identity_client",
                new=cognito_identity_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_identity_pool_guest_access_disabled.cognito_identity_pool_guest_access_disabled import (
                cognito_identity_pool_guest_access_disabled,
            )

            check = cognito_identity_pool_guest_access_disabled()
            result = check.execute()

            assert len(result) == 0

    def test_cognito_identity_pools_guest_access_disabled(self):
        cognito_identity_client = mock.MagicMock
        identity_pool_arn = f"arn:aws:cognito-identity:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:identitypool/eu-west-1_123456789"
        identity_pool_name = "identity_pool_name"
        identity_pool_id = "eu-west-1_123456789"
        cognito_identity_client.identity_pools = {
            identity_pool_arn: IdentityPool(
                allow_unauthenticated_identities=False,
                region=AWS_REGION_US_EAST_1,
                id=identity_pool_id,
                arn=identity_pool_arn,
                name=identity_pool_name,
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIdentity",
                cognito_identity_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_identity_client.cognito_identity_client",
                new=cognito_identity_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_identity_pool_guest_access_disabled.cognito_identity_pool_guest_access_disabled import (
                cognito_identity_pool_guest_access_disabled,
            )

            check = cognito_identity_pool_guest_access_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Identity pool {identity_pool_id} has guest access disabled."
            )

            assert result[0].resource_id == identity_pool_id
            assert result[0].resource_arn == identity_pool_arn

    def test_cognito_identity_pools_guest_access_enabled(self):
        cognito_identity_client = mock.MagicMock
        identity_pool_arn = f"arn:aws:cognito-identity:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:identitypool/eu-west-1_123456789"
        identity_pool_name = "identity_pool_name"
        identity_pool_id = "eu-west-1_123456789"
        unauthenticated_role = "unauthenticated_role"
        cognito_identity_client.identity_pools = {
            identity_pool_arn: IdentityPool(
                allow_unauthenticated_identities=True,
                region=AWS_REGION_US_EAST_1,
                id=identity_pool_id,
                arn=identity_pool_arn,
                name=identity_pool_name,
                roles=IdentityPoolRoles(unauthenticated=unauthenticated_role),
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIdentity",
                cognito_identity_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_identity_client.cognito_identity_client",
                new=cognito_identity_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_identity_pool_guest_access_disabled.cognito_identity_pool_guest_access_disabled import (
                cognito_identity_pool_guest_access_disabled,
            )

            check = cognito_identity_pool_guest_access_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Identity pool {identity_pool_name} has guest access enabled assuming the role {unauthenticated_role}."
            )

            assert result[0].resource_id == identity_pool_id
            assert result[0].resource_arn == identity_pool_arn
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_advanced_security_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_user_pool_advanced_security_enabled/cognito_user_pool_advanced_security_enabled_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import UserPool
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_user_pool_advanced_security_enabled:
    def test_cognito_no_user_pools(self):
        cognito_client = mock.MagicMock
        cognito_client.user_pools = {}
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_advanced_security_enabled.cognito_user_pool_advanced_security_enabled import (
                cognito_user_pool_advanced_security_enabled,
            )

            check = cognito_user_pool_advanced_security_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_cognito_user_pools_advanced_security_off(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                advanced_security_mode="OFF",
                region=AWS_REGION_US_EAST_1,
                id=user_pool_id,
                arn=user_pool_arn,
                name=user_pool_name,
                last_modified=datetime.now(),
                creation_date=datetime.now(),
                status="ACTIVE",
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_advanced_security_enabled.cognito_user_pool_advanced_security_enabled import (
                cognito_user_pool_advanced_security_enabled,
            )

            check = cognito_user_pool_advanced_security_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has advanced security disabled."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pools_advanced_security_audit(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                advanced_security_mode="AUDIT",
                region=AWS_REGION_US_EAST_1,
                id=user_pool_id,
                arn=user_pool_arn,
                name=user_pool_name,
                last_modified=datetime.now(),
                creation_date=datetime.now(),
                status="ACTIVE",
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_advanced_security_enabled.cognito_user_pool_advanced_security_enabled import (
                cognito_user_pool_advanced_security_enabled,
            )

            check = cognito_user_pool_advanced_security_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has advanced security enabled but with audit-only mode."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pools_advanced_security_enforced(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                advanced_security_mode="ENFORCED",
                region=AWS_REGION_US_EAST_1,
                id=user_pool_id,
                arn=user_pool_arn,
                name=user_pool_name,
                last_modified=datetime.now(),
                creation_date=datetime.now(),
                status="ACTIVE",
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_advanced_security_enabled.cognito_user_pool_advanced_security_enabled import (
                cognito_user_pool_advanced_security_enabled,
            )

            check = cognito_user_pool_advanced_security_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has advanced security enforced with full-function mode."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_blocks_compromised_credentials_sign_in_attempts_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_user_pool_blocks_compromised_credentials_sign_in_attempts/cognito_user_pool_blocks_compromised_credentials_sign_in_attempts_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import (
    CompromisedCredentialsRiskConfiguration,
    RiskConfiguration,
    UserPool,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_user_pool_blocks_compromised_credentials_sign_in_attempts:
    def test_cognito_no_user_pools(self):
        cognito_client = mock.MagicMock
        cognito_client.user_pools = {}
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_blocks_compromised_credentials_sign_in_attempts.cognito_user_pool_blocks_compromised_credentials_sign_in_attempts import (
                cognito_user_pool_blocks_compromised_credentials_sign_in_attempts,
            )

            check = cognito_user_pool_blocks_compromised_credentials_sign_in_attempts()
            result = check.execute()

            assert len(result) == 0

    def test_cognito_user_pools_advanced_security_off(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                advanced_security_mode="OFF",
                risk_configuration=RiskConfiguration(
                    compromised_credentials_risk_configuration=CompromisedCredentialsRiskConfiguration(
                        event_filter=["SIGN_IN"],
                        actions="BLOCK",
                    )
                ),
                region=AWS_REGION_US_EAST_1,
                id=user_pool_id,
                arn=user_pool_arn,
                name=user_pool_name,
                last_modified=datetime.now(),
                creation_date=datetime.now(),
                status="ACTIVE",
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_blocks_compromised_credentials_sign_in_attempts.cognito_user_pool_blocks_compromised_credentials_sign_in_attempts import (
                cognito_user_pool_blocks_compromised_credentials_sign_in_attempts,
            )

            check = cognito_user_pool_blocks_compromised_credentials_sign_in_attempts()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} does not block sign-in attempts with suspected compromised credentials."
            )
            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pools_advanced_security_audit(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                advanced_security_mode="AUDIT",
                risk_configuration=RiskConfiguration(
                    compromised_credentials_risk_configuration=CompromisedCredentialsRiskConfiguration(
                        event_filter=["SIGN_IN"],
                        actions="BLOCK",
                    )
                ),
                region=AWS_REGION_US_EAST_1,
                id=user_pool_id,
                arn=user_pool_arn,
                name=user_pool_name,
                last_modified=datetime.now(),
                creation_date=datetime.now(),
                status="ACTIVE",
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_blocks_compromised_credentials_sign_in_attempts.cognito_user_pool_blocks_compromised_credentials_sign_in_attempts import (
                cognito_user_pool_blocks_compromised_credentials_sign_in_attempts,
            )

            check = cognito_user_pool_blocks_compromised_credentials_sign_in_attempts()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} does not block sign-in attempts with suspected compromised credentials."
            )
            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pools_advanced_security_enforced(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                advanced_security_mode="ENFORCED",
                risk_configuration=RiskConfiguration(
                    compromised_credentials_risk_configuration=CompromisedCredentialsRiskConfiguration(
                        event_filter=["SIGN_IN"],
                        actions="BLOCK",
                    )
                ),
                region=AWS_REGION_US_EAST_1,
                id=user_pool_id,
                arn=user_pool_arn,
                name=user_pool_name,
                last_modified=datetime.now(),
                creation_date=datetime.now(),
                status="ACTIVE",
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_blocks_compromised_credentials_sign_in_attempts.cognito_user_pool_blocks_compromised_credentials_sign_in_attempts import (
                cognito_user_pool_blocks_compromised_credentials_sign_in_attempts,
            )

            check = cognito_user_pool_blocks_compromised_credentials_sign_in_attempts()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} blocks sign-in attempts with suspected compromised credentials."
            )
            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pools_advanced_security_enforced_no_sign_in(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                advanced_security_mode="ENFORCED",
                risk_configuration=RiskConfiguration(
                    compromised_credentials_risk_configuration=CompromisedCredentialsRiskConfiguration(
                        event_filter=[],
                        actions="BLOCK",
                    )
                ),
                region=AWS_REGION_US_EAST_1,
                id=user_pool_id,
                arn=user_pool_arn,
                name=user_pool_name,
                last_modified=datetime.now(),
                creation_date=datetime.now(),
                status="ACTIVE",
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_blocks_compromised_credentials_sign_in_attempts.cognito_user_pool_blocks_compromised_credentials_sign_in_attempts import (
                cognito_user_pool_blocks_compromised_credentials_sign_in_attempts,
            )

            check = cognito_user_pool_blocks_compromised_credentials_sign_in_attempts()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} does not block sign-in attempts with suspected compromised credentials."
            )
            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn
```

--------------------------------------------------------------------------------

````
