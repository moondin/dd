---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 365
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 365 of 867)

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

---[FILE: organization_service.py]---
Location: prowler-master/prowler/providers/github/services/organization/organization_service.py
Signals: Pydantic

```python
from typing import Optional

import github
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.github.lib.service.service import GithubService
from prowler.providers.github.models import GithubAppIdentityInfo


class Organization(GithubService):
    def __init__(self, provider):
        super().__init__(__class__.__name__, provider)
        self.organizations = self._list_organizations()

    def _list_organizations(self):
        """
        List organizations based on provider scoping configuration.

        Scoping behavior:
        - No scoping: Returns all organizations for authenticated user
        - Organization scoping: Returns only specified organizations
          Example: --organization org1 org2
        - Repository + Organization scoping: Returns specified organizations + repository owners
          Example: --repository owner1/repo1 --organization org2
        - Repository only: Returns empty (no organization checks)
          Example: --repository owner1/repo1

        Returns:
            dict: Dictionary of organization ID to Org objects

        Raises:
            github.GithubException: When GitHub API access fails
            github.RateLimitExceededException: When API rate limits are exceeded
        """
        logger.info("Organization - Listing Organizations...")
        organizations = {}
        org_names_to_check = set()

        try:
            clients = getattr(self, "clients", [])
            for client in clients:
                if self.provider.organizations:
                    org_names_to_check.update(self.provider.organizations)

                # If repositories are specified without organizations, don't perform organization checks
                # Only add repository owners to organization checks if organizations are also specified
                if getattr(self.provider, "repositories", None) and getattr(
                    self.provider, "organizations", None
                ):
                    for repo_name in self.provider.repositories:
                        if "/" in repo_name:
                            owner_name = repo_name.split("/")[0]
                            org_names_to_check.add(owner_name)
                            logger.info(
                                f"Adding owner '{owner_name}' from repository '{repo_name}' to organization check list"
                            )

                # If specific organizations/owners are specified, check them directly
                if org_names_to_check:
                    for org_name in org_names_to_check:
                        try:
                            try:
                                org = client.get_organization(org_name)
                                self._process_organization(org, organizations)
                            except github.GithubException as org_error:
                                # If organization fails, try as a user (personal account)
                                if "404" in str(org_error):
                                    logger.info(
                                        f"'{org_name}' not found as organization, trying as user..."
                                    )
                                    try:
                                        user = client.get_user(org_name)
                                        # Create a pseudo-organization for the user
                                        organizations[user.id] = Org(
                                            id=user.id,
                                            name=user.login,
                                            mfa_required=None,  # Users don't have MFA requirements like orgs
                                        )
                                        logger.info(
                                            f"Added user '{user.login}' as organization for checks"
                                        )
                                    except github.GithubException as user_error:
                                        if "404" in str(user_error):
                                            logger.warning(
                                                f"'{org_name}' not found as organization or user"
                                            )
                                        elif "403" in str(user_error):
                                            logger.warning(
                                                f"Access denied to '{org_name}' - insufficient permissions"
                                            )
                                        else:
                                            logger.warning(
                                                f"GitHub API error accessing '{org_name}' as user: {user_error}"
                                            )
                                    except Exception as user_error:
                                        logger.error(
                                            f"{user_error.__class__.__name__}[{user_error.__traceback__.tb_lineno}]: {user_error}"
                                        )
                                elif "403" in str(org_error):
                                    logger.warning(
                                        f"Access denied to organization '{org_name}' - insufficient permissions"
                                    )
                                else:
                                    logger.error(
                                        f"GitHub API error accessing organization '{org_name}': {org_error}"
                                    )
                        except github.RateLimitExceededException as error:
                            logger.error(
                                f"Rate limit exceeded while processing organization '{org_name}': {error}"
                            )
                            raise  # Re-raise rate limit errors as they need special handling
                        except Exception as error:
                            logger.error(
                                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                elif not getattr(self.provider, "repositories", None):
                    # Default behavior: get all organizations the user is a member of
                    # Only when no repositories are specified
                    if isinstance(self.provider.identity, GithubAppIdentityInfo):
                        orgs = client.get_organizations()
                        if getattr(orgs, "totalCount", 0) > 0:
                            for org in orgs:
                                self._process_organization(org, organizations)
                    else:
                        # Default (personal access/OAuth): use user organizations
                        orgs = client.get_user().get_orgs()
                        for org in orgs:
                            self._process_organization(org, organizations)

        except github.RateLimitExceededException as error:
            logger.error(f"GitHub API rate limit exceeded: {error}")
            raise  # Re-raise rate limit errors as they need special handling
        except github.GithubException as error:
            logger.error(f"GitHub API error while listing organizations: {error}")
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return organizations

    def _process_organization(self, org, organizations):
        """Process a single organization and extract its information."""
        try:
            require_mfa = org.two_factor_requirement_enabled
        except Exception as error:
            require_mfa = None
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        repo_creation_settings = {
            "members_can_create_repositories": None,
            "members_can_create_public_repositories": None,
            "members_can_create_private_repositories": None,
            "members_can_create_internal_repositories": None,
            "members_allowed_repository_creation_type": None,
        }

        def _extract_flag(attribute: str, expected_type: type):
            """Return attribute value if it matches expected type and is not a mock placeholder."""
            try:
                value = getattr(org, attribute, None)
                if hasattr(value, "_mock_parent"):
                    return None
                if expected_type is bool and isinstance(value, bool):
                    return value
                if expected_type is str and isinstance(value, str):
                    return value
                return None
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                return None

        repo_creation_settings["members_can_create_repositories"] = _extract_flag(
            "members_can_create_repositories", bool
        )
        repo_creation_settings["members_can_create_public_repositories"] = (
            _extract_flag("members_can_create_public_repositories", bool)
        )
        repo_creation_settings["members_can_create_private_repositories"] = (
            _extract_flag("members_can_create_private_repositories", bool)
        )
        repo_creation_settings["members_can_create_internal_repositories"] = (
            _extract_flag("members_can_create_internal_repositories", bool)
        )
        repo_creation_settings["members_allowed_repository_creation_type"] = (
            _extract_flag("members_allowed_repository_creation_type", str)
        )

        base_permission_raw = _extract_flag("default_repository_permission", str)
        base_permission = (
            base_permission_raw.lower()
            if isinstance(base_permission_raw, str)
            else None
        )

        organizations[org.id] = Org(
            id=org.id,
            name=org.login,
            mfa_required=require_mfa,
            members_can_create_repositories=repo_creation_settings[
                "members_can_create_repositories"
            ],
            members_can_create_public_repositories=repo_creation_settings[
                "members_can_create_public_repositories"
            ],
            members_can_create_private_repositories=repo_creation_settings[
                "members_can_create_private_repositories"
            ],
            members_can_create_internal_repositories=repo_creation_settings[
                "members_can_create_internal_repositories"
            ],
            members_allowed_repository_creation_type=repo_creation_settings[
                "members_allowed_repository_creation_type"
            ],
            base_permission=base_permission,
        )


class Org(BaseModel):
    """Model for Github Organization"""

    id: int
    name: str
    mfa_required: Optional[bool] = False
    members_can_create_repositories: Optional[bool] = None
    members_can_create_public_repositories: Optional[bool] = None
    members_can_create_private_repositories: Optional[bool] = None
    members_can_create_internal_repositories: Optional[bool] = None
    members_allowed_repository_creation_type: Optional[str] = None
    base_permission: Optional[str] = None
```

