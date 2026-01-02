---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 844
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 844 of 1290)

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

---[FILE: bots.py]---
Location: zulip-main/zerver/actions/bots.py
Signals: Django

```python
from django.db import transaction
from django.utils.timezone import now as timezone_now

from zerver.actions.create_user import created_bot_event
from zerver.models import RealmAuditLog, Stream, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.users import active_user_ids, bot_owner_user_ids
from zerver.tornado.django_api import send_event_on_commit


def send_bot_owner_update_events(
    user_profile: UserProfile, bot_owner: UserProfile, previous_owner: UserProfile | None
) -> None:
    update_users = bot_owner_user_ids(user_profile)

    # For admins, update event is sent instead of delete/add
    # event. bot_data of admin contains all the
    # bots and none of them should be removed/(added again).

    # Delete the bot from previous owner's bot data.
    if previous_owner and not previous_owner.is_realm_admin:
        delete_event = dict(
            type="realm_bot",
            op="delete",
            bot=dict(
                user_id=user_profile.id,
            ),
        )
        previous_owner_id = previous_owner.id
        send_event_on_commit(
            user_profile.realm,
            delete_event,
            {previous_owner_id},
        )
        # Do not send update event for previous bot owner.
        update_users.discard(previous_owner.id)

    # Notify the new owner that the bot has been added.
    if not bot_owner.is_realm_admin:
        add_event = created_bot_event(user_profile)
        send_event_on_commit(user_profile.realm, add_event, {bot_owner.id})
        # Do not send update event for bot_owner.
        update_users.discard(bot_owner.id)

    bot_event = dict(
        type="realm_bot",
        op="update",
        bot=dict(
            user_id=user_profile.id,
            owner_id=bot_owner.id,
        ),
    )
    send_event_on_commit(
        user_profile.realm,
        bot_event,
        update_users,
    )

    # Since `bot_owner_id` is included in the user profile dict we need
    # to update the users dict with the new bot owner id
    event = dict(
        type="realm_user",
        op="update",
        person=dict(
            user_id=user_profile.id,
            bot_owner_id=bot_owner.id,
        ),
    )
    send_event_on_commit(user_profile.realm, event, active_user_ids(user_profile.realm_id))


@transaction.atomic(durable=True)
def do_change_bot_owner(
    user_profile: UserProfile, bot_owner: UserProfile, acting_user: UserProfile | None
) -> None:
    previous_owner = user_profile.bot_owner
    user_profile.bot_owner = bot_owner
    user_profile.save()  # Can't use update_fields because of how the foreign key works.
    event_time = timezone_now()
    RealmAuditLog.objects.create(
        realm=user_profile.realm,
        acting_user=acting_user,
        modified_user=user_profile,
        event_type=AuditLogEventType.USER_BOT_OWNER_CHANGED,
        event_time=event_time,
        extra_data={
            RealmAuditLog.OLD_VALUE: None if previous_owner is None else previous_owner.id,
            RealmAuditLog.NEW_VALUE: bot_owner.id,
        },
    )

    send_bot_owner_update_events(user_profile, bot_owner, previous_owner)


@transaction.atomic(durable=True)
def do_change_default_sending_stream(
    user_profile: UserProfile, stream: Stream | None, *, acting_user: UserProfile | None
) -> None:
    old_value = user_profile.default_sending_stream_id
    user_profile.default_sending_stream = stream
    user_profile.save(update_fields=["default_sending_stream"])

    event_time = timezone_now()
    RealmAuditLog.objects.create(
        realm=user_profile.realm,
        event_type=AuditLogEventType.USER_DEFAULT_SENDING_STREAM_CHANGED,
        event_time=event_time,
        modified_user=user_profile,
        acting_user=acting_user,
        extra_data={
            RealmAuditLog.OLD_VALUE: old_value,
            RealmAuditLog.NEW_VALUE: None if stream is None else stream.id,
        },
    )

    if user_profile.is_bot:
        if stream:
            stream_name: str | None = stream.name
        else:
            stream_name = None
        event = dict(
            type="realm_bot",
            op="update",
            bot=dict(
                user_id=user_profile.id,
                default_sending_stream=stream_name,
            ),
        )
        send_event_on_commit(
            user_profile.realm,
            event,
            bot_owner_user_ids(user_profile),
        )


@transaction.atomic(durable=True)
def do_change_default_events_register_stream(
    user_profile: UserProfile, stream: Stream | None, *, acting_user: UserProfile | None
) -> None:
    old_value = user_profile.default_events_register_stream_id
    user_profile.default_events_register_stream = stream
    user_profile.save(update_fields=["default_events_register_stream"])

    event_time = timezone_now()
    RealmAuditLog.objects.create(
        realm=user_profile.realm,
        event_type=AuditLogEventType.USER_DEFAULT_REGISTER_STREAM_CHANGED,
        event_time=event_time,
        modified_user=user_profile,
        acting_user=acting_user,
        extra_data={
            RealmAuditLog.OLD_VALUE: old_value,
            RealmAuditLog.NEW_VALUE: None if stream is None else stream.id,
        },
    )

    if user_profile.is_bot:
        if stream:
            stream_name: str | None = stream.name
        else:
            stream_name = None

        event = dict(
            type="realm_bot",
            op="update",
            bot=dict(
                user_id=user_profile.id,
                default_events_register_stream=stream_name,
            ),
        )
        send_event_on_commit(
            user_profile.realm,
            event,
            bot_owner_user_ids(user_profile),
        )


@transaction.atomic(durable=True)
def do_change_default_all_public_streams(
    user_profile: UserProfile, value: bool, *, acting_user: UserProfile | None
) -> None:
    old_value = user_profile.default_all_public_streams
    user_profile.default_all_public_streams = value
    user_profile.save(update_fields=["default_all_public_streams"])

    event_time = timezone_now()
    RealmAuditLog.objects.create(
        realm=user_profile.realm,
        event_type=AuditLogEventType.USER_DEFAULT_ALL_PUBLIC_STREAMS_CHANGED,
        event_time=event_time,
        modified_user=user_profile,
        acting_user=acting_user,
        extra_data={
            RealmAuditLog.OLD_VALUE: old_value,
            RealmAuditLog.NEW_VALUE: value,
        },
    )

    if user_profile.is_bot:
        event = dict(
            type="realm_bot",
            op="update",
            bot=dict(
                user_id=user_profile.id,
                default_all_public_streams=user_profile.default_all_public_streams,
            ),
        )
        send_event_on_commit(
            user_profile.realm,
            event,
            bot_owner_user_ids(user_profile),
        )
```

