---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 923
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 923 of 1290)

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

---[FILE: __init__.py]---
Location: zulip-main/zerver/lib/upload/__init__.py
Signals: Django

```python
import io
import logging
import os
import re
import unicodedata
from collections.abc import Callable, Iterator
from datetime import datetime
from email.message import EmailMessage
from typing import IO, Any
from urllib.parse import unquote, urljoin

import chardet
import pyvips
from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
from django.db import transaction
from django.utils.translation import gettext as _

from zerver.lib.avatar_hash import user_avatar_base_path_from_ids, user_avatar_path
from zerver.lib.exceptions import ErrorCode, JsonableError
from zerver.lib.mime_types import INLINE_MIME_TYPES, bare_content_type, guess_type
from zerver.lib.outgoing_http import OutgoingSession
from zerver.lib.thumbnail import (
    MAX_EMOJI_GIF_FILE_SIZE_BYTES,
    MEDIUM_AVATAR_SIZE,
    THUMBNAIL_ACCEPT_IMAGE_TYPES,
    BadImageError,
    maybe_thumbnail,
    resize_avatar,
    resize_emoji,
)
from zerver.lib.upload.base import StreamingSourceWithSize, ZulipUploadBackend
from zerver.models import Attachment, Message, Realm, RealmEmoji, ScheduledMessage, UserProfile
from zerver.models.users import is_cross_realm_bot_email


class RealmUploadQuotaError(JsonableError):
    code = ErrorCode.REALM_UPLOAD_QUOTA


def check_upload_within_quota(realm: Realm, uploaded_file_size: int) -> None:
    upload_quota = realm.upload_quota_bytes()
    if upload_quota is None:
        return
    used_space = realm.currently_used_upload_space_bytes()
    if (used_space + uploaded_file_size) > upload_quota:
        raise RealmUploadQuotaError(_("Upload would exceed your organization's upload quota."))


def maybe_add_charset(content_type: str, file_data: bytes | StreamingSourceWithSize) -> str:
    # We only add a charset if it doesn't already have one, and is a
    # text type which we serve inline; currently, this is only text/plain.
    fake_msg = EmailMessage()
    fake_msg["content-type"] = content_type
    if (
        fake_msg.get_content_maintype() != "text"
        or fake_msg.get_content_type() not in INLINE_MIME_TYPES
        or fake_msg.get_content_charset() is not None
    ):
        return content_type

    early_abort = False
    if isinstance(file_data, bytes):
        detected = chardet.detect(file_data)
    else:
        chunk_size = 4096
        reader = file_data.reader()
        detector = chardet.universaldetector.UniversalDetector()
        total_read = 0
        while True:
            data = reader.read(chunk_size)
            detector.feed(data)
            if detector.done or len(data) < chunk_size:
                break
            total_read += chunk_size
            if total_read >= 32 * 1024:
                # If there's no BOM and no high bytes, the detector
                # never says "done" before EOF -- we bail out
                # arbitrarily at 32k.
                early_abort = True
                break
        detector.close()
        reader.close()
        detected = detector.result
    if early_abort and detected["confidence"] == 1.0 and detected["encoding"] == "ascii":
        # An early abort which didn't see high-byte characters is not
        # a confident "ASCII", as they may come later in the file; we
        # would prefer to leave off the charset rather than be wrong.
        pass
    elif detected["confidence"] >= 0.90 and detected["encoding"]:
        fake_msg.set_param("charset", detected["encoding"], replace=True)
    elif detected["confidence"] >= 0.73 and detected["encoding"] == "ISO-8859-1":
        # ISO-8859-1 detection maxes out at 73%, so if that's what
        # we're seeing as the best guess, provide it.
        fake_msg.set_param("charset", detected["encoding"], replace=True)
    elif detected["confidence"] >= 0.66 and detected["encoding"] == "utf-8":
        # UTF-8 is far and wide the most common current encoding,
        # so we set a much lower threshold if that's the best guess.
        # https://en.wikipedia.org/wiki/Popularity_of_text_encodings
        fake_msg.set_param("charset", detected["encoding"], replace=True)
    return fake_msg["content-type"]


def create_attachment(
    file_name: str,
    path_id: str,
    content_type: str,
    file_data: bytes | StreamingSourceWithSize,
    user_profile: UserProfile,
    realm: Realm,
) -> None:
    assert (user_profile.realm_id == realm.id) or is_cross_realm_bot_email(
        user_profile.delivery_email
    )
    if isinstance(file_data, bytes):
        file_size = len(file_data)
        file_vips_data: bytes | pyvips.Source = file_data
    else:
        file_size = file_data.size
        file_vips_data = file_data.vips_source

    attachment = Attachment.objects.create(
        file_name=file_name,
        path_id=path_id,
        owner=user_profile,
        realm=realm,
        size=file_size,
        content_type=content_type,
    )
    maybe_thumbnail(file_vips_data, content_type, path_id, realm.id)
    from zerver.actions.uploads import notify_attachment_update

    notify_attachment_update(user_profile, "add", attachment.to_dict())


def get_file_info(user_file: UploadedFile) -> tuple[str, str]:
    uploaded_file_name = user_file.name
    assert uploaded_file_name is not None

    # It appears Django's UploadedFile.content_type defaults to an empty string,
    # even though the value is documented as `str | None`. So we check for both.
    content_type = user_file.content_type
    if content_type is None or content_type == "":
        guessed_type = guess_type(uploaded_file_name)[0]
        if guessed_type is not None:
            content_type = guessed_type
        else:
            # Fallback to application/octet-stream if unable to determine a
            # different content-type from the filename.
            content_type = "application/octet-stream"

    fake_msg = EmailMessage()
    extras = {}
    if user_file.content_type_extra:
        extras = {k: v.decode() if v else None for k, v in user_file.content_type_extra.items()}
    fake_msg.add_header("content-type", content_type, **extras)
    content_type = fake_msg["content-type"]

    uploaded_file_name = unquote(uploaded_file_name)

    return uploaded_file_name, content_type


# Common and wrappers
if settings.LOCAL_UPLOADS_DIR is not None:
    from zerver.lib.upload.local import LocalUploadBackend

    upload_backend: ZulipUploadBackend = LocalUploadBackend()
else:  # nocoverage
    from zerver.lib.upload.s3 import S3UploadBackend

    upload_backend = S3UploadBackend()

# Message attachment uploads


def get_public_upload_root_url() -> str:
    return upload_backend.get_public_upload_root_url()


def sanitize_name(value: str, *, strict: bool = False) -> str:
    """Sanitizes a value to be safe to store in a Linux filesystem, in
    S3, and in a URL.  So Unicode is allowed, but not special
    characters other than ".", "-", and "_".

    In "strict" mode, it does not allow Unicode, allowing only ASCII
    [A-Za-z0-9_] as word characters.  This is for the benefit of tusd,
    which is not Unicode-aware.

    This implementation is based on django.utils.text.slugify; it is
    modified by:
    * adding '.' to the list of allowed characters.
    * preserving the case of the value.
    * not stripping trailing dashes and underscores.

    """
    if strict:
        value = re.sub(r"[^A-Za-z0-9_ .-]", "", value).strip()
    else:
        value = unicodedata.normalize("NFKC", value)
        value = re.sub(r"[^\w\s.-]", "", value).strip()
    value = re.sub(r"[-\s]+", "-", value)

    # Django's MultiPartParser never returns files named this, but we
    # could get them after removing spaces; change the name to a safer
    # value.
    if value in {"", ".", ".."}:
        return "uploaded-file"
    return value


def upload_message_attachment(
    uploaded_file_name: str,
    content_type: str,
    file_data: bytes,
    user_profile: UserProfile,
    target_realm: Realm | None = None,
) -> tuple[str, str]:
    if target_realm is None:
        target_realm = user_profile.realm
    path_id = upload_backend.generate_message_upload_path(
        str(target_realm.id), sanitize_name(uploaded_file_name)
    )
    content_type = maybe_add_charset(content_type, file_data)

    with transaction.atomic(durable=True):
        upload_backend.upload_message_attachment(
            path_id,
            uploaded_file_name,
            content_type,
            file_data,
            user_profile,
            target_realm,
        )
        create_attachment(
            uploaded_file_name,
            path_id,
            content_type,
            file_data,
            user_profile,
            target_realm,
        )
    return f"/user_uploads/{path_id}", uploaded_file_name


def claim_attachment(
    path_id: str,
    message: Message | ScheduledMessage,
    is_message_realm_public: bool,
    is_message_web_public: bool = False,
) -> Attachment:
    attachment = Attachment.objects.get(path_id=path_id)
    if isinstance(message, ScheduledMessage):
        attachment.scheduled_messages.add(message)
        # Setting the is_web_public and is_realm_public flags would be incorrect
        # in the scheduled message case - since the attachment becomes such only
        # when the message is actually posted.
        return attachment

    assert isinstance(message, Message)
    attachment.messages.add(message)
    attachment.is_web_public = attachment.is_web_public or is_message_web_public
    attachment.is_realm_public = attachment.is_realm_public or is_message_realm_public
    attachment.save()
    return attachment


def upload_message_attachment_from_request(
    user_file: UploadedFile, user_profile: UserProfile
) -> tuple[str, str]:
    uploaded_file_name, content_type = get_file_info(user_file)
    return upload_message_attachment(
        uploaded_file_name, content_type, user_file.read(), user_profile
    )


def attachment_source(path_id: str) -> StreamingSourceWithSize:
    return upload_backend.attachment_source(path_id)


def save_attachment_contents(path_id: str, filehandle: IO[bytes]) -> None:
    return upload_backend.save_attachment_contents(path_id, filehandle)


def delete_message_attachment(path_id: str) -> bool:
    return upload_backend.delete_message_attachment(path_id)


def delete_message_attachments(path_ids: list[str]) -> None:
    return upload_backend.delete_message_attachments(path_ids)


def all_message_attachments(
    *, include_thumbnails: bool = False, prefix: str = ""
) -> Iterator[tuple[str, datetime]]:
    return upload_backend.all_message_attachments(include_thumbnails, prefix)


# Avatar image uploads


def get_avatar_url(hash_key: str, medium: bool = False) -> str:
    return upload_backend.get_avatar_url(hash_key, medium)


def write_avatar_images(
    file_path: str,
    user_profile: UserProfile,
    image_data: bytes,
    *,
    content_type: str | None,
    backend: ZulipUploadBackend | None = None,
    future: bool = True,
) -> None:
    if backend is None:
        backend = upload_backend
    backend.upload_single_avatar_image(
        file_path + ".original",
        user_profile=user_profile,
        image_data=image_data,
        content_type=content_type,
        future=future,
    )

    backend.upload_single_avatar_image(
        backend.get_avatar_path(file_path, medium=False),
        user_profile=user_profile,
        image_data=resize_avatar(image_data),
        content_type="image/png",
        future=future,
    )

    backend.upload_single_avatar_image(
        backend.get_avatar_path(file_path, medium=True),
        user_profile=user_profile,
        image_data=resize_avatar(image_data, MEDIUM_AVATAR_SIZE),
        content_type="image/png",
        future=future,
    )


def upload_avatar_image(
    user_file: IO[bytes],
    user_profile: UserProfile,
    content_type: str | None = None,
    backend: ZulipUploadBackend | None = None,
    future: bool = True,
) -> None:
    if content_type is None:
        content_type = guess_type(user_file.name)[0]
    if content_type not in THUMBNAIL_ACCEPT_IMAGE_TYPES:
        raise BadImageError(_("Invalid image format"))
    file_path = user_avatar_path(user_profile, future=future)

    image_data = user_file.read()
    write_avatar_images(
        file_path,
        user_profile,
        image_data,
        content_type=content_type,
        backend=backend,
        future=future,
    )


def copy_avatar(source_profile: UserProfile, target_profile: UserProfile) -> None:
    source_file_path = user_avatar_path(source_profile, future=False)
    target_file_path = user_avatar_path(target_profile, future=True)

    image_data, content_type = upload_backend.get_avatar_contents(source_file_path)
    write_avatar_images(
        target_file_path, target_profile, image_data, content_type=content_type, future=True
    )


def ensure_avatar_image(user_profile: UserProfile, medium: bool = False) -> None:
    file_path = user_avatar_path(user_profile)

    final_file_path = upload_backend.get_avatar_path(file_path, medium)

    if settings.LOCAL_AVATARS_DIR is not None:
        output_path = os.path.join(
            settings.LOCAL_AVATARS_DIR,
            final_file_path,
        )

        if os.path.isfile(output_path):
            return

    image_data, _ = upload_backend.get_avatar_contents(file_path)

    if medium:
        resized_avatar = resize_avatar(image_data, MEDIUM_AVATAR_SIZE)
    else:
        resized_avatar = resize_avatar(image_data)
    upload_backend.upload_single_avatar_image(
        final_file_path,
        user_profile=user_profile,
        image_data=resized_avatar,
        content_type="image/png",
        future=False,
    )


def delete_avatar_image(user_profile: UserProfile, avatar_version: int) -> None:
    path_id = user_avatar_base_path_from_ids(user_profile.id, avatar_version, user_profile.realm_id)
    upload_backend.delete_avatar_image(path_id)


# Realm icon and logo uploads


def upload_icon_image(user_file: IO[bytes], user_profile: UserProfile, content_type: str) -> None:
    if content_type not in THUMBNAIL_ACCEPT_IMAGE_TYPES:
        raise BadImageError(_("Invalid image format"))
    upload_backend.upload_realm_icon_image(user_file, user_profile, content_type)


def upload_logo_image(
    user_file: IO[bytes], user_profile: UserProfile, night: bool, content_type: str
) -> None:
    if content_type not in THUMBNAIL_ACCEPT_IMAGE_TYPES:
        raise BadImageError(_("Invalid image format"))
    upload_backend.upload_realm_logo_image(user_file, user_profile, night, content_type)


# Realm emoji uploads


def upload_emoji_image(
    emoji_file: IO[bytes],
    emoji_file_name: str,
    user_profile: UserProfile,
    content_type: str,
    backend: ZulipUploadBackend | None = None,
) -> bool:
    if backend is None:
        backend = upload_backend

    # Emoji are served in the format that they are uploaded, so must
    # be _both_ an image format that we're willing to thumbnail, _and_
    # a format which is widespread enough that we're willing to inline
    # it.  The latter contains non-image formats, but the former
    # limits to only images.
    content_type = bare_content_type(content_type)
    if content_type not in THUMBNAIL_ACCEPT_IMAGE_TYPES or content_type not in INLINE_MIME_TYPES:
        raise BadImageError(_("Invalid image format"))

    emoji_path = RealmEmoji.PATH_ID_TEMPLATE.format(
        realm_id=user_profile.realm_id,
        emoji_file_name=emoji_file_name,
    )

    image_data = emoji_file.read()
    backend.upload_single_emoji_image(
        f"{emoji_path}.original", content_type, user_profile, image_data
    )
    resized_image_data, still_image_data = resize_emoji(image_data, emoji_file_name)
    if still_image_data is not None:
        if len(still_image_data) > MAX_EMOJI_GIF_FILE_SIZE_BYTES:  # nocoverage
            raise BadImageError(_("Image size exceeds limit"))
    elif len(resized_image_data) > MAX_EMOJI_GIF_FILE_SIZE_BYTES:  # nocoverage
        raise BadImageError(_("Image size exceeds limit"))
    backend.upload_single_emoji_image(emoji_path, content_type, user_profile, resized_image_data)
    if still_image_data is None:
        return False

    still_path = RealmEmoji.STILL_PATH_ID_TEMPLATE.format(
        realm_id=user_profile.realm_id,
        emoji_filename_without_extension=os.path.splitext(emoji_file_name)[0],
    )
    backend.upload_single_emoji_image(still_path, "image/png", user_profile, still_image_data)
    return True


def get_emoji_file_content(
    session: OutgoingSession, emoji_url: str, emoji_id: int, logger: logging.Logger
) -> tuple[bytes, str]:  # nocoverage
    original_emoji_url = emoji_url + ".original"

    logger.info("Downloading %s", original_emoji_url)
    response = session.get(original_emoji_url)
    if response.status_code == 200:
        assert isinstance(response.content, bytes)
        return response.content, response.headers["Content-Type"]

    logger.info("Error fetching emoji from URL %s", original_emoji_url)
    logger.info("Trying %s instead", emoji_url)
    response = session.get(emoji_url)
    if response.status_code == 200:
        assert isinstance(response.content, bytes)
        return response.content, response.headers["Content-Type"]
    logger.info("Error fetching emoji from URL %s", emoji_url)
    logger.error("Could not fetch emoji %s", emoji_id)
    raise AssertionError(f"Could not fetch emoji {emoji_id}")


def handle_reupload_emojis_event(realm: Realm, logger: logging.Logger) -> None:  # nocoverage
    from zerver.lib.emoji import get_emoji_url

    session = OutgoingSession(role="reupload_emoji", timeout=3, max_retries=3)

    query = RealmEmoji.objects.filter(realm=realm).order_by("id")

    for realm_emoji in query:
        logger.info("Processing emoji %s", realm_emoji.id)
        emoji_filename = realm_emoji.file_name
        assert emoji_filename is not None
        emoji_url = get_emoji_url(emoji_filename, realm_emoji.realm_id)
        if emoji_url.startswith("/"):
            emoji_url = urljoin(realm_emoji.realm.url, emoji_url)

        emoji_file_content, content_type = get_emoji_file_content(
            session, emoji_url, realm_emoji.id, logger
        )

        emoji_bytes_io = io.BytesIO(emoji_file_content)

        user_profile = realm_emoji.author
        # When this runs, emojis have already been migrated to always have .author set.
        assert user_profile is not None

        logger.info("Reuploading emoji %s", realm_emoji.id)
        realm_emoji.is_animated = upload_emoji_image(
            emoji_bytes_io, emoji_filename, user_profile, content_type
        )
        realm_emoji.save(update_fields=["is_animated"])


# Export tarballs


def upload_export_tarball(
    realm: Realm, tarball_path: str, percent_callback: Callable[[Any], None] | None = None
) -> str:
    return upload_backend.upload_export_tarball(
        realm, tarball_path, percent_callback=percent_callback
    )


def delete_export_tarball(export_path: str) -> str | None:
    return upload_backend.delete_export_tarball(export_path)
```

