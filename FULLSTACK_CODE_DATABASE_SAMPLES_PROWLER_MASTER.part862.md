---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 862
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 862 of 867)

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

---[FILE: README.md]---
Location: prowler-master/util/compliance/compliance_mapper/README.md

```text
# 🛡️ Compliance Mapper CLI

An intelligent tool for mapping compliance frameworks with Prowler Hub security checks using AI analysis.

## Overview

The Compliance Mapper CLI is an interactive tool that automatically maps compliance framework requirements to relevant Prowler security checks. It uses AI analysis to intelligently select the most appropriate checks for each compliance requirement, providing justifications for the mappings.

## Features

- **Interactive CLI Interface**: Beautiful, user-friendly command-line interface using Rich
- **AI-Powered Analysis**: Uses OpenAI GPT-5 for intelligent check selection and mapping
- **Prowler Hub Integration**: Automatically fetches latest security checks from Prowler Hub API
- **GitHub Code Integration**: Retrieves actual check code from GitHub for deeper analysis
- **Flexible Field Selection**: Choose which compliance requirement fields to analyze
- **Concurrent Processing**: Fast processing using threading for API calls
- **Comprehensive Output**: Generates mapped compliance files with justifications

## Requirements

- Python 3.7+
- Internet connection (for Prowler Hub API and GitHub access)
- OpenAI API key (for AI analysis)

### Dependencies

The tool automatically installs required dependencies, but you can install them manually:

```bash
pip install rich requests
```

## Installation

1. Clone or download the `compliance_mapper.py` file
2. Make it executable:
   ```bash
   chmod +x compliance_mapper.py
   ```

## Usage

### Interactive Mode (Recommended)

Run the tool without arguments to enter interactive mode:

```bash
python compliance_mapper.py
```

### Command Line Arguments

```bash
python compliance_mapper.py [options]

Options:
  -f, --file    Path to compliance framework JSON file
  -o, --output  Output file path
  -h, --help    Show help message
