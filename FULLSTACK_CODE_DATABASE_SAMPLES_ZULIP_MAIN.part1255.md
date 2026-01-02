---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1255
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1255 of 1290)

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

---[FILE: sonarr_episode_deleted_upgrade.json]---
Location: zulip-main/zerver/webhooks/sonarr/fixtures/sonarr_episode_deleted_upgrade.json

```json
{
    "series": {
      "id": 11,
      "title": "S.W.A.T. (2017)",
      "path": "/home36/adbtech/media/TV Shows/S.W.A.T. (2017)",
      "tvdbId": 328687,
      "tvMazeId": 21532,
      "imdbId": "tt6111130",
      "type": "standard"
    },
    "episodes": [
      {
        "id": 8198,
        "episodeNumber": 10,
        "seasonNumber": 4,
        "title": "Buried",
        "airDate": "2021-03-03",
        "airDateUtc": "2021-03-04T03:00:00Z"
      }
    ],
    "episodeFile": {
      "seriesId": 11,
      "seasonNumber": 4,
      "relativePath": "Season 4/S.W.A.T. (2017) - S04E10 - Buried SDTV.mkv",
      "path": "/home36/adbtech/media/TV Shows/S.W.A.T. (2017)/Season 4/S.W.A.T. (2017) - S04E10 - Buried SDTV.mkv",
      "size": 401690753,
      "dateAdded": "2021-03-04T05:05:36.86463Z",
      "originalFilePath": "S.W.A.T.2017.S04E10.HDTV.x264-PHOENiX[eztv.re].mkv",
      "sceneName": "S.W.A.T.2017.S04E10.HDTV.x264-PHOENiX[eztv.re]",
      "releaseGroup": "PHOENiX",
      "quality": {
        "quality": {
          "id": 1,
          "name": "SDTV",
          "source": "television",
          "resolution": 480
        },
        "revision": {
          "version": 1,
          "real": 0,
          "isRepack": false
        }
      },
      "mediaInfo": {
        "containerFormat": "Matroska",
        "videoFormat": "AVC",
        "videoCodecID": "V_MPEG4/ISO/AVC",
        "videoProfile": "High@L3",
        "videoCodecLibrary": "x264 - core 157",
        "videoBitrate": 6572890,
        "videoBitDepth": 8,
        "videoMultiViewCount": 0,
        "videoColourPrimaries": "",
        "videoTransferCharacteristics": "",
        "width": 720,
        "height": 400,
        "audioFormat": "AAC",
        "audioCodecID": "A_AAC-2",
        "audioCodecLibrary": "Lavc58.35.100 aac",
        "audioAdditionalFeatures": "LC",
        "audioBitrate": 384000,
        "runTime": "00:42:14.1760000",
        "audioStreamCount": 1,
        "audioChannelsContainer": 2,
        "audioChannelsStream": 0,
        "audioChannelPositions": "2/0/0",
        "audioChannelPositionsTextContainer": "Front: L R",
        "audioProfile": "",
        "videoFps": 23.976,
        "audioLanguages": "English",
        "subtitles": "",
        "scanType": "Progressive",
        "schemaRevision": 5
      },
      "episodes": {
        "value": [
          {
            "seriesId": 11,
            "episodeFileId": 4644,
            "seasonNumber": 4,
            "episodeNumber": 10,
            "title": "Buried",
            "airDate": "2021-03-03",
            "airDateUtc": "2021-03-04T03:00:00Z",
            "overview": "As the SWAT team helps the LAPD search for the prime suspect in a woman’s disappearance, they’re joined in the field by a new team member. The personal strain between Chris and Street comes to a head as both await Hicks’ decision on who the winner is of a prestigious leadership competition.",
            "monitored": true,
            "absoluteEpisodeNumber": 76,
            "unverifiedSceneNumbering": false,
            "ratings": {
              "votes": 0,
              "value": 0.0
            },
            "images": [
              {
                "coverType": "screenshot",
                "url": "https://artworks.thetvdb.com/banners/series/328687/episodes/604212e57b8d2.jpg"
              }
            ],
            "lastSearchTime": "2021-03-26T02:33:32.478455Z",
            "episodeFile": {
              "isLoaded": true
            },
            "hasFile": true,
            "id": 8198
          }
        ],
        "isLoaded": true
      },
      "series": {
        "value": {
          "tvdbId": 328687,
          "tvRageId": 0,
          "tvMazeId": 21532,
          "imdbId": "tt6111130",
          "title": "S.W.A.T. (2017)",
          "cleanTitle": "swt2017",
          "sortTitle": "s w t 2017",
          "status": "continuing",
          "overview": "Los Angeles S.W.A.T. Lieutenant Daniel ‘Hondo’ Harrelson is assigned to lead a highly-skilled unit in the community where he grew up. Torn between loyalty to the streets where the cops are sometimes the enemy, and allegiance to his brothers in blue, he strategically straddles these two worlds. Hondo encourages his team to rely on communication and respect over force and aggression, but when a crisis erupts, these unflinching men and women are prepared to put their tactical training to the test.",
          "airTime": "22:00",
          "monitored": true,
          "qualityProfileId": 3,
          "languageProfileId": 1,
          "seasonFolder": true,
          "lastInfoSync": "2021-03-26T02:29:02.009181Z",
          "runtime": 45,
          "images": [
            {
              "coverType": "banner",
              "url": "https://artworks.thetvdb.com/banners/graphical/328687-g.jpg"
            },
            {
              "coverType": "poster",
              "url": "https://artworks.thetvdb.com/banners/posters/328687-2.jpg"
            },
            {
              "coverType": "fanart",
              "url": "https://artworks.thetvdb.com/banners/fanart/original/5d4d461189894.jpg"
            }
          ],
          "seriesType": "standard",
          "network": "CBS",
          "useSceneNumbering": false,
          "titleSlug": "s-w-a-t-2017",
          "path": "/home36/adbtech/media/TV Shows/S.W.A.T. (2017)",
          "year": 2017,
          "ratings": {
            "votes": 460,
            "value": 7.5
          },
          "genres": [
            "Action",
            "Crime",
            "Drama"
          ],
          "actors": [
            {
              "name": "Shemar Moore",
              "character": "Daniel “Hondo” Harrelson",
              "images": []
            },
            {
              "name": "Jay Harrington",
              "character": "David “Deacon” Kay",
              "images": []
            },
            {
              "name": "Alex Russell",
              "character": "Jim Street",
              "images": []
            },
            {
              "name": "Lina Esco",
              "character": "Christina “Chris” Alonso",
              "images": []
            },
            {
              "name": "Kenny Johnson",
              "character": "Dominique Luca",
              "images": []
            },
            {
              "name": "David Lim",
              "character": "Victor Tan",
              "images": []
            },
            {
              "name": "Patrick St. Esprit",
              "character": "Robert Hicks",
              "images": []
            },
            {
              "name": "Peter Onorati",
              "character": "Jeff Mumford",
              "images": []
            },
            {
              "name": "Stephanie Sigman",
              "character": "Jessica Cortez",
              "images": []
            },
            {
              "name": "Amy Farrington",
              "character": "Piper Lynch",
              "images": []
            }
          ],
          "certification": "TV-14",
          "added": "2020-05-04T12:01:55.170293Z",
          "firstAired": "2017-11-02T00:00:00Z",
          "qualityProfile": {
            "value": {
              "name": "HD-720p",
              "upgradeAllowed": false,
              "cutoff": 4,
              "items": [
                {
                  "quality": {
                    "id": 0,
                    "name": "Unknown",
                    "source": "unknown",
                    "resolution": 0
                  },
                  "items": [],
                  "allowed": false
                },
                {
                  "quality": {
                    "id": 1,
                    "name": "SDTV",
                    "source": "television",
                    "resolution": 480
                  },
                  "items": [],
                  "allowed": true
                },
                {
                  "id": 1000,
                  "name": "WEB 480p",
                  "items": [
                    {
                      "quality": {
                        "id": 12,
                        "name": "WEBRip-480p",
                        "source": "webRip",
                        "resolution": 480
                      },
                      "items": [],
                      "allowed": true
                    },
                    {
                      "quality": {
                        "id": 8,
                        "name": "WEBDL-480p",
                        "source": "web",
                        "resolution": 480
                      },
                      "items": [],
                      "allowed": true
                    }
                  ],
                  "allowed": true
                },
                {
                  "quality": {
                    "id": 2,
                    "name": "DVD",
                    "source": "dvd",
                    "resolution": 480
                  },
                  "items": [],
                  "allowed": true
                },
                {
                  "quality": {
                    "id": 13,
                    "name": "Bluray-480p",
                    "source": "bluray",
                    "resolution": 480
                  },
                  "items": [],
                  "allowed": true
                },
                {
                  "quality": {
                    "id": 4,
                    "name": "HDTV-720p",
                    "source": "television",
                    "resolution": 720
                  },
                  "items": [],
                  "allowed": true
                },
                {
                  "quality": {
                    "id": 9,
                    "name": "HDTV-1080p",
                    "source": "television",
                    "resolution": 1080
                  },
                  "items": [],
                  "allowed": false
                },
                {
                  "quality": {
                    "id": 10,
                    "name": "Raw-HD",
                    "source": "televisionRaw",
                    "resolution": 1080
                  },
                  "items": [],
                  "allowed": false
                },
                {
                  "id": 1001,
                  "name": "WEB 720p",
                  "items": [
                    {
                      "quality": {
                        "id": 14,
                        "name": "WEBRip-720p",
                        "source": "webRip",
                        "resolution": 720
                      },
                      "items": [],
                      "allowed": true
                    },
                    {
                      "quality": {
                        "id": 5,
                        "name": "WEBDL-720p",
                        "source": "web",
                        "resolution": 720
                      },
                      "items": [],
                      "allowed": true
                    }
                  ],
                  "allowed": true
                },
                {
                  "quality": {
                    "id": 6,
                    "name": "Bluray-720p",
                    "source": "bluray",
                    "resolution": 720
                  },
                  "items": [],
                  "allowed": true
                },
                {
                  "id": 1002,
                  "name": "WEB 1080p",
                  "items": [
                    {
                      "quality": {
                        "id": 15,
                        "name": "WEBRip-1080p",
                        "source": "webRip",
                        "resolution": 1080
                      },
                      "items": [],
                      "allowed": false
                    },
                    {
                      "quality": {
                        "id": 3,
                        "name": "WEBDL-1080p",
                        "source": "web",
                        "resolution": 1080
                      },
                      "items": [],
                      "allowed": false
                    }
                  ],
                  "allowed": false
                },
                {
                  "quality": {
                    "id": 7,
                    "name": "Bluray-1080p",
                    "source": "bluray",
                    "resolution": 1080
                  },
                  "items": [],
                  "allowed": false
                },
                {
                  "quality": {
                    "id": 20,
                    "name": "Bluray-1080p Remux",
                    "source": "blurayRaw",
                    "resolution": 1080
                  },
                  "items": [],
                  "allowed": false
                },
                {
                  "quality": {
                    "id": 16,
                    "name": "HDTV-2160p",
                    "source": "television",
                    "resolution": 2160
                  },
                  "items": [],
                  "allowed": false
                },
                {
                  "id": 1003,
                  "name": "WEB 2160p",
                  "items": [
                    {
                      "quality": {
                        "id": 17,
                        "name": "WEBRip-2160p",
                        "source": "webRip",
                        "resolution": 2160
                      },
                      "items": [],
                      "allowed": false
                    },
                    {
                      "quality": {
                        "id": 18,
                        "name": "WEBDL-2160p",
                        "source": "web",
                        "resolution": 2160
                      },
                      "items": [],
                      "allowed": false
                    }
                  ],
                  "allowed": false
                },
                {
                  "quality": {
                    "id": 19,
                    "name": "Bluray-2160p",
                    "source": "bluray",
                    "resolution": 2160
                  },
                  "items": [],
                  "allowed": false
                },
                {
                  "quality": {
                    "id": 21,
                    "name": "Bluray-2160p Remux",
                    "source": "blurayRaw",
                    "resolution": 2160
                  },
                  "items": [],
                  "allowed": false
                }
              ],
              "id": 3
            },
            "isLoaded": true
          },
          "languageProfile": {
            "value": {
              "name": "English",
              "languages": [
                {
                  "language": {
                    "id": 27,
                    "name": "Hindi"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 26,
                    "name": "Arabic"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 13,
                    "name": "Vietnamese"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 0,
                    "name": "Unknown"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 17,
                    "name": "Turkish"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 14,
                    "name": "Swedish"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 3,
                    "name": "Spanish"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 11,
                    "name": "Russian"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 18,
                    "name": "Portuguese"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 12,
                    "name": "Polish"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 15,
                    "name": "Norwegian"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 24,
                    "name": "Lithuanian"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 21,
                    "name": "Korean"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 8,
                    "name": "Japanese"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 5,
                    "name": "Italian"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 9,
                    "name": "Icelandic"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 22,
                    "name": "Hungarian"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 23,
                    "name": "Hebrew"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 20,
                    "name": "Greek"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 4,
                    "name": "German"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 2,
                    "name": "French"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 19,
                    "name": "Flemish"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 16,
                    "name": "Finnish"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 1,
                    "name": "English"
                  },
                  "allowed": true
                },
                {
                  "language": {
                    "id": 7,
                    "name": "Dutch"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 6,
                    "name": "Danish"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 25,
                    "name": "Czech"
                  },
                  "allowed": false
                },
                {
                  "language": {
                    "id": 10,
                    "name": "Chinese"
                  },
                  "allowed": false
                }
              ],
              "upgradeAllowed": false,
              "cutoff": {
                "id": 1,
                "name": "English"
              },
              "id": 1
            },
            "isLoaded": true
          },
          "seasons": [
            {
              "seasonNumber": 1,
              "monitored": false,
              "images": [
                {
                  "coverType": "poster",
                  "url": "https://artworks.thetvdb.com/banners/seasons/328687-1.jpg"
                }
              ]
            },
            {
              "seasonNumber": 2,
              "monitored": false,
              "images": [
                {
                  "coverType": "poster",
                  "url": "https://artworks.thetvdb.com/banners/seasons/5baf03e6b83dd.jpg"
                }
              ]
            },
            {
              "seasonNumber": 3,
              "monitored": true,
              "images": [
                {
                  "coverType": "poster",
                  "url": "https://artworks.thetvdb.com/banners/series/328687/seasons/814708/posters/62060192.jpg"
                }
              ]
            },
            {
              "seasonNumber": 4,
              "monitored": true,
              "images": []
            }
          ],
          "tags": [],
          "id": 11
        },
        "isLoaded": true
      },
      "language": {
        "id": 1,
        "name": "English"
      },
      "id": 4644
    },
    "deleteReason": "upgrade",
    "eventType": "EpisodeFileDelete"
  }
```

