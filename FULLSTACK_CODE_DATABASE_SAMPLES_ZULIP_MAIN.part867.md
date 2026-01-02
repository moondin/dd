---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 867
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 867 of 1290)

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

---[FILE: attachments.py]---
Location: zulip-main/zerver/lib/attachments.py
Signals: Django

```python
from datetime import timedelta
from typing import Any

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.db.models import Exists, OuterRef, QuerySet
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError, RateLimitedError
from zerver.lib.streams import is_user_in_groups_granting_content_access
from zerver.lib.upload import delete_message_attachment
from zerver.lib.user_groups import get_recursive_membership_groups
from zerver.models import (
    ArchivedAttachment,
    Attachment,
    Message,
    Realm,
    Recipient,
    Stream,
    Subscription,
    UserMessage,
    UserProfile,
)


def user_attachments(user_profile: UserProfile) -> list[dict[str, Any]]:
    attachments = Attachment.objects.filter(owner=user_profile).prefetch_related("messages")
    return [a.to_dict() for a in attachments]


def access_attachment_by_id(
    user_profile: UserProfile, attachment_id: int, needs_owner: bool = False
) -> Attachment:
    query = Attachment.objects.filter(id=attachment_id)
    if needs_owner:
        query = query.filter(owner=user_profile)

    attachment = query.first()
    if attachment is None:
        raise JsonableError(_("Invalid attachment"))
    return attachment


def remove_attachment(user_profile: UserProfile, attachment: Attachment) -> None:
    try:
        delete_message_attachment(attachment.path_id)
    except Exception:
        raise JsonableError(
            _("An error occurred while deleting the attachment. Please try again later.")
        )
    attachment.delete()


def validate_attachment_request_for_spectator_access(realm: Realm, attachment: Attachment) -> bool:
    if attachment.realm != realm:
        return False

    # Update cached is_web_public property, if necessary.
    if attachment.is_web_public is None:
        # Fill the cache in a single query. This is important to avoid
        # a potential race condition between checking and setting,
        # where the attachment could have been moved again.
        Attachment.objects.filter(id=attachment.id, is_web_public__isnull=True).update(
            is_web_public=Exists(
                Message.objects.filter(
                    # Uses index: zerver_attachment_messages_attachment_id_message_id_key
                    realm_id=realm.id,
                    attachment=OuterRef("id"),
                    recipient__stream__invite_only=False,
                    recipient__stream__is_web_public=True,
                ),
            ),
        )
        attachment.refresh_from_db()

    if not attachment.is_web_public:
        return False

    if settings.RATE_LIMITING:
        try:
            from zerver.lib.rate_limiter import rate_limit_spectator_attachment_access_by_file

            rate_limit_spectator_attachment_access_by_file(attachment.path_id)
        except RateLimitedError:
            return False

    return True


def validate_attachment_request(
    maybe_user_profile: UserProfile | AnonymousUser,
    path_id: str,
    realm: Realm | None = None,
) -> tuple[bool, Attachment | None]:
    try:
        attachment = Attachment.objects.get(path_id=path_id)
    except Attachment.DoesNotExist:
        return False, None

    if isinstance(maybe_user_profile, AnonymousUser):
        assert realm is not None
        return validate_attachment_request_for_spectator_access(realm, attachment), attachment

    user_profile = maybe_user_profile
    assert isinstance(user_profile, UserProfile)

    # Update cached is_realm_public property, if necessary.
    if attachment.is_realm_public is None:
        # Fill the cache in a single query. This is important to avoid
        # a potential race condition between checking and setting,
        # where the attachment could have been moved again.
        Attachment.objects.filter(id=attachment.id, is_realm_public__isnull=True).update(
            is_realm_public=Exists(
                Message.objects.filter(
                    # Uses index: zerver_attachment_messages_attachment_id_message_id_key
                    realm_id=user_profile.realm_id,
                    attachment=OuterRef("id"),
                    recipient__stream__invite_only=False,
                ),
            ),
        )
        attachment.refresh_from_db()

    if user_profile.id == attachment.owner_id:
        # If you own the file, you can access it.
        return True, attachment
    if (
        attachment.is_realm_public
        and attachment.realm == user_profile.realm
        and user_profile.can_access_public_streams()
    ):
        # Any user in the realm can access realm-public files
        return True, attachment

    messages = attachment.messages.all().select_related("recipient")

    usermessages_channel_ids = set()
    usermessage_rows = UserMessage.objects.filter(
        user_profile=user_profile, message__in=messages
    ).select_related("message", "message__recipient")
    for um in usermessage_rows:
        if not um.message.is_channel_message:
            # If the attachment was sent in a direct message or group direct
            # message then anyone who received that message can access it.
            return True, attachment
        else:
            usermessages_channel_ids.add(um.message.recipient.type_id)

    # These are subscriptions to a channel one of the messages was sent to
    subscribed_channel_ids = Subscription.objects.filter(
        user_profile=user_profile,
        active=True,
        recipient__type=Recipient.STREAM,
        recipient__in=[m.recipient_id for m in messages],
    ).values_list("recipient__type_id", flat=True)

    if usermessages_channel_ids.intersection(subscribed_channel_ids):
        # If the attachment was sent in a channel with public
        # or protected history and the user is still subscribed
        # to the channel then anyone who received that message
        # can access it.
        return True, attachment

    message_channel_ids = set()
    for message in messages:
        if message.is_channel_message:
            message_channel_ids.add(message.recipient.type_id)

    if len(message_channel_ids) == 0:
        # If only DMs are relevant, return early here.
        return False, attachment

    # The remaining code path is slow but should only be relevant
    # rarely: Users trying to view an attachment that was shared with
    # at least one channel, but the user is not subscribed to any such
    # channel. So it's not important that the accurate check for this
    # corner case is somewhat more expensive to check groups-based
    # permissions; we're no longer in a hot code path.
    message_channels = Stream.objects.filter(id__in=message_channel_ids)
    for channel in message_channels:
        # The user didn't receive any of the messages that included
        # this attachment. But they might still have access to it,
        # if it was sent to a stream they are subscribed to where
        # history is public to subscribers.
        if channel.id in subscribed_channel_ids and channel.is_history_public_to_subscribers():
            return True, attachment

    user_recursive_group_ids = set(
        get_recursive_membership_groups(user_profile).values_list("id", flat=True)
    )
    for channel in message_channels:
        if is_user_in_groups_granting_content_access(channel, user_recursive_group_ids):
            if channel.is_history_public_to_subscribers():
                return True, attachment
            # If the user had received the message at one point of
            # time, but they are no longer subscribed to a stream
            # with protected history. They can still access that
            # message and it's attachment
            elif channel.id in usermessages_channel_ids:
                return True, attachment

    return False, attachment


def get_old_unclaimed_attachments(
    weeks_ago: int,
) -> tuple[QuerySet[Attachment], QuerySet[ArchivedAttachment]]:
    """
    The logic in this function is fairly tricky. The essence is that
    a file should be cleaned up if and only if it not referenced by any
    Message, ScheduledMessage or ArchivedMessage. The way to find that out is through the
    Attachment and ArchivedAttachment tables.
    The queries are complicated by the fact that an uploaded file
    may have either only an Attachment row, only an ArchivedAttachment row,
    or both - depending on whether some, all or none of the messages
    linking to it have been archived.
    """
    delta_weeks_ago = timezone_now() - timedelta(weeks=weeks_ago)

    # The Attachment vs ArchivedAttachment queries are asymmetric because only
    # Attachment has the scheduled_messages relation.
    old_attachments = Attachment.objects.alias(
        has_other_messages=Exists(
            ArchivedAttachment.objects.filter(id=OuterRef("id")).exclude(messages=None)
        )
    ).filter(
        messages=None,
        scheduled_messages=None,
        create_time__lt=delta_weeks_ago,
        has_other_messages=False,
    )
    old_archived_attachments = ArchivedAttachment.objects.alias(
        has_other_messages=Exists(
            Attachment.objects.filter(id=OuterRef("id")).exclude(
                messages=None, scheduled_messages=None
            )
        )
    ).filter(messages=None, create_time__lt=delta_weeks_ago, has_other_messages=False)

    return old_attachments, old_archived_attachments
```

