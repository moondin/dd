---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 782
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 782 of 1290)

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

---[FILE: compose_actions.test.cjs]---
Location: zulip-main/web/tests/compose_actions.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_banners} = require("./lib/compose_banner.cjs");
const {make_user_group} = require("./lib/example_group.cjs");
const {make_realm} = require("./lib/example_realm.cjs");
const {make_stream} = require("./lib/example_stream.cjs");
const {make_user} = require("./lib/example_user.cjs");
const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const {set_current_user} = zrequire("state_data");
const user_groups = zrequire("user_groups");

const nobody = make_user_group({
    name: "role:nobody",
    id: 1,
    members: new Set(),
    is_system_group: true,
    direct_subgroup_ids: new Set(),
});
const everyone = make_user_group({
    name: "role:everyone",
    id: 2,
    members: new Set([30]),
    is_system_group: true,
    direct_subgroup_ids: new Set(),
});
user_groups.initialize({realm_user_groups: [nobody, everyone]});

set_global("document", {
    to_$: () => $("document-stub"),
});

set_global("requestAnimationFrame", (func) => func());

const autosize = noop;
autosize.update = noop;
mock_esm("autosize", {default: autosize});
mock_esm("../src/compose_tooltips", {initialize_compose_tooltips: noop});

const channel = mock_esm("../src/channel");
const compose_fade = mock_esm("../src/compose_fade", {
    clear_compose: noop,
    set_focused_recipient: noop,
    update_all: noop,
});
const compose_pm_pill = mock_esm("../src/compose_pm_pill");
const compose_ui = mock_esm("../src/compose_ui", {
    autosize_textarea: noop,
    is_expanded: () => false,
    set_focus: noop,
    compute_placeholder_text: noop,
});
const hash_util = mock_esm("../src/hash_util");
const narrow_state = mock_esm("../src/narrow_state", {
    set_compose_defaults: noop,
    filter: noop,
});

mock_esm("../src/reload_state", {
    is_in_progress: () => false,
});
mock_esm("../src/drafts", {
    update_draft: noop,
    update_compose_draft_count: noop,
    get_last_restorable_draft_based_on_compose_state: noop,
    set_compose_draft_id: noop,
});
mock_esm("../src/unread_ops", {
    notify_server_message_read: noop,
});
mock_esm("../src/message_lists", {
    current: {
        can_mark_messages_read: () => true,
    },
});
mock_esm("../src/resize", {
    reset_compose_message_max_height: noop,
});
mock_esm("../src/popovers", {
    hide_all: noop,
});
mock_esm("../src/saved_snippets_ui", {
    setup_saved_snippets_dropdown_widget_if_needed: noop,
});

const people = zrequire("people");

const compose_state = zrequire("compose_state");
const compose_actions = zrequire("compose_actions");
const compose_reply = zrequire("compose_reply");
const compose_validate = zrequire("compose_validate");
const message_lists = zrequire("message_lists");
const stream_data = zrequire("stream_data");
const compose_recipient = zrequire("compose_recipient");
const {set_realm} = zrequire("state_data");

const realm = make_realm({
    realm_topics_policy: "disable_empty_topic",
});
set_realm(realm);

const start = compose_actions.start;
const cancel = compose_actions.cancel;
const respond_to_message = compose_reply.respond_to_message;
const reply_with_mention = compose_reply.reply_with_mention;
const quote_message = compose_reply.quote_message;

function assert_visible(sel) {
    assert.ok($(sel).visible());
}

function assert_hidden(sel) {
    assert.ok(!$(sel).visible());
}

function override_private_message_recipient_ids({override}) {
    let recipient_emails;
    let recipient_user_ids;
    override(compose_pm_pill, "set_from_user_ids", (value) => {
        recipient_user_ids = value;
        recipient_emails = value.map((user_id) => people.get_by_user_id(user_id).email).join(",");
    });
    override(compose_pm_pill, "get_emails", () => recipient_emails, {unused: false});
    override(compose_pm_pill, "get_user_ids", () => recipient_user_ids, {unused: false});
}

