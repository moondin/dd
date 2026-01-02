---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 856
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 856 of 1290)

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

---[FILE: submessage.py]---
Location: zulip-main/zerver/actions/submessage.py
Signals: Django

```python
from django.utils.translation import gettext as _

from zerver.actions.user_topics import do_set_user_topic_visibility_policy
from zerver.lib.exceptions import JsonableError
from zerver.lib.message import (
    event_recipient_ids_for_action_on_messages,
    set_visibility_policy_possible,
    should_change_visibility_policy,
    visibility_policy_for_participation,
)
from zerver.lib.streams import access_stream_by_id
from zerver.models import Realm, SubMessage, UserProfile
from zerver.tornado.django_api import send_event_on_commit


def verify_submessage_sender(
    *,
    message_id: int,
    message_sender_id: int,
    submessage_sender_id: int,
) -> None:
    """Even though our submessage architecture is geared toward
    collaboration among all message readers, we still enforce
    the first person to attach a submessage to the message
    must be the original sender of the message.
    """

    if message_sender_id == submessage_sender_id:
        return

    if SubMessage.objects.filter(
        message_id=message_id,
        sender_id=message_sender_id,
    ).exists():
        return

    raise JsonableError(_("You cannot attach a submessage to this message."))


def do_add_submessage(
    realm: Realm,
    sender_id: int,
    message_id: int,
    msg_type: str,
    content: str,
) -> None:
    """Should be called while holding a SELECT FOR UPDATE lock
    (e.g. via access_message(..., lock_message=True)) on the
    Message row, to prevent race conditions.
    """
    submessage = SubMessage(
        sender_id=sender_id,
        message_id=message_id,
        msg_type=msg_type,
        content=content,
    )
    submessage.save()

    # Determine and set the visibility_policy depending on 'automatically_follow_topics_policy'
    # and 'automatically_unmute_topics_policy'.
    sender = submessage.sender
    if set_visibility_policy_possible(
        sender, submessage.message
    ) and UserProfile.AUTOMATICALLY_CHANGE_VISIBILITY_POLICY_ON_PARTICIPATION in [
        sender.automatically_follow_topics_policy,
        sender.automatically_unmute_topics_in_muted_streams_policy,
    ]:
        stream_id = submessage.message.recipient.type_id
        (stream, sub) = access_stream_by_id(sender, stream_id)
        assert stream is not None
        if sub:
            new_visibility_policy = visibility_policy_for_participation(sender, sub.is_muted)
            if new_visibility_policy and should_change_visibility_policy(
                new_visibility_policy,
                sender,
                stream_id,
                topic_name=submessage.message.topic_name(),
            ):
                do_set_user_topic_visibility_policy(
                    user_profile=sender,
                    stream=stream,
                    topic_name=submessage.message.topic_name(),
                    visibility_policy=new_visibility_policy,
                )

    event = dict(
        type="submessage",
        msg_type=msg_type,
        message_id=message_id,
        submessage_id=submessage.id,
        sender_id=sender_id,
        content=content,
    )
    target_user_ids = event_recipient_ids_for_action_on_messages([submessage.message])

    send_event_on_commit(realm, event, target_user_ids)
```

--------------------------------------------------------------------------------

---[FILE: typing.py]---
Location: zulip-main/zerver/actions/typing.py
Signals: Django

