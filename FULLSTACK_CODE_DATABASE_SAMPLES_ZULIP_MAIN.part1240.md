---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1240
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1240 of 1290)

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

---[FILE: review_published.json]---
Location: zulip-main/zerver/webhooks/reviewboard/fixtures/review_published.json

```json
{
    "diff_comments":[
        {
            "issue_opened":false,
            "interfilediff":null,
            "num_lines":1,
            "links":{
                "self":{
                    "href":"https://rbcommons.com",
                    "method":"GET"
                },
                "user":{
                    "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/",
                    "method":"GET",
                    "title":"eeshangarg"
                },
                "filediff":{
                    "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diffs/1/files/6128836/",
                    "method":"GET",
                    "title":"AddSpaces.java (PRE-CREATION) -> AddSpaces.java (dc54788b2bf0324a3228faa7224c3c523582d9f6)"
                }
            },
            "timestamp":"2018-10-26T15:52:29Z",
            "id":778500,
            "issue_status":"",
            "text":"I think we should get rid of this extra whitespace here",
            "first_line":81,
            "extra_data":{
                "require_verification":false
            },
            "public":true,
            "text_type":"markdown"
        }
    ],
    "file_attachment_comments":[

    ],
    "review":{
        "body_top":"Left some minor comments, thanks!",
        "ship_it":false,
        "extra_data":{

        },
        "links":{
            "diff_comments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/diff-comments/",
                "method":"GET"
            },
            "file_attachment_comments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/file-attachment-comments/",
                "method":"GET"
            },
            "self":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/",
                "method":"GET"
            },
            "update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/",
                "method":"PUT"
            },
            "general_comments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/general-comments/",
                "method":"GET"
            },
            "screenshot_comments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/screenshot-comments/",
                "method":"GET"
            },
            "user":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/",
                "method":"GET",
                "title":"eeshangarg"
            },
            "replies":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/replies/",
                "method":"GET"
            },
            "delete":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/651728/",
                "method":"DELETE"
            }
        },
        "timestamp":"2018-10-26T15:52:29Z",
        "absolute_url":"https://rbcommons.com/s/zulip/r/1/#review651728",
        "public":true,
        "text_type":null,
        "body_bottom":"",
        "body_top_text_type":"markdown",
        "id":651728,
        "body_bottom_text_type":"plain"
    },
    "general_comments":[

    ],
    "screenshot_comments":[

    ],
    "review_request":{
        "status":"pending",
        "last_updated":"2018-10-26T15:52:29Z",
        "target_people":[
            {
                "href":"https://rbcommons.com/s/zulip/api/users/drsbgarg/",
                "method":"GET",
                "title":"drsbgarg"
            }
        ],
        "depends_on":[

        ],
        "description_text_type":"plain",
        "issue_resolved_count":0,
        "commit_id":"4f8a093f7046fcc58b0826d21586d1b537b0112b",
        "ship_it_count":0,
        "close_description_text_type":"plain",
        "id":1,
        "links":{
            "diffs":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diffs/",
                "method":"GET"
            },
            "latest_diff":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diffs/1/",
                "method":"GET"
            },
            "repository":{
                "href":"https://rbcommons.com/s/zulip/api/repositories/2147/",
                "method":"GET",
                "title":"Scheduler"
            },
            "screenshots":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/screenshots/",
                "method":"GET"
            },
            "self":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"GET"
            },
            "status_updates":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/status-updates/",
                "method":"GET"
            },
            "update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"PUT"
            },
            "last_update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/last-update/",
                "method":"GET"
            },
            "reviews":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/",
                "method":"GET"
            },
            "file_attachments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/file-attachments/",
                "method":"GET"
            },
            "draft":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/draft/",
                "method":"GET"
            },
            "diff_context":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diff-context/",
                "method":"GET"
            },
            "submitter":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/",
                "method":"GET",
                "title":"eeshangarg"
            },
            "changes":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/changes/",
                "method":"GET"
            },
            "delete":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"DELETE"
            }
        },
        "issue_dropped_count":0,
        "bugs_closed":[

        ],
        "testing_done":"This was tested thoroughly",
        "branch":"master",
        "text_type":null,
        "time_added":"2018-10-26T15:24:18Z",
        "extra_data":{
            "calculated_trophies":true
        },
        "public":true,
        "issue_verifying_count":0,
        "close_description":null,
        "blocks":[

        ],
        "description":"Initial commit (first iteration)",
        "testing_done_text_type":"markdown",
        "issue_open_count":0,
        "approved":false,
        "url":"/s/zulip/r/1/",
        "absolute_url":"https://rbcommons.com/s/zulip/r/1/",
        "target_groups":[

        ],
        "summary":"Initial commit (first iteration)",
        "changenum":null,
        "approval_failure":"The review request has not been marked \"Ship It!\""
    },
    "event":"review_published"
}
```

