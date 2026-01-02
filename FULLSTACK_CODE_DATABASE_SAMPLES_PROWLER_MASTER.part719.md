---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 719
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 719 of 867)

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

---[FILE: repository_default_branch_requires_conversation_resolution_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_default_branch_requires_conversation_resolution/repository_default_branch_requires_conversation_resolution_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_default_branch_requires_conversation_resolution_test:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_requires_conversation_resolution.repository_default_branch_requires_conversation_resolution.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_conversation_resolution.repository_default_branch_requires_conversation_resolution import (
                repository_default_branch_requires_conversation_resolution,
            )

            check = repository_default_branch_requires_conversation_resolution()
            result = check.execute()
            assert len(result) == 0

    def test_conversation_resolution_disabled(self):
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
                "prowler.providers.github.services.repository.repository_default_branch_requires_conversation_resolution.repository_default_branch_requires_conversation_resolution.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_conversation_resolution.repository_default_branch_requires_conversation_resolution import (
                repository_default_branch_requires_conversation_resolution,
            )

            check = repository_default_branch_requires_conversation_resolution()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not require conversation resolution on default branch ({default_branch})."
            )

    def test_conversation_resolution_enabled(self):
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
                "prowler.providers.github.services.repository.repository_default_branch_requires_conversation_resolution.repository_default_branch_requires_conversation_resolution.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_conversation_resolution.repository_default_branch_requires_conversation_resolution import (
                repository_default_branch_requires_conversation_resolution,
            )

            check = repository_default_branch_requires_conversation_resolution()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does require conversation resolution on default branch ({default_branch})."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_linear_history_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_default_branch_requires_linear_history/repository_default_branch_requires_linear_history_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_default_branch_requires_linear_history_test:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_requires_linear_history.repository_default_branch_requires_linear_history.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_linear_history.repository_default_branch_requires_linear_history import (
                repository_default_branch_requires_linear_history,
            )

            check = repository_default_branch_requires_linear_history()
            result = check.execute()
            assert len(result) == 0

    def test_linear_history_disabled(self):
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
                "prowler.providers.github.services.repository.repository_default_branch_requires_linear_history.repository_default_branch_requires_linear_history.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_linear_history.repository_default_branch_requires_linear_history import (
                repository_default_branch_requires_linear_history,
            )

            check = repository_default_branch_requires_linear_history()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not require linear history on default branch ({default_branch})."
            )

    def test_linear_history_enabled(self):
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
                "prowler.providers.github.services.repository.repository_default_branch_requires_linear_history.repository_default_branch_requires_linear_history.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_linear_history.repository_default_branch_requires_linear_history import (
                repository_default_branch_requires_linear_history,
            )

            check = repository_default_branch_requires_linear_history()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does require linear history on default branch ({default_branch})."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_multiple_approvals_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_default_branch_requires_multiple_approvals/repository_default_branch_requires_multiple_approvals_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_default_branch_requires_multiple_approvals:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_requires_multiple_approvals.repository_default_branch_requires_multiple_approvals.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_multiple_approvals.repository_default_branch_requires_multiple_approvals import (
                repository_default_branch_requires_multiple_approvals,
            )

            check = repository_default_branch_requires_multiple_approvals()
            result = check.execute()
            assert len(result) == 0

    def test_repository_no_require_pull_request(self):
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
                "prowler.providers.github.services.repository.repository_default_branch_requires_multiple_approvals.repository_default_branch_requires_multiple_approvals.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_multiple_approvals.repository_default_branch_requires_multiple_approvals import (
                repository_default_branch_requires_multiple_approvals,
            )

            check = repository_default_branch_requires_multiple_approvals()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not enforce at least 2 approvals for code changes."
            )

    def test_repository_no_approvals(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name="master",
                    protected=False,
                    default_branch=True,
                    require_pull_request=True,
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
                "prowler.providers.github.services.repository.repository_default_branch_requires_multiple_approvals.repository_default_branch_requires_multiple_approvals.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_multiple_approvals.repository_default_branch_requires_multiple_approvals import (
                repository_default_branch_requires_multiple_approvals,
            )

            check = repository_default_branch_requires_multiple_approvals()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not enforce at least 2 approvals for code changes."
            )

    def test_repository_two_approvals(self):
        repository_client = mock.MagicMock
        repo_name = "repo1"
        repository_client.repositories = {
            1: Repo(
                id=1,
                name=repo_name,
                owner="account-name",
                full_name="account-name/repo1",
                default_branch=Branch(
                    name="master",
                    protected=True,
                    default_branch=True,
                    require_pull_request=True,
                    approval_count=2,
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
                "prowler.providers.github.services.repository.repository_default_branch_requires_multiple_approvals.repository_default_branch_requires_multiple_approvals.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_multiple_approvals.repository_default_branch_requires_multiple_approvals import (
                repository_default_branch_requires_multiple_approvals,
            )

            check = repository_default_branch_requires_multiple_approvals()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does enforce at least 2 approvals for code changes."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_signed_commits_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_default_branch_requires_signed_commits/repository_default_branch_requires_signed_commits_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_default_branch_requires_signed_commits:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_requires_signed_commits.repository_default_branch_requires_signed_commits.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_signed_commits.repository_default_branch_requires_signed_commits import (
                repository_default_branch_requires_signed_commits,
            )

            check = repository_default_branch_requires_signed_commits()
            result = check.execute()
            assert len(result) == 0

    def test_signed_commits_not_required(self):
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
                "prowler.providers.github.services.repository.repository_default_branch_requires_signed_commits.repository_default_branch_requires_signed_commits.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_signed_commits.repository_default_branch_requires_signed_commits import (
                repository_default_branch_requires_signed_commits,
            )

            check = repository_default_branch_requires_signed_commits()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not require signed commits on default branch ({default_branch})."
            )

    def test_signed_commits_required(self):
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
                "prowler.providers.github.services.repository.repository_default_branch_requires_signed_commits.repository_default_branch_requires_signed_commits.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_requires_signed_commits.repository_default_branch_requires_signed_commits import (
                repository_default_branch_requires_signed_commits,
            )

            check = repository_default_branch_requires_signed_commits()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does require signed commits on default branch ({default_branch})."
            )
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_status_checks_required_test.py]---
Location: prowler-master/tests/providers/github/services/repository/repository_default_branch_status_checks_required/repository_default_branch_status_checks_required_test.py

