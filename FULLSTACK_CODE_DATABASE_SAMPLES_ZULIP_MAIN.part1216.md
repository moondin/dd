---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1216
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1216 of 1290)

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
Location: zulip-main/zerver/webhooks/jira/view.py
Signals: Django

```python
# Webhooks for external integrations.
import re
import string
from collections.abc import Callable

from django.core.exceptions import ValidationError
from django.db.models import Q
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import AnomalousWebhookPayloadError, UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_none_or, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import Realm, UserProfile
from zerver.models.users import get_user_by_delivery_email

IGNORED_EVENTS = [
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


def guess_zulip_user_from_jira(jira_username: str, realm: Realm) -> UserProfile | None:
    try:
        # Try to find a matching user in Zulip
        # We search a user's full name, short name,
        # and beginning of email address
        user = UserProfile.objects.filter(
            Q(full_name__iexact=jira_username) | Q(email__istartswith=jira_username),
            is_active=True,
            realm=realm,
        ).order_by("id")[0]
        return user
    except IndexError:
        return None


def convert_jira_markup(content: str, realm: Realm) -> str:
    # Attempt to do some simplistic conversion of Jira
    # formatting to Markdown, for consumption in Zulip

    # Jira uses *word* for bold, we use **word**
    content = re.sub(r"\*([^\*]+)\*", r"**\1**", content)

    # Jira uses {{word}} for monospacing, we use `word`
    content = re.sub(r"{{([^\*]+?)}}", r"`\1`", content)

    # Starting a line with bq. block quotes that line
    content = re.sub(r"bq\. (.*)", r"> \1", content)

    # Wrapping a block of code in {quote}stuff{quote} also block-quotes it
    quote_re = re.compile(r"{quote}(.*?){quote}", re.DOTALL)
    content = re.sub(quote_re, r"~~~ quote\n\1\n~~~", content)

    # {noformat}stuff{noformat} blocks are just code blocks with no
    # syntax highlighting
    noformat_re = re.compile(r"{noformat}(.*?){noformat}", re.DOTALL)
    content = re.sub(noformat_re, r"~~~\n\1\n~~~", content)

    # Code blocks are delineated by {code[: lang]} {code}
    code_re = re.compile(r"{code[^\n]*}(.*?){code}", re.DOTALL)
    content = re.sub(code_re, r"~~~\n\1\n~~~", content)

    # Links are of form: [https://www.google.com] or [Link Title|https://www.google.com]
    # In order to support both forms, we don't match a | in bare links
    content = re.sub(r"\[([^\|~]+?)\]", r"[\1](\1)", content)

    # Full links which have a | are converted into a better Markdown link
    full_link_re = re.compile(r"\[(?:(?P<title>[^|~]+)\|)(?P<url>[^\]]*)\]")
    content = re.sub(full_link_re, r"[\g<title>](\g<url>)", content)

    # Try to convert a Jira user mention of format [~username] into a
    # Zulip user mention. We don't know the email, just the Jira username,
    # so we naively guess at their Zulip account using this
    mention_re = re.compile(r"\[~(.*?)\]")
    for username in mention_re.findall(content):
        # Try to look up username
        user_profile = guess_zulip_user_from_jira(username, realm)
        if user_profile:
            replacement = f"**{user_profile.full_name}**"
        else:
            replacement = f"**{username}**"

        content = content.replace(f"[~{username}]", replacement)

    return content


def get_in(payload: WildValue, keys: list[str], default: str = "") -> WildValue:
    try:
        for key in keys:
            payload = payload[key]
    except (AttributeError, KeyError, TypeError, ValidationError):
        return WildValue("default", default)
    return payload


def get_issue_string(
    payload: WildValue, issue_id: str | None = None, with_title: bool = False
) -> str:
    # Guess the URL as it is not specified in the payload
    # We assume that there is a /browse/BUG-### page
    # from the REST URL of the issue itself
    if issue_id is None:
        issue_id = get_issue_id(payload)

    if with_title:
        text = f"{issue_id}: {get_issue_title(payload)}"
    else:
        text = issue_id

    base_url = re.match(
        r"(.*)\/rest\/api/.*", get_in(payload, ["issue", "self"]).tame(check_string)
    )
    if base_url and len(base_url.groups()):
        return f"[{text}]({base_url.group(1)}/browse/{issue_id})"
    else:
        return text


def get_assignee_mention(assignee_email: str, realm: Realm) -> str:
    if assignee_email != "":
        try:
            assignee_name = get_user_by_delivery_email(assignee_email, realm).full_name
        except UserProfile.DoesNotExist:
            assignee_name = assignee_email
        return f"**{assignee_name}**"
    return ""


def get_issue_author(payload: WildValue) -> str:
    return get_in(payload, ["user", "displayName"]).tame(check_string)


def get_issue_id(payload: WildValue) -> str:
    if "issue" not in payload:
        # Some ancient version of Jira or one of its extensions posts
        # comment_created events without an "issue" element.  For
        # these, the best we can do is extract the Jira-internal
        # issue number and use that in the topic.
        #
        # Users who want better formatting can upgrade Jira.
        return payload["comment"]["self"].tame(check_string).split("/")[-3]

    return get_in(payload, ["issue", "key"]).tame(check_string)


def get_issue_title(payload: WildValue) -> str:
    if "issue" not in payload:
        # Some ancient version of Jira or one of its extensions posts
        # comment_created events without an "issue" element.  For
        # these, the best we can do is extract the Jira-internal
        # issue number and use that in the topic.
        #
        # Users who want better formatting can upgrade Jira.
        return "Upgrade Jira to get the issue title here."

    return get_in(payload, ["issue", "fields", "summary"]).tame(check_string)


def get_issue_topic(payload: WildValue) -> str:
    return f"{get_issue_id(payload)}: {get_issue_title(payload)}"


def get_sub_event_for_update_issue(payload: WildValue) -> str:
    sub_event = payload.get("issue_event_type_name", "").tame(check_string)
    if sub_event == "":
        if payload.get("comment"):
            return "issue_commented"
        elif payload.get("transition"):
            return "issue_transited"
    return sub_event


def get_event_type(payload: WildValue) -> str | None:
    event = payload.get("webhookEvent").tame(check_none_or(check_string))
    if event is None and payload.get("transition"):
        event = "jira:issue_updated"
    return event


def add_change_info(
    content: str, field: str | None, from_field: str | None, to_field: str | None
) -> str:
    content += f"* Changed {field}"
    if from_field:
        content += f" from **{from_field}**"
    if to_field:
        content += f" to {to_field}\n"
    return content


def handle_updated_issue_event(payload: WildValue, user_profile: UserProfile) -> str:
    # Reassigned, commented, reopened, and resolved events are all bundled
    # into this one 'updated' event type, so we try to extract the meaningful
    # event that happened
    issue_id = get_in(payload, ["issue", "key"]).tame(check_string)
    issue = get_issue_string(payload, issue_id, True)

    assignee_email = get_in(payload, ["issue", "fields", "assignee", "emailAddress"], "").tame(
        check_string
    )
    assignee_mention = get_assignee_mention(assignee_email, user_profile.realm)

    if assignee_mention != "":
        assignee_blurb = f" (assigned to {assignee_mention})"
    else:
        assignee_blurb = ""

    sub_event = get_sub_event_for_update_issue(payload)
    if "comment" in sub_event:
        if sub_event == "issue_commented":
            verb = "commented on"
        elif sub_event == "issue_comment_edited":
            verb = "edited a comment on"
        else:
            verb = "deleted a comment from"

        if payload.get("webhookEvent").tame(check_none_or(check_string)) == "comment_created":
            author = payload["comment"]["author"]["displayName"].tame(check_string)
        else:
            author = get_issue_author(payload)

        content = f"{author} {verb} {issue}{assignee_blurb}"
        comment = get_in(payload, ["comment", "body"]).tame(check_string)
        if comment:
            comment = convert_jira_markup(comment, user_profile.realm)
            content = f"{content}:\n\n``` quote\n{comment}\n```"
        else:
            content = f"{content}."
    else:
        content = f"{get_issue_author(payload)} updated {issue}{assignee_blurb}:\n\n"
        changelog = payload.get("changelog")

        if changelog:
            # Use the changelog to display the changes, whitelist types we accept
            items = changelog.get("items")
            for item in items:
                field = item.get("field").tame(check_none_or(check_string))

                if field == "assignee" and assignee_mention != "":
                    target_field_string = assignee_mention
                else:
                    # Convert a user's target to a @-mention if possible
                    target_field_string = "**{}**".format(
                        item.get("toString").tame(check_none_or(check_string))
                    )

                from_field_string = item.get("fromString").tame(check_none_or(check_string))
                if target_field_string or from_field_string:
                    content = add_change_info(
                        content, field, from_field_string, target_field_string
                    )

        elif sub_event == "issue_transited":
            from_field_string = get_in(payload, ["transition", "from_status"]).tame(check_string)
            target_field_string = "**{}**".format(
                get_in(payload, ["transition", "to_status"]).tame(check_string)
            )
            if target_field_string or from_field_string:
                content = add_change_info(content, "status", from_field_string, target_field_string)

    return content


def handle_created_issue_event(payload: WildValue, user_profile: UserProfile) -> str:
    template = """
{author} created {issue_string}:

* **Priority**: {priority}
* **Assignee**: {assignee}
""".strip()

    return template.format(
        author=get_issue_author(payload),
        issue_string=get_issue_string(payload, with_title=True),
        priority=get_in(payload, ["issue", "fields", "priority", "name"]).tame(check_string),
        assignee=get_in(payload, ["issue", "fields", "assignee", "displayName"], "no one").tame(
            check_string
        ),
    )


def handle_deleted_issue_event(payload: WildValue, user_profile: UserProfile) -> str:
    template = "{author} deleted {issue_string}{punctuation}"
    title = get_issue_title(payload)
    punctuation = "." if title[-1] not in string.punctuation else ""
    return template.format(
        author=get_issue_author(payload),
        issue_string=get_issue_string(payload, with_title=True),
        punctuation=punctuation,
    )


def normalize_comment(comment: str) -> str:
    # Here's how Jira escapes special characters in their payload:
    # ,.?\\!\n\"'\n\\[]\\{}()\n@#$%^&*\n~`|/\\\\
    # for some reason, as of writing this, ! has two '\' before it.
    normalized_comment = comment.replace("\\!", "!")
    return normalized_comment


