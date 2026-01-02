---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 968
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 968 of 1290)

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

---[FILE: user_activity.py]---
Location: zulip-main/zerver/models/user_activity.py
Signals: Django

```python
from datetime import timedelta

from django.db import models
from django.db.models import CASCADE

from zerver.models.clients import Client
from zerver.models.users import UserProfile


class UserActivity(models.Model):
    """Data table recording the last time each user hit Zulip endpoints
    via which Clients; unlike UserPresence, these data are not exposed
    to users via the Zulip API.

    Useful for debugging as well as to answer analytics questions like
    "How many users have accessed the Zulip mobile app in the last
    month?" or "Which users/organizations have recently used API
    endpoint X that is about to be desupported" for communications
    and database migration purposes.
    """

    user_profile = models.ForeignKey(UserProfile, on_delete=CASCADE)
    client = models.ForeignKey(Client, on_delete=CASCADE)
    query = models.CharField(max_length=50, db_index=True)

    count = models.IntegerField()
    last_visit = models.DateTimeField("last visit")

    class Meta:
        unique_together = ("user_profile", "client", "query")


class UserActivityInterval(models.Model):
    MIN_INTERVAL_LENGTH = timedelta(minutes=15)

    user_profile = models.ForeignKey(UserProfile, on_delete=CASCADE)
    start = models.DateTimeField("start time", db_index=True)
    end = models.DateTimeField("end time", db_index=True)

    class Meta:
        indexes = [
            models.Index(
                fields=["user_profile", "end"],
                name="zerver_useractivityinterval_user_profile_id_end_bb3bfc37_idx",
            ),
        ]
```

--------------------------------------------------------------------------------

---[FILE: user_topics.py]---
Location: zulip-main/zerver/models/user_topics.py
Signals: Django

