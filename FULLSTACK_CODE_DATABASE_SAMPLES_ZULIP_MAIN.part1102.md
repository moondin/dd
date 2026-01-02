---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1102
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1102 of 1290)

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

---[FILE: realm_export.py]---
Location: zulip-main/zerver/views/realm_export.py
Signals: Django, Pydantic

```python
from datetime import timedelta
from typing import Annotated

from django.db import transaction
from django.http import HttpRequest, HttpResponse
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from pydantic import Json

from analytics.models import RealmCount
from zerver.actions.realm_export import do_delete_realm_export, notify_realm_export
from zerver.decorator import require_realm_admin
from zerver.lib.exceptions import JsonableError
from zerver.lib.export import get_realm_exports_serialized
from zerver.lib.queue import queue_event_on_commit
from zerver.lib.response import json_success
from zerver.lib.send_email import FromAddress
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.typed_endpoint_validators import check_int_in_validator
from zerver.models import RealmExport, UserProfile


@transaction.atomic(durable=True)
@require_realm_admin
@typed_endpoint
def export_realm(
    request: HttpRequest,
    user: UserProfile,
    *,
    export_type: Json[
        Annotated[
            int,
            check_int_in_validator(
                [RealmExport.EXPORT_PUBLIC, RealmExport.EXPORT_FULL_WITH_CONSENT]
            ),
        ]
    ] = RealmExport.EXPORT_PUBLIC,
) -> HttpResponse:
    realm = user.realm
    EXPORT_LIMIT = 5

    # Exporting organizations with a huge amount of history can
    # potentially consume a lot of disk or otherwise have accidental
    # DoS risk; for that reason, we require large exports to be done
    # manually on the command line.
    #
    # It's very possible that higher limits would be completely safe.
    MAX_MESSAGE_HISTORY = 250000
    MAX_UPLOAD_QUOTA = 20 * 1024 * 1024 * 1024

    # Filter based upon the number of events that have occurred in the delta
    # If we are at the limit, the incoming request is rejected
    event_time_delta = timezone_now() - timedelta(days=7)
    limit_check = RealmExport.objects.filter(
        realm=realm, date_requested__gte=event_time_delta
    ).count()
    if limit_check >= EXPORT_LIMIT:
        raise JsonableError(_("Exceeded rate limit."))

    # The RealmCount analytics table lets us efficiently get an estimate
    # for the number of messages in an organization. It won't match the
    # actual number of messages in the export, because this measures the
    # number of messages that went to DMs / Group DMs / public or private
    # channels at the time they were sent.
    # Thus, messages that were deleted or moved between channels and
    # private messages for which the users didn't consent for export will be
    # treated differently for this check vs. in the export code.
    realm_count_query = RealmCount.objects.filter(
        realm=realm, property="messages_sent:message_type:day"
    )
    if export_type == RealmExport.EXPORT_PUBLIC:
        realm_count_query.filter(subgroup="public_stream")
    exportable_messages_estimate = sum(realm_count.value for realm_count in realm_count_query)

    if (
        exportable_messages_estimate > MAX_MESSAGE_HISTORY
        or user.realm.currently_used_upload_space_bytes() > MAX_UPLOAD_QUOTA
    ):
        raise JsonableError(
            _(
                "The export you requested is too large for automatic processing. Please request a manual export by contacting {email}."
            ).format(
                email=FromAddress.SUPPORT,
            )
        )

    row = RealmExport.objects.create(
        realm=realm,
        type=export_type,
        acting_user=user,
        status=RealmExport.REQUESTED,
        date_requested=timezone_now(),
    )

    # Allow for UI updates on a pending export
    notify_realm_export(realm)

    # Using the deferred_work queue processor to avoid
    # killing the process after 60s
    event = {
        "type": "realm_export",
        "user_profile_id": user.id,
        "realm_export_id": row.id,
    }
    queue_event_on_commit("deferred_work", event)
    return json_success(request, data={"id": row.id})


@require_realm_admin
def get_realm_exports(request: HttpRequest, user: UserProfile) -> HttpResponse:
    realm_exports = get_realm_exports_serialized(user.realm)
    return json_success(request, data={"exports": realm_exports})


@require_realm_admin
def delete_realm_export(request: HttpRequest, user: UserProfile, export_id: int) -> HttpResponse:
    try:
        export_row = RealmExport.objects.get(realm_id=user.realm_id, id=export_id)
    except RealmExport.DoesNotExist:
        raise JsonableError(_("Invalid data export ID"))

    if export_row.status == RealmExport.DELETED:
        raise JsonableError(_("Export already deleted"))
    if export_row.status == RealmExport.FAILED:
        raise JsonableError(_("Export failed, nothing to delete"))
    if export_row.status in [RealmExport.REQUESTED, RealmExport.STARTED]:
        raise JsonableError(_("Export still in progress"))
    do_delete_realm_export(export_row, user)
    return json_success(request)


@require_realm_admin
def get_users_export_consents(request: HttpRequest, user: UserProfile) -> HttpResponse:
    rows = UserProfile.objects.filter(realm=user.realm, is_active=True, is_bot=False).values(
        "id",
        "allow_private_data_export",
        "email_address_visibility",
    )
    export_consents = [
        {
            "user_id": row["id"],
            "consented": row["allow_private_data_export"],
            "email_address_visibility": row["email_address_visibility"],
        }
        for row in rows
    ]
    return json_success(request, data={"export_consents": export_consents})
```

