---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 804
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 804 of 1290)

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

---[FILE: navbar_alerts.test.cjs]---
Location: zulip-main/web/tests/navbar_alerts.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {addDays} = require("date-fns");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const {page_params} = require("./lib/zpage_params.cjs");

const desktop_notifications = mock_esm("../src/desktop_notifications");
const unread = mock_esm("../src/unread");
const util = mock_esm("../src/util");

const {localstorage} = zrequire("localstorage");
const navbar_alerts = zrequire("navbar_alerts");
const {set_current_user, set_realm} = zrequire("state_data");

const current_user = {};
set_current_user(current_user);
const realm = make_realm();
set_realm(realm);

function test(label, f) {
    run_test(label, (helpers) => {
        window.localStorage.clear();
        f(helpers);
    });
}

test("should_show_desktop_notifications_banner", ({override}) => {
    const ls = localstorage();

    // Show desktop notifications banner when following conditions are suitable:
    // - Notification permission is not already granted.
    // - The user is not a spectator.
    // - The device is not mobile.
    // - Notification permission is not denied.
    // - The user has not said to never show banner on this device again.
    ls.set("dontAskForNotifications", undefined);
    page_params.is_spectator = false;
    override(util, "is_mobile", () => false);
    override(desktop_notifications, "granted_desktop_notifications_permission", () => false);
    override(desktop_notifications, "permission_state", () => "default");
    assert.equal(navbar_alerts.should_show_desktop_notifications_banner(ls), true);

    // Don't ask for permission if user has said to never show banner on this device again.
    ls.set("dontAskForNotifications", true);
    assert.equal(navbar_alerts.should_show_desktop_notifications_banner(ls), false);
    ls.set("dontAskForNotifications", undefined);

    // Don't ask for permission if device is mobile.
    override(util, "is_mobile", () => true);
    assert.equal(navbar_alerts.should_show_desktop_notifications_banner(ls), false);
    override(util, "is_mobile", () => false);

    // Don't ask for permission if notification is denied by user.
    override(desktop_notifications, "permission_state", () => "denied");
    assert.equal(navbar_alerts.should_show_desktop_notifications_banner(ls), false);

    // Don't ask for permission if notification is already granted by user.
    override(desktop_notifications, "granted_desktop_notifications_permission", () => true);
    assert.equal(navbar_alerts.should_show_desktop_notifications_banner(ls), false);

    // Don't ask for permission if user is a spectator.
    page_params.is_spectator = true;
    assert.equal(navbar_alerts.should_show_desktop_notifications_banner(ls), false);
});

test("should_show_bankruptcy_banner", ({override}) => {
    // Show bankruptcy banner when following conditions are suitable:
    // - The user has read at least one message, i.e., furthest_read_time is defined.
    // - The user has more than 500 unread messages.
    // - The user has not read any message in the last 2 days.
    const start_time = new Date("2024-01-01T10:00:00.000Z"); // Wednesday 1/1/2024 10:00:00 AM (UTC+0)
    override(page_params, "furthest_read_time", start_time.getTime() / 1000);
    override(Date, "now", () => addDays(start_time, 3).getTime()); // Saturday 1/4/2024 10:00:00 AM (UTC+0)
    override(unread, "get_unread_message_count", () => 501);
    assert.equal(navbar_alerts.should_show_bankruptcy_banner(), true);

    // Don't show bankruptcy banner if user has not read any message.
    override(page_params, "furthest_read_time", undefined);
    assert.equal(navbar_alerts.should_show_bankruptcy_banner(), false);
    override(page_params, "furthest_read_time", start_time.getTime() / 1000);

    // Don't show bankruptcy banner if user has read any message in the last 2 days.
    override(Date, "now", () => addDays(start_time, 1).getTime()); // Thursday 1/2/2024 10:00:00 AM (UTC+0)
    assert.equal(navbar_alerts.should_show_bankruptcy_banner(), false);

    // Don't show bankruptcy banner if user has less <= 500 unread messages.
    override(unread, "get_unread_message_count", () => 500);
    assert.equal(navbar_alerts.should_show_bankruptcy_banner(), false);
});

