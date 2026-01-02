---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 9
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 9 of 1290)

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

---[FILE: fixtures.py]---
Location: zulip-main/analytics/lib/fixtures.py

```python
from math import sqrt
from random import Random

from analytics.lib.counts import CountStat


def generate_time_series_data(
    days: int = 100,
    business_hours_base: float = 10,
    non_business_hours_base: float = 10,
    growth: float = 1,
    autocorrelation: float = 0,
    spikiness: float = 1,
    holiday_rate: float = 0,
    frequency: str = CountStat.DAY,
    partial_sum: bool = False,
    random_seed: int = 26,
) -> list[int]:
    """
    Generate semi-realistic looking time series data for testing analytics graphs.

    days -- Number of days of data. Is the number of data points generated if
        frequency is CountStat.DAY.
    business_hours_base -- Average value during a business hour (or day) at beginning of
        time series, if frequency is CountStat.HOUR (CountStat.DAY, respectively).
    non_business_hours_base -- The above, for non-business hours/days.
    growth -- Ratio between average values at end of time series and beginning of time series.
    autocorrelation -- Makes neighboring data points look more like each other. At 0 each
        point is unaffected by the previous point, and at 1 each point is a deterministic
        function of the previous point.
    spikiness -- 0 means no randomness (other than holiday_rate), higher values increase
        the variance.
    holiday_rate -- Fraction of days randomly set to 0, largely for testing how we handle 0s.
    frequency -- Should be CountStat.HOUR or CountStat.DAY.
    partial_sum -- If True, return partial sum of the series.
    random_seed -- Seed for random number generator.
    """
    rng = Random(random_seed)

    if frequency == CountStat.HOUR:
        length = days * 24
        seasonality = [non_business_hours_base] * 24 * 7
        for day in range(5):
            for hour in range(8):
                seasonality[24 * day + hour] = business_hours_base
        holidays = []
        for i in range(days):
            holidays.extend([rng.random() < holiday_rate] * 24)
    elif frequency == CountStat.DAY:
        length = days
        seasonality = [8 * business_hours_base + 16 * non_business_hours_base] * 5 + [
            24 * non_business_hours_base
        ] * 2
        holidays = [rng.random() < holiday_rate for i in range(days)]
    else:
        raise AssertionError(f"Unknown frequency: {frequency}")
    if length < 2:
        raise AssertionError(
            f"Must be generating at least 2 data points. Currently generating {length}"
        )
    growth_base = growth ** (1.0 / (length - 1))
    values_no_noise = [seasonality[i % len(seasonality)] * (growth_base**i) for i in range(length)]

    noise_scalars = [rng.gauss(0, 1)]
    for i in range(1, length):
        noise_scalars.append(
            noise_scalars[-1] * autocorrelation + rng.gauss(0, 1) * (1 - autocorrelation)
        )

    values = [
        0 if holiday else int(v + sqrt(v) * noise_scalar * spikiness)
        for v, noise_scalar, holiday in zip(values_no_noise, noise_scalars, holidays, strict=False)
    ]
    if partial_sum:
        for i in range(1, length):
            values[i] = values[i - 1] + values[i]
    return [max(v, 0) for v in values]
```

--------------------------------------------------------------------------------

---[FILE: time_utils.py]---
Location: zulip-main/analytics/lib/time_utils.py

```python
from datetime import datetime, timedelta

from analytics.lib.counts import CountStat
from zerver.lib.timestamp import floor_to_day, floor_to_hour, verify_UTC


# If min_length is None, returns end_times from ceiling(start) to floor(end), inclusive.
# If min_length is greater than 0, pads the list to the left.
# So informally, time_range(Sep 20, Sep 22, day, None) returns [Sep 20, Sep 21, Sep 22],
# and time_range(Sep 20, Sep 22, day, 5) returns [Sep 18, Sep 19, Sep 20, Sep 21, Sep 22]
def time_range(
    start: datetime, end: datetime, frequency: str, min_length: int | None
) -> list[datetime]:
    verify_UTC(start)
    verify_UTC(end)
    if frequency == CountStat.HOUR:
        end = floor_to_hour(end)
        step = timedelta(hours=1)
    elif frequency == CountStat.DAY:
        end = floor_to_day(end)
        step = timedelta(days=1)
    else:
        raise AssertionError(f"Unknown frequency: {frequency}")

    times = []
    if min_length is not None:
        start = min(start, end - (min_length - 1) * step)
    current = end
    while current >= start:
        times.append(current)
        current -= step
    times.reverse()
    return times
```

