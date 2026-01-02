---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1096
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1096 of 1290)

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

---[FILE: channel_folders.py]---
Location: zulip-main/zerver/views/channel_folders.py
Signals: Django, Pydantic

```python
from typing import Annotated

from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json, StringConstraints

from zerver.actions.channel_folders import (
    check_add_channel_folder,
    do_archive_channel_folder,
    do_change_channel_folder_description,
    do_change_channel_folder_name,
    do_unarchive_channel_folder,
    try_reorder_realm_channel_folders,
)
from zerver.decorator import require_realm_admin
from zerver.lib.channel_folders import (
    check_channel_folder_in_use,
    check_channel_folder_name,
    get_channel_folder_by_id,
    get_channel_folders_in_realm,
)
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import PathOnly, typed_endpoint
from zerver.models.channel_folders import ChannelFolder
from zerver.models.users import UserProfile


@require_realm_admin
@typed_endpoint
def create_channel_folder(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    description: Annotated[str, StringConstraints(max_length=ChannelFolder.MAX_DESCRIPTION_LENGTH)],
    name: Annotated[str, StringConstraints(max_length=ChannelFolder.MAX_NAME_LENGTH)],
) -> HttpResponse:
    realm = user_profile.realm
    check_channel_folder_name(name, realm)
    channel_folder = check_add_channel_folder(realm, name, description, acting_user=user_profile)

    return json_success(request, data={"channel_folder_id": channel_folder.id})


@typed_endpoint
def get_channel_folders(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    include_archived: Json[bool] = False,
) -> HttpResponse:
    channel_folders = get_channel_folders_in_realm(user_profile.realm, include_archived)
    return json_success(request, data={"channel_folders": channel_folders})


@require_realm_admin
@typed_endpoint
def reorder_realm_channel_folders(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    order: Json[list[int]],
) -> HttpResponse:
    try_reorder_realm_channel_folders(user_profile.realm, order)
    return json_success(request)


@require_realm_admin
@typed_endpoint
def update_channel_folder(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    channel_folder_id: PathOnly[int],
    description: Annotated[
        str | None, StringConstraints(max_length=ChannelFolder.MAX_DESCRIPTION_LENGTH)
    ] = None,
    is_archived: Json[bool] | None = None,
    name: Annotated[str | None, StringConstraints(max_length=ChannelFolder.MAX_NAME_LENGTH)] = None,
) -> HttpResponse:
    channel_folder = get_channel_folder_by_id(channel_folder_id, user_profile.realm)

    if name is not None and channel_folder.name != name:
        check_channel_folder_name(name, user_profile.realm)
        do_change_channel_folder_name(channel_folder, name, acting_user=user_profile)

    if description is not None and channel_folder.description != description:
        do_change_channel_folder_description(channel_folder, description, acting_user=user_profile)

    if is_archived is not None and channel_folder.is_archived != is_archived:
        if is_archived:
            if check_channel_folder_in_use(channel_folder):
                raise JsonableError(
                    _("You need to remove all the channels from this folder to archive it.")
                )

            do_archive_channel_folder(channel_folder, acting_user=user_profile)
        else:
            do_unarchive_channel_folder(channel_folder, acting_user=user_profile)

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: compatibility.py]---
Location: zulip-main/zerver/views/compatibility.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.lib.compatibility import find_mobile_os, version_lt
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.user_agent import parse_user_agent

# Zulip Mobile release 16.2.96 was made 2018-08-22.  It fixed a
# bug in our Android code that causes spammy, obviously-broken
# notifications once the "remove_push_notification" feature is
# enabled on the user's Zulip server.
android_min_app_version = "16.2.96"


def check_global_compatibility(request: HttpRequest) -> HttpResponse:
    if "User-Agent" not in request.headers:
        raise JsonableError(_("User-Agent header missing from request"))

    # This string should not be tagged for translation, since old
    # clients are checking for an extra string.
    legacy_compatibility_error_message = "Client is too old"
    user_agent = parse_user_agent(request.headers["User-Agent"])
    if user_agent["name"] == "ZulipInvalid":
        raise JsonableError(legacy_compatibility_error_message)
    if user_agent["name"] == "ZulipMobile":
        user_os = find_mobile_os(request.headers["User-Agent"])
        if user_os == "android" and version_lt(user_agent["version"], android_min_app_version):
            raise JsonableError(legacy_compatibility_error_message)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: custom_profile_fields.py]---
Location: zulip-main/zerver/views/custom_profile_fields.py
Signals: Django, Pydantic

```python
from typing import Annotated

