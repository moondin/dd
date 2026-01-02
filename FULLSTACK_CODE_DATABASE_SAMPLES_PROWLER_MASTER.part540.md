---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 540
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 540 of 867)

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

---[FILE: ecr_registry_scan_images_on_push_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/ecr/ecr_registry_scan_images_on_push_enabled/ecr_registry_scan_images_on_push_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.ecr.ecr_service import (
    Registry,
    Repository,
    ScanningRule,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_ARN,
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

repository_name = "test_repo"
repository_arn = (
    f"arn:aws:ecr:eu-west-1:{AWS_ACCOUNT_NUMBER}:repository/{repository_name}"
)


class Test_ecr_registry_scan_images_on_push_enabled:
    def test_no_registries(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_registry_scan_images_on_push_enabled.ecr_registry_scan_images_on_push_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_registry_scan_images_on_push_enabled.ecr_registry_scan_images_on_push_enabled import (
                ecr_registry_scan_images_on_push_enabled,
            )

            check = ecr_registry_scan_images_on_push_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_registry_no_repositories(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[],
            rules=[],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_registry_scan_images_on_push_enabled.ecr_registry_scan_images_on_push_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_registry_scan_images_on_push_enabled.ecr_registry_scan_images_on_push_enabled import (
                ecr_registry_scan_images_on_push_enabled,
            )

            check = ecr_registry_scan_images_on_push_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_registry_scan_on_push_enabled(self):
        ecr_client = mock.MagicMock
        ecr_client.audited_account_arn = AWS_ACCOUNT_ARN
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[
                Repository(
                    name=repository_name,
                    arn=repository_arn,
                    region=AWS_REGION_EU_WEST_1,
                    scan_on_push=True,
                    policy="",
                    images_details=None,
                    lifecycle_policy="",
                )
            ],
            rules=[
                ScanningRule(
                    scan_frequency="SCAN_ON_PUSH",
                    scan_filters=[{"filter": "*", "filterType": "WILDCARD"}],
                )
            ],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_registry_scan_images_on_push_enabled.ecr_registry_scan_images_on_push_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_registry_scan_images_on_push_enabled.ecr_registry_scan_images_on_push_enabled import (
                ecr_registry_scan_images_on_push_enabled,
            )

            check = ecr_registry_scan_images_on_push_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECR registry {AWS_ACCOUNT_NUMBER} has BASIC scan with scan on push enabled."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_scan_on_push_enabled_with_filters(self):
        ecr_client = mock.MagicMock
        ecr_client.audited_account_arn = AWS_ACCOUNT_ARN
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[
                Repository(
                    name=repository_name,
                    arn=repository_arn,
                    region=AWS_REGION_EU_WEST_1,
                    scan_on_push=True,
                    policy="",
                    images_details=None,
                    lifecycle_policy="",
                )
            ],
            rules=[
                ScanningRule(
                    scan_frequency="SCAN_ON_PUSH",
                    scan_filters=[{"filter": "test", "filterType": "WILDCARD"}],
                )
            ],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_registry_scan_images_on_push_enabled.ecr_registry_scan_images_on_push_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_registry_scan_images_on_push_enabled.ecr_registry_scan_images_on_push_enabled import (
                ecr_registry_scan_images_on_push_enabled,
            )

            check = ecr_registry_scan_images_on_push_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ECR registry {AWS_ACCOUNT_NUMBER} has BASIC scanning with scan on push but with repository filters."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_scan_on_push_disabled(self):
        ecr_client = mock.MagicMock
        ecr_client.audited_account_arn = AWS_ACCOUNT_ARN
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[
                Repository(
                    name=repository_name,
                    arn=repository_arn,
                    region=AWS_REGION_EU_WEST_1,
                    scan_on_push=True,
                    policy="",
                    images_details=None,
                    lifecycle_policy="",
                )
            ],
            rules=[],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_registry_scan_images_on_push_enabled.ecr_registry_scan_images_on_push_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_registry_scan_images_on_push_enabled.ecr_registry_scan_images_on_push_enabled import (
                ecr_registry_scan_images_on_push_enabled,
            )

            check = ecr_registry_scan_images_on_push_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ECR registry {AWS_ACCOUNT_NUMBER} has BASIC scanning without scan on push enabled."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_lifecycle_policy_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/ecr/ecr_repositories_lifecycle_policy_enabled/ecr_repositories_lifecycle_policy_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.ecr.ecr_service import Registry, Repository
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

repository_name = "test_repo"
repository_arn = (
    f"arn:aws:ecr:eu-west-1:{AWS_ACCOUNT_NUMBER}:repository/{repository_name}"
)
repo_policy_public = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ECRRepositoryPolicy",
            "Effect": "Allow",
            "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/username"},
            "Action": ["ecr:DescribeImages", "ecr:DescribeRepositories"],
        }
    ],
}