--------------------------------------------------------------------------------

---[FILE: oembed.py]---
Location: zulip-main/zerver/lib/url_preview/oembed.py

```python
import json

import requests
from pyoembed import PyOembedException, oEmbed

from zerver.lib.url_preview.types import UrlEmbedData, UrlOEmbedData


def get_oembed_data(url: str, maxwidth: int = 640, maxheight: int = 480) -> UrlEmbedData | None:
    try:
        data = oEmbed(url, maxwidth=maxwidth, maxheight=maxheight)
    except (PyOembedException, json.decoder.JSONDecodeError, requests.exceptions.ConnectionError):
        return None

    oembed_resource_type = data.get("type", "")
    image = data.get("url", data.get("image"))
    thumbnail = data.get("thumbnail_url")
    html = data.get("html", "")
    if oembed_resource_type == "photo" and image:
        return UrlOEmbedData(
            image=image,
            type="photo",
            title=data.get("title"),
            description=data.get("description"),
        )

    if oembed_resource_type == "video" and html and thumbnail:
        return UrlOEmbedData(
            image=thumbnail,
            type="video",
            html=strip_cdata(html),
            title=data.get("title"),
            description=data.get("description"),
        )

    # Otherwise, use the title/description from pyembed as the basis
    # for our other parsers
    return UrlEmbedData(
        title=data.get("title"),
        description=data.get("description"),
    )


def strip_cdata(html: str) -> str:
    # Work around a bug in SoundCloud's XML generation:
    # <html>&lt;![CDATA[&lt;iframe ...&gt;&lt;/iframe&gt;]]&gt;</html>
    if html.startswith("<![CDATA[") and html.endswith("]]>"):
        html = html[9:-3]
    return html
```