function test(label, f) {
    run_test(label, (helpers) => {
        // We don't test the css calls; we just skip over them.
        $("#compose").css = noop;
        $(".new_message_textarea").css = noop;

        people.init();
        compose_state.set_message_type(undefined);
        f(helpers);
    });
}

function stub_message_row($textarea) {
    const $stub = $.create("message_row_stub");
    $textarea.closest = (selector) => {
        assert.equal(selector, ".message_row");
        $stub.length = 0;
        return $stub;
    };
}

test("initial_state", () => {
    assert.equal(compose_state.composing(), false);
    assert.equal(compose_state.get_message_type(), undefined);
    assert.equal(compose_state.has_message_content(), false);
});

test("start", ({override, override_rewire, mock_template}) => {
    mock_banners();
    override_private_message_recipient_ids({override});
    override_rewire(compose_actions, "autosize_message_content", noop);
    override_rewire(compose_actions, "expand_compose_box", noop);
    override_rewire(compose_actions, "complete_starting_tasks", noop);
    override_rewire(compose_actions, "blur_compose_inputs", noop);
    override_rewire(compose_actions, "clear_textarea", noop);
    const $elem = $("#send_message_form");
    const $textarea = $("textarea#compose-textarea");
    const $indicator = $("#compose-limit-indicator");
    stub_message_row($textarea);
    $elem.set_find_results(".message-textarea", $textarea);
    $elem.set_find_results(".message-limit-indicator", $indicator);

    override_rewire(compose_recipient, "on_compose_select_recipient_update", noop);
    override_rewire(compose_validate, "update_posting_policy_banner_post_validation", noop);
    override_rewire(compose_recipient, "update_recipient_row_attention_level", noop);
    override_rewire(stream_data, "can_post_messages_in_stream", () => true);
    override_rewire(stream_data, "can_create_new_topics_in_stream", () => true);
    mock_template("inline_decorated_channel_name.hbs", false, noop);

    let compose_defaults;
    override(narrow_state, "set_compose_defaults", () => compose_defaults);
    override(
        compose_ui,
        "insert_and_scroll_into_view",
        (content, $textarea, replace_all, replace_all_without_undo_support) => {
            $textarea.val(content);
            assert.ok(!replace_all);
            assert.ok(replace_all_without_undo_support);
        },
    );

    // Start stream message
    compose_defaults = {
        stream_id: undefined,
        topic: "topic1",
    };

    let opts = {
        message_type: "stream",
    };
    start(opts);

    assert_visible("#compose_recipient_box");
    assert_hidden("#compose-direct-recipient");

    assert.equal(compose_state.stream_name(), "");
    assert.equal(compose_state.topic(), "topic1");
    assert.equal(compose_state.get_message_type(), "stream");
    assert.ok(compose_state.composing());

    // Autofill stream field for single subscription
    const denmark = make_stream({
        color: "blue",
        name: "Denmark",
        stream_id: 1,
    });
    stream_data.add_sub_for_tests(denmark);

    compose_defaults = {
        trigger: "clear topic button",
    };

    opts = {
        message_type: "stream",
    };
    start(opts);
    assert.equal(compose_state.stream_name(), "Denmark");
    assert.equal(compose_state.topic(), "");

    compose_defaults = {
        trigger: "compose_hotkey",
    };

    opts = {
        message_type: "stream",
    };
    start(opts);
    assert.equal(compose_state.stream_name(), "Denmark");
    assert.equal(compose_state.topic(), "");

    const social = make_stream({
        color: "red",
        name: "social",
        stream_id: 2,
    });
    stream_data.add_sub_for_tests(social);

    compose_state.set_stream_id("");
    // More than 1 subscription, do not autofill
    opts = {
        message_type: "stream",
    };
    start(opts);
    assert.equal(compose_state.stream_name(), "");
    assert.equal(compose_state.topic(), "");
    stream_data.clear_subscriptions();

    const user1 = make_user();
    people._add_user(user1);
    const me = make_user();
    set_current_user(me);

    // Start direct message
    compose_defaults = {
        private_message_recipient_ids: [user1.user_id],
    };

    opts = {
        message_type: "private",
        content: "hello",
    };

    start(opts);

    assert_hidden("input#stream_message_recipient_topic");
    assert_visible("#compose-direct-recipient");

    assert.deepEqual(compose_state.private_message_recipient_ids(), [user1.user_id]);
    assert.equal($("textarea#compose-textarea").val(), "hello");
    assert.equal(compose_state.get_message_type(), "private");
    assert.ok(compose_state.composing());

    // Triggered by new direct message
    opts = {
        message_type: "private",
        trigger: "new direct message",
    };

    start(opts);

    assert.deepEqual(compose_state.private_message_recipient_ids(), []);
    assert.equal(compose_state.get_message_type(), "private");
    assert.ok(compose_state.composing());

    // Cancel compose.
    let pill_cleared;
    compose_pm_pill.clear = () => {
        pill_cleared = true;
    };

    let abort_xhr_called = false;
    compose_actions.register_compose_cancel_hook(() => {
        abort_xhr_called = true;
    });
    $("textarea#compose-textarea").set_height(50);

    assert_hidden("#compose_controls");
    cancel();
    assert.ok(abort_xhr_called);
    assert.ok(pill_cleared);
    assert_visible("#compose_controls");
    assert_hidden("#compose-direct-recipient");
    assert.ok(!compose_state.composing());
});