--------------------------------------------------------------------------------

---[FILE: review_request_closed.json]---
Location: zulip-main/zerver/webhooks/reviewboard/fixtures/review_request_closed.json

```json
{
    "close_type":"submitted",
    "review_request":{
        "status":"submitted",
        "last_updated":"2018-10-26T15:41:55Z",
        "target_people":[
            {
                "href":"https://rbcommons.com/s/zulip/api/users/drsbgarg/",
                "method":"GET",
                "title":"drsbgarg"
            }
        ],
        "depends_on":[

        ],
        "description_text_type":"plain",
        "issue_resolved_count":0,
        "commit_id":"4f8a093f7046fcc58b0826d21586d1b537b0112b",
        "ship_it_count":0,
        "close_description_text_type":"plain",
        "id":1,
        "links":{
            "diffs":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diffs/",
                "method":"GET"
            },
            "latest_diff":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diffs/1/",
                "method":"GET"
            },
            "repository":{
                "href":"https://rbcommons.com/s/zulip/api/repositories/2147/",
                "method":"GET",
                "title":"Scheduler"
            },
            "screenshots":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/screenshots/",
                "method":"GET"
            },
            "self":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"GET"
            },
            "status_updates":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/status-updates/",
                "method":"GET"
            },
            "update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"PUT"
            },
            "last_update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/last-update/",
                "method":"GET"
            },
            "reviews":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/",
                "method":"GET"
            },
            "file_attachments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/file-attachments/",
                "method":"GET"
            },
            "draft":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/draft/",
                "method":"GET"
            },
            "diff_context":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diff-context/",
                "method":"GET"
            },
            "submitter":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/",
                "method":"GET",
                "title":"eeshangarg"
            },
            "changes":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/changes/",
                "method":"GET"
            },
            "delete":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"DELETE"
            }
        },
        "issue_dropped_count":0,
        "bugs_closed":[

        ],
        "testing_done":"This was tested thoroughly",
        "branch":"master",
        "text_type":null,
        "time_added":"2018-10-26T15:24:18Z",
        "extra_data":{
            "calculated_trophies":true
        },
        "public":true,
        "issue_verifying_count":0,
        "close_description":"",
        "blocks":[

        ],
        "description":"Initial commit (first iteration)",
        "testing_done_text_type":"markdown",
        "issue_open_count":0,
        "approved":false,
        "url":"/s/zulip/r/1/",
        "absolute_url":"https://rbcommons.com/s/zulip/r/1/",
        "target_groups":[

        ],
        "summary":"Initial commit (first iteration)",
        "changenum":null,
        "approval_failure":"The review request has not been marked \"Ship It!\""
    },
    "event":"review_request_closed",
    "closed_by":{
        "username":"eeshangarg",
        "first_name":"Eeshan",
        "last_name":"Garg",
        "links":{
            "api_tokens":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/api-tokens/",
                "method":"GET"
            },
            "self":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/",
                "method":"GET"
            },
            "archived_review_requests":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/archived-review-requests/",
                "method":"GET"
            },
            "user_file_attachments":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/user-file-attachments/",
                "method":"GET"
            },
            "muted_review_requests":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/muted-review-requests/",
                "method":"GET"
            },
            "watched":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/watched/",
                "method":"GET"
            }
        },
        "url":"/s/zulip/users/eeshangarg/",
        "is_active":true,
        "fullname":"Eeshan Garg",
        "email":"jerryguitarist@gmail.com",
        "avatar_url":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=48&d=mm",
        "avatar_urls":{
            "1x":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=48&d=mm",
            "3x":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=144&d=mm",
            "2x":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=96&d=mm"
        },
        "id":11032
    }
}
```

