---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 716
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 716 of 867)

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

---[FILE: github_arguments_test.py]---
Location: prowler-master/tests/providers/github/lib/arguments/github_arguments_test.py

```python
import argparse
from unittest.mock import MagicMock

from prowler.providers.github.lib.arguments import arguments


class Test_GitHubArguments:
    def setup_method(self):
        """Setup mock ArgumentParser for testing"""
        self.mock_parser = MagicMock()
        self.mock_subparsers = MagicMock()
        self.mock_github_parser = MagicMock()
        self.mock_auth_group = MagicMock()
        self.mock_scoping_group = MagicMock()

        # Setup the mock chain
        self.mock_parser.add_subparsers.return_value = self.mock_subparsers
        self.mock_subparsers.add_parser.return_value = self.mock_github_parser
        self.mock_github_parser.add_argument_group.side_effect = [
            self.mock_auth_group,
            self.mock_scoping_group,
        ]

    def test_init_parser_creates_subparser(self):
        """Test that init_parser creates the GitHub subparser correctly"""
        # Create a mock object that has the necessary attributes
        mock_github_args = MagicMock()
        mock_github_args.subparsers = self.mock_subparsers
        mock_github_args.common_providers_parser = MagicMock()

        # Call init_parser
        arguments.init_parser(mock_github_args)

        # Verify subparser was created
        self.mock_subparsers.add_parser.assert_called_once_with(
            "github",
            parents=[mock_github_args.common_providers_parser],
            help="GitHub Provider",
        )

    def test_init_parser_creates_argument_groups(self):
        """Test that init_parser creates the correct argument groups"""
        mock_github_args = MagicMock()
        mock_github_args.subparsers = self.mock_subparsers
        mock_github_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_github_args)

        # Verify argument groups were created
        assert self.mock_github_parser.add_argument_group.call_count == 2
        calls = self.mock_github_parser.add_argument_group.call_args_list
        assert calls[0][0][0] == "Authentication Modes"
        assert calls[1][0][0] == "Scan Scoping"

    def test_init_parser_adds_authentication_arguments(self):
        """Test that init_parser adds all authentication arguments"""
        mock_github_args = MagicMock()
        mock_github_args.subparsers = self.mock_subparsers
        mock_github_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_github_args)

        # Verify authentication arguments were added
        assert self.mock_auth_group.add_argument.call_count == 4

        # Check that all authentication arguments are present
        calls = self.mock_auth_group.add_argument.call_args_list
        auth_args = [call[0][0] for call in calls]

        assert "--personal-access-token" in auth_args
        assert "--oauth-app-token" in auth_args
        assert "--github-app-id" in auth_args
        # Check for either form of the github app key argument
        assert any("--github-app-key" in arg for arg in auth_args)

    def test_init_parser_adds_scoping_arguments(self):
        """Test that init_parser adds all scoping arguments"""
        mock_github_args = MagicMock()
        mock_github_args.subparsers = self.mock_subparsers
        mock_github_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_github_args)

        # Verify scoping arguments were added
        assert self.mock_scoping_group.add_argument.call_count == 2

        # Check that all scoping arguments are present
        calls = self.mock_scoping_group.add_argument.call_args_list
        scoping_args = [call[0][0] for call in calls]

        assert "--repository" in scoping_args
        assert "--organization" in scoping_args

    def test_repository_argument_configuration(self):
        """Test that repository argument is configured correctly"""
        mock_github_args = MagicMock()
        mock_github_args.subparsers = self.mock_subparsers
        mock_github_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_github_args)

        # Find the repository argument call
        calls = self.mock_scoping_group.add_argument.call_args_list
        repo_call = None
        for call in calls:
            if call[0][0] == "--repository":
                repo_call = call
                break

        assert repo_call is not None

        # Check argument configuration
        kwargs = repo_call[1]
        assert kwargs["nargs"] == "*"
        assert kwargs["default"] is None
        assert kwargs["metavar"] == "REPOSITORY"
        assert "owner/repo-name" in kwargs["help"]

    def test_organization_argument_configuration(self):
        """Test that organization argument is configured correctly"""
        mock_github_args = MagicMock()
        mock_github_args.subparsers = self.mock_subparsers
        mock_github_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_github_args)

        # Find the organization argument call
        calls = self.mock_scoping_group.add_argument.call_args_list
        org_call = None
        for call in calls:
            if call[0][0] == "--organization":
                org_call = call
                break

        assert org_call is not None

        # Check argument configuration
        kwargs = org_call[1]
        assert kwargs["nargs"] == "*"
        assert kwargs["default"] is None
        assert kwargs["metavar"] == "ORGANIZATION"
        assert "Organization or user name" in kwargs["help"]


class Test_GitHubArguments_Integration:
    def test_real_argument_parsing_no_scoping(self):
        """Test parsing arguments without scoping parameters"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        # Create a mock object that mimics the structure used by the init_parser function
        mock_github_args = MagicMock()
        mock_github_args.subparsers = subparsers
        mock_github_args.common_providers_parser = common_parser

        arguments.init_parser(mock_github_args)

        # Parse arguments without scoping
        args = parser.parse_args(["github", "--personal-access-token", "test-token"])

        assert args.personal_access_token == "test-token"
        assert args.repository is None
        assert args.organization is None

    def test_real_argument_parsing_with_repository(self):
        """Test parsing arguments with repository scoping"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_github_args = MagicMock()
        mock_github_args.subparsers = subparsers
        mock_github_args.common_providers_parser = common_parser

        arguments.init_parser(mock_github_args)

        # Parse arguments with repository scoping
        args = parser.parse_args(
            [
                "github",
                "--personal-access-token",
                "test-token",
                "--repository",
                "owner1/repo1",
                "owner2/repo2",
            ]
        )

        assert args.personal_access_token == "test-token"
        assert args.repository == ["owner1/repo1", "owner2/repo2"]
        assert args.organization is None

    def test_real_argument_parsing_with_organization(self):
        """Test parsing arguments with organization scoping"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_github_args = MagicMock()
        mock_github_args.subparsers = subparsers
        mock_github_args.common_providers_parser = common_parser

        arguments.init_parser(mock_github_args)

        # Parse arguments with organization scoping
        args = parser.parse_args(
            [
                "github",
                "--personal-access-token",
                "test-token",
                "--organization",
                "org1",
                "org2",
            ]
        )

        assert args.personal_access_token == "test-token"
        assert args.repository is None
        assert args.organization == ["org1", "org2"]

    def test_real_argument_parsing_with_both_scoping(self):
        """Test parsing arguments with both repository and organization scoping"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_github_args = MagicMock()
        mock_github_args.subparsers = subparsers
        mock_github_args.common_providers_parser = common_parser

        arguments.init_parser(mock_github_args)

        # Parse arguments with both scoping types
        args = parser.parse_args(
            [
                "github",
                "--personal-access-token",
                "test-token",
                "--repository",
                "owner1/repo1",
                "--organization",
                "org1",
            ]
        )

        assert args.personal_access_token == "test-token"
        assert args.repository == ["owner1/repo1"]
        assert args.organization == ["org1"]

    def test_real_argument_parsing_single_values(self):
        """Test parsing arguments with single repository and organization values"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_github_args = MagicMock()
        mock_github_args.subparsers = subparsers
        mock_github_args.common_providers_parser = common_parser

        arguments.init_parser(mock_github_args)

        # Parse arguments with single values
        args = parser.parse_args(
            [
                "github",
                "--personal-access-token",
                "test-token",
                "--repository",
                "owner1/repo1",
                "--organization",
                "org1",
            ]
        )

        assert args.personal_access_token == "test-token"
        assert args.repository == ["owner1/repo1"]
        assert args.organization == ["org1"]

    def test_real_argument_parsing_empty_scoping(self):
        """Test parsing arguments with empty scoping values"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_github_args = MagicMock()
        mock_github_args.subparsers = subparsers
        mock_github_args.common_providers_parser = common_parser

        arguments.init_parser(mock_github_args)

        # Parse arguments with empty scoping flags
        args = parser.parse_args(
            [
                "github",
                "--personal-access-token",
                "test-token",
                "--repository",
                "--organization",
            ]
        )

        assert args.personal_access_token == "test-token"
        assert args.repository == []
        assert args.organization == []
```

