---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 816
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 816 of 1290)

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

---[FILE: settings_bots.test.cjs]---
Location: zulip-main/web/tests/settings_bots.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const bot_data_params = {
    realm_bots: [
        {
            api_key: "QadL788EkiottHmukyhHgePUFHREiu8b",
            avatar_url: "",
            bot_type: 1, // DEFAULT_BOT
            default_all_public_streams: true,
            default_events_register_stream: "register stream 1",
            default_sending_stream: "sending stream 1",
            email: "error-bot@zulip.org",
            full_name: "Error bot",
            is_active: true,
            owner: "someone 4",
            owner_id: 4,
            user_id: 1,
            services: [],
            extra: "This field should be ignored",
        },
    ],
};

const bot_data = zrequire("bot_data");
const bot_helper = zrequire("bot_helper");
const settings_bots = zrequire("settings_bots");
const {set_current_user, set_realm} = zrequire("state_data");

const current_user = {};
set_current_user(current_user);
const realm = make_realm();
set_realm(realm);

bot_data.initialize(bot_data_params);

function test(label, f) {
    run_test(label, ({override}) => {
        override(realm, "realm_url", "https://chat.example.com");
        override(realm, "realm_embedded_bots", [
            {name: "converter", config: {}},
            {name: "giphy", config: {key: "12345678"}},
            {name: "foobot", config: {bar: "baz", qux: "quux"}},
        ]);

        f({override});
    });
}

test("generate_zuliprc_url", () => {
    const url = bot_helper.generate_zuliprc_url(1);
    const expected =
        "data:application/octet-stream;charset=utf-8," +
        encodeURIComponent(
            "[api]\nemail=error-bot@zulip.org\n" +
                "key=QadL788EkiottHmukyhHgePUFHREiu8b\n" +
                "site=https://chat.example.com\n",
        );

    assert.equal(url, expected);
});

test("generate_zuliprc_content", () => {
    const bot_user = bot_data.get(1);
    const content = bot_helper.generate_zuliprc_content(bot_user);
    const expected =
        "[api]\nemail=error-bot@zulip.org\n" +
        "key=QadL788EkiottHmukyhHgePUFHREiu8b\n" +
        "site=https://chat.example.com\n";

    assert.equal(content, expected);
});

