---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 603
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 603 of 1290)

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

---[FILE: compose_state.ts]---
Location: zulip-main/web/src/compose_state.ts

```typescript
import $ from "jquery";

import * as compose_pm_pill from "./compose_pm_pill.ts";
import * as people from "./people.ts";
import * as stream_data from "./stream_data.ts";
import * as sub_store from "./sub_store.ts";

let message_type: "stream" | "private" | undefined;
let recipient_edited_manually = false;
let is_content_unedited_restored_draft = false;
let last_focused_compose_type_input: HTMLTextAreaElement | undefined;
let preview_render_count = 0;
let is_processing_forward_message = false;

// We use this variable to keep track of whether user has viewed the topic resolved
// banner for the current compose session, for a narrow. This prevents the banner
// from popping up for every keystroke while composing.
// The variable is reset on sending a message, closing the compose box and changing
// the narrow and the user should still be able to see the banner once after
// performing these actions
let recipient_viewed_topic_resolved_banner = false;
let recipient_viewed_topic_moved_banner = false;
let recipient_guest_ids_for_dm_warning: number[] = [];

export function set_recipient_edited_manually(flag: boolean): void {
    recipient_edited_manually = flag;
}

export function is_recipient_edited_manually(): boolean {
    return recipient_edited_manually;
}

export function set_is_content_unedited_restored_draft(flag: boolean): void {
    is_content_unedited_restored_draft = flag;
}

export function get_is_content_unedited_restored_draft(): boolean {
    return is_content_unedited_restored_draft;
}

export function set_last_focused_compose_type_input(element: HTMLTextAreaElement): void {
    last_focused_compose_type_input = element;
}

export function get_last_focused_compose_type_input(): HTMLTextAreaElement | undefined {
    return last_focused_compose_type_input;
}

export function set_message_type(msg_type: "stream" | "private" | undefined): void {
    message_type = msg_type;
}

export function get_message_type(): "stream" | "private" | undefined {
    return message_type;
}

export function set_recipient_viewed_topic_resolved_banner(flag: boolean): void {
    recipient_viewed_topic_resolved_banner = flag;
}

export function has_recipient_viewed_topic_resolved_banner(): boolean {
    return recipient_viewed_topic_resolved_banner;
}

export function set_recipient_viewed_topic_moved_banner(flag: boolean): void {
    recipient_viewed_topic_moved_banner = flag;
}

export function has_recipient_viewed_topic_moved_banner(): boolean {
    return recipient_viewed_topic_moved_banner;
}

export function set_recipient_guest_ids_for_dm_warning(guest_ids: number[]): void {
    recipient_guest_ids_for_dm_warning = guest_ids;
}

export function get_recipient_guest_ids_for_dm_warning(): number[] {
    return recipient_guest_ids_for_dm_warning;
}

export function get_preview_render_count(): number {
    return preview_render_count;
}

export function set_preview_render_count(count: number): void {
    preview_render_count = count;
}

export function set_is_processing_forward_message(val: boolean): void {
    is_processing_forward_message = val;
}

export function get_is_processing_forward_message(): boolean {
    return is_processing_forward_message;
}

export function composing(): boolean {
    // This is very similar to get_message_type(), but it returns
    // a boolean.
    return Boolean(message_type);
}

function get_or_set(
    input_selector: string,
    // For the compose box, it's important to preserve leading spaces,
    // but not newlines.
    keep_leading_spaces?: boolean,
    no_trim?: boolean,
): (newval?: string) => string {
    // We can't hoist the assignment of '$elem' out of this lambda,
    // because the DOM element might not exist yet when get_or_set
    // is called.
    return function (newval) {
        const $elem = $<HTMLInputElement | HTMLTextAreaElement>(input_selector);
        const oldval = $elem.val()!;
        if (newval !== undefined) {
            $elem.val(newval);
        }
        if (no_trim) {
            return oldval;
        } else if (keep_leading_spaces) {
            return oldval.trimEnd().replace(/^(\r?\n)+/, "");
        }
        return oldval.trim();
    };
}

// selected_recipient_id is the current state for the stream picker widget:
// "" -> stream message but no stream is selected
// integer -> stream id of the selected stream.
// "direct" -> Direct message is selected.
export let selected_recipient_id: number | "direct" | "" = "";
export const DIRECT_MESSAGE_ID = "direct";

export function set_selected_recipient_id(recipient_id: number | "direct" | ""): void {
    selected_recipient_id = recipient_id;
}

export function stream_id(): number | undefined {
    const stream_id = selected_recipient_id;
    if (typeof stream_id === "number") {
        return stream_id;
    }
    return undefined;
}

export let stream_name = (): string => {
    const stream_id = selected_recipient_id;
    if (typeof stream_id === "number") {
        return sub_store.maybe_get_stream_name(stream_id) ?? "";
    }
    return "";
};

export function rewire_stream_name(value: typeof stream_name): void {
    stream_name = value;
}

export function set_stream_id(stream_id: number | ""): void {
    set_selected_recipient_id(stream_id);
}

export function set_compose_recipient_id(recipient_id: number | "direct"): void {
    set_selected_recipient_id(recipient_id);
}

// TODO: Break out setter and getter into their own functions.
export let topic = get_or_set("input#stream_message_recipient_topic");

export function rewire_topic(value: typeof topic): void {
    topic = value;
}

// We can't trim leading whitespace in `compose_textarea` because
// of the indented syntax for multi-line code blocks.
export const message_content = get_or_set("textarea#compose-textarea", true);

const untrimmed_message_content = get_or_set("textarea#compose-textarea", true, true);

function cursor_at_start_of_whitespace_in_compose(): boolean {
    const cursor_position = $("textarea#compose-textarea").caret();
    return message_content() === "" && cursor_position === 0;
}

export function focus_in_formatting_buttons(): boolean {
    const is_focused_formatting_button =
        document.activeElement?.classList.contains("compose_control_button");
    if (is_focused_formatting_button) {
        return true;
    }
    return false;
}

export function focus_in_empty_compose(
    consider_start_of_whitespace_message_empty = false,
): boolean {
    // A user trying to press arrow keys in an empty compose is mostly
    // likely trying to navigate messages. This helper function
    // decides whether the compose box is empty for this purpose.
    if (!composing()) {
        return false;
    }

    // We treat the compose box as empty if it's completely empty, or
    // if the caller requested, if it contains only whitespace and we're
    // at the start of te compose box.
    const treat_compose_as_empty =
        untrimmed_message_content() === "" ||
        (consider_start_of_whitespace_message_empty && cursor_at_start_of_whitespace_in_compose());
    if (!treat_compose_as_empty) {
        return false;
    }

    const focused_element_id = document.activeElement?.id;
    if (focused_element_id === "compose-textarea") {
        // Focus will be in the compose textarea after sending a
        // message; this is the most common situation.
        return true;
    }

    // If the current focus is in one of the recipient inputs, we need
    // to check whether the input is empty, to avoid accidentally
    // overriding the browser feature where the Up/Down arrow keys jump
    // you to the start/end of a non-empty text input.
    //
    // Check whether the current input element is empty for each input type.
    switch (focused_element_id) {
        case "private_message_recipient":
            return private_message_recipient_ids().length === 0;
        case "stream_message_recipient_topic":
            return topic() === "";
        case "compose_select_recipient_widget_wrapper":
            return stream_id() === undefined;
    }

    return false;
}

export function private_message_recipient_emails(): string;
export function private_message_recipient_emails(value: string): undefined;
export function private_message_recipient_emails(value?: string): string | undefined {
    if (typeof value === "string") {
        compose_pm_pill.set_from_emails(value);
        return undefined;
    }
    return compose_pm_pill.get_emails();
}

export function private_message_recipient_ids(): number[];
export function private_message_recipient_ids(value: number[]): undefined;
export function private_message_recipient_ids(value?: number[]): number[] | undefined {
    if (value === undefined) {
        return compose_pm_pill.get_user_ids();
    }
    compose_pm_pill.set_from_user_ids(value);
    return undefined;
}

export function has_message_content(): boolean {
    return message_content() !== "";
}

export function has_novel_message_content(): boolean {
    return message_content() !== "" && !get_is_content_unedited_restored_draft();
}

const MINIMUM_MESSAGE_LENGTH_TO_SAVE_DRAFT = 2;
export function has_savable_message_content(): boolean {
    return message_content().length > MINIMUM_MESSAGE_LENGTH_TO_SAVE_DRAFT;
}

export function has_full_recipient(): boolean {
    if (message_type === "stream") {
        const has_topic = topic() !== "" || stream_data.can_use_empty_topic(stream_id());
        return stream_id() !== undefined && has_topic;
    }
    return private_message_recipient_ids().length > 0;
}

export function update_email(user_id: number, new_email: string): void {
    let reply_to = private_message_recipient_emails();

    if (!reply_to) {
        return;
    }

    reply_to = people.update_email_in_reply_to(reply_to, user_id, new_email);

    private_message_recipient_emails(reply_to);
}

let _can_restore_drafts = true;
export function prevent_draft_restoring(): void {
    _can_restore_drafts = false;
}

export function allow_draft_restoring(): void {
    _can_restore_drafts = true;
}

export function can_restore_drafts(): boolean {
    return _can_restore_drafts;
}
```

