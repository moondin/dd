---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1099
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1099 of 1290)

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

---[FILE: message_send.py]---
Location: zulip-main/zerver/views/message_send.py
Signals: Django, Pydantic

```python
from collections.abc import Iterable, Sequence
from email.headerregistry import Address
from typing import Annotated, Literal, cast

from django.core import validators
from django.core.exceptions import ValidationError
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json

from zerver.actions.message_send import (
    check_send_message,
    compute_irc_user_fullname,
    compute_jabber_user_fullname,
    create_mirror_user_if_needed,
    extract_private_recipients,
    extract_stream_indicator,
)
from zerver.lib.exceptions import JsonableError
from zerver.lib.markdown import render_message_markdown
from zerver.lib.request import RequestNotes
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import (
    DOCUMENTATION_PENDING,
    ApiParamConfig,
    OptionalTopic,
    typed_endpoint,
)
from zerver.lib.zcommand import process_zcommands
from zerver.models import Client, Message, RealmDomain, UserProfile
from zerver.models.users import get_user_including_cross_realm


class InvalidMirrorInputError(Exception):
    pass


def create_mirrored_message_users(
    client: Client,
    user_profile: UserProfile,
    recipients: Iterable[str],
    sender: str,
    recipient_type_name: str,
) -> UserProfile:
    sender_email = sender.strip().lower()
    referenced_users = {sender_email}
    if recipient_type_name == "private":
        referenced_users.update(email.lower() for email in recipients)

    if client.name == "irc_mirror":
        user_check = same_realm_irc_user
        fullname_function = compute_irc_user_fullname
    elif client.name in ("jabber_mirror", "JabberMirror"):
        user_check = same_realm_jabber_user
        fullname_function = compute_jabber_user_fullname
    else:
        raise InvalidMirrorInputError("Unrecognized mirroring client")

    for email in referenced_users:
        # Check that all referenced users are in our realm:
        if not user_check(user_profile, email):
            raise InvalidMirrorInputError("At least one user cannot be mirrored")

    # Create users for the referenced users, if needed.
    for email in referenced_users:
        create_mirror_user_if_needed(user_profile.realm, email, fullname_function)

    sender_user_profile = get_user_including_cross_realm(sender_email, user_profile.realm)
    return sender_user_profile


def same_realm_irc_user(user_profile: UserProfile, email: str) -> bool:
    # Check whether the target email address is an IRC user in the
    # same realm as user_profile, i.e. if the domain were example.com,
    # the IRC user would need to be username@irc.example.com
    try:
        validators.validate_email(email)
    except ValidationError:
        return False

    domain = Address(addr_spec=email).domain.lower()
    domain = domain.removeprefix("irc.")

    # Assumes allow_subdomains=False for all RealmDomain's corresponding to
    # these realms.
    return RealmDomain.objects.filter(realm=user_profile.realm, domain=domain).exists()


def same_realm_jabber_user(user_profile: UserProfile, email: str) -> bool:
    try:
        validators.validate_email(email)
    except ValidationError:
        return False

    # If your Jabber users have a different email domain than the
    # Zulip users, this is where you would do any translation.
    domain = Address(addr_spec=email).domain.lower()

    # Assumes allow_subdomains=False for all RealmDomain's corresponding to
    # these realms.
    return RealmDomain.objects.filter(realm=user_profile.realm, domain=domain).exists()


@typed_endpoint
def send_message_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    forged_str: Annotated[
        str | None, ApiParamConfig("forged", documentation_status=DOCUMENTATION_PENDING)
    ] = None,
    local_id: str | None = None,
    message_content: Annotated[str, ApiParamConfig("content")],
    queue_id: str | None = None,
    read_by_sender: Json[bool] | None = None,
    req_sender: Annotated[
        str | None, ApiParamConfig("sender", documentation_status=DOCUMENTATION_PENDING)
    ] = None,
    req_to: Annotated[str | None, ApiParamConfig("to")] = None,
    req_type: Annotated[Literal["direct", "private", "stream", "channel"], ApiParamConfig("type")],
    time: Annotated[
        Json[float] | None, ApiParamConfig("time", documentation_status=DOCUMENTATION_PENDING)
    ] = None,
    topic_name: OptionalTopic = None,
    widget_content: Annotated[
        str | None, ApiParamConfig("widget_content", documentation_status=DOCUMENTATION_PENDING)
    ] = None,
) -> HttpResponse:
    recipient_type_name = req_type
    if recipient_type_name == "direct":
        # For now, use "private" from Message.API_RECIPIENT_TYPES.
        # TODO: Use "direct" here, as well as in events and
        # message (created, schdeduled, drafts) objects/dicts.
        recipient_type_name = "private"
    elif recipient_type_name == "channel":
        # For now, use "stream" from Message.API_RECIPIENT_TYPES.
        # TODO: Use "channel" here, as well as in events and
        # message (created, schdeduled, drafts) objects/dicts.
        recipient_type_name = "stream"

    # If to is None, then we default to an
    # empty list of recipients.
    message_to: Sequence[int] | Sequence[str] = []

    if req_to is not None:
        if recipient_type_name == "stream":
            stream_indicator = extract_stream_indicator(req_to)

            # For legacy reasons check_send_message expects
            # a list of streams, instead of a single stream.
            #
            # Also, mypy can't detect that a single-item
            # list populated from a Union[int, str] is actually
            # a Union[Sequence[int], Sequence[str]].
            if isinstance(stream_indicator, int):
                message_to = [stream_indicator]
            else:
                message_to = [stream_indicator]
        else:
            message_to = extract_private_recipients(req_to)

    # Temporary hack: We're transitioning `forged` from accepting
    # `yes` to accepting `true` like all of our normal booleans.
    forged = forged_str is not None and forged_str in ["yes", "true"]

    client = RequestNotes.get_notes(request).client
    assert client is not None
    can_forge_sender = user_profile.can_forge_sender
    if forged and not can_forge_sender:
        raise JsonableError(_("User not authorized for this query"))

    realm = user_profile.realm

    if client.name in ["irc_mirror", "jabber_mirror", "JabberMirror"]:
        # Here's how security works for mirroring:
        #
        # For direct messages, the message must be (1) both sent and
        # received exclusively by users in your realm, and (2)
        # received by the forwarding user.
        #
        # For stream messages, the message must be (1) being forwarded
        # by an API superuser for your realm and (2) being sent to a
        # mirrored stream.
        #
        # The most important security checks are in
        # `create_mirrored_message_users` below, which checks the
        # same-realm constraint.
        if req_sender is None:
            raise JsonableError(_("Missing sender"))
        if recipient_type_name != "private" and not can_forge_sender:
            raise JsonableError(_("User not authorized for this query"))

        # For now, mirroring only works with recipient emails, not for
        # recipient user IDs.
        if not all(isinstance(to_item, str) for to_item in message_to):
            raise JsonableError(_("Mirroring not allowed with recipient user IDs"))

        # We need this manual cast so that mypy doesn't complain about
        # create_mirrored_message_users not being able to accept a Sequence[int]
        # type parameter.
        message_to = cast(Sequence[str], message_to)

        try:
            mirror_sender = create_mirrored_message_users(
                client, user_profile, message_to, req_sender, recipient_type_name
            )
        except InvalidMirrorInputError:
            raise JsonableError(_("Invalid mirrored message"))

        sender = mirror_sender
    else:
        if req_sender is not None:
            raise JsonableError(_("Invalid mirrored message"))
        sender = user_profile

    if read_by_sender is None:
        # Legacy default: a message you sent from a non-API client is
        # automatically marked as read for yourself.
        read_by_sender = client.default_read_by_sender()

    data: dict[str, int] = {}
    sent_message_result = check_send_message(
        sender,
        client,
        recipient_type_name,
        message_to,
        topic_name,
        message_content,
        forged=forged,
        forged_timestamp=time,
        forwarder_user_profile=user_profile,
        realm=realm,
        local_id=local_id,
        sender_queue_id=queue_id,
        widget_content=widget_content,
        read_by_sender=read_by_sender,
    )
    data["id"] = sent_message_result.message_id
    if sent_message_result.automatic_new_visibility_policy:
        data["automatic_new_visibility_policy"] = (
            sent_message_result.automatic_new_visibility_policy
        )
    return json_success(request, data=data)


@typed_endpoint
def zcommand_backend(
    request: HttpRequest, user_profile: UserProfile, *, command: str
) -> HttpResponse:
    return json_success(request, data=process_zcommands(command, user_profile))


@typed_endpoint
def render_message_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    content: str,
) -> HttpResponse:
    message = Message()
    message.sender = user_profile
    message.realm = user_profile.realm
    message.content = content
    client = RequestNotes.get_notes(request).client
    assert client is not None
    message.sending_client = client

    rendering_result = render_message_markdown(message, content, realm=user_profile.realm)
    return json_success(request, data={"rendered": rendering_result.rendered_content})
```