--------------------------------------------------------------------------------

---[FILE: realm_icon.py]---
Location: zulip-main/zerver/views/realm_icon.py
Signals: Django

```python
from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect
from django.utils.translation import gettext as _

from zerver.actions.realm_icon import do_change_icon_source
from zerver.decorator import require_realm_admin
from zerver.lib.exceptions import JsonableError
from zerver.lib.realm_icon import realm_icon_url
from zerver.lib.response import json_success
from zerver.lib.upload import get_file_info, upload_icon_image
from zerver.lib.url_encoding import append_url_query_string
from zerver.models import UserProfile


@require_realm_admin
def upload_icon(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    if len(request.FILES) != 1:
        raise JsonableError(_("You must upload exactly one icon."))

    [icon_file] = request.FILES.values()
    assert isinstance(icon_file, UploadedFile)
    assert icon_file.size is not None
    if icon_file.size > settings.MAX_ICON_FILE_SIZE_MIB * 1024 * 1024:
        raise JsonableError(
            _("Uploaded file is larger than the allowed limit of {max_size} MiB").format(
                max_size=settings.MAX_ICON_FILE_SIZE_MIB,
            )
        )
    _filename, content_type = get_file_info(icon_file)
    upload_icon_image(icon_file, user_profile, content_type=content_type)
    do_change_icon_source(
        user_profile.realm, user_profile.realm.ICON_UPLOADED, acting_user=user_profile
    )
    icon_url = realm_icon_url(user_profile.realm)

    json_result = dict(
        icon_url=icon_url,
    )
    return json_success(request, data=json_result)


@require_realm_admin
def delete_icon_backend(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    # We don't actually delete the icon because it might still
    # be needed if the URL was cached and it is rewritten
    # in any case after next update.
    do_change_icon_source(
        user_profile.realm, user_profile.realm.ICON_FROM_GRAVATAR, acting_user=user_profile
    )
    gravatar_url = realm_icon_url(user_profile.realm)
    json_result = dict(
        icon_url=gravatar_url,
    )
    return json_success(request, data=json_result)


def get_icon_backend(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    url = realm_icon_url(user_profile.realm)

    # We can rely on the URL already having query parameters. Because
    # our templates depend on being able to use the ampersand to
    # add query parameters to our url, get_icon_url does '?version=version_number'
    # hacks to prevent us from having to jump through decode/encode hoops.
    url = append_url_query_string(url, request.META["QUERY_STRING"])
    return redirect(url)
```

