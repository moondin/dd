---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1252
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1252 of 1290)

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

---[FILE: message_with_variety_files.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_variety_files.json

```json
{
  "token": "CqCsBJmXoNSHaNCt3wGWYSEe",
  "team_id": "T06NRA6HM3P",
  "context_team_id": "T06NRA6HM3P",
  "context_enterprise_id": null,
  "api_app_id": "A0757RM31HN",
  "event": {
    "text": "Message with an assortment of file types",
    "files": [
      {
        "id": "F079E4CMY5Q",
        "created": 1719209974,
        "timestamp": 1719209974,
        "name": "postman-agent-0.4.25-linux-x64.tar.gz",
        "title": "postman-agent-0.4.25-linux-x64.tar.gz",
        "mimetype": "application/x-gzip",
        "filetype": "gzip",
        "pretty_type": "Gzip",
        "user": "U06NU4E26M9",
        "user_team": "T06NRA6HM3P",
        "editable": false,
        "size": 107287179,
        "mode": "hosted",
        "is_external": false,
        "external_type": "",
        "is_public": true,
        "public_url_shared": false,
        "display_as_bot": false,
        "username": "",
        "url_private": "https://files.slack.com/files-pri/T06NRA6HM3P-F079E4CMY5Q/postman-agent-0.4.25-linux-x64.tar.gz",
        "url_private_download": "https://files.slack.com/files-pri/T06NRA6HM3P-F079E4CMY5Q/download/postman-agent-0.4.25-linux-x64.tar.gz",
        "media_display_type": "unknown",
        "permalink": "https://ds-py62195.slack.com/files/U06NU4E26M9/F079E4CMY5Q/postman-agent-0.4.25-linux-x64.tar.gz",
        "permalink_public": "https://slack-files.com/T06NRA6HM3P-F079E4CMY5Q-22ef8b1a63",
        "has_rich_preview": false,
        "file_access": "visible"
      },
      {
        "id": "F079SQ33CBT",
        "created": 1719210050,
        "timestamp": 1719210050,
        "name": "discord-0.0.55.deb",
        "title": "discord-0.0.55.deb",
        "mimetype": "application/octet-stream",
        "filetype": "binary",
        "pretty_type": "Binary",
        "user": "U06NU4E26M9",
        "user_team": "T06NRA6HM3P",
        "editable": false,
        "size": 100957736,
        "mode": "hosted",
        "is_external": false,
        "external_type": "",
        "is_public": true,
        "public_url_shared": false,
        "display_as_bot": false,
        "username": "",
        "url_private": "https://files.slack.com/files-pri/T06NRA6HM3P-F079SQ33CBT/discord-0.0.55.deb",
        "url_private_download": "https://files.slack.com/files-pri/T06NRA6HM3P-F079SQ33CBT/download/discord-0.0.55.deb",
        "media_display_type": "unknown",
        "permalink": "https://ds-py62195.slack.com/files/U06NU4E26M9/F079SQ33CBT/discord-0.0.55.deb",
        "permalink_public": "https://slack-files.com/T06NRA6HM3P-F079SQ33CBT-2438647ea1",
        "has_rich_preview": false,
        "file_access": "visible"
      },
      {
        "id": "F079SQ721A5",
        "created": 1719210117,
        "timestamp": 1719210117,
        "name": "Slack-bot-scopes-List.xlsx",
        "title": "Slack-bot-scopes-List.xlsx",
        "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "filetype": "xlsx",
        "pretty_type": "Excel Spreadsheet",
        "user": "U06NU4E26M9",
        "user_team": "T06NRA6HM3P",
        "editable": false,
        "size": 75813,
        "mode": "hosted",
        "is_external": false,
        "external_type": "",
        "is_public": true,
        "public_url_shared": false,
        "display_as_bot": false,
        "username": "",
        "url_private": "https://files.slack.com/files-pri/T06NRA6HM3P-F079SQ721A5/slack-bot-scopes-list.xlsx",
        "url_private_download": "https://files.slack.com/files-pri/T06NRA6HM3P-F079SQ721A5/download/slack-bot-scopes-list.xlsx",
        "media_display_type": "unknown",
        "converted_pdf": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079SQ721A5-315d1a255c/slack-bot-scopes-list_converted.pdf",
        "thumb_pdf": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079SQ721A5-315d1a255c/slack-bot-scopes-list_thumb_pdf.png",
        "thumb_pdf_w": 1210,
        "thumb_pdf_h": 935,
        "permalink": "https://ds-py62195.slack.com/files/U06NU4E26M9/F079SQ721A5/slack-bot-scopes-list.xlsx",
        "permalink_public": "https://slack-files.com/T06NRA6HM3P-F079SQ721A5-77cdc07a4d",
        "has_rich_preview": false,
        "file_access": "visible"
      },
      {
        "id": "F079B7G7NUD",
        "created": 1719210121,
        "timestamp": 1719210121,
        "name": "wallpaper.jpg",
        "title": "wallpaper.jpg",
        "mimetype": "image/jpeg",
        "filetype": "jpg",
        "pretty_type": "JPEG",
        "user": "U06NU4E26M9",
        "user_team": "T06NRA6HM3P",
        "editable": false,
        "size": 1572520,
        "mode": "hosted",
        "is_external": false,
        "external_type": "",
        "is_public": true,
        "public_url_shared": false,
        "display_as_bot": false,
        "username": "",
        "url_private": "https://files.slack.com/files-pri/T06NRA6HM3P-F079B7G7NUD/wallpaper.jpg",
        "url_private_download": "https://files.slack.com/files-pri/T06NRA6HM3P-F079B7G7NUD/download/wallpaper.jpg",
        "media_display_type": "unknown",
        "thumb_64": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079B7G7NUD-3b2ba7aee1/wallpaper_64.jpg",
        "thumb_80": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079B7G7NUD-3b2ba7aee1/wallpaper_80.jpg",
        "thumb_360": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079B7G7NUD-3b2ba7aee1/wallpaper_360.jpg",
        "thumb_360_w": 360,
        "thumb_360_h": 203,
        "thumb_480": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079B7G7NUD-3b2ba7aee1/wallpaper_480.jpg",
        "thumb_480_w": 480,
        "thumb_480_h": 270,
        "thumb_160": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079B7G7NUD-3b2ba7aee1/wallpaper_160.jpg",
        "thumb_720": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079B7G7NUD-3b2ba7aee1/wallpaper_720.jpg",
        "thumb_720_w": 720,
        "thumb_720_h": 405,
        "thumb_800": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079B7G7NUD-3b2ba7aee1/wallpaper_800.jpg",
        "thumb_800_w": 800,
        "thumb_800_h": 450,
        "thumb_960": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079B7G7NUD-3b2ba7aee1/wallpaper_960.jpg",
        "thumb_960_w": 960,
        "thumb_960_h": 540,
        "thumb_1024": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079B7G7NUD-3b2ba7aee1/wallpaper_1024.jpg",
        "thumb_1024_w": 1024,
        "thumb_1024_h": 576,
        "original_w": 3840,
        "original_h": 2160,
        "thumb_tiny": "AwAbADCUU8U0UyZyAFQZPemIl3qKFO7J7VVA7u3PoKl2sMKG4PpTESGmmiMNtbJzg8Gg0hirVadH356irIpJPu5oQFWD5nIP3hyPp6VZkYqq46ngVXT/AFwqyedmfU0xEka7U/CmSAA8U9+MVEaQz//Z",
        "permalink": "https://ds-py62195.slack.com/files/U06NU4E26M9/F079B7G7NUD/wallpaper.jpg",
        "permalink_public": "https://slack-files.com/T06NRA6HM3P-F079B7G7NUD-c461327fc3",
        "has_rich_preview": false,
        "file_access": "visible"
      },
      {
        "id": "F07A2TVKNQ0",
        "created": 1719210129,
        "timestamp": 1719210129,
        "name": "TestPDFfile.pdf",
        "title": "TestPDFfile.pdf",
        "mimetype": "application/pdf",
        "filetype": "pdf",
        "pretty_type": "PDF",
        "user": "U06NU4E26M9",
        "user_team": "T06NRA6HM3P",
        "editable": false,
        "size": 83186,
        "mode": "hosted",
        "is_external": false,
        "external_type": "",
        "is_public": true,
        "public_url_shared": false,
        "display_as_bot": false,
        "username": "",
        "url_private": "https://files.slack.com/files-pri/T06NRA6HM3P-F07A2TVKNQ0/testpdffile.pdf",
        "url_private_download": "https://files.slack.com/files-pri/T06NRA6HM3P-F07A2TVKNQ0/download/testpdffile.pdf",
        "media_display_type": "unknown",
        "thumb_pdf": "https://files.slack.com/files-tmb/T06NRA6HM3P-F07A2TVKNQ0-67f8edb672/testpdffile_thumb_pdf.png",
        "thumb_pdf_w": 935,
        "thumb_pdf_h": 1210,
        "permalink": "https://ds-py62195.slack.com/files/U06NU4E26M9/F07A2TVKNQ0/testpdffile.pdf",
        "permalink_public": "https://slack-files.com/T06NRA6HM3P-F07A2TVKNQ0-4507eb87a4",
        "has_rich_preview": false,
        "file_access": "visible"
      },
      {
        "id": "F07A2TVQ7C0",
        "created": 1719210132,
        "timestamp": 1719210132,
        "name": "channels.json",
        "title": "channels.json",
        "mimetype": "text/plain",
        "filetype": "json",
        "pretty_type": "JSON",
        "user": "U06NU4E26M9",
        "user_team": "T06NRA6HM3P",
        "editable": true,
        "size": 1563,
        "mode": "snippet",
        "is_external": false,
        "external_type": "",
        "is_public": false,
        "public_url_shared": false,
        "display_as_bot": false,
        "username": "",
        "url_private": "https://files.slack.com/files-pri/T06NRA6HM3P-F07A2TVQ7C0/channels.json",
        "url_private_download": "https://files.slack.com/files-pri/T06NRA6HM3P-F07A2TVQ7C0/download/channels.json",
        "permalink": "https://ds-py62195.slack.com/files/U06NU4E26M9/F07A2TVQ7C0/channels.json",
        "permalink_public": "https://slack-files.com/T06NRA6HM3P-F07A2TVQ7C0-5b1d277896",
        "edit_link": "https://ds-py62195.slack.com/files/U06NU4E26M9/F07A2TVQ7C0/channels.json/edit",
        "preview": "[\n{\n    \"id\": \"C06NRA6JLER\",\n    \"name\": \"random\",\n    \"created\": 1710128735,",
        "preview_highlight": "<div class="
      }
    ],
    "upload": false,
    "type": "message",
    "user": "U06NU4E26M9",
    "ts": "1719209815.105159",
    "client_msg_id": "15117486-b4e1-42a9-a553-ca2886d94222",
    "channel": "C06NRA6JLER",
    "subtype": "file_share",
    "event_ts": "1719209815.105159",
    "channel_type": "channel"
  },
  "type": "event_callback"
}
```

--------------------------------------------------------------------------------

---[FILE: message_with_workspace_mentions.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_workspace_mentions.json

```json
{
  "token": "CqCsBJmXoNSHaNCt3wGWYSEe",
  "team_id": "T06NRA6HM3P",
  "context_team_id": "T06NRA6HM3P",
  "context_enterprise_id": null,
  "api_app_id": "A0757RM31HN",
  "event": {
    "user": "U06NU4E26M9",
    "type": "message",
    "ts": "1719211249.499799",
    "client_msg_id": "49d50b19-e55e-452b-a6c2-8c5e1d4b3ef9",
    "text": "<!channel> <!here> Sorry for mentioning. This is for the test fixtures for the Slack integration update PR I'm working on and can't be done in a private channel. :bow:",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "298sd",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "broadcast",
                "range": "channel"
              },
              {
                "type": "text",
                "text": " "
              },
              {
                "type": "broadcast",
                "range": "here"
              },
              {
                "type": "text",
                "text": " Sorry for mentioning. This is for the test fixtures for the Slack integration update PR I'm working on and can't be done in a private channel. "
              },
              {
                "type": "emoji",
                "name": "bow",
                "unicode": "1f647"
              }
            ]
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719211249.499799",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev079GLT13NY",
  "event_time": 1719211249,
  "authorizations": [
    {
      "enterprise_id": null,
      "team_id": "T06NRA6HM3P",
      "user_id": "U074G5E1ANR",
      "is_bot": true,
      "is_enterprise_install": false
    }
  ],
  "is_ext_shared_channel": false,
  "event_context": "4-eyJldCI6Im1lc3NhZ2UiLCJ0aWQiOiJUMDZOUkE2SE0zUCIsImFpZCI6IkEwNzU3Uk0zMUhOIiwiY2lkIjoiQzA2TlJBNkpMRVIifQ"
}
```

--------------------------------------------------------------------------------

---[FILE: slack_conversations_info_api_response.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/slack_conversations_info_api_response.json

```json
{
  "ok": true,
  "channel": {
    "id": "C012AB3CD",
    "name": "Slack general",
    "is_channel": true,
    "is_group": false,
    "is_im": false,
    "is_mpim": false,
    "is_private": false,
    "created": 1654868334,
    "is_archived": false,
    "is_general": true,
    "unlinked": 0,
    "name_normalized": "Slack general",
    "is_shared": false,
    "is_frozen": false,
    "is_org_shared": false,
    "is_pending_ext_shared": false,
    "pending_shared": [],
    "context_team_id": "T123ABC456",
    "updated": 1723130875818,
    "parent_conversation": null,
    "creator": "U123ABC456",
    "is_ext_shared": false,
    "shared_team_ids": [
      "T123ABC456"
    ],
    "pending_connected_team_ids": [],
    "topic": {
      "value": "For public discussion of generalities",
      "creator": "W012A3BCD",
      "last_set": 1449709364
    },
    "purpose": {
      "value": "This part of the workspace is for fun. Make fun here.",
      "creator": "W012A3BCD",
      "last_set": 1449709364
    },
    "properties": {
      "tabs": [
        {
          "id": "workflows",
          "label": "",
          "type": "workflows"
        },
        {
          "id": "files",
          "label": "",
          "type": "files"
        },
        {
          "id": "bookmarks",
          "label": "",
          "type": "bookmarks"
        }
      ]
    },
    "previous_names": []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: slack_users_info_api_response.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/slack_users_info_api_response.json

```json
{
  "ok": true,
  "user": {
    "id": "W012A3CDE",
    "team_id": "T012AB3C4",
    "name": "supersecretemail",
    "deleted": false,
    "color": "9f69e7",
    "real_name": "John Doe",
    "tz": "America/Los_Angeles",
    "tz_label": "Pacific Daylight Time",
    "tz_offset": -25200,
    "profile": {
      "avatar_hash": "ge3b51ca72de",
      "status_text": "Print is dead",
      "status_emoji": ":books:",
      "real_name": "John Doe",
      "display_name": "john",
      "real_name_normalized": "John Doe",
      "display_name_normalized": "john",
      "email": "supersecretemail@ghostbusters.example.com",
      "image_original": "https://.../avatar/e3b51ca72dee4ef87916ae2b9240df50.jpg",
      "image_24": "https://.../avatar/e3b51ca72dee4ef87916ae2b9240df50.jpg",
      "image_32": "https://.../avatar/e3b51ca72dee4ef87916ae2b9240df50.jpg",
      "image_48": "https://.../avatar/e3b51ca72dee4ef87916ae2b9240df50.jpg",
      "image_72": "https://.../avatar/e3b51ca72dee4ef87916ae2b9240df50.jpg",
      "image_192": "https://.../avatar/e3b51ca72dee4ef87916ae2b9240df50.jpg",
      "image_512": "https://.../avatar/e3b51ca72dee4ef87916ae2b9240df50.jpg",
      "team": "T012AB3C4"
    },
    "is_admin": true,
    "is_owner": false,
    "is_primary_owner": false,
    "is_restricted": false,
    "is_ultra_restricted": false,
    "is_bot": false,
    "updated": 1502138686,
    "is_app_user": false,
    "has_2fa": false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/slack_incoming/doc.md

```text
# Zulip's Slack-compatible incoming webhook

Zulip can process incoming webhook messages written to work with Slack's
[incoming webhook API][1]. This makes it easy to quickly move your
integrations when migrating your organization from Slack to Zulip.

!!! warn ""

     **Note:** In the long term, the recommended approach is to use
     Zulip's native integrations, which take advantage of Zulip's topics.
     There may also be some quirks when Slack's formatting system is
     translated into Zulip's.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Use the generated URL anywhere you would use a Slack webhook.

{end_tabs}

### Related documentation

- [Slack's incoming webhook documentation][1]

- [Moving from Slack to Zulip](/help/moving-from-slack)

- [Forward Slack messages into Zulip](/integrations/slack)

- [Forward messages Slack <-> Zulip][2] (both directions)

{!webhooks-url-specification.md!}

[1]: https://api.slack.com/messaging/webhooks
[2]: https://github.com/zulip/python-zulip-api/blob/main/zulip/integrations/bridge_with_slack/README.md
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/slack_incoming/tests.py

```python
from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class SlackIncomingHookTests(WebhookTestCase):
    CHANNEL_NAME = "slack_incoming"
    URL_TEMPLATE = "/api/v1/external/slack_incoming?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "slack_incoming"

    def test_message(self) -> None:
        expected_topic_name = ""
        expected_message = """
Hello, world.
""".strip()

        self.check_webhook(
            "text",
            expected_topic_name,
            expected_message,
        )

    def test_message_formatting(self) -> None:
        tests = [
            ("some *foo* word", "some **foo** word"),
            ("*foo*", "**foo**"),
            ("*foo* *bar*", "**foo** **bar**"),
            ("*foo*a*bar*", "*foo*a*bar*"),
            ("some _foo_ word", "some *foo* word"),
        ]
        self.subscribe(self.test_user, self.CHANNEL_NAME)
        for input_value, output_value in tests:
            payload = {"text": input_value}
            msg = self.send_webhook_payload(
                self.test_user,
                self.url,
                payload,
                content_type="application/json",
            )
            self.assert_channel_message(
                message=msg,
                channel_name=self.CHANNEL_NAME,
                topic_name="",
                content=output_value,
            )

    def test_null_message(self) -> None:
        self.check_webhook(
            "null_text",
            expect_noop=True,
        )

    def test_message_as_www_urlencoded(self) -> None:
        expected_topic_name = "devops"
        expected_message = """
:zap: chris has started deploying project tag v0.0.2rc10 to staging
""".strip()

        self.check_webhook(
            "urlencoded_text",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_message_without_payload(self) -> None:
        self.url = self.build_webhook_url()
        result = self.client_post(self.url)
        self.assertEqual(result.json()["error"], "Missing 'payload' argument")
        self.assertEqual(result.json()["ok"], False)

    def test_message_with_actions(self) -> None:
        expected_topic_name = "C1H9RESGL"
        expected_message = """
Danny Torrence left the following *review* for your property:

[Overlook Hotel](https://google.com) \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s.

[Haunted hotel image](https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg)

**Average Rating**
1.0
""".strip()

        self.check_webhook(
            "actions",
            expected_topic_name,
            expected_message,
        )

    def test_message_with_blocks(self) -> None:
        expected_topic_name = ""
        expected_message = """
Danny Torrence left the following review for your property:

[Overlook Hotel](https://example.com) \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s.

[Haunted hotel image](https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg)

**Average Rating**
1.0
""".strip()

        self.check_webhook(
            "blocks",
            expected_topic_name,
            expected_message,
        )

    def test_message_with_attachment(self) -> None:
        expected_topic_name = "prometheus-alerts"
        expected_message = """
## [[FIRING:2] InstanceDown for api-server (env="prod", severity="critical")](https://alertmanager.local//#/alerts?receiver=default)

:chart_with_upwards_trend: **[Graph](http://generator.local/1)**   :notebook: **[Runbook](https://runbook.local/1)**

**Alert details**:
**Alert:** api-server down - `critical`
**Description:** api-server at 1.2.3.4:8080 couldn't be scraped **Details:**
   • **alertname:** `InstanceDown`
   • **env:** `prod`
   • **instance:** `1.2.3.4:8080`
   • **job:** `api-server`
   • **severity:** `critical`

**Alert:** api-server down - `critical`
**Description:** api-server at 1.2.3.4:8081 couldn't be scraped **Details:**
   • **alertname:** `InstanceDown`
   • **env:** `prod`
   • **instance:** `1.2.3.4:8081`
   • **job:** `api-server`
   • **severity:** `critical`
""".strip()

        self.check_webhook(
            "attachment",
            expected_topic_name,
            expected_message,
        )

    def test_complicated(self) -> None:
        # Paste the JSON into
        # https://api.slack.com/tools/block-kit-builder to see how it
        # is rendered in Slack
        expected_topic_name = ""
        expected_message = """
## Hello from TaskBot

Hey there 👋 I'm TaskBot. I'm here to help you create and manage tasks in Slack.
There are two ways to quickly create tasks:

**1️⃣ Use the `/task` command**. Type `/task` followed by a short description of your tasks and I'll ask for a due date (if applicable). Try it out by using the `/task` command in this channel.

**2️⃣ Use the *Create a Task* action.** If you want to create a task from a message, select `Create a Task` in a message's context menu. Try it out by selecting the *Create a Task* action for this message (shown below).

[image1](https://api.slack.com/img/blocks/bkb_template_images/onboardingComplex.jpg)

➕ To start tracking your team's tasks, **add me to a channel** and I'll introduce myself. I'm usually added to a team or project channel. Type `/invite @TaskBot` from the channel or pick a channel on the right.

----

[cute cat](https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg)

👀 View all tasks with `/task list`

❓Get help at any time with:
- `/task help`, or
- type **help** in a DM with me
        """.strip()

        self.check_webhook(
            "complicated",
            expected_topic_name,
            expected_message,
        )

    def test_attachment_blocks(self) -> None:
        # On https://api.slack.com/tools/block-kit-builder choose
        # "Attachment preview" and paste the JSON in.
        expected_topic_name = ""
        expected_message = """
This is a section block with an accessory image.

[cute cat](https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg)

This is a section block with a button.

| | |
|-|-|
| one | two |
| three | four |
| five |  |
        """.strip()

        self.check_webhook(
            "attachment_blocks",
            expected_topic_name,
            expected_message,
        )

    def test_attachment_fields(self) -> None:
        expected_topic_name = ""
        expected_message = """
Build bla bla succeeded

**Requested by**: Some user
**Duration**: 00:02:03
**Build pipeline**: ConsumerAddressModule
**Title with null value**
**Title without value**
Value with null title
Value without title
        """.strip()

        self.check_webhook(
            "attachment_fields",
            expected_topic_name,
            expected_message,
        )

    def test_attachment_pieces(self) -> None:
        expected_topic_name = ""
        expected_message = """
## Test

[](https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg)

<time:2022-06-23T00:48:26+00:00>
        """.strip()

        self.check_webhook(
            "attachment_pieces",
            expected_topic_name,
            expected_message,
        )

    @override
    def get_body(self, fixture_name: str) -> str:
        if "urlencoded" in fixture_name:
            file_type = "txt"
        else:
            file_type = "json"
        return self.webhook_fixture_data("slack_incoming", fixture_name, file_type=file_type)

    def test_attachment_pieces_title_null(self) -> None:
        expected_topic_name = ""
        expected_message = """
Sample pretext.

Sample text.

[](https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg)

Sample footer.

<time:2022-06-23T00:48:26+00:00>
        """.strip()

        self.check_webhook(
            "attachment_pieces_title_null",
            expected_topic_name,
            expected_message,
        )

    def test_attachment_pieces_image_url_null(self) -> None:
        expected_topic_name = ""
        expected_message = """
## [Sample title.](https://www.google.com)

Sample pretext.

Sample text.

Sample footer.

<time:2022-06-23T00:48:26+00:00>
        """.strip()

        self.check_webhook(
            "attachment_pieces_image_url_null",
            expected_topic_name,
            expected_message,
        )

    def test_attachment_pieces_ts_null(self) -> None:
        expected_topic_name = ""
        expected_message = """
## [Sample title.](https://www.google.com)

Sample pretext.

Sample text.

[](https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg)

Sample footer.
        """.strip()

        self.check_webhook(
            "attachment_pieces_ts_null",
            expected_topic_name,
            expected_message,
        )

    def test_attachment_pieces_text_null(self) -> None:
        expected_topic_name = ""
        expected_message = """
## [Sample title.](https://www.google.com)

Sample pretext.

[](https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg)

Sample footer.

<time:2022-06-23T00:48:26+00:00>
        """.strip()

        self.check_webhook(
            "attachment_pieces_text_null",
            expected_topic_name,
            expected_message,
        )

    def test_attachment_pieces_pretext_null(self) -> None:
        expected_topic_name = ""
        expected_message = """
## [Sample title.](https://www.google.com)

Sample text.

[](https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg)

Sample footer.

<time:2022-06-23T00:48:26+00:00>
        """.strip()

        self.check_webhook(
            "attachment_pieces_pretext_null",
            expected_topic_name,
            expected_message,
        )

    def test_attachment_pieces_footer_null(self) -> None:
        expected_topic_name = ""
        expected_message = """
## [Sample title.](https://www.google.com)

Sample pretext.

Sample text.

[](https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg)

<time:2022-06-23T00:48:26+00:00>
        """.strip()

        self.check_webhook(
            "attachment_pieces_footer_null",
            expected_topic_name,
            expected_message,
        )

    def test_attachment_pieces_title_link_null(self) -> None:
        expected_topic_name = ""
        expected_message = """
## Sample title.

Sample pretext.

Sample text.

[](https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg)

Sample footer.

<time:2022-06-23T00:48:26+00:00>
        """.strip()

        self.check_webhook(
            "attachment_pieces_title_link_null",
            expected_topic_name,
            expected_message,
        )

    def test_attachment_pieces_all_null(self) -> None:
        self.check_webhook("attachment_pieces_all_null", expect_noop=True)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/slack_incoming/view.py
Signals: Django

```python
# Webhooks for external integrations.
import re
from collections.abc import Callable
from functools import wraps
from typing import Concatenate

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.utils.translation import gettext as _
from typing_extensions import ParamSpec

from zerver.data_import.slack_message_conversion import (
    convert_slack_formatting,
    render_attachment,
    render_block,
    replace_links,
)
from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.request import RequestVariableMissingError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.validator import check_string, to_wild_value
from zerver.lib.webhooks.common import OptionalUserSpecifiedTopicStr, check_send_webhook_message
from zerver.models import UserProfile

ParamT = ParamSpec("ParamT")


def slack_error_handler(
    view_func: Callable[Concatenate[HttpRequest, ParamT], HttpResponse],
) -> Callable[Concatenate[HttpRequest, ParamT], HttpResponse]:
    """
    A decorator that catches JsonableError exceptions and returns a
    Slack-compatible error response in the format:
    {ok: false, error: "error message"}.
    """

    @wraps(view_func)
    def wrapped_view(
        request: HttpRequest, /, *args: ParamT.args, **kwargs: ParamT.kwargs
    ) -> HttpResponse:
        try:
            return view_func(request, *args, **kwargs)
        except JsonableError as error:
            return JsonResponse({"ok": False, "error": error.msg}, status=error.http_status_code)

    return wrapped_view


@webhook_view("SlackIncoming")
@typed_endpoint
@slack_error_handler
def api_slack_incoming_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    user_specified_topic: OptionalUserSpecifiedTopicStr = None,
) -> HttpResponse:
    # Slack accepts webhook payloads as payload="encoded json" as
    # application/x-www-form-urlencoded, as well as in the body as
    # application/json.
    if request.content_type == "application/json":
        try:
            val = request.body.decode(request.encoding or "utf-8")
        except UnicodeDecodeError:  # nocoverage
            raise JsonableError(_("Malformed payload"))
    else:
        req_var = "payload"
        if req_var in request.POST:
            val = request.POST[req_var]
        elif req_var in request.GET:  # nocoverage
            val = request.GET[req_var]
        else:
            raise RequestVariableMissingError(req_var)

    payload = to_wild_value("payload", val)

    if user_specified_topic is None and "channel" in payload:
        channel = payload["channel"].tame(check_string)
        user_specified_topic = re.sub(r"^[@#]", "", channel)

    if user_specified_topic is None:
        user_specified_topic = "(no topic)"

    pieces: list[str] = []
    if payload.get("blocks"):
        pieces += map(render_block, payload["blocks"])

    if payload.get("attachments"):
        pieces += map(render_attachment, payload["attachments"])

    body = "\n\n".join(piece.strip() for piece in pieces if piece.strip() != "")

    if body == "" and payload.get("text"):
        if payload.get("icon_emoji"):
            body = payload["icon_emoji"].tame(check_string) + " "
        body += payload["text"].tame(check_string)
        body = body.strip()

    if body != "":
        body = convert_slack_formatting(replace_links(body).strip())
        check_send_webhook_message(request, user_profile, user_specified_topic, body)
    return json_success(request, data={"ok": True})
```

--------------------------------------------------------------------------------

---[FILE: actions.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/actions.json

```json
{
  "channel": "C1H9RESGL",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Danny Torrence left the following _review_ for your property:"
      }
    },
    {
      "type": "section",
      "block_id": "section567",
      "text": {
        "type": "mrkdwn",
        "text": "<https://google.com|Overlook Hotel> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s."
      },
      "accessory": {
        "type": "image",
        "image_url": "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
        "alt_text": "Haunted hotel image"
      }
    },
    {
      "type": "section",
      "block_id": "section789",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Average Rating*\n1.0"
        }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
            "text": {
                "type": "plain_text",
                "text": "Reply to review",
                "emoji": false
            }
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment.json

```json
{
    "channel": "#prometheus-alerts",
    "username": "Alertmanager",
    "blocks": null,
    "attachments": [
        {
            "title": "[FIRING:2] InstanceDown for api-server (env=\"prod\", severity=\"critical\")",
            "title_link": "https://alertmanager.local//#/alerts?receiver=default",
            "text": ":chart_with_upwards_trend: *<http://generator.local/1|Graph>*   :notebook: *<https://runbook.local/1|Runbook>*\n\n*Alert details*:\n*Alert:* api-server down - `critical`\n*Description:* api-server at 1.2.3.4:8080 couldn't be scraped *Details:*\n   • *alertname:* `InstanceDown`\n   • *env:* `prod`\n   • *instance:* `1.2.3.4:8080`\n   • *job:* `api-server`\n   • *severity:* `critical`\n\n*Alert:* api-server down - `critical`\n*Description:* api-server at 1.2.3.4:8081 couldn't be scraped *Details:*\n   • *alertname:* `InstanceDown`\n   • *env:* `prod`\n   • *instance:* `1.2.3.4:8081`\n   • *job:* `api-server`\n   • *severity:* `critical`\n  \n",
            "fallback": "[FIRING:2] InstanceDown api-server (prod critical) | https://alertmanager.local//#/alerts?receiver=default",
            "callback_id": "",
            "footer": "",
            "color": "danger",
            "mrkdwn_in": [
                "fallback",
                "pretext",
                "text"
            ]
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment_blocks.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_blocks.json

```json
{
  "attachments": [
    {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "This is a section block with an accessory image."
          },
          "accessory": {
            "type": "image",
            "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
            "alt_text": "cute cat"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "This is a section block with a button."
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Click Me",
              "emoji": true
            },
            "value": "click_me_123",
            "action_id": "button-action"
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "plain_text",
              "text": "one",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "two",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "three",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "four",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "five",
              "emoji": true
            }
          ]
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment_fields.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_fields.json

```json
{
  "attachments": [
    {
      "color": "good",
      "fields": [
        {
          "title": "Requested by",
          "value": "Some user",
          "short": true
        },
        {
          "title": "Duration",
          "value": "00:02:03",
          "short": true
        },
        {
          "title": "Build pipeline",
          "value": "ConsumerAddressModule",
          "short": true
        },
        {
          "title": "Title with null value",
          "value": null,
          "short": true
        },
        {
          "title": "Title without value",
          "short": true
        },
        {
          "title": null,
          "value": "Value with null title",
          "short": true
        },
        {
          "value": "Value without title",
          "short": true
        },
        {
          "title": null,
          "value": null,
          "short": true
        }
      ],
      "pretext": "Build bla bla succeeded",
      "mrkdwn_in": [
        "pretext"
      ],
      "fallback": "Build ConsumerAddressModule_20150407.2 succeeded"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment_pieces.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_pieces.json

```json
{
  "attachments": [
    {
      "title": "Test",
      "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
      "ts": 1655945306
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment_pieces_all_null.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_pieces_all_null.json

```json
{
    "attachments": [
        {
            "title": null,
            "title_link": null,
            "image_url": null,
            "ts": null,
            "text": null,
            "pretext": null,
            "footer": null
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment_pieces_footer_null.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_pieces_footer_null.json

```json
{
    "attachments": [
        {
            "title": "Sample title.",
            "title_link": "https://www.google.com",
            "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
            "ts": 1655945306,
            "text": "Sample text.",
            "pretext": "Sample pretext.",
            "footer": null
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment_pieces_image_url_null.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_pieces_image_url_null.json

```json
{
    "attachments": [
        {
            "title": "Sample title.",
            "title_link": "https://www.google.com",
            "image_url": null,
            "ts": 1655945306,
            "text": "Sample text.",
            "pretext": "Sample pretext.",
            "footer": "Sample footer."
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment_pieces_pretext_null.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_pieces_pretext_null.json

```json
{
    "attachments": [
        {
            "title": "Sample title.",
            "title_link": "https://www.google.com",
            "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
            "ts": 1655945306,
            "text": "Sample text.",
            "pretext": null,
            "footer": "Sample footer."
        }
    ]
}
```

--------------------------------------------------------------------------------

````
