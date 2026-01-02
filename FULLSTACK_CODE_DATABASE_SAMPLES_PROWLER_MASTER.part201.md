---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 201
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 201 of 867)

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

---[FILE: parser.py]---
Location: prowler-master/prowler/lib/cli/parser.py

```python
import argparse
import sys
from argparse import RawTextHelpFormatter

from dashboard.lib.arguments.arguments import init_dashboard_parser
from prowler.config.config import (
    available_compliance_frameworks,
    available_output_formats,
    check_current_version,
    default_config_file_path,
    default_fixer_config_file_path,
    default_output_directory,
)
from prowler.lib.check.models import Severity
from prowler.lib.outputs.common import Status
from prowler.providers.common.arguments import (
    init_providers_parser,
    validate_asff_usage,
    validate_provider_arguments,
)


class ProwlerArgumentParser:
    # Set the default parser
    def __init__(self):
        # CLI Arguments
        self.parser = argparse.ArgumentParser(
            prog="prowler",
            formatter_class=RawTextHelpFormatter,
            usage="prowler [-h] [--version] {aws,azure,gcp,kubernetes,m365,github,nhn,mongodbatlas,oraclecloud,alibabacloud,dashboard,iac} ...",
            epilog="""
Available Cloud Providers:
  {aws,azure,gcp,kubernetes,m365,github,iac,llm,nhn,mongodbatlas,oraclecloud,alibabacloud}
    aws                 AWS Provider
    azure               Azure Provider
    gcp                 GCP Provider
    kubernetes          Kubernetes Provider
    m365                Microsoft 365 Provider
    github              GitHub Provider
    oraclecloud         Oracle Cloud Infrastructure Provider
    alibabacloud        Alibaba Cloud Provider
    iac                 IaC Provider (Beta)
    llm                 LLM Provider (Beta)
    nhn                 NHN Provider (Unofficial)
    mongodbatlas        MongoDB Atlas Provider (Beta)

Available components:
    dashboard           Local dashboard

To see the different available options on a specific component, run:
    prowler {provider|dashboard} -h|--help

Detailed documentation at https://docs.prowler.com
""",
        )
        # Default
        self.parser.add_argument(
            "--version",
            "-v",
            action="store_true",
            help="show Prowler version",
        )
        # Common arguments parser
        self.common_providers_parser = argparse.ArgumentParser(add_help=False)

        # Providers Parser
        self.subparsers = self.parser.add_subparsers(
            title="Available Cloud Providers", dest="provider", help=argparse.SUPPRESS
        )

        self.__init_outputs_parser__()
        self.__init_logging_parser__()
        self.__init_checks_parser__()
        self.__init_exclude_checks_parser__()
        self.__init_list_checks_parser__()
        self.__init_mutelist_parser__()
        self.__init_config_parser__()
        self.__init_custom_checks_metadata_parser__()
        self.__init_third_party_integrations_parser__()

        # Init Providers Arguments
        init_providers_parser(self)

        # Dashboard Parser
        init_dashboard_parser(self)

    def parse(self, args=None) -> argparse.Namespace:
        """
        parse is a wrapper to call parse_args() and do some validation
        """
        # We can override sys.argv
        if args:
            sys.argv = args

        if len(sys.argv) == 2 and sys.argv[1] in ("-v", "--version"):
            print(check_current_version())
            sys.exit(0)

        # Set AWS as the default provider if no provider is supplied
        if len(sys.argv) == 1:
            sys.argv = self.__set_default_provider__(sys.argv)

        # Help and Version flags cannot set a default provider
        if (
            len(sys.argv) >= 2
            and (sys.argv[1] not in ("-h", "--help"))
            and (sys.argv[1] not in ("-v", "--version"))
        ):
            # Since the provider is always the second argument, we are checking if
            # a flag, starting by "-", is supplied
            if "-" in sys.argv[1]:
                sys.argv = self.__set_default_provider__(sys.argv)

            # Provider aliases mapping
            # Microsoft 365
            elif sys.argv[1] == "microsoft365":
                sys.argv[1] = "m365"
            # Oracle Cloud Infrastructure
            elif sys.argv[1] == "oci":
                sys.argv[1] = "oraclecloud"

        # Parse arguments
        args = self.parser.parse_args()

        # A provider is always required
        if not args.provider:
            self.parser.error(
                "A provider/component is required to see its specific help options."
            )

        # Only Logging Configuration
        if args.provider != "dashboard" and (args.only_logs or args.list_checks_json):
            args.no_banner = True

        # Extra validation for provider arguments
        valid, message = validate_provider_arguments(args)
        if not valid:
            self.parser.error(f"{args.provider}: {message}")

        asff_is_valid, asff_error = validate_asff_usage(
            args.provider, getattr(args, "output_formats", None)
        )
        if not asff_is_valid:
            self.parser.error(asff_error)

        return args

    def __set_default_provider__(self, args: list) -> list:
        default_args = [args[0]]
        provider = "aws"
        default_args.append(provider)
        default_args.extend(args[1:])
        # Save the arguments with the default provider included
        return default_args

    def __init_outputs_parser__(self):
        # Outputs
        common_outputs_parser = self.common_providers_parser.add_argument_group(
            "Outputs"
        )
        common_outputs_parser.add_argument(
            "--status",
            nargs="+",
            help=f"Filter by the status of the findings {[status.value for status in Status]}",
            choices=[status.value for status in Status],
        )
        common_outputs_parser.add_argument(
            "--output-formats",
            "--output-modes",
            "-M",
            nargs="+",
            help="Output modes, by default csv and json-oscf are saved. When using AWS Security Hub integration, json-asff output is also saved.",
            default=["csv", "json-ocsf", "html"],
            choices=available_output_formats,
        )
        common_outputs_parser.add_argument(
            "--output-filename",
            "-F",
            nargs="?",
            help="Custom output report name without the file extension, if not specified will use default output/prowler-output-ACCOUNT_NUM-OUTPUT_DATE.format",
        )
        common_outputs_parser.add_argument(
            "--output-directory",
            "-o",
            nargs="?",
            help="Custom output directory, by default the folder where Prowler is stored",
            default=default_output_directory,
        )
        common_outputs_parser.add_argument(
            "--verbose",
            action="store_true",
            help="Runs showing all checks executed and results",
        )
        common_outputs_parser.add_argument(
            "--ignore-exit-code-3",
            "-z",
            action="store_true",
            help="Failed checks do not trigger exit code 3",
        )
        common_outputs_parser.add_argument(
            "--no-banner", "-b", action="store_true", help="Hide Prowler banner"
        )
        common_outputs_parser.add_argument(
            "--no-color",
            action="store_true",
            help="Disable color codes in output",
        )

        common_outputs_parser.add_argument(
            "--unix-timestamp",
            action="store_true",
            default=False,
            help="Set the output timestamp format as unix timestamps instead of iso format timestamps (default mode).",
        )

    def __init_logging_parser__(self):
        # Logging Options
        # Both options can be combined to only report to file some log level
        common_logging_parser = self.common_providers_parser.add_argument_group(
            "Logging"
        )
        common_logging_parser.add_argument(
            "--log-level",
            choices=["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"],
            default="CRITICAL",
            help="Select Log Level",
        )
        common_logging_parser.add_argument(
            "--log-file",
            nargs="?",
            help="Set log file name",
        )
        common_logging_parser.add_argument(
            "--only-logs",
            action="store_true",
            help="Print only Prowler logs by the stdout. This option sets --no-banner.",
        )

    def __init_exclude_checks_parser__(self):
        # Exclude checks options
        exclude_checks_parser = self.common_providers_parser.add_argument_group(
            "Exclude checks/services to run"
        )
        exclude_checks_parser.add_argument(
            "--excluded-check",
            "--excluded-checks",
            "-e",
            nargs="+",
            help="Checks to exclude",
        )
        exclude_checks_parser.add_argument(
            "--excluded-checks-file",
            nargs="?",
            help="JSON file containing the checks to be excluded. See config/checklist_example.json",
        )
        exclude_checks_parser.add_argument(
            "--excluded-service",
            "--excluded-services",
            nargs="+",
            help="Services to exclude",
        )

    def __init_checks_parser__(self):
        # Set checks to execute
        common_checks_parser = self.common_providers_parser.add_argument_group(
            "Specify checks/services to run"
        )
        # The following arguments needs to be set exclusivelly
        group = common_checks_parser.add_mutually_exclusive_group()
        group.add_argument(
            "--check",
            "--checks",
            "-c",
            nargs="+",
            help="List of checks to be executed.",
        )
        group.add_argument(
            "--checks-file",
            "-C",
            nargs="?",
            help="JSON file containing the checks to be executed. See config/checklist_example.json",
        )
        group.add_argument(
            "--service",
            "--services",
            "-s",
            nargs="+",
            help="List of services to be executed.",
        )
        common_checks_parser.add_argument(
            "--severity",
            "--severities",
            nargs="+",
            help=f"Severities to be executed {[severity.value for severity in Severity]}",
            choices=[severity.value for severity in Severity],
        )
        group.add_argument(
            "--compliance",
            nargs="+",
            help="Compliance Framework to check against for. The format should be the following: framework_version_provider (e.g.: cis_3.0_aws)",
            choices=available_compliance_frameworks,
        )
        group.add_argument(
            "--category",
            "--categories",
            nargs="+",
            help="List of categories to be executed.",
            default=[],
            # TODO: Pending validate choices
        )
        common_checks_parser.add_argument(
            "--checks-folder",
            "-x",
            nargs="?",
            help="Specify external directory with custom checks (each check must have a folder with the required files, see more in https://docs.prowler.com/user-guide/cli/tutorials/misc#custom-checks-in-prowler).",
        )

    def __init_list_checks_parser__(self):
        # List checks options
        list_checks_parser = self.common_providers_parser.add_argument_group(
            "List checks/services/categories/compliance-framework checks"
        )
        list_group = list_checks_parser.add_mutually_exclusive_group()
        list_group.add_argument(
            "--list-checks", "-l", action="store_true", help="List checks"
        )
        list_group.add_argument(
            "--list-checks-json",
            action="store_true",
            help="Output a list of checks in json format to use with --checks-file option",
        )
        list_group.add_argument(
            "--list-services",
            action="store_true",
            help="List covered services by given provider",
        )
        list_group.add_argument(
            "--list-compliance",
            "--list-compliances",
            action="store_true",
            help="List all available compliance frameworks",
        )
        list_group.add_argument(
            "--list-compliance-requirements",
            nargs="+",
            help="List requirements and checks per compliance framework",
            choices=available_compliance_frameworks,
        )
        list_group.add_argument(
            "--list-categories",
            action="store_true",
            help="List the available check's categories",
        )
        list_group.add_argument(
            "--list-fixer",
            "--list-fixers",
            "--list-remediations",
            action="store_true",
            help="List fixers available for the provider",
        )

    def __init_mutelist_parser__(self):
        mutelist_subparser = self.common_providers_parser.add_argument_group("Mutelist")
        mutelist_subparser.add_argument(
            "--mutelist-file",
            "-w",
            nargs="?",
            help="Path for mutelist YAML file. See example prowler/config/<provider>_mutelist.yaml for reference and format. For AWS provider, it also accepts AWS DynamoDB Table, Lambda ARNs or S3 URIs, see more in https://docs.prowler.com/user-guide/cli/tutorials/mutelist",
        )

    def __init_config_parser__(self):
        config_parser = self.common_providers_parser.add_argument_group("Configuration")
        config_parser.add_argument(
            "--config-file",
            nargs="?",
            default=default_config_file_path,
            help="Set configuration file path",
        )
        config_parser.add_argument(
            "--fixer-config",
            nargs="?",
            default=default_fixer_config_file_path,
            help="Set configuration fixer file path",
        )

    def __init_custom_checks_metadata_parser__(self):
        # CustomChecksMetadata
        custom_checks_metadata_subparser = (
            self.common_providers_parser.add_argument_group("Custom Checks Metadata")
        )
        custom_checks_metadata_subparser.add_argument(
            "--custom-checks-metadata-file",
            nargs="?",
            default=None,
            help="Path for the custom checks metadata YAML file. See example prowler/config/custom_checks_metadata_example.yaml for reference and format. See more in https://docs.prowler.com/user-guide/cli/tutorials/custom-checks-metadata/",
        )

    def __init_third_party_integrations_parser__(self):
        third_party_subparser = self.common_providers_parser.add_argument_group(
            "3rd Party Integrations"
        )
        third_party_subparser.add_argument(
            "--shodan",
            "-N",
            nargs="?",
            default=None,
            metavar="SHODAN_API_KEY",
            help="Check if any public IPs in your Cloud environments are exposed in Shodan.",
        )
        third_party_subparser.add_argument(
            "--slack",
            action="store_true",
            help="Send a summary of the execution with a Slack APP in your channel. Environment variables SLACK_API_TOKEN and SLACK_CHANNEL_NAME are required (see more in https://docs.prowler.com/user-guide/cli/tutorials/integrations#configuration-of-the-integration-with-slack/).",
        )
```

