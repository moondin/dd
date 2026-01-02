---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 606
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 606 of 1290)

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

---[FILE: condense.ts]---
Location: zulip-main/web/src/condense.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import render_message_length_toggle from "../templates/message_length_toggle.hbs";

import {$t} from "./i18n.ts";
import * as message_flags from "./message_flags.ts";
import type {MessageList} from "./message_list.ts";
import * as message_lists from "./message_lists.ts";
import type {Message} from "./message_store.ts";
import * as message_viewport from "./message_viewport.ts";
import * as rows from "./rows.ts";
import {user_settings} from "./user_settings.ts";
import * as util from "./util.ts";

/*
This library implements two related, similar concepts:

- condensing, i.e. cutting off messages taller than about a half
  screen so that they aren't distractingly tall (and offering a button
  to uncondense them).

- Collapsing, i.e. taking a message and reducing its height to a
  single line, with a button to see the content.

*/

const state: {
    message_list: MessageList | undefined;
    has_unread_cutoff_by_message_id: Set<number>;
} = {
    message_list: undefined,
    has_unread_cutoff_by_message_id: new Set<number>(),
};

export function show_message_expander(
    $row: JQuery,
    tooltip_template_id: string | null = "message-expander-tooltip-template",
    toggle_button_label: string = $t({defaultMessage: "Show more"}),
): void {
    $row.find(".message_length_controller").html(
        render_message_length_toggle({
            toggle_type: "expander",
            label_text: toggle_button_label,
            tooltip_template_id,
        }),
    );
}

export function show_message_condenser(
    $row: JQuery,
    tooltip_template_id: string | null = "message-condenser-tooltip-template",
    toggle_button_label: string = $t({defaultMessage: "Show less"}),
): void {
    $row.find(".message_length_controller").html(
        render_message_length_toggle({
            toggle_type: "condenser",
            label_text: toggle_button_label,
            tooltip_template_id,
        }),
    );
}

export function hide_message_length_toggle($row: JQuery): void {
    $row.find(".message_length_controller").empty();
}

function condense_row($row: JQuery): void {
    const $content = $row.find(".message_content");
    $content.addClass("condensed");
    show_message_expander($row);
}

function uncondense_row($row: JQuery): void {
    const $content = $row.find(".message_content");
    $content.removeClass("condensed");
    show_message_condenser($row);
}

export function uncollapse(message: Message): void {
    // Uncollapse a message, restoring the condensed message "Show more" or
    // "Show less" button if necessary.
    message.collapsed = false;
    message_flags.save_uncollapsed(message);

    const process_row = function process_row($row: JQuery): void {
        const $content = $row.find(".message_content");
        $content.removeClass("collapsed");

        if (message.condensed === true) {
            // This message was condensed by the user, so re-show the
            // "Show more" button.
            condense_row($row);
        } else if (message.condensed === false) {
            // This message was un-condensed by the user, so re-show the
            // "Show less" button.
            uncondense_row($row);
        } else if ($content.hasClass("could-be-condensed")) {
            // By default, condense a long message.
            condense_row($row);
        } else {
            // This was a short message, no more need for a [More] link.
            hide_message_length_toggle($row);
        }
    };

    for (const list of message_lists.all_rendered_message_lists()) {
        const $rendered_row = list.get_row(message.id);
        if ($rendered_row.length > 0) {
            process_row($rendered_row);
        }
    }
}

export function collapse(message: Message): void {
    message.collapsed = true;

    if (message.locally_echoed) {
        // Trying to collapse a locally echoed message is
        // very rare, and in our current implementation the
        // server response overwrites the flag, so we just
        // punt for now.
        return;
    }

    message_flags.save_collapsed(message);

    const process_row = function process_row($row: JQuery): void {
        $row.find(".message_content").addClass("collapsed");
        show_message_expander($row);
    };

    for (const list of message_lists.all_rendered_message_lists()) {
        const $rendered_row = list.get_row(message.id);
        if ($rendered_row.length > 0) {
            process_row($rendered_row);
        }
    }
}