test("generate_botserverrc_content", () => {
    const user = {
        email: "vabstest-bot@zulip.com",
        api_key: "nSlA0mUm7G42LP85lMv7syqFTzDE2q34",
    };
    const service = {
        token: "abcd1234",
    };
    const content = settings_bots.generate_botserverrc_content(
        user.email,
        user.api_key,
        service.token,
    );
    const expected =
        "[]\nemail=vabstest-bot@zulip.com\n" +
        "key=nSlA0mUm7G42LP85lMv7syqFTzDE2q34\n" +
        "site=https://chat.example.com\n" +
        "token=abcd1234\n";

    assert.equal(content, expected);
});
```

--------------------------------------------------------------------------------

---[FILE: settings_config.test.cjs]---
Location: zulip-main/web/tests/settings_config.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const settings_config = zrequire("settings_config");
const {set_realm} = zrequire("state_data");
const {initialize_user_settings} = zrequire("user_settings");

const realm = make_realm({realm_push_notifications_enabled: false});
set_realm(realm);
const user_settings = {};
initialize_user_settings({user_settings});

run_test("all_notifications", ({override}) => {
    override(user_settings, "enable_stream_desktop_notifications", false);
    override(user_settings, "enable_stream_audible_notifications", true);
    override(user_settings, "enable_stream_push_notifications", true);
    override(user_settings, "enable_stream_email_notifications", false);
    override(user_settings, "enable_desktop_notifications", false);
    override(user_settings, "enable_sounds", true);
    override(user_settings, "enable_offline_push_notifications", false);
    override(user_settings, "enable_offline_email_notifications", true);
    override(user_settings, "enable_followed_topic_desktop_notifications", false);
    override(user_settings, "enable_followed_topic_audible_notifications", true);
    override(user_settings, "enable_followed_topic_push_notifications", false);
    override(user_settings, "enable_followed_topic_email_notifications", true);
    override(user_settings, "enable_followed_topic_wildcard_mentions_notify", false);

    // Check that it throws error if incorrect settings name
    // is passed. In this case, we articulate that with
    // wildcard_mentions_notify being undefined, which will be
    // the case, if a wrong setting_name is passed.
    let error_message;
    let error_name;
    try {
        settings_config.all_notifications(user_settings);
    } catch (error) {
        error_name = error.name;
        error_message = error.message;
    }
    assert.equal(error_name, "TypeError");
    assert.equal(error_message, "Incorrect setting_name passed: wildcard_mentions_notify");

    override(user_settings, "wildcard_mentions_notify", false);
    const notifications = settings_config.all_notifications(user_settings);

    assert.deepEqual(notifications.general_settings, [
        {
            label: "translated: Channels",
            notification_settings: [
                {
                    is_checked: false,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "enable_stream_desktop_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: true,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "enable_stream_audible_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: true,
                    is_disabled: true,
                    is_mobile_checkbox: true,
                    setting_name: "enable_stream_push_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: false,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "enable_stream_email_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: false,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "wildcard_mentions_notify",
                    push_notifications_disabled: true,
                },
            ],
        },
        {
            label: "translated: DMs, mentions, and alerts",
            notification_settings: [
                {
                    is_checked: false,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "enable_desktop_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: true,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "enable_sounds",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: false,
                    is_disabled: true,
                    is_mobile_checkbox: true,
                    setting_name: "enable_offline_push_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: true,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "enable_offline_email_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: false,
                    is_disabled: true,
                    is_mobile_checkbox: false,
                    setting_name: "",
                    push_notifications_disabled: false,
                },
            ],
        },
        {
            label: "translated: Followed topics",
            help_link: "/help/follow-a-topic",
            notification_settings: [
                {
                    is_checked: false,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "enable_followed_topic_desktop_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: true,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "enable_followed_topic_audible_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: false,
                    is_disabled: true,
                    is_mobile_checkbox: true,
                    setting_name: "enable_followed_topic_push_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: true,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "enable_followed_topic_email_notifications",
                    push_notifications_disabled: true,
                },
                {
                    is_checked: false,
                    is_disabled: false,
                    is_mobile_checkbox: false,
                    setting_name: "enable_followed_topic_wildcard_mentions_notify",
                    push_notifications_disabled: true,
                },
            ],
        },
    ]);
});

run_test("customize_stream_notifications_table_row_data", () => {
    const customize_stream_notifications_table_row_data =
        settings_config.get_custom_stream_specific_notifications_table_row_data();

    assert.deepEqual(customize_stream_notifications_table_row_data, [
        {
            is_checked: false,
            is_disabled: true,
            is_mobile_checkbox: false,
            setting_name: "desktop_notifications",
            push_notifications_disabled: true,
        },
        {
            is_checked: false,
            is_disabled: true,
            is_mobile_checkbox: false,
            setting_name: "audible_notifications",
            push_notifications_disabled: true,
        },
        {
            is_checked: false,
            is_disabled: true,
            is_mobile_checkbox: true,
            setting_name: "push_notifications",
            push_notifications_disabled: true,
        },
        {
            is_checked: false,
            is_disabled: true,
            is_mobile_checkbox: false,
            setting_name: "email_notifications",
            push_notifications_disabled: true,
        },
        {
            is_checked: false,
            is_disabled: true,
            is_mobile_checkbox: false,
            setting_name: "wildcard_mentions_notify",
            push_notifications_disabled: true,
        },
    ]);
});
```

--------------------------------------------------------------------------------

---[FILE: settings_data.test.cjs]---
Location: zulip-main/web/tests/settings_data.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_user_group} = require("./lib/example_group.cjs");
const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, with_overrides, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const {page_params} = require("./lib/zpage_params.cjs");

const settings_data = zrequire("settings_data");
const settings_config = zrequire("settings_config");
const {set_current_user, set_realm} = zrequire("state_data");
const user_groups = zrequire("user_groups");
const {initialize_user_settings} = zrequire("user_settings");

const current_user = {};
set_current_user(current_user);
const realm = make_realm();
set_realm(realm);
const user_settings = {};
initialize_user_settings({user_settings});

/*
    Some methods in settings_data are fairly
    trivial, so the meaningful tests happen
    at the higher layers, such as when we
    test people.js.
*/