--------------------------------------------------------------------------------

---[FILE: organization_default_repository_permission_strict.metadata.json]---
Location: prowler-master/prowler/providers/github/services/organization/organization_default_repository_permission_strict/organization_default_repository_permission_strict.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "organization_default_repository_permission_strict",
  "CheckTitle": "Organization base repository permission is read or none",
  "CheckType": [],
  "ServiceName": "organization",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "GitHubOrganization",
  "Description": "**GitHub organization** base repository permission for members uses a **strict setting** such as `read` or `none` rather than permissive options like `write` or `admin`. *Applies to members, not outside collaborators.*",
  "Risk": "**Excessive default permissions** (`write`/`admin`) erode code **integrity** and **availability**.\n\nAny member-or a compromised account-can alter many repos, inject malicious commits, change tags/releases, or delete branches, enabling supply-chain compromise and large-scale disruptions.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Sign in to GitHub as an organization owner\n2. Go to the organization > Settings\n3. Under \"Access\" in the sidebar, click \"Member privileges\"\n4. Under \"Base permissions\", select \"Read\" (or \"None\")\n5. Click \"Change default permission\" to confirm",
      "Terraform": "```hcl\nresource \"github_organization_settings\" \"<example_resource_name>\" {\n  default_repository_permission = \"read\" # Critical: sets the org's base repository permission to a strict level (read/none passes)\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege**: set base permission to `none` or `read`.\n\nGrant higher access explicitly via teams per repo and enforce **separation of duties** with required reviews and **branch protection**. Regularly audit memberships and access to limit blast radius and maintain **defense in depth**.",
      "Url": "https://hub.prowler.com/check/organization_default_repository_permission_strict"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: organization_default_repository_permission_strict.py]---
