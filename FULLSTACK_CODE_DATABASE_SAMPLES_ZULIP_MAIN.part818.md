---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 818
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 818 of 1290)

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

---[FILE: settings_realm_domains.test.cjs]---
Location: zulip-main/web/tests/settings_realm_domains.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const channel = mock_esm("../src/channel");
mock_esm("../src/ui_report", {
    success(msg, elem) {
        elem.val(msg);
    },

    error(msg, _xhr, elem) {
        elem.val(msg);
    },
});

const settings_realm_domains = zrequire("settings_realm_domains");

function test_realms_domain_modal(override, add_realm_domain) {
    const $info = $(".realm_domains_info");

    $("#add-realm-domain-widget").set_find_results(
        ".new-realm-domain",
        $.create("new-realm-domain-stub"),
    );

    $("#add-realm-domain-widget").set_find_results(
        "input.new-realm-domain-allow-subdomains",
        $("<new-realm-domain-allow-subdomains-stub>"),
    );
    $("<new-realm-domain-allow-subdomains-stub>")[0] = {};

    let posted;
    let success_callback;
    let error_callback;
    override(channel, "post", (req) => {
        posted = true;
        assert.equal(req.url, "/json/realm/domains");
        success_callback = req.success;
        error_callback = req.error;
    });

    add_realm_domain();

    assert.ok(posted);

    success_callback();
    assert.equal($info.val(), "translated HTML: Added successfully!");

    error_callback({});
    assert.equal($info.val(), "translated HTML: Failed");
}

function test_change_allow_subdomains(change_allow_subdomains) {
    const ev = {
        stopPropagation: noop,
    };

    const $info = $(".realm_domains_info");
    $info.fadeOut = noop;
    const domain = "example.com";
    let allow = true;

    let success_callback;
    let error_callback;
    channel.patch = (req) => {
        assert.equal(req.url, "/json/realm/domains/example.com");
        assert.equal(req.data.allow_subdomains, JSON.stringify(allow));
        success_callback = req.success;
        error_callback = req.error;
    };

    const $domain_obj = $.create("domain object");
    $domain_obj.text(domain);

    const $elem_obj = $.create("<elem html>");
    const elem_obj = {to_$: () => $elem_obj};
    const $parents_obj = $.create("parents object");

    $elem_obj.set_parents_result("tr", $parents_obj);
    $parents_obj.set_find_results(".domain", $domain_obj);
    elem_obj.checked = allow;

    change_allow_subdomains.call(elem_obj, ev);

    success_callback();
    assert.equal(
        $info.val(),
        "translated HTML: Update successful: Subdomains allowed for example.com",
    );

    error_callback({});
    assert.equal($info.val(), "translated HTML: Failed");

    allow = false;
    elem_obj.checked = allow;
    change_allow_subdomains.call(elem_obj, ev);
    success_callback();
    assert.equal(
        $info.val(),
        "translated HTML: Update successful: Subdomains no longer allowed for example.com",
    );
}

