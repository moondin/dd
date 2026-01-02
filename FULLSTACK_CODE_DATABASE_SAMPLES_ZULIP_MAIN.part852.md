---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 852
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 852 of 1290)

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

---[FILE: realm_emoji.py]---
Location: zulip-main/zerver/actions/realm_emoji.py
Signals: Django

```python
from typing import IO

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.utils import IntegrityError
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _

from zerver.lib.emoji import get_emoji_file_name
from zerver.lib.exceptions import JsonableError
from zerver.lib.mime_types import INLINE_MIME_TYPES, bare_content_type
from zerver.lib.thumbnail import THUMBNAIL_ACCEPT_IMAGE_TYPES, BadImageError
from zerver.lib.upload import upload_emoji_image
from zerver.models import Realm, RealmAuditLog, RealmEmoji, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.realm_emoji import EmojiInfo, get_all_custom_emoji_for_realm
from zerver.models.users import active_user_ids
from zerver.tornado.django_api import send_event_on_commit


def notify_realm_emoji(realm: Realm, realm_emoji: dict[str, EmojiInfo]) -> None:
    event = dict(type="realm_emoji", op="update", realm_emoji=realm_emoji)
    send_event_on_commit(realm, event, active_user_ids(realm.id))


@transaction.atomic(durable=True)
def check_add_realm_emoji(
    realm: Realm, name: str, author: UserProfile, image_file: IO[bytes], content_type: str
) -> RealmEmoji:
    content_type = bare_content_type(content_type)
    try:
        realm_emoji = RealmEmoji(realm=realm, name=name, author=author)
        realm_emoji.full_clean()
        realm_emoji.save()
    except (IntegrityError, ValidationError):
        # This exists to handle races; upload_emoji checked prior to
        # calling, and also hand-validated the name, but we're now in
        # a transaction.  The error string should match the one in
        # upload_emoji.
        raise JsonableError(_("A custom emoji with this name already exists."))

    # This mirrors the check in upload_emoji_image because we want to
    # have some reasonable guarantees on the content-type before
    # deriving the file extension from it.
    if content_type not in THUMBNAIL_ACCEPT_IMAGE_TYPES or content_type not in INLINE_MIME_TYPES:
        raise BadImageError(_("Invalid image format"))

    emoji_file_name = get_emoji_file_name(content_type, realm_emoji.id)
    is_animated = upload_emoji_image(image_file, emoji_file_name, author, content_type)

    realm_emoji.file_name = emoji_file_name
    realm_emoji.is_animated = is_animated
    realm_emoji.save(update_fields=["file_name", "is_animated"])

    realm_emoji_dict = get_all_custom_emoji_for_realm(realm.id)
    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=author,
        event_type=AuditLogEventType.REALM_EMOJI_ADDED,
        event_time=timezone_now(),
        extra_data={
            "realm_emoji": dict(sorted(realm_emoji_dict.items())),
            "added_emoji": realm_emoji_dict[str(realm_emoji.id)],
        },
    )
    notify_realm_emoji(realm_emoji.realm, realm_emoji_dict)
    return realm_emoji


@transaction.atomic(durable=True)
def do_remove_realm_emoji(realm: Realm, name: str, *, acting_user: UserProfile | None) -> None:
    emoji = RealmEmoji.objects.get(realm=realm, name=name, deactivated=False)
    emoji.deactivated = True
    emoji.save(update_fields=["deactivated"])

    realm_emoji_dict = get_all_custom_emoji_for_realm(realm.id)
    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.REALM_EMOJI_REMOVED,
        event_time=timezone_now(),
        extra_data={
            "realm_emoji": dict(sorted(realm_emoji_dict.items())),
            "deactivated_emoji": realm_emoji_dict[str(emoji.id)],
        },
    )

    notify_realm_emoji(realm, realm_emoji_dict)
```

--------------------------------------------------------------------------------

---[FILE: realm_export.py]---
Location: zulip-main/zerver/actions/realm_export.py
Signals: Django

