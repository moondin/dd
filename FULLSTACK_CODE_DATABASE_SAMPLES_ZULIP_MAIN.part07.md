---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 7
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 7 of 1290)

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

---[FILE: extensions.json]---
Location: zulip-main/.vscode/extensions.json

```json
{
    // Recommended VS Code extensions for zulip/zulip.
    //
    // VS Code prompts a user to install the recommended extensions
    // when a workspace is opened for the first time.  The user can
    // also review the list with the 'Extensions: Show Recommended
    // Extensions' command.  See
    // https://code.visualstudio.com/docs/editor/extension-marketplace#_workspace-recommended-extensions
    // for more information.
    //
    // Extension identifier format: ${publisher}.${name}.
    // Example: vscode.csharp

    "recommendations": [
        "42crunch.vscode-openapi",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-vscode-remote.vscode-remote-extensionpack"
    ],

    // Extensions recommended by VS Code which are not recommended for users of zulip/zulip.
    "unwantedRecommendations": []
}
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: zulip-main/analytics/models.py
Signals: Django

```python
from datetime import datetime

from django.db import models
from django.db.models import Q, UniqueConstraint
from typing_extensions import override

from zerver.lib.timestamp import floor_to_day
from zerver.models import Realm, Stream, UserProfile


class FillState(models.Model):
    property = models.CharField(max_length=40, unique=True)
    end_time = models.DateTimeField()

    # Valid states are {DONE, STARTED}
    DONE = 1
    STARTED = 2
    state = models.PositiveSmallIntegerField()

    @override
    def __str__(self) -> str:
        return f"{self.property} {self.end_time} {self.state}"


# The earliest/starting end_time in FillState
# We assume there is at least one realm
def installation_epoch() -> datetime:
    earliest_realm_creation = Realm.objects.aggregate(models.Min("date_created"))[
        "date_created__min"
    ]
    return floor_to_day(earliest_realm_creation)


class BaseCount(models.Model):
    # Note: When inheriting from BaseCount, you may want to rearrange
    # the order of the columns in the migration to make sure they
    # match how you'd like the table to be arranged.
    property = models.CharField(max_length=32)
    subgroup = models.CharField(max_length=16, null=True)
    end_time = models.DateTimeField()
    value = models.BigIntegerField()

    class Meta:
        abstract = True


class InstallationCount(BaseCount):
    class Meta:
        # Handles invalid duplicate InstallationCount data
        constraints = [
            UniqueConstraint(
                fields=["property", "subgroup", "end_time"],
                condition=Q(subgroup__isnull=False),
                name="unique_installation_count",
            ),
            UniqueConstraint(
                fields=["property", "end_time"],
                condition=Q(subgroup__isnull=True),
                name="unique_installation_count_null_subgroup",
            ),
        ]

    @override
    def __str__(self) -> str:
        return f"{self.property} {self.subgroup} {self.value}"


class RealmCount(BaseCount):
    realm = models.ForeignKey(Realm, on_delete=models.CASCADE)

    class Meta:
        # Handles invalid duplicate RealmCount data
        constraints = [
            UniqueConstraint(
                fields=["realm", "property", "subgroup", "end_time"],
                condition=Q(subgroup__isnull=False),
                name="unique_realm_count",
            ),
            UniqueConstraint(
                fields=["realm", "property", "end_time"],
                condition=Q(subgroup__isnull=True),
                name="unique_realm_count_null_subgroup",
            ),
        ]
        indexes = [
            models.Index(
                fields=["property", "end_time"],
                name="analytics_realmcount_property_end_time_3b60396b_idx",
            )
        ]

    @override
    def __str__(self) -> str:
        return f"{self.realm!r} {self.property} {self.subgroup} {self.value}"


class UserCount(BaseCount):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    realm = models.ForeignKey(Realm, on_delete=models.CASCADE)

    class Meta:
        # Handles invalid duplicate UserCount data
        constraints = [
            UniqueConstraint(
                fields=["user", "property", "subgroup", "end_time"],
                condition=Q(subgroup__isnull=False),
                name="unique_user_count",
            ),
            UniqueConstraint(
                fields=["user", "property", "end_time"],
                condition=Q(subgroup__isnull=True),
                name="unique_user_count_null_subgroup",
            ),
        ]
        # This index dramatically improves the performance of
        # aggregating from users to realms
        indexes = [
            models.Index(
                fields=["property", "realm", "end_time"],
                name="analytics_usercount_property_realm_id_end_time_591dbec1_idx",
            )
        ]

    @override
    def __str__(self) -> str:
        return f"{self.user!r} {self.property} {self.subgroup} {self.value}"