run_test("test_realm_domains_table", ({override}) => {
    settings_realm_domains.setup_realm_domains_modal_handlers();
    test_realms_domain_modal(override, () => $("#submit-add-realm-domain").trigger("click"));
    test_change_allow_subdomains(
        $("#realm_domains_table").get_on_handler("change", "input.allow-subdomains"),
    );
});
```

--------------------------------------------------------------------------------

---[FILE: settings_user_topics.test.cjs]---
Location: zulip-main/web/tests/settings_user_topics.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const list_widget = mock_esm("../src/list_widget");

const settings_user_topics = zrequire("settings_user_topics");
const stream_data = zrequire("stream_data");
const user_topics = zrequire("user_topics");
const {initialize_user_settings} = zrequire("user_settings");

initialize_user_settings({user_settings: {}});

const frontend = {
    stream_id: 101,
    name: "frontend",
};
stream_data.add_sub_for_tests(frontend);

run_test("settings", ({override, override_rewire}) => {
    user_topics.update_user_topics(
        frontend.stream_id,
        frontend.name,
        "js",
        user_topics.all_visibility_policies.MUTED,
        1577836800,
    );

    let populate_list_called = false;

    override(list_widget, "generic_sort_functions", noop);
    override(list_widget, "create", (_$container, list) => {
        assert.deepEqual(list, [
            {
                date_updated: 1577836800000,
                date_updated_str: "Jan 1, 2020",
                stream: frontend.name,
                stream_id: frontend.stream_id,
                topic: "js",
                visibility_policy: user_topics.all_visibility_policies.MUTED,
            },
        ]);
        populate_list_called = true;
    });

    settings_user_topics.reset();
    assert.equal(settings_user_topics.loaded, false);

    settings_user_topics.set_up();
    assert.equal(settings_user_topics.loaded, true);
    assert.ok(populate_list_called);

    const topic_change_handler = $("body").get_on_handler(
        "change",
        "select.settings_user_topic_visibility_policy",
    );
    assert.equal(typeof topic_change_handler, "function");

    const event = {
        stopPropagation: noop,
    };

    const $topic_fake_this = $.create("fake.settings_user_topic_visibility_policy");
    const $topic_tr_html = $('tr[data-topic="js"]');
    $topic_fake_this.closest = (opts) => {
        assert.equal(opts, "tr");
        return $topic_tr_html;
    };
    const $topics_panel_header = $.create("fake.topic_panel_header").attr(
        "id",
        "user-topic-settings",
    );
    const $status_element = $.create("fake.topics_panel_status_element").addClass(
        "alert-notification",
    );
    $topics_panel_header.set_find_results(".alert-notification", $status_element);
    $topic_tr_html.closest = (opts) => {
        assert.equal(opts, "#user-topic-settings");
        return $topics_panel_header;
    };

    let topic_data_called = 0;
    $topic_tr_html.attr = (opts) => {
        topic_data_called += 1;
        switch (opts) {
            case "data-stream-id":
                return frontend.stream_id;
            case "data-topic":
                return "js";
            /* istanbul ignore next */
            default:
                throw new Error(`Unknown attribute ${opts}`);
        }
    };

    let user_topic_visibility_policy_changed = false;
    override_rewire(
        user_topics,
        "set_user_topic_visibility_policy",
        (stream_id, topic, visibility_policy) => {
            assert.equal(stream_id, frontend.stream_id);
            assert.equal(topic, "js");
            assert.equal(visibility_policy, user_topics.all_visibility_policies.UNMUTED);
            user_topic_visibility_policy_changed = true;
        },
    );
    const topic_fake_this = {
        to_$: () => $topic_fake_this,
        value: user_topics.all_visibility_policies.UNMUTED,
    };
    topic_change_handler.call(topic_fake_this, event);
    assert.ok(user_topic_visibility_policy_changed);
    assert.equal(topic_data_called, 2);
});
```

--------------------------------------------------------------------------------

---[FILE: spoilers.test.cjs]---
Location: zulip-main/web/tests/spoilers.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const spoilers = zrequire("spoilers");

// This function is taken from rendered_markdown.test.ts and slightly modified.
const $array = (array) => {
    const each = (func) => {
        for (const [index, $elem] of array.entries()) {
            func.call($elem, index, $elem);
        }
    };
    return {each};
};

const get_spoiler_elem = (title) => {
    const $block = $.create(`block-${title}`);
    const $header = $.create(`header-${title}`);
    const $content = $.create(`content-${title}`);
    $content.remove = noop;
    $header.text(title);
    $block.set_find_results(".spoiler-header", $header);
    $block.set_find_results(".spoiler-content", $content);
    return $block;
};

