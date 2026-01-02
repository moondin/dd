---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 793
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 793 of 1290)

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

---[FILE: fold_dict.test.cjs]---
Location: zulip-main/web/tests/fold_dict.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const {FoldDict} = zrequire("fold_dict");

run_test("basic", () => {
    const d = new FoldDict();

    assert.equal(d.size, 0);

    assert.deepEqual([...d.keys()], []);

    d.set("foo", "bar");
    assert.equal(d.get("foo"), "bar");
    assert.notEqual(d.size, 0);

    d.set("foo", "baz");
    assert.equal(d.get("foo"), "baz");
    assert.equal(d.size, 1);

    d.set("bar", "qux");
    assert.equal(d.get("foo"), "baz");
    assert.equal(d.get("bar"), "qux");
    assert.equal(d.size, 2);

    assert.equal(d.has("bar"), true);
    assert.equal(d.has("baz"), false);

    assert.deepEqual([...d.keys()], ["foo", "bar"]);
    assert.deepEqual([...d.values()], ["baz", "qux"]);
    assert.deepEqual(
        [...d],
        [
            ["foo", "baz"],
            ["bar", "qux"],
        ],
    );

    d.delete("bar");
    assert.equal(d.has("bar"), false);
    assert.strictEqual(d.get("bar"), undefined);

    assert.deepEqual([...d.keys()], ["foo"]);

    const val = ["foo"];
    const res = d.set("abc", val);
    assert.strictEqual(res, d);
});

run_test("case insensitivity", () => {
    const d = new FoldDict();

    assert.deepEqual([...d.keys()], []);

    assert.ok(!d.has("foo"));
    d.set("fOO", "Hello world");
    assert.equal(d.get("foo"), "Hello world");
    assert.ok(d.has("foo"));
    assert.ok(d.has("FOO"));
    assert.ok(!d.has("not_a_key"));

    assert.deepEqual([...d.keys()], ["fOO"]);

    d.delete("Foo");
    assert.equal(d.has("foo"), false);

    assert.deepEqual([...d.keys()], []);
});

run_test("clear", () => {
    const d = new FoldDict();

    function populate() {
        d.set("fOO", 1);
        assert.equal(d.get("foo"), 1);
        d.set("bAR", 2);
        assert.equal(d.get("bar"), 2);
    }

    populate();
    assert.equal(d.size, 2);

    d.clear();
    assert.equal(d.get("fOO"), undefined);
    assert.equal(d.get("bAR"), undefined);
    assert.equal(d.size, 0);

    // make sure it still works after clearing
    populate();
    assert.equal(d.size, 2);
});