--------------------------------------------------------------------------------

---[FILE: avatar.py]---
Location: zulip-main/zerver/lib/avatar.py
Signals: Django

```python
from urllib.parse import urljoin

from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage

from zerver.lib.avatar_hash import (
    gravatar_hash,
    user_avatar_base_path_from_ids,
    user_avatar_content_hash,
)
from zerver.lib.thumbnail import MEDIUM_AVATAR_SIZE
from zerver.lib.upload import get_avatar_url
from zerver.lib.url_encoding import append_url_query_string
from zerver.models import UserProfile
from zerver.models.users import is_cross_realm_bot_email

STATIC_AVATARS_DIR = "images/static_avatars/"

DEFAULT_AVATAR_FILE = "images/default-avatar.png"


def avatar_url(
    user_profile: UserProfile, medium: bool = False, client_gravatar: bool = False
) -> str | None:
    return get_avatar_field(
        user_id=user_profile.id,
        realm_id=user_profile.realm_id,
        email=user_profile.delivery_email,
        avatar_source=user_profile.avatar_source,
        avatar_version=user_profile.avatar_version,
        medium=medium,
        client_gravatar=client_gravatar,
    )


def get_system_bots_avatar_file_name(email: str) -> str:
    system_bot_avatar_name_map = {
        settings.WELCOME_BOT: "welcome-bot",
        settings.NOTIFICATION_BOT: "notification-bot",
        settings.EMAIL_GATEWAY_BOT: "emailgateway",
    }
    return urljoin(STATIC_AVATARS_DIR, system_bot_avatar_name_map.get(email, "unknown"))


def get_static_avatar_url(email: str, medium: bool) -> str:
    avatar_file_name = get_system_bots_avatar_file_name(email)
    avatar_file_name += "-medium.png" if medium else ".png"

    if settings.DEBUG:
        # This find call may not be cheap, so we only do it in the
        # development environment to do an assertion.
        from django.contrib.staticfiles.finders import find

        if not find(avatar_file_name):
            raise AssertionError(f"Unknown avatar file for: {email}")
    elif settings.STATIC_ROOT and not staticfiles_storage.exists(avatar_file_name):
        # Fallback for the case where no avatar exists; this should
        # never happen in practice. This logic cannot be executed
        # while STATIC_ROOT is not defined, so the above STATIC_ROOT
        # check is important.
        return DEFAULT_AVATAR_FILE

    return staticfiles_storage.url(avatar_file_name)


def get_avatar_field(
    user_id: int,
    realm_id: int,
    email: str,
    avatar_source: str,
    avatar_version: int,
    medium: bool,
    client_gravatar: bool,
) -> str | None:
    """
    Most of the parameters to this function map to fields
    by the same name in UserProfile (avatar_source, realm_id,
    email, etc.).

    Then there are these:

        medium - This means we want a medium-sized avatar. This can
            affect the "s" parameter for gravatar avatars, or it
            can give us something like foo-medium.png for
            user-uploaded avatars.

        client_gravatar - If the client can compute their own
            gravatars, this will be set to True, and we'll avoid
            computing them on the server (mostly to save bandwidth).
    """

    # System bots have hardcoded avatars
    if is_cross_realm_bot_email(email):
        return get_static_avatar_url(email, medium)

    """
    If our client knows how to calculate gravatar hashes, we
    will return None and let the client compute the gravatar
    url.
    """
    if (
        client_gravatar
        and settings.ENABLE_GRAVATAR
        and avatar_source == UserProfile.AVATAR_FROM_GRAVATAR
    ):
        return None

    """
    If we get this far, we'll compute an avatar URL that may be
    either user-uploaded or a gravatar, and then we'll add version
    info to try to avoid stale caches.
    """
    if avatar_source == "U":
        hash_key = user_avatar_base_path_from_ids(user_id, avatar_version, realm_id)
        return get_avatar_url(hash_key, medium=medium)

    return get_gravatar_url(
        email=email,
        avatar_version=avatar_version,
        realm_id=realm_id,
        medium=medium,
    )


def get_gravatar_url(email: str, avatar_version: int, realm_id: int, medium: bool = False) -> str:
    url = _get_unversioned_gravatar_url(email, medium, realm_id)
    return append_url_query_string(url, f"version={avatar_version:d}")


def _get_unversioned_gravatar_url(email: str, medium: bool, realm_id: int) -> str:
    use_gravatar = settings.ENABLE_GRAVATAR
    if realm_id in settings.GRAVATAR_REALM_OVERRIDE:
        use_gravatar = settings.GRAVATAR_REALM_OVERRIDE[realm_id]

    if use_gravatar:
        gravitar_query_suffix = f"&s={MEDIUM_AVATAR_SIZE}" if medium else ""
        hash_key = gravatar_hash(email)
        return f"https://secure.gravatar.com/avatar/{hash_key}?d=identicon{gravitar_query_suffix}"
    elif settings.DEFAULT_AVATAR_URI is not None:
        return settings.DEFAULT_AVATAR_URI
    else:
        return staticfiles_storage.url("images/default-avatar.png")


def absolute_avatar_url(
    user_profile: UserProfile,
    # Pass `realm_url` to avoid a DB query when `user_profile.realm` isn't
    # already loaded but the caller has realm available from another source.
    realm_url: str | None = None,
) -> str:
    """
    Absolute URLs are used to simplify logic for applications that
    won't be served by browsers, such as rendering GCM notifications.
    """
    avatar = avatar_url(user_profile)
    # avatar_url can return None if client_gravatar=True, however here we use the default value of False
    assert avatar is not None
    if realm_url is None:
        realm_url = user_profile.realm.url
    return urljoin(realm_url, avatar)


def is_avatar_new(ldap_avatar: bytes, user_profile: UserProfile) -> bool:
    new_avatar_hash = user_avatar_content_hash(ldap_avatar)

    if user_profile.avatar_hash and user_profile.avatar_hash == new_avatar_hash:
        # If an avatar exists and is the same as the new avatar,
        # then, no need to change the avatar.
        return False

    return True


def get_avatar_for_inaccessible_user() -> str:
    return staticfiles_storage.url("images/unknown-user-avatar.png")
```

