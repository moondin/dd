---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 880
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 880 of 1290)

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

---[FILE: external_accounts.py]---
Location: zulip-main/zerver/lib/external_accounts.py
Signals: Django

```python
"""
This module stores data for "external account" custom profile field.
"""

from dataclasses import dataclass

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.utils.translation import gettext_lazy
from django_stubs_ext import StrPromise

from zerver.lib.types import ProfileFieldData
from zerver.lib.validator import (
    check_dict_only,
    check_external_account_url_pattern,
    check_required_string,
)


# Default external account fields are by default available
# to realm admins, where realm admin only need to select
# the default field and other values(i.e. name, url) will be
# fetch from this dictionary.
@dataclass
class ExternalAccount:
    text: str  # Field text for admins - custom profile field in org settings view
    name: StrPromise  # Field label or name - user profile in user settings view
    hint: str  # Field hint for realm users
    url_pattern: str  # Field URL linkifier


DEFAULT_EXTERNAL_ACCOUNTS = {
    "twitter": ExternalAccount(
        text="Twitter",
        url_pattern="https://twitter.com/%(username)s",
        name=gettext_lazy("Twitter username"),
        hint="",
    ),
    "github": ExternalAccount(
        text="GitHub",
        url_pattern="https://github.com/%(username)s",
        name=gettext_lazy("GitHub username"),
        hint="",
    ),
}


def get_default_external_accounts() -> dict[str, dict[str, str]]:
    return {
        subtype: {
            "text": external_account.text,
            "url_pattern": external_account.url_pattern,
            "name": str(external_account.name),
            "hint": external_account.hint,
        }
        for subtype, external_account in DEFAULT_EXTERNAL_ACCOUNTS.items()
    }


def validate_external_account_field_data(field_data: ProfileFieldData) -> ProfileFieldData:
    field_validator = check_dict_only(
        [("subtype", check_required_string)],
        [("url_pattern", check_external_account_url_pattern)],
    )
    field_validator("field_data", field_data)

    field_subtype = field_data.get("subtype")
    if field_subtype not in DEFAULT_EXTERNAL_ACCOUNTS:
        if field_subtype == "custom":
            if "url_pattern" not in field_data:
                raise ValidationError(_("Custom external account must define URL pattern"))
        else:
            raise ValidationError(_("Invalid external account type"))

    return field_data
```

--------------------------------------------------------------------------------

---[FILE: fix_unreads.py]---
Location: zulip-main/zerver/lib/fix_unreads.py
Signals: Django

