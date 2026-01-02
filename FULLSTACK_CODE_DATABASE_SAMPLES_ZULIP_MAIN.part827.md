---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 827
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 827 of 1290)

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

---[FILE: typing_data.test.cjs]---
Location: zulip-main/web/tests/typing_data.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const muted_users = zrequire("muted_users");
const typing_data = zrequire("typing_data");

function test(label, f) {
    run_test(label, ({override}) => {
        typing_data.clear_for_testing();
        muted_users.set_muted_users([]);
        f({override});
    });
}

test("basics", () => {
    // The typing_data needs to be robust with lists of
    // user ids being in arbitrary sorting order. So all
    // the apparent randomness in these tests has a purpose.

    const stream_id = 1;
    const topic = "typing notifications";
    const topic_typing_key = typing_data.get_topic_key(stream_id, topic);
    let status;

    typing_data.add_typist(typing_data.get_direct_message_conversation_key([5, 10, 15]), 15);
    assert.deepEqual(typing_data.get_group_typists([15, 10, 5]), [15]);

    typing_data.add_typist(topic_typing_key, 12);
    assert.deepEqual(typing_data.get_topic_typists(stream_id, topic), [12]);

    // test that you can add a message_id to messages editing state
    typing_data.add_edit_message_typing_id(3);
    assert.deepEqual(typing_data.is_message_editing(3), true);

    typing_data.add_edit_message_typing_id(7);
    assert.deepEqual(typing_data.is_message_editing(7), true);

    // test removing a message from editing state
    status = typing_data.remove_edit_message_typing_id(3);
    assert.deepEqual(status, true);
    assert.deepEqual(typing_data.is_message_editing(3), false);

    // test removing message_id that doesn't exist from editing
    assert.deepEqual(typing_data.is_message_editing(3), false);
    status = typing_data.remove_edit_message_typing_id(3);
    assert.deepEqual(status, false);

    // test that you can add twice
    typing_data.add_typist(typing_data.get_direct_message_conversation_key([5, 10, 15]), 15);

    // add another id to our first group
    typing_data.add_typist(typing_data.get_direct_message_conversation_key([5, 10, 15]), 10);
    assert.deepEqual(typing_data.get_group_typists([10, 15, 5]), [10, 15]);

    typing_data.add_typist(topic_typing_key, 12);

    // add another typist to our stream/topic
    typing_data.add_typist(topic_typing_key, 13);
    assert.deepEqual(typing_data.get_topic_typists(stream_id, topic), [12, 13]);

    // start adding to a new group
    typing_data.add_typist(typing_data.get_direct_message_conversation_key([7, 15]), 7);
    typing_data.add_typist(typing_data.get_direct_message_conversation_key([7, 15]), 15);

    // test get_all_direct_message_typists
    assert.deepEqual(typing_data.get_all_direct_message_typists(), [7, 10, 15]);

    // test basic removal
    assert.ok(
        typing_data.remove_typist(typing_data.get_direct_message_conversation_key([15, 7]), 7),
    );
    assert.deepEqual(typing_data.get_group_typists([7, 15]), [15]);
    assert.ok(typing_data.remove_typist(topic_typing_key, 12));
    assert.deepEqual(typing_data.get_topic_typists(stream_id, topic), [13]);

    // test removing an id that is not there
    assert.ok(
        !typing_data.remove_typist(typing_data.get_direct_message_conversation_key([15, 7]), 7),
    );
    assert.deepEqual(typing_data.get_group_typists([7, 15]), [15]);
    assert.deepEqual(typing_data.get_all_direct_message_typists(), [10, 15]);

    // remove user from one group, but "15" will still be among
    // "all typists"
    assert.ok(
        typing_data.remove_typist(typing_data.get_direct_message_conversation_key([15, 7]), 15),
    );
    assert.deepEqual(typing_data.get_all_direct_message_typists(), [10, 15]);

    // now remove from the other group
    assert.ok(
        typing_data.remove_typist(typing_data.get_direct_message_conversation_key([5, 15, 10]), 15),
    );
    assert.deepEqual(typing_data.get_all_direct_message_typists(), [10]);

    // test duplicate ids in a groups
    typing_data.add_typist(typing_data.get_direct_message_conversation_key([20, 40, 20]), 20);
    assert.deepEqual(typing_data.get_group_typists([20, 40]), [20]);

    // test clearing out typing data
    typing_data.clear_typing_data();
    assert.deepEqual(typing_data.get_group_typists(), []);
    assert.deepEqual(typing_data.get_all_direct_message_typists(), []);
    assert.deepEqual(typing_data.get_topic_typists(stream_id, topic), []);
});

