---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 367
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 367 of 867)

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

---[FILE: repository_default_branch_requires_codeowners_review.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_requires_codeowners_review/repository_default_branch_requires_codeowners_review.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_default_branch_requires_codeowners_review(Check):
    """Check if code owner approval is required for changes to owned code

    This class verifies whether each repository requires code owner review for changes to code they own.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Code Owner Approval Requirement check

        Iterates over all repositories and checks if they require code owner review for changes.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.default_branch.require_code_owner_reviews is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                if repo.default_branch.require_code_owner_reviews:
                    report.status = "PASS"
                    report.status_extended = f"Repository {repo.name} requires code owner approval for changes to owned code."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Repository {repo.name} does not require code owner approval for changes to owned code."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_conversation_resolution.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_requires_conversation_resolution/repository_default_branch_requires_conversation_resolution.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_default_branch_requires_conversation_resolution",
  "CheckTitle": "Check if repository requires conversation resolution before merging",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure that the repository requires conversation resolution before merging.",
  "Risk": "Leaving comments unresolved before merging code can lead to overlooked issues, including potential bugs or security vulnerabilities, that might affect the quality and security of the codebase. Unaddressed concerns could result in a lower quality of code, increasing the risk of production failures or breaches.",
  "RelatedUrl": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-conversation-resolution-before-merging",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that all comments in a code change proposal are resolved before merging. This guarantees that every reviewer’s concern is addressed, improving code quality and security by preventing issues from being ignored or overlooked.",
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

---[FILE: repository_default_branch_requires_conversation_resolution.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_requires_conversation_resolution/repository_default_branch_requires_conversation_resolution.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_default_branch_requires_conversation_resolution(Check):
    """Check if a repository requires conversation resolution

    This class verifies whether each repository requires conversation resolution.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Merging Requires Conversation Resolution check

        Iterates over all repositories and checks if they require conversation resolution.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.default_branch.conversation_resolution is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                report.status = "FAIL"
                report.status_extended = f"Repository {repo.name} does not require conversation resolution on default branch ({repo.default_branch.name})."

                if repo.default_branch.conversation_resolution:
                    report.status = "PASS"
                    report.status_extended = f"Repository {repo.name} does require conversation resolution on default branch ({repo.default_branch.name})."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_linear_history.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_requires_linear_history/repository_default_branch_requires_linear_history.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_default_branch_requires_linear_history",
  "CheckTitle": "Check if repository default branch requires linear history",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "GithubRepository",
  "Description": "Ensure that the repository default branch requires linear history.",
  "Risk": "Allowing non-linear history can result in a cluttered and difficult-to-trace Git history, making it harder to identify specific changes, debug issues, and understand the sequence of development. This increases the risk of errors, inconsistencies, and bugs, especially in production environments.",
  "RelatedUrl": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-linear-history",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce a linear history by requiring rebase or squash merges for pull requests. This will create a clean, chronological commit history, making it easier to track changes, revert modifications, and troubleshoot any issues that arise.",
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

---[FILE: repository_default_branch_requires_linear_history.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_requires_linear_history/repository_default_branch_requires_linear_history.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_default_branch_requires_linear_history(Check):
    """Check if a repository requires linear history on default branch

    This class verifies whether each repository requires linear history on the default branch.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Merging Requires Linear History check

        Iterates over all repositories and checks if they require linear history on the default branch.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.default_branch.required_linear_history is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                report.status = "FAIL"
                report.status_extended = f"Repository {repo.name} does not require linear history on default branch ({repo.default_branch.name})."

                if repo.default_branch.required_linear_history:
                    report.status = "PASS"
                    report.status_extended = f"Repository {repo.name} does require linear history on default branch ({repo.default_branch.name})."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_multiple_approvals.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_requires_multiple_approvals/repository_default_branch_requires_multiple_approvals.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_default_branch_requires_multiple_approvals",
  "CheckTitle": "Check if repositories require at least 2 code changes approvals",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "github:user-id:repository/repository-name",
  "Severity": "high",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure that repositories require at least 2 code changes approvals before merging a pull request.",
  "Risk": "If repositories do not require at least 2 code changes approvals before merging a pull request, it is possible that code changes are not being reviewed by multiple people, which could lead to the introduction of bugs or security vulnerabilities.",
  "RelatedUrl": "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/approving-a-pull-request-with-required-reviews",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To require at least 2 code changes approvals before merging a pull request, navigate to the repository settings, click on 'Branches', and then 'Add rule'.",
      "Url": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-pull-request-reviews-before-merging"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_multiple_approvals.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_requires_multiple_approvals/repository_default_branch_requires_multiple_approvals.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_default_branch_requires_multiple_approvals(Check):
    """Check if a repository enforces at least 2 approvals for code changes

    This class verifies whether each repository enforces at least 2 approvals for code changes.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository code changes enforce multi approval requirement check

        Iterates over each repository and checks if the repository enforces at least 2 approvals for code changes.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.default_branch.approval_count is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                report.status = "FAIL"
                report.status_extended = f"Repository {repo.name} does not enforce at least 2 approvals for code changes."

                if repo.default_branch.approval_count >= 2:
                    report.status = "PASS"
                    report.status_extended = f"Repository {repo.name} does enforce at least 2 approvals for code changes."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_signed_commits.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_requires_signed_commits/repository_default_branch_requires_signed_commits.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_default_branch_requires_signed_commits",
  "CheckTitle": "Check if repository requires signed commits",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "github:user-id:repository/repository-name",
  "Severity": "medium",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure that every commit in a pull request is signed and verified before merging to the default branch.",
  "Risk": "If repositories do not require signed commits, there is no way to verify the authenticity and integrity of code changes. This could allow malicious actors to impersonate legitimate contributors and introduce unauthorized or harmful changes to the codebase.",
  "RelatedUrl": "https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable the 'Require signed commits' option in branch protection rules to ensure that all commits are cryptographically signed and verified before they can be merged.",
      "Url": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-signed-commits"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_requires_signed_commits.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_requires_signed_commits/repository_default_branch_requires_signed_commits.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_default_branch_requires_signed_commits(Check):
    """Check if a repository requires signed commits

    This class verifies whether each repository requires signed commits for the default branch.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Requires Signed Commits check

        Iterates over all repositories and checks if they require signed commits.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.default_branch.require_signed_commits is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                report.status = "FAIL"
                report.status_extended = f"Repository {repo.name} does not require signed commits on default branch ({repo.default_branch.name})."

                if repo.default_branch.require_signed_commits:
                    report.status = "PASS"
                    report.status_extended = f"Repository {repo.name} does require signed commits on default branch ({repo.default_branch.name})."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_default_branch_status_checks_required.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_status_checks_required/repository_default_branch_status_checks_required.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_default_branch_status_checks_required",
  "CheckTitle": "Check if repository enforces status checks to pass",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "GithubRepository",
  "Description": "Ensure that the repository enforces status checks to pass before merging code into the main branch.",
  "Risk": "Merging code without requiring all checks to pass increases the risk of introducing bugs, vulnerabilities, or unstable changes into the codebase. This can compromise the quality, security, and functionality of the application.",
  "RelatedUrl": "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Require all predefined status checks to pass successfully before allowing code changes to be merged. This ensures that all quality, stability, and security conditions are met, reducing the likelihood of errors or vulnerabilities being introduced into the project.",
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

---[FILE: repository_default_branch_status_checks_required.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_default_branch_status_checks_required/repository_default_branch_status_checks_required.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_default_branch_status_checks_required(Check):
    """Check if a repository enforces status checks.

    This class verifies whether each repository enforces status checks.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository

        Iterates over all repositories and checks if they enforce status checks.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository.
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.default_branch.status_checks is not None:
                report = CheckReportGithub(self.metadata(), resource=repo)
                report.status = "FAIL"
                report.status_extended = (
                    f"Repository {repo.name} does not enforce status checks."
                )

                if repo.default_branch.status_checks:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Repository {repo.name} does enforce status checks."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_dependency_scanning_enabled.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_dependency_scanning_enabled/repository_dependency_scanning_enabled.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_dependency_scanning_enabled",
  "CheckTitle": "Check if package vulnerability scanning is enabled for dependencies in the repository",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "github:user-id:repository/repository-name",
  "Severity": "high",
  "ResourceType": "GitHubRepository",
  "Description": "Implement scanning tools to detect, prevent, and monitor known open-source vulnerabilities in packages used within the organization's projects. This check verifies that dependency/package vulnerability scanning (e.g., Dependabot alerts) is enabled for the repository.",
  "Risk": "If package vulnerability scanning is not enabled, known vulnerabilities in dependencies may go undetected, increasing the risk of exploitation and security breaches.",
  "RelatedUrl": "https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Dependabot alerts or another package vulnerability scanner in the repository settings to automatically detect and alert on vulnerable dependencies.",
      "Url": "https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_dependency_scanning_enabled.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_dependency_scanning_enabled/repository_dependency_scanning_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_dependency_scanning_enabled(Check):
    """Check if package vulnerability scanning (Dependabot alerts) is enabled for dependencies in the repository

    This class verifies whether each repository has package vulnerability scanning enabled.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Package Vulnerabilities Scanner check

        Iterates over all repositories and checks if package vulnerability scanning is enabled.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.dependabot_alerts_enabled is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                if repo.dependabot_alerts_enabled:
                    report.status = "PASS"
                    report.status_extended = f"Repository {repo.name} has package vulnerability scanning (Dependabot alerts) enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Repository {repo.name} does not have package vulnerability scanning (Dependabot alerts) enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_has_codeowners_file.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_has_codeowners_file/repository_has_codeowners_file.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_has_codeowners_file",
  "CheckTitle": "Check if repositories have a CODEOWNERS file",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "github:user-id:repository/repository-name",
  "Severity": "high",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure that repositories have a CODEOWNERS file.",
  "Risk": "Not having a CODEOWNERS file in a repository may lead to unclear code ownership and review responsibilities, increasing the risk of unreviewed or unauthorized changes.",
  "RelatedUrl": "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Add a CODEOWNERS file to the root, .github/, or docs/ directory of the repository. The file should specify code owners for files and directories as appropriate for your organization.",
      "Url": "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_has_codeowners_file.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_has_codeowners_file/repository_has_codeowners_file.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_has_codeowners_file(Check):
    """Check if a repository has a CODEOWNERS file

    This class verifies whether each repository has a CODEOWNERS file.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository CODEOWNERS file existence check

        Iterates over all repositories and checks if they have a CODEOWNERS file.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if repo.codeowners_exists is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                if repo.codeowners_exists:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Repository {repo.name} does have a CODEOWNERS file."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Repository {repo.name} does not have a CODEOWNERS file."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_immutable_releases_enabled.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_immutable_releases_enabled/repository_immutable_releases_enabled.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_immutable_releases_enabled",
  "CheckTitle": "Repository has immutable releases enabled",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "github:user-id:repository/repository-name",
  "Severity": "high",
  "ResourceType": "GitHubRepository",
  "Description": "Immutable releases prevent modification or replacement of published artifacts after publication. When enabled, release assets and binaries become tamper-proof, ensuring artifact integrity throughout the software supply chain.",
  "Risk": "If immutable releases are disabled, release assets can be tampered with after publication, allowing attackers to substitute malicious binaries and undermining supply chain integrity.",
  "RelatedUrl": "https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#preventing-changes-to-releases",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable immutable releases in the repository settings so release artifacts cannot be altered once published.",
      "Url": "https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/immutable-releases"
    }
  },
  "Categories": [
    "software-supply-chain"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_immutable_releases_enabled.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_immutable_releases_enabled/repository_immutable_releases_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_immutable_releases_enabled(Check):
    """Ensure immutable releases are enabled for GitHub repositories.

    Immutable releases prevent post-publication tampering of binaries and release assets.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Run the immutable releases verification for each discovered repository.

        Returns:
            List[CheckReportGithub]: Collection of check reports describing the immutable releases status.
        """
        findings: List[CheckReportGithub] = []
        for repo in repository_client.repositories.values():
            if repo.immutable_releases_enabled is None:
                continue

            report = CheckReportGithub(metadata=self.metadata(), resource=repo)

            if repo.immutable_releases_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"Repository {repo.name} has immutable releases enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Repository {repo.name} does not have immutable releases enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_inactive_not_archived.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_inactive_not_archived/repository_inactive_not_archived.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_inactive_not_archived",
  "CheckTitle": "Check for inactive repositories that are not archived",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure that repositories with no activity are reviewed and considered for archival. Inactive repositories may have outdated dependencies or security configurations that could pose security risks.",
  "Risk": "Inactive repositories that are not archived may contain outdated dependencies, unpatched vulnerabilities, or misconfigured security settings. These repositories increase the attack surface and could be targeted by malicious actors.",
  "RelatedUrl": "https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review inactive repositories and either: 1) Archive them if they are no longer needed, 2) Update their dependencies and security configurations if they are still required, or 3) Delete them if they contain no valuable information.",
      "Url": "https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_inactive_not_archived.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_inactive_not_archived/repository_inactive_not_archived.py

```python
from datetime import datetime, timezone
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_inactive_not_archived(Check):
    """Check if unarchived repositories have been inactive for more than 6 months."""

    def execute(self) -> List[CheckReportGithub]:
        findings = []

        now = datetime.now(timezone.utc)

        days_threshold = repository_client.audit_config.get(
            "inactive_not_archived_days_threshold", 180
        )

        for repo in repository_client.repositories.values():
            report = CheckReportGithub(metadata=self.metadata(), resource=repo)

            if repo.archived:
                report.status = "PASS"
                report.status_extended = f"Repository {repo.name} is properly archived."
                findings.append(report)
                continue

            latest_activity = repo.pushed_at
            days_inactive = (now - latest_activity).days

            if days_inactive >= days_threshold:
                report.status = "FAIL"
                report.status_extended = f"Repository {repo.name} has been inactive for {days_inactive} days and is not archived (threshold: {days_threshold} days)."
            else:
                report.status = "PASS"
                report.status_extended = f"Repository {repo.name} has been active within the last {days_threshold} days ({days_inactive} days ago)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_public_has_securitymd_file.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_public_has_securitymd_file/repository_public_has_securitymd_file.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_public_has_securitymd_file",
  "CheckTitle": "Check if public repositories have a SECURITY.md file",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "github:user-id:repository/repository-name",
  "Severity": "low",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure that public repositories have a SECURITY.md file",
  "Risk": "Not having a SECURITY.md file in a public repository may lead to security vulnerabilities being overlooked by users and contributors.",
  "RelatedUrl": "https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Add a SECURITY.md file to the root of the repository. The file should contain information on how to report a security vulnerability, the security policy of the repository, and any other relevant information.",
      "Url": "https://github.blog/changelog/2019-05-23-security-policy/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: repository_public_has_securitymd_file.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_public_has_securitymd_file/repository_public_has_securitymd_file.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.repository.repository_client import (
    repository_client,
)


class repository_public_has_securitymd_file(Check):
    """Check if a public repository has a SECURITY.md file

    This class verifies whether each public repository has a SECURITY.md file.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Repository Public Has SECURITY.md File check

        Iterates over all public repositories and checks if they have a SECURITY.md file.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for repo in repository_client.repositories.values():
            if not repo.private and repo.securitymd is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=repo)
                report.status = "PASS"
                report.status_extended = (
                    f"Repository {repo.name} does have a SECURITY.md file."
                )

                if not repo.securitymd:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Repository {repo.name} does not have a SECURITY.md file."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_secret_scanning_enabled.metadata.json]---
Location: prowler-master/prowler/providers/github/services/repository/repository_secret_scanning_enabled/repository_secret_scanning_enabled.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "repository_secret_scanning_enabled",
  "CheckTitle": "Check if secret scanning is enabled to detect sensitive data in the repository",
  "CheckType": [],
  "ServiceName": "repository",
  "SubServiceName": "",
  "ResourceIdTemplate": "github:user-id:repository/repository-name",
  "Severity": "high",
  "ResourceType": "GitHubRepository",
  "Description": "Ensure that scanners are in place to detect and prevent sensitive data, such as confidential ID numbers, passwords, and other sensitive information, from being committed in the source code. This check verifies that secret scanning is enabled to identify and prevent sensitive data from being included in the repository.",
  "Risk": "If secret scanning is not enabled, sensitive data may be inadvertently committed to the repository, increasing the risk of data breaches and exploitation by attackers.",
  "RelatedUrl": "https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable secret scanning in the repository settings to automatically detect and prevent sensitive data from being committed to the codebase.",
      "Url": "https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning"
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
