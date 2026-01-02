---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1079
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1079 of 1290)

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

---[FILE: private_key.pem]---
Location: zulip-main/zerver/tests/fixtures/apple/private_key.pem

```text
-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIDID8g9mX4QhBstI0asSOwAbetxN13PaA5YoVLsQgp8SoAoGCCqGSM49
AwEHoUQDQgAEQDCysAPobKehaA/R5mKepHOnr7y/nXifgsDXkYK9qEj6SM0cZ2oR
f3pQlwPrd+3i4DB9RSu1Ok8cAkACpJfu+g==
-----END EC PRIVATE KEY-----

This key is generated using

$ openssl ecparam -genkey -name prime256v1 -noout -out private_key.pem

and isn't used anywhere. so, it's safe to have this checked into version control.
It is generated to avoid internal functions, for e.g. `generate_client_secret`,
of python-social-auth from failing because of a private key missing.
```

--------------------------------------------------------------------------------

---[FILE: token_gen_private_key]---
Location: zulip-main/zerver/tests/fixtures/apple/token_gen_private_key

```text
-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQDIpq8whpSI2qgLBVplwsyRKaQwcFcAYsGoTF0nF8g3KmNxdKkg
i2lRy2y/wRazyP2cqmGAaNlMZBTWkY1vn06kxmeuACOpnoAYULIk+U2EAHMFfqrC
wU6tA1HEcAtBTbRBfOqq3WE959aguiHl9S4V5Q4rYynwMcyz7QSjOdJaxQIDAQAB
AoGASSh1IbU//PH0aShHgGjZG2haZArhvdNEFq/ZGwLRzkNXRKuraqFKAjewa+3j
8CMtTOzWZfJUoESxUFZ7giJMkqQMb7HLdPr8z/PKQ5fVCvuBv891hgyO5da6/tAr
GAJ6xR5ZfWlY2206/Jfi0jBanBZjz+wbTa4jQma7H9zuXoECQQDthcHSB81hjVCy
DGL/NKQGJ1YpMdJuvx31chrsi7GqCjaFtU4gztzeVcWK9YJbJ1p33i0t7XbQO9si
cQb+jwxhAkEA2EKi7d5rqooTtiaSvWtp+88i+TxpnA5kYtrxP/CQykyzOHKHRWb4
YCkldmy5GsMoOPXFtKOjGEvrvmEDvAFI5QJAAtLDMgbrtwwh+GvTRWtPw8715Dl2
YeCdr4wyq7shWn8SlNZJ3nP3BiGI3pT6frDiD2ixqskWz3TWrvse9SmoIQJAVNko
Na2rjnioLTJLJnhrV7m4XhM+2FSpPEPsnYqUNFsNghslSayRzKC4KxOTOJXTRS3g
iPQe/FxlPQexQGU8pQJAaXAbZ5Eq5ACherQ5Wv4jVuG1T4W2SFbiVpAn/czEw0Ox
q89vbIHyHBhvBuNFAd/W22weHZrb0qfX1dCE+osGiw==
-----END RSA PRIVATE KEY-----
```

--------------------------------------------------------------------------------

---[FILE: 1.json]---
Location: zulip-main/zerver/tests/fixtures/email/1.json

```json
[
    {
        "from": "hamlet@zulip.com",
        "to": "foo@zulip.com",
        "subject": "1.json",
        "body": "Email fixture 1.json body"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: 1.txt]---
Location: zulip-main/zerver/tests/fixtures/email/1.txt

```text
Content-Type: text/plain; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Subject: Normal subject
From: hamlet@zulip.com
To: foo@zulipdev.com
Reply-to: othello@zulip.com

Email fixture 1.txt body
```

--------------------------------------------------------------------------------

---[FILE: simple.txt]---
Location: zulip-main/zerver/tests/fixtures/email/simple.txt

```text
To: {stream_to_address}
From: {sender}
Subject: Testing email mirror
Content-Type: text/plain; charset=utf-8; format=flowed
Content-Transfer-Encoding: 7bit