test("muted_typists_excluded", () => {
    const stream_id = 1;
    const topic = "typing notifications";
    const topic_typing_key = typing_data.get_topic_key(stream_id, topic);

    typing_data.add_typist(typing_data.get_direct_message_conversation_key([5, 10, 15]), 5);
    typing_data.add_typist(typing_data.get_direct_message_conversation_key([5, 10, 15]), 10);
    typing_data.add_typist(topic_typing_key, 7);
    typing_data.add_typist(topic_typing_key, 12);

    // Nobody is muted.
    assert.deepEqual(typing_data.get_group_typists([5, 10, 15]), [5, 10]);
    assert.deepEqual(typing_data.get_all_direct_message_typists(), [5, 10]);
    assert.deepEqual(typing_data.get_topic_typists(stream_id, topic), [7, 12]);

    // Mute a user, and test that the get_* functions exclude that user.
    muted_users.add_muted_user(10);
    muted_users.add_muted_user(7);
    assert.deepEqual(typing_data.get_group_typists([5, 10, 15]), [5]);
    assert.deepEqual(typing_data.get_all_direct_message_typists(), [5]);
    assert.deepEqual(typing_data.get_topic_typists(stream_id, topic), [12]);
});

test("timers", () => {
    const events = {};

    const stub_timer_id = "timer_id_stub";
    const stub_group = [5, 10, 15];
    const stub_delay = 99;
    const stub_f = "function";
    const stub_stream_id = 1;
    const stub_topic = "typing notifications";
    const topic_typing_key = typing_data.get_topic_key(stub_stream_id, stub_topic);

    function set_timeout(f, delay) {
        assert.equal(delay, stub_delay);
        events.f = f;
        events.timer_set = true;
        return stub_timer_id;
    }

    function clear_timeout(timer) {
        assert.equal(timer, stub_timer_id);
        events.timer_cleared = true;
    }

    function reset_events() {
        events.f = undefined;
        events.timer_cleared = false;
        events.timer_set = false;
    }

    function kickstart() {
        reset_events();
        typing_data.kickstart_inbound_timer(
            typing_data.get_direct_message_conversation_key(stub_group),
            stub_delay,
            stub_f,
        );
    }

    function clear() {
        reset_events();
        typing_data.clear_inbound_timer(
            typing_data.get_direct_message_conversation_key(stub_group),
        );
    }

    function streams_kickstart() {
        reset_events();
        typing_data.kickstart_inbound_timer(topic_typing_key, stub_delay, stub_f);
    }

    function streams_clear() {
        reset_events();
        typing_data.clear_inbound_timer(topic_typing_key);
    }

    set_global("setTimeout", set_timeout);
    set_global("clearTimeout", clear_timeout);

    // first time, we set
    kickstart();
    assert.deepEqual(events, {
        f: stub_f,
        timer_cleared: false,
        timer_set: true,
    });

    // second time we clear and set
    kickstart();
    assert.deepEqual(events, {
        f: stub_f,
        timer_cleared: true,
        timer_set: true,
    });

    // clearing out typing data
    kickstart();
    typing_data.clear_typing_data();
    assert.deepEqual(events, {
        f: stub_f,
        timer_cleared: true,
        timer_set: true,
    });

    kickstart();
    // first time clearing, we clear
    clear();
    assert.deepEqual(events, {
        f: undefined,
        timer_cleared: true,
        timer_set: false,
    });

    // second time clearing, we noop
    clear();
    assert.deepEqual(events, {
        f: undefined,
        timer_cleared: false,
        timer_set: false,
    });

    // first time, we set
    streams_kickstart();
    assert.deepEqual(events, {
        f: stub_f,
        timer_cleared: false,
        timer_set: true,
    });

    // second time we clear and set
    streams_kickstart();
    assert.deepEqual(events, {
        f: stub_f,
        timer_cleared: true,
        timer_set: true,
    });

    // first time clearing, we clear
    streams_clear();
    assert.deepEqual(events, {
        f: undefined,
        timer_cleared: true,
        timer_set: false,
    });

    // second time clearing, we noop
    streams_clear();
    assert.deepEqual(events, {
        f: undefined,
        timer_cleared: false,
        timer_set: false,
    });
});
```

--------------------------------------------------------------------------------

---[FILE: typing_events.test.cjs]---
Location: zulip-main/web/tests/typing_events.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {make_message_list} = require("./lib/message_list.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const settings_data = mock_esm("../src/settings_data");

const message_lists = zrequire("message_lists");
const people = zrequire("people");
const {set_current_user, set_realm} = zrequire("state_data");
const typing_data = zrequire("typing_data");
const typing_events = zrequire("typing_events");

const current_user = {};
set_current_user(current_user);
set_realm(make_realm());

const anna = {
    email: "anna@example.com",
    full_name: "Anna Karenina",
    user_id: 8,
};

const vronsky = {
    email: "vronsky@example.com",
    full_name: "Alexei Vronsky",
    user_id: 9,
};

const levin = {
    email: "levin@example.com",
    full_name: "Konstantin Levin",
    user_id: 10,
};

const kitty = {
    email: "kitty@example.com",
    full_name: "Kitty S",
    user_id: 11,
};

people.add_active_user(anna);
people.add_active_user(vronsky);
people.add_active_user(levin);
people.add_active_user(kitty);

run_test("render_notifications_for_narrow", ({override, mock_template}) => {
    override(current_user, "user_id", anna.user_id);
    override(settings_data, "user_can_access_all_other_users", () => true);
    const group = [anna.user_id, vronsky.user_id, levin.user_id, kitty.user_id];
    const conversation_key = typing_data.get_direct_message_conversation_key(group);
    const group_emails = `${anna.email},${vronsky.email},${levin.email},${kitty.email}`;
    message_lists.set_current(make_message_list([{operator: "dm", operand: group_emails}]));

    const $typing_notifications = $("#typing_notifications");

    mock_template("typing_notifications.hbs", true, (_args, rendered_html) => rendered_html);

    // Having only two(<MAX_USERS_TO_DISPLAY_NAME) typists, both of them
    // should be rendered but not 'Several people are typing…'
    typing_data.add_typist(conversation_key, anna.user_id);
    typing_data.add_typist(conversation_key, vronsky.user_id);
    typing_events.render_notifications_for_narrow();
    assert.ok($typing_notifications.visible());
    assert.ok($typing_notifications.html().includes(`${anna.full_name} is typing…`));
    assert.ok($typing_notifications.html().includes(`${vronsky.full_name} is typing…`));
    assert.ok(!$typing_notifications.html().includes("Several people are typing…"));

    // Having 3(=MAX_USERS_TO_DISPLAY_NAME) typists should also display only names
    typing_data.add_typist(conversation_key, levin.user_id);
    typing_events.render_notifications_for_narrow();
    assert.ok($typing_notifications.visible());
    assert.ok($typing_notifications.html().includes(`${anna.full_name} is typing…`));
    assert.ok($typing_notifications.html().includes(`${vronsky.full_name} is typing…`));
    assert.ok($typing_notifications.html().includes(`${levin.full_name} is typing…`));
    assert.ok(!$typing_notifications.html().includes("Several people are typing…"));

    // Having 4(>MAX_USERS_TO_DISPLAY_NAME) typists should display "Several people are typing…"
    typing_data.add_typist(conversation_key, kitty.user_id);
    typing_events.render_notifications_for_narrow();
    assert.ok($typing_notifications.visible());
    assert.ok($typing_notifications.html().includes("Several people are typing…"));
    assert.ok(!$typing_notifications.html().includes(`${anna.full_name} is typing…`));
    assert.ok(!$typing_notifications.html().includes(`${vronsky.full_name} is typing…`));
    assert.ok(!$typing_notifications.html().includes(`${levin.full_name} is typing…`));
    assert.ok(!$typing_notifications.html().includes(`${kitty.full_name} is typing…`));

    // #typing_notifications should be hidden when there are no typists.
    typing_data.remove_typist(conversation_key, anna.user_id);
    typing_data.remove_typist(conversation_key, vronsky.user_id);
    typing_data.remove_typist(conversation_key, levin.user_id);
    typing_data.remove_typist(conversation_key, kitty.user_id);
    typing_events.render_notifications_for_narrow();
    assert.ok(!$typing_notifications.visible());

    // #typing_notifications should be hidden for inaccessible users.
    override(settings_data, "user_can_access_all_other_users", () => false);
    const inaccessible_user = people.add_inaccessible_user(20);
    typing_data.add_typist(conversation_key, inaccessible_user.user_id);
    typing_data.add_typist(conversation_key, 21);
    typing_events.render_notifications_for_narrow();
    assert.ok(!$typing_notifications.visible());
});
```