--------------------------------------------------------------------------------

---[FILE: message_summary.py]---
Location: zulip-main/zerver/views/message_summary.py
Signals: Django, Pydantic

```python
import warnings

warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")


from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json

from analytics.lib.counts import COUNT_STATS
from zerver.actions.message_summary import do_summarize_narrow
from zerver.lib.exceptions import JsonableError
from zerver.lib.narrow import NarrowParameter
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import UserProfile


@typed_endpoint
def get_messages_summary(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    narrow: Json[list[NarrowParameter] | None] = None,
) -> HttpResponse:
    if settings.TOPIC_SUMMARIZATION_MODEL is None:  # nocoverage
        raise JsonableError(_("AI features are not enabled on this server."))

    if not user_profile.can_summarize_topics():
        raise JsonableError(_("Insufficient permission"))

    if settings.MAX_PER_USER_MONTHLY_AI_COST is not None:
        used_credits = COUNT_STATS["ai_credit_usage::day"].current_month_accumulated_count_for_user(
            user_profile
        )
        if used_credits >= settings.MAX_PER_USER_MONTHLY_AI_COST * 1000000000:
            raise JsonableError(_("Reached monthly limit for AI credits."))

    summary = do_summarize_narrow(user_profile, narrow)
    if summary is None:  # nocoverage
        raise JsonableError(_("No messages in conversation to summarize"))

    return json_success(request, {"summary": summary})
```

