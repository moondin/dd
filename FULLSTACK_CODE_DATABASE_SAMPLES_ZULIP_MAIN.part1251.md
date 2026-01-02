---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1251
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1251 of 1290)

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

---[FILE: message_info_missing_user_name.txt]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_info_missing_user_name.txt

```text
token=aotJImaVOVEVWssawxmegDWt&team_id=T3W8CTX0F&team_domain=gsoc2017&service_id=133126759712&channel_id=C3W8CTZFZ&channel_name=general&timestamp=1485947263.000010&user_id=U3W8CTX2T&text=test
```

--------------------------------------------------------------------------------

---[FILE: message_with_bullet_points.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_bullet_points.json

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
    "ts": "1719211714.999529",
    "client_msg_id": "8908e456-1821-4316-875c-810019adf321",
    "text": "\u2022 list three\n\u2022 list two",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "Cua/K",
        "elements": [
          {
            "type": "rich_text_list",
            "elements": [
              {
                "type": "rich_text_section",
                "elements": [
                  {
                    "type": "text",
                    "text": "list three"
                  }
                ]
              },
              {
                "type": "rich_text_section",
                "elements": [
                  {
                    "type": "text",
                    "text": "list two"
                  }
                ]
              }
            ],
            "style": "bullet",
            "indent": 0,
            "border": 0
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719211714.999529",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev07A31E3A2C",
  "event_time": 1719211714,
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

---[FILE: message_with_channel_and_user_mentions.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_channel_and_user_mentions.json

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
    "ts": "1719210664.234089",
    "client_msg_id": "3e66cc71-119b-4576-b9b5-ec6000cd7dc8",
    "text": "<@U074VRHQ11T> <#C06P6T3QGD7|general> message with both channel and user mentions",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "jkPDh",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "user",
                "user_id": "U074VRHQ11T"
              },
              {
                "type": "text",
                "text": " "
              },
              {
                "type": "channel",
                "channel_id": "C06P6T3QGD7"
              },
              {
                "type": "text",
                "text": " message with both channel and user mentions"
              }
            ]
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719210664.234089",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev079B8H59UM",
  "event_time": 1719210664,
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

---[FILE: message_with_channel_mentions.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_channel_mentions.json

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
    "ts": "1719210488.508969",
    "client_msg_id": "f90f528c-a4de-4ddf-8a6c-5315cc17c2d3",
    "text": "<#C06NRA6JLER|zulip-mirror> <#C06P6T3QGD7|general> message with channel mentions",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "bVBDn",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "channel",
                "channel_id": "C06NRA6JLER"
              },
              {
                "type": "text",
                "text": " "
              },
              {
                "type": "channel",
                "channel_id": "C06P6T3QGD7"
              },
              {
                "type": "text",
                "text": " message with channel mentions"
              }
            ]
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719210488.508969",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev079E1Z0DS7",
  "event_time": 1719210488,
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

---[FILE: message_with_code_block.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_code_block.json

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
    "ts": "1719211888.680799",
    "client_msg_id": "452a95ae-9e35-4d84-a4c3-7012c6908f09",
    "text": "```def is_bot_message(payload: WildValue) -&gt; bool:\n    app_api_id = payload.get(\"api_app_id\").tame(check_none_or(check_string))\n    bot_app_id = (\n        payload.get(\"event\", {})\n        .get(\"bot_profile\", {})\n        .get(\"app_id\")\n        .tame(check_none_or(check_string))\n    )\n    return bot_app_id is not None and app_api_id == bot_app_id```",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "293Eu",
        "elements": [
          {
            "type": "rich_text_preformatted",
            "elements": [
              {
                "type": "text",
                "text": "def is_bot_message(payload: WildValue) -> bool:\n    app_api_id = payload.get(\"api_app_id\").tame(check_none_or(check_string))\n    bot_app_id = (\n        payload.get(\"event\", {})\n        .get(\"bot_profile\", {})\n        .get(\"app_id\")\n        .tame(check_none_or(check_string))\n    )\n    return bot_app_id is not None and app_api_id == bot_app_id"
              }
            ],
            "border": 0
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719211888.680799",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev07A31RB0EL",
  "event_time": 1719211888,
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

---[FILE: message_with_complex_formatted_mentions.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_complex_formatted_mentions.json

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
    "ts": "1719211546.331399",
    "client_msg_id": "b763525d-9211-4333-936c-b1c02ff0105e",
    "text": "~_*<@U074VRHQ11T>*_~ ~_*<#C06P6T3QGD7|general>*_~ ~_*<!channel>*_~ ",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "yorkC",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "user",
                "user_id": "U074VRHQ11T",
                "style": {
                  "bold": true,
                  "italic": true,
                  "strike": true
                }
              },
              {
                "type": "text",
                "text": " ",
                "style": {
                  "bold": true,
                  "italic": true,
                  "strike": true
                }
              },
              {
                "type": "channel",
                "channel_id": "C06P6T3QGD7",
                "style": {
                  "bold": true,
                  "italic": true,
                  "strike": true
                }
              },
              {
                "type": "text",
                "text": " ",
                "style": {
                  "bold": true,
                  "italic": true,
                  "strike": true
                }
              },
              {
                "type": "broadcast",
                "range": "channel",
                "style": {
                  "bold": true,
                  "italic": true,
                  "strike": true
                }
              },
              {
                "type": "text",
                "text": " ",
                "style": {
                  "bold": true,
                  "italic": true,
                  "strike": true
                }
              }
            ]
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719211546.331399",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev079E3ZLGNP",
  "event_time": 1719211546,
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

---[FILE: message_with_complex_formatted_texts.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_complex_formatted_texts.json

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
    "ts": "1719211406.531029",
    "client_msg_id": "f9b21f6a-690b-4acb-b04d-d264cd7512a2",
    "text": "this is text messages with overlapping formatting\n_*bold with italic*_\n~*bold with strike through*~\n~_italic with strike through_~\n~_*all three*_~",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "Gx+b7",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "this is text messages with overlapping formatting\n"
              },
              {
                "type": "text",
                "text": "bold with italic",
                "style": {
                  "bold": true,
                  "italic": true
                }
              },
              {
                "type": "text",
                "text": "\n"
              },
              {
                "type": "text",
                "text": "bold with strike through",
                "style": {
                  "bold": true,
                  "strike": true
                }
              },
              {
                "type": "text",
                "text": "\n"
              },
              {
                "type": "text",
                "text": "italic with strike through",
                "style": {
                  "italic": true,
                  "strike": true
                }
              },
              {
                "type": "text",
                "text": "\n"
              },
              {
                "type": "text",
                "text": "all three",
                "style": {
                  "bold": true,
                  "italic": true,
                  "strike": true
                }
              }
            ]
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719211406.531029",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev07A30U5YEL",
  "event_time": 1719211406,
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

---[FILE: message_with_formatted_texts.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_formatted_texts.json

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
    "ts": "1719210450.946059",
    "client_msg_id": "266a366d-5e6d-4293-8e9d-1d3ada3a3c77",
    "text": "*Bold text* _italic text_ ~strikethrough~",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "pQxnY",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "Bold text ",
                "style": {
                  "bold": true
                }
              },
              {
                "type": "text",
                "text": "italic text ",
                "style": {
                  "italic": true
                }
              },
              {
                "type": "text",
                "text": "strikethrough",
                "style": {
                  "strike": true
                }
              }
            ]
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719210450.946059",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev0797G216NS",
  "event_time": 1719210450,
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

---[FILE: message_with_image_files.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_image_files.json

```json
{
  "token": "CqCsBJmXoNSHaNCt3wGWYSEe",
  "team_id": "T06NRA6HM3P",
  "context_team_id": "T06NRA6HM3P",
  "context_enterprise_id": null,
  "api_app_id": "A0757RM31HN",
  "event": {
    "text": "",
    "files": [
      {
        "id": "F079E4173BL",
        "created": 1719209777,
        "timestamp": 1719209777,
        "name": "5e44bcbc-e43c-4a2e-85de-4be126f392f4.jpg",
        "title": "5e44bcbc-e43c-4a2e-85de-4be126f392f4.jpg",
        "mimetype": "image/jpeg",
        "filetype": "jpg",
        "pretty_type": "JPEG",
        "user": "U06NU4E26M9",
        "user_team": "T06NRA6HM3P",
        "editable": false,
        "size": 3036645,
        "mode": "hosted",
        "is_external": false,
        "external_type": "",
        "is_public": true,
        "public_url_shared": false,
        "display_as_bot": false,
        "username": "",
        "url_private": "https://files.slack.com/files-pri/T06NRA6HM3P-F079E4173BL/5e44bcbc-e43c-4a2e-85de-4be126f392f4.jpg",
        "url_private_download": "https://files.slack.com/files-pri/T06NRA6HM3P-F079E4173BL/download/5e44bcbc-e43c-4a2e-85de-4be126f392f4.jpg",
        "media_display_type": "unknown",
        "thumb_64": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079E4173BL-6e091e0261/5e44bcbc-e43c-4a2e-85de-4be126f392f4_64.jpg",
        "thumb_80": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079E4173BL-6e091e0261/5e44bcbc-e43c-4a2e-85de-4be126f392f4_80.jpg",
        "thumb_360": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079E4173BL-6e091e0261/5e44bcbc-e43c-4a2e-85de-4be126f392f4_360.jpg",
        "thumb_360_w": 360,
        "thumb_360_h": 360,
        "thumb_480": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079E4173BL-6e091e0261/5e44bcbc-e43c-4a2e-85de-4be126f392f4_480.jpg",
        "thumb_480_w": 480,
        "thumb_480_h": 480,
        "thumb_160": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079E4173BL-6e091e0261/5e44bcbc-e43c-4a2e-85de-4be126f392f4_160.jpg",
        "thumb_720": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079E4173BL-6e091e0261/5e44bcbc-e43c-4a2e-85de-4be126f392f4_720.jpg",
        "thumb_720_w": 720,
        "thumb_720_h": 720,
        "thumb_800": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079E4173BL-6e091e0261/5e44bcbc-e43c-4a2e-85de-4be126f392f4_800.jpg",
        "thumb_800_w": 800,
        "thumb_800_h": 800,
        "thumb_960": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079E4173BL-6e091e0261/5e44bcbc-e43c-4a2e-85de-4be126f392f4_960.jpg",
        "thumb_960_w": 960,
        "thumb_960_h": 960,
        "thumb_1024": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079E4173BL-6e091e0261/5e44bcbc-e43c-4a2e-85de-4be126f392f4_1024.jpg",
        "thumb_1024_w": 1024,
        "thumb_1024_h": 1024,
        "original_w": 3468,
        "original_h": 3468,
        "thumb_tiny": "AwAwADCzSHgZxmnUhqRkYcYyccnHFOIqIMMkqMYqUHIoAYRTTTzTTQBPUcg6MM5HpT80132igBgyfYd+MUwEqcADj0pcqM54JHIppfI9e3WmBLkdqaaSMnacjFBpAS5ozTc0ZoARk3HO7FN2gDHUfyp2aQmgAz2700mgmmk0Af/Z",
        "permalink": "https://ds-py62195.slack.com/files/U06NU4E26M9/F079E4173BL/5e44bcbc-e43c-4a2e-85de-4be126f392f4.jpg",
        "permalink_public": "https://slack-files.com/T06NRA6HM3P-F079E4173BL-b1d2ae27be",
        "has_rich_preview": false,
        "file_access": "visible"
      },
      {
        "id": "F079GJ49X4L",
        "created": 1719209792,
        "timestamp": 1719209792,
        "name": "notif_bot.png",
        "title": "notif_bot.png",
        "mimetype": "image/png",
        "filetype": "png",
        "pretty_type": "PNG",
        "user": "U06NU4E26M9",
        "user_team": "T06NRA6HM3P",
        "editable": false,
        "size": 45054,
        "mode": "hosted",
        "is_external": false,
        "external_type": "",
        "is_public": true,
        "public_url_shared": false,
        "display_as_bot": false,
        "username": "",
        "url_private": "https://files.slack.com/files-pri/T06NRA6HM3P-F079GJ49X4L/notif_bot.png",
        "url_private_download": "https://files.slack.com/files-pri/T06NRA6HM3P-F079GJ49X4L/download/notif_bot.png",
        "media_display_type": "unknown",
        "thumb_64": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079GJ49X4L-5f45c24098/notif_bot_64.png",
        "thumb_80": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079GJ49X4L-5f45c24098/notif_bot_80.png",
        "thumb_360": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079GJ49X4L-5f45c24098/notif_bot_360.png",
        "thumb_360_w": 360,
        "thumb_360_h": 360,
        "thumb_480": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079GJ49X4L-5f45c24098/notif_bot_480.png",
        "thumb_480_w": 480,
        "thumb_480_h": 480,
        "thumb_160": "https://files.slack.com/files-tmb/T06NRA6HM3P-F079GJ49X4L-5f45c24098/notif_bot_160.png",
        "original_w": 500,
        "original_h": 500,
        "thumb_tiny": "AwAwADBbKzia3V5F3M3PParH2O3/AOeS0WX/AB5xfSnC4Q3DQYO4DPtSEN+x2/8AzyWj7Hb/APPJanqOd/KhdxjIHGfWgBn2O3/55LVe9s4lt2eNdrLzx3q3AZDEpmAD9wKZe/8AHnL9KAEtGCWMbMcALkmmSs8wDRQSb1OVcgD/ACKZ/wAwlT6AH9auTb/JcxffxxQMi3XLdIUX/ef/AApssVxIo8ySJFBB4BP86fbb8vnzNnG3zOvvS3ELSMjKqPtyNr9Oe9ADJBPChlMokC8lSgGRReHNlIR0K091EVkUkbgIQSfpUU2f7MO7g+WM/pQIW1UPYIjdGXBpwW5UBRLGQOASpzVeyvIlt1SRtrLxz3qx9st/+eq0AMk85MbrhyWOAsaDJpERXfa73IYjIDnGfyoe6gNxCwkXC7sn8KJLqA3MTCVcBWyfyoGSrawqwbZkjuxJpL3/AI85fpR9st/+eq1XvbyJrdkjbczccdqBH//Z",
        "permalink": "https://ds-py62195.slack.com/files/U06NU4E26M9/F079GJ49X4L/notif_bot.png",
        "permalink_public": "https://slack-files.com/T06NRA6HM3P-F079GJ49X4L-b7e63652ec",
        "has_rich_preview": false,
        "file_access": "visible"
      },
      {
        "id": "F07A2TA6PPS",
        "created": 1719209799,
        "timestamp": 1719209799,
        "name": "books.jpg",
        "title": "books.jpg",
        "mimetype": "image/jpeg",
        "filetype": "jpg",
        "pretty_type": "JPEG",
        "user": "U06NU4E26M9",
        "user_team": "T06NRA6HM3P",
        "editable": false,
        "size": 1406170,
        "mode": "hosted",
        "is_external": false,
        "external_type": "",
        "is_public": true,
        "public_url_shared": false,
        "display_as_bot": false,
        "username": "",
        "url_private": "https://files.slack.com/files-pri/T06NRA6HM3P-F07A2TA6PPS/books.jpg",
        "url_private_download": "https://files.slack.com/files-pri/T06NRA6HM3P-F07A2TA6PPS/download/books.jpg",
        "media_display_type": "unknown",
        "thumb_64": "https://files.slack.com/files-tmb/T06NRA6HM3P-F07A2TA6PPS-b8f86f8918/books_64.jpg",
        "thumb_80": "https://files.slack.com/files-tmb/T06NRA6HM3P-F07A2TA6PPS-b8f86f8918/books_80.jpg",
        "thumb_360": "https://files.slack.com/files-tmb/T06NRA6HM3P-F07A2TA6PPS-b8f86f8918/books_360.jpg",
        "thumb_360_w": 360,
        "thumb_360_h": 162,
        "thumb_480": "https://files.slack.com/files-tmb/T06NRA6HM3P-F07A2TA6PPS-b8f86f8918/books_480.jpg",
        "thumb_480_w": 480,
        "thumb_480_h": 216,
        "thumb_160": "https://files.slack.com/files-tmb/T06NRA6HM3P-F07A2TA6PPS-b8f86f8918/books_160.jpg",
        "thumb_720": "https://files.slack.com/files-tmb/T06NRA6HM3P-F07A2TA6PPS-b8f86f8918/books_720.jpg",
        "thumb_720_w": 720,
        "thumb_720_h": 324,
        "thumb_800": "https://files.slack.com/files-tmb/T06NRA6HM3P-F07A2TA6PPS-b8f86f8918/books_800.jpg",
        "thumb_800_w": 800,
        "thumb_800_h": 360,
        "thumb_960": "https://files.slack.com/files-tmb/T06NRA6HM3P-F07A2TA6PPS-b8f86f8918/books_960.jpg",
        "thumb_960_w": 960,
        "thumb_960_h": 432,
        "thumb_1024": "https://files.slack.com/files-tmb/T06NRA6HM3P-F07A2TA6PPS-b8f86f8918/books_1024.jpg",
        "thumb_1024_w": 1024,
        "thumb_1024_h": 461,
        "original_w": 4624,
        "original_h": 2080,
        "thumb_tiny": "AwAVADCikrg8HP1rVWBD16/WsuAFpkBHGa0w5z96kA2aCMnByMdCDzVaW2JJkeQuT0yKtSZZs55FROCsBBOeaBlRwwByRj2qvVmQnb9fSoIxk80IGhYpDE+4DNTi8P8Ac/WqtA60xFhrpy2RgUxriRlIJGD7VGetJQAu4+tKn3qbTk+9QB//2Q==",
        "permalink": "https://ds-py62195.slack.com/files/U06NU4E26M9/F07A2TA6PPS/books.jpg",
        "permalink_public": "https://slack-files.com/T06NRA6HM3P-F07A2TA6PPS-44b4516dd5",
        "has_rich_preview": false,
        "file_access": "visible"
      }
    ],
    "upload": false,
    "user": "U06NU4E26M9",
    "type": "message",
    "ts": "1719209815.105159",
    "client_msg_id": "15117486-b4e1-42a9-a553-ca2886d94222",
    "channel": "C06NRA6JLER",
    "subtype": "file_share",
    "event_ts": "1719209815.105159",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev079GJ5KG5A",
  "event_time": 1719209815,
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

---[FILE: message_with_inline_code.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_inline_code.json

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
    "ts": "1719211825.087659",
    "client_msg_id": "ad34b81a-017a-4468-9dfe-6ec77aeb936b",
    "text": "`asdasda this is a code block`",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "DkA3r",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "asdasda this is a code block",
                "style": {
                  "code": true
                }
              }
            ]
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719211825.087659",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev078ZLS9GNT",
  "event_time": 1719211825,
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

---[FILE: message_with_normal_text.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_normal_text.json

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
      "ts": "1719209506.817929",
      "client_msg_id": "7cc3cc17-2fed-4356-b3c2-48106ab3a209",
      "text": "Hello, this is a normal text message",
      "team": "T06NRA6HM3P",
      "blocks": [
        {
          "type": "rich_text",
          "block_id": "Xh7lJ",
          "elements": [
            {
              "type": "rich_text_section",
              "elements": [
                {
                  "type": "text",
                  "text": "Hello, this is a normal text message"
                }
              ]
            }
          ]
        }
      ],
      "channel": "C06NRA6JLER",
      "event_ts": "1719209506.817929",
      "channel_type": "channel"
    },
    "type": "event_callback",
    "event_id": "Ev079SP4TP1P",
    "event_time": 1719209506,
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

---[FILE: message_with_ordered_list.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_ordered_list.json

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
    "ts": "1719211791.356739",
    "client_msg_id": "a0d2e7ba-c057-45df-b59a-d4e38f4ac055",
    "text": "1. point one\n2. point two\n3. mix both\n4. pour water\n5. etc",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "G+/T6",
        "elements": [
          {
            "type": "rich_text_list",
            "elements": [
              {
                "type": "rich_text_section",
                "elements": [
                  {
                    "type": "text",
                    "text": "point one"
                  }
                ]
              },
              {
                "type": "rich_text_section",
                "elements": [
                  {
                    "type": "text",
                    "text": "point two"
                  }
                ]
              },
              {
                "type": "rich_text_section",
                "elements": [
                  {
                    "type": "text",
                    "text": "mix both"
                  }
                ]
              },
              {
                "type": "rich_text_section",
                "elements": [
                  {
                    "type": "text",
                    "text": "pour water"
                  }
                ]
              },
              {
                "type": "rich_text_section",
                "elements": [
                  {
                    "type": "text",
                    "text": "etc"
                  }
                ]
              }
            ],
            "style": "ordered",
            "indent": 0,
            "border": 0
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719211791.356739",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev079STB112M",
  "event_time": 1719211791,
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

---[FILE: message_with_quote_block.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_quote_block.json

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
    "ts": "1719211959.210699",
    "client_msg_id": "116749a6-f2e2-4f99-96cb-fcef3300d1a1",
    "text": "&gt; This is a quote",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "k3QzB",
        "elements": [
          {
            "type": "rich_text_quote",
            "elements": [
              {
                "type": "text",
                "text": "This is a quote"
              }
            ]
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719211959.210699",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev079GN4DWNQ",
  "event_time": 1719211959,
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

---[FILE: message_with_user_mentions.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_with_user_mentions.json

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
    "ts": "1719209649.631399",
    "client_msg_id": "ec2b7c8f-8530-43cc-9287-9f7617d5d335",
    "text": "<@U074VRHQ11T> <@U074G5E1ANR> <@U06NU4E26M9> hello, this is a message with mentions",
    "team": "T06NRA6HM3P",
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "UST8x",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "user",
                "user_id": "U074VRHQ11T"
              },
              {
                "type": "text",
                "text": " "
              },
              {
                "type": "user",
                "user_id": "U074G5E1ANR"
              },
              {
                "type": "text",
                "text": " "
              },
              {
                "type": "user",
                "user_id": "U06NU4E26M9"
              },
              {
                "type": "text",
                "text": " hello, this is a message with mentions"
              }
            ]
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1719209649.631399",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev079B6N3H53",
  "event_time": 1719209649,
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

````
