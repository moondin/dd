---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 203
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 203 of 867)

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

---[FILE: summary_table.py]---
Location: prowler-master/prowler/lib/outputs/summary_table.py

```python
import sys

from colorama import Fore, Style
from tabulate import tabulate

from prowler.config.config import (
    csv_file_suffix,
    html_file_suffix,
    json_asff_file_suffix,
    json_ocsf_file_suffix,
    orange_color,
)
from prowler.lib.logger import logger
from prowler.providers.github.models import GithubAppIdentityInfo, GithubIdentityInfo


def display_summary_table(
    findings: list,
    provider,
    output_options,
):
    output_directory = output_options.output_directory
    output_filename = output_options.output_filename
    try:
        if provider.type == "aws":
            entity_type = "Account"
            audited_entities = provider.identity.account
        elif provider.type == "azure":
            if (
                provider.identity.tenant_domain
                != "Unknown tenant domain (missing AAD permissions)"
            ):
                entity_type = "Tenant Domain"
                audited_entities = provider.identity.tenant_domain
            else:
                entity_type = "Tenant ID/s"
                audited_entities = " ".join(provider.identity.tenant_ids)
        elif provider.type == "gcp":
            entity_type = "Project ID/s"
            audited_entities = ", ".join(provider.project_ids)
        elif provider.type == "kubernetes":
            entity_type = "Context"
            audited_entities = provider.identity.context
        elif provider.type == "github":
            if isinstance(provider.identity, GithubIdentityInfo):
                entity_type = "User Name"
                audited_entities = provider.identity.account_name
            elif isinstance(provider.identity, GithubAppIdentityInfo):
                entity_type = "App ID"
                audited_entities = provider.identity.app_id
        elif provider.type == "m365":
            entity_type = "Tenant Domain"
            audited_entities = provider.identity.tenant_domain
        elif provider.type == "mongodbatlas":
            entity_type = "Organization"
            audited_entities = provider.identity.organization_name
        elif provider.type == "nhn":
            entity_type = "Tenant Domain"
            audited_entities = provider.identity.tenant_domain
        elif provider.type == "iac":
            if provider.scan_repository_url:
                entity_type = "Repository"
                audited_entities = provider.scan_repository_url
            else:
                entity_type = "Directory"
                audited_entities = provider.scan_path
        elif provider.type == "llm":
            entity_type = "LLM"
            audited_entities = provider.model
        elif provider.type == "oraclecloud":
            entity_type = "Tenancy"
            audited_entities = (
                provider.identity.tenancy_name
                if provider.identity.tenancy_name != "unknown"
                else provider.identity.tenancy_id
            )
        elif provider.type == "alibabacloud":
            entity_type = "Account"
            audited_entities = provider.identity.account_id

        # Check if there are findings and that they are not all MANUAL
        if findings and not all(finding.status == "MANUAL" for finding in findings):
            current = {
                "Service": "",
                "Provider": "",
                "Total": 0,
                "Pass": 0,
                "Critical": 0,
                "High": 0,
                "Medium": 0,
                "Low": 0,
                "Muted": 0,
            }
            findings_table = {
                "Provider": [],
                "Service": [],
                "Status": [],
                "Critical": [],
                "High": [],
                "Medium": [],
                "Low": [],
                "Muted": [],
            }
            pass_count = fail_count = muted_count = 0
            # Sort findings by ServiceName
            findings.sort(key=lambda x: x.check_metadata.ServiceName)
            for finding in findings:
                # If new service and not first, add previous row
                if (
                    current["Service"] != finding.check_metadata.ServiceName
                    and current["Service"]
                ):
                    add_service_to_table(findings_table, current)

                    current["Total"] = current["Pass"] = current["Muted"] = current[
                        "Critical"
                    ] = current["High"] = current["Medium"] = current["Low"] = 0

                current["Service"] = finding.check_metadata.ServiceName
                current["Provider"] = finding.check_metadata.Provider

                current["Total"] += 1
                if finding.muted:
                    muted_count += 1
                    current["Muted"] += 1
                if finding.status == "PASS":
                    pass_count += 1
                    current["Pass"] += 1
                elif finding.status == "FAIL":
                    fail_count += 1
                    if finding.check_metadata.Severity == "critical":
                        current["Critical"] += 1
                    elif finding.check_metadata.Severity == "high":
                        current["High"] += 1
                    elif finding.check_metadata.Severity == "medium":
                        current["Medium"] += 1
                    elif finding.check_metadata.Severity == "low":
                        current["Low"] += 1

            # Add final service

            add_service_to_table(findings_table, current)

            print("\nOverview Results:")
            overview_table = [
                [
                    f"{Fore.RED}{round(fail_count / len(findings) * 100, 2)}% ({fail_count}) Failed{Style.RESET_ALL}",
                    f"{Fore.GREEN}{round(pass_count / len(findings) * 100, 2)}% ({pass_count}) Passed{Style.RESET_ALL}",
                    f"{orange_color}{round(muted_count / len(findings) * 100, 2)}% ({muted_count}) Muted{Style.RESET_ALL}",
                ]
            ]
            print(tabulate(overview_table, tablefmt="rounded_grid"))

            print(
                f"\n{entity_type} {Fore.YELLOW}{audited_entities}{Style.RESET_ALL} Scan Results (severity columns are for fails only):"
            )
            if provider == "azure":
                print(
                    f"\nSubscriptions scanned: {Fore.YELLOW}{' '.join(provider.identity.subscriptions.keys())}{Style.RESET_ALL}"
                )
            print(tabulate(findings_table, headers="keys", tablefmt="rounded_grid"))
            print(
                f"{Style.BRIGHT}* You only see here those services that contains resources.{Style.RESET_ALL}"
            )
            print("\nDetailed results are in:")
            if "json-asff" in output_options.output_modes:
                print(
                    f" - JSON-ASFF: {output_directory}/{output_filename}{json_asff_file_suffix}"
                )
            if "json-ocsf" in output_options.output_modes:
                print(
                    f" - JSON-OCSF: {output_directory}/{output_filename}{json_ocsf_file_suffix}"
                )
            if "csv" in output_options.output_modes:
                print(f" - CSV: {output_directory}/{output_filename}{csv_file_suffix}")
            if "html" in output_options.output_modes:
                print(
                    f" - HTML: {output_directory}/{output_filename}{html_file_suffix}"
                )

        else:
            print(
                f"\n {Style.BRIGHT}There are no findings in {entity_type} {Fore.YELLOW}{audited_entities}{Style.RESET_ALL}\n"
            )

    except Exception as error:
        logger.critical(
            f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
        )
        sys.exit(1)


def add_service_to_table(findings_table, current):
    if (
        current["Critical"] > 0
        or current["High"] > 0
        or current["Medium"] > 0
        or current["Low"] > 0
    ):
        total_fails = (
            current["Critical"] + current["High"] + current["Medium"] + current["Low"]
        )
        current["Status"] = f"{Fore.RED}FAIL ({total_fails}){Style.RESET_ALL}"
    else:
        current["Status"] = f"{Fore.GREEN}PASS ({current['Pass']}){Style.RESET_ALL}"

    findings_table["Provider"].append(current["Provider"])
    findings_table["Service"].append(current["Service"])
    findings_table["Status"].append(current["Status"])
    findings_table["Critical"].append(
        f"{Fore.LIGHTRED_EX}{current['Critical']}{Style.RESET_ALL}"
    )
    findings_table["High"].append(f"{Fore.RED}{current['High']}{Style.RESET_ALL}")
    findings_table["Medium"].append(
        f"{Fore.YELLOW}{current['Medium']}{Style.RESET_ALL}"
    )
    findings_table["Low"].append(f"{Fore.BLUE}{current['Low']}{Style.RESET_ALL}")
    findings_table["Muted"].append(f"{orange_color}{current['Muted']}{Style.RESET_ALL}")
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: prowler-master/prowler/lib/outputs/utils.py

```python
def unroll_list(listed_items: list, separator: str = "|") -> str:
    """
    Unrolls a list of items into a single string, separated by a specified separator.

    Args:
        listed_items (list): The list of items to be unrolled.
        separator (str, optional): The separator to be used between the items. Defaults to "|".

    Returns:
        str: The unrolled string.

    Examples:
        >>> unroll_list(['apple', 'banana', 'orange'])
        'apple | banana | orange'

        >>> unroll_list(['apple', 'banana', 'orange'], separator=',')
        'apple, banana, orange'

        >>> unroll_list([])
        ''
    """
    unrolled_items = ""
    if listed_items:
        for item in listed_items:
            if not unrolled_items:
                unrolled_items = f"{item}"
            else:
                if separator == "|":
                    unrolled_items = f"{unrolled_items} {separator} {item}"
                else:
                    unrolled_items = f"{unrolled_items}{separator} {item}"

    return unrolled_items


