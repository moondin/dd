---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 631
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 631 of 1290)

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

---[FILE: messages_overlay_ui.ts]---
Location: zulip-main/web/src/messages_overlay_ui.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as scroll_util from "./scroll_util.ts";
import * as util from "./util.ts";

export type Context = {
    items_container_selector: string;
    items_list_selector: string;
    row_item_selector: string;
    box_item_selector: string;
    id_attribute_name: string;
    get_items_ids: () => string[];
    on_enter: () => void;
    on_delete: () => void;
};

export function row_with_focus(context: Context): JQuery {
    const $focused_item = $(`.${CSS.escape(context.box_item_selector)}:focus`);
    return $focused_item.parent(`.${CSS.escape(context.row_item_selector)}`);
}

export function activate_element(elem: HTMLElement, context: Context): void {
    $(`.${CSS.escape(context.box_item_selector)}`).removeClass("active");
    elem.classList.add("active");
    elem.focus();
}

export function get_focused_element_id(context: Context): string | undefined {
    return row_with_focus(context).attr(context.id_attribute_name);
}

export function focus_on_sibling_element(context: Context): void {
    const $next_row = row_after_focus(context);
    const $prev_row = row_before_focus(context);
    let elem_to_be_focused_id: string | undefined;

    // Try to get the next item in the list and 'focus' on it.
    // Use previous item as a fallback.
    if ($next_row.length > 0) {
        elem_to_be_focused_id = $next_row.attr(context.id_attribute_name);
    } else if ($prev_row.length > 0) {
        elem_to_be_focused_id = $prev_row.attr(context.id_attribute_name);
    }

    const $new_focus_element = get_element_by_id(elem_to_be_focused_id ?? "", context);
    if ($new_focus_element[0] !== undefined) {
        assert($new_focus_element[0].children[0] instanceof HTMLElement);
        activate_element($new_focus_element[0].children[0], context);
    }
}

export function modals_handle_events(event_key: string, context: Context): void {
    initialize_focus(event_key, context);

    // This detects up arrow key presses when the overlay
    // is open and scrolls through.
    if (event_key === "up_arrow" || event_key === "vim_up") {
        scroll_to_element(row_before_focus(context), context);
    }

    // This detects down arrow key presses when the overlay
    // is open and scrolls through.
    if (event_key === "down_arrow" || event_key === "vim_down") {
        scroll_to_element(row_after_focus(context), context);
    }

    if (event_key === "backspace" || event_key === "delete") {
        context.on_delete();
    }

    if (event_key === "enter") {
        context.on_enter();
    }
}

export function set_initial_element(element_id: string | undefined, context: Context): void {
    if (element_id) {
        const current_element = util.the(get_element_by_id(element_id, context));
        const focus_element = current_element.children[0];
        assert(focus_element instanceof HTMLElement);
        activate_element(focus_element, context);
        scroll_util.scroll_element_into_container(
            $(focus_element),
            $(`.${CSS.escape(context.items_list_selector)}`),
        );
    }
}

function row_before_focus(context: Context): JQuery {
    const $focused_row = row_with_focus(context);
    const $prev_row = $focused_row.prev(`.${CSS.escape(context.row_item_selector)}`);
    // The draft modal can have two sub-sections. This handles the edge case
    // when the user moves from the second "Other drafts" section to the first
    // section which contains drafts from a particular narrow.
    if (
        $prev_row.length === 0 &&
        $focused_row.parent().attr("id") === "other-drafts" &&
        $("#drafts-from-conversation").css("display") !== "none"
    ) {
        return $($("#drafts-from-conversation").children(".overlay-message-row").last());
    }

    return $prev_row;
}

function row_after_focus(context: Context): JQuery {
    const $focused_row = row_with_focus(context);
    const $next_row = $focused_row.next(`.${CSS.escape(context.row_item_selector)}`);
    // The draft modal can have two sub-sections. This handles the edge case
    // when the user moves from the first section (drafts from a particular
    // narrow) to the second section which contains the rest of the drafts.
    if (
        $next_row.length === 0 &&
        $focused_row.parent().attr("id") === "drafts-from-conversation" &&
        $("#other-drafts").css("display") !== "none"
    ) {
        return $("#other-drafts").children(".overlay-message-row").first();
    }
    return $next_row;
}