--------------------------------------------------------------------------------

---[FILE: avatar_hash.py]---
Location: zulip-main/zerver/lib/avatar_hash.py
Signals: Django

```python
import hashlib

from django.conf import settings

from zerver.models import UserProfile


def gravatar_hash(email: str) -> str:
    """Compute the Gravatar hash for an email address."""
    # Non-ASCII characters aren't permitted by the currently active e-mail
    # RFCs. However, the IETF has published https://tools.ietf.org/html/rfc4952,
    # outlining internationalization of email addresses, and regardless if we
    # typo an address or someone manages to give us a non-ASCII address, let's
    # not error out on it.
    return hashlib.md5(email.lower().encode()).hexdigest()


def user_avatar_hash(uid: str, version: str) -> str:
    # WARNING: If this method is changed, you may need to do a migration
    # similar to zerver/migrations/0060_move_avatars_to_be_uid_based.py .

    # The salt prevents unauthenticated clients from enumerating the
    # avatars of all users.
    user_key = uid + ":" + version + ":" + settings.AVATAR_SALT
    return hashlib.sha256(user_key.encode()).hexdigest()[:40]


def user_avatar_path(user_profile: UserProfile, future: bool = False) -> str:
    # 'future' is if this is for the current avatar version, of the next one.
    return user_avatar_base_path_from_ids(
        user_profile.id, user_profile.avatar_version + (1 if future else 0), user_profile.realm_id
    )


def user_avatar_base_path_from_ids(user_profile_id: int, version: int, realm_id: int) -> str:
    user_id_hash = user_avatar_hash(str(user_profile_id), str(version))
    return f"{realm_id}/{user_id_hash}"


def user_avatar_content_hash(ldap_avatar: bytes) -> str:
    return hashlib.sha256(ldap_avatar).hexdigest()
```

