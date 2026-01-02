---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 831
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 831 of 1290)

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

---[FILE: user_group_pill.test.cjs]---
Location: zulip-main/web/tests/user_group_pill.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const user_groups = zrequire("user_groups");
const user_group_pill = zrequire("user_group_pill");
const people = zrequire("people");

const user1 = {
    user_id: 10,
    email: "user1@example.com",
    full_name: "User One",
};
people.add_active_user(user1);

const user2 = {
    user_id: 20,
    email: "user2@example.com",
    full_name: "User Two",
};
people.add_active_user(user2);

const user3 = {
    user_id: 30,
    email: "user3@example.com",
    full_name: "User Three",
};
people.add_active_user(user3);

const user4 = {
    user_id: 40,
    email: "user4@example.com",
    full_name: "User Four",
};
people.add_active_user(user4);

const user5 = {
    user_id: 50,
    email: "user5@example.com",
    full_name: "User Five",
};
people.add_active_user(user5);

const admins = {
    name: "Admins",
    description: "foo",
    id: 101,
    members: [10, 20],
};
const testers = {
    name: "Testers",
    description: "bar",
    id: 102,
    members: [20, 50, 30, 40],
};
const everyone = {
    name: "role:everyone",
    description: "Everyone",
    id: 103,
    members: [],
    direct_subgroup_ids: [101, 102],
};

const admins_pill = {
    group_id: admins.id,
    group_name: admins.name,
    type: "user_group",
};
const testers_pill = {
    group_id: testers.id,
    group_name: testers.name,
    type: "user_group",
    show_expand_button: false,
};
const everyone_pill = {
    group_id: everyone.id,
    group_name: everyone.name,
    type: "user_group",
    // While we can programmatically set the user count below,
    // calculating it would almost mimic the entire display function
    // here, reducing the usefulness of the test.
};

const groups = [admins, testers, everyone];
for (const group of groups) {
    user_groups.add(group);
}

run_test("create_item", () => {
    function test_create_item(group_name, current_items, expected_item) {
        const item = user_group_pill.create_item_from_group_name(group_name, current_items);
        assert.deepEqual(item, expected_item);
    }

    test_create_item(" admins ", [], admins_pill);
    test_create_item("admins", [testers_pill], admins_pill);
    test_create_item("admins", [admins_pill], undefined);
    test_create_item("unknown", [], undefined);
    test_create_item("role:everyone", [], everyone_pill);
});

run_test("get_stream_id", () => {
    assert.equal(user_group_pill.get_group_name_from_item(admins_pill), admins.name);
});

run_test("get_user_ids", () => {
    let items = [admins_pill, testers_pill];
    const widget = {items: () => items};

    let user_ids = user_group_pill.get_user_ids(widget);
    assert.deepEqual(user_ids, [10, 20, 30, 40, 50]);

    // Test whether subgroup members are included or not.
    items = [everyone_pill];
    user_ids = user_group_pill.get_user_ids(widget);
    assert.deepEqual(user_ids, [10, 20, 30, 40, 50]);

    // Deactivated users should be excluded.
    people.deactivate(user5);
    user_ids = user_group_pill.get_user_ids(widget);
    assert.deepEqual(user_ids, [10, 20, 30, 40]);
    people.add_active_user(user5);
});

run_test("get_group_ids", () => {
    const items = [admins_pill, everyone_pill];
    const widget = {items: () => items};

    // Subgroups should not be part of the results, we use `everyone_pill` to test that.
    const group_ids = user_group_pill.get_group_ids(widget);
    assert.deepEqual(group_ids, [101, 103]);
});

run_test("append_user_group", () => {
    const items = [admins_pill];
    const widget = {
        appendValidatedData(group) {
            assert.deepEqual(group, testers_pill);
            items.push(testers_pill);
        },
        clear_text() {},
    };

    const group = {
        ...testers,
        members: new Set(testers.members),
    };
    user_group_pill.append_user_group(group, widget);
    assert.deepEqual(items, [admins_pill, testers_pill]);
});

