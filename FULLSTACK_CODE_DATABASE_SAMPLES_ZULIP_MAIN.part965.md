---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 965
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 965 of 1290)

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

---[FILE: realm_audit_logs.py]---
Location: zulip-main/zerver/models/realm_audit_logs.py
Signals: Django

```python
from enum import IntEnum, unique

from django.core.serializers.json import DjangoJSONEncoder
from django.db import models
from django.db.models import CASCADE, Q
from typing_extensions import override

from zerver.models.channel_folders import ChannelFolder
from zerver.models.groups import NamedUserGroup
from zerver.models.realms import Realm
from zerver.models.streams import Stream
from zerver.models.users import UserProfile


@unique
class AuditLogEventType(IntEnum):
    USER_CREATED = 101
    USER_ACTIVATED = 102
    USER_DEACTIVATED = 103
    USER_REACTIVATED = 104
    USER_ROLE_CHANGED = 105
    USER_DELETED = 106
    USER_DELETED_PRESERVING_MESSAGES = 107
    USER_SPECIAL_PERMISSION_CHANGED = 108

    USER_SOFT_ACTIVATED = 120
    USER_SOFT_DEACTIVATED = 121
    USER_PASSWORD_CHANGED = 122
    USER_AVATAR_SOURCE_CHANGED = 123
    USER_FULL_NAME_CHANGED = 124
    USER_EMAIL_CHANGED = 125
    USER_TERMS_OF_SERVICE_VERSION_CHANGED = 126
    USER_API_KEY_CHANGED = 127
    USER_BOT_OWNER_CHANGED = 128
    USER_DEFAULT_SENDING_STREAM_CHANGED = 129
    USER_DEFAULT_REGISTER_STREAM_CHANGED = 130
    USER_DEFAULT_ALL_PUBLIC_STREAMS_CHANGED = 131
    USER_SETTING_CHANGED = 132
    USER_DIGEST_EMAIL_CREATED = 133
    USER_IS_IMPORTED_STUB_CHANGED = 134

    REALM_DEACTIVATED = 201
    REALM_REACTIVATED = 202
    REALM_SCRUBBED = 203
    REALM_PLAN_TYPE_CHANGED = 204
    REALM_LOGO_CHANGED = 205
    REALM_EXPORTED = 206
    REALM_PROPERTY_CHANGED = 207
    REALM_ICON_SOURCE_CHANGED = 208
    REALM_DISCOUNT_CHANGED = 209
    REALM_SPONSORSHIP_APPROVED = 210
    REALM_BILLING_MODALITY_CHANGED = 211
    REALM_REACTIVATION_EMAIL_SENT = 212
    REALM_SPONSORSHIP_PENDING_STATUS_CHANGED = 213
    REALM_SUBDOMAIN_CHANGED = 214
    REALM_CREATED = 215
    REALM_DEFAULT_USER_SETTINGS_CHANGED = 216
    REALM_ORG_TYPE_CHANGED = 217
    REALM_DOMAIN_ADDED = 218
    REALM_DOMAIN_CHANGED = 219
    REALM_DOMAIN_REMOVED = 220
    REALM_PLAYGROUND_ADDED = 221
    REALM_PLAYGROUND_REMOVED = 222
    REALM_LINKIFIER_ADDED = 223
    REALM_LINKIFIER_CHANGED = 224
    REALM_LINKIFIER_REMOVED = 225
    REALM_EMOJI_ADDED = 226
    REALM_EMOJI_REMOVED = 227
    REALM_LINKIFIERS_REORDERED = 228

    # This event for a realm means that this server processed exported data
    # (either from another Zulip server or a 3rd party app such as Slack),
    # and imported the data as the given realm.
    REALM_IMPORTED = 229
    REALM_EXPORT_DELETED = 230

    SUBSCRIPTION_CREATED = 301
    SUBSCRIPTION_ACTIVATED = 302
    SUBSCRIPTION_DEACTIVATED = 303
    SUBSCRIPTION_PROPERTY_CHANGED = 304

    USER_MUTED = 350
    USER_UNMUTED = 351

    STRIPE_CUSTOMER_CREATED = 401
    STRIPE_CARD_CHANGED = 402
    STRIPE_PLAN_CHANGED = 403
    STRIPE_PLAN_QUANTITY_RESET = 404

    CUSTOMER_CREATED = 501
    CUSTOMER_PLAN_CREATED = 502
    CUSTOMER_SWITCHED_FROM_MONTHLY_TO_ANNUAL_PLAN = 503
    CUSTOMER_SWITCHED_FROM_ANNUAL_TO_MONTHLY_PLAN = 504
    CUSTOMER_PROPERTY_CHANGED = 505
    CUSTOMER_PLAN_PROPERTY_CHANGED = 506

    CHANNEL_CREATED = 601
    CHANNEL_DEACTIVATED = 602
    CHANNEL_NAME_CHANGED = 603
    CHANNEL_REACTIVATED = 604
    CHANNEL_MESSAGE_RETENTION_DAYS_CHANGED = 605
    CHANNEL_PROPERTY_CHANGED = 607
    CHANNEL_GROUP_BASED_SETTING_CHANGED = 608
    CHANNEL_FOLDER_CHANGED = 609

    USER_GROUP_CREATED = 701
    USER_GROUP_DELETED = 702
    USER_GROUP_DIRECT_USER_MEMBERSHIP_ADDED = 703
    USER_GROUP_DIRECT_USER_MEMBERSHIP_REMOVED = 704
    USER_GROUP_DIRECT_SUBGROUP_MEMBERSHIP_ADDED = 705
    USER_GROUP_DIRECT_SUBGROUP_MEMBERSHIP_REMOVED = 706
    USER_GROUP_DIRECT_SUPERGROUP_MEMBERSHIP_ADDED = 707
    USER_GROUP_DIRECT_SUPERGROUP_MEMBERSHIP_REMOVED = 708
    # 709 to 719 reserved for membership changes
    USER_GROUP_NAME_CHANGED = 720
    USER_GROUP_DESCRIPTION_CHANGED = 721
    USER_GROUP_GROUP_BASED_SETTING_CHANGED = 722
    USER_GROUP_DEACTIVATED = 723
    USER_GROUP_REACTIVATED = 724

    SAVED_SNIPPET_CREATED = 800

    CUSTOM_EMAIL_SENT = 810

    NAVIGATION_VIEW_CREATED = 850
    NAVIGATION_VIEW_UPDATED = 851
    NAVIGATION_VIEW_DELETED = 852

    CHANNEL_FOLDER_CREATED = 901
    CHANNEL_FOLDER_NAME_CHANGED = 902
    CHANNEL_FOLDER_DESCRIPTION_CHANGED = 903
    CHANNEL_FOLDER_ARCHIVED = 904
    CHANNEL_FOLDER_UNARCHIVED = 905

    # The following values are only for remote server/realm logs.
    # Values should be exactly 10000 greater than the corresponding
    # value used for the same purpose in realm audit logs (e.g.,
    # REALM_DEACTIVATED = 201, and REMOTE_SERVER_DEACTIVATED = 10201).
    REMOTE_SERVER_DEACTIVATED = 10201
    REMOTE_SERVER_REACTIVATED = 10202
    REMOTE_SERVER_PLAN_TYPE_CHANGED = 10204
    REMOTE_SERVER_DISCOUNT_CHANGED = 10209
    REMOTE_SERVER_SPONSORSHIP_APPROVED = 10210
    REMOTE_SERVER_BILLING_MODALITY_CHANGED = 10211
    REMOTE_SERVER_SPONSORSHIP_PENDING_STATUS_CHANGED = 10213
    REMOTE_SERVER_CREATED = 10215
    REMOTE_SERVER_REGISTRATION_TRANSFERRED = 10216

    # This value is for RemoteRealmAuditLog entries tracking changes to the
    # RemoteRealm model resulting from modified realm information sent to us
    # via send_server_data_to_push_bouncer.
    REMOTE_REALM_VALUE_UPDATED = 20001
    REMOTE_PLAN_TRANSFERRED_SERVER_TO_REALM = 20002
    REMOTE_REALM_LOCALLY_DELETED = 20003
    REMOTE_REALM_LOCALLY_DELETED_RESTORED = 20004


class AbstractRealmAuditLog(models.Model):
    """Defines fields common to RealmAuditLog and RemoteRealmAuditLog."""

    event_time = models.DateTimeField(db_index=True)
    # If True, event_time is an overestimate of the true time. Can be used
    # by migrations when introducing a new event_type.
    backfilled = models.BooleanField(default=False)

    # Keys within extra_data, when extra_data is a json dict. Keys are strings because
    # json keys must always be strings.
    OLD_VALUE = "1"
    NEW_VALUE = "2"
    ROLE_COUNT = "10"
    ROLE_COUNT_HUMANS = "11"
    ROLE_COUNT_BOTS = "12"

    extra_data = models.JSONField(default=dict, encoder=DjangoJSONEncoder)

    # See AuditLogEventType class above.
    event_type = models.PositiveSmallIntegerField()

    # event_types synced from on-prem installations to Zulip Cloud when
    # billing for mobile push notifications is enabled.  Every billing
    # event_type should have ROLE_COUNT populated in extra_data.
    SYNCED_BILLING_EVENTS = [
        AuditLogEventType.USER_CREATED,
        AuditLogEventType.USER_ACTIVATED,
        AuditLogEventType.USER_DEACTIVATED,
        AuditLogEventType.USER_REACTIVATED,
        AuditLogEventType.USER_ROLE_CHANGED,
        AuditLogEventType.REALM_DEACTIVATED,
        AuditLogEventType.REALM_REACTIVATED,
        AuditLogEventType.REALM_IMPORTED,
    ]

    HOW_REALM_CREATOR_FOUND_ZULIP_OPTIONS = {
        "existing_user": "At an organization that's using it",
        "search_engine": "Search engine",
        "ai_chatbot": "AI/LLM",
        "review_site": "Review site",
        "personal_recommendation": "Personal recommendation",
        "hacker_news": "Hacker News",
        "reddit": "Reddit",
        "ad": "Advertisement",
        "other": "Other",
        "forgot": "Don't remember",
        "refuse_to_answer": "Prefer not to say",
    }

    class Meta:
        abstract = True


class RealmAuditLog(AbstractRealmAuditLog):
    """
    RealmAuditLog tracks important changes to users, streams, and
    realms in Zulip.  It is intended to support both
    debugging/introspection (e.g. determining when a user's left a
    given stream?) as well as help with some database migrations where
    we might be able to do a better data backfill with it.  Here are a
    few key details about how this works:

    * acting_user is the user who initiated the state change
    * modified_user (if present) is the user being modified
    * modified_stream (if present) is the stream being modified
    * modified_user_group (if present) is the user group being modified

    For example:
    * When a user subscribes another user to a stream, modified_user,
      acting_user, and modified_stream will all be present and different.
    * When an administrator changes an organization's realm icon,
      acting_user is that administrator and modified_user,
      modified_stream and modified_user_group will be None.
    """

    realm = models.ForeignKey(Realm, on_delete=CASCADE)
    acting_user = models.ForeignKey(
        UserProfile,
        null=True,
        related_name="+",
        on_delete=CASCADE,
    )
    modified_user = models.ForeignKey(
        UserProfile,
        null=True,
        related_name="+",
        on_delete=CASCADE,
    )
    modified_stream = models.ForeignKey(
        Stream,
        null=True,
        on_delete=CASCADE,
    )
    modified_user_group = models.ForeignKey(
        NamedUserGroup,
        null=True,
        on_delete=CASCADE,
    )
    modified_channel_folder = models.ForeignKey(
        ChannelFolder,
        null=True,
        on_delete=CASCADE,
    )
    event_last_message_id = models.IntegerField(null=True)
    scrubbed = models.BooleanField(db_default=False, default=False)

    class Meta:
        ordering = ["id"]
        indexes = [
            models.Index(
                name="zerver_realmauditlog_realm__event_type__event_time",
                fields=["realm", "event_type", "event_time"],
            ),
            models.Index(
                name="zerver_realmauditlog_user_subscriptions_idx",
                fields=["modified_user", "modified_stream"],
                condition=Q(
                    event_type__in=[
                        AuditLogEventType.SUBSCRIPTION_CREATED,
                        AuditLogEventType.SUBSCRIPTION_ACTIVATED,
                        AuditLogEventType.SUBSCRIPTION_DEACTIVATED,
                    ]
                ),
            ),
            models.Index(
                # Used in analytics/lib/counts.py for computing active users for realm_active_humans
                name="zerver_realmauditlog_user_activations_idx",
                fields=["modified_user", "event_time"],
                condition=Q(
                    event_type__in=[
                        AuditLogEventType.USER_CREATED,
                        AuditLogEventType.USER_ACTIVATED,
                        AuditLogEventType.USER_DEACTIVATED,
                        AuditLogEventType.USER_REACTIVATED,
                    ]
                ),
            ),
        ]

    @override
    def __str__(self) -> str:
        event_type_name = AuditLogEventType(self.event_type).name
        if self.modified_user is not None:
            return f"{event_type_name} {self.event_time} (id={self.id}): {self.modified_user!r}"
        if self.modified_stream is not None:
            return f"{event_type_name} {self.event_time} (id={self.id}): {self.modified_stream!r}"
        if self.modified_user_group is not None:
            return (
                f"{event_type_name} {self.event_time} (id={self.id}): {self.modified_user_group!r}"
            )
        return f"{event_type_name} {self.event_time} (id={self.id}): {self.realm!r}"
```

