---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 833
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 833 of 1290)

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

---[FILE: zblueslip.test.cjs]---
Location: zulip-main/web/tests/zblueslip.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {run_test} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

/*

This test module actually tests our test code, particularly zblueslip, and
it is intended to demonstrate how to use zblueslip (as well as, of course,
verify that it works as advertised).

What is zblueslip?

    The zblueslip test module behaves like blueslip at a very surface level,
    and it allows you to test code that uses actual blueslip and add some
    custom validation for checking that only particular errors and warnings are
    thrown by our test modules.

    The test runner automatically replaces `blueslip` with an instance
    of a zblueslip object.

The code we are testing lives here:

    https://github.com/zulip/zulip/blob/main/web/tests/lib/zblueslip.cjs

Read the following contents for an overview of how zblueslip works. Also take a
look at `people_errors.test.cjs` for actual usage of this module.
*/

run_test("basics", () => {
    // Let's create a sample piece of code to test:
    function throw_an_error() {
        blueslip.error("world");
    }

    // Since the error 'world' is not being expected, blueslip will
    // throw an error.
    assert.throws(throw_an_error);
    // zblueslip logs all the calls made to it, and they can be used in asserts like:

    // Now, let's add our error to the list of expected errors.
    blueslip.expect("error", "world", 2);
    // This time, blueslip will just log the error, which is
    // being verified by the assert call on the length of the log.
    // We can also check for which specific error was logged, but since
    // our sample space is just 1 expected error, we are sure that
    // only that error could have been logged, and others would raise
    // an error, aborting the test.
    throw_an_error();
    // The following check is redundant; blueslip.reset() already asserts that
    // we got the expected number of errors.
    assert.equal(blueslip.get_test_logs("error").length, 2);

    // Let's clear the array of valid errors as well as the log. Now, all errors
    // should be thrown directly by blueslip.
    blueslip.reset();
    assert.throws(throw_an_error);
    // This call to blueslip.reset() would complain.
    assert.throws(() => {
        blueslip.reset();
    });

    // Let's repeat the above procedure with warnings. Unlike errors,
    // warnings shouldn't stop the code execution, and thus, the
    // behaviour is slightly different.

    function throw_a_warning() {
        blueslip.warn("world");
    }

    assert.throws(throw_a_warning);
    // Again, we do not expect this particular warning so blueslip.reset should complain.
    assert.throws(() => {
        blueslip.reset();
    });

    // Let's reset blueslip regardless of errors. This is only for demonstration
    // purposes here; do not reset blueslip like this in actual tests.
    blueslip.reset(true);

    // Now, let's add our warning to the list of expected warnings.
    // This time, we shouldn't throw an error. However, to confirm that we
    // indeed had logged a warning, we can check the length of the warning logs
    blueslip.expect("warn", "world");
    throw_a_warning();
    blueslip.reset();

    // However, we detect when we have more or less of the expected errors/warnings.
    blueslip.expect("warn", "world");
    assert.throws(() => {
        blueslip.reset();
    });
    // Again, forcefully reset blueslip.
    blueslip.reset(true);
});
```

--------------------------------------------------------------------------------

---[FILE: zjquery.test.cjs]---
Location: zulip-main/web/tests/zjquery.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {run_test} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

/*

This test module actually tests our test code, particularly zjquery, and
it is intended to demonstrate how to use zjquery (as well as, of course, verify
that it works as advertised). This test module is a good place to learn how to
stub out functions from jQuery.

What is zjquery?

    The zjquery test module behaves like jQuery at a very surface level, and it
    allows you to test code that uses actual jQuery without pulling in all the
    complexity of jQuery.  It also allows you to mostly simulate DOM for the
    purposes of unit testing, so that your tests focus on component interactions
    that aren't super tightly coupled to building the DOM.  The tests also run
    faster! In order to keep zjquery light, it only has stubs for the most commonly
    used functions of jQuery. This means that it is possible that you may need to
    stub out additional functions manually in the relevant test module.

The code we are testing lives here:

    https://github.com/zulip/zulip/blob/main/web/tests/lib/zjquery.cjs

*/

run_test("basics", () => {
    // Let's create a sample piece of code to test:

    function show_my_form() {
        $("#my-form").show();
    }

    // Before we call show_my_form, we can assert that my-form is hidden:
    assert.ok(!$("#my-form").visible());

    // Then calling show_my_form() should make it visible.
    show_my_form();
    assert.ok($("#my-form").visible());

    // Next, look at how several functions correctly simulate setting
    // and getting for you.
    const $widget = $("#my-widget");

    $widget.attr("data-employee-id", 42);
    assert.equal($widget.attr("data-employee-id"), 42);
    assert.equal($widget.data("employee-id"), 42);

    $widget.data("department-id", 77);
    assert.equal($widget.attr("data-department-id"), 77);
    assert.equal($widget.data("department-id"), 77);

    $widget.data("department-name", "hr");
    assert.equal($widget.attr("data-department-name"), "hr");
    assert.equal($widget.data("department-name"), "hr");

    $widget.html("<b>hello</b>"); // eslint-disable-line no-jquery/no-parse-html-literal
    assert.equal($widget.html(), "<b>hello</b>");

    $widget.prop("title", "My widget");
    assert.equal($widget.prop("title"), "My widget");

    $widget.val("42");
    assert.equal($widget.val(), "42");
});

run_test("finding_related_objects", () => {
    // Let's say you have a function like the following:
    function update_message_emoji(emoji_src) {
        $("#my-message").find(".emoji").attr("src", emoji_src);
    }

    // This would explode:
    // update_message_emoji('foo.png');

    // The error would be:
    // Error: Cannot find .emoji in #my-message

    // But you can set up your tests to simulate DOM relationships.
    //
    // We will use set_find_results(), which is a special zjquery helper.
    const $emoji = $("<emoji-stub>");
    $("#my-message").set_find_results(".emoji", $emoji);

    // And then calling the function produces the desired effect:
    update_message_emoji("foo.png");
    assert.equal($emoji.attr("src"), "foo.png");

    // Sometimes you want to deliberately test paths that do not find an
    // element. You can pass 'false' as the result for those cases.
    $emoji.set_find_results(".random", false);
    assert.equal($emoji.find(".random").length, 0);
    /*
    An important thing to understand is that zjquery doesn't truly
    simulate DOM.  The way you make relationships work in zjquery
    is that you explicitly set up what your functions want to return.

    Here is another example.
    */

    const $my_parents = $("#folder1,#folder4");
    const $elem = $("#folder555");

    $elem.set_parents_result(".folder", $my_parents);
    $elem.parents(".folder").addClass("active");
    assert.ok($my_parents.hasClass("active"));
});

run_test("clicks", () => {
    // We can support basic handlers like click and keydown.

    const state = {};

    function set_up_click_handlers() {
        $("#widget1").on("click", () => {
            state.clicked = true;
        });

        $(".some-class").on("keydown", () => {
            state.keydown = true;
        });
    }

    // Setting up the click handlers doesn't change state right away.
    set_up_click_handlers();
    assert.ok(!state.clicked);
    assert.ok(!state.keydown);

    // But we can simulate clicks.
    $("#widget1").trigger("click");
    assert.equal(state.clicked, true);

    // and keydown
    $(".some-class").trigger("keydown");
    assert.equal(state.keydown, true);
});

run_test("events", () => {
    // Zulip's codebase uses jQuery's event API heavily with anonymous
    // functions that are hard for naive test code to cover.  zjquery
    // will come to our rescue.

    let value;

    function initialize_handler() {
        $("#my-parent").on("click", ".button-red", (e) => {
            value = "red"; // just a dummy side effect
            e.stopPropagation();
        });

        $("#my-parent").on("click", ".button-blue", (e) => {
            value = "blue";
            e.stopPropagation();
        });
    }

    // Calling initialize_handler() doesn't immediately do much of interest.
    initialize_handler();
    assert.equal(value, undefined);

    // We want to call the inner function, so first let's get it using the
    // get_on_handler() helper from zjquery.
    const red_handler_func = $("#my-parent").get_on_handler("click", ".button-red");

    // Set up a stub event so that stopPropagation doesn't explode on us.
    const stub_event = {
        stopPropagation() {},
    };

    // Now call the handler.
    red_handler_func(stub_event);

    // And verify it did what it was supposed to do.
    assert.equal(value, "red");

    // Test we can have multiple click handlers in the parent.
    const blue_handler_func = $("#my-parent").get_on_handler("click", ".button-blue");
    blue_handler_func(stub_event);
    assert.equal(value, "blue");
});

run_test("create", () => {
    // You can create jQuery objects that aren't tied to any particular
    // selector, and which just have a name.

    const $obj1 = $.create("the table holding employees");
    const $obj2 = $.create("the collection of rows in the table");

    $obj1.show();
    assert.ok($obj1.visible());

    $obj2.addClass(".striped");
    assert.ok($obj2.hasClass(".striped"));
});
```

