---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 20
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 20 of 1290)

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

---[FILE: rest-endpoints.md]---
Location: zulip-main/api_docs/include/rest-endpoints.md

```text
#### Messages

* [Send a message](/api/send-message)
* [Upload a file](/api/upload-file)
* [Edit a message](/api/update-message)
* [Delete a message](/api/delete-message)
* [Get messages](/api/get-messages)
* [Construct a narrow](/api/construct-narrow)
* [Add an emoji reaction](/api/add-reaction)
* [Remove an emoji reaction](/api/remove-reaction)
* [Render a message](/api/render-message)
* [Fetch a single message](/api/get-message)
* [Check if messages match a narrow](/api/check-messages-match-narrow)
* [Get a message's edit history](/api/get-message-history)
* [Update personal message flags](/api/update-message-flags)
* [Update personal message flags for narrow](/api/update-message-flags-for-narrow)
* [Mark all messages as read](/api/mark-all-as-read)
* [Mark messages in a channel as read](/api/mark-stream-as-read)
* [Mark messages in a topic as read](/api/mark-topic-as-read)
* [Get a message's read receipts](/api/get-read-receipts)
* [Get temporary URL for an uploaded file](/api/get-file-temporary-url)
* [Report a message](/api/report-message)

#### Scheduled messages

* [Get scheduled messages](/api/get-scheduled-messages)
* [Create a scheduled message](/api/create-scheduled-message)
* [Edit a scheduled message](/api/update-scheduled-message)
* [Delete a scheduled message](/api/delete-scheduled-message)

#### Message reminders

* [Create a message reminder](/api/create-message-reminder)
* [Get reminders](/api/get-reminders)
* [Delete a reminder](/api/delete-reminder)

#### Drafts

* [Get drafts](/api/get-drafts)
* [Create drafts](/api/create-drafts)
* [Edit a draft](/api/edit-draft)
* [Delete a draft](/api/delete-draft)
* [Get all saved snippets](/api/get-saved-snippets)
* [Create a saved snippet](/api/create-saved-snippet)
* [Edit a saved snippet](/api/edit-saved-snippet)
* [Delete a saved snippet](/api/delete-saved-snippet)

#### Navigation views

* [Get all navigation views](/api/get-navigation-views)
* [Add a navigation view](/api/add-navigation-view)
* [Update the navigation view](/api/edit-navigation-view)
* [Remove a navigation view](/api/remove-navigation-view)

#### Channels

* [Get subscribed channels](/api/get-subscriptions)
* [Subscribe to a channel](/api/subscribe)
* [Unsubscribe from a channel](/api/unsubscribe)
* [Get subscription status](/api/get-subscription-status)
* [Get channel subscribers](/api/get-subscribers)
* [Get a user's subscribed channels](/api/get-user-channels)
* [Update subscription settings](/api/update-subscription-settings)
* [Get all channels](/api/get-streams)
* [Get a channel by ID](/api/get-stream-by-id)
* [Get channel ID](/api/get-stream-id)
* [Create a channel](/api/create-channel)
* [Update a channel](/api/update-stream)
* [Archive a channel](/api/archive-stream)
* [Get channel's email address](/api/get-stream-email-address)
* [Get topics in a channel](/api/get-stream-topics)
* [Topic muting](/api/mute-topic)
* [Update personal preferences for a topic](/api/update-user-topic)
* [Delete a topic](/api/delete-topic)
* [Add a default channel](/api/add-default-stream)
* [Remove a default channel](/api/remove-default-stream)
* [Create a channel folder](/api/create-channel-folder)
* [Get channel folders](/api/get-channel-folders)
* [Reorder channel folders](/api/patch-channel-folders)
* [Update a channel folder](/api/update-channel-folder)

#### Users

* [Get a user](/api/get-user)
* [Get a user by email](/api/get-user-by-email)
* [Get own user](/api/get-own-user)
* [Get users](/api/get-users)
* [Create a user](/api/create-user)
* [Update a user](/api/update-user)
* [Update a user by email](/api/update-user-by-email)
* [Deactivate a user](/api/deactivate-user)
* [Deactivate own user](/api/deactivate-own-user)
* [Reactivate a user](/api/reactivate-user)
* [Get a user's status](/api/get-user-status)
* [Update your status](/api/update-status)
* [Update user status](/api/update-status-for-user)
* [Set "typing" status](/api/set-typing-status)
* [Set "typing" status for message editing](/api/set-typing-status-for-message-edit)
* [Get a user's presence](/api/get-user-presence)
* [Get presence of all users](/api/get-presence)
* [Update your presence](/api/update-presence)
* [Get attachments](/api/get-attachments)
* [Delete an attachment](/api/remove-attachment)
* [Update settings](/api/update-settings)
* [Get user groups](/api/get-user-groups)
* [Create a user group](/api/create-user-group)
* [Update a user group](/api/update-user-group)
* [Deactivate a user group](/api/deactivate-user-group)
* [Update user group members](/api/update-user-group-members)
* [Update subgroups of a user group](/api/update-user-group-subgroups)
* [Get user group membership status](/api/get-is-user-group-member)
* [Get user group members](/api/get-user-group-members)
* [Get subgroups of a user group](/api/get-user-group-subgroups)
* [Mute a user](/api/mute-user)
* [Unmute a user](/api/unmute-user)
* [Get all alert words](/api/get-alert-words)
* [Add alert words](/api/add-alert-words)
* [Remove alert words](/api/remove-alert-words)

#### Invitations

* [Get all invitations](/api/get-invites)
* [Send invitations](/api/send-invites)
* [Create a reusable invitation link](/api/create-invite-link)
* [Resend an email invitation](/api/resend-email-invite)
* [Revoke an email invitation](/api/revoke-email-invite)
* [Revoke a reusable invitation link](/api/revoke-invite-link)

#### Server & organizations

* [Get server settings](/api/get-server-settings)
* [Get linkifiers](/api/get-linkifiers)
* [Add a linkifier](/api/add-linkifier)
* [Update a linkifier](/api/update-linkifier)
* [Remove a linkifier](/api/remove-linkifier)
* [Reorder linkifiers](/api/reorder-linkifiers)
* [Add a code playground](/api/add-code-playground)
* [Remove a code playground](/api/remove-code-playground)
* [Get all custom emoji](/api/get-custom-emoji)
* [Upload custom emoji](/api/upload-custom-emoji)
* [Deactivate custom emoji](/api/deactivate-custom-emoji)
* [Get all custom profile fields](/api/get-custom-profile-fields)
* [Reorder custom profile fields](/api/reorder-custom-profile-fields)
* [Create a custom profile field](/api/create-custom-profile-field)
* [Update realm-level defaults of user settings](/api/update-realm-user-settings-defaults)
* [Get all data exports](/api/get-realm-exports)
* [Create a data export](/api/export-realm)
* [Get data export consent state](/api/get-realm-export-consents)
* [Test welcome bot custom message](/api/test-welcome-bot-custom-message)

#### Real-time events

* [Real time events API](/api/real-time-events)
* [Register an event queue](/api/register-queue)
* [Get events from an event queue](/api/get-events)
* [Delete an event queue](/api/delete-queue)

#### Specialty endpoints

* [Fetch an API key (production)](/api/fetch-api-key)
* [Fetch an API key (development only)](/api/dev-fetch-api-key)
* [Send an E2EE test notification to mobile device(s)](/api/e2ee-test-notify)
* [Register E2EE push device](/api/register-push-device)
* [Register E2EE push device to bouncer](/api/register-remote-push-device)
* [Mobile notifications](/api/mobile-notifications)
* [Send a test notification to mobile device(s)](/api/test-notify)
* [Add an APNs device token](/api/add-apns-token)
* [Remove an APNs device token](/api/remove-apns-token)
* [Add an FCM registration token](/api/add-fcm-token)
* [Remove an FCM registration token](/api/remove-fcm-token)
* [Create BigBlueButton video call](/api/create-big-blue-button-video-call)
* [Outgoing webhook payloads](/api/outgoing-webhook-payload)
```

