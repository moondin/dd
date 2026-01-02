---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1214
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1214 of 1290)

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

---[FILE: conversation_admin_assigned.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_admin_assigned.json

```json
{
    "type":"notification_event",
    "app_id":"i6wc9ipe",
    "data":{
        "type":"notification_event_data",
        "item":{
            "type":"conversation",
            "id":"21322009097",
            "created_at":1553290933,
            "updated_at":1553291111,
            "user":{
                "type":"lead",
                "id":"5c9553cb27e377f24eed49f7",
                "user_id":"75067020-1204-495c-8edc-abb7d88bdd43",
                "name":"Eeshan Garg",
                "email":"jerryguitarist@gmail.com",
                "do_not_track":null
            },
            "assignee":{
                "type":"admin",
                "id":"1957471",
                "name":"Tim Abbott",
                "email":"tim@zulip.com"
            },
            "conversation_message":{
                "type":"conversation_message",
                "id":"331499307",
                "url":"http://localhost:9991/api/",
                "subject":"",
                "body":"<p>Hello</p>",
                "author":{
                    "type":"user",
                    "id":"5c9553cb27e377f24eed49f7"
                },
                "attachments":[

                ]
            },
            "conversation_parts":{
                "type":"conversation_part.list",
                "conversation_parts":[
                    {
                        "type":"conversation_part",
                        "id":"2824382500",
                        "part_type":"assignment",
                        "body":"<p>Hey Eeshan! How can I help?</p>",
                        "created_at":1553291111,
                        "updated_at":1553291111,
                        "notified_at":1553291111,
                        "assigned_to":{
                            "type":"admin",
                            "id":"1957471",
                            "name":"Eeshan Garg"
                        },
                        "author":{
                            "type":"admin",
                            "id":"1957471",
                            "name":"Eeshan Garg"
                        },
                        "attachments":[

                        ],
                        "external_id":null
                    }
                ],
                "total_count":1
            },
            "open":true,
            "state":"open",
            "snoozed_until":null,
            "read":false,
            "metadata":{

            },
            "tags":{
                "type":"tag.list",
                "tags":[

                ]
            },
            "tags_added":{
                "type":"tag.list",
                "tags":[

                ]
            },
            "links":{
                "conversation_web":"https://app.intercom.io/a/apps/i6wc9ipe/conversations/21322009097"
            }
        }
    },
    "links":{

    },
    "id":"notif_b577ea09-0998-45cf-ade1-df4d102a58ec",
    "topic":"conversation.admin.assigned",
    "delivery_status":"pending",
    "delivery_attempts":1,
    "delivered_at":0,
    "first_sent_at":1553291112,
    "created_at":1553291112,
    "self":null
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_admin_closed.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_admin_closed.json

```json
{
    "type":"notification_event",
    "app_id":"i6wc9ipe",
    "data":{
        "type":"notification_event_data",
        "item":{
            "type":"conversation",
            "id":"21322009097",
            "created_at":1553290933,
            "updated_at":1553291389,
            "user":{
                "type":"lead",
                "id":"5c9553cb27e377f24eed49f7",
                "user_id":"75067020-1204-495c-8edc-abb7d88bdd43",
                "name":"Eeshan Garg",
                "email":"jerryguitarist@gmail.com",
                "do_not_track":null
            },
            "assignee":{
                "type":"admin",
                "id":"1957471",
                "name":"Cordelia, Lear's daughter",
                "email":"cordelia@zulip.com"
            },
            "conversation_message":{
                "type":"conversation_message",
                "id":"331499307",
                "url":"http://localhost:9991/api/",
                "subject":"",
                "body":"<p>Hello</p>",
                "author":{
                    "type":"user",
                    "id":"5c9553cb27e377f24eed49f7"
                },
                "attachments":[

                ]
            },
            "conversation_parts":{
                "type":"conversation_part.list",
                "conversation_parts":[
                    {
                        "type":"conversation_part",
                        "id":"2824395628",
                        "part_type":"close",
                        "body":null,
                        "created_at":1553291389,
                        "updated_at":1553291389,
                        "notified_at":1553291389,
                        "assigned_to":null,
                        "author":{
                            "type":"admin",
                            "id":"1957471",
                            "name":"Eeshan Garg"
                        },
                        "attachments":[

                        ],
                        "external_id":null
                    }
                ],
                "total_count":1
            },
            "open":false,
            "state":"closed",
            "snoozed_until":null,
            "read":true,
            "metadata":{

            },
            "tags":{
                "type":"tag.list",
                "tags":[

                ]
            },
            "tags_added":{
                "type":"tag.list",
                "tags":[

                ]
            },
            "links":{
                "conversation_web":"https://app.intercom.io/a/apps/i6wc9ipe/conversations/21322009097"
            }
        }
    },
    "links":{

    },
    "id":"notif_2bc4bf3a-0064-4fb0-9e17-dc44d91bcb9b",
    "topic":"conversation.admin.closed",
    "delivery_status":"pending",
    "delivery_attempts":1,
    "delivered_at":0,
    "first_sent_at":1553291390,
    "created_at":1553291390,
    "self":null
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_admin_noted.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_admin_noted.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "conversation",
            "id": "21330067382",
            "created_at": 1553378082,
            "updated_at": 1553378536,
            "user": {
                "type": "lead",
                "id": "5c9553cb27e377f24eed49f7",
                "user_id": "75067020-1204-495c-8edc-abb7d88bdd43",
                "name": "Eeshan Garg",
                "email": "jerryguitarist@gmail.com",
                "do_not_track": null
            },
            "assignee": {
                "type": "admin",
                "id": "1957471",
                "name": "Cordelia, Lear's daughter",
                "email": "cordelia@zulip.com"
            },
            "conversation_message": {
                "type": "conversation_message",
                "id": "331786931",
                "url": "http://localhost:9991/api/",
                "subject": "",
                "body": "<p>Hey! I'd like to set up a new account</p>",
                "author": {
                    "type": "user",
                    "id": "5c9553cb27e377f24eed49f7"
                },
                "attachments": []
            },
            "conversation_parts": {
                "type": "conversation_part.list",
                "conversation_parts": [
                    {
                        "type": "conversation_part",
                        "id": "2826904904",
                        "part_type": "note",
                        "body": "<p>Talk to Tim about this user's query.</p>",
                        "created_at": 1553378536,
                        "updated_at": 1553378536,
                        "notified_at": 1553378536,
                        "assigned_to": null,
                        "author": {
                            "type": "admin",
                            "id": "1957471",
                            "name": "Eeshan Garg"
                        },
                        "attachments": [],
                        "external_id": null
                    }
                ],
                "total_count": 1
            },
            "open": true,
            "state": "open",
            "snoozed_until": null,
            "read": true,
            "metadata": {},
            "tags": {
                "type": "tag.list",
                "tags": []
            },
            "tags_added": {
                "type": "tag.list",
                "tags": []
            },
            "links": {
                "conversation_web": "https://app.intercom.io/a/apps/i6wc9ipe/conversations/21330067382"
            }
        }
    },
    "links": {},
    "id": "notif_2087a079-b2de-408b-8f30-8d56695fe2d9",
    "topic": "conversation.admin.noted",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553378537,
    "created_at": 1553378537,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_admin_opened.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_admin_opened.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "conversation",
            "id": "21330229536",
            "created_at": 1553380785,
            "updated_at": 1553380931,
            "user": {
                "type": "lead",
                "id": "5c96b58c27e3772c4751b2a3",
                "user_id": "ced6189f-e3b0-40b6-ab3a-9fdb27f4b3b0",
                "name": "Cordelia, Lear's daughter",
                "email": "eg3800@mun.ca",
                "do_not_track": null
            },
            "assignee": {
                "type": "admin",
                "id": "1957471",
                "name": "Eeshan Garg",
                "email": "jerryguitarist@gmail.com"
            },
            "conversation_message": {
                "type": "conversation_message",
                "id": "331793703",
                "url": "http://localhost:9991/integrations/",
                "subject": "",
                "body": "<p>Hello</p>",
                "author": {
                    "type": "user",
                    "id": "5c96b58c27e3772c4751b2a3"
                },
                "attachments": []
            },
            "conversation_parts": {
                "type": "conversation_part.list",
                "conversation_parts": [
                    {
                        "type": "conversation_part",
                        "id": "2826953202",
                        "part_type": "open",
                        "body": null,
                        "created_at": 1553380931,
                        "updated_at": 1553380931,
                        "notified_at": 1553380931,
                        "assigned_to": {
                            "type": "admin",
                            "id": "1957471",
                            "name": "Eeshan Garg"
                        },
                        "author": {
                            "type": "admin",
                            "id": "1957471",
                            "name": "Eeshan Garg"
                        },
                        "attachments": [],
                        "external_id": null
                    }
                ],
                "total_count": 1
            },
            "open": true,
            "state": "open",
            "snoozed_until": null,
            "read": true,
            "metadata": {},
            "tags": {
                "type": "tag.list",
                "tags": []
            },
            "tags_added": {
                "type": "tag.list",
                "tags": []
            },
            "links": {
                "conversation_web": "https://app.intercom.io/a/apps/i6wc9ipe/conversations/21330229536"
            }
        }
    },
    "links": {},
    "id": "notif_d8906f30-db91-466e-9be2-4715fce4ab8b",
    "topic": "conversation.admin.opened",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553380932,
    "created_at": 1553380932,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_admin_replied.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_admin_replied.json