def unroll_tags(tags: list) -> dict:
    """
    Unrolls a list of tags into a dictionary.

    Args:
        tags (list): A list of tags.

    Returns:
        dict: A dictionary containing the unrolled tags.

    Examples:
        >>> tags = [{"key": "name", "value": "John"}, {"key": "age", "value": "30"}]
        >>> unroll_tags(tags)
        {'name': 'John', 'age': '30'}

        >>> tags = [{"Key": "name", "Value": "John"}, {"Key": "age", "Value": "30"}]
        >>> unroll_tags(tags)
        {'name': 'John', 'age': '30'}

        >>> tags = [{"key": "name"}]
        >>> unroll_tags(tags)
        {'name': ''}

        >>> tags = [{"Key": "name"}]
        >>> unroll_tags(tags)
        {'name': ''}

        >>> tags = [{"name": "John", "age": "30"}]
        >>> unroll_tags(tags)
        {'name': 'John', 'age': '30'}

        >>> tags = []
        >>> unroll_tags(tags)
        {}

        >>> tags = {"name": "John", "age": "30"}
        >>> unroll_tags(tags)
        {'name': 'John', 'age': '30'}

        >>> tags = ["name", "age"]
        >>> unroll_tags(tags)
        {'name': '', 'age': ''}
    """
    if tags and tags != [{}] and tags != [None] and tags != []:
        if isinstance(tags, dict):
            return tags
        if isinstance(tags[0], str) and len(tags) > 0:
            return {tag: "" for tag in tags}
        if "key" in tags[0]:
            return {item["key"]: item.get("value", "") for item in tags}
        elif "Key" in tags[0]:
            return {item["Key"]: item.get("Value", "") for item in tags}
        else:
            return {key: value for d in tags for key, value in d.items()}
    return {}


