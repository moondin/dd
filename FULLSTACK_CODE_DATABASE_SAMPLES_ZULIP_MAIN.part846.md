---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 846
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 846 of 1290)

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

---[FILE: custom_profile_fields.py]---
Location: zulip-main/zerver/actions/custom_profile_fields.py
Signals: Django

```python
from collections.abc import Iterable

import orjson
from django.db import transaction
from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError
from zerver.lib.external_accounts import DEFAULT_EXTERNAL_ACCOUNTS
from zerver.lib.streams import render_stream_description
from zerver.lib.types import ProfileDataElementUpdateDict, ProfileFieldData
from zerver.lib.users import get_user_ids_who_can_access_user
from zerver.models import CustomProfileField, CustomProfileFieldValue, Realm, UserProfile
from zerver.models.custom_profile_fields import custom_profile_fields_for_realm
from zerver.models.users import active_user_ids
from zerver.tornado.django_api import send_event_on_commit


def notify_realm_custom_profile_fields(realm: Realm) -> None:
    fields = custom_profile_fields_for_realm(realm.id)
    event = dict(type="custom_profile_fields", fields=[f.as_dict() for f in fields])
    send_event_on_commit(realm, event, active_user_ids(realm.id))


@transaction.atomic(durable=True)
def try_add_realm_default_custom_profile_field(
    realm: Realm,
    field_subtype: str,
    display_in_profile_summary: bool = False,
    required: bool = False,
    editable_by_user: bool = True,
) -> CustomProfileField:
    field_data = DEFAULT_EXTERNAL_ACCOUNTS[field_subtype]
    custom_profile_field = CustomProfileField(
        realm=realm,
        name=str(field_data.name),
        field_type=CustomProfileField.EXTERNAL_ACCOUNT,
        hint=field_data.hint,
        field_data=orjson.dumps(dict(subtype=field_subtype)).decode(),
        display_in_profile_summary=display_in_profile_summary,
        required=required,
        editable_by_user=editable_by_user,
    )
    custom_profile_field.save()
    custom_profile_field.order = custom_profile_field.id
    custom_profile_field.save(update_fields=["order"])
    notify_realm_custom_profile_fields(realm)
    return custom_profile_field


@transaction.atomic(durable=True)
def try_add_realm_custom_profile_field(
    realm: Realm,
    name: str,
    field_type: int,
    hint: str = "",
    field_data: ProfileFieldData | None = None,
    display_in_profile_summary: bool = False,
    required: bool = False,
    editable_by_user: bool = True,
) -> CustomProfileField:
    custom_profile_field = CustomProfileField(
        realm=realm,
        name=name,
        field_type=field_type,
        display_in_profile_summary=display_in_profile_summary,
        required=required,
        editable_by_user=editable_by_user,
    )
    custom_profile_field.hint = hint
    if custom_profile_field.field_type in (
        CustomProfileField.SELECT,
        CustomProfileField.EXTERNAL_ACCOUNT,
    ):
        custom_profile_field.field_data = orjson.dumps(field_data or {}).decode()

    custom_profile_field.save()
    custom_profile_field.order = custom_profile_field.id
    custom_profile_field.save(update_fields=["order"])
    notify_realm_custom_profile_fields(realm)
    return custom_profile_field


@transaction.atomic(durable=True)
def do_remove_realm_custom_profile_field(realm: Realm, field: CustomProfileField) -> None:
    """
    Deleting a field will also delete the user profile data
    associated with it in CustomProfileFieldValue model.
    """
    field.delete()
    notify_realm_custom_profile_fields(realm)


def do_remove_realm_custom_profile_fields(realm: Realm) -> None:
    CustomProfileField.objects.filter(realm=realm).delete()


def remove_custom_profile_field_value_if_required(
    field: CustomProfileField, field_data: ProfileFieldData
) -> None:
    old_values = set(orjson.loads(field.field_data).keys())
    new_values = set(field_data.keys())
    removed_values = old_values - new_values

    if removed_values:
        CustomProfileFieldValue.objects.filter(field=field, value__in=removed_values).delete()


@transaction.atomic(durable=True)
def try_update_realm_custom_profile_field(
    realm: Realm,
    field: CustomProfileField,
    name: str | None = None,
    hint: str | None = None,
    field_data: ProfileFieldData | None = None,
    display_in_profile_summary: bool | None = None,
    required: bool | None = None,
    editable_by_user: bool | None = None,
) -> None:
    if name is not None:
        field.name = name
    if hint is not None:
        field.hint = hint
    if required is not None:
        field.required = required
    if editable_by_user is not None:
        field.editable_by_user = editable_by_user
    if display_in_profile_summary is not None:
        field.display_in_profile_summary = display_in_profile_summary

    if field.field_type in (
        CustomProfileField.SELECT,
        CustomProfileField.EXTERNAL_ACCOUNT,
    ):
        # If field_data is None, field_data is unchanged and there is no need for
        # comparing field_data values.
        if field_data is not None and field.field_type == CustomProfileField.SELECT:
            remove_custom_profile_field_value_if_required(field, field_data)

        # If field.field_data is the default empty string, we will set field_data
        # to an empty dict.
        if field_data is not None or field.field_data == "":
            field.field_data = orjson.dumps(field_data or {}).decode()
    field.save()
    notify_realm_custom_profile_fields(realm)


@transaction.atomic(durable=True)
def try_reorder_realm_custom_profile_fields(realm: Realm, order: Iterable[int]) -> None:
    order_mapping = {_[1]: _[0] for _ in enumerate(order)}
    custom_profile_fields = CustomProfileField.objects.filter(realm=realm)
    for custom_profile_field in custom_profile_fields:
        if custom_profile_field.id not in order_mapping:
            raise JsonableError(_("Invalid order mapping."))
    for custom_profile_field in custom_profile_fields:
        custom_profile_field.order = order_mapping[custom_profile_field.id]
        custom_profile_field.save(update_fields=["order"])
    notify_realm_custom_profile_fields(realm)


def notify_user_update_custom_profile_data(
    user_profile: UserProfile, field: dict[str, int | str | list[int] | None]
) -> None:
    data = dict(id=field["id"], value=field["value"])

    if field["rendered_value"]:
        data["rendered_value"] = field["rendered_value"]
    payload = dict(user_id=user_profile.id, custom_profile_field=data)
    event = dict(type="realm_user", op="update", person=payload)
    send_event_on_commit(user_profile.realm, event, get_user_ids_who_can_access_user(user_profile))


@transaction.atomic(savepoint=False)
def do_update_user_custom_profile_data_if_changed(
    user_profile: UserProfile,
    data: list[ProfileDataElementUpdateDict],
) -> None:
    for custom_profile_field in data:
        field_value, created = CustomProfileFieldValue.objects.get_or_create(
            user_profile=user_profile, field_id=custom_profile_field["id"]
        )

        # field_value.value is a TextField() so we need to have field["value"]
        # in string form to correctly make comparisons and assignments.
        if isinstance(custom_profile_field["value"], str):
            custom_profile_field_value_string = custom_profile_field["value"]
        else:
            custom_profile_field_value_string = orjson.dumps(custom_profile_field["value"]).decode()

        if not created and field_value.value == custom_profile_field_value_string:
            # If the field value isn't actually being changed to a different one,
            # we have nothing to do here for this field.
            continue

        field_value.value = custom_profile_field_value_string
        if field_value.field.is_renderable():
            field_value.rendered_value = render_stream_description(
                custom_profile_field_value_string, user_profile.realm
            )
            field_value.save(update_fields=["value", "rendered_value"])
        else:
            field_value.save(update_fields=["value"])
        notify_user_update_custom_profile_data(
            user_profile,
            {
                "id": field_value.field_id,
                "value": field_value.value,
                "rendered_value": field_value.rendered_value,
                "type": field_value.field.field_type,
            },
        )


@transaction.atomic(savepoint=False)
def check_remove_custom_profile_field_value(
    user_profile: UserProfile, field_id: int, acting_user: UserProfile
) -> None:
    try:
        custom_profile_field = CustomProfileField.objects.get(realm=user_profile.realm, id=field_id)
        if not acting_user.is_realm_admin and not custom_profile_field.editable_by_user:
            raise JsonableError(
                _(
                    "You are not allowed to change this field. Contact an administrator to update it."
                )
            )

        field_value = CustomProfileFieldValue.objects.get(
            field=custom_profile_field, user_profile=user_profile
        )
        field_value.delete()
        notify_user_update_custom_profile_data(
            user_profile,
            {
                "id": field_id,
                "value": None,
                "rendered_value": None,
                "type": custom_profile_field.field_type,
            },
        )
    except CustomProfileField.DoesNotExist:
        raise JsonableError(_("Field id {id} not found.").format(id=field_id))
    except CustomProfileFieldValue.DoesNotExist:
        pass
```