```python
from datetime import datetime, timezone

from django.db import models
from django.db.models import CASCADE
from django.db.models.functions import Lower, Upper
from typing_extensions import override

from zerver.models.constants import MAX_TOPIC_NAME_LENGTH
from zerver.models.recipients import Recipient
from zerver.models.streams import Stream
from zerver.models.users import UserProfile


class UserTopic(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=CASCADE)
    stream = models.ForeignKey(Stream, on_delete=CASCADE)
    recipient = models.ForeignKey(Recipient, on_delete=CASCADE)
    topic_name = models.CharField(max_length=MAX_TOPIC_NAME_LENGTH)
    # The default value for last_updated is a few weeks before tracking
    # of when topics were muted was first introduced.  It's designed
    # to be obviously incorrect so that one can tell it's backfilled data.
    last_updated = models.DateTimeField(default=datetime(2020, 1, 1, 0, 0, tzinfo=timezone.utc))

    class VisibilityPolicy(models.IntegerChoices):
        # A normal muted topic. No notifications and unreads hidden.
        MUTED = 1, "Muted topic"

        # This topic will behave like an unmuted topic in an unmuted stream even if it
        # belongs to a muted stream.
        UNMUTED = 2, "Unmuted topic in muted stream"

        # This topic will behave like `UNMUTED`, plus some additional
        # display and/or notifications priority that is TBD and likely to
        # be configurable; see #6027. Not yet implemented.
        FOLLOWED = 3, "Followed topic"

        # Implicitly, if a UserTopic does not exist, the (user, topic)
        # pair should have normal behavior for that (user, stream) pair.

        # We use this in our code to represent the condition in the comment above.
        INHERIT = 0, "User's default policy for the stream."

    visibility_policy = models.SmallIntegerField(
        choices=VisibilityPolicy.choices, default=VisibilityPolicy.MUTED
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "user_profile",
                "stream",
                Lower("topic_name"),
                name="usertopic_case_insensitive_topic_uniq",
            ),
        ]

        indexes = [
            models.Index("stream", Upper("topic_name"), name="zerver_mutedtopic_stream_topic"),
            # This index is designed to optimize queries fetching the
            # set of users who have special policy for a stream,
            # e.g. for the send-message code paths.
            models.Index(
                fields=("stream", "topic_name", "visibility_policy", "user_profile"),
                name="zerver_usertopic_stream_topic_user_visibility_idx",
            ),
            # This index is useful for handling API requests fetching the
            # muted topics for a given user or user/stream pair.
            models.Index(
                fields=("user_profile", "visibility_policy", "stream", "topic_name"),
                name="zerver_usertopic_user_visibility_idx",
            ),
        ]

    @override
    def __str__(self) -> str:
        return f"({self.user_profile.email}, {self.stream.name}, {self.topic_name}, {self.last_updated})"
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: zulip-main/zerver/models/__init__.py

```python
from zerver.models import lookups as lookups
from zerver.models.alert_words import AlertWord as AlertWord
from zerver.models.bots import BotConfigData as BotConfigData
from zerver.models.bots import BotStorageData as BotStorageData
from zerver.models.bots import Service as Service
from zerver.models.channel_folders import ChannelFolder as ChannelFolder
from zerver.models.clients import Client as Client
from zerver.models.custom_profile_fields import CustomProfileField as CustomProfileField
from zerver.models.custom_profile_fields import CustomProfileFieldValue as CustomProfileFieldValue
from zerver.models.drafts import Draft as Draft
from zerver.models.groups import GroupGroupMembership as GroupGroupMembership
from zerver.models.groups import NamedUserGroup as NamedUserGroup
from zerver.models.groups import UserGroup as UserGroup
from zerver.models.groups import UserGroupMembership as UserGroupMembership
from zerver.models.linkifiers import RealmFilter as RealmFilter
from zerver.models.messages import AbstractAttachment as AbstractAttachment
from zerver.models.messages import AbstractEmoji as AbstractEmoji
from zerver.models.messages import AbstractMessage as AbstractMessage
from zerver.models.messages import AbstractReaction as AbstractReaction
from zerver.models.messages import AbstractSubMessage as AbstractSubMessage
from zerver.models.messages import AbstractUserMessage as AbstractUserMessage
from zerver.models.messages import ArchivedAttachment as ArchivedAttachment
from zerver.models.messages import ArchivedMessage as ArchivedMessage
from zerver.models.messages import ArchivedReaction as ArchivedReaction
from zerver.models.messages import ArchivedSubMessage as ArchivedSubMessage
from zerver.models.messages import ArchivedUserMessage as ArchivedUserMessage
from zerver.models.messages import ArchiveTransaction as ArchiveTransaction
from zerver.models.messages import Attachment as Attachment
from zerver.models.messages import ImageAttachment as ImageAttachment
from zerver.models.messages import Message as Message
from zerver.models.messages import OnboardingUserMessage as OnboardingUserMessage
from zerver.models.messages import Reaction as Reaction
from zerver.models.messages import SubMessage as SubMessage
from zerver.models.messages import UserMessage as UserMessage
from zerver.models.muted_users import MutedUser as MutedUser
from zerver.models.navigation_views import NavigationView as NavigationView
from zerver.models.onboarding_steps import OnboardingStep as OnboardingStep
from zerver.models.prereg_users import EmailChangeStatus as EmailChangeStatus
from zerver.models.prereg_users import MultiuseInvite as MultiuseInvite
from zerver.models.prereg_users import PreregistrationRealm as PreregistrationRealm
from zerver.models.prereg_users import PreregistrationUser as PreregistrationUser
from zerver.models.prereg_users import RealmReactivationStatus as RealmReactivationStatus
from zerver.models.presence import UserPresence as UserPresence
from zerver.models.presence import UserStatus as UserStatus
from zerver.models.push_notifications import AbstractPushDevice as AbstractPushDevice
from zerver.models.push_notifications import AbstractPushDeviceToken as AbstractPushDeviceToken
from zerver.models.push_notifications import PushDevice as PushDevice
from zerver.models.push_notifications import PushDeviceToken as PushDeviceToken
from zerver.models.realm_audit_logs import AbstractRealmAuditLog as AbstractRealmAuditLog
from zerver.models.realm_audit_logs import RealmAuditLog as RealmAuditLog
from zerver.models.realm_emoji import RealmEmoji as RealmEmoji
from zerver.models.realm_playgrounds import RealmPlayground as RealmPlayground
from zerver.models.realms import Realm as Realm
from zerver.models.realms import RealmAuthenticationMethod as RealmAuthenticationMethod
from zerver.models.realms import RealmDomain as RealmDomain
from zerver.models.realms import RealmExport as RealmExport
from zerver.models.recipients import DirectMessageGroup as DirectMessageGroup
from zerver.models.recipients import Recipient as Recipient
from zerver.models.saved_snippets import SavedSnippet as SavedSnippet
from zerver.models.scheduled_jobs import AbstractScheduledJob as AbstractScheduledJob
from zerver.models.scheduled_jobs import MissedMessageEmailAddress as MissedMessageEmailAddress
from zerver.models.scheduled_jobs import ScheduledEmail as ScheduledEmail
from zerver.models.scheduled_jobs import ScheduledMessage as ScheduledMessage
from zerver.models.scheduled_jobs import (
    ScheduledMessageNotificationEmail as ScheduledMessageNotificationEmail,
)
from zerver.models.streams import ChannelEmailAddress as ChannelEmailAddress
from zerver.models.streams import DefaultStream as DefaultStream
from zerver.models.streams import DefaultStreamGroup as DefaultStreamGroup
from zerver.models.streams import Stream as Stream
from zerver.models.streams import Subscription as Subscription
from zerver.models.user_activity import UserActivity as UserActivity
from zerver.models.user_activity import UserActivityInterval as UserActivityInterval
from zerver.models.user_topics import UserTopic as UserTopic
from zerver.models.users import RealmUserDefault as RealmUserDefault
from zerver.models.users import UserBaseSettings as UserBaseSettings
from zerver.models.users import UserProfile as UserProfile
```

--------------------------------------------------------------------------------

---[FILE: curl_param_value_generators.py]---
Location: zulip-main/zerver/openapi/curl_param_value_generators.py
Signals: Django

```python
# Zulip's OpenAPI-based API documentation system is documented at
#   https://zulip.readthedocs.io/en/latest/documentation/api.html
#
# This file contains helper functions for generating cURL examples
# based on Zulip's OpenAPI definitions, as well as test setup and
# fetching of appropriate parameter values to use when running the
# cURL examples as part of the tools/test-api test suite.
import re
from collections.abc import Callable
from functools import wraps
from typing import Any, cast