--------------------------------------------------------------------------------

---[FILE: realm_emoji.py]---
Location: zulip-main/zerver/models/realm_emoji.py
Signals: Django

```python
from typing import TypedDict

from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from django.db.models import CASCADE, Q
from django.db.models.signals import post_delete, post_save
from django.utils.translation import gettext_lazy
from typing_extensions import override

from zerver.lib.cache import cache_set, cache_with_key
from zerver.models.realms import Realm


class EmojiInfo(TypedDict):
    id: str
    name: str
    source_url: str
    deactivated: bool
    author_id: int | None
    still_url: str | None


def get_all_custom_emoji_for_realm_cache_key(realm_id: int) -> str:
    return f"realm_emoji:{realm_id}"


class RealmEmoji(models.Model):
    author = models.ForeignKey(
        "UserProfile",
        blank=True,
        null=True,
        on_delete=CASCADE,
    )
    realm = models.ForeignKey(Realm, on_delete=CASCADE)
    name = models.TextField(
        validators=[
            MinLengthValidator(1),
            # The second part of the regex (negative lookbehind) disallows names
            # ending with one of the punctuation characters.
            RegexValidator(
                regex=r"^[0-9a-z.\-_]+(?<![.\-_])$",
                message=gettext_lazy("Invalid characters in emoji name"),
            ),
        ]
    )

    # The basename of the custom emoji's filename; see PATH_ID_TEMPLATE for the full path.
    file_name = models.TextField(db_index=True, null=True, blank=True)

    # Whether this custom emoji is an animated image.
    is_animated = models.BooleanField(default=False)

    deactivated = models.BooleanField(default=False)

    PATH_ID_TEMPLATE = "{realm_id}/emoji/images/{emoji_file_name}"
    STILL_PATH_ID_TEMPLATE = "{realm_id}/emoji/images/still/{emoji_filename_without_extension}.png"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["realm", "name"],
                condition=Q(deactivated=False),
                name="unique_realm_emoji_when_false_deactivated",
            ),
        ]

    @override
    def __str__(self) -> str:
        return f"{self.realm.string_id}: {self.id} {self.name} {self.deactivated} {self.file_name}"


def get_all_custom_emoji_for_realm_uncached(realm_id: int) -> dict[str, EmojiInfo]:
    # RealmEmoji objects with file_name=None are still in the process
    # of being uploaded, and we expect to be cleaned up by a
    # try/finally block if the upload fails, so it's correct to
    # exclude them.
    query = RealmEmoji.objects.filter(realm_id=realm_id).exclude(
        file_name=None,
    )
    d = {}
    from zerver.lib.emoji import get_emoji_url

    for realm_emoji in query.all():
        author_id = realm_emoji.author_id
        assert realm_emoji.file_name is not None
        emoji_url = get_emoji_url(realm_emoji.file_name, realm_emoji.realm_id)

        emoji_dict: EmojiInfo = dict(
            id=str(realm_emoji.id),
            name=realm_emoji.name,
            source_url=emoji_url,
            deactivated=realm_emoji.deactivated,
            author_id=author_id,
            still_url=None,
        )

        if realm_emoji.is_animated:
            # For animated emoji, we include still_url with a static
            # version of the image, so that clients can display the
            # emoji in a less distracting (not animated) fashion when
            # desired.
            emoji_dict["still_url"] = get_emoji_url(
                realm_emoji.file_name, realm_emoji.realm_id, still=True
            )

        d[str(realm_emoji.id)] = emoji_dict

    return d


@cache_with_key(get_all_custom_emoji_for_realm_cache_key, timeout=3600 * 24 * 7)
def get_all_custom_emoji_for_realm(realm_id: int) -> dict[str, EmojiInfo]:
    return get_all_custom_emoji_for_realm_uncached(realm_id)


def get_name_keyed_dict_for_active_realm_emoji(realm_id: int) -> dict[str, EmojiInfo]:
    # It's important to use the cached version here.
    realm_emojis = get_all_custom_emoji_for_realm(realm_id)
    return {row["name"]: row for row in realm_emojis.values() if not row["deactivated"]}


def flush_realm_emoji(*, instance: RealmEmoji, **kwargs: object) -> None:
    if instance.file_name is None:
        # Because we construct RealmEmoji.file_name using the ID for
        # the RealmEmoji object, it will always have file_name=None,
        # and then it'll be updated with the actual filename as soon
        # as the upload completes successfully.
        #
        # Doing nothing when file_name=None is the best option, since
        # such an object shouldn't have been cached yet, and this
        # function will be called again when file_name is set.
        return
    realm_id = instance.realm_id
    cache_set(
        get_all_custom_emoji_for_realm_cache_key(realm_id),
        get_all_custom_emoji_for_realm_uncached(realm_id),
        timeout=3600 * 24 * 7,
    )


post_save.connect(flush_realm_emoji, sender=RealmEmoji)
post_delete.connect(flush_realm_emoji, sender=RealmEmoji)
```