run_test("undefined_keys", () => {
    const d = new FoldDict();

    assert.throws(() => d.has(undefined), {
        name: "TypeError",
        message: "Tried to call a FoldDict method with an undefined key.",
    });
});
```

--------------------------------------------------------------------------------

---[FILE: gear_menu_util.test.cjs]---
Location: zulip-main/web/tests/gear_menu_util.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const gear_menu_util = zrequire("gear_menu_util");
const {set_realm} = zrequire("state_data");

const realm = make_realm();
set_realm(realm);

run_test("version_display_string", ({override}) => {
    let expected_version_display_string;

    // An official release
    override(realm, "zulip_version", "5.6");
    override(realm, "zulip_merge_base", "5.6");
    expected_version_display_string = "translated: Zulip Server 5.6";
    assert.equal(gear_menu_util.version_display_string(), expected_version_display_string);

    // An official beta
    override(realm, "zulip_version", "6.0-beta1");
    override(realm, "zulip_merge_base", "6.0-beta1");
    expected_version_display_string = "translated: Zulip Server 6.0-beta1";
    assert.equal(gear_menu_util.version_display_string(), expected_version_display_string);

    // An official release candidate
    override(realm, "zulip_version", "6.0-rc1");
    override(realm, "zulip_merge_base", "6.0-rc1");
    expected_version_display_string = "translated: Zulip Server 6.0-rc1";
    assert.equal(gear_menu_util.version_display_string(), expected_version_display_string);

    // The Zulip development environment
    override(realm, "zulip_version", "6.0-dev+git");
    override(realm, "zulip_merge_base", "6.0-dev+git");
    expected_version_display_string = "translated: Zulip Server dev environment";
    assert.equal(gear_menu_util.version_display_string(), expected_version_display_string);

    // A commit on Zulip's main branch.
    override(realm, "zulip_version", "6.0-dev-1976-g4bb381fc80");
    override(realm, "zulip_merge_base", "6.0-dev-1976-g4bb381fc80");
    expected_version_display_string = "translated: Zulip Server 6.0-dev";
    assert.equal(gear_menu_util.version_display_string(), expected_version_display_string);

    // A fork with 18 commits beyond Zulip's main branch.
    override(realm, "zulip_version", "6.0-dev-1994-g93730766b0");
    override(realm, "zulip_merge_base", "6.0-dev-1976-g4bb381fc80");
    expected_version_display_string = "translated: Zulip Server 6.0-dev (modified)";
    assert.equal(gear_menu_util.version_display_string(), expected_version_display_string);

    // A commit from the Zulip 5.x branch
    override(realm, "zulip_version", "5.6+git-4-g385a408be5");
    override(realm, "zulip_merge_base", "5.6+git-4-g385a408be5");
    expected_version_display_string = "translated: Zulip Server 5.6 (patched)";
    assert.equal(gear_menu_util.version_display_string(), expected_version_display_string);

    // A fork with 3 commits beyond the Zulip 5.x branch.
    override(realm, "zulip_version", "5.6+git-4-g385a408be5");
    override(realm, "zulip_merge_base", "5.6+git-7-abcda4235c2");
    expected_version_display_string = "translated: Zulip Server 5.6 (modified)";
    assert.equal(gear_menu_util.version_display_string(), expected_version_display_string);

    // A fork of a Zulip release commit, not on 5.x branch.
    override(realm, "zulip_version", "5.3-1-g7ed896c0db");
    override(realm, "zulip_merge_base", "5.3");
    expected_version_display_string = "translated: Zulip Server 5.3 (modified)";
    assert.equal(gear_menu_util.version_display_string(), expected_version_display_string);
});
```

--------------------------------------------------------------------------------

---[FILE: hashchange.test.cjs]---
Location: zulip-main/web/tests/hashchange.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");
const $ = require("./lib/zjquery.cjs");
const {page_params} = require("./lib/zpage_params.cjs");

let $window_stub;
set_global("to_$", () => $window_stub);

set_global("document", "document-stub");
const history = set_global("history", {state: null});

const admin = mock_esm("../src/admin");
const drafts_overlay_ui = mock_esm("../src/drafts_overlay_ui");
const info_overlay = mock_esm("../src/info_overlay");
const message_viewport = mock_esm("../src/message_viewport");
const overlays = mock_esm("../src/overlays");
const popovers = mock_esm("../src/popovers");
const recent_view_ui = mock_esm("../src/recent_view_ui");
const settings = mock_esm("../src/settings");
mock_esm("../src/settings_data", {
    user_can_create_public_streams: () => true,
});
const spectators = mock_esm("../src/spectators", {
    login_to_access() {},
});
const stream_settings_ui = mock_esm("../src/stream_settings_ui");
const ui_util = mock_esm("../src/ui_util");
const ui_report = mock_esm("../src/ui_report");
set_global("favicon", {});

const browser_history = zrequire("browser_history");
const people = zrequire("people");
const hash_util = zrequire("hash_util");
const hashchange = zrequire("hashchange");
const message_view = zrequire("../src/message_view");
const stream_data = zrequire("stream_data");
const {Filter} = zrequire("../src/filter");
const {initialize_user_settings} = zrequire("user_settings");