from django.utils.timezone import now as timezone_now

from zerver.actions.channel_folders import check_add_channel_folder
from zerver.actions.create_user import do_create_user
from zerver.actions.presence import update_user_presence
from zerver.actions.reactions import do_add_reaction
from zerver.actions.realm_linkifiers import do_add_linkifier
from zerver.actions.realm_playgrounds import check_add_realm_playground
from zerver.lib.events import do_events_register
from zerver.lib.initial_password import initial_password
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.upload import upload_message_attachment
from zerver.models import Client, Message, NamedUserGroup, UserPresence
from zerver.models.channel_folders import ChannelFolder
from zerver.models.realms import get_realm
from zerver.models.users import UserProfile, get_user
from zerver.openapi.openapi import Parameter

GENERATOR_FUNCTIONS: dict[str, Callable[[], dict[str, object]]] = {}
REGISTERED_GENERATOR_FUNCTIONS: set[str] = set()
CALLED_GENERATOR_FUNCTIONS: set[str] = set()
# This is a List rather than just a string in order to make it easier
# to write to it from another module.
AUTHENTICATION_LINE: list[str] = [""]

helpers = ZulipTestCase()


def openapi_param_value_generator(
    endpoints: list[str],
) -> Callable[[Callable[[], dict[str, object]]], Callable[[], dict[str, object]]]:
    """This decorator is used to register OpenAPI param value generator functions
    with endpoints. Example usage:

    @openapi_param_value_generator(["/messages/render:post"])
    def ...
    """

    def wrapper(generator_func: Callable[[], dict[str, object]]) -> Callable[[], dict[str, object]]:
        @wraps(generator_func)
        def _record_calls_wrapper() -> dict[str, object]:
            CALLED_GENERATOR_FUNCTIONS.add(generator_func.__name__)
            return generator_func()

        REGISTERED_GENERATOR_FUNCTIONS.add(generator_func.__name__)
        for endpoint in endpoints:
            GENERATOR_FUNCTIONS[endpoint] = _record_calls_wrapper

        return _record_calls_wrapper

    return wrapper


def assert_all_helper_functions_called() -> None:
    """Throws an exception if any registered helpers were not called by tests"""
    if REGISTERED_GENERATOR_FUNCTIONS == CALLED_GENERATOR_FUNCTIONS:
        return

    uncalled_functions = str(REGISTERED_GENERATOR_FUNCTIONS - CALLED_GENERATOR_FUNCTIONS)

    raise Exception(f"Registered curl API generators were not called: {uncalled_functions}")


def patch_openapi_example_values(
    entry: str,
    parameters: list[Parameter],
    request_body: dict[str, Any] | None = None,
) -> tuple[list[Parameter], dict[str, object] | None]:
    if entry not in GENERATOR_FUNCTIONS:
        return parameters, request_body
    func = GENERATOR_FUNCTIONS[entry]
    realm_example_values: dict[str, object] = func()

    for parameter in parameters:
        if parameter.name in realm_example_values:
            parameter.example = realm_example_values[parameter.name]

    if request_body is not None and "multipart/form-data" in (content := request_body["content"]):
        properties = content["multipart/form-data"]["schema"]["properties"]
        for key, property in properties.items():
            if key in realm_example_values:
                property["example"] = realm_example_values[key]
    return parameters, request_body