--------------------------------------------------------------------------------

---[FILE: sonarr_episode_grabbed.json]---
Location: zulip-main/zerver/webhooks/sonarr/fixtures/sonarr_episode_grabbed.json

```json
{
    "series": {
      "id": 7,
      "title": "NCIS",
      "path": "/home36/adbtech/media/TV Shows/NCIS",
      "tvdbId": 72108,
      "tvMazeId": 60,
      "imdbId": "tt0364845",
      "type": "standard"
    },
    "episodes": [
      {
        "id": 8268,
        "episodeNumber": 10,
        "seasonNumber": 18,
        "title": "Watchdog",
        "airDate": "2021-03-16",
        "airDateUtc": "2021-03-17T00:00:00Z"
      }
    ],
    "release": {
      "quality": "HDTV-720p",
      "qualityVersion": 1,
      "releaseGroup": "MeGusta",
      "releaseTitle": "NCIS S18E10 720p HEVC x265-MeGusta",
      "indexer": "IP Torrents - Jackett",
      "size": 415236096
    },
    "downloadClient": "Deluge",
    "downloadId": "2FBD49EF1D9934F560E4806E001C6DE494D23FD6",
    "eventType": "Grab"
}
```

--------------------------------------------------------------------------------

---[FILE: sonarr_episode_imported.json]---
Location: zulip-main/zerver/webhooks/sonarr/fixtures/sonarr_episode_imported.json

