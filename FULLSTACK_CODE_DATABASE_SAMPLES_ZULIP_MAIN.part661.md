---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 661
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 661 of 1290)

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

---[FILE: rtl.ts]---
Location: zulip-main/web/src/rtl.ts

```typescript
import _ from "lodash";

// How to determine the direction of a paragraph (P1-P3): https://www.unicode.org/reports/tr9/tr9-35.html#The_Paragraph_Level
// Embedding level: https://www.unicode.org/reports/tr9/tr9-35.html#BD2
// How to find the matching PDI for an isolation initiator: https://www.unicode.org/reports/tr9/tr9-35.html#BD9
// Bidirectional character types: https://www.unicode.org/reports/tr9/tr9-35.html#Table_Bidirectional_Character_Types

// Ranges data is extracted from: https://www.unicode.org/Public/9.0.0/ucd/extracted/DerivedBidiClass.txt
// References:
// https://www.unicode.org/reports/tr44/tr44-18.html#UnicodeData.txt
// https://www.unicode.org/reports/tr44/tr44-18.html#Extracted_Properties_Table
// https://www.unicode.org/Public/9.0.0/ucd/UnicodeData.txt
// https://www.unicode.org/Public/9.0.0/ucd/extracted/DerivedBidiClass.txt

/**
 * Splits {@link raw} into parts of length {@link part_length},
 * and then converts each part to a character using simple base
 * conversion with the digits {@link digits}.
 * @param {string} digits
 * @param {number} part_length
 * @param {string} raw
 * @returns {number[]}
 */
function convert_from_raw(digits: string, part_length: number, raw: string): number[] {
    const result = [];
    for (let i = 0; i < raw.length; ) {
        let t = 0;
        for (let j = 0; j < part_length; j += 1) {
            t = t * digits.length + digits.indexOf(raw.charAt(i));
            i += 1;
        }
        result.push(t);
    }
    return result;
}

/** Isolate initiator characters. */
const i_chars = new Set([0x2066, 0x2067, 0x2068]);
/** Pop directional isolate character. */
const pdi_chars = new Set([0x2069]);
/** The digits that are used for base conversions from base 92. */
const digits =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&()*+,-./:;<=>?@[]^_`{|}~';
/**
 * Ranges of strong non-left-to-right characters (right-to-left, and arabic-letter).
 *
 * The ranges are stored as pairs of characters, the first
 * character of the range, and the last character of the range.
 * All ranges are concatenated together and stored here.
 */
const rl_ranges = [
    ...convert_from_raw(
        digits,
        2,
        'fIfIf}f}g0g0g3g3g6g6g8g"g,g,g/g/g;g;g~hKh?h[h^j1jhjijqjrjCjYj!j~krlplBm2mcmdmimJmOmOmYmYm#m#m*nknooP|j|j',
    ),
    ...convert_from_raw(
        digits,
        3,
        '7S)7S)7S+7S>7S@7YZ7Y#7!n7!U7!(7!*7!+7#07$O7}U81%81(84g84k84k84n84r84w84+84/84<84>86Y86"87Q87Y8gv8g"8k=e)]e,fe,ne-De-Le|je|mf0f',
    ),
];
/**
 * Ranges of strong left-to-right characters.
 *
 * The ranges are stored as pairs of characters, the first
 * character of the range, and the last character of the range.
 * All ranges are concatenated together and stored here.
 */