@openapi_param_value_generator(["/fetch_api_key:post"])
def fetch_api_key() -> dict[str, object]:
    email = helpers.example_email("iago")
    password = initial_password(email)

    return {
        "username": email,
        "password": password,
    }


@openapi_param_value_generator(
    [
        "/messages/{message_id}:get",
        "/messages/{message_id}/history:get",
        "/messages/{message_id}:patch",
        "/messages/{message_id}:delete",
        "/messages/{message_id}/reactions:post",
    ]
)
def iago_message_id() -> dict[str, object]:
    iago = helpers.example_user("iago")
    helpers.subscribe(iago, "Denmark")
    return {
        "message_id": helpers.send_stream_message(iago, "Denmark"),
    }


@openapi_param_value_generator(["/messages/{message_id}/reactions:delete"])
def add_emoji_to_message() -> dict[str, object]:
    user_profile = helpers.example_user("iago")

    # Get a message ID by calling the message generator
    message_id = cast(int, iago_message_id()["message_id"])

    emoji_name = "octopus"
    emoji_code = "1f419"
    reaction_type = "unicode_emoji"

    message = Message.objects.select_related(*Message.DEFAULT_SELECT_RELATED).get(id=message_id)
    do_add_reaction(user_profile, message, emoji_name, emoji_code, reaction_type)

    return {
        "message_id": message_id,
    }


@openapi_param_value_generator(["/messages/flags:post"])
def update_flags_message_ids() -> dict[str, object]:
    stream_name = "Venice"
    helpers.subscribe(helpers.example_user("iago"), stream_name)

    messages = [
        helpers.send_stream_message(helpers.example_user("iago"), stream_name) for _ in range(3)
    ]
    return {
        "messages": messages,
    }


@openapi_param_value_generator(["/mark_stream_as_read:post", "/users/me/{stream_id}/topics:get"])
def get_venice_stream_id() -> dict[str, object]:
    return {
        "stream_id": helpers.get_stream_id("Venice"),
    }


@openapi_param_value_generator(["/streams/{stream_id}:patch"])
def update_stream() -> dict[str, object]:
    stream = helpers.subscribe(helpers.example_user("iago"), "temp_stream 1")
    return {
        "stream_id": stream.id,
    }


@openapi_param_value_generator(["/streams/{stream_id}:delete"])
def create_temp_stream_and_get_id() -> dict[str, object]:
    stream = helpers.subscribe(helpers.example_user("iago"), "temp_stream 2")
    return {
        "stream_id": stream.id,
    }


@openapi_param_value_generator(["/mark_topic_as_read:post"])
def get_denmark_stream_id_and_topic() -> dict[str, object]:
    stream_name = "Denmark"
    topic_name = "Tivoli Gardens"

    helpers.subscribe(helpers.example_user("iago"), stream_name)
    helpers.send_stream_message(helpers.example_user("hamlet"), stream_name, topic_name=topic_name)

    return {
        "stream_id": helpers.get_stream_id(stream_name),
        "topic_name": topic_name,
    }


@openapi_param_value_generator(["/users/me/subscriptions/properties:post"])
def update_subscription_data() -> dict[str, object]:
    profile = helpers.example_user("iago")
    helpers.subscribe(profile, "Verona")
    helpers.subscribe(profile, "social")
    return {
        "subscription_data": [
            {"stream_id": helpers.get_stream_id("Verona"), "property": "pin_to_top", "value": True},
            {"stream_id": helpers.get_stream_id("social"), "property": "color", "value": "#f00f00"},
        ],
    }


@openapi_param_value_generator(["/users/me/subscriptions:delete"])
def delete_subscription_data() -> dict[str, object]:
    iago = helpers.example_user("iago")
    zoe = helpers.example_user("ZOE")
    helpers.subscribe(iago, "Verona")
    helpers.subscribe(iago, "social")
    helpers.subscribe(zoe, "Verona")
    helpers.subscribe(zoe, "social")
    return {}


@openapi_param_value_generator(["/events:get"])
def get_events() -> dict[str, object]:
    profile = helpers.example_user("iago")
    helpers.subscribe(profile, "Verona")
    client = Client.objects.create(name="curl-test-client-1")
    response = do_events_register(
        profile, profile.realm, client, event_types=["message", "realm_emoji"]
    )
    helpers.send_stream_message(helpers.example_user("hamlet"), "Verona")
    return {
        "queue_id": response["queue_id"],
        "last_event_id": response["last_event_id"],
    }