const user_settings = {};
initialize_user_settings({user_settings});

const devel_id = 100;
const devel = {
    name: "devel",
    stream_id: devel_id,
    color: "blue",
    subscribed: true,
};
stream_data.add_sub_for_tests(devel);

run_test("terms_round_trip", () => {
    let terms;
    let hash;
    let narrow;

    terms = [
        {operator: "stream", operand: devel_id.toString()},
        {operator: "topic", operand: "algol"},
    ];
    hash = hash_util.search_terms_to_hash(terms);
    assert.equal(hash, "#narrow/channel/100-devel/topic/algol");

    narrow = hash_util.parse_narrow(hash.split("/"));
    assert.deepEqual(narrow, [
        {operator: "channel", operand: devel_id.toString(), negated: false},
        {operator: "topic", operand: "algol", negated: false},
    ]);

    terms = [
        {operator: "stream", operand: devel_id.toString()},
        {operator: "topic", operand: "visual c++", negated: true},
    ];
    hash = hash_util.search_terms_to_hash(terms);
    assert.equal(hash, "#narrow/channel/100-devel/-topic/visual.20c.2B.2B");

    narrow = hash_util.parse_narrow(hash.split("/"));
    assert.deepEqual(narrow, [
        {operator: "channel", operand: devel_id.toString(), negated: false},
        {operator: "topic", operand: "visual c++", negated: true},
    ]);

    // test new encodings, where we have a stream id
    const florida_id = 987;
    const florida_stream = {
        name: "Florida, USA",
        stream_id: florida_id,
    };
    stream_data.add_sub_for_tests(florida_stream);
    terms = [{operator: "stream", operand: florida_id.toString()}];
    hash = hash_util.search_terms_to_hash(terms);
    assert.equal(hash, "#narrow/channel/987-Florida.2C-USA");
    narrow = hash_util.parse_narrow(hash.split("/"));
    assert.deepEqual(narrow, [
        {operator: "channel", operand: florida_id.toString(), negated: false},
    ]);
});

run_test("stream_to_channel_rename", () => {
    let terms;
    let hash;
    let narrow;
    let filter;

    // Confirm searches with "stream" and "streams" return URLs and
    // Filter objects with the new "channel" and "channels" operators.
    terms = [{operator: "stream", operand: devel_id.toString()}];
    hash = hash_util.search_terms_to_hash(terms);
    assert.equal(hash, "#narrow/channel/100-devel");
    narrow = hash_util.parse_narrow(hash.split("/"));
    assert.deepEqual(narrow, [{operator: "channel", operand: devel_id.toString(), negated: false}]);
    filter = new Filter(narrow);
    assert.deepEqual(filter.terms(), [
        {operator: "channel", operand: devel_id.toString(), negated: false},
    ]);

    terms = [{operator: "streams", operand: "public"}];
    hash = hash_util.search_terms_to_hash(terms);
    assert.equal(hash, "#narrow/channels/public");
    narrow = hash_util.parse_narrow(hash.split("/"));
    assert.deepEqual(narrow, [{operator: "channels", operand: "public", negated: false}]);
    filter = new Filter(narrow);
    assert.deepEqual(filter.terms(), [{operator: "channels", operand: "public", negated: false}]);

    // Confirm that a narrow URL with "channel" and an enocoded stream/channel ID,
    // will be decoded correctly.
    const test_stream_id = 34;
    const test_channel = {
        name: "decode",
        stream_id: test_stream_id,
    };
    stream_data.add_sub_for_tests(test_channel);
    hash = "#narrow/channel/34-decode";
    narrow = hash_util.parse_narrow(hash.split("/"));
    assert.deepEqual(narrow, [
        {operator: "channel", operand: test_stream_id.toString(), negated: false},
    ]);
    filter = new Filter(narrow);
    assert.deepEqual(filter.terms(), [
        {operator: "channel", operand: test_stream_id.toString(), negated: false},
    ]);
});

