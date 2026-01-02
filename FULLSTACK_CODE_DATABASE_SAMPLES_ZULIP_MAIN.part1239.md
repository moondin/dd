---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1239
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1239 of 1290)

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

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/raygun/view.py
Signals: Django

```python
from datetime import datetime

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_anything, check_int, check_list, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

ALL_EVENT_TYPES = ["error_notification", "error_activity"]


@webhook_view("Raygun", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_raygun_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    # The payload contains 'event' key. This 'event' key has a value of either
    # 'error_notification' or 'error_activity'. 'error_notification' happens
    # when an error is caught in an application, where as 'error_activity'
    # happens when an action is being taken for the error itself
    # (ignored/resolved/assigned/etc.).
    event = payload["event"].tame(check_string)

    # Because we wanted to create a message for all of the payloads, it is best
    # to handle them separately. This is because some payload keys don't exist
    # in the other event.

    if event == "error_notification":
        message = compose_notification_message(payload)
    elif event == "error_activity":
        message = compose_activity_message(payload)
    else:
        raise UnsupportedWebhookEventTypeError(event)

    topic_name = "test"

    check_send_webhook_message(request, user_profile, topic_name, message, event)

    return json_success(request)


def make_user_stats_chunk(error_dict: WildValue) -> str:
    """Creates a stat chunk about total occurrences and users affected for the
    error.

    Example: usersAffected: 2, totalOccurrences: 10
    Output: 2 users affected with 10 total occurrences

    :param error_dict: The error dictionary containing the error keys and
    values
    :returns: A message chunk that will be added to the main message
    """
    users_affected = error_dict["usersAffected"].tame(check_int)
    total_occurrences = error_dict["totalOccurrences"].tame(check_int)

    # One line is subjectively better than two lines for this.
    return f"* {users_affected} users affected with {total_occurrences} total occurrences\n"


def make_time_chunk(error_dict: WildValue) -> str:
    """Creates a time message chunk.

    Example: firstOccurredOn: "X", lastOccurredOn: "Y"
    Output:
    First occurred: X
    Last occurred: Y

    :param error_dict: The error dictionary containing the error keys and
    values
    :returns: A message chunk that will be added to the main message
    """
    # Make the timestamp more readable to a human.
    time_first = parse_time(error_dict["firstOccurredOn"].tame(check_string))
    time_last = parse_time(error_dict["lastOccurredOn"].tame(check_string))

    # Provide time information about this error,
    return f"* **First occurred**: {time_first}\n* **Last occurred**: {time_last}\n"


def make_message_chunk(message: str) -> str:
    """Creates a message chunk if exists.

    Example: message: "This is an example message" returns "Message: This is an
    example message". Whereas message: "" returns "".

    :param message: The value of message inside of the error dictionary
    :returns: A message chunk if there exists an additional message, otherwise
    returns an empty string.
    """
    # "Message" shouldn't be included if there is none supplied.
    return f"* **Message**: {message}\n" if message != "" else ""


def make_app_info_chunk(app_dict: WildValue) -> str:
    """Creates a message chunk that contains the application info and the link
    to the Raygun dashboard about the application.

    :param app_dict: The application dictionary obtained from the payload
    :returns: A message chunk that will be added to the main message
    """
    app_name = app_dict["name"].tame(check_string)
    app_url = app_dict["url"].tame(check_string)
    return f"* **Application details**: [{app_name}]({app_url})\n"


def notification_message_follow_up(payload: WildValue) -> str:
    """Creates a message for a repeating error follow up

    :param payload: Raygun payload
    :return: Returns the message, somewhat beautifully formatted
    """
    message = ""

    # Link to Raygun about the follow up
    followup_link_md = "[follow-up error]({})".format(payload["error"]["url"].tame(check_string))

    followup_type = payload["eventType"].tame(check_string)

    if followup_type == "HourlyFollowUp":
        prefix = "Hourly"
    else:
        # Cut the "MinuteFollowUp" from the possible event types, then add "
        # minute" after that. So prefix for "OneMinuteFollowUp" is "One
        # minute", where "FiveMinuteFollowUp" is "Five minute".
        prefix = followup_type[: len(followup_type) - 14] + " minute"

    message += f"{prefix} {followup_link_md}:\n"

    # Get the message of the error.
    payload_msg = payload["error"]["message"].tame(check_string)

    message += make_message_chunk(payload_msg)
    message += make_time_chunk(payload["error"])
    message += make_user_stats_chunk(payload["error"])
    message += make_app_info_chunk(payload["application"])

    return message


def notification_message_error_occurred(payload: WildValue) -> str:
    """Creates a message for a new error or reoccurred error

    :param payload: Raygun payload
    :return: Returns the message, somewhat beautifully formatted
    """
    message = ""

    # Provide a clickable link that goes to Raygun about this error.
    error_link_md = "[Error]({})".format(payload["error"]["url"].tame(check_string))

    # Stylize the message based on the event type of the error.
    if payload["eventType"].tame(check_string) == "NewErrorOccurred":
        message += "{}:\n".format(f"New {error_link_md} occurred")
    elif payload["eventType"].tame(check_string) == "ErrorReoccurred":
        message += "{}:\n".format(f"{error_link_md} reoccurred")

    # Get the message of the error. This value can be empty (as in "").
    payload_msg = payload["error"]["message"].tame(check_string)

    message += make_message_chunk(payload_msg)
    message += make_time_chunk(payload["error"])
    message += make_user_stats_chunk(payload["error"])

    # Only NewErrorOccurred and ErrorReoccurred contain an error instance.
    error_instance = payload["error"]["instance"]

    # Extract each of the keys and values in error_instance for easier handle

    # Contains list of tags for the error. Can be empty (null)
    tags = error_instance["tags"]

    # Contains the identity of affected user at the moment this error
    # happened. This surprisingly can be null. Somehow.
    affected_user = error_instance["affectedUser"]

    # Contains custom data for this particular error (if supplied). Can be
    # null.
    custom_data = error_instance["customData"]

    if tags is not None:
        message += "* **Tags**: {}\n".format(", ".join(tags.tame(check_list(check_string))))

    if affected_user is not None:
        user_uuid = affected_user["UUID"].tame(check_string)
        message += f"* **Affected user**: {user_uuid[:6]}...{user_uuid[-5:]}\n"

    if custom_data is not None:
        # We don't know what the keys and values beforehand, so we are forced
        # to iterate.
        for key in sorted(custom_data.keys()):
            message += f"* **{key}**: {custom_data[key].tame(check_anything)}\n"

    message += make_app_info_chunk(payload["application"])

    return message


def compose_notification_message(payload: WildValue) -> str:
    """Composes a message that contains information on the error

    :param payload: Raygun payload
    :return: Returns a response message
    """

    # Get the event type of the error. This can be "NewErrorOccurred",
    # "ErrorReoccurred", "OneMinuteFollowUp", "FiveMinuteFollowUp", ...,
    # "HourlyFollowUp" for notification error.
    event_type = payload["eventType"].tame(check_string)

    # "NewErrorOccurred" and "ErrorReoccurred" contain error instance
    # information, meaning that it has payload['error']['instance']. The other
    # event type (the follow ups) doesn't have this instance.

    # We now split this main function again into two functions. One is for
    # "NewErrorOccurred" and "ErrorReoccurred", and one is for the rest. Both
    # functions will return a text message that is formatted for the chat.
    if event_type in ("NewErrorOccurred", "ErrorReoccurred"):
        return notification_message_error_occurred(payload)
    elif "FollowUp" in event_type:
        return notification_message_follow_up(payload)
    else:
        raise UnsupportedWebhookEventTypeError(event_type)


def activity_message(payload: WildValue) -> str:
    """Creates a message from an activity that is being taken for an error

    :param payload: Raygun payload
    :return: Returns the message, somewhat beautifully formatted
    """
    message = ""

    error_link_md = "[Error]({})".format(payload["error"]["url"].tame(check_string))

    event_type = payload["eventType"].tame(check_string)

    user = payload["error"]["user"].tame(check_string)
    if event_type == "StatusChanged":
        error_status = payload["error"]["status"].tame(check_string)
        message += f"{error_link_md} status changed to **{error_status}** by {user}:\n"
    elif event_type == "CommentAdded":
        comment = payload["error"]["comment"].tame(check_string)
        message += f"{user} commented on {error_link_md}:\n\n``` quote\n{comment}\n```\n"
    elif event_type == "AssignedToUser":
        assigned_to = payload["error"]["assignedTo"].tame(check_string)
        message += f"{user} assigned {error_link_md} to {assigned_to}:\n"

    message += "* **Timestamp**: {}\n".format(
        parse_time(payload["error"]["activityDate"].tame(check_string))
    )

    message += make_app_info_chunk(payload["application"])

    return message


def compose_activity_message(payload: WildValue) -> str:
    """Composes a message that contains an activity that is being taken to
    an error, such as commenting, assigning an error to a user, ignoring the
    error, etc.

    :param payload: Raygun payload
    :return: Returns a response message
    """

    event_type = payload["eventType"].tame(check_string)

    # Activity is separated into three main categories: status changes (
    # ignores, resolved), error is assigned to user, and comment added to
    # an error,

    # But, they all are almost identical and the only differences between them
    # are the keys at line 9 (check fixtures). So there's no need to split
    # the function like the notification one.
    if event_type in ("StatusChanged", "AssignedToUser", "CommentAdded"):
        return activity_message(payload)
    else:
        raise UnsupportedWebhookEventTypeError(event_type)


def parse_time(dt_str: str) -> str:
    """Parses and returns the timestamp provided

    :param timestamp: The timestamp provided by the payload
    :returns: A string containing the time
    """

    dt = datetime.fromisoformat(dt_str)
    return datetime_to_global_time(dt)
```