--------------------------------------------------------------------------------

---[FILE: buddy_list.cjs]---
Location: zulip-main/web/tests/lib/buddy_list.cjs

```text
"use strict";

const {noop} = require("./test.cjs");
const $ = require("./zjquery.cjs");

let users_matching_view = [];
exports.buddy_list_add_user_matching_view = (user_id, $stub) => {
    if ($stub.attr) {
        $stub.attr("data-user-id", user_id);
    }
    $stub.length = 1;
    users_matching_view.push(user_id);
    const sel = `li.user_sidebar_entry[data-user-id='${CSS.escape(user_id)}']`;
    $("#buddy_list_wrapper").set_find_results(sel, $stub);
};

let other_users = [];
exports.buddy_list_add_other_user = (user_id, $stub) => {
    if ($stub.attr) {
        $stub.attr("data-user-id", user_id);
    }
    $stub.length = 1;
    other_users.push(user_id);
    const sel = `li.user_sidebar_entry[data-user-id='${CSS.escape(user_id)}']`;
    $("#buddy_list_wrapper").set_find_results(sel, $stub);
};

exports.override_user_matches_narrow_using_loaded_data = (user_id) =>
    users_matching_view.includes(user_id);

exports.clear_buddy_list = (buddy_list) => {
    buddy_list.populate({
        all_user_ids: [],
    });
    users_matching_view = [];
    other_users = [];
};

exports.stub_buddy_list_elements = () => {
    // Set to an empty list since we're not testing CSS.
    $("#buddy-list-users-matching-view").children = () => [];
    $("#buddy-list-users-matching-view .empty-list-message").length = 0;
    $("#buddy-list-other-users .empty-list-message").length = 0;
    $("#buddy-list-other-users-container .view-all-users-link").length = 0;
    $("#buddy-list-users-matching-view-container .view-all-subscribers-link").empty = noop;
    $("#buddy-list-other-users-container .view-all-users-link").empty = noop;
    $(`#buddy-list-users-matching-view .empty-list-message`).remove = noop;
    $(`#buddy-list-other-users .empty-list-message`).remove = noop;
    $(`#buddy-list-participants .empty-list-message`).remove = noop;
};
```

--------------------------------------------------------------------------------

---[FILE: compose_banner.cjs]---
Location: zulip-main/web/tests/lib/compose_banner.cjs

```text
"use strict";

