---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 851
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 851 of 1290)

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

---[FILE: message_summary.py]---
Location: zulip-main/zerver/actions/message_summary.py
Signals: Django

```python
import time
from typing import Any

import orjson
from django.conf import settings
from django.utils.timezone import now as timezone_now

from analytics.lib.counts import COUNT_STATS, do_increment_logging_stat
from zerver.lib.markdown import markdown_convert
from zerver.lib.message import messages_for_ids
from zerver.lib.narrow import (
    LARGER_THAN_MAX_MESSAGE_ID,
    NarrowParameter,
    clean_narrow_for_message_fetch,
    fetch_messages,
)
from zerver.models import UserProfile
from zerver.models.realms import MessageEditHistoryVisibilityPolicyEnum

# Maximum number of messages that can be summarized in a single request.
MAX_MESSAGES_SUMMARIZED = 100

ai_time_start = 0.0
ai_total_time = 0.0
ai_total_requests = 0


def get_ai_time() -> float:
    return ai_total_time


def ai_stats_start() -> None:
    global ai_time_start
    ai_time_start = time.time()


def get_ai_requests() -> int:
    return ai_total_requests


def ai_stats_finish() -> None:
    global ai_total_time, ai_total_requests
    ai_total_requests += 1
    ai_total_time += time.time() - ai_time_start


def format_zulip_messages_for_model(zulip_messages: list[dict[str, Any]]) -> str:
    # Format the Zulip messages for processing by the model.
    #
    # - We don't need to encode the recipient, since that's the same for
    #   every message in the conversation.
    # - We use full names to reference senders, since we want the
    #   model to refer to users by name. We may want to experiment
    #   with using silent-mention syntax for users if we move to
    #   Markdown-rendering what the model returns.
    # - We don't include timestamps, since experiments with current models
    #   suggest they do not make relevant use of them.
    # - We haven't figured out a useful way to include reaction metadata (either
    #   the emoji themselves or just the counter).
    # - Polls/TODO widgets are currently sent to the model as empty messages,
    #   since this logic doesn't inspect SubMessage objects.
    zulip_messages_list = [
        {"sender": message["sender_full_name"], "content": message["content"]}
        for message in zulip_messages
    ]
    return orjson.dumps(zulip_messages_list).decode()


def make_message(content: str, role: str = "user") -> dict[str, str]:
    return {"content": content, "role": role}


def get_max_summary_length(conversation_length: int) -> int:
    # Longer summaries work better for longer conversation.
    # TODO: Test more with message content length.
    return min(6, 4 + int((conversation_length - 10) / 10))


def do_summarize_narrow(
    user_profile: UserProfile,
    narrow: list[NarrowParameter] | None,
) -> str | None:
    model = settings.TOPIC_SUMMARIZATION_MODEL
    if model is None:  # nocoverage
        return None

    # TODO: This implementation does not attempt to make use of
    # caching previous summaries of the same conversation or rolling
    # summaries. Doing so correctly will require careful work around
    # invalidation of caches when messages are edited, moved, or sent.
    narrow = clean_narrow_for_message_fetch(narrow, user_profile.realm, user_profile)
    query_info = fetch_messages(
        narrow=narrow,
        user_profile=user_profile,
        realm=user_profile.realm,
        is_web_public_query=False,
        anchor=LARGER_THAN_MAX_MESSAGE_ID,
        include_anchor=True,
        num_before=MAX_MESSAGES_SUMMARIZED,
        num_after=0,
    )

    if len(query_info.rows) == 0:  # nocoverage
        return None

    result_message_ids: list[int] = []
    user_message_flags: dict[int, list[str]] = {}
    for row in query_info.rows:
        message_id = row[0]
        result_message_ids.append(message_id)
        # We skip populating flags, since they would be ignored below anyway.
        user_message_flags[message_id] = []

    message_list = messages_for_ids(
        message_ids=result_message_ids,
        user_message_flags=user_message_flags,
        search_fields={},
        # We currently prefer the plain-text content of messages to
        apply_markdown=False,
        # Avoid wasting resources computing gravatars.
        client_gravatar=True,
        allow_empty_topic_name=False,
        # Avoid fetching edit history, which won't be passed to the model.
        message_edit_history_visibility_policy=MessageEditHistoryVisibilityPolicyEnum.none.value,
        user_profile=user_profile,
        realm=user_profile.realm,
    )

    # IDEA: We could consider translating input and output text to
    # English to improve results when using a summarization model that
    # is primarily trained on English.
    conversation_length = len(message_list)
    max_summary_length = get_max_summary_length(conversation_length)
    intro = "The following is a chat conversation in the Zulip team chat app."
    topic: str | None = None
    channel: str | None = None
    if narrow and len(narrow) == 2:
        for term in narrow:
            assert not term.negated
            if term.operator == "channel":
                channel = term.operand
            if term.operator == "topic":
                topic = term.operand
    if channel:
        intro += f" channel: {channel}"
    if topic:
        intro += f", topic: {topic}"

    formatted_conversation = format_zulip_messages_for_model(message_list)
    prompt = (
        f"Succinctly summarize this conversation based only on the information provided, "
        f"in up to {max_summary_length} sentences, for someone who is familiar with the context. "
        f"Mention key conclusions and actions, if any. Refer to specific people as appropriate. "
        f"Don't use an intro phrase. You can use Zulip's CommonMark based formatting."
    )
    messages = [
        make_message(intro, "system"),
        make_message(formatted_conversation),
        make_message(prompt),
    ]

    # Stats for database queries are tracked separately.
    ai_stats_start()
    # We import litellm here to avoid a DeprecationWarning.
    # See these issues for more info:
    # https://github.com/BerriAI/litellm/issues/6232
    # https://github.com/BerriAI/litellm/issues/5647
    import litellm

    # Token counter is recommended by LiteLLM but mypy says it's not explicitly exported.
    # https://docs.litellm.ai/docs/completion/token_usage#3-token_counter
    # estimated_input_tokens = litellm.token_counter(model=model, messages=messages)  # type: ignore[attr-defined] # Explained above

    # TODO when implementing user plans:
    # - Before querying the model, check whether we've enough tokens left using
    # the estimated token count.
    # - Then increase the `LoggingCountStat` using the estimated token count.
    # (These first two steps should be a short database transaction that
    # locks the `LoggingCountStat` row).
    # - Then query the model.
    # - Then adjust the `LoggingCountStat` by `(actual - estimated)`,
    # being careful to avoid doing this to the next day if the query
    # happened milliseconds before midnight; changing the
    # `LoggingCountStat` we added the estimate to.
    # That way, you can't easily get extra tokens by sending
    # 25 requests all at once when you're just below the limit.

    litellm_params: dict[str, object] = settings.TOPIC_SUMMARIZATION_PARAMETERS
    api_key = settings.TOPIC_SUMMARIZATION_API_KEY
    response = litellm.completion(
        model=model,
        messages=messages,
        api_key=api_key,
        **litellm_params,
    )
    input_tokens = response["usage"]["prompt_tokens"]
    output_tokens = response["usage"]["completion_tokens"]

    # Divide by 1 billion to get actual cost in USD.
    credits_used = (output_tokens * settings.OUTPUT_COST_PER_GIGATOKEN) + (
        input_tokens * settings.INPUT_COST_PER_GIGATOKEN
    )
    ai_stats_finish()

    do_increment_logging_stat(
        user_profile, COUNT_STATS["ai_credit_usage::day"], None, timezone_now(), credits_used
    )

    summary = response["choices"][0]["message"]["content"]
    # TODO: This may want to fetch `MentionData`, in order to be able
    # to process channel or user mentions that might be in the
    # content. Requires a prompt that supports it.
    rendered_summary = markdown_convert(summary, message_realm=user_profile.realm).rendered_content
    return rendered_summary
```