const lr_ranges = [
    ...convert_from_raw(
        digits,
        2,
        '0$0}151u1<1<1|1|2222282u2w2!2#7Q7T7Z7:7;80848e8e9Q9T9W9$9&9+9.9.9:b1b3cOcWfBfDfEp7pZp"p"p$p(p;p>p@p]q0q9qcqEqGr7r9rcrhrorqrJrMrZr#r*r,r:r=sHsJsMsPsSsVsWs!s#s%t3t6t8tatktnt=t?t]t}t}u1u4u6upusuEuGuUuWvnvpvqvsvsvxvEvGvNvPvZv#w1w3w"w$w:w<xmxvxzxBy5y9ydyhyhymysyvyFyIy"y+y,y.zDzFzTzWz;z>AgAiA>A^B0B2BlBoCxCzCFCJCJCLDIDKDLDTDWDYD%D/E>E@E[E}E}F1FbFiF~G2GsGuGuGwGwGCG{HbHbHhHhHkHoHAHAH-H?H[J0J5J5JcJcJfJgJjJHJKJNJRJ(J-J^J`J{J~K4K6KkKmR>R]SDSOTXTZ!T!V!@!^#h#l#N#R#?#]$l$o$`$}$}%6%d%f%g%s%y%A%A%C%T%%%+%`(k(n(U(W)[)`)}*1*9*b*g*k*n*p*r*u+|,w,S,V,W,Y-p-r-r-z-z-B-B-D-E-N-S-$-%-(.n.D/b/g/"/$/$/+/+/-/;/=:q:A:L:O:?:_:`:}:};2;V;X;X;!;#;%;%;*<z<I<J<M>f>j>j>x>x>F>I>K>P>R>T>W@+[y[C[I{s{u{u{y{I{M{Y{#{:{>|0|3|3|i|i}p}r}D}D}T}+~Z~/~<~<~[~[',
    ),
    ...convert_from_raw(
        digits,
        3,
        '0~_10310510510910d10k10k10m10m10o10o10q10t10v10F10I10L10R10V10!10"10>11s11w11z15}16%17117118f18f18T18=18~19j19>1a$1fU1fU1js1m71s]1s^1tq1tr1t!1t#1t;1t;1t_1uj1uo1w]1w~1x21x61xc1xk1yS1yU1zX1A)1Bz1B!1B!1CY1C+1Fa1Fz1FM1FP1FV1FX1F^1G11G61G71G91Gd1Gg1Gk1Go1Hk1Hp1Hr1Ht1Iq1Is1KD1K:1LE1LH1L~1Mg1MH1ML1N41Nk1Nv1NA1Pi1Pn1Qt1Qw1Q!1Q#2wv2x44|[4}L52452853a53s53V53Y54L54O54"55656f56h57J57L57N57P57S57U57>57[57[57{58758a58&58,59T59W59[5aa5aZ5a*5b25be5bX5b"5ci5ck5cl5cq5cr5ct5c(5c*5dI5dP5dQ5dT5dU5dX5d*5d,5d=5d?5ez5eB5e`5e|5e|5f15f25f55f95fc5fc5fe5fT5fW5f$5f&5is5iu5iv5ix5iA5iC7S(7"67"b7""7""7"[7"[7"{7"~7$Q7$Q7$^7%i7%p7%O7%!7&~7(77(77(f7(f7(w7+c7+e7+/7,Z7,"7,:7,=7,?7->7-@7:v7:Y7;|7<37}T8k>8k>8k@8lH8lX8l)8l}8mm8mq8m.8m=8m>8m[8nX8n"8o68oc8oc8ol8o@8o]8p38p68pV8p&8p;8p?8q_8q}8q~8r18r18r48r98rb8s<8s>8s@8s~8tj8tm8t=8t?8t[8t^8ut8uB8uD8uJ8wT8w#8w$8w)8w)8w+8x_8y18y18y38y68y98y98yc8A$8A*8A/8A<8A<8A?8Bf8Bi8Ca8Cj8Ck8Cm8Cm8Cp8CT8C)8DC8DE8DE8DG8DH8DO8DO8DQ8EY8E#8E$8E*8E*8E:8S+8S=8S=8S_8T;8U88U98Uh8Uh8Uk8Uk8Una|[a||a}Ta}"ba*ba/dFgdFjdFjdFoe72e76e7ee7ve7we7Ee7)e7.e8"e9GebHecDemiemkem:em<enGenIeo8eoaeo%eo(eo;epAeu`evPevSewdewkewmewzewBewWew#ew#ew>eLXeL&eL&eL^eL_eM2eM2eM5eM5eMbe)[f0Yf0"f1,f1[f27f28f2of2of2Ef2Ef2<f2`f39f49f4cf8LfjffjrfjFfjHfjPfjXfk]fl3fl|fmDfmQfmTfnkfnrfnCfnHfn]fn~foufpzfpPfpPfpYfp&fp)fp*fp[fp[fq4fq7fqnfqTfq.frrfrtfIZfI#nl1nl4u|xu|AC$$C$(KG5KG8SiBSiEZ_)Z_,)"9)"c;DF;DI^f-',
    ),
    ...convert_from_raw(digits, 4, "0^f:10]d10]g18YJ18YM1gA;1g?A1odh1odk1v?N1v?Q1DV?1DV]1DV]"),
];

/**
 * Gets a character and returns a simplified version of its bidirectional class.
 * @param {number} ch A character to get its bidirectional class.
 * @returns {'I' | 'PDI' | 'R' | 'L' | 'Other'}
 */
function get_bidi_class(ch: number): "I" | "PDI" | "R" | "L" | "Other" {
    if (i_chars.has(ch)) {
        return "I"; // LRI, RLI, FSI
    }
    if (pdi_chars.has(ch)) {
        return "PDI";
    }
    let i = _.sortedIndex(rl_ranges, ch);
    if (i < rl_ranges.length && (rl_ranges[i] === ch || i % 2 === 1)) {
        return "R"; // R, AL
    }
    i = _.sortedIndex(lr_ranges, ch);
    if (i < lr_ranges.length && (lr_ranges[i] === ch || i % 2 === 1)) {
        return "L";
    }
    return "Other";
}

/**
 * Gets the direction that should be used to show the string.
 * @param {string} str The string to get its direction.
 * @returns {'ltr' | 'rtl'}
 */
