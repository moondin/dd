---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 814
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 814 of 1290)

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

---[FILE: saved_snippets.test.cjs]---
Location: zulip-main/web/tests/saved_snippets.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

set_global("page_params", {
    is_spectator: false,
});

const params = {
    saved_snippets: [
        {
            id: 1,
            title: "Test saved snippet",
            content: "Test content",
            date_created: 128374878,
        },
    ],
};

const people = zrequire("people");
const saved_snippets = zrequire("saved_snippets");

people.add_active_user({
    email: "tester@zulip.com",
    full_name: "Tester von Tester",
    user_id: 42,
});

people.initialize_current_user(42);

saved_snippets.initialize(params);

run_test("add_saved_snippet", () => {
    const saved_snippet = {
        id: 2,
        title: "New saved snippet",
        content: "Test content",
        date_created: 128374878,
    };
    saved_snippets.update_saved_snippet_dict(saved_snippet);

    const my_saved_snippet = saved_snippets.get_saved_snippet_by_id(2);
    assert.equal(my_saved_snippet, saved_snippet);
});

run_test("options for dropdown widget", () => {
    const saved_snippet = {
        id: 3,
        title: "Another saved snippet",
        content: "Test content",
        date_created: 128374876,
    };
    saved_snippets.update_saved_snippet_dict(saved_snippet);

    assert.deepEqual(saved_snippets.get_options_for_dropdown_widget(), [
        {
            unique_id: 3,
            name: "Another saved snippet",
            description: "Test content",
            bold_current_selection: true,
            has_delete_icon: true,
            has_edit_icon: true,
            delete_icon_label: "translated: Delete snippet",
            edit_icon_label: "translated: Edit snippet",
        },
        {
            unique_id: 2,
            name: "New saved snippet",
            description: "Test content",
            bold_current_selection: true,
            has_delete_icon: true,
            has_edit_icon: true,
            delete_icon_label: "translated: Delete snippet",
            edit_icon_label: "translated: Edit snippet",
        },
        {
            unique_id: 1,
            name: "Test saved snippet",
            description: "Test content",
            bold_current_selection: true,
            has_delete_icon: true,
            has_edit_icon: true,
            delete_icon_label: "translated: Delete snippet",
            edit_icon_label: "translated: Edit snippet",
        },
    ]);
});

