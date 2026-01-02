---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 922
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 922 of 1290)

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

---[FILE: base.py]---
Location: zulip-main/zerver/lib/upload/base.py

```python
import os
from collections.abc import Callable, Iterator
from dataclasses import dataclass
from datetime import datetime
from typing import IO, Any, Protocol

import pyvips

from zerver.models import Realm, UserProfile


class ReadableStream(Protocol):
    def read(self, size: int = -1) -> bytes: ...

    def close(self) -> None: ...


@dataclass
class StreamingSourceWithSize:
    size: int
    vips_source: pyvips.Source
    reader: Callable[[], ReadableStream]


class ZulipUploadBackend:
    # Message attachment uploads
    def get_public_upload_root_url(self) -> str:
        raise NotImplementedError

    def generate_message_upload_path(self, realm_id: str, uploaded_file_name: str) -> str:
        raise NotImplementedError

    def upload_message_attachment(
        self,
        path_id: str,
        filename: str,
        content_type: str,
        file_data: bytes,
        user_profile: UserProfile | None,
        target_realm: Realm | None,
    ) -> None:
        raise NotImplementedError

    def save_attachment_contents(self, path_id: str, filehandle: IO[bytes]) -> None:
        raise NotImplementedError

    def attachment_source(self, path_id: str) -> StreamingSourceWithSize:
        raise NotImplementedError

    def delete_message_attachment(self, path_id: str) -> bool:
        raise NotImplementedError

    def delete_message_attachments(self, path_ids: list[str]) -> None:
        for path_id in path_ids:
            self.delete_message_attachment(path_id)

    def all_message_attachments(
        self,
        include_thumbnails: bool = False,
        prefix: str = "",
    ) -> Iterator[tuple[str, datetime]]:
        raise NotImplementedError

    # Avatar image uploads
    def get_avatar_url(self, hash_key: str, medium: bool = False) -> str:
        raise NotImplementedError

    def get_avatar_contents(self, file_path: str) -> tuple[bytes, str]:
        raise NotImplementedError

    def get_avatar_path(self, hash_key: str, medium: bool = False) -> str:
        if medium:
            return f"{hash_key}-medium.png"
        else:
            return f"{hash_key}.png"

    def upload_single_avatar_image(
        self,
        file_path: str,
        *,
        user_profile: UserProfile,
        image_data: bytes,
        content_type: str | None,
        future: bool = True,
    ) -> None:
        raise NotImplementedError

    def delete_avatar_image(self, path_id: str) -> None:
        raise NotImplementedError

    # Realm icon and logo uploads
    def realm_avatar_and_logo_path(self, realm: Realm) -> str:
        return os.path.join(str(realm.id), "realm")

    def get_realm_icon_url(self, realm_id: int, version: int) -> str:
        raise NotImplementedError

    def upload_realm_icon_image(
        self, icon_file: IO[bytes], user_profile: UserProfile, content_type: str
    ) -> None:
        raise NotImplementedError

    def get_realm_logo_url(self, realm_id: int, version: int, night: bool) -> str:
        raise NotImplementedError

    def upload_realm_logo_image(
        self, logo_file: IO[bytes], user_profile: UserProfile, night: bool, content_type: str
    ) -> None:
        raise NotImplementedError

    # Realm emoji uploads
    def get_emoji_url(self, emoji_file_name: str, realm_id: int, still: bool = False) -> str:
        raise NotImplementedError

    def upload_single_emoji_image(
        self,
        path: str,
        content_type: str | None,
        user_profile: UserProfile,
        image_data: bytes,
    ) -> None:
        raise NotImplementedError

    # Export tarballs
    def get_export_tarball_url(self, realm: Realm, export_path: str) -> str:
        raise NotImplementedError

    def upload_export_tarball(
        self,
        realm: Realm,
        tarball_path: str,
        percent_callback: Callable[[Any], None] | None = None,
    ) -> str:
        raise NotImplementedError

    def delete_export_tarball(self, export_path: str) -> str | None:
        raise NotImplementedError
```

