---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1112
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1112 of 1290)

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

---[FILE: integrations.py]---
Location: zulip-main/zerver/views/development/integrations.py
Signals: Django, Pydantic

```python
import os
from contextlib import suppress
from typing import TYPE_CHECKING, Any

import orjson
from django.http import HttpRequest, HttpResponse
from django.http.response import HttpResponseBase
from django.shortcuts import render
from django.test import Client
from pydantic import Json

from zerver.lib.exceptions import JsonableError, ResourceNotFoundError
from zerver.lib.integrations import INCOMING_WEBHOOK_INTEGRATIONS
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import PathOnly, typed_endpoint
from zerver.lib.webhooks.common import get_fixture_http_headers, standardize_headers
from zerver.models import UserProfile
from zerver.models.realms import get_realm

if TYPE_CHECKING:
    from django.test.client import _MonkeyPatchedWSGIResponse as TestHttpResponse

ZULIP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../")


def get_webhook_integrations() -> list[str]:
    return [integration.name for integration in INCOMING_WEBHOOK_INTEGRATIONS]


def get_valid_integration_name(name: str) -> str | None:
    for integration_name in get_webhook_integrations():
        if name == integration_name:
            return integration_name
    return None


def dev_panel(request: HttpRequest) -> HttpResponse:
    integrations = get_webhook_integrations()
    bots = UserProfile.objects.filter(is_bot=True, bot_type=UserProfile.INCOMING_WEBHOOK_BOT)
    context = {
        "integrations": integrations,
        "bots": bots,
        # We set isolated_page to avoid clutter from footer/header.
        "isolated_page": True,
    }
    return render(request, "zerver/development/integrations_dev_panel.html", context)


def send_webhook_fixture_message(
    url: str, body: str, is_json: bool, custom_headers: dict[str, Any]
) -> "TestHttpResponse":
    client = Client()
    realm = get_realm("zulip")
    standardized_headers = standardize_headers(custom_headers)
    http_host = standardized_headers.pop("HTTP_HOST", realm.host)
    if is_json:
        content_type = standardized_headers.pop("HTTP_CONTENT_TYPE", "application/json")
    else:
        content_type = standardized_headers.pop("HTTP_CONTENT_TYPE", "text/plain")
    return client.post(
        url,
        body,
        content_type=content_type,
        follow=False,
        secure=False,
        headers=None,
        query_params=None,
        HTTP_HOST=http_host,
        **standardized_headers,
    )


@typed_endpoint
def get_fixtures(request: HttpRequest, *, integration_name: PathOnly[str]) -> HttpResponse:
    valid_integration_name = get_valid_integration_name(integration_name)
    if not valid_integration_name:
        raise ResourceNotFoundError(f'"{integration_name}" is not a valid webhook integration.')

    fixtures = {}
    fixtures_dir = os.path.join(ZULIP_PATH, f"zerver/webhooks/{valid_integration_name}/fixtures")
    if not os.path.exists(fixtures_dir):
        msg = f'The integration "{valid_integration_name}" does not have fixtures.'
        raise ResourceNotFoundError(msg)

    for fixture in os.listdir(fixtures_dir):
        fixture_path = os.path.join(fixtures_dir, fixture)
        with open(fixture_path) as f:
            body = f.read()
        # The file extension will be used to determine the type.
        with suppress(orjson.JSONDecodeError):
            body = orjson.loads(body)

        headers_raw = get_fixture_http_headers(
            valid_integration_name, "".join(fixture.split(".")[:-1])
        )

        def fix_name(header: str) -> str:  # nocoverage
            return header.removeprefix("HTTP_")  # HTTP_ is a prefix intended for Django.

        headers = {fix_name(k): v for k, v in headers_raw.items()}
        fixtures[fixture] = {"body": body, "headers": headers}

    return json_success(request, data={"fixtures": fixtures})


@typed_endpoint
def check_send_webhook_fixture_message(
    request: HttpRequest,
    *,
    url: str,
    body: str,
    is_json: Json[bool],
    custom_headers: str,
) -> HttpResponseBase:
    try:
        custom_headers_dict = orjson.loads(custom_headers)
    except orjson.JSONDecodeError as ve:  # nocoverage
        raise JsonableError(f"Custom HTTP headers are not in a valid JSON format. {ve}")  # nolint

    response = send_webhook_fixture_message(url, body, is_json, custom_headers_dict)
    if response.status_code == 200:
        responses = [{"status_code": response.status_code, "message": response.content.decode()}]
        return json_success(request, data={"responses": responses})
    else:  # nocoverage
        return response


@typed_endpoint
def send_all_webhook_fixture_messages(
    request: HttpRequest, *, url: str, integration_name: str
) -> HttpResponse:
    valid_integration_name = get_valid_integration_name(integration_name)
    if not valid_integration_name:  # nocoverage
        raise ResourceNotFoundError(f'"{integration_name}" is not a valid webhook integration.')

    fixtures_dir = os.path.join(ZULIP_PATH, f"zerver/webhooks/{valid_integration_name}/fixtures")
    if not os.path.exists(fixtures_dir):
        msg = f'The integration "{valid_integration_name}" does not have fixtures.'
        raise ResourceNotFoundError(msg)

    responses = []
    for fixture in os.listdir(fixtures_dir):
        fixture_path = os.path.join(fixtures_dir, fixture)
        with open(fixture_path) as f:
            content = f.read()
        x = fixture.split(".")
        fixture_name, fixture_format = "".join(_ for _ in x[:-1]), x[-1]
        headers = get_fixture_http_headers(valid_integration_name, fixture_name)
        is_json = fixture_format == "json"
        response = send_webhook_fixture_message(url, content, is_json, headers)
        responses.append(
            {
                "status_code": response.status_code,
                "fixture_name": fixture,
                "message": response.content.decode(),
            }
        )
    return json_success(request, data={"responses": responses})
```

