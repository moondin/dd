---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 865
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 865 of 867)

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
Location: prowler-master/util/prowler-bulk-provisioning/README.md

```text
# Prowler Provider Bulk Provisioning

A Python script to bulk-provision cloud providers in Prowler Cloud/App via REST API. This tool streamlines the process of adding multiple cloud providers to Prowler by reading configuration from YAML and making API calls with concurrency and retry support.

## Supported Providers

- **AWS** (Amazon Web Services)
- **Azure** (Microsoft Azure)
- **GCP** (Google Cloud Platform)
- **Kubernetes**
- **M365** (Microsoft 365)
- **GitHub**

## Features

- **Concurrent Processing:** Configurable concurrency for faster bulk operations
- **Retry Logic:** Built-in retry mechanism for handling temporary API failures
- **Dry-Run Mode:** Test configuration without making actual API calls
- **Flexible Authentication:** Supports various authentication methods per provider
- **Error Handling:** Comprehensive error reporting and validation
- **Connection Testing:** Built-in provider connection verification
- **AWS Organizations Support:** Automated YAML generation for all accounts in an AWS Organization

## How It Works

The script uses a two-step process to provision providers in Prowler:

1. **Provider Creation:** Creates the provider with basic information (provider type, UID, alias)
2. **Secret Creation:** Creates and links authentication credentials as a separate secret resource

This two-step approach follows the Prowler API design where providers and their credentials are managed as separate but linked resources, providing better security and flexibility.

## Installation

### Requirements

- Python 3.7 or higher
- Required packages (install via requirements.txt)

### Setup

1. Clone or navigate to the Prowler repository:
   ```bash
   cd contrib/other-contrib/provider-bulk-importer
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Get your Prowler API key:
   - **Prowler Cloud:** Create an API key at https://api.prowler.com
   - **Self-hosted Prowler App:** Create an API key in your local instance
   - Click **Profile** → **Account** → **Create API Key**

  ```bash
  export PROWLER_API_KEY="pk_example-api-key"
  ```

  For detailed instructions on creating API keys, see: https://docs.prowler.com/user-guide/tutorials/prowler-app-api-keys


## AWS Organizations Integration

For organizations with many AWS accounts, use the included `aws_org_generator.py` script to automatically generate configuration for all accounts in your AWS Organization.