def handle_comment_created_event(payload: WildValue, user_profile: UserProfile) -> str:
    return "{author} commented on {issue_string}\
\n``` quote\n{comment}\n```\n".format(
        author=payload["comment"]["author"]["displayName"].tame(check_string),
        issue_string=get_issue_string(payload, with_title=True),
        comment=normalize_comment(payload["comment"]["body"].tame(check_string)),
    )


def handle_comment_updated_event(payload: WildValue, user_profile: UserProfile) -> str:
    return "{author} updated their comment on {issue_string}\
\n``` quote\n{comment}\n```\n".format(
        author=payload["comment"]["author"]["displayName"].tame(check_string),
        issue_string=get_issue_string(payload, with_title=True),
        comment=normalize_comment(payload["comment"]["body"].tame(check_string)),
    )


def handle_comment_deleted_event(payload: WildValue, user_profile: UserProfile) -> str:
    return "{author} deleted their comment on {issue_string}\
\n``` quote\n~~{comment}~~\n```\n".format(
        author=payload["comment"]["author"]["displayName"].tame(check_string),
        issue_string=get_issue_string(payload, with_title=True),
        comment=normalize_comment(payload["comment"]["body"].tame(check_string)),
    )


JIRA_CONTENT_FUNCTION_MAPPER: dict[str, Callable[[WildValue, UserProfile], str] | None] = {
    "jira:issue_created": handle_created_issue_event,
    "jira:issue_deleted": handle_deleted_issue_event,
    "jira:issue_updated": handle_updated_issue_event,
    "comment_created": handle_comment_created_event,
    "comment_updated": handle_comment_updated_event,
    "comment_deleted": handle_comment_deleted_event,
}

