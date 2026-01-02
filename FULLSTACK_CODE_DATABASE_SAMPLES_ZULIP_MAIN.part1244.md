---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1244
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1244 of 1290)

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
Location: zulip-main/zerver/webhooks/sentry/doc.md

```text
# Zulip Sentry integration

Get Zulip notifications for the issues in your Sentry projects!

!!! warn ""

    **Note:** This integration supports Sentry's Node, Python, and Go
    [platforms](https://sentry.io/platforms/). If there's a platform
    you're interested in seeing support for that's missing, let us
    know in the [integrations][dev-community] channel of the Zulip
    development community.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In your Sentry organization's **Settings**, go to **Developer
   Settings**. Click on **Create New Integration**, and select
   **Internal Integration**.

    !!! warn ""

        **Note**: Zulip also supports configuring this integration as a
        webhook in Sentry. While this is easier to configure (navigate
        to **Settings &gt; Integrations**, and search for **WebHooks**),
        it doesn't support the full breadth of event types. For instance,
        some events, like issue assignments or issues being resolved,
        will not trigger notifications with this configuration.

1. Set the **Webhook URL** to the URL generated above, and then enable
   **Alert Rule Action**. Fill out the remaining details based on your
   preferences, and click **Save Changes**.

    !!! tip ""

        If you want notifications for issues, as well as events, you can
        scroll down to **Webhooks** on the same page, and toggle the
        **issue** checkbox.

1. Go to **Alerts**, and click **Create Alert**.

1. Select the project for which you want to receive notifications, and
   set the conditions as you'd prefer (e.g., the events you want to be
   notified about). Under **PERFORM THESE ACTIONS**, select **Add an
   action...** &gt; **Send a notification via an integration**, and set
   it to the internal integration created above.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/sentry/001.png)

### Related documentation

{!webhooks-url-specification.md!}

[dev-community]: https://chat.zulip.org/#narrow/channel/127-integrations
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/sentry/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class SentryHookTests(WebhookTestCase):
    CHANNEL_NAME = "sentry"
    URL_TEMPLATE = "/api/v1/external/sentry?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "sentry"

    def test_event_for_exception_golang(self) -> None:
        expected_topic_name = '*url.Error: Get "bad_url": unsupported protocol scheme ""'
        expected_message = """\
**New exception:** [*url.Error: Get "bad_url": unsupported protocol scheme ""](https://sentry.io/organizations/hypro999-personal-organization/issues/1637164584/events/80777a9cc30e4d0eb8904333d5c298b0/)
```quote
**level:** error
**timestamp:** <time:2020-04-29T11:23:45+00:00>
**filename:** trigger-exception.go
```

Traceback:
```go
         // Set the timeout to the maximum duration the program can afford to wait.
         defer sentry.Flush(2 * time.Second)

         resp, err := http.Get(os.Args[1])
         if err != nil {
--->         sentry.CaptureException(err)
             log.Printf("reported to Sentry: %s", err)
             return
         }
         defer resp.Body.Close()

```"""
        self.check_webhook("event_for_exception_golang", expected_topic_name, expected_message)

    def test_event_for_exception_node(self) -> None:
        expected_topic_name = "Error: Sample error from node."
        expected_message = """\
**New exception:** [Error: Sample error from node.](https://sentry.io/organizations/hypro999-personal-organization/issues/1638852747/events/f9cb0f2afff74a5aa92e766fb7ac3fe3/)
```quote
**level:** error
**timestamp:** <time:2020-04-30T06:19:33+00:00>
**filename:** /home/hemanth/Desktop/sentry/trigger-exception.js
```

Traceback:
```javascript
       dsn: 'https://redacted.ingest.sentry.io/5216640',
     });

     Sentry.withScope(function(scope) {
       scope.addEventProcessor(function(event, hint) {
         return event;
       });
--->   Sentry.captureException(new Error('Sample error from node.'));
     });