function initialize_focus(event_name: string, context: Context): void {
    // If an item is not focused in modal, then focus the last item
    // if up_arrow is clicked or the first item if down_arrow is clicked.
    if (
        (event_name !== "up_arrow" && event_name !== "down_arrow") ||
        $(`.${CSS.escape(context.box_item_selector)}:focus`).length > 0
    ) {
        return;
    }

    const modal_items_ids = context.get_items_ids();
    const id = modal_items_ids.at(event_name === "up_arrow" ? -1 : 0);
    if (id === undefined) {
        // modal is empty
        return;
    }

    const $element = get_element_by_id(id, context);
    const focus_element = util.the($element).children[0];
    assert(focus_element instanceof HTMLElement);
    activate_element(focus_element, context);
}

function scroll_to_element($element: JQuery, context: Context): void {
    if ($element[0] === undefined) {
        return;
    }
    if ($element[0].children[0] === undefined) {
        return;
    }
    assert($element[0].children[0] instanceof HTMLElement);
    activate_element($element[0].children[0], context);

    const $items_list = $(`.${CSS.escape(context.items_list_selector)}`);
    const $items_container = $(`.${CSS.escape(context.items_container_selector)}`);
    const $box_item = $(`.${CSS.escape(context.box_item_selector)}`);

    // If focused element is first, scroll to the top.
    if (util.the($box_item.first()).parentElement === $element[0]) {
        util.the($items_list).scrollTop = 0;
    }

    // If focused element is last, scroll to the bottom.
    if (util.the($box_item.last()).parentElement === $element[0]) {
        util.the($items_list).scrollTop =
            util.the($items_list).scrollHeight - ($items_list.height() ?? 0);
    }

    // If focused element is cut off from the top, scroll up halfway in modal.
    if ($element.position().top < 55) {
        // 55 is the minimum distance from the top that will require extra scrolling.
        util.the($items_list).scrollTop -= util.the($items_list).clientHeight / 2;
    }

    // If focused element is cut off from the bottom, scroll down halfway in modal.
    const dist_from_top = $element.position().top;
    const total_dist = dist_from_top + $element[0].clientHeight;
    const dist_from_bottom = util.the($items_container).clientHeight - total_dist;
    if (dist_from_bottom < -4) {
        // -4 is the min dist from the bottom that will require extra scrolling.
        util.the($items_list).scrollTop += util.the($items_list).clientHeight / 2;
    }
}

