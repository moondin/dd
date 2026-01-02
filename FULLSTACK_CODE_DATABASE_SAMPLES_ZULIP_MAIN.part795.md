---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 795
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 795 of 1290)

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

---[FILE: input_pill.test.cjs]---
Location: zulip-main/web/tests/input_pill.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

set_global("document", {});
class ClipboardEvent {}
set_global("ClipboardEvent", ClipboardEvent);

mock_esm("../src/ui_util", {
    place_caret_at_end: noop,
});

set_global("getSelection", () => ({
    anchorOffset: 0,
}));

const input_pill = zrequire("input_pill");

function pill_html(value) {
    const opts = {
        display_value: value,
    };
    return require("../templates/input_pill.hbs")(opts);
}

run_test("basics", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (data, html) => {
        assert.equal(data.display_value, "JavaScript");
        return html;
    });

    const $pill_input = $.create("pill_input");
    const $container = $.create("container");
    $container.set_find_results(".input", $pill_input);

    const widget = input_pill.create({
        $container,
        create_item_from_text: noop,
        get_text_from_item: noop,
        get_display_value_from_item: (item) => item.language,
    });

    // type for a pill can be any string but it needs to be
    // defined while creating any pill.
    const item = {
        language: "JavaScript",
        type: "language",
    };

    let inserted_before;
    const expected_html = pill_html("JavaScript");

    $pill_input.before = ($elem) => {
        inserted_before = true;
        assert.equal($elem.html(), expected_html);
    };

    widget.appendValidatedData(item);
    assert.ok(!widget.is_pending());
    assert.ok(inserted_before);

    assert.deepEqual(widget.items(), [item]);
});

function set_up() {
    const items = {
        blue: {
            color_name: "BLUE",
            description: "color of the sky",
            type: "color",
        },

        red: {
            color_name: "RED",
            type: "color",
            description: "color of stop signs",
        },

        yellow: {
            color_name: "YELLOW",
            type: "color",
            description: "color of bananas",
        },
    };

    const $pill_input = $.create("pill_input");

    $pill_input[0] = {};
    $pill_input.length = 1;
    $pill_input.before = noop;

    const create_item_from_text = (text) => items[text];

    const $container = $.create("container");
    $container.set_find_results(".input", $pill_input);

    const config = {
        $container,
        create_item_from_text,
        get_text_from_item: (item) => item.color_name,
        get_display_value_from_item: (item) => item.color_name,
    };

    return {
        config,
        $pill_input,
        items,
        $container,
    };
}

run_test("copy from pill", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (data, html) => {
        assert.ok(["BLUE", "RED"].includes(data.display_value));
        $(html)[0] = `<pill-stub ${data.display_value}>`;
        $(html).length = 1;
        return html;
    });

    const info = set_up();
    const config = info.config;
    const $container = info.$container;

    const widget = input_pill.create(config);
    widget.appendValue("blue,red");

    const copy_handler = $container.get_on_handler("copy", ".pill");

    let copied_text;

    const $pill_stub = "<pill-stub RED>";

    const originalEvent = new ClipboardEvent();
    originalEvent.clipboardData = {
        setData(format, text) {
            assert.equal(format, "text/plain");
            copied_text = text;
        },
    };
    const e = {
        originalEvent,
        preventDefault: noop,
    };

    copy_handler.call($pill_stub, e);

    assert.equal(copied_text, "RED");
});

run_test("paste to input", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (_data, html) => html);

    const info = set_up();
    const config = info.config;
    const $container = info.$container;
    const items = info.items;

    const widget = input_pill.create(config);

    const paste_handler = $container.get_on_handler("paste", ".input");

    const paste_text = "blue,yellow";

    const originalEvent = new ClipboardEvent();
    originalEvent.clipboardData = {
        getData(format) {
            assert.equal(format, "text/plain");
            return paste_text;
        },
    };
    const e = {
        originalEvent,
        preventDefault: noop,
    };

    document.execCommand = (cmd, _, text) => {
        assert.equal(cmd, "insertText");
        $container.find(".input").text(text);
    };

    paste_handler(e);

    assert.deepEqual(widget.items(), [items.blue, items.yellow]);

    let entered = false;
    widget.createPillonPaste(() => {
        entered = true;
    });

    paste_handler(e);
    assert.ok(entered);
});