--------------------------------------------------------------------------------

---[FILE: preview.py]---
Location: zulip-main/zerver/lib/url_preview/preview.py
Signals: Django

```python
import re
from collections.abc import Callable
from re import Match
from typing import Any
from urllib.parse import urljoin

import magic
import requests
from django.conf import settings
from django.utils.encoding import smart_str

from version import ZULIP_VERSION
from zerver.lib.cache import cache_with_key, preview_url_cache_key
from zerver.lib.outgoing_http import OutgoingSession
from zerver.lib.pysa import mark_sanitized
from zerver.lib.url_preview.oembed import get_oembed_data
from zerver.lib.url_preview.parsers import GenericParser, OpenGraphParser
from zerver.lib.url_preview.types import UrlEmbedData, UrlOEmbedData

# Based on django.core.validators.URLValidator, with ftp support removed.
link_regex = re.compile(
    r"^(?:http)s?://"  # http:// or https://
    r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|"  # domain...
    r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"  # ...or ip
    r"(?::\d+)?"  # optional port
    r"(?:/?|[/?]\S+)$",
    re.IGNORECASE,
)

# Use Chrome User-Agent, since some sites refuse to work on old browsers
ZULIP_URL_PREVIEW_USER_AGENT = (
    f"Mozilla/5.0 (compatible; ZulipURLPreview/{ZULIP_VERSION}; +{settings.ROOT_DOMAIN_URI})"
)

# FIXME: This header and timeout are not used by pyoembed, when trying to autodiscover!
HEADERS = {"User-Agent": ZULIP_URL_PREVIEW_USER_AGENT}
TIMEOUT = 15


class PreviewSession(OutgoingSession):
    def __init__(self) -> None:
        super().__init__(role="preview", timeout=TIMEOUT, headers=HEADERS)


def is_link(url: str) -> Match[str] | None:
    return link_regex.match(smart_str(url))


def guess_mimetype_from_content(response: requests.Response) -> str:
    mime_magic = magic.Magic(mime=True)
    try:
        content = next(response.iter_content(1000))
    except StopIteration:
        content = ""
    return mime_magic.from_buffer(content)


def valid_content_type(url: str) -> bool:
    try:
        response = PreviewSession().get(url, stream=True)
    except requests.RequestException:
        return False

    if not response.ok:
        return False

    content_type = response.headers.get("content-type")
    # Be accommodating of bad servers: assume content may be html if no content-type header
    if not content_type or content_type.startswith("text/html"):
        # Verify that the content is actually HTML if the server claims it is
        content_type = guess_mimetype_from_content(response)
    return content_type.startswith("text/html")


def catch_network_errors(func: Callable[..., Any]) -> Callable[..., Any]:
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            return func(*args, **kwargs)
        except requests.exceptions.RequestException:
            pass

    return wrapper


@catch_network_errors
@cache_with_key(preview_url_cache_key)
def get_link_embed_data(url: str, maxwidth: int = 640, maxheight: int = 480) -> UrlEmbedData | None:
    if not is_link(url):
        return None

    if not valid_content_type(url):
        return None

    # The oembed data from pyoembed may be complete enough to return
    # as-is; if so, we use it.  Otherwise, we use it as a _base_ for
    # the other, less sophisticated techniques which we apply as
    # successive fallbacks.
    data = get_oembed_data(url, maxwidth=maxwidth, maxheight=maxheight)
    if data is not None and isinstance(data, UrlOEmbedData):
        return data

    response = PreviewSession().get(mark_sanitized(url), stream=True)
    if not response.ok:
        return None

    if data is None:
        data = UrlEmbedData()

    for parser_class in (OpenGraphParser, GenericParser):
        parser = parser_class(response.content, response.headers.get("Content-Type"))
        data.merge(parser.extract_data())

    if data.image:
        data.image = urljoin(response.url, data.image)
    return data
```

