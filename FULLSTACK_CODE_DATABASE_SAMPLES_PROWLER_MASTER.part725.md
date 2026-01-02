---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 725
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 725 of 867)

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

---[FILE: m365_arguments_test.py]---
Location: prowler-master/tests/providers/m365/lib/arguments/m365_arguments_test.py

```python
import argparse
from unittest.mock import MagicMock

from prowler.providers.m365.lib.arguments import arguments


class TestM365Arguments:
    def setup_method(self):
        """Setup mock ArgumentParser for testing"""
        self.mock_parser = MagicMock()
        self.mock_subparsers = MagicMock()
        self.mock_m365_parser = MagicMock()
        self.mock_auth_group = MagicMock()
        self.mock_auth_modes_group = MagicMock()
        self.mock_regions_group = MagicMock()

        # Setup the mock chain
        self.mock_parser.add_subparsers.return_value = self.mock_subparsers
        self.mock_subparsers.add_parser.return_value = self.mock_m365_parser
        self.mock_m365_parser.add_argument_group.side_effect = [
            self.mock_auth_group,
            self.mock_regions_group,
        ]
        self.mock_auth_group.add_mutually_exclusive_group.return_value = (
            self.mock_auth_modes_group
        )

    def test_init_parser_creates_subparser(self):
        """Test that init_parser creates the M365 subparser correctly"""
        # Create a mock object that has the necessary attributes
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        # Call init_parser
        arguments.init_parser(mock_m365_args)

        # Verify subparser was created
        self.mock_subparsers.add_parser.assert_called_once_with(
            "m365",
            parents=[mock_m365_args.common_providers_parser],
            help="M365 Provider",
        )

    def test_init_parser_creates_argument_groups(self):
        """Test that init_parser creates the correct argument groups"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Verify argument groups were created
        assert self.mock_m365_parser.add_argument_group.call_count == 2
        calls = self.mock_m365_parser.add_argument_group.call_args_list
        assert calls[0][0][0] == "Authentication Modes"
        assert calls[1][0][0] == "Regions"

    def test_init_parser_creates_mutually_exclusive_auth_group(self):
        """Test that init_parser creates mutually exclusive authentication group"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Verify mutually exclusive group was created for authentication modes
        self.mock_auth_group.add_mutually_exclusive_group.assert_called_once()

    def test_init_parser_adds_authentication_arguments(self):
        """Test that init_parser adds all authentication arguments"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Verify authentication arguments were added to the mutually exclusive group
        assert self.mock_auth_modes_group.add_argument.call_count == 5

        # Check that all authentication arguments are present
        calls = self.mock_auth_modes_group.add_argument.call_args_list
        auth_args = [call[0][0] for call in calls]

        assert "--az-cli-auth" in auth_args
        assert "--env-auth" in auth_args
        assert "--sp-env-auth" in auth_args
        assert "--browser-auth" in auth_args
        assert "--certificate-auth" in auth_args

    def test_init_parser_adds_non_exclusive_arguments(self):
        """Test that init_parser adds non-exclusive arguments directly to parser"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Verify non-exclusive arguments were added to main parser
        assert self.mock_m365_parser.add_argument.call_count == 3

        # Check that non-exclusive arguments are present
        calls = self.mock_m365_parser.add_argument.call_args_list
        non_exclusive_args = [call[0][0] for call in calls]

        assert "--tenant-id" in non_exclusive_args
        assert "--init-modules" in non_exclusive_args
        assert "--certificate-path" in non_exclusive_args

    def test_init_parser_adds_region_arguments(self):
        """Test that init_parser adds region arguments"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Verify region arguments were added to regions group
        assert self.mock_regions_group.add_argument.call_count == 1

        # Check that region argument is present
        calls = self.mock_regions_group.add_argument.call_args_list
        region_args = [call[0][0] for call in calls]

        assert "--region" in region_args

    def test_az_cli_auth_argument_configuration(self):
        """Test that az-cli-auth argument is configured correctly"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Find the az-cli-auth argument call
        calls = self.mock_auth_modes_group.add_argument.call_args_list
        az_cli_call = None
        for call in calls:
            if call[0][0] == "--az-cli-auth":
                az_cli_call = call
                break

        assert az_cli_call is not None

        # Check argument configuration
        kwargs = az_cli_call[1]
        assert kwargs["action"] == "store_true"
        assert "Azure CLI authentication" in kwargs["help"]

    def test_sp_env_auth_argument_configuration(self):
        """Test that sp-env-auth argument is configured correctly"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Find the sp-env-auth argument call
        calls = self.mock_auth_modes_group.add_argument.call_args_list
        sp_env_call = None
        for call in calls:
            if call[0][0] == "--sp-env-auth":
                sp_env_call = call
                break

        assert sp_env_call is not None

        # Check argument configuration
        kwargs = sp_env_call[1]
        assert kwargs["action"] == "store_true"
        assert "Service Principal environment variables" in kwargs["help"]

    def test_browser_auth_argument_configuration(self):
        """Test that browser-auth argument is configured correctly"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Find the browser-auth argument call
        calls = self.mock_auth_modes_group.add_argument.call_args_list
        browser_auth_call = None
        for call in calls:
            if call[0][0] == "--browser-auth":
                browser_auth_call = call
                break

        assert browser_auth_call is not None

        # Check argument configuration
        kwargs = browser_auth_call[1]
        assert kwargs["action"] == "store_true"
        assert "Azure interactive browser authentication" in kwargs["help"]

    def test_certificate_auth_argument_configuration(self):
        """Test that certificate-auth argument is configured correctly"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Find the certificate-auth argument call
        calls = self.mock_auth_modes_group.add_argument.call_args_list
        cert_auth_call = None
        for call in calls:
            if call[0][0] == "--certificate-auth":
                cert_auth_call = call
                break

        assert cert_auth_call is not None

        # Check argument configuration
        kwargs = cert_auth_call[1]
        assert kwargs["action"] == "store_true"
        assert "Certificate authentication" in kwargs["help"]

    def test_tenant_id_argument_configuration(self):
        """Test that tenant-id argument is configured correctly"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Find the tenant-id argument call
        calls = self.mock_m365_parser.add_argument.call_args_list
        tenant_id_call = None
        for call in calls:
            if call[0][0] == "--tenant-id":
                tenant_id_call = call
                break

        assert tenant_id_call is not None

        # Check argument configuration
        kwargs = tenant_id_call[1]
        assert kwargs["nargs"] == "?"
        assert kwargs["default"] is None
        assert "Microsoft 365 Tenant ID" in kwargs["help"]
        assert "--browser-auth" in kwargs["help"]

    def test_init_modules_argument_configuration(self):
        """Test that init-modules argument is configured correctly"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Find the init-modules argument call
        calls = self.mock_m365_parser.add_argument.call_args_list
        init_modules_call = None
        for call in calls:
            if call[0][0] == "--init-modules":
                init_modules_call = call
                break

        assert init_modules_call is not None

        # Check argument configuration
        kwargs = init_modules_call[1]
        assert kwargs["action"] == "store_true"
        assert "Initialize Microsoft 365 PowerShell modules" in kwargs["help"]

    def test_region_argument_configuration(self):
        """Test that region argument is configured correctly"""
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = self.mock_subparsers
        mock_m365_args.common_providers_parser = MagicMock()

        arguments.init_parser(mock_m365_args)

        # Find the region argument call
        calls = self.mock_regions_group.add_argument.call_args_list
        region_call = None
        for call in calls:
            if call[0][0] == "--region":
                region_call = call
                break

        assert region_call is not None

        # Check argument configuration
        kwargs = region_call[1]
        assert kwargs["nargs"] == "?"
        assert kwargs["default"] == "M365Global"
        assert kwargs["choices"] == [
            "M365Global",
            "M365GlobalChina",
            "M365USGovernment",
        ]
        assert "Microsoft 365 region" in kwargs["help"]
        assert "M365Global" in kwargs["help"]


class TestM365ArgumentsIntegration:
    def test_real_argument_parsing_az_cli_auth(self):
        """Test parsing arguments with Azure CLI authentication"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        # Create a mock object that mimics the structure used by the init_parser function
        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse arguments with Azure CLI auth
        args = parser.parse_args(["m365", "--az-cli-auth"])

        assert args.az_cli_auth is True
        assert not hasattr(args, "env_auth")
        assert args.sp_env_auth is False
        assert args.browser_auth is False
        assert args.certificate_auth is False

    def test_real_argument_parsing_sp_env_auth(self):
        """Test parsing arguments with service principal environment authentication"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse arguments with service principal environment auth
        args = parser.parse_args(["m365", "--sp-env-auth"])

        assert args.az_cli_auth is False
        assert not hasattr(args, "env_auth")
        assert args.sp_env_auth is True
        assert args.browser_auth is False
        assert args.certificate_auth is False

    def test_real_argument_parsing_browser_auth_with_tenant_id(self):
        """Test parsing arguments with browser authentication and tenant ID"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse arguments with browser auth and tenant ID
        args = parser.parse_args(
            [
                "m365",
                "--browser-auth",
                "--tenant-id",
                "12345678-1234-5678-abcd-123456789012",
            ]
        )

        assert args.az_cli_auth is False
        assert not hasattr(args, "env_auth")
        assert args.sp_env_auth is False
        assert args.browser_auth is True
        assert args.certificate_auth is False
        assert args.tenant_id == "12345678-1234-5678-abcd-123456789012"

    def test_real_argument_parsing_certificate_auth(self):
        """Test parsing arguments with certificate authentication"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse arguments with certificate auth
        args = parser.parse_args(["m365", "--certificate-auth"])

        assert args.az_cli_auth is False
        assert not hasattr(args, "env_auth")
        assert args.sp_env_auth is False
        assert args.browser_auth is False
        assert args.certificate_auth is True

    def test_real_argument_parsing_with_init_modules(self):
        """Test parsing arguments with init modules flag"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse arguments with init modules
        args = parser.parse_args(["m365", "--az-cli-auth", "--init-modules"])

        assert args.az_cli_auth is True
        assert args.init_modules is True

    def test_real_argument_parsing_with_different_regions(self):
        """Test parsing arguments with different region options"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Test M365Global (default)
        args = parser.parse_args(["m365", "--az-cli-auth"])
        assert args.region == "M365Global"

        # Test M365GlobalChina
        args = parser.parse_args(
            ["m365", "--az-cli-auth", "--region", "M365GlobalChina"]
        )
        assert args.region == "M365GlobalChina"

        # Test M365USGovernment
        args = parser.parse_args(
            ["m365", "--az-cli-auth", "--region", "M365USGovernment"]
        )
        assert args.region == "M365USGovernment"

    def test_real_argument_parsing_no_authentication_defaults(self):
        """Test parsing arguments without any authentication flags (should have defaults)"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse arguments without explicit auth (defaults should apply)
        args = parser.parse_args(["m365"])

        assert args.az_cli_auth is False
        assert not hasattr(args, "env_auth")
        assert args.sp_env_auth is False
        assert args.browser_auth is False
        assert args.certificate_auth is False
        assert args.tenant_id is None
        assert args.init_modules is False
        assert args.region == "M365Global"

    def test_real_argument_parsing_complete_configuration(self):
        """Test parsing arguments with all non-exclusive options"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse arguments with complete configuration
        args = parser.parse_args(
            [
                "m365",
                "--browser-auth",
                "--tenant-id",
                "12345678-1234-5678-abcd-123456789012",
                "--init-modules",
                "--region",
                "M365USGovernment",
            ]
        )

        assert args.browser_auth is True
        assert args.tenant_id == "12345678-1234-5678-abcd-123456789012"
        assert args.init_modules is True
        assert args.region == "M365USGovernment"

    def test_mutually_exclusive_authentication_enforcement(self):
        """Test that authentication methods are mutually exclusive"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # This should raise SystemExit due to mutually exclusive group
        try:
            parser.parse_args(["m365", "--az-cli-auth", "--sp-env-auth"])
            assert False, "Expected SystemExit due to mutually exclusive arguments"
        except SystemExit:
            # This is expected
            pass

    def test_tenant_id_without_arguments(self):
        """Test that tenant-id can be specified without an argument (optional value)"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse arguments with tenant-id but no value (should be None due to nargs="?")
        args = parser.parse_args(["m365", "--az-cli-auth", "--tenant-id"])

        assert args.tenant_id is None

    def test_certificate_path_argument_configuration(self):
        """Test that certificate_path argument is properly configured"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse arguments with certificate-path
        args = parser.parse_args(
            ["m365", "--certificate-auth", "--certificate-path", "/path/to/cert.pem"]
        )

        assert args.certificate_auth is True
        assert args.certificate_path == "/path/to/cert.pem"

    def test_certificate_path_without_value(self):
        """Test certificate_path argument without value (should be None due to nargs='?')"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse arguments with certificate-path but no value
        args = parser.parse_args(["m365", "--certificate-auth", "--certificate-path"])

        assert args.certificate_auth is True
        assert args.certificate_path is None

    def test_certificate_auth_with_certificate_path_integration(self):
        """Test certificate authentication with certificate path integration"""
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers()
        common_parser = argparse.ArgumentParser(add_help=False)

        mock_m365_args = MagicMock()
        mock_m365_args.subparsers = subparsers
        mock_m365_args.common_providers_parser = common_parser

        arguments.init_parser(mock_m365_args)

        # Parse complete certificate authentication arguments
        args = parser.parse_args(
            [
                "m365",
                "--certificate-auth",
                "--certificate-path",
                "/home/user/cert.pem",
                "--tenant-id",
                "12345678-1234-1234-1234-123456789012",
            ]
        )

        assert args.certificate_auth is True
        assert args.certificate_path == "/home/user/cert.pem"
        assert args.tenant_id == "12345678-1234-1234-1234-123456789012"
        assert args.az_cli_auth is False
        assert not hasattr(args, "env_auth")
        assert args.sp_env_auth is False
        assert args.browser_auth is False
```

