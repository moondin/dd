---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1265
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1265 of 1290)

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

---[FILE: userstory_changed_unblocked.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_unblocked.json

```json
{
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "id": 187698,
    "full_name": "TomaszKolek",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null
  },
  "change": {
    "comment_html": "",
    "comment": "",
    "comment_versions": null,
    "edit_comment_date": null,
    "delete_comment_date": null,
    "diff": {
      "is_blocked": {
        "from": true,
        "to": false
      }
    }
  },
  "date": "2017-01-10T18:24:56.597Z",
  "action": "change",
  "data": {
    "watchers": [],
    "client_requirement": false,
    "id": 1171601,
    "blocked_note": "",
    "modified_date": "2017-01-10T18:24:56.432Z",
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "id": 187698,
      "full_name": "TomaszKolek",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null
    },
    "is_blocked": false,
    "external_reference": null,
    "ref": 5,
    "subject": "UserStory",
    "project": {
      "name": "TomKol",
      "id": 170130,
      "logo_big_url": null,
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol"
    },
    "tribe_gig": null,
    "is_closed": false,
    "custom_attributes_values": {},
    "milestone": null,
    "finish_date": null,
    "team_requirement": false,
    "description": "",
    "created_date": "2017-01-10T18:24:28.966Z",
    "points": [
      {
        "name": "?",
        "value": null,
        "role": "UX"
      },
      {
        "name": "?",
        "value": null,
        "role": "Design"
      },
      {
        "name": "?",
        "value": null,
        "role": "Front"
      },
      {
        "name": "?",
        "value": null,
        "role": "Back"
      }
    ],
    "generated_from_issue": null,
    "tags": [],
    "status": {
      "name": "New",
      "id": 1006445,
      "color": "#999999",
      "is_archived": false,
      "slug": "new",
      "is_closed": false
    },
    "assigned_to": null
  },
  "type": "userstory"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_created.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_created.json

```json
{
  "data": {
    "finish_date": null,
    "modified_date": "2017-01-10T18:20:46.852Z",
    "is_closed": false,
    "tribe_gig": null,
    "subject": "New userstory",
    "custom_attributes_values": {},
    "blocked_note": "",
    "id": 1171591,
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null,
      "id": 187698,
      "full_name": "TomaszKolek"
    },
    "generated_from_issue": null,
    "team_requirement": false,
    "points": [
      {
        "name": "?",
        "value": null,
        "role": "UX"
      },
      {
        "name": "?",
        "value": null,
        "role": "Design"
      },
      {
        "name": "?",
        "value": null,
        "role": "Front"
      },
      {
        "name": "?",
        "value": null,
        "role": "Back"
      }
    ],
    "ref": 4,
    "client_requirement": false,
    "assigned_to": null,
    "tags": [],
    "created_date": "2017-01-10T18:20:46.832Z",
    "milestone": null,
    "status": {
      "is_closed": false,
      "name": "New",
      "slug": "new",
      "id": 1006445,
      "color": "#999999",
      "is_archived": false
    },
    "is_blocked": false,
    "project": {
      "name": "TomKol",
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol",
      "logo_big_url": null,
      "id": 170130
    },
    "external_reference": null,
    "description": "",
    "watchers": []
  },
  "action": "create",
  "type": "userstory",
  "date": "2017-01-10T18:20:47.067Z",
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null,
    "id": 187698,
    "full_name": "TomaszKolek"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_deleted.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_deleted.json

```json
{
  "action": "delete",
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "id": 187698,
    "full_name": "TomaszKolek",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null
  },
  "data": {
    "watchers": [],
    "client_requirement": false,
    "id": 1171591,
    "blocked_note": "",
    "modified_date": "2017-01-10T18:20:46.852Z",
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "id": 187698,
      "full_name": "TomaszKolek",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null
    },
    "is_blocked": false,
    "external_reference": null,
    "ref": 4,
    "subject": "New userstory",
    "project": {
      "name": "TomKol",
      "id": 170130,
      "logo_big_url": null,
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol"
    },
    "tribe_gig": null,
    "is_closed": false,
    "custom_attributes_values": null,
    "milestone": null,
    "finish_date": null,
    "team_requirement": false,
    "description": "",
    "created_date": "2017-01-10T18:20:46.832Z",
    "points": [],
    "generated_from_issue": null,
    "tags": [],
    "status": {
      "name": "New",
      "id": 1006445,
      "color": "#999999",
      "is_archived": false,
      "slug": "new",
      "is_closed": false
    },
    "assigned_to": null
  },
  "type": "userstory",
  "date": "2017-01-10T18:21:06.056Z"
}
```

--------------------------------------------------------------------------------

---[FILE: webhook_test.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/webhook_test.json

```json
{
  "action": "test",
  "type": "test",
  "by": {
    "id": 385680,
    "permalink": "https://tree.taiga.io/profile/kostek",
    "username": "kostek",
    "full_name": "Jan",
    "photo": null,
    "gravatar_id": "91fe35565bf6198f03688b89fdb0a19a"
  },
  "date": "2019-10-27T14:45:15.221Z",
  "data": {
    "test": "test"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/teamcity/doc.md

```text
# Zulip TeamCity integration

Get Zulip notifications for your TeamCity builds!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Install the [tcWebHooks plugin][1] onto your TeamCity server. Follow
   the plugin instructions in your TeamCity documentation, or refer to
   [the online TeamCity documentation][2].

1. Go to your TeamCity **Overview** page. Select the **Project** or
   **Build** you'd like to receive notifications about, and click on the
   **WebHooks** tab. Click **Add project WebHooks** for a **Project**,
   or click **Add build WebHooks** for a **Build**. Select **Click to
   create new WebHook for this project/build**.

1. Set **URL** to the URL generated above, and set **Payload Format** to
   **Legacy Webhook (JSON)**. Untoggle all **Trigger on Events** options,
   and toggle **Trigger when build is Successful** and **Trigger when
   build Fails**. You may also toggle the options **Only trigger when
   build changes from Failure to Success** and **Only trigger when build
   changes from Success to Failure** if you'd like. Click **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/teamcity/001.png)

### Personal Builds

When a user runs a personal build in TeamCity, if Zulip can map their
TeamCity username to a Zulip user (by matching it to a Zulip user's
email address or full name), then that Zulip user will receive a direct
message with the result of their personal build.

### Related documentation

- [tcWebHooks plugin][1]

- [TeamCity plugin installation documentation][2]

{!webhooks-url-specification.md!}

[1]: https://github.com/tcplugins/tcWebHooks/releases
[2]: https://www.jetbrains.com/help/teamcity/installing-additional-plugins.html
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/teamcity/tests.py

```python
import orjson

from zerver.lib.send_email import FromAddress
from zerver.lib.test_classes import WebhookTestCase
from zerver.models import Recipient
from zerver.models.realms import get_realm
from zerver.models.users import get_user_by_delivery_email
from zerver.webhooks.teamcity.view import MISCONFIGURED_PAYLOAD_TYPE_ERROR_MESSAGE


class TeamCityHookTests(WebhookTestCase):
    CHANNEL_NAME = "teamcity"
    URL_TEMPLATE = "/api/v1/external/teamcity?stream={stream}&api_key={api_key}"
    TOPIC_NAME = "Project :: Compile"
    WEBHOOK_DIR_NAME = "teamcity"

    def test_teamcity_success(self) -> None:
        expected_message = "Project :: Compile build 5535 - CL 123456 was successful! :thumbs_up: See [changes](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952&tab=buildChangesDiv) and [build log](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952)."
        self.check_webhook("success", self.TOPIC_NAME, expected_message)

    def test_teamcity_success_branch(self) -> None:
        expected_message = "Project :: Compile build 5535 - CL 123456 was successful! :thumbs_up: See [changes](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952&tab=buildChangesDiv) and [build log](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952)."
        expected_topic_name = "Project :: Compile (MyBranch)"
        self.check_webhook("success_branch", expected_topic_name, expected_message)

    def test_teamcity_broken(self) -> None:
        expected_message = "Project :: Compile build 5535 - CL 123456 is broken with status Exit code 1 (new)! :thumbs_down: See [changes](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952&tab=buildChangesDiv) and [build log](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952)."
        self.check_webhook("broken", self.TOPIC_NAME, expected_message)

    def test_teamcity_failure(self) -> None:
        expected_message = "Project :: Compile build 5535 - CL 123456 is still broken with status Exit code 1! :thumbs_down: See [changes](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952&tab=buildChangesDiv) and [build log](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952)."
        self.check_webhook("failure", self.TOPIC_NAME, expected_message)

    def test_teamcity_fixed(self) -> None:
        expected_message = "Project :: Compile build 5535 - CL 123456 has been fixed! :thumbs_up: See [changes](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952&tab=buildChangesDiv) and [build log](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952)."
        self.check_webhook("fixed", self.TOPIC_NAME, expected_message)

    def test_teamcity_personal(self) -> None:
        expected_message = "Your personal build for Project :: Compile build 5535 - CL 123456 is broken with status Exit code 1 (new)! :thumbs_down: See [changes](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952&tab=buildChangesDiv) and [build log](http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952)."
        payload = orjson.dumps(
            orjson.loads(self.webhook_fixture_data(self.WEBHOOK_DIR_NAME, "personal"))
        )
        self.client_post(self.url, payload, content_type="application/json")
        msg = self.get_last_message()

        self.assertEqual(msg.content, expected_message)
        self.assertEqual(msg.recipient.type, Recipient.PERSONAL)

    def test_non_generic_payload_ignore_pm_notification(self) -> None:
        expected_message = MISCONFIGURED_PAYLOAD_TYPE_ERROR_MESSAGE.format(
            bot_name=get_user_by_delivery_email(
                "webhook-bot@zulip.com", get_realm("zulip")
            ).full_name,
            support_email=FromAddress.SUPPORT,
        ).strip()
        payload = self.get_body("slack_non_generic_payload")
        self.client_post(self.url, payload, content_type="application/json")
        msg = self.get_last_message()

        self.assertEqual(msg.content, expected_message)
        self.assertEqual(msg.recipient.type, Recipient.PERSONAL)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/teamcity/view.py
Signals: Django

```python
# Webhooks for teamcity integration
import logging

from django.db.models import Q
from django.http import HttpRequest, HttpResponse

from zerver.actions.message_send import (
    check_send_private_message,
    send_rate_limited_pm_notification_to_bot_owner,
)
from zerver.decorator import webhook_view
from zerver.lib.request import RequestNotes
from zerver.lib.response import json_success
from zerver.lib.send_email import FromAddress
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import Realm, UserProfile

MISCONFIGURED_PAYLOAD_TYPE_ERROR_MESSAGE = """
Hi there! Your bot {bot_name} just received a TeamCity payload in a
format that Zulip doesn't recognize. This usually indicates a
configuration issue in your TeamCity webhook settings. Please make sure
that you set the **Payload Format** option to **Legacy Webhook (JSON)**
in your TeamCity webhook configuration. Contact {support_email} if you
need further help!
"""


def guess_zulip_user_from_teamcity(teamcity_username: str, realm: Realm) -> UserProfile | None:
    try:
        # Try to find a matching user in Zulip
        # We search a user's full name, short name,
        # and beginning of email address
        user = UserProfile.objects.filter(
            Q(full_name__iexact=teamcity_username) | Q(email__istartswith=teamcity_username),
            is_active=True,
            realm=realm,
        ).order_by("id")[0]
        return user
    except IndexError:
        return None


def get_teamcity_property_value(property_list: WildValue, name: str) -> str | None:
    for property in property_list:
        if property["name"].tame(check_string) == name:
            return property["value"].tame(check_string)
    return None


@webhook_view("TeamCity")
@typed_endpoint
def api_teamcity_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    if "build" not in payload:
        # Ignore third-party specific (e.g. Slack) payload formats
        # and notify the bot owner
        error_message = MISCONFIGURED_PAYLOAD_TYPE_ERROR_MESSAGE.format(
            bot_name=user_profile.full_name,
            support_email=FromAddress.SUPPORT,
        ).strip()
        send_rate_limited_pm_notification_to_bot_owner(
            user_profile, user_profile.realm, error_message
        )

        return json_success(request)

    message = payload.get("build")
    build_name = message["buildFullName"].tame(check_string)
    build_url = message["buildStatusUrl"].tame(check_string)
    changes_url = build_url + "&tab=buildChangesDiv"
    build_number = message["buildNumber"].tame(check_string)
    build_result = message["buildResult"].tame(check_string)
    build_result_delta = message["buildResultDelta"].tame(check_string)
    build_status = message["buildStatus"].tame(check_string)

    if build_result == "success":
        if build_result_delta == "fixed":
            status = "has been fixed! :thumbs_up:"
        else:
            status = "was successful! :thumbs_up:"
    elif build_result == "failure":
        if build_result_delta == "broken":
            status = f"is broken with status {build_status}! :thumbs_down:"
        else:
            status = f"is still broken with status {build_status}! :thumbs_down:"
    elif build_result == "running":
        status = "has started."

    template = """
{build_name} build {build_id} {status} See [changes]\
({changes_url}) and [build log]({log_url}).
""".strip()

    body = template.format(
        build_name=build_name,
        build_id=build_number,
        status=status,
        changes_url=changes_url,
        log_url=build_url,
    )

    if "branchDisplayName" in message:
        topic_name = "{} ({})".format(build_name, message["branchDisplayName"].tame(check_string))
    else:
        topic_name = build_name

    # Check if this is a personal build, and if so try to direct message the user who triggered it.
    if (
        get_teamcity_property_value(message["teamcityProperties"], "env.BUILD_IS_PERSONAL")
        == "true"
    ):
        # The triggeredBy field gives us the teamcity user full name, and the
        # "teamcity.build.triggeredBy.username" property gives us the teamcity username.
        # Let's try finding the user email from both.
        teamcity_fullname = message["triggeredBy"].tame(check_string).split(";")[0]
        teamcity_user = guess_zulip_user_from_teamcity(teamcity_fullname, user_profile.realm)

        if teamcity_user is None:
            teamcity_shortname = get_teamcity_property_value(
                message["teamcityProperties"], "teamcity.build.triggeredBy.username"
            )
            if teamcity_shortname is not None:
                teamcity_user = guess_zulip_user_from_teamcity(
                    teamcity_shortname, user_profile.realm
                )

        if teamcity_user is None:
            # We can't figure out who started this build - there's nothing we can do here.
            logging.info(
                "TeamCity webhook couldn't find a matching Zulip user for "
                "TeamCity user '%s' or '%s'",
                teamcity_fullname,
                teamcity_shortname,
            )
            return json_success(request)

        body = f"Your personal build for {body}"
        client = RequestNotes.get_notes(request).client
        assert client is not None
        check_send_private_message(user_profile, client, teamcity_user, body)

        return json_success(request)

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: broken.json]---
Location: zulip-main/zerver/webhooks/teamcity/fixtures/broken.json

```json
{
  "build": {
    "buildStatus": "Exit code 1 (new)",
    "buildResult": "failure",
    "buildResultPrevious": "success",
    "buildResultDelta": "broken",
    "notifyType": "buildFinished",
    "buildFullName": "Project :: Compile",
    "buildName": "Compile",
    "buildId": "19952",
    "buildTypeId": "Project_Compile",
    "buildInternalTypeId": "bt1",
    "buildExternalTypeId": "Project_Compile",
    "buildStatusUrl": "http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952",
    "buildStatusHtml": "<span class=\"tcWebHooksMessage\"><a href=\"http://teamcity/project.html?projectId=Project\">Project</a> :: <a href=\"http://teamcity/viewType.html?buildTypeId=Project_Compile\">Compile</a> # <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"><strong>5535 - CL 123456</strong></a> has <strong>finished</strong> with a status of <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"> <strong>failure</strong></a> and was triggered by <strong>Perforce</strong></span>",
    "rootUrl": "http://teamcity",
    "projectName": "Project",
    "projectId": "Project",
    "projectInternalId": "project1",
    "projectExternalId": "Project",
    "buildNumber": "5535 - CL 123456",
    "agentName": "agent123",
    "agentOs": "Windows 10, version 10.0",
    "agentHostname": "agent123.company.com",
    "triggeredBy": "Perforce",
    "message": "Build Project :: Compile has finished. This is build number 5535 - CL 123456, has a status of \"failure\" and was triggered by Perforce",
    "text": "Project :: Compile has finished. Status: failure",
    "buildStateDescription": "finished",
    "buildRunners": [
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line"
    ],
    "extraParameters": [ ],
    "teamcityProperties": [
      {
        "name": "DotNetFramework2.0.50727_x64_Path",
        "value": "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727"
      },
      {
        "name": "DotNetFramework2.0.50727_x86_Path",
        "value": "C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727"
      },
      {
        "name": "DotNetFramework2.0_x64",
        "value": "2.0.50727"
      }
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: failure.json]---
Location: zulip-main/zerver/webhooks/teamcity/fixtures/failure.json

```json
{
  "build": {
    "buildStatus": "Exit code 1",
    "buildResult": "failure",
    "buildResultPrevious": "failure",
    "buildResultDelta": "unchanged",
    "notifyType": "buildFinished",
    "buildFullName": "Project :: Compile",
    "buildName": "Compile",
    "buildId": "19952",
    "buildTypeId": "Project_Compile",
    "buildInternalTypeId": "bt1",
    "buildExternalTypeId": "Project_Compile",
    "buildStatusUrl": "http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952",
    "buildStatusHtml": "<span class=\"tcWebHooksMessage\"><a href=\"http://teamcity/project.html?projectId=Project\">Project</a> :: <a href=\"http://teamcity/viewType.html?buildTypeId=Project_Compile\">Compile</a> # <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"><strong>5535 - CL 123456</strong></a> has <strong>finished</strong> with a status of <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"> <strong>failure</strong></a> and was triggered by <strong>Perforce</strong></span>",
    "rootUrl": "http://teamcity",
    "projectName": "Project",
    "projectId": "Project",
    "projectInternalId": "project1",
    "projectExternalId": "Project",
    "buildNumber": "5535 - CL 123456",
    "agentName": "agent123",
    "agentOs": "Windows 10, version 10.0",
    "agentHostname": "agent123.company.com",
    "triggeredBy": "Perforce",
    "message": "Build Project :: Compile has finished. This is build number 5535 - CL 123456, has a status of \"failure\" and was triggered by Perforce",
    "text": "Project :: Compile has finished. Status: failure",
    "buildStateDescription": "finished",
    "buildRunners": [
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line"
    ],
    "extraParameters": [ ],
    "teamcityProperties": [
      {
        "name": "DotNetFramework2.0.50727_x64_Path",
        "value": "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727"
      },
      {
        "name": "DotNetFramework2.0.50727_x86_Path",
        "value": "C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727"
      },
      {
        "name": "DotNetFramework2.0_x64",
        "value": "2.0.50727"
      }
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: fixed.json]---
Location: zulip-main/zerver/webhooks/teamcity/fixtures/fixed.json

```json
{
  "build": {
    "buildStatus": "Tests passed: 27",
    "buildResult": "success",
    "buildResultPrevious": "failure",
    "buildResultDelta": "fixed",
    "notifyType": "buildFinished",
    "buildFullName": "Project :: Compile",
    "buildName": "Compile",
    "buildId": "19952",
    "buildTypeId": "Project_Compile",
    "buildInternalTypeId": "bt1",
    "buildExternalTypeId": "Project_Compile",
    "buildStatusUrl": "http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952",
    "buildStatusHtml": "<span class=\"tcWebHooksMessage\"><a href=\"http://teamcity/project.html?projectId=Project\">Project</a> :: <a href=\"http://teamcity/viewType.html?buildTypeId=Project_Compile\">Compile</a> # <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"><strong>5535 - CL 123456</strong></a> has <strong>finished</strong> with a status of <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"> <strong>success</strong></a> and was triggered by <strong>Perforce</strong></span>",
    "rootUrl": "http://teamcity",
    "projectName": "Project",
    "projectId": "Project",
    "projectInternalId": "project1",
    "projectExternalId": "Project",
    "buildNumber": "5535 - CL 123456",
    "agentName": "agent123",
    "agentOs": "Windows 10, version 10.0",
    "agentHostname": "agent123.company.com",
    "triggeredBy": "Perforce",
    "message": "Build Project :: Compile has finished. This is build number 5535 - CL 123456, has a status of \"success\" and was triggered by Perforce",
    "text": "Project :: Compile has finished. Status: success",
    "buildStateDescription": "finished",
    "buildRunners": [
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line"
    ],
    "extraParameters": [ ],
    "teamcityProperties": [
      {
        "name": "DotNetFramework2.0.50727_x64_Path",
        "value": "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727"
      },
      {
        "name": "DotNetFramework2.0.50727_x86_Path",
        "value": "C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727"
      },
      {
        "name": "DotNetFramework2.0_x64",
        "value": "2.0.50727"
      }
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: personal.json]---
Location: zulip-main/zerver/webhooks/teamcity/fixtures/personal.json

```json
{
  "build": {
    "buildStatus": "Exit code 1 (new)",
    "buildResult": "failure",
    "buildResultPrevious": "success",
    "buildResultDelta": "broken",
    "notifyType": "buildFinished",
    "buildFullName": "Project :: Compile",
    "buildName": "Compile",
    "buildId": "19952",
    "buildTypeId": "Project_Compile",
    "buildInternalTypeId": "bt1",
    "buildExternalTypeId": "Project_Compile",
    "buildStatusUrl": "http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952",
    "buildStatusHtml": "<span class=\"tcWebHooksMessage\"><a href=\"http://teamcity/project.html?projectId=Project\">Project</a> :: <a href=\"http://teamcity/viewType.html?buildTypeId=Project_Compile\">Compile</a> # <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"><strong>5535 - CL 123456</strong></a> has <strong>finished</strong> with a status of <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"> <strong>failure</strong></a> and was triggered by <strong>David Payne; MS Visual Studio</strong></span>",
    "rootUrl": "http://teamcity",
    "projectName": "Project",
    "projectId": "Project",
    "projectInternalId": "project1",
    "projectExternalId": "Project",
    "buildNumber": "5535 - CL 123456",
    "agentName": "agent123",
    "agentOs": "Windows 10, version 10.0",
    "agentHostname": "agent123.company.com",
    "triggeredBy": "David Payne; MS Visual Studio",
    "message": "Build Project :: Compile has finished. This is build number 5535 - CL 123456, has a status of \"failure\" and was triggered by David Payne; MS Visual Studio",
    "text": "Project :: Compile has finished. Status: failure",
    "buildStateDescription": "finished",
    "buildRunners": [
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line"
    ],
    "extraParameters": [ ],
    "teamcityProperties": [
      {
        "name": "DotNetFramework2.0.50727_x64_Path",
        "value": "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727"
      },
      {
        "name": "DotNetFramework2.0.50727_x86_Path",
        "value": "C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727"
      },
      {
        "name": "DotNetFramework2.0_x64",
        "value": "2.0.50727"
      },
      {
        "name": "env.BUILD_IS_PERSONAL",
        "value": "true"
      },
      {
      "name": "teamcity.build.triggeredBy.username",
      "value": "iago"
      }
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: slack_non_generic_payload.json]---
Location: zulip-main/zerver/webhooks/teamcity/fixtures/slack_non_generic_payload.json

```json
{
    "username":"TeamCity",
    "icon_url":"https://raw.githubusercontent.com/tcplugins/tcWebHooks/master/docs/icons/teamcity-logo-48x48.png",
    "attachments":[
        {
            "title":"Failed (broken) : ${buildName} &lt;${buildStatusUrl}|build #${buildNumber}&gt;",
            "fallback":"Failed (broken) : ${buildName} build #${buildNumber}",
            "color":"danger",
            "fields":[
                {
                    "title":"Status",
                    "value":"${buildStatus}"
                },
                {
                    "title":"Project Name",
                    "value":"&lt;${rootUrl}/project.html?projectId=${projectExternalId}|${projectName}&gt;",
                    "short":true
                },
                {
                    "title":"Build Name",
                    "value":"&lt;${rootUrl}/viewType.html?buildTypeId=${buildExternalTypeId}|${buildName}&gt;",
                    "short":true
                },
                {
                    "title":"Commit",
                    "value":"&lt;${buildStatusUrl}&amp;tab=buildChangesDiv|${substr(build.vcs.number,0,7,32)}&gt;",
                    "short":true
                },
                {
                    "title":"Triggered By",
                    "value":"${triggeredBy}",
                    "short":true
                },
                {
                    "title":"Agent",
                    "value":"${agentName}",
                    "short":true
                }
            ]
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: success.json]---
Location: zulip-main/zerver/webhooks/teamcity/fixtures/success.json

```json
{
  "build": {
    "buildStatus": "Tests passed: 27",
    "buildResult": "success",
    "buildResultPrevious": "success",
    "buildResultDelta": "unchanged",
    "notifyType": "buildFinished",
    "buildFullName": "Project :: Compile",
    "buildName": "Compile",
    "buildId": "19952",
    "buildTypeId": "Project_Compile",
    "buildInternalTypeId": "bt1",
    "buildExternalTypeId": "Project_Compile",
    "buildStatusUrl": "http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952",
    "buildStatusHtml": "<span class=\"tcWebHooksMessage\"><a href=\"http://teamcity/project.html?projectId=Project\">Project</a> :: <a href=\"http://teamcity/viewType.html?buildTypeId=Project_Compile\">Compile</a> # <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"><strong>5535 - CL 123456</strong></a> has <strong>finished</strong> with a status of <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"> <strong>success</strong></a> and was triggered by <strong>Perforce</strong></span>",
    "rootUrl": "http://teamcity",
    "projectName": "Project",
    "projectId": "Project",
    "projectInternalId": "project1",
    "projectExternalId": "Project",
    "buildNumber": "5535 - CL 123456",
    "agentName": "agent123",
    "agentOs": "Windows 10, version 10.0",
    "agentHostname": "agent123.company.com",
    "triggeredBy": "Perforce",
    "message": "Build Project :: Compile has finished. This is build number 5535 - CL 123456, has a status of \"success\" and was triggered by Perforce",
    "text": "Project :: Compile has finished. Status: success",
    "buildStateDescription": "finished",
    "buildRunners": [
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line",
      "Command Line"
    ],
    "extraParameters": [ ],
    "teamcityProperties": [
      {
        "name": "DotNetFramework2.0.50727_x64_Path",
        "value": "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727"
      },
      {
        "name": "DotNetFramework2.0.50727_x86_Path",
        "value": "C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727"
      },
      {
        "name": "DotNetFramework2.0_x64",
        "value": "2.0.50727"
      }
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: success_branch.json]---
Location: zulip-main/zerver/webhooks/teamcity/fixtures/success_branch.json

```json
{
	"build": {
		"buildStatus": "Tests passed: 27",
		"buildResult": "success",
		"buildResultPrevious": "success",
		"buildResultDelta": "unchanged",
		"notifyType": "buildFinished",
		"buildFullName": "Project :: Compile",
		"buildName": "Compile",
		"buildId": "19952",
		"buildTypeId": "Project_Compile",
		"buildInternalTypeId": "bt1",
		"buildExternalTypeId": "Project_Compile",
		"buildStatusUrl": "http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952",
		"buildStatusHtml": "<span class=\"tcWebHooksMessage\"><a href=\"http://teamcity/project.html?projectId=Project\">Project</a> :: <a href=\"http://teamcity/viewType.html?buildTypeId=Project_Compile\">Compile</a> # <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"><strong>5535 - CL 123456</strong></a> has <strong>finished</strong> with a status of <a href=\"http://teamcity/viewLog.html?buildTypeId=Project_Compile&buildId=19952\"> <strong>success</strong></a> and was triggered by <strong>Perforce</strong></span>",
		"rootUrl": "http://teamcity",
		"projectName": "Project",
		"projectId": "Project",
		"projectInternalId": "project1",
		"projectExternalId": "Project",
		"branchName": "MyBranch",
	    "branchDisplayName": "MyBranch",
		"buildNumber": "5535 - CL 123456",
		"agentName": "agent123",
		"agentOs": "Windows 10, version 10.0",
		"agentHostname": "agent123.company.com",
		"triggeredBy": "Perforce",
		"message": "Build Project :: Compile has finished. This is build number 5535 - CL 123456, has a status of \"success\" and was triggered by Perforce",
		"text": "Project :: Compile has finished. Status: success",
		"buildStateDescription": "finished",
		"buildRunners": [
			"Command Line",
			"Command Line",
			"Command Line",
			"Command Line",
			"Command Line",
			"Command Line"
		],
		"extraParameters": [],
		"teamcityProperties": [{
				"name": "DotNetFramework2.0.50727_x64_Path",
				"value": "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727"
			}, {
				"name": "DotNetFramework2.0.50727_x86_Path",
				"value": "C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727"
			}, {
				"name": "DotNetFramework2.0_x64",
				"value": "2.0.50727"
			}
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/thinkst/doc.md

```text
# Zulip Thinkst integration

Get your Thinkst Canary and Canarytoken alerts in Zulip!

This integration works with Canarytokens from Thinkst's paid product.
For [canarytokens.org][canarytokens], see the
[Canarytokens](/integrations/canarytoken) integration!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Thinkst Canary settings, and click on **Webhooks** in the
   left sidebar. Select the **Generic** tab, and click **Add Generic
   Webhook**.

1. Enter the generated URL above. Click **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/thinkst/001.png)

### Related documentation

{!webhooks-url-specification.md!}

[canarytokens]: https://canarytokens.org
```

--------------------------------------------------------------------------------

````
