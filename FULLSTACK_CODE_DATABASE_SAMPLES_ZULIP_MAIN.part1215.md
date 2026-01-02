---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1215
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1215 of 1290)

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

---[FILE: user_email_updated.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/user_email_updated.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "contact",
            "id": "5c96b122177026171b401e20",
            "user_id": "8f9ef493-c5f9-4817-895d-874c3704ea49",
            "anonymous": true,
            "email": "aaron@zulip.com",
            "phone": null,
            "name": null,
            "pseudonym": "Azure Bus from St. John's",
            "avatar": {
                "type": "avatar",
                "image_url": "https://static.intercomassets.com/app/pseudonym_avatars_2019/azure-bus.png"
            },
            "app_id": "i6wc9ipe",
            "companies": {
                "type": "company.list",
                "companies": []
            },
            "location_data": {
                "type": "location_data",
                "city_name": "St. John's",
                "continent_code": "NA",
                "country_name": "Canada",
                "postal_code": "A1B",
                "region_name": "Newfoundland and Labrador",
                "timezone": "America/St_Johns",
                "country_code": "CAN",
                "latitude": null,
                "longitude": null
            },
            "last_request_at": "2019-03-23T22:20:52.453+00:00",
            "created_at": "2019-03-23T22:20:18.253+00:00",
            "remote_created_at": null,
            "signed_up_at": null,
            "updated_at": "2019-03-23T22:20:59.490+00:00",
            "session_count": 0,
            "social_profiles": {
                "type": "social_profile.list",
                "social_profiles": []
            },
            "unsubscribed_from_emails": false,
            "marked_email_as_spam": false,
            "has_hard_bounced": false,
            "tags": {
                "type": "tag.list",
                "tags": []
            },
            "segments": {
                "type": "segment.list",
                "segments": []
            },
            "custom_attributes": {},
            "referrer": null,
            "utm_campaign": null,
            "utm_content": null,
            "utm_medium": null,
            "utm_source": null,
            "utm_term": null,
            "do_not_track": null,
            "last_seen_ip": null,
            "user_agent_data": null
        }
    },
    "links": {},
    "id": "notif_687f7dfc-afd2-48ce-b31a-7a087d2ebf71",
    "topic": "user.email.updated",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553379706,
    "created_at": 1553379706,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: user_tag_created.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/user_tag_created.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "user_tag",
            "user": {
                "type": "user",
                "id": "5c9aabdf2ddf20549a41453a",
                "user_id": "12",
                "anonymous": false,
                "email": "jerryguitarist@gmail.com",
                "phone": null,
                "name": "eeshangarg",
                "pseudonym": null,
                "avatar": {
                    "type": "avatar",
                    "image_url": "https://img.fullcontact.com/static/85ce413bcdac4cec3cfdb3a8da530f8b_8a853b478c3122d7e4ec9e14f81d9a3d9ea9da198d85c1985efc2403fa6bdb0c"
                },
                "app_id": "i6wc9ipe",
                "companies": {
                    "type": "company.list",
                    "companies": []
                },
                "location_data": {},
                "last_request_at": null,
                "created_at": "2019-03-26T22:46:55.851+00:00",
                "remote_created_at": "2019-03-03T00:00:00.000+00:00",
                "signed_up_at": "2019-03-03T00:00:00.000+00:00",
                "updated_at": "2019-03-26T22:46:56.045+00:00",
                "session_count": 0,
                "social_profiles": {
                    "type": "social_profile.list",
                    "social_profiles": [
                        {
                            "type": "social_profile",
                            "name": "github",
                            "id": null,
                            "username": "eeshangarg",
                            "url": "https://github.com/eeshangarg"
                        }
                    ]
                },
                "unsubscribed_from_emails": false,
                "marked_email_as_spam": false,
                "has_hard_bounced": false,
                "tags": {
                    "type": "tag.list",
                    "tags": [
                        {
                            "type": "tag",
                            "id": "2525085"
                        }
                    ]
                },
                "segments": {
                    "type": "segment.list",
                    "segments": []
                },
                "custom_attributes": {},
                "referrer": null,
                "utm_campaign": null,
                "utm_content": null,
                "utm_medium": null,
                "utm_source": null,
                "utm_term": null,
                "do_not_track": null,
                "last_seen_ip": null,
                "user_agent_data": null
            },
            "tag": {
                "type": "tag",
                "id": "2525085",
                "name": "developer"
            },
            "created_at": 1553640416,
            "admin": {
                "type": "admin"
            }
        }
    },
    "links": {},
    "id": "notif_800ae4f0-e326-41e7-a4e9-c4e7a97d45f4",
    "topic": "user.tag.created",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553640416,
    "created_at": 1553640416,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: user_tag_deleted.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/user_tag_deleted.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "user_tag",
            "user": {
                "type": "user",
                "id": "5c9aabdf2ddf20549a41453a",
                "user_id": "12",
                "anonymous": false,
                "email": "jerryguitarist@gmail.com",
                "phone": null,
                "name": "eeshangarg",
                "pseudonym": null,
                "avatar": {
                    "type": "avatar",
                    "image_url": "https://img.fullcontact.com/static/85ce413bcdac4cec3cfdb3a8da530f8b_8a853b478c3122d7e4ec9e14f81d9a3d9ea9da198d85c1985efc2403fa6bdb0c"
                },
                "app_id": "i6wc9ipe",
                "companies": {
                    "type": "company.list",
                    "companies": []
                },
                "location_data": {},
                "last_request_at": null,
                "created_at": "2019-03-26T22:46:55.851+00:00",
                "remote_created_at": "2019-03-03T00:00:00.000+00:00",
                "signed_up_at": "2019-03-03T00:00:00.000+00:00",
                "updated_at": "2019-03-26T22:48:23.743+00:00",
                "session_count": 0,
                "social_profiles": {
                    "type": "social_profile.list",
                    "social_profiles": [
                        {
                            "type": "social_profile",
                            "name": "github",
                            "id": null,
                            "username": "eeshangarg",
                            "url": "https://github.com/eeshangarg"
                        }
                    ]
                },
                "unsubscribed_from_emails": false,
                "marked_email_as_spam": false,
                "has_hard_bounced": false,
                "tags": {
                    "type": "tag.list",
                    "tags": [
                        {
                            "type": "tag",
                            "id": "2525085"
                        }
                    ]
                },
                "segments": {
                    "type": "segment.list",
                    "segments": []
                },
                "custom_attributes": {},
                "referrer": null,
                "utm_campaign": null,
                "utm_content": null,
                "utm_medium": null,
                "utm_source": null,
                "utm_term": null,
                "do_not_track": null,
                "last_seen_ip": null,
                "user_agent_data": null
            },
            "tag": {
                "type": "tag",
                "id": "2535149",
                "name": "CSV Import - 2019-03-26 22:46:04 UTC"
            },
            "created_at": 1553640503,
            "admin": {
                "type": "admin"
            }
        }
    },
    "links": {},
    "id": "notif_89864fe7-ef26-4b32-b410-160871aa7fb9",
    "topic": "user.tag.deleted",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553640503,
    "created_at": 1553640503,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: user_unsubscribed.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/user_unsubscribed.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "contact",
            "id": "5c96b122177026171b401e20",
            "user_id": "8f9ef493-c5f9-4817-895d-874c3704ea49",
            "anonymous": true,
            "email": "jerryguitarist@gmail.com",
            "phone": "+17982347588",
            "name": "Eeshan Garg",
            "pseudonym": "Azure Bus from St. John's",
            "avatar": {
                "type": "avatar",
                "image_url": "https://img.fullcontact.com/static/85ce413bcdac4cec3cfdb3a8da530f8b_8a853b478c3122d7e4ec9e14f81d9a3d9ea9da198d85c1985efc2403fa6bdb0c"
            },
            "app_id": "i6wc9ipe",
            "companies": {
                "type": "company.list",
                "companies": [
                    {
                        "type": "company",
                        "company_id": "5c96b2c0d1c4c1a2d455b936-qualification-company",
                        "id": "5c96b2c0d1c4c1a2d455b937",
                        "name": "Kandra Labs"
                    }
                ]
            },
            "location_data": {
                "type": "location_data",
                "city_name": "St. John's",
                "continent_code": "NA",
                "country_name": "Canada",
                "postal_code": "A1B",
                "region_name": "Newfoundland and Labrador",
                "timezone": "America/St_Johns",
                "country_code": "CAN",
                "latitude": null,
                "longitude": null
            },
            "last_request_at": "2019-03-23T22:20:52.453+00:00",
            "created_at": "2019-03-23T22:20:18.253+00:00",
            "remote_created_at": null,
            "signed_up_at": null,
            "updated_at": "2019-03-23T22:28:55.055+00:00",
            "session_count": 0,
            "social_profiles": {
                "type": "social_profile.list",
                "social_profiles": [
                    {
                        "type": "social_profile",
                        "name": "github",
                        "id": null,
                        "username": "eeshangarg",
                        "url": "https://github.com/eeshangarg"
                    }
                ]
            },
            "unsubscribed_from_emails": true,
            "marked_email_as_spam": false,
            "has_hard_bounced": false,
            "tags": {
                "type": "tag.list",
                "tags": []
            },
            "segments": {
                "type": "segment.list",
                "segments": []
            },
            "custom_attributes": {},
            "referrer": null,
            "utm_campaign": null,
            "utm_content": null,
            "utm_medium": null,
            "utm_source": null,
            "utm_term": null,
            "do_not_track": null,
            "last_seen_ip": null,
            "user_agent_data": null
        }
    },
    "links": {},
    "id": "notif_71d6309c-0655-4793-86e5-19141d36642b",
    "topic": "user.unsubscribed",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553380135,
    "created_at": 1553380135,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: jira-doc.md]---
