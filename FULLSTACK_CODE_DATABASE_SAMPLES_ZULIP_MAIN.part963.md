---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 963
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 963 of 1290)

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

---[FILE: prereg_users.py]---
Location: zulip-main/zerver/models/prereg_users.py
Signals: Django

```python
from django.contrib.contenttypes.fields import GenericRelation
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models
from django.db.models import CASCADE, Q, QuerySet
from django.db.models.functions import Upper
from django.utils.timezone import now as timezone_now

from confirmation import settings as confirmation_settings
from zerver.models.constants import MAX_LANGUAGE_ID_LENGTH
from zerver.models.realms import Realm
from zerver.models.users import UserProfile


class PreregistrationRealm(models.Model):
    """Data on a partially created realm entered by a user who has
    completed the "new organization" form. Used to transfer the user's
    selections from the pre-confirmation "new organization" form to
    the post-confirmation user registration form.

    Note that the values stored here may not match those of the
    created realm (in the event the user creates a realm at all),
    because we allow the user to edit these values in the registration
    form (and in fact the user will be required to do so if the
    `string_id` is claimed by another realm before registraiton is
    completed).
    """

    name = models.CharField(max_length=Realm.MAX_REALM_NAME_LENGTH)
    org_type = models.PositiveSmallIntegerField(
        default=Realm.ORG_TYPES["unspecified"]["id"],
        choices=[(t["id"], t["name"]) for t in Realm.ORG_TYPES.values()],
    )
    default_language = models.CharField(
        default="en",
        max_length=MAX_LANGUAGE_ID_LENGTH,
    )
    string_id = models.CharField(max_length=Realm.MAX_REALM_SUBDOMAIN_LENGTH)
    email = models.EmailField()

    confirmation = GenericRelation("confirmation.Confirmation", related_query_name="prereg_realm")
    status = models.IntegerField(default=0)

    # The Realm created upon completion of the registration
    # for this PregistrationRealm
    created_realm = models.ForeignKey(Realm, null=True, related_name="+", on_delete=models.SET_NULL)

    # The UserProfile created upon completion of the registration
    # for this PregistrationRealm
    created_user = models.ForeignKey(
        UserProfile, null=True, related_name="+", on_delete=models.SET_NULL
    )

    IMPORT_FROM_CHOICES = [
        ("none", "Don't import"),
        ("slack", "Import from Slack"),
    ]
    data_import_metadata = models.JSONField(default=dict, encoder=DjangoJSONEncoder)


class PreregistrationUser(models.Model):
    # Data on a partially created user, before the completion of
    # registration.  This is used in at least three major code paths:
    # * Realm creation, in which case realm is None.
    #
    # * Invitations, in which case referred_by will always be set.
    #
    # * Social authentication signup, where it's used to store data
    #   from the authentication step and pass it to the registration
    #   form.

    email = models.EmailField()

    confirmation = GenericRelation("confirmation.Confirmation", related_query_name="prereg_user")
    # If the pre-registration process provides a suggested full name for this user,
    # store it here to use it to prepopulate the full name field in the registration form:
    full_name = models.CharField(max_length=UserProfile.MAX_NAME_LENGTH, null=True)
    full_name_validated = models.BooleanField(default=False)
    referred_by = models.ForeignKey(UserProfile, null=True, on_delete=CASCADE)
    notify_referrer_on_join = models.BooleanField(default=True)
    streams = models.ManyToManyField("zerver.Stream")
    groups = models.ManyToManyField("zerver.NamedUserGroup")
    invited_at = models.DateTimeField(auto_now=True)
    realm_creation = models.BooleanField(default=False)

    # Custom text to be sent to created users in a welcome bot message.
    welcome_message_custom_text = models.TextField(null=True)

    # Indicates whether the user needs a password.  Users who were
    # created via SSO style auth (e.g. GitHub/Google) generally do not.
    password_required = models.BooleanField(default=True)

    # status: whether an object has been confirmed.
    #   if confirmed, set to confirmation.settings.STATUS_USED
    status = models.IntegerField(default=0)

    # The realm should only ever be None for PreregistrationUser
    # objects created as part of realm creation.
    realm = models.ForeignKey(Realm, null=True, on_delete=CASCADE)

    # These values should be consistent with the values
    # in settings_config.user_role_values.
    INVITE_AS = dict(
        REALM_OWNER=100,
        REALM_ADMIN=200,
        MODERATOR=300,
        MEMBER=400,
        GUEST_USER=600,
    )
    invited_as = models.PositiveSmallIntegerField(default=INVITE_AS["MEMBER"])

    multiuse_invite = models.ForeignKey("MultiuseInvite", null=True, on_delete=models.SET_NULL)

    # The UserProfile created upon completion of the registration
    # for this PregistrationUser
    created_user = models.ForeignKey(
        UserProfile, null=True, related_name="+", on_delete=models.SET_NULL
    )

    include_realm_default_subscriptions = models.BooleanField(default=True)

    # Used in realm import flow to allow importer (the person
    # whose email is set as PreregistrationRealm.email) to create
    # a new user if a imported user with the matching
    # email was not found.
    is_realm_importer = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(Upper("email"), name="upper_preregistration_email_idx"),
        ]


def filter_to_valid_prereg_users(
    query: QuerySet[PreregistrationUser],
) -> QuerySet[PreregistrationUser]:
    """
    If invite_expires_in_days is specified, we return only those PreregistrationUser
    objects that were created at most that many days in the past.
    """
    used_value = confirmation_settings.STATUS_USED
    revoked_value = confirmation_settings.STATUS_REVOKED

    query = query.exclude(status__in=[used_value, revoked_value])
    return query.filter(
        Q(confirmation__expiry_date=None) | Q(confirmation__expiry_date__gte=timezone_now())
    )


class MultiuseInvite(models.Model):
    referred_by = models.ForeignKey(UserProfile, on_delete=CASCADE)
    streams = models.ManyToManyField("zerver.Stream")
    groups = models.ManyToManyField("zerver.NamedUserGroup")
    realm = models.ForeignKey(Realm, on_delete=CASCADE)
    invited_as = models.PositiveSmallIntegerField(default=PreregistrationUser.INVITE_AS["MEMBER"])
    include_realm_default_subscriptions = models.BooleanField(default=True)

    # Custom text to be sent to created users in a welcome bot message.
    welcome_message_custom_text = models.TextField(null=True)

    # status for tracking whether the invite has been revoked.
    # If revoked, set to confirmation.settings.STATUS_REVOKED.
    # STATUS_USED is not supported, because these objects are supposed
    # to be usable multiple times.
    status = models.IntegerField(default=0)


class EmailChangeStatus(models.Model):
    new_email = models.EmailField()
    old_email = models.EmailField()
    updated_at = models.DateTimeField(auto_now=True)
    user_profile = models.ForeignKey(UserProfile, on_delete=CASCADE)

    # status: whether an object has been confirmed.
    #   if confirmed, set to confirmation.settings.STATUS_USED
    status = models.IntegerField(default=0)

    realm = models.ForeignKey(Realm, on_delete=CASCADE)


class RealmReactivationStatus(models.Model):
    # status: whether an object has been confirmed.
    #   if confirmed, set to confirmation.settings.STATUS_USED
    status = models.IntegerField(default=0)

    realm = models.ForeignKey(Realm, on_delete=CASCADE)


class RealmCreationStatus(models.Model):
    # status: whether an object has been confirmed.
    #   if confirmed, set to confirmation.settings.STATUS_USED
    status = models.IntegerField(default=0)
    date_created = models.DateTimeField(default=timezone_now)

    # True just if we should presume the email address the user enters
    # is theirs, and skip sending mail to it to confirm that.
    presume_email_valid = models.BooleanField(default=False)
```