**📖 Full Guide:** See [AWS Organizations Bulk Provisioning Tutorial](https://docs.prowler.com/user-guide/tutorials/aws-organizations-bulk-provisioning) for complete documentation, examples, and troubleshooting.

### Prerequisites

Before using the AWS Organizations generator, deploy the ProwlerRole across all accounts using CloudFormation StackSets:

**Documentation:** [Deploying Prowler IAM Roles Across AWS Organizations](https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/aws/organizations/#deploying-prowler-iam-roles-across-aws-organizations)

### Quick Start

1. Install additional dependencies:
   ```bash
   pip install -r requirements-aws-org.txt
   ```

2. Generate YAML configuration for all organization accounts:
   ```bash
   python aws_org_generator.py -o aws-accounts.yaml --external-id example-external-id
   ```

3. Run bulk provisioning:
   ```bash
   python prowler_bulk_provisioning.py aws-accounts.yaml
   ```

### AWS Organizations Generator Options

```bash
python aws_org_generator.py -o aws-accounts.yaml \
  --role-name ProwlerRole \
  --external-id my-external-id \
  --exclude 123456789012 \
  --profile org-management
```

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output` | Output YAML file path | `aws-org-accounts.yaml` |
| `--role-name` | IAM role name across accounts | `ProwlerRole` |
| `--external-id` | External ID for role assumption | None (recommended) |
| `--session-name` | Session name for role assumption | None |
| `--duration-seconds` | Session duration in seconds | None |
| `--alias-format` | Alias template: `{name}`, `{id}`, `{email}` | `{name}` |
| `--exclude` | Comma-separated account IDs to exclude | None |
| `--include` | Comma-separated account IDs to include | None |
| `--profile` | AWS CLI profile name | Default credentials |
| `--region` | AWS region | `us-east-1` |
| `--dry-run` | Print to stdout without writing | `False` |

### Examples

**Generate config for all accounts with custom external ID:**
```bash
python aws_org_generator.py -o aws-accounts.yaml --external-id prowler-2024-abc123
```

**Exclude management account:**
```bash
python aws_org_generator.py -o aws-accounts.yaml \
  --external-id prowler-ext-id \
  --exclude 123456789012
```

**Use specific AWS profile:**
```bash
python aws_org_generator.py -o aws-accounts.yaml \
  --profile org-admin \
  --external-id prowler-ext-id
```

**Custom alias format:**
```bash
python aws_org_generator.py -o aws-accounts.yaml \
  --alias-format "{name}-{id}" \
  --external-id prowler-ext-id
```

## Configuration

### Environment Variables

```bash
export PROWLER_API_KEY="pk_example-api-key"
export PROWLER_API_BASE="https://api.prowler.com/api/v1"  # Optional, defaults to Prowler Cloud
```

### Provider Configuration Files

Create a configuration file (YAML recommended) listing the providers to add:

#### YAML Format (Recommended)

```yaml
# providers.yaml
- provider: aws
  uid: "123456789012"              # AWS Account ID
  alias: "prod-root"
  auth_method: role                # role | credentials
  credentials:
    role_arn: "arn:aws:iam::123456789012:role/ProwlerScan"
    external_id: "ext-abc123"      # optional
    session_name: "prowler-bulk"   # optional
    duration_seconds: 3600         # optional

- provider: aws
  uid: "210987654321"
  alias: "dev"
  auth_method: credentials         # long/short-lived keys
  credentials:
    access_key_id: "AKIA..."
    secret_access_key: "..."
    session_token: "..."           # optional

- provider: azure
  uid: "00000000-1111-2222-3333-444444444444" # Subscription ID
  alias: "sub-eastus"
  auth_method: service_principal
  credentials:
    tenant_id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
    client_id: "ffffffff-1111-2222-3333-444444444444"
    client_secret: "..."

- provider: gcp
  uid: "my-gcp-project-id"         # Project ID
  alias: "gcp-prod"
  auth_method: service_account     # Service Account authentication
  credentials:
    service_account_key_json_path: "./gcp-key.json"

- provider: kubernetes
  uid: "my-eks-context"            # kubeconfig context name
  alias: "eks-prod"
  auth_method: kubeconfig
  credentials:
    kubeconfig_path: "~/.kube/config"

- provider: m365
  uid: "contoso.onmicrosoft.com"   # Domain ID
  alias: "contoso"
  auth_method: service_principal
  credentials:
    tenant_id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
    client_id: "ffffffff-1111-2222-3333-444444444444"
    client_secret: "..."

- provider: github
  uid: "my-org"                    # organization or username
  alias: "gh-org"
  auth_method: personal_access_token  # oauth_app_token | github_app
  credentials:
    token: "ghp_..."
```

## Usage

### Basic Usage

```bash
python prowler_bulk_provisioning.py providers.yaml
```

### Advanced Usage

```bash
python prowler_bulk_provisioning.py providers.yaml \
  --base-url https://api.prowler.com/api/v1 \
  --providers-endpoint /providers \
  --concurrency 6 \
  --timeout 120
```

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `input_file` | YAML file with provider entries | Required |
| `--base-url` | API base URL | `https://api.prowler.com/api/v1` |
| `--api-key` | Prowler API key | `PROWLER_API_KEY` env var |
| `--providers-endpoint` | Providers API endpoint | `/providers` |
| `--concurrency` | Number of concurrent requests | `5` |
| `--timeout` | Per-request timeout in seconds | `60` |
| `--insecure` | Disable TLS verification | `False` |
| `--dry-run` | Print payloads without sending | `False` |
| `--test-provider` | Test connection after creating each provider (true/false) | `true` (enabled by default) |
| `--test-provider-only` | Only test connections for existing providers (skip creation) | `False` |

### Self-hosted Prowler App

For self-hosted installations:

```bash
python prowler_bulk_provisioning.py providers.yaml \
  --base-url http://localhost:8080/api/v1
```

## Provider-Specific Configuration

### AWS Authentication Methods

#### IAM Role (Recommended)
```yaml
- provider: aws
  uid: "123456789012"
  alias: "prod"
  auth_method: role
  credentials:
    role_arn: "arn:aws:iam::123456789012:role/ProwlerScan"
    external_id: "optional-external-id"
```

#### Access Keys
```yaml
- provider: aws
  uid: "123456789012"
  alias: "dev"
  auth_method: credentials
  credentials:
    access_key_id: "AKIA..."
    secret_access_key: "..."
    session_token: "..."  # optional for temporary credentials
```

### Azure Authentication

```yaml
- provider: azure
  uid: "subscription-uuid"
  alias: "azure-prod"
  auth_method: service_principal
  credentials:
    tenant_id: "tenant-uuid"
    client_id: "client-uuid"
    client_secret: "client-secret"
```

### GCP Authentication

The Prowler API supports the following authentication methods for GCP:

#### Method 1: Service Account JSON (Recommended)
```yaml
- provider: gcp
  uid: "project-id"
  alias: "gcp-prod"
  auth_method: service_account  # or 'service_account_json'
  credentials:
    service_account_key_json_path: "/path/to/key.json"
    # OR inline:
    # inline_json:
    #   type: "service_account"
    #   project_id: "example-project"
    #   private_key_id: "example-key-id"
    #   private_key: "-----BEGIN PRIVATE KEY-----\n..."
    #   client_email: "service-account@project.iam.gserviceaccount.com"
    #   client_id: "1234567890"
    #   auth_uri: "https://accounts.google.com/o/oauth2/auth"
    #   token_uri: "https://oauth2.googleapis.com/token"
    #   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
    #   client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/..."
```

#### Method 2: OAuth2 Credentials
```yaml
- provider: gcp
  uid: "project-id"
  alias: "gcp-prod"
  auth_method: oauth2  # or 'adc' for Application Default Credentials
  credentials:
    client_id: "123456789012345678901.apps.googleusercontent.com"
    client_secret: "GOCSPX-xxxxxxxxxxxxxxxxx"
    refresh_token: "1//0exxxxxxxxxxxxxxxxx"
```

### Kubernetes Authentication

```yaml
- provider: kubernetes
  uid: "context-name"
  alias: "k8s-prod"
  auth_method: kubeconfig
  credentials:
    kubeconfig_path: "~/.kube/config"
    # OR
    # kubeconfig_inline: |
    #   apiVersion: v1
    #   clusters: ...
```

### Microsoft 365 Authentication

```yaml
- provider: m365
  uid: "domain.onmicrosoft.com"
  alias: "m365-tenant"
  auth_method: service_principal
  credentials:
    tenant_id: "tenant-uuid"
    client_id: "client-uuid"
    client_secret: "client-secret"
```

### GitHub Authentication

#### Personal Access Token
```yaml
- provider: github
  uid: "organization-name"
  alias: "gh-org"
  auth_method: personal_access_token
  credentials:
    token: "ghp_..."
```

#### GitHub App
```yaml
- provider: github
  uid: "organization-name"
  alias: "gh-org"
  auth_method: github_app
  credentials:
    app_id: "123456"
    private_key_path: "/path/to/private-key.pem"
    # OR
    # private_key_inline: "-----BEGIN RSA PRIVATE KEY-----\n..."
```

## Connection Testing

The script includes built-in connection testing to verify that providers can successfully authenticate with their respective cloud services.

By default, the script tests connections immediately after creating providers:

```bash
python prowler_bulk_provisioning.py providers.yaml
```

This will:
1. Create the provider
2. Add credentials
3. Test the connection
4. Report connection status

To skip connection testing, use:

```bash
python prowler_bulk_provisioning.py providers.yaml --test-provider false
```

### Test Existing Providers

Test connections for already existing providers without creating new ones:

```bash
python prowler_bulk_provisioning.py providers.yaml --test-provider-only
```

This is useful for:
- Verifying existing provider configurations
- Debugging authentication issues
- Regular connection health checks
- Testing after credential updates

### Example Output

```
[1] ✅ Created provider (id=db9a8985-f9ec-4dd8-b5a0-e05ab3880bed)
[1] ✅ Created secret (id=466f76c6-5878-4602-a4bc-13f9522c1fd2)
[1] ✅ Connection test: Connected

[2] ✅ Created provider (id=7a99f789-0cf5-4329-8279-2d443a962676)
[2] ✅ Created secret (id=c5702180-f7c4-40fd-be0e-f6433479b126)
[2] ❌ Connection test: Not connected
```

## Advanced Features

### Dry Run Mode

Test your configuration without making API calls:

```bash
python prowler_bulk_provisioning.py providers.yaml --dry-run
```

## Troubleshooting

### Common Issues

1. **Invalid API Key**
   ```
   Error: 401 Unauthorized
   Solution: Check your PROWLER_API_KEY environment variable or --api-key parameter
   ```

2. **Network Timeouts**
   ```
   Error: Request timeout
   Solution: Increase --timeout value or check network connectivity
   ```

3. **Invalid Provider Configuration**
   ```
   Error: Each item must include 'provider' and 'uid'
   Solution: Verify all required fields are present in your config file
   ```

4. **File Not Found Errors**
   ```
   Error: No such file or directory
   Solution: Check file paths for credentials files (JSON keys, kubeconfig, etc.)
   ```

## Examples

See the `examples/` directory for sample configuration files:

- `examples/simple-providers.yaml` - Basic example with minimal configuration

## Support

For issues and questions:

1. Check the [Prowler documentation](https://docs.prowler.com)
2. Review the [API documentation](https://api.prowler.com/api/v1/docs)
3. Open an issue in the [Prowler repository](https://github.com/prowler-cloud/prowler)

## License

This tool is part of the Prowler project and follows the same licensing terms.
```

--------------------------------------------------------------------------------

---[FILE: requirements-aws-org.txt]---
Location: prowler-master/util/prowler-bulk-provisioning/requirements-aws-org.txt

```text
# AWS Organizations Generator Dependencies
#
# This extends the base requirements.txt for the AWS Organizations generator

# Include base dependencies
-r requirements.txt

# AWS SDK for Python
boto3>=1.26.0

# Note: PyYAML is already included in requirements.txt
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: prowler-master/util/prowler-bulk-provisioning/requirements.txt

```text
# Prowler Provider Bulk Importer Dependencies
#
# Core HTTP library for API requests
requests>=2.28.0

# YAML parsing support (optional, only needed for YAML input files)
PyYAML>=6.0

# Type hints support for older Python versions (optional)
typing-extensions>=4.0.0; python_version < '3.8'
```

--------------------------------------------------------------------------------

---[FILE: aws-org-example.yaml]---
Location: prowler-master/util/prowler-bulk-provisioning/examples/aws-org-example.yaml

```yaml
# Example AWS Organizations Output
#
# This is an example of what aws_org_generator.py produces when run against
# an AWS Organization. This file can be directly used with prowler_bulk_provisioning.py
#
# Generated with:
#   python aws_org_generator.py -o aws-org-accounts.yaml \
#     --role-name ProwlerRole \
#     --external-id prowler-ext-id-12345

- provider: aws
  uid: '111111111111'
  alias: Production-Account
  auth_method: role
  credentials:
    role_arn: arn:aws:iam::111111111111:role/ProwlerRole
    external_id: prowler-ext-id-12345

- provider: aws
  uid: '222222222222'
  alias: Development-Account
  auth_method: role
  credentials:
    role_arn: arn:aws:iam::222222222222:role/ProwlerRole
    external_id: prowler-ext-id-12345

- provider: aws
  uid: '333333333333'
  alias: Staging-Account
  auth_method: role
  credentials:
    role_arn: arn:aws:iam::333333333333:role/ProwlerRole
    external_id: prowler-ext-id-12345

- provider: aws
  uid: '444444444444'
  alias: Security-Account
  auth_method: role
  credentials:
    role_arn: arn:aws:iam::444444444444:role/ProwlerRole
    external_id: prowler-ext-id-12345

- provider: aws
  uid: '555555555555'
  alias: Logging-Account
  auth_method: role
  credentials:
    role_arn: arn:aws:iam::555555555555:role/ProwlerRole
    external_id: prowler-ext-id-12345
```

--------------------------------------------------------------------------------

---[FILE: simple-providers.yaml]---
Location: prowler-master/util/prowler-bulk-provisioning/examples/simple-providers.yaml

```yaml
# Simple Prowler Provider Configuration Example
#
# This is a minimal example showing the basic required fields for each provider type.
# Use this as a starting point and refer to providers.yaml for complete examples.

# AWS with IAM Role (Recommended)
- provider: aws
  uid: "123456789012"
  alias: "my-aws-account"
  auth_method: role
  credentials:
    role_arn: "arn:aws:iam::123456789012:role/ProwlerScan"

# Azure with Service Principal
- provider: azure
  uid: "00000000-1111-2222-3333-444444444444"
  alias: "my-azure-subscription"
  auth_method: service_principal
  credentials:
    tenant_id: "tenant-id-here"
    client_id: "client-id-here"
    client_secret: "client-secret-here"

# GCP with Service Account
- provider: gcp
  uid: "my-gcp-project"
  alias: "my-gcp-project"
  auth_method: service_account_json
  credentials:
    service_account_key_json_path: "/path/to/service-account-key.json"

# Kubernetes with kubeconfig
- provider: kubernetes
  uid: "my-cluster-context"
  alias: "my-k8s-cluster"
  auth_method: kubeconfig
  credentials:
    kubeconfig_path: "~/.kube/config"

# Microsoft 365 with Service Principal
- provider: m365
  uid: "company.onmicrosoft.com"
  alias: "my-m365-tenant"
  auth_method: service_principal
  credentials:
    tenant_id: "tenant-id-here"
    client_id: "client-id-here"
    client_secret: "client-secret-here"

# GitHub with Personal Access Token
- provider: github
  uid: "my-organization"
  alias: "my-github-org"
  auth_method: personal_access_token
  credentials:
    token: "ghp_token_here"
```

--------------------------------------------------------------------------------

---[FILE: prowler_check_kreator.py]---
Location: prowler-master/util/prowler_check_kreator/prowler_check_kreator.py

```python
#!/usr/bin/env python3
import json
import os
import sys

from util.prowler_check_kreator.lib.templates import (
    load_check_template,
    load_test_template,
)


class ProwlerCheckKreator:
    def __init__(self, provider: str, check_name: str):
        # Validate provider

        SUPPORTED_PROVIDERS = {"aws"}

        if provider in SUPPORTED_PROVIDERS:
            self._provider = provider
        else:
            raise ValueError(
                f"Invalid provider. Supported providers: {', '.join(SUPPORTED_PROVIDERS)}"
            )

        # Find the Prowler folder
        self._prowler_folder = os.path.abspath(
            os.path.join(os.path.dirname(__file__), os.pardir, os.pardir)
        )

        # Validate if service exists for the selected provider
        service_name = check_name.split("_")[0]

        service_path = os.path.join(
            self._prowler_folder,
            "prowler/providers/",
            provider,
            "services/",
            service_name,
        )

        if os.path.exists(service_path):
            self._service_name = service_name
        else:
            raise ValueError(
                f"Service {service_name} does not exist for {provider}. Please introduce a valid service"
            )

        # Ask user if want to use Gemini for all the process

        user_input = (
            input(
                "Do you want to use Gemini to create the check and metadata? Type 'yes'/'no' and press enter: "
            )
            .strip()
            .lower()
        )

        if user_input == "yes":
            # Let the user to use the model that he wants
            supported_models = [
                "gemini-1.5-flash",
                "gemini-1.5-pro",
                "gemini-1.0-pro",
            ]

            print("Select the model that you want to use:")
            for i, model in enumerate(supported_models):
                print(f"{i + 1}. {model}")

            user_input = input(
                "Type the number of the model and press enter (default is 1): "
            ).strip()

            if not user_input:
                model_index = 1
            else:
                model_index = int(user_input)

            if model_index < 1 or model_index > len(supported_models):
                raise ValueError("Invalid model selected.")

            model_name = supported_models[model_index - 1]

            if "gemini" in model_name:
                from util.prowler_check_kreator.lib.llms.gemini import Gemini

                self._model = Gemini(model_name)

                # Provide some context about the check to create
                self._context = (
                    input(
                        "Please provide some context to generate the check and metadata:\n"
                    )
                ).strip()

            else:
                raise ValueError("Invalid model selected.")
        elif user_input == "no":
            self._model = None
            self._context = ""
        else:
            raise ValueError("Invalid input. Please type 'yes' or 'no'.")

        if not self._check_exists(check_name):
            self._check_name = check_name
            self._check_path = os.path.join(
                self._prowler_folder,
                "prowler/providers/",
                provider,
                "services/",
                service_name,
                check_name,
            )
        else:
            # Check already exists, give the user the possibility to continue or not
            user_input = (
                input(
                    f"Some files of {check_name} already exists. Do you want to continue and overwrite it? Type 'yes' if you want to continue: "
                )
                .strip()
                .lower()
            )

            if user_input == "yes":
                self._check_name = check_name
                self._check_path = os.path.join(
                    self._prowler_folder,
                    "prowler/providers/",
                    provider,
                    "services/",
                    service_name,
                    check_name,
                )
            else:
                raise ValueError(f"Check {check_name} already exists.")

    def kreate_check(self) -> None:
        """Create a new check in Prowler"""

        # Create the check
        print(f"Creating check {self._check_name} for {self._provider}")

        # Inside the check folder, create the check files: __init__.py, check_name.py, and check_name.metadata.json
        os.makedirs(self._check_path, exist_ok=True)

        with open(os.path.join(self._check_path, "__init__.py"), "w") as f:
            f.write("")

        self._write_check_file()
        self._write_metadata_file()

        # Create test directory if it does not exist
        test_folder = os.path.join(
            self._prowler_folder,
            "tests/providers/",
            self._provider,
            "services/",
            self._service_name,
            self._check_name,
        )

        os.makedirs(test_folder, exist_ok=True)

        self._write_test_file()

        print(f"Check {self._check_name} created successfully")

    def _check_exists(self, check_name: str) -> bool:
        """Ensure if any file related to the check already exists.

        Args:
            check_name: The name of the check.

        Returns:
            True if the check already exists, False otherwise.
        """

        # Get the check path
        check_path = os.path.join(
            self._prowler_folder,
            "prowler/providers/",
            self._provider,
            "services/",
            self._service_name,
            check_name,
        )

        # Get the test path
        _test_path = os.path.join(
            self._prowler_folder,
            "tests/providers/",
            self._provider,
            "services/",
            self._service_name,
            check_name,
        )

        # Check if exits check.py, check_metadata.json or check_test.py
        return (
            os.path.exists(check_path)
            or os.path.exists(os.path.join(check_path, "__init__.py"))
            or os.path.exists(os.path.join(check_path, f"{check_name}.py"))
            or os.path.exists(os.path.join(check_path, f"{check_name}.metadata.json"))
            or os.path.exists(_test_path)
        )

    def _write_check_file(self) -> None:
        """Write the check file"""

        if self._model is None:
            check_content = load_check_template(
                self._provider, self._service_name, self._check_name
            )
        else:
            check_content = self._model.generate_check(
                check_name=self._check_name, context=self._context
            )

        with open(os.path.join(self._check_path, f"{self._check_name}.py"), "w") as f:
            f.write(check_content)

    def _write_metadata_file(self) -> None:
        """Write the metadata file"""

        metadata_template = {
            "Provider": self._provider,
            "CheckID": self._check_name,
            "CheckTitle": "",
            "CheckType": [],
            "ServiceName": self._service_name,
            "SubServiceName": "",
            "ResourceIdTemplate": "",
            "Severity": "<critical, high, medium or low>",
            "ResourceType": "",
            "Description": "",
            "Risk": "",
            "RelatedUrl": "",
            "Remediation": {
                "Code": {
                    "CLI": "",
                    "NativeIaC": "",
                    "Other": "",
                    "Terraform": "",
                },
                "Recommendation": {"Text": "", "Url": ""},
            },
            "Categories": [],
            "DependsOn": [],
            "RelatedTo": [],
            "Notes": "",
        }

        if self._model is None:
            filled_metadata = metadata_template
        else:
            filled_metadata = self._model.generate_metadata(
                metadata_template, self._context
            )

        with open(
            os.path.join(self._check_path, f"{self._check_name}.metadata.json"), "w"
        ) as f:
            f.write(json.dumps(filled_metadata, indent=2))

    def _write_test_file(self) -> None:
        """Write the test file"""

        test_folder = os.path.join(
            self._prowler_folder,
            "tests/providers/",
            self._provider,
            "services/",
            self._service_name,
            self._check_name,
        )

        if self._model is None:
            test_template = load_test_template(
                self._provider, self._service_name, self._check_name
            )
        else:
            test_template = self._model.generate_test(self._check_name)

        with open(os.path.join(test_folder, f"{self._check_name}_test.py"), "w") as f:
            f.write(test_template)


if __name__ == "__main__":
    try:
        if len(sys.argv) != 3:
            raise ValueError(
                "Invalid arguments. Usage: python prowler_check_kreator.py <cloud_provider> <check_name>"
            )

        prowler_check_creator = ProwlerCheckKreator(sys.argv[1], sys.argv[2])

        sys.exit(prowler_check_creator.kreate_check())

    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)
```

--------------------------------------------------------------------------------

---[FILE: metadata_types.py]---
Location: prowler-master/util/prowler_check_kreator/lib/metadata_types.py

```python
def get_metadata_valid_check_type(provider: str = "aws") -> list:
    """Get the valid check types for the provider

    Args:
        provider: The Prowler provider.

    Returns:
        A list of valid check types for the given provider.
    """
    check_types = []

    if provider == "aws":
        check_types = [
            {
                "namespace": "Software and Configuration Checks",
                "children": [
                    {
                        "category": "Vulnerabilities",
                        "children": [{"classifier": "CVE"}],
                    },
                    {
                        "category": "AWS Security Best Practices",
                        "children": [
                            {"classifier": "Network Reachability"},
                            {"classifier": "Runtime Behavior Analysis"},
                        ],
                    },
                    {
                        "category": "Industry and Regulatory Standards",
                        "children": [
                            {"classifier": "AWS Foundational Security Best Practices"},
                            {"classifier": "CIS Host Hardening Benchmarks"},
                            {"classifier": "CIS AWS Foundations Benchmark"},
                            {"classifier": "PCI-DSS"},
                            {"classifier": "Cloud Security Alliance Controls"},
                            {"classifier": "ISO 90001 Controls"},
                            {"classifier": "ISO 27001 Controls"},
                            {"classifier": "ISO 27017 Controls"},
                            {"classifier": "ISO 27018 Controls"},
                            {"classifier": "SOC 1"},
                            {"classifier": "SOC 2"},
                            {"classifier": "HIPAA Controls (USA)"},
                            {"classifier": "NIST 800-53 Controls (USA)"},
                            {"classifier": "NIST CSF Controls (USA)"},
                            {"classifier": "IRAP Controls (Australia)"},
                            {"classifier": "K-ISMS Controls (Korea)"},
                            {"classifier": "MTCS Controls (Singapore)"},
                            {"classifier": "FISC Controls (Japan)"},
                            {"classifier": "My Number Act Controls (Japan)"},
                            {"classifier": "ENS Controls (Spain)"},
                            {"classifier": "Cyber Essentials Plus Controls (UK)"},
                            {"classifier": "G-Cloud Controls (UK)"},
                            {"classifier": "C5 Controls (Germany)"},
                            {"classifier": "IT-Grundschutz Controls (Germany)"},
                            {"classifier": "GDPR Controls (Europe)"},
                            {"classifier": "TISAX Controls (Europe)"},
                        ],
                    },
                    {"category": "Patch Management"},
                ],
            },
            {
                "namespace": "TTPs",
                "children": [
                    {"category": "Initial Access"},
                    {"category": "Execution"},
                    {"category": "Persistence"},
                    {"category": "Privilege Escalation"},
                    {"category": "Defense Evasion"},
                    {"category": "Credential Access"},
                    {"category": "Discovery"},
                    {"category": "Lateral Movement"},
                    {"category": "Collection"},
                    {"category": "Command and Control"},
                ],
            },
            {
                "namespace": "Effects",
                "children": [
                    {"category": "Data Exposure"},
                    {"category": "Data Exfiltration"},
                    {"category": "Data Destruction"},
                    {"category": "Denial of Service"},
                    {"category": "Resource Consumption"},
                ],
            },
            {
                "namespace": "Unusual Behaviors",
                "children": [
                    {"category": "Application"},
                    {"category": "Network Flow"},
                    {"category": "IP address"},
                    {"category": "User"},
                    {"category": "VM"},
                    {"category": "Container"},
                    {"category": "Serverless"},
                    {"category": "Process"},
                    {"category": "Database"},
                    {"category": "Data"},
                ],
            },
            {
                "namespace": "Sensitive Data Identifications",
                "children": [
                    {"category": "PII"},
                    {"category": "Passwords"},
                    {"category": "Legal"},
                    {"category": "Financial"},
                    {"category": "Security"},
                    {"category": "Business"},
                ],
            },
        ]

    return check_types


def get_metadata_valid_resource_type(provider: str = "aws") -> set:
    """Get the valid resource types for the provider

    Args:
        provider: The Prowler provider.

    Returns:
        A set of valid resource types for the given provider.
    """
    valid_resource_types = set()

    if provider == "aws":
        valid_resource_types = {
            "AwsIamAccessKey",
            "AwsElbLoadBalancer",
            "AwsRedshiftCluster",
            "AwsEventsEndpoint",
            "AwsElbv2LoadBalancer",
            "AwsAutoScalingLaunchConfiguration",
            "AwsWafv2RuleGroup",
            "AwsWafRegionalRule",
            "AwsCloudFrontDistribution",
            "AwsWafRegionalWebAcl",
            "AwsWafRateBasedRule",
            "AwsCertificateManagerCertificate",
            "AwsKmsKey",
            "AwsDmsEndpoint",
            "AwsLambdaLayerVersion",
            "AwsIamRole",
            "AwsElasticBeanstalkEnvironment",
            "AwsBackupBackupPlan",
            "AwsEc2ClientVpnEndpoint",
            "AwsEcrContainerImage",
            "AwsSqsQueue",
            "AwsIamGroup",
            "AwsOpenSearchServiceDomain",
            "AwsApiGatewayV2Api",
            "AwsCloudTrailTrail",
            "AwsWafWebAcl",
            "AwsEc2Subnet",
            "AwsEc2VpcPeeringConnection",
            "AwsEc2VpcEndpointService",
            "AwsCodeBuildProject",
            "AwsLambdaFunction",
            "AwsNetworkFirewallRuleGroup",
            "AwsDmsReplicationInstance",
            "AwsRdsEventSubscription",
            "AwsCloudWatchAlarm",
            "AwsS3AccountPublicAccessBlock",
            "AwsWafRegionalRateBasedRule",
            "AwsRdsDbInstance",
            "AwsEksCluster",
            "AwsXrayEncryptionConfig",
            "AwsWafv2WebAcl",
            "AwsWafRuleGroup",
            "AwsBackupBackupVault",
            "AwsKinesisStream",
            "AwsNetworkFirewallFirewallPolicy",
            "AwsEc2NetworkInterface",
            "AwsEcsTaskDefinition",
            "AwsMskCluster",
            "AwsApiGatewayRestApi",
            "AwsS3Object",
            "AwsRdsDbSnapshot",
            "AwsBackupRecoveryPoint",
            "AwsWafRule",
            "AwsS3AccessPoint",
            "AwsApiGatewayV2Stage",
            "AwsGuardDutyDetector",
            "AwsEfsAccessPoint",
            "AwsEcsContainer",
            "AwsEcsTask",
            "AwsS3Bucket",
            "AwsSageMakerNotebookInstance",
            "AwsNetworkFirewallFirewall",
            "AwsStepFunctionStateMachine",
            "AwsIamUser",
            "AwsAppSyncGraphQLApi",
            "AwsApiGatewayStage",
            "AwsEcrRepository",
            "AwsEcsService",
            "AwsEc2Vpc",
            "AwsAmazonMQBroker",
            "AwsWafRegionalRuleGroup",
            "AwsEventSchemasRegistry",
            "AwsRoute53HostedZone",
            "AwsEventsEventbus",
            "AwsDmsReplicationTask",
            "AwsEc2Instance",
            "AwsEcsCluster",
            "AwsRdsDbSecurityGroup",
            "AwsCloudFormationStack",
            "AwsSnsTopic",
            "AwsDynamoDbTable",
            "AwsRdsDbCluster",
            "AwsEc2Eip",
            "AwsEc2RouteTable",
            "AwsEc2TransitGateway",
            "AwsElasticSearchDomain",
            "AwsEc2LaunchTemplate",
            "AwsEc2Volume",
            "AwsAthenaWorkGroup",
            "AwsSecretsManagerSecret",
            "AwsEc2SecurityGroup",
            "AwsIamPolicy",
            "AwsSsmPatchCompliance",
            "AwsAutoScalingAutoScalingGroup",
            "AwsEc2NetworkAcl",
            "AwsRdsDbClusterSnapshot",
        }

    return valid_resource_types


def get_metadata_placeholder_resource_type(provider: str = "aws") -> str:
    """Get the placeholder for the resource type for the provider

    Args:
        provider: The Prowler provider.

    Returns:
        A placeholder for the resource type for the given provider.
    """
    placeholder = ""

    if provider == "aws":
        placeholder = "Other"

    return placeholder
```

--------------------------------------------------------------------------------

````
