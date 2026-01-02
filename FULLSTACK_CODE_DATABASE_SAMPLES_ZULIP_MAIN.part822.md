---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 822
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 822 of 1290)

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

---[FILE: stream_list_sort.test.cjs]---
Location: zulip-main/web/tests/stream_list_sort.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const _ = require("lodash");

const {make_realm} = require("./lib/example_realm.cjs");
const {make_stream} = require("./lib/example_stream.cjs");
const {make_message_list} = require("./lib/message_list.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const stream_data = zrequire("stream_data");
const state_data = zrequire("state_data");
const stream_list_sort = zrequire("stream_list_sort");
const settings_config = zrequire("settings_config");
const stream_topic_history = zrequire("stream_topic_history");
const message_lists = zrequire("message_lists");
const channel_folders = zrequire("channel_folders");
const {initialize_user_settings} = zrequire("user_settings");

state_data.set_realm(
    make_realm({
        realm_empty_topic_display_name: "general chat",
    }),
);

// Start with always filtering out inactive streams.
const user_settings = {
    demote_inactive_streams: settings_config.demote_inactive_streams_values.always.code,
};
initialize_user_settings({user_settings});
stream_list_sort.set_filter_out_inactives();

const frontend_folder = {
    name: "Frontend",
    description: "Channels for frontend discussions",
    rendered_description: "<p>Channels for frontend discussions</p>",
    creator_id: null,
    date_created: 1596710000,
    id: 1,
    is_archived: false,
    order: 3,
};
const backend_folder = {
    name: "Backend",
    description: "Channels for backend discussions",
    rendered_description: "<p>Channels for backend discussions</p>",
    creator_id: null,
    date_created: 1596720000,
    id: 2,
    is_archived: false,
    order: 2,
};
const expect_demoted_folder = {
    name: "Empty",
    description: "This folder has no active or unmuted channels",
    rendered_description: "<p>This folder has no active or unmuted channels</p>",
    creator_id: null,
    date_created: 1596720000,
    id: 3,
    is_archived: false,
    order: 1,
};

const scalene = make_stream({
    subscribed: true,
    name: "scalene",
    stream_id: 1,
    pin_to_top: true,
    is_recently_active: true,
    folder_id: frontend_folder.id,
});
const fast_tortoise = make_stream({
    subscribed: true,
    name: "fast tortoise",
    stream_id: 2,
    pin_to_top: false,
    is_recently_active: true,
    folder_id: frontend_folder.id,
});
const pneumonia = make_stream({
    subscribed: true,
    name: "pneumonia",
    stream_id: 3,
    pin_to_top: false,
    is_recently_active: false,
    folder_id: frontend_folder.id,
});
const clarinet = make_stream({
    subscribed: true,
    name: "clarinet",
    stream_id: 4,
    pin_to_top: false,
    is_recently_active: true,
});
const weaving = make_stream({
    subscribed: false,
    name: "weaving",
    stream_id: 5,
    pin_to_top: false,
    is_recently_active: true,
});
const stream_hyphen_underscore_slash_colon = make_stream({
    subscribed: true,
    name: "stream-hyphen_underscore/slash:colon",
    stream_id: 6,
    pin_to_top: false,
    is_recently_active: true,
    folder_id: backend_folder.id,
});
const muted_active = make_stream({
    subscribed: true,
    name: "muted active",
    stream_id: 7,
    pin_to_top: false,
    is_recently_active: true,
    is_muted: true,
    folder_id: frontend_folder.id,
});
const muted_pinned = make_stream({
    subscribed: true,
    name: "muted pinned",
    stream_id: 8,
    pin_to_top: true,
    is_recently_active: true,
    is_muted: true,
});
const archived = make_stream({
    subscribed: true,
    name: "archived channel",
    stream_id: 9,
    pin_to_top: true,
    is_archived: true,
});
const muted = make_stream({
    subscribed: true,
    name: "muted",
    stream_id: 10,
    pin_to_top: false,
    is_recently_active: true,
    is_muted: true,
    folder_id: expect_demoted_folder.id,
});
const inactive = make_stream({
    subscribed: true,
    name: "inactive",
    stream_id: 11,
    pin_to_top: false,
    is_recently_active: false,
    is_muted: false,
    folder_id: expect_demoted_folder.id,
});

channel_folders.initialize({
    channel_folders: [frontend_folder, backend_folder, expect_demoted_folder],
});

function add_all_subs() {
    stream_data.add_sub_for_tests(scalene);
    stream_data.add_sub_for_tests(fast_tortoise);
    stream_data.add_sub_for_tests(pneumonia);
    stream_data.add_sub_for_tests(clarinet);
    stream_data.add_sub_for_tests(weaving);
    stream_data.add_sub_for_tests(stream_hyphen_underscore_slash_colon);
    stream_data.add_sub_for_tests(muted_active);
    stream_data.add_sub_for_tests(muted_pinned);
    stream_data.add_sub_for_tests(archived);
    stream_data.add_sub_for_tests(muted);
    stream_data.add_sub_for_tests(inactive);
}

function sort_groups(query) {
    const streams = stream_data.subscribed_stream_ids();
    return stream_list_sort.sort_groups(streams, query);
}

function test(label, f) {
    run_test(label, (helpers) => {
        stream_data.clear_subscriptions();
        f(helpers);
    });
}

test("no_subscribed_streams", () => {
    const sorted = sort_groups("");
    assert.deepEqual(sorted, {
        sections: [
            {
                id: "pinned-streams",
                folder_id: null,
                inactive_streams: [],
                muted_streams: [],
                section_title: "translated: PINNED CHANNELS",
                streams: [],
            },
            {
                id: "normal-streams",
                folder_id: null,
                inactive_streams: [],
                muted_streams: [],
                section_title: "translated: CHANNELS",
                streams: [],
            },
        ],
        same_as_before: sorted.same_as_before,
    });
});

test("basics", ({override}) => {
    add_all_subs();

    // Test sorting into categories/alphabetized
    let sorted_sections = sort_groups("").sections;
    const pinned = sorted_sections[0];
    assert.deepEqual(pinned.id, "pinned-streams");
    assert.deepEqual(pinned.streams, [scalene.stream_id]);
    assert.deepEqual(pinned.muted_streams, [muted_pinned.stream_id]);
    const normal = sorted_sections[1];
    assert.deepEqual(normal.id, "normal-streams");
    assert.deepEqual(normal.streams, [
        clarinet.stream_id,
        fast_tortoise.stream_id,
        stream_hyphen_underscore_slash_colon.stream_id,
    ]);
    assert.deepEqual(normal.muted_streams, [muted.stream_id, muted_active.stream_id]);
    assert.deepEqual(normal.inactive_streams, [inactive.stream_id, pneumonia.stream_id]);

    assert.deepEqual(stream_list_sort.get_stream_ids(), [
        scalene.stream_id,
        muted_pinned.stream_id,
        clarinet.stream_id,
        fast_tortoise.stream_id,
        stream_hyphen_underscore_slash_colon.stream_id,
        muted.stream_id,
        muted_active.stream_id,
        inactive.stream_id,
        pneumonia.stream_id,
    ]);

    assert.equal(
        stream_list_sort.current_section_id_for_stream(scalene.stream_id),
        "pinned-streams",
    );
    assert.equal(
        stream_list_sort.current_section_id_for_stream(clarinet.stream_id),
        "normal-streams",
    );

    // Test filtering
    sorted_sections = sort_groups("s").sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].id, "pinned-streams");
    assert.deepEqual(sorted_sections[0].streams, [scalene.stream_id]);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].id, "normal-streams");
    assert.deepEqual(sorted_sections[1].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].streams, [stream_hyphen_underscore_slash_colon.stream_id]);

    // Test searching entire word, case-insensitive
    sorted_sections = sort_groups("PnEuMoNiA").sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].streams, []);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].streams, []);
    assert.deepEqual(sorted_sections[1].inactive_streams, [pneumonia.stream_id]);

    // Test searching part of word
    sorted_sections = sort_groups("tortoise").sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].streams, []);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].id, "normal-streams");
    assert.deepEqual(sorted_sections[1].streams, [fast_tortoise.stream_id]);
    assert.deepEqual(sorted_sections[1].inactive_streams, []);

    // Test searching stream with spaces
    sorted_sections = sort_groups("fast t").sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].streams, []);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].id, "normal-streams");
    assert.deepEqual(sorted_sections[1].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].streams, [fast_tortoise.stream_id]);

    // Test searching part of stream name with non space word separators
    sorted_sections = sort_groups("hyphen").sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].streams, []);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].id, "normal-streams");
    assert.deepEqual(sorted_sections[1].streams, [stream_hyphen_underscore_slash_colon.stream_id]);
    assert.deepEqual(sorted_sections[1].inactive_streams, []);

    sorted_sections = sort_groups("hyphen_underscore").sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].streams, []);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].id, "normal-streams");
    assert.deepEqual(sorted_sections[1].streams, [stream_hyphen_underscore_slash_colon.stream_id]);
    assert.deepEqual(sorted_sections[1].inactive_streams, []);

    sorted_sections = sort_groups("colon").sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].streams, []);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].id, "normal-streams");
    assert.deepEqual(sorted_sections[1].streams, [stream_hyphen_underscore_slash_colon.stream_id]);
    assert.deepEqual(sorted_sections[1].inactive_streams, []);

    sorted_sections = sort_groups("underscore").sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].streams, []);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].id, "normal-streams");
    assert.deepEqual(sorted_sections[1].streams, [stream_hyphen_underscore_slash_colon.stream_id]);
    assert.deepEqual(sorted_sections[1].inactive_streams, []);

    // Only show pinned channels
    sorted_sections = sort_groups("pinned").sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].id, "pinned-streams");
    assert.deepEqual(sorted_sections[0].streams, [scalene.stream_id]);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].id, "normal-streams");
    assert.deepEqual(sorted_sections[1].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].streams, []);

    override(user_settings, "web_left_sidebar_show_channel_folders", true);
    sorted_sections = sort_groups("").sections;
    assert.deepEqual(sorted_sections.length, 5);
    assert.deepEqual(sorted_sections[0].id, "pinned-streams");
    assert.deepEqual(sorted_sections[0].section_title, "translated: PINNED CHANNELS");
    assert.deepEqual(sorted_sections[1].id, backend_folder.id.toString());
    assert.deepEqual(sorted_sections[1].section_title, "BACKEND");
    assert.deepEqual(sorted_sections[2].id, frontend_folder.id.toString());
    assert.deepEqual(sorted_sections[2].section_title, "FRONTEND");
    assert.deepEqual(sorted_sections[3].id, "normal-streams");
    assert.deepEqual(sorted_sections[3].section_title, "translated: OTHER");
    assert.deepEqual(sorted_sections[4].id, expect_demoted_folder.id.toString());
    assert.deepEqual(sorted_sections[4].section_title, "EMPTY");

    // If both `pin_to_top` is true and folder_id is set, as in
    // the channel `scalene`, then the channel ends up in the pinned
    // section and `folder_id` is ignored.
    assert.deepEqual(sorted_sections[0].streams, [scalene.stream_id]);
    assert.deepEqual(sorted_sections[0].muted_streams, [muted_pinned.stream_id]);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].streams, [stream_hyphen_underscore_slash_colon.stream_id]);
    assert.deepEqual(sorted_sections[1].muted_streams, []);
    assert.deepEqual(sorted_sections[1].inactive_streams, []);
    assert.deepEqual(sorted_sections[2].streams, [fast_tortoise.stream_id]);
    assert.deepEqual(sorted_sections[2].muted_streams, [muted_active.stream_id]);
    assert.deepEqual(sorted_sections[2].inactive_streams, [pneumonia.stream_id]);
    assert.deepEqual(sorted_sections[3].streams, [clarinet.stream_id]);
    assert.deepEqual(sorted_sections[3].muted_streams, []);
    assert.deepEqual(sorted_sections[3].inactive_streams, []);
    assert.deepEqual(sorted_sections[4].streams, []);
    assert.deepEqual(sorted_sections[4].muted_streams, [muted.stream_id]);
    assert.deepEqual(sorted_sections[4].inactive_streams, [inactive.stream_id]);

    // The first and last sections are invariant. The intermediate sections
    // are arranged by the `order` field in the channel folder object.
    assert.deepEqual(stream_list_sort.section_ids(), [
        "pinned-streams",
        backend_folder.id.toString(), // order 2
        frontend_folder.id.toString(), // order 3
        "normal-streams",
        // This folder is at the bottom because no active + unmuted streams,
        // despite being order 1.
        expect_demoted_folder.id.toString(),
    ]);

    // Only show other channels
    sorted_sections = sort_groups("other").sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].id, "pinned-streams");
    assert.deepEqual(sorted_sections[0].streams, []);
    assert.deepEqual(sorted_sections[0].inactive_streams, []);
    assert.deepEqual(sorted_sections[1].section_title, "translated: OTHER");
    assert.deepEqual(sorted_sections[1].streams, [clarinet.stream_id]);
    assert.deepEqual(sorted_sections[1].muted_streams, []);
    assert.deepEqual(sorted_sections[1].inactive_streams, []);
});