import orjson
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json, StringConstraints

from zerver.actions.custom_profile_fields import (
    check_remove_custom_profile_field_value,
    do_remove_realm_custom_profile_field,
    do_update_user_custom_profile_data_if_changed,
    try_add_realm_custom_profile_field,
    try_add_realm_default_custom_profile_field,
    try_reorder_realm_custom_profile_fields,
    try_update_realm_custom_profile_field,
)
from zerver.decorator import human_users_only, require_realm_admin
from zerver.lib.exceptions import JsonableError
from zerver.lib.external_accounts import validate_external_account_field_data
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import PathOnly, typed_endpoint
from zerver.lib.types import ProfileDataElementUpdateDict, ProfileFieldData
from zerver.lib.users import validate_user_custom_profile_data
from zerver.lib.validator import check_capped_string, validate_select_field_data
from zerver.models import CustomProfileField, Realm, UserProfile
from zerver.models.custom_profile_fields import custom_profile_fields_for_realm


def list_realm_custom_profile_fields(
    request: HttpRequest, user_profile: UserProfile
) -> HttpResponse:
    fields = custom_profile_fields_for_realm(user_profile.realm_id)
    return json_success(request, data={"custom_fields": [f.as_dict() for f in fields]})


hint_validator = check_capped_string(CustomProfileField.HINT_MAX_LENGTH)
name_validator = check_capped_string(CustomProfileField.NAME_MAX_LENGTH)


def validate_field_name_and_hint(name: str, hint: str) -> None:
    if not name.strip():
        raise JsonableError(_("Label cannot be blank."))

    try:
        hint_validator("hint", hint)
        name_validator("name", name)
    except ValidationError as error:
        raise JsonableError(error.message)


def validate_custom_field_data(field_type: int, field_data: ProfileFieldData) -> None:
    try:
        if field_type == CustomProfileField.SELECT:
            # Choice type field must have at least have one choice
            if len(field_data) < 1:
                raise JsonableError(_("Field must have at least one choice."))
            validate_select_field_data(field_data)
        elif field_type == CustomProfileField.EXTERNAL_ACCOUNT:
            validate_external_account_field_data(field_data)
    except ValidationError as error:
        raise JsonableError(error.message)


def validate_display_in_profile_summary_field(
    field_type: int, display_in_profile_summary: bool
) -> None:
    if not display_in_profile_summary:
        return

    # The LONG_TEXT field type doesn't make sense visually for profile
    # field summaries. The USER field type will require some further
    # client support.
    if field_type in (CustomProfileField.LONG_TEXT, CustomProfileField.USER):
        raise JsonableError(_("Field type not supported for display in profile summary."))


def is_default_external_field(field_type: int, field_data: ProfileFieldData) -> bool:
    if field_type != CustomProfileField.EXTERNAL_ACCOUNT:
        return False
    if field_data["subtype"] == "custom":
        return False
    return True


def validate_custom_profile_field(
    name: str,
    hint: str,
    field_type: int,
    field_data: ProfileFieldData,
    display_in_profile_summary: bool,
) -> None:
    # Validate field data
    validate_custom_field_data(field_type, field_data)

    if not is_default_external_field(field_type, field_data):
        # If field is default external field then we will fetch all data
        # from our default field dictionary, so no need to validate name or hint
        # Validate field name, hint if not default external account field
        validate_field_name_and_hint(name, hint)

    field_types = [i[0] for i in CustomProfileField.FIELD_TYPE_CHOICES]
    if field_type not in field_types:
        raise JsonableError(_("Invalid field type."))

    validate_display_in_profile_summary_field(field_type, display_in_profile_summary)