test("should_show_organization_profile_incomplete_banner", ({override}) => {
    // Show organization profile incomplete banner when following conditions are suitable:
    // - The user is an admin.
    // - The organization is created >= 15 days ago.
    override(current_user, "is_admin", true);
    const start_time = new Date("2024-01-01T10:00:00.000Z"); // Wednesday 1/1/2024 10:00:00 AM (UTC+0)
    override(realm, "realm_date_created", start_time.getTime() / 1000);
    override(Date, "now", () => addDays(start_time, 15).getTime());
    assert.equal(
        navbar_alerts.should_show_organization_profile_incomplete_banner(realm.realm_date_created),
        true,
    );

    // Don't show banner if user is not an admin.
    override(current_user, "is_admin", false);
    assert.equal(
        navbar_alerts.should_show_organization_profile_incomplete_banner(realm.realm_date_created),
        false,
    );
    override(current_user, "is_admin", true);

    // Don't show banner if organization is created < 15 days ago.
    override(Date, "now", () => addDays(start_time, 14).getTime());
    assert.equal(
        navbar_alerts.should_show_organization_profile_incomplete_banner(realm.realm_date_created),
        false,
    );
});

test("is_organization_profile_incomplete", ({override}) => {
    // The organization profile is incomplete when the realm description is
    // empty or not updated after importing the organization from other product.
    override(realm, "realm_description", "Organization imported from Slack!");
    assert.equal(navbar_alerts.is_organization_profile_incomplete(), true);
    override(realm, "realm_description", "");
    assert.equal(navbar_alerts.is_organization_profile_incomplete(), true);

    // The organization profile is complete if the realm description is updated.
    override(realm, "realm_description", "Organization description already set!");
    assert.equal(navbar_alerts.is_organization_profile_incomplete(), false);
});