--------------------------------------------------------------------------------

---[FILE: CHANGELOG.txt]---
Location: zulip-main/confirmation/CHANGELOG.txt

```text
=============================
Django Confirmation Changelog
=============================
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.txt]---
Location: zulip-main/confirmation/LICENSE.txt

```text
Copyright (c) 2008, Jarek Zgoda <jarek.zgoda@gmail.com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above
      copyright notice, this list of conditions and the following
      disclaimer in the documentation and/or other materials provided
      with the distribution.
    * Neither the name of the author nor the names of other
      contributors may be used to endorse or promote products derived
      from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: zulip-main/confirmation/models.py
Signals: Django

```python
# Copyright: (c) 2008, Jarek Zgoda <jarek.zgoda@gmail.com>

__revision__ = "$Id: models.py 28 2009-10-22 15:03:02Z jarek.zgoda $"
import secrets
from base64 import b32encode
from collections.abc import Mapping
from datetime import timedelta
from typing import TypeAlias, Union, cast
from urllib.parse import urljoin

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import CASCADE
from django.http import HttpRequest, HttpResponse
from django.template.response import TemplateResponse
from django.urls import reverse
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from confirmation import settings as confirmation_settings
from zerver.lib.types import UNSET, Unset
from zerver.models import (
    EmailChangeStatus,
    MultiuseInvite,
    PreregistrationRealm,
    PreregistrationUser,
    Realm,
    RealmReactivationStatus,
    UserProfile,
)
from zerver.models.prereg_users import RealmCreationStatus

if settings.ZILENCER_ENABLED:
    from zilencer.models import (
        PreregistrationRemoteRealmBillingUser,
        PreregistrationRemoteServerBillingUser,
    )


class ConfirmationKeyError(Exception):
    WRONG_LENGTH = 1
    EXPIRED = 2
    DOES_NOT_EXIST = 3

    def __init__(self, error_type: int) -> None:
        super().__init__()
        self.error_type = error_type


def render_confirmation_key_error(
    request: HttpRequest, exception: ConfirmationKeyError
) -> HttpResponse:
    if exception.error_type == ConfirmationKeyError.WRONG_LENGTH:
        return TemplateResponse(request, "confirmation/link_malformed.html", status=404)
    if exception.error_type == ConfirmationKeyError.EXPIRED:
        return TemplateResponse(request, "confirmation/link_expired.html", status=404)
    return TemplateResponse(request, "confirmation/link_does_not_exist.html", status=404)


def generate_key() -> str:
    # 24 characters * 5 bits of entropy/character = 120 bits of entropy
    return b32encode(secrets.token_bytes(15)).decode().lower()


NoZilencerConfirmationObjT: TypeAlias = (
    MultiuseInvite
    | PreregistrationRealm
    | PreregistrationUser
    | EmailChangeStatus
    | UserProfile
    | RealmReactivationStatus
    | RealmCreationStatus
)
ZilencerConfirmationObjT: TypeAlias = Union[
    NoZilencerConfirmationObjT,
    "PreregistrationRemoteServerBillingUser",
    "PreregistrationRemoteRealmBillingUser",
]

ConfirmationObjT: TypeAlias = NoZilencerConfirmationObjT | ZilencerConfirmationObjT


def get_object_from_key(
    confirmation_key: str,
    confirmation_types: list[int],
    *,
    mark_object_used: bool,
    allow_used: bool = False,
) -> ConfirmationObjT:
    """Access a confirmation object from one of the provided confirmation
    types with the provided key.

    The mark_object_used parameter determines whether to mark the
    confirmation object as used (which generally prevents it from
    being used again). It should always be False for MultiuseInvite
    objects, since they are intended to be used multiple times.

    By default, used confirmation objects cannot be used again as part
    of their security model.
    """

    # Confirmation keys used to be 40 characters
    if len(confirmation_key) not in (24, 40):
        raise ConfirmationKeyError(ConfirmationKeyError.WRONG_LENGTH)
    try:
        confirmation = Confirmation.objects.get(
            confirmation_key=confirmation_key, type__in=confirmation_types
        )
    except Confirmation.DoesNotExist:
        raise ConfirmationKeyError(ConfirmationKeyError.DOES_NOT_EXIST)

    if confirmation.expiry_date is not None and timezone_now() > confirmation.expiry_date:
        raise ConfirmationKeyError(ConfirmationKeyError.EXPIRED)

    obj = confirmation.content_object
    assert obj is not None

    forbidden_statuses = {confirmation_settings.STATUS_REVOKED}
    if not allow_used:
        forbidden_statuses.add(confirmation_settings.STATUS_USED)

    if hasattr(obj, "status") and obj.status in forbidden_statuses:
        # Confirmations where the object has the status attribute are one-time use
        # and are marked after being revoked (or used).
        raise ConfirmationKeyError(ConfirmationKeyError.EXPIRED)

    if mark_object_used:
        # MultiuseInvite objects do not use the STATUS_USED status, since they are
        # intended to be used more than once.
        assert confirmation.type != Confirmation.MULTIUSE_INVITE
        assert hasattr(obj, "status")
        obj.status = getattr(settings, "STATUS_USED", 1)
        obj.save(update_fields=["status"])
    return obj


def create_confirmation_object(
    obj: ConfirmationObjT,
    confirmation_type: int,
    *,
    validity_in_minutes: int | None | Unset = UNSET,
    no_associated_realm_object: bool = False,
) -> "Confirmation":
    # validity_in_minutes is an override for the default values which are
    # determined by the confirmation_type - its main purpose is for use
    # in tests which may want to have control over the exact expiration time.
    key = generate_key()

    # Some confirmation objects, like those for realm creation or those used
    # for the self-hosted management flows, are not associated with a realm
    # hosted by this Zulip server.
    if no_associated_realm_object:
        realm = None
    else:
        obj = cast(NoZilencerConfirmationObjT, obj)
        assert not isinstance(obj, PreregistrationRealm | RealmCreationStatus)
        realm = obj.realm

    current_time = timezone_now()
    expiry_date = None
    if not isinstance(validity_in_minutes, Unset):
        if validity_in_minutes is None:
            expiry_date = None
        else:
            assert validity_in_minutes is not None
            expiry_date = current_time + timedelta(minutes=validity_in_minutes)
    else:
        expiry_date = current_time + timedelta(days=_properties[confirmation_type].validity_in_days)

    return Confirmation.objects.create(
        content_object=obj,
        date_sent=current_time,
        confirmation_key=key,
        realm=realm,
        expiry_date=expiry_date,
        type=confirmation_type,
    )


def create_confirmation_link(
    obj: ConfirmationObjT,
    confirmation_type: int,
    *,
    validity_in_minutes: int | None | Unset = UNSET,
    url_args: Mapping[str, str] = {},
    no_associated_realm_object: bool = False,
) -> str:
    conf = create_confirmation_object(
        obj,
        confirmation_type,
        validity_in_minutes=validity_in_minutes,
        no_associated_realm_object=no_associated_realm_object,
    )
    result = confirmation_url_for(
        conf,
        url_args=url_args,
    )
    return result


def confirmation_url_for(confirmation_obj: "Confirmation", url_args: Mapping[str, str] = {}) -> str:
    return confirmation_url(
        confirmation_obj.confirmation_key, confirmation_obj.realm, confirmation_obj.type, url_args
    )


def confirmation_url(
    confirmation_key: str,
    realm: Realm | None,
    confirmation_type: int,
    url_args: Mapping[str, str] = {},
) -> str:
    url_args = dict(url_args)
    url_args["confirmation_key"] = confirmation_key
    return urljoin(
        settings.ROOT_DOMAIN_URI if realm is None else realm.url,
        reverse(_properties[confirmation_type].url_name, kwargs=url_args),
    )


class Confirmation(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=CASCADE)
    object_id = models.PositiveBigIntegerField(db_index=True)
    content_object = GenericForeignKey("content_type", "object_id")
    date_sent = models.DateTimeField(db_index=True)
    confirmation_key = models.CharField(max_length=40, db_index=True)
    expiry_date = models.DateTimeField(db_index=True, null=True)
    realm = models.ForeignKey(Realm, null=True, on_delete=CASCADE)

    # The following list is the set of valid types
    USER_REGISTRATION = 1
    INVITATION = 2
    EMAIL_CHANGE = 3
    UNSUBSCRIBE = 4
    SERVER_REGISTRATION = 5
    MULTIUSE_INVITE = 6
    NEW_REALM_USER_REGISTRATION = 7
    REALM_REACTIVATION = 8
    REMOTE_SERVER_BILLING_LEGACY_LOGIN = 9
    REMOTE_REALM_BILLING_LEGACY_LOGIN = 10
    CAN_CREATE_REALM = 11
    type = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = ("type", "confirmation_key")
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    @override
    def __str__(self) -> str:
        return f"{self.content_object!r}"


class ConfirmationType:
    def __init__(
        self,
        url_name: str,
        validity_in_days: int = settings.CONFIRMATION_LINK_DEFAULT_VALIDITY_DAYS,
    ) -> None:
        self.url_name = url_name
        self.validity_in_days = validity_in_days


_properties = {
    Confirmation.USER_REGISTRATION: ConfirmationType("get_prereg_key_and_redirect"),
    Confirmation.INVITATION: ConfirmationType(
        "get_prereg_key_and_redirect", validity_in_days=settings.INVITATION_LINK_VALIDITY_DAYS
    ),
    Confirmation.EMAIL_CHANGE: ConfirmationType("confirm_email_change_get"),
    Confirmation.UNSUBSCRIBE: ConfirmationType(
        "unsubscribe",
        validity_in_days=1000000,  # should never expire
    ),
    Confirmation.MULTIUSE_INVITE: ConfirmationType(
        "join", validity_in_days=settings.INVITATION_LINK_VALIDITY_DAYS
    ),
    Confirmation.CAN_CREATE_REALM: ConfirmationType(
        "create_realm", validity_in_days=settings.CAN_CREATE_REALM_LINK_VALIDITY_DAYS
    ),
    Confirmation.NEW_REALM_USER_REGISTRATION: ConfirmationType("get_prereg_key_and_redirect"),
    Confirmation.REALM_REACTIVATION: ConfirmationType("realm_reactivation_get"),
}
if settings.ZILENCER_ENABLED:
    _properties[Confirmation.REMOTE_SERVER_BILLING_LEGACY_LOGIN] = ConfirmationType(
        "remote_billing_legacy_server_from_login_confirmation_link"
    )
    _properties[Confirmation.REMOTE_REALM_BILLING_LEGACY_LOGIN] = ConfirmationType(
        "remote_realm_billing_from_login_confirmation_link"
    )


def one_click_unsubscribe_link(user_profile: UserProfile, email_type: str) -> str:
    """
    Generate a unique link that a logged-out user can visit to unsubscribe from
    Zulip e-mails without having to first log in.
    """
    return create_confirmation_link(
        user_profile, Confirmation.UNSUBSCRIBE, url_args={"email_type": email_type}
    )


def generate_realm_creation_url(by_admin: bool = False) -> str:
    from zerver.views.registration import prepare_realm_creation_url

    return prepare_realm_creation_url(presume_email_valid=by_admin)
```