test("current_section_id_for_stream", ({override}) => {
    override(user_settings, "web_left_sidebar_show_channel_folders", false);
    add_all_subs();

    sort_groups("");
    assert.equal(
        stream_list_sort.current_section_id_for_stream(scalene.stream_id),
        "pinned-streams",
    );
    for (const stream_id of [
        clarinet.stream_id,
        fast_tortoise.stream_id,
        stream_hyphen_underscore_slash_colon.stream_id,
    ]) {
        assert.equal(stream_list_sort.current_section_id_for_stream(stream_id), "normal-streams");
    }

    override(user_settings, "web_left_sidebar_show_channel_folders", true);
    sort_groups("");
    // Now fast_tortoise should appear in its respective folder.
    assert.equal(
        stream_list_sort.current_section_id_for_stream(scalene.stream_id),
        "pinned-streams",
    );
    assert.equal(
        stream_list_sort.current_section_id_for_stream(clarinet.stream_id),
        "normal-streams",
    );
    assert.equal(
        stream_list_sort.current_section_id_for_stream(fast_tortoise.stream_id),
        String(frontend_folder.id),
    );
    assert.equal(
        stream_list_sort.current_section_id_for_stream(
            stream_hyphen_underscore_slash_colon.stream_id,
        ),
        String(backend_folder.id),
    );

    override(user_settings, "web_left_sidebar_show_channel_folders", true);
    sort_groups("");
    assert.deepEqual(stream_list_sort.get_current_sections(), [
        {
            folder_id: null,
            id: "pinned-streams",
            inactive_streams: [],
            muted_streams: [8],
            section_title: "translated: PINNED CHANNELS",
            streams: [1],
        },
        {
            folder_id: 2,
            id: "2",
            inactive_streams: [],
            muted_streams: [],
            order: 2,
            section_title: "BACKEND",
            streams: [6],
        },
        {
            folder_id: 1,
            id: "1",
            inactive_streams: [3],
            muted_streams: [7],
            order: 3,
            section_title: "FRONTEND",
            streams: [2],
        },
        {
            folder_id: null,
            id: "normal-streams",
            inactive_streams: [],
            muted_streams: [],
            section_title: "translated: OTHER",
            streams: [4],
        },
        {
            folder_id: 3,
            id: "3",
            inactive_streams: [11],
            muted_streams: [10],
            order: 1,
            section_title: "EMPTY",
            streams: [],
        },
    ]);
});