@openapi_param_value_generator(["/events:delete"])
def delete_event_queue() -> dict[str, object]:
    profile = helpers.example_user("iago")
    client = Client.objects.create(name="curl-test-client-2")
    response = do_events_register(profile, profile.realm, client, event_types=["message"])
    return {
        "queue_id": response["queue_id"],
        "last_event_id": response["last_event_id"],
    }


@openapi_param_value_generator(["/users/{user_id_or_email}/presence:get"])
def get_user_presence() -> dict[str, object]:
    iago = helpers.example_user("iago")
    client = Client.objects.create(name="curl-test-client-3")
    update_user_presence(iago, client, timezone_now(), UserPresence.LEGACY_STATUS_ACTIVE_INT, False)
    return {}


@openapi_param_value_generator(["/users:post"])
def create_user() -> dict[str, object]:
    return {
        "email": helpers.nonreg_email("test"),
    }


@openapi_param_value_generator(["/users/{email]:patch", "/users/{user_id}:patch"])
def new_email_value() -> dict[str, object]:
    count = 0
    exists = True
    while exists:
        email = f"new{count}@zulip.com"
        exists = UserProfile.objects.filter(delivery_email=email).exists()
        count += 1
    return {
        "new_email": email,
    }


@openapi_param_value_generator(["/user_groups/create:post"])
def create_user_group_data() -> dict[str, object]:
    return {
        "members": [helpers.example_user("hamlet").id, helpers.example_user("othello").id],
    }


@openapi_param_value_generator(["/user_groups/{user_group_id}:patch"])
def get_temp_user_group_id() -> dict[str, object]:
    user_group, _ = NamedUserGroup.objects.get_or_create(
        name="temp",
        realm=get_realm("zulip"),
        can_add_members_group_id=11,
        can_join_group_id=11,
        can_leave_group_id=15,
        can_manage_group_id=11,
        can_mention_group_id=11,
        can_remove_members_group_id=11,
        realm_for_sharding=get_realm("zulip"),
    )
    return {
        "user_group_id": user_group.id,
    }


@openapi_param_value_generator(["/user_groups/{user_group_id}/deactivate:post"])
def get_temp_user_group_id_for_deactivation() -> dict[str, object]:
    user_group, _ = NamedUserGroup.objects.get_or_create(
        name="temp-deactivation",
        realm=get_realm("zulip"),
        can_add_members_group_id=11,
        can_join_group_id=11,
        can_leave_group_id=15,
        can_manage_group_id=11,
        can_mention_group_id=11,
        can_remove_members_group_id=11,
        realm_for_sharding=get_realm("zulip"),
    )
    return {
        "user_group_id": user_group.id,
    }


@openapi_param_value_generator(["/realm/filters/{filter_id}:delete"])
def remove_realm_filters() -> dict[str, object]:
    filter_id = do_add_linkifier(
        get_realm("zulip"),
        "#(?P<id>[0-9]{2,8})",
        "https://github.com/zulip/zulip/pull/{id}",
        acting_user=None,
    )
    return {
        "filter_id": filter_id,
    }


@openapi_param_value_generator(["/realm/emoji/{emoji_name}:post", "/user_uploads:post"])
def upload_custom_emoji() -> dict[str, object]:
    return {
        "filename": "zerver/tests/images/animated_img.gif",
    }


@openapi_param_value_generator(["/realm/playgrounds:post"])
def add_realm_playground() -> dict[str, object]:
    return {
        "name": "Python2 playground",
        "pygments_language": "Python2",
        "url_template": "https://python2.example.com?code={code}",
    }


@openapi_param_value_generator(["/realm/playgrounds/{playground_id}:delete"])
def remove_realm_playground() -> dict[str, object]:
    playground_id = check_add_realm_playground(
        get_realm("zulip"),
        acting_user=None,
        name="Python playground",
        pygments_language="Python",
        url_template="https://python.example.com?code={code}",
    )
    return {
        "playground_id": playground_id,
    }


@openapi_param_value_generator(["/users/{user_id}:delete"])
def deactivate_user() -> dict[str, object]:
    user_profile = do_create_user(
        email="testuser@zulip.com",
        password=None,
        full_name="test_user",
        realm=get_realm("zulip"),
        acting_user=None,
    )
    return {"user_id": user_profile.id}


@openapi_param_value_generator(["/users/me:delete"])
def deactivate_own_user() -> dict[str, object]:
    test_user_email = "delete-test@zulip.com"
    deactivate_test_user = do_create_user(
        test_user_email,
        "secret",
        get_realm("zulip"),
        "Mr. Delete",
        role=200,
        acting_user=None,
    )
    realm = get_realm("zulip")
    test_user = get_user(test_user_email, realm)
    test_user_api_key = test_user.api_key
    # change authentication line to allow test_client to delete itself.
    AUTHENTICATION_LINE[0] = f"{deactivate_test_user.email}:{test_user_api_key}"
    return {}