--------------------------------------------------------------------------------

---[FILE: realm_playgrounds.py]---
Location: zulip-main/zerver/models/realm_playgrounds.py
Signals: Django

```python
import uri_template
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import CASCADE
from django.utils.translation import gettext as _
from typing_extensions import override

from zerver.lib.types import RealmPlaygroundDict
from zerver.models.linkifiers import url_template_validator
from zerver.models.realms import Realm


class RealmPlayground(models.Model):
    """Server side storage model to store playground information needed by our
    'view code in playground' feature in code blocks.
    """

    MAX_PYGMENTS_LANGUAGE_LENGTH = 40

    realm = models.ForeignKey(Realm, on_delete=CASCADE)
    url_template = models.TextField(validators=[url_template_validator])

    # User-visible display name used when configuring playgrounds in the settings page and
    # when displaying them in the playground links popover.
    name = models.TextField(db_index=True)

    # This stores the pygments lexer subclass names and not the aliases themselves.
    pygments_language = models.CharField(
        db_index=True,
        max_length=MAX_PYGMENTS_LANGUAGE_LENGTH,
        # We validate to see if this conforms to the character set allowed for a
        # language in the code block.
        validators=[
            RegexValidator(
                regex=r"^[ a-zA-Z0-9_+-./#]*$", message=_("Invalid characters in pygments language")
            )
        ],
    )

    class Meta:
        unique_together = (("realm", "pygments_language", "name"),)

    @override
    def __str__(self) -> str:
        return f"{self.realm.string_id}: {self.pygments_language} {self.name}"

    @override
    def clean(self) -> None:
        """Validate whether the URL template is valid for the playground,
        ensuring that "code" is the sole variable present in it.

        Django's `full_clean` calls `clean_fields` followed by `clean` method
        and stores all ValidationErrors from all stages to return as JSON.
        """

        # Do not continue the check if the url template is invalid to begin
        # with. The ValidationError for invalid template will only be raised by
        # the validator set on the url_template field instead of here to avoid
        # duplicates.
        if not uri_template.validate(self.url_template):
            return

        # Extract variables used in the URL template.
        template_variables = set(uri_template.URITemplate(self.url_template).variable_names)

        if "code" not in template_variables:
            raise ValidationError(_('Missing the required variable "code" in the URL template'))

        # The URL template should only contain a single variable, which is "code".
        if len(template_variables) != 1:
            raise ValidationError(
                _('"code" should be the only variable present in the URL template'),
            )


def get_realm_playgrounds(realm: Realm) -> list[RealmPlaygroundDict]:
    return [
        RealmPlaygroundDict(
            id=playground.id,
            name=playground.name,
            pygments_language=playground.pygments_language,
            url_template=playground.url_template,
        )
        for playground in RealmPlayground.objects.filter(realm=realm).all()
    ]
```

