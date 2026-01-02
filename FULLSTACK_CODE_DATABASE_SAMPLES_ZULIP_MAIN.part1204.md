---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1204
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1204 of 1290)

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

---[FILE: push_hook__push_commits_more_than_limit.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/push_hook__push_commits_more_than_limit.json

```json
{
   "object_kind":"push",
   "event_name":"push",
   "before":"5fcdd5551fc3085df79bece2c32b1400802ac407",
   "after":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
   "ref":"refs/heads/tomek",
   "checkout_sha":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
   "message":null,
   "user_id":670043,
   "user_name":"Tomasz Kolek",
   "user_email":"tomaszkolek0@gmail.com",
   "user_avatar":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon",
   "project_id":1534233,
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "commits":[
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      }
   ],
   "total_commits_count":2,
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "visibility_level":0
   }
}
```

--------------------------------------------------------------------------------

---[FILE: push_hook__push_local_branch_without_commits.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/push_hook__push_local_branch_without_commits.json

```json
{
    "object_kind":"push",
    "event_name":"push",
    "before":"0000000000000000000000000000000000000000",
    "after":"68d7a5528cf423dfaac37dd62a56ac9cc8a884e3",
    "ref":"refs/heads/changes",
    "checkout_sha":"68d7a5528cf423dfaac37dd62a56ac9cc8a884e3",
    "message":null,
    "user_id":1129123,
    "user_name":"Eeshan Garg",
    "user_email":"jerryguitarist@gmail.com",
    "user_avatar":"https://secure.gravatar.com/avatar/cd181af88d928dab53c55600c9f7551d?s=80\u0026d=identicon",
    "project_id":3319043,
    "project":{
        "name":"my-awesome-project",
        "description":"",
        "web_url":"https://gitlab.com/eeshangarg/my-awesome-project",
        "avatar_url":null,
        "git_ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "git_http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git",
        "namespace":"eeshangarg",
        "visibility_level":20,
        "path_with_namespace":"eeshangarg/my-awesome-project",
        "default_branch":"feature",
        "homepage":"https://gitlab.com/eeshangarg/my-awesome-project",
        "url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git"
    },
    "commits":[

    ],
    "total_commits_count":0,
    "repository":{
        "name":"my-awesome-project",
        "url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "description":"",
        "homepage":"https://gitlab.com/eeshangarg/my-awesome-project",
        "git_http_url":"https://gitlab.com/eeshangarg/my-awesome-project.git",
        "git_ssh_url":"git@gitlab.com:eeshangarg/my-awesome-project.git",
        "visibility_level":20
    }
}
```

--------------------------------------------------------------------------------

---[FILE: push_hook__push_multiple_committers.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/push_hook__push_multiple_committers.json

```json
{
   "object_kind":"push",
   "event_name":"push",
   "before":"5fcdd5551fc3085df79bece2c32b1400802ac407",
   "after":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
   "ref":"refs/heads/tomek",
   "checkout_sha":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
   "message":null,
   "user_id":670043,
   "user_name":"Tomasz Kolek",
   "user_email":"tomaszkolek0@gmail.com",
   "user_avatar":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon",
   "project_id":1534233,
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "commits":[
      {
         "id":"66abd2da28809ffa128ed0447965cf11d7f863a7",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/66abd2da28809ffa128ed0447965cf11d7f863a7",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "message":"c\n",
         "timestamp":"2016-08-17T21:18:06+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "author":{
            "name":"Ben",
            "email":"ben@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      }
   ],
   "total_commits_count":2,
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "visibility_level":0
   }
}
```

--------------------------------------------------------------------------------

---[FILE: push_hook__push_multiple_committers_with_others.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/push_hook__push_multiple_committers_with_others.json

```json
{
   "object_kind":"push",
   "event_name":"push",
   "before":"5fcdd5551fc3085df79bece2c32b1400802ac407",
   "after":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
   "ref":"refs/heads/tomek",
   "checkout_sha":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
   "message":null,
   "user_id":670043,
   "user_name":"Tomasz Kolek",
   "user_email":"tomaszkolek0@gmail.com",
   "user_avatar":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon",
   "project_id":1534233,
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "commits":[
      {
         "id":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "message":"b\n",
         "timestamp":"2016-08-17T21:17:54+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "author":{
            "name":"Tomasz Kolek",
            "email":"tomasz-kolek@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
      {
         "id":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "message":"b\n",
         "timestamp":"2016-08-17T21:18:06+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "author":{
            "name":"Ben",
            "email":"ben@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
       {
         "id":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "message":"b\n",
         "timestamp":"2016-08-17T21:18:06+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "author":{
            "name":"Ben",
            "email":"ben@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
       {
         "id":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "message":"b\n",
         "timestamp":"2016-08-17T21:18:06+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "author":{
            "name":"Ben",
            "email":"ben@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
       {
         "id":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "message":"b\n",
         "timestamp":"2016-08-17T21:18:06+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "author":{
            "name":"James",
            "email":"james@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
       {
         "id":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "message":"b\n",
         "timestamp":"2016-08-17T21:18:06+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "author":{
            "name":"baxterthehacker",
            "email":"bax@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      },
       {
         "id":"eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "message":"b\n",
         "timestamp":"2016-08-17T21:18:06+02:00",
         "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/commit/eb6ae1e591e0819dc5bf187c6bfe18ec065a80e9",
         "author":{
            "name":"baxterthehacker",
            "email":"bax@o2.pl"
         },
         "added":[

         ],
         "modified":[
            "a.txt"
         ],
         "removed":[

         ]
      }
   ],
   "total_commits_count":5,
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek/my-awesome-project.git",
      "description":"",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "visibility_level":0
   }
}
```

--------------------------------------------------------------------------------

---[FILE: push_hook__remove_branch.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/push_hook__remove_branch.json

```json
{
   "object_kind":"push",
   "event_name":"push",
   "before":"68595bc36ba5561c86c73c34ca7a3aae5a0dcfd8",
   "after":"0000000000000000000000000000000000000000",
   "ref":"refs/heads/tomek",
   "checkout_sha":null,
   "message":null,
   "user_id":745906,
   "user_name":"Tomasz Kolek",
   "user_email":"tomasz-kolek@go2.pl",
   "user_avatar":"https://secure.gravatar.com/avatar/c80a7a8454ed7d9e3c5618f1748385c2?s=80\u0026d=identicon",
   "project_id":1740047,
   "project":{
      "name":"my-awesome-project",
      "description":"abc",
      "web_url":"https://gitlab.com/TomaszKolek/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:TomaszKolek/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/TomaszKolek/my-awesome-project.git",
      "namespace":"TomaszKolek",
      "visibility_level":20,
      "path_with_namespace":"TomaszKolek/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/TomaszKolek/my-awesome-project",
      "url":"git@gitlab.com:TomaszKolek/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:TomaszKolek/my-awesome-project.git",
      "http_url":"https://gitlab.com/TomaszKolek/my-awesome-project.git"
   },
   "commits":[

   ],
   "total_commits_count":0,
   "repository":{
      "name":"my-awesome-project",
      "url":"git@gitlab.com:TomaszKolek/my-awesome-project.git",
      "description":"abc",
      "homepage":"https://gitlab.com/TomaszKolek/my-awesome-project",
      "git_http_url":"https://gitlab.com/TomaszKolek/my-awesome-project.git",
      "git_ssh_url":"git@gitlab.com:TomaszKolek/my-awesome-project.git",
      "visibility_level":20
   }
}
```

--------------------------------------------------------------------------------

````