--------------------------------------------------------------------------------

---[FILE: bot_config.py]---
Location: zulip-main/zerver/lib/bot_config.py
Signals: Django

```python
import configparser
import importlib
import os
from collections import defaultdict

from django.conf import settings
from django.db.models import F, Sum
from django.db.models.functions import Length

from zerver.models import BotConfigData, UserProfile


class ConfigError(Exception):
    pass


def get_bot_config(bot_profile: UserProfile) -> dict[str, str]:
    entries = BotConfigData.objects.filter(bot_profile=bot_profile)
    if not entries:
        raise ConfigError("No config data available.")
    return {entry.key: entry.value for entry in entries}


def get_bot_configs(bot_profile_ids: list[int]) -> dict[int, dict[str, str]]:
    if not bot_profile_ids:
        return {}
    entries = BotConfigData.objects.filter(bot_profile_id__in=bot_profile_ids)
    entries_by_uid: dict[int, dict[str, str]] = defaultdict(dict)
    for entry in entries:
        entries_by_uid[entry.bot_profile_id].update({entry.key: entry.value})
    return entries_by_uid


def get_bot_config_size(bot_profile: UserProfile, key: str | None = None) -> int:
    if key is None:
        return (
            BotConfigData.objects.filter(bot_profile=bot_profile)
            .annotate(key_size=Length("key"), value_size=Length("value"))
            .aggregate(sum=Sum(F("key_size") + F("value_size")))["sum"]
            or 0
        )
    else:
        try:
            return len(key) + len(BotConfigData.objects.get(bot_profile=bot_profile, key=key).value)
        except BotConfigData.DoesNotExist:
            return 0


def set_bot_config(bot_profile: UserProfile, key: str, value: str) -> None:
    config_size_limit = settings.BOT_CONFIG_SIZE_LIMIT
    old_entry_size = get_bot_config_size(bot_profile, key)
    new_entry_size = len(key) + len(value)
    old_config_size = get_bot_config_size(bot_profile)
    new_config_size = old_config_size + (new_entry_size - old_entry_size)
    if new_config_size > config_size_limit:
        raise ConfigError(
            f"Cannot store configuration. Request would require {new_config_size} characters. "
            f"The current configuration size limit is {config_size_limit} characters."
        )
    obj, created = BotConfigData.objects.get_or_create(
        bot_profile=bot_profile, key=key, defaults={"value": value}
    )
    if not created:
        obj.value = value
        obj.save()


def load_bot_config_template(bot: str) -> dict[str, str]:
    bot_module_name = f"zulip_bots.bots.{bot}"
    bot_module = importlib.import_module(bot_module_name)
    assert bot_module.__file__ is not None
    bot_module_path = os.path.dirname(bot_module.__file__)
    config_path = os.path.join(bot_module_path, f"{bot}.conf")
    if os.path.isfile(config_path):
        config = configparser.ConfigParser()
        with open(config_path) as conf:
            config.read_file(conf)
        return dict(config.items(bot))
    else:
        return {}
```

