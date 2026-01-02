---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 430
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 430 of 867)

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

---[FILE: slack_test.py]---
Location: prowler-master/tests/lib/outputs/slack/slack_test.py

```python
from unittest import mock

from prowler.config.config import aws_logo, azure_logo, gcp_logo
from prowler.lib.outputs.slack.exceptions.exceptions import (
    SlackChannelNotFound,
    SlackClientError,
    SlackNoCredentialsError,
)
from prowler.lib.outputs.slack.slack import Slack
from prowler.providers.common.models import Connection
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, set_mocked_aws_provider
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    AZURE_SUBSCRIPTION_NAME,
    set_mocked_azure_provider,
)
from tests.providers.gcp.gcp_fixtures import set_mocked_gcp_provider

SLACK_CHANNEL = "test-channel"
SLACK_TOKEN = "test-token"
NON_EXISTING_CHANNEL = "non-existing-channel"


class TestSlackIntegration:
    def test_create_message_identity_aws(self):
        aws_provider = set_mocked_aws_provider()
        slack = Slack(SLACK_TOKEN, SLACK_CHANNEL, aws_provider)

        assert slack.__create_message_identity__(aws_provider) == (
            f"AWS Account *{aws_provider.identity.account}*",
            aws_logo,
        )

    def test_create_message_identity_azure(self):
        azure_provider = set_mocked_azure_provider()
        slack = Slack(SLACK_TOKEN, SLACK_CHANNEL, azure_provider)

        assert slack.__create_message_identity__(azure_provider) == (
            f"Azure Subscriptions:\n- *{AZURE_SUBSCRIPTION_ID}: {AZURE_SUBSCRIPTION_NAME}*\n",
            azure_logo,
        )

    def test_create_message_identity_gcp(self):
        gcp_provider = set_mocked_gcp_provider(
            project_ids=["test-project1", "test-project2"],
        )
        slack = Slack(SLACK_TOKEN, SLACK_CHANNEL, gcp_provider)

        assert slack.__create_message_identity__(gcp_provider) == (
            f"GCP Projects *{', '.join(gcp_provider.project_ids)}*",
            gcp_logo,
        )

    def test_create_title(self):
        aws_provider = set_mocked_aws_provider()
        slack = Slack(SLACK_TOKEN, SLACK_CHANNEL, aws_provider)

        stats = {}
        stats["total_pass"] = 12
        stats["total_fail"] = 10
        stats["total_critical_severity_pass"] = 4
        stats["total_critical_severity_fail"] = 4
        stats["total_high_severity_fail"] = 1
        stats["total_high_severity_pass"] = 1
        stats["total_medium_severity_fail"] = 2
        stats["total_medium_severity_pass"] = 1
        stats["total_low_severity_fail"] = 3
        stats["total_low_severity_pass"] = 3
        stats["resources_count"] = 20
        stats["findings_count"] = 22

        identity = slack.__create_message_identity__(aws_provider) == (
            f"AWS Account *{aws_provider.identity.account}*",
            aws_logo,
        )
        assert (
            slack.__create_title__(identity, stats)
            == f"Hey there 👋 \n I'm *Prowler*, _the handy multi-cloud security tool_ :cloud::key:\n\n I have just finished the security assessment on your {identity} with a total of *{stats['findings_count']}* findings."
        )

    def test_create_message_blocks_aws(self):
        aws_provider = set_mocked_aws_provider()
        slack = Slack(SLACK_TOKEN, SLACK_CHANNEL, aws_provider)
        args = "--slack"
        stats = {}
        stats["total_pass"] = 12
        stats["total_fail"] = 10
        stats["total_critical_severity_pass"] = 2
        stats["total_critical_severity_fail"] = 4
        stats["total_high_severity_fail"] = 1
        stats["total_high_severity_pass"] = 1
        stats["total_medium_severity_fail"] = 2
        stats["total_medium_severity_pass"] = 1
        stats["total_low_severity_fail"] = 2
        stats["total_low_severity_pass"] = 3
        stats["resources_count"] = 20
        stats["findings_count"] = 22

        aws_identity = f"AWS Account *{AWS_ACCOUNT_NUMBER}*"

        assert slack.__create_message_blocks__(aws_identity, aws_logo, stats, args) == [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": slack.__create_title__(aws_identity, stats),
                },
                "accessory": {
                    "type": "image",
                    "image_url": aws_logo,
                    "alt_text": "Provider Logo",
                },
            },
            {"type": "divider"},
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"\n:white_check_mark: *{stats['total_pass']} Passed findings* ({round(stats['total_pass'] / stats['findings_count'] * 100 , 2)}%)\n",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": (
                        "*Severities:*\n"
                        "• *Critical:* 2 "
                        "• *High:* 1 "
                        "• *Medium:* 1 "
                        "• *Low:* 3"
                    ),
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"\n:x: *{stats['total_fail']} Failed findings* ({round(stats['total_fail'] / stats['findings_count'] * 100 , 2)}%)\n ",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": (
                        "*Severities:*\n"
                        "• *Critical:* 4 "
                        "• *High:* 1 "
                        "• *Medium:* 2 "
                        "• *Low:* 2"
                    ),
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"\n:bar_chart: *{stats['resources_count']} Scanned Resources*\n",
                },
            },
            {"type": "divider"},
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"Used parameters: `prowler {args}`",
                    }
                ],
            },
            {"type": "divider"},
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": "Join our Slack Community!"},
                "accessory": {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "Prowler :slack:"},
                    "url": "https://goto.prowler.com/slack",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Feel free to contact us in our repo",
                },
                "accessory": {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "Prowler :github:"},
                    "url": "https://github.com/prowler-cloud/prowler",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "See all the things you can do with ProwlerPro",
                },
                "accessory": {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "Prowler Pro"},
                    "url": "https://prowler.pro",
                },
            },
        ]

    def test_create_message_blocks_azure(self):
        aws_provider = set_mocked_azure_provider()
        slack = Slack(SLACK_TOKEN, SLACK_CHANNEL, aws_provider)
        args = "--slack"
        stats = {}
        stats["total_pass"] = 12
        stats["total_fail"] = 10
        stats["total_critical_severity_pass"] = 2
        stats["total_critical_severity_fail"] = 4
        stats["total_high_severity_fail"] = 1
        stats["total_high_severity_pass"] = 1
        stats["total_medium_severity_fail"] = 2
        stats["total_medium_severity_pass"] = 1
        stats["total_low_severity_fail"] = 2
        stats["total_low_severity_pass"] = 3
        stats["resources_count"] = 20
        stats["findings_count"] = 22

        azure_identity = "Azure Subscriptions:\n- *subscription 1: qwerty*\n- *subscription 2: asdfg*\n"

        assert slack.__create_message_blocks__(
            azure_identity, azure_logo, stats, args
        ) == [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": slack.__create_title__(azure_identity, stats),
                },
                "accessory": {
                    "type": "image",
                    "image_url": azure_logo,
                    "alt_text": "Provider Logo",
                },
            },
            {"type": "divider"},
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"\n:white_check_mark: *{stats['total_pass']} Passed findings* ({round(stats['total_pass'] / stats['findings_count'] * 100 , 2)}%)\n",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": (
                        "*Severities:*\n"
                        "• *Critical:* 2 "
                        "• *High:* 1 "
                        "• *Medium:* 1 "
                        "• *Low:* 3"
                    ),
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"\n:x: *{stats['total_fail']} Failed findings* ({round(stats['total_fail'] / stats['findings_count'] * 100 , 2)}%)\n ",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": (
                        "*Severities:*\n"
                        "• *Critical:* 4 "
                        "• *High:* 1 "
                        "• *Medium:* 2 "
                        "• *Low:* 2"
                    ),
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"\n:bar_chart: *{stats['resources_count']} Scanned Resources*\n",
                },
            },
            {"type": "divider"},
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"Used parameters: `prowler {args}`",
                    }
                ],
            },
            {"type": "divider"},
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": "Join our Slack Community!"},
                "accessory": {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "Prowler :slack:"},
                    "url": "https://goto.prowler.com/slack",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Feel free to contact us in our repo",
                },
                "accessory": {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "Prowler :github:"},
                    "url": "https://github.com/prowler-cloud/prowler",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "See all the things you can do with ProwlerPro",
                },
                "accessory": {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "Prowler Pro"},
                    "url": "https://prowler.pro",
                },
            },
        ]

    def test_create_message_blocks_gcp(self):
        aws_provider = set_mocked_gcp_provider()
        slack = Slack(SLACK_TOKEN, SLACK_CHANNEL, aws_provider)
        args = "--slack"
        stats = {}
        stats["total_pass"] = 12
        stats["total_fail"] = 10
        stats["total_critical_severity_pass"] = 2
        stats["total_critical_severity_fail"] = 4
        stats["total_high_severity_fail"] = 1
        stats["total_high_severity_pass"] = 1
        stats["total_medium_severity_fail"] = 2
        stats["total_medium_severity_pass"] = 1
        stats["total_low_severity_fail"] = 2
        stats["total_low_severity_pass"] = 3
        stats["resources_count"] = 20
        stats["findings_count"] = 22

        gcp_identity = "GCP Project *gcp-project*"

        assert slack.__create_message_blocks__(gcp_identity, gcp_logo, stats, args) == [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": slack.__create_title__(gcp_identity, stats),
                },
                "accessory": {
                    "type": "image",
                    "image_url": gcp_logo,
                    "alt_text": "Provider Logo",
                },
            },
            {"type": "divider"},
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"\n:white_check_mark: *{stats['total_pass']} Passed findings* ({round(stats['total_pass'] / stats['findings_count'] * 100 , 2)}%)\n",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": (
                        "*Severities:*\n"
                        "• *Critical:* 2 "
                        "• *High:* 1 "
                        "• *Medium:* 1 "
                        "• *Low:* 3"
                    ),
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"\n:x: *{stats['total_fail']} Failed findings* ({round(stats['total_fail'] / stats['findings_count'] * 100 , 2)}%)\n ",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": (
                        "*Severities:*\n"
                        "• *Critical:* 4 "
                        "• *High:* 1 "
                        "• *Medium:* 2 "
                        "• *Low:* 2"
                    ),
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"\n:bar_chart: *{stats['resources_count']} Scanned Resources*\n",
                },
            },
            {"type": "divider"},
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"Used parameters: `prowler {args}`",
                    }
                ],
            },
            {"type": "divider"},
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": "Join our Slack Community!"},
                "accessory": {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "Prowler :slack:"},
                    "url": "https://goto.prowler.com/slack",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Feel free to contact us in our repo",
                },
                "accessory": {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "Prowler :github:"},
                    "url": "https://github.com/prowler-cloud/prowler",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "See all the things you can do with ProwlerPro",
                },
                "accessory": {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "Prowler Pro"},
                    "url": "https://prowler.pro",
                },
            },
        ]

    def test_send_slack_message(self):
        mocked_slack_response = {
            "ok": True,
            "channel": "XXXXXXXXXX",
            "ts": "1683623300.083429",
            "message": {
                "type": "message",
                "subtype": "bot_message",
                "text": "",
                "ts": "1683623300.083429",
                "username": "Prowler",
                "icons": {},
                "bot_id": "B055L25CVFH",
                "app_id": "A055U03H2QN",
                "blocks": [],
            },
        }

        mocked_web_client = mock.MagicMock
        mocked_web_client.chat_postMessage = mock.Mock(
            return_value=mocked_slack_response
        )

        with mock.patch(
            "prowler.lib.outputs.slack.slack.WebClient", new=mocked_web_client
        ):
            aws_provider = set_mocked_aws_provider()
            slack = Slack(SLACK_TOKEN, SLACK_CHANNEL, aws_provider)
            stats = {}
            args = "--slack"
            response = slack.send(stats, args)
            assert response == mocked_slack_response

    def test_test_connection(self):
        mocked_auth_response = {"ok": True}
        mocked_conversations_info = {
            "ok": True,
            "channels": [
                {"id": "C87654321", "name": SLACK_CHANNEL, "is_member": True},
            ],
        }
        mocked_web_client = mock.MagicMock()
        mocked_web_client.auth_test = mock.Mock(return_value=mocked_auth_response)
        mocked_web_client.conversations_info = mock.Mock(
            return_value=mocked_conversations_info
        )
        with mock.patch(
            "prowler.lib.outputs.slack.slack.WebClient", return_value=mocked_web_client
        ):
            assert Slack.test_connection(
                token=SLACK_TOKEN, channel=SLACK_CHANNEL
            ) == Connection(is_connected=True)

    def test_slack_no_credentials_error(self):
        mocked_auth_response = {"ok": False, "error": "invalid_auth"}
        mocked_web_client = mock.MagicMock()
        mocked_web_client.auth_test = mock.Mock(return_value=mocked_auth_response)

        with mock.patch(
            "prowler.lib.outputs.slack.slack.WebClient", return_value=mocked_web_client
        ):
            connection = Slack.test_connection(
                token=SLACK_TOKEN,
                channel=NON_EXISTING_CHANNEL,
                raise_on_exception=False,
            )

            assert not connection.is_connected
            assert isinstance(connection.error, SlackNoCredentialsError)
            assert "invalid_auth" in str(connection.error)

    def test_slack_channel_not_found(self):
        mocked_auth_response = {"ok": True}
        mocked_conversations_info = {"ok": False, "error": "channel_not_found"}
        mocked_web_client = mock.MagicMock()
        mocked_web_client.auth_test = mock.Mock(return_value=mocked_auth_response)
        mocked_web_client.conversations_info = mock.Mock(
            return_value=mocked_conversations_info
        )

        with mock.patch(
            "prowler.lib.outputs.slack.slack.WebClient", return_value=mocked_web_client
        ):
            connection = Slack.test_connection(
                token=SLACK_TOKEN,
                channel=NON_EXISTING_CHANNEL,
                raise_on_exception=False,
            )

            assert not connection.is_connected
            assert isinstance(connection.error, SlackChannelNotFound)
            assert "channel_not_found" in str(connection.error)

    def test_slack_client_error(self):
        mocked_web_client = mock.MagicMock()
        mocked_web_client.auth_test = mock.Mock(side_effect=SlackClientError)

        with mock.patch(
            "prowler.lib.outputs.slack.slack.WebClient", return_value=mocked_web_client
        ):
            connection = Slack.test_connection(
                token=SLACK_TOKEN,
                channel=NON_EXISTING_CHANNEL,
                raise_on_exception=False,
            )

            assert not connection.is_connected
            assert isinstance(connection.error, SlackClientError)
            assert "Slack ClientError occurred" in str(connection.error)
```