```"""
        self.check_webhook("event_for_exception_node", expected_topic_name, expected_message)

    def test_event_for_exception_python(self) -> None:
        expected_topic_name = "Exception: Custom exception!"
        expected_message = """\
**New exception:** [Exception: Custom exception!](https://sentry.io/organizations/hypro999-personal-organization/issues/1635244907/events/599349254a1447a99774b5310711c1a8/)
```quote
**level:** error
**timestamp:** <time:2020-04-28T13:56:05+00:00>
**filename:** trigger-exception.py
```

Traceback:
```python3


     if __name__ == "__main__":
         sentry_sdk.init(dsn=SECRET_DSN)
         try:
--->         raise Exception("Custom exception!")
         except Exception as e:
             sentry_sdk.capture_exception(e)

```"""
        self.check_webhook("event_for_exception_python", expected_topic_name, expected_message)

    def test_event_for_exception_rails(self) -> None:
        expected_topic_name = "ZeroDivisionError: divided by 0"
        expected_message = """\
**New exception:** [ZeroDivisionError: divided by 0](https://sentry.io/organizations/nitk-46/issues/4213933362/events/49b528e13e45497ab9adc3173fd2ed34/)
```quote
**level:** error
**timestamp:** <time:2023-05-29T10:12:33+00:00>
**filename:** app/controllers/articles_controller.rb
```

Traceback:
```ruby
     class ArticlesController < ApplicationController

       def index

         begin

--->       132312 / 0

         rescue ZeroDivisionError => exception

           Sentry.capture_exception(exception)

         end

```"""
        self.check_webhook("event_for_exception_rails", expected_topic_name, expected_message)

    def test_event_for_exception_vue(self) -> None:
        expected_topic_name = "TypeError: Cannot read properties of null (reading 'inser..."
        expected_message = """\
**New exception:** [TypeError: Cannot read properties of null (reading 'insertBefore')](https://sentry.io/organizations/nitk-46/issues/4214010673/events/292f78454e774e62999506f759ad791d/)
```quote
**level:** error
**timestamp:** <time:2023-05-29T11:08:30+00:00>
**filename:** /node_modules/.vite/deps/chunk-G4DFXOZZ.js
```"""
        self.check_webhook("event_for_exception_vue", expected_topic_name, expected_message)

    def test_webhook_event_for_exception_python(self) -> None:
        expected_topic_name = "ValueError: new sentry error."
        expected_message = """\
**New exception:** [ValueError: new sentry error.](https://sentry.io/organizations/bar-foundation/issues/1972208801/events/c916dccfd58e41dcabaebef0091f0736/)
```quote
**level:** error
**timestamp:** <time:2020-10-21T23:25:11+00:00>
**filename:** trigger-exception.py
```

Traceback:
```python3


     if __name__ == "__main__":
         sentry_sdk.init(dsn=DSN_SECRET)
         try:
--->         raise ValueError("new sentry error.")
         except Exception as e:
             sentry_sdk.capture_exception(e)
