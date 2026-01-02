---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 492
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 492 of 867)

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

---[FILE: cognito_user_pool_self_registration_disabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_user_pool_self_registration_disabled/cognito_user_pool_self_registration_disabled_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import (
    AdminCreateUserConfig,
    IdentityPool,
    IdentityPoolRoles,
    UserPool,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_user_pool_self_registration_disabled:
    def test_cognito_no_user_pools(self):
        cognito_client = mock.MagicMock
        cognito_client.user_pools = {}
        cognito_identity_client = mock.MagicMock
        cognito_identity_client.identity_pools = {}
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIdentity",
                cognito_identity_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_identity_client.cognito_identity_client",
                cognito_identity_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_self_registration_disabled.cognito_user_pool_self_registration_disabled import (
                cognito_user_pool_self_registration_disabled,
            )

            check = cognito_user_pool_self_registration_disabled()
            result = check.execute()

            assert len(result) == 0

    def test_cognito_no_identity_pools(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                admin_create_user_config=AdminCreateUserConfig(
                    allow_admin_create_user_only=False
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
        cognito_identity_client = mock.MagicMock
        cognito_identity_client.identity_pools = {}
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIdentity",
                cognito_identity_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_identity_client.cognito_identity_client",
                cognito_identity_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_self_registration_disabled.cognito_user_pool_self_registration_disabled import (
                cognito_user_pool_self_registration_disabled,
            )

            check = cognito_user_pool_self_registration_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has self registration enabled."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_identity_pools_allow_admin_create_user_enabled(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                admin_create_user_config=AdminCreateUserConfig(
                    allow_admin_create_user_only=True
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
        cognito_identity_client = mock.MagicMock
        identity_pool_name = "identity_pool_name"
        identity_pool_id = "eu-west-1_123456789"
        identity_pool_arn = f"arn:aws:cognito-identity:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:identitypool/eu-west-1_123456789"
        authenticated_role = "authenticated_role"
        cognito_identity_client.identity_pools = {
            identity_pool_arn: IdentityPool(
                id=identity_pool_id,
                arn=identity_pool_arn,
                region=AWS_REGION_US_EAST_1,
                name=identity_pool_name,
                associated_pools=[
                    {
                        "ProviderName": f"cognito-idp.{AWS_REGION_US_EAST_1}.amazonaws.com/eu-west-1_123456789"
                    }
                ],
                roles=IdentityPoolRoles(
                    authenticated=authenticated_role,
                ),
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIdentity",
                cognito_identity_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_identity_client.cognito_identity_client",
                cognito_identity_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_self_registration_disabled.cognito_user_pool_self_registration_disabled import (
                cognito_user_pool_self_registration_disabled,
            )

            check = cognito_user_pool_self_registration_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has self registration disabled."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_identity_pools_allow_admin_create_user_disabled(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                admin_create_user_config=AdminCreateUserConfig(
                    allow_admin_create_user_only=False
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
        cognito_identity_client = mock.MagicMock
        identity_pool_name = "eu-west-1_123456789"
        identity_pool_id = "eu-west-1_123456789"
        identity_pool_arn = f"arn:aws:cognito-identity:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:identitypool/eu-west-1_123456789"
        authenticated_role = "authenticated_role"
        cognito_identity_client.identity_pools = {
            identity_pool_arn: IdentityPool(
                id=identity_pool_id,
                arn=identity_pool_arn,
                region=AWS_REGION_US_EAST_1,
                name=identity_pool_name,
                associated_pools=[
                    {
                        "ProviderName": f"cognito-idp.{AWS_REGION_US_EAST_1}.amazonaws.com/eu-west-1_123456789"
                    }
                ],
                roles=IdentityPoolRoles(
                    authenticated=authenticated_role,
                ),
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIdentity",
                cognito_identity_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_identity_client.cognito_identity_client",
                cognito_identity_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_self_registration_disabled.cognito_user_pool_self_registration_disabled import (
                cognito_user_pool_self_registration_disabled,
            )

            check = cognito_user_pool_self_registration_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has self registration enabled assuming the role(s): {identity_pool_name}({authenticated_role})."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pool_admin_create_user_config_none(self):
        """Test case when admin_create_user_config is None - should not crash"""
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                admin_create_user_config=None,  # This is the key test case
                region=AWS_REGION_US_EAST_1,
                id=user_pool_id,
                arn=user_pool_arn,
                name=user_pool_name,
                last_modified=datetime.now(),
                creation_date=datetime.now(),
                status="ACTIVE",
            )
        }
        cognito_identity_client = mock.MagicMock
        cognito_identity_client.identity_pools = {}
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIdentity",
                cognito_identity_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_identity_client.cognito_identity_client",
                cognito_identity_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_self_registration_disabled.cognito_user_pool_self_registration_disabled import (
                cognito_user_pool_self_registration_disabled,
            )

            check = cognito_user_pool_self_registration_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has self registration disabled."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_temporary_password_expiration_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_user_pool_temporary_password_expiration/cognito_user_pool_temporary_password_expiration_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import (
    PasswordPolicy,
    UserPool,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_user_pool_temporary_password_expiration:
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_temporary_password_expiration.cognito_user_pool_temporary_password_expiration import (
                cognito_user_pool_temporary_password_expiration,
            )

            check = cognito_user_pool_temporary_password_expiration()
            result = check.execute()

            assert len(result) == 0

    def test_cognito_user_pools_password_expiration_8(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                password_policy=PasswordPolicy(
                    temporary_password_validity_days=8,
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_temporary_password_expiration.cognito_user_pool_temporary_password_expiration import (
                cognito_user_pool_temporary_password_expiration,
            )

            check = cognito_user_pool_temporary_password_expiration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has temporary password expiration set to 8 days."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pools_password_expiration_7(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                password_policy=PasswordPolicy(
                    temporary_password_validity_days=7,
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_temporary_password_expiration.cognito_user_pool_temporary_password_expiration import (
                cognito_user_pool_temporary_password_expiration,
            )

            check = cognito_user_pool_temporary_password_expiration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has temporary password expiration set to 7 days."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_waf_acl_attached_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_user_pool_waf_acl_attached/cognito_user_pool_waf_acl_attached_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import UserPool
from prowler.providers.aws.services.wafv2.wafv2_service import WebAclv2
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_user_pool_waf_acl_attached:
    def test_cognito_no_user_pools(self):
        cognito_client = mock.MagicMock
        cognito_client.user_pools = {}
        cognito_client.audited_account = AWS_ACCOUNT_NUMBER
        wafv2_client = mock.MagicMock
        wafv2_client.web_acls = {}
        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_service.WAFv2",
                new=wafv2_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_client.wafv2_client",
                new=wafv2_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_waf_acl_attached.cognito_user_pool_waf_acl_attached import (
                cognito_user_pool_waf_acl_attached,
            )

            check = cognito_user_pool_waf_acl_attached()
            result = check.execute()

            assert len(result) == 0

    def test_cognito_no_web_acls(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                region=AWS_REGION_US_EAST_1,
                id=user_pool_id,
                arn=user_pool_arn,
                name=user_pool_name,
                last_modified=datetime.now(),
                creation_date=datetime.now(),
                status="ACTIVE",
            )
        }
        cognito_client.audited_account = AWS_ACCOUNT_NUMBER
        wafv2_client = mock.MagicMock
        wafv2_client.web_acls = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_service.CognitoIDP",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cognito.cognito_idp_client.cognito_idp_client",
                new=cognito_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_service.WAFv2",
                new=wafv2_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_client.wafv2_client",
                new=wafv2_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_waf_acl_attached.cognito_user_pool_waf_acl_attached import (
                cognito_user_pool_waf_acl_attached,
            )

            check = cognito_user_pool_waf_acl_attached()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cognito User Pool {user_pool_name} is not associated with a WAF Web ACL."
            )
            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_with_web_acls(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                region=AWS_REGION_US_EAST_1,
                id=user_pool_id,
                arn=user_pool_arn,
                name=user_pool_name,
                last_modified=datetime.now(),
                creation_date=datetime.now(),
                status="ACTIVE",
            )
        }
        cognito_client.audited_account = AWS_ACCOUNT_NUMBER
        wafv2_client = mock.MagicMock
        web_acl_arn = "arn:aws:wafv2:us-east-1:123456789012:regional/webacl/abcd1234"
        web_acl_name = "abcd1234"
        web_acl_id = "abcd1234"
        wafv2_client.web_acls = {
            web_acl_arn: WebAclv2(
                arn=web_acl_arn,
                name=web_acl_name,
                id=web_acl_id,
                albs=[],
                user_pools=[user_pool_arn],
                region="us-east-1",
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
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_service.WAFv2",
                new=wafv2_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.wafv2.wafv2_client.wafv2_client",
                new=wafv2_client,
            ),
        ):
            from prowler.providers.aws.services.cognito.cognito_user_pool_waf_acl_attached.cognito_user_pool_waf_acl_attached import (
                cognito_user_pool_waf_acl_attached,
            )

            check = cognito_user_pool_waf_acl_attached()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cognito User Pool {user_pool_name} is associated with the WAF Web ACL {web_acl_name}."
            )
            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn
```

--------------------------------------------------------------------------------

---[FILE: config_service_test.py]---
Location: prowler-master/tests/providers/aws/services/config/config_service_test.py

```python
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.config.config_service import Config
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_Config_Service:
    # Test Config Service
    @mock_aws
    def test_service(self):
        # Config client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        config = Config(aws_provider)
        assert config.service == "config"

    # Test Config Client
    @mock_aws
    def test_client(self):
        # Config client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        config = Config(aws_provider)
        for regional_client in config.regional_clients.values():
            assert regional_client.__class__.__name__ == "ConfigService"

    # Test Config Session
    @mock_aws
    def test__get_session__(self):
        # Config client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        config = Config(aws_provider)
        assert config.session.__class__.__name__ == "Session"

    # Test Config Session
    @mock_aws
    def test_audited_account(self):
        # Config client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        config = Config(aws_provider)
        assert config.audited_account == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_describe_configuration_recorders(self):
        # Generate Config Client
        config_client = client("config", region_name=AWS_REGION_EU_WEST_1)
        # Create Config Recorder and start it
        config_client.put_configuration_recorder(
            ConfigurationRecorder={"name": "default", "roleARN": "somearn"}
        )
        # Make the delivery channel
        config_client.put_delivery_channel(
            DeliveryChannel={"name": "testchannel", "s3BucketName": "somebucket"}
        )
        config_client.start_configuration_recorder(ConfigurationRecorderName="default")
        # Config client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        config = Config(aws_provider)
        # One recorder per region
        assert len(config.recorders) == 1
        # Check the active one
        assert "default" in config.recorders
        assert config.recorders["default"].name == "default"
        assert config.recorders["default"].role_arn == "somearn"
        assert config.recorders["default"].region == AWS_REGION_EU_WEST_1

    # Test Config Get Rest APIs
    @mock_aws
    def test_describe_configuration_recorder_status(self):
        # Generate Config Client
        config_client = client("config", region_name=AWS_REGION_US_EAST_1)
        # Create Config Recorder and start it
        config_client.put_configuration_recorder(
            ConfigurationRecorder={"name": "default", "roleARN": "somearn"}
        )
        # Make the delivery channel
        config_client.put_delivery_channel(
            DeliveryChannel={"name": "testchannel", "s3BucketName": "somebucket"}
        )
        config_client.start_configuration_recorder(ConfigurationRecorderName="default")
        # Config client for this test class
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        config = Config(aws_provider)
        # One recorder per region
        assert len(config.recorders) == 2
        # Check the active one
        # Search for the recorder just created
        for recorder in config.recorders.values():
            if recorder.name == "default":
                assert recorder.recording is True
```

--------------------------------------------------------------------------------

---[FILE: config_recorder_all_regions_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/config/config_recorder_all_regions_enabled/config_recorder_all_regions_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_SOUTH_2,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_config_recorder_all_regions_enabled:
    @mock_aws
    def test_config_no_recorders(self):
        from prowler.providers.aws.services.config.config_service import Config

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.config.config_recorder_all_regions_enabled.config_recorder_all_regions_enabled.config_client",
                new=Config(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.config.config_recorder_all_regions_enabled.config_recorder_all_regions_enabled import (
                config_recorder_all_regions_enabled,
            )

            check = config_recorder_all_regions_enabled()
            results = check.execute()

            assert len(results) == 2
            for result in results:
                if result.region == AWS_REGION_EU_WEST_1:

                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == f"AWS Config recorder {AWS_ACCOUNT_NUMBER} is disabled."
                    )
                    assert (
                        result.resource_arn
                        == f"arn:aws:config:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:recorder"
                    )
                    assert result.resource_id == AWS_ACCOUNT_NUMBER
                if result.region == AWS_REGION_EU_WEST_1:
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == f"AWS Config recorder {AWS_ACCOUNT_NUMBER} is disabled."
                    )
                    assert (
                        result.resource_arn
                        == f"arn:aws:config:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:recorder"
                    )
                    assert result.resource_id == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_config_one_recoder_disabled(self):
        # Create Config Mocked Resources
        config_client = client("config", region_name=AWS_REGION_US_EAST_1)
        # Create Config Recorder
        config_client.put_configuration_recorder(
            ConfigurationRecorder={"name": "default", "roleARN": "somearn"}
        )
        from prowler.providers.aws.services.config.config_service import Config

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.config.config_recorder_all_regions_enabled.config_recorder_all_regions_enabled.config_client",
                new=Config(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.config.config_recorder_all_regions_enabled.config_recorder_all_regions_enabled import (
                config_recorder_all_regions_enabled,
            )

            check = config_recorder_all_regions_enabled()
            result = check.execute()
            assert len(result) == 1
            # Search for the recorder just created
            for recorder in result:
                if recorder.resource_id:
                    assert recorder.status == "FAIL"
                    assert (
                        recorder.status_extended
                        == "AWS Config recorder default is disabled."
                    )
                    assert recorder.resource_id == "default"
                    assert (
                        recorder.resource_arn
                        == f"arn:aws:config:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:recorder"
                    )
                    assert recorder.region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_config_one_recoder_enabled(self):
        # Create Config Mocked Resources
        config_client = client("config", region_name=AWS_REGION_US_EAST_1)
        # Create Config Recorder and start it
        config_client.put_configuration_recorder(
            ConfigurationRecorder={"name": "default", "roleARN": "somearn"}
        )
        # Make the delivery channel
        config_client.put_delivery_channel(
            DeliveryChannel={"name": "testchannel", "s3BucketName": "somebucket"}
        )
        config_client.start_configuration_recorder(ConfigurationRecorderName="default")
        from prowler.providers.aws.services.config.config_service import Config

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.config.config_recorder_all_regions_enabled.config_recorder_all_regions_enabled.config_client",
                new=Config(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.config.config_recorder_all_regions_enabled.config_recorder_all_regions_enabled import (
                config_recorder_all_regions_enabled,
            )

            check = config_recorder_all_regions_enabled()
            result = check.execute()
            assert len(result) == 1
            # Search for the recorder just created
            for recorder in result:
                if recorder.resource_id:
                    assert recorder.status == "PASS"
                    assert (
                        recorder.status_extended
                        == "AWS Config recorder default is enabled."
                    )
                    assert recorder.resource_id == "default"
                    assert (
                        recorder.resource_arn
                        == f"arn:aws:config:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:recorder"
                    )
                    assert recorder.region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_config_one_recorder_disabled_muted(self):
        # Create Config Mocked Resources
        config_client = client("config", region_name=AWS_REGION_US_EAST_1)
        # Create Config Recorder
        config_client.put_configuration_recorder(
            ConfigurationRecorder={"name": AWS_ACCOUNT_NUMBER, "roleARN": "somearn"}
        )
        from prowler.providers.aws.services.config.config_service import Config

        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_EU_SOUTH_2, AWS_REGION_US_EAST_1],
            profile_region=AWS_REGION_EU_SOUTH_2,
            audit_config={"mute_non_default_regions": True},
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.config.config_recorder_all_regions_enabled.config_recorder_all_regions_enabled.config_client",
                new=Config(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.config.config_recorder_all_regions_enabled.config_recorder_all_regions_enabled import (
                config_recorder_all_regions_enabled,
            )

            check = config_recorder_all_regions_enabled()
            result = check.execute()
            assert len(result) == 2
            # Search for the recorder just created
            for recorder in result:
                if recorder.region == AWS_REGION_US_EAST_1:
                    assert recorder.muted
                    assert recorder.status == "FAIL"
                    assert (
                        recorder.status_extended
                        == f"AWS Config recorder {AWS_ACCOUNT_NUMBER} is disabled."
                    )
                    assert recorder.resource_id == AWS_ACCOUNT_NUMBER
                    assert (
                        recorder.resource_arn
                        == f"arn:aws:config:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:recorder"
                    )
                    assert recorder.region == AWS_REGION_US_EAST_1
                else:
                    assert recorder.status == "FAIL"
                    assert (
                        recorder.status_extended
                        == f"AWS Config recorder {AWS_ACCOUNT_NUMBER} is disabled."
                    )
                    assert recorder.resource_id == AWS_ACCOUNT_NUMBER
                    assert (
                        recorder.resource_arn
                        == f"arn:aws:config:{AWS_REGION_EU_SOUTH_2}:{AWS_ACCOUNT_NUMBER}:recorder"
                    )
                    assert recorder.region == AWS_REGION_EU_SOUTH_2
```

--------------------------------------------------------------------------------

````
