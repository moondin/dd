---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 803
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 803 of 1290)

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

---[FILE: narrow_local.test.cjs]---
Location: zulip-main/web/tests/narrow_local.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_message_list} = require("./lib/message_list.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");

mock_esm("../src/people.ts", {
    maybe_get_user_by_id: noop,
});

const all_messages_data = zrequire("../src/all_messages_data");

const {MessageListData} = zrequire("../src/message_list_data");
const narrow_state = zrequire("narrow_state");
const message_view = zrequire("message_view");
const message_lists = zrequire("message_lists");
const resolved_topic = zrequire("resolved_topic");

function verify_fixture(fixture, override_rewire) {
    const msg_list = make_message_list(fixture.filter_terms);
    const filter = msg_list.data.filter;
    message_lists.set_current(msg_list);

    // Make sure our simulated tests data satisfies the
    // invariant that the first unread message we find
    // does indeed satisfy our filter.
    if (fixture.unread_info.flavor === "found") {
        for (const msg of fixture.all_messages) {
            if (msg.id === fixture.unread_info.msg_id) {
                assert.ok(filter.predicate()(msg));
            }
        }
    }

    const excludes_muted_topics = filter.excludes_muted_topics();
    const msg_data = new MessageListData({
        filter,
        excludes_muted_topics,
    });
    const id_info = {
        target_id: fixture.target_id,
        local_select_id: undefined,
        final_select_id: undefined,
    };

    override_rewire(all_messages_data, "all_messages_data", {
        fetch_status: {
            has_found_newest: () => fixture.has_found_newest,
        },
        visibly_empty: () => fixture.visibly_empty,
        all_messages_after_mute_filtering() {
            assert.notEqual(fixture.all_messages, undefined);
            return fixture.all_messages;
        },
        first() {
            assert.notEqual(fixture.all_messages, undefined);
            return fixture.all_messages[0];
        },
        last() {
            assert.notEqual(fixture.all_messages, undefined);
            return fixture.all_messages.at(-1);
        },
    });

    override_rewire(narrow_state, "get_first_unread_info", () => fixture.unread_info);

    message_view.maybe_add_local_messages({
        id_info,
        msg_data,
        superset_data: all_messages_data.all_messages_data,
    });

    assert.deepEqual(id_info, fixture.expected_id_info);

    const msgs = msg_data.all_messages_after_mute_filtering();
    const msg_ids = msgs.map((message) => message.id);
    assert.deepEqual(msg_ids, fixture.expected_msg_ids);
}

function test_fixture(label, fixture) {
    run_test(label, ({override_rewire}) => {
        verify_fixture(fixture, override_rewire);
    });
}

test_fixture("near after unreads", {
    // Current near: behavior is to ignore the unreads and take you
    // to the target message, with reading disabled.
    filter_terms: [{operator: "near", operand: "42"}],
    target_id: 42,
    unread_info: {
        flavor: "found",
        msg_id: 37,
    },
    has_found_newest: false,
    all_messages: [
        {id: 37, topic: "whatever"},
        {id: 42, topic: "whatever"},
        {id: 44, topic: "whatever"},
    ],
    expected_id_info: {
        target_id: 42,
        final_select_id: 42,
        local_select_id: 42,
    },
    expected_msg_ids: [37, 42, 44],
});

test_fixture("near not in message list", {
    // Current behavior is to ignore the unreads and take you
    // to the closest messages, with reading disabled.
    filter_terms: [{operator: "near", operand: "42"}],
    target_id: 42,
    unread_info: {
        flavor: "found",
        msg_id: 46,
    },
    has_found_newest: false,
    all_messages: [
        {id: 41, topic: "whatever"},
        {id: 45, topic: "whatever"},
        {id: 46, topic: "whatever"},
    ],
    expected_id_info: {
        target_id: 42,
        final_select_id: 42,
        local_select_id: undefined,
    },
    expected_msg_ids: [41, 45, 46],
});

