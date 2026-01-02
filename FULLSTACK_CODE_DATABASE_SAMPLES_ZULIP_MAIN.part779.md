---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 779
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 779 of 1290)

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

---[FILE: buddy_list.test.cjs]---
Location: zulip-main/web/tests/buddy_list.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const _ = require("lodash");

const {
    clear_buddy_list,
    override_user_matches_narrow_using_loaded_data,
    buddy_list_add_user_matching_view,
    buddy_list_add_other_user,
    stub_buddy_list_elements,
} = require("./lib/buddy_list.cjs");
const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");
const $ = require("./lib/zjquery.cjs");

const padded_widget = mock_esm("../src/padded_widget");
const message_viewport = mock_esm("../src/message_viewport");

const buddy_data = zrequire("buddy_data");
const {BuddyList} = zrequire("buddy_list");
const people = zrequire("people");
const {set_realm} = zrequire("state_data");
const {initialize_user_settings} = zrequire("user_settings");

set_realm(make_realm());
initialize_user_settings({user_settings: {}});

function init_simulated_scrolling() {
    const elem = {
        scrollTop: 0,
        scrollHeight: 0,
    };

    $.create("#buddy_list_wrapper", {children: [elem]});

    $("#buddy_list_wrapper_padding").set_height(0);

    return elem;
}

const alice = {
    email: "alice@zulip.com",
    user_id: 10,
    full_name: "Alice Smith",
};
people.add_active_user(alice);
const bob = {
    email: "bob@zulip.com",
    user_id: 15,
    full_name: "Bob Smith",
};
people.add_active_user(bob);
const chris = {
    email: "chris@zulip.com",
    user_id: 20,
    full_name: "Chris Smith",
};
people.add_active_user(chris);
const $alice_li = $.create("alice-stub");
const $bob_li = $.create("bob-stub");

run_test("basics", ({override, mock_template}) => {
    const buddy_list = new BuddyList();
    init_simulated_scrolling();

    override(buddy_list, "items_to_html", () => "<html-stub>");
    override(message_viewport, "height", () => 550);
    override(padded_widget, "update_padding", noop);
    stub_buddy_list_elements();
    mock_template("buddy_list/view_all_users.hbs", false, () => "<view-all-users-stub>");

    buddy_list.populate({
        all_user_ids: [alice.user_id],
    });

    const $alice_li = "alice-stub";

    override(buddy_list, "get_li_from_user_id", (opts) => {
        const user_id = opts.user_id;

        assert.equal(user_id, alice.user_id);
        return $alice_li;
    });

    const $li = buddy_list.find_li({
        key: alice.user_id,
    });
    assert.equal($li, $alice_li);
});

run_test("split list", ({override, override_rewire, mock_template}) => {
    const buddy_list = new BuddyList();
    init_simulated_scrolling();
    stub_buddy_list_elements();
    mock_template("buddy_list/view_all_users.hbs", false, () => "<view-all-users-stub>");

    override_rewire(
        buddy_data,
        "user_matches_narrow_using_loaded_data",
        override_user_matches_narrow_using_loaded_data,
    );

    override(buddy_list, "items_to_html", (opts) => {
        assert.ok(opts.items.length > 0);
        return "<html-stub>";
    });
    override(message_viewport, "height", () => 550);
    override(padded_widget, "update_padding", noop);

    let appended_to_users_matching_view = false;
    $("#buddy-list-users-matching-view").append = ($element) => {
        if ($element.selector === "<html-stub>") {
            appended_to_users_matching_view = true;
        }
    };

    let appended_to_other_users = false;
    $("#buddy-list-other-users").append = ($element) => {
        if ($element.selector === "<html-stub>") {
            appended_to_other_users = true;
        }
    };

    // one user matching the view
    buddy_list_add_user_matching_view(alice.user_id, $alice_li);
    buddy_list.populate({
        all_user_ids: [alice.user_id],
    });
    assert.ok(appended_to_users_matching_view);
    assert.ok(!appended_to_other_users);
    appended_to_users_matching_view = false;

    // one other user
    clear_buddy_list(buddy_list);
    buddy_list_add_other_user(alice.user_id, $alice_li);
    buddy_list.populate({
        all_user_ids: [alice.user_id],
    });
    assert.ok(!appended_to_users_matching_view);
    assert.ok(appended_to_other_users);
    appended_to_other_users = false;

    // a user matching the view, and another user
    clear_buddy_list(buddy_list);
    buddy_list_add_user_matching_view(alice.user_id, $alice_li);
    buddy_list_add_other_user(bob.user_id, $bob_li);
    buddy_list.populate({
        all_user_ids: [alice.user_id, bob.user_id],
    });
    assert.ok(appended_to_users_matching_view);
    assert.ok(appended_to_other_users);
});