```python
from datetime import datetime, timezone
from unittest import mock

from prowler.providers.github.services.repository.repository_service import Branch, Repo
from tests.providers.github.github_fixtures import set_mocked_github_provider


class Test_repository_default_branch_status_checks_required_test:
    def test_no_repositories(self):
        repository_client = mock.MagicMock
        repository_client.repositories = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_github_provider(),
            ),
            mock.patch(
                "prowler.providers.github.services.repository.repository_default_branch_status_checks_required.repository_default_branch_status_checks_required.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_status_checks_required.repository_default_branch_status_checks_required import (
                repository_default_branch_status_checks_required,
            )

            check = repository_default_branch_status_checks_required()
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
                status_checks=False,
                archived=False,
                pushed_at=datetime.now(timezone.utc),
                private=False,
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
                "prowler.providers.github.services.repository.repository_default_branch_status_checks_required.repository_default_branch_status_checks_required.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_status_checks_required.repository_default_branch_status_checks_required import (
                repository_default_branch_status_checks_required,
            )

            check = repository_default_branch_status_checks_required()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does not enforce status checks."
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
                    status_checks=True,
                    enforce_admins=False,
                    require_code_owner_reviews=False,
                    require_signed_commits=False,
                    conversation_resolution=False,
                ),
                status_checks=True,
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
                "prowler.providers.github.services.repository.repository_default_branch_status_checks_required.repository_default_branch_status_checks_required.repository_client",
                new=repository_client,
            ),
        ):
            from prowler.providers.github.services.repository.repository_default_branch_status_checks_required.repository_default_branch_status_checks_required import (
                repository_default_branch_status_checks_required,
            )

            check = repository_default_branch_status_checks_required()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == 1
            assert result[0].resource_name == "repo1"
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Repository {repo_name} does enforce status checks."
            )
```

--------------------------------------------------------------------------------

````
