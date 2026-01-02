---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 718
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 718 of 867)

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

---[FILE: repository_branch_delete_on_merge_enabled_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_branch_delete_on_merge_enabled/repository_branch_delete_on_merge_enabled_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_branch_delete_on_merge_enabled_test:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_branch_delete_on_merge_enabled.repository_branch_delete_on_merge_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_branch_delete_on_merge_enabled.repository_branch_delete_on_merge_enabled import (
                repository_branch_delete_on_merge_enabled,
            )

            check = repository_branch_delete_on_merge_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_branch_deletion_disabled(self):
        repository_client = mock.MagicMock
        repo_name = "repo2"
        default_branch = "main"
        repository_client.repositories = {
            2: Repo(
                id=2,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo2",
                default_branch=Branch(
                    name=default_branch,
                    protected=False,
                    default_branch=True,
                    require_pull_request=False,
                    approval_count=0,
                    required_linear_history=False,
                    allow_force_pushes=True,
                    branch_deletion=True,
                    status_checks=False,
                    enforce_admins=False,
                    require_code_owner_reviews=False,
                    require_signed_commits=False,
                    conversation_resolution=False,
                ),
                private=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_branch_delete_on_merge_enabled.repository_branch_delete_on_merge_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_branch_delete_on_merge_enabled.repository_branch_delete_on_merge_enabled import (
                repository_branch_delete_on_merge_enabled,
            )

            check = repository_branch_delete_on_merge_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 2
            assert result[0].resource_name == repo_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not delete branches on merge in default branch ({default_branch})."
            )

    def test_branch_deletion_enabled(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        default_branch = "main"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name=default_branch,
                    protected=True,
                    default_branch=True,
                    require_pull_request=True,
                    approval_count=1,
                    required_linear_history=True,
                    allow_force_pushes=False,
                    branch_deletion=False,
                    status_checks=True,
                    enforce_admins=True,
                    require_code_owner_reviews=True,
                    require_signed_commits=True,
                    conversation_resolution=True,
                ),
                private=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                securitymd=True,
                codeowners_exists=True,
                secret_scanning_enabled=True,
                dependabot_alerts_enabled=True,
                delete_branch_on_merge=True,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_branch_delete_on_merge_enabled.repository_branch_delete_on_merge_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_branch_delete_on_merge_enabled.repository_branch_delete_on_merge_enabled import (
                repository_branch_delete_on_merge_enabled,
            )

            check = repository_branch_delete_on_merge_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does delete branches on merge in default branch ({default_branch})."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_deletion_disabled_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_default_branch_deletion_disabled/repository_default_branch_deletion_disabled_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_default_branch_deletion_disabled_test:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_deletion_disabled.repository_default_branch_deletion_disabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_deletion_disabled.repository_default_branch_deletion_disabled import (
                repository_default_branch_deletion_disabled,
            )

            check = repository_default_branch_deletion_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_allow_branch_deletion_enabled(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        default_branch = Branch(
            name="main",
            protected=False,
            default_branch=True,
            require_pull_request=False,
            approval_count=0,
            required_linear_history=False,
            allow_force_pushes=True,
            branch_deletion=True,
            status_checks=False,
            enforce_admins=False,
            require_code_owner_reviews=False,
            require_signed_commits=False,
            conversation_resolution=False,
        )
        now = datetime.now(timezone.utc)

        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=default_branch,
                private=False,
                archived=False,
                pushed_at=now,
                default_branch_deletion=True,
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_deletion_disabled.repository_default_branch_deletion_disabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_deletion_disabled.repository_default_branch_deletion_disabled import (
                repository_default_branch_deletion_disabled,
            )

            check = repository_default_branch_deletion_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does allow default branch deletion."
            )

    def test_allow_branch_deletion_disabled(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        default_branch = Branch(
            name="main",
            protected=False,
            default_branch=True,
            require_pull_request=False,
            approval_count=0,
            required_linear_history=False,
            allow_force_pushes=True,
            branch_deletion=False,
            status_checks=False,
            enforce_admins=False,
            require_code_owner_reviews=False,
            require_signed_commits=False,
            conversation_resolution=False,
        )
        now = datetime.now(timezone.utc)

        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=default_branch,
                private=False,
                archived=False,
                pushed_at=now,
                default_branch_deletion=False,
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_deletion_disabled.repository_default_branch_deletion_disabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_deletion_disabled.repository_default_branch_deletion_disabled import (
                repository_default_branch_deletion_disabled,
            )

            check = repository_default_branch_deletion_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does deny default branch deletion."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_disallows_force_push_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_default_branch_disallows_force_push/repository_default_branch_disallows_force_push_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_default_branch_disallows_force_push_test:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_disallows_force_push.repository_default_branch_disallows_force_push.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_disallows_force_push.repository_default_branch_disallows_force_push import (
                repository_default_branch_disallows_force_push,
            )

            check = repository_default_branch_disallows_force_push()
            result = check.execute()
            assert len(result) == 0

    def test_force_push_allowed(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        default_branch = "main"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name=default_branch,
                    protected=False,
                    default_branch=True,
                    require_pull_request=False,
                    approval_count=0,
                    required_linear_history=False,
                    allow_force_pushes=True,
                    branch_deletion=True,
                    status_checks=False,
                    enforce_admins=False,
                    require_code_owner_reviews=False,
                    require_signed_commits=False,
                    conversation_resolution=False,
                ),
                private=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_disallows_force_push.repository_default_branch_disallows_force_push.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_disallows_force_push.repository_default_branch_disallows_force_push import (
                repository_default_branch_disallows_force_push,
            )

            check = repository_default_branch_disallows_force_push()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does allow force pushes on default branch ({default_branch})."
            )

    def test_force_push_disallowed(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        default_branch = "main"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name=default_branch,
                    protected=True,
                    default_branch=True,
                    require_pull_request=True,
                    approval_count=1,
                    required_linear_history=True,
                    allow_force_pushes=False,
                    branch_deletion=False,
                    status_checks=True,
                    enforce_admins=True,
                    require_code_owner_reviews=True,
                    require_signed_commits=True,
                    conversation_resolution=True,
                ),
                private=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                securitymd=True,
                codeowners_exists=True,
                secret_scanning_enabled=True,
                dependabot_alerts_enabled=True,
                delete_branch_on_merge=True,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_disallows_force_push.repository_default_branch_disallows_force_push.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_disallows_force_push.repository_default_branch_disallows_force_push import (
                repository_default_branch_disallows_force_push,
            )

            check = repository_default_branch_disallows_force_push()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does deny force pushes on default branch ({default_branch})."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_protection_applies_to_admins_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_default_branch_protection_applies_to_admins/repository_default_branch_protection_applies_to_admins_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_default_branch_protection_applies_to_admins_test:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_protection_applies_to_admins.repository_default_branch_protection_applies_to_admins.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_protection_applies_to_admins.repository_default_branch_protection_applies_to_admins import (
                repository_default_branch_protection_applies_to_admins,
            )

            check = repository_default_branch_protection_applies_to_admins()
            result = check.execute()
            assert len(result) == 0

    def test_enforce_status_checks_disabled(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        default_branch = "main"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name=default_branch,
                    protected=False,
                    default_branch=True,
                    require_pull_request=False,
                    approval_count=0,
                    required_linear_history=False,
                    allow_force_pushes=True,
                    branch_deletion=True,
                    status_checks=False,
                    enforce_admins=False,
                    require_code_owner_reviews=False,
                    require_signed_commits=False,
                    conversation_resolution=False,
                ),
                private=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_protection_applies_to_admins.repository_default_branch_protection_applies_to_admins.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_protection_applies_to_admins.repository_default_branch_protection_applies_to_admins import (
                repository_default_branch_protection_applies_to_admins,
            )

            check = repository_default_branch_protection_applies_to_admins()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not enforce administrators to be subject to the same branch protection rules as other users."
            )

    def test_enforce_status_checks_enabled(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        default_branch = "main"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name=default_branch,
                    protected=True,
                    default_branch=True,
                    require_pull_request=True,
                    approval_count=1,
                    required_linear_history=True,
                    allow_force_pushes=False,
                    branch_deletion=False,
                    status_checks=True,
                    enforce_admins=True,
                    require_code_owner_reviews=True,
                    require_signed_commits=True,
                    conversation_resolution=True,
                ),
                private=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                securitymd=True,
                codeowners_exists=True,
                secret_scanning_enabled=True,
                dependabot_alerts_enabled=True,
                delete_branch_on_merge=True,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_protection_applies_to_admins.repository_default_branch_protection_applies_to_admins.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_protection_applies_to_admins.repository_default_branch_protection_applies_to_admins import (
                repository_default_branch_protection_applies_to_admins,
            )

            check = repository_default_branch_protection_applies_to_admins()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does enforce administrators to be subject to the same branch protection rules as other users."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_protection_enabled_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_default_branch_protection_enabled/repository_default_branch_protection_enabled_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_default_branch_protection_enabled_test:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_protection_enabled.repository_default_branch_protection_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_protection_enabled.repository_default_branch_protection_enabled import (
                repository_default_branch_protection_enabled,
            )

            check = repository_default_branch_protection_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_without_default_branch_protection(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        default_branch = "main"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name=default_branch,
                    protected=False,
                    default_branch=True,
                    require_pull_request=False,
                    approval_count=0,
                    required_linear_history=False,
                    allow_force_pushes=True,
                    branch_deletion=True,
                    status_checks=False,
                    enforce_admins=False,
                    require_code_owner_reviews=False,
                    require_signed_commits=False,
                    conversation_resolution=False,
                ),
                private=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_protection_enabled.repository_default_branch_protection_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_protection_enabled.repository_default_branch_protection_enabled import (
                repository_default_branch_protection_enabled,
            )

            check = repository_default_branch_protection_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not enforce branch protection on default branch ({default_branch})."
            )

    def test_default_branch_protection(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        default_branch = "main"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name=default_branch,
                    protected=True,
                    default_branch=True,
                    require_pull_request=True,
                    approval_count=1,
                    required_linear_history=True,
                    allow_force_pushes=False,
                    branch_deletion=False,
                    status_checks=True,
                    enforce_admins=True,
                    require_code_owner_reviews=True,
                    require_signed_commits=True,
                    conversation_resolution=True,
                ),
                private=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                securitymd=True,
                codeowners_exists=True,
                secret_scanning_enabled=True,
                dependabot_alerts_enabled=True,
                delete_branch_on_merge=True,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_protection_enabled.repository_default_branch_protection_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_protection_enabled.repository_default_branch_protection_enabled import (
                repository_default_branch_protection_enabled,
            )

            check = repository_default_branch_protection_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does enforce branch protection on default branch ({default_branch})."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_codeowners_review_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_default_branch_requires_codeowners_review/repository_default_branch_requires_codeowners_review_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_default_branch_requires_codeowners_review:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_requires_codeowners_review.repository_default_branch_requires_codeowners_review.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_codeowners_review.repository_default_branch_requires_codeowners_review import (
                repository_default_branch_requires_codeowners_review,
            )

            check = repository_default_branch_requires_codeowners_review()
            result = check.execute()
            assert len(result) == 0

    def test_one_repository_no_codeowner_approval(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name="main",
                    protected=False,
                    default_branch=True,
                    require_pull_request=False,
                    approval_count=0,
                    required_linear_history=False,
                    allow_force_pushes=True,
                    branch_deletion=True,
                    status_checks=False,
                    enforce_admins=False,
                    require_code_owner_reviews=False,
                    require_signed_commits=False,
                    conversation_resolution=False,
                ),
                private=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                securitymd=True,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_requires_codeowners_review.repository_default_branch_requires_codeowners_review.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_codeowners_review.repository_default_branch_requires_codeowners_review import (
                repository_default_branch_requires_codeowners_review,
            )

            check = repository_default_branch_requires_codeowners_review()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not require code owner approval for changes to owned code."
            )

    def test_one_repository_with_codeowner_approval(self):
        repository_client = mock.MagicMock
        repo_name = "repo2"
        repository_client.repositories = {
            2: Repo(
                id=2,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo2",
                default_branch=Branch(
                    name="main",
                    protected=True,
                    default_branch=True,
                    require_pull_request=True,
                    approval_count=1,
                    required_linear_history=True,
                    allow_force_pushes=False,
                    branch_deletion=False,
                    status_checks=True,
                    enforce_admins=True,
                    require_code_owner_reviews=True,
                    require_signed_commits=True,
                    conversation_resolution=True,
                ),
                private=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                securitymd=True,
                codeowners_exists=True,
                secret_scanning_enabled=True,
                dependabot_alerts_enabled=True,
                delete_branch_on_merge=True,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_requires_codeowners_review.repository_default_branch_requires_codeowners_review.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_codeowners_review.repository_default_branch_requires_codeowners_review import (
                repository_default_branch_requires_codeowners_review,
            )

            check = repository_default_branch_requires_codeowners_review()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 2
            assert result[0].resource_name == repo_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} requires code owner approval for changes to owned code."
            )
```

--------------------------------------------------------------------------------

````