run_test("generate_pill_html", () => {
    assert.deepEqual(
        user_group_pill.generate_pill_html(testers_pill),
        "<div class='pill 'data-user-group-id=\"102\" tabindex=0>\n" +
            '    <span class="pill-label">\n' +
            '        <span class="pill-value">\n' +
            "            Testers\n" +
            '        </span>&nbsp;<span class="group-members-count">(4)</span></span>\n' +
            '    <div class="exit">\n' +
            '        <a role="button" class="zulip-icon zulip-icon-close pill-close-button"></a>\n' +
            "    </div>\n" +
            "</div>\n",
    );
});
```

--------------------------------------------------------------------------------

---[FILE: user_pill.test.cjs]---
Location: zulip-main/web/tests/user_pill.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

const people = zrequire("people");
const user_pill = zrequire("user_pill");
const {set_realm} = zrequire("state_data");

const settings_data = mock_esm("../src/settings_data");

const realm = make_realm();
set_realm(realm);

const alice = {
    email: "alice@example.com",
    user_id: 99,
    full_name: "Alice Barson",
};

const isaac = {
    email: "isaac@example.com",
    user_id: 102,
    full_name: "Isaac Newton",
};

const isaac_duplicate = {
    email: "isaac_duplicate@example.com",
    user_id: 102102,
    full_name: "Isaac Newton",
};

const isaac_item = {
    email: "isaac@example.com",
    full_name: "Isaac Newton",
    type: "user",
    user_id: isaac.user_id,
    deactivated: false,
    img_src: `/avatar/${isaac.user_id}`,
    is_bot: undefined,
    status_emoji_info: undefined,
    should_add_guest_user_indicator: false,
};

const inaccessible_user_id = 103;

const inaccessible_user_item = {
    email: "user103@example.com",
    full_name: "translated: Unknown user",
    type: "user",
    user_id: inaccessible_user_id,
    deactivated: false,
    img_src: `/avatar/${inaccessible_user_id}`,
    is_bot: false,
    status_emoji_info: undefined,
    should_add_guest_user_indicator: false,
};

let pill_widget = {};

function test(label, f) {
    run_test(label, ({override}) => {
        people.init();
        people.add_active_user(alice);
        people.add_active_user(isaac);
        pill_widget = {};
        f({override});
    });
}

test("create_item", ({override}) => {
    function test_create_item(user_id, current_items, expected_item, pill_config) {
        const item = user_pill.create_item_from_user_id(user_id, current_items, pill_config);
        assert.deepEqual(item, expected_item);
    }

    settings_data.user_can_access_all_other_users = () => false;

    test_create_item(isaac_item.user_id.toString(), [], isaac_item);
    test_create_item(isaac_item.user_id.toString(), [isaac_item], undefined);

    override(realm, "realm_bot_domain", "example.com");
    people.add_inaccessible_user(inaccessible_user_id);

    test_create_item(inaccessible_user_id.toString(), [], undefined, {
        exclude_inaccessible_users: true,
    });
    test_create_item(inaccessible_user_id.toString(), [], inaccessible_user_item, {
        exclude_inaccessible_users: false,
    });
});

test("get_unique_full_name_from_item", () => {
    people.add_active_user(isaac);
    people.add_active_user(isaac_duplicate);
    assert.equal(
        user_pill.get_unique_full_name_from_item({user_id: 1, full_name: isaac.full_name}),
        "Isaac Newton|1",
    );
});

test("append", () => {
    let appended;
    let cleared;

    function fake_append(opts) {
        appended = true;
        assert.equal(opts.email, isaac.email);
        assert.equal(opts.full_name, isaac.full_name);
        assert.equal(opts.user_id, isaac.user_id);
        assert.equal(opts.img_src, isaac_item.img_src);
    }

    function fake_clear() {
        cleared = true;
    }

    pill_widget.appendValidatedData = fake_append;
    pill_widget.clear_text = fake_clear;

    user_pill.append_person({
        person: isaac,
        pill_widget,
    });

    assert.ok(appended);
    assert.ok(cleared);

    blueslip.expect("warn", "Undefined user in function append_user");
    user_pill.append_user(undefined, pill_widget);
});

test("get_items", () => {
    const items = [isaac_item];
    pill_widget.items = () => items;

    assert.deepEqual(user_pill.get_user_ids(pill_widget), [isaac.user_id]);
});

test("typeahead", () => {
    const items = [isaac_item];
    pill_widget.items = () => items;

    // Both alice and isaac are in our realm, but isaac will be
    // excluded by virtue of already being one of the widget items.
    // And then bogus_item is just a red herring to test robustness.
    const result = user_pill.typeahead_source(pill_widget);
    assert.deepEqual(result, [{type: "user", user: alice}]);
});
```

