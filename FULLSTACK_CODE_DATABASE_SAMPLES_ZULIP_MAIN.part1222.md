---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1222
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1222 of 1290)

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

---[FILE: alert.json]---
Location: zulip-main/zerver/webhooks/librato/fixtures/alert.json

```json
{
  "alert": {
    "id": 6294535,
    "name": "alert.name",
    "runbook_url": "http://www.google.pl",
    "version": 2,
    "description": "descrription"
  },
  "account": "lizonr@gmail.com",
  "trigger_time": 1459415502,
  "conditions": [
    {
      "id": 3543146,
      "type": "below",
      "threshold": 44,
      "summary_function": "sum",
      "duration": 300
    },
    {
      "id": 3651148,
      "type": "absent",
      "summary_function": "average",
      "duration": 300
    },
    {
      "id": 3651902,
      "type": "above",
      "threshold": 9,
      "summary_function": "derivative",
      "duration": 300
    }
  ],
  "violations": {
    "test-source": [
      {
        "metric": "librato.cpu.percent.idle",
        "value": 2,
        "recorded_at": 1459415502,
        "condition_violated": 3543146
      },
      {
        "metric": "librato.swap.swap.cached",
        "value": 42,
        "recorded_at": 1459415502,
        "condition_violated": 3651148
      },
      {
        "metric": "librato.swap.swap.cached",
        "value": 51,
        "recorded_at": 1459415502,
        "condition_violated": 3651902
      }
    ]
  },
  "triggered_by_user_test": true
}
```

--------------------------------------------------------------------------------

---[FILE: alert_cleared.json]---
Location: zulip-main/zerver/webhooks/librato/fixtures/alert_cleared.json

```json
{
  "alert": {
    "id": 6309313,
    "name": "Alert_name",
    "runbook_url": "",
    "version": 2
  },
  "account": "mail@gmail.com",
  "trigger_time": 1460466704,
  "clear": "normal"
}
```

--------------------------------------------------------------------------------

---[FILE: bad.json]---
Location: zulip-main/zerver/webhooks/librato/fixtures/bad.json

```json
{
  "alert": {
```

--------------------------------------------------------------------------------

---[FILE: bad_msg_type.json]---
Location: zulip-main/zerver/webhooks/librato/fixtures/bad_msg_type.json

```json
{
  "alert": {
    "id": 6294535,
    "name": "alert.name",
    "runbook_url": "http://www.google.pl",
    "version": 2,
    "description": "descrription"
  },
  "account": "lizonr@gmail.com",
  "trigger_time": 1459415502,
  "conditions": [
    {
      "id": 3543146,
      "type": "below",
      "threshold": 44,
      "summary_function": "sum",
      "duration": 300
    },
    {
      "id": 3651148,
      "type": "absent",
      "summary_function": "average",
      "duration": 300
    },
    {
      "id": 3651902,
      "type": "above",
      "threshold": 9,
      "summary_function": "derivative",
      "duration": 300
    }
  ],
  "violations2": {
    "test-source": [
      {
        "metric": "librato.cpu.percent.idle",
        "value": 2,
        "recorded_at": 1459415502,
        "condition_violated": 3543146
      },
      {
        "metric": "librato.swap.swap.cached",
        "value": 42,
        "recorded_at": 1459415502,
        "condition_violated": 3651148
      },
      {
        "metric": "librato.swap.swap.cached",
        "value": 51,
        "recorded_at": 1459415502,
        "condition_violated": 3651902
      }
    ]
  },
  "triggered_by_user_test": true
}
```

--------------------------------------------------------------------------------

---[FILE: snapshot.json]---
Location: zulip-main/zerver/webhooks/librato/fixtures/snapshot.json