test_fixture("near before unreads", {
    filter_terms: [{operator: "near", operand: "42"}],
    target_id: 42,
    unread_info: {
        flavor: "found",
        msg_id: 43,
    },
    has_found_newest: false,
    all_messages: [
        {id: 42, topic: "whatever"},
        {id: 43, topic: "whatever"},
        {id: 44, topic: "whatever"},
    ],
    expected_id_info: {
        target_id: 42,
        final_select_id: 42,
        local_select_id: 42,
    },
    expected_msg_ids: [42, 43, 44],
});

test_fixture("near with no unreads", {
    filter_terms: [{operator: "near", operand: "42"}],
    target_id: 42,
    unread_info: {
        flavor: "not_found",
    },
    has_found_newest: false,
    visibly_empty: true,
    expected_id_info: {
        target_id: 42,
        final_select_id: 42,
        local_select_id: undefined,
    },
    expected_msg_ids: [],
});

test_fixture("is private with no target", {
    filter_terms: [{operator: "is", operand: "private"}],
    unread_info: {
        flavor: "found",
        msg_id: 550,
    },
    has_found_newest: true,
    all_messages: [
        {id: 450, type: "private", to_user_ids: "1,2"},
        {id: 500, type: "private", to_user_ids: "1,2"},
        {id: 550, type: "private", to_user_ids: "1,2"},
    ],
    expected_id_info: {
        target_id: undefined,
        final_select_id: 550,
        local_select_id: 550,
    },
    expected_msg_ids: [450, 500, 550],
});

test_fixture("dm with target outside of range", {
    filter_terms: [{operator: "dm", operand: "alice@example.com"}],
    target_id: 5,
    unread_info: {
        flavor: "not_found",
    },
    has_found_newest: false,
    all_messages: [{id: 999}],
    expected_id_info: {
        target_id: 5,
        final_select_id: 5,
        local_select_id: undefined,
    },
    expected_msg_ids: [],
});

test_fixture("is:private with no unreads before fetch", {
    filter_terms: [{operator: "is", operand: "private"}],
    unread_info: {
        flavor: "not_found",
    },
    has_found_newest: false,
    visibly_empty: true,
    expected_id_info: {
        target_id: undefined,
        final_select_id: undefined,
        local_select_id: undefined,
    },
    expected_msg_ids: [],
});

test_fixture("is:private with target and no unreads", {
    filter_terms: [{operator: "is", operand: "private"}],
    target_id: 450,
    unread_info: {
        flavor: "not_found",
    },
    has_found_newest: true,
    visibly_empty: false,
    all_messages: [
        {id: 350},
        {id: 400, type: "private", to_user_ids: "1,2"},
        {id: 450, type: "private", to_user_ids: "1,2"},
        {id: 500, type: "private", to_user_ids: "1,2"},
    ],
    expected_id_info: {
        target_id: 450,
        final_select_id: 450,
        local_select_id: 450,
    },
    expected_msg_ids: [400, 450, 500],
});

test_fixture("is:mentioned with no unreads and no matches", {
    filter_terms: [{operator: "is", operand: "mentioned"}],
    unread_info: {
        flavor: "not_found",
    },
    has_found_newest: true,
    all_messages: [],
    expected_id_info: {
        target_id: undefined,
        final_select_id: undefined,
        local_select_id: undefined,
    },
    expected_msg_ids: [],
});

test_fixture("is:alerted with no unreads and one match", {
    filter_terms: [{operator: "is", operand: "alerted"}],
    unread_info: {
        flavor: "not_found",
    },
    has_found_newest: true,
    all_messages: [
        {id: 55, topic: "whatever", alerted: true},
        {id: 57, topic: "whatever", alerted: false},
    ],
    expected_id_info: {
        target_id: undefined,
        final_select_id: 55,
        local_select_id: 55,
    },
    expected_msg_ids: [55],
});

test_fixture("is:resolved with one unread", {
    filter_terms: [{operator: "is", operand: "resolved"}],
    unread_info: {
        flavor: "found",
        msg_id: 56,
    },
    has_found_newest: true,
    all_messages: [
        {id: 55, type: "stream", topic: resolved_topic.resolve_name("foo")},
        {id: 56, type: "stream", topic: resolved_topic.resolve_name("foo")},
        {id: 57, type: "stream", topic: "foo"},
    ],
    expected_id_info: {
        target_id: undefined,
        final_select_id: 56,
        local_select_id: 56,
    },
    expected_msg_ids: [55, 56],
});