run_test("find_li", ({override, mock_template}) => {
    const buddy_list = new BuddyList();

    override(buddy_list, "fill_screen_with_content", noop);
    mock_template("buddy_list/view_all_users.hbs", false, () => "<view-all-users-stub>");
    stub_buddy_list_elements();

    clear_buddy_list(buddy_list);
    buddy_list_add_user_matching_view(alice.user_id, $alice_li);
    buddy_list_add_other_user(bob.user_id, $bob_li);

    let $li = buddy_list.find_li({
        key: alice.user_id,
    });
    assert.equal($li, $alice_li);

    $li = buddy_list.find_li({
        key: bob.user_id,
    });
    assert.equal($li, $bob_li);
});

run_test("fill_screen_with_content early break on big list", ({override, mock_template}) => {
    stub_buddy_list_elements();
    const buddy_list = new BuddyList();
    const elem = init_simulated_scrolling();
    stub_buddy_list_elements();
    mock_template("buddy_list/view_all_users.hbs", false, () => "<view-all-users-stub>");

    let chunks_inserted = 0;
    override(buddy_list, "render_more", () => {
        elem.scrollHeight += 100;
        chunks_inserted += 1;
    });
    override(message_viewport, "height", () => 550);

    // We will have more than enough users, but still
    // only do 6 chunks of data (20 users per chunk)
    // because of exiting early from fill_screen_with_content
    // because of not scrolling enough to fetch more users.
    const num_users = 300;
    const user_ids = [];

    _.times(num_users, (i) => {
        const person = {
            email: "foo" + i + "@zulip.com",
            user_id: 100 + i,
            full_name: "Somebody " + i,
        };
        people.add_active_user(person);
        user_ids.push(person.user_id);
    });

    buddy_list.populate({
        all_user_ids: user_ids,
    });

    // Only 6 chunks, even though that's 120 users instead of the full 300.
    assert.equal(chunks_inserted, 6);
});

run_test("big_list", ({override, override_rewire, mock_template}) => {
    const buddy_list = new BuddyList();
    init_simulated_scrolling();

    stub_buddy_list_elements();
    override(padded_widget, "update_padding", noop);
    override(message_viewport, "height", () => 550);
    override_rewire(
        buddy_data,
        "user_matches_narrow_using_loaded_data",
        override_user_matches_narrow_using_loaded_data,
    );
    mock_template("buddy_list/view_all_users.hbs", false, () => "<view-all-users-stub>");

    let items_to_html_call_count = 0;
    override(buddy_list, "items_to_html", () => {
        items_to_html_call_count += 1;
        return "<html-stub>";
    });

    const num_users = 300;
    const user_ids = [];

    // This isn't a great way of testing this, but this is here for
    // the sake of code coverage. Essentially, for a very long list,
    // these buddy list sections can collect empty messages in the middle
    // of populating (i.e. once a chunk is rendered) which later might need
    // to be removed to add users from future chunks.
    //
    // For example: chunk1 populates only users in the list of users matching,
    // the view and the empty list says "None", but chunk2 adds users to the
    // other list so the "None" message should be removed.
    //
    // Here we're just saying both lists are rendered as empty from start,
    // which doesn't actually happen, since I don't know how to properly
    // get it set in the middle of buddy_list.populate().
    $("#buddy-list-users-matching-view .empty-list-message").length = 1;
    $("#buddy-list-other-users .empty-list-message").length = 1;

    _.times(num_users, (i) => {
        const person = {
            email: "foo" + i + "@zulip.com",
            user_id: 100 + i,
            full_name: "Somebody " + i,
        };
        people.add_active_user(person);
        if (i < 100 || i % 2 === 0) {
            buddy_list_add_user_matching_view(person.user_id, $.create("stub" + i));
        } else {
            buddy_list_add_other_user(person.user_id, $.create("stub" + i));
        }
        user_ids.push(person.user_id);
    });

    buddy_list.populate({
        all_user_ids: user_ids,
    });

    // Chunks are default size 20, so there should be 300/20 = 15 chunks
    // For the first 100/20 = 5 chunks, we only call to add a user matching ivew.
    // For the last 10 chunks, there are two calls: one for users_matching_view
    // and one for other_users.
    assert.equal(items_to_html_call_count, 5 + 10 * 2);
});

run_test("force_render", ({override}) => {
    const buddy_list = new BuddyList();
    buddy_list.render_count = 50;

    let num_rendered = 0;
    override(buddy_list, "render_more", (opts) => {
        num_rendered += opts.chunk_size;
    });

    buddy_list.force_render({
        pos: 60,
    });

    assert.equal(num_rendered, 60 - 50 + 3);

    // Force a contrived error case for line coverage.
    blueslip.expect("error", "cannot show user id at this position");
    buddy_list.force_render({
        pos: 10,
    });
});