def unroll_dict(dict: dict, separator: str = "=") -> str:
    """
    Unrolls a dictionary into a string representation.

    Args:
        dict (dict): The dictionary to be unrolled.

    Returns:
        str: The unrolled string representation of the dictionary.

    Examples:
        >>> my_dict = {'name': 'John', 'age': 30, 'hobbies': ['reading', 'coding']}
        >>> unroll_dict(my_dict)
        'name: John | age: 30 | hobbies: reading, coding'
    """

    unrolled_items = ""
    for key, value in dict.items():
        if isinstance(value, list):
            value = ", ".join(value)
        if not unrolled_items:
            unrolled_items = f"{key}{separator}{value}"
        else:
            unrolled_items = f"{unrolled_items} | {key}{separator}{value}"

    return unrolled_items


def unroll_dict_to_list(dict: dict) -> list:
    """
    Unrolls a dictionary into a list of key-value pairs.

    Args:
        dict (dict): The dictionary to be unrolled.

    Returns:
        list: A list of key-value pairs, where each pair is represented as a string.

    Examples:
        >>> my_dict = {'name': 'John', 'age': 30, 'hobbies': ['reading', 'coding']}
        >>> unroll_dict_to_list(my_dict)
        ['name: John', 'age: 30', 'hobbies: reading, coding']
    """

    dict_list = []
    for key, value in dict.items():
        if isinstance(value, list):
            value = ", ".join(value)
            dict_list.append(f"{key}:{value}")
        else:
            dict_list.append(f"{key}:{value}")

    return dict_list


