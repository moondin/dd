---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 593
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 593 of 1290)

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

---[FILE: clipboard_handler.ts]---
Location: zulip-main/web/src/clipboard_handler.ts

```typescript
import assert from "minimalistic-assert";

import * as blueslip from "./blueslip.ts";
import * as hash_util from "./hash_util.ts";
import * as popover_menus from "./popover_menus.ts";
import * as stream_data from "./stream_data.ts";
import * as topic_link_util from "./topic_link_util.ts";

// The standard Clipboard API do not support custom mime types like
// text/x-gfm, but this approach does, except on Safari.
export function execute_copy(
    handle_copy_event: (e: ClipboardEvent) => void,
    fallback_text: string,
): void {
    // On Safari, the copy command only works if there's a current
    // selection, so we create a selection, with the link set as
    // fallback text for it.
    const dummy = document.createElement("input");
    document.body.append(dummy);
    dummy.value = fallback_text;
    dummy.select();

    document.addEventListener("copy", handle_copy_event);
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand("copy");
    document.removeEventListener("copy", handle_copy_event);
    dummy.remove();
}

export async function copy_link_to_clipboard(link: string): Promise<void> {
    // The caller is responsible for making sure what it is passes in
    // to this function is a Zulip internal link.
    return new Promise((resolve) => {
        const stream_topic_details = hash_util.decode_stream_topic_from_url(link);

        function handle_copy_event(e: ClipboardEvent): void {
            if (stream_topic_details === null) {
                e.clipboardData?.setData("text/plain", link);
            } else {
                const stream = stream_data.get_sub_by_id(stream_topic_details.stream_id);
                assert(stream !== undefined);
                const {text} = topic_link_util.get_topic_link_content_with_stream_name({
                    stream_name: stream.name,
                    topic_name: stream_topic_details.topic_name,
                    message_id: stream_topic_details.message_id,
                });

                const copy_in_html_syntax = topic_link_util.as_html_link_syntax_unsafe(text, link);
                const copy_in_markdown_syntax = topic_link_util.as_markdown_link_syntax(text, link);

                e.clipboardData?.setData("text/plain", link);
                e.clipboardData?.setData("text/html", copy_in_html_syntax);
                e.clipboardData?.setData("text/x-gfm", copy_in_markdown_syntax);
            }
            e.preventDefault();
            resolve();
        }
        execute_copy(handle_copy_event, link);
    });
}

/* istanbul ignore next */
export function popover_copy_link_to_clipboard(
    instance: typeof popover_menus.popover_instances.message_actions,
    $element: JQuery,
    success_callback?: () => void,
): void {
    // Wrapper for copy_link_to_clipboard handling closing a popover
    // and error handling.
    const clipboard_text = String($element.attr("data-clipboard-text"));
    void copy_link_to_clipboard(clipboard_text)
        .then(() => {
            popover_menus.hide_current_popover_if_visible(instance);
            if (success_callback !== undefined) {
                success_callback();
            }
        })
        .catch((error: unknown) => {
            blueslip.error("Failed to copy to clipboard: ", {error: String(error)});
        });
}
```

--------------------------------------------------------------------------------

---[FILE: color_data.ts]---
Location: zulip-main/web/src/color_data.ts

```typescript
import _ from "lodash";

export let unused_colors: string[];

// These colors are used now for streams.
const stream_colors = [
    "#76ce90",
    "#fae589",
    "#a6c7e5",
    "#e79ab5",
    "#bfd56f",
    "#f4ae55",
    "#b0a5fd",
    "#addfe5",
    "#f5ce6e",
    "#c2726a",
    "#94c849",
    "#bd86e5",
    "#ee7e4a",
    "#a6dcbf",
    "#95a5fd",
    "#53a063",
    "#9987e1",
    "#e4523d",
    "#c2c2c2",
    "#4f8de4",
    "#c6a8ad",
    "#e7cc4d",
    "#c8bebf",
    "#a47462",
];

// Shuffle our colors on page load to prevent
// bias toward "early" colors.
export const colors = _.shuffle(stream_colors);

export function reset(): void {
    unused_colors = [...colors];
}

reset();

export function claim_color(color: string): void {
    const i = unused_colors.indexOf(color);

    if (i === -1) {
        return;
    }

    unused_colors.splice(i, 1);

    if (unused_colors.length === 0) {
        reset();
    }
}

export function claim_colors(subs: {color: string}[]): void {
    const colors = new Set(subs.map((sub) => sub.color));
    for (const color of colors) {
        claim_color(color);
    }
}

export function pick_color(): string {
    const color = unused_colors[0]!;

    claim_color(color);

    return color;
}
```