--------------------------------------------------------------------------------

---[FILE: types.py]---
Location: zulip-main/zerver/lib/url_preview/types.py

```python
from dataclasses import dataclass
from typing import Literal


@dataclass
class UrlEmbedData:
    type: str | None = None
    html: str | None = None
    title: str | None = None
    description: str | None = None
    image: str | None = None

    def merge(self, other: "UrlEmbedData") -> None:
        if self.title is None and other.title is not None:
            self.title = other.title
        if self.description is None and other.description is not None:
            self.description = other.description
        if self.image is None and other.image is not None:
            self.image = other.image


@dataclass
class UrlOEmbedData(UrlEmbedData):
    type: Literal["photo", "video"]
    html: str | None = None
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: zulip-main/zerver/lib/url_preview/parsers/base.py

```python
from email.message import EmailMessage

from zerver.lib.url_preview.types import UrlEmbedData


class BaseParser:
    def __init__(self, html_source: bytes, content_type: str | None) -> None:
        # We import BeautifulSoup here, because it's not used by most
        # processes in production, and bs4 is big enough that
        # importing it adds 10s of milliseconds to manage.py startup.
        from bs4 import BeautifulSoup

        m = EmailMessage()
        m["Content-Type"] = content_type
        charset = m.get_content_charset()
        self._soup = BeautifulSoup(html_source, "lxml", from_encoding=charset)

    def extract_data(self) -> UrlEmbedData:
        raise NotImplementedError
