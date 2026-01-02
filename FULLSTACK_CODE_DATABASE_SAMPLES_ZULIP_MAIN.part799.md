---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 799
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 799 of 1290)

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

---[FILE: message_flags.test.cjs]---
Location: zulip-main/web/tests/message_flags.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, set_global, with_overrides, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const channel = mock_esm("../src/channel");
const message_live_update = mock_esm("../src/message_live_update");

set_global("document", {hasFocus: () => true});

mock_esm("../src/starred_messages", {
    add() {},
    get_count: () => 5,
    get_starred_msg_ids: () => [1, 2, 3, 4, 5],
    remove() {},
});
mock_esm("../src/left_sidebar_navigation_area", {
    update_starred_count() {},
});

const message_flags = zrequire("message_flags");
const starred_messages_ui = zrequire("starred_messages_ui");
const {initialize_user_settings} = zrequire("user_settings");

initialize_user_settings({user_settings: {}});

run_test("starred", ({override}) => {
    const message = {
        id: 50,
    };
    let ui_updated;

    override(message_live_update, "update_starred_view", () => {
        ui_updated = true;
    });

    let posted_data;

    override(channel, "post", (opts) => {
        assert.equal(opts.url, "/json/messages/flags");
        posted_data = opts.data;
    });

    starred_messages_ui.toggle_starred_and_update_server(message);

    assert.ok(ui_updated);

    assert.deepEqual(posted_data, {
        messages: "[50]",
        flag: "starred",
        op: "add",
    });

    assert.deepEqual(message, {
        id: 50,
        starred: true,
    });

    ui_updated = false;

    starred_messages_ui.toggle_starred_and_update_server(message);

    assert.ok(ui_updated);

    assert.deepEqual(posted_data, {
        messages: "[50]",
        flag: "starred",
        op: "remove",
    });

    assert.deepEqual(message, {
        id: 50,
        starred: false,
    });
});

run_test("starring local echo", () => {
    // verify early return for locally echoed message
    const locally_echoed_message = {
        id: 51,
        starred: false,
        locally_echoed: true,
    };

    starred_messages_ui.toggle_starred_and_update_server(locally_echoed_message);

    // message_live_update.update_starred_view not called

    // channel post request not made

    // starred flag unchanged
    assert.deepEqual(locally_echoed_message, {
        id: 51,
        locally_echoed: true,
        starred: false,
    });
});

run_test("unstar_all", ({override}) => {
    // Way to capture posted info in every request
    let posted_data;
    override(channel, "post", (opts) => {
        assert.equal(opts.url, "/json/messages/flags");
        posted_data = opts.data;
    });

    // we've set get_starred_msg_ids to return [1, 2, 3, 4, 5]
    const expected_data = {messages: "[1,2,3,4,5]", flag: "starred", op: "remove"};

    message_flags.unstar_all_messages();

    assert.deepEqual(posted_data, expected_data);
});

run_test("unstar_all_in_topic", ({override}) => {
    // Way to capture posted info in every request
    let channel_post_opts;
    let channel_get_opts;

    override(channel, "get", (opts) => {
        assert.equal(opts.url, "/json/messages");
        channel_get_opts = opts;
        opts.success({
            messages: [{id: 2}, {id: 3}, {id: 5}],
        });
    });

    override(channel, "post", (opts) => {
        assert.equal(opts.url, "/json/messages/flags");
        channel_post_opts = opts;
    });

    message_flags.unstar_all_messages_in_topic(20, "topic");

    assert.deepEqual(channel_get_opts.data, {
        anchor: "newest",
        num_before: 1000,
        num_after: 0,
        narrow: JSON.stringify([
            {operator: "channel", operand: 20},
            {operator: "topic", operand: "topic"},
            {operator: "is", operand: "starred"},
        ]),
        allow_empty_topic_name: true,
    });

    assert.deepEqual(channel_post_opts.data, {
        messages: "[2,3,5]",
        flag: "starred",
        op: "remove",
    });
});

