---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 790
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 790 of 1290)

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

---[FILE: echo.test.cjs]---
Location: zulip-main/web/tests/echo.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const MockDate = require("mockdate");

const {make_user_group} = require("./lib/example_group.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {make_stub} = require("./lib/stub.cjs");
const {run_test, noop} = require("./lib/test.cjs");

const browser_history = mock_esm("../src/browser_history");
const compose_notifications = mock_esm("../src/compose_notifications");
const hash_util = mock_esm("../src/hash_util");
const markdown = mock_esm("../src/markdown");
const message_lists = mock_esm("../src/message_lists");
const message_events_util = mock_esm("../src/message_events_util");

let disparities = [];

mock_esm("../src/message_live_update", {
    update_message_in_all_views() {},
});

mock_esm("../src/sent_messages", {
    mark_disparity(local_id) {
        disparities.push(local_id);
    },
    report_event_received() {},
});

const message_store = mock_esm("../src/message_store", {
    get: () => ({failed_request: true}),

    update_booleans() {},

    update_message_content(message, new_content) {
        message.content = new_content;
    },

    convert_raw_message_to_message_with_booleans() {},
});

message_lists.current = {
    view: {
        rerender_messages: noop,
        change_message_id: noop,
    },
    data: {
        filter: {
            can_apply_locally() {
                return true;
            },
            has_exactly_channel_topic_operators() {
                return true;
            },
            adjust_with_operand_to_message: noop,
            terms: noop,
        },
    },
    change_message_id: noop,
    add_messages: noop,
};
const home_msg_list = {
    view: {
        rerender_messages: noop,
        change_message_id: noop,
    },
    data: {
        filter: {
            can_apply_locally() {
                return true;
            },
        },
    },
    preserver_rendered_state: true,
    change_message_id: noop,
    add_messages: noop,
};
message_lists.all_rendered_message_lists = () => [home_msg_list, message_lists.current];
message_lists.non_rendered_data = () => [];

const echo = zrequire("echo");
const echo_state = zrequire("echo_state");
const people = zrequire("people");
const {set_current_user} = zrequire("state_data");
const stream_data = zrequire("stream_data");
const stream_topic_history = zrequire("stream_topic_history");

const current_user = {};
set_current_user(current_user);

const general_sub = {
    stream_id: 101,
    name: "general",
    subscribed: true,
};
stream_data.add_sub_for_tests(general_sub);

run_test("process_from_server for un-echoed messages", () => {
    const waiting_for_ack = new Map();
    const server_messages = [
        {
            local_id: "100.1",
        },
    ];
    echo_state._patch_waiting_for_ack(waiting_for_ack);
    const non_echo_messages = echo.process_from_server(server_messages);
    assert.deepEqual(non_echo_messages, server_messages);
});

run_test("process_from_server for differently rendered messages", ({override}) => {
    let messages_to_rerender = [];

    override(home_msg_list.view, "rerender_messages", (msgs) => {
        messages_to_rerender = msgs;
    });

    // Test that we update all the booleans and the content of the message
    // in local echo.
    const old_value = "old_value";
    const new_value = "new_value";
    const waiting_for_ack = new Map([
        [
            "100.1",
            {
                content: "<p>A client rendered message</p>",
                timestamp: old_value,
                is_me_message: old_value,
                submessages: old_value,
                topic_links: old_value,
            },
        ],
    ]);
    const server_messages = [
        {
            local_id: "100.1",
            content: "<p>A server rendered message</p>",
            timestamp: new_value,
            is_me_message: new_value,
            submessages: new_value,
            topic_links: new_value,
        },
    ];
    echo_state._patch_waiting_for_ack(waiting_for_ack);
    disparities = [];
    const non_echo_messages = echo.process_from_server(server_messages);
    assert.deepEqual(non_echo_messages, []);
    assert.equal(disparities.length, 1);
    assert.deepEqual(messages_to_rerender, [
        {
            content: server_messages[0].content,
            timestamp: new_value,
            is_me_message: new_value,
            submessages: new_value,
            topic_links: new_value,
        },
    ]);
});

run_test("process_from_server for messages to add to narrow", ({override}) => {
    let messages_to_add_to_narrow = [];

    override(message_lists.current.data.filter, "can_apply_locally", () => false);
    override(message_events_util, "maybe_add_narrowed_messages", (msgs, msg_list) => {
        messages_to_add_to_narrow = msgs;
        assert.equal(msg_list, message_lists.current);
    });

    const old_value = "old_value";
    const new_value = "new_value";
    const waiting_for_ack = new Map([
        [
            "100.1",
            {
                content: "<p>rendered message</p>",
                timestamp: old_value,
                is_me_message: old_value,
                submessages: old_value,
                topic_links: old_value,
            },
        ],
    ]);
    const server_messages = [
        {
            local_id: "100.1",
            content: "<p>rendered message</p>",
            timestamp: new_value,
            is_me_message: new_value,
            submessages: new_value,
            topic_links: new_value,
        },
    ];
    echo_state._patch_waiting_for_ack(waiting_for_ack);
    const non_echo_messages = echo.process_from_server(server_messages);
    assert.deepEqual(non_echo_messages, []);
    assert.deepEqual(messages_to_add_to_narrow, [
        {
            content: server_messages[0].content,
            timestamp: new_value,
            is_me_message: new_value,
            submessages: new_value,
            topic_links: new_value,
        },
    ]);
});

run_test("build_display_recipient", ({override}) => {
    override(current_user, "user_id", 123);

    const params = {
        realm_users: [
            {
                user_id: 123,
                full_name: "Iago",
                email: "iago@zulip.com",
            },
            {
                email: "cordelia@zulip.com",
                full_name: "Cordelia",
                user_id: 21,
            },
        ],
    };
    const user_group_params = {
        realm_user_groups: [
            make_user_group({
                is_system_group: true,
                members: [123, 21],
            }),
        ],
    };
    params.realm_non_active_users = [];
    params.cross_realm_bots = [];
    people.initialize(current_user.user_id, params, user_group_params);

    let message = {
        type: "stream",
        stream_id: general_sub.stream_id,
        sender_email: "iago@zulip.com",
        sender_full_name: "Iago",
        sender_id: 123,
    };
    let display_recipient = echo.build_display_recipient(message);
    assert.equal(display_recipient, "general");

    message = {
        type: "private",
        to_user_ids: "21",
        private_message_recipient: "cordelia@zulip.com",
        sender_email: "iago@zulip.com",
        sender_full_name: "Iago",
        sender_id: 123,
    };
    display_recipient = echo.build_display_recipient(message);
    assert.equal(display_recipient.length, 2);

    let iago = display_recipient.find((recipient) => recipient.email === "iago@zulip.com");
    assert.equal(iago.full_name, "Iago");
    assert.equal(iago.id, 123);

    const cordelia = display_recipient.find(
        (recipient) => recipient.email === "cordelia@zulip.com",
    );
    assert.equal(cordelia.full_name, "Cordelia");
    assert.equal(cordelia.id, 21);

    message = {
        type: "private",
        to_user_ids: "123",
        private_message_recipient: "iago@zulip.com",
        sender_email: "iago@zulip.com",
        sender_full_name: "Iago",
        sender_id: 123,
    };
    display_recipient = echo.build_display_recipient(message);

    assert.equal(display_recipient.length, 1);
    iago = display_recipient.find((recipient) => recipient.email === "iago@zulip.com");
    assert.equal(iago.full_name, "Iago");
    assert.equal(iago.id, 123);
});

run_test("update_message_lists", () => {
    home_msg_list.view = {};

    const stub = make_stub();
    const view_stub = make_stub();

    home_msg_list.change_message_id = stub.f;
    home_msg_list.view.change_message_id = view_stub.f;

    echo.update_message_lists({old_id: 401, new_id: 402});

    assert.equal(stub.num_calls, 1);
    const args = stub.get_args("old", "new");
    assert.equal(args.old, 401);
    assert.equal(args.new, 402);

    assert.equal(view_stub.num_calls, 1);
    const view_args = view_stub.get_args("old", "new");
    assert.equal(view_args.old, 401);
    assert.equal(view_args.new, 402);
});

run_test("insert_local_message streams", ({override}) => {
    const fake_now = 555;
    MockDate.set(new Date(fake_now * 1000));

    const local_id_float = 101.01;

    let render_called = false;
    let get_topic_links_called = false;
    let insert_message_called = false;

    override(markdown, "render", () => {
        render_called = true;
    });

    override(markdown, "get_topic_links", () => {
        get_topic_links_called = true;
    });

    const insert_new_messages = (message_data) => {
        const [message] = message_data.raw_messages;
        assert.equal(message.display_recipient, "general");
        assert.equal(message.timestamp, fake_now);
        assert.equal(message.sender_email, "iago@zulip.com");
        assert.equal(message.sender_full_name, "Iago");
        assert.equal(message.sender_id, 123);
        insert_message_called = true;
        return [message];
    };

    const message_request = {
        type: "stream",
        stream_id: general_sub.stream_id,
        topic: "important note",
        sender_email: "iago@zulip.com",
        sender_full_name: "Iago",
        sender_id: 123,
    };
    echo.insert_local_message(message_request, local_id_float, insert_new_messages);

    assert.ok(render_called);
    assert.ok(get_topic_links_called);
    assert.ok(insert_message_called);
});

run_test("insert_local_message direct message", ({override}) => {
    const local_id_float = 102.01;

    override(current_user, "user_id", 123);

    const params = {
        realm_users: [
            {
                user_id: 123,
                full_name: "Iago",
                email: "iago@zulip.com",
            },
            {
                email: "cordelia@zulip.com",
                full_name: "Cordelia",
                user_id: 21,
            },
        ],
    };
    const user_group_params = {
        realm_user_groups: [
            make_user_group({
                is_system_group: true,
                members: [123, 21],
            }),
        ],
    };
    params.realm_non_active_users = [];
    params.cross_realm_bots = [];
    people.init();
    people.initialize(current_user.user_id, params, user_group_params);

    let render_called = false;
    let insert_message_called = false;

    const insert_new_messages = (message_data) => {
        const [message] = message_data.raw_messages;
        assert.equal(message.display_recipient.length, 2);
        insert_message_called = true;
        return [message];
    };

    override(markdown, "render", () => {
        render_called = true;
    });

    const message_request = {
        private_message_recipient: "cordelia@zulip.com",
        to_user_ids: "21",
        type: "private",
        sender_email: "iago@zulip.com",
        sender_full_name: "Iago",
        sender_id: 123,
    };
    echo.insert_local_message(message_request, local_id_float, insert_new_messages);
    assert.ok(render_called);
    assert.ok(insert_message_called);
});

run_test("test reify_message_id", ({override}) => {
    const local_id_float = 103.01;

    override(markdown, "render", noop);
    override(markdown, "get_topic_links", noop);
    override(hash_util, "search_terms_to_hash", noop);
    override(browser_history, "update_current_history_state_data", noop);

    const message_request = {
        type: "stream",
        stream_id: general_sub.stream_id,
        topic: "test",
        sender_email: "iago@zulip.com",
        sender_full_name: "Iago",
        sender_id: 123,
        draft_id: 100,
    };
    echo.insert_local_message(message_request, local_id_float, (message_data) => {
        const messages = message_data.raw_messages;
        messages.map((message) => echo.track_local_message(message));
        return messages;
    });

    let message_store_reify_called = false;
    let notifications_reify_called = false;

    override(message_store, "reify_message_id", () => {
        message_store_reify_called = true;
    });

    override(compose_notifications, "reify_message_id", () => {
        notifications_reify_called = true;
    });

    echo.reify_message_id(local_id_float.toString(), 110);

    assert.ok(message_store_reify_called);
    assert.ok(notifications_reify_called);

    const history = stream_topic_history.find_or_create(general_sub.stream_id);
    assert.equal(history.max_message_id, 110);
    assert.equal(history.topics.get("test").message_id, 110);
});

run_test("reset MockDate", () => {
    MockDate.reset();
});
```

--------------------------------------------------------------------------------

---[FILE: emoji.test.cjs]---
Location: zulip-main/web/tests/emoji.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const events = require("./lib/events.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

const emoji_codes = zrequire("../../static/generated/emoji/emoji_codes.json");

const emoji = zrequire("emoji");

const realm_emoji = events.test_realm_emojis;

run_test("sanity check", () => {
    // Invalid emoji data
    emoji_codes.names = [...emoji_codes.names, "invalid_emoji"];
    blueslip.expect("error", "No codepoint for emoji name invalid_emoji");
    emoji.initialize({realm_emoji, emoji_codes});

    // Valid data
    emoji_codes.names = emoji_codes.names.filter((name) => name !== "invalid_emoji");
    emoji.initialize({realm_emoji, emoji_codes});
    assert.equal(emoji.get_server_realm_emoji_data(), realm_emoji);
});

run_test("get_canonical_name", () => {
    let canonical_name = emoji.get_canonical_name("green_tick");
    assert.equal(canonical_name, "green_tick");

    canonical_name = emoji.get_canonical_name("thumbs_up");
    assert.equal(canonical_name, "+1");

    canonical_name = emoji.get_canonical_name("+1");
    assert.equal(canonical_name, "+1");

    canonical_name = emoji.get_canonical_name("airplane");
    assert.equal(canonical_name, "airplane");

    canonical_name = emoji.get_canonical_name("non_existent");
    assert.equal(canonical_name, undefined);
});

run_test("get_emoji_* API", () => {
    assert.equal(emoji.get_emoji_name("1f384"), "holiday_tree");
    assert.equal(emoji.get_emoji_name("1f951"), "avocado");
    assert.equal(emoji.get_emoji_name("bogus"), undefined);

    assert.equal(emoji.get_emoji_codepoint("avocado"), "1f951");
    assert.equal(emoji.get_emoji_codepoint("holiday_tree"), "1f384");
    assert.equal(emoji.get_emoji_codepoint("bogus"), undefined);

    assert.equal(emoji.get_realm_emoji_url("spain"), "/some/path/to/spain.gif");
});

run_test("get_emoji_details_by_name", () => {
    let emoji_name = "smile";

    let result = emoji.get_emoji_details_by_name(emoji_name);
    assert.deepEqual(result, {
        emoji_name: "smile",
        emoji_code: "1f604",
        reaction_type: "unicode_emoji",
    });

    // Test adding an unicode_emoji.
    emoji_name = "smile";

    result = emoji.get_emoji_details_by_name(emoji_name);
    assert.deepEqual(result, {
        emoji_name: "smile",
        reaction_type: "unicode_emoji",
        emoji_code: "1f604",
    });

    // Test adding zulip emoji.
    emoji_name = "zulip";

    result = emoji.get_emoji_details_by_name(emoji_name);
    assert.deepEqual(result, {
        emoji_name: "zulip",
        reaction_type: "zulip_extra_emoji",
        emoji_code: "zulip",
        url: "/static/generated/emoji/images/emoji/unicode/zulip.png",
        still_url: null,
    });

    // Test adding realm emoji.
    emoji_name = "spain";

    emoji_name = emoji.get_emoji_details_by_name(emoji_name);
    assert.deepEqual(emoji_name, {
        emoji_name: "spain",
        reaction_type: "realm_emoji",
        emoji_code: "101",
        url: "/some/path/to/spain.gif",
        still_url: "/some/path/to/spain.png",
    });

    emoji_name = "green_tick";
    emoji_name = emoji.get_emoji_details_by_name(emoji_name);
    assert.deepEqual(emoji_name, {
        emoji_name: "green_tick",
        reaction_type: "realm_emoji",
        emoji_code: "102",
        url: "/some/path/to/emoji",
        still_url: null,
    });

    // Test sending without emoji name.
    assert.throws(
        () => {
            emoji.get_emoji_details_by_name();
        },
        {
            name: "Error",
            message: "Emoji name must be passed.",
        },
    );

    // Test sending an unknown emoji.
    emoji_name = "unknown-emoji";
    assert.throws(
        () => {
            emoji.get_emoji_details_by_name(emoji_name);
        },
        {
            name: "Error",
            message: "Bad emoji name: unknown-emoji",
        },
    );
});
```

--------------------------------------------------------------------------------

---[FILE: emoji_picker.test.cjs]---
Location: zulip-main/web/tests/emoji_picker.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const _ = require("lodash");

const {zrequire, set_global} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const emoji = zrequire("emoji");
const emoji_frequency = zrequire("emoji_frequency");
const emoji_picker = zrequire("emoji_picker");
const typeahead = zrequire("typeahead");

const emoji_codes = zrequire("../../static/generated/emoji/emoji_codes.json");

set_global("document", "document-stub");

run_test("initialize", () => {
    emoji.initialize({
        realm_emoji: {},
        emoji_codes,
    });
    typeahead.set_frequently_used_emojis(typeahead.get_popular_emojis());
    emoji_picker.initialize();

    const complete_emoji_catalog = _.sortBy(emoji_picker.complete_emoji_catalog, "name");
    assert.equal(complete_emoji_catalog.length, 11);
    assert.equal(emoji.emojis_by_name.size, 1884);

    let total_emoji_in_categories = 0;

    function assert_emoji_category(ele, icon, num) {
        assert.equal(ele.icon, icon);
        assert.equal(ele.emojis.length, num);
        function check_emojis(val) {
            for (const this_emoji of ele.emojis) {
                assert.equal(this_emoji.is_realm_emoji, val);
            }
        }
        if (ele.name === "Custom") {
            check_emojis(true);
        } else {
            check_emojis(false);
            total_emoji_in_categories += ele.emojis.length;
        }
    }
    const popular_emoji_count = 6;
    const zulip_emoji_count = 1;
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-car", 195);
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-hashtag", 224);
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-smile-o", 169);
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-thumbs-o-up", 386);
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-lightbulb-o", 264);
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-star-o", popular_emoji_count);
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-cutlery", 131);
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-flag", 270);
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-cog", 1);
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-leaf", 159);
    assert_emoji_category(complete_emoji_catalog.pop(), "fa-soccer-ball-o", 85);

    // The popular emoji appear twice in the picker, and the zulip emoji is special
    assert.equal(
        emoji.emojis_by_name.size,
        total_emoji_in_categories - popular_emoji_count + zulip_emoji_count,
    );

    const make_emoji = (emoji_code, score) => ({
        emoji_code,
        emoji_type: "unicode_emoji",
        score,
    });

    const popular_emojis = typeahead.popular_emojis.map((emoji_code) => make_emoji(emoji_code, 10));
    const non_popular_emoji_codes = [
        "1f3df", // stadium
        "1f4b0", // money bag
        "1f3e3", // japanese post office
        "1f43c", // panda face
        "1f648", // see no evil
        "1f600", // grinning face
        "1f680", // rocket
    ];
    const non_popular_emojis_usage = [];
    for (const [i, non_popular_emoji_code] of non_popular_emoji_codes.entries()) {
        non_popular_emojis_usage.push(make_emoji(non_popular_emoji_code, i));
    }
    for (const emoji of [...popular_emojis, ...non_popular_emojis_usage]) {
        emoji_frequency.reaction_data.set(emoji.emoji_code, emoji);
    }
    emoji_frequency.update_frequently_used_emojis_list();
    non_popular_emoji_codes.reverse();

    assert.equal(typeahead.frequently_used_emojis.length, 12);
    assert.deepEqual(
        typeahead.frequently_used_emojis.map((emoji) => emoji.emoji_code),
        [...typeahead.popular_emojis, ...non_popular_emoji_codes.slice(0, 6)],
    );
});

run_test("is_emoji_present_in_text", () => {
    const thermometer_emoji = {
        name: "thermometer",
        emoji_code: "1f321",
        reaction_type: "unicode_emoji",
    };
    const headphones_emoji = {
        name: "headphones",
        emoji_code: "1f3a7",
        reaction_type: "unicode_emoji",
    };
    assert.equal(emoji_picker.is_emoji_present_in_text("🌡", thermometer_emoji), true);
    assert.equal(
        emoji_picker.is_emoji_present_in_text("no emojis at all", thermometer_emoji),
        false,
    );
    assert.equal(emoji_picker.is_emoji_present_in_text("😎", thermometer_emoji), false);
    assert.equal(emoji_picker.is_emoji_present_in_text("😎🌡🎧", thermometer_emoji), true);
    assert.equal(emoji_picker.is_emoji_present_in_text("😎🎧", thermometer_emoji), false);
    assert.equal(emoji_picker.is_emoji_present_in_text("😎🌡🎧", headphones_emoji), true);
    assert.equal(
        emoji_picker.is_emoji_present_in_text("emojis with text 😎🌡🎧", thermometer_emoji),
        true,
    );
    assert.equal(
        emoji_picker.is_emoji_present_in_text("emojis with text no space😎🌡🎧", headphones_emoji),
        true,
    );
});
```

--------------------------------------------------------------------------------

---[FILE: example1.test.cjs]---
Location: zulip-main/web/tests/example1.test.cjs

```text
"use strict";

// This is a general tour of how to write node tests that
// may also give you some quick insight on how the Zulip
// browser app is constructed.

// The statements below are pretty typical for most node
// tests. The reason we need these helpers will hopefully
// become clear as you keep reading.
const assert = require("node:assert/strict");

const {make_stream} = require("./lib/example_stream.cjs");
const {make_user} = require("./lib/example_user.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

// We will use our special zrequire helper to import the
// Zulip code. We use zrequire instead of require,
// because it has some magic to clear state when we move
// on to the next test.
const people = zrequire("people");
const stream_data = zrequire("stream_data");
const util = zrequire("util");

// Let's start with testing a function from util.ts.
//
// The most basic unit tests load up code, call functions,
// and assert truths:

assert.ok(!util.find_stream_wildcard_mentions("boring text"));
assert.ok(util.find_stream_wildcard_mentions("mention @**everyone**"));

// Let's test with people.js next.  We'll show this technique:
//  * get a false value
//  * change the data
//  * get a true value

const isaac = make_user({
    email: "isaac@example.com",
    user_id: 30,
    full_name: "Isaac Newton",
});

// The `people` object is a very fundamental object in the
// Zulip app.  You can learn a lot more about it by reading
// the tests in people.test.cjs in the same directory as this file.

// Let's exercise the code and use assert to verify it works!
assert.ok(!people.is_known_user_id(isaac.user_id));
people.add_active_user(isaac);
assert.ok(people.is_known_user_id(isaac.user_id));

// Let's look at stream_data next, and we will start by putting
// some data at module scope. (You could also declare this inside
// the test, if you prefer.)

// We use make_stream to create a complete stream object with select
// fields explicitly specified, and all other fields populated with
// reasonable defaults.
const denmark_stream = make_stream({
    color: "a1a1a1",
    name: "Denmark",
    subscribed: false,
});

// We introduce the run_test helper, which mostly just causes
// a line of output to go to the console. It does a little more than
// that, which we will see later.

run_test("verify stream_data persists stream color", () => {
    stream_data.clear_subscriptions();
    assert.equal(stream_data.get_sub_by_name("Denmark"), undefined);
    stream_data.add_sub_for_tests(denmark_stream);
    const sub = stream_data.get_sub_by_name("Denmark");
    assert.equal(sub.color, "a1a1a1");
});
// See example2.test.cjs in this directory.
```

--------------------------------------------------------------------------------

---[FILE: example2.test.cjs]---
Location: zulip-main/web/tests/example2.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_stream} = require("./lib/example_stream.cjs");
const {make_user} = require("./lib/example_user.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

// Hopefully the basic patterns for testing data-oriented modules
// are starting to become apparent.  To reinforce that, we will present
// few more examples that also expose you to some of our core
// data objects.  Also, we start testing some objects that have
// deeper dependencies.

const message_helper = zrequire("message_helper");
const message_store = zrequire("message_store");
const people = zrequire("people");
const stream_data = zrequire("stream_data");
const stream_topic_history = zrequire("stream_topic_history");
const unread = zrequire("unread");
const {initialize_user_settings} = zrequire("user_settings");

// It's typical to set up a little bit of data at the top of a
// test module, but you can also do this within tests. Here we
// will set up things at the top.

initialize_user_settings({user_settings: {}});

const isaac = make_user({
    email: "isaac@example.com",
    user_id: 30,
    full_name: "Isaac Newton",
});

const denmark_stream = make_stream({
    color: "blue",
    name: "Denmark",
    stream_id: 101,
    subscribed: false,
});

const messages = {
    isaac_to_denmark_stream: {
        id: 400,
        sender_id: isaac.user_id,
        stream_id: denmark_stream.stream_id,
        type: "stream",
        flags: ["has_alert_word"],
        subject: "copenhagen",
        reactions: [],
        // note we don't have every field that a "real" message
        // would have, and that can be fine
    },
};

// We aren't going to modify isaac in our tests, so we will
// create him at the top.
people.add_active_user(isaac);

// We are going to test a core module called messages_store.js next.
// This is an example of a deep unit test, where our dependencies
// are easy to test.

run_test("message_store", () => {
    message_store.clear_for_testing();
    stream_data.clear_subscriptions();
    stream_data.add_sub_for_tests(denmark_stream);

    const in_message = {...messages.isaac_to_denmark_stream};

    assert.equal(in_message.alerted, undefined);

    // Let's add a message into our message_store via
    // message_helper.process_new_message.
    assert.equal(message_store.get(in_message.id), undefined);
    message_helper.process_new_message({
        type: "server_message",
        raw_message: in_message,
    });
    const message = message_store.get(in_message.id);
    assert.equal(message.alerted, true);

    // There are more side effects.
    const topic_names = stream_topic_history.get_recent_topic_names(denmark_stream.stream_id);
    assert.deepEqual(topic_names, ["copenhagen"]);
});

// Tracking unread messages is a very fundamental part of the Zulip
// app, and we use the unread object to track unread messages.

run_test("unread", () => {
    unread.declare_bankruptcy();
    stream_data.clear_subscriptions();
    stream_data.add_sub_for_tests(denmark_stream);

    const stream_id = denmark_stream.stream_id;
    const topic_name = "copenhagen";

    assert.equal(unread.num_unread_for_topic(stream_id, topic_name), 0);

    let in_message = {...messages.isaac_to_denmark_stream};
    in_message = message_helper.process_new_message({
        type: "server_message",
        raw_message: in_message,
    });

    unread.process_loaded_messages([in_message.message]);
    assert.equal(unread.num_unread_for_topic(stream_id, topic_name), 1);
});
```

--------------------------------------------------------------------------------

---[FILE: example3.test.cjs]---
Location: zulip-main/web/tests/example3.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {make_stream} = require("./lib/example_stream.cjs");
const {make_message_list} = require("./lib/message_list.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

// In the Zulip app you can narrow your message stream by topic, by
// sender, by direct message recipient, by search keywords, etc.
// We will discuss narrows more broadly, but first let's test out a
// core piece of code that makes things work.

const {Filter} = zrequire("../src/filter");
const {set_realm} = zrequire("state_data");
const stream_data = zrequire("stream_data");

set_realm(make_realm());

const denmark_stream = make_stream({
    color: "blue",
    name: "Denmark",
    stream_id: 101,
    subscribed: false,
});

run_test("filter", () => {
    stream_data.clear_subscriptions();
    stream_data.add_sub_for_tests(denmark_stream);

    const filter_terms = [
        {operator: "stream", operand: denmark_stream.stream_id.toString()},
        {operator: "topic", operand: "copenhagen"},
    ];

    const filter = new Filter(filter_terms);

    const predicate = filter.predicate();

    // We don't need full-fledged messages to test the gist of
    // our filter.  If there are details that are distracting from
    // your test, you should not feel guilty about removing them.
    assert.equal(predicate({type: "personal"}), false);

    assert.equal(
        predicate({
            type: "stream",
            stream_id: denmark_stream.stream_id,
            topic: "does not match filter",
        }),
        false,
    );

    assert.equal(
        predicate({
            type: "stream",
            stream_id: denmark_stream.stream_id,
            topic: "copenhagen",
        }),
        true,
    );
});

// We have a "narrow" abstraction that sits roughly on top of the
// "filter" abstraction.  If you are in a narrow, we track the
// state with the narrow_state module.

const narrow_state = zrequire("narrow_state");
const message_lists = zrequire("message_lists");

run_test("narrow_state", () => {
    stream_data.clear_subscriptions();
    stream_data.add_sub_for_tests(denmark_stream);
    message_lists.set_current(undefined);

    // As we often do, first make assertions about the starting
    // state:

    assert.equal(narrow_state.stream_name(), undefined);

    // Now set up a Filter object.
    const filter_terms = [
        {operator: "stream", operand: denmark_stream.stream_id.toString()},
        {operator: "topic", operand: "copenhagen"},
    ];

    // And here is where we actually change state.
    message_lists.set_current(make_message_list(filter_terms));
    assert.equal(narrow_state.stream_name(), "Denmark");
    assert.equal(narrow_state.topic(), "copenhagen");
});
```

--------------------------------------------------------------------------------

---[FILE: example4.test.cjs]---
Location: zulip-main/web/tests/example4.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_bot} = require("./lib/example_user.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

/*

    Let's step back and review what we've done so far.

    We've used fairly straightforward testing techniques
    to explore the following modules:

        filter
        message_store
        narrow_state
        people
        stream_data
        util

    We haven't gone deep on any of these objects, but if
    you are interested, all of these objects have test
    suites that have 100% line coverage on the modules
    that implement those objects.  For example, you can look
    at people.test.cjs in this directory for more tests on the
    people object.

    We can quickly review some testing concepts:

        zrequire - bring in real code
        mock_esm - mock es6 modules
        assert.equal - verify results

    ------

    Let's talk about our next steps.

    An app is pretty useless without an actual data source.
    One of the primary ways that a Zulip client gets data
    is through events.  (We also get data at page load, and
    we can also ask the server for data, but that's not in
    the scope of this conversation yet.)

    Chat systems are dynamic.  If an admin adds a user, or
    if a user sends a messages, the server immediately sends
    events to all clients so that they can reflect appropriate
    changes in their UI.  We're not going to discuss the entire
    "full stack" mechanism here.  Instead, we'll focus on
    the client code, starting at the boundary where we
    process events.

    Let's just get started...

*/

// We are going to use mock versions of some of our libraries.
const activity_ui = mock_esm("../src/activity_ui");
const message_live_update = mock_esm("../src/message_live_update");
const pm_list = mock_esm("../src/pm_list");
const settings_bots = mock_esm("../src/settings_bots");
const settings_users = mock_esm("../src/settings_users");
const user_profile = mock_esm("../src/user_profile");

// Use real versions of these modules.
const people = zrequire("people");
const server_events_dispatch = zrequire("server_events_dispatch");
const {set_current_user} = zrequire("state_data");

set_current_user({});

const bob = make_bot({
    email: "bob@example.com",
    user_id: 33,
    full_name: "Bob Roberts",
});

run_test("add users with event", ({override}) => {
    people.init();

    const event = {
        type: "realm_user",
        op: "add",
        person: bob,
    };

    assert.ok(!people.is_known_user_id(bob.user_id));

    // We need to override a stub here before dispatching the event.
    // Keep reading to see how overriding works!
    override(settings_bots, "redraw_all_bots_list", noop);
    override(activity_ui, "check_should_redraw_new_user", noop);
    // Let's simulate dispatching our event!
    server_events_dispatch.dispatch_normal_event(event);

    // And it works!
    assert.ok(people.is_known_user_id(bob.user_id));
});

/*

   It's actually a little surprising that adding a user does
   not have side effects beyond the people object and the bots list.
   I guess we don't immediately update the buddy list, but that's
   because the buddy list gets updated on the next server
   fetch.

   Let's try an update next.  To make this work, we will want
   to override some more of our stubs.

   This is where we see a little extra benefit from the
   run_test wrapper.  It passes us in an object that we
   can use to override data, and that works within the
   scope of the function.

*/

run_test("update user with event", ({override}) => {
    people.init();
    people.add_active_user(bob);

    set_current_user({user_id: bob.user_id});

    const $select = $.create("#user-self-role-select");
    const $option = $.create('option[value="100"]');
    $select.set_find_results('option[value="100"]', $option);

    const new_bob = make_bot({
        email: "bob@example.com",
        user_id: bob.user_id,
        full_name: "The Artist Formerly Known as Bob",
    });

    const event = {
        type: "realm_user",
        op: "update",
        person: new_bob,
    };

    // We have to stub a few things. We don't want to test
    // the details of these functions, but we do want to
    // verify that they run. Fortunately, the run_test()
    // wrapper will tell us if we override a method that
    // doesn't get called!
    override(activity_ui, "redraw", noop);
    override(message_live_update, "update_user_full_name", noop);
    override(pm_list, "update_private_messages", noop);
    override(settings_users, "update_user_data", noop);
    override(settings_bots, "update_bot_data", noop);
    override(user_profile, "update_profile_modal_ui", noop);

    // Dispatch the realm_user/update event, which will update
    // data structures and have other side effects that are
    // stubbed out above.
    server_events_dispatch.dispatch_normal_event(event);

    const user = people.get_by_user_id(bob.user_id);

    // Verify that the code actually did its main job:
    assert.equal(user.full_name, "The Artist Formerly Known as Bob");
});
```

--------------------------------------------------------------------------------

````