--------------------------------------------------------------------------------

---[FILE: user_search.test.cjs]---
Location: zulip-main/web/tests/user_search.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {make_message_list} = require("./lib/message_list.cjs");
const {set_global, mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const fake_buddy_list = {
    scroll_container_selector: "#whatever",
    $users_matching_view_list: {
        attr() {},
    },
    $other_users_list: {
        attr() {},
    },
    find_li() {},
    first_key() {},
    prev_key() {},
    next_key() {},
};

mock_esm("../src/buddy_list", {
    buddy_list: fake_buddy_list,
});

function mock_setTimeout() {
    set_global("setTimeout", (func) => {
        func();
    });
}

const channel = mock_esm("../src/channel");
const popovers = mock_esm("../src/popovers");
const presence = mock_esm("../src/presence");
const sidebar_ui = mock_esm("../src/sidebar_ui");

const activity_ui = zrequire("activity_ui");
const buddy_data = zrequire("buddy_data");
const message_lists = zrequire("message_lists");
const muted_users = zrequire("muted_users");
const people = zrequire("people");
const {set_realm} = zrequire("state_data");
const stream_data = zrequire("stream_data");

const realm = make_realm();
set_realm(realm);

const me = {
    email: "me@zulip.com",
    user_id: 999,
    full_name: "Me Myself",
};

const alice = {
    email: "alice@zulip.com",
    user_id: 1,
    full_name: "Alice Smith",
};
const fred = {
    email: "fred@zulip.com",
    user_id: 2,
    full_name: "Fred Flintstone",
};
const jill = {
    email: "jill@zulip.com",
    user_id: 3,
    full_name: "Jill Hill",
};

const all_user_ids = [alice.user_id, fred.user_id, jill.user_id, me.user_id];
const ordered_user_ids = [me.user_id, alice.user_id, fred.user_id, jill.user_id];

function test(label, f) {
    run_test(label, (opts) => {
        people.init();
        people.add_active_user(alice);
        people.add_active_user(fred);
        people.add_active_user(jill);
        people.add_active_user(me);
        people.initialize_current_user(me.user_id);
        muted_users.set_muted_users([]);
        activity_ui.set_cursor_and_filter();
        return f(opts);
    });
}

function set_input_val(val) {
    $("input.user-list-filter").val(val);
    $("input.user-list-filter").trigger("input");
}

function stub_buddy_list_empty_list_message_lengths() {
    $("#buddy-list-users-matching-view .empty-list-message").length = 0;
    $("#buddy-list-other-users .empty-list-message").length = 0;
}

test("clear_search with button", ({override}) => {
    override(presence, "get_status", () => "active");
    override(presence, "get_user_ids", () => all_user_ids);
    override(popovers, "hide_all", noop);
    $("#buddy-list-loading-subscribers").css = noop;

    stub_buddy_list_empty_list_message_lengths();

    // Empty because no users match this search string.
    override(fake_buddy_list, "populate", (user_ids) => {
        assert.deepEqual(user_ids, {all_user_ids: []});
    });
    set_input_val("somevalue");

    // Now we're clearing the search string and everyone shows up again.
    override(fake_buddy_list, "populate", (user_ids) => {
        assert.deepEqual(user_ids, {all_user_ids: ordered_user_ids});
    });
    $("#userlist-header-search .input-close-filter-button").trigger("click");
    assert.equal($("input.user-list-filter").val(), "");
    $("#userlist-header-search .input-close-filter-button").trigger("click");
});

test("clear_search", ({override}) => {
    override(realm, "realm_presence_disabled", true);
    $("#buddy-list-loading-subscribers").css = noop;

    override(popovers, "hide_all", noop);
    stub_buddy_list_empty_list_message_lengths();

    set_input_val("somevalue");
    activity_ui.clear_search();
    assert.equal($("input.user-list-filter").val(), "");
    activity_ui.clear_search();

    // We need to reset this because the unit tests aren't isolated from each other.
    set_input_val("");
});

test("fetch on search", async ({override}) => {
    override(presence, "get_user_ids", () => all_user_ids);
    override(presence, "get_status", () => "active");
    let populate_call_count = 0;
    override(fake_buddy_list, "populate", () => {
        populate_call_count += 1;
    });
    $("#buddy-list-loading-subscribers").css = noop;
    override(popovers, "hide_all", noop);
    stub_buddy_list_empty_list_message_lengths();

    const office = {stream_id: 23, name: "office", subscribed: true};
    stream_data.add_sub_for_tests(office);
    message_lists.set_current(
        make_message_list([{operator: "stream", operand: office.stream_id.toString()}]),
    );
    let get_call_count = 0;
    channel.get = () => {
        get_call_count += 1;
        return {
            subscribers: [1, 2, 3, 4],
        };
    };
    // Only one fetch should happen.
    set_input_val("somevalu");
    set_input_val("somevalue");
    await activity_ui.await_pending_promise_for_testing();
    assert.equal(get_call_count, 1);
    assert.equal(populate_call_count, 1);

    // Now try updating the narrow and starting a new search, before the old search
    // is resolved. We should make two requests but only only update populate the
    // buddy list for the second fetch (the first fetch returns early).
    get_call_count = 0;
    populate_call_count = 0;
    const kitchen = {stream_id: 25, name: "kitchen", subscribed: true};
    stream_data.add_sub_for_tests(kitchen);
    const living_room = {stream_id: 26, name: "living_room", subscribed: true};
    stream_data.add_sub_for_tests(living_room);
    message_lists.set_current(
        make_message_list([{operator: "stream", operand: kitchen.stream_id.toString()}]),
    );
    set_input_val("somevalue");
    message_lists.set_current(
        make_message_list([{operator: "stream", operand: living_room.stream_id.toString()}]),
    );
    set_input_val("somevalue");
    await activity_ui.await_pending_promise_for_testing();
    assert.equal(get_call_count, 2);
    assert.equal(populate_call_count, 1);

    // We need to reset these because the unit tests aren't isolated from each other.
    message_lists.set_current(undefined);
    activity_ui.clear_search();
    set_input_val("");
});

test("blur search right", ({override}) => {
    override(sidebar_ui, "show_userlist_sidebar", noop);
    override(popovers, "hide_all", noop);
    mock_setTimeout();

    $("input.user-list-filter").closest = (selector) => {
        assert.equal(selector, ".app-main [class^='column-']");
        return $.create("right-sidebar").addClass("column-right");
    };

    $("input.user-list-filter").trigger("blur");
    assert.equal($("input.user-list-filter").is_focused(), false);
    activity_ui.initiate_search();
    assert.equal($("input.user-list-filter").is_focused(), true);
});

test("blur search left", ({override}) => {
    override(sidebar_ui, "show_streamlist_sidebar", noop);
    override(popovers, "hide_all", noop);
    mock_setTimeout();

    $("input.user-list-filter").closest = (selector) => {
        assert.equal(selector, ".app-main [class^='column-']");
        return $.create("right-sidebar").addClass("column-left");
    };

    $("input.user-list-filter").trigger("blur");
    assert.equal($("input.user-list-filter").is_focused(), false);
    activity_ui.initiate_search();
    assert.equal($("input.user-list-filter").is_focused(), true);
});

test("filter_user_ids", ({override}) => {
    const user_presence = {
        [alice.user_id]: "active",
        [fred.user_id]: "active",
        [jill.user_id]: "active",
        [me.user_id]: "active",
    };

    override(presence, "get_status", (user_id) => user_presence[user_id]);
    override(presence, "get_user_ids", () => all_user_ids);

    function test_filter(search_text, expected_users) {
        const expected_user_ids = expected_users.map((user) => user.user_id);
        $("input.user-list-filter").val(search_text);
        const filter_text = activity_ui.get_filter_text();
        assert.deepEqual(
            buddy_data.get_filtered_and_sorted_user_ids(filter_text),
            expected_user_ids,
        );

        override(fake_buddy_list, "populate", ({all_user_ids: user_ids}) => {
            assert.deepEqual(user_ids, expected_user_ids);
        });

        activity_ui.build_user_sidebar();
    }

    // Sanity check data setup.
    assert.deepEqual(buddy_data.get_filtered_and_sorted_user_ids(), [
        me.user_id,
        alice.user_id,
        fred.user_id,
        jill.user_id,
    ]);

    // Test no match for muted users even with filter text.
    test_filter("ji", [jill]);
    muted_users.add_muted_user(jill.user_id);
    test_filter("ji", []);

    muted_users.remove_muted_user(jill.user_id);

    test_filter("abc", []); // no match
    test_filter("fred", [fred]);
    test_filter("fred,alice", [alice, fred]);
    test_filter("fr,al", [alice, fred]); // partials
    test_filter("fr|al", [alice, fred]); // | as OR-operator

    user_presence[alice.user_id] = "idle";
    test_filter("fr,al", [fred, alice]);

    user_presence[alice.user_id] = "active";
    test_filter("fr,al", [alice, fred]);
});

test("searching", () => {
    assert.equal(activity_ui.searching(), false);
    $("input.user-list-filter").trigger("focus");
    assert.equal(activity_ui.searching(), true);
    $("input.user-list-filter").trigger("blur");
    assert.equal(activity_ui.searching(), false);
});
```

--------------------------------------------------------------------------------

---[FILE: user_status.test.cjs]---
Location: zulip-main/web/tests/user_status.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const channel = mock_esm("../src/channel");

const user_status = zrequire("user_status");
const emoji_codes = zrequire("../../static/generated/emoji/emoji_codes.json");
const emoji = zrequire("emoji");
const {initialize_user_settings} = zrequire("user_settings");

initialize_user_settings({user_settings: {}});

const emoji_params = {
    realm_emoji: {
        991: {
            id: "991",
            name: "example_realm_emoji",
            source_url: "/url/for/991",
            still_url: "/url/still/991",
            deactivated: false,
        },
        992: {
            id: "992",
            name: "deactivated_realm_emoji",
            source_url: "/url/for/992",
            still_url: "/url/still/992",
            deactivated: true,
        },
    },
    emoji_codes,
};

emoji.initialize(emoji_params);

function initialize() {
    const params = {
        user_status: {
            1: {status_text: "in a meeting"},
            4: {emoji_name: "smiley", emoji_code: "1f603", reaction_type: "unicode_emoji"},
            5: {
                emoji_name: "deactivated_realm_emoji",
                emoji_code: "992",
                reaction_type: "realm_emoji",
            },
        },
    };
    user_status.initialize(params);
}

run_test("basics", () => {
    initialize();

    assert.deepEqual(user_status.get_status_emoji(5), {
        emoji_code: "992",
        emoji_name: "deactivated_realm_emoji",
        reaction_type: "realm_emoji",
        url: "/url/for/992",
        still_url: "/url/still/992",
    });

    user_status.set_status_emoji({
        id: 1,
        user_id: 5,
        type: "user_status",
        emoji_code: "991",
        emoji_name: "example_realm_emoji",
        reaction_type: "realm_emoji",
        status_text: "",
    });

    assert.deepEqual(user_status.get_status_emoji(5), {
        emoji_alt_code: false,
        emoji_code: "991",
        emoji_name: "example_realm_emoji",
        reaction_type: "realm_emoji",
        still_url: "/url/still/991",
        url: "/url/for/991",
    });

    assert.equal(user_status.get_status_text(1), "in a meeting");

    user_status.set_status_text({
        id: 2,
        user_id: 2,
        type: "user_status",
        status_text: "out to lunch",
        emoji_name: "",
        emoji_code: "",
        reaction_type: "",
    });
    assert.equal(user_status.get_status_text(2), "out to lunch");

    user_status.set_status_text({
        user_id: 2,
        status_text: "",
    });
    assert.equal(user_status.get_status_text(2), undefined);

    user_status.set_status_emoji({
        id: 3,
        user_id: 2,
        type: "user_status",
        emoji_name: "smiley",
        emoji_code: "1f603",
        reaction_type: "unicode_emoji",
        status_text: "",
    });
    assert.deepEqual(user_status.get_status_emoji(2), {
        emoji_name: "smiley",
        emoji_code: "1f603",
        reaction_type: "unicode_emoji",
        emoji_alt_code: false,
    });

    user_status.set_status_emoji({
        id: 4,
        user_id: 2,
        type: "user_status",
        emoji_name: "",
        emoji_code: "",
        reaction_type: "unicode_emoji",
        status_text: "",
    });
    assert.deepEqual(user_status.get_status_emoji(2), undefined);
});

run_test("server", () => {
    initialize();

    let sent_data;
    let success;

    channel.post = (opts) => {
        sent_data = opts.data;
        assert.equal(opts.url, "/json/users/me/status");
        success = opts.success;
    };

    assert.equal(sent_data, undefined);

    let called;

    user_status.server_update_status({
        status_text: "out to lunch",
        success() {
            called = true;
        },
    });

    success();
    assert.ok(called);
});

run_test("defensive checks", () => {
    assert.throws(
        () =>
            user_status.set_status_emoji({
                id: 1,
                status_text: "",
                type: "user_status",
                user_id: 5,
                emoji_name: "emoji",
                // no status code or reaction type.
            }),
        {
            name: "$ZodError",
        },
    );

    assert.throws(
        () =>
            user_status.set_status_emoji({
                id: 2,
                type: "user_status",
                user_id: 5,
                reaction_type: "realm_emoji",
                emoji_name: "does_not_exist",
                emoji_code: "fake_code",
                status_text: "",
            }),
        {
            name: "Error",
            message: "Cannot find realm emoji for code 'fake_code'.",
        },
    );
});
```

--------------------------------------------------------------------------------

---[FILE: user_topics.test.cjs]---
Location: zulip-main/web/tests/user_topics.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {all_visibility_policies} = require("../src/user_topics.ts");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

const user_topics = zrequire("user_topics");
const stream_data = zrequire("stream_data");
const {initialize_user_settings} = zrequire("user_settings");

initialize_user_settings({user_settings: {}});

const design = {
    stream_id: 100,
    name: "design",
};

const devel = {
    stream_id: 101,
    name: "devel",
};

const office = {
    stream_id: 102,
    name: "office",
};

const social = {
    stream_id: 103,
    name: "social",
};

const unknown = {
    stream_id: 999,
    name: "whatever",
};

stream_data.add_sub_for_tests(design);
stream_data.add_sub_for_tests(devel);
stream_data.add_sub_for_tests(office);
stream_data.add_sub_for_tests(social);

function test(label, f) {
    run_test(label, ({override}) => {
        user_topics.set_user_topics([]);
        f({override});
    });
}

test("edge_cases", () => {
    // direct messages
    assert.ok(!user_topics.is_topic_muted(undefined, undefined));
});

test("add_and_remove_mutes", () => {
    assert.ok(!user_topics.is_topic_muted(devel.stream_id, "java"));
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.MUTED,
    );
    assert.ok(user_topics.is_topic_muted(devel.stream_id, "java"));

    // test idempotency
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.MUTED,
    );
    assert.ok(user_topics.is_topic_muted(devel.stream_id, "java"));

    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.INHERIT,
    );
    assert.ok(!user_topics.is_topic_muted(devel.stream_id, "java"));

    // test idempotency
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.INHERIT,
    );
    assert.ok(!user_topics.is_topic_muted(devel.stream_id, "java"));

    // test unknown stream is harmless too
    user_topics.update_user_topics(
        unknown.stream_id,
        unknown.name,
        "java",
        all_visibility_policies.INHERIT,
    );
    assert.ok(!user_topics.is_topic_muted(unknown.stream_id, "java"));
});