```json
{
    "type":"notification_event",
    "app_id":"i6wc9ipe",
    "data":{
        "type":"notification_event_data",
        "item":{
            "type":"conversation",
            "id":"21322009097",
            "created_at":1553290933,
            "updated_at":1553291111,
            "user":{
                "type":"lead",
                "id":"5c9553cb27e377f24eed49f7",
                "user_id":"75067020-1204-495c-8edc-abb7d88bdd43",
                "name":"Eeshan Garg",
                "email":"jerryguitarist@gmail.com",
                "do_not_track":null
            },
            "assignee":{
                "type": "admin",
                "id": "1957471",
                "name": "Cordelia, Lear's daughter",
                "email": "cordelia@zulip.com"
            },
            "conversation_message":{
                "type":"conversation_message",
                "id":"331499307",
                "url":"http://localhost:9991/api/",
                "subject":"",
                "body":"<p>Hello</p>",
                "author":{
                    "type":"user",
                    "id":"5c9553cb27e377f24eed49f7"
                },
                "attachments":[

                ]
            },
            "conversation_parts":{
                "type":"conversation_part.list",
                "conversation_parts":[
                    {
                        "type":"conversation_part",
                        "id":"2824382500",
                        "part_type":"assignment",
                        "body":"<p>Hey Eeshan! How can I help?</p>",
                        "created_at":1553291111,
                        "updated_at":1553291111,
                        "notified_at":1553291111,
                        "assigned_to":{
                            "type":"admin",
                            "id":"1957471",
                            "name":"Eeshan Garg"
                        },
                        "author":{
                            "type":"admin",
                            "id":"1957471",
                            "name":"Eeshan Garg"
                        },
                        "attachments":[

                        ],
                        "external_id":null
                    }
                ],
                "total_count":1
            },
            "open":true,
            "state":"open",
            "snoozed_until":null,
            "read":false,
            "metadata":{

            },
            "tags":{
                "type":"tag.list",
                "tags":[

                ]
            },
            "tags_added":{
                "type":"tag.list",
                "tags":[

                ]
            },
            "links":{
                "conversation_web":"https://app.intercom.io/a/apps/i6wc9ipe/conversations/21322009097"
            }
        }
    },
    "links":{

    },
    "id":"notif_44d1f763-d3ad-4927-8e5c-da6cd6ca78d2",
    "topic":"conversation.admin.replied",
    "delivery_status":"pending",
    "delivery_attempts":1,
    "delivered_at":0,
    "first_sent_at":1553291112,
    "created_at":1553291112,
    "self":null
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_admin_single_created.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_admin_single_created.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "conversation",
            "id": "21330075292",
            "created_at": 1553378181,
            "updated_at": 1553378181,
            "user": {
                "type": "lead",
                "id": "5c9553cb27e377f24eed49f7",
                "user_id": "75067020-1204-495c-8edc-abb7d88bdd43",
                "name": "Eeshan Garg",
                "email": "jerryguitarist@gmail.com",
                "do_not_track": null
            },
            "assignee": {
                "type": "admin",
                "id": "1957471",
                "name": "Cordelia, Lear's daughter",
                "email": "cordelia@zulip.com"
            },
            "conversation_message": {
                "type": "conversation_message",
                "id": "331787154",
                "url": null,
                "subject": "Hello",
                "body": "<p>Hi Eeshan, What's up</p>",
                "author": {
                    "type": "admin",
                    "id": "1957471"
                },
                "attachments": []
            },
            "conversation_parts": {
                "type": "conversation_part.list",
                "conversation_parts": [],
                "total_count": 0
            },
            "open": false,
            "state": "closed",
            "snoozed_until": null,
            "read": false,
            "metadata": {},
            "tags": {
                "type": "tag.list",
                "tags": []
            },
            "tags_added": {
                "type": "tag.list",
                "tags": []
            },
            "links": {
                "conversation_web": "https://app.intercom.io/a/apps/i6wc9ipe/conversations/21330075292"
            }
        }
    },
    "links": {},
    "id": "notif_ca44c80b-1eaa-411c-b10f-046890017eea",
    "topic": "conversation.admin.single.created",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553378181,
    "created_at": 1553378181,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_admin_snoozed.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_admin_snoozed.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "conversation",
            "id": "21330067382",
            "created_at": 1553378082,
            "updated_at": 1553378413,
            "user": {
                "type": "lead",
                "id": "5c9553cb27e377f24eed49f7",
                "user_id": "75067020-1204-495c-8edc-abb7d88bdd43",
                "name": "Eeshan Garg",
                "email": "jerryguitarist@gmail.com",
                "do_not_track": null
            },
            "assignee": {
                "type": "admin",
                "id": "1957471",
                "name": "Cordelia, Lear's daughter",
                "email": "cordelia@zulip.com"
            },
            "conversation_message": {
                "type": "conversation_message",
                "id": "331786931",
                "url": "http://localhost:9991/api/",
                "subject": "",
                "body": "<p>Hey! I'd like to set up a new account</p>",
                "author": {
                    "type": "user",
                    "id": "5c9553cb27e377f24eed49f7"
                },
                "attachments": []
            },
            "conversation_parts": {
                "type": "conversation_part.list",
                "conversation_parts": [
                    {
                        "type": "conversation_part",
                        "id": "2826902108",
                        "part_type": "snoozed",
                        "body": null,
                        "created_at": 1553378413,
                        "updated_at": 1553378413,
                        "notified_at": 1553378413,
                        "assigned_to": null,
                        "author": {
                            "type": "admin",
                            "id": "1957471",
                            "name": "Eeshan Garg"
                        },
                        "attachments": [],
                        "external_id": null
                    }
                ],
                "total_count": 1
            },
            "open": true,
            "state": "snoozed",
            "snoozed_until": 1553513400,
            "read": true,
            "metadata": {},
            "tags": {
                "type": "tag.list",
                "tags": []
            },
            "tags_added": {
                "type": "tag.list",
                "tags": []
            },
            "links": {
                "conversation_web": "https://app.intercom.io/a/apps/i6wc9ipe/conversations/21330067382"
            }
        }
    },
    "links": {},
    "id": "notif_0530a65a-8052-4f67-9070-a50f1363dc68",
    "topic": "conversation.admin.snoozed",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553378414,
    "created_at": 1553378414,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_admin_unsnoozed.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_admin_unsnoozed.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "conversation",
            "id": "21330067382",
            "created_at": 1553378082,
            "updated_at": 1553378474,
            "user": {
                "type": "lead",
                "id": "5c9553cb27e377f24eed49f7",
                "user_id": "75067020-1204-495c-8edc-abb7d88bdd43",
                "name": "Eeshan Garg",
                "email": "jerryguitarist@gmail.com",
                "do_not_track": null
            },
            "assignee": {
                "type": "admin",
                "id": "1957471",
                "name": "Cordelia, Lear's daughter",
                "email": "cordelia@zulip.com"
            },
            "conversation_message": {
                "type": "conversation_message",
                "id": "331786931",
                "url": "http://localhost:9991/api/",
                "subject": "",
                "body": "<p>Hey! I'd like to set up a new account</p>",
                "author": {
                    "type": "user",
                    "id": "5c9553cb27e377f24eed49f7"
                },
                "attachments": []
            },
            "conversation_parts": {
                "type": "conversation_part.list",
                "conversation_parts": [
                    {
                        "type": "conversation_part",
                        "id": "2826903472",
                        "part_type": "unsnoozed",
                        "body": null,
                        "created_at": 1553378474,
                        "updated_at": 1553378474,
                        "notified_at": 1553378474,
                        "assigned_to": null,
                        "author": {
                            "type": "admin",
                            "id": "1957471",
                            "name": "Eeshan Garg"
                        },
                        "attachments": [],
                        "external_id": null
                    }
                ],
                "total_count": 1
            },
            "open": true,
            "state": "open",
            "snoozed_until": null,
            "read": true,
            "metadata": {},
            "tags": {
                "type": "tag.list",
                "tags": []
            },
            "tags_added": {
                "type": "tag.list",
                "tags": []
            },
            "links": {
                "conversation_web": "https://app.intercom.io/a/apps/i6wc9ipe/conversations/21330067382"
            }
        }
    },
    "links": {},
    "id": "notif_f0f76ee2-f2c0-4526-90cd-caebecfc5ec5",
    "topic": "conversation.admin.unsnoozed",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553378475,
    "created_at": 1553378475,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_part_tag_created.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_part_tag_created.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "conversation",
            "id": "21330067382",
            "created_at": 1553378082,
            "updated_at": 1553378536,
            "user": {
                "type": "lead",
                "id": "5c9553cb27e377f24eed49f7",
                "user_id": "75067020-1204-495c-8edc-abb7d88bdd43",
                "name": "Eeshan Garg",
                "email": "jerryguitarist@gmail.com",
                "do_not_track": null
            },
            "assignee": {
                "type": "nobody_admin",
                "id": null
            },
            "conversation_message": {
                "type": "conversation_message",
                "id": "331786931",
                "url": "http://localhost:9991/api/",
                "subject": "",
                "body": "<p>Hey! I'd like to set up a new account</p>",
                "author": {
                    "type": "user",
                    "id": "5c9553cb27e377f24eed49f7"
                },
                "attachments": []
            },
            "conversation_parts": {
                "type": "conversation_part.list",
                "conversation_parts": [
                    {
                        "type": "conversation_part",
                        "id": "331786931",
                        "part_type": "comment",
                        "body": "<p>Hey! I'd like to set up a new account</p>",
                        "created_at": 1553378082,
                        "updated_at": 1553378744,
                        "notified_at": 1553378082,
                        "assigned_to": null,
                        "author": {
                            "type": "user",
                            "id": "5c9553cb27e377f24eed49f7",
                            "name": "Eeshan Garg",
                            "email": "jerryguitarist@gmail.com"
                        },
                        "attachments": [],
                        "external_id": null
                    }
                ],
                "total_count": 1
            },
            "open": true,
            "state": "open",
            "snoozed_until": null,
            "read": true,
            "metadata": {},
            "tags": {
                "type": "tag.list",
                "tags": [
                    {
                        "type": "tag",
                        "id": "2525085",
                        "name": "developer"
                    }
                ]
            },
            "tags_added": {
                "type": "tag.list",
                "tags": [
                    {
                        "type": "tag",
                        "id": "2525085",
                        "name": "developer"
                    }
                ]
            },
            "links": {
                "conversation_web": "https://app.intercom.io/a/apps/i6wc9ipe/conversations/21330067382"
            }
        }
    },
    "links": {},
    "id": "notif_11aef68a-8049-4f29-bbd9-48a7adfc8f30",
    "topic": "conversation_part.tag.created",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553378744,
    "created_at": 1553378744,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_user_created.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_user_created.json

```json
{
    "type":"notification_event",
    "app_id":"i6wc9ipe",
    "data":{
        "type":"notification_event_data",
        "item":{
            "type":"conversation",
            "id":"21321941764",
            "created_at":1553290198,
            "updated_at":1553290198,
            "user":{
                "type":"lead",
                "id":"5c9553cb27e377f24eed49f7",
                "user_id":"75067020-1204-495c-8edc-abb7d88bdd43",
                "name":"Rose Poodle from St. John's",
                "email":"",
                "do_not_track":null
            },
            "assignee":{
                "type":"nobody_admin",
                "id":null
            },
            "conversation_message":{
                "type":"conversation_message",
                "id":"331494375",
                "url":"http://localhost:9991/api/",
                "subject":"",
                "body":"<p>Hello everyone!</p>",
                "author":{
                    "type":"user",
                    "id":"5c9553cb27e377f24eed49f7"
                },
                "attachments":[

                ]
            },
            "conversation_parts":{
                "type":"conversation_part.list",
                "conversation_parts":[

                ],
                "total_count":0
            },
            "open":true,
            "state":"open",
            "snoozed_until":null,
            "read":true,
            "metadata":{

            },
            "tags":{
                "type":"tag.list",
                "tags":[

                ]
            },
            "tags_added":{
                "type":"tag.list",
                "tags":[

                ]
            },
            "links":{
                "conversation_web":"https://app.intercom.io/a/apps/i6wc9ipe/conversations/21321941764"
            }
        }
    },
    "links":{

    },
    "id":"notif_3ac27816-d27c-45fd-a65a-bbaf021cf780",
    "topic":"conversation.user.created",
    "delivery_status":"pending",
    "delivery_attempts":1,
    "delivered_at":0,
    "first_sent_at":1553290198,
    "created_at":1553290198,
    "self":null
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_user_replied.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/conversation_user_replied.json

```json
{
    "type":"notification_event",
    "app_id":"i6wc9ipe",
    "data":{
        "type":"notification_event_data",
        "item":{
            "type":"conversation",
            "id":"21322009097",
            "created_at":1553290933,
            "updated_at":1553291307,
            "user":{
                "type":"lead",
                "id":"5c9553cb27e377f24eed49f7",
                "user_id":"75067020-1204-495c-8edc-abb7d88bdd43",
                "name":"Eeshan Garg",
                "email":"jerryguitarist@gmail.com",
                "do_not_track":null
            },
            "assignee":{
                "type":"admin",
                "id":"1957471",
                "name":"Eeshan Garg",
                "email":"jerryguitarist@gmail.com"
            },
            "conversation_message":{
                "type":"conversation_message",
                "id":"331499307",
                "url":"http://localhost:9991/api/",
                "subject":"",
                "body":"<p>Hello</p>",
                "author":{
                    "type":"user",
                    "id":"5c9553cb27e377f24eed49f7"
                },
                "attachments":[

                ]
            },
            "conversation_parts":{
                "type":"conversation_part.list",
                "conversation_parts":[
                    {
                        "type":"conversation_part",
                        "id":"2824391734",
                        "part_type":"comment",
                        "body":"<p>Well, I need some help getting access to a developer account.</p>",
                        "created_at":1553291307,
                        "updated_at":1553291307,
                        "notified_at":1553291307,
                        "assigned_to":null,
                        "author":{
                            "type":"user",
                            "id":"5c9553cb27e377f24eed49f7",
                            "name":"Eeshan Garg",
                            "email":"jerryguitarist@gmail.com"
                        },
                        "attachments":[

                        ],
                        "external_id":null
                    }
                ],
                "total_count":1
            },
            "open":true,
            "state":"open",
            "snoozed_until":null,
            "read":true,
            "metadata":{

            },
            "tags":{
                "type":"tag.list",
                "tags":[

                ]
            },
            "tags_added":{
                "type":"tag.list",
                "tags":[

                ]
            },
            "links":{
                "conversation_web":"https://app.intercom.io/a/apps/i6wc9ipe/conversations/21322009097"
            }
        }
    },
    "links":{

    },
    "id":"notif_2c71fff0-65ef-46be-bbfe-dbf637bbff15",
    "topic":"conversation.user.replied",
    "delivery_status":"pending",
    "delivery_attempts":1,
    "delivered_at":0,
    "first_sent_at":1553291308,
    "created_at":1553291308,
    "self":null
}
```

--------------------------------------------------------------------------------

---[FILE: event_created.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/event_created.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "event",
            "event_name": "invited-friend",
            "id": "84ca8d44-8f2e-11e3-bbc6-6d72c14baf72",
            "intercom_user_id": "5c9aabdf2ddf20549a41453a",
            "user_id": "12",
            "email": "jerryguitarist@gmail.com",
            "metadata": {},
            "created_at": 1391691571,
            "ext_metadata": {}
        }
    },
    "links": {},
    "id": "notif_da25b9d8-797b-4858-ac4a-4a2e9bbecee4",
    "topic": "event.created",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553642228,
    "created_at": 1553642228,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: ping.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/ping.json

