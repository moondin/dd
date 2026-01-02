---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 912
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 912 of 1290)

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

---[FILE: types.py]---
Location: zulip-main/zerver/lib/types.py

```python
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime
from enum import IntEnum
from typing import TYPE_CHECKING, Any, TypeAlias, TypeVar

if TYPE_CHECKING:
    from zerver.models import Stream

from django_stubs_ext import StrPromise
from typing_extensions import NotRequired, TypedDict

# See zerver/lib/validator.py for more details of Validators,
# including many examples
ResultT = TypeVar("ResultT")
Validator: TypeAlias = Callable[[str, object], ResultT]
ExtendedValidator: TypeAlias = Callable[[str, str, object], str]
RealmUserValidator: TypeAlias = Callable[[int, object, bool], list[int]]


ProfileDataElementValue: TypeAlias = str | list[int]


class ProfileDataElementBase(TypedDict, total=False):
    id: int
    name: str
    type: int
    hint: str
    display_in_profile_summary: bool
    required: bool
    editable_by_user: bool
    field_data: str
    order: int


class ProfileDataElement(ProfileDataElementBase):
    value: ProfileDataElementValue | None
    rendered_value: str | None


class ProfileDataElementUpdateDict(TypedDict):
    id: int
    value: ProfileDataElementValue


ProfileData: TypeAlias = list[ProfileDataElement]

FieldElement: TypeAlias = tuple[
    int, StrPromise, Validator[ProfileDataElementValue], Callable[[Any], Any], str
]
ExtendedFieldElement: TypeAlias = tuple[
    int, StrPromise, ExtendedValidator, Callable[[Any], Any], str
]
UserFieldElement: TypeAlias = tuple[int, StrPromise, RealmUserValidator, Callable[[Any], Any], str]

ProfileFieldData: TypeAlias = dict[str, dict[str, str] | str]


class UserDisplayRecipient(TypedDict):
    email: str
    full_name: str
    id: int
    is_mirror_dummy: bool


DisplayRecipientT: TypeAlias = str | list[UserDisplayRecipient]


class LinkifierDict(TypedDict):
    pattern: str
    url_template: str
    id: int


class Unset:
    """In most API endpoints, we use a default value of `None"` to encode
    parameters that the client did not pass, which is nicely Pythonic.

    However, that design does not work for those few endpoints where
    we want to allow clients to pass an explicit `null` (which
    JSON-decodes to `None`).

    We use this type as an explicit sentinel value for such endpoints.

    TODO: Can this be merged with the _NotSpecified class, which is
    currently an internal implementation detail of the typed_endpoint?
    """


UNSET = Unset()


class EditHistoryEvent(TypedDict, total=False):
    """
    Database format for edit history events.
    """

    # user_id is null for precisely those edit history events
    # predating March 2017, when we started tracking the person who
    # made edits, which is still years after the introduction of topic
    # editing support in Zulip.
    user_id: int | None
    timestamp: int
    prev_stream: int
    stream: int
    prev_topic: str
    topic: str
    prev_content: str
    prev_rendered_content: str | None
    prev_rendered_content_version: int | None


class FormattedEditHistoryEvent(TypedDict, total=False):
    """
    Extended format used in the edit history endpoint.
    """

    # See EditHistoryEvent for details on when this can be null.
    user_id: int | None
    timestamp: int
    prev_stream: int
    stream: int
    prev_topic: str
    topic: str
    prev_content: str
    content: str
    prev_rendered_content: str | None
    rendered_content: str | None
    content_html_diff: str


class UserTopicDict(TypedDict, total=False):
    """Dictionary containing fields fetched from the UserTopic model that
    are needed to encode the UserTopic object for the API.
    """

    stream_id: int
    stream__name: str
    topic_name: str
    last_updated: int
    visibility_policy: int


class UserGroupMembersDict(TypedDict):
    direct_members: list[int]
    direct_subgroups: list[int]


@dataclass
class UserGroupMembersData:
    direct_members: list[int]
    direct_subgroups: list[int]


# This next batch of types is for Stream/Subscription objects.
class RawStreamDict(TypedDict):
    """Dictionary containing fields fetched from the Stream model that
    are needed to encode the stream for the API.
    """

    can_add_subscribers_group_id: int
    can_administer_channel_group_id: int
    can_create_topic_group_id: int
    can_delete_any_message_group_id: int
    can_delete_own_message_group_id: int
    can_move_messages_out_of_channel_group_id: int
    can_move_messages_within_channel_group_id: int
    can_send_message_group_id: int
    can_remove_subscribers_group_id: int
    can_resolve_topics_group_id: int
    can_subscribe_group_id: int
    creator_id: int | None
    date_created: datetime
    deactivated: bool
    description: str
    first_message_id: int | None
    folder_id: int | None
    is_recently_active: bool
    history_public_to_subscribers: bool
    id: int
    invite_only: bool
    is_web_public: bool
    message_retention_days: int | None
    name: str
    rendered_description: str
    stream_post_policy: int
    subscriber_count: int
    topics_policy: str


class RawSubscriptionDict(TypedDict):
    """Dictionary containing fields fetched from the Subscription model
    that are needed to encode the subscription for the API.
    """

    active: bool
    audible_notifications: bool | None
    color: str
    desktop_notifications: bool | None
    email_notifications: bool | None
    is_muted: bool
    pin_to_top: bool
    push_notifications: bool | None
    recipient_id: int
    wildcard_mentions_notify: bool | None


class SubscriptionStreamDict(TypedDict):
    """Conceptually, the union of RawSubscriptionDict and RawStreamDict
    (i.e. containing all the user's personal settings for the stream
    as well as the stream's global settings), with a few additional
    computed fields.
    """

    audible_notifications: bool | None
    can_add_subscribers_group: int | UserGroupMembersDict
    can_administer_channel_group: int | UserGroupMembersDict
    can_create_topic_group: int | UserGroupMembersDict
    can_delete_any_message_group: int | UserGroupMembersDict
    can_delete_own_message_group: int | UserGroupMembersDict
    can_move_messages_out_of_channel_group: int | UserGroupMembersDict
    can_move_messages_within_channel_group: int | UserGroupMembersDict
    can_send_message_group: int | UserGroupMembersDict
    can_remove_subscribers_group: int | UserGroupMembersDict
    can_resolve_topics_group: int | UserGroupMembersDict
    can_subscribe_group: int | UserGroupMembersDict
    color: str
    creator_id: int | None
    date_created: int
    description: str
    desktop_notifications: bool | None
    email_notifications: bool | None
    first_message_id: int | None
    folder_id: int | None
    is_recently_active: bool
    history_public_to_subscribers: bool
    in_home_view: bool
    invite_only: bool
    is_announcement_only: bool
    is_archived: bool
    is_muted: bool
    is_web_public: bool
    message_retention_days: int | None
    name: str
    pin_to_top: bool
    push_notifications: bool | None
    rendered_description: str
    stream_id: int
    stream_post_policy: int
    stream_weekly_traffic: int | None
    subscriber_count: int
    subscribers: NotRequired[list[int]]
    partial_subscribers: NotRequired[list[int]]
    topics_policy: str
    wildcard_mentions_notify: bool | None


class NeverSubscribedStreamDict(TypedDict):
    is_archived: bool
    can_add_subscribers_group: int | UserGroupMembersDict
    can_administer_channel_group: int | UserGroupMembersDict
    can_create_topic_group: int | UserGroupMembersDict
    can_delete_any_message_group: int | UserGroupMembersDict
    can_delete_own_message_group: int | UserGroupMembersDict
    can_move_messages_out_of_channel_group: int | UserGroupMembersDict
    can_move_messages_within_channel_group: int | UserGroupMembersDict
    can_send_message_group: int | UserGroupMembersDict
    can_remove_subscribers_group: int | UserGroupMembersDict
    can_resolve_topics_group: int | UserGroupMembersDict
    can_subscribe_group: int | UserGroupMembersDict
    creator_id: int | None
    date_created: int
    description: str
    first_message_id: int | None
    folder_id: int | None
    is_recently_active: bool
    history_public_to_subscribers: bool
    invite_only: bool
    is_announcement_only: bool
    is_web_public: bool
    message_retention_days: int | None
    name: str
    rendered_description: str
    stream_id: int
    stream_post_policy: int
    stream_weekly_traffic: int | None
    subscriber_count: int
    subscribers: NotRequired[list[int]]
    partial_subscribers: NotRequired[list[int]]
    topics_policy: str


class DefaultStreamDict(TypedDict):
    """Stream information provided to Zulip clients as a dictionary via API.
    It should contain all the fields specified in `zerver.models.Stream.API_FIELDS`
    with few exceptions and possible additional fields.
    """

    is_archived: bool
    can_add_subscribers_group: int | UserGroupMembersDict
    can_administer_channel_group: int | UserGroupMembersDict
    can_create_topic_group: int | UserGroupMembersDict
    can_delete_any_message_group: int | UserGroupMembersDict
    can_delete_own_message_group: int | UserGroupMembersDict
    can_move_messages_out_of_channel_group: int | UserGroupMembersDict
    can_move_messages_within_channel_group: int | UserGroupMembersDict
    can_send_message_group: int | UserGroupMembersDict
    can_remove_subscribers_group: int | UserGroupMembersDict
    can_resolve_topics_group: int | UserGroupMembersDict
    can_subscribe_group: int | UserGroupMembersDict
    creator_id: int | None
    date_created: int
    description: str
    first_message_id: int | None
    folder_id: int | None
    is_recently_active: bool
    history_public_to_subscribers: bool
    invite_only: bool
    is_web_public: bool
    message_retention_days: int | None
    name: str
    rendered_description: str
    stream_id: int  # `stream_id` represents `id` of the `Stream` object in `API_FIELDS`
    stream_post_policy: int
    subscriber_count: int
    topics_policy: str
    # Computed fields not specified in `Stream.API_FIELDS`
    is_announcement_only: bool
    is_default: NotRequired[bool]


class APIStreamDict(DefaultStreamDict):
    stream_weekly_traffic: int | None


class APISubscriptionDict(APIStreamDict):
    """Similar to StreamClientDict, it should contain all the fields specified in
    `zerver.models.Subscription.API_FIELDS` and several additional fields.
    """

    audible_notifications: bool | None
    color: str
    desktop_notifications: bool | None
    email_notifications: bool | None
    is_muted: bool
    pin_to_top: bool
    push_notifications: bool | None
    wildcard_mentions_notify: bool | None
    # Computed fields not specified in `Subscription.API_FIELDS`
    in_home_view: bool
    subscribers: list[int]


@dataclass
class SubscriptionInfo:
    subscriptions: list[SubscriptionStreamDict]
    unsubscribed: list[SubscriptionStreamDict]
    never_subscribed: list[NeverSubscribedStreamDict]


class RealmPlaygroundDict(TypedDict):
    id: int
    name: str
    pygments_language: str
    url_template: str


@dataclass
class GroupPermissionSetting:
    allow_nobody_group: bool
    allow_everyone_group: bool
    default_group_name: str
    require_system_group: bool = False
    allow_internet_group: bool = False
    default_for_system_groups: str | None = None
    allowed_system_groups: list[str] = field(default_factory=list)


@dataclass
class ServerSupportedPermissionSettings:
    realm: dict[str, GroupPermissionSetting]
    stream: dict[str, GroupPermissionSetting]
    group: dict[str, GroupPermissionSetting]


class RawUserDict(TypedDict):
    id: int
    full_name: str
    email: str
    avatar_source: str
    avatar_version: int
    is_active: bool
    role: int
    is_bot: bool
    timezone: str
    date_joined: datetime
    bot_owner_id: int | None
    delivery_email: str
    bot_type: int | None
    long_term_idle: bool
    email_address_visibility: int
    is_imported_stub: bool


class RemoteRealmDictValue(TypedDict):
    can_push: bool
    expected_end_timestamp: int | None


class AnalyticsDataUploadLevel(IntEnum):
    NONE = 0
    BASIC = 1
    BILLING = 2
    ALL = 3


@dataclass
class StreamMessageEditRequest:
    is_content_edited: bool
    is_topic_edited: bool
    is_stream_edited: bool
    is_message_moved: bool
    topic_resolved: bool
    topic_unresolved: bool
    content: str
    target_topic_name: str
    target_stream: "Stream"
    orig_content: str
    orig_topic_name: str
    orig_stream: "Stream"
    propagate_mode: str


@dataclass
class DirectMessageEditRequest:
    content: str
    orig_content: str
    is_content_edited: bool
```

--------------------------------------------------------------------------------

---[FILE: url_decoding.py]---
Location: zulip-main/zerver/lib/url_decoding.py
Signals: Django

```python
# See the Zulip URL spec at https://zulip.com/api/zulip-urls

from urllib.parse import unquote, urlsplit

from django.conf import settings

from zerver.lib.narrow_helpers import NarrowTerm
from zerver.lib.topic import DB_TOPIC_NAME


def is_same_server_message_link(url: str) -> bool:
    split_result = urlsplit(url)
    hostname = split_result.hostname
    fragment = split_result.fragment

    if hostname not in {None, settings.EXTERNAL_HOST_WITHOUT_PORT}:
        return False

    # A message link always has category `narrow`, section `channel`
    # or `dm`, and ends with `/near/<message_id>`, where <message_id>
    # is a sequence of digits. The URL fragment of a message link has
    # at least 5 parts. e.g. '#narrow/dm/9,15-dm/near/43'
    fragment_parts = fragment.split("/")
    if len(fragment_parts) < 5:
        return False

    category = fragment_parts[0]
    section = fragment_parts[1]
    ends_with_near_message_id = fragment_parts[-2] == "near" and fragment_parts[-1].isdigit()

    return category == "narrow" and section in {"channel", "dm"} and ends_with_near_message_id


CHANNEL_SYNONYMS = {"stream": "channel", "streams": "channels"}

OPERATOR_SYNONYMS = {
    **CHANNEL_SYNONYMS,
    # "pm-with:" was renamed to "dm:"
    "pm-with": "dm",
    # "group-pm-with:" was replaced with "dm-including:"
    "group-pm-with": "dm-including",
    "from": "sender",
    DB_TOPIC_NAME: "topic",
}


def canonicalize_operator_synonyms(text: str) -> str:
    text = text.lower()
    if text in OPERATOR_SYNONYMS.values():
        return text
    if text in OPERATOR_SYNONYMS:
        return OPERATOR_SYNONYMS[text]
    return text


def parse_recipient_slug(slug: str) -> tuple[int | list[int], str] | None:
    """
    Parses operands formatted in slug containing object ID or IDs.
    Typical of "channel" or private message operands.

    Doesn't parse the legacy pre-2018 stream slug format, which would
    require using data for what channels exist for a proper parse.
        e.g. "stream-name"

    Returns a tuple of parsed ids and the recipient info (channel name,
    DM'ed users name, etc) or only `None` if the operand is invalid.
        e.g.
        - "12,13,14-group" -> ([12, 13, 14], "group")
        - "89-Markl" -> (89, "Markl")
        - "stream-name" -> None
    """
    try:
        ids_string, suffix = slug.split("-", maxsplit=1)
        ids = [int(id) for id in ids_string.split(",")]
        return (ids if len(ids) > 1 else ids[0], suffix)
    except ValueError:
        # We expect this to happen both for invalid URLs and legacy
        # pre-2018 channel link URLs that don't have a channel ID in
        # the slug.
        return None


def decode_hash_component(string: str) -> str:
    # This matches the web app's implementation of decodeHashComponent.
    return unquote(string.replace(".", "%"))


def decode_narrow_operand(operator: str, operand: str) -> str | int | list[int]:
    # These have the similar slug formatting for their operands which
    # contain object ID(s).
    if operator in ["dm-including", "dm", "sender", "channel"]:
        result = parse_recipient_slug(operand)
        return result[0] if isinstance(result, tuple) else ""

    if operator == "near":
        return int(operand) if operand.isdigit() else ""

    operand = decode_hash_component(operand).strip()

    return operand


def parse_narrow_url(
    narrow_url: str,
) -> list[NarrowTerm] | None:
    """This server implementation is intended to match the algorithm
    for the web app's `parse_narrow` in `hash_util.ts`. It largely
    behaves the same way and has the same purpose: to parse a narrow
    URL into a list of `NarrowTerm`.

    The key difference from the web app implementation is that this
    does not validate the referenced objects (users and channels).
    """
    split_result = urlsplit(narrow_url)
    fragment = split_result.fragment
    fragment_parts = fragment.split("/")

    terms: list[NarrowTerm] = []

    for i in range(1, len(fragment_parts), 2):
        raw_operator = decode_hash_component(fragment_parts[i]).strip()

        if not raw_operator:
            return None

        negated = False
        if raw_operator.startswith("-"):
            negated = True
            raw_operator = raw_operator[1:]
        operator = canonicalize_operator_synonyms(raw_operator)

        try:
            raw_operand = fragment_parts[i + 1]
        except IndexError:
            raw_operand = ""
        operand = decode_narrow_operand(operator, raw_operand)

        if operand == "" and operator not in ["topic"]:
            # The empty string is a valid topic (realm_empty_topic_display_name).
            #
            # Other empty string operands are invalid.
            return None

        terms.append(NarrowTerm(operator, operand, negated))
    return terms
```

--------------------------------------------------------------------------------

---[FILE: url_encoding.py]---
Location: zulip-main/zerver/lib/url_encoding.py

```python
# See the Zulip URL spec at https://zulip.com/api/zulip-urls

import urllib.parse
from typing import Any
from urllib.parse import urlsplit

import re2

from zerver.lib.topic import get_topic_from_message_info
from zerver.lib.types import UserDisplayRecipient
from zerver.models import Realm, Stream, UserProfile

hash_replacements = {
    "%": ".",
    "(": ".28",
    ")": ".29",
    ".": ".2E",
}


def encode_hash_component(s: str) -> str:
    encoded = urllib.parse.quote(s, safe="*")
    return "".join(hash_replacements.get(c, c) for c in encoded)


def encode_channel(channel_id: int, channel_name: str, with_operator: bool = False) -> str:
    """
    This encodes the given `channel_id` and `channel_name`
    into a recipient slug string that can be used to
    construct a narrow URL.

    e.g., 9, "Verona" -> "99-Verona"

    The `with_operator` parameter decides whether to append
    the "channel" operator to the recipient slug or not.

    e.g., "channel/99-Verona"
    """
    channel_name = channel_name.replace(" ", "-")
    encoded_channel = str(channel_id) + "-" + encode_hash_component(channel_name)
    if with_operator:
        return f"channel/{encoded_channel}"
    return encoded_channel


def encode_user_ids(
    user_ids: list[int],
    with_operator: bool = False,
) -> str:
    """
    This encodes the given `user_ids` into recipient slug
    string that can be used to construct a narrow URL.

    e.g., [13, 23, 9] -> "13,23,9-group"

    The `with_operator` parameter decides whether to append
    the "dm" operator to the recipient slug or not.

    e.g., "dm/13,23,9-group"

    """
    assert len(user_ids) > 0

    # For 3 or more user ids we use the "-group" decoration tag.
    # If we're only working with 1-2 user ids, it's either a
    # one-on-one direct message or direct message to ones self.
    # In this case, we don't include any decoration tag to the
    # slug.
    decoration_tag = ""
    if len(user_ids) >= 3:
        decoration_tag = "-group"

    direct_message_slug = ",".join([str(user_id) for user_id in sorted(user_ids)]) + decoration_tag
    if with_operator:
        return f"dm/{direct_message_slug}"
    return direct_message_slug


def encode_user_full_name_and_id(full_name: str, user_id: int, with_operator: bool = False) -> str:
    """
    This encodes the given `full_name` and `user_id` into a
    recipient slug string that can be used to construct a
    narrow URL.

    e.g., 9, "King Hamlet" -> "9-King-Hamlet"

    The `with_operator` parameter decides whether to append
    the "dm" operator to the recipient slug or not.

    e.g., "dm/9-King-Hamlet"
    """
    encoded_user_name = re2.sub(r'[ "%\/<>`\p{C}]+', "-", full_name.strip())
    direct_message_slug = str(user_id) + "-" + encoded_user_name
    if with_operator:
        return f"dm/{direct_message_slug}"
    return direct_message_slug


def personal_narrow_url(*, realm: Realm, sender_id: int, sender_full_name: str) -> str:
    base_url = f"{realm.url}/#narrow/dm/"
    direct_message_slug = encode_user_full_name_and_id(sender_full_name, sender_id)
    return base_url + direct_message_slug


def direct_message_group_narrow_url(
    *, user: UserProfile, display_recipient: list[UserDisplayRecipient]
) -> str:
    realm = user.realm
    if len(display_recipient) == 1:
        # For self-DMs, we use the personal narrow URL format.
        return personal_narrow_url(realm=realm, sender_id=user.id, sender_full_name=user.full_name)
    if len(display_recipient) == 2:
        # For 1:1 DMs, we use the personal narrow URL format.
        other_user = next(r for r in display_recipient if r["id"] != user.id)
        return personal_narrow_url(
            realm=realm, sender_id=other_user["id"], sender_full_name=other_user["full_name"]
        )

    # For group DMs with more than 2 users, we use other user IDs to create a slug.
    other_user_ids = [r["id"] for r in display_recipient if r["id"] != user.id]
    direct_message_slug = encode_user_ids(other_user_ids)
    base_url = f"{realm.url}/#narrow/dm/"
    return base_url + direct_message_slug


def stream_narrow_url(realm: Realm, stream: Stream) -> str:
    base_url = f"{realm.url}/#narrow/channel/"
    return base_url + encode_channel(stream.id, stream.name)


def topic_narrow_url(*, realm: Realm, stream: Stream, topic_name: str) -> str:
    base_url = f"{realm.url}/#narrow/channel/"
    return f"{base_url}{encode_channel(stream.id, stream.name)}/topic/{encode_hash_component(topic_name)}"


def message_link_url(
    realm: Realm, message: dict[str, Any], *, conversation_link: bool = False
) -> str:
    if message["type"] == "stream":
        url = stream_message_url(
            realm=realm,
            message=message,
            conversation_link=conversation_link,
        )
        return url

    url = pm_message_url(
        realm=realm,
        message=message,
        conversation_link=conversation_link,
    )
    return url


def stream_message_url(
    realm: Realm | None,
    message: dict[str, Any],
    *,
    conversation_link: bool = False,
    include_base_url: bool = True,
) -> str:
    if include_base_url and realm is None:
        raise ValueError("realm is required when include_base_url=True")
    if conversation_link:
        with_or_near = "with"
    else:
        with_or_near = "near"
    message_id = str(message["id"])
    stream_id = message["stream_id"]
    stream_name = message["display_recipient"]
    topic_name = get_topic_from_message_info(message)
    encoded_topic_name = encode_hash_component(topic_name)
    encoded_stream = encode_channel(stream_id, stream_name)

    narrow_fragments = (
        f"#narrow/channel/{encoded_stream}/topic/{encoded_topic_name}/{with_or_near}/{message_id}"
    )
    if include_base_url is True:
        assert realm is not None
        return f"{realm.url}/{narrow_fragments}"
    return narrow_fragments


def pm_message_url(
    realm: Realm, message: dict[str, Any], *, conversation_link: bool = False
) -> str:
    if conversation_link:
        with_or_near = "with"
    else:
        with_or_near = "near"

    message_id = str(message["id"])
    user_ids = [recipient["id"] for recipient in message["display_recipient"]]

    direct_message_slug = encode_user_ids(user_ids)

    parts = [
        realm.url,
        "#narrow",
        "dm",
        direct_message_slug,
        with_or_near,
        message_id,
    ]
    full_url = "/".join(parts)
    return full_url


def append_url_query_string(original_url: str, query: str) -> str:
    u = urlsplit(original_url)
    query = u.query + ("&" if u.query and query else "") + query
    return u._replace(query=query).geturl()
```

--------------------------------------------------------------------------------

---[FILE: url_redirects.py]---
Location: zulip-main/zerver/lib/url_redirects.py

```python
from dataclasses import dataclass


@dataclass
class URLRedirect:
    old_url: str
    new_url: str


API_DOCUMENTATION_REDIRECTS: list[URLRedirect] = [
    # Add URL redirects for REST API documentation here:
    URLRedirect("/api/delete-stream", "/api/archive-stream"),
]

POLICY_DOCUMENTATION_REDIRECTS: list[URLRedirect] = [
    # Add URL redirects for policy documentation here:
    URLRedirect("/privacy/", "/policies/privacy"),
    URLRedirect("/terms/", "/policies/terms"),
]

LANDING_PAGE_REDIRECTS = [
    # Add URL redirects for corporate landing pages here.
    URLRedirect("/new-user/", "/hello/"),
    URLRedirect("/developer-community/", "/development-community"),
    URLRedirect("/for/companies/", "/for/business"),
    URLRedirect("/for/working-groups-and-communities/", "/for/communities"),
    URLRedirect("/try-zulip/", "https://chat.zulip.org/?show_try_zulip_modal"),
]

DOCUMENTATION_REDIRECTS = API_DOCUMENTATION_REDIRECTS + POLICY_DOCUMENTATION_REDIRECTS

# List of category slugs at the time of changing the URL scheme to have
# `/category` be appended before the category slug. This list does not
# need to change with changing categories.
INTEGRATION_CATEGORY_SLUGS = [
    "bots",
    "communication",
    "continuous-integration",
    "customer-support",
    "deployment",
    "entertainment",
    "financial",
    "hr",
    "marketing",
    "meta-integration",
    "misc",
    "monitoring",
    "productivity",
    "project-management",
    "version-control",
]


def get_integration_category_redirects() -> list[URLRedirect]:
    return [
        URLRedirect(
            f"/integrations/{slug}",
            f"/integrations/category/{slug}",
        )
        for slug in INTEGRATION_CATEGORY_SLUGS
    ]
```

--------------------------------------------------------------------------------

````