--------------------------------------------------------------------------------

---[FILE: registration.py]---
Location: zulip-main/zerver/views/development/registration.py
Signals: Django

```python
from typing import TYPE_CHECKING, Any, cast

from django.conf import settings
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt

from confirmation.models import Confirmation, create_confirmation_link
from zerver.context_processors import get_realm_from_request
from zerver.lib.response import json_success
from zerver.models import Realm, UserProfile
from zerver.views.auth import (
    create_preregistration_realm,
    create_preregistration_user,
    redirect_and_log_into_subdomain,
)
from zerver.views.registration import accounts_register, create_demo_helper
from zproject.backends import ExternalAuthResult

if TYPE_CHECKING:
    from django.http.request import _ImmutableQueryDict


# This is used only by the Puppeteer test in realm-creation.ts.
def confirmation_key(request: HttpRequest) -> HttpResponse:
    return json_success(request, data=request.session["confirmation_key"])


def modify_postdata(request: HttpRequest, **kwargs: Any) -> None:
    new_post = request.POST.copy()
    for key, value in kwargs.items():
        new_post[key] = value
    new_post._mutable = False
    request.POST = cast("_ImmutableQueryDict", new_post)


@csrf_exempt
def register_development_user(request: HttpRequest) -> HttpResponse:
    realm = get_realm_from_request(request)
    if realm is None:  # nocoverage
        return HttpResponseRedirect(
            f"{settings.EXTERNAL_URI_SCHEME}{settings.REALM_HOSTS['zulip']}/devtools/register_user/",
            status=307,
        )

    count = UserProfile.objects.count()
    name = f"user-{count}"
    email = f"{name}@zulip.com"
    prereg = create_preregistration_user(email, realm, password_required=False)
    activation_url = create_confirmation_link(prereg, Confirmation.USER_REGISTRATION)
    key = activation_url.split("/")[-1]
    # Need to add test data to POST request as it doesn't originally contain the required parameters
    modify_postdata(request, key=key, full_name=name, password="test", terms="true")

    return accounts_register(request)


@csrf_exempt
def register_development_realm(request: HttpRequest) -> HttpResponse:
    count = UserProfile.objects.count()
    name = f"user-{count}"
    email = f"{name}@zulip.com"
    realm_name = f"realm-{count}"
    realm_type = Realm.ORG_TYPES["business"]["id"]
    realm_default_language = "en"
    realm_subdomain = realm_name
    prereg_realm = create_preregistration_realm(
        email, realm_name, realm_subdomain, realm_type, realm_default_language
    )
    activation_url = create_confirmation_link(
        prereg_realm, Confirmation.NEW_REALM_USER_REGISTRATION, no_associated_realm_object=True
    )
    key = activation_url.split("/")[-1]
    # Need to add test data to POST request as it doesn't originally contain the required parameters
    modify_postdata(
        request,
        key=key,
        realm_name=realm_name,
        realm_type=realm_type,
        realm_default_language=realm_default_language,
        full_name=name,
        password="test",
        realm_subdomain=realm_subdomain,
        terms="true",
        how_realm_creator_found_zulip="ad",
        how_realm_creator_found_zulip_extra_context="test",
    )

    return accounts_register(request)


@csrf_exempt
def register_demo_development_realm(request: HttpRequest) -> HttpResponse:
    count = (
        Realm.objects.filter(demo_organization_scheduled_deletion_date__isnull=False).count() + 1
    )
    user_profile = create_demo_helper(
        request,
        realm_name=f"Demo organization {count}",
        realm_type=Realm.ORG_TYPES["education"]["id"],
        realm_default_language="en",
        how_realm_creator_found_zulip="existing_user",
        how_realm_creator_found_zulip_extra_context="test",
        timezone="US/Pacific",
    )

    return redirect_and_log_into_subdomain(
        ExternalAuthResult(user_profile=user_profile, data_dict={"is_realm_creation": True})
    )
```

