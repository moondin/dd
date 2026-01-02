---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 829
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 829 of 1290)

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

---[FILE: upload.test.cjs]---
Location: zulip-main/web/tests/upload.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

class ClipboardEvent {
    constructor({clipboardData}) {
        this.clipboardData = clipboardData;
    }
}
set_global("ClipboardEvent", ClipboardEvent);

set_global("navigator", {
    userAgent: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
});

let uppy_stub;
mock_esm("@uppy/core", {
    Uppy: function Uppy(options) {
        return uppy_stub.call(this, options);
    },
});
mock_esm("@uppy/tus", {default: class Tus {}});

const compose_actions = mock_esm("../src/compose_actions");
const compose_reply = mock_esm("../src/compose_reply");
const compose_state = mock_esm("../src/compose_state");
const rows = mock_esm("../src/rows");

const compose_ui = zrequire("compose_ui");
const upload = zrequire("upload");
const message_lists = mock_esm("../src/message_lists");
const {set_realm} = zrequire("state_data");
const compose_validate = zrequire("compose_validate");

const realm = make_realm();
set_realm(realm);

message_lists.current = {
    id: "1",
};
function test(label, f) {
    run_test(label, (helpers) => {
        helpers.override(realm, "max_file_upload_size_mib", 25);
        return f(helpers);
    });
}

test("feature_check", ({override}) => {
    assert.ok(!upload.feature_check());

    override(window, "XMLHttpRequest", () => ({upload: true}));
    assert.ok(upload.feature_check());
});

test("config", () => {
    assert.equal(upload.compose_config.textarea(), $("textarea#compose-textarea"));
    assert.equal(
        upload.compose_config.upload_banner_message("id_1"),
        $("#compose_banners .upload_banner.file_id_1 .upload_msg"),
    );
    assert.equal(
        upload.compose_config.upload_banner_cancel_button("id_2"),
        $("#compose_banners .upload_banner.file_id_2 .upload_banner_cancel_button"),
    );
    assert.equal(
        upload.compose_config.upload_banner_hide_button("id_2"),
        $("#compose_banners .upload_banner.file_id_2 .main-view-banner-close-button"),
    );
    assert.equal(upload.compose_config.file_input_identifier(), "#compose input.file_input");
    assert.equal(upload.compose_config.source(), "compose-file-input");
    assert.equal(upload.compose_config.drag_drop_container(), $("#compose"));
    assert.equal(
        upload.compose_config.markdown_preview_hide_button(),
        $("#compose .undo_markdown_preview"),
    );

    assert.equal(
        upload.edit_config(1).textarea(),
        $(`#edit_form_${CSS.escape(1)} textarea.message_edit_content`),
    );

    $(`#edit_form_${CSS.escape(2)}`).set_find_results(
        ".message_edit_save",
        $(".message_edit_save"),
    );
    assert.equal(upload.edit_config(2).send_button(), $(".message_edit_save"));

    assert.equal(
        upload.edit_config(11).upload_banner_identifier("id_3"),
        `#edit_form_${CSS.escape(11)} .upload_banner.file_id_3`,
    );
    assert.equal(
        upload.edit_config(75).upload_banner("id_60"),
        $(`#edit_form_${CSS.escape(75)} .upload_banner.file_id_60`),
    );

    $(`#edit_form_${CSS.escape(2)} .upload_banner`).set_find_results(
        ".upload_banner_cancel_button",
        $(".upload_banner_cancel_button"),
    );
    assert.equal(
        upload.edit_config(2).upload_banner_cancel_button("id_34"),
        $(`#edit_form_${CSS.escape(2)} .upload_banner.file_id_34 .upload_banner_cancel_button`),
    );

    $(`#edit_form_${CSS.escape(2)} .upload_banner`).set_find_results(
        ".main-view-banner-close-button",
        $(".main-view-banner-close-button"),
    );
    assert.equal(
        upload.edit_config(2).upload_banner_hide_button("id_34"),
        $(`#edit_form_${CSS.escape(2)} .upload_banner.file_id_34 .main-view-banner-close-button`),
    );

    $(`#edit_form_${CSS.escape(22)} .upload_banner.file_id_234`).set_find_results(
        ".upload_msg",
        $(".upload_msg"),
    );
    assert.equal(
        upload.edit_config(22).upload_banner_message("id_234"),
        $(`#edit_form_${CSS.escape(22)} .upload_banner.file_id_234 .upload_msg`),
    );

    assert.equal(
        upload.edit_config(123).file_input_identifier(),
        `#edit_form_${CSS.escape(123)} input.file_input`,
    );
    assert.equal(upload.edit_config(123).source(), "message-edit-file-input");
    assert.equal(
        upload.edit_config(1).drag_drop_container(),
        $(`#message-row-1-${CSS.escape(1)} .message_edit_form`),
    );
    assert.equal(
        upload.edit_config(65).markdown_preview_hide_button(),
        $(`#edit_form_${CSS.escape(65)} .undo_markdown_preview`),
    );
});