test("respond_to_message", ({override, override_rewire, mock_template}) => {
    mock_banners();
    override_rewire(compose_actions, "complete_starting_tasks", noop);
    override_rewire(compose_actions, "clear_textarea", noop);
    const $elem = $("#send_message_form");
    const $textarea = $("textarea#compose-textarea");
    const $indicator = $("#compose-limit-indicator");
    stub_message_row($textarea);
    $elem.set_find_results(".message-textarea", $textarea);
    $elem.set_find_results(".message-limit-indicator", $indicator);

    override_rewire(compose_recipient, "on_compose_select_recipient_update", noop);
    override_rewire(compose_validate, "update_posting_policy_banner_post_validation", noop);
    override_rewire(compose_recipient, "update_recipient_row_attention_level", noop);
    override_private_message_recipient_ids({override});
    mock_template("inline_decorated_channel_name.hbs", false, noop);

    override(realm, "realm_direct_message_permission_group", nobody.id);
    override(realm, "realm_direct_message_initiator_group", everyone.id);

    override_rewire(stream_data, "can_post_messages_in_stream", () => true);

    // Test direct message
    const person = make_user({
        user_id: 22,
        email: "alice@example.com",
        full_name: "Alice",
    });
    people.add_active_user(person);

    let msg = {
        type: "private",
        sender_id: person.user_id,
    };
    override(message_lists.current, "get", (id) => (id === 100 ? msg : undefined));

    let opts = {
        reply_type: "personal",
        message_id: 100,
    };

    respond_to_message(opts);
    assert.deepEqual(compose_state.private_message_recipient_ids(), [person.user_id]);
    assert.equal(compose_state.private_message_recipient_emails(), "alice@example.com");

    // Test stream
    const denmark = make_stream({
        color: "blue",
        name: "Denmark",
        stream_id: 1,
    });
    stream_data.add_sub_for_tests(denmark);

    msg = {
        type: "stream",
        stream_id: denmark.stream_id,
        topic: "python",
    };
    override(message_lists.current, "selected_message", () => msg);

    opts = {};

    respond_to_message(opts);
    assert.equal(compose_state.stream_name(), "Denmark");
});

