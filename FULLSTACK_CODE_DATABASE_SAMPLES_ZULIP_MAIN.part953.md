---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 953
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 953 of 1290)

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

---[FILE: 0553_copy_emoji_images.py]---
Location: zulip-main/zerver/migrations/0553_copy_emoji_images.py
Signals: Django

```python
import contextlib
import hashlib
import logging
import os
from collections.abc import Iterator
from typing import Any

import boto3
import botocore
import magic
import pyvips
from botocore.client import Config
from django.conf import settings
from django.db import migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps

from zerver.lib.mime_types import guess_extension

# From zerver.lib.thumbnail
DEFAULT_EMOJI_SIZE = 64
IMAGE_BOMB_TOTAL_PIXELS = 90000000
MAX_EMOJI_GIF_FILE_SIZE_BYTES = 128 * 1024 * 1024  # 128 kb

# This is the intersection of INLINE_MIME_TYPES and THUMBNAIL_ACCEPT_IMAGE_TYPES
VALID_EMOJI_CONTENT_TYPE = frozenset(
    [
        "image/avif",
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/webp",
    ]
)


class SkipImageError(Exception):
    pass


# From zerver.lib.thumbnail, with minor exception changes
@contextlib.contextmanager
def libvips_check_image(image_data: bytes) -> Iterator[pyvips.Image]:
    try:
        source_image = pyvips.Image.new_from_buffer(image_data, "")
    except pyvips.Error as e:
        raise SkipImageError(f"Cannot process image: {e}")

    if source_image.width * source_image.height > IMAGE_BOMB_TOTAL_PIXELS:
        raise SkipImageError(f"Image too big: {source_image.height} * {source_image.width}")

    try:
        yield source_image
    except pyvips.Error as e:
        raise SkipImageError(f"Bad image data? {e}")


# From zerver.lib.thumbnail, with minor exception changes
def resize_emoji(
    image_data: bytes, emoji_file_name: str, size: int = DEFAULT_EMOJI_SIZE
) -> tuple[bytes, bytes | None]:
    if len(image_data) > MAX_EMOJI_GIF_FILE_SIZE_BYTES:
        raise SkipImageError(f"Image has too many bytes: {len(image_data)}")

    # Square brackets are used for providing options to libvips' save
    # operation; the extension on the filename comes from reversing
    # the content-type, which removes most of the attacker control of
    # this string, but assert it has no bracketed pieces for safety.
    write_file_ext = os.path.splitext(emoji_file_name)[1]
    assert "[" not in write_file_ext

    # This function returns two values:
    # 1) Emoji image data.
    # 2) If it is animated, the still image data i.e. first frame of gif.
    with libvips_check_image(image_data) as source_image:
        if source_image.get_n_pages() == 1:
            return (
                pyvips.Image.thumbnail_buffer(
                    image_data,
                    size,
                    height=size,
                    crop=pyvips.Interesting.CENTRE,
                ).write_to_buffer(write_file_ext),
                None,
            )
        first_still = pyvips.Image.thumbnail_buffer(
            image_data,
            size,
            height=size,
            crop=pyvips.Interesting.CENTRE,
        ).write_to_buffer(".png")

        animated = pyvips.Image.thumbnail_buffer(
            image_data,
            size,
            height=size,
            # This is passed to the loader, and means "load all
            # frames", instead of the default of just the first
            option_string="n=-1",
        )
        if animated.width != animated.get("page-height"):
            # If the image is non-square, we have to iterate the
            # frames to add padding to make it so
            if not animated.hasalpha():
                animated = animated.addalpha()
            frames = [
                frame.gravity(
                    pyvips.CompassDirection.CENTRE,
                    size,
                    size,
                    extend=pyvips.Extend.BACKGROUND,
                    background=[0, 0, 0, 0],
                )
                for frame in animated.pagesplit()
            ]
            animated = frames[0].pagejoin(frames[1:])
        return (animated.write_to_buffer(write_file_ext), first_still)


# From zerver.lib.emoji
def get_emoji_file_name(content_type: str, emoji_id: int) -> str:
    image_ext = guess_extension(content_type, strict=False)
    # The only callsite of this pre-limits the content_type to a
    # reasonable set that we know have extensions.
    assert image_ext is not None

    # We salt this with a server-side secret so that it is not
    # enumerable by clients, and will not collide on the server.  New
    # realm imports may pass a synthetic emoji_id, which is fine as
    # long as it starts at 1, and as such later emoji cannot collide
    # unless there is a legit hash collision.
    #
    # We truncate the hash at 8 characters, as this is enough entropy
    # to make collisions vanishingly unlikely.  In the event of a
    # collusion, the id will advance and a manual retry will succeed.
    hash_key = settings.AVATAR_SALT.encode() + b":" + str(emoji_id).encode()
    return "".join((hashlib.sha256(hash_key).hexdigest()[0:8], image_ext))


def thumbnail_local_emoji(apps: StateApps) -> None:
    assert settings.LOCAL_AVATARS_DIR is not None
    for total_processed, emoji in enumerate(thumbnail_iterator(apps)):
        if total_processed % 100 == 0:
            print(f"Processed {total_processed} custom emoji")

        old_file_name = emoji.file_name
        try:
            base_path = os.path.join(
                settings.LOCAL_AVATARS_DIR, str(emoji.realm_id), "emoji/images"
            )
            copy_from_path = f"{base_path}/{old_file_name}.original"
            if not os.path.exists(copy_from_path) and os.path.exists(
                f"{base_path}/{old_file_name}"
            ):
                # Imports currently don't write ".original" files, so check without that
                copy_from_path = f"{base_path}/{old_file_name}"
                if not os.path.exists(copy_from_path):
                    raise SkipImageError("Failed to read .original file: Does not exist")

            with open(copy_from_path, "rb") as fh:
                original_bytes = fh.read()

            # We used to accept any bytes which pillow could
            # thumbnail, with any filename, and would use the
            # guessed-from-filename content-type when serving the
            # emoji.  Examine the bytes of the image to verify that it
            # is an image of reasonable type, and then derive the real
            # filename extension (which we will still use for deriving
            # content-type at serving time) from that.  This ensures
            # that the contents are a valid image, and that we put the
            # right content-type on it when served -- the filename
            # used for the initial upload becomes completely
            # irrelevant.
            content_type = magic.from_buffer(original_bytes[:1024], mime=True)

            if content_type not in VALID_EMOJI_CONTENT_TYPE:
                raise SkipImageError(f"Invalid content-type: {content_type}")

            new_file_name = get_emoji_file_name(content_type, emoji.id)
            if old_file_name == new_file_name:
                continue

            print(f"{base_path}/{old_file_name} -> {base_path}/{new_file_name}")
            try:
                if os.path.exists(f"{base_path}/{new_file_name}.original"):
                    os.unlink(f"{base_path}/{new_file_name}.original")
                os.link(copy_from_path, f"{base_path}/{new_file_name}.original")
            except OSError as e:
                raise SkipImageError(f"Failed to update .original file: {e}")

            animated, still = resize_emoji(original_bytes, new_file_name)
            try:
                with open(f"{base_path}/{new_file_name}", "wb") as fh:
                    fh.write(animated)

                if still is not None:
                    os.makedirs(f"{base_path}/still", exist_ok=True)
                    filename_no_extension = os.path.splitext(new_file_name)[0]
                    with open(f"{base_path}/still/{filename_no_extension}.png", "wb") as fh:
                        fh.write(still)
            except OSError as e:
                raise SkipImageError(f"Failed to write new file: {e}")

            emoji.file_name = new_file_name
            emoji.save(update_fields=["file_name"])
        except SkipImageError as e:
            logging.warning(
                "Failed to re-thumbnail emoji id %d with %s/emoji/images/%s: %s",
                emoji.id,
                emoji.realm_id,
                emoji.file_name,
                e,
            )
            new_file_name = get_emoji_file_name("image/png", emoji.id)
            try:
                with (
                    open(f"{settings.DEPLOY_ROOT}/static/images/bad-emoji.png", "rb") as f,
                    open(f"{base_path}/{new_file_name}", "wb") as new_f,
                ):
                    new_f.write(f.read())
                emoji.deactivated = True
                emoji.is_animated = False
                emoji.file_name = new_file_name
                emoji.save(update_fields=["file_name", "is_animated", "deactivated"])
            except Exception as e:
                logging.error("Failed to deactivate and replace with known-good image: %s", e)


def thumbnail_s3(apps: StateApps) -> None:
    total_processed = 0
    avatar_bucket = boto3.resource(
        "s3",
        aws_access_key_id=settings.S3_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        region_name=settings.S3_REGION,
        endpoint_url=settings.S3_ENDPOINT_URL,
        config=Config(
            signature_version=None,
            s3={"addressing_style": settings.S3_ADDRESSING_STYLE},
        ),
    ).Bucket(settings.S3_AVATAR_BUCKET)
    for total_processed, emoji in enumerate(thumbnail_iterator(apps)):
        if total_processed % 100 == 0:
            print(f"Processed {total_processed} custom emoji")

        old_file_name = emoji.file_name
        try:
            base_path = os.path.join(str(emoji.realm_id), "emoji/images")
            copy_from_path = f"{base_path}/{old_file_name}.original"
            try:
                old_data = avatar_bucket.Object(copy_from_path).get()
                original_bytes = old_data["Body"].read()
            except botocore.exceptions.ClientError:
                # Imports currently don't write ".original" files, so check without that
                try:
                    copy_from_path = f"{base_path}/{old_file_name}"
                    old_data = avatar_bucket.Object(f"{base_path}/{old_file_name}").get()
                except botocore.exceptions.ClientError as e:
                    raise SkipImageError(f"Failed to read .original file: {e}")
                original_bytes = old_data["Body"].read()

            # We used to accept any bytes which pillow could
            # thumbnail, with any filename, and would store the
            # guessed-from-filename content-type in S3, to be used
            # when serving the emoji.  Examine the bytes of the image
            # to verify that it is an image of reasonable type, and
            # then both store that content-type in S3 (for later
            # serving), as well as using it to derive the right
            # filename extension (for clarity).
            content_type = magic.from_buffer(original_bytes[:1024], mime=True)

            if content_type not in VALID_EMOJI_CONTENT_TYPE:
                raise SkipImageError(f"Invalid content-type: {content_type}")

            metadata = old_data["Metadata"]
            # Make sure this metadata is up-to-date, while we're
            # in here; some early emoji are missing it
            metadata["realm_id"] = str(emoji.realm_id)
            if emoji.author_id:
                metadata["user_profile_id"] = str(emoji.author_id)

            new_file_name = get_emoji_file_name(content_type, emoji.id)
            if old_file_name == new_file_name:
                continue

            print(f"{base_path}/{old_file_name} -> {base_path}/{new_file_name}")
            avatar_bucket.Object(f"{base_path}/{new_file_name}.original").copy_from(
                CopySource=f"{settings.S3_AVATAR_BUCKET}/{copy_from_path}",
                MetadataDirective="REPLACE",
                Metadata=metadata,
                ContentType=content_type,
                CacheControl="public, max-age=31536000, immutable",
            )

            animated, still = resize_emoji(original_bytes, new_file_name)
            try:
                avatar_bucket.Object(f"{base_path}/{new_file_name}").put(
                    Metadata=metadata,
                    ContentType=content_type,
                    CacheControl="public, max-age=31536000, immutable",
                    Body=animated,
                )
                if still is not None:
                    filename_no_extension = os.path.splitext(new_file_name)[0]
                    avatar_bucket.Object(f"{base_path}/still/{filename_no_extension}.png").put(
                        Metadata=metadata,
                        ContentType="image/png",
                        CacheControl="public, max-age=31536000, immutable",
                        Body=still,
                    )
            except botocore.exceptions.ClientError as e:
                raise SkipImageError(f"Failed to upload new file: {e}")

            emoji.file_name = new_file_name
            emoji.save(update_fields=["file_name"])
        except SkipImageError as e:
            logging.warning(
                "Failed to re-thumbnail emoji id %d with %s/emoji/images/%s: %s",
                emoji.id,
                emoji.realm_id,
                emoji.file_name,
                e,
            )
            new_file_name = get_emoji_file_name("image/png", emoji.id)
            try:
                with open(f"{settings.DEPLOY_ROOT}/static/images/bad-emoji.png", "rb") as f:
                    avatar_bucket.Object(f"{base_path}/{new_file_name}").put(
                        Metadata={
                            "user_profile_id": str(emoji.author_id),
                            "realm_id": str(emoji.realm_id),
                        },
                        ContentType="image/png",
                        CacheControl="public, max-age=31536000, immutable",
                        Body=f.read(),
                    )
                emoji.deactivated = True
                emoji.is_animated = False
                emoji.file_name = new_file_name
                emoji.save(update_fields=["file_name", "is_animated", "deactivated"])
            except Exception as e:
                logging.error("Failed to deactivate and replace with known-good image: %s", e)


def thumbnail_iterator(apps: StateApps) -> Iterator[Any]:
    Realm = apps.get_model("zerver", "Realm")
    RealmEmoji = apps.get_model("zerver", "RealmEmoji")
    for realm in Realm.objects.filter(realmemoji__isnull=False).distinct().order_by("id"):
        yield from RealmEmoji.objects.filter(realm=realm).order_by("id")


def thumbnail_emoji(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    if settings.LOCAL_AVATARS_DIR is not None:
        thumbnail_local_emoji(apps)
    else:
        thumbnail_s3(apps)


class Migration(migrations.Migration):
    atomic = False
    elidable = True

    dependencies = [
        ("zerver", "0552_remove_realm_private_message_policy"),
    ]

    operations = [migrations.RunPython(thumbnail_emoji, elidable=True)]
```

