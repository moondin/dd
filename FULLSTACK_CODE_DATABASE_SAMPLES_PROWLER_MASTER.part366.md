---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 366
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 366 of 867)

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

---[FILE: repository_service.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_service.py
Signals: Pydantic

```python
from datetime import datetime
from typing import Optional

import github
import requests
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.github.lib.service.service import GithubService
from prowler.providers.github.models import GithubAppIdentityInfo


class Repository(GithubService):
    def __init__(self, provider):
        super().__init__(__class__.__name__, provider)
        self.repositories = self._list_repositories()

    def _file_exists(self, repo, filename):
        """Check if a file exists in the repository. Returns True if exists, False if not, None if error."""
        try:
            return repo.get_contents(filename) is not None
        except Exception as error:
            if "404" in str(error):
                return False
            else:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                return None

    def _validate_repository_format(self, repo_name: str) -> bool:
        """
        Validate repository name format.

        Args:
            repo_name: Repository name to validate

        Returns:
            bool: True if format is valid, False otherwise
        """
        if not repo_name or "/" not in repo_name:
            return False

        parts = repo_name.split("/")
        if len(parts) != 2:
            return False

        owner, repo = parts
        # Ensure both owner and repo names are non-empty
        if not owner.strip() or not repo.strip():
            return False

        return True

    def _get_accessible_repos_graphql(self) -> list[str]:
        """
        Use the GitHub GraphQL API to list all repositories that the authentication token has access to.
        This works with high-granularity (fine-grained) PATs.
        """
        graphql_url = "https://api.github.com/graphql"
        token = self.provider.session.token
        headers = {
            "Authorization": f"bearer {token}",
            "Content-Type": "application/json",
        }
        query = """
        {
          viewer {
            repositories(first: 100, affiliations: [OWNER, ORGANIZATION_MEMBER]) {
              nodes {
                nameWithOwner
              }
            }
          }
        }
        """

        try:
            response = requests.post(
                graphql_url, json={"query": query}, headers=headers
            )
            response.raise_for_status()
            data = response.json()

            if "errors" in data:
                logger.error(f"Error in GraphQL query: {data['errors']}")
                return []

            repo_nodes = (
                data.get("data", {})
                .get("viewer", {})
                .get("repositories", {})
                .get("nodes", [])
            )
            return [repo["nameWithOwner"] for repo in repo_nodes]

        except requests.exceptions.RequestException as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return []

    def _list_repositories(self):
        """
        List repositories based on provider scoping configuration.
        If the provider is a GitHub App, it will list repositories in the organizations that the GitHub App is installed in.
        If the provider is a user, it will list repositories where the user is a member or owner.
        If input repositories are provided, it will list repositories that match the input repositories.
        If input organizations are provided, it will list repositories in the organizations that match the input organizations.
        """
        logger.info("Repository - Listing Repositories...")
        repos = {}
        try:
            for client in self.clients:
                if (
                    self.provider.repositories
                    or self.provider.organizations
                    or (
                        isinstance(self.provider.identity, GithubAppIdentityInfo)
                        and self.provider.identity.installations
                    )
                ):
                    if self.provider.repositories:
                        logger.info(
                            f"Filtering for specific repositories: {self.provider.repositories}"
                        )
                        for repo_name in self.provider.repositories:
                            if not self._validate_repository_format(repo_name):
                                logger.warning(
                                    f"Repository name '{repo_name}' should be in 'owner/repo-name' format. Skipping."
                                )
                                continue
                            try:
                                repo = client.get_repo(repo_name)
                                self._process_repository(repo, repos)
                            except Exception as error:
                                self._handle_github_api_error(
                                    error, "accessing repository", repo_name
                                )

                    if self.provider.organizations:
                        logger.info(
                            f"Filtering for repositories in organizations: {self.provider.organizations}"
                        )
                        for org_name in self.provider.organizations:
                            try:
                                repos_list, _ = self._get_repositories_from_owner(
                                    client, org_name
                                )
                                for repo in repos_list:
                                    self._process_repository(repo, repos)
                            except Exception as error:
                                self._handle_github_api_error(
                                    error, "processing organization", org_name
                                )
                    elif (
                        isinstance(self.provider.identity, GithubAppIdentityInfo)
                        and self.provider.identity.installations
                        and not self.provider.repositories
                    ):
                        logger.info(
                            f"Filtering for repositories in the organizations or accounts that the GitHub App is installed in: {', '.join(self.provider.identity.installations)}"
                        )
                        for org_name in self.provider.identity.installations:
                            try:
                                repos_list, _ = self._get_repositories_from_owner(
                                    client, org_name
                                )
                                for repo in repos_list:
                                    self._process_repository(repo, repos)
                            except Exception as error:
                                self._handle_github_api_error(
                                    error, "processing organization", org_name
                                )
                else:
                    logger.info(
                        "No repository or organization specified, discovering accessible repositories via GraphQL API..."
                    )
                    accessible_repo_names = self._get_accessible_repos_graphql()

                    if not accessible_repo_names:
                        logger.warning(
                            "Could not find any accessible repositories with the provided token."
                        )

                    for repo_name in accessible_repo_names:
                        try:
                            repo = client.get_repo(repo_name)
                            logger.info(
                                f"Processing repository found via GraphQL: {repo.full_name}"
                            )
                            self._process_repository(repo, repos)
                        except Exception as error:
                            if hasattr(self, "_handle_github_api_error"):
                                self._handle_github_api_error(
                                    error,
                                    "accessing repository discovered via GraphQL",
                                    repo_name,
                                )
                            else:
                                logger.error(
                                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                )

        except github.RateLimitExceededException as error:
            logger.error(f"GitHub API rate limit exceeded: {error}")
            raise
        except github.GithubException as error:
            logger.error(f"GitHub API error while listing repositories: {error}")
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return repos

    def _process_repository(self, repo, repos):
        """Process a single repository and extract all its information."""
        try:
            default_branch = repo.default_branch
            securitymd_exists = self._file_exists(repo, "SECURITY.md")
            # CODEOWNERS file can be in .github/, root, or docs/
            # https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners#codeowners-file-location
            codeowners_paths = [
                ".github/CODEOWNERS",
                "CODEOWNERS",
                "docs/CODEOWNERS",
            ]
            codeowners_files = [
                self._file_exists(repo, path) for path in codeowners_paths
            ]
            if True in codeowners_files:
                codeowners_exists = True
            elif all(file is None for file in codeowners_files):
                codeowners_exists = None
            else:
                codeowners_exists = False
            delete_branch_on_merge = (
                repo.delete_branch_on_merge
                if repo.delete_branch_on_merge is not None
                else False
            )

            require_pr = False
            approval_cnt = 0
            branch_protection = False
            required_linear_history = False
            allow_force_pushes = True
            branch_deletion = True
            require_code_owner_reviews = False
            require_signed_commits = False
            status_checks = False
            enforce_admins = False
            conversation_resolution = False
            try:
                branch = repo.get_branch(default_branch)
                if branch.protected:
                    protection = branch.get_protection()
                    if protection:
                        require_pr = (
                            protection.required_pull_request_reviews is not None
                        )
                        approval_cnt = (
                            protection.required_pull_request_reviews.required_approving_review_count
                            if require_pr
                            else 0
                        )
                        required_linear_history = protection.required_linear_history
                        allow_force_pushes = protection.allow_force_pushes
                        branch_deletion = protection.allow_deletions
                        status_checks = protection.required_status_checks is not None
                        enforce_admins = protection.enforce_admins
                        conversation_resolution = (
                            protection.required_conversation_resolution
                        )
                        branch_protection = True
                        require_code_owner_reviews = (
                            protection.required_pull_request_reviews.require_code_owner_reviews
                            if require_pr
                            else False
                        )
                        require_signed_commits = branch.get_required_signatures()
            except Exception as error:
                # If the branch is not found, it is not protected
                if "404" in str(error):
                    logger.warning(
                        f"{repo.full_name}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                # Any other error, we cannot know if the branch is protected or not
                else:
                    require_pr = None
                    approval_cnt = None
                    branch_protection = None
                    required_linear_history = None
                    allow_force_pushes = None
                    branch_deletion = None
                    require_code_owner_reviews = None
                    require_signed_commits = None
                    status_checks = None
                    enforce_admins = None
                    conversation_resolution = None
                    logger.error(
                        f"{repo.full_name}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )

            secret_scanning_enabled = False
            dependabot_alerts_enabled = False
            try:
                if (
                    repo.security_and_analysis
                    and repo.security_and_analysis.secret_scanning
                ):
                    secret_scanning_enabled = (
                        repo.security_and_analysis.secret_scanning.status == "enabled"
                    )
                try:
                    # Use get_dependabot_alerts to check if Dependabot alerts are enabled
                    repo.get_dependabot_alerts().totalCount
                    # If the call succeeds, Dependabot is enabled (even if no alerts)
                    dependabot_alerts_enabled = True
                except Exception as error:
                    error_str = str(error)
                    if (
                        "403" in error_str
                        and "Dependabot alerts are disabled for this repository."
                        in error_str
                    ):
                        dependabot_alerts_enabled = False
                    else:
                        logger.error(
                            f"{repo.full_name}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                        dependabot_alerts_enabled = None
            except Exception as error:
                logger.error(
                    f"{repo.full_name}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                secret_scanning_enabled = None
                dependabot_alerts_enabled = None
            repos[repo.id] = Repo(
                id=repo.id,
                name=repo.name,
                owner=repo.owner.login,
                full_name=repo.full_name,
                immutable_releases_enabled=self._get_repository_immutable_releases_status(
                    repo
                ),
                default_branch=Branch(
                    name=default_branch,
                    protected=branch_protection,
                    default_branch=True,
                    require_pull_request=require_pr,
                    approval_count=approval_cnt,
                    required_linear_history=required_linear_history,
                    allow_force_pushes=allow_force_pushes,
                    branch_deletion=branch_deletion,
                    status_checks=status_checks,
                    enforce_admins=enforce_admins,
                    conversation_resolution=conversation_resolution,
                    require_code_owner_reviews=require_code_owner_reviews,
                    require_signed_commits=require_signed_commits,
                ),
                private=repo.private,
                archived=repo.archived,
                pushed_at=repo.pushed_at,
                securitymd=securitymd_exists,
                codeowners_exists=codeowners_exists,
                secret_scanning_enabled=secret_scanning_enabled,
                dependabot_alerts_enabled=dependabot_alerts_enabled,
                delete_branch_on_merge=delete_branch_on_merge,
            )
        except Exception as error:
            logger.error(
                f"{repo.full_name}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_repository_immutable_releases_status(self, repo) -> Optional[bool]:
        """Retrieve the immutable releases status for the provided repository.

        The API returns a response in the format:
        {
            "enabled": true,
            "enforced_by_owner": false
        }

        Args:
            repo: The PyGithub repository instance to query.

        Returns:
            Optional[bool]: True when immutable releases are enabled, False when they are disabled, and None when the status cannot be determined.
        """
        try:
            _, response = repo._requester.requestJsonAndCheck(  # type: ignore[attr-defined]
                "GET",
                f"/repos/{repo.full_name}/immutable-releases",
                headers={
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            )
            if isinstance(response, dict) and "enabled" in response:
                return response.get("enabled")
            return None
        except github.GithubException as error:
            status_code = getattr(error, "status", None)
            if status_code == 404:
                logger.info(
                    f"{repo.full_name}: immutable releases endpoint not available for this repository."
                )
                return None
            if status_code == 403:
                logger.warning(
                    f"{repo.full_name}: insufficient permissions to query immutable releases endpoint."
                )
                return None
            self._handle_github_api_error(
                error, "fetching immutable releases status", repo.full_name
            )
        except Exception as error:
            logger.error(
                f"{repo.full_name}: {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return None


class Branch(BaseModel):
    """Model for Github Branch"""

    name: str
    protected: Optional[bool]
    default_branch: bool
    require_pull_request: Optional[bool]
    approval_count: Optional[int]
    required_linear_history: Optional[bool]
    allow_force_pushes: Optional[bool]
    branch_deletion: Optional[bool]
    status_checks: Optional[bool]
    enforce_admins: Optional[bool]
    require_code_owner_reviews: Optional[bool]
    require_signed_commits: Optional[bool]
    conversation_resolution: Optional[bool]


class Repo(BaseModel):
    """Model for Github Repository"""

    id: int
    name: str
    owner: str
    full_name: str
    immutable_releases_enabled: Optional[bool] = None
    default_branch: Branch
    private: bool
    archived: bool
    pushed_at: datetime
    securitymd: Optional[bool]
    codeowners_exists: Optional[bool]
    secret_scanning_enabled: Optional[bool]
    dependabot_alerts_enabled: Optional[bool]
    delete_branch_on_merge: Optional[bool]
```

--------------------------------------------------------------------------------

---[FILE: repository_branch_delete_on_merge_enabled.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_branch_delete_on_merge_enabled/repository_branch_delete_on_merge_enabled.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_branch_delete_on_merge_enabled",
  "CheckTitle": "Check if a repository deletes the branch after merging",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure that the repository deletes the branch after merging.",
  "Risk": "Inactive branches pose a security risk as they can accumulate outdated code, dependencies, and potential vulnerabilities over time. Malicious actors may exploit these branches, and they can clutter the repository, making it harder to manage and track the active code. Additionally, stale branches may unintentionally be accessed or used inappropriately, leading to potential security breaches.",
  "RelatedUrl": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Regularly review and remove inactive branches from your repositories. This helps reduce the risk of malicious code injection, sensitive data leaks, and unnecessary clutter in the repository. By keeping branches active and up to date, you ensure that your codebase remains secure and manageable.",
      "Url": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_branch_delete_on_merge_enabled.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_branch_delete_on_merge_enabled/repository_branch_delete_on_merge_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_branch_delete_on_merge_enabled(Check):
    """Check if a repository deletes branches on merge

    This class verifies whether each repository deletes branches on merge.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Deletes Branch On Merge check

        Iterates over all repositories and checks if they delete branches on merge.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            report = CheckReportGithub(metadata=self.metadata(), resource=repo)
            report.status = "FAIL"
            report.status_extended = f"Repository {repo.name} does not delete branches on merge in default branch ({repo.default_branch.name})."

            if repo.delete_branch_on_merge:
                report.status = "PASS"
                report.status_extended = f"Repository {repo.name} does delete branches on merge in default branch ({repo.default_branch.name})."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_deletion_disabled.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_deletion_disabled/repository_default_branch_deletion_disabled.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_default_branch_deletion_disabled",
  "CheckTitle": "Check if a repository denies default branch deletion",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure that the repository denies default branch deletion.",
  "Risk": "Allowing the deletion of protected branches by users with push access increases the risk of accidental or intentional branch removal, potentially resulting in significant data loss or disruption to the development process.",
  "RelatedUrl": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#allow-deletions",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Deny the ability to delete protected branches to ensure the preservation of critical branch data. This prevents accidental or malicious deletions and helps maintain the integrity and stability of the repository.",
      "Url": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_deletion_disabled.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_deletion_disabled/repository_default_branch_deletion_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_default_branch_deletion_disabled(Check):
    """Check if a repository denies branch deletion

    This class verifies whether each repository denies default branch deletion.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Denies Default Branch Deletion check

        Iterates over all repositories and checks if they deny default branch deletion.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.default_branch.branch_deletion is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                report.status = "FAIL"
                report.status_extended = (
                    f"Repository {repo.name} does allow default branch deletion."
                )

                if not repo.default_branch.branch_deletion:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Repository {repo.name} does deny default branch deletion."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_disallows_force_push.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_disallows_force_push/repository_default_branch_disallows_force_push.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_default_branch_disallows_force_push",
  "CheckTitle": "Check if repository denies force push",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "GithubRepository",
  "Description": "Ensure that the repository denies force push to protected branches.",
  "Risk": "Permitting force pushes to branches can lead to accidental or intentional overwrites of the commit history, resulting in potential data loss, code inconsistencies, or the introduction of malicious changes. This compromises the stability and security of the repository.",
  "RelatedUrl": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#allow-force-pushes",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable force pushes on protected branches to preserve the commit history and ensure the integrity of the repository. This measure helps prevent unintentional data loss and protects the repository from malicious changes.",
      "Url": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_disallows_force_push.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_disallows_force_push/repository_default_branch_disallows_force_push.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_default_branch_disallows_force_push(Check):
    """Check if a repository denies force push

    This class verifies whether each repository denies force push.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Denies Force Push check

        Iterates over all repositories and checks if they deny force push.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.default_branch.allow_force_pushes is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                report.status = "FAIL"
                report.status_extended = f"Repository {repo.name} does allow force pushes on default branch ({repo.default_branch.name})."

                if not repo.default_branch.allow_force_pushes:
                    report.status = "PASS"
                    report.status_extended = f"Repository {repo.name} does deny force pushes on default branch ({repo.default_branch.name})."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_protection_applies_to_admins.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_protection_applies_to_admins/repository_default_branch_protection_applies_to_admins.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_default_branch_protection_applies_to_admins",
  "CheckTitle": "Check if repository enforces admin branch protection",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "GithubRepository",
  "Description": "Ensure that the repository enforces branch protection rules for administrators.",
  "Risk": "Excluding administrators from branch protection rules introduces a significant risk of unauthorized or unreviewed changes being pushed to protected branches. This can lead to vulnerabilities, including the potential insertion of malicious code, especially if an administrator account is compromised.",
  "RelatedUrl": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#do-not-allow-bypassing-the-above-settings",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce branch protection rules for administrators to ensure they adhere to the same security and quality standards as other users. This mitigates the risk of unreviewed or untrusted code being introduced, enhancing the overall integrity of the codebase.",
      "Url": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_protection_applies_to_admins.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_protection_applies_to_admins/repository_default_branch_protection_applies_to_admins.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_default_branch_protection_applies_to_admins(Check):
    """Check if a repository enforces administrators to be subject to the same branch protection rules as other users

    This class verifies whether each repository enforces administrators to be subject to the same branch protection rules as other users.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Enforces Admin Branch Protection check

        Iterates over all repositories and checks if they enforce administrators to be subject to the same branch protection rules as other users.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository.
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.default_branch.enforce_admins is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                report.status = "FAIL"
                report.status_extended = f"Repository {repo.name} does not enforce administrators to be subject to the same branch protection rules as other users."

                if repo.default_branch.enforce_admins:
                    report.status = "PASS"
                    report.status_extended = f"Repository {repo.name} does enforce administrators to be subject to the same branch protection rules as other users."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_protection_enabled/repository_default_branch_protection_enabled.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_default_branch_protection_enabled",
  "CheckTitle": "Check if branch protection is enforced on the default branch ",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "github:user-id:repository/repository-name",
  "Severity": "critical",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure branch protection is enforced on the default branch",
  "Risk": "The absence of branch protection on the default branch increases the risk of unauthorized, unreviewed, or untested changes being merged. This can compromise the stability, security, and reliability of the codebase, which is especially critical for production deployments.",
  "RelatedUrl": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Apply branch protection rules to the default branch to ensure it is safeguarded against unauthorized or improper modifications. This helps maintain code quality, enforces proper review and testing procedures, and reduces the risk of accidental or malicious changes.",
      "Url": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule#creating-a-branch-protection-rule"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_protection_enabled.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_protection_enabled/repository_default_branch_protection_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_default_branch_protection_enabled(Check):
    """Check if a repository enforces default branch protection

    This class verifies whether each repository enforces default branch protection.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Enforces Default Branch Protection check

        Iterates over all repositories and checks if they enforce default branch protection.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.default_branch.protected is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                report.status = "FAIL"
                report.status_extended = f"Repository {repo.name} does not enforce branch protection on default branch ({repo.default_branch.name})."

                if repo.default_branch.protected:
                    report.status = "PASS"
                    report.status_extended = f"Repository {repo.name} does enforce branch protection on default branch ({repo.default_branch.name})."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_codeowners_review.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_requires_codeowners_review/repository_default_branch_requires_codeowners_review.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_default_branch_requires_codeowners_review",
  "CheckTitle": "Check if code owner approval is required for changes to owned code",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "github:user-id:repository/repository-name",
  "Severity": "high",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure that code owners are required to review and approve any proposed changes that affect their respective areas of ownership in the code base.",
  "Risk": "If code owner approval is not required, unauthorized or unqualified individuals may merge changes to sensitive or critical areas of the codebase, increasing the risk of security vulnerabilities, bugs, or malicious modifications.",
  "RelatedUrl": "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners#requiring-code-owner-review",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To require code owner review, navigate to the repository settings, click on 'Branches', add or edit a branch protection rule, and enable 'Require review from Code Owners'.",
      "Url": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-review-from-code-owners"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