def validate_custom_profile_field_update(
    field: CustomProfileField,
    display_in_profile_summary: bool | None = None,
    field_data: ProfileFieldData | None = None,
    name: str | None = None,
    hint: str | None = None,
) -> None:
    if name is None:
        name = field.name
    if hint is None:
        hint = field.hint
    if field_data is None:
        if field.field_data == "":
            # We're passing this just for validation, sinec the function won't
            # accept a string. This won't change the actual value.
            field_data = {}
        else:
            field_data = orjson.loads(field.field_data)
    if display_in_profile_summary is None:
        display_in_profile_summary = field.display_in_profile_summary

    assert field_data is not None
    validate_custom_profile_field(
        name,
        hint,
        field.field_type,
        field_data,
        display_in_profile_summary,
    )


def update_only_display_in_profile_summary(
    existing_field: CustomProfileField,
    requested_field_data: ProfileFieldData | None = None,
    requested_name: str | None = None,
    requested_hint: str | None = None,
) -> bool:
    if (
        (requested_name is not None and requested_name != existing_field.name)
        or (requested_hint is not None and requested_hint != existing_field.hint)
        or (
            requested_field_data is not None
            and requested_field_data != orjson.loads(existing_field.field_data)
        )
    ):
        return False
    return True


def display_in_profile_summary_limit_reached(
    realm: Realm, profile_field_id: int | None = None
) -> bool:
    query = CustomProfileField.objects.filter(realm=realm, display_in_profile_summary=True)
    if profile_field_id is not None:
        query = query.exclude(id=profile_field_id)
    return query.count() >= CustomProfileField.MAX_DISPLAY_IN_PROFILE_SUMMARY_FIELDS


@require_realm_admin
@typed_endpoint
def create_realm_custom_profile_field(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    display_in_profile_summary: Json[bool] = False,
    editable_by_user: Json[bool] = True,
    field_data: Json[ProfileFieldData] | None = None,
    field_type: Json[int],
    hint: str = "",
    name: Annotated[str, StringConstraints(strip_whitespace=True)] = "",
    required: Json[bool] = False,
) -> HttpResponse:
    if field_data is None:
        field_data = {}
    if display_in_profile_summary and display_in_profile_summary_limit_reached(user_profile.realm):
        raise JsonableError(
            _("Only 2 custom profile fields can be displayed in the profile summary.")
        )

    validate_custom_profile_field(name, hint, field_type, field_data, display_in_profile_summary)
    try:
        if is_default_external_field(field_type, field_data):
            field_subtype = field_data["subtype"]
            assert isinstance(field_subtype, str)
            field = try_add_realm_default_custom_profile_field(
                realm=user_profile.realm,
                field_subtype=field_subtype,
                display_in_profile_summary=display_in_profile_summary,
                required=required,
                editable_by_user=editable_by_user,
            )
            return json_success(request, data={"id": field.id})
        else:
            field = try_add_realm_custom_profile_field(
                realm=user_profile.realm,
                name=name,
                field_data=field_data,
                field_type=field_type,
                hint=hint,
                display_in_profile_summary=display_in_profile_summary,
                required=required,
                editable_by_user=editable_by_user,
            )
            return json_success(request, data={"id": field.id})
    except IntegrityError:
        raise JsonableError(_("A field with that label already exists."))


@require_realm_admin
def delete_realm_custom_profile_field(
    request: HttpRequest, user_profile: UserProfile, field_id: int
) -> HttpResponse:
    try:
        field = CustomProfileField.objects.get(realm_id=user_profile.realm_id, id=field_id)
    except CustomProfileField.DoesNotExist:
        raise JsonableError(_("Field id {id} not found.").format(id=field_id))

    do_remove_realm_custom_profile_field(realm=user_profile.realm, field=field)
    return json_success(request)