--------------------------------------------------------------------------------

---[FILE: review_request_published.json]---
Location: zulip-main/zerver/webhooks/reviewboard/fixtures/review_request_published.json

```json
{
    "review_request":{
        "status":"pending",
        "last_updated":"2018-10-26T15:39:46Z",
        "target_people":[
            {
                "href":"https://rbcommons.com/s/zulip/api/users/drsbgarg/",
                "method":"GET",
                "title":"drsbgarg"
            }
        ],
        "depends_on":[

        ],
        "description_text_type":"plain",
        "issue_resolved_count":0,
        "commit_id":"0c694b62d4cfd159e1b94b9368bc573338c7c77a",
        "ship_it_count":0,
        "close_description_text_type":"plain",
        "id":2,
        "links":{
            "diffs":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/diffs/",
                "method":"GET"
            },
            "latest_diff":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/diffs/1/",
                "method":"GET"
            },
            "repository":{
                "href":"https://rbcommons.com/s/zulip/api/repositories/2147/",
                "method":"GET",
                "title":"Scheduler"
            },
            "screenshots":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/screenshots/",
                "method":"GET"
            },
            "self":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/",
                "method":"GET"
            },
            "status_updates":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/status-updates/",
                "method":"GET"
            },
            "update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/",
                "method":"PUT"
            },
            "last_update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/last-update/",
                "method":"GET"
            },
            "reviews":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/reviews/",
                "method":"GET"
            },
            "file_attachments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/file-attachments/",
                "method":"GET"
            },
            "draft":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/draft/",
                "method":"GET"
            },
            "diff_context":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/diff-context/",
                "method":"GET"
            },
            "submitter":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/",
                "method":"GET",
                "title":"eeshangarg"
            },
            "changes":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/changes/",
                "method":"GET"
            },
            "delete":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/",
                "method":"DELETE"
            }
        },
        "issue_dropped_count":0,
        "bugs_closed":[

        ],
        "testing_done":"This was tested thoroughly.",
        "branch":"master",
        "text_type":null,
        "time_added":"2018-10-26T15:39:46Z",
        "extra_data":{
            "calculated_trophies":true
        },
        "public":true,
        "issue_verifying_count":0,
        "close_description":null,
        "blocks":[

        ],
        "description":"Initial commit",
        "testing_done_text_type":"markdown",
        "issue_open_count":0,
        "approved":false,
        "url":"/s/zulip/r/2/",
        "absolute_url":"https://rbcommons.com/s/zulip/r/2/",
        "target_groups":[

        ],
        "summary":"Initial commit",
        "changenum":null,
        "approval_failure":"The review request has not been marked \"Ship It!\""
    },
    "event":"review_request_published",
    "is_new":true
}
```

--------------------------------------------------------------------------------

---[FILE: review_request_published__with_multiple_target_people.json]---
Location: zulip-main/zerver/webhooks/reviewboard/fixtures/review_request_published__with_multiple_target_people.json