function get_element_by_id(id: string, context: Context): JQuery {
    return $(`.overlay-message-row[${CSS.escape(context.id_attribute_name)}='${CSS.escape(id)}']`);
}
```

--------------------------------------------------------------------------------

---[FILE: message_actions_popover.ts]---
Location: zulip-main/web/src/message_actions_popover.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_message_actions_popover from "../templates/popovers/message_actions_popover.hbs";

import * as clipboard_handler from "./clipboard_handler.ts";
import * as compose_reply from "./compose_reply.ts";
import * as condense from "./condense.ts";
import {show_copied_confirmation} from "./copied_tooltip.ts";
import * as emoji_picker from "./emoji_picker.ts";
import * as message_delete from "./message_delete.ts";
import * as message_edit from "./message_edit.ts";
import * as message_lists from "./message_lists.ts";
import * as message_report from "./message_report.ts";
import type {Message} from "./message_store.ts";
import * as message_viewport from "./message_viewport.ts";
import * as popover_menus from "./popover_menus.ts";
import * as popover_menus_data from "./popover_menus_data.ts";
import * as popovers from "./popovers.ts";
import * as read_receipts from "./read_receipts.ts";
import * as rows from "./rows.ts";
import * as stream_popover from "./stream_popover.ts";
import {parse_html} from "./ui_util.ts";
import * as unread_ops from "./unread_ops.ts";
import {the} from "./util.ts";

let message_actions_popover_keyboard_toggle = false;

function get_action_menu_menu_items(): JQuery {
    return $("[data-tippy-root] #message-actions-menu-dropdown li:not(.divider) a");
}

function focus_first_action_popover_item(): void {
    // For now I recommend only calling this when the user opens the menu with a hotkey.
    // Our popup menus act kind of funny when you mix keyboard and mouse.
    const $items = get_action_menu_menu_items();
    popover_menus.focus_first_popover_item($items);
}

export function toggle_message_actions_menu(message: Message): boolean {
    if (popover_menus.is_message_actions_popover_displayed()) {
        popovers.hide_all();
        return true;
    }

    if (message.locally_echoed || message_edit.currently_editing_messages.has(message.id)) {
        // Don't open the popup for locally echoed messages for now.
        // It creates bugs with things like keyboard handlers when
        // we get the server response.
        // We also suppress the popup for messages in an editing state,
        // including previews, when a user tries to reach them from the
        // keyboard.
        return true;
    }

    // Since this can be called via hotkey, we need to
    // hide any other popovers that may be open before.
    if (popovers.any_active()) {
        popovers.hide_all();
    }

    message_viewport.maybe_scroll_to_show_message_top();
    const $popover_reference = $(".selected_message .actions_hover .message-actions-menu-button");
    message_actions_popover_keyboard_toggle = true;
    $popover_reference.trigger("click");
    return true;
}

export function initialize({
    message_reminder_click_handler,
}: {
    message_reminder_click_handler: (
        remind_message_id: number,
        target: tippy.ReferenceElement,
    ) => void;
}): void {
    popover_menus.register_popover_menu(".actions_hover .message-actions-menu-button", {
        theme: "popover-menu",
        placement: "bottom",
        popperOptions: {
            modifiers: [
                {
                    // The placement is set to bottom, but if that placement does not fit,
                    // the opposite top placement will be used.
                    name: "flip",
                    options: {
                        fallbackPlacements: ["top", "left"],
                    },
                },
            ],
        },
        onShow(instance) {
            popover_menus.on_show_prep(instance);
            const $row = $(instance.reference).closest(".message_row");
            const message_id = rows.id($row);
            const args = popover_menus_data.get_actions_popover_content_context(message_id);
            instance.setContent(parse_html(render_message_actions_popover(args)));
            $row.addClass("has_actions_popover");
        },
        onMount(instance) {
            const $row = $(instance.reference).closest(".message_row");
            const message_id = rows.id($row);
            let quote_content: string | undefined;
            if (compose_reply.selection_within_message_id() === message_id) {
                // If the user has selected text within this message, quote only that.
                // We track the selection right now, before the popover option for Quote
                // and reply is clicked, since by then the selection is lost, due to the
                // change in focus.
                quote_content = compose_reply.get_message_selection();
            }
            if (message_actions_popover_keyboard_toggle) {
                focus_first_action_popover_item();
                message_actions_popover_keyboard_toggle = false;
            }
            popover_menus.popover_instances.message_actions = instance;

            // We want click events to propagate to `instance` so that
            // instance.hide gets called.
            const $popper = $(instance.popper);
            $popper.one("click", ".respond_button", (e) => {
                compose_reply.quote_message({
                    trigger: "popover respond",
                    message_id,
                    quote_content,
                });
                e.preventDefault();
                e.stopPropagation();
                popover_menus.hide_current_popover_if_visible(instance);
            });

            $popper.one("click", ".forward_button", (e) => {
                compose_reply.quote_message({
                    trigger: "popover respond",
                    message_id,
                    quote_content,
                    forward_message: true,
                });
                e.preventDefault();
                e.stopPropagation();
                popover_menus.hide_current_popover_if_visible(instance);
            });

            $popper.one("click", ".popover_edit_message, .popover_view_source", (e) => {
                const message_id = Number($(e.currentTarget).attr("data-message-id"));
                assert(message_lists.current !== undefined);
                const $row = message_lists.current.get_row(message_id);
                message_edit.start($row);
                e.preventDefault();
                e.stopPropagation();
                popover_menus.hide_current_popover_if_visible(instance);
            });

            $popper.one("click", ".message-reminder", (e) => {
                const remind_message_id = Number($(e.currentTarget).attr("data-message-id"));
                popover_menus.hide_current_popover_if_visible(instance);
                message_reminder_click_handler(remind_message_id, instance.reference);
                e.preventDefault();
                e.stopPropagation();
            });

            $popper.one("click", ".popover_move_message", (e) => {
                const message_id = Number($(e.currentTarget).attr("data-message-id"));
                assert(message_lists.current !== undefined);
                message_lists.current.select_id(message_id);
                const message = message_lists.current.get(message_id);
                assert(message?.type === "stream");
                void stream_popover.build_move_topic_to_stream_popover(
                    message.stream_id,
                    message.topic,
                    false,
                    message,
                );
                e.preventDefault();
                e.stopPropagation();
                popover_menus.hide_current_popover_if_visible(instance);
            });

            $popper.one("click", ".mark_as_unread", (e) => {
                const message_id = Number($(e.currentTarget).attr("data-message-id"));
                unread_ops.mark_as_unread_from_here(message_id);
                e.preventDefault();
                e.stopPropagation();
                popover_menus.hide_current_popover_if_visible(instance);
            });

            $popper.one("click", ".popover_toggle_collapse", (e) => {
                const message_id = Number($(e.currentTarget).attr("data-message-id"));
                assert(message_lists.current !== undefined);
                const message = message_lists.current.get(message_id);
                assert(message !== undefined);
                if (message.collapsed) {
                    condense.uncollapse(message);
                } else {
                    condense.collapse(message);
                }
                e.preventDefault();
                e.stopPropagation();
                popover_menus.hide_current_popover_if_visible(instance);
            });

            $popper.one("click", ".view_read_receipts", (e) => {
                const message_id = Number($(e.currentTarget).attr("data-message-id"));
                read_receipts.show_user_list(message_id);
                e.preventDefault();
                e.stopPropagation();
                popover_menus.hide_current_popover_if_visible(instance);
            });

            $popper.one("click", ".delete_message", (e) => {
                const message_id = Number($(e.currentTarget).attr("data-message-id"));
                message_delete.delete_message(message_id);
                e.preventDefault();
                e.stopPropagation();
                popover_menus.hide_current_popover_if_visible(instance);
            });

            $popper.one("click", ".popover_report_message", (e) => {
                const message_id = Number($(e.currentTarget).attr("data-message-id"));
                assert(message_lists.current !== undefined);
                const message = message_lists.current.get(message_id);
                assert(message !== undefined);
                message_report.show_message_report_modal(message);
                e.preventDefault();
                e.stopPropagation();
                popover_menus.hide_current_popover_if_visible(instance);
            });

            $popper.one("click", ".reaction_button", (e) => {
                const message_id = Number($(e.currentTarget).attr("data-message-id"));
                // Don't propagate the click event since `toggle_emoji_popover` opens a
                // emoji_picker which we don't want to hide after actions popover is hidden.
                e.stopPropagation();
                e.preventDefault();
                assert(instance.reference.parentElement !== null);
                emoji_picker.toggle_emoji_popover(instance.reference.parentElement, message_id, {
                    placement: "bottom",
                });
                popover_menus.hide_current_popover_if_visible(instance);
            });

            $popper.on("click", ".copy_link", (e) => {
                assert(e.currentTarget instanceof HTMLElement);
                clipboard_handler.popover_copy_link_to_clipboard(
                    instance,
                    $(e.currentTarget),
                    () => {
                        show_copied_confirmation(
                            the($(instance.reference).closest(".message_controls")),
                        );
                    },
                );
            });
        },
        onHidden(instance) {
            const $row = $(instance.reference).closest(".message_row");
            $row.removeClass("has_actions_popover");
            instance.destroy();
            popover_menus.popover_instances.message_actions = null;
            message_actions_popover_keyboard_toggle = false;
        },
    });
}
```