run_test("remove_saved_snippet", () => {
    const saved_snippet_id = params.saved_snippets[0].id;
    saved_snippets.remove_saved_snippet(saved_snippet_id);
    blueslip.expect("error", "Could not find saved snippet");
    assert.equal(saved_snippets.get_saved_snippet_by_id(saved_snippet_id), undefined);
});
```

--------------------------------------------------------------------------------

---[FILE: scheduled_messages.test.cjs]---
Location: zulip-main/web/tests/scheduled_messages.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const scheduled_messages = zrequire("scheduled_messages");
const compose_send_menu_popover = zrequire("compose_send_menu_popover");
const {initialize_user_settings} = zrequire("user_settings");
const {set_realm} = zrequire("state_data");
set_realm(
    make_realm({
        max_reminder_note_length: 1000,
    }),
);

initialize_user_settings({user_settings: {}});

const per_day_stamps = {
    "2023-04-30": {
        today_nine_am: 1682845200000,
        today_four_pm: 1682870400000,
        tomorrow_nine_am: 1682931600000,
        tomorrow_four_pm: 1682956800000,
    },
    "2023-05-01": {
        today_nine_am: 1682931600000,
        today_four_pm: 1682956800000,
        tomorrow_nine_am: 1683018000000,
        tomorrow_four_pm: 1683043200000,
    },
    "2023-05-02": {
        today_nine_am: 1683018000000,
        today_four_pm: 1683043200000,
        tomorrow_nine_am: 1683104400000,
        tomorrow_four_pm: 1683129600000,
    },
    "2023-05-03": {
        today_nine_am: 1683104400000,
        today_four_pm: 1683129600000,
        tomorrow_nine_am: 1683190800000,
        tomorrow_four_pm: 1683216000000,
    },
    "2023-05-04": {
        today_nine_am: 1683190800000,
        today_four_pm: 1683216000000,
        tomorrow_nine_am: 1683277200000,
        tomorrow_four_pm: 1683302400000,
    },
    "2023-05-05": {
        today_nine_am: 1683277200000,
        today_four_pm: 1683302400000,
        tomorrow_nine_am: 1683363600000,
        tomorrow_four_pm: 1683388800000,
    },
    "2023-05-06": {
        today_nine_am: 1683363600000,
        today_four_pm: 1683388800000,
        tomorrow_nine_am: 1683450000000,
        tomorrow_four_pm: 1683475200000,
    },
};

function get_expected_send_opts(day, expecteds) {
    const modal_opts = {
        send_later_tomorrow: {
            tomorrow_nine_am: {
                text: "translated: Tomorrow at 9:00 AM",
                stamp: per_day_stamps[day].tomorrow_nine_am,
            },
            tomorrow_four_pm: {
                text: "translated: Tomorrow at 4:00 PM",
                stamp: per_day_stamps[day].tomorrow_four_pm,
            },
        },
        send_later_custom: {
            text: "translated: Custom",
        },
        possible_send_later_today: false,
        possible_send_later_monday: false,
        max_reminder_note_length: 1000,
    };
    const optional_modal_opts = {
        send_later_today: {
            today_nine_am: {
                text: "translated: Today at 9:00 AM",
                stamp: per_day_stamps[day].today_nine_am,
            },
            today_four_pm: {
                text: "translated: Today at 4:00 PM",
                stamp: per_day_stamps[day].today_four_pm,
            },
        },
        send_later_monday: {
            monday_nine_am: {
                text: "translated: Monday at 9:00 AM",
                stamp: 1683536400000, // this is always the Monday 9:00 AM time for the week of 2023-04-30
            },
        },
    };

    // 'today_nine_am'
    // 'today_four_pm'
    // 'monday_nine_am'
    for (const expect of expecteds) {
        const day = expect.split("_")[0]; // "today", "monday"
        if (!modal_opts[`possible_send_later_${day}`]) {
            modal_opts[`possible_send_later_${day}`] = {};
        }
        modal_opts[`possible_send_later_${day}`][expect] =
            optional_modal_opts[`send_later_${day}`][expect];
    }

    return modal_opts;
}

run_test("scheduled_modal_opts", () => {
    // Sunday thru Saturday
    const days = [
        "2023-04-30",
        "2023-05-01",
        "2023-05-02",
        "2023-05-03",
        "2023-05-04",
        "2023-05-05",
        "2023-05-06",
    ];
    // Extra options change based on the hour of day
    const options_by_hour = [
        {hour: "T06:00:00", extras: ["today_nine_am", "today_four_pm"]},
        {hour: "T08:54:00", extras: ["today_nine_am", "today_four_pm"]},
        {hour: "T08:57:00", extras: ["today_four_pm"]},
        {hour: "T11:00:00", extras: ["today_four_pm"]},
        {hour: "T15:54:00", extras: ["today_four_pm"]},
        {hour: "T15:57:00", extras: []},
        {hour: "T17:00:00", extras: []},
    ];

    // Now we can test those hourly options on each day of the week
    for (const day of days) {
        for (const opts of options_by_hour) {
            const date = new Date(day + opts.hour);
            // On Fridays (5) and Saturdays (6), add the Monday option
            if (date.getDay() > 4) {
                opts.extras.push("monday_nine_am");
            }
            const modal_opts = scheduled_messages.get_filtered_send_opts(date);
            const expected_opts = get_expected_send_opts(day, opts.extras);
            assert.deepEqual(modal_opts, expected_opts);
        }
    }
});

run_test("should_update_send_later_options", () => {
    // We should rerender at midnight
    const start_of_the_day = new Date();
    start_of_the_day.setHours(0, 0);
    assert.ok(compose_send_menu_popover.should_update_send_later_options(start_of_the_day));

    function get_minutes_to_hour(minutes) {
        const date = new Date();
        date.setHours(4);
        date.setMinutes(minutes);
        date.setSeconds(0);
        return date;
    }

    // We should rerender if it is 5 minutes before the hour
    for (let minute = 0; minute < 60; minute += 1) {
        const current_time = get_minutes_to_hour(minute);
        if (minute === 55) {
            // Should rerender
            assert.ok(compose_send_menu_popover.should_update_send_later_options(current_time));
        } else {
            // Should not rerender
            assert.ok(!compose_send_menu_popover.should_update_send_later_options(current_time));
        }
    }
});
```