--------------------------------------------------------------------------------

---[FILE: muted_users.py]---
Location: zulip-main/zerver/views/muted_users.py
Signals: Django

```python
from django.db import IntegrityError
from django.http import HttpRequest, HttpResponse
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _

from zerver.actions.muted_users import do_mute_user, do_unmute_user
from zerver.lib.exceptions import JsonableError
from zerver.lib.muted_users import get_mute_object
from zerver.lib.response import json_success
from zerver.lib.users import access_user_by_id_including_cross_realm
from zerver.models import UserProfile


def mute_user(request: HttpRequest, user_profile: UserProfile, muted_user_id: int) -> HttpResponse:
    if user_profile.id == muted_user_id:
        raise JsonableError(_("Cannot mute self"))

    # Arguably, access_used_by_id is not quite the right check; in the
    # corner case of a limited guest trying to mute a deactivated user
    # who they no longer have access to because the user was
    # deactivated... it might from a policy perspective be OK to allow
    # that operation even though this API will reject it.
    #
    # But it's quite possibly something nobody will try to do, so we
    # just reuse the existing shared code path.
    muted_user = access_user_by_id_including_cross_realm(
        user_profile, muted_user_id, allow_bots=True, allow_deactivated=True, for_admin=False
    )
    date_muted = timezone_now()

    try:
        do_mute_user(user_profile, muted_user, date_muted)
    except IntegrityError:
        raise JsonableError(_("User already muted"))

    return json_success(request)


def unmute_user(
    request: HttpRequest, user_profile: UserProfile, muted_user_id: int
) -> HttpResponse:
    muted_user = access_user_by_id_including_cross_realm(
        user_profile, muted_user_id, allow_bots=True, allow_deactivated=True, for_admin=False
    )
    mute_object = get_mute_object(user_profile, muted_user)

    if mute_object is None:
        raise JsonableError(_("User is not muted"))

    do_unmute_user(mute_object)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: navigation_views.py]---
Location: zulip-main/zerver/views/navigation_views.py
Signals: Django, Pydantic

```python
from typing import Annotated