--------------------------------------------------------------------------------

---[FILE: jwt_decoder_test.py]---
Location: prowler-master/tests/providers/m365/lib/jwt/jwt_decoder_test.py

```python
import base64
import json
from unittest.mock import patch

from prowler.providers.m365.lib.jwt.jwt_decoder import decode_jwt, decode_msal_token


class TestJwtDecoder:
    def test_decode_jwt_valid_token(self):
        """Test decode_jwt with a valid JWT token"""
        # Create a mock JWT token
        header = {"alg": "HS256", "typ": "JWT"}
        payload = {
            "sub": "1234567890",
            "name": "John Doe",
            "iat": 1516239022,
            "roles": ["application_access", "user_read"],
        }

        # Encode header and payload
        header_b64 = (
            base64.urlsafe_b64encode(json.dumps(header).encode("utf-8"))
            .decode("utf-8")
            .rstrip("=")
        )

        payload_b64 = (
            base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8"))
            .decode("utf-8")
            .rstrip("=")
        )

        # Create JWT with dummy signature
        token = f"{header_b64}.{payload_b64}.dummy_signature"

        result = decode_jwt(token)

        assert result == payload
        assert result["sub"] == "1234567890"
        assert result["name"] == "John Doe"
        assert result["roles"] == ["application_access", "user_read"]

    def test_decode_jwt_valid_token_with_padding(self):
        """Test decode_jwt with a token that needs base64 padding"""
        # Create mock payload that will need padding
        payload = {"test": "data"}
        payload_json = json.dumps(payload)

        # Encode mock payload without padding
        payload_b64 = (
            base64.urlsafe_b64encode(payload_json.encode("utf-8"))
            .decode("utf-8")
            .rstrip("=")
        )

        token = f"header.{payload_b64}.signature"

        result = decode_jwt(token)

        assert result == payload

    def test_decode_jwt_invalid_structure_two_parts(self):
        """Test decode_jwt with token that has only 2 parts"""
        token = "header.payload"  # Missing signature

        result = decode_jwt(token)

        assert result == {}

    def test_decode_jwt_invalid_structure_four_parts(self):
        """Test decode_jwt with token that has 4 parts"""
        token = "header.payload.signature.extra"

        result = decode_jwt(token)

        assert result == {}

    def test_decode_jwt_invalid_base64(self):
        """Test decode_jwt with invalid base64 in payload"""
        token = "header.invalid_base64!@#.signature"

        result = decode_jwt(token)

        assert result == {}

    def test_decode_jwt_invalid_json(self):
        """Test decode_jwt with invalid JSON in payload"""
        # Create invalid JSON base64
        invalid_json = "{'invalid': json,}"
        payload_b64 = (
            base64.urlsafe_b64encode(invalid_json.encode("utf-8"))
            .decode("utf-8")
            .rstrip("=")
        )

        token = f"header.{payload_b64}.signature"

        result = decode_jwt(token)

        assert result == {}

    def test_decode_jwt_empty_token(self):
        """Test decode_jwt with empty token"""
        result = decode_jwt("")
        assert result == {}

    def test_decode_jwt_none_token(self):
        """Test decode_jwt with None token"""
        assert decode_jwt(None) == {}

    @patch("builtins.print")
    def test_decode_jwt_prints_error_on_failure(self, mock_print):
        """Test that decode_jwt prints error message on failure"""
        token = "invalid.token"

        result = decode_jwt(token)

        assert result == {}
        mock_print.assert_called_once()
        assert "Failed to decode the token:" in mock_print.call_args[0][0]

    def test_decode_msal_token_valid_single_line(self):
        """Test decode_msal_token with valid JWT in single line"""
        # Create a valid JWT
        payload = {"roles": ["Exchange.ManageAsApp"], "tenant": "test-tenant"}
        payload_b64 = (
            base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8"))
            .decode("utf-8")
            .rstrip("=")
        )

        jwt_token = f"header.{payload_b64}.signature"
        text = f"Some text before {jwt_token} some text after"

        result = decode_msal_token(text)

        assert result == payload
        assert result["roles"] == ["Exchange.ManageAsApp"]

    def test_decode_msal_token_valid_multiline(self):
        """Test decode_msal_token with valid JWT across multiple lines"""
        payload = {"roles": ["application_access"], "user": "test@contoso.com"}
        payload_b64 = (
            base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8"))
            .decode("utf-8")
            .rstrip("=")
        )

        jwt_token = f"header.{payload_b64}.signature"
        text = f"""Line 1
        Line 2 with {jwt_token}
        Line 3"""

        result = decode_msal_token(text)

        assert result == payload
        assert result["user"] == "test@contoso.com"

    def test_decode_msal_token_with_whitespace(self):
        """Test decode_msal_token with JWT containing whitespace"""
        payload = {"test": "data"}
        payload_b64 = (
            base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8"))
            .decode("utf-8")
            .rstrip("=")
        )

        jwt_token = f"header.{payload_b64}.signature"
        text = f"  Token:   {jwt_token}   "

        result = decode_msal_token(text)

        assert result == payload

    def test_decode_msal_token_no_jwt_found(self):
        """Test decode_msal_token when no JWT pattern is found"""
        text = "This text contains no JWT tokens at all"

        result = decode_msal_token(text)

        assert result == {}

    def test_decode_msal_token_invalid_jwt_pattern(self):
        """Test decode_msal_token with text that looks like JWT but isn't"""
        text = "header.payload"  # Only 2 parts, not valid JWT

        result = decode_msal_token(text)

        assert result == {}

    def test_decode_msal_token_empty_text(self):
        """Test decode_msal_token with empty text"""
        result = decode_msal_token("")
        assert result == {}

    def test_decode_msal_token_none_text(self):
        """Test decode_msal_token with None text"""
        assert decode_msal_token(None) == {}

    @patch("builtins.print")
    def test_decode_msal_token_prints_error_on_failure(self, mock_print):
        """Test that decode_msal_token prints error message on failure"""
        text = "No JWT here"

        result = decode_msal_token(text)

        assert result == {}
        mock_print.assert_called_once()
        assert "Failed to extract and decode the token:" in mock_print.call_args[0][0]

    def test_decode_msal_token_real_world_scenario(self):
        """Test decode_msal_token with a realistic PowerShell output scenario"""
        # Simulate output from Get-MsalToken or similar
        payload = {
            "aud": "https://graph.microsoft.com",
            "iss": "https://sts.windows.net/tenant-id/",
            "iat": 1640995200,
            "exp": 1641081600,
            "roles": ["Application.ReadWrite.All"],
            "sub": "app-subject-id",
        }
        payload_b64 = (
            base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8"))
            .decode("utf-8")
            .rstrip("=")
        )

        jwt_token = f"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.{payload_b64}.signature123"

        # Simulate PowerShell output format
        powershell_output = f"""
            AccessToken          : {jwt_token}
            TokenType           : Bearer
            ExpiresOn           : 1/2/2022 12:00:00 AM +00:00
            ExtendedExpiresOn   : 1/2/2022 12:00:00 AM +00:00
        """

        result = decode_msal_token(powershell_output)

        assert result == payload
        assert result["roles"] == ["Application.ReadWrite.All"]
        assert result["aud"] == "https://graph.microsoft.com"

    def test_decode_msal_token_with_jwt_in_json(self):
        """Test decode_msal_token with JWT embedded in JSON-like structure"""
        payload = {"tenant": "test", "scope": "https://graph.microsoft.com/.default"}
        payload_b64 = (
            base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8"))
            .decode("utf-8")
            .rstrip("=")
        )

        jwt_token = f"header.{payload_b64}.signature"

        json_like_text = f'{{"access_token": "{jwt_token}", "token_type": "Bearer"}}'

        result = decode_msal_token(json_like_text)

        assert result == payload
```