test("show_error_message", ({mock_template}) => {
    $("#compose_banners .upload_banner").length = 0;

    let banner_shown = false;
    mock_template("compose_banner/upload_banner.hbs", false, (data) => {
        assert.equal(data.banner_type, "error");
        assert.equal(data.banner_text, "Error message");
        banner_shown = true;
        return "<banner-stub>";
    });

    upload.show_error_message(upload.compose_config, "Error message");
    assert.ok(!$("#compose-send-button").hasClass("disabled-message-send-controls"));
    assert.ok(banner_shown);

    mock_template("compose_banner/upload_banner.hbs", false, (data) => {
        assert.equal(data.banner_type, "error");
        assert.equal(data.banner_text, "translated: An unknown error occurred.");
        banner_shown = true;
        return "<banner-stub>";
    });
    upload.show_error_message(upload.compose_config);
});

test("upload_files", async ({mock_template, override, override_rewire}) => {
    $("#compose_banners .upload_banner").remove = noop;
    $("#compose_banners .upload_banner").length = 0;

    let files = [
        {
            name: "budapest.png",
            type: "image/png",
        },
    ];
    let uppy_add_file_called = false;
    let remove_file_called = false;
    const uppy = {
        addFile(params) {
            uppy_add_file_called = true;
            assert.equal(params.source, "compose-file-input");
            assert.equal(params.name, "budapest.png");
            assert.equal(params.type, "image/png");
            assert.equal(params.data, files[0]);
            return "id_123";
        },
        removeFile() {
            remove_file_called = true;
        },
    };
    let hide_upload_banner_called = false;
    override_rewire(upload, "hide_upload_banner", (_uppy, config) => {
        hide_upload_banner_called = true;
        assert.equal(config.mode, "compose");
    });
    const config = upload.compose_config;
    $("#compose-send-button").removeClass("disabled-message-send-controls");
    await upload.upload_files(uppy, config, []);
    assert.ok(!$("#compose-send-button").hasClass("disabled-message-send-controls"));

    let banner_shown = false;
    mock_template("compose_banner/upload_banner.hbs", false, (data) => {
        assert.equal(data.banner_type, "error");
        assert.equal(
            data.banner_text,
            "translated: File and image uploads have been disabled for this organization.",
        );
        banner_shown = true;
        return "<banner-stub>";
    });
    override(realm, "max_file_upload_size_mib", 0);
    $("#compose_banners .upload_banner .upload_msg").text("");
    await upload.upload_files(uppy, config, files);
    assert.ok(banner_shown);

    override(realm, "max_file_upload_size_mib", 25);
    let compose_ui_insert_syntax_and_focus_called = false;
    override_rewire(compose_ui, "insert_syntax_and_focus", () => {
        compose_ui_insert_syntax_and_focus_called = true;
    });
    let compose_ui_autosize_textarea_called = false;
    override_rewire(compose_ui, "autosize_textarea", () => {
        compose_ui_autosize_textarea_called = true;
    });
    let markdown_preview_hide_button_clicked = false;
    $("#compose .undo_markdown_preview").on("click", () => {
        markdown_preview_hide_button_clicked = true;
    });
    $("#compose-send-button").removeClass("disabled-message-send-controls");
    $("#compose_banners .upload_banner").remove();
    $("#compose .undo_markdown_preview").css = (property) => {
        assert.equal(property, "display");
        return "flex";
    };

    banner_shown = false;
    mock_template("compose_banner/upload_banner.hbs", false, () => {
        banner_shown = true;
        return "<banner-stub>";
    });
    override_rewire(compose_validate, "validate", () => false);
    override_rewire(compose_validate, "update_posting_policy_banner_post_validation", noop);
    await upload.upload_files(uppy, config, files);
    assert.ok($("#compose-send-button").hasClass("disabled-message-send-controls"));
    assert.ok(banner_shown);
    assert.ok(compose_ui_insert_syntax_and_focus_called);
    assert.ok(compose_ui_autosize_textarea_called);
    assert.ok(markdown_preview_hide_button_clicked);
    assert.ok(uppy_add_file_called);

    banner_shown = false;
    files = [
        {
            name: "budapest.png",
            type: "image/png",
        },
        {
            name: "prague.png",
            type: "image/png",
        },
    ];
    let add_file_counter = 0;
    uppy.addFile = (file) => {
        add_file_counter += 1;
        if (file.name === "budapest.png") {
            throw new Error("some error");
        }
        return `id_${add_file_counter}`;
    };
    await upload.upload_files(uppy, config, files);
    assert.ok(banner_shown);
    assert.equal(add_file_counter, 2);

    hide_upload_banner_called = false;
    let compose_ui_replace_syntax_called = false;

    override_rewire(compose_ui, "replace_syntax", (old_syntax, new_syntax, $textarea) => {
        compose_ui_replace_syntax_called = true;
        assert.equal(old_syntax, "[translated: Uploading budapest.png…]()");
        assert.equal(new_syntax, "");
        assert.equal($textarea, $("textarea#compose-textarea"));
    });
    $("#compose_banners .upload_banner.file_id_123 .upload_banner_cancel_button").trigger("click");
    assert.ok(remove_file_called);
    assert.ok(hide_upload_banner_called);
    assert.ok(compose_ui_autosize_textarea_called);
    assert.ok(compose_ui_replace_syntax_called);
    hide_upload_banner_called = false;
    compose_ui_replace_syntax_called = false;
    remove_file_called = false;
    $("textarea#compose-textarea").val("user modified text");

    $("#compose_banners .upload_banner.file_id_123 .upload_banner_cancel_button").trigger("click");
    assert.ok(remove_file_called);
    assert.ok(hide_upload_banner_called);
    assert.ok(compose_ui_autosize_textarea_called);
    assert.ok(compose_ui_replace_syntax_called);
    assert.equal($("textarea#compose-textarea").val(), "user modified text");
});

