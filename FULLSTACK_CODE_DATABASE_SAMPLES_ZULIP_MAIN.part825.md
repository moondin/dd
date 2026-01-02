---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 825
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 825 of 1290)

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

---[FILE: topic_list.test.cjs]---
Location: zulip-main/web/tests/topic_list.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");

const stream_topic_history_util = mock_esm("../src/stream_topic_history_util");
mock_esm("../src/people.ts", {
    maybe_get_user_by_id: noop,
});

const all_messages_data = zrequire("all_messages_data");
const {set_realm} = zrequire("state_data");
const stream_data = zrequire("stream_data");
const stream_topic_history = zrequire("stream_topic_history");
const topic_list = zrequire("topic_list");

set_realm(make_realm());

function test(label, f) {
    run_test(label, (helpers) => {
        f(helpers);
    });
}

test("is_full_topic_history_available", ({override}) => {
    const stream_id = 21;
    const general = {
        name: "general",
        stream_id,
        first_message_id: null,
        subscriber_count: 0,
    };
    const messages = [
        {id: 1, stream_id},
        {id: 2, stream_id},
        {id: 3, stream_id},
    ];
    const sub = stream_data.create_sub_from_server_data(general);

    // Currently, all_messages_data is empty.
    assert.equal(topic_list.is_full_topic_history_available(stream_id), false);

    all_messages_data.all_messages_data.clear();
    all_messages_data.all_messages_data.add_messages(messages, true);

    let has_found_newest = false;

    override(
        all_messages_data.all_messages_data.fetch_status,
        "has_found_newest",
        () => has_found_newest,
    );

    assert.equal(topic_list.is_full_topic_history_available(stream_id), false);
    has_found_newest = true;
    // sub.first_message_id === null
    assert.equal(topic_list.is_full_topic_history_available(stream_id), true);

    // Note that we'll return `true` here due to
    // fetched_stream_ids having the stream_id now.
    assert.equal(topic_list.is_full_topic_history_available(stream_id), true);

    // Clear the data, otherwise `is_full_topic_history_available`
    // will always return true due to stream_id in fetched_stream_ids.
    stream_topic_history.reset();

    sub.first_message_id = 0;
    assert.equal(topic_list.is_full_topic_history_available(stream_id), false);

    sub.first_message_id = 2;
    let full_topic_history_fetched_and_widget_updated = false;
    stream_topic_history_util.get_server_history = (stream_id) => {
        assert.equal(stream_id, general.stream_id);
        full_topic_history_fetched_and_widget_updated = true;
    };
    assert.equal(topic_list.is_full_topic_history_available(stream_id), true);
    assert.equal(full_topic_history_fetched_and_widget_updated, true);
});
```

--------------------------------------------------------------------------------

---[FILE: topic_list_data.test.cjs]---
Location: zulip-main/web/tests/topic_list_data.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const _ = require("lodash");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

mock_esm("../src/message_store", {
    get() {
        return {
            stream_id: 556,
            topic: "general",
        };
    },
});
const user_topics = mock_esm("../src/user_topics", {
    is_topic_muted() {
        return false;
    },
    is_topic_followed() {
        return false;
    },
    is_topic_unmuted_or_followed() {
        return false;
    },
});
const narrow_state = mock_esm("../src/narrow_state", {
    topic() {},
    stream_id() {},
});

const {set_realm} = zrequire("state_data");
const stream_data = zrequire("stream_data");
const stream_topic_history = zrequire("stream_topic_history");
const topic_list_data = zrequire("topic_list_data");
const unread = zrequire("unread");

const REALM_EMPTY_TOPIC_DISPLAY_NAME = "test general chat";

set_realm(make_realm({realm_empty_topic_display_name: REALM_EMPTY_TOPIC_DISPLAY_NAME}));

const general = {
    stream_id: 556,
    name: "general",
};

stream_data.add_sub_for_tests(general);

function get_list_info(zoom, search) {
    const stream_id = general.stream_id;
    const zoomed = zoom === undefined ? false : zoom;
    const search_term = search === undefined ? "" : search;
    return topic_list_data.get_list_info(stream_id, zoomed, (topics) =>
        topic_list_data.filter_topics_by_search_term(topics, search_term),
    );
}

test("filter_topics_by_search_term with resolved topics_state", () => {
    const topic_names = ["topic 1", "✔ resolved topic", "topic 2"];
    const search_term = "";

    // Filter for resolved topics.
    let topics_state = "is:resolved";

    let result = topic_list_data.filter_topics_by_search_term(
        topic_names,
        search_term,
        topics_state,
    );

    assert.deepEqual(result, ["✔ resolved topic"]);

    // Filter for unresolved topics.
    topics_state = "-is:resolved";
    result = topic_list_data.filter_topics_by_search_term(topic_names, search_term, topics_state);

    assert.deepEqual(result, ["topic 1", "topic 2"]);
});

function test(label, f) {
    run_test(label, (helpers) => {
        stream_topic_history.reset();
        f(helpers);
    });
}

test("get_list_info w/real stream_topic_history", ({override}) => {
    let list_info;
    const empty_list_info = get_list_info();

    assert.deepEqual(empty_list_info, {
        items: [],
        more_topics_have_unread_mention_messages: false,
        more_topics_unreads: 0,
        more_topics_unread_count_muted: false,
        num_possible_topics: 0,
    });

    function add_topic_message(topic_name, message_id) {
        stream_topic_history.add_message({
            stream_id: general.stream_id,
            topic_name,
            message_id,
        });
    }
    for (const i of _.range(10)) {
        let topic_name;
        // All odd topics are resolved.
        if (i % 2) {
            topic_name = "✔ topic ";
        } else {
            topic_name = "topic ";
        }
        add_topic_message(topic_name + i, 1000 + i);
    }

    override(narrow_state, "topic", () => "topic 11");
    override(narrow_state, "stream_id", () => 556);

    list_info = get_list_info();
    assert.equal(list_info.items.length, 8);
    assert.equal(list_info.more_topics_unreads, 0);
    assert.equal(list_info.more_topics_have_unread_mention_messages, false);
    assert.equal(list_info.num_possible_topics, 11);

    // The topic link is not a permalink since the topic has no
    // messages sent yet.
    assert.deepEqual(list_info.items[0], {
        topic_name: "topic 11",
        topic_resolved_prefix: "",
        topic_display_name: "topic 11",
        is_empty_string_topic: false,
        unread: 0,
        is_zero: true,
        stream_id: 556,
        is_muted: false,
        is_followed: false,
        is_unmuted_or_followed: false,
        is_active_topic: true,
        url: "#narrow/channel/556-general/topic/topic.2011",
        contains_unread_mention: false,
    });

    override(narrow_state, "topic", () => "topic 6");

    list_info = get_list_info();
    assert.equal(list_info.items.length, 8);
    assert.equal(list_info.more_topics_unreads, 0);
    assert.equal(list_info.more_topics_have_unread_mention_messages, false);
    assert.equal(list_info.num_possible_topics, 10);

    assert.deepEqual(list_info.items[0], {
        contains_unread_mention: false,
        is_active_topic: false,
        is_muted: false,
        is_followed: false,
        is_unmuted_or_followed: false,
        is_zero: true,
        stream_id: 556,
        topic_display_name: "topic 9",
        topic_name: "✔ topic 9",
        topic_resolved_prefix: "✔ ",
        is_empty_string_topic: false,
        unread: 0,
        url: `#narrow/channel/556-general/topic/.E2.9C.94.20topic.209/with/${1000 + 9}`,
    });

    assert.deepEqual(list_info.items[1], {
        contains_unread_mention: false,
        is_active_topic: false,
        is_muted: false,
        is_followed: false,
        is_unmuted_or_followed: false,
        is_zero: true,
        stream_id: 556,
        topic_display_name: "topic 8",
        topic_name: "topic 8",
        topic_resolved_prefix: "",
        is_empty_string_topic: false,
        unread: 0,
        url: `#narrow/channel/556-general/topic/topic.208/with/${1000 + 8}`,
    });

    // Empty string as topic name.
    add_topic_message("", 2025);

    list_info = get_list_info();
    assert.equal(list_info.items.length, 8);
    assert.equal(list_info.more_topics_unreads, 0);
    assert.equal(list_info.more_topics_have_unread_mention_messages, false);
    assert.equal(list_info.num_possible_topics, 11);

    assert.deepEqual(list_info.items[0], {
        contains_unread_mention: false,
        is_active_topic: false,
        is_muted: false,
        is_followed: false,
        is_unmuted_or_followed: false,
        is_zero: true,
        stream_id: 556,
        topic_display_name: REALM_EMPTY_TOPIC_DISPLAY_NAME,
        topic_name: "",
        topic_resolved_prefix: "",
        is_empty_string_topic: true,
        unread: 0,
        url: "#narrow/channel/556-general/topic//with/2025",
    });

    // If we zoom in, our results are based on topic filter.
    // If topic search input is empty, we show all 10 topics.
    const zoomed = true;
    list_info = get_list_info(zoomed);
    assert.equal(list_info.items.length, 11);
    assert.equal(list_info.more_topics_unreads, 0);
    assert.equal(list_info.more_topics_have_unread_mention_messages, false);
    assert.equal(list_info.num_possible_topics, 11);

    add_topic_message("After Brooklyn", 1008);
    add_topic_message("Delhi", 1009);

    // When topic search input is not empty, we show topics
    // based on the search term.
    let search_term = "b,d";
    list_info = get_list_info(zoomed, search_term);
    assert.equal(list_info.items.length, 2);
    assert.equal(list_info.more_topics_unreads, 0);
    assert.equal(list_info.more_topics_have_unread_mention_messages, false);
    assert.equal(list_info.num_possible_topics, 2);

    // Verify empty string topic shows up for "general" search term.
    search_term = "general";
    list_info = get_list_info(zoomed, search_term);
    assert.equal(list_info.items.length, 1);
    assert.equal(list_info.items[0].topic_name, "");
    assert.equal(list_info.items[0].topic_display_name, REALM_EMPTY_TOPIC_DISPLAY_NAME);
});

