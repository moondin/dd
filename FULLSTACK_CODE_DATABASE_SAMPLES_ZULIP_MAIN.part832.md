---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 832
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 832 of 1290)

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

---[FILE: user_topics_ui.test.cjs]---
Location: zulip-main/web/tests/user_topics_ui.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const user_topics = zrequire("user_topics");
const user_topics_ui = zrequire("user_topics_ui");
const stream_data = zrequire("stream_data");
const sub_store = zrequire("sub_store");

const design = {
    stream_id: 101,
    name: "design",
    subscribed: false,
    is_muted: false,
};

stream_data.add_sub_for_tests(design);

function test(label, f) {
    run_test(label, (helpers) => {
        user_topics.set_user_topics([]);
        return f(helpers);
    });
}

function update_visibility_policy(visibility_policy) {
    user_topics.update_user_topics(design.stream_id, design.name, "java", visibility_policy);
}

test("toggle_topic_visibility_policy", ({override_rewire}) => {
    // Mute a topic
    assert.ok(!user_topics.is_topic_muted(design.stream_id, "java"));
    update_visibility_policy(user_topics.all_visibility_policies.MUTED);
    assert.ok(user_topics.is_topic_muted(design.stream_id, "java"));

    // Unsubscribe the channel
    design.subscribed = false;

    const message = {
        type: "stream",
        stream_id: design.stream_id,
        topic: "java",
    };

    // Verify that we can't toggle visibility policy in unsubscribed channel.
    user_topics_ui.toggle_topic_visibility_policy(message);
    assert.ok(user_topics.is_topic_muted(design.stream_id, "java"));

    override_rewire(
        user_topics,
        "set_user_topic_visibility_policy",
        (stream_id, topic_name, visibility_policy) => {
            const stream_name = sub_store.maybe_get_stream_name(stream_id);
            user_topics.update_user_topics(stream_id, stream_name, topic_name, visibility_policy);
        },
    );

    design.subscribed = true;

    // For NOT muted channel
    user_topics_ui.toggle_topic_visibility_policy(message);
    assert.ok(
        user_topics.get_topic_visibility_policy(design.stream_id, "java") ===
            user_topics.all_visibility_policies.INHERIT,
    );

    user_topics_ui.toggle_topic_visibility_policy(message);
    assert.ok(user_topics.is_topic_muted(design.stream_id, "java"));

    update_visibility_policy(user_topics.all_visibility_policies.UNMUTED);
    user_topics_ui.toggle_topic_visibility_policy(message);
    assert.ok(user_topics.is_topic_muted(design.stream_id, "java"));

    update_visibility_policy(user_topics.all_visibility_policies.FOLLOWED);
    user_topics_ui.toggle_topic_visibility_policy(message);
    assert.ok(user_topics.is_topic_muted(design.stream_id, "java"));

    // For muted channel
    design.is_muted = true;

    update_visibility_policy(user_topics.all_visibility_policies.INHERIT);
    user_topics_ui.toggle_topic_visibility_policy(message);
    assert.ok(user_topics.is_topic_unmuted(design.stream_id, "java"));

    update_visibility_policy(user_topics.all_visibility_policies.MUTED);
    user_topics_ui.toggle_topic_visibility_policy(message);
    assert.ok(user_topics.is_topic_unmuted(design.stream_id, "java"));

    user_topics_ui.toggle_topic_visibility_policy(message);
    assert.ok(
        user_topics.get_topic_visibility_policy(design.stream_id, "java") ===
            user_topics.all_visibility_policies.INHERIT,
    );

    update_visibility_policy(user_topics.all_visibility_policies.FOLLOWED);
    user_topics_ui.toggle_topic_visibility_policy(message);
    assert.ok(
        user_topics.get_topic_visibility_policy(design.stream_id, "java") ===
            user_topics.all_visibility_policies.INHERIT,
    );
});
```

--------------------------------------------------------------------------------

---[FILE: util.test.cjs]---
Location: zulip-main/web/tests/util.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const _ = require("lodash");
const MockDate = require("mockdate");

const {make_realm} = require("./lib/example_realm.cjs");
const {set_global, with_overrides, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const blueslip = zrequire("blueslip");
const {set_realm} = zrequire("state_data");
const {initialize_user_settings} = zrequire("user_settings");

const realm = make_realm();
set_realm(realm);

set_global("document", {});
const util = zrequire("util");

initialize_user_settings({user_settings: {}});

run_test("CachedValue", () => {
    let x = 5;

    const cv = new util.CachedValue({
        compute_value() {
            return x * 2;
        },
    });

    assert.equal(cv.get(), 10);

    x = 6;
    assert.equal(cv.get(), 10);
    cv.reset();
    assert.equal(cv.get(), 12);
});

run_test("extract_pm_recipients", () => {
    assert.equal(util.extract_pm_recipients("bob@foo.com, alice@foo.com").length, 2);
    assert.equal(util.extract_pm_recipients("bob@foo.com, ").length, 1);
});

run_test("lower_bound", () => {
    const arr = [{x: 10}, {x: 20}, {x: 30}, {x: 40}, {x: 50}];

    function compare(a, b) {
        return a.x < b;
    }

    assert.equal(util.lower_bound(arr, 5, compare), 0);
    assert.equal(util.lower_bound(arr, 10, compare), 0);
    assert.equal(util.lower_bound(arr, 15, compare), 1);
    assert.equal(util.lower_bound(arr, 50, compare), 4);
    assert.equal(util.lower_bound(arr, 55, compare), 5);
});

run_test("lower_same", () => {
    assert.ok(util.lower_same("abc", "AbC"));
    assert.ok(!util.lower_same("abbc", "AbC"));

    blueslip.expect("error", "Cannot compare strings; at least one value is undefined");
    util.lower_same("abc", undefined);
});

run_test("same_recipient", () => {
    assert.ok(
        util.same_recipient(
            {type: "stream", stream_id: 101, topic: "Bar"},
            {type: "stream", stream_id: 101, topic: "bar"},
        ),
    );

    assert.ok(
        !util.same_recipient(
            {type: "stream", stream_id: 101, topic: "Bar"},
            {type: "stream", stream_id: 102, topic: "whatever"},
        ),
    );

    assert.ok(
        util.same_recipient(
            {type: "private", to_user_ids: "101,102"},
            {type: "private", to_user_ids: "101,102"},
        ),
    );

    assert.ok(
        !util.same_recipient(
            {type: "private", to_user_ids: "101,102"},
            {type: "private", to_user_ids: "103"},
        ),
    );

    assert.ok(
        !util.same_recipient({type: "stream", stream_id: 101, topic: "Bar"}, {type: "private"}),
    );

    assert.ok(!util.same_recipient({type: "private", to_user_ids: undefined}, {type: "private"}));

    assert.ok(!util.same_recipient(undefined, {type: "private"}));

    assert.ok(!util.same_recipient(undefined, undefined));
});

run_test("robust_url_decode", ({override}) => {
    assert.equal(util.robust_url_decode("xxx%3Ayyy"), "xxx:yyy");
    assert.equal(util.robust_url_decode("xxx%3"), "xxx");

    override(global, "decodeURIComponent", () => {
        throw new Error("foo");
    });
    assert.throws(
        () => {
            util.robust_url_decode("%E0%A4%A");
        },
        {name: "Error", message: "foo"},
    );
});

run_test("dumb_strcmp", ({override}) => {
    override(Intl, "Collator", undefined);
    const strcmp = util.make_strcmp();
    assert.equal(strcmp("a", "b"), -1);
    assert.equal(strcmp("c", "c"), 0);
    assert.equal(strcmp("z", "y"), 1);
});

run_test("get_edit_event_orig_topic", () => {
    assert.equal(util.get_edit_event_orig_topic({orig_subject: "lunch"}), "lunch");
});

run_test("is_mobile", () => {
    window.navigator = {userAgent: "Android"};
    assert.ok(util.is_mobile());

    window.navigator = {userAgent: "Not mobile"};
    assert.ok(!util.is_mobile());
});

run_test("array_compare", () => {
    assert.ok(util.array_compare([], []));
    assert.ok(util.array_compare([1, 2, 3], [1, 2, 3]));
    assert.ok(!util.array_compare([1, 2], [1, 2, 3]));
    assert.ok(!util.array_compare([1, 2, 3], [1, 2]));
    assert.ok(!util.array_compare([1, 2, 3, 4], [1, 2, 3, 5]));
});

run_test("normalize_recipients", () => {
    assert.equal(
        util.normalize_recipients("ZOE@foo.com, bob@foo.com, alice@foo.com, AARON@foo.com "),
        "aaron@foo.com,alice@foo.com,bob@foo.com,zoe@foo.com",
    );
});

run_test("random_int", () => {
    const min = 0;
    const max = 100;

    _.times(500, () => {
        const val = util.random_int(min, max);
        assert.ok(min <= val);
        assert.ok(val <= max);
        assert.equal(val, Math.floor(val));
    });
});

run_test("wildcard_mentions_regexp", () => {
    const messages_with_all_mentions = [
        "@**all**",
        "some text before @**all** some text after",
        "@**all** some text after only",
        "some text before only @**all**",
    ];

    const messages_with_everyone_mentions = [
        "@**everyone**",
        '"@**everyone**"',
        "@**everyone**: Look at this!",
        "The <@**everyone**> channel",
        'I have to say "@**everyone**" to ding the bell',
        "some text before @**everyone** some text after",
        "@**everyone** some text after only",
        "some text before only @**everyone**",
    ];

    const messages_with_stream_mentions = [
        "@**stream**",
        "some text before @**stream** some text after",
        "@**stream** some text after only",
        "some text before only @**stream**",
    ];

    const messages_with_channel_mentions = [
        "@**channel**",
        "some text before @**channel** some text after",
        "@**channel** some text after only",
        "some text before only @**channel**",
    ];

    const messages_with_topic_mentions = [
        "@**topic**",
        "some text before @**topic** some text after",
        "@**topic** some text after only",
        "some text before only @**topic**",
    ];

    const messages_without_all_mentions = [
        "@all",
        "some text before @all some text after",
        "`@everyone`",
        "some_email@everyone.com",
        "`@**everyone**`",
        "some_email@**everyone**.com",
    ];

    const messages_without_everyone_mentions = [
        "some text before @everyone some text after",
        "@everyone",
        "`@everyone`",
        "some_email@everyone.com",
        "`@**everyone**`",
        "some_email@**everyone**.com",
    ];

    const messages_without_stream_mentions = [
        "some text before @stream some text after",
        "@stream",
        "`@stream`",
        "some_email@stream.com",
        "`@**stream**`",
        "some_email@**stream**.com",
    ];

    const messages_without_channel_mentions = [
        "some text before @channel some text after",
        "@channel",
        "`@channel`",
        "some_email@channel.com",
        "`@**channel**`",
        "some_email@**channel**.com",
    ];

    let i;
    for (i = 0; i < messages_with_all_mentions.length; i += 1) {
        assert.ok(util.find_stream_wildcard_mentions(messages_with_all_mentions[i]));
    }

    for (i = 0; i < messages_with_everyone_mentions.length; i += 1) {
        assert.ok(util.find_stream_wildcard_mentions(messages_with_everyone_mentions[i]));
    }

    for (i = 0; i < messages_with_stream_mentions.length; i += 1) {
        assert.ok(util.find_stream_wildcard_mentions(messages_with_stream_mentions[i]));
    }

    for (i = 0; i < messages_with_channel_mentions.length; i += 1) {
        assert.ok(util.find_stream_wildcard_mentions(messages_with_channel_mentions[i]));
    }

    for (i = 0; i < messages_with_topic_mentions.length; i += 1) {
        assert.ok(!util.find_stream_wildcard_mentions(messages_with_topic_mentions[i]));
    }

    for (i = 0; i < messages_without_all_mentions.length; i += 1) {
        assert.ok(!util.find_stream_wildcard_mentions(messages_without_everyone_mentions[i]));
    }

    for (i = 0; i < messages_without_everyone_mentions.length; i += 1) {
        assert.ok(!util.find_stream_wildcard_mentions(messages_without_everyone_mentions[i]));
    }

    for (i = 0; i < messages_without_stream_mentions.length; i += 1) {
        assert.ok(!util.find_stream_wildcard_mentions(messages_without_stream_mentions[i]));
    }

    for (i = 0; i < messages_without_channel_mentions.length; i += 1) {
        assert.ok(!util.find_stream_wildcard_mentions(messages_without_channel_mentions[i]));
    }
});

run_test("move_array_elements_to_front", () => {
    const strings = ["string1", "string3", "string2", "string4"];
    const strings_selection = ["string4", "string1"];
    const strings_expected = ["string1", "string4", "string3", "string2"];
    const strings_no_selection = util.move_array_elements_to_front(strings, []);
    const strings_no_array = util.move_array_elements_to_front([], strings_selection);
    const strings_actual = util.move_array_elements_to_front(strings, strings_selection);
    const emails = [
        "test@zulip.com",
        "test@test.com",
        "test@localhost",
        "test@invalid@email",
        "something@zulip.com",
    ];
    const emails_selection = ["test@test.com", "test@localhost", "test@invalid@email"];
    const emails_expected = [
        "test@test.com",
        "test@localhost",
        "test@invalid@email",
        "test@zulip.com",
        "something@zulip.com",
    ];
    const emails_actual = util.move_array_elements_to_front(emails, emails_selection);
    assert.deepEqual(strings_no_selection, strings);
    assert.deepEqual(strings_no_array, []);
    assert.deepEqual(strings_actual, strings_expected);
    assert.deepEqual(emails_actual, emails_expected);
});

run_test("filter_by_word_prefix_match", () => {
    const strings = ["stream-hyphen_underscore/slash", "three word stream"];
    const values = [0, 1];
    const item_to_string = (idx) => strings[idx];

    // Default settings will match words with a space delimiter before them.
    assert.deepEqual(util.filter_by_word_prefix_match(values, "stream", item_to_string), [0, 1]);
    assert.deepEqual(util.filter_by_word_prefix_match(values, "word stream", item_to_string), [1]);

    // Since - appears before `hyphen` in
    // stream-hyphen_underscore/slash, we require `-` in the set of
    // characters for it to match.
    assert.deepEqual(util.filter_by_word_prefix_match(values, "hyphe", item_to_string), []);
    assert.deepEqual(util.filter_by_word_prefix_match(values, "hyphe", item_to_string, /[\s/_-]/), [
        0,
    ]);
    assert.deepEqual(util.filter_by_word_prefix_match(values, "hyphe", item_to_string, /[\s-]/), [
        0,
    ]);

    // Similarly `_` must be in the set of allowed characters to match "underscore".
    assert.deepEqual(util.filter_by_word_prefix_match(values, "unders", item_to_string, /[\s_]/), [
        0,
    ]);
    assert.deepEqual(util.filter_by_word_prefix_match(values, "unders", item_to_string, /\s/), []);
});

run_test("prefix_match", () => {
    assert.ok(util.prefix_match({value: "VIEWS", search_term: "V"}));
    assert.ok(!util.prefix_match({value: "VIEWS", search_term: "I"}));
});

run_test("get_string_diff", () => {
    assert.deepEqual(
        util.get_string_diff("#ann is for updates", "#**announce** is for updates"),
        [1, 4, 13],
    );
    assert.deepEqual(util.get_string_diff("/p", "/poll"), [2, 2, 5]);
    assert.deepEqual(util.get_string_diff("Hey @Aa", "Hey @**aaron** "), [5, 7, 15]);
    assert.deepEqual(util.get_string_diff("same", "same"), [0, 0, 0]);
    assert.deepEqual(util.get_string_diff("same-end", "two same-end"), [0, 0, 4]);
    assert.deepEqual(util.get_string_diff("space", "sp ace"), [2, 2, 3]);
});

run_test("is_valid_url", () => {
    assert.equal(util.is_valid_url("http://"), false);
    assert.equal(util.is_valid_url("random_string"), true);
    assert.equal(util.is_valid_url("http://google.com/something?q=query#hash"), true);
    assert.equal(util.is_valid_url("/abc/"), true);

    assert.equal(util.is_valid_url("http://", true), false);
    assert.equal(util.is_valid_url("random_string", true), false);
    assert.equal(util.is_valid_url("http://google.com/something?q=query#hash", true), true);
    assert.equal(util.is_valid_url("/abc/", true), false);
});

run_test("format_array_as_list", () => {
    const array = ["apple", "banana", "orange"];
    // when Intl exist
    assert.equal(
        util.format_array_as_list(array, "long", "conjunction"),
        "apple, banana, and orange",
    );
    assert.equal(
        util.format_array_as_list_with_highlighted_elements(array, "long", "conjunction"),
        '<b class="highlighted-element">apple</b>, <b class="highlighted-element">banana</b>, and <b class="highlighted-element">orange</b>',
    );

    // Conjunction format
    assert.equal(
        util.format_array_as_list_with_conjunction(array, "narrow"),
        "apple, banana, orange",
    );
    assert.equal(
        util.format_array_as_list_with_conjunction(array, "long"),
        "apple, banana, and orange",
    );

    // when Intl.ListFormat does not exist
    with_overrides(({override}) => {
        override(global.Intl, "ListFormat", undefined);
        assert.equal(
            util.format_array_as_list(array, "long", "conjunction"),
            "apple, banana, orange",
        );
        assert.equal(
            util.format_array_as_list_with_highlighted_elements(array, "long", "conjunction"),
            '<b class="highlighted-element">apple</b>, <b class="highlighted-element">banana</b>, <b class="highlighted-element">orange</b>',
        );

        assert.equal(
            util.format_array_as_list_with_conjunction(array, "narrow"),
            "apple, banana, orange",
        );
        assert.equal(
            util.format_array_as_list_with_conjunction(array, "long"),
            "apple, banana, orange",
        );
    });
});

run_test("get_remaining_time", () => {
    // When current time is less than start time
    // Set a random start time
    const start_time = new Date(1000).getTime();
    // Set current time to 400ms ahead of the start time
    MockDate.set(start_time + 400);
    const duration = 500;
    let expected_remaining_time = 100;
    assert.equal(util.get_remaining_time(start_time, duration), expected_remaining_time);

    // When current time is greater than start time + duration
    // Set current time to 100ms after the start time + duration
    MockDate.set(start_time + duration + 100);
    expected_remaining_time = 0;
    assert.equal(util.get_remaining_time(start_time, duration), expected_remaining_time);

    MockDate.reset();
});

run_test("get_custom_time_in_minutes", () => {
    const time_input = 15;
    assert.equal(util.get_custom_time_in_minutes("weeks", time_input), time_input * 7 * 24 * 60);
    assert.equal(util.get_custom_time_in_minutes("days", time_input), time_input * 24 * 60);
    assert.equal(util.get_custom_time_in_minutes("hours", time_input), time_input * 60);
    assert.equal(util.get_custom_time_in_minutes("minutes", time_input), time_input);
    // Unknown time unit string throws an error, but we still return
    // the time input that was passed to the function.
    blueslip.expect("error", "Unexpected custom time unit: invalid");
    assert.equal(util.get_custom_time_in_minutes("invalid", time_input), time_input);
    /// NaN time input returns NaN
    const invalid_time_input = Number.NaN;
    assert.equal(util.get_custom_time_in_minutes("hours", invalid_time_input), invalid_time_input);
});

run_test("check_and_validate_custom_time_input", () => {
    const input_is_zero = 0;
    let checked_input = util.check_time_input(input_is_zero);
    assert.equal(checked_input, 0);
    assert.equal(util.validate_custom_time_input(checked_input, true), true);
    assert.equal(util.validate_custom_time_input(checked_input, false), false);

    const input_is_nan = "24abc";
    checked_input = util.check_time_input(input_is_nan);
    assert.equal(checked_input, Number.NaN);
    assert.equal(util.validate_custom_time_input(checked_input), false);

    const input_is_negative = "-24";
    checked_input = util.check_time_input(input_is_negative);
    assert.equal(checked_input, -24);
    assert.equal(util.validate_custom_time_input(input_is_negative), false);

    const input_is_float = "24.5";
    checked_input = util.check_time_input(input_is_float);
    assert.equal(checked_input, 24);
    checked_input = util.check_time_input(input_is_float, true);
    assert.equal(checked_input, 24.5);
    assert.equal(util.validate_custom_time_input(input_is_float), true);

    const input_is_integer = "10";
    checked_input = util.check_time_input(input_is_integer);
    assert.equal(checked_input, 10);
    assert.equal(util.validate_custom_time_input(input_is_integer), true);
});

run_test("the", () => {
    const list_with_one_item = ["foo"];
    assert.equal(util.the(list_with_one_item), "foo");

    blueslip.expect("error", "the: expected only 1 item, got more");
    const list_with_more_items = ["foo", "bar"];
    // Error is thrown, but we still return the first item to avoid
    // unnecessarily breaking the app.
    assert.equal(util.the(list_with_more_items), "foo");

    blueslip.expect("error", "the: expected only 1 item, got none");
    // Error is thrown, but we still return the "first" item to avoid
    // unnecessarily breaking the app for places we refactored this that
    // were previously typed wrong but not breaking the app.
    assert.equal(util.the([]), undefined);
});

run_test("compare_a_b", () => {
    const user1 = {
        id: 1,
        name: "sally",
    };
    const user2 = {
        id: 2,
        name: "jenny",
    };
    const user3 = {
        id: 3,
        name: "max",
    };
    const user4 = {
        id: 4,
        name: "max",
    };
    const unsorted = [user2, user1, user4, user3];

    const sorted_by_id = unsorted.toSorted((a, b) => util.compare_a_b(a.id, b.id));
    assert.deepEqual(sorted_by_id, [user1, user2, user3, user4]);

    const sorted_by_name = unsorted.toSorted((a, b) => util.compare_a_b(a.name, b.name));
    assert.deepEqual(sorted_by_name, [user2, user4, user3, user1]);
});

run_test("get_final_topic_display_name", ({override}) => {
    // When the topic name is not an empty string,
    // the displayed topic name matches the actual topic name.
    assert.deepEqual(util.get_final_topic_display_name("not empty string"), "not empty string");

    // When the topic name is an empty string, there are two possible scenarios:
    // 1. The `realm_empty_topic_display_name` setting has its default value
    //    "general chat". In this case, the topic is displayed as the translated
    //    value of "general chat" based on the user's language settings.
    // 2. The `realm_empty_topic_display_name` setting has been customized by
    //    an admin. In this case, the topic is displayed using the value of
    //    `realm_empty_topic_display_name` without any translation.
    override(realm, "realm_empty_topic_display_name", "general chat");
    assert.deepEqual(util.get_final_topic_display_name(""), "translated: general chat");
    override(realm, "realm_empty_topic_display_name", "random topic name");
    assert.deepEqual(util.get_final_topic_display_name(""), "random topic name");
});

run_test("is_topic_name_considered_empty", ({override}) => {
    // Topic is not considered empty if it is distinct string
    // other than "(no topic)", or the displayed topic name for empty string.
    assert.ok(!util.is_topic_name_considered_empty("some topic"));

    // Topic is considered empty if it is an empty string.
    assert.ok(util.is_topic_name_considered_empty(""));

    // Topic is considered empty if it is equal to "(no topic)".
    assert.ok(util.is_topic_name_considered_empty("(no topic)"));

    // Topic name is considered empty if it is equal to the displayed
    // topic name for empty string.
    override(realm, "realm_empty_topic_display_name", "general chat");
    assert.ok(util.is_topic_name_considered_empty("translated: general chat"));
});

run_test("get_retry_backoff_seconds", () => {
    const xhr_500_error = {
        status: 500,
    };

    // Shorter backoff scale
    // First retry should be between 1-2 seconds.
    let backoff = util.get_retry_backoff_seconds(xhr_500_error, 1, true);
    assert.ok(backoff >= 1);
    assert.ok(backoff < 3);
    // 100th retry should be between 16-32 seconds.
    backoff = util.get_retry_backoff_seconds(xhr_500_error, 100, true);
    assert.ok(backoff >= 16);
    assert.ok(backoff <= 32);

    // Longer backoff scale
    // First retry should be between 1-2 seconds.
    backoff = util.get_retry_backoff_seconds(xhr_500_error, 1);
    assert.ok(backoff >= 1);
    assert.ok(backoff <= 3);
    // 100th retry should be between 45-90 seconds.
    backoff = util.get_retry_backoff_seconds(xhr_500_error, 100);
    assert.ok(backoff >= 45);
    assert.ok(backoff <= 90);

    const xhr_rate_limit_error = {
        status: 429,
        responseJSON: {
            code: "RATE_LIMIT_HIT",
            msg: "API usage exceeded rate limit",
            result: "error",
            "retry-after": 28.706807374954224,
        },
    };
    // First retry should be greater than the retry-after value.
    backoff = util.get_retry_backoff_seconds(xhr_rate_limit_error, 1);
    assert.ok(backoff >= 28.706807374954224);
    // 100th retry should be between 45-90 seconds.
    backoff = util.get_retry_backoff_seconds(xhr_rate_limit_error, 100);
    assert.ok(backoff >= 45);
    assert.ok(backoff <= 90);
});

run_test("sha256_hash", async ({override}) => {
    const expected_hash = "f8e27cb511cd469712e3e0f2ac05a990481c0a39e11830b4f6aee729a894b769";
    const data = "@*hamlet_and_cordelia* and #**channel>topic**";
    let hash = await util.sha256_hash(data);
    assert.equal(hash, undefined);
    override(window, "isSecureContext", true);
    hash = await util.sha256_hash(data);
    assert.equal(hash, expected_hash);
});
```