Location: prowler-master/prowler/providers/github/services/organization/organization_default_repository_permission_strict/organization_default_repository_permission_strict.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.organization.organization_client import (
    organization_client,
)


class organization_default_repository_permission_strict(Check):
    """Check if an organization's base repository permission is set to a strict level.

    PASS: base permission is "read" or "none"
    FAIL: base permission is "write" or "admin" (or any other non-strict value)
    """

    def execute(self) -> List[CheckReportGithub]:
        findings = []
        for org in organization_client.organizations.values():
            base_perm = getattr(org, "base_permission", None)
            if base_perm is None:
                # Unknown / no permission to read → skip producing a finding
                continue

            p = str(base_perm).lower()
            report = CheckReportGithub(metadata=self.metadata(), resource=org)

            if p in ("read", "none"):
                report.status = "PASS"
                report.status_extended = f"Organization {org.name} base repository permission is '{p}', which is strict."
            else:
                report.status = "FAIL"
                report.status_extended = f"Organization {org.name} base repository permission is '{p}', which is not strict."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organization_members_mfa_required.metadata.json]---
Location: prowler-master/prowler/providers/github/services/organization/organization_members_mfa_required/organization_members_mfa_required.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "organization_members_mfa_required",
  "CheckTitle": "Organization requires members to have two-factor authentication enabled",
  "CheckType": [],
  "ServiceName": "organization",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "GitHubOrganization",
  "Description": "GitHub organization settings require all members to use **two-factor authentication** (2FA).\n\nThe evaluation determines whether access to organization resources is conditioned on members having 2FA enabled.",
  "Risk": "Without enforced **2FA**, stolen or reused passwords enable account takeover, leading to:\n- Loss of code integrity via unauthorized commits\n- Confidential data exposure from repos and secrets\n- Availability impact from settings changes, token revocation, or deletions",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/preparing-to-require-two-factor-authentication-in-your-organization",
    "https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/requiring-two-factor-authentication-in-your-organization"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Sign in to GitHub as an organization owner with 2FA enabled\n2. Go to your organization > Settings\n3. In the left sidebar, click Security > Authentication security\n4. Under Two-factor authentication, select Require two-factor authentication for everyone in your organization\n5. Click Save, then Confirm",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce org-wide **2FA** for all members and collaborators, preferring **secure methods** (passkeys, security keys, authenticator apps, GitHub Mobile) over SMS.\n\nApply **least privilege**, integrate with **SSO**, restrict token scopes, and use **branch protection** for defense-in-depth. Include bots/service accounts and define recovery options.",
      "Url": "https://hub.prowler.com/check/organization_members_mfa_required"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: organization_members_mfa_required.py]---
Location: prowler-master/prowler/providers/github/services/organization/organization_members_mfa_required/organization_members_mfa_required.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.organization.organization_client import (
    organization_client,
)


class organization_members_mfa_required(Check):
    """Check if organization members are required to have two-factor authentication enabled.

    This class verifies whether each organization requires its members to have two-factor authentication enabled.
    """

    def execute(self) -> List[CheckReportGithub]:
        """Execute the Github Organization Members MFA Required check.

        Iterates over all organizations and checks if members are required to have two-factor authentication enabled.

        Returns:
            List[CheckReportGithub]: A list of reports for each repository
        """
        findings = []
        for org in organization_client.organizations.values():
            if org.mfa_required is not None:
                report = CheckReportGithub(metadata=self.metadata(), resource=org)
                report.status = "FAIL"
                report.status_extended = f"Organization {org.name} does not require members to have two-factor authentication enabled."

                if org.mfa_required:
                    report.status = "PASS"
                    report.status_extended = f"Organization {org.name} does require members to have two-factor authentication enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organization_repository_creation_limited.metadata.json]---