def parse_json_tags(tags: list) -> dict[str, str]:
    """
    Parses a list of JSON tags and returns a dictionary of key-value pairs.

    Args:
        tags (list): A list of JSON tags.

    Returns:
        dict: A dictionary containing the parsed key-value pairs from the tags.

    Examples:
        >>> tags = [
        ...     {"Key": "Name", "Value": "John"},
        ...     {"Key": "Age", "Value": "30"},
        ...     {"Key": "City", "Value": "New York"}
        ... ]
        >>> parse_json_tags(tags)
        {'Name': 'John', 'Age': '30', 'City': 'New York'}
    """

    dict_tags = {}
    if tags and tags != [{}] and tags != [None]:
        for tag in tags:
            if "Key" in tag and "Value" in tag:
                dict_tags[tag["Key"]] = tag["Value"]
            else:
                dict_tags.update(tag)

    return dict_tags


def parse_html_string(str: str) -> str:
    """
    Parses a string and returns a formatted HTML string.

    This function takes an input string and splits it using the delimiter " | ".
    It then formats each element of the split string as a bullet point in HTML format.

    Args:
        str (str): The input string to be parsed.

    Returns:
        str: The formatted HTML string.

    Example:
        >>> parse_html_string("item1 | item2 | item3")
        '\n&#x2022;item1\n\n&#x2022;item2\n\n&#x2022;item3\n'
    """
    string = ""
    for elem in str.split(" | "):
        if elem:
            string += f"\n&#x2022;{elem}\n"

    return string
```

--------------------------------------------------------------------------------

---[FILE: asff.py]---
Location: prowler-master/prowler/lib/outputs/asff/asff.py
Signals: Pydantic

```python
from json import dump
from os import SEEK_SET
from typing import Optional

from pydantic.v1 import BaseModel, validator

from prowler.config.config import prowler_version, timestamp_utc
from prowler.lib.logger import logger
from prowler.lib.outputs.finding import Finding
from prowler.lib.outputs.output import Output
from prowler.lib.utils.utils import hash_sha512