@require_realm_admin
@typed_endpoint
def update_realm_custom_profile_field(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    display_in_profile_summary: Json[bool] | None = None,
    editable_by_user: Json[bool] | None = None,
    field_data: Json[ProfileFieldData] | None = None,
    field_id: PathOnly[int],
    hint: str | None = None,
    name: Annotated[str, StringConstraints(strip_whitespace=True)] | None = None,
    required: Json[bool] | None = None,
) -> HttpResponse:
    realm = user_profile.realm
    try:
        field = CustomProfileField.objects.get(realm=realm, id=field_id)
    except CustomProfileField.DoesNotExist:
        raise JsonableError(_("Field id {id} not found.").format(id=field_id))

    if display_in_profile_summary and display_in_profile_summary_limit_reached(
        user_profile.realm, field.id
    ):
        raise JsonableError(
            _("Only 2 custom profile fields can be displayed in the profile summary.")
        )

    if (
        field.field_type == CustomProfileField.EXTERNAL_ACCOUNT
        # HACK: Allow changing the display_in_profile_summary property
        # of default external account types, but not any others.
        #
        # TODO: Make the name/hint/field_data parameters optional, and
        # explicitly require that the client passes None for all of them for this case.
        # Right now, for name/hint/field_data we allow the client to send the existing
        # values for the respective fields. After this TODO is done, we will only allow
        # the client to pass None values if the field is unchanged.
        and is_default_external_field(field.field_type, orjson.loads(field.field_data))
        and not update_only_display_in_profile_summary(field, field_data, name, hint)
    ):
        raise JsonableError(_("Default custom field cannot be updated."))

    validate_custom_profile_field_update(field, display_in_profile_summary, field_data, name, hint)
    try:
        try_update_realm_custom_profile_field(
            realm=realm,
            field=field,
            name=name,
            hint=hint,
            field_data=field_data,
            display_in_profile_summary=display_in_profile_summary,
            required=required,
            editable_by_user=editable_by_user,
        )
    except IntegrityError:
        raise JsonableError(_("A field with that label already exists."))
    return json_success(request)


@require_realm_admin
@typed_endpoint
def reorder_realm_custom_profile_fields(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    order: Json[list[int]],
) -> HttpResponse:
    try_reorder_realm_custom_profile_fields(user_profile.realm, order)
    return json_success(request)


@human_users_only
@typed_endpoint
def remove_user_custom_profile_data(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    data: Json[list[int]],
) -> HttpResponse:
    with transaction.atomic(durable=True):
        for field_id in data:
            check_remove_custom_profile_field_value(
                user_profile, field_id, acting_user=user_profile
            )
    return json_success(request)


@human_users_only
@typed_endpoint
def update_user_custom_profile_data(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    data: Json[list[ProfileDataElementUpdateDict]],
) -> HttpResponse:
    validate_user_custom_profile_data(user_profile.realm.id, data, acting_user=user_profile)
    with transaction.atomic(durable=True):
        do_update_user_custom_profile_data_if_changed(user_profile, data)
    # We need to call this explicitly otherwise constraints are not check
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: digest.py]---
Location: zulip-main/zerver/views/digest.py
Signals: Django

```python
import time
from datetime import timedelta

from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.template.loader import render_to_string
from django.utils.timezone import now as timezone_now

from zerver.decorator import zulip_login_required
from zerver.lib.digest import DIGEST_CUTOFF, get_digest_context
from zerver.lib.send_email import get_inliner_instance


@zulip_login_required
def digest_page(request: HttpRequest) -> HttpResponse:
    user_profile = request.user
    assert user_profile.is_authenticated
    cutoff = time.mktime((timezone_now() - timedelta(days=DIGEST_CUTOFF)).timetuple())

    context = get_digest_context(user_profile, cutoff)
    context.update(physical_address=settings.PHYSICAL_ADDRESS)

    email_body_html = render_to_string("zerver/emails/digest.html", context, request=request)

    inliner = get_inliner_instance()
    inlined_body = inliner.inline(email_body_html)

    context["inlined_digest_content"] = inlined_body
    final_html = render_to_string("zerver/digest_base.html", context, request=request)

    return HttpResponse(final_html)
```

--------------------------------------------------------------------------------

---[FILE: documentation.py]---
Location: zulip-main/zerver/views/documentation.py
Signals: Django

