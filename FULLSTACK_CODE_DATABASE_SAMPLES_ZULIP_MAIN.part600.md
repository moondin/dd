---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 600
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 600 of 1290)

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

---[FILE: compose_recipient.ts]---
Location: zulip-main/web/src/compose_recipient.ts

```typescript
/* Compose box module responsible for the message's recipient */

import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_inline_decorated_channel_name from "../templates/inline_decorated_channel_name.hbs";

import * as compose_banner from "./compose_banner.ts";
import * as compose_fade from "./compose_fade.ts";
import * as compose_pm_pill from "./compose_pm_pill.ts";
import * as compose_state from "./compose_state.ts";
import * as compose_ui from "./compose_ui.ts";
import type {ComposeTriggeredOptions} from "./compose_ui.ts";
import * as compose_validate from "./compose_validate.ts";
import * as drafts from "./drafts.ts";
import * as dropdown_widget from "./dropdown_widget.ts";
import type {DropdownWidget, Option} from "./dropdown_widget.ts";
import {$t} from "./i18n.ts";
import * as narrow_state from "./narrow_state.ts";
import {realm} from "./state_data.ts";
import * as stream_color from "./stream_color.ts";
import * as stream_data from "./stream_data.ts";
import * as ui_util from "./ui_util.ts";
import * as user_groups from "./user_groups.ts";
import * as util from "./util.ts";

type MessageType = "stream" | "private";

let compose_select_recipient_dropdown_widget: DropdownWidget;

function composing_to_current_topic_narrow(): boolean {
    // If the narrow state's stream ID or topic is undefined, then
    // the user cannot be composing to a current topic narrow. Note
    // that both lists of channel topics and channel feeds have a
    // stream_id, but not a topic.
    if (narrow_state.stream_id() === undefined || narrow_state.topic() === undefined) {
        return false;
    }
    return (
        compose_state.stream_id() === narrow_state.stream_id() &&
        util.lower_same(compose_state.topic(), narrow_state.topic() ?? "")
    );
}

function composing_to_current_private_message_narrow(): boolean {
    const compose_state_recipient = new Set(compose_state.private_message_recipient_ids());
    const narrow_state_recipient = narrow_state.pm_ids_set();
    if (narrow_state_recipient.size === 0) {
        return false;
    }
    return _.isEqual(narrow_state_recipient, compose_state_recipient);
}

export let update_recipient_row_attention_level = (): void => {
    // We need to adjust the privacy-icon colors in the low-attention state
    const message_type = compose_state.get_message_type();
    if (message_type === "stream") {
        const stream_id = compose_state.stream_id();
        const channel_picker_icon_selector =
            "#compose_select_recipient_widget .channel-privacy-type-icon";

        stream_color.adjust_stream_privacy_icon_colors(stream_id, channel_picker_icon_selector);
    }
    // If there is any text that hasn't yet been transformed into a pill,
    // we should consider that the user is not composing to the current
    // DM narrow -- even though that input is ignored when sending a DM.
    // The point here is to avoid a state where we have that input hanging
    // around on a low-attention recipient row, which can also happen when
    // the DM-recipient typeahead is open.
    const has_unpilled_input = $("#private_message_recipient").text().length > 0;
    // We also want to watch out for cases where the DM isn't valid,
    // as when trying to message deactivated users.
    const is_valid_dm = compose_validate.validate_private_message(false);

    // We're piggy-backing here, in a roundabout way, on
    // compose_ui.set_focus(). Any time the topic or DM recipient
    // row is focused, that puts users outside the low-attention
    // recipient-row state--including the `c` hotkey or the
    // Start new conversation button being clicked. But that
    // logic is handled via the event handlers in compose_setup.ts
    // that call set_high_attention_recipient_row().
    if (
        (composing_to_current_topic_narrow() ||
            (composing_to_current_private_message_narrow() &&
                !has_unpilled_input &&
                is_valid_dm)) &&
        compose_state.has_full_recipient()
    ) {
        $("#compose-recipient").toggleClass("low-attention-recipient-row", true);
    } else {
        $("#compose-recipient").toggleClass("low-attention-recipient-row", false);
    }
};

export function rewire_update_recipient_row_attention_level(
    value: typeof update_recipient_row_attention_level,
): void {
    update_recipient_row_attention_level = value;
}

export function set_high_attention_recipient_row(): void {
    $("#compose-recipient").removeClass("low-attention-recipient-row");
}

export let update_narrow_to_recipient_visibility = (): void => {
    const message_type = compose_state.get_message_type();
    if (message_type === "stream") {
        const stream_exists = Boolean(compose_state.stream_id());

        if (
            stream_exists &&
            !composing_to_current_topic_narrow() &&
            compose_state.has_full_recipient()
        ) {
            $(".conversation-arrow").toggleClass("narrow_to_compose_recipients", true);
            return;
        }
    } else if (message_type === "private") {
        const recipients = compose_state.private_message_recipient_ids();
        if (
            recipients.length > 0 &&
            !composing_to_current_private_message_narrow() &&
            compose_state.has_full_recipient()
        ) {
            $(".conversation-arrow").toggleClass("narrow_to_compose_recipients", true);
            return;
        }
    }
    $(".conversation-arrow").toggleClass("narrow_to_compose_recipients", false);
};

export function rewire_update_narrow_to_recipient_visibility(
    value: typeof update_narrow_to_recipient_visibility,
): void {
    update_narrow_to_recipient_visibility = value;
}

function update_fade(): void {
    if (!compose_state.composing()) {
        return;
    }

    const msg_type = compose_state.get_message_type();

    // It's possible that the new topic is not a resolved topic
    // so we clear the older warning.
    compose_validate.clear_topic_resolved_warning();

    compose_validate.warn_if_topic_resolved(true);
    compose_fade.set_focused_recipient(msg_type);
    compose_fade.update_all();
}

export function update_on_recipient_change(): void {
    update_fade();
    update_narrow_to_recipient_visibility();
    compose_validate.warn_if_guest_in_dm_recipient();
    drafts.update_compose_draft_count();
    compose_validate.validate_and_update_send_button_status();

    // Clear the topic moved banner when the recipient
    // is changed or compose box is closed.
    compose_validate.clear_topic_moved_info();
}

function switch_message_type(message_type: MessageType): void {
    $("#compose-content .alert").hide();

    compose_state.set_message_type(message_type);

    const opts = {
        message_type,
        trigger: "switch_message_type",
        stream_id: compose_state.stream_id()!,
        topic: compose_state.topic(),
        private_message_recipient_ids: compose_state.private_message_recipient_ids(),
    };
    update_compose_for_message_type(opts);
    update_compose_area_placeholder_text();
    compose_ui.set_focus(opts);
}

function update_recipient_label(stream_id?: number): void {
    const stream = stream_id !== undefined ? stream_data.get_sub_by_id(stream_id) : undefined;
    if (stream === undefined) {
        const select_channel_label = $t({defaultMessage: "Select a channel"});
        $("#compose_select_recipient_widget .dropdown_widget_value").html(
            `<span class="select-channel-label">${select_channel_label}</span>`,
        );
    } else {
        $("#compose_select_recipient_widget .dropdown_widget_value").html(
            render_inline_decorated_channel_name({stream, show_colored_icon: true}),
        );
    }
}

export function update_compose_for_message_type(opts: ComposeTriggeredOptions): void {
    if (opts.message_type === "stream") {
        $("#compose-direct-recipient").hide();
        $("#compose_recipient_box").show();
        $("#stream_toggle").addClass("active");
        $("#private_message_toggle").removeClass("active");
        $("#compose-recipient").removeClass("compose-recipient-direct-selected");
        update_recipient_label(opts.stream_id);
    } else {
        $("#compose-direct-recipient").show();
        $("#compose_recipient_box").hide();
        $("#stream_toggle").removeClass("active");
        $("#private_message_toggle").addClass("active");
        $("#compose-recipient").addClass("compose-recipient-direct-selected");
        // TODO: When "Direct message" is selected, we show "DM" on the dropdown
        // button. It would be nice if the dropdown supported a way to attach
        // the "DM" button display string so we wouldn't have to manually change
        // it here.
        const direct_message_label = $t({defaultMessage: "DM"});
        $("#compose_select_recipient_widget .dropdown_widget_value").html(
            `<i class="zulip-icon zulip-icon-users channel-privacy-type-icon"></i>
            <span class="decorated-dm-label">${direct_message_label}</span>`,
        );
    }
    compose_banner.clear_errors();
    compose_banner.clear_warnings();
    compose_banner.clear_uploads();
    update_recipient_row_attention_level();
}

export let on_compose_select_recipient_update = (): void => {
    const prev_message_type = compose_state.get_message_type();

    let curr_message_type: MessageType = "stream";
    if (compose_state.selected_recipient_id === compose_state.DIRECT_MESSAGE_ID) {
        curr_message_type = "private";
    }

    if (prev_message_type !== curr_message_type) {
        switch_message_type(curr_message_type);
    }

    if (curr_message_type === "stream") {
        // Update stream name in the recipient box.
        const stream_id = compose_state.stream_id();
        update_recipient_label(stream_id);
    }

    update_on_recipient_change();
};

export function rewire_on_compose_select_recipient_update(
    value: typeof on_compose_select_recipient_update,
): void {
    on_compose_select_recipient_update = value;
}

export function possibly_update_stream_name_in_compose(stream_id: number): void {
    if (compose_state.selected_recipient_id === stream_id) {
        on_compose_select_recipient_update();
    }
}

function item_click_callback(event: JQuery.ClickEvent, dropdown: tippy.Instance): void {
    const recipient_id_str = $(event.currentTarget).attr("data-unique-id");
    assert(recipient_id_str !== undefined);
    let recipient_id: string | number = recipient_id_str;
    if (recipient_id !== compose_state.DIRECT_MESSAGE_ID) {
        recipient_id = Number.parseInt(recipient_id, 10);
    }
    compose_state.set_selected_recipient_id(recipient_id);
    compose_state.set_recipient_edited_manually(true);
    // Enable or disable topic input based on `topics_policy`.
    update_topic_displayed_text(compose_state.topic());
    on_compose_select_recipient_update();
    compose_select_recipient_dropdown_widget.item_clicked = true;
    dropdown.hide();
    event.preventDefault();
    event.stopPropagation();
}

function get_options_for_recipient_widget(): Option[] {
    const options: Option[] = stream_data.get_options_for_dropdown_widget();

    const direct_messages_option = {
        is_direct_message: true,
        unique_id: compose_state.DIRECT_MESSAGE_ID,
        name: $t({defaultMessage: "Direct message"}),
    };

    if (!user_groups.is_setting_group_empty(realm.realm_direct_message_permission_group)) {
        options.unshift(direct_messages_option);
    } else {
        options.push(direct_messages_option);
    }
    return options;
}

export function toggle_compose_recipient_dropdown(): void {
    $("#compose_select_recipient_widget").trigger("click");
}

function focus_compose_recipient(): void {
    $("#compose_select_recipient_widget_wrapper").trigger("focus");
}

function on_show_callback(): void {
    $("#compose_select_recipient_widget").addClass("widget-open");
}

// NOTE: Since tippy triggers this on `mousedown` it is always triggered before say a `click` on `textarea`.
function on_hidden_callback(): void {
    $("#compose_select_recipient_widget").removeClass("widget-open");
    compose_state.set_is_processing_forward_message(false);
    compose_validate.warn_if_topic_resolved(false);
    if (!compose_select_recipient_dropdown_widget.item_clicked) {
        // If the dropdown was NOT closed due to selecting an item,
        // don't do anything.
        return;
    }
    if (compose_state.get_message_type() === "stream") {
        // Always move focus to the topic input even if it's not empty,
        // since it's likely the user will want to update the topic
        // after updating the stream.
        ui_util.place_caret_at_end(util.the($("input#stream_message_recipient_topic")));
    } else {
        if (compose_state.private_message_recipient_ids().length === 0) {
            $("#private_message_recipient").trigger("focus").trigger("select");
        } else {
            $("textarea#compose-textarea").trigger("focus");
        }
    }
    compose_select_recipient_dropdown_widget.item_clicked = false;
}

export function handle_middle_pane_transition(): void {
    if (compose_state.composing()) {
        update_narrow_to_recipient_visibility();
        update_recipient_row_attention_level();
    }
}

export function initialize(): void {
    compose_select_recipient_dropdown_widget = new dropdown_widget.DropdownWidget({
        widget_name: "compose_select_recipient",
        get_options: get_options_for_recipient_widget,
        item_click_callback,
        $events_container: $("body"),
        on_exit_with_escape_callback: focus_compose_recipient,
        // We want to focus on topic box if dropdown was closed via selecting an item.
        focus_target_on_hidden: false,
        on_show_callback,
        on_hidden_callback,
        dropdown_input_visible_selector: "#compose_select_recipient_widget_wrapper",
        prefer_top_start_placement: true,
        tippy_props: {
            offset: [-10, 5],
        },
        tab_moves_focus_to_target() {
            if (compose_state.get_message_type() === "stream") {
                return "#stream_message_recipient_topic";
            }
            return "#private_message_recipient";
        },
    });
    compose_select_recipient_dropdown_widget.setup();

    // changes for the stream dropdown are handled in on_compose_select_recipient_update
    $("#stream_message_recipient_topic,#private_message_recipient").on("input change", () => {
        // To make sure the checks in update_on_recipient_change() are correct,
        // we update manual editing first.
        compose_state.set_recipient_edited_manually(true);
        update_on_recipient_change();
    });

    $("#private_message_recipient").on("input", restore_placeholder_in_firefox_for_no_input);
}

export function update_topic_inputbox_on_topics_policy_change(): void {
    if (!stream_data.can_use_empty_topic(compose_state.stream_id())) {
        const $input = $("input#stream_message_recipient_topic");
        $input.attr("placeholder", $t({defaultMessage: "Topic"}));
        $input.removeClass("empty-topic-display");
        const $topic_not_mandatory_placeholder = $("#topic-not-mandatory-placeholder");
        $topic_not_mandatory_placeholder.removeClass("visible");
        $topic_not_mandatory_placeholder.hide();
        return;
    }
    update_topic_displayed_text(compose_state.topic());
}

export function update_topic_displayed_text(topic_name = "", has_topic_focus = false): void {
    compose_state.topic(topic_name);

    const $input = $("input#stream_message_recipient_topic");
    const recipient_widget_hidden =
        $(".compose_select_recipient-dropdown-list-container").length === 0;
    const $topic_not_mandatory_placeholder = $("#topic-not-mandatory-placeholder");

    // reset
    $input.prop("disabled", false);
    $input.attr("placeholder", "");
    $input.removeClass("empty-topic-display empty-topic-only");
    $topic_not_mandatory_placeholder.removeClass("visible");
    $topic_not_mandatory_placeholder.hide();
    $("#compose_recipient_box").removeClass("disabled");

    if (!stream_data.can_use_empty_topic(compose_state.stream_id())) {
        $input.attr("placeholder", $t({defaultMessage: "Topic"}));
        // When topics are mandatory, no additional adjustments are needed.
        // Also, if the recipient in the compose box is not selected, the
        // placeholder will always be "Topic" and never "general chat".
        return;
    }

    // If `topics_policy` is set to `empty_topic_only`, disable the topic input
    // and empty the input box.
    if (stream_data.is_empty_topic_only_channel(compose_state.stream_id())) {
        compose_state.topic("");
        $input.prop("disabled", true);
        $input.addClass("empty-topic-only");
        $("#compose_recipient_box").addClass("disabled");
        $("textarea#compose-textarea").trigger("focus");
        has_topic_focus = false;
    }
    // Otherwise, we have some adjustments to make to display:
    // * a placeholder with the default topic name stylized
    // * the empty string topic stylized

    const is_empty_string_topic = compose_state.topic() === "";
    if (
        is_empty_string_topic &&
        ($input.prop("disabled") || (!has_topic_focus && recipient_widget_hidden))
    ) {
        $input.attr("placeholder", util.get_final_topic_display_name(""));
        $input.addClass("empty-topic-display");
    } else {
        $topic_not_mandatory_placeholder.show();
        update_placeholder_visibility();
    }
}

export function update_placeholder_visibility(): void {
    const $input = $("input#stream_message_recipient_topic");
    const $topic_not_mandatory_placeholder = $("#topic-not-mandatory-placeholder");

    $topic_not_mandatory_placeholder.toggleClass("visible", $input.val() === "");
}

export let update_compose_area_placeholder_text = (): void => {
    const $textarea: JQuery<HTMLTextAreaElement> = $("textarea#compose-textarea");
    // Change compose placeholder text only if compose box is open.
    if ($(".message_comp").css("display") === "none") {
        return;
    }
    const message_type = compose_state.get_message_type();

    let placeholder = compose_ui.DEFAULT_COMPOSE_PLACEHOLDER;
    if (message_type === "stream") {
        const stream_id = compose_state.stream_id();
        placeholder = compose_ui.compute_placeholder_text({
            message_type,
            stream_id,
            topic: compose_state.topic(),
        });
    } else if (message_type === "private") {
        placeholder = compose_ui.compute_placeholder_text({
            message_type,
            direct_message_user_ids: compose_pm_pill.get_user_ids(),
        });
    }

    $textarea.attr("placeholder", placeholder);
    compose_ui.autosize_textarea($textarea);
};

export function rewire_update_compose_area_placeholder_text(
    value: typeof update_compose_area_placeholder_text,
): void {
    update_compose_area_placeholder_text = value;
}

// This function addresses the issue of the placeholder not reappearing in Firefox
// when the user types into an input field and then deletes the content.
// The problem arises due to the `contenteditable` attribute, which in some browsers
// (like Firefox) inserts a <br> tag when the input is emptied. This <br> tag prevents
// the placeholder from showing up again. The function checks if the input is empty
// and contains a <br> tag, then removes it to restore the placeholder functionality.
export function restore_placeholder_in_firefox_for_no_input(): void {
    if ($("#private_message_recipient").text().trim() === "") {
        $("#private_message_recipient").empty();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: compose_reply.ts]---
Location: zulip-main/web/src/compose_reply.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";
import * as z from "zod/mini";

import * as channel from "./channel.ts";
import * as compose_actions from "./compose_actions.ts";
import * as compose_paste from "./compose_paste.ts";
import * as compose_recipient from "./compose_recipient.ts";
import * as compose_state from "./compose_state.ts";
import * as compose_ui from "./compose_ui.ts";
import * as copy_messages from "./copy_messages.ts";
import * as fenced_code from "./fenced_code.ts";
import * as hash_util from "./hash_util.ts";
import {$t} from "./i18n.ts";
import * as inbox_ui from "./inbox_ui.ts";
import * as inbox_util from "./inbox_util.ts";
import * as message_lists from "./message_lists.ts";
import type {Message} from "./message_store.ts";
import * as narrow_state from "./narrow_state.ts";
import * as people from "./people.ts";
import * as recent_view_ui from "./recent_view_ui.ts";
import * as recent_view_util from "./recent_view_util.ts";
import * as stream_data from "./stream_data.ts";
import * as unread_ops from "./unread_ops.ts";

export let respond_to_message = (opts: {
    keep_composebox_empty?: boolean;
    message_id?: number;
    reply_type?: "personal";
    trigger?: string;
}): void => {
    let message;
    let msg_type: "private" | "stream";
    if (recent_view_util.is_visible()) {
        message = recent_view_ui.get_focused_row_message();
        if (message === undefined) {
            // Open empty compose with nothing pre-filled since
            // user is not focused on any table row.
            compose_actions.start({
                message_type: "stream",
                trigger: "recent_view_nofocus",
                keep_composebox_empty: opts.keep_composebox_empty,
            });
            return;
        }
    } else if (inbox_util.is_visible()) {
        const message_opts = inbox_ui.get_focused_row_message();
        if (message_opts.message === undefined) {
            // If the user is not focused on inbox header, msg_type
            // is not defined, so we open empty compose with nothing prefilled.
            compose_actions.start({
                message_type: message_opts.msg_type ?? "stream",
                trigger: "inbox_nofocus",
                ...message_opts,
                keep_composebox_empty: opts.keep_composebox_empty,
            });
            return;
        }
        message = message_opts.message;
    } else {
        assert(message_lists.current !== undefined);

        message =
            (opts.message_id === undefined
                ? undefined
                : message_lists.current.get(opts.message_id)) ??
            message_lists.current.selected_message();

        if (message === undefined) {
            // empty narrow implementation
            if (
                !narrow_state.narrowed_by_pm_reply() &&
                !narrow_state.narrowed_by_stream_reply() &&
                !narrow_state.narrowed_by_topic_reply()
            ) {
                compose_actions.start({
                    message_type: "stream",
                    trigger: "empty_narrow_compose",
                    keep_composebox_empty: opts.keep_composebox_empty,
                });
                return;
            }

            const narrow_stream_id = narrow_state.stream_id();
            if (narrow_stream_id && !stream_data.is_subscribed(narrow_stream_id)) {
                compose_actions.start({
                    message_type: "stream",
                    trigger: "empty_narrow_compose",
                    keep_composebox_empty: opts.keep_composebox_empty,
                });
                return;
            }

            // Set msg_type to stream by default in the case of an empty
            // home view.
            msg_type = "stream";
            if (narrow_state.narrowed_by_pm_reply()) {
                msg_type = "private";
            }

            const new_opts = compose_actions.fill_in_opts_from_current_narrowed_view({
                ...opts,
                message_type: msg_type,
            });
            compose_actions.start({
                ...new_opts,
                keep_composebox_empty: opts.keep_composebox_empty,
            });
            return;
        }

        if (message_lists.current.can_mark_messages_read()) {
            unread_ops.notify_server_message_read(message);
        }
    }

    // Important note: A reply_type of 'personal' is for the R hotkey
    // (replying to a message's sender with a direct message). All
    // other replies can just copy message.type.
    if (opts.reply_type === "personal" || message.type === "private") {
        msg_type = "private";
    } else {
        msg_type = message.type;
    }

    let stream_id: number | undefined;
    let topic = "";
    let private_message_recipient_ids: number[] | undefined;
    if (msg_type === "stream") {
        assert(message.type === "stream");
        stream_id = message.stream_id;
        topic = message.topic;
    } else if (opts.reply_type === "personal") {
        // reply_to for direct messages is everyone involved, so for
        // personals replies we need to set the direct message
        // recipient to just the sender
        private_message_recipient_ids = [message.sender_id];
    } else {
        private_message_recipient_ids = people.pm_with_user_ids(message);
    }

    compose_actions.start({
        message_type: msg_type,
        stream_id,
        topic,
        ...(private_message_recipient_ids !== undefined && {private_message_recipient_ids}),
        ...(opts.trigger !== undefined && {trigger: opts.trigger}),
        is_reply: true,
        keep_composebox_empty: opts.keep_composebox_empty,
    });
};

export function rewire_respond_to_message(value: typeof respond_to_message): void {
    respond_to_message = value;
}

export function reply_with_mention(opts: {
    keep_composebox_empty?: boolean;
    message_id?: number;
    reply_type?: "personal";
    trigger?: string;
}): void {
    assert(message_lists.current !== undefined);
    respond_to_message({
        ...opts,
        keep_composebox_empty: true,
    });
    const message = message_lists.current.selected_message();
    assert(message !== undefined);
    const mention = people.get_mention_syntax(message.sender_full_name, message.sender_id);
    compose_ui.insert_syntax_and_focus(mention);
}

export let selection_within_message_id = (
    selection = window.getSelection(),
): number | undefined => {
    // Returns the message_id if the selection is entirely within a message,
    // otherwise returns undefined.
    assert(selection !== null);
    if (!selection.toString()) {
        return undefined;
    }
    const {start_id, end_id} = copy_messages.analyze_selection(selection);
    if (start_id === end_id) {
        return start_id;
    }
    return undefined;
};

export function rewire_selection_within_message_id(
    value: typeof selection_within_message_id,
): void {
    selection_within_message_id = value;
}

function get_quote_target(opts: {message_id?: number; quote_content?: string | undefined}): {
    message_id: number;
    message: Message;
    quote_content: string | undefined;
} {
    assert(message_lists.current !== undefined);
    let message_id;
    let quote_content;
    if (opts.message_id) {
        // If triggered via the message actions popover
        message_id = opts.message_id;
        if (opts.quote_content) {
            quote_content = opts.quote_content;
        }
    } else {
        // If triggered via hotkey
        const selection_message_id = selection_within_message_id();
        if (selection_message_id) {
            // If the current selection is entirely within a message, we
            // quote that selection.
            message_id = selection_message_id;
            quote_content = get_message_selection();
        } else {
            // Else we pick the currently focused message.
            message_id = message_lists.current.selected_id();
        }
    }
    const message = message_lists.current.get(message_id);
    assert(message !== undefined);
    // If the current selection, if any, is not entirely within the target message,
    // we quote that entire message.
    quote_content ??= message.raw_content;
    return {message_id, message, quote_content};
}

export function quote_message(opts: {
    message_id?: number;
    quote_content?: string | undefined;
    keep_composebox_empty?: boolean;
    reply_type?: "personal";
    trigger?: string;
    forward_message?: boolean;
}): void {
    const {message_id, message, quote_content} = get_quote_target(opts);
    const quoting_placeholder = $t({defaultMessage: "[Quoting…]"});

    // If the last compose type textarea focused on is still in the DOM, we add
    // the quote in that textarea, else we default to the compose box.
    const last_focused_compose_type_input = compose_state.get_last_focused_compose_type_input();
    const $textarea =
        last_focused_compose_type_input?.isConnected && !opts.forward_message
            ? $(last_focused_compose_type_input)
            : $<HTMLTextAreaElement>("textarea#compose-textarea");

    if (opts.forward_message) {
        let topic = "";
        let stream_id: number | undefined;
        if (message.is_stream) {
            topic = message.topic;
            stream_id = message.stream_id;
        }
        compose_state.set_is_processing_forward_message(true);
        compose_actions.start({
            message_type: message.type,
            topic,
            keep_composebox_empty: opts.keep_composebox_empty,
            content: quoting_placeholder,
            stream_id,
            private_message_recipient_ids: [],
        });
        compose_recipient.toggle_compose_recipient_dropdown();
    } else {
        if ($textarea.attr("id") === "compose-textarea" && !compose_state.has_message_content()) {
            // The user has not started typing a message,
            // but is quoting into the compose box,
            // so we will re-open the compose box.
            // (If you did re-open the compose box, you
            // are prone to glitches where you select the
            // text, plus it's a complicated codepath that
            // can have other unintended consequences.)
            respond_to_message({
                ...opts,
                keep_composebox_empty: true,
            });
        }

        compose_ui.insert_syntax_and_focus(quoting_placeholder, $textarea, "block");
    }

    function replace_content(message: Message, raw_content: string): void {
        // Final message looks like:
        //     @_**Iago|5** [said](link to message):
        //     ```quote
        //     message content
        //     ```
        // Keep syntax in sync with zerver/lib/reminders.py
        let content = $t(
            {defaultMessage: "{username} [said]({link_to_message}):"},
            {
                username: `@_**${message.sender_full_name}|${message.sender_id}**`,
                link_to_message: hash_util.by_conversation_and_time_url(message),
            },
        );
        content += "\n";
        const fence = fenced_code.get_unused_fence(raw_content);
        content += `${fence}quote\n${raw_content}\n${fence}`;

        compose_ui.replace_syntax(quoting_placeholder, content, $textarea, opts.forward_message);
        compose_ui.autosize_textarea($textarea);

        if (!opts.forward_message) {
            return;
        }
        const select_recipient_widget: tippy.ReferenceElement | undefined = $(
            "#compose_select_recipient_widget",
        )[0];
        if (select_recipient_widget !== undefined) {
            void select_recipient_widget._tippy?.popperInstance?.update();
        }
    }

    if (message && quote_content) {
        replace_content(message, quote_content);
        return;
    }

    void channel.get({
        url: "/json/messages/" + message_id,
        data: {allow_empty_topic_name: true},
        success(raw_data) {
            const data = z.object({raw_content: z.string()}).parse(raw_data);
            replace_content(message, data.raw_content);
        },
        error() {
            compose_ui.replace_syntax(
                quoting_placeholder,
                $t({defaultMessage: "[Error fetching message content.]"}),
                $textarea,
                opts.forward_message,
            );
            compose_ui.autosize_textarea($textarea);
        },
    });
}