test("reply_with_mention", ({override, override_rewire, mock_template}) => {
    mock_banners();
    compose_state.set_message_type("stream");
    override_rewire(compose_recipient, "on_compose_select_recipient_update", noop);
    override_rewire(compose_recipient, "update_recipient_row_attention_level", noop);
    override_rewire(compose_actions, "complete_starting_tasks", noop);
    override_rewire(compose_actions, "clear_textarea", noop);
    const $elem = $("#send_message_form");
    const $textarea = $("textarea#compose-textarea");
    const $indicator = $("#compose-limit-indicator");
    stub_message_row($textarea);
    $elem.set_find_results(".message-textarea", $textarea);
    $elem.set_find_results(".message-limit-indicator", $indicator);

    override_private_message_recipient_ids({override});
    mock_template("inline_decorated_channel_name.hbs", false, noop);

    override_rewire(stream_data, "can_post_messages_in_stream", () => true);

    const denmark = make_stream({
        color: "blue",
        name: "Denmark",
        stream_id: 1,
    });
    stream_data.add_sub_for_tests(denmark);

    const msg = {
        type: "stream",
        stream_id: denmark.stream_id,
        topic: "python",
        sender_full_name: "Bob Roberts",
        sender_id: 40,
    };
    override(message_lists.current, "selected_message", () => msg);

    let syntax_to_insert;
    override(compose_ui, "insert_syntax_and_focus", (syntax) => {
        syntax_to_insert = syntax;
    });

    const opts = {};

    reply_with_mention(opts);
    assert.equal(compose_state.stream_name(), "Denmark");
    assert.equal(syntax_to_insert, "@**Bob Roberts**");

    // Test for extended mention syntax
    const bob_1 = {
        user_id: 30,
        email: "bob1@example.com",
        full_name: "Bob Roberts",
    };
    people.add_active_user(bob_1);
    const bob_2 = {
        user_id: 40,
        email: "bob2@example.com",
        full_name: "Bob Roberts",
    };
    people.add_active_user(bob_2);

    reply_with_mention(opts);
    assert.equal(compose_state.stream_name(), "Denmark");
    assert.equal(syntax_to_insert, "@**Bob Roberts|40**");
});