```json
{
  "attachments": [
    {
      "author_name": "Hamlet",
      "author_link": "mailto:hamlet@zulip  .com",
      "author_icon": "https://secure.gravatar.com/avatar/99ca91cc7c0d8ef72fbd69a03a871a12?s=32&d=mm",
      "title": "https://metrics.librato.com/s/spaces/167315/explore/1731491?duration=72039&end_time=1460569409",
      "title_link": "https://metrics.librato.com/s/spaces/167315/explore/1731491?duration=72039&end_time=1460569409",
      "fallback": "https://metrics.librato.com/s/spaces/167315/explore/1731491?duration=72039&end_time=1460569409 by Rafal: http://snapshots.librato.com/chart/nr5l3n0c-82162.png",
      "image_url": "http://snapshots.librato.com/chart/nr5l3n0c-82162.png",
      "text": null,
      "color": "#0881AE"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: three_conditions_alert.json]---
Location: zulip-main/zerver/webhooks/librato/fixtures/three_conditions_alert.json

```json
{
  "alert": {
    "id": 6294535,
    "name": "TooHighTemperature",
    "runbook_url": "http://www.use.water.pl",
    "version": 2,
    "description": "Measurement of temperature in your computer"
  },
  "account": "lizonr@gmail.com",
  "trigger_time": 1460407214,
  "conditions": [
    {
      "id": 4158783,
      "type": "above",
      "threshold": 4,
      "summary_function": "absolute_value",
      "duration": 300
    },
    {
      "id": 4299396,
      "type": "above",
      "threshold": 99,
      "summary_function": "max"
    },
    {
      "id": 3651148,
      "type": "absent",
      "summary_function": "average",
      "duration": 60
    }
  ],
  "violations": {
    "test-source": [
      {
        "metric": "collectd.interface.eth0.if_octets.tx",
        "value": 46,
        "recorded_at": 1460407214,
        "condition_violated": 4158783
      },
      {
        "metric": "collectd.load.load.longterm",
        "value": 141,
        "recorded_at": 1460407214,
        "condition_violated": 4299396
      },
      {
        "metric": "librato.swap.swap.cached",
        "value": 42,
        "recorded_at": 1460407214,
        "condition_violated": 3651148
      }
    ]
  },
  "triggered_by_user_test": true
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/lidarr/doc.md

```text
# Zulip Lidarr integration

Receive Lidarr notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to **Settings** in your Lidarr dashboard. Click **Connect**, and
   then click on the **+** icon.

1. Select **Webhook**, and set the webhook name to a name of your
   choice, such as `Zulip`. Select the scenarios you would like to
   receive notifications for. You may also enter tags if you would like
   to be notified about artists with specific tags.

1. Set **URL** to the URL generated above. Set **Method** to **POST**,
   and leave the **Username** and **Password** fields blank. Click
   **Save**, and you should receive a test message.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/lidarr/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/lidarr/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class LidarrHookTests(WebhookTestCase):
    CHANNEL_NAME = "lidarr"
    URL_TEMPLATE = "/api/v1/external/lidarr?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "lidarr"

    def test_lidarr_test(self) -> None:
        """
        Tests if lidarr test payload is handled correctly
        """
        expected_topic_name = "Lidarr - Test"
        expected_message = "Lidarr webhook has been successfully configured."
        self.check_webhook("lidarr_test", expected_topic_name, expected_message)

    def test_lidarr_tracks_renamed(self) -> None:
        """
        Tests if lidarr tracks renamed payload is handled correctly
        """
        expected_topic_name = "Little Mix"
        expected_message = "The artist Little Mix has had its tracks renamed."
        self.check_webhook("lidarr_tracks_renamed", expected_topic_name, expected_message)

    def test_lidarr_tracks_retagged(self) -> None:
        """
        Tests if lidarr tracks retagged payload is handled correctly
        """
        expected_topic_name = "Little Mix"
        expected_message = "The artist Little Mix has had its tracks retagged."
        self.check_webhook("lidarr_tracks_retagged", expected_topic_name, expected_message)

    def test_lidarr_tracks_imported(self) -> None:
        """
        Tests if lidarr tracks imported payload is handled correctly
        """
        expected_topic_name = "UB40"
        expected_message = """
The following tracks by UB40 have been imported:
* Cherry Oh Baby
* Keep On Moving
* Please Don't Make Me Cry
* Sweet Sensation
* Johnny Too Bad
* Red Red Wine
* Guilty
* She Caught the Train
* Version Girl
* Many Rivers to Cross
""".strip()
        self.check_webhook("lidarr_tracks_imported", expected_topic_name, expected_message)

    def test_lidarr_tracks_imported_upgrade(self) -> None:
        """
        Tests if lidarr tracks imported upgrade payload is handled correctly
        """
        expected_topic_name = "Little Mix"
        expected_message = """
The following tracks by Little Mix have been imported due to upgrade:
* The National Manthem
* Woman Like Me
* Think About Us
* Strip
* Monster in Me
* Joan of Arc
* Love a Girl Right
* American Boy
* Told You So
* Wasabi
* More Than Words
* Motivate
* Notice
* The Cure
* Forget You Not
* Woman’s World
* The Cure (stripped)
* Only You
""".strip()
        self.check_webhook("lidarr_tracks_imported_upgrade", expected_topic_name, expected_message)

    def test_lidarr_album_grabbed(self) -> None:
        """
        Tests if lidarr album grabbed payload is handled correctly
        """
        expected_topic_name = "UB40"
        expected_message = "The album Labour of Love by UB40 has been grabbed."
        self.check_webhook("lidarr_album_grabbed", expected_topic_name, expected_message)

    def test_lidarr_tracks_imported_over_limit(self) -> None:
        """
        Tests if lidarr tracks imported over limit payload is handled correctly
        """
        expected_topic_name = "Michael Jackson"
        expected_message = """
The following tracks by Michael Jackson have been imported:
* Scream
* Billie Jean
* The Way You Make Me Feel
* They Don’t Care About Us
* Stranger in Moscow
* Black or White
* This Time Around
* Rock With You
* Earth Song
* She’s Out of My Life
* D.S.
* Bad
* Money
* I Just Can’t Stop Loving You
* Man in the Mirror
* Come Together
* Thriller
* You Are Not Alone
* Beat It
* Childhood (theme from “Free Willy 2”)
[and 10 more tracks(s)]
""".strip()
        self.check_webhook(
            "lidarr_tracks_imported_over_limit", expected_topic_name, expected_message
        )

    def test_lidarr_tracks_imported_upgrade_over_limit(self) -> None:
        """
        Tests if lidarr tracks imported upgrade over limit payload is handled correctly
        """
        expected_topic_name = "Michael Jackson"
        expected_message = """
The following tracks by Michael Jackson have been imported due to upgrade:
* Scream
* Billie Jean
* The Way You Make Me Feel
* They Don’t Care About Us
* Stranger in Moscow
* Black or White
* This Time Around
* Rock With You
* Earth Song
* She’s Out of My Life
* D.S.
* Bad
* Money
* I Just Can’t Stop Loving You
* Man in the Mirror
* Come Together
* Thriller
* You Are Not Alone
* Beat It
* Childhood (theme from “Free Willy 2”)
[and 10 more tracks(s)]
""".strip()
        self.check_webhook(
            "lidarr_tracks_imported_upgrade_over_limit", expected_topic_name, expected_message
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/lidarr/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_bool, check_string
from zerver.lib.webhooks.common import check_send_webhook_message, get_setup_webhook_message
from zerver.models import UserProfile

LIDARR_TOPIC_TEMPLATE = "{artist_name}".strip()
LIDARR_TOPIC_TEMPLATE_TEST = "Lidarr - Test".strip()

LIDARR_MESSAGE_TEMPLATE_TRACKS_RENAMED = (
    "The artist {artist_name} has had its tracks renamed.".strip()
)
LIDARR_MESSAGE_TEMPLATE_TRACKS_RETAGGED = (
    "The artist {artist_name} has had its tracks retagged.".strip()
)
LIDARR_MESSAGE_TEMPLATE_ALBUM_GRABBED = (
    "The album {album_name} by {artist_name} has been grabbed.".strip()
)

LIDARR_MESSAGE_TEMPLATE_TRACKS_IMPORTED = """
The following tracks by {artist_name} have been imported:
{tracks_final_data}
""".strip()

LIDARR_MESSAGE_TEMPLATE_TRACKS_IMPORTED_UPGRADE = """
The following tracks by {artist_name} have been imported due to upgrade:
{tracks_final_data}
""".strip()

LIDARR_TRACKS_ROW_TEMPLATE = "* {track_title}\n"
LIDARR_TRACKS_OTHERS_ROW_TEMPLATE = "[and {tracks_number} more tracks(s)]"
LIDARR_TRACKS_LIMIT = 20

ALL_EVENT_TYPES = ["Test", "Grab", "Rename", "Retag", "Download"]


def get_tracks_content(tracks_data: list[dict[str, str]]) -> str:
    tracks_content = ""
    for track in tracks_data[:LIDARR_TRACKS_LIMIT]:
        tracks_content += LIDARR_TRACKS_ROW_TEMPLATE.format(track_title=track.get("title"))

    if len(tracks_data) > LIDARR_TRACKS_LIMIT:
        tracks_content += LIDARR_TRACKS_OTHERS_ROW_TEMPLATE.format(
            tracks_number=len(tracks_data) - LIDARR_TRACKS_LIMIT,
        )

    return tracks_content.rstrip()


@webhook_view("Lidarr", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_lidarr_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    body = get_body_for_http_request(payload)
    topic_name = get_topic_for_http_request(payload)

    check_send_webhook_message(
        request, user_profile, topic_name, body, payload["eventType"].tame(check_string)
    )
    return json_success(request)


def get_topic_for_http_request(payload: WildValue) -> str:
    if payload["eventType"].tame(check_string) == "Test":
        topic_name = LIDARR_TOPIC_TEMPLATE_TEST
    else:
        topic_name = LIDARR_TOPIC_TEMPLATE.format(
            artist_name=payload["artist"]["name"].tame(check_string)
        )

    return topic_name


def get_body_for_album_grabbed_event(payload: WildValue) -> str:
    return LIDARR_MESSAGE_TEMPLATE_ALBUM_GRABBED.format(
        artist_name=payload["artist"]["name"].tame(check_string),
        album_name=payload["albums"][0]["title"].tame(check_string),
    )


def get_body_for_tracks_renamed_event(payload: WildValue) -> str:
    return LIDARR_MESSAGE_TEMPLATE_TRACKS_RENAMED.format(
        artist_name=payload["artist"]["name"].tame(check_string)
    )


def get_body_for_tracks_retagged_event(payload: WildValue) -> str:
    return LIDARR_MESSAGE_TEMPLATE_TRACKS_RETAGGED.format(
        artist_name=payload["artist"]["name"].tame(check_string)
    )


def get_body_for_tracks_imported_upgrade_event(payload: WildValue) -> str:
    tracks_data = [{"title": track["title"].tame(check_string)} for track in payload["tracks"]]
    data = {
        "artist_name": payload["artist"]["name"].tame(check_string),
        "tracks_final_data": get_tracks_content(tracks_data),
    }

    return LIDARR_MESSAGE_TEMPLATE_TRACKS_IMPORTED_UPGRADE.format(**data)


def get_body_for_tracks_imported_event(payload: WildValue) -> str:
    tracks_data = [{"title": track["title"].tame(check_string)} for track in payload["tracks"]]
    data = {
        "artist_name": payload["artist"]["name"].tame(check_string),
        "tracks_final_data": get_tracks_content(tracks_data),
    }

    return LIDARR_MESSAGE_TEMPLATE_TRACKS_IMPORTED.format(**data)


def get_body_for_http_request(payload: WildValue) -> str:
    event_type = payload["eventType"].tame(check_string)
    if event_type == "Test":
        return get_setup_webhook_message("Lidarr")
    elif event_type == "Grab":
        return get_body_for_album_grabbed_event(payload)
    elif event_type == "Rename":
        return get_body_for_tracks_renamed_event(payload)
    elif event_type == "Retag":
        return get_body_for_tracks_retagged_event(payload)
    elif event_type == "Download" and "isUpgrade" in payload:
        if payload["isUpgrade"].tame(check_bool):
            return get_body_for_tracks_imported_upgrade_event(payload)
        else:
            return get_body_for_tracks_imported_event(payload)
    else:
        raise UnsupportedWebhookEventTypeError(event_type)
```

--------------------------------------------------------------------------------

---[FILE: lidarr_album_grabbed.json]---
Location: zulip-main/zerver/webhooks/lidarr/fixtures/lidarr_album_grabbed.json

```json
{
    "albums": [
      {
        "id": 2,
        "title": "Labour of Love",
        "releaseDate": "1983-01-01T00:00:00Z",
        "quality": "MP3-320",
        "qualityVersion": 1
      }
    ],
    "release": {
      "quality": "MP3-320",
      "qualityVersion": 1,
      "releaseTitle": "UB40 - Labour Of Love - [1983] - [320]",
      "indexer": "IP Torrents - Jackett",
      "size": 96783568
    },
    "eventType": "Grab",
    "artist": {
      "id": 1,
      "name": "UB40",
      "path": "/home36/adbtech/media/Music/UB40",
      "mbId": "7113aab7-628f-4050-ae49-dbecac110ca8"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: lidarr_test.json]---
Location: zulip-main/zerver/webhooks/lidarr/fixtures/lidarr_test.json

```json
{
    "albums": [
      {
        "id": 123,
        "title": "Test title",
        "qualityVersion": 0
      }
    ],
    "eventType": "Test",
    "artist": {
      "id": 1,
      "name": "Test Name",
      "path": "C:\\testpath",
      "mbId": "aaaaa-aaa-aaaa-aaaaaa"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: lidarr_tracks_imported.json]---
Location: zulip-main/zerver/webhooks/lidarr/fixtures/lidarr_tracks_imported.json

```json
{
    "tracks": [
      {
        "id": 41,
        "title": "Cherry Oh Baby",
        "trackNumber": "A1",
        "quality": "MP3-320",
        "qualityVersion": 1
      },
      {
        "id": 42,
        "title": "Keep On Moving",
        "trackNumber": "A2",
        "quality": "MP3-320",
        "qualityVersion": 1
      },
      {
        "id": 43,
        "title": "Please Don't Make Me Cry",
        "trackNumber": "A3",
        "quality": "MP3-320",
        "qualityVersion": 1
      },
      {
        "id": 44,
        "title": "Sweet Sensation",
        "trackNumber": "A4",
        "quality": "MP3-320",
        "qualityVersion": 1
      },
      {
        "id": 45,
        "title": "Johnny Too Bad",
        "trackNumber": "A5",
        "quality": "MP3-320",
        "qualityVersion": 1
      },
      {
        "id": 46,
        "title": "Red Red Wine",
        "trackNumber": "B1",
        "quality": "MP3-320",
        "qualityVersion": 1
      },
      {
        "id": 47,
        "title": "Guilty",
        "trackNumber": "B2",
        "quality": "MP3-320",
        "qualityVersion": 1
      },
      {
        "id": 48,
        "title": "She Caught the Train",
        "trackNumber": "B3",
        "quality": "MP3-320",
        "qualityVersion": 1
      },
      {
        "id": 49,
        "title": "Version Girl",
        "trackNumber": "B4",
        "quality": "MP3-320",
        "qualityVersion": 1
      },
      {
        "id": 50,
        "title": "Many Rivers to Cross",
        "trackNumber": "B5",
        "quality": "MP3-320",
        "qualityVersion": 1
      }
    ],
    "trackFiles": [
      {
        "id": 1,
        "path": "/home36/adbtech/media/Music/UB40/Labour of Love (1983)/UB40 - Labour of Love - 01 - Cherry Oh Baby.mp3",
        "quality": "MP3-320",
        "qualityVersion": 1,
        "sceneName": "UB40 - Labour Of Love - [1983] - [320]"
      },
      {
        "id": 2,
        "path": "/home36/adbtech/media/Music/UB40/Labour of Love (1983)/UB40 - Labour of Love - 02 - Keep On Moving.mp3",
        "quality": "MP3-320",
        "qualityVersion": 1,
        "sceneName": "UB40 - Labour Of Love - [1983] - [320]"
      },
      {
        "id": 3,
        "path": "/home36/adbtech/media/Music/UB40/Labour of Love (1983)/UB40 - Labour of Love - 03 - Please Don't Make Me Cry.mp3",
        "quality": "MP3-320",
        "qualityVersion": 1,
        "sceneName": "UB40 - Labour Of Love - [1983] - [320]"
      },
      {
        "id": 4,
        "path": "/home36/adbtech/media/Music/UB40/Labour of Love (1983)/UB40 - Labour of Love - 04 - Sweet Sensation.mp3",
        "quality": "MP3-320",
        "qualityVersion": 1,
        "sceneName": "UB40 - Labour Of Love - [1983] - [320]"
      },
      {
        "id": 5,
        "path": "/home36/adbtech/media/Music/UB40/Labour of Love (1983)/UB40 - Labour of Love - 05 - Johnny Too Bad.mp3",
        "quality": "MP3-320",
        "qualityVersion": 1,
        "sceneName": "UB40 - Labour Of Love - [1983] - [320]"
      },
      {
        "id": 6,
        "path": "/home36/adbtech/media/Music/UB40/Labour of Love (1983)/UB40 - Labour of Love - 06 - Red Red Wine.mp3",
        "quality": "MP3-320",
        "qualityVersion": 1,
        "sceneName": "UB40 - Labour Of Love - [1983] - [320]"
      },
      {
        "id": 7,
        "path": "/home36/adbtech/media/Music/UB40/Labour of Love (1983)/UB40 - Labour of Love - 07 - Guilty.mp3",
        "quality": "MP3-320",
        "qualityVersion": 1,
        "sceneName": "UB40 - Labour Of Love - [1983] - [320]"
      },
      {
        "id": 8,
        "path": "/home36/adbtech/media/Music/UB40/Labour of Love (1983)/UB40 - Labour of Love - 08 - She Caught the Train.mp3",
        "quality": "MP3-320",
        "qualityVersion": 1,
        "sceneName": "UB40 - Labour Of Love - [1983] - [320]"
      },
      {
        "id": 9,
        "path": "/home36/adbtech/media/Music/UB40/Labour of Love (1983)/UB40 - Labour of Love - 09 - Version Girl.mp3",
        "quality": "MP3-320",
        "qualityVersion": 1,
        "sceneName": "UB40 - Labour Of Love - [1983] - [320]"
      },
      {
        "id": 10,
        "path": "/home36/adbtech/media/Music/UB40/Labour of Love (1983)/UB40 - Labour of Love - 10 - Many Rivers to Cross.mp3",
        "quality": "MP3-320",
        "qualityVersion": 1,
        "sceneName": "UB40 - Labour Of Love - [1983] - [320]"
      }
    ],
    "isUpgrade": false,
    "eventType": "Download",
    "artist": {
      "id": 1,
      "name": "UB40",
      "path": "/home36/adbtech/media/Music/UB40",
      "mbId": "7113aab7-628f-4050-ae49-dbecac110ca8"
    }
}
```

--------------------------------------------------------------------------------

````