--------------------------------------------------------------------------------

---[FILE: mutelist.py]---
Location: prowler-master/prowler/lib/mutelist/mutelist.py

```python
import re
from abc import ABC, abstractmethod

import yaml
from jsonschema import validate

from prowler.lib.logger import logger
from prowler.lib.outputs.common import Status
from prowler.lib.outputs.utils import unroll_dict, unroll_tags

mutelist_schema = {
    "type": "object",
    "properties": {
        "Accounts": {
            "type": "object",
            "patternProperties": {
                ".*": {  # Match any account
                    "type": "object",
                    "properties": {
                        "Checks": {
                            "type": "object",
                            "patternProperties": {
                                ".*": {  # Match any check
                                    "type": "object",
                                    "properties": {
                                        "Regions": {
                                            "type": "array",
                                            "items": {"type": "string"},
                                        },
                                        "Resources": {
                                            "type": "array",
                                            "items": {"type": "string"},
                                        },
                                        "Tags": {  # Optional field
                                            "type": "array",
                                            "items": {"type": "string"},
                                        },
                                        "Exceptions": {  # Optional field
                                            "type": "object",
                                            "properties": {
                                                "Accounts": {  # Optional field
                                                    "type": "array",
                                                    "items": {"type": "string"},
                                                },
                                                "Regions": {  # Optional field
                                                    "type": "array",
                                                    "items": {"type": "string"},
                                                },
                                                "Resources": {  # Optional field
                                                    "type": "array",
                                                    "items": {"type": "string"},
                                                },
                                                "Tags": {  # Optional field
                                                    "type": "array",
                                                    "items": {"type": "string"},
                                                },
                                            },
                                            "additionalProperties": False,
                                        },
                                        "Description": {  # Optional field
                                            "type": "string",
                                        },
                                    },
                                    "required": [
                                        "Regions",
                                        "Resources",
                                    ],  # Mandatory within a check
                                    "additionalProperties": False,
                                }
                            },
                            "additionalProperties": False,
                        },
                    },
                    "required": ["Checks"],  # Mandatory within an account
                    "additionalProperties": False,
                }
            },
            "additionalProperties": False,
        }
    },
    "required": ["Accounts"],  # Accounts is mandatory at the root level
    "additionalProperties": False,
}


class Mutelist(ABC):
    """
    Abstract base class for managing a mutelist.

    Attributes:
        _mutelist (dict): Dictionary containing information about muted checks for different accounts.
        _mutelist_file_path (str): Path to the mutelist file.
        MUTELIST_KEY (str): Key used to access the mutelist in the mutelist file.

    Methods:
        __init__: Initializes a Mutelist object.
        mutelist: Property that returns the mutelist dictionary.
        mutelist_file_path: Property that returns the mutelist file path.
        is_finding_muted: Abstract method to check if a finding is muted.
        get_mutelist_file_from_local_file: Retrieves the mutelist file from a local file.
        is_muted: Checks if a finding is muted for the audited account, check, region, resource, and tags.
        is_muted_in_check: Checks if a check is muted.
        is_excepted: Checks if the account, region, resource, and tags are excepted based on the exceptions.
    """

    _mutelist: dict = {}
    _mutelist_file_path: str = None

    MUTELIST_KEY = "Mutelist"

    def __init__(
        self, mutelist_path: str = "", mutelist_content: dict = {}
    ) -> "Mutelist":
        if mutelist_path:
            self._mutelist_file_path = mutelist_path
            self.get_mutelist_file_from_local_file(mutelist_path)
        else:
            self._mutelist = mutelist_content

        if self._mutelist:
            self._mutelist = Mutelist.validate_mutelist(self._mutelist)

    @property
    def mutelist(self) -> dict:
        return self._mutelist

    @property
    def mutelist_file_path(self) -> dict:
        return self._mutelist_file_path

    @abstractmethod
    def is_finding_muted(self) -> bool:
        raise NotImplementedError

    def get_mutelist_file_from_local_file(self, mutelist_path: str):
        try:
            with open(mutelist_path) as f:
                self._mutelist = yaml.safe_load(f)[self.MUTELIST_KEY]
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
            )

    def is_muted(
        self,
        audited_account: str,
        check: str,
        finding_region: str,
        finding_resource: str,
        finding_tags,
    ) -> bool:
        """
        Check if the provided finding is muted for the audited account, check, region, resource and tags.

        The Mutelist works in a way that each field is ANDed, so if a check is muted for an account, region, resource and tags, it will be muted.

        Exceptions use AND logic across specified fields, with unspecified fields treated as wildcards (matching all values).

        Tag matching uses AND logic when multiple tags are listed (all must match). OR logic is achieved using regex alternation (|) within a single tag pattern.

        So, for the following Mutelist:
        ```
        Mutelist:
            Accounts:
                '*':
                Checks:
                    ec2_instance_detailed_monitoring_enabled:
                        Regions: ['*']
                        Resources:
                            - 'i-123456789'
                        Tags:
                            - 'Name=AdminInstance|Environment=Prod'
                        Description: 'Field to describe why the findings associated with these values are muted'
        ```
        The check `ec2_instance_detailed_monitoring_enabled` will be muted for all accounts and regions and for the resource_id 'i-123456789' with at least one of the tags 'Name=AdminInstance' or 'Environment=Prod'.

        Note: The pipe (|) in the tag pattern provides OR logic via regex alternation. To require BOTH tags, use two separate tag entries:
        Tags:
            - 'Name=AdminInstance'
            - 'Environment=Prod'

        Args:
            mutelist (dict): Dictionary containing information about muted checks for different accounts.
            audited_account (str): The account being audited.
            check (str): The check to be evaluated for muting.
            finding_region (str): The region where the finding occurred.
            finding_resource (str): The resource related to the finding.
            finding_tags: The tags associated with the finding.

        Returns:
            bool: True if the finding is muted for the audited account, check, region, resource and tags., otherwise False.
        """
        try:
            # By default is not muted
            is_finding_muted = False

            # We always check all the accounts present in the mutelist
            # if one mutes the finding we set the finding as muted
            for account in self._mutelist.get("Accounts", []):
                if account == audited_account or account == "*":
                    if self.is_muted_in_check(
                        self._mutelist["Accounts"][account]["Checks"],
                        audited_account,
                        check,
                        finding_region,
                        finding_resource,
                        finding_tags,
                    ):
                        is_finding_muted = True
                        break

            return is_finding_muted
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
            )
            return False

    def is_muted_in_check(
        self,
        muted_checks,
        audited_account,
        check,
        finding_region,
        finding_resource,
        finding_tags,
    ) -> bool:
        """
        Check if the provided check is muted.

        Args:
            muted_checks (dict): Dictionary containing information about muted checks.
            audited_account (str): The account to be audited.
            check (str): The check to be evaluated for muting.
            finding_region (str): The region where the finding occurred.
            finding_resource (str): The resource related to the finding.
            finding_tags (str): The tags associated with the finding.

        Returns:
            bool: True if the check is muted, otherwise False.
        """
        try:
            # Default value is not muted
            is_check_muted = False

            for muted_check, muted_check_info in muted_checks.items():
                # map lambda to awslambda
                muted_check = re.sub("^lambda", "awslambda", muted_check)

                check_match = (
                    "*" == muted_check
                    or check == muted_check
                    or self.is_item_matched([muted_check], check)
                )

                # Check if the finding is excepted
                exceptions = muted_check_info.get("Exceptions")
                if (
                    self.is_excepted(
                        exceptions,
                        audited_account,
                        finding_region,
                        finding_resource,
                        finding_tags,
                    )
                    and check_match
                ):
                    # Break loop and return default value since is excepted
                    break

                muted_regions = muted_check_info.get("Regions")
                muted_resources = muted_check_info.get("Resources")
                muted_tags = muted_check_info.get("Tags", "*")
                # We need to set the muted_tags if None, "" or [], so the falsy helps
                if not muted_tags:
                    muted_tags = "*"
                # If there is a *, it affects to all checks
                if check_match:
                    muted_in_check = True
                    muted_in_region = self.is_item_matched(
                        muted_regions, finding_region
                    )
                    muted_in_resource = self.is_item_matched(
                        muted_resources, finding_resource
                    )
                    muted_in_tags = self.is_item_matched(
                        muted_tags, finding_tags, tag=True
                    )

                    # For a finding to be muted requires the following set to True:
                    # - muted_in_check -> True
                    # - muted_in_region -> True
                    # - muted_in_tags -> True
                    # - muted_in_resource -> True
                    # - excepted -> False

                    if (
                        muted_in_check
                        and muted_in_region
                        and muted_in_tags
                        and muted_in_resource
                    ):
                        is_check_muted = True

            return is_check_muted
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
            )
            return False

    def mute_finding(self, finding):
        """
        Check if the provided finding is muted

        Args:
            finding (Finding): The finding to be evaluated for muting.

        Returns:
            Finding: The finding with the status updated if it is muted, otherwise the finding is returned

        """
        try:
            if self.is_muted(
                finding.account_uid,
                finding.metadata.CheckID,
                finding.region,
                finding.resource_uid,
                unroll_dict(unroll_tags(finding.resource_tags)),
            ):
                finding.raw["status"] = finding.status
                finding.status = Status.MUTED
                finding.muted = True
            return finding
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
            )
            return finding

    def is_excepted(
        self,
        exceptions,
        audited_account,
        finding_region,
        finding_resource,
        finding_tags,
    ) -> bool:
        """
        Check if the provided account, region, resource, and tags are excepted based on the exceptions dictionary.

        Args:
            exceptions (dict): Dictionary containing exceptions for different attributes like Accounts, Regions, Resources, and Tags.
            audited_account (str): The account to be audited.
            finding_region (str): The region where the finding occurred.
            finding_resource (str): The resource related to the finding.
            finding_tags (str): The tags associated with the finding.

        Returns:
            bool: True if the account, region, resource, and tags are excepted based on the exceptions, otherwise False.
        """
        try:
            excepted = False
            is_account_excepted = False
            is_region_excepted = False
            is_resource_excepted = False
            is_tag_excepted = False
            if exceptions:
                excepted_accounts = exceptions.get("Accounts", [])
                is_account_excepted = self.is_item_matched(
                    excepted_accounts, audited_account
                )

                excepted_regions = exceptions.get("Regions", [])
                is_region_excepted = self.is_item_matched(
                    excepted_regions, finding_region
                )

                excepted_resources = exceptions.get("Resources", [])
                is_resource_excepted = self.is_item_matched(
                    excepted_resources, finding_resource
                )

                excepted_tags = exceptions.get("Tags", [])
                is_tag_excepted = self.is_item_matched(
                    excepted_tags, finding_tags, tag=True
                )

                if (
                    not is_account_excepted
                    and not is_region_excepted
                    and not is_resource_excepted
                    and not is_tag_excepted
                ):
                    excepted = False
                elif (
                    (is_account_excepted or not excepted_accounts)
                    and (is_region_excepted or not excepted_regions)
                    and (is_resource_excepted or not excepted_resources)
                    and (is_tag_excepted or not excepted_tags)
                ):
                    excepted = True
            return excepted
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
            )
            return False

    @staticmethod
    def is_item_matched(matched_items, finding_items, tag=False) -> bool:
        """
        Check if any of the items in matched_items are present in finding_items.

        Args:
            matched_items (list): List of items to be matched.
            finding_items (str): String to search for matched items.
            tag (bool): If True, uses AND logic across multiple tags in the list.
                - Multiple tags: ALL tags in matched_items must be present in finding_items (AND logic).
                - Single tag with regex alternation (|): Matches if pattern is found (enables OR within pattern).
                - For non-tags: Uses OR logic - returns True if ANY item matches.

        Returns:
            bool: For tags - True if ALL patterns match. For non-tags - True if ANY pattern matches.
        """
        try:
            is_item_matched = False
            if matched_items and (finding_items or finding_items == ""):
                if tag:
                    is_item_matched = True
                for item in matched_items:
                    if "*" in item:
                        item = item.replace("*", ".*")
                    if tag:
                        if not re.search(item, finding_items):
                            is_item_matched = False
                            break
                    else:
                        if re.search(item, finding_items):
                            is_item_matched = True
                            break
            return is_item_matched
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__} -- {error}[{error.__traceback__.tb_lineno}]"
            )
            return False

    @staticmethod
    def validate_mutelist(mutelist: dict, raise_on_exception: bool = False) -> dict:
        """
        Validate the mutelist against the schema.

        Args:
            mutelist (dict): The mutelist to be validated.
            raise_on_exception (bool): Whether to raise an exception if the mutelist is invalid.

        Returns:
            dict: The mutelist itself.
        """
        try:
            validate(mutelist, schema=mutelist_schema)
            return mutelist
        except Exception as error:
            if raise_on_exception:
                raise error
            else:
                logger.error(
                    f"{error.__class__.__name__} -- Mutelist YAML is malformed - {error}[{error.__traceback__.tb_lineno}]"
                )
            return {}
```

--------------------------------------------------------------------------------

---[FILE: common.py]---
Location: prowler-master/prowler/lib/outputs/common.py

```python
from enum import Enum

from prowler.config.config import timestamp
from prowler.lib.outputs.utils import unroll_tags
from prowler.lib.utils.utils import outputs_unix_timestamp


# TODO: add test for outputs_unix_timestamp
def fill_common_finding_data(finding: dict, unix_timestamp: bool) -> dict:
    finding_data = {
        "metadata": finding.check_metadata,
        "timestamp": outputs_unix_timestamp(unix_timestamp, timestamp),
        "status": finding.status,
        "status_extended": finding.status_extended,
        "muted": finding.muted,
        "resource_details": finding.resource_details,
        "resource": finding.resource,
        "resource_tags": unroll_tags(finding.resource_tags),
    }
    return finding_data


class Status(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    MANUAL = "MANUAL"
    MUTED = "MUTED"
```

--------------------------------------------------------------------------------

````