```python
from typing import Literal

from django.conf import settings
from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError
from zerver.lib.stream_subscription import get_active_subscriptions_for_stream_id
from zerver.models import Realm, Stream, UserProfile
from zerver.models.users import get_user_by_id_in_realm_including_cross_realm
from zerver.tornado.django_api import send_event_rollback_unsafe


def do_send_typing_notification(
    realm: Realm, sender: UserProfile, recipient_user_profiles: list[UserProfile], operator: str
) -> None:
    sender_dict = {"user_id": sender.id, "email": sender.email}

    # Include a list of recipients in the event body to help identify where the typing is happening
    recipient_dicts = [
        {"user_id": profile.id, "email": profile.email} for profile in recipient_user_profiles
    ]
    event = dict(
        type="typing",
        message_type="direct",
        op=operator,
        sender=sender_dict,
        recipients=recipient_dicts,
    )

    # Only deliver the notification to active user recipients
    user_ids_to_notify = [
        user.id
        for user in recipient_user_profiles
        if user.is_active and user.receives_typing_notifications
    ]

    send_event_rollback_unsafe(realm, event, user_ids_to_notify)


# check_send_typing_notification:
# Checks the typing notification and sends it
def check_send_typing_notification(sender: UserProfile, user_ids: list[int], operator: str) -> None:
    realm = sender.realm

    if sender.id not in user_ids:
        user_ids.append(sender.id)

    # If any of the user_ids being sent in are invalid, we will
    # just reject the whole request, since a partial list of user_ids
    # can create confusion related to direct message groups. Plus it's
    # a good sign that a client is confused (or possibly even malicious)
    # if we get bad user_ids.
    user_profiles = []
    for user_id in user_ids:
        try:
            # We include cross-bot realms as possible recipients,
            # so that clients can know which direct message group
            # conversation is relevant here.
            user_profile = get_user_by_id_in_realm_including_cross_realm(user_id, sender.realm)
        except UserProfile.DoesNotExist:
            raise JsonableError(_("Invalid user ID {user_id}").format(user_id=user_id))
        user_profiles.append(user_profile)

    do_send_typing_notification(
        realm=realm,
        sender=sender,
        recipient_user_profiles=user_profiles,
        operator=operator,
    )


def do_send_stream_typing_notification(
    sender: UserProfile, operator: str, stream: Stream, topic_name: str
) -> None:
    sender_dict = {"user_id": sender.id, "email": sender.email}

    event = dict(
        type="typing",
        message_type="stream",
        op=operator,
        sender=sender_dict,
        stream_id=stream.id,
        topic=topic_name,
    )

    subscriptions_query = get_active_subscriptions_for_stream_id(
        stream.id, include_deactivated_users=False
    )

    total_subscriptions = subscriptions_query.count()
    if total_subscriptions > settings.MAX_STREAM_SIZE_FOR_TYPING_NOTIFICATIONS:
        # TODO: Stream typing notifications are disabled in streams
        # with too many subscribers for performance reasons.
        return

    user_ids_to_notify = set(
        subscriptions_query.exclude(user_profile__long_term_idle=True)
        .exclude(user_profile__receives_typing_notifications=False)
        .values_list("user_profile_id", flat=True)
    )

    send_event_rollback_unsafe(sender.realm, event, user_ids_to_notify)


def do_send_stream_message_edit_typing_notification(
    sender: UserProfile,
    channel_id: int,
    message_id: int,
    operator: Literal["start", "stop"],
    topic_name: str,
) -> None:
    event = dict(
        type="typing_edit_message",
        op=operator,
        sender_id=sender.id,
        message_id=message_id,
        recipient=dict(
            type="channel",
            channel_id=channel_id,
            topic=topic_name,
        ),
    )

    subscriptions_query = get_active_subscriptions_for_stream_id(
        channel_id, include_deactivated_users=False
    )

    total_subscriptions = subscriptions_query.count()
    if total_subscriptions > settings.MAX_STREAM_SIZE_FOR_TYPING_NOTIFICATIONS:
        # TODO: Stream typing notifications are disabled in streams
        # with too many subscribers for performance reasons.
        return

    # We don't notify long_term_idle subscribers.
    user_ids_to_notify = set(
        subscriptions_query.exclude(user_profile__long_term_idle=True)
        .exclude(user_profile__receives_typing_notifications=False)
        .values_list("user_profile_id", flat=True)
    )

    send_event_rollback_unsafe(sender.realm, event, user_ids_to_notify)


def do_send_direct_message_edit_typing_notification(
    sender: UserProfile,
    user_ids: list[int],
    message_id: int,
    operator: Literal["start", "stop"],
) -> None:
    recipient_user_profiles = []
    for user_id in user_ids:
        user_profile = get_user_by_id_in_realm_including_cross_realm(user_id, sender.realm)
        recipient_user_profiles.append(user_profile)

    # Only deliver the notification to active user recipients
    user_ids_to_notify = [
        user.id
        for user in recipient_user_profiles
        if user.is_active and user.receives_typing_notifications
    ]

    event = dict(
        type="typing_edit_message",
        op=operator,
        sender_id=sender.id,
        message_id=message_id,
        recipient=dict(
            type="direct",
            user_ids=user_ids_to_notify,
        ),
    )

    send_event_rollback_unsafe(sender.realm, event, user_ids_to_notify)
```

--------------------------------------------------------------------------------

---[FILE: uploads.py]---
Location: zulip-main/zerver/actions/uploads.py