test("get_list_info unreads", ({override}) => {
    let list_info;

    let message_id = 0;
    for (let i = 15; i >= 0; i -= 1) {
        stream_topic_history.add_message({
            stream_id: general.stream_id,
            message_id: (message_id += 1),
            topic_name: `topic ${i}`,
        });
    }

    function add_unreads(topic, count) {
        unread.process_loaded_messages(
            Array.from({length: count}, () => ({
                id: (message_id += 1),
                stream_id: general.stream_id,
                topic,
                type: "stream",
                unread: true,
            })),
        );
    }

    function add_unreads_with_mention(topic, count) {
        unread.process_loaded_messages(
            Array.from({length: count}, () => ({
                id: (message_id += 1),
                stream_id: general.stream_id,
                topic,
                type: "stream",
                unread: true,
                mentioned: true,
                mentioned_me_directly: true,
            })),
        );
    }

    /*
        We have 16 topics, but we only show up
        to 12 topics, depending on how many have
        unread counts.  We only show a max of 8
        fully-read topics.

        So first we'll get 10 topics, where 2 are
        unread.
    */
    add_unreads("topic 14", 1);
    add_unreads("topic 13", 1);

    /*
        We added 1 unread message in 'topic 14',
        but now we would add a unread message
        with `mention` for user, to test
        `more_topics_have_unread_mention_messages`.
    */
    add_unreads_with_mention("topic 14", 1);

    list_info = get_list_info();
    assert.equal(list_info.items.length, 10);
    assert.equal(list_info.more_topics_unreads, 0);
    assert.equal(list_info.more_topics_have_unread_mention_messages, false);
    assert.equal(list_info.num_possible_topics, 16);

    assert.deepEqual(
        list_info.items.map((li) => li.topic_name),
        [
            "topic 0",
            "topic 1",
            "topic 2",
            "topic 3",
            "topic 4",
            "topic 5",
            "topic 6",
            "topic 7",
            "topic 13",
            "topic 14",
        ],
    );

    add_unreads("topic 12", 1);
    add_unreads("topic 11", 1);
    add_unreads("topic 10", 1);

    list_info = get_list_info();
    assert.equal(list_info.items.length, 12);
    assert.equal(list_info.more_topics_unreads, 2);
    assert.equal(list_info.more_topics_have_unread_mention_messages, true);
    assert.equal(list_info.num_possible_topics, 16);

    assert.deepEqual(
        list_info.items.map((li) => li.topic_name),
        [
            "topic 0",
            "topic 1",
            "topic 2",
            "topic 3",
            "topic 4",
            "topic 5",
            "topic 6",
            "topic 7",
            "topic 10",
            "topic 11",
            "topic 12",
            "topic 13",
        ],
    );

    add_unreads("topic 9", 1);
    add_unreads("topic 8", 1);

    add_unreads("topic 4", 1);
    override(user_topics, "is_topic_muted", (stream_id, topic_name) => {
        assert.equal(stream_id, general.stream_id);
        return topic_name === "topic 4";
    });

    // muting the stream and unmuting the topic 5
    // this should make topic 5 at top in items array
    general.is_muted = true;
    add_unreads("topic 5", 1);
    override(user_topics, "is_topic_unmuted_or_followed", (stream_id, topic_name) => {
        assert.equal(stream_id, general.stream_id);
        return topic_name === "topic 5";
    });

    list_info = get_list_info();
    assert.equal(list_info.items.length, 12);
    assert.equal(list_info.more_topics_unreads, 3);
    assert.equal(list_info.more_topics_have_unread_mention_messages, true);
    assert.equal(list_info.num_possible_topics, 16);
    assert.equal(list_info.more_topics_unread_count_muted, false);

    assert.deepEqual(
        list_info.items.map((li) => li.topic_name),
        [
            "topic 5",
            "topic 0",
            "topic 1",
            "topic 2",
            "topic 3",
            "topic 6",
            "topic 7",
            "topic 8",
            "topic 9",
            "topic 10",
            "topic 11",
            "topic 12",
        ],
    );

    // Now test with topics 4/8/9, all the ones with unreads, being muted.
    override(user_topics, "is_topic_muted", (stream_id, topic_name) => {
        assert.equal(stream_id, general.stream_id);
        return ["topic 4", "topic 8", "topic 9"].includes(topic_name);
    });
    list_info = get_list_info();
    assert.equal(list_info.items.length, 12);
    assert.equal(list_info.more_topics_unreads, 3);
    // Topic 14 now makes it above the "show all topics" fold.
    assert.equal(list_info.more_topics_have_unread_mention_messages, false);
    assert.equal(list_info.num_possible_topics, 16);
    assert.equal(list_info.more_topics_unread_count_muted, true);
    assert.deepEqual(
        list_info.items.map((li) => li.topic_name),
        [
            "topic 5",
            "topic 0",
            "topic 1",
            "topic 2",
            "topic 3",
            "topic 6",
            "topic 7",
            "topic 10",
            "topic 11",
            "topic 12",
            "topic 13",
            "topic 14",
        ],
    );

    add_unreads_with_mention("topic 8", 1);
    list_info = get_list_info();
    assert.equal(list_info.items.length, 12);
    assert.equal(list_info.more_topics_unreads, 4);
    // Topic 8's new mention gets counted here.
    assert.equal(list_info.more_topics_have_unread_mention_messages, true);
    assert.equal(list_info.num_possible_topics, 16);
    assert.equal(list_info.more_topics_unread_count_muted, true);
    assert.deepEqual(
        list_info.items.map((li) => li.topic_name),
        [
            "topic 5",
            "topic 0",
            "topic 1",
            "topic 2",
            "topic 3",
            "topic 6",
            "topic 7",
            "topic 10",
            "topic 11",
            "topic 12",
            "topic 13",
            "topic 14",
        ],
    );

    // Adding an additional older unmuted topic with unreads should
    // result in just the unmuted unreads being counted.
    add_unreads("topic 15", 15);
    list_info = get_list_info();
    assert.equal(list_info.items.length, 12);
    assert.equal(list_info.more_topics_unreads, 15);
    assert.equal(list_info.more_topics_have_unread_mention_messages, true);
    assert.equal(list_info.num_possible_topics, 16);
    assert.equal(list_info.more_topics_unread_count_muted, false);
    assert.deepEqual(
        list_info.items.map((li) => li.topic_name),
        [
            "topic 5",
            "topic 0",
            "topic 1",
            "topic 2",
            "topic 3",
            "topic 6",
            "topic 7",
            "topic 10",
            "topic 11",
            "topic 12",
            "topic 13",
            "topic 14",
        ],
    );
});