```"""
        self.check_webhook(
            "webhook_event_for_exception_python", expected_topic_name, expected_message
        )

    def test_webhook_event_for_exception_javascript(self) -> None:
        expected_topic_name = 'TypeError: can\'t access property "bar", x.foo is undefined'
        expected_message = """\
**New exception:** [TypeError: can't access property "bar", x.foo is undefined](https://sentry.io/organizations/foo-bar-org/issues/1982047746/events/f3bf5fc4e354451db9e885a69b2a2b51/)
```quote
**level:** error
**timestamp:** <time:2020-10-26T16:39:54+00:00>
**filename:** None
```"""
        self.check_webhook(
            "webhook_event_for_exception_javascript", expected_topic_name, expected_message
        )

    def test_event_for_exception_js(self) -> None:
        expected_topic_name = "Error: Something external broke."
        expected_message = """\
**New exception:** [Error: Something external broke.](https://sentry.io/organizations/hypro999-personal-organization/issues/1731239773/events/355c3b2a142046629dd410db2fdda003/)
```quote
**level:** error
**timestamp:** <time:2020-06-17T14:42:54+00:00>
**filename:** /mnt/data/Documents/Stuff%20for%20Zulip/Repos/sentry/js/external.js
```"""
        self.check_webhook("event_for_exception_js", expected_topic_name, expected_message)

    def test_event_for_message_golang(self) -> None:
        expected_topic_name = "A test message event from golang."
        expected_message = """\
**New message event:** [A test message event from golang.](https://sentry.io/organizations/hypro999-personal-organization/issues/1638844654/events/01ecb45633bc4f5ca940ada671124c8f/)
```quote
**level:** info
**timestamp:** <time:2020-04-30T06:14:13+00:00>
```"""
        self.check_webhook("event_for_message_golang", expected_topic_name, expected_message)

    def test_event_for_message_node(self) -> None:
        expected_topic_name = "Test event from node."
        expected_message = """\
**New message event:** [Test event from node.](https://sentry.io/organizations/hypro999-personal-organization/issues/1638840427/events/6886bb1fe7ce4497b7836f6083d5fd34/)
```quote
**level:** info
**timestamp:** <time:2020-04-30T06:09:56+00:00>
```"""
        self.check_webhook("event_for_message_node", expected_topic_name, expected_message)

    def test_event_for_message_python(self) -> None:
        expected_topic_name = "A simple message-based issue."
        expected_message = """\
**New message event:** [A simple message-based issue.](https://sentry.io/organizations/hypro999-personal-organization/issues/1635261062/events/8da63b42375e4d3b803c377fefb062f8/)
```quote
**level:** info
**timestamp:** <time:2020-04-28T14:05:04+00:00>
```"""
        self.check_webhook("event_for_message_python", expected_topic_name, expected_message)

    def test_issue_assigned_to_individual(self) -> None:
        expected_topic_name = "A test message event from golang."
        expected_message = """Issue **A test message event from golang.** has now been assigned to **Hemanth V. Alluri** by **Hemanth V. Alluri**."""
        self.check_webhook("issue_assigned_to_individual", expected_topic_name, expected_message)

    def test_issue_assigned_to_team(self) -> None:
        expected_topic_name = "Exception: program has entered an invalid state."
        expected_message = """Issue **Exception: program has entered an invalid state.** has now been assigned to **team lone-wolf** by **Hemanth V. Alluri**."""
        self.check_webhook("issue_assigned_to_team", expected_topic_name, expected_message)

    def test_issue_created_for_exception(self) -> None:
        expected_topic_name = "Exception: Custom exception!"
        expected_message = """\
**New issue created:** Exception: Custom exception!
```quote
**level:** error
**timestamp:** <time:2020-04-28T13:56:05+00:00>
**assignee:** No one
```"""
        self.check_webhook("issue_created_for_exception", expected_topic_name, expected_message)

    def test_issue_created_for_message(self) -> None:
        expected_topic_name = "A simple message-based issue."
        expected_message = """\
**New issue created:** A simple message-based issue.
```quote
**level:** info
**timestamp:** <time:2020-04-28T14:05:04+00:00>
**assignee:** No one
```"""
        self.check_webhook("issue_created_for_message", expected_topic_name, expected_message)

    def test_issue_ignored(self) -> None:
        expected_topic_name = "Exception: program has entered an invalid state."
        expected_message = """Issue **Exception: program has entered an invalid state.** was ignored by **Hemanth V. Alluri**."""
        self.check_webhook("issue_ignored", expected_topic_name, expected_message)

    def test_issue_resolved(self) -> None:
        expected_topic_name = "Exception: program has entered an invalid state."
        expected_message = """Issue **Exception: program has entered an invalid state.** was marked as resolved by **Hemanth V. Alluri**."""
        self.check_webhook("issue_resolved", expected_topic_name, expected_message)

    def test_deprecated_exception_message(self) -> None:
        expected_topic_name = "zulip"
        expected_message = """\
New [issue](https://sentry.io/zulip/zulip/issues/156699934/) (level: ERROR):

``` quote
This is an example python exception
```"""
        self.check_webhook("deprecated_exception_message", expected_topic_name, expected_message)

    def test_sample_event_through_alert(self) -> None:
        expected_topic_name = "This is an example Python exception"
        expected_message = """\
**New message event:** [This is an example Python exception](https://sentry.io/organizations/nitk-46/issues/4218258981/events/b6eff1a49b1f4132850b1238d968da70/)
```quote
**level:** error
**timestamp:** <time:2023-05-31T11:06:16+00:00>
```"""
        self.check_webhook("sample_event_through_alert", expected_topic_name, expected_message)

    def test_sample_event_through_plugin(self) -> None:
        expected_topic_name = "This is an example Python exception"
        expected_message = """\
**New message event:** [This is an example Python exception](https://nitk-46.sentry.io/issues/4218258981/events/4dc4fc2858aa450eb658be9e5b8ad149/)
```quote
**level:** error
**timestamp:** <time:2023-07-09T20:41:24+00:00>
```"""
        self.check_webhook("sample_event_through_plugin", expected_topic_name, expected_message)

    def test_raven_sdk_python_event(self) -> None:
        payload = self.get_body("raven_sdk_python_event")
        result = self.client_post(
            self.url,
            payload,
            content_type="application/json",
        )
        self.assert_json_success(result)
        self.assert_in_response(
            "The 'Raven SDK' event isn't currently supported by the Sentry webhook; ignoring",
            result,
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/sentry/view.py
Signals: Django

```python
import logging
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urljoin

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