```

--------------------------------------------------------------------------------

---[FILE: generic.py]---
Location: zulip-main/zerver/lib/url_preview/parsers/generic.py

```python
from urllib.parse import urlsplit

from bs4.element import Tag
from typing_extensions import override

from zerver.lib.url_preview.parsers.base import BaseParser
from zerver.lib.url_preview.types import UrlEmbedData


class GenericParser(BaseParser):
    @override
    def extract_data(self) -> UrlEmbedData:
        return UrlEmbedData(
            title=self._get_title(),
            description=self._get_description(),
            image=self._get_image(),
        )

    def _get_title(self) -> str | None:
        soup = self._soup
        if soup.title and soup.title.text != "":
            return soup.title.text
        if soup.h1 and soup.h1.text != "":
            return soup.h1.text
        return None

    def _get_description(self) -> str | None:
        soup = self._soup
        meta_description = soup.find("meta", attrs={"name": "description"})
        if isinstance(meta_description, Tag) and meta_description.get("content", "") != "":
            assert isinstance(meta_description["content"], str)
            return meta_description["content"]
        first_h1 = soup.find("h1")
        if first_h1:
            first_p = first_h1.find_next("p")
            if first_p and first_p.text != "":
                return first_p.text
        first_p = soup.find("p")
        if first_p and first_p.text != "":
            return first_p.text
        return None

    def _get_image(self) -> str | None:
        """
        Finding a first image after the h1 header.
        Presumably it will be the main image.
        """
        soup = self._soup
        first_h1 = soup.find("h1")
        if first_h1:
            first_image = first_h1.find_next_sibling("img", src=True)
            if isinstance(first_image, Tag) and first_image["src"] != "":
                assert isinstance(first_image["src"], str)
                try:
                    # We use urlsplit and not URLValidator because we
                    # need to support relative URLs.
                    urlsplit(first_image["src"])
                except ValueError:
                    return None
                return first_image["src"]
        return None