run_test("arrows on pills", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (_data, html) => html);

    const info = set_up();
    const config = info.config;
    const $container = info.$container;

    const widget = input_pill.create(config);
    widget.appendValue("blue,red");

    const key_handler = $container.get_on_handler("keydown", ".pill");

    function test_key(c) {
        key_handler({
            key: c,
        });
    }

    let prev_focused = false;
    let next_focused = false;

    const $pill_stub = {
        prev: () => ({
            trigger(type) {
                if (type === "focus") {
                    prev_focused = true;
                }
            },
        }),
        next: () => ({
            trigger(type) {
                if (type === "focus") {
                    next_focused = true;
                }
            },
        }),
    };

    $container.set_find_results(".pill:focus", $pill_stub);

    // We use the same stub to test both arrows, since we don't
    // actually cause any real state changes here.  We stub out
    // the only interaction, which is to move the focus.
    test_key("ArrowLeft");
    assert.ok(prev_focused);

    test_key("ArrowRight");
    assert.ok(next_focused);
});

run_test("left arrow on input", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (data, html) => {
        assert.equal(typeof data.display_value, "string");
        return html;
    });

    const info = set_up();
    const config = info.config;
    const $container = info.$container;

    const widget = input_pill.create(config);
    widget.appendValue("blue,red");

    const key_handler = $container.get_on_handler("keydown", ".input");

    let last_pill_focused = false;

    $container.set_find_results(".pill", {
        last: () => ({
            trigger(type) {
                if (type === "focus") {
                    last_pill_focused = true;
                }
            },
        }),
    });

    key_handler({
        key: "ArrowLeft",
    });

    assert.ok(last_pill_focused);
});

run_test("comma", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (data, html) => {
        assert.equal(typeof data.display_value, "string");
        return html;
    });

    const info = set_up();
    const config = info.config;
    const items = info.items;
    const $pill_input = info.$pill_input;
    const $container = info.$container;

    const widget = input_pill.create(config);
    widget.appendValue("blue,red");

    assert.deepEqual(widget.items(), [items.blue, items.red]);

    const key_handler = $container.get_on_handler("keydown", ".input");

    $pill_input.text(" yel");

    key_handler({
        key: ",",
        preventDefault: noop,
    });

    assert.deepEqual(widget.items(), [items.blue, items.red]);

    $pill_input.text(" yellow");

    key_handler({
        key: ",",
        preventDefault: noop,
    });

    assert.deepEqual(widget.items(), [items.blue, items.red, items.yellow]);
});

run_test("Enter key with text", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (data, html) => {
        assert.equal(typeof data.display_value, "string");
        return html;
    });

    const info = set_up();
    const config = info.config;
    const items = info.items;
    const $container = info.$container;

    const widget = input_pill.create(config);
    widget.appendValue("blue,red");

    assert.deepEqual(widget.items(), [items.blue, items.red]);

    const key_handler = $container.get_on_handler("keydown", ".input");

    key_handler.call(
        {
            textContent: " yellow ",
        },
        {
            key: "Enter",
            preventDefault: noop,
            stopPropagation: noop,
        },
    );

    assert.deepEqual(widget.items(), [items.blue, items.red, items.yellow]);
});