--------------------------------------------------------------------------------

---[FILE: scroll_util.test.cjs]---
Location: zulip-main/web/tests/scroll_util.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const scroll_util = zrequire("scroll_util");

run_test("scroll_delta", () => {
    // If we are entirely on-screen, don't scroll
    assert.equal(
        0,
        scroll_util.scroll_delta({
            elem_top: 1,
            elem_bottom: 9,
            container_height: 10,
        }),
    );

    assert.equal(
        0,
        scroll_util.scroll_delta({
            elem_top: -5,
            elem_bottom: 15,
            container_height: 10,
        }),
    );

    // The top is offscreen.
    assert.equal(
        -3,
        scroll_util.scroll_delta({
            elem_top: -3,
            elem_bottom: 5,
            container_height: 10,
        }),
    );

    assert.equal(
        -3,
        scroll_util.scroll_delta({
            elem_top: -3,
            elem_bottom: -1,
            container_height: 10,
        }),
    );

    assert.equal(
        -11,
        scroll_util.scroll_delta({
            elem_top: -150,
            elem_bottom: -1,
            container_height: 10,
        }),
    );

    // The bottom is offscreen.
    assert.equal(
        3,
        scroll_util.scroll_delta({
            elem_top: 7,
            elem_bottom: 13,
            container_height: 10,
        }),
    );

    assert.equal(
        3,
        scroll_util.scroll_delta({
            elem_top: 11,
            elem_bottom: 13,
            container_height: 10,
        }),
    );

    assert.equal(
        11,
        scroll_util.scroll_delta({
            elem_top: 11,
            elem_bottom: 99,
            container_height: 10,
        }),
    );
});

