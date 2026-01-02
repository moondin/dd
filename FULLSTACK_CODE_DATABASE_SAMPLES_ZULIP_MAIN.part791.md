---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 791
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 791 of 1290)

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

---[FILE: example5.test.cjs]---
Location: zulip-main/web/tests/example5.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_user} = require("./lib/example_user.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");

/*
   Our test from an earlier example verifies that the update events
   leads to a name change inside the people object, but it obviously
   kind of glosses over the other interactions.

   We can go a step further and verify the sequence of operations that
   happen during an event.  This concept is called "stubbing", and you
   can find libraries to help do stubbing.  Here we will just build our
   own lightweight stubbing system, which is almost trivially easy to
   do in a language like JavaScript.

*/

// First we tell the compiler to skip certain modules and just
// replace them with {}.
const direct_message_group_data = mock_esm("../src/direct_message_group_data");
const message_lists = mock_esm("../src/message_lists");
const message_notifications = mock_esm("../src/message_notifications");
const pm_list = mock_esm("../src/pm_list");
const stream_list = mock_esm("../src/stream_list");
const unread_ui = mock_esm("../src/unread_ui");
const activity = mock_esm("../src/activity");

mock_esm("../src/electron_bridge", {
    electron_bridge: {},
});

let added_message = false;
message_lists.current = {
    data: {
        filter: {
            can_apply_locally() {
                return true;
            },
        },
    },
    add_messages() {
        added_message = true;
    },
};
message_lists.all_rendered_message_lists = () => [message_lists.current];
message_lists.non_rendered_data = () => [];

// And we will also test some real code, of course.
const message_events = zrequire("message_events");
const message_store = zrequire("message_store");
const people = zrequire("people");
const {initialize_user_settings} = zrequire("user_settings");

initialize_user_settings({user_settings: {}});

const isaac = make_user({
    email: "isaac@example.com",
    user_id: 30,
    full_name: "Isaac Newton",
});
people.add_active_user(isaac);

/*
   Next we create a test_helper that will allow us to redirect methods to an
   events array, and we can then later verify that the sequence of side effect
   is as predicted.

   (Note that for now we don't simulate return values nor do we inspect the
   arguments to these functions.  We could easily extend our helper to do more.)

   The forthcoming example is a pretty extreme example, where we are calling a
   pretty high level method that dispatches a lot of its work out to other
   objects.

*/

function test_helper({override}) {
    const events = [];

    return {
        redirect(module, func_name) {
            override(module, func_name, () => {
                events.push([module, func_name]);
            });
        },
        events,
    };
}

run_test("insert_server_message", ({override}) => {
    message_store.clear_for_testing();

    override(pm_list, "update_private_messages", noop);

    const helper = test_helper({override});

    const new_message = {
        sender_id: isaac.user_id,
        id: 1001,
        content: "example content",
        topic: "Foo",
        type: "stream",
        reactions: [],
        avatar_url: `/avatar/${isaac.user_id}`,
        display_recipient: "Bar",
    };

    assert.equal(message_store.get(new_message.id), undefined);

    helper.redirect(direct_message_group_data, "process_loaded_messages");
    helper.redirect(message_notifications, "received_messages");
    helper.redirect(stream_list, "update_streams_sidebar");
    helper.redirect(unread_ui, "update_unread_counts");
    helper.redirect(activity, "set_received_new_messages");

    message_events.insert_new_messages({
        type: "server_message",
        raw_messages: [new_message],
    });

    // Even though we have stubbed a *lot* of code, our
    // tests can still verify the main "narrative" of how
    // the code invokes various objects when a new message
    // comes in:
    assert.deepEqual(helper.events, [
        [direct_message_group_data, "process_loaded_messages"],
        [unread_ui, "update_unread_counts"],
        [activity, "set_received_new_messages"],
        [message_notifications, "received_messages"],
        [stream_list, "update_streams_sidebar"],
    ]);
    assert.ok(added_message);

    // Despite all of our stubbing/mocking, the call to
    // insert_new_messages will have created a very important
    // side effect that we can verify:
    const inserted_message = message_store.get(new_message.id);
    assert.equal(inserted_message.id, new_message.id);
    assert.equal(inserted_message.content, "example content");
});

