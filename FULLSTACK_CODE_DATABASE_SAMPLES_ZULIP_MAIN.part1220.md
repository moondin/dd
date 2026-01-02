---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1220
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1220 of 1290)

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

---[FILE: reassigned_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/reassigned_v2.json

```json
{
  "webhookEvent": "jira:issue_updated",
  "issue_event_type_name":"issue_generic",
  "timestamp": 1364403465325,
  "user": {
    "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
    "name": "lfranchi",
    "emailAddress": "othello@zulip.com",
    "avatarUrls": {
      "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
      "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
    },
    "displayName": "Leo Franchi",
    "active": true
  },
  "issue": {
    "id": "10400",
    "self": "http://lfranchi.com:8080/rest/api/2/issue/10400",
    "key": "BUG-15",
    "fields": {
      "summary": "New bug with hook",
      "progress": {
        "progress": 0,
        "total": 0
      },
      "timetracking": {},
      "issuetype": {
        "self": "http://lfranchi.com:8080/rest/api/2/issuetype/1",
        "id": "1",
        "description": "A problem which impairs or prevents the functions of the product.",
        "iconUrl": "http://lfranchi.com:8080/images/icons/bug.gif",
        "name": "Bug",
        "subtask": false
      },
      "votes": {
        "self": "http://lfranchi.com:8080/rest/api/2/issue/BUG-15/votes",
        "votes": 0,
        "hasVoted": false
      },
      "resolution": null,
      "fixVersions": [],
      "resolutiondate": null,
      "timespent": null,
      "reporter": {
        "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
        "name": "lfranchi",
        "emailAddress": "othello@zulip.com",
        "avatarUrls": {
          "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
          "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leo Franchi",
        "active": true
      },
      "aggregatetimeoriginalestimate": null,
      "created": "2013-03-27T16:53:58.301+0000",
      "updated": "2013-03-27T16:57:45.287+0000",
      "description": "Fix me please",
      "priority": {
        "self": "http://lfranchi.com:8080/rest/api/2/priority/3",
        "iconUrl": "http://lfranchi.com:8080/images/icons/priority_major.gif",
        "name": "Major",
        "id": "3"
      },
      "duedate": null,
      "issuelinks": [],
      "watches": {
        "self": "http://lfranchi.com:8080/rest/api/2/issue/BUG-15/watchers",
        "watchCount": 1,
        "isWatching": true
      },
      "worklog": {
        "startAt": 0,
        "maxResults": 0,
        "total": 0,
        "worklogs": []
      },
      "customfield_10000": null,
      "subtasks": [],
      "status": {
        "self": "http://lfranchi.com:8080/rest/api/2/status/1",
        "description": "The issue is open and ready for the assignee to start work on it.",
        "iconUrl": "http://lfranchi.com:8080/images/icons/status_open.gif",
        "name": "Open",
        "id": "1"
      },
      "labels": [],
      "workratio": -1,
      "assignee": {
        "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
        "name": "lfranchi",
        "emailAddress": "othello@zulip.com",
        "avatarUrls": {
          "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
          "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leo Franchi",
        "active": true
      },
      "attachment": [],
      "aggregatetimeestimate": null,
      "project": {
        "self": "http://lfranchi.com:8080/rest/api/2/project/BUG",
        "id": "10000",
        "key": "BUG",
        "name": "buggery-test",
        "avatarUrls": {
          "16x16": "http://lfranchi.com:8080/secure/projectavatar?size=small&pid=10000&avatarId=10011",
          "48x48": "http://lfranchi.com:8080/secure/projectavatar?pid=10000&avatarId=10011"
        }
      },
      "versions": [],
      "environment": null,
      "timeestimate": null,
      "aggregateprogress": {
        "progress": 0,
        "total": 0
      },
      "lastViewed": "2013-03-27T16:57:45.258+0000",
      "components": [],
      "comment": {
        "startAt": 0,
        "maxResults": 0,
        "total": 0,
        "comments": []
      },
      "timeoriginalestimate": null,
      "aggregatetimespent": null
    }
  },
  "changelog": {
    "id": "10600",
    "items": [
      {
        "field": "assignee",
        "fieldtype": "jira",
        "from": null,
        "fromString": null,
        "to": "lfranchi",
        "toString": "Leo Franchi"
      }
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: unknown_v1.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/unknown_v1.json

```json
{
  "webhookEvent": "jira:issue_unknown",
  "timestamp": 1364403934253,
  "user": {
    "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
    "name": "lfranchi",
    "emailAddress": "othello@zulip.com",
    "avatarUrls": {
      "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
      "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
    },
    "displayName": "Leo Franchi",
    "active": true
  },
  "issue": {
    "id": "10400",
    "self": "http://lfranchi.com:8080/rest/api/2/issue/10400",
    "key": "BUG-15",
    "fields": {
      "summary": "New bug with hook",
      "progress": {
        "progress": 0,
        "total": 0
      },
      "timetracking": {},
      "issuetype": {
        "self": "http://lfranchi.com:8080/rest/api/2/issuetype/1",
        "id": "1",
        "description": "A problem which impairs or prevents the functions of the product.",
        "iconUrl": "http://lfranchi.com:8080/images/icons/bug.gif",
        "name": "Bug",
        "subtask": false
      },
      "votes": {
        "self": "http://lfranchi.com:8080/rest/api/2/issue/BUG-15/votes",
        "votes": 0,
        "hasVoted": false
      },
      "resolution": null,
      "fixVersions": [],
      "resolutiondate": null,
      "timespent": null,
      "reporter": {
        "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
        "name": "lfranchi",
        "emailAddress": "othello@zulip.com",
        "avatarUrls": {
          "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
          "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leo Franchi",
        "active": true
      },
      "aggregatetimeoriginalestimate": null,
      "created": "2013-03-27T16:53:58.301+0000",
      "updated": "2013-03-27T16:57:45.287+0000",
      "description": "Fix me please",
      "priority": {
        "self": "http://lfranchi.com:8080/rest/api/2/priority/3",
        "iconUrl": "http://lfranchi.com:8080/images/icons/priority_major.gif",
        "name": "Major",
        "id": "3"
      },
      "duedate": null,
      "issuelinks": [],
      "watches": {
        "self": "http://lfranchi.com:8080/rest/api/2/issue/BUG-15/watchers",
        "watchCount": 1,
        "isWatching": true
      },
      "worklog": {
        "startAt": 0,
        "maxResults": 0,
        "total": 0,
        "worklogs": []
      },
      "customfield_10000": null,
      "subtasks": [],
      "status": {
        "self": "http://lfranchi.com:8080/rest/api/2/status/1",
        "description": "The issue is open and ready for the assignee to start work on it.",
        "iconUrl": "http://lfranchi.com:8080/images/icons/status_open.gif",
        "name": "Open",
        "id": "1"
      },
      "labels": [],
      "workratio": -1,
      "assignee": {
        "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
        "name": "lfranchi",
        "emailAddress": "othello@zulip.com",
        "avatarUrls": {
          "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
          "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leo Franchi",
        "active": true
      },
      "attachment": [],
      "aggregatetimeestimate": null,
      "project": {
        "self": "http://lfranchi.com:8080/rest/api/2/project/BUG",
        "id": "10000",
        "key": "BUG",
        "name": "buggery-test",
        "avatarUrls": {
          "16x16": "http://lfranchi.com:8080/secure/projectavatar?size=small&pid=10000&avatarId=10011",
          "48x48": "http://lfranchi.com:8080/secure/projectavatar?pid=10000&avatarId=10011"
        }
      },
      "versions": [],
      "environment": null,
      "timeestimate": null,
      "aggregateprogress": {
        "progress": 0,
        "total": 0
      },
      "lastViewed": "2013-03-27T16:57:45.258+0000",
      "components": [],
      "comment": {
        "startAt": 0,
        "maxResults": 1,
        "total": 1,
        "comments": [
          {
            "self": "http://lfranchi.com:8080/rest/api/2/issue/10400/comment/10400",
            "id": "10400",
            "author": {
              "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
              "name": "lfranchi",
              "emailAddress": "othello@zulip.com",
              "avatarUrls": {
                "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
                "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leo Franchi",
              "active": true
            },
            "body": "Adding a comment. Oh, what a comment it is!",
            "updateAuthor": {
              "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
              "name": "lfranchi",
              "emailAddress": "othello@zulip.com",
              "avatarUrls": {
                "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
                "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leo Franchi",
              "active": true
            },
            "created": "2013-03-27T17:05:34.250+0000",
            "updated": "2013-03-27T17:05:34.250+0000"
          }
        ]
      },
      "timeoriginalestimate": null,
      "aggregatetimespent": null
    }
  },
  "comment": {
    "self": "http://lfranchi.com:8080/rest/api/2/issue/10400/comment/10400",
    "id": "10400",
    "author": {
      "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
      "name": "lfranchi",
      "emailAddress": "othello@zulip.com",
      "avatarUrls": {
        "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
        "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
      },
      "displayName": "Leo Franchi",
      "active": true
    },
    "body": "Adding a comment. Oh, what a comment it is!",
    "updateAuthor": {
      "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
      "name": "lfranchi",
      "emailAddress": "othello@zulip.com",
      "avatarUrls": {
        "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
        "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
      },
      "displayName": "Leo Franchi",
      "active": true
    },
    "created": "2013-03-27T17:05:34.250+0000",
    "updated": "2013-03-27T17:05:34.250+0000"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: unknown_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/unknown_v2.json

```json
{
  "webhookEvent": "jira:issue_unknown",
  "issue_event_type_name":"issue_unknown",
  "timestamp": 1364403934253,
  "user": {
    "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
    "name": "lfranchi",
    "emailAddress": "othello@zulip.com",
    "avatarUrls": {
      "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
      "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
    },
    "displayName": "Leo Franchi",
    "active": true
  },
  "issue": {
    "id": "10400",
    "self": "http://lfranchi.com:8080/rest/api/2/issue/10400",
    "key": "BUG-15",
    "fields": {
      "summary": "New bug with hook",
      "progress": {
        "progress": 0,
        "total": 0
      },
      "timetracking": {},
      "issuetype": {
        "self": "http://lfranchi.com:8080/rest/api/2/issuetype/1",
        "id": "1",
        "description": "A problem which impairs or prevents the functions of the product.",
        "iconUrl": "http://lfranchi.com:8080/images/icons/bug.gif",
        "name": "Bug",
        "subtask": false
      },
      "votes": {
        "self": "http://lfranchi.com:8080/rest/api/2/issue/BUG-15/votes",
        "votes": 0,
        "hasVoted": false
      },
      "resolution": null,
      "fixVersions": [],
      "resolutiondate": null,
      "timespent": null,
      "reporter": {
        "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
        "name": "lfranchi",
        "emailAddress": "othello@zulip.com",
        "avatarUrls": {
          "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
          "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leo Franchi",
        "active": true
      },
      "aggregatetimeoriginalestimate": null,
      "created": "2013-03-27T16:53:58.301+0000",
      "updated": "2013-03-27T16:57:45.287+0000",
      "description": "Fix me please",
      "priority": {
        "self": "http://lfranchi.com:8080/rest/api/2/priority/3",
        "iconUrl": "http://lfranchi.com:8080/images/icons/priority_major.gif",
        "name": "Major",
        "id": "3"
      },
      "duedate": null,
      "issuelinks": [],
      "watches": {
        "self": "http://lfranchi.com:8080/rest/api/2/issue/BUG-15/watchers",
        "watchCount": 1,
        "isWatching": true
      },
      "worklog": {
        "startAt": 0,
        "maxResults": 0,
        "total": 0,
        "worklogs": []
      },
      "customfield_10000": null,
      "subtasks": [],
      "status": {
        "self": "http://lfranchi.com:8080/rest/api/2/status/1",
        "description": "The issue is open and ready for the assignee to start work on it.",
        "iconUrl": "http://lfranchi.com:8080/images/icons/status_open.gif",
        "name": "Open",
        "id": "1"
      },
      "labels": [],
      "workratio": -1,
      "assignee": {
        "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
        "name": "lfranchi",
        "emailAddress": "othello@zulip.com",
        "avatarUrls": {
          "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
          "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leo Franchi",
        "active": true
      },
      "attachment": [],
      "aggregatetimeestimate": null,
      "project": {
        "self": "http://lfranchi.com:8080/rest/api/2/project/BUG",
        "id": "10000",
        "key": "BUG",
        "name": "buggery-test",
        "avatarUrls": {
          "16x16": "http://lfranchi.com:8080/secure/projectavatar?size=small&pid=10000&avatarId=10011",
          "48x48": "http://lfranchi.com:8080/secure/projectavatar?pid=10000&avatarId=10011"
        }
      },
      "versions": [],
      "environment": null,
      "timeestimate": null,
      "aggregateprogress": {
        "progress": 0,
        "total": 0
      },
      "lastViewed": "2013-03-27T16:57:45.258+0000",
      "components": [],
      "comment": {
        "startAt": 0,
        "maxResults": 1,
        "total": 1,
        "comments": [
          {
            "self": "http://lfranchi.com:8080/rest/api/2/issue/10400/comment/10400",
            "id": "10400",
            "author": {
              "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
              "name": "lfranchi",
              "emailAddress": "othello@zulip.com",
              "avatarUrls": {
                "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
                "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leo Franchi",
              "active": true
            },
            "body": "Adding a comment. Oh, what a comment it is!",
            "updateAuthor": {
              "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
              "name": "lfranchi",
              "emailAddress": "othello@zulip.com",
              "avatarUrls": {
                "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
                "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leo Franchi",
              "active": true
            },
            "created": "2013-03-27T17:05:34.250+0000",
            "updated": "2013-03-27T17:05:34.250+0000"
          }
        ]
      },
      "timeoriginalestimate": null,
      "aggregatetimespent": null
    }
  },
  "comment": {
    "self": "http://lfranchi.com:8080/rest/api/2/issue/10400/comment/10400",
    "id": "10400",
    "author": {
      "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
      "name": "lfranchi",
      "emailAddress": "othello@zulip.com",
      "avatarUrls": {
        "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
        "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
      },
      "displayName": "Leo Franchi",
      "active": true
    },
    "body": "Adding a comment. Oh, what a comment it is!",
    "updateAuthor": {
      "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
      "name": "lfranchi",
      "emailAddress": "othello@zulip.com",
      "avatarUrls": {
        "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
        "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
      },
      "displayName": "Leo Franchi",
      "active": true
    },
    "created": "2013-03-27T17:05:34.250+0000",
    "updated": "2013-03-27T17:05:34.250+0000"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: updated_priority_v1.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/updated_priority_v1.json

```json
{
  "webhookEvent": "jira:issue_updated",
  "user": {
    "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
    "name": "leo",
    "emailAddress": "leo@zulip.com",
    "avatarUrls": {
      "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
      "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
      "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
      "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
    },
    "displayName": "Leonardo Franchi [Administrator]",
    "active": true
  },
  "issue": {
    "id": "10000",
    "self": "https://zulipp.atlassian.net/rest/api/2/issue/10000",
    "key": "TEST-1",
    "fields": {
      "summary": "Fix That",
      "progress": {
        "progress": 0,
        "total": 0
      },
      "timetracking": {},
      "issuetype": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issuetype/2",
        "id": "2",
        "description": "A new feature of the product, which has yet to be developed.",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/issuetypes/newfeature.png",
        "name": "New Feature",
        "subtask": false
      },
      "timespent": null,
      "reporter": {
        "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
        "name": "leo",
        "emailAddress": "leo@zulip.com",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
          "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
          "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
          "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leonardo Franchi [Administrator]",
        "active": true
      },
      "created": "2013-09-06T11:07:19.972-0400",
      "updated": "2014-02-26T14:57:13.139-0500",
      "priority": {
        "self": "https://zulipp.atlassian.net/rest/api/2/priority/3",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/priorities/major.png",
        "name": "Major",
        "id": "3"
      },
      "description": "Please",
      "customfield_10001": null,
      "customfield_10002": null,
      "customfield_10003": null,
      "issuelinks": [],
      "customfield_10000": null,
      "subtasks": [],
      "customfield_10008": null,
      "customfield_10007": null,
      "status": {
        "self": "https://zulipp.atlassian.net/rest/api/2/status/10001",
        "description": "",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/statuses/open.png",
        "name": "To Do",
        "id": "10001",
        "statusCategory": {
          "self": "https://zulipp.atlassian.net/rest/api/2/statuscategory/2",
          "id": 2,
          "key": "new",
          "colorName": "blue-gray",
          "name": "New"
        }
      },
      "customfield_10006": "1",
      "labels": [],
      "workratio": -1,
      "project": {
        "self": "https://zulipp.atlassian.net/rest/api/2/project/10000",
        "id": "10000",
        "key": "TEST",
        "name": "TestProject",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/projectavatar?size=xsmall&pid=10000&avatarId=10011",
          "24x24": "https://zulipp.atlassian.net/secure/projectavatar?size=small&pid=10000&avatarId=10011",
          "32x32": "https://zulipp.atlassian.net/secure/projectavatar?size=medium&pid=10000&avatarId=10011",
          "48x48": "https://zulipp.atlassian.net/secure/projectavatar?pid=10000&avatarId=10011"
        }
      },
      "environment": null,
      "customfield_10014": null,
      "customfield_10015": null,
      "lastViewed": "2014-02-26T14:56:59.145-0500",
      "aggregateprogress": {
        "progress": 0,
        "total": 0
      },
      "customfield_10012": null,
      "components": [],
      "customfield_10013": null,
      "comment": {
        "startAt": 0,
        "maxResults": 1,
        "total": 1,
        "comments": [
          {
            "self": "https://zulipp.atlassian.net/rest/api/2/issue/10000/comment/10100",
            "id": "10100",
            "author": {
              "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
              "name": "leo",
              "emailAddress": "leo@zulip.com",
              "avatarUrls": {
                "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
                "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
                "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
                "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leonardo Franchi [Administrator]",
              "active": true
            },
            "body": "test",
            "updateAuthor": {
              "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
              "name": "leo",
              "emailAddress": "leo@zulip.com",
              "avatarUrls": {
                "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
                "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
                "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
                "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leonardo Franchi [Administrator]",
              "active": true
            },
            "created": "2014-02-26T14:55:10.416-0500",
            "updated": "2014-02-26T14:55:10.416-0500"
          }
        ]
      },
      "timeoriginalestimate": null,
      "customfield_10017": null,
      "customfield_10016": null,
      "customfield_10019": null,
      "customfield_10018": null,
      "votes": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-1/votes",
        "votes": 0,
        "hasVoted": false
      },
      "fixVersions": [],
      "resolution": null,
      "resolutiondate": null,
      "creator": {
        "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
        "name": "leo",
        "emailAddress": "leo@zulip.com",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
          "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
          "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
          "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leonardo Franchi [Administrator]",
        "active": true
      },
      "aggregatetimeoriginalestimate": null,
      "duedate": null,
      "customfield_10020": null,
      "customfield_10021": "Not Started",
      "watches": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-1/watchers",
        "watchCount": 1,
        "isWatching": true
      },
      "worklog": {
        "startAt": 0,
        "maxResults": 20,
        "total": 0,
        "worklogs": []
      },
      "assignee": {
        "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
        "name": "leo",
        "emailAddress": "leo@zulip.com",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
          "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
          "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
          "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leonardo Franchi [Administrator]",
        "active": true
      },
      "attachment": [],
      "aggregatetimeestimate": null,
      "versions": [],
      "timeestimate": null,
      "aggregatetimespent": null
    }
  },
  "changelog": {
    "id": "10102",
    "items": [
      {
        "field": "priority",
        "fieldtype": "jira",
        "from": "2",
        "fromString": "Critical",
        "to": "3",
        "toString": "Major"
      }
    ]
  },
  "timestamp": 1393444633145
}
```

--------------------------------------------------------------------------------

---[FILE: updated_priority_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/updated_priority_v2.json

```json
{
  "webhookEvent": "jira:issue_updated",
  "issue_event_type_name":"issue_updated",
  "user": {
    "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
    "name": "leo",
    "emailAddress": "leo@zulip.com",
    "avatarUrls": {
      "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
      "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
      "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
      "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
    },
    "displayName": "Leonardo Franchi [Administrator]",
    "active": true
  },
  "issue": {
    "id": "10000",
    "self": "https://zulipp.atlassian.net/rest/api/2/issue/10000",
    "key": "TEST-1",
    "fields": {
      "summary": "Fix That",
      "progress": {
        "progress": 0,
        "total": 0
      },
      "timetracking": {},
      "issuetype": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issuetype/2",
        "id": "2",
        "description": "A new feature of the product, which has yet to be developed.",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/issuetypes/newfeature.png",
        "name": "New Feature",
        "subtask": false
      },
      "timespent": null,
      "reporter": {
        "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
        "name": "leo",
        "emailAddress": "leo@zulip.com",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
          "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
          "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
          "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leonardo Franchi [Administrator]",
        "active": true
      },
      "created": "2013-09-06T11:07:19.972-0400",
      "updated": "2014-02-26T14:57:13.139-0500",
      "priority": {
        "self": "https://zulipp.atlassian.net/rest/api/2/priority/3",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/priorities/major.png",
        "name": "Major",
        "id": "3"
      },
      "description": "Please",
      "customfield_10001": null,
      "customfield_10002": null,
      "customfield_10003": null,
      "issuelinks": [],
      "customfield_10000": null,
      "subtasks": [],
      "customfield_10008": null,
      "customfield_10007": null,
      "status": {
        "self": "https://zulipp.atlassian.net/rest/api/2/status/10001",
        "description": "",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/statuses/open.png",
        "name": "To Do",
        "id": "10001",
        "statusCategory": {
          "self": "https://zulipp.atlassian.net/rest/api/2/statuscategory/2",
          "id": 2,
          "key": "new",
          "colorName": "blue-gray",
          "name": "New"
        }
      },
      "customfield_10006": "1",
      "labels": [],
      "workratio": -1,
      "project": {
        "self": "https://zulipp.atlassian.net/rest/api/2/project/10000",
        "id": "10000",
        "key": "TEST",
        "name": "TestProject",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/projectavatar?size=xsmall&pid=10000&avatarId=10011",
          "24x24": "https://zulipp.atlassian.net/secure/projectavatar?size=small&pid=10000&avatarId=10011",
          "32x32": "https://zulipp.atlassian.net/secure/projectavatar?size=medium&pid=10000&avatarId=10011",
          "48x48": "https://zulipp.atlassian.net/secure/projectavatar?pid=10000&avatarId=10011"
        }
      },
      "environment": null,
      "customfield_10014": null,
      "customfield_10015": null,
      "lastViewed": "2014-02-26T14:56:59.145-0500",
      "aggregateprogress": {
        "progress": 0,
        "total": 0
      },
      "customfield_10012": null,
      "components": [],
      "customfield_10013": null,
      "comment": {
        "startAt": 0,
        "maxResults": 1,
        "total": 1,
        "comments": [
          {
            "self": "https://zulipp.atlassian.net/rest/api/2/issue/10000/comment/10100",
            "id": "10100",
            "author": {
              "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
              "name": "leo",
              "emailAddress": "leo@zulip.com",
              "avatarUrls": {
                "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
                "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
                "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
                "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leonardo Franchi [Administrator]",
              "active": true
            },
            "body": "test",
            "updateAuthor": {
              "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
              "name": "leo",
              "emailAddress": "leo@zulip.com",
              "avatarUrls": {
                "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
                "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
                "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
                "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
              },
              "displayName": "Leonardo Franchi [Administrator]",
              "active": true
            },
            "created": "2014-02-26T14:55:10.416-0500",
            "updated": "2014-02-26T14:55:10.416-0500"
          }
        ]
      },
      "timeoriginalestimate": null,
      "customfield_10017": null,
      "customfield_10016": null,
      "customfield_10019": null,
      "customfield_10018": null,
      "votes": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-1/votes",
        "votes": 0,
        "hasVoted": false
      },
      "fixVersions": [],
      "resolution": null,
      "resolutiondate": null,
      "creator": {
        "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
        "name": "leo",
        "emailAddress": "leo@zulip.com",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
          "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
          "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
          "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leonardo Franchi [Administrator]",
        "active": true
      },
      "aggregatetimeoriginalestimate": null,
      "duedate": null,
      "customfield_10020": null,
      "customfield_10021": "Not Started",
      "watches": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-1/watchers",
        "watchCount": 1,
        "isWatching": true
      },
      "worklog": {
        "startAt": 0,
        "maxResults": 20,
        "total": 0,
        "worklogs": []
      },
      "assignee": {
        "self": "https://zulipp.atlassian.net/rest/api/2/user?username=leo",
        "name": "leo",
        "emailAddress": "leo@zulip.com",
        "avatarUrls": {
          "16x16": "https://zulipp.atlassian.net/secure/useravatar?size=xsmall&avatarId=10122",
          "24x24": "https://zulipp.atlassian.net/secure/useravatar?size=small&avatarId=10122",
          "32x32": "https://zulipp.atlassian.net/secure/useravatar?size=medium&avatarId=10122",
          "48x48": "https://zulipp.atlassian.net/secure/useravatar?avatarId=10122"
        },
        "displayName": "Leonardo Franchi [Administrator]",
        "active": true
      },
      "attachment": [],
      "aggregatetimeestimate": null,
      "versions": [],
      "timeestimate": null,
      "aggregatetimespent": null
    }
  },
  "changelog": {
    "id": "10102",
    "items": [
      {
        "field": "priority",
        "fieldtype": "jira",
        "from": "2",
        "fromString": "Critical",
        "to": "3",
        "toString": "Major"
      }
    ]
  },
  "timestamp": 1393444633145
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/jotform/doc.md

```text
# Zulip Jotform integration

Get Zulip notifications for your Jotform responses!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In the **Form Builder** on Jotform, go to **Settings**. Click on
   **INTEGRATIONS**. Search for and select **WebHooks**.

1. Paste the URL generated above into the field, and click
   **COMPLETE INTEGRATION**.

!!! tip ""

    By default, the form's title will be used as the Zulip topic.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/jotform/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/jotform/tests.py

```python
from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase
from zerver.lib.webhooks.common import parse_multipart_string


class JotformHookTests(WebhookTestCase):
    CHANNEL_NAME = "test"
    URL_TEMPLATE = "/api/v1/external/jotform?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "jotform"

    def test_response(self) -> None:
        expected_title = "Tutor Appointment Form"
        expected_message = """
* **Student's Name**: Niloth P
* **Type of Tutoring**: Online Tutoring
* **Subject for Tutoring**: Math
* **Grade**: 12
* **Prior Tutoring?** No

* **Identity Proof**: [Student_ID_!_$&'()_,-.;=@[]^_`{}~ .png](https://www.jotform.com/uploads/UserNiloth/243231271343446/6111139644845227683/Student_ID_%21_%24%26%27%28%29_%2C-.%3B%3D%40%5B%5D%5E_%60%7B%7D~%20.png), [Driving.license.png](https://www.jotform.com/uploads/UserNiloth/243231271343446/6111139644845227684/Driving.license.png)

* **Reports**: [Report Card.pdf](https://www.jotform.com/uploads/UserNiloth/243231271343446/6111139644845227685/Report%20Card.pdf)""".strip()

        self.check_webhook(
            "response",
            expected_title,
            expected_message,
            content_type="multipart/form-data",
        )

    def test_screenshot_response(self) -> None:
        expected_title = "Feedback Form"
        expected_message = """
* **How often do you use the application?** Daily
* **How likely are you to recommend it to a friend on a scale of 0-10?** 9
* **Feedback**: The new personalized recommendations feature is great!

* **Upload images of your customized setup to get featured!**: [frontend setup.jpg](https://www.jotform.com/uploads/kolanuvarun739/243615086540051/6114090137116205381/frontend%20setup.jpg), [workflow.png](https://www.jotform.com/uploads/kolanuvarun739/243615086540051/6114090137116205381/workflow.png)""".strip()

        self.check_webhook(
            "screenshot_response",
            expected_title,
            expected_message,
            content_type="multipart/form-data",
        )

    def test_response_with_colon_comma_characters(self) -> None:
        expected_title = "Sample testing"
        expected_message = """
* **Key1 with colon: and comma, end**: Value1 with colon: and comma, end
* **Same Key**: Value 1
* **Same Key**: Value 2
* **Same Key-Value**: Same Key-Value
* **Value 2**: Value 3
* **Multiple Choice Question, options:**: Option; 1 Option2

* **File Upload with colon : and comma , end**: [error; frontend, UI.png](https://www.jotform.com/uploads/kolanuvarun739/243490908500051/6197916587414311452/error%3B%20frontend%2C%20UI.png), [Screenshot_20250331_201054.png](https://www.jotform.com/uploads/kolanuvarun739/243490908500051/6197916587414311452/Screenshot_20250331_201054.png)""".strip()

        self.check_webhook(
            "response_with_colon_comma_characters",
            expected_title,
            expected_message,
            content_type="multipart/form-data",
        )

    def test_bad_payload(self) -> None:
        with self.assertRaisesRegex(AssertionError, "Unable to handle Jotform payload"):
            self.check_webhook("response")

    @override
    def get_payload(self, fixture_name: str) -> dict[str, str]:
        body = self.webhook_fixture_data("jotform", fixture_name, file_type="multipart")
        return parse_multipart_string(body)
```

--------------------------------------------------------------------------------

````