function extract_range_html(range: Range, preserve_ancestors = false): string {
    // Returns the html of the range as a string, optionally preserving 2
    // levels of ancestors.
    const temp_div = document.createElement("div");
    if (!preserve_ancestors) {
        temp_div.append(range.cloneContents());
        return temp_div.innerHTML;
    }
    const container =
        range.commonAncestorContainer instanceof HTMLElement
            ? range.commonAncestorContainer
            : range.commonAncestorContainer.parentElement;
    assert(container !== null);
    assert(container.parentElement !== null);
    // The reason for preserving 2, not just 1, ancestors is code blocks; a
    // selection completely inside a code block has a code element as its
    // container element, inside a pre element, which is needed to identify
    // the selection as being part of a code block as opposed to inline code.
    const outer_container = container.parentElement.cloneNode();
    assert(outer_container instanceof HTMLElement); // https://github.com/microsoft/TypeScript/issues/283
    const container_clone = container.cloneNode();
    assert(container_clone instanceof HTMLElement); // https://github.com/microsoft/TypeScript/issues/283
    container_clone.append(range.cloneContents());
    outer_container.append(container_clone);
    temp_div.append(outer_container);
    return temp_div.innerHTML;
}

function get_range_intersection_with_element(range: Range, element: Node): Range {
    // Returns a new range that is a subset of range and is inside element.
    const intersection = document.createRange();
    intersection.selectNodeContents(element);

    if (intersection.compareBoundaryPoints(Range.START_TO_START, range) < 0) {
        intersection.setStart(range.startContainer, range.startOffset);
    }

    if (intersection.compareBoundaryPoints(Range.END_TO_END, range) > 0) {
        intersection.setEnd(range.endContainer, range.endOffset);
    }

    return intersection;
}

