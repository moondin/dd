---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 934
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 934 of 1290)

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

---[FILE: 0029_realm_subdomain.py]---
Location: zulip-main/zerver/migrations/0029_realm_subdomain.py
Signals: Django

```python
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db import migrations, models
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps


def set_subdomain_of_default_realm(
    apps: StateApps, schema_editor: BaseDatabaseSchemaEditor
) -> None:
    if settings.DEVELOPMENT:
        Realm = apps.get_model("zerver", "Realm")
        try:
            default_realm = Realm.objects.get(domain="zulip.com")
        except ObjectDoesNotExist:
            default_realm = None

        if default_realm is not None:
            default_realm.subdomain = "zulip"
            default_realm.save()


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="subdomain",
            field=models.CharField(max_length=40, unique=True, null=True),
        ),
        migrations.RunPython(set_subdomain_of_default_realm, elidable=True),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0030_realm_org_type.py]---
Location: zulip-main/zerver/migrations/0030_realm_org_type.py
Signals: Django

```python
from django.db import migrations, models

CORPORATE = 1


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0029_realm_subdomain"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="org_type",
            field=models.PositiveSmallIntegerField(default=CORPORATE),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0031_remove_system_avatar_source.py]---
Location: zulip-main/zerver/migrations/0031_remove_system_avatar_source.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0030_realm_org_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="avatar_source",
            field=models.CharField(
                choices=[("G", "Hosted by Gravatar"), ("U", "Uploaded by user")],
                max_length=1,
                default="G",
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0032_verify_all_medium_avatar_images.py]---
Location: zulip-main/zerver/migrations/0032_verify_all_medium_avatar_images.py
Signals: Django

```python
import hashlib
from unittest.mock import patch

from django.conf import settings
from django.db import migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps

from zerver.lib.upload import ensure_avatar_image
from zerver.models import UserProfile


# We hackishly patch this function in order to revert it to the state
# it had when this migration was first written.  This is a balance
# between copying in a historical version of hundreds of lines of code
# from zerver.lib.upload (which would pretty annoying, but would be a
# pain) and just using the current version, which doesn't work
# since we rearranged the avatars in Zulip 1.6.
def patched_user_avatar_path(user_profile: UserProfile) -> str:
    email = user_profile.email
    user_key = email.lower() + settings.AVATAR_SALT
    return hashlib.sha1(user_key.encode()).hexdigest()


@patch("zerver.lib.upload.user_avatar_path", patched_user_avatar_path)
def verify_medium_avatar_image(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    user_profile_model = apps.get_model("zerver", "UserProfile")
    for user_profile in user_profile_model.objects.filter(avatar_source="U"):
        ensure_avatar_image(user_profile, medium=True)


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0031_remove_system_avatar_source"),
    ]

    operations = [
        migrations.RunPython(verify_medium_avatar_image, elidable=True),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0033_migrate_domain_to_realmalias.py]---
Location: zulip-main/zerver/migrations/0033_migrate_domain_to_realmalias.py
Signals: Django

```python
from django.db import migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps


def add_domain_to_realm_alias_if_needed(
    apps: StateApps, schema_editor: BaseDatabaseSchemaEditor
) -> None:
    Realm = apps.get_model("zerver", "Realm")
    RealmAlias = apps.get_model("zerver", "RealmAlias")

    for realm in Realm.objects.all().iterator():
        # if realm.domain already exists in RealmAlias, assume it is correct
        if not RealmAlias.objects.filter(domain=realm.domain).exists():
            RealmAlias.objects.create(realm=realm, domain=realm.domain)


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0032_verify_all_medium_avatar_images"),
    ]

    operations = [
        migrations.RunPython(add_domain_to_realm_alias_if_needed, elidable=True),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0034_userprofile_enable_online_push_notifications.py]---
Location: zulip-main/zerver/migrations/0034_userprofile_enable_online_push_notifications.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0033_migrate_domain_to_realmalias"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="enable_online_push_notifications",
            field=models.BooleanField(default=False),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0035_realm_message_retention_period_days.py]---
Location: zulip-main/zerver/migrations/0035_realm_message_retention_period_days.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0034_userprofile_enable_online_push_notifications"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="message_retention_days",
            field=models.IntegerField(null=True),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0036_rename_subdomain_to_string_id.py]---
Location: zulip-main/zerver/migrations/0036_rename_subdomain_to_string_id.py
Signals: Django

```python
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0035_realm_message_retention_period_days"),
    ]

    operations = [
        migrations.RenameField(
            model_name="realm",
            old_name="subdomain",
            new_name="string_id",
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0037_disallow_null_string_id.py]---
Location: zulip-main/zerver/migrations/0037_disallow_null_string_id.py
Signals: Django

```python
from django.db import migrations, models
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps
from django.db.utils import IntegrityError