--------------------------------------------------------------------------------

---[FILE: check_analytics_state.py]---
Location: zulip-main/analytics/management/commands/check_analytics_state.py
Signals: Django

```python
from dataclasses import dataclass
from datetime import timedelta
from typing import Any, Literal

from django.utils.timezone import now as timezone_now
from typing_extensions import override

from analytics.lib.counts import ALL_COUNT_STATS, CountStat
from analytics.models import installation_epoch
from scripts.lib.zulip_tools import atomic_nagios_write
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.timestamp import TimeZoneNotUTCError, floor_to_day, floor_to_hour, verify_UTC
from zerver.models import Realm

states = {
    0: "OK",
    1: "WARNING",
    2: "CRITICAL",
    3: "UNKNOWN",
}


@dataclass
class NagiosResult:
    status: Literal["ok", "warning", "critical", "unknown"]
    message: str


class Command(ZulipBaseCommand):
    help = """Checks FillState table.

    Run as a cron job that runs every hour."""

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        fill_state = self.get_fill_state()
        atomic_nagios_write("check-analytics-state", fill_state.status, fill_state.message)

    def get_fill_state(self) -> NagiosResult:
        if not Realm.objects.exists():
            return NagiosResult(status="ok", message="No realms exist, so not checking FillState.")

        warning_unfilled_properties = []
        critical_unfilled_properties = []
        for property, stat in ALL_COUNT_STATS.items():
            last_fill = stat.last_successful_fill()
            if last_fill is None:
                last_fill = installation_epoch()
            try:
                verify_UTC(last_fill)
            except TimeZoneNotUTCError:
                return NagiosResult(
                    status="critical", message=f"FillState not in UTC for {property}"
                )

            if stat.frequency == CountStat.DAY:
                floor_function = floor_to_day
                warning_threshold = timedelta(hours=26)
                critical_threshold = timedelta(hours=50)
            else:  # CountStat.HOUR
                floor_function = floor_to_hour
                warning_threshold = timedelta(minutes=90)
                critical_threshold = timedelta(minutes=150)

            if floor_function(last_fill) != last_fill:
                return NagiosResult(
                    status="critical",
                    message=f"FillState not on {stat.frequency} boundary for {property}",
                )

            time_to_last_fill = timezone_now() - last_fill
            if time_to_last_fill > critical_threshold:
                critical_unfilled_properties.append(property)
            elif time_to_last_fill > warning_threshold:
                warning_unfilled_properties.append(property)

        if len(critical_unfilled_properties) == 0 and len(warning_unfilled_properties) == 0:
            return NagiosResult(status="ok", message="FillState looks fine.")
        if len(critical_unfilled_properties) == 0:
            return NagiosResult(
                status="warning",
                message="Missed filling {} once.".format(
                    ", ".join(warning_unfilled_properties),
                ),
            )
        return NagiosResult(
            status="critical",
            message="Missed filling {} once. Missed filling {} at least twice.".format(
                ", ".join(warning_unfilled_properties),
                ", ".join(critical_unfilled_properties),
            ),
        )
```

--------------------------------------------------------------------------------

---[FILE: clear_analytics_tables.py]---
Location: zulip-main/analytics/management/commands/clear_analytics_tables.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from analytics.lib.counts import do_drop_all_analytics_tables
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Clear analytics tables."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--force", action="store_true", help="Clear analytics tables.")

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        if options["force"]:
            do_drop_all_analytics_tables()
        else:
            raise CommandError(
                "Would delete all data from analytics tables (!); use --force to do so."
            )