--------------------------------------------------------------------------------

---[FILE: bot_lib.py]---
Location: zulip-main/zerver/lib/bot_lib.py
Signals: Django

```python
import importlib
import json
from collections.abc import Callable
from typing import Any

from django.conf import settings
from django.utils.translation import gettext as _
from zulip_bots.lib import BotIdentity, RateLimit

from zerver.actions.message_flags import do_update_message_flags
from zerver.actions.message_send import (
    internal_send_group_direct_message,
    internal_send_private_message,
    internal_send_stream_message_by_name,
)
from zerver.lib.bot_config import ConfigError, get_bot_config
from zerver.lib.bot_storage import (
    get_bot_storage,
    is_key_in_bot_storage,
    remove_bot_storage,
    set_bot_storage,
)
from zerver.lib.integrations import EMBEDDED_BOTS
from zerver.lib.topic import get_topic_from_message_info
from zerver.models import UserProfile
from zerver.models.users import get_active_user


def get_bot_handler(service_name: str) -> Any:
    # Check that this service is present in EMBEDDED_BOTS, add exception handling.
    configured_service = ""
    for embedded_bot_service in EMBEDDED_BOTS:
        if service_name == embedded_bot_service.name:
            configured_service = embedded_bot_service.name
    if not configured_service:
        return None
    bot_module_name = f"zulip_bots.bots.{configured_service}.{configured_service}"
    bot_module: Any = importlib.import_module(bot_module_name)
    return bot_module.handler_class()


class StateHandler:
    storage_size_limit: int = settings.USER_STATE_SIZE_LIMIT

    def __init__(self, user_profile: UserProfile) -> None:
        self.user_profile = user_profile
        self.marshal: Callable[[object], str] = json.dumps
        self.demarshal: Callable[[str], object] = json.loads

    def get(self, key: str) -> object:
        return self.demarshal(get_bot_storage(self.user_profile, key))

    def put(self, key: str, value: object) -> None:
        set_bot_storage(self.user_profile, [(key, self.marshal(value))])

    def remove(self, key: str) -> None:
        remove_bot_storage(self.user_profile, [key])

    def contains(self, key: str) -> bool:
        return is_key_in_bot_storage(self.user_profile, key)


class EmbeddedBotQuitError(Exception):
    pass


class EmbeddedBotEmptyRecipientsListError(Exception):
    pass


class EmbeddedBotHandler:
    def __init__(self, user_profile: UserProfile) -> None:
        # Only expose a subset of our UserProfile's functionality
        self.user_profile = user_profile
        self._rate_limit = RateLimit(20, 5)
        self.full_name = user_profile.full_name
        self.email = user_profile.email
        self.storage = StateHandler(user_profile)
        self.user_id = user_profile.id

    def identity(self) -> BotIdentity:
        return BotIdentity(self.full_name, self.email)

    def react(self, message: dict[str, Any], emoji_name: str) -> dict[str, Any]:
        return {}  # Not implemented

    def send_message(self, message: dict[str, Any]) -> dict[str, Any]:
        if not self._rate_limit.is_legal():
            self._rate_limit.show_error_and_exit()

        if message["type"] == "stream":
            message_id = internal_send_stream_message_by_name(
                self.user_profile.realm,
                self.user_profile,
                message["to"],
                message["topic"],
                message["content"],
            )
            return {"id": message_id}

        assert message["type"] == "private"
        # Ensure that it's a comma-separated list, even though the
        # usual 'to' field could be either a List[str] or a str.
        recipients = ",".join(message["to"]).split(",")

        if len(message["to"]) == 0:
            raise EmbeddedBotEmptyRecipientsListError(_("Message must have recipients!"))
        elif len(message["to"]) == 1:
            recipient_user = get_active_user(recipients[0], self.user_profile.realm)
            message_id = internal_send_private_message(
                self.user_profile, recipient_user, message["content"]
            )
        else:
            message_id = internal_send_group_direct_message(
                self.user_profile.realm, self.user_profile, message["content"], emails=recipients
            )
        return {"id": message_id}

    def send_reply(
        self, message: dict[str, Any], response: str, widget_content: str | None = None
    ) -> dict[str, Any]:
        if message["type"] == "private":
            result = self.send_message(
                dict(
                    type="private",
                    to=[x["email"] for x in message["display_recipient"]],
                    content=response,
                    sender_email=message["sender_email"],
                )
            )
        else:
            result = self.send_message(
                dict(
                    type="stream",
                    to=message["display_recipient"],
                    topic=get_topic_from_message_info(message),
                    content=response,
                    sender_email=message["sender_email"],
                )
            )
        return {"id": result["id"]}

    def update_message(self, message: dict[str, Any]) -> None:
        pass  # Not implemented

    # The bot_name argument exists only to comply with ExternalBotHandler.get_config_info().
    def get_config_info(self, bot_name: str, optional: bool = False) -> dict[str, str]:
        try:
            return get_bot_config(self.user_profile)
        except ConfigError:
            if optional:
                return {}
            raise

    def quit(self, message: str = "") -> None:
        raise EmbeddedBotQuitError(message)


def do_flag_service_bots_messages_as_processed(
    bot_profile: UserProfile, message_ids: list[int]
) -> None:
    assert bot_profile.is_bot is True and bot_profile.bot_type in UserProfile.SERVICE_BOT_TYPES
    do_update_message_flags(bot_profile, "add", "read", message_ids)
```