const admins = make_user_group({
    description: "Administrators",
    name: "role:administrators",
    id: 1,
    members: new Set([1]),
    is_system_group: true,
    direct_subgroup_ids: new Set(),
    can_add_members_group: 4,
    can_join_group: 4,
    can_manage_group: 4,
    can_mention_group: 1,
    can_remove_members_group: 4,
    deactivated: false,
});
const moderators = make_user_group({
    description: "Moderators",
    name: "role:moderators",
    id: 2,
    members: new Set([2]),
    is_system_group: true,
    direct_subgroup_ids: new Set([1]),
    can_add_members_group: 4,
    can_join_group: 4,
    can_leave_group: 4,
    can_manage_group: 4,
    can_mention_group: 1,
    can_remove_members_group: 4,
    deactivated: false,
});
const members = make_user_group({
    description: "Members",
    name: "role:members",
    id: 3,
    members: new Set([3, 4]),
    is_system_group: true,
    direct_subgroup_ids: new Set([1, 2]),
    can_add_members_group: 4,
    can_join_group: 4,
    can_leave_group: 4,
    can_manage_group: 4,
    can_mention_group: 4,
    can_remove_members_group: 4,
    deactivated: false,
});
const nobody = make_user_group({
    description: "Nobody",
    name: "role:nobody",
    id: 4,
    members: new Set(),
    is_system_group: true,
    direct_subgroup_ids: new Set(),
    can_add_members_group: 4,
    can_join_group: 4,
    can_leave_group: 4,
    can_manage_group: 4,
    can_mention_group: 2,
    can_remove_members_group: 4,
    deactivated: false,
});
const students = make_user_group({
    description: "Students group",
    name: "Students",
    id: 5,
    members: new Set([1, 2]),
    is_system_group: false,
    direct_subgroup_ids: new Set([4, 5]),
    can_add_members_group: 1,
    can_join_group: 1,
    can_leave_group: 1,
    can_manage_group: {
        direct_members: [4],
        direct_subgroups: [],
    },
    can_mention_group: 3,
    can_remove_members_group: 1,
    creator_id: 4,
    deactivated: false,
});
const deactivated_group = make_user_group({
    name: "Deactivated test group",
    id: 3,
    members: new Set([1, 2, 3]),
    is_system_group: false,
    direct_subgroup_ids: new Set([4, 5, 6]),
    can_add_members_group: 4,
    can_remove_members_group: 4,
    can_join_group: 1,
    can_leave_group: 1,
    can_manage_group: 1,
    can_mention_group: 1,
    deactivated: true,
});

const group_permission_settings = mock_esm("../src/group_permission_settings", {});

run_test("user_can_change_email", ({override}) => {
    const can_change_email = settings_data.user_can_change_email;

    override(current_user, "is_admin", true);
    assert.equal(can_change_email(), true);

    override(current_user, "is_admin", false);
    override(realm, "realm_email_changes_disabled", true);
    assert.equal(can_change_email(), false);

    override(realm, "realm_email_changes_disabled", false);
    assert.equal(can_change_email(), true);
});

run_test("user_can_change_name", ({override}) => {
    const can_change_name = settings_data.user_can_change_name;

    override(current_user, "is_admin", true);
    assert.equal(can_change_name(), true);

    override(current_user, "is_admin", false);
    override(realm, "realm_name_changes_disabled", true);
    override(realm, "server_name_changes_disabled", false);
    assert.equal(can_change_name(), false);

    override(realm, "realm_name_changes_disabled", false);
    override(realm, "server_name_changes_disabled", false);
    assert.equal(can_change_name(), true);

    override(realm, "realm_name_changes_disabled", false);
    override(realm, "server_name_changes_disabled", true);
    assert.equal(can_change_name(), false);
});

run_test("user_can_change_avatar", ({override}) => {
    const can_change_avatar = settings_data.user_can_change_avatar;

    override(current_user, "is_admin", true);
    assert.equal(can_change_avatar(), true);

    override(current_user, "is_admin", false);
    override(realm, "realm_avatar_changes_disabled", true);
    override(realm, "server_avatar_changes_disabled", false);
    assert.equal(can_change_avatar(), false);

    override(realm, "realm_avatar_changes_disabled", false);
    override(realm, "server_avatar_changes_disabled", false);
    assert.equal(can_change_avatar(), true);

    override(realm, "realm_avatar_changes_disabled", false);
    override(realm, "server_avatar_changes_disabled", true);
    assert.equal(can_change_avatar(), false);
});