export function get_direction(str: string): "ltr" | "rtl" {
    let isolations = 0;
    for (const ch of str) {
        const bidi_class = get_bidi_class(ch.codePointAt(0)!);
        switch (bidi_class) {
            case "I":
                // LRI, RLI, FSI
                isolations += 1;
                break;
            case "PDI":
                if (isolations > 0) {
                    isolations -= 1;
                }
                break;
            case "R":
                // R, AL
                if (isolations === 0) {
                    return "rtl";
                }
                break;
            case "L":
                if (isolations === 0) {
                    return "ltr";
                }
                break;
        }
    }
    return "ltr";
}

export function set_rtl_class_for_textarea($textarea: JQuery<HTMLTextAreaElement>): void {
    // Set the rtl class if the text has an rtl direction, remove it otherwise
    let text = $textarea.val()!;
    if (text.startsWith("```quote")) {
        text = text.slice(8);
    }
    if (get_direction(text) === "rtl") {
        $textarea.addClass("rtl");
    } else {
        $textarea.removeClass("rtl");
    }
}
```

--------------------------------------------------------------------------------

---[FILE: saved_snippets.ts]---
Location: zulip-main/web/src/saved_snippets.ts

```typescript
import * as blueslip from "./blueslip.ts";
import type {Option} from "./dropdown_widget.ts";
import {$t} from "./i18n.ts";
import type {StateData} from "./state_data.ts";
import * as util from "./util.ts";

export type SavedSnippet = {
    id: number;
    title: string;
    content: string;
    date_created: number;
};

let saved_snippets_dict: Map<number, SavedSnippet>;

export function get_saved_snippet_by_id(saved_snippet_id: number): SavedSnippet | undefined {
    const saved_snippet = saved_snippets_dict.get(saved_snippet_id);
    if (saved_snippet === undefined) {
        blueslip.error("Could not find saved snippet", {saved_snippet_id});
        return undefined;
    }
    return saved_snippet;
}

export function update_saved_snippet_dict(saved_snippet: SavedSnippet): void {
    saved_snippets_dict.set(saved_snippet.id, saved_snippet);
}

export function remove_saved_snippet(saved_snippet_id: number): void {
    saved_snippets_dict.delete(saved_snippet_id);
}

export function get_options_for_dropdown_widget(): Option[] {
    const saved_snippets = [...saved_snippets_dict.values()];
    saved_snippets.sort((a, b) => util.strcmp(a.title.toLowerCase(), b.title.toLowerCase()));
    const options = saved_snippets.map((saved_snippet) => ({
        unique_id: saved_snippet.id,
        name: saved_snippet.title,
        description: saved_snippet.content,
        bold_current_selection: true,
        has_delete_icon: true,
        has_edit_icon: true,
        delete_icon_label: $t({defaultMessage: "Delete snippet"}),
        edit_icon_label: $t({defaultMessage: "Edit snippet"}),
    }));

    return options;
}

