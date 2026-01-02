---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1106
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1106 of 1290)

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
Location: zulip-main/zerver/views/submessage.py
Signals: Django, Pydantic

```python
import orjson
from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json

from zerver.actions.submessage import do_add_submessage, verify_submessage_sender
from zerver.lib.exceptions import JsonableError
from zerver.lib.message import access_message
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.validator import validate_poll_data, validate_todo_data
from zerver.lib.widget import get_widget_type
from zerver.models import UserProfile


# transaction.atomic is required since we use FOR UPDATE queries in access_message.
@transaction.atomic(durable=True)
@typed_endpoint
def process_submessage(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    content: str,
    message_id: Json[int],
    msg_type: str,
) -> HttpResponse:
    message = access_message(user_profile, message_id, lock_message=True, is_modifying_message=True)

    verify_submessage_sender(
        message_id=message.id,
        message_sender_id=message.sender_id,
        submessage_sender_id=user_profile.id,
    )

    try:
        widget_data = orjson.loads(content)
    except orjson.JSONDecodeError:
        raise JsonableError(_("Invalid json for submessage"))

    widget_type = get_widget_type(message_id=message.id)

    is_widget_author = message.sender_id == user_profile.id

    if widget_type == "poll":
        try:
            validate_poll_data(poll_data=widget_data, is_widget_author=is_widget_author)
        except ValidationError as error:
            raise JsonableError(error.message)

    if widget_type == "todo":
        try:
            validate_todo_data(todo_data=widget_data, is_widget_author=is_widget_author)
        except ValidationError as error:
            raise JsonableError(error.message)

    do_add_submessage(
        realm=user_profile.realm,
        sender_id=user_profile.id,
        message_id=message.id,
        msg_type=msg_type,
        content=content,
    )
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: thumbnail.py]---
Location: zulip-main/zerver/views/thumbnail.py
Signals: Django

```python
import re

from django.contrib.auth.models import AnonymousUser
from django.http import HttpRequest, HttpResponseBase, HttpResponseForbidden

from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import UserProfile
from zerver.views.upload import serve_file


@typed_endpoint
def backend_serve_thumbnail(
    request: HttpRequest,
    maybe_user_profile: UserProfile | AnonymousUser,
    *,
    size: str,
    url: str,
) -> HttpResponseBase:
    # This URL used to be passed arbitrary URLs, and pass them through
    # Camo; we no longer support doing so, and instead return a 403.
    #
    # Modern thumbnailing uses URLs of the style
    # `/user_uploads/thumbnail/.../300x200.webp`; this endpoint is
    # kept for backward compatibility, and for future extension for
    # thumbnailing external URLs.
    upload_path_parts = re.match(r"user_uploads/(\d+)/(.*)", url)
    if not upload_path_parts:
        return HttpResponseForbidden()

    realm_id_str = upload_path_parts[1]
    path_id = upload_path_parts[2]

    # We do not have ImageAttachment rows for historical uploads, so
    # we cannot serve a "new" thumbnail for these requests; serve the
    # full-size file.
    return serve_file(request, maybe_user_profile, realm_id_str, path_id)
```

--------------------------------------------------------------------------------

---[FILE: tusd.py]---
Location: zulip-main/zerver/views/tusd.py
Signals: Django, Pydantic

```python
from typing import Annotated, Any

import orjson
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.db import transaction
from django.http import HttpRequest, HttpResponse, HttpResponseNotFound
from django.utils.http import content_disposition_header
from django.utils.translation import gettext as _
from django.views.decorators.csrf import csrf_exempt
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_pascal

from confirmation.models import Confirmation, ConfirmationKeyError, get_object_from_key
from zerver.decorator import get_basic_credentials, validate_api_key
from zerver.lib.exceptions import AccessDeniedError, JsonableError
from zerver.lib.mime_types import INLINE_MIME_TYPES, bare_content_type, guess_type
from zerver.lib.rate_limiter import is_local_addr
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.upload import (
    RealmUploadQuotaError,
    attachment_source,
    check_upload_within_quota,
    create_attachment,
    delete_message_attachment,
    maybe_add_charset,
    sanitize_name,
    upload_backend,
)
from zerver.models import ArchivedAttachment, Attachment, PreregistrationRealm, Realm, UserProfile


# See https://tus.github.io/tusd/advanced-topics/hooks/ for the spec
# for these.
class TusUpload(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_pascal)
    id: Annotated[str, Field(alias="ID")]
    size: int | None
    size_is_deferred: bool
    offset: int
    meta_data: dict[str, str]
    is_partial: bool
    is_final: bool
    partial_uploads: list[str] | None
    storage: dict[str, str] | None


class TusHTTPRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_pascal)
    method: str
    uri: Annotated[str, Field(alias="URI")]
    remote_addr: str
    header: dict[str, list[str]]


class TusEvent(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_pascal)
    upload: TusUpload
    http_request: Annotated[TusHTTPRequest, Field(alias="HTTPRequest")]


class TusHook(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_pascal)
    type: str
    event: TusEvent


# Note that we do not raise JsonableError in these views
# because our client is not a consumer of the Zulip API -- it's tusd,
# which has its own ideas of what error responses look like.
def tusd_json_response(data: dict[str, Any]) -> HttpResponse:
    return HttpResponse(
        content=orjson.dumps(data, option=orjson.OPT_APPEND_NEWLINE),
        content_type="application/json",
        status=200,
    )


def reject_upload(message: str, status_code: int) -> HttpResponse:
    # Due to https://github.com/transloadit/uppy/issues/5460, uppy
    # will retry responses with a statuscode of exactly 400, so we
    # return 4xx status codes which are more specific to trigger an
    # immediate rejection.
    return tusd_json_response(
        {
            "HttpResponse": {
                "StatusCode": status_code,
                "Body": orjson.dumps({"message": message}).decode(),
                "Header": {
                    "Content-Type": "application/json",
                },
            },
            "RejectUpload": True,
        }
    )


def handle_upload_pre_create_hook(
    request: HttpRequest, user_profile: UserProfile, data: TusUpload
) -> HttpResponse:
    if data.size_is_deferred or data.size is None:
        return reject_upload("SizeIsDeferred is not supported", 411)

    max_file_upload_size_mebibytes = user_profile.realm.get_max_file_upload_size_mebibytes()
    if data.size > max_file_upload_size_mebibytes * 1024 * 1024:
        if user_profile.realm.plan_type != Realm.PLAN_TYPE_SELF_HOSTED:
            return reject_upload(
                _(
                    "File is larger than the maximum upload size ({max_size} MiB) allowed by your organization's plan."
                ).format(
                    max_size=max_file_upload_size_mebibytes,
                ),
                413,
            )
        else:
            return reject_upload(
                _(
                    "File is larger than this server's configured maximum upload size ({max_size} MiB)."
                ).format(
                    max_size=max_file_upload_size_mebibytes,
                ),
                413,
            )

    try:
        check_upload_within_quota(user_profile.realm, data.size)
    except RealmUploadQuotaError as e:
        return reject_upload(str(e), 413)

    # Determine the path_id to store it at
    file_name = sanitize_name(data.meta_data.get("filename", ""), strict=True)
    path_id = upload_backend.generate_message_upload_path(str(user_profile.realm_id), file_name)
    return tusd_json_response({"ChangeFileInfo": {"ID": path_id}})