--------------------------------------------------------------------------------

---[FILE: color_picker_popover.ts]---
Location: zulip-main/web/src/color_picker_popover.ts

```typescript
import $ from "jquery";
import _ from "lodash";
import type * as tippy from "tippy.js";

import render_color_picker_popover from "../templates/popovers/color_picker_popover.hbs";

import * as blueslip from "./blueslip.ts";
import * as popover_menus from "./popover_menus.ts";
import * as stream_color from "./stream_color.ts";
import * as stream_data from "./stream_data.ts";
import * as stream_settings_api from "./stream_settings_api.ts";
import * as ui_util from "./ui_util.ts";

const update_color_picker_preview = (color: string, $popper: JQuery): void => {
    const $stream_header = $popper.find(".message_header_stream");
    stream_color.update_stream_recipient_color($stream_header, color);
};

const update_stream_color_debounced = _.debounce(
    (new_color: string, stream_id: number, $popper: JQuery) => {
        update_color_picker_preview(new_color, $popper);
        stream_settings_api.set_color(stream_id, new_color);
    },
    // Wait for 200ms of inactivity
    200,
    // Don't execute immediately on the first color change
    {leading: false},
);

export function handle_keyboard(key: string): void {
    const instance = popover_menus.get_color_picker_popover();
    if (!instance) {
        return;
    }
    const $items = popover_menus.get_popover_items_for_instance(instance);
    if (!$items) {
        return;
    }

    const $element = $items.filter(":focus");

    if ($element.hasClass("color-swatch-label")) {
        const color_hex_code = $element.attr("data-swatch-color");
        if (!color_hex_code) {
            return;
        }
        const color_palette_matrix = stream_color.stream_color_palette;
        if (!color_palette_matrix) {
            return;
        }
        const max_row = color_palette_matrix.length - 1;
        const max_column = color_palette_matrix[0]!.length - 1;
        const row = Number.parseInt($element.attr("data-row")!, 10);
        const column = Number.parseInt($element.attr("data-column")!, 10);

        const $swatch_color_list = $(instance.popper).find(".color-swatch-list");

        if (key === "down_arrow" || key === "vim_down") {
            if (row < max_row) {
                $swatch_color_list
                    .find(`[data-row="${row + 1}"][data-column="${column}"]`)
                    .trigger("focus");
            } else if (row === max_row) {
                $swatch_color_list
                    .parent()
                    .nextAll(".link-item")
                    .find("[tabindex='0']")
                    .trigger("focus");
            }
            return;
        }

        if (key === "up_arrow" || key === "vim_up") {
            if (row > 0) {
                $swatch_color_list
                    .find(`[data-row="${row - 1}"][data-column="${column}"]`)
                    .trigger("focus");
            } else {
                $(instance.popper).find(".color_picker_confirm_button").trigger("focus");
            }
            return;
        }

        if (key === "left_arrow" || key === "vim_left") {
            if (column > 0) {
                $swatch_color_list
                    .find(`[data-row="${row}"][data-column="${column - 1}"]`)
                    .trigger("focus");
            } else {
                $swatch_color_list
                    .find(`[data-row="${row - 1}"][data-column="${max_column}"]`)
                    .trigger("focus");
            }
            return;
        }

        if (key === "right_arrow" || key === "vim_right") {
            if (column < max_column) {
                $swatch_color_list
                    .find(`[data-row="${row}"][data-column="${column + 1}"]`)
                    .trigger("focus");
            } else {
                $swatch_color_list
                    .find(`[data-row="${row + 1}"][data-column="0"]`)
                    .trigger("focus");
            }
            return;
        }
    }

    popover_menus.popover_items_handle_keyboard(key, $items);
}

export function toggle_color_picker_popover(
    target: tippy.ReferenceElement,
    stream_id: number,
): void {
    popover_menus.toggle_popover_menu(target, {
        theme: "popover-menu",
        placement: "right",
        popperOptions: {
            modifiers: [
                {
                    name: "flip",
                    options: {
                        fallbackPlacements: ["bottom", "left"],
                    },
                },
            ],
        },
        onShow(instance) {
            ui_util.show_left_sidebar_menu_icon(target);
            popover_menus.popover_instances.color_picker_popover = instance;
            popover_menus.on_show_prep(instance);

            const stream_name = stream_data.get_stream_name_from_id(stream_id);
            const color = stream_data.get_color(stream_id);
            const recipient_bar_color = stream_color.get_recipient_bar_color(color);
            const stream_privacy_icon_color = stream_color.get_stream_privacy_icon_color(color);
            const invite_only = stream_data.is_invite_only_by_stream_id(stream_id);
            const is_web_public = stream_data.is_web_public(stream_id);
            const stream_color_palette = stream_color.stream_color_palette;

            instance.setContent(
                ui_util.parse_html(
                    render_color_picker_popover({
                        stream_id,
                        stream_name,
                        stream_color: color,
                        recipient_bar_color,
                        stream_privacy_icon_color,
                        invite_only,
                        is_web_public,
                        stream_color_palette,
                    }),
                ),
            );
        },
        onMount(instance) {
            const $popper = $(instance.popper);

            const $color_picker_input = $popper.find(".color-picker-input");
            const color = stream_data.get_color(stream_id);

            $color_picker_input.val(color);

            $popper.on(
                "change",
                "input[name='color-picker-select']",
                function (this: HTMLInputElement, _e: JQuery.Event) {
                    const prev_color = stream_data.get_color(stream_id);
                    const new_color = $(this).attr("data-swatch-color")!;
                    if (prev_color === new_color) {
                        return;
                    }
                    $color_picker_input.val(new_color);
                    update_stream_color_debounced(new_color, stream_id, $popper);
                },
            );

            $popper.on(
                "input",
                ".color-picker-input",
                function (this: HTMLInputElement, _e: JQuery.Event) {
                    const new_color = $(this).val();
                    if (!new_color) {
                        blueslip.error("Invalid color picker value");
                        return;
                    }
                    const $swatch_color_checked = $popper.find(
                        "input[name='color-picker-select']:checked",
                    );
                    $swatch_color_checked.prop("checked", false);
                    update_stream_color_debounced(new_color, stream_id, $popper);
                },
            );

            $popper.on("click", ".color_picker_confirm_button", () => {
                popover_menus.hide_current_popover_if_visible(instance);
            });
        },
        onHidden(instance) {
            instance.destroy();
            ui_util.hide_left_sidebar_menu_icon();
            popover_menus.popover_instances.color_picker_popover = null;
        },
    });
}

export function initialize(): void {
    $("body").on(
        "click",
        ".choose_stream_color",
        function (this: HTMLElement, e: JQuery.ClickEvent) {
            e.stopPropagation();
            e.preventDefault();

            const stream_id = Number.parseInt($(this).attr("data-stream-id")!, 10);

            let target: tippy.ReferenceElement | undefined;
            if (popover_menus.is_stream_actions_popover_displayed()) {
                // If the stream actions popover is open, we want to open the color picker popover
                // from the same reference element as that of the stream actions popover so that
                // the color picker popover replaces the stream actions popover in-place.
                // This avoids the cluttering of the UI with multiple popovers, given that we can
                // also open the browser native color picker from the color picker popover.
                target = popover_menus.popover_instances.stream_actions_popover?.reference;
                popover_menus.hide_current_popover_if_visible(
                    popover_menus.popover_instances.stream_actions_popover,
                );
            }

            // If the stream actions popover is not open, we want to open the color picker popover
            // from the target of the click event.
            toggle_color_picker_popover(target ?? this, stream_id);
        },
    );
    $("body").on(
        "click",
        ".channel-color-label",
        function (this: HTMLElement, e: JQuery.ClickEvent) {
            e.stopPropagation();
            e.preventDefault();
            const $button = $(this).siblings(".choose_stream_color");
            $button.trigger("click");
        },
    );
}
```