run_test("read", ({override}) => {
    // Way to capture posted info in every request
    let channel_post_opts;
    override(channel, "post", (opts) => {
        channel_post_opts = opts;
    });

    // For testing purpose limit the batch size value to 5 instead of 1000
    function send_read(messages) {
        with_overrides(({override_rewire}) => {
            override_rewire(message_flags, "_unread_batch_size", 5);
            message_flags.send_read(messages);
        });
    }

    let msgs_to_flag_read = [
        {locally_echoed: false, id: 1},
        {locally_echoed: false, id: 2},
        {locally_echoed: false, id: 3},
        {locally_echoed: false, id: 4},
        {locally_echoed: false, id: 5},
        {locally_echoed: false, id: 6},
        {locally_echoed: false, id: 7},
    ];
    send_read(msgs_to_flag_read);
    assert.deepEqual(channel_post_opts, {
        url: "/json/messages/flags",
        data: {
            messages: "[1,2,3,4,5]",
            op: "add",
            flag: "read",
        },
        success: channel_post_opts.success,
    });

    // Mock successful flagging of ids
    let success_response_data = {
        messages: [1, 2, 3, 4, 5],
    };
    channel_post_opts.success(success_response_data);
    assert.deepEqual(channel_post_opts, {
        url: "/json/messages/flags",
        data: {
            messages: "[6,7]",
            op: "add",
            flag: "read",
        },
        success: channel_post_opts.success,
    });
    success_response_data = {
        messages: [6, 7],
    };
    channel_post_opts.success(success_response_data);

    // Don't flag locally echoed messages as read
    const local_msg_1 = {locally_echoed: true, id: 1};
    const local_msg_2 = {locally_echoed: true, id: 2};
    msgs_to_flag_read = [
        local_msg_1,
        local_msg_2,
        {locally_echoed: false, id: 3},
        {locally_echoed: false, id: 4},
        {locally_echoed: false, id: 5},
        {locally_echoed: false, id: 6},
        {locally_echoed: false, id: 7},
    ];
    send_read(msgs_to_flag_read);
    assert.deepEqual(channel_post_opts, {
        url: "/json/messages/flags",
        data: {
            messages: "[3,4,5,6,7]",
            op: "add",
            flag: "read",
        },
        success: channel_post_opts.success,
    });

    // Messages still not acked yet
    const events = {};
    const stub_delay = 100;
    function set_timeout(f, delay) {
        assert.equal(delay, stub_delay);
        events.f = f;
        events.timer_set = true;
        return;
    }
    set_global("setTimeout", set_timeout);
    // Mock successful flagging of ids
    success_response_data = {
        messages: [3, 4, 5, 6, 7],
    };
    channel_post_opts.success(success_response_data);
    assert.ok(events.timer_set);

    // Mark them non-local
    local_msg_1.locally_echoed = false;
    local_msg_2.locally_echoed = false;

    // Mock successful flagging of ids
    success_response_data = {
        messages: [3, 4, 5, 6, 7],
    };
    channel_post_opts.success(success_response_data);

    // Former locally echoed messages flagging retried
    assert.deepEqual(channel_post_opts, {
        url: "/json/messages/flags",
        data: {
            messages: "[1,2]",
            op: "add",
            flag: "read",
        },
        success: channel_post_opts.success,
    });

    msgs_to_flag_read = [1, 2, 3, 4, 5];
    message_flags.mark_as_read(msgs_to_flag_read);
    assert.deepEqual(channel_post_opts, {
        url: "/json/messages/flags",
        data: {
            messages: "[1,2,3,4,5]",
            op: "add",
            flag: "read",
        },
    });
});

run_test("read_empty_data", ({override}) => {
    // Way to capture posted info in every request
    let channel_post_opts;
    override(channel, "post", (opts) => {
        channel_post_opts = opts;
    });

    // For testing purpose limit the batch size value to 5 instead of 1000
    function send_read(messages) {
        with_overrides(({override_rewire}) => {
            override_rewire(message_flags, "_unread_batch_size", 5);
            message_flags.send_read(messages);
        });
    }

    // send read to obtain success callback
    send_read([{locally_echoed: false, id: 1}]);

    // verify early return on empty data
    const success_callback = channel_post_opts.success;
    channel_post_opts = {};
    let empty_data;
    success_callback(empty_data);
    assert.deepEqual(channel_post_opts, {});
    empty_data = {messages: undefined};
    success_callback(empty_data);
    assert.deepEqual(channel_post_opts, {});
});

run_test("collapse_and_uncollapse", ({override}) => {
    // Way to capture posted info in every request
    let channel_post_opts;
    override(channel, "post", (opts) => {
        channel_post_opts = opts;
    });

    const msg = {id: 5};

    message_flags.save_collapsed(msg);

    assert.deepEqual(channel_post_opts, {
        url: "/json/messages/flags",
        data: {
            messages: "[5]",
            op: "add",
            flag: "collapsed",
        },
    });

    message_flags.save_uncollapsed(msg);

    assert.deepEqual(channel_post_opts, {
        url: "/json/messages/flags",
        data: {
            messages: "[5]",
            op: "remove",
            flag: "collapsed",
        },
    });
});