class ASFF(Output):
    """
    ASFF class represents a transformation of findings into AWS Security Finding Format (ASFF).

    This class provides methods to transform a list of findings into the ASFF format required by AWS Security Hub. It includes operations such as generating unique identifiers, formatting timestamps, handling compliance frameworks, and ensuring the status values match the allowed values in ASFF.

    Attributes:
        - _data: A list to store the transformed findings.
        - _file_descriptor: A file descriptor to write to file.

    Methods:
        - transform(findings: list[Finding]) -> None: Transforms a list of findings into ASFF format.
        - batch_write_data_to_file() -> None: Writes the findings data to a file in JSON ASFF format.
        - generate_status(status: str, muted: bool = False) -> str: Generates the ASFF status based on the provided status and muted flag.

    References:
        - AWS Security Hub API Reference: https://docs.aws.amazon.com/securityhub/1.0/APIReference/API_Compliance.html
        - AWS Security Finding Format Syntax: https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format-syntax.html
    """

    def transform(self, findings: list[Finding]) -> None:
        """
        Transforms a list of findings into AWS Security Finding Format (ASFF).

        This method iterates over the list of findings provided as input and transforms each finding into the ASFF format required by AWS Security Hub. It performs several operations for each finding, including generating unique identifiers, formatting timestamps, handling compliance frameworks, and ensuring the status values match the allowed values in ASFF.

        Parameters:
            - findings (list[Finding]): A list of Finding objects representing the findings to be transformed.

        Returns:
            - None

        Notes:
            - The method skips findings with a status of "MANUAL" as it is not valid in SecurityHub.
            - It generates unique identifiers for each finding based on specific attributes.
            - It formats timestamps in the required ASFF format.
            - It handles compliance frameworks and associated standards for each finding.
            - It ensures that the finding status matches the allowed values in ASFF.

        References:
            - AWS Security Hub API Reference: https://docs.aws.amazon.com/securityhub/1.0/APIReference/API_Compliance.html
            - AWS Security Finding Format Syntax: https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format-syntax.html
        """
        try:
            for finding in findings:
                # MANUAL status is not valid in SecurityHub
                # https://docs.aws.amazon.com/securityhub/1.0/APIReference/API_Compliance.html
                if finding.status == "MANUAL":
                    continue
                timestamp = timestamp_utc.strftime("%Y-%m-%dT%H:%M:%SZ")

                associated_standards, compliance_summary = ASFF.format_compliance(
                    finding.compliance
                )

                # Ensures finding_status matches allowed values in ASFF
                finding_status = ASFF.generate_status(finding.status, finding.muted)
                self._data.append(
                    AWSSecurityFindingFormat(
                        # The following line cannot be changed because it is the format we use to generate unique findings for AWS Security Hub
                        # If changed some findings could be lost because the unique identifier will be different
                        Id=f"prowler-{finding.metadata.CheckID}-{finding.account_uid}-{finding.region}-{hash_sha512(finding.resource_uid)}",
                        ProductArn=f"arn:{finding.partition}:securityhub:{finding.region}::product/prowler/prowler",
                        ProductFields=ProductFields(
                            ProwlerResourceName=finding.resource_uid,
                        ),
                        GeneratorId="prowler-" + finding.metadata.CheckID,
                        AwsAccountId=finding.account_uid,
                        Types=(
                            finding.metadata.CheckType
                            if finding.metadata.CheckType
                            else ["Software and Configuration Checks"]
                        ),
                        FirstObservedAt=timestamp,
                        UpdatedAt=timestamp,
                        CreatedAt=timestamp,
                        Severity=Severity(Label=finding.metadata.Severity.value),
                        Title=finding.metadata.CheckTitle,
                        Description=(
                            (finding.status_extended[:1000] + "...")
                            if len(finding.status_extended) > 1000
                            else finding.status_extended
                        ),
                        Resources=[
                            Resource(
                                Id=finding.resource_uid,
                                Type=finding.metadata.ResourceType,
                                Partition=finding.partition,
                                Region=finding.region,
                                Tags=finding.resource_tags,
                            )
                        ],
                        Compliance=Compliance(
                            Status=finding_status,
                            AssociatedStandards=associated_standards,
                            RelatedRequirements=compliance_summary,
                        ),
                        Remediation=Remediation(
                            Recommendation=Recommendation(
                                Text=finding.metadata.Remediation.Recommendation.Text,
                                Url=finding.metadata.Remediation.Recommendation.Url,
                            )
                        ),
                    )
                )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def batch_write_data_to_file(self) -> None:
        """
        Writes the findings data to a file in JSON ASFF format.

        This method iterates over the findings data stored in the '_data' attribute and writes it to the file descriptor '_file_descriptor' in JSON format. It starts by writing the JSON opening/header '[', then iterates over each finding, dumping it to the file with an indent of 4 spaces. After writing all findings, it writes the closing ']' to complete the JSON array structure. Finally, it closes the file descriptor.

        Returns:
            None
        """
        try:
            if (
                getattr(self, "_file_descriptor", None)
                and not self._file_descriptor.closed
                and self._data
            ):
                # Write JSON opening/header [
                self._file_descriptor.write("[")

                # Write findings
                for finding in self._data:
                    dump(
                        finding.dict(exclude_none=True),
                        self._file_descriptor,
                        indent=4,
                    )
                    self._file_descriptor.write(",")

                # Write footer/closing ]
                if self._file_descriptor.tell() > 0:
                    if self._file_descriptor.tell() != 1:
                        self._file_descriptor.seek(
                            self._file_descriptor.tell() - 1, SEEK_SET
                        )
                    self._file_descriptor.truncate()
                    self._file_descriptor.write("]")

                # Close file descriptor
                self._file_descriptor.close()
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    @staticmethod
    def generate_status(status: str, muted: bool = False) -> str:
        """
        Generates the ASFF status based on the provided status and muted flag.

        Parameters:
            - status (str): The status of the finding.
            - muted (bool): Flag indicating if the finding is muted.

        Returns:
            - str: The ASFF status corresponding to the provided status and muted flag.

        References:
            - AWS Security Hub API Reference: https://docs.aws.amazon.com/securityhub/1.0/APIReference/API_Compliance.html
        """
        json_asff_status = ""
        if muted:
            # Per AWS Security Hub "MUTED" is not a valid status
            # https://docs.aws.amazon.com/securityhub/1.0/APIReference/API_Compliance.html
            json_asff_status = "WARNING"
        else:
            if status == "PASS":
                json_asff_status = "PASSED"
            elif status == "FAIL":
                json_asff_status = "FAILED"
            else:
                # MANUAL is set to NOT_AVAILABLE
                json_asff_status = "NOT_AVAILABLE"

        return json_asff_status

    @staticmethod
    def format_compliance(compliance: dict) -> tuple[list[dict], list[str]]:
        """
        Transforms a dictionary of compliance data into a tuple of associated standards and compliance summaries.

        Parameters:
            - compliance (dict): A dictionary containing compliance data where keys are standards and values are lists of compliance details.

        Returns:
            - tuple[list[dict], list[str]]: A tuple containing a list of associated standards (each as a dictionary with 'StandardsId') and a list of compliance summaries.

        Notes:
            - The method limits the number of associated standards to 20.
            - Each compliance summary is a concatenation of the standard key and its associated compliance details.
            - If the concatenated summary exceeds 64 characters, it is truncated to 63 characters.

        Example:
            format_compliance({"standard1": ["detail1", "detail2"], "standard2": ["detail3"]}) -> ([{"StandardsId": "standard1"}, {"StandardsId": "standard2"}], ["standard1 detail1 detail2", "standard2 detail3"])
        """
        compliance_summary = []
        associated_standards = []
        for key, value in compliance.items():
            if (
                len(associated_standards) < 20
            ):  # AssociatedStandards should NOT have more than 20 items
                associated_standards.append({"StandardsId": key})
                item = f"{key} {' '.join(value)}"
                if len(item) > 64:
                    item = item[0:63]
                compliance_summary.append(item)
        return associated_standards, compliance_summary


