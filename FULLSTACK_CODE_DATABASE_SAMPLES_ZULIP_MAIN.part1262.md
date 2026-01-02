---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1262
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1262 of 1290)

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

---[FILE: issue_created.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_created.json

```json
{
  "data": {
    "assigned_to": null,
    "tags": [],
    "modified_date": "2017-01-10T19:34:20.341Z",
    "created_date": "2017-01-10T19:34:20.303Z",
    "milestone": null,
    "subject": "New issue",
    "custom_attributes_values": {},
    "status": {
      "name": "New",
      "slug": "new",
      "is_closed": false,
      "id": 1192590,
      "color": "#8C2318"
    },
    "external_reference": null,
    "id": 511941,
    "project": {
      "name": "TomKol",
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol",
      "logo_big_url": null,
      "id": 170130
    },
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null,
      "id": 187698,
      "full_name": "TomaszKolek"
    },
    "description": "",
    "priority": {
      "name": "Normal",
      "id": 511600,
      "color": "#669933"
    },
    "watchers": [],
    "finished_date": null,
    "severity": {
      "name": "Normal",
      "id": 849622,
      "color": "#0000FF"
    },
    "ref": 8,
    "type": {
      "name": "Bug",
      "id": 514253,
      "color": "#89BAB4"
    }
  },
  "action": "create",
  "type": "issue",
  "date": "2017-01-10T19:34:20.534Z",
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null,
    "id": 187698,
    "full_name": "TomaszKolek"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_created_link.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_created_link.json

```json
{
    "action": "create",
    "type": "issue",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-06T17:00:01.314Z",
    "data": {
        "custom_attributes_values": {},
        "id": 1311625,
        "ref": 49,
        "created_date": "2020-02-06T17:00:01.089Z",
        "modified_date": "2020-02-06T17:00:01.123Z",
        "finished_date": null,
        "due_date": null,
        "due_date_reason": "",
        "subject": "Issues",
        "external_reference": null,
        "watchers": [],
        "description": "Issue",
        "tags": [],
        "permalink": "https://tree.taiga.io/project/orientor-sd/issue/49",
        "project": {
            "id": 351023,
            "permalink": "https://tree.taiga.io/project/orientor-sd",
            "name": "sd",
            "logo_big_url": null
        },
        "milestone": null,
        "owner": {
            "id": 404067,
            "permalink": "https://tree.taiga.io/profile/orientor",
            "username": "orientor",
            "full_name": "Aditya Verma",
            "photo": null,
            "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
        },
        "assigned_to": null,
        "status": {
            "id": 2460905,
            "name": "New",
            "slug": "new",
            "color": "#8C2318",
            "is_closed": false
        },
        "type": {
            "id": 1060463,
            "name": "Bug",
            "color": "#89BAB4"
        },
        "priority": {
            "id": 1055658,
            "name": "Normal",
            "color": "#669933"
        },
        "severity": {
            "id": 1753853,
            "name": "Normal",
            "color": "#0000FF"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_deleted.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_deleted.json

```json
{
  "action": "delete",
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "id": 187698,
    "full_name": "TomaszKolek",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null
  },
  "data": {
    "watchers": [
      187698
    ],
    "severity": {
      "name": "Minor",
      "color": "#669933",
      "id": 849621
    },
    "ref": 8,
    "id": 511941,
    "priority": {
      "name": "Low",
      "color": "#666666",
      "id": 511599
    },
    "project": {
      "name": "TomKol",
      "id": 170130,
      "logo_big_url": null,
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol"
    },
    "finished_date": null,
    "custom_attributes_values": null,
    "external_reference": null,
    "milestone": null,
    "description": "New description",
    "created_date": "2017-01-10T19:34:20.303Z",
    "modified_date": "2017-01-10T19:37:19.525Z",
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "id": 187698,
      "full_name": "TomaszKolek",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null
    },
    "subject": "New issue",
    "status": {
      "name": "In progress",
      "slug": "in-progress",
      "color": "#5E8C6A",
      "id": 1192591,
      "is_closed": false
    },
    "type": {
      "name": "Question",
      "color": "#ba89a8",
      "id": 514254
    },
    "tags": [],
    "assigned_to": null
  },
  "type": "issue",
  "date": "2017-01-10T19:37:43.262Z"
}
```

--------------------------------------------------------------------------------

---[FILE: relateduserstory_created.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/relateduserstory_created.json

```json
{
    "date":"2017-10-25T00:48:47.094Z",
    "by":{
        "photo":null,
        "permalink":"https://tree.taiga.io/profile/eeshangarg",
        "full_name":"Eeshan Garg",
        "username":"eeshangarg",
        "id":258659,
        "gravatar_id":"cd181af88d928dab53c55600c9f7551d"
    },
    "action":"create",
    "type":"relateduserstory",
    "data":{
        "epic":{
            "assigned_to":null,
            "description":"An epic about supporting epics!",
            "custom_attributes_values":{

            },
            "status":{
                "slug":"new",
                "id":1004969,
                "color":"#999999",
                "name":"New",
                "is_closed":false
            },
            "project":{
                "permalink":"https://tree.taiga.io/project/eeshangarg-zulip",
                "logo_big_url":null,
                "id":229096,
                "name":"Zulip"
            },
            "epics_order":1508892504131,
            "created_date":"2017-10-25T00:48:24.157Z",
            "team_requirement":false,
            "tags":[

            ],
            "id":50717,
            "subject":"This is Epic!",
            "owner":{
                "photo":null,
                "permalink":"https://tree.taiga.io/profile/eeshangarg",
                "full_name":"Eeshan Garg",
                "username":"eeshangarg",
                "id":258659,
                "gravatar_id":"cd181af88d928dab53c55600c9f7551d"
            },
            "ref":9,
            "client_requirement":false,
            "modified_date":"2017-10-25T00:48:24.175Z",
            "color":"#888a85",
            "watchers":[

            ]
        },
        "order":1508892527009,
        "id":187087,
        "user_story":{
            "assigned_to":null,
            "custom_attributes_values":{

            },
            "is_blocked":false,
            "status":{
                "is_archived":false,
                "color":"#999999",
                "is_closed":false,
                "slug":"new",
                "name":"New",
                "id":1364773
            },
            "project":{
                "permalink":"https://tree.taiga.io/project/eeshangarg-zulip",
                "logo_big_url":null,
                "id":229096,
                "name":"Zulip"
            },
            "finish_date":null,
            "created_date":"2017-10-25T00:42:40.254Z",
            "team_requirement":false,
            "watchers":[

            ],
            "owner":{
                "photo":null,
                "permalink":"https://tree.taiga.io/profile/eeshangarg",
                "full_name":"Eeshan Garg",
                "username":"eeshangarg",
                "id":258659,
                "gravatar_id":"cd181af88d928dab53c55600c9f7551d"
            },
            "client_requirement":false,
            "modified_date":"2017-10-25T00:42:40.255Z",
            "tribe_gig":null,
            "generated_from_issue":null,
            "description":"",
            "points":[
                {
                    "value":null,
                    "role":"UX",
                    "name":"?"
                },
                {
                    "value":null,
                    "role":"Design",
                    "name":"?"
                },
                {
                    "value":null,
                    "role":"Front",
                    "name":"?"
                },
                {
                    "value":null,
                    "role":"Back",
                    "name":"?"
                }
            ],
            "is_closed":false,
            "external_reference":null,
            "blocked_note":"",
            "subject":"A related user story",
            "tags":[

            ],
            "ref":8,
            "milestone":null,
            "id":1825616
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: relateduserstory_created_link.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/relateduserstory_created_link.json

```json
{
    "action": "create",
    "type": "relateduserstory",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-07T20:07:37.791Z",
    "data": {
        "id": 513543,
        "user_story": {
            "custom_attributes_values": {},
            "id": 3133511,
            "ref": 54,
            "project": {
                "id": 351023,
                "permalink": "https://tree.taiga.io/project/orientor-sd",
                "name": "sd",
                "logo_big_url": null
            },
            "is_closed": false,
            "created_date": "2020-02-07T19:33:07.473Z",
            "modified_date": "2020-02-07T19:49:10.782Z",
            "finish_date": null,
            "due_date": null,
            "due_date_reason": "",
            "subject": "Nice Issue",
            "client_requirement": false,
            "team_requirement": false,
            "generated_from_issue": 1312074,
            "generated_from_task": null,
            "external_reference": null,
            "tribe_gig": null,
            "watchers": [404067],
            "is_blocked": false,
            "blocked_note": "",
            "description": "asdasd",
            "tags": ["xo", "dsa"],
            "permalink": "https://tree.taiga.io/project/orientor-sd/us/54",
            "owner": {
                "id": 404067,
                "permalink": "https://tree.taiga.io/profile/orientor",
                "username": "orientor",
                "full_name": "Aditya Verma",
                "photo": null,
                "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
            },
            "assigned_to": null,
            "assigned_users": [],
            "points": [{
                "role": "UX",
                "name": "0",
                "value": 0.0
            }, {
                "role": "Design",
                "name": "0",
                "value": 0.0
            }, {
                "role": "Front",
                "name": "0",
                "value": 0.0
            }, {
                "role": "Back",
                "name": "0",
                "value": 0.0
            }],
            "status": {
                "id": 2107163,
                "name": "New",
                "slug": "new",
                "color": "#999999",
                "is_closed": false,
                "is_archived": false
            },
            "milestone": null
        },
        "epic": {
            "custom_attributes_values": {},
            "id": 121028,
            "ref": 42,
            "created_date": "2020-01-31T21:13:50.083Z",
            "modified_date": "2020-01-31T21:13:50.103Z",
            "subject": "ASAS",
            "watchers": [],
            "description": "ASDASDASDASDASD",
            "tags": [],
            "permalink": "https://tree.taiga.io/project/orientor-sd/epic/42",
            "project": {
                "id": 351023,
                "permalink": "https://tree.taiga.io/project/orientor-sd",
                "name": "sd",
                "logo_big_url": null
            },
            "owner": {
                "id": 404067,
                "permalink": "https://tree.taiga.io/profile/orientor",
                "username": "orientor",
                "full_name": "Aditya Verma",
                "photo": null,
                "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
            },
            "assigned_to": null,
            "status": {
                "id": 1616801,
                "name": "New",
                "slug": "new",
                "color": "#999999",
                "is_closed": false
            },
            "epics_order": 1580505230066,
            "color": "#3465a4",
            "client_requirement": false,
            "team_requirement": false
        },
        "order": 1581106057670
    }
}
```

--------------------------------------------------------------------------------

---[FILE: relateduserstory_deleted.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/relateduserstory_deleted.json

```json
{
    "data":{
        "id":187087,
        "user_story":{
            "description":"",
            "custom_attributes_values":{

            },
            "id":1825616,
            "milestone":null,
            "owner":{
                "permalink":"https://tree.taiga.io/profile/eeshangarg",
                "username":"eeshangarg",
                "full_name":"Eeshan Garg",
                "photo":null,
                "id":258659,
                "gravatar_id":"cd181af88d928dab53c55600c9f7551d"
            },
            "modified_date":"2017-10-25T00:53:02.074Z",
            "external_reference":null,
            "points":[
                {
                    "value":null,
                    "role":"UX",
                    "name":"?"
                },
                {
                    "value":null,
                    "role":"Design",
                    "name":"?"
                },
                {
                    "value":null,
                    "role":"Front",
                    "name":"?"
                },
                {
                    "value":null,
                    "role":"Back",
                    "name":"?"
                }
            ],
            "watchers":[

            ],
            "assigned_to":null,
            "is_blocked":false,
            "ref":8,
            "subject":"A related user story, which is epic",
            "tribe_gig":null,
            "finish_date":null,
            "blocked_note":"",
            "status":{
                "is_archived":false,
                "slug":"new",
                "name":"New",
                "id":1364773,
                "is_closed":false,
                "color":"#999999"
            },
            "project":{
                "permalink":"https://tree.taiga.io/project/eeshangarg-zulip",
                "id":229096,
                "name":"Zulip",
                "logo_big_url":null
            },
            "team_requirement":false,
            "created_date":"2017-10-25T00:42:40.254Z",
            "client_requirement":false,
            "generated_from_issue":null,
            "is_closed":false,
            "tags":[

            ]
        },
        "order":1508892527009,
        "epic":{
            "description":"An epic about supporting epics!",
            "subject":"This is Epic!",
            "watchers":[

            ],
            "epics_order":1508892504131,
            "created_date":"2017-10-25T00:48:24.157Z",
            "id":50717,
            "assigned_to":null,
            "status":{
                "id":1004969,
                "is_closed":false,
                "slug":"new",
                "name":"New",
                "color":"#999999"
            },
            "color":"#888a85",
            "project":{
                "permalink":"https://tree.taiga.io/project/eeshangarg-zulip",
                "id":229096,
                "name":"Zulip",
                "logo_big_url":null
            },
            "team_requirement":false,
            "ref":9,
            "client_requirement":false,
            "custom_attributes_values":{

            },
            "owner":{
                "permalink":"https://tree.taiga.io/profile/eeshangarg",
                "username":"eeshangarg",
                "full_name":"Eeshan Garg",
                "photo":null,
                "id":258659,
                "gravatar_id":"cd181af88d928dab53c55600c9f7551d"
            },
            "modified_date":"2017-10-25T00:48:24.175Z",
            "tags":[

            ]
        }
    },
    "type":"relateduserstory",
    "date":"2017-10-25T00:53:52.348Z",
    "by":{
        "permalink":"https://tree.taiga.io/profile/eeshangarg",
        "username":"eeshangarg",
        "full_name":"Eeshan Garg",
        "photo":null,
        "id":258659,
        "gravatar_id":"cd181af88d928dab53c55600c9f7551d"
    },
    "action":"delete"
}
```

--------------------------------------------------------------------------------

---[FILE: sprint_changed_name.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/sprint_changed_name.json

```json
{
  "change": {
    "diff": {
      "name": {
        "to": "New name",
        "from": "New sprint"
      },
      "estimated_start": {
        "to": "2017-01-10",
        "from": "2017-01-10"
      },
      "estimated_finish": {
        "to": "2017-01-25",
        "from": "2017-01-25"
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "milestone",
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null,
    "id": 187698,
    "full_name": "TomaszKolek"
  },
  "action": "change",
  "data": {
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null,
      "id": 187698,
      "full_name": "TomaszKolek"
    },
    "modified_date": "2017-01-10T17:50:57.951Z",
    "created_date": "2017-01-10T17:48:00.325Z",
    "estimated_finish": "2017-01-25",
    "id": 112881,
    "name": "New name",
    "slug": "new-sprint-85",
    "project": {
      "name": "TomKol",
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol",
      "logo_big_url": null,
      "id": 170130
    },
    "estimated_start": "2017-01-10",
    "closed": false,
    "disponibility": 0.0
  },
  "date": "2017-01-10T17:50:58.015Z"
}
```

--------------------------------------------------------------------------------

---[FILE: sprint_changed_time.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/sprint_changed_time.json

```json
{
  "change": {
    "diff": {
      "estimated_start": {
        "to": "2017-01-10",
        "from": "2017-01-10"
      },
      "estimated_finish": {
        "to": "2017-01-25",
        "from": "2017-01-24"
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "milestone",
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null,
    "id": 187698,
    "full_name": "TomaszKolek"
  },
  "action": "change",
  "data": {
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null,
      "id": 187698,
      "full_name": "TomaszKolek"
    },
    "modified_date": "2017-01-10T17:49:56.889Z",
    "created_date": "2017-01-10T17:48:00.325Z",
    "estimated_finish": "2017-01-25",
    "id": 112881,
    "name": "New sprint",
    "slug": "new-sprint-85",
    "project": {
      "name": "TomKol",
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol",
      "logo_big_url": null,
      "id": 170130
    },
    "estimated_start": "2017-01-10",
    "closed": false,
    "disponibility": 0.0
  },
  "date": "2017-01-10T17:49:56.953Z"
}
```

--------------------------------------------------------------------------------

---[FILE: sprint_created.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/sprint_created.json

```json
{
  "action": "create",
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "id": 187698,
    "full_name": "TomaszKolek",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null
  },
  "data": {
    "name": "New sprint",
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "id": 187698,
      "full_name": "TomaszKolek",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null
    },
    "estimated_start": "2017-01-10",
    "project": {
      "name": "TomKol",
      "id": 170130,
      "logo_big_url": null,
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol"
    },
    "modified_date": "2017-01-10T17:48:00.343Z",
    "estimated_finish": "2017-01-24",
    "disponibility": 0.0,
    "slug": "new-sprint-85",
    "created_date": "2017-01-10T17:48:00.325Z",
    "id": 112881,
    "closed": false
  },
  "type": "milestone",
  "date": "2017-01-10T17:48:00.640Z"
}
```

--------------------------------------------------------------------------------

---[FILE: sprint_deleted.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/sprint_deleted.json

```json
{
  "action": "delete",
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "id": 187698,
    "full_name": "TomaszKolek",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null
  },
  "data": {
    "name": "New name",
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "id": 187698,
      "full_name": "TomaszKolek",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null
    },
    "estimated_start": "2017-01-10",
    "project": {
      "name": "TomKol",
      "id": 170130,
      "logo_big_url": null,
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol"
    },
    "modified_date": "2017-01-10T17:50:57.951Z",
    "estimated_finish": "2017-01-25",
    "disponibility": 0.0,
    "slug": "new-sprint-85",
    "created_date": "2017-01-10T17:48:00.325Z",
    "id": 112881,
    "closed": false
  },
  "type": "milestone",
  "date": "2017-01-10T17:51:21.455Z"
}
```

--------------------------------------------------------------------------------

---[FILE: task_changed_assigned.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_assigned.json

```json
{
  "change": {
    "diff": {
      "assigned_to": {
        "to": "TomaszKolek",
        "from": null
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "task",
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null,
    "id": 187698,
    "full_name": "TomaszKolek"
  },
  "action": "change",
  "data": {
    "modified_date": "2017-01-10T19:17:01.520Z",
    "subject": "New Task",
    "custom_attributes_values": {},
    "blocked_note": "",
    "id": 1113810,
    "taskboard_order": 1484075646359,
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null,
      "id": 187698,
      "full_name": "TomaszKolek"
    },
    "description": "New description",
    "assigned_to": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null,
      "id": 187698,
      "full_name": "TomaszKolek"
    },
    "tags": [],
    "ref": 6,
    "created_date": "2017-01-10T19:14:06.391Z",
    "milestone": null,
    "user_story": {
      "finish_date": null,
      "modified_date": "2017-01-10T19:04:34.712Z",
      "is_closed": false,
      "tribe_gig": null,
      "subject": "UserStory",
      "custom_attributes_values": {},
      "blocked_note": "",
      "id": 1171601,
      "owner": {
        "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
        "permalink": "https://tree.taiga.io/profile/kolaszek",
        "username": "kolaszek",
        "photo": null,
        "id": 187698,
        "full_name": "TomaszKolek"
      },
      "generated_from_issue": null,
      "team_requirement": false,
      "points": [
        {
          "name": "5",
          "value": 5.0,
          "role": "UX"
        },
        {
          "name": "?",
          "value": null,
          "role": "Design"
        },
        {
          "name": "?",
          "value": null,
          "role": "Front"
        },
        {
          "name": "?",
          "value": null,
          "role": "Back"
        }
      ],
      "ref": 5,
      "client_requirement": false,
      "assigned_to": null,
      "tags": [],
      "created_date": "2017-01-10T18:24:28.966Z",
      "milestone": null,
      "status": {
        "is_closed": false,
        "name": "In progress",
        "slug": "in-progress",
        "id": 1006447,
        "color": "#ff9900",
        "is_archived": false
      },
      "is_blocked": false,
      "project": {
        "name": "TomKol",
        "permalink": "https://tree.taiga.io/project/kolaszek-tomkol",
        "logo_big_url": null,
        "id": 170130
      },
      "external_reference": null,
      "description": "New description",
      "watchers": [
        187698
      ]
    },
    "status": {
      "name": "In progress",
      "slug": "in-progress",
      "is_closed": false,
      "id": 853638,
      "color": "#ff9900"
    },
    "is_iocaine": false,
    "is_blocked": false,
    "us_order": 1484075646359,
    "finished_date": null,
    "external_reference": null,
    "project": {
      "name": "TomKol",
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol",
      "logo_big_url": null,
      "id": 170130
    },
    "watchers": [
      187698
    ]
  },
  "date": "2017-01-10T19:17:01.618Z"
}
```

--------------------------------------------------------------------------------

---[FILE: task_changed_blocked.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_blocked.json

```json
{
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "id": 187698,
    "full_name": "TomaszKolek",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null
  },
  "change": {
    "comment_html": "",
    "comment": "",
    "comment_versions": null,
    "edit_comment_date": null,
    "delete_comment_date": null,
    "diff": {
      "is_blocked": {
        "from": false,
        "to": true
      }
    }
  },
  "date": "2017-01-10T19:14:38.855Z",
  "action": "change",
  "data": {
    "watchers": [],
    "id": 1113810,
    "finished_date": null,
    "blocked_note": "",
    "modified_date": "2017-01-10T19:14:38.749Z",
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "id": 187698,
      "full_name": "TomaszKolek",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null
    },
    "is_blocked": true,
    "external_reference": null,
    "ref": 6,
    "taskboard_order": 1484075646359,
    "project": {
      "name": "TomKol",
      "id": 170130,
      "logo_big_url": null,
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol"
    },
    "user_story": {
      "watchers": [
        187698
      ],
      "client_requirement": false,
      "id": 1171601,
      "blocked_note": "",
      "modified_date": "2017-01-10T19:04:34.712Z",
      "owner": {
        "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
        "id": 187698,
        "full_name": "TomaszKolek",
        "permalink": "https://tree.taiga.io/profile/kolaszek",
        "username": "kolaszek",
        "photo": null
      },
      "is_blocked": false,
      "external_reference": null,
      "ref": 5,
      "subject": "UserStory",
      "project": {
        "name": "TomKol",
        "id": 170130,
        "logo_big_url": null,
        "permalink": "https://tree.taiga.io/project/kolaszek-tomkol"
      },
      "tribe_gig": null,
      "is_closed": false,
      "custom_attributes_values": {},
      "milestone": null,
      "finish_date": null,
      "team_requirement": false,
      "description": "New description",
      "created_date": "2017-01-10T18:24:28.966Z",
      "points": [
        {
          "name": "5",
          "value": 5.0,
          "role": "UX"
        },
        {
          "name": "?",
          "value": null,
          "role": "Design"
        },
        {
          "name": "?",
          "value": null,
          "role": "Front"
        },
        {
          "name": "?",
          "value": null,
          "role": "Back"
        }
      ],
      "generated_from_issue": null,
      "tags": [],
      "status": {
        "name": "In progress",
        "id": 1006447,
        "color": "#ff9900",
        "is_archived": false,
        "slug": "in-progress",
        "is_closed": false
      },
      "assigned_to": null
    },
    "us_order": 1484075646359,
    "custom_attributes_values": {},
    "milestone": null,
    "is_iocaine": false,
    "description": "",
    "assigned_to": null,
    "tags": [],
    "status": {
      "name": "New",
      "slug": "new",
      "color": "#999999",
      "id": 853637,
      "is_closed": false
    },
    "subject": "New Task",
    "created_date": "2017-01-10T19:14:06.391Z"
  },
  "type": "task"
}
```

--------------------------------------------------------------------------------

---[FILE: task_changed_blocked_link.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_blocked_link.json

```json
{
    "action": "change",
    "type": "task",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-08T06:48:55.064Z",
    "data": {
        "custom_attributes_values": {},
        "id": 3268157,
        "ref": 56,
        "created_date": "2020-02-08T06:45:23.305Z",
        "modified_date": "2020-02-08T06:48:54.944Z",
        "finished_date": null,
        "due_date": null,
        "due_date_reason": "",
        "subject": "nice task",
        "us_order": 1581144323286,
        "taskboard_order": 1581144323286,
        "is_iocaine": false,
        "external_reference": null,
        "watchers": [],
        "is_blocked": true,
        "blocked_note": "as",
        "description": "",
        "tags": [],
        "permalink": "https://tree.taiga.io/project/orientor-sd/task/56",
        "project": {
            "id": 351023,
            "permalink": "https://tree.taiga.io/project/orientor-sd",
            "name": "sd",
            "logo_big_url": null
        },
        "owner": {
            "id": 404067,
            "permalink": "https://tree.taiga.io/profile/orientor",
            "username": "orientor",
            "full_name": "Aditya Verma",
            "photo": null,
            "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
        },
        "assigned_to": null,
        "status": {
            "id": 1754937,
            "name": "New",
            "slug": "new",
            "color": "#999999",
            "is_closed": false
        },
        "user_story": {
            "custom_attributes_values": {},
            "id": 3133511,
            "ref": 54,
            "project": {
                "id": 351023,
                "permalink": "https://tree.taiga.io/project/orientor-sd",
                "name": "sd",
                "logo_big_url": null
            },
            "is_closed": false,
            "created_date": "2020-02-07T19:33:07.473Z",
            "modified_date": "2020-02-07T19:49:10.782Z",
            "finish_date": null,
            "due_date": null,
            "due_date_reason": "",
            "subject": "Nice Issue",
            "client_requirement": false,
            "team_requirement": false,
            "generated_from_issue": 1312074,
            "generated_from_task": null,
            "external_reference": null,
            "tribe_gig": null,
            "watchers": [404067],
            "is_blocked": false,
            "blocked_note": "",
            "description": "asdasd",
            "tags": ["xo", "dsa"],
            "permalink": "https://tree.taiga.io/project/orientor-sd/us/54",
            "owner": {
                "id": 404067,
                "permalink": "https://tree.taiga.io/profile/orientor",
                "username": "orientor",
                "full_name": "Aditya Verma",
                "photo": null,
                "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
            },
            "assigned_to": null,
            "assigned_users": [],
            "points": [{
                "role": "UX",
                "name": "0",
                "value": 0.0
            }, {
                "role": "Design",
                "name": "0",
                "value": 0.0
            }, {
                "role": "Front",
                "name": "0",
                "value": 0.0
            }, {
                "role": "Back",
                "name": "0",
                "value": 0.0
            }],
            "status": {
                "id": 2107163,
                "name": "New",
                "slug": "new",
                "color": "#999999",
                "is_closed": false,
                "is_archived": false
            },
            "milestone": null
        },
        "milestone": null
    },
    "change": {
        "comment": "",
        "comment_html": "",
        "delete_comment_date": null,
        "comment_versions": null,
        "edit_comment_date": null,
        "diff": {
            "is_blocked": {
                "from": false,
                "to": true
            },
            "blocked_note_diff": {
                "from": null,
                "to": "<ins>as</ins>"
            },
            "blocked_note_html": {
                "from": "",
                "to": "<p>as</p>"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: task_changed_comment_added.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_comment_added.json

```json
{
  "change": {
    "diff": {},
    "comment_versions": null,
    "comment_html": "<p>New comment</p>",
    "comment": "New comment",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "task",
  "by": {
    "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
    "permalink": "https://tree.taiga.io/profile/kolaszek",
    "username": "kolaszek",
    "photo": null,
    "id": 187698,
    "full_name": "TomaszKolek"
  },
  "action": "change",
  "data": {
    "modified_date": "2017-01-10T19:16:13.670Z",
    "subject": "New Task",
    "custom_attributes_values": {},
    "blocked_note": "",
    "id": 1113810,
    "taskboard_order": 1484075646359,
    "owner": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null,
      "id": 187698,
      "full_name": "TomaszKolek"
    },
    "description": "New description",
    "assigned_to": null,
    "tags": [],
    "ref": 6,
    "created_date": "2017-01-10T19:14:06.391Z",
    "milestone": null,
    "user_story": {
      "finish_date": null,
      "modified_date": "2017-01-10T19:04:34.712Z",
      "is_closed": false,
      "tribe_gig": null,
      "subject": "UserStory",
      "custom_attributes_values": {},
      "blocked_note": "",
      "id": 1171601,
      "owner": {
        "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
        "permalink": "https://tree.taiga.io/profile/kolaszek",
        "username": "kolaszek",
        "photo": null,
        "id": 187698,
        "full_name": "TomaszKolek"
      },
      "generated_from_issue": null,
      "team_requirement": false,
      "points": [
        {
          "name": "5",
          "value": 5.0,
          "role": "UX"
        },
        {
          "name": "?",
          "value": null,
          "role": "Design"
        },
        {
          "name": "?",
          "value": null,
          "role": "Front"
        },
        {
          "name": "?",
          "value": null,
          "role": "Back"
        }
      ],
      "ref": 5,
      "client_requirement": false,
      "assigned_to": null,
      "tags": [],
      "created_date": "2017-01-10T18:24:28.966Z",
      "milestone": null,
      "status": {
        "is_closed": false,
        "name": "In progress",
        "slug": "in-progress",
        "id": 1006447,
        "color": "#ff9900",
        "is_archived": false
      },
      "is_blocked": false,
      "project": {
        "name": "TomKol",
        "permalink": "https://tree.taiga.io/project/kolaszek-tomkol",
        "logo_big_url": null,
        "id": 170130
      },
      "external_reference": null,
      "description": "New description",
      "watchers": [
        187698
      ]
    },
    "status": {
      "name": "New",
      "slug": "new",
      "is_closed": false,
      "id": 853637,
      "color": "#999999"
    },
    "is_iocaine": false,
    "is_blocked": false,
    "us_order": 1484075646359,
    "finished_date": null,
    "external_reference": null,
    "project": {
      "name": "TomKol",
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol",
      "logo_big_url": null,
      "id": 170130
    },
    "watchers": [
      187698
    ]
  },
  "date": "2017-01-10T19:16:13.817Z"
}
```

--------------------------------------------------------------------------------

````
