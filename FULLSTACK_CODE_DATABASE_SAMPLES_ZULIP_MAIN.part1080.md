---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1080
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1080 of 1290)

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

---[FILE: with_unsorted_migrations_list.json]---
Location: zulip-main/zerver/tests/fixtures/import_fixtures/applied_migrations_fixtures/with_unsorted_migrations_list.json

```json
{
    "analytics": [
        "[X] 0001_squashed_0021_alter_fillstate_id (21 squashed migrations)"
    ],
    "auth": [
        "[X] 0001_initial",
        "[X] 0003_alter_user_email_max_length",
        "[X] 0004_alter_user_username_opts",
        "[X] 0005_alter_user_last_login_null",
        "[X] 0006_require_contenttypes_0002",
        "[X] 0007_alter_validators_add_error_messages",
        "[X] 0008_alter_user_username_max_length",
        "[X] 0009_alter_user_last_name_max_length",
        "[X] 0010_alter_group_name_max_length",
        "[X] 0002_alter_permission_name_max_length",
        "[X] 0011_update_proxy_permissions",
        "[X] 0012_alter_user_first_name_max_length"
    ],
    "confirmation": [
        "[X] 0001_squashed_0014_confirmation_confirmatio_content_80155a_idx (14 squashed migrations)",
        "[X] 0015_alter_confirmation_object_id"
    ],
    "contenttypes": ["[X] 0001_initial", "[X] 0002_remove_content_type_name"],
    "corporate": [
        "[X] 0001_squashed_0044_convert_ids_to_bigints (44 squashed migrations)"
    ],
    "otp_static": [
        "[X] 0001_initial",
        "[X] 0002_throttling",
        "[X] 0003_add_timestamps"
    ],
    "otp_totp": [
        "[X] 0001_initial",
        "[X] 0002_auto_20190420_0723",
        "[X] 0003_add_timestamps"
    ],
    "pgroonga": [
        "[X] 0001_enable",
        "[X] 0002_html_escape_subject",
        "[X] 0003_v2_api_upgrade"
    ],
    "phonenumber": ["[X] 0001_squashed_0001_initial (10 squashed migrations)"],
    "sessions": ["[X] 0001_initial"],
    "social_django": [
        "[X] 0001_initial (2 squashed migrations)",
        "[X] 0002_add_related_name (2 squashed migrations)",
        "[X] 0003_alter_email_max_length (2 squashed migrations)",
        "[X] 0004_auto_20160423_0400 (2 squashed migrations)",
        "[X] 0005_auto_20160727_2333 (1 squashed migrations)",
        "[X] 0006_partial",
        "[X] 0007_code_timestamp",
        "[X] 0008_partial_timestamp",
        "[X] 0009_auto_20191118_0520",
        "[X] 0010_uid_db_index",
        "[X] 0011_alter_id_fields",
        "[X] 0012_usersocialauth_extra_data_new",
        "[X] 0013_migrate_extra_data",
        "[X] 0014_remove_usersocialauth_extra_data",
        "[X] 0015_rename_extra_data_new_usersocialauth_extra_data",
        "[X] 0016_alter_usersocialauth_extra_data"
    ],
    "two_factor": ["(no migrations)"],
    "zerver": [
        "[X] 0001_squashed_0569 (545 squashed migrations)",
        "[X] 0625_realm_can_invite_users_group",
        "[X] 0626_set_default_value_for_can_invite_users_group",
        "[X] 0627_alter_realm_can_invite_users_group",
        "[X] 0628_remove_realm_invite_to_realm_policy",
        "[X] 0629_remove_stream_email_token_backfill_channelemailaddress",
        "[X] 0630_multiuseinvite_groups_preregistrationuser_groups",
        "[X] 0631_stream_is_recently_active",
        "[X] 0632_preregistrationrealm_data_import_metadata",
        "[X] 0633_namedusergroup_can_remove_members_group",
        "[X] 0634_set_default_for_can_remove_members_group",
        "[X] 0635_alter_namedusergroup_can_remove_members_group",
        "[X] 0636_streams_add_can_administer_channel_group",
        "[X] 0637_set_default_for_can_administer_channel_group",
        "[X] 0638_alter_stream_can_administer_channel_group",
        "[X] 0640_merge_20241211_1953",
        "[X] 0641_web_suggest_update_time_zone",
        "[X] 0642_realm_moderation_request_channel",
        "[X] 0643_realm_scheduled_deletion_date",
        "[X] 0644_check_update_all_channels_active_status",
        "[X] 0645_stream_can_send_message_group",
        "[X] 0646_set_default_for_can_send_message_group",
        "[X] 0647_alter_stream_can_send_message_group",
        "[X] 0648_remove_stream_stream_post_policy",
        "[X] 0576_backfill_imageattachment",
        "[X] 0622_backfill_imageattachment_again",
        "[X] 0639_zh_hant_tw_rename",
        "[X] 0570_namedusergroup_can_manage_group",
        "[X] 0571_set_default_for_can_manage_group",
        "[X] 0572_alter_usergroup_can_manage_group",
        "[X] 0573_directmessagegroup_group_size",
        "[X] 0574_backfill_directmessagegroup_group_size",
        "[X] 0575_alter_directmessagegroup_group_size",
        "[X] 0577_merge_20240829_0153",
        "[X] 0578_namedusergroup_deactivated",
        "[X] 0579_realm_can_delete_own_message_group",
        "[X] 0580_set_default_value_for_can_delete_own_message_group",
        "[X] 0581_alter_realm_can_delete_own_message_group",
        "[X] 0582_remove_realm_delete_own_message_policy",
        "[X] 0583_namedusergroup_creator_namedusergroup_date_created",
        "[X] 0584_namedusergroup_creator_date_created_backfill",
        "[X] 0585_userprofile_allow_private_data_export_and_more",
        "[X] 0586_customprofilefield_editable_by_user",
        "[X] 0587_savedsnippet",
        "[X] 0588_realm_add_can_create_groups",
        "[X] 0589_set_can_create_groups",
        "[X] 0590_alter_realm_can_create_groups",
        "[X] 0591_realm_add_can_manage_all_groups",
        "[X] 0592_set_can_manage_all_groups",
        "[X] 0593_alter_realm_manage_all_groups",
        "[X] 0594_remove_realm_user_group_edit_policy",
        "[X] 0595_add_realmexport_table_and_backfill",
        "[X] 0596_namedusergroup_can_join_group",
        "[X] 0597_set_default_value_for_can_join_group",
        "[X] 0598_alter_namedusergroup_can_join_group",
        "[X] 0599_namedusergroup_add_can_add_members_group",
        "[X] 0600_set_default_for_can_add_members_group",
        "[X] 0601_alter_namedusergroup_can_add_members_group",
        "[X] 0602_remap_can_manage_all_groups",
        "[X] 0603_realm_can_add_custom_emoji_group",
        "[X] 0604_set_default_value_for_can_add_custom_emoji_group",
        "[X] 0605_alter_realm_can_add_custom_emoji_group",
        "[X] 0606_remove_realm_add_custom_emoji_policy",
        "[X] 0607_namedusergroup_add_can_leave_group",
        "[X] 0608_set_default_for_can_leave_group",
        "[X] 0609_alter_namedusergroup_can_leave_group",
        "[X] 0610_mark_introduce_resolve_topic_modal_as_read",
        "[X] 0611_realm_can_move_messages_between_channels_group",
        "[X] 0612_set_default_value_for_can_move_messages_between_channels_group",
        "[X] 0613_alter_realm_can_move_messages_between_channels_group",
        "[X] 0614_remove_realm_move_messages_between_streams_policy",
        "[X] 0615_system_bot_avatars",
        "[X] 0616_userprofile_can_change_user_emails",
        "[X] 0617_remove_prefix_from_archived_streams",
        "[X] 0618_realm_can_move_messages_between_topics_group",
        "[X] 0619_set_default_value_for_can_move_messages_between_topics_group",
        "[X] 0620_alter_realm_can_move_messages_between_topics_group",
        "[X] 0621_remove_realm_edit_topic_policy",
        "[X] 0623_merge_20241030_1835",
        "[X] 0624_alter_realmexport_tarball_size_bytes"
    ],
    "zilencer": [
        "[X] 0001_squashed_0064_remotezulipserver_last_merge_base (64 squashed migrations)"
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: extra_migrations_error.txt]---
Location: zulip-main/zerver/tests/fixtures/import_fixtures/check_migrations_errors/extra_migrations_error.txt

```text
Error: Export was generated on a different Zulip version.
Export version: {version_placeholder}
Server version: {version_placeholder}