--------------------------------------------------------------------------------

---[FILE: showroom.py]---
Location: zulip-main/zerver/views/development/showroom.py
Signals: Django

```python
import os

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

background_colors = [
    {"name": "Default background", "css_var": "--color-background"},
    {"name": "Popover background", "css_var": "--color-background-popover-menu"},
    {"name": "Modal background", "css_var": "--color-background-modal"},
    {"name": "Compose background", "css_var": "--color-compose-box-background"},
]


def get_svg_filenames() -> list[str]:
    icons_dir = os.path.join(os.path.dirname(__file__), "../../../web/icons")

    # Get all .svg file names from the directory
    svg_files = [f for f in os.listdir(icons_dir) if f.endswith(".svg")]

    # Remove the .svg extension from the file names
    icon_names = [os.path.splitext(f)[0] for f in svg_files]

    # Sort the list alphabetically
    return sorted(icon_names)


def showroom_component_buttons(request: HttpRequest) -> HttpResponse:
    context = {
        "background_colors": background_colors,
        "icons": get_svg_filenames(),
        "page_is_showroom": True,
        "showroom_component": "buttons",
        "doc_root_title": "Button styles browser",
        # We set isolated_page to avoid clutter from footer/header.
        "isolated_page": True,
    }
    return render(request, "zerver/development/showroom/buttons.html", context)


def showroom_component_banners(request: HttpRequest) -> HttpResponse:
    context = {
        "background_colors": background_colors,
        "icons": get_svg_filenames(),
        "page_is_showroom": True,
        "showroom_component": "banners",
        "doc_root_title": "Banner styles browser",
        # We set isolated_page to avoid clutter from footer/header.
        "isolated_page": True,
    }
    return render(request, "zerver/development/showroom/banners.html", context)


def showroom_component_inputs(request: HttpRequest) -> HttpResponse:
    context = {
        "background_colors": background_colors,
        "icons": get_svg_filenames(),
        "page_is_showroom": True,
        "showroom_component": "inputs",
        "doc_root_title": "Input styles browser",
        # We set isolated_page to avoid clutter from footer/header.
        "isolated_page": True,
    }
    return render(request, "zerver/development/showroom/inputs.html", context)
```

--------------------------------------------------------------------------------

---[FILE: fixtureless_integrations.py]---
Location: zulip-main/zerver/webhooks/fixtureless_integrations.py