from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json, StringConstraints

from zerver.actions.navigation_views import (
    do_add_navigation_view,
    do_remove_navigation_view,
    do_update_navigation_view,
)
from zerver.lib.exceptions import JsonableError
from zerver.lib.navigation_views import get_navigation_view, get_navigation_views_for_user
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import NavigationView, UserProfile

BUILT_IN_VIEW_FRAGMENTS = [
    "inbox",
    "recent",
    "feed",
    "drafts",
    # Reactions view
    "narrow/has/reaction/sender/me",
    # Mentions view
    "narrow/is/mentioned",
    # Starred messages view
    "narrow/is/starred",
    "scheduled",
    "reminders",
]


def get_navigation_views(
    request: HttpRequest,
    user_profile: UserProfile,
) -> HttpResponse:
    """
    Fetch navigation views for the specified user.
    """
    navigation_views = get_navigation_views_for_user(user_profile)
    return json_success(request, data={"navigation_views": navigation_views})


@typed_endpoint
def add_navigation_view(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    fragment: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)],
    is_pinned: Json[bool],
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)] | None = None,
) -> HttpResponse:
    """
    Add a new navigation view (or settings for a default view) for the user.
    """
    if fragment in BUILT_IN_VIEW_FRAGMENTS:
        if name is not None:
            raise JsonableError(_("Built-in views cannot have a custom name."))
    else:
        if not name:
            raise JsonableError(_("Custom views must have a valid name."))

    if NavigationView.objects.filter(user=user_profile, fragment=fragment).exists():
        raise JsonableError(_("Navigation view already exists."))
    if name is not None and NavigationView.objects.filter(user=user_profile, name=name).exists():
        raise JsonableError(_("Navigation view already exists."))

    do_add_navigation_view(
        user_profile,
        fragment,
        is_pinned,
        name,
    )
    return json_success(request)


@typed_endpoint
def update_navigation_view(
    request: HttpRequest,
    user_profile: UserProfile,
    fragment: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)],
    *,
    is_pinned: Json[bool] | None = None,
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)] | None = None,
) -> HttpResponse:
    """
    Update an existing navigation view for the user.
    """
    if fragment in BUILT_IN_VIEW_FRAGMENTS and name is not None:
        raise JsonableError(_("Built-in views cannot have a custom name."))
    if name is not None and NavigationView.objects.filter(user=user_profile, name=name).exists():
        raise JsonableError(_("Navigation view already exists."))

    navigation_view = get_navigation_view(user_profile, fragment)

    do_update_navigation_view(
        user_profile,
        navigation_view,
        is_pinned,
        name,
    )
    return json_success(request)


def remove_navigation_view(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    fragment: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)],
) -> HttpResponse:
    """
    Remove a navigation view for the user.
    """
    navigation_view = get_navigation_view(user_profile, fragment)
    do_remove_navigation_view(user_profile, navigation_view)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: onboarding_steps.py]---
Location: zulip-main/zerver/views/onboarding_steps.py
Signals: Django, Pydantic

```python
from datetime import timedelta

from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from pydantic import Json

from zerver.actions.onboarding_steps import do_mark_onboarding_step_as_read
from zerver.actions.scheduled_messages import check_schedule_message
from zerver.decorator import human_users_only
from zerver.lib.exceptions import JsonableError
from zerver.lib.onboarding_steps import ALL_ONBOARDING_STEPS
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import UserProfile
from zerver.models.clients import get_client
from zerver.models.users import get_system_bot


@human_users_only
@typed_endpoint
def mark_onboarding_step_as_read(
    request: HttpRequest,
    user: UserProfile,
    *,
    onboarding_step: str,
    schedule_navigation_tour_video_reminder_delay: Json[int] | None = None,
) -> HttpResponse:
    if not any(step.name == onboarding_step for step in ALL_ONBOARDING_STEPS):
        raise JsonableError(
            _("Unknown onboarding_step: {onboarding_step}").format(onboarding_step=onboarding_step)
        )

    if schedule_navigation_tour_video_reminder_delay is not None:
        assert onboarding_step == "navigation_tour_video"

        realm = user.realm
        sender = get_system_bot(settings.WELCOME_BOT, realm.id)
        client = get_client("Internal")
        message_content = _("""
You asked to watch the [Welcome to Zulip video]({navigation_tour_video_url}) later. Is this a good time?
""").format(navigation_tour_video_url=settings.NAVIGATION_TOUR_VIDEO_URL)
        deliver_at = timezone_now() + timedelta(
            seconds=schedule_navigation_tour_video_reminder_delay
        )

        check_schedule_message(
            sender,
            client,
            "private",
            [user.id],
            None,
            message_content,
            deliver_at,
            realm,
            skip_events=True,
        )

    do_mark_onboarding_step_as_read(user, onboarding_step)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: presence.py]---
Location: zulip-main/zerver/views/presence.py
Signals: Django, Pydantic

```python
from typing import Annotated, Any