--------------------------------------------------------------------------------

---[FILE: README.txt]---
Location: zulip-main/confirmation/README.txt

```text
===================
Django Confirmation
===================

This is a generic object confirmation system for Django applications.

For installation instructions, see the file "INSTALL.txt" in this
directory; for instructions on how to use this application, and on
what it provides, see the file "overview.txt" in the "docs/"
directory.
```

--------------------------------------------------------------------------------

---[FILE: settings.py]---
Location: zulip-main/confirmation/settings.py

```python
# Copyright: (c) 2008, Jarek Zgoda <jarek.zgoda@gmail.com>

__revision__ = "$Id: settings.py 12 2008-11-23 19:38:52Z jarek.zgoda $"

STATUS_USED = 1
STATUS_REVOKED = 2
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: zulip-main/confirmation/__init__.py

```python
# Copyright: (c) 2008, Jarek Zgoda <jarek.zgoda@gmail.com>

# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish, dis-
# tribute, sublicense, and/or sell copies of the Software, and to permit
# persons to whom the Software is furnished to do so, subject to the fol-
# lowing conditions:
#
# The above copyright notice and this permission notice shall be included
# in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
# OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABIL-
# ITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT
# SHALL THE AUTHOR BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
# WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
# IN THE SOFTWARE.