```

## Workflow

The tool follows a 6-step interactive workflow:

### 1. Load Compliance File
- Provide path to your compliance framework JSON file
- The tool validates the file structure and displays framework information
- Suggested JSON structure:
  ```json
  {
    "Framework": "Framework Name",
    "Provider": "aws|azure|gcp",
    "Version": "1.0",
    "Requirements": [
      {
        "Id": "REQ-001",
        "Description": "Requirement description",
        "Attributes": [
          {
            "Section": "Control section",
            "SubSection": "Detailed description"
          }
        ]
      }
    ]
  }
  ```

### 2. Field Selection
- The tool analyzes your compliance file structure
- Select which fields to use for AI analysis (e.g., Description, Attributes.Section)
- Fields with substantial text content are recommended for better AI analysis

### 3. Load Prowler Checks
- Automatically fetches all security checks for your provider from Prowler Hub
- Displays summary of loaded checks (count, services, severity levels)

### 4. Add Check Code
- Retrieves actual Python code for each check from GitHub
- Uses concurrent processing for faster execution
- Code is used by AI for deeper technical analysis

### 5. Process Requirements
- **OpenAI API Setup**: Enter your OpenAI API key or set `OPENAI_API_KEY` environment variable
- **Additional Field Option**: Choose whether to include AI justifications in output
- **AI Analysis**: Each requirement is analyzed against all available checks
- Progress tracking with real-time updates

### 6. Generate Output
- Creates new JSON file with mapped checks
- Updates `Checks` field with selected check IDs
- Optionally includes `Attributes.Additional` field with AI justifications

## OpenAI API Key

The tool requires an OpenAI API key for AI analysis:

1. **Environment Variable** (Recommended):
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

2. **Interactive Input**: Enter when prompted during execution

3. **Get API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)

## Input File Format

Your compliance framework JSON must include:

- `Framework`: Name of the compliance framework
- `Provider`: Cloud provider (aws, azure, gcp)
- `Requirements`: Array of compliance requirements

Each requirement should have:
- `Id`: Unique identifier
- Text fields for analysis (Description, Attributes.Section, etc.)
- `Attributes`: Array of attribute objects (optional)

## Output Format

The tool generates a new JSON file with:
- Original compliance framework structure preserved
- `Checks`: Array of mapped Prowler check IDs for each requirement
- `Attributes.Additional`: AI justification for mappings (if enabled)

Example output requirement:
```json
{
  "Id": "REQ-001",
  "Description": "Ensure encryption at rest",
  "Checks": ["s3_bucket_default_encryption", "rds_instance_storage_encrypted"],
  "Attributes": [
    {
      "Section": "Data Protection",
      "Additional": "Selected checks validate encryption controls: s3_bucket_default_encryption ensures S3 buckets have default encryption enabled, and rds_instance_storage_encrypted verifies RDS instances use encrypted storage."
    }
  ]
}
```

## Error Handling

The tool includes comprehensive error handling:
- **File Validation**: Checks JSON structure and required fields
- **API Connectivity**: Handles Prowler Hub and OpenAI API issues
- **Rate Limiting**: Automatically handles OpenAI rate limits with delays
- **Network Issues**: Retry logic for temporary connection problems
- **Invalid Responses**: Graceful handling of malformed AI responses

## Performance

- **Concurrent Processing**: Uses ThreadPoolExecutor for parallel API calls
- **Progress Tracking**: Real-time progress indicators
- **Rate Limiting**: 1-second delay between AI requests to respect API limits
- **Caching**: Efficient data structures to minimize redundant processing

## Troubleshooting

### Common Issues

1. **"No suitable fields found"**
   - Ensure your requirements have text fields with substantial content
   - Check that field values are longer than 10 characters

2. **"Failed to connect to Prowler Hub"**
   - Verify internet connection
   - Check if Prowler Hub API is accessible
   - Ensure provider name is valid (aws, azure, gcp)

3. **"Authentication failed"**
   - Verify OpenAI API key is correct
   - Check API key has sufficient credits
   - Ensure key has access to required models

4. **"API request failed"**
   - Check internet connectivity
   - Verify API endpoints are accessible
   - Review rate limiting and try again later

### Debug Information

The tool provides detailed error messages and progress information. For additional debugging:
- Check file paths are correct and accessible
- Verify JSON file structure matches requirements
- Ensure all required fields are present in compliance data

## Example Usage

```bash
# Interactive mode
python compliance_mapper.py

# Load specific file
python compliance_mapper.py -f ./frameworks/nist_csf.json

# Specify output location
python compliance_mapper.py -f ./frameworks/nist_csf.json -o ./output/mapped_nist.json
```

## Contributing

This tool is part of the Prowler project. For issues, improvements, or contributions, please refer to the main Prowler repository.
```

--------------------------------------------------------------------------------

---[FILE: generate_compliance_json_from_csv_for_cis10_github.py]---
Location: prowler-master/util/compliance/generate_json_from_csv/generate_compliance_json_from_csv_for_cis10_github.py

```python
import csv
import json
import sys

# Convert a CSV file following the CIS 1.0 GitHub benchmark into a Prowler v3.0 Compliance JSON file
# CSV fields:
# Id, Title,Checks,Attributes_Section,Attributes_Level,Attributes_AssessmentStatus,Attributes_Description,Attributes_RationalStatement,Attributes_ImpactStatement,Attributes_RemediationProcedure,Attributes_AuditProcedure,Attributes_AdditionalInformation,Attributes_References

# get the CSV filename to convert from
file_name = sys.argv[1]

# read the CSV file rows and use the column fields to form the Prowler compliance JSON file 'cis_1.0_github.json'
output = {"Framework": "CIS-GitHub", "Version": "1.0", "Requirements": []}
with open(file_name, newline="", encoding="utf-8") as f:
    reader = csv.reader(f, delimiter=";")
    for row in reader:
        attribute = {
            "Section": row[0],
            "Subsection": row[1],
            "Profile": row[3],
            "AssessmentStatus": row[5],
            "Description": row[6],
            "RationaleStatement": row[7],
            "ImpactStatement": row[8],
            "RemediationProcedure": row[9],
            "AuditProcedure": row[10],
            "AdditionalInformation": row[11],
            "References": row[25],
            "DefaultValue": row[26],
        }
        output["Requirements"].append(
            {
                "Id": row[2],
                "Description": row[6],
                "Checks": [],
                "Attributes": [attribute],
            }
        )


# Write the output Prowler compliance JSON file 'cis_1.0_github.json' locally
with open("cis_1.0_github.json", "w", encoding="utf-8") as outfile:
    json.dump(output, outfile, indent=4, ensure_ascii=False)
```