--------------------------------------------------------------------------------

---[FILE: muted_users.py]---
Location: zulip-main/zerver/actions/muted_users.py
Signals: Django

```python
from datetime import datetime

from django.db import transaction
from django.utils.timezone import now as timezone_now

from zerver.actions.message_flags import do_mark_muted_user_messages_as_read
from zerver.lib.muted_users import add_user_mute, get_user_mutes
from zerver.models import MutedUser, RealmAuditLog, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.tornado.django_api import send_event_on_commit


@transaction.atomic(durable=True)
def do_mute_user(
    user_profile: UserProfile,
    muted_user: UserProfile,
    date_muted: datetime | None = None,
) -> None:
    if date_muted is None:
        date_muted = timezone_now()
    add_user_mute(user_profile, muted_user, date_muted)
    do_mark_muted_user_messages_as_read(user_profile, muted_user)
    event = dict(type="muted_users", muted_users=get_user_mutes(user_profile))
    send_event_on_commit(user_profile.realm, event, [user_profile.id])

    RealmAuditLog.objects.create(
        realm=user_profile.realm,
        acting_user=user_profile,
        modified_user=user_profile,
        event_type=AuditLogEventType.USER_MUTED,
        event_time=date_muted,
        extra_data={"muted_user_id": muted_user.id},
    )


@transaction.atomic(durable=True)
def do_unmute_user(mute_object: MutedUser) -> None:
    user_profile = mute_object.user_profile
    muted_user = mute_object.muted_user
    mute_object.delete()
    event = dict(type="muted_users", muted_users=get_user_mutes(user_profile))
    send_event_on_commit(user_profile.realm, event, [user_profile.id])

    RealmAuditLog.objects.create(
        realm=user_profile.realm,
        acting_user=user_profile,
        modified_user=user_profile,
        event_type=AuditLogEventType.USER_UNMUTED,
        event_time=timezone_now(),
        extra_data={"unmuted_user_id": muted_user.id},
    )
```