ALL_EVENT_TYPES = list(JIRA_CONTENT_FUNCTION_MAPPER.keys())


@webhook_view("Jira", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_jira_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    event = get_event_type(payload)
    if event in IGNORED_EVENTS:
        return json_success(request)

    if event is None:
        raise AnomalousWebhookPayloadError

    if event is not None:
        content_func = JIRA_CONTENT_FUNCTION_MAPPER.get(event)

    if content_func is None:
        raise UnsupportedWebhookEventTypeError(event)

    topic_name = get_issue_topic(payload)
    content: str = content_func(payload, user_profile)

    check_send_webhook_message(
        request, user_profile, topic_name, content, event, unquote_url_parameters=True
    )
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: change_status_v1.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/change_status_v1.json

```json
{
  "transition": {
    "workflowId": 10200,
    "workflowName": "TestProj Workflow",
    "transitionId": 3,
    "transitionName": "Reopen Issue",
    "from_status": "To Do",
    "to_status": "In Progress"
  },
  "comment": "",
  "user": {
    "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
    "name": "leo",
    "emailAddress": "othello@zulip.com",
    "avatarUrls": {
      "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
      "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
      "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
      "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
    },
    "displayName": "Leonardo Franchi [Administrator]",
    "active": true
  },
  "issue": {
    "id": "10200",
    "self": "https://zulipp.atlassian.net/rest/api/2/issue/10200",
    "key": "TEST-1",
    "fields": {
      "summary": "Fix That",
      "progress": {
        "progress": 0,
        "total": 0
      },
      "timetracking": {},
      "issuetype": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issuetype/1",
        "id": "1",
        "description": "A problem which impairs or prevents the functions of the product.",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/issuetypes/bug.png",
        "name": "Bug",
        "subtask": false
      },
      "timespent": null,
      "reporter": {
        "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
        "name": "leo",
        "emailAddress": "othello@zulip.com",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
          "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
          "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
          "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leonardo Franchi [Administrator]",
        "active": true
      },
      "created": "2013-05-23T11:04:49.965-0400",
      "updated": "2013-05-23T11:07:13.541-0400",
      "priority": {
        "self": "https://zulipp.atlassian.net/rest/api/2/priority/3",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/priorities/major.png",
        "name": "Major",
        "id": "3"
      },
      "description": null,
      "customfield_10001": null,
      "customfield_10002": null,
      "customfield_10003": null,
      "issuelinks": [],
      "customfield_10000": "1_*:*_1_*:*_19188_*|*_5_*:*_2_*:*_86333_*|*_4_*:*_2_*:*_9853",
      "subtasks": [],
      "customfield_10008": null,
      "customfield_10007": null,
      "status": {
        "self": "https://zulipp.atlassian.net/rest/api/2/status/5",
        "description": "A resolution has been taken, and it is awaiting verification by reporter. From here issues are either reopened, or are closed.",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/statuses/resolved.png",
        "name": "Resolved",
        "id": "5"
      },
      "customfield_10006": "5",
      "labels": [],
      "workratio": -1,
      "project": {
        "self": "https://zulipp.atlassian.net/rest/api/2/project/TEST",
        "id": "10000",
        "key": "TEST",
        "name": "TestProj",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/projectavatar?size=xsmall&pid=10000&avatarId=10011",
          "24x24": "https://zulipp.atlassian.net/secure/projectavatar?size=small&pid=10000&avatarId=10011",
          "32x32": "https://zulipp.atlassian.net/secure/projectavatar?size=medium&pid=10000&avatarId=10011",
          "48x48": "https://zulipp.atlassian.net/secure/projectavatar?pid=10000&avatarId=10011"
        }
      },
      "environment": null,
      "customfield_10014": null,
      "customfield_10015": null,
      "lastViewed": "2013-05-23T11:07:38.760-0400",
      "aggregateprogress": {
        "progress": 0,
        "total": 0
      },
      "customfield_10012": null,
      "components": [],
      "customfield_10013": null,
      "comment": {
        "startAt": 0,
        "maxResults": 0,
        "total": 0,
        "comments": []
      },
      "timeoriginalestimate": null,
      "customfield_10017": null,
      "customfield_10016": null,
      "customfield_10019": null,
      "customfield_10018": null,
      "votes": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-1/votes",
        "votes": 0,
        "hasVoted": false
      },
      "fixVersions": [],
      "resolution": {
        "self": "https://zulipp.atlassian.net/rest/api/2/resolution/1",
        "id": "1",
        "description": "A fix for this issue is checked into the tree and tested.",
        "name": "Fixed"
      },
      "resolutiondate": "2013-05-23T11:07:13.474-0400",
      "aggregatetimeoriginalestimate": null,
      "duedate": null,
      "customfield_10020": null,
      "customfield_10021": "Not Started",
      "watches": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-1/watchers",
        "watchCount": 1,
        "isWatching": true
      },
      "worklog": {
        "startAt": 0,
        "maxResults": 0,
        "total": 0,
        "worklogs": []
      },
      "attachment": [],
      "aggregatetimeestimate": null,
      "versions": [],
      "timeestimate": null,
      "aggregatetimespent": null
    }
  },
  "timestamp": 1369321658777
}
```

--------------------------------------------------------------------------------

---[FILE: change_status_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/change_status_v2.json

```json
{
  "timestamp": 1485797534721,
  "webhookEvent": "jira:issue_updated",
  "issue_event_type_name": "issue_generic",
  "user": {
    "self": "https://zulipp.atlassian.net/rest/api/2/user?username=admin",
    "name": "admin",
    "key": "admin",
    "emailAddress": "kolaszek@tlen.pl",
    "avatarUrls": {
      "48x48": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=48",
      "24x24": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=24",
      "16x16": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=16",
      "32x32": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=32"
    },
    "displayName": "Leonardo Franchi [Administrator]",
    "active": true,
    "timeZone": "Europe/Berlin"
  },
  "issue": {
    "id": "10000",
    "self": "https://zulipp.atlassian.net/rest/api/2/issue/10000",
    "key": "TEST-1",
    "fields": {
      "issuetype": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issuetype/10101",
        "id": "10101",
        "description": "A task that needs to be done.",
        "iconUrl": "https://zulipp.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype",
        "name": "Task",
        "subtask": false,
        "avatarId": 10318
      },
      "timespent": null,
      "project": {
        "self": "https://zulipp.atlassian.net/rest/api/2/project/10000",
        "id": "10000",
        "key": "ABC",
        "name": "Fix That",
        "avatarUrls": {
          "48x48": "https://zulipp.atlassian.net/secure/projectavatar?avatarId=10324",
          "24x24": "https://zulipp.atlassian.net/secure/projectavatar?size=small&avatarId=10324",
          "16x16": "https://zulipp.atlassian.net/secure/projectavatar?size=xsmall&avatarId=10324",
          "32x32": "https://zulipp.atlassian.net/secure/projectavatar?size=medium&avatarId=10324"
        }
      },
      "fixVersions": [],
      "customfield_10110": null,
      "customfield_10111": null,
      "aggregatetimespent": null,
      "resolution": null,
      "customfield_10112": "Not started",
      "customfield_10113": null,
      "customfield_10114": null,
      "customfield_10104": null,
      "customfield_10105": null,
      "customfield_10106": null,
      "customfield_10107": null,
      "customfield_10108": null,
      "customfield_10109": null,
      "resolutiondate": null,
      "workratio": -1,
      "lastViewed": "2017-01-30T18:32:14.694+0100",
      "watches": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-1/watchers",
        "watchCount": 1,
        "isWatching": true
      },
      "created": "2017-01-30T18:30:41.962+0100",
      "priority": {
        "self": "https://zulipp.atlassian.net/rest/api/2/priority/3",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/priorities/medium.svg",
        "name": "Medium",
        "id": "3"
      },
      "customfield_10100": null,
      "customfield_10101": null,
      "customfield_10102": null,
      "labels": [],
      "customfield_10103": null,
      "timeestimate": null,
      "aggregatetimeoriginalestimate": null,
      "versions": [],
      "issuelinks": [],
      "assignee": null,
      "updated": "2017-01-30T18:32:14.716+0100",
      "status": {
        "self": "https://zulipp.atlassian.net/rest/api/2/status/3",
        "description": "This issue is being actively worked on at the moment by the assignee.",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/statuses/inprogress.png",
        "name": "In Progress",
        "id": "3",
        "statusCategory": {
          "self": "https://zulipp.atlassian.net/rest/api/2/statuscategory/4",
          "id": 4,
          "key": "indeterminate",
          "colorName": "yellow",
          "name": "In Progress"
        }
      },
      "components": [],
      "timeoriginalestimate": null,
      "description": "Fix That",
      "timetracking": {},
      "customfield_10005": null,
      "attachment": [],
      "aggregatetimeestimate": null,
      "summary": "Fix That",
      "creator": {
        "self": "https://zulipp.atlassian.net/rest/api/2/user?username=admin",
        "name": "admin",
        "key": "admin",
        "emailAddress": "kolaszek@tlen.pl",
        "avatarUrls": {
          "48x48": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=48",
          "24x24": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=24",
          "16x16": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=16",
          "32x32": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=32"
        },
        "displayName": "Leonardo Franchi [Administrator]",
        "active": true,
        "timeZone": "Europe/Berlin"
      },
      "subtasks": [],
      "reporter": {
        "self": "https://zulipp.atlassian.net/rest/api/2/user?username=admin",
        "name": "admin",
        "key": "admin",
        "emailAddress": "kolaszek@tlen.pl",
        "avatarUrls": {
          "48x48": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=48",
          "24x24": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=24",
          "16x16": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=16",
          "32x32": "https://secure.gravatar.com/avatar/d832c4f48fb6bc323411fbbcd25079ad?d=mm&s=32"
        },
        "displayName": "Leonardo Franchi [Administrator]",
        "active": true,
        "timeZone": "Europe/Berlin"
      },
      "customfield_10000": "{}",
      "aggregateprogress": {
        "progress": 0,
        "total": 0
      },
      "customfield_10001": null,
      "customfield_10115": null,
      "customfield_10116": "0|hzzzzz:",
      "environment": null,
      "duedate": null,
      "progress": {
        "progress": 0,
        "total": 0
      },
      "comment": {
        "comments": [],
        "maxResults": 0,
        "total": 0,
        "startAt": 0
      },
      "votes": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-1/votes",
        "votes": 0,
        "hasVoted": false
      },
      "worklog": {
        "startAt": 0,
        "maxResults": 20,
        "total": 0,
        "worklogs": []
      }
    }
  },
  "changelog": {
    "id": "10000",
    "items": [
      {
        "field": "status",
        "fieldtype": "jira",
        "from": "10000",
        "fromString": "To Do",
        "to": "3",
        "toString": "In Progress"
      }
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: commented_markup_v1.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/commented_markup_v1.json

```json
{
  "webhookEvent": "jira:issue_updated",
  "user": {
    "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
    "name": "leo",
    "emailAddress": "leo@zulip.com",
    "avatarUrls": {
      "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
      "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
      "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
      "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
    },
    "displayName": "Leonardo Franchi [Administrator]",
    "active": true
  },
  "issue": {
    "id": "10100",
    "self": "https://zulipp.atlassian.net/rest/api/2/issue/10100",
    "key": "TEST-7",
    "fields": {
      "summary": "Testing of rich text",
      "progress": {
        "progress": 0,
        "total": 0
      },
      "timetracking": {},
      "issuetype": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issuetype/2",
        "id": "2",
        "description": "A new feature of the product, which has yet to be developed.",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/issuetypes/newfeature.png",
        "name": "New Feature",
        "subtask": false
      },
      "timespent": null,
      "reporter": {
        "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
        "name": "leo",
        "emailAddress": "leo@zulip.com",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
          "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
          "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
          "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leonardo Franchi [Administrator]",
        "active": true
      },
      "created": "2013-10-01T16:08:48.446-0400",
      "updated": "2013-10-01T16:16:47.821-0400",
      "priority": {
        "self": "https://zulipp.atlassian.net/rest/api/2/priority/3",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/priorities/major.png",
        "name": "Major",
        "id": "3"
      },
      "description": "h1. So this is a heading\r\n\r\nAnd some *bold* **and _bold_?\r\n\r\n{quote}\r\nsome stuff goes here\r\n{quote}",
      "customfield_10001": null,
      "customfield_10002": null,
      "customfield_10003": null,
      "issuelinks": [],
      "customfield_10000": null,
      "subtasks": [],
      "customfield_10008": null,
      "customfield_10007": null,
      "status": {
        "self": "https://zulipp.atlassian.net/rest/api/2/status/10001",
        "description": "",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/statuses/open.png",
        "name": "To Do",
        "id": "10001"
      },
      "customfield_10006": "7",
      "labels": [],
      "workratio": -1,
      "project": {
        "self": "https://zulipp.atlassian.net/rest/api/2/project/10000",
        "id": "10000",
        "key": "TEST",
        "name": "TestProject",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/projectavatar?size=xsmall&pid=10000&avatarId=10011",
          "24x24": "https://zulipp.atlassian.net/secure/projectavatar?size=small&pid=10000&avatarId=10011",
          "32x32": "https://zulipp.atlassian.net/secure/projectavatar?size=medium&pid=10000&avatarId=10011",
          "48x48": "https://zulipp.atlassian.net/secure/projectavatar?pid=10000&avatarId=10011"
        }
      },
      "environment": null,
      "customfield_10014": null,
      "customfield_10015": null,
      "lastViewed": "2013-10-01T16:16:48.075-0400",
      "aggregateprogress": {
        "progress": 0,
        "total": 0
      },
      "customfield_10012": null,
      "components": [],
      "customfield_10013": null,
      "comment": {
        "startAt": 0,
        "maxResults": 3,
        "total": 3,
        "comments": [
          {
            "self": "https://zulipp.atlassian.net/rest/api/2/issue/10100/comment/10000",
            "id": "10000",
            "author": {
              "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
              "name": "leo",
              "emailAddress": "leo@zulip.com",
              "avatarUrls": {
                "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
                "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
                "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
                "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leonardo Franchi [Administrator]",
              "active": true
            },
            "body": "Commenting that *this is important* and also _please italicize me_\r\n\r\nh2. Heading this all the way\r\n\r\nsome quote:\r\n\r\n{quote}\r\noh say can you see...\r\n{quote}",
            "updateAuthor": {
              "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
              "name": "leo",
              "emailAddress": "leo@zulip.com",
              "avatarUrls": {
                "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
                "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
                "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
                "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leonardo Franchi [Administrator]",
              "active": true
            },
            "created": "2013-10-01T16:11:07.615-0400",
            "updated": "2013-10-01T16:11:07.615-0400"
          },
          {
            "self": "https://zulipp.atlassian.net/rest/api/2/issue/10100/comment/10001",
            "id": "10001",
            "author": {
              "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
              "name": "leo",
              "emailAddress": "leo@zulip.com",
              "avatarUrls": {
                "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
                "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
                "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
                "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leonardo Franchi [Administrator]",
              "active": true
            },
            "body": "*Rich Text* comment, with _italicized_ text,\r\n\r\nand including some\r\n\r\n{quote}\r\nquotations by yours truly\r\n{quote}",
            "updateAuthor": {
              "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
              "name": "leo",
              "emailAddress": "leo@zulip.com",
              "avatarUrls": {
                "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
                "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
                "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
                "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leonardo Franchi [Administrator]",
              "active": true
            },
            "created": "2013-10-01T16:16:47.821-0400",
            "updated": "2013-10-01T16:16:47.821-0400"
          },
          {
            "self": "https://zulipp.atlassian.net/rest/api/2/issue/10100/comment/10002",
            "id": "10002",
            "author": {
              "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
              "name": "leo",
              "emailAddress": "leo@zulip.com",
              "avatarUrls": {
                "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
                "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
                "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
                "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leonardo Franchi [Administrator]",
              "active": true
            },
            "body": "This is a comment that likes to *exercise* a lot of _different_ {{conventions}} that {{jira uses}}.\r\n\r\n{noformat}\r\nthis code is not highlighted, but monospaced\r\n{noformat}\r\n\r\n{code:python}\r\ndef python():\r\n    print \"likes to be formatted\"\r\n{code}\r\n\r\n[http://www.google.com] is a bare link, and [Google|http://www.google.com] is given a title.\r\n\r\nThanks!\r\n\r\n{quote}\r\nSomeone said somewhere\r\n{quote}",
            "updateAuthor": {
              "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
              "name": "leo",
              "emailAddress": "leo@zulip.com",
              "avatarUrls": {
                "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
                "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
                "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
                "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leonardo Franchi [Administrator]",
              "active": true
            },
            "created": "2013-10-01T17:03:00.964-0400",
            "updated": "2013-10-01T17:03:00.964-0400"
          }
        ]
      },
      "timeoriginalestimate": null,
      "customfield_10017": null,
      "customfield_10016": null,
      "customfield_10019": null,
      "customfield_10018": null,
      "votes": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-7/votes",
        "votes": 0,
        "hasVoted": false
      },
      "fixVersions": [],
      "resolution": null,
      "resolutiondate": null,
      "aggregatetimeoriginalestimate": null,
      "duedate": null,
      "customfield_10020": null,
      "customfield_10021": "Not Started",
      "watches": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-7/watchers",
        "watchCount": 1,
        "isWatching": true
      },
      "worklog": {
        "startAt": 0,
        "maxResults": 20,
        "total": 0,
        "worklogs": []
      },
      "assignee": null,
      "attachment": [],
      "aggregatetimeestimate": null,
      "versions": [],
      "timeestimate": null,
      "aggregatetimespent": null
    }
  },
  "comment": {
    "self": "https://zulipp.atlassian.net/rest/api/2/issue/10100/comment/10002",
    "id": "10002",
    "author": {
      "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
      "name": "leo",
      "emailAddress": "leo@zulip.com",
      "avatarUrls": {
        "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
        "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
        "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
        "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
      },
      "displayName": "Leonardo Franchi [Administrator]",
      "active": true
    },
    "body": "This is a comment that likes to *exercise* a lot of _different_ {{conventions}} that {{jira uses}}.\r\n\r\n{noformat}\r\nthis code is not highlighted, but monospaced\r\n{noformat}\r\n\r\n{code:python}\r\ndef python():\r\n    print \"likes to be formatted\"\r\n{code}\r\n\r\n[http://www.google.com] is a bare link, and [Google|http://www.google.com] is given a title.\r\n\r\nThanks!\r\n\r\n{quote}\r\nSomeone said somewhere\r\n{quote}",
    "updateAuthor": {
      "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
      "name": "leo",
      "emailAddress": "leo@zulip.com",
      "avatarUrls": {
        "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
        "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
        "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
        "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
      },
      "displayName": "Leonardo Franchi [Administrator]",
      "active": true
    },
    "created": "2013-10-01T17:03:00.964-0400",
    "updated": "2013-10-01T17:03:00.964-0400"
  },
  "timestamp": 1380661380969
}
```

--------------------------------------------------------------------------------

````