def set_string_id_using_domain(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    Realm = apps.get_model("zerver", "Realm")
    for realm in Realm.objects.all().iterator():
        if not realm.string_id:
            prefix = realm.domain.split(".")[0]
            try:
                realm.string_id = prefix
                realm.save(update_fields=["string_id"])
                continue
            except IntegrityError:
                pass
            for i in range(1, 100):
                try:
                    realm.string_id = prefix + str(i)
                    realm.save(update_fields=["string_id"])
                    break
                except IntegrityError:
                    pass
            else:
                raise RuntimeError(f"Unable to find a good string_id for realm {realm}")


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0036_rename_subdomain_to_string_id"),
    ]

    operations = [
        migrations.RunPython(set_string_id_using_domain, elidable=True),
        migrations.AlterField(
            model_name="realm",
            name="string_id",
            field=models.CharField(unique=True, max_length=40),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0038_realm_change_to_community_defaults.py]---
Location: zulip-main/zerver/migrations/0038_realm_change_to_community_defaults.py
Signals: Django

```python
from django.db import migrations, models

COMMUNITY = 2


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0037_disallow_null_string_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="realm",
            name="invite_required",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="realm",
            name="org_type",
            field=models.PositiveSmallIntegerField(default=COMMUNITY),
        ),
        migrations.AlterField(
            model_name="realm",
            name="restricted_to_domain",
            field=models.BooleanField(default=False),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0039_realmalias_drop_uniqueness.py]---
Location: zulip-main/zerver/migrations/0039_realmalias_drop_uniqueness.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0038_realm_change_to_community_defaults"),
    ]

    operations = [
        migrations.AlterField(
            model_name="realmalias",
            name="domain",
            field=models.CharField(max_length=80, db_index=True),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0040_realm_authentication_methods.py]---
Location: zulip-main/zerver/migrations/0040_realm_authentication_methods.py
Signals: Django

```python
import bitfield.models
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0039_realmalias_drop_uniqueness"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="authentication_methods",
            field=bitfield.models.BitField(
                ["Google", "Email", "GitHub", "LDAP", "Dev", "RemoteUser"], default=2147483647
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0041_create_attachments_for_old_messages.py]---
Location: zulip-main/zerver/migrations/0041_create_attachments_for_old_messages.py
Signals: Django

```python
import os
import re

from django.db import migrations, models
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps

attachment_url_re = re.compile(r"[/\-]user[\-_]uploads[/\.-].*?(?=[ )]|\Z)")


def attachment_url_to_path_id(attachment_url: str) -> str:
    path_id_raw = re.sub(r"[/\-]user[\-_]uploads[/\.-]", "", attachment_url)
    # Remove any extra '.' after file extension. These are probably added by the user
    return re.sub(r"[.]+$", "", path_id_raw, flags=re.MULTILINE)


def check_and_create_attachments(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    STREAM = 2
    Message = apps.get_model("zerver", "Message")
    Attachment = apps.get_model("zerver", "Attachment")
    Stream = apps.get_model("zerver", "Stream")
    for message in Message.objects.filter(has_attachment=True, attachment=None):
        attachment_url_list = attachment_url_re.findall(message.content)
        for url in attachment_url_list:
            path_id = attachment_url_to_path_id(url)
            user_profile = message.sender
            is_message_realm_public = False
            if message.recipient.type == STREAM:
                stream = Stream.objects.get(id=message.recipient.type_id)
                is_message_realm_public = (
                    not stream.invite_only and stream.realm.domain != "mit.edu"
                )

            if path_id is not None:
                attachment = Attachment.objects.create(
                    file_name=os.path.basename(path_id),
                    path_id=path_id,
                    owner=user_profile,
                    realm=user_profile.realm,
                    is_realm_public=is_message_realm_public,
                )
                attachment.messages.add(message)


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0040_realm_authentication_methods"),
    ]

    operations = [
        # The TextField change was originally in the next migration,
        # but because it fixes a problem that causes the RunPython
        # part of this migration to crash, we've copied it here.
        migrations.AlterField(
            model_name="attachment",
            name="file_name",
            field=models.TextField(db_index=True),
        ),
        migrations.RunPython(check_and_create_attachments, elidable=True),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0042_attachment_file_name_length.py]---
Location: zulip-main/zerver/migrations/0042_attachment_file_name_length.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0041_create_attachments_for_old_messages"),
    ]

    operations = [
        migrations.AlterField(
            model_name="attachment",
            name="file_name",
            field=models.TextField(db_index=True),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0043_realm_filter_validators.py]---
Location: zulip-main/zerver/migrations/0043_realm_filter_validators.py
Signals: Django

```python
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0042_attachment_file_name_length"),
    ]

    operations = []