class Test_ecr_repositories_lifecycle_policy_enabled:
    # Mocked Audit Info

    def test_no_registries(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_lifecycle_policy_enabled.ecr_repositories_lifecycle_policy_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_lifecycle_policy_enabled.ecr_repositories_lifecycle_policy_enabled import (
                ecr_repositories_lifecycle_policy_enabled,
            )

            check = ecr_repositories_lifecycle_policy_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_registry_no_repositories(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[],
            rules=[],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_lifecycle_policy_enabled.ecr_repositories_lifecycle_policy_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_lifecycle_policy_enabled.ecr_repositories_lifecycle_policy_enabled import (
                ecr_repositories_lifecycle_policy_enabled,
            )

            check = ecr_repositories_lifecycle_policy_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_lifecycle_policy(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            rules=[],
            repositories=[
                Repository(
                    name=repository_name,
                    arn=repository_arn,
                    region=AWS_REGION_EU_WEST_1,
                    scan_on_push=True,
                    policy=repo_policy_public,
                    images_details=None,
                    lifecycle_policy="test-policy",
                )
            ],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_lifecycle_policy_enabled.ecr_repositories_lifecycle_policy_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_lifecycle_policy_enabled.ecr_repositories_lifecycle_policy_enabled import (
                ecr_repositories_lifecycle_policy_enabled,
            )

            check = ecr_repositories_lifecycle_policy_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repository_name} has a lifecycle policy configured."
            )
            assert result[0].resource_id == repository_name
            assert result[0].resource_arn == repository_arn
            assert result[0].resource_tags == []

    def test_no_lifecycle_policy(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            rules=[],
            repositories=[
                Repository(
                    name=repository_name,
                    arn=repository_arn,
                    region=AWS_REGION_EU_WEST_1,
                    scan_on_push=False,
                    policy=repo_policy_public,
                    images_details=None,
                    lifecycle_policy=None,
                )
            ],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_lifecycle_policy_enabled.ecr_repositories_lifecycle_policy_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_lifecycle_policy_enabled.ecr_repositories_lifecycle_policy_enabled import (
                ecr_repositories_lifecycle_policy_enabled,
            )

            check = ecr_repositories_lifecycle_policy_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repository_name} does not have a lifecycle policy configured."
            )
            assert result[0].resource_id == repository_name
            assert result[0].resource_arn == repository_arn
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_not_publicly_accessible_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/ecr/ecr_repositories_not_publicly_accessible/ecr_repositories_not_publicly_accessible_fixer_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_ecr_repositories_not_publicly_accessible_fixer:
    @mock_aws
    def test_ecr_repository_public(self):
        ecr_client = client("ecr", region_name=AWS_REGION_EU_WEST_1)

        repository_name = "test-repo"
        ecr_client.create_repository(repositoryName=repository_name)

        ecr_client.set_repository_policy(
            repositoryName=repository_name,
            policyText=dumps(
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"AWS": "*"},
                            "Action": "ecr:*",
                            "Resource": f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:123456789012:repository/{repository_name}",
                        }
                    ],
                }
            ),
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.ecr.ecr_service import ECR

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible_fixer.ecr_client",
                new=ECR(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible_fixer import (
                fixer,
            )

            assert fixer(repository_name, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_ecr_repository_not_public(self):
        ecr_client = client("ecr", region_name=AWS_REGION_EU_WEST_1)

        repository_name = "test-repo"
        ecr_client.create_repository(repositoryName=repository_name)

        ecr_client.set_repository_policy(
            repositoryName=repository_name,
            policyText=dumps(
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"AWS": "123456789012"},
                            "Action": "ecr:*",
                            "Resource": f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:123456789012:repository/{repository_name}",
                        }
                    ],
                }
            ),
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.ecr.ecr_service import ECR

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible_fixer.ecr_client",
                new=ECR(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible_fixer import (
                fixer,
            )

            assert fixer(repository_name, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_ecr_repository_public_error(self):
        ecr_client = client("ecr", region_name=AWS_REGION_EU_WEST_1)

        repository_name = "test-repo"
        ecr_client.create_repository(repositoryName=repository_name)

        ecr_client.set_repository_policy(
            repositoryName=repository_name,
            policyText=dumps(
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"AWS": "*"},
                            "Action": "ecr:*",
                            "Resource": f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:123456789012:repository/{repository_name}",
                        }
                    ],
                }
            ),
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        from prowler.providers.aws.services.ecr.ecr_service import ECR

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible_fixer.ecr_client",
                new=ECR(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible_fixer import (
                fixer,
            )

            assert not fixer("repository_name_non_existing", AWS_REGION_EU_WEST_1)
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/ecr/ecr_repositories_not_publicly_accessible/ecr_repositories_not_publicly_accessible_test.py

```python
from unittest import mock

from prowler.providers.aws.services.ecr.ecr_service import Registry, Repository
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

repository_name = "test_repo"
repository_arn = (
    f"arn:aws:ecr:eu-west-1:{AWS_ACCOUNT_NUMBER}:repository/{repository_name}"
)
repo_policy_not_public = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ECRRepositoryPolicy",
            "Effect": "Allow",
            "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/username"},
            "Action": ["ecr:DescribeImages", "ecr:DescribeRepositories"],
        }
    ],
}

repo_policy_public = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ECRRepositoryPolicy",
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": ["ecr:DescribeImages", "ecr:DescribeRepositories"],
        }
    ],
}


class Test_ecr_repositories_not_publicly_accessible:
    # Mocked Audit Info

    def test_no_registries(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible import (
                ecr_repositories_not_publicly_accessible,
            )

            check = ecr_repositories_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    def test_registry_no_repositories(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[],
            rules=[],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible import (
                ecr_repositories_not_publicly_accessible,
            )

            check = ecr_repositories_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    def test_repository_not_public(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.audit_config = {}
        ecr_client.audited_account = AWS_ACCOUNT_NUMBER
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[
                Repository(
                    name=repository_name,
                    arn=repository_arn,
                    region=AWS_REGION_EU_WEST_1,
                    scan_on_push=True,
                    policy=repo_policy_not_public,
                    images_details=None,
                    lifecycle_policy=None,
                )
            ],
            rules=[],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible import (
                ecr_repositories_not_publicly_accessible,
            )

            check = ecr_repositories_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repository_name} is not publicly accessible."
            )
            assert result[0].resource_id == repository_name
            assert result[0].resource_arn == repository_arn

    def test_repository_no_policy(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[
                Repository(
                    name=repository_name,
                    arn=repository_arn,
                    region=AWS_REGION_EU_WEST_1,
                    scan_on_push=True,
                    policy={},
                    images_details=None,
                    lifecycle_policy=None,
                )
            ],
            rules=[],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible import (
                ecr_repositories_not_publicly_accessible,
            )

            check = ecr_repositories_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repository_name} is not publicly accessible."
            )
            assert result[0].resource_id == repository_name
            assert result[0].resource_arn == repository_arn

    def test_repository_public(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.audit_config = {}
        ecr_client.audited_account = AWS_ACCOUNT_NUMBER
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[
                Repository(
                    name=repository_name,
                    arn=repository_arn,
                    region=AWS_REGION_EU_WEST_1,
                    scan_on_push=True,
                    policy=repo_policy_public,
                    images_details=None,
                    lifecycle_policy=None,
                )
            ],
            rules=[],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_not_publicly_accessible.ecr_repositories_not_publicly_accessible import (
                ecr_repositories_not_publicly_accessible,
            )

            check = ecr_repositories_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repository_name} is publicly accessible."
            )
            assert result[0].resource_id == repository_name
            assert result[0].resource_arn == repository_arn
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_scan_images_on_push_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/ecr/ecr_repositories_scan_images_on_push_enabled/ecr_repositories_scan_images_on_push_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.ecr.ecr_service import Registry, Repository
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

repository_name = "test_repo"
repository_arn = (
    f"arn:aws:ecr:eu-west-1:{AWS_ACCOUNT_NUMBER}:repository/{repository_name}"
)
repo_policy_public = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ECRRepositoryPolicy",
            "Effect": "Allow",
            "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/username"},
            "Action": ["ecr:DescribeImages", "ecr:DescribeRepositories"],
        }
    ],
}


class Test_ecr_repositories_scan_images_on_push_enabled:
    # Mocked Audit Info

    def test_no_registries(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_scan_images_on_push_enabled.ecr_repositories_scan_images_on_push_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_scan_images_on_push_enabled.ecr_repositories_scan_images_on_push_enabled import (
                ecr_repositories_scan_images_on_push_enabled,
            )

            check = ecr_repositories_scan_images_on_push_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_registry_no_repositories(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[],
            rules=[],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_scan_images_on_push_enabled.ecr_repositories_scan_images_on_push_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_scan_images_on_push_enabled.ecr_repositories_scan_images_on_push_enabled import (
                ecr_repositories_scan_images_on_push_enabled,
            )

            check = ecr_repositories_scan_images_on_push_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_scan_on_push_disabled(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[
                Repository(
                    name=repository_name,
                    arn=repository_arn,
                    region=AWS_REGION_EU_WEST_1,
                    scan_on_push=True,
                    policy=repo_policy_public,
                    images_details=None,
                    lifecycle_policy=None,
                )
            ],
            rules=[],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_scan_images_on_push_enabled.ecr_repositories_scan_images_on_push_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_scan_images_on_push_enabled.ecr_repositories_scan_images_on_push_enabled import (
                ecr_repositories_scan_images_on_push_enabled,
            )

            check = ecr_repositories_scan_images_on_push_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ECR repository {repository_name} has scan on push enabled."
            )
            assert result[0].resource_id == repository_name
            assert result[0].resource_arn == repository_arn

    def test_scan_on_push_enabled(self):
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = Registry(
            id=AWS_ACCOUNT_NUMBER,
            arn=f"arn:aws:ecr:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{AWS_ACCOUNT_NUMBER}",
            region=AWS_REGION_EU_WEST_1,
            scan_type="BASIC",
            repositories=[
                Repository(
                    name=repository_name,
                    arn=repository_arn,
                    region=AWS_REGION_EU_WEST_1,
                    scan_on_push=False,
                    policy=repo_policy_public,
                    images_details=None,
                    lifecycle_policy=None,
                )
            ],
            rules=[],
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ecr.ecr_repositories_scan_images_on_push_enabled.ecr_repositories_scan_images_on_push_enabled.ecr_client",
                ecr_client,
            ),
        ):
            from prowler.providers.aws.services.ecr.ecr_repositories_scan_images_on_push_enabled.ecr_repositories_scan_images_on_push_enabled import (
                ecr_repositories_scan_images_on_push_enabled,
            )

            check = ecr_repositories_scan_images_on_push_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ECR repository {repository_name} has scan on push disabled."
            )
            assert result[0].resource_id == repository_name
            assert result[0].resource_arn == repository_arn
```

--------------------------------------------------------------------------------

````