@openapi_param_value_generator(["/attachments/{attachment_id}:delete"])
def remove_attachment() -> dict[str, object]:
    user_profile = helpers.example_user("iago")
    url = upload_message_attachment("dummy.txt", "text/plain", b"zulip!", user_profile)[0]
    attachment_id = url.replace("/user_uploads/", "").split("/")[0]

    return {"attachment_id": attachment_id}


@openapi_param_value_generator(["/channel_folders:patch"])
def add_channel_folders() -> dict[str, object]:
    user_profile = helpers.example_user("iago")
    realm = user_profile.realm
    check_add_channel_folder(
        realm,
        "General",
        "Channel for general discussions",
        acting_user=user_profile,
    )
    check_add_channel_folder(
        realm,
        "Documentation",
        "Channels for **documentation** discussions",
        acting_user=user_profile,
    )
    check_add_channel_folder(realm, "Memes", "Channels for sharing memes", acting_user=user_profile)
    channel_folders = ChannelFolder.objects.filter(realm=realm)

    return {"order": [folder.id for folder in channel_folders]}


@openapi_param_value_generator(["/user_uploads/{realm_id_str}/{filename}:get"])
def get_temporary_url_for_uploaded_file() -> dict[str, object]:
    realm_id = ""
    filename = ""
    user_profile = helpers.example_user("iago")
    url = upload_message_attachment("dummy.txt", "text/plain", b"zulip!", user_profile)[0]
    upload_path_parts = re.match(r"/user_uploads/(\d+)/(.*)", url)
    if upload_path_parts:
        realm_id = upload_path_parts[1]
        filename = upload_path_parts[2]
    return {"realm_id_str": realm_id, "filename": filename}
```

--------------------------------------------------------------------------------

---[FILE: javascript_examples.js]---
Location: zulip-main/zerver/openapi/javascript_examples.js

```javascript
/*
  Zulip's OpenAPI-based API documentation system is documented at
  https://zulip.readthedocs.io/en/latest/documentation/api.html

  This file contains example code fenced off by comments, and is
  designed to be run as part of Zulip's test-api test suite to verify
  that the documented examples are all correct, runnable code.
*/

import zulipInit from "zulip-js";

const examples_handler = function () {
    const config = {
        username: process.env.ZULIP_USERNAME,
        apiKey: process.env.ZULIP_API_KEY,
        realm: process.env.ZULIP_REALM,
    };
    const examples = {};
    const response_data = [];

    const make_result_object = (example, result, count = false) => {
        const name = count !== false ? `${example.name}_${count}` : example.name;
        return {
            name,
            endpoint: example.endpoint.split(":")[0],
            method: example.endpoint.split(":")[1],
            status_code: example.status_code.toString(),
            result,
        };
    };

    const generate_validation_data = async (client, example) => {
        let count = 0;
        const console = {
            log(result) {
                response_data.push(make_result_object(example, result, count));
                count += 1;
            },
        };
        await example.func(client, console);
    };

    const main = async () => {
        const client = await zulipInit(config);

        await generate_validation_data(client, examples.send_message);
        await generate_validation_data(client, examples.create_user);
        await generate_validation_data(client, examples.get_custom_emoji);
        await generate_validation_data(client, examples.delete_queue);
        await generate_validation_data(client, examples.get_messages);
        await generate_validation_data(client, examples.get_own_user);
        await generate_validation_data(client, examples.get_stream_id);
        await generate_validation_data(client, examples.get_stream_topics);
        await generate_validation_data(client, examples.get_subscriptions);
        await generate_validation_data(client, examples.get_users);
        await generate_validation_data(client, examples.register_queue);
        await generate_validation_data(client, examples.render_message);
        await generate_validation_data(client, examples.set_typing_status);
        await generate_validation_data(client, examples.add_subscriptions);
        await generate_validation_data(client, examples.remove_subscriptions);
        await generate_validation_data(client, examples.update_message_flags);
        await generate_validation_data(client, examples.update_message);
        await generate_validation_data(client, examples.get_events);
        await generate_validation_data(client, examples.get_streams);

        console.log(JSON.stringify(response_data));
        return;
    };

    const add_example = (name, endpoint, status_code, func) => {
        const example = {
            name,
            endpoint,
            status_code,
            func,
        };
        examples[name] = example;
    };

    return {
        main,
        add_example,
    };
};

const {main, add_example} = examples_handler();

