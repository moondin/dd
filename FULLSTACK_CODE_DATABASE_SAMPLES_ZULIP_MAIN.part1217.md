---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1217
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1217 of 1290)

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

---[FILE: commented_markup_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/commented_markup_v2.json

```json
{
  "webhookEvent": "jira:issue_updated",
  "issue_event_type_name":"issue_commented",
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
    "id": "10100",
    "self": "https://zulipp.atlassian.net/rest/api/2/issue/10100",
    "key": "TEST-7",
    "fields": {
      "summary": "Testing of rich text",
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
      "created": "2013-10-01T16:08:48.446-0400",
      "updated": "2013-10-01T16:16:47.821-0400",
      "priority": {
        "self": "https://zulipp.atlassian.net/rest/api/2/priority/3",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/priorities/major.png",
        "name": "Major",
        "id": "3"
      },
      "description": "h1. So this is a heading\r\n\r\nAnd some *bold* **and _bold_?\r\n\r\n{quote}\r\nsome stuff goes here\r\n{quote}",
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
        "id": "10001"
      },
      "customfield_10006": "7",
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
      "lastViewed": "2013-10-01T16:16:48.075-0400",
      "aggregateprogress": {
        "progress": 0,
        "total": 0
      },
      "customfield_10012": null,
      "components": [],
      "customfield_10013": null,
      "comment": {
        "startAt": 0,
        "maxResults": 3,
        "total": 3,
        "comments": [
          {
            "self": "https://zulipp.atlassian.net/rest/api/2/issue/10100/comment/10000",
            "id": "10000",
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
            "body": "Commenting that *this is important* and also _please italicize me_\r\n\r\nh2. Heading this all the way\r\n\r\nsome quote:\r\n\r\n{quote}\r\noh say can you see...\r\n{quote}",
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
            "created": "2013-10-01T16:11:07.615-0400",
            "updated": "2013-10-01T16:11:07.615-0400"
          },
          {
            "self": "https://zulipp.atlassian.net/rest/api/2/issue/10100/comment/10001",
            "id": "10001",
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
            "body": "*Rich Text* comment, with _italicized_ text,\r\n\r\nand including some\r\n\r\n{quote}\r\nquotations by yours truly\r\n{quote}",
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
            "created": "2013-10-01T16:16:47.821-0400",
            "updated": "2013-10-01T16:16:47.821-0400"
          },
          {
            "self": "https://zulipp.atlassian.net/rest/api/2/issue/10100/comment/10002",
            "id": "10002",
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
            "body": "This is a comment that likes to *exercise* a lot of _different_ {{conventions}} that {{jira uses}}.\r\n\r\n{noformat}\r\nthis code is not highlighted, but monospaced\r\n{noformat}\r\n\r\n{code:python}\r\ndef python():\r\n    print \"likes to be formatted\"\r\n{code}\r\n\r\n[http://www.google.com] is a bare link, and [Google|http://www.google.com] is given a title.\r\n\r\nThanks!\r\n\r\n{quote}\r\nSomeone said somewhere\r\n{quote}",
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
            "created": "2013-10-01T17:03:00.964-0400",
            "updated": "2013-10-01T17:03:00.964-0400"
          }
        ]
      },
      "timeoriginalestimate": null,
      "customfield_10017": null,
      "customfield_10016": null,
      "customfield_10019": null,
      "customfield_10018": null,
      "votes": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-7/votes",
        "votes": 0,
        "hasVoted": false
      },
      "fixVersions": [],
      "resolution": null,
      "resolutiondate": null,
      "aggregatetimeoriginalestimate": null,
      "duedate": null,
      "customfield_10020": null,
      "customfield_10021": "Not Started",
      "watches": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-7/watchers",
        "watchCount": 1,
        "isWatching": true
      },
      "worklog": {
        "startAt": 0,
        "maxResults": 20,
        "total": 0,
        "worklogs": []
      },
      "assignee": null,
      "attachment": [],
      "aggregatetimeestimate": null,
      "versions": [],
      "timeestimate": null,
      "aggregatetimespent": null
    }
  },
  "comment": {
    "self": "https://zulipp.atlassian.net/rest/api/2/issue/10100/comment/10002",
    "id": "10002",
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
    "body": "This is a comment that likes to *exercise* a lot of _different_ {{conventions}} that {{jira uses}}.\r\n\r\n{noformat}\r\nthis code is not highlighted, but monospaced\r\n{noformat}\r\n\r\n{code:python}\r\ndef python():\r\n    print \"likes to be formatted\"\r\n{code}\r\n\r\n[http://www.google.com] is a bare link, and [Google|http://www.google.com] is given a title.\r\n\r\nThanks!\r\n\r\n{quote}\r\nSomeone said somewhere\r\n{quote}",
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
    "created": "2013-10-01T17:03:00.964-0400",
    "updated": "2013-10-01T17:03:00.964-0400"
  },
  "timestamp": 1380661380969
}
```

--------------------------------------------------------------------------------

---[FILE: commented_v1.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/commented_v1.json

```json
{
  "webhookEvent": "jira:issue_updated",
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

---[FILE: commented_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/commented_v2.json

```json
{
  "webhookEvent": "jira:issue_updated",
  "issue_event_type_name":"issue_commented",
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

---[FILE: commented_v2_with_two_full_links.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/commented_v2_with_two_full_links.json

```json
{
  "webhookEvent": "jira:issue_updated",
  "issue_event_type_name":"issue_commented",
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
            "body": "This is the [first link|https://google.com] and this is the [second link|https://google.com] and this is the end.",
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
    "body": "This is the [first link|https://google.com] and this is the [second link|https://google.com] and this is the end.",
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

---[FILE: comment_created.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/comment_created.json

```json
{
  "timestamp": 1565964017153,
  "webhookEvent": "comment_created",
  "comment": {
    "self": "https://f20171170.atlassian.net/rest/api/2/issue/10000/comment/10000",
    "id": "10000",
    "author": {
      "self": "https://f20171170.atlassian.net/rest/api/2/user?accountId=5c76b994e1bcdf6294d0eb0f",
      "name": "admin",
      "key": "admin",
      "accountId": "5c76b994e1bcdf6294d0eb0f",
      "avatarUrls": {
        "48x48": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=48&s=48",
        "24x24": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=24&s=24",
        "16x16": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=16&s=16",
        "32x32": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=32&s=32"
      },
      "displayName": "Hemanth V. Alluri",
      "active": true,
      "timeZone": "Asia/Calcutta",
      "accountType": "atlassian"
    },
    "body": "Sounds like it’s pretty important. I’ll get this fixed ASAP\\!",
    "updateAuthor": {
      "self": "https://f20171170.atlassian.net/rest/api/2/user?accountId=5c76b994e1bcdf6294d0eb0f",
      "name": "admin",
      "key": "admin",
      "accountId": "5c76b994e1bcdf6294d0eb0f",
      "avatarUrls": {
        "48x48": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=48&s=48",
        "24x24": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=24&s=24",
        "16x16": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=16&s=16",
        "32x32": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=32&s=32"
      },
      "displayName": "Hemanth V. Alluri",
      "active": true,
      "timeZone": "Asia/Calcutta",
      "accountType": "atlassian"
    },
    "created": "2019-08-16T19:30:17.153+0530",
    "updated": "2019-08-16T19:30:17.153+0530",
    "jsdPublic": true
  },
  "issue": {
    "id": "10000",
    "self": "https://f20171170.atlassian.net/rest/api/2/issue/10000",
    "key": "SP-1",
    "fields": {
      "summary": "Add support for newer format Jira issue comment events",
      "issuetype": {
        "self": "https://f20171170.atlassian.net/rest/api/2/issuetype/10100",
        "id": "10100",
        "description": "A task that needs to be done.",
        "iconUrl": "https://f20171170.atlassian.net/secure/viewavatar?size=medium&avatarId=10318&avatarType=issuetype",
        "name": "Task",
        "subtask": false,
        "avatarId": 10318,
        "entityId": "7781fe72-66c8-43f7-b4cb-ef2482548605"
      },
      "project": {
        "self": "https://f20171170.atlassian.net/rest/api/2/project/10000",
        "id": "10000",
        "key": "SP",
        "name": "Sample Project",
        "projectTypeKey": "software",
        "simplified": true,
        "avatarUrls": {
          "48x48": "https://f20171170.atlassian.net/secure/projectavatar?pid=10000&avatarId=10410",
          "24x24": "https://f20171170.atlassian.net/secure/projectavatar?size=small&s=small&pid=10000&avatarId=10410",
          "16x16": "https://f20171170.atlassian.net/secure/projectavatar?size=xsmall&s=xsmall&pid=10000&avatarId=10410",
          "32x32": "https://f20171170.atlassian.net/secure/projectavatar?size=medium&s=medium&pid=10000&avatarId=10410"
        }
      },
      "assignee": {
        "self": "https://f20171170.atlassian.net/rest/api/2/user?accountId=5c76b994e1bcdf6294d0eb0f",
        "name": "admin",
        "key": "admin",
        "accountId": "5c76b994e1bcdf6294d0eb0f",
        "emailAddress": "f20171170@pilani.bits-pilani.ac.in",
        "avatarUrls": {
          "48x48": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=48&s=48",
          "24x24": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=24&s=24",
          "16x16": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=16&s=16",
          "32x32": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=32&s=32"
        },
        "displayName": "Hemanth V. Alluri",
        "active": true,
        "timeZone": "Asia/Calcutta",
        "accountType": "atlassian"
      },
      "priority": {
        "self": "https://f20171170.atlassian.net/rest/api/2/priority/3",
        "iconUrl": "https://f20171170.atlassian.net/images/icons/priorities/medium.svg",
        "name": "Medium",
        "id": "3"
      },
      "status": {
        "self": "https://f20171170.atlassian.net/rest/api/2/status/10000",
        "description": "",
        "iconUrl": "https://f20171170.atlassian.net/",
        "name": "To Do",
        "id": "10000",
        "statusCategory": {
          "self": "https://f20171170.atlassian.net/rest/api/2/statuscategory/2",
          "id": 2,
          "key": "new",
          "colorName": "blue-gray",
          "name": "To Do"
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