test("should_show_server_upgrade_banner", ({override}) => {
    const ls = localstorage();

    // Set the initial date, which will be set as the last upgrade nag dismissal time.
    const start_time = new Date("2024-01-01T10:00:00.000Z"); // Wednesday 1/1/2024 10:00:00 AM (UTC+0)
    override(Date, "now", () => start_time.getTime());
    ls.set("lastUpgradeNagDismissalTime", undefined);
    assert.equal(navbar_alerts.should_show_server_upgrade_banner(ls), true);
    navbar_alerts.set_last_upgrade_nag_dismissal_time(ls);

    // Set the date to <= 7 days from the last upgrade nag dismissal time.
    override(Date, "now", () => addDays(start_time, 7).getTime()); // Wednesday 1/8/2024 10:00:00 AM (UTC+0)
    assert.equal(navbar_alerts.should_show_server_upgrade_banner(ls), false);

    // Set the date to > 7 days from the last upgrade nag dismissal time.
    override(Date, "now", () => addDays(start_time, 8).getTime()); // Thursday 1/9/2024 10:00:00 AM (UTC+0)
    assert.equal(navbar_alerts.should_show_server_upgrade_banner(ls), true);
});
```

--------------------------------------------------------------------------------

---[FILE: navigation_views.test.cjs]---
Location: zulip-main/web/tests/navigation_views.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

set_global("page_params", {
    is_spectator: false,
});

const params = {
    navigation_views: [
        {
            fragment: "narrow/is/starred",
            is_pinned: true,
            name: null,
        },
        {
            fragment: "narrow/is/mentioned",
            is_pinned: false,
            name: null,
        },
        {
            fragment: "custom/view/1",
            is_pinned: true,
            name: "Custom View 1",
        },
    ],
};

const blueslip = zrequire("blueslip");
const people = zrequire("people");
const navigation_views = zrequire("navigation_views");
const {built_in_views_meta_data} = zrequire("navigation_views");
const {initialize_user_settings} = zrequire("user_settings");

people.add_active_user({
    email: "tester@zulip.com",
    full_name: "Tester von Tester",
    user_id: 42,
});

people.initialize_current_user(42);

const user_settings = {
    web_home_view: "inbox",
};
initialize_user_settings({user_settings});

navigation_views.initialize(params);

run_test("initialize", () => {
    assert.ok(navigation_views.get_navigation_view_by_fragment("narrow/is/starred"));
    assert.ok(navigation_views.get_navigation_view_by_fragment("narrow/is/mentioned"));
    assert.ok(navigation_views.get_navigation_view_by_fragment("custom/view/1"));
});

run_test("add_navigation_view", () => {
    const view = {
        fragment: "inbox",
        is_pinned: true,
        name: null,
    };
    navigation_views.add_navigation_view(view);
    assert.equal(navigation_views.get_navigation_view_by_fragment(view.fragment), view);
});

run_test("update_navigation_view", () => {
    const view = {
        fragment: "inbox",
        is_pinned: true,
        name: null,
    };
    navigation_views.add_navigation_view(view);
    assert.equal(navigation_views.get_navigation_view_by_fragment(view.fragment), view);
    navigation_views.update_navigation_view(view.fragment, {is_pinned: false});
    assert.equal(navigation_views.get_navigation_view_by_fragment(view.fragment).is_pinned, false);
    blueslip.expect("error", "Cannot find navigation view to update");
    navigation_views.update_navigation_view("nonexistent", {name: "Nonexistent"});
});

run_test("remove_navigation_view", () => {
    const view = {
        fragment: "inbox",
        is_pinned: true,
        name: null,
    };
    navigation_views.add_navigation_view(view);
    assert.equal(navigation_views.get_navigation_view_by_fragment(view.fragment), view);
    navigation_views.remove_navigation_view(view.fragment);
    assert.equal(navigation_views.get_navigation_view_by_fragment(view.fragment), undefined);
});

run_test("get_built_in_views", () => {
    const built_in_views = navigation_views.get_built_in_views();

    assert.ok(built_in_views.length > 0);

    const starred_view = built_in_views.find((view) => view.fragment === "narrow/is/starred");
    assert.ok(starred_view);
    assert.equal(starred_view.is_pinned, true);

    const mentions_view = built_in_views.find((view) => view.fragment === "narrow/is/mentioned");
    assert.ok(mentions_view);
    assert.equal(mentions_view.is_pinned, false);

    const inbox_view = built_in_views.find((view) => view.fragment === "inbox");
    assert.ok(inbox_view);
    assert.equal(inbox_view.is_pinned, built_in_views_meta_data.inbox.is_pinned);
});

run_test("get_all_navigation_views", () => {
    const all_views = navigation_views.get_all_navigation_views();

    assert.ok(all_views.length > 0);

    const starred_view = all_views.find((view) => view.fragment === "narrow/is/starred");
    assert.ok(starred_view);
    assert.equal(starred_view.is_pinned, true);
    assert.equal(starred_view.name, built_in_views_meta_data.starred_messages.name);

    const custom_view = all_views.find((view) => view.fragment === "custom/view/1");
    assert.ok(custom_view);
    assert.equal(custom_view.is_pinned, true);
    assert.equal(custom_view.name, "Custom View 1");

    const fragments = all_views.map((view) => view.fragment);
    const unique_fragments = [...new Set(fragments)];
    assert.equal(fragments.length, unique_fragments.length);
});
```

--------------------------------------------------------------------------------

---[FILE: notifications.test.cjs]---
Location: zulip-main/web/tests/notifications.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");
const {page_params} = require("./lib/zpage_params.cjs");

mock_esm("../src/electron_bridge");
mock_esm("../src/spoilers", {hide_spoilers_in_notification() {}});

const user_topics = zrequire("user_topics");
const stream_data = zrequire("stream_data");
const people = zrequire("people");

const desktop_notifications = zrequire("desktop_notifications");
const message_notifications = zrequire("message_notifications");
const {set_current_user} = zrequire("state_data");
const {initialize_user_settings} = zrequire("user_settings");

const current_user = {};
set_current_user(current_user);
const user_settings = {};
initialize_user_settings({user_settings});

// Not muted streams
const general = {
    subscribed: true,
    name: "general",
    stream_id: 10,
    is_muted: false,
    wildcard_mentions_notify: null,
};

// Muted streams
const muted = {
    subscribed: true,
    name: "muted",
    stream_id: 20,
    is_muted: true,
    wildcard_mentions_notify: null,
};

stream_data.add_sub_for_tests(general);
stream_data.add_sub_for_tests(muted);