--------------------------------------------------------------------------------

---[FILE: generate_compliance_json_from_csv_for_cis15.py]---
Location: prowler-master/util/compliance/generate_json_from_csv/generate_compliance_json_from_csv_for_cis15.py

```python
import csv
import json
import sys

# Convert a CSV file following the CIS 1.5 AWS benchmark into a Prowler v3.0 Compliance JSON file
# CSV fields:
# ID	Title	Check	Section #	SubSection	Profile	Assessment Status	Description	Rationale Statement	Impact Statement	Remediation Procedure	Audit Procedure	Additional Information	References	Default Value

# get the CSV filename to convert from
file_name = sys.argv[1]

# read the CSV file rows and use the column fields to form the Prowler compliance JSON file 'ens_rd2022_aws.json'
output = {"Framework": "CIS-AWS", "Version": "1.5", "Requirements": []}
with open(file_name, newline="", encoding="utf-8") as f:
    reader = csv.reader(f, delimiter=",")
    for row in reader:
        if len(row[4]) > 0:
            attribute = {
                "Section": row[3],
                "SubSection": row[4],
                "Profile": row[5],
                "AssessmentStatus": row[6],
                "Description": row[7],
                "RationaleStatement": row[8],
                "ImpactStatement": row[9],
                "RemediationProcedure": row[10],
                "AuditProcedure": row[11],
                "AdditionalInformation": row[12],
                "References": row[13],
                "DefaultValue": row[14],
            }
        else:
            attribute = {
                "Section": row[3],
                "Profile": row[5],
                "AssessmentStatus": row[6],
                "Description": row[7],
                "RationaleStatement": row[8],
                "ImpactStatement": row[9],
                "RemediationProcedure": row[10],
                "AuditProcedure": row[11],
                "AdditionalInformation": row[12],
                "References": row[13],
                "DefaultValue": row[14],
            }

        output["Requirements"].append(
            {
                "Id": row[0],
                "Description": row[1],
                "Checks": list(map(str.strip, row[2].split(","))),
                "Attributes": [attribute],
            }
        )

# Write the output Prowler compliance JSON file 'cis_1.5_aws.json' locally
with open("cis_1.5_aws.json", "w", encoding="utf-8") as outfile:
    json.dump(output, outfile, indent=4, ensure_ascii=False)
```

--------------------------------------------------------------------------------

---[FILE: generate_compliance_json_from_csv_for_cis20_gcp.py]---
Location: prowler-master/util/compliance/generate_json_from_csv/generate_compliance_json_from_csv_for_cis20_gcp.py