export function toggle_collapse(message: Message): void {
    if (message.is_me_message) {
        // Disabled temporarily because /me messages don't have a
        // styling for collapsing /me messages (they only recently
        // added multi-line support).  See also popover_menus_data.js.
        return;
    }

    // This function implements a multi-way toggle, to try to do what
    // the user wants for messages:
    //
    // * If the message is currently showing any "Show more" button, either
    //   because it was previously condensed or collapsed, fully display it.
    // * If the message is fully visible, either because it's too short to
    //   condense or because it's already uncondensed, collapse it

    assert(message_lists.current !== undefined);
    const $row = message_lists.current.get_row(message.id);
    if (!$row) {
        return;
    }

    const $content = $row.find(".message_content");
    const is_condensable = $content.hasClass("could-be-condensed");
    const is_condensed = $content.hasClass("condensed");
    if (message.collapsed) {
        if (is_condensable) {
            message.condensed = true;
            $content.addClass("condensed");
            show_message_expander($row);
        }
        uncollapse(message);
    } else {
        if (is_condensed) {
            message.condensed = false;
            $content.removeClass("condensed");
            show_message_condenser($row);
        } else {
            collapse(message);
        }
    }

    // Select and scroll to the message so that it is in the view.
    message_lists.current.select_id(message.id, {then_scroll: true});
}

function get_message_height(elem: HTMLElement): number {
    // This needs to be very fast. This function runs hundreds of times
    // when displaying a message feed view that has hundreds of message
    // history, which ideally should render in <100ms.
    return util.the($(elem).find(".message_content")).scrollHeight;
}

export function condense_and_collapse(elems: JQuery): void {
    if (message_lists.current === undefined) {
        return;
    }

    if (message_lists.current !== state.message_list) {
        state.message_list = message_lists.current;
        state.has_unread_cutoff_by_message_id = new Set();
    }

    // For unread messages, we allow them to expand to most of a
    // desktop monitor's height, with stricter limits for mobile web
    // devices, especially in landscape mode.
    //
    // About 10em is the header/footer, plus some buffer for being
    // able to see edges of adjacent messages.
    const header_footer_and_buffer_height = 12 * user_settings.web_font_size_px;
    const height_cutoff_unread = Math.max(
        35 * user_settings.web_font_size_px,
        message_viewport.height() - header_footer_and_buffer_height,
    );
    const height_cutoff_read = Math.max(
        35 * user_settings.web_font_size_px,
        0.65 * message_viewport.height(),
    );

    const rows_to_resize = [];
    for (const elem of elems) {
        const $content = $(elem).find(".message_content");

        if ($content.length !== 1) {
            // We could have a "/me did this" message or something
            // else without a `message_content` div.
            continue;
        }

        const message_id = rows.id($(elem));

        if (!message_id) {
            continue;
        }

        const message = message_lists.current.get(message_id);
        if (message === undefined) {
            continue;
        }

        const message_height = get_message_height(elem);

        rows_to_resize.push({
            elem,
            $content,
            message,
            message_height,
        });
    }

    // Note that we resize all the rows *after* we calculate if we should
    // resize them or not. This allows us to do all measurements before
    // changing the layout of the page, which is more performanant.
    // More information here: https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/#avoid-layout-thrashing
    for (const {elem, $content, message, message_height} of rows_to_resize) {
        // Track which messages were unread when initially rendered so that subsequent
        // re-renders don't collapse the message while user is reading it.
        if (message.unread) {
            state.has_unread_cutoff_by_message_id.add(message.id);
        }
        const height_cutoff = state.has_unread_cutoff_by_message_id.has(message.id)
            ? height_cutoff_unread
            : height_cutoff_read;
        const long_message = message_height > height_cutoff;
        if (long_message) {
            // All long messages are flagged as such.
            $content.addClass("could-be-condensed");
        } else {
            $content.removeClass("could-be-condensed");
        }

        // If message.condensed is defined, then the user has manually
        // specified whether this message should be expanded or condensed.
        if (message.condensed === true) {
            condense_row($(elem));
            continue;
        }

        if (message.condensed === false) {
            uncondense_row($(elem));
            continue;
        }

        if (long_message) {
            // By default, condense a long message.
            condense_row($(elem));
        } else {
            $content.removeClass("condensed");
            hide_message_length_toggle($(elem));
        }

        // Completely hide the message and replace it with a "Show more"
        // button if the user has collapsed it.
        if (message.collapsed) {
            $content.addClass("collapsed");
            show_message_expander($(elem));
        }
    }
}

