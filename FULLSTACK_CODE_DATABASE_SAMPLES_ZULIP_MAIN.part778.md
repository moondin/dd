---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 778
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 778 of 1290)

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

---[FILE: blueslip_stacktrace.test.cjs]---
Location: zulip-main/web/tests/blueslip_stacktrace.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const blueslip_stacktrace = zrequire("blueslip_stacktrace");

run_test("clean_path", () => {
    // Local file
    assert.strictEqual(
        blueslip_stacktrace.clean_path("webpack:///web/src/upload.ts"),
        "/web/src/upload.ts",
    );

    // Third party library (jQuery)
    assert.strictEqual(
        blueslip_stacktrace.clean_path(
            "webpack:///.-npm-cache/de76fb6f582a29b053274f9048b6158091351048/node_modules/jquery/dist/jquery.js",
        ),
        "jquery/dist/jquery.js",
    );

    // Third party library (underscore)
    assert.strictEqual(
        blueslip_stacktrace.clean_path(
            "webpack:///.-npm-cache/de76fb6f582a29b053274f9048b…58091351048/node_modules/underscore/underscore.js",
        ),
        "underscore/underscore.js",
    );
});

run_test("clean_function_name", () => {
    assert.deepEqual(blueslip_stacktrace.clean_function_name(undefined), undefined);

    // Local file
    assert.deepEqual(
        blueslip_stacktrace.clean_function_name("Object../web/src/upload.ts.exports.options"),
        {
            scope: "Object../web/src/upload.ts.exports.",
            name: "options",
        },
    );

    // Third party library (jQuery)
    assert.deepEqual(blueslip_stacktrace.clean_function_name("mightThrow"), {
        scope: "",
        name: "mightThrow",
    });

    // Third party library (underscore)
    assert.deepEqual(
        blueslip_stacktrace.clean_function_name(
            "Function.../zulip-npm-cache/de76fb6f582a29b053274f…es/underscore/underscore.js?3817._.each._.forEach",
        ),
        {
            scope: "Function.../zulip-npm-cache/de76fb6f582a29b053274f…es/underscore/underscore.js?3817._.each._.",
            name: "forEach",
        },
    );
});
```

--------------------------------------------------------------------------------

---[FILE: bot_data.test.cjs]---
Location: zulip-main/web/tests/bot_data.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const bot_data = zrequire("bot_data");

const people = zrequire("people");

// Bot types and service bot types can be found
// in zerver/models/users.py - UserProfile Class or
// zever/openapi/zulip.yaml

const me = {
    email: "me@zulip.com",
    full_name: "Me Myself",
    user_id: 2,
};

const fred = {
    email: "fred@zulip.com",
    full_name: "Fred Frederickson",
    user_id: 3,
};

const bot_data_params = {
    realm_bots: [
        {
            api_key: "1234567890qwertyuioop",
            avatar_url: "",
            bot_type: 1, // DEFAULT_BOT
            default_all_public_streams: true,
            default_events_register_stream: "register stream 42",
            default_sending_stream: "sending stream 42",
            email: "bot0@zulip.com",
            full_name: "Bot 0",
            is_active: true,
            owner_id: 4,
            user_id: 42,
            services: [],
            extra: "This field should be ignored",
        },
        {
            api_key: "1234567890zxcvbnm",
            avatar_url: "",
            bot_type: 3, // OUTGOING_WEBHOOK_BOT
            default_all_public_streams: true,
            default_events_register_stream: "register stream 314",
            default_sending_stream: "sending stream 314",
            email: "outgoingwebhook@zulip.com",
            full_name: "Outgoing webhook",
            is_active: true,
            owner_id: 5,
            user_id: 314,
            services: [{base_url: "http://foo.com", interface: 1, token: "basictoken12345"}],
            extra: "This field should be ignored",
        },
    ],
};

function test(label, f) {
    run_test(label, ({override}) => {
        people.add_active_user(me);
        people.initialize_current_user(me.user_id);
        bot_data.initialize(bot_data_params);
        // Our startup logic should have added Bot 0 from page_params.
        assert.equal(bot_data.get(42).full_name, "Bot 0");
        assert.equal(bot_data.get(314).full_name, "Outgoing webhook");
        f({override});
    });
}

test("test_basics", () => {
    people.add_active_user(fred);
    const test_bot = {
        api_key: "qwertyuioop1234567890",
        avatar_url: "",
        // Default bot
        bot_type: 1,
        default_all_public_streams: true,
        default_events_register_stream: "register stream 43",
        default_sending_stream: "sending stream 43",
        email: "bot1@zulip.com",
        full_name: "Bot 1",
        is_active: true,
        owner_id: 6,
        user_id: 43,
        services: [],
        extra: "This field should be ignored",
    };
    const test_embedded_bot = {
        api_key: "zxcvbnm1234567890",
        avatar_url: "",
        bot_type: 4, // EMBEDDED_BOT
        default_all_public_streams: true,
        default_events_register_stream: "register stream 143",
        default_sending_stream: "sending stream 143",
        email: "embedded-bot@zulip.com",
        full_name: "Embedded bot 1",
        is_active: true,
        owner_id: 7,
        user_id: 143,
        services: [
            {
                config_data: {key: "12345678"},
                service_name: "giphy",
            },
        ],
        extra: "This field should be ignored",
    };

    (function test_add() {
        bot_data.add(test_bot);
        const bot = bot_data.get(43);
        assert.equal("qwertyuioop1234567890", bot.api_key);
        assert.equal("", bot.avatar_url);
        assert.equal(1, bot.bot_type);
        assert.equal(true, bot.default_all_public_streams);
        assert.equal("register stream 43", bot.default_events_register_stream);
        assert.equal("sending stream 43", bot.default_sending_stream);
        assert.equal("bot1@zulip.com", bot.email);
        assert.equal("Bot 1", bot.full_name);
        assert.equal(true, bot.is_active);
        assert.equal(6, bot.owner_id);
        assert.equal(43, bot.user_id);
        assert.equal(undefined, bot.extra);
    })();

    (function test_update() {
        bot_data.add(test_bot);

        let bot = bot_data.get(43);
        assert.equal("Bot 1", bot.full_name);
        bot_data.update(43, {
            ...test_bot,
            full_name: "New Bot 1",
        });
        bot = bot_data.get(43);
        assert.equal("New Bot 1", bot.full_name);

        const change_owner_event = {
            owner_id: fred.user_id,
        };
        bot_data.update(43, {...test_bot, ...change_owner_event});

        bot = bot_data.get(43);
        assert.equal(bot.owner_id, fred.user_id);

        bot_data.update(43, {...test_bot, is_active: false});
        assert.ok(!bot_data.get(43).is_active);

        bot_data.update(43, {...test_bot, is_active: true});
        assert.ok(bot_data.get(43).is_active);
    })();

    (function test_embedded_bot_update() {
        bot_data.add(test_embedded_bot);
        const bot_id = 143;
        const services = bot_data.get_services(bot_id);
        assert.equal("12345678", services[0].config_data.key);
        bot_data.update(bot_id, {
            ...test_embedded_bot,
            services: [{config_data: {key: "87654321"}, service_name: "embedded bot service"}],
        });
        assert.equal("87654321", services[0].config_data.key);
        assert.equal("embedded bot service", services[0].service_name);
    })();

    (function test_all_user_ids() {
        const all_ids = bot_data.all_user_ids();
        all_ids.sort();
        assert.deepEqual(all_ids, [143, 314, 42, 43]);
    })();

    (function test_delete() {
        let bot;

        bot_data.add({...test_bot, is_active: true});

        bot = bot_data.get(43);
        assert.equal("Bot 1", bot.full_name);
        assert.ok(bot.is_active);
        bot_data.del(43);
        bot = bot_data.get(43);
        assert.equal(bot, undefined);
    })();

    (function test_get_all_bots_for_current_user() {
        bot_data.add({...test_bot, user_id: 44, owner_id: me.user_id, is_active: true});
        bot_data.add({
            ...test_bot,
            user_id: 45,
            email: "bot2@zulip.com",
            owner_id: me.user_id,
            is_active: true,
        });
        bot_data.add({
            ...test_bot,
            user_id: 46,
            email: "bot3@zulip.com",
            owner_id: fred.user_id,
            is_active: true,
        });

        const bots = bot_data.get_all_bots_for_current_user();

        assert.equal(bots.length, 2);
        assert.equal(bots[0].email, "bot1@zulip.com");
        assert.equal(bots[1].email, "bot2@zulip.com");
    })();

    (function test_get_number_of_bots_owned_by_user() {
        const bots_owned_by_user = bot_data.get_all_bots_owned_by_user(3);

        assert.equal(bots_owned_by_user[0].email, "bot3@zulip.com");
    })();
});

test("get_all_bots_ids_for_current_user", () => {
    bot_data.add({
        api_key: "testkey123",
        avatar_url: "",
        bot_type: 1,
        default_all_public_streams: true,
        default_events_register_stream: "register stream test",
        default_sending_stream: "sending stream test",
        email: "testbot@zulip.com",
        full_name: "Test Bot",
        is_active: true,
        owner_id: me.user_id,
        user_id: 101,
        services: [],
    });

    bot_data.add({
        api_key: "anotherkey456",
        avatar_url: "",
        bot_type: 1,
        default_all_public_streams: true,
        default_events_register_stream: "register stream another",
        default_sending_stream: "sending stream another",
        email: "anotherbot@zulip.com",
        full_name: "Another Bot",
        is_active: true,
        owner_id: fred.user_id,
        user_id: 102,
        services: [],
    });

    const my_bot_ids = bot_data.get_all_bots_ids_for_current_user();
    assert.deepEqual(my_bot_ids, [101]);

    // Ensure bots owned by others are not included
    bot_data.add({
        api_key: "anotherkey789",
        avatar_url: "",
        bot_type: 1,
        default_all_public_streams: true,
        default_events_register_stream: "register stream extra",
        default_sending_stream: "sending stream extra",
        email: "extrabot@zulip.com",
        full_name: "Extra Bot",
        is_active: true,
        owner_id: fred.user_id,
        user_id: 103,
        services: [],
    });

    const my_updated_bot_ids = bot_data.get_all_bots_ids_for_current_user();
    assert.deepEqual(my_updated_bot_ids, [101]);
});
```

