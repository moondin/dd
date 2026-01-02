---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1145
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1145 of 1290)

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

---[FILE: conversation_reopened.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/conversation_reopened.json
Signals: Next.js, Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28du836"
  },
  "id": "evt_28du836",
  "type": "reopen",
  "emitted_at": 1518307972.956,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keo696",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keo696/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keo696/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keo696/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keo696/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keo696/inboxes"
      }
    },
    "id": "cnv_keo696",
    "subject": "Your next delivery is on Epsilon 96Z",
    "status": "assigned",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ie2",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keo696"
        }
      },
      "id": "msg_1176ie2",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518307909.541,
      "blurb": "There will be plenty of time to discuss your objections when and if you return. ",
      "body": "<div>There will be plenty of time to discuss your objections when and if you return.</div>",
      "text": "There will be plenty of time to discuss your objections when and if you return.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518307874.673
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_restored.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/conversation_restored.json
Signals: Next.js, Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28du86a"
  },
  "id": "evt_28du86a",
  "type": "restore",
  "emitted_at": 1518307981.377,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keo696",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keo696/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keo696/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keo696/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keo696/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keo696/inboxes"
      }
    },
    "id": "cnv_keo696",
    "subject": "Your next delivery is on Epsilon 96Z",
    "status": "assigned",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ie2",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keo696"
        }
      },
      "id": "msg_1176ie2",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518307909.541,
      "blurb": "There will be plenty of time to discuss your objections when and if you return. ",
      "body": "<div>There will be plenty of time to discuss your objections when and if you return.</div>",
      "text": "There will be plenty of time to discuss your objections when and if you return.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518307874.673
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_tagged.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/conversation_tagged.json
Signals: Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28duooi"
  },
  "id": "evt_28duooi",
  "type": "tag",
  "emitted_at": 1518309239.379,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keocka",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keocka/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keocka/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keocka/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keocka/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keocka/inboxes"
      }
    },
    "id": "cnv_keocka",
    "subject": "Being a robot is great, but...",
    "status": "unassigned",
    "assignee": null,
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "from"
    },
    "tags": [
      {
        "_links": {
          "self": "https://api2.frontapp.com/tags/tag_11dg2",
          "related": {
            "conversations": "https://api2.frontapp.com/tags/tag_11dg2/conversations"
          }
        },
        "id": "tag_11dg2",
        "name": "Urgent"
      }
    ],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176r8y",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka"
        }
      },
      "id": "msg_1176r8y",
      "type": "email",
      "is_inbound": true,
      "created_at": 1518309200,
      "blurb": "We don't have emotions, and sometimes that makes me very sad. ",
      "body": "<div>We don't have emotions, and sometimes that makes me very sad.</div>",
      "text": "We don't have emotions, and sometimes that makes me very sad.\n",
      "metadata": {},
      "author": null,
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518309203.872
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  },
  "target": {
    "_meta": {
      "type": "tag"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/tags/tag_11dg2",
        "related": {
          "conversations": "https://api2.frontapp.com/tags/tag_11dg2/conversations"
        }
      },
      "id": "tag_11dg2",
      "name": "Urgent"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_unassigned.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/conversation_unassigned.json
Signals: Next.js, Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28dubfu"
  },
  "id": "evt_28dubfu",
  "type": "unassign",
  "emitted_at": 1518308225.91,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keo696",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keo696/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keo696/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keo696/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keo696/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keo696/inboxes"
      }
    },
    "id": "cnv_keo696",
    "subject": "Your next delivery is on Epsilon 96Z",
    "status": "unassigned",
    "assignee": null,
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ie2",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keo696"
        }
      },
      "id": "msg_1176ie2",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518307909.541,
      "blurb": "There will be plenty of time to discuss your objections when and if you return. ",
      "body": "<div>There will be plenty of time to discuss your objections when and if you return.</div>",
      "text": "There will be plenty of time to discuss your objections when and if you return.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518307874.673
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_untagged.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/conversation_untagged.json
Signals: Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28dut36"
  },
  "id": "evt_28dut36",
  "type": "untag",
  "emitted_at": 1518309568.454,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keocka",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keocka/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keocka/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keocka/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keocka/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keocka/inboxes"
      }
    },
    "id": "cnv_keocka",
    "subject": "Re: Being a robot is great, but...",
    "status": "assigned",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ryy",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka",
          "message_replied_to": "https://api2.frontapp.com/messages/msg_1176r8y"
        }
      },
      "id": "msg_1176ryy",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518309342.896,
      "blurb": "Emotions are dumb and should be hated. ",
      "body": "<div>Emotions are dumb and should be hated.</div>",
      "text": "Emotions are dumb and should be hated.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518309203.872
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  },
  "target": {
    "_meta": {
      "type": "tag"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/tags/tag_11dg2",
        "related": {
          "conversations": "https://api2.frontapp.com/tags/tag_11dg2/conversations"
        }
      },
      "id": "tag_11dg2",
      "name": "Urgent"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: gmail.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/gmail.json
Signals: Next.js, Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28du7y2"
  },
  "id": "evt_28du7y2",
  "type": "archive",
  "emitted_at": 1518307966.678,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keo696",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keo696/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keo696/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keo696/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keo696/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keo696/inboxes"
      }
    },
    "id": "cnv_keo696",
    "subject": "Your next delivery is on Epsilon 96Z",
    "status": "archived",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ie2",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keo696"
        }
      },
      "id": "msg_1176ie2",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518307909.541,
      "blurb": "There will be plenty of time to discuss your objections when and if you return. ",
      "body": "<div>There will be plenty of time to discuss your objections when and if you return.</div>",
      "text": "There will be plenty of time to discuss your objections when and if you return.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518307874.673
  },
  "source": {
    "_meta": {
      "type": "gmail"
    },
    "data": null
  }
}
```

--------------------------------------------------------------------------------

---[FILE: inbound_message.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/inbound_message.json
Signals: Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28duo2q"
  },
  "id": "evt_28duo2q",
  "type": "inbound",
  "emitted_at": 1518309200,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keocka",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keocka/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keocka/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keocka/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keocka/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keocka/inboxes"
      }
    },
    "id": "2x9c5v",
    "subject": "Cancellation Request for Subscription #SUB-67890",
    "status": "unassigned",
    "assignee": null,
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "from"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176r8y",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka"
        }
      },
      "id": "msg_1176r8y",
      "type": "email",
      "is_inbound": true,
      "created_at": 1518309200,
      "blurb": "We don't have emotions, and sometimes that makes me very sad. ",
      "body": "<div>We don't have emotions, and sometimes that makes me very sad.</div>",
      "text": "We don't have emotions, and sometimes that makes me very sad.\n",
      "metadata": {},
      "author": null,
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518309203.872
  },
  "source": {
    "_meta": {
      "type": "inboxes"
    },
    "data": [
      {
        "_links": {
          "self": "https://api2.frontapp.com/inboxes/inb_6j96",
          "related": {
            "channels": "https://api2.frontapp.com/inboxes/inb_6j96/channels",
            "conversations": "https://api2.frontapp.com/inboxes/inb_6j96/conversations",
            "teammates": "https://api2.frontapp.com/inboxes/inb_6j96/teammates"
          }
        },
        "id": "inb_6j96",
        "address": "support@planet-express.com",
        "send_as": "support@planet-express.com",
        "name": "Support@",
        "type": "gmail"
      }
    ]
  },
  "target": {
    "_meta": {
      "type": "message"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176r8y",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka"
        }
      },
      "id": "msg_1176r8y",
      "type": "email",
      "is_inbound": true,
      "created_at": 1518309200,
      "blurb": "We don't have emotions, and sometimes that makes me very sad. ",
      "body": "<div>We don't have emotions, and sometimes that makes me very sad.</div>",
      "text": "We don't have emotions, and sometimes that makes me very sad.\n",
      "metadata": {},
      "author": null,
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "to"
        }
      ],
      "attachments": []
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: mention.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/mention.json
Signals: Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28duv9e"
  },
  "id": "evt_28duv9e",
  "type": "mention",
  "emitted_at": 1518309721.065,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keocka",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keocka/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keocka/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keocka/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keocka/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keocka/inboxes"
      }
    },
    "id": "cnv_keocka",
    "subject": "Re: Being a robot is great, but...",
    "status": "assigned",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ryy",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka",
          "message_replied_to": "https://api2.frontapp.com/messages/msg_1176r8y"
        }
      },
      "id": "msg_1176ryy",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518309342.896,
      "blurb": "Emotions are dumb and should be hated. ",
      "body": "<div>Emotions are dumb and should be hated.</div>",
      "text": "Emotions are dumb and should be hated.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518309203.872
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  },
  "target": {
    "_meta": {
      "type": "comment"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/comments/com_shgbu",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka",
          "mentions": "https://api2.frontapp.com/comments/com_shgbu/mentions"
        }
      },
      "id": "com_shgbu",
      "body": "@bender Could you take it from here?",
      "posted_at": 1518309720.998,
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: mention_all.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/mention_all.json
Signals: Next.js, Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28dubmi"
  },
  "id": "evt_28dubmi",
  "type": "mention",
  "emitted_at": 1518308240.489,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keo696",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keo696/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keo696/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keo696/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keo696/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keo696/inboxes"
      }
    },
    "id": "cnv_keo696",
    "subject": "Your next delivery is on Epsilon 96Z",
    "status": "unassigned",
    "assignee": null,
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ie2",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keo696"
        }
      },
      "id": "msg_1176ie2",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518307909.541,
      "blurb": "There will be plenty of time to discuss your objections when and if you return. ",
      "body": "<div>There will be plenty of time to discuss your objections when and if you return.</div>",
      "text": "There will be plenty of time to discuss your objections when and if you return.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518307874.673
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  },
  "target": {
    "_meta": {
      "type": "comment"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/comments/com_shgaq",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keo696",
          "mentions": "https://api2.frontapp.com/comments/com_shgaq/mentions"
        }
      },
      "id": "com_shgaq",
      "body": "@all Could someone else take this?",
      "posted_at": 1518308240.466,
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
