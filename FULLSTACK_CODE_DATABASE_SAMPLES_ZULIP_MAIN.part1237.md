---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1237
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1237 of 1290)

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

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/pivotal/doc.md

```text
# Zulip Pivotal integration

Get Zulip notifications for the stories in your Pivotal Tracker project!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. From your Pivotal project's **Settings** page, click on **Webhooks**.

1. Under **Activity Web Hook**, provide the URL generated above.
   Choose version 5 (`v5`) of the API. Click **Add**.

    !!! warn ""

         **Note:** Zulip supports both version 3 and version 5, but version
         5 contains more information and allows Zulip to format more useful messages.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/pivotal/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/pivotal/tests.py

```python
from unittest import mock

import orjson
from typing_extensions import override

from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.test_classes import WebhookTestCase
from zerver.webhooks.pivotal.view import api_pivotal_webhook_v5


class PivotalV3HookTests(WebhookTestCase):
    CHANNEL_NAME = "pivotal"
    URL_TEMPLATE = "/api/v1/external/pivotal?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "pivotal"

    def test_accepted(self) -> None:
        expected_topic_name = "My new Feature story"
        expected_message = 'Leo Franchi accepted "My new Feature story" \
[(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48276573).'
        self.check_webhook(
            "accepted", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_bad_subject(self) -> None:
        expected_topic_name = "Story changed"
        expected_message = "Leo Franchi accepted My new Feature story \
[(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48276573)."
        self.check_webhook(
            "bad_accepted", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_commented(self) -> None:
        expected_topic_name = "Comment added"
        expected_message = 'Leo Franchi added comment: "FIX THIS NOW" \
[(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48276573).'
        self.check_webhook(
            "commented", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_created(self) -> None:
        expected_topic_name = "My new Feature story"
        expected_message = 'Leo Franchi added "My new Feature story" \
(unscheduled feature):\n\n~~~ quote\nThis is my long description\n~~~\n\n \
[(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48276573).'
        self.check_webhook(
            "created", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_delivered(self) -> None:
        expected_topic_name = "Another new story"
        expected_message = 'Leo Franchi delivered "Another new story" \
[(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48278289).'
        self.check_webhook(
            "delivered", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_finished(self) -> None:
        expected_topic_name = "Another new story"
        expected_message = 'Leo Franchi finished "Another new story" \
[(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48278289).'
        self.check_webhook(
            "finished", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_moved(self) -> None:
        expected_topic_name = "My new Feature story"
        expected_message = 'Leo Franchi edited "My new Feature story" \
[(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48276573).'
        self.check_webhook(
            "moved", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_rejected(self) -> None:
        expected_topic_name = "Another new story"
        expected_message = 'Leo Franchi rejected "Another new story" with comments: \
"Not good enough, sorry" [(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48278289).'
        self.check_webhook(
            "rejected", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_started(self) -> None:
        expected_topic_name = "Another new story"
        expected_message = 'Leo Franchi started "Another new story" \
[(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48278289).'
        self.check_webhook(
            "started", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_created_estimate(self) -> None:
        expected_topic_name = "Another new story"
        expected_message = 'Leo Franchi added "Another new story" \
(unscheduled feature worth 2 story points):\n\n~~~ quote\nSome loong description\n~~~\n\n \
[(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48278289).'
        self.check_webhook(
            "created_estimate",
            expected_topic_name,
            expected_message,
            content_type="application/xml",
        )

    def test_type_changed(self) -> None:
        expected_topic_name = "My new Feature story"
        expected_message = 'Leo Franchi edited "My new Feature story" \
[(view)](https://www.pivotaltracker.com/s/projects/807213/stories/48276573).'
        self.check_webhook(
            "type_changed", expected_topic_name, expected_message, content_type="application/xml"
        )

    @override
    def get_body(self, fixture_name: str) -> str:
        return self.webhook_fixture_data("pivotal", fixture_name, file_type="xml")


class PivotalV5HookTests(WebhookTestCase):
    CHANNEL_NAME = "pivotal"
    URL_TEMPLATE = "/api/v1/external/pivotal?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "pivotal"

    def test_accepted(self) -> None:
        expected_topic_name = "#63486316: Story of the Year"
        expected_message = """Leo Franchi updated [Hard Code](https://www.pivotaltracker.com/s/projects/807213): [Story of the Year](http://www.pivotaltracker.com/story/show/63486316):
* state changed from **unstarted** to **accepted**"""
        self.check_webhook(
            "accepted", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_commented(self) -> None:
        expected_topic_name = "#63486316: Story of the Year"
        expected_message = """Leo Franchi added a comment to [Hard Code](https://www.pivotaltracker.com/s/projects/807213): [Story of the Year](http://www.pivotaltracker.com/story/show/63486316):
~~~quote
A comment on the story
~~~"""
        self.check_webhook(
            "commented", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_created(self) -> None:
        expected_topic_name = "#63495662: Story that I created"
        expected_message = """Leo Franchi created bug: [Hard Code](https://www.pivotaltracker.com/s/projects/807213): [Story that I created](http://www.pivotaltracker.com/story/show/63495662)
* State is **unscheduled**
* Description is

> What a description"""
        self.check_webhook(
            "created", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_delivered(self) -> None:
        expected_topic_name = "#63486316: Story of the Year"
        expected_message = """Leo Franchi updated [Hard Code](https://www.pivotaltracker.com/s/projects/807213): [Story of the Year](http://www.pivotaltracker.com/story/show/63486316):
* state changed from **accepted** to **delivered**"""
        self.check_webhook(
            "delivered", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_finished(self) -> None:
        expected_topic_name = "#63486316: Story of the Year"
        expected_message = """Leo Franchi updated [Hard Code](https://www.pivotaltracker.com/s/projects/807213): [Story of the Year](http://www.pivotaltracker.com/story/show/63486316):
* state changed from **delivered** to **accepted**"""
        self.check_webhook(
            "finished", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_moved(self) -> None:
        expected_topic_name = "#63496066: Pivotal Test"
        expected_message = """Leo Franchi moved [Hard Code](https://www.pivotaltracker.com/s/projects/807213): [Pivotal Test](http://www.pivotaltracker.com/story/show/63496066) from **unstarted** to **unscheduled**."""
        self.check_webhook(
            "moved", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_rejected(self) -> None:
        expected_topic_name = "#63486316: Story of the Year"
        expected_message = """Leo Franchi updated [Hard Code](https://www.pivotaltracker.com/s/projects/807213): [Story of the Year](http://www.pivotaltracker.com/story/show/63486316):
* Comment added:
~~~quote
Try again next time
~~~
* state changed from **delivered** to **rejected**"""
        self.check_webhook(
            "rejected", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_started(self) -> None:
        expected_topic_name = "#63495972: Fresh Story"
        expected_message = """Leo Franchi updated [Hard Code](https://www.pivotaltracker.com/s/projects/807213): [Fresh Story](http://www.pivotaltracker.com/story/show/63495972):
* state changed from **unstarted** to **started**"""
        self.check_webhook(
            "started", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_created_estimate(self) -> None:
        expected_topic_name = "#63496066: Pivotal Test"
        expected_message = """Leo Franchi updated [Hard Code](https://www.pivotaltracker.com/s/projects/807213): [Pivotal Test](http://www.pivotaltracker.com/story/show/63496066):
* estimate is now **3 points**"""
        self.check_webhook(
            "created_estimate",
            expected_topic_name,
            expected_message,
            content_type="application/xml",
        )

    def test_type_changed(self) -> None:
        expected_topic_name = "#63496066: Pivotal Test"
        expected_message = """Leo Franchi updated [Hard Code](https://www.pivotaltracker.com/s/projects/807213): [Pivotal Test](http://www.pivotaltracker.com/story/show/63496066):
* estimate changed from 3 to **0 points**
* type changed from **feature** to **bug**"""
        self.check_webhook(
            "type_changed", expected_topic_name, expected_message, content_type="application/xml"
        )

    def test_bad_payload(self) -> None:
        bad = ("foo", None, "bar")
        with (
            self.assertRaisesRegex(AssertionError, "Unable to handle Pivotal payload"),
            mock.patch("zerver.webhooks.pivotal.view.api_pivotal_webhook_v3", return_value=bad),
        ):
            self.check_webhook("accepted", expect_topic="foo")

    def test_bad_request(self) -> None:
        request = mock.MagicMock()
        hamlet = self.example_user("hamlet")
        bad = orjson.loads(self.get_body("bad_request"))

        with mock.patch("zerver.webhooks.pivotal.view.orjson.loads", return_value=bad):
            result = api_pivotal_webhook_v5(request, hamlet)
            self.assertEqual(result[0], "#0: ")

        bad = orjson.loads(self.get_body("bad_kind"))
        with (
            self.assertRaisesRegex(UnsupportedWebhookEventTypeError, "'unknown_kind'.* supported"),
            mock.patch("zerver.webhooks.pivotal.view.orjson.loads", return_value=bad),
        ):
            api_pivotal_webhook_v5(request, hamlet)

    @override
    def get_body(self, fixture_name: str) -> str:
        return self.webhook_fixture_data("pivotal", f"v5_{fixture_name}", file_type="json")
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/pivotal/view.py
Signals: Django

```python
"""Webhooks for external integrations."""

import re
from typing import Any

import orjson
from defusedxml.ElementTree import fromstring as xml_fromstring
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError, UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint_without_parameters
from zerver.lib.utils import assert_is_not_none
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


def api_pivotal_webhook_v3(request: HttpRequest, user_profile: UserProfile) -> tuple[str, str, str]:
    payload = xml_fromstring(request.body)

    def get_text(attrs: list[str]) -> str:
        start = payload
        for attr in attrs:
            child = start.find(attr)
            if child is None:
                return ""
            start = child
        assert start.text is not None
        return start.text

    event_type = assert_is_not_none(payload.find("event_type")).text
    description = assert_is_not_none(payload.find("description")).text
    assert description is not None
    project_id = assert_is_not_none(payload.find("project_id")).text
    story_id = get_text(["stories", "story", "id"])
    # Ugh, the URL in the XML data is not a clickable URL that works for the user
    # so we try to build one that the user can actually click on
    url = f"https://www.pivotaltracker.com/s/projects/{project_id}/stories/{story_id}"

    # Pivotal doesn't tell us the name of the story, but it's usually in the
    # description in quotes as the first quoted string
    name_re = re.compile(r'[^"]+"([^"]+)".*')
    match = name_re.match(description)
    if match and len(match.groups()):
        name = match.group(1)
    else:
        name = "Story changed"  # Failed for an unknown reason, show something
    more_info = f" [(view)]({url})."

    if event_type == "story_update":
        topic_name = name
        content = description + more_info
    elif event_type == "note_create":
        topic_name = "Comment added"
        content = description + more_info
    elif event_type == "story_create":
        issue_desc = get_text(["stories", "story", "description"])
        issue_type = get_text(["stories", "story", "story_type"])
        issue_status = get_text(["stories", "story", "current_state"])
        estimate = get_text(["stories", "story", "estimate"])
        if estimate != "":
            estimate = f" worth {estimate} story points"
        topic_name = name
        content = f"{description} ({issue_status} {issue_type}{estimate}):\n\n~~~ quote\n{issue_desc}\n~~~\n\n{more_info}"
    return topic_name, content, f"{event_type}_v3"


UNSUPPORTED_EVENT_TYPES = [
    "task_create_activity",
    "comment_delete_activity",
    "task_delete_activity",
    "task_update_activity",
    "story_move_from_project_activity",
    "story_delete_activity",
    "story_move_into_project_activity",
    "epic_update_activity",
    "label_create_activity",
]

ALL_EVENT_TYPES = [
    "story_update_v3",
    "note_create_v3",
    "story_create_v3",
    "story_move_activity_v5",
    "story_create_activity_v5",
    "story_update_activity_v5",
    "comment_create_activity_v5",
]


def api_pivotal_webhook_v5(request: HttpRequest, user_profile: UserProfile) -> tuple[str, str, str]:
    payload = orjson.loads(request.body)

    event_type = payload["kind"]

    project_name = payload["project"]["name"]
    project_id = payload["project"]["id"]

    primary_resources = payload["primary_resources"][0]
    story_url = primary_resources["url"]
    story_type = primary_resources.get("story_type")
    story_id = primary_resources["id"]
    story_name = primary_resources["name"]

    performed_by = payload.get("performed_by", {}).get("name", "")

    story_info = f"[{project_name}](https://www.pivotaltracker.com/s/projects/{project_id}): [{story_name}]({story_url})"

    changes = payload.get("changes", [])

    content = ""
    topic_name = f"#{story_id}: {story_name}"

    def extract_comment(change: dict[str, Any]) -> str | None:
        if change.get("kind") == "comment":
            return change.get("new_values", {}).get("text", None)
        return None

    if event_type == "story_update_activity":
        # Find the changed valued and build a message
        content += f"{performed_by} updated {story_info}:\n"
        for change in changes:
            old_values = change.get("original_values", {})
            new_values = change["new_values"]

            if "current_state" in old_values and "current_state" in new_values:
                content += "* state changed from **{}** to **{}**\n".format(
                    old_values["current_state"], new_values["current_state"]
                )
            if "estimate" in old_values and "estimate" in new_values:
                old_estimate = old_values.get("estimate", None)
                if old_estimate is None:
                    estimate = "is now"
                else:
                    estimate = f"changed from {old_estimate} to"
                new_estimate = new_values["estimate"] if new_values["estimate"] is not None else "0"
                content += f"* estimate {estimate} **{new_estimate} points**\n"
            if "story_type" in old_values and "story_type" in new_values:
                content += "* type changed from **{}** to **{}**\n".format(
                    old_values["story_type"], new_values["story_type"]
                )

            comment = extract_comment(change)
            if comment is not None:
                content += f"* Comment added:\n~~~quote\n{comment}\n~~~\n"

    elif event_type == "comment_create_activity":
        for change in changes:
            comment = extract_comment(change)
            if comment is not None:
                content += (
                    f"{performed_by} added a comment to {story_info}:\n~~~quote\n{comment}\n~~~"
                )
    elif event_type == "story_create_activity":
        content += f"{performed_by} created {story_type}: {story_info}\n"
        for change in changes:
            new_values = change.get("new_values", {})
            if "current_state" in new_values:
                content += "* State is **{}**\n".format(new_values["current_state"])
            if "description" in new_values:
                content += "* Description is\n\n> {}".format(new_values["description"])
    elif event_type == "story_move_activity":
        content = f"{performed_by} moved {story_info}"
        for change in changes:
            old_values = change.get("original_values", {})
            new_values = change["new_values"]
            if "current_state" in old_values and "current_state" in new_values:
                content += " from **{}** to **{}**.".format(
                    old_values["current_state"], new_values["current_state"]
                )
    elif event_type in UNSUPPORTED_EVENT_TYPES:
        # Known but unsupported Pivotal event types
        pass
    else:
        raise UnsupportedWebhookEventTypeError(event_type)

    return topic_name, content, f"{event_type}_v5"


@webhook_view("Pivotal", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint_without_parameters
def api_pivotal_webhook(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    topic_name = content = None
    try:
        topic_name, content, event_type = api_pivotal_webhook_v3(request, user_profile)
    except Exception:
        # Attempt to parse v5 JSON payload
        topic_name, content, event_type = api_pivotal_webhook_v5(request, user_profile)

    if not content:
        raise JsonableError(_("Unable to handle Pivotal payload"))

    check_send_webhook_message(request, user_profile, topic_name, content, event_type)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: accepted.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/accepted.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346167313</id>
    <version type="integer">11</version>
    <event_type>story_update</event_type>
    <occurred_at type="datetime">2013/04/17 20:18:54 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi accepted &quot;My new Feature story&quot;</description>
    <stories type="array">
        <story>
            <id type="integer">48276573</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48276573</url>
            <story_type>bug</story_type>
            <accepted_at type="datetime">2013/04/17 20:18:54 UTC</accepted_at>
            <labels>website</labels>
            <current_state>accepted</current_state>
            <owned_by>Leo Franchi</owned_by>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: bad_accepted.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/bad_accepted.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346167313</id>
    <version type="integer">11</version>
    <event_type>story_update</event_type>
    <occurred_at type="datetime">2013/04/17 20:18:54 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi accepted My new Feature story</description>
    <stories type="array">
        <story>
            <id type="integer">48276573</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48276573</url>
            <story_type>bug</story_type>
            <accepted_at type="datetime">2013/04/17 20:18:54 UTC</accepted_at>
            <labels>website</labels>
            <current_state>accepted</current_state>
            <owned_by>Leo Franchi</owned_by>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: commented.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/commented.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346163343</id>
    <version type="integer">5</version>
    <event_type>note_create</event_type>
    <occurred_at type="datetime">2013/04/17 20:12:12 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi added comment: &quot;FIX THIS NOW&quot;</description>
    <stories type="array">
        <story>
            <id type="integer">48276573</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48276573</url>
            <notes type="array">
                <note>
                    <id type="integer">41169355</id>
                    <text>FIX THIS NOW</text>
                </note>
            </notes>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: created.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/created.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346161339</id>
    <version type="integer">2</version>
    <event_type>story_create</event_type>
    <occurred_at type="datetime">2013/04/17 20:09:17 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi added &quot;My new Feature story&quot;</description>
    <stories type="array">
        <story>
            <id type="integer">48276573</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48276573</url>
            <name>My new Feature story</name>
            <story_type>feature</story_type>
            <description>This is my long description</description>
            <current_state>unscheduled</current_state>
            <requested_by>Leo Franchi</requested_by>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: created_estimate.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/created_estimate.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346174097</id>
    <version type="integer">16</version>
    <event_type>story_create</event_type>
    <occurred_at type="datetime">2013/04/17 20:28:52 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi added &quot;Another new story&quot;</description>
    <stories type="array">
        <story>
            <id type="integer">48278289</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48278289</url>
            <name>Another new story</name>
            <story_type>feature</story_type>
            <description>Some loong description</description>
            <estimate type="integer">2</estimate>
            <current_state>unscheduled</current_state>
            <requested_by>Leo Franchi</requested_by>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: delivered.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/delivered.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346177011</id>
    <version type="integer">22</version>
    <event_type>story_update</event_type>
    <occurred_at type="datetime">2013/04/17 20:32:51 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi delivered &quot;Another new story&quot;</description>
    <stories type="array">
        <story>
            <id type="integer">48278289</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48278289</url>
            <current_state>delivered</current_state>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: finished.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/finished.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346176787</id>
    <version type="integer">21</version>
    <event_type>story_update</event_type>
    <occurred_at type="datetime">2013/04/17 20:32:31 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi finished &quot;Another new story&quot;</description>
    <stories type="array">
        <story>
            <id type="integer">48278289</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48278289</url>
            <current_state>finished</current_state>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: moved.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/moved.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346162723</id>
    <version type="integer">3</version>
    <event_type>story_update</event_type>
    <occurred_at type="datetime">2013/04/17 20:11:18 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi edited &quot;My new Feature story&quot;</description>
    <stories type="array">
        <story>
            <id type="integer">48276573</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48276573</url>
            <current_state>unstarted</current_state>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: rejected.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/rejected.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346177291</id>
    <version type="integer">23</version>
    <event_type>story_update</event_type>
    <occurred_at type="datetime">2013/04/17 20:33:16 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi rejected &quot;Another new story&quot; with comments: &quot;Not good enough, sorry&quot;</description>
    <stories type="array">
        <story>
            <id type="integer">48278289</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48278289</url>
            <current_state>rejected</current_state>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: started.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/started.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346176439</id>
    <version type="integer">20</version>
    <event_type>story_update</event_type>
    <occurred_at type="datetime">2013/04/17 20:32:03 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi started &quot;Another new story&quot;</description>
    <stories type="array">
        <story>
            <id type="integer">48278289</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48278289</url>
            <current_state>started</current_state>
            <owned_by>Leo Franchi</owned_by>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: type_changed.xml]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/type_changed.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<activity>
    <id type="integer">346170371</id>
    <version type="integer">14</version>
    <event_type>story_update</event_type>
    <occurred_at type="datetime">2013/04/17 20:23:23 UTC</occurred_at>
    <author>Leo Franchi</author>
    <project_id type="integer">807213</project_id>
    <description>Leo Franchi edited &quot;My new Feature story&quot;</description>
    <stories type="array">
        <story>
            <id type="integer">48276573</id>
            <url>http://www.pivotaltracker.com/services/v3/projects/807213/stories/48276573</url>
            <story_type>chore</story_type>
        </story>
    </stories>
</activity>
```

--------------------------------------------------------------------------------

---[FILE: v5_accepted.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_accepted.json

```json
{
  "occurred_at": 1389218398000,
  "kind": "story_update_activity",
  "project": {
    "name": "Hard Code",
    "kind": "project",
    "id": 807213
  },
  "changes": [
    {
      "name": "Story of the Year",
      "story_type": "feature",
      "change_type": "update",
      "kind": "story",
      "new_values": {
        "current_state": "accepted",
        "updated_at": 1389218398000,
        "accepted_at": 1389218397000
      },
      "id": 63486316,
      "original_values": {
        "current_state": "unstarted",
        "updated_at": 1389215951000,
        "accepted_at": null
      }
    }
  ],
  "highlight": "accepted",
  "project_version": 60,
  "guid": "807213_60",
  "primary_resources": [
    {
      "name": "Story of the Year",
      "story_type": "feature",
      "kind": "story",
      "id": 63486316,
      "url": "http://www.pivotaltracker.com/story/show/63486316"
    }
  ],
  "performed_by": {
    "name": "Leo Franchi",
    "initials": "LF",
    "kind": "person",
    "id": 981905
  },
  "message": "Leo Franchi accepted this feature"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_bad_kind.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_bad_kind.json

```json
{
  "occurred_at": 1389218398000,
  "kind": "unknown_kind",
  "project": {
    "name": "Hard Code",
    "kind": "project",
    "id": 807213
  },
  "changes": [
    {
      "name": "Story of the Year",
      "story_type": "feature",
      "change_type": "update",
      "kind": "story",
      "new_values": {
        "current_state": "accepted",
        "updated_at": 1389218398000,
        "accepted_at": 1389218397000
      },
      "id": 63486316,
      "original_values": {
        "current_state": "unstarted",
        "updated_at": 1389215951000,
        "accepted_at": null
      }
    }
  ],
  "highlight": "accepted",
  "project_version": 60,
  "guid": "807213_60",
  "primary_resources": [
    {
      "name": "Story of the Year",
      "story_type": "feature",
      "kind": "story",
      "id": 63486316,
      "url": "http://www.pivotaltracker.com/story/show/63486316"
    }
  ],
  "performed_by": {
    "name": "Leo Franchi",
    "initials": "LF",
    "kind": "person",
    "id": 981905
  },
  "message": "Leo Franchi accepted this feature"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_bad_request.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_bad_request.json

```json
{
    "occurred_at": 1389218398000,
    "kind": "epic_update_activity",
    "project": {
        "name": "",
        "id": ""
    },
    "primary_resources": [
        {
            "url": "",
            "id": 0,
            "name": ""
        }
    ],
    "msg": "foo"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_commented.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_commented.json

```json
{
  "message": "Leo Franchi added comment: \"A comment on the story\"",
  "primary_resources": [
    {
      "url": "http://www.pivotaltracker.com/story/show/63486316",
      "kind": "story",
      "story_type": "feature",
      "id": 63486316,
      "name": "Story of the Year"
    }
  ],
  "guid": "807213_61",
  "kind": "comment_create_activity",
  "project": {
    "kind": "project",
    "id": 807213,
    "name": "Hard Code"
  },
  "occurred_at": 1389218474000,
  "performed_by": {
    "initials": "LF",
    "kind": "person",
    "id": 981905,
    "name": "Leo Franchi"
  },
  "changes": [
    {
      "kind": "comment",
      "id": 59124096,
      "change_type": "create",
      "new_values": {
        "story_id": 63486316,
        "file_attachment_ids": [

        ],
        "google_attachment_ids": [

        ],
        "updated_at": 1389218474000,
        "created_at": 1389218474000,
        "google_attachments": [

        ],
        "file_attachments": [

        ],
        "text": "A comment on the story",
        "id": 59124096,
        "person_id": 981905
      }
    },
    {
      "kind": "story",
      "story_type": "feature",
      "change_type": "update",
      "id": 63486316,
      "original_values": {
        "updated_at": 1389218398000
      },
      "new_values": {
        "updated_at": 1389218474000
      },
      "name": "Story of the Year"
    }
  ],
  "project_version": 61,
  "highlight": "added comment:"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_created.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_created.json

```json
{
  "project": {
    "id": 807213,
    "name": "Hard Code",
    "kind": "project"
  },
  "guid": "807213_62",
  "project_version": 62,
  "highlight": "added",
  "occurred_at": 1389218525000,
  "performed_by": {
    "id": 981905,
    "name": "Leo Franchi",
    "initials": "LF",
    "kind": "person"
  },
  "primary_resources": [
    {
      "id": 63495662,
      "story_type": "bug",
      "url": "http://www.pivotaltracker.com/story/show/63495662",
      "name": "Story that I created",
      "kind": "story"
    }
  ],
  "message": "Leo Franchi added this bug",
  "changes": [
    {
      "id": 63495662,
      "story_type": "bug",
      "name": "Story that I created",
      "new_values": {
        "current_state": "unscheduled",
        "after_id": 63486316,
        "id": 63495662,
        "requested_by_id": 981905,
        "follower_ids": [

        ],
        "story_type": "bug",
        "name": "Story that I created",
        "project_id": 807213,
        "description": "What a description",
        "labels": [

        ],
        "created_at": 1389218525000,
        "updated_at": 1389218525000,
        "label_ids": [

        ],
        "before_id": 48420109
      },
      "change_type": "create",
      "kind": "story"
    }
  ],
  "kind": "story_create_activity"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_created_estimate.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_created_estimate.json

```json
{
  "occurred_at": 1389218976000,
  "kind": "story_update_activity",
  "project": {
    "name": "Hard Code",
    "kind": "project",
    "id": 807213
  },
  "changes": [
    {
      "name": "Pivotal Test",
      "story_type": "feature",
      "change_type": "update",
      "kind": "story",
      "new_values": {
        "estimate": 3,
        "updated_at": 1389218976000
      },
      "id": 63496066,
      "original_values": {
        "estimate": null,
        "updated_at": 1389218941000
      }
    }
  ],
  "highlight": "estimated",
  "project_version": 81,
  "guid": "807213_81",
  "primary_resources": [
    {
      "name": "Pivotal Test",
      "story_type": "feature",
      "kind": "story",
      "id": 63496066,
      "url": "http://www.pivotaltracker.com/story/show/63496066"
    }
  ],
  "performed_by": {
    "name": "Leo Franchi",
    "initials": "LF",
    "kind": "person",
    "id": 981905
  },
  "message": "Leo Franchi estimated this feature as 3 points"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_delivered.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_delivered.json

```json
{
  "message": "Leo Franchi delivered this feature",
  "primary_resources": [
    {
      "url": "http://www.pivotaltracker.com/story/show/63486316",
      "kind": "story",
      "story_type": "feature",
      "id": 63486316,
      "name": "Story of the Year"
    }
  ],
  "guid": "807213_64",
  "kind": "story_update_activity",
  "project": {
    "kind": "project",
    "id": 807213,
    "name": "Hard Code"
  },
  "occurred_at": 1389218691000,
  "performed_by": {
    "initials": "LF",
    "kind": "person",
    "id": 981905,
    "name": "Leo Franchi"
  },
  "changes": [
    {
      "kind": "story",
      "story_type": "feature",
      "change_type": "update",
      "id": 63486316,
      "original_values": {
        "current_state": "accepted",
        "accepted_at": 1389218632000,
        "updated_at": 1389218645000
      },
      "new_values": {
        "current_state": "delivered",
        "accepted_at": null,
        "updated_at": 1389218691000
      },
      "name": "Story of the Year"
    }
  ],
  "project_version": 64,
  "highlight": "delivered"
}
```

--------------------------------------------------------------------------------

````