test("uppy_config", () => {
    let uppy_stub_called = false;
    let uppy_used_tusupload = false;

    uppy_stub = function (config) {
        uppy_stub_called = true;
        assert.equal(config.debug, false);
        assert.equal(config.autoProceed, true);
        assert.equal(config.restrictions.maxFileSize, 25 * 1024 * 1024);
        assert.equal(Object.keys(config.locale.strings).length, 2);
        assert.ok("exceedsSize" in config.locale.strings);

        return {
            use(func, params) {
                const func_name = func.name;
                if (func_name === "Tus") {
                    uppy_used_tusupload = true;
                    assert.equal(params.endpoint, "/api/v1/tus/");
                    assert.equal(params.limit, 5);
                } else {
                    /* istanbul ignore next */
                    assert.fail(`Missing tests for ${func_name}`);
                }
            },
            on() {},
        };
    };
    upload.setup_upload(upload.compose_config);

    assert.equal(uppy_stub_called, true);
    assert.equal(uppy_used_tusupload, true);
});

test("file_input", ({override_rewire}) => {
    upload.setup_upload(upload.compose_config);

    const change_handler = $("#compose input.file_input").get_on_handler("change");
    const files = ["file1", "file2"];
    const event = {
        target: {
            files,
            value: "C:\\fakepath\\portland.png",
        },
    };
    let upload_files_called = false;
    override_rewire(upload, "upload_files", (_uppy, config, files) => {
        assert.equal(config.mode, "compose");
        assert.equal(files, files);
        upload_files_called = true;
    });
    change_handler(event);
    assert.ok(upload_files_called);
});

test("file_drop", ({override, override_rewire}) => {
    override(compose_state, "composing", () => false);
    upload.setup_upload(upload.compose_config);

    let prevent_default_counter = 0;
    const drag_event = {
        preventDefault() {
            prevent_default_counter += 1;
        },
    };
    const dragover_handler = $("#compose").get_on_handler("dragover");
    dragover_handler(drag_event);
    assert.equal(prevent_default_counter, 1);

    const dragenter_handler = $("#compose").get_on_handler("dragenter");
    dragenter_handler(drag_event);
    assert.equal(prevent_default_counter, 2);

    let stop_propagation_counter = 0;
    const files = ["file1", "file2"];
    const drop_event = {
        preventDefault() {
            prevent_default_counter += 1;
        },
        stopPropagation() {
            stop_propagation_counter += 1;
        },
        originalEvent: {
            dataTransfer: {
                files,
            },
        },
    };
    const drop_handler = $("#compose").get_on_handler("drop");
    let upload_files_called = false;
    override_rewire(upload, "upload_files", () => {
        upload_files_called = true;
    });
    let compose_actions_start_called = false;
    override(compose_reply, "respond_to_message", () => {
        compose_actions_start_called = true;
    });
    drop_handler(drop_event);
    assert.ok(compose_actions_start_called);
    assert.equal(prevent_default_counter, 3);
    assert.equal(stop_propagation_counter, 1);
    assert.equal(upload_files_called, true);
});

