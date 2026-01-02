---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 808
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 808 of 1290)

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

---[FILE: pm_list_data.test.cjs]---
Location: zulip-main/web/tests/pm_list_data.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {make_message_list} = require("./lib/message_list.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

const unread = mock_esm("../src/unread", {
    num_unread_mentions_for_user_ids_strings(user_ids_string) {
        if (user_ids_string === "103") {
            return true;
        }
        return false;
    },
});

mock_esm("../src/settings_data", {
    user_can_access_all_other_users: () => true,
});
mock_esm("../src/user_status", {
    get_status_emoji: () => ({
        emoji_code: "20",
    }),
});

const narrow_state = zrequire("narrow_state");
const people = zrequire("people");
const pm_conversations = zrequire("pm_conversations");
const pm_list_data = zrequire("pm_list_data");
const message_lists = zrequire("message_lists");
const {set_realm} = zrequire("state_data");
const {initialize_user_settings} = zrequire("user_settings");

set_realm(make_realm());
initialize_user_settings({user_settings: {}});

const alice = {
    email: "alice@zulip.com",
    user_id: 101,
    full_name: "Alice",
};
const bob = {
    email: "bob@zulip.com",
    user_id: 102,
    full_name: "Bob",
};
const me = {
    email: "me@zulip.com",
    user_id: 103,
    full_name: "Me Myself",
};
const zoe = {
    email: "zoe@zulip.com",
    user_id: 104,
    full_name: "Zoe",
};
const cardelio = {
    email: "cardelio@zulip.com",
    user_id: 105,
    full_name: "Cardelio",
};
const iago = {
    email: "iago@zulip.com",
    user_id: 106,
    full_name: "Iago",
};
const bot_test = {
    email: "outgoingwebhook@zulip.com",
    user_id: 314,
    full_name: "Outgoing webhook",
    is_admin: false,
    is_bot: true,
};
people.add_active_user(alice);
people.add_active_user(bob);
people.add_active_user(me);
people.add_active_user(zoe);
people.add_active_user(cardelio);
people.add_active_user(iago);
people.add_active_user(bot_test);
people.initialize_current_user(me.user_id);

function test(label, f) {
    run_test(label, (helpers) => {
        message_lists.set_current(undefined);
        pm_conversations.clear_for_testing();
        f(helpers);
    });
}

function set_pm_with_filter(emails) {
    message_lists.set_current(make_message_list([{operator: "dm", operand: emails}]));
}

function check_list_info(list, length, more_unread, recipients_array) {
    assert.deepEqual(list.conversations_to_be_shown.length, length);
    assert.deepEqual(list.more_conversations_unread_count, more_unread);
    assert.deepEqual(
        list.conversations_to_be_shown.map((conversation) => conversation.recipients),
        recipients_array,
    );
}

test("get_conversations", ({override}) => {
    pm_conversations.recent.insert([alice.user_id, bob.user_id], 1);
    pm_conversations.recent.insert([me.user_id], 2);
    let num_unread_for_user_ids_string = 1;
    override(unread, "num_unread_for_user_ids_string", () => num_unread_for_user_ids_string);

    assert.equal(narrow_state.filter(), undefined);

    const expected_data = [
        {
            is_bot: false,
            is_current_user: true,
            is_active: false,
            includes_deactivated_user: false,
            is_group: false,
            is_zero: false,
            recipients: "Me Myself",
            unread: 1,
            url: "#narrow/dm/103-Me-Myself",
            user_circle_class: "user-circle-offline",
            user_ids_string: "103",
            status_emoji_info: {
                emoji_code: "20",
            },
            has_unread_mention: true,
        },
        {
            recipients: "Alice, Bob",
            is_current_user: false,
            user_ids_string: "101,102",
            unread: 1,
            is_zero: false,
            is_active: false,
            includes_deactivated_user: false,
            url: "#narrow/dm/101,102-group",
            user_circle_class: undefined,
            is_group: true,
            is_bot: false,
            status_emoji_info: undefined,
            has_unread_mention: false,
        },
    ];

    let pm_data = pm_list_data.get_conversations();
    assert.deepEqual(pm_data, expected_data);

    num_unread_for_user_ids_string = 0;

    pm_data = pm_list_data.get_conversations();
    expected_data[0].unread = 0;
    expected_data[0].is_zero = true;
    expected_data[1].unread = 0;
    expected_data[1].is_zero = true;
    assert.deepEqual(pm_data, expected_data);

    pm_data = pm_list_data.get_conversations();
    assert.deepEqual(pm_data, expected_data);

    expected_data.unshift({
        recipients: "Iago",
        user_ids_string: "106",
        unread: 0,
        is_zero: true,
        is_active: true,
        includes_deactivated_user: false,
        is_current_user: false,
        url: "#narrow/dm/106-Iago",
        status_emoji_info: {emoji_code: "20"},
        user_circle_class: "user-circle-offline",
        is_group: false,
        is_bot: false,
        has_unread_mention: false,
    });
    set_pm_with_filter("iago@zulip.com");
    pm_data = pm_list_data.get_conversations();
    assert.deepEqual(pm_data, expected_data);

    pm_data = pm_list_data.get_conversations("Ia");
    assert.deepEqual(
        pm_data,
        expected_data.filter((item) => item.recipients === "Iago"),
    );

    // filter should work with email
    pm_data = pm_list_data.get_conversations("me@zulip");
    assert.deepEqual(
        pm_data,
        expected_data.filter((item) => item.recipients === "Me Myself"),
    );
});

test("get_conversations bot", ({override}) => {
    pm_conversations.recent.insert([alice.user_id, bob.user_id], 1);
    pm_conversations.recent.insert([bot_test.user_id], 2);

    override(unread, "num_unread_for_user_ids_string", () => 1);

    assert.equal(narrow_state.filter(), undefined);

    const expected_data = [
        {
            recipients: "Outgoing webhook",
            user_ids_string: "314",
            is_current_user: false,
            unread: 1,
            is_zero: false,
            is_active: false,
            includes_deactivated_user: false,
            url: "#narrow/dm/314-Outgoing-webhook",
            status_emoji_info: undefined,
            user_circle_class: "user-circle-offline",
            is_group: false,
            is_bot: true,
            has_unread_mention: false,
        },
        {
            recipients: "Alice, Bob",
            user_ids_string: "101,102",
            is_current_user: false,
            unread: 1,
            is_zero: false,
            is_active: false,
            includes_deactivated_user: false,
            url: "#narrow/dm/101,102-group",
            user_circle_class: undefined,
            status_emoji_info: undefined,
            is_group: true,
            is_bot: false,
            has_unread_mention: false,
        },
    ];

    const pm_data = pm_list_data.get_conversations();
    assert.deepEqual(pm_data, expected_data);
});

test("get_active_user_ids_string", () => {
    assert.equal(pm_list_data.get_active_user_ids_string(), undefined);

    message_lists.set_current(make_message_list([{operator: "stream", operand: "test"}]));
    assert.equal(pm_list_data.get_active_user_ids_string(), undefined);

    set_pm_with_filter("bob@zulip.com,alice@zulip.com");
    assert.equal(pm_list_data.get_active_user_ids_string(), "101,102");

    blueslip.expect("warn", "Unknown emails");
    set_pm_with_filter("invalid@zulip.com");
    assert.equal(pm_list_data.get_active_user_ids_string(), undefined);
    blueslip.reset();

    set_pm_with_filter("bob@zulip.com,alice@zulip.com,me@zulip.com");
    assert.equal(pm_list_data.get_active_user_ids_string(), "101,102");
});

test("get_list_info_unread_messages", ({override}) => {
    let list_info;
    assert.equal(narrow_state.filter(), undefined);

    // Initialize an empty list to start.
    list_info = pm_list_data.get_list_info(false);
    check_list_info(list_info, 0, 0, []);

    // Mock to arrange that each user has exactly 1 unread.
    override(unread, "num_unread_for_user_ids_string", () => 1);

    // Initially, append 2 conversations and check for the
    // `conversations_to_be_shown` returned in list_info.
    pm_conversations.recent.insert([alice.user_id], 1);
    pm_conversations.recent.insert([me.user_id], 2);

    list_info = pm_list_data.get_list_info(false);
    check_list_info(list_info, 2, 0, ["Me Myself", "Alice"]);

    // Visible conversations are limited to value of
    // `max_conversations_to_show_with_unreads`.
    // Verify that the oldest conversations are not shown and
    // their unreads are counted in more_conversations_unread_count.
    pm_conversations.recent.insert([bob.user_id], 3);
    pm_conversations.recent.insert([alice.user_id, bob.user_id], 4);
    pm_conversations.recent.insert([zoe.user_id], 5);
    pm_conversations.recent.insert([zoe.user_id, bob.user_id], 6);
    pm_conversations.recent.insert([zoe.user_id, alice.user_id], 7);
    pm_conversations.recent.insert([zoe.user_id, bob.user_id, alice.user_id], 8);
    pm_conversations.recent.insert([cardelio.user_id, zoe.user_id], 9);
    pm_conversations.recent.insert([cardelio.user_id, bob.user_id], 10);
    pm_conversations.recent.insert([cardelio.user_id, alice.user_id], 11);
    pm_conversations.recent.insert([cardelio.user_id, zoe.user_id, bob.user_id], 12);
    pm_conversations.recent.insert([cardelio.user_id, zoe.user_id, alice.user_id], 13);
    pm_conversations.recent.insert([cardelio.user_id, bob.user_id, alice.user_id], 14);
    pm_conversations.recent.insert([cardelio.user_id, bob.user_id, alice.user_id, zoe.user_id], 15);
    pm_conversations.recent.insert([cardelio.user_id], 16);
    pm_conversations.recent.insert([iago.user_id], 17);

    list_info = pm_list_data.get_list_info(false);
    check_list_info(list_info, 15, 2, [
        "Iago",
        "Cardelio",
        "Alice, Bob, Cardelio, Zoe",
        "Alice, Bob, Cardelio",
        "Alice, Cardelio, Zoe",
        "Bob, Cardelio, Zoe",
        "Alice, Cardelio",
        "Bob, Cardelio",
        "Cardelio, Zoe",
        "Alice, Bob, Zoe",
        "Alice, Zoe",
        "Bob, Zoe",
        "Zoe",
        "Alice, Bob",
        "Bob",
    ]);

    // Narrowing to direct messages with Alice adds older
    // one-on-one conversation with her to the list and one
    // unread is removed from more_conversations_unread_count.
    set_pm_with_filter("alice@zulip.com");
    list_info = pm_list_data.get_list_info(false);
    check_list_info(list_info, 16, 1, [
        "Iago",
        "Cardelio",
        "Alice, Bob, Cardelio, Zoe",
        "Alice, Bob, Cardelio",
        "Alice, Cardelio, Zoe",
        "Bob, Cardelio, Zoe",
        "Alice, Cardelio",
        "Bob, Cardelio",
        "Cardelio, Zoe",
        "Alice, Bob, Zoe",
        "Alice, Zoe",
        "Bob, Zoe",
        "Zoe",
        "Alice, Bob",
        "Bob",
        "Alice",
    ]);

    // Zooming will show all conversations and there will
    // be no unreads in more_conversations_unread_count.
    list_info = pm_list_data.get_list_info(true);
    check_list_info(list_info, 17, 0, [
        "Iago",
        "Cardelio",
        "Alice, Bob, Cardelio, Zoe",
        "Alice, Bob, Cardelio",
        "Alice, Cardelio, Zoe",
        "Bob, Cardelio, Zoe",
        "Alice, Cardelio",
        "Bob, Cardelio",
        "Cardelio, Zoe",
        "Alice, Bob, Zoe",
        "Alice, Zoe",
        "Bob, Zoe",
        "Zoe",
        "Alice, Bob",
        "Bob",
        "Me Myself",
        "Alice",
    ]);
});

test("get_list_info_no_unread_messages", ({override}) => {
    let list_info;
    override(unread, "num_unread_for_user_ids_string", () => 0);

    pm_conversations.recent.insert([alice.user_id], 1);
    pm_conversations.recent.insert([me.user_id], 2);
    pm_conversations.recent.insert([bob.user_id], 3);
    pm_conversations.recent.insert([zoe.user_id], 4);
    pm_conversations.recent.insert([cardelio.user_id], 5);
    pm_conversations.recent.insert([zoe.user_id, cardelio.user_id], 6);
    pm_conversations.recent.insert([alice.user_id, bob.user_id], 7);
    pm_conversations.recent.insert([zoe.user_id, bob.user_id], 8);
    pm_conversations.recent.insert([alice.user_id, cardelio.user_id], 9);
    pm_conversations.recent.insert([bob.user_id, cardelio.user_id], 10);

    // Visible conversations are limited to value of
    // `max_conversations_to_show`.
    list_info = pm_list_data.get_list_info(false);
    check_list_info(list_info, 8, 0, [
        "Bob, Cardelio",
        "Alice, Cardelio",
        "Bob, Zoe",
        "Alice, Bob",
        "Cardelio, Zoe",
        "Cardelio",
        "Zoe",
        "Bob",
    ]);

    // Narrowing to direct messages with Alice adds older
    // one-on-one conversation with her to the list.
    set_pm_with_filter("alice@zulip.com");
    list_info = pm_list_data.get_list_info(false);
    check_list_info(list_info, 9, 0, [
        "Bob, Cardelio",
        "Alice, Cardelio",
        "Bob, Zoe",
        "Alice, Bob",
        "Cardelio, Zoe",
        "Cardelio",
        "Zoe",
        "Bob",
        "Alice",
    ]);

    // Zooming will show all conversations.
    list_info = pm_list_data.get_list_info(true);
    check_list_info(list_info, 10, 0, [
        "Bob, Cardelio",
        "Alice, Cardelio",
        "Bob, Zoe",
        "Alice, Bob",
        "Cardelio, Zoe",
        "Cardelio",
        "Zoe",
        "Bob",
        "Me Myself",
        "Alice",
    ]);
});

test("get_list_info_deactivated_users", ({override}) => {
    override(unread, "num_unread_for_user_ids_string", () => 0);

    // Set up recent direct message conversations.
    pm_conversations.recent.insert([alice.user_id], 1);
    pm_conversations.recent.insert([me.user_id], 2);
    pm_conversations.recent.insert([bob.user_id], 3);
    pm_conversations.recent.insert([zoe.user_id], 4);
    pm_conversations.recent.insert([cardelio.user_id], 5);

    // Deactivate Bob.
    const bob_from_people = people.get_by_user_id(bob.user_id);
    people.deactivate(bob_from_people);

    // When only 5 direct message conversations are present
    // and Bob is deactivated, we should show only 4.
    let list_info = pm_list_data.get_list_info(false);
    // Verify that Bob (deactivated) is not included.
    check_list_info(list_info, 4, 0, ["Cardelio", "Zoe", "Me Myself", "Alice"]);

    // Set up more conversations than max_conversations_to_show
    // (which is 8), including one recent group conversation that
    // involves Bob who has been deactivated.
    pm_conversations.recent.insert([zoe.user_id, cardelio.user_id], 6);
    pm_conversations.recent.insert([bob.user_id, cardelio.user_id], 7);
    pm_conversations.recent.insert([alice.user_id, iago.user_id], 8);
    pm_conversations.recent.insert([alice.user_id, cardelio.user_id], 9);
    pm_conversations.recent.insert([zoe.user_id, iago.user_id], 10);
    pm_conversations.recent.insert([iago.user_id], 11);
    pm_conversations.recent.insert([alice.user_id, zoe.user_id], 12);
    pm_conversations.recent.insert([cardelio.user_id, iago.user_id], 13);

    // There are 13 total conversations, 2 involve Bob and are excluded.
    // From the remaining 11 conversantions latest 8 are included.
    list_info = pm_list_data.get_list_info(false);
    // Verify that Bob (deactivated) is not included.
    check_list_info(list_info, 8, 0, [
        "Cardelio, Iago",
        "Alice, Zoe",
        "Iago",
        "Iago, Zoe",
        "Alice, Cardelio",
        "Alice, Iago",
        "Cardelio, Zoe",
        "Cardelio",
    ]);

    // Zooming in should reveal all direct message conversations including
    // the conversations with Bob.
    list_info = pm_list_data.get_list_info(true);
    check_list_info(list_info, 13, 0, [
        "Cardelio, Iago",
        "Alice, Zoe",
        "Iago",
        "Iago, Zoe",
        "Alice, Cardelio",
        "Alice, Iago",
        "Bob, Cardelio",
        "Cardelio, Zoe",
        "Cardelio",
        "Zoe",
        "Bob",
        "Me Myself",
        "Alice",
    ]);

    override(unread, "num_unread_for_user_ids_string", () => 1);

    // Verify with unread messages that conversations with Bob are still
    // not shown in the unzoomed case, and the unread count for more
    // conversations is updated for those 2 conversations.
    list_info = pm_list_data.get_list_info(false);
    assert.deepEqual(list_info.conversations_to_be_shown.length, 11);
    assert.deepEqual(list_info.more_conversations_unread_count, 2);
    // Verify that Bob (deactivated) is not included.
    check_list_info(list_info, 11, 2, [
        "Cardelio, Iago",
        "Alice, Zoe",
        "Iago",
        "Iago, Zoe",
        "Alice, Cardelio",
        "Alice, Iago",
        "Cardelio, Zoe",
        "Cardelio",
        "Zoe",
        "Me Myself",
        "Alice",
    ]);

    // Reactivate Bob to not affect other tests.
    people.add_active_user(bob);
});
```

--------------------------------------------------------------------------------

---[FILE: poll_widget.test.cjs]---
Location: zulip-main/web/tests/poll_widget.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");
const $ = require("./lib/zjquery.cjs");

mock_esm("../src/settings_data", {
    user_can_access_all_other_users: () => true,
});

const {PollData} = zrequire("poll_data");

const poll_widget = zrequire("poll_widget");

const people = zrequire("people");
const {set_realm} = zrequire("state_data");

set_realm(make_realm());

const me = {
    email: "me@zulip.com",
    full_name: "Me Myself",
    user_id: 99,
};
const alice = {
    email: "alice@zulip.com",
    full_name: "Alice Lee",
    user_id: 100,
};
people.add_active_user(me);
people.add_active_user(alice);
people.initialize_current_user(me.user_id);

run_test("PollData my question", () => {
    const is_my_poll = true;
    const question = "Favorite color?";

    const data_holder = new PollData({
        current_user_id: me.user_id,
        message_sender_id: me.user_id,
        is_my_poll,
        question,
        options: [],
        comma_separated_names: people.get_full_names_for_poll_option,
        report_error_function: blueslip.warn,
    });

    let data = data_holder.get_widget_data();

    assert.deepEqual(data, {
        options: [],
        question: "Favorite color?",
    });

    const question_event = {
        type: "question",
        question: "best plan?",
    };

    data_holder.handle_event(me.user_id, question_event);
    data = data_holder.get_widget_data();

    assert.deepEqual(data, {
        options: [],
        question: "best plan?",
    });

    const option_event = {
        type: "new_option",
        idx: 1,
        option: "release now",
    };

    data_holder.handle_event(me.user_id, option_event);
    data = data_holder.get_widget_data();

    assert.deepEqual(data, {
        options: [
            {
                option: "release now",
                names: "",
                count: 0,
                key: "99,1",
                current_user_vote: false,
            },
        ],
        question: "best plan?",
    });

    let vote_event = {
        type: "vote",
        key: "99,1",
        vote: 1,
    };

    data_holder.handle_event(me.user_id, vote_event);
    data = data_holder.get_widget_data();

    assert.deepEqual(data, {
        options: [
            {
                option: "release now",
                names: "Me Myself",
                count: 1,
                key: "99,1",
                current_user_vote: true,
            },
        ],
        question: "best plan?",
    });

    vote_event = {
        type: "vote",
        key: "99,1",
        vote: 1,
    };

    data_holder.handle_event(alice.user_id, vote_event);
    data = data_holder.get_widget_data();

    assert.deepEqual(data, {
        options: [
            {
                option: "release now",
                names: "Me Myself, Alice Lee",
                count: 2,
                key: "99,1",
                current_user_vote: true,
            },
        ],
        question: "best plan?",
    });

    const invalid_vote_event = {
        type: "vote",
        key: "98,1",
        vote: 1,
    };

    blueslip.expect("warn", `unknown key for poll: ${invalid_vote_event.key}`);
    data_holder.handle_event(me.user_id, invalid_vote_event);
    data = data_holder.get_widget_data();

    const option_outbound_event = data_holder.handle.new_option.outbound("new option");
    assert.deepEqual(option_outbound_event, {
        type: "new_option",
        idx: 2,
        option: "new option",
    });

    const new_question = "Any new plan?";
    const question_outbound_event = data_holder.handle.question.outbound(new_question);
    assert.deepEqual(question_outbound_event, {
        type: "question",
        question: new_question,
    });

    const vote_outbound_event = data_holder.handle.vote.outbound("99,1");
    assert.deepEqual(vote_outbound_event, {type: "vote", key: "99,1", vote: -1});

    vote_event = {
        type: "vote",
        key: "99,1",
        vote: -1,
    };

    data_holder.handle_event(me.user_id, vote_event);
    data = data_holder.get_widget_data();

    assert.deepEqual(data, {
        options: [
            {
                option: "release now",
                names: "Alice Lee",
                count: 1,
                key: "99,1",
                current_user_vote: false,
            },
        ],
        question: "best plan?",
    });
});

run_test("wrong person editing question", () => {
    const is_my_poll = true;
    const question = "Favorite color?";

    const data_holder = new PollData({
        current_user_id: me.user_id,
        message_sender_id: me.user_id,
        is_my_poll,
        question,
        options: [],
        comma_separated_names: people.get_full_names_for_poll_option,
        report_error_function: blueslip.warn,
    });

    const question_event = {
        type: "question",
        question: "best plan?",
    };

    blueslip.expect("warn", "user 100 is not allowed to edit the question");

    data_holder.handle_event(alice.user_id, question_event);

    assert.deepEqual(data_holder.get_widget_data(), {
        options: [],
        question: "Favorite color?",
    });
});

run_test("activate another person poll", ({mock_template}) => {
    mock_template("widgets/poll_widget.hbs", false, () => "widgets/poll_widget");
    mock_template("widgets/poll_widget_results.hbs", false, () => "widgets/poll_widget_results");

    const $widget_elem = $("<div>").addClass("widget-content");

    let out_data; // Used to check the event data sent to the server
    const callback = (data) => {
        out_data = data;
    };

    const opts = {
        $elem: $widget_elem,
        callback,
        message: {
            sender_id: alice.user_id,
        },
        extra_data: {
            question: "What do you want?",
        },
    };

    const set_widget_find_result = (selector) => {
        const $elem = $.create(selector);
        $widget_elem.set_find_results(selector, $elem);
        return $elem;
    };

    const $poll_option = set_widget_find_result("button.poll-option");
    const $poll_option_input = set_widget_find_result("input.poll-option");
    const $widget_option_container = set_widget_find_result("ul.poll-widget");

    const $poll_question_submit = set_widget_find_result("button.poll-question-check");
    const $poll_edit_question = set_widget_find_result(".poll-edit-question");
    const $poll_question_header = set_widget_find_result(".poll-question-header");
    const $poll_question_container = set_widget_find_result(".poll-question-bar");
    const $poll_option_container = set_widget_find_result(".poll-option-bar");

    const $poll_vote_button = set_widget_find_result("button.poll-vote");
    const $poll_please_wait = set_widget_find_result(".poll-please-wait");

    set_widget_find_result("button.poll-question-remove");
    set_widget_find_result("input.poll-question");

    const handle_events = poll_widget.activate(opts);

    assert.ok($poll_option_container.visible());
    assert.ok($poll_question_header.visible());

    assert.ok(!$poll_question_container.visible());
    assert.ok(!$poll_question_submit.visible());
    assert.ok(!$poll_edit_question.visible());
    assert.ok(!$poll_please_wait.visible());

    assert.equal($widget_elem.html(), "widgets/poll_widget");
    assert.equal($widget_option_container.html(), "widgets/poll_widget_results");
    assert.equal($poll_question_header.text(), "What do you want?");

    {
        /* Testing data sent to server on adding option */
        $poll_option_input.val("cool choice");
        out_data = undefined;
        $poll_option.trigger("click");
        assert.deepEqual(out_data, {type: "new_option", idx: 1, option: "cool choice"});

        $poll_option_input.val("");
        out_data = undefined;
        $poll_option.trigger("click");
        assert.deepEqual(out_data, undefined);
    }

    const vote_events = [
        {
            sender_id: alice.user_id,
            data: {
                type: "new_option",
                idx: 1,
                option: "release now",
            },
        },
        {
            sender_id: alice.user_id,
            data: {
                type: "vote",
                key: "100,1",
                vote: 1,
            },
        },
    ];

    handle_events(vote_events);

    {
        /* Testing data sent to server on voting */
        $poll_vote_button.attr("data-key", "100,1");
        out_data = undefined;
        $poll_vote_button.trigger("click");
        assert.deepEqual(out_data, {type: "vote", key: "100,1", vote: 1});
    }

    const add_question_event = [
        {
            sender_id: 100,
            data: {
                type: "question",
                question: "best plan?",
            },
        },
    ];

    handle_events(add_question_event);
});

run_test("activate own poll", ({mock_template}) => {
    mock_template("widgets/poll_widget.hbs", false, () => "widgets/poll_widget");
    mock_template("widgets/poll_widget_results.hbs", false, () => "widgets/poll_widget_results");

    const $widget_elem = $("<div>").addClass("widget-content");
    let out_data;
    const callback = (data) => {
        out_data = data;
    };
    const opts = {
        $elem: $widget_elem,
        callback,
        message: {
            sender_id: me.user_id,
        },
        extra_data: {
            question: "Where to go?",
        },
    };

    const set_widget_find_result = (selector) => {
        const $elem = $.create(selector);
        $widget_elem.set_find_results(selector, $elem);
        return $elem;
    };

    set_widget_find_result("button.poll-option");
    const $poll_option_input = set_widget_find_result("input.poll-option");
    const $widget_option_container = set_widget_find_result("ul.poll-widget");

    const $poll_question_submit = set_widget_find_result("button.poll-question-check");
    const $poll_edit_question = set_widget_find_result(".poll-edit-question");
    const $poll_question_input = set_widget_find_result("input.poll-question");
    const $poll_question_header = set_widget_find_result(".poll-question-header");
    const $poll_question_container = set_widget_find_result(".poll-question-bar");
    const $poll_option_container = set_widget_find_result(".poll-option-bar");

    set_widget_find_result("button.poll-vote");
    const $poll_please_wait = set_widget_find_result(".poll-please-wait");

    set_widget_find_result("button.poll-question-remove");

    function assert_visibility() {
        assert.ok($poll_option_container.visible());
        assert.ok($poll_question_header.visible());
        assert.ok(!$poll_question_container.visible());
        assert.ok($poll_edit_question.visible());
        assert.ok(!$poll_please_wait.visible());
    }

    poll_widget.activate(opts);

    assert_visibility();
    assert.ok(!$poll_question_submit.visible());

    assert.equal($widget_elem.html(), "widgets/poll_widget");
    assert.equal($widget_option_container.html(), "widgets/poll_widget_results");
    assert.equal($poll_question_header.text(), "Where to go?");

    {
        /* Testing data sent to server on editing question */
        $poll_question_input.val("Is it new?");
        out_data = undefined;
        $poll_question_submit.trigger("click");
        assert.deepEqual(out_data, {type: "question", question: "Is it new?"});

        assert_visibility();
        assert.ok($poll_question_submit.visible());

        $poll_option_input.val("");
        out_data = undefined;
        $poll_question_submit.trigger("click");
        assert.deepEqual(out_data, undefined);
    }
});
```

--------------------------------------------------------------------------------

---[FILE: popover_menus_data.test.cjs]---
Location: zulip-main/web/tests/popover_menus_data.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_user_group} = require("./lib/example_group.cjs");
const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");
const {page_params} = require("./lib/zpage_params.cjs");