test_fixture("is:resolved with no unreads", {
    filter_terms: [{operator: "is", operand: "resolved"}],
    unread_info: {
        flavor: "not_found",
    },
    has_found_newest: true,
    all_messages: [
        {id: 55, type: "stream", topic: resolved_topic.resolve_name("foo")},
        {id: 57, type: "stream", topic: "foo"},
    ],
    expected_id_info: {
        target_id: undefined,
        final_select_id: 55,
        local_select_id: 55,
    },
    expected_msg_ids: [55],
});

test_fixture("search", {
    filter_terms: [{operator: "search", operand: "whatever"}],
    unread_info: {
        flavor: "cannot_compute",
    },
    expected_id_info: {
        target_id: undefined,
        final_select_id: 10000000000000000,
        local_select_id: undefined,
    },
    expected_msg_ids: [],
});

test_fixture("search near", {
    filter_terms: [
        {operator: "search", operand: "whatever"},
        {operator: "near", operand: "22"},
    ],
    target_id: 22,
    unread_info: {
        flavor: "cannot_compute",
    },
    expected_id_info: {
        target_id: 22,
        final_select_id: 22,
        local_select_id: undefined,
    },
    expected_msg_ids: [],
});

test_fixture("stream, no unread, not in all_messages", {
    // This might be something you'd see zooming out from
    // a muted topic, maybe?  It's possibly this scenario
    // is somewhat contrived, but we exercise fairly simple
    // defensive code that just punts when messages aren't in
    // our new message list.  Note that our target_id is within
    // the range of all_messages.
    filter_terms: [{operator: "stream", operand: "whatever"}],
    target_id: 450,
    unread_info: {
        flavor: "not_found",
    },
    has_found_newest: true,
    visibly_empty: false,
    all_messages: [{id: 400}, {id: 500}],
    expected_id_info: {
        target_id: 450,
        final_select_id: 450,
        local_select_id: undefined,
    },
    expected_msg_ids: [],
});

test_fixture("search, stream, not in all_messages", {
    filter_terms: [
        {operator: "search", operand: "foo"},
        {operator: "stream", operand: "whatever"},
    ],
    unread_info: {
        flavor: "cannot_compute",
    },
    has_found_newest: true,
    visibly_empty: false,
    all_messages: [{id: 400}, {id: 500}],
    expected_id_info: {
        target_id: undefined,
        final_select_id: 10000000000000000,
        local_select_id: undefined,
    },
    expected_msg_ids: [],
});

test_fixture("stream/topic not in all_messages", {
    // This is a bit of a corner case, but you could have a scenario
    // where you've gone way back in a topic (perhaps something that
    // has been muted a long time) and find an unread message that isn't
    // actually in all_messages_data.
    filter_terms: [
        {operator: "stream", operand: "one"},
        {operator: "topic", operand: "whatever"},
    ],
    target_id: 1000,
    unread_info: {
        flavor: "found",
        msg_id: 2,
    },
    has_found_newest: true,
    all_messages: [{id: 900}, {id: 1100}],
    expected_id_info: {
        target_id: 1000,
        final_select_id: 2,
        local_select_id: undefined,
    },
    expected_msg_ids: [],
});