export function get_message_selection(selection = window.getSelection()): string {
    assert(selection !== null);
    let selected_message_content_raw = "";

    // We iterate over all ranges in the selection, to find the ranges containing
    // the message_content div or its descendants, if any, then convert the html
    // in those ranges to markdown for quoting (firefox can have multiple ranges
    // in one selection), and also compute their combined bounding rect.
    for (let i = 0; i < selection.rangeCount; i = i + 1) {
        let range = selection.getRangeAt(i);
        const range_common_ancestor = range.commonAncestorContainer;
        let html_to_convert = "";
        let message_content;

        // If the common ancestor is the message_content div or its child, we can quote
        // this entire range at least.
        if (
            range_common_ancestor instanceof Element &&
            range_common_ancestor.classList.contains("message_content")
        ) {
            html_to_convert = extract_range_html(range);
        } else if ($(range_common_ancestor).parents(".message_content").length > 0) {
            // We want to preserve the structure of the html with 2 levels of
            // ancestors (to retain code block / list formatting) in such a range.
            html_to_convert = extract_range_html(range, true);
        } else if (
            // If the common ancestor contains the message_content div, we can quote the part
            // of this range that is in the message_content div, if any.
            range_common_ancestor instanceof Element &&
            (message_content = range_common_ancestor.querySelector(".message_content")) !== null &&
            range.cloneContents().querySelector(".message_content")
        ) {
            // Narrow down the range to the part that is in the message_content div.
            range = get_range_intersection_with_element(range, message_content);
            html_to_convert = extract_range_html(range);
        } else {
            continue;
        }
        const markdown_text = compose_paste.paste_handler_converter(html_to_convert);
        selected_message_content_raw = selected_message_content_raw + "\n" + markdown_text;
    }
    selected_message_content_raw = selected_message_content_raw.trim();
    return selected_message_content_raw;
}

export function initialize(): void {
    $("body").on("click", ".compose_reply_button", () => {
        respond_to_message({trigger: "reply button"});
    });
}
```

--------------------------------------------------------------------------------

````
