---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1218
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1218 of 1290)

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

---[FILE: comment_created_no_issue_details.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/comment_created_no_issue_details.json

```json
{
  "timestamp": 1565964017153,
  "webhookEvent": "comment_created",
  "comment": {
    "self": "https://f20171170.atlassian.net/rest/api/2/issue/10000/comment/12000",
    "id": "12000",
    "author": {
      "self": "https://f20171170.atlassian.net/rest/api/2/user?accountId=5c76b994e1bcdf6294d0eb0f",
      "name": "admin",
      "key": "admin",
      "avatarUrls": {
        "48x48": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=48&s=48",
        "24x24": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=24&s=24",
        "16x16": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=16&s=16",
        "32x32": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=32&s=32"
      },
      "displayName": "Hemanth V. Alluri",
      "active": true,
      "timeZone": "Asia/Calcutta"
    },
    "body": "Sounds like it’s pretty important. I’ll get this fixed ASAP\\!",
    "updateAuthor": {
      "self": "https://f20171170.atlassian.net/rest/api/2/user?accountId=5c76b994e1bcdf6294d0eb0f",
      "name": "admin",
      "key": "admin",
      "avatarUrls": {
        "48x48": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=48&s=48",
        "24x24": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=24&s=24",
        "16x16": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=16&s=16",
        "32x32": "https://secure.gravatar.com/avatar/bc3f74559ceceb488f4189b7e7bdfec2?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHA-1.png&size=32&s=32"
      },
      "displayName": "Hemanth V. Alluri",
      "active": true,
      "timeZone": "Asia/Calcutta"
    },
    "created": "2019-08-16T19:30:17.153+0530",
    "updated": "2019-08-16T19:30:17.153+0530"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: comment_deleted.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/comment_deleted.json

```json
{
  "timestamp": 1565964144825,
  "webhookEvent": "comment_deleted",
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
    "body": "This is a very important issue\\! I’m on it\\!",
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
    "updated": "2019-08-16T19:31:43.489+0530",
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

---[FILE: comment_deleted_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/comment_deleted_v2.json

```json
{
   "timestamp":1483464729046,
   "webhookEvent":"jira:issue_updated",
   "issue_event_type_name":"issue_comment_deleted",
   "user":{
      "self":"https://zuliptomek.atlassian.net/rest/api/2/user?username=admin",
      "name":"admin",
      "key":"admin",
      "emailAddress":"kolaszek@go2.pl",
      "avatarUrls":{
         "48x48":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=48",
         "24x24":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=24",
         "16x16":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=16",
         "32x32":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=32"
      },
      "displayName":"Tomasz Kolek",
      "active":true,
      "timeZone":"Europe/Berlin"
   },
   "issue":{
      "id":"10000",
      "self":"https://zuliptomek.atlassian.net/rest/api/2/issue/10000",
      "key":"TOM-1",
      "fields":{
         "issuetype":{
            "self":"https://zuliptomek.atlassian.net/rest/api/2/issuetype/10100",
            "id":"10100",
            "description":"A user story. Created by JIRA Software - do not edit or delete.",
            "iconUrl":"https://zuliptomek.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype",
            "name":"Story",
            "subtask":false,
            "avatarId":10315
         },
         "timespent":null,
         "project":{
            "self":"https://zuliptomek.atlassian.net/rest/api/2/project/10000",
            "id":"10000",
            "key":"TOM",
            "name":"tomek",
            "avatarUrls":{
               "48x48":"https://zuliptomek.atlassian.net/secure/projectavatar?avatarId=10324",
               "24x24":"https://zuliptomek.atlassian.net/secure/projectavatar?size=small&avatarId=10324",
               "16x16":"https://zuliptomek.atlassian.net/secure/projectavatar?size=xsmall&avatarId=10324",
               "32x32":"https://zuliptomek.atlassian.net/secure/projectavatar?size=medium&avatarId=10324"
            }
         },
         "fixVersions":[

         ],
         "customfield_10110":null,
         "customfield_10111":null,
         "aggregatetimespent":null,
         "resolution":null,
         "customfield_10112":null,
         "customfield_10113":"Not started",
         "customfield_10114":null,
         "customfield_10104":null,
         "customfield_10105":null,
         "customfield_10106":null,
         "customfield_10107":null,
         "customfield_10108":null,
         "customfield_10109":null,
         "resolutiondate":null,
         "workratio":-1,
         "lastViewed":"2017-01-03T18:32:08.990+0100",
         "watches":{
            "self":"https://zuliptomek.atlassian.net/rest/api/2/issue/TOM-1/watchers",
            "watchCount":1,
            "isWatching":true
         },
         "created":"2016-12-31T15:08:29.213+0100",
         "priority":{
            "self":"https://zuliptomek.atlassian.net/rest/api/2/priority/1",
            "iconUrl":"https://zuliptomek.atlassian.net/images/icons/priorities/highest.svg",
            "name":"Highest",
            "id":"1"
         },
         "customfield_10100":null,
         "customfield_10101":null,
         "customfield_10102":null,
         "labels":[

         ],
         "customfield_10103":null,
         "timeestimate":null,
         "aggregatetimeoriginalestimate":null,
         "versions":[

         ],
         "issuelinks":[

         ],
         "assignee":{
            "self":"https://zuliptomek.atlassian.net/rest/api/2/user?username=admin",
            "name":"admin",
            "key":"admin",
            "emailAddress":"kolaszek@go2.pl",
            "avatarUrls":{
               "48x48":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=48",
               "24x24":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=24",
               "16x16":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=16",
               "32x32":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=32"
            },
            "displayName":"Tomasz Kolek",
            "active":true,
            "timeZone":"Europe/Berlin"
         },
         "updated":"2017-01-03T18:32:09.035+0100",
         "status":{
            "self":"https://zuliptomek.atlassian.net/rest/api/2/status/3",
            "description":"This issue is being actively worked on at the moment by the assignee.",
            "iconUrl":"https://zuliptomek.atlassian.net/images/icons/statuses/inprogress.png",
            "name":"In Progress",
            "id":"3",
            "statusCategory":{
               "self":"https://zuliptomek.atlassian.net/rest/api/2/statuscategory/4",
               "id":4,
               "key":"indeterminate",
               "colorName":"yellow",
               "name":"In Progress"
            }
         },
         "components":[

         ],
         "timeoriginalestimate":null,
         "description":"description",
         "timetracking":{

         },
         "customfield_10005":null,
         "attachment":[

         ],
         "aggregatetimeestimate":null,
         "summary":"New Issue",
         "creator":{
            "self":"https://zuliptomek.atlassian.net/rest/api/2/user?username=admin",
            "name":"admin",
            "key":"admin",
            "emailAddress":"kolaszek@go2.pl",
            "avatarUrls":{
               "48x48":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=48",
               "24x24":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=24",
               "16x16":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=16",
               "32x32":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=32"
            },
            "displayName":"Tomasz Kolek",
            "active":true,
            "timeZone":"Europe/Berlin"
         },
         "subtasks":[

         ],
         "reporter":{
            "self":"https://zuliptomek.atlassian.net/rest/api/2/user?username=admin",
            "name":"admin",
            "key":"admin",
            "emailAddress":"kolaszek@go2.pl",
            "avatarUrls":{
               "48x48":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=48",
               "24x24":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=24",
               "16x16":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=16",
               "32x32":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=32"
            },
            "displayName":"Tomasz Kolek",
            "active":true,
            "timeZone":"Europe/Berlin"
         },
         "customfield_10000":"{}",
         "aggregateprogress":{
            "progress":0,
            "total":0
         },
         "customfield_10001":null,
         "customfield_10115":null,
         "customfield_10116":"0|hzzzzz:",
         "customfield_10117":null,
         "environment":null,
         "duedate":null,
         "progress":{
            "progress":0,
            "total":0
         },
         "comment":{
            "comments":[
               {
                  "self":"https://zuliptomek.atlassian.net/rest/api/2/issue/10000/comment/10000",
                  "id":"10000",
                  "author":{
                     "self":"https://zuliptomek.atlassian.net/rest/api/2/user?username=admin",
                     "name":"admin",
                     "key":"admin",
                     "emailAddress":"kolaszek@go2.pl",
                     "avatarUrls":{
                        "48x48":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=48",
                        "24x24":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=24",
                        "16x16":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=16",
                        "32x32":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=32"
                     },
                     "displayName":"Tomasz Kolek",
                     "active":true,
                     "timeZone":"Europe/Berlin"
                  },
                  "body":"Tomek",
                  "updateAuthor":{
                     "self":"https://zuliptomek.atlassian.net/rest/api/2/user?username=admin",
                     "name":"admin",
                     "key":"admin",
                     "emailAddress":"kolaszek@go2.pl",
                     "avatarUrls":{
                        "48x48":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=48",
                        "24x24":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=24",
                        "16x16":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=16",
                        "32x32":"https://secure.gravatar.com/avatar/29cc55c8d02bff270b590900c6796ff1?d=mm&s=32"
                     },
                     "displayName":"Tomasz Kolek",
                     "active":true,
                     "timeZone":"Europe/Berlin"
                  },
                  "created":"2017-01-02T18:14:50.475+0100",
                  "updated":"2017-01-02T18:14:50.475+0100"
               }
            ],
            "maxResults":1,
            "total":1,
            "startAt":0
         },
         "votes":{
            "self":"https://zuliptomek.atlassian.net/rest/api/2/issue/TOM-1/votes",
            "votes":0,
            "hasVoted":false
         },
         "worklog":{
            "startAt":0,
            "maxResults":20,
            "total":0,
            "worklogs":[

            ]
         }
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: comment_edited_v2.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/comment_edited_v2.json

```json
{
  "webhookEvent": "jira:issue_updated",
  "issue_event_type_name":"issue_comment_edited",
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

---[FILE: comment_updated.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/comment_updated.json

```json
{
  "timestamp": 1565964103489,
  "webhookEvent": "comment_updated",
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
    "body": "This is a very important issue\\! I’m on it\\!",
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
    "updated": "2019-08-16T19:31:43.489+0530",
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

---[FILE: created_assignee_v1.json]---
Location: zulip-main/zerver/webhooks/jira/fixtures/created_assignee_v1.json

```json
{
  "webhookEvent": "jira:issue_created",
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

````