run_test("user_can_change_logo", ({override}) => {
    const can_change_logo = settings_data.user_can_change_logo;

    override(current_user, "is_admin", true);
    override(realm, "zulip_plan_is_not_limited", true);
    assert.equal(can_change_logo(), true);

    override(current_user, "is_admin", false);
    override(realm, "zulip_plan_is_not_limited", false);
    assert.equal(can_change_logo(), false);

    override(current_user, "is_admin", true);
    override(realm, "zulip_plan_is_not_limited", false);
    assert.equal(can_change_logo(), false);

    override(current_user, "is_admin", false);
    override(realm, "zulip_plan_is_not_limited", true);
    assert.equal(can_change_logo(), false);
});

test_realm_group_settings(
    "realm_can_add_custom_emoji_group",
    settings_data.user_can_add_custom_emoji,
);

test_realm_group_settings(
    "realm_can_add_subscribers_group",
    settings_data.can_subscribe_others_to_all_accessible_streams,
);

test_realm_group_settings(
    "realm_can_delete_any_message_group",
    settings_data.user_can_delete_any_message,
);

test_realm_group_settings(
    "realm_can_delete_own_message_group",
    settings_data.user_can_delete_own_message,
);

test_realm_group_settings(
    "realm_can_invite_users_group",
    settings_data.user_can_invite_users_by_email,
);

test_realm_group_settings("realm_can_manage_billing_group", settings_data.user_has_billing_access);

test_realm_group_settings(
    "realm_can_move_messages_between_channels_group",
    settings_data.user_can_move_messages_between_streams,
);

test_realm_group_settings(
    "realm_can_move_messages_between_topics_group",
    settings_data.user_can_move_messages_to_another_topic,
);

test_realm_group_settings("realm_can_resolve_topics_group", settings_data.user_can_resolve_topic);

run_test("using_dark_theme", ({override}) => {
    override(user_settings, "color_scheme", settings_config.color_scheme_values.dark.code);
    assert.equal(settings_data.using_dark_theme(), true);

    override(user_settings, "color_scheme", settings_config.color_scheme_values.automatic.code);

    window.matchMedia = (query) => {
        assert.equal(query, "(prefers-color-scheme: dark)");
        return {matches: true};
    };
    assert.equal(settings_data.using_dark_theme(), true);

    window.matchMedia = (query) => {
        assert.equal(query, "(prefers-color-scheme: dark)");
        return {matches: false};
    };
    assert.equal(settings_data.using_dark_theme(), false);

    override(user_settings, "color_scheme", settings_config.color_scheme_values.light.code);
    assert.equal(settings_data.using_dark_theme(), false);
});

run_test("user_email_not_configured", ({override}) => {
    const user_email_not_configured = settings_data.user_email_not_configured;

    override(current_user, "is_owner", false);
    assert.equal(user_email_not_configured(), false);

    override(current_user, "is_owner", true);
    override(current_user, "delivery_email", "");
    assert.equal(user_email_not_configured(), true);

    override(current_user, "delivery_email", "name@example.com");
    assert.equal(user_email_not_configured(), false);
});

