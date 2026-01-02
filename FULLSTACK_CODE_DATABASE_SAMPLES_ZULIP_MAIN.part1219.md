---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1219
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1219 of 1290)

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

---[FILE: created_assignee_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/created_assignee_v2.json

```json
{
  "webhookEvent": "jira:issue_created",
  "issue_event_type_name":"issue_created",
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
    "id": "10003",
    "self": "https://zulipp.atlassian.net/rest/api/2/issue/10003",
    "key": "TEST-4",
    "fields": {
      "summary": "Test Created Assignee",
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
      "created": "2013-09-06T11:20:24.101-0400",
      "updated": "2013-09-06T11:20:24.101-0400",
      "priority": {
        "self": "https://zulipp.atlassian.net/rest/api/2/priority/3",
        "iconUrl": "https://zulipp.atlassian.net/images/icons/priorities/major.png",
        "name": "Major",
        "id": "3"
      },
      "description": "This is the description, so descriptive it is",
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
      "customfield_10006": "4",
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
      "lastViewed": null,
      "aggregateprogress": {
        "progress": 0,
        "total": 0
      },
      "customfield_10012": null,
      "components": [],
      "customfield_10013": null,
      "comment": {
        "startAt": 0,
        "maxResults": 0,
        "total": 0,
        "comments": []
      },
      "timeoriginalestimate": null,
      "customfield_10017": null,
      "customfield_10016": null,
      "customfield_10019": null,
      "customfield_10018": null,
      "votes": {
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-4/votes",
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
        "self": "https://zulipp.atlassian.net/rest/api/2/issue/TEST-4/watchers",
        "watchCount": 0,
        "isWatching": false
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
  "timestamp": 1378480824183
}
```

--------------------------------------------------------------------------------

---[FILE: created_v1.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/created_v1.json

```json
{
  "webhookEvent": "jira:issue_created",
  "timestamp": 1364403238369,
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
      "updated": "2013-03-27T16:53:58.301+0000",
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
        "watchCount": 0,
        "isWatching": false
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
      "assignee": null,
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
      "lastViewed": null,
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
  }
}
```

--------------------------------------------------------------------------------

---[FILE: created_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/created_v2.json

```json
{
  "webhookEvent": "jira:issue_created",
  "issue_event_type_name":"issue_created",
  "timestamp": 1364403238369,
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
      "updated": "2013-03-27T16:53:58.301+0000",
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
        "watchCount": 0,
        "isWatching": false
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
      "assignee": null,
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
      "lastViewed": null,
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
  }
}
```

--------------------------------------------------------------------------------

---[FILE: created_with_unicode_v1.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/created_with_unicode_v1.json

```json
{
  "webhookEvent": "jira:issue_created",
  "timestamp": 1364403238369,
  "user": {
    "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
    "name": "lfranchi",
    "emailAddress": "othello@zulip.com",
    "avatarUrls": {
      "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
      "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
    },
    "displayName": "Leo Franchià",
    "active": true
  },
  "issue": {
    "id": "10400",
    "self": "http://lfranchi.com:8080/rest/api/2/issue/10400",
    "key": "BUG-15",
    "fields": {
      "summary": "New bug with à hook",
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
      "updated": "2013-03-27T16:53:58.301+0000",
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
        "watchCount": 0,
        "isWatching": false
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
      "assignee": null,
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
      "lastViewed": null,
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
  }
}
```

--------------------------------------------------------------------------------

---[FILE: created_with_unicode_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/created_with_unicode_v2.json

```json
{
  "webhookEvent": "jira:issue_created",
  "issue_event_type_name":"issue_created",
  "timestamp": 1364403238369,
  "user": {
    "self": "http://lfranchi.com:8080/rest/api/2/user?username=lfranchi",
    "name": "lfranchi",
    "emailAddress": "othello@zulip.com",
    "avatarUrls": {
      "16x16": "http://lfranchi.com:8080/secure/useravatar?size=small&avatarId=10122",
      "48x48": "http://lfranchi.com:8080/secure/useravatar?avatarId=10122"
    },
    "displayName": "Leo Franchià",
    "active": true
  },
  "issue": {
    "id": "10400",
    "self": "http://lfranchi.com:8080/rest/api/2/issue/10400",
    "key": "BUG-15",
    "fields": {
      "summary": "New bug with à hook",
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
      "updated": "2013-03-27T16:53:58.301+0000",
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
        "watchCount": 0,
        "isWatching": false
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
      "assignee": null,
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
      "lastViewed": null,
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
  }
}
```

--------------------------------------------------------------------------------

---[FILE: deleted_v1.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/deleted_v1.json

```json
{
  "webhookEvent": "jira:issue_deleted",
  "timestamp": 1364403969102,
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
      "updated": "2013-03-27T17:05:34.250+0000",
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
      "lastViewed": "2013-03-27T17:06:09.088+0000",
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
  }
}
```

--------------------------------------------------------------------------------

---[FILE: deleted_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/deleted_v2.json

```json
{
  "webhookEvent": "jira:issue_deleted",
  "issue_event_type_name":"issue_deleted",
  "timestamp": 1364403969102,
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
      "updated": "2013-03-27T17:05:34.250+0000",
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
      "lastViewed": "2013-03-27T17:06:09.088+0000",
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
  }
}
```

--------------------------------------------------------------------------------

---[FILE: example_anomalous_payload.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/example_anomalous_payload.json

```json
{
    "accountId": "1234asdfjlsweoiruoso",
    "username": "eeshangarg"
}
```

--------------------------------------------------------------------------------

---[FILE: reassigned_v1.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/reassigned_v1.json

```json
{
  "webhookEvent": "jira:issue_updated",
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

````
