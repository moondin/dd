---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 42
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 42 of 867)

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

---[FILE: base.py]---
Location: prowler-master/api/src/backend/api/v1/serializer_utils/base.py

```python
import yaml
from rest_framework_json_api import serializers
from rest_framework_json_api.serializers import ValidationError


class BaseValidateSerializer(serializers.Serializer):
    def validate(self, data):
        if hasattr(self, "initial_data"):
            initial_data = set(self.initial_data.keys()) - {"id", "type"}
            unknown_keys = initial_data - set(self.fields.keys())
            if unknown_keys:
                raise ValidationError(f"Invalid fields: {unknown_keys}")
        return data


class YamlOrJsonField(serializers.JSONField):
    def to_internal_value(self, data):
        if isinstance(data, str):
            try:
                data = yaml.safe_load(data)
            except yaml.YAMLError as exc:
                raise serializers.ValidationError("Invalid YAML format") from exc
        return super().to_internal_value(data)
```

--------------------------------------------------------------------------------

---[FILE: integrations.py]---
Location: prowler-master/api/src/backend/api/v1/serializer_utils/integrations.py

```python
import os
import re

from drf_spectacular.utils import extend_schema_field
from rest_framework_json_api import serializers

from api.v1.serializer_utils.base import BaseValidateSerializer


class S3ConfigSerializer(BaseValidateSerializer):
    bucket_name = serializers.CharField()
    output_directory = serializers.CharField(allow_blank=True)

    def validate_output_directory(self, value):
        """
        Validate the output_directory field to ensure it's a properly formatted path.
        Prevents paths with excessive slashes like "///////test".
        If empty, sets a default value.
        """
        # If empty or None, set default value
        if not value:
            return "output"

        # Normalize the path to remove excessive slashes
        normalized_path = os.path.normpath(value)

        # Remove leading slashes for S3 paths
        if normalized_path.startswith("/"):
            normalized_path = normalized_path.lstrip("/")

        # Check for invalid characters or patterns
        if re.search(r'[<>:"|?*]', normalized_path):
            raise serializers.ValidationError(
                'Output directory contains invalid characters. Avoid: < > : " | ? *'
            )

        # Check for empty path after normalization
        if not normalized_path or normalized_path == ".":
            raise serializers.ValidationError(
                "Output directory cannot be empty or just '.' or '/'."
            )

        # Check for paths that are too long (S3 key limit is 1024 characters, leave some room for filename)
        if len(normalized_path) > 900:
            raise serializers.ValidationError(
                "Output directory path is too long (max 900 characters)."
            )

        return normalized_path

    class Meta:
        resource_name = "integrations"


class SecurityHubConfigSerializer(BaseValidateSerializer):
    send_only_fails = serializers.BooleanField(default=False)
    archive_previous_findings = serializers.BooleanField(default=False)
    regions = serializers.DictField(default=dict, read_only=True)

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
        # Always initialize regions as empty dict
        validated_data["regions"] = {}
        return validated_data

    class Meta:
        resource_name = "integrations"


class JiraConfigSerializer(BaseValidateSerializer):
    domain = serializers.CharField(read_only=True)
    issue_types = serializers.ListField(
        read_only=True, child=serializers.CharField(), default=["Task"]
    )
    projects = serializers.DictField(read_only=True)

    class Meta:
        resource_name = "integrations"


class AWSCredentialSerializer(BaseValidateSerializer):
    role_arn = serializers.CharField(required=False)
    external_id = serializers.CharField(required=False)
    role_session_name = serializers.CharField(required=False)
    session_duration = serializers.IntegerField(
        required=False, min_value=900, max_value=43200
    )
    aws_access_key_id = serializers.CharField(required=False)
    aws_secret_access_key = serializers.CharField(required=False)
    aws_session_token = serializers.CharField(required=False)

    class Meta:
        resource_name = "integrations"


class JiraCredentialSerializer(BaseValidateSerializer):
    user_mail = serializers.EmailField(required=True)
    api_token = serializers.CharField(required=True)
    domain = serializers.CharField(required=True)

    class Meta:
        resource_name = "integrations"


@extend_schema_field(
    {
        "oneOf": [
            {
                "type": "object",
                "title": "AWS Credentials",
                "properties": {
                    "role_arn": {
                        "type": "string",
                        "description": "The Amazon Resource Name (ARN) of the role to assume. Required for AWS role "
                        "assumption.",
                    },
                    "external_id": {
                        "type": "string",
                        "description": "An identifier to enhance security for role assumption.",
                    },
                    "aws_access_key_id": {
                        "type": "string",
                        "description": "The AWS access key ID. Only required if the environment lacks pre-configured "
                        "AWS credentials.",
                    },
                    "aws_secret_access_key": {
                        "type": "string",
                        "description": "The AWS secret access key. Required if 'aws_access_key_id' is provided or if "
                        "no AWS credentials are pre-configured.",
                    },
                    "aws_session_token": {
                        "type": "string",
                        "description": "The session token for temporary credentials, if applicable.",
                    },
                    "session_duration": {
                        "type": "integer",
                        "minimum": 900,
                        "maximum": 43200,
                        "default": 3600,
                        "description": "The duration (in seconds) for the role session.",
                    },
                    "role_session_name": {
                        "type": "string",
                        "description": "An identifier for the role session, useful for tracking sessions in AWS logs. "
                        "The regex used to validate this parameter is a string of characters consisting of "
                        "upper- and lower-case alphanumeric characters with no spaces. You can also include "
                        "underscores or any of the following characters: =,.@-\n\n"
                        "Examples:\n"
                        "- MySession123\n"
                        "- User_Session-1\n"
                        "- Test.Session@2",
                        "pattern": "^[a-zA-Z0-9=,.@_-]+$",
                    },
                },
            },
            {
                "type": "object",
                "title": "JIRA Credentials",
                "properties": {
                    "user_mail": {
                        "type": "string",
                        "format": "email",
                        "description": "The email address of the JIRA user account.",
                    },
                    "api_token": {
                        "type": "string",
                        "description": "The API token for authentication with JIRA. This can be generated from your "
                        "Atlassian account settings.",
                    },
                    "domain": {
                        "type": "string",
                        "description": "The JIRA domain/instance URL (e.g., 'your-domain.atlassian.net').",
                    },
                },
                "required": ["user_mail", "api_token", "domain"],
            },
        ]
    }
)
class IntegrationCredentialField(serializers.JSONField):
    pass


@extend_schema_field(
    {
        "oneOf": [
            {
                "type": "object",
                "title": "Amazon S3",
                "properties": {
                    "bucket_name": {
                        "type": "string",
                        "description": "The name of the S3 bucket where files will be stored.",
                    },
                    "output_directory": {
                        "type": "string",
                        "description": "The directory path within the bucket where files will be saved. Optional - "
                        'defaults to "output" if not provided. Path will be normalized to remove '
                        'excessive slashes and invalid characters are not allowed (< > : " | ? *). '
                        "Maximum length is 900 characters.",
                        "maxLength": 900,
                        "pattern": '^[^<>:"|?*]+$',
                        "default": "output",
                    },
                },
                "required": ["bucket_name"],
            },
            {
                "type": "object",
                "title": "AWS Security Hub",
                "properties": {
                    "send_only_fails": {
                        "type": "boolean",
                        "default": False,
                        "description": "If true, only findings with status 'FAIL' will be sent to Security Hub.",
                    },
                    "archive_previous_findings": {
                        "type": "boolean",
                        "default": False,
                        "description": "If true, archives findings that are not present in the current execution.",
                    },
                },
            },
            {
                "type": "object",
                "title": "JIRA",
                "description": "JIRA integration does not accept any configuration in the payload. Leave it as an "
                "empty JSON object (`{}`).",
                "properties": {},
                "additionalProperties": False,
            },
        ]
    }
)
class IntegrationConfigField(serializers.JSONField):
    pass
```