--------------------------------------------------------------------------------

---[FILE: vdom.test.cjs]---
Location: zulip-main/web/tests/vdom.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

const vdom = zrequire("vdom");

run_test("basics", () => {
    const opts = {
        keyed_nodes: [],
        attrs: [
            ["class", "foo"],
            ["title", 'cats & <"dogs">'],
        ],
    };

    const ul = vdom.ul(opts);

    const html = vdom.render_tag(ul);

    assert.equal(html, '<ul class="foo" title="cats &amp; &lt;&quot;dogs&quot;&gt;">\n\n</ul>');
});

run_test("attribute escaping", () => {
    // So far most of the time our attributes are
    // hard-coded classes like "dm-list",
    // but we need to be defensive about future code
    // that might use data from possibly malicious users.
    const opts = {
        keyed_nodes: [],
        attrs: [
            ["class", '">something evil<div class="'],
            ["title", "apples & oranges"],
        ],
    };

    const ul = vdom.ul(opts);

    const html = vdom.render_tag(ul);

    assert.equal(
        html,
        '<ul class="&quot;&gt;something evil&lt;div class=&quot;" ' +
            'title="apples &amp; oranges">\n\n</ul>',
    );
});

run_test("attribute updates", () => {
    const opts = {
        keyed_nodes: [],
        attrs: [
            ["class", "same"],
            ["color", "blue"],
            ["id", "101"],
        ],
    };

    const ul = vdom.ul(opts);

    const html = vdom.render_tag(ul);

    assert.equal(html, '<ul class="same" color="blue" id="101">\n\n</ul>');

    let updated;
    let removed;

    function find() {
        return {
            children: () => [],

            attr(k, v) {
                assert.equal(k, "color");
                assert.equal(v, "red");
                updated = true;
            },

            removeAttr(k) {
                assert.equal(k, "id");
                removed = true;
            },
        };
    }

    const new_opts = {
        keyed_nodes: [],
        attrs: [
            ["class", "same"], // unchanged
            ["color", "red"],
        ],
    };

    const new_ul = vdom.ul(new_opts);
    const replace_content = undefined;

    vdom.update(replace_content, find, new_ul, ul);

    assert.ok(updated);
    assert.ok(removed);
});