test("left_sidebar_search", ({override}) => {
    // If a topic in the current channel matches the search query,
    // the channel should appear in its corresponding section in the result.
    add_all_subs();

    function setup_search_around_stream(stream) {
        message_lists.set_current(
            make_message_list([{operator: "stream", operand: stream.stream_id.toString()}]),
        );
        const history = stream_topic_history.find_or_create(stream.stream_id);
        history.add_or_update("an important topic", 1);
        return stream_list_sort.sort_groups(
            stream_data.subscribed_stream_ids().filter((id) => id !== stream.stream_id),
            "import",
        ).sections;
    }
    let sorted_sections = setup_search_around_stream(scalene);
    // The topic matches the search query, so the stream appears in the search result.
    // Since `pin_to_top` is true for scalene, it should be in that section.
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].streams, [scalene.stream_id]);

    sorted_sections = stream_list_sort.sort_groups(
        stream_data.subscribed_stream_ids().filter((id) => id !== scalene.stream_id),
        "any",
    ).sections;
    assert.deepEqual(sorted_sections.length, 2);
    assert.deepEqual(sorted_sections[0].streams, []);
    assert.deepEqual(sorted_sections[1].streams, []);

    // Testing the same for custom sections.
    override(user_settings, "web_left_sidebar_show_channel_folders", true);
    sorted_sections = setup_search_around_stream(fast_tortoise);
    // Since no channel in the section `BACKEND` matched the query, it
    // didn't make it to here.
    assert.deepEqual(sorted_sections.length, 3);
    assert.deepEqual(sorted_sections[1].folder_id, fast_tortoise.folder_id);
    assert.deepEqual(sorted_sections[1].streams, [fast_tortoise.stream_id]);
    assert.deepEqual(sorted_sections[0].streams, []);
    assert.deepEqual(sorted_sections[2].streams, []);
});