```json
{
    "review_request":{
        "status":"pending",
        "last_updated":"2018-10-26T15:39:46Z",
        "target_people":[
            {
                "href":"https://rbcommons.com/s/zulip/api/users/drsbgarg/",
                "method":"GET",
                "title":"drsbgarg"
            },
            {
                "href":"https://rbcommons.com/s/zulip/api/users/johndoe/",
                "method":"GET",
                "title":"johndoe"
            },
            {
                "href":"https://rbcommons.com/s/zulip/api/users/janedoe/",
                "method":"GET",
                "title":"janedoe"
            }
        ],
        "depends_on":[

        ],
        "description_text_type":"plain",
        "issue_resolved_count":0,
        "commit_id":"0c694b62d4cfd159e1b94b9368bc573338c7c77a",
        "ship_it_count":0,
        "close_description_text_type":"plain",
        "id":2,
        "links":{
            "diffs":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/diffs/",
                "method":"GET"
            },
            "latest_diff":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/diffs/1/",
                "method":"GET"
            },
            "repository":{
                "href":"https://rbcommons.com/s/zulip/api/repositories/2147/",
                "method":"GET",
                "title":"Scheduler"
            },
            "screenshots":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/screenshots/",
                "method":"GET"
            },
            "self":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/",
                "method":"GET"
            },
            "status_updates":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/status-updates/",
                "method":"GET"
            },
            "update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/",
                "method":"PUT"
            },
            "last_update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/last-update/",
                "method":"GET"
            },
            "reviews":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/reviews/",
                "method":"GET"
            },
            "file_attachments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/file-attachments/",
                "method":"GET"
            },
            "draft":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/draft/",
                "method":"GET"
            },
            "diff_context":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/diff-context/",
                "method":"GET"
            },
            "submitter":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/",
                "method":"GET",
                "title":"eeshangarg"
            },
            "changes":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/changes/",
                "method":"GET"
            },
            "delete":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/2/",
                "method":"DELETE"
            }
        },
        "issue_dropped_count":0,
        "bugs_closed":[

        ],
        "testing_done":"This was tested thoroughly.",
        "branch":"master",
        "text_type":null,
        "time_added":"2018-10-26T15:39:46Z",
        "extra_data":{
            "calculated_trophies":true
        },
        "public":true,
        "issue_verifying_count":0,
        "close_description":null,
        "blocks":[

        ],
        "description":"Initial commit",
        "testing_done_text_type":"markdown",
        "issue_open_count":0,
        "approved":false,
        "url":"/s/zulip/r/2/",
        "absolute_url":"https://rbcommons.com/s/zulip/r/2/",
        "target_groups":[

        ],
        "summary":"Initial commit",
        "changenum":null,
        "approval_failure":"The review request has not been marked \"Ship It!\""
    },
    "event":"review_request_published",
    "is_new":true
}
```

--------------------------------------------------------------------------------

---[FILE: review_request_reopened.json]---
Location: zulip-main/zerver/webhooks/reviewboard/fixtures/review_request_reopened.json