--------------------------------------------------------------------------------

---[FILE: data_import.py]---
Location: zulip-main/zerver/actions/data_import.py
Signals: Django

```python
import logging
import shutil
import tempfile
from typing import Any

from django.conf import settings

from confirmation import settings as confirmation_settings
from zerver.actions.create_realm import get_email_address_visibility_default
from zerver.actions.realm_settings import do_delete_all_realm_attachments
from zerver.actions.users import do_change_user_role
from zerver.context_processors import is_realm_import_enabled
from zerver.data_import.slack import do_convert_zipfile
from zerver.lib.exceptions import SlackImportInvalidFileError
from zerver.lib.import_realm import do_import_realm
from zerver.lib.upload import save_attachment_contents
from zerver.models.prereg_users import PreregistrationRealm
from zerver.models.realms import Realm
from zerver.models.users import RealmUserDefault, UserProfile, get_user_by_delivery_email

logger = logging.getLogger(__name__)


def import_slack_data(event: dict[str, Any]) -> None:
    # This is only possible if data imports were enqueued before the
    # setting was turned off.
    assert is_realm_import_enabled()

    preregistration_realm = PreregistrationRealm.objects.get(id=event["preregistration_realm_id"])
    string_id = preregistration_realm.string_id
    output_dir = tempfile.mkdtemp(
        prefix=f"import-{preregistration_realm.id}-converted-",
        dir=settings.IMPORT_TMPFILE_DIRECTORY,
    )

    try:
        with tempfile.NamedTemporaryFile(
            prefix=f"import-{preregistration_realm.id}-slack-",
            suffix=".zip",
            dir=settings.IMPORT_TMPFILE_DIRECTORY,
        ) as fh:
            save_attachment_contents(event["filename"], fh)
            fh.flush()
            do_convert_zipfile(
                fh.name,
                output_dir,
                event["slack_access_token"],
            )

            realm = do_import_realm(output_dir, string_id)
            realm.org_type = preregistration_realm.org_type
            realm.default_language = preregistration_realm.default_language
            realm.save()

            realm_user_default = RealmUserDefault.objects.get(realm=realm)
            realm_user_default.email_address_visibility = (
                preregistration_realm.data_import_metadata.get(
                    "email_address_visibility",
                    get_email_address_visibility_default(realm.org_type),
                )
            )
            realm_user_default.save(update_fields=["email_address_visibility"])

            # Set email address visibility for all users in the realm.
            UserProfile.objects.filter(realm=realm, is_bot=False).update(
                email_address_visibility=realm_user_default.email_address_visibility
            )

            # Try finding the user who imported this realm and make them owner.
            try:
                importing_user = get_user_by_delivery_email(preregistration_realm.email, realm)
                assert (
                    importing_user.is_active
                    and not importing_user.is_bot
                    and not importing_user.is_mirror_dummy
                )
                if importing_user.role != UserProfile.ROLE_REALM_OWNER:
                    do_change_user_role(
                        importing_user, UserProfile.ROLE_REALM_OWNER, acting_user=importing_user
                    )
                preregistration_realm.status = confirmation_settings.STATUS_USED
            except UserProfile.DoesNotExist:
                # If the email address that the importing user
                # validated with Zulip does not appear in the data
                # export, we will prompt them which account is theirs.
                preregistration_realm.data_import_metadata["need_select_realm_owner"] = True

            preregistration_realm.created_realm = realm
            preregistration_realm.data_import_metadata["is_import_work_queued"] = False
            preregistration_realm.save()
    except Exception as e:
        logger.exception(e)
        try:
            # Clean up the realm if the import failed
            preregistration_realm.created_realm = None
            preregistration_realm.data_import_metadata["is_import_work_queued"] = False
            if type(e) is SlackImportInvalidFileError:
                # Store the error to be displayed to the user.
                preregistration_realm.data_import_metadata["invalid_file_error_message"] = str(e)
            preregistration_realm.save()

            realm = Realm.objects.get(string_id=string_id)
            do_delete_all_realm_attachments(realm)
            realm.delete()
        except Realm.DoesNotExist:
            pass
        raise
    finally:
        shutil.rmtree(output_dir)
```