class StreamCount(BaseCount):
    stream = models.ForeignKey(Stream, on_delete=models.CASCADE)
    realm = models.ForeignKey(Realm, on_delete=models.CASCADE)

    class Meta:
        # Handles invalid duplicate StreamCount data
        constraints = [
            UniqueConstraint(
                fields=["stream", "property", "subgroup", "end_time"],
                condition=Q(subgroup__isnull=False),
                name="unique_stream_count",
            ),
            UniqueConstraint(
                fields=["stream", "property", "end_time"],
                condition=Q(subgroup__isnull=True),
                name="unique_stream_count_null_subgroup",
            ),
        ]
        # This index dramatically improves the performance of
        # aggregating from streams to realms
        indexes = [
            models.Index(
                fields=["property", "realm", "end_time"],
                name="analytics_streamcount_property_realm_id_end_time_155ae930_idx",
            )
        ]

    @override
    def __str__(self) -> str:
        return f"{self.stream!r} {self.property} {self.subgroup} {self.value} {self.id}"
```

--------------------------------------------------------------------------------

---[FILE: urls.py]---
Location: zulip-main/analytics/urls.py
Signals: Django

```python
from django.conf import settings
from django.conf.urls import include
from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from analytics.views.stats import (
    get_chart_data,
    get_chart_data_for_installation,
    get_chart_data_for_realm,
    get_chart_data_for_stream,
    stats,
    stats_for_installation,
    stats_for_realm,
)
from zerver.lib.rest import rest_path

i18n_urlpatterns: list[URLPattern | URLResolver] = [
    # Server admin (user_profile.is_staff) visible stats pages
    path("stats/realm/<realm_str>/", stats_for_realm),
    path("stats/installation", stats_for_installation),
    # User-visible stats page
    path("stats", stats, name="stats"),
]

if settings.ZILENCER_ENABLED:
    from analytics.views.stats import stats_for_remote_installation, stats_for_remote_realm

    i18n_urlpatterns += [
        path("stats/remote/<int:remote_server_id>/installation", stats_for_remote_installation),
        path(
            "stats/remote/<int:remote_server_id>/realm/<int:remote_realm_id>/",
            stats_for_remote_realm,
        ),
    ]

# These endpoints are a part of the API (V1), which uses:
# * REST verbs
# * Basic auth (username:password is email:apiKey)
# * Takes and returns json-formatted data
#
# See rest_dispatch in zerver.lib.rest for an explanation of auth methods used
#
# All of these paths are accessed by either a /json or /api prefix
v1_api_and_json_patterns = [
    # get data for the graphs at /stats
    rest_path("analytics/chart_data", GET=get_chart_data),
    rest_path("analytics/chart_data/stream/<stream_id>", GET=get_chart_data_for_stream),
    rest_path("analytics/chart_data/realm/<realm_str>", GET=get_chart_data_for_realm),
    rest_path("analytics/chart_data/installation", GET=get_chart_data_for_installation),
]

if settings.ZILENCER_ENABLED:
    from analytics.views.stats import (
        get_chart_data_for_remote_installation,
        get_chart_data_for_remote_realm,
    )

    v1_api_and_json_patterns += [
        rest_path(
            "analytics/chart_data/remote/<int:remote_server_id>/installation",
            GET=get_chart_data_for_remote_installation,
        ),
        rest_path(
            "analytics/chart_data/remote/<int:remote_server_id>/realm/<int:remote_realm_id>",
            GET=get_chart_data_for_remote_realm,
        ),
    ]

i18n_urlpatterns += [
    path("api/v1/", include(v1_api_and_json_patterns)),
    path("json/", include(v1_api_and_json_patterns)),
]

urlpatterns = i18n_urlpatterns
```

--------------------------------------------------------------------------------

````