Location: prowler-master/prowler/providers/github/services/organization/organization_repository_creation_limited/organization_repository_creation_limited.metadata.json

```json
{
  "Provider": "github",
  "CheckID": "organization_repository_creation_limited",
  "CheckTitle": "Ensure repository creation is limited to trusted organization members.",
  "CheckType": [],
  "ServiceName": "organization",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "GitHubOrganization",
  "Description": "Ensure that repository creation is restricted so that only trusted owners or specific teams can create new repositories within the organization.",
  "Risk": "Allowing all members to create repositories increases the likelihood of shadow repositories, data leakage, or malicious projects being introduced without oversight.",
  "RelatedUrl": "https://docs.github.com/en/organizations/managing-organization-settings/restricting-repository-creation-in-your-organization",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable repository creation for members or limit it to specific trusted teams by adjusting Member privileges in the organization's settings.",
      "Url": "https://docs.github.com/en/organizations/managing-organization-settings/restricting-repository-creation-in-your-organization"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: organization_repository_creation_limited.py]---
Location: prowler-master/prowler/providers/github/services/organization/organization_repository_creation_limited/organization_repository_creation_limited.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportGithub
from prowler.providers.github.services.organization.organization_client import (
    organization_client,
)


def _join_human_readable(items: List[str]) -> str:
    """Return a simple human readable comma-separated list."""
    if not items:
        return ""
    if len(items) == 1:
        return items[0]
    return ", ".join(items[:-1]) + f" and {items[-1]}"


class organization_repository_creation_limited(Check):
    """Check if repository creation is limited to trusted organization members."""

    def execute(self) -> List[CheckReportGithub]:
        findings = []
        for org in organization_client.organizations.values():
            repo_data = [
                getattr(org, "members_can_create_repositories", None),
                getattr(org, "members_can_create_public_repositories", None),
                getattr(org, "members_can_create_private_repositories", None),
                getattr(org, "members_can_create_internal_repositories", None),
                getattr(org, "members_allowed_repository_creation_type", None),
            ]

            if all(value is None for value in repo_data):
                continue

            report = CheckReportGithub(metadata=self.metadata(), resource=org)

            global_creation = getattr(org, "members_can_create_repositories", None)
            public_creation = getattr(
                org, "members_can_create_public_repositories", None
            )
            private_creation = getattr(
                org, "members_can_create_private_repositories", None
            )
            internal_creation = getattr(
                org, "members_can_create_internal_repositories", None
            )
            creation_type = getattr(
                org, "members_allowed_repository_creation_type", None
            )

            type_flags = []
            enabled_types = []

            if global_creation is not None:
                if global_creation:
                    enabled_types.append("repositories of any type")
                else:
                    type_flags.append(False)

            visibility_flags = [
                (public_creation, "public repositories"),
                (private_creation, "private repositories"),
                (internal_creation, "internal repositories"),
            ]

            for flag, label in visibility_flags:
                if flag is not None:
                    type_flags.append(flag)
                    if flag:
                        enabled_types.append(label)

            if creation_type:
                normalized_type = creation_type.lower()
                if normalized_type == "none":
                    type_flags.append(False)
                else:
                    creation_messages = {
                        "all": "repositories of any type",
                        "public": "public repositories",
                        "private": "private repositories",
                        "internal": "internal repositories",
                        "selected": "repositories for selected members or teams",
                    }
                    enabled_types.append(
                        creation_messages.get(
                            normalized_type, f"{creation_type} repositories"
                        )
                    )

            restricted = bool(type_flags) and all(flag is False for flag in type_flags)

            if restricted:
                report.status = "PASS"
                report.status_extended = f"Organization {org.name} has disabled repository creation for members."
            else:
                report.status = "FAIL"
                unique_enabled = list(dict.fromkeys(enabled_types))
                allowed_desc = _join_human_readable(unique_enabled)
                if allowed_desc:
                    report.status_extended = f"Organization {org.name} allows members to create {allowed_desc}."
                else:
                    report.status_extended = f"Organization {org.name} does not have enough data to confirm repository creation restrictions."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: repository_client.py]---
Location: prowler-master/prowler/providers/github/services/repository/repository_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.github.services.repository.repository_service import Repository

repository_client = Repository(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