```python
import logging
import time
from collections.abc import Callable
from typing import TypeVar

from django.db import connection
from django.db.backends.utils import CursorWrapper
from psycopg2.sql import SQL

from zerver.models import UserProfile

T = TypeVar("T")

"""
NOTE!  Be careful modifying this library, as it is used
in a migration, and it needs to be valid for the state
of the database that is in place when the 0104_fix_unreads
migration runs.
"""

logger = logging.getLogger("zulip.fix_unreads")
logger.setLevel(logging.WARNING)


def update_unread_flags(cursor: CursorWrapper, user_message_ids: list[int]) -> None:
    query = SQL(
        """
        UPDATE zerver_usermessage
        SET flags = flags | 1
        WHERE id IN %(user_message_ids)s
    """
    )

    cursor.execute(query, {"user_message_ids": tuple(user_message_ids)})


def get_timing(message: str, f: Callable[[], T]) -> T:
    start = time.time()
    logger.info(message)
    ret = f()
    elapsed = time.time() - start
    logger.info("elapsed time: %.03f\n", elapsed)
    return ret


def fix_unsubscribed(cursor: CursorWrapper, user_profile: UserProfile) -> None:
    def find_recipients() -> list[int]:
        query = SQL(
            """
            SELECT
                zerver_subscription.recipient_id
            FROM
                zerver_subscription
            INNER JOIN zerver_recipient ON (
                zerver_recipient.id = zerver_subscription.recipient_id
            )
            WHERE (
                zerver_subscription.user_profile_id = %(user_profile_id)s AND
                zerver_recipient.type = 2 AND
                (NOT zerver_subscription.active)
            )
        """
        )
        cursor.execute(query, {"user_profile_id": user_profile.id})
        rows = cursor.fetchall()
        recipient_ids = [row[0] for row in rows]
        logger.info("%s", recipient_ids)
        return recipient_ids

    recipient_ids = get_timing(
        "get recipients",
        find_recipients,
    )

    if not recipient_ids:
        return

    def find() -> list[int]:
        query = SQL(
            """
            SELECT
                zerver_usermessage.id
            FROM
                zerver_usermessage
            INNER JOIN zerver_message ON (
                zerver_message.id = zerver_usermessage.message_id
            )
            WHERE (
                zerver_usermessage.user_profile_id = %(user_profile_id)s AND
                (zerver_usermessage.flags & 1) = 0 AND
                zerver_message.recipient_id in %(recipient_ids)s
            )
        """
        )

        cursor.execute(
            query,
            {
                "user_profile_id": user_profile.id,
                "recipient_ids": tuple(recipient_ids),
            },
        )
        rows = cursor.fetchall()
        user_message_ids = [row[0] for row in rows]
        logger.info("rows found: %d", len(user_message_ids))
        return user_message_ids

    user_message_ids = get_timing(
        "finding unread messages for non-active streams",
        find,
    )

    if not user_message_ids:
        return

    def fix() -> None:
        update_unread_flags(cursor, user_message_ids)

    get_timing(
        "fixing unread messages for non-active streams",
        fix,
    )


def fix(user_profile: UserProfile) -> None:
    logger.info("\n---\nFixing %s:", user_profile.id)
    with connection.cursor() as cursor:
        fix_unsubscribed(cursor, user_profile)
```

--------------------------------------------------------------------------------

---[FILE: generate_test_data.py]---
Location: zulip-main/zerver/lib/generate_test_data.py