--------------------------------------------------------------------------------

---[FILE: comment_added_to_error.json]---
Location: zulip-main/zerver/webhooks/raygun/fixtures/comment_added_to_error.json

```json
{
  "event":"error_activity",
  "eventType":"CommentAdded",
  "error":{
    "url":"https://app.raygun.com/error-url",
    "description":"Anita left a comment on error Script Error, 'Ignoring these errors'",
    "activityDate":"1970-01-28T01:49:36Z",
    "message":"Script Error",
    "comment":"Ignoring these errors",
    "user":"Anita Peacock"
  },
  "application":{
    "name":"application name",
    "url":"http://app.raygun.io/application-url"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: error_assigned_to_user.json]---
Location: zulip-main/zerver/webhooks/raygun/fixtures/error_assigned_to_user.json

```json
{
  "event":"error_activity",
  "eventType":"AssignedToUser",
  "error":{
    "url":"https://app.raygun.com/error-url",
    "description":"Error Script Error was assigned to Kyle by Amy",
    "activityDate":"1970-01-28T01:49:36Z",
    "message":"Script Error",
    "assignedTo":"Kyle Kenny",
    "user":"Amy Loondon"
  },
  "application":{
    "name":"application name",
    "url":"http://app.raygun.io/application-url"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: error_status_changed.json]---
Location: zulip-main/zerver/webhooks/raygun/fixtures/error_status_changed.json

```json
{
  "event":"error_activity",
  "eventType":"StatusChanged",
  "error":{
    "url":"https://app.raygun.com/error-url",
    "description":"Emma marked error Script Error as Ignored",
    "activityDate":"1970-01-28T01:49:36Z",
    "message":"Script Error",
    "status":"Ignored",
    "user":"Emma Cat"
  },
  "application":{
    "name":"Best App",
    "url":"http://app.raygun.io/application-url"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: hourly_followup_error.json]---
Location: zulip-main/zerver/webhooks/raygun/fixtures/hourly_followup_error.json

```json
{
  "event":"error_notification",
  "eventType":"HourlyFollowUp",
  "error":{
    "url":"http://app.raygun.io/error-url",
    "message":"",
    "firstOccurredOn":"1970-01-28T01:49:36Z",
    "lastOccurredOn":"1970-01-28T01:49:36Z",
    "usersAffected":1,
    "totalOccurrences":1
  },
  "application":{
    "name":"application name",
    "url":"http://app.raygun.io/application-url"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: new_error.json]---
Location: zulip-main/zerver/webhooks/raygun/fixtures/new_error.json

```json
{
  "event":"error_notification",
  "eventType":"NewErrorOccurred",
  "error":{
    "url":"http://app.raygun.io/error-url",
    "message":"",
    "firstOccurredOn":"1970-01-28T01:49:36Z",
    "lastOccurredOn":"1970-01-28T01:49:36Z",
    "usersAffected":1,
    "totalOccurrences":1,
    "instance":{
      "tags":[
        "test",
        "error-page",
        "v1.0.1",
        "env:staging"
      ],
      "affectedUser":{
        "Identifier":"a9b7d84a-c0d3-4e7e-9ded-1ec13d033846",
        "IsAnonymous":true,
        "UUID":"a9b7d84a-c0d3-4e7e-9ded-1ec13d033846"
      },
      "customData":{
        "pageName":"Error Page",
        "userLoggedIn":true
      }
    }
  },
  "application":{
    "name":"application name",
    "url":"http://app.raygun.io/application-url"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: one_minute_followup_error.json]---
Location: zulip-main/zerver/webhooks/raygun/fixtures/one_minute_followup_error.json

```json
{
  "event":"error_notification",
  "eventType":"OneMinuteFollowUp",
  "error":{
    "url":"http://app.raygun.io/error-url",
    "message":"",
    "firstOccurredOn":"1970-01-28T01:49:36Z",
    "lastOccurredOn":"1970-01-28T01:49:36Z",
    "usersAffected":1,
    "totalOccurrences":1
  },
  "application":{
    "name":"application name",
    "url":"http://app.raygun.io/application-url"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: reoccurred_error.json]---
Location: zulip-main/zerver/webhooks/raygun/fixtures/reoccurred_error.json

```json
{
  "event":"error_notification",
  "eventType":"ErrorReoccurred",
  "error":{
    "url":"http://app.raygun.io/error-url",
    "message":"",
    "firstOccurredOn":"1970-01-28T01:49:36Z",
    "lastOccurredOn":"1970-01-28T01:49:36Z",
    "usersAffected":1,
    "totalOccurrences":1,
    "instance":{
      "tags":[
        "test",
        "error-page",
        "v1.0.1",
        "env:staging"
      ],
      "affectedUser":{
        "Identifier":"a9b7d84a-c0d3-4e7e-9ded-1ec13d033846",
        "IsAnonymous":true,
        "UUID":"a9b7d84a-c0d3-4e7e-9ded-1ec13d033846"
      },
      "customData":{
        "pageName":"Error Page",
        "userLoggedIn":true
      }
    }
  },
  "application":{
    "name":"application name",
    "url":"http://app.raygun.io/application-url"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/reviewboard/doc.md

```text
# Zulip Review Board integration

Get Review Board notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On your Review Board **Dashboard**, click your team's name in the top-right
   corner, and click **Team administration**. Select **WebHooks** on the
   left sidebar, and click **+ Create a WebHook**.

1. Make sure the **Enabled** option is checked. Set **URL** to the URL generated
   above, and select the [events](#filtering-incoming-events) you'd like to
   be notified about. Set **Encoding** to **JSON**, and click **Create WebHook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/reviewboard/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/reviewboard/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class ReviewBoardHookTests(WebhookTestCase):
    CHANNEL_NAME = "reviewboard"
    URL_TEMPLATE = "/api/v1/external/reviewboard?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "reviewboard"

    def test_review_request_published(self) -> None:
        expected_topic_name = "Scheduler"
        expected_message = "**eeshangarg** opened [#2: Initial commit](https://rbcommons.com/s/zulip/r/2/):\n\n``` quote\n**Description**: Initial commit\n**Status**: pending\n**Target people**: **drsbgarg**\n**Branch**: master\n```"
        self.check_webhook("review_request_published", expected_topic_name, expected_message)

    def test_review_request_published_with_multiple_target_people(self) -> None:
        expected_topic_name = "Scheduler"
        expected_message = "**eeshangarg** opened [#2: Initial commit](https://rbcommons.com/s/zulip/r/2/):\n\n``` quote\n**Description**: Initial commit\n**Status**: pending\n**Target people**: **drsbgarg**, **johndoe**, and **janedoe**\n**Branch**: master\n```"
        self.check_webhook(
            "review_request_published__with_multiple_target_people",
            expected_topic_name,
            expected_message,
        )

    def test_review_request_reopened(self) -> None:
        expected_topic_name = "Scheduler"
        expected_message = "**eeshangarg** reopened [#1: Initial commit (first iteration)](https://rbcommons.com/s/zulip/r/1/):\n\n``` quote\n**Description**: Initial commit (first iteration)\n**Status**: pending\n**Target people**: **drsbgarg**\n**Branch**: master\n```"
        self.check_webhook("review_request_reopened", expected_topic_name, expected_message)

    def test_review_request_closed(self) -> None:
        expected_topic_name = "Scheduler"
        expected_message = "**eeshangarg** closed [#1: Initial commit (first iteration)](https://rbcommons.com/s/zulip/r/1/):\n\n``` quote\n**Description**: Initial commit (first iteration)\n**Status**: submitted\n**Target people**: **drsbgarg**\n**Close type**: submitted\n**Branch**: master\n```"
        self.check_webhook("review_request_closed", expected_topic_name, expected_message)

    def test_review_published(self) -> None:
        expected_topic_name = "Scheduler"
        expected_message = "**eeshangarg** [reviewed](https://rbcommons.com/s/zulip/r/1/#review651728) [#1: Initial commit (first iteration)](https://rbcommons.com/s/zulip/r/1/):\n\n**Review**:\n``` quote\nLeft some minor comments, thanks!\n```"
        self.check_webhook("review_published", expected_topic_name, expected_message)

    def test_reply_published(self) -> None:
        expected_topic_name = "Scheduler"
        expected_message = "**drsbgarg** [replied](https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/) to [#1: Initial commit (first iteration)](https://rbcommons.com/s/zulip/api/review-requests/1/):\n\n**Reply**:\n``` quote\n\n```"
        self.check_webhook("reply_published", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/reviewboard/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_none_or, check_string
from zerver.lib.webhooks.common import (
    check_send_webhook_message,
    get_http_headers_from_filename,
    validate_extract_webhook_http_header,
)
from zerver.models import UserProfile

REVIEW_REQUEST_PUBLISHED = """
**{user_name}** opened [#{id}: {review_request_title}]({review_request_url}):
"""

REVIEW_REQUEST_REOPENED = """
**{user_name}** reopened [#{id}: {review_request_title}]({review_request_url}):
"""

REVIEW_REQUEST_CLOSED = """
**{user_name}** closed [#{id}: {review_request_title}]({review_request_url}):
"""

REVIEW_PUBLISHED = """
**{user_name}** [reviewed]({review_url}) [#{id}: {review_request_title}]({review_request_url}):

**Review**:
``` quote
{review_body_top}
```
"""

REVIEW_REQUEST_DETAILS = """
``` quote
**Description**: {description}
**Status**: {status}
**Target people**: {target_people}
{extra_info}
```
"""

REPLY_PUBLISHED = """
**{user_name}** [replied]({reply_url}) to [#{id}: {review_request_title}]({review_request_url}):

**Reply**:
``` quote
{reply_body_top}
```
"""

BRANCH_TEMPLATE = "**Branch**: {branch_name}"

fixture_to_headers = get_http_headers_from_filename("HTTP_X_REVIEWBOARD_EVENT")


def get_target_people_string(payload: WildValue) -> str:
    result = ""
    target_people = payload["review_request"]["target_people"]
    if len(target_people) == 1:
        result = "**{title}**".format(title=target_people[0]["title"].tame(check_string))
    else:
        for target_index in range(len(target_people) - 1):
            result += "**{title}**, ".format(
                title=target_people[target_index]["title"].tame(check_string)
            )
        result += "and **{title}**".format(title=target_people[-1]["title"].tame(check_string))

    return result


def get_review_published_body(payload: WildValue) -> str:
    kwargs = {
        "review_url": payload["review"]["absolute_url"].tame(check_string),
        "id": payload["review_request"]["id"].tame(check_int),
        "review_request_title": payload["review_request"]["summary"].tame(check_string),
        "review_request_url": payload["review_request"]["absolute_url"].tame(check_string),
        "user_name": payload["review"]["links"]["user"]["title"].tame(check_string),
        "review_body_top": payload["review"]["body_top"].tame(check_string),
    }

    return REVIEW_PUBLISHED.format(**kwargs).strip()


def get_reply_published_body(payload: WildValue) -> str:
    kwargs = {
        "reply_url": payload["reply"]["links"]["self"]["href"].tame(check_string),
        "id": payload["review_request"]["id"].tame(check_int),
        "review_request_title": payload["review_request"]["summary"].tame(check_string),
        "review_request_url": payload["review_request"]["links"]["self"]["href"].tame(check_string),
        "user_name": payload["reply"]["links"]["user"]["title"].tame(check_string),
        "user_url": payload["reply"]["links"]["user"]["href"].tame(check_string),
        "reply_body_top": payload["reply"]["body_top"].tame(check_string),
    }

    return REPLY_PUBLISHED.format(**kwargs).strip()


def get_review_request_published_body(payload: WildValue) -> str:
    kwargs = {
        "id": payload["review_request"]["id"].tame(check_int),
        "review_request_title": payload["review_request"]["summary"].tame(check_string),
        "review_request_url": payload["review_request"]["absolute_url"].tame(check_string),
        "user_name": payload["review_request"]["links"]["submitter"]["title"].tame(check_string),
        "description": payload["review_request"]["description"].tame(check_string),
        "status": payload["review_request"]["status"].tame(check_string),
        "target_people": get_target_people_string(payload),
        "extra_info": "",
    }

    message = REVIEW_REQUEST_PUBLISHED + REVIEW_REQUEST_DETAILS
    branch = payload["review_request"].get("branch").tame(check_none_or(check_string))
    if branch and branch is not None:
        branch_info = BRANCH_TEMPLATE.format(branch_name=branch)
        kwargs["extra_info"] = branch_info

    return message.format(**kwargs).strip()


def get_review_request_reopened_body(payload: WildValue) -> str:
    kwargs = {
        "id": payload["review_request"]["id"].tame(check_int),
        "review_request_title": payload["review_request"]["summary"].tame(check_string),
        "review_request_url": payload["review_request"]["absolute_url"].tame(check_string),
        "user_name": payload["reopened_by"]["username"].tame(check_string),
        "description": payload["review_request"]["description"].tame(check_string),
        "status": payload["review_request"]["status"].tame(check_string),
        "target_people": get_target_people_string(payload),
        "extra_info": "",
    }

    message = REVIEW_REQUEST_REOPENED + REVIEW_REQUEST_DETAILS
    branch = payload["review_request"].get("branch").tame(check_none_or(check_string))
    if branch and branch is not None:
        branch_info = BRANCH_TEMPLATE.format(branch_name=branch)
        kwargs["extra_info"] = branch_info

    return message.format(**kwargs).strip()


def get_review_request_closed_body(payload: WildValue) -> str:
    kwargs = {
        "id": payload["review_request"]["id"].tame(check_int),
        "review_request_title": payload["review_request"]["summary"].tame(check_string),
        "review_request_url": payload["review_request"]["absolute_url"].tame(check_string),
        "user_name": payload["closed_by"]["username"].tame(check_string),
        "description": payload["review_request"]["description"].tame(check_string),
        "status": payload["review_request"]["status"].tame(check_string),
        "target_people": get_target_people_string(payload),
        "extra_info": "**Close type**: {}".format(payload["close_type"].tame(check_string)),
    }

    message = REVIEW_REQUEST_CLOSED + REVIEW_REQUEST_DETAILS
    branch = payload["review_request"].get("branch").tame(check_none_or(check_string))
    if branch and branch is not None:
        branch_info = BRANCH_TEMPLATE.format(branch_name=branch)
        kwargs["extra_info"] = "{}\n{}".format(kwargs["extra_info"], branch_info)

    return message.format(**kwargs).strip()


def get_review_request_repo_title(payload: WildValue) -> str:
    return payload["review_request"]["links"]["repository"]["title"].tame(check_string)


RB_MESSAGE_FUNCTIONS = {
    "review_request_published": get_review_request_published_body,
    "review_request_reopened": get_review_request_reopened_body,
    "review_request_closed": get_review_request_closed_body,
    "review_published": get_review_published_body,
    "reply_published": get_reply_published_body,
}

ALL_EVENT_TYPES = list(RB_MESSAGE_FUNCTIONS.keys())


@webhook_view("ReviewBoard", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_reviewboard_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    event_type = validate_extract_webhook_http_header(
        request, "X-ReviewBoard-Event", "Review Board"
    )

    body_function = RB_MESSAGE_FUNCTIONS.get(event_type)
    if body_function is not None:
        body = body_function(payload)
        topic_name = get_review_request_repo_title(payload)
        check_send_webhook_message(request, user_profile, topic_name, body, event_type)
    else:
        raise UnsupportedWebhookEventTypeError(event_type)

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: reply_published.json]---
Location: zulip-main/zerver/webhooks/reviewboard/fixtures/reply_published.json

```json
{
    "diff_comments":[
        {
            "issue_opened":false,
            "interfilediff":null,
            "num_lines":1,
            "links":{
                "self":{
                    "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/diff-comments/778505/",
                    "method":"GET"
                },
                "update":{
                    "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/diff-comments/778505/",
                    "method":"PUT"
                },
                "user":{
                    "href":"https://rbcommons.com/s/zulip/api/users/drsbgarg/",
                    "method":"GET",
                    "title":"drsbgarg"
                },
                "reply_to":{
                    "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/diff-comments/778500/",
                    "method":"GET",
                    "title":"I think we should get rid of this extra whitespace here"
                },
                "delete":{
                    "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/diff-comments/778505/",
                    "method":"DELETE"
                },
                "filediff":{
                    "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diffs/1/files/6128836/",
                    "method":"GET",
                    "title":"AddSpaces.java (PRE-CREATION) -> AddSpaces.java (dc54788b2bf0324a3228faa7224c3c523582d9f6)"
                }
            },
            "timestamp":"2018-10-26T15:57:39Z",
            "text_type":"markdown",
            "public":true,
            "text":"I agree, I'll push another diff addressing that. Thanks for the review! :)",
            "first_line":81,
            "extra_data":{

            },
            "id":778505,
            "issue_status":""
        }
    ],
    "file_attachment_comments":[

    ],
    "general_comments":[

    ],
    "screenshot_comments":[

    ],
    "reply":{
        "body_top":"",
        "extra_data":{

        },
        "links":{
            "diff_comments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/diff-comments/",
                "method":"GET"
            },
            "file_attachment_comments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/file-attachment-comments/",
                "method":"GET"
            },
            "self":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/",
                "method":"GET"
            },
            "update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/",
                "method":"PUT"
            },
            "general_comments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/general-comments/",
                "method":"GET"
            },
            "screenshot_comments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/screenshot-comments/",
                "method":"GET"
            },
            "user":{
                "href":"https://rbcommons.com/s/zulip/api/users/drsbgarg/",
                "method":"GET",
                "title":"drsbgarg"
            },
            "delete":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/651732/",
                "method":"DELETE"
            }
        },
        "timestamp":"2018-10-26T15:57:39Z",
        "public":true,
        "text_type":null,
        "body_bottom":"",
        "body_top_text_type":"plain",
        "id":651732,
        "body_bottom_text_type":"plain"
    },
    "review_request":{
        "status":"pending",
        "last_updated":"2018-10-26T15:57:39Z",
        "target_people":[
            {
                "href":"https://rbcommons.com/s/zulip/api/users/drsbgarg/",
                "method":"GET",
                "title":"drsbgarg"
            }
        ],
        "depends_on":[

        ],
        "description_text_type":"plain",
        "issue_resolved_count":0,
        "commit_id":"4f8a093f7046fcc58b0826d21586d1b537b0112b",
        "ship_it_count":0,
        "close_description_text_type":"plain",
        "id":1,
        "links":{
            "diffs":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diffs/",
                "method":"GET"
            },
            "latest_diff":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diffs/1/",
                "method":"GET"
            },
            "repository":{
                "href":"https://rbcommons.com/s/zulip/api/repositories/2147/",
                "method":"GET",
                "title":"Scheduler"
            },
            "screenshots":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/screenshots/",
                "method":"GET"
            },
            "self":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"GET"
            },
            "status_updates":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/status-updates/",
                "method":"GET"
            },
            "update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"PUT"
            },
            "last_update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/last-update/",
                "method":"GET"
            },
            "reviews":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/",
                "method":"GET"
            },
            "file_attachments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/file-attachments/",
                "method":"GET"
            },
            "draft":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/draft/",
                "method":"GET"
            },
            "diff_context":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diff-context/",
                "method":"GET"
            },
            "submitter":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/",
                "method":"GET",
                "title":"eeshangarg"
            },
            "changes":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/changes/",
                "method":"GET"
            },
            "delete":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"DELETE"
            }
        },
        "issue_dropped_count":0,
        "bugs_closed":[

        ],
        "testing_done":"This was tested thoroughly",
        "branch":"master",
        "text_type":null,
        "time_added":"2018-10-26T15:24:18Z",
        "extra_data":{
            "calculated_trophies":true
        },
        "public":true,
        "issue_verifying_count":0,
        "close_description":null,
        "blocks":[

        ],
        "description":"Initial commit (first iteration)",
        "testing_done_text_type":"markdown",
        "issue_open_count":0,
        "approved":false,
        "url":"/s/zulip/r/1/",
        "absolute_url":"https://rbcommons.com/s/zulip/r/1/",
        "target_groups":[

        ],
        "summary":"Initial commit (first iteration)",
        "changenum":null,
        "approval_failure":"The review request has not been marked \"Ship It!\""
    },
    "event":"reply_published"
}
```

--------------------------------------------------------------------------------

````