This is a plain-text message for testing Zulip.
```

--------------------------------------------------------------------------------

---[FILE: subjects.json]---
Location: zulip-main/zerver/tests/fixtures/email/subjects.json

```json
[
    {
        "original_subject": "Normal subject",
        "stripped_subject": "Normal subject"
    },
    {
        "original_subject": "",
        "stripped_subject": ""
    },
    {
        "original_subject": "Re: Fwd:  Re:  Software",
        "stripped_subject": "Software"
    },
    {
        "original_subject": "Fwd : Re : Re: Many",
        "stripped_subject": "Many"
    },
    {
        "original_subject": "Re : Re: Many",
        "stripped_subject": "Many"
    },
    {
        "original_subject": "Re  : : Re: Many",
        "stripped_subject": "Many"
    },
    {
        "original_subject": "Re:: Many",
        "stripped_subject": "Many"
    },
    {
        "original_subject": "Re; Many",
        "stripped_subject": "Many"
    },
    {
        "original_subject": ": noah - should not match anything",
        "stripped_subject": ": noah - should not match anything"
    },
    {
        "original_subject": "RE--",
        "stripped_subject": ""
    },
    {
        "original_subject": "RE: : Presidential Ballots for Florida",
        "stripped_subject": "Presidential Ballots for Florida"
    },
    {
        "original_subject": "[RE: (no subject)]",
        "stripped_subject": "(no subject)"
    },
    {
        "original_subject": "Request - should not match anything",
        "stripped_subject": "Request - should not match anything"
    },
    {
        "original_subject": "this is the subject (fwd)",
        "stripped_subject": "this is the subject"
    },
    {
        "original_subject": "Re: [Fwd: ] Blonde Joke",
        "stripped_subject": "Blonde Joke"
    },
    {
        "original_subject": "Re: [Fwd: [Fwd: FW: Policy]]",
        "stripped_subject": "Policy"
    },
    {
        "original_subject": "Re: Fwd: [Fwd: FW: \"Drink Plenty of Water\"]",
        "stripped_subject": "\"Drink Plenty of Water\""
    },
    {
        "original_subject": "FW: FW: (fwd) FW:  Warning from XYZ...",
        "stripped_subject": "Warning from XYZ..."
    },
    {
        "original_subject": "FW: (Fwd) (Fwd) ",
        "stripped_subject": ""
    },
    {
        "original_subject": "Fwd: [Fwd: [Fwd: Big, Bad Surf Moving]]",
        "stripped_subject": "Big, Bad Surf Moving"
    },
    {
        "original_subject": "FW: [Fwd: Fw: drawing by a school age child in PA (fwd)]",
        "stripped_subject": "drawing by a school age child in PA"
    },
    {
        "original_subject": "Re: Fwd",
        "stripped_subject": ""
    },
    {
        "original_subject": "Fwd: Re: fwd is an acronym (four-wheel drive)",
        "stripped_subject": "fwd is an acronym (four-wheel drive)"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: email_base_headers_custom_test.md]---
Location: zulip-main/zerver/tests/fixtures/email/custom_emails/email_base_headers_custom_test.md

```text
From: TestFrom
Subject: Test subject

Test body with {{ custom }} value.
```

--------------------------------------------------------------------------------

---[FILE: email_base_headers_no_headers_test.md]---
Location: zulip-main/zerver/tests/fixtures/email/custom_emails/email_base_headers_no_headers_test.md

```text
Test body
```

--------------------------------------------------------------------------------

---[FILE: email_base_headers_test.md]---
Location: zulip-main/zerver/tests/fixtures/email/custom_emails/email_base_headers_test.md

```text
From: TestFrom
Subject: Test subject

Test body
```

--------------------------------------------------------------------------------

---[FILE: messages-000001.json]---
Location: zulip-main/zerver/tests/fixtures/import_fixtures/messages-000001.json

```json
{
    "zerver_message":[
        {
            "date_sent":1409000103,
            "id":555
        },
        {
            "date_sent":1409000101,
            "id":888
        }
    ],
    "zerver_usermessage":[
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: messages-000002.json]---
Location: zulip-main/zerver/tests/fixtures/import_fixtures/messages-000002.json

```json
{
    "zerver_message":[
        {
            "date_sent":1409000102,
            "id":999
        }
    ],
    "zerver_usermessage":[
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: migration_status.json]---
Location: zulip-main/zerver/tests/fixtures/import_fixtures/migration_status.json

```json
{
    "migrations_by_app": {
        "analytics": [
            "[X] 0001_squashed_0021_alter_fillstate_id (21 squashed migrations)"
        ],
        "auth": [
            "[X] 0001_initial",
            "[X] 0002_alter_permission_name_max_length",
            "[X] 0003_alter_user_email_max_length",
            "[X] 0004_alter_user_username_opts",
            "[X] 0005_alter_user_last_login_null",
            "[X] 0006_require_contenttypes_0002",
            "[X] 0007_alter_validators_add_error_messages",
            "[X] 0008_alter_user_username_max_length",
            "[X] 0009_alter_user_last_name_max_length",
            "[X] 0010_alter_group_name_max_length",
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
            "[X] 0624_alter_realmexport_tarball_size_bytes",
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
            "[X] 0648_remove_stream_stream_post_policy"
        ],
        "zilencer": [
            "[X] 0001_squashed_0064_remotezulipserver_last_merge_base (64 squashed migrations)"
        ]
    },
    "zulip_version": "10.0-dev+git"
}
```

--------------------------------------------------------------------------------

---[FILE: with_complete_migrations.json]---
Location: zulip-main/zerver/tests/fixtures/import_fixtures/applied_migrations_fixtures/with_complete_migrations.json

```json
{
    "analytics": [
        "[X] 0001_squashed_0021_alter_fillstate_id (21 squashed migrations)"
    ],
    "auth": [
        "[X] 0001_initial",
        "[X] 0002_alter_permission_name_max_length",
        "[X] 0003_alter_user_email_max_length",
        "[X] 0004_alter_user_username_opts",
        "[X] 0005_alter_user_last_login_null",
        "[X] 0006_require_contenttypes_0002",
        "[X] 0007_alter_validators_add_error_messages",
        "[X] 0008_alter_user_username_max_length",
        "[X] 0009_alter_user_last_name_max_length",
        "[X] 0010_alter_group_name_max_length",
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
        "[X] 0624_alter_realmexport_tarball_size_bytes",
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
        "[X] 0648_remove_stream_stream_post_policy"
    ],
    "zilencer": [
        "[X] 0001_squashed_0064_remotezulipserver_last_merge_base (64 squashed migrations)"
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: with_missing_apps.json]---
Location: zulip-main/zerver/tests/fixtures/import_fixtures/applied_migrations_fixtures/with_missing_apps.json

```json
{
    "analytics": [
        "[X] 0001_squashed_0021_alter_fillstate_id (21 squashed migrations)"
    ],
    "auth": [
        "[X] 0001_initial",
        "[X] 0002_alter_permission_name_max_length",
        "[X] 0003_alter_user_email_max_length",
        "[X] 0004_alter_user_username_opts",
        "[X] 0005_alter_user_last_login_null",
        "[X] 0006_require_contenttypes_0002",
        "[X] 0007_alter_validators_add_error_messages",
        "[X] 0008_alter_user_username_max_length",
        "[X] 0009_alter_user_last_name_max_length",
        "[X] 0010_alter_group_name_max_length",
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
        "[X] 0624_alter_realmexport_tarball_size_bytes",
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
        "[X] 0648_remove_stream_stream_post_policy"
    ],
    "zilencer": [
        "[X] 0001_squashed_0064_remotezulipserver_last_merge_base (64 squashed migrations)"
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: with_unapplied_migrations.json]---
Location: zulip-main/zerver/tests/fixtures/import_fixtures/applied_migrations_fixtures/with_unapplied_migrations.json

```json
{
    "analytics": [
        "[X] 0001_squashed_0021_alter_fillstate_id (21 squashed migrations)"
    ],
    "auth": [
        "[X] 0001_initial",
        "[X] 0002_alter_permission_name_max_length",
        "[X] 0003_alter_user_email_max_length",
        "[X] 0004_alter_user_username_opts",
        "[X] 0005_alter_user_last_login_null",
        "[X] 0006_require_contenttypes_0002",
        "[X] 0007_alter_validators_add_error_messages",
        "[X] 0008_alter_user_username_max_length",
        "[X] 0009_alter_user_last_name_max_length",
        "[X] 0010_alter_group_name_max_length",
        "[ ] 0011_update_proxy_permissions",
        "[ ] 0012_alter_user_first_name_max_length"
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
        "[X] 0624_alter_realmexport_tarball_size_bytes",
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
        "[ ] 0646_set_default_for_can_send_message_group",
        "[ ] 0647_alter_stream_can_send_message_group",
        "[ ] 0648_remove_stream_stream_post_policy"
    ],
    "zilencer": [
        "[X] 0001_squashed_0064_remotezulipserver_last_merge_base (64 squashed migrations)"
    ]
}
```

--------------------------------------------------------------------------------

````