run_test("insert_remove", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (data, html) => {
        assert.equal(typeof data.display_value, "string");
        assert.ok(html.startsWith, "<div class='pill'");
        $(html).length = 1;
        $(html)[0] = `<pill-stub ${data.display_value}>`;
        return html;
    });

    const info = set_up();

    const config = info.config;
    const $pill_input = info.$pill_input;
    const items = info.items;
    const $container = info.$container;

    const inserted_html = [];
    $pill_input.before = ($elem) => {
        inserted_html.push($elem.html());
    };

    const widget = input_pill.create(config);

    let created;
    let removed;

    widget.onPillCreate(() => {
        created = true;
    });

    widget.onPillRemove(() => {
        removed = true;
    });

    widget.appendValue("blue,chartreuse,red,yellow,mauve");

    assert.ok(created);
    assert.ok(!removed);

    assert.deepEqual(inserted_html, [pill_html("BLUE"), pill_html("RED"), pill_html("YELLOW")]);

    assert.deepEqual(widget.items(), [items.blue, items.red, items.yellow]);

    assert.equal($pill_input.text(), "chartreuse, mauve");

    assert.equal(widget.is_pending(), true);
    widget.clear_text();
    assert.equal($pill_input.text(), "");
    assert.equal(widget.is_pending(), false);

    let color_removed;
    function set_colored_removed_func(color) {
        return () => {
            color_removed = color;
        };
    }

    let color_focused;
    function handle_event(color) {
        return (event) => {
            assert.equal(event, "focus");
            color_focused = color;
        };
    }

    const pills = widget._get_pills_for_testing();
    for (const pill of pills) {
        pill.$element.remove = set_colored_removed_func(pill.item.color_name);
        pill.$element.trigger = handle_event(pill.item.color_name);
    }

    let key_handler = $container.get_on_handler("keydown", ".input");

    key_handler.call(
        {
            textContent: "",
        },
        {
            key: "Backspace",
            preventDefault: noop,
        },
    );

    // The first backspace focuses the pill, the second removes it.
    assert.ok(!removed);
    assert.equal(color_focused, "YELLOW");
    const yellow_pill = pills.find((pill) => pill.item.color_name === "YELLOW");
    $container.set_find_results(".pill:focus", yellow_pill.$element);

    let prev_pill_focused = false;
    const $prev_pill_stub = $("<prev-stub>");
    $prev_pill_stub.trigger = (type) => {
        if (type === "focus") {
            prev_pill_focused = true;
        }
    };
    yellow_pill.$element.prev = () => $prev_pill_stub;
    yellow_pill.$element.next = () => $("<next-stub>");

    key_handler = $container.get_on_handler("keydown", ".pill");
    key_handler.call(
        {},
        {
            key: "Backspace",
            preventDefault: noop,
        },
    );
    assert.ok(removed);
    assert.equal(color_removed, "YELLOW");
    assert.ok(prev_pill_focused);
    color_removed = undefined;

    prev_pill_focused = false;
    assert.deepEqual(widget.items(), [items.blue, items.red]);

    const $focus_pill_stub = {
        prev: () => $prev_pill_stub,
        next: () => $("<next-stub>"),
        [0]: "<pill-stub RED>",
        length: 1,
    };

    $container.set_find_results(".pill:focus", $focus_pill_stub);

    const red_pill = pills.find((pill) => pill.item.color_name === "RED");
    // Disabled pill should not be removed.
    red_pill.disabled = true;

    key_handler = $container.get_on_handler("keydown", ".pill");
    key_handler({
        key: "Backspace",
        preventDefault: noop,
    });

    assert.equal(color_removed, undefined);
    assert.ok(prev_pill_focused);

    // We should be able to remove the pill after marking it as not
    // disabled.
    red_pill.disabled = false;
    prev_pill_focused = false;
    assert.deepEqual(widget.items(), [items.blue, items.red]);

    key_handler({
        key: "Backspace",
        preventDefault: noop,
    });
    assert.equal(color_removed, "RED");
    assert.ok(prev_pill_focused);
});

run_test("exit button on pill", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (data, html) => {
        assert.equal(typeof data.display_value, "string");
        assert.ok(html.startsWith, "<div class='pill'");
        $(html)[0] = `<pill-stub ${data.display_value}>`;
        $(html).length = 1;
        return html;
    });
    $(".narrow_to_compose_recipients").toggleClass = noop;

    const info = set_up();

    const config = info.config;
    const items = info.items;
    const $container = info.$container;

    const widget = input_pill.create(config);

    widget.appendValue("blue,red");

    const pills = widget._get_pills_for_testing();
    for (const pill of pills) {
        pill.$element.remove = noop;
    }

    const $curr_pill_stub = {
        [0]: "<pill-stub BLUE>",
        length: 1,
    };

    const exit_button_stub = {
        to_$: () => ({
            closest(sel) {
                assert.equal(sel, ".pill");
                return $curr_pill_stub;
            },
        }),
    };

    const e = {
        stopPropagation: noop,
    };
    const exit_click_handler = $container.get_on_handler("click", ".exit");

    exit_click_handler.call(exit_button_stub, e);

    assert.deepEqual(widget.items(), [items.red]);
});