run_test("hide spoilers in notifications", () => {
    const $root = $.create("root element");
    const $spoiler_1 = get_spoiler_elem("this is the title");
    const $spoiler_2 = get_spoiler_elem("");
    $root.set_find_results(".spoiler-block", $array([$spoiler_1, $spoiler_2]));
    spoilers.hide_spoilers_in_notification($root);
    assert.equal($spoiler_1.find(".spoiler-header").text(), "this is the title (…)");
    assert.equal($spoiler_2.find(".spoiler-header").text(), "(…)");
});
```

--------------------------------------------------------------------------------

---[FILE: starred_messages.test.cjs]---
Location: zulip-main/web/tests/starred_messages.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, with_overrides, zrequire} = require("./lib/namespace.cjs");
const {make_stub} = require("./lib/stub.cjs");
const {run_test} = require("./lib/test.cjs");

const left_sidebar_navigation_area = mock_esm("../src/left_sidebar_navigation_area", {
    update_starred_count() {},
});
const message_store = zrequire("message_store");
const starred_messages = zrequire("starred_messages");
const starred_messages_ui = zrequire("starred_messages_ui");
const {initialize_user_settings} = zrequire("user_settings");

const user_settings = {};
initialize_user_settings({user_settings});

run_test("add starred", () => {
    starred_messages.starred_ids.clear();
    assert.deepEqual(starred_messages.get_starred_msg_ids(), []);
    assert.equal(starred_messages.get_count(), 0);

    starred_messages.add([1, 2]);
    assert.deepEqual(starred_messages.get_starred_msg_ids(), [1, 2]);
    assert.equal(starred_messages.get_count(), 2);
});

run_test("remove starred", () => {
    starred_messages.starred_ids.clear();
    assert.deepEqual(starred_messages.get_starred_msg_ids(), []);

    for (const id of [1, 2, 3]) {
        starred_messages.starred_ids.add(id);
    }
    assert.deepEqual(starred_messages.get_starred_msg_ids(), [1, 2, 3]);

    starred_messages.remove([2, 3]);
    assert.deepEqual(starred_messages.get_starred_msg_ids(), [1]);
    assert.equal(starred_messages.get_count(), 1);
});

run_test("get starred ids in topic", () => {
    for (const id of [1, 2, 3, 4, 5]) {
        starred_messages.starred_ids.add(id);
    }

    assert.deepEqual(starred_messages.get_count_in_topic(undefined, "topic name"), 0);
    assert.deepEqual(starred_messages.get_count_in_topic(3, undefined), 0);

    // id: 1 isn't inserted, to test handling the case
    // when message_store.get() returns undefined
    message_store.update_message_cache({
        type: "server_message",
        message: {
            id: 2,
            type: "private",
        },
    });
    message_store.update_message_cache({
        type: "server_message",
        message: {
            // Different stream
            id: 3,
            type: "stream",
            stream_id: 19,
            topic: "topic",
        },
    });
    message_store.update_message_cache({
        type: "server_message",
        message: {
            // Different topic
            id: 4,
            type: "stream",
            stream_id: 20,
            topic: "some other topic",
        },
    });
    message_store.update_message_cache({
        type: "server_message",
        message: {
            // Correct match
            id: 5,
            type: "stream",
            stream_id: 20,
            topic: "topic",
        },
    });

    assert.deepEqual(starred_messages.get_count_in_topic(20, "topic"), 1);
});

run_test("initialize", () => {
    starred_messages.starred_ids.clear();
    for (const id of [1, 2, 3]) {
        starred_messages.starred_ids.add(id);
    }

    const starred_messages_params = {
        starred_messages: [4, 5, 6],
    };
    starred_messages.initialize(starred_messages_params);
    assert.deepEqual(starred_messages.get_starred_msg_ids(), [4, 5, 6]);
});

run_test("rerender_ui", ({override}) => {
    starred_messages.starred_ids.clear();
    for (const id of [1, 2, 3]) {
        starred_messages.starred_ids.add(id);
    }

    override(user_settings, "starred_message_counts", true);
    with_overrides(({override}) => {
        const stub = make_stub();
        override(left_sidebar_navigation_area, "update_starred_count", stub.f);
        starred_messages_ui.rerender_ui();
        assert.equal(stub.num_calls, 1);
        const args = stub.get_args("count", "hidden");
        assert.equal(args.count, 3);
        assert.equal(args.hidden, false);
    });

    override(user_settings, "starred_message_counts", false);
    with_overrides(({override}) => {
        const stub = make_stub();
        override(left_sidebar_navigation_area, "update_starred_count", stub.f);
        starred_messages_ui.rerender_ui();
        assert.equal(stub.num_calls, 1);
        const args = stub.get_args("count", "hidden");
        assert.equal(args.count, 3);
        assert.equal(args.hidden, true);
    });
});
```

--------------------------------------------------------------------------------

---[FILE: stream_create_subscribers_data.test.cjs]---
Location: zulip-main/web/tests/stream_create_subscribers_data.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const people = zrequire("people");
const {set_current_user} = zrequire("state_data");
const stream_create_subscribers_data = zrequire("stream_create_subscribers_data");

const current_user = {};
set_current_user(current_user);