test_fixture("final corner case", {
    // This tries to get all the way to the end of
    // the function (as written now).  The data here
    // may be completely contrived.
    filter_terms: [{operator: "is", operand: "starred"}],
    target_id: 450,
    unread_info: {
        flavor: "not_found",
    },
    has_found_newest: true,
    visibly_empty: false,
    all_messages: [
        {id: 400, topic: "whatever"},
        {id: 425, topic: "whatever", starred: true},
        {id: 500, topic: "whatever"},
    ],
    expected_id_info: {
        target_id: 450,
        final_select_id: 450,
        local_select_id: undefined,
    },
    expected_msg_ids: [425],
});
```

--------------------------------------------------------------------------------

---[FILE: narrow_state.test.cjs]---
Location: zulip-main/web/tests/narrow_state.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_message_list} = require("./lib/message_list.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const {page_params} = require("./lib/zpage_params.cjs");

const people = zrequire("people");
const {Filter} = zrequire("../src/filter");
const stream_data = zrequire("stream_data");
const narrow_state = zrequire("narrow_state");
const message_lists = zrequire("message_lists");
const inbox_util = zrequire("inbox_util");

function set_filter(raw_terms) {
    const terms = raw_terms.map((op) => ({
        operator: op[0],
        operand: op[1],
    }));
    const msg_list = make_message_list(terms);
    message_lists.set_current(msg_list);

    return msg_list.data.filter;
}

function test(label, f) {
    run_test(label, ({override}) => {
        message_lists.set_current(undefined);
        stream_data.clear_subscriptions();
        f({override});
    });
}

test("stream", () => {
    assert.equal(narrow_state.public_search_terms(), undefined);
    assert.ok(!narrow_state.filter());
    assert.equal(narrow_state.stream_id(), undefined);

    // hash_util.decode_operand returns an empty string when
    // stream_data.slug_to_stream_id returns undefined, e.g., the
    // stream name in the URL no longer exists or is inaccessible.
    set_filter([["channel", ""]]);
    assert.ok(narrow_state.filter());
    assert.equal(narrow_state.stream_name(), undefined);
    assert.equal(narrow_state.stream_id(), undefined);
    assert.equal(narrow_state.stream_sub(), undefined);

    const test_stream_id = 15;
    assert.ok(!narrow_state.narrowed_to_stream_id(test_stream_id));

    // Stream doesn't exist or is inaccessible. The narrow
    // does parse the channel operand as a valid number.
    set_filter([["stream", test_stream_id.toString()]]);
    assert.ok(narrow_state.filter());
    // These do not check for stream subscription data.
    assert.equal(narrow_state.stream_id(), test_stream_id);
    assert.ok(narrow_state.narrowed_to_stream_id(test_stream_id));
    // These do check for stream subscription data.
    assert.equal(narrow_state.stream_name(), undefined);
    assert.equal(narrow_state.stream_id(undefined, true), undefined);
    assert.equal(narrow_state.stream_sub(), undefined);

    // Stream exists and user has access to the stream.
    const test_stream = {name: "Test", stream_id: test_stream_id};
    stream_data.add_sub_for_tests(test_stream);
    set_filter([
        ["stream", test_stream_id.toString()],
        ["topic", "Bar"],
        ["search", "yo"],
    ]);
    assert.ok(narrow_state.filter());

    assert.equal(narrow_state.stream_name(), "Test");
    assert.equal(narrow_state.stream_id(), test_stream_id);
    assert.equal(narrow_state.stream_sub().stream_id, test_stream.stream_id);
    assert.equal(narrow_state.topic(), "Bar");
    assert.ok(narrow_state.narrowed_to_stream_id(test_stream_id));

    const expected_terms = [
        {negated: false, operator: "channel", operand: test_stream_id.toString()},
        {negated: false, operator: "topic", operand: "Bar"},
        {negated: false, operator: "search", operand: "yo"},
    ];

    const public_terms = narrow_state.public_search_terms();
    assert.deepEqual(public_terms, expected_terms);
});

const foo_stream_id = 72;
const foo_stream = {name: "Foo", stream_id: foo_stream_id};
test("narrowed", () => {
    assert.ok(!narrow_state.narrowed_to_pms());
    assert.ok(!narrow_state.narrowed_by_reply());
    assert.ok(!narrow_state.narrowed_by_pm_reply());
    assert.ok(!narrow_state.narrowed_by_topic_reply());
    assert.ok(!narrow_state.narrowed_by_stream_reply());
    assert.equal(narrow_state.stream_sub(), undefined);

    stream_data.add_sub_for_tests(foo_stream);

    set_filter([["stream", "Foo"]]);
    assert.ok(!narrow_state.narrowed_to_pms());
    assert.ok(!narrow_state.narrowed_by_reply());
    assert.ok(!narrow_state.narrowed_by_pm_reply());
    assert.ok(!narrow_state.narrowed_by_topic_reply());
    assert.ok(narrow_state.narrowed_by_stream_reply());
    assert.ok(!narrow_state.is_search_view());

    set_filter([["dm", "steve@zulip.com"]]);
    assert.ok(narrow_state.narrowed_to_pms());
    assert.ok(narrow_state.narrowed_by_reply());
    assert.ok(narrow_state.narrowed_by_pm_reply());
    assert.ok(!narrow_state.narrowed_by_topic_reply());
    assert.ok(!narrow_state.narrowed_by_stream_reply());
    assert.ok(!narrow_state.is_search_view());

    set_filter([
        ["stream", foo_stream_id.toString()],
        ["topic", "bar"],
    ]);
    assert.ok(!narrow_state.narrowed_to_pms());
    assert.ok(narrow_state.narrowed_by_reply());
    assert.ok(!narrow_state.narrowed_by_pm_reply());
    assert.ok(narrow_state.narrowed_by_topic_reply());
    assert.ok(!narrow_state.narrowed_by_stream_reply());
    assert.ok(!narrow_state.is_search_view());

    set_filter([["search", "grail"]]);
    assert.ok(!narrow_state.narrowed_to_pms());
    assert.ok(!narrow_state.narrowed_by_reply());
    assert.ok(!narrow_state.narrowed_by_pm_reply());
    assert.ok(!narrow_state.narrowed_by_topic_reply());
    assert.ok(!narrow_state.narrowed_by_stream_reply());
    assert.ok(narrow_state.is_search_view());

    set_filter([["is", "starred"]]);
    assert.ok(!narrow_state.narrowed_to_pms());
    assert.ok(!narrow_state.narrowed_by_reply());
    assert.ok(!narrow_state.narrowed_by_pm_reply());
    assert.ok(!narrow_state.narrowed_by_topic_reply());
    assert.ok(!narrow_state.narrowed_by_stream_reply());
    assert.ok(narrow_state.is_search_view());
});

test("terms", () => {
    set_filter([
        ["stream", foo_stream_id.toString()],
        ["topic", "Bar"],
        ["search", "Yo"],
    ]);
    let result = narrow_state.search_terms();
    assert.equal(result.length, 3);
    assert.equal(result[0].operator, "channel");
    assert.equal(result[0].operand, foo_stream_id.toString());

    assert.equal(result[1].operator, "topic");
    assert.equal(result[1].operand, "Bar");

    assert.equal(result[2].operator, "search");
    assert.equal(result[2].operand, "Yo");

    message_lists.set_current(undefined);
    result = narrow_state.search_terms();
    assert.equal(result.length, 0);

    page_params.narrow = [{operator: "stream", operand: foo_stream_id.toString()}];
    result = narrow_state.search_terms();
    assert.equal(result.length, 1);
    assert.equal(result[0].operator, "channel");
    assert.equal(result[0].operand, foo_stream_id.toString());

    // `with` terms are excluded from search terms.
    page_params.narrow = [
        {operator: "stream", operand: foo_stream_id.toString()},
        {operator: "topic", operand: "Bar"},
        {operator: "with", operand: "12"},
    ];
    result = narrow_state.search_terms();
    assert.equal(result.length, 2);
    assert.equal(result[0].operator, "channel");
    assert.equal(result[1].operator, "topic");
});

test("excludes_muted_topics", () => {
    let filter = set_filter([["stream", "devel"]]);
    assert.ok(filter.excludes_muted_topics());

    // Combined feed view.
    filter = set_filter([["in", "home"]]);
    assert.ok(filter.excludes_muted_topics());

    filter = set_filter([
        ["stream", "devel"],
        ["topic", "mac"],
    ]);
    assert.ok(!filter.excludes_muted_topics());

    filter = set_filter([["search", "whatever"]]);
    assert.ok(!filter.excludes_muted_topics());

    filter = set_filter([["is", "private"]]);
    assert.ok(!filter.excludes_muted_topics());

    filter = set_filter([["is", "starred"]]);
    assert.ok(!filter.excludes_muted_topics());
});

test("set_compose_defaults", () => {
    set_filter([
        ["stream", foo_stream_id.toString()],
        ["topic", "Bar"],
    ]);

    // First try with a stream that doesn't exist.
    let stream_and_topic = narrow_state.set_compose_defaults();
    assert.equal(stream_and_topic.stream_id, undefined);
    assert.equal(stream_and_topic.topic, "Bar");

    stream_data.add_sub_for_tests(foo_stream);
    stream_and_topic = narrow_state.set_compose_defaults();
    assert.equal(stream_and_topic.stream_id, foo_stream_id);
    assert.equal(stream_and_topic.topic, "Bar");

    set_filter([["dm", "foo@bar.com"]]);
    let dm_test = narrow_state.set_compose_defaults();
    assert.equal(dm_test.private_message_recipient, undefined);

    const john = {
        email: "john@doe.com",
        user_id: 57,
        full_name: "John Doe",
    };
    people.add_active_user(john);
    people.add_active_user(john);

    set_filter([["dm", "john@doe.com"]]);
    dm_test = narrow_state.set_compose_defaults();
    assert.deepEqual(dm_test.private_message_recipient_ids, [john.user_id]);

    // Even though we renamed "pm-with" to "dm",
    // compose defaults are set correctly.
    set_filter([["pm-with", "john@doe.com"]]);
    dm_test = narrow_state.set_compose_defaults();
    assert.deepEqual(dm_test.private_message_recipient_ids, [john.user_id]);

    set_filter([
        ["topic", "duplicate"],
        ["topic", "duplicate"],
    ]);
    assert.deepEqual(narrow_state.set_compose_defaults(), {});

    const rome_id = 99;
    stream_data.add_sub_for_tests({name: "ROME", stream_id: rome_id});
    set_filter([["stream", rome_id.toString()]]);

    const stream_test = narrow_state.set_compose_defaults();
    assert.equal(stream_test.stream_id, rome_id);
});

test("update_email", () => {
    const steve = {
        email: "steve@foo.com",
        user_id: 43,
        full_name: "Steve",
    };

    people.add_active_user(steve);
    set_filter([
        ["dm", "steve@foo.com"],
        ["sender", "steve@foo.com"],
        ["stream", "steve@foo.com"], // try to be tricky
    ]);
    narrow_state.update_email(steve.user_id, "showell@foo.com");
    const filter = narrow_state.filter();
    assert.deepEqual(filter.terms_with_operator("dm")[0].operand, "showell@foo.com");
    assert.deepEqual(filter.terms_with_operator("sender")[0].operand, "showell@foo.com");
    assert.deepEqual(filter.terms_with_operator("channel")[0].operand, "steve@foo.com");
});

test("topic", () => {
    set_filter([
        ["stream", foo_stream.stream_id.toString()],
        ["topic", "Bar"],
    ]);
    assert.equal(narrow_state.topic(), "Bar");

    set_filter([
        ["stream", "release"],
        ["topic", "@#$$^test"],
    ]);
    assert.equal(narrow_state.topic(), "@#$$^test");

    set_filter([]);
    assert.equal(narrow_state.topic(), undefined);

    set_filter([
        ["sender", "test@foo.com"],
        ["dm", "test@foo.com"],
    ]);
    assert.equal(narrow_state.topic(), undefined);

    message_lists.set_current(undefined);
    assert.equal(narrow_state.topic(), undefined);
});

test("stream_sub", () => {
    set_filter([]);
    assert.equal(narrow_state.stream_name(), undefined);
    assert.equal(narrow_state.stream_sub(), undefined);

    set_filter([
        ["stream", "55"],
        ["topic", "Bar"],
    ]);
    assert.equal(narrow_state.stream_name(), undefined);
    assert.equal(narrow_state.stream_sub(), undefined);

    const sub = {name: "Foo", stream_id: 55};
    stream_data.add_sub_for_tests(sub);
    assert.equal(narrow_state.stream_name(), "Foo");
    assert.deepEqual(narrow_state.stream_sub(), sub);

    set_filter([
        ["sender", "someone"],
        ["topic", "random"],
    ]);
    assert.equal(narrow_state.stream_name(), undefined);
});

test("pm_ids_string", () => {
    // This function will return undefined unless we're clearly
    // narrowed to a specific direct message (including group
    // direct messages) with real users.
    message_lists.set_current(undefined);
    assert.equal(narrow_state.pm_ids_string(), undefined);
    assert.deepStrictEqual(narrow_state.pm_ids_set(), new Set());

    set_filter([
        ["stream", foo_stream.stream_id.toString()],
        ["topic", "Bar"],
    ]);
    assert.equal(narrow_state.pm_ids_string(), undefined);
    assert.deepStrictEqual(narrow_state.pm_ids_set(), new Set());

    set_filter([["dm", ""]]);
    assert.equal(narrow_state.pm_ids_string(), undefined);
    assert.deepStrictEqual(narrow_state.pm_ids_set(), new Set());

    set_filter([["dm", "bogus@foo.com"]]);
    assert.equal(narrow_state.pm_ids_string(), undefined);
    assert.deepStrictEqual(narrow_state.pm_ids_set(), new Set());

    const alice = {
        email: "alice@foo.com",
        user_id: 444,
        full_name: "Alice",
    };

    const bob = {
        email: "bob@foo.com",
        user_id: 555,
        full_name: "Bob",
    };

    people.add_active_user(alice);
    people.add_active_user(bob);

    set_filter([["dm", "bob@foo.com,alice@foo.com"]]);
    assert.equal(narrow_state.pm_ids_string(), "444,555");
    assert.deepStrictEqual(narrow_state.pm_ids_set(), new Set([444, 555]));
});

test("inbox_view_visible", () => {
    const filter = new Filter([
        {
            operator: "channel",
            operand: "10",
        },
    ]);
    inbox_util.set_filter(filter);
    inbox_util.set_visible(true);
    assert.ok(narrow_state.filter() === filter);
});
```