run_test("misc things", () => {
    const info = set_up();

    const $container = info.$container;
    const $pill_input = info.$pill_input;
    input_pill.create(info.config);

    // animation
    const animation_end_handler = $container.get_on_handler("animationend", ".input");

    let shake_class_removed = false;

    const input_stub = {
        to_$: () => ({
            removeClass(cls) {
                assert.equal(cls, "shake");
                shake_class_removed = true;
            },
        }),
    };

    animation_end_handler.call(input_stub);
    assert.ok(shake_class_removed);

    // click on container
    const container_click_handler = $container.get_on_handler("click");

    const $stub = $.create("the-pill-container");
    $stub.set_find_results(".input", $pill_input);
    $stub.is = (sel) => {
        assert.equal(sel, ".pill-container");
        return true;
    };

    const this_ = {
        to_$: () => $stub,
    };

    container_click_handler.call(this_, {target: this_});
});

run_test("appendValue/clear", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (data, html) => {
        assert.equal(typeof data.display_value, "string");
        assert.ok(html.startsWith, "<div class='pill'");
        return html;
    });

    const $pill_input = $.create("pill_input");
    const $container = $.create("container");
    $container.set_find_results(".input", $pill_input);

    const config = {
        $container,
        create_item_from_text: (s) => ({type: "color", color_name: s}),
        get_text_from_item: /* istanbul ignore next */ (s) => s.color_name,
        get_display_value_from_item: (s) => s.color_name,
    };

    $pill_input.before = noop;
    $pill_input[0] = {};
    $pill_input.length = 1;

    const widget = input_pill.create(config);

    // First test some early-exit code.
    widget.appendValue("");
    assert.deepEqual(widget._get_pills_for_testing(), []);

    // Now set up real data.
    widget.appendValue("red,yellow,blue");

    const pills = widget._get_pills_for_testing();

    const removed_colors = [];
    for (const pill of pills) {
        pill.$element.remove = () => {
            removed_colors.push(pill.item.color_name);
        };
    }

    widget.clear();

    // Note that we remove colors in the reverse order that we inserted.
    assert.deepEqual(removed_colors, ["blue", "yellow", "red"]);
    assert.equal($pill_input[0].textContent, "");
});

run_test("getCurrentText", ({mock_template}) => {
    mock_template("input_pill.hbs", true, (data, html) => {
        assert.equal(typeof data.display_value, "string");
        return html;
    });

    const info = set_up();
    const config = info.config;
    const items = info.items;
    const $pill_input = info.$pill_input;
    const $container = info.$container;

    const widget = input_pill.create(config);
    widget.appendValue("blue,red");
    assert.deepEqual(widget.items(), [items.blue, items.red]);

    $pill_input.text("yellow");
    assert.equal(widget.getCurrentText(), "yellow");

    const key_handler = $container.get_on_handler("keydown", ".input");
    key_handler({
        key: " ",
        preventDefault: noop,
    });
    key_handler({
        key: ",",
        preventDefault: noop,
    });

    assert.deepEqual(widget.items(), [items.blue, items.red, items.yellow]);
});