```json
{
  "series": {
    "id": 45,
    "title": "Grey's Anatomy",
    "path": "/home36/adbtech/media/TV Shows/Grey's Anatomy",
    "tvdbId": 73762,
    "tvMazeId": 67,
    "imdbId": "tt0413573",
    "type": "standard"
  },
  "episodes": [
    {
      "id": 8507,
      "episodeNumber": 9,
      "seasonNumber": 17,
      "title": "In My Life",
      "airDate": "2021-03-25",
      "airDateUtc": "2021-03-26T01:00:00Z"
    }
  ],
  "episodeFile": {
    "id": 4834,
    "relativePath": "Season 17/Grey's Anatomy - S17E09 - In My Life HDTV-720p.mkv",
    "path": "/home36/adbtech/Downloads/Greys.Anatomy.S17E09.720p.HDTV.x264-SYNCOPY/greys.anatomy.s17e09.720p.hdtv.x264-syncopy.mkv",
    "quality": "HDTV-720p",
    "qualityVersion": 1,
    "releaseGroup": "SYNCOPY",
    "sceneName": "Greys.Anatomy.S17E09.720p.HDTV.x264-SYNCOPY",
    "size": 832160743
  },
  "isUpgrade": false,
  "downloadClient": "Deluge",
  "downloadId": "D93392B18D20704D1BE349FA314FACCB7B5DF2C3",
  "eventType": "Download"
}
```