--------------------------------------------------------------------------------

---[FILE: recipients.py]---
Location: zulip-main/zerver/models/recipients.py
Signals: Django

```python
import hashlib
from collections import defaultdict
from typing import TYPE_CHECKING

from django.db import models, transaction
from django.db.models import QuerySet
from typing_extensions import override

from zerver.lib.display_recipient import get_display_recipient

if TYPE_CHECKING:
    from zerver.models import Subscription


class Recipient(models.Model):
    """Represents an audience that can potentially receive messages in Zulip.

    This table essentially functions as a generic foreign key that
    allows Message.recipient_id to be a simple ForeignKey representing
    the audience for a message, while supporting the different types
    of audiences Zulip supports for a message.

    Recipient has just two attributes: The enum type, and a type_id,
    which is the ID of the UserProfile/Stream/DirectMessageGroup object
    containing all the metadata for the audience. There are 3 recipient
    types:

    1. 1:1 direct message: The type_id is the ID of the UserProfile
       who will receive any message to this Recipient. The sender
       of such a message is represented separately.
    2. Stream message: The type_id is the ID of the associated Stream.
    3. Group direct message: In Zulip, group direct messages are
       represented by DirectMessageGroup objects, which encode the set of
       users in the conversation. The type_id is the ID of the associated
       DirectMessageGroup object; the set of users is usually retrieved
       via the Subscription table. See the DirectMessageGroup model for
       details.

    See also the Subscription model, which stores which UserProfile
    objects are subscribed to which Recipient objects.
    """

    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")
    type_id = models.IntegerField(db_index=True)
    type = models.PositiveSmallIntegerField(db_index=True)
    # Valid types are {personal, stream, direct_message_group}

    # The type for 1:1 direct messages.
    PERSONAL = 1
    # The type for stream messages.
    STREAM = 2
    # The type group direct messages.
    DIRECT_MESSAGE_GROUP = 3

    class Meta:
        unique_together = ("type", "type_id")

    @override
    def __str__(self) -> str:
        return f"{self.label()} ({self.type_id}, {self.type})"

    def label(self) -> str:
        from zerver.models import Stream

        if self.type == Recipient.STREAM:
            return Stream.objects.get(id=self.type_id).name
        else:
            return str(get_display_recipient(self))


def get_direct_message_group_user_ids(recipient: Recipient) -> QuerySet["Subscription", int]:
    from zerver.models import Subscription

    assert recipient.type == Recipient.DIRECT_MESSAGE_GROUP

    return (
        Subscription.objects.filter(
            recipient=recipient,
        )
        .order_by("user_profile_id")
        .values_list("user_profile_id", flat=True)
    )


def bulk_get_direct_message_group_user_ids(recipient_ids: list[int]) -> dict[int, set[int]]:
    """
    Takes a list of direct_message_group type recipient_ids, returns
    a dictmapping recipient id to list of user ids in the direct
    message group.

    We rely on our caller to pass us recipient_ids that correspond
    to direct_message_group, but technically this function is valid
    for any typeof subscription.
    """
    from zerver.models import Subscription

    if not recipient_ids:
        return {}

    subscriptions = Subscription.objects.filter(
        recipient_id__in=recipient_ids,
    ).only("user_profile_id", "recipient_id")

    result_dict: dict[int, set[int]] = defaultdict(set)
    for subscription in subscriptions:
        result_dict[subscription.recipient_id].add(subscription.user_profile_id)

    return result_dict


class DirectMessageGroup(models.Model):
    """
    Represents a group of individuals who may have a
    group direct message conversation together.

    The membership of the DirectMessageGroup is stored in the Subscription
    table just like with Streams - for each user in the DirectMessageGroup,
    there is a Subscription object tied to the UserProfile and the
    DirectMessageGroup's recipient object.

    A hash of the list of user IDs is stored in the huddle_hash field
    below, to support efficiently mapping from a set of users to the
    corresponding DirectMessageGroup object.
    """

    # TODO: We should consider whether using
    # CommaSeparatedIntegerField would be better.
    huddle_hash = models.CharField(max_length=40, db_index=True, unique=True)
    # Foreign key to the Recipient object for this DirectMessageGroup.
    recipient = models.ForeignKey(Recipient, null=True, on_delete=models.SET_NULL)

    group_size = models.IntegerField()

    # TODO: The model still uses the old "zerver_huddle" database table.
    # As a part of the migration of "Huddle" to "DirectMessageGroup"
    # it needs to be renamed to "zerver_directmessagegroup".
    class Meta:
        db_table = "zerver_huddle"


def get_direct_message_group_hash(id_list: list[int]) -> str:
    id_list = sorted(set(id_list))
    hash_key = ",".join(str(x) for x in id_list)
    return hashlib.sha1(hash_key.encode()).hexdigest()


def get_or_create_direct_message_group(id_list: list[int]) -> DirectMessageGroup:
    """
    Takes a list of user IDs and returns the DirectMessageGroup
    object for the group consisting of these users. If the
    DirectMessageGroup object does not yet exist, it will be
    transparently created.
    """
    from zerver.models import Subscription, UserProfile

    assert len(id_list) == len(set(id_list))
    direct_message_group_hash = get_direct_message_group_hash(id_list)
    with transaction.atomic(savepoint=False):
        (direct_message_group, created) = DirectMessageGroup.objects.get_or_create(
            huddle_hash=direct_message_group_hash,
            group_size=len(id_list),
        )
        if created:
            recipient = Recipient.objects.create(
                type_id=direct_message_group.id, type=Recipient.DIRECT_MESSAGE_GROUP
            )
            direct_message_group.recipient = recipient
            direct_message_group.save(update_fields=["recipient"])
            subs_to_create = [
                Subscription(
                    recipient=recipient,
                    user_profile_id=user_profile_id,
                    is_user_active=is_active,
                )
                for user_profile_id, is_active in UserProfile.objects.filter(id__in=id_list)
                .distinct("id")
                .values_list("id", "is_active")
            ]
            Subscription.objects.bulk_create(subs_to_create)
        return direct_message_group


def get_direct_message_group(id_list: list[int]) -> DirectMessageGroup | None:
    """
    Takes a list of user IDs and returns the DirectMessageGroup
    object for the group consisting of these users if exists. If
    the DirectMessageGroup object does not yet exist, it will
    return None.
    """

    try:
        direct_message_group_hash = get_direct_message_group_hash(id_list)
        return DirectMessageGroup.objects.get(
            huddle_hash=direct_message_group_hash,
            group_size=len(id_list),
        )
    except DirectMessageGroup.DoesNotExist:
        return None
```