class ProductFields(BaseModel):
    """
    Class representing the Product Fields of a finding in the AWS Security Finding Format.

    Attributes:
        - ProviderName (str): The name of the provider, default value is "Prowler".
        - ProviderVersion (str): The version of the provider, fetched from the prowler_version in config.py.
        - ProwlerResourceName (str): The name of the Prowler resource.
    """

    ProviderName: str = "Prowler"
    ProviderVersion: str = prowler_version
    ProwlerResourceName: str


class Severity(BaseModel):
    """
    Class representing the severity of a finding in the AWS Security Finding Format.

    Attributes:
        - Label (str): A string representing the severity label of the finding.

    This class is used to define the severity level of a finding in the AWS Security Finding Format.
    """

    Label: str

    @validator("Label", pre=True, always=True)
    def severity_uppercase(severity):
        return severity.upper()


class Resource(BaseModel):
    """
    Class representing a resource in the AWS Security Finding Format.

    Attributes:
        - Type (str): The type of the resource.
        - Id (str): The unique identifier of the resource.
        - Partition (str): The partition where the resource resides.
        - Region (str): The region where the resource is located.
        - Tags (Optional[dict]): Optional dictionary of tags associated with the resource.

    This class defines the structure of a resource within the AWS Security Finding Format. It includes attributes to specify the type, unique identifier, partition, region, and optional tags of the resource.
    """

    Type: str
    Id: str
    Partition: str
    Region: str
    Tags: Optional[dict] = None

    @validator("Tags", pre=True, always=True)
    def tags_cannot_be_empty_dict(tags):
        if not tags:
            return None
        return tags


class Compliance(BaseModel):
    """
    Class representing the compliance details of a finding in the AWS Security Finding Format.

    Attributes:
        - Status (str): The compliance status of the finding.
        - RelatedRequirements (list[str]): A list of related compliance requirements for the finding.
        - AssociatedStandards (list[dict]): A list of associated standards with the finding, where each item is a dictionary containing the 'StandardsId'.

    This class defines the structure of compliance information within the AWS Security Finding Format. It includes attributes to specify the compliance status, related requirements, and associated standards of a finding.
    """

    Status: str
    RelatedRequirements: list[str]
    AssociatedStandards: list[dict]

    @validator("Status", pre=True, always=True)
    def status(status):
        if status not in ["PASSED", "WARNING", "FAILED", "NOT_AVAILABLE"]:
            raise ValueError("must contain a space")
        return status