run_test("find_li w/force_render", ({override}) => {
    const buddy_list = new BuddyList();

    // If we call find_li w/force_render set, and the
    // user_id is not already rendered in DOM, then the
    // widget will force-render it.
    const user_id = "999";
    const $stub_li = "stub-li";

    override(buddy_list, "get_li_from_user_id", (opts) => {
        assert.equal(opts.user_id, user_id);
        return $stub_li;
    });

    buddy_list.all_user_ids = ["foo", "bar", user_id, "baz"];

    let shown;

    override(buddy_list, "force_render", (opts) => {
        assert.equal(opts.pos, 2);
        shown = true;
    });

    const $hidden_li = buddy_list.find_li({
        key: user_id,
    });
    assert.equal($hidden_li, $stub_li);
    assert.ok(!shown);

    const $li = buddy_list.find_li({
        key: user_id,
        force_render: true,
    });

    assert.equal($li, $stub_li);
    assert.ok(shown);
});

run_test("find_li w/bad key", ({override}) => {
    const buddy_list = new BuddyList();
    override(buddy_list, "get_li_from_user_id", () => "stub-li");

    const $undefined_li = buddy_list.find_li({
        key: "not-there",
        force_render: true,
    });

    assert.deepEqual($undefined_li, undefined);
});

run_test("scrolling", ({override, mock_template}) => {
    const buddy_list = new BuddyList();
    let tried_to_fill;
    override(buddy_list, "fill_screen_with_content", () => {
        tried_to_fill = true;
    });
    mock_template("buddy_list/view_all_users.hbs", false, () => "<view-all-users-stub>");
    stub_buddy_list_elements();
    init_simulated_scrolling();
    stub_buddy_list_elements();

    clear_buddy_list(buddy_list);
    assert.ok(tried_to_fill);
    tried_to_fill = false;

    buddy_list.start_scroll_handler();
    $(buddy_list.scroll_container_selector).trigger("scroll");

    assert.ok(tried_to_fill);
});
```

--------------------------------------------------------------------------------

---[FILE: channel.test.cjs]---
Location: zulip-main/web/tests/channel.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_jquery, mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");
const {page_params} = require("./lib/zpage_params.cjs");

const xhr_401 = {
    status: 401,
    responseJSON: {msg: "Use cannot access XYZ"},
};

let login_to_access_shown = false;
mock_esm("../src/spectators", {
    login_to_access() {
        login_to_access_shown = true;
    },
});

set_global("window", {
    location: {
        replace() {},
        href: "http://example.com",
    },
});

const reload_state = zrequire("reload_state");
const channel = zrequire("channel");

const default_stub_xhr = {"default-stub-xhr": 0};

const $ = mock_jquery({});

function test_with_mock_ajax(test_params) {
    const {xhr = default_stub_xhr, run_code, check_ajax_options} = test_params;

    let ajax_called;
    let ajax_options;
    $.ajax = (options) => {
        $.ajax = undefined;
        ajax_called = true;
        ajax_options = options;

        options.simulate_success = (data, text_status) => {
            options.success(data, text_status, xhr);
        };

        options.simulate_error = () => {
            options.error(xhr);
        };

        return xhr;
    };

    run_code();
    assert.ok(ajax_called);
    check_ajax_options(ajax_options);
}

function test(label, f) {
    run_test(label, ({override}) => {
        reload_state.clear_for_testing();
        f({override});
    });
}

test("post", () => {
    test_with_mock_ajax({
        run_code() {
            channel.post({url: "/json/endpoint"});
        },

        check_ajax_options(options) {
            assert.equal(options.type, "POST");
            assert.equal(options.dataType, "json");

            // Just make sure these don't explode.
            options.simulate_success();
            options.simulate_error();
        },
    });
});

test("patch", () => {
    test_with_mock_ajax({
        run_code() {
            channel.patch({url: "/json/endpoint"});
        },

        check_ajax_options(options) {
            assert.equal(options.type, "PATCH");
            assert.equal(options.dataType, "json");

            // Just make sure these don't explode.
            options.simulate_success();
            options.simulate_error();
        },
    });
});

test("put", () => {
    test_with_mock_ajax({
        run_code() {
            channel.put({url: "/json/endpoint"});
        },

        check_ajax_options(options) {
            assert.equal(options.type, "PUT");
            assert.equal(options.dataType, "json");

            // Just make sure these don't explode.
            options.simulate_success();
            options.simulate_error();
        },
    });
});

test("delete", () => {
    test_with_mock_ajax({
        run_code() {
            channel.del({url: "/json/endpoint"});
        },

        check_ajax_options(options) {
            assert.equal(options.type, "DELETE");
            assert.equal(options.dataType, "json");

            // Just make sure these don't explode.
            options.simulate_success();
            options.simulate_error();
        },
    });
});

test("get", () => {
    test_with_mock_ajax({
        run_code() {
            channel.get({url: "/json/endpoint"});
        },

        check_ajax_options(options) {
            assert.equal(options.type, "GET");
            assert.equal(options.dataType, "json");

            // Just make sure these don't explode.
            options.simulate_success();
            options.simulate_error();
        },
    });
});

test("normal_post", () => {
    const data = {
        s: "some_string",
        num: 7,
        lst: [1, 2, 4, 8],
    };

    let orig_success_called;
    let orig_error_called;
    const stub_xhr = {"stub-xhr-normal-post": 0};

    test_with_mock_ajax({
        xhr: stub_xhr,

        run_code() {
            channel.post({
                data,
                url: "/json/endpoint",
                success(data, text_status, xhr) {
                    orig_success_called = true;
                    assert.equal(data, "response data");
                    assert.equal(text_status, "success");
                    assert.equal(xhr, stub_xhr);
                },
                error() {
                    orig_error_called = true;
                },
            });
        },

        check_ajax_options(options) {
            assert.equal(options.type, "POST");
            assert.equal(options.dataType, "json");
            assert.deepEqual(options.data, data);
            assert.equal(options.url, "/json/endpoint");

            options.simulate_success("response data", "success");
            assert.ok(orig_success_called);

            options.simulate_error();
            assert.ok(orig_error_called);
        },
    });
});

test("authentication_error_401_is_spectator", () => {
    test_with_mock_ajax({
        xhr: xhr_401,
        run_code() {
            channel.post({url: "/json/endpoint"});
        },

        // is_spectator = true
        check_ajax_options(options) {
            page_params.page_type = "home";
            page_params.is_spectator = true;

            options.simulate_error();
            assert.ok(login_to_access_shown);

            login_to_access_shown = false;
        },
    });
});

test("authentication_error_401_password_change_in_progress", () => {
    test_with_mock_ajax({
        xhr: xhr_401,
        run_code() {
            channel.post({url: "/json/endpoint"});
        },

        // is_spectator = true
        // password_change_in_progress = true
        check_ajax_options(options) {
            page_params.page_type = "home";
            page_params.is_spectator = true;
            channel.set_password_change_in_progress(true);

            options.simulate_error();
            assert.ok(!login_to_access_shown);

            channel.set_password_change_in_progress(false);
            page_params.is_spectator = false;
            login_to_access_shown = false;
        },
    });
});

test("authentication_error_401_not_spectator", () => {
    test_with_mock_ajax({
        xhr: xhr_401,
        run_code() {
            channel.post({url: "/json/endpoint"});
        },

        // is_spectator = false
        check_ajax_options(options) {
            page_params.page_type = "home";
            page_params.is_spectator = false;

            options.simulate_error();
            assert.ok(!login_to_access_shown);

            login_to_access_shown = false;
        },
    });
});

test("reload_on_403_error", () => {
    test_with_mock_ajax({
        xhr: {
            status: 403,
            responseJSON: {msg: "CSRF Fehler: etwas", code: "CSRF_FAILED"},
        },

        run_code() {
            channel.post({url: "/json/endpoint"});
        },

        check_ajax_options(options) {
            let handler_called = false;
            reload_state.set_csrf_failed_handler(() => {
                handler_called = true;
            });

            options.simulate_error();
            assert.ok(handler_called);
        },
    });
});

test("unexpected_403_response", () => {
    test_with_mock_ajax({
        xhr: {
            status: 403,
            responseJSON: undefined,
            responseText: "unexpected",
        },

        run_code() {
            channel.post({url: "/json/endpoint"});
        },

        check_ajax_options(options) {
            blueslip.expect("error", "Unexpected 403 response from server");
            options.simulate_error();
        },
    });
});

test("xhr_error_message", () => {
    let xhr = {
        status: "200",
        responseJSON: undefined,
        responseText: "does not matter",
    };
    let msg = "data added";
    assert.equal(channel.xhr_error_message(msg, xhr), "data added");

    xhr = {
        status: "404",
        responseJSON: {msg: "file not found"},
    };
    msg = "some message";
    assert.equal(channel.xhr_error_message(msg, xhr), "some message: file not found");

    msg = "";
    assert.equal(channel.xhr_error_message(msg, xhr), "file not found");
});

test("while_reloading", () => {
    reload_state.set_state_to_in_progress();

    assert.equal(channel.get({ignore_reload: false}), undefined);

    test_with_mock_ajax({
        run_code() {
            channel.del({
                url: "/json/endpoint",
                ignore_reload: true,
                /* istanbul ignore next */
                success() {
                    throw new Error("unexpected success");
                },
                /* istanbul ignore next */
                error() {
                    throw new Error("unexpected error");
                },
            });
        },

        check_ajax_options(options) {
            blueslip.expect("log", "Ignoring DELETE /json/endpoint response while reloading");
            options.simulate_success();

            blueslip.expect("log", "Ignoring DELETE /json/endpoint error response while reloading");
            options.simulate_error();
        },
    });
});

test("error in callback", () => {
    let success_called = false;
    let error_called = false;
    let raised_error = false;
    test_with_mock_ajax({
        run_code() {
            channel.get({
                url: "/json/endpoint",
                success() {
                    success_called = true;
                    throw new Error("success");
                },
                error() {
                    error_called = true;
                    throw new Error("failure");
                },
            });
        },
        check_ajax_options(options) {
            try {
                options.simulate_success();
            } catch (error) {
                assert.equal(error.message, "success");
                raised_error = true;
            }
            assert.ok(success_called);
            assert.ok(raised_error);
            assert.ok(!error_called);

            success_called = false;
            raised_error = false;

            try {
                options.simulate_error();
            } catch (error) {
                assert.equal(error.message, "failure");
                raised_error = true;
            }
            assert.ok(!success_called);
            assert.ok(raised_error);
            assert.ok(error_called);
        },
    });
});
```