function test_realm_group_settings(setting_name, validation_func) {
    with_overrides(({override}) => {
        const admin_user_id = 1;
        const moderator_user_id = 2;
        const member_user_id = 3;

        const admins = make_user_group({
            name: "Admins",
            id: 1,
            members: new Set([admin_user_id]),
            is_system_group: true,
            direct_subgroup_ids: new Set(),
        });
        const moderators = make_user_group({
            name: "Moderators",
            id: 2,
            members: new Set([moderator_user_id]),
            is_system_group: true,
            direct_subgroup_ids: new Set([1]),
        });

        group_permission_settings.get_group_permission_setting_config = () => ({
            allow_everyone_group: false,
        });

        user_groups.initialize({realm_user_groups: [admins, moderators]});
        page_params.is_spectator = true;
        assert.equal(validation_func(), false);

        page_params.is_spectator = false;
        override(current_user, "is_guest", false);
        override(realm, setting_name, 1);
        override(current_user, "user_id", admin_user_id);
        assert.equal(validation_func(), true);

        override(current_user, "user_id", moderator_user_id);
        assert.equal(validation_func(), false);

        override(realm, setting_name, 2);
        override(current_user, "user_id", moderator_user_id);
        assert.equal(validation_func(), true);

        override(current_user, "user_id", member_user_id);
        assert.equal(validation_func(), false);

        override(current_user, "user_id", moderator_user_id);
        override(current_user, "is_guest", true);
        assert.equal(validation_func(), false);

        group_permission_settings.get_group_permission_setting_config = () => ({
            allow_everyone_group: true,
        });
        assert.equal(validation_func(), true);
    });
}

run_test("user_can_create_multiuse_invite", () => {
    test_realm_group_settings(
        "realm_create_multiuse_invite_group",
        settings_data.user_can_create_multiuse_invite,
    );
});

run_test("can_manage_user_group", ({override}) => {
    user_groups.initialize({
        realm_user_groups: [admins, moderators, members, nobody, students],
    });

    page_params.is_spectator = true;
    assert.ok(!settings_data.can_manage_user_group(students.id));

    page_params.is_spectator = false;
    override(realm, "realm_can_manage_all_groups", admins.id);
    override(current_user, "user_id", 3);
    assert.ok(!settings_data.can_manage_user_group(students.id));

    // non-admin group_creator
    override(current_user, "user_id", 4);
    assert.ok(settings_data.can_manage_user_group(students.id));

    // admin user
    override(current_user, "user_id", 1);
    assert.ok(settings_data.can_manage_user_group(students.id));

    // moderator user
    override(current_user, "user_id", 2);
    assert.ok(!settings_data.can_manage_user_group(students.id));

    // User with role member and not part of the group.
    override(realm, "realm_can_manage_all_groups", members.id);
    override(current_user, "user_id", 3);
    assert.ok(settings_data.can_manage_user_group(students.id));

    // User with role member and part of the group.
    override(current_user, "user_id", 2);
    assert.ok(settings_data.can_manage_user_group(students.id));

    override(realm, "realm_can_manage_all_groups", admins.id);
    override(current_user, "user_id", 2);
    assert.ok(!settings_data.can_manage_user_group(students.id));

    const event = {
        group_id: students.id,
        data: {
            can_manage_group: members.id,
        },
    };
    const students_group = user_groups.get_user_group_from_id(students.id);
    user_groups.update(event, students_group);
    assert.ok(settings_data.can_manage_user_group(students.id));

    override(current_user, "user_id", 3);
    assert.ok(settings_data.can_manage_user_group(students.id));
});

function test_user_group_permission_setting(override, setting_name, permission_func) {
    user_groups.initialize({
        realm_user_groups: [admins, moderators, members, nobody, students, deactivated_group],
    });
    override(realm, "realm_can_manage_all_groups", nobody.id);

    page_params.is_spectator = true;
    assert.ok(!permission_func(students.id));

    page_params.is_spectator = false;
    // admin user
    override(current_user, "user_id", 1);
    assert.ok(permission_func(students.id));

    // moderator user
    override(current_user, "user_id", 2);
    assert.ok(!permission_func(students.id));

    const event = {
        group_id: students.id,
        data: {},
    };
    const students_group = user_groups.get_user_group_from_id(students.id);
    event.data[setting_name] = moderators.id;
    user_groups.update(event, students_group);
    assert.ok(permission_func(students.id));

    override(current_user, "user_id", 1);
    assert.ok(permission_func(students.id));

    // Some other user.
    override(current_user, "user_id", 5);
    assert.ok(!permission_func(students.id));

    event.data[setting_name] = {
        direct_members: [5],
        direct_subgroups: [admins.id],
    };
    user_groups.update(event, students_group);
    assert.ok(permission_func(students.id));

    override(current_user, "user_id", 2);
    assert.ok(!permission_func(students.id));

    // User can join the group if they can manage the group which depends
    // on can_manage_group and realm.can_manage_all_groups settings.
    override(current_user, "user_id", 4);
    assert.ok(permission_func(students.id));

    override(realm, "realm_can_manage_all_groups", moderators.id);
    override(current_user, "user_id", 2);
    assert.ok(permission_func(students.id));

    // Can perform any join, leave, add, remove even if the group is deactivated
    assert.ok(permission_func(deactivated_group.id));
}