test("get_list_info with specific topics and searches", () => {
    let list_info;

    function add_topic_message(topic_name, message_id) {
        stream_topic_history.add_message({
            stream_id: general.stream_id,
            topic_name,
            message_id,
        });
    }

    add_topic_message("BF-2924 zulip", 1001);
    add_topic_message("tech_support/escalation", 1002);

    list_info = get_list_info(true, "2924");
    assert.equal(list_info.items.length, 1);
    assert.equal(list_info.items[0].topic_name, "BF-2924 zulip");

    list_info = get_list_info(true, "support/escalation");
    assert.equal(list_info.items.length, 1);
    assert.equal(list_info.items[0].topic_name, "tech_support/escalation");

    list_info = get_list_info(true, "support");
    assert.equal(list_info.items.length, 1);
    assert.equal(list_info.items[0].topic_name, "tech_support/escalation");

    list_info = get_list_info(true, "zulip");
    assert.equal(list_info.items.length, 1);
    assert.equal(list_info.items[0].topic_name, "BF-2924 zulip");

    list_info = get_list_info(true, "SUPPORT");
    assert.equal(list_info.items.length, 1);
    assert.equal(list_info.items[0].topic_name, "tech_support/escalation");

    list_info = get_list_info(true, "nonexistent");
    assert.equal(list_info.items.length, 0);
});
```

--------------------------------------------------------------------------------

---[FILE: transmit.test.cjs]---
Location: zulip-main/web/tests/transmit.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

const channel = mock_esm("../src/channel");
const reload = mock_esm("../src/reload");
const reload_state = mock_esm("../src/reload_state");
const sent_messages = mock_esm("../src/sent_messages", {
    start_tracking_message: noop,
    get_message_state: () => ({
        report_server_ack: noop,
        report_error: noop,
        saw_event: true,
    }),
    wrap_send(_local_id, callback) {
        callback();
    },
});
const server_events_state = mock_esm("../src/server_events_state");

const people = zrequire("people");
const transmit = zrequire("transmit");
const {set_current_user} = zrequire("state_data");
const stream_data = zrequire("stream_data");

const current_user = {};
set_current_user(current_user);

run_test("transmit_message_ajax", () => {
    let success_func_called;
    const success = () => {
        success_func_called = true;
    };

    const request = {foo: "bar"};

    channel.post = (opts) => {
        assert.equal(opts.url, "/json/messages");
        assert.equal(opts.data.foo, "bar");
        opts.success();
    };

    transmit.send_message(request, success);

    assert.ok(success_func_called);

    channel.xhr_error_message = (msg) => {
        assert.equal(msg, "Error sending message");
        return msg;
    };

    channel.post = (opts) => {
        assert.equal(opts.url, "/json/messages");
        assert.equal(opts.data.foo, "bar");
        const xhr = "whatever";
        opts.error(xhr, "timeout");
    };

    let error_func_called;
    const error = (response) => {
        assert.equal(response, "Error sending message");
        error_func_called = true;
    };
    transmit.send_message(request, success, error);
    assert.ok(error_func_called);
});

run_test("transmit_message_ajax_reload_pending", () => {
    /* istanbul ignore next */
    const success = () => {
        throw new Error("unexpected success");
    };
    /* istanbul ignore next */
    const error = () => {
        throw new Error("unexpected error");
    };

    reload_state.is_pending = () => true;

    let reload_initiated;
    reload.initiate = (opts) => {
        reload_initiated = true;
        assert.deepEqual(opts, {
            immediate: true,
            save_compose: true,
            send_after_reload: true,
        });
    };

    const request = {foo: "bar"};

    channel.post = (opts) => {
        assert.equal(opts.url, "/json/messages");
        assert.equal(opts.data.foo, "bar");
        const xhr = "whatever";
        opts.error(xhr, "bad request");
    };
    transmit.send_message(request, success, error);
    assert.ok(reload_initiated);
});

run_test("topic wildcard mention not allowed", ({override}) => {
    /* istanbul ignore next */
    const success = () => {
        throw new Error("unexpected success");
    };

    /* istanbul ignore next */
    const error = (_response, server_error_code) => {
        assert.equal(server_error_code, "TOPIC_WILDCARD_MENTION_NOT_ALLOWED");
    };

    override(reload_state, "is_pending", () => false);

    const request = {foo: "bar"};
    override(channel, "post", (opts) => {
        assert.equal(opts.url, "/json/messages");
        assert.equal(opts.data.foo, "bar");
        const xhr = {
            responseJSON: {
                code: "TOPIC_WILDCARD_MENTION_NOT_ALLOWED",
            },
        };
        opts.error(xhr, "bad request");
    });

    transmit.send_message(request, success, error);
});

run_test("reply_message_stream", ({override}) => {
    const social_stream_id = 555;
    stream_data.add_sub_for_tests({
        name: "social",
        stream_id: social_stream_id,
    });

    const stream_message = {
        type: "stream",
        stream_id: social_stream_id,
        topic: "lunch",
        sender_full_name: "Alice",
        sender_id: 123,
    };

    const content = "hello";

    let send_message_args;

    override(channel, "post", ({data}) => {
        send_message_args = data;
    });

    override(current_user, "user_id", 44);
    server_events_state.queue_id = 66;
    sent_messages.get_new_local_id = () => "99";

    transmit.reply_message(stream_message, content);

    assert.deepEqual(send_message_args, {
        sender_id: 44,
        queue_id: 66,
        local_id: "99",
        type: "stream",
        to: "social",
        content: "@**Alice** hello",
        topic: "lunch",
    });
});

run_test("reply_message_private", ({override}) => {
    const fred = {
        user_id: 3,
        email: "fred@example.com",
        full_name: "Fred Frost",
    };
    people.add_active_user(fred);

    const pm_message = {
        type: "private",
        display_recipient: [{id: fred.user_id}],
    };

    const content = "hello";

    let send_message_args;

    override(channel, "post", ({data}) => {
        send_message_args = data;
    });

    override(current_user, "user_id", 155);
    server_events_state.queue_id = 177;
    sent_messages.get_new_local_id = () => "199";

    transmit.reply_message(pm_message, content);

    assert.deepEqual(send_message_args, {
        sender_id: 155,
        queue_id: 177,
        local_id: "199",
        type: "private",
        to: '["fred@example.com"]',
        content: "hello",
    });
});

run_test("reply_message_errors", () => {
    const bogus_message = {
        type: "bogus",
    };

    blueslip.expect("error", "unknown message type");

    transmit.reply_message(bogus_message, "");
});
```