test("filter inactives", ({override}) => {
    // Test that we automatically switch to filtering out inactive streams
    // once the user has more than 30 streams.
    override(
        user_settings,
        "demote_inactive_streams",
        settings_config.demote_inactive_streams_values.automatic.code,
    );

    stream_list_sort.set_filter_out_inactives();
    assert.ok(!stream_list_sort.is_filtering_inactives());

    _.times(30, (i) => {
        const name = "random" + i.toString();
        const stream_id = 100 + i;

        const sub = {
            name,
            subscribed: true,
            newly_subscribed: false,
            stream_id,
        };
        stream_data.add_sub_for_tests(sub);
    });
    stream_list_sort.set_filter_out_inactives();

    assert.ok(stream_list_sort.is_filtering_inactives());

    override(
        user_settings,
        "demote_inactive_streams",
        settings_config.demote_inactive_streams_values.never.code,
    );
    stream_list_sort.set_filter_out_inactives();
    assert.ok(!stream_list_sort.is_filtering_inactives());
    // Even inactive channels are marked active.
    assert.ok(!pneumonia.is_recently_active);
    assert.ok(stream_list_sort.has_recent_activity(pneumonia));
});

test("initialize", ({override}) => {
    override(user_settings, "demote_inactive_streams", 1);
    stream_list_sort.initialize();

    assert.ok(!stream_list_sort.is_filtering_inactives());
});
```

--------------------------------------------------------------------------------

---[FILE: stream_pill.test.cjs]---
Location: zulip-main/web/tests/stream_pill.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_user_group} = require("./lib/example_group.cjs");
const {make_realm} = require("./lib/example_realm.cjs");
const example_settings = require("./lib/example_settings.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const peer_data = zrequire("peer_data");
const people = zrequire("people");
const {set_current_user, set_realm} = zrequire("state_data");
const stream_data = zrequire("stream_data");
const stream_pill = zrequire("stream_pill");
const user_groups = zrequire("user_groups");

const current_user = {};
const realm = make_realm();
set_current_user(current_user);
set_realm(realm);

const me = {
    email: "me@example.com",
    user_id: 5,
    full_name: "Me Myself",
};

const me_group = make_user_group({
    name: "me_group",
    id: 1,
    members: new Set([me.user_id]),
    is_system_group: false,
    direct_subgroup_ids: new Set(),
});
const nobody_group = make_user_group({
    name: "nobody_group",
    id: 2,
    members: new Set(),
    is_system_group: false,
    direct_subgroup_ids: new Set(),
});

const denmark = {
    stream_id: 101,
    name: "Denmark",
    subscribed: true,
    can_administer_channel_group: nobody_group.id,
    can_add_subscribers_group: nobody_group.id,
    can_subscribe_group: nobody_group.id,
};
const sweden = {
    stream_id: 102,
    name: "Sweden",
    subscribed: false,
    can_administer_channel_group: nobody_group.id,
    can_add_subscribers_group: nobody_group.id,
    can_subscribe_group: nobody_group.id,
};
const germany = {
    stream_id: 103,
    name: "Germany",
    subscribed: false,
    invite_only: true,
    can_administer_channel_group: nobody_group.id,
    can_add_subscribers_group: nobody_group.id,
    can_subscribe_group: nobody_group.id,
};

const denmark_pill = {
    type: "stream",
    stream_id: denmark.stream_id,
    show_subscriber_count: true,
};
const sweden_pill = {
    type: "stream",
    stream_id: sweden.stream_id,
    show_subscriber_count: true,
};

const subs = [denmark, sweden, germany];
for (const sub of subs) {
    stream_data.add_sub_for_tests(sub);
}

peer_data.set_subscribers(denmark.stream_id, [1, 2, 77]);
peer_data.set_subscribers(sweden.stream_id, [1, 2, 3, 4, 5]);

people.add_active_user(me);
people.initialize_current_user(me.user_id);

user_groups.initialize({realm_user_groups: [me_group, nobody_group]});

run_test("create_item", ({override}) => {
    override(current_user, "user_id", me.user_id);
    override(current_user, "is_admin", true);
    override(
        realm,
        "server_supported_permission_settings",
        example_settings.server_supported_permission_settings,
    );
    override(realm, "realm_can_add_subscribers_group", me_group.id);
    function test_create_item(
        stream_name,
        current_items,
        expected_item,
        stream_prefix_required = true,
        get_allowed_streams = stream_data.get_unsorted_subs,
    ) {
        const item = stream_pill.create_item_from_stream_name(
            stream_name,
            current_items,
            stream_prefix_required,
            get_allowed_streams,
        );
        assert.deepEqual(item, expected_item);
    }

    test_create_item("sweden", [], undefined);
    test_create_item("#sweden", [sweden_pill], undefined);
    test_create_item("  #sweden", [], sweden_pill);
    test_create_item("#test", [], undefined);
    test_create_item("#germany", [], undefined, true, stream_data.get_invite_stream_data);
});

run_test("display_value", () => {
    assert.deepEqual(stream_pill.get_display_value_from_item(denmark_pill), "Denmark");
    assert.deepEqual(stream_pill.get_display_value_from_item(sweden_pill), "Sweden");
    sweden_pill.show_subscriber_count = false;
    assert.deepEqual(stream_pill.get_display_value_from_item(sweden_pill), "Sweden");
});

run_test("get_stream_id", () => {
    assert.equal(stream_pill.get_stream_name_from_item(denmark_pill), denmark.name);
});

run_test("get_user_ids", async () => {
    const items = [denmark_pill, sweden_pill];
    const widget = {items: () => items};

    const user_ids = await stream_pill.get_user_ids(widget);
    assert.deepEqual(user_ids, [1, 2, 3, 4, 5, 77]);
});

run_test("get_stream_ids", () => {
    const items = [denmark_pill, sweden_pill];
    const widget = {items: () => items};

    const stream_ids = stream_pill.get_stream_ids(widget);
    assert.deepEqual(stream_ids, [101, 102]);
});

run_test("generate_pill_html", () => {
    assert.deepEqual(
        stream_pill.generate_pill_html(denmark_pill),
        "<div class='pill 'data-stream-id=\"101\" tabindex=0>\n" +
            '    <span class="pill-label">\n' +
            '        <span class="pill-value">\n' +
            '<i class="zulip-icon zulip-icon-hashtag channel-privacy-type-icon" aria-hidden="true"></i>            Denmark\n' +
            "        </span></span>\n" +
            '    <div class="exit">\n' +
            '        <a role="button" class="zulip-icon zulip-icon-close pill-close-button"></a>\n' +
            "    </div>\n" +
            "</div>\n",
    );
});
```

