---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1077
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1077 of 1290)

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

---[FILE: message_link_test_cases.json]---
Location: zulip-main/zerver/tests/fixtures/message_link_test_cases.json

```json
[
    {
        "name": "dm_message_link",
        "message_link": "#narrow/dm/9,15-dm/near/43",
        "expected_output": true
    },
    {
        "name": "group_message_link",
        "message_link": "#narrow/dm/9,16,15-group/near/68",
        "expected_output": true
    },
    {
        "name": "stream_message_link",
        "message_link": "#narrow/channel/8-design/topic/desktop/near/82",
        "expected_output": true
    },
    {
        "name": "stream_link",
        "message_link": "#narrow/channel/8-design",
        "expected_output": false
    },
    {
        "name": "topic_link",
        "message_link": "#narrow/channel/8-design/topic/desktop",
        "expected_output": false
    },
    {
        "name": "dm_link",
        "message_link": "#narrow/dm/15-John",
        "expected_output": false
    },
    {
        "name": "search_link",
        "message_link": "#narrow/search/database",
        "expected_output": false
    },
    {
        "name": "different_server_message_link",
        "message_link": "https://fakechat.zulip.org/#narrow/dm/8,1848,2369-group/near/1717378",
        "expected_output": false
    },
    {
        "name": "drafts_link",
        "message_link": "#drafts",
        "expected_output": false
    },
    {
        "name": "empty_link",
        "message_link": "#",
        "expected_output": false
    },
    {
        "name": "non_zulip_link",
        "message_link": "https://www.google.com",
        "expected_output": false
    }
]
```

--------------------------------------------------------------------------------

---[FILE: narrow_url_to_narrow_terms.json]---
Location: zulip-main/zerver/tests/fixtures/narrow_url_to_narrow_terms.json

```json

[
    {
        "name": "channel_link",
        "near_link": "http://testserver/#narrow/channel/13-Denmark",
        "expected_output": [
            {
                "operator": "channel",
                "operand": 13,
                "negated": false
            }
        ]
    },
    {
        "name": "topic_link",
        "near_link": "http://testserver/#narrow/channel/13-Denmark/topic/desktop",
        "expected_output": [
            {
                "operator": "channel",
                "operand": 13,
                "negated": false
            },
            {
                "operator": "topic",
                "operand": "desktop",
                "negated": false
            }
        ]
    },
    {
        "name": "decoded_topic_link",
        "near_link": "http://testserver/#narrow/channel/13-Denmark/topic/Broken.20Inline.20giphy.20preview.20.2F.20Messed.20up.20with.20camo",
        "expected_output": [
            {
                "operator": "channel",
                "operand": 13,
                "negated": false
            },
            {
                "operator": "topic",
                "operand": "Broken Inline giphy preview / Messed up with camo",
                "negated": false
            }
        ]
    },
    {
        "name": "missing_topic_operand",
        "near_link": "http://testserver/#narrow/channel/13-Denmark/topic",
        "expected_output": [
            {
                "operator": "channel",
                "operand": 13,
                "negated": false
            },
            {
                "operator": "topic",
                "operand": "",
                "negated": false
            }
        ]
    },
    {
        "name": "channel_message_link",
        "near_link": "http://testserver/#narrow/channel/13-Denmark/topic/desktop/near/555",
        "expected_output": [
            {
                "operator": "channel",
                "operand": 13,
                "negated": false
            },
            {
                "operator": "topic",
                "operand": "desktop",
                "negated": false
            },
            {
                "operator": "near",
                "operand": 555,
                "negated": false
            }
        ]
    },
    {
        "name": "dm_link",
        "near_link": "http://testserver/#narrow/dm/95-Calcifer",
        "expected_output": [
            {
                "operator": "dm",
                "operand": 95,
                "negated": false
            }
        ]
    },
    {
        "name": "near_dm_link",
        "near_link": "http://testserver/#narrow/dm/15-John/near/19",
        "expected_output": [
            {
                "operator": "dm",
                "operand": 15,
                "negated": false
            },
            {
                "operator": "near",
                "operand": 19,
                "negated": false
            }
        ]
    },
    {
        "name": "gdm_link",
        "near_link": "http://testserver/#narrow/dm/15,12,13-group",
        "expected_output": [
            {
                "operator": "dm",
                "operand": [15,12,13],
                "negated": false
            }
        ]
    },
    {
        "name": "near_gdm_link",
        "near_link": "http://testserver/#narrow/dm/15,12,13-group/near/12",
        "expected_output": [
            {
                "operator": "dm",
                "operand": [15,12,13],
                "negated": false
            },
            {
                "operator": "near",
                "operand": 12,
                "negated": false
            }
        ]
    },
    {
        "name": "legacy_channel_synonym",
        "near_link": "http://testserver/#narrow/stream/13-Denmark",
        "expected_output": [
            {
                "operator": "channel",
                "operand": 13,
                "negated": false
            }
        ]
    },
    {
        "name": "hypothetical_negated_link",
        "near_link": "http://testserver/#narrow/-channel/13-Denmark",
        "expected_output": [
            {
                "operator": "channel",
                "operand": 13,
                "negated": true
            }
        ]
    },
    {
        "name": "legacy_channel_slug_unsupported",
        "near_link": "http://testserver/#narrow/channel/test-here",
        "expected_output": null
    },
    {
        "name": "broken_link_no_channel_operand",
        "near_link": "http://testserver/#narrow/channel/%20",
        "expected_output": null
    },
    {
        "name": "broken_link_other_operand",
        "near_link": "http://testserver/#narrow/near/%20",
        "expected_output": null
    },
    {
        "name": "broken_link_no_operator",
        "near_link": "http://testserver/#narrow/%20/test-here",
        "expected_output": null
    },
    {
        "name": "broken_link_invalid_message_operand",
        "near_link": "http://testserver/#narrow/near/13-Denmark",
        "expected_output": null
    }
]
```