--------------------------------------------------------------------------------

---[FILE: typeahead.test.cjs]---
Location: zulip-main/web/tests/typeahead.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const typeahead = zrequire("typeahead");

const unicode_emojis = [
    ["1f43c", "panda_face"],
    ["1f642", "slight_smile"],
    ["1f604", "smile"],
    ["1f368", "ice_cream"],
    ["1f366", "soft_ice_cream"],
    ["1f6a5", "horizontal_traffic_light"],
    ["1f6a6", "traffic_light"],
    ["1f537", "large_blue_diamond"],
    ["1f539", "small_blue_diamond"],
];

const emojis = [
    {emoji_name: "japanese_post_office", reaction_type: "realm_emoji", url: "TBD"},
    {emoji_name: "tada", reaction_type: "realm_emoji", random_field: "whatever"},
    ...unicode_emojis.map(([emoji_code, emoji_name]) => ({
        emoji_name,
        emoji_code,
        reaction_type: "unicode_emoji",
    })),
];

function emoji_matches(query) {
    const matcher = typeahead.get_emoji_matcher(query);
    return emojis.filter((emoji) => matcher(emoji));
}

function assert_emoji_matches(query, expected) {
    const names = emoji_matches(query).map((emoji) => emoji.emoji_name);
    assert.deepEqual(names.toSorted(), expected);
}