```python
import itertools
import os
import random
from typing import Any

import orjson

from scripts.lib.zulip_tools import get_or_create_dev_uuid_var_path
from zerver.lib.topic import RESOLVED_TOPIC_PREFIX


def load_config() -> dict[str, Any]:
    with open("zerver/tests/fixtures/config.generate_data.json", "rb") as infile:
        config = orjson.loads(infile.read())

    return config


def generate_topics(num_topics: int) -> list[str]:
    config = load_config()["gen_fodder"]

    # Make single word topics account for 30% of total topics.
    # Single word topics are most common, thus
    # it is important we test on it.
    num_single_word_topics = num_topics // 3
    topic_names = random.choices(config["nouns"], k=num_single_word_topics)

    sentence = ["adjectives", "nouns", "connectors", "verbs", "adverbs"]
    for pos in sentence:
        # Add an empty string so that we can generate variable length topics.
        config[pos].append("")

    topic_names.extend(
        " ".join(word for pos in sentence if (word := random.choice(config[pos])) != "")
        for _ in range(num_topics - num_single_word_topics)
    )

    # Mark a small subset of topics as resolved in some streams, and
    # many topics in a few streams. Note that these don't have the
    # "Marked as resolved" messages, so don't match the normal user
    # experience perfectly.
    if random.random() < 0.15:
        resolved_topic_probability = 0.5
    else:
        resolved_topic_probability = 0.05

    return [
        (
            RESOLVED_TOPIC_PREFIX + topic_name
            if random.random() < resolved_topic_probability
            else topic_name
        )
        for topic_name in topic_names
    ]


def load_generators(config: dict[str, Any]) -> dict[str, Any]:
    results = {}
    cfg = config["gen_fodder"]

    results["nouns"] = itertools.cycle(cfg["nouns"])
    results["adjectives"] = itertools.cycle(cfg["adjectives"])
    results["connectors"] = itertools.cycle(cfg["connectors"])
    results["verbs"] = itertools.cycle(cfg["verbs"])
    results["adverbs"] = itertools.cycle(cfg["adverbs"])
    results["emojis"] = itertools.cycle(cfg["emoji"])
    results["links"] = itertools.cycle(cfg["links"])

    results["maths"] = itertools.cycle(cfg["maths"])
    results["inline-code"] = itertools.cycle(cfg["inline-code"])
    results["code-blocks"] = itertools.cycle(cfg["code-blocks"])
    results["quote-blocks"] = itertools.cycle(cfg["quote-blocks"])
    results["images"] = itertools.cycle(cfg["images"])

    results["lists"] = itertools.cycle(cfg["lists"])

    return results


def parse_file(config: dict[str, Any], gens: dict[str, Any], corpus_file: str) -> list[str]:
    # First, load the entire file into a dictionary,
    # then apply our custom filters to it as needed.

    paragraphs: list[str] = []

    with open(corpus_file) as infile:
        # OUR DATA: we need to separate the person talking and what they say
        paragraphs = remove_line_breaks(infile)
        paragraphs = add_flair(paragraphs, gens)

    return paragraphs


def get_flair_gen(length: int) -> list[str]:
    # Grab the percentages from the config file
    # create a list that we can consume that will guarantee the distribution
    result = []

    for k, v in config["dist_percentages"].items():
        result.extend([k] * int(v * length / 100))

    result.extend(["None"] * (length - len(result)))

    random.shuffle(result)
    return result


def add_flair(paragraphs: list[str], gens: dict[str, Any]) -> list[str]:
    # roll the dice and see what kind of flair we should add, if any
    results = []

    flair = get_flair_gen(len(paragraphs))

    for i in range(len(paragraphs)):
        key = flair[i]
        if key == "None":
            txt = paragraphs[i]
        elif key == "italic":
            txt = add_md("*", paragraphs[i])
        elif key == "bold":
            txt = add_md("**", paragraphs[i])
        elif key == "strike-thru":
            txt = add_md("~~", paragraphs[i])
        elif key == "quoted":
            txt = ">" + paragraphs[i]
        elif key == "quote-block":
            txt = paragraphs[i] + "\n" + next(gens["quote-blocks"])
        elif key == "inline-code":
            txt = paragraphs[i] + "\n" + next(gens["inline-code"])
        elif key == "code-block":
            txt = paragraphs[i] + "\n" + next(gens["code-blocks"])
        elif key == "math":
            txt = paragraphs[i] + "\n" + next(gens["maths"])
        elif key == "list":
            txt = paragraphs[i] + "\n" + next(gens["lists"])
        elif key == "emoji":
            txt = add_emoji(paragraphs[i], next(gens["emojis"]))
        elif key == "link":
            txt = add_link(paragraphs[i], next(gens["links"]))
        elif key == "images":
            # Ideally, this would actually be a 2-step process that
            # first hits the `upload` endpoint and then adds that URL;
            # this is the hacky version where we just use inline image
            # previews of files already in the project (which are the
            # only files we can link to as being definitely available
            # even when developing offline).
            txt = paragraphs[i] + "\n" + next(gens["images"])

        results.append(txt)

    return results


def add_md(mode: str, text: str) -> str:
    # mode means: bold, italic, etc.
    # to add a list at the end of a paragraph, * item one\n * item two

    # find out how long the line is, then insert the mode before the end

    vals = text.split()
    start = random.randrange(len(vals))
    end = random.randrange(len(vals) - start) + start
    vals[start] = mode + vals[start]
    vals[end] += mode

    return " ".join(vals).strip()


def add_emoji(text: str, emoji: str) -> str:
    vals = text.split()
    start = random.randrange(len(vals))

    vals[start] = vals[start] + " " + emoji + " "
    return " ".join(vals)


def add_link(text: str, link: str) -> str:
    vals = text.split()
    start = random.randrange(len(vals))

    vals[start] = vals[start] + " " + link + " "

    return " ".join(vals)


def remove_line_breaks(fh: Any) -> list[str]:
    # We're going to remove line breaks from paragraphs
    results = []  # save the dialogs as tuples with (author, dialog)

    para = []  # we'll store the lines here to form a paragraph

    for line in fh:
        text = line.strip()
        if text != "":
            para.append(text)
        else:
            if para:
                results.append(" ".join(para))
            # reset the paragraph
            para = []
    if para:
        results.append(" ".join(para))

    return results


def write_file(paragraphs: list[str], filename: str) -> None:
    with open(filename, "wb") as outfile:
        outfile.write(orjson.dumps(paragraphs))


def create_test_data() -> None:
    gens = load_generators(config)  # returns a dictionary of generators

    paragraphs = parse_file(config, gens, config["corpus"]["filename"])

    write_file(
        paragraphs,
        os.path.join(get_or_create_dev_uuid_var_path("test-backend"), "test_messages.json"),
    )


config = load_config()

if __name__ == "__main__":
    create_test_data()
```