--------------------------------------------------------------------------------

---[FILE: github_mutelist_test.py]---
Location: prowler-master/tests/providers/github/lib/mutelist/github_mutelist_test.py

```python
import yaml
from mock import MagicMock

from prowler.providers.github.lib.mutelist.mutelist import GithubMutelist
from tests.lib.outputs.fixtures.fixtures import generate_finding_output

MUTELIST_FIXTURE_PATH = (
    "tests/providers/github/lib/mutelist/fixtures/github_mutelist.yaml"
)


class TestGithubMutelist:
    def test_get_mutelist_file_from_local_file(self):
        mutelist = GithubMutelist(mutelist_path=MUTELIST_FIXTURE_PATH)

        with open(MUTELIST_FIXTURE_PATH) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        assert mutelist.mutelist == mutelist_fixture
        assert mutelist.mutelist_file_path == MUTELIST_FIXTURE_PATH

    def test_get_mutelist_file_from_local_file_non_existent(self):
        mutelist_path = "tests/lib/mutelist/fixtures/not_present"
        mutelist = GithubMutelist(mutelist_path=mutelist_path)

        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path == mutelist_path

    def test_validate_mutelist_not_valid_key(self):
        mutelist_path = MUTELIST_FIXTURE_PATH
        with open(mutelist_path) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        mutelist_fixture["Accounts1"] = mutelist_fixture["Accounts"]
        del mutelist_fixture["Accounts"]

        mutelist = GithubMutelist(mutelist_content=mutelist_fixture)

        assert len(mutelist.validate_mutelist(mutelist_fixture)) == 0
        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path is None

    def test_is_finding_muted(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "account_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = GithubMutelist(mutelist_content=mutelist_content)

        finding = MagicMock()
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "check_test"
        finding.status = "FAIL"
        finding.resource_name = "test_resource"
        finding.account_name = "account_1"
        finding.location = "test-location"
        finding.resource_tags = []

        assert mutelist.is_finding_muted(finding, finding.account_name)

    def test_mute_finding(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "account_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = GithubMutelist(mutelist_content=mutelist_content)

        finding_1 = generate_finding_output(
            check_id="service_check_test",
            status="FAIL",
            account_uid="account_1",
            resource_uid="test_resource",
            resource_tags=[],
        )

        muted_finding = mutelist.mute_finding(finding=finding_1)

        assert muted_finding.status == "MUTED"
        assert muted_finding.muted
        assert muted_finding.raw["status"] == "FAIL"
```