run_test("onTextInputHook", () => {
    const info = set_up();
    const config = info.config;
    const widget = input_pill.create(config);
    const $container = info.$container;
    const $pill_input = info.$pill_input;

    let hookCalled = false;
    let currentText = "re";
    const onTextInputHook = () => {
        hookCalled = true;

        // Test that the hook always gets the correct updated text.
        assert.equal(widget.getCurrentText(), currentText);
    };

    widget.onTextInputHook(onTextInputHook);

    const input_handler = $container.get_on_handler("input", ".input");

    $pill_input.text(currentText);
    input_handler();

    currentText += "d";
    $pill_input.text(currentText);
    input_handler();

    assert.ok(hookCalled);
});
```

--------------------------------------------------------------------------------

---[FILE: internal_url.test.cjs]---
Location: zulip-main/web/tests/internal_url.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const internal_url = zrequire("internal_url");

run_test("test encodeHashComponent", () => {
    const decoded = "https://www.zulipexample.com";
    const encoded = "https.3A.2F.2Fwww.2Ezulipexample.2Ecom";
    const result = internal_url.encodeHashComponent(decoded);
    assert.equal(result, encoded);
});

run_test("test decodeHashComponent", () => {
    const decoded = "https://www.zulipexample.com";
    const encoded = "https.3A.2F.2Fwww.2Ezulipexample.2Ecom";
    const result = internal_url.decodeHashComponent(encoded);
    assert.equal(result, decoded);
});

run_test("test stream_id_to_slug", () => {
    const maybe_get_stream_name = () => "onetwo three";
    const result = internal_url.stream_id_to_slug(123, maybe_get_stream_name);
    assert.equal(result, "123-onetwo-three");
});

run_test("test stream_id_to_slug failed lookup", () => {
    const maybe_get_stream_name = () => undefined;
    const result = internal_url.stream_id_to_slug(123, maybe_get_stream_name);
    assert.equal(result, "123-unknown");
});

run_test("test encode_stream_id", () => {
    const maybe_get_stream_name = () => "stream (with brackets)";
    const result = internal_url.encode_stream_id(123, maybe_get_stream_name);
    assert.equal(result, "123-stream-.28with-brackets.29");
});

run_test("test by_stream_url", () => {
    const maybe_get_stream_name = () => "a test stream";
    const result = internal_url.by_stream_url(123, maybe_get_stream_name);
    assert.equal(result, "#narrow/channel/123-a-test-stream");
});

run_test("test by_channel_topic_list_url", () => {
    const maybe_get_stream_name = () => "a test stream";
    const result = internal_url.by_channel_topic_list_url(123, maybe_get_stream_name);
    assert.equal(result, "#topics/channel/123-a-test-stream");
});

run_test("test by_stream_topic_url", () => {
    const maybe_get_stream_name = () => "a test stream";
    // Test stream_topic_url is a traditional topic link when the
    // message_id to be encoded is undefined.
    let result = internal_url.by_stream_topic_url(123, "test topic", maybe_get_stream_name);
    assert.equal(result, "#narrow/channel/123-a-test-stream/topic/test.20topic");

    // Test stream_topic_url is a topic permaling when the
    // message_id to be encoded is not undefined.
    result = internal_url.by_stream_topic_url(123, "test topic", maybe_get_stream_name, 12);
    assert.equal(result, "#narrow/channel/123-a-test-stream/topic/test.20topic/with/12");
});
```

--------------------------------------------------------------------------------

---[FILE: keydown_util.test.cjs]---
Location: zulip-main/web/tests/keydown_util.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const keydown_util = zrequire("keydown_util");

run_test("test_early_returns", () => {
    const $stub = $.create("stub");
    const opts = {
        $elem: $stub,
        handlers: {
            /* istanbul ignore next */
            ArrowLeft() {
                throw new Error("do not dispatch this with alt key");
            },
        },
    };

    keydown_util.handle(opts);

    const e1 = {
        type: "keydown",
        key: "a", // not in keys
    };

    $stub.trigger(e1);

    const e2 = {
        type: "keydown",
        key: "Enter", // no handler
    };

    $stub.trigger(e2);

    const e3 = {
        type: "keydown",
        key: "ArrowLeft",
        altKey: true, // let browser handle
    };

    $stub.trigger(e3);
});