--------------------------------------------------------------------------------

---[FILE: channel_folders.py]---
Location: zulip-main/zerver/actions/channel_folders.py
Signals: Django

```python
from django.db import transaction
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _

from zerver.lib.channel_folders import get_channel_folder_dict, render_channel_folder_description
from zerver.lib.exceptions import JsonableError
from zerver.models import ChannelFolder, Realm, RealmAuditLog, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.users import active_user_ids
from zerver.tornado.django_api import send_event_on_commit


@transaction.atomic(durable=True)
def check_add_channel_folder(
    realm: Realm, name: str, description: str, *, acting_user: UserProfile
) -> ChannelFolder:
    rendered_description = render_channel_folder_description(
        description, realm, acting_user=acting_user
    )
    channel_folder = ChannelFolder.objects.create(
        realm=realm,
        name=name,
        description=description,
        rendered_description=rendered_description,
        creator_id=acting_user.id,
    )
    channel_folder.order = channel_folder.id
    channel_folder.save(update_fields=["order"])

    creation_time = timezone_now()
    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.CHANNEL_FOLDER_CREATED,
        event_time=creation_time,
        modified_channel_folder=channel_folder,
    )

    event = dict(
        type="channel_folder",
        op="add",
        channel_folder=get_channel_folder_dict(channel_folder),
    )
    send_event_on_commit(realm, event, active_user_ids(realm.id))

    return channel_folder


@transaction.atomic(durable=True)
def try_reorder_realm_channel_folders(realm: Realm, order: list[int]) -> None:
    order_mapping = {_[1]: _[0] for _ in enumerate(order)}
    channel_folders = ChannelFolder.objects.filter(realm=realm)
    for channel_folder in channel_folders:
        if channel_folder.id not in order_mapping:
            raise JsonableError(_("Invalid order mapping."))
    for channel_folder in channel_folders:
        channel_folder.order = order_mapping[channel_folder.id]
        channel_folder.save(update_fields=["order"])

    event = dict(
        type="channel_folder",
        op="reorder",
        order=order,
    )
    send_event_on_commit(realm, event, active_user_ids(realm.id))


def do_send_channel_folder_update_event(
    channel_folder: ChannelFolder, data: dict[str, str | bool]
) -> None:
    realm = channel_folder.realm
    event = dict(type="channel_folder", op="update", channel_folder_id=channel_folder.id, data=data)
    send_event_on_commit(realm, event, active_user_ids(realm.id))


@transaction.atomic(durable=True)
def do_change_channel_folder_name(
    channel_folder: ChannelFolder, name: str, *, acting_user: UserProfile
) -> None:
    old_value = channel_folder.name
    channel_folder.name = name
    channel_folder.save(update_fields=["name"])

    RealmAuditLog.objects.create(
        realm=acting_user.realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.CHANNEL_FOLDER_NAME_CHANGED,
        event_time=timezone_now(),
        modified_channel_folder=channel_folder,
        extra_data={
            RealmAuditLog.OLD_VALUE: old_value,
            RealmAuditLog.NEW_VALUE: name,
        },
    )

    do_send_channel_folder_update_event(channel_folder, dict(name=name))


@transaction.atomic(durable=True)
def do_change_channel_folder_description(
    channel_folder: ChannelFolder, description: str, *, acting_user: UserProfile
) -> None:
    old_value = channel_folder.description
    rendered_description = render_channel_folder_description(
        description, acting_user.realm, acting_user=acting_user
    )
    channel_folder.description = description
    channel_folder.rendered_description = rendered_description
    channel_folder.save(update_fields=["description", "rendered_description"])

    RealmAuditLog.objects.create(
        realm=acting_user.realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.CHANNEL_FOLDER_DESCRIPTION_CHANGED,
        event_time=timezone_now(),
        modified_channel_folder=channel_folder,
        extra_data={
            RealmAuditLog.OLD_VALUE: old_value,
            RealmAuditLog.NEW_VALUE: description,
        },
    )

    do_send_channel_folder_update_event(
        channel_folder, dict(description=description, rendered_description=rendered_description)
    )


@transaction.atomic(durable=True)
def do_archive_channel_folder(channel_folder: ChannelFolder, *, acting_user: UserProfile) -> None:
    channel_folder.is_archived = True
    channel_folder.save(update_fields=["is_archived"])

    RealmAuditLog.objects.create(
        realm=acting_user.realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.CHANNEL_FOLDER_ARCHIVED,
        event_time=timezone_now(),
        modified_channel_folder=channel_folder,
    )

    do_send_channel_folder_update_event(channel_folder, dict(is_archived=True))


@transaction.atomic(durable=True)
def do_unarchive_channel_folder(channel_folder: ChannelFolder, *, acting_user: UserProfile) -> None:
    channel_folder.is_archived = False
    channel_folder.save(update_fields=["is_archived"])

    RealmAuditLog.objects.create(
        realm=acting_user.realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.CHANNEL_FOLDER_UNARCHIVED,
        event_time=timezone_now(),
        modified_channel_folder=channel_folder,
    )

    do_send_channel_folder_update_event(channel_folder, dict(is_archived=False))
```