run_test("get_emoji_matcher: nonmatches", () => {
    assert_emoji_matches("notaemoji", []);
    assert_emoji_matches("da_", []);
});

run_test("get_emoji_matcher: misc matches", () => {
    assert_emoji_matches("da", ["panda_face", "tada"]);
    assert_emoji_matches("smil", ["slight_smile", "smile"]);
    assert_emoji_matches("mile", ["slight_smile", "smile"]);
    assert_emoji_matches("japanese_post_", ["japanese_post_office"]);
});

run_test("matches starting at non-first word, too", () => {
    assert_emoji_matches("ice_cream", ["ice_cream", "soft_ice_cream"]);
    assert_emoji_matches("blue_dia", ["large_blue_diamond", "small_blue_diamond"]);
    assert_emoji_matches("traffic_", ["horizontal_traffic_light", "traffic_light"]);
});

run_test("matches literal unicode emoji", () => {
    assert_emoji_matches("🐼", ["panda_face"]);
});

run_test("get_emoji_matcher: spaces equivalent to underscores", () => {
    function assert_equivalent(query) {
        assert.deepEqual(emoji_matches(query), emoji_matches(query.replace(" ", "_")));
    }
    assert_equivalent("da ");
    assert_equivalent("panda ");
    assert_equivalent("japanese post ");
    assert_equivalent("ice ");
    assert_equivalent("ice cream");
    assert_equivalent("blue dia");
    assert_equivalent("traffic ");
    assert_equivalent("traffic l");
});