--------------------------------------------------------------------------------

---[FILE: stream_settings_ui.test.cjs]---
Location: zulip-main/web/tests/stream_settings_ui.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_user_group} = require("./lib/example_group.cjs");
const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const denmark_stream_id = 101;

const scroll_util = mock_esm("../src/scroll_util", {
    get_content_element: ($element) => $element,
});

mock_esm("../src/hash_util", {
    channel_url_by_user_setting() {},
});

mock_esm("../src/browser_history", {
    update() {},
});

mock_esm("../src/hash_parser", {
    get_current_hash_section: () => denmark_stream_id,
});

mock_esm("../src/group_permission_settings", {
    get_group_permission_setting_config() {
        return {
            allow_everyone_group: false,
        };
    },
});

mock_esm("../src/resize", {
    resize_settings_overlay() {},
});

set_global("page_params", {});

const {set_current_user, set_realm} = zrequire("state_data");
const stream_data = zrequire("stream_data");
const stream_settings_components = zrequire("stream_settings_components");
const stream_settings_ui = zrequire("stream_settings_ui");
const user_groups = zrequire("user_groups");
const {initialize_user_settings} = zrequire("user_settings");

const realm = make_realm();
set_realm(realm);
set_current_user({});
initialize_user_settings({user_settings: {}});