--------------------------------------------------------------------------------

---[FILE: realm_linkifiers.py]---
Location: zulip-main/zerver/views/realm_linkifiers.py
Signals: Django, Pydantic

```python
from django.core.exceptions import ValidationError
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json

from zerver.actions.realm_linkifiers import (
    check_reorder_linkifiers,
    do_add_linkifier,
    do_remove_linkifier,
    do_update_linkifier,
)
from zerver.decorator import require_realm_admin
from zerver.lib.exceptions import JsonableError, ValidationFailureError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import PathOnly, typed_endpoint
from zerver.models import RealmFilter, UserProfile
from zerver.models.linkifiers import linkifiers_for_realm


# Custom realm linkifiers
def list_linkifiers(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    linkifiers = linkifiers_for_realm(user_profile.realm_id)
    return json_success(request, data={"linkifiers": linkifiers})


@require_realm_admin
@typed_endpoint
def create_linkifier(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    pattern: str,
    url_template: str,
) -> HttpResponse:
    try:
        linkifier_id = do_add_linkifier(
            realm=user_profile.realm,
            pattern=pattern,
            url_template=url_template,
            acting_user=user_profile,
        )
        return json_success(request, data={"id": linkifier_id})
    except ValidationError as e:
        raise ValidationFailureError(e)


@require_realm_admin
def delete_linkifier(
    request: HttpRequest, user_profile: UserProfile, filter_id: int
) -> HttpResponse:
    try:
        do_remove_linkifier(realm=user_profile.realm, id=filter_id, acting_user=None)
    except RealmFilter.DoesNotExist:
        raise JsonableError(_("Linkifier not found."))
    return json_success(request)


@require_realm_admin
@typed_endpoint
def update_linkifier(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    filter_id: PathOnly[int],
    pattern: str,
    url_template: str,
) -> HttpResponse:
    try:
        do_update_linkifier(
            realm=user_profile.realm,
            id=filter_id,
            pattern=pattern,
            url_template=url_template,
            acting_user=user_profile,
        )
        return json_success(request)
    except RealmFilter.DoesNotExist:
        raise JsonableError(_("Linkifier not found."))
    except ValidationError as e:
        raise ValidationFailureError(e)


@require_realm_admin
@typed_endpoint
def reorder_linkifiers(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    ordered_linkifier_ids: Json[list[int]],
) -> HttpResponse:
    check_reorder_linkifiers(user_profile.realm, ordered_linkifier_ids, acting_user=user_profile)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: realm_logo.py]---
Location: zulip-main/zerver/views/realm_logo.py
Signals: Django, Pydantic

```python
from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect
from django.utils.translation import gettext as _
from pydantic import Json

from zerver.actions.realm_logo import do_change_logo_source
from zerver.decorator import require_realm_admin
from zerver.lib.exceptions import JsonableError
from zerver.lib.realm_logo import get_realm_logo_url
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.upload import get_file_info, upload_logo_image
from zerver.lib.url_encoding import append_url_query_string
from zerver.models import UserProfile


@require_realm_admin
@typed_endpoint
def upload_logo(
    request: HttpRequest, user_profile: UserProfile, *, night: Json[bool]
) -> HttpResponse:
    user_profile.realm.ensure_not_on_limited_plan()

    if len(request.FILES) != 1:
        raise JsonableError(_("You must upload exactly one logo."))
    [logo_file] = request.FILES.values()
    assert isinstance(logo_file, UploadedFile)
    assert logo_file.size is not None
    if logo_file.size > settings.MAX_LOGO_FILE_SIZE_MIB * 1024 * 1024:
        raise JsonableError(
            _("Uploaded file is larger than the allowed limit of {max_size} MiB").format(
                max_size=settings.MAX_LOGO_FILE_SIZE_MIB,
            )
        )
    _filename, content_type = get_file_info(logo_file)
    upload_logo_image(logo_file, user_profile, night, content_type=content_type)
    do_change_logo_source(
        user_profile.realm, user_profile.realm.LOGO_UPLOADED, night, acting_user=user_profile
    )
    return json_success(request)