--------------------------------------------------------------------------------

---[FILE: narrow_unread.test.cjs]---
Location: zulip-main/web/tests/narrow_unread.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_stream} = require("./lib/example_stream.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

mock_esm("../src/user_topics", {
    is_topic_muted: () => false,
});

const {Filter} = zrequire("../src/filter");
const message_store = zrequire("message_store");
const people = zrequire("people");
const stream_data = zrequire("stream_data");
const unread = zrequire("unread");
// The main code we are testing lives here.
const narrow_state = zrequire("narrow_state");
const message_lists = zrequire("message_lists");
const {set_current_user, set_realm} = zrequire("state_data");

set_current_user({});
set_realm(make_stream());

const alice = {
    email: "alice@example.com",
    user_id: 11,
    full_name: "Alice",
};

const bogus_stream_id = "999999";

people.init();
people.add_active_user(alice);

function set_filter(terms) {
    const filter = new Filter(terms);
    filter.try_adjusting_for_moved_with_target();
    message_lists.set_current({
        data: {
            filter,
        },
    });
}

function assert_unread_info(expected) {
    assert.deepEqual(
        narrow_state.get_first_unread_info(message_lists.current?.data.filter),
        expected,
    );
}

function candidate_ids() {
    return narrow_state._possible_unread_message_ids(message_lists.current?.data.filter);
}

run_test("get_unread_ids", () => {
    unread.declare_bankruptcy();
    message_lists.set_current(undefined);

    let unread_ids;
    let terms;

    const sub = {
        name: "My stream",
        stream_id: 55,
    };

    const stream_msg = {
        id: 101,
        type: "stream",
        stream_id: sub.stream_id,
        display_recipient: sub.name,
        topic: "my topic",
        unread: true,
        mentioned: true,
        mentioned_me_directly: true,
    };

    const private_msg = {
        id: 102,
        type: "private",
        unread: true,
        display_recipient: [{id: alice.user_id, email: alice.email}],
    };

    const other_topic_message = {
        id: 103,
        type: "stream",
        stream_id: sub.stream_id,
        display_recipient: sub.name,
        topic: "another topic",
        unread: true,
        mentioned: false,
        mentioned_me_directly: false,
    };

    message_store.update_message_cache({
        type: "server_message",
        message: stream_msg,
    });
    message_store.update_message_cache({
        type: "server_message",
        message: private_msg,
    });
    message_store.update_message_cache({
        type: "server_message",
        message: other_topic_message,
    });

    stream_data.add_sub_for_tests(sub);

    terms = [{operator: "search", operand: "whatever"}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.equal(unread_ids, undefined);
    assert_unread_info({flavor: "cannot_compute"});

    terms = [{operator: "dm", operand: "123123"}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, []);
    assert_unread_info({flavor: "not_found"});

    terms = [{operator: "stream", operand: bogus_stream_id}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, []);

    terms = [{operator: "stream", operand: sub.stream_id.toString()}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, []);
    assert_unread_info({flavor: "not_found"});

    unread.process_loaded_messages([stream_msg]);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [stream_msg.id]);
    assert_unread_info({
        flavor: "found",
        msg_id: stream_msg.id,
    });

    terms = [
        {operator: "stream", operand: bogus_stream_id},
        {operator: "topic", operand: "my topic"},
    ];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, []);

    terms = [
        {operator: "stream", operand: sub.stream_id.toString()},
        {operator: "topic", operand: "my topic"},
    ];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [stream_msg.id]);

    terms = [{operator: "is", operand: "mentioned"}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [stream_msg.id]);

    terms = [{operator: "is", operand: "resolved"}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [stream_msg.id]);

    terms = [{operator: "sender", operand: "me@example.com"}];
    set_filter(terms);
    // note that our candidate ids are just "all" ids now
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [stream_msg.id]);

    // this actually does filtering
    assert_unread_info({flavor: "not_found"});

    terms = [{operator: "dm", operand: "alice@example.com"}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, []);

    unread.process_loaded_messages([private_msg]);

    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [private_msg.id]);

    assert_unread_info({
        flavor: "found",
        msg_id: private_msg.id,
    });

    // "is:private" was renamed to "is:dm"
    terms = [{operator: "is", operand: "private"}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [private_msg.id]);

    terms = [{operator: "is", operand: "dm"}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [private_msg.id]);

    // For a negated search, our candidate ids will be all
    // unread messages, even ones that don't pass the filter.
    terms = [{operator: "is", operand: "dm", negated: true}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [stream_msg.id, private_msg.id]);

    terms = [{operator: "dm", operand: "bob@example.com"}];
    set_filter(terms);

    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, []);

    terms = [{operator: "is", operand: "starred"}];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, []);

    terms = [{operator: "search", operand: "needle"}];
    set_filter(terms);

    assert_unread_info({
        flavor: "cannot_compute",
    });

    // For a search using `with` operator, our candidate ids
    // will be the messages present in the channel/topic
    // containing the message for which the `with` operand
    // is id to.
    //
    // Here we use an empty topic for the operators, and show that
    // adding the with operator causes us to see unreads in the
    // destination topic.
    unread.process_loaded_messages([other_topic_message]);
    terms = [
        {operator: "channel", operand: sub.stream_id.toString()},
        {operator: "topic", operand: "another topic"},
    ];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [other_topic_message.id]);

    terms = [
        {operator: "channel", operand: sub.stream_id.toString()},
        {operator: "topic", operand: "another topic"},
        {operator: "with", operand: stream_msg.id.toString()},
    ];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [stream_msg.id]);

    terms = [
        {operator: "channel", operand: sub.stream_id.toString()},
        {operator: "topic", operand: "another topic"},
        {operator: "with", operand: private_msg.id.toString()},
    ];
    set_filter(terms);
    unread_ids = candidate_ids();
    assert.deepEqual(unread_ids, [private_msg.id]);
});

run_test("defensive code", ({override_rewire}) => {
    // Test defensive code.  We actually avoid calling
    // _possible_unread_message_ids for any case where we
    // couldn't compute the unread message ids, but that
    // invariant is hard to future-proof.
    override_rewire(narrow_state, "_possible_unread_message_ids", () => undefined);
    const terms = [{operator: "dm", operand: "12344"}];
    set_filter(terms);
    assert_unread_info({
        flavor: "cannot_compute",
    });
});
```

--------------------------------------------------------------------------------

````