const admins_group = make_user_group({
    name: "Admins",
    id: 1,
    members: new Set([1]),
    is_system_group: true,
    direct_subgroup_ids: new Set(),
});
const nobody_group = make_user_group({
    name: "Nobody",
    id: 2,
    members: new Set(),
    is_system_group: true,
    direct_subgroup_ids: new Set(),
});
const initialize_user_groups = () => {
    user_groups.initialize({realm_user_groups: [admins_group, nobody_group]});
};

run_test("redraw_left_panel", ({override, mock_template}) => {
    initialize_user_groups();
    override(realm, "realm_can_add_subscribers_group", admins_group.id);

    // set-up sub rows stubs
    const denmark = {
        elem: "denmark",
        subscribed: false,
        name: "Denmark",
        stream_id: denmark_stream_id,
        description: "Copenhagen",
        subscribers: [1],
        stream_weekly_traffic: null,
        color: "red",
        can_administer_channel_group: nobody_group.id,
        can_remove_subscribers_group: admins_group.id,
        can_add_subscribers_group: admins_group.id,
        can_subscribe_group: admins_group.id,
        date_created: 1691057093,
        creator_id: null,
        subscriber_count: 0,
    };
    const poland = {
        elem: "poland",
        subscribed: true,
        name: "Poland",
        stream_id: 102,
        description: "monday",
        subscribers: [1, 2, 3],
        stream_weekly_traffic: 13,
        color: "red",
        can_administer_channel_group: nobody_group.id,
        can_remove_subscribers_group: admins_group.id,
        can_add_subscribers_group: admins_group.id,
        can_subscribe_group: admins_group.id,
        date_created: 1691057093,
        creator_id: null,
        subscriber_count: 0,
    };
    const pomona = {
        elem: "pomona",
        subscribed: true,
        name: "Pomona",
        stream_id: 103,
        description: "college",
        subscribers: [],
        stream_weekly_traffic: 0,
        color: "red",
        can_remove_subscribers_group: admins_group.id,
        can_administer_channel_group: nobody_group.id,
        can_add_subscribers_group: admins_group.id,
        can_subscribe_group: admins_group.id,
        date_created: 1691057093,
        creator_id: null,
        subscriber_count: 0,
    };
    const cpp = {
        elem: "cpp",
        subscribed: true,
        name: "C++",
        stream_id: 104,
        description: "programming lang",
        subscribers: [1, 2],
        stream_weekly_traffic: 6,
        color: "red",
        can_administer_channel_group: nobody_group.id,
        can_remove_subscribers_group: admins_group.id,
        can_add_subscribers_group: admins_group.id,
        can_subscribe_group: admins_group.id,
        date_created: 1691057093,
        creator_id: null,
        subscriber_count: 0,
    };
    const zzyzx = {
        elem: "zzyzx",
        subscribed: true,
        name: "Zzyzx",
        stream_id: 105,
        description: "california town",
        subscribers: [1, 2],
        stream_weekly_traffic: 6,
        color: "red",
        can_administer_channel_group: nobody_group.id,
        can_remove_subscribers_group: admins_group.id,
        can_add_subscribers_group: admins_group.id,
        can_subscribe_group: admins_group.id,
        date_created: 1691057093,
        creator_id: null,
        subscriber_count: 0,
    };
    const abcd = {
        elem: "abcd",
        subscribed: false,
        name: "Abcd",
        stream_id: 106,
        description: "India town",
        subscribers: [1, 2, 3],
        stream_weekly_traffic: 0,
        color: "red",
        can_administer_channel_group: nobody_group.id,
        can_remove_subscribers_group: admins_group.id,
        can_add_subscribers_group: admins_group.id,
        can_subscribe_group: admins_group.id,
        date_created: 1691057093,
        creator_id: null,
        subscriber_count: 0,
    };
    const utopia = {
        elem: "utopia",
        subscribed: false,
        name: "Utopia",
        stream_id: 107,
        description: "movie",
        subscribers: [1, 2, 3, 4],
        stream_weekly_traffic: 8,
        color: "red",
        can_administer_channel_group: nobody_group.id,
        can_remove_subscribers_group: admins_group.id,
        can_add_subscribers_group: admins_group.id,
        can_subscribe_group: admins_group.id,
        date_created: 1691057093,
        creator_id: null,
        subscriber_count: 0,
    };
    const jerry = {
        elem: "jerry",
        subscribed: false,
        name: "Jerry",
        stream_id: 108,
        description: "cat",
        subscribers: [1],
        stream_weekly_traffic: 4,
        color: "red",
        can_administer_channel_group: nobody_group.id,
        can_remove_subscribers_group: admins_group.id,
        can_add_subscribers_group: admins_group.id,
        can_subscribe_group: admins_group.id,
        date_created: 1691057093,
        creator_id: null,
        subscriber_count: 0,
    };

    const sub_row_data = [denmark, poland, pomona, cpp, zzyzx, abcd, utopia, jerry];

    for (const sub of sub_row_data) {
        stream_data.create_sub_from_server_data(sub);
    }

    let populated_subs;

    mock_template("stream_settings/browse_streams_list.hbs", false, (data) => {
        populated_subs = data.subscriptions;
    });

    const filters_dropdown_widget = {
        render: function render() {},
        value: () => "",
    };
    stream_settings_components.set_archived_status_filters_for_tests(filters_dropdown_widget);

    stream_settings_ui.render_left_panel_superset();

    const sub_stubs = [];

    for (const data of populated_subs) {
        const sub_row = `.stream-row-${CSS.escape(data.elem)}`;
        sub_stubs.push(sub_row);

        $(sub_row).attr("data-stream-id", data.stream_id);
        $(sub_row).detach = () => sub_row;
    }

    $.create("#channels_overlay_container .stream-row", {children: sub_stubs});

    const $no_streams_message = $(".no-streams-to-show");
    const $child_element = $(".subscribed_streams_tab_empty_text");
    $no_streams_message.children = () => $child_element;
    $child_element.hide = () => [];

    let ui_called = false;
    scroll_util.reset_scrollbar = ($elem) => {
        ui_called = true;
        assert.equal($elem, $("#subscription_overlay .streams-list"));
    };

    // Filtering has the side effect of setting the "active" class
    // on our current stream, even if it doesn't match the filter.
    const $denmark_row = $(`.stream-row[data-stream-id='${CSS.escape(denmark_stream_id)}']`);
    // sanity check it's not set to active
    assert.ok(!$denmark_row.hasClass("active"));

    function test_filter(params, expected_streams) {
        $("#channels_overlay_container .stream-row:not(.notdisplayed)").length = 0;
        const stream_ids = stream_settings_ui.redraw_left_panel(params);
        assert.deepEqual(
            stream_ids,
            expected_streams.map((sub) => sub.stream_id),
        );
    }

    // Search with single keyword
    test_filter({input: "Po", show_subscribed: false, show_available: false}, [poland, pomona]);
    assert.ok(ui_called);

    // The denmark row is active, even though it's not displayed.
    assert.ok($denmark_row.hasClass("active"));

    // Search with multiple keywords
    test_filter({input: "Denmark, Pol", show_subscribed: false, show_available: false}, [
        denmark,
        poland,
    ]);
    test_filter({input: "Den, Pol", show_subscribed: false, show_available: false}, [
        denmark,
        poland,
    ]);

    // Search is case-insensitive
    test_filter({input: "po", show_subscribed: false, show_available: false}, [poland, pomona]);

    // Search handles unusual characters like C++
    test_filter({input: "c++", show_subscribed: false, show_available: false}, [cpp]);

    // Search subscribed streams only
    test_filter({input: "d", show_subscribed: true, show_available: false}, [poland]);

    // Search unsubscribed streams only
    test_filter({input: "d", show_subscribed: false, show_available: true}, [abcd, denmark]);

    // Search terms match stream description
    test_filter({input: "Co", show_subscribed: false, show_available: false}, [denmark, pomona]);

    // Search names AND descriptions
    test_filter({input: "Mon", show_subscribed: false, show_available: false}, [pomona, poland]);

    // Explicitly order streams by name
    test_filter(
        {
            input: "",
            show_subscribed: false,
            show_available: false,
            sort_order: "by-stream-name",
        },
        [abcd, cpp, denmark, jerry, poland, pomona, utopia, zzyzx],
    );

    // Order streams by subscriber count
    test_filter(
        {
            input: "",
            show_subscribed: false,
            show_available: false,
            sort_order: "by-subscriber-count",
        },
        [utopia, abcd, poland, cpp, zzyzx, denmark, jerry, pomona],
    );

    // Order streams by weekly traffic
    test_filter(
        {
            input: "",
            show_subscribed: false,
            show_available: false,
            sort_order: "by-weekly-traffic",
        },
        [poland, utopia, cpp, zzyzx, jerry, abcd, pomona, denmark],
    );

    // Sort for subscribed only.
    test_filter(
        {
            input: "",
            show_subscribed: true,
            show_available: false,
            sort_order: "by-subscriber-count",
        },
        [poland, cpp, zzyzx, pomona],
    );

    // Sort for unsubscribed only.
    test_filter(
        {
            input: "",
            show_subscribed: false,
            show_available: true,
            sort_order: "by-subscriber-count",
        },
        [utopia, abcd, denmark, jerry],
    );

    // active stream-row is not included in results
    $(".stream-row-denmark").addClass("active");
    $(".stream-row.active").hasClass = (cls) => {
        assert.equal(cls, "notdisplayed");
        return $(".stream-row-denmark").hasClass("active");
    };
    $(".stream-row.active").removeClass = (cls) => {
        assert.equal(cls, "active");
        $(".stream-row-denmark").removeClass("active");
    };

    test_filter({input: "d", show_subscribed: true}, [poland]);
    assert.ok($(".stream-row-denmark").hasClass("active"));

    $(".stream-row.active").attr("data-stream-id", 101);
    stream_settings_ui.switch_stream_tab("subscribed");
    assert.ok(!$(".stream-row-denmark").hasClass("active"));
    assert.ok(!$(".right .settings").visible());
    assert.ok($(".nothing-selected").visible());
});
```

--------------------------------------------------------------------------------

````