```python
from datetime import datetime, timezone
from typing import TypedDict

from zerver.lib.timestamp import datetime_to_global_time

# For integrations that don't have example webhook fixtures/payloads,
# we create an Zulip notification message content and topic here in
# order to generate an example screenshot to include in the documentation
# page for those integrations.

# To keep these screenshots consistent and easy to review, there are
# shared string constants to use for common content in these integration
# notification messages/templates.

THREE_DIGIT_NUMBER = "492"

# Example user content
BO_NAME = "Bo Williams"
BO_EMAIL = "bwilliams@example.com"
BO_GIT_NAME = "bo-williams"

KEVIN_NAME = "Kevin Lin"
KEVIN_EMAIL = "klin@example.com"

# Example project content
PROJECT_NAME = "Example Project"
PROJECT_PATH_PERFORCE = "//depot/zerver/example-project/*"
PROJECT_STAGE = "production"

VERSION_NUMBER = "v9.2.3"
REVISION_NUMBER = THREE_DIGIT_NUMBER

# Example branch content
BRANCH_GIT = "main"
BRANCH_MERCURIAL = "default"
BRANCH_SVN = "trunk"

# Example commit content
COMMIT_MESSAGE_A = "Optimize image loading in catalog."
COMMIT_MESSAGE_B = 'Suppress "comment edited" events when body is unchanged.'
COMMIT_BODY_A = "Implement lazy loading for images in the catalog to improve load times."

COMMIT_HASH_A = "a2e84e86ddf7e7f8a9b0c1d2e3f4a5b6c7d8e9f0"
COMMIT_HASH_B = "9fceb02c0c4b8e4c1e7b43hd4e5f6a7b8c9d0e1f"
DEPLOYMENT_HASH = "e494a5be3393"

# Example task/issue/ticket content
TASK_TITLE = COMMIT_MESSAGE_A[:-1]
TASK_DESCRIPTION = COMMIT_BODY_A
TICKET_NUMBER = THREE_DIGIT_NUMBER

# Example datetime content
_DT = datetime(2025, 5, 30, 2, 0, 0, tzinfo=timezone.utc)

DATETIME_GLOBAL = datetime_to_global_time(_DT)

DATE_ISO_8601 = _DT.date().isoformat()
DATE_LONG = _DT.strftime("%A, %B %d, %Y")


class ScreenshotContent(TypedDict):
    topic: str
    content: str


ASANA = ScreenshotContent(
    topic=PROJECT_NAME,
    content=f"{BO_NAME} created a new task **[{TASK_TITLE}]()**.\n> {TASK_DESCRIPTION}",
)

CAPISTRANO = ScreenshotContent(
    topic=PROJECT_NAME,
    content=f"The [deployment]() to **{PROJECT_STAGE}** (version {VERSION_NUMBER}) has been completed successfully! :rocket:",
)

CODEBASE = ScreenshotContent(
    topic=f"Push to {BRANCH_GIT} on {PROJECT_NAME}",
    content=f"""{BO_NAME} pushed 2 commit(s) to `{BRANCH_GIT}` in project {PROJECT_NAME}:

* [{COMMIT_HASH_A[:10]}](): {COMMIT_MESSAGE_A}
* [{COMMIT_HASH_B[:10]}](): {COMMIT_MESSAGE_B}
""",
)

DISCOURSE = ScreenshotContent(
    topic="chat",
    content=f"""**@{BO_NAME}** posted in [Example channel]()
> {COMMIT_BODY_A}""",
)

GIT = ScreenshotContent(
    topic=BRANCH_GIT,
    content=f"""`{DEPLOYMENT_HASH[:12]}` was deployed to `{BRANCH_GIT}` with:
* {KEVIN_EMAIL} - {COMMIT_HASH_A[:7]}: {COMMIT_MESSAGE_A}
* {BO_EMAIL} - {COMMIT_HASH_B[:7]}: {COMMIT_MESSAGE_B}
""",
)

GITHUB_ACTIONS = ScreenshotContent(
    topic="scheduled backups",
    content=f"""Backup [failed]() at {DATETIME_GLOBAL}.
> Unable to connect.""",
)

GOOGLE_CALENDAR = ScreenshotContent(
    topic="Team reminders",
    content=f"""The [Development Sync]() event is scheduled from 2 PM - 3 PM on {DATE_LONG} at Conference Room B.
> Let's align on our current sprint progress, address any blockers, and share updates. Your input is crucial!

[Join call]().""",
)

JENKINS = ScreenshotContent(
    topic=PROJECT_NAME,
    content=f"**Build:** [#{REVISION_NUMBER}](): FAILURE :cross_mark:",
)

JIRA_PLUGIN = ScreenshotContent(
    topic=f"{TICKET_NUMBER}: {TASK_TITLE}",
    content=f"""{BO_NAME} **created** [{TICKET_NUMBER}]() - priority Medium, assigned to @**{KEVIN_NAME}**:

> {TASK_DESCRIPTION}""",
)

MASTODON = ScreenshotContent(
    topic="MIT Technology Review",
    content=f"""**[Don’t let hype about AI agents get ahead of reality](https://www.technologyreview.com/2025/07/03/1119545/dont-let-hype-about-ai-agents-get-ahead-of-reality/)**
Google’s recent unveiling of what it calls a “new class of agentic experiences” feels like a turning point. At its I/O event last month, for example, the company showed off a digital assistant that didn’t just answer questions; it helped work on a bicycle repair by finding a matching user manual, locating a YouTube…
https://www.technologyreview.com/{DATE_ISO_8601.replace("-", "/")}/1119545/dont-let-hype-about-ai-agents-get-ahead-of-reality/""",
)

MERCURIAL = ScreenshotContent(
    topic=BRANCH_MERCURIAL,
    content=f"""**{BO_NAME}** pushed [2 commits]() to **{BRANCH_MERCURIAL}** (`{REVISION_NUMBER}:{DEPLOYMENT_HASH[:12]}`):
* [{COMMIT_MESSAGE_A}]()
* [{COMMIT_MESSAGE_B}]()
""",
)

NAGIOS = ScreenshotContent(
    topic="service Remote Load on myserver.example.com",
    content="""**PROBLEM**: service is CRITICAL
~~~~
CRITICAL - load average: 7.49, 8.20, 4.72
~~~~
""",
)

NOTION = ScreenshotContent(
    topic=f"{PROJECT_NAME} Release {VERSION_NUMBER}",
    content=f"""**{BO_NAME}** [commented]() on:
> project demo scheduled

Can we reschedule this to next week?""",
)

OPENSHIFT = ScreenshotContent(
    topic=PROJECT_NAME,
    content=f"""Deployment [{REVISION_NUMBER}]() triggered by a push to **{BRANCH_GIT}** by commit [{COMMIT_HASH_A[:7]}]() at {DATETIME_GLOBAL} has **failed**.""",
)

PERFORCE = ScreenshotContent(
    topic=PROJECT_PATH_PERFORCE,
    content=f"""
**{BO_NAME}** committed revision @[{REVISION_NUMBER}]() to `{PROJECT_PATH_PERFORCE}`.

```quote
{COMMIT_MESSAGE_A}
```
""",
)

PUPPET = ScreenshotContent(
    topic="Reports",
    content=f"""Puppet production run for web-server-01 completed at {DATETIME_GLOBAL}. [GitHub Gist]() | [Report URL]()""",
)

REDMINE = ScreenshotContent(
    topic=TASK_TITLE,
    content=f"""{BO_NAME} **created** issue [{TICKET_NUMBER} {TASK_TITLE}]():

~~~quote

{TASK_DESCRIPTION}...

~~~

* **Assignee**: {KEVIN_NAME}
* **Status**: New
* **Target version**: {VERSION_NUMBER[1:]}
* **Estimated hours**: 40""",
)

RSS = MASTODON

SVN = ScreenshotContent(
    topic=PROJECT_NAME,
    content=f"""**{BO_GIT_NAME}** committed revision r{REVISION_NUMBER} to `{BRANCH_SVN}`.
> {COMMIT_MESSAGE_A}
""",
)

TRAC = ScreenshotContent(
    topic=f"#{TICKET_NUMBER} {TASK_TITLE}",
    content=f"""**{BO_GIT_NAME}** updated [ticket #{TICKET_NUMBER}]() with comment:
> Fixed in  {COMMIT_HASH_A}

status: **new** => **closed**, resolution: => **fixed**""",
)
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/airbrake/doc.md

```text
# Zulip Airbrake integration