const compose_banner = require("../../src/compose_banner.ts");

const {noop} = require("./test.cjs");
const $ = require("./zjquery.cjs");

exports.mock_banners = () => {
    // zjquery doesn't support `remove`, which is used when clearing the compose box.
    // TODO: improve how we test this so that we don't have to mock things like this.
    for (const classname of Object.values(compose_banner.CLASSNAMES)) {
        $(
            `#compose_banners .${classname
                .split(" ")
                .map((classname) => CSS.escape(classname))
                .join(".")}`,
        ).remove = noop;
    }
    $("#compose_banners .warning").remove = noop;
    $("#compose_banners .error").remove = noop;
    $("#compose_banners .upload_banner").remove = noop;

    const $stub = $.create("stub_to_remove");
    const $cb = $("#compose_banners");

    $stub.remove = noop;
    $stub.length = 0;

    $cb.closest = () => [];
    $cb.set_find_results(".no_post_permissions", $stub);
    $cb.set_find_results(".message_too_long", $stub);
    $cb.set_find_results(".wildcards_not_allowed", $stub);
    $cb.set_find_results(".wildcard_warning", $stub);
    $cb.set_find_results(".topic_missing", $stub);
    $cb.set_find_results(".missing_stream", $stub);
    $cb.set_find_results(".deactivated_user", $stub);
    $cb.set_find_results(".missing_private_message_recipient", $stub);
    $cb.set_find_results(".subscription_error", $stub);
    $cb.set_find_results(".generic_compose_error", $stub);
};
```

--------------------------------------------------------------------------------

---[FILE: compose_helpers.cjs]---
Location: zulip-main/web/tests/lib/compose_helpers.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {noop} = require("./test.cjs");
const $ = require("./zjquery.cjs");

class FakeComposeBox {
    constructor() {
        this.$send_message_form = $("#send_message_form");
        this.$content_textarea = $("textarea#compose-textarea");
        this.$preview_message_area = $("#compose .preview_message_area");

        // Simulate DOM relationships
        this.$send_message_form.set_find_results(".message-textarea", this.$content_textarea);

        this.$send_message_form.set_find_results(
            ".message-limit-indicator",
            $(".message-limit-indicator"),
        );

        const $message_row_stub = $.create("message_row_stub");
        this.$content_textarea.closest = (selector) => {
            assert.equal(selector, ".message_row");
            $message_row_stub.length = 0;
            return $message_row_stub;
        };

        this.reset();
    }

    reset() {
        $(".message-limit-indicator").html("");
        $(".message-limit-indicator").text("");

        $("#compose_banners .user_not_subscribed").length = 0;

        this.$content_textarea.toggleClass = noop;
        this.$content_textarea.set_height(50);
        this.$content_textarea.val("default message");
        this.$content_textarea.trigger("blur");

        this.$preview_message_area.css = noop;
        $(".compose-submit-button .loader").show();
    }

    show_message_preview() {
        this.$preview_message_area.show();
        $("#compose .undo_markdown_preview").show();
        $("#compose .markdown_preview").hide();
        $("#compose").addClass("preview_mode");
    }

    hide_message_preview() {
        this.$preview_message_area.hide();
        $("#compose .markdown_preview").show();
        $("#compose .undo_markdown_preview").hide();
        $("#compose").removeClass("preview_mode");
    }

    textarea_val() {
        return this.$content_textarea.val();
    }

    preview_content_html() {
        return $("#compose .preview_content").html();
    }

    compose_spinner_selector() {
        return ".compose-submit-button .loader";
    }

    markdown_spinner_selector() {
        return "#compose .markdown_preview_spinner";
    }

    set_topic_val(topic_name) {
        $("input#stream_message_recipient_topic").val(topic_name);
    }

    set_textarea_val(val) {
        this.$content_textarea.val(val);
    }

    blur_textarea() {
        this.$content_textarea.trigger("blur");
    }

    show_submit_button_spinner() {
        $(".compose-submit-button .loader").show();
    }

    set_textarea_toggle_class_function(f) {
        this.$content_textarea.toggleClass = f;
    }

    is_recipient_not_subscribed_banner_visible() {
        return $("#compose_banners .recipient_not_subscribed").visible();
    }

    is_textarea_focused() {
        return this.$content_textarea.is_focused();
    }

    is_submit_button_spinner_visible() {
        return $(this.compose_spinner_selector()).visible();
    }

    trigger_submit_handler_on_compose_form(event) {
        $("#compose form").get_on_handler("submit")(event);
    }

    click_on_markdown_preview_icon(event) {
        $("#compose").get_on_handler("click", ".markdown_preview")(event);
    }

    click_on_undo_markdown_preview_icon(event) {
        $("#compose").get_on_handler("click", ".undo_markdown_preview")(event);
    }

    click_on_upload_attachment_icon(event) {
        $("#compose").get_on_handler("click", ".compose_upload_file")(event);
    }

    set_click_handler_for_upload_file_input_element(f) {
        $("#compose .file_input").on("click", f);
    }

    assert_preview_mode_is_off() {
        assert.ok(!this.$preview_message_area.visible());
        assert.ok(!$("#compose .undo_markdown_preview").visible());
        assert.ok($("#compose .markdown_preview").visible());
        assert.ok(!$("#compose").hasClass("preview_mode"));
    }

    assert_preview_mode_is_on() {
        assert.ok(this.$preview_message_area.visible());
        assert.ok(!$("#compose .markdown_preview").visible());
        assert.ok($("#compose .undo_markdown_preview").visible());
        assert.ok($("#compose").hasClass("preview_mode"));
    }

    assert_message_size_is_over_the_limit(desired_html) {
        // Indicator should show red colored text
        assert.equal($(".message-limit-indicator").html(), desired_html);

        assert.ok(this.$content_textarea.hasClass("textarea-over-limit"));
        assert.ok($(".message-limit-indicator").hasClass("textarea-over-limit"));
        assert.ok(!$("#compose-send-button").hasClass("disabled-message-send-controls"));
    }

    assert_message_size_is_under_the_limit(desired_html) {
        // Work around the quirk that our validation code
        // arbitrarily switches between html() and text(),
        // and zjquery doesn't unify text and html.
        if (desired_html) {
            assert.equal($(".message-limit-indicator").html(), desired_html);
        } else {
            assert.equal($(".message-limit-indicator").text(), "");
        }

        assert.ok(!this.$content_textarea.hasClass("textarea-over-limit"));
        assert.ok(!$(".message-limit-indicator").hasClass("textarea-over-limit"));
        assert.ok(!$("#compose-send-button").hasClass("disabled-message-send-controls"));
    }
}

module.exports = {FakeComposeBox};
```

--------------------------------------------------------------------------------

````