--------------------------------------------------------------------------------

---[FILE: github_mutelist.yaml]---
Location: prowler-master/tests/providers/github/lib/mutelist/fixtures/github_mutelist.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Account == <GitHub Account Name>
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "account_1":
      Checks:
        "repository_public_has_securitymd_file":
          Regions:
            - "*"
          Resources:
            - "resource_1"
            - "resource_2"
```

--------------------------------------------------------------------------------

---[FILE: organization_service_test.py]---
Location: prowler-master/tests/providers/github/services/organization/organization_service_test.py

```python
from unittest.mock import MagicMock, patch

from github import GithubException, RateLimitExceededException

from prowler.providers.github.services.organization.organization_service import (
    Org,
    Organization,
)
from tests.providers.github.github_fixtures import set_mocked_github_provider


def mock_list_organizations(_):
    return {
        1: Org(
            id=1,
            name="test-organization",
            mfa_required=True,
        ),
    }


@patch(
    "prowler.providers.github.services.organization.organization_service.Organization._list_organizations",
    new=mock_list_organizations,
)
class Test_Repository_Service:
    def test_get_client(self):
        repository_service = Organization(set_mocked_github_provider())
        assert repository_service.clients[0].__class__.__name__ == "Github"

    def test_get_service(self):
        repository_service = Organization(set_mocked_github_provider())
        assert repository_service.__class__.__name__ == "Organization"

    def test_list_organizations(self):
        repository_service = Organization(set_mocked_github_provider())
        assert len(repository_service.organizations) == 1
        assert repository_service.organizations[1].name == "test-organization"
        assert repository_service.organizations[1].mfa_required


