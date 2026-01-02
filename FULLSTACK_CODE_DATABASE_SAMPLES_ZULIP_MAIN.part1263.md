---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1263
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1263 of 1290)

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

---[FILE: task_changed_description.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_description.json

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
      "description_diff": "Check the history API for the exact diff"
    }
  },
  "date": "2017-01-10T19:15:43.134Z",
  "action": "change",
  "data": {
    "watchers": [],
    "id": 1113810,
    "finished_date": null,
    "blocked_note": "",
    "modified_date": "2017-01-10T19:15:43.010Z",
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
    "description": "New description",
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

---[FILE: task_changed_due_date.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_due_date.json

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
    "date": "2020-02-08T07:00:37.778Z",
    "data": {
        "custom_attributes_values": {},
        "id": 3268157,
        "ref": 56,
        "created_date": "2020-02-08T06:45:23.305Z",
        "modified_date": "2020-02-08T07:00:37.651Z",
        "finished_date": null,
        "due_date": "2020-02-15",
        "due_date_reason": "",
        "subject": "nice task",
        "us_order": 1581144323286,
        "taskboard_order": 1581144323286,
        "is_iocaine": false,
        "external_reference": null,
        "watchers": [],
        "is_blocked": false,
        "blocked_note": "",
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
            "due_date": {
                "from": "2020-02-22",
                "to": "2020-02-15"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: task_changed_new_due_date.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_new_due_date.json

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
    "date": "2020-02-08T06:55:10.650Z",
    "data": {
        "custom_attributes_values": {},
        "id": 3268157,
        "ref": 56,
        "created_date": "2020-02-08T06:45:23.305Z",
        "modified_date": "2020-02-08T06:55:10.555Z",
        "finished_date": null,
        "due_date": "2020-02-22",
        "due_date_reason": "",
        "subject": "nice task",
        "us_order": 1581144323286,
        "taskboard_order": 1581144323286,
        "is_iocaine": false,
        "external_reference": null,
        "watchers": [],
        "is_blocked": false,
        "blocked_note": "",
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
            "due_date": {
                "from": null,
                "to": "2020-02-22"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: task_changed_reassigned.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_reassigned.json

```json
{
  "change": {
    "diff": {
      "assigned_to": {
        "to": "TomaszKolek",
        "from": "HanSolo"
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

---[FILE: task_changed_status.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_status.json

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
      "status": {
        "from": "New",
        "to": "In progress"
      }
    }
  },
  "date": "2017-01-10T19:16:35.189Z",
  "action": "change",
  "data": {
    "watchers": [
      187698
    ],
    "id": 1113810,
    "finished_date": null,
    "blocked_note": "",
    "modified_date": "2017-01-10T19:16:35.036Z",
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
    "description": "New description",
    "assigned_to": null,
    "tags": [],
    "status": {
      "name": "In progress",
      "slug": "in-progress",
      "color": "#ff9900",
      "id": 853638,
      "is_closed": false
    },
    "subject": "New Task",
    "created_date": "2017-01-10T19:14:06.391Z"
  },
  "type": "task"
}
```

--------------------------------------------------------------------------------

---[FILE: task_changed_subject.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_subject.json

```json
{
  "change": {
    "diff": {
      "subject": {
        "to": "New Task Subject",
        "from": "New Task"
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
    "modified_date": "2017-01-10T19:15:19.535Z",
    "subject": "New Task Subject",
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
    "description": "",
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
    "watchers": []
  },
  "date": "2017-01-10T19:15:19.663Z"
}
```

--------------------------------------------------------------------------------

---[FILE: task_changed_unblocked.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_unblocked.json

```json
{
  "change": {
    "diff": {
      "is_blocked": {
        "to": false,
        "from": true
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
    "modified_date": "2017-01-10T19:14:54.350Z",
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
    "description": "",
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
    "watchers": []
  },
  "date": "2017-01-10T19:14:54.467Z"
}
```

--------------------------------------------------------------------------------

---[FILE: task_changed_user_stories.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_changed_user_stories.json

```json
{
    "type":"task",
    "action":"change",
    "date":"2018-10-16T18:36:27.132Z",
    "data":{
        "due_date_reason":"",
        "id":2541359,
        "blocked_note":"",
        "custom_attributes_values":{

        },
        "tags":[

        ],
        "subject":"Get this task done",
        "watchers":[

        ],
        "external_reference":null,
        "project":{
            "id":229096,
            "name":"Zulip",
            "logo_big_url":null,
            "permalink":"https://tree.taiga.io/project/eeshangarg-zulip"
        },
        "owner":{
            "full_name":"Eeshan Garg",
            "id":258659,
            "photo":null,
            "permalink":"https://tree.taiga.io/profile/eeshangarg",
            "gravatar_id":"cd181af88d928dab53c55600c9f7551d",
            "username":"eeshangarg"
        },
        "assigned_to":null,
        "us_order":0,
        "finished_date":null,
        "modified_date":"2018-10-16T18:36:26.986Z",
        "due_date":null,
        "description":"",
        "user_story":{
            "due_date_reason":"",
            "id":1825616,
            "tribe_gig":null,
            "finish_date":null,
            "custom_attributes_values":{

            },
            "tags":[

            ],
            "subject":"A related user story, which is epic",
            "watchers":[

            ],
            "external_reference":null,
            "owner":{
                "full_name":"Eeshan Garg",
                "id":258659,
                "photo":null,
                "permalink":"https://tree.taiga.io/profile/eeshangarg",
                "gravatar_id":"cd181af88d928dab53c55600c9f7551d",
                "username":"eeshangarg"
            },
            "assigned_to":null,
            "modified_date":"2018-10-16T18:36:10.637Z",
            "status":{
                "color":"#999999",
                "id":1364773,
                "slug":"new",
                "is_archived":false,
                "is_closed":false,
                "name":"New"
            },
            "is_closed":false,
            "is_blocked":false,
            "team_requirement":false,
            "project":{
                "id":229096,
                "name":"Zulip",
                "logo_big_url":null,
                "permalink":"https://tree.taiga.io/project/eeshangarg-zulip"
            },
            "blocked_note":"",
            "due_date":null,
            "assigned_users":[

            ],
            "description":"",
            "milestone":{
                "slug":"another-one-4",
                "closed":false,
                "project":{
                    "id":229096,
                    "name":"Zulip",
                    "logo_big_url":null,
                    "permalink":"https://tree.taiga.io/project/eeshangarg-zulip"
                },
                "estimated_start":"2018-10-25",
                "owner":{
                    "full_name":"Eeshan Garg",
                    "id":258659,
                    "photo":null,
                    "permalink":"https://tree.taiga.io/profile/eeshangarg",
                    "gravatar_id":"cd181af88d928dab53c55600c9f7551d",
                    "username":"eeshangarg"
                },
                "estimated_finish":"2018-11-03",
                "created_date":"2018-10-16T18:35:57.020Z",
                "modified_date":"2018-10-16T18:35:57.040Z",
                "disponibility":0.0,
                "id":206232,
                "name":"Another one"
            },
            "generated_from_issue":null,
            "client_requirement":false,
            "points":[
                {
                    "role":"UX",
                    "name":"?",
                    "value":null
                },
                {
                    "role":"Design",
                    "name":"?",
                    "value":null
                },
                {
                    "role":"Front",
                    "name":"?",
                    "value":null
                },
                {
                    "role":"Back",
                    "name":"?",
                    "value":null
                }
            ],
            "ref":8,
            "created_date":"2017-10-25T00:42:40.254Z"
        },
        "taskboard_order":0,
        "is_blocked":false,
        "milestone":{
            "slug":"another-one-4",
            "closed":false,
            "project":{
                "id":229096,
                "name":"Zulip",
                "logo_big_url":null,
                "permalink":"https://tree.taiga.io/project/eeshangarg-zulip"
            },
            "estimated_start":"2018-10-25",
            "owner":{
                "full_name":"Eeshan Garg",
                "id":258659,
                "photo":null,
                "permalink":"https://tree.taiga.io/profile/eeshangarg",
                "gravatar_id":"cd181af88d928dab53c55600c9f7551d",
                "username":"eeshangarg"
            },
            "estimated_finish":"2018-11-03",
            "created_date":"2018-10-16T18:35:57.020Z",
            "modified_date":"2018-10-16T18:35:57.040Z",
            "disponibility":0.0,
            "id":206232,
            "name":"Another one"
        },
        "status":{
            "color":"#999999",
            "id":1148067,
            "name":"New",
            "slug":"new",
            "is_closed":false
        },
        "is_iocaine":false,
        "ref":10,
        "created_date":"2018-10-16T18:30:26.769Z"
    },
    "by":{
        "full_name":"Eeshan Garg",
        "id":258659,
        "photo":null,
        "permalink":"https://tree.taiga.io/profile/eeshangarg",
        "gravatar_id":"cd181af88d928dab53c55600c9f7551d",
        "username":"eeshangarg"
    },
    "change":{
        "edit_comment_date":null,
        "diff":{
            "user_story":{
                "from":"#7 Yaar ne scirra!",
                "to":"#8 A related user story, which is epic"
            },
            "milestone":{
                "from":null,
                "to":"Another one"
            },
            "taskboard_order":{
                "from":1539714626735,
                "to":0
            }
        },
        "comment_versions":null,
        "comment_html":"",
        "comment":"",
        "delete_comment_date":null
    }
}
```

--------------------------------------------------------------------------------

---[FILE: task_created.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_created.json

```json
{
  "data": {
    "modified_date": "2017-01-10T19:14:06.419Z",
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
    "description": "",
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
    "watchers": []
  },
  "action": "create",
  "type": "task",
  "date": "2017-01-10T19:14:06.655Z",
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

---[FILE: task_deleted.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/task_deleted.json

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
    "id": 1113810,
    "finished_date": null,
    "blocked_note": "",
    "modified_date": "2017-01-10T19:18:33.038Z",
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
    "custom_attributes_values": null,
    "milestone": null,
    "is_iocaine": false,
    "description": "New description",
    "assigned_to": null,
    "tags": [],
    "status": {
      "name": "In progress",
      "slug": "in-progress",
      "color": "#ff9900",
      "id": 853638,
      "is_closed": false
    },
    "subject": "New Task",
    "created_date": "2017-01-10T19:14:06.391Z"
  },
  "type": "task",
  "date": "2017-01-10T19:20:33.820Z"
}
```

--------------------------------------------------------------------------------

````