run_test("mark_as_unread", ({override}) => {
    // Way to capture posted info in every request
    let channel_post_opts;
    override(channel, "post", (opts) => {
        channel_post_opts = opts;
    });

    const msg = {id: 5};

    message_flags.mark_as_unread([msg.id]);

    assert.deepEqual(channel_post_opts, {
        url: "/json/messages/flags",
        data: {
            messages: "[5]",
            op: "remove",
            flag: "read",
        },
    });
});
```

--------------------------------------------------------------------------------

---[FILE: message_list.test.cjs]---
Location: zulip-main/web/tests/message_list.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {make_stub} = require("./lib/stub.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");
const $ = require("./lib/zjquery.cjs");

// These unit tests for web/src/message_list.ts emphasize the model-ish
// aspects of the MessageList class.  We have to stub out a few functions
// related to views and events to get the tests working.

const noop = function () {};

set_global("document", {
    to_$() {
        return {
            trigger() {},
        };
    },
});

const activity_ui = mock_esm("../src/activity_ui");
const narrow_state = mock_esm("../src/narrow_state");
const stream_data = mock_esm("../src/stream_data");

const {MessageList} = zrequire("message_list");
const {MessageListData} = zrequire("message_list_data");
function MessageListView() {
    return {
        maybe_rerender: noop,
        append: noop,
        prepend: noop,
        clear_rendering_state: noop,
        is_current_message_list: () => true,
    };
}
mock_esm("../src/message_list_view", {
    MessageListView,
});

mock_esm("../src/people.ts", {
    maybe_get_user_by_id: noop,
});

const {Filter} = zrequire("filter");
const {set_current_user} = zrequire("state_data");

const current_user = {};
set_current_user(current_user);

run_test("basics", ({override}) => {
    override(activity_ui, "rerender_user_sidebar_participants", noop);
    const filter = new Filter([]);

    const list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter,
        }),
    });

    const messages = [
        {
            id: 50,
            content: "fifty",
        },
        {
            id: 60,
        },
        {
            id: 70,
        },
        {
            id: 80,
        },
    ];

    assert.equal(list.empty(), true);

    list.append(messages, true);

    assert.equal(list.num_items(), 4);
    assert.equal(list.empty(), false);
    assert.equal(list.first().id, 50);
    assert.equal(list.last().id, 80);

    assert.equal(list.get(50).content, "fifty");

    assert.equal(list.closest_id(49), 50);
    assert.equal(list.closest_id(50), 50);
    assert.equal(list.closest_id(51), 50);
    assert.equal(list.closest_id(59), 60);
    assert.equal(list.closest_id(60), 60);
    assert.equal(list.closest_id(61), 60);

    assert.deepEqual(list.all_messages(), messages);

    override($, "Event", (ev) => {
        assert.equal(ev, "message_selected.zulip");
    });
    list.select_id(50);

    assert.equal(list.selected_id(), 50);
    assert.equal(list.selected_idx(), 0);

    list.advance_past_messages([60, 80]);
    assert.equal(list.selected_id(), 60);
    assert.equal(list.selected_idx(), 1);

    // Make sure not rerendered when reselected
    let num_renders = 0;
    list.rerender = function () {
        num_renders += 1;
    };
    list.reselect_selected_id();
    assert.equal(num_renders, 0);
    assert.equal(list.selected_id(), 60);

    const old_messages = [
        {
            id: 30,
        },
        {
            id: 40,
        },
    ];
    list.add_messages(old_messages);
    assert.equal(list.first().id, 30);
    assert.equal(list.last().id, 80);

    const new_messages = [
        {
            id: 90,
        },
    ];
    list.append(new_messages, true);
    assert.equal(list.last().id, 90);

    list.view.clear_table = function () {};

    list.remove_and_rerender([60]);
    const removed = list.all_messages().filter((msg) => msg.id !== 60);
    assert.deepEqual(list.all_messages(), removed);

    list.clear();
    assert.deepEqual(list.all_messages(), []);
});

run_test("prev_next", () => {
    const list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter: new Filter([]),
        }),
    });

    assert.equal(list.prev(), undefined);
    assert.equal(list.next(), undefined);
    assert.equal(list.is_at_end(), false);

    // try to confuse things with bogus selected id
    list.data.set_selected_id(33);
    assert.equal(list.prev(), undefined);
    assert.equal(list.next(), undefined);
    assert.equal(list.is_at_end(), false);

    const messages = [{id: 30}, {id: 40}, {id: 50}, {id: 60}];
    list.append(messages, true);
    assert.equal(list.prev(), undefined);
    assert.equal(list.next(), undefined);

    // The next case is for defensive code.
    list.data.set_selected_id(45);
    assert.equal(list.prev(), undefined);
    assert.equal(list.next(), undefined);
    assert.equal(list.is_at_end(), false);

    list.data.set_selected_id(30);
    assert.equal(list.prev(), undefined);
    assert.equal(list.next(), 40);

    list.data.set_selected_id(50);
    assert.equal(list.prev(), 40);
    assert.equal(list.next(), 60);
    assert.equal(list.is_at_end(), false);

    list.data.set_selected_id(60);
    assert.equal(list.prev(), 50);
    assert.equal(list.next(), undefined);
    assert.equal(list.is_at_end(), true);
});

run_test("message_range", () => {
    const list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter: new Filter([]),
        }),
    });

    const messages = [{id: 30}, {id: 40}, {id: 50}, {id: 60}];
    list.append(messages, true);
    assert.deepEqual(list.message_range(2, 30), [{id: 30}]);
    assert.deepEqual(list.message_range(2, 31), [{id: 30}, {id: 40}]);
    assert.deepEqual(list.message_range(30, 40), [{id: 30}, {id: 40}]);
    assert.deepEqual(list.message_range(31, 39), [{id: 40}]);
    assert.deepEqual(list.message_range(31, 1000), [{id: 40}, {id: 50}, {id: 60}]);
    blueslip.expect("error", "message_range given a start of -1");
    assert.deepEqual(list.message_range(-1, 40), [{id: 30}, {id: 40}]);
});

run_test("change_message_id", () => {
    const list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter: new Filter([]),
        }),
    });
    list.data._add_to_hash([
        {id: 10.5, content: "good job"},
        {id: 20.5, content: "ok!"},
    ]);

    // local to local
    list.change_message_id(10.5, 11.5);
    assert.equal(list.get(11.5).content, "good job");

    list.change_message_id(11.5, 11);
    assert.equal(list.get(11).content, "good job");

    list.change_message_id(20.5, 10);
    assert.equal(list.get(10).content, "ok!");

    // test nonexistent id
    assert.equal(list.change_message_id(13, 15), undefined);
});

run_test("last_sent_by_me", ({override}) => {
    const list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter: new Filter([]),
        }),
    });
    const items = [
        {
            id: 1,
            sender_id: 3,
        },
        {
            id: 2,
            sender_id: 3,
        },
        {
            id: 3,
            sender_id: 6,
        },
    ];

    list.append(items);
    override(current_user, "user_id", 3);
    // Look for the last message where user_id == 3 (our ID)
    assert.equal(list.get_last_message_sent_by_me().id, 2);
});

run_test("local_echo", () => {
    let list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter: new Filter([]),
        }),
    });
    list.append([
        {id: 10},
        {id: 20},
        {id: 30},
        {id: 20.02},
        {id: 20.03},
        {id: 40},
        {id: 50},
        {id: 60},
    ]);
    list._local_only = {20.02: {id: 20.02}, 20.03: {id: 20.03}};

    assert.equal(list.closest_id(10), 10);
    assert.equal(list.closest_id(20), 20);
    assert.equal(list.closest_id(30), 30);
    assert.equal(list.closest_id(20.02), 20.02);
    assert.equal(list.closest_id(20.03), 20.03);
    assert.equal(list.closest_id(29), 30);
    assert.equal(list.closest_id(40), 40);
    assert.equal(list.closest_id(50), 50);
    assert.equal(list.closest_id(60), 60);

    assert.equal(list.closest_id(60), 60);
    assert.equal(list.closest_id(21), 20);
    assert.equal(list.closest_id(29), 30);
    assert.equal(list.closest_id(31), 30);
    assert.equal(list.closest_id(54), 50);
    assert.equal(list.closest_id(58), 60);

    list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter: new Filter([]),
        }),
    });
    list.append([
        {id: 10},
        {id: 20},
        {id: 30},
        {id: 20.02},
        {id: 20.03},
        {id: 40},
        {id: 50},
        {id: 50.01},
        {id: 50.02},
        {id: 60},
    ]);
    list._local_only = {
        20.02: {id: 20.02},
        20.03: {id: 20.03},
        50.01: {id: 50.01},
        50.02: {id: 50.02},
    };

    assert.equal(list.closest_id(10), 10);
    assert.equal(list.closest_id(20), 20);
    assert.equal(list.closest_id(30), 30);
    assert.equal(list.closest_id(20.02), 20.02);
    assert.equal(list.closest_id(20.03), 20.03);
    assert.equal(list.closest_id(40), 40);
    assert.equal(list.closest_id(50), 50);
    assert.equal(list.closest_id(60), 60);

    assert.equal(list.closest_id(60), 60);
    assert.equal(list.closest_id(21), 20);
    assert.equal(list.closest_id(29), 30);
    assert.equal(list.closest_id(31), 30);
    assert.equal(list.closest_id(47), 50);
    assert.equal(list.closest_id(51), 50.02);
    assert.equal(list.closest_id(59), 60);
    assert.equal(list.closest_id(50.01), 50.01);
});

run_test("bookend", ({override}) => {
    const list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter: new Filter([]),
        }),
    });

    list.view.clear_trailing_bookend = noop;
    list.is_combined_feed_view = false;

    override(narrow_state, "stream_id", () => 5);

    let is_subscribed = true;
    let invite_only = false;

    override(stream_data, "is_subscribed", () => is_subscribed);
    override(stream_data, "get_sub_by_id", () => ({invite_only, name: "IceCream"}));
    override(stream_data, "can_toggle_subscription", () => true);

    {
        const stub = make_stub();
        list.view.render_trailing_bookend = stub.f;
        list.update_trailing_bookend();
        assert.equal(stub.num_calls, 1);
        const bookend = stub.get_args(
            "stream_id",
            "stream_name",
            "subscribed",
            "deactivated",
            "just_unsubscribed",
        );
        assert.equal(bookend.stream_id, 5);
        assert.equal(bookend.stream_name, "IceCream");
        assert.equal(bookend.subscribed, true);
        assert.equal(bookend.deactivated, false);
        assert.equal(bookend.just_unsubscribed, false);
    }

    list.last_message_historical = false;
    is_subscribed = false;

    {
        const stub = make_stub();
        list.view.render_trailing_bookend = stub.f;
        list.update_trailing_bookend();
        assert.equal(stub.num_calls, 1);
        const bookend = stub.get_args(
            "stream_id",
            "stream_name",
            "subscribed",
            "deactivated",
            "just_unsubscribed",
        );
        assert.equal(bookend.stream_id, 5);
        assert.equal(bookend.stream_name, "IceCream");
        assert.equal(bookend.subscribed, false);
        assert.equal(bookend.deactivated, false);
        assert.equal(bookend.just_unsubscribed, false);
    }

    list.last_message_historical = false;
    is_subscribed = false;
    list.empty = () => false;

    {
        const stub = make_stub();
        list.view.render_trailing_bookend = stub.f;
        list.update_trailing_bookend();
        assert.equal(stub.num_calls, 1);
        const bookend = stub.get_args(
            "stream_id",
            "stream_name",
            "subscribed",
            "deactivated",
            "just_unsubscribed",
        );
        assert.equal(bookend.stream_id, 5);
        assert.equal(bookend.stream_name, "IceCream");
        assert.equal(bookend.subscribed, false);
        assert.equal(bookend.deactivated, false);
        assert.equal(bookend.just_unsubscribed, true);
    }

    // Test when the stream is privates (invite only)
    invite_only = true;

    {
        const stub = make_stub();
        list.view.render_trailing_bookend = stub.f;
        list.update_trailing_bookend();
        assert.equal(stub.num_calls, 1);
        const bookend = stub.get_args(
            "stream_id",
            "stream_name",
            "subscribed",
            "deactivated",
            "just_unsubscribed",
        );
        assert.equal(bookend.stream_id, 5);
        assert.equal(bookend.stream_name, "IceCream");
        assert.equal(bookend.subscribed, false);
        assert.equal(bookend.deactivated, false);
        assert.equal(bookend.just_unsubscribed, true);
    }

    list.last_message_historical = true;

    {
        const stub = make_stub();
        list.view.render_trailing_bookend = stub.f;
        list.update_trailing_bookend();
        assert.equal(stub.num_calls, 1);
        const bookend = stub.get_args(
            "stream_id",
            "stream_name",
            "subscribed",
            "deactivated",
            "just_unsubscribed",
        );
        assert.equal(bookend.stream_id, 5);
        assert.equal(bookend.stream_name, "IceCream");
        assert.equal(bookend.subscribed, false);
        assert.equal(bookend.deactivated, false);
        assert.equal(bookend.just_unsubscribed, false);
    }

    // If the user is not subscribed and cannot subscribe to the
    // private channel, no bookend is shown.
    override(stream_data, "can_toggle_subscription", () => false);
    {
        const stub = make_stub();
        list.view.render_trailing_bookend = stub.f;
        list.update_trailing_bookend();
        assert.equal(stub.num_calls, 0);
    }
});

run_test("add_remove_rerender", ({override}) => {
    override(activity_ui, "rerender_user_sidebar_participants", noop);

    const filter = new Filter([]);
    const list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter,
        }),
    });

    const messages = [{id: 1}, {id: 2}, {id: 3}];

    list.add_messages(messages, {}, true);
    assert.equal(list.num_items(), 3);

    {
        const stub = make_stub();
        list.rerender = stub.f;
        const message_ids = messages.map((msg) => msg.id);
        list.remove_and_rerender(message_ids);
        assert.equal(stub.num_calls, 1);
        assert.equal(list.num_items(), 0);
    }
});
```

