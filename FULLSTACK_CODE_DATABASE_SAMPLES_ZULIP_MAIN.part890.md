---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 890
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 890 of 1290)

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

---[FILE: narrow_helpers.py]---
Location: zulip-main/zerver/lib/narrow_helpers.py
Signals: Django

```python
"""
This module partly exists to prevent circular dependencies.

It also isolates some fairly yucky code related to the fact
that we have to support two formats of narrow specifications
from users:

    legacy:
        [["stream", "devel"], ["is", mentioned"]

    modern:
        [
            {"operator": "stream", "operand": "devel", "negated": "false"},
            {"operator": "is", "operand": "mentioned", "negated": "false"},
        ]

    And then on top of that, we want to represent narrow
    specification internally as dataclasses.
"""

import os
from collections.abc import Collection, Sequence
from dataclasses import dataclass, field

from django.conf import settings


@dataclass
class NarrowTerm:
    operator: str
    operand: str | int | list[int]
    negated: bool


@dataclass
class NeverNegatedNarrowTerm(NarrowTerm):
    negated: bool = field(default=False, init=False)
    operand: str


def narrow_dataclasses_from_tuples(
    tups: Collection[Sequence[str]],
) -> Collection[NeverNegatedNarrowTerm]:
    """
    This method assumes that the callers are in our event-handling codepath, and
    therefore as of summer 2023, they do not yet support the "negated" flag.
    """
    return [NeverNegatedNarrowTerm(operator=tup[0], operand=tup[1]) for tup in tups]


stop_words_list: list[str] | None = None


def read_stop_words() -> list[str]:
    global stop_words_list
    if stop_words_list is None:
        file_path = os.path.join(
            settings.DEPLOY_ROOT, "puppet/zulip/files/postgresql/zulip_english.stop"
        )
        with open(file_path) as f:
            stop_words_list = f.read().splitlines()

    return stop_words_list
```

--------------------------------------------------------------------------------

---[FILE: narrow_predicate.py]---
Location: zulip-main/zerver/lib/narrow_predicate.py
Signals: Django

```python
from collections.abc import Collection
from typing import Any, Protocol

from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError
from zerver.lib.narrow_helpers import NeverNegatedNarrowTerm
from zerver.lib.topic import RESOLVED_TOPIC_PREFIX, get_topic_from_message_info

# "stream" is a legacy alias for "channel"
channel_operators: list[str] = ["channel", "stream"]
# "streams" is a legacy alias for "channels"
channels_operators: list[str] = ["channels", "streams"]


def check_narrow_for_events(narrow: Collection[NeverNegatedNarrowTerm]) -> None:
    supported_operators = [*channel_operators, "topic", "sender", "is"]
    unsupported_is_operands = ["followed"]
    for narrow_term in narrow:
        operator = narrow_term.operator
        if operator not in supported_operators:
            raise JsonableError(_("Operator {operator} not supported.").format(operator=operator))
        if operator == "is" and narrow_term.operand in unsupported_is_operands:
            raise JsonableError(
                _("Operand {operand} not supported.").format(operand=narrow_term.operand)
            )


class NarrowPredicate(Protocol):
    def __call__(self, *, message: dict[str, Any], flags: list[str]) -> bool: ...


def build_narrow_predicate(
    narrow: Collection[NeverNegatedNarrowTerm],
) -> NarrowPredicate:
    """Changes to this function should come with corresponding changes to
    NarrowLibraryTest."""
    check_narrow_for_events(narrow)

    def narrow_predicate(*, message: dict[str, Any], flags: list[str]) -> bool:
        def satisfies_operator(*, operator: str, operand: str) -> bool:
            if operator in channel_operators:
                if message["type"] != "stream":
                    return False
                if operand.lower() != message["display_recipient"].lower():
                    return False
            elif operator == "topic":
                if message["type"] != "stream":
                    return False
                topic_name = get_topic_from_message_info(message)
                if operand.lower() != topic_name.lower():
                    return False
            elif operator == "sender":
                if operand.lower() != message["sender_email"].lower():
                    return False
            elif operator == "is" and operand in ["dm", "private"]:
                # "is:private" is a legacy alias for "is:dm"
                if message["type"] != "private":
                    return False
            elif operator == "is" and operand in ["starred"]:
                if operand not in flags:
                    return False
            elif operator == "is" and operand == "unread":
                if "read" in flags:
                    return False
            elif operator == "is" and operand in ["alerted", "mentioned"]:
                if "mentioned" not in flags:
                    return False
            elif operator == "is" and operand == "resolved":
                if message["type"] != "stream":
                    return False
                topic_name = get_topic_from_message_info(message)
                if not topic_name.startswith(RESOLVED_TOPIC_PREFIX):
                    return False
            return True

        for narrow_term in narrow:
            # TODO: Eventually handle negated narrow terms.
            if not satisfies_operator(operator=narrow_term.operator, operand=narrow_term.operand):
                return False

        return True

    return narrow_predicate
```