DEPRECATED_EXCEPTION_MESSAGE_TEMPLATE = """
New [issue]({url}) (level: {level}):

``` quote
{message}
```
"""

MESSAGE_EVENT_TEMPLATE = """
**New message event:** [{title}]({web_link})
```quote
**level:** {level}
**timestamp:** {global_time}
```
"""

EXCEPTION_EVENT_TEMPLATE = """
**New exception:** [{title}]({web_link})
```quote
**level:** {level}
**timestamp:** {global_time}
**filename:** {filename}
```
"""

EXCEPTION_EVENT_TEMPLATE_WITH_TRACEBACK = (
    EXCEPTION_EVENT_TEMPLATE
    + """
Traceback:
```{syntax_highlight_as}
{pre_context}---> {context_line}{post_context}\
```
"""
)
# Because of the \n added at the end of each context element,
# this will actually look better in the traceback.

ISSUE_CREATED_MESSAGE_TEMPLATE = """
**New issue created:** {title}
```quote
**level:** {level}
**timestamp:** {global_time}
**assignee:** {assignee}
```
"""

ISSUE_ASSIGNED_MESSAGE_TEMPLATE = """
Issue **{title}** has now been assigned to **{assignee}** by **{actor}**.
"""

ISSUE_RESOLVED_MESSAGE_TEMPLATE = """
Issue **{title}** was marked as resolved by **{actor}**.
"""

ISSUE_IGNORED_MESSAGE_TEMPLATE = """
Issue **{title}** was ignored by **{actor}**.
"""

# Maps "platform" name provided by Sentry to the Pygments lexer name
syntax_highlight_as_map = {
    "go": "go",
    "java": "java",
    "javascript": "javascript",
    "node": "javascript",
    "python": "python3",
    "ruby": "ruby",
}


def get_global_time(dt_str: str) -> str:
    dt = datetime.fromisoformat(dt_str)
    return datetime_to_global_time(dt)


def is_sample_event(event: dict[str, Any]) -> bool:
    # This is just a heuristic to detect the sample event, this should
    # not be used for making important behavior decisions.
    title = event.get("title", "")
    if title == "This is an example Python exception":
        return True
    return False


def convert_lines_to_traceback_string(lines: list[str] | None) -> str:
    traceback = ""
    if lines is not None:
        for line in lines:
            if line == "":
                traceback += "\n"
            else:
                traceback += f"     {line}\n"
    return traceback