--------------------------------------------------------------------------------

---[FILE: navigation_views.py]---
Location: zulip-main/zerver/actions/navigation_views.py
Signals: Django

```python
from django.db import transaction
from django.utils.timezone import now as timezone_now

from zerver.lib.navigation_views import get_navigation_view_dict
from zerver.models import NavigationView, RealmAuditLog, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.tornado.django_api import send_event_on_commit


@transaction.atomic(durable=True)
def do_add_navigation_view(
    user: UserProfile,
    fragment: str,
    is_pinned: bool,
    name: str | None = None,
) -> NavigationView:
    navigation_view = NavigationView.objects.create(
        user=user,
        fragment=fragment,
        is_pinned=is_pinned,
        name=name,
    )

    RealmAuditLog.objects.create(
        realm=user.realm,
        acting_user=user,
        modified_user=user,
        event_type=AuditLogEventType.NAVIGATION_VIEW_CREATED,
        event_time=timezone_now(),
        extra_data={"fragment": fragment},
    )

    event = {
        "type": "navigation_view",
        "op": "add",
        "navigation_view": get_navigation_view_dict(navigation_view),
    }
    send_event_on_commit(user.realm, event, [user.id])
    return navigation_view


@transaction.atomic(durable=True)
def do_update_navigation_view(
    user: UserProfile,
    navigation_view: NavigationView,
    is_pinned: bool | None,
    name: str | None = None,
) -> None:
    update_dict: dict[str, str | bool] = {}
    audit_logs_extra_data: list[dict[str, str | bool | None]] = []
    if name is not None:
        old_name = navigation_view.name
        navigation_view.name = name
        update_dict["name"] = name
        audit_logs_extra_data.append(
            {
                "fragment": navigation_view.fragment,
                RealmAuditLog.OLD_VALUE: old_name,
                RealmAuditLog.NEW_VALUE: name,
                "property": "name",
            }
        )

    if is_pinned is not None:
        old_is_pinned_value = navigation_view.is_pinned
        navigation_view.is_pinned = is_pinned
        update_dict["is_pinned"] = is_pinned
        audit_logs_extra_data.append(
            {
                "fragment": navigation_view.fragment,
                RealmAuditLog.OLD_VALUE: old_is_pinned_value,
                RealmAuditLog.NEW_VALUE: is_pinned,
                "property": "is_pinned",
            }
        )

    navigation_view.save(update_fields=["name", "is_pinned"])

    now = timezone_now()
    for audit_log_extra_data in audit_logs_extra_data:
        RealmAuditLog.objects.create(
            realm=user.realm,
            acting_user=user,
            modified_user=user,
            event_type=AuditLogEventType.NAVIGATION_VIEW_UPDATED,
            event_time=now,
            extra_data=audit_log_extra_data,
        )

    event = {
        "type": "navigation_view",
        "op": "update",
        "fragment": navigation_view.fragment,
        "data": update_dict,
    }
    send_event_on_commit(user.realm, event, [user.id])


@transaction.atomic(durable=True)
def do_remove_navigation_view(
    user: UserProfile,
    navigation_view: NavigationView,
) -> None:
    fragment = navigation_view.fragment
    navigation_view.delete()

    RealmAuditLog.objects.create(
        realm=user.realm,
        acting_user=user,
        modified_user=user,
        event_type=AuditLogEventType.NAVIGATION_VIEW_DELETED,
        event_time=timezone_now(),
        extra_data={"fragment": fragment},
    )

    event = {
        "type": "navigation_view",
        "op": "remove",
        "fragment": navigation_view.fragment,
    }
    send_event_on_commit(user.realm, event, [user.id])
```

--------------------------------------------------------------------------------

---[FILE: onboarding_steps.py]---
Location: zulip-main/zerver/actions/onboarding_steps.py
Signals: Django