--------------------------------------------------------------------------------

---[FILE: github.py]---
Location: zulip-main/zerver/lib/github.py

```python
import json
import logging
from typing import Any

import requests

from zerver.lib.cache import cache_with_key
from zerver.lib.outgoing_http import OutgoingSession

logger = logging.getLogger(__name__)


class GithubSession(OutgoingSession):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(role="github", timeout=5, **kwargs)


def get_latest_github_release_version_for_repo(repo: str) -> str:
    api_url = f"https://api.github.com/repos/zulip/{repo}/releases/latest"
    try:
        return GithubSession().get(api_url).json()["tag_name"]
    except (requests.RequestException, json.JSONDecodeError, KeyError):
        logger.exception(
            "Unable to fetch the latest release version from GitHub %s", api_url, stack_info=True
        )
        return ""


def verify_release_download_link(link: str) -> bool:
    try:
        GithubSession().head(link).raise_for_status()
        return True
    except requests.RequestException:
        logger.error("App download link is broken %s", link)
        return False


PLATFORM_TO_SETUP_FILE = {
    "linux": "Zulip-{version}-x86_64.AppImage",
    "mac": "Zulip-{version}-arm64.dmg",
    "mac-intel": "Zulip-{version}-x64.dmg",
    "mac-arm64": "Zulip-{version}-arm64.dmg",
    "windows": "Zulip-Web-Setup-{version}.exe",
}


class InvalidPlatformError(Exception):
    pass


@cache_with_key(lambda platform: f"download_link:{platform}", timeout=60 * 30)
def get_latest_github_release_download_link_for_platform(platform: str) -> str:
    if platform not in PLATFORM_TO_SETUP_FILE:
        raise InvalidPlatformError

    latest_version = get_latest_github_release_version_for_repo("zulip-desktop")
    if latest_version:
        latest_version = latest_version.removeprefix("v")
        setup_file = PLATFORM_TO_SETUP_FILE[platform].format(version=latest_version)
        link = f"https://desktop-download.zulip.com/v{latest_version}/{setup_file}"
        if verify_release_download_link(link):
            return link
    return "https://github.com/zulip/zulip-desktop/releases/latest"
```

--------------------------------------------------------------------------------

---[FILE: home.py]---
Location: zulip-main/zerver/lib/home.py
Signals: Django