--------------------------------------------------------------------------------

---[FILE: typing_status.test.cjs]---
Location: zulip-main/web/tests/typing_status.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const compose_pm_pill = mock_esm("../src/compose_pm_pill");
const compose_state = mock_esm("../src/compose_state");
const stream_data = mock_esm("../src/stream_data");

const {set_realm} = zrequire("state_data");
const typing = zrequire("typing");
const typing_status = zrequire("typing_status");
const {initialize_user_settings} = zrequire("user_settings");

initialize_user_settings({user_settings: {}});
const realm = make_realm();
set_realm(realm);

const TYPING_STARTED_WAIT_PERIOD = 10000;
const TYPING_STOPPED_WAIT_PERIOD = 5000;

function make_time(secs) {
    // make times semi-realistic
    return 1000000 + 1000 * secs;
}

function returns_time(secs) {
    return function () {
        return make_time(secs);
    };
}

run_test("basics", ({override, override_rewire}) => {
    override(realm, "realm_topics_policy", "disable_empty_topic");
    override(realm, "server_typing_started_wait_period_milliseconds", TYPING_STARTED_WAIT_PERIOD);
    override(realm, "server_typing_stopped_wait_period_milliseconds", TYPING_STOPPED_WAIT_PERIOD);

    assert.equal(typing_status.state, null);
    // invalid conversation basically does nothing
    let worker = {};
    typing_status.update(
        worker,
        null,
        realm.server_typing_started_wait_period_milliseconds,
        realm.server_typing_stopped_wait_period_milliseconds,
    );

    // Start setting up more testing state.
    const events = {};

    function set_timeout(f, delay) {
        assert.equal(delay, 5000);
        events.idle_callback = f;
        return "idle_timer_stub";
    }

    function clear_timeout() {
        events.timer_cleared = true;
    }

    set_global("setTimeout", set_timeout);
    set_global("clearTimeout", clear_timeout);

    function notify_server_start(recipient) {
        assert.deepStrictEqual(recipient, {
            message_type: "direct",
            notification_event_type: "typing",
            ids: [1, 2],
        });
        events.started = true;
    }

    function notify_server_stop(recipient) {
        assert.deepStrictEqual(recipient, {
            message_type: "direct",
            notification_event_type: "typing",
            ids: [1, 2],
        });
        events.stopped = true;
    }

    function clear_events() {
        events.idle_callback = undefined;
        events.started = false;
        events.stopped = false;
        events.timer_cleared = false;
    }

    function call_handler(new_recipient) {
        clear_events();
        typing_status.update(
            worker,
            new_recipient,
            realm.server_typing_started_wait_period_milliseconds,
            realm.server_typing_stopped_wait_period_milliseconds,
        );
    }

    worker = {
        get_current_time: returns_time(5),
        notify_server_start,
        notify_server_stop,
    };

    // Start talking to users having ids - 1, 2.
    call_handler({message_type: "direct", notification_event_type: "typing", ids: [1, 2]});
    assert.deepEqual(typing_status.state, {
        next_send_start_time: make_time(5 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {message_type: "direct", notification_event_type: "typing", ids: [1, 2]},
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: true,
        stopped: false,
        timer_cleared: false,
    });
    assert.ok(events.idle_callback);

    // type again 3 seconds later
    worker.get_current_time = returns_time(8);
    call_handler({message_type: "direct", notification_event_type: "typing", ids: [1, 2]});
    assert.deepEqual(typing_status.state, {
        next_send_start_time: make_time(5 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {message_type: "direct", notification_event_type: "typing", ids: [1, 2]},
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: false,
        stopped: false,
        timer_cleared: true,
    });
    assert.ok(events.idle_callback);

    // type after 15 secs, so that we can notify the server
    // again
    worker.get_current_time = returns_time(18);
    call_handler({message_type: "direct", notification_event_type: "typing", ids: [1, 2]});
    assert.deepEqual(typing_status.state, {
        next_send_start_time: make_time(18 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {message_type: "direct", notification_event_type: "typing", ids: [1, 2]},
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: true,
        stopped: false,
        timer_cleared: true,
    });

    // Now call recipients idle callback that we captured earlier.
    const callback = events.idle_callback;
    clear_events();
    callback();
    assert.deepEqual(typing_status.state, null);
    assert.deepEqual(events, {
        idle_callback: undefined,
        started: false,
        stopped: true,
        timer_cleared: true,
    });

    // Call stop with nothing going on.
    call_handler(null);
    assert.deepEqual(typing_status.state, null);
    assert.deepEqual(events, {
        idle_callback: undefined,
        started: false,
        stopped: false,
        timer_cleared: false,
    });

    // Start talking to users again.
    worker.get_current_time = returns_time(50);
    call_handler({message_type: "direct", notification_event_type: "typing", ids: [1, 2]});
    assert.deepEqual(typing_status.state, {
        next_send_start_time: make_time(50 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {message_type: "direct", notification_event_type: "typing", ids: [1, 2]},
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: true,
        stopped: false,
        timer_cleared: false,
    });
    assert.ok(events.idle_callback);

    // Explicitly stop users.
    call_handler(null);
    assert.deepEqual(typing_status.state, null);
    assert.deepEqual(events, {
        idle_callback: undefined,
        started: false,
        stopped: true,
        timer_cleared: true,
    });

    // Start talking to users again.
    worker.get_current_time = returns_time(80);
    call_handler({message_type: "direct", notification_event_type: "typing", ids: [1, 2]});
    assert.deepEqual(typing_status.state, {
        next_send_start_time: make_time(80 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {message_type: "direct", notification_event_type: "typing", ids: [1, 2]},
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: true,
        stopped: false,
        timer_cleared: false,
    });
    assert.ok(events.idle_callback);

    // Switch to an invalid conversation.
    call_handler(null);
    assert.deepEqual(typing_status.state, null);
    assert.deepEqual(events, {
        idle_callback: undefined,
        started: false,
        stopped: true,
        timer_cleared: true,
    });

    // Switch to another invalid conversation.
    call_handler(null);
    assert.deepEqual(typing_status.state, null);
    assert.deepEqual(events, {
        idle_callback: undefined,
        started: false,
        stopped: false,
        timer_cleared: false,
    });

    // Start talking to users again.
    worker.get_current_time = returns_time(170);
    call_handler({message_type: "direct", notification_event_type: "typing", ids: [1, 2]});
    assert.deepEqual(typing_status.state, {
        next_send_start_time: make_time(170 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {message_type: "direct", notification_event_type: "typing", ids: [1, 2]},
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: true,
        stopped: false,
        timer_cleared: false,
    });
    assert.ok(events.idle_callback);

    // Switch to new users now.
    worker.get_current_time = returns_time(171);

    worker.notify_server_start = (recipient) => {
        assert.deepStrictEqual(recipient, {
            message_type: "direct",
            notification_event_type: "typing",
            ids: [3, 4],
        });
        events.started = true;
    };

    call_handler({message_type: "direct", notification_event_type: "typing", ids: [3, 4]});
    assert.deepEqual(typing_status.state, {
        next_send_start_time: make_time(171 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {message_type: "direct", notification_event_type: "typing", ids: [3, 4]},
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: true,
        stopped: true,
        timer_cleared: true,
    });
    assert.ok(events.idle_callback);

    // If realm requires topics for channel messages and
    // topic is an empty string, no typing recipient is set
    override(compose_state, "get_message_type", () => "stream");
    override(compose_state, "stream_name", () => "Verona");
    override(stream_data, "get_stream_id", () => "2");
    override(stream_data, "can_use_empty_topic", () => false);
    override(compose_state, "topic", () => "");
    assert.equal(typing.get_recipient(), null);

    // test that we correctly detect if worker.get_recipient
    // and typing_status.state.current_recipient are the same

    override(compose_pm_pill, "get_user_ids_string", () => "1,2,3");
    override(compose_state, "get_message_type", () => "private");
    typing_status.state.current_recipient = typing.get_recipient();

    const call_count = {
        maybe_ping_server: 0,
        actually_ping_server: 0,
        start_or_extend_idle_timer: 0,
        stop_last_notification: 0,
    };

    // stub functions to see how may time they are called
    for (const method of Object.keys(call_count)) {
        override_rewire(typing_status, method, () => {
            call_count[method] += 1;
        });
    }

    // User ids of people in compose narrow doesn't change and is same as state.current_recipient
    // so counts of function should increase except stop_last_notification
    typing_status.update(
        worker,
        typing.get_recipient(),
        realm.server_typing_started_wait_period_milliseconds,
        realm.server_typing_stopped_wait_period_milliseconds,
    );
    assert.deepEqual(call_count.maybe_ping_server, 1);
    assert.deepEqual(call_count.start_or_extend_idle_timer, 1);
    assert.deepEqual(call_count.stop_last_notification, 0);

    typing_status.update(
        worker,
        typing.get_recipient(),
        realm.server_typing_started_wait_period_milliseconds,
        realm.server_typing_stopped_wait_period_milliseconds,
    );
    assert.deepEqual(call_count.maybe_ping_server, 2);
    assert.deepEqual(call_count.start_or_extend_idle_timer, 2);
    assert.deepEqual(call_count.stop_last_notification, 0);

    // change in recipient and new_recipient should make us
    // call typing_status.stop_last_notification
    override(compose_pm_pill, "get_user_ids_string", () => "2,3,4");
    typing_status.update(
        worker,
        typing.get_recipient(),
        realm.server_typing_started_wait_period_milliseconds,
        realm.server_typing_stopped_wait_period_milliseconds,
    );
    assert.deepEqual(call_count.maybe_ping_server, 2);
    assert.deepEqual(call_count.start_or_extend_idle_timer, 3);
    assert.deepEqual(call_count.stop_last_notification, 1);

    // Stream messages
    override(compose_state, "get_message_type", () => "stream");
    override(compose_state, "stream_name", () => "Verona");
    override(stream_data, "get_stream_id", () => "2");
    override(compose_state, "topic", () => "test topic");
    typing_status.update(
        worker,
        typing.get_recipient(),
        realm.server_typing_started_wait_period_milliseconds,
        realm.server_typing_stopped_wait_period_milliseconds,
    );
    assert.deepEqual(call_count.maybe_ping_server, 2);
    assert.deepEqual(call_count.start_or_extend_idle_timer, 4);
    assert.deepEqual(call_count.stop_last_notification, 2);
});

run_test("stream_messages", ({override, override_rewire}) => {
    override(realm, "server_typing_started_wait_period_milliseconds", TYPING_STARTED_WAIT_PERIOD);
    override(realm, "server_typing_stopped_wait_period_milliseconds", TYPING_STOPPED_WAIT_PERIOD);
    override_rewire(typing_status, "state", null);

    let worker = {};
    const events = {};

    function set_timeout(f, delay) {
        assert.equal(delay, 5000);
        events.idle_callback = f;
        return "idle_timer_stub";
    }

    function clear_timeout() {
        events.timer_cleared = true;
    }

    set_global("setTimeout", set_timeout);
    set_global("clearTimeout", clear_timeout);

    function notify_server_start(recipient) {
        assert.deepStrictEqual(recipient, {
            message_type: "stream",
            notification_event_type: "typing",
            stream_id: 3,
            topic: "test",
        });
        events.started = true;
    }

    function notify_server_stop(recipient) {
        assert.deepStrictEqual(recipient, {
            message_type: "stream",
            notification_event_type: "typing",
            stream_id: 3,
            topic: "test",
        });
        events.stopped = true;
    }

    function clear_events() {
        events.idle_callback = undefined;
        events.started = false;
        events.stopped = false;
        events.timer_cleared = false;
    }

    function call_handler(new_recipient) {
        clear_events();
        typing_status.update(
            worker,
            new_recipient,
            realm.server_typing_started_wait_period_milliseconds,
            realm.server_typing_stopped_wait_period_milliseconds,
        );
    }

    worker = {
        get_current_time: returns_time(5),
        notify_server_start,
        notify_server_stop,
    };

    // Start typing stream message
    call_handler({
        message_type: "stream",
        notification_event_type: "typing",
        stream_id: 3,
        topic: "test",
    });
    assert.deepEqual(typing_status.state, {
        next_send_start_time: make_time(5 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {
            message_type: "stream",
            notification_event_type: "typing",
            stream_id: 3,
            topic: "test",
        },
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: true,
        stopped: false,
        timer_cleared: false,
    });
    assert.ok(events.idle_callback);

    // type again 3 seconds later. Covers 'same_stream_and_topic' codepath.
    worker.get_current_time = returns_time(8);
    call_handler({
        message_type: "stream",
        notification_event_type: "typing",
        stream_id: 3,
        topic: "test",
    });
    assert.deepEqual(typing_status.state, {
        next_send_start_time: make_time(5 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {
            message_type: "stream",
            notification_event_type: "typing",
            stream_id: 3,
            topic: "test",
        },
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: false,
        stopped: false,
        timer_cleared: true,
    });
    assert.ok(events.idle_callback);

    // Explicitly stop.
    call_handler(null);
    assert.deepEqual(typing_status.state, null);
    assert.deepEqual(events, {
        idle_callback: undefined,
        started: false,
        stopped: true,
        timer_cleared: true,
    });
});

run_test("edit_messages", ({override_rewire}) => {
    override_rewire(typing_status, "state", null);

    let worker = {};
    const events = {};
    const message_id = 7;

    function set_timeout(f, delay) {
        assert.equal(delay, 5000);
        events.idle_callback = f;
        return "idle_timer_stub";
    }

    function clear_timeout() {
        events.timer_cleared = true;
    }

    set_global("setTimeout", set_timeout);
    set_global("clearTimeout", clear_timeout);

    function notify_server_editing_start(recipient) {
        assert.deepStrictEqual(recipient, {
            notification_event_type: "typing_message_edit",
            message_id,
        });
        events.started = true;
    }

    function notify_server_editing_stop(recipient) {
        assert.deepStrictEqual(recipient, {
            notification_event_type: "typing_message_edit",
            message_id,
        });
        events.stopped = true;
    }

    function clear_events() {
        events.idle_callback = undefined;
        events.started = false;
        events.stopped = false;
        events.timer_cleared = false;
    }

    function call_handler_start(new_recipient) {
        clear_events();
        typing_status.update_editing_status(
            worker,
            new_recipient,
            "start",
            TYPING_STARTED_WAIT_PERIOD,
            TYPING_STOPPED_WAIT_PERIOD,
        );
    }

    function call_handler_stop(new_recipient) {
        clear_events();
        typing_status.update_editing_status(
            worker,
            new_recipient,
            "stop",
            TYPING_STARTED_WAIT_PERIOD,
            TYPING_STOPPED_WAIT_PERIOD,
        );
    }

    worker = {
        get_current_time: returns_time(5),
        notify_server_editing_start,
        notify_server_editing_stop,
    };

    // Start typing stream message
    call_handler_start({
        notification_event_type: "typing_message_edit",
        message_id,
    });
    assert.deepEqual(typing_status.editing_state.get(message_id), {
        next_send_start_time: make_time(5 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {
            notification_event_type: "typing_message_edit",
            message_id,
        },
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: true,
        stopped: false,
        timer_cleared: false,
    });
    assert.ok(events.idle_callback);

    worker.get_current_time = returns_time(8);
    call_handler_start({
        notification_event_type: "typing_message_edit",
        message_id,
    });
    assert.deepEqual(typing_status.editing_state.get(message_id), {
        next_send_start_time: make_time(5 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {
            notification_event_type: "typing_message_edit",
            message_id,
        },
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: false,
        stopped: false,
        timer_cleared: true,
    });
    assert.ok(events.idle_callback);

    worker.get_current_time = returns_time(18);
    call_handler_start({
        notification_event_type: "typing_message_edit",
        message_id,
    });
    assert.deepEqual(typing_status.editing_state.get(message_id), {
        next_send_start_time: make_time(18 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {
            notification_event_type: "typing_message_edit",
            message_id,
        },
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: true,
        stopped: false,
        timer_cleared: true,
    });
    assert.ok(events.idle_callback);

    // Now call recipients idle callback that we captured earlier.
    const callback = events.idle_callback;
    clear_events();
    callback();
    assert.deepEqual(typing_status.editing_state.get(message_id), undefined);
    assert.deepEqual(events, {
        idle_callback: undefined,
        started: false,
        stopped: true,
        timer_cleared: true,
    });

    // Start editing message again.
    worker.get_current_time = returns_time(50);
    call_handler_start({
        notification_event_type: "typing_message_edit",
        message_id,
    });
    assert.deepEqual(typing_status.editing_state.get(message_id), {
        next_send_start_time: make_time(50 + 10),
        idle_timer: "idle_timer_stub",
        current_recipient: {
            notification_event_type: "typing_message_edit",
            message_id,
        },
    });
    assert.deepEqual(events, {
        idle_callback: events.idle_callback,
        started: true,
        stopped: false,
        timer_cleared: false,
    });
    assert.ok(events.idle_callback);

    // Explicitly stop.
    call_handler_stop({
        notification_event_type: "typing_message_edit",
        message_id,
    });
    assert.deepEqual(typing_status.editing_state.get(message_id), undefined);
    assert.deepEqual(events, {
        idle_callback: undefined,
        started: false,
        stopped: true,
        timer_cleared: true,
    });
});
```

--------------------------------------------------------------------------------

---[FILE: ui_util.test.cjs]---
Location: zulip-main/web/tests/ui_util.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const ui_util = zrequire("ui_util");

run_test("potentially_collapse_quotes", ({override_rewire}) => {
    const $element = $.create("message-content");
    let children = [];
    $element.children = () => children;

    children = [
        $.create("normal paragraph 1"),
        $.create("blockquote"),
        $.create("normal paragraph 2"),
        $.create("user said paragraph"),
        $.create("message quote"),
        $.create("normal paragraph 3"),
    ];
    override_rewire(ui_util, "get_collapsible_status_array", () => [
        false,
        true,
        false,
        true,
        true,
        false,
    ]);
    // When there are both collapsible and non-collapsible elements, for
    // multiple collapsible elements in a row, only the first element
    // should be collapsed, and the rest's text should be removed. Non-
    // collapsible elements should not be touched.
    let collapsed = ui_util.potentially_collapse_quotes($element);
    assert.equal(collapsed, true);
    let expected_texts = ["never-been-set", "[…]", "never-been-set", "[…]", "", "never-been-set"];
    assert.deepEqual(
        $element.children().map(($el) => $el.text()),
        expected_texts,
    );

    children = [
        $.create("normal paragraph 4"),
        $.create("normal paragraph 5"),
        $.create("normal paragraph 6"),
    ];
    override_rewire(ui_util, "get_collapsible_status_array", () => [false, false, false]);
    // For all non-collapsible elements, none should be collapsed.
    collapsed = ui_util.potentially_collapse_quotes($element);
    assert.equal(collapsed, false);
    expected_texts = ["never-been-set", "never-been-set", "never-been-set"];
    assert.deepEqual(
        $element.children().map(($el) => $el.text()),
        expected_texts,
    );

    children = [$.create("blockquote 1"), $.create("blockquote 2"), $.create("blockquote 3")];
    override_rewire(ui_util, "get_collapsible_status_array", () => [true, true, true]);
    // For all collapsible elements, none should be collapsed.
    collapsed = ui_util.potentially_collapse_quotes($element);
    assert.equal(collapsed, false);
    expected_texts = ["never-been-set", "never-been-set", "never-been-set"];
    assert.deepEqual(
        $element.children().map(($el) => $el.text()),
        expected_texts,
    );
});

run_test("replace_emoji_name_with_emoji_unicode", () => {
    const $emoji = $.create("span").attr("class", "emoji emoji-1f419");
    $emoji.is = () => false;

    const octopus_emoji = "🐙";
    assert.equal(octopus_emoji, ui_util.convert_emoji_element_to_unicode($emoji));

    $emoji.attr("class", "emoji emoji-1f468-200d-1f373");
    const man_cook_emoji = "👨‍🍳";
    assert.equal(man_cook_emoji, ui_util.convert_emoji_element_to_unicode($emoji));
});
```

--------------------------------------------------------------------------------

````