test("quote_message", ({disallow, override, override_rewire}) => {
    override_rewire(compose_recipient, "on_compose_select_recipient_update", noop);
    override_rewire(compose_recipient, "update_recipient_row_attention_level", noop);
    override_rewire(compose_reply, "selection_within_message_id", () => undefined);
    const $elem = $("#send_message_form");
    const $textarea = $("textarea#compose-textarea");
    const $indicator = $("#compose-limit-indicator");
    stub_message_row($textarea);
    $elem.set_find_results(".message-textarea", $textarea);
    $elem.set_find_results(".message-limit-indicator", $indicator);

    override(realm, "realm_direct_message_permission_group", nobody.id);
    override(realm, "realm_direct_message_initiator_group", everyone.id);

    mock_banners();
    compose_state.set_message_type("stream");
    const steve = {
        user_id: 90,
        email: "steve@example.com",
        full_name: "Steve Stephenson",
    };
    people.add_active_user(steve);

    override_rewire(compose_actions, "complete_starting_tasks", noop);
    override_rewire(compose_actions, "clear_textarea", noop);
    override_private_message_recipient_ids({override});

    let selected_message;
    override(message_lists.current, "get", (id) => (id === 100 ? selected_message : undefined));

    let expected_replacement;
    let replaced;
    override(compose_ui, "replace_syntax", (syntax, replacement) => {
        assert.equal(syntax, "translated: [Quoting…]");
        assert.equal(replacement, expected_replacement);
        replaced = true;
    });

    const denmark_stream = make_stream({
        subscribed: false,
        name: "Denmark",
        stream_id: 20,
    });

    selected_message = {
        type: "stream",
        stream_id: denmark_stream.stream_id,
        topic: "python",
        sender_full_name: "Steve Stephenson",
        sender_id: 90,
    };
    hash_util.by_conversation_and_time_url = () =>
        "https://chat.zulip.org/#narrow/channel/92-learning/topic/Tornado";

    let success_function;
    override(channel, "get", (opts) => {
        success_function = opts.success;
    });

    override(compose_ui, "insert_syntax_and_focus", (syntax, _$textarea, mode) => {
        assert.equal(syntax, "translated: [Quoting…]");
        assert.equal(mode, "block");
    });

    let opts = {
        reply_type: "personal",
        message_id: 100,
    };

    override_rewire(compose_state, "topic", (topic) => {
        if (opts.forward_message) {
            assert.equal(topic, "");
        }
    });

    $("textarea#compose-textarea").caret = noop;
    $("textarea#compose-textarea").attr("id", "compose-textarea");

    replaced = false;
    expected_replacement =
        "translated: @_**Steve Stephenson|90** [said](https://chat.zulip.org/#narrow/channel/92-learning/topic/Tornado):\n```quote\nTesting.\n```";

    quote_message(opts);

    success_function({
        raw_content: "Testing.",
    });
    assert.ok(replaced);

    opts = {
        reply_type: "personal",
        message_id: 100,
        forward_message: true,
    };
    replaced = false;

    override(compose_ui, "insert_and_scroll_into_view", noop);

    quote_message(opts);

    success_function({
        raw_content: "Testing.",
    });
    assert.ok(replaced);

    opts = {
        reply_type: "personal",
        message_id: 100,
    };

    selected_message = {
        type: "stream",
        stream_id: denmark_stream.stream_id,
        topic: "test",
        sender_full_name: "Steve Stephenson",
        sender_id: 90,
        raw_content: "Testing.",
    };

    replaced = false;
    disallow(channel, "get");
    quote_message(opts);
    assert.ok(replaced);

    opts = {
        reply_type: "personal",
        message_id: 100,
        forward_message: true,
    };
    replaced = false;
    quote_message(opts);
    assert.ok(replaced);

    opts = {
        reply_type: "personal",
    };
    override(message_lists.current, "selected_id", () => 100);
    override(message_lists.current, "selected_message", () => selected_message);

    selected_message = {
        type: "stream",
        stream_id: denmark_stream.stream_id,
        topic: "test",
        sender_full_name: "Steve Stephenson",
        sender_id: 90,
        raw_content: "```\nmultiline code block\nshoudln't mess with quotes\n```",
    };

    replaced = false;
    expected_replacement =
        "translated: @_**Steve Stephenson|90** [said](https://chat.zulip.org/#narrow/channel/92-learning/topic/Tornado):\n````quote\n```\nmultiline code block\nshoudln't mess with quotes\n```\n````";
    quote_message(opts);
    assert.ok(replaced);

    opts = {
        reply_type: "personal",
        forward_message: true,
    };
    replaced = false;
    quote_message(opts);
    assert.ok(replaced);
});

test("focus_in_empty_compose", () => {
    document.activeElement = {id: "compose-textarea"};
    compose_state.set_message_type("stream");
    $("textarea#compose-textarea").val("");
    assert.ok(compose_state.focus_in_empty_compose());

    compose_state.set_message_type(undefined);
    assert.ok(!compose_state.focus_in_empty_compose());

    $("textarea#compose-textarea").val("foo");
    assert.ok(!compose_state.focus_in_empty_compose());

    $("textarea#compose-textarea").trigger("blur");
    assert.ok(!compose_state.focus_in_empty_compose());
});

