---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 720
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 720 of 867)

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

---[FILE: repository_dependency_scanning_enabled_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_dependency_scanning_enabled/repository_dependency_scanning_enabled_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_dependency_scanning_enabled:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_dependency_scanning_enabled.repository_dependency_scanning_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_dependency_scanning_enabled.repository_dependency_scanning_enabled import (
                repository_dependency_scanning_enabled,
            )

            check = repository_dependency_scanning_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_one_repository_no_dependabot(self):
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
                secret_scanning_enabled=True,
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
                "prowler.providers.github.services.repository.repository_dependency_scanning_enabled.repository_dependency_scanning_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_dependency_scanning_enabled.repository_dependency_scanning_enabled import (
                repository_dependency_scanning_enabled,
            )

            check = repository_dependency_scanning_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not have package vulnerability scanning (Dependabot alerts) enabled."
            )

    def test_one_repository_with_dependabot(self):
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
                secret_scanning_enabled=True,
                dependabot_alerts_enabled=True,
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_dependency_scanning_enabled.repository_dependency_scanning_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_dependency_scanning_enabled.repository_dependency_scanning_enabled import (
                repository_dependency_scanning_enabled,
            )

            check = repository_dependency_scanning_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 2
            assert result[0].resource_name == repo_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} has package vulnerability scanning (Dependabot alerts) enabled."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_has_codeowners_file_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_has_codeowners_file/repository_has_codeowners_file_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_has_codeowners_file:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_has_codeowners_file.repository_has_codeowners_file.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_has_codeowners_file.repository_has_codeowners_file import (
                repository_has_codeowners_file,
            )

            check = repository_has_codeowners_file()
            result = check.execute()
            assert len(result) == 0

    def test_one_repository_no_codeowners(self):
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
                securitymd=True,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_has_codeowners_file.repository_has_codeowners_file.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_has_codeowners_file.repository_has_codeowners_file import (
                repository_has_codeowners_file,
            )

            check = repository_has_codeowners_file()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not have a CODEOWNERS file."
            )

    def test_one_repository_with_codeowners(self):
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
                securitymd=True,
                codeowners_exists=True,
                secret_scanning_enabled=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_has_codeowners_file.repository_has_codeowners_file.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_has_codeowners_file.repository_has_codeowners_file import (
                repository_has_codeowners_file,
            )

            check = repository_has_codeowners_file()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 2
            assert result[0].resource_name == repo_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does have a CODEOWNERS file."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_immutable_releases_enabled_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_immutable_releases_enabled/repository_immutable_releases_enabled_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_immutable_releases_enabled:
    """Unit tests for the repository_immutable_releases_enabled check."""

    def _build_repo(self, immutable_releases_enabled):
        """Create a Repo instance with the provided immutable releases state."""
        default_branch = Branch(
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
        )
        return Repo(
            id=1,
            name="repo1",
            owner="account-name",
            full_name="account-name/repo1",
            immutable_releases_enabled=immutable_releases_enabled,
            default_branch=default_branch,
            private=False,
            archived=False,
            pushed_at=datetime.now(timezone.utc),
            securitymd=True,
            codeowners_exists=True,
            secret_scanning_enabled=True,
            dependabot_alerts_enabled=True,
            delete_branch_on_merge=False,
        )

    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_immutable_releases_enabled.repository_immutable_releases_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_immutable_releases_enabled.repository_immutable_releases_enabled import (
                repository_immutable_releases_enabled,
            )

            check = repository_immutable_releases_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_immutable_releases_enabled(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {1: self._build_repo(True)}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_immutable_releases_enabled.repository_immutable_releases_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_immutable_releases_enabled.repository_immutable_releases_enabled import (
                repository_immutable_releases_enabled,
            )

            check = repository_immutable_releases_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Repository repo1 has immutable releases enabled."
            )

    def test_immutable_releases_disabled(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {1: self._build_repo(False)}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_immutable_releases_enabled.repository_immutable_releases_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_immutable_releases_enabled.repository_immutable_releases_enabled import (
                repository_immutable_releases_enabled,
            )

            check = repository_immutable_releases_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Repository repo1 does not have immutable releases enabled."
            )

    def test_immutable_releases_unknown(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {1: self._build_repo(None)}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_immutable_releases_enabled.repository_immutable_releases_enabled.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_immutable_releases_enabled.repository_immutable_releases_enabled import (
                repository_immutable_releases_enabled,
            )

            check = repository_immutable_releases_enabled()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: repository_inactive_not_archived_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_inactive_not_archived/repository_inactive_not_archived_test.py

```python
from datetime import datetime, timedelta, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_inactive_not_archived:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}
        repository_client.audit_config = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_inactive_not_archived.repository_inactive_not_archived.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_inactive_not_archived.repository_inactive_not_archived import (
                repository_inactive_not_archived,
            )

            check = repository_inactive_not_archived()
            result = check.execute()
            assert len(result) == 0

    def test_repository_active_not_archived(self):
        repository_client = mock.MagicMock
        repo_name = "test-repo"
        default_branch = "main"
        now = datetime.now(timezone.utc)
        recent_activity = now - timedelta(days=30)  # 30 days ago

        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/test-repo",
                private=False,
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
                archived=False,
                pushed_at=recent_activity,
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }
        repository_client.audit_config = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_inactive_not_archived.repository_inactive_not_archived.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_inactive_not_archived.repository_inactive_not_archived import (
                repository_inactive_not_archived,
            )

            check = repository_inactive_not_archived()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} has been active within the last 180 days (30 days ago)."
            )

    def test_repository_inactive_not_archived(self):
        repository_client = mock.MagicMock
        repo_name = "test-repo"
        default_branch = "main"
        now = datetime.now(timezone.utc)
        old_activity = now - timedelta(days=200)  # 200 days ago

        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/test-repo",
                private=False,
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
                archived=False,
                pushed_at=old_activity,
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }
        repository_client.audit_config = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_inactive_not_archived.repository_inactive_not_archived.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_inactive_not_archived.repository_inactive_not_archived import (
                repository_inactive_not_archived,
            )

            check = repository_inactive_not_archived()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "FAIL"
            assert "has been inactive for 200 days" in result[0].status_extended
            assert "and is not archived" in result[0].status_extended

    def test_repository_inactive_but_archived(self):
        repository_client = mock.MagicMock
        repo_name = "test-repo"
        default_branch = "main"
        now = datetime.now(timezone.utc)
        old_activity = now - timedelta(days=200)  # 200 days ago

        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/test-repo",
                private=False,
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
                archived=True,
                pushed_at=old_activity,
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }
        repository_client.audit_config = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_inactive_not_archived.repository_inactive_not_archived.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_inactive_not_archived.repository_inactive_not_archived import (
                repository_inactive_not_archived,
            )

            check = repository_inactive_not_archived()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} is properly archived."
            )

    def test_custom_days_threshold(self):
        repository_client = mock.MagicMock
        repo_name = "test-repo"
        default_branch = "main"
        now = datetime.now(timezone.utc)
        old_activity = now - timedelta(days=50)

        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/test-repo",
                private=False,
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
                archived=False,
                pushed_at=old_activity,
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                dependabot_alerts_enabled=False,
                delete_branch_on_merge=False,
            ),
        }
        repository_client.audit_config = {"inactive_not_archived_days_threshold": 40}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_inactive_not_archived.repository_inactive_not_archived.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_inactive_not_archived.repository_inactive_not_archived import (
                repository_inactive_not_archived,
            )

            check = repository_inactive_not_archived()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == repo_name
            assert result[0].status == "FAIL"
            assert "has been inactive for 50 days" in result[0].status_extended
            assert "and is not archived" in result[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: repository_public_has_securitymd_file_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_public_has_securitymd_file/repository_public_has_securitymd_file_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_public_has_securitymd_file_test:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_public_has_securitymd_file.repository_public_has_securitymd_file.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_public_has_securitymd_file.repository_public_has_securitymd_file import (
                repository_public_has_securitymd_file,
            )

            check = repository_public_has_securitymd_file()
            result = check.execute()
            assert len(result) == 0

    def test_one_repository_no_securitymd(self):
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
                securitymd=False,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_public_has_securitymd_file.repository_public_has_securitymd_file.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_public_has_securitymd_file.repository_public_has_securitymd_file import (
                repository_public_has_securitymd_file,
            )

            check = repository_public_has_securitymd_file()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not have a SECURITY.md file."
            )

    def test_one_repository_securitymd(self):
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
                securitymd=True,
                codeowners_exists=False,
                secret_scanning_enabled=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                delete_branch_on_merge=False,
            ),
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_public_has_securitymd_file.repository_public_has_securitymd_file.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_public_has_securitymd_file.repository_public_has_securitymd_file import (
                repository_public_has_securitymd_file,
            )

            check = repository_public_has_securitymd_file()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does have a SECURITY.md file."
            )
```

--------------------------------------------------------------------------------

````
