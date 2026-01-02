---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1238
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1238 of 1290)

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

---[FILE: v5_finished.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_finished.json

```json
{
  "performed_by": {
    "name": "Leo Franchi",
    "id": 981905,
    "initials": "LF",
    "kind": "person"
  },
  "changes": [
    {
      "new_values": {
        "updated_at": 1389218709000,
        "accepted_at": 1389218708000,
        "current_state": "accepted"
      },
      "story_type": "feature",
      "name": "Story of the Year",
      "id": 63486316,
      "kind": "story",
      "change_type": "update",
      "original_values": {
        "updated_at": 1389218691000,
        "accepted_at": null,
        "current_state": "delivered"
      }
    }
  ],
  "project": {
    "name": "Hard Code",
    "id": 807213,
    "kind": "project"
  },
  "primary_resources": [
    {
      "story_type": "feature",
      "url": "http://www.pivotaltracker.com/story/show/63486316",
      "id": 63486316,
      "name": "Story of the Year",
      "kind": "story"
    }
  ],
  "highlight": "accepted",
  "project_version": 65,
  "message": "Leo Franchi accepted this feature",
  "occurred_at": 1389218709000,
  "guid": "807213_65",
  "kind": "story_update_activity"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_moved.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_moved.json

```json
{
  "project": {
    "id": 807213,
    "name": "Hard Code",
    "kind": "project"
  },
  "guid": "807213_84",
  "project_version": 84,
  "highlight": "moved",
  "occurred_at": 1389282538000,
  "performed_by": {
    "id": 981905,
    "name": "Leo Franchi",
    "initials": "LF",
    "kind": "person"
  },
  "primary_resources": [
    {
      "id": 63496066,
      "story_type": "bug",
      "url": "http://www.pivotaltracker.com/story/show/63496066",
      "name": "Pivotal Test",
      "kind": "story"
    }
  ],
  "message": "Leo Franchi moved this story after 'test story'",
  "changes": [
    {
      "id": 63496066,
      "story_type": "bug",
      "name": "Pivotal Test",
      "new_values": {
        "current_state": "unscheduled",
        "after_id": 48326435,
        "updated_at": 1389282537000,
        "before_id": null
      },
      "change_type": "update",
      "original_values": {
        "current_state": "unstarted",
        "after_id": 63495972,
        "updated_at": 1389282533000,
        "before_id": 63495662
      },
      "kind": "story"
    }
  ],
  "kind": "story_move_activity"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_rejected.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_rejected.json
Signals: Next.js

```json
{
  "primary_resources": [
    {
      "story_type": "feature",
      "kind": "story",
      "id": 63486316,
      "url": "http://www.pivotaltracker.com/story/show/63486316",
      "name": "Story of the Year"
    }
  ],
  "message": "Leo Franchi rejected this feature with comments: \"Try again next time\"",
  "guid": "807213_73",
  "kind": "story_update_activity",
  "performed_by": {
    "kind": "person",
    "id": 981905,
    "initials": "LF",
    "name": "Leo Franchi"
  },
  "project": {
    "kind": "project",
    "id": 807213,
    "name": "Hard Code"
  },
  "occurred_at": 1389218802000,
  "changes": [
    {
      "new_values": {
        "google_attachments": [

        ],
        "updated_at": 1389218802000,
        "file_attachment_ids": [

        ],
        "file_attachments": [

        ],
        "person_id": 981905,
        "id": 59124580,
        "story_id": 63486316,
        "google_attachment_ids": [

        ],
        "created_at": 1389218802000,
        "text": "Try again next time"
      },
      "kind": "comment",
      "id": 59124580,
      "change_type": "create"
    },
    {
      "original_values": {
        "updated_at": 1389218792000,
        "current_state": "delivered"
      },
      "new_values": {
        "updated_at": 1389218802000,
        "current_state": "rejected"
      },
      "story_type": "feature",
      "kind": "story",
      "id": 63486316,
      "name": "Story of the Year",
      "change_type": "update"
    }
  ],
  "project_version": 73,
  "highlight": "rejected"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_started.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_started.json

```json
{
  "performed_by": {
    "name": "Leo Franchi",
    "id": 981905,
    "initials": "LF",
    "kind": "person"
  },
  "changes": [
    {
      "new_values": {
        "owned_by_id": 981905,
        "updated_at": 1389218898000,
        "current_state": "started"
      },
      "story_type": "feature",
      "name": "Fresh Story",
      "id": 63495972,
      "kind": "story",
      "change_type": "update",
      "original_values": {
        "owned_by_id": null,
        "updated_at": 1389218887000,
        "current_state": "unstarted"
      }
    }
  ],
  "project": {
    "name": "Hard Code",
    "id": 807213,
    "kind": "project"
  },
  "primary_resources": [
    {
      "story_type": "feature",
      "url": "http://www.pivotaltracker.com/story/show/63495972",
      "id": 63495972,
      "name": "Fresh Story",
      "kind": "story"
    }
  ],
  "highlight": "started",
  "project_version": 78,
  "message": "Leo Franchi started this feature",
  "occurred_at": 1389218898000,
  "guid": "807213_78",
  "kind": "story_update_activity"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_type_changed.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_type_changed.json

```json
{
  "message": "Leo Franchi edited this bug",
  "primary_resources": [
    {
      "url": "http://www.pivotaltracker.com/story/show/63496066",
      "kind": "story",
      "story_type": "bug",
      "id": 63496066,
      "name": "Pivotal Test"
    }
  ],
  "guid": "807213_82",
  "kind": "story_update_activity",
  "project": {
    "kind": "project",
    "id": 807213,
    "name": "Hard Code"
  },
  "occurred_at": 1389219010000,
  "performed_by": {
    "initials": "LF",
    "kind": "person",
    "id": 981905,
    "name": "Leo Franchi"
  },
  "changes": [
    {
      "kind": "story",
      "story_type": "bug",
      "change_type": "update",
      "id": 63496066,
      "original_values": {
        "estimate": 3,
        "updated_at": 1389218976000,
        "story_type": "feature"
      },
      "new_values": {
        "estimate": null,
        "updated_at": 1389219010000,
        "story_type": "bug"
      },
      "name": "Pivotal Test"
    }
  ],
  "project_version": 82,
  "highlight": "edited"
}
```

--------------------------------------------------------------------------------

---[FILE: v5_unsupported.json]---
Location: zulip-main/zerver/webhooks/pivotal/fixtures/v5_unsupported.json

```json
{
  "occurred_at": 1389218398000,
  "kind": "epic_update_activity",
  "project": {
    "name": "Hard Code",
    "kind": "project",
    "id": 807213
  },
  "changes": [
    {
      "name": "Story of the Year",
      "story_type": "feature",
      "change_type": "update",
      "kind": "story",
      "new_values": {
        "current_state": "accepted",
        "updated_at": 1389218398000,
        "accepted_at": 1389218397000
      },
      "id": 63486316,
      "original_values": {
        "current_state": "unstarted",
        "updated_at": 1389215951000,
        "accepted_at": null
      }
    }
  ],
  "highlight": "accepted",
  "project_version": 60,
  "guid": "807213_60",
  "primary_resources": [
    {
      "name": "Story of the Year",
      "story_type": "feature",
      "kind": "story",
      "id": 63486316,
      "url": "http://www.pivotaltracker.com/story/show/63486316"
    }
  ],
  "performed_by": {
    "name": "Leo Franchi",
    "initials": "LF",
    "kind": "person",
    "id": 981905
  },
  "message": "Leo Franchi accepted this feature"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/radarr/doc.md

```text
# Zulip Radarr integration

Receive Radarr notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Radarr dashboard. Open **Settings**, and select **Connect**.
    Click the plus (**+**) icon.

1. Select **Webhook**, and set the name of the webhook to any name of your
    choice, such as `Zulip`. Select the scenarios you would like to receive
    notifications for. You may also enter tags if you would like to be
    notified about movies with specific tags.

1. Set **URL** to the URL generated above, and set **Method** to
    **POST**. Leave the **Username** and **Password** fields blank. Click **Save**, which will send a test message to Zulip.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/radarr/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/radarr/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class RadarrHookTests(WebhookTestCase):
    CHANNEL_NAME = "radarr"
    URL_TEMPLATE = "/api/v1/external/radarr?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "radarr"

    def test_radarr_test(self) -> None:
        """
        Tests if radarr test payload is handled correctly
        """
        expected_topic_name = "Radarr - Test"
        expected_message = "Radarr webhook has been successfully configured."
        self.check_webhook("radarr_test", expected_topic_name, expected_message)

    def test_radarr_application_update(self) -> None:
        """
        Tests if radarr application update payload is handled correctly
        """
        expected_topic_name = "Radarr - Application update"
        expected_message = "Radarr was updated from 4.2.0.6370 to 4.2.0.6372."
        self.check_webhook("radarr_application_update", expected_topic_name, expected_message)

    def test_radarr_health_check_warning(self) -> None:
        """
        Tests if radarr health check warning payload is handled correctly
        """
        expected_topic_name = "Health warning"
        expected_message = "No download client is available."
        self.check_webhook("radarr_health_check_warning", expected_topic_name, expected_message)

    def test_radarr_health_check_error(self) -> None:
        """
        Tests if radarr health check error payload is handled correctly
        """
        expected_topic_name = "Health error"
        expected_message = "Movie Gotham City Sirens (tmdbid 416649) was removed from TMDb."
        self.check_webhook("radarr_health_check_error", expected_topic_name, expected_message)

    def test_radarr_movie_renamed(self) -> None:
        """
        Tests if radarr movie renamed payload is handled correctly
        """
        expected_topic_name = "Marley & Me"
        expected_message = "The movie Marley & Me has been renamed."
        self.check_webhook("radarr_movie_renamed", expected_topic_name, expected_message)

    def test_radarr_movie_imported(self) -> None:
        """
        Tests if radarr movie imported payload is handled correctly
        """
        expected_topic_name = "Batman v Superman: Dawn of Justice"
        expected_message = "The movie Batman v Superman: Dawn of Justice has been imported."
        self.check_webhook("radarr_movie_imported", expected_topic_name, expected_message)

    def test_radarr_movie_imported_upgrade(self) -> None:
        """
        Tests if radarr movie imported upgrade payload is handled correctly
        """
        expected_topic_name = "Greenland"
        expected_message = "The movie Greenland has been upgraded from WEBRip-720p to WEBRip-1080p."
        self.check_webhook("radarr_movie_imported_upgrade", expected_topic_name, expected_message)

    def test_radarr_movie_grabbed(self) -> None:
        """
        Tests if radarr movie grabbed payload is handled correctly
        """
        expected_topic_name = "Greenland"
        expected_message = "The movie Greenland has been grabbed."
        self.check_webhook("radarr_movie_grabbed", expected_topic_name, expected_message)

    def test_radarr_movie_deleted(self) -> None:
        """
        Tests if radarr movie deleted payload is handled correctly
        """
        expected_topic_name = "Batman v Superman: Dawn of Justice"
        expected_message = (
            "The movie Batman v Superman: Dawn of Justice was deleted; its files were also deleted."
        )
        self.check_webhook("radarr_movie_deleted", expected_topic_name, expected_message)

    def test_radarr_movie_file_deleted(self) -> None:
        """
        Tests if radarr movie file deleted payload is handled correctly
        """
        expected_topic_name = "Marley & Me"
        expected_message = "A file with quality Bluray-1080p for the movie Marley & Me was deleted, because it is missing from disk."
        self.check_webhook("radarr_movie_file_deleted", expected_topic_name, expected_message)

    def test_radarr_movie_added(self) -> None:
        """
        Tests if radarr movie added payload is handled correctly
        """
        expected_topic_name = "Batman v Superman: Dawn of Justice"
        expected_message = "The movie Batman v Superman: Dawn of Justice was added."
        self.check_webhook("radarr_movie_added", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/radarr/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_bool, check_string, check_string_in
from zerver.lib.webhooks.common import check_send_webhook_message, get_setup_webhook_message
from zerver.models import UserProfile

RADARR_TOPIC_TEMPLATE = "{movie_title}".strip()
RADARR_TOPIC_TEMPLATE_TEST = "Radarr - Test".strip()
RADARR_TOPIC_TEMPLATE_APPLICATION_UPDATE = "Radarr - Application update"
RADARR_TOPIC_TEMPLATE_HEALTH_CHECK = "Health {level}".strip()

RADARR_MESSAGE_TEMPLATE_HEALTH_CHECK = "{message}.".strip()
RADARR_MESSAGE_TEMPLATE_APPLICATION_UPDATE = (
    "Radarr was updated from {previous_version} to {new_version}."
)
RADARR_MESSAGE_TEMPLATE_MOVIE_RENAMED = "The movie {movie_title} has been renamed.".strip()
RADARR_MESSAGE_TEMPLATE_MOVIE_IMPORTED = "The movie {movie_title} has been imported.".strip()
RADARR_MESSAGE_TEMPLATE_MOVIE_IMPORTED_UPGRADE = (
    "The movie {movie_title} has been upgraded from {old_quality} to {new_quality}.".strip()
)
RADARR_MESSAGE_TEMPLATE_MOVIE_GRABBED = "The movie {movie_title} has been grabbed.".strip()
RADARR_MESSAGE_TEMPLATE_MOVIE_DELETED = (
    "The movie {movie_title} was deleted; its files were {deleted_files} deleted."
)
RADARR_MESSAGE_TEMPLATE_MOVIE_FILE_DELETED = (
    "A file with quality {quality} for the movie {movie_title} was deleted, {reason}."
)
RADARR_MESSAGE_TEMPLATE_MOVIE_ADDED = "The movie {movie_title} was added."

ALL_EVENT_TYPES = [
    "ApplicationUpdate",
    "Test",
    "Rename",
    "Download",
    "Health",
    "Grab",
    "MovieDelete",
    "MovieFileDelete",
    "MovieAdded",
]


@webhook_view("Radarr", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_radarr_webhook(
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
    event_type = payload["eventType"].tame(check_string)
    if event_type == "Test":
        return RADARR_TOPIC_TEMPLATE_TEST
    elif event_type == "ApplicationUpdate":
        return RADARR_TOPIC_TEMPLATE_APPLICATION_UPDATE
    elif event_type == "Health":
        return RADARR_TOPIC_TEMPLATE_HEALTH_CHECK.format(level=payload["level"].tame(check_string))
    else:
        return RADARR_TOPIC_TEMPLATE.format(
            movie_title=payload["movie"]["title"].tame(check_string)
        )


def get_body_for_health_check_event(payload: WildValue) -> str:
    return RADARR_MESSAGE_TEMPLATE_HEALTH_CHECK.format(
        message=payload["message"].tame(check_string)
    )


def get_body_for_application_update_event(payload: WildValue) -> str:
    return RADARR_MESSAGE_TEMPLATE_APPLICATION_UPDATE.format(
        previous_version=payload["previousVersion"].tame(check_string),
        new_version=payload["newVersion"].tame(check_string),
    )


def get_body_for_movie_renamed_event(payload: WildValue) -> str:
    return RADARR_MESSAGE_TEMPLATE_MOVIE_RENAMED.format(
        movie_title=payload["movie"]["title"].tame(check_string)
    )


def get_body_for_movie_imported_upgrade_event(payload: WildValue) -> str:
    data = {
        "movie_title": payload["movie"]["title"].tame(check_string),
        "new_quality": payload["movieFile"]["quality"].tame(check_string),
        "old_quality": payload["deletedFiles"][0]["quality"].tame(check_string),
    }

    return RADARR_MESSAGE_TEMPLATE_MOVIE_IMPORTED_UPGRADE.format(**data)


def get_body_for_movie_imported_event(payload: WildValue) -> str:
    return RADARR_MESSAGE_TEMPLATE_MOVIE_IMPORTED.format(
        movie_title=payload["movie"]["title"].tame(check_string)
    )


def get_body_for_movie_grabbed_event(payload: WildValue) -> str:
    return RADARR_MESSAGE_TEMPLATE_MOVIE_GRABBED.format(
        movie_title=payload["movie"]["title"].tame(check_string)
    )


def get_body_for_movie_deleted_event(payload: WildValue) -> str:
    return RADARR_MESSAGE_TEMPLATE_MOVIE_DELETED.format(
        movie_title=payload["movie"]["title"].tame(check_string),
        deleted_files="also" if payload["deletedFiles"].tame(check_bool) else "not",
    )


def get_body_for_movie_file_deleted_event(payload: WildValue) -> str:
    reasons = {
        "missingFromDisk": "because it is missing from disk",
        "manual": "manually",
        "upgrade": "because an upgraded version exists",
        "noLinkedEpisodes": "because it has no linked episodes",
        "manualOverride": "via manual override",
    }
    return RADARR_MESSAGE_TEMPLATE_MOVIE_FILE_DELETED.format(
        movie_title=payload["movie"]["title"].tame(check_string),
        quality=payload["movieFile"]["quality"].tame(check_string),
        reason=reasons[payload["deleteReason"].tame(check_string_in(reasons.keys()))],
    )


def get_body_for_movie_added_event(payload: WildValue) -> str:
    return RADARR_MESSAGE_TEMPLATE_MOVIE_ADDED.format(
        movie_title=payload["movie"]["title"].tame(check_string)
    )


def get_body_for_http_request(payload: WildValue) -> str:
    event_type = payload["eventType"].tame(check_string)
    if event_type == "Test":
        return get_setup_webhook_message("Radarr")
    elif event_type == "ApplicationUpdate":
        return get_body_for_application_update_event(payload)
    elif event_type == "Health":
        return get_body_for_health_check_event(payload)
    elif event_type == "Rename":
        return get_body_for_movie_renamed_event(payload)
    elif event_type == "Download" and "isUpgrade" in payload:
        if payload["isUpgrade"]:
            return get_body_for_movie_imported_upgrade_event(payload)
        else:
            return get_body_for_movie_imported_event(payload)
    elif event_type == "Grab":
        return get_body_for_movie_grabbed_event(payload)
    elif event_type == "MovieDelete":
        return get_body_for_movie_deleted_event(payload)
    elif event_type == "MovieFileDelete":
        return get_body_for_movie_file_deleted_event(payload)
    elif event_type == "MovieAdded":
        return get_body_for_movie_added_event(payload)
    else:
        raise UnsupportedWebhookEventTypeError(event_type)
```

--------------------------------------------------------------------------------

---[FILE: radarr_application_update.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_application_update.json

```json
{
    "message": "Radarr updated from 4.2.0.6370 to 4.2.0.6372",
    "previousVersion": "4.2.0.6370",
    "newVersion": "4.2.0.6372",
    "eventType": "ApplicationUpdate"
}
```

--------------------------------------------------------------------------------

---[FILE: radarr_health_check_error.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_health_check_error.json

```json
{
    "level": "error",
    "message": "Movie Gotham City Sirens (tmdbid 416649) was removed from TMDb",
    "type": "RemovedMovieCheck",
    "wikiUrl": "https://wiki.servarr.com/Radarr_System#movie_was_removed_from_tmdb",
    "eventType": "Health"
}
```

--------------------------------------------------------------------------------

---[FILE: radarr_health_check_warning.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_health_check_warning.json

```json
{
    "level": "warning",
    "message": "No download client is available",
    "type": "DownloadClientCheck",
    "wikiUrl": "https://wiki.servarr.com/Radarr_System#no_download_client_is_available",
    "eventType": "Health"
}
```

--------------------------------------------------------------------------------

---[FILE: radarr_movie_added.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_movie_added.json

```json
{
  "movie": {
    "id": 796,
    "title": "Batman v Superman: Dawn of Justice",
    "releaseDate": "2016-06-24",
    "folderPath": "/home36/adbtech/media/Movies/Batman v Superman- Dawn of Justice (2016)",
    "tmdbId": 209112,
    "imdbId": "tt2975590"
  },
  "eventType": "MovieAdded"
}
```

--------------------------------------------------------------------------------

---[FILE: radarr_movie_deleted.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_movie_deleted.json

```json
{
  "movie": {
    "id": 796,
    "title": "Batman v Superman: Dawn of Justice",
    "releaseDate": "2016-06-24",
    "folderPath": "/home36/adbtech/media/Movies/Batman v Superman- Dawn of Justice (2016)",
    "tmdbId": 209112,
    "imdbId": "tt2975590"
  },
  "deletedFiles": true,
  "eventType": "MovieDelete"
}
```

--------------------------------------------------------------------------------

---[FILE: radarr_movie_file_deleted.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_movie_file_deleted.json

```json
{
  "movie": {
    "id": 779,
    "title": "Marley & Me",
    "releaseDate": "2009-03-25",
    "folderPath": "/home36/adbtech/media/Movies/Marley & Me (2008)",
    "tmdbId": 14306,
    "imdbId": "tt0822832"
  },
  "movieFile": {
    "id": 36664,
    "relativePath": "<filename>",
    "path": "<fullPath>",
    "quality": "Bluray-1080p",
    "qualityVersion": 1,
    "releaseGroup": "<rlsGroup>",
    "sceneName": "The.Movie.Title.2012.1080p.BluRay.x265-<rlsGroup>",
    "indexerFlags": "0",
    "size": 42
  },
  "deleteReason": "missingFromDisk",
  "eventType": "MovieFileDelete"
}
```

--------------------------------------------------------------------------------

---[FILE: radarr_movie_grabbed.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_movie_grabbed.json

```json
{
  "movie": {
    "id": 771,
    "title": "Greenland",
    "releaseDate": "2021-02-09",
    "folderPath": "/home36/adbtech/media/Movies/Greenland (2020)",
    "tmdbId": 524047,
    "imdbId": "tt7737786"
  },
  "remoteMovie": {
    "tmdbId": 524047,
    "imdbId": "tt7737786",
    "title": "Greenland",
    "year": 2020
  },
  "release": {
    "quality": "WEBRip-1080p",
    "qualityVersion": 1,
    "releaseGroup": "EVO",
    "releaseTitle": "Greenland 2020 1080p AMZN WEBRip DD5 1 X 264-EVO",
    "indexer": "IP Torrents - Jackett",
    "size": 2319282432
  },
  "downloadClient": "Deluge",
  "downloadId": "8DAECE475EE53205C6FEDDA67F87CDBAF15BD25A",
  "eventType": "Grab"
}
```

--------------------------------------------------------------------------------

---[FILE: radarr_movie_imported.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_movie_imported.json

```json
{
  "movie": {
    "id": 796,
    "title": "Batman v Superman: Dawn of Justice",
    "releaseDate": "2016-06-24",
    "folderPath": "/home36/adbtech/media/Movies/Batman v Superman- Dawn of Justice (2016)",
    "tmdbId": 209112,
    "imdbId": "tt2975590"
  },
  "remoteMovie": {
    "tmdbId": 209112,
    "imdbId": "tt2975590",
    "title": "Batman v Superman: Dawn of Justice",
    "year": 2016
  },
  "movieFile": {
    "id": 32,
    "relativePath": "Batman v Superman- Dawn of Justice (2016) WEBDL-720p.mp4",
    "path": "/home36/adbtech/Downloads/Batman.v.Superman.Dawn.of.Justice.2016.Extended.Ultimate.Edition.720p.WEB-DL.AAC.BvS.mp4",
    "quality": "WEBDL-720p",
    "qualityVersion": 1,
    "size": 1515669476
  },
  "isUpgrade": false,
  "downloadId": "54DD5B3DC0E345179CFEA3E1CE9CD4C63AF7A641",
  "eventType": "Download"
}
```

--------------------------------------------------------------------------------

---[FILE: radarr_movie_imported_upgrade.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_movie_imported_upgrade.json

```json
{
  "movie": {
    "id": 771,
    "title": "Greenland",
    "releaseDate": "2021-02-09",
    "folderPath": "/home36/adbtech/media/Movies/Greenland (2020)",
    "tmdbId": 524047,
    "imdbId": "tt7737786"
  },
  "remoteMovie": {
    "tmdbId": 524047,
    "imdbId": "tt7737786",
    "title": "Greenland",
    "year": 2020
  },
  "movieFile": {
    "id": 29,
    "relativePath": "Greenland (2020) WEBRip-1080p.mkv",
    "path": "/home36/adbtech/Downloads/Greenland.2020.1080p.AMZN.WEBRip.DD5.1.X.264-EVO/Greenland.2020.1080p.AMZN.WEBRip.DD5.1.X.264-EVO.mkv",
    "quality": "WEBRip-1080p",
    "qualityVersion": 1,
    "releaseGroup": "EVO",
    "sceneName": "Greenland.2020.1080p.AMZN.WEBRip.DD5.1.X.264-EVO",
    "size": 2320560747
  },
  "isUpgrade": true,
  "downloadId": "8DAECE475EE53205C6FEDDA67F87CDBAF15BD25A",
  "deletedFiles": [
    {
      "id": 8,
      "relativePath": "Greenland (2020) WEBRip-720p.mkv",
      "path": "/home36/adbtech/media/Movies/Greenland (2020)/Greenland (2020) WEBRip-720p.mkv",
      "quality": "WEBRip-720p",
      "qualityVersion": 1,
      "releaseGroup": "EVO",
      "sceneName": "Greenland.2020.720p.AMZN.WEBRip.AAC2.0.X.264-EVO",
      "size": 1104429335
    }
  ],
  "eventType": "Download"
}
```

--------------------------------------------------------------------------------

---[FILE: radarr_movie_renamed.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_movie_renamed.json

```json
{
  "movie": {
    "id": 779,
    "title": "Marley & Me",
    "releaseDate": "2009-03-25",
    "folderPath": "/home36/adbtech/media/Movies/Marley & Me (2008)",
    "tmdbId": 14306,
    "imdbId": "tt0822832"
  },
  "eventType": "Rename"
}
```

--------------------------------------------------------------------------------

---[FILE: radarr_test.json]---
Location: zulip-main/zerver/webhooks/radarr/fixtures/radarr_test.json

```json
{
  "movie": {
    "id": 1,
    "title": "Test Title",
    "releaseDate": "1970-01-01",
    "folderPath": "C:\\testpath",
    "tmdbId": 0
  },
  "remoteMovie": {
    "tmdbId": 1234,
    "imdbId": "5678",
    "title": "Test title",
    "year": 1970
  },
  "release": {
    "quality": "Test Quality",
    "qualityVersion": 1,
    "releaseGroup": "Test Group",
    "releaseTitle": "Test Title",
    "indexer": "Test Indexer",
    "size": 9999999
  },
  "eventType": "Test"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/raygun/doc.md

```text
# Zulip Raygun integration

Get Zulip notifications for your Raygun events!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Raygun dashboard, and click on **Integrations**.
   Click on **Webhook**, and click on the **Setup** tab.

1. Set **Url** to the URL generated above. Check the **Enabled** checkbox,
   and click **Save Changes**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/raygun/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/raygun/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class RaygunHookTests(WebhookTestCase):
    CHANNEL_NAME = "raygun"
    URL_TEMPLATE = "/api/v1/external/raygun?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "raygun"

    def test_status_changed_message(self) -> None:
        expected_topic_name = "test"
        expected_message = """
[Error](https://app.raygun.com/error-url) status changed to **Ignored** by Emma Cat:
* **Timestamp**: <time:1970-01-28T01:49:36+00:00>
* **Application details**: [Best App](http://app.raygun.io/application-url)
""".strip()

        self.check_webhook(
            "error_status_changed",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_comment_added_to_error_message(self) -> None:
        expected_topic_name = "test"
        expected_message = """
Anita Peacock commented on [Error](https://app.raygun.com/error-url):

``` quote
Ignoring these errors
```
* **Timestamp**: <time:1970-01-28T01:49:36+00:00>
* **Application details**: [application name](http://app.raygun.io/application-url)
""".strip()

        self.check_webhook(
            "comment_added_to_error",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_error_assigned_to_user_message(self) -> None:
        expected_topic_name = "test"
        expected_message = """
Amy Loondon assigned [Error](https://app.raygun.com/error-url) to Kyle Kenny:
* **Timestamp**: <time:1970-01-28T01:49:36+00:00>
* **Application details**: [application name](http://app.raygun.io/application-url)
""".strip()

        self.check_webhook(
            "error_assigned_to_user",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_one_minute_followup_error_message(self) -> None:
        expected_topic_name = "test"
        expected_message = """
One minute [follow-up error](http://app.raygun.io/error-url):
* **First occurred**: <time:1970-01-28T01:49:36+00:00>
* **Last occurred**: <time:1970-01-28T01:49:36+00:00>
* 1 users affected with 1 total occurrences
* **Application details**: [application name](http://app.raygun.io/application-url)
""".strip()

        self.check_webhook(
            "one_minute_followup_error",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_hourly_followup_error_message(self) -> None:
        expected_topic_name = "test"
        expected_message = """
Hourly [follow-up error](http://app.raygun.io/error-url):
* **First occurred**: <time:1970-01-28T01:49:36+00:00>
* **Last occurred**: <time:1970-01-28T01:49:36+00:00>
* 1 users affected with 1 total occurrences
* **Application details**: [application name](http://app.raygun.io/application-url)
""".strip()

        self.check_webhook(
            "hourly_followup_error",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_new_error_message(self) -> None:
        expected_topic_name = "test"
        expected_message = """
New [Error](http://app.raygun.io/error-url) occurred:
* **First occurred**: <time:1970-01-28T01:49:36+00:00>
* **Last occurred**: <time:1970-01-28T01:49:36+00:00>
* 1 users affected with 1 total occurrences
* **Tags**: test, error-page, v1.0.1, env:staging
* **Affected user**: a9b7d8...33846
* **pageName**: Error Page
* **userLoggedIn**: True
* **Application details**: [application name](http://app.raygun.io/application-url)
""".strip()

        self.check_webhook(
            "new_error",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_reoccurred_error_message(self) -> None:
        expected_topic_name = "test"
        expected_message = """
[Error](http://app.raygun.io/error-url) reoccurred:
* **First occurred**: <time:1970-01-28T01:49:36+00:00>
* **Last occurred**: <time:1970-01-28T01:49:36+00:00>
* 1 users affected with 1 total occurrences
* **Tags**: test, error-page, v1.0.1, env:staging
* **Affected user**: a9b7d8...33846
* **pageName**: Error Page
* **userLoggedIn**: True
* **Application details**: [application name](http://app.raygun.io/application-url)
""".strip()

        self.check_webhook(
            "reoccurred_error",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

````