--------------------------------------------------------------------------------

---[FILE: message_delete.ts]---
Location: zulip-main/web/src/message_delete.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import render_delete_message_modal from "../templates/confirm_dialog/confirm_delete_message.hbs";

import * as channel from "./channel.ts";
import * as confirm_dialog from "./confirm_dialog.ts";
import * as dialog_widget from "./dialog_widget.ts";
import {$t_html} from "./i18n.ts";
import type {Message} from "./message_store.ts";
import * as people from "./people.ts";
import * as settings_data from "./settings_data.ts";
import {realm} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import * as ui_report from "./ui_report.ts";

let currently_deleting_messages: number[] = [];

export function is_message_sent_by_my_bot(message: Message): boolean {
    const user = people.get_by_user_id(message.sender_id);
    if (!user.is_bot || user.bot_owner_id === null) {
        // The message was not sent by a bot or the message was sent
        // by a cross-realm bot which does not have an owner.
        return false;
    }

    return people.is_my_user_id(user.bot_owner_id);
}

export function get_deletability(message: Message): boolean {
    if (message.type === "stream" && stream_data.is_stream_archived_by_id(message.stream_id)) {
        return false;
    }
    if (settings_data.user_can_delete_any_message()) {
        return true;
    }

    if (message.type === "stream") {
        const stream = stream_data.get_sub_by_id(message.stream_id);
        assert(stream !== undefined);

        const can_delete_any_message_in_channel =
            settings_data.user_has_permission_for_group_setting(
                stream.can_delete_any_message_group,
                "can_delete_any_message_group",
                "stream",
            );
        if (can_delete_any_message_in_channel) {
            return true;
        }
    }

    if (!message.sent_by_me && !is_message_sent_by_my_bot(message)) {
        return false;
    }
    if (message.locally_echoed) {
        return false;
    }
    if (!settings_data.user_can_delete_own_message()) {
        if (message.type !== "stream") {
            return false;
        }

        const stream = stream_data.get_sub_by_id(message.stream_id);
        assert(stream !== undefined);

        const can_delete_own_message_in_channel =
            settings_data.user_has_permission_for_group_setting(
                stream.can_delete_own_message_group,
                "can_delete_own_message_group",
                "stream",
            );
        if (!can_delete_own_message_in_channel) {
            return false;
        }
    }

    if (realm.realm_message_content_delete_limit_seconds === null) {
        // This means no time limit for message deletion.
        return true;
    }

    if (
        realm.realm_message_content_delete_limit_seconds + (message.timestamp - Date.now() / 1000) >
        0
    ) {
        return true;
    }
    return false;
}