```python
from django.db import transaction

from zerver.lib.onboarding_steps import get_next_onboarding_steps
from zerver.models import OnboardingStep, UserProfile
from zerver.tornado.django_api import send_event_on_commit


@transaction.atomic(durable=True)
def do_mark_onboarding_step_as_read(user: UserProfile, onboarding_step: str) -> None:
    OnboardingStep.objects.get_or_create(user=user, onboarding_step=onboarding_step)
    event = dict(type="onboarding_steps", onboarding_steps=get_next_onboarding_steps(user))
    send_event_on_commit(user.realm, event, [user.id])
```

--------------------------------------------------------------------------------

---[FILE: presence.py]---
Location: zulip-main/zerver/actions/presence.py
Signals: Django

```python
import logging
import time
from datetime import datetime, timedelta

from django.conf import settings
from django.db import connection, transaction
from psycopg2 import sql

from zerver.actions.user_activity import update_user_activity_interval
from zerver.lib.presence import (
    format_legacy_presence_dict,
    get_modern_user_presence_info,
    user_presence_datetime_with_date_joined_default,
)
from zerver.lib.users import get_user_ids_who_can_access_user
from zerver.models import Client, UserPresence, UserProfile
from zerver.models.clients import get_client
from zerver.models.users import active_user_ids
from zerver.tornado.django_api import send_event_rollback_unsafe

logger = logging.getLogger(__name__)


def send_presence_changed(
    user_profile: UserProfile, presence: UserPresence, *, force_send_update: bool = False
) -> None:
    # Most presence data is sent to clients in the main presence
    # endpoint in response to the user's own presence; this results
    # data that is 1-2 minutes stale for who is online.  The flaw with
    # this plan is when a user comes back online and then immediately
    # sends a message, recipients may still see that user as offline!
    # We solve that by sending an immediate presence update clients.
    #
    # The API documentation explains this interaction in more detail.
    if settings.CAN_ACCESS_ALL_USERS_GROUP_LIMITS_PRESENCE:
        user_ids = get_user_ids_who_can_access_user(user_profile)
    else:
        user_ids = active_user_ids(user_profile.realm_id)

    if (
        len(user_ids) > settings.USER_LIMIT_FOR_SENDING_PRESENCE_UPDATE_EVENTS
        and not force_send_update
    ):
        # These immediate presence generate quadratic work for Tornado
        # (linear number of users in each event and the frequency of
        # users coming online grows linearly with userbase too).  In
        # organizations with thousands of users, this can overload
        # Tornado, especially if much of the realm comes online at the
        # same time.
        #
        # The utility of these live-presence updates goes down as
        # organizations get bigger (since one is much less likely to
        # be paying attention to the sidebar); so beyond a limit, we
        # stop sending them at all.
        return

    last_active_time = user_presence_datetime_with_date_joined_default(
        presence.last_active_time, user_profile.date_joined
    )
    last_connected_time = user_presence_datetime_with_date_joined_default(
        presence.last_connected_time, user_profile.date_joined
    )

    # The mobile app handles these events so we need to use the old format.
    # The format of the event should also account for the slim_presence
    # API parameter when this becomes possible in the future.
    legacy_presence_dict = format_legacy_presence_dict(last_active_time, last_connected_time)
    modern_presence_dict = get_modern_user_presence_info(last_active_time, last_connected_time)
    event = dict(
        type="presence",
        email=user_profile.email,
        user_id=user_profile.id,
        server_timestamp=time.time(),
        legacy_presence={legacy_presence_dict["client"]: legacy_presence_dict},
        modern_presence=modern_presence_dict,
    )
    send_event_rollback_unsafe(user_profile.realm, event, user_ids)


def consolidate_client(client: Client) -> Client:
    # The web app reports a client as 'website'
    # The desktop app reports a client as ZulipDesktop
    # due to it setting a custom user agent. We want both
    # to count as web users

    # Alias ZulipDesktop to website
    if client.name in ["ZulipDesktop"]:
        return get_client("website")
    else:
        return client


# This function takes a very hot lock on the PresenceSequence row for the user's realm.
# Since all presence updates in the realm all compete for this lock, we need to be
# maximally efficient and only hold it as briefly as possible.
# For that reason, we need durable=True to ensure we're not running inside a larger
# transaction, which may stay alive longer than we'd like, holding the lock.
@transaction.atomic(durable=True)
def do_update_user_presence(
    user_profile: UserProfile,
    client: Client,
    log_time: datetime,
    status: int,
    *,
    force_send_update: bool = False,
) -> None:
    # This function requires some careful handling around setting the
    # last_update_id field when updatng UserPresence objects. See the
    # PresenceSequence model and the comments throughout the code for more details.

    client = consolidate_client(client)

    # If the user doesn't have a UserPresence row yet, we create one with
    # sensible defaults. If we're getting a presence update, clearly the user
    # at least connected, so last_connected_time should be set. last_active_time
    # will depend on whether the status sent is idle or active.
    defaults = dict(
        last_active_time=None,
        last_connected_time=log_time,
        realm_id=user_profile.realm_id,
    )
    if status == UserPresence.LEGACY_STATUS_ACTIVE_INT:
        defaults["last_active_time"] = log_time

    try:
        presence = UserPresence.objects.select_for_update().get(user_profile=user_profile)
        creating = False
    except UserPresence.DoesNotExist:
        # We're not ready to write until we know the next last_update_id value.
        # We don't want to hold the lock on PresenceSequence for too long,
        # so we defer that until the last moment.
        # Create the presence object in-memory only for now.
        presence = UserPresence(**defaults, user_profile=user_profile)
        creating = True

    # We initialize these values as a large delta so that if the user
    # was never active, we always treat the user as newly online.
    time_since_last_active_for_comparison = timedelta(days=1)
    time_since_last_connected_for_comparison = timedelta(days=1)
    if presence.last_active_time is not None:
        time_since_last_active_for_comparison = log_time - presence.last_active_time
    if presence.last_connected_time is not None:
        time_since_last_connected_for_comparison = log_time - presence.last_connected_time

    assert (3 * settings.PRESENCE_PING_INTERVAL_SECS + 20) <= settings.OFFLINE_THRESHOLD_SECS
    now_online = time_since_last_active_for_comparison > timedelta(
        # Here, we decide whether the user is newly online, and we need to consider
        # sending an immediate presence update via the events system that this user is now online,
        # rather than waiting for other clients to poll the presence update.
        # Sending these presence update events adds load to the system, so we only want to do this
        # if the user has missed a couple regular presence check-ins
        # (so their state is at least 2 * PRESENCE_PING_INTERVAL_SECS + 10 old),
        # and also is under the risk of being shown by clients as offline before the next regular presence check-in
        # (so at least `settings.OFFLINE_THRESHOLD_SECS - settings.PRESENCE_PING_INTERVAL_SECS - 10`).
        # These two values happen to be the same in the default configuration.
        seconds=settings.OFFLINE_THRESHOLD_SECS - settings.PRESENCE_PING_INTERVAL_SECS - 10
    )
    became_online = status == UserPresence.LEGACY_STATUS_ACTIVE_INT and now_online

    update_fields = []

    # This check is to prevent updating `last_connected_time` several
    # times per minute with multiple connected browser windows.
    # We also need to be careful not to wrongly "update" the timestamp if we actually already
    # have newer presence than the reported log_time.
    if not creating and time_since_last_connected_for_comparison > timedelta(
        seconds=settings.PRESENCE_UPDATE_MIN_FREQ_SECONDS
    ):
        presence.last_connected_time = log_time
        update_fields.append("last_connected_time")
    if (
        not creating
        and status == UserPresence.LEGACY_STATUS_ACTIVE_INT
        and time_since_last_active_for_comparison
        > timedelta(seconds=settings.PRESENCE_UPDATE_MIN_FREQ_SECONDS)
    ):
        presence.last_active_time = log_time
        update_fields.append("last_active_time")
        if presence.last_connected_time is None or log_time > presence.last_connected_time:
            # Update last_connected_time as well to ensure
            # last_connected_time >= last_active_time.
            presence.last_connected_time = log_time
            update_fields.append("last_connected_time")

    # WARNING: Delicate, performance-sensitive block.

    # It's time to determine last_update_id and update the presence object in the database.
    # This briefly takes the crucial lock on the PresenceSequence row for the user's realm.
    # We're doing this in a single SQL query to avoid any unnecessary overhead, in particular
    # database round-trips.
    # We're also intentionally doing this at the very end of the function, at the last step
    # before the transaction commits. This ensures the lock is held for the shortest
    # time possible.
    # Note: The lock isn't acquired explicitly via something like SELECT FOR UPDATE,
    # but rather we rely on the UPDATE statement taking an implicit row lock.

    # Equivalent Python code:
    # if creating or len(update_fields) > 0:
    #     presence_sequence = PresenceSequence.objects.select_for_update().get(realm_id=user_profile.realm_id)
    #     new_last_update_id = presence_sequence.last_update_id + 1
    #     presence_sequence.last_update_id = new_last_update_id
    #     if creating:
    #         presence.last_update_id = new_last_update_id
    #         presence.save()
    #     elif len(update_fields) > 0:
    #         presence.last_update_id = new_last_update_id
    #         presence.save(update_fields=[*update_fields, "last_update_id"])
    #     presence_sequence.save(update_fields=["last_update_id"])
    # But let's do it in a single, direct SQL query instead.

    if creating or len(update_fields) > 0:
        query = sql.SQL("""
            WITH new_last_update_id AS (
                UPDATE zerver_presencesequence
                SET last_update_id = last_update_id + 1
                WHERE realm_id = {realm_id}
                RETURNING last_update_id
            )
        """).format(realm_id=sql.Literal(user_profile.realm_id))

        if creating:
            # There's a small possibility of a race where a different process may have
            # already created a row for this user. Given the extremely close timing
            # of these events, there's no clear reason to prefer one over the other,
            # so we choose the simplest option of DO NOTHING here and let the other
            # concurrent transaction win.
            # This also allows us to avoid sending a spurious presence update event,
            # by checking if the row was actually created.
            query += sql.SQL("""
                INSERT INTO zerver_userpresence (user_profile_id, last_active_time, last_connected_time, realm_id, last_update_id)
                VALUES ({user_profile_id}, {last_active_time}, {last_connected_time}, {realm_id}, (SELECT last_update_id FROM new_last_update_id))
                ON CONFLICT (user_profile_id) DO NOTHING
                """).format(
                user_profile_id=sql.Literal(user_profile.id),
                last_active_time=sql.Literal(presence.last_active_time),
                last_connected_time=sql.Literal(presence.last_connected_time),
                realm_id=sql.Literal(user_profile.realm_id),
            )
        else:
            assert len(update_fields) > 0
            update_fields_segment = sql.SQL(", ").join(
                sql.SQL("{field} = {value}  ").format(
                    field=sql.Identifier(field), value=sql.Literal(getattr(presence, field))
                )
                for field in update_fields
            )
            query += sql.SQL("""
                UPDATE zerver_userpresence
                SET {update_fields_segment}, last_update_id = (SELECT last_update_id FROM new_last_update_id)
                WHERE id = {presence_id}
            """).format(
                update_fields_segment=update_fields_segment, presence_id=sql.Literal(presence.id)
            )

        with connection.cursor() as cursor:
            cursor.execute(query)
            if creating:
                # Check if the row was actually created or if we
                # hit the ON CONFLICT DO NOTHING case.
                actually_created = cursor.rowcount > 0

    if creating and not actually_created:
        # If we ended up doing nothing due to something else creating the row
        # in the meantime, then we shouldn't send an event here.
        logger.info("UserPresence row already created for %s, returning.", user_profile.id)
        return

    if force_send_update or (
        not user_profile.realm.presence_disabled and (creating or became_online)
    ):
        # We do the transaction.on_commit here, rather than inside
        # send_presence_changed, to help keep presence transactions
        # brief; the active_user_ids call there is more expensive than
        # this whole function.
        transaction.on_commit(
            lambda: send_presence_changed(
                user_profile, presence, force_send_update=force_send_update
            )
        )


def update_user_presence(
    user_profile: UserProfile,
    client: Client,
    log_time: datetime,
    status: int,
    new_user_input: bool,
) -> None:
    logger.debug(
        "Processing presence update for user %s, client %s, status %s",
        user_profile.id,
        client,
        status,
    )
    if user_profile.presence_enabled:
        do_update_user_presence(user_profile, client, log_time, status)
    if new_user_input:
        update_user_activity_interval(user_profile, log_time)
```

