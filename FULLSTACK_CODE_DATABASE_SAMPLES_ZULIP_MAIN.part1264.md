---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1264
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1264 of 1290)

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

---[FILE: userstory_changed_assigned.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_assigned.json

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
  "date": "2017-01-10T18:35:04.263Z",
  "action": "change",
  "data": {
    "watchers": [],
    "client_requirement": false,
    "id": 1171601,
    "blocked_note": "",
    "modified_date": "2017-01-10T18:35:04.117Z",
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
    "description": "",
    "created_date": "2017-01-10T18:24:28.966Z",
    "points": [
      {
        "name": "?",
        "value": null,
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
    "assigned_to": {
      "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
      "id": 187698,
      "full_name": "TomaszKolek",
      "permalink": "https://tree.taiga.io/profile/kolaszek",
      "username": "kolaszek",
      "photo": null
    }
  },
  "type": "userstory"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_blocked.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_blocked.json

```json
{
  "change": {
    "diff": {
      "is_blocked": {
        "to": true,
        "from": false
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "userstory",
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
    "finish_date": null,
    "modified_date": "2017-01-10T18:24:41.767Z",
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
        "name": "?",
        "value": null,
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
      "name": "New",
      "slug": "new",
      "id": 1006445,
      "color": "#999999",
      "is_archived": false
    },
    "is_blocked": true,
    "project": {
      "name": "TomKol",
      "permalink": "https://tree.taiga.io/project/kolaszek-tomkol",
      "logo_big_url": null,
      "id": 170130
    },
    "external_reference": null,
    "description": "",
    "watchers": []
  },
  "date": "2017-01-10T18:24:41.909Z"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_closed.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_closed.json

```json
{
  "change": {
    "diff": {
      "status": {
        "to": "Done",
        "from": "New"
      },
      "finish_date": {
        "to": "2017-01-10 18:28:04.890549+00:00",
        "from": "None"
      },
      "is_closed": {
        "to": true,
        "from": false
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "userstory",
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
    "finish_date": "2017-01-10T18:28:04.890Z",
    "modified_date": "2017-01-10T18:28:04.839Z",
    "is_closed": true,
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
        "name": "?",
        "value": null,
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
      "is_closed": true,
      "name": "Done",
      "slug": "done",
      "id": 1006449,
      "color": "#669900",
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
    "description": "",
    "watchers": []
  },
  "date": "2017-01-10T18:28:05.074Z"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_comment_added.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_comment_added.json

```json
{
  "change": {
    "diff": {},
    "comment_versions": null,
    "comment_html": "<p>New comment</p>",
    "comment": "New comment\n",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "userstory",
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
    "finish_date": null,
    "modified_date": "2017-01-10T18:39:56.541Z",
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
        "name": "?",
        "value": null,
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
  "date": "2017-01-10T18:39:56.744Z"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_description.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_description.json

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
  "date": "2017-01-10T18:39:36.801Z",
  "action": "change",
  "data": {
    "watchers": [],
    "client_requirement": false,
    "id": 1171601,
    "blocked_note": "",
    "modified_date": "2017-01-10T18:39:36.609Z",
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
        "name": "?",
        "value": null,
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
  "type": "userstory"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_due_date.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_due_date.json

```json
{
    "action": "change",
    "type": "userstory",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-08T07:31:03.704Z",
    "data": {
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
        "modified_date": "2020-02-08T07:31:03.559Z",
        "finish_date": null,
        "due_date": "2020-02-22",
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
    "change": {
        "comment": "",
        "comment_html": "",
        "delete_comment_date": null,
        "comment_versions": null,
        "edit_comment_date": null,
        "diff": {
            "due_date": {
                "from": "2020-02-15",
                "to": "2020-02-22"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_new_due_date.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_new_due_date.json

```json
{
    "action": "change",
    "type": "userstory",
    "by": {
        "id": 404067,
        "permalink": "https://tree.taiga.io/profile/orientor",
        "username": "orientor",
        "full_name": "Aditya Verma",
        "photo": null,
        "gravatar_id": "b72a822f0f5b7cf0c159a707af5150a1"
    },
    "date": "2020-02-08T07:42:35.196Z",
    "data": {
        "custom_attributes_values": {},
        "id": 3133822,
        "ref": 58,
        "project": {
            "id": 351023,
            "permalink": "https://tree.taiga.io/project/orientor-sd",
            "name": "sd",
            "logo_big_url": null
        },
        "is_closed": false,
        "created_date": "2020-02-08T07:41:23.565Z",
        "modified_date": "2020-02-08T07:42:35.082Z",
        "finish_date": null,
        "due_date": "2020-02-15",
        "due_date_reason": "",
        "subject": "random",
        "client_requirement": true,
        "team_requirement": false,
        "generated_from_issue": 1312134,
        "generated_from_task": null,
        "external_reference": null,
        "tribe_gig": null,
        "watchers": [],
        "is_blocked": false,
        "blocked_note": "",
        "description": "",
        "tags": [],
        "permalink": "https://tree.taiga.io/project/orientor-sd/us/58",
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
    "change": {
        "comment": "",
        "comment_html": "",
        "delete_comment_date": null,
        "comment_versions": null,
        "edit_comment_date": null,
        "diff": {
            "due_date": {
                "from": null,
                "to": "2020-02-15"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_new_sprint.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_new_sprint.json

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
      "milestone": {
        "from": null,
        "to": "Sprint1"
      },
      "sprint_order": {
        "from": 1484072668937,
        "to": 0
      }
    }
  },
  "date": "2017-01-10T19:03:22.862Z",
  "action": "change",
  "data": {
    "watchers": [
      187698
    ],
    "client_requirement": false,
    "id": 1171601,
    "blocked_note": "",
    "modified_date": "2017-01-10T19:03:22.655Z",
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
    "milestone": {
      "name": "Sprint1",
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
      "modified_date": "2017-01-10T19:03:05.241Z",
      "estimated_finish": "2017-01-24",
      "disponibility": 0.0,
      "slug": "sprint1-1076",
      "created_date": "2017-01-10T19:03:05.222Z",
      "id": 112892,
      "closed": false
    },
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
  "type": "userstory"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_points.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_points.json

```json
{
  "change": {
    "diff": {
      "points": {
        "UX": {
          "to": "5",
          "from": "?"
        }
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "userstory",
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
    "finish_date": null,
    "modified_date": "2017-01-10T19:02:19.535Z",
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
  "date": "2017-01-10T19:02:19.731Z"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_reassigned.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_reassigned.json

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
  "type": "userstory",
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
    "finish_date": null,
    "modified_date": "2017-01-10T18:35:34.621Z",
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
        "name": "?",
        "value": null,
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
    "description": "",
    "watchers": []
  },
  "date": "2017-01-10T18:35:34.751Z"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_remove_sprint.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_remove_sprint.json

```json
{
  "change": {
    "diff": {
      "backlog_order": {
        "to": 0,
        "from": 1484072668937
      },
      "milestone": {
        "to": null,
        "from": "Sprint2"
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "userstory",
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
  "date": "2017-01-10T19:04:34.926Z"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_reopened.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_reopened.json

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
      "finish_date": {
        "from": "2017-01-10 18:28:04.890549+00:00",
        "to": "None"
      },
      "status": {
        "from": "Done",
        "to": "Ready"
      },
      "is_closed": {
        "from": true,
        "to": false
      }
    }
  },
  "date": "2017-01-10T18:28:24.669Z",
  "action": "change",
  "data": {
    "watchers": [],
    "client_requirement": false,
    "id": 1171601,
    "blocked_note": "",
    "modified_date": "2017-01-10T18:28:24.456Z",
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
    "description": "",
    "created_date": "2017-01-10T18:24:28.966Z",
    "points": [
      {
        "name": "?",
        "value": null,
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
      "name": "Ready",
      "id": 1006446,
      "color": "#ff8a84",
      "is_archived": false,
      "slug": "ready",
      "is_closed": false
    },
    "assigned_to": null
  },
  "type": "userstory"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_sprint.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_sprint.json

```json
{
  "change": {
    "diff": {
      "milestone": {
        "to": "Sprint2",
        "from": "Sprint1"
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "userstory",
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
    "finish_date": null,
    "modified_date": "2017-01-10T19:03:47.403Z",
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
    "milestone": {
      "owner": {
        "gravatar_id": "a2f998f1e3c224fc53cf1d595718961e",
        "permalink": "https://tree.taiga.io/profile/kolaszek",
        "username": "kolaszek",
        "photo": null,
        "id": 187698,
        "full_name": "TomaszKolek"
      },
      "modified_date": "2017-01-10T19:03:14.367Z",
      "created_date": "2017-01-10T19:03:14.349Z",
      "estimated_finish": "2017-02-07",
      "id": 112893,
      "name": "Sprint2",
      "slug": "sprint2-383",
      "project": {
        "name": "TomKol",
        "permalink": "https://tree.taiga.io/project/kolaszek-tomkol",
        "logo_big_url": null,
        "id": 170130
      },
      "estimated_start": "2017-01-24",
      "closed": false,
      "disponibility": 0.0
    },
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
  "date": "2017-01-10T19:03:47.584Z"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_status.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_status.json

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
        "from": "Ready",
        "to": "In progress"
      }
    }
  },
  "date": "2017-01-10T18:32:46.503Z",
  "action": "change",
  "data": {
    "watchers": [],
    "client_requirement": false,
    "id": 1171601,
    "blocked_note": "",
    "modified_date": "2017-01-10T18:32:46.277Z",
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
    "description": "",
    "created_date": "2017-01-10T18:24:28.966Z",
    "points": [
      {
        "name": "?",
        "value": null,
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
  "type": "userstory"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_subject.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_subject.json

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
      "subject": {
        "from": "UserStory",
        "to": "UserStoryNewSubject"
      }
    }
  },
  "date": "2017-01-10T18:32:10.138Z",
  "action": "change",
  "data": {
    "watchers": [],
    "client_requirement": false,
    "id": 1171601,
    "blocked_note": "",
    "modified_date": "2017-01-10T18:32:09.972Z",
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
    "subject": "UserStoryNewSubject",
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
    "description": "",
    "created_date": "2017-01-10T18:24:28.966Z",
    "points": [
      {
        "name": "?",
        "value": null,
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
      "name": "Ready",
      "id": 1006446,
      "color": "#ff8a84",
      "is_archived": false,
      "slug": "ready",
      "is_closed": false
    },
    "assigned_to": null
  },
  "type": "userstory"
}
```

--------------------------------------------------------------------------------

---[FILE: userstory_changed_unassigned.json]---
Location: zulip-main/zerver/webhooks/taiga/fixtures/userstory_changed_unassigned.json

```json
{
  "change": {
    "diff": {
      "assigned_to": {
        "to": null,
        "from": "TomaszKolek"
      }
    },
    "comment_versions": null,
    "comment_html": "",
    "comment": "",
    "delete_comment_date": null,
    "edit_comment_date": null
  },
  "type": "userstory",
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
    "finish_date": null,
    "modified_date": "2017-01-10T18:35:34.621Z",
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
        "name": "?",
        "value": null,
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
    "description": "",
    "watchers": []
  },
  "date": "2017-01-10T18:35:34.751Z"
}
```

--------------------------------------------------------------------------------

````