test("add_and_remove_unmutes", () => {
    assert.ok(!user_topics.is_topic_unmuted(devel.stream_id, "java"));
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.UNMUTED,
    );
    assert.ok(user_topics.is_topic_unmuted(devel.stream_id, "java"));

    // test idempotency
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.UNMUTED,
    );
    assert.ok(user_topics.is_topic_unmuted(devel.stream_id, "java"));

    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.INHERIT,
    );
    assert.ok(!user_topics.is_topic_unmuted(devel.stream_id, "java"));

    // test idempotency
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.INHERIT,
    );
    assert.ok(!user_topics.is_topic_unmuted(devel.stream_id, "java"));

    // test unknown stream is harmless too
    user_topics.update_user_topics(
        unknown.stream_id,
        unknown.name,
        "java",
        all_visibility_policies.INHERIT,
    );
    assert.ok(!user_topics.is_topic_unmuted(unknown.stream_id, "java"));
});

test("add_and_remove_follows", () => {
    assert.ok(!user_topics.is_topic_followed(devel.stream_id, "java"));
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.FOLLOWED,
    );
    assert.ok(user_topics.is_topic_followed(devel.stream_id, "java"));

    // test idempotency
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.FOLLOWED,
    );
    assert.ok(user_topics.is_topic_followed(devel.stream_id, "java"));

    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.INHERIT,
    );
    assert.ok(!user_topics.is_topic_followed(devel.stream_id, "java"));

    // test idempotency
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.INHERIT,
    );
    assert.ok(!user_topics.is_topic_followed(devel.stream_id, "java"));

    // test unknown stream is harmless too
    user_topics.update_user_topics(
        unknown.stream_id,
        unknown.name,
        "java",
        all_visibility_policies.INHERIT,
    );
    assert.ok(!user_topics.is_topic_followed(unknown.stream_id, "java"));
});