--------------------------------------------------------------------------------

---[FILE: channel_folders.test.cjs]---
Location: zulip-main/web/tests/channel_folders.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_stream} = require("./lib/example_stream.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const channel_folders = zrequire("channel_folders");
const stream_data = zrequire("stream_data");

run_test("basics", () => {
    const params = {};
    const frontend_folder = {
        name: "Frontend",
        description: "Channels for frontend discussions",
        rendered_description: "<p>Channels for frontend discussions</p>",
        creator_id: null,
        date_created: 1596710000,
        id: 1,
        is_archived: false,
        order: 0,
    };
    const backend_folder = {
        name: "Backend",
        description: "Channels for backend discussions",
        rendered_description: "<p>Channels for backend discussions</p>",
        creator_id: null,
        date_created: 1596720000,
        id: 2,
        is_archived: false,
        order: 1,
    };
    params.channel_folders = [frontend_folder, backend_folder];
    channel_folders.initialize(params);

    assert.deepEqual(channel_folders.get_channel_folders(), [frontend_folder, backend_folder]);
    assert.deepEqual(
        channel_folders.get_active_folder_ids(),
        new Set([frontend_folder.id, backend_folder.id]),
    );

    const devops_folder = {
        name: "Devops",
        description: "",
        rendered_description: "",
        creator_id: 1,
        date_created: 1596810000,
        id: 3,
        is_archived: false,
        order: 2,
    };
    channel_folders.add(devops_folder);
    assert.deepEqual(channel_folders.get_channel_folders(), [
        frontend_folder,
        backend_folder,
        devops_folder,
    ]);

    devops_folder.is_archived = true;
    assert.deepEqual(channel_folders.get_channel_folders(), [frontend_folder, backend_folder]);

    assert.deepEqual(channel_folders.get_channel_folders(true), [
        frontend_folder,
        backend_folder,
        devops_folder,
    ]);

    assert.deepEqual(
        channel_folders.get_all_folder_ids(),
        new Set([frontend_folder.id, backend_folder.id, devops_folder.id]),
    );

    assert.ok(channel_folders.is_valid_folder_id(frontend_folder.id));
    assert.ok(!channel_folders.is_valid_folder_id(999));

    assert.equal(channel_folders.get_channel_folder_by_id(frontend_folder.id), frontend_folder);

    const new_order = [backend_folder.id, devops_folder.id, frontend_folder.id];
    channel_folders.reorder(new_order);
    assert.equal(backend_folder.order, 0);
    assert.equal(devops_folder.order, 1);
    assert.equal(frontend_folder.order, 2);

    const stream_1 = make_stream({
        stream_id: 1,
        name: "Stream 1",
        folder_id: null,
    });
    const stream_2 = make_stream({
        stream_id: 2,
        name: "Stream 2",
        folder_id: frontend_folder.id,
    });
    const stream_3 = make_stream({
        stream_id: 3,
        name: "Stream 3",
        folder_id: devops_folder.id,
    });
    const stream_4 = make_stream({
        stream_id: 4,
        name: "Stream 4",
        folder_id: frontend_folder.id,
    });
    const stream_5 = make_stream({
        stream_id: 5,
        name: "channel 5",
        folder_id: frontend_folder.id,
    });
    stream_data.add_sub_for_tests(stream_1);

    assert.deepEqual(channel_folders.user_has_folders(), false);

    stream_data.add_sub_for_tests(stream_2);
    stream_data.add_sub_for_tests(stream_3);
    stream_data.add_sub_for_tests(stream_4);
    stream_data.add_sub_for_tests(stream_5);

    assert.deepEqual(channel_folders.get_stream_ids_in_folder(frontend_folder.id), [
        stream_2.stream_id,
        stream_4.stream_id,
        stream_5.stream_id,
    ]);
    assert.deepEqual(channel_folders.get_stream_ids_in_folder(devops_folder.id), [
        stream_3.stream_id,
    ]);
    assert.deepEqual(channel_folders.get_stream_ids_in_folder(backend_folder.id), []);

    assert.deepEqual(channel_folders.get_sorted_streams_in_folder(frontend_folder.id), [
        stream_5,
        stream_2,
        stream_4,
    ]);

    const subscribed_streams = new Set([
        stream_1.stream_id,
        stream_2.stream_id,
        stream_3.stream_id,
        stream_4.stream_id,
    ]);

    // Tests for get_channels_in_folders_matching_search_term_in_folder_name
    // Should match 'Frontend' folder and return its streams
    assert.deepEqual(
        channel_folders.get_channels_in_folders_matching_search_term_in_folder_name(
            "Front",
            subscribed_streams,
        ),
        [stream_2.stream_id, stream_4.stream_id],
    );

    // Should match 'Backend' folder and return no streams
    assert.deepEqual(
        channel_folders.get_channels_in_folders_matching_search_term_in_folder_name(
            "Back",
            subscribed_streams,
        ),
        [],
    );

    // Should match no folder and return empty array
    assert.deepEqual(
        channel_folders.get_channels_in_folders_matching_search_term_in_folder_name(
            "Nonexistent",
            subscribed_streams,
        ),
        [],
    );

    assert.deepEqual(channel_folders.user_has_folders(), true);
});
```

--------------------------------------------------------------------------------

---[FILE: clipboard_handler.test.cjs]---
Location: zulip-main/web/tests/clipboard_handler.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {JSDOM} = require("jsdom");

const {zrequire, mock_esm} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const settings_config = zrequire("settings_config");
mock_esm("../src/user_settings", {
    user_settings: {
        web_channel_default_view: settings_config.web_channel_default_view_values.channel_feed.code,
    },
});
const clipboard_handler = zrequire("clipboard_handler");
const stream_data = zrequire("stream_data");
const people = zrequire("people");

const hamlet = {
    user_id: 15,
    email: "hamlet@example.com",
    full_name: "Hamlet",
};

people.add_active_user(hamlet);

run_test("copy_link_to_clipboard", async ({override}) => {
    const stream = {
        name: "Stream",
        description: "Color and Lights",
        stream_id: 1,
        subscribed: true,
        type: "stream",
    };
    stream_data.add_sub_for_tests(stream);
    const {window} = new JSDOM();
    global.document = window.document;

    // Mock DataTransfer for testing purposes
    class MockDataTransfer {
        constructor() {
            this.data = {};
        }

        setData(type, value) {
            this.data[type] = value;
        }

        getData(type) {
            return this.data[type] || "";
        }
    }

    // Store the copy event callback and clipboardData
    let clipboardData;
    let copyEventCallback;
    override(window.document, "addEventListener", (event, callback) => {
        if (event === "copy") {
            copyEventCallback = callback;
        }
    });

    // Stub execCommand to trigger the copy event
    override(window.document, "execCommand", (command) => {
        if (command === "copy" && copyEventCallback) {
            const copyEvent = new window.Event("copy", {bubbles: true, cancelable: true});
            copyEvent.clipboardData = new MockDataTransfer();
            copyEventCallback(copyEvent);
            clipboardData = copyEvent.clipboardData;
        }
        return true;
    });

    // Helper function to simulate clipboard handling
    async function simulateClipboardData(link) {
        await clipboard_handler.copy_link_to_clipboard(link);
        return {
            plainText: clipboardData.getData("text/plain"),
            htmlText: clipboardData.getData("text/html"),
            markdownText: clipboardData.getData("text/x-gfm"),
        };
    }

    const normal_stream_with_topic =
        "http://zulip.zulipdev.com/#narrow/channel/1-Stream/topic/normal.20topic";
    const normal_stream_with_topic_and_message =
        "http://zulip.zulipdev.com/#narrow/channel/1-Stream/topic/normal.20topic/near/1";
    const normal_stream = "http://zulip.zulipdev.com/#narrow/channel/1-Stream/";
    const dm_message = "http://zulip.zulipdev.com/#narrow/dm/15-dm/near/43";

    let clipboardDataResult = await simulateClipboardData(normal_stream_with_topic);
    assert.equal(clipboardDataResult.plainText, normal_stream_with_topic);
    assert.equal(
        clipboardDataResult.htmlText,
        `<a href="http://zulip.zulipdev.com/#narrow/channel/1-Stream/topic/normal.20topic">#Stream > normal topic</a>`,
    );
    assert.equal(
        clipboardDataResult.markdownText,
        `[#Stream > normal topic](http://zulip.zulipdev.com/#narrow/channel/1-Stream/topic/normal.20topic)`,
    );

    clipboardDataResult = await simulateClipboardData(normal_stream_with_topic_and_message);
    assert.equal(clipboardDataResult.plainText, normal_stream_with_topic_and_message);
    assert.equal(
        clipboardDataResult.htmlText,
        `<a href="http://zulip.zulipdev.com/#narrow/channel/1-Stream/topic/normal.20topic/near/1">#Stream > normal topic @ 💬</a>`,
    );
    assert.equal(
        clipboardDataResult.markdownText,
        `[#Stream > normal topic @ 💬](http://zulip.zulipdev.com/#narrow/channel/1-Stream/topic/normal.20topic/near/1)`,
    );

    clipboardDataResult = await simulateClipboardData(normal_stream);
    assert.equal(clipboardDataResult.plainText, normal_stream);
    assert.equal(
        clipboardDataResult.htmlText,
        `<a href="http://zulip.zulipdev.com/#narrow/channel/1-Stream/">#Stream</a>`,
    );
    assert.equal(
        clipboardDataResult.markdownText,
        `[#Stream](http://zulip.zulipdev.com/#narrow/channel/1-Stream/)`,
    );

    clipboardDataResult = await simulateClipboardData(dm_message);
    assert.equal(clipboardDataResult.plainText, dm_message);
});
```

--------------------------------------------------------------------------------

---[FILE: color_data.test.cjs]---
Location: zulip-main/web/tests/color_data.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const color_data = zrequire("color_data");

run_test("pick_color", () => {
    color_data.reset();

    color_data.claim_colors([
        {color: color_data.colors[1]},
        {foo: "whatever"},
        {color: color_data.colors[3]},
        {color: "bogus"},
    ]);

    const expected_colors = [
        color_data.colors[0],
        color_data.colors[2],
        ...color_data.colors.slice(4),
        // ok, now we'll cycle through all colors
        ...color_data.colors,
        ...color_data.colors,
        ...color_data.colors,
    ];

    for (const expected_color of expected_colors) {
        assert.equal(color_data.pick_color(), expected_color);
    }

    color_data.claim_color(color_data.colors[0]);
    assert.equal(color_data.pick_color(), color_data.colors[1]);
});
```