run_test("triage", () => {
    const alice = {name: "alice"};
    const alicia = {name: "Alicia"};
    const joan = {name: "Joan"};
    const jo = {name: "Jo"};
    const steve = {name: "steve"};
    const stephanie = {name: "Stephanie"};

    const names = [alice, alicia, joan, jo, steve, stephanie];

    assert.deepEqual(
        typeahead.triage("a", names, (r) => r.name),
        {
            matches: [alice, alicia],
            rest: [joan, jo, steve, stephanie],
        },
    );

    assert.deepEqual(
        typeahead.triage("A", names, (r) => r.name),
        {
            matches: [alicia, alice],
            rest: [joan, jo, steve, stephanie],
        },
    );

    assert.deepEqual(
        typeahead.triage("S", names, (r) => r.name),
        {
            matches: [stephanie, steve],
            rest: [alice, alicia, joan, jo],
        },
    );

    assert.deepEqual(
        typeahead.triage("fred", names, (r) => r.name),
        {
            matches: [],
            rest: [alice, alicia, joan, jo, steve, stephanie],
        },
    );

    assert.deepEqual(
        typeahead.triage("Jo", names, (r) => r.name),
        {
            matches: [jo, joan],
            rest: [alice, alicia, steve, stephanie],
        },
    );

    assert.deepEqual(
        typeahead.triage("jo", names, (r) => r.name),
        {
            matches: [jo, joan],
            rest: [alice, alicia, steve, stephanie],
        },
    );

    assert.deepEqual(
        typeahead.triage(" ", names, (r) => r.name),
        {
            matches: [],
            rest: [alice, alicia, joan, jo, steve, stephanie],
        },
    );

    assert.deepEqual(
        typeahead.triage(";", names, (r) => r.name),
        {
            matches: [],
            rest: [alice, alicia, joan, jo, steve, stephanie],
        },
    );
});