--------------------------------------------------------------------------------

---[FILE: navigation_views.py]---
Location: zulip-main/zerver/lib/navigation_views.py
Signals: Django

```python
from typing import TypedDict

from django.utils.translation import gettext as _

from zerver.lib.exceptions import ResourceNotFoundError
from zerver.models import NavigationView, UserProfile


class NavigationViewDict(TypedDict):
    fragment: str
    is_pinned: bool
    name: str | None


def get_navigation_view(user: UserProfile, fragment: str) -> NavigationView:
    try:
        navigation_view = NavigationView.objects.get(user=user, fragment=fragment)
        return navigation_view
    except NavigationView.DoesNotExist:
        raise ResourceNotFoundError(_("Navigation view does not exist."))


def get_navigation_view_dict(navigation_view: NavigationView) -> NavigationViewDict:
    return NavigationViewDict(
        fragment=navigation_view.fragment,
        is_pinned=navigation_view.is_pinned,
        name=navigation_view.name,
    )


def get_navigation_views_for_user(user: UserProfile) -> list[NavigationViewDict]:
    navigation_views = NavigationView.objects.filter(user=user)
    return [get_navigation_view_dict(navigation_view) for navigation_view in navigation_views]
```

--------------------------------------------------------------------------------

---[FILE: notes.py]---
Location: zulip-main/zerver/lib/notes.py
Signals: Django

```python
import weakref
from abc import ABC, abstractmethod
from collections.abc import MutableMapping
from typing import Any, ClassVar, Generic, TypeVar

from typing_extensions import override

_KeyT = TypeVar("_KeyT")
_DataT = TypeVar("_DataT")


class BaseNotes(ABC, Generic[_KeyT, _DataT]):
    """This class defines a generic type-safe mechanism for associating
    additional data with an object (without modifying the original
    object via subclassing or monkey-patching).

    It was originally designed to avoid monkey-patching the Django
    HttpRequest object, to which we want to associate computed state
    (e.g. parsed state computed from the User-Agent) so that it's
    available in code paths that receive the HttpRequest object.

    The implementation uses a WeakKeyDictionary, so that the notes
    object will be garbage-collected when the original object no
    longer has other references (avoiding memory leaks).

    We still need to be careful to avoid any of the attributes of
    _DataT having points to the original object, as that can create a
    cyclic reference cycle that the Python garbage collect may not
    handle correctly.
    """

    __notes_map: ClassVar[MutableMapping[Any, Any]]

    @override
    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        if not hasattr(cls, "__notes_map"):
            cls.__notes_map = weakref.WeakKeyDictionary()

    @classmethod
    def get_notes(cls, key: _KeyT) -> _DataT:
        try:
            return cls.__notes_map[key]
        except KeyError:
            cls.__notes_map[key] = cls.init_notes()
            return cls.__notes_map[key]

    @classmethod
    def set_notes(cls, key: _KeyT, notes: _DataT) -> None:
        cls.__notes_map[key] = notes

    @classmethod
    @abstractmethod
    def init_notes(cls) -> _DataT: ...
```

--------------------------------------------------------------------------------