const send_test_message = async (client) => {
    const params = {
        to: "Verona",
        type: "stream",
        topic: "Castle",
        // Use some random text for easier debugging if needed. We don't
        // depend on the content of these messages for the tests.
        content: `Random test message ${Math.random()}`,
    };
    const result = await client.messages.send(params);
    // Only return the message id.
    return result.id;
};

// Declare all the examples below.

add_example("send_message", "/messages:post", 200, async (client, console) => {
    // {code_example|start}
    // Send a channel message
    let params = {
        to: "social",
        type: "stream",
        topic: "Castle",
        content: "I come not, friends, to steal away your hearts.",
    };
    console.log(await client.messages.send(params));

    // Send a direct message
    const user_id = 9;
    params = {
        to: [user_id],
        type: "direct",
        content: "With mirth and laughter let old wrinkles come.",
    };
    console.log(await client.messages.send(params));
    // {code_example|end}
});

add_example("create_user", "/users:post", 200, async (client, console) => {
    // {code_example|start}
    const params = {
        email: "notnewbie@zulip.com",
        password: "temp",
        full_name: "New User",
    };

    console.log(await client.users.create(params));
    // {code_example|end}
});

add_example("get_custom_emoji", "/realm/emoji:get", 200, async (client, console) => {
    // {code_example|start}
    console.log(await client.emojis.retrieve());
    // {code_example|end}
});

add_example("delete_queue", "/events:delete", 200, async (client, console) => {
    // {code_example|start}
    // Register a queue
    const queueParams = {
        event_types: ["message"],
    };
    const res = await client.queues.register(queueParams);

    // Delete a queue
    const deregisterParams = {
        queue_id: res.queue_id,
    };

    console.log(await client.queues.deregister(deregisterParams));
    // {code_example|end}
});

add_example("get_messages", "/messages:get", 200, async (client, console) => {
    // {code_example|start}
    const readParams = {
        anchor: "newest",
        num_before: 100,
        num_after: 0,
        narrow: [
            {operator: "sender", operand: "iago@zulip.com"},
            {operator: "channel", operand: "Verona"},
        ],
    };

    // Get the 100 last messages sent by "iago@zulip.com" to the channel "Verona"
    console.log(await client.messages.retrieve(readParams));
    // {code_example|end}
});

add_example("get_own_user", "/users/me:get", 200, async (client, console) => {
    // {code_example|start}
    // Get the profile of the user/bot that requests this endpoint,
    // which is `client` in this case:
    console.log(await client.users.me.getProfile());
    // {code_example|end}
});

add_example("get_stream_id", "/get_stream_id:get", 200, async (client, console) => {
    // {code_example|start}
    // Get the ID of a given channel
    console.log(await client.streams.getStreamId("Denmark"));
    // {code_example|end}
});

add_example(
    "get_stream_topics",
    "/users/me/{stream_id}/topics:get",
    200,
    async (client, console) => {
        // {code_example|start}
        // Get all the topics in channel with ID 1
        console.log(await client.streams.topics.retrieve({stream_id: 1}));
        // {code_example|end}
    },
);

add_example("get_subscriptions", "/users/me/subscriptions:get", 200, async (client, console) => {
    // {code_example|start}
    // Get all channels that the user is subscribed to
    console.log(await client.streams.subscriptions.retrieve());
    // {code_example|end}
});

add_example("get_users", "/users:get", 200, async (client, console) => {
    // {code_example|start}
    // Get all users in the realm
    console.log(await client.users.retrieve());

    // You may pass the `client_gravatar` query parameter as follows:
    console.log(await client.users.retrieve({client_gravatar: true}));
    // {code_example|end}
});

add_example("register_queue", "/register:post", 200, async (client, console) => {
    // {code_example|start}
    // Register a queue
    const params = {
        event_types: ["message"],
    };

    console.log(await client.queues.register(params));
    // {code_example|end}
});

add_example("render_message", "/messages/render:post", 200, async (client, console) => {
    // {code_example|start}
    // Render a message
    const params = {
        content: "**foo**",
    };

    console.log(await client.messages.render(params));
    // {code_example|end}
});

add_example("set_typing_status", "/typing:post", 200, async (client, console) => {
    // {code_example|start}
    const user_id1 = 9;
    const user_id2 = 10;

    const typingParams = {
        op: "start",
        to: [user_id1, user_id2],
    };

    // The user has started typing in the group direct message
    // with Iago and Polonius
    console.log(await client.typing.send(typingParams));
    // {code_example|end}
});