class Recommendation(BaseModel):
    """
    Class representing a recommendation for remediation in the AWS Security Finding Format.

    Attributes:
        - Text (str): The text description of the recommendation.
        - Url (str): The URL link for additional information related to the recommendation.

    This class defines the structure of a recommendation within the AWS Security Finding Format. It includes attributes to specify the text description and URL link for further details regarding the recommendation.
    """

    Text: str = ""
    Url: str = ""

    @validator("Text", pre=True, always=True)
    def text_must_not_exceed_512_chars(text):
        text_validated = text
        if len(text) > 512:
            text_validated = text[:509] + "..."
        return text_validated

    @validator("Url", pre=True, always=True)
    def set_default_url_if_empty(url):
        default_url = "https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html"
        if url:
            default_url = url
        return default_url


class Remediation(BaseModel):
    """
    Class representing a remediation action in the AWS Security Finding Format.

    Attributes:
        - Recommendation (Recommendation): An instance of the Recommendation class providing details for remediation.

    This class defines the structure of a remediation action within the AWS Security Finding Format. It includes an attribute to specify the recommendation for remediation, which is an instance of the Recommendation class.
    """

    Recommendation: Recommendation


class AWSSecurityFindingFormat(BaseModel):
    """
    AWSSecurityFindingFormat generates a finding's output in JSON ASFF format: https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format-syntax.html

    Attributes:
        - SchemaVersion (str): The version of the ASFF schema being used, default value is "2018-10-08".
        - Id (str): The unique identifier of the finding.
        - ProductArn (str): The ARN of the product generating the finding.
        - RecordState (str): The state of the finding record, default value is "ACTIVE".
        - ProductFields (ProductFields): An instance of the ProductFields class representing the product fields of the finding.
        - GeneratorId (str): The ID of the generator.
        - AwsAccountId (str): The AWS account ID associated with the finding.
        - Types (list[str]): A list of types associated with the finding, default value is None.
        - FirstObservedAt (str): The timestamp when the finding was first observed.
        - UpdatedAt (str): The timestamp when the finding was last updated.
        - CreatedAt (str): The timestamp when the finding was created.
        - Severity (Severity): An instance of the Severity class representing the severity of the finding.
        - Title (str): The title of the finding.
        - Description (str): The description of the finding, truncated to 1024 characters if longer.
        - Resources (list[Resource]): A list of resources associated with the finding, default value is None.
        - Compliance (Compliance): An instance of the Compliance class representing the compliance details of the finding.
        - Remediation (Remediation): An instance of the Remediation class providing details for remediation.

    This class defines the structure of a finding in the AWS Security Finding Format, including various attributes such as schema version, identifiers, timestamps, severity, title, description, resources, compliance details, and remediation information.
    """

    SchemaVersion: str = "2018-10-08"
    Id: str
    ProductArn: str
    RecordState: str = "ACTIVE"
    ProductFields: ProductFields
    GeneratorId: str
    AwsAccountId: str
    Types: list[str] = None
    FirstObservedAt: str
    UpdatedAt: str
    CreatedAt: str
    Severity: Severity
    Title: str
    Description: str
    Resources: list[Resource] = None
    Compliance: Compliance
    Remediation: Remediation

    @validator("Description", pre=True, always=True)
    def description_must_not_exceed_1024_chars(description):
        description_validated = description
        if len(description) > 1024:
            description_validated = description[:1021] + "..."
        return description_validated
```

--------------------------------------------------------------------------------

---[FILE: compliance.py]---
Location: prowler-master/prowler/lib/outputs/compliance/compliance.py

```python
import sys