--------------------------------------------------------------------------------

---[FILE: common.ts]---
Location: zulip-main/web/src/common.ts

```typescript
import $ from "jquery";
import * as tippy from "tippy.js";

import {$t} from "./i18n.ts";
import * as util from "./util.ts";

export const status_classes = "alert-error alert-success alert-info alert-warning alert-loading";

export function phrase_match(query: string, phrase: string): boolean {
    // match "tes" to "test" and "stream test" but not "hostess"
    return (" " + phrase.toLowerCase()).includes(" " + query.toLowerCase());
}

// Any changes to this function should be followed by a check for changes needed
// to adjust_mac_kbd_tags of starlight_help/src/scripts/adjust_mac_kbd_tags.ts.
const keys_map = new Map([
    ["Backspace", "Delete"],
    ["Enter", "Return"],
    ["Ctrl", "⌘"],
    ["Alt", "⌥"],
]);

// Any changes to this function should be followed by a check for changes needed
// to adjust_mac_kbd_tags of starlight_help/src/scripts/adjust_mac_kbd_tags.ts.
export function has_mac_keyboard(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    return /mac/i.test(navigator.platform);
}

// We convert the <kbd> tags used for keyboard shortcuts to mac equivalent
// key combinations, when we detect that the user is using a mac-style keyboard.
// Any changes to this function should be followed by a check for changes needed
// to adjust_mac_kbd_tags of starlight_help/src/scripts/adjust_mac_kbd_tags.ts.
export function adjust_mac_kbd_tags(kbd_elem_class: string): void {
    if (!has_mac_keyboard()) {
        return;
    }

    $(kbd_elem_class).each(function () {
        let key_text = $(this).text();

        // We use data-mac-key attribute to override the default key in case
        // of exceptions:
        // - There are 2 shortcuts (for navigating back and forth in browser
        //   history) which need "⌘" instead of the expected mapping ("Opt")
        //   for the "Alt" key, so we use this attribute to override "Opt"
        //   with "⌘".
        // - The "Ctrl" + "[" shortcuts (which match the Vim keybinding behavior
        //   of mapping to "Esc") need to display "Ctrl" for all users, so we
        //   use this attribute to override "⌘" with "Ctrl".
        const replace_key = $(this).attr("data-mac-key") ?? keys_map.get(key_text);
        if (replace_key !== undefined) {
            key_text = replace_key;
        }

        $(this).text(key_text);

        // In case of shortcuts, the Mac equivalent of which involves extra keys,
        // we use data-mac-following-key attribute to append the extra key to the
        // previous key. Currently, this is used to append Opt to Cmd for the Paste
        // as plain text shortcut.
        const following_key = $(this).attr("data-mac-following-key");
        if (following_key !== undefined) {
            const $kbd_elem = $("<kbd>").text(following_key);
            $(this).after($("<span>").text(" + ").contents(), $kbd_elem);
        }

        // The ⌘ symbol isn't vertically centered, so we use an icon.
        if (key_text === "⌘") {
            const $icon = $("<i>")
                .addClass("zulip-icon zulip-icon-mac-command")
                .attr("aria-label", key_text);
            $(this).empty().append($icon); // Use .append() to safely add the icon
        }
    });
}

// We convert the hotkey hints used in the tooltips to mac equivalent
// key combinations, when we detect that the user is using a mac-style keyboard.
export function adjust_mac_hotkey_hints(hotkeys: string[]): void {
    if (!has_mac_keyboard()) {
        return;
    }

    for (const [index, hotkey] of hotkeys.entries()) {
        const replace_key = keys_map.get(hotkey);

        if (replace_key !== undefined) {
            hotkeys[index] = replace_key;
        }
    }
}

// We convert the Shift key with ⇧ (Level 2 Select Symbol) in the
// popover menu hotkey hints. This helps us reduce the width of
// the popover menus.
export function adjust_shift_hotkey(hotkeys: string[]): boolean {
    for (const [index, hotkey] of hotkeys.entries()) {
        if (hotkey === "Shift") {
            hotkeys[index] = "⇧";
            return true;
        }
    }
    return false;
}

export function is_printable_ascii(key: string): boolean {
    // ASCII printable characters (character code 32-126) -> " " to "~".
    // It includes letters, digits, punctuation marks, and a few
    // miscellaneous symbols.
    return key.length === 1 && key >= " " && key <= "~";
}

// See https://zulip.readthedocs.io/en/latest/development/authentication.html#password-form-implementation
// for design details on this feature.
function set_password_toggle_label(
    password_selector: string,
    label: string,
    tippy_tooltips: boolean,
): void {
    $(password_selector).attr("aria-label", label);
    if (tippy_tooltips) {
        const element: tippy.ReferenceElement = util.the($(password_selector));
        const tippy_instance = element._tippy ?? tippy.default(element);
        tippy_instance.setContent(label);
    } else {
        $(password_selector).attr("title", label);
    }
}

function toggle_password_visibility(
    password_field_id: string,
    password_selector: string,
    tippy_tooltips: boolean,
): void {
    let label;
    const $password_field = $(password_field_id);

    if ($password_field.attr("type") === "password") {
        $password_field.attr("type", "text");
        $(password_selector).removeClass("fa-eye-slash").addClass("fa-eye");
        label = $t({defaultMessage: "Hide password"});
    } else {
        $password_field.attr("type", "password");
        $(password_selector).removeClass("fa-eye").addClass("fa-eye-slash");
        label = $t({defaultMessage: "Show password"});
    }
    set_password_toggle_label(password_selector, label, tippy_tooltips);
}

export function reset_password_toggle_icons(
    password_field: string,
    password_selector: string,
): void {
    $(password_field).attr("type", "password");
    $(password_selector).removeClass("fa-eye").addClass("fa-eye-slash");
    const label = $t({defaultMessage: "Show password"});
    set_password_toggle_label(password_selector, label, true);
}

export function setup_password_visibility_toggle(
    password_field_id: string,
    password_selector: string,
    {tippy_tooltips = false} = {},
): void {
    const label = $t({defaultMessage: "Show password"});
    set_password_toggle_label(password_selector, label, tippy_tooltips);
    $(password_selector).on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle_password_visibility(password_field_id, password_selector, tippy_tooltips);
    });
    $(password_selector).on("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            toggle_password_visibility(password_field_id, password_selector, tippy_tooltips);
        }
    });
}
```