Database formats differ between the exported realm and this server.
Printing migrations that differ between the versions:
--- exported realm
+++ this server
'auth' app:
+[ ] 0011_update_proxy_permissions
+[ ] 0012_alter_user_first_name_max_length
 [X] 0001_initial
@@ -10,3 +12 @@
 [X] 0010_alter_group_name_max_length
-[X] 0011_update_proxy_permissions
-[X] 0012_alter_user_first_name_max_length

'zerver' app:
+[ ] 0646_set_default_for_can_send_message_group
+[ ] 0647_alter_stream_can_send_message_group
+[ ] 0648_remove_stream_stream_post_policy
 [X] 0001_squashed_0569 (545 squashed migrations)
@@ -77,4 +80 @@
 [X] 0645_stream_can_send_message_group
-[X] 0646_set_default_for_can_send_message_group
-[X] 0647_alter_stream_can_send_message_group
-[X] 0648_remove_stream_stream_post_policy
```

--------------------------------------------------------------------------------

---[FILE: unapplied_migrations_error.txt]---
Location: zulip-main/zerver/tests/fixtures/import_fixtures/check_migrations_errors/unapplied_migrations_error.txt

```text
Error: Export was generated on a different Zulip version.
Export version: {version_placeholder}
Server version: {version_placeholder}