function make_child(i, name) {
    const render = () => "<li>" + name + "</li>";

    const eq = (other) => name === other.name;

    return {
        key: i,
        render,
        name,
        eq,
    };
}

function make_children(lst) {
    return lst.map((i) => make_child(i, "foo" + i));
}

run_test("children", () => {
    let rendered_html;

    function replace_content(html) {
        rendered_html = html;
    }

    const find = undefined;

    const nodes = make_children([1, 2, 3]);

    const opts = {
        keyed_nodes: nodes,
        attrs: [],
    };

    const ul = vdom.ul(opts);

    vdom.update(replace_content, find, ul);

    assert.equal(rendered_html, "<ul>\n<li>foo1</li>\n<li>foo2</li>\n<li>foo3</li>\n</ul>");

    // Force a complete redraw.
    const new_nodes = make_children([4, 5]);
    const new_opts = {
        keyed_nodes: new_nodes,
        attrs: [["class", "main"]],
    };

    const new_ul = vdom.ul(new_opts);
    vdom.update(replace_content, find, new_ul, ul);

    assert.equal(rendered_html, '<ul class="main">\n<li>foo4</li>\n<li>foo5</li>\n</ul>');
});

run_test("partial updates", () => {
    let rendered_html;

    let replace_content = (html) => {
        rendered_html = html;
    };

    let find;

    const nodes = make_children([1, 2, 3]);

    const opts = {
        keyed_nodes: nodes,
        attrs: [],
    };

    const ul = vdom.ul(opts);

    vdom.update(replace_content, find, ul);

    assert.equal(rendered_html, "<ul>\n<li>foo1</li>\n<li>foo2</li>\n<li>foo3</li>\n</ul>");

    /* istanbul ignore next */
    replace_content = () => {
        throw new Error("should not replace entire html");
    };

    let $patched;

    find = () => ({
        children: () => ({
            eq(i) {
                assert.equal(i, 0);
                return {
                    replaceWith($element) {
                        $patched = $element;
                    },
                };
            },
        }),
    });

    const new_nodes = make_children([1, 2, 3]);
    new_nodes[0] = make_child(1, "modified1");

    const new_opts = {
        keyed_nodes: new_nodes,
        attrs: [],
    };

    const new_ul = vdom.ul(new_opts);
    vdom.update(replace_content, find, new_ul, ul);

    assert.equal($patched.selector, "<li>modified1</li>");
});