def handle_event_payload(event: dict[str, Any]) -> tuple[str, str]:
    """Handle either an exception type event or a message type event payload."""

    topic_name = event["title"]
    platform_name = event["platform"]
    syntax_highlight_as = syntax_highlight_as_map.get(platform_name, "")
    if syntax_highlight_as == "":  # nocoverage
        logging.info("Unknown Sentry platform: %s", platform_name)

    # We shouldn't support the officially deprecated Raven series of
    # Python SDKs.
    if platform_name == "python" and int(event["version"]) < 7 and not is_sample_event(event):
        # The sample event is still an old "version" -- accept it even
        # though we don't accept events from the old Python SDK.
        raise UnsupportedWebhookEventTypeError("Raven SDK")
    context = {
        "title": topic_name,
        "level": event["level"],
        "web_link": event["web_url"],
        "global_time": get_global_time(event["datetime"]),
    }

    if "exception" in event:
        # The event was triggered by a sentry.capture_exception() call
        # (in the Python Sentry SDK) or something similar.

        filename = event["metadata"].get("filename", None)

        stacktrace = None
        for value in reversed(event["exception"]["values"]):
            if "stacktrace" in value:
                stacktrace = value["stacktrace"]
                break

        if stacktrace and filename:
            exception_frame = None
            for frame in reversed(stacktrace["frames"]):
                if frame.get("filename", None) == filename:
                    exception_frame = frame
                    break

            if (
                exception_frame
                and "context_line" in exception_frame
                and exception_frame["context_line"] is not None
            ):
                pre_context = convert_lines_to_traceback_string(
                    exception_frame.get("pre_context", None)
                )
                context_line = exception_frame["context_line"] + "\n"
                post_context = convert_lines_to_traceback_string(
                    exception_frame.get("post_context", None)
                )

                context.update(
                    syntax_highlight_as=syntax_highlight_as,
                    filename=filename,
                    pre_context=pre_context,
                    context_line=context_line,
                    post_context=post_context,
                )

                body = EXCEPTION_EVENT_TEMPLATE_WITH_TRACEBACK.format(**context)
                return (topic_name, body)

        context.update(filename=filename)  # nocoverage
        body = EXCEPTION_EVENT_TEMPLATE.format(**context)  # nocoverage
        return (topic_name, body)  # nocoverage

    elif "logentry" in event:
        # The event was triggered by a sentry.capture_message() call
        # (in the Python Sentry SDK) or something similar.
        body = MESSAGE_EVENT_TEMPLATE.format(**context)

    else:
        raise UnsupportedWebhookEventTypeError("unknown-event type")

    return (topic_name, body)


def handle_issue_payload(
    action: str, issue: dict[str, Any], actor: dict[str, Any]
) -> tuple[str, str]:
    """Handle either an issue type event."""
    topic_name = issue["title"]
    global_time = get_global_time(issue["lastSeen"])

    if issue["assignedTo"]:
        if issue["assignedTo"]["type"] == "team":
            assignee = "team {}".format(issue["assignedTo"]["name"])
        else:
            assignee = issue["assignedTo"]["name"]
    else:
        assignee = "No one"

    if action == "created":
        context = {
            "title": topic_name,
            "level": issue["level"],
            "global_time": global_time,
            "assignee": assignee,
        }
        body = ISSUE_CREATED_MESSAGE_TEMPLATE.format(**context)

    elif action == "resolved":
        context = {
            "title": topic_name,
            "actor": actor["name"],
        }
        body = ISSUE_RESOLVED_MESSAGE_TEMPLATE.format(**context)

    elif action == "assigned":
        context = {
            "title": topic_name,
            "assignee": assignee,
            "actor": actor["name"],
        }
        body = ISSUE_ASSIGNED_MESSAGE_TEMPLATE.format(**context)

    elif action == "ignored":
        context = {
            "title": topic_name,
            "actor": actor["name"],
        }
        body = ISSUE_IGNORED_MESSAGE_TEMPLATE.format(**context)

    else:
        raise UnsupportedWebhookEventTypeError(f"{action} action")

    return (topic_name, body)


def handle_deprecated_payload(payload: dict[str, Any]) -> tuple[str, str]:
    topic_name = "{}".format(payload.get("project_name"))
    body = DEPRECATED_EXCEPTION_MESSAGE_TEMPLATE.format(
        level=payload["level"].upper(),
        url=payload.get("url"),
        message=payload.get("message"),
    )
    return (topic_name, body)