run_test("scroll_element_into_container", () => {
    const $container = (function () {
        let top = 3;
        return {
            height: () => 100,
            scrollTop: (arg) => {
                if (arg === undefined) {
                    return top;
                }
                top = arg;
                return this;
            },
            offset: () => ({
                top: 0,
            }),
            __zjquery: true,
        };
    })();

    const $elem1 = {
        innerHeight: () => 25,
        offset: () => ({
            top: 0,
        }),
    };
    scroll_util.scroll_element_into_container($elem1, $container);
    assert.equal($container.scrollTop(), 3);

    const $elem2 = {
        innerHeight: () => 15,
        offset: () => ({
            top: 250,
        }),
    };
    scroll_util.scroll_element_into_container($elem2, $container);
    assert.equal($container.scrollTop(), 250 - 100 + 3 + 15);
});
```

--------------------------------------------------------------------------------

---[FILE: search.test.cjs]---
Location: zulip-main/web/tests/search.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const bootstrap_typeahead = mock_esm("../src/bootstrap_typeahead");

const people = zrequire("people");
const search = zrequire("search");
const search_pill = zrequire("search_pill");
const search_suggestion = zrequire("search_suggestion");
const {set_current_user, set_realm} = zrequire("state_data");
const stream_data = zrequire("stream_data");

const current_user = {};
set_current_user(current_user);
const realm = make_realm();
set_realm(realm);

function stub_pills() {
    const $pill_container = $("#searchbox-input-container.pill-container");
    const $pill_input = $.create("pill_input");
    $pill_container.set_find_results(".input", $pill_input);
    $pill_input.before = noop;
}

set_global("getSelection", () => ({
    modify: noop,
}));

let typeahead_forced_open = false;

const verona = {
    subscribed: true,
    color: "blue",
    name: "Verona",
    stream_id: 1,
};
stream_data.add_sub_for_tests(verona);

run_test("initialize", ({override, override_rewire, mock_template}) => {
    const $search_query_box = $("#search_query");
    const $searchbox_form = $("#searchbox_form");
    stub_pills();

    mock_template("search_list_item.hbs", true, (_data, html) => html);

    let expected_pill_display_value = "";
    let input_pill_displayed = false;
    mock_template("input_pill.hbs", true, (data, html) => {
        assert.equal(data.display_value, expected_pill_display_value);
        input_pill_displayed = true;
        return html;
    });

    override_rewire(search_suggestion, "max_num_of_search_results", 999);
    let terms;

    function mock_pill_removes(widget) {
        const pills = widget._get_pills_for_testing();
        for (const pill of pills) {
            pill.$element.remove = noop;
        }
    }

    let opts;
    override(bootstrap_typeahead, "Typeahead", (input_element, opts_) => {
        opts = opts_;
        assert.equal(input_element.$element, $search_query_box);
        assert.equal(opts.items, 999);
        assert.equal(opts.helpOnEmptyStrings, true);
        assert.equal(opts.matcher(), true);

        return {
            lookup() {
                typeahead_forced_open = true;
            },
        };
    });

    search.initialize({
        on_narrow_search() {},
    });

    {
        {
            const search_suggestions = {
                lookup_table: new Map([
                    [
                        "stream:Verona",
                        {
                            description_html: "Stream Verona",
                            search_string: "stream:Verona",
                        },
                    ],
                    [
                        "ver",
                        {
                            description_html: "Search for ver",
                            search_string: "ver",
                        },
                    ],
                ]),
                strings: ["ver", "stream:Verona"],
            };

            /* Test source */
            override_rewire(search_suggestion, "get_suggestions", () => search_suggestions);
            const expected_source_value = search_suggestions.strings;
            const source = opts.source("ver");
            assert.deepStrictEqual(source, expected_source_value);

            /* Test highlighter */
            let description_html = "Search for ver";
            let expected_value = `<div class="search_list_item">\n            <div class="description">Search for ver</div>\n    \n</div>\n`;
            assert.equal(opts.item_html(source[0]), expected_value);

            const search_string = "channel: Verona";
            description_html = "Stream Verona";
            expected_value = `<div class="search_list_item">\n            <span class="pill-container"><div class='pill ' tabindex=0>\n    <span class="pill-label">\n        <span class="pill-value">\n            ${search_string}\n        </span></span>\n    <div class="exit">\n        <a role="button" class="zulip-icon zulip-icon-close pill-close-button"></a>\n    </div>\n</div>\n</span>\n            <div class="description">${description_html}</div>\n</div>\n`;
            assert.equal(opts.item_html(source[1]), expected_value);

            /* Test sorter */
            assert.equal(opts.sorter(search_suggestions.strings), search_suggestions.strings);
        }

        {
            const search_suggestions = {
                lookup_table: new Map([
                    [
                        "dm-including:zo",
                        {
                            description_html: "group direct messages including",
                            search_string: "dm-including:user7@zulipdev.com",
                        },
                    ],
                    [
                        "dm:zo",
                        {
                            description_html: "direct messages with",
                            search_string: "dm:user7@zulipdev.com",
                        },
                    ],
                    [
                        "sender:zo",
                        {
                            description_html: "sent by",
                            search_string: "sender:user7@zulipdev.com",
                        },
                    ],
                    [
                        "zo",
                        {
                            description_html: "Search for zo",
                            search_string: "zo",
                        },
                    ],
                ]),
                strings: ["zo", "sender:zo", "dm:zo", "dm-including:zo"],
            };

            /* Test source */
            override_rewire(search_suggestion, "get_suggestions", () => search_suggestions);
            const expected_source_value = search_suggestions.strings;
            const source = opts.source("zo");
            assert.deepStrictEqual(source, expected_source_value);

            /* Test highlighter */
            const description_html = "Search for zo";
            let expected_value = `<div class="search_list_item">\n            <div class="description">${description_html}</div>\n    \n</div>\n`;
            assert.equal(opts.item_html(source[0]), expected_value);

            people.add_active_user({
                email: "user7@zulipdev.com",
                user_id: 3,
                full_name: "Zoe",
            });
            override(realm, "realm_enable_guest_user_indicator", true);
            expected_value = `<div class="search_list_item">\n            <span class="pill-container"><div class="user-pill-container pill" tabindex=0>\n    <span class="pill-label">sender:\n    </span>\n        <div class="pill" data-user-id="3">\n            <img class="pill-image" src="/avatar/3" />\n            <div class="pill-image-border"></div>\n            <span class="pill-label">\n                <span class="pill-value">Zoe</span></span>\n            <div class="exit">\n                <a role="button" class="zulip-icon zulip-icon-close pill-close-button"></a>\n            </div>\n        </div>\n</div>\n</span>\n    \n</div>\n`;
            assert.equal(opts.item_html(source[1]), expected_value);

            expected_value = `<div class="search_list_item">\n            <span class="pill-container"><div class="user-pill-container pill" tabindex=0>\n    <span class="pill-label">dm:\n    </span>\n        <div class="pill" data-user-id="3">\n            <img class="pill-image" src="/avatar/3" />\n            <div class="pill-image-border"></div>\n            <span class="pill-label">\n                <span class="pill-value">Zoe</span></span>\n            <div class="exit">\n                <a role="button" class="zulip-icon zulip-icon-close pill-close-button"></a>\n            </div>\n        </div>\n</div>\n</span>\n    \n</div>\n`;
            assert.equal(opts.item_html(source[2]), expected_value);

            expected_value = `<div class="search_list_item">\n            <span class="pill-container"><div class="user-pill-container pill" tabindex=0>\n    <span class="pill-label">dm-including:\n    </span>\n        <div class="pill" data-user-id="3">\n            <img class="pill-image" src="/avatar/3" />\n            <div class="pill-image-border"></div>\n            <span class="pill-label">\n                <span class="pill-value">Zoe</span></span>\n            <div class="exit">\n                <a role="button" class="zulip-icon zulip-icon-close pill-close-button"></a>\n            </div>\n        </div>\n</div>\n</span>\n    \n</div>\n`;
            assert.equal(opts.item_html(source[3]), expected_value);

            /* Test sorter */
            assert.equal(opts.sorter(search_suggestions.strings), search_suggestions.strings);
        }

        {
            /* Test updater */
            const _setup = (terms) => {
                const pills = search.search_pill_widget._get_pills_for_testing();
                for (const pill of pills) {
                    pill.$element.remove = noop;
                }
                search_pill.set_search_bar_contents(
                    terms,
                    search.search_pill_widget,
                    false,
                    $search_query_box.text,
                );
            };

            terms = [
                {
                    negated: false,
                    operator: "search",
                    operand: "ver",
                },
            ];
            expected_pill_display_value = null;
            _setup(terms);
            input_pill_displayed = false;
            mock_pill_removes(search.search_pill_widget);
            $(".navbar-search.expanded").length = 1;
            assert.equal(opts.updater("ver"), "ver");
            assert.ok(!input_pill_displayed);

            const verona_stream_id = verona.stream_id.toString();
            terms = [
                {
                    negated: false,
                    operator: "channel",
                    operand: verona_stream_id,
                },
            ];
            expected_pill_display_value = "channel: Verona";
            _setup(terms);
            input_pill_displayed = false;
            mock_pill_removes(search.search_pill_widget);
            assert.equal(opts.updater(`channel:${verona_stream_id}`), "");
            assert.ok(input_pill_displayed);

            override_rewire(search, "is_using_input_method", true);
            _setup(terms);
            input_pill_displayed = false;
            mock_pill_removes(search.search_pill_widget);
            assert.equal(opts.updater(`channel:${verona_stream_id}`), "");
            assert.ok(input_pill_displayed);
        }
    }

    $search_query_box.text("test string");

    override_rewire(search, "is_using_input_method", false);
    $searchbox_form.trigger("compositionend");
    assert.ok(search.is_using_input_method);

    const keydown = $searchbox_form.get_on_handler("keydown");
    let default_prevented = false;
    let ev = {
        type: "keydown",
        which: 15,
        preventDefault() {
            default_prevented = true;
        },
    };
    $search_query_box.is = () => false;
    assert.equal(keydown(ev), undefined);
    assert.ok(!default_prevented);

    ev.key = "Enter";
    assert.equal(keydown(ev), undefined);
    assert.ok(!default_prevented);

    ev.key = "Enter";
    $search_query_box.is = () => true;
    assert.equal(keydown(ev), undefined);
    assert.ok(default_prevented);

    ev = {
        type: "keyup",
    };

    const _setup = (terms) => {
        const pills = search.search_pill_widget._get_pills_for_testing();
        for (const pill of pills) {
            pill.$element.remove = noop;
        }
        search_pill.set_search_bar_contents(
            terms,
            search.search_pill_widget,
            false,
            $search_query_box.text,
        );
    };

    terms = [
        {
            negated: false,
            operator: "search",
            operand: "",
        },
    ];
    _setup(terms);

    ev.key = "a";
    /* istanbul ignore next */
    $search_query_box.is = () => false;
    $searchbox_form.trigger(ev);

    let search_exited = false;
    override_rewire(search, "exit_search", () => {
        search_exited = true;
    });

    ev.key = "Enter";
    $search_query_box.is = () => false;
    $searchbox_form.trigger(ev);
    assert.ok(!search_exited);

    ev.key = "Enter";
    $search_query_box.is = () => true;
    $searchbox_form.trigger(ev);
    assert.ok(search_exited);

    let is_blurred = false;
    $search_query_box.on("blur", () => {
        is_blurred = true;
    });
    terms = [
        {
            negated: false,
            operator: "search",
            operand: "ver",
        },
    ];
    expected_pill_display_value = "ver";
    _setup(terms);
    ev.key = "Enter";
    override_rewire(search, "is_using_input_method", true);
    $searchbox_form.trigger(ev);
    // No change on first Enter keyup event
    assert.ok(!is_blurred);
    $searchbox_form.trigger(ev);
    assert.ok(is_blurred);
});

run_test("initiate_search", ({override_rewire}) => {
    let search_bar_opened = false;
    override_rewire(search, "open_search_bar_and_close_narrow_description", () => {
        search_bar_opened = true;
    });
    $(".navbar-search.expanded").length = 0;
    $("#search_query").text("");
    search.initiate_search();
    assert.ok(typeahead_forced_open);
    assert.ok(search_bar_opened);
    assert.equal($("#search_query").text(), "");
});

run_test("set_search_bar_contents with duplicate pills", () => {
    const duplicate_attachment_terms = [
        {
            negated: false,
            operator: "has",
            operand: "attachment",
        },
        {
            negated: false,
            operator: "has",
            operand: "attachment",
        },
    ];
    search_pill.set_search_bar_contents(
        duplicate_attachment_terms,
        search.search_pill_widget,
        false,
        noop,
    );
    const pills = search.search_pill_widget._get_pills_for_testing();
    assert.equal(pills.length, 1);
    assert.deepEqual(pills[0].item, {
        type: "generic_operator",
        operator: "has",
        operand: "attachment",
        negated: false,
    });
});
```

--------------------------------------------------------------------------------

````