```

--------------------------------------------------------------------------------

---[FILE: open_graph.py]---
Location: zulip-main/zerver/lib/url_preview/parsers/open_graph.py

```python
from urllib.parse import urlsplit

from typing_extensions import override

from zerver.lib.url_preview.types import UrlEmbedData

from .base import BaseParser


class OpenGraphParser(BaseParser):
    @override
    def extract_data(self) -> UrlEmbedData:
        meta = self._soup.find_all("meta")

        data = UrlEmbedData()

        for tag in meta:
            if not tag.has_attr("property"):
                continue
            if not tag.has_attr("content"):
                continue

            if tag["property"] == "og:title":
                data.title = tag["content"]
            elif tag["property"] == "og:description":
                data.description = tag["content"]
            elif tag["property"] == "og:image":
                try:
                    # We use urlsplit and not URLValidator because we
                    # need to support relative URLs.
                    urlsplit(tag["content"])
                except ValueError:
                    continue
                data.image = tag["content"]

        return data
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: zulip-main/zerver/lib/url_preview/parsers/__init__.py

```python
from zerver.lib.url_preview.parsers.generic import GenericParser
from zerver.lib.url_preview.parsers.open_graph import OpenGraphParser

__all__ = ["GenericParser", "OpenGraphParser"]
```

--------------------------------------------------------------------------------

````