test("get_mutes", () => {
    assert.deepEqual(
        user_topics.get_user_topics_for_visibility_policy(
            user_topics.all_visibility_policies.MUTED,
        ),
        [],
    );
    user_topics.update_user_topics(
        office.stream_id,
        office.name,
        "gossip",
        all_visibility_policies.MUTED,
        1577836800,
    );
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.MUTED,
        1577836700,
    );
    const all_muted_topics = user_topics.get_user_topics_for_visibility_policy(
        user_topics.all_visibility_policies.MUTED,
    );
    all_muted_topics.sort((a, b) => a.date_updated - b.date_updated);

    assert.deepEqual(all_muted_topics, [
        {
            date_updated: 1577836700000,
            date_updated_str: "Dec 31, 2019",
            stream: devel.name,
            stream_id: devel.stream_id,
            topic: "java",
            visibility_policy: all_visibility_policies.MUTED,
        },
        {
            date_updated: 1577836800000,
            date_updated_str: "Jan 1, 2020",
            stream: office.name,
            stream_id: office.stream_id,
            topic: "gossip",
            visibility_policy: all_visibility_policies.MUTED,
        },
    ]);
});

test("get_unmutes", () => {
    assert.deepEqual(
        user_topics.get_user_topics_for_visibility_policy(
            user_topics.all_visibility_policies.UNMUTED,
        ),
        [],
    );
    user_topics.update_user_topics(
        office.stream_id,
        office.name,
        "gossip",
        all_visibility_policies.UNMUTED,
        1577836800,
    );
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.UNMUTED,
        1577836700,
    );
    const all_unmuted_topics = user_topics.get_user_topics_for_visibility_policy(
        user_topics.all_visibility_policies.UNMUTED,
    );
    all_unmuted_topics.sort((a, b) => a.date_updated - b.date_updated);

    assert.deepEqual(all_unmuted_topics, [
        {
            date_updated: 1577836700000,
            date_updated_str: "Dec 31, 2019",
            stream: devel.name,
            stream_id: devel.stream_id,
            topic: "java",
            visibility_policy: all_visibility_policies.UNMUTED,
        },
        {
            date_updated: 1577836800000,
            date_updated_str: "Jan 1, 2020",
            stream: office.name,
            stream_id: office.stream_id,
            topic: "gossip",
            visibility_policy: all_visibility_policies.UNMUTED,
        },
    ]);
});

