---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 616
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 616 of 1290)

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

---[FILE: flatpickr.ts]---
Location: zulip-main/web/src/flatpickr.ts

```typescript
import {formatISO} from "date-fns";
import flatpickr from "flatpickr";
import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate";
import $ from "jquery";
import assert from "minimalistic-assert";

import {$t} from "./i18n.ts";
import {user_settings} from "./user_settings.ts";
import * as util from "./util.ts";

export let flatpickr_instance: flatpickr.Instance | undefined;

export function is_open(): boolean {
    return Boolean(flatpickr_instance?.isOpen);
}

function is_numeric_key(key: string): boolean {
    return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key);
}

export function show_flatpickr(
    element: HTMLElement,
    callback: (time: string) => void,
    default_timestamp: flatpickr.Options.DateOption,
    options: flatpickr.Options.Options = {},
): flatpickr.Instance {
    const $flatpickr_input = $<HTMLInputElement>("<input>").attr("id", "#timestamp_flatpickr");

    flatpickr_instance = flatpickr(util.the($flatpickr_input), {
        mode: "single",
        enableTime: true,
        clickOpens: false,
        defaultDate: default_timestamp,
        plugins: [
            confirmDatePlugin({
                showAlways: true,
                confirmText: $t({defaultMessage: "Confirm"}),
                confirmIcon: "",
            }),
        ],
        positionElement: element,
        dateFormat: "Z",
        formatDate: (date) => formatISO(date),
        disableMobile: true,
        time_24hr: user_settings.twenty_four_hour_time,
        minuteIncrement: 1,
        onKeyDown(_selectedDates, _dateStr, instance, event: KeyboardEvent) {
            // See also the keydown handler below.
            //
            // TODO: Add a clear explanation of exactly how key
            // interactions are dispatched; it seems that keyboard
            // logic from this function, the built-in flatpickr
            // onKeyDown function, and the below keydown handler are
            // used, but it's not at all clear in what order they are
            // called, or what the overall control flow is.
            if (event.key === "Tab") {
                // Ensure that tab/shift_tab navigation work to
                // navigate between the elements in flatpickr itself
                // and the confirmation button at the bottom of the
                // popover.
                const elems = [
                    instance.selectedDateElem,
                    instance.hourElement,
                    instance.minuteElement,
                    ...(user_settings.twenty_four_hour_time ? [] : [instance.amPM]),
                    $(".flatpickr-confirm")[0],
                ];
                assert(event.target instanceof HTMLElement);
                const i = elems.indexOf(event.target);
                const n = elems.length;
                const remain = (i + (event.shiftKey ? -1 : 1)) % n;
                const target = elems[Math.floor(remain >= 0 ? remain : remain + n)];
                event.preventDefault();
                event.stopPropagation();
                assert(target !== undefined);
                target.focus();
            } else {
                // Prevent keypresses from propagating to our general hotkey.ts
                // logic. Without this, `Up` will navigate both in the
                // flatpickr instance and in the message feed behind
                // it.
                event.stopPropagation();
            }
        },
        ...options,
    });

    const $container = $(flatpickr_instance.calendarContainer);

    $container.on("keydown", (e) => {
        // Main keyboard UI implementation.

        if (is_numeric_key(e.key)) {
            // Let users type numeric values
            return true;
        }

        if (e.key === "Backspace" || e.key === "Delete") {
            // Let backspace or delete be handled normally
            return true;
        }

        if (e.key === "Enter") {
            if (e.target.classList[0] === "flatpickr-day") {
                // use flatpickr's built-in behavior to choose the selected day.
                return true;
            }
            $container.find(".flatpickr-confirm").trigger("click");
        }

        if (e.key === "Escape") {
            flatpickr_instance?.close();
            flatpickr_instance?.destroy();
        }

        if (e.key === "Tab") {
            // Use flatpickr's built-in navigation between elements.
            return true;
        }

        if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(e.key)) {
            // use flatpickr's built-in navigation of the date grid.
            return true;
        }

        e.stopPropagation();
        e.preventDefault();

        return true;
    });

    $container.on("click", ".flatpickr-confirm", () => {
        const time = $flatpickr_input.val();
        assert(typeof time === "string");
        callback(time);
        flatpickr_instance?.close();
        flatpickr_instance?.destroy();
    });
    flatpickr_instance.open();
    assert(flatpickr_instance.selectedDateElem !== undefined);
    flatpickr_instance.selectedDateElem.focus();

    return flatpickr_instance;
}

export function close_all(): void {
    $(".flatpickr-calendar").removeClass("open");
}
```

--------------------------------------------------------------------------------