export const initialize = (params: StateData["saved_snippets"]): void => {
    saved_snippets_dict = new Map<number, SavedSnippet>(
        params.saved_snippets.map((s) => [s.id, s]),
    );
};
```

--------------------------------------------------------------------------------

---[FILE: saved_snippets_ui.ts]---
Location: zulip-main/web/src/saved_snippets_ui.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_add_saved_snippet_modal from "../templates/add_saved_snippet_modal.hbs";
import render_confirm_delete_saved_snippet from "../templates/confirm_dialog/confirm_delete_saved_snippet.hbs";
import render_edit_saved_snippet_modal from "../templates/edit_saved_snippet_modal.hbs";

import * as channel from "./channel.ts";
import * as compose_ui from "./compose_ui.ts";
import * as confirm_dialog from "./confirm_dialog.ts";
import * as dialog_widget from "./dialog_widget.ts";
import * as dropdown_widget from "./dropdown_widget.ts";
import {$t, $t_html} from "./i18n.ts";
import * as rows from "./rows.ts";
import * as saved_snippets from "./saved_snippets.ts";

let saved_snippets_widget: dropdown_widget.DropdownWidget | undefined;
let saved_snippets_dropdown: tippy.Instance | undefined;
let composebox_saved_snippets_dropdown_widget = false;

function submit_create_saved_snippet_form(): void {
    const title = $<HTMLInputElement>("#add-new-saved-snippet-modal .saved-snippet-title")
        .val()
        ?.trim();
    const content = $<HTMLInputElement>("#add-new-saved-snippet-modal .saved-snippet-content")
        .val()
        ?.trim();

    assert(title && content);

    dialog_widget.submit_api_request(channel.post, "/json/saved_snippets", {title, content});
}

function submit_edit_saved_snippet_form(saved_snippet_id: number): void {
    const title = $<HTMLInputElement>("#edit-saved-snippet-modal .saved-snippet-title")
        .val()
        ?.trim();
    const content = $<HTMLInputElement>("#edit-saved-snippet-modal .saved-snippet-content")
        .val()
        ?.trim();

    assert(title && content);

    dialog_widget.submit_api_request(channel.patch, `/json/saved_snippets/${saved_snippet_id}`, {
        title,
        content,
    });
}

function update_submit_button_state(): void {
    const title = $<HTMLInputElement>("#add-new-saved-snippet-modal .saved-snippet-title")
        .val()
        ?.trim();
    const content = $<HTMLInputElement>("#add-new-saved-snippet-modal .saved-snippet-content")
        .val()
        ?.trim();
    const $submit_button = $("#add-new-saved-snippet-modal .dialog_submit_button");

    $submit_button.prop("disabled", true);
    if (title && content) {
        $submit_button.prop("disabled", false);
    }
}

function saved_snippet_modal_post_render(): void {
    $("#add-new-saved-snippet-modal").on("input", "input,textarea", update_submit_button_state);
}

function saved_snippet_edit_modal_post_render(saved_snippet: saved_snippets.SavedSnippet): void {
    $("#edit-saved-snippet-modal").on("input", "input,textarea", () => {
        const title = $<HTMLInputElement>("#edit-saved-snippet-modal .saved-snippet-title")
            .val()
            ?.trim();
        const content = $<HTMLInputElement>("#edit-saved-snippet-modal .saved-snippet-content")
            .val()
            ?.trim();
        const $submit_button = $("#edit-saved-snippet-modal .dialog_submit_button");

        $submit_button.prop("disabled", true);
        if (title === saved_snippet.title && content === saved_snippet.content) {
            return;
        }
        if (title && content) {
            $submit_button.prop("disabled", false);
        }
    });
}

export function rerender_dropdown_widget(): void {
    if (saved_snippets_widget && saved_snippets_dropdown) {
        const options = saved_snippets.get_options_for_dropdown_widget();
        saved_snippets_widget.list_widget?.replace_list_data(options);
        saved_snippets_widget.show_empty_if_no_items($(saved_snippets_dropdown.popper));
    }
}

function delete_saved_snippet(saved_snippet_id: string): void {
    void channel.del({
        url: "/json/saved_snippets/" + saved_snippet_id,
    });
}

function item_button_click_callback(event: JQuery.ClickEvent): void {
    if (
        $(event.target).closest(".saved_snippets-dropdown-list-container .dropdown-list-delete")
            .length > 0
    ) {
        confirm_dialog.launch({
            html_heading: $t_html({defaultMessage: "Delete saved snippet?"}),
            html_body: render_confirm_delete_saved_snippet(),
            on_click() {
                const saved_snippet_id = $(event.target)
                    .closest(".list-item")
                    .attr("data-unique-id");
                assert(saved_snippet_id !== undefined);
                delete_saved_snippet(saved_snippet_id);
            },
        });
        return;
    }

    if (
        $(event.target).closest(".saved_snippets-dropdown-list-container .dropdown-list-edit")
            .length > 0
    ) {
        const saved_snippet_id = $(event.target).closest(".list-item").attr("data-unique-id");
        assert(saved_snippet_id !== undefined);

        const saved_snippet = saved_snippets.get_saved_snippet_by_id(
            Number.parseInt(saved_snippet_id, 10),
        );
        assert(saved_snippet !== undefined);
        dialog_widget.launch({
            html_heading: $t_html({defaultMessage: "Edit saved snippet"}),
            html_body: render_edit_saved_snippet_modal({
                title: saved_snippet.title,
                content: saved_snippet.content,
            }),
            html_submit_button: $t_html({defaultMessage: "Save"}),
            id: "edit-saved-snippet-modal",
            form_id: "edit-saved-snippet-form",
            update_submit_disabled_state_on_change: true,
            on_click() {
                submit_edit_saved_snippet_form(saved_snippet.id);
            },
            on_shown: () => $("#edit-saved-snippet-title").trigger("focus"),
            post_render() {
                saved_snippet_edit_modal_post_render(saved_snippet);
            },
        });
        return;
    }
}

function item_click_callback(
    event: JQuery.ClickEvent,
    dropdown: tippy.Instance,
    widget: dropdown_widget.DropdownWidget,
    is_sticky_bottom_option_clicked: boolean,
): void {
    event.preventDefault();
    event.stopPropagation();

    dropdown.hide();
    // Get target textarea where the "Add saved snippet" button is clicked.
    const $target_element = $(dropdown.reference);
    let $target_textarea: JQuery<HTMLTextAreaElement>;
    let edit_message_id: string | undefined;
    if ($target_element.parents(".message_edit_form").length === 1) {
        edit_message_id = rows.id($target_element.parents(".message_row")).toString();
        $target_textarea = $(`#edit_form_${CSS.escape(edit_message_id)} .message_edit_content`);
    } else {
        $target_textarea = $<HTMLTextAreaElement>("textarea#compose-textarea");
    }
    if (is_sticky_bottom_option_clicked) {
        dialog_widget.launch({
            html_heading: $t_html({defaultMessage: "Create a new saved snippet"}),
            html_body: render_add_saved_snippet_modal({
                prepopulated_content: $target_textarea.val(),
            }),
            html_submit_button: $t_html({defaultMessage: "Save"}),
            id: "add-new-saved-snippet-modal",
            form_id: "add-new-saved-snippet-form",
            update_submit_disabled_state_on_change: true,
            on_click: submit_create_saved_snippet_form,
            on_shown: () => $("#new-saved-snippet-title").trigger("focus"),
            post_render: saved_snippet_modal_post_render,
        });
    } else {
        const current_value = widget.current_value;
        assert(typeof current_value === "number");
        const saved_snippet = saved_snippets.get_saved_snippet_by_id(current_value);
        assert(saved_snippet !== undefined);
        const content = saved_snippet.content;
        compose_ui.insert_syntax_and_focus(content, $target_textarea);
    }
}