```

--------------------------------------------------------------------------------

---[FILE: clear_single_stat.py]---
Location: zulip-main/analytics/management/commands/clear_single_stat.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from analytics.lib.counts import ALL_COUNT_STATS, do_drop_single_stat
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Clear analytics tables."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--force", action="store_true", help="Actually do it.")
        parser.add_argument("--property", help="The property of the stat to be cleared.")

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        property = options["property"]
        if property not in ALL_COUNT_STATS:
            raise CommandError(f"Invalid property: {property}")
        if not options["force"]:
            raise CommandError("No action taken. Use --force.")

        do_drop_single_stat(property)
```

--------------------------------------------------------------------------------

---[FILE: populate_analytics_db.py]---
Location: zulip-main/analytics/management/commands/populate_analytics_db.py
Signals: Django

```python
from collections.abc import Mapping
from datetime import timedelta
from typing import Any, TypeAlias

from django.core.files.uploadedfile import UploadedFile
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from analytics.lib.counts import COUNT_STATS, CountStat, do_drop_all_analytics_tables
from analytics.lib.fixtures import generate_time_series_data
from analytics.lib.time_utils import time_range
from analytics.models import (
    BaseCount,
    FillState,
    InstallationCount,
    RealmCount,
    StreamCount,
    UserCount,
)
from zerver.actions.create_realm import do_create_realm
from zerver.lib.create_user import create_user
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.storage import static_path
from zerver.lib.stream_color import STREAM_ASSIGNMENT_COLORS
from zerver.lib.stream_subscription import create_stream_subscription
from zerver.lib.streams import get_default_values_for_stream_permission_group_settings
from zerver.lib.timestamp import floor_to_day
from zerver.lib.upload import upload_message_attachment_from_request
from zerver.models import Client, Realm, RealmAuditLog, Recipient, Stream, UserProfile
from zerver.models.groups import NamedUserGroup, SystemGroups, UserGroupMembership
from zerver.models.realm_audit_logs import AuditLogEventType


class Command(ZulipBaseCommand):
    help = """Populates analytics tables with randomly generated data."""

    DAYS_OF_DATA = 100
    random_seed = 26

    def generate_fixture_data(
        self,
        stat: CountStat,
        business_hours_base: float,
        non_business_hours_base: float,
        growth: float,
        autocorrelation: float,
        spikiness: float,
        holiday_rate: float = 0,
        partial_sum: bool = False,
    ) -> list[int]:
        self.random_seed += 1
        return generate_time_series_data(
            days=self.DAYS_OF_DATA,
            business_hours_base=business_hours_base,
            non_business_hours_base=non_business_hours_base,
            growth=growth,
            autocorrelation=autocorrelation,
            spikiness=spikiness,
            holiday_rate=holiday_rate,
            frequency=stat.frequency,
            partial_sum=partial_sum,
            random_seed=self.random_seed,
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        # TODO: This should arguably only delete the objects
        # associated with the "analytics" realm.
        do_drop_all_analytics_tables()

        # This also deletes any objects with this realm as a foreign key
        Realm.objects.filter(string_id="analytics").delete()

        # Because we just deleted a bunch of objects in the database
        # directly (rather than deleting individual objects in Django,
        # in which case our post_save hooks would have flushed the
        # individual objects from memcached for us), we need to flush
        # memcached in order to ensure deleted objects aren't still
        # present in the memcached cache.
        from zerver.apps import flush_cache

        flush_cache(None)

        installation_time = timezone_now() - timedelta(days=self.DAYS_OF_DATA)
        last_end_time = floor_to_day(timezone_now())
        realm = do_create_realm(
            string_id="analytics", name="Analytics", date_created=installation_time
        )

        owners_system_group = NamedUserGroup.objects.get(
            name=SystemGroups.OWNERS, realm_for_sharding=realm, is_system_group=True
        )
        guests_system_group = NamedUserGroup.objects.get(
            name=SystemGroups.EVERYONE, realm_for_sharding=realm, is_system_group=True
        )

        shylock = create_user(
            "shylock@analytics.ds",
            "Shylock",
            realm,
            full_name="Shylock",
            role=UserProfile.ROLE_REALM_OWNER,
            force_date_joined=installation_time,
        )
        UserGroupMembership.objects.create(user_profile=shylock, user_group=owners_system_group)

        # Create guest user for set_guest_users_statistic.
        bassanio = create_user(
            "bassanio@analytics.ds",
            "Bassanio",
            realm,
            full_name="Bassanio",
            role=UserProfile.ROLE_GUEST,
            force_date_joined=installation_time,
        )
        UserGroupMembership.objects.create(user_profile=bassanio, user_group=guests_system_group)

        stream = Stream.objects.create(
            name="all",
            realm=realm,
            date_created=installation_time,
            **get_default_values_for_stream_permission_group_settings(realm),
        )
        recipient = Recipient.objects.create(type_id=stream.id, type=Recipient.STREAM)
        stream.recipient = recipient
        stream.save(update_fields=["recipient"])

        # Subscribe shylock to the stream to avoid invariant failures.
        create_stream_subscription(
            user_profile=shylock,
            recipient=recipient,
            stream=stream,
            color=STREAM_ASSIGNMENT_COLORS[0],
        )
        RealmAuditLog.objects.create(
            realm=realm,
            modified_user=shylock,
            modified_stream=stream,
            event_last_message_id=0,
            event_type=AuditLogEventType.SUBSCRIPTION_CREATED,
            event_time=installation_time,
        )

        # Create an attachment in the database for set_storage_space_used_statistic.
        IMAGE_FILE_PATH = static_path("images/test-images/checkbox.png")
        with open(IMAGE_FILE_PATH, "rb") as fp:
            upload_message_attachment_from_request(UploadedFile(fp), shylock)

        FixtureData: TypeAlias = Mapping[str | int | None, list[int]]

        def insert_fixture_data(
            stat: CountStat,
            fixture_data: FixtureData,
            table: type[BaseCount],
        ) -> None:
            end_times = time_range(
                last_end_time, last_end_time, stat.frequency, len(next(iter(fixture_data.values())))
            )
            if table == InstallationCount:
                id_args: dict[str, Any] = {}
            if table == RealmCount:
                id_args = {"realm": realm}
            if table == UserCount:
                id_args = {"realm": realm, "user": shylock}
            if table == StreamCount:
                id_args = {"stream": stream, "realm": realm}

            for subgroup, values in fixture_data.items():
                table._default_manager.bulk_create(
                    table(
                        property=stat.property,
                        subgroup=subgroup,
                        end_time=end_time,
                        value=value,
                        **id_args,
                    )
                    for end_time, value in zip(end_times, values, strict=False)
                    if value != 0
                )

        stat = COUNT_STATS["1day_actives::day"]
        realm_data: FixtureData = {
            None: self.generate_fixture_data(stat, 0.08, 0.02, 3, 0.3, 6, partial_sum=True),
        }
        insert_fixture_data(stat, realm_data, RealmCount)
        installation_data: FixtureData = {
            None: self.generate_fixture_data(stat, 0.8, 0.2, 4, 0.3, 6, partial_sum=True),
        }
        insert_fixture_data(stat, installation_data, InstallationCount)
        FillState.objects.create(
            property=stat.property, end_time=last_end_time, state=FillState.DONE
        )

        stat = COUNT_STATS["7day_actives::day"]
        realm_data = {
            None: self.generate_fixture_data(stat, 0.2, 0.07, 3, 0.3, 6, partial_sum=True),
        }
        insert_fixture_data(stat, realm_data, RealmCount)
        installation_data = {
            None: self.generate_fixture_data(stat, 2, 0.7, 4, 0.3, 6, partial_sum=True),
        }
        insert_fixture_data(stat, installation_data, InstallationCount)
        FillState.objects.create(
            property=stat.property, end_time=last_end_time, state=FillState.DONE
        )

        stat = COUNT_STATS["realm_active_humans::day"]
        realm_data = {
            None: self.generate_fixture_data(stat, 0.8, 0.08, 3, 0.5, 3, partial_sum=True),
        }
        insert_fixture_data(stat, realm_data, RealmCount)
        installation_data = {
            None: self.generate_fixture_data(stat, 1, 0.3, 4, 0.5, 3, partial_sum=True),
        }
        insert_fixture_data(stat, installation_data, InstallationCount)
        FillState.objects.create(
            property=stat.property, end_time=last_end_time, state=FillState.DONE
        )

        stat = COUNT_STATS["active_users_audit:is_bot:day"]
        realm_data = {
            "false": self.generate_fixture_data(stat, 1, 0.2, 3.5, 0.8, 2, partial_sum=True),
            "true": self.generate_fixture_data(stat, 0.3, 0.05, 3, 0.3, 2, partial_sum=True),
        }
        insert_fixture_data(stat, realm_data, RealmCount)
        installation_data = {
            "false": self.generate_fixture_data(stat, 3, 1, 4, 0.8, 2, partial_sum=True),
            "true": self.generate_fixture_data(stat, 1, 0.4, 4, 0.8, 2, partial_sum=True),
        }
        insert_fixture_data(stat, installation_data, InstallationCount)
        FillState.objects.create(
            property=stat.property, end_time=last_end_time, state=FillState.DONE
        )

        stat = COUNT_STATS["messages_sent:is_bot:hour"]
        user_data: FixtureData = {
            "false": self.generate_fixture_data(stat, 2, 1, 1.5, 0.6, 8, holiday_rate=0.1),
        }
        insert_fixture_data(stat, user_data, UserCount)
        realm_data = {
            "false": self.generate_fixture_data(stat, 35, 15, 6, 0.6, 4),
            "true": self.generate_fixture_data(stat, 15, 15, 3, 0.4, 2),
        }
        insert_fixture_data(stat, realm_data, RealmCount)
        installation_data = {
            "false": self.generate_fixture_data(stat, 350, 150, 6, 0.6, 4),
            "true": self.generate_fixture_data(stat, 150, 150, 3, 0.4, 2),
        }
        insert_fixture_data(stat, installation_data, InstallationCount)
        FillState.objects.create(
            property=stat.property, end_time=last_end_time, state=FillState.DONE
        )

        stat = COUNT_STATS["messages_sent:message_type:day"]
        user_data = {
            "public_stream": self.generate_fixture_data(stat, 1.5, 1, 3, 0.6, 8),
            "private_message": self.generate_fixture_data(stat, 0.5, 0.3, 1, 0.6, 8),
            "huddle_message": self.generate_fixture_data(stat, 0.2, 0.2, 2, 0.6, 8),
        }
        insert_fixture_data(stat, user_data, UserCount)
        realm_data = {
            "public_stream": self.generate_fixture_data(stat, 30, 8, 5, 0.6, 4),
            "private_stream": self.generate_fixture_data(stat, 7, 7, 5, 0.6, 4),
            "private_message": self.generate_fixture_data(stat, 13, 5, 5, 0.6, 4),
            "huddle_message": self.generate_fixture_data(stat, 6, 3, 3, 0.6, 4),
        }
        insert_fixture_data(stat, realm_data, RealmCount)
        installation_data = {
            "public_stream": self.generate_fixture_data(stat, 300, 80, 5, 0.6, 4),
            "private_stream": self.generate_fixture_data(stat, 70, 70, 5, 0.6, 4),
            "private_message": self.generate_fixture_data(stat, 130, 50, 5, 0.6, 4),
            "huddle_message": self.generate_fixture_data(stat, 60, 30, 3, 0.6, 4),
        }
        insert_fixture_data(stat, installation_data, InstallationCount)
        FillState.objects.create(
            property=stat.property, end_time=last_end_time, state=FillState.DONE
        )

        website, _created = Client.objects.get_or_create(name="website")
        old_desktop, _created = Client.objects.get_or_create(name="desktop app Linux 0.3.7")
        android, _created = Client.objects.get_or_create(name="ZulipAndroid")
        iOS, _created = Client.objects.get_or_create(name="ZulipiOS")
        react_native, _created = Client.objects.get_or_create(name="ZulipMobile")
        flutter, _created = Client.objects.get_or_create(name="ZulipFlutter")
        API, _created = Client.objects.get_or_create(name="API: Python")
        irc_mirror, _created = Client.objects.get_or_create(name="irc_mirror")
        unused, _created = Client.objects.get_or_create(name="unused")
        long_webhook, _created = Client.objects.get_or_create(name="ZulipLooooooooooongNameWebhook")

        stat = COUNT_STATS["messages_sent:client:day"]
        user_data = {
            website.id: self.generate_fixture_data(stat, 2, 1, 1.5, 0.6, 8),
            irc_mirror.id: self.generate_fixture_data(stat, 0, 0.3, 1.5, 0.6, 8),
        }
        insert_fixture_data(stat, user_data, UserCount)
        realm_data = {
            website.id: self.generate_fixture_data(stat, 30, 20, 5, 0.6, 3),
            old_desktop.id: self.generate_fixture_data(stat, 5, 3, 8, 0.6, 3),
            android.id: self.generate_fixture_data(stat, 5, 5, 2, 0.6, 3),
            iOS.id: self.generate_fixture_data(stat, 5, 5, 2, 0.6, 3),
            react_native.id: self.generate_fixture_data(stat, 5, 5, 10, 0.6, 3),
            flutter.id: self.generate_fixture_data(stat, 5, 5, 10, 0.6, 3),
            API.id: self.generate_fixture_data(stat, 5, 5, 5, 0.6, 3),
            irc_mirror.id: self.generate_fixture_data(stat, 1, 1, 3, 0.6, 3),
            unused.id: self.generate_fixture_data(stat, 0, 0, 0, 0, 0),
            long_webhook.id: self.generate_fixture_data(stat, 5, 5, 2, 0.6, 3),
        }
        insert_fixture_data(stat, realm_data, RealmCount)
        installation_data = {
            website.id: self.generate_fixture_data(stat, 300, 200, 5, 0.6, 3),
            old_desktop.id: self.generate_fixture_data(stat, 50, 30, 8, 0.6, 3),
            android.id: self.generate_fixture_data(stat, 50, 50, 2, 0.6, 3),
            iOS.id: self.generate_fixture_data(stat, 50, 50, 2, 0.6, 3),
            flutter.id: self.generate_fixture_data(stat, 5, 5, 10, 0.6, 3),
            react_native.id: self.generate_fixture_data(stat, 5, 5, 10, 0.6, 3),
            API.id: self.generate_fixture_data(stat, 50, 50, 5, 0.6, 3),
            irc_mirror.id: self.generate_fixture_data(stat, 10, 10, 3, 0.6, 3),
            unused.id: self.generate_fixture_data(stat, 0, 0, 0, 0, 0),
            long_webhook.id: self.generate_fixture_data(stat, 50, 50, 2, 0.6, 3),
        }
        insert_fixture_data(stat, installation_data, InstallationCount)
        FillState.objects.create(
            property=stat.property, end_time=last_end_time, state=FillState.DONE
        )

        stat = COUNT_STATS["messages_in_stream:is_bot:day"]
        realm_data = {
            "false": self.generate_fixture_data(stat, 30, 5, 6, 0.6, 4),
            "true": self.generate_fixture_data(stat, 20, 2, 3, 0.2, 3),
        }
        insert_fixture_data(stat, realm_data, RealmCount)
        stream_data: Mapping[int | str | None, list[int]] = {
            "false": self.generate_fixture_data(stat, 10, 7, 5, 0.6, 4),
            "true": self.generate_fixture_data(stat, 5, 3, 2, 0.4, 2),
        }
        insert_fixture_data(stat, stream_data, StreamCount)
        FillState.objects.create(
            property=stat.property, end_time=last_end_time, state=FillState.DONE
        )

        stat = COUNT_STATS["messages_read::hour"]
        user_data = {
            None: self.generate_fixture_data(stat, 7, 3, 2, 0.6, 8, holiday_rate=0.1),
        }
        insert_fixture_data(stat, user_data, UserCount)
        realm_data = {None: self.generate_fixture_data(stat, 50, 35, 6, 0.6, 4)}
        insert_fixture_data(stat, realm_data, RealmCount)
        FillState.objects.create(
            property=stat.property, end_time=last_end_time, state=FillState.DONE
        )
```