def handle_upload_pre_finish_hook(
    request: HttpRequest, user_profile: UserProfile, data: TusUpload
) -> HttpResponse:
    # With an S3 backend, the filename we passed in pre_create's
    # data.id has a randomly-generated "multipart-id" appended with a
    # `+`.  Our path_ids cannot contain `+`, so we strip any suffix
    # starting with `+`.
    path_id = data.id.partition("+")[0]

    tus_metadata = data.meta_data
    filename = tus_metadata.get("filename", "")

    # We want to store as the filename a version that clients are
    # likely to be able to accept via "Save as..."
    if filename in {"", ".", ".."}:
        filename = "uploaded-file"

    content_type = tus_metadata.get("filetype")
    if not content_type:
        content_type = guess_type(filename)[0]
        if content_type is None:
            content_type = "application/octet-stream"
    file_data = attachment_source(path_id)
    content_type = maybe_add_charset(content_type, file_data)

    if settings.LOCAL_UPLOADS_DIR is None:
        # We "copy" the file to itself to update the Content-Type,
        # Content-Disposition, and storage class of the data.  This
        # parallels the work from upload_content_to_s3 in
        # zerver.lib.uploads.s3
        s3_metadata = {
            "user_profile_id": str(user_profile.id),
            "realm_id": str(user_profile.realm_id),
        }

        is_attachment = bare_content_type(content_type) not in INLINE_MIME_TYPES
        content_disposition = content_disposition_header(is_attachment, filename) or "inline"

        from zerver.lib.upload.s3 import S3UploadBackend

        assert isinstance(upload_backend, S3UploadBackend)
        key = upload_backend.uploads_bucket.Object(path_id)
        key.copy_from(
            ContentType=content_type,
            ContentDisposition=content_disposition,
            CopySource={"Bucket": settings.S3_AUTH_UPLOADS_BUCKET, "Key": path_id},
            Metadata=s3_metadata,
            MetadataDirective="REPLACE",
            StorageClass=settings.S3_UPLOADS_STORAGE_CLASS,
        )

        # https://tus.github.io/tusd/storage-backends/overview/#storage-format
        # tusd also creates a .info file next to the upload, which
        # must be preserved for HEAD requests (to check for upload
        # state) to work.  These files are inaccessible via Zulip, and
        # small enough to not pose any notable storage use; but we
        # should store them with the right StorageClass.
        if settings.S3_UPLOADS_STORAGE_CLASS != "STANDARD":
            info_key = upload_backend.uploads_bucket.Object(path_id + ".info")
            info_key.copy_from(
                CopySource={"Bucket": settings.S3_AUTH_UPLOADS_BUCKET, "Key": path_id + ".info"},
                MetadataDirective="COPY",
                StorageClass=settings.S3_UPLOADS_STORAGE_CLASS,
            )

    with transaction.atomic(durable=True):
        create_attachment(
            filename,
            path_id,
            content_type,
            file_data,
            user_profile,
            user_profile.realm,
        )

    path = "/user_uploads/" + path_id
    return tusd_json_response(
        {
            "HttpResponse": {
                "StatusCode": 200,
                "Body": orjson.dumps({"url": path, "filename": filename}).decode(),
                "Header": {
                    "Content-Type": "application/json",
                },
            },
        }
    )


def handle_upload_pre_terminate_hook(
    request: HttpRequest, user_profile: UserProfile, data: TusUpload
) -> HttpResponse:
    path_id = data.id.partition("+")[0]

    if (
        Attachment.objects.filter(path_id=path_id).exists()
        or ArchivedAttachment.objects.filter(path_id=path_id).exists()
    ):
        # Once we have it in our Attachments table (i.e. the
        # pre-upload-finished hook has run), it is ours to manage and
        # we no longer accept terminations.
        return tusd_json_response({"RejectTermination": True})
    return tusd_json_response({})


def authenticate_user(request: HttpRequest) -> UserProfile | AnonymousUser:
    # This acts like the authenticated_rest_api_view wrapper, while
    # allowing fallback to session-based request.user
    if "Authorization" in request.headers:
        try:
            role, api_key = get_basic_credentials(request)
            return validate_api_key(
                request,
                role,
                api_key,
            )

        except JsonableError:
            pass

    # If that failed, fall back to session auth
    return request.user


def handle_preregistration_pre_create_hook(
    request: HttpRequest, preregistration_realm: PreregistrationRealm, data: TusUpload
) -> HttpResponse:
    if data.size_is_deferred or data.size is None:
        return reject_upload("SizeIsDeferred is not supported", 411)

    if settings.MAX_WEB_DATA_IMPORT_SIZE_MB is not None:
        max_upload_size = settings.MAX_WEB_DATA_IMPORT_SIZE_MB * 1024 * 1024  # 1G
        if data.size > max_upload_size:
            return reject_upload(
                _(
                    "Uploaded file exceeds the maximum file size for imports ({max_file_size} MiB)."
                ).format(max_file_size=settings.MAX_WEB_DATA_IMPORT_SIZE_MB),
                413,
            )

    filename = f"import/{preregistration_realm.id}/slack.zip"

    # Delete any existing upload, so tusd doesn't declare that there's nothing
    # to do. This also has the nice benefit of deleting the previous upload.
    delete_message_attachment(filename)

    return tusd_json_response({"ChangeFileInfo": {"ID": filename}})


def handle_preregistration_pre_finish_hook(
    request: HttpRequest, preregistration_realm: PreregistrationRealm, data: TusUpload
) -> HttpResponse:
    # Save the filename to display the uploaded file to user. We need to store it in
    # the database so that is available even after a refresh.
    filename = data.meta_data["filename"]
    preregistration_realm.data_import_metadata["uploaded_import_file_name"] = filename
    preregistration_realm.save(update_fields=["data_import_metadata"])
    return tusd_json_response({})