```python
from django.db import transaction
from django.utils.timezone import now as timezone_now

from zerver.lib.export import get_realm_exports_serialized
from zerver.lib.upload import delete_export_tarball
from zerver.models import Realm, RealmAuditLog, RealmExport, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.tornado.django_api import send_event_on_commit


def notify_realm_export(realm: Realm) -> None:
    event = dict(type="realm_export", exports=get_realm_exports_serialized(realm))
    send_event_on_commit(realm, event, realm.get_human_admin_users().values_list("id", flat=True))


@transaction.atomic(durable=True)
def do_delete_realm_export(export_row: RealmExport, acting_user: UserProfile) -> None:
    export_path = export_row.export_path
    assert export_path is not None

    delete_export_tarball(export_path)

    export_row.status = RealmExport.DELETED
    export_row.date_deleted = timezone_now()
    export_row.save(update_fields=["status", "date_deleted"])
    notify_realm_export(export_row.realm)

    RealmAuditLog.objects.create(
        acting_user=acting_user,
        realm=export_row.realm,
        event_type=AuditLogEventType.REALM_EXPORT_DELETED,
        event_time=export_row.date_deleted,
        extra_data={"realm_export_id": export_row.id},
    )
```

--------------------------------------------------------------------------------

---[FILE: realm_icon.py]---
Location: zulip-main/zerver/actions/realm_icon.py
Signals: Django

```python
from django.db import transaction
from django.utils.timezone import now as timezone_now

from zerver.lib.realm_icon import realm_icon_url
from zerver.models import Realm, RealmAuditLog, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.users import active_user_ids
from zerver.tornado.django_api import send_event_on_commit


@transaction.atomic(durable=True)
def do_change_icon_source(
    realm: Realm, icon_source: str, *, acting_user: UserProfile | None
) -> None:
    realm.icon_source = icon_source
    realm.icon_version += 1
    realm.save(update_fields=["icon_source", "icon_version"])

    event_time = timezone_now()
    RealmAuditLog.objects.create(
        realm=realm,
        event_type=AuditLogEventType.REALM_ICON_SOURCE_CHANGED,
        extra_data={"icon_source": icon_source, "icon_version": realm.icon_version},
        event_time=event_time,
        acting_user=acting_user,
    )

    event = dict(
        type="realm",
        op="update_dict",
        property="icon",
        data=dict(icon_source=realm.icon_source, icon_url=realm_icon_url(realm)),
    )
    send_event_on_commit(
        realm,
        event,
        active_user_ids(realm.id),
    )
```

--------------------------------------------------------------------------------

---[FILE: realm_linkifiers.py]---
Location: zulip-main/zerver/actions/realm_linkifiers.py
Signals: Django