from prowler.lib.check.models import Check_Report
from prowler.lib.logger import logger
from prowler.lib.outputs.compliance.c5.c5 import get_c5_table
from prowler.lib.outputs.compliance.cis.cis import get_cis_table
from prowler.lib.outputs.compliance.ens.ens import get_ens_table
from prowler.lib.outputs.compliance.generic.generic_table import (
    get_generic_compliance_table,
)
from prowler.lib.outputs.compliance.kisa_ismsp.kisa_ismsp import get_kisa_ismsp_table
from prowler.lib.outputs.compliance.mitre_attack.mitre_attack import (
    get_mitre_attack_table,
)
from prowler.lib.outputs.compliance.prowler_threatscore.prowler_threatscore import (
    get_prowler_threatscore_table,
)


def display_compliance_table(
    findings: list,
    bulk_checks_metadata: dict,
    compliance_framework: str,
    output_filename: str,
    output_directory: str,
    compliance_overview: bool,
) -> None:
    """
    display_compliance_table generates the compliance table for the given compliance framework.

    Args:
        findings (list): The list of findings
        bulk_checks_metadata (dict): The bulk checks metadata
        compliance_framework (str): The compliance framework to generate the table
        output_filename (str): The output filename
        output_directory (str): The output directory
        compliance_overview (bool): The compliance

    Returns:
        None
    """
    try:
        if "ens_" in compliance_framework:
            get_ens_table(
                findings,
                bulk_checks_metadata,
                compliance_framework,
                output_filename,
                output_directory,
                compliance_overview,
            )
        elif "cis_" in compliance_framework:
            get_cis_table(
                findings,
                bulk_checks_metadata,
                compliance_framework,
                output_filename,
                output_directory,
                compliance_overview,
            )
        elif "mitre_attack" in compliance_framework:
            get_mitre_attack_table(
                findings,
                bulk_checks_metadata,
                compliance_framework,
                output_filename,
                output_directory,
                compliance_overview,
            )
        elif "kisa_isms_" in compliance_framework:
            get_kisa_ismsp_table(
                findings,
                bulk_checks_metadata,
                compliance_framework,
                output_filename,
                output_directory,
                compliance_overview,
            )
        elif "threatscore_" in compliance_framework:
            get_prowler_threatscore_table(
                findings,
                bulk_checks_metadata,
                compliance_framework,
                output_filename,
                output_directory,
                compliance_overview,
            )
        elif "c5_" in compliance_framework:
            get_c5_table(
                findings,
                bulk_checks_metadata,
                compliance_framework,
                output_filename,
                output_directory,
                compliance_overview,
            )
        else:
            get_generic_compliance_table(
                findings,
                bulk_checks_metadata,
                compliance_framework,
                output_filename,
                output_directory,
                compliance_overview,
            )
    except Exception as error:
        logger.critical(
            f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
        )
        sys.exit(1)


# TODO: this should be in the Check class
def get_check_compliance(
    finding: Check_Report, provider_type: str, bulk_checks_metadata: dict
) -> dict:
    """get_check_compliance returns a map with the compliance framework as key and the requirements where the finding's check is present.

        Example:

    {
        "CIS-1.4": ["2.1.3"],
        "CIS-1.5": ["2.1.3"],
    }

    Args:
        finding (Any): The Check_Report finding
        provider_type (str): The provider type
        bulk_checks_metadata (dict): The bulk checks metadata

    Returns:
        dict: The compliance framework as key and the requirements where the finding's check is present.
    """
    try:
        check_compliance = {}
        # We have to retrieve all the check's compliance requirements
        if finding.check_metadata.CheckID in bulk_checks_metadata:
            for compliance in bulk_checks_metadata[
                finding.check_metadata.CheckID
            ].Compliance:
                compliance_fw = compliance.Framework
                if compliance.Version:
                    compliance_fw = f"{compliance_fw}-{compliance.Version}"
                # compliance.Provider == "Azure" or "Kubernetes"
                # provider_type == "azure" or "kubernetes"
                if compliance.Provider.upper() == provider_type.upper():
                    if compliance_fw not in check_compliance:
                        check_compliance[compliance_fw] = []
                    for requirement in compliance.Requirements:
                        check_compliance[compliance_fw].append(requirement.Id)
        return check_compliance
    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}] -- {error}"
        )
        return {}
```

--------------------------------------------------------------------------------

````