--------------------------------------------------------------------------------

---[FILE: 0554_imageattachment.py]---
Location: zulip-main/zerver/migrations/0554_imageattachment.py
Signals: Django

```python
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0553_copy_emoji_images"),
    ]

    operations = [
        migrations.CreateModel(
            name="ImageAttachment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("path_id", models.TextField(db_index=True, unique=True)),
                ("original_width_px", models.IntegerField()),
                ("original_height_px", models.IntegerField()),
                ("frames", models.IntegerField()),
                ("thumbnail_metadata", models.JSONField(default=list)),
                (
                    "realm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="zerver.realm"
                    ),
                ),
            ],
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0555_alter_onboardingstep_onboarding_step.py]---
Location: zulip-main/zerver/migrations/0555_alter_onboardingstep_onboarding_step.py
Signals: Django

```python
# Generated by Django 5.0.5 on 2024-04-23 07:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0554_imageattachment"),
    ]

    operations = [
        migrations.AlterField(
            model_name="onboardingstep",
            name="onboarding_step",
            field=models.CharField(max_length=40),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0556_alter_realmuserdefault_dense_mode_and_more.py]---
Location: zulip-main/zerver/migrations/0556_alter_realmuserdefault_dense_mode_and_more.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-18 00:06

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0555_alter_onboardingstep_onboarding_step"),
    ]

    operations = [
        migrations.AlterField(
            model_name="realmuserdefault",
            name="dense_mode",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="realmuserdefault",
            name="web_font_size_px",
            field=models.PositiveSmallIntegerField(default=16),
        ),
        migrations.AlterField(
            model_name="realmuserdefault",
            name="web_line_height_percent",
            field=models.PositiveSmallIntegerField(default=140),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="dense_mode",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="web_font_size_px",
            field=models.PositiveSmallIntegerField(default=16),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="web_line_height_percent",
            field=models.PositiveSmallIntegerField(default=140),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0557_change_information_density_defaults.py]---
Location: zulip-main/zerver/migrations/0557_change_information_density_defaults.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-17 15:10


from django.db import migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps


def set_default_values_for_information_density_settings(
    apps: StateApps, schema_editor: BaseDatabaseSchemaEditor
) -> None:
    """Set defaults for information density settings to their intended values."""
    RealmUserDefault = apps.get_model("zerver", "RealmUserDefault")
    UserProfile = apps.get_model("zerver", "UserProfile")

    WEB_FONT_SIZE_PX_DEFAULT = 16
    WEB_LINE_HEIGHT_PERCENT_DEFAULT = 140

    RealmUserDefault.objects.update(
        dense_mode=False,
        web_font_size_px=WEB_FONT_SIZE_PX_DEFAULT,
        web_line_height_percent=WEB_LINE_HEIGHT_PERCENT_DEFAULT,
    )
    UserProfile.objects.update(
        dense_mode=False,
        web_font_size_px=WEB_FONT_SIZE_PX_DEFAULT,
        web_line_height_percent=WEB_LINE_HEIGHT_PERCENT_DEFAULT,
    )


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("zerver", "0556_alter_realmuserdefault_dense_mode_and_more"),
    ]

    operations = [
        migrations.RunPython(
            set_default_values_for_information_density_settings,
            elidable=True,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0558_realmuserdefault_web_animate_image_previews_and_more.py]---
Location: zulip-main/zerver/migrations/0558_realmuserdefault_web_animate_image_previews_and_more.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-20 10:56

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0557_change_information_density_defaults"),
    ]

    operations = [
        migrations.AddField(
            model_name="realmuserdefault",
            name="web_animate_image_previews",
            field=models.TextField(default="on_hover"),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="web_animate_image_previews",
            field=models.TextField(default="on_hover"),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0559_realm_can_create_web_public_channel_group.py]---
Location: zulip-main/zerver/migrations/0559_realm_can_create_web_public_channel_group.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-01 11:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0558_realmuserdefault_web_animate_image_previews_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="can_create_web_public_channel_group",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="+",
                to="zerver.usergroup",
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0560_set_can_create_web_public_channel_group.py]---
Location: zulip-main/zerver/migrations/0560_set_can_create_web_public_channel_group.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-01 11:53