add_example("add_subscriptions", "/users/me/subscriptions:post", 200, async (client, console) => {
    // {code_example|start}
    // Subscribe to the channels "Verona" and "Denmark"
    const meParams = {
        subscriptions: JSON.stringify([{name: "Verona"}, {name: "Denmark"}]),
    };
    console.log(await client.users.me.subscriptions.add(meParams));

    // To subscribe another user to a channel, you may pass in
    // the `principals` parameter, like so:
    const user_id = 7;
    const anotherUserParams = {
        subscriptions: JSON.stringify([{name: "Verona"}, {name: "Denmark"}]),
        principals: JSON.stringify([user_id]),
    };
    console.log(await client.users.me.subscriptions.add(anotherUserParams));
    // {code_example|end}
});

add_example(
    "remove_subscriptions",
    "/users/me/subscriptions:delete",
    200,
    async (client, console) => {
        // {code_example|start}
        // Unsubscribe from the channel "Denmark"
        const meParams = {
            subscriptions: JSON.stringify(["Denmark"]),
        };
        console.log(await client.users.me.subscriptions.remove(meParams));

        const user_id = 7;
        // Unsubscribe Zoe from the channel "Denmark"
        const zoeParams = {
            subscriptions: JSON.stringify(["Denmark"]),
            principals: JSON.stringify([user_id]),
        };
        console.log(await client.users.me.subscriptions.remove(zoeParams));
        // {code_example|end}
    },
);

add_example("update_message_flags", "/messages/flags:post", 200, async (client, console) => {
    // Send 3 messages to run this example on
    const message_ids = [];
    for (let i = 0; i < 3; i += 1) {
        message_ids.push(await send_test_message(client));
    }

    // {code_example|start}
    // Add the "read" flag to the messages with IDs in "message_ids"
    const addflag = {
        messages: message_ids,
        flag: "read",
    };
    console.log(await client.messages.flags.add(addflag));

    // Remove the "starred" flag from the messages with IDs in "message_ids"
    const removeflag = {
        messages: message_ids,
        flag: "starred",
    };
    console.log(await client.messages.flags.remove(removeflag));
    // {code_example|end}
});

add_example("update_message", "/messages/{message_id}:patch", 200, async (client, console) => {
    const request = {
        to: "Denmark",
        type: "stream",
        topic: "Castle",
        content: "I come not, friends, to steal away your hearts.",
    };
    const result = await client.messages.send(request);
    const message_id = result.id;

    // {code_example|start}
    // Update a message with the given "message_id"
    const params = {
        message_id,
        content: "New Content",
    };

    console.log(await client.messages.update(params));
    // {code_example|end}
});

add_example("get_events", "/events:get", 200, async (client, console) => {
    // Register queue to receive messages for user.
    const queueParams = {
        event_types: ["message"],
    };
    const res = await client.queues.register(queueParams);
    const queue_id = res.queue_id;
    // For setup, we send a message to ensure there are events in the
    // queue; this lets the automated tests complete quickly.
    await send_test_message(client);

    // {code_example|start}
    // Retrieve events from a queue with given "queue_id"
    const eventParams = {
        queue_id,
        last_event_id: -1,
    };

    console.log(await client.events.retrieve(eventParams));
    // {code_example|end}
});

add_example("get_streams", "/streams:get", 200, async (client, console) => {
    // {code_example|start}
    // Get all channels that the user has access to
    console.log(await client.streams.retrieve());
    // {code_example|end}
});

main();
```

--------------------------------------------------------------------------------

---[FILE: javascript_examples.py]---
Location: zulip-main/zerver/openapi/javascript_examples.py

```python
# Zulip's OpenAPI-based API documentation system is documented at
#   https://zulip.readthedocs.io/en/latest/documentation/api.html
#
# This Python file wraps the test suite for Zulip's JavaScript API
# examples and validates the responses against our OpenAPI definitions.

import json
import os
import subprocess

from zulip import Client

from zerver.openapi.openapi import validate_against_openapi_schema


def test_js_bindings(client: Client) -> None:
    os.environ["ZULIP_USERNAME"] = client.email
    os.environ["ZULIP_API_KEY"] = client.api_key
    os.environ["ZULIP_REALM"] = client.base_url.removesuffix("/api/")

    output = subprocess.check_output(
        args=["node", "--unhandled-rejections=strict", "zerver/openapi/javascript_examples.js"],
        text=True,
    )
    endpoint_responses = json.loads(output)

    for response_data in endpoint_responses:
        print(f"Testing javascript example: {response_data['name']} ...")
        validate_against_openapi_schema(
            response_data["result"],
            response_data["endpoint"],
            response_data["method"],
            response_data["status_code"],
        )

    print("JavaScript examples validated.")
```

--------------------------------------------------------------------------------

````