class Test_Organization_Scoping:
    def setup_method(self):
        self.mock_org1 = MagicMock()
        self.mock_org1.id = 1
        self.mock_org1.login = "test-org1"
        self.mock_org1.two_factor_requirement_enabled = True
        self.mock_org1.default_repository_permission = None

        self.mock_org2 = MagicMock()
        self.mock_org2.id = 2
        self.mock_org2.login = "test-org2"
        self.mock_org2.two_factor_requirement_enabled = False
        self.mock_org2.default_repository_permission = None

        self.mock_user = MagicMock()
        self.mock_user.id = 100
        self.mock_user.login = "test-user"

    def test_no_organization_scoping(self):
        """Test that all user organizations are returned when no scoping is specified"""
        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = []

        mock_client = MagicMock()
        mock_user = MagicMock()
        mock_orgs = MagicMock()
        mock_orgs.totalCount = 2
        mock_orgs.__iter__ = MagicMock(
            return_value=iter([self.mock_org1, self.mock_org2])
        )
        mock_user.get_orgs.return_value = mock_orgs
        mock_client.get_user.return_value = mock_user

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            assert len(orgs) == 2
            assert 1 in orgs
            assert 2 in orgs
            assert orgs[1].name == "test-org1"
            assert orgs[2].name == "test-org2"

    def test_no_organizations_found_for_user(self):
        """Test that when user has no organizations, empty dict is returned"""
        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = []

        mock_client = MagicMock()
        mock_user = MagicMock()
        mock_orgs = MagicMock()
        mock_orgs.totalCount = 0
        mock_user.get_orgs.return_value = mock_orgs
        mock_client.get_user.return_value = mock_user

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            assert len(orgs) == 0

    def test_github_app_organization_scoping(self):
        """Test GitHub App organization listing"""
        from prowler.providers.github.models import GithubAppIdentityInfo

        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = []
        # Set GitHub App identity
        provider.identity = GithubAppIdentityInfo(
            app_id="test-app-id",
            app_name="test-app",
            installations=["test-org1", "test-org2"],
        )

        mock_client = MagicMock()
        mock_orgs = MagicMock()
        mock_orgs.totalCount = 2
        mock_orgs.__iter__ = MagicMock(
            return_value=iter([self.mock_org1, self.mock_org2])
        )
        mock_client.get_organizations.return_value = mock_orgs

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            assert len(orgs) == 2
            assert 1 in orgs
            assert 2 in orgs
            assert orgs[1].name == "test-org1"
            assert orgs[2].name == "test-org2"

    def test_github_app_no_organizations_found(self):
        """Test GitHub App when no organizations are accessible"""
        from prowler.providers.github.models import GithubAppIdentityInfo

        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = []
        # Set GitHub App identity
        provider.identity = GithubAppIdentityInfo(
            app_id="test-app-id", app_name="test-app", installations=[]
        )

        mock_client = MagicMock()
        mock_orgs = MagicMock()
        mock_orgs.totalCount = 0
        mock_client.get_organizations.return_value = mock_orgs

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            assert len(orgs) == 0

    def test_base_permission_extraction(self):
        """Test that base_permission is populated from organization's default_repository_permission"""
        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = ["test-org1"]

        mock_client = MagicMock()
        # Organization with default_repository_permission set to "read"
        org_with_perm = MagicMock()
        org_with_perm.id = 1
        org_with_perm.login = "test-org1"
        org_with_perm.two_factor_requirement_enabled = True
        org_with_perm.default_repository_permission = "read"
        mock_client.get_organization.return_value = org_with_perm

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            assert len(orgs) == 1
            assert 1 in orgs
            assert orgs[1].name == "test-org1"
            assert orgs[1].base_permission == "read"

    def test_specific_organization_scoping(self):
        """Test that only specified organizations are returned"""
        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = ["test-org1"]

        mock_client = MagicMock()
        mock_client.get_organization.return_value = self.mock_org1

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            assert len(orgs) == 1
            assert 1 in orgs
            assert orgs[1].name == "test-org1"
            assert orgs[1].mfa_required is True
            mock_client.get_organization.assert_called_once_with("test-org1")

    def test_multiple_organization_scoping(self):
        """Test that multiple specified organizations are returned"""
        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = ["test-org1", "test-org2"]

        mock_client = MagicMock()
        mock_client.get_organization.side_effect = [self.mock_org1, self.mock_org2]

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            assert len(orgs) == 2
            assert 1 in orgs
            assert 2 in orgs
            assert orgs[1].name == "test-org1"
            assert orgs[2].name == "test-org2"
            assert mock_client.get_organization.call_count == 2

    def test_organization_as_user_fallback(self):
        """Test that organization scoping falls back to user when organization not found"""
        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = ["test-user"]

        mock_client = MagicMock()
        # Organization lookup fails
        mock_client.get_organization.side_effect = GithubException(
            404, "Not Found", None
        )
        # User lookup succeeds
        mock_client.get_user.return_value = self.mock_user

        # Create service without calling the parent constructor
        organization_service = Organization.__new__(Organization)
        organization_service.clients = [mock_client]
        organization_service.provider = provider

        orgs = organization_service._list_organizations()

        assert len(orgs) == 1
        assert 100 in orgs
        assert orgs[100].name == "test-user"
        assert orgs[100].mfa_required is None  # Users don't have MFA requirements
        mock_client.get_organization.assert_called_once_with("test-user")
        mock_client.get_user.assert_called_once_with("test-user")

    def test_repository_only_scoping_no_organization_checks(self):
        """Test that repository-only scoping does NOT perform organization checks"""
        provider = set_mocked_github_provider()
        provider.repositories = ["owner1/repo1", "owner2/repo2"]
        provider.organizations = []

        mock_client = MagicMock()

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            # Should be empty - no organization checks when only repositories are specified
            assert len(orgs) == 0
            # Should not call get_organization at all
            mock_client.get_organization.assert_not_called()
            mock_client.get_user.assert_not_called()

    def test_combined_repository_and_organization_scoping(self):
        """Test that both repository owners and specified organizations are included"""
        provider = set_mocked_github_provider()
        provider.repositories = ["owner1/repo1"]
        provider.organizations = ["specific-org"]

        mock_client = MagicMock()
        # Mock different organizations for owner1 and specific-org
        mock_owner_org = MagicMock()
        mock_owner_org.id = 1
        mock_owner_org.login = "owner1"
        mock_owner_org.two_factor_requirement_enabled = True
        mock_owner_org.default_repository_permission = None

        mock_specific_org = MagicMock()
        mock_specific_org.id = 2
        mock_specific_org.login = "specific-org"
        mock_specific_org.two_factor_requirement_enabled = False
        mock_specific_org.default_repository_permission = None

        mock_client.get_organization.side_effect = [
            mock_owner_org,
            mock_specific_org,
        ]

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            assert len(orgs) == 2
            assert 1 in orgs
            assert 2 in orgs
            assert orgs[1].name == "owner1"
            assert orgs[2].name == "specific-org"
            assert mock_client.get_organization.call_count == 2

    def test_organization_not_found(self):
        """Test that inaccessible organizations are skipped with warning"""
        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = ["nonexistent-org"]

        mock_client = MagicMock()
        # Both organization and user lookups fail
        mock_client.get_organization.side_effect = Exception("404 Not Found")
        mock_client.get_user.side_effect = Exception("404 Not Found")

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            # Should be empty since organization/user wasn't found
            assert len(orgs) == 0

    def test_organization_error_handling(self):
        """Test that other errors (non-404) are handled gracefully"""
        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = ["error-org"]

        mock_client = MagicMock()
        # Organization lookup fails with non-404 error
        mock_client.get_organization.side_effect = Exception(
            "500 Internal Server Error"
        )

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            # Should be empty since organization wasn't accessible
            assert len(orgs) == 0

    def test_duplicate_organizations_handling(self):
        """Test that duplicate organizations (e.g., from repositories and organizations) are handled correctly"""
        provider = set_mocked_github_provider()
        provider.repositories = ["test-org1/repo1"]
        provider.organizations = ["test-org1"]  # Same organization specified twice

        mock_client = MagicMock()
        mock_client.get_organization.return_value = self.mock_org1

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            orgs = organization_service._list_organizations()

            # Should only have one organization despite being specified twice
            assert len(orgs) == 1
            assert 1 in orgs
            assert orgs[1].name == "test-org1"
            # Should only call get_organization once due to set deduplication
            mock_client.get_organization.assert_called_once_with("test-org1")