def transform_webhook_payload(payload: dict[str, Any]) -> dict[str, Any] | None:
    """Attempt to use webhook payload for the notification.

    When the integration is configured as a webhook, instead of being added as
    an internal integration, the payload is slightly different, but has all the
    required information for sending a notification. We transform this payload to
    look like the payload from a "properly configured" integration.
    """
    event = payload.get("event", {})
    # deprecated payloads don't have event_id
    event_id = event.get("event_id")
    if not event_id:
        return None

    event_path = f"events/{event_id}/"
    event["web_url"] = urljoin(payload["url"], event_path)
    timestamp = event.get("timestamp", event["received"])
    event["datetime"] = datetime.fromtimestamp(timestamp, timezone.utc).isoformat(
        timespec="microseconds"
    )
    return payload


@webhook_view("Sentry")
@typed_endpoint
def api_sentry_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[dict[str, Any]],
) -> HttpResponse:
    data = payload.get("data", None)

    if data is None:
        data = transform_webhook_payload(payload)

    # We currently support two types of payloads: events and issues.
    if data:
        if "event" in data:
            topic_name, body = handle_event_payload(data["event"])
        elif "issue" in data:
            topic_name, body = handle_issue_payload(
                payload["action"], data["issue"], payload["actor"]
            )
        else:
            raise UnsupportedWebhookEventTypeError(str(list(data.keys())))
    else:
        topic_name, body = handle_deprecated_payload(payload)

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: deprecated_exception_message.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/deprecated_exception_message.json