run_test("insert_local_message", ({override}) => {
    message_store.clear_for_testing();

    override(pm_list, "update_private_messages", noop);

    const helper = test_helper({override});

    const new_message = {
        sender_id: isaac.user_id,
        id: 1001,
        content: "example content",
        topic: "Foo",
        type: "stream",
        reactions: [],
        avatar_url: `/avatar/${isaac.user_id}`,
        display_recipient: "Bar",
        draft_id: 1,
        local_id: "1001.1",
    };

    assert.equal(message_store.get(new_message.id), undefined);

    helper.redirect(direct_message_group_data, "process_loaded_messages");
    helper.redirect(message_notifications, "received_messages");
    helper.redirect(stream_list, "update_streams_sidebar");
    helper.redirect(activity, "set_received_new_messages");

    message_events.insert_new_messages({
        type: "local_message",
        raw_messages: [new_message],
    });

    // Even though we have stubbed a *lot* of code, our
    // tests can still verify the main "narrative" of how
    // the code invokes various objects when a new message
    // comes in:
    assert.deepEqual(helper.events, [
        [direct_message_group_data, "process_loaded_messages"],
        [activity, "set_received_new_messages"],
        [message_notifications, "received_messages"],
        [stream_list, "update_streams_sidebar"],
    ]);
    assert.ok(added_message);

    // Despite all of our stubbing/mocking, the call to
    // insert_new_messages will have created a very important
    // side effect that we can verify:
    const inserted_message = message_store.get(new_message.id);
    assert.equal(inserted_message.id, new_message.id);
    assert.equal(inserted_message.content, "example content");
});
```

--------------------------------------------------------------------------------

---[FILE: example6.test.cjs]---
Location: zulip-main/web/tests/example6.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_stub} = require("./lib/stub.cjs");
const {run_test, noop} = require("./lib/test.cjs");

/*
    The previous example was a bit extreme.  Generally we just
    use the make_stub helper that comes with zjsunit.

    We will step away from the actual Zulip codebase for a
    second and just explore a contrived example.
*/

run_test("explore make_stub", ({override}) => {
    // Let's say you have to test the following code.

    const app = {
        /* istanbul ignore next */
        notify_server_of_deposit(deposit_amount) {
            // simulate difficulty
            throw new Error(`We cannot report this value without wifi: ${deposit_amount}`);
        },

        /* istanbul ignore next */
        pop_up_fancy_confirmation_screen(deposit_amount, label) {
            // simulate difficulty
            throw new Error(`We cannot make a ${label} dialog for amount ${deposit_amount}`);
        },
    };

    let balance = 40;

    function deposit_paycheck(paycheck_amount) {
        balance += paycheck_amount;
        app.notify_server_of_deposit(paycheck_amount);
        app.pop_up_fancy_confirmation_screen(paycheck_amount, "paycheck");
    }

    // Our deposit_paycheck should be easy to unit test for its
    // core functionality (updating your balance), but the side
    // effects get in the way.  We have to override them to do
    // the simple test here.

    override(app, "notify_server_of_deposit", noop);
    override(app, "pop_up_fancy_confirmation_screen", noop);
    deposit_paycheck(10);
    assert.equal(balance, 50);

    // But we can do a little better here.  Even though
    // the two side-effect functions are awkward here, we can
    // at least make sure they are invoked correctly.  Let's
    // use stubs.

    const notify_stub = make_stub();
    const pop_up_stub = make_stub();

    // This time we'll just use our override helper to connect the
    // stubs.
    override(app, "notify_server_of_deposit", notify_stub.f);
    override(app, "pop_up_fancy_confirmation_screen", pop_up_stub.f);

    deposit_paycheck(25);
    assert.equal(balance, 75);

    assert.deepEqual(notify_stub.get_args("amount"), {amount: 25});
    assert.deepEqual(pop_up_stub.get_args("amount", "label"), {amount: 25, label: "paycheck"});
});
```