--------------------------------------------------------------------------------

---[FILE: reactions.py]---
Location: zulip-main/zerver/actions/reactions.py

```python
from typing import Any

from zerver.actions.user_topics import do_set_user_topic_visibility_policy
from zerver.lib.emoji import check_emoji_request, get_emoji_data
from zerver.lib.exceptions import ReactionExistsError
from zerver.lib.message import (
    access_message_and_usermessage,
    event_recipient_ids_for_action_on_messages,
    set_visibility_policy_possible,
    should_change_visibility_policy,
    visibility_policy_for_participation,
)
from zerver.lib.message_cache import update_message_cache
from zerver.lib.streams import access_stream_by_id
from zerver.lib.user_message import create_historical_user_messages
from zerver.models import Message, Reaction, UserProfile
from zerver.tornado.django_api import send_event_on_commit


def notify_reaction_update(
    user_profile: UserProfile, message: Message, reaction: Reaction, op: str
) -> None:
    user_dict = {
        "user_id": user_profile.id,
        "email": user_profile.email,
        "full_name": user_profile.full_name,
    }

    event: dict[str, Any] = {
        "type": "reaction",
        "op": op,
        "user_id": user_profile.id,
        # TODO: We plan to remove this redundant user_dict object once
        # clients are updated to support accessing use user_id.  See
        # https://github.com/zulip/zulip/pull/14711 for details.
        "user": user_dict,
        "message_id": message.id,
        "emoji_name": reaction.emoji_name,
        "emoji_code": reaction.emoji_code,
        "reaction_type": reaction.reaction_type,
    }

    # Update the cached message since new reaction is added.
    update_message_cache([message])

    user_ids = event_recipient_ids_for_action_on_messages([message])
    send_event_on_commit(user_profile.realm, event, list(user_ids))


def do_add_reaction(
    user_profile: UserProfile,
    message: Message,
    emoji_name: str,
    emoji_code: str,
    reaction_type: str,
) -> None:
    """Should be called while holding a SELECT FOR UPDATE lock
    (e.g. via access_message(..., lock_message=True)) on the
    Message row, to prevent race conditions.
    """

    reaction = Reaction(
        user_profile=user_profile,
        message=message,
        emoji_name=emoji_name,
        emoji_code=emoji_code,
        reaction_type=reaction_type,
    )

    reaction.save()

    # Determine and set the visibility_policy depending on 'automatically_follow_topics_policy'
    # and 'automatically_unmute_topics_in_muted_streams_policy'.
    if set_visibility_policy_possible(
        user_profile, message
    ) and UserProfile.AUTOMATICALLY_CHANGE_VISIBILITY_POLICY_ON_PARTICIPATION in [
        user_profile.automatically_follow_topics_policy,
        user_profile.automatically_unmute_topics_in_muted_streams_policy,
    ]:
        stream_id = message.recipient.type_id
        (stream, sub) = access_stream_by_id(user_profile, stream_id)
        assert stream is not None
        if sub:
            new_visibility_policy = visibility_policy_for_participation(user_profile, sub.is_muted)
            if new_visibility_policy and should_change_visibility_policy(
                new_visibility_policy,
                user_profile,
                stream_id,
                topic_name=message.topic_name(),
            ):
                do_set_user_topic_visibility_policy(
                    user_profile=user_profile,
                    stream=stream,
                    topic_name=message.topic_name(),
                    visibility_policy=new_visibility_policy,
                )

    notify_reaction_update(user_profile, message, reaction, "add")


def check_add_reaction(
    user_profile: UserProfile,
    message_id: int,
    emoji_name: str,
    emoji_code: str | None,
    reaction_type: str | None,
) -> None:
    message, user_message = access_message_and_usermessage(
        user_profile, message_id, lock_message=True, is_modifying_message=True
    )

    if emoji_code is None or reaction_type is None:
        emoji_data = get_emoji_data(message.realm_id, emoji_name)

        if emoji_code is None:
            # The emoji_code argument is only required for rare corner
            # cases discussed in the long block comment below.  For simple
            # API clients, we allow specifying just the name, and just
            # look up the code using the current name->code mapping.
            emoji_code = emoji_data.emoji_code

        if reaction_type is None:
            reaction_type = emoji_data.reaction_type

    if Reaction.objects.filter(
        user_profile=user_profile,
        message=message,
        emoji_code=emoji_code,
        reaction_type=reaction_type,
    ).exists():
        raise ReactionExistsError

    query = Reaction.objects.filter(
        message=message, emoji_code=emoji_code, reaction_type=reaction_type
    )
    if query.exists():
        # If another user has already reacted to this message with
        # same emoji code, we treat the new reaction as a vote for the
        # existing reaction.  So the emoji name used by that earlier
        # reaction takes precedence over whatever was passed in this
        # request.  This is necessary to avoid a message having 2
        # "different" emoji reactions with the same emoji code (and
        # thus same image) on the same message, which looks ugly.
        #
        # In this "voting for an existing reaction" case, we shouldn't
        # check whether the emoji code and emoji name match, since
        # it's possible that the (emoji_type, emoji_name, emoji_code)
        # triple for this existing reaction may not pass validation
        # now (e.g. because it is for a realm emoji that has been
        # since deactivated).  We still want to allow users to add a
        # vote any old reaction they see in the UI even if that is a
        # deactivated custom emoji, so we just use the emoji name from
        # the existing reaction with no further validation.
        reaction = query.first()
        assert reaction is not None
        emoji_name = reaction.emoji_name
    else:
        # Otherwise, use the name provided in this request, but verify
        # it is valid in the user's realm (e.g. not a deactivated
        # realm emoji).
        check_emoji_request(user_profile.realm, emoji_name, emoji_code, reaction_type)

    if user_message is None:
        # See called function for more context.
        create_historical_user_messages(user_id=user_profile.id, message_ids=[message.id])

    do_add_reaction(user_profile, message, emoji_name, emoji_code, reaction_type)


def do_remove_reaction(
    user_profile: UserProfile, message: Message, emoji_code: str, reaction_type: str
) -> None:
    """Should be called while holding a SELECT FOR UPDATE lock
    (e.g. via access_message(..., lock_message=True)) on the
    Message row, to prevent race conditions.
    """
    reaction = Reaction.objects.filter(
        user_profile=user_profile,
        message=message,
        emoji_code=emoji_code,
        reaction_type=reaction_type,
    ).get()
    reaction.delete()

    notify_reaction_update(user_profile, message, reaction, "remove")
```