test("on_narrow", ({override, override_rewire}) => {
    let narrowed_by_topic_reply;
    override(narrow_state, "narrowed_by_topic_reply", () => narrowed_by_topic_reply);

    let narrowed_by_pm_reply;
    override(narrow_state, "narrowed_by_pm_reply", () => narrowed_by_pm_reply);

    const steve = {
        user_id: 90,
        email: "steve@example.com",
        full_name: "Steve Stephenson",
        is_bot: false,
    };
    people.add_active_user(steve);

    const bot = {
        user_id: 91,
        email: "bot@example.com",
        full_name: "Steve's bot",
        is_bot: true,
    };
    people.add_active_user(bot);

    user_groups.initialize({realm_user_groups: [nobody, everyone]});
    let cancel_called = false;
    override_rewire(compose_actions, "cancel", () => {
        cancel_called = true;
    });
    compose_actions.on_narrow({
        force_close: true,
    });
    assert.ok(cancel_called);

    let on_topic_narrow_called = false;
    override_rewire(compose_actions, "on_topic_narrow", () => {
        on_topic_narrow_called = true;
    });
    narrowed_by_topic_reply = true;
    compose_actions.on_narrow({
        force_close: false,
    });
    assert.ok(on_topic_narrow_called);

    let update_message_list_called = false;
    narrowed_by_topic_reply = false;
    compose_fade.update_message_list = () => {
        update_message_list_called = true;
    };
    compose_state.message_content("foo");
    compose_actions.on_narrow({
        force_close: false,
    });
    assert.ok(update_message_list_called);

    compose_state.message_content("");
    let start_called = false;
    override_rewire(compose_actions, "start", () => {
        start_called = true;
    });
    narrowed_by_pm_reply = true;
    override(realm, "realm_direct_message_permission_group", nobody.id);
    override(realm, "realm_direct_message_initiator_group", everyone.id);
    let compose_defaults;
    override(narrow_state, "set_compose_defaults", () => compose_defaults);
    compose_defaults = {
        private_message_recipient_ids: [steve.user_id],
    };
    compose_actions.on_narrow({
        force_close: false,
        trigger: "not-search",
    });
    assert.ok(!start_called);

    compose_defaults = {
        private_message_recipient_ids: [bot.user_id],
    };
    compose_actions.on_narrow({
        force_close: false,
        trigger: "not-search",
    });
    assert.ok(start_called);

    start_called = false;
    compose_defaults = {
        private_message_recipient_ids: [],
    };
    compose_actions.on_narrow({
        force_close: false,
        trigger: "search",
    });
    assert.ok(!start_called);

    narrowed_by_pm_reply = false;
    cancel_called = false;
    compose_actions.on_narrow({
        force_close: false,
    });
    assert.ok(cancel_called);
});
```

--------------------------------------------------------------------------------

---[FILE: compose_closed_ui.test.cjs]---
Location: zulip-main/web/tests/compose_closed_ui.test.cjs

```text
"use strict";

// Setup
const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

// Mocking and stubbing things
set_global("document", "document-stub");
const message_lists = mock_esm("../src/message_lists");
const recent_view_util = mock_esm("../src/recent_view_util");
function MessageListView() {
    return {
        maybe_rerender: noop,
        append: noop,
        prepend: noop,
        is_current_message_list: () => true,
    };
}
mock_esm("../src/message_list_view", {
    MessageListView,
});
mock_esm("../src/settings_data", {
    user_can_access_all_other_users: () => true,
});

const stream_data = zrequire("stream_data");
// Code we're actually using/testing
const compose_closed_ui = zrequire("compose_closed_ui");
const people = zrequire("people");
const {Filter} = zrequire("filter");
const {MessageList} = zrequire("message_list");
const {MessageListData} = zrequire("message_list_data");
const {set_current_user, set_realm} = zrequire("state_data");

const current_user = {
    email: "alice@zulip.com",
    user_id: 1,
    full_name: "Alice",
};
set_current_user(current_user);
people.add_active_user(current_user);
people.add_active_user({
    email: "bob@zulip.com",
    user_id: 2,
    full_name: "Bob",
});
people.add_active_user({
    email: "zoe@zulip.com",
    user_id: 3,
    full_name: "Zoe",
});
people.initialize_current_user(1);

const REALM_EMPTY_TOPIC_DISPLAY_NAME = "general chat";
set_realm(make_realm({realm_empty_topic_display_name: REALM_EMPTY_TOPIC_DISPLAY_NAME}));

// Helper test function
function test_reply_label(expected_label) {
    const label = $("#left_bar_compose_reply_button_big").html();
    const prepend_text_length = "Message ".length;
    assert.equal(
        label.slice(prepend_text_length),
        expected_label,
        "'" + label.slice(prepend_text_length),
        Number("' did not match '") + expected_label + "'",
    );
}