```python
import calendar
import os
import time
from dataclasses import dataclass
from urllib.parse import urlsplit

from django.conf import settings
from django.http import HttpRequest
from django.utils import translation
from two_factor.utils import default_device

from zerver.context_processors import get_apps_page_url
from zerver.lib.events import ClientCapabilities, do_events_register
from zerver.lib.i18n import (
    get_and_set_request_language,
    get_language_list,
    get_language_translation_data,
)
from zerver.lib.narrow_helpers import NeverNegatedNarrowTerm
from zerver.lib.realm_description import get_realm_rendered_description
from zerver.lib.request import RequestNotes
from zerver.models import Message, Realm, Stream, UserProfile
from zerver.views.message_flags import get_latest_update_message_flag_activity


@dataclass
class BillingInfo:
    show_billing: bool
    show_plans: bool
    sponsorship_pending: bool
    show_remote_billing: bool


@dataclass
class UserPermissionInfo:
    color_scheme: int
    is_guest: bool
    is_realm_admin: bool
    is_realm_owner: bool


def get_furthest_read_time(user_profile: UserProfile | None) -> float | None:
    if user_profile is None:
        return time.time()

    user_activity = get_latest_update_message_flag_activity(user_profile)
    if user_activity is None:
        return None

    return calendar.timegm(user_activity.last_visit.utctimetuple())


def promote_sponsoring_zulip_in_realm(realm: Realm) -> bool:
    if not settings.PROMOTE_SPONSORING_ZULIP:
        return False

    # If PROMOTE_SPONSORING_ZULIP is enabled, advertise sponsoring
    # Zulip in the gear menu of non-paying organizations.
    return realm.plan_type in [Realm.PLAN_TYPE_STANDARD_FREE, Realm.PLAN_TYPE_SELF_HOSTED]


def get_user_permission_info(user_profile: UserProfile | None) -> UserPermissionInfo:
    if user_profile is not None:
        return UserPermissionInfo(
            color_scheme=user_profile.color_scheme,
            is_guest=user_profile.is_guest,
            is_realm_owner=user_profile.is_realm_owner,
            is_realm_admin=user_profile.is_realm_admin,
        )
    else:
        return UserPermissionInfo(
            color_scheme=UserProfile.COLOR_SCHEME_AUTOMATIC,
            is_guest=False,
            is_realm_admin=False,
            is_realm_owner=False,
        )


def build_page_params_for_home_page_load(
    request: HttpRequest,
    user_profile: UserProfile | None,
    realm: Realm,
    insecure_desktop_app: bool,
    narrow: list[NeverNegatedNarrowTerm],
    narrow_stream: Stream | None,
    narrow_topic_name: str | None,
) -> tuple[int, dict[str, object]]:
    """
    This function computes page_params for when we load the home page.

    The page_params data structure gets sent to the client.
    """

    client_capabilities = ClientCapabilities(
        notification_settings_null=True,
        bulk_message_deletion=True,
        user_avatar_url_field_optional=True,
        stream_typing_notifications=True,
        linkifier_url_template=True,
        user_list_incomplete=True,
        include_deactivated_groups=True,
        archived_channels=True,
        empty_topic_name=True,
        simplified_presence_events=True,
    )

    if user_profile is not None:
        client = RequestNotes.get_notes(request).client
        assert client is not None
        partial_subscribers = os.environ.get("PARTIAL_SUBSCRIBERS") is not None
        state_data = do_events_register(
            user_profile,
            realm,
            client,
            apply_markdown=True,
            client_gravatar=True,
            slim_presence=True,
            presence_last_update_id_fetched_by_client=-1,
            presence_history_limit_days=settings.PRESENCE_HISTORY_LIMIT_DAYS_FOR_WEB_APP,
            client_capabilities=client_capabilities,
            narrow=narrow,
            include_streams=False,
            include_subscribers="partial" if partial_subscribers else True,
        )
        queue_id = state_data["queue_id"]
        default_language = state_data["user_settings"]["default_language"]
    else:
        # The spectator client will be fetching the /register response
        # for spectators via the API.
        state_data = None
        queue_id = None
        default_language = realm.default_language

    if user_profile is None:
        request_language = request.COOKIES.get(settings.LANGUAGE_COOKIE_NAME, default_language)
        split_url = urlsplit(request.build_absolute_uri())
        show_try_zulip_modal = (
            settings.DEVELOPMENT or split_url.hostname == "chat.zulip.org"
        ) and split_url.query == "show_try_zulip_modal"
    else:
        request_language = get_and_set_request_language(
            request,
            default_language,
            translation.get_language_from_path(request.path_info),
        )
        show_try_zulip_modal = False

    furthest_read_time = get_furthest_read_time(user_profile)
    two_fa_enabled = settings.TWO_FACTOR_AUTHENTICATION_ENABLED and user_profile is not None

    # Pass parameters to the client-side JavaScript code.
    # These end up in a JavaScript Object named 'page_params'.
    #
    # Sync this with home_params_schema in base_page_params.ts.
    page_params: dict[str, object] = dict(
        page_type="home",
        ## Server settings.
        test_suite=settings.TEST_SUITE,
        insecure_desktop_app=insecure_desktop_app,
        login_page=settings.HOME_NOT_LOGGED_IN,
        warn_no_email=settings.WARN_NO_EMAIL,
        # Only show marketing email settings if on Zulip Cloud
        corporate_enabled=settings.CORPORATE_ENABLED,
        ## Misc. extra data.
        language_list=get_language_list(),
        furthest_read_time=furthest_read_time,
        embedded_bots_enabled=settings.EMBEDDED_BOTS_ENABLED,
        two_fa_enabled=two_fa_enabled,
        apps_page_url=get_apps_page_url(),
        promote_sponsoring_zulip=promote_sponsoring_zulip_in_realm(realm),
        # Adding two_fa_enabled as condition saves us 3 queries when
        # 2FA is not enabled.
        two_fa_enabled_user=two_fa_enabled and bool(default_device(user_profile)),
        is_spectator=user_profile is None,
        presence_history_limit_days_for_web_app=settings.PRESENCE_HISTORY_LIMIT_DAYS_FOR_WEB_APP,
        # There is no event queue for spectators since
        # events support for spectators is not implemented yet.
        no_event_queue=user_profile is None,
        show_try_zulip_modal=show_try_zulip_modal,
    )

    page_params["state_data"] = state_data

    if narrow_stream is not None and state_data is not None:
        # In narrow_stream context, initial pointer is just latest message
        recipient = narrow_stream.recipient
        state_data["max_message_id"] = -1
        max_message = (
            # Uses index: zerver_message_realm_recipient_id
            Message.objects.filter(realm_id=realm.id, recipient=recipient)
            .order_by("-id")
            .only("id")
            .first()
        )
        if max_message:
            state_data["max_message_id"] = max_message.id
        page_params["narrow_stream"] = narrow_stream.name
        if narrow_topic_name is not None:
            page_params["narrow_topic"] = narrow_topic_name
        page_params["narrow"] = [
            dict(operator=term.operator, operand=term.operand) for term in narrow
        ]
        assert isinstance(state_data["user_settings"], dict)
        state_data["user_settings"]["enable_desktop_notifications"] = False

    page_params["translation_data"] = get_language_translation_data(request_language)

    # This is used by `admin.ts` to display realm description for non-administrator
    # logged-in users.
    page_params["realm_rendered_description"] = get_realm_rendered_description(realm)

    if user_profile is None:
        page_params["language_cookie_name"] = settings.LANGUAGE_COOKIE_NAME

    return queue_id, page_params
```