user_topics.update_user_topics(
    general.stream_id,
    general.name,
    "muted topic",
    user_topics.all_visibility_policies.MUTED,
);

user_topics.update_user_topics(
    general.stream_id,
    general.name,
    "followed topic",
    user_topics.all_visibility_policies.FOLLOWED,
);

function test(label, f) {
    run_test(label, (helpers) => {
        helpers.override(current_user, "is_admin", false);
        page_params.realm_users = [];
        helpers.override(user_settings, "enable_followed_topic_desktop_notifications", true);
        helpers.override(user_settings, "enable_followed_topic_audible_notifications", true);
        helpers.override(user_settings, "enable_desktop_notifications", true);
        helpers.override(user_settings, "enable_sounds", true);
        helpers.override(user_settings, "enable_followed_topic_wildcard_mentions_notify", true);
        helpers.override(user_settings, "wildcard_mentions_notify", true);
        helpers.override(user_settings, "notification_sound", "ding");
        f(helpers);
    });
}

test("message_is_notifiable", ({override}) => {
    // A notification is sent if both message_is_notifiable(message)
    // and the appropriate should_send_*_notification function return
    // true.

    // Case 1: If the message was sent by this user,
    //  DO NOT notify the user
    // In this test, all other circumstances should trigger notification
    // EXCEPT sent_by_me, which should trump them
    let message = {
        id: muted.stream_id,
        content: "message number 1",
        sent_by_me: true,
        notification_sent: false,
        mentioned: true,
        mentioned_me_directly: true,
        type: "stream",
        stream_id: general.stream_id,
        topic: "whatever",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    // Not notifiable because it was sent by the current user
    assert.equal(message_notifications.message_is_notifiable(message), false);

    // Case 2: If the user has already been sent a notification about this message,
    //  DO NOT notify the user
    // In this test, all other circumstances should trigger notification
    // EXCEPT notification_sent, which should trump them
    // (ie: it mentions user, it's not muted, etc)
    message = {
        id: general.stream_id,
        content: "message number 2",
        sent_by_me: false,
        notification_sent: true,
        mentioned: true,
        mentioned_me_directly: true,
        type: "stream",
        stream_id: general.stream_id,
        topic: "whatever",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    assert.equal(message_notifications.message_is_notifiable(message), false);

    // Case 3: If a message mentions the user directly,
    //  DO notify the user
    // Mentioning trumps muting
    message = {
        id: 30,
        content: "message number 3",
        sent_by_me: false,
        notification_sent: false,
        mentioned: true,
        mentioned_me_directly: true,
        type: "stream",
        stream_id: muted.stream_id,
        topic: "topic_three",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // Case 4: If the message has been sent to a followed topic,
    // DO visually and audibly notify the user if 'enable_followed_topic_desktop_notifications'
    // and 'enable_followed_topic_audible_notifications' are enabled, respectively.
    // Messages to followed topics trumps muting
    message = {
        id: 30,
        content: "message number 3",
        sent_by_me: false,
        notification_sent: false,
        mentioned: false,
        mentioned_me_directly: false,
        type: "stream",
        stream_id: general.stream_id,
        topic: "followed topic",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // But not if 'enable_followed_topic_desktop_notifications'
    // and 'enable_followed_topic_audible_notifications' are disabled.
    override(user_settings, "enable_followed_topic_desktop_notifications", false);
    override(user_settings, "enable_followed_topic_audible_notifications", false);
    assert.equal(message_notifications.should_send_desktop_notification(message), false);
    assert.equal(message_notifications.should_send_audible_notification(message), false);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // Reset state
    override(user_settings, "enable_followed_topic_desktop_notifications", true);

    // Case 5:
    // Mentioning should trigger notification in unmuted topic
    message = {
        id: 40,
        content: "message number 4",
        sent_by_me: false,
        notification_sent: false,
        mentioned: true,
        mentioned_me_directly: true,
        type: "stream",
        stream_id: general.stream_id,
        topic: "vanilla",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // Case 6:
    // Wildcard mention should trigger notification in unmuted topic
    // if wildcard_mentions_notify
    message = {
        id: 40,
        content: "message number 4",
        sent_by_me: false,
        notification_sent: false,
        mentioned: true,
        mentioned_me_directly: false,
        type: "stream",
        stream_id: general.stream_id,
        topic: "vanilla",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // But not if it's disabled
    override(user_settings, "wildcard_mentions_notify", false);
    assert.equal(message_notifications.should_send_desktop_notification(message), false);
    assert.equal(message_notifications.should_send_audible_notification(message), false);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // And the stream-level setting overrides the global setting
    general.wildcard_mentions_notify = true;
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // Reset state
    override(user_settings, "wildcard_mentions_notify", true);
    general.wildcard_mentions_notify = null;

    // Case 7: If a message is in a muted stream
    //  and does not mention the user DIRECTLY (i.e. wildcard mention),
    //  DO NOT notify the user
    message = {
        id: 50,
        content: "message number 5",
        sent_by_me: false,
        notification_sent: false,
        mentioned: true,
        mentioned_me_directly: false,
        type: "stream",
        stream_id: muted.stream_id,
        topic: "whatever",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    assert.equal(message_notifications.message_is_notifiable(message), false);

    // Case 8: If a message is in a muted stream
    //  and does mention the user DIRECTLY,
    //  DO notify the user
    message = {
        id: 50,
        content: "message number 5",
        sent_by_me: false,
        notification_sent: false,
        mentioned: true,
        mentioned_me_directly: true,
        type: "stream",
        stream_id: muted.stream_id,
        topic: "whatever",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // Case 9: If a message is in a muted topic
    //  and does not mention the user DIRECTLY (i.e. wildcard mention),
    //  DO NOT notify the user
    message = {
        id: 50,
        content: "message number 6",
        sent_by_me: false,
        notification_sent: false,
        mentioned: true,
        mentioned_me_directly: false,
        type: "stream",
        stream_id: general.stream_id,
        topic: "muted topic",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    assert.equal(message_notifications.message_is_notifiable(message), false);

    // Case 10:
    // Wildcard mentions in a followed topic with 'wildcard_mentions_notify',
    // 'enable_followed_topic_desktop_notifications',
    // 'enable_followed_topic_audible_notifications' disabled and
    // 'enable_followed_topic_wildcard_mentions_notify' enabled;
    // DO visually and audibly notify the user
    override(user_settings, "wildcard_mentions_notify", false);
    override(user_settings, "enable_followed_topic_desktop_notifications", false);
    override(user_settings, "enable_followed_topic_audible_notifications", false);
    message = {
        id: 50,
        content: "message number 5",
        sent_by_me: false,
        notification_sent: false,
        mentioned: true,
        mentioned_me_directly: false,
        type: "stream",
        stream_id: general.stream_id,
        topic: "followed topic",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), true);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // But not if 'enable_followed_topic_wildcard_mentions_notify' is disabled
    override(user_settings, "enable_followed_topic_wildcard_mentions_notify", false);
    assert.equal(message_notifications.should_send_desktop_notification(message), false);
    assert.equal(message_notifications.should_send_audible_notification(message), false);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // Reset state
    override(user_settings, "wildcard_mentions_notify", true);
    override(user_settings, "enable_followed_topic_desktop_notifications", true);
    override(user_settings, "enable_followed_topic_audible_notifications", true);
    override(user_settings, "enable_followed_topic_wildcard_mentions_notify", true);

    // Case 11: If `None` is selected as the notification sound, send no
    // audible notification, no matter what other user configurations are.
    message = {
        id: 50,
        content: "message number 7",
        sent_by_me: false,
        notification_sent: false,
        mentioned: true,
        mentioned_me_directly: true,
        type: "stream",
        stream_id: general.stream_id,
        topic: "whatever",
    };
    override(user_settings, "notification_sound", "none");
    assert.equal(message_notifications.should_send_desktop_notification(message), true);
    assert.equal(message_notifications.should_send_audible_notification(message), false);
    assert.equal(message_notifications.message_is_notifiable(message), true);

    // Reset state
    override(user_settings, "notification_sound", "ding");

    // If none of the above cases apply
    // (ie: topic is not muted, message does not mention user,
    //  no notification sent before, message not sent by user),
    // return true to pass it to notifications settings, which will return false.
    message = {
        id: 60,
        content: "message number 8",
        sent_by_me: false,
        notification_sent: false,
        mentioned: false,
        mentioned_me_directly: false,
        type: "stream",
        stream_id: general.stream_id,
        topic: "whatever",
    };
    assert.equal(message_notifications.should_send_desktop_notification(message), false);
    assert.equal(message_notifications.should_send_audible_notification(message), false);
    assert.equal(message_notifications.message_is_notifiable(message), true);
});

test("basic_notifications", () => {
    $("<div>").set_find_results(".emoji", {text: () => ({contents: () => ({unwrap() {}})})});
    $("<div>").set_find_results("span.katex", {each() {}});
    $("<div>").children = () => [];

    let n; // Object for storing all notification data for assertions.
    let last_closed_message_id = null;
    let last_shown_message_id = null;

    // Notifications API stub
    class StubNotification {
        constructor(_title, {icon, body, tag}) {
            this.icon = icon;
            this.body = body;
            this.tag = tag;
            // properties for testing.
            this.tests = {
                shown: false,
            };
            last_shown_message_id = this.tag;
        }

        addEventListener() {}

        close() {
            last_closed_message_id = this.tag;
        }
    }

    desktop_notifications.set_notification_api(StubNotification);

    const jesse = {
        email: "jesse@example.com",
        full_name: "Jesse Pinkman",
        user_id: 1,
    };
    const gus = {
        email: "gus@example.com",
        full_name: "Gus Fring",
        user_id: 2,
    };
    const walter = {
        email: "walter@example.com",
        full_name: "Walter White",
        user_id: 3,
    };
    people.add_active_user(jesse);
    people.add_active_user(gus);
    people.add_active_user(walter);

    const stream_message_1 = {
        id: 1000,
        content: "@-mentions the user",
        avatar_url: "url",
        sent_by_me: false,
        sender_id: jesse.user_id,
        sender_full_name: jesse.full_name,
        notification_sent: false,
        mentioned_me_directly: true,
        type: "stream",
        stream_id: general.stream_id,
        topic: "whatever",
    };

    const stream_message_2 = {
        id: 1500,
        avatar_url: "url",
        content: "@-mentions the user",
        sent_by_me: false,
        sender_id: gus.user_id,
        sender_full_name: gus.full_name,
        notification_sent: false,
        mentioned_me_directly: true,
        type: "stream",
        stream_id: general.stream_id,
        topic: "lunch",
    };

    const direct_message = {
        id: 2000,
        content: "direct message",
        avatar_url: "url",
        sent_by_me: false,
        sender_id: gus.user_id,
        sender_full_name: gus.full_name,
        notification_sent: false,
        type: "private",
        to_user_ids: `${gus.user_id},${walter.user_id}`,
        display_recipient: [
            {id: gus.user_id, full_name: gus.full_name, email: gus.email},
            {id: walter.user_id, full_name: walter.full_name, email: walter.email},
        ],
        display_reply_to: `${gus.full_name}, ${walter.full_name}`,
    };

    const test_notification_message = {
        id: 3000,
        type: "test-notification",
        sender_email: "notification-bot@zulip.com",
        sender_full_name: "Notification Bot",
        display_reply_to: "Notification Bot",
        content: "test notification",
        unread: true,
    };

    // Send notification.
    message_notifications.process_notification({message: stream_message_1, desktop_notify: true});
    n = desktop_notifications.get_notifications();
    assert.equal(n.has("channel:1:10:whatever"), true);
    assert.equal(n.size, 1);
    assert.equal(last_shown_message_id, stream_message_1.id.toString());

    // Remove notification.
    desktop_notifications.close_notification(stream_message_1);
    n = desktop_notifications.get_notifications();
    assert.equal(n.has("channel:1:10:whatever"), false);
    assert.equal(n.size, 0);
    assert.equal(last_closed_message_id, stream_message_1.id.toString());

    // Send notification.
    stream_message_1.id = 1001;
    message_notifications.process_notification({message: stream_message_1, desktop_notify: true});
    n = desktop_notifications.get_notifications();
    assert.equal(n.has("channel:1:10:whatever"), true);
    assert.equal(n.size, 1);
    assert.equal(last_shown_message_id, stream_message_1.id.toString());

    // Process same message again. Notification count shouldn't increase.
    stream_message_1.id = 1002;
    message_notifications.process_notification({message: stream_message_1, desktop_notify: true});
    n = desktop_notifications.get_notifications();
    assert.equal(n.has("channel:1:10:whatever"), true);
    assert.equal(n.size, 1);
    assert.equal(last_shown_message_id, stream_message_1.id.toString());

    // Send another message. Notification count should increase.
    message_notifications.process_notification({message: stream_message_2, desktop_notify: true});
    n = desktop_notifications.get_notifications();
    assert.equal(n.has("channel:2:10:lunch"), true);
    assert.equal(n.has("channel:1:10:whatever"), true);
    assert.equal(n.size, 2);
    assert.equal(last_shown_message_id, stream_message_2.id.toString());

    // Remove notifications.
    desktop_notifications.close_notification(stream_message_1);
    desktop_notifications.close_notification(stream_message_2);
    n = desktop_notifications.get_notifications();
    assert.equal(n.has("channel:1:10:whatever"), false);
    assert.equal(n.size, 0);
    assert.equal(last_closed_message_id, stream_message_2.id.toString());

    message_notifications.process_notification({message: direct_message, desktop_notify: true});
    n = desktop_notifications.get_notifications();
    assert.equal(n.has("dm:2,3"), true);
    assert.equal(n.size, 1);
    desktop_notifications.close_notification(direct_message);

    message_notifications.process_notification({
        message: test_notification_message,
        desktop_notify: true,
    });
    n = desktop_notifications.get_notifications();
    assert.equal(n.has("test:Notification Bot"), true);
    assert.equal(n.size, 1);
    desktop_notifications.close_notification(test_notification_message);
});
```

--------------------------------------------------------------------------------

---[FILE: password.test.cjs]---
Location: zulip-main/web/tests/password.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const {password_quality, password_warning} = zrequire("password_quality");

function password_field(min_length, max_length, min_guesses) {
    return {
        attr(name) {
            switch (name) {
                case "data-min-length":
                    return min_length;
                case "data-min-guesses":
                    return min_guesses;
                case "data-max-length":
                    return max_length;
                /* istanbul ignore next */
                default:
                    throw new Error(`Unknown attribute ${name}`);
            }
        },
    };
}

run_test("basics w/progress bar", () => {
    let accepted;
    let password;
    let warning;

    const $bar = (function () {
        const $self = {};

        $self.width = (width) => {
            $self.w = width;
            return $self;
        };

        $self.removeClass = (arg) => {
            assert.equal(arg, "bar-success bar-danger");
            return $self;
        };

        $self.addClass = (arg) => {
            $self.added_class = arg;
            return $self;
        };

        return $self;
    })();

    password = "z!X4@S_&";
    accepted = password_quality(password, $bar, password_field(10, 80000));
    assert.ok(!accepted);
    assert.equal($bar.w, "39.7%");
    assert.equal($bar.added_class, "bar-danger");
    warning = password_warning(password, password_field(10));
    assert.equal(warning, "translated: Password should be at least 10 characters long.");

    password = "foo";
    accepted = password_quality(password, $bar, password_field(2, 200, 10));
    assert.ok(accepted);
    assert.equal($bar.w, "10.390277164940581%");
    assert.equal($bar.added_class, "bar-success");
    warning = password_warning(password, password_field(2));
    assert.equal(warning, "translated: Password is too weak.");

    password = "aaaaaaaa";
    accepted = password_quality(password, $bar, password_field(6, 1e100));
    assert.ok(!accepted);
    assert.equal($bar.added_class, "bar-danger");
    warning = password_warning(password, password_field(6));
    assert.equal(warning, 'Repeated characters like "aaa" are easy to guess.');

    // Test a password that's longer than the configured limit.
    password = "hfHeo34FksdBChjeruShJ@sidfgusd";
    accepted = password_quality(password, $bar, password_field(6, 20, 1e20));
    assert.ok(!accepted);
    assert.equal($bar.added_class, "bar-danger");
    warning = password_warning(password, password_field(6, 20, 1e20));
    assert.equal(warning, `translated: Maximum password length: 20 characters.`);
});
```

--------------------------------------------------------------------------------

````
