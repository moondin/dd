---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1236
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1236 of 1290)

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

---[FILE: members_delete.json]---
Location: zulip-main/zerver/webhooks/patreon/fixtures/members_delete.json

```json
{
    "data": {
      "attributes": {
        "campaign_lifetime_support_cents": 0,
        "currently_entitled_amount_cents": 0,
        "email": "kopi@pangea.com",
        "full_name": "Kopi",
        "is_follower": false,
        "is_free_trial": false,
        "last_charge_date": null,
        "last_charge_status": null,
        "lifetime_support_cents": 0,
        "next_charge_date": null,
        "note": "",
        "patron_status": null,
        "pledge_cadence": null,
        "pledge_relationship_start": "2023-12-29T02:38:24.943+00:00",
        "will_pay_amount_cents": 0
      },
      "id": "38c264ba-0612-4bb9-bc33-f9755cc68bb0",
      "relationships": {
        "address": {
          "data": null
        },
        "campaign": {
          "data": {
            "id": "11539233",
            "type": "campaign"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/campaigns/11539233"
          }
        },
        "currently_entitled_tiers": {
          "data": [
            {
              "id": "21926168",
              "type": "tier"
            }
          ]
        },
        "user": {
          "data": {
            "id": "111836593",
            "type": "user"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/user/111836593"
          }
        }
      },
      "type": "member"
    },
    "included": [
      {
        "attributes": {
          "created_at": "2023-12-29T01:11:16.000+00:00",
          "creation_name": "",
          "discord_server_id": null,
          "google_analytics_id": null,
          "has_rss": false,
          "has_sent_rss_notify": false,
          "image_small_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "is_charged_immediately": true,
          "is_monthly": true,
          "is_nsfw": false,
          "main_video_embed": null,
          "main_video_url": null,
          "one_liner": null,
          "patron_count": 0,
          "pay_per_name": "month",
          "pledge_url": "/checkout/11539233",
          "published_at": "2023-12-29T01:29:54.000+00:00",
          "rss_artwork_url": null,
          "rss_feed_title": null,
          "summary": null,
          "thanks_embed": null,
          "thanks_msg": null,
          "thanks_video_url": null,
          "url": "https://www.patreon.com/user?u=111828554",
          "vanity": null
        },
        "id": "11539233",
        "type": "campaign"
      },
      {
        "attributes": {
          "about": null,
          "created": "2023-12-29T02:38:24.000+00:00",
          "first_name": "Kopi",
          "full_name": "Kopi",
          "hide_pledges": true,
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "is_creator": false,
          "last_name": "",
          "like_count": 0,
          "social_connections": {
            "discord": null,
            "facebook": null,
            "google": null,
            "instagram": null,
            "reddit": null,
            "spotify": null,
            "spotify_open_access": null,
            "twitch": null,
            "twitter": null,
            "vimeo": null,
            "youtube": null
          },
          "thumb_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "url": "https://www.patreon.com/user?u=111836593",
          "vanity": null
        },
        "id": "111836593",
        "type": "user"
      },
      {
        "attributes": {
          "amount_cents": 0,
          "created_at": "2023-12-29T01:11:16.871+00:00",
          "description": "",
          "discord_role_ids": null,
          "edited_at": "2023-12-29T01:11:16.871+00:00",
          "image_url": null,
          "patron_count": 0,
          "post_count": 0,
          "published": true,
          "published_at": "2023-12-29T01:11:16.871+00:00",
          "remaining": null,
          "requires_shipping": false,
          "title": "Free",
          "unpublished_at": null,
          "url": "/checkout/11539233?rid=21926168",
          "user_limit": null
        },
        "id": "21926168",
        "type": "tier"
      }
    ],
    "links": {
      "self": "https://www.patreon.com/api/oauth2/v2/members/38c264ba-0612-4bb9-bc33-f9755cc68bb0"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: members_pledge_create.json]---
Location: zulip-main/zerver/webhooks/patreon/fixtures/members_pledge_create.json

```json
{
    "data": {
      "attributes": {
        "campaign_lifetime_support_cents": 0,
        "currently_entitled_amount_cents": 500,
        "email": "kopi@pangea.com",
        "full_name": "Kopi",
        "is_follower": false,
        "is_free_trial": false,
        "last_charge_date": "2023-12-29T05:26:19.000+00:00",
        "last_charge_status": "Paid",
        "lifetime_support_cents": 0,
        "next_charge_date": "2024-01-29T00:00:00.000+00:00",
        "note": "",
        "patron_status": "active_patron",
        "pledge_cadence": 1,
        "pledge_relationship_start": "2023-12-29T05:26:17.634+00:00",
        "will_pay_amount_cents": 500
      },
      "id": "38c264ba-0612-4bb9-bc33-f9755cc68bb0",
      "relationships": {
        "address": {
          "data": null
        },
        "campaign": {
          "data": {
            "id": "11539233",
            "type": "campaign"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/campaigns/11539233"
          }
        },
        "currently_entitled_tiers": {
          "data": []
        },
        "user": {
          "data": {
            "id": "111836593",
            "type": "user"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/user/111836593"
          }
        }
      },
      "type": "member"
    },
    "included": [
      {
        "attributes": {
          "created_at": "2023-12-29T01:11:16.000+00:00",
          "creation_name": "",
          "discord_server_id": null,
          "google_analytics_id": null,
          "has_rss": false,
          "has_sent_rss_notify": false,
          "image_small_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "is_charged_immediately": true,
          "is_monthly": true,
          "is_nsfw": false,
          "main_video_embed": null,
          "main_video_url": null,
          "one_liner": null,
          "patron_count": 5,
          "pay_per_name": "month",
          "pledge_url": "/checkout/11539233",
          "published_at": "2023-12-29T01:29:54.000+00:00",
          "rss_artwork_url": null,
          "rss_feed_title": null,
          "summary": null,
          "thanks_embed": null,
          "thanks_msg": null,
          "thanks_video_url": null,
          "url": "https://www.patreon.com/user?u=111828554",
          "vanity": null
        },
        "id": "11539233",
        "type": "campaign"
      },
      {
        "attributes": {
          "about": null,
          "created": "2023-12-29T02:38:24.000+00:00",
          "first_name": "Kopi",
          "full_name": "Kopi",
          "hide_pledges": true,
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "is_creator": false,
          "last_name": "",
          "like_count": 0,
          "social_connections": {
            "discord": null,
            "facebook": null,
            "google": null,
            "instagram": null,
            "reddit": null,
            "spotify": null,
            "spotify_open_access": null,
            "twitch": null,
            "twitter": null,
            "vimeo": null,
            "youtube": null
          },
          "thumb_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "url": "https://www.patreon.com/user?u=111836593",
          "vanity": null
        },
        "id": "111836593",
        "type": "user"
      }
    ],
    "links": {
      "self": "https://www.patreon.com/api/oauth2/v2/members/38c264ba-0612-4bb9-bc33-f9755cc68bb0"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: members_pledge_create_paid_post.json]---
Location: zulip-main/zerver/webhooks/patreon/fixtures/members_pledge_create_paid_post.json

```json
{
    "data": {
      "attributes": {
        "campaign_lifetime_support_cents": 0,
        "currently_entitled_amount_cents": 500,
        "email": "drrosa@duck.com",
        "full_name": "David",
        "is_follower": false,
        "is_free_trial": false,
        "last_charge_date": null,
        "last_charge_status": null,
        "lifetime_support_cents": 0,
        "next_charge_date": "2024-02-01T08:00:00.000+00:00",
        "note": "",
        "patron_status": "active_patron",
        "pledge_cadence": 1,
        "pledge_relationship_start": "2024-01-10T22:37:02.731+00:00",
        "will_pay_amount_cents": 500
      },
      "id": "359a4862-bc4e-496f-8559-82a0a596ed72",
      "relationships": {
        "address": {
          "data": null
        },
        "campaign": {
          "data": {
            "id": "11579710",
            "type": "campaign"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/campaigns/11579710"
          }
        },
        "currently_entitled_tiers": {
          "data": [
            {
              "id": "21992054",
              "type": "tier"
            }
          ]
        },
        "user": {
          "data": {
            "id": "111828554",
            "type": "user"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/user/111828554"
          }
        }
      },
      "type": "member"
    },
    "included": [
      {
        "attributes": {
          "created_at": "2024-01-06T02:15:31.000+00:00",
          "creation_name": "",
          "discord_server_id": null,
          "google_analytics_id": null,
          "has_rss": false,
          "has_sent_rss_notify": false,
          "image_small_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11579710/4d4cde3afc3e4caf900f1237f7be1347/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1707004800&token-hash=HVyUX_Jm6Qp4Zy_1uSzi2M8BOV9xkPMNwUHvDu9Mwis%3D",
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11579710/4d4cde3afc3e4caf900f1237f7be1347/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1707004800&token-hash=HVyUX_Jm6Qp4Zy_1uSzi2M8BOV9xkPMNwUHvDu9Mwis%3D",
          "is_charged_immediately": false,
          "is_monthly": false,
          "is_nsfw": false,
          "main_video_embed": null,
          "main_video_url": null,
          "one_liner": null,
          "patron_count": 0,
          "pay_per_name": "pull request",
          "pledge_url": "/checkout/Test2979",
          "published_at": "2024-01-10T22:06:53.000+00:00",
          "rss_artwork_url": null,
          "rss_feed_title": null,
          "summary": null,
          "thanks_embed": null,
          "thanks_msg": null,
          "thanks_video_url": null,
          "url": "https://www.patreon.com/Test2979",
          "vanity": "Test2979"
        },
        "id": "11579710",
        "type": "campaign"
      },
      {
        "attributes": {
          "about": null,
          "created": "2023-12-29T01:09:55.000+00:00",
          "first_name": "David",
          "full_name": "David",
          "hide_pledges": true,
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111828554/1543482da60f49dda649625e7bdf4e15/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=8SZgxLW0nhdUhKDxEaur_X-rYnZI5Gcu-9m2lC1F18Y%3D",
          "is_creator": true,
          "last_name": "",
          "like_count": 0,
          "social_connections": {
            "discord": null,
            "facebook": null,
            "google": null,
            "instagram": null,
            "reddit": null,
            "spotify": null,
            "spotify_open_access": null,
            "twitch": null,
            "twitter": null,
            "vimeo": null,
            "youtube": null
          },
          "thumb_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111828554/1543482da60f49dda649625e7bdf4e15/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=8SZgxLW0nhdUhKDxEaur_X-rYnZI5Gcu-9m2lC1F18Y%3D",
          "url": "https://www.patreon.com/user?u=111828554",
          "vanity": null
        },
        "id": "111828554",
        "type": "user"
      },
      {
        "attributes": {
          "amount_cents": 500,
          "created_at": "2024-01-06T02:16:24.443+00:00",
          "description": "Access to exclusive content and more",
          "discord_role_ids": null,
          "edited_at": "2024-01-06T02:16:24.443+00:00",
          "image_url": null,
          "patron_count": 1,
          "post_count": 0,
          "published": true,
          "published_at": "2024-01-06T02:16:24.443+00:00",
          "remaining": null,
          "requires_shipping": false,
          "title": "",
          "unpublished_at": null,
          "url": "/checkout/Test2979?rid=21992054",
          "user_limit": null
        },
        "id": "21992054",
        "type": "tier"
      }
    ],
    "links": {
      "self": "https://www.patreon.com/api/oauth2/v2/members/359a4862-bc4e-496f-8559-82a0a596ed72"
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: members_pledge_delete.json]---
Location: zulip-main/zerver/webhooks/patreon/fixtures/members_pledge_delete.json

```json
{
    "data": {
      "attributes": {
        "campaign_lifetime_support_cents": 0,
        "currently_entitled_amount_cents": 0,
        "email": "kopi@pangea.com",
        "full_name": "Kopi",
        "is_follower": false,
        "is_free_trial": false,
        "last_charge_date": "2023-12-29T05:26:19.000+00:00",
        "last_charge_status": "Deleted",
        "lifetime_support_cents": 0,
        "next_charge_date": "2024-01-29T00:00:00.000+00:00",
        "note": "",
        "patron_status": "former_patron",
        "pledge_cadence": 1,
        "pledge_relationship_start": "2023-12-29T05:26:17.634+00:00",
        "will_pay_amount_cents": 0
      },
      "id": "38c264ba-0612-4bb9-bc33-f9755cc68bb0",
      "relationships": {
        "address": {
          "data": null
        },
        "campaign": {
          "data": {
            "id": "11539233",
            "type": "campaign"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/campaigns/11539233"
          }
        },
        "currently_entitled_tiers": {
          "data": []
        },
        "user": {
          "data": {
            "id": "111836593",
            "type": "user"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/user/111836593"
          }
        }
      },
      "type": "member"
    },
    "included": [
      {
        "attributes": {
          "created_at": "2023-12-29T01:11:16.000+00:00",
          "creation_name": "",
          "discord_server_id": null,
          "google_analytics_id": null,
          "has_rss": false,
          "has_sent_rss_notify": false,
          "image_small_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "is_charged_immediately": true,
          "is_monthly": true,
          "is_nsfw": false,
          "main_video_embed": null,
          "main_video_url": null,
          "one_liner": null,
          "patron_count": 4,
          "pay_per_name": "month",
          "pledge_url": "/checkout/11539233",
          "published_at": "2023-12-29T01:29:54.000+00:00",
          "rss_artwork_url": null,
          "rss_feed_title": null,
          "summary": null,
          "thanks_embed": null,
          "thanks_msg": null,
          "thanks_video_url": null,
          "url": "https://www.patreon.com/user?u=111828554",
          "vanity": null
        },
        "id": "11539233",
        "type": "campaign"
      },
      {
        "attributes": {
          "about": null,
          "created": "2023-12-29T02:38:24.000+00:00",
          "first_name": "Kopi",
          "full_name": "Kopi",
          "hide_pledges": true,
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "is_creator": false,
          "last_name": "",
          "like_count": 0,
          "social_connections": {
            "discord": null,
            "facebook": null,
            "google": null,
            "instagram": null,
            "reddit": null,
            "spotify": null,
            "spotify_open_access": null,
            "twitch": null,
            "twitter": null,
            "vimeo": null,
            "youtube": null
          },
          "thumb_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "url": "https://www.patreon.com/user?u=111836593",
          "vanity": null
        },
        "id": "111836593",
        "type": "user"
      }
    ],
    "links": {
      "self": "https://www.patreon.com/api/oauth2/v2/members/38c264ba-0612-4bb9-bc33-f9755cc68bb0"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: members_pledge_update.json]---
Location: zulip-main/zerver/webhooks/patreon/fixtures/members_pledge_update.json

```json
{
    "data": {
      "attributes": {
        "campaign_lifetime_support_cents": 0,
        "currently_entitled_amount_cents": 1000,
        "email": "kopi@pangea.com",
        "full_name": "Kopi",
        "is_follower": false,
        "is_free_trial": false,
        "last_charge_date": "2023-12-29T05:26:19.000+00:00",
        "last_charge_status": "Paid",
        "lifetime_support_cents": 0,
        "next_charge_date": "2024-01-29T00:00:00.000+00:00",
        "note": "",
        "patron_status": "active_patron",
        "pledge_cadence": 1,
        "pledge_relationship_start": "2023-12-29T05:26:17.634+00:00",
        "will_pay_amount_cents": 1000
      },
      "id": "38c264ba-0612-4bb9-bc33-f9755cc68bb0",
      "relationships": {
        "address": {
          "data": null
        },
        "campaign": {
          "data": {
            "id": "11539233",
            "type": "campaign"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/campaigns/11539233"
          }
        },
        "currently_entitled_tiers": {
          "data": []
        },
        "user": {
          "data": {
            "id": "111836593",
            "type": "user"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/user/111836593"
          }
        }
      },
      "type": "member"
    },
    "included": [
      {
        "attributes": {
          "created_at": "2023-12-29T01:11:16.000+00:00",
          "creation_name": "",
          "discord_server_id": null,
          "google_analytics_id": null,
          "has_rss": false,
          "has_sent_rss_notify": false,
          "image_small_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "is_charged_immediately": true,
          "is_monthly": true,
          "is_nsfw": false,
          "main_video_embed": null,
          "main_video_url": null,
          "one_liner": null,
          "patron_count": 5,
          "pay_per_name": "month",
          "pledge_url": "/checkout/11539233",
          "published_at": "2023-12-29T01:29:54.000+00:00",
          "rss_artwork_url": null,
          "rss_feed_title": null,
          "summary": null,
          "thanks_embed": null,
          "thanks_msg": null,
          "thanks_video_url": null,
          "url": "https://www.patreon.com/user?u=111828554",
          "vanity": null
        },
        "id": "11539233",
        "type": "campaign"
      },
      {
        "attributes": {
          "about": null,
          "created": "2023-12-29T02:38:24.000+00:00",
          "first_name": "Kopi",
          "full_name": "Kopi",
          "hide_pledges": true,
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "is_creator": false,
          "last_name": "",
          "like_count": 0,
          "social_connections": {
            "discord": null,
            "facebook": null,
            "google": null,
            "instagram": null,
            "reddit": null,
            "spotify": null,
            "spotify_open_access": null,
            "twitch": null,
            "twitter": null,
            "vimeo": null,
            "youtube": null
          },
          "thumb_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "url": "https://www.patreon.com/user?u=111836593",
          "vanity": null
        },
        "id": "111836593",
        "type": "user"
    },
    {
      "attributes": {
        "amount_cents": 0,
        "created_at": "2023-12-29T01:11:16.871+00:00",
        "description": "",
        "discord_role_ids": null,
        "edited_at": "2023-12-29T01:11:16.871+00:00",
        "image_url": null,
        "patron_count": 5,
        "post_count": 0,
        "published": true,
        "published_at": "2023-12-29T01:11:16.871+00:00",
        "remaining": null,
        "requires_shipping": false,
        "title": "Free",
        "unpublished_at": null,
        "url": "/checkout/11539233?rid=21926168",
        "user_limit": null
      },
      "id": "21926168",
      "type": "tier"
    }
  ],
    "links": {
      "self": "https://www.patreon.com/api/oauth2/v2/members/38c264ba-0612-4bb9-bc33-f9755cc68bb0"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: members_update.json]---
Location: zulip-main/zerver/webhooks/patreon/fixtures/members_update.json

```json
{
    "data": {
      "attributes": {
        "campaign_lifetime_support_cents": 0,
        "currently_entitled_amount_cents": 100,
        "email": "kopi@pangea.com",
        "full_name": "Kopi",
        "is_follower": false,
        "is_free_trial": true,
        "last_charge_date": null,
        "last_charge_status": null,
        "lifetime_support_cents": 0,
        "next_charge_date": null,
        "note": "",
        "patron_status": "active_patron",
        "pledge_cadence": null,
        "pledge_relationship_start": "2023-12-29T03:40:28.000+00:00",
        "will_pay_amount_cents": 0
      },
      "id": "38c264ba-0612-4bb9-bc33-f9755cc68bb0",
      "relationships": {
        "address": {
          "data": null
        },
        "campaign": {
          "data": {
            "id": "11539233",
            "type": "campaign"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/campaigns/11539233"
          }
        },
        "currently_entitled_tiers": {
          "data": [
            {
              "id": "21926235",
              "type": "tier"
            },
            {
              "id": "21926168",
              "type": "tier"
            }
          ]
        },
        "user": {
          "data": {
            "id": "111836593",
            "type": "user"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/user/111836593"
          }
        }
      },
      "type": "member"
    },
    "included": [
      {
        "attributes": {
          "created_at": "2023-12-29T01:11:16.000+00:00",
          "creation_name": "",
          "discord_server_id": null,
          "google_analytics_id": null,
          "has_rss": false,
          "has_sent_rss_notify": false,
          "image_small_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "is_charged_immediately": true,
          "is_monthly": true,
          "is_nsfw": false,
          "main_video_embed": null,
          "main_video_url": null,
          "one_liner": null,
          "patron_count": 0,
          "pay_per_name": "month",
          "pledge_url": "/checkout/11539233",
          "published_at": "2023-12-29T01:29:54.000+00:00",
          "rss_artwork_url": null,
          "rss_feed_title": null,
          "summary": null,
          "thanks_embed": null,
          "thanks_msg": null,
          "thanks_video_url": null,
          "url": "https://www.patreon.com/user?u=111828554",
          "vanity": null
        },
        "id": "11539233",
        "type": "campaign"
      },
      {
        "attributes": {
          "about": null,
          "created": "2023-12-29T02:38:24.000+00:00",
          "first_name": "Kopi",
          "full_name": "Kopi",
          "hide_pledges": true,
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "is_creator": false,
          "last_name": "",
          "like_count": 0,
          "social_connections": {
            "discord": null,
            "facebook": null,
            "google": null,
            "instagram": null,
            "reddit": null,
            "spotify": null,
            "spotify_open_access": null,
            "twitch": null,
            "twitter": null,
            "vimeo": null,
            "youtube": null
          },
          "thumb_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "url": "https://www.patreon.com/user?u=111836593",
          "vanity": null
        },
        "id": "111836593",
        "type": "user"
      },
      {
        "attributes": {
          "amount_cents": 100,
          "created_at": "2023-12-29T01:22:12.268+00:00",
          "description": "Access to exclusive content and more",
          "discord_role_ids": null,
          "edited_at": "2023-12-29T01:23:06.534+00:00",
          "image_url": null,
          "patron_count": 1,
          "post_count": 0,
          "published": true,
          "published_at": "2023-12-29T01:22:12.268+00:00",
          "remaining": null,
          "requires_shipping": false,
          "title": "Paid",
          "unpublished_at": null,
          "url": "/checkout/11539233?rid=21926235",
          "user_limit": null
        },
        "id": "21926235",
        "type": "tier"
      },
      {
        "attributes": {
          "amount_cents": 0,
          "created_at": "2023-12-29T01:11:16.871+00:00",
          "description": "",
          "discord_role_ids": null,
          "edited_at": "2023-12-29T01:11:16.871+00:00",
          "image_url": null,
          "patron_count": 0,
          "post_count": 0,
          "published": true,
          "published_at": "2023-12-29T01:11:16.871+00:00",
          "remaining": null,
          "requires_shipping": false,
          "title": "Free",
          "unpublished_at": null,
          "url": "/checkout/11539233?rid=21926168",
          "user_limit": null
        },
        "id": "21926168",
        "type": "tier"
      }
    ],
    "links": {
      "self": "https://www.patreon.com/api/oauth2/v2/members/38c264ba-0612-4bb9-bc33-f9755cc68bb0"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/pingdom/doc.md

```text
# Zulip Pingdom integration

Zulip supports integration with Pingdom and can notify you of
uptime status changes from your Pingdom dashboard.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In Pingdom, open the **Integrations** menu, and click
   **Add integration**.

1. For **Type**, select **Webhook**. Set **Name** to a name of your
   choice, like `Zulip`, and set **URL** to the URL generated above.
   Make sure **Active** is toggle, and click **Save integration**.

1. Finally, when creating a new check or editing an existing check,
   toggle the integration created above in the **Connect Integrations**
   section for that check.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/pingdom/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/pingdom/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class PingdomHookTests(WebhookTestCase):
    CHANNEL_NAME = "pingdom"
    URL_TEMPLATE = "/api/v1/external/pingdom?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "pingdom"

    def test_pingdom_from_up_to_down_http_check_message(self) -> None:
        """
        Tests if pingdom http check from up to down is handled correctly
        """
        expected_message = "Service someurl.com changed its HTTP status from UP to DOWN:\n\n``` quote\nNon-recoverable failure in name resolution\n```"
        self.check_webhook("http_up_to_down", "Test check status.", expected_message)

    def test_pingdom_from_up_to_down_smtp_check_message(self) -> None:
        """
        Tests if pingdom smtp check from up to down is handled correctly
        """
        expected_message = "Service smtp.someurl.com changed its SMTP status from UP to DOWN:\n\n``` quote\nConnection refused\n```"
        self.check_webhook("smtp_up_to_down", "SMTP check status.", expected_message)

    def test_pingdom_from_up_to_down_imap_check_message(self) -> None:
        """
        Tests if pingdom imap check from up to down is handled correctly
        """
        expected_message = "Service imap.someurl.com changed its IMAP status from UP to DOWN:\n\n``` quote\nInvalid hostname, address or socket\n```"
        self.check_webhook("imap_up_to_down", "IMAP check status.", expected_message)

    def test_pingdom_from_down_to_up_imap_check_message(self) -> None:
        """
        Tests if pingdom imap check from down to up is handled correctly
        """
        expected_message = "Service imap.someurl.com changed its IMAP status from DOWN to UP."
        self.check_webhook("imap_down_to_up", "IMAP check status.", expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/pingdom/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

PINGDOM_TOPIC_TEMPLATE = "{name} status."

MESSAGE_TEMPLATE = """
Service {service_url} changed its {type} status from {previous_state} to {current_state}:
""".strip()

DESC_TEMPLATE = """

``` quote
{description}
```
""".rstrip()

SUPPORTED_CHECK_TYPES = (
    "HTTP",
    "HTTP_CUSTOM",
    "HTTPS",
    "SMTP",
    "POP3",
    "IMAP",
    "PING",
    "DNS",
    "UDP",
    "PORT_TCP",
)

ALL_EVENT_TYPES = list(SUPPORTED_CHECK_TYPES)


@webhook_view("Pingdom", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_pingdom_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    check_type = get_check_type(payload)

    if check_type in SUPPORTED_CHECK_TYPES:
        topic_name = get_topic_for_http_request(payload)
        body = get_body_for_http_request(payload)
    else:
        raise UnsupportedWebhookEventTypeError(check_type)

    check_send_webhook_message(request, user_profile, topic_name, body, check_type)
    return json_success(request)


def get_topic_for_http_request(payload: WildValue) -> str:
    return PINGDOM_TOPIC_TEMPLATE.format(name=payload["check_name"].tame(check_string))


def get_body_for_http_request(payload: WildValue) -> str:
    current_state = payload["current_state"].tame(check_string)
    previous_state = payload["previous_state"].tame(check_string)

    data = {
        "service_url": payload["check_params"]["hostname"].tame(check_string),
        "previous_state": previous_state,
        "current_state": current_state,
        "type": get_check_type(payload),
    }
    body = MESSAGE_TEMPLATE.format(**data)
    if current_state == "DOWN" and previous_state == "UP":
        description = DESC_TEMPLATE.format(
            description=payload["long_description"].tame(check_string)
        )
        body += description
    else:
        body = f"{body[:-1]}."

    return body


def get_check_type(payload: WildValue) -> str:
    return payload["check_type"].tame(check_string)
```

--------------------------------------------------------------------------------

---[FILE: http_up_to_down.json]---
Location: zulip-main/zerver/webhooks/pingdom/fixtures/http_up_to_down.json

```json
{
  "check_id": 2048467,
  "check_name": "Test check",
  "check_type": "HTTP",
  "check_params": {
    "basic_auth": false,
    "encryption": false,
    "full_url": "http:\/\/someurl.com\/",
    "header": "User-Agent:Pingdom.com_bot_version_1.4_(http:\/\/www.pingdom.com\/)",
    "hostname": "someurl.com",
    "ipv6": false,
    "port": 80,
    "url": "\/"
  },
  "tags": [

  ],
  "previous_state": "UP",
  "current_state": "DOWN",
  "state_changed_timestamp": 1457939434,
  "state_changed_utc_time": "2016-03-14T07:10:34",
  "long_description": "Non-recoverable failure in name resolution",
  "description": "DNS error",
  "first_probe": {
    "ip": "85.17.156.99",
    "ipv6": "2001:1af8:4100:a09b::454",
    "location": "Amsterdam 5, Netherlands"
  },
  "second_probe": {
    "ip": "64.141.100.136",
    "ipv6": "",
    "location": "Calgary, Canada"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: imap_down_to_up.json]---
Location: zulip-main/zerver/webhooks/pingdom/fixtures/imap_down_to_up.json

```json
{
  "check_id": 2051859,
  "check_name": "IMAP check",
  "check_type": "IMAP",
  "check_params": {
    "basic_auth": false,
    "encryption": true,
    "hostname": "imap.someurl.com",
    "ipv6": false,
    "port": 993
  },
  "tags": [],
  "previous_state": "DOWN",
  "current_state": "UP",
  "state_changed_timestamp": 1458070380,
  "state_changed_utc_time": "2016-03-15T19:33:00",
  "long_description": "OK",
  "description": "OK",
  "first_probe": {
    "ip": "69.64.56.47",
    "ipv6": "",
    "location": "St. Louis, MO"
  },
  "second_probe": {}
}
```

--------------------------------------------------------------------------------

---[FILE: imap_up_to_down.json]---
Location: zulip-main/zerver/webhooks/pingdom/fixtures/imap_up_to_down.json

```json
{
  "check_id": 2051859,
  "check_name": "IMAP check",
  "check_type": "IMAP",
  "check_params": {
    "basic_auth": false,
    "encryption": true,
    "hostname": "imap.someurl.com",
    "ipv6": false,
    "port": 993
  },
  "tags": [],
  "previous_state": "UP",
  "current_state": "DOWN",
  "state_changed_timestamp": 1458069480,
  "state_changed_utc_time": "2016-03-15T19:18:00",
  "long_description": "Invalid hostname, address or socket",
  "description": "Unknown target",
  "first_probe": {
    "ip": "188.138.118.184",
    "ipv6": "",
    "location": "Strasbourg 2, France"
  },
  "second_probe": {
    "ip": "76.164.194.74",
    "ipv6": "2605:6f80:0:c::449",
    "location": "Las Vegas 2, NV"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: smtp_up_to_down.json]---
Location: zulip-main/zerver/webhooks/pingdom/fixtures/smtp_up_to_down.json

```json
{
  "check_id": 2051844,
  "check_name": "SMTP check",
  "check_type": "SMTP",
  "check_params": {
    "basic_auth": false,
    "encryption": false,
    "hostname": "smtp.someurl.com",
    "ipv6": false,
    "port": 25
  },
  "tags": [],
  "previous_state": "UP",
  "current_state": "DOWN",
  "state_changed_timestamp": 1458068544,
  "state_changed_utc_time": "2016-03-15T19:02:24",
  "long_description": "Connection refused",
  "description": "Connection refused",
  "first_probe": {
    "ip": "174.34.162.242",
    "ipv6": "",
    "location": "Atlanta, GA"
  },
  "second_probe": {
    "ip": "64.141.100.136",
    "ipv6": "",
    "location": "Calgary, Canada"
  }
}
```

--------------------------------------------------------------------------------

````