class Test_Organization_ErrorHandling:
    def setup_method(self):
        self.mock_org1 = MagicMock()
        self.mock_org1.id = 1
        self.mock_org1.login = "test-org1"
        self.mock_org1.two_factor_requirement_enabled = True
        self.mock_org1.default_repository_permission = None

    def test_github_api_error_handling(self):
        """Test that GitHub API errors are handled properly"""
        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = ["test-org1"]

        mock_client = MagicMock()
        mock_client.get_organization.side_effect = GithubException(
            403, "Forbidden", None
        )

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            with patch(
                "prowler.providers.github.services.organization.organization_service.logger"
            ) as mock_logger:
                orgs = organization_service._list_organizations()

                # Should be empty due to API error
                assert len(orgs) == 0
                # Should log specific error message
                mock_logger.warning.assert_called()
                # Check if Access denied message was logged (could be in warning or error calls)
                log_messages = [
                    str(call)
                    for call in mock_logger.warning.call_args_list
                    + mock_logger.error.call_args_list
                ]
                assert any("Access denied" in msg for msg in log_messages)

    def test_rate_limit_error_handling(self):
        """Test that rate limit errors are logged appropriately"""
        provider = set_mocked_github_provider()
        provider.repositories = []
        provider.organizations = ["test-org1"]

        mock_client = MagicMock()
        mock_client.get_organization.side_effect = RateLimitExceededException(
            429, "Rate limit exceeded", None
        )

        with patch(
            "prowler.providers.github.services.organization.organization_service.GithubService.__init__"
        ):
            organization_service = Organization(provider)
            organization_service.clients = [mock_client]
            organization_service.provider = provider

            with patch(
                "prowler.providers.github.services.organization.organization_service.logger"
            ) as mock_logger:
                # Rate limit errors should be caught and logged at the outer level
                orgs = organization_service._list_organizations()

                # Should be empty due to rate limit error
                assert len(orgs) == 0
                # Should log rate limit error
                mock_logger.error.assert_called()
                assert "Rate limit exceeded" in str(mock_logger.error.call_args)
```

--------------------------------------------------------------------------------

````