export function setup_saved_snippets_dropdown_widget(widget_selector: string): void {
    new dropdown_widget.DropdownWidget({
        widget_name: "saved_snippets",
        widget_selector,
        get_options: saved_snippets.get_options_for_dropdown_widget,
        item_click_callback,
        item_button_click_callback,
        $events_container: $("body"),
        unique_id_type: "number",
        sticky_bottom_option: $t({
            defaultMessage: "Create a new saved snippet",
        }),
        on_show_callback(dropdown: tippy.Instance, widget: dropdown_widget.DropdownWidget) {
            saved_snippets_widget = widget;
            saved_snippets_dropdown = dropdown;
        },
        focus_target_on_hidden: false,
        prefer_top_start_placement: true,
        tippy_props: {
            // Using -100 as x offset makes saved snippet icon be in the center
            // of the dropdown widget and 5 as y offset is what we use in compose
            // recipient dropdown widget.
            offset: [-100, 5],
        },
    }).setup();
}

export function setup_saved_snippets_dropdown_widget_if_needed(): void {
    if (!composebox_saved_snippets_dropdown_widget) {
        composebox_saved_snippets_dropdown_widget = true;
        setup_saved_snippets_dropdown_widget(".saved-snippets-composebox-widget");
    }
}
```

--------------------------------------------------------------------------------

---[FILE: scheduled_messages.ts]---
Location: zulip-main/web/src/scheduled_messages.ts
Signals: Zod

```typescript
import type * as z from "zod/mini";

import * as channel from "./channel.ts";
import {$t} from "./i18n.ts";
import type {StateData, scheduled_message_schema} from "./state_data.ts";
import {realm} from "./state_data.ts";
import * as timerender from "./timerender.ts";

export type ScheduledMessage = z.infer<typeof scheduled_message_schema>;

type TimeKey =
    | "today_nine_am"
    | "today_four_pm"
    | "tomorrow_nine_am"
    | "tomorrow_four_pm"
    | "monday_nine_am";

type SendOption = Partial<Record<TimeKey, {text: string; stamp: number}>>;

export const MINIMUM_SCHEDULED_MESSAGE_DELAY_SECONDS = 5 * 60;

export const scheduled_messages_by_id = new Map<number, ScheduledMessage>();

let selected_send_later_timestamp: number | undefined;

// show_minimum_scheduled_message_delay_minutes_note is a flag to show the user a note in the
// confirmation banner if the message is scheduled for the minimal 5 minutes ahead time,
// regardless of whether the user tried to schedule it for sooner or not.
export let show_minimum_scheduled_message_delay_minutes_note = false;

export function get_all_scheduled_messages(): ScheduledMessage[] {
    return [...scheduled_messages_by_id.values()];
}

function compute_send_times(now = new Date()): Record<TimeKey, number> {
    const today = new Date(now);
    const tomorrow = new Date(new Date(now).setDate(now.getDate() + 1));
    // Find the next Monday by subtracting the current day (0-6) from 8
    const monday = new Date(new Date(now).setDate(now.getDate() + 8 - now.getDay()));

    // Since setHours returns a timestamp, it's safe to mutate the
    // original date objects here.
    return {
        // today at 9am
        today_nine_am: today.setHours(9, 0, 0, 0),
        // today at 4pm
        today_four_pm: today.setHours(16, 0, 0, 0),
        // tomorrow at 9am
        tomorrow_nine_am: tomorrow.setHours(9, 0, 0, 0),
        // tomorrow at 4pm
        tomorrow_four_pm: tomorrow.setHours(16, 0, 0, 0),
        // next Monday at 9am
        monday_nine_am: monday.setHours(9, 0, 0, 0),
    };
}

export function add_scheduled_messages(scheduled_messages: ScheduledMessage[]): void {
    for (const scheduled_message of scheduled_messages) {
        scheduled_messages_by_id.set(scheduled_message.scheduled_message_id, scheduled_message);
    }
}

export function remove_scheduled_message(scheduled_message_id: number): void {
    if (scheduled_messages_by_id.has(scheduled_message_id)) {
        scheduled_messages_by_id.delete(scheduled_message_id);
    }
}

export function update_scheduled_message(scheduled_message: ScheduledMessage): void {
    if (!scheduled_messages_by_id.has(scheduled_message.scheduled_message_id)) {
        return;
    }

    scheduled_messages_by_id.set(scheduled_message.scheduled_message_id, scheduled_message);
}