--------------------------------------------------------------------------------

---[FILE: create_realm.py]---
Location: zulip-main/zerver/actions/create_realm.py
Signals: Django

```python
import logging
from datetime import datetime, timedelta
from typing import Any

from django.conf import settings
from django.db import transaction
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from django.utils.translation import override as override_language

from confirmation import settings as confirmation_settings
from zerver.actions.realm_settings import (
    do_add_deactivated_redirect,
    do_change_realm_plan_type,
    do_deactivate_realm,
)
from zerver.lib.bulk_create import create_users
from zerver.lib.push_notifications import sends_notifications_directly
from zerver.lib.remote_server import maybe_enqueue_audit_log_upload
from zerver.lib.server_initialization import create_internal_realm, server_initialized
from zerver.lib.sessions import delete_realm_user_sessions
from zerver.lib.streams import ensure_stream
from zerver.lib.user_groups import (
    create_system_user_groups_for_realm,
    get_role_based_system_groups_dict,
)
from zerver.lib.zulip_update_announcements import get_latest_zulip_update_announcements_level
from zerver.models import (
    DefaultStream,
    PreregistrationRealm,
    Realm,
    RealmAuditLog,
    RealmAuthenticationMethod,
    RealmUserDefault,
    UserProfile,
)
from zerver.models.groups import SystemGroups
from zerver.models.presence import PresenceSequence
from zerver.models.realm_audit_logs import AuditLogEventType
from zproject.backends import all_default_backend_names

DEFAULT_EMAIL_ADDRESS_VISIBILITY_FOR_REALM = RealmUserDefault.EMAIL_ADDRESS_VISIBILITY_ADMINS


def do_change_realm_subdomain(
    realm: Realm,
    new_subdomain: str,
    *,
    acting_user: UserProfile | None,
    add_deactivated_redirect: bool = True,
) -> None:
    """Changing a realm's subdomain is a highly disruptive operation,
    because all existing clients will need to be updated to point to
    the new URL.  Further, requests to fetch data from existing event
    queues will fail with an authentication error when this change
    happens (because the old subdomain is no longer associated with
    the realm), making it hard for us to provide a graceful update
    experience for clients.
    """
    old_subdomain = realm.subdomain
    old_url = realm.url
    # If the realm had been a demo organization scheduled for
    # deleting, clear that state.
    realm.demo_organization_scheduled_deletion_date = None
    realm.string_id = new_subdomain
    with transaction.atomic(durable=True):
        realm.save(update_fields=["string_id", "demo_organization_scheduled_deletion_date"])
        RealmAuditLog.objects.create(
            realm=realm,
            event_type=AuditLogEventType.REALM_SUBDOMAIN_CHANGED,
            event_time=timezone_now(),
            acting_user=acting_user,
            # Old RealmAuditLog entries for this used "old_subdomain" and
            # "new_subdomain" keys to store this data.
            extra_data={
                RealmAuditLog.OLD_VALUE: old_subdomain,
                RealmAuditLog.NEW_VALUE: new_subdomain,
            },
        )

        # If a realm if being renamed multiple times, we should find all the placeholder
        # realms and reset their deactivated_redirect field to point to the new realm url
        placeholder_realms = Realm.objects.filter(deactivated_redirect=old_url, deactivated=True)
        for placeholder_realm in placeholder_realms:
            do_add_deactivated_redirect(placeholder_realm, realm.url)

    # The below block isn't executed in a transaction with the earlier code due to
    # the functions called below being complex and potentially sending events,
    # which we don't want to do in atomic blocks.
    # When we change a realm's subdomain the realm with old subdomain is basically
    # deactivated. We are creating a deactivated realm using old subdomain and setting
    # it's deactivated redirect to new_subdomain so that we can tell the users that
    # the realm has been moved to a new subdomain.
    if add_deactivated_redirect:
        placeholder_realm = do_create_realm(old_subdomain, realm.name)
        do_deactivate_realm(
            placeholder_realm,
            acting_user=None,
            deactivation_reason="subdomain_change",
            email_owners=False,
        )
        do_add_deactivated_redirect(placeholder_realm, realm.url)

    # Sessions can't be deleted inside a transaction.
    delete_realm_user_sessions(realm)


@transaction.atomic(savepoint=False)
def set_default_for_realm_permission_group_settings(
    realm: Realm, group_settings_defaults_for_org_types: dict[str, dict[int, str]] | None = None
) -> None:
    system_groups_dict = get_role_based_system_groups_dict(realm)

    for setting_name, permission_configuration in Realm.REALM_PERMISSION_GROUP_SETTINGS.items():
        group_name = permission_configuration.default_group_name

        # Below code updates the group_name if the setting default depends on org_type.
        if (
            group_settings_defaults_for_org_types is not None
            and setting_name in group_settings_defaults_for_org_types
        ):
            setting_org_type_defaults = group_settings_defaults_for_org_types[setting_name]
            if realm.org_type in setting_org_type_defaults:
                group_name = setting_org_type_defaults[realm.org_type]

        setattr(realm, setting_name, system_groups_dict[group_name].usergroup_ptr)

    realm.save(update_fields=list(Realm.REALM_PERMISSION_GROUP_SETTINGS.keys()))


def setup_realm_internal_bots(realm: Realm) -> None:
    """Create this realm's internal bots.

    This function is idempotent; it does nothing for a bot that
    already exists.
    """
    internal_bots = [
        (bot["name"], bot["email_template"] % (settings.INTERNAL_BOT_DOMAIN,))
        for bot in settings.REALM_INTERNAL_BOTS
    ]
    create_users(realm, internal_bots, bot_type=UserProfile.DEFAULT_BOT)
    bots = UserProfile.objects.filter(
        realm=realm,
        email__in=[bot_info[1] for bot_info in internal_bots],
        bot_owner__isnull=True,
    )
    for bot in bots:
        bot.bot_owner = bot
        bot.save()


def get_email_address_visibility_default(org_type: int | None = None) -> int:
    # For the majority of organization types, the default email address visibility
    # setting for new users should initially be admins only.
    realm_default_email_address_visibility = DEFAULT_EMAIL_ADDRESS_VISIBILITY_FOR_REALM
    if org_type in (
        Realm.ORG_TYPES["education_nonprofit"]["id"],
        Realm.ORG_TYPES["education"]["id"],
    ):
        # Email address of users should be initially visible to moderators and admins.
        realm_default_email_address_visibility = (
            RealmUserDefault.EMAIL_ADDRESS_VISIBILITY_MODERATORS
        )
    elif org_type == Realm.ORG_TYPES["business"]["id"]:
        # Email address of users can be visible to all users for business organizations.
        realm_default_email_address_visibility = RealmUserDefault.EMAIL_ADDRESS_VISIBILITY_EVERYONE

    return realm_default_email_address_visibility


def do_create_realm(
    string_id: str,
    name: str,
    *,
    emails_restricted_to_domains: bool | None = None,
    description: str | None = None,
    invite_required: bool | None = None,
    plan_type: int | None = None,
    org_type: int | None = None,
    default_language: str | None = None,
    date_created: datetime | None = None,
    is_demo_organization: bool = False,
    enable_read_receipts: bool | None = None,
    enable_spectator_access: bool | None = None,
    prereg_realm: PreregistrationRealm | None = None,
    how_realm_creator_found_zulip: str | None = None,
    how_realm_creator_found_zulip_extra_context: str | None = None,
) -> Realm:
    if string_id in [settings.SOCIAL_AUTH_SUBDOMAIN, settings.SELF_HOSTING_MANAGEMENT_SUBDOMAIN]:
        raise AssertionError(
            "Creating a realm on SOCIAL_AUTH_SUBDOMAIN or SELF_HOSTING_MANAGEMENT_SUBDOMAIN is not allowed!"
        )
    if Realm.objects.filter(string_id=string_id).exists():
        raise AssertionError(f"Realm {string_id} already exists!")
    if not server_initialized():
        logging.info("Server not yet initialized. Creating the internal realm first.")
        create_internal_realm()

    kwargs: dict[str, Any] = {}
    if emails_restricted_to_domains is not None:
        kwargs["emails_restricted_to_domains"] = emails_restricted_to_domains
    if description is not None:
        kwargs["description"] = description
    if invite_required is not None:
        kwargs["invite_required"] = invite_required
    if plan_type is not None:
        kwargs["plan_type"] = plan_type
    if org_type is not None:
        kwargs["org_type"] = org_type
    if default_language is not None:
        kwargs["default_language"] = default_language
    if enable_spectator_access is not None:
        if enable_spectator_access:
            # Realms with LIMITED plan cannot have spectators enabled.
            assert plan_type != Realm.PLAN_TYPE_LIMITED
            assert plan_type is not None or not settings.BILLING_ENABLED
        kwargs["enable_spectator_access"] = enable_spectator_access

    if date_created is not None:
        # The date_created parameter is intended only for use by test
        # suites that want to backdate the date of a realm's creation.
        assert not settings.PRODUCTION
        kwargs["date_created"] = date_created

    if is_demo_organization:
        # To enable creating demo organizations, a deadline of the number
        # of days after creation that a demo organization should be deleted
        # needs to be set on the server.
        assert settings.DEMO_ORG_DEADLINE_DAYS is not None

    # Generally, closed organizations like companies want read
    # receipts, whereas it's unclear what an open organization's
    # preferences will be. We enable the setting by default only for
    # closed organizations.
    if enable_read_receipts is not None:
        kwargs["enable_read_receipts"] = enable_read_receipts
    else:
        # Hacky: The default of invited_required is True, so we need
        # to check for None too.
        kwargs["enable_read_receipts"] = (
            invite_required is None or invite_required is True or emails_restricted_to_domains
        )
    # Initialize this property correctly in the case that no network activity
    # is required to do so correctly.
    kwargs["push_notifications_enabled"] = sends_notifications_directly()

    with transaction.atomic(durable=True):
        realm = Realm(string_id=string_id, name=name, **kwargs)
        if is_demo_organization:
            assert settings.DEMO_ORG_DEADLINE_DAYS is not None
            realm.demo_organization_scheduled_deletion_date = realm.date_created + timedelta(
                days=settings.DEMO_ORG_DEADLINE_DAYS
            )

        # For now a dummy value of -1 is given to groups fields which
        # is changed later before the transaction is committed.
        for setting_name in Realm.REALM_PERMISSION_GROUP_SETTINGS:
            setattr(realm, setting_name + "_id", -1)

        realm.save()

        RealmAuditLog.objects.create(
            # acting_user will be set as the initial realm owner inside
            # do_create_user(..., realm_creation=True).
            acting_user=None,
            realm=realm,
            event_type=AuditLogEventType.REALM_CREATED,
            event_time=realm.date_created,
            extra_data={
                "how_realm_creator_found_zulip": how_realm_creator_found_zulip,
                "how_realm_creator_found_zulip_extra_context": how_realm_creator_found_zulip_extra_context,
            },
        )

        RealmUserDefault.objects.create(
            realm=realm,
            email_address_visibility=get_email_address_visibility_default(realm.org_type),
        )

        create_system_user_groups_for_realm(realm)

        group_settings_defaults_for_org_types = {
            "can_add_subscribers_group": {
                Realm.ORG_TYPES["education_nonprofit"]["id"]: SystemGroups.MODERATORS,
                Realm.ORG_TYPES["education"]["id"]: SystemGroups.MODERATORS,
            },
            "can_create_public_channel_group": {
                Realm.ORG_TYPES["education_nonprofit"]["id"]: SystemGroups.ADMINISTRATORS,
                Realm.ORG_TYPES["education"]["id"]: SystemGroups.ADMINISTRATORS,
            },
            "can_create_groups": {
                Realm.ORG_TYPES["education_nonprofit"]["id"]: SystemGroups.MODERATORS,
                Realm.ORG_TYPES["education"]["id"]: SystemGroups.MODERATORS,
            },
            "can_invite_users_group": {
                Realm.ORG_TYPES["education_nonprofit"]["id"]: SystemGroups.ADMINISTRATORS,
                Realm.ORG_TYPES["education"]["id"]: SystemGroups.ADMINISTRATORS,
            },
            "can_move_messages_between_channels_group": {
                Realm.ORG_TYPES["education_nonprofit"]["id"]: SystemGroups.MODERATORS,
                Realm.ORG_TYPES["education"]["id"]: SystemGroups.MODERATORS,
            },
        }
        set_default_for_realm_permission_group_settings(
            realm, group_settings_defaults_for_org_types
        )

        RealmAuthenticationMethod.objects.bulk_create(
            [
                RealmAuthenticationMethod(name=backend_name, realm=realm)
                for backend_name in all_default_backend_names()
            ]
        )

        PresenceSequence.objects.create(realm=realm, last_update_id=0)

        maybe_enqueue_audit_log_upload(realm)

    # Create channels once Realm object has been saved
    with override_language(realm.default_language):
        zulip_discussion_channel = ensure_stream(
            realm,
            str(Realm.ZULIP_DISCUSSION_CHANNEL_NAME),
            stream_description=_("Questions and discussion about using Zulip."),
            acting_user=None,
        )
        zulip_sandbox_channel = ensure_stream(
            realm,
            str(Realm.ZULIP_SANDBOX_CHANNEL_NAME),
            stream_description=_("Experiment with Zulip here. :test_tube:"),
            acting_user=None,
        )
        new_stream_announcements_stream = ensure_stream(
            realm,
            str(Realm.DEFAULT_NOTIFICATION_STREAM_NAME),
            stream_description=_("For team-wide conversations"),
            acting_user=None,
        )

    # By default, 'New stream' & 'Zulip update' announcements are sent to the same stream.
    realm.new_stream_announcements_stream = new_stream_announcements_stream
    realm.zulip_update_announcements_stream = new_stream_announcements_stream

    # With the current initial streams situation, the public channels are
    # 'zulip_discussion_channel', 'zulip_sandbox_channel', 'new_stream_announcements_stream'.
    public_channels = [
        DefaultStream(stream=zulip_discussion_channel, realm=realm),
        DefaultStream(stream=zulip_sandbox_channel, realm=realm),
        DefaultStream(stream=new_stream_announcements_stream, realm=realm),
    ]
    DefaultStream.objects.bulk_create(public_channels)

    # New realm is initialized with the latest zulip update announcements
    # level as it shouldn't receive a bunch of old updates.
    realm.zulip_update_announcements_level = get_latest_zulip_update_announcements_level()

    realm.save(
        update_fields=[
            "new_stream_announcements_stream",
            "zulip_update_announcements_stream",
            "zulip_update_announcements_level",
        ]
    )

    if plan_type is None and settings.BILLING_ENABLED:
        # We use acting_user=None for setting the initial plan type.
        do_change_realm_plan_type(realm, Realm.PLAN_TYPE_LIMITED, acting_user=None)

    if prereg_realm is not None:
        prereg_realm.status = confirmation_settings.STATUS_USED
        prereg_realm.created_realm = realm
        prereg_realm.save(update_fields=["status", "created_realm"])

    if settings.CORPORATE_ENABLED:
        # Send a notification to the admin realm when a new organization registers.
        from corporate.lib.stripe import RealmBillingSession

        billing_session = RealmBillingSession(user=None, realm=realm)
        billing_session.send_realm_created_internal_admin_message(is_demo_organization)

    setup_realm_internal_bots(realm)
    return realm
```

--------------------------------------------------------------------------------

````