--------------------------------------------------------------------------------

---[FILE: update_analytics_counts.py]---
Location: zulip-main/analytics/management/commands/update_analytics_counts.py
Signals: Django

```python
import hashlib
import time
from argparse import ArgumentParser
from datetime import timezone
from typing import Any

from django.conf import settings
from django.utils.dateparse import parse_datetime
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from analytics.lib.counts import ALL_COUNT_STATS, logger, process_count_stat
from zerver.lib.management import ZulipBaseCommand, abort_cron_during_deploy, abort_unless_locked
from zerver.lib.remote_server import send_server_data_to_push_bouncer, should_send_analytics_data
from zerver.lib.timestamp import floor_to_hour
from zerver.models import Realm


class Command(ZulipBaseCommand):
    help = """Fills Analytics tables.

    Run as a cron job that runs every hour."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--time",
            "-t",
            help="Update stat tables from current state to --time. Defaults to the current time.",
            default=timezone_now().isoformat(),
        )
        parser.add_argument("--utc", action="store_true", help="Interpret --time in UTC.")
        parser.add_argument(
            "--stat", "-s", help="CountStat to process. If omitted, all stats are processed."
        )
        parser.add_argument(
            "--verbose", action="store_true", help="Print timing information to stdout."
        )

    @override
    @abort_cron_during_deploy
    @abort_unless_locked
    def handle(self, *args: Any, **options: Any) -> None:
        self.run_update_analytics_counts(options)

    def run_update_analytics_counts(self, options: dict[str, Any]) -> None:
        # installation_epoch relies on there being at least one realm; we
        # shouldn't run the analytics code if that condition isn't satisfied
        if not Realm.objects.exists():
            logger.info("No realms, stopping update_analytics_counts")
            return

        fill_to_time = parse_datetime(options["time"])
        assert fill_to_time is not None
        if options["utc"]:
            fill_to_time = fill_to_time.replace(tzinfo=timezone.utc)
        if fill_to_time.tzinfo is None:
            raise ValueError(
                "--time must be time-zone-aware. Maybe you meant to use the --utc option?"
            )

        fill_to_time = floor_to_hour(fill_to_time.astimezone(timezone.utc))

        if options["stat"] is not None:
            stats = [ALL_COUNT_STATS[options["stat"]]]
        else:
            stats = list(ALL_COUNT_STATS.values())

        logger.info("Starting updating analytics counts through %s", fill_to_time)
        if options["verbose"]:
            start = time.time()
            last = start

        for stat in stats:
            process_count_stat(stat, fill_to_time)
            if options["verbose"]:
                print(f"Updated {stat.property} in {time.time() - last:.3f}s")
                last = time.time()

        if options["verbose"]:
            print(
                f"Finished updating analytics counts through {fill_to_time} in {time.time() - start:.3f}s"
            )
        logger.info("Finished updating analytics counts through %s", fill_to_time)

        if should_send_analytics_data():
            # Based on the specific value of the setting, the exact details to send
            # will be decided. However, we proceed just based on this not being falsey.

            # Skew 0-10 minutes based on a hash of settings.ZULIP_ORG_ID, so
            # that each server will report in at a somewhat consistent time.
            assert settings.ZULIP_ORG_ID
            delay = int.from_bytes(
                hashlib.sha256(settings.ZULIP_ORG_ID.encode()).digest(), byteorder="big"
            ) % (60 * 10)
            logger.info("Sleeping %d seconds before reporting...", delay)
            time.sleep(delay)

            send_server_data_to_push_bouncer(consider_usage_statistics=True, raise_on_error=True)
```