run_test("eq_array easy cases", () => {
    /* istanbul ignore next */
    const bogus_eq = () => {
        throw new Error("we should not be comparing elements");
    };

    assert.equal(vdom.eq_array(undefined, undefined, bogus_eq), true);

    const x = [1, 2, 3];
    assert.equal(vdom.eq_array(x, undefined, bogus_eq), false);

    assert.equal(vdom.eq_array(undefined, x, bogus_eq), false);

    assert.equal(vdom.eq_array(x, x, bogus_eq), true);

    // length check should also short-circuit
    const y = [1, 2, 3, 4, 5];
    assert.equal(vdom.eq_array(x, y, bogus_eq), false);

    // same length, same values, but different order
    const eq = (a, b) => a === b;
    const z = [3, 2, 1];
    assert.equal(vdom.eq_array(x, z, eq), false);
});

run_test("eq_array element-wise", () => {
    const a = [51, 32, 93];
    const b = [31, 52, 43];
    const eq = (a, b) => a % 10 === b % 10;
    assert.equal(vdom.eq_array(a, b, eq), true);
});

run_test("error checking", () => {
    blueslip.expect("error", "We need keyed_nodes for updates.");

    const replace_content = "whatever";
    const find = "whatever";
    const ul = {opts: {attrs: []}};

    vdom.update(replace_content, find, ul, ul);
});
```

--------------------------------------------------------------------------------

---[FILE: watchdog.test.cjs]---
Location: zulip-main/web/tests/watchdog.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const MockDate = require("mockdate");

const {set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

let time = 0;
let checker;
MockDate.set(time);

function advance_secs(secs) {
    time += secs * 1000;
    MockDate.set(time);
}

set_global("setInterval", (f, interval) => {
    checker = f;
    assert.equal(interval, 5000);
});

const watchdog = zrequire("watchdog");

run_test("basics", () => {
    // Test without callbacks first.
    checker();
    advance_secs(5);
    checker();

    let num_times_called_back = 0;

    function callback() {
        num_times_called_back += 1;
    }

    watchdog.on_unsuspend(callback);

    // Simulate healthy operation.
    advance_secs(5);
    checker();
    assert.equal(num_times_called_back, 0);

    // Simulate machine going to sleep.
    advance_secs(81);
    checker();
    assert.equal(num_times_called_back, 1);

    // Simulate healthy operations resume, and
    // explicitly call check_for_unsuspend.
    num_times_called_back = 0;
    advance_secs(5);
    watchdog.check_for_unsuspend();
    assert.equal(num_times_called_back, 0);

    // Simulate another suspension.
    advance_secs(100);
    watchdog.check_for_unsuspend();
    assert.equal(num_times_called_back, 1);

    // Error while executing callback
    num_times_called_back = 0;
    advance_secs(100);
    watchdog.on_unsuspend(() => {
        num_times_called_back += 1;
        throw new Error("Some error while executing");
    });
    blueslip.expect(
        "error",
        `Error while executing callback 'Anonymous function' from unsuspend_callbacks.`,
    );
    watchdog.check_for_unsuspend();
    assert.equal(num_times_called_back, 2);
});

run_test("suspect_offline", () => {
    watchdog.set_suspect_offline(true);
    assert.ok(watchdog.suspects_user_is_offline());

    watchdog.set_suspect_offline(false);
    assert.ok(!watchdog.suspects_user_is_offline());
});

run_test("reset MockDate", () => {
    MockDate.reset();
});
```