export function delete_scheduled_message(scheduled_msg_id: number, success?: () => void): void {
    void channel.del({
        url: "/json/scheduled_messages/" + scheduled_msg_id,
        success,
    });
}

export function get_count(): number {
    return scheduled_messages_by_id.size;
}

export function get_filtered_send_opts(date: Date): {
    possible_send_later_today: SendOption | false;
    send_later_tomorrow: SendOption;
    possible_send_later_monday: SendOption | false;
    send_later_custom: {text: string};
    max_reminder_note_length: number;
} {
    const send_times = compute_send_times(date);

    const day = date.getDay(); // Starts with 0 for Sunday.

    const send_later_today = {
        today_nine_am: {
            text: $t(
                {defaultMessage: "Today at {time}"},
                {
                    time: timerender.get_localized_date_or_time_for_format(
                        send_times.today_nine_am,
                        "time",
                    ),
                },
            ),
            stamp: send_times.today_nine_am,
        },
        today_four_pm: {
            text: $t(
                {defaultMessage: "Today at {time}"},
                {
                    time: timerender.get_localized_date_or_time_for_format(
                        send_times.today_four_pm,
                        "time",
                    ),
                },
            ),
            stamp: send_times.today_four_pm,
        },
    };

    const send_later_tomorrow = {
        tomorrow_nine_am: {
            text: $t(
                {defaultMessage: "Tomorrow at {time}"},
                {
                    time: timerender.get_localized_date_or_time_for_format(
                        send_times.tomorrow_nine_am,
                        "time",
                    ),
                },
            ),
            stamp: send_times.tomorrow_nine_am,
        },
        tomorrow_four_pm: {
            text: $t(
                {defaultMessage: "Tomorrow at {time}"},
                {
                    time: timerender.get_localized_date_or_time_for_format(
                        send_times.tomorrow_four_pm,
                        "time",
                    ),
                },
            ),
            stamp: send_times.tomorrow_four_pm,
        },
    };

    const send_later_monday = {
        monday_nine_am: {
            text: $t(
                {defaultMessage: "Monday at {time}"},
                {
                    time: timerender.get_localized_date_or_time_for_format(
                        send_times.monday_nine_am,
                        "time",
                    ),
                },
            ),
            stamp: send_times.monday_nine_am,
        },
    };

    const send_later_custom = {
        text: $t({defaultMessage: "Custom"}),
    };

    let possible_send_later_today: SendOption | false = {};
    let possible_send_later_monday: SendOption | false = {};

    const minutes_into_day = date.getHours() * 60 + date.getMinutes();
    // Show Today send options based on time of day
    if (minutes_into_day < 9 * 60 - MINIMUM_SCHEDULED_MESSAGE_DELAY_SECONDS / 60) {
        // Allow Today at 9:00am only up to minimum scheduled message delay
        possible_send_later_today = send_later_today;
    } else if (minutes_into_day < (12 + 4) * 60 - MINIMUM_SCHEDULED_MESSAGE_DELAY_SECONDS / 60) {
        // Allow Today at 4:00pm only up to minimum scheduled message delay
        possible_send_later_today.today_four_pm = send_later_today.today_four_pm;
    } else {
        possible_send_later_today = false;
    }
    // Show send_later_monday options only on Fridays and Saturdays.
    if (day >= 5) {
        possible_send_later_monday = send_later_monday;
    } else {
        possible_send_later_monday = false;
    }

    return {
        possible_send_later_today,
        send_later_tomorrow,
        possible_send_later_monday,
        send_later_custom,
        max_reminder_note_length: realm.max_reminder_note_length,
    };
}

export function get_selected_send_later_timestamp(): number | undefined {
    if (!selected_send_later_timestamp) {
        return undefined;
    }
    return selected_send_later_timestamp;
}

export function get_formatted_selected_send_later_time(): string | undefined {
    if (!selected_send_later_timestamp) {
        return undefined;
    }
    return timerender.get_full_datetime(new Date(selected_send_later_timestamp * 1000), "time");
}

export function set_selected_schedule_timestamp(timestamp: number): void {
    selected_send_later_timestamp = timestamp;
}

export function reset_selected_schedule_timestamp(): void {
    selected_send_later_timestamp = undefined;
}

export function initialize(scheduled_messages_params: StateData["scheduled_messages"]): void {
    add_scheduled_messages(scheduled_messages_params.scheduled_messages);
}

export function set_minimum_scheduled_message_delay_minutes_note(flag: boolean): void {
    show_minimum_scheduled_message_delay_minutes_note = flag;
}
```

--------------------------------------------------------------------------------

---[FILE: scheduled_messages_feed_ui.ts]---
Location: zulip-main/web/src/scheduled_messages_feed_ui.ts

```typescript
import $ from "jquery";

import render_scheduled_messages_indicator from "../templates/scheduled_messages_indicator.hbs";

import * as narrow_state from "./narrow_state.ts";
import * as scheduled_messages from "./scheduled_messages.ts";
import type {ScheduledMessage} from "./scheduled_messages.ts";
import * as util from "./util.ts";