VERSION = (0, 9, "pre")
```

--------------------------------------------------------------------------------

---[FILE: 0001_initial.py]---
Location: zulip-main/confirmation/migrations/0001_initial.py
Signals: Django

```python
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("contenttypes", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Confirmation",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID", serialize=False, auto_created=True, primary_key=True
                    ),
                ),
                ("object_id", models.PositiveIntegerField()),
                ("date_sent", models.DateTimeField(verbose_name="sent")),
                (
                    "confirmation_key",
                    models.CharField(max_length=40, verbose_name="activation key"),
                ),
                (
                    "content_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="contenttypes.ContentType"
                    ),
                ),
            ],
            options={
                "verbose_name": "confirmation email",
                "verbose_name_plural": "confirmation emails",
            },
            bases=(models.Model,),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0001_squashed_0014_confirmation_confirmatio_content_80155a_idx.py]---
Location: zulip-main/confirmation/migrations/0001_squashed_0014_confirmation_confirmatio_content_80155a_idx.py
Signals: Django

```python
# Generated by Django 5.0.7 on 2024-08-13 19:41

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    replaces = [
        ("confirmation", "0001_initial"),
        ("confirmation", "0002_realmcreationkey"),
        ("confirmation", "0003_emailchangeconfirmation"),
        ("confirmation", "0004_remove_confirmationmanager"),
        ("confirmation", "0005_confirmation_realm"),
        ("confirmation", "0006_realmcreationkey_presume_email_valid"),
        ("confirmation", "0007_add_indexes"),
        ("confirmation", "0008_confirmation_expiry_date"),
        ("confirmation", "0009_confirmation_expiry_date_backfill"),
        ("confirmation", "0010_alter_confirmation_expiry_date"),
        ("confirmation", "0011_alter_confirmation_expiry_date"),
        ("confirmation", "0012_alter_confirmation_id"),
        ("confirmation", "0013_alter_realmcreationkey_id"),
        ("confirmation", "0014_confirmation_confirmatio_content_80155a_idx"),
    ]

    initial = True

    dependencies = [
        ("contenttypes", "0001_initial"),
        ("zerver", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="RealmCreationKey",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "creation_key",
                    models.CharField(db_index=True, max_length=40, verbose_name="activation key"),
                ),
                (
                    "date_created",
                    models.DateTimeField(default=django.utils.timezone.now, verbose_name="created"),
                ),
                ("presume_email_valid", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="Confirmation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("object_id", models.PositiveIntegerField(db_index=True)),
                ("date_sent", models.DateTimeField(db_index=True)),
                ("confirmation_key", models.CharField(db_index=True, max_length=40)),
                (
                    "content_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="contenttypes.contenttype"
                    ),
                ),
                ("type", models.PositiveSmallIntegerField()),
                (
                    "realm",
                    models.ForeignKey(
                        null=True, on_delete=django.db.models.deletion.CASCADE, to="zerver.realm"
                    ),
                ),
                ("expiry_date", models.DateTimeField(db_index=True, null=True)),
            ],
            options={
                "unique_together": {("type", "confirmation_key")},
                "indexes": [
                    models.Index(
                        fields=["content_type", "object_id"], name="confirmatio_content_80155a_idx"
                    )
                ],
            },
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0002_realmcreationkey.py]---
Location: zulip-main/confirmation/migrations/0002_realmcreationkey.py
Signals: Django

```python
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("confirmation", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="RealmCreationKey",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID", serialize=False, auto_created=True, primary_key=True
                    ),
                ),
                ("creation_key", models.CharField(max_length=40, verbose_name="activation key")),
                (
                    "date_created",
                    models.DateTimeField(default=django.utils.timezone.now, verbose_name="created"),
                ),
            ],
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0003_emailchangeconfirmation.py]---
Location: zulip-main/confirmation/migrations/0003_emailchangeconfirmation.py
Signals: Django