from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from pydantic import Json, StringConstraints

from zerver.actions.presence import update_user_presence
from zerver.actions.user_status import do_update_user_status
from zerver.decorator import human_users_only
from zerver.lib.emoji import check_emoji_request, get_emoji_data
from zerver.lib.exceptions import JsonableError
from zerver.lib.presence import get_presence_for_user, get_presence_response
from zerver.lib.request import RequestNotes
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_timestamp
from zerver.lib.typed_endpoint import ApiParamConfig, PathOnly, typed_endpoint
from zerver.lib.user_status import get_user_status
from zerver.lib.users import access_user_by_id, check_can_access_user
from zerver.models import UserPresence, UserProfile, UserStatus
from zerver.models.users import get_active_user, get_active_user_profile_by_id_in_realm


def get_presence_backend(
    request: HttpRequest, user_profile: UserProfile, user_id_or_email: str
) -> HttpResponse:
    # This isn't used by the web app; it's available for API use by
    # bots and other clients.  We may want to add slim_presence
    # support for it (or just migrate its API wholesale) later.

    try:
        try:
            user_id = int(user_id_or_email)
            target = get_active_user_profile_by_id_in_realm(user_id, user_profile.realm)
        except ValueError:
            email = user_id_or_email
            target = get_active_user(email, user_profile.realm)
    except UserProfile.DoesNotExist:
        raise JsonableError(_("No such user"))

    # Check bot_type here, rather than is_bot, because that matches
    # authenticated_json_view's check of .is_incoming_webhook; the
    # narrow user cache can hence be optimized to only have the
    # nullable bot_type, as long as this check matches.
    if target.bot_type is not None:
        raise JsonableError(_("Presence is not supported for bot users."))

    if settings.CAN_ACCESS_ALL_USERS_GROUP_LIMITS_PRESENCE and not check_can_access_user(
        target, user_profile
    ):
        raise JsonableError(_("Insufficient permission"))

    presence_dict = get_presence_for_user(target.id)
    if len(presence_dict) == 0:
        raise JsonableError(
            _("No presence data for {user_id_or_email}").format(user_id_or_email=user_id_or_email)
        )

    # For initial version, we just include the status and timestamp keys
    result = dict(presence=presence_dict[target.email])
    aggregated_info = result["presence"]["aggregated"]
    aggr_status_duration = datetime_to_timestamp(timezone_now()) - aggregated_info["timestamp"]
    if aggr_status_duration > settings.OFFLINE_THRESHOLD_SECS:
        aggregated_info["status"] = "offline"
    for val in result["presence"].values():
        val.pop("client", None)
        val.pop("pushable", None)
    return json_success(request, data=result)


def get_status_backend(
    request: HttpRequest, user_profile: UserProfile, user_id: int
) -> HttpResponse:
    target_user = access_user_by_id(user_profile, user_id, for_admin=False)
    return json_success(request, data={"status": get_user_status(target_user)})