function get_scheduled_messages_matching_narrow(): ScheduledMessage[] {
    const scheduled_messages_list = scheduled_messages.get_all_scheduled_messages();
    const filter = narrow_state.filter();
    const is_conversation_view =
        filter === undefined
            ? false
            : filter.is_conversation_view() || filter.is_conversation_view_with_near();
    const current_view_type = narrow_state.narrowed_to_pms() ? "private" : "stream";

    if (!is_conversation_view) {
        return [];
    }

    const matching_scheduled_messages = scheduled_messages_list.filter((scheduled_message) => {
        // One could imagine excluding scheduled messages that failed
        // to send, but structurally, we want to raise awareness of
        // them -- we expect users to cancel/clear/reschedule those if
        // aware of them.

        if (current_view_type !== scheduled_message.type) {
            return false;
        }

        if (scheduled_message.type === "private") {
            // Both of these will be the user IDs for all participants including the
            // current user sorted in ascending order.
            if (scheduled_message.to.toString() === narrow_state.pm_ids_string()) {
                return true;
            }
        } else if (scheduled_message.type === "stream") {
            const current_stream_id = narrow_state.stream_id(narrow_state.filter(), true);
            const current_topic = narrow_state.topic();
            if (current_stream_id === undefined || current_topic === undefined) {
                return false;
            }
            const narrow_dict = {
                stream_id: current_stream_id,
                topic: current_topic,
            };
            const scheduled_message_dict = {
                stream_id: scheduled_message.to,
                topic: scheduled_message.topic,
            };
            if (util.same_stream_and_topic(narrow_dict, scheduled_message_dict)) {
                return true;
            }
        }
        return false;
    });
    return matching_scheduled_messages;
}

