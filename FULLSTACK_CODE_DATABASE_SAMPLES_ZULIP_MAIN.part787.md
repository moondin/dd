---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 787
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 787 of 1290)

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

---[FILE: compose_video.test.cjs]---
Location: zulip-main/web/tests/compose_video.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const events = require("./lib/events.cjs");
const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, set_global, with_overrides, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");
const {page_params} = require("./lib/zpage_params.cjs");

const channel = mock_esm("../src/channel");
const compose_closed_ui = mock_esm("../src/compose_closed_ui");
const compose_ui = mock_esm("../src/compose_ui");
mock_esm("../src/resize", {
    watch_manual_resize() {},
});
set_global("document", {
    querySelector() {},
});
set_global("navigator", {});
set_global(
    "ResizeObserver",
    class ResizeObserver {
        observe() {}
    },
);

const server_events_dispatch = zrequire("server_events_dispatch");
const compose_setup = zrequire("compose_setup");
const {set_current_user, set_realm} = zrequire("state_data");

const realm = make_realm();
set_realm(realm);
const current_user = {};
set_current_user(current_user);

function stub_out_video_calls() {
    const $elem = $(".compose-control-buttons-container .video_link");
    $elem.toggle = (show) => {
        /* istanbul ignore if */
        if (show) {
            $elem.show();
        } else {
            $elem.hide();
        }
    };
}

const realm_available_video_chat_providers = {
    disabled: {
        id: 0,
        name: "disabled",
    },
    jitsi_meet: {
        id: 1,
        name: "Jitsi Meet",
    },
    zoom: {
        id: 3,
        name: "Zoom",
    },
    big_blue_button: {
        id: 4,
        name: "BigBlueButton",
    },
};

function test(label, f) {
    run_test(label, (helpers) => {
        helpers.override(
            realm,
            "realm_available_video_chat_providers",
            realm_available_video_chat_providers,
        );
        f(helpers);
    });
}