test("copy_paste", ({override, override_rewire}) => {
    override(compose_state, "composing", () => false);
    upload.setup_upload(upload.compose_config);

    const paste_handler = $("#compose").get_on_handler("paste");
    let get_as_file_called = false;
    let event = {
        originalEvent: new ClipboardEvent({
            clipboardData: {
                items: [
                    {
                        kind: "file",
                        getAsFile() {
                            get_as_file_called = true;
                        },
                    },
                    {
                        kind: "notfile",
                        getAsFile: () => null,
                    },
                ],
            },
        }),
        preventDefault() {},
    };
    let upload_files_called = false;
    override_rewire(upload, "upload_files", () => {
        upload_files_called = true;
    });
    let compose_actions_start_called = false;
    override(compose_reply, "respond_to_message", () => {
        compose_actions_start_called = true;
    });

    paste_handler(event);
    assert.ok(get_as_file_called);
    assert.ok(upload_files_called);
    assert.ok(compose_actions_start_called);
    upload_files_called = false;
    event = {
        originalEvent: new ClipboardEvent({}),
    };
    paste_handler(event);
    assert.equal(upload_files_called, false);
});

test("uppy_events", ({override_rewire, mock_template}) => {
    $("#compose_banners .upload_banner").length = 0;
    override_rewire(compose_ui, "smart_insert_inline", noop);
    override_rewire(compose_validate, "validate_and_update_send_button_status", noop);

    const callbacks = {};
    let state = {};
    const file = {
        name: "copenhagen.png",
        meta: {
            name: "copenhagen.png",
        },
    };
    let uppy_set_file_state_called = false;
    let uppy_set_file_meta_called = false;

    uppy_stub = function () {
        return {
            setMeta() {},
            use() {},
            on(event_name, callback) {
                callbacks[event_name] = callback;
            },
            removeFile() {},
            getFiles() {
                return [];
            },
            // This is currently only called in
            // on_upload_success_callback, we return the modified name
            // keeping in mind only that case. Although this isn't
            // ideal, it seems better than the alternative of creating
            // a file store in the tests.
            getFile() {
                return {
                    ...file,
                    name: "modified-name-copenhagen.png",
                    meta: {
                        ...file.meta,
                        zulip_url: "/user_uploads/4/cb/rue1c-MlMUjDAUdkRrEM4BTJ/copenhagen.png",
                    },
                };
            },
            getState: () => ({
                info: [
                    {
                        type: state.type,
                        details: state.details,
                        message: state.message,
                    },
                ],
            }),
            setFileState(_file_id, {name}) {
                uppy_set_file_state_called = true;
                assert.equal(name, "modified-name-copenhagen.png");
            },
            setFileMeta(_file_id, {zulip_url}) {
                uppy_set_file_meta_called = true;
                assert.equal(
                    zulip_url,
                    "/user_uploads/4/cb/rue1c-MlMUjDAUdkRrEM4BTJ/copenhagen.png",
                );
            },
        };
    };
    upload.setup_upload(upload.compose_config);
    assert.equal(Object.keys(callbacks).length, 6);

    const on_upload_success_callback = callbacks["upload-success"];
    let response = {
        status: 200,
        body: {
            xhr: {
                responseText: JSON.stringify({
                    url: "/user_uploads/4/cb/rue1c-MlMUjDAUdkRrEM4BTJ/copenhagen.png",
                    filename: "modified-name-copenhagen.png",
                }),
            },
        },
    };

    let compose_ui_replace_syntax_called = false;
    override_rewire(compose_ui, "replace_syntax", (old_syntax, new_syntax, $textarea) => {
        compose_ui_replace_syntax_called = true;
        assert.equal(old_syntax, "[translated: Uploading copenhagen.png…]()");
        assert.equal(
            new_syntax,
            "[modified-name-copenhagen.png](/user_uploads/4/cb/rue1c-MlMUjDAUdkRrEM4BTJ/copenhagen.png)",
        );
        assert.equal($textarea, $("textarea#compose-textarea"));
    });
    let compose_ui_autosize_textarea_called = false;
    override_rewire(compose_ui, "autosize_textarea", () => {
        compose_ui_autosize_textarea_called = true;
    });
    on_upload_success_callback(file, response);

    assert.ok(compose_ui_replace_syntax_called);
    assert.ok(compose_ui_autosize_textarea_called);
    assert.ok(uppy_set_file_state_called);
    assert.ok(uppy_set_file_meta_called);

    mock_template("compose_banner/upload_banner.hbs", false, (data) => {
        assert.equal(data.banner_type, "error");
        assert.equal(data.banner_text, "Some error message");
        return "<banner-stub>";
    });
    state = {
        type: "error",
        details: "Some error",
        message: "Some error message",
    };
    const on_info_visible_callback = callbacks["info-visible"];
    $("#compose_banners .upload_banner .upload_msg").text("");
    compose_ui_replace_syntax_called = false;
    const on_restriction_failed_callback = callbacks["restriction-failed"];
    on_info_visible_callback();
    override_rewire(compose_ui, "replace_syntax", (old_syntax, new_syntax, $textarea) => {
        compose_ui_replace_syntax_called = true;
        assert.equal(old_syntax, "[translated: Uploading copenhagen.png…]()");
        assert.equal(new_syntax, "");
        assert.equal($textarea, $("textarea#compose-textarea"));
    });
    on_restriction_failed_callback(file, null, null);
    assert.ok(compose_ui_replace_syntax_called);
    compose_ui_replace_syntax_called = false;
    $("textarea#compose-textarea").val("user modified text");
    on_restriction_failed_callback(file, null, null);
    assert.ok(compose_ui_replace_syntax_called);
    assert.equal($("textarea#compose-textarea").val(), "user modified text");

    state = {
        type: "error",
        message: "No Internet connection",
    };
    on_info_visible_callback();

    state = {
        type: "error",
        details: "Upload Error",
    };
    on_info_visible_callback();

    let hide_upload_banner_called = false;
    override_rewire(upload, "hide_upload_banner", (_uppy, config) => {
        hide_upload_banner_called = true;
        assert.equal(config.mode, "compose");
    });

    const on_upload_error_callback = callbacks["upload-error"];
    $("#compose_banners .upload_banner .upload_msg").text("");
    compose_ui_replace_syntax_called = false;
    response = {
        body: {
            msg: "Response message",
        },
    };
    mock_template("compose_banner/upload_banner.hbs", false, (data) => {
        assert.equal(data.banner_type, "error");
        assert.equal(data.banner_text, "Response message");
        return "<banner-stub>";
    });
    on_upload_error_callback(file, null, response);
    assert.ok(compose_ui_replace_syntax_called);

    compose_ui_replace_syntax_called = false;
    mock_template("compose_banner/upload_banner.hbs", false, (data) => {
        assert.equal(data.banner_type, "error");
        assert.equal(data.banner_text, "translated: An unknown error occurred.");
        return "<banner-stub>";
    });
    on_upload_error_callback(file, null, undefined);
    assert.ok(compose_ui_replace_syntax_called);

    $("#compose_banners .upload_banner .upload_msg").text("");
    assert.ok(hide_upload_banner_called);
    $("textarea#compose-textarea").val("user modified text");
    on_upload_error_callback(file, null);
    assert.ok(compose_ui_replace_syntax_called);
    assert.equal($("textarea#compose-textarea").val(), "user modified text");
});