run_test("can_join_user_group", ({override}) => {
    test_user_group_permission_setting(
        override,
        "can_join_group",
        settings_data.can_join_user_group,
    );

    // User can join the group if they have permission to add others
    // in the group.
    override(realm, "realm_can_manage_all_groups", nobody.id);
    const event = {
        group_id: students.id,
        data: {
            can_manage_group: nobody.id,
            can_join_group: nobody.id,
            can_add_members_group: {
                direct_members: [5],
                direct_subgroups: [admins.id],
            },
        },
    };
    const students_group = user_groups.get_user_group_from_id(students.id);
    user_groups.update(event, students_group);

    override(current_user, "user_id", 2);
    assert.ok(!settings_data.can_join_user_group(students.id));

    override(current_user, "user_id", 5);
    assert.ok(settings_data.can_join_user_group(students.id));

    override(current_user, "user_id", 1);
    assert.ok(settings_data.can_join_user_group(students.id));
});

run_test("can_leave_user_group", ({override}) => {
    test_user_group_permission_setting(
        override,
        "can_leave_group",
        settings_data.can_leave_user_group,
    );

    // User can leave the group if they have permission to remove
    // others from the group.
    override(realm, "realm_can_manage_all_groups", nobody.id);
    const event = {
        group_id: students.id,
        data: {
            can_manage_group: nobody.id,
            can_leave_group: nobody.id,
            can_remove_members_group: {
                direct_members: [5],
                direct_subgroups: [admins.id],
            },
        },
    };
    const students_group = user_groups.get_user_group_from_id(students.id);
    user_groups.update(event, students_group);

    override(current_user, "user_id", 2);
    assert.ok(!settings_data.can_leave_user_group(students.id));

    override(current_user, "user_id", 5);
    assert.ok(settings_data.can_leave_user_group(students.id));

    override(current_user, "user_id", 1);
    assert.ok(settings_data.can_leave_user_group(students.id));
});

run_test("can_add_members_user_group", ({override}) => {
    test_user_group_permission_setting(
        override,
        "can_add_members_group",
        settings_data.can_add_members_to_user_group,
    );
});

run_test("can_remove_members_user_group", ({override}) => {
    test_user_group_permission_setting(
        override,
        "can_remove_members_group",
        settings_data.can_remove_members_from_user_group,
    );
});

run_test("type_id_to_string", () => {
    assert.equal(settings_data.bot_type_id_to_string(1), "translated: Generic bot");
    assert.equal(settings_data.bot_type_id_to_string(2), "translated: Incoming webhook");
    assert.equal(settings_data.bot_type_id_to_string(5), undefined);
});

run_test("user_can_access_all_other_users", ({override}) => {
    const guest_user_id = 1;
    const member_user_id = 2;

    const members = make_user_group({
        name: "role:members",
        id: 1,
        members: new Set([member_user_id]),
        is_system_group: true,
        direct_subgroup_ids: new Set(),
    });
    const everyone = make_user_group({
        name: "role:everyone",
        id: 2,
        members: new Set([guest_user_id]),
        is_system_group: true,
        direct_subgroup_ids: new Set([1]),
    });

    user_groups.initialize({realm_user_groups: [members, everyone]});
    override(realm, "realm_can_access_all_users_group", members.id);

    // Test spectators case.
    page_params.is_spectator = true;
    assert.ok(settings_data.user_can_access_all_other_users());

    page_params.is_spectator = false;
    override(current_user, "user_id", member_user_id);
    override(current_user, "is_guest", false);
    assert.ok(settings_data.user_can_access_all_other_users());
    override(current_user, "is_guest", true);
    // For coverage only: Here the is_guest optimization is skipped.
    assert.ok(settings_data.user_can_access_all_other_users());

    override(current_user, "user_id", guest_user_id);
    assert.ok(!settings_data.user_can_access_all_other_users());

    override(realm, "realm_can_access_all_users_group", everyone.id);
    assert.ok(settings_data.user_can_access_all_other_users());
});