--------------------------------------------------------------------------------

---[FILE: common.test.cjs]---
Location: zulip-main/web/tests/common.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

mock_esm("tippy.js", {
    default(arg) {
        arg._tippy = {setContent: noop};
        return arg._tippy;
    },
});

set_global("document", {});
const navigator = set_global("navigator", {});

const common = zrequire("common");

run_test("phrase_match", () => {
    assert.ok(common.phrase_match("tes", "test"));
    assert.ok(common.phrase_match("Tes", "test"));
    assert.ok(common.phrase_match("Tes", "Test"));
    assert.ok(common.phrase_match("tes", "Stream Test"));
    assert.ok(common.phrase_match("", "test"));

    assert.ok(!common.phrase_match("tests", "test"));
    assert.ok(!common.phrase_match("tes", "hostess"));
});

run_test("adjust_mac_kbd_tags non-mac", ({override}) => {
    override(navigator, "platform", "Windows");

    // The adjust_mac_kbd_tags has a really simple guard
    // at the top, and we just test the early-return behavior
    // by trying to pass it garbage.
    common.adjust_mac_kbd_tags("selector-that-does-not-exist");
});

run_test("adjust_mac_kbd_tags mac", ({override}) => {
    const keys_to_test_mac = new Map([
        ["Backspace", "Delete"],
        ["Enter", "Return"],
        ["Ctrl", "⌘"],
        ["Alt", "⌥"],
        ["#stream_name", "#stream_name"],
        ["Ctrl+K", "Ctrl+K"],
        ["[", "["],
        ["X", "X"],
        ["data-mac-following-key", "data-mac-following-key"],
    ]);

    override(navigator, "platform", "MacIntel");
    $("<span>").contents = () => $("<contents-stub>");

    const test_items = [];
    let key_no = 1;

    for (const [old_key, mac_key] of keys_to_test_mac) {
        const test_item = {};
        const $stub = $.create("hotkey_" + key_no);
        $stub.text(old_key);
        if (old_key === "data-mac-following-key") {
            $stub.attr("data-mac-following-key", "⌥");
            $stub.after = ($plus, $elem) => {
                assert.equal($plus.selector, "<contents-stub>");
                assert.equal($elem.selector, "<kbd>");
                assert.equal($elem.text(), $stub.attr("data-mac-following-key"));
            };
        }
        test_item.$stub = $stub;
        test_item.mac_key = mac_key;
        test_items.push(test_item);
        key_no += 1;
    }

    const children = test_items.map((test_item) => ({to_$: () => test_item.$stub}));

    $.create(".markdown kbd", {children});

    common.adjust_mac_kbd_tags(".markdown kbd");

    for (const test_item of test_items) {
        assert.equal(test_item.$stub.text(), test_item.mac_key);
    }
});