--------------------------------------------------------------------------------

---[FILE: saved_snippets.py]---
Location: zulip-main/zerver/models/saved_snippets.py
Signals: Django

```python
from typing import Any

from django.conf import settings
from django.db import models
from django.utils.timezone import now as timezone_now

from zerver.models.realms import Realm
from zerver.models.users import UserProfile


class SavedSnippet(models.Model):
    MAX_TITLE_LENGTH = 60

    realm = models.ForeignKey(Realm, on_delete=models.CASCADE)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    title = models.TextField(max_length=MAX_TITLE_LENGTH)
    content = models.TextField(max_length=settings.MAX_MESSAGE_LENGTH)
    date_created = models.DateTimeField(default=timezone_now)

    def to_api_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "date_created": int(self.date_created.timestamp()),
        }
```

--------------------------------------------------------------------------------

---[FILE: scheduled_jobs.py]---
Location: zulip-main/zerver/models/scheduled_jobs.py
Signals: Django

```python
from typing import TypedDict

from django.conf import settings
from django.db import models
from django.db.models import CASCADE, Q
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from zerver.lib.display_recipient import get_recipient_ids
from zerver.lib.timestamp import datetime_to_timestamp
from zerver.models.clients import Client
from zerver.models.constants import MAX_TOPIC_NAME_LENGTH
from zerver.models.groups import NamedUserGroup
from zerver.models.messages import Message
from zerver.models.realms import Realm
from zerver.models.recipients import Recipient
from zerver.models.streams import Stream
from zerver.models.users import UserProfile


class AbstractScheduledJob(models.Model):
    scheduled_timestamp = models.DateTimeField(db_index=True)
    # JSON representation of arguments to consumer
    data = models.TextField()
    realm = models.ForeignKey(Realm, on_delete=CASCADE)

    class Meta:
        abstract = True


class ScheduledEmail(AbstractScheduledJob):
    # Exactly one of users or address should be set. These are
    # duplicate values, used to efficiently filter the set of
    # ScheduledEmails for use in clear_scheduled_emails; the
    # recipients used for actually sending messages are stored in the
    # data field of AbstractScheduledJob.
    users = models.ManyToManyField(UserProfile)
    # Just the address part of a full "name <address>" email address
    address = models.EmailField(null=True, db_index=True)

    # Valid types are below
    WELCOME = 1
    DIGEST = 2
    INVITATION_REMINDER = 3
    type = models.PositiveSmallIntegerField()

    @override
    def __str__(self) -> str:
        return f"{self.type} {self.address or list(self.users.all())} {self.scheduled_timestamp}"


class MissedMessageEmailAddress(models.Model):
    message = models.ForeignKey(Message, on_delete=CASCADE)
    user_profile = models.ForeignKey(UserProfile, on_delete=CASCADE)
    email_token = models.CharField(max_length=34, unique=True, db_index=True)

    # Timestamp of when the missed message address generated.
    timestamp = models.DateTimeField(db_index=True, default=timezone_now)
    # Number of times the missed message address has been used.
    times_used = models.PositiveIntegerField(default=0, db_index=True)

    @override
    def __str__(self) -> str:
        return settings.EMAIL_GATEWAY_PATTERN % (self.email_token,)

    def increment_times_used(self) -> None:
        self.times_used += 1
        self.save(update_fields=["times_used"])


class NotificationTriggers:
    # "direct_message" is for 1:1 and group direct messages
    DIRECT_MESSAGE = "direct_message"
    MENTION = "mentioned"
    TOPIC_WILDCARD_MENTION = "topic_wildcard_mentioned"
    STREAM_WILDCARD_MENTION = "stream_wildcard_mentioned"
    STREAM_PUSH = "stream_push_notify"
    STREAM_EMAIL = "stream_email_notify"
    FOLLOWED_TOPIC_PUSH = "followed_topic_push_notify"
    FOLLOWED_TOPIC_EMAIL = "followed_topic_email_notify"
    TOPIC_WILDCARD_MENTION_IN_FOLLOWED_TOPIC = "topic_wildcard_mentioned_in_followed_topic"
    STREAM_WILDCARD_MENTION_IN_FOLLOWED_TOPIC = "stream_wildcard_mentioned_in_followed_topic"


class ScheduledMessageNotificationEmail(models.Model):
    """Stores planned outgoing message notification emails. They may be
    processed earlier should Zulip choose to batch multiple messages
    in a single email, but typically will be processed just after
    scheduled_timestamp.
    """

    user_profile = models.ForeignKey(UserProfile, on_delete=CASCADE)
    message = models.ForeignKey(Message, on_delete=CASCADE)

    EMAIL_NOTIFICATION_TRIGGER_CHOICES = [
        (NotificationTriggers.DIRECT_MESSAGE, "Direct message"),
        (NotificationTriggers.MENTION, "Mention"),
        (NotificationTriggers.TOPIC_WILDCARD_MENTION, "Topic wildcard mention"),
        (NotificationTriggers.STREAM_WILDCARD_MENTION, "Stream wildcard mention"),
        (NotificationTriggers.STREAM_EMAIL, "Stream notifications enabled"),
        (NotificationTriggers.FOLLOWED_TOPIC_EMAIL, "Followed topic notifications enabled"),
        (
            NotificationTriggers.TOPIC_WILDCARD_MENTION_IN_FOLLOWED_TOPIC,
            "Topic wildcard mention in followed topic",
        ),
        (
            NotificationTriggers.STREAM_WILDCARD_MENTION_IN_FOLLOWED_TOPIC,
            "Stream wildcard mention in followed topic",
        ),
    ]

    trigger = models.TextField(choices=EMAIL_NOTIFICATION_TRIGGER_CHOICES)
    mentioned_user_group = models.ForeignKey(NamedUserGroup, null=True, on_delete=CASCADE)

    # Timestamp for when the notification should be processed and sent.
    # Calculated from the time the event was received and the batching period.
    scheduled_timestamp = models.DateTimeField(db_index=True)


class APIScheduledStreamMessageDict(TypedDict):
    scheduled_message_id: int
    to: int
    type: str
    content: str
    rendered_content: str
    topic: str
    scheduled_delivery_timestamp: int
    failed: bool


class APIScheduledDirectMessageDict(TypedDict):
    scheduled_message_id: int
    to: list[int]
    type: str
    content: str
    rendered_content: str
    scheduled_delivery_timestamp: int
    failed: bool


class APIReminderDirectMessageDict(TypedDict):
    reminder_id: int
    to: list[int]
    type: str
    content: str
    rendered_content: str
    scheduled_delivery_timestamp: int
    failed: bool
    reminder_target_message_id: int


class ScheduledMessage(models.Model):
    sender = models.ForeignKey(UserProfile, on_delete=CASCADE)
    recipient = models.ForeignKey(Recipient, on_delete=CASCADE)
    subject = models.CharField(max_length=MAX_TOPIC_NAME_LENGTH)
    content = models.TextField()
    rendered_content = models.TextField()
    sending_client = models.ForeignKey(Client, on_delete=CASCADE)
    stream = models.ForeignKey(Stream, null=True, on_delete=CASCADE)
    realm = models.ForeignKey(Realm, on_delete=CASCADE)
    scheduled_timestamp = models.DateTimeField(db_index=True)
    read_by_sender = models.BooleanField()
    delivered = models.BooleanField(default=False)
    delivered_message = models.ForeignKey(Message, null=True, on_delete=CASCADE)
    has_attachment = models.BooleanField(default=False, db_index=True)
    request_timestamp = models.DateTimeField(default=timezone_now)
    # Only used for REMIND delivery_type messages.
    reminder_target_message_id = models.IntegerField(null=True)
    reminder_note = models.TextField(null=True)

    # Metadata for messages that failed to send when their scheduled
    # moment arrived.
    failed = models.BooleanField(default=False)
    failure_message = models.TextField(null=True)

    SEND_LATER = 1
    REMIND = 2

    DELIVERY_TYPES = (
        (SEND_LATER, "send_later"),
        (REMIND, "remind"),
    )

    delivery_type = models.PositiveSmallIntegerField(
        choices=DELIVERY_TYPES,
        default=SEND_LATER,
    )

    class Meta:
        indexes = [
            # We expect a large number of delivered scheduled messages
            # to accumulate over time. This first index is for the
            # deliver_scheduled_messages worker.
            models.Index(
                name="zerver_unsent_scheduled_messages_by_time",
                fields=["scheduled_timestamp"],
                condition=Q(
                    delivered=False,
                    failed=False,
                ),
            ),
            # This index is for displaying scheduled messages to the
            # user themself via the API; we don't filter failed
            # messages since we will want to display those so that
            # failures don't just disappear into a black hole.
            models.Index(
                name="zerver_realm_unsent_scheduled_messages_by_user",
                fields=["realm_id", "sender", "delivery_type", "scheduled_timestamp"],
                condition=Q(
                    delivered=False,
                ),
            ),
        ]

    @override
    def __str__(self) -> str:
        if self.recipient.type != Recipient.STREAM:
            return f"{self.recipient.label()} {self.sender!r} {self.scheduled_timestamp}"

        return f"{self.recipient.label()} {self.subject} {self.sender!r} {self.scheduled_timestamp}"

    def topic_name(self) -> str:
        return self.subject

    def set_topic_name(self, topic_name: str) -> None:
        self.subject = topic_name

    def is_channel_message(self) -> bool:
        return self.recipient.type == Recipient.STREAM

    def to_dict(self) -> APIScheduledStreamMessageDict | APIScheduledDirectMessageDict:
        recipient, recipient_type_str = get_recipient_ids(self.recipient, self.sender.id)

        if recipient_type_str == "private":
            # The topic for direct messages should always be "\x07".
            assert self.topic_name() == Message.DM_TOPIC

            return APIScheduledDirectMessageDict(
                scheduled_message_id=self.id,
                to=recipient,
                type=recipient_type_str,
                content=self.content,
                rendered_content=self.rendered_content,
                scheduled_delivery_timestamp=datetime_to_timestamp(self.scheduled_timestamp),
                failed=self.failed,
            )

        # The recipient for stream messages should always just be the unique stream ID.
        assert len(recipient) == 1

        return APIScheduledStreamMessageDict(
            scheduled_message_id=self.id,
            to=recipient[0],
            type=recipient_type_str,
            content=self.content,
            rendered_content=self.rendered_content,
            topic=self.topic_name(),
            scheduled_delivery_timestamp=datetime_to_timestamp(self.scheduled_timestamp),
            failed=self.failed,
        )

    def to_reminder_dict(self) -> APIReminderDirectMessageDict:
        assert self.reminder_target_message_id is not None
        recipient, recipient_type_str = get_recipient_ids(self.recipient, self.sender.id)
        assert recipient_type_str == "private"
        return APIReminderDirectMessageDict(
            reminder_id=self.id,
            to=recipient,
            type=recipient_type_str,
            content=self.content,
            rendered_content=self.rendered_content,
            scheduled_delivery_timestamp=datetime_to_timestamp(self.scheduled_timestamp),
            failed=self.failed,
            reminder_target_message_id=self.reminder_target_message_id,
        )


EMAIL_TYPES = {
    "account_registered": ScheduledEmail.WELCOME,
    "onboarding_zulip_topics": ScheduledEmail.WELCOME,
    "onboarding_zulip_guide": ScheduledEmail.WELCOME,
    "onboarding_team_to_zulip": ScheduledEmail.WELCOME,
    "digest": ScheduledEmail.DIGEST,
    "invitation_reminder": ScheduledEmail.INVITATION_REMINDER,
}
```

--------------------------------------------------------------------------------

````