const {Filter} = zrequire("filter");
const {MessageList} = zrequire("message_list");
const message_lists = zrequire("message_lists");

const popover_menus_data = zrequire("popover_menus_data");
const people = zrequire("people");
const user_groups = zrequire("user_groups");
const {MessageListData} = zrequire("message_list_data");
const {set_current_user, set_realm} = zrequire("state_data");
const settings_config = zrequire("settings_config");

const noop = function () {};

// Define MessageList stuff
function MessageListView() {
    return {
        maybe_rerender: noop,
        append: noop,
        prepend: noop,
        clear_rendering_state: noop,
        get_row: () => ({
            find(selector) {
                assert.equal(selector, ".message_controls .reaction_button");
                return {
                    length: 1,
                    css(property) {
                        assert.equal(property, "display");
                        return "none";
                    },
                };
            },
        }),
        message_containers: new Map(),
    };
}
mock_esm("../src/message_list_view", {
    MessageListView,
});
mock_esm("../src/ui_util", {
    listener_for_preferred_color_scheme_change: noop,
});
mock_esm("../src/hash_util", {
    by_conversation_and_time_url: () => "conversation_and_time_url",
});
mock_esm("../src/stream_data", {
    is_subscribed: () => true,
    is_stream_archived_by_id: () => false,
    get_sub_by_id: () => noop,
    user_can_move_messages_within_channel: () => true,
    is_empty_topic_only_channel: () => false,
});
mock_esm("../src/group_permission_settings", {
    get_group_permission_setting_config() {
        return {
            allow_everyone_group: false,
        };
    },
});