@csrf_exempt
@typed_endpoint
def handle_tusd_hook(
    request: HttpRequest,
    *,
    payload: JsonBodyPayload[TusHook],
) -> HttpResponse:
    # Make sure this came from localhost
    if not is_local_addr(request.META["REMOTE_ADDR"]):
        raise AccessDeniedError

    hook_name = payload.type
    maybe_user = authenticate_user(request)
    if maybe_user.is_authenticated:
        # Authenticated requests are file upload requests
        if hook_name == "pre-create":
            return handle_upload_pre_create_hook(request, maybe_user, payload.event.upload)
        elif hook_name == "pre-finish":
            return handle_upload_pre_finish_hook(request, maybe_user, payload.event.upload)
        elif hook_name == "pre-terminate":
            return handle_upload_pre_terminate_hook(request, maybe_user, payload.event.upload)
        else:
            return HttpResponseNotFound()

    # Check if unauthenticated requests are for realm creation
    key = payload.event.upload.meta_data.get("key")
    if key is None:
        return reject_upload("Unauthenticated upload", 401)
    try:
        prereg_object = get_object_from_key(
            key, [Confirmation.NEW_REALM_USER_REGISTRATION], mark_object_used=False
        )
    except ConfirmationKeyError:
        return reject_upload("Unauthenticated upload", 401)

    assert isinstance(prereg_object, PreregistrationRealm)
    assert prereg_object.created_realm is None

    if hook_name == "pre-create":
        return handle_preregistration_pre_create_hook(request, prereg_object, payload.event.upload)
    elif hook_name == "pre-finish":
        return handle_preregistration_pre_finish_hook(request, prereg_object, payload.event.upload)
    else:  # nocoverage
        return HttpResponseNotFound()
```

--------------------------------------------------------------------------------

---[FILE: typing.py]---
Location: zulip-main/zerver/views/typing.py
Signals: Django, Pydantic

```python
from typing import Annotated, Literal

from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json, NonNegativeInt

from zerver.actions.message_edit import validate_user_can_edit_message
from zerver.actions.typing import (
    check_send_typing_notification,
    do_send_direct_message_edit_typing_notification,
    do_send_stream_message_edit_typing_notification,
    do_send_stream_typing_notification,
)
from zerver.lib.exceptions import JsonableError
from zerver.lib.message import access_message
from zerver.lib.response import json_success
from zerver.lib.streams import access_stream_by_id_for_message, access_stream_for_send_message
from zerver.lib.topic import (
    maybe_rename_general_chat_to_empty_topic,
    maybe_rename_no_topic_to_empty_topic,
)
from zerver.lib.typed_endpoint import ApiParamConfig, OptionalTopic, PathOnly, typed_endpoint
from zerver.models import Recipient, UserProfile
from zerver.models.recipients import get_direct_message_group_user_ids


@typed_endpoint
def send_notification_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    notification_to: Annotated[Json[list[int] | None], ApiParamConfig("to")] = None,
    operator: Annotated[Literal["start", "stop"], ApiParamConfig("op")],
    req_type: Annotated[Literal["direct", "stream", "channel"], ApiParamConfig("type")] = "direct",
    stream_id: Json[int | None] = None,
    topic: OptionalTopic = None,
) -> HttpResponse:
    recipient_type_name = req_type
    if recipient_type_name == "channel":
        # For now, use "stream" from Message.API_RECIPIENT_TYPES.
        # TODO: Use "channel" here, as well as in events and
        # message (created, schdeduled, drafts) objects/dicts.
        recipient_type_name = "stream"

    if recipient_type_name == "stream":
        if stream_id is None:
            raise JsonableError(_("Missing '{var_name}' argument").format(var_name="stream_id"))

        if topic is None:
            raise JsonableError(_("Missing topic"))

        if not user_profile.send_stream_typing_notifications:
            raise JsonableError(_("User has disabled typing notifications for channel messages"))

        # Verify that the user has access to the stream and has
        # permission to send messages to it.
        stream = access_stream_by_id_for_message(user_profile, stream_id)[0]
        access_stream_for_send_message(user_profile, stream, forwarder_user_profile=None)
        topic = maybe_rename_general_chat_to_empty_topic(topic)
        topic = maybe_rename_no_topic_to_empty_topic(topic)
        do_send_stream_typing_notification(user_profile, operator, stream, topic)
    else:
        if notification_to is None:
            raise JsonableError(_("Missing 'to' argument"))

        user_ids = notification_to
        to_length = len(user_ids)
        if to_length == 0:
            raise JsonableError(_("Empty 'to' list"))

        if not user_profile.send_private_typing_notifications:
            raise JsonableError(_("User has disabled typing notifications for direct messages"))

        check_send_typing_notification(user_profile, user_ids, operator)

    return json_success(request)