--------------------------------------------------------------------------------

---[FILE: lighthouse.py]---
Location: prowler-master/api/src/backend/api/v1/serializer_utils/lighthouse.py

```python
import re

from drf_spectacular.utils import extend_schema_field
from rest_framework_json_api import serializers


class OpenAICredentialsSerializer(serializers.Serializer):
    api_key = serializers.CharField()

    def validate_api_key(self, value: str) -> str:
        pattern = r"^sk-[\w-]+$"
        if not re.match(pattern, value or ""):
            raise serializers.ValidationError("Invalid OpenAI API key format.")
        return value

    def to_internal_value(self, data):
        """Check for unknown fields before DRF filters them out."""
        if not isinstance(data, dict):
            raise serializers.ValidationError(
                {"non_field_errors": ["Credentials must be an object"]}
            )

        allowed_fields = set(self.fields.keys())
        provided_fields = set(data.keys())
        extra_fields = provided_fields - allowed_fields

        if extra_fields:
            raise serializers.ValidationError(
                {
                    "non_field_errors": [
                        f"Unknown fields in credentials: {', '.join(sorted(extra_fields))}"
                    ]
                }
            )

        return super().to_internal_value(data)


class BedrockCredentialsSerializer(serializers.Serializer):
    """
    Serializer for AWS Bedrock credentials validation.

    Supports two authentication methods:
    1. AWS access key + secret key
    2. Bedrock API key (bearer token)

    In both cases, region is mandatory.
    """

    access_key_id = serializers.CharField(required=False, allow_blank=False)
    secret_access_key = serializers.CharField(required=False, allow_blank=False)
    api_key = serializers.CharField(required=False, allow_blank=False)
    region = serializers.CharField()

    def validate_access_key_id(self, value: str) -> str:
        """Validate AWS access key ID format (AKIA for long-term credentials)."""
        pattern = r"^AKIA[0-9A-Z]{16}$"
        if not re.match(pattern, value or ""):
            raise serializers.ValidationError(
                "Invalid AWS access key ID format. Must be AKIA followed by 16 alphanumeric characters."
            )
        return value

    def validate_secret_access_key(self, value: str) -> str:
        """Validate AWS secret access key format (40 base64 characters)."""
        pattern = r"^[A-Za-z0-9/+=]{40}$"
        if not re.match(pattern, value or ""):
            raise serializers.ValidationError(
                "Invalid AWS secret access key format. Must be 40 base64 characters."
            )
        return value

    def validate_api_key(self, value: str) -> str:
        """
        Validate Bedrock API key (bearer token).
        """
        pattern = r"^ABSKQmVkcm9ja0FQSUtleS[A-Za-z0-9+/=]{110}$"
        if not re.match(pattern, value or ""):
            raise serializers.ValidationError("Invalid Bedrock API key format.")
        return value

    def validate_region(self, value: str) -> str:
        """Validate AWS region format."""
        pattern = r"^[a-z]{2}-[a-z]+-\d+$"
        if not re.match(pattern, value or ""):
            raise serializers.ValidationError(
                "Invalid AWS region format. Expected format like 'us-east-1' or 'eu-west-2'."
            )
        return value

    def validate(self, attrs):
        """
        Enforce either:
        - access_key_id + secret_access_key + region
        OR
        - api_key + region
        """
        access_key_id = attrs.get("access_key_id")
        secret_access_key = attrs.get("secret_access_key")
        api_key = attrs.get("api_key")
        region = attrs.get("region")

        errors = {}

        if not region:
            errors["region"] = ["Region is required."]

        using_access_keys = bool(access_key_id or secret_access_key)
        using_api_key = api_key is not None and api_key != ""

        if using_access_keys and using_api_key:
            errors["non_field_errors"] = [
                "Provide either access key + secret key OR api key, not both."
            ]
        elif not using_access_keys and not using_api_key:
            errors["non_field_errors"] = [
                "You must provide either access key + secret key OR api key."
            ]
        elif using_access_keys:
            # Both access_key_id and secret_access_key must be present together
            if not access_key_id:
                errors.setdefault("access_key_id", []).append(
                    "AWS access key ID is required when using access key authentication."
                )
            if not secret_access_key:
                errors.setdefault("secret_access_key", []).append(
                    "AWS secret access key is required when using access key authentication."
                )

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def to_internal_value(self, data):
        """Check for unknown fields before DRF filters them out."""
        if not isinstance(data, dict):
            raise serializers.ValidationError(
                {"non_field_errors": ["Credentials must be an object"]}
            )

        allowed_fields = set(self.fields.keys())
        provided_fields = set(data.keys())
        extra_fields = provided_fields - allowed_fields

        if extra_fields:
            raise serializers.ValidationError(
                {
                    "non_field_errors": [
                        f"Unknown fields in credentials: {', '.join(sorted(extra_fields))}"
                    ]
                }
            )

        return super().to_internal_value(data)


class BedrockCredentialsUpdateSerializer(BedrockCredentialsSerializer):
    """
    Serializer for AWS Bedrock credentials during UPDATE operations.

    Inherits all validation logic from BedrockCredentialsSerializer but makes
    all fields optional to support partial updates.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make all fields optional for updates
        for field in self.fields.values():
            field.required = False

    def validate(self, attrs):
        """
        For updates, this serializer only checks individual fields.
        It does NOT enforce the "either access keys OR api key" rule.
        That rule is applied later, after merging with existing stored
        credentials, in LighthouseProviderConfigUpdateSerializer.
        """
        return attrs


class OpenAICompatibleCredentialsSerializer(serializers.Serializer):
    """
    Minimal serializer for OpenAI-compatible credentials.

    Many OpenAI-compatible providers do not use the same key format as OpenAI.
    We only require a non-empty API key string. Additional fields can be added later
    without breaking existing configurations.
    """

    api_key = serializers.CharField()

    def validate_api_key(self, value: str) -> str:
        if not isinstance(value, str) or not value.strip():
            raise serializers.ValidationError("API key is required.")
        return value.strip()

    def to_internal_value(self, data):
        """Check for unknown fields before DRF filters them out."""
        if not isinstance(data, dict):
            raise serializers.ValidationError(
                {"non_field_errors": ["Credentials must be an object"]}
            )

        allowed_fields = set(self.fields.keys())
        provided_fields = set(data.keys())
        extra_fields = provided_fields - allowed_fields

        if extra_fields:
            raise serializers.ValidationError(
                {
                    "non_field_errors": [
                        f"Unknown fields in credentials: {', '.join(sorted(extra_fields))}"
                    ]
                }
            )

        return super().to_internal_value(data)


@extend_schema_field(
    {
        "oneOf": [
            {
                "type": "object",
                "title": "OpenAI Credentials",
                "properties": {
                    "api_key": {
                        "type": "string",
                        "description": "OpenAI API key. Must start with 'sk-' followed by alphanumeric characters, "
                        "hyphens, or underscores.",
                        "pattern": "^sk-[\\w-]+$",
                    }
                },
                "required": ["api_key"],
            },
            {
                "title": "AWS Bedrock Credentials",
                "oneOf": [
                    {
                        "title": "IAM Access Key Pair",
                        "type": "object",
                        "description": "Authenticate with AWS access key and secret key. Recommended when you manage IAM users or roles.",
                        "properties": {
                            "access_key_id": {
                                "type": "string",
                                "description": "AWS access key ID.",
                                "pattern": "^AKIA[0-9A-Z]{16}$",
                            },
                            "secret_access_key": {
                                "type": "string",
                                "description": "AWS secret access key.",
                                "pattern": "^[A-Za-z0-9/+=]{40}$",
                            },
                            "region": {
                                "type": "string",
                                "description": "AWS region identifier where Bedrock is available. Examples: us-east-1, "
                                "us-west-2, eu-west-1, ap-northeast-1.",
                                "pattern": "^[a-z]{2}-[a-z]+-\\d+$",
                            },
                        },
                        "required": ["access_key_id", "secret_access_key", "region"],
                    },
                    {
                        "title": "Amazon Bedrock API Key",
                        "type": "object",
                        "description": "Authenticate with an Amazon Bedrock API key (bearer token). Region is still required.",
                        "properties": {
                            "api_key": {
                                "type": "string",
                                "description": "Amazon Bedrock API key (bearer token).",
                            },
                            "region": {
                                "type": "string",
                                "description": "AWS region identifier where Bedrock is available. Examples: us-east-1, "
                                "us-west-2, eu-west-1, ap-northeast-1.",
                                "pattern": "^[a-z]{2}-[a-z]+-\\d+$",
                            },
                        },
                        "required": ["api_key", "region"],
                    },
                ],
            },
            {
                "type": "object",
                "title": "OpenAI Compatible Credentials",
                "properties": {
                    "api_key": {
                        "type": "string",
                        "description": "API key for OpenAI-compatible provider. The format varies by provider. "
                        "Note: The 'base_url' field (separate from credentials) is required when using this provider type.",
                    }
                },
                "required": ["api_key"],
            },
        ]
    }
)
class LighthouseCredentialsField(serializers.JSONField):
    pass
```