const current_user = {};
set_current_user(current_user);
const realm = make_realm();
set_realm(realm);

// Define test users
const mike = {
    user_id: 1000,
    full_name: "Test Mike",
    email: "mike@example.com",
    is_admin: false,
    is_guest: false,
};

const bob = {
    user_id: 2000,
    full_name: "Test Bob",
    email: "bob@example.com",
    is_admin: false,
    is_guest: false,
};

const me = {
    user_id: 999,
    full_name: "Test Myself",
    email: "me@example.com",
    is_admin: false,
    is_guest: false,
};

const everyone = make_user_group({
    name: "role:everyone",
    id: 2,
    members: new Set([999, 1000, 2000]),
    is_system_group: true,
    direct_subgroup_ids: new Set(),
});
user_groups.initialize({realm_user_groups: [everyone]});

// Helper functions:
function add_initialize_users() {
    // Initialize people
    people.init();

    // Add users
    people.add_active_user(mike);
    people.add_active_user(bob);
    people.add_active_user(me);

    // Initialize current user
    people.initialize_current_user(me.user_id);
}

function init_message_list() {
    const filter = new Filter([]);
    const list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter,
        }),
    });

    assert.equal(list.empty(), true);

    return list;
}

// Append message to message_list, also add container to message_lists
function add_message_with_view(list, messages) {
    list.append(messages, true);
    for (const message of messages) {
        message_lists.current.view.message_containers.set(message.id, {
            is_hidden: message.is_hidden,
        });
    }
}