export function initialize(): void {
    $("#message_feed_container").on("click", ".message_expander", function (this: HTMLElement, e) {
        // Expanding a message can mean either uncollapsing or
        // uncondensing it.
        const $row = $(this).closest(".message_row");
        const id = rows.id($row);
        assert(message_lists.current !== undefined);
        const message = message_lists.current.get(id);
        assert(message !== undefined);
        const $content = $row.find(".message_content");
        if (message.collapsed) {
            // Uncollapse.
            uncollapse(message);
        } else if ($content.hasClass("condensed")) {
            // Uncondense (show the full long message).
            message.condensed = false;
            uncondense_row($row);
        }
        // Select and scroll to the message so that it is in the view.
        message_lists.current.select_id(message.id, {then_scroll: true});
        e.stopPropagation();
        e.preventDefault();
    });

    $("#message_feed_container").on("click", ".message_condenser", function (this: HTMLElement, e) {
        const $row = $(this).closest(".message_row");
        const id = rows.id($row);
        assert(message_lists.current !== undefined);
        const message = message_lists.current.get(id);
        assert(message !== undefined);
        message.condensed = true;
        condense_row($row);
        // Select and scroll to the message so that it is in the view.
        message_lists.current.select_id(message.id, {then_scroll: true});
        e.stopPropagation();
        e.preventDefault();
    });
}
```

--------------------------------------------------------------------------------

---[FILE: confirm_dialog.ts]---
Location: zulip-main/web/src/confirm_dialog.ts

```typescript
import * as dialog_widget from "./dialog_widget.ts";
import type {DialogWidgetConfig} from "./dialog_widget.ts";
import {$t_html} from "./i18n.ts";

export function launch(conf: DialogWidgetConfig): string {
    return dialog_widget.launch({
        close_on_submit: true,
        focus_submit_on_open: true,
        html_submit_button: $t_html({defaultMessage: "Confirm"}),
        ...conf,
    });
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_participants.ts]---
Location: zulip-main/web/src/conversation_participants.ts

```typescript
/* We track participants in a narrow here by updating
 * the data structure when a message is added / removed
 * from MessageListData.
 */

import type {Message} from "./message_store.ts";
import * as people from "./people.ts";

export class ConversationParticipants {
    humans: Set<number>;
    bots: Set<number>;

    constructor(messages: Message[]) {
        this.humans = new Set();
        this.bots = new Set();
        this.add_from_messages(messages);
    }

    add_from_messages(messages: Message[]): void {
        for (const msg of messages) {
            if (msg.sent_by_me) {
                this.humans.add(msg.sender_id);
                continue;
            }

            const sender = people.maybe_get_user_by_id(msg.sender_id);
            if (!sender) {
                // `sender` is always defined but this checks helps use
                // avoid patching all the tests.
                continue;
            }

            if (sender.is_bot) {
                this.bots.add(msg.sender_id);
            } else {
                this.humans.add(msg.sender_id);
            }
        }
    }
    // We don't support removal of a message due to deletion or message moves,
    // because we aren't tracking the set of message IDs for each participant,
    // so we currently just rebuild.

    visible(): Set<number> {
        return new Set(
            [...this.humans].filter((user_id) =>
                people.is_displayable_conversation_participant(user_id),
            ),
        );
    }
}
```

--------------------------------------------------------------------------------

---[FILE: copied_tooltip.ts]---
Location: zulip-main/web/src/copied_tooltip.ts