test("main_file_drop_compose_mode", ({override, override_rewire}) => {
    uppy_stub = function () {
        return {
            setMeta() {},
            use() {},
            cancelAll() {},
            on() {},
            getFiles() {},
            removeFile() {},
        };
    };
    upload.initialize();

    let prevent_default_counter = 0;
    const drag_event = {
        preventDefault() {
            prevent_default_counter += 1;
        },
    };

    // dragover event test
    const dragover_handler = $(".app, #navbar-fixed-container").get_on_handler("dragover");
    dragover_handler(drag_event);
    assert.equal(prevent_default_counter, 1);

    // dragenter event test
    const dragenter_handler = $(".app, #navbar-fixed-container").get_on_handler("dragenter");
    dragenter_handler(drag_event);
    assert.equal(prevent_default_counter, 2);

    const files = ["file1", "file2"];
    const drop_event = {
        target: "target",
        preventDefault() {
            prevent_default_counter += 1;
        },
        originalEvent: {
            dataTransfer: {
                files,
            },
        },
    };

    $(".message_edit_form form").last = () => ({length: 0});

    const drop_handler = $(".app, #navbar-fixed-container").get_on_handler("drop");

    // Test drop on compose box
    let upload_files_called = false;
    override_rewire(upload, "upload_files", () => {
        upload_files_called = true;
    });
    override(compose_state, "composing", () => true);
    drop_handler(drop_event);
    assert.equal(upload_files_called, true);
    assert.equal(prevent_default_counter, 3);

    // Test reply to message if no edit and compose box open
    upload_files_called = false;
    override(compose_state, "composing", () => false);
    const msg = {
        type: "stream",
        stream: "Denmark",
        topic: "python",
        sender_full_name: "Bob Roberts",
        sender_id: 40,
    };
    let compose_actions_start_called = false;
    let compose_actions_respond_to_message_called = false;
    override(message_lists, "current", {
        selected_message() {
            return msg;
        },
    });
    compose_actions.start = () => {
        compose_actions_start_called = true;
    };
    compose_reply.respond_to_message = () => {
        compose_actions_respond_to_message_called = true;
    };
    drop_handler(drop_event);
    assert.equal(upload_files_called, true);
    assert.equal(compose_actions_start_called, false);
    assert.equal(compose_actions_respond_to_message_called, true);

    // Test drop on Recent Conversations view
    compose_actions_respond_to_message_called = false;
    override(message_lists, "current", {
        selected_message() {
            return undefined;
        },
    });
    upload_files_called = false;
    drop_handler(drop_event);
    assert.equal(upload_files_called, true);
    assert.equal(compose_actions_start_called, true);
    assert.equal(compose_actions_respond_to_message_called, false);
});