```python
# Generated by Django 1.10.4 on 2017-01-17 09:16
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("confirmation", "0002_realmcreationkey"),
    ]

    operations = [
        migrations.CreateModel(
            name="EmailChangeConfirmation",
            fields=[],
            options={
                "proxy": True,
            },
            bases=("confirmation.confirmation",),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0004_remove_confirmationmanager.py]---
Location: zulip-main/confirmation/migrations/0004_remove_confirmationmanager.py
Signals: Django

```python
# Generated by Django 1.11.2 on 2017-07-08 04:23
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("confirmation", "0003_emailchangeconfirmation"),
    ]

    operations = [
        migrations.DeleteModel(
            name="EmailChangeConfirmation",
        ),
        migrations.AlterModelOptions(
            name="confirmation",
            options={},
        ),
        migrations.AddField(
            model_name="confirmation",
            name="type",
            field=models.PositiveSmallIntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="confirmation",
            name="confirmation_key",
            field=models.CharField(max_length=40),
        ),
        migrations.AlterField(
            model_name="confirmation",
            name="date_sent",
            field=models.DateTimeField(),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0005_confirmation_realm.py]---
Location: zulip-main/confirmation/migrations/0005_confirmation_realm.py
Signals: Django

```python
# Generated by Django 1.11.6 on 2017-11-30 00:13
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0001_initial"),
        ("confirmation", "0004_remove_confirmationmanager"),
    ]

    operations = [
        migrations.AddField(
            model_name="confirmation",
            name="realm",
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.CASCADE, to="zerver.Realm"
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0006_realmcreationkey_presume_email_valid.py]---
Location: zulip-main/confirmation/migrations/0006_realmcreationkey_presume_email_valid.py
Signals: Django

```python
# Generated by Django 1.11.6 on 2018-01-29 18:39

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("confirmation", "0005_confirmation_realm"),
    ]

    operations = [
        migrations.AddField(
            model_name="realmcreationkey",
            name="presume_email_valid",
            field=models.BooleanField(default=False),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0007_add_indexes.py]---
Location: zulip-main/confirmation/migrations/0007_add_indexes.py
Signals: Django

```python
# Generated by Django 2.2.10 on 2020-03-27 09:02

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("confirmation", "0006_realmcreationkey_presume_email_valid"),
    ]

    operations = [
        migrations.AlterField(
            model_name="confirmation",
            name="confirmation_key",
            field=models.CharField(db_index=True, max_length=40),
        ),
        migrations.AlterField(
            model_name="confirmation",
            name="date_sent",
            field=models.DateTimeField(db_index=True),
        ),
        migrations.AlterField(
            model_name="confirmation",
            name="object_id",
            field=models.PositiveIntegerField(db_index=True),
        ),
        migrations.AlterField(
            model_name="realmcreationkey",
            name="creation_key",
            field=models.CharField(db_index=True, max_length=40, verbose_name="activation key"),
        ),
        migrations.AlterUniqueTogether(
            name="confirmation",
            unique_together={("type", "confirmation_key")},
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0008_confirmation_expiry_date.py]---
Location: zulip-main/confirmation/migrations/0008_confirmation_expiry_date.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("confirmation", "0007_add_indexes"),
    ]

    operations = [
        migrations.AddField(
            model_name="confirmation",
            name="expiry_date",
            field=models.DateTimeField(db_index=True, null=True),
            preserve_default=False,
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0009_confirmation_expiry_date_backfill.py]---
Location: zulip-main/confirmation/migrations/0009_confirmation_expiry_date_backfill.py
Signals: Django

```python
# Generated by Django 3.1.7 on 2021-03-31 20:47

import time
from datetime import timedelta

from django.conf import settings
from django.db import migrations, transaction
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps


def set_expiry_date_for_existing_confirmations(
    apps: StateApps, schema_editor: BaseDatabaseSchemaEditor
) -> None:
    Confirmation = apps.get_model("confirmation", "Confirmation")
    if not Confirmation.objects.exists():
        return

    # The values at the time of this migration
    INVITATION = 2
    UNSUBSCRIBE = 4
    MULTIUSE_INVITE = 6

    @transaction.atomic
    def backfill_confirmations_between(lower_bound: int, upper_bound: int) -> None:
        confirmations = Confirmation.objects.filter(id__gte=lower_bound, id__lte=upper_bound)
        for confirmation in confirmations:
            if confirmation.type in (INVITATION, MULTIUSE_INVITE):
                confirmation.expiry_date = confirmation.date_sent + timedelta(
                    days=settings.INVITATION_LINK_VALIDITY_DAYS
                )
            elif confirmation.type == UNSUBSCRIBE:
                # Unsubscribe links never expire, which we apparently implement as in 1M days.
                confirmation.expiry_date = confirmation.date_sent + timedelta(days=1000000)
            else:
                confirmation.expiry_date = confirmation.date_sent + timedelta(
                    days=settings.CONFIRMATION_LINK_DEFAULT_VALIDITY_DAYS
                )
        Confirmation.objects.bulk_update(confirmations, ["expiry_date"])

    # Because the ranges in this code are inclusive, subtracting 1 offers round numbers.
    BATCH_SIZE = 1000 - 1

    first_id = Confirmation.objects.earliest("id").id
    last_id = Confirmation.objects.latest("id").id

    id_range_lower_bound = first_id
    id_range_upper_bound = first_id + BATCH_SIZE
    while id_range_lower_bound <= last_id:
        print(f"Processed {id_range_lower_bound} / {last_id}")
        backfill_confirmations_between(id_range_lower_bound, id_range_upper_bound)
        id_range_lower_bound = id_range_upper_bound + 1
        id_range_upper_bound = id_range_lower_bound + BATCH_SIZE
        time.sleep(0.1)


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("confirmation", "0008_confirmation_expiry_date"),
    ]

    operations = [
        migrations.RunPython(
            set_expiry_date_for_existing_confirmations,
            reverse_code=migrations.RunPython.noop,
            elidable=True,
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0010_alter_confirmation_expiry_date.py]---
Location: zulip-main/confirmation/migrations/0010_alter_confirmation_expiry_date.py
Signals: Django

```python
# Generated by Django 3.2.5 on 2021-08-02 19:03

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("confirmation", "0009_confirmation_expiry_date_backfill"),
    ]

    operations = [
        migrations.AlterField(
            model_name="confirmation",
            name="expiry_date",
            field=models.DateTimeField(db_index=True),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0011_alter_confirmation_expiry_date.py]---
Location: zulip-main/confirmation/migrations/0011_alter_confirmation_expiry_date.py
Signals: Django

```python
# Generated by Django 3.2.9 on 2021-11-30 17:44

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("confirmation", "0010_alter_confirmation_expiry_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="confirmation",
            name="expiry_date",
            field=models.DateTimeField(db_index=True, null=True),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0012_alter_confirmation_id.py]---
Location: zulip-main/confirmation/migrations/0012_alter_confirmation_id.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("confirmation", "0011_alter_confirmation_expiry_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="confirmation",
            name="id",
            field=models.BigAutoField(
                auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0013_alter_realmcreationkey_id.py]---
Location: zulip-main/confirmation/migrations/0013_alter_realmcreationkey_id.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("confirmation", "0012_alter_confirmation_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="realmcreationkey",
            name="id",
            field=models.BigAutoField(
                auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0014_confirmation_confirmatio_content_80155a_idx.py]---
Location: zulip-main/confirmation/migrations/0014_confirmation_confirmatio_content_80155a_idx.py
Signals: Django

```python
from django.contrib.postgres.operations import AddIndexConcurrently
from django.db import migrations, models


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("confirmation", "0013_alter_realmcreationkey_id"),
        ("contenttypes", "0002_remove_content_type_name"),
    ]

    operations = [
        AddIndexConcurrently(
            model_name="confirmation",
            index=models.Index(
                fields=["content_type", "object_id"], name="confirmatio_content_80155a_idx"
            ),
        ),
    ]
```

--------------------------------------------------------------------------------

````