@typed_endpoint
def send_message_edit_notification_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    message_id: PathOnly[NonNegativeInt],
    operator: Annotated[Literal["start", "stop"], ApiParamConfig("op")],
) -> HttpResponse:
    # Technically, this endpoint doesn't modify the message, but we're
    # attempting to send a typing notification that we're editing the
    # message.
    message = access_message(user_profile, message_id, is_modifying_message=True)
    validate_user_can_edit_message(user_profile, message, edit_limit_buffer=0)
    recipient = message.recipient

    if recipient.type == Recipient.STREAM:
        if not user_profile.send_stream_typing_notifications:
            raise JsonableError(_("User has disabled typing notifications for channel messages"))

        channel_id = recipient.type_id
        topic = message.topic_name()
        do_send_stream_message_edit_typing_notification(
            user_profile, channel_id, message_id, operator, topic
        )

    else:
        if not user_profile.send_private_typing_notifications:
            raise JsonableError(_("User has disabled typing notifications for direct messages"))

        if recipient.type == Recipient.PERSONAL:
            recipient_ids = [user_profile.id, recipient.type_id]
        else:
            recipient_ids = list(get_direct_message_group_user_ids(recipient))

        do_send_direct_message_edit_typing_notification(
            user_profile, recipient_ids, message_id, operator
        )

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: unsubscribe.py]---
Location: zulip-main/zerver/views/unsubscribe.py
Signals: Django

```python
from collections.abc import Callable

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from confirmation.models import Confirmation, ConfirmationKeyError, get_object_from_key
from zerver.actions.user_settings import do_change_user_setting
from zerver.context_processors import common_context
from zerver.lib.send_email import clear_scheduled_emails
from zerver.models import ScheduledEmail, UserProfile


def process_unsubscribe(
    request: HttpRequest,
    confirmation_key: str,
    subscription_type: str,
    unsubscribe_function: Callable[[UserProfile], None],
) -> HttpResponse:
    try:
        user_profile = get_object_from_key(
            confirmation_key, [Confirmation.UNSUBSCRIBE], mark_object_used=False
        )
    except ConfirmationKeyError:
        return render(request, "zerver/unsubscribe_link_error.html")

    assert isinstance(user_profile, UserProfile)
    unsubscribe_function(user_profile)
    context = common_context(user_profile)
    context.update(subscription_type=subscription_type)
    return render(request, "zerver/unsubscribe_success.html", context=context)


# Email unsubscribe functions. All have the function signature
# processor(user_profile).


def do_missedmessage_unsubscribe(user_profile: UserProfile) -> None:
    do_change_user_setting(
        user_profile, "enable_offline_email_notifications", False, acting_user=user_profile
    )


def do_welcome_unsubscribe(user_profile: UserProfile) -> None:
    clear_scheduled_emails([user_profile.id], ScheduledEmail.WELCOME)


def do_digest_unsubscribe(user_profile: UserProfile) -> None:
    do_change_user_setting(user_profile, "enable_digest_emails", False, acting_user=user_profile)


def do_login_unsubscribe(user_profile: UserProfile) -> None:
    do_change_user_setting(user_profile, "enable_login_emails", False, acting_user=user_profile)


def do_marketing_unsubscribe(user_profile: UserProfile) -> None:
    do_change_user_setting(user_profile, "enable_marketing_emails", False, acting_user=user_profile)


# The keys are part of the URL for the unsubscribe link and must be valid
# without encoding.
# The values are a tuple of (display name, unsubscribe function), where the
# display name is what we call this class of email in user-visible text.
email_unsubscribers = {
    "missed_messages": ("missed messages", do_missedmessage_unsubscribe),
    "welcome": ("welcome", do_welcome_unsubscribe),
    "digest": ("digest", do_digest_unsubscribe),
    "login": ("login", do_login_unsubscribe),
    "marketing": ("marketing", do_marketing_unsubscribe),
}


# Login NOT required. These are for one-click unsubscribes.
@csrf_exempt
def email_unsubscribe(request: HttpRequest, email_type: str, confirmation_key: str) -> HttpResponse:
    if email_type in email_unsubscribers:
        display_name, unsubscribe_function = email_unsubscribers[email_type]
        return process_unsubscribe(request, confirmation_key, display_name, unsubscribe_function)

    return render(request, "zerver/unsubscribe_link_error.html")
```

--------------------------------------------------------------------------------

````