--------------------------------------------------------------------------------

---[FILE: compose_textarea.ts]---
Location: zulip-main/web/src/compose_textarea.ts

```typescript
import $ from "jquery";

// Save the compose content cursor position and restore when we
// shift-tab back in (see hotkey.ts).
let saved_compose_cursor = 0;

function set_compose_textarea_handlers(): void {
    $("textarea#compose-textarea").on("blur", function () {
        saved_compose_cursor = $(this).caret();
    });

    // on the end of the modified-message fade in, remove the fade-in-message class.
    const animationEnd = "webkitAnimationEnd oanimationend msAnimationEnd animationend";
    $("body").on(animationEnd, ".fade-in-message", function () {
        $(this).removeClass("fade-in-message");
    });
}

export function restore_compose_cursor(): void {
    $("textarea#compose-textarea").trigger("focus").caret(saved_compose_cursor);
}

export function initialize(): void {
    set_compose_textarea_handlers();
}
```

--------------------------------------------------------------------------------

---[FILE: compose_tooltips.ts]---
Location: zulip-main/web/src/compose_tooltips.ts

```typescript
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";
import * as tippy from "tippy.js";

import render_drafts_tooltip from "../templates/drafts_tooltip.hbs";
import render_narrow_to_compose_recipients_tooltip from "../templates/narrow_to_compose_recipients_tooltip.hbs";

import * as blueslip from "./blueslip.ts";
import * as compose_state from "./compose_state.ts";
import * as compose_validate from "./compose_validate.ts";
import {$t} from "./i18n.ts";
import {pick_empty_narrow_banner} from "./narrow_banner.ts";
import * as narrow_state from "./narrow_state.ts";
import * as popover_menus from "./popover_menus.ts";
import {realm} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import {
    EXTRA_LONG_HOVER_DELAY,
    INSTANT_HOVER_DELAY,
    LONG_HOVER_DELAY,
    SINGLETON_INSTANT_HOVER_DELAY,
    SINGLETON_LONG_HOVER_DELAY,
    get_tooltip_content,
} from "./tippyjs.ts";
import {parse_html} from "./ui_util.ts";
import {user_settings} from "./user_settings.ts";

type SingletonContext = "compose" | `edit_message:${string}`;
type SingletonTooltips = {
    tooltip_instances: tippy.Instance[] | null;
    singleton_instance: tippy.CreateSingletonInstance | null;
};

const compose_button_singleton_context_map = new Map<SingletonContext, SingletonTooltips>();

// Ensure proper teardown of singleton instances, especially for "Save/Cancel" actions or when handling edit window time limits.
// Reference: http://atomiks.github.io/tippyjs/v6/addons/#destroy
export function clean_up_compose_singleton_tooltip(context: SingletonContext): void {
    const singleton_tooltips = compose_button_singleton_context_map.get(context);
    if (singleton_tooltips) {
        singleton_tooltips.singleton_instance?.destroy();
        if (singleton_tooltips.tooltip_instances) {
            for (const tippy_instance of singleton_tooltips.tooltip_instances) {
                if (!tippy_instance.state.isDestroyed) {
                    tippy_instance.destroy();
                }
            }
        }
        compose_button_singleton_context_map.delete(context);
    }
}

export function initialize_compose_tooltips(context: SingletonContext, selector: string): void {
    // Listen on body for the very first mouseenter on any element matching `selector`
    $(document.body).one("mousemove", selector, (e) => {
        // Clean up existing instances first
        clean_up_compose_singleton_tooltip(context);

        const tooltip_instances = tippy.default(selector, {
            trigger: "mouseenter",
            appendTo: () => document.body,
            placement: "top",
        });

        const singleton_instance = tippy.createSingleton(tooltip_instances, {
            delay: LONG_HOVER_DELAY,
            appendTo: () => document.body,
            onTrigger(instance, event) {
                const currentTarget = event.currentTarget;
                if (currentTarget instanceof HTMLElement) {
                    const content = get_tooltip_content(currentTarget);
                    if (content) {
                        instance.setContent(content);
                    }
                    if (currentTarget.classList?.contains("disabled-on-hover")) {
                        instance.setProps({delay: SINGLETON_INSTANT_HOVER_DELAY});
                    } else {
                        instance.setProps({delay: SINGLETON_LONG_HOVER_DELAY});
                    }
                }
            },
        });

        // Show the tooltip since user has hovered over the element.
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.dispatchEvent(new MouseEvent("mouseenter"));
        }

        compose_button_singleton_context_map.set(context, {
            tooltip_instances,
            singleton_instance,
        });
    });
}

export function initialize(): void {
    tippy.delegate("body", {
        target: [
            // Ideally this would be `#compose_buttons .button`, but the
            // reply button's actual area is its containing span.
            "#left_bar_compose_mobile_button_big",
            "#new_direct_message_button",
        ].join(","),
        delay: EXTRA_LONG_HOVER_DELAY,
        // Only show on mouseenter since for spectators, clicking on these
        // buttons opens login modal, and Micromodal returns focus to the
        // trigger after it closes, which results in tooltip being displayed.
        trigger: "mouseenter",
        appendTo: () => document.body,
        onHidden(instance) {
            instance.destroy();
        },
    });
    tippy.delegate("body", {
        target: "#compose_buttons .compose-reply-button-wrapper",
        delay: EXTRA_LONG_HOVER_DELAY,
        // Only show on mouseenter since for spectators, clicking on these
        // buttons opens login modal, and Micromodal returns focus to the
        // trigger after it closes, which results in tooltip being displayed.
        trigger: "mouseenter",
        appendTo: () => document.body,
        onShow(instance) {
            const $elem = $(instance.reference);
            const button_type = $elem.attr("data-reply-button-type");
            switch (button_type) {
                case "direct_disabled": {
                    const narrow_filter = narrow_state.filter();
                    assert(narrow_filter !== undefined);
                    instance.setContent(pick_empty_narrow_banner(narrow_filter).title);
                    return;
                }
                case "stream_disabled": {
                    instance.setContent(
                        parse_html(
                            $("#compose_disable_stream_reply_button_tooltip_template").html(),
                        ),
                    );
                    return;
                }
                case "selected_message": {
                    instance.setContent(
                        parse_html($("#compose_reply_message_button_tooltip_template").html()),
                    );
                    return;
                }
                case "selected_conversation": {
                    instance.setContent(
                        parse_html(
                            $("#compose_reply_selected_topic_button_tooltip_template").html(),
                        ),
                    );
                    return;
                }
                default: {
                    instance.setContent(
                        parse_html($("#compose_reply_message_button_tooltip_template").html()),
                    );
                    return;
                }
            }
        },
        onTrigger(instance, event) {
            assert(event.currentTarget instanceof HTMLElement);
            if ($(event.currentTarget).attr("data-reply-button-type") === "stream_disabled") {
                instance.setProps({delay: INSTANT_HOVER_DELAY});
            }
        },
        onHidden(instance) {
            instance.destroy();
        },
    });

    tippy.delegate("body", {
        target: "#compose_buttons .compose_new_conversation_button",
        delay: EXTRA_LONG_HOVER_DELAY,
        // Only show on mouseenter since for spectators, clicking on these
        // buttons opens login modal, and Micromodal returns focus to the
        // trigger after it closes, which results in tooltip being displayed.
        trigger: "mouseenter",
        appendTo: () => document.body,
        onShow(instance) {
            const $new_conversation_button = $("#new_conversation_button");
            const conversation_type = $new_conversation_button.attr("data-conversation-type");
            if (conversation_type === "stream") {
                if ($new_conversation_button.prop("disabled")) {
                    instance.setContent(
                        parse_html(
                            $("#compose_disable_stream_reply_button_tooltip_template").html(),
                        ),
                    );
                } else {
                    const stream_id = narrow_state.stream_id()!;
                    if (!stream_data.can_create_new_topics_in_stream(stream_id)) {
                        instance.setContent(
                            parse_html($("#new_message_button_tooltip_template").html()),
                        );
                    } else {
                        instance.setContent(
                            parse_html($("#new_topic_message_button_tooltip_template").html()),
                        );
                    }
                }
                return undefined;
            }
            // Use new_stream_message_button_tooltip_template when the
            // conversation_type is equal to "non-specific" and also as a default fallback.
            instance.setContent(
                parse_html($("#new_stream_message_button_tooltip_template").html()),
            );
            return undefined;
        },
        onHidden(instance) {
            instance.destroy();
        },
    });

    tippy.delegate("body", {
        target: ".send-control-button",
        delay: LONG_HOVER_DELAY,
        placement: "top",
        onShow(instance) {
            // Don't show send-area tooltips if the popover is displayed.
            if (popover_menus.is_scheduled_messages_popover_displayed()) {
                return false;
            }
            if (instance.reference.id === "compose-drafts-button") {
                const count =
                    instance.reference.querySelector(".compose-drafts-count")!.textContent ?? 0;
                // Explain that the number in brackets is the number of drafts for this conversation.
                const draft_count_msg = $t(
                    {
                        defaultMessage:
                            "{count, plural, one {# draft} other {# drafts}} for this conversation",
                    },
                    {count},
                );
                instance.setContent(parse_html(render_drafts_tooltip({draft_count_msg})));
            }
            return undefined;
        },
        appendTo: () => document.body,
    });

    tippy.delegate("body", {
        target: "#compose-limit-indicator",
        delay: INSTANT_HOVER_DELAY,
        trigger: "mouseenter",
        appendTo: () => document.body,
        onShow(instance) {
            instance.setContent(
                $t(
                    {defaultMessage: `Maximum message length: {max_length} characters`},
                    {max_length: realm.max_message_length},
                ),
            );
        },
    });

    tippy.delegate("body", {
        target: "#compose-send-button",
        // 350px at 14px/1em
        maxWidth: "25em",
        // By default, tippyjs uses a trigger value of "mouseenter focus",
        // but by specifying "mouseenter", this will prevent showing the
        // Send tooltip when tabbing to the Send button.
        trigger: "mouseenter",
        appendTo: () => document.body,
        onTrigger(instance) {
            if (instance.reference.classList.contains("disabled-message-send-controls")) {
                instance.setProps({
                    delay: 0,
                });
            } else {
                instance.setProps({
                    delay: EXTRA_LONG_HOVER_DELAY,
                });
            }
        },
        onShow(instance) {
            // Don't show send-area tooltips if the popover is displayed.
            if (popover_menus.is_scheduled_messages_popover_displayed()) {
                return false;
            }

            if (instance.reference.classList.contains("disabled-message-send-controls")) {
                const error_message = compose_validate.get_disabled_send_tooltip_html();
                instance.setContent(parse_html(error_message));

                if (!error_message) {
                    blueslip.error("Compose send button incorrectly disabled.");
                    // We don't return but show normal tooltip to user.
                    instance.reference.classList.remove("disabled-message-send-controls");
                } else {
                    return undefined;
                }
            }

            if (user_settings.enter_sends) {
                instance.setContent(parse_html($("#send-enter-tooltip-template").html()));
            } else {
                instance.setContent(parse_html($("#send-ctrl-enter-tooltip-template").html()));
            }
            return undefined;
        },
    });

    tippy.delegate("body", {
        target: ".narrow_to_compose_recipients",
        delay: LONG_HOVER_DELAY,
        appendTo: () => document.body,
        content() {
            const narrow_filter = narrow_state.filter();
            let display_current_view;
            if (narrow_state.is_message_feed_visible()) {
                assert(narrow_filter !== undefined);
                if (narrow_filter.is_in_home()) {
                    display_current_view = $t({
                        defaultMessage: "Currently viewing your combined feed.",
                    });
                } else if (
                    _.isEqual(narrow_filter.sorted_term_types(), ["channel"]) &&
                    compose_state.get_message_type() === "stream" &&
                    narrow_filter.terms_with_operator("channel")[0]!.operand ===
                        compose_state.stream_name()
                ) {
                    display_current_view = $t({
                        defaultMessage: "Currently viewing the entire channel.",
                    });
                } else if (
                    _.isEqual(narrow_filter.sorted_term_types(), ["is-dm"]) &&
                    compose_state.get_message_type() === "private"
                ) {
                    display_current_view = $t({
                        defaultMessage: "Currently viewing all direct messages.",
                    });
                }
            }

            return parse_html(render_narrow_to_compose_recipients_tooltip({display_current_view}));
        },
        onHidden(instance) {
            instance.destroy();
        },
    });
}

export function hide_compose_control_button_tooltips($row: JQuery): void {
    $row.find(
        ".compose_control_button[data-tooltip-template-id], .compose_control_button[data-tippy-content], .compose_control_button_container",
    ).each(function (this: tippy.ReferenceElement) {
        this._tippy?.hide();
    });
}
```

--------------------------------------------------------------------------------

````