---[FILE: fold_dict.ts]---
Location: zulip-main/web/src/fold_dict.ts

```typescript
/*
    Use this class to manage keys where you don't care
    about case (i.e. case-insensitive).

    Keys for FoldDict should be strings.  We "fold" all
    casings of "alice" (e.g. "ALICE", "Alice", "ALIce", etc.)
    to "alice" as the key.

    Examples of case-insensitive data in Zulip are:
        - emails
        - stream names
        - topics
        - etc.
 */
type KeyValue<V> = {k: string; v: V};

export class FoldDict<V> {
    private _items = new Map<string, KeyValue<V>>();

    get size(): number {
        return this._items.size;
    }

    get(key: string): V | undefined {
        const mapping = this._items.get(this._munge(key));
        if (mapping === undefined) {
            return undefined;
        }
        return mapping.v;
    }

    set(key: string, value: V): this {
        this._items.set(this._munge(key), {k: key, v: value});
        return this;
    }

    has(key: string): boolean {
        return this._items.has(this._munge(key));
    }

    delete(key: string): boolean {
        return this._items.delete(this._munge(key));
    }

    *keys(): IterableIterator<string> {
        for (const {k} of this._items.values()) {
            yield k;
        }
    }

    *values(): IterableIterator<V> {
        for (const {v} of this._items.values()) {
            yield v;
        }
    }

    *[Symbol.iterator](): IterableIterator<[string, V]> {
        for (const {k, v} of this._items.values()) {
            yield [k, v];
        }
    }

    clear(): void {
        this._items.clear();
    }

    // Handle case-folding of keys and the empty string.
    private _munge(key: string): string {
        if (key === undefined) {
            throw new TypeError("Tried to call a FoldDict method with an undefined key.");
        }

        return key.toLowerCase();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: gear_menu.ts]---
Location: zulip-main/web/src/gear_menu.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_navbar_gear_menu_popover from "../templates/popovers/navbar/navbar_gear_menu_popover.hbs";

import * as demo_organizations_ui from "./demo_organizations_ui.ts";
import * as information_density from "./information_density.ts";
import * as popover_menus from "./popover_menus.ts";
import * as popover_menus_data from "./popover_menus_data.ts";
import * as popovers from "./popovers.ts";
import * as settings_preferences from "./settings_preferences.ts";
import * as theme from "./theme.ts";
import {parse_html} from "./ui_util.ts";
import {user_settings} from "./user_settings.ts";

/*
For various historical reasons there isn't one
single chunk of code that really makes our gear
menu function.  In this comment I try to help
you know where to look for relevant code.

The module that you're reading now doesn't
actually do much of the work.

Our gear menu has these choices:

=================
hash:  Channel settings
hash:  Settings
hash:  Organization settings
link:  Usage statistics
---
link:  Help center
info:  Keyboard shortcuts
info:  Message formatting
info:  Search filters
hash:  About Zulip
---
link:  Desktop & mobile apps
link:  Integrations
link:  API documentation
link:  Sponsor Zulip
link:  Plans and pricing
---
hash:   Invite users
---
misc:  Logout
=================

Depending on settings, there may also be choices
like "Feedback" or "Debug".

The menu items get built in a handlebars template
called gear_menu_popover.hbs.

The menu itself has the selector
"settings-dropdown".

The items with the prefix of "hash:" are in-page
links:

    #channels
    #settings
    #organization
    #about-zulip
    #invite

When you click on the links there is a function
called hashchanged() in web/src/hashchange.ts
that gets invoked.  (We register this as a listener
for the hashchange event.)  This function then
launches the appropriate modal for each menu item.
Look for things like subs.launch(...) or
invite.launch() in that code.

Some items above are prefixed with "link:".  Those
items, when clicked, just use the normal browser
mechanism to link to external pages, and they
have a target of "_blank".

The "info:" items use our info overlay system
in web/src/info_overlay.ts.  They are dispatched
using a click handler in web/src/click_handlers.ts.
The click handler uses "[data-overlay-trigger]" as
the selector and then calls browser_history.go_to_location.
*/

function render(instance: tippy.Instance): void {
    const rendered_gear_menu = render_navbar_gear_menu_popover(
        popover_menus_data.get_gear_menu_content_context(),
    );
    instance.setContent(parse_html(rendered_gear_menu));
    $("#gear-menu").addClass("active-navbar-menu");
}

export function initialize(): void {
    popover_menus.register_popover_menu("#gear-menu", {
        theme: "popover-menu",
        placement: "bottom",
        offset: [-50, 0],
        popperOptions: {
            strategy: "fixed",
            modifiers: [
                {
                    name: "eventListeners",
                    options: {
                        scroll: false,
                    },
                },
            ],
        },
        onMount(instance) {
            const $popper = $(instance.popper);
            popover_menus.popover_instances.gear_menu = instance;

            $popper.on("click", ".convert-demo-organization", (e) => {
                popover_menus.hide_current_popover_if_visible(instance);
                e.preventDefault();
                e.stopPropagation();
                demo_organizations_ui.show_convert_demo_organization_modal();
            });

            $popper.on("click", ".change-language-spectator", (e) => {
                popover_menus.hide_current_popover_if_visible(instance);
                e.preventDefault();
                e.stopPropagation();
                settings_preferences.launch_default_language_setting_modal_for_spectator();
            });

            $popper.on("change", "input[name='theme-select']", (e) => {
                const theme_code = Number.parseInt($(e.currentTarget).attr("data-theme-code")!, 10);
                requestAnimationFrame(() => {
                    theme.set_theme_for_spectator(theme_code);
                });
            });

            $popper.on("click", ".info-density-controls button", function (this: HTMLElement, e) {
                const changed_property =
                    information_density.information_density_properties_schema.parse(
                        $(this).closest(".button-group").attr("data-property"),
                    );
                information_density.update_information_density_settings($(this), changed_property);
                information_density.enable_or_disable_control_buttons($popper);

                if (changed_property === "web_font_size_px") {
                    // We do not want to display the arrow once font size is
                    // changed because popover will be detached from the gear
                    // icon as we do not change the font size in popover.
                    $("#gear-menu-dropdown").closest(".tippy-box").find(".tippy-arrow").hide();
                }

                e.preventDefault();
            });

            information_density.enable_or_disable_control_buttons($popper);

            // We do not want font size of the popover to change when changing
            // font size using the buttons in popover, so that the buttons do
            // not shift.
            const font_size =
                popover_menus.POPOVER_FONT_SIZE_IN_EM * user_settings.web_font_size_px;
            $("#gear-menu-dropdown")
                .closest(".tippy-box")
                .css("font-size", font_size + "px");
        },
        onShow: render,
        onHidden(instance) {
            $("#gear-menu").removeClass("active-navbar-menu");
            instance.destroy();
            popover_menus.popover_instances.gear_menu = null;
        },
    });
}

export function toggle(): void {
    if (popover_menus.is_gear_menu_popover_displayed()) {
        popovers.hide_all();
        return;
    }

    // Since this can be called via hotkey, we need to
    // hide any other popovers that may be open before.
    if (popovers.any_active()) {
        popovers.hide_all();
    }

    $("#gear-menu").trigger("click");
}

export function rerender(): void {
    if (popover_menus.is_gear_menu_popover_displayed()) {
        const instance = popover_menus.get_gear_menu_instance();
        assert(instance !== null);
        render(instance);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: gear_menu_util.ts]---
Location: zulip-main/web/src/gear_menu_util.ts

```typescript
import {$t} from "./i18n.ts";
import {realm} from "./state_data.ts";