Location: zulip-main/zerver/webhooks/jira/jira-doc.md

```text
# Zulip Jira integration

Get Zulip notifications for your Jira projects!

!!! warn ""

      **Note**: These instructions apply to Atlassian Cloud's hosted Jira, and Jira
      Server versions 5.2 or greater. For older versions, you'll need our
      [Jira plugin](./jira-plugin).

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Jira **Site administration** page. Click on the menu icon
   ( <i class="fa fa-ellipsis-h"></i> ) under **Actions** for your
   **Jira** product, and select **Jira settings**. In the left sidebar,
   scroll down, and under **Advanced**, click **WebHooks**. Click
   **+ Create a WebHook**.

1. Set **Name** to a name of your choice, such as `Zulip`. Set
   **Status** to **Enabled**, and set **URL** to the URL generated
   above. Select the [events](#filtering-incoming-events) you'd like
   to be notified about, and click **Create**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/jira/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

- [Jira's webhook guide](https://developer.atlassian.com/server/jira/platform/webhooks/)

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/jira/tests.py

```python
from unittest.mock import patch
from urllib.parse import quote, unquote

from zerver.lib.test_classes import WebhookTestCase


class JiraHookTests(WebhookTestCase):
    CHANNEL_NAME = "jira"
    URL_TEMPLATE = "/api/v1/external/jira?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "jira"

    def test_custom_channel(self) -> None:
        api_key = self.test_user.api_key
        self.subscribe(self.test_user, "jira_custom")
        url = f"/api/v1/external/jira?api_key={api_key}&stream=jira_custom"
        msg = self.send_webhook_payload(
            self.test_user,
            url,
            self.get_body("created_v2"),
            content_type="application/json",
        )
        expected_content = """
Leo Franchi created [BUG-15: New bug with hook](http://lfranchi.com:8080/browse/BUG-15):

* **Priority**: Major
* **Assignee**: no one
""".strip()
        self.assert_channel_message(
            message=msg,
            channel_name="jira_custom",
            topic_name="BUG-15: New bug with hook",
            content=expected_content,
        )

    def test_created(self) -> None:
        expected_topic_name = "BUG-15: New bug with hook"
        expected_message = """
Leo Franchi created [BUG-15: New bug with hook](http://lfranchi.com:8080/browse/BUG-15):

* **Priority**: Major
* **Assignee**: no one
""".strip()
        self.check_webhook("created_v1", expected_topic_name, expected_message)
        self.check_webhook("created_v2", expected_topic_name, expected_message)

    def test_ignored_events(self) -> None:
        ignored_actions = [
            "attachment_created",
            "issuelink_created",
            "issuelink_deleted",
            "jira:version_released",
            "jira:worklog_updated",
            "sprint_closed",
            "sprint_started",
            "worklog_created",
            "worklog_updated",
        ]
        for action in ignored_actions:
            url = self.build_webhook_url()
            payload = dict(webhookEvent=action)
            with patch("zerver.webhooks.jira.view.check_send_webhook_message") as m:
                result = self.client_post(url, payload, content_type="application/json")
            self.assertFalse(m.called)
            self.assert_json_success(result)

    def test_created_with_channel_with_spaces_escaped(self) -> None:
        self.CHANNEL_NAME = quote("jira alerts")
        self.url = self.build_webhook_url()
        self.subscribe(self.test_user, unquote(self.CHANNEL_NAME))

        payload = self.get_body("created_v1")
        result = self.client_post(self.url, payload, content_type="application/json")

        self.assert_json_success(result)

        expected_topic_name = "BUG-15: New bug with hook"
        expected_message = """
Leo Franchi created [BUG-15: New bug with hook](http://lfranchi.com:8080/browse/BUG-15):

* **Priority**: Major
* **Assignee**: no one
""".strip()
        msg = self.get_last_message()
        self.assertEqual(msg.content, expected_message)
        self.assertEqual(msg.topic_name(), expected_topic_name)

    def test_created_with_channel_with_spaces_double_escaped(self) -> None:
        self.CHANNEL_NAME = quote(quote("jira alerts"))
        self.url = self.build_webhook_url()
        self.subscribe(self.test_user, unquote(unquote(self.CHANNEL_NAME)))

        payload = self.get_body("created_v1")
        result = self.client_post(self.url, payload, content_type="application/json")

        self.assert_json_success(result)

        expected_topic_name = "BUG-15: New bug with hook"
        expected_message = """
Leo Franchi created [BUG-15: New bug with hook](http://lfranchi.com:8080/browse/BUG-15):

* **Priority**: Major
* **Assignee**: no one
""".strip()
        msg = self.get_last_message()
        self.assertEqual(msg.content, expected_message)
        self.assertEqual(msg.topic_name(), expected_topic_name)

    def test_created_with_topic_with_spaces_double_escaped(self) -> None:
        self.url = self.build_webhook_url(topic=quote(quote("alerts test")))
        expected_topic_name = "alerts test"
        expected_message = """
Leo Franchi created [BUG-15: New bug with hook](http://lfranchi.com:8080/browse/BUG-15):

* **Priority**: Major
* **Assignee**: no one
""".strip()
        self.check_webhook("created_v1", expected_topic_name, expected_message)

    def test_created_with_unicode(self) -> None:
        expected_topic_name = "BUG-15: New bug with à hook"
        expected_message = """
Leo Franchià created [BUG-15: New bug with à hook](http://lfranchi.com:8080/browse/BUG-15):

* **Priority**: Major
* **Assignee**: no one
""".strip()
        self.check_webhook("created_with_unicode_v1", expected_topic_name, expected_message)
        self.check_webhook("created_with_unicode_v2", expected_topic_name, expected_message)

    def test_created_assignee(self) -> None:
        expected_topic_name = "TEST-4: Test Created Assignee"
        expected_message = """
Leonardo Franchi [Administrator] created [TEST-4: Test Created Assignee](https://zulipp.atlassian.net/browse/TEST-4):

* **Priority**: Major
* **Assignee**: Leonardo Franchi [Administrator]
""".strip()
        self.check_webhook("created_assignee_v1", expected_topic_name, expected_message)
        self.check_webhook("created_assignee_v2", expected_topic_name, expected_message)

    def test_commented(self) -> None:
        expected_topic_name = "BUG-15: New bug with hook"
        expected_message = """
Leo Franchi commented on [BUG-15: New bug with hook](http://lfranchi.com:8080/browse/BUG-15) (assigned to **Othello, the Moor of Venice**):

``` quote
Adding a comment. Oh, what a comment it is!
```
""".strip()
        self.check_webhook("commented_v1", expected_topic_name, expected_message)
        self.check_webhook("commented_v2", expected_topic_name, expected_message)

    def test_commented_with_two_full_links(self) -> None:
        expected_topic_name = "BUG-15: New bug with hook"
        expected_message = """
Leo Franchi commented on [BUG-15: New bug with hook](http://lfranchi.com:8080/browse/BUG-15) (assigned to **Othello, the Moor of Venice**):

``` quote
This is the [first link](https://google.com) and this is the [second link](https://google.com) and this is the end.
```
""".strip()
        self.check_webhook(
            "commented_v2_with_two_full_links", expected_topic_name, expected_message
        )

    def test_comment_edited(self) -> None:
        expected_topic_name = "BUG-15: New bug with hook"
        expected_message = """
Leo Franchi edited a comment on [BUG-15: New bug with hook](http://lfranchi.com:8080/browse/BUG-15) (assigned to **Othello, the Moor of Venice**):

``` quote
Adding a comment. Oh, what a comment it is!
```
""".strip()
        self.check_webhook("comment_edited_v2", expected_topic_name, expected_message)

    def test_comment_deleted(self) -> None:
        expected_topic_name = "TOM-1: New Issue"
        expected_message = "Tomasz Kolek deleted a comment from [TOM-1: New Issue](https://zuliptomek.atlassian.net/browse/TOM-1) (assigned to **kolaszek@go2.pl**)."
        self.check_webhook("comment_deleted_v2", expected_topic_name, expected_message)

    def test_commented_markup(self) -> None:
        expected_topic_name = "TEST-7: Testing of rich text"
        expected_message = """Leonardo Franchi [Administrator] commented on [TEST-7: Testing of rich text](https://zulipp.atlassian.net/browse/TEST-7):\n\n``` quote\nThis is a comment that likes to **exercise** a lot of _different_ `conventions` that `jira uses`.\r\n\r\n~~~\n\r\nthis code is not highlighted, but monospaced\r\n\n~~~\r\n\r\n~~~\n\r\ndef python():\r\n    print "likes to be formatted"\r\n\n~~~\r\n\r\n[http://www.google.com](http://www.google.com) is a bare link, and [Google](http://www.google.com) is given a title.\r\n\r\nThanks!\r\n\r\n~~~ quote\n\r\nSomeone said somewhere\r\n\n~~~\n```"""

        self.check_webhook("commented_markup_v1", expected_topic_name, expected_message)
        self.check_webhook("commented_markup_v2", expected_topic_name, expected_message)

    def test_deleted(self) -> None:
        expected_topic_name = "BUG-15: New bug with hook"
        expected_message = "Leo Franchi deleted [BUG-15: New bug with hook](http://lfranchi.com:8080/browse/BUG-15)."
        self.check_webhook("deleted_v1", expected_topic_name, expected_message)
        self.check_webhook("deleted_v2", expected_topic_name, expected_message)

    def test_reassigned(self) -> None:
        expected_topic_name = "BUG-15: New bug with hook"
        expected_message = """Leo Franchi updated [BUG-15: New bug with hook](http://lfranchi.com:8080/browse/BUG-15) (assigned to **Othello, the Moor of Venice**):

* Changed assignee to **Othello, the Moor of Venice**"""
        self.check_webhook("reassigned_v1", expected_topic_name, expected_message)
        self.check_webhook("reassigned_v2", expected_topic_name, expected_message)

    def test_priority_updated(self) -> None:
        expected_topic_name = "TEST-1: Fix That"
        expected_message = """Leonardo Franchi [Administrator] updated [TEST-1: Fix That](https://zulipp.atlassian.net/browse/TEST-1) (assigned to **leo@zulip.com**):

* Changed priority from **Critical** to **Major**"""
        self.check_webhook("updated_priority_v1", expected_topic_name, expected_message)
        self.check_webhook("updated_priority_v2", expected_topic_name, expected_message)

    def test_status_changed(self) -> None:
        expected_topic_name = "TEST-1: Fix That"
        expected_message = """Leonardo Franchi [Administrator] updated [TEST-1: Fix That](https://zulipp.atlassian.net/browse/TEST-1):

* Changed status from **To Do** to **In Progress**"""
        self.check_webhook("change_status_v1", expected_topic_name, expected_message)
        self.check_webhook("change_status_v2", expected_topic_name, expected_message)

    def test_comment_event_comment_created(self) -> None:
        expected_topic_name = "SP-1: Add support for newer format Jira issue comment events"
        expected_message = """Hemanth V. Alluri commented on [SP-1: Add support for newer format Jira issue comment events](https://f20171170.atlassian.net/browse/SP-1)\n``` quote\nSounds like it’s pretty important. I’ll get this fixed ASAP!\n```"""
        self.check_webhook("comment_created", expected_topic_name, expected_message)

    def test_comment_event_comment_created_no_issue_details(self) -> None:
        expected_topic_name = "10000: Upgrade Jira to get the issue title here."
        expected_message = """Hemanth V. Alluri commented on 10000: Upgrade Jira to get the issue title here.\n``` quote\nSounds like it’s pretty important. I’ll get this fixed ASAP!\n```"""
        self.check_webhook(
            "comment_created_no_issue_details", expected_topic_name, expected_message
        )

    def test_comment_event_comment_edited(self) -> None:
        expected_topic_name = "SP-1: Add support for newer format Jira issue comment events"
        expected_message = """Hemanth V. Alluri updated their comment on [SP-1: Add support for newer format Jira issue comment events](https://f20171170.atlassian.net/browse/SP-1)\n``` quote\nThis is a very important issue! I’m on it!\n```"""
        self.check_webhook("comment_updated", expected_topic_name, expected_message)

    def test_comment_event_comment_deleted(self) -> None:
        expected_topic_name = "SP-1: Add support for newer format Jira issue comment events"
        expected_message = """Hemanth V. Alluri deleted their comment on [SP-1: Add support for newer format Jira issue comment events](https://f20171170.atlassian.net/browse/SP-1)\n``` quote\n~~This is a very important issue! I’m on it!~~\n```"""
        self.check_webhook("comment_deleted", expected_topic_name, expected_message)

    def test_anomalous_webhook_payload_error(self) -> None:
        with self.assertRaises(AssertionError) as e:
            self.check_webhook(
                fixture_name="example_anomalous_payload",
                expected_topic="",
                expected_message="",
                expect_noop=True,
            )

        self.assertIn(
            "Unable to parse request: Did Jira generate this event?",
            e.exception.args[0],
        )
```

--------------------------------------------------------------------------------

````