run_test("adjust_mac_hotkey_hints non-mac", ({override}) => {
    override(navigator, "platform", "Windows");

    // The adjust_mac_hotkey_hints has a really simple guard
    // at the top, and we just test the early-return behavior
    // by trying to pass it garbage.
    common.adjust_mac_hotkey_hints("not-an-array");
});

// Test default values of adjust_mac_hotkey_hints
// Expected values
run_test("adjust_mac_hotkey_hints mac expected", ({override}) => {
    const keys_to_test_mac = new Map([
        [["Backspace"], ["Delete"]],
        [["Enter"], ["Return"]],
        [["Ctrl"], ["⌘"]],
    ]);

    override(navigator, "platform", "MacIntel");

    const test_items = [];

    for (const [old_key, mac_key] of keys_to_test_mac) {
        const test_item = {};
        common.adjust_mac_hotkey_hints(old_key);

        test_item.mac_key = mac_key;
        test_item.adjusted_key = old_key;
        test_items.push(test_item);
    }

    for (const test_item of test_items) {
        assert.deepStrictEqual(test_item.mac_key, test_item.adjusted_key);
    }
});

// Test non-default values of adjust_mac_hotkey_hints
// Random values
run_test("adjust_mac_hotkey_hints mac random", ({override}) => {
    const keys_to_test_mac = new Map([
        [
            ["Ctrl", "["],
            ["⌘", "["],
        ],
        [
            ["Ctrl", "K"],
            ["⌘", "K"],
        ],
        [
            ["Shift", "G"],
            ["Shift", "G"],
        ],
        [["Space"], ["Space"]],
    ]);

    override(navigator, "platform", "MacIntel");

    const test_items = [];

    for (const [old_key, mac_key] of keys_to_test_mac) {
        const test_item = {};
        common.adjust_mac_hotkey_hints(old_key);

        test_item.mac_key = mac_key;
        test_item.adjusted_key = old_key;
        test_items.push(test_item);
    }

    for (const test_item of test_items) {
        assert.deepStrictEqual(test_item.mac_key, test_item.adjusted_key);
    }
});

