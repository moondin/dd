---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1267
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1267 of 1290)

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

---[FILE: pull_request.json]---
Location: zulip-main/zerver/webhooks/travis/fixtures/pull_request.json

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
  "type": "pull_request",
  "state": "passed",
  "pull_request": false,
  "pull_request_number": null,
  "pull_request_title": null,
  "tag": null
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/trello/doc.md

```text
# Zulip Trello integration

Get Zulip notifications from your Trello boards!

!!! tip ""

    [Zapier](./zapier) is usually a simpler way to integrate Trello
    with Zulip.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. **Log in to Trello**, and collect the following:

    * **Board ID**: Go to your Trello board. The URL should look like
      `https://trello.com/b/<BOARD_ID>/<BOARD_NAME>`. Note down the
      `<BOARD_ID>`.

    * **API Key**: Go to <https://trello.com/1/appkey/generate>. Note down
      the key listed under **Developer API Keys**.

    * **User Token**: Under **Developer API Keys**, click on the **Token**
      link, and click **Allow**. Note down the token generated.

1.  You're now going to need to run a Trello configuration script from a
    computer (any computer) connected to the internet. It won't make any
    changes to the computer.

    Make sure you have a working copy of Python. If you're running
    macOS or Linux, you very likely already do. If you're running
    Windows you may or may not.  If you don't have Python, follow the
    installation instructions [here][1].

    !!! tip ""

        You do not need the latest version of Python; anything 2.7 or
        higher will do.

1. Download [zulip-trello.py][2].

    !!! tip ""

        <kbd>Ctrl</kbd> + <kbd>s</kbd> or <kbd>Cmd</kbd> + <kbd>s</kbd>
        on that page should work in most browsers.

1. Run the `zulip-trello` script in a terminal, after replacing the all
   caps arguments with the values collected above and the generated URL
   above.

    ```
    python zulip_trello.py --trello-board-name  TRELLO_BOARD_NAME \
                           --trello-board-id  TRELLO_BOARD_ID \
                           --trello-api-key  TRELLO_API_KEY \
                           --trello-token  TRELLO_TOKEN \
                           --zulip-webhook-url  "GENERATED_WEBHOOK_URL"
    ```

    !!! warn ""

        **Note**: Make sure that you wrap the webhook URL generated above
        in quotes when supplying it on the command-line, as shown above.

    The `zulip_trello.py` script only needs to be run once, and can be run
    on any computer with python.

1. You can delete `zulip_trello.py` from your computer if you'd like.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/trello/001.png)

### Related documentation

{!webhooks-url-specification.md!}

[1]: https://realpython.com/installing-python/
[2]: https://raw.githubusercontent.com/zulip/python-zulip-api/main/zulip/integrations/trello/zulip_trello.py
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/trello/tests.py

