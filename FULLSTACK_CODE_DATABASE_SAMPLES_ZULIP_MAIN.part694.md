---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 694
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 694 of 1290)

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

---[FILE: templates.ts]---
Location: zulip-main/web/src/templates.ts

```typescript
import Handlebars from "handlebars/runtime.js";

import render_input_wrapper from "../templates/components/input_wrapper.hbs";

import * as common from "./common.ts";
import {default_html_elements, intl} from "./i18n.ts";
import {postprocess_content} from "./postprocess_content.ts";

// Below, we register Zulip-specific extensions to the Handlebars API.
//
// IMPORTANT: When adding a new Handlebars helper, update the
// knownHelpers array in the webpack config so that webpack knows your
// helper is registered at runtime and don't try to require them when
// bundling.

// We don't want to wait for DOM ready to register the Handlebars helpers
// below. There's no need to, as they do not access the DOM.
// Furthermore, waiting for DOM ready would introduce race conditions with
// other DOM-ready callbacks that attempt to render templates.

Handlebars.registerHelper({
    eq(a, b) {
        return a === b;
    },
    and(...args: unknown[]) {
        args.pop(); // Handlebars options
        if (args.length === 0) {
            return true;
        }
        const last = args.pop();
        for (const arg of args) {
            if (!arg || Handlebars.Utils.isEmpty(arg)) {
                return arg;
            }
        }
        return last;
    },
    or(...args: unknown[]) {
        args.pop(); // Handlebars options
        if (args.length === 0) {
            return false;
        }
        const last = args.pop();
        for (const arg of args) {
            if (arg && !Handlebars.Utils.isEmpty(arg)) {
                return arg;
            }
        }
        return last;
    },
    not(a) {
        return !a || Handlebars.Utils.isEmpty(a);
    },
});

type Context = Record<string, unknown>;

Handlebars.registerHelper("t", function (this: Context, message: string) {
    // Marks a string for translation.
    // Example usage 1:
    //     {{t "some English text"}}
    //
    // Example usage 2:
    //     {{t "This {variable} will get value from the current context"}}
    //
    // Note: use `{` and `}` instead of `{{` and `}}` to declare
    // variables.

    message = message
        .trim()
        .split("\n")
        .map((s) => s.trim())
        .join(" ");
    const descriptor = {id: message, defaultMessage: message};
    return intl.formatMessage(
        descriptor,
        Object.fromEntries(
            Object.entries(this).flatMap(([key, value]) =>
                typeof value === "string" || typeof value === "number" || value instanceof Date
                    ? [[key, value]]
                    : [],
            ),
        ),
    );
});

Handlebars.registerHelper("tr", function (this: Context, options: Handlebars.HelperOptions) {
    // Marks a block for translation.
    // Example usage 1:
    //     {{#tr}}
    //         <p>some English text</p>
    //     {{/tr}}
    //
    // Example usage 2:
    //     {{#tr}}
    //         <p>This {variable} will get value from the current context</p>
    //     {{/tr}}
    //
    // Note: use `{` and `}` instead of `{{` and `}}` to declare
    // variables.
    const message = options
        .fn(this)
        .trim()
        .split("\n")
        .map((s) => s.trim())
        .join(" ");
    const descriptor = {id: message, defaultMessage: message};
    const partials: Partial<Record<string, (context: Context, options: unknown) => string>> =
        "partials" in options.fn &&
        typeof options.fn.partials === "object" &&
        options.fn.partials !== null
            ? options.fn.partials
            : {};
    const result = intl.formatMessage(descriptor, {
        ...default_html_elements,
        ...Object.fromEntries(
            Object.entries(partials).map(([name, value]) => [
                name,
                (content_html: string[]) =>
                    value!(this, {data: {"partial-block": () => content_html.join("")}}),
            ]),
        ),
        ...Object.fromEntries(
            Object.entries(this).flatMap(([key, value]): [string, string | number | Date][] =>
                typeof value === "string"
                    ? [[key, Handlebars.Utils.escapeExpression(value)]]
                    : typeof value === "number" || value instanceof Date
                      ? [[key, value]]
                      : [],
            ),
        ),
    });
    return new Handlebars.SafeString(result);
});

Handlebars.registerHelper(
    "rendered_markdown",
    (content: string) => new Handlebars.SafeString(postprocess_content(content)),
);

Handlebars.registerHelper("numberFormat", (number: number) => number.toLocaleString());

Handlebars.registerHelper("tooltip_hotkey_hints", (...args) => {
    args.pop(); // Handlebars options
    const hotkeys: string[] = args;
    let hotkey_hints = "";
    common.adjust_mac_hotkey_hints(hotkeys);
    for (const hotkey of hotkeys) {
        hotkey_hints += `<span class="tooltip-hotkey-hint">${hotkey}</span>`;
    }
    const result = `<span class="tooltip-hotkey-hints">${hotkey_hints}</span>`;
    return new Handlebars.SafeString(result);
});

Handlebars.registerHelper("popover_hotkey_hints", (...args) => {
    args.pop(); // Handlebars options
    const hotkeys: string[] = args;
    let hotkey_hints = "";
    common.adjust_mac_hotkey_hints(hotkeys);
    const shift_hotkey_exists = common.adjust_shift_hotkey(hotkeys);
    for (const hotkey of hotkeys) {
        // The ⌘ symbol isn't vertically centered, so we use an icon.
        if (hotkey === "⌘") {
            hotkey_hints += `<span class="popover-menu-hotkey-hint"><i class="zulip-icon zulip-icon-mac-command" aria-hidden="true"></i></span>`;
        } else {
            hotkey_hints += `<span class="popover-menu-hotkey-hint">${hotkey}</span>`;
        }
    }
    if (shift_hotkey_exists) {
        return new Handlebars.SafeString(
            `<span class="popover-menu-hotkey-hints popover-contains-shift-hotkey" data-hotkey-hints="${hotkeys.join(",")}">${hotkey_hints}</span>`,
        );
    }
    return new Handlebars.SafeString(
        `<span class="popover-menu-hotkey-hints">${hotkey_hints}</span>`,
    );
});

// The below section is for registering global Handlebar partials.

// The "input_wrapper" partial block located at web/templates/components/input_wrapper.hbs
// is used to wrap any input element that needs to be styled as a Zulip input.
// Usage example:
//    {{#> input_wrapper . input_type="filter-input" custom_classes="inbox-search-wrapper" icon="search" input_button_icon="close"}}
//        <input type="text" id="{{INBOX_SEARCH_ID}}" class="input-element" value="{{search_val}}" autocomplete="off" placeholder="{{t 'Filter' }}" />
//    {{/input_wrapper}}
Handlebars.registerPartial("input_wrapper", render_input_wrapper);
```