export function version_display_string(): string {
    const version = realm.zulip_version;
    const is_fork = realm.zulip_merge_base && realm.zulip_merge_base !== version;

    if (realm.zulip_version.endsWith("-dev+git")) {
        // The development environment uses this version string format.
        return $t({defaultMessage: "Zulip Server dev environment"});
    }

    if (is_fork) {
        // For forks, we want to describe the Zulip version this was
        // forked from, and that it was modified.
        const display_version = realm.zulip_merge_base
            .replace(/\+git.*/, "")
            .replace(/(-beta\d+).*/, "$1")
            .replace(/-dev.*/, "-dev");
        return $t({defaultMessage: "Zulip Server {display_version} (modified)"}, {display_version});
    }

    // The below cases are all for official versions; either a
    // release, or Git commit from one of Zulip's official branches.

    if (version.includes("+git")) {
        // A version from a Zulip official maintenance branch such as 5.x.
        const display_version = version.replace(/\+git.*/, "");
        return $t({defaultMessage: "Zulip Server {display_version} (patched)"}, {display_version});
    }

    const display_version = version.replace(/\+git.*/, "").replace(/-dev.*/, "-dev");
    return $t({defaultMessage: "Zulip Server {display_version}"}, {display_version});
}
```

--------------------------------------------------------------------------------

---[FILE: gif_state.ts]---
Location: zulip-main/web/src/gif_state.ts

```typescript
import $ from "jquery";

import * as blueslip from "./blueslip.ts";
import {realm} from "./state_data.ts";

type GifRating = "pg" | "pg-13" | "r" | "g";