run_test("terms_trailing_slash", () => {
    const hash = "#narrow/channel/100-devel/topic/algol/";
    const narrow = hash_util.parse_narrow(hash.split("/"));
    assert.deepEqual(narrow, [
        {operator: "channel", operand: devel_id.toString(), negated: false},
        {operator: "topic", operand: "algol", negated: false},
    ]);
});

run_test("people_slugs", () => {
    let terms;
    let hash;
    let narrow;

    const alice = {
        email: "alice@example.com",
        user_id: 42,
        full_name: "Alice Smith",
    };

    people.add_active_user(alice);
    terms = [{operator: "sender", operand: "alice@example.com"}];
    hash = hash_util.search_terms_to_hash(terms);
    assert.equal(hash, "#narrow/sender/42-Alice-Smith");
    narrow = hash_util.parse_narrow(hash.split("/"));
    assert.deepEqual(narrow, [{operator: "sender", operand: "alice@example.com", negated: false}]);

    terms = [{operator: "dm", operand: "alice@example.com"}];
    hash = hash_util.search_terms_to_hash(terms);
    assert.equal(hash, "#narrow/dm/42-Alice-Smith");
    narrow = hash_util.parse_narrow(hash.split("/"));
    assert.deepEqual(narrow, [{operator: "dm", operand: "alice@example.com", negated: false}]);

    // Even though we renamed "pm-with" to "dm", preexisting
    // links/URLs with "pm-with" operator are handled correctly.
    terms = [{operator: "pm-with", operand: "alice@example.com"}];
    hash = hash_util.search_terms_to_hash(terms);
    assert.equal(hash, "#narrow/pm-with/42-Alice-Smith");
    narrow = hash_util.parse_narrow(hash.split("/"));
    assert.deepEqual(narrow, [{operator: "dm", operand: "alice@example.com", negated: false}]);
});

function test_helper({override, override_rewire, change_tab}) {
    let events = [];
    let narrow_terms;

    function stub(module, func_name) {
        module[func_name] = () => {
            events.push([module, func_name]);
        };
    }

    function stub_with_args(module, func_name) {
        module[func_name] = (...args) => {
            events.push([module, func_name, args]);
        };
    }

    stub_with_args(admin, "launch");
    stub(admin, "build_page");
    stub(drafts_overlay_ui, "launch");
    stub(message_viewport, "stop_auto_scrolling");
    stub(overlays, "close_for_hash_change");
    stub(settings, "launch");
    stub(settings, "build_page");
    stub(stream_settings_ui, "launch");
    stub(ui_util, "blur_active_element");
    stub(ui_report, "error");
    stub(spectators, "login_to_access");

    if (change_tab) {
        override_rewire(message_view, "show", (terms) => {
            narrow_terms = terms;
            events.push("message_view.show");
        });

        override(info_overlay, "show", (name) => {
            events.push("info: " + name);
        });
    }

    return {
        clear_events() {
            events = [];
        },
        assert_events(expected_events) {
            assert.deepEqual(events, expected_events);
        },
        get_narrow_terms: () => narrow_terms,
    };
}