run_test("show password", () => {
    const password_selector = "#id_password ~ .password_visibility_toggle";

    $(password_selector)[0] = noop;

    function set_attribute(type) {
        $("#id_password").attr("type", type);
    }

    function check_assertion(type, present_class, absent_class) {
        assert.equal($("#id_password").attr("type"), type);
        assert.ok($(password_selector).hasClass(present_class));
        assert.ok(!$(password_selector).hasClass(absent_class));
    }

    const click_ev = {
        preventDefault() {},
        stopPropagation() {},
    };

    const key_ev = {
        key: "Enter",
        preventDefault() {},
        stopPropagation() {},
    };

    set_attribute("password");
    common.setup_password_visibility_toggle("#id_password", password_selector);

    const click_handler = $(password_selector).get_on_handler("click");

    const key_handler = $(password_selector).get_on_handler("keydown");

    click_handler(click_ev);
    check_assertion("text", "fa-eye", "fa-eye-slash");

    click_handler(click_ev);
    check_assertion("password", "fa-eye-slash", "fa-eye");

    key_handler(key_ev);
    check_assertion("text", "fa-eye", "fa-eye-slash");

    key_handler(key_ev);
    check_assertion("password", "fa-eye-slash", "fa-eye");

    click_handler(click_ev);

    common.reset_password_toggle_icons("#id_password", password_selector);
    check_assertion("password", "fa-eye-slash", "fa-eye");
});
```

--------------------------------------------------------------------------------

````