```python
import csv
import json
import sys

# Convert a CSV file following the CIS 1.5 AWS benchmark into a Prowler v3.0 Compliance JSON file
# CSV fields:
# Id, Title,Checks,Attributes_Section,Attributes_Level,Attributes_AssessmentStatus,Attributes_Description,Attributes_RationalStatement,Attributes_ImpactStatement,Attributes_RemediationProcedure,Attributes_AuditProcedure,Attributes_AdditionalInformation,Attributes_References

# get the CSV filename to convert from
file_name = sys.argv[1]

# read the CSV file rows and use the column fields to form the Prowler compliance JSON file 'ens_rd2022_aws.json'
output = {"Framework": "CIS-GCP", "Version": "2.0", "Requirements": []}
with open(file_name, newline="", encoding="utf-8") as f:
    reader = csv.reader(f, delimiter=",")
    for row in reader:
        attribute = {
            "Section": row[0],
            "Profile": row[2],
            "AssessmentStatus": row[6],
            "Description": row[9],
            "RationaleStatement": row[10],
            "ImpactStatement": row[11],
            "RemediationProcedure": row[12],
            "AuditProcedure": row[13],
            "AdditionalInformation": row[14],
            "References": row[28],
        }
        output["Requirements"].append(
            {
                "Id": row[1],
                "Description": row[9],
                "Checks": list(map(str.strip, row[4].split(","))),
                "Attributes": [attribute],
            }
        )

# Write the output Prowler compliance JSON file 'cis_2.0_gcp.json' locally
with open("cis_2.0_gcp.json", "w", encoding="utf-8") as outfile:
    json.dump(output, outfile, indent=4, ensure_ascii=False)
```

--------------------------------------------------------------------------------

---[FILE: generate_compliance_json_from_csv_for_cis40_microsoft365.py]---
Location: prowler-master/util/compliance/generate_json_from_csv/generate_compliance_json_from_csv_for_cis40_microsoft365.py

```python
import csv
import json
import sys

# Convert a CSV file following the CIS 4.0 M365 Benchmark into a Prowler v3.0 Compliance JSON file
# CSV fields:
# Section #;Recommendation #;Profile;Title;Assessment Status;Description;Rationale Statement;Impact Statement;Remediation Procedure;Audit Procedure;Additional Information;CIS Controls;CIS Safeguards 1 (v8);CIS Safeguards 2 (v8);CIS Safeguards 3 (v8);v8 IG1;v8 IG2;v8 IG3;CIS Safeguards 1 (v7);CIS Safeguards 2 (v7);CIS Safeguards 3 (v7);v7 IG1;v7 IG2;v7 IG3;References;Default Value

# Get the CSV filename to convert from
file_name = sys.argv[1]

# Create the output JSON object
output = {"Framework": "CIS", "Version": "4.0", "Requirements": []}

# Open the CSV file and read the rows
try:
    with open(file_name, newline="", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter=";")
        next(reader)  # Skip the header row
        for row in reader:
            attribute = {
                "Section": row[0],
                "Profile": row[2],
                "AssessmentStatus": row[4],
                "Description": row[5],
                "RationaleStatement": row[6],
                "ImpactStatement": row[7],
                "RemediationProcedure": row[8],
                "AuditProcedure": row[9],
                "AdditionalInformation": row[10],
                "References": row[24],
                "DefaultValue": row[25],
            }
            if row[4] != "":
                output["Requirements"].append(
                    {
                        "Id": row[1],
                        "Description": row[5],
                        "Checks": [],
                        "Attributes": [attribute],
                    }
                )
except UnicodeDecodeError:
    # If there is an error reading the file with the default encoding, try with ISO-8859-1
    with open(file_name, newline="", encoding="ISO-8859-1") as f:
        reader = csv.reader(f, delimiter=";")
        next(reader)  # Skip the header row
        for row in reader:
            attribute = {
                "Section": row[0],
                "Profile": row[2],
                "AssessmentStatus": row[4],
                "Description": row[5],
                "RationaleStatement": row[6],
                "ImpactStatement": row[7],
                "RemediationProcedure": row[8],
                "AuditProcedure": row[9],
                "AdditionalInformation": row[10],
                "References": row[24],
                "DefaultValue": row[25],
            }
            if row[4] != "":
                output["Requirements"].append(
                    {
                        "Id": row[1],
                        "Description": row[5],
                        "Checks": [],
                        "Attributes": [attribute],
                    }
                )

# Save the output JSON file
with open("cis_4.0_m365.json", "w", encoding="utf-8") as outfile:
    json.dump(output, outfile, indent=4, ensure_ascii=False)

print("Archivo JSON generado exitosamente.")
```