export function update_schedule_message_indicator(): void {
    $("#scheduled_message_indicator").empty();
    const matching_scheduled_messages = get_scheduled_messages_matching_narrow();
    const scheduled_message_count = matching_scheduled_messages.length;
    if (scheduled_message_count > 0) {
        $("#scheduled_message_indicator").html(
            render_scheduled_messages_indicator({
                scheduled_message_count,
            }),
        );
    }
}
```

--------------------------------------------------------------------------------

---[FILE: scheduled_messages_overlay_ui.ts]---
Location: zulip-main/web/src/scheduled_messages_overlay_ui.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import render_scheduled_message from "../templates/scheduled_message.hbs";
import render_scheduled_messages_overlay from "../templates/scheduled_messages_overlay.hbs";

import * as browser_history from "./browser_history.ts";
import * as messages_overlay_ui from "./messages_overlay_ui.ts";
import * as mouse_drag from "./mouse_drag.ts";
import * as overlays from "./overlays.ts";
import * as people from "./people.ts";
import * as scheduled_messages from "./scheduled_messages.ts";
import type {ScheduledMessage} from "./scheduled_messages.ts";
import * as scheduled_messages_ui from "./scheduled_messages_ui.ts";
import * as stream_color from "./stream_color.ts";
import * as stream_data from "./stream_data.ts";
import * as sub_store from "./sub_store.ts";
import * as timerender from "./timerender.ts";
import * as util from "./util.ts";

type ScheduledMessageRenderContext = ScheduledMessage &
    (
        | {
              is_stream: true;
              formatted_send_at_time: string;
              recipient_bar_color: string;
              stream_id: number;
              stream_name: string | undefined;
              stream_privacy_icon_color: string;
              topic_display_name: string;
              is_empty_string_topic: boolean;
          }
        | {
              is_stream: false;
              is_dm_with_self: boolean;
              formatted_send_at_time: string;
              recipients: string;
          }
    );

export const keyboard_handling_context = {
    get_items_ids() {
        const scheduled_messages_ids = [];
        const sorted_scheduled_messages = sort_scheduled_messages(
            scheduled_messages.get_all_scheduled_messages(),
        );
        for (const scheduled_message of sorted_scheduled_messages) {
            scheduled_messages_ids.push(scheduled_message.scheduled_message_id.toString());
        }
        return scheduled_messages_ids;
    },
    on_enter() {
        const focused_element_id = messages_overlay_ui.get_focused_element_id(this);
        if (focused_element_id === undefined) {
            return;
        }
        scheduled_messages_ui.edit_scheduled_message(Number.parseInt(focused_element_id, 10));
        overlays.close_overlay("scheduled");
    },
    on_delete() {
        const focused_element_id = messages_overlay_ui.get_focused_element_id(this);
        if (focused_element_id === undefined) {
            return;
        }
        const $focused_row = messages_overlay_ui.row_with_focus(this);
        messages_overlay_ui.focus_on_sibling_element(this);
        // We need to have a super responsive UI feedback here, so we remove the row from the DOM manually
        $focused_row.remove();
        scheduled_messages.delete_scheduled_message(Number.parseInt(focused_element_id, 10));
    },
    items_container_selector: "scheduled-messages-container",
    items_list_selector: "scheduled-messages-list",
    row_item_selector: "scheduled-message-row",
    box_item_selector: "scheduled-message-info-box",
    id_attribute_name: "data-scheduled-message-id",
};

function sort_scheduled_messages(scheduled_messages: ScheduledMessage[]): ScheduledMessage[] {
    return scheduled_messages.toSorted(
        (msg1, msg2) => msg1.scheduled_delivery_timestamp - msg2.scheduled_delivery_timestamp,
    );
}

export function handle_keyboard_events(event_key: string): void {
    messages_overlay_ui.modals_handle_events(event_key, keyboard_handling_context);
}

function format(scheduled_messages: ScheduledMessage[]): ScheduledMessageRenderContext[] {
    const formatted_scheduled_msgs = [];
    const sorted_scheduled_messages = sort_scheduled_messages(scheduled_messages);

    for (const scheduled_msg of sorted_scheduled_messages) {
        let scheduled_msg_render_context;
        const time = new Date(scheduled_msg.scheduled_delivery_timestamp * 1000);
        const formatted_send_at_time = timerender.get_full_datetime(time, "time");
        if (scheduled_msg.type === "stream") {
            const stream_id = scheduled_msg.to;
            let stream_name;
            const stream = sub_store.get(stream_id);
            if (stream) {
                stream_name = sub_store.maybe_get_stream_name(stream_id);
            }
            const color = stream_data.get_color(stream_id);
            const recipient_bar_color = stream_color.get_recipient_bar_color(color);
            const stream_privacy_icon_color = stream_color.get_stream_privacy_icon_color(color);

            scheduled_msg_render_context = {
                ...scheduled_msg,
                is_stream: true as const,
                stream_id,
                stream_name,
                recipient_bar_color,
                stream_privacy_icon_color,
                formatted_send_at_time,
                topic_display_name: util.get_final_topic_display_name(scheduled_msg.topic),
                is_empty_string_topic: scheduled_msg.topic === "",
            };
        } else {
            const user_ids_string = scheduled_msg.to.join(",");
            const recipients = people.format_recipients(user_ids_string, "long");
            scheduled_msg_render_context = {
                ...scheduled_msg,
                is_stream: false as const,
                is_dm_with_self: people.is_direct_message_conversation_with_self(scheduled_msg.to),
                recipients,
                formatted_send_at_time,
            };
        }
        formatted_scheduled_msgs.push(scheduled_msg_render_context);
    }
    return formatted_scheduled_msgs;
}

export function launch(): void {
    $("#scheduled_messages_overlay_container").html(render_scheduled_messages_overlay());
    overlays.open_overlay({
        name: "scheduled",
        $overlay: $("#scheduled_messages_overlay"),
        on_close() {
            browser_history.exit_overlay();
        },
    });

    const rendered_list = render_scheduled_message({
        scheduled_messages_data: format(scheduled_messages.get_all_scheduled_messages()),
    });
    const $messages_list = $("#scheduled_messages_overlay .overlay-messages-list");
    $messages_list.append($(rendered_list));

    const first_element_id = keyboard_handling_context.get_items_ids()[0];
    messages_overlay_ui.set_initial_element(first_element_id, keyboard_handling_context);
}

export function rerender(): void {
    if (!overlays.scheduled_messages_open()) {
        return;
    }
    const rendered_list = render_scheduled_message({
        scheduled_messages_data: format(scheduled_messages.get_all_scheduled_messages()),
    });
    const $messages_list = $("#scheduled_messages_overlay .overlay-messages-list");
    $messages_list.find(".scheduled-message-row").remove();
    $messages_list.append($(rendered_list));
}

export function remove_scheduled_message_id(scheduled_msg_id: number): void {
    if (overlays.scheduled_messages_open()) {
        $(
            `#scheduled_messages_overlay .scheduled-message-row[data-scheduled-message-id=${scheduled_msg_id}]`,
        ).remove();
    }
}

export function initialize(): void {
    $("body").on("click", ".scheduled-message-row .restore-overlay-message", (e) => {
        if (mouse_drag.is_drag(e)) {
            return;
        }

        const scheduled_msg_id = Number.parseInt(
            $(e.currentTarget).closest(".scheduled-message-row").attr("data-scheduled-message-id")!,
            10,
        );
        scheduled_messages_ui.edit_scheduled_message(scheduled_msg_id);
        overlays.close_overlay("scheduled");
        e.stopPropagation();
        e.preventDefault();
    });

    $("body").on("click", ".scheduled-message-row .delete-overlay-message", (e) => {
        const scheduled_msg_id = $(e.currentTarget)
            .closest(".scheduled-message-row")
            .attr("data-scheduled-message-id");
        assert(scheduled_msg_id !== undefined);

        scheduled_messages.delete_scheduled_message(Number.parseInt(scheduled_msg_id, 10));

        e.stopPropagation();
        e.preventDefault();
    });

    $("body").on("focus", ".scheduled-message-info-box", function (this: HTMLElement) {
        messages_overlay_ui.activate_element(this, keyboard_handling_context);
    });
}
```

--------------------------------------------------------------------------------

````