run_test("hash_interactions", ({override, override_rewire}) => {
    $window_stub = $.create("window-stub");
    override(user_settings, "web_home_view", "recent_topics");

    const helper = test_helper({override, override_rewire, change_tab: true});

    let recent_view_ui_shown = false;
    override(recent_view_ui, "show", () => {
        recent_view_ui_shown = true;
    });
    let hide_all_called = false;
    override(popovers, "hide_all", () => {
        hide_all_called = true;
    });
    window.location.hash = "#unknown_hash";

    browser_history.clear_for_testing();
    hashchange.initialize();
    // If it's an unknown hash it should show the home view.
    assert.equal(recent_view_ui_shown, true);
    assert.equal(hide_all_called, true);
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [message_viewport, "stop_auto_scrolling"],
    ]);

    window.location.hash = "#feed";
    hide_all_called = false;

    helper.clear_events();
    $window_stub.trigger("hashchange");
    assert.equal(hide_all_called, true);
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [message_viewport, "stop_auto_scrolling"],
        "message_view.show",
    ]);

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [message_viewport, "stop_auto_scrolling"],
        "message_view.show",
    ]);

    // Test old "#recent_topics" hash redirects to "#recent".
    recent_view_ui_shown = false;
    window.location.hash = "#recent_topics";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    assert.equal(recent_view_ui_shown, true);
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [message_viewport, "stop_auto_scrolling"],
    ]);
    assert.equal(window.location.hash, "#recent");

    const denmark_id = 1;
    stream_data.add_sub_for_tests({
        subscribed: true,
        name: "Denmark",
        stream_id: denmark_id,
    });
    window.location.hash = "#narrow/channel/Denmark";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [message_viewport, "stop_auto_scrolling"],
        "message_view.show",
    ]);
    let terms = helper.get_narrow_terms();
    assert.equal(terms[0].operand, denmark_id.toString());

    window.location.hash = "#narrow";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [message_viewport, "stop_auto_scrolling"],
        "message_view.show",
    ]);
    terms = helper.get_narrow_terms();
    assert.equal(terms.length, 0);

    page_params.is_spectator = true;

    window.location.hash = "#narrow/is/resolved/has/reaction";
    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [message_viewport, "stop_auto_scrolling"],
        "message_view.show",
    ]);
    terms = helper.get_narrow_terms();
    assert.equal(terms.length, 2);

    // Test a narrow that spectators are not permitted to access.
    window.location.hash = "#narrow/is/resolved/is/unread";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([[spectators, "login_to_access"]]);

    page_params.is_spectator = false;

    // Test an invalid narrow hash
    window.location.hash = "#narrow/foo.foo";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [message_viewport, "stop_auto_scrolling"],
        [ui_report, "error"],
    ]);

    window.location.hash = "#channels/subscribed";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [stream_settings_ui, "launch"],
    ]);

    recent_view_ui_shown = false;
    window.location.hash = "#reload:send_after_reload=0...";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([]);
    // If it's reload hash it shouldn't show the home view.
    assert.equal(recent_view_ui_shown, false);

    window.location.hash = "#keyboard-shortcuts/whatever";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([[overlays, "close_for_hash_change"], "info: keyboard-shortcuts"]);

    window.location.hash = "#message-formatting/whatever";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([[overlays, "close_for_hash_change"], "info: message-formatting"]);

    window.location.hash = "#search-operators/whatever";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([[overlays, "close_for_hash_change"], "info: search-operators"]);

    window.location.hash = "#drafts";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [drafts_overlay_ui, "launch"],
    ]);

    window.location.hash = "#settings/alert-words";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [settings, "build_page"],
        [admin, "build_page"],
        [settings, "launch"],
    ]);

    window.location.hash = "#organization/users/active";

    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [settings, "build_page"],
        [admin, "build_page"],
        [admin, "launch", ["users", "active"]],
    ]);

    window.location.hash = "#organization/user-list-admin";

    // Check whether `user-list-admin` is redirect to `users`, we
    // cannot test the exact hashchange here, since the section url
    // takes effect in `admin.launch` and that's why we're checking
    // the arguments passed to `admin.launch`.
    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [settings, "build_page"],
        [admin, "build_page"],
        [admin, "launch", ["users", "active"]],
    ]);

    helper.clear_events();
    browser_history.exit_overlay();

    helper.assert_events([[ui_util, "blur_active_element"]]);
});