run_test("triage: prioritise word boundary matches to arbitrary substring matches", () => {
    const book = {name: "book"};
    const hyphen_ok = {name: "hyphen_ok"};
    const space_ok = {name: "space ok"};
    const no_space_ok = {name: "nospaceok"};
    const number_ok = {name: "number1ok"};
    const okay = {name: "okay"};
    const ok = {name: "ok"};

    const emojis = [book, hyphen_ok, space_ok, no_space_ok, number_ok, okay, ok];

    assert.deepEqual(
        typeahead.triage("ok", emojis, (r) => r.name),
        {
            matches: [ok, okay, hyphen_ok, space_ok],
            rest: [book, no_space_ok, number_ok],
        },
    );
});

function sort_emojis(emojis, query) {
    return typeahead.sort_emojis(emojis, query).map((emoji) => emoji.emoji_name);
}

run_test("sort_emojis: th", () => {
    const emoji_list = [
        {emoji_name: "mother_nature", is_realm_emoji: true},
        {emoji_name: "thermometer", is_realm_emoji: true},
        {emoji_name: "thumbs_down", is_realm_emoji: true},
        {emoji_name: "thumbs_up", is_realm_emoji: false, emoji_code: "1f44d"},
    ];
    typeahead.set_frequently_used_emojis(typeahead.get_popular_emojis());
    assert.deepEqual(sort_emojis(emoji_list, "th"), [
        "thumbs_up",
        "thermometer",
        "thumbs_down",
        "mother_nature",
    ]);
});

run_test("sort_emojis: sm", () => {
    const emoji_list = [
        {emoji_name: "smile", is_realm_emoji: true},
        {emoji_name: "slight_smile", is_realm_emoji: false, emoji_code: "1f642"},
        {emoji_name: "small_airplane", is_realm_emoji: true},
    ];
    assert.deepEqual(sort_emojis(emoji_list, "sm"), ["slight_smile", "smile", "small_airplane"]);
});