// Function sets page parameters with no time constraints on editing the message.
// User is assumed to not be an admin.
function set_page_params_no_edit_restrictions({override}) {
    page_params.is_spectator = false;
    override(realm, "realm_allow_message_editing", true);
    override(realm, "realm_message_content_edit_limit_seconds", null);
    override(
        realm,
        "realm_message_edit_history_visibility_policy",
        settings_config.message_edit_history_visibility_policy_values.always.code,
    );
    override(realm, "realm_message_content_delete_limit_seconds", null);
    override(realm, "realm_enable_read_receipts", true);
    override(realm, "realm_move_messages_within_stream_limit_seconds", null);
}

// Test init function
function test(label, f) {
    run_test(label, (helpers) => {
        // Stubs for calculate_timestamp_widths()
        $("<div>").width = noop;
        $("<div>").remove = noop;

        // Clear stuff for testing environment
        add_initialize_users();
        message_lists.initialize();
        f(helpers);
    });
}

// Test functions
test("my_message_all_actions", ({override}) => {
    // Set page parameters.
    set_page_params_no_edit_restrictions({override});
    override(realm, "realm_can_delete_any_message_group", everyone.id);
    override(realm, "realm_can_delete_own_message_group", everyone.id);
    override(realm, "realm_can_move_messages_between_topics_group", everyone.id);
    override(current_user, "user_id", me.user_id);
    // Get message with maximum permissions available
    // Initialize message list
    const list = init_message_list();
    message_lists.set_current(list);

    // Assume message has been previously edited.
    // Message is sent by me, and is a stream. I should have all permissions to this message.
    const messages = [
        {
            id: 1,
            type: "stream",
            sender_id: me.user_id,
            is_hidden: false,
            sent_by_me: true,
            locally_echoed: false,
            is_stream: true,
            stream_id: 1,
            unread: false,
            collapsed: false,
            not_spectator: true,
            submessages: [],
            edit_history: [
                {
                    prev_content: "Previous content",
                    prev_stream: 0,
                    prev_topic: "Previous topic",
                },
            ],
        },
    ];

    add_message_with_view(list, messages);
    const response = popover_menus_data.get_actions_popover_content_context(1);
    assert.equal(response.message_id, 1);
    assert.equal(response.stream_id, 1);
    assert.equal(response.editability_menu_item, "translated: Edit message");
    assert.equal(response.move_message_menu_item, "translated: Move messages");
    assert.equal(response.should_display_mark_as_unread, true);
    assert.equal(response.view_source_menu_item, undefined);
    assert.equal(response.should_display_collapse, true);
    assert.equal(response.should_display_uncollapse, false);
    assert.equal(response.should_display_add_reaction_option, true);
    assert.equal(response.conversation_time_url, "conversation_and_time_url");
    assert.equal(response.should_display_delete_option, true);
    assert.equal(response.should_display_read_receipts_option, true);
    assert.equal(response.should_display_quote_message, true);
});