--------------------------------------------------------------------------------

---[FILE: m365_mutelist_test.py]---
Location: prowler-master/tests/providers/m365/lib/mutelist/m365_mutelist_test.py

```python
import yaml
from mock import MagicMock

from prowler.providers.m365.lib.mutelist.mutelist import M365Mutelist
from tests.lib.outputs.fixtures.fixtures import generate_finding_output

MUTELIST_FIXTURE_PATH = "tests/providers/m365/lib/mutelist/fixtures/m365_mutelist.yaml"


class TestM365Mutelist:
    def test_get_mutelist_file_from_local_file(self):
        mutelist = M365Mutelist(mutelist_path=MUTELIST_FIXTURE_PATH)

        with open(MUTELIST_FIXTURE_PATH) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        assert mutelist.mutelist == mutelist_fixture
        assert mutelist.mutelist_file_path == MUTELIST_FIXTURE_PATH

    def test_get_mutelist_file_from_local_file_non_existent(self):
        mutelist_path = "tests/lib/mutelist/fixtures/not_present"
        mutelist = M365Mutelist(mutelist_path=mutelist_path)

        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path == mutelist_path

    def test_validate_mutelist_not_valid_key(self):
        mutelist_path = MUTELIST_FIXTURE_PATH
        with open(mutelist_path) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        mutelist_fixture["Accounts1"] = mutelist_fixture["Accounts"]
        del mutelist_fixture["Accounts"]

        mutelist = M365Mutelist(mutelist_content=mutelist_fixture)

        assert len(mutelist.validate_mutelist(mutelist_fixture)) == 0
        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path is None

    def test_is_finding_muted(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "subscription_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = M365Mutelist(mutelist_content=mutelist_content)

        finding = MagicMock
        finding.check_metadata = MagicMock
        finding.check_metadata.CheckID = "check_test"
        finding.status = "FAIL"
        finding.location = "global"
        finding.resource_name = "test_resource"
        finding.tenant_domain = "test_domain"
        finding.resource_tags = []

        assert mutelist.is_finding_muted(finding, tenant_id="subscription_1")

    def test_finding_is_not_muted(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "subscription_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = M365Mutelist(mutelist_content=mutelist_content)

        finding = MagicMock
        finding.check_metadata = MagicMock
        finding.check_metadata.CheckID = "check_test"
        finding.status = "FAIL"
        finding.location = "global"
        finding.resource_name = "test_resource"
        finding.tenant_domain = "test_domain"
        finding.resource_tags = []

        assert not mutelist.is_finding_muted(finding, tenant_id="subscription_2")

    def test_mute_finding(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "subscription_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = M365Mutelist(mutelist_content=mutelist_content)

        finding_1 = generate_finding_output(
            check_id="service_check_test",
            status="FAIL",
            account_uid="subscription_1",
            region="subscription_1",
            resource_uid="test_resource",
            resource_tags=[],
            muted=False,
        )

        muted_finding = mutelist.mute_finding(finding=finding_1)

        assert muted_finding.status == "MUTED"
        assert muted_finding.muted is True
        assert muted_finding.raw["status"] == "FAIL"
```

--------------------------------------------------------------------------------

---[FILE: m365_mutelist.yaml]---
Location: prowler-master/tests/providers/m365/lib/mutelist/fixtures/m365_mutelist.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "subscription_1":
      Checks:
        "admincenter_users_between_two_and_four_global_admins":
          Regions:
            - "*"
          Resources:
            - "resource_1"
            - "resource_2"
```

--------------------------------------------------------------------------------

````