export function is_tenor_enabled(): boolean {
    return (
        realm.tenor_api_key !== "" &&
        realm.realm_giphy_rating !== realm.gif_rating_options.disabled.id
    );
}

export function is_giphy_enabled(): boolean {
    return (
        realm.giphy_api_key !== "" &&
        realm.realm_giphy_rating !== realm.gif_rating_options.disabled.id
    );
}

export function get_rating(): GifRating {
    const options = realm.gif_rating_options;
    for (const rating of ["pg", "g", "pg-13", "r"] as const) {
        if (options[rating]?.id === realm.realm_giphy_rating) {
            return rating;
        }
    }

    // The below should never run unless a server bug allowed a
    // `gif_rating` value not present in `gif_rating_options`.
    blueslip.error("Invalid gif_rating value: " + realm.realm_giphy_rating);
    return "g";
}

export function update_gif_rating(): void {
    // Updating the GIF ratings would only result in us showing/hiding
    // the currently set GIF icon.
    // It won't change the GIF provider without a server restart as of now.
    if (realm.realm_giphy_rating === realm.gif_rating_options.disabled.id) {
        $(".zulip-icon-gif").hide();
    } else {
        $(".zulip-icon-gif").show();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: giphy.ts]---
Location: zulip-main/web/src/giphy.ts

```typescript
import type {GifsResult, GiphyFetch} from "@giphy/js-fetch-api";
import type {IGif} from "@giphy/js-types";
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_gif_picker_ui from "../templates/gif_picker_ui.hbs";

import * as compose_ui from "./compose_ui.ts";
import * as gif_state from "./gif_state.ts";
import * as popover_menus from "./popover_menus.ts";
import * as rows from "./rows.ts";
import {realm} from "./state_data.ts";
import * as ui_util from "./ui_util.ts";
import {the} from "./util.ts";

let giphy_fetch: GiphyFetch | undefined;
let search_term = "";
let gifs_grid: {remove: () => void} | undefined;
let giphy_popover_instance: tippy.Instance | undefined;

// Only used if popover called from edit message, otherwise it is `undefined`.
let edit_message_id: number | undefined;

export function is_popped_from_edit_message(): boolean {
    return giphy_popover_instance !== undefined && edit_message_id !== undefined;
}

export function focus_current_edit_message(): void {
    assert(edit_message_id !== undefined);
    $(`#edit_form_${CSS.escape(`${edit_message_id}`)} .message_edit_content`).trigger("focus");
}

async function renderGIPHYGrid(targetEl: HTMLElement): Promise<{remove: () => void}> {
    const {renderGrid} = await import(/* webpackChunkName: "giphy-sdk" */ "@giphy/js-components");
    const {GiphyFetch} = await import(/* webpackChunkName: "giphy-sdk" */ "@giphy/js-fetch-api");

    giphy_fetch ??= new GiphyFetch(realm.giphy_api_key);

    async function fetchGifs(offset: number): Promise<GifsResult> {
        assert(giphy_fetch !== undefined);
        const config = {
            offset,
            limit: 25,
            rating: gif_state.get_rating(),
            // We don't pass random_id here, for privacy reasons.
        };
        if (search_term === "") {
            // Get the trending gifs by default.
            return giphy_fetch.trending(config);
        }
        return giphy_fetch.search(search_term, config);
    }

    const render = (): (() => void) =>
        // See https://github.com/Giphy/giphy-js/blob/master/packages/components/README.md#grid
        // for detailed documentation.
        renderGrid(
            {
                width: 300,
                fetchGifs,
                columns: 3,
                gutter: 6,
                noLink: true,
                // Hide the creator attribution that appears over a
                // GIF; nice in principle but too distracting.
                hideAttribution: true,
                onGifClick(props: IGif) {
                    let $textarea = $<HTMLTextAreaElement>("textarea#compose-textarea");
                    if (edit_message_id !== undefined) {
                        $textarea = $(
                            `#edit_form_${CSS.escape(`${edit_message_id}`)} .message_edit_content`,
                        );
                    }

                    compose_ui.insert_syntax_and_focus(
                        `[](${props.images.downsized_medium.url})`,
                        $textarea,
                        "block",
                        1,
                    );
                    hide_giphy_popover();
                },
            },
            targetEl,
        );

    // Limit the rate at which we do queries to the GIPHY API to
    // one per 300ms, in line with animation timing, basically to avoid
    // content appearing while the user is typing.
    const resizeRender = _.throttle(render, 300);
    window.addEventListener("resize", resizeRender, false);
    const remove = render();
    return {
        remove() {
            remove();
            window.removeEventListener("resize", resizeRender, false);
        },
    };
}