run_test("test_ime_enter_events", () => {
    // these events shouldn't be recognized as a return keypress.
    const event_1 = {
        key: "Enter",
        originalEvent: {
            isComposing: true,
        },
    };

    const event_2 = {
        key: "Random",
        originalEvent: {
            isComposing: false,
        },
    };
    assert.ok(!keydown_util.is_enter_event(event_1));
    assert.ok(!keydown_util.is_enter_event(event_2));

    // these are valid return keypress events.
    const event_3 = {
        key: "Enter",
        originalEvent: {
            isComposing: false,
        },
    };
    const event_4 = {
        key: "Enter",
        // Edgacase: if there is no originalEvent, JQuery didn't provide the object.
    };
    assert.ok(keydown_util.is_enter_event(event_3));
    assert.ok(keydown_util.is_enter_event(event_4));
});
```

--------------------------------------------------------------------------------

---[FILE: lazy_set.test.cjs]---
Location: zulip-main/web/tests/lazy_set.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

const {LazySet} = zrequire("lazy_set");

/*
    We mostly test LazySet indirectly.  This code
    may be short-lived, anyway, once we change
    how we download subscribers in page_params.
*/

run_test("map", () => {
    const ls = new LazySet([1, 2]);

    assert.deepEqual(
        ls.map((n) => n * 3),
        [3, 6],
    );
});

run_test("size", () => {
    const ls = new LazySet([1, 2]);
    assert.deepEqual(ls.size, 2);

    ls._make_set();
    assert.deepEqual(ls.size, 2);
});

run_test("conversions", () => {
    blueslip.expect("error", "not a number", 2);
    const ls = new LazySet([1, 2]);
    ls.add("3");
    assert.ok(ls.has("3"));
});
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_navigation_area.test.cjs]---
Location: zulip-main/web/tests/left_sidebar_navigation_area.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

mock_esm("../src/resize", {
    resize_stream_filters_container() {},
});

const {Filter} = zrequire("../src/filter");
const left_sidebar_navigation_area = zrequire("left_sidebar_navigation_area");

run_test("narrowing", ({override_rewire}) => {
    override_rewire(
        left_sidebar_navigation_area,
        "select_top_left_corner_item",
        (narrow_to_activate) => {
            const targets = [
                ".top_left_mentions",
                ".top_left_starred_messages",
                ".top_left_all_messages",
                ".top_left_recent_view",
                ".top_left_inbox",
            ];
            for (const target of targets) {
                $(target).removeClass("top-left-active-filter");
            }
            if (narrow_to_activate !== "") {
                $(narrow_to_activate).addClass("top-left-active-filter");
            }
        },
    );

    let filter = new Filter([{operator: "is", operand: "mentioned"}]);

    // activating narrow

    left_sidebar_navigation_area.handle_narrow_activated(filter);
    assert.ok($(".top_left_mentions").hasClass("top-left-active-filter"));

    filter = new Filter([{operator: "is", operand: "starred"}]);
    left_sidebar_navigation_area.handle_narrow_activated(filter);
    assert.ok($(".top_left_starred_messages").hasClass("top-left-active-filter"));

    filter = new Filter([{operator: "in", operand: "home"}]);
    left_sidebar_navigation_area.handle_narrow_activated(filter);
    assert.ok($(".top_left_all_messages").hasClass("top-left-active-filter"));

    // deactivating narrow

    left_sidebar_navigation_area.handle_narrow_activated(new Filter([]));

    assert.ok(!$(".top_left_all_messages").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_mentions").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_starred_messages").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_recent_view").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_inbox").hasClass("top-left-active-filter"));

    set_global("setTimeout", (f) => {
        f();
    });
    left_sidebar_navigation_area.highlight_recent_view();
    assert.ok(!$(".top_left_all_messages").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_mentions").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_starred_messages").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_inbox").hasClass("top-left-active-filter"));
    assert.ok($(".top_left_recent_view").hasClass("top-left-active-filter"));

    left_sidebar_navigation_area.handle_narrow_activated(new Filter([]));
    left_sidebar_navigation_area.highlight_inbox_view();
    assert.ok(!$(".top_left_all_messages").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_mentions").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_starred_messages").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_recent_view").hasClass("top-left-active-filter"));
    assert.ok($(".top_left_inbox").hasClass("top-left-active-filter"));

    left_sidebar_navigation_area.highlight_all_messages_view();
    assert.ok(!$(".top_left_mentions").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_starred_messages").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_recent_view").hasClass("top-left-active-filter"));
    assert.ok(!$(".top_left_inbox").hasClass("top-left-active-filter"));
    assert.ok($(".top_left_all_messages").hasClass("top-left-active-filter"));
});

run_test("update_count_in_dom", () => {
    function make_elem($elem, count_selector) {
        const $count = $(count_selector);
        $elem.set_find_results(".unread_count", $count);
        $count.set_parent($elem);

        return $elem;
    }

    const counts = {
        mentioned_message_count: 222,
        home_unread_messages: 333,
        stream_unread_messages: 666,
        stream_count: new Map(),
    };

    $(".selected-home-view").set_find_results(".sidebar-menu-icon", $("<menu-icon>"));

    make_elem($(".top_left_mentions"), "<mentioned-count>");

    make_elem($(".top_left_inbox"), "<home-count>");

    make_elem($(".selected-home-view"), "<home-count>");

    make_elem($(".top_left_condensed_unread_marker"), "<condensed-unread-count>");

    make_elem($(".top_left_starred_messages"), "<starred-count>");

    make_elem($(".top_left_scheduled_messages"), "<scheduled-count>");

    make_elem($(".top_left_reminders"), "<reminders-count>");

    make_elem($("#topics_header"), "<topics-count>");

    left_sidebar_navigation_area.update_dom_with_unread_counts(counts, false);
    left_sidebar_navigation_area.update_starred_count(444, false);
    // Calls left_sidebar_navigation_area.update_scheduled_messages_row
    left_sidebar_navigation_area.initialize();

    assert.equal($("<mentioned-count>").text(), "222");
    assert.equal($("<home-count>").text(), "333");
    assert.equal($("<condensed-unread-count>").text(), "333");
    assert.equal($("<starred-count>").text(), "444");
    assert.equal($("<scheduled-count>").text(), "");
    assert.equal($("<reminders-count>").text(), "");
    assert.equal($("<topics-count>").text(), "666");

    counts.mentioned_message_count = 0;

    left_sidebar_navigation_area.update_dom_with_unread_counts(counts, false);
    left_sidebar_navigation_area.update_starred_count(444, true);
    left_sidebar_navigation_area.update_scheduled_messages_row();
    left_sidebar_navigation_area.update_reminders_row();

    assert.ok(!$("<mentioned-count>").visible());
    assert.equal($("<mentioned-count>").text(), "");
    assert.equal($("<starred-count>").text(), "444");
    assert.ok(!$(".top_left_scheduled_messages").visible());
    assert.ok(!$(".top_left_reminders").visible());
});
```