--------------------------------------------------------------------------------

---[FILE: processors.py]---
Location: prowler-master/api/src/backend/api/v1/serializer_utils/processors.py

```python
from drf_spectacular.utils import extend_schema_field

from api.v1.serializer_utils.base import YamlOrJsonField

from prowler.lib.mutelist.mutelist import mutelist_schema


@extend_schema_field(
    {
        "oneOf": [
            {
                "type": "object",
                "title": "Mutelist",
                "properties": {"Mutelist": mutelist_schema},
                "additionalProperties": False,
            },
        ]
    }
)
class ProcessorConfigField(YamlOrJsonField):
    pass
```

--------------------------------------------------------------------------------

---[FILE: providers.py]---
Location: prowler-master/api/src/backend/api/v1/serializer_utils/providers.py

```python
from drf_spectacular.utils import extend_schema_field
from rest_framework_json_api import serializers


@extend_schema_field(
    {
        "oneOf": [
            {
                "type": "object",
                "title": "AWS Static Credentials",
                "properties": {
                    "aws_access_key_id": {
                        "type": "string",
                        "description": "The AWS access key ID. Required for environments where no IAM role is being "
                        "assumed and direct AWS access is needed.",
                    },
                    "aws_secret_access_key": {
                        "type": "string",
                        "description": "The AWS secret access key. Must accompany 'aws_access_key_id' to authorize "
                        "access to AWS resources.",
                    },
                    "aws_session_token": {
                        "type": "string",
                        "description": "The session token associated with temporary credentials. Only needed for "
                        "session-based or temporary AWS access.",
                    },
                },
                "required": ["aws_access_key_id", "aws_secret_access_key"],
            },
            {
                "type": "object",
                "title": "AWS Assume Role",
                "properties": {
                    "role_arn": {
                        "type": "string",
                        "description": "The Amazon Resource Name (ARN) of the role to assume. Required for AWS role "
                        "assumption.",
                    },
                    "external_id": {
                        "type": "string",
                        "description": "An identifier to enhance security for role assumption.",
                    },
                    "aws_access_key_id": {
                        "type": "string",
                        "description": "The AWS access key ID. Only required if the environment lacks pre-configured "
                        "AWS credentials.",
                    },
                    "aws_secret_access_key": {
                        "type": "string",
                        "description": "The AWS secret access key. Required if 'aws_access_key_id' is provided or if "
                        "no AWS credentials are pre-configured.",
                    },
                    "aws_session_token": {
                        "type": "string",
                        "description": "The session token for temporary credentials, if applicable.",
                    },
                    "session_duration": {
                        "type": "integer",
                        "minimum": 900,
                        "maximum": 43200,
                        "default": 3600,
                        "description": "The duration (in seconds) for the role session.",
                    },
                    "role_session_name": {
                        "type": "string",
                        "description": "An identifier for the role session, useful for tracking sessions in AWS logs. "
                        "The regex used to validate this parameter is a string of characters consisting of "
                        "upper- and lower-case alphanumeric characters with no spaces. You can also include "
                        "underscores or any of the following characters: =,.@-\n\n"
                        "Examples:\n"
                        "- MySession123\n"
                        "- User_Session-1\n"
                        "- Test.Session@2",
                        "pattern": "^[a-zA-Z0-9=,.@_-]+$",
                    },
                },
                "required": ["role_arn", "external_id"],
            },
            {
                "type": "object",
                "title": "Azure Static Credentials",
                "properties": {
                    "client_id": {
                        "type": "string",
                        "description": "The Azure application (client) ID for authentication in Azure AD.",
                    },
                    "client_secret": {
                        "type": "string",
                        "description": "The client secret associated with the application (client) ID, providing "
                        "secure access.",
                    },
                    "tenant_id": {
                        "type": "string",
                        "description": "The Azure tenant ID, representing the directory where the application is "
                        "registered.",
                    },
                },
                "required": ["client_id", "client_secret", "tenant_id"],
            },
            {
                "type": "object",
                "title": "M365 Static Credentials",
                "properties": {
                    "client_id": {
                        "type": "string",
                        "description": "The Azure application (client) ID for authentication in Azure AD.",
                    },
                    "tenant_id": {
                        "type": "string",
                        "description": "The Azure tenant ID, representing the directory where the application is "
                        "registered.",
                    },
                    "client_secret": {
                        "type": "string",
                        "description": "The client secret associated with the application (client) ID, providing "
                        "secure access.",
                    },
                    "user": {
                        "type": "email",
                        "description": "User microsoft email address.",
                        "deprecated": True,
                    },
                    "password": {
                        "type": "string",
                        "description": "User password.",
                        "deprecated": True,
                    },
                },
                "required": [
                    "client_id",
                    "client_secret",
                    "tenant_id",
                    "user",
                    "password",
                ],
            },
            {
                "type": "object",
                "title": "M365 Certificate Credentials",
                "properties": {
                    "client_id": {
                        "type": "string",
                        "description": "The Azure application (client) ID for authentication in Azure AD.",
                    },
                    "tenant_id": {
                        "type": "string",
                        "description": "The Azure tenant ID, representing the directory where the application is "
                        "registered.",
                    },
                    "certificate_content": {
                        "type": "string",
                        "description": "The certificate content in base64 format for certificate-based authentication.",
                    },
                },
                "required": [
                    "client_id",
                    "tenant_id",
                    "certificate_content",
                ],
            },
            {
                "type": "object",
                "title": "GCP Static Credentials",
                "properties": {
                    "client_id": {
                        "type": "string",
                        "description": "The client ID from Google Cloud, used to identify the application for GCP "
                        "access.",
                    },
                    "client_secret": {
                        "type": "string",
                        "description": "The client secret associated with the GCP client ID, required for secure "
                        "access.",
                    },
                    "refresh_token": {
                        "type": "string",
                        "description": "A refresh token that allows the application to obtain new access tokens for "
                        "extended use.",
                    },
                },
                "required": ["client_id", "client_secret", "refresh_token"],
            },
            {
                "type": "object",
                "title": "GCP Service Account Key",
                "properties": {
                    "service_account_key": {
                        "type": "object",
                        "description": "The service account key for GCP.",
                    }
                },
                "required": ["service_account_key"],
            },
            {
                "type": "object",
                "title": "Kubernetes Static Credentials",
                "properties": {
                    "kubeconfig_content": {
                        "type": "string",
                        "description": "The content of the Kubernetes kubeconfig file, encoded as a string.",
                    }
                },
                "required": ["kubeconfig_content"],
            },
            {
                "type": "object",
                "title": "GitHub Personal Access Token",
                "properties": {
                    "personal_access_token": {
                        "type": "string",
                        "description": "GitHub personal access token for authentication.",
                    }
                },
                "required": ["personal_access_token"],
            },
            {
                "type": "object",
                "title": "GitHub OAuth App Token",
                "properties": {
                    "oauth_app_token": {
                        "type": "string",
                        "description": "GitHub OAuth App token for authentication.",
                    }
                },
                "required": ["oauth_app_token"],
            },
            {
                "type": "object",
                "title": "GitHub App Credentials",
                "properties": {
                    "github_app_id": {
                        "type": "integer",
                        "description": "GitHub App ID for authentication.",
                    },
                    "github_app_key": {
                        "type": "string",
                        "description": "Path to the GitHub App private key file.",
                    },
                },
                "required": ["github_app_id", "github_app_key"],
            },
            {
                "type": "object",
                "title": "IaC Repository Credentials",
                "properties": {
                    "repository_url": {
                        "type": "string",
                        "description": "Repository URL to scan for IaC files.",
                    },
                    "access_token": {
                        "type": "string",
                        "description": "Optional access token for private repositories.",
                    },
                },
                "required": ["repository_url"],
            },
            {
                "type": "object",
                "title": "Oracle Cloud Infrastructure (OCI) API Key Credentials",
                "properties": {
                    "user": {
                        "type": "string",
                        "description": "The OCID of the user to authenticate with.",
                    },
                    "fingerprint": {
                        "type": "string",
                        "description": "The fingerprint of the API signing key.",
                    },
                    "key_file": {
                        "type": "string",
                        "description": "The path to the private key file for API signing. Either key_file or key_content must be provided.",
                    },
                    "key_content": {
                        "type": "string",
                        "description": "The content of the private key for API signing (base64 encoded). Either key_file or key_content must be provided.",
                    },
                    "tenancy": {
                        "type": "string",
                        "description": "The OCID of the tenancy.",
                    },
                    "region": {
                        "type": "string",
                        "description": "The OCI region identifier (e.g., us-ashburn-1, us-phoenix-1).",
                    },
                    "pass_phrase": {
                        "type": "string",
                        "description": "The passphrase for the private key, if encrypted.",
                    },
                },
                "required": ["user", "fingerprint", "tenancy", "region"],
            },
            {
                "type": "object",
                "title": "MongoDB Atlas API Key",
                "properties": {
                    "atlas_public_key": {
                        "type": "string",
                        "description": "MongoDB Atlas API public key.",
                    },
                    "atlas_private_key": {
                        "type": "string",
                        "description": "MongoDB Atlas API private key.",
                    },
                },
                "required": ["atlas_public_key", "atlas_private_key"],
            },
        ]
    }
)
class ProviderSecretField(serializers.JSONField):
    pass
```