--------------------------------------------------------------------------------

---[FILE: generate_compliance_json_from_csv_for_ens.py]---
Location: prowler-master/util/compliance/generate_json_from_csv/generate_compliance_json_from_csv_for_ens.py

```python
import csv
import json
import sys

# Convert a CSV file following the Spanish ENS - Esquema Nacional de Seguridad - RD2022 benchmark into a Prowler v3.0 Compliance JSON file
# CSV fields:
# ['Id', 'Description', 'Marco', 'Categoria', 'Descripcion_Control', 'Nivel', 'Dimensiones', 'Checks', 'ChecksV2', 'Tipo'],

# get the CSV filename to convert from
file_name = sys.argv[1]

# read the CSV file rows and use the column fields to form the Prowler compliance JSON file 'ens_rd2022_aws.json'
output = {"Framework": "ENS", "Version": "RD2022", "Requirements": []}
with open(file_name, newline="", encoding="utf-8") as f:
    reader = csv.reader(f, delimiter=",")
    for row in reader:
        niveles = list(map(str.strip, row[5].split(",")))
        # Use of pytec/CPSTIC levels is under clarification, disabling temporarily
        # if "pytec" in niveles:
        #     nivelvalue = "pytec"
        # el
        if "alto" in niveles:
            nivelvalue = "alto"
        elif "medio" in niveles:
            nivelvalue = "medio"
        elif "opcional" in niveles:
            nivelvalue = "opcional"
        else:
            nivelvalue = "bajo"

        attribute = {
            "IdGrupoControl": row[10],
            "Marco": row[2],
            "Categoria": row[3],
            "DescripcionControl": row[4],
            "Nivel": nivelvalue,
            "Tipo": row[9],
            "Dimensiones": list(map(str.strip, row[6].split(","))),
            "ModoEjecucion": row[11],
        }
        output["Requirements"].append(
            {
                "Id": row[0],
                "Description": row[1],
                "Attributes": [attribute],
                "Checks": list(map(str.strip, row[7].split(","))),
            }
        )

# Write the output Prowler compliance JSON file 'ens_rd2022_aws.json' locally
with open("ens_rd2022_aws.json", "w", encoding="utf-8") as outfile:
    json.dump(output, outfile, indent=4, ensure_ascii=False)
```

--------------------------------------------------------------------------------

---[FILE: generate_compliance_json_from_csv_threatscore.py]---
Location: prowler-master/util/compliance/generate_json_from_csv/generate_compliance_json_from_csv_threatscore.py

```python
import csv
import json
import sys

# Convert a CSV file following the ThreatScore CSV format into a Prowler Compliance JSON file
# CSV fields:
# Id, Title, Description, Section, SubSection, AttributeDescription, AdditionalInformation, LevelOfRisk, Checks

# get the CSV filename to convert from
file_name = sys.argv[1]

# read the CSV file rows and use the column fields to form the Prowler compliance JSON file 'prowler_threatscore_aws.json'
output = {"Framework": "ProwlerThreatScore", "Version": "1.0", "Requirements": []}
with open(file_name, newline="", encoding="utf-8") as f:
    reader = csv.reader(f, delimiter=",")
    for row in reader:
        attribute = {
            "Title": row[1],
            "Section": row[3],
            "SubSection": row[4],
            "AttributeDescription": row[5],
            "AdditionalInformation": row[6],
            "LevelOfRisk": row[7],
        }
        output["Requirements"].append(
            {
                "Id": row[0],
                "Description": row[2],
                "Checks": list(map(str.strip, row[8].split(","))),
                "Attributes": [attribute],
            }
        )

# Write the output Prowler compliance JSON file 'prowler_threatscore_aws.json' locally
with open("prowler_threatscore_azure.json", "w", encoding="utf-8") as outfile:
    json.dump(output, outfile, indent=4, ensure_ascii=False)
```