--------------------------------------------------------------------------------

---[FILE: html_diff.py]---
Location: zulip-main/zerver/lib/html_diff.py

```python
import lxml.html
from lxml.html.diff import htmldiff


def highlight_html_differences(s1: str, s2: str, msg_id: int | None = None) -> str:
    retval = htmldiff(s1, s2)
    fragment = lxml.html.fragment_fromstring(retval, create_parent=True)

    for elem in fragment.cssselect("del"):
        elem.tag = "span"
        elem.set("class", "highlight_text_deleted")

    for elem in fragment.cssselect("ins"):
        elem.tag = "span"
        elem.set("class", "highlight_text_inserted")

    retval = lxml.html.tostring(fragment, encoding="unicode")

    return retval
```

--------------------------------------------------------------------------------

---[FILE: html_to_text.py]---
Location: zulip-main/zerver/lib/html_to_text.py
Signals: Django

```python
from collections.abc import Mapping

from bs4 import BeautifulSoup
from django.utils.html import escape

from zerver.lib.cache import cache_with_key, open_graph_description_cache_key


def html_to_text(content: str | bytes, tags: Mapping[str, str] = {"p": " | "}) -> str:
    bs = BeautifulSoup(content, features="lxml")
    # Skip any admonition (warning) blocks, since they're
    # usually something about users needing to be an
    # organization administrator, and not useful for
    # describing the page.
    for tag in bs.find_all("div", class_="admonition"):
        tag.clear()

    # Skip tabbed-sections, which just contain navigation instructions.
    for tag in bs.find_all("div", class_="tabbed-section"):
        tag.clear()

    text = ""
    for element in bs.find_all(tags.keys()):
        # Ignore empty elements
        if not element.text:
            continue
        # .text converts it from HTML to text
        if text:
            text += tags[element.name]
        text += element.text
        if len(text) > 500:
            break
    return escape(" ".join(text.split()))


@cache_with_key(open_graph_description_cache_key, timeout=3600 * 24)
def get_content_description(content: bytes, request_url: str) -> str:
    return html_to_text(content)
```