```python
from unittest.mock import patch

import orjson

from zerver.lib.test_classes import WebhookTestCase


class TrelloHookTests(WebhookTestCase):
    CHANNEL_NAME = "trello"
    URL_TEMPLATE = "/api/v1/external/trello?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "trello"

    def test_trello_confirmation_request(self) -> None:
        response = self.client_head(self.build_webhook_url())
        self.assertEqual(response.status_code, 200, response)

    def test_trello_webhook_when_card_was_moved_to_another_list(self) -> None:
        expected_message = "TomaszKolek moved [This is a card.](https://trello.com/c/r33ylX2Z) from Basics to Intermediate."
        self.check_webhook("changing_cards_list", "Welcome Board", expected_message)

    def test_trello_webhook_when_card_was_renamed(self) -> None:
        expected_message = 'TomaszKolek renamed the card from "Old name" to [New name](https://trello.com/c/r33ylX2Z).'
        self.check_webhook("renaming_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_label_was_added_to_card(self) -> None:
        expected_message = 'TomaszKolek added a green label with "text value" to [Card name](https://trello.com/c/r33ylX2Z).'
        self.check_webhook("adding_label_to_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_label_was_removing_from_card(self) -> None:
        expected_message = 'TomaszKolek removed a green label with "text value" from [New Card](https://trello.com/c/r33ylX2Z).'
        self.check_webhook("removing_label_from_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_member_was_added_to_card(self) -> None:
        expected_message = (
            "TomaszKolek added TomaszKolek to [Card name](https://trello.com/c/9BduUcVQ)."
        )
        self.check_webhook("adding_member_to_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_member_was_removed_from_card(self) -> None:
        expected_message = (
            "TomaszKolek removed Trello from [Card name](https://trello.com/c/9BduUcVQ)."
        )
        self.check_webhook("removing_member_from_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_due_date_was_set(self) -> None:
        expected_message = "TomaszKolek set due date for [Card name](https://trello.com/c/9BduUcVQ) to <time:2016-05-11T10:00:00+00:00>."
        self.check_webhook("setting_due_date_to_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_due_date_was_changed(self) -> None:
        expected_message = "TomaszKolek changed due date for [Card name](https://trello.com/c/9BduUcVQ) from <time:2016-05-11T10:00:00+00:00> to <time:2016-05-24T10:00:00+00:00>."
        self.check_webhook("changing_due_date_on_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_due_date_was_removed(self) -> None:
        expected_message = (
            "TomaszKolek removed the due date from [Card name](https://trello.com/c/9BduUcVQ)."
        )
        self.check_webhook("removing_due_date_from_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_card_was_archived(self) -> None:
        expected_message = "TomaszKolek archived [Card name](https://trello.com/c/9BduUcVQ)."
        self.check_webhook("archiving_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_card_was_reopened(self) -> None:
        expected_message = "TomaszKolek reopened [Card name](https://trello.com/c/9BduUcVQ)."
        self.check_webhook("reopening_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_card_was_created(self) -> None:
        expected_message = "TomaszKolek created [New card](https://trello.com/c/5qrgGdD5)."
        self.check_webhook("creating_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_attachment_was_added_to_card(self) -> None:
        expected_message = "TomaszKolek added [attachment_name](http://url.com) to [New card](https://trello.com/c/xPKXoSTQ)."
        self.check_webhook("adding_attachment_to_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_checklist_was_added_to_card(self) -> None:
        expected_message = "TomaszKolek added the Checklist checklist to [New card](https://trello.com/c/xPKXoSTQ)."
        self.check_webhook("adding_checklist_to_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_check_item_is_checked(self) -> None:
        expected_message = "Eeshan Garg checked **Tomatoes** in **Checklist** ([Something something](https://trello.com/c/R2thJK3P))."
        self.check_webhook("check_item_on_card_checklist", "Zulip", expected_message)

    def test_trello_webhook_when_check_item_is_unchecked(self) -> None:
        expected_message = "Eeshan Garg unchecked **Tomatoes** in **Checklist** ([Something something](https://trello.com/c/R2thJK3P))."
        self.check_webhook("uncheck_item_on_card_checklist", "Zulip", expected_message)

    def test_trello_webhook_when_member_was_removed_from_board(self) -> None:
        expected_message = (
            "TomaszKolek removed Trello from [Welcome Board](https://trello.com/b/iqXXzYEj)."
        )
        self.check_webhook("removing_member_from_board", "Welcome Board", expected_message)

    def test_trello_webhook_when_member_was_added_to_board(self) -> None:
        expected_message = (
            "TomaszKolek added Trello to [Welcome Board](https://trello.com/b/iqXXzYEj)."
        )
        self.check_webhook("adding_member_to_board", "Welcome Board", expected_message)

    def test_trello_webhook_when_list_was_added_to_board(self) -> None:
        expected_message = (
            "TomaszKolek added New list list to [Welcome Board](https://trello.com/b/iqXXzYEj)."
        )
        self.check_webhook("adding_new_list_to_board", "Welcome Board", expected_message)

    def test_trello_webhook_when_comment_was_added_to_card(self) -> None:
        expected_message = "TomaszKolek commented on [New card](https://trello.com/c/xPKXoSTQ):\n~~~ quote\nNew comment\n~~~"
        self.check_webhook("adding_comment_to_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_board_was_renamed(self) -> None:
        expected_message = "TomaszKolek renamed the board from Welcome Board to [New name](https://trello.com/b/iqXXzYEj)."
        self.check_webhook("renaming_board", "New name", expected_message)

    def verify_post_is_ignored(self, payload: str) -> None:
        with patch("zerver.webhooks.trello.view.check_send_webhook_message") as m:
            result = self.client_post(self.url, payload, content_type="application/json")
        self.assertFalse(m.called)
        self.assert_json_success(result)

    def test_trello_webhook_when_card_is_moved_within_single_list_ignore(self) -> None:
        payload = self.get_body("moving_card_within_single_list")
        self.verify_post_is_ignored(payload)

    def test_trello_webhook_when_board_background_is_changed_ignore(self) -> None:
        payload = self.get_body("change_board_background_image")
        self.verify_post_is_ignored(payload)

    def test_ignored_card_actions(self) -> None:
        """
        Certain card-related actions are now ignored solely based on the
        action type, and we don't need to do any other parsing to ignore
        them as invalid.
        """
        actions = [
            "copyCard",
            "createCheckItem",
            "updateCheckItem",
            "updateList",
        ]
        for action in actions:
            data = dict(
                model="whatever",
                action=dict(
                    type=action,
                ),
            )
            payload = orjson.dumps(data).decode()
            self.verify_post_is_ignored(payload)

    def test_ignoring_card_updates(self) -> None:
        fields = [
            "cover",
            "dueComplete",
            "idAttachmentCover",
            "pos",
        ]
        for field in fields:
            card: dict[str, object] = {}
            old = {}
            old[field] = "should-be-ignored"
            data = dict(
                model="whatever",
                action=dict(
                    type="updateCard",
                    data=dict(card=card, old=old),
                ),
            )
            payload = orjson.dumps(data).decode()
            self.verify_post_is_ignored(payload)

    def test_trello_webhook_when_description_was_added_to_card(self) -> None:
        expected_message = "Marco Matarazzo set description for [New Card](https://trello.com/c/P2r0z66z) to:\n~~~ quote\nNew Description\n~~~"
        self.check_webhook("adding_description_to_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_description_was_removed_from_card(self) -> None:
        expected_message = (
            "Marco Matarazzo removed description from [New Card](https://trello.com/c/P2r0z66z)."
        )
        self.check_webhook("removing_description_from_card", "Welcome Board", expected_message)

    def test_trello_webhook_when_description_was_changed_on_card(self) -> None:
        expected_message = "Marco Matarazzo changed description for [New Card](https://trello.com/c/P2r0z66z) from\n~~~ quote\nNew Description\n~~~\nto\n~~~ quote\nChanged Description\n~~~"
        self.check_webhook("changing_description_on_card", "Welcome Board", expected_message)
```