```json
{
  "project": "zulip",
  "project_name": "zulip",
  "culprit": "raven.scripts.runner in main",
  "level": "error",
  "url": "https://sentry.io/zulip/zulip/issues/156699934/",
  "logger": null,
  "message": "This is an example python exception",
  "id": "156699934",
  "event": {
    "received": 1473185565.0,
    "sentry.interfaces.User": {
      "username": "getsentry",
      "id": "1671",
      "email": "foo@example.com"
    },
    "sentry.interfaces.Message": {
      "message": "This is an example python exception"
    },
    "errors": [
    ],
    "extra": {
      "emptyList": [
      ],
      "unauthorized": false,
      "emptyMap": {
      },
      "url": "http://example.org/foo/bar/",
      "results": [
        1,
        2,
        3,
        4,
        5
      ],
      "length": 10837790,
      "session": {
        "foo": "bar"
      }
    },
    "fingerprint": [
      "{{ default }}"
    ],
    "modules": {
      "my.package": "1.0.0"
    },
    "sentry.interfaces.Http": {
      "cookies": [
        [
          "foo",
          "bar"
        ],
        [
          "biz",
          "baz"
        ]
      ],
      "url": "http://example.com/foo",
      "headers": [
        [
          "Content-Type",
          "application/json"
        ],
        [
          "Referer",
          "http://example.com"
        ],
        [
          "User-Agent",
          "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.72 Safari/537.36"
        ]
      ],
      "env": {
        "ENV": "prod"
      },
      "query_string": "foo=bar",
      "data": "{\"hello\": \"world\"}",
      "method": "GET"
    },
    "sentry.interfaces.Template": {
      "abs_path": "/srv/example/templates/debug_toolbar/base.html",
      "pre_context": [
        "{% endif %}\n",
        "<script src=\"{% static 'debug_toolbar/js/toolbar.js' %}\"></script>\n",
        "<div id=\"djDebug\" hidden=\"hidden\" dir=\"ltr\"\n"
      ],
      "post_context": [
        "     {{ toolbar.config.ROOT_TAG_EXTRA_ATTRS|safe }}>\n",
        "\t<div hidden=\"hidden\" id=\"djDebugToolbar\">\n",
        "\t\t<ul id=\"djDebugPanelList\">\n"
      ],
      "filename": "debug_toolbar/base.html",
      "lineno": 14,
      "context_line": "     data-store-id=\"{{ toolbar.store_id }}\" data-render-panel-url=\"{% url 'djdt:render_panel' %}\"\n"
    },
    "version": "5",
    "_ref_version": 2,
    "_ref": 77799,
    "type": "default",
    "sentry.interfaces.Stacktrace": {
      "frames": [
        {
          "function": "build_msg",
          "abs_path": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/base.py",
          "pre_context": [
            "                frames = stack",
            "",
            "            data.update({",
            "                'sentry.interfaces.Stacktrace': {",
            "                    'frames': get_stack_info(frames,"
          ],
          "vars": {
            "'frames'": "<generator object iter_stack_frames at 0x107bcc3c0>",
            "'culprit'": null,
            "'event_type'": "'raven.events.Message'",
            "'handler'": "<raven.events.Message object at 0x107bd0890>",
            "'date'": "datetime.datetime(2013, 8, 13, 3, 8, 24, 880386)",
            "'extra'": {
              "'loadavg'": [
                0.37255859375,
                0.5341796875,
                0.62939453125
              ],
              "'user'": "'dcramer'",
              "'go_deeper'": [
                [
                  {
                    "'bar'": "'\\'\\\\\\'[\"\\\\\\\\\\\\\\'baz\\\\\\\\\\\\\\'\"]\\\\\\'\\''",
                    "'foo'": "'\\'\\\\\\'\"\\\\\\\\\\\\\\'bar\\\\\\\\\\\\\\'\"\\\\\\'\\''"
                  }
                ]
              ]
            },
            "'v'": {
              "'message'": "u'This is a test message generated using ``raven test``'",
              "'params'": [
              ]
            },
            "'stack'": true,
            "'event_id'": "'54a322436e1b47b88e239b78998ae742'",
            "'tags'": null,
            "'time_spent'": null,
            "'self'": "<raven.base.Client object at 0x107bb8210>",
            "'data'": {
              "'sentry.interfaces.Message'": {
                "'message'": "u'This is a test message generated using ``raven test``'",
                "'params'": [
                ]
              },
              "'message'": "u'This is a test message generated using ``raven test``'"
            },
            "'result'": {
              "'sentry.interfaces.Message'": {
                "'message'": "u'This is a test message generated using ``raven test``'",
                "'params'": [
                ]
              },
              "'message'": "u'This is a test message generated using ``raven test``'"
            },
            "'kwargs'": {
              "'message'": "'This is a test message generated using ``raven test``'",
              "'level'": 20
            },
            "'k'": "'sentry.interfaces.Message'",
            "'public_key'": null
          },
          "module": "raven.base",
          "filename": "raven/base.py",
          "post_context": [
            "                },",
            "            })",
            "",
            "        if 'sentry.interfaces.Stacktrace' in data:",
            "            if self.include_paths:"
          ],
          "in_app": false,
          "context_line": "                        transformer=self.transform)",
          "lineno": 303
        },
        {
          "function": "capture",
          "abs_path": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/base.py",
          "pre_context": [
            "        if not self.is_enabled():",
            "            return",
            "",
            "        data = self.build_msg(",
            "            event_type, data, date, time_spent, extra, stack, tags=tags,"
          ],
          "vars": {
            "'event_type'": "'raven.events.Message'",
            "'date'": null,
            "'extra'": {
              "'loadavg'": [
                0.37255859375,
                0.5341796875,
                0.62939453125
              ],
              "'user'": "'dcramer'",
              "'go_deeper'": [
                [
                  {
                    "'bar'": "'\\'\\\\\\'[\"\\\\\\\\\\\\\\'baz\\\\\\\\\\\\\\'\"]\\\\\\'\\''",
                    "'foo'": "'\\'\\\\\\'\"\\\\\\\\\\\\\\'bar\\\\\\\\\\\\\\'\"\\\\\\'\\''"
                  }
                ]
              ]
            },
            "'stack'": true,
            "'tags'": null,
            "'time_spent'": null,
            "'self'": "<raven.base.Client object at 0x107bb8210>",
            "'data'": null,
            "'kwargs'": {
              "'message'": "'This is a test message generated using ``raven test``'",
              "'level'": 20
            }
          },
          "module": "raven.base",
          "filename": "raven/base.py",
          "post_context": [
            "",
            "        self.send(**data)",
            "",
            "        return (data.get('event_id'),)",
            ""
          ],
          "in_app": false,
          "context_line": "            **kwargs)",
          "lineno": 459
        },
        {
          "function": "captureMessage",
          "abs_path": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/base.py",
          "pre_context": [
            "        \"\"\"",
            "        Creates an event from ``message``.",
            "",
            "        >>> client.captureMessage('My event just happened!')",
            "        \"\"\""
          ],
          "vars": {
            "'message'": "'This is a test message generated using ``raven test``'",
            "'kwargs'": {
              "'extra'": {
                "'loadavg'": [
                  0.37255859375,
                  0.5341796875,
                  0.62939453125
                ],
                "'user'": "'dcramer'",
                "'go_deeper'": [
                  [
                    "'\\'\\\\\\'{\"\\\\\\\\\\\\\\'bar\\\\\\\\\\\\\\'\": [\"\\\\\\\\\\\\\\'baz\\\\\\\\\\\\\\'\"], \"\\\\\\\\\\\\\\'foo\\\\\\\\\\\\\\'\": \"\\\\\\\\\\\\\\'bar\\\\\\\\\\\\\\'\"}\\\\\\'\\''"
                  ]
                ]
              },
              "'tags'": null,
              "'data'": null,
              "'level'": 20,
              "'stack'": true
            },
            "'self'": "<raven.base.Client object at 0x107bb8210>"
          },
          "module": "raven.base",
          "filename": "raven/base.py",
          "post_context": [
            "",
            "    def captureException(self, exc_info=None, **kwargs):",
            "        \"\"\"",
            "        Creates an event from an exception.",
            ""
          ],
          "in_app": false,
          "context_line": "        return self.capture('raven.events.Message', message=message, **kwargs)",
          "lineno": 577
        },
        {
          "function": "send_test_message",
          "abs_path": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/scripts/runner.py",
          "pre_context": [
            "        level=logging.INFO,",
            "        stack=True,",
            "        tags=options.get('tags', {}),",
            "        extra={",
            "            'user': get_uid(),"
          ],
          "vars": {
            "'client'": "<raven.base.Client object at 0x107bb8210>",
            "'options'": {
              "'tags'": null,
              "'data'": null
            },
            "'data'": null,
            "'k'": "'secret_key'"
          },
          "module": "raven.scripts.runner",
          "filename": "raven/scripts/runner.py",
          "post_context": [
            "        },",
            "    ))",
            "",
            "    if client.state.did_fail():",
            "        print('error!')"
          ],
          "in_app": false,
          "context_line": "            'loadavg': get_loadavg(),",
          "lineno": 77
        },
        {
          "function": "main",
          "abs_path": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/scripts/runner.py",
          "pre_context": [
            "    print(\"Using DSN configuration:\")",
            "    print(\" \", dsn)",
            "    print()",
            "",
            "    client = Client(dsn, include_paths=['raven'])"
          ],
          "vars": {
            "'root'": "<logging.Logger object at 0x107ba5b10>",
            "'parser'": "<argparse.ArgumentParser instance at 0x107ba3368>",
            "'dsn'": "'https://ebc35f33e151401f9deac549978bda11:f3403f81e12e4c24942d505f086b2cad@sentry.io/1'",
            "'opts'": "<Values at 0x107ba3b00: {'data': None, 'tags': None}>",
            "'client'": "<raven.base.Client object at 0x107bb8210>",
            "'args'": [
              "'test'",
              "'https://ebc35f33e151401f9deac549978bda11:f3403f81e12e4c24942d505f086b2cad@sentry.io/1'"
            ]
          },
          "module": "raven.scripts.runner",
          "filename": "raven/scripts/runner.py",
          "lineno": 112,
          "in_app": false,
          "context_line": "    send_test_message(client, opts.__dict__)"
        }
      ],
      "has_system_frames": false,
      "frames_omitted": null
    },
    "tags": [
      [
        "browser",
        "Chrome 28.0"
      ],
      [
        "device",
        "Other"
      ],
      [
        "environment",
        "production"
      ],
      [
        "level",
        "error"
      ],
      [
        "os",
        "Windows 8"
      ],
      [
        "sentry:user",
        "id:1671"
      ],
      [
        "url",
        "http://example.com/foo"
      ]
    ],
    "metadata": {
      "title": "This is an example python exception"
    }
  }
}
```

--------------------------------------------------------------------------------

````