run_test("user_can_create_public_streams", () => {
    test_realm_group_settings(
        "realm_can_create_public_channel_group",
        settings_data.user_can_create_public_streams,
    );
});

run_test("user_can_create_user_groups", () => {
    test_realm_group_settings("realm_can_create_groups", settings_data.user_can_create_user_groups);
});

run_test("user_can_manage_all_groups", () => {
    test_realm_group_settings(
        "realm_can_manage_all_groups",
        settings_data.user_can_manage_all_groups,
    );
});

run_test("user_can_create_private_streams", () => {
    test_realm_group_settings(
        "realm_can_create_private_channel_group",
        settings_data.user_can_create_private_streams,
    );
});

run_test("user_can_create_web_public_streams", ({override}) => {
    override(realm, "server_web_public_streams_enabled", true);
    override(realm, "realm_enable_spectator_access", true);

    test_realm_group_settings(
        "realm_can_create_web_public_channel_group",
        settings_data.user_can_create_web_public_streams,
    );
    const owner_user_id = 4;
    const owners = make_user_group({
        name: "Admins",
        id: 3,
        members: new Set([owner_user_id]),
        is_system_group: true,
        direct_subgroup_ids: new Set(),
    });
    override(current_user, "user_id", owner_user_id);
    user_groups.initialize({realm_user_groups: [owners]});

    override(realm, "server_web_public_streams_enabled", true);
    override(realm, "realm_enable_spectator_access", true);
    override(realm, "realm_can_create_web_public_channel_group", owners.id);
    assert.equal(settings_data.user_can_create_web_public_streams(), true);

    override(realm, "realm_enable_spectator_access", false);
    override(realm, "server_web_public_streams_enabled", true);
    assert.equal(settings_data.user_can_create_web_public_streams(), false);

    override(realm, "realm_enable_spectator_access", true);
    override(realm, "server_web_public_streams_enabled", false);
    assert.equal(settings_data.user_can_create_web_public_streams(), false);

    override(realm, "realm_enable_spectator_access", false);
    override(realm, "server_web_public_streams_enabled", false);
    assert.equal(settings_data.user_can_create_web_public_streams(), false);
});

run_test("guests_can_access_all_other_users", () => {
    const guest_user_id = 1;
    const member_user_id = 2;

    const members = make_user_group({
        name: "role:members",
        id: 1,
        members: new Set([member_user_id]),
        is_system_group: true,
        direct_subgroup_ids: new Set(),
    });
    const everyone = make_user_group({
        name: "role:everyone",
        id: 2,
        members: new Set([guest_user_id]),
        is_system_group: true,
        direct_subgroup_ids: new Set([1]),
    });

    user_groups.initialize({realm_user_groups: [members]});
    realm.realm_can_access_all_users_group = members.id;
    assert.ok(!settings_data.guests_can_access_all_other_users());

    user_groups.initialize({realm_user_groups: [members, everyone]});
    realm.realm_can_access_all_users_group = everyone.id;
    assert.ok(settings_data.guests_can_access_all_other_users());
});

run_test("user_can_summarize_topics", ({override}) => {
    override(realm, "server_can_summarize_topics", true);
    test_realm_group_settings(
        "realm_can_summarize_topics_group",
        settings_data.user_can_summarize_topics,
    );

    override(realm, "server_can_summarize_topics", false);
    assert.ok(!settings_data.user_can_summarize_topics());
});