from django.db import migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps
from django.db.models import OuterRef


def set_can_create_web_public_channel_group_for_existing_realms(
    apps: StateApps, schema_editor: BaseDatabaseSchemaEditor
) -> None:
    Realm = apps.get_model("zerver", "Realm")
    NamedUserGroup = apps.get_model("zerver", "NamedUserGroup")

    ADMINS_ONLY = 2
    MODERATORS_ONLY = 4
    NOBODY = 6
    OWNERS_ONLY = 7

    Realm.objects.filter(
        can_create_web_public_channel_group=None, create_web_public_stream_policy=ADMINS_ONLY
    ).update(
        can_create_web_public_channel_group=NamedUserGroup.objects.filter(
            name="role:administrators", realm=OuterRef("id"), is_system_group=True
        ).values("pk")
    )
    Realm.objects.filter(
        can_create_web_public_channel_group=None, create_web_public_stream_policy=MODERATORS_ONLY
    ).update(
        can_create_web_public_channel_group=NamedUserGroup.objects.filter(
            name="role:moderators", realm=OuterRef("id"), is_system_group=True
        ).values("pk")
    )
    Realm.objects.filter(
        can_create_web_public_channel_group=None, create_web_public_stream_policy=NOBODY
    ).update(
        can_create_web_public_channel_group=NamedUserGroup.objects.filter(
            name="role:nobody", realm=OuterRef("id"), is_system_group=True
        ).values("pk")
    )
    Realm.objects.filter(
        can_create_web_public_channel_group=None, create_web_public_stream_policy=OWNERS_ONLY
    ).update(
        can_create_web_public_channel_group=NamedUserGroup.objects.filter(
            name="role:owners", realm=OuterRef("id"), is_system_group=True
        ).values("pk")
    )


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0559_realm_can_create_web_public_channel_group"),
    ]

    operations = [
        migrations.RunPython(
            set_can_create_web_public_channel_group_for_existing_realms,
            elidable=True,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0561_alter_realm_can_create_web_public_channel_group.py]---
Location: zulip-main/zerver/migrations/0561_alter_realm_can_create_web_public_channel_group.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-01 12:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0560_set_can_create_web_public_channel_group"),
    ]

    operations = [
        migrations.AlterField(
            model_name="realm",
            name="can_create_web_public_channel_group",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="+",
                to="zerver.usergroup",
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0562_remove_realm_create_web_public_stream_policy.py]---
Location: zulip-main/zerver/migrations/0562_remove_realm_create_web_public_stream_policy.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-26 07:18

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0561_alter_realm_can_create_web_public_channel_group"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="realm",
            name="create_web_public_stream_policy",
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0563_zulipinternal_can_delete.py]---
Location: zulip-main/zerver/migrations/0563_zulipinternal_can_delete.py
Signals: Django