--------------------------------------------------------------------------------

---[FILE: sonarr_episode_imported_upgrade.json]---
Location: zulip-main/zerver/webhooks/sonarr/fixtures/sonarr_episode_imported_upgrade.json

```json
{
    "series": {
      "id": 7,
      "title": "NCIS",
      "path": "/home36/adbtech/media/TV Shows/NCIS",
      "tvdbId": 72108,
      "tvMazeId": 60,
      "imdbId": "tt0364845",
      "type": "standard"
    },
    "episodes": [
      {
        "id": 8268,
        "episodeNumber": 10,
        "seasonNumber": 18,
        "title": "Watchdog",
        "airDate": "2021-03-16",
        "airDateUtc": "2021-03-17T00:00:00Z"
      }
    ],
    "episodeFile": {
      "id": 4835,
      "relativePath": "Season 18/NCIS - S18E10 - Watchdog HDTV-720p.mkv",
      "path": "/home36/adbtech/Downloads/NCIS.S18E10.720p.HEVC.x265-MeGusta/NCIS.S18E10.720p.HEVC.x265-MeGusta.mkv",
      "quality": "HDTV-720p",
      "qualityVersion": 1,
      "releaseGroup": "MeGusta",
      "sceneName": "NCIS.S18E10.720p.HEVC.x265-MeGusta",
      "size": 406824797
    },
    "isUpgrade": true,
    "downloadClient": "Deluge",
    "downloadId": "2FBD49EF1D9934F560E4806E001C6DE494D23FD6",
    "deletedFiles": [
      {
        "id": 4772,
        "relativePath": "Season 18/NCIS - S18E10 - Watchdog SDTV.mkv",
        "path": "/home36/adbtech/media/TV Shows/NCIS/Season 18/NCIS - S18E10 - Watchdog SDTV.mkv",
        "quality": "SDTV",
        "qualityVersion": 1,
        "releaseGroup": "PHOENiX",
        "sceneName": "NCIS.S18E10.HDTV.x264-PHOENiX",
        "size": 318197105
      }
    ],
    "eventType": "Download"
}
```