--------------------------------------------------------------------------------

---[FILE: tenor.ts]---
Location: zulip-main/web/src/tenor.ts
Signals: Zod

```typescript
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";
import * as z from "zod/mini";

import render_gif_picker_ui from "../templates/gif_picker_ui.hbs";
import render_tenor_gif from "../templates/tenor_gif.hbs";

import * as channel from "./channel.ts";
import * as compose_ui from "./compose_ui.ts";
import {get_rating} from "./gif_state.ts";
import * as popover_menus from "./popover_menus.ts";
import * as rows from "./rows.ts";
import * as scroll_util from "./scroll_util.ts";
import {realm} from "./state_data.ts";
import * as ui_util from "./ui_util.ts";
import {user_settings} from "./user_settings.ts";

const tenor_rating_map = {
    // Source: https://developers.google.com/tenor/guides/content-filtering#ContentFilter-options
    pg: "medium",
    g: "high",
    r: "off",
    "pg-13": "low",
};

const tenor_result_schema = z.object({
    results: z.array(
        z.object({
            media_formats: z.object({
                tinygif: z.object({
                    url: z.url(),
                }),
                mediumgif: z.object({
                    url: z.url(),
                }),
            }),
        }),
    ),
    // This denotes the identifier to use for the next API call
    // to fetch the next set of results for the current query.
    next: z.string(),
});

// Only used if popover called from edit message, otherwise it is `undefined`.
let edit_message_id: number | undefined;
let next_pos_identifier: string | number | undefined;
let is_loading_more = false;
let tenor_popover_instance: tippy.Instance | undefined;
let current_search_term: undefined | string;
const BASE_URL = "https://tenor.googleapis.com/v2";
// Stores the index of the last GIF that is part of the grid.
let last_gif_index = -1;

type TenorPayload = {
    key: string;
    client_key: string;
    limit: string;
    media_filter: string;
    locale: string;
    contentfilter: string;
    pos?: typeof next_pos_identifier;
    q?: string;
};

export function is_popped_from_edit_message(): boolean {
    return tenor_popover_instance !== undefined && edit_message_id !== undefined;
}

export function focus_current_edit_message(): void {
    assert(edit_message_id !== undefined);
    $(`#edit_form_${CSS.escape(`${edit_message_id}`)} .message_edit_content`).trigger("focus");
}