test("not_my_message_view_actions", ({override}) => {
    set_page_params_no_edit_restrictions({override});
    // Get message that is only viewable
    override(realm, "realm_can_delete_any_message_group", everyone.id);
    const list = init_message_list();
    message_lists.set_current(list);

    // Message is sent by somebody else and is a stream with previous history.
    // I should only be able to view this message with no edit/move permissions.
    const messages = [
        {
            id: 1,
            sender_id: mike.user_id,
            is_hidden: false,
            sent_by_me: false,
            locally_echoed: false,
            is_stream: true,
            stream_id: 1,
            collapsed: false,
            unread: false,
            edit_history: [
                {
                    prev_content: "Previous content",
                    prev_stream: 0,
                    prev_topic: "Previous topic",
                },
            ],
        },
    ];

    add_message_with_view(list, messages);

    const response = popover_menus_data.get_actions_popover_content_context(1);

    assert.equal(response.view_source_menu_item, "translated: View original message");
    assert.equal(response.editability_menu_item, undefined);
    assert.equal(response.move_message_menu_item, undefined);
});

test("not_my_message_view_source_and_move", ({override}) => {
    set_page_params_no_edit_restrictions({override});
    override(realm, "realm_can_delete_any_message_group", everyone.id);
    override(realm, "realm_can_move_messages_between_topics_group", everyone.id);
    override(current_user, "user_id", me.user_id);
    // Get message that is movable with viewable source

    const list = init_message_list();
    message_lists.set_current(list);

    // Message tests edge case where message it sent by someone else.
    // Message is movable, however--I should have only view permissions with the exception of moving the message.
    const messages = [
        {
            id: 1,
            sender_id: mike.user_id,
            is_hidden: false,
            sent_by_me: false,
            locally_echoed: false,
            is_stream: true,
            stream_id: 1,
            type: "stream",
            unread: false,
            collapsed: false,
            topic: "New topic",
            edit_history: [
                {
                    prev_content: "Previous content",
                    prev_stream: 0,
                    prev_topic: "Previous topic",
                },
            ],
        },
    ];

    add_message_with_view(list, messages);

    const response = popover_menus_data.get_actions_popover_content_context(1);
    assert.equal(response.view_source_menu_item, "translated: View original message");
    assert.equal(response.editability_menu_item, undefined);
    assert.equal(response.move_message_menu_item, "translated: Move messages");
});
```

--------------------------------------------------------------------------------

````