Get Zulip notifications for your Airbrake bug tracker!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your project's settings on the Airbrake site. Click on the
   **Integration** section, and select **Webhook**.

1. Enter the URL you generated, and check **Enabled**.
   Click **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/airbrake/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/airbrake/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class AirbrakeHookTests(WebhookTestCase):
    CHANNEL_NAME = "airbrake"
    URL_TEMPLATE = "/api/v1/external/airbrake?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "airbrake"

    def test_airbrake_error_message(self) -> None:
        expected_topic_name = "ZulipIntegrationTest"
        expected_message = '[ZeroDivisionError](https://zulip.airbrake.io/projects/125209/groups/1705190192091077626): "Error message from logger" occurred.'
        self.check_webhook("error_message", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/airbrake/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

AIRBRAKE_TOPIC_TEMPLATE = "{project_name}"
AIRBRAKE_MESSAGE_TEMPLATE = '[{error_class}]({error_url}): "{error_message}" occurred.'


@webhook_view("Airbrake")
@typed_endpoint
def api_airbrake_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    topic_name = get_topic(payload)
    body = get_body(payload)
    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)


def get_topic(payload: WildValue) -> str:
    return AIRBRAKE_TOPIC_TEMPLATE.format(
        project_name=payload["error"]["project"]["name"].tame(check_string)
    )


def get_body(payload: WildValue) -> str:
    data = {
        "error_url": payload["airbrake_error_url"].tame(check_string),
        "error_class": payload["error"]["error_class"].tame(check_string),
        "error_message": payload["error"]["error_message"].tame(check_string),
    }
    return AIRBRAKE_MESSAGE_TEMPLATE.format(**data)