--------------------------------------------------------------------------------

---[FILE: components.ts]---
Location: zulip-main/web/src/components.ts

```typescript
import $ from "jquery";

import * as blueslip from "./blueslip.ts";
import * as keydown_util from "./keydown_util.ts";

/* USAGE:
    Toggle x = components.toggle({
        selected: Integer selected_index,
        values: Array<Object> [
            {label: $t({defaultMessage: "String title"})}
        ],
        callback: function () {
            // .. on value change.
        },
    }).get();
*/

export type Toggle = {
    maybe_go_left: () => boolean;
    maybe_go_right: () => boolean;
    disable_tab: (name: string) => void;
    enable_tab: (name: string) => void;
    value: () => string | undefined;
    get: () => JQuery;
    goto: (name: string) => void;
    register_event_handlers: () => void;
};

export function toggle(opts: {
    html_class?: string;
    values: (({label: string; label_html?: never} | {label_html: string; label?: never}) & {
        key: string;
    })[];
    callback?: (label: string | undefined, value: string) => void;
    child_wants_focus?: boolean;
    selected?: number;
}): Toggle {
    const $component = $("<div>").addClass("tab-switcher");
    if (opts.html_class) {
        // add a check inside passed arguments in case some extra
        // classes need to be added for correct alignment or other purposes
        $component.addClass(opts.html_class);
    }
    for (const [i, value] of opts.values.entries()) {
        // create a tab with a tab-id so they don't have to be referenced
        // by text value which can be inconsistent.
        const $tab = $("<div>")
            .addClass("ind-tab")
            .attr({"data-tab-key": value.key, "data-tab-id": i, tabindex: 0});

        /* istanbul ignore if */
        if (value.label_html !== undefined) {
            const html = value.label_html;
            $tab.html(html);
        } else if (value.label !== undefined) {
            $tab.text(value.label);
        }

        // add proper classes for styling in CSS.
        if (i === 0) {
            // this should be default selected unless otherwise specified.
            $tab.addClass("first selected");
        } else if (i === opts.values.length - 1) {
            $tab.addClass("last");
        } else {
            $tab.addClass("middle");
        }
        $component.append($tab);
    }

    const meta = {
        $ind_tab: $component.find(".ind-tab"),
        idx: -1,
    };

    // Returns false if the requested tab is disabled.
    function select_tab(idx: number): boolean {
        const $elem = meta.$ind_tab.eq(idx);
        if ($elem.hasClass("disabled")) {
            return false;
        }
        meta.$ind_tab.removeClass("selected");

        $elem.addClass("selected");

        meta.idx = idx;
        if (opts.callback) {
            opts.callback(opts.values[idx]!.label, opts.values[idx]!.key);
        }

        if (!opts.child_wants_focus) {
            $elem.trigger("focus");
        }
        return true;
    }

    function maybe_go_left(): boolean {
        // Select the first non-disabled tab to the left, if any.
        let i = 1;
        while (meta.idx - i >= 0) {
            if (select_tab(meta.idx - i)) {
                return true;
            }
            i += 1;
        }
        return false;
    }

    function maybe_go_right(): boolean {
        // Select the first non-disabled tab to the right, if any.
        let i = 1;
        while (meta.idx + i <= opts.values.length - 1) {
            if (select_tab(meta.idx + i)) {
                return true;
            }
            i += 1;
        }
        return false;
    }

    function register_event_handlers(): void {
        meta.$ind_tab.off("click");
        meta.$ind_tab.on("click", function () {
            const idx = Number($(this).attr("data-tab-id"));
            select_tab(idx);
        });
    }
    register_event_handlers();

    keydown_util.handle({
        $elem: meta.$ind_tab,
        handlers: {
            ArrowLeft: maybe_go_left,
            ArrowRight: maybe_go_right,
        },
    });

    // We should arguably default opts.selected to 0.
    if (typeof opts.selected === "number") {
        select_tab(opts.selected);
    }

    const prototype = {
        // Skip disabled tabs and go to the next one.
        maybe_go_left,
        maybe_go_right,

        disable_tab(name: string) {
            const value = opts.values.find((o) => o.key === name);
            if (!value) {
                blueslip.warn("Incorrect tab name given.");
                return;
            }

            const idx = opts.values.indexOf(value);
            meta.$ind_tab.eq(idx).addClass("disabled");
        },

        enable_tab(name: string) {
            const value = opts.values.find((o) => o.key === name);
            if (!value) {
                blueslip.warn("Incorrect tab name given.");
                return;
            }

            const idx = opts.values.indexOf(value);
            meta.$ind_tab.eq(idx).removeClass("disabled");
        },

        value() {
            if (meta.idx >= 0) {
                return opts.values[meta.idx]!.label;
            }
            /* istanbul ignore next */
            return undefined;
        },

        get() {
            return $component;
        },
        // go through the process of finding the correct tab for a given name,
        // and when found, select that one and provide the proper callback.
        goto(name: string) {
            const value = opts.values.find((o) => o.label === name || o.key === name);
            if (!value) {
                blueslip.warn("Incorrect tab name given.");
                return;
            }

            const idx = opts.values.indexOf(value);

            if (idx !== -1) {
                select_tab(idx);
            }
        },

        register_event_handlers,
    };

    return prototype;
}
```

--------------------------------------------------------------------------------

````