--------------------------------------------------------------------------------

---[FILE: slack_message_conversion.json]---
Location: zulip-main/zerver/tests/fixtures/slack_message_conversion.json

```json
{
  "regular_tests": [
    {
      "name": "slack_link1",
      "input": ">Google logo today:\n><https://www.google.com/images/srpr/logo4w.png>\n>Kinda boring",
      "conversion_output": ">Google logo today:\n>https://www.google.com/images/srpr/logo4w.png\n>Kinda boring"
    },
    {
      "name": "slack_link_with_pipe",
      "input": ">Google logo today:\n><https://foo.com|foo>\n>Kinda boring",
      "conversion_output": ">Google logo today:\n>[foo](https://foo.com)\n>Kinda boring"
    },
    {
      "name": "slack_link_with_pipes",
      "input": ">Google logo today:\n><https://foo.com|foo|oof>\n>Kinda boring",
      "conversion_output": ">Google logo today:\n>[foo|oof](https://foo.com)\n>Kinda boring"
    },
    {
      "name": "slack_link2",
      "input": "<http://datausa.io/> this is a good website.",
      "conversion_output": "http://datausa.io/ this is a good website."
    },
    {
      "name": "mailto_format1",
      "input": "email me at <mailto:random@gmail.com|random@gmail.com>",
      "conversion_output": "email me at mailto:random@gmail.com"
    },
    {
      "name": "mailto_format2",
      "input": "email me at <mailto:random@gmail.com>",
      "conversion_output": "email me at mailto:random@gmail.com"
    },
    {
      "name": "valid_strikethrough_test",
      "input": "(~str ike!~, text. ~Also ~)",
      "conversion_output": "(~~str ike!~~, text. ~~Also ~~)"
    },
    {
      "name": "invalid_strikethrough_test",
      "input": "Mid~word~ strike. Also ~~strike~~)",
      "conversion_output": "Mid~word~ strike. Also ~~strike~~)"
    },
    {
      "name": "valid_italic_test",
      "input": "ital ^_lic_, _wo r@d_.",
      "conversion_output": "ital ^*lic*, *wo r@d*."
    },
    {
      "name": "invalid_italic_test",
      "input": "mid_word_, @_italics_",
      "conversion_output": "mid_word_, @_italics_"
    },
    {
      "name": "valid_bold_test",
      "input": "(*text*} and normal :* bold*.",
      "conversion_output": "(**text**} and normal :** bold**."
    },
    {
      "name": "invalid_bold_test",
      "input": "*mid*word **word**",
      "conversion_output": "*mid*word **word**"
    },
    {
      "name": "no_conversion",
      "input": "***word***",
      "conversion_output": "***word***"
    },
    {
      "name": "valid_bold_and_italic_conversion_1",
      "input": "*_test bold and italic message_*",
      "conversion_output": "***test bold and italic message***"
    },
    {
      "name": "valid_bold_and_italic_conversion_2",
      "input": "_*test bold and italic message*_",
      "conversion_output": "***test bold and italic message***"
    },
    {
      "name": "bold_and_strike_conversion",
      "input": "~*bold*~ and *~strike~*.",
      "conversion_output": "~~**bold**~~ and **~~strike~~**."
    },
    {
      "name": "italic_and_strike_conversion",
      "input": "_~italic~_ and ~_strike_~",
      "conversion_output": "*~~italic~~* and ~~*strike*~~"
    },
    {
      "name": "unicode_quotes",
      "input": "«~strike~» 「*bold*」 ❰_italic_❱",
      "conversion_output": "«~~strike~~» 「**bold**」 ❰*italic*❱"
    },
    {
      "name": "new_line_test",
      "input": "\n*abc*\n_helo_\n~stike~\n",
      "conversion_output": "\n**abc**\n*helo*\n~~stike~~\n"
    },
    {
      "name": "zero_width_identical_bold_matches_test",
      "input": "*foo*\n*foo*\n*foo*",
      "conversion_output": "**foo**\n**foo**\n**foo**"
    },
    {
      "name": "format_emoji_test",
      "input": "*1️⃣ bold* some _1️⃣ italic_ word ~1️⃣ strike~",
      "conversion_output": "**1️⃣ bold** some *1️⃣ italic* word ~~1️⃣ strike~~"
    },
    {
      "name": "overlapping_capture_group_test",
      "input": "*foo* *baz* *bar*",
      "conversion_output": "**foo** **baz** **bar**"
    }
  ]
}
```

--------------------------------------------------------------------------------

````