test("get_follows", () => {
    assert.deepEqual(
        user_topics.get_user_topics_for_visibility_policy(
            user_topics.all_visibility_policies.FOLLOWED,
        ),
        [],
    );
    user_topics.update_user_topics(
        office.stream_id,
        office.name,
        "gossip",
        all_visibility_policies.FOLLOWED,
        1577836800,
    );
    user_topics.update_user_topics(
        devel.stream_id,
        devel.name,
        "java",
        all_visibility_policies.FOLLOWED,
        1577836700,
    );
    const all_followed_topics = user_topics.get_user_topics_for_visibility_policy(
        user_topics.all_visibility_policies.FOLLOWED,
    );
    all_followed_topics.sort((a, b) => a.date_updated - b.date_updated);

    assert.deepEqual(all_followed_topics, [
        {
            date_updated: 1577836700000,
            date_updated_str: "Dec 31, 2019",
            stream: devel.name,
            stream_id: devel.stream_id,
            topic: "java",
            visibility_policy: all_visibility_policies.FOLLOWED,
        },
        {
            date_updated: 1577836800000,
            date_updated_str: "Jan 1, 2020",
            stream: office.name,
            stream_id: office.stream_id,
            topic: "gossip",
            visibility_policy: all_visibility_policies.FOLLOWED,
        },
    ]);
});