--------------------------------------------------------------------------------

---[FILE: i18n.py]---
Location: zulip-main/zerver/lib/i18n.py
Signals: Django

```python
# See https://zulip.readthedocs.io/en/latest/translating/internationalization.html

import logging
import os
from functools import lru_cache
from typing import Any

import orjson
from django.conf import settings
from django.http import HttpRequest
from django.utils import translation
from django.utils.translation.trans_real import parse_accept_lang_header

from zerver.lib.request import RequestNotes
from zerver.models import Realm


@lru_cache(None)
def get_language_list() -> list[dict[str, Any]]:
    path = os.path.join(settings.DEPLOY_ROOT, "locale", "language_name_map.json")
    with open(path, "rb") as reader:
        languages = orjson.loads(reader.read())
        return languages["name_map"]


def get_language_name(code: str) -> str:
    for lang in get_language_list():
        if code in (lang["code"], lang["locale"]):
            return lang["name"]
    # Log problem, but still return a name
    logging.error("Unknown language code '%s'", code)
    return "Unknown"


def get_available_language_codes() -> list[str]:
    language_list = get_language_list()
    codes = [
        language["code"]
        for language in language_list
        if language["code"] == "en" or language["percent_translated"] >= 5
    ]
    return codes


def get_language_translation_data(language: str) -> dict[str, str]:
    if language == "en":
        return {}
    locale = translation.to_locale(language)
    path = os.path.join(settings.DEPLOY_ROOT, "locale", locale, "translations.json")
    try:
        with open(path, "rb") as reader:
            return orjson.loads(reader.read())
    except FileNotFoundError:
        print(f"Translation for {language} not found at {path}")
        return {}


def get_and_set_request_language(
    request: HttpRequest, user_configured_language: str, testing_url_language: str | None = None
) -> str:
    # We pick a language for the user as follows:
    # * First priority is the language in the URL, for debugging.
    # * If not in the URL, we use the language from the user's settings.
    request_language = testing_url_language
    if request_language is None:
        request_language = user_configured_language
    translation.activate(request_language)

    # We also want to save the language to the user's cookies, so that
    # something reasonable will happen in logged-in portico pages.
    # We accomplish that by setting a flag on the request which signals
    # to LocaleMiddleware to set the cookie on the response.
    RequestNotes.get_notes(request).set_language = translation.get_language()

    return request_language


def get_browser_language_code(request: HttpRequest) -> str | None:
    accept_lang_header = request.headers.get("Accept-Language")
    if accept_lang_header is None:
        return None

    available_language_codes = get_available_language_codes()
    for accept_lang, priority in parse_accept_lang_header(accept_lang_header):
        if accept_lang == "*":
            return None
        if accept_lang in available_language_codes:
            return accept_lang
    return None


def get_default_language_for_new_user(realm: Realm, *, request: HttpRequest | None) -> str:
    if request is None:
        # Users created via the API or LDAP will not have a
        # browser/request associated with them, and should just use
        # the realm's default language.
        return realm.default_language

    browser_language_code = get_browser_language_code(request)
    if browser_language_code is not None:
        return browser_language_code
    return realm.default_language


def get_default_language_for_anonymous_user(request: HttpRequest) -> str:
    browser_language_code = get_browser_language_code(request)
    if browser_language_code is not None:
        return browser_language_code
    return settings.LANGUAGE_CODE
```

--------------------------------------------------------------------------------

````