run_test("update_hash_to_match_filter", ({override, override_rewire}) => {
    const helper = test_helper({override, override_rewire});

    let terms = [{operator: "is", operand: "dm"}];

    blueslip.expect("error", "browser does not support pushState");
    message_view.update_hash_to_match_filter(new Filter(terms));

    helper.assert_events([[message_viewport, "stop_auto_scrolling"]]);
    assert.equal(window.location.hash, "#narrow/is/dm");

    let url_pushed;
    override(history, "pushState", (_state, _title, url) => {
        url_pushed = url;
    });

    terms = [{operator: "is", operand: "starred"}];

    helper.clear_events();
    message_view.update_hash_to_match_filter(new Filter(terms));
    helper.assert_events([[message_viewport, "stop_auto_scrolling"]]);
    assert.equal(url_pushed, "http://zulip.zulipdev.com/#narrow/is/starred");

    terms = [{operator: "is", operand: "starred", negated: true}];

    helper.clear_events();
    message_view.update_hash_to_match_filter(new Filter(terms));
    helper.assert_events([[message_viewport, "stop_auto_scrolling"]]);
    assert.equal(url_pushed, "http://zulip.zulipdev.com/#narrow/-is/starred");
});

run_test("fail_incorrectly_cased_URL", ({override, override_rewire}) => {
    browser_history.clear_for_testing();
    override(popovers, "hide_all", noop);
    const helper = test_helper({override, override_rewire, change_tab: false});

    // We can receive URLs which contain operators that
    // are not cased correctly. We don't have to handle them
    // since this is not a good reason to increase the types
    // of URLs that are valid on a Zulip realm.
    window.location.hash = "#narrow/chAnnel/4-Denmark/topic/PLOTS/with/99";
    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [message_viewport, "stop_auto_scrolling"],
        [ui_report, "error"],
    ]);

    window.location.hash = "#narrow/channel/4-Denmark/tOPic/PLOTS/with/99";
    helper.clear_events();
    $window_stub.trigger("hashchange");
    helper.assert_events([
        [overlays, "close_for_hash_change"],
        [message_viewport, "stop_auto_scrolling"],
        [ui_report, "error"],
    ]);
});
```

--------------------------------------------------------------------------------

---[FILE: hash_util.test.cjs]---
Location: zulip-main/web/tests/hash_util.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const message_link_test_cases = require("../../zerver/tests/fixtures/message_link_test_cases.json");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const hash_parser = zrequire("hash_parser");
const hash_util = zrequire("hash_util");
const stream_data = zrequire("stream_data");
const people = zrequire("people");
const spectators = zrequire("spectators");

const hamlet = {
    user_id: 15,
    email: "hamlet@example.com",
    full_name: "Hamlet",
};

people.add_active_user(hamlet);

const frontend_id = 99;
const frontend = {
    stream_id: frontend_id,
    name: "frontend",
};

stream_data.add_sub_for_tests(frontend);

run_test("hash_util", () => {
    // Test encode_operand and decode_operand
    function encode_decode_operand(operator, operand, expected_val) {
        const encode_result = hash_util.encode_operand(operator, operand);
        assert.equal(encode_result, expected_val);
        const new_operand = encode_result;
        const decode_result = hash_util.decode_operand(operator, new_operand);
        assert.equal(decode_result, operand);
    }

    let operator = "sender";
    let operand = hamlet.email;

    encode_decode_operand(operator, operand, "15-Hamlet");

    operator = "channel";
    operand = frontend_id.toString();

    encode_decode_operand(operator, operand, "99-frontend");

    operator = "topic";
    operand = "testing 123";

    encode_decode_operand(operator, operand, "testing.20123");
});

run_test("test_get_hash_category", () => {
    assert.deepEqual(hash_parser.get_hash_category("channels/subscribed"), "channels");
    assert.deepEqual(hash_parser.get_hash_category("#settings/preferences"), "settings");
    assert.deepEqual(hash_parser.get_hash_category("#drafts"), "drafts");
    assert.deepEqual(hash_parser.get_hash_category("invites"), "invites");

    window.location.hash = "#settings/profile";
    assert.deepEqual(hash_parser.get_current_hash_category(), "settings");
});

run_test("test_get_hash_section", () => {
    assert.equal(hash_parser.get_hash_section("channels/subscribed"), "subscribed");
    assert.equal(hash_parser.get_hash_section("#settings/profile"), "profile");

    assert.equal(hash_parser.get_hash_section("settings/10/general/"), "10");

    assert.equal(hash_parser.get_hash_section("#drafts"), "");
    assert.equal(hash_parser.get_hash_section(""), "");

    window.location.hash = "#settings/profile";
    assert.deepEqual(hash_parser.get_current_hash_section(), "profile");
});

run_test("get_current_nth_hash_section", () => {
    window.location.hash = "#settings/profile";
    assert.equal(hash_parser.get_current_nth_hash_section(0), "#settings");
    assert.equal(hash_parser.get_current_nth_hash_section(1), "profile");

    window.location.hash = "#settings/10/general";
    assert.equal(hash_parser.get_current_nth_hash_section(0), "#settings");
    assert.equal(hash_parser.get_current_nth_hash_section(1), "10");
    assert.equal(hash_parser.get_current_nth_hash_section(2), "general");
    assert.equal(hash_parser.get_current_nth_hash_section(3), "");
});

run_test("test_is_same_server_message_link", () => {
    for (const message_link_test_case of message_link_test_cases) {
        assert.equal(
            hash_parser.is_same_server_message_link(message_link_test_case.message_link),
            message_link_test_case.expected_output,
        );
    }
});

run_test("get_reload_hash", () => {
    window.location.hash = "#settings/profile";
    assert.equal(hash_util.get_reload_hash(), "settings/profile");

    window.location.hash = "#test";
    assert.equal(hash_util.get_reload_hash(), "test");

    window.location.hash = "#";
    assert.equal(hash_util.get_reload_hash(), "");

    window.location.hash = "";
    assert.equal(hash_util.get_reload_hash(), "");
});

run_test("test is_editing_stream", () => {
    window.location.hash = "#channels/1/announce";
    assert.equal(hash_parser.is_editing_stream(1), true);
    assert.equal(hash_parser.is_editing_stream(2), false);

    // url is missing name at end
    window.location.hash = "#channels/1";
    assert.equal(hash_parser.is_editing_stream(1), false);

    window.location.hash = "#channels/bogus/bogus";
    assert.equal(hash_parser.is_editing_stream(1), false);

    window.location.hash = "#test/narrow";
    assert.equal(hash_parser.is_editing_stream(1), false);
});

run_test("test_is_create_new_stream_narrow", () => {
    window.location.hash = "#channels/new";
    assert.equal(hash_parser.is_create_new_stream_narrow(), true);

    window.location.hash = "#some/random/hash";
    assert.equal(hash_parser.is_create_new_stream_narrow(), false);
});

run_test("test_is_subscribers_section_opened_for_stream", () => {
    window.location.hash = "#channels/1/Design/subscribers";
    assert.equal(hash_parser.is_subscribers_section_opened_for_stream(), true);

    window.location.hash = "#channels/99/.EC.A1.B0.EB.A6.AC.EB.B2.95.20.F0.9F.98.8E/subscribers";
    assert.equal(hash_parser.is_subscribers_section_opened_for_stream(), true);

    window.location.hash = "#channels/random/subscribers";
    assert.equal(hash_parser.is_subscribers_section_opened_for_stream(), false);

    window.location.hash = "#some/random/place/subscribers";
    assert.equal(hash_parser.is_subscribers_section_opened_for_stream(), false);

    window.location.hash = "#";
    assert.equal(hash_parser.is_subscribers_section_opened_for_stream(), false);
});

run_test("test_is_in_specified_hash_category", () => {
    window.location.hash = "#channels/1/Design/subscribers";
    assert.equal(hash_parser.is_in_specified_hash_category(["channels", "channel"]), true);

    window.location.hash = "#channels/99/.EC.A1.B0.EB.A6.AC.EB.B2.95.20.F0.9F.98.8E/subscribers";
    assert.equal(hash_parser.is_in_specified_hash_category(["channels", "channel"]), true);

    window.location.hash = "#gro/channels/channel";
    assert.equal(hash_parser.is_in_specified_hash_category(["stream", "channel", "group"]), false);

    window.location.hash = "#some/stream/channel/group";
    assert.equal(hash_parser.is_in_specified_hash_category(["stream", "channel", "group"]), false);

    window.location.hash = "#some/stream/channel/group";
    assert.equal(hash_parser.is_in_specified_hash_category([""]), false);

    window.location.hash = "#some/stream/channel/group";
    assert.equal(hash_parser.is_in_specified_hash_category([]), false);
});

run_test("test_parse_narrow", () => {
    assert.deepEqual(hash_util.parse_narrow(["narrow", "stream", "99-frontend"]), [
        {negated: false, operator: "channel", operand: frontend_id.toString()},
    ]);

    assert.deepEqual(hash_util.parse_narrow(["narrow", "-stream", "99-frontend"]), [
        {negated: true, operator: "channel", operand: frontend_id.toString()},
    ]);

    assert.equal(hash_util.parse_narrow(["narrow", "BOGUS"]), undefined);

    // For unknown channel IDs, we still parse it; it could be a valid channel we do
    // not have access to. We'll end up showing "Invalid stream" in the navbar.
    assert.deepEqual(hash_util.parse_narrow(["narrow", "stream", "42-bogus"]), [
        {negated: false, operator: "channel", operand: "42"},
    ]);

    // Empty string as a topic name is valid.
    assert.deepEqual(hash_util.parse_narrow(["narrow", "stream", "99-frontend", "topic", ""]), [
        {negated: false, operator: "channel", operand: frontend_id.toString()},
        {negated: false, operator: "topic", operand: ""},
    ]);

    // Empty string used as an operand in other cases is invalid.
    assert.deepEqual(
        hash_util.parse_narrow(["narrow", "stream", "99-frontend", "topic", "", "near", ""]),
        undefined,
    );
});

run_test("test_channels_settings_edit_url", () => {
    const sub = {
        name: "research & development",
        stream_id: 42,
    };
    assert.equal(
        hash_util.channels_settings_edit_url(sub, "general"),
        "#channels/42/research.20.26.20development/general",
    );
});

run_test("test_by_conversation_and_time_url", () => {
    let message = {
        type: "stream",
        stream_id: frontend.stream_id,
        topic: "testing",
        id: 42,
    };

    assert.equal(
        hash_util.by_conversation_and_time_url(message),
        "http://zulip.zulipdev.com/#narrow/channel/99-frontend/topic/testing/near/42",
    );

    message = {
        type: "private",
        display_recipient: [
            {
                id: hamlet.user_id,
            },
        ],
        id: 43,
    };

    assert.equal(
        hash_util.by_conversation_and_time_url(message),
        "http://zulip.zulipdev.com/#narrow/dm/15-dm/near/43",
    );
});

run_test("test_search_public_streams_notice_url", () => {
    function get_terms(url) {
        return hash_util.parse_narrow(url.split("/"));
    }

    assert.equal(
        hash_util.search_public_streams_notice_url(get_terms("#narrow/search/abc")),
        "#narrow/channels/public/search/abc",
    );

    assert.equal(
        hash_util.search_public_streams_notice_url(
            get_terms("#narrow/has/link/has/image/has/attachment"),
        ),
        "#narrow/channels/public/has/link/has/image/has/attachment",
    );

    assert.equal(
        hash_util.search_public_streams_notice_url(get_terms("#narrow/sender/15")),
        "#narrow/channels/public/sender/15-Hamlet",
    );
});

run_test("test_current_hash_as_next", () => {
    window.location.hash = "#foo";
    assert.equal(spectators.current_hash_as_next(), "next=/%23foo");
});
```

--------------------------------------------------------------------------------

````