--------------------------------------------------------------------------------

---[FILE: sonarr_health_check_error.json]---
Location: zulip-main/zerver/webhooks/sonarr/fixtures/sonarr_health_check_error.json

```json
{
    "level": "error",
    "message": "No indexers available with RSS sync enabled, Sonarr will not grab new releases automatically",
    "type": "IndexerRssCheck",
    "wikiUrl": "https://wiki.servarr.com/Sonarr_System#no_indexers_available_with_rss_sync_enabled_sonarr_will_not_grab_new_releases_automatically",
    "eventType": "Health"
}
```

--------------------------------------------------------------------------------

---[FILE: sonarr_health_check_warning.json]---
Location: zulip-main/zerver/webhooks/sonarr/fixtures/sonarr_health_check_warning.json

```json
{
    "level": "warning",
    "message": "Indexers unavailable due to failures for more than 6 hours: Academic Torrents - Jackett, ACG - Jackett, KickAssTorrent - Jackett, EXT Torrents - Jackett, Extra Torrents - Jackett, SkyTorrents - Jackett, iDope - Jackett",
    "type": "IndexerLongTermStatusCheck",
    "wikiUrl": "https://github.com/Sonarr/Sonarr/wiki/Health-checks#indexers-are-unavailable-due-to-failures",
    "eventType": "Health"
}
```

--------------------------------------------------------------------------------

---[FILE: sonarr_series_deleted.json]---
Location: zulip-main/zerver/webhooks/sonarr/fixtures/sonarr_series_deleted.json