run_test("should_mask_unread_count", ({override}) => {
    override(user_settings, "web_stream_unreads_count_display_policy", 3);
    let sub_muted = false;
    let unmuted_unread_count = 0;
    assert.equal(settings_data.should_mask_unread_count(sub_muted, unmuted_unread_count), true);

    override(user_settings, "web_stream_unreads_count_display_policy", 2);
    assert.equal(settings_data.should_mask_unread_count(sub_muted, unmuted_unread_count), false);

    sub_muted = true;
    assert.equal(settings_data.should_mask_unread_count(sub_muted, unmuted_unread_count), true);

    unmuted_unread_count = 2;
    assert.equal(settings_data.should_mask_unread_count(sub_muted, unmuted_unread_count), false);

    override(user_settings, "web_stream_unreads_count_display_policy", 1);
    assert.equal(settings_data.should_mask_unread_count(sub_muted, unmuted_unread_count), false);
});
```

--------------------------------------------------------------------------------

---[FILE: settings_emoji.test.cjs]---
Location: zulip-main/web/tests/settings_emoji.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const upload_widget = mock_esm("../src/upload_widget");
const settings_emoji = zrequire("settings_emoji");

run_test("add_custom_emoji_post_render", () => {
    let build_widget_stub = false;
    upload_widget.build_widget = (
        get_file_input,
        file_name_field,
        input_error,
        clear_button,
        upload_button,
    ) => {
        assert.deepEqual(get_file_input(), $("#emoji_file_input"));
        assert.deepEqual(file_name_field, $("#emoji-file-name"));
        assert.deepEqual(input_error, $("#emoji_file_input_error"));
        assert.deepEqual(clear_button, $("#emoji_image_clear_button"));
        assert.deepEqual(upload_button, $("#emoji_upload_button"));
        build_widget_stub = true;
    };
    settings_emoji.add_custom_emoji_post_render();
    assert.ok(build_widget_stub);
});
```

--------------------------------------------------------------------------------

---[FILE: settings_muted_users.test.cjs]---
Location: zulip-main/web/tests/settings_muted_users.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const channel = mock_esm("../src/channel");
const list_widget = mock_esm("../src/list_widget", {
    generic_sort_functions: noop,
});
mock_esm("../src/settings_data", {
    user_can_access_all_other_users: () => false,
});

const settings_muted_users = zrequire("settings_muted_users");
const muted_users = zrequire("muted_users");
const people = zrequire("people");
const {set_realm} = zrequire("state_data");
const {initialize_user_settings} = zrequire("user_settings");

set_realm(make_realm());
initialize_user_settings({user_settings: {}});

run_test("settings", ({override}) => {
    people.add_active_user({user_id: 5, email: "five@zulip.com", full_name: "Feivel Fiverson"});
    muted_users.add_muted_user(5, 1577836800);
    muted_users.add_muted_user(10, 1577836900);
    let populate_list_called = false;
    override(list_widget, "create", (_$container, list) => {
        assert.deepEqual(list, [
            {
                date_muted: 1577836800000,
                date_muted_str: "Jan 1, 2020",
                user_id: 5,
                user_name: "Feivel Fiverson",
                can_unmute: true,
            },
            {
                date_muted: 1577836900000,
                date_muted_str: "Jan 1, 2020",
                user_id: 10,
                user_name: "translated: Unknown user",
                can_unmute: false,
            },
        ]);
        populate_list_called = true;
    });

    settings_muted_users.reset();
    assert.equal(settings_muted_users.loaded, false);

    settings_muted_users.set_up();
    assert.equal(settings_muted_users.loaded, true);
    assert.ok(populate_list_called);

    const unmute_click_handler = $("body").get_on_handler("click", ".settings-unmute-user");
    assert.equal(typeof unmute_click_handler, "function");

    const event = {
        stopPropagation: noop,
    };

    const $unmute_button = $.create("settings-unmute-user");
    const $fake_row = $('tr[data-user-id="5"]');
    $unmute_button.closest = (opts) => {
        assert.equal(opts, "tr");
        return $fake_row;
    };

    let row_attribute_fetched = false;
    $fake_row.attr = (opts) => {
        assert.equal(opts, "data-user-id");
        row_attribute_fetched += 1;
        return "5";
    };

    let unmute_user_called = false;
    channel.del = (payload) => {
        assert.equal(payload.url, "/json/users/me/muted_users/5");
        unmute_user_called = true;
        return {abort() {}};
    };

    unmute_click_handler.call($unmute_button, event);
    assert.ok(unmute_user_called);
    assert.ok(row_attribute_fetched);

    let mute_user_called = false;
    channel.post = (payload) => {
        assert.equal(payload.url, "/json/users/me/muted_users/5");
        mute_user_called = true;
        return {abort() {}};
    };
    muted_users.mute_user(5);
    assert.ok(mute_user_called);
});
```

--------------------------------------------------------------------------------

````