const me = {
    email: "me@zulip.com",
    full_name: "Zed", // Zed will sort to the top by virtue of being the current user.
    user_id: 400,
};

const test_user101 = {
    email: "test101@zulip.com",
    full_name: "Test User 101",
    user_id: 101,
};

const test_user102 = {
    email: "test102@zulip.com",
    full_name: "Test User 102",
    user_id: 102,
};

const test_user103 = {
    email: "test102@zulip.com",
    full_name: "Test User 103",
    user_id: 103,
};

function test(label, f) {
    run_test(label, (helpers) => {
        helpers.override(current_user, "is_admin", false);
        people.init();
        people.add_active_user(me);
        people.add_active_user(test_user101);
        people.add_active_user(test_user102);
        people.add_active_user(test_user103);
        helpers.override(current_user, "user_id", me.user_id);
        people.initialize_current_user(me.user_id);
        f(helpers);
    });
}

test("basics", () => {
    stream_create_subscribers_data.initialize_with_current_user();

    assert.deepEqual(stream_create_subscribers_data.sorted_user_ids(), [me.user_id]);
    assert.deepEqual(stream_create_subscribers_data.get_principals(), [me.user_id]);

    const all_user_ids = stream_create_subscribers_data.get_all_user_ids();
    assert.deepEqual(all_user_ids, [101, 102, 103, 400]);

    stream_create_subscribers_data.add_user_ids(all_user_ids);
    assert.deepEqual(stream_create_subscribers_data.sorted_user_ids(), [400, 101, 102, 103]);

    stream_create_subscribers_data.remove_user_ids([101, 103]);
    assert.deepEqual(stream_create_subscribers_data.sorted_user_ids(), [400, 102]);
    assert.deepEqual(stream_create_subscribers_data.get_potential_subscribers(), [
        test_user101,
        test_user103,
    ]);
});

test("sync_user_ids", () => {
    stream_create_subscribers_data.initialize_with_current_user();
    stream_create_subscribers_data.sync_user_ids([test_user101.user_id, test_user102.user_id]);
    assert.deepEqual(stream_create_subscribers_data.sorted_user_ids(), [
        test_user101.user_id,
        test_user102.user_id,
    ]);
});

test("soft remove", () => {
    stream_create_subscribers_data.initialize_with_current_user();
    stream_create_subscribers_data.add_user_ids([test_user101.user_id, test_user102.user_id]);

    stream_create_subscribers_data.soft_remove_user_id(test_user102.user_id);
    // sorted_user_ids should still have all the users.
    assert.deepEqual(stream_create_subscribers_data.sorted_user_ids(), [
        me.user_id,
        test_user101.user_id,
        test_user102.user_id,
    ]);
    assert.deepEqual(stream_create_subscribers_data.get_principals(), [
        me.user_id,
        test_user101.user_id,
    ]);
    assert.ok(stream_create_subscribers_data.user_id_in_soft_remove_list(test_user102.user_id));
    assert.ok(!stream_create_subscribers_data.user_id_in_soft_remove_list(test_user101.user_id));

    // Removing a user_id should also remove them from soft remove list.
    stream_create_subscribers_data.remove_user_ids([test_user102.user_id]);
    assert.ok(!stream_create_subscribers_data.user_id_in_soft_remove_list(test_user102.user_id));
    assert.deepEqual(stream_create_subscribers_data.sorted_user_ids(), [
        me.user_id,
        test_user101.user_id,
    ]);
    assert.deepEqual(stream_create_subscribers_data.get_principals(), [
        me.user_id,
        test_user101.user_id,
    ]);

    // Undo soft remove
    stream_create_subscribers_data.soft_remove_user_id(test_user101.user_id);
    assert.deepEqual(stream_create_subscribers_data.sorted_user_ids(), [
        me.user_id,
        test_user101.user_id,
    ]);
    assert.deepEqual(stream_create_subscribers_data.get_principals(), [me.user_id]);

    stream_create_subscribers_data.undo_soft_remove_user_id(test_user101.user_id);
    assert.deepEqual(stream_create_subscribers_data.sorted_user_ids(), [
        me.user_id,
        test_user101.user_id,
    ]);
    assert.deepEqual(stream_create_subscribers_data.get_principals(), [
        me.user_id,
        test_user101.user_id,
    ]);
});
```

--------------------------------------------------------------------------------

````