```

--------------------------------------------------------------------------------

---[FILE: error_message.json]---
Location: zulip-main/zerver/webhooks/airbrake/fixtures/error_message.json

```json
{
  "error": {
    "id": "1705190192091077626",
    "error_message": "Error message from logger",
    "error_class": "ZeroDivisionError",
    "file": "file.py",
    "line_number": 2,
    "project": {
      "id": 125209,
      "name": "ZulipIntegrationTest"
    },
    "last_notice": {
      "id": "1705189516072954676",
      "request_url": null,
      "backtrace": [
        "file.py:2:in \u003cmodule\u003e"
      ]
    },
    "environment": "dev",
    "first_occurred_at": "2016-06-10T17:07:10.760639Z",
    "last_occurred_at": "2016-06-10T17:07:10.76Z",
    "times_occurred": 1
  },
  "airbrake_error_url": "https:\/\/zulip.airbrake.io\/projects\/125209\/groups\/1705190192091077626"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/airbyte/doc.md

```text
# Zulip Airbyte integration

Get Zulip notifications from Airbyte.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In Airbyte, go to your project settings. Click **Notifications**,
   and toggle the **Webhook** button for the notifications you'd like
   to receive.

1. Enter the URL generated above in the **Webhook URL** field. Click the
   **Save changes** button at the bottom of the page.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/airbyte/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/airbyte/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class AirbyteHookTests(WebhookTestCase):
    STREAM_NAME = "airbyte"
    URL_TEMPLATE = "/api/v1/external/airbyte?api_key={api_key}&stream={stream}"
    FIXTURE_DIR_NAME = "airbyte"
    CHANNEL_NAME = "test"
    WEBHOOK_DIR_NAME = "airbyte"

    def test_airbyte_job_success(self) -> None:
        expected_topic = "Zulip Airbyte Integration - Google Sheets → Postgres"

        expected_message = """:green_circle: Airbyte sync **succeeded** for [Google Sheets → Postgres](https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/connections/aa941643-07ea-48a2-9035-024575491720).


* **Source:** [Google Sheets](https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/source/363c0ea3-e989-4051-9f54-d41b794d6621)
* **Destination:** [Postgres](https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/destination/b3a05072-e3c8-435a-8e6e-4a5c601039c6)
* **Records:** 1400 emitted, 1400 committed
* **Bytes:** 281 kB emitted, 281 kB committed
* **Duration:** 1 min 23 sec"""

        self.check_webhook(
            "airbyte_job_payload_success",
            expected_topic,
            expected_message,
            content_type="application/json",
        )

    def test_airbyte_job_failure(self) -> None:
        expected_topic = "Zulip Airbyte Integration - Google Sheets → Postgres"
        expected_message = """:red_circle: Airbyte sync **failed** for [Google Sheets → Postgres](https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/connections/aa941643-07ea-48a2-9035-024575491720).


* **Source:** [Google Sheets](https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/source/363c0ea3-e989-4051-9f54-d41b794d6621)
* **Destination:** [Postgres](https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/destination/b3a05072-e3c8-435a-8e6e-4a5c601039c6)
* **Records:** 0 emitted, 0 committed
* **Bytes:** 0 B emitted, 0 B committed
* **Duration:** 28 sec

**Error message:** Checking source connection failed - please review this connection's configuration to prevent future syncs from failing"""

        self.check_webhook(
            "airbyte_job_payload_failure",
            expected_topic,
            expected_message,
            content_type="application/json",
        )

    def test_airbyte_job_hello_world_success(self) -> None:
        expected_topic = "Airbyte notification"
        expected_message = """Hello World! This is a test from Airbyte to try slack notification settings for sync successes."""

        self.check_webhook(
            "test_airbyte_job_hello_world_success",
            expected_topic,
            expected_message,
            content_type="application/json",
        )

    def test_airbyte_job_hello_world_failure(self) -> None:
        expected_topic = "Airbyte notification"
        expected_message = """Hello World! This is a test from Airbyte to try slack notification settings for sync failures."""

        self.check_webhook(
            "test_airbyte_job_hello_world_failure",
            expected_topic,
            expected_message,
            content_type="application/json",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/airbyte/view.py
Signals: Django

```python
# Webhooks for external integrations.

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_bool, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

AIRBYTE_TOPIC_TEMPLATE = "{workspace} - {connection}"

AIRBYTE_MESSAGE_TEMPLATE = """\
{sync_status_emoji} Airbyte sync **{status}** for [{connection_name}]({connection_url}).


* **Source:** [{source_name}]({source_url})
* **Destination:** [{destination_name}]({destination_url})
* **Records:** {records_emitted} emitted, {records_committed} committed
* **Bytes:** {bytes_emitted} emitted, {bytes_committed} committed
* **Duration:** {duration}
"""


def extract_data_from_payload(payload_data: WildValue) -> dict[str, str | int | bool]:
    data: dict[str, str | int | bool] = {
        "workspace_name": payload_data["workspace"]["name"].tame(check_string),
        "connection_name": payload_data["connection"]["name"].tame(check_string),
        "source_name": payload_data["source"]["name"].tame(check_string),
        "destination_name": payload_data["destination"]["name"].tame(check_string),
        "connection_url": payload_data["connection"]["url"].tame(check_string),
        "source_url": payload_data["source"]["url"].tame(check_string),
        "destination_url": payload_data["destination"]["url"].tame(check_string),
        "successful_sync": payload_data["success"].tame(check_bool),
        "duration_formatted": payload_data["durationFormatted"].tame(check_string),
        "records_emitted": payload_data["recordsEmitted"].tame(check_int),
        "records_committed": payload_data["recordsCommitted"].tame(check_int),
        "bytes_emitted_formatted": payload_data["bytesEmittedFormatted"].tame(check_string),
        "bytes_committed_formatted": payload_data["bytesCommittedFormatted"].tame(check_string),
    }

    if not data["successful_sync"]:
        data["error_message"] = payload_data["errorMessage"].tame(check_string)

    return data


def format_message_from_data(data: dict[str, str | int | bool]) -> str:
    content = AIRBYTE_MESSAGE_TEMPLATE.format(
        sync_status_emoji=":green_circle:" if data["successful_sync"] else ":red_circle:",
        status="succeeded" if data["successful_sync"] else "failed",
        connection_name=data["connection_name"],
        connection_url=data["connection_url"],
        source_name=data["source_name"],
        source_url=data["source_url"],
        destination_name=data["destination_name"],
        destination_url=data["destination_url"],
        duration=data["duration_formatted"],
        records_emitted=data["records_emitted"],
        records_committed=data["records_committed"],
        bytes_emitted=data["bytes_emitted_formatted"],
        bytes_committed=data["bytes_committed_formatted"],
    )

    if not data["successful_sync"]:
        error_message = data["error_message"]
        content += f"\n**Error message:** {error_message}"

    return content


def create_topic_from_data(data: dict[str, str | int | bool]) -> str:
    return AIRBYTE_TOPIC_TEMPLATE.format(
        workspace=data["workspace_name"],
        connection=data["connection_name"],
    )


@webhook_view("Airbyte")
@typed_endpoint
def api_airbyte_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    if "data" in payload:
        data = extract_data_from_payload(payload["data"])
        content = format_message_from_data(data)
        topic = create_topic_from_data(data)
    else:
        # Test Airbyte notification payloads only contain this field.
        content = payload["text"].tame(check_string)
        topic = "Airbyte notification"
    check_send_webhook_message(request, user_profile, topic, content)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: airbyte_job_payload_failure.json]---