--------------------------------------------------------------------------------

---[FILE: get_prowler_threatscore_from_generic_output.py]---
Location: prowler-master/util/compliance/threatscore/get_prowler_threatscore_from_generic_output.py

```python
import csv
import json
import sys

file_name_output = sys.argv[1]
file_name_compliance = sys.argv[2]


score_per_pillar = {}
max_score_per_pillar = {}
counted_req_ids = []
to_fix = ""

with open(file_name_compliance, "r") as file:
    data = json.load(file)


with open(file_name_output, "r") as file:
    reader = csv.reader(file, delimiter=";")
    headers = next(reader)
    if "CHECK_ID" in headers:
        check_id_index = headers.index("CHECK_ID")
    if "STATUS" in headers:
        status_index = headers.index("STATUS")
    if "MUTED" in headers:
        muted_index = headers.index("MUTED")
    for row in reader:
        for requirement in data["Requirements"]:
            # Avoid counting the same requirement twice
            if requirement["Id"] in counted_req_ids:
                continue

            if row[check_id_index] in requirement["Checks"]:
                if (
                    requirement["Attributes"][0]["Section"]
                    not in score_per_pillar.keys()
                ):
                    score_per_pillar[requirement["Attributes"][0]["Section"]] = 0
                    max_score_per_pillar[requirement["Attributes"][0]["Section"]] = 0
                if row[status_index] == "FAIL" and row[muted_index] != "TRUE":
                    max_score_per_pillar[requirement["Attributes"][0]["Section"]] += (
                        requirement["Attributes"][0]["LevelOfRisk"]
                        * requirement["Attributes"][0]["Weight"]
                    )
                    counted_req_ids.append(requirement["Id"])
                    if requirement["Attributes"][0]["Weight"] >= 100:
                        to_fix += (
                            requirement["Id"]
                            + " - "
                            + requirement["Description"]
                            + "\n"
                        )
                else:
                    if row[status_index] == "PASS" and row[muted_index] != "TRUE":
                        score_per_pillar[requirement["Attributes"][0]["Section"]] += (
                            requirement["Attributes"][0]["LevelOfRisk"]
                            * requirement["Attributes"][0]["Weight"]
                        )
                        max_score_per_pillar[
                            requirement["Attributes"][0]["Section"]
                        ] += (
                            requirement["Attributes"][0]["LevelOfRisk"]
                            * requirement["Attributes"][0]["Weight"]
                        )
                        counted_req_ids.append(requirement["Id"])

for key in score_per_pillar.keys():
    print("Pillar:", key)
    print("Score:", score_per_pillar[key] / max_score_per_pillar[key] * 100)
    print("--------------------------------")

print("Threats to fix ASAP (weight >= 100):")
print(to_fix)
```

--------------------------------------------------------------------------------

---[FILE: aws_org_generator.py]---
Location: prowler-master/util/prowler-bulk-provisioning/aws_org_generator.py