--------------------------------------------------------------------------------

---[FILE: adding_attachment_to_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/adding_attachment_to_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"5735940584b4870a92c9d2db",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "card":{
            "shortLink":"xPKXoSTQ",
            "idShort":3,
            "name":"New card",
            "id":"53582e2da0fac5676a714280"
         },
         "attachment":{
            "url":"http://url.com",
            "name":"attachment_name",
            "id":"5735940584b4870a92c9d2da"
         }
      },
      "type":"addAttachmentToCard",
      "date":"2016-05-13T08:44:53.897Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: adding_checklist_to_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/adding_checklist_to_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"573597f5d3adc4af52e39f57",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "checklist":{
            "name":"Checklist",
            "id":"573597f5d3adc4af52e39f56"
         },
         "card":{
            "shortLink":"xPKXoSTQ",
            "idShort":3,
            "name":"New card",
            "id":"53582e2da0fac5676a714280"
         }
      },
      "type":"addChecklistToCard",
      "date":"2016-05-13T09:01:41.124Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: adding_comment_to_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/adding_comment_to_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"5735bd3a54bf8d93c35149bb",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "list":{
            "name":"Basics",
            "id":"53582e2da0fac5676a714279"
         },
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "card":{
            "shortLink":"xPKXoSTQ",
            "idShort":3,
            "name":"New card",
            "id":"53582e2da0fac5676a714280"
         },
         "text":"New comment"
      },
      "type":"commentCard",
      "date":"2016-05-13T11:40:42.612Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: adding_description_to_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/adding_description_to_card.json