```json
{
    "series": {
      "id": 90,
      "title": "Breaking Bad",
      "path": "/home36/adbtech/media/TV Shows/Breaking Bad",
      "tvdbId": 81189,
      "tvMazeId": 169,
      "imdbId": "tt0903747",
      "type": "standard"
    },
    "deletedFiles": true,
    "eventType": "SeriesDelete"
}
```

--------------------------------------------------------------------------------

---[FILE: sonarr_test.json]---
Location: zulip-main/zerver/webhooks/sonarr/fixtures/sonarr_test.json

```json
{
    "series": {
      "id": 1,
      "title": "Test Title",
      "path": "C:\\testpath",
      "tvdbId": 1234,
      "tvMazeId": 0,
      "type": "standard"
    },
    "episodes": [
      {
        "id": 123,
        "episodeNumber": 1,
        "seasonNumber": 1,
        "title": "Test title"
      }
    ],
    "eventType": "Test"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/splunk/doc.md

```text
# Zulip Splunk integration

See your Splunk Search alerts in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

    !!! tip ""

        If you do not specify a topic, the name of the search will be used
        as the topic (truncated if it's too long).

1. In the Splunk search app, execute the search you'd like to be
   notified about. Click on **Save As** in the top-right corner,
   and select **Alert**.

1. Configure the **Settings** and **Trigger Conditions** for your search
   as appropriate. Under **Trigger Actions**, click **Add Actions**,
   and select **Webhook**. Set **URL** to the URL generated above,
   and click **Save**.

!!! tip ""

    You can create as many search alerts as you like, with whatever
    channel and topic you choose. Just generate the webhook URL as
    appropriate for each one.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/splunk/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/splunk/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class SplunkHookTests(WebhookTestCase):
    CHANNEL_NAME = "splunk"
    URL_TEMPLATE = "/api/v1/external/splunk?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "splunk"

    def test_splunk_search_one_result(self) -> None:
        self.url = self.build_webhook_url(topic="New Search Alert")

        # define the expected message contents
        expected_topic_name = "New Search Alert"
        expected_message = """
Splunk alert from saved search:
* **Search**: [sudo](http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now)
* **Host**: myserver
* **Source**: `/var/log/auth.log`
* **Raw**: `Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root`
""".strip()

        # using fixture named splunk_search_one_result, execute this test
        self.check_webhook(
            "search_one_result",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_splunk_short_search_name(self) -> None:
        # don't provide a topic so the search name is used instead
        expected_topic_name = "This search's name isn't that long"
        expected_message = """
Splunk alert from saved search:
* **Search**: [This search's name isn't that long](http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now)
* **Host**: myserver
* **Source**: `/var/log/auth.log`
* **Raw**: `Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root`
""".strip()

        self.check_webhook(
            "short_search_name",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_splunk_long_search_name(self) -> None:
        # don't provide a topic so the search name is used instead
        expected_topic_name = "this-search's-got-47-words-37-sentences-58-words-we-wanna..."
        expected_message = """
Splunk alert from saved search:
* **Search**: [this-search's-got-47-words-37-sentences-58-words-we-wanna-know-details-of-the-search-time-of-the-search-and-any-other-kind-of-thing-you-gotta-say-pertaining-to-and-about-the-search-I-want-to-know-authenticated-user's-name-and-any-other-kind-of-thing-you-gotta-say](http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now)
* **Host**: myserver
* **Source**: `/var/log/auth.log`
* **Raw**: `Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root`
""".strip()

        self.check_webhook(
            "long_search_name",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_splunk_missing_results_link(self) -> None:
        self.url = self.build_webhook_url(topic="New Search Alert")

        expected_topic_name = "New Search Alert"
        expected_message = """
Splunk alert from saved search:
* **Search**: [sudo](Missing results_link)
* **Host**: myserver
* **Source**: `/var/log/auth.log`
* **Raw**: `Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root`
""".strip()

        self.check_webhook(
            "missing_results_link",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_splunk_missing_search_name(self) -> None:
        self.url = self.build_webhook_url(topic="New Search Alert")

        expected_topic_name = "New Search Alert"
        expected_message = """
Splunk alert from saved search:
* **Search**: [Missing search_name](http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now)
* **Host**: myserver
* **Source**: `/var/log/auth.log`
* **Raw**: `Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root`
""".strip()

        self.check_webhook(
            "missing_search_name",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_splunk_missing_host(self) -> None:
        self.url = self.build_webhook_url(topic="New Search Alert")

        expected_topic_name = "New Search Alert"
        expected_message = """
Splunk alert from saved search:
* **Search**: [sudo](http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now)
* **Host**: Missing host
* **Source**: `/var/log/auth.log`
* **Raw**: `Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root`
""".strip()

        self.check_webhook(
            "missing_host",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_splunk_missing_source(self) -> None:
        self.url = self.build_webhook_url(topic="New Search Alert")

        expected_topic_name = "New Search Alert"
        expected_message = """
Splunk alert from saved search:
* **Search**: [sudo](http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now)
* **Host**: myserver
* **Source**: `Missing source`
* **Raw**: `Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root`
""".strip()

        self.check_webhook(
            "missing_source",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_splunk_missing_raw(self) -> None:
        self.url = self.build_webhook_url(topic="New Search Alert")

        expected_topic_name = "New Search Alert"
        expected_message = """
Splunk alert from saved search:
* **Search**: [sudo](http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now)
* **Host**: myserver
* **Source**: `/var/log/auth.log`
* **Raw**: `Missing _raw`
""".strip()

        self.check_webhook(
            "missing_raw",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/splunk/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile
from zerver.models.constants import MAX_TOPIC_NAME_LENGTH

MESSAGE_TEMPLATE = """
Splunk alert from saved search:
* **Search**: [{search}]({link})
* **Host**: {host}
* **Source**: `{source}`
* **Raw**: `{raw}`
""".strip()


@webhook_view("Splunk")
@typed_endpoint
def api_splunk_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    # use default values if expected data is not provided
    search_name = payload.get("search_name", "Missing search_name").tame(check_string)
    results_link = payload.get("results_link", "Missing results_link").tame(check_string)
    host = payload.get("result", {}).get("host", "Missing host").tame(check_string)
    source = payload.get("result", {}).get("source", "Missing source").tame(check_string)
    raw = payload.get("result", {}).get("_raw", "Missing _raw").tame(check_string)

    # for the default topic, use search name but truncate if too long
    if len(search_name) >= MAX_TOPIC_NAME_LENGTH:
        topic_name = f"{search_name[: (MAX_TOPIC_NAME_LENGTH - 3)]}..."
    else:
        topic_name = search_name

    # construct the message body
    body = MESSAGE_TEMPLATE.format(
        search=search_name,
        link=results_link,
        host=host,
        source=source,
        raw=raw,
    )

    # send the message
    check_send_webhook_message(request, user_profile, topic_name, body)

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: long_search_name.json]---
Location: zulip-main/zerver/webhooks/splunk/fixtures/long_search_name.json

```json
{
    "results_link": "http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now",
    "app": "search",
    "result": {
        "timestartpos": "0",
        "_serial": "2",
        "splunk_server": "myserver",
        "date_month": "january",
        "USER": "",
        "date_second": "32",
        "source": "/var/log/auth.log",
        "timeendpos": "15",
        "_si": [
            "myserver",
            "main"
        ],
        "punct": "___::_-_:_(:):_____",
        "host": "myserver",
        "TTY": "",
        "_raw": "Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root",
        "_sourcetype": "syslog",
        "index": "main",
        "date_minute": "14",
        "date_year": "2017",
        "_kv": "1",
        "process": "sudo",
        "PWD": "",
        "pid": "",
        "_time": "1483557272",
        "uid": "",
        "date_zone": "local",
        "sourcetype": "syslog",
        "_indextime": "1483557272",
        "date_hour": "11",
        "date_mday": "4",
        "linecount": "",
        "eventtype": "",
        "COMMAND": "",
        "_eventtype_color": "",
        "date_wday": "wednesday",
        "_confstr": "source::/var/log/auth.log|host::myserver|syslog"
    },
    "sid": "rt_scheduler__admin__search__sudo_at_1483557185_2.2",
    "search_name": "this-search's-got-47-words-37-sentences-58-words-we-wanna-know-details-of-the-search-time-of-the-search-and-any-other-kind-of-thing-you-gotta-say-pertaining-to-and-about-the-search-I-want-to-know-authenticated-user's-name-and-any-other-kind-of-thing-you-gotta-say",
    "owner": "admin"
}
```

--------------------------------------------------------------------------------

````