```python
import os
import random
import re
from collections import OrderedDict
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

import werkzeug
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.template import loader
from django.template.response import TemplateResponse
from django.views.generic import TemplateView
from lxml import html
from lxml.etree import Element, SubElement, XPath, _Element
from markupsafe import Markup
from typing_extensions import override

from zerver.context_processors import zulip_default_context
from zerver.decorator import add_google_analytics_context
from zerver.lib.html_to_text import get_content_description
from zerver.lib.integrations import (
    CATEGORIES,
    INTEGRATIONS,
    META_CATEGORY,
    HubotIntegration,
    IncomingWebhookIntegration,
    Integration,
    PythonAPIIntegration,
    get_all_event_types_for_integration,
)
from zerver.lib.subdomains import get_subdomain
from zerver.lib.templates import render_markdown_path
from zerver.lib.typed_endpoint import PathOnly, typed_endpoint
from zerver.models import Realm
from zerver.openapi.openapi import get_endpoint_from_operationid, get_openapi_summary


@dataclass
class DocumentationArticle:
    article_path: str
    article_http_status: int
    endpoint_path: str | None
    endpoint_method: str | None


def add_api_url_context(
    context: dict[str, Any], request: HttpRequest, is_zilencer_endpoint: bool = False
) -> None:
    context.update(zulip_default_context(request))

    if is_zilencer_endpoint:
        context["api_url"] = (settings.ZULIP_SERVICES_URL or "https://push.zulipchat.com") + "/api"
        return

    subdomain = get_subdomain(request)
    if subdomain != Realm.SUBDOMAIN_FOR_ROOT_DOMAIN or not settings.ROOT_DOMAIN_LANDING_PAGE:
        display_subdomain = subdomain
        html_settings_links = True
    else:
        display_subdomain = "your-org"
        html_settings_links = False

    display_host = Realm.host_for_subdomain(display_subdomain)
    api_url_scheme_relative = display_host + "/api"
    api_url = settings.EXTERNAL_URI_SCHEME + api_url_scheme_relative
    zulip_url = settings.EXTERNAL_URI_SCHEME + display_host

    context["display_subdomain"] = display_subdomain
    context["display_host"] = display_host
    context["external_url_scheme"] = settings.EXTERNAL_URI_SCHEME
    context["api_url"] = api_url
    context["api_url_scheme_relative"] = api_url_scheme_relative
    context["zulip_url"] = zulip_url

    context["html_settings_links"] = html_settings_links


def add_canonical_link_context(context: dict[str, Any], request: HttpRequest) -> None:
    if request.path in ["/api/", "/policies/", "/integrations/"]:
        # Root doc pages have a trailing slash in the canonical URL.
        canonical_path = request.path
    else:
        canonical_path = request.path.removesuffix("/")
    context["REL_CANONICAL_LINK"] = f"https://zulip.com{canonical_path}"


class ApiURLView(TemplateView):
    @override
    def get_context_data(self, **kwargs: Any) -> dict[str, str]:
        context = super().get_context_data(**kwargs)
        add_api_url_context(context, self.request)
        return context


sidebar_headings = XPath("//*[self::h1 or self::h2 or self::h3 or self::h4]")
sidebar_links = XPath("//a[@href=$url]")


class MarkdownDirectoryView(ApiURLView):
    path_template = ""
    policies_view = False
    api_doc_view = False

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self._post_render_callbacks: list[Callable[[HttpResponse], HttpResponse | None]] = []

    def add_post_render_callback(
        self, callback: Callable[[HttpResponse], HttpResponse | None]
    ) -> None:
        self._post_render_callbacks.append(callback)

    def get_path(self, article: str) -> DocumentationArticle:
        # We don't want to allow relative pathnames in `article`
        # as they could introduce security vulnerabilities.
        article = werkzeug.utils.secure_filename(article)

        http_status = 200
        if article == "":
            article = "index"
        elif article == "api-doc-template":
            # This markdown template shouldn't be accessed directly.
            article = "missing"
            http_status = 404
        elif len(article) > 100 or not re.match(r"^[0-9a-zA-Z_-]+$", article):
            article = "missing"  # nocoverage
            http_status = 404  # nocoverage

        path = self.path_template % (article,)
        endpoint_name = None
        endpoint_method = None

        if not self.path_template.startswith("/"):
            # Relative paths only used for policies documentation
            # when it is not configured or in the dev environment
            assert self.policies_view

            try:
                loader.get_template(path)
                return DocumentationArticle(
                    article_path=path,
                    article_http_status=http_status,
                    endpoint_path=endpoint_name,
                    endpoint_method=endpoint_method,
                )
            except loader.TemplateDoesNotExist:
                return DocumentationArticle(
                    article_path=self.path_template % ("missing",),
                    article_http_status=404,
                    endpoint_path=None,
                    endpoint_method=None,
                )

        if not os.path.exists(path):
            if self.api_doc_view:
                try:
                    # API endpoints documented in zerver/openapi/zulip.yaml
                    endpoint_name, endpoint_method = get_endpoint_from_operationid(article)
                    path = self.path_template % ("api-doc-template",)
                except AssertionError:
                    return DocumentationArticle(
                        article_path=self.path_template % ("missing",),
                        article_http_status=404,
                        endpoint_path=None,
                        endpoint_method=None,
                    )
            elif self.policies_view:
                article = "missing"
                http_status = 404
                path = self.path_template % (article,)
            else:
                raise AssertionError("Invalid documentation view type")

        return DocumentationArticle(
            article_path=path,
            article_http_status=http_status,
            endpoint_path=endpoint_name,
            endpoint_method=endpoint_method,
        )

    @override
    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        article = kwargs["article"]
        context: dict[str, Any] = super().get_context_data()

        documentation_article = self.get_path(article)
        context["article"] = documentation_article.article_path
        not_index_page = not context["article"].endswith("/index.md")

        if documentation_article.article_path.startswith("/") and os.path.exists(
            documentation_article.article_path
        ):
            # Absolute path case
            article_absolute_path = documentation_article.article_path
        else:
            # Relative path case
            article_absolute_path = os.path.join(
                settings.DEPLOY_ROOT, "templates", documentation_article.article_path
            )

        if self.policies_view:
            context["page_is_policy_center"] = True
            context["doc_root"] = "/policies/"
            context["doc_root_title"] = "Terms and policies"
            sidebar_article = self.get_path("sidebar_index")
            if sidebar_article.article_http_status == 200:
                sidebar_index = sidebar_article.article_path
            else:
                sidebar_index = None
            title_base = "Zulip terms and policies"
            # We don't add a rel-canonical link to self-hosted server policies docs.
            if settings.CORPORATE_ENABLED:
                add_canonical_link_context(context, self.request)
        elif self.api_doc_view:
            context["page_is_api_center"] = True
            context["doc_root"] = "/api/"
            context["doc_root_title"] = "API documentation"
            sidebar_article = self.get_path("sidebar_index")
            sidebar_index = sidebar_article.article_path
            title_base = "Zulip API documentation"
            add_canonical_link_context(context, self.request)
        else:
            raise AssertionError("Invalid documentation view type")

        # The following is a somewhat hacky approach to extract titles from articles.
        endpoint_name = None
        endpoint_method = None
        is_zilencer_endpoint = False
        if os.path.exists(article_absolute_path):
            with open(article_absolute_path) as article_file:
                first_line = article_file.readlines()[0]
            if self.api_doc_view and context["article"].endswith("api-doc-template.md"):
                endpoint_name, endpoint_method = (
                    documentation_article.endpoint_path,
                    documentation_article.endpoint_method,
                )
                assert endpoint_name is not None
                assert endpoint_method is not None
                article_title = get_openapi_summary(endpoint_name, endpoint_method)
                is_zilencer_endpoint = endpoint_name.startswith("/remotes/")
            elif self.api_doc_view and "{generate_api_header(" in first_line:
                api_operation = context["PAGE_METADATA_URL"].split("/api/")[1]
                endpoint_name, endpoint_method = get_endpoint_from_operationid(api_operation)
                article_title = get_openapi_summary(endpoint_name, endpoint_method)
            else:
                # Strip the header and then use the first line to get the article title
                article_title = first_line.lstrip("#").strip()
                endpoint_name = endpoint_method = None
            if not_index_page:
                context["PAGE_TITLE"] = f"{article_title} | {title_base}"
            else:
                context["PAGE_TITLE"] = title_base
            placeholder_open_graph_description = (
                f"REPLACEMENT_PAGE_DESCRIPTION_{int(2**24 * random.random())}"
            )
            context["PAGE_DESCRIPTION"] = placeholder_open_graph_description

            def update_description(response: HttpResponse) -> None:
                if placeholder_open_graph_description.encode() in response.content:
                    first_paragraph_text = get_content_description(
                        response.content, context["PAGE_METADATA_URL"]
                    )
                    response.content = response.content.replace(
                        placeholder_open_graph_description.encode(),
                        first_paragraph_text.encode(),
                    )

            self.add_post_render_callback(update_description)

        # An "article" might require the api_url_context to be rendered
        api_url_context: dict[str, Any] = {}
        add_api_url_context(api_url_context, self.request, is_zilencer_endpoint)
        api_url_context["run_content_validators"] = True
        context["api_url_context"] = api_url_context
        if endpoint_name and endpoint_method:
            context["api_url_context"]["API_ENDPOINT_NAME"] = endpoint_name + ":" + endpoint_method

        if sidebar_index is not None:
            sidebar_html = render_markdown_path(sidebar_index)
        else:
            sidebar_html = ""
        tree = html.fragment_fromstring(sidebar_html, create_parent=True)
        if not context.get("page_is_policy_center", False):
            home_h1 = Element("h1")
            home_link = SubElement(home_h1, "a")
            home_link.attrib["class"] = "no-underline"
            home_link.attrib["href"] = context["doc_root"]
            home_link.text = context["doc_root_title"] + " home"
            tree.insert(0, home_h1)
        url = context["doc_root"] + article
        # Remove ID attributes from sidebar headings so they don't conflict with index page headings
        headings = sidebar_headings(tree)
        assert isinstance(headings, list)
        for h in headings:
            assert isinstance(h, _Element)
            h.attrib.pop("id", "")
        # Highlight current article link
        links = sidebar_links(tree, url=url)
        assert isinstance(links, list)
        for a in links:
            assert isinstance(a, _Element)
            old_class = a.attrib.get("class", "")
            assert isinstance(old_class, str)
            a.attrib["class"] = old_class + " highlighted"
        context["sidebar_html"] = Markup().join(
            Markup(html.tostring(child, encoding="unicode")) for child in tree
        )

        add_google_analytics_context(context)
        return context

    @override
    def get(
        self, request: HttpRequest, *args: object, article: str = "", **kwargs: object
    ) -> HttpResponse:
        # Hack: It's hard to reinitialize urls.py from tests, and so
        # we want to defer the use of settings.POLICIES_DIRECTORY to
        # runtime.
        if self.policies_view:
            self.path_template = f"{settings.POLICIES_DIRECTORY}/%s.md"

        documentation_article = self.get_path(article)
        http_status = documentation_article.article_http_status
        result = super().get(request, article=article)
        assert isinstance(result, TemplateResponse)
        for callback in self._post_render_callbacks:
            result.add_post_render_callback(callback)
        if http_status != 200:
            result.status_code = http_status
        return result


def add_integrations_open_graph_context(context: dict[str, Any], request: HttpRequest) -> None:
    path_name = request.path.rstrip("/").split("/")[-1]
    description = (
        "Zulip comes with over a hundred native integrations out of the box, "
        "and integrates with Zapier and IFTTT to provide hundreds more. "
        "Connect the apps you use every day to Zulip."
    )

    if path_name in INTEGRATIONS:
        integration = INTEGRATIONS[path_name]
        context["PAGE_TITLE"] = f"{integration.display_name} | Zulip integrations"
        context["PAGE_DESCRIPTION"] = description

    elif path_name in CATEGORIES:
        category = CATEGORIES[path_name]
        if path_name in META_CATEGORY:
            context["PAGE_TITLE"] = f"{category} | Zulip integrations"
        else:
            context["PAGE_TITLE"] = f"{category} tools | Zulip integrations"
        context["PAGE_DESCRIPTION"] = description

    elif path_name == "integrations":
        context["PAGE_TITLE"] = "Zulip integrations"
        context["PAGE_DESCRIPTION"] = description


def build_integration_doc_html(integration: Integration, request: HttpRequest) -> str:
    context: dict[str, Any] = {}
    add_api_url_context(context, request)

    context["integration_name"] = integration.name
    context["integration_display_name"] = integration.display_name
    if isinstance(integration, IncomingWebhookIntegration):
        assert integration.url.startswith("api/")
        context["integration_url"] = integration.url.removeprefix("api")
        all_event_types = get_all_event_types_for_integration(integration)
        if all_event_types is not None:
            context["all_event_types"] = all_event_types
    elif isinstance(integration, HubotIntegration):
        context["hubot_docs_url"] = integration.hubot_docs_url
    elif isinstance(integration, PythonAPIIntegration):
        context["config_file_path"] = (
            f"/usr/local/share/zulip/integrations/{integration.directory_name}/zulip_{integration.directory_name}_config.py"
        )
        context["integration_path"] = (
            f"/usr/local/share/zulip/integrations/{integration.directory_name}"
        )

    return render_markdown_path(integration.doc, context, integration_doc=True)


def add_base_integrations_context(request: HttpRequest) -> dict[str, Any]:
    context: dict[str, Any] = {}
    add_integrations_open_graph_context(context, request)
    add_canonical_link_context(context, request)
    add_google_analytics_context(context)
    return context


def get_visible_integrations_for_category(category_slug: str) -> list[Integration]:
    enabled = sorted(
        (
            integration
            for integration in INTEGRATIONS.values()
            if integration.is_enabled() and not integration.legacy
        ),
        key=lambda integration: integration.name,
    )
    if category_slug == "all":
        return enabled

    category = CATEGORIES.get(category_slug)
    return [integration for integration in enabled if category in integration.categories]


def add_catalog_integrations_context(request: HttpRequest, category_slug: str) -> dict[str, Any]:
    enabled_integrations_count = sum(v.is_enabled() for v in INTEGRATIONS.values())
    # Subtract 1 so saying "Over X integrations" is correct. Then,
    # round down to the nearest multiple of 10.
    integrations_count_display = ((enabled_integrations_count - 1) // 10) * 10

    context = add_base_integrations_context(request)
    context.update(
        {
            "categories_dict": OrderedDict(sorted(CATEGORIES.items())),
            "integrations_count_display": integrations_count_display,
            "selected_category_slug": category_slug,
            "visible_integrations": get_visible_integrations_for_category(category_slug),
        }
    )
    return context


def get_categories_for_integration(integration: Integration) -> list[tuple[str, str]]:
    display_to_slug = {str(display): slug for slug, display in CATEGORIES.items()}
    result = []
    for display_name in integration.get_translated_categories():
        slug = display_to_slug.get(display_name)
        assert slug is not None
        result.append((slug, display_name))

    return result


def add_doc_integrations_context(
    request: HttpRequest, integration: Integration, return_category_slug: str
) -> dict[str, Any]:
    context = add_base_integrations_context(request)
    context.update(
        {
            "selected_integration": integration,
            "integration_doc_html": build_integration_doc_html(integration, request),
            "integration_categories": get_categories_for_integration(integration),
            "return_category_slug": return_category_slug,
        }
    )
    return context


@typed_endpoint
def integrations_catalog(
    request: HttpRequest,
    *,
    category_slug: PathOnly[str],
) -> HttpResponse:
    if category_slug != "all" and category_slug not in CATEGORIES:
        return TemplateResponse(request, "404.html", status=404)

    return TemplateResponse(
        request,
        "zerver/integrations/catalog.html",
        context=add_catalog_integrations_context(request, category_slug),
        status=200,
    )


@typed_endpoint
def integrations_doc(
    request: HttpRequest,
    *,
    integration_name: PathOnly[str],
) -> HttpResponse:
    integration = INTEGRATIONS.get(integration_name)
    if integration is None or not integration.is_enabled():
        return TemplateResponse(request, "404.html", status=404)

    return_category_slug = request.GET.get("category", "all")
    category_slugs = [category[0] for category in get_categories_for_integration(integration)]
    # If we have an invalid slug, back to list points to the root integrations page.
    if return_category_slug != "all" and return_category_slug not in category_slugs:
        return_category_slug = "all"

    return TemplateResponse(
        request,
        "zerver/integrations/doc.html",
        context=add_doc_integrations_context(request, integration, return_category_slug),
        status=200,
    )
```

--------------------------------------------------------------------------------

````