Database formats differ between the exported realm and this server.
Printing migrations that differ between the versions:
--- exported realm
+++ this server
'auth' app:
-[ ] 0011_update_proxy_permissions
-[ ] 0012_alter_user_first_name_max_length
 [X] 0001_initial
@@ -12 +10,3 @@
 [X] 0010_alter_group_name_max_length
+[X] 0011_update_proxy_permissions
+[X] 0012_alter_user_first_name_max_length

'zerver' app:
-[ ] 0646_set_default_for_can_send_message_group
-[ ] 0647_alter_stream_can_send_message_group
-[ ] 0648_remove_stream_stream_post_policy
 [X] 0001_squashed_0569 (545 squashed migrations)
@@ -80 +77,4 @@
 [X] 0645_stream_can_send_message_group
+[X] 0646_set_default_for_can_send_message_group
+[X] 0647_alter_stream_can_send_message_group
+[X] 0648_remove_stream_stream_post_policy
```

--------------------------------------------------------------------------------

---[FILE: directory.json]---
Location: zulip-main/zerver/tests/fixtures/ldap/directory.json

```json

{
    "ou=users,dc=zulip,dc=com": {
        "ou": "users"
    },

    "uid=hamlet,ou=users,dc=zulip,dc=com": {
        "objectClass": ["user"],
        "cn": ["King Hamlet"],
        "uid": ["hamlet"],
        "mail": ["hamlet@zulip.com"],
        "userAccountControl": ["512"],
        "sn": ["Hamlet"],
        "homePhone": ["123456789"],
        "birthDate": ["1900-09-08"],
        "jpegPhoto": "file:static/images/test-images/avatars/example_profile_picture.png"
    },

    "uid=cordelia,ou=users,dc=zulip,dc=com": {
        "objectClass": ["user"],
        "cn": ["Cordelia, Lear's daughter"],
        "uid": ["cordelia"],
        "mail": ["cordelia@zulip.com"],
        "sn": ["Cordelia"]
    },

    "uid=letham,ou=users,dc=zulip,dc=com": {
        "objectClass": ["user"],
        "cn": ["aaron"],
        "uid": ["letham"],
        "mail": ["aaron@zulip.com"],
        "sn": ["aaron"]
    },

    "uid=newuser,ou=users,dc=zulip,dc=com": {
        "objectClass": ["user"],
        "cn": ["New LDAP fullname"],
        "uid": ["newuser"],
        "sn": ["shortname"],
        "homePhone": ["a-new-number"],
        "jpegPhoto": "file:static/images/test-images/avatars/example_profile_picture.png"
    },

    "uid=newuser_splitname,ou=users,dc=zulip,dc=com": {
        "objectClass": ["user"],
        "cn": ["Last"],
        "uid": ["newuser_splitname"],
        "sn": ["First"]
    },

    "uid=newuser_with_email,ou=users,dc=zulip,dc=com": {
        "objectClass": ["user"],
        "cn": ["New LDAP fullname"],
        "uid": ["newuser_with_email"],
        "sn": ["shortname"],
        "mail": ["newuser_email@zulip.com"]
    },

    "uid=newuser_email_as_uid@zulip.com,ou=users,dc=zulip,dc=com": {
        "objectClass": ["user"],
        "cn": ["New LDAP fullname"],
        "uid": ["newuser_email_as_uid@zulip.com"],
        "sn": ["shortname"]
    },

    "uid=user1_with_shared_email,ou=users,dc=zulip,dc=com": {
        "objectClass": ["user"],
        "cn": ["New LDAP fullname"],
        "uid": ["user1_with_shared_email"],
        "sn": ["shortname"],
        "mail": ["shared_email@zulip.com"]
    },

    "uid=user2_with_shared_email,ou=users,dc=zulip,dc=com": {
        "objectClass": ["user"],
        "cn": ["New LDAP fullname"],
        "uid": ["user2_with_shared_email"],
        "sn": ["shortname"],
        "mail": ["shared_email@zulip.com"]
    },

    "ou=groups,dc=zulip,dc=com": {
        "ou": "groups"
    },
    "cn=cool_test_group,ou=groups,dc=zulip,dc=com": {
        "objectClass": ["groupOfUniqueNames"],
        "cn": ["cool_test_group"],
        "uniqueMember": [
            "uid=hamlet,ou=users,dc=zulip,dc=com"
        ]
    },
    "cn=another_test_group,ou=groups,dc=zulip,dc=com": {
        "objectClass": ["groupOfUniqueNames"],
        "cn": ["another_test_group"],
        "uniqueMember": [
            "uid=hamlet,ou=users,dc=zulip,dc=com",
            "uid=cordelia,ou=users,dc=zulip,dc=com"
        ]
    }
}
```

--------------------------------------------------------------------------------

---[FILE: summary.json]---
Location: zulip-main/zerver/tests/fixtures/litellm/summary.json

```json
{
  "model": "groq/llama-3.3-70b-versatile",
  "messages": [
    {
      "content": "The following is a chat conversation in the Zulip team chat app. channel: Zulip features, topic: New feature launch",
      "role": "system"
    },
    {
      "content": "[{\"sender\":\"Iago\",\"content\":\"Zulip just launched a feature to generate summary of messages.\"},{\"sender\":\"Iago\",\"content\":\"Sounds awesome! This will **greatly** help me when catching up.\"}]",
      "role": "user"
    },
    {
      "content": "Succinctly summarize this conversation based only on the information provided, in up to 4 sentences, for someone who is familiar with the context. Mention key conclusions and actions, if any. Refer to specific people as appropriate. Don't use an intro phrase. You can use Zulip's CommonMark based formatting.",
      "role": "user"
    }
  ],
  "response": {
    "id": "chatcmpl-0ed48d2e-8956-444f-be81-f5d55392a280",
    "created": 1738495155,
    "model": "groq/llama-3.3-70b-versatile",
    "object": "chat.completion",
    "system_fingerprint": "fp_c0cfa69934",
    "choices": [
      {
        "finish_reason": "stop",
        "index": 0,
        "message": {
          "content": "Iago announced that Zulip has launched a feature to generate summaries of messages. This feature will **greatly** help Iago when catching up. No actions were specified in the conversation. Iago seems to be looking forward to using this new feature.",
          "role": "assistant",
          "tool_calls": null,
          "function_call": null
        }
      }
    ],
    "usage": {
      "completion_tokens": 53,
      "prompt_tokens": 178,
      "total_tokens": 231,
      "completion_tokens_details": null,
      "prompt_tokens_details": null,
      "queue_time": 0.146625071,
      "prompt_time": 0.041886488,
      "completion_time": 0.261543978,
      "total_time": 0.303430466
    },
    "x_groq": {
      "id": "req_01jk365q8afcht4th8crf3mhbg"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: export.json]---
Location: zulip-main/zerver/tests/fixtures/mattermost_fixtures/export.json

```json
{"type":"version","version":1}
{"type":"team","team":{"name":"gryffindor","display_name":"Iago Realm","type":"O","description":"","allow_open_invite":true}}
{"type":"team","team":{"name":"slytherin","display_name":"Othello Team","type":"O","description":"","allow_open_invite":true}}
{"type":"channel","channel":{"team":"gryffindor","name":"gryffindor-common-room","display_name":"Gryffindor common room","type":"O","header":"","purpose":"A place for talking about Gryffindor common room"}}
{"type":"channel","channel":{"team":"gryffindor","name":"gryffindor-quidditch-team","display_name":"Gryffindor quidditch team","type":"O","header":"","purpose":"A place for talking about Gryffindor quidditch team"}}
{"type":"channel","channel":{"team":"slytherin","name":"slytherin-common-room","display_name":"Slytherin common room","type":"O","header":"","purpose":""}}
{"type":"channel","channel":{"team":"gryffindor","name":"dumbledores-army","display_name":"Dumbledores army","type":"P","header":"https//:github.com/zulip/zulip","purpose":"A place for talking about Dumbledores army"}}
{"type":"channel","channel":{"team":"slytherin","name":"slytherin-quidditch-team","display_name":"Slytherin quidditch team","type":"O","header":"","purpose":""}}
{"type":"channel","channel":{"team":"gryffindor","name":"long-channel-name","display_name":"Super long channel name, it's more than 60 characters, which is Zulip's channel name length limit.","type":"O","header":"","purpose":""}}
{"type":"channel","channel":{"team":"gryffindor","name":"long-channel-name-2","display_name":"Super long channel name, it's more than 60 characters, which is Zulip's channel name length limit.","type":"O","header":"","purpose":""}}
{"type":"channel","channel":{"team":"gryffindor","name":"other-long-channel-name","display_name":"Super long channel name, it's more than 60 characters, which if truncated looks similar to unrelated channels","type":"O","header":"","purpose":""}}
{"type":"channel","channel":{"team":"gryffindor","name":"gryffindor-quidditch-team-2","display_name":"Gryffindor quidditch team","type":"O","header":"","purpose":"Another place for talking about Gryffindor quidditch team"}}
{"type":"user","user":{"username":"ron","email":"ron@zulip.com","auth_service":"","nickname":"","first_name":"Ron","last_name":"Weasley","position":"","roles":"system_user","locale":"en","teams":[{"name":"gryffindor","roles":"team_user","channels":[{"name":"gryffindor-quidditch-team","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"gryffindor-common-room","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"dumbledores-army","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"ron,@ron"}}}
{"type":"user","user":{"username":"harry","email":"harry@zulip.com","auth_service":"","nickname":"","first_name":"Harry","last_name":"Potter","position":"","roles":"system_admin system_user","locale":"en","teams":[{"name":"gryffindor","roles":"team_admin team_user","channels":[{"name":"dumbledores-army","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"gryffindor-common-room","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"gryffindor-quidditch-team","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"harry,@harry"}}}
{"type":"user","user":{"username":"malfoy","email":"malfoy@zulip.com","auth_service":"","nickname":"","first_name":"","last_name":"","position":"","roles":"system_user","locale":"en","teams":[{"name":"slytherin","roles":"team_admin team_user","channels":[{"name":"slytherin-common-room","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"slytherin-quidditch-team","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"malfoy,@malfoy"}}}
{"type":"user","user":{"username":"pansy","email":"pansy@zulip.com","auth_service":"","nickname":"","first_name":"","last_name":"","position":"","roles":"system_user","locale":"en","teams":[{"name":"slytherin","roles":"team_admin team_user","channels":[{"name":"slytherin-common-room","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"slytherin-quidditch-team","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"malfoy,@malfoy"}}}
{"type":"user","user":{"username":"snape","email":"snape@zulip.com","auth_service":"","nickname":"","first_name":"Severus","last_name":"Snape","position":"","roles":"system_user","locale":"en","teams":[{"name":"slytherin","roles":"team_user","channels":[{"name":"slytherin-common-room","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"snape,@snape"}}}
{"type":"post","post":{"team":"gryffindor","channel":"dumbledores-army","user":"harry","message":"harry joined the channel.","create_at":1553166657086,"reactions":null,"replies":[{"user":"ron","message":"The weather is so hot!","create_at":1553166584976}]}}
{"type":"post","post":{"team":"gryffindor","channel":"dumbledores-army","user":"harry","message":"This will crash html2text!!! <g:brand><![CDATSALOMON NORTH AMERICA, IN}}]]></g:brand>","create_at":1553166657086,"reactions":null,"replies":[{"user":"ron","message":"The weather is so hot!","create_at":1553166584975}]}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-common-room","user":"ron","message":"ron joined the channel.","create_at":1553166512493,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"harry","message":"harry joined the team.","create_at":1553165141670,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"harry","message":"Awesome!","create_at":1553166557928,"reactions":[{"user":"malfoy","create_at":1553166812156,"emoji_name":"tick"}],"replies":null}}
{"type":"post","post":{"team":"slytherin","channel":"slytherin-quidditch-team","user":"malfoy","message":"malfoy joined the team.","create_at":1553166852598,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"ron","message":"ron joined the team.","create_at":1553166512482,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"ron","message":"Hey folks","create_at":1553166519720,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"harry","message":"@ron Welcome mate!","create_at":1553166519726,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"dumbledores-army","user":"harry","message":"ron added to the channel by harry.","create_at":1553166681045,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"harry","message":"Hello world","create_at":1553165193242,"reactions":[{"user":"harry","create_at":1553165521410,"emoji_name":"tick"},{"user":"ron","create_at":1553166530805,"emoji_name":"smile"},{"user":"ron","create_at":1553166540953,"emoji_name":"world_map"}],"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-common-room","user":"harry","message":"Looks like this channel is empty","create_at":1553166567370,"reactions":[{"user":"ron","create_at":1553166584976,"emoji_name":"rocket"}],"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"ron","message":"How is everything going","create_at":1553166525124,"reactions":[{"user":"harry","create_at":1553166552827,"emoji_name":"apple"}],"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-common-room","user":"ron","message":"Not really","create_at":1553166593455,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"dumbledores-army","user":"ron","message":"hello","create_at":1553166686344,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"dumbledores-army","user":"harry","message":"hey everyone","create_at":1553166668668,"reactions":[{"user":"ron","create_at":1553166695260,"emoji_name":"grin"}],"replies":null}}
{"type":"post","post":{"team":"slytherin","channel":"slytherin-common-room","user":"malfoy","message":"malfoy joined the channel.","create_at":1553166852612,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"slytherin","channel":"slytherin-quidditch-team","user":"malfoy","message":":rofl: 4","create_at":1553166916448,"reactions":[{"user":"harry","create_at":1553167016056,"emoji_name":"peerdium"}],"replies":null}}
{"type":"post","post":{"team":"slytherin","channel":"slytherin-quidditch-team","user":"malfoy","message":"Hello folks","create_at":1553166858280,"reactions":[{"user":"harry","create_at":1553166903980,"emoji_name":"joy"}],"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-common-room","user":"harry","message":"harry joined the channel.","create_at":1553165141689,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"snape","message":"Hey folks! I was always in your team. Time to go now.","create_at":1553166740759,"reactions":null,"replies":null}}
{"type":"emoji","emoji":{"name":"peerdium","image":"exported_emoji/h15ni7kf1bnj7jeua4qhmctsdo/image.png"}}
{"type":"emoji","emoji":{"name":"tick","image":"exported_emoji/7u7x8ytgp78q8jir81o9ejwwnr/image.png"}}
```

--------------------------------------------------------------------------------

---[FILE: guestExport.json]---
Location: zulip-main/zerver/tests/fixtures/mattermost_fixtures/guestExport.json

```json
{"type":"version","version":1}
{"type":"team","team":{"name":"gryffindor","display_name":"Iago Realm","type":"O","description":"","allow_open_invite":true}}
{"type":"team","team":{"name":"slytherin","display_name":"Othello Team","type":"O","description":"","allow_open_invite":true}}
{"type":"channel","channel":{"team":"gryffindor","name":"gryffindor-common-room","display_name":"Gryffindor common room","type":"O","header":"","purpose":"A place for talking about Gryffindor common room"}}
{"type":"channel","channel":{"team":"gryffindor","name":"gryffindor-quidditch-team","display_name":"Gryffindor quidditch team","type":"O","header":"","purpose":"A place for talking about Gryffindor quidditch team"}}
{"type":"channel","channel":{"team":"slytherin","name":"slytherin-common-room","display_name":"Slytherin common room","type":"O","header":"","purpose":""}}
{"type":"channel","channel":{"team":"gryffindor","name":"dumbledores-army","display_name":"Dumbledores army","type":"P","header":"https//:github.com/zulip/zulip","purpose":"A place for talking about Dumbledores army"}}
{"type":"channel","channel":{"team":"slytherin","name":"slytherin-quidditch-team","display_name":"Slytherin quidditch team","type":"O","header":"","purpose":""}}
{"type":"user","user":{"username":"ron","email":"ron@zulip.com","auth_service":"","nickname":"","first_name":"Ron","last_name":"Weasley","position":"","roles":"system_user","locale":"en","teams":[{"name":"gryffindor","roles":"team_user","channels":[{"name":"gryffindor-quidditch-team","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"gryffindor-common-room","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"dumbledores-army","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"ron,@ron"}}}
{"type":"user","user":{"username":"harry","email":"harry@zulip.com","auth_service":"","nickname":"","first_name":"Harry","last_name":"Potter","position":"","roles":"system_admin system_user","locale":"en","teams":[{"name":"gryffindor","roles":"team_admin team_user","channels":[{"name":"dumbledores-army","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"gryffindor-common-room","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"gryffindor-quidditch-team","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"harry,@harry"}}}
{"type":"user","user":{"username":"malfoy","email":"malfoy@zulip.com","auth_service":"","nickname":"","first_name":"","last_name":"","position":"","roles":"system_user","locale":"en","teams":[{"name":"slytherin","roles":"team_admin team_user","channels":[{"name":"slytherin-common-room","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"slytherin-quidditch-team","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"malfoy,@malfoy"}}}
{"type":"user","user":{"username":"pansy","email":"pansy@zulip.com","auth_service":"","nickname":"","first_name":"","last_name":"","position":"","roles":"system_user","locale":"en","teams":[{"name":"slytherin","roles":"team_admin team_user","channels":[{"name":"slytherin-common-room","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"slytherin-quidditch-team","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"malfoy,@malfoy"}}}
{"type":"user","user":{"username":"snape","email":"snape@zulip.com","auth_service":"","nickname":"","first_name":"Severus","last_name":"Snape","position":"","roles":"system_user","locale":"en","teams":[{"name":"slytherin","roles":"team_user","channels":[{"name":"slytherin-common-room","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"snape,@snape"}}}
{"type":"user","user":{"username":"sirius","email":"sirius@zulip.com","auth_service":"","nickname":"","first_name":"Sirius","last_name":"Black","position":"","roles":"system_guest","locale":"en","teams":[{"name":"slytherin","roles":"team_guest","channels":[{"name":"slytherin-common-room","roles":"channel_guest","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"sirius,@sirius"}}}
{"type":"post","post":{"team":"gryffindor","channel":"dumbledores-army","user":"harry","message":"harry joined the channel.","create_at":1553166657086,"reactions":null,"replies":[{"user":"ron","message":"The weather is so hot!","create_at":1553166584976}]}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-common-room","user":"ron","message":"ron joined the channel.","create_at":1553166512493,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"harry","message":"harry joined the team.","create_at":1553165141670,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"harry","message":"Awesome!","create_at":1553166557928,"reactions":[{"user":"malfoy","create_at":1553166812156,"emoji_name":"tick"}],"replies":null}}
{"type":"post","post":{"team":"slytherin","channel":"slytherin-quidditch-team","user":"malfoy","message":"malfoy joined the team.","create_at":1553166852598,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"ron","message":"ron joined the team.","create_at":1553166512482,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"ron","message":"Hey folks","create_at":1553166519720,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"harry","message":"@ron Welcome mate!","create_at":1553166519726,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"dumbledores-army","user":"harry","message":"ron added to the channel by harry.","create_at":1553166681045,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"harry","message":"Hello world","create_at":1553165193242,"reactions":[{"user":"harry","create_at":1553165521410,"emoji_name":"tick"},{"user":"ron","create_at":1553166530805,"emoji_name":"smile"},{"user":"ron","create_at":1553166540953,"emoji_name":"world_map"}],"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-common-room","user":"harry","message":"Looks like this channel is empty","create_at":1553166567370,"reactions":[{"user":"ron","create_at":1553166584976,"emoji_name":"rocket"}],"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"ron","message":"How is everything going","create_at":1553166525124,"reactions":[{"user":"harry","create_at":1553166552827,"emoji_name":"apple"}],"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-common-room","user":"ron","message":"Not really","create_at":1553166593455,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"dumbledores-army","user":"ron","message":"hello","create_at":1553166686344,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"dumbledores-army","user":"harry","message":"hey everyone","create_at":1553166668668,"reactions":[{"user":"ron","create_at":1553166695260,"emoji_name":"grin"}],"replies":null}}
{"type":"post","post":{"team":"slytherin","channel":"slytherin-common-room","user":"malfoy","message":"malfoy joined the channel.","create_at":1553166852612,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"slytherin","channel":"slytherin-quidditch-team","user":"malfoy","message":":rofl:4","create_at":1553166916448,"reactions":[{"user":"harry","create_at":1553167016056,"emoji_name":"peerdium"}],"replies":null}}
{"type":"post","post":{"team":"slytherin","channel":"slytherin-quidditch-team","user":"malfoy","message":"Hello folks","create_at":1553166858280,"reactions":[{"user":"harry","create_at":1553166903980,"emoji_name":"joy"}],"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-common-room","user":"harry","message":"harry joined the channel.","create_at":1553165141689,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"snape","message":"Hey folks! I was always in your team. Time to go now.","create_at":1553166740759,"reactions":null,"replies":null}}
{"type":"emoji","emoji":{"name":"peerdium","image":"exported_emoji/h15ni7kf1bnj7jeua4qhmctsdo/image.png"}}
{"type":"emoji","emoji":{"name":"tick","image":"exported_emoji/7u7x8ytgp78q8jir81o9ejwwnr/image.png"}}
```

--------------------------------------------------------------------------------

````