--------------------------------------------------------------------------------

---[FILE: local.py]---
Location: zulip-main/zerver/lib/upload/local.py
Signals: Django

```python
import logging
import os
import random
import secrets
import shutil
from collections.abc import Callable, Iterator
from datetime import datetime
from typing import IO, Any, Literal

import pyvips
from django.conf import settings
from typing_extensions import override

from zerver.lib.mime_types import guess_type
from zerver.lib.thumbnail import resize_logo, resize_realm_icon
from zerver.lib.timestamp import timestamp_to_datetime
from zerver.lib.upload.base import StreamingSourceWithSize, ZulipUploadBackend
from zerver.lib.utils import assert_is_not_none
from zerver.models import Realm, RealmEmoji, UserProfile


def assert_is_local_storage_path(type: Literal["avatars", "files"], full_path: str) -> None:
    """
    Verify that we are only reading and writing files under the
    expected paths.  This is expected to be already enforced at other
    layers, via cleaning of user input, but we assert it here for
    defense in depth.
    """
    assert settings.LOCAL_UPLOADS_DIR is not None
    type_path = os.path.normpath(os.path.join(settings.LOCAL_UPLOADS_DIR, type))
    full_path = os.path.normpath(full_path)
    assert os.path.commonpath([type_path, full_path]) == type_path


def write_local_file(type: Literal["avatars", "files"], path: str, file_data: bytes) -> None:
    file_path = os.path.join(assert_is_not_none(settings.LOCAL_UPLOADS_DIR), type, path)
    assert_is_local_storage_path(type, file_path)

    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "wb") as f:
        f.write(file_data)


def read_local_file(type: Literal["avatars", "files"], path: str) -> Iterator[bytes]:
    file_path = os.path.join(assert_is_not_none(settings.LOCAL_UPLOADS_DIR), type, path)
    assert_is_local_storage_path(type, file_path)

    with open(file_path, "rb") as f:
        yield from iter(lambda: f.read(4 * 1024 * 1024), b"")


def delete_local_file(type: Literal["avatars", "files"], path: str) -> bool:
    file_path = os.path.join(assert_is_not_none(settings.LOCAL_UPLOADS_DIR), type, path)
    assert_is_local_storage_path(type, file_path)

    if os.path.isfile(file_path):
        os.remove(file_path)

        # Remove as many directories up the tree as are now empty
        directory = os.path.dirname(file_path)
        while directory != settings.LOCAL_UPLOADS_DIR:
            try:
                os.rmdir(directory)
                directory = os.path.dirname(directory)
            except OSError:
                break
        return True
    file_name = path.split("/")[-1]
    logging.warning("%s does not exist. Its entry in the database will be removed.", file_name)
    return False


class LocalUploadBackend(ZulipUploadBackend):
    @override
    def get_public_upload_root_url(self) -> str:
        return "/user_avatars/"

    @override
    def generate_message_upload_path(self, realm_id: str, sanitized_file_name: str) -> str:
        # Split into 256 subdirectories to prevent directories from getting too big
        return "/".join(
            [
                realm_id,
                format(random.randint(0, 255), "x"),
                secrets.token_urlsafe(18),
                sanitized_file_name,
            ]
        )

    @override
    def upload_message_attachment(
        self,
        path_id: str,
        filename: str,
        content_type: str,
        file_data: bytes,
        user_profile: UserProfile | None,
        target_realm: Realm | None,
    ) -> None:
        write_local_file("files", path_id, file_data)

    @override
    def save_attachment_contents(self, path_id: str, filehandle: IO[bytes]) -> None:
        for chunk in read_local_file("files", path_id):
            filehandle.write(chunk)

    @override
    def attachment_source(self, path_id: str) -> StreamingSourceWithSize:
        file_path = os.path.join(assert_is_not_none(settings.LOCAL_UPLOADS_DIR), "files", path_id)
        assert_is_local_storage_path("files", file_path)
        vips_source = pyvips.Source.new_from_file(file_path)
        return StreamingSourceWithSize(
            size=os.path.getsize(file_path),
            vips_source=vips_source,
            reader=lambda: open(file_path, "rb"),
        )

    @override
    def delete_message_attachment(self, path_id: str) -> bool:
        return delete_local_file("files", path_id)

    @override
    def all_message_attachments(
        self,
        include_thumbnails: bool = False,
        prefix: str = "",
    ) -> Iterator[tuple[str, datetime]]:
        assert settings.LOCAL_UPLOADS_DIR is not None
        top = settings.LOCAL_UPLOADS_DIR + "/files"
        start = top
        if prefix != "":
            start += f"/{prefix}"
        for dirname, subdirnames, files in os.walk(start):
            if not include_thumbnails and dirname == top and "thumbnail" in subdirnames:
                subdirnames.remove("thumbnail")
            for f in files:
                fullpath = os.path.join(dirname, f)
                yield (
                    os.path.relpath(fullpath, top),
                    timestamp_to_datetime(os.path.getmtime(fullpath)),
                )

    @override
    def get_avatar_url(self, hash_key: str, medium: bool = False) -> str:
        return "/user_avatars/" + self.get_avatar_path(hash_key, medium)

    @override
    def get_avatar_contents(self, file_path: str) -> tuple[bytes, str]:
        image_data = b"".join(read_local_file("avatars", file_path + ".original"))
        content_type = guess_type(file_path)[0]
        return image_data, content_type or "application/octet-stream"

    @override
    def upload_single_avatar_image(
        self,
        file_path: str,
        *,
        user_profile: UserProfile,
        image_data: bytes,
        content_type: str | None,
        future: bool = True,
    ) -> None:
        write_local_file("avatars", file_path, image_data)

    @override
    def delete_avatar_image(self, path_id: str) -> None:
        delete_local_file("avatars", path_id + ".original")
        delete_local_file("avatars", self.get_avatar_path(path_id, True))
        delete_local_file("avatars", self.get_avatar_path(path_id, False))

    @override
    def get_realm_icon_url(self, realm_id: int, version: int) -> str:
        return f"/user_avatars/{realm_id}/realm/icon.png?version={version}"

    @override
    def upload_realm_icon_image(
        self, icon_file: IO[bytes], user_profile: UserProfile, content_type: str
    ) -> None:
        upload_path = self.realm_avatar_and_logo_path(user_profile.realm)
        image_data = icon_file.read()
        write_local_file("avatars", os.path.join(upload_path, "icon.original"), image_data)

        resized_data = resize_realm_icon(image_data)
        write_local_file("avatars", os.path.join(upload_path, "icon.png"), resized_data)

    @override
    def get_realm_logo_url(self, realm_id: int, version: int, night: bool) -> str:
        if night:
            file_name = "night_logo.png"
        else:
            file_name = "logo.png"
        return f"/user_avatars/{realm_id}/realm/{file_name}?version={version}"

    @override
    def upload_realm_logo_image(
        self, logo_file: IO[bytes], user_profile: UserProfile, night: bool, content_type: str
    ) -> None:
        upload_path = self.realm_avatar_and_logo_path(user_profile.realm)
        if night:
            original_file = "night_logo.original"
            resized_file = "night_logo.png"
        else:
            original_file = "logo.original"
            resized_file = "logo.png"
        image_data = logo_file.read()
        write_local_file("avatars", os.path.join(upload_path, original_file), image_data)

        resized_data = resize_logo(image_data)
        write_local_file("avatars", os.path.join(upload_path, resized_file), resized_data)

    @override
    def get_emoji_url(self, emoji_file_name: str, realm_id: int, still: bool = False) -> str:
        if still:
            return os.path.join(
                "/user_avatars",
                RealmEmoji.STILL_PATH_ID_TEMPLATE.format(
                    realm_id=realm_id,
                    emoji_filename_without_extension=os.path.splitext(emoji_file_name)[0],
                ),
            )
        else:
            return os.path.join(
                "/user_avatars",
                RealmEmoji.PATH_ID_TEMPLATE.format(
                    realm_id=realm_id, emoji_file_name=emoji_file_name
                ),
            )

    @override
    def upload_single_emoji_image(
        self, path: str, content_type: str | None, user_profile: UserProfile, image_data: bytes
    ) -> None:
        write_local_file("avatars", path, image_data)

    @override
    def get_export_tarball_url(self, realm: Realm, export_path: str) -> str:
        # export_path has a leading `/`
        return realm.url + export_path

    @override
    def upload_export_tarball(
        self,
        realm: Realm,
        tarball_path: str,
        percent_callback: Callable[[Any], None] | None = None,
    ) -> str:
        path = os.path.join(
            "exports",
            str(realm.id),
            secrets.token_urlsafe(18),
            os.path.basename(tarball_path),
        )
        abs_path = os.path.join(assert_is_not_none(settings.LOCAL_AVATARS_DIR), path)
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        shutil.copy(tarball_path, abs_path)
        return self.get_export_tarball_url(realm, "/user_avatars/" + path)

    @override
    def delete_export_tarball(self, export_path: str) -> str | None:
        # Get the last element of a list in the form ['user_avatars', '<file_path>']
        assert export_path.startswith("/")
        file_path = export_path.removeprefix("/").split("/", 1)[-1]
        if delete_local_file("avatars", file_path):
            return export_path
        return None
```