@human_users_only
@typed_endpoint
def update_user_status_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    away: Json[bool] | None = None,
    emoji_code: str | None = None,
    emoji_name: str | None = None,
    # TODO: emoji_type is the more appropriate name for this parameter, but changing
    # that requires nontrivial work on the API documentation, since it's not clear
    # that the reactions endpoint would prefer such a change.
    emoji_type: Annotated[str | None, ApiParamConfig("reaction_type")] = None,
    status_text: Annotated[
        str | None, StringConstraints(strip_whitespace=True, max_length=60)
    ] = None,
) -> HttpResponse:
    if status_text is not None:
        status_text = status_text.strip()

    if (away is None) and (status_text is None) and (emoji_name is None):
        raise JsonableError(_("Client did not pass any new values."))

    if emoji_name == "":
        # Reset the emoji_code and reaction_type if emoji_name is empty.
        # This should clear the user's configured emoji.
        emoji_code = ""
        emoji_type = UserStatus.UNICODE_EMOJI

    elif emoji_name is not None:
        if emoji_code is None or emoji_type is None:
            emoji_data = get_emoji_data(user_profile.realm_id, emoji_name)
            if emoji_code is None:
                # The emoji_code argument is only required for rare corner
                # cases discussed in the long block comment below.  For simple
                # API clients, we allow specifying just the name, and just
                # look up the code using the current name->code mapping.
                emoji_code = emoji_data.emoji_code

            if emoji_type is None:
                emoji_type = emoji_data.reaction_type

    elif emoji_type or emoji_code:
        raise JsonableError(
            _("Client must pass emoji_name if they pass either emoji_code or reaction_type.")
        )

    # If we're asking to set an emoji (not clear it ("") or not adjust
    # it (None)), we need to verify the emoji is valid.
    if emoji_name not in ["", None]:
        assert emoji_name is not None
        assert emoji_code is not None
        assert emoji_type is not None
        check_emoji_request(user_profile.realm, emoji_name, emoji_code, emoji_type)

    client = RequestNotes.get_notes(request).client
    assert client is not None
    do_update_user_status(
        user_profile=user_profile,
        away=away,
        status_text=status_text,
        client_id=client.id,
        emoji_name=emoji_name,
        emoji_code=emoji_code,
        reaction_type=emoji_type,
    )

    return json_success(request)


@human_users_only
@typed_endpoint
def update_user_status_admin(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    user_id: PathOnly[Json[int]],
    status_text: Annotated[
        str | None, StringConstraints(strip_whitespace=True, max_length=60)
    ] = None,
    emoji_name: str | None = None,
    emoji_code: str | None = None,
    emoji_type: Annotated[str | None, ApiParamConfig("reaction_type")] = None,
) -> HttpResponse:
    target_user = access_user_by_id(user_profile, user_id, for_admin=True)
    return update_user_status_backend(
        request,
        user_profile=target_user,
        status_text=status_text,
        emoji_name=emoji_name,
        emoji_code=emoji_code,
        emoji_type=emoji_type,
    )


@human_users_only
@typed_endpoint
def update_active_status_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    history_limit_days: Json[int] | None = None,
    last_update_id: Json[int] | None = None,
    new_user_input: Json[bool] = False,
    ping_only: Json[bool] = False,
    slim_presence: Json[bool] = False,
    status: str,
) -> HttpResponse:
    if last_update_id is not None:
        # This param being submitted by the client, means they want to use
        # the modern API.
        slim_presence = True

    status_val = UserPresence.status_from_string(status)
    if status_val is None:
        raise JsonableError(_("Invalid status: {status}").format(status=status))

    client = RequestNotes.get_notes(request).client
    assert client is not None
    update_user_presence(user_profile, client, timezone_now(), status_val, new_user_input)

    if ping_only:
        ret: dict[str, Any] = {}
    else:
        ret = get_presence_response(
            user_profile,
            slim_presence,
            last_update_id_fetched_by_client=last_update_id,
            history_limit_days=history_limit_days,
        )

    return json_success(request, data=ret)


def get_statuses_for_realm(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    # This isn't used by the web app; it's available for API use by
    # bots and other clients.  We may want to add slim_presence
    # support for it (or just migrate its API wholesale) later.
    data = get_presence_response(user_profile, slim_presence=False)

    # We're not interested in the last_update_id field in this context.
    data.pop("presence_last_update_id", None)
    return json_success(request, data=data)
```

--------------------------------------------------------------------------------

````