Location: zulip-main/zerver/webhooks/airbyte/fixtures/airbyte_job_payload_failure.json

```json
{
  "text": "Your connection Google Sheets → Postgres from Google Sheets to Postgres failed\nThis happened with Checking source connection failed - please review this connection's configuration to prevent future syncs from failing\n\nYou can access its logs here: https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/connections/aa941643-07ea-48a2-9035-024575491720\n\nJob ID: 20441143",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Sync completed: <https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/connections/aa941643-07ea-48a2-9035-024575491720|Google Sheets \u2192 Postgres>"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Source:*"
        },
        {
          "type": "mrkdwn",
          "text": "<https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/source/363c0ea3-e989-4051-9f54-d41b794d6621|Google Sheets>"
        },
        {
          "type": "mrkdwn",
          "text": "*Destination:*"
        },
        {
          "type": "mrkdwn",
          "text": "<https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/destination/b3a05072-e3c8-435a-8e6e-4a5c601039c6|Postgres>"
        },
        {
          "type": "mrkdwn",
          "text": "*Duration:*"
        },
        {
          "type": "mrkdwn",
          "text": "1 min 23 sec"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Sync Summary:*\n1400 record(s) extracted / 1400 record(s) loaded\n281 kB extracted / 281 kB loaded\n"
      }
    }
  ],
  "data": {
    "workspace": {
      "id": "84d2dd6e-82aa-406e-91f3-bf8dbf176e69",
      "name": "Zulip Airbyte Integration",
      "url": "https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69"
    },
    "connection": {
      "id": "aa941643-07ea-48a2-9035-024575491720",
      "name": "Google Sheets → Postgres",
      "url": "https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/connections/aa941643-07ea-48a2-9035-024575491720"
    },
    "source": {
      "id": "363c0ea3-e989-4051-9f54-d41b794d6621",
      "name": "Google Sheets",
      "url": "https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/source/363c0ea3-e989-4051-9f54-d41b794d6621"
    },
    "destination": {
      "id": "b3a05072-e3c8-435a-8e6e-4a5c601039c6",
      "name": "Postgres",
      "url": "https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/destination/b3a05072-e3c8-435a-8e6e-4a5c601039c6"
    },
    "jobId": 20441143,
    "startedAt": "2024-10-22T20:27:59Z",
    "finishedAt": "2024-10-22T20:29:22Z",
    "bytesEmitted": 0,
    "bytesCommitted": 0,
    "recordsEmitted": 0,
    "recordsCommitted": 0,
    "errorMessage": "Checking source connection failed - please review this connection's configuration to prevent future syncs from failing",
    "durationFormatted": "28 sec",
    "bytesEmittedFormatted": "0 B",
    "bytesCommittedFormatted": "0 B",
    "success": false,
    "durationInSeconds": 28
  }
}
```

