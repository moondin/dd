---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1261
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1261 of 1290)

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

---[FILE: epic_deleted.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/epic_deleted.json

```json
{
    "date":"2017-10-23T00:02:01.239Z",
    "by":{
        "photo":null,
        "permalink":"https://tree.taiga.io/profile/eeshangarg",
        "full_name":"Eeshan Garg",
        "username":"eeshangarg",
        "id":258659,
        "gravatar_id":"cd181af88d928dab53c55600c9f7551d"
    },
    "action":"delete",
    "type":"epic",
    "data":{
        "assigned_to":{
            "photo":null,
            "permalink":"https://tree.taiga.io/profile/angelajohnson",
            "full_name":"Angela Johnson",
            "username":"angelajohnson",
            "id":258683,
            "gravatar_id":"36cf0dc28c5302bcd68119fcaaf4d4f3"
        },
        "description":"This Epic has details on why Zulip is awesome! Firstly, Zulip is open source!",
        "custom_attributes_values":null,
        "status":{
            "slug":"in-progress",
            "id":1004971,
            "color":"#ff9900",
            "name":"In progress",
            "is_closed":false
        },
        "project":{
            "permalink":"https://tree.taiga.io/project/eeshangarg-zulip",
            "logo_big_url":null,
            "id":229096,
            "name":"Zulip"
        },
        "epics_order":1508641159928,
        "created_date":"2017-10-22T02:59:19.958Z",
        "team_requirement":false,
        "tags":[

        ],
        "id":50266,
        "subject":"Zulip is great!",
        "owner":{
            "photo":null,
            "permalink":"https://tree.taiga.io/profile/eeshangarg",
            "full_name":"Eeshan Garg",
            "username":"eeshangarg",
            "id":258659,
            "gravatar_id":"cd181af88d928dab53c55600c9f7551d"
        },
        "ref":5,
        "client_requirement":false,
        "modified_date":"2017-10-22T23:57:13.871Z",
        "color":"#729fcf",
        "watchers":[
            258659
        ]
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_assigned.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_assigned.json

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
      "assigned_to": {
        "from": null,
        "to": "TomaszKolek"
      }
    }
  },
  "date": "2017-01-10T19:37:05.045Z",
  "action": "change",
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
    "custom_attributes_values": {},
    "external_reference": null,
    "milestone": null,
    "description": "New description",
    "created_date": "2017-01-10T19:34:20.303Z",
    "modified_date": "2017-01-10T19:37:04.934Z",
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
    "assigned_to": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "id": 187698,
      "full_name": "TomaszKolek",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null
    }
  },
  "type": "issue"
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_blocked.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_blocked.json

```json
{
    "action": "change",
    "type": "issue",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-07T18:51:40.986Z",
    "data": {
        "custom_attributes_values": {},
        "id": 1311625,
        "ref": 49,
        "created_date": "2020-02-06T17:00:01.089Z",
        "modified_date": "2020-02-07T18:51:40.744Z",
        "finished_date": null,
        "due_date": "2020-03-08",
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
        "milestone": {
            "id": 254091,
            "name": "eres",
            "slug": "eres",
            "estimated_start": "2020-01-30",
            "estimated_finish": "2020-02-13",
            "created_date": "2020-01-29T22:33:36.885Z",
            "modified_date": "2020-01-29T22:33:36.908Z",
            "closed": false ,
            "dispoFnibility": 0.0,
            "permalink": "https://tree.taiga.io/project/orientor-sd/taskboard/eres",
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
            }
        },
        "owner": {
            "id": 404067,
            "permalink": "https://tree.taiga.io/profile/orientor",
            "username": "orientor",
            "full_name": "Aditya Verma",
            "photo": null,
            "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
        },
        "assigned_to": {
            "id": 404067,
            "permalink": "https://tree.taiga.io/profile/orientor",
            "username": "orientor",
            "full_name": "Aditya Verma",
            "photo": null,
            "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
        },
        "status": {
            "id": 2460905,
            "name": "New",
            "slug": "new",
            "color": "#8C2318",
            "is_closed": false
        },
        "type": {
            "id": 1060464,
            "name": "Question",
            "color": "#ba89a8"
        },
        "priority": {
            "id": 1055659,
            "name": "High",
            "color": "#CC0000"
        },
        "severity": {
            "id": 1753852,
            "name": "Minor",
            "color": "#669933"
        }
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
                "to": "asd"
            },
            "blocked_note_html": {
                "from": "",
                "to": "<p>asd</p>"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_comment_added.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_comment_added.json

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
  "type": "issue",
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
    "assigned_to": null,
    "tags": [],
    "modified_date": "2017-01-10T19:35:39.626Z",
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
    "description": "New description",
    "priority": {
      "name": "Normal",
      "id": 511600,
      "color": "#669933"
    },
    "watchers": [
      187698
    ],
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
  "date": "2017-01-10T19:35:39.748Z"
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_description.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_description.json

```json
{
  "change": {
    "diff": {
      "description_diff": "Check the history API for the exact diff"
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "issue",
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
    "assigned_to": null,
    "tags": [],
    "modified_date": "2017-01-10T19:35:17.612Z",
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
    "description": "New description",
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
  "date": "2017-01-10T19:35:17.733Z"
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_due_date.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_due_date.json

```json
{
    "action": "change",
    "type": "issue",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-07T18:51:54.846Z",
    "data": {
        "custom_attributes_values": {},
        "id": 1311625,
        "ref": 49,
        "created_date": "2020-02-06T17:00:01.089Z",
        "modified_date": "2020-02-07T18:51:54.729Z",
        "finished_date": null,
        "due_date": "2020-02-22",
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
        "milestone": {
            "id": 254091,
            "name": "eres",
            "slug": "eres",
            "estimated_start": "2020-01-30",
            "estimated_finish": "2020-02-13",
            "created_date": "2020-01-29T22:33:36.885Z",
            "modified_date": "2020-01-29T22:33:36.908Z",
            "closed": false,
            "disponibility": 0.0,
            "permalink": "https://tree.taiga.io/project/orientor-sd/taskboard/eres",
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
            }
        },
        "owner": {
            "id": 404067,
            "permalink": "https://tree.taiga.io/profile/orientor",
            "username": "orientor",
            "full_name": "Aditya Verma",
            "photo": null,
            "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
        },
        "assigned_to": {
            "id": 404067,
            "permalink": "https://tree.taiga.io/profile/orientor",
            "username": "orientor",
            "full_name": "Aditya Verma",
            "photo": null,
            "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
        },
        "status": {
            "id": 2460905,
            "name": "New",
            "slug": "new",
            "color": "#8C2318",
            "is_closed": false
        },
        "type": {
            "id": 1060464,
            "name": "Question",
            "color": "#ba89a8"
        },
        "priority": {
            "id": 1055659,
            "name": "High",
            "color": "#CC0000"
        },
        "severity": {
            "id": 1753852,
            "name": "Minor",
            "color": "#669933"
        }
    },
    "change": {
        "comment": "",
        "comment_html": "",
        "delete_comment_date": null,
        "comment_versions": null,
        "edit_comment_date": null,
        "diff": {
            "due_date": {
                "from": "2020-03-08",
                "to": "2020-02-22"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_new_due_date.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_new_due_date.json

```json
{
    "action": "change",
    "type": "issue",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-07T19:28:03.115Z",
    "data": {
        "custom_attributes_values": {},
        "id": 1312074,
        "ref": 53,
        "created_date": "2020-02-07T19:12:17.220Z",
        "modified_date": "2020-02-07T19:28:02.990Z",
        "finished_date": null,
        "due_date": "2020-02-22",
        "due_date_reason": "asd",
        "subject": "Nice Issue",
        "external_reference": null,
        "watchers": [],
        "description": "asdasd",
        "tags": [],
        "permalink": "https://tree.taiga.io/project/orientor-sd/issue/53",
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
    },
    "change": {
        "comment": "",
        "comment_html": "",
        "delete_comment_date": null,
        "comment_versions": null,
        "edit_comment_date": null,
        "diff": {
            "due_date": {
                "from": null,
                "to": "2020-02-22"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_new_sprint.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_new_sprint.json

```json
{
    "action": "change",
    "type": "issue",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-07T19:12:28.768Z",
    "data": {
        "custom_attributes_values": {},
        "id": 1312074,
        "ref": 53,
        "created_date": "2020-02-07T19:12:17.220Z",
        "modified_date": "2020-02-07T19:12:28.627Z",
        "finished_date": null,
        "due_date": null,
        "due_date_reason": "",
        "subject": "Nice Issue",
        "external_reference": null,
        "watchers": [],
        "description": "asdasd",
        "tags": [],
        "permalink": "https://tree.taiga.io/project/orientor-sd/issue/53",
        "project": {
            "id": 351023,
            "permalink": "https://tree.taiga.io/project/orientor-sd",
            "name": "sd",
            "logo_big_url": null
        },
        "milestone": {
            "id": 254091,
            "name": "eres",
            "slug": "eres",
            "estimated_start": "2020-01-30",
            "estimated_finish": "2020-02-13",
            "created_date": "2020-01-29T22:33:36.885Z",
            "modified_date": "2020-01-29T22:33:36.908Z",
            "closed": false,
            "disponibility": 0.0,
            "permalink": "https://tree.taiga.io/project/orientor-sd/taskboard/eres",
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
            }
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
    },
    "change": {
        "comment": "",
        "comment_html": "",
        "delete_comment_date": null,
        "comment_versions": null,
        "edit_comment_date": null,
        "diff": {
            "milestone": {
                "from": null,
                "to": "eres"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_priority.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_priority.json

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
      "priority": {
        "from": "Normal",
        "to": "Low"
      }
    }
  },
  "date": "2017-01-10T19:36:27.931Z",
  "action": "change",
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
    "custom_attributes_values": {},
    "external_reference": null,
    "milestone": null,
    "description": "New description",
    "created_date": "2017-01-10T19:34:20.303Z",
    "modified_date": "2017-01-10T19:36:27.813Z",
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
      "name": "New",
      "slug": "new",
      "color": "#8C2318",
      "id": 1192590,
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
  "type": "issue"
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_reassigned.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_reassigned.json

```json
{
  "change": {
    "diff": {
      "assigned_to": {
        "to": "HanSolo",
        "from": "TomaszKolek"
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "issue",
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
    "assigned_to": null,
    "tags": [],
    "modified_date": "2017-01-10T19:37:19.525Z",
    "created_date": "2017-01-10T19:34:20.303Z",
    "milestone": null,
    "subject": "New issue",
    "custom_attributes_values": {},
    "status": {
      "name": "In progress",
      "slug": "in-progress",
      "is_closed": false,
      "id": 1192591,
      "color": "#5E8C6A"
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
    "description": "New description",
    "priority": {
      "name": "Low",
      "id": 511599,
      "color": "#666666"
    },
    "watchers": [
      187698
    ],
    "finished_date": null,
    "severity": {
      "name": "Minor",
      "id": 849621,
      "color": "#669933"
    },
    "ref": 8,
    "type": {
      "name": "Question",
      "id": 514254,
      "color": "#ba89a8"
    }
  },
  "date": "2017-01-10T19:37:19.641Z"
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_remove_sprint.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_remove_sprint.json

```json
{
    "action": "change",
    "type": "issue",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-07T19:22:46.455Z",
    "data": {
        "custom_attributes_values": {},
        "id": 1312074,
        "ref": 53,
        "created_date": "2020-02-07T19:12:17.220Z",
        "modified_date": "2020-02-07T19:22:46.298Z",
        "finished_date": null,
        "due_date": null,
        "due_date_reason": "",
        "subject": "Nice Issue",
        "external_reference": null,
        "watchers": [],
        "description": "asdasd",
        "tags": [],
        "permalink": "https://tree.taiga.io/project/orientor-sd/issue/53",
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
    },
    "change": {
        "comment": "",
        "comment_html": "",
        "delete_comment_date": null,
        "comment_versions": null,
        "edit_comment_date": null,
        "diff": {
            "milestone": {
                "from": "eres",
                "to": null
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_severity.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_severity.json

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
      "severity": {
        "from": "Normal",
        "to": "Minor"
      }
    }
  },
  "date": "2017-01-10T19:36:16.215Z",
  "action": "change",
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
      "name": "Normal",
      "color": "#669933",
      "id": 511600
    },
    "project": {
      "name": "TomKol",
      "id": 170130,
      "logo_big_url": null,
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol"
    },
    "finished_date": null,
    "custom_attributes_values": {},
    "external_reference": null,
    "milestone": null,
    "description": "New description",
    "created_date": "2017-01-10T19:34:20.303Z",
    "modified_date": "2017-01-10T19:36:16.121Z",
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
      "name": "New",
      "slug": "new",
      "color": "#8C2318",
      "id": 1192590,
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
  "type": "issue"
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_status.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_status.json

```json
{
  "change": {
    "diff": {
      "status": {
        "to": "In progress",
        "from": "New"
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "issue",
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
    "assigned_to": null,
    "tags": [],
    "modified_date": "2017-01-10T19:36:47.041Z",
    "created_date": "2017-01-10T19:34:20.303Z",
    "milestone": null,
    "subject": "New issue",
    "custom_attributes_values": {},
    "status": {
      "name": "In progress",
      "slug": "in-progress",
      "is_closed": false,
      "id": 1192591,
      "color": "#5E8C6A"
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
    "description": "New description",
    "priority": {
      "name": "Low",
      "id": 511599,
      "color": "#666666"
    },
    "watchers": [
      187698
    ],
    "finished_date": null,
    "severity": {
      "name": "Minor",
      "id": 849621,
      "color": "#669933"
    },
    "ref": 8,
    "type": {
      "name": "Question",
      "id": 514254,
      "color": "#ba89a8"
    }
  },
  "date": "2017-01-10T19:36:47.160Z"
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_subject.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_subject.json

```json
{
  "change": {
    "diff": {
      "subject": {
        "to": "New issueNewSubject",
        "from": "New issue"
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "issue",
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
    "assigned_to": null,
    "tags": [],
    "modified_date": "2017-01-10T19:34:55.946Z",
    "created_date": "2017-01-10T19:34:20.303Z",
    "milestone": null,
    "subject": "New issueNewSubject",
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
  "date": "2017-01-10T19:34:56.061Z"
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_type.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_type.json

```json
{
  "change": {
    "diff": {
      "type": {
        "to": "Question",
        "from": "Bug"
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "issue",
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
    "assigned_to": null,
    "tags": [],
    "modified_date": "2017-01-10T19:35:59.798Z",
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
    "description": "New description",
    "priority": {
      "name": "Normal",
      "id": 511600,
      "color": "#669933"
    },
    "watchers": [
      187698
    ],
    "finished_date": null,
    "severity": {
      "name": "Normal",
      "id": 849622,
      "color": "#0000FF"
    },
    "ref": 8,
    "type": {
      "name": "Question",
      "id": 514254,
      "color": "#ba89a8"
    }
  },
  "date": "2017-01-10T19:35:59.899Z"
}
```

--------------------------------------------------------------------------------

---[FILE: issue_changed_unblocked.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/issue_changed_unblocked.json

```json
{
    "action": "change",
    "type": "issue",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-07T18:51:46.082Z",
    "data": {
        "custom_attributes_values": {},
        "id": 1311625,
        "ref": 49,
        "created_date": "2020-02-06T17:00:01.089Z",
        "modified_date": "2020-02-07T18:51:45.973Z",
        "finished_date": null,
        "due_date": "2020-03-08",
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
        "milestone": {
            "id": 254091,
            "name": "eres",
            "slug": "eres",
            "estimated_start": "2020-01-30",
            "estimated_finish": "2020-02-13",
            "created_date": "2020-01-29T22:33:36.885Z",
            "modified_date": "2020-01-29T22:33:36.908Z",
            "closed": false,
            "disponibility": 0.0,
            "permalink": "https://tree.taiga.io/project/orientor-sd/taskboard/eres",
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
            }
        },
        "owner": {
            "id": 404067,
            "permalink": "https://tree.taiga.io/profile/orientor",
            "username": "orientor",
            "full_name": "Aditya Verma",
            "photo": null,
            "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
        },
        "assigned_to": {
            "id": 404067,
            "permalink": "https://tree.taiga.io/profile/orientor",
            "username": "orientor",
            "full_name": "Aditya Verma",
            "photo": null,
            "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
        },
        "status": {
            "id": 2460905,
            "name": "New",
            "slug": "new",
            "color": "#8C2318",
            "is_closed": false
        },
        "type": {
            "id": 1060464,
            "name": "Question",
            "color": "#ba89a8"
        },
        "priority": {
            "id": 1055659,
            "name": "High",
            "color": "#CC0000"
        },
        "severity": {
            "id": 1753852,
            "name": "Minor",
            "color": "#669933"
        }
    },
    "change": {
        "comment": "",
        "comment_html": "",
        "delete_comment_date": null,
        "comment_versions": null,
        "edit_comment_date": null,
        "diff": {
            "is_blocked": {
                "from": true,
                "to": false
            },
            "blocked_note_diff": {
                "from": null,
                "to": "<del >asd</del>"
            },
            "blocked_note_html": {
                "from": "<p>asd</p>",
                "to": ""
            }
        }
    }
}
```

--------------------------------------------------------------------------------

````