--------------------------------------------------------------------------------

---[FILE: widgetize.test.cjs]---
Location: zulip-main/web/tests/widgetize.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");
const $ = require("./lib/zjquery.cjs");

const sample_events = [
    {
        data: {
            option: "First option",
            idx: 1,
            type: "new_option",
        },
        sender_id: 101,
    },
    {
        data: {
            option: "Second option",
            idx: 1,
            type: "new_option",
        },
        sender_id: 102,
    },
    {
        data: {
            option: "Third option",
            idx: 1,
            type: "new_option",
        },
        sender_id: 102,
    },
];

let events;
let $widget_elem;
let handle_events;
let is_event_handled;
let is_widget_activated;

const fake_poll_widget = {
    activate(data) {
        is_widget_activated = true;
        $widget_elem = data.$elem;
        assert.ok($widget_elem.hasClass("widget-content"));
        handle_events = (e) => {
            is_event_handled = true;
            assert.deepStrictEqual(e, events);
        };
        data.callback("test_data");
        return handle_events;
    },
};

const message_lists = mock_esm("../src/message_lists", {current: {id: 2}, home: {id: 1}});
mock_esm("../src/poll_widget", fake_poll_widget);

set_global("document", "document-stub");

const widgetize = zrequire("widgetize");
const widgets = zrequire("widgets");