--------------------------------------------------------------------------------

---[FILE: bot_storage.py]---
Location: zulip-main/zerver/lib/bot_storage.py
Signals: Django

```python
from django.conf import settings
from django.db.models import F, Sum
from django.db.models.functions import Length

from zerver.models import BotStorageData, UserProfile


class StateError(Exception):
    pass


def get_bot_storage(bot_profile: UserProfile, key: str) -> str:
    try:
        return BotStorageData.objects.get(bot_profile=bot_profile, key=key).value
    except BotStorageData.DoesNotExist:
        raise StateError("Key does not exist.")


def get_bot_storage_size(bot_profile: UserProfile, key: str | None = None) -> int:
    if key is None:
        return (
            BotStorageData.objects.filter(bot_profile=bot_profile)
            .annotate(key_size=Length("key"), value_size=Length("value"))
            .aggregate(sum=Sum(F("key_size") + F("value_size")))["sum"]
            or 0
        )
    else:
        try:
            return len(key) + len(
                BotStorageData.objects.get(bot_profile=bot_profile, key=key).value
            )
        except BotStorageData.DoesNotExist:
            return 0


def set_bot_storage(bot_profile: UserProfile, entries: list[tuple[str, str]]) -> None:
    storage_size_limit = settings.USER_STATE_SIZE_LIMIT
    storage_size_difference = 0
    for key, value in entries:
        assert isinstance(key, str), "Key type should be str."
        assert isinstance(value, str), "Value type should be str."
        storage_size_difference += (len(key) + len(value)) - get_bot_storage_size(bot_profile, key)
    new_storage_size = get_bot_storage_size(bot_profile) + storage_size_difference
    if new_storage_size > storage_size_limit:
        raise StateError(
            f"Request exceeds storage limit by {new_storage_size - storage_size_limit} characters. The limit is {storage_size_limit} characters."
        )
    else:
        for key, value in entries:
            BotStorageData.objects.update_or_create(
                bot_profile=bot_profile, key=key, defaults={"value": value}
            )


def remove_bot_storage(bot_profile: UserProfile, keys: list[str]) -> None:
    queryset = BotStorageData.objects.filter(bot_profile=bot_profile, key__in=keys)
    if len(queryset) < len(keys):
        raise StateError("Key does not exist.")
    queryset.delete()


def is_key_in_bot_storage(bot_profile: UserProfile, key: str) -> bool:
    return BotStorageData.objects.filter(bot_profile=bot_profile, key=key).exists()


def get_keys_in_bot_storage(bot_profile: UserProfile) -> list[str]:
    return list(
        BotStorageData.objects.filter(bot_profile=bot_profile).values_list("key", flat=True)
    )
```

--------------------------------------------------------------------------------