async function update_grid_with_search_term(): Promise<void> {
    if (!gifs_grid) {
        return;
    }

    const $search_elem = $<HTMLInputElement>("input#gif-search-query");
    // GIPHY popover may have been hidden by the
    // time this function is called.
    if ($search_elem.length > 0) {
        search_term = the($search_elem).value;
        gifs_grid.remove();
        gifs_grid = await renderGIPHYGrid(the($(".gif-grid-in-popover .giphy-content")));
        return;
    }

    // Set to undefined to stop searching.
    gifs_grid = undefined;
}

export function hide_giphy_popover(): boolean {
    // Returns `true` if the popover was open.
    if (giphy_popover_instance) {
        giphy_popover_instance.destroy();
        giphy_popover_instance = undefined;
        edit_message_id = undefined;
        gifs_grid = undefined;
        return true;
    }
    return false;
}

function toggle_giphy_popover(target: HTMLElement): void {
    popover_menus.toggle_popover_menu(
        target,
        {
            theme: "popover-menu",
            placement: "top",
            onCreate(instance) {
                instance.setContent(ui_util.parse_html(render_gif_picker_ui({is_giphy: true})));
                $(instance.popper).addClass("giphy-popover");
            },
            onShow(instance) {
                giphy_popover_instance = instance;
                const $popper = $(giphy_popover_instance.popper).trigger("focus");

                const $click_target = $(instance.reference);
                if ($click_target.parents(".message_edit_form").length === 1) {
                    // Store message id in global variable edit_message_id so that
                    // its value can be further used to correctly find the message textarea element.
                    edit_message_id = rows.id($click_target.parents(".message_row"));
                } else {
                    edit_message_id = undefined;
                }

                $(document).one("compose_canceled.zulip compose_finished.zulip", () => {
                    hide_giphy_popover();
                });

                $popper.on(
                    "keyup",
                    "#gif-search-query",
                    // Use debounce to create a 300ms interval between
                    // every search. This makes the UX of searching pleasant
                    // by allowing user to finish typing before search
                    // is executed.
                    _.debounce(() => void update_grid_with_search_term(), 300),
                );

                $popper.on("keydown", ".giphy-gif", ui_util.convert_enter_to_click);
                $popper.on("keydown", ".compose-gif-icon-giphy", ui_util.convert_enter_to_click);
                $popper.on("click", "#gif-search-clear", (e) => {
                    e.stopPropagation();
                    $("#gif-search-query").val("");
                    void update_grid_with_search_term();
                });

                void (async () => {
                    gifs_grid = await renderGIPHYGrid(the($popper.find(".giphy-content")));

                    // Focus on search box by default.
                    // This is specially helpful for users
                    // navigating via keyboard.
                    $("#gif-search-query").trigger("focus");
                })();
            },
            onHidden() {
                hide_giphy_popover();
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
        ".compose_control_button.compose-gif-icon-giphy",
        function (this: HTMLElement) {
            toggle_giphy_popover(this);
        },
    );
}

export function initialize(): void {
    register_click_handlers();
}
```

--------------------------------------------------------------------------------

---[FILE: global.ts]---
Location: zulip-main/web/src/global.ts

```typescript
import type * as zulip_test_module from "./zulip_test.ts";

type JQueryCaretRange = {
    start: number;
    end: number;
    length: number;
    text: string;
};

type JQueryIdleOptions = Partial<{
    idle: number;
    events: string;
    onIdle: () => void;
    onActive: () => void;
    keepTracking: boolean;
}>;

declare global {
    const zulip_test: typeof zulip_test_module;

    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JQueryValidation {
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        interface ValidationOptions {
            // This is only defined so that this.defaultShowErrors!() can be called from showErrors.
            // It isn't really a validation option to be supplied.
            defaultShowErrors?: () => void;
        }
    }

    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface JQuery {
        expectOne: () => this;
        get_offset_to_window: () => DOMRect;
        tab: (action?: string) => this; // From web/third/bootstrap

        // Types for jquery-caret-plugin
        caret: (() => number) & ((arg: number | string) => this);
        range: (() => JQueryCaretRange) &
            ((start: number, end?: number) => this) &
            ((text: string) => this);
        selectAll: () => this;
        deselectAll: () => this;

        // Types for jquery-idle plugin
        idle: (opts: JQueryIdleOptions) => {
            cancel: () => void;
            reset: () => void;
        };
    }

    const DEVELOPMENT: boolean;
    const ZULIP_VERSION: string;
}
```

--------------------------------------------------------------------------------

````