--------------------------------------------------------------------------------

---[FILE: message_list_data.test.cjs]---
Location: zulip-main/web/tests/message_list_data.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

const user_topics = zrequire("user_topics");
const muted_users = zrequire("muted_users");
const {MessageListData} = zrequire("../src/message_list_data");
const {Filter} = zrequire("filter");

function make_msg(msg_id) {
    return {
        id: msg_id,
        type: "stream",
        unread: true,
        topic: "whatever",
    };
}

function make_msgs(msg_ids) {
    return msg_ids.map((msg_id) => make_msg(msg_id));
}

function assert_contents(mld, msg_ids) {
    const msgs = mld.all_messages_after_mute_filtering();
    assert.deepEqual(msgs, make_msgs(msg_ids));
}

function assert_msg_ids(messages, msg_ids) {
    assert.deepEqual(
        msg_ids,
        messages.map((message) => message.id),
    );
}

mock_esm("../src/people.ts", {
    maybe_get_user_by_id: noop,
});

run_test("basics", () => {
    const mld = new MessageListData({
        excludes_muted_topics: false,
        filter: new Filter([]),
    });

    assert.equal(mld.is_keyword_search(), false);
    assert.ok(mld.can_mark_messages_read());
    mld.add_anywhere(make_msgs([35, 25, 15, 45]));

    assert_contents(mld, [15, 25, 35, 45]);

    const new_msgs = make_msgs([10, 20, 30, 40, 50, 60, 70]);
    const info = mld.add_messages(new_msgs, true);

    assert.deepEqual(info, {
        top_messages: make_msgs([10]),
        interior_messages: make_msgs([20, 30, 40]),
        bottom_messages: make_msgs([50, 60, 70]),
    });

    assert_contents(mld, [10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70]);

    assert.equal(mld.selected_id(), -1);
    assert.equal(mld.closest_id(8), 10);
    assert.equal(mld.closest_id(27), 25);
    assert.equal(mld.closest_id(72), 70);

    mld.set_selected_id(50);
    assert.equal(mld.selected_id(), 50);
    assert.equal(mld.selected_idx(), 8);

    mld.remove([50]);
    assert_contents(mld, [10, 15, 20, 25, 30, 35, 40, 45, 60, 70]);

    mld.update_items_for_muting();
    assert_contents(mld, [10, 15, 20, 25, 30, 35, 40, 45, 60, 70]);

    mld.reset_select_to_closest();
    assert.equal(mld.selected_id(), 45);
    assert.equal(mld.selected_idx(), 7);

    assert.equal(mld.first_unread_message_id(), 10);
    assert.equal(mld.has_unread_messages(), true);
    mld.get(10).unread = false;
    assert.equal(mld.first_unread_message_id(), 15);
    assert.equal(mld.has_unread_messages(), true);

    mld.clear();
    assert_contents(mld, []);
    const msgs_sent_by_6 = [
        {id: 2, sender_id: 6, type: "stream", stream_id: 1, topic: "whatever"},
        {id: 4, sender_id: 6, type: "private", to_user_ids: "6,9,10"},
        {id: 6, sender_id: 6, type: "private", to_user_ids: "6, 11"},
    ];
    const msgs_with_sender_ids = [
        {id: 1, sender_id: 1, type: "stream", stream_id: 1, topic: "random1"},
        {id: 3, sender_id: 4, type: "stream", stream_id: 1, topic: "random2"},
        {id: 5, sender_id: 2, type: "private", to_user_ids: "2,10,11"},
        {id: 8, sender_id: 11, type: "private", to_user_ids: "10"},
        {id: 9, sender_id: 11, type: "private", to_user_ids: "9"},
        ...msgs_sent_by_6,
    ];
    mld.add_messages(msgs_with_sender_ids, true);
    assert.deepEqual(mld.get_messages_sent_by_user(6), msgs_sent_by_6);

    mld.clear();
    assert_contents(mld, []);
    assert.equal(mld.closest_id(99), -1);
    assert.equal(mld.get_last_message_sent_by_me(), undefined);

    mld.add_messages(make_msgs([120, 125.01, 130, 140]), true);
    assert_contents(mld, [120, 125.01, 130, 140]);
    mld.set_selected_id(125.01);
    assert.equal(mld.selected_id(), 125.01);

    mld.get(125.01).id = 145;
    mld.change_message_id(125.01, 145);
    assert_contents(mld, [120, 130, 140, 145]);

    for (const msg of mld.all_messages_after_mute_filtering()) {
        msg.unread = false;
    }

    assert.equal(mld.first_unread_message_id(), 145);
    assert.equal(mld.has_unread_messages(), false);
});