--------------------------------------------------------------------------------

---[FILE: presence.py]---
Location: zulip-main/zerver/models/presence.py
Signals: Django

```python
from django.db import models
from django.db.models import CASCADE
from django.utils.timezone import now as timezone_now

from zerver.models.clients import Client
from zerver.models.messages import AbstractEmoji
from zerver.models.realms import Realm
from zerver.models.users import UserProfile


class UserPresence(models.Model):
    """A record from the last time we heard from a given user on a given client.

    This is the core table for Zulip's presence API, which consists of two components:
    1) The update-presence endpoint, which is used for clients to update their presence
       status and fetch latest presence data the whole realm:
       https://zulip.com/api/update-presence
    2) The events system is used to send limited immediate updates when
       a user comes back online: https://zulip.com/api/get-events#presence

    NOTE: Users can disable updates to this table (see UserProfile.presence_enabled),
    so this cannot be used to determine if a user was recently active on Zulip.
    The UserActivity table is recommended for that purpose.
    """

    user_profile = models.OneToOneField(UserProfile, on_delete=CASCADE, unique=True)

    # Realm is just here as denormalization to optimize database
    # queries to fetch all presence data for a given realm.
    realm = models.ForeignKey(Realm, on_delete=CASCADE)

    # The sequence ID within this realm for the last update to this user's presence;
    # these IDs are generated by the PresenceSequence table and an important part
    # of how we send incremental presence updates efficiently.
    # To put it simply, every time we update a UserPresence row in a realm,
    # the row gets last_update_id equal to 1 more than the previously updated
    # row in that realm.
    # This allows us to order UserPresence rows by when they were last updated.
    # The API side of this functionality is documented at:
    # https://zulip.com/api/update-presence#parameter-last_update_id
    last_update_id = models.PositiveBigIntegerField(db_index=True, default=0)

    # The last time the user had a client connected to Zulip,
    # including idle clients where the user hasn't interacted with the
    # system recently (and thus might be AFK).
    last_connected_time = models.DateTimeField(default=timezone_now, db_index=True, null=True)
    # The last time a client connected to Zulip reported that the user
    # was actually present (E.g. via focusing a browser window or
    # interacting with a computer running the desktop app)
    last_active_time = models.DateTimeField(default=timezone_now, db_index=True, null=True)

    # The following constants are used in the presence API for
    # communicating whether a user is active (last_active_time recent)
    # or idle (last_connected_time recent) or offline (neither
    # recent).  They're no longer part of the data model.
    LEGACY_STATUS_ACTIVE = "active"
    LEGACY_STATUS_IDLE = "idle"
    LEGACY_STATUS_ACTIVE_INT = 1
    LEGACY_STATUS_IDLE_INT = 2

    class Meta:
        indexes = [
            models.Index(
                fields=["realm", "last_active_time"],
                name="zerver_userpresence_realm_id_last_active_time_1c5aa9a2_idx",
            ),
            models.Index(
                fields=["realm", "last_connected_time"],
                name="zerver_userpresence_realm_id_last_connected_time_98d2fc9f_idx",
            ),
            models.Index(
                fields=["realm", "last_update_id"],
                name="zerver_userpresence_realm_last_update_id_idx",
            ),
        ]

    @staticmethod
    def status_from_string(status: str) -> int | None:
        if status == "active":
            return UserPresence.LEGACY_STATUS_ACTIVE_INT
        elif status == "idle":
            return UserPresence.LEGACY_STATUS_IDLE_INT

        return None


class PresenceSequence(models.Model):
    """
    This table is used to generate last_update_id values in the UserPresence table.

    It serves as a per-realm sequence generator, while also facilitating
    locking to avoid concurrency issues with setting last_update_id values.

    Every realm has its unique row in this table, and when a UserPresence in the realm
    is being updated, this row get locked against other UserPresence updates in the realm
    to ensure sequential processing and set last_update_id values correctly.
    """

    realm = models.OneToOneField(Realm, on_delete=CASCADE)
    last_update_id = models.PositiveBigIntegerField()


class UserStatus(AbstractEmoji):
    user_profile = models.OneToOneField(UserProfile, on_delete=CASCADE)

    timestamp = models.DateTimeField()
    client = models.ForeignKey(Client, on_delete=CASCADE)

    # Override emoji_name and emoji_code field of (AbstractReaction model) to accept
    # default value.
    emoji_name = models.TextField(default="")
    emoji_code = models.TextField(default="")

    status_text = models.CharField(max_length=255, default="")
```