```python
#!/usr/bin/env python3

"""
AWS Organizations Account Generator for Prowler Bulk Provisioning

Generates YAML configuration for all accounts in an AWS Organization,
ready to be used with prowler_bulk_provisioning.py.

Prerequisites:
- ProwlerRole (or custom role) must be deployed across all accounts
- AWS credentials with Organizations read access (typically management account)
- See: https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/aws/organizations/#deploying-prowler-iam-roles-across-aws-organizations
"""

from __future__ import annotations

import argparse
import sys
from typing import Any, Dict, List, Optional

try:
    import boto3
    from botocore.exceptions import ClientError, NoCredentialsError
except ImportError:
    sys.exit(
        "boto3 is required. Install with: pip install boto3\n"
        "Or install all dependencies: pip install -r requirements-aws-org.txt"
    )

try:
    import yaml
except ImportError:
    sys.exit("PyYAML is required. Install with: pip install pyyaml")


def get_org_accounts(
    profile: Optional[str] = None, region: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Retrieve all accounts from AWS Organizations.

    Args:
        profile: AWS CLI profile name
        region: AWS region (defaults to us-east-1 for Organizations)

    Returns:
        List of account dictionaries with id, name, email, and status
    """
    try:
        session = boto3.Session(profile_name=profile, region_name=region or "us-east-1")
        client = session.client("organizations")

        accounts = []
        paginator = client.get_paginator("list_accounts")

        for page in paginator.paginate():
            for account in page["Accounts"]:
                # Only include ACTIVE accounts
                if account["Status"] == "ACTIVE":
                    accounts.append(
                        {
                            "id": account["Id"],
                            "name": account["Name"],
                            "email": account["Email"],
                            "status": account["Status"],
                        }
                    )

        return accounts

    except NoCredentialsError:
        sys.exit(
            "No AWS credentials found. Configure credentials using:\n"
            "  - AWS CLI: aws configure\n"
            "  - Environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY\n"
            "  - IAM role if running on EC2/ECS/Lambda"
        )
    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        if error_code == "AccessDeniedException":
            sys.exit(
                "Access denied to AWS Organizations API.\n"
                "Ensure you are using credentials from the management account\n"
                "with permissions to call organizations:ListAccounts"
            )
        elif error_code == "AWSOrganizationsNotInUseException":
            sys.exit(
                "AWS Organizations is not enabled for this account.\n"
                "This script requires an AWS Organization to be set up."
            )
        else:
            sys.exit(f"AWS API error: {e}")
    except Exception as e:
        sys.exit(f"Unexpected error listing accounts: {e}")


def generate_yaml_config(
    accounts: List[Dict[str, Any]],
    role_name: str = "ProwlerRole",
    external_id: Optional[str] = None,
    session_name: Optional[str] = None,
    duration_seconds: Optional[int] = None,
    alias_format: str = "{name}",
    exclude_accounts: Optional[List[str]] = None,
    include_accounts: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """
    Generate YAML configuration for Prowler bulk provisioning.

    Args:
        accounts: List of account dictionaries from get_org_accounts
        role_name: IAM role name (default: ProwlerRole)
        external_id: External ID for role assumption (optional but recommended)
        session_name: Session name for role assumption (optional)
        duration_seconds: Session duration in seconds (optional)
        alias_format: Format string for alias (supports {name}, {id}, {email})
        exclude_accounts: List of account IDs to exclude
        include_accounts: List of account IDs to include (if set, only these are included)

    Returns:
        List of provider configurations ready for YAML export
    """
    exclude_accounts = exclude_accounts or []
    include_accounts = include_accounts or []

    providers = []

    for account in accounts:
        account_id = account["id"]

        # Apply filters
        if include_accounts and account_id not in include_accounts:
            continue
        if account_id in exclude_accounts:
            continue

        # Format alias using template
        alias = alias_format.format(
            name=account["name"], id=account_id, email=account["email"]
        )

        # Build role ARN
        role_arn = f"arn:aws:iam::{account_id}:role/{role_name}"

        # Build credentials section
        credentials: Dict[str, Any] = {"role_arn": role_arn}

        if external_id:
            credentials["external_id"] = external_id

        if session_name:
            credentials["session_name"] = session_name

        if duration_seconds:
            credentials["duration_seconds"] = duration_seconds

        # Build provider entry
        provider = {
            "provider": "aws",
            "uid": account_id,
            "alias": alias,
            "auth_method": "role",
            "credentials": credentials,
        }

        providers.append(provider)

    return providers


def main():
    """Main function to generate AWS Organizations YAML configuration."""
    parser = argparse.ArgumentParser(
        description="Generate Prowler bulk provisioning YAML from AWS Organizations",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic usage - generate YAML for all accounts
  python aws_org_generator.py -o aws-accounts.yaml

  # Use custom role name and external ID
  python aws_org_generator.py -o aws-accounts.yaml \\
    --role-name ProwlerExecutionRole \\
    --external-id my-external-id-12345

  # Use specific AWS profile
  python aws_org_generator.py -o aws-accounts.yaml \\
    --profile org-management

  # Exclude specific accounts (e.g., management account)
  python aws_org_generator.py -o aws-accounts.yaml \\
    --exclude 123456789012,210987654321

  # Include only specific accounts
  python aws_org_generator.py -o aws-accounts.yaml \\
    --include 111111111111,222222222222

  # Custom alias format
  python aws_org_generator.py -o aws-accounts.yaml \\
    --alias-format "{name}-{id}"

Prerequisites:
  1. Deploy ProwlerRole across all accounts using CloudFormation StackSets:
     https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/aws/organizations/#deploying-prowler-iam-roles-across-aws-organizations

  2. Ensure AWS credentials have Organizations read access:
     - organizations:ListAccounts
     - organizations:DescribeOrganization (optional)
        """,
    )

    parser.add_argument(
        "-o",
        "--output",
        default="aws-org-accounts.yaml",
        help="Output YAML file path (default: aws-org-accounts.yaml)",
    )

    parser.add_argument(
        "--role-name",
        default="ProwlerRole",
        help="IAM role name deployed across accounts (default: ProwlerRole)",
    )

    parser.add_argument(
        "--external-id",
        help="External ID for role assumption (recommended for security)",
    )

    parser.add_argument(
        "--session-name", help="Session name for role assumption (optional)"
    )

    parser.add_argument(
        "--duration-seconds",
        type=int,
        help="Session duration in seconds (optional, default: 3600)",
    )

    parser.add_argument(
        "--alias-format",
        default="{name}",
        help="Alias format template. Available: {name}, {id}, {email} (default: {name})",
    )

    parser.add_argument(
        "--exclude",
        help="Comma-separated list of account IDs to exclude",
    )

    parser.add_argument(
        "--include",
        help="Comma-separated list of account IDs to include (if set, only these are processed)",
    )

    parser.add_argument(
        "--profile",
        help="AWS CLI profile name (uses default credentials if not specified)",
    )

    parser.add_argument(
        "--region",
        help="AWS region (default: us-east-1, Organizations is global but needs a region)",
    )

    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print configuration to stdout without writing file",
    )

    args = parser.parse_args()

    # Parse exclude/include lists
    exclude_accounts = (
        [acc.strip() for acc in args.exclude.split(",")] if args.exclude else []
    )
    include_accounts = (
        [acc.strip() for acc in args.include.split(",")] if args.include else []
    )

    print("Fetching accounts from AWS Organizations...")
    if args.profile:
        print(f"Using AWS profile: {args.profile}")

    # Get accounts from Organizations
    accounts = get_org_accounts(profile=args.profile, region=args.region)

    if not accounts:
        print("No active accounts found in organization.")
        return

    print(f"Found {len(accounts)} active accounts in organization")

    # Generate YAML configuration
    providers = generate_yaml_config(
        accounts=accounts,
        role_name=args.role_name,
        external_id=args.external_id,
        session_name=args.session_name,
        duration_seconds=args.duration_seconds,
        alias_format=args.alias_format,
        exclude_accounts=exclude_accounts,
        include_accounts=include_accounts,
    )

    if not providers:
        print("No providers generated after applying filters.")
        return

    print(f"Generated configuration for {len(providers)} accounts")

    # Output YAML
    yaml_content = yaml.dump(
        providers, default_flow_style=False, sort_keys=False, allow_unicode=True
    )

    if args.dry_run:
        print("\n--- Generated YAML Configuration ---\n")
        print(yaml_content)
    else:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(yaml_content)
        print(f"\nConfiguration written to: {args.output}")
        print("\nNext steps:")
        print(f"  1. Review the generated file: cat {args.output} | head -n 20")
        print(
            f"  2. Run bulk provisioning: python prowler_bulk_provisioning.py {args.output}"
        )


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````