---[FILE: notification_data.py]---
Location: zulip-main/zerver/lib/notification_data.py

```python
import math
from collections.abc import Collection
from dataclasses import dataclass
from typing import Any

from zerver.lib.mention import MentionData
from zerver.lib.user_groups import get_user_group_member_ids
from zerver.models import NamedUserGroup, UserProfile, UserTopic
from zerver.models.scheduled_jobs import NotificationTriggers


@dataclass
class UserMessageNotificationsData:
    user_id: int
    online_push_enabled: bool
    dm_email_notify: bool
    dm_push_notify: bool
    mention_email_notify: bool
    mention_push_notify: bool
    topic_wildcard_mention_email_notify: bool
    topic_wildcard_mention_push_notify: bool
    stream_wildcard_mention_email_notify: bool
    stream_wildcard_mention_push_notify: bool
    stream_push_notify: bool
    stream_email_notify: bool
    followed_topic_push_notify: bool
    followed_topic_email_notify: bool
    topic_wildcard_mention_in_followed_topic_push_notify: bool
    topic_wildcard_mention_in_followed_topic_email_notify: bool
    stream_wildcard_mention_in_followed_topic_push_notify: bool
    stream_wildcard_mention_in_followed_topic_email_notify: bool
    sender_is_muted: bool
    disable_external_notifications: bool

    def __post_init__(self) -> None:
        # Check that there's no dubious data.
        if self.dm_email_notify or self.dm_push_notify:
            assert not (
                self.stream_email_notify
                or self.stream_push_notify
                or self.followed_topic_email_notify
                or self.followed_topic_push_notify
            )

        if (
            self.stream_email_notify
            or self.stream_push_notify
            or self.followed_topic_email_notify
            or self.followed_topic_push_notify
        ):
            assert not (self.dm_email_notify or self.dm_push_notify)

    @classmethod
    def from_user_id_sets(
        cls,
        *,
        user_id: int,
        flags: Collection[str],
        private_message: bool,
        disable_external_notifications: bool,
        online_push_user_ids: set[int],
        dm_mention_push_disabled_user_ids: set[int],
        dm_mention_email_disabled_user_ids: set[int],
        stream_push_user_ids: set[int],
        stream_email_user_ids: set[int],
        topic_wildcard_mention_user_ids: set[int],
        stream_wildcard_mention_user_ids: set[int],
        followed_topic_push_user_ids: set[int],
        followed_topic_email_user_ids: set[int],
        topic_wildcard_mention_in_followed_topic_user_ids: set[int],
        stream_wildcard_mention_in_followed_topic_user_ids: set[int],
        muted_sender_user_ids: set[int],
        all_bot_user_ids: set[int],
        push_device_registered_user_ids: set[int] | None,
    ) -> "UserMessageNotificationsData":
        if user_id in all_bot_user_ids:
            # Don't send any notifications to bots
            return cls(
                user_id=user_id,
                dm_email_notify=False,
                mention_email_notify=False,
                topic_wildcard_mention_email_notify=False,
                stream_wildcard_mention_email_notify=False,
                dm_push_notify=False,
                mention_push_notify=False,
                topic_wildcard_mention_push_notify=False,
                stream_wildcard_mention_push_notify=False,
                online_push_enabled=False,
                stream_push_notify=False,
                stream_email_notify=False,
                followed_topic_push_notify=False,
                followed_topic_email_notify=False,
                topic_wildcard_mention_in_followed_topic_push_notify=False,
                topic_wildcard_mention_in_followed_topic_email_notify=False,
                stream_wildcard_mention_in_followed_topic_push_notify=False,
                stream_wildcard_mention_in_followed_topic_email_notify=False,
                sender_is_muted=False,
                disable_external_notifications=False,
            )

        # `stream_wildcard_mention_user_ids`, `topic_wildcard_mention_user_ids`,
        # `stream_wildcard_mention_in_followed_topic_user_ids` and `topic_wildcard_mention_in_followed_topic_user_ids`
        # are those user IDs for whom stream or topic wildcard mentions should obey notification
        # settings for personal mentions. Hence, it isn't an independent notification setting and acts as a wrapper.
        dm_email_notify = user_id not in dm_mention_email_disabled_user_ids and private_message
        mention_email_notify = (
            user_id not in dm_mention_email_disabled_user_ids and "mentioned" in flags
        )
        topic_wildcard_mention_email_notify = (
            user_id in topic_wildcard_mention_user_ids
            and user_id not in dm_mention_email_disabled_user_ids
            and "topic_wildcard_mentioned" in flags
        )
        stream_wildcard_mention_email_notify = (
            user_id in stream_wildcard_mention_user_ids
            and user_id not in dm_mention_email_disabled_user_ids
            and "stream_wildcard_mentioned" in flags
        )
        topic_wildcard_mention_in_followed_topic_email_notify = (
            user_id in topic_wildcard_mention_in_followed_topic_user_ids
            and user_id not in dm_mention_email_disabled_user_ids
            and "topic_wildcard_mentioned" in flags
        )
        stream_wildcard_mention_in_followed_topic_email_notify = (
            user_id in stream_wildcard_mention_in_followed_topic_user_ids
            and user_id not in dm_mention_email_disabled_user_ids
            and "stream_wildcard_mentioned" in flags
        )

        # TODO/compatibility: `push_device_registered_user_ids` is None when
        # `process_message_event`/`process_message_update_event` handles events
        # prior to the introduction of `push_device_registered_user_ids` field in the events.
        # We hardcode `push_device_registered` to True as the check is meant for newer events.
        #
        # Remove the `if` block when one can no longer directly upgrade from 11.x to main.
        if push_device_registered_user_ids is None:
            push_device_registered = True
        else:
            push_device_registered = user_id in push_device_registered_user_ids

        dm_push_notify = (
            push_device_registered
            and user_id not in dm_mention_push_disabled_user_ids
            and private_message
        )
        mention_push_notify = (
            push_device_registered
            and user_id not in dm_mention_push_disabled_user_ids
            and "mentioned" in flags
        )
        topic_wildcard_mention_push_notify = (
            push_device_registered
            and user_id in topic_wildcard_mention_user_ids
            and user_id not in dm_mention_push_disabled_user_ids
            and "topic_wildcard_mentioned" in flags
        )
        stream_wildcard_mention_push_notify = (
            push_device_registered
            and user_id in stream_wildcard_mention_user_ids
            and user_id not in dm_mention_push_disabled_user_ids
            and "stream_wildcard_mentioned" in flags
        )
        topic_wildcard_mention_in_followed_topic_push_notify = (
            push_device_registered
            and user_id in topic_wildcard_mention_in_followed_topic_user_ids
            and user_id not in dm_mention_push_disabled_user_ids
            and "topic_wildcard_mentioned" in flags
        )
        stream_wildcard_mention_in_followed_topic_push_notify = (
            push_device_registered
            and user_id in stream_wildcard_mention_in_followed_topic_user_ids
            and user_id not in dm_mention_push_disabled_user_ids
            and "stream_wildcard_mentioned" in flags
        )
        online_push_enabled = push_device_registered and user_id in online_push_user_ids
        stream_push_notify = push_device_registered and user_id in stream_push_user_ids
        followed_topic_push_notify = (
            push_device_registered and user_id in followed_topic_push_user_ids
        )
        return cls(
            user_id=user_id,
            dm_email_notify=dm_email_notify,
            mention_email_notify=mention_email_notify,
            topic_wildcard_mention_email_notify=topic_wildcard_mention_email_notify,
            stream_wildcard_mention_email_notify=stream_wildcard_mention_email_notify,
            dm_push_notify=dm_push_notify,
            mention_push_notify=mention_push_notify,
            topic_wildcard_mention_push_notify=topic_wildcard_mention_push_notify,
            stream_wildcard_mention_push_notify=stream_wildcard_mention_push_notify,
            online_push_enabled=online_push_enabled,
            stream_push_notify=stream_push_notify,
            stream_email_notify=user_id in stream_email_user_ids,
            followed_topic_push_notify=followed_topic_push_notify,
            followed_topic_email_notify=user_id in followed_topic_email_user_ids,
            topic_wildcard_mention_in_followed_topic_push_notify=topic_wildcard_mention_in_followed_topic_push_notify,
            topic_wildcard_mention_in_followed_topic_email_notify=topic_wildcard_mention_in_followed_topic_email_notify,
            stream_wildcard_mention_in_followed_topic_push_notify=stream_wildcard_mention_in_followed_topic_push_notify,
            stream_wildcard_mention_in_followed_topic_email_notify=stream_wildcard_mention_in_followed_topic_email_notify,
            sender_is_muted=user_id in muted_sender_user_ids,
            disable_external_notifications=disable_external_notifications,
        )

    # For these functions, acting_user_id is the user sent a message
    # (or edited a message) triggering the event for which we need to
    # determine notifiability.
    def trivially_should_not_notify(self, acting_user_id: int) -> bool:
        """Common check for reasons not to trigger a notification that are
        independent of users' notification settings and thus don't
        depend on what type of notification (email/push) it is.
        """
        if self.user_id == acting_user_id:
            return True

        if self.sender_is_muted:
            return True

        if self.disable_external_notifications:
            return True

        return False

    def is_notifiable(self, acting_user_id: int, idle: bool) -> bool:
        return self.is_email_notifiable(acting_user_id, idle) or self.is_push_notifiable(
            acting_user_id, idle
        )

    def is_push_notifiable(self, acting_user_id: int, idle: bool) -> bool:
        return self.get_push_notification_trigger(acting_user_id, idle) is not None

    def get_push_notification_trigger(self, acting_user_id: int, idle: bool) -> str | None:
        if not idle and not self.online_push_enabled:
            return None

        if self.trivially_should_not_notify(acting_user_id):
            return None

        # The order here is important. If, for example, both
        # `mention_push_notify` and `stream_push_notify` are True, we
        # want to classify it as a mention, since that's more salient.
        if self.dm_push_notify:
            return NotificationTriggers.DIRECT_MESSAGE
        elif self.mention_push_notify:
            return NotificationTriggers.MENTION
        elif self.topic_wildcard_mention_in_followed_topic_push_notify:
            return NotificationTriggers.TOPIC_WILDCARD_MENTION_IN_FOLLOWED_TOPIC
        elif self.stream_wildcard_mention_in_followed_topic_push_notify:
            return NotificationTriggers.STREAM_WILDCARD_MENTION_IN_FOLLOWED_TOPIC
        elif self.topic_wildcard_mention_push_notify:
            return NotificationTriggers.TOPIC_WILDCARD_MENTION
        elif self.stream_wildcard_mention_push_notify:
            return NotificationTriggers.STREAM_WILDCARD_MENTION
        elif self.followed_topic_push_notify:
            return NotificationTriggers.FOLLOWED_TOPIC_PUSH
        elif self.stream_push_notify:
            return NotificationTriggers.STREAM_PUSH
        else:
            return None

    def is_email_notifiable(self, acting_user_id: int, idle: bool) -> bool:
        return self.get_email_notification_trigger(acting_user_id, idle) is not None

    def get_email_notification_trigger(self, acting_user_id: int, idle: bool) -> str | None:
        if not idle:
            return None

        if self.trivially_should_not_notify(acting_user_id):
            return None

        # The order here is important. If, for example, both
        # `mention_email_notify` and `stream_email_notify` are True, we
        # want to classify it as a mention, since that's more salient.
        if self.dm_email_notify:
            return NotificationTriggers.DIRECT_MESSAGE
        elif self.mention_email_notify:
            return NotificationTriggers.MENTION
        elif self.topic_wildcard_mention_in_followed_topic_email_notify:
            return NotificationTriggers.TOPIC_WILDCARD_MENTION_IN_FOLLOWED_TOPIC
        elif self.stream_wildcard_mention_in_followed_topic_email_notify:
            return NotificationTriggers.STREAM_WILDCARD_MENTION_IN_FOLLOWED_TOPIC
        elif self.topic_wildcard_mention_email_notify:
            return NotificationTriggers.TOPIC_WILDCARD_MENTION
        elif self.stream_wildcard_mention_email_notify:
            return NotificationTriggers.STREAM_WILDCARD_MENTION
        elif self.followed_topic_email_notify:
            return NotificationTriggers.FOLLOWED_TOPIC_EMAIL
        elif self.stream_email_notify:
            return NotificationTriggers.STREAM_EMAIL
        else:
            return None


def user_allows_notifications_in_StreamTopic(
    stream_is_muted: bool,
    visibility_policy: int,
    stream_specific_setting: bool | None,
    global_setting: bool,
) -> bool:
    """
    Captures the hierarchy of notification settings, where visibility policy is considered first,
    followed by stream-specific settings, and the global-setting in the UserProfile is the fallback.
    """
    if stream_is_muted and visibility_policy != UserTopic.VisibilityPolicy.UNMUTED:
        return False

    if visibility_policy == UserTopic.VisibilityPolicy.MUTED:
        return False

    if stream_specific_setting is not None:
        return stream_specific_setting

    return global_setting


def get_user_group_mentions_data(
    mentioned_user_ids: set[int], mentioned_user_group_ids: list[int], mention_data: MentionData
) -> dict[int, int]:
    # Maps user_id -> mentioned user_group_id
    mentioned_user_groups_map: dict[int, int] = dict()

    # Add members of the mentioned user groups into `mentions_user_ids`.
    for group_id in mentioned_user_group_ids:
        member_ids = mention_data.get_group_members(group_id)
        for member_id in member_ids:
            if member_id in mentioned_user_ids:
                # If a user is also mentioned personally, we use that as a trigger
                # for notifications.
                continue

            if member_id in mentioned_user_groups_map:
                # If multiple user groups are mentioned, we prefer the
                # user group with the least members for email/mobile
                # notifications.
                previous_group_id = mentioned_user_groups_map[member_id]
                previous_group_member_ids = mention_data.get_group_members(previous_group_id)

                if len(previous_group_member_ids) > len(member_ids):
                    mentioned_user_groups_map[member_id] = group_id
            else:
                mentioned_user_groups_map[member_id] = group_id

    return mentioned_user_groups_map


@dataclass
class MentionedUserGroup:
    id: int
    name: str
    members_count: int


def get_mentioned_user_group(
    messages: list[dict[str, Any]], user_profile: UserProfile
) -> MentionedUserGroup | None:
    """Returns the user group name to display in the email notification
    if user group(s) are mentioned.

    This implements the same algorithm as get_user_group_mentions_data
    in zerver/lib/notification_data.py, but we're passed a list of
    messages instead.
    """
    for message in messages:
        if (
            message.get("mentioned_user_group_id") is None
            and message["trigger"] == NotificationTriggers.MENTION
        ):
            # The user has also been personally mentioned, so that gets prioritized.
            return None

    # These IDs are those of the smallest user groups mentioned in each message.
    mentioned_user_group_ids = [
        message["mentioned_user_group_id"]
        for message in messages
        if message.get("mentioned_user_group_id") is not None
    ]

    if len(mentioned_user_group_ids) == 0:
        return None

    # We now want to calculate the name of the smallest user group mentioned among
    # all these messages.
    smallest_user_group_size = math.inf
    for user_group_id in mentioned_user_group_ids:
        current_user_group = NamedUserGroup.objects.get(
            id=user_group_id, realm_for_sharding=user_profile.realm
        )
        current_mentioned_user_group = MentionedUserGroup(
            id=current_user_group.id,
            name=current_user_group.name,
            members_count=len(get_user_group_member_ids(current_user_group)),
        )

        if current_mentioned_user_group.members_count < smallest_user_group_size:
            # If multiple user groups are mentioned, we prefer the
            # user group with the least members.
            smallest_user_group_size = current_mentioned_user_group.members_count
            smallest_mentioned_user_group = current_mentioned_user_group

    return smallest_mentioned_user_group
```

--------------------------------------------------------------------------------

````