--------------------------------------------------------------------------------

---[FILE: example7.test.cjs]---
Location: zulip-main/web/tests/example7.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_stream} = require("./lib/example_stream.cjs");
const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

/*

   Let's continue to explore how we can test complex
   interactions in the real code.

   When a new message comes in, we update the three major
   panes of the app:

        * left sidebar - stream list
        * middle pane - message view
        * right sidebar - buddy list (aka "activity" list)

    These are reflected by the following calls:

        stream_list.update_streams_sidebar
        message_util.add_new_messages
        activity.process_loaded_messages

    For now, though, let's focus on another side effect
    of processing incoming messages:

        unread_ops.process_visible

    When new messages come in, they are often immediately
    visible to users, so the app will communicate this
    back to the server by calling unread_ops.process_visible.

    In order to unit test this, we don't want to require
    an actual server to be running.  Instead, this example
    will stub many of the "boundaries" to focus on the
    core behavior.

    The two key pieces here are as follows:

        * Use mock_esm to avoid compiling the "real"
          modules that are immaterial to our current
          testing concerns.

        * Use override(...) to simulate how we want
          methods to behave. (Often we want them to
          do nothing at all or return a simple
          value.)
*/

set_global("document", {hasFocus: () => true});

const channel = mock_esm("../src/channel");
const desktop_notifications = mock_esm("../src/desktop_notifications");
const message_lists = mock_esm("../src/message_lists");
const message_viewport = mock_esm("../src/message_viewport");
const unread_ui = mock_esm("../src/unread_ui");

message_lists.current = {view: {}};
message_lists.all_rendered_message_lists = () => [message_lists.current];

const message_store = zrequire("message_store");
const stream_data = zrequire("stream_data");
const unread = zrequire("unread");
const unread_ops = zrequire("unread_ops");

const denmark_stream = make_stream({
    color: "blue",
    name: "Denmark",
    stream_id: 101,
    subscribed: false,
});