--------------------------------------------------------------------------------

---[FILE: browser_history.test.cjs]---
Location: zulip-main/web/tests/browser_history.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {make_stub} = require("./lib/stub.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

window.location.hash = "#bogus";

const browser_history = zrequire("browser_history");
const {initialize_user_settings} = zrequire("user_settings");

const user_settings = {};
initialize_user_settings({user_settings});

function test(label, f) {
    run_test(label, (helpers) => {
        helpers.override(user_settings, "web_home_view", "recent");
        window.location.hash = "#bogus";
        browser_history.clear_for_testing();
        f(helpers);
    });
}

test("basics", () => {
    const hash1 = "#settings/profile";
    const hash2 = "#narrow/is/dm";
    browser_history.go_to_location(hash1);
    assert.equal(window.location.hash, hash1);

    browser_history.update(hash2);
    assert.equal(window.location.hash, hash2);
    assert.equal(browser_history.old_hash(), hash1);

    const was_internal_change = browser_history.save_old_hash();
    assert.ok(was_internal_change);
    assert.equal(browser_history.old_hash(), hash2);
});

test("update with same hash", () => {
    const hash = "#keyboard-shortcuts";

    browser_history.update(hash);
    assert.equal(window.location.hash, hash);
    browser_history.update(hash);
    assert.equal(window.location.hash, hash);
});

test("error for bad hashes", () => {
    const hash = "bogus";
    blueslip.expect("error", "programming error: prefix hashes with #");
    browser_history.update(hash);
});

test("update internal hash if required", ({override_rewire}) => {
    const hash = "#test/hash";
    const stub = make_stub();
    override_rewire(browser_history, "update", stub.f);
    browser_history.update_hash_internally_if_required(hash);
    assert.equal(stub.num_calls, 1);

    window.location.hash = "#test/hash";
    // update with same hash
    browser_history.update_hash_internally_if_required(hash);
    // but no update was made since the
    // hash was already updated.
    // Evident by no increase in number of
    // calls to stub.
    assert.equal(stub.num_calls, 1);
});

test("web-public view hash restore", () => {
    browser_history.update("#");
    assert.equal(window.location.hash, "");
    const new_hash = "#narrow/is/dm";
    browser_history.update(new_hash);
    assert.equal(window.location.hash, new_hash);
    browser_history.return_to_web_public_hash();
    assert.equal(window.location.hash, "#recent");
});
```

--------------------------------------------------------------------------------

---[FILE: buddy_data.test.cjs]---
Location: zulip-main/web/tests/buddy_data.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const _ = require("lodash");

const {make_realm} = require("./lib/example_realm.cjs");
const {make_message_list} = require("./lib/message_list.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {noop, run_test} = require("./lib/test.cjs");
const {page_params} = require("./lib/zpage_params.cjs");

mock_esm("../src/settings_data", {
    user_can_access_all_other_users: () => true,
});
const timerender = mock_esm("../src/timerender");
mock_esm("../src/buddy_list", {
    buddy_list: {
        rerender_participants: noop,
    },
});

const compose_fade_helper = zrequire("compose_fade_helper");
const activity_ui = zrequire("activity_ui");
const muted_users = zrequire("muted_users");
const peer_data = zrequire("peer_data");
const people = zrequire("people");
const presence = zrequire("presence");
const stream_data = zrequire("stream_data");
const user_status = zrequire("user_status");
const buddy_data = zrequire("buddy_data");
const message_lists = zrequire("message_lists");
const {set_current_user, set_realm} = zrequire("state_data");
const {initialize_user_settings} = zrequire("user_settings");
const {user_list_style_values} = zrequire("settings_config");

const realm = make_realm();
set_realm(realm);
const current_user = {};
set_current_user(current_user);
const user_settings = {};
initialize_user_settings({user_settings});

// The buddy_data module is mostly tested indirectly through
// activity.test.cjs, but we should feel free to add direct tests
// here.

const selma = {
    user_id: 1000,
    full_name: "Human Selma",
    email: "selma@example.com",
};

const me = {
    user_id: 1001,
    full_name: "Human Myself",
    email: "self@example.com",
};

const alice = {
    email: "alice@zulip.com",
    user_id: 1002,
    full_name: "Alice Smith",
};

const fred = {
    email: "fred@zulip.com",
    user_id: 1003,
    full_name: "Fred Flintstone",
};

const jill = {
    email: "jill@zulip.com",
    user_id: 1004,
    full_name: "Jill Hill",
};

const mark = {
    email: "mark@zulip.com",
    user_id: 1005,
    full_name: "Marky Mark",
};

const old_user = {
    user_id: 9999,
    full_name: "Old User",
    email: "old_user@example.com",
};

const bot = {
    user_id: 55555,
    full_name: "Red Herring Bot",
    email: "bot@example.com",
    is_bot: true,
    bot_owner_id: null,
};

const bot_with_owner = {
    user_id: 55556,
    full_name: "Blue Herring Bot",
    email: "bot_with_owner@example.com",
    is_bot: true,
    bot_owner_id: 1001,
    bot_owner_full_name: "Human Myself",
};

function add_canned_users() {
    people.add_active_user(alice);
    people.add_active_user(bot);
    people.add_active_user(bot_with_owner);
    people.add_active_user(fred);
    people.add_active_user(jill);
    people.add_active_user(mark);
    people.add_active_user(old_user);
    people.add_active_user(selma);
}

function test(label, f) {
    run_test(label, (helpers) => {
        helpers.override(user_settings, "presence_enabled", true);
        compose_fade_helper.clear_focused_recipient();
        stream_data.clear_subscriptions();
        peer_data.clear_for_testing();
        user_status.initialize({user_status: {}});
        presence.presence_info.clear();
        people.init();
        people.add_active_user(me);
        people.initialize_current_user(me.user_id);
        muted_users.set_muted_users([]);
        message_lists.set_current(undefined);

        f(helpers);

        presence.clear_internal_data();
    });
}

function set_presence(user_id, status) {
    presence.presence_info.set(user_id, {
        status,
        last_active: 9999,
    });
}

test("user_circle, level", ({override}) => {
    add_canned_users();

    set_presence(selma.user_id, "active");
    assert.equal(buddy_data.get_user_circle_class(selma.user_id), "user-circle-active");
    assert.equal(buddy_data.level(selma.user_id), 1);

    set_presence(selma.user_id, "idle");
    assert.equal(buddy_data.get_user_circle_class(selma.user_id), "user-circle-idle");
    assert.equal(buddy_data.level(selma.user_id), 2);

    set_presence(selma.user_id, "offline");
    assert.equal(buddy_data.get_user_circle_class(selma.user_id), "user-circle-offline");
    assert.equal(buddy_data.level(selma.user_id), 3);

    set_presence(me.user_id, "active");
    assert.equal(buddy_data.get_user_circle_class(me.user_id), "user-circle-active");
    assert.equal(buddy_data.level(me.user_id), 0);

    override(user_settings, "presence_enabled", false);
    assert.equal(buddy_data.get_user_circle_class(me.user_id), "user-circle-offline");
    assert.equal(buddy_data.level(me.user_id), 0);

    override(user_settings, "presence_enabled", true);
    assert.equal(buddy_data.get_user_circle_class(me.user_id), "user-circle-active");
    assert.equal(buddy_data.level(me.user_id), 0);

    set_presence(fred.user_id, "idle");
    assert.equal(buddy_data.get_user_circle_class(fred.user_id), "user-circle-idle");
    assert.equal(buddy_data.level(fred.user_id), 2);

    set_presence(fred.user_id, undefined);
    assert.equal(buddy_data.get_user_circle_class(fred.user_id), "user-circle-offline");
    assert.equal(buddy_data.level(fred.user_id), 3);

    set_presence(fred.user_id, undefined);
    assert.equal(buddy_data.get_user_circle_class(fred.user_id, true), "user-circle-deactivated");
    assert.equal(buddy_data.level(fred.user_id), 3);
});

test("title_data", ({override}) => {
    page_params.presence_history_limit_days_for_web_app = 365;
    add_canned_users();

    // Groups
    let is_group = true;
    const user_ids_string = "9999,1000";
    let expected_group_data = {
        first_line: "Human Selma and Old User",
        second_line: "",
        third_line: "",
    };
    assert.deepEqual(
        buddy_data.get_title_data(user_ids_string, is_group, true),
        expected_group_data,
    );

    is_group = "";

    // Bots with owners.
    expected_group_data = {
        first_line: "Blue Herring Bot",
        second_line: "translated: Owner: Human Myself",
        third_line: "",
        is_deactivated: false,
    };
    assert.deepEqual(
        buddy_data.get_title_data(bot_with_owner.user_id, is_group, true),
        expected_group_data,
    );

    // Bots without owners.
    expected_group_data = {
        first_line: "Red Herring Bot",
        second_line: "",
        third_line: "",
    };
    assert.deepEqual(buddy_data.get_title_data(bot.user_id, is_group, true), expected_group_data);

    // Individual users.
    user_status.set_status_text({
        user_id: me.user_id,
        status_text: "out to lunch",
    });

    override(user_settings, "user_list_style", user_list_style_values.with_status.code);
    let expected_data = {
        first_line: "Human Myself",
        second_line: "",
        third_line: "translated: Active now",
        show_you: true,
    };
    override(current_user, "user_id", me.user_id);
    assert.deepEqual(buddy_data.get_title_data(me.user_id, is_group, false), expected_data);

    expected_data = {
        first_line: "Human Myself",
        second_line: "out to lunch",
        third_line: "translated: Active now",
        show_you: true,
    };
    override(current_user, "user_id", me.user_id);
    assert.deepEqual(buddy_data.get_title_data(me.user_id, is_group, true), expected_data);

    expected_data = {
        first_line: "Old User",
        second_line: "translated: Not active in the last year",
        third_line: "",
        show_you: false,
    };
    assert.deepEqual(buddy_data.get_title_data(old_user.user_id, is_group, true), expected_data);

    // Deactivated users.
    people.deactivate(selma);
    expected_data = {
        first_line: "Human Selma",
        second_line: "translated: This user has been deactivated.",
        third_line: "",
        show_you: false,
        is_deactivated: true,
    };
    assert.deepEqual(buddy_data.get_title_data(selma.user_id, is_group, true), expected_data);

    // Deactivated bots.
    people.deactivate(bot_with_owner);
    expected_group_data = {
        first_line: "Blue Herring Bot",
        second_line: "translated: Owner: Human Myself",
        third_line: "translated: This bot has been deactivated.",
        is_deactivated: true,
    };
    assert.deepEqual(
        buddy_data.get_title_data(bot_with_owner.user_id, is_group, true),
        expected_group_data,
    );
});

test("filters deactivated users", () => {
    add_canned_users();

    set_presence(selma.user_id, "active");
    set_presence(me.user_id, "active");

    let user_ids = buddy_data.get_filtered_and_sorted_user_ids("selm");

    assert.deepEqual(user_ids, [selma.user_id]);
    assert.ok(buddy_data.matches_filter("selm", selma.user_id));

    // Deactivated users are excluded.
    people.deactivate(selma);

    user_ids = buddy_data.get_filtered_and_sorted_user_ids("selm");
    assert.deepEqual(user_ids, []);

    user_ids = buddy_data.get_filtered_and_sorted_user_ids();
    assert.equal(user_ids.includes(selma.user_id), false);
    assert.ok(!buddy_data.matches_filter("selm", selma.user_id));
});

test("muted users excluded from search", () => {
    people.add_active_user(selma);
    muted_users.add_muted_user(selma.user_id);

    let user_ids = buddy_data.get_filtered_and_sorted_user_ids();
    assert.equal(user_ids.includes(selma.user_id), false);
    user_ids = buddy_data.get_filtered_and_sorted_user_ids("selm");
    assert.deepEqual(user_ids, []);
    assert.ok(!buddy_data.matches_filter("selm", selma.user_id));

    muted_users.remove_muted_user(selma.user_id);
    user_ids = buddy_data.get_filtered_and_sorted_user_ids("selm");
    assert.deepEqual(user_ids, [selma.user_id]);
    assert.ok(buddy_data.matches_filter("selm", selma.user_id));
});

test("bulk_data_hacks", ({override_rewire}) => {
    // sanity check
    assert.equal(mark.user_id, 1005);

    for (const i of _.range(mark.user_id + 1, 2000)) {
        const person = {
            user_id: i,
            full_name: `Human ${i}`,
            email: `person${i}@example.com`,
        };
        people.add_active_user(person);
    }
    add_canned_users();

    // Make 400 of the users active
    set_presence(selma.user_id, "active");
    set_presence(me.user_id, "active");

    for (const user_id of _.range(1000, 1400)) {
        set_presence(user_id, "active");
    }

    // And then 300 not active
    for (const user_id of _.range(1400, 1700)) {
        set_presence(user_id, "offline");
    }

    let user_ids;

    // Even though we have 1000 users, we only get the 400 active
    // users.  This is a consequence of buddy_data.maybe_shrink_list.
    user_ids = buddy_data.get_filtered_and_sorted_user_ids();
    assert.equal(user_ids.length, 400);

    user_ids = buddy_data.get_filtered_and_sorted_user_ids("");
    assert.equal(user_ids.length, 400);

    // We don't match on "so", because it's not at the start of a
    // word in the name/email.
    user_ids = buddy_data.get_filtered_and_sorted_user_ids("so");
    assert.equal(user_ids.length, 0);

    // We match on "h" for the first name, and the result limit
    // is relaxed for searches.
    user_ids = buddy_data.get_filtered_and_sorted_user_ids("h");
    assert.equal(user_ids.length, 997);

    // We match on "p" for the email.
    user_ids = buddy_data.get_filtered_and_sorted_user_ids("p");
    assert.equal(user_ids.length, 994);

    // Make our shrink limit higher, and go back to an empty search.
    // We won't get all 1000 users, just the present ones.
    override_rewire(buddy_data, "max_size_before_shrinking", 50000);
    user_ids = buddy_data.get_filtered_and_sorted_user_ids("");
    assert.equal(user_ids.length, 700);
});

test("always show me", () => {
    assert.deepEqual(buddy_data.get_filtered_and_sorted_user_ids(""), [me.user_id]);

    // try to make us show twice
    presence.presence_info.set(me.user_id, {status: "active"});
    assert.deepEqual(buddy_data.get_filtered_and_sorted_user_ids(""), [me.user_id]);
});

test("always show pm users", () => {
    people.add_active_user(selma);
    message_lists.set_current(make_message_list([{operator: "dm", operand: selma.email}]));

    assert.deepEqual(buddy_data.get_filtered_and_sorted_user_ids(""), [me.user_id, selma.user_id]);
});

test("show offline channel subscribers for small channels", ({override_rewire}) => {
    // Add a bunch of users to hit max_size_before_shrinking, which will hide some
    // offline users.
    for (const i of _.range(2000, 2700)) {
        const person = {
            user_id: i,
            full_name: `Human ${i}`,
            email: `person${i}@example.com`,
        };
        people.add_active_user(person);
    }
    for (const user_id of _.range(2000, 2700)) {
        set_presence(user_id, "offline");
    }

    people.add_active_user(alice);
    set_presence(alice.user_id, "active");
    people.add_active_user(fred);
    set_presence(fred.user_id, "offline");
    people.add_active_user(selma);
    set_presence(selma.user_id, "offline");
    people.add_active_user(jill);
    set_presence(jill.user_id, "offline");

    const stream_id = 1001;
    const sub = {name: "Rome", subscribed: true, stream_id};
    stream_data.add_sub_for_tests(sub);
    peer_data.set_subscribers(stream_id, [
        selma.user_id,
        alice.user_id,
        fred.user_id,
        jill.user_id,
        me.user_id,
    ]);

    const filter_terms = [
        {operator: "channel", operand: String(sub.stream_id)},
        {operator: "topic", operand: "Foo"},
    ];
    message_lists.set_current(make_message_list(filter_terms));
    assert.deepEqual(buddy_data.get_filtered_and_sorted_user_ids(""), [
        me.user_id,
        alice.user_id,
        fred.user_id,
        selma.user_id,
        jill.user_id,
    ]);

    // Make the max channel size lower, so that we hide the offline users
    override_rewire(buddy_data, "max_channel_size_to_show_all_subscribers", 2);
    assert.deepEqual(buddy_data.get_filtered_and_sorted_user_ids(""), [me.user_id, alice.user_id]);
});

test("get_conversation_participants", () => {
    people.add_active_user(selma);

    const rome_sub = {name: "Rome", subscribed: true, stream_id: 1001};
    stream_data.add_sub_for_tests(rome_sub);
    peer_data.set_subscribers(rome_sub.stream_id, [selma.user_id, me.user_id]);

    const filter_terms = [
        {operator: "channel", operand: String(rome_sub.stream_id)},
        {operator: "topic", operand: "Foo"},
    ];
    message_lists.set_current(
        make_message_list(filter_terms, {
            visible_participants: [selma.user_id],
        }),
    );

    activity_ui.rerender_user_sidebar_participants();
    assert.deepEqual(
        buddy_data.get_conversation_participants_callback()(),
        new Set([selma.user_id]),
    );
});

test("level", ({override}) => {
    override(realm, "server_presence_offline_threshold_seconds", 200);

    add_canned_users();
    assert.equal(buddy_data.level(me.user_id), 0);
    assert.equal(buddy_data.level(selma.user_id), 3);

    const server_time = 9999;
    const info = {
        active_timestamp: 9999,
        idle_timestamp: 9999,
    };
    presence.update_info_from_event(me.user_id, info, server_time);
    presence.update_info_from_event(selma.user_id, info, server_time);

    assert.equal(buddy_data.level(me.user_id), 0);
    assert.equal(buddy_data.level(selma.user_id), 1);

    override(user_settings, "presence_enabled", false);
    set_presence(selma.user_id, "offline");

    // Selma gets demoted to level 3, but "me"
    // stays in level 0.
    assert.equal(buddy_data.level(me.user_id), 0);
    assert.equal(buddy_data.level(selma.user_id), 3);
});

test("compare_function", () => {
    const first_user_shown_higher = -1;
    const second_user_shown_higher = 1;

    const stream_id = 1001;
    const sub = {name: "Rome", subscribed: true, stream_id};
    stream_data.add_sub_for_tests(sub);
    people.add_active_user(alice);
    people.add_active_user(fred);

    // Alice is higher because of alphabetical sorting.
    peer_data.set_subscribers(stream_id, []);
    assert.equal(
        second_user_shown_higher,
        buddy_data.compare_function(fred.user_id, alice.user_id, stream_id, new Set(), new Set()),
    );

    // Fred is higher because they're in the narrow and Alice isn't.
    peer_data.set_subscribers(stream_id, [fred.user_id]);
    assert.equal(
        first_user_shown_higher,
        buddy_data.compare_function(fred.user_id, alice.user_id, stream_id, new Set(), new Set()),
    );
    assert.equal(
        second_user_shown_higher,
        buddy_data.compare_function(alice.user_id, fred.user_id, stream_id, new Set(), new Set()),
    );

    // Fred is higher because they're in the DM conversation and Alice isn't.
    assert.equal(
        first_user_shown_higher,
        buddy_data.compare_function(
            fred.user_id,
            alice.user_id,
            undefined,
            new Set([fred.user_id]),
            new Set(),
        ),
    );

    // Fred is higher because they're in the conversation and Alice isn't.
    assert.equal(
        first_user_shown_higher,
        buddy_data.compare_function(
            fred.user_id,
            alice.user_id,
            undefined,
            new Set(),
            new Set([fred.user_id]),
        ),
    );

    assert.equal(
        second_user_shown_higher,
        buddy_data.compare_function(
            alice.user_id,
            fred.user_id,
            undefined,
            new Set(),
            new Set([fred.user_id]),
        ),
    );

    // Alice is higher because of alphabetical sorting.
    assert.equal(
        second_user_shown_higher,
        buddy_data.compare_function(fred.user_id, alice.user_id, undefined, new Set(), new Set()),
    );

    // The user is part of a DM conversation, though that's not explicitly in the DM list.
    assert.equal(
        first_user_shown_higher,
        buddy_data.compare_function(
            me.user_id,
            alice.user_id,
            undefined,
            new Set([fred.user_id]),
            new Set(),
        ),
    );
});

test("user_last_seen_time_status", ({override}) => {
    page_params.presence_history_limit_days_for_web_app = 365;
    set_presence(selma.user_id, "active");
    set_presence(me.user_id, "active");

    assert.equal(buddy_data.user_last_seen_time_status(selma.user_id), "translated: Active now");

    assert.equal(
        buddy_data.user_last_seen_time_status(old_user.user_id),
        "translated: Not active in the last year",
    );

    presence.presence_info.set(old_user.user_id, {last_active: 1526137743});

    override(timerender, "last_seen_status_from_date", (date) => {
        assert.deepEqual(date, new Date(1526137743000));
        return "translated: Active May 12";
    });

    assert.equal(
        buddy_data.user_last_seen_time_status(old_user.user_id),
        "translated: Active May 12",
    );

    set_presence(selma.user_id, "idle");
    assert.equal(buddy_data.user_last_seen_time_status(selma.user_id), "translated: Idle");

    presence.presence_info.set(old_user.user_id, {last_active: undefined});
    const missing_callback = (user_id) => {
        assert.equal(user_id, old_user.user_id);
    };
    assert.equal(buddy_data.user_last_seen_time_status(old_user.user_id, missing_callback), "");
});

test("get_items_for_users", ({override}) => {
    people.add_active_user(alice);
    people.add_active_user(fred);
    set_presence(alice.user_id, "offline");
    override(user_settings, "emojiset", "google");
    override(user_settings, "user_list_style", 2);

    const status_emoji_info = {
        emoji_alt_code: false,
        emoji_name: "car",
        emoji_code: "1f697",
        reaction_type: "unicode_emoji",
    };

    const status_emoji_info_event = {
        id: 1,
        type: "user_status",
        status_text: "",
        ...status_emoji_info,
    };

    const user_ids = [me.user_id, alice.user_id, fred.user_id];
    for (const user_id of user_ids) {
        user_status.set_status_emoji({user_id, ...status_emoji_info_event});
    }

    const user_list_style = {
        COMPACT: false,
        WITH_STATUS: true,
        WITH_AVATAR: false,
    };

    assert.deepEqual(buddy_data.get_items_for_users(user_ids), [
        {
            href: "#narrow/dm/1001-Human-Myself",
            is_current_user: true,
            name: "Human Myself",
            num_unread: 0,
            profile_picture: "/avatar/1001",
            status_emoji_info,
            status_text: undefined,
            has_status_text: false,
            user_circle_class: "user-circle-active",
            user_id: 1001,
            user_list_style,
            should_add_guest_user_indicator: false,
        },
        {
            href: "#narrow/dm/1002-Alice-Smith",
            is_current_user: false,
            name: "Alice Smith",
            num_unread: 0,
            profile_picture: "/avatar/1002",
            status_emoji_info,
            status_text: undefined,
            has_status_text: false,
            user_circle_class: "user-circle-offline",
            user_id: 1002,
            user_list_style,
            should_add_guest_user_indicator: false,
        },
        {
            href: "#narrow/dm/1003-Fred-Flintstone",
            is_current_user: false,
            name: "Fred Flintstone",
            num_unread: 0,
            profile_picture: "/avatar/1003",
            status_emoji_info,
            status_text: undefined,
            has_status_text: false,
            user_circle_class: "user-circle-offline",
            user_id: 1003,
            user_list_style,
            should_add_guest_user_indicator: false,
        },
    ]);
});

test("unknown user id in presence", () => {
    // This test is to make sure that we don't generate errors
    // when we have a user_id in presence that we don't have
    // information about.
    // Such scenarios can happen if we receive presence info involving
    // a new user before the user creation event reaches us.
    presence.presence_info.set(999, {status: "active"});
    const user_ids = buddy_data.get_filtered_and_sorted_user_ids();

    // This user id should not be present in the filtered list,
    // it's meant to be ignored until we know about the user.
    assert.equal(user_ids.includes(999), false);
});
```

--------------------------------------------------------------------------------

````