test("videos", ({override}) => {
    override(realm, "realm_video_chat_provider", realm_available_video_chat_providers.disabled.id);
    override(window, "to_$", () => $("window-stub"));

    stub_out_video_calls();

    compose_setup.initialize();

    (function test_no_provider_video_link_compose_clicked() {
        const $textarea = $.create("target-stub");
        $textarea.set_parents_result(".message_edit_form", []);

        const ev = {
            preventDefault() {},
            stopPropagation() {},
        };

        const handler = $("body").get_on_handler("click", ".video_link");
        $("textarea#compose-textarea").val("");

        with_overrides(({disallow}) => {
            disallow(compose_ui, "insert_syntax_and_focus");
            handler(ev);
        });
    })();

    (function test_jitsi_video_link_compose_clicked() {
        let syntax_to_insert;
        let called = false;

        const $textarea = $.create("jitsi-target-stub");
        $textarea.set_parents_result(".message_edit_form", []);

        const ev = {
            preventDefault() {},
            stopPropagation() {},
        };

        override(compose_ui, "insert_syntax_and_focus", (syntax) => {
            syntax_to_insert = syntax;
            called = true;
        });

        const handler = $("body").get_on_handler("click", ".video_link");
        $("textarea#compose-textarea").val("");

        override(
            realm,
            "realm_video_chat_provider",
            realm_available_video_chat_providers.jitsi_meet.id,
        );

        override(realm, "realm_jitsi_server_url", null);
        override(realm, "server_jitsi_server_url", null);
        handler(ev);
        assert.ok(!called);

        override(realm, "realm_jitsi_server_url", null);
        override(realm, "server_jitsi_server_url", "https://server.example.com");
        handler.call($textarea, ev);
        // video link ids consist of 15 random digits
        let video_link_regex =
            /\[translated: Join video call\.]\(https:\/\/server.example.com\/\d{15}#config.startWithVideoMuted=false\)/;
        assert.ok(called);
        assert.match(syntax_to_insert, video_link_regex);

        override(realm, "realm_jitsi_server_url", "https://realm.example.com");
        override(realm, "server_jitsi_server_url", null);
        handler.call($textarea, ev);
        video_link_regex =
            /\[translated: Join video call\.]\(https:\/\/realm.example.com\/\d{15}#config.startWithVideoMuted=false\)/;
        assert.ok(called);
        assert.match(syntax_to_insert, video_link_regex);

        override(realm, "realm_jitsi_server_url", "https://realm.example.com");
        override(realm, "server_jitsi_server_url", "https://server.example.com");
        handler.call($textarea, ev);
        video_link_regex =
            /\[translated: Join video call\.]\(https:\/\/realm.example.com\/\d{15}#config.startWithVideoMuted=false\)/;
        assert.ok(called);
        assert.match(syntax_to_insert, video_link_regex);
    })();

    (function test_zoom_video_and_audio_links_compose_clicked() {
        let syntax_to_insert;
        let called = false;

        const $textarea = $.create("zoom-target-stub");
        $textarea.set_parents_result(".message_edit_form", []);

        const ev = {
            preventDefault() {},
            stopPropagation() {},
        };

        override(compose_ui, "insert_syntax_and_focus", (syntax) => {
            syntax_to_insert = syntax;
            called = true;
        });

        override(realm, "realm_video_chat_provider", realm_available_video_chat_providers.zoom.id);
        override(current_user, "has_zoom_token", false);

        window.open = (url) => {
            assert.ok(url.endsWith("/calls/zoom/register"));

            // The event here has value=true.  We keep it in events.js to
            // allow our tooling to verify its schema.
            server_events_dispatch.dispatch_normal_event(events.fixtures.has_zoom_token);
        };

        channel.post = (payload) => {
            assert.equal(payload.url, "/json/calls/zoom/create");
            payload.success({
                result: "success",
                msg: "",
                url: "example.zoom.com",
            });
            return {abort() {}};
        };

        $("textarea#compose-textarea").val("");
        const video_handler = $("body").get_on_handler("click", ".video_link");
        video_handler.call($textarea, ev);
        const video_link_regex = /\[translated: Join video call\.]\(example\.zoom\.com\)/;
        assert.ok(called);
        assert.match(syntax_to_insert, video_link_regex);

        $("textarea#compose-textarea").val("");
        const audio_handler = $("body").get_on_handler("click", ".audio_link");
        audio_handler.call($textarea, ev);
        const audio_link_regex = /\[translated: Join voice call\.]\(example\.zoom\.com\)/;
        assert.ok(called);
        assert.match(syntax_to_insert, audio_link_regex);
    })();

    (function test_bbb_audio_and_video_links_compose_clicked() {
        let syntax_to_insert;
        let called = false;

        const $textarea = $.create("bbb-target-stub");
        $textarea.set_parents_result(".message_edit_form", []);

        const ev = {
            preventDefault() {},
            stopPropagation() {},
        };

        override(compose_ui, "insert_syntax_and_focus", (syntax) => {
            syntax_to_insert = syntax;
            called = true;
        });

        $("textarea#compose-textarea").val("");

        override(
            realm,
            "realm_video_chat_provider",
            realm_available_video_chat_providers.big_blue_button.id,
        );

        override(compose_closed_ui, "get_recipient_label", () => ({label_text: "a"}));

        channel.get = (options) => {
            assert.equal(options.url, "/json/calls/bigbluebutton/create");
            assert.equal(options.data.meeting_name, "a meeting");
            options.success({
                result: "success",
                msg: "",
                url:
                    "/calls/bigbluebutton/join?meeting_id=%22zulip-1%22&moderator=%22AAAAAAAAAA%22&lock_settings_disable_cam=" +
                    options.data.voice_only +
                    "&checksum=%2232702220bff2a22a44aee72e96cfdb4c4091752e%22",
            });
        };

        $("textarea#compose-textarea").val("");

        const video_handler = $("body").get_on_handler("click", ".video_link");
        video_handler.call($textarea, ev);
        const video_link_regex =
            /\[translated: Join video call\.]\(\/calls\/bigbluebutton\/join\?meeting_id=%22zulip-1%22&moderator=%22AAAAAAAAAA%22&lock_settings_disable_cam=false&checksum=%2232702220bff2a22a44aee72e96cfdb4c4091752e%22\)/;
        assert.ok(called);
        assert.match(syntax_to_insert, video_link_regex);

        const audio_handler = $("body").get_on_handler("click", ".audio_link");
        audio_handler.call($textarea, ev);
        const audio_link_regex =
            /\[translated: Join voice call\.]\(\/calls\/bigbluebutton\/join\?meeting_id=%22zulip-1%22&moderator=%22AAAAAAAAAA%22&lock_settings_disable_cam=true&checksum=%2232702220bff2a22a44aee72e96cfdb4c4091752e%22\)/;
        assert.ok(called);
        assert.match(syntax_to_insert, audio_link_regex);
    })();
});

test("test_video_chat_button_toggle disabled", ({override}) => {
    override(realm, "realm_video_chat_provider", realm_available_video_chat_providers.disabled.id);
    override(window, "to_$", () => $("window-stub"));
    compose_setup.initialize();
    assert.equal($(".compose-control-buttons-container .video_link").visible(), false);
});

test("test_video_chat_button_toggle no url", ({override}) => {
    override(
        realm,
        "realm_video_chat_provider",
        realm_available_video_chat_providers.jitsi_meet.id,
    );
    override(window, "to_$", () => $("window-stub"));
    page_params.jitsi_server_url = null;
    compose_setup.initialize();
    assert.equal($(".compose-control-buttons-container .video_link").visible(), false);
});

test("test_video_chat_button_toggle enabled", ({override}) => {
    override(
        realm,
        "realm_video_chat_provider",
        realm_available_video_chat_providers.jitsi_meet.id,
    );
    override(realm, "realm_jitsi_server_url", "https://meet.jit.si");
    override(window, "to_$", () => $("window-stub"));
    compose_setup.initialize();
    assert.equal($(".compose-control-buttons-container .video_link").visible(), true);
});
```

--------------------------------------------------------------------------------

---[FILE: conversation_participants.test.cjs]---
Location: zulip-main/web/tests/conversation_participants.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const _ = require("lodash");

const {make_user, make_bot} = require("./lib/example_user.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const people = zrequire("people");
const {ConversationParticipants} = zrequire("../src/conversation_participants.ts");

const user1 = make_user();
const user2 = make_user();
const bot1 = make_bot();
const bot2 = make_bot();

people._add_user(user1);
people._add_user(user2);
people._add_user(bot1);
people._add_user(bot2);

const human_messages = [
    {
        id: 1,
        sender_id: user1.user_id,
        sent_by_me: true,
    },
    {
        id: 2,
        sender_id: user2.user_id,
        sent_by_me: false,
    },
];

const bot_messages = [
    {
        id: 4,
        sender_id: bot1.user_id,
        sent_by_me: false,
    },
    {
        id: 5,
        sender_id: bot2.user_id,
        sent_by_me: false,
    },
];

const all_messages = [...human_messages, ...bot_messages];

run_test("Add participants", () => {
    const participants = new ConversationParticipants(all_messages);
    assert.ok(_.isEqual(participants.humans, new Set([user1.user_id, user2.user_id])));
    assert.ok(_.isEqual(participants.bots, new Set([bot1.user_id, bot2.user_id])));
    // None since they were not added as active users.
    assert.equal(participants.visible().size, 0);

    // Add user1 as active user.
    people.add_active_user(user1);
    assert.ok(_.isEqual(participants.visible(), new Set([user1.user_id])));
});
```

--------------------------------------------------------------------------------

---[FILE: demo_organizations.test.cjs]---
Location: zulip-main/web/tests/demo_organizations.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {addDays} = require("date-fns");

const {make_realm} = require("./lib/example_realm.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const demo_organization_ui = zrequire("demo_organizations_ui");
const {set_realm} = zrequire("state_data");

const realm = make_realm();
set_realm(realm);

run_test("get_demo_organization_deadline_days_remaining", ({override}) => {
    const start_time = new Date("2024-01-01T10:00:00.000Z"); // Wednesday 1/1/2024 10:00:00 AM (UTC+0)
    override(Date, "now", () => start_time);

    const demo_organization_scheduled_deletion_date = addDays(start_time, 7); // Wednesday 1/8/2024 10:00:00 AM (UTC+0)
    override(
        realm,
        "demo_organization_scheduled_deletion_date",
        Math.trunc(demo_organization_scheduled_deletion_date / 1000),
    );
    assert.equal(demo_organization_ui.get_demo_organization_deadline_days_remaining(), 7);
});
```

--------------------------------------------------------------------------------

---[FILE: deprecated_feature_notice.test.cjs]---
Location: zulip-main/web/tests/deprecated_feature_notice.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

set_global("navigator", {
    userAgent: "",
});

const deprecated_feature_notice = zrequire("deprecated_feature_notice");

run_test("get_hotkey_deprecation_notice", () => {
    const expected =
        'translated HTML: We\'ve replaced the "Shift + C" hotkey with "X" to make this common shortcut easier to trigger.';
    const actual = deprecated_feature_notice.get_hotkey_deprecation_notice("Shift + C", "X");
    assert.equal(actual, expected);
});
```

--------------------------------------------------------------------------------

````