--------------------------------------------------------------------------------

---[FILE: 0001_initial.py]---
Location: zulip-main/analytics/migrations/0001_initial.py
Signals: Django

```python
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0030_realm_org_type"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Anomaly",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID", serialize=False, auto_created=True, primary_key=True
                    ),
                ),
                ("info", models.CharField(max_length=1000)),
            ],
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name="HuddleCount",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID", serialize=False, auto_created=True, primary_key=True
                    ),
                ),
                (
                    "huddle",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="zerver.Recipient"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
                    ),
                ),
                ("property", models.CharField(max_length=40)),
                ("end_time", models.DateTimeField()),
                ("interval", models.CharField(max_length=20)),
                ("value", models.BigIntegerField()),
                (
                    "anomaly",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="analytics.Anomaly",
                        null=True,
                    ),
                ),
            ],
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name="InstallationCount",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID", serialize=False, auto_created=True, primary_key=True
                    ),
                ),
                ("property", models.CharField(max_length=40)),
                ("end_time", models.DateTimeField()),
                ("interval", models.CharField(max_length=20)),
                ("value", models.BigIntegerField()),
                (
                    "anomaly",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="analytics.Anomaly",
                        null=True,
                    ),
                ),
            ],
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name="RealmCount",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID", serialize=False, auto_created=True, primary_key=True
                    ),
                ),
                (
                    "realm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="zerver.Realm"
                    ),
                ),
                ("property", models.CharField(max_length=40)),
                ("end_time", models.DateTimeField()),
                ("interval", models.CharField(max_length=20)),
                ("value", models.BigIntegerField()),
                (
                    "anomaly",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="analytics.Anomaly",
                        null=True,
                    ),
                ),
            ],
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name="StreamCount",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID", serialize=False, auto_created=True, primary_key=True
                    ),
                ),
                (
                    "realm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="zerver.Realm"
                    ),
                ),
                (
                    "stream",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="zerver.Stream"
                    ),
                ),
                ("property", models.CharField(max_length=40)),
                ("end_time", models.DateTimeField()),
                ("interval", models.CharField(max_length=20)),
                ("value", models.BigIntegerField()),
                (
                    "anomaly",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="analytics.Anomaly",
                        null=True,
                    ),
                ),
            ],
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name="UserCount",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID", serialize=False, auto_created=True, primary_key=True
                    ),
                ),
                (
                    "realm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="zerver.Realm"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
                    ),
                ),
                ("property", models.CharField(max_length=40)),
                ("end_time", models.DateTimeField()),
                ("interval", models.CharField(max_length=20)),
                ("value", models.BigIntegerField()),
                (
                    "anomaly",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="analytics.Anomaly",
                        null=True,
                    ),
                ),
            ],
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name="usercount",
            unique_together={("user", "property", "end_time", "interval")},
        ),
        migrations.AlterUniqueTogether(
            name="streamcount",
            unique_together={("stream", "property", "end_time", "interval")},
        ),
        migrations.AlterUniqueTogether(
            name="realmcount",
            unique_together={("realm", "property", "end_time", "interval")},
        ),
        migrations.AlterUniqueTogether(
            name="installationcount",
            unique_together={("property", "end_time", "interval")},
        ),
        migrations.AlterUniqueTogether(
            name="huddlecount",
            unique_together={("huddle", "property", "end_time", "interval")},
        ),
    ]
```

--------------------------------------------------------------------------------

````