```python
import logging
from dataclasses import dataclass
from typing import Any

from zerver.lib.attachments import get_old_unclaimed_attachments, validate_attachment_request
from zerver.lib.markdown import MessageRenderingResult
from zerver.lib.thumbnail import StoredThumbnailFormat, get_image_thumbnail_path
from zerver.lib.upload import claim_attachment, delete_message_attachments
from zerver.models import (
    Attachment,
    ImageAttachment,
    Message,
    ScheduledMessage,
    Stream,
    UserProfile,
)
from zerver.tornado.django_api import send_event_on_commit


@dataclass
class AttachmentChangeResult:
    did_attachment_change: bool
    detached_attachments: list[dict[str, Any]]


def notify_attachment_update(
    user_profile: UserProfile, op: str, attachment_dict: dict[str, Any]
) -> None:
    event = {
        "type": "attachment",
        "op": op,
        "attachment": attachment_dict,
        "upload_space_used": user_profile.realm.currently_used_upload_space_bytes(),
    }
    send_event_on_commit(user_profile.realm, event, [user_profile.id])


def do_claim_attachments(
    message: Message | ScheduledMessage, potential_path_ids: list[str]
) -> bool:
    claimed = False
    for path_id in potential_path_ids:
        user_profile = message.sender
        is_message_realm_public = False
        is_message_web_public = False
        if isinstance(message, Message):
            is_channel_message = message.is_channel_message
        else:
            assert isinstance(message, ScheduledMessage)
            is_channel_message = message.is_channel_message()

        if is_channel_message:
            stream = Stream.objects.get(id=message.recipient.type_id)
            is_message_realm_public = stream.is_public()
            is_message_web_public = stream.is_web_public

        if not validate_attachment_request(user_profile, path_id)[0]:
            # Technically, there are 2 cases here:
            # * The user put something in their message that has the form
            # of an upload URL, but does not actually correspond to a previously
            # uploaded file.  validate_attachment_request will return None.
            # * The user is trying to send a link to a file they don't have permission to
            # access themselves.  validate_attachment_request will return False.
            #
            # Either case is unusual and suggests a UI bug that got
            # the user in this situation, so we log in these cases.
            logging.warning(
                "User %s tried to share upload %s in message %s, but lacks permission",
                user_profile.id,
                path_id,
                message.id,
            )
            continue

        claimed = True
        attachment = claim_attachment(
            path_id, message, is_message_realm_public, is_message_web_public
        )
        if not isinstance(message, ScheduledMessage):
            # attachment update events don't say anything about scheduled messages,
            # so sending an event is pointless.
            notify_attachment_update(user_profile, "update", attachment.to_dict())
    return claimed


DELETE_BATCH_SIZE = 1000


def do_delete_old_unclaimed_attachments(weeks_ago: int) -> None:
    old_unclaimed_attachments, old_unclaimed_archived_attachments = get_old_unclaimed_attachments(
        weeks_ago
    )

    # An attachment may be removed from Attachments and
    # ArchiveAttachments in the same run; prevent warnings from the
    # backing store by only removing it from there once.
    already_removed = set()
    storage_paths = []
    for attachment in old_unclaimed_attachments:
        storage_paths.append(attachment.path_id)
        image_row = ImageAttachment.objects.filter(path_id=attachment.path_id).first()
        if image_row:
            for existing_thumbnail in image_row.thumbnail_metadata:
                thumb = StoredThumbnailFormat(**existing_thumbnail)
                storage_paths.append(get_image_thumbnail_path(image_row, thumb))
            image_row.delete()
        already_removed.add(attachment.path_id)
        attachment.delete()
        if len(storage_paths) >= DELETE_BATCH_SIZE:
            delete_message_attachments(storage_paths[:DELETE_BATCH_SIZE])
            storage_paths = storage_paths[DELETE_BATCH_SIZE:]
    for archived_attachment in old_unclaimed_archived_attachments:
        if archived_attachment.path_id not in already_removed:
            storage_paths.append(archived_attachment.path_id)
            image_row = ImageAttachment.objects.filter(path_id=archived_attachment.path_id).first()
            if image_row:  # nocoverage
                for existing_thumbnail in image_row.thumbnail_metadata:
                    thumb = StoredThumbnailFormat(**existing_thumbnail)
                    storage_paths.append(get_image_thumbnail_path(image_row, thumb))
                image_row.delete()
        archived_attachment.delete()
        if len(storage_paths) >= DELETE_BATCH_SIZE:
            delete_message_attachments(storage_paths[:DELETE_BATCH_SIZE])
            storage_paths = storage_paths[DELETE_BATCH_SIZE:]

    if storage_paths:
        delete_message_attachments(storage_paths)


def check_attachment_reference_change(
    message: Message | ScheduledMessage, rendering_result: MessageRenderingResult
) -> AttachmentChangeResult:
    # For a unsaved message edit (message.* has been updated, but not
    # saved to the database), adjusts Attachment data to correspond to
    # the new content.
    prev_attachments = {a.path_id for a in message.attachment_set.all()}
    new_attachments = set(rendering_result.potential_attachment_path_ids)

    if new_attachments == prev_attachments:
        return AttachmentChangeResult(bool(prev_attachments), [])

    to_remove = list(prev_attachments - new_attachments)
    if len(to_remove) > 0:
        attachments_to_update = Attachment.objects.filter(path_id__in=to_remove).select_for_update()
        message.attachment_set.remove(*attachments_to_update)

    sender = message.sender
    detached_attachments_query = Attachment.objects.filter(
        path_id__in=to_remove, messages__isnull=True, owner=sender
    )
    detached_attachments = [attachment.to_dict() for attachment in detached_attachments_query]

    to_add = list(new_attachments - prev_attachments)
    if len(to_add) > 0:
        do_claim_attachments(message, to_add)

    return AttachmentChangeResult(message.attachment_set.exists(), detached_attachments)
```

--------------------------------------------------------------------------------

````