--------------------------------------------------------------------------------

---[FILE: asgi.py]---
Location: prowler-master/api/src/backend/config/asgi.py
Signals: Django

```python
"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.django.production")

application = get_asgi_application()
```

--------------------------------------------------------------------------------

---[FILE: celery.py]---
Location: prowler-master/api/src/backend/config/celery.py
Signals: Django, Celery

```python
import warnings

from celery import Celery, Task
from config.env import env

# Suppress specific warnings from django-rest-auth: https://github.com/iMerica/dj-rest-auth/issues/684
warnings.filterwarnings(
    "ignore", category=UserWarning, module="dj_rest_auth.registration.serializers"
)

BROKER_VISIBILITY_TIMEOUT = env.int("DJANGO_BROKER_VISIBILITY_TIMEOUT", default=86400)

celery_app = Celery("tasks")

celery_app.config_from_object("django.conf:settings", namespace="CELERY")
celery_app.conf.update(result_extended=True, result_expires=None)

celery_app.conf.broker_transport_options = {
    "visibility_timeout": BROKER_VISIBILITY_TIMEOUT
}
celery_app.conf.result_backend_transport_options = {
    "visibility_timeout": BROKER_VISIBILITY_TIMEOUT
}
celery_app.conf.visibility_timeout = BROKER_VISIBILITY_TIMEOUT

celery_app.autodiscover_tasks(["api"])


class RLSTask(Task):
    def apply_async(
        self,
        args=None,
        kwargs=None,
        task_id=None,
        producer=None,
        link=None,
        link_error=None,
        shadow=None,
        **options,
    ):
        from django_celery_results.models import TaskResult

        from api.models import Task as APITask

        result = super().apply_async(
            args=args,
            kwargs=kwargs,
            task_id=task_id,
            producer=producer,
            link=link,
            link_error=link_error,
            shadow=shadow,
            **options,
        )
        task_result_instance = TaskResult.objects.get(task_id=result.task_id)
        from api.db_utils import rls_transaction

        tenant_id = kwargs.get("tenant_id")
        with rls_transaction(tenant_id):
            APITask.objects.update_or_create(
                id=task_result_instance.task_id,
                tenant_id=tenant_id,
                defaults={"task_runner_task": task_result_instance},
            )
        return result
```

--------------------------------------------------------------------------------

````