```typescript
import $ from "jquery";
import * as tippy from "tippy.js";

import {$t} from "./i18n.ts";

function show_copied_tooltip(
    copy_button: Element,
    custom_content?: string,
    on_hide_callback?: () => void,
): tippy.Instance {
    // Display a tooltip to notify the user the message or code was copied.
    const instance = tippy.default(copy_button, {
        placement: "top",
        appendTo: () => document.body,
        onUntrigger(instance) {
            instance.destroy();
        },
        onHide() {
            if (on_hide_callback) {
                on_hide_callback();
            }
        },
    });
    instance.setContent(custom_content ?? $t({defaultMessage: "Copied!"}));
    instance.show();
    return instance;
}

function show_check_icon(copy_button: Element): void {
    $(copy_button).addClass("copy-button-success");
    $(copy_button).find(".zulip-icon").removeClass("zulip-icon-copy").addClass("zulip-icon-check");
}

function remove_check_icon(copy_button: Element): void {
    $(copy_button).removeClass("copy-button-success");
    $(copy_button).find(".zulip-icon").addClass("zulip-icon-copy").removeClass("zulip-icon-check");
}

export function show_copied_confirmation(
    copy_button: Element,
    opts?: {
        custom_content?: string;
        show_check_icon?: boolean;
        timeout_in_ms?: number;
        on_hide_callback?: () => void;
    },
): void {
    const instance = show_copied_tooltip(copy_button, opts?.custom_content, opts?.on_hide_callback);
    if (opts?.show_check_icon) {
        show_check_icon(copy_button);
    }

    setTimeout(() => {
        if (!instance.state.isDestroyed) {
            instance.destroy();
        }
        if (opts?.show_check_icon) {
            remove_check_icon(copy_button);
        }
    }, opts?.timeout_in_ms ?? 1000);
}
```

--------------------------------------------------------------------------------

---[FILE: copy_messages.ts]---
Location: zulip-main/web/src/copy_messages.ts