--------------------------------------------------------------------------------

---[FILE: realm_domains.py]---
Location: zulip-main/zerver/actions/realm_domains.py
Signals: Django

```python
from django.db import transaction
from django.utils.timezone import now as timezone_now

from zerver.actions.realm_settings import do_set_realm_property
from zerver.models import Realm, RealmAuditLog, RealmDomain, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.realms import RealmDomainDict, get_realm_domains
from zerver.models.users import active_user_ids
from zerver.tornado.django_api import send_event_on_commit


@transaction.atomic(durable=True)
def do_add_realm_domain(
    realm: Realm, domain: str, allow_subdomains: bool, *, acting_user: UserProfile | None
) -> RealmDomain:
    realm_domain = RealmDomain.objects.create(
        realm=realm, domain=domain, allow_subdomains=allow_subdomains
    )
    added_domain = RealmDomainDict(domain=domain, allow_subdomains=allow_subdomains)

    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.REALM_DOMAIN_ADDED,
        event_time=timezone_now(),
        extra_data={
            "realm_domains": get_realm_domains(realm),
            "added_domain": added_domain,
        },
    )

    event = dict(
        type="realm_domains",
        op="add",
        realm_domain=RealmDomainDict(
            domain=realm_domain.domain, allow_subdomains=realm_domain.allow_subdomains
        ),
    )
    send_event_on_commit(realm, event, active_user_ids(realm.id))

    return realm_domain


@transaction.atomic(durable=True)
def do_change_realm_domain(
    realm_domain: RealmDomain, allow_subdomains: bool, *, acting_user: UserProfile | None
) -> None:
    realm_domain.allow_subdomains = allow_subdomains
    realm_domain.save(update_fields=["allow_subdomains"])
    changed_domain = RealmDomainDict(
        domain=realm_domain.domain,
        allow_subdomains=realm_domain.allow_subdomains,
    )

    RealmAuditLog.objects.create(
        realm=realm_domain.realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.REALM_DOMAIN_CHANGED,
        event_time=timezone_now(),
        extra_data={
            "realm_domains": get_realm_domains(realm_domain.realm),
            "changed_domain": changed_domain,
        },
    )

    event = dict(
        type="realm_domains",
        op="change",
        realm_domain=dict(
            domain=realm_domain.domain, allow_subdomains=realm_domain.allow_subdomains
        ),
    )
    send_event_on_commit(realm_domain.realm, event, active_user_ids(realm_domain.realm_id))


@transaction.atomic(durable=True)
def do_remove_realm_domain(realm_domain: RealmDomain, *, acting_user: UserProfile | None) -> None:
    realm = realm_domain.realm
    domain = realm_domain.domain
    realm_domain.delete()
    removed_domain = RealmDomainDict(
        domain=realm_domain.domain,
        allow_subdomains=realm_domain.allow_subdomains,
    )

    RealmAuditLog.objects.create(
        realm=realm,
        acting_user=acting_user,
        event_type=AuditLogEventType.REALM_DOMAIN_REMOVED,
        event_time=timezone_now(),
        extra_data={
            "realm_domains": get_realm_domains(realm),
            "removed_domain": removed_domain,
        },
    )

    if not RealmDomain.objects.filter(realm=realm).exists() and realm.emails_restricted_to_domains:
        # If this was the last realm domain, we mark the realm as no
        # longer restricted to domain, because the feature doesn't do
        # anything if there are no domains, and this is probably less
        # confusing than the alternative.
        do_set_realm_property(realm, "emails_restricted_to_domains", False, acting_user=acting_user)
    event = dict(type="realm_domains", op="remove", domain=domain)
    send_event_on_commit(realm, event, active_user_ids(realm.id))
```

--------------------------------------------------------------------------------

````