run_test("reply_label", () => {
    // Mocking up a test message list
    const filter = new Filter([]);
    const list = new MessageList({
        data: new MessageListData({
            excludes_muted_topics: false,
            filter,
        }),
    });
    message_lists.current = list;
    const stream_one = {
        subscribed: true,
        name: "first_stream",
        stream_id: 1,
    };
    stream_data.add_sub_for_tests(stream_one);
    const stream_two = {
        subscribed: true,
        name: "second_stream",
        stream_id: 2,
    };
    stream_data.add_sub_for_tests(stream_two);
    list.add_messages(
        [
            {
                id: 0,
                is_stream: true,
                is_private: false,
                stream_id: stream_one.stream_id,
                topic: "first_topic",
                sent_by_me: false,
                sender_id: 2,
            },
            {
                id: 1,
                is_stream: true,
                is_private: false,
                stream_id: stream_one.stream_id,
                topic: "second_topic",
                sent_by_me: false,
                sender_id: 2,
            },
            {
                id: 2,
                is_stream: true,
                is_private: false,
                stream_id: stream_two.stream_id,
                topic: "third_topic",
                sent_by_me: false,
                sender_id: 2,
            },
            {
                id: 3,
                is_stream: true,
                is_private: false,
                stream_id: stream_two.stream_id,
                topic: "second_topic",
                sent_by_me: false,
                sender_id: 2,
            },
            {
                id: 4,
                is_stream: false,
                is_private: true,
                to_user_ids: "2",
                sent_by_me: false,
                sender_id: 2,
            },
            {
                id: 5,
                is_stream: false,
                is_private: true,
                to_user_ids: "2,3",
                sent_by_me: false,
                sender_id: 2,
            },
            {
                id: 6,
                is_stream: true,
                is_private: false,
                stream_id: stream_two.stream_id,
                topic: "",
                sent_by_me: false,
                sender_id: 2,
            },
        ],
        {},
        true,
    );

    const expected_labels = [
        "#first_stream &gt; first_topic",
        "#first_stream &gt; second_topic",
        "#second_stream &gt; third_topic",
        "#second_stream &gt; second_topic",
        "Bob",
        "Bob, Zoe",
    ];

    // Initialize the code we're testing.
    compose_closed_ui.initialize();

    // Run the tests!
    let first = true;
    for (const expected_label of expected_labels) {
        if (first) {
            list.select_id(list.first().id);
            first = false;
        } else {
            list.select_id(list.next());
        }
        test_reply_label(expected_label);
    }

    // Separately test for empty string topic as the topic is specially decorated here.
    list.select_id(list.next());
    const label_html = $("#left_bar_compose_reply_button_big").html();
    assert.equal(
        `Message #second_stream &gt; <span class="empty-topic-display">translated: ${REALM_EMPTY_TOPIC_DISPLAY_NAME}</span>`,
        label_html,
    );
});

run_test("empty_narrow", () => {
    message_lists.current.visibly_empty = () => true;
    compose_closed_ui.update_recipient_text_for_reply_button();
    const label = $("#left_bar_compose_reply_button_big").text();
    assert.equal(label, "translated: Compose message");
});