```typescript
// Because this logic is heavily focused around managing browser quirks,
// this module is currently tested manually and via
// by web/e2e-tests/copy_messages.test.ts, not with node tests.
import $ from "jquery";
import assert from "minimalistic-assert";

import * as message_lists from "./message_lists.ts";
import * as rows from "./rows.ts";

function find_boundary_tr(
    $initial_tr: JQuery,
    iterate_row: ($tr: JQuery) => JQuery,
): [number, boolean] | undefined {
    let j;
    let skip_same_td_check = false;
    let $tr = $initial_tr;

    // If the selection boundary is somewhere that does not have a
    // parent tr, we should let the browser handle the copy-paste
    // entirely on its own
    if ($tr.length === 0) {
        return undefined;
    }

    // If the selection boundary is on a table row that does not have an
    // associated message id (because the user clicked between messages),
    // then scan downwards until we hit a table row with a message id.
    // To ensure we can't enter an infinite loop, bail out (and let the
    // browser handle the copy-paste on its own) if we don't hit what we
    // are looking for within 10 rows.
    for (j = 0; !$tr.is(".message_row") && j < 10; j += 1) {
        $tr = iterate_row($tr);
    }
    if (j === 10) {
        return undefined;
    } else if (j !== 0) {
        // If we updated tr, then we are not dealing with a selection
        // that is entirely within one td, and we can skip the same td
        // check (In fact, we need to because it won't work correctly
        // in this case)
        skip_same_td_check = true;
    }
    return [rows.id($tr), skip_same_td_check];
}

function construct_recipient_header($message_row: JQuery): JQuery {
    const message_header_content = rows
        .get_message_recipient_header($message_row)
        .text()
        .replaceAll(/\s+/g, " ")
        .replace(/^\s/, "")
        .replace(/\s$/, "");
    return $("<p>").append($("<strong>").text(message_header_content));
}
/*
The techniques we use in this code date back to
2013 and may be obsolete today (and may not have
been even the best workaround back then).

https://github.com/zulip/zulip/commit/fc0b7c00f16316a554349f0ad58c6517ebdd7ac4

The idea is that we build a temp div, let jQuery process the
selection, then restore the selection on a zero-second timer back
to the original selection.

Do not be afraid to change this code if you understand
how modern browsers deal with copy/paste.  Just test
your changes carefully.
*/
function construct_copy_div($div: JQuery, start_id: number, end_id: number): void {
    if (message_lists.current === undefined) {
        return;
    }
    const copy_rows = rows.visible_range(start_id, end_id);

    const $start_row = copy_rows[0];
    assert($start_row !== undefined);
    const $start_recipient_row = rows.get_message_recipient_row($start_row);
    const start_recipient_row_id = rows.id_for_recipient_row($start_recipient_row);
    let should_include_start_recipient_header = false;
    let last_recipient_row_id = start_recipient_row_id;

    for (const $row of copy_rows) {
        const recipient_row_id = rows.id_for_recipient_row(rows.get_message_recipient_row($row));
        // if we found a message from another recipient,
        // it means that we have messages from several recipients,
        // so we have to add new recipient's bar to final copied message
        // and wouldn't forget to add start_recipient's bar at the beginning of final message
        if (recipient_row_id !== last_recipient_row_id) {
            construct_recipient_header($row).appendTo($div);
            last_recipient_row_id = recipient_row_id;
            should_include_start_recipient_header = true;
        }
        const message = message_lists.current.get(rows.id($row));
        assert(message !== undefined);
        const $content = $(message.content);
        $content.first().prepend(
            $("<span>")
                .text(message.sender_full_name + ": ")
                .contents(),
        );
        $div.append($content);
    }

    if (should_include_start_recipient_header) {
        construct_recipient_header($start_row).prependTo($div);
    }
}

// We want to grab the closest katex span up the tree
// in cases where we can resolve the selected katex expression
// from a math block into an inline expression.
// The returned element from this function
// is the one we call 'closest' on.
function get_nearest_html_element(node: Node | null): Element | null {
    if (node === null || node instanceof Element) {
        return node;
    }
    return node.parentElement;
}

// selection_element will be either the start_element or end_element
function expand_range_based_on_katex_parent(
    selection_element: Element,
    is_range_start: boolean,
    range: Range,
): void {
    // Here, we have three cases:
    // 1. This element lies within a math block expression i.e. within a  `.katex-display`
    // 2. This element lies within an inline math expression i.e. inside a `.katex` span
    // with no `.katex-display` parent for that `.katex`
    // 3. This element does not lie within a math expression, we directly return without expansion.
    // We cascade through these cases, expanding the range and prioritizing math blocks over expressions
    // in case we encounter them.

    const is_within_math_block = selection_element.closest(".katex-display") !== null;
    const is_within_math_expression = selection_element.closest(".katex") !== null;
    if (!is_within_math_block && !is_within_math_expression) {
        return;
    }
    if (is_within_math_block) {
        // One might think that this will break in case of empty katex-display(s)
        // being the start or end node which is/are created when we insert
        // some extra newlines within a math block.
        // However, is it not possible to select those empty katex-displays
        // as per my observation on Chrome and Firefox.
        if (is_range_start) {
            range.setStart(selection_element.closest(".katex-display")!, 0);
        } else {
            // The offset 1 selects the only child of `.katex-display`
            // which is `.katex`.
            range.setEnd(selection_element.closest(".katex-display")!, 1);
        }
    } else {
        if (is_range_start) {
            range.setStart(selection_element.closest(".katex")!, 0);
        } else {
            // The offset 2 selects the two children of `.katex`
            // namely `.katex-mathml` and `.katex-html`
            range.setEnd(selection_element.closest(".katex")!, 2);
        }
    }
}

/*
    Our paste behavior for KaTeX relies on processing the MathML
    annotations generated by KaTeX in `<annotation>` tags. This
    function is responsible for expanding selections of math copied
    out of Zulip to ensure the annotations are included in what is
    copied, so that it pastes nicely.

    We expand the selection range only in the following cases:

    1. Either the startContainer or endContainer or both are within an
       inline expression where the range covers one or more math
       expressions.
    2. Either the startContainer, endContainer, or both are within a
       math block where the range covers one or more math expressions.

    In principle, we only need to expand the start of the selection
    range for the cases where multiple expressions are selected
    because the end of the range always contains the annotation
    element in case it lies within the math block.

    But, we still expand the end of the range to select the complete
    expression, since our paste handler has no way to split the
    annotation, so we'll always be converting entire expressions.
*/
function improve_katex_selection_range(range: Range): void {
    const start_element = get_nearest_html_element(range.startContainer);
    const end_element = get_nearest_html_element(range.endContainer);
    if (!end_element || !start_element) {
        return;
    }

    // Only perform expansion if either the start or end element
    // is itself a `.katex` element or is contained within one.
    if (end_element.closest(".katex") === null && start_element.closest(".katex") === null) {
        return;
    }

    expand_range_based_on_katex_parent(start_element, true, range);
    expand_range_based_on_katex_parent(end_element, false, range);
}

function maybe_update_range_for_code_blocks(range: Range, ev: ClipboardEvent): boolean {
    const element = get_nearest_html_element(range.startContainer)?.parentElement;
    const is_selection_within_code_element = element?.nodeName === "CODE";
    if (is_selection_within_code_element) {
        const start = range.startContainer.parentElement?.closest(".codehilite");
        const end = range.endContainer.parentElement?.closest(".codehilite");

        const is_selection_within_codehilite_element = start && end;
        // Selections that go beyond the code block always end up containing
        // the outer `.codehilite` div, so expansion is not required for those cases.
        if (is_selection_within_codehilite_element) {
            // We create a new element that contains selected content
            // wrapped inside a `.codehilite` element containing the language metadata
            // This element is then stored in the clipboard.
            const clone: Node = start.cloneNode(false);
            assert(clone instanceof HTMLElement);
            const pre = document.createElement("pre");
            const code = document.createElement("code");
            pre.append(code);
            code.append(range.cloneContents());
            clone.append(pre);
            ev.clipboardData?.setData("text/html", clone.outerHTML);
            ev.clipboardData?.setData("text", clone.textContent ?? "");
            return true;
        }
    }
    return false;
}

export function copy_handler(ev: ClipboardEvent): boolean {
    // This is the main handler for copying message content via
    // `Ctrl+C` in Zulip (note that this is totally independent of the
    // "select region" copy behavior on Linux; that is handled
    // entirely by the browser, our HTML layout, and our use of the
    // no-select CSS classes).  We put considerable effort
    // into producing a nice result that pastes well into other tools.
    // Our user-facing specification is the following:
    //
    // * If the selection is contained within a single message, we
    //   want to just copy the portion that was selected, which we
    //   implement by letting the browser handle the Ctrl+C event.
    //
    // * Otherwise, we want to copy the bodies of all messages that
    //   were partially covered by the selection.

    const selection = window.getSelection();
    assert(selection !== null);

    const analysis = analyze_selection(selection);
    const start_id = analysis.start_id;
    const end_id = analysis.end_id;
    const skip_same_td_check = analysis.skip_same_td_check;

    if (start_id === undefined || end_id === undefined || start_id > end_id) {
        // In this case either the starting message or the ending
        // message is not defined, so this is definitely not a
        // multi-message selection and we can let the browser handle
        // the copy.
        //
        // Also, if our logic is not sound about the selection range
        // (start_id > end_id), we let the browser handle the copy.
        //
        // NOTE: `startContainer (~ start_id)` and `endContainer (~ end_id)`
        // of a `Range` are always from top to bottom in the DOM tree, independent
        // of the direction of the selection.
        // TODO: Add a reference for this statement, I just tested
        // it in console for various selection directions and found this
        // to be the case not sure why there is no online reference for it.
        return false;
    }

    if (!skip_same_td_check && start_id === end_id) {
        // Check whether the selection both starts and ends in the
        // same message and let the browser handle the copying.

        // Firefox uses multiple ranges when selecting multiple messages.
        // See https://drafts.csswg.org/css-ui-4/#valdef-user-select-none
        // Instead of relying on Selection API's anchorNode and focusNode,
        // we iterate over all ranges and expand them if needed.
        //
        // The reason is that anchorNode and focusNode only reflect the first range,
        // which becomes an issue in Firefox. When the selection spans multiple ranges,
        // for example, due to `user-select: none` elements in between the selection,
        // Firefox creates disjoint ranges but only sets anchor/focus for the first one.
        //
        // So to handle multi-range selections correctly (especially in Firefox),
        // we process all ranges individually.
        let custom_handle_copy = false;
        for (let i = 0; i < selection.rangeCount; i += 1) {
            improve_katex_selection_range(selection.getRangeAt(i));

            if (maybe_update_range_for_code_blocks(selection.getRangeAt(i), ev)) {
                // This will not disturb katex expansions because the clipboard
                // altering code will only be triggered if and only if the selection
                // lies completely within a `.codehilite` block.
                // We let the browser handle the copy event for all other cases.
                custom_handle_copy = true;
            }
        }
        return custom_handle_copy;
    }

    // We've now decided to handle the copy event ourselves.
    //
    // We construct a temporary div for what we want the copy to pick up.
    // We construct the div only once, rather than for each range as we can
    // determine the starting and ending point with more confidence for the
    // whole selection. When constructing for each `Range`, there is a high
    // chance for overlaps between same message ids, avoiding which is much
    // more difficult since we can get a range (start_id and end_id) for
    // each selection `Range`.
    const $div = $("<div>");
    construct_copy_div($div, start_id, end_id);

    const html_content = $div.html().trim();
    const plain_text = $div.text().trim();
    ev.clipboardData?.setData("text/html", html_content);
    ev.clipboardData?.setData("text/plain", plain_text);

    // Tell the keyboard code that we did the copy ourselves, and thus
    // the browser should not handle the copy.
    return true;
}

export function analyze_selection(selection: Selection): {
    ranges: Range[];
    start_id: number | undefined;
    end_id: number | undefined;
    skip_same_td_check: boolean;
} {
    // Here we analyze our selection to determine if part of a message
    // or multiple messages are selected.
    //
    // Firefox and Chrome handle selection of multiple messages
    // differently. Firefox typically creates multiple ranges for the
    // selection, whereas Chrome typically creates just one.
    //
    // Our goal in the below loop is to compute and be prepared to
    // analyze the combined range of the selections, and copy their
    // full content.

    let i;
    let range;
    const ranges = [];
    let $startc;
    let $endc;
    let $initial_end_tr;
    let start_id;
    let end_id;
    let start_data;
    let end_data;
    // skip_same_td_check is true whenever we know for a fact that the
    // selection covers multiple messages (and thus we should no
    // longer consider letting the browser handle the copy event).
    let skip_same_td_check = false;

    for (i = 0; i < selection.rangeCount; i += 1) {
        range = selection.getRangeAt(i);
        ranges.push(range);

        $startc = $(range.startContainer);
        start_data = find_boundary_tr(
            $startc
                .parents(".selectable_row, .message_header")
                .not(".overlay-message-header")
                .first(),
            ($row) => $row.next(),
        );
        if (start_data === undefined) {
            // Skip any selection sections that don't intersect a message.
            continue;
        }
        // start_id is the Zulip message ID of the first message
        // touched by the selection.
        start_id ??= start_data[0];

        $endc = $(range.endContainer);
        $initial_end_tr = get_end_tr_from_endc($endc);
        end_data = find_boundary_tr($initial_end_tr, ($row) => $row.prev());

        if (end_data === undefined) {
            // Skip any selection sections that don't intersect a message.
            continue;
        }
        if (end_data[0] !== undefined) {
            end_id = end_data[0];
        }

        if (start_data[1] || end_data[1]) {
            // If the find_boundary_tr call for either the first or
            // the last message covered by the selection
            skip_same_td_check = true;
        }
    }

    return {
        ranges,
        start_id,
        end_id,
        skip_same_td_check,
    };
}

function get_end_tr_from_endc($endc: JQuery<Node>): JQuery {
    if ($endc.attr("id") === "bottom_whitespace" || $endc.attr("id") === "compose_close") {
        // If the selection ends in the bottom whitespace, we should
        // act as though the selection ends on the final message.
        // This handles the issue that Chrome seems to like selecting
        // the compose_close button when you go off the end of the
        // last message
        return rows.last_visible();
    }

    // Sometimes (especially when three click selecting in Chrome) the selection
    // can end in a hidden element in e.g. the next message, a date divider.
    // We can tell this is the case because the selection isn't inside a
    // `messagebox-content` div, which is where the message text itself is.
    // TODO: Ideally make it so that the selection cannot end there.
    // For now, we find the message row directly above wherever the
    // selection ended.
    if ($endc.closest(".messagebox-content").length === 0) {
        // If the selection ends within the message following the selected
        // messages, go back to use the actual last message.
        if ($endc.parents(".message_row").length > 0) {
            const $parent_msg = $endc.parents(".message_row").first();
            return $parent_msg.prev(".message_row");
        }
        // If it's not in a .message_row, it's probably in a .message_header and
        // we can use the last message from the previous recipient_row.
        // NOTE: It is possible that the selection started and ended inside the
        // message header and in that case we would be returning the message before
        // the selected header if it exists, but that is not the purpose of this
        // function to handle.
        if ($endc.parents(".message_header").length > 0) {
            const $overflow_recipient_row = $endc.parents(".recipient_row").first();
            return $overflow_recipient_row.prev(".recipient_row").children(".message_row").last();
        }
        // If somehow we get here, do the default return.
    }

    return $endc.parents(".selectable_row").first();
}

export function initialize(): void {
    document.addEventListener("copy", (ev) => {
        if (copy_handler(ev)) {
            ev.preventDefault();
        }
    });
}
```