--------------------------------------------------------------------------------

---[FILE: linkifiers.test.cjs]---
Location: zulip-main/web/tests/linkifiers.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

const linkifiers = zrequire("linkifiers");

linkifiers.initialize([]);

function get_linkifier_regexes() {
    return [...linkifiers.get_linkifier_map().keys()];
}

run_test("python_to_js_linkifier", () => {
    // The only way to reach python_to_js_linkifier is indirectly, hence the call
    // to update_linkifier_rules.
    linkifiers.update_linkifier_rules([
        {
            pattern: "/a(?im)a/g",
            url_template: "http://example1.example.com",
            id: 10,
        },
        {
            pattern: "/a(?L)a/g",
            url_template: "http://example2.example.com",
            id: 20,
        },
    ]);
    let actual_value = get_linkifier_regexes();
    let expected_value = [/\/aa\/g(?!\w)/gim, /\/aa\/g(?!\w)/g];
    assert.deepEqual(actual_value, expected_value);
    // Test case with multiple replacements.
    linkifiers.update_linkifier_rules([
        {
            pattern: "#cf(?P<contest>\\d+)(?P<problem>[A-Z][\\dA-Z]*)",
            url_template: "http://example3.example.com",
            id: 30,
        },
    ]);
    actual_value = get_linkifier_regexes();
    expected_value = [/#cf(\d+)([A-Z][\dA-Z]*)(?!\w)/g];
    assert.deepEqual(actual_value, expected_value);
    // Test incorrect syntax.
    blueslip.expect("error", "python_to_js_linkifier failure!");
    linkifiers.update_linkifier_rules([
        {
            pattern: "!@#@(!#&((!&(@#(",
            url_template: "http://example4.example.com",
            id: 40,
        },
    ]);
    actual_value = get_linkifier_regexes();
    expected_value = [];
    assert.deepEqual(actual_value, expected_value);
});
```

--------------------------------------------------------------------------------

---[FILE: list_cursor.test.cjs]---
Location: zulip-main/web/tests/list_cursor.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");
const $ = require("./lib/zjquery.cjs");

const {ListCursor} = zrequire("list_cursor");

function basic_conf({first_key, prev_key, next_key}) {
    const list = {
        scroll_container_selector: "whatever",
        find_li() {},
        first_key,
        prev_key,
        next_key,
    };

    const conf = {
        list,
        highlight_class: "highlight",
    };

    return conf;
}

run_test("misc errors", ({override}) => {
    const conf = basic_conf({
        first_key: () => undefined,
        prev_key: /* istanbul ignore next */ () => undefined,
        next_key: /* istanbul ignore next */ () => undefined,
    });

    const cursor = new ListCursor(conf);

    // Test that we just ignore empty
    // lists for unknown keys.
    override(conf.list, "find_li", ({key, force_render}) => {
        assert.equal(key, "nada");
        assert.equal(force_render, true);
        return [];
    });

    cursor.get_row("nada");

    blueslip.expect("error", "Caller is not checking keys for ListCursor.go_to");
    cursor.go_to(undefined);

    blueslip.expect("error", "Cannot highlight key for ListCursor");
    cursor.go_to("nada");

    cursor.prev();
    cursor.next();
});

run_test("single item list", ({override}) => {
    const valid_key = "42";

    const conf = basic_conf({
        first_key: /* istanbul ignore next */ () => valid_key,
        next_key: () => undefined,
        prev_key: () => undefined,
    });
    const cursor = new ListCursor(conf);

    const $li_stub = {
        length: 1,
        addClass() {},
    };

    override(conf.list, "find_li", () => $li_stub);
    override(cursor, "adjust_scroll", noop);

    cursor.set_is_highlight_visible(true);
    cursor.go_to(valid_key);

    // Test prev/next, which should just silently do nothing.
    cursor.prev();
    cursor.next();

    // The next line is also a noop designed to just give us test
    // coverage.
    cursor.go_to(valid_key);
});

run_test("multiple item list", ({override}) => {
    const conf = basic_conf({
        first_key: /* istanbul ignore next */ () => 1,
        next_key: (key) => (key < 3 ? key + 1 : undefined),
        prev_key: (key) => (key > 1 ? key - 1 : undefined),
    });
    const cursor = new ListCursor(conf);
    override(cursor, "adjust_scroll", noop);

    function li(key) {
        return $.create(`item-${key}`, {children: ["stub"]});
    }

    const list_items = {
        1: li(1),
        2: li(2),
        3: li(3),
    };

    override(conf.list, "find_li", ({key}) => list_items[key]);

    cursor.go_to(2);
    assert.equal(cursor.get_key(), 2);
    assert.ok(!list_items[1].hasClass("highlight"));
    // Selection is not highlighted until we want it to.
    assert.ok(!list_items[2].hasClass("highlight"));
    assert.ok(!list_items[3].hasClass("highlight"));

    // Current selection is not highlighted until user wants
    // to move the cursor.
    // Also, cursor doesn't move if the selection was not
    // previously highlighted.
    cursor.next();
    assert.equal(cursor.get_key(), 2);
    assert.ok(!list_items[1].hasClass("highlight"));
    assert.ok(list_items[2].hasClass("highlight"));
    assert.ok(!list_items[3].hasClass("highlight"));
    // Reset state
    cursor.set_is_highlight_visible(false);
    cursor.prev();
    assert.equal(cursor.get_key(), 2);
    assert.ok(!list_items[1].hasClass("highlight"));
    assert.ok(list_items[2].hasClass("highlight"));
    assert.ok(!list_items[3].hasClass("highlight"));

    cursor.next();
    cursor.next();
    cursor.next();

    assert.equal(cursor.get_key(), 3);
    assert.ok(!list_items[1].hasClass("highlight"));
    assert.ok(!list_items[2].hasClass("highlight"));
    assert.ok(list_items[3].hasClass("highlight"));

    cursor.prev();
    cursor.prev();
    cursor.prev();

    assert.equal(cursor.get_key(), 1);
    assert.ok(list_items[1].hasClass("highlight"));
    assert.ok(!list_items[2].hasClass("highlight"));
    assert.ok(!list_items[3].hasClass("highlight"));

    override(conf.list, "find_li", () => list_items[1]);
    cursor.redraw();
    assert.ok(list_items[1].hasClass("highlight"));
    assert.ok(!list_items[2].hasClass("highlight"));
    assert.ok(!list_items[3].hasClass("highlight"));

    cursor.clear();
    assert.equal(cursor.get_key(), undefined);
    cursor.redraw();
    assert.ok(!list_items[1].hasClass("highlight"));
});
```

--------------------------------------------------------------------------------

````