```python
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0562_remove_realm_create_web_public_stream_policy"),
    ]

    operations = [
        migrations.RunSQL(
            "UPDATE zerver_realm SET delete_own_message_policy = 1 where string_id = 'zulipinternal'",
            elidable=True,
        )
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0564_purge_nagios_messages.py]---
Location: zulip-main/zerver/migrations/0564_purge_nagios_messages.py
Signals: Django

```python
import time

from django.conf import settings
from django.db import connection, migrations, transaction
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps
from psycopg2.sql import SQL, Literal


def purge_nagios_messages(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    Realm = apps.get_model("zerver", "Realm")
    UserProfile = apps.get_model("zerver", "UserProfile")

    with connection.cursor() as cursor:
        cursor.execute("SELECT MIN(id), MAX(id) FROM zerver_message")
        (min_id, _max_id) = cursor.fetchone()
        if min_id is None:
            return

        bot_realm = Realm.objects.get(string_id=settings.SYSTEM_BOT_REALM)
        nagios_bot_tuples = [
            (settings.NAGIOS_SEND_BOT, settings.NAGIOS_RECEIVE_BOT),
            (settings.NAGIOS_STAGING_SEND_BOT, settings.NAGIOS_STAGING_RECEIVE_BOT),
        ]
        for sender_email, recipient_email in nagios_bot_tuples:
            try:
                sender_id = UserProfile.objects.get(
                    delivery_email=sender_email, realm_id=bot_realm.id
                ).id
                recipient_id = UserProfile.objects.get(
                    delivery_email=recipient_email, realm_id=bot_realm.id
                ).recipient_id
            except UserProfile.DoesNotExist:
                # If these special users don't exist, there's nothing to do.
                continue

            batch_size = 10000
            while True:
                with transaction.atomic():
                    # This query is an index only scan of the
                    # zerver_message_realm_sender_recipient_id index
                    message_id_query = SQL(
                        """
                        SELECT id
                          FROM zerver_message
                         WHERE realm_id = {realm_id}
                           AND sender_id = {sender_id}
                           AND recipient_id = {recipient_id}
                         ORDER BY id ASC
                         LIMIT {batch_size}
                           FOR UPDATE
                        """
                    ).format(
                        realm_id=Literal(bot_realm.id),
                        sender_id=Literal(sender_id),
                        recipient_id=Literal(recipient_id),
                        batch_size=Literal(batch_size),
                    )
                    cursor.execute(message_id_query)
                    message_ids = [id for (id,) in cursor.fetchall()]

                    if not message_ids:
                        break

                    message_id_str = SQL(",").join(map(Literal, message_ids))
                    cursor.execute(
                        SQL(
                            "DELETE FROM zerver_usermessage WHERE message_id IN ({message_ids})"
                        ).format(message_ids=message_id_str)
                    )
                    # We do not expect any attachments, but for
                    # correctness, we ensure they are detached before
                    # deleting the messages
                    cursor.execute(
                        SQL(
                            "DELETE FROM zerver_attachment_messages WHERE message_id IN ({message_ids})"
                        ).format(message_ids=message_id_str)
                    )
                    cursor.execute(
                        SQL("DELETE FROM zerver_message WHERE id IN ({message_ids})").format(
                            message_ids=message_id_str
                        )
                    )

                time.sleep(0.1)


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("zerver", "0563_zulipinternal_can_delete"),
    ]

    operations = [migrations.RunPython(purge_nagios_messages, elidable=True)]