test("set_user_topics", () => {
    blueslip.expect("warn", "Unknown stream ID in set_user_topic: 999");

    user_topics.set_user_topics([]);
    assert.ok(!user_topics.is_topic_muted(social.stream_id, "breakfast"));
    assert.ok(!user_topics.is_topic_muted(design.stream_id, "typography"));
    assert.ok(!user_topics.is_topic_unmuted(office.stream_id, "lunch"));
    assert.ok(!user_topics.is_topic_followed(devel.stream_id, "dinner"));

    const test_user_topics_params = [
        {
            stream_id: social.stream_id,
            topic_name: "breakfast",
            last_updated: 1577836800,
            visibility_policy: all_visibility_policies.MUTED,
        },
        {
            stream_id: design.stream_id,
            topic_name: "typography",
            last_updated: 1577836800,
            visibility_policy: all_visibility_policies.MUTED,
        },
        {
            stream_id: 999, // BOGUS STREAM ID
            topic_name: "random",
            last_updated: 1577836800,
            visibility_policy: all_visibility_policies.MUTED,
        },
        {
            stream_id: office.stream_id,
            topic_name: "lunch",
            last_updated: 1577836800,
            visibility_policy: all_visibility_policies.UNMUTED,
        },
        {
            stream_id: devel.stream_id,
            topic_name: "dinner",
            last_updated: 1577836800,
            visibility_policy: all_visibility_policies.FOLLOWED,
        },
    ];

    user_topics.initialize({user_topics: test_user_topics_params});

    assert.deepEqual(
        user_topics.get_user_topics_for_visibility_policy(
            user_topics.all_visibility_policies.MUTED,
        ),
        [
            {
                date_updated: 1577836800000,
                date_updated_str: "Jan 1, 2020",
                stream: social.name,
                stream_id: social.stream_id,
                topic: "breakfast",
                visibility_policy: all_visibility_policies.MUTED,
            },
            {
                date_updated: 1577836800000,
                date_updated_str: "Jan 1, 2020",
                stream: design.name,
                stream_id: design.stream_id,
                topic: "typography",
                visibility_policy: all_visibility_policies.MUTED,
            },
        ],
    );

    assert.deepEqual(
        user_topics.get_user_topics_for_visibility_policy(
            user_topics.all_visibility_policies.UNMUTED,
        ),
        [
            {
                date_updated: 1577836800000,
                date_updated_str: "Jan 1, 2020",
                stream: office.name,
                stream_id: office.stream_id,
                topic: "lunch",
                visibility_policy: all_visibility_policies.UNMUTED,
            },
        ],
    );

    assert.deepEqual(
        user_topics.get_user_topics_for_visibility_policy(
            user_topics.all_visibility_policies.FOLLOWED,
        ),
        [
            {
                date_updated: 1577836800000,
                date_updated_str: "Jan 1, 2020",
                stream: devel.name,
                stream_id: devel.stream_id,
                topic: "dinner",
                visibility_policy: all_visibility_policies.FOLLOWED,
            },
        ],
    );

    user_topics.set_user_topic({
        stream_id: design.stream_id,
        topic_name: "typography",
        last_updated: "1577836800",
        visibility_policy: all_visibility_policies.INHERIT,
    });
    assert.ok(!user_topics.is_topic_muted(design.stream_id, "typography"));

    user_topics.set_user_topic({
        stream_id: office.stream_id,
        topic_name: "lunch",
        last_updated: "1577836800",
        visibility_policy: all_visibility_policies.INHERIT,
    });
    assert.ok(!user_topics.is_topic_unmuted(devel.stream_id, "lunch"));

    user_topics.set_user_topic({
        stream_id: devel.stream_id,
        topic_name: "dinner",
        last_updated: "1577836800",
        visibility_policy: all_visibility_policies.INHERIT,
    });
    assert.ok(!user_topics.is_topic_followed(devel.stream_id, "dinner"));
});

test("case_insensitivity", () => {
    user_topics.set_user_topics([]);
    assert.ok(!user_topics.is_topic_muted(social.stream_id, "breakfast"));
    user_topics.set_user_topics([
        {
            stream_id: social.stream_id,
            topic_name: "breakfast",
            last_updated: "1577836800",
            visibility_policy: all_visibility_policies.MUTED,
        },
    ]);
    assert.ok(user_topics.is_topic_muted(social.stream_id, "breakfast"));
    assert.ok(user_topics.is_topic_muted(social.stream_id, "breakFAST"));
});
```

--------------------------------------------------------------------------------

````