run_test("test_non_message_list_input", () => {
    message_lists.current = undefined;
    recent_view_util.is_visible = () => true;
    const stream = {
        subscribed: true,
        name: "stream test",
        stream_id: 10,
    };
    stream_data.add_sub_for_tests(stream);

    // Channel and topic row.
    compose_closed_ui.update_recipient_text_for_reply_button({
        stream_id: stream.stream_id,
        topic: "topic test",
    });
    test_reply_label("#stream test &gt; topic test");

    // Direct message conversation with current user row.
    compose_closed_ui.update_recipient_text_for_reply_button({
        user_ids: [current_user.user_id],
    });
    let label = $("#left_bar_compose_reply_button_big").html();
    assert.equal(label, "Write yourself a note");

    // Invalid data for a the reply button text.
    compose_closed_ui.update_recipient_text_for_reply_button({
        invalid_field: "something unexpected",
    });
    label = $("#left_bar_compose_reply_button_big").text();
    assert.equal(label, "translated: Compose message");
});
```

--------------------------------------------------------------------------------

---[FILE: compose_fade.test.cjs]---
Location: zulip-main/web/tests/compose_fade.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_jquery, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

mock_jquery((selector) => {
    switch (selector) {
        case "input#stream_message_recipient_topic":
            return {
                val() {
                    return "lunch";
                },
            };
        /* istanbul ignore next */
        default:
            throw new Error(`Unknown selector ${selector}`);
    }
});

const stream_data = zrequire("stream_data");
const peer_data = zrequire("peer_data");
const people = zrequire("people");
const compose_fade = zrequire("compose_fade");
const compose_fade_helper = zrequire("compose_fade_helper");
const compose_state = zrequire("compose_state");
const {set_realm} = zrequire("state_data");

const realm = make_realm();
set_realm(realm);

const me = {
    email: "me@example.com",
    user_id: 30,
    full_name: "Me Myself",
};

const alice = {
    email: "alice@example.com",
    user_id: 31,
    full_name: "Alice",
};

const bob = {
    email: "bob@example.com",
    user_id: 32,
    full_name: "Bob",
};

people.add_active_user(me);
people.initialize_current_user(me.user_id);

people.add_active_user(alice);
people.add_active_user(bob);

run_test("set_focused_recipient", () => {
    const sub = {
        stream_id: 101,
        name: "social",
        subscribed: true,
    };

    stream_data.clear_subscriptions();
    stream_data.add_sub_for_tests(sub);
    compose_state.set_stream_id(sub.stream_id);
    peer_data.set_subscribers(sub.stream_id, [me.user_id, alice.user_id]);
    compose_fade.set_focused_recipient("stream");

    const good_msg = {
        type: "stream",
        stream_id: 101,
        topic: "lunch",
    };
    const bad_msg = {
        type: "stream",
        stream_id: 999,
        topic: "lunch",
    };
    assert.ok(!compose_fade_helper.should_fade_message(good_msg));
    assert.ok(compose_fade_helper.should_fade_message(bad_msg));
});

run_test("want_normal_display", ({override}) => {
    const stream_id = 110;
    const sub = {
        stream_id,
        name: "display testing",
        subscribed: true,
    };

    stream_data.clear_subscriptions();

    // No focused recipient.
    compose_fade_helper.set_focused_recipient(undefined);
    assert.ok(compose_fade_helper.want_normal_display());

    // Focused recipient is a sub that doesn't exist.
    compose_fade_helper.set_focused_recipient({
        type: "stream",
        stream_id,
        topic: "",
    });
    assert.ok(compose_fade_helper.want_normal_display());

    // Focused recipient is a valid stream with no topic set
    // when topics are mandatory
    override(realm, "realm_topics_policy", "disable_empty_topic");
    stream_data.add_sub_for_tests(sub);
    assert.ok(compose_fade_helper.want_normal_display());

    // Focused recipient is a valid stream with no topic set
    // when topics are not mandatory. Focused to input box.
    override(realm, "realm_topics_policy", "allow_empty_topic");
    assert.ok(compose_fade_helper.want_normal_display());

    // If we're focused to a topic, then we do want to fade.
    compose_fade_helper.set_focused_recipient({
        type: "stream",
        stream_id,
        topic: "lunch",
    });
    assert.ok(!compose_fade_helper.want_normal_display());

    // Private message with no recipient.
    compose_fade_helper.set_focused_recipient({
        type: "private",
        reply_to: "",
    });
    assert.ok(compose_fade_helper.want_normal_display());

    // Private message with a recipient.
    compose_fade_helper.set_focused_recipient({
        type: "private",
        reply_to: "hello@zulip.com",
    });
    assert.ok(!compose_fade_helper.want_normal_display());
});
```

--------------------------------------------------------------------------------

````