```json
{
	"model": {
		"id": "55351ade1ed595cfa1bddf81",
		"name": "Welcome Board",
		"desc": "",
		"descData": null,
		"closed": false,
		"idOrganization": null,
		"pinned": false,
		"url": "https://trello.com/b/BDlkcF4E/welcome-board",
		"shortUrl": "https://trello.com/b/BDlkcF4E",
		"prefs": {
			"permissionLevel": "private",
			"voting": "disabled",
			"comments": "members",
			"invitations": "members",
			"selfJoin": true,
			"cardCovers": true,
			"calendarFeedEnabled": false,
			"background": "blue",
			"backgroundImage": null,
			"backgroundImageScaled": null,
			"backgroundTile": false,
			"backgroundBrightness": "dark",
			"backgroundColor": "#0079BF",
			"canBePublic": true,
			"canBeOrg": true,
			"canBePrivate": true,
			"canInvite": true
		},
		"labelNames": {
			"green": "",
			"yellow": "",
			"orange": "",
			"red": "",
			"purple": "",
			"blue": "",
			"sky": "",
			"lime": "",
			"pink": "",
			"black": ""
		}
	},
	"action": {
		"id": "595940d7ba919afcb0db1e8f",
		"idMemberCreator": "55351ade1ed595cfa1bddf80",
		"data": {
			"list": {
				"name": "List",
				"id": "595940919403b0cd052718c6"
			},
			"board": {
				"shortLink": "BDlkcF4E",
				"name": "Welcome Board",
				"id": "55351ade1ed595cfa1bddf81"
			},
			"card": {
				"shortLink": "P2r0z66z",
				"idShort": 8,
				"name": "New Card",
				"id": "595940ccdd7b429f714ac9f3",
				"desc": "New Description"
			},
			"old": {
				"desc": ""
			}
		},
		"type": "updateCard",
		"date": "2017-07-02T18:52:07.432Z",
		"memberCreator": {
			"id": "55351ade1ed595cfa1bddf80",
			"avatarHash": "bcf3f3d2c214f269da2a483abc82524d",
			"fullName": "Marco Matarazzo",
			"initials": "MM",
			"username": "marcomatarazzo1"
		},
		"display": {
			"translationKey": "action_changed_description_of_card",
			"entities": {
				"card": {
					"type": "card",
					"desc": "New Description",
					"id": "595940ccdd7b429f714ac9f3",
					"shortLink": "P2r0z66z",
					"text": "New Card"
				},
				"memberCreator": {
					"type": "member",
					"id": "55351ade1ed595cfa1bddf80",
					"username": "marcomatarazzo1",
					"text": "Marco Matarazzo"
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: adding_label_to_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/adding_label_to_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572a3733549f0fa0e7398918",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "label":{
            "color":"green",
            "name":"",
            "id":"54642de974d650d56763bc32"
         },
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "card":{
            "shortLink":"r33ylX2Z",
            "idShort":2,
            "name":"Card name",
            "id":"53582e2da0fac5676a71427f"
         },
         "text":"text value",
         "value":"green"
      },
      "type":"addLabelToCard",
      "date":"2016-05-04T17:53:55.770Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: adding_member_to_board.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/adding_member_to_board.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"5735a316ba78942251d84438",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "idMemberAdded":"4e6a7fad05d98b02ba00845c",
         "memberType":"normal"
      },
      "type":"addMemberToBoard",
      "date":"2016-05-13T09:49:10.519Z",
      "member":{
         "id":"4e6a7fad05d98b02ba00845c",
         "avatarHash":"a6cc37f6849928acb91064cf65e61cbc",
         "fullName":"Trello",
         "initials":"T",
         "username":"trello"
      },
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: adding_member_to_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/adding_member_to_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572b6d4635b843ed3faa7dc0",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "card":{
            "shortLink":"9BduUcVQ",
            "idShort":8,
            "name":"Card name",
            "id":"53582e2da0fac5676a71428b"
         },
         "idMember":"53582e2da0fac5676a714276"
      },
      "type":"addMemberToCard",
      "date":"2016-05-05T15:56:54.348Z",
      "member":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      },
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: adding_new_list_to_board.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/adding_new_list_to_board.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"5735b78f3fbdc04509aff9f2",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "list":{
            "name":"New list",
            "id":"5735b78f3fbdc04509aff9f1"
         }
      },
      "type":"createList",
      "date":"2016-05-13T11:16:31.028Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: archiving_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/archiving_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572b784d97893f947c179ccb",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "list":{
            "name":"Intermediate",
            "id":"53582e2da0fac5676a71427a"
         },
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "card":{
            "shortLink":"9BduUcVQ",
            "idShort":8,
            "name":"Card name",
            "id":"53582e2da0fac5676a71428b",
            "closed":true
         },
         "old":{
            "closed":false
         }
      },
      "type":"updateCard",
      "date":"2016-05-05T16:43:57.557Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

````