```json
{
    "type":"notification_event",
    "app_id":"i6wc9ipe",
    "data":{
        "type":"notification_event_data",
        "item":{
            "type":"ping",
            "message":"something something interzen"
        }
    },
    "links":{

    },
    "id":null,
    "topic":"ping",
    "delivery_status":null,
    "delivery_attempts":1,
    "delivered_at":0,
    "first_sent_at":1553288147,
    "created_at":1553288147,
    "self":null
}
```

--------------------------------------------------------------------------------

---[FILE: user_created.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/user_created.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "user",
            "id": "5c9ab3e78cd7330140ce5033",
            "user_id": "25",
            "anonymous": false,
            "email": "aaron@zulip.com",
            "phone": "2345570987",
            "name": "Aaron Smith",
            "pseudonym": null,
            "avatar": {
                "type": "avatar",
                "image_url": null
            },
            "app_id": "i6wc9ipe",
            "companies": {
                "type": "company.list",
                "companies": [
                    {
                        "type": "company",
                        "company_id": "366",
                        "id": "5c9ab3e78cd7330140ce5034",
                        "name": "Zulip"
                    }
                ]
            },
            "location_data": {},
            "last_request_at": null,
            "created_at": "2019-03-26T23:21:11.907+00:00",
            "remote_created_at": "2014-02-18T13:48:51.000+00:00",
            "signed_up_at": "2014-02-18T13:48:51.000+00:00",
            "updated_at": "2019-03-26T23:21:11.904+00:00",
            "session_count": 0,
            "social_profiles": {
                "type": "social_profile.list",
                "social_profiles": []
            },
            "unsubscribed_from_emails": false,
            "marked_email_as_spam": false,
            "has_hard_bounced": false,
            "tags": {
                "type": "tag.list",
                "tags": []
            },
            "segments": {
                "type": "segment.list",
                "segments": []
            },
            "custom_attributes": {},
            "referrer": null,
            "utm_campaign": null,
            "utm_content": null,
            "utm_medium": null,
            "utm_source": null,
            "utm_term": null,
            "do_not_track": null,
            "last_seen_ip": null,
            "user_agent_data": null
        }
    },
    "links": {},
    "id": "notif_61f436a9-6a2e-4f9b-9e85-68043477da63",
    "topic": "user.created",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553642472,
    "created_at": 1553642471,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: user_deleted.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/user_deleted.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "user",
            "id": "5c9553cb27e377f24eed49f7",
            "user_id": "75067020-1204-495c-8edc-abb7d88bdd43",
            "email": "jerryguitarist@gmail.com"
        }
    },
    "links": {},
    "id": "notif_03e00e17-30d8-4c8a-91a4-6486a3df66e0",
    "topic": "user.deleted",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553379090,
    "created_at": 1553379090,
    "self": null
}
```

--------------------------------------------------------------------------------

````