widgets.initialize();

function test(label, f) {
    run_test(label, ({override}) => {
        events = [...sample_events];
        $widget_elem = undefined;
        handle_events = undefined;
        is_event_handled = false;
        is_widget_activated = false;
        widgetize.clear_for_testing();
        f({override});
    });
}

test("activate", ({override}) => {
    // Both widgetize.activate and widgetize.handle_event are tested
    // here to use the "caching" of widget event handlers.
    const $row = $.create("<stub message row>");
    $row.length = 1;
    $row.attr("id", `message-row-${message_lists.current.id}-2909`);
    const $message_content = $.create(`#message-row-${message_lists.current.id}-2909`);
    $row.set_find_results(".message_content", $message_content);

    const opts = {
        events: [...events],
        extra_data: "",
        message: {
            id: 2001,
        },
        post_to_server(data) {
            assert.equal(data.msg_type, "widget");
            assert.equal(data.data, "test_data");
        },
        $row,
        widget_type: "poll",
    };

    let is_widget_elem_inserted;

    $message_content.append = ($elem) => {
        is_widget_elem_inserted = true;
        assert.equal($elem, $widget_elem);
        assert.ok($elem.hasClass("widget-content"));
    };

    is_widget_elem_inserted = false;
    is_widget_activated = false;
    is_event_handled = false;
    assert.ok(!widgetize.widget_event_handlers.has(opts.message.id));

    widgetize.activate(opts);

    assert.ok(is_widget_elem_inserted);
    assert.ok(is_widget_activated);
    assert.ok(is_event_handled);
    assert.equal(widgetize.widget_event_handlers.get(opts.message.id), handle_events);

    message_lists.current = undefined;
    is_widget_elem_inserted = false;
    is_widget_activated = false;
    is_event_handled = false;

    widgetize.activate(opts);

    assert.ok(!is_widget_elem_inserted);
    assert.ok(!is_widget_activated);
    assert.ok(!is_event_handled);

    blueslip.expect("warn", "unknown widget_type");
    is_widget_elem_inserted = false;
    is_widget_activated = false;
    is_event_handled = false;
    opts.widget_type = "invalid_widget";

    widgetize.activate(opts);
    assert.ok(!is_widget_elem_inserted);
    assert.ok(!is_widget_activated);
    assert.ok(!is_event_handled);
    assert.deepEqual(blueslip.get_test_logs("warn")[0].more_info, {widget_type: "invalid_widget"});

    opts.widget_type = "tictactoe";

    widgetize.activate(opts);
    assert.ok(!is_widget_elem_inserted);
    assert.ok(!is_widget_activated);
    assert.ok(!is_event_handled);

    /* Testing widgetize.handle_events */
    message_lists.current = {id: 2};
    const post_activate_event = {
        data: {
            idx: 1,
            type: "new_option",
        },
        message_id: 2001,
        sender_id: 102,
    };
    handle_events = (e) => {
        is_event_handled = true;
        assert.deepEqual(e, [post_activate_event]);
    };
    widgetize.widget_event_handlers.set(2001, handle_events);
    override(message_lists.current, "get_row", (idx) => {
        assert.equal(idx, 2001);
        return $row;
    });
    is_event_handled = false;
    widgetize.handle_event(post_activate_event);
    assert.ok(is_event_handled);

    is_event_handled = false;
    post_activate_event.message_id = 1000;
    widgetize.handle_event(post_activate_event);
    assert.ok(!is_event_handled);
});
```

--------------------------------------------------------------------------------

````