run_test("sort_emojis: SM", () => {
    const emoji_list = [
        {emoji_name: "smile", is_realm_emoji: true},
        {emoji_name: "slight_smile", is_realm_emoji: false, emoji_code: "1f642"},
        {emoji_name: "small_airplane", is_realm_emoji: true},
    ];
    assert.deepEqual(sort_emojis(emoji_list, "SM"), ["slight_smile", "smile", "small_airplane"]);
});

run_test("sort_emojis: prefix before midphrase, with underscore (traffic_li)", () => {
    const emoji_list = [
        {emoji_name: "horizontal_traffic_light", is_realm_emoji: true},
        {emoji_name: "traffic_light", is_realm_emoji: true},
    ];
    assert.deepEqual(sort_emojis(emoji_list, "traffic_li"), [
        "traffic_light",
        "horizontal_traffic_light",
    ]);
});

run_test("sort_emojis: prefix before midphrase, with space (traffic li)", () => {
    const emoji_list = [
        {emoji_name: "horizontal_traffic_light", is_realm_emoji: true},
        {emoji_name: "traffic_light", is_realm_emoji: true},
    ];
    assert.deepEqual(sort_emojis(emoji_list, "traffic li"), [
        "traffic_light",
        "horizontal_traffic_light",
    ]);
});

run_test("sort_emojis: remove duplicates", () => {
    // notice the last 2 are aliases of the same emoji (same emoji code)
    const emoji_list = [
        {emoji_name: "laughter_tears", emoji_code: "1f602", is_realm_emoji: false},
        {emoji_name: "tear", emoji_code: "1f972", is_realm_emoji: false},
        {emoji_name: "smile_with_tear", emoji_code: "1f972", is_realm_emoji: false},
    ];
    assert.deepEqual(typeahead.sort_emojis(emoji_list, "tear"), [emoji_list[1], emoji_list[0]]);
});

run_test("sort_emojis: prioritise realm emojis", () => {
    const emoji_list = [
        {emoji_name: "thank_you", emoji_code: "1f64f", is_realm_emoji: false},
        {
            emoji_name: "thank_you_custom",
            url: "something",
            is_realm_emoji: true,
        },
    ];
    assert.deepEqual(typeahead.sort_emojis(emoji_list, "thank"), [emoji_list[1], emoji_list[0]]);
});

run_test("sort_emojis: prioritise perfect matches", () => {
    const emoji_list = [
        {emoji_name: "thank_you", emoji_code: "1f64f", is_realm_emoji: false},
        {
            emoji_name: "thank_you_custom",
            url: "something",
            is_realm_emoji: true,
        },
    ];
    assert.deepEqual(typeahead.sort_emojis(emoji_list, "thank you"), emoji_list);
});

run_test("last_prefix_match", () => {
    let words = [
        "apple",
        "banana",
        "cantaloupe",
        "cherry",
        "kiwi",
        "melon",
        "pear",
        "plum",
        "raspberry",
        "watermelon",
    ];
    let prefix = "p";
    assert.equal(typeahead.last_prefix_match(prefix, words), 7);

    prefix = "ch";
    assert.equal(typeahead.last_prefix_match(prefix, words), 3);

    prefix = "pom";
    assert.equal(typeahead.last_prefix_match(prefix, words), null);

    prefix = "aa";
    assert.equal(typeahead.last_prefix_match(prefix, words), null);

    prefix = "zu";
    assert.equal(typeahead.last_prefix_match(prefix, words), null);

    prefix = "";
    assert.equal(typeahead.last_prefix_match(prefix, words), 9);

    words = ["one"];
    prefix = "one";
    assert.equal(typeahead.last_prefix_match(prefix, words), 0);

    words = ["aa", "pr", "pra", "pre", "pri", "pro", "pru", "zz"];
    prefix = "pr";
    assert.equal(typeahead.last_prefix_match(prefix, words), 6);

    words = ["same", "same", "same", "same", "same"];
    prefix = "same";
    assert.equal(typeahead.last_prefix_match(prefix, words), 4);

    words = [];
    prefix = "empty";
    assert.equal(typeahead.last_prefix_match(prefix, words), null);
});
```

--------------------------------------------------------------------------------

````