test("main_file_drop_edit_mode", ({override, override_rewire}) => {
    uppy_stub = function () {
        return {
            setMeta() {},
            use() {},
            cancelAll() {},
            on() {},
            getFiles() {},
            removeFile() {},
        };
    };

    upload.setup_upload(upload.edit_config(40));
    upload.initialize();
    override(compose_state, "composing", () => false);
    let prevent_default_counter = 0;
    const drag_event = {
        preventDefault() {
            prevent_default_counter += 1;
        },
    };
    const $drag_drop_container = $(`#message-row-1-${CSS.escape(40)} .message_edit_form`);

    // Dragover event test
    const dragover_handler = $(".app, #navbar-fixed-container").get_on_handler("dragover");
    dragover_handler(drag_event);
    assert.equal(prevent_default_counter, 1);
    // Dragenter event test
    const dragenter_handler = $(".app, #navbar-fixed-container").get_on_handler("dragenter");
    dragenter_handler(drag_event);
    assert.equal(prevent_default_counter, 2);

    const files = ["file1", "file2"];
    const drop_event = {
        target: "target",
        preventDefault() {
            prevent_default_counter += 1;
        },
        originalEvent: {
            dataTransfer: {
                files,
            },
        },
    };
    const drop_handler = $(".app, #navbar-fixed-container").get_on_handler("drop");
    let upload_files_called = false;
    let dropped_row_id = -1;
    override_rewire(upload, "upload_files", (_, config) => {
        dropped_row_id = config.row;
        upload_files_called = true;
    });
    $(".message_edit_form form").last = () => ({length: 1, [0]: "stub"});
    override(rows, "get_message_id", () => 40);

    // Edit box which registered the event handler no longer exists.
    $drag_drop_container.closest = (element) => {
        assert.equal(element, "html");
        return {length: 0};
    };

    drop_handler(drop_event);
    assert.equal(upload_files_called, false);

    $drag_drop_container.closest = (element) => {
        assert.equal(element, "html");
        return {length: 1};
    };

    // Drag and dropped in one of the edit boxes. The event would be taken care of by
    // drag_drop_container event handlers.

    override(rows, "get_message_id", () => 40);
    // Edit box open
    $(".message_edit_form form").last = () => ({length: 1, [0]: "stub"});
    drop_handler(drop_event);
    assert.equal(upload_files_called, true);
    assert.equal(dropped_row_id, 40);
});
```

--------------------------------------------------------------------------------

---[FILE: user_events.test.cjs]---
Location: zulip-main/web/tests/user_events.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const blueslip = require("./lib/zblueslip.cjs");

const message_live_update = mock_esm("../src/message_live_update");
const navbar_alerts = mock_esm("../src/navbar_alerts");
const settings_account = mock_esm("../src/settings_account", {
    maybe_update_deactivate_account_button() {},
    update_email() {},
    update_full_name() {},
    update_account_settings_display() {},
    update_role_text() {},
    set_user_own_role_dropdown_value() {},
    add_or_remove_owner_from_role_dropdown() {},
    update_user_own_role_dropdown_state() {},
});
const settings_bots = mock_esm("../src/settings_bots");
mock_esm("../src/settings_users", {
    update_user_data() {},
    update_view_on_deactivate() {},
    update_view_on_reactivate() {},
});
mock_esm("../src/user_profile", {
    update_profile_modal_ui() {},
    update_user_custom_profile_fields() {},
});

const buddy_list = mock_esm("../src/buddy_list", {
    BuddyList: class {
        insert_or_move = noop;
    },
});

const buddy_data = new buddy_list.BuddyList();
buddy_list.buddy_list = buddy_data;

mock_esm("../src/activity_ui", {
    redraw() {},
});
mock_esm("../src/compose_state", {
    update_email() {},
});
mock_esm("../src/pm_list", {
    update_private_messages() {},
});
mock_esm("../src/settings", {
    update_lock_icon_in_sidebar() {},
});
mock_esm("../src/settings_linkifiers", {
    maybe_disable_widgets() {},
});
mock_esm("../src/settings_org", {
    maybe_disable_widgets() {},
    enable_or_disable_group_permission_settings() {},
});
mock_esm("../src/settings_profile_fields", {
    maybe_disable_widgets() {},
});
mock_esm("../src/settings_realm_user_settings_defaults", {
    maybe_disable_widgets() {},
});
mock_esm("../src/settings_streams", {
    maybe_disable_widgets() {},
});

const people = zrequire("people");
const settings_config = zrequire("settings_config");
const {set_current_user, set_realm} = zrequire("state_data");
const user_events = zrequire("user_events");

const current_user = {};
set_current_user(current_user);
set_realm(make_realm());

const me = {
    email: "me@example.com",
    user_id: 30,
    full_name: "Me Myself",
    is_admin: true,
    role: settings_config.user_role_values.member.code,
};

function initialize() {
    people.init();
    people.add_active_user(me);
    people.initialize_current_user(me.user_id);
}

initialize();

run_test("updates", ({override}) => {
    let person;

    const isaac = {
        email: "isaac@example.com",
        delivery_email: null,
        user_id: 32,
        full_name: "Isaac Newton",
    };
    people.add_active_user(isaac);

    override(navbar_alerts, "maybe_toggle_empty_required_profile_fields_banner", noop);
    user_events.update_person({
        user_id: isaac.user_id,
        role: settings_config.user_role_values.guest.code,
    });
    person = people.get_by_email(isaac.email);
    assert.ok(person.is_guest);
    assert.equal(person.role, settings_config.user_role_values.guest.code);
    user_events.update_person({
        user_id: isaac.user_id,
        role: settings_config.user_role_values.member.code,
    });
    person = people.get_by_email(isaac.email);
    assert.ok(!person.is_guest);
    assert.equal(person.role, settings_config.user_role_values.member.code);

    user_events.update_person({
        user_id: isaac.user_id,
        role: settings_config.user_role_values.moderator.code,
    });
    person = people.get_by_email(isaac.email);
    assert.equal(person.is_moderator, true);
    assert.equal(person.role, settings_config.user_role_values.moderator.code);

    user_events.update_person({
        user_id: isaac.user_id,
        role: settings_config.user_role_values.admin.code,
    });
    person = people.get_by_email(isaac.email);
    assert.equal(person.full_name, "Isaac Newton");
    assert.equal(person.is_moderator, true);
    assert.equal(person.is_admin, true);
    assert.equal(person.role, settings_config.user_role_values.admin.code);

    user_events.update_person({
        user_id: isaac.user_id,
        role: settings_config.user_role_values.owner.code,
    });
    assert.equal(person.is_admin, true);
    assert.equal(person.is_owner, true);
    assert.equal(person.role, settings_config.user_role_values.owner.code);

    person = people.get_by_email(me.email);
    assert.equal(person.role, settings_config.user_role_values.member.code);

    person = people.get_by_email(me.email);
    assert.equal(person.user_id, me.user_id);
    assert.equal(person.role, settings_config.user_role_values.member.code);

    person = people.get_by_email(isaac.email);
    assert.equal(person.user_id, isaac.user_id);
    assert.equal(person.role, settings_config.user_role_values.owner.code);

    let user_id;
    let full_name;
    message_live_update.update_user_full_name = (user_id_arg, full_name_arg) => {
        user_id = user_id_arg;
        full_name = full_name_arg;
    };

    user_events.update_person({user_id: isaac.user_id, full_name: "Sir Isaac"});
    person = people.get_by_email(isaac.email);
    assert.equal(person.full_name, "Sir Isaac");
    assert.equal(person.is_admin, true);
    assert.equal(user_id, isaac.user_id);
    assert.equal(full_name, "Sir Isaac");

    user_events.update_person({
        user_id: me.user_id,
        role: settings_config.user_role_values.member.code,
    });
    assert.ok(!current_user.is_admin);

    user_events.update_person({user_id: me.user_id, full_name: "Me V2"});
    assert.equal(people.my_full_name(), "Me V2");
    assert.equal(user_id, me.user_id);
    assert.equal(full_name, "Me V2");

    user_events.update_person({user_id: isaac.user_id, new_email: "newton@example.com"});
    person = people.get_by_user_id(isaac.user_id);
    assert.equal(person.email, "newton@example.com");
    assert.equal(person.full_name, "Sir Isaac");

    user_events.update_person({user_id: me.user_id, new_email: "meforu@example.com"});
    person = people.get_by_user_id(me.user_id);
    assert.equal(person.email, "meforu@example.com");
    assert.equal(person.full_name, "Me V2");

    let avatar_url;
    message_live_update.update_avatar = (user_id_arg, avatar_url_arg) => {
        user_id = user_id_arg;
        avatar_url = avatar_url_arg;
    };

    user_events.update_person({user_id: isaac.user_id, full_name: "Sir Isaac"});
    person = people.get_by_email(isaac.email);
    assert.equal(person.full_name, "Sir Isaac");
    assert.equal(person.is_admin, true);
    assert.equal(user_id, isaac.user_id);
    assert.equal(full_name, "Sir Isaac");

    person = people.get_by_email(isaac.email);
    assert.equal(person.delivery_email, null);
    user_events.update_person({
        user_id: isaac.user_id,
        delivery_email: "isaac-delivery@example.com",
    });
    person = people.get_by_email(isaac.email);
    assert.equal(person.delivery_email, "isaac-delivery@example.com");

    user_events.update_person({user_id: isaac.user_id, delivery_email: null});
    person = people.get_by_email(isaac.email);
    assert.equal(person.delivery_email, null);

    user_events.update_person({user_id: isaac.user_id, avatar_url: "http://gravatar.com/123456"});
    person = people.get_by_email(isaac.email);
    assert.equal(person.full_name, "Sir Isaac");
    assert.equal(user_id, isaac.user_id);
    assert.equal(person.avatar_url, avatar_url);

    user_events.update_person({user_id: me.user_id, avatar_url: "http://gravatar.com/789456"});
    person = people.get_by_email(me.email);
    assert.equal(person.full_name, "Me V2");
    assert.equal(user_id, me.user_id);
    assert.equal(person.avatar_url, avatar_url);

    user_events.update_person({user_id: me.user_id, timezone: "UTC"});
    person = people.get_by_email(me.email);
    assert.ok(person.timezone);

    blueslip.expect("error", "Got update_person event for unexpected user");
    blueslip.expect("error", "Unknown user_id in maybe_get_user_by_id");
    assert.ok(!user_events.update_person({user_id: 29, full_name: "Sir Isaac Newton"}));

    me.profile_data = {};
    user_events.update_person({
        user_id: me.user_id,
        custom_profile_field: {id: 3, value: "Value", rendered_value: "<p>Value</p>"},
    });
    person = people.get_by_email(me.email);
    assert.equal(person.profile_data[3].value, "Value");
    assert.equal(person.profile_data[3].rendered_value, "<p>Value</p>");

    let updated = false;
    settings_account.update_email = (email) => {
        assert.equal(email, "you@example.org");
        updated = true;
    };

    let confirm_banner_hidden = false;
    settings_account.hide_confirm_email_banner = () => {
        confirm_banner_hidden = true;
    };

    user_events.update_person({user_id: me.user_id, delivery_email: "you@example.org"});
    assert.ok(updated);
    assert.ok(confirm_banner_hidden);

    const test_bot = {
        email: "test-bot@example.com",
        user_id: 35,
        full_name: "Test Bot",
        is_bot: true,
        bot_owner_id: isaac.id,
    };
    people.add_active_user(test_bot);

    user_events.update_person({user_id: test_bot.user_id, bot_owner_id: me.user_id});
    person = people.get_by_email(test_bot.email);
    assert.equal(person.bot_owner_id, me.user_id);

    buddy_list.BuddyList.insert_or_move = noop;
    user_events.update_person({user_id: isaac.user_id, is_active: false});
    assert.ok(!people.is_person_active(isaac.user_id));

    user_events.update_person({user_id: isaac.user_id, is_active: true});
    assert.ok(people.is_person_active(isaac.user_id));

    let bot_data_updated = false;
    settings_bots.update_bot_data = (user_id) => {
        assert.equal(user_id, test_bot.user_id);
        bot_data_updated = true;
    };
    user_events.update_person({user_id: test_bot.user_id, is_active: false});
    assert.equal(bot_data_updated, true);

    bot_data_updated = false;
    user_events.update_person({user_id: test_bot.user_id, is_active: true});
    assert.ok(bot_data_updated);
});
```

--------------------------------------------------------------------------------

````
