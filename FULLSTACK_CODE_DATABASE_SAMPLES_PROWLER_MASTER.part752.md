---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 752
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 752 of 867)

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

---[FILE: mongodbatlas_arguments_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/lib/arguments/mongodbatlas_arguments_test.py

```python
import argparse
from unittest.mock import MagicMock

from prowler.providers.mongodbatlas.lib.arguments import arguments


class TestMongoDBAtlasArguments:
    def setup_method(self):
        """Setup mock ArgumentParser for testing"""
        self.mock_parser = MagicMock()
        self.mock_subparsers = MagicMock()
        self.mock_mongodbatlas_parser = MagicMock()
        self.mock_auth_group = MagicMock()
        self.mock_filters_group = MagicMock()

        # Setup the mock chain
        self.mock_parser.add_subparsers.return_value = self.mock_subparsers
        self.mock_subparsers.add_parser.return_value = self.mock_mongodbatlas_parser
        self.mock_mongodbatlas_parser.add_argument_group.side_effect = [
            self.mock_auth_group,
            self.mock_filters_group,
        ]

    def test_init_parser_creates_subparser(self):
        """Test that init_parser creates the MongoDB Atlas subparser correctly"""
        # Create a mock object that has the necessary attributes
        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = self.mock_subparsers
        mock_mongodbatlas_args.common_providers_parser = MagicMock()

        # Call init_parser
        arguments.init_parser(mock_mongodbatlas_args)

        # Verify subparser was created
        self.mock_subparsers.add_parser.assert_called_once_with(
            "mongodbatlas",
            parents=[mock_mongodbatlas_args.common_providers_parser],
            help="MongoDB Atlas Provider",
        )

    def test_init_parser_creates_argument_groups(self):
        """Test that init_parser creates the correct argument groups"""
        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = self.mock_subparsers
        mock_mongodbatlas_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_mongodbatlas_args)

        # Verify argument groups were created
        assert self.mock_mongodbatlas_parser.add_argument_group.call_count == 2
        calls = self.mock_mongodbatlas_parser.add_argument_group.call_args_list
        assert calls[0][0][0] == "Authentication Modes"
        assert calls[1][0][0] == "Optional Filters"

    def test_init_parser_adds_authentication_arguments(self):
        """Test that init_parser adds all authentication arguments"""
        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = self.mock_subparsers
        mock_mongodbatlas_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_mongodbatlas_args)

        # Verify authentication arguments were added
        assert self.mock_auth_group.add_argument.call_count == 2

        # Check that all authentication arguments are present
        calls = self.mock_auth_group.add_argument.call_args_list
        auth_args = [call[0][0] for call in calls]

        assert "--atlas-public-key" in auth_args
        assert "--atlas-private-key" in auth_args

    def test_init_parser_adds_filter_arguments(self):
        """Test that init_parser adds all filter arguments"""
        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = self.mock_subparsers
        mock_mongodbatlas_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_mongodbatlas_args)

        # Verify filter arguments were added
        assert self.mock_filters_group.add_argument.call_count == 1

        # Check that all filter arguments are present
        calls = self.mock_filters_group.add_argument.call_args_list
        filter_args = [call[0][0] for call in calls]

        assert "--atlas-project-id" in filter_args

    def test_atlas_public_key_argument_configuration(self):
        """Test that atlas-public-key argument is configured correctly"""
        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = self.mock_subparsers
        mock_mongodbatlas_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_mongodbatlas_args)

        # Find the atlas-public-key argument call
        calls = self.mock_auth_group.add_argument.call_args_list
        public_key_call = None
        for call in calls:
            if call[0][0] == "--atlas-public-key":
                public_key_call = call
                break

        assert public_key_call is not None

        # Check argument configuration
        kwargs = public_key_call[1]
        assert kwargs["nargs"] == "?"
        assert kwargs["default"] is None
        assert kwargs["metavar"] == "ATLAS_PUBLIC_KEY"
        assert "MongoDB Atlas API public key" in kwargs["help"]

    def test_atlas_private_key_argument_configuration(self):
        """Test that atlas-private-key argument is configured correctly"""
        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = self.mock_subparsers
        mock_mongodbatlas_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_mongodbatlas_args)

        # Find the atlas-private-key argument call
        calls = self.mock_auth_group.add_argument.call_args_list
        private_key_call = None
        for call in calls:
            if call[0][0] == "--atlas-private-key":
                private_key_call = call
                break

        assert private_key_call is not None

        # Check argument configuration
        kwargs = private_key_call[1]
        assert kwargs["nargs"] == "?"
        assert kwargs["default"] is None
        assert kwargs["metavar"] == "ATLAS_PRIVATE_KEY"
        assert "MongoDB Atlas API private key" in kwargs["help"]

    def test_atlas_project_id_argument_configuration(self):
        """Test that atlas-project-id argument is configured correctly"""
        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = self.mock_subparsers
        mock_mongodbatlas_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_mongodbatlas_args)

        # Find the atlas-project-id argument call
        calls = self.mock_filters_group.add_argument.call_args_list
        project_id_call = None
        for call in calls:
            if call[0][0] == "--atlas-project-id":
                project_id_call = call
                break

        assert project_id_call is not None

        # Check argument configuration
        kwargs = project_id_call[1]
        assert kwargs["nargs"] == "?"
        assert kwargs["default"] is None
        assert kwargs["metavar"] == "ATLAS_PROJECT_ID"
        assert (
            "MongoDB Atlas Project ID to filter scans to a specific project"
            in kwargs["help"]
        )


class TestMongoDBAtlasArgumentsIntegration:
    def test_real_argument_parsing_with_credentials(self):
        """Test parsing arguments with MongoDB Atlas credentials"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        # Create a mock object that mimics the structure used by the init_parser function
        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = subparsers
        mock_mongodbatlas_args.common_providers_parser = common_parser

        arguments.init_parser(mock_mongodbatlas_args)

        # Parse arguments with credentials
        args = parser.parse_args(
            [
                "mongodbatlas",
                "--atlas-public-key",
                "test-public-key",
                "--atlas-private-key",
                "test-private-key",
            ]
        )

        assert args.atlas_public_key == "test-public-key"
        assert args.atlas_private_key == "test-private-key"
        assert args.atlas_project_id is None

    def test_real_argument_parsing_with_project_filter(self):
        """Test parsing arguments with project ID filter"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = subparsers
        mock_mongodbatlas_args.common_providers_parser = common_parser

        arguments.init_parser(mock_mongodbatlas_args)

        # Parse arguments with project filter
        args = parser.parse_args(
            [
                "mongodbatlas",
                "--atlas-public-key",
                "test-public-key",
                "--atlas-private-key",
                "test-private-key",
                "--atlas-project-id",
                "68b188eb2c7c3f24d41bf0d8",
            ]
        )

        assert args.atlas_public_key == "test-public-key"
        assert args.atlas_private_key == "test-private-key"
        assert args.atlas_project_id == "68b188eb2c7c3f24d41bf0d8"

    def test_real_argument_parsing_without_credentials(self):
        """Test parsing arguments without credentials (should be None)"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = subparsers
        mock_mongodbatlas_args.common_providers_parser = common_parser

        arguments.init_parser(mock_mongodbatlas_args)

        # Parse arguments without credentials
        args = parser.parse_args(["mongodbatlas"])

        assert args.atlas_public_key is None
        assert args.atlas_private_key is None
        assert args.atlas_project_id is None

    def test_real_argument_parsing_with_optional_values(self):
        """Test parsing arguments with optional values (nargs='?')"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = subparsers
        mock_mongodbatlas_args.common_providers_parser = common_parser

        arguments.init_parser(mock_mongodbatlas_args)

        # Parse arguments with flags but no values (should be None due to nargs="?")
        args = parser.parse_args(
            [
                "mongodbatlas",
                "--atlas-public-key",
                "--atlas-private-key",
                "--atlas-project-id",
            ]
        )

        assert args.atlas_public_key is None
        assert args.atlas_private_key is None
        assert args.atlas_project_id is None

    def test_real_argument_parsing_mixed_optional_values(self):
        """Test parsing arguments with some values and some without"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = subparsers
        mock_mongodbatlas_args.common_providers_parser = common_parser

        arguments.init_parser(mock_mongodbatlas_args)

        # Parse arguments with mixed values
        args = parser.parse_args(
            [
                "mongodbatlas",
                "--atlas-public-key",
                "test-public-key",
                "--atlas-private-key",  # No value provided
                "--atlas-project-id",
                "68b188eb2c7c3f24d41bf0d8",
            ]
        )

        assert args.atlas_public_key == "test-public-key"
        assert args.atlas_private_key is None
        assert args.atlas_project_id == "68b188eb2c7c3f24d41bf0d8"

    def test_validate_arguments_function(self):
        """Test that validate_arguments function works correctly"""
        # Test with valid arguments
        valid_args = MagicMock()
        valid_args.atlas_public_key = "test-public-key"
        valid_args.atlas_private_key = "test-private-key"
        valid_args.atlas_project_id = "68b188eb2c7c3f24d41bf0d8"

        is_valid, message = arguments.validate_arguments(valid_args)
        assert is_valid is True
        assert message == ""

        # Test with None values (should still be valid)
        none_args = MagicMock()
        none_args.atlas_public_key = None
        none_args.atlas_private_key = None
        none_args.atlas_project_id = None

        is_valid, message = arguments.validate_arguments(none_args)
        assert is_valid is True
        assert message == ""

    def test_real_argument_parsing_complete_configuration(self):
        """Test parsing arguments with complete configuration"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_mongodbatlas_args = MagicMock()
        mock_mongodbatlas_args.subparsers = subparsers
        mock_mongodbatlas_args.common_providers_parser = common_parser

        arguments.init_parser(mock_mongodbatlas_args)

        # Parse arguments with complete configuration
        args = parser.parse_args(
            [
                "mongodbatlas",
                "--atlas-public-key",
                "test-public-key-123",
                "--atlas-private-key",
                "test-private-key-456",
                "--atlas-project-id",
                "68b188eb2c7c3f24d41bf0d8",
            ]
        )

        assert args.atlas_public_key == "test-public-key-123"
        assert args.atlas_private_key == "test-private-key-456"
        assert args.atlas_project_id == "68b188eb2c7c3f24d41bf0d8"
```

--------------------------------------------------------------------------------

---[FILE: mongodbatlas_mutelist_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/lib/mutelist/mongodbatlas_mutelist_test.py

```python
import yaml
from mock import MagicMock

from prowler.providers.mongodbatlas.lib.mutelist.mutelist import MongoDBAtlasMutelist
from tests.lib.outputs.fixtures.fixtures import generate_finding_output

MUTELIST_FIXTURE_PATH = (
    "tests/providers/mongodbatlas/lib/mutelist/fixtures/mongodbatlas_mutelist.yaml"
)


class TestMongoDBAtlasMutelist:
    def test_get_mutelist_file_from_local_file(self):
        mutelist = MongoDBAtlasMutelist(mutelist_path=MUTELIST_FIXTURE_PATH)

        with open(MUTELIST_FIXTURE_PATH) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        assert mutelist.mutelist == mutelist_fixture
        assert mutelist.mutelist_file_path == MUTELIST_FIXTURE_PATH

    def test_get_mutelist_file_from_local_file_non_existent(self):
        mutelist_path = "tests/lib/mutelist/fixtures/not_present"
        mutelist = MongoDBAtlasMutelist(mutelist_path=mutelist_path)

        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path == mutelist_path

    def test_validate_mutelist_not_valid_key(self):
        mutelist_path = MUTELIST_FIXTURE_PATH
        with open(mutelist_path) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        mutelist_fixture["Accounts1"] = mutelist_fixture["Accounts"]
        del mutelist_fixture["Accounts"]

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_fixture)

        assert len(mutelist.validate_mutelist(mutelist_fixture)) == 0
        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path is None

    def test_is_finding_muted(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "68b188eb2c7c3f24d41bf0d8": {
                    "Checks": {
                        "clusters_authentication_enabled": {
                            "Regions": ["*"],
                            "Resources": ["test-cluster"],
                        }
                    }
                }
            }
        }

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_content)

        finding = MagicMock()
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "clusters_authentication_enabled"
        finding.status = "FAIL"
        finding.resource_name = "test-cluster"
        finding.location = "*"
        finding.resource_tags = []

        assert mutelist.is_finding_muted(finding, "68b188eb2c7c3f24d41bf0d8")

    def test_finding_is_not_muted_different_check(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "68b188eb2c7c3f24d41bf0d8": {
                    "Checks": {
                        "clusters_authentication_enabled": {
                            "Regions": ["*"],
                            "Resources": ["test-cluster"],
                        }
                    }
                }
            }
        }

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_content)

        finding = MagicMock()
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "clusters_backup_enabled"  # Different check
        finding.status = "FAIL"
        finding.resource_name = "test-cluster"
        finding.location = "*"
        finding.resource_tags = []

        assert not mutelist.is_finding_muted(finding, "68b188eb2c7c3f24d41bf0d8")

    def test_finding_is_not_muted_different_resource(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "68b188eb2c7c3f24d41bf0d8": {
                    "Checks": {
                        "clusters_authentication_enabled": {
                            "Regions": ["*"],
                            "Resources": ["test-cluster"],
                        }
                    }
                }
            }
        }

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_content)

        finding = MagicMock()
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "clusters_authentication_enabled"
        finding.status = "FAIL"
        finding.resource_name = "different-cluster"  # Different resource
        finding.location = "*"
        finding.resource_tags = []

        assert not mutelist.is_finding_muted(finding, "68b188eb2c7c3f24d41bf0d8")

    def test_finding_is_not_muted_different_account(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "68b188eb2c7c3f24d41bf0d8": {
                    "Checks": {
                        "clusters_authentication_enabled": {
                            "Regions": ["*"],
                            "Resources": ["test-cluster"],
                        }
                    }
                }
            }
        }

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_content)

        finding = MagicMock()
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "clusters_authentication_enabled"
        finding.status = "FAIL"
        finding.resource_name = "test-cluster"
        finding.location = "*"
        finding.resource_tags = []

        assert not mutelist.is_finding_muted(
            finding, "different-org-id"
        )  # Different account

    def test_is_finding_muted_with_wildcard_account(self):
        # Mutelist with wildcard account
        mutelist_content = {
            "Accounts": {
                "*": {
                    "Checks": {
                        "clusters_backup_enabled": {
                            "Regions": ["western_europe"],
                            "Resources": ["*"],
                        }
                    }
                }
            }
        }

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_content)

        finding = MagicMock()
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "clusters_backup_enabled"
        finding.status = "FAIL"
        finding.resource_name = "any-cluster"
        finding.location = "western_europe"
        finding.resource_tags = []

        assert mutelist.is_finding_muted(finding, "any-org-id")

    def test_is_finding_muted_with_wildcard_resources(self):
        # Mutelist with wildcard resources
        mutelist_content = {
            "Accounts": {
                "68b188eb2c7c3f24d41bf0d8": {
                    "Checks": {
                        "projects_auditing_enabled": {
                            "Regions": ["*"],
                            "Resources": ["*"],
                        }
                    }
                }
            }
        }

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_content)

        finding = MagicMock()
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "projects_auditing_enabled"
        finding.status = "FAIL"
        finding.resource_name = "any-project"
        finding.location = "*"
        finding.resource_tags = []

        assert mutelist.is_finding_muted(finding, "68b188eb2c7c3f24d41bf0d8")

    def test_mute_finding(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "68b188eb2c7c3f24d41bf0d8": {
                    "Checks": {
                        "clusters_authentication_enabled": {
                            "Regions": ["*"],
                            "Resources": ["test-cluster"],
                        }
                    }
                }
            }
        }

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_content)

        finding_1 = generate_finding_output(
            check_id="clusters_authentication_enabled",
            status="FAIL",
            account_uid="68b188eb2c7c3f24d41bf0d8",
            resource_uid="test-cluster",
            resource_tags=[],
            service_name="clusters",
        )

        muted_finding = mutelist.mute_finding(finding=finding_1)

        assert muted_finding.status == "MUTED"
        assert muted_finding.muted
        assert muted_finding.raw["status"] == "FAIL"

    def test_mute_finding_with_project_resource(self):
        # Mutelist for project resources
        mutelist_content = {
            "Accounts": {
                "68b188eb2c7c3f24d41bf0d8": {
                    "Checks": {
                        "projects_auditing_enabled": {
                            "Regions": ["*"],
                            "Resources": ["production-project"],
                        }
                    }
                }
            }
        }

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_content)

        finding_1 = generate_finding_output(
            check_id="projects_auditing_enabled",
            status="FAIL",
            account_uid="68b188eb2c7c3f24d41bf0d8",
            resource_uid="production-project",
            resource_tags=[],
            service_name="projects",
        )

        muted_finding = mutelist.mute_finding(finding=finding_1)

        assert muted_finding.status == "MUTED"
        assert muted_finding.muted
        assert muted_finding.raw["status"] == "FAIL"

    def test_mute_finding_with_wildcard_check(self):
        # Mutelist with wildcard check
        mutelist_content = {
            "Accounts": {
                "68b188eb2c7c3f24d41bf0d8": {
                    "Checks": {
                        "clusters_*": {
                            "Regions": ["*"],
                            "Resources": ["*"],
                        }
                    }
                }
            }
        }

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_content)

        finding_1 = generate_finding_output(
            check_id="clusters_backup_enabled",
            status="FAIL",
            account_uid="68b188eb2c7c3f24d41bf0d8",
            resource_uid="any-cluster",
            resource_tags=[],
            service_name="clusters",
        )

        muted_finding = mutelist.mute_finding(finding=finding_1)

        assert muted_finding.status == "MUTED"
        assert muted_finding.muted
        assert muted_finding.raw["status"] == "FAIL"

    def test_mute_finding_with_regex_resource_pattern(self):
        # Mutelist with regex resource pattern
        mutelist_content = {
            "Accounts": {
                "68b188eb2c7c3f24d41bf0d8": {
                    "Checks": {
                        "clusters_authentication_enabled": {
                            "Regions": ["*"],
                            "Resources": ["dev-.*", "test-.*"],
                        }
                    }
                }
            }
        }

        mutelist = MongoDBAtlasMutelist(mutelist_content=mutelist_content)

        # Test with dev- prefix
        finding_1 = generate_finding_output(
            check_id="clusters_authentication_enabled",
            status="FAIL",
            account_uid="68b188eb2c7c3f24d41bf0d8",
            resource_uid="dev-cluster-1",
            resource_tags=[],
            service_name="clusters",
        )

        muted_finding = mutelist.mute_finding(finding=finding_1)
        assert muted_finding.status == "MUTED"
        assert muted_finding.muted

        # Test with test- prefix
        finding_2 = generate_finding_output(
            check_id="clusters_authentication_enabled",
            status="FAIL",
            account_uid="68b188eb2c7c3f24d41bf0d8",
            resource_uid="test-cluster-1",
            resource_tags=[],
            service_name="clusters",
        )

        muted_finding = mutelist.mute_finding(finding=finding_2)
        assert muted_finding.status == "MUTED"
        assert muted_finding.muted

        # Test with prod- prefix (should not be muted)
        finding_3 = generate_finding_output(
            check_id="clusters_authentication_enabled",
            status="FAIL",
            account_uid="68b188eb2c7c3f24d41bf0d8",
            resource_uid="prod-cluster-1",
            resource_tags=[],
            service_name="clusters",
        )

        muted_finding = mutelist.mute_finding(finding=finding_3)
        assert muted_finding.status == "FAIL"  # Should not be muted
        assert not muted_finding.muted
```

--------------------------------------------------------------------------------

---[FILE: mongodbatlas_mutelist.yaml]---
Location: prowler-master/tests/providers/mongodbatlas/lib/mutelist/fixtures/mongodbatlas_mutelist.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Account == MongoDB Atlas Organization ID and Region == MongoDB Atlas Cluster Region
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MONGODB ATLAS MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "*":
      Checks:
        "clusters_backup_enabled":
          Regions:
            - "WESTERN_EUROPE"
          Resources:
            - "*"
          Description: "Mute clusters_backup_enabled check for all clusters in all regions"
```

--------------------------------------------------------------------------------

---[FILE: clusters_service_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/services/clusters/clusters_service_test.py

```python
from unittest.mock import MagicMock, patch

# Mock Provider.get_global_provider() before importing clusters_service
with patch(
    "prowler.providers.common.provider.Provider.get_global_provider"
) as mock_get_global_provider:
    mock_provider = MagicMock()
    mock_provider.session = MagicMock()
    mock_provider.session.base_url = "https://cloud.mongodb.com/api/atlas/v1.0"
    mock_provider.audit_config = {}
    mock_get_global_provider.return_value = mock_provider

    from prowler.providers.mongodbatlas.services.clusters.clusters_service import (
        Cluster,
        Clusters,
    )

from tests.providers.mongodbatlas.mongodbatlas_fixtures import (
    CLUSTER_ID,
    CLUSTER_NAME,
    CLUSTER_TYPE,
    MONGO_VERSION,
    PROJECT_ID,
    PROJECT_NAME,
    set_mocked_mongodbatlas_provider,
)


def mock_clusters_list_clusters(_):
    return {
        f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
            id=CLUSTER_ID,
            name=CLUSTER_NAME,
            project_id=PROJECT_ID,
            project_name=PROJECT_NAME,
            mongo_db_version=MONGO_VERSION,
            cluster_type=CLUSTER_TYPE,
            state_name="IDLE",
            encryption_at_rest_provider="AWS",
            backup_enabled=True,
            auth_enabled=True,
            ssl_enabled=True,
            provider_settings={
                "providerName": "AWS",
                "regionName": "US_EAST_1",
                "encryptEBSVolume": True,
            },
            replication_specs=[
                {
                    "regionConfigs": [
                        {
                            "regionName": "US_EAST_1",
                            "electableSpecs": {"instanceSize": "M10"},
                        }
                    ]
                }
            ],
            disk_size_gb=10.0,
            num_shards=1,
            replication_factor=3,
            auto_scaling={"diskGBEnabled": True},
            mongo_db_major_version="7.0",
            paused=False,
            pit_enabled=True,
            connection_strings={"standard": "mongodb://cluster.mongodb.net"},
            tags=[{"key": "environment", "value": "test"}],
            location="us_east_1",
        )
    }


@patch(
    "prowler.providers.mongodbatlas.services.clusters.clusters_service.Clusters._list_clusters",
    new=mock_clusters_list_clusters,
)
class Test_Clusters_Service:
    def test_get_client(self):
        clusters_service_client = Clusters(set_mocked_mongodbatlas_provider())
        assert clusters_service_client.__class__.__name__ == "Clusters"

    def test_list_clusters(self):
        clusters_service_client = Clusters(set_mocked_mongodbatlas_provider())
        assert len(clusters_service_client.clusters) == 1

        cluster_key = f"{PROJECT_ID}:{CLUSTER_NAME}"
        cluster = clusters_service_client.clusters[cluster_key]

        assert cluster.id == CLUSTER_ID
        assert cluster.name == CLUSTER_NAME
        assert cluster.project_id == PROJECT_ID
        assert cluster.project_name == PROJECT_NAME
        assert cluster.mongo_db_version == MONGO_VERSION
        assert cluster.cluster_type == CLUSTER_TYPE
        assert cluster.state_name == "IDLE"
        assert cluster.encryption_at_rest_provider == "AWS"
        assert cluster.backup_enabled is True
        assert cluster.auth_enabled is True
        assert cluster.ssl_enabled is True
        assert cluster.provider_settings["providerName"] == "AWS"
        assert cluster.provider_settings["regionName"] == "US_EAST_1"
        assert cluster.provider_settings["encryptEBSVolume"] is True
        assert cluster.disk_size_gb == 10.0
        assert cluster.num_shards == 1
        assert cluster.replication_factor == 3
        assert cluster.auto_scaling["diskGBEnabled"] is True
        assert cluster.mongo_db_major_version == "7.0"
        assert cluster.paused is False
        assert cluster.pit_enabled is True
        assert cluster.connection_strings["standard"] == "mongodb://cluster.mongodb.net"
        assert cluster.tags[0]["key"] == "environment"
        assert cluster.tags[0]["value"] == "test"
        assert cluster.location == "us_east_1"
```

--------------------------------------------------------------------------------

---[FILE: clusters_authentication_enabled_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/services/clusters/clusters_authentication_enabled/clusters_authentication_enabled_test.py

```python
from unittest import mock

# Mock Provider.get_global_provider() before importing clusters_service
with mock.patch(
    "prowler.providers.common.provider.Provider.get_global_provider"
) as mock_get_global_provider:
    mock_provider = mock.MagicMock()
    mock_provider.session = mock.MagicMock()
    mock_provider.session.base_url = "https://cloud.mongodb.com/api/atlas/v1.0"
    mock_provider.audit_config = {}
    mock_get_global_provider.return_value = mock_provider

    from prowler.providers.mongodbatlas.services.clusters.clusters_service import (
        Cluster,
    )

from tests.providers.mongodbatlas.mongodbatlas_fixtures import (
    CLUSTER_ID,
    CLUSTER_NAME,
    CLUSTER_TYPE,
    MONGO_VERSION,
    PROJECT_ID,
    PROJECT_NAME,
    STATE_NAME,
    set_mocked_mongodbatlas_provider,
)


class Test_clusters_authentication_enabled:
    def test_no_clusters(self):
        clusters_client = mock.MagicMock
        clusters_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_authentication_enabled.clusters_authentication_enabled.clusters_client",
                new=clusters_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.clusters.clusters_authentication_enabled.clusters_authentication_enabled import (
                clusters_authentication_enabled,
            )

            check = clusters_authentication_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_clusters_authentication_enabled(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                auth_enabled=True,
                ssl_enabled=False,
                backup_enabled=False,
                encryption_at_rest_provider=None,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_authentication_enabled.clusters_authentication_enabled.clusters_client",
                new=clusters_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.clusters.clusters_authentication_enabled.clusters_authentication_enabled import (
                clusters_authentication_enabled,
            )

            check = clusters_authentication_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} has authentication enabled."
            )

    def test_clusters_authentication_disabled(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                auth_enabled=False,
                ssl_enabled=False,
                backup_enabled=False,
                encryption_at_rest_provider=None,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_authentication_enabled.clusters_authentication_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_authentication_enabled.clusters_authentication_enabled import (
                clusters_authentication_enabled,
            )

            check = clusters_authentication_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} does not have authentication enabled."
            )
```

--------------------------------------------------------------------------------

````