--------------------------------------------------------------------------------

---[FILE: powershell_test.py]---
Location: prowler-master/tests/lib/powershell/powershell_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.m365.lib.powershell.m365_powershell import PowerShellSession


class TestPowerShellSession:
    @patch("subprocess.Popen")
    def test_init(self, mock_popen):
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        session = PowerShellSession()

        mock_popen.assert_called_once()
        assert session.process == mock_process
        assert session.END == "<END>"
        session.close()

    @patch("subprocess.Popen")
    def test_sanitize(self, _):
        session = PowerShellSession()

        test_cases = [
            ("test@example.com", "test@example.com"),
            ("test@example.com!", "test@example.com"),
            ("test@example.com#", "test@example.com"),
            ("test@example.com$", "test@example.com"),
            ("test@example.com%", "test@example.com"),
            ("test@example.com^", "test@example.com"),
            ("test@example.com&", "test@example.com"),
            ("test@example.com*", "test@example.com"),
            ("test@example.com(", "test@example.com"),
            ("test@example.com)", "test@example.com"),
            ("test@example.com-", "test@example.com-"),
            ("test@example.com_", "test@example.com_"),
            ("test@example.com+", "test@example.com+"),
            ("test_;echo pwned;password", "test_echopwnedpassword"),
        ]

        for input_str, expected in test_cases:
            assert session.sanitize(input_str) == expected
        session.close()

    @patch("subprocess.Popen")
    def test_remove_ansi(self, mock_popen):
        session = PowerShellSession()

        test_cases = [
            ("\x1b[32mSuccess\x1b[0m", "Success"),
            ("\x1b[31mError\x1b[0m", "Error"),
            ("\x1b[33mWarning\x1b[0m", "Warning"),
            ("Normal text", "Normal text"),
            ("\x1b[1mBold\x1b[0m", "Bold"),
        ]

        for input_str, expected in test_cases:
            assert session.remove_ansi(input_str) == expected
        session.close()

    @patch("subprocess.Popen")
    def test_execute(self, mock_popen):
        """Test the execute method with various scenarios:
        - Normal command execution
        - JSON parsing enabled
        - Timeout handling
        - Error handling
        """
        # Setup
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        session = PowerShellSession()

        # Test 1: Normal command execution
        mock_process.stdout.readline.side_effect = ["Hello World\n", f"{session.END}\n"]
        mock_process.stderr.readline.return_value = f"Write-Error: {session.END}\n"
        with patch.object(session, "remove_ansi", side_effect=lambda x: x):
            result = session.execute("Get-Command")
            assert result == "Hello World"
            mock_process.stdin.write.assert_any_call("Get-Command\n")
            mock_process.stdin.write.assert_any_call(f"Write-Output '{session.END}'\n")
            mock_process.stdin.write.assert_any_call(f"Write-Error '{session.END}'\n")

        # Test 2: JSON parsing enabled
        mock_process.stdout.readline.side_effect = [
            '{"key": "value"}\n',
            f"{session.END}\n",
        ]
        mock_process.stderr.readline.return_value = f"Write-Error: {session.END}\n"
        with patch.object(session, "remove_ansi", side_effect=lambda x: x):
            with patch.object(
                session, "json_parse_output", return_value={"key": "value"}
            ) as mock_json_parse:
                result = session.execute("Get-Command", json_parse=True)
                assert result == {"key": "value"}
                mock_json_parse.assert_called_once_with('{"key": "value"}')

        # Test 3: Timeout handling
        mock_process.stdout.readline.side_effect = ["test output\n"]  # No END marker
        mock_process.stderr.readline.return_value = f"Write-Error: {session.END}\n"
        result = session.execute("Get-Command", timeout=0.1)
        assert result == ""

        # Test 4: Error handling
        mock_process.stdout.readline.side_effect = ["\n", f"{session.END}\n"]
        mock_process.stderr.readline.side_effect = [
            "Write-Error: This is an error\n",
            f"Write-Error: {session.END}\n",
        ]
        with patch.object(session, "remove_ansi", side_effect=lambda x: x):
            with patch("prowler.lib.logger.logger.error") as mock_error:
                result = session.execute("Get-Command")
                assert result == ""
                mock_error.assert_called_once_with(
                    "PowerShell error output: Write-Error: This is an error"
                )

        session.close()

    @patch("subprocess.Popen")
    def test_read_output(self, mock_popen):
        """Test the read_output method with various scenarios:
        - Normal stdout output
        - Error in stderr
        - Timeout in stdout
        - Empty output
        """
        # Setup
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        session = PowerShellSession()

        # Test 1: Normal stdout output
        mock_process.stdout.readline.side_effect = ["Hello World\n", f"{session.END}\n"]
        mock_process.stderr.readline.return_value = f"Write-Error: {session.END}\n"
        with patch.object(session, "remove_ansi", side_effect=lambda x: x):
            result = session.read_output()
            assert result == "Hello World"

        # Test 2: Error in stderr
        mock_process.stdout.readline.side_effect = ["\n", f"{session.END}\n"]
        mock_process.stderr.readline.side_effect = [
            "Write-Error: This is an error\n",
            f"Write-Error: {session.END}\n",
        ]
        with patch.object(session, "remove_ansi", side_effect=lambda x: x):
            with patch("prowler.lib.logger.logger.error") as mock_error:
                result = session.read_output()
                assert result == ""
                mock_error.assert_called_once_with(
                    "PowerShell error output: Write-Error: This is an error"
                )

        # Test 3: Timeout in stdout
        mock_process.stdout.readline.side_effect = ["test output\n"]  # No END marker
        mock_process.stderr.readline.return_value = f"Write-Error: {session.END}\n"
        result = session.read_output(timeout=0.1, default="timeout")
        assert result == "timeout"

        # Test 4: Empty output
        mock_process.stdout.readline.side_effect = [f"{session.END}\n"]
        mock_process.stderr.readline.return_value = f"Write-Error: {session.END}\n"
        result = session.read_output()
        assert result == ""

        session.close()

    @patch("subprocess.Popen")
    def test_json_parse_output(self, mock_popen):
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        session = PowerShellSession()

        test_cases = [
            ('{"key": "value"}', {"key": "value"}),
            ('[{"key": "value"}]', [{"key": "value"}]),
            (
                '[{"key": "value"},{"key": "value"}]',
                [{"key": "value"}, {"key": "value"}],
            ),
            ("[{}]", [{}]),
            ("[{},{}]", [{}, {}]),
            ("not json", {}),
            ("", {}),
        ]

        for input_str, expected in test_cases:
            result = session.json_parse_output(input_str)
            assert result == expected
        session.close()

    @patch("subprocess.Popen")
    def test_json_parse_output_logging(self, mock_popen):
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        session = PowerShellSession()

        # Test warning for non-JSON output
        with patch("prowler.lib.logger.logger.error") as mock_error:
            result = session.json_parse_output("some text without json")
            assert result == {}
            mock_error.assert_called_once_with(
                "Unexpected PowerShell output: some text without json\n"
            )

        session.close()

    @patch("subprocess.Popen")
    def test_json_parse_output_with_text_around_json(self, mock_popen):
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        session = PowerShellSession()

        # Test JSON extraction from text with surrounding content
        result = session.json_parse_output('some text {"key": "value"} more text')
        assert result == {"key": "value"}

        result = session.json_parse_output('prefix [{"key": "value"}] suffix')
        assert result == [{"key": "value"}]

        result = session.json_parse_output(
            'INFO {context data} {"key": "value", "list": [1, 2]} extra'
        )
        assert result == {"key": "value", "list": [1, 2]}

        result = session.json_parse_output('{"key": "value"} trailing {log}')
        assert result == {"key": "value"}

        # Test non-JSON text returns empty dict
        result = session.json_parse_output("just some text")
        assert result == {}

        session.close()

    @patch("subprocess.Popen")
    def test_json_parse_output_empty(self, mock_popen):
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        session = PowerShellSession()

        # Test empty string
        result = session.json_parse_output("")
        assert result == {}

        session.close()

    @patch("subprocess.Popen")
    def test_close(self, mock_popen):
        mock_process = MagicMock()
        mock_popen.return_value = mock_process
        session = PowerShellSession()

        session.close()

        mock_process.stdin.flush.assert_called_once()
        mock_process.terminate.assert_called_once()
        mock_process = None
```

--------------------------------------------------------------------------------

````