```json
{
    "reopened_by":{
        "username":"eeshangarg",
        "first_name":"Eeshan",
        "last_name":"Garg",
        "links":{
            "api_tokens":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/api-tokens/",
                "method":"GET"
            },
            "self":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/",
                "method":"GET"
            },
            "archived_review_requests":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/archived-review-requests/",
                "method":"GET"
            },
            "user_file_attachments":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/user-file-attachments/",
                "method":"GET"
            },
            "muted_review_requests":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/muted-review-requests/",
                "method":"GET"
            },
            "watched":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/watched/",
                "method":"GET"
            }
        },
        "url":"/s/zulip/users/eeshangarg/",
        "is_active":true,
        "fullname":"Eeshan Garg",
        "email":"jerryguitarist@gmail.com",
        "avatar_url":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=48&d=mm",
        "avatar_urls":{
            "1x":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=48&d=mm",
            "3x":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=144&d=mm",
            "2x":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=96&d=mm"
        },
        "id":11032
    },
    "review_request":{
        "status":"pending",
        "last_updated":"2018-10-26T15:45:49Z",
        "target_people":[
            {
                "href":"https://rbcommons.com/s/zulip/api/users/drsbgarg/",
                "method":"GET",
                "title":"drsbgarg"
            }
        ],
        "depends_on":[

        ],
        "description_text_type":"plain",
        "issue_resolved_count":0,
        "commit_id":"4f8a093f7046fcc58b0826d21586d1b537b0112b",
        "ship_it_count":0,
        "close_description_text_type":"plain",
        "id":1,
        "links":{
            "diffs":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diffs/",
                "method":"GET"
            },
            "latest_diff":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diffs/1/",
                "method":"GET"
            },
            "repository":{
                "href":"https://rbcommons.com/s/zulip/api/repositories/2147/",
                "method":"GET",
                "title":"Scheduler"
            },
            "screenshots":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/screenshots/",
                "method":"GET"
            },
            "self":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"GET"
            },
            "status_updates":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/status-updates/",
                "method":"GET"
            },
            "update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"PUT"
            },
            "last_update":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/last-update/",
                "method":"GET"
            },
            "reviews":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/reviews/",
                "method":"GET"
            },
            "file_attachments":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/file-attachments/",
                "method":"GET"
            },
            "draft":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/draft/",
                "method":"GET"
            },
            "diff_context":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/diff-context/",
                "method":"GET"
            },
            "submitter":{
                "href":"https://rbcommons.com/s/zulip/api/users/eeshangarg/",
                "method":"GET",
                "title":"eeshangarg"
            },
            "changes":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/changes/",
                "method":"GET"
            },
            "delete":{
                "href":"https://rbcommons.com/s/zulip/api/review-requests/1/",
                "method":"DELETE"
            }
        },
        "issue_dropped_count":0,
        "bugs_closed":[

        ],
        "testing_done":"This was tested thoroughly",
        "branch":"master",
        "text_type":null,
        "time_added":"2018-10-26T15:24:18Z",
        "extra_data":{
            "calculated_trophies":true
        },
        "public":true,
        "issue_verifying_count":0,
        "close_description":null,
        "blocks":[

        ],
        "description":"Initial commit (first iteration)",
        "testing_done_text_type":"markdown",
        "issue_open_count":0,
        "approved":false,
        "url":"/s/zulip/r/1/",
        "absolute_url":"https://rbcommons.com/s/zulip/r/1/",
        "target_groups":[

        ],
        "summary":"Initial commit (first iteration)",
        "changenum":null,
        "approval_failure":"The review request has not been marked \"Ship It!\""
    },
    "event":"review_request_reopened"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/rhodecode/doc.md

```text
# Zulip RhodeCode integration

Get RhodeCode notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-with-branch-filtering.md!}

1. From your repository on RhodeCode, open the **Repository Settings** tab.
    Select **Integrations**, click on **Create new integration**, and
    select **Webhook**.