--------------------------------------------------------------------------------

---[FILE: s3.py]---
Location: zulip-main/zerver/lib/upload/s3.py
Signals: Django

```python
import logging
import os
import secrets
from collections.abc import Callable, Iterator
from datetime import datetime
from typing import IO, TYPE_CHECKING, Any, Literal
from urllib.parse import urljoin, urlsplit, urlunsplit

import botocore
import pyvips
from botocore.client import Config
from botocore.response import StreamingBody
from django.conf import settings
from django.utils.http import content_disposition_header
from typing_extensions import override

from zerver.lib.mime_types import INLINE_MIME_TYPES, bare_content_type
from zerver.lib.partial import partial
from zerver.lib.thumbnail import resize_logo, resize_realm_icon
from zerver.lib.upload.base import StreamingSourceWithSize, ZulipUploadBackend
from zerver.models import Realm, RealmEmoji, UserProfile

if TYPE_CHECKING:
    from mypy_boto3_s3.client import S3Client
    from mypy_boto3_s3.service_resource import Bucket, Object

# Duration that the signed upload URLs that we redirect to when
# accessing uploaded files are available for clients to fetch before
# they expire.
SIGNED_UPLOAD_URL_DURATION = 60

# Performance note:
#
# For writing files to S3, the file could either be stored in RAM
# (if it is less than 2.5MiB or so) or an actual temporary file on disk.
#
# Because we set FILE_UPLOAD_MAX_MEMORY_SIZE to 0, only the latter case
# should occur in practice.
#
# This is great, because passing the pseudofile object that Django gives
# you to boto would be a pain.

# To come up with a s3 key we randomly generate a "directory". The
# "file name" is the original filename provided by the user run
# through a sanitization function.


# https://github.com/boto/botocore/issues/2644 means that the IMDS
# request _always_ pulls from the environment.  Monkey-patch the
# `should_bypass_proxies` function if we need to skip them, based
# on S3_SKIP_PROXY.
if settings.S3_SKIP_PROXY is True:  # nocoverage
    botocore.utils.should_bypass_proxies = lambda url: True


def get_bucket(bucket_name: str, authed: bool = True) -> "Bucket":
    import boto3

    checksum: Literal["when_required", "when_supported"] = (
        "when_required" if settings.S3_SKIP_CHECKSUM else "when_supported"
    )
    return boto3.resource(
        "s3",
        aws_access_key_id=settings.S3_KEY if authed else None,
        aws_secret_access_key=settings.S3_SECRET_KEY if authed else None,
        region_name=settings.S3_REGION,
        endpoint_url=settings.S3_ENDPOINT_URL,
        config=Config(
            signature_version=None if authed else botocore.UNSIGNED,
            s3={"addressing_style": settings.S3_ADDRESSING_STYLE},
            request_checksum_calculation=checksum,
        ),
    ).Bucket(bucket_name)


def upload_content_to_s3(
    bucket: "Bucket",
    path: str,
    content_type: str | None,
    user_profile: UserProfile | None,
    contents: bytes,
    *,
    storage_class: Literal[
        "GLACIER_IR",
        "INTELLIGENT_TIERING",
        "ONEZONE_IA",
        "REDUCED_REDUNDANCY",
        "STANDARD",
        "STANDARD_IA",
    ] = "STANDARD",
    cache_control: str | None = None,
    extra_metadata: dict[str, str] | None = None,
    filename: str | None = None,
    target_realm: Realm | None = None,
) -> None:
    # Note that these steps are also replicated in
    # handle_upload_pre_finish_hook in zerver.views.tus, to update
    # properties for files uploaded via TUS.

    key = bucket.Object(path)
    metadata: dict[str, str] = {}
    if user_profile:
        metadata["user_profile_id"] = str(user_profile.id)
        metadata["realm_id"] = str(user_profile.realm_id)
    if target_realm:
        metadata["realm_id"] = str(target_realm.id)
    if extra_metadata is not None:
        metadata.update(extra_metadata)

    extras = {}
    if content_type is None:  # nocoverage
        content_type = ""
    is_attachment = bare_content_type(content_type) not in INLINE_MIME_TYPES
    if filename is not None:
        extras["ContentDisposition"] = content_disposition_header(is_attachment, filename)
    elif is_attachment:
        extras["ContentDisposition"] = "attachment"
    if cache_control is not None:
        extras["CacheControl"] = cache_control

    key.put(
        Body=contents,
        Metadata=metadata,
        ContentType=content_type,
        StorageClass=storage_class,
        **extras,  # type: ignore[arg-type] # The dynamic kwargs here confuse mypy.
    )


BOTO_CLIENT: "S3Client | None" = None


def get_boto_client() -> "S3Client":
    """
    Creating the client takes a long time so we need to cache it.
    """
    global BOTO_CLIENT
    if BOTO_CLIENT is None:
        BOTO_CLIENT = get_bucket(settings.S3_AUTH_UPLOADS_BUCKET).meta.client
    return BOTO_CLIENT


def get_signed_upload_url(path: str, filename: str, force_download: bool = False) -> str:
    params = {
        "Bucket": settings.S3_AUTH_UPLOADS_BUCKET,
        "Key": path,
    }
    if force_download:
        params["ResponseContentDisposition"] = (
            content_disposition_header(True, filename) or "attachment"
        )

    return get_boto_client().generate_presigned_url(
        ClientMethod="get_object",
        Params=params,
        ExpiresIn=SIGNED_UPLOAD_URL_DURATION,
        HttpMethod="GET",
    )


class S3UploadBackend(ZulipUploadBackend):
    def __init__(self) -> None:
        from mypy_boto3_s3.service_resource import Bucket

        self.avatar_bucket = get_bucket(settings.S3_AVATAR_BUCKET)
        self.uploads_bucket = get_bucket(settings.S3_AUTH_UPLOADS_BUCKET)
        self.export_bucket: Bucket | None = None
        if settings.S3_EXPORT_BUCKET:
            self.export_bucket = get_bucket(settings.S3_EXPORT_BUCKET)

        self.public_upload_url_base = self.construct_public_upload_url_base()

    def delete_file_from_s3(self, path_id: str, bucket: "Bucket") -> bool:
        key = bucket.Object(path_id)

        try:
            key.load()
        except botocore.exceptions.ClientError:
            file_name = path_id.split("/")[-1]
            logging.warning(
                "%s does not exist. Its entry in the database will be removed.", file_name
            )
            return False
        key.delete()
        return True

    def construct_public_upload_url_base(self) -> str:
        # Return the pattern for public URL for a key in the S3 Avatar bucket.
        # For Amazon S3 itself, this will return the following:
        #     f"https://{self.avatar_bucket.name}.{network_location}/{key}"
        #
        # However, we need this function to properly handle S3 style
        # file upload backends that Zulip supports, which can have a
        # different URL format. Configuring no signature and providing
        # no access key makes `generate_presigned_url` just return the
        # normal public URL for a key.
        #
        # It unfortunately takes 2ms per query to call
        # generate_presigned_url. Since we need to potentially compute
        # hundreds of avatar URLs in single `GET /messages` request,
        # we instead back-compute the URL pattern here.

        # The S3_AVATAR_PUBLIC_URL_PREFIX setting is used to override
        # this prefix, for instance if a CloudFront distribution is
        # used.
        if settings.S3_AVATAR_PUBLIC_URL_PREFIX is not None:
            prefix = settings.S3_AVATAR_PUBLIC_URL_PREFIX
            if not prefix.endswith("/"):
                prefix += "/"
            return prefix

        DUMMY_KEY = "dummy_key_ignored"

        # We do not access self.avatar_bucket.meta.client directly,
        # since that client is auth'd, and we want only the direct
        # unauthed endpoint here.
        client = get_bucket(self.avatar_bucket.name, authed=False).meta.client
        dummy_signed_url = client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": self.avatar_bucket.name,
                "Key": DUMMY_KEY,
            },
            ExpiresIn=0,
        )
        split_url = urlsplit(dummy_signed_url)
        assert split_url.path.endswith(f"/{DUMMY_KEY}")

        return urlunsplit(
            (split_url.scheme, split_url.netloc, split_url.path.removesuffix(DUMMY_KEY), "", "")
        )

    @override
    def get_public_upload_root_url(self) -> str:
        return self.public_upload_url_base

    def get_public_upload_url(
        self,
        key: str,
    ) -> str:
        assert not key.startswith("/")
        return urljoin(self.public_upload_url_base, key)

    @override
    def generate_message_upload_path(self, realm_id: str, sanitized_file_name: str) -> str:
        return "/".join(
            [
                realm_id,
                secrets.token_urlsafe(18),
                sanitized_file_name,
            ]
        )

    @override
    def upload_message_attachment(
        self,
        path_id: str,
        filename: str,
        content_type: str,
        file_data: bytes,
        user_profile: UserProfile | None,
        target_realm: Realm | None,
    ) -> None:
        upload_content_to_s3(
            self.uploads_bucket,
            path_id,
            content_type,
            user_profile,
            file_data,
            storage_class=settings.S3_UPLOADS_STORAGE_CLASS,
            filename=filename,
            target_realm=target_realm,
        )

    @override
    def save_attachment_contents(self, path_id: str, filehandle: IO[bytes]) -> None:
        for chunk in self.uploads_bucket.Object(path_id).get()["Body"]:
            filehandle.write(chunk)

    @override
    def attachment_source(self, path_id: str) -> StreamingSourceWithSize:
        metadata = self.uploads_bucket.Object(path_id).get()

        def s3_read(streamingbody: StreamingBody, size: int) -> bytes:
            return streamingbody.read(amt=size)

        vips_source: pyvips.Source = pyvips.SourceCustom()
        vips_source.on_read(partial(s3_read, metadata["Body"]))
        return StreamingSourceWithSize(
            size=metadata["ContentLength"],
            vips_source=vips_source,
            reader=lambda: metadata["Body"],
        )

    @override
    def delete_message_attachment(self, path_id: str) -> bool:
        return self.delete_file_from_s3(path_id, self.uploads_bucket)

    @override
    def delete_message_attachments(self, path_ids: list[str]) -> None:
        self.uploads_bucket.delete_objects(
            Delete={"Objects": [{"Key": path_id} for path_id in path_ids]}
        )

    @override
    def all_message_attachments(
        self,
        include_thumbnails: bool = False,
        prefix: str = "",
    ) -> Iterator[tuple[str, datetime]]:
        client = self.uploads_bucket.meta.client
        paginator = client.get_paginator("list_objects_v2")
        page_iterator = paginator.paginate(Bucket=self.uploads_bucket.name, Prefix=prefix)

        for page in page_iterator:
            if page["KeyCount"] > 0:
                for item in page["Contents"]:
                    if not include_thumbnails and item["Key"].startswith("thumbnail/"):
                        continue
                    yield (
                        item["Key"],
                        item["LastModified"],
                    )

    @override
    def get_avatar_url(self, hash_key: str, medium: bool = False) -> str:
        return self.get_public_upload_url(self.get_avatar_path(hash_key, medium))

    @override
    def get_avatar_contents(self, file_path: str) -> tuple[bytes, str]:
        key = self.avatar_bucket.Object(file_path + ".original")
        image_data = key.get()["Body"].read()
        content_type = key.content_type
        return image_data, content_type

    @override
    def upload_single_avatar_image(
        self,
        file_path: str,
        *,
        user_profile: UserProfile,
        image_data: bytes,
        content_type: str | None,
        future: bool = True,
    ) -> None:
        extra_metadata = {"avatar_version": str(user_profile.avatar_version + (1 if future else 0))}
        upload_content_to_s3(
            self.avatar_bucket,
            file_path,
            content_type,
            user_profile,
            image_data,
            extra_metadata=extra_metadata,
            cache_control="public, max-age=31536000, immutable",
        )

    @override
    def delete_avatar_image(self, path_id: str) -> None:
        self.delete_file_from_s3(path_id + ".original", self.avatar_bucket)
        self.delete_file_from_s3(self.get_avatar_path(path_id, True), self.avatar_bucket)
        self.delete_file_from_s3(self.get_avatar_path(path_id, False), self.avatar_bucket)

    @override
    def get_realm_icon_url(self, realm_id: int, version: int) -> str:
        public_url = self.get_public_upload_url(f"{realm_id}/realm/icon.png")
        return public_url + f"?version={version}"

    @override
    def upload_realm_icon_image(
        self, icon_file: IO[bytes], user_profile: UserProfile, content_type: str
    ) -> None:
        s3_file_name = os.path.join(self.realm_avatar_and_logo_path(user_profile.realm), "icon")

        image_data = icon_file.read()
        upload_content_to_s3(
            self.avatar_bucket,
            s3_file_name + ".original",
            content_type,
            user_profile,
            image_data,
        )

        resized_data = resize_realm_icon(image_data)
        upload_content_to_s3(
            self.avatar_bucket,
            s3_file_name + ".png",
            "image/png",
            user_profile,
            resized_data,
        )
        # See avatar_url in avatar.py for URL.  (That code also handles the case
        # that users use gravatar.)

    @override
    def get_realm_logo_url(self, realm_id: int, version: int, night: bool) -> str:
        if not night:
            file_name = "logo.png"
        else:
            file_name = "night_logo.png"
        public_url = self.get_public_upload_url(f"{realm_id}/realm/{file_name}")
        return public_url + f"?version={version}"

    @override
    def upload_realm_logo_image(
        self, logo_file: IO[bytes], user_profile: UserProfile, night: bool, content_type: str
    ) -> None:
        if night:
            basename = "night_logo"
        else:
            basename = "logo"
        s3_file_name = os.path.join(self.realm_avatar_and_logo_path(user_profile.realm), basename)

        image_data = logo_file.read()
        upload_content_to_s3(
            self.avatar_bucket,
            s3_file_name + ".original",
            content_type,
            user_profile,
            image_data,
        )

        resized_data = resize_logo(image_data)
        upload_content_to_s3(
            self.avatar_bucket,
            s3_file_name + ".png",
            "image/png",
            user_profile,
            resized_data,
        )
        # See avatar_url in avatar.py for URL.  (That code also handles the case
        # that users use gravatar.)

    @override
    def get_emoji_url(self, emoji_file_name: str, realm_id: int, still: bool = False) -> str:
        if still:
            emoji_path = RealmEmoji.STILL_PATH_ID_TEMPLATE.format(
                realm_id=realm_id,
                emoji_filename_without_extension=os.path.splitext(emoji_file_name)[0],
            )
            return self.get_public_upload_url(emoji_path)
        else:
            emoji_path = RealmEmoji.PATH_ID_TEMPLATE.format(
                realm_id=realm_id, emoji_file_name=emoji_file_name
            )
            return self.get_public_upload_url(emoji_path)

    @override
    def upload_single_emoji_image(
        self, path: str, content_type: str | None, user_profile: UserProfile, image_data: bytes
    ) -> None:
        upload_content_to_s3(
            self.avatar_bucket,
            path,
            content_type,
            user_profile,
            image_data,
            cache_control="public, max-age=31536000, immutable",
        )

    @override
    def get_export_tarball_url(self, realm: Realm, export_path: str) -> str:
        export_path = export_path.removeprefix("/")
        if self.export_bucket:
            # Fix old data if the row was created when an export bucket was not in use.
            export_path = export_path.removeprefix("exports/")
            client = self.export_bucket.meta.client
            return client.generate_presigned_url(
                ClientMethod="get_object",
                Params={
                    "Bucket": self.export_bucket.name,
                    "Key": export_path,
                },
                # Expires in one week, the longest allowed by AWS
                ExpiresIn=60 * 60 * 24 * 7,
            )
        else:
            if not export_path.startswith("exports/"):
                export_path = "exports/" + export_path
            client = self.avatar_bucket.meta.client
            signed_url = client.generate_presigned_url(
                ClientMethod="get_object",
                Params={
                    "Bucket": self.avatar_bucket.name,
                    "Key": export_path,
                },
                ExpiresIn=0,
            )
            # Strip off the signing query parameters, since this URL is public
            return urlsplit(signed_url)._replace(query="").geturl()

    def export_object(self, tarball_path: str) -> "Object":
        if self.export_bucket:
            return self.export_bucket.Object(
                os.path.join(secrets.token_hex(16), os.path.basename(tarball_path))
            )
        else:
            # We fall back to the avatar bucket, because it's world-readable.
            return self.avatar_bucket.Object(
                os.path.join("exports", secrets.token_hex(16), os.path.basename(tarball_path))
            )

    @override
    def upload_export_tarball(
        self,
        realm: Realm,
        tarball_path: str,
        percent_callback: Callable[[Any], None] | None = None,
    ) -> str:
        key = self.export_object(tarball_path)

        if percent_callback is None:
            key.upload_file(Filename=tarball_path)
        else:
            key.upload_file(Filename=tarball_path, Callback=percent_callback)

        return self.get_export_tarball_url(realm, key.key)

    @override
    def delete_export_tarball(self, export_path: str) -> str | None:
        assert export_path.startswith("/")
        path_id = export_path.removeprefix("/")
        bucket = self.export_bucket or self.avatar_bucket
        if self.delete_file_from_s3(path_id, bucket):
            return export_path
        return None
```

--------------------------------------------------------------------------------

````