--------------------------------------------------------------------------------

---[FILE: csrf.ts]---
Location: zulip-main/web/src/csrf.ts

```typescript
import $ from "jquery";

export let csrf_token: string | undefined;

$(() => {
    // This requires that we used Jinja2's {% csrf_input %} somewhere on the page.
    const $csrf_input = $('input[name="csrfmiddlewaretoken"]');
    csrf_token = $csrf_input.attr("value");
    if (csrf_token === undefined) {
        return;
    }

    $.ajaxSetup({
        beforeSend(xhr: JQuery.jqXHR, settings: JQuery.AjaxSettings) {
            if (settings.url === undefined || csrf_token === undefined) {
                throw new Error("settings.url and/or csrf_token are missing.");
            }

            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        },
    });
});
```

--------------------------------------------------------------------------------

---[FILE: css_variables.ts]---
Location: zulip-main/web/src/css_variables.ts

```typescript
// Media query breakpoints according to Bootstrap 4.5
const xs = 0;
const sm = 576;
const md = 768;
const lg = 992;
const xl = 1200;

// Breakpoints for mobile devices used by Google Chrome as of Version 86
const ml = 425; // Mobile large
const mm = 375; // Mobile medium
const ms = 320; // Mobile small

// Breakpoints for middle column
const mc = 849; // Middle column as wide as it appears after the `sm` breakpoint

// Base em unit for container_breakpoints conversion
const base_em_px = 16;

// Used for main settings overlay and stream/subscription settings overlay
// measured as the width of the overlay itself, not the width of the full
// screen. 800px is the breakpoint at the 14px legacy font size, scaled with
// em to user-chosen font-size.
const settings_overlay_sidebar_collapse_breakpoint = 800;

// Breakpoint for hiding message action buttons
const message_actions_hide_width = 730;

export const media_breakpoints = {
    xs_min: xs + "px",
    sm_min: sm + "px",
    md_min: md + "px",
    mc_min: mc + "px",
    lg_min: lg + "px",
    xl_min: xl + "px",
    ml_min: ml + "px",
    mm_min: mm + "px",
    ms_min: ms + "px",
    short_navbar_cutoff_height: "600px",
    settings_overlay_sidebar_collapse_breakpoint:
        settings_overlay_sidebar_collapse_breakpoint / 14 + "em",
    message_actions_hide_width_min: message_actions_hide_width + "px",
};

export const container_breakpoints = {
    cq_xl_min: xl / base_em_px + "em",
    cq_lg_min: lg / base_em_px + "em",
    cq_mc_min: mc / base_em_px + "em",
    cq_md_min: md / base_em_px + "em",
    cq_ml_min: ml / base_em_px + "em",
    cq_sm_min: sm / base_em_px + "em",
    cq_mm_min: mm / base_em_px + "em",
    cq_message_actions_hide_width_min: message_actions_hide_width / base_em_px + "em",
};

export const media_breakpoints_num = {
    xs,
    sm,
    md,
    mc,
    lg,
    xl,
    ml,
    mm,
    ms,
    settings_overlay_sidebar_collapse_breakpoint,
    message_actions_hide_width,
};
```

--------------------------------------------------------------------------------

````