```

--------------------------------------------------------------------------------

---[FILE: 0044_reaction.py]---
Location: zulip-main/zerver/migrations/0044_reaction.py
Signals: Django

```python
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0043_realm_filter_validators"),
    ]

    operations = [
        migrations.CreateModel(
            name="Reaction",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID", serialize=False, auto_created=True, primary_key=True
                    ),
                ),
                (
                    "user_profile",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
                    ),
                ),
                (
                    "message",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="zerver.Message"
                    ),
                ),
                ("emoji_name", models.TextField()),
            ],
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name="reaction",
            unique_together={("user_profile", "message", "emoji_name")},
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0045_realm_waiting_period_threshold.py]---
Location: zulip-main/zerver/migrations/0045_realm_waiting_period_threshold.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0044_reaction"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="waiting_period_threshold",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0046_realmemoji_author.py]---
Location: zulip-main/zerver/migrations/0046_realmemoji_author.py
Signals: Django

```python
# Generated by Django 1.10.4 on 2016-12-20 07:02
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0045_realm_waiting_period_threshold"),
    ]

    operations = [
        migrations.AddField(
            model_name="realmemoji",
            name="author",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0047_realm_add_emoji_by_admins_only.py]---
Location: zulip-main/zerver/migrations/0047_realm_add_emoji_by_admins_only.py
Signals: Django

```python
# Generated by Django 1.10.4 on 2016-12-20 13:45
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0046_realmemoji_author"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="add_emoji_by_admins_only",
            field=models.BooleanField(default=False),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0048_enter_sends_default_to_false.py]---
Location: zulip-main/zerver/migrations/0048_enter_sends_default_to_false.py
Signals: Django