--------------------------------------------------------------------------------

---[FILE: default_streams.py]---
Location: zulip-main/zerver/actions/default_streams.py
Signals: Django

```python
from collections.abc import Iterable
from typing import Any

from django.db import transaction
from django.utils.translation import gettext as _

from zerver.lib.default_streams import get_default_stream_ids_for_realm
from zerver.lib.exceptions import JsonableError
from zerver.models import DefaultStream, DefaultStreamGroup, Realm, Stream
from zerver.models.streams import get_default_stream_groups
from zerver.models.users import active_non_guest_user_ids
from zerver.tornado.django_api import send_event_on_commit


def check_default_stream_group_name(group_name: str) -> None:
    if group_name.strip() == "":
        raise JsonableError(
            _("Invalid default channel group name '{group_name}'").format(group_name=group_name)
        )
    if len(group_name) > DefaultStreamGroup.MAX_NAME_LENGTH:
        raise JsonableError(
            _("Default channel group name too long (limit: {max_length} characters)").format(
                max_length=DefaultStreamGroup.MAX_NAME_LENGTH,
            )
        )
    for i in group_name:
        if ord(i) == 0:
            raise JsonableError(
                _(
                    "Default channel group name '{group_name}' contains NULL (0x00) characters."
                ).format(
                    group_name=group_name,
                )
            )


def lookup_default_stream_groups(
    default_stream_group_names: list[str], realm: Realm
) -> list[DefaultStreamGroup]:
    default_stream_groups = []
    for group_name in default_stream_group_names:
        try:
            default_stream_group = DefaultStreamGroup.objects.get(name=group_name, realm=realm)
        except DefaultStreamGroup.DoesNotExist:
            raise JsonableError(
                _("Invalid default channel group {group_name}").format(group_name=group_name)
            )
        default_stream_groups.append(default_stream_group)
    return default_stream_groups


def notify_default_streams(realm: Realm) -> None:
    event = dict(
        type="default_streams",
        default_streams=list(get_default_stream_ids_for_realm(realm.id)),
    )
    send_event_on_commit(realm, event, active_non_guest_user_ids(realm.id))


def notify_default_stream_groups(realm: Realm) -> None:
    event = dict(
        type="default_stream_groups",
        default_stream_groups=default_stream_groups_to_dicts_sorted(
            get_default_stream_groups(realm)
        ),
    )
    send_event_on_commit(realm, event, active_non_guest_user_ids(realm.id))


def do_add_default_stream(stream: Stream) -> None:
    realm_id = stream.realm_id
    stream_id = stream.id
    if not DefaultStream.objects.filter(realm_id=realm_id, stream_id=stream_id).exists():
        DefaultStream.objects.create(realm_id=realm_id, stream_id=stream_id)
        notify_default_streams(stream.realm)


@transaction.atomic(savepoint=False)
def do_remove_default_stream(stream: Stream) -> None:
    realm_id = stream.realm_id
    stream_id = stream.id
    DefaultStream.objects.filter(realm_id=realm_id, stream_id=stream_id).delete()
    notify_default_streams(stream.realm)


def do_create_default_stream_group(
    realm: Realm, group_name: str, description: str, streams: list[Stream]
) -> None:
    default_stream_ids = get_default_stream_ids_for_realm(realm.id)
    for stream in streams:
        if stream.id in default_stream_ids:
            raise JsonableError(
                _(
                    "'{channel_name}' is a default channel and cannot be added to '{group_name}'",
                ).format(channel_name=stream.name, group_name=group_name)
            )

    check_default_stream_group_name(group_name)
    (group, created) = DefaultStreamGroup.objects.get_or_create(
        name=group_name, realm=realm, description=description
    )
    if not created:
        raise JsonableError(
            _(
                "Default channel group '{group_name}' already exists",
            ).format(group_name=group_name)
        )

    group.streams.set(streams)
    notify_default_stream_groups(realm)


def do_add_streams_to_default_stream_group(
    realm: Realm, group: DefaultStreamGroup, streams: list[Stream]
) -> None:
    default_stream_ids = get_default_stream_ids_for_realm(realm.id)
    for stream in streams:
        if stream.id in default_stream_ids:
            raise JsonableError(
                _(
                    "'{channel_name}' is a default channel and cannot be added to '{group_name}'",
                ).format(channel_name=stream.name, group_name=group.name)
            )
        if stream in group.streams.all():
            raise JsonableError(
                _(
                    "Channel '{channel_name}' is already present in default channel group '{group_name}'",
                ).format(channel_name=stream.name, group_name=group.name)
            )
        group.streams.add(stream)

    group.save()
    notify_default_stream_groups(realm)


def do_remove_streams_from_default_stream_group(
    realm: Realm, group: DefaultStreamGroup, streams: list[Stream]
) -> None:
    group_stream_ids = {stream.id for stream in group.streams.all()}
    for stream in streams:
        if stream.id not in group_stream_ids:
            raise JsonableError(
                _(
                    "Channel '{channel_name}' is not present in default channel group '{group_name}'",
                ).format(channel_name=stream.name, group_name=group.name)
            )

    delete_stream_ids = {stream.id for stream in streams}

    group.streams.remove(*delete_stream_ids)
    notify_default_stream_groups(realm)


def do_change_default_stream_group_name(
    realm: Realm, group: DefaultStreamGroup, new_group_name: str
) -> None:
    if group.name == new_group_name:
        raise JsonableError(
            _("This default channel group is already named '{group_name}'").format(
                group_name=new_group_name
            )
        )

    if DefaultStreamGroup.objects.filter(name=new_group_name, realm=realm).exists():
        raise JsonableError(
            _("Default channel group '{group_name}' already exists").format(
                group_name=new_group_name
            )
        )

    group.name = new_group_name
    group.save()
    notify_default_stream_groups(realm)


def do_change_default_stream_group_description(
    realm: Realm, group: DefaultStreamGroup, new_description: str
) -> None:
    group.description = new_description
    group.save()
    notify_default_stream_groups(realm)


def do_remove_default_stream_group(realm: Realm, group: DefaultStreamGroup) -> None:
    group.delete()
    notify_default_stream_groups(realm)


def default_stream_groups_to_dicts_sorted(
    groups: Iterable[DefaultStreamGroup],
) -> list[dict[str, Any]]:
    return sorted((group.to_dict() for group in groups), key=lambda elt: elt["name"])
```

--------------------------------------------------------------------------------

````
