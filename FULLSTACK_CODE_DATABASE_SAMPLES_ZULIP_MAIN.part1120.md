---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1120
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1120 of 1290)

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

---[FILE: todo_created.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/todo_created.json

```json
{
  "id": 657033622,
  "kind": "todo_created",
  "details": {},
  "created_at": "2017-03-13T08:25:28.399+01:00",
  "recording": {
    "id": 427055624,
    "status": "active",
    "created_at": "2017-03-13T08:25:28.380+01:00",
    "updated_at": "2017-03-13T08:25:28.386+01:00",
    "type": "Todo",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/todos/427055624.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todos/427055624",
    "parent": {
      "id": 427050190,
      "title": "NEW Name TO DO LIST ",
      "type": "Todolist",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/todolists/427050190.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todolists/427050190"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "New task",
    "content": "New task"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: todo_due_on_changed.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/todo_due_on_changed.json

```json
{
  "id": 657034435,
  "kind": "todo_due_on_changed",
  "details": {},
  "created_at": "2017-03-13T08:27:14.412+01:00",
  "recording": {
    "id": 427055624,
    "status": "active",
    "created_at": "2017-03-13T08:25:28.380+01:00",
    "updated_at": "2017-03-13T08:27:14.406+01:00",
    "type": "Todo",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/todos/427055624.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todos/427055624",
    "parent": {
      "id": 427050190,
      "title": "NEW Name TO DO LIST ",
      "type": "Todolist",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/todolists/427050190.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todolists/427050190"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "New task",
    "content": "New task"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: todo_list_created.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/todo_list_created.json

```json
{
  "id": 657024888,
  "kind": "todolist_created",
  "details": {},
  "created_at": "2017-03-13T08:15:41.930+01:00",
  "recording": {
    "id": 427050190,
    "status": "active",
    "created_at": "2017-03-13T08:15:41.915+01:00",
    "updated_at": "2017-03-13T08:15:41.921+01:00",
    "type": "Todolist",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/todolists/427050190.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todolists/427050190",
    "parent": {
      "id": 419211304,
      "title": "To-dos",
      "type": "Todoset",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/todosets/419211304.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todosets/419211304"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "NEW TO DO LIST",
    "content": ""
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: todo_list_description_changed.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/todo_list_description_changed.json

```json
{
  "id": 657032933,
  "kind": "todolist_description_changed",
  "details": {},
  "created_at": "2017-03-13T08:24:23.570+01:00",
  "recording": {
    "id": 427050190,
    "status": "active",
    "created_at": "2017-03-13T08:15:41.915+01:00",
    "updated_at": "2017-03-13T08:24:23.563+01:00",
    "type": "Todolist",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/todolists/427050190.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todolists/427050190",
    "parent": {
      "id": 419211304,
      "title": "To-dos",
      "type": "Todoset",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/todosets/419211304.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todosets/419211304"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "NEW TO DO LIST",
    "content": "\u003cdiv\u003eNew description\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: todo_list_name_changed.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/todo_list_name_changed.json

```json
{
  "id": 657032392,
  "kind": "todolist_name_changed",
  "details": {},
  "created_at": "2017-03-13T08:23:21.882+01:00",
  "recording": {
    "id": 427050190,
    "status": "active",
    "created_at": "2017-03-13T08:15:41.915+01:00",
    "updated_at": "2017-03-13T08:23:21.875+01:00",
    "type": "Todolist",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/todolists/427050190.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todolists/427050190",
    "parent": {
      "id": 419211304,
      "title": "To-dos",
      "type": "Todoset",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/todosets/419211304.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todosets/419211304"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "NEW Name TO DO LIST",
    "content": ""
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: todo_uncompleted.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/todo_uncompleted.json

```json
{
  "id": 657034085,
  "kind": "todo_uncompleted",
  "details": {},
  "created_at": "2017-03-13T08:26:26.812+01:00",
  "recording": {
    "id": 427055624,
    "status": "active",
    "created_at": "2017-03-13T08:25:28.380+01:00",
    "updated_at": "2017-03-13T08:26:26.806+01:00",
    "type": "Todo",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/todos/427055624.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todos/427055624",
    "parent": {
      "id": 427050190,
      "title": "NEW Name TO DO LIST ",
      "type": "Todolist",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/todolists/427050190.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todolists/427050190"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "New task",
    "content": "New task"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/beanstalk/doc.md

```text
Zulip supports both SVN and Git notifications from Beanstalk.

1. {!create-channel.md!}

1. {!create-an-incoming-webhook.md!}

    {!webhook-url-with-bot-email.md!}

1. On your repository's webpage, click on the **Settings**
   tab. Click on the **Integrations** tab, scroll down and click on
   **Modular Webhooks**. Click on **Add a webhook**.

1. Set **Name** to a name of your choice, such as `Zulip`.
   Set **URL** to the URL constructed above. Under
   **Select webhook triggers**, check the events that you would
   like to receive notifications for, and click **Activate**.

{!congrats.md!}

![](/static/images/integrations/beanstalk/001.png)
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/beanstalk/tests.py

```python
from unittest.mock import MagicMock, patch

from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase
from zerver.lib.webhooks.git import COMMITS_LIMIT


class BeanstalkHookTests(WebhookTestCase):
    CHANNEL_NAME = "commits"
    URL_TEMPLATE = "/api/v1/external/beanstalk?stream={stream}"

    def test_git_single(self) -> None:
        expected_topic_name = "work-test / master"
        expected_message = """Leo Franchi [pushed](http://lfranchi-svn.beanstalkapp.com/work-test) 1 commit to branch master.

* add some stuff ([e50508df24c](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/e50508df))"""
        self.api_channel_message(
            self.test_user,
            "git_singlecommit",
            expected_topic_name,
            expected_message,
            content_type=None,
        )

    def test_git_single_filtered_by_branches(self) -> None:
        self.url = self.build_webhook_url(branches="master,development")
        expected_topic_name = "work-test / master"
        expected_message = """Leo Franchi [pushed](http://lfranchi-svn.beanstalkapp.com/work-test) 1 commit to branch master.

* add some stuff ([e50508df24c](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/e50508df))"""
        self.api_channel_message(
            self.test_user,
            "git_singlecommit",
            expected_topic_name,
            expected_message,
            content_type=None,
        )

    def test_git_multiple_committers(self) -> None:
        expected_topic_name = "work-test / master"
        expected_message = """Leo Franchi [pushed](http://lfranchi-svn.beanstalkapp.com/work-test) 3 commits to branch master. Commits by Leo Franchi (2) and Tomasz Kolek (1).

* Added new file ([edf529c7a64](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/edf529c7))
* Filled in new file with some stuff ([c2a191b9e79](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/c2a191b9))
* More work to fix some bugs ([20098158e20](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/20098158))"""
        self.api_channel_message(
            self.test_user,
            "git_multiple_committers",
            expected_topic_name,
            expected_message,
            content_type=None,
        )

    def test_git_multiple_committers_filtered_by_branches(self) -> None:
        self.url = self.build_webhook_url(branches="master,development")
        expected_topic_name = "work-test / master"
        expected_message = """Leo Franchi [pushed](http://lfranchi-svn.beanstalkapp.com/work-test) 3 commits to branch master. Commits by Leo Franchi (2) and Tomasz Kolek (1).

* Added new file ([edf529c7a64](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/edf529c7))
* Filled in new file with some stuff ([c2a191b9e79](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/c2a191b9))
* More work to fix some bugs ([20098158e20](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/20098158))"""
        self.api_channel_message(
            self.test_user,
            "git_multiple_committers",
            expected_topic_name,
            expected_message,
            content_type=None,
        )

    def test_git_multiple(self) -> None:
        expected_topic_name = "work-test / master"
        expected_message = """Leo Franchi [pushed](http://lfranchi-svn.beanstalkapp.com/work-test) 3 commits to branch master.

* Added new file ([edf529c7a64](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/edf529c7))
* Filled in new file with some stuff ([c2a191b9e79](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/c2a191b9))
* More work to fix some bugs ([20098158e20](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/20098158))"""
        self.api_channel_message(
            self.test_user, "git_multiple", expected_topic_name, expected_message, content_type=None
        )

    def test_git_multiple_filtered_by_branches(self) -> None:
        self.url = self.build_webhook_url(branches="master,development")
        expected_topic_name = "work-test / master"
        expected_message = """Leo Franchi [pushed](http://lfranchi-svn.beanstalkapp.com/work-test) 3 commits to branch master.

* Added new file ([edf529c7a64](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/edf529c7))
* Filled in new file with some stuff ([c2a191b9e79](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/c2a191b9))
* More work to fix some bugs ([20098158e20](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/20098158))"""
        self.api_channel_message(
            self.test_user, "git_multiple", expected_topic_name, expected_message, content_type=None
        )

    def test_git_more_than_limit(self) -> None:
        commits_info = "* add some stuff ([e50508df24c](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/e50508df))\n"
        expected_topic_name = "work-test / master"
        expected_message = f"""Leo Franchi [pushed](http://lfranchi-svn.beanstalkapp.com/work-test) 50 commits to branch master.

{(commits_info * COMMITS_LIMIT)}[and {50 - COMMITS_LIMIT} more commit(s)]"""
        self.api_channel_message(
            self.test_user,
            "git_morethanlimitcommits",
            expected_topic_name,
            expected_message,
            content_type=None,
        )

    def test_git_more_than_limit_filtered_by_branches(self) -> None:
        self.url = self.build_webhook_url(branches="master,development")
        commits_info = "* add some stuff ([e50508df24c](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/e50508df))\n"
        expected_topic_name = "work-test / master"
        expected_message = f"""Leo Franchi [pushed](http://lfranchi-svn.beanstalkapp.com/work-test) 50 commits to branch master.

{(commits_info * COMMITS_LIMIT)}[and {50 - COMMITS_LIMIT} more commit(s)]"""
        self.api_channel_message(
            self.test_user,
            "git_morethanlimitcommits",
            expected_topic_name,
            expected_message,
            content_type=None,
        )

    @patch("zerver.webhooks.beanstalk.view.check_send_webhook_message")
    def test_git_single_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url(branches="changes,development")
        payload = self.get_payload("git_singlecommit")
        result = self.api_post(self.test_user, self.url, payload)
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    @patch("zerver.webhooks.beanstalk.view.check_send_webhook_message")
    def test_git_multiple_committers_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url(branches="changes,development")
        payload = self.get_payload("git_multiple_committers")
        result = self.api_post(self.test_user, self.url, payload)
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    @patch("zerver.webhooks.beanstalk.view.check_send_webhook_message")
    def test_git_multiple_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url(branches="changes,development")
        payload = self.get_payload("git_multiple")
        result = self.api_post(self.test_user, self.url, payload)
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    @patch("zerver.webhooks.beanstalk.view.check_send_webhook_message")
    def test_git_more_than_limit_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url(branches="changes,development")
        payload = self.get_payload("git_morethanlimitcommits")
        result = self.api_post(self.test_user, self.url, payload)
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    def test_svn_addremove(self) -> None:
        expected_topic_name = "svn r3"
        expected_message = """Leo Franchi pushed [revision 3](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/3):

> Removed a file and added another one!"""
        self.api_channel_message(
            self.test_user,
            "svn_addremove",
            expected_topic_name,
            expected_message,
            content_type=None,
        )

    def test_svn_changefile(self) -> None:
        expected_topic_name = "svn r2"
        expected_message = """Leo Franchi pushed [revision 2](http://lfranchi-svn.beanstalkapp.com/work-test/changesets/2):

> Added some code"""
        self.api_channel_message(
            self.test_user,
            "svn_changefile",
            expected_topic_name,
            expected_message,
            content_type=None,
        )

    @override
    def get_payload(self, fixture_name: str) -> dict[str, str]:
        return {"payload": self.webhook_fixture_data("beanstalk", fixture_name)}
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/beanstalk/view.py
Signals: Django, Pydantic

```python
# Webhooks for external integrations.
import re

from django.http import HttpRequest, HttpResponse
from pydantic import Json

from zerver.decorator import authenticated_rest_api_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.lib.webhooks.git import (
    TOPIC_WITH_BRANCH_TEMPLATE,
    get_push_commits_event_message,
    is_branch_name_notifiable,
)
from zerver.models import UserProfile


def build_message_from_gitlog(
    user_profile: UserProfile,
    name: str,
    ref: str,
    commits: WildValue,
    before: str,
    after: str,
    url: str,
    pusher: str,
    forced: str | None = None,
    created: str | None = None,
    deleted: bool = False,
) -> tuple[str, str]:
    short_ref = re.sub(r"^refs/heads/", "", ref)
    topic_name = TOPIC_WITH_BRANCH_TEMPLATE.format(repo=name, branch=short_ref)

    commits_data = _transform_commits_list_to_common_format(commits)
    content = get_push_commits_event_message(pusher, url, short_ref, commits_data, deleted=deleted)

    return topic_name, content


def _transform_commits_list_to_common_format(commits: WildValue) -> list[dict[str, str]]:
    return [
        {
            "name": commit["author"]["name"].tame(check_string),
            "sha": commit["id"].tame(check_string),
            "url": commit["url"].tame(check_string),
            "message": commit["message"].tame(check_string),
        }
        for commit in commits
    ]


@authenticated_rest_api_view(
    webhook_client_name="Beanstalk",
    # Beanstalk's web hook UI rejects URL with a @ in the username section
    # So we ask the user to replace them with %40
    beanstalk_email_decode=True,
)
@typed_endpoint
def api_beanstalk_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: Json[WildValue],
    branches: str | None = None,
) -> HttpResponse:
    # Beanstalk supports both SVN and Git repositories
    # We distinguish between the two by checking for a
    # 'uri' key that is only present for Git repos
    git_repo = "uri" in payload
    if git_repo:
        branch = payload["branch"].tame(check_string)
        if not is_branch_name_notifiable(branch, branches):
            return json_success(request)

        topic_name, content = build_message_from_gitlog(
            user_profile,
            payload["repository"]["name"].tame(check_string),
            payload["ref"].tame(check_string),
            payload["commits"],
            payload["before"].tame(check_string),
            payload["after"].tame(check_string),
            payload["repository"]["url"].tame(check_string),
            payload["pusher_name"].tame(check_string),
        )
    else:
        author = payload["author_full_name"].tame(check_string)
        url = payload["changeset_url"].tame(check_string)
        revision = payload["revision"].tame(check_int)
        (short_commit_msg, _, _) = payload["message"].tame(check_string).partition("\n")

        topic_name = f"svn r{revision}"
        content = f"{author} pushed [revision {revision}]({url}):\n\n> {short_commit_msg}"

    check_send_webhook_message(request, user_profile, topic_name, content)
    return json_success(request)
```

--------------------------------------------------------------------------------

````