```

--------------------------------------------------------------------------------

---[FILE: 0565_realm_can_delete_any_message_group.py]---
Location: zulip-main/zerver/migrations/0565_realm_can_delete_any_message_group.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-18 15:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0564_purge_nagios_messages"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="can_delete_any_message_group",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="+",
                to="zerver.usergroup",
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0566_set_default_for_can_delete_any_message_group.py]---
Location: zulip-main/zerver/migrations/0566_set_default_for_can_delete_any_message_group.py
Signals: Django

```python
# Generated by Django 4.2.1 on 2023-06-12 10:47

from django.db import migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps
from django.db.models import OuterRef


def set_default_value_for_can_delete_any_message_group(
    apps: StateApps, schema_editor: BaseDatabaseSchemaEditor
) -> None:
    Realm = apps.get_model("zerver", "Realm")
    NamedUserGroup = apps.get_model("zerver", "NamedUserGroup")

    ADMINISTRATORS_GROUP_NAME = "role:administrators"

    Realm.objects.filter(
        can_delete_any_message_group=None,
    ).update(
        can_delete_any_message_group=NamedUserGroup.objects.filter(
            name=ADMINISTRATORS_GROUP_NAME, realm=OuterRef("id"), is_system_group=True
        ).values("pk")
    )


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("zerver", "0565_realm_can_delete_any_message_group"),
    ]

    operations = [
        migrations.RunPython(
            set_default_value_for_can_delete_any_message_group,
            elidable=True,
            reverse_code=migrations.RunPython.noop,
        )
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0567_alter_realm_can_delete_any_message_group.py]---
Location: zulip-main/zerver/migrations/0567_alter_realm_can_delete_any_message_group.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-18 15:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0566_set_default_for_can_delete_any_message_group"),
    ]

    operations = [
        migrations.AlterField(
            model_name="realm",
            name="can_delete_any_message_group",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="+",
                to="zerver.usergroup",
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0568_mark_narrow_to_dm_with_welcome_bot_new_user_as_read.py]---
Location: zulip-main/zerver/migrations/0568_mark_narrow_to_dm_with_welcome_bot_new_user_as_read.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-25 13:24

from django.db import connection, migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps
from django.utils.timezone import now as timezone_now
from psycopg2.sql import SQL


def mark_narrow_to_dm_with_welcome_bot_new_user_as_read(
    apps: StateApps, schema_editor: BaseDatabaseSchemaEditor
) -> None:
    with connection.cursor() as cursor:
        cursor.execute(SQL("SELECT MAX(id) FROM zerver_userprofile;"))
        (max_id,) = cursor.fetchone()

    if max_id is None:
        return

    BATCH_SIZE = 10000
    max_id += BATCH_SIZE / 2
    lower_id_bound = 0
    timestamp_value = timezone_now()
    while lower_id_bound < max_id:
        upper_id_bound = min(lower_id_bound + BATCH_SIZE, max_id)
        with connection.cursor() as cursor:
            query = SQL("""
                INSERT INTO zerver_onboardingstep (user_id, onboarding_step, timestamp)
                SELECT id, 'narrow_to_dm_with_welcome_bot_new_user', %(timestamp_value)s
                FROM zerver_userprofile
                WHERE is_bot = False
                AND is_mirror_dummy = False
                AND tutorial_status != 'W'
                AND id > %(lower_id_bound)s AND id <= %(upper_id_bound)s;
                """)
            cursor.execute(
                query,
                {
                    "timestamp_value": timestamp_value,
                    "lower_id_bound": lower_id_bound,
                    "upper_id_bound": upper_id_bound,
                },
            )

        print(f"Processed {upper_id_bound} / {max_id}")
        lower_id_bound += BATCH_SIZE


def mark_narrow_to_dm_with_welcome_bot_new_user_as_unread(
    apps: StateApps, schema_editor: BaseDatabaseSchemaEditor
) -> None:
    OnboardingStep = apps.get_model("zerver", "OnboardingStep")

    OnboardingStep.objects.filter(onboarding_step="narrow_to_dm_with_welcome_bot_new_user").delete()


class Migration(migrations.Migration):
    atomic = False
    dependencies = [
        ("zerver", "0567_alter_realm_can_delete_any_message_group"),
    ]

    operations = [
        migrations.RunPython(
            mark_narrow_to_dm_with_welcome_bot_new_user_as_read,
            reverse_code=mark_narrow_to_dm_with_welcome_bot_new_user_as_unread,
            elidable=True,
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0569_remove_userprofile_tutorial_status.py]---
Location: zulip-main/zerver/migrations/0569_remove_userprofile_tutorial_status.py
Signals: Django

```python
# Generated by Django 5.0.6 on 2024-07-25 06:59

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0568_mark_narrow_to_dm_with_welcome_bot_new_user_as_read"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="userprofile",
            name="tutorial_status",
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0570_namedusergroup_can_manage_group.py]---
Location: zulip-main/zerver/migrations/0570_namedusergroup_can_manage_group.py
Signals: Django

```python
# Generated by Django 4.2.2 on 2023-07-15 16:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0569_remove_userprofile_tutorial_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="namedusergroup",
            name="can_manage_group",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="+",
                to="zerver.usergroup",
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0571_set_default_for_can_manage_group.py]---
Location: zulip-main/zerver/migrations/0571_set_default_for_can_manage_group.py
Signals: Django

```python
# Generated by Django 4.2.2 on 2023-07-15 17:08

from django.db import migrations, transaction
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps
from django.db.models import Max, Min, OuterRef


def set_default_value_for_can_manage_group(
    apps: StateApps, schema_editor: BaseDatabaseSchemaEditor
) -> None:
    NamedUserGroup = apps.get_model("zerver", "NamedUserGroup")

    BATCH_SIZE = 1000
    max_id = NamedUserGroup.objects.filter(can_manage_group=None).aggregate(Max("id"))["id__max"]

    if max_id is None:
        # Do nothing if there are no user groups on the server.
        return

    lower_bound = NamedUserGroup.objects.filter(can_manage_group=None).aggregate(Min("id"))[
        "id__min"
    ]
    while lower_bound <= max_id:
        upper_bound = lower_bound + BATCH_SIZE - 1
        print(f"Processing batch {lower_bound} to {upper_bound} for NamedUserGroup")

        with transaction.atomic():
            NamedUserGroup.objects.filter(
                id__range=(lower_bound, upper_bound), can_manage_group=None
            ).update(
                can_manage_group=NamedUserGroup.objects.filter(
                    name="role:nobody",
                    realm_for_sharding=OuterRef("realm_for_sharding"),
                    is_system_group=True,
                ).values("pk")
            )

        lower_bound += BATCH_SIZE


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("zerver", "0570_namedusergroup_can_manage_group"),
    ]

    operations = [
        migrations.RunPython(
            set_default_value_for_can_manage_group,
            elidable=True,
            reverse_code=migrations.RunPython.noop,
        )
    ]
```

--------------------------------------------------------------------------------

````