---[FILE: bulk_create.py]---
Location: zulip-main/zerver/lib/bulk_create.py
Signals: Django

```python
from collections.abc import Collection, Iterable
from typing import Any

from django.db.models import Model, QuerySet
from django.utils.timezone import now as timezone_now

from zerver.lib.create_user import create_user_profile, get_display_email_address
from zerver.lib.initial_password import initial_password
from zerver.lib.streams import (
    get_default_values_for_stream_permission_group_settings,
    render_stream_description,
)
from zerver.models import (
    NamedUserGroup,
    Realm,
    RealmAuditLog,
    RealmUserDefault,
    Recipient,
    Stream,
    Subscription,
    UserGroupMembership,
    UserProfile,
)
from zerver.models.groups import SystemGroups
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.streams import StreamTopicsPolicyEnum


def bulk_create_users(
    realm: Realm,
    users_raw: set[tuple[str, str, bool]],
    bot_type: int | None = None,
    bot_owner: UserProfile | None = None,
    tos_version: str | None = None,
    timezone: str = "",
) -> None:
    """
    Creates and saves a UserProfile with the given email.
    Has some code based off of UserManage.create_user, but doesn't .save()
    """
    existing_users = frozenset(
        UserProfile.objects.filter(realm=realm).values_list("email", flat=True)
    )
    users = sorted(user_raw for user_raw in users_raw if user_raw[0] not in existing_users)

    realm_user_default = RealmUserDefault.objects.get(realm=realm)
    if bot_type is None:
        email_address_visibility = realm_user_default.email_address_visibility
    else:
        # There is no privacy motivation for limiting access to bot email addresses,
        # so we hardcode them to EMAIL_ADDRESS_VISIBILITY_EVERYONE.
        email_address_visibility = UserProfile.EMAIL_ADDRESS_VISIBILITY_EVERYONE

    # Now create user_profiles
    profiles_to_create: list[UserProfile] = []
    for email, full_name, active in users:
        profile = create_user_profile(
            realm,
            email,
            initial_password(email),
            active,
            bot_type,
            full_name,
            bot_owner,
            False,
            tos_version,
            timezone,
            default_language=realm.default_language,
            email_address_visibility=email_address_visibility,
        )

        if bot_type is None:
            # This block simulates copy_default_settings from
            # zerver/lib/create_user.py.
            #
            # We cannot use 'copy_default_settings' directly here
            # because it calls '.save' after copying the settings, and
            # we are bulk creating the objects here instead.
            for settings_name in RealmUserDefault.property_types:
                if settings_name in ["default_language", "enable_login_emails"]:
                    continue
                value = getattr(realm_user_default, settings_name)
                setattr(profile, settings_name, value)
        profiles_to_create.append(profile)

    if email_address_visibility == UserProfile.EMAIL_ADDRESS_VISIBILITY_EVERYONE:
        UserProfile.objects.bulk_create(profiles_to_create)
    else:
        for user_profile in profiles_to_create:
            user_profile.email = user_profile.delivery_email

        UserProfile.objects.bulk_create(profiles_to_create)

        for user_profile in profiles_to_create:
            user_profile.email = get_display_email_address(user_profile)
        UserProfile.objects.bulk_update(profiles_to_create, ["email"])

    user_ids = {user.id for user in profiles_to_create}

    RealmAuditLog.objects.bulk_create(
        RealmAuditLog(
            realm=realm,
            modified_user=profile_,
            event_type=AuditLogEventType.USER_CREATED,
            event_time=profile_.date_joined,
        )
        for profile_ in profiles_to_create
    )

    recipients_to_create = [
        Recipient(type_id=user_id, type=Recipient.PERSONAL) for user_id in user_ids
    ]

    Recipient.objects.bulk_create(recipients_to_create)

    bulk_set_users_or_streams_recipient_fields(
        UserProfile, profiles_to_create, recipients_to_create
    )

    recipients_by_user_id: dict[int, Recipient] = {}
    for recipient in recipients_to_create:
        recipients_by_user_id[recipient.type_id] = recipient

    subscriptions_to_create = [
        Subscription(
            user_profile_id=user_profile.id,
            recipient=recipients_by_user_id[user_profile.id],
            is_user_active=user_profile.is_active,
        )
        for user_profile in profiles_to_create
    ]

    Subscription.objects.bulk_create(subscriptions_to_create)

    full_members_system_group = NamedUserGroup.objects.get(
        name=SystemGroups.FULL_MEMBERS, realm_for_sharding=realm, is_system_group=True
    )
    members_system_group = NamedUserGroup.objects.get(
        name=SystemGroups.MEMBERS, realm_for_sharding=realm, is_system_group=True
    )
    group_memberships_to_create: list[UserGroupMembership] = []
    for user_profile in profiles_to_create:
        # All users are members since this function is only used to create bots
        # and test and development environment users.
        assert user_profile.role == UserProfile.ROLE_MEMBER
        group_memberships_to_create.append(
            UserGroupMembership(user_profile=user_profile, user_group=members_system_group)
        )
        if not user_profile.is_provisional_member:
            group_memberships_to_create.append(
                UserGroupMembership(user_profile=user_profile, user_group=full_members_system_group)
            )

    UserGroupMembership.objects.bulk_create(group_memberships_to_create)
    now = timezone_now()
    RealmAuditLog.objects.bulk_create(
        RealmAuditLog(
            realm=realm,
            modified_user=membership.user_profile,
            modified_user_group=membership.user_group.named_user_group,
            event_type=AuditLogEventType.USER_GROUP_DIRECT_USER_MEMBERSHIP_ADDED,
            event_time=now,
            acting_user=None,
        )
        for membership in group_memberships_to_create
    )


def bulk_set_users_or_streams_recipient_fields(
    model: type[Model],
    objects: Collection[UserProfile]
    | QuerySet[UserProfile]
    | Collection[Stream]
    | QuerySet[Stream],
    recipients: Iterable[Recipient] | None = None,
) -> None:
    assert model in [UserProfile, Stream]
    for obj in objects:
        assert isinstance(obj, model)

    if model == UserProfile:
        recipient_type = Recipient.PERSONAL
    elif model == Stream:
        recipient_type = Recipient.STREAM

    if recipients is None:
        object_ids = [obj.id for obj in objects]
        recipients = Recipient.objects.filter(type=recipient_type, type_id__in=object_ids)

    objects_dict = {obj.id: obj for obj in objects}

    objects_to_update = set()
    for recipient in recipients:
        assert recipient.type == recipient_type
        result = objects_dict.get(recipient.type_id)
        if result is not None:
            result.recipient = recipient
            objects_to_update.add(result)
    model._default_manager.bulk_update(objects_to_update, ["recipient"])


# This is only sed in populate_db, so doesn't really need tests
def bulk_create_streams(realm: Realm, stream_dict: dict[str, dict[str, Any]]) -> None:  # nocoverage
    existing_streams = {
        name.lower() for name in Stream.objects.filter(realm=realm).values_list("name", flat=True)
    }
    streams_to_create: list[Stream] = []
    for name, options in stream_dict.items():
        creator = options.get("creator", None)
        if name.lower() not in existing_streams:
            stream = Stream(
                realm=realm,
                name=name,
                description=options["description"],
                rendered_description=render_stream_description(options["description"], realm),
                invite_only=options.get("invite_only", False),
                history_public_to_subscribers=options.get("history_public_to_subscribers", True),
                is_web_public=options.get("is_web_public", False),
                creator=options.get("creator", None),
                folder_id=options.get("folder_id", None),
                topics_policy=options.get("topics_policy", StreamTopicsPolicyEnum.inherit.value),
                **get_default_values_for_stream_permission_group_settings(realm, creator),
            )
            if "can_send_message_group" in options:
                stream.can_send_message_group = options["can_send_message_group"]

            streams_to_create.append(stream)
    # Sort streams by name before creating them so that we can have a
    # reliable ordering of `stream_id` across different python versions.
    # This is required for test fixtures which contain `stream_id`. Prior
    # to python 3.3 hashes were not randomized but after a security fix
    # hash randomization was enabled in python 3.3 which made iteration
    # of dictionaries and sets completely unpredictable. Here the order
    # of elements while iterating `stream_dict` will be completely random
    # for python 3.3 and later versions.
    streams_to_create.sort(key=lambda x: x.name)
    Stream.objects.bulk_create(streams_to_create)

    recipients_to_create = [
        Recipient(type_id=stream["id"], type=Recipient.STREAM)
        for stream in Stream.objects.filter(realm=realm).values("id", "name")
        if stream["name"].lower() not in existing_streams
    ]
    Recipient.objects.bulk_create(recipients_to_create)

    bulk_set_users_or_streams_recipient_fields(Stream, streams_to_create, recipients_to_create)


def create_users(
    realm: Realm, name_list: Iterable[tuple[str, str]], bot_type: int | None = None
) -> None:
    user_set = {(email, full_name, True) for full_name, email in name_list}
    bulk_create_users(realm, user_set, bot_type)
```

--------------------------------------------------------------------------------

````