function get_base_payload(): TenorPayload {
    return {
        key: realm.tenor_api_key,
        client_key: "ZulipWeb",
        limit: "15",
        // We use the tinygif size for the picker UI, and the mediumgif size
        // for what gets actually uploaded.
        media_filter: "tinygif,mediumgif",
        locale: user_settings.default_language,
        contentfilter: tenor_rating_map[get_rating()],
    };
}

function handle_gif_click(img_element: HTMLElement): void {
    const insert_url = img_element.dataset["insertUrl"];
    assert(insert_url !== undefined);

    let $textarea = $<HTMLTextAreaElement>("textarea#compose-textarea");
    if (edit_message_id !== undefined) {
        $textarea = $(`#edit_form_${CSS.escape(`${edit_message_id}`)} .message_edit_content`);
    }

    compose_ui.insert_syntax_and_focus(`[](${insert_url})`, $textarea, "block", 1);
    hide_tenor_popover();
}

function focus_gif_at_index(index: number): void {
    if (index < 0 || index > last_gif_index) {
        assert(tenor_popover_instance !== undefined);
        const $popper = $(tenor_popover_instance.popper);
        // Just trigger focus on the search input because there are no GIFs
        // above or below.
        $popper.find("#gif-search-query").trigger("focus");
        return;
    }

    const $target_gif = $(`img.tenor-gif[data-gif-index='${index}']`);
    $target_gif.trigger("focus");
}

function handle_keyboard_navigation_on_gif(e: JQuery.KeyDownEvent): void {
    assert(e.currentTarget instanceof HTMLElement);
    const key = e.key;
    const is_alpha_numeric = /^[a-zA-Z0-9]$/i.test(key);
    if (is_alpha_numeric) {
        // This implies that the user is focused on some GIF
        // but wants to continue searching.
        assert(tenor_popover_instance !== undefined);
        const $popper = $(tenor_popover_instance.popper);
        $popper.find("#gif-search-query").trigger("focus");
        return;
    }
    if (key === "Enter" || key === " " || key === "Spacebar") {
        // Meant to avoid page scroll on pressing space.
        e.preventDefault();
        handle_gif_click(e.currentTarget);
        return;
    }

    const curr_gif_index = Number.parseInt(e.currentTarget.dataset["gifIndex"]!, 10);
    switch (key) {
        case "ArrowRight": {
            focus_gif_at_index(curr_gif_index + 1);
            break;
        }
        case "ArrowLeft": {
            focus_gif_at_index(curr_gif_index - 1);
            break;
        }
        case "ArrowUp": {
            focus_gif_at_index(curr_gif_index - 3);
            break;
        }
        case "ArrowDown": {
            focus_gif_at_index(curr_gif_index + 3);
            break;
        }
    }
}

export function hide_tenor_popover(): boolean {
    // Returns `true` if the popover was open.
    if (tenor_popover_instance) {
        tenor_popover_instance.destroy();
        tenor_popover_instance = undefined;
        edit_message_id = undefined;
        next_pos_identifier = undefined;
        current_search_term = undefined;
        is_loading_more = false;
        return true;
    }
    return false;
}

function render_gifs_to_grid(raw_tenor_result: unknown, next_page: boolean): void {
    // Tenor popover may have been hidden by the
    // time this function is called.
    if (tenor_popover_instance === undefined) {
        return;
    }
    const parsed_data = tenor_result_schema.parse(raw_tenor_result);
    const urls = parsed_data.results.map((result) => ({
        preview_url: result.media_formats.tinygif.url,
        insert_url: result.media_formats.mediumgif.url,
    }));
    next_pos_identifier = parsed_data.next;
    let gif_grid_html = "";

    if (!next_page) {
        last_gif_index = -1;
    }
    for (const url of urls) {
        last_gif_index += 1;
        gif_grid_html += render_tenor_gif({
            preview_url: url.preview_url,
            insert_url: url.insert_url,
            gif_index: last_gif_index,
        });
    }
    const $popper = $(tenor_popover_instance.popper);
    if (next_page) {
        $popper.find(".tenor-content").append($(gif_grid_html));
    } else {
        $popper.find(".gif-scrolling-container .simplebar-content-wrapper").scrollTop(0);
        $popper.find(".tenor-content").html(gif_grid_html);
    }

    is_loading_more = false;
}