export function delete_message(msg_id: number): void {
    const html_body = render_delete_message_modal();

    function do_delete_message(): void {
        currently_deleting_messages.push(msg_id);
        void channel.del({
            url: "/json/messages/" + msg_id,
            success() {
                currently_deleting_messages = currently_deleting_messages.filter(
                    (id) => id !== msg_id,
                );
                dialog_widget.hide_dialog_spinner();
                dialog_widget.close();
            },
            error(xhr) {
                currently_deleting_messages = currently_deleting_messages.filter(
                    (id) => id !== msg_id,
                );

                dialog_widget.hide_dialog_spinner();
                ui_report.error(
                    $t_html({defaultMessage: "Error deleting message"}),
                    xhr,
                    $("#dialog_error"),
                );
            },
        });
    }

    confirm_dialog.launch({
        html_heading: $t_html({defaultMessage: "Delete message?"}),
        html_body,
        help_link: "/help/delete-a-message#delete-a-message-completely",
        on_click: do_delete_message,
        loading_spinner: true,
    });
}

export function delete_topic(stream_id: number, topic_name: string, failures = 0): void {
    void channel.post({
        url: "/json/streams/" + stream_id + "/delete_topic",
        data: {
            topic_name,
        },
        success(data) {
            const {complete} = z.object({complete: z.boolean()}).parse(data);
            if (!complete) {
                if (failures >= 9) {
                    // Don't keep retrying indefinitely to avoid DoSing the server.
                    return;
                }

                failures += 1;
                /* When trying to delete a very large topic, it's
                   possible for the request to the server to
                   time out after making some progress. Retry the
                   request, so that the user can just do nothing and
                   watch the topic slowly be deleted.

                   TODO: Show a nice loading indicator experience.
                */
                delete_topic(stream_id, topic_name, failures);
            }
        },
    });
}
```

--------------------------------------------------------------------------------

````