```python
from django.db import transaction
from django.db.models import Max
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError
from zerver.lib.types import LinkifierDict
from zerver.models import Realm, RealmAuditLog, RealmFilter, UserProfile
from zerver.models.linkifiers import flush_linkifiers, linkifiers_for_realm
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.users import active_user_ids
from zerver.tornado.django_api import send_event_on_commit


def notify_linkifiers(realm: Realm, realm_linkifiers: list[LinkifierDict]) -> None:
    event: dict[str, object] = dict(type="realm_linkifiers", realm_linkifiers=realm_linkifiers)
    send_event_on_commit(realm, event, active_user_ids(realm.id))


# NOTE: Regexes must be simple enough that they can be easily translated to JavaScript
# RegExp syntax. In addition to JS-compatible syntax, the following features are available:
#   * Named groups will be converted to numbered groups automatically
#   * Inline-regex flags will be stripped, and where possible translated to RegExp-wide flags
@transaction.atomic(durable=True)
def do_add_linkifier(
    realm: Realm,
    pattern: str,
    url_template: str,
    *,
    acting_user: UserProfile | None,
) -> int:
    pattern = pattern.strip()
    url_template = url_template.strip()
    # This makes sure that the new linkifier is always ordered the last modulo
    # the rare race condition.
    max_order = RealmFilter.objects.aggregate(Max("order"))["order__max"]
    if max_order is None:
        linkifier = RealmFilter(realm=realm, pattern=pattern, url_template=url_template)
    else:
        linkifier = RealmFilter(
            realm=realm, pattern=pattern, url_template=url_template, order=max_order + 1
        )
    linkifier.full_clean()
    linkifier.save()

    realm_linkifiers = linkifiers_for_realm(realm.id)
    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.REALM_LINKIFIER_ADDED,
        event_time=timezone_now(),
        extra_data={
            "realm_linkifiers": realm_linkifiers,
            "added_linkifier": LinkifierDict(
                pattern=pattern,
                url_template=url_template,
                id=linkifier.id,
            ),
        },
    )
    notify_linkifiers(realm, realm_linkifiers)

    return linkifier.id


@transaction.atomic(durable=True)
def do_remove_linkifier(
    realm: Realm,
    pattern: str | None = None,
    id: int | None = None,
    *,
    acting_user: UserProfile | None = None,
) -> None:
    if pattern is not None:
        realm_linkifier = RealmFilter.objects.get(realm=realm, pattern=pattern)
    else:
        assert id is not None
        realm_linkifier = RealmFilter.objects.get(realm=realm, id=id)

    pattern = realm_linkifier.pattern
    url_template = realm_linkifier.url_template
    realm_linkifier.delete()

    realm_linkifiers = linkifiers_for_realm(realm.id)
    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.REALM_LINKIFIER_REMOVED,
        event_time=timezone_now(),
        extra_data={
            "realm_linkifiers": realm_linkifiers,
            "removed_linkifier": {
                "pattern": pattern,
                "url_template": url_template,
            },
        },
    )
    notify_linkifiers(realm, realm_linkifiers)


@transaction.atomic(durable=True)
def do_update_linkifier(
    realm: Realm,
    id: int,
    pattern: str,
    url_template: str,
    *,
    acting_user: UserProfile | None,
) -> None:
    pattern = pattern.strip()
    url_template = url_template.strip()
    linkifier = RealmFilter.objects.get(realm=realm, id=id)
    linkifier.pattern = pattern
    linkifier.url_template = url_template
    linkifier.full_clean()
    linkifier.save(update_fields=["pattern", "url_template"])

    realm_linkifiers = linkifiers_for_realm(realm.id)
    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.REALM_LINKIFIER_CHANGED,
        event_time=timezone_now(),
        extra_data={
            "realm_linkifiers": realm_linkifiers,
            "changed_linkifier": LinkifierDict(
                pattern=pattern,
                url_template=url_template,
                id=linkifier.id,
            ),
        },
    )

    notify_linkifiers(realm, realm_linkifiers)


@transaction.atomic(durable=True)
def check_reorder_linkifiers(
    realm: Realm, ordered_linkifier_ids: list[int], *, acting_user: UserProfile | None
) -> None:
    """ordered_linkifier_ids should contain ids of all existing linkifiers.
    In the rare situation when any of the linkifier gets deleted that more ids
    are passed, the checks below are sufficient to detect inconsistencies most of
    the time."""
    # Repeated IDs in the user request would collapse into the same key when
    # constructing the set.
    linkifier_id_set = set(ordered_linkifier_ids)
    if len(linkifier_id_set) < len(ordered_linkifier_ids):
        raise JsonableError(_("The ordered list must not contain duplicated linkifiers"))

    linkifiers = RealmFilter.objects.filter(realm=realm)
    if {linkifier.id for linkifier in linkifiers} != linkifier_id_set:
        raise JsonableError(
            _("The ordered list must enumerate all existing linkifiers exactly once")
        )

    # After the validation, we are sure that there is nothing to do. Return
    # early to avoid flushing the cache and populating the audit logs.
    if len(linkifiers) == 0:
        return

    id_to_new_order = {
        linkifier_id: order for order, linkifier_id in enumerate(ordered_linkifier_ids)
    }

    for linkifier in linkifiers:
        assert linkifier.id in id_to_new_order
        linkifier.order = id_to_new_order[linkifier.id]
    RealmFilter.objects.bulk_update(linkifiers, fields=["order"])
    flush_linkifiers(instance=linkifiers[0])

    # This roundtrip re-fetches the linkifiers sorted in the new order.
    realm_linkifiers = linkifiers_for_realm(realm.id)
    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.REALM_LINKIFIERS_REORDERED,
        event_time=timezone_now(),
        extra_data={
            "realm_linkifiers": realm_linkifiers,
        },
    )
    notify_linkifiers(realm, realm_linkifiers)
```