run_test("unread_ops", ({override}) => {
    $("#message_feed_container").css = (property) => {
        assert.equal(property, "display");
        return "block";
    };
    stream_data.clear_subscriptions();
    stream_data.add_sub_for_tests(denmark_stream);
    message_store.clear_for_testing();
    unread.declare_bankruptcy();

    const message_id = 50;
    const test_messages = [
        {
            id: message_id,
            type: "stream",
            stream_id: denmark_stream.stream_id,
            topic: "copenhagen",
            unread: true,
        },
    ];

    // Make our test message appear to be unread, so that
    // we then need to subsequently process them as read.
    message_store.update_message_cache({
        type: "server_message",
        message: test_messages[0],
    });
    unread.process_loaded_messages(test_messages);

    // Make our message_viewport appear visible.
    $("#message_feed_container").show();

    // Make our "test" message appear visible.
    override(message_viewport, "bottom_rendered_message_visible", () => true);

    // Set message_lists.current containing messages that can be marked read
    override(message_lists.current, "all_messages", () => test_messages);

    // Ignore these interactions for now:
    override(message_lists.current.view, "show_message_as_read", noop);
    override(desktop_notifications, "close_notification", noop);
    override(unread_ui, "update_unread_counts", noop);
    override(unread_ui, "notify_messages_remain_unread", noop);

    // Set up a way to capture the options passed in to channel.post.
    let channel_post_opts;
    override(channel, "post", (opts) => {
        channel_post_opts = opts;
    });

    let can_mark_messages_read;

    // Set up an override to point to the above var, so we can
    // toggle it easily from within the test (and avoid complicated
    // data setup).
    override(message_lists.current, "can_mark_messages_read", () => can_mark_messages_read);
    override(message_lists.current, "has_unread_messages", () => true);
    override(message_lists.current.view, "is_fetched_end_rendered", () => true);

    // First, test for a message list that cannot read messages.
    can_mark_messages_read = false;
    unread_ops.process_visible();

    assert.deepEqual(channel_post_opts, undefined);

    // Now flip the boolean, and get to the main thing we are testing.
    can_mark_messages_read = true;
    // Don't mark messages as read until all messages in the narrow are fetched and rendered.
    override(message_lists.current.view, "is_fetched_end_rendered", () => false);
    unread_ops.process_visible();
    assert.deepEqual(channel_post_opts, undefined);

    override(message_lists.current.view, "is_fetched_end_rendered", () => true);
    unread_ops.process_visible();

    // The most important side effect of the above call is that
    // we post info to the server.  We can verify that the correct
    // url and parameters are specified:
    assert.deepEqual(channel_post_opts, {
        url: "/json/messages/flags",
        data: {messages: "[50]", op: "add", flag: "read"},
        success: channel_post_opts.success,
    });

    // Simulate a successful post (which also clears the queue
    // in our message_flag code).
    channel_post_opts.success({messages: [message_id]});
});
```

--------------------------------------------------------------------------------

---[FILE: example8.test.cjs]---
Location: zulip-main/web/tests/example8.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_user} = require("./lib/example_user.cjs");
const {make_message_list} = require("./lib/message_list.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

mock_esm("../src/settings_data", {
    user_can_access_all_other_users: () => true,
});

/*
    Until now, we had seen various testing techniques, learned
    how to use helper functions like `mock_esm`, `override` of
    `run_test` etc., but we didn't see how to deal with
    render calls to Handlebars templates. We'll learn that
    in this test.

    The below code tests the rendering of typing notifications which
    is handled by the function `typing_events.render_notifications_for_narrow`.
    The function relies on the `typing_notifications.hbs` template for
    rendering html.
    It is worthwhile to read those (they're short and simple) before proceeding
    as that would help better understand the below test.
*/

const message_lists = zrequire("message_lists");
const people = zrequire("people");
const {set_current_user} = zrequire("state_data");
const typing_data = zrequire("typing_data");
const typing_events = zrequire("typing_events");

const current_user = {};
set_current_user(current_user);

// Let us add a few users to use as typists.
const anna = make_user({
    email: "anna@example.com",
    full_name: "Anna Karenina",
    user_id: 8,
});

const vronsky = make_user({
    email: "vronsky@example.com",
    full_name: "Alexei Vronsky",
    user_id: 9,
});

const levin = make_user({
    email: "levin@example.com",
    full_name: "Konstantin Levin",
    user_id: 10,
});

const kitty = make_user({
    email: "kitty@example.com",
    full_name: "Kitty S",
    user_id: 11,
});

people.add_active_user(anna);
people.add_active_user(vronsky);
people.add_active_user(levin);
people.add_active_user(kitty);

/*
    Notice the `mock_template` in the object passed to `run_test` wrapper below.
    It is pretty similar to `override` we've seen in previous examples but
    mocks a template instead of a js function.

    Just like `override`, `mock_template` lets us run a function taking in
    the arguments passed to the template. Additionally, we can also have
    the rendered html passed as an argument.

    It's usage below will make it more clear to you.
*/
run_test("typing_events.render_notifications_for_narrow", ({override, mock_template}) => {
    // All typists are rendered in `#typing_notifications`.
    const $typing_notifications = $("#typing_notifications");

    // Narrow to a group direct message with four users.
    override(current_user, "user_id", anna.user_id);
    const group = [anna.user_id, vronsky.user_id, levin.user_id, kitty.user_id];
    const conversation_key = typing_data.get_direct_message_conversation_key(group);
    const group_emails = `${anna.email},${vronsky.email},${levin.email},${kitty.email}`;
    message_lists.set_current(make_message_list([{operator: "dm", operand: group_emails}]));

    // Based on typing_events.MAX_USERS_TO_DISPLAY_NAME (which is currently 3),
    // we display either the list of all users typing (if they do not exceed
    // MAX_USERS_TO_DISPLAY_NAME) or 'Several people are typing…'

    // For now, set two of the users as being typists.
    typing_data.add_typist(conversation_key, anna.user_id);
    typing_data.add_typist(conversation_key, vronsky.user_id);

    const two_typing_users_rendered_html = "Two typing users rendered html stub";

    // As you can see below, the first argument of mock_template takes
    // the relative path of the template we want to mock w.r.t web/templates/
    //
    // The second argument takes a boolean determining whether to render html.
    // We mostly set this to `false` and recommend you avoid setting this to `true`
    // unless necessary in situations where you want to test conditionals
    // or something similar. The latter examples below would make that more clear.
    //
    // The third takes a function to run on calling this template. The function
    // gets passed an object(`args` below) containing arguments passed to the template.
    // Additionally, it can also have rendered html passed to it if second argument of
    // mock_template was set to `true`. Any render calls to this template
    // will run the function and return the function's return value.
    //
    // We often use the function in third argument, like below, to make sure
    // the arguments passed to the template are what we expect.
    mock_template("typing_notifications.hbs", false, (args) => {
        assert.deepEqual(args.users, [anna, vronsky]);
        assert.ok(!args.several_users); // Whether to show 'Several people are typing…'
        return two_typing_users_rendered_html;
    });

    typing_events.render_notifications_for_narrow();
    // Make sure #typing_notifications's html content is set to the rendered template
    // which we mocked and gave a custom return value.
    assert.equal($typing_notifications.html(), two_typing_users_rendered_html);

    // Now we'll see how setting the second argument to `true`
    // can be helpful in testing conditionals inside the template.

    // Let's set the mock to just return the rendered html.
    mock_template("typing_notifications.hbs", true, (_args, rendered_html) => rendered_html);

    // Since we only have two(<MAX_USERS_TO_DISPLAY_NAME) typists, both of them
    // should be rendered but not 'Several people are typing…'
    typing_events.render_notifications_for_narrow();
    assert.ok($typing_notifications.html().includes(`${anna.full_name} is typing…`));
    assert.ok($typing_notifications.html().includes(`${vronsky.full_name} is typing…`));
    assert.ok(!$typing_notifications.html().includes("Several people are typing…"));

    // Change to having four typists and verify the rendered html has
    // 'Several people are typing…' but not the list of users.
    typing_data.add_typist(conversation_key, levin.user_id);
    typing_data.add_typist(conversation_key, kitty.user_id);

    typing_events.render_notifications_for_narrow();
    assert.ok($typing_notifications.html().includes("Several people are typing…"));
    assert.ok(!$typing_notifications.html().includes(`${anna.full_name} is typing…`));
    assert.ok(!$typing_notifications.html().includes(`${vronsky.full_name} is typing…`));
    assert.ok(!$typing_notifications.html().includes(`${levin.full_name} is typing…`));
    assert.ok(!$typing_notifications.html().includes(`${kitty.full_name} is typing…`));
});
```

--------------------------------------------------------------------------------

---[FILE: fenced_code.test.cjs]---
Location: zulip-main/web/tests/fenced_code.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const fenced_code = zrequire("fenced_code");

// Check the default behavior of fenced code blocks
// works properly before Markdown is initialized.
run_test("fenced_block_defaults", () => {
    const input = "\n```\nfenced code\n```\n\nand then after\n";
    const expected =
        '\n\n<div class="codehilite"><pre><span></span><code>fenced code\n</code></pre></div>\n\n\nand then after\n\n';
    const output = fenced_code.process_fenced_code(input);
    assert.equal(output, expected);
});

run_test("get_unused_fence", () => {
    assert.equal(fenced_code.get_unused_fence("```js\nsomething\n```"), "`".repeat(4));
    assert.equal(fenced_code.get_unused_fence("````\nsomething\n````"), "`".repeat(5));
    assert.equal(fenced_code.get_unused_fence("```\n````\n``````"), "`".repeat(7));
    assert.equal(fenced_code.get_unused_fence("~~~\nsomething\n~~~"), "`".repeat(3));
    assert.equal(
        fenced_code.get_unused_fence("```code\nterminating fence is indented and longer\n   ````"),
        "`".repeat(5),
    );
    assert.equal(
        fenced_code.get_unused_fence("```code\nterminating fence is extra indented\n    ````"),
        "`".repeat(4),
    );
    let large_testcase = "";
    // ```
    // ````
    // `````
    // ... up to N chars
    // We insert a N + 1 character fence.
    for (let i = 3; i <= 20; i += 1) {
        large_testcase += "`".repeat(i) + "\n";
    }
    assert.equal(fenced_code.get_unused_fence(large_testcase), "`".repeat(21));
});
```

--------------------------------------------------------------------------------

---[FILE: fetch_status.test.cjs]---
Location: zulip-main/web/tests/fetch_status.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

mock_esm("../src/message_feed_loading", {
    hide_loading_older() {},

    show_loading_older() {},
    hide_loading_newer() {},
    show_loading_newer() {},
});

const {FetchStatus} = zrequire("fetch_status");

let fetch_status = new FetchStatus();

function reset() {
    fetch_status = new FetchStatus();
}

function can_load_newer() {
    assert.equal(fetch_status.can_load_newer_messages(), true);
}

function blocked_newer() {
    assert.equal(fetch_status.can_load_newer_messages(), false);
}

function can_load_older() {
    assert.equal(fetch_status.can_load_older_messages(), true);
}

function blocked_older() {
    assert.equal(fetch_status.can_load_older_messages(), false);
}

function has_found_oldest() {
    assert.equal(fetch_status.has_found_oldest(), true);
}

function has_not_found_oldest() {
    assert.equal(fetch_status.has_found_oldest(), false);
}

function has_found_newest() {
    assert.equal(fetch_status.has_found_newest(), true);
}

function has_not_found_newest() {
    assert.equal(fetch_status.has_found_newest(), false);
}

function can_load_history() {
    assert.equal(fetch_status.history_limited(), false);
}

function blocked_history() {
    assert.equal(fetch_status.history_limited(), true);
}

run_test("basics", () => {
    reset();

    fetch_status.start_newer_batch({update_loading_indicator: false});
    fetch_status.start_older_batch({update_loading_indicator: false});

    blocked_newer();
    blocked_older();
    can_load_history();
    has_not_found_oldest();
    has_not_found_newest();

    let data = {
        update_loading_indicator: false,
        found_oldest: true,
        found_newest: true,
        history_limited: true,
    };
    fetch_status.finish_newer_batch([], data);
    fetch_status.finish_older_batch(data);

    has_found_oldest();
    has_found_newest();
    blocked_newer();
    blocked_older();
    blocked_history();

    reset();

    fetch_status.start_newer_batch({update_loading_indicator: true});
    fetch_status.start_older_batch({update_loading_indicator: true});

    blocked_newer();
    blocked_older();
    can_load_history();

    data = {
        update_loading_indicator: false,
        found_oldest: false,
        found_newest: false,
        history_limited: false,
    };
    fetch_status.finish_newer_batch([], data);
    fetch_status.finish_older_batch(data);

    can_load_older();
    can_load_newer();
    can_load_history();

    reset();

    can_load_older();

    fetch_status.start_older_batch({update_loading_indicator: false});

    blocked_older();
    can_load_newer();
    can_load_history();

    fetch_status.finish_older_batch({
        update_loading_indicator: true,
        found_oldest: false,
        history_limited: false,
    });

    can_load_older();
    can_load_newer();
    can_load_history();

    fetch_status.start_older_batch({update_loading_indicator: true});

    blocked_older();
    can_load_newer();
    can_load_history();

    fetch_status.finish_older_batch({
        update_loading_indicator: true,
        found_oldest: true,
        history_limited: true,
    });

    blocked_older();
    can_load_newer();
    blocked_history();

    reset();

    can_load_older();
    can_load_newer();

    fetch_status.start_newer_batch({update_loading_indicator: false});

    can_load_older();
    blocked_newer();

    fetch_status.finish_newer_batch([], {
        update_loading_indicator: true,
        found_newest: false,
    });

    can_load_older();
    can_load_newer();

    fetch_status.start_newer_batch({update_loading_indicator: true});

    can_load_older();
    blocked_newer();

    fetch_status.finish_newer_batch([], {
        update_loading_indicator: true,
        found_newest: true,
    });

    can_load_older();
    blocked_newer();
});
```

--------------------------------------------------------------------------------

````
