---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 490
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 490 of 867)

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

---[FILE: cognito_user_pool_blocks_potential_malicious_sign_in_attempts_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_user_pool_blocks_potential_malicious_sign_in_attempts/cognito_user_pool_blocks_potential_malicious_sign_in_attempts_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import (
    AccountTakeoverRiskConfiguration,
    RiskConfiguration,
    UserPool,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_user_pool_blocks_potential_malicious_sign_in_attempts:
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_blocks_potential_malicious_sign_in_attempts.cognito_user_pool_blocks_potential_malicious_sign_in_attempts import (
                cognito_user_pool_blocks_potential_malicious_sign_in_attempts,
            )

            check = cognito_user_pool_blocks_potential_malicious_sign_in_attempts()
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
                    account_takeover_risk_configuration=AccountTakeoverRiskConfiguration(
                        low_action="BLOCK",
                        medium_action="BLOCK",
                        high_action="BLOCK",
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_blocks_potential_malicious_sign_in_attempts.cognito_user_pool_blocks_potential_malicious_sign_in_attempts import (
                cognito_user_pool_blocks_potential_malicious_sign_in_attempts,
            )

            check = cognito_user_pool_blocks_potential_malicious_sign_in_attempts()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} does not block all potential malicious sign-in attempts."
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
                    account_takeover_risk_configuration=AccountTakeoverRiskConfiguration(
                        low_action="BLOCK",
                        medium_action="BLOCK",
                        high_action="BLOCK",
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_blocks_potential_malicious_sign_in_attempts.cognito_user_pool_blocks_potential_malicious_sign_in_attempts import (
                cognito_user_pool_blocks_potential_malicious_sign_in_attempts,
            )

            check = cognito_user_pool_blocks_potential_malicious_sign_in_attempts()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} does not block all potential malicious sign-in attempts."
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
                    account_takeover_risk_configuration=AccountTakeoverRiskConfiguration(
                        low_action="BLOCK",
                        medium_action="BLOCK",
                        high_action="BLOCK",
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_blocks_potential_malicious_sign_in_attempts.cognito_user_pool_blocks_potential_malicious_sign_in_attempts import (
                cognito_user_pool_blocks_potential_malicious_sign_in_attempts,
            )

            check = cognito_user_pool_blocks_potential_malicious_sign_in_attempts()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} blocks all potential malicious sign-in attempts."
            )
            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pools_advanced_security_enforced_no_low_action(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                advanced_security_mode="ENFORCED",
                risk_configuration=RiskConfiguration(
                    account_takeover_risk_configuration=AccountTakeoverRiskConfiguration(
                        medium_action="BLOCK",
                        high_action="BLOCK",
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_blocks_potential_malicious_sign_in_attempts.cognito_user_pool_blocks_potential_malicious_sign_in_attempts import (
                cognito_user_pool_blocks_potential_malicious_sign_in_attempts,
            )

            check = cognito_user_pool_blocks_potential_malicious_sign_in_attempts()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} does not block all potential malicious sign-in attempts."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_client_prevent_user_existence_errors_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_user_pool_client_prevent_user_existence_errors/cognito_user_pool_client_prevent_user_existence_errors_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import (
    UserPool,
    UserPoolClient,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_user_pool_client_prevent_user_existence_errors:
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_client_prevent_user_existence_errors.cognito_user_pool_client_prevent_user_existence_errors import (
                cognito_user_pool_client_prevent_user_existence_errors,
            )

            check = cognito_user_pool_client_prevent_user_existence_errors()
            result = check.execute()

            assert len(result) == 0

    def test_cognito_user_pools_prevent_user_existence_errors_disabled(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_client_arn = f"{user_pool_arn}/client/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "eu-west-1_123456789"
        user_pool_client_id = "eu-west-1_123456789"
        user_pool_client_name = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                user_pool_clients={
                    user_pool_client_id: UserPoolClient(
                        id=user_pool_client_id,
                        name=user_pool_client_name,
                        region=AWS_REGION_US_EAST_1,
                        arn=user_pool_client_arn,
                        prevent_user_existence_errors="DISABLED",
                    )
                },
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_client_prevent_user_existence_errors.cognito_user_pool_client_prevent_user_existence_errors import (
                cognito_user_pool_client_prevent_user_existence_errors,
            )

            check = cognito_user_pool_client_prevent_user_existence_errors()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == user_pool_client_id
            assert result[0].resource_arn == user_pool_client_arn
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool client {user_pool_client_name} does not prevent revealing users in existence errors."
            )

    def test_cognito_user_pools_prevent_user_existence_errors_enabled(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_client_arn = f"{user_pool_arn}/client/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_client_id = "eu-west-1_123456789"
        user_pool_client_name = "user_pool_name"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                user_pool_clients={
                    user_pool_client_id: UserPoolClient(
                        id=user_pool_client_id,
                        name=user_pool_client_name,
                        region=AWS_REGION_US_EAST_1,
                        arn=user_pool_client_arn,
                        prevent_user_existence_errors="ENABLED",
                    )
                },
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_client_prevent_user_existence_errors.cognito_user_pool_client_prevent_user_existence_errors import (
                cognito_user_pool_client_prevent_user_existence_errors,
            )

            check = cognito_user_pool_client_prevent_user_existence_errors()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"User pool client {user_pool_client_name} prevents revealing users in existence errors."
            )

            assert result[0].resource_id == user_pool_client_id
            assert result[0].resource_arn == user_pool_client_arn
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_client_token_revocation_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_user_pool_client_token_revocation_enabled/cognito_user_pool_client_token_revocation_enabled_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import (
    UserPool,
    UserPoolClient,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_user_pool_client_token_revocation_enabled:
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_client_token_revocation_enabled.cognito_user_pool_client_token_revocation_enabled import (
                cognito_user_pool_client_token_revocation_enabled,
            )

            check = cognito_user_pool_client_token_revocation_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_cognito_user_pools_token_revocation_disabled(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        user_pool_client_id = "eu-west-1_123456789"
        user_pool_client_name = "eu-west-1_123456789"
        user_pool_client_arn = f"{user_pool_arn}/client/{user_pool_client_id}"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                user_pool_clients={
                    user_pool_client_id: UserPoolClient(
                        id=user_pool_client_id,
                        name=user_pool_client_name,
                        region=AWS_REGION_US_EAST_1,
                        arn=user_pool_client_arn,
                        enable_token_revocation=False,
                    )
                },
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_client_token_revocation_enabled.cognito_user_pool_client_token_revocation_enabled import (
                cognito_user_pool_client_token_revocation_enabled,
            )

            check = cognito_user_pool_client_token_revocation_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool client {user_pool_client_name} has token revocation disabled."
            )

            assert result[0].resource_id == user_pool_client_id
            assert result[0].resource_arn == user_pool_client_arn

    def test_project_user_pools_token_revocation_enabled(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        user_pool_client_id = "eu-west-1_123456789"
        user_pool_client_name = "eu-west-1_123456789"
        user_pool_client_arn = f"{user_pool_arn}/client/{user_pool_client_id}"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                user_pool_clients={
                    user_pool_client_id: UserPoolClient(
                        id=user_pool_client_id,
                        name=user_pool_client_name,
                        arn=user_pool_client_arn,
                        region=AWS_REGION_US_EAST_1,
                        enable_token_revocation=True,
                    )
                },
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_client_token_revocation_enabled.cognito_user_pool_client_token_revocation_enabled import (
                cognito_user_pool_client_token_revocation_enabled,
            )

            check = cognito_user_pool_client_token_revocation_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"User pool client {user_pool_client_name} has token revocation enabled."
            )

            assert result[0].resource_id == user_pool_client_id
            assert result[0].resource_arn == user_pool_client_arn
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_deletion_protection_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_user_pool_deletion_protection_enabled/cognito_user_pool_deletion_protection_enabled_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import UserPool
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_user_pool_deletion_protection_enabled:
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_deletion_protection_enabled.cognito_user_pool_deletion_protection_enabled import (
                cognito_user_pool_deletion_protection_enabled,
            )

            check = cognito_user_pool_deletion_protection_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_cognito_user_pools_deletion_protection_disabled(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                deletion_protection="DISABLED",
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_deletion_protection_enabled.cognito_user_pool_deletion_protection_enabled import (
                cognito_user_pool_deletion_protection_enabled,
            )

            check = cognito_user_pool_deletion_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has deletion protection disabled."
            )
            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pools_deletion_protection_enabled(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        user_pool_id = "eu-west-1_123456789"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                deletion_protection="ACTIVE",
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_deletion_protection_enabled.cognito_user_pool_deletion_protection_enabled import (
                cognito_user_pool_deletion_protection_enabled,
            )

            check = cognito_user_pool_deletion_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has deletion protection enabled."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_mfa_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/cognito/cognito_user_pool_mfa_enabled/cognito_user_pool_mfa_enabled_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.cognito.cognito_service import UserPool
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_cognito_user_pool_mfa_enabled:
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_mfa_enabled.cognito_user_pool_mfa_enabled import (
                cognito_user_pool_mfa_enabled,
            )

            check = cognito_user_pool_mfa_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_cognito_user_pools_mfa_config_none(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                mfa_config=None,
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_mfa_enabled.cognito_user_pool_mfa_enabled import (
                cognito_user_pool_mfa_enabled,
            )

            check = cognito_user_pool_mfa_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has MFA disabled."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pools_mfa_config_disabled(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                mfa_config={"status": "OFF"},
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_mfa_enabled.cognito_user_pool_mfa_enabled import (
                cognito_user_pool_mfa_enabled,
            )

            check = cognito_user_pool_mfa_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has MFA disabled."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn

    def test_cognito_user_pools_mfa_config_enabled(self):
        cognito_client = mock.MagicMock
        user_pool_arn = f"arn:aws:cognito-idp:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:userpool/eu-west-1_123456789"
        user_pool_id = "eu-west-1_123456789"
        user_pool_name = "user_pool_name"
        cognito_client.user_pools = {
            user_pool_arn: UserPool(
                mfa_config={"status": "ON"},
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
            from prowler.providers.aws.services.cognito.cognito_user_pool_mfa_enabled.cognito_user_pool_mfa_enabled import (
                cognito_user_pool_mfa_enabled,
            )

            check = cognito_user_pool_mfa_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"User pool {user_pool_name} has MFA enabled."
            )

            assert result[0].resource_id == user_pool_id
            assert result[0].resource_arn == user_pool_arn
```

--------------------------------------------------------------------------------

````
