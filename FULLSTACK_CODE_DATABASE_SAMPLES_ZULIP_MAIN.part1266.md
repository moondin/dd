---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1266
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1266 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/thinkst/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class ThinkstHookTests(WebhookTestCase):
    CHANNEL_NAME = "thinkst"
    URL_TEMPLATE = "/api/v1/external/thinkst?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "thinkst"

    def test_canary_dummy(self) -> None:
        expected_message = (
            "**:alert: Canary *0000000testnode* has been triggered!**\n\n"
            "This is a dummy incident.\n\n"
            "**Incident ID:** `aa875f255f94e3ffe40dc85cf1a8b1e0`\n"
            "**Kind:** Dummy Incident\n"
            "**Timestamp:** <time:2020-06-09T13:59:38+00:00>\n"
            "**Canary IP:** `1.1.1.1`\n"
            "**Source IP:** `2.2.2.2`\n"
            "**Reverse DNS:** `attacker-ip.local`\n"
            "**Field1:** VALUE1\n"
            "**Field2:** VALUE2\n"
            "**Field3:** VALUE3"
        )

        self.check_webhook(
            "canary_dummy",
            "canary alert - 0000000testnode",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canary_consolidated_port_scan(self) -> None:
        expected_message = (
            "**:alert: Canary *foo-bar* has been triggered!**\n\n"
            "A portscan has been done on several of your canaries by the host "
            "1.1.1.1.\n\n"
            "**Incident ID:** `3f25fec9e18c7673dcc468800b7af0a6`\n"
            "**Kind:** Consolidated Network Port Scan\n"
            "**Timestamp:** <time:2020-07-20T16:18:40+00:00>\n"
            "**Canary IP:** `1.1.1.1`\n"
            "**Canary location:** dining room\n"
            "**Source IP:** `1.1.1.1`\n"
            "**Reverse DNS:** `attacker.local`\n"
            "**Incident:** Consolidated Network Port Scan\n"
            "**Source:** 1.1.1.1\n"
            "**Targets:** 1.0.0.1, 1.0.0.2\n"
            "**Background Context:** You have had 8 incidents from 1.0.0.1 previously."
        )

        self.check_webhook(
            "canary_consolidated_port_scan",
            "canary alert - foo-bar",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canary_file_access(self) -> None:
        expected_message = (
            "**:alert: Canary *bar-foo* has been triggered!**\n\n"
            "Shared File (Re)Opened has been detected against one of your Canaries "
            "(bar-foo) at 1.1.1.1.\n\n"
            "**Incident ID:** `a7bb317ba2072415462233cef3bc615a`\n"
            "**Kind:** Shared File (Re)Opened\n"
            "**Timestamp:** <time:2020-07-20T16:27:20+00:00>\n"
            "**Canary IP:** `1.1.1.1`\n"
            "**Canary location:** dining room\n"
            "**Source IP:** `1.1.1.1`\n"
            "**User:** guest\n"
            "**Filename:** secret/bar.doc\n"
            "**Additional Information:** This file 'secret/bar.doc' was "
            "previously opened by the host 'zulip-dev' on 2020-07-20 16:18:56.\n\n"
            "It was also opened 2 times before by the same host, on 2020-06-10 "
            "14:33:50, 2020-06-18 19:02:33.\n"
            "**Background Context:** You have had 20 incidents from 1.1.1.1 previously."
        )

        self.check_webhook(
            "canary_file_access",
            "canary alert - bar-foo",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canary_host_port_scan(self) -> None:
        expected_message = (
            "**:alert: Canary *foo-bar* has been triggered!**\n\n"
            "Host Port Scan has been detected against one of your Canaries "
            "(foo-bar) at 1.1.1.1.\n\n"
            "**Incident ID:** `9060473d2da98afe494adad648495620`\n"
            "**Kind:** Host Port Scan\n"
            "**Timestamp:** <time:2020-07-20T16:26:30+00:00>\n"
            "**Canary IP:** `1.1.1.1`\n"
            "**Canary location:** dining room\n"
            "**Source IP:** `1.1.1.1`\n"
            "**Reverse DNS:** `attacker.local`\n"
            "**Partial Ports:** 443, 554, 80, 1723, 22"
        )

        self.check_webhook(
            "canary_host_port_scan",
            "canary alert - foo-bar",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canary_http_login(self) -> None:
        expected_message = (
            "**:alert: Canary *foo-bar* has been triggered!**\n\n"
            "HTTP Login Attempt has been detected against one of your Canaries "
            "(foo-bar) at 1.1.1.1.\n\n"
            "**Incident ID:** `1ef86f5cf4090a5252c6f453c5cd46bd`\n"
            "**Kind:** HTTP Login Attempt\n"
            "**Timestamp:** <time:2020-07-20T14:55:45+00:00>\n"
            "**Canary IP:** `1.1.1.1`\n"
            "**Canary location:** dining room\n"
            "**Source IP:** `1.1.1.1`\n"
            "**Username:** regular\n"
            "**Password:** `*******`\n"
            "**User-Agent:** Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) "
            "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15\n"
            "**Background Context:** You have had 14 incidents from 1.1.1.1 previously."
        )

        self.check_webhook(
            "canary_http_login",
            "canary alert - foo-bar",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canary_ssh_login(self) -> None:
        expected_message = (
            "**:alert: Canary *foo-bar* has been triggered!**\n\n"
            "SSH Login Attempt has been detected against one of your Canaries "
            "(foo-bar) at 1.1.1.1.\n\n"
            "**Incident ID:** `4ef51a936d05e0a6b4846378c8c38d2c`\n"
            "**Kind:** SSH Login Attempt\n"
            "**Timestamp:** <time:2020-07-20T16:26:22+00:00>\n"
            "**Canary IP:** `1.1.1.1`\n"
            "**Canary location:** dining room\n"
            "**Source IP:** `1.1.1.1`\n"
            "**Reverse DNS:** `attacker.local`\n"
            "**Username:** foo\n"
            "**Key:** `*******`\n"
            "**Background Context:** You have had 9 incidents from 1.1.1.1 previously."
        )

        self.check_webhook(
            "canary_ssh_login",
            "canary alert - foo-bar",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canary_with_specific_topic(self) -> None:
        self.url = self.build_webhook_url(topic="foo")
        expected_message = (
            "**:alert: Canary *0000000testnode* has been triggered!**\n\n"
            "This is a dummy incident.\n\n"
            "**Incident ID:** `aa875f255f94e3ffe40dc85cf1a8b1e0`\n"
            "**Kind:** Dummy Incident\n"
            "**Timestamp:** <time:2020-06-09T13:59:38+00:00>\n"
            "**Canary IP:** `1.1.1.1`\n"
            "**Source IP:** `2.2.2.2`\n"
            "**Reverse DNS:** `attacker-ip.local`\n"
            "**Field1:** VALUE1\n"
            "**Field2:** VALUE2\n"
            "**Field3:** VALUE3"
        )

        self.check_webhook(
            "canary_dummy",
            "foo",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canarytoken_msword(self) -> None:
        expected_message = (
            "**:alert: Canarytoken *test document* has been triggered!**\n\n"
            "A MS Word .docx Document Canarytoken has been triggered over doc-msword "
            "by the source IP 1.1.1.1.\n\n"
            "**Incident ID:** `db6f9b5528c6c6c385cb3bb63f5949c8`\n"
            "**Token:** `dbwx4d68flwh2u5zku56nogu6`\n"
            "**Kind:** MS Word .docx Document\n"
            "**Timestamp:** <time:2020-07-20T14:40:15+00:00>\n"
            "**Triggered:** 5 times\n"
            "**Accept:** `*/*`\n"
            "**Accept-Encoding:** gzip, deflate\n"
            "**Accept-Language:** en-gb\n"
            "**Background Context:** You have had 21 incidents from 1.1.1.1 "
            "previously.\n"
            "**Connection:** keep-alive\n"
            "**Dst Port:** 80\n"
            "**User-Agent:** Mozilla/4.0 (compatible; ms-office; MSOffice 16)"
        )

        self.check_webhook(
            "canarytoken_msword",
            "canarytoken alert - test document",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canarytoken_remote_image(self) -> None:
        expected_message = (
            "**:alert: Canarytoken *test image* has been triggered!**\n\n"
            "A Remote Web Image Canarytoken has been triggered over web-image by the "
            "source IP 1.1.1.1.\n\n"
            "**Incident ID:** `533395067f6d655cd19384bc6991cc0f`\n"
            "**Token:** `ew5n8gqtb82m4uegrttarn2zu`\n"
            "**Kind:** Remote Web Image\n"
            "**Timestamp:** <time:2020-07-20T16:33:12+00:00>\n"
            "**Triggered:** 37 times\n"
            "**Accept:** `image/webp,*/*`\n"
            "**Accept-Encoding:** gzip, deflate\n"
            "**Accept-Language:** en-US,en;q=0.5\n"
            "**Background Context:** You have had 12 incidents from 1.1.1.1 "
            "previously.\n"
            "**Cache-Control:** max-age=0\n"
            "**Connection:** keep-alive\n"
            "**Dnt:** 1\n"
            "**Dst Port:** 80\n"
            "**User-Agent:** Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 "
            "Firefox/78.0"
        )

        self.check_webhook(
            "canarytoken_remote_image",
            "canarytoken alert - test image",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canarytoken_with_specific_topic(self) -> None:
        self.url = self.build_webhook_url(topic="foo")
        expected_message = (
            "**:alert: Canarytoken *test document* has been triggered!**\n\n"
            "A MS Word .docx Document Canarytoken has been triggered over doc-msword "
            "by the source IP 1.1.1.1.\n\n"
            "**Incident ID:** `db6f9b5528c6c6c385cb3bb63f5949c8`\n"
            "**Token:** `dbwx4d68flwh2u5zku56nogu6`\n"
            "**Kind:** MS Word .docx Document\n"
            "**Timestamp:** <time:2020-07-20T14:40:15+00:00>\n"
            "**Triggered:** 5 times\n"
            "**Accept:** `*/*`\n"
            "**Accept-Encoding:** gzip, deflate\n"
            "**Accept-Language:** en-gb\n"
            "**Background Context:** You have had 21 incidents from 1.1.1.1 "
            "previously.\n"
            "**Connection:** keep-alive\n"
            "**Dst Port:** 80\n"
            "**User-Agent:** Mozilla/4.0 (compatible; ms-office; MSOffice 16)"
        )

        self.check_webhook(
            "canarytoken_msword",
            "foo",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/thinkst/view.py
Signals: Django

```python
# Webhooks for external integrations.

from datetime import datetime

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string, check_union
from zerver.lib.webhooks.common import OptionalUserSpecifiedTopicStr, check_send_webhook_message
from zerver.models import UserProfile


def is_canarytoken(message: WildValue) -> bool:
    """
    Requests sent from Thinkst canaries are either from canarytokens or
    canaries, which can be differentiated by the value of the `AlertType`
    field.
    """
    return message["AlertType"].tame(check_string) == "CanarytokenIncident"


def canary_name(message: WildValue) -> str:
    """
    Returns the name of the canary or canarytoken.
    """
    if is_canarytoken(message):
        return message["Reminder"].tame(check_string)
    else:
        return message["CanaryName"].tame(check_string)


def canary_kind(message: WildValue) -> str:
    """
    Returns a description of the kind of request - canary or canarytoken.
    """
    if is_canarytoken(message):
        return "canarytoken"
    else:
        return "canary"


def source_ip_and_reverse_dns(message: WildValue) -> tuple[str | None, str | None]:
    """
    Extract the source IP and reverse DNS information from a canary request.
    """
    reverse_dns, source_ip = (None, None)

    if "SourceIP" in message:
        source_ip = message["SourceIP"].tame(check_string)
    # `ReverseDNS` can sometimes exist and still be empty.
    if "ReverseDNS" in message and message["ReverseDNS"].tame(check_string) != "":
        reverse_dns = message["ReverseDNS"].tame(check_string)

    return (source_ip, reverse_dns)


def body(message: WildValue) -> str:
    """
    Construct the response to a canary or canarytoken request.
    """

    title = canary_kind(message).title()
    name = canary_name(message)
    body = f"**:alert: {title} *{name}* has been triggered!**\n\n{message['Intro'].tame(check_string)}\n\n"

    if "IncidentHash" in message:
        body += f"**Incident ID:** `{message['IncidentHash'].tame(check_string)}`\n"

    if "Token" in message:
        body += f"**Token:** `{message['Token'].tame(check_string)}`\n"

    if "Description" in message:
        body += f"**Kind:** {message['Description'].tame(check_string)}\n"

    if "Timestamp" in message:
        timestamp = message["Timestamp"].tame(check_string)
        # Thinkst datetime format: https://help.canary.tools/hc/en-gb/articles/360012727777-How-do-I-configure-notifications-for-a-Generic-Webhook#h_01K71QZ806C5D49RYB6RBXSZ1B
        # "YYYY-MM-DD HH:MM:SS (UTC)"
        formatted_timestamp = timestamp.replace(" (UTC)", "Z")
        dt = datetime.fromisoformat(formatted_timestamp)
        global_time = datetime_to_global_time(dt)
        body += f"**Timestamp:** {global_time}\n"

    if "CanaryIP" in message:
        body += f"**Canary IP:** `{message['CanaryIP'].tame(check_string)}`\n"

    if "CanaryLocation" in message:
        body += f"**Canary location:** {message['CanaryLocation'].tame(check_string)}\n"

    if "Triggered" in message:
        unit = "times" if message["Triggered"].tame(check_int) > 1 else "time"
        body += f"**Triggered:** {message['Triggered'].tame(check_int)} {unit}\n"

    source_ip, reverse_dns = source_ip_and_reverse_dns(message)
    if source_ip:
        body += f"**Source IP:** `{source_ip}`\n"
    if reverse_dns:
        body += f"**Reverse DNS:** `{reverse_dns}`\n"

    if "AdditionalDetails" in message:
        for detail in message["AdditionalDetails"]:
            key = detail[0].tame(check_string)
            value = detail[1].tame(check_union([check_string, check_int]))
            if isinstance(value, str) and "*" in value:
                # Thinkst sends passwords as a series of stars which can mess with
                # formatting, so wrap these in backticks.
                body += f"**{key}:** `{value}`\n"
            else:
                body += f"**{key}:** {value}\n"

    return body


@webhook_view("Thinkst")
@typed_endpoint
def api_thinkst_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    message: JsonBodyPayload[WildValue],
    user_specified_topic: OptionalUserSpecifiedTopicStr = None,
) -> HttpResponse:
    """
    Construct a response to a webhook event from a Thinkst canary or canarytoken.

    Thinkst offers public canarytokens with canarytokens.org and with their canary
    product, but the schema returned by these identically named services are
    completely different - canarytokens from canarytokens.org are handled by a
    different Zulip integration.

    Thinkst's documentation for the schema is linked below, but in practice the JSON
    received doesn't always conform.

    https://help.canary.tools/hc/en-gb/articles/360002426577-How-do-I-configure-notifications-for-a-Generic-Webhook-
    """

    response = body(message)

    topic_name = None
    if user_specified_topic:
        topic_name = user_specified_topic
    else:
        name = canary_name(message)
        kind = canary_kind(message)

        topic_name = f"{kind} alert - {name}"

    check_send_webhook_message(request, user_profile, topic_name, response)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: canarytoken_msword.json]---
Location: zulip-main/zerver/webhooks/thinkst/fixtures/canarytoken_msword.json

```json
{
  "Token": "dbwx4d68flwh2u5zku56nogu6",
  "Intro": "A MS Word .docx Document Canarytoken has been triggered over doc-msword by the source IP 1.1.1.1.",
  "Description": "MS Word .docx Document",
  "Triggered": 5,
  "AdditionalDetails": [
    [
      "Accept",
      "*/*"
    ],
    [
      "Accept-Encoding",
      "gzip, deflate"
    ],
    [
      "Accept-Language",
      "en-gb"
    ],
    [
      "Background Context",
      "You have had 21 incidents from 1.1.1.1 previously."
    ],
    [
      "Connection",
      "keep-alive"
    ],
    [
      "Dst Port",
      80
    ],
    [
      "User-Agent",
      "Mozilla/4.0 (compatible; ms-office; MSOffice 16)"
    ]
  ],
  "Timestamp": "2020-07-20 14:40:15 (UTC)",
  "Reminder": "test document",
  "IncidentHash": "db6f9b5528c6c6c385cb3bb63f5949c8",
  "AlertType": "CanarytokenIncident"
}
```

--------------------------------------------------------------------------------

---[FILE: canarytoken_remote_image.json]---
Location: zulip-main/zerver/webhooks/thinkst/fixtures/canarytoken_remote_image.json

```json
{
  "Token": "ew5n8gqtb82m4uegrttarn2zu",
  "Intro": "A Remote Web Image Canarytoken has been triggered over web-image by the source IP 1.1.1.1.",
  "Description": "Remote Web Image",
  "Triggered": 37,
  "AdditionalDetails": [
    [
      "Accept",
      "image/webp,*/*"
    ],
    [
      "Accept-Encoding",
      "gzip, deflate"
    ],
    [
      "Accept-Language",
      "en-US,en;q=0.5"
    ],
    [
      "Background Context",
      "You have had 12 incidents from 1.1.1.1 previously."
    ],
    [
      "Cache-Control",
      "max-age=0"
    ],
    [
      "Connection",
      "keep-alive"
    ],
    [
      "Dnt",
      "1"
    ],
    [
      "Dst Port",
      80
    ],
    [
      "User-Agent",
      "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0"
    ]
  ],
  "Timestamp": "2020-07-20 16:33:12 (UTC)",
  "Reminder": "test image",
  "IncidentHash": "533395067f6d655cd19384bc6991cc0f",
  "AlertType": "CanarytokenIncident"
}
```

--------------------------------------------------------------------------------

---[FILE: canary_consolidated_port_scan.json]---
Location: zulip-main/zerver/webhooks/thinkst/fixtures/canary_consolidated_port_scan.json

```json
{
  "ReverseDNS": "attacker.local",
  "CanaryName": "foo-bar",
  "Description": "Consolidated Network Port Scan",
  "CanaryPort": "443",
  "Timestamp": "2020-07-20 16:18:40 (UTC)",
  "CanaryIP": "1.1.1.1",
  "AlertType": "CanaryIncident",
  "Intro": "A portscan has been done on several of your canaries by the host 1.1.1.1.",
  "IncidentHash": "3f25fec9e18c7673dcc468800b7af0a6",
  "CanaryLocation": "dining room",
  "SourceIP": "1.1.1.1",
  "AdditionalDetails": [
    [
      "Incident",
      "Consolidated Network Port Scan"
    ],
    [
      "Source",
      "1.1.1.1"
    ],
    [
      "Targets",
      "1.0.0.1, 1.0.0.2"
    ],
    [
      "Background Context",
      "You have had 8 incidents from 1.0.0.1 previously."
    ]
  ],
  "CanaryID": "00000000aa8a310e"
}
```

--------------------------------------------------------------------------------

---[FILE: canary_dummy.json]---
Location: zulip-main/zerver/webhooks/thinkst/fixtures/canary_dummy.json

```json
{
  "ReverseDNS": "attacker-ip.local",
  "CanaryName": "0000000testnode",
  "Description": "Dummy Incident",
  "Timestamp": "2020-06-09 13:59:38 (UTC)",
  "CanaryIP": "1.1.1.1",
  "AlertType": "CanaryIncident",
  "Intro": "This is a dummy incident.",
  "IncidentHash": "aa875f255f94e3ffe40dc85cf1a8b1e0",
  "CanaryPort": 8080,
  "SourceIP": "2.2.2.2",
  "AdditionalDetails": [
    [
      "Field1",
      "VALUE1"
    ],
    [
      "Field2",
      "VALUE2"
    ],
    [
      "Field3",
      "VALUE3"
    ]
  ],
  "CanaryID": "0000000testnode"
}
```

--------------------------------------------------------------------------------

---[FILE: canary_file_access.json]---
Location: zulip-main/zerver/webhooks/thinkst/fixtures/canary_file_access.json

```json
{
  "ReverseDNS": "",
  "CanaryName": "bar-foo",
  "Description": "Shared File (Re)Opened",
  "CanaryPort": 445,
  "Timestamp": "2020-07-20 16:27:20 (UTC)",
  "CanaryIP": "1.1.1.1",
  "AlertType": "CanaryIncident",
  "Intro": "Shared File (Re)Opened has been detected against one of your Canaries (bar-foo) at 1.1.1.1.",
  "IncidentHash": "a7bb317ba2072415462233cef3bc615a",
  "CanaryLocation": "dining room",
  "SourceIP": "1.1.1.1",
  "AdditionalDetails": [
    [
      "User",
      "guest"
    ],
    [
      "Filename",
      "secret/bar.doc"
    ],
    [
      "Additional Information",
      "This file 'secret/bar.doc' was previously opened by the host 'zulip-dev' on 2020-07-20 16:18:56.\n\nIt was also opened 2 times before by the same host, on 2020-06-10 14:33:50, 2020-06-18 19:02:33."
    ],
    [
      "Background Context",
      "You have had 20 incidents from 1.1.1.1 previously."
    ]
  ],
  "CanaryID": "00000000aa8a310e"
}
```

--------------------------------------------------------------------------------

---[FILE: canary_host_port_scan.json]---
Location: zulip-main/zerver/webhooks/thinkst/fixtures/canary_host_port_scan.json

```json
{
  "ReverseDNS": "attacker.local",
  "CanaryName": "foo-bar",
  "Description": "Host Port Scan",
  "CanaryPort": "1723",
  "Timestamp": "2020-07-20 16:26:30 (UTC)",
  "CanaryIP": "1.1.1.1",
  "AlertType": "CanaryIncident",
  "Intro": "Host Port Scan has been detected against one of your Canaries (foo-bar) at 1.1.1.1.",
  "IncidentHash": "9060473d2da98afe494adad648495620",
  "CanaryLocation": "dining room",
  "SourceIP": "1.1.1.1",
  "AdditionalDetails": [
    [
      "Partial Ports",
      "443, 554, 80, 1723, 22"
    ]
  ],
  "CanaryID": "00024808d6c2f7e5"
}
```

--------------------------------------------------------------------------------

---[FILE: canary_http_login.json]---
Location: zulip-main/zerver/webhooks/thinkst/fixtures/canary_http_login.json

```json
{
  "ReverseDNS": "",
  "CanaryName": "foo-bar",
  "Description": "HTTP Login Attempt",
  "CanaryPort": 80,
  "Timestamp": "2020-07-20 14:55:45 (UTC)",
  "CanaryIP": "1.1.1.1",
  "AlertType": "CanaryIncident",
  "Intro": "HTTP Login Attempt has been detected against one of your Canaries (foo-bar) at 1.1.1.1.",
  "IncidentHash": "1ef86f5cf4090a5252c6f453c5cd46bd",
  "CanaryLocation": "dining room",
  "SourceIP": "1.1.1.1",
  "AdditionalDetails": [
    [
      "Username",
      "regular"
    ],
    [
      "Password",
      "*******"
    ],
    [
      "User-Agent",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15"
    ],
    [
      "Background Context",
      "You have had 14 incidents from 1.1.1.1 previously."
    ]
  ],
  "CanaryID": "00000000d9febd04"
}
```

--------------------------------------------------------------------------------

---[FILE: canary_ssh_login.json]---
Location: zulip-main/zerver/webhooks/thinkst/fixtures/canary_ssh_login.json

```json
{
  "ReverseDNS": "attacker.local",
  "CanaryName": "foo-bar",
  "Description": "SSH Login Attempt",
  "CanaryPort": 22,
  "Timestamp": "2020-07-20 16:26:22 (UTC)",
  "CanaryIP": "1.1.1.1",
  "AlertType": "CanaryIncident",
  "Intro": "SSH Login Attempt has been detected against one of your Canaries (foo-bar) at 1.1.1.1.",
  "IncidentHash": "4ef51a936d05e0a6b4846378c8c38d2c",
  "CanaryLocation": "dining room",
  "SourceIP": "1.1.1.1",
  "AdditionalDetails": [
    [
      "Username",
      "foo"
    ],
    [
      "Key",
      "*******"
    ],
    [
      "Background Context",
      "You have had 9 incidents from 1.1.1.1 previously."
    ]
  ],
  "CanaryID": "00024808d6c2f7e5"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/transifex/doc.md

```text
# Zulip Transifex integration

Get Transifex notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On your Transifex Dashboard, select your project, and click **Settings**.
   Go to the **Webhooks** tab, and click **Add webhook**.

1. Set **URL** to the URL generated above. Select the
   [events](#filtering-incoming-events) you'd like to be notified about,
   and set **Status** to **Active**. Click **Save Changes**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/transifex/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/transifex/tests.py

```python
from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class TransifexHookTests(WebhookTestCase):
    CHANNEL_NAME = "transifex"
    URL_TEMPLATE = "/api/v1/external/transifex?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "transifex"

    PROJECT = "project-title"
    LANGUAGE = "en"
    RESOURCE = "file"

    def test_transifex_reviewed_message(self) -> None:
        expected_topic_name = f"{self.PROJECT} in {self.LANGUAGE}"
        expected_message = f"Resource {self.RESOURCE} fully reviewed."
        self.url = self.build_webhook_url(
            event="review_completed",
            reviewed="100",
            project=self.PROJECT,
            language=self.LANGUAGE,
            resource=self.RESOURCE,
        )
        self.check_webhook("", expected_topic_name, expected_message)

    def test_transifex_translated_message(self) -> None:
        expected_topic_name = f"{self.PROJECT} in {self.LANGUAGE}"
        expected_message = f"Resource {self.RESOURCE} fully translated."
        self.url = self.build_webhook_url(
            event="translation_completed",
            translated="100",
            project=self.PROJECT,
            language=self.LANGUAGE,
            resource=self.RESOURCE,
        )
        self.check_webhook("", expected_topic_name, expected_message)

    @override
    def get_payload(self, fixture_name: str) -> dict[str, str]:
        return {}
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/transifex/view.py
Signals: Django, Pydantic

```python
# Webhooks for external integrations.

from django.http import HttpRequest, HttpResponse
from pydantic import Json

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

All_EVENT_TYPES = ["translated", "review"]


@webhook_view("Transifex", notify_bot_owner_on_invalid_json=False, all_event_types=All_EVENT_TYPES)
@typed_endpoint
def api_transifex_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    project: str,
    resource: str,
    language: str,
    event: str,
    translated: Json[int] | None = None,
    reviewed: Json[int] | None = None,
) -> HttpResponse:
    topic_name = f"{project} in {language}"
    if event == "translation_completed":
        event = "translated"
        body = f"Resource {resource} fully translated."
    elif event == "review_completed":
        event = "review"
        body = f"Resource {resource} fully reviewed."
    else:
        raise UnsupportedWebhookEventTypeError(event)
    check_send_webhook_message(request, user_profile, topic_name, body, event)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/travis/doc.md

```text
# Zulip Travis CI integration

See your Travis CI build notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Add the following to the bottom of your `.travis.yml` file, and push
   the change to your repository:

    ```
    notifications:
      webhooks:
        - <URL generated above>
    ```

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/travis/001.png)

{!event-filtering-additional-feature.md!}


### Related documentation

- [Travis CI's webhook documentation][1]

{!webhooks-url-specification.md!}

[1]: https://docs.travis-ci.com/user/notifications/#configuring-webhook-notifications
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/travis/tests.py

```python
from urllib.parse import urlencode

from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class TravisHookTests(WebhookTestCase):
    CHANNEL_NAME = "travis"
    URL_TEMPLATE = "/api/v1/external/travis?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "travis"
    TOPIC_NAME = "builds"
    EXPECTED_MESSAGE = """
Author: josh_mandel
Build status: Passed :thumbs_up:
Details: [changes](https://github.com/hl7-fhir/fhir-svn/compare/6dccb98bcfd9...6c457d366a31), [build log](https://travis-ci.org/hl7-fhir/fhir-svn/builds/92495257)
""".strip()

    def test_travis_message(self) -> None:
        """
        Build notifications are generated by Travis after build completes.

        The subject describes the repo and Stash "project". The
        content describes the commits pushed.
        """

        self.check_webhook(
            "build",
            self.TOPIC_NAME,
            self.EXPECTED_MESSAGE,
            content_type="application/x-www-form-urlencoded",
        )

    def test_travis_only_pull_request_event(self) -> None:
        self.url = f'{self.build_webhook_url()}&only_events=["pull_request"]'

        self.check_webhook(
            "pull_request",
            self.TOPIC_NAME,
            self.EXPECTED_MESSAGE,
            content_type="application/x-www-form-urlencoded",
        )

        self.check_webhook(
            "build",
            content_type="application/x-www-form-urlencoded",
            expect_noop=True,
        )

    def test_travis_exclude_pull_request_event(self) -> None:
        self.url = f'{self.build_webhook_url()}&exclude_events=["pull_request"]'

        self.check_webhook(
            "pull_request",
            content_type="application/x-www-form-urlencoded",
            expect_noop=True,
        )

        self.check_webhook(
            "build",
            self.TOPIC_NAME,
            self.EXPECTED_MESSAGE,
            content_type="application/x-www-form-urlencoded",
        )

    def test_travis_only_push_event(self) -> None:
        self.url = f'{self.build_webhook_url()}&only_events=["push"]'

        self.check_webhook(
            "build",
            self.TOPIC_NAME,
            self.EXPECTED_MESSAGE,
            content_type="application/x-www-form-urlencoded",
        )

        self.check_webhook(
            "pull_request",
            content_type="application/x-www-form-urlencoded",
            expect_noop=True,
        )

    def test_travis_exclude_push_event(self) -> None:
        self.url = f'{self.build_webhook_url()}&exclude_events=["push"]'

        self.check_webhook(
            "build",
            content_type="application/x-www-form-urlencoded",
            expect_noop=True,
        )

        self.check_webhook(
            "pull_request",
            self.TOPIC_NAME,
            self.EXPECTED_MESSAGE,
            content_type="application/x-www-form-urlencoded",
        )

    def test_travis_include_glob_events(self) -> None:
        self.url = f'{self.build_webhook_url()}&include_events=["*"]'

        self.check_webhook(
            "pull_request",
            self.TOPIC_NAME,
            self.EXPECTED_MESSAGE,
            content_type="application/x-www-form-urlencoded",
        )

        self.check_webhook(
            "build",
            self.TOPIC_NAME,
            self.EXPECTED_MESSAGE,
            content_type="application/x-www-form-urlencoded",
        )

    def test_travis_exclude_glob_events(self) -> None:
        self.url = f'{self.build_webhook_url()}&exclude_events=["*"]'

        self.check_webhook(
            "pull_request",
            content_type="application/x-www-form-urlencoded",
            expect_noop=True,
        )

        self.check_webhook(
            "build",
            content_type="application/x-www-form-urlencoded",
            expect_noop=True,
        )

    def test_travis_noop(self) -> None:
        expected_error_message = """
While no message is expected given expect_noop=True,
your test code triggered an endpoint that did write
one or more new messages.
        """.strip()

        with self.assertRaises(Exception) as exc:
            self.check_webhook(
                "build", content_type="application/x-www-form-urlencoded", expect_noop=True
            )
        self.assertEqual(str(exc.exception), expected_error_message)

    @override
    def get_body(self, fixture_name: str) -> str:
        return urlencode(
            {"payload": self.webhook_fixture_data("travis", fixture_name, file_type="json")}
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/travis/view.py
Signals: Django, Pydantic

```python
# Webhooks for external integrations.

from typing import Annotated

from django.http import HttpRequest, HttpResponse
from pydantic import BaseModel, Json

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import ApiParamConfig, typed_endpoint
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

GOOD_STATUSES = ["Passed", "Fixed"]
BAD_STATUSES = ["Failed", "Broken", "Still Failing", "Errored", "Canceled"]
PENDING_STATUSES = ["Pending"]
ALL_EVENT_TYPES = [
    "push",
    "pull_request",
]

MESSAGE_TEMPLATE = """\
Author: {}
Build status: {} {}
Details: [changes]({}), [build log]({})"""


class TravisPayload(BaseModel):
    author_name: str
    status_message: str
    compare_url: str
    build_url: str
    type: str


@webhook_view("Travis", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_travis_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    message: Annotated[Json[TravisPayload], ApiParamConfig("payload")],
) -> HttpResponse:
    event = message.type
    message_status = message.status_message

    if message_status in GOOD_STATUSES:
        emoji = ":thumbs_up:"
    elif message_status in BAD_STATUSES:
        emoji = ":thumbs_down:"
    elif message_status in PENDING_STATUSES:
        emoji = ":counterclockwise:"
    else:
        emoji = f"(No emoji specified for status '{message_status}'.)"

    body = MESSAGE_TEMPLATE.format(
        message.author_name,
        message_status,
        emoji,
        message.compare_url,
        message.build_url,
    )
    topic_name = "builds"

    check_send_webhook_message(request, user_profile, topic_name, body, event)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: build.json]---
Location: zulip-main/zerver/webhooks/travis/fixtures/build.json

```json
{
  "id": 92495257,
  "repository": {
    "id": 2176580,
    "name": "fhir-svn",
    "owner_name": "hl7-fhir",
    "url": null
  },
  "number": "4601",
  "config": {
    "language": "java",
    "jdk": [
      "oraclejdk8"
    ],
    "script": "./build.sh",
    "sudo": false,
    "notifications": {
      "email": [ ],
      "webhooks": [
        "https://zulip.example.com/api/v1/external/travis?stream=travis&/topic=builds&api_key=abcdefg"
      ]
    },
    "after_success": [ ],
    "env": [
      "[One+of+the+secure+variables+in+your+.travis.yml+has+an+invalid+format.]"
    ],
    ".result": "configured"
  },
  "status": 0,
  "result": 0,
  "status_message": "Passed",
  "result_message": "Passed",
  "started_at": "2015-11-21T23:28:22Z",
  "finished_at": "2015-11-21T23:45:25Z",
  "duration": 1023,
  "build_url": "https://travis-ci.org/hl7-fhir/fhir-svn/builds/92495257",
  "commit_id": 26300989,
  "commit": "6c457d366a31696c989c011ab75b734d8485a9ba",
  "base_commit": null,
  "head_commit": null,
  "branch": "master",
  "message": "Debug+build+hooks\n\ngit-svn-id:+http://gforge.hl7.org/svn/fhir/trunk/build@7323+2f0db536-2c49-4257-a3fa-e771ed206c19",
  "compare_url": "https://github.com/hl7-fhir/fhir-svn/compare/6dccb98bcfd9...6c457d366a31",
  "committed_at": "2015-11-21T23:27:13Z",
  "author_name": "josh_mandel",
  "author_email": "josh_mandel@2f0db536-2c49-4257-a3fa-e771ed206c19",
  "committer_name": "josh_mandel",
  "committer_email": "josh_mandel@2f0db536-2c49-4257-a3fa-e771ed206c19",
  "matrix": [
    {
      "id": 92495258,
      "repository_id": 2176580,
      "parent_id": 92495257,
      "number": "4601.1",
      "state": "finished",
      "config": {
        "language": "java",
        "jdk": "oraclejdk8",
        "script": "./build.sh",
        "sudo": false,
        "notifications": {
          "email": [ ],
          "webhooks": [
            "https://zulip.example.com/api/v1/external/travis?stream=travis&topic=builds&api_key=abcdefg"
          ]
        },
        "after_success": [ ],
        ".result": "configured",
        "global_env": [  ],
        "language": "ruby",
        "group": "stable",
        "dist": "precise",
        "os": "linux"
      },
      "status": 0,
      "result": 0,
      "commit": "6c457d366a31696c989c011ab75b734d8485a9ba",
      "branch": "master",
      "message": "Debug+build+hooks\n\ngit-svn-id:+http://gforge.hl7.org/svn/fhir/trunk/build@7323+2f0db536-2c49-4257-a3fa-e771ed206c19",
      "compare_url": "https://github.com/hl7-fhir/fhir-svn/compare/6dccb98bcfd9...6c457d366a31",
      "started_at": "2015-11-21T23:28:22Z",
      "finished_at": "2015-11-21T23:45:25Z",
      "committed_at": "2015-11-21T23:27:13Z",
      "author_name": "josh_mandel",
      "author_email": "josh_mandel@2f0db536-2c49-4257-a3fa-e771ed206c19",
      "committer_name": "josh_mandel",
      "committer_email": "josh_mandel@2f0db536-2c49-4257-a3fa-e771ed206c19",
      "allow_failure": false
    }
  ],
  "type": "push",
  "state": "passed",
  "pull_request": false,
  "pull_request_number": null,
  "pull_request_title": null,
  "tag": null
}
```

--------------------------------------------------------------------------------

````