@require_realm_admin
@typed_endpoint
def delete_logo_backend(
    request: HttpRequest, user_profile: UserProfile, *, night: Json[bool]
) -> HttpResponse:
    # We don't actually delete the logo because it might still
    # be needed if the URL was cached and it is rewritten
    # in any case after next update.
    do_change_logo_source(
        user_profile.realm, user_profile.realm.LOGO_DEFAULT, night, acting_user=user_profile
    )
    return json_success(request)


@typed_endpoint
def get_logo_backend(
    request: HttpRequest, user_profile: UserProfile, *, night: Json[bool]
) -> HttpResponse:
    url = get_realm_logo_url(user_profile.realm, night)

    # We can rely on the URL already having query parameters. Because
    # our templates depend on being able to use the ampersand to
    # add query parameters to our url, get_logo_url does '?version=version_number'
    # hacks to prevent us from having to jump through decode/encode hoops.
    url = append_url_query_string(url, request.META["QUERY_STRING"])
    return redirect(url)
```

--------------------------------------------------------------------------------

---[FILE: realm_playgrounds.py]---
Location: zulip-main/zerver/views/realm_playgrounds.py
Signals: Django, Pydantic

```python
import re
from typing import Annotated

from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import AfterValidator

from zerver.actions.realm_playgrounds import check_add_realm_playground, do_remove_realm_playground
from zerver.actions.realm_settings import do_set_realm_property
from zerver.decorator import require_realm_admin
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import PathOnly, typed_endpoint
from zerver.lib.validator import check_capped_string
from zerver.models import Realm, RealmPlayground, UserProfile


def check_pygments_language(var_name: str, val: object) -> str:
    s = check_capped_string(RealmPlayground.MAX_PYGMENTS_LANGUAGE_LENGTH)(var_name, val)
    # We don't want to restrict the language here to be only from the list of valid
    # Pygments languages. Keeping it open would allow us to hook up a "playground"
    # for custom "languages" that aren't known to Pygments. We use a similar strategy
    # even in our fenced_code Markdown processor.
    valid_pygments_language = re.compile(r"^[ a-zA-Z0-9_+-./#]*$")
    matched_results = valid_pygments_language.match(s)
    if not matched_results:
        raise JsonableError(_("Invalid characters in pygments language"))
    return s


def access_playground_by_id(realm: Realm, playground_id: int) -> RealmPlayground:
    try:
        realm_playground = RealmPlayground.objects.get(id=playground_id, realm=realm)
    except RealmPlayground.DoesNotExist:
        raise JsonableError(_("Invalid playground"))
    return realm_playground


@require_realm_admin
@typed_endpoint
def add_realm_playground(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    name: str,
    pygments_language: Annotated[
        str, AfterValidator(lambda x: check_pygments_language("pygments_language", x))
    ],
    url_template: str,
) -> HttpResponse:
    playground_id = check_add_realm_playground(
        realm=user_profile.realm,
        acting_user=user_profile,
        name=name.strip(),
        pygments_language=pygments_language.strip(),
        url_template=url_template.strip(),
    )
    return json_success(request, data={"id": playground_id})


@require_realm_admin
@typed_endpoint
def delete_realm_playground(
    request: HttpRequest, user_profile: UserProfile, *, playground_id: PathOnly[int]
) -> HttpResponse:
    realm_playground = access_playground_by_id(user_profile.realm, playground_id)
    if user_profile.realm.default_code_block_language == realm_playground.pygments_language:
        do_set_realm_property(
            user_profile.realm, "default_code_block_language", "", acting_user=user_profile
        )
    do_remove_realm_playground(user_profile.realm, realm_playground, acting_user=user_profile)
    return json_success(request)
```

--------------------------------------------------------------------------------

````