1. Set **Webhook URL** to the URL generated above. Select the
    [events](#filtering-incoming-events) you would like to receive notifications
    for, and click **Submit**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/rhodecode/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/rhodecode/tests.py

```python
from unittest.mock import MagicMock, patch

from zerver.lib.test_classes import WebhookTestCase
from zerver.lib.webhooks.git import COMMITS_LIMIT


class RhodecodeHookTests(WebhookTestCase):
    CHANNEL_NAME = "rhodecode"
    URL_TEMPLATE = "/api/v1/external/rhodecode?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "rhodecode"

    def test_push_event_message(self) -> None:
        expected_topic_name = "u/yuroitaki/zulip-testing / master"
        expected_message = "yuroitaki pushed 1 commit to branch master. Commits by Yuro Itaki <yuroitaki@email.com> (1).\n\n* Modify README ([2b8c0ebf507](https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/2b8c0ebf50710bc2e1cdb6a33071dd2435ad667c))"
        self.check_webhook("push", expected_topic_name, expected_message)

    def test_push_event_message_filtered_by_branches(self) -> None:
        self.url = self.build_webhook_url(branches="master,dev")
        expected_topic_name = "u/yuroitaki/zulip-testing / master"
        expected_message = "yuroitaki pushed 1 commit to branch master. Commits by Yuro Itaki <yuroitaki@email.com> (1).\n\n* Modify README ([2b8c0ebf507](https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/2b8c0ebf50710bc2e1cdb6a33071dd2435ad667c))"
        self.check_webhook("push", expected_topic_name, expected_message)

    @patch("zerver.lib.webhooks.common.check_send_webhook_message")
    def test_push_event_message_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url(branches="development")
        payload = self.get_body("push")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    def test_push_local_branch_without_commits(self) -> None:
        expected_topic_name = "u/yuroitaki/zulip-testing / dev"
        expected_message = "yuroitaki pushed the branch dev."
        self.check_webhook(
            "push__local_branch_without_commits", expected_topic_name, expected_message
        )

    def test_push_multiple_committers(self) -> None:
        expected_topic_name = "u/yuroitaki/zulip-testing / master"
        expected_message = "yuroitaki pushed 2 commits to branch master. Commits by Itachi Sensei <itachisensei@email.com> (1) and Yuro Itaki <yuroitaki@email.com> (1).\n\n* Add test.py ([b0d892e1cdd](https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/b0d892e1cdd4236b1f74debca1772ea330ff5acd))\n* Modify test.py ([6dbae5f842f](https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473))"
        self.check_webhook("push__multiple_committers", expected_topic_name, expected_message)

    def test_push_multiple_committers_with_others(self) -> None:
        expected_topic_name = "u/yuroitaki/zulip-testing / master"
        commits_info = "* Modify test.py ([6dbae5f842f](https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/6dbae5f842f80ccb05508a1de7aace9d0f327473))\n"
        expected_message = f"yuroitaki pushed 6 commits to branch master. Commits by Itachi Sensei <itachisensei@email.com> (2), Yuro Itaki <yuroitaki@email.com> (2), Jonas Nielsen <jonasnielsen@email.com> (1) and others (1).\n\n* Add test.py ([b0d892e1cdd](https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/b0d892e1cdd4236b1f74debca1772ea330ff5acd))\n{commits_info * 4}* Add test.py ([b0d892e1cdd](https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/b0d892e1cdd4236b1f74debca1772ea330ff5acd))"
        self.check_webhook(
            "push__multiple_committers_with_others", expected_topic_name, expected_message
        )

    def test_push_commits_more_than_limit(self) -> None:
        expected_topic_name = "u/yuroitaki/zulip-testing / master"
        commits_info = "* Modify README ([2b8c0ebf507](https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/2b8c0ebf50710bc2e1cdb6a33071dd2435ad667c))\n"
        expected_message = f"yuroitaki pushed 50 commits to branch master. Commits by Yuro Itaki <yuroitaki@email.com> (50).\n\n{commits_info * COMMITS_LIMIT}[and {50 - COMMITS_LIMIT} more commit(s)]"
        self.check_webhook("push__commits_more_than_limit", expected_topic_name, expected_message)

    def test_push_remove_branch(self) -> None:
        expected_topic_name = "u/yuroitaki/zulip-testing / dev"
        expected_message = "yuroitaki pushed 1 commit to branch dev. Commits by Yuro Itaki <yuroitaki@email.com> (1).\n\n* Deleted branch dev ([delete_bran](https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/delete_branch=%3Edev))"
        self.check_webhook("push__remove_branch", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/rhodecode/view.py
Signals: Django

```python
from collections.abc import Callable

from django.core.exceptions import ValidationError
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.lib.webhooks.git import (
    TOPIC_WITH_BRANCH_TEMPLATE,
    get_push_commits_event_message,
    is_branch_name_notifiable,
)
from zerver.models import UserProfile


def get_push_commits_body(payload: WildValue) -> str:
    commits_data = [
        {
            "name": commit["author"].tame(check_string),
            "sha": commit["raw_id"].tame(check_string),
            "url": commit["url"].tame(check_string),
            "message": commit["message"].tame(check_string),
        }
        for commit in payload["event"]["push"]["commits"]
    ]
    return get_push_commits_event_message(
        get_user_name(payload),
        None,
        get_push_branch_name(payload),
        commits_data,
    )


def get_user_name(payload: WildValue) -> str:
    return payload["event"]["actor"]["username"].tame(check_string)


def get_push_branch_name(payload: WildValue) -> str:
    branches = payload["event"]["push"]["branches"]
    try:
        return branches[0]["name"].tame(check_string)
    # this error happens when the event is a push to delete remote branch, where
    # branches will be an empty list
    except ValidationError:
        return payload["event"]["push"]["commits"][0]["raw_id"].tame(check_string).split("=>")[1]


def get_event_name(payload: WildValue, branches: str | None) -> str | None:
    event_name = payload["event"]["name"].tame(check_string)
    if event_name == "repo-push" and branches is not None:
        branch = get_push_branch_name(payload)
        if not is_branch_name_notifiable(branch, branches):
            return None
    if event_name in EVENT_FUNCTION_MAPPER:
        return event_name
    raise UnsupportedWebhookEventTypeError(event_name)


def get_repository_name(payload: WildValue) -> str:
    return payload["event"]["repo"]["repo_name"].tame(check_string)


def get_topic_based_on_event(payload: WildValue, event: str) -> str:
    if event == "repo-push":
        return TOPIC_WITH_BRANCH_TEMPLATE.format(
            repo=get_repository_name(payload), branch=get_push_branch_name(payload)
        )
    return get_repository_name(payload)  # nocoverage


EVENT_FUNCTION_MAPPER: dict[str, Callable[[WildValue], str]] = {
    "repo-push": get_push_commits_body,
}

ALL_EVENT_TYPES = list(EVENT_FUNCTION_MAPPER.keys())


@webhook_view("RhodeCode", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_rhodecode_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
    branches: str | None = None,
) -> HttpResponse:
    event = get_event_name(payload, branches)
    if event is None:
        return json_success(request)

    topic_name = get_topic_based_on_event(payload, event)

    body_function = EVENT_FUNCTION_MAPPER[event]
    body = body_function(payload)

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: push.json]---
Location: zulip-main/zerver/webhooks/rhodecode/fixtures/push.json