--------------------------------------------------------------------------------

---[FILE: realm_logo.py]---
Location: zulip-main/zerver/actions/realm_logo.py
Signals: Django

```python
from django.db import transaction
from django.utils.timezone import now as timezone_now

from zerver.lib.realm_logo import get_realm_logo_data
from zerver.models import Realm, RealmAuditLog, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.users import active_user_ids
from zerver.tornado.django_api import send_event_on_commit


@transaction.atomic(durable=True)
def do_change_logo_source(
    realm: Realm, logo_source: str, night: bool, *, acting_user: UserProfile | None
) -> None:
    if not night:
        realm.logo_source = logo_source
        realm.logo_version += 1
        realm.save(update_fields=["logo_source", "logo_version"])

    else:
        realm.night_logo_source = logo_source
        realm.night_logo_version += 1
        realm.save(update_fields=["night_logo_source", "night_logo_version"])

    RealmAuditLog.objects.create(
        event_type=AuditLogEventType.REALM_LOGO_CHANGED,
        realm=realm,
        event_time=timezone_now(),
        acting_user=acting_user,
    )

    event = dict(
        type="realm",
        op="update_dict",
        property="night_logo" if night else "logo",
        data=get_realm_logo_data(realm, night),
    )
    send_event_on_commit(realm, event, active_user_ids(realm.id))
```

--------------------------------------------------------------------------------

---[FILE: realm_playgrounds.py]---
Location: zulip-main/zerver/actions/realm_playgrounds.py
Signals: Django

```python
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.timezone import now as timezone_now

from zerver.lib.exceptions import ValidationFailureError
from zerver.lib.types import RealmPlaygroundDict
from zerver.models import Realm, RealmAuditLog, RealmPlayground, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.realm_playgrounds import get_realm_playgrounds
from zerver.models.users import active_user_ids
from zerver.tornado.django_api import send_event_on_commit


def notify_realm_playgrounds(realm: Realm, realm_playgrounds: list[RealmPlaygroundDict]) -> None:
    event = dict(type="realm_playgrounds", realm_playgrounds=realm_playgrounds)
    send_event_on_commit(realm, event, active_user_ids(realm.id))


@transaction.atomic(durable=True)
def check_add_realm_playground(
    realm: Realm,
    *,
    acting_user: UserProfile | None,
    name: str,
    pygments_language: str,
    url_template: str,
) -> int:
    realm_playground = RealmPlayground(
        realm=realm,
        name=name,
        pygments_language=pygments_language,
        url_template=url_template,
    )
    # The additional validations using url_template_validation
    # check_pygments_language, etc are included in full_clean.
    # Because we want to avoid raising ValidationError from this check_*
    # function, we do error handling here to turn it into a JsonableError.
    try:
        realm_playground.full_clean()
    except ValidationError as e:
        raise ValidationFailureError(e)
    realm_playground.save()
    realm_playgrounds = get_realm_playgrounds(realm)
    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.REALM_PLAYGROUND_ADDED,
        event_time=timezone_now(),
        extra_data={
            "realm_playgrounds": realm_playgrounds,
            "added_playground": RealmPlaygroundDict(
                id=realm_playground.id,
                name=realm_playground.name,
                pygments_language=realm_playground.pygments_language,
                url_template=realm_playground.url_template,
            ),
        },
    )
    notify_realm_playgrounds(realm, realm_playgrounds)
    return realm_playground.id


@transaction.atomic(durable=True)
def do_remove_realm_playground(
    realm: Realm, realm_playground: RealmPlayground, *, acting_user: UserProfile | None
) -> None:
    removed_playground = {
        "name": realm_playground.name,
        "pygments_language": realm_playground.pygments_language,
        "url_template": realm_playground.url_template,
    }

    realm_playground.delete()
    realm_playgrounds = get_realm_playgrounds(realm)

    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.REALM_PLAYGROUND_REMOVED,
        event_time=timezone_now(),
        extra_data={
            "realm_playgrounds": realm_playgrounds,
            "removed_playground": removed_playground,
        },
    )

    notify_realm_playgrounds(realm, realm_playgrounds)
```

--------------------------------------------------------------------------------

````