function render_featured_gifs(next_page: boolean): void {
    if (is_loading_more || (current_search_term !== undefined && current_search_term.length > 0)) {
        return;
    }
    let data = get_base_payload();

    if (next_page) {
        is_loading_more = true;
        data = {...data, pos: next_pos_identifier};
    }
    void channel.get({
        url: `${BASE_URL}/featured`,
        data,
        success(raw_tenor_result) {
            render_gifs_to_grid(raw_tenor_result, next_page);
        },
    });
}

function update_grid_with_search_term(search_term: string, next_page = false): void {
    if (is_loading_more || (search_term.trim() === current_search_term && !next_page)) {
        return;
    }
    // We set `current_search_term` here to avoid using to a stale
    // version of the search term in `render_featured_gifs` for return checks
    // in case the current `search_term` is empty.
    current_search_term = search_term;
    if (search_term.trim().length === 0) {
        render_featured_gifs(next_page);
        return;
    }
    let data: TenorPayload = {
        q: search_term,
        ...get_base_payload(),
    };

    if (next_page) {
        is_loading_more = true;
        data = {...data, pos: next_pos_identifier};
    }

    void channel.get({
        url: `${BASE_URL}/search`,
        data,
        success(raw_tenor_result) {
            render_gifs_to_grid(raw_tenor_result, next_page);
        },
    });
}

function toggle_tenor_popover(target: HTMLElement): void {
    popover_menus.toggle_popover_menu(
        target,
        {
            theme: "popover-menu",
            placement: "top",
            onCreate(instance) {
                instance.setContent(ui_util.parse_html(render_gif_picker_ui({is_giphy: false})));
                $(instance.popper).addClass("tenor-popover");
            },
            onShow(instance) {
                tenor_popover_instance = instance;
                const $popper = $(instance.popper).trigger("focus");
                const debounced_search = _.debounce((search_term: string) => {
                    update_grid_with_search_term(search_term);
                }, 300);
                const $click_target = $(instance.reference);
                if ($click_target.parents(".message_edit_form").length === 1) {
                    // Store message id in global variable edit_message_id so that
                    // its value can be further used to correctly find the message textarea element.
                    edit_message_id = rows.id($click_target.parents(".message_row"));
                } else {
                    edit_message_id = undefined;
                }
                $popper.on("keyup", "#gif-search-query", (e) => {
                    assert(e.target instanceof HTMLInputElement);
                    if (e.key === "ArrowDown") {
                        // Trigger arrow key based navigation on the grid by focusing
                        // the first grid element.
                        focus_gif_at_index(0);
                        return;
                    }
                    debounced_search(e.target.value);
                });
                $popper.on("click", ".tenor-gif", (e) => {
                    assert(e.currentTarget instanceof HTMLElement);
                    handle_gif_click(e.currentTarget);
                });
                $popper.on("click", "#gif-search-clear", (e) => {
                    e.stopPropagation();
                    $("#gif-search-query").val("");
                    update_grid_with_search_term("");
                });
                $popper.on("keydown", ".tenor-gif", handle_keyboard_navigation_on_gif);
            },
            onMount(instance) {
                render_featured_gifs(false);
                const $popper = $(instance.popper);
                $popper.find("#gif-search-query").trigger("focus");

                const scroll_element = scroll_util.get_scroll_element(
                    $(".gif-scrolling-container"),
                )[0];
                assert(scroll_element instanceof HTMLElement);

                scroll_element.addEventListener("scroll", () => {
                    if (
                        scroll_element.scrollTop + scroll_element.clientHeight >
                        scroll_element.scrollHeight - scroll_element.clientHeight
                    ) {
                        if (is_loading_more) {
                            return;
                        }
                        if (current_search_term === undefined) {
                            render_featured_gifs(true);
                            return;
                        }
                        update_grid_with_search_term(current_search_term, true);
                    }
                });
            },
            onHidden() {
                hide_tenor_popover();
            },
        },
        {
            show_as_overlay_on_mobile: true,
            show_as_overlay_always: false,
        },
    );
}