```json
{
    "event": {
      "repo": {
        "repo_name": "u/yuroitaki/zulip-testing",
        "permalink_url": "https://code.rhodecode.com/_1936",
        "repo_type": "git",
        "extra_fields": {},
        "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing",
        "repo_id": 1936
      },
      "actor_ip": "14.192.208.163",
      "utc_timestamp": "2022-06-26T10:14:12.449",
      "name": "repo-push",
      "actor": {
        "user_id": 2263,
        "username": "yuroitaki"
      },
      "push": {
        "issues": {},
        "commits": [
          {
            "parents": [
              {
                "raw_id": "3d6c5671a9b74b34d21b7b545f19ae7e9553a75a"
              }
            ],
            "message_html_title": "Modify README",
            "raw_id": "2b8c0ebf50710bc2e1cdb6a33071dd2435ad667c",
            "author": "Yuro Itaki <yuroitaki@email.com>",
            "short_id": "2b8c0ebf5071",
            "branch": "master",
            "revision": 1,
            "permalink_url": "https://code.rhodecode.com/1936/changeset/2b8c0ebf50710bc2e1cdb6a33071dd2435ad667c",
            "message_html": "Modify README\n",
            "mentions": [],
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changeset/2b8c0ebf50710bc2e1cdb6a33071dd2435ad667c",
            "message": "Modify README\n",
            "issues": [],
            "refs": {
              "tags": [],
              "bookmarks": [],
              "branches": [
                "master"
              ]
            },
            "date": "2022-06-26T10:14:05",
            "reviewers": []
          }
        ],
        "branches": [
          {
            "url": "https://code.rhodecode.com/u/yuroitaki/zulip-testing/changelog?branch=master",
            "name": "master"
          }
        ],
        "tags": []
      },
      "server_url": "https://code.rhodecode.com"
    },
    "token": ""
}
```

--------------------------------------------------------------------------------

````