--------------------------------------------------------------------------------

---[FILE: airbyte_job_payload_success.json]---
Location: zulip-main/zerver/webhooks/airbyte/fixtures/airbyte_job_payload_success.json

```json
{
  "text": "Your connection Google Sheets → Postgres from Google Sheets to Postgres succeeded\nThis was for null\n\nYou can access its logs here: https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/connections/aa941643-07ea-48a2-9035-024575491720\n\nJob ID: 20441143",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Sync completed: <https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/connections/aa941643-07ea-48a2-9035-024575491720|Google Sheets \u2192 Postgres>"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Source:*"
        },
        {
          "type": "mrkdwn",
          "text": "<https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/source/363c0ea3-e989-4051-9f54-d41b794d6621|Google Sheets>"
        },
        {
          "type": "mrkdwn",
          "text": "*Destination:*"
        },
        {
          "type": "mrkdwn",
          "text": "<https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/destination/b3a05072-e3c8-435a-8e6e-4a5c601039c6|Postgres>"
        },
        {
          "type": "mrkdwn",
          "text": "*Duration:*"
        },
        {
          "type": "mrkdwn",
          "text": "1 min 23 sec"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Sync Summary:*\n1400 record(s) extracted / 1400 record(s) loaded\n281 kB extracted / 281 kB loaded\n"
      }
    }
  ],
  "data": {
    "workspace": {
      "id": "84d2dd6e-82aa-406e-91f3-bf8dbf176e69",
      "name": "Zulip Airbyte Integration",
      "url": "https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69"
    },
    "connection": {
      "id": "aa941643-07ea-48a2-9035-024575491720",
      "name": "Google Sheets → Postgres",
      "url": "https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/connections/aa941643-07ea-48a2-9035-024575491720"
    },
    "source": {
      "id": "363c0ea3-e989-4051-9f54-d41b794d6621",
      "name": "Google Sheets",
      "url": "https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/source/363c0ea3-e989-4051-9f54-d41b794d6621"
    },
    "destination": {
      "id": "b3a05072-e3c8-435a-8e6e-4a5c601039c6",
      "name": "Postgres",
      "url": "https://cloud.airbyte.com/workspaces/84d2dd6e-82aa-406e-91f3-bf8dbf176e69/destination/b3a05072-e3c8-435a-8e6e-4a5c601039c6"
    },
    "jobId": 20441143,
    "startedAt": "2024-10-22T20:27:59Z",
    "finishedAt": "2024-10-22T20:29:22Z",
    "bytesEmitted": 288179,
    "bytesCommitted": 288179,
    "recordsEmitted": 1400,
    "recordsCommitted": 1400,
    "errorMessage": null,
    "durationFormatted": "1 min 23 sec",
    "bytesEmittedFormatted": "281 kB",
    "bytesCommittedFormatted": "281 kB",
    "success": true,
    "durationInSeconds": 83
  }
}
```

--------------------------------------------------------------------------------

---[FILE: test_airbyte_job_hello_world_failure.json]---
Location: zulip-main/zerver/webhooks/airbyte/fixtures/test_airbyte_job_hello_world_failure.json

```json
{
  "text": "Hello World! This is a test from Airbyte to try slack notification settings for sync failures."
}
```

--------------------------------------------------------------------------------

---[FILE: test_airbyte_job_hello_world_success.json]---
Location: zulip-main/zerver/webhooks/airbyte/fixtures/test_airbyte_job_hello_world_success.json

```json
{
  "text": "Hello World! This is a test from Airbyte to try slack notification settings for sync successes."
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/alertmanager/doc.md

```text
# Zulip Prometheus Alertmanager integration

Get Zulip notifications from Prometheus Alertmanager!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In your Alertmanager config, set up a new webhook receiver, like so:

    ```
    - name: ops-zulip
      webhook_configs:
        - url: "<the URL generated above>"
    ```

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/alertmanager/001.png)

### Configuration options

- You can specify a field defined in your alerting rules (for labels
  and/or annotations) that will be used to group alerts with the same
  status into a single alert message in Zulip by appending a `name`
  parameter to the generated URL, e.g., `&name=severity`. The default
  `name` value used in the integration is `instance`.

- You can specify a field defined in your alerting rules (for labels
  and/or annotations) that will be used in the alert message text in
  Zulip by appending a `desc` parameter to the generated URL, e.g.,
  `&desc=description`. The default `desc` value used in the
  integration is `alertname`.

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

````