--------------------------------------------------------------------------------

---[FILE: push_notifications.py]---
Location: zulip-main/zerver/models/push_notifications.py
Signals: Django

```python
from typing import Literal

from django.db import models
from django.db.models import CASCADE, F, Q, UniqueConstraint
from django.db.models.functions import Lower

from zerver.lib.exceptions import (
    InvalidBouncerPublicKeyError,
    InvalidEncryptedPushRegistrationError,
    RequestExpiredError,
)
from zerver.models.users import UserProfile


class AbstractPushDeviceToken(models.Model):
    APNS = 1
    FCM = 2

    KINDS = (
        (APNS, "apns"),
        # The string value in the database is "gcm" for legacy reasons.
        # TODO: We should migrate it.
        (FCM, "gcm"),
    )

    kind = models.PositiveSmallIntegerField(choices=KINDS)

    # The token is a unique device-specific token that is
    # sent to us from each device:
    #   - APNS token if kind == APNS
    #   - FCM registration id if kind == FCM
    token = models.CharField(max_length=4096, db_index=True)

    # TODO: last_updated should be renamed date_created, since it is
    # no longer maintained as a last_updated value.
    last_updated = models.DateTimeField(auto_now=True)

    # [optional] Contains the app id of the device if it is an iOS device
    ios_app_id = models.TextField(null=True)

    class Meta:
        abstract = True


class PushDeviceToken(AbstractPushDeviceToken):
    # The user whose device this is
    user = models.ForeignKey(UserProfile, db_index=True, on_delete=CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "user_id",
                "kind",
                Lower(F("token")),
                name="zerver_pushdevicetoken_apns_user_kind_token",
                condition=Q(kind=AbstractPushDeviceToken.APNS),
            ),
            models.UniqueConstraint(
                "user_id",
                "kind",
                "token",
                name="zerver_pushdevicetoken_fcm_user_kind_token",
                condition=Q(kind=AbstractPushDeviceToken.FCM),
            ),
        ]


class AbstractPushDevice(models.Model):
    class TokenKind(models.TextChoices):
        APNS = "apns", "APNs"
        FCM = "fcm", "FCM"

    token_kind = models.CharField(max_length=4, choices=TokenKind.choices)

    # 64-bit random integer ID generated by the client; will only be
    # guaranteed to be unique within the client's own table of accounts.
    push_account_id = models.BigIntegerField()

    class Meta:
        abstract = True


class PushDevice(AbstractPushDevice):
    """Core zulip server table storing registrations that are potentially
    registered with the mobile push notifications bouncer service.

    Each row corresponds to an account on an install of the app
    that has attempted to register with the bouncer to receive
    mobile push notifications.
    """

    # The user on this server to whom this PushDevice belongs.
    user = models.ForeignKey(UserProfile, on_delete=CASCADE)

    # Key to use to encrypt notifications for delivery to this device.
    # Consists of a 1-byte prefix identifying the symmetric cryptosystem
    # in use, followed by the secret key.
    # Prefix                 Cryptosystem
    #  0x31        libsodium's `crypto_secretbox_easy`
    push_key = models.BinaryField()

    # `device_id` of the corresponding `RemotePushDevice`
    # row created after successful registration to bouncer.
    # Set to NULL while registration to bouncer is in progress or failed.
    bouncer_device_id = models.BigIntegerField(null=True)

    class ErrorCode(models.TextChoices):
        INVALID_BOUNCER_PUBLIC_KEY = InvalidBouncerPublicKeyError.code.name
        INVALID_ENCRYPTED_PUSH_REGISTRATION = InvalidEncryptedPushRegistrationError.code.name
        REQUEST_EXPIRED = RequestExpiredError.code.name

    # The error code returned when registration to bouncer fails.
    # Set to NULL if the registration is in progress or successful.
    error_code = models.CharField(max_length=100, choices=ErrorCode.choices, null=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                # In theory, there's possibility that a user with
                # two different devices having the same 'push_account_id'
                # generated by the client to register. But the API treats
                # that as idempotent request.
                # We treat (user, push_account_id) as a unique registration.
                #
                # Also, the unique index created is used by queries in `get_push_accounts`,
                # `register_push_device`, `handle_register_push_device_to_bouncer`, and
                # `send_e2ee_test_push_notification_api`.
                fields=["user", "push_account_id"],
                name="unique_push_device_user_push_account_id",
            ),
        ]
        indexes = [
            models.Index(
                # Used in 'send_push_notifications', `send_e2ee_test_push_notification_api`,
                # 'get_recipient_info', and 'do_clear_mobile_push_notifications_for_ids'.
                fields=["user", "bouncer_device_id"],
                condition=Q(bouncer_device_id__isnull=False),
                name="zerver_pushdevice_user_bouncer_device_id_idx",
            ),
        ]

    @property
    def status(self) -> Literal["active", "pending", "failed"]:
        if self.error_code is not None:
            return "failed"
        elif self.bouncer_device_id is None:
            return "pending"
        return "active"
```

--------------------------------------------------------------------------------

````