function register_click_handlers(): void {
    $("body").on(
        "click",
        ".compose_control_button.compose-gif-icon-tenor",
        function (this: HTMLElement) {
            toggle_tenor_popover(this);
        },
    );
}

export function initialize(): void {
    register_click_handlers();
}
```

--------------------------------------------------------------------------------

---[FILE: theme.ts]---
Location: zulip-main/web/src/theme.ts

```typescript
import $ from "jquery";

import {localstorage} from "./localstorage.ts";
import * as message_lists from "./message_lists.ts";
import * as realm_logo from "./realm_logo.ts";
import * as settings_config from "./settings_config.ts";
import {user_settings} from "./user_settings.ts";

const ls = localstorage();

function set_dark_theme(): void {
    $(":root").removeClass("color-scheme-automatic").addClass("dark-theme");
}

function set_light_theme(): void {
    $(":root").removeClass("color-scheme-automatic").removeClass("dark-theme");
}

function set_automatic_theme(): void {
    $(":root").removeClass("dark-theme").addClass("color-scheme-automatic");
}

export function set_theme(color_scheme: number): void {
    if (color_scheme === settings_config.color_scheme_values.dark.code) {
        set_dark_theme();
    } else if (color_scheme === settings_config.color_scheme_values.light.code) {
        set_light_theme();
    } else {
        // If the color_scheme_code is not valid, fallback to automatic.
        set_automatic_theme();
    }
}

export function set_theme_and_update(color_scheme: number): void {
    set_theme(color_scheme);
    // We cannot update recipient bar color and the realm logo variant
    // using `set_theme` since that function is being called in the
    // `ui_init` module before message_lists and realm_logo are initialized
    // and the order cannot be changed.
    message_lists.update_recipient_bar_background_color();
    realm_logo.render();
}

function get_theme_for_spectator(): number {
    // If the spectator has not set a theme preference, fallback to automatic.
    return (
        Number(ls.get("spectator-theme-preference")) ||
        settings_config.color_scheme_values.automatic.code
    );
}

export function set_theme_for_spectator(color_scheme: number): void {
    // Since we don't have events for spectators and handle the theme using
    // localstorage, the theme change does not reflect across tabs.
    ls.set("spectator-theme-preference", color_scheme);
    user_settings.color_scheme = color_scheme;
    set_theme_and_update(color_scheme);
}

export function initialize_theme_for_spectator(): void {
    const color_scheme = get_theme_for_spectator();
    user_settings.color_scheme = color_scheme;
    set_theme(color_scheme);
}
```

--------------------------------------------------------------------------------

---[FILE: thumbnail.ts]---
Location: zulip-main/web/src/thumbnail.ts
Signals: Zod

```typescript
import type * as z from "zod/mini";

import {realm} from "./state_data.ts";
import type {thumbnail_format_schema} from "./state_data.ts";

type ThumbnailFormat = z.infer<typeof thumbnail_format_schema>;

export const thumbnail_formats: ThumbnailFormat[] = [];

export let preferred_format: ThumbnailFormat;
export let animated_format: ThumbnailFormat;

export function initialize(): void {
    // Go looking for the size closest to 840px wide.  We assume all browsers
    // support webp.
    const format_preferences = ["webp", "jpg", "gif"];
    const sorted_formats = realm.server_thumbnail_formats.toSorted((a, b) => {
        if (a.max_width !== b.max_width) {
            return Math.abs(a.max_width - 840) < Math.abs(b.max_width - 840) ? -1 : 1;
        } else if (a.format !== b.format) {
            let a_index = format_preferences.indexOf(a.format);
            if (a_index === -1) {
                a_index = format_preferences.length;
            }
            let b_index = format_preferences.indexOf(b.format);
            if (b_index === -1) {
                b_index = format_preferences.length;
            }
            return a_index - b_index;
        }

        return 0;
    });
    preferred_format = sorted_formats.find((format) => !format.animated)!;
    animated_format = sorted_formats.find((format) => format.animated)!;
}
```

--------------------------------------------------------------------------------

````