```python
# Generated by Django 1.10.4 on 2016-12-29 02:18
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0047_realm_add_emoji_by_admins_only"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="enter_sends",
            field=models.BooleanField(null=True, default=False),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0049_userprofile_pm_content_in_desktop_notifications.py]---
Location: zulip-main/zerver/migrations/0049_userprofile_pm_content_in_desktop_notifications.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0048_enter_sends_default_to_false"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="pm_content_in_desktop_notifications",
            field=models.BooleanField(default=True),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0050_userprofile_avatar_version.py]---
Location: zulip-main/zerver/migrations/0050_userprofile_avatar_version.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-01-23 17:44
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0049_userprofile_pm_content_in_desktop_notifications"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="avatar_version",
            field=models.PositiveSmallIntegerField(default=1),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0051_realmalias_add_allow_subdomains.py]---
Location: zulip-main/zerver/migrations/0051_realmalias_add_allow_subdomains.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-01-25 20:55
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0050_userprofile_avatar_version"),
    ]

    operations = [
        migrations.AddField(
            model_name="realmalias",
            name="allow_subdomains",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterUniqueTogether(
            name="realmalias",
            unique_together={("realm", "domain")},
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0052_auto_fix_realmalias_realm_nullable.py]---
Location: zulip-main/zerver/migrations/0052_auto_fix_realmalias_realm_nullable.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-02-11 03:07
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0051_realmalias_add_allow_subdomains"),
    ]

    operations = [
        migrations.AlterField(
            model_name="realmalias",
            name="realm",
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="zerver.Realm"),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0053_emailchangestatus.py]---
Location: zulip-main/zerver/migrations/0053_emailchangestatus.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-02-23 05:37
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0052_auto_fix_realmalias_realm_nullable"),
    ]

    operations = [
        migrations.CreateModel(
            name="EmailChangeStatus",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("new_email", models.EmailField(max_length=254)),
                ("old_email", models.EmailField(max_length=254)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("status", models.IntegerField(default=0)),
                (
                    "realm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="zerver.Realm"
                    ),
                ),
                (
                    "user_profile",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0054_realm_icon.py]---
Location: zulip-main/zerver/migrations/0054_realm_icon.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-02-15 06:18
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0053_emailchangestatus"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="icon_source",
            field=models.CharField(
                choices=[("G", "Hosted by Gravatar"), ("U", "Uploaded by administrator")],
                default="G",
                max_length=1,
            ),
        ),
        migrations.AddField(
            model_name="realm",
            name="icon_version",
            field=models.PositiveSmallIntegerField(default=1),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0055_attachment_size.py]---
Location: zulip-main/zerver/migrations/0055_attachment_size.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-03-01 06:28
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0054_realm_icon"),
    ]

    operations = [
        migrations.AddField(
            model_name="attachment",
            name="size",
            field=models.IntegerField(null=True),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0056_userprofile_emoji_alt_code.py]---
Location: zulip-main/zerver/migrations/0056_userprofile_emoji_alt_code.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-03-02 07:28
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0055_attachment_size"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="emoji_alt_code",
            field=models.BooleanField(default=False),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0057_realmauditlog.py]---
Location: zulip-main/zerver/migrations/0057_realmauditlog.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-03-04 07:33
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps
from django.utils.timezone import now as timezone_now


def backfill_user_activations_and_deactivations(
    apps: StateApps, schema_editor: BaseDatabaseSchemaEditor
) -> None:
    migration_time = timezone_now()
    RealmAuditLog = apps.get_model("zerver", "RealmAuditLog")
    UserProfile = apps.get_model("zerver", "UserProfile")

    for user in UserProfile.objects.all().iterator():
        RealmAuditLog.objects.create(
            realm=user.realm,
            modified_user=user,
            event_type="user_created",
            event_time=user.date_joined,
            backfilled=False,
        )

    for user in UserProfile.objects.filter(is_active=False):
        RealmAuditLog.objects.create(
            realm=user.realm,
            modified_user=user,
            event_type="user_deactivated",
            event_time=migration_time,
            backfilled=True,
        )


def reverse_code(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    RealmAuditLog = apps.get_model("zerver", "RealmAuditLog")
    RealmAuditLog.objects.filter(event_type="user_created").delete()
    RealmAuditLog.objects.filter(event_type="user_deactivated").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0056_userprofile_emoji_alt_code"),
    ]

    operations = [
        migrations.CreateModel(
            name="RealmAuditLog",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("event_type", models.CharField(max_length=40)),
                ("backfilled", models.BooleanField(default=False)),
                ("event_time", models.DateTimeField()),
                (
                    "acting_user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "modified_stream",
                    models.ForeignKey(
                        null=True, on_delete=django.db.models.deletion.CASCADE, to="zerver.Stream"
                    ),
                ),
                (
                    "modified_user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "realm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="zerver.Realm"
                    ),
                ),
            ],
        ),
        migrations.RunPython(
            backfill_user_activations_and_deactivations, reverse_code=reverse_code, elidable=True
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0058_realm_email_changes_disabled.py]---
Location: zulip-main/zerver/migrations/0058_realm_email_changes_disabled.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-02-27 14:34
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0057_realmauditlog"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="email_changes_disabled",
            field=models.BooleanField(default=False),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0059_userprofile_quota.py]---
Location: zulip-main/zerver/migrations/0059_userprofile_quota.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-03-04 07:40
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0058_realm_email_changes_disabled"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="quota",
            field=models.IntegerField(default=1073741824),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0060_move_avatars_to_be_uid_based.py]---
Location: zulip-main/zerver/migrations/0060_move_avatars_to_be_uid_based.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-02-27 17:03
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0059_userprofile_quota"),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0061_userprofile_timezone.py]---
Location: zulip-main/zerver/migrations/0061_userprofile_timezone.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-03-15 11:43
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0060_move_avatars_to_be_uid_based"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="timezone",
            field=models.CharField(default="UTC", max_length=40),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0062_default_timezone.py]---
Location: zulip-main/zerver/migrations/0062_default_timezone.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-03-16 12:22
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0061_userprofile_timezone"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="timezone",
            field=models.CharField(default="", max_length=40),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0063_realm_description.py]---
Location: zulip-main/zerver/migrations/0063_realm_description.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-03-19 19:06
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0062_default_timezone"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="description",
            field=models.TextField(max_length=100, null=True),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0064_sync_uploads_filesize_with_db.py]---
Location: zulip-main/zerver/migrations/0064_sync_uploads_filesize_with_db.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-03-18 12:38
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0063_realm_description"),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0065_realm_inline_image_preview.py]---
Location: zulip-main/zerver/migrations/0065_realm_inline_image_preview.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-03-21 15:56
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0064_sync_uploads_filesize_with_db"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="inline_image_preview",
            field=models.BooleanField(default=True),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0066_realm_inline_url_embed_preview.py]---
Location: zulip-main/zerver/migrations/0066_realm_inline_url_embed_preview.py
Signals: Django

```python
# Generated by Django 1.10.5 on 2017-03-21 15:58
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0065_realm_inline_image_preview"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="inline_url_embed_preview",
            field=models.BooleanField(default=True),
        ),
    ]
```

--------------------------------------------------------------------------------

````