run_test("muting", () => {
    let mld = new MessageListData({
        excludes_muted_topics: false,
        filter: new Filter([{operator: "dm", operand: "alice@example.com"}]),
    });

    const msgs = [
        {id: 1, type: "stream", stream_id: 1, topic: "muted"},
        {id: 2, type: "stream", stream_id: 1, topic: "whatever"},
        // mentions override muting
        {id: 3, type: "stream", stream_id: 1, topic: "muted", mentioned: true},

        // 10,12 = muted users, 9 = non-muted user, 11 = you
        // muted to group direct message
        {id: 4, type: "private", to_user_ids: "9,10", sender_id: 10},
        // non-muted to group direct message
        {id: 5, type: "private", to_user_ids: "9,10", sender_id: 9},
        // muted to 1:1 direct message
        {id: 6, type: "private", to_user_ids: "10", sender_id: 10},
        // non-muted to 1:1 direct message
        {id: 7, type: "private", to_user_ids: "9", sender_id: 9},
        // 1:1 direct message to muted
        {id: 8, type: "private", to_user_ids: "10", sender_id: 11},
        // 1:1 direct message to non-muted
        {id: 9, type: "private", to_user_ids: "9", sender_id: 11},
        // group direct message with everyone muted
        {id: 10, type: "private", to_user_ids: "10,12", sender_id: 10},
    ];

    user_topics.update_user_topics(
        1,
        "random stream name",
        "muted",
        user_topics.all_visibility_policies.MUTED,
    );
    muted_users.add_muted_user(10);
    muted_users.add_muted_user(12);

    // `messages_filtered_for_topic_mutes` should skip filtering
    // messages if `excludes_muted_topics` is false.
    assert.deepEqual(mld.messages_filtered_for_topic_mutes(msgs), msgs);

    // If we are in a 1:1 direct message narrow, `messages_filtered_for_user_mutes`
    // should skip filtering messages.
    assert.deepEqual(mld.messages_filtered_for_user_mutes(msgs), msgs);

    // Test actual behaviour of `messages_filtered_for_*` methods.
    mld.excludes_muted_topics = true;
    mld.filter = new Filter([{operator: "stream", operand: "general"}]);
    const res = mld.messages_filtered_for_topic_mutes(msgs);
    assert.deepEqual(res, [
        {id: 2, type: "stream", stream_id: 1, topic: "whatever"},
        {id: 3, type: "stream", stream_id: 1, topic: "muted", mentioned: true}, // mentions override muting

        // `messages_filtered_for_topic_mutes` does not affect direct messages
        {id: 4, type: "private", to_user_ids: "9,10", sender_id: 10},
        {id: 5, type: "private", to_user_ids: "9,10", sender_id: 9},
        {id: 6, type: "private", to_user_ids: "10", sender_id: 10},
        {id: 7, type: "private", to_user_ids: "9", sender_id: 9},
        {id: 8, type: "private", to_user_ids: "10", sender_id: 11},
        {id: 9, type: "private", to_user_ids: "9", sender_id: 11},
        {id: 10, type: "private", to_user_ids: "10,12", sender_id: 10},
    ]);

    const res_user = mld.messages_filtered_for_user_mutes(msgs);
    assert.deepEqual(res_user, [
        // `messages_filtered_for_user_mutes` does not affect stream messages
        {id: 1, type: "stream", stream_id: 1, topic: "muted"},
        {id: 2, type: "stream", stream_id: 1, topic: "whatever"},
        {id: 3, type: "stream", stream_id: 1, topic: "muted", mentioned: true},
        // muted to group direct message
        {id: 4, type: "private", to_user_ids: "9,10", sender_id: 10},
        // non-muted to group direct message
        {id: 5, type: "private", to_user_ids: "9,10", sender_id: 9},
        // non-muted to 1:1 direct message
        {id: 7, type: "private", to_user_ids: "9", sender_id: 9},
        // 1:1 direct message to non-muted
        {id: 9, type: "private", to_user_ids: "9", sender_id: 11},
    ]);

    // Output filtered based on both topic and user muting.
    mld._all_items = msgs;
    const filtered_messages = mld.unmuted_messages(mld._all_items);
    assert.deepEqual(filtered_messages, [
        {id: 2, type: "stream", stream_id: 1, topic: "whatever"},
        {id: 3, type: "stream", stream_id: 1, topic: "muted", mentioned: true},
        {id: 4, type: "private", to_user_ids: "9,10", sender_id: 10},
        {id: 5, type: "private", to_user_ids: "9,10", sender_id: 9},
        {id: 7, type: "private", to_user_ids: "9", sender_id: 9},
        {id: 9, type: "private", to_user_ids: "9", sender_id: 11},
    ]);

    // Also verify that, the correct set of messages is stored in `_items`
    // once we update the list for muting.
    mld.update_items_for_muting();
    assert.deepEqual(filtered_messages, mld._items);

    // MessageListData methods should always attempt to filter messages,
    // and keep `_all_items` up-to-date.
    mld = new MessageListData({
        excludes_muted_topics: true,
        filter: new Filter([]),
    });
    assert.deepEqual(mld._all_items, []);

    let unmuted_messages_calls = 0;
    mld.unmuted_messages = (messages) => {
        unmuted_messages_calls = unmuted_messages_calls + 1;
        return messages;
    };

    mld.add_anywhere([{id: 10}, {id: 20}]);
    assert.equal(unmuted_messages_calls, 1);
    assert_msg_ids(mld._all_items, [10, 20]);

    mld.prepend([{id: 9}, {id: 19}]);
    assert.equal(unmuted_messages_calls, 2);
    assert_msg_ids(mld._all_items, [9, 19, 10, 20]);

    mld.append([{id: 11}, {id: 21}]);
    assert.equal(unmuted_messages_calls, 3);
    assert_msg_ids(mld._all_items, [9, 19, 10, 20, 11, 21]);

    mld.remove([9]);
    assert_msg_ids(mld._all_items, [19, 10, 20, 11, 21]);

    mld.reorder_messages(20);
    assert_msg_ids(mld._all_items, [10, 11, 19, 20, 21]);

    mld.clear();
    assert_msg_ids(mld._all_items, []);

    // Test `add_messages` populates the `info` dict **after**
    // filtering the messages.
    mld = new MessageListData({
        excludes_muted_topics: true,
        filter: new Filter([]),
    });

    const orig_messages = [
        {id: 3, type: "stream", stream_id: 1, topic: "muted"},
        {id: 4, type: "stream", stream_id: 1, topic: "whatever"},
        {id: 7, type: "stream", stream_id: 1, topic: "muted"},
        {id: 8, type: "stream", stream_id: 1, topic: "whatever"},
    ];

    const orig_info = mld.add_messages(orig_messages, true);
    assert.deepEqual(orig_info, {
        top_messages: [],
        interior_messages: [],
        bottom_messages: [
            {id: 4, type: "stream", stream_id: 1, topic: "whatever"},
            {id: 8, type: "stream", stream_id: 1, topic: "whatever"},
        ],
    });

    assert_msg_ids(mld._all_items, [3, 4, 7, 8]);
    assert_msg_ids(mld._items, [4, 8]);

    const more_messages = [
        {id: 1, type: "stream", stream_id: 1, topic: "muted"},
        {id: 2, type: "stream", stream_id: 1, topic: "whatever"},
        {id: 3, type: "stream", stream_id: 1, topic: "muted"}, // dup
        {id: 5, type: "stream", stream_id: 1, topic: "muted"},
        {id: 6, type: "stream", stream_id: 1, topic: "whatever"},
        {id: 9, type: "stream", stream_id: 1, topic: "muted"},
        {id: 10, type: "stream", stream_id: 1, topic: "whatever"},
    ];

    const more_info = mld.add_messages(more_messages, true);

    assert_msg_ids(mld._all_items, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert_msg_ids(mld._items, [2, 4, 6, 8, 10]);

    assert.deepEqual(more_info, {
        top_messages: [{id: 2, type: "stream", stream_id: 1, topic: "whatever"}],
        interior_messages: [{id: 6, type: "stream", stream_id: 1, topic: "whatever"}],
        bottom_messages: [{id: 10, type: "stream", stream_id: 1, topic: "whatever"}],
    });
});

run_test("errors", () => {
    const mld = new MessageListData({
        excludes_muted_topics: false,
        filter: new Filter([]),
    });
    assert.equal(mld.get("bogus-id"), undefined);

    blueslip.expect("error", "Duplicate message added to MessageListData");
    mld._hash.set(1, "taken");
    mld._add_to_hash(make_msgs([1]));
});
```

--------------------------------------------------------------------------------

````
