---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 662
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 662 of 1290)

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

---[FILE: scheduled_messages_ui.ts]---
Location: zulip-main/web/src/scheduled_messages_ui.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import render_compose_banner from "../templates/compose_banner/compose_banner.hbs";

import * as compose_actions from "./compose_actions.ts";
import * as compose_banner from "./compose_banner.ts";
import {$t} from "./i18n.ts";
import * as message_view from "./message_view.ts";
import * as people from "./people.ts";
import * as scheduled_messages from "./scheduled_messages.ts";
import type {ScheduledMessage} from "./scheduled_messages.ts";
import * as timerender from "./timerender.ts";

type ScheduledMessageComposeArgs =
    | {
          message_type: "stream";
          stream_id: number;
          topic: string;
          content: string;
      }
    | {
          message_type: "private";
          private_message_recipient: string;
          content: string;
          keep_composebox_empty: boolean;
      };

export function hide_scheduled_message_success_compose_banner(scheduled_message_id: number): void {
    $(
        `.message_scheduled_success_compose_banner[data-scheduled-message-id=${scheduled_message_id}]`,
    ).hide();
}

function narrow_via_edit_scheduled_message(compose_args: ScheduledMessageComposeArgs): void {
    if (compose_args.message_type === "stream") {
        message_view.show(
            [
                {
                    operator: "channel",
                    operand: compose_args.stream_id.toString(),
                },
                {operator: "topic", operand: compose_args.topic},
            ],
            {trigger: "edit scheduled message"},
        );
    } else {
        message_view.show([{operator: "dm", operand: compose_args.private_message_recipient}], {
            trigger: "edit scheduled message",
        });
    }
}

export function open_scheduled_message_in_compose(
    scheduled_message: ScheduledMessage,
    should_narrow_to_recipient?: boolean,
): void {
    let compose_args;
    let narrow_args;

    if (scheduled_message.type === "stream") {
        compose_args = {
            message_type: "stream" as const,
            stream_id: scheduled_message.to,
            topic: scheduled_message.topic,
            content: scheduled_message.content,
        };
        narrow_args = compose_args;
    } else {
        const recipient_ids = scheduled_message.to.filter(
            (recipient_id) => !people.get_by_user_id(recipient_id).is_inaccessible_user,
        );
        const recipient_emails = recipient_ids.map(
            (recipient_id) => people.get_by_user_id(recipient_id).email,
        );
        compose_args = {
            message_type: "private" as const,
            private_message_recipient_ids: recipient_ids,
            content: scheduled_message.content,
            keep_composebox_empty: true,
        };
        // Narrow filters still use emails for PMs, though we'll
        // eventually want to migrate that as well.
        narrow_args = {
            message_type: "private" as const,
            private_message_recipient: recipient_emails.join(","),
            content: scheduled_message.content,
            keep_composebox_empty: true,
        };
    }

    if (should_narrow_to_recipient) {
        narrow_via_edit_scheduled_message(narrow_args);
    }

    compose_actions.start(compose_args);
    scheduled_messages.set_selected_schedule_timestamp(
        scheduled_message.scheduled_delivery_timestamp,
    );
}

function show_message_unscheduled_banner(scheduled_delivery_timestamp: number): void {
    const deliver_at = timerender.get_full_datetime(
        new Date(scheduled_delivery_timestamp * 1000),
        "time",
    );
    const unscheduled_banner_html = render_compose_banner({
        banner_type: compose_banner.WARNING,
        banner_text: $t({
            defaultMessage: "This message is no longer scheduled to be sent.",
        }),
        button_text: $t({defaultMessage: "Schedule for {deliver_at}"}, {deliver_at}),
        classname: compose_banner.CLASSNAMES.unscheduled_message,
    });
    compose_banner.append_compose_banner_to_banner_list(
        $(unscheduled_banner_html),
        $("#compose_banners"),
    );
}

export function edit_scheduled_message(
    scheduled_message_id: number,
    should_narrow_to_recipient = true,
): void {
    const scheduled_message = scheduled_messages.scheduled_messages_by_id.get(scheduled_message_id);
    assert(scheduled_message !== undefined);

    scheduled_messages.delete_scheduled_message(scheduled_message_id, () => {
        open_scheduled_message_in_compose(scheduled_message, should_narrow_to_recipient);
        show_message_unscheduled_banner(scheduled_message.scheduled_delivery_timestamp);
    });
}

export function initialize(): void {
    $("body").on("click", ".undo_scheduled_message", (e) => {
        const scheduled_message_id = Number.parseInt(
            $(e.target)
                .parents(".message_scheduled_success_compose_banner")
                .attr("data-scheduled-message-id")!,
            10,
        );
        const should_narrow_to_recipient = false;
        edit_scheduled_message(scheduled_message_id, should_narrow_to_recipient);
        e.preventDefault();
        e.stopPropagation();
    });
}
```

--------------------------------------------------------------------------------

---[FILE: scroll_bar.ts]---
Location: zulip-main/web/src/scroll_bar.ts

```typescript
import $ from "jquery";

import {user_settings} from "./user_settings.ts";

export function set_layout_width(): void {
    if (user_settings.fluid_layout_width) {
        $("body").addClass("fluid_layout_width");
    } else {
        $("body").removeClass("fluid_layout_width");
    }
}

export function handle_overlay_scrollbars(): void {
    // If right sidebar scrollbar overlaps with browser scrollbar, move the right
    // sidebar scrollbar to the left. Done on fluid screen width and when scrollbars overlap.
    const scrollbar_width = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar_width === 0) {
        const max_app_width = 1400;
        const max_scrollbar_width = 20;
        const are_scrollbars_overlapping = window.innerWidth < max_app_width + max_scrollbar_width;
        if (user_settings.fluid_layout_width || are_scrollbars_overlapping) {
            $("body").addClass("has-overlay-scrollbar");
            return;
        }
    }

    $("body").removeClass("has-overlay-scrollbar");
}

export function initialize(): void {
    set_layout_width();
}
```

--------------------------------------------------------------------------------

---[FILE: scroll_util.ts]---
Location: zulip-main/web/src/scroll_util.ts

```typescript
import $ from "jquery";
import SimpleBar from "simplebar";

import * as util from "./util.ts";

// This type is helpful for testing, where we may have a dummy object instead of an actual jquery object.
type JQueryOrZJQuery = {__zjquery?: true} & JQuery;

export function get_content_element($element: JQuery): JQuery {
    const element = util.the($element);
    const sb = SimpleBar.instances.get(element);
    if (sb) {
        return $(sb.getContentElement()!);
    }
    return $element;
}

export function get_scroll_element($element: JQueryOrZJQuery): JQuery {
    // For testing we just return the element itself.
    if ($element?.__zjquery) {
        return $element;
    }

    const element = util.the($element);
    const sb = SimpleBar.instances.get(element);
    if (sb) {
        return $(sb.getScrollElement()!);
    } else if (element.hasAttribute("data-simplebar")) {
        // The SimpleBar mutation observer hasn’t processed this element yet.
        // Create the SimpleBar early in case we need to add event listeners.
        return $(new SimpleBar(element, {tabIndex: -1}).getScrollElement()!);
    }
    return $element;
}

export function reset_scrollbar($element: JQuery): void {
    const element = util.the($element);
    const sb = SimpleBar.instances.get(element);
    if (sb) {
        sb.getScrollElement()!.scrollTop = 0;
    } else {
        element.scrollTop = 0;
    }
}

export function scroll_delta(opts: {
    elem_top: number;
    elem_bottom: number;
    container_height: number;
}): number {
    const elem_top = opts.elem_top;
    const container_height = opts.container_height;
    const elem_bottom = opts.elem_bottom;

    let delta = 0;

    if (elem_top < 0) {
        delta = Math.max(elem_top, elem_bottom - container_height);
        delta = Math.min(0, delta);
    } else {
        if (elem_bottom > container_height) {
            delta = Math.min(elem_top, elem_bottom - container_height);
            delta = Math.max(0, delta);
        }
    }

    return delta;
}

export function scroll_element_into_container(
    $elem: JQuery,
    $container: JQuery,
    sticky_header_height = 0,
): void {
    // This does the minimum amount of scrolling that is needed to make
    // the element visible.  It doesn't try to center the element, so
    // this will be non-intrusive to users when they already have
    // the element visible.
    $container = get_scroll_element($container);

    // To correctly compute the offset of the element's scroll
    // position within our scroll container, we need to subtract the
    // scroll container's own offset within the document.
    const elem_offset = $elem.offset()?.top ?? 0;
    const container_offset = $container.offset()?.top ?? 0;

    const elem_top = elem_offset - container_offset - sticky_header_height;
    const elem_bottom = elem_top + ($elem.innerHeight() ?? 0);
    const container_height = ($container.height() ?? 0) - sticky_header_height;

    const opts = {
        elem_top,
        elem_bottom,
        container_height,
    };

    const delta = scroll_delta(opts);

    if (delta === 0) {
        return;
    }

    $container.scrollTop(($container.scrollTop() ?? 0) + delta);
}

export function get_left_sidebar_scroll_container(): JQuery {
    return get_scroll_element($("#left_sidebar_scroll_container"));
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: zulip-main/web/src/search.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import {Typeahead} from "./bootstrap_typeahead.ts";
import type {TypeaheadInputElement} from "./bootstrap_typeahead.ts";
import {Filter} from "./filter.ts";
import * as keydown_util from "./keydown_util.ts";
import * as narrow_state from "./narrow_state.ts";
import * as popovers from "./popovers.ts";
import * as search_pill from "./search_pill.ts";
import type {SearchPillWidget} from "./search_pill.ts";
import * as search_suggestion from "./search_suggestion.ts";
import type {NarrowTerm} from "./state_data.ts";
import * as util from "./util.ts";

// Exported for unit testing
export let is_using_input_method = false;

export function rewire_is_using_input_method(value: typeof is_using_input_method): void {
    is_using_input_method = value;
}

export let search_pill_widget: SearchPillWidget | null = null;
let search_input_has_changed = false;

let search_typeahead: Typeahead<string>;
let on_narrow_search: OnNarrowSearch;

function set_search_bar_text(text: string): void {
    $("#search_query").text(text);
    const current_selection = window.getSelection()!;
    if (current_selection.anchorNode?.isSameNode(util.the($("#search_query")))) {
        // After setting the text, move the cursor to the end of the line if
        // the cursor is in the search bar.
        current_selection.modify("move", "forward", "line");
    }
}

function get_search_bar_text(): string {
    return $("#search_query").text();
}

// TODO/typescript: Add the rest of the options when converting narrow.js to typescript.
type NarrowSearchOptions = {
    trigger: string;
};

type OnNarrowSearch = (terms: NarrowTerm[], options: NarrowSearchOptions) => void;

function full_search_query_in_terms(): NarrowTerm[] {
    assert(search_pill_widget !== null);
    return [
        ...search_pill.get_current_search_pill_terms(search_pill_widget),
        ...Filter.parse(get_search_bar_text(), true),
    ];
}

function narrow_or_search_for_term({on_narrow_search}: {on_narrow_search: OnNarrowSearch}): string {
    if (is_using_input_method) {
        // Neither narrow nor search when using input tools as
        // `updater` is also triggered when 'enter' is triggered
        // while using input tool
        return get_search_bar_text();
    }

    const terms = full_search_query_in_terms();
    if (terms.length === 0) {
        exit_search({keep_search_narrow_open: true});
        return "";
    }
    // Reset the search bar to display as many pills as possible for `terms`.
    // We do this in case some of these terms haven't been pillified yet
    // because convert_to_pill_on_enter is false.
    assert(search_pill_widget !== null);
    search_pill_widget.clear(true);
    search_pill.set_search_bar_contents(
        terms,
        search_pill_widget,
        search_typeahead.shown,
        set_search_bar_text,
    );
    on_narrow_search(terms, {trigger: "search"});

    // It's sort of annoying that this is not in a position to
    // blur the search box, because it means that Esc won't
    // unnarrow, it'll leave the searchbox.

    // Narrowing will have already put some terms in the search box,
    // so leave the current text in.
    $("#search_query").trigger("blur");
    return get_search_bar_text();
}

function focus_search_input_at_end(): void {
    $("#search_query").trigger("focus");
    // Move cursor to the end of the input text.
    window.getSelection()!.modify("move", "forward", "line");
}

function narrow_to_search_contents_with_search_bar_open(): void {
    // We skip validation when we're dealing with partial pills
    // since we don't want to do the shake animation for e.g. "dm:"
    // when the last bit of the pill hasn't been typed/selected yet.
    const text_terms = Filter.parse(get_search_bar_text());
    if (text_terms.at(-1)?.operand === "") {
        return;
    }
    if (!validate_text_terms()) {
        return;
    }
    const terms = full_search_query_in_terms();
    on_narrow_search(terms, {trigger: "search"});

    // We want to keep the search bar open here, not show the
    // message header. But here we'll let the message header
    // get rendered first, so that it's up to date with the
    // new narrow, and then reopen search if it got closed.
    if ($(".navbar-search.expanded").length === 0) {
        open_search_bar_and_close_narrow_description();
        focus_search_input_at_end();
        search_typeahead.lookup(false);
        search_input_has_changed = true;
    }
}

function validate_text_terms(): boolean {
    const text_terms = Filter.parse(get_search_bar_text());
    // The shake animation will show if there is any invalid term in the,
    // search bar, even if it's not what the user just typed or selected.
    if (!text_terms.every((term) => Filter.is_valid_search_term(term))) {
        $("#search_query").addClass("shake");
        return false;
    }
    return true;
}

export function initialize(opts: {on_narrow_search: OnNarrowSearch}): void {
    on_narrow_search = opts.on_narrow_search;
    const $search_query_box = $<HTMLInputElement>("#search_query");
    const $searchbox_form = $("#searchbox_form");
    const $pill_container = $("#searchbox-input-container.pill-container");

    $("#searchbox_form").on("focusin", () => {
        $("#searchbox-input-container").toggleClass("focused", true);
    });

    $("#searchbox_form").on("focusout", () => {
        $("#searchbox-input-container").toggleClass("focused", false);
    });

    search_pill_widget = search_pill.create_pills($pill_container);
    search_pill_widget.onPillRemove(() => {
        search_input_has_changed = true;
    });

    $search_query_box.on("change", () => {
        search_typeahead.lookup(false);
    });

    // Data storage for the typeahead.
    // This maps a search string to an object with a "description_html" field.
    // (It's a bit of legacy that we have an object with only one important
    // field.  There's also a "search_string" field on each element that actually
    // just represents the key of the hash, so it's redundant.)
    let search_map = new Map<string, search_suggestion.Suggestion>();

    const bootstrap_typeahead_input: TypeaheadInputElement = {
        $element: $search_query_box,
        type: "contenteditable",
    };
    search_typeahead = new Typeahead(bootstrap_typeahead_input, {
        source(query: string): string[] {
            if (query !== "") {
                search_input_has_changed = true;
            }
            assert(search_pill_widget !== null);
            const pill_terms = search_pill.get_current_search_pill_terms(search_pill_widget);
            const add_current_filter =
                pill_terms.length === 0 && narrow_state.filter() !== undefined;
            const suggestions = search_suggestion.get_suggestions(
                pill_terms,
                Filter.parse(query),
                add_current_filter,
            );
            // Update our global search_map hash
            search_map = suggestions.lookup_table;
            return suggestions.strings;
        },
        non_tippy_parent_element: "#searchbox_form",
        items: search_suggestion.max_num_of_search_results,
        helpOnEmptyStrings: true,
        stopAdvance: true,
        requireHighlight: false,
        item_html(item: string, query: string): string {
            const obj = search_map.get(item);
            assert(obj !== undefined);
            return search_pill.generate_pills_html(obj, query);
        },
        // When the user starts typing new search operands,
        // we want to highlight the first typeahead row by default
        // so that pressing Enter creates the default pill.
        // But when user isn't in the middle of typing a new pill,
        // pressing Enter should let them search for what's currently
        // in the search bar, so we remove the highlight (so that
        // Enter won't have anything to select).
        shouldHighlightFirstResult(): boolean {
            return get_search_bar_text() !== "";
        },
        hideAfterSelect(): boolean {
            const search_bar_text = get_search_bar_text();
            const text_terms = Filter.parse(search_bar_text);
            return text_terms.at(-1)?.operator === "search";
        },
        matcher(): boolean {
            return true;
        },
        updater(search_string: string): string {
            if (search_string) {
                search_input_has_changed = true;
                // Reset the search box and add the pills based on the selected
                // search suggestion.
                assert(search_pill_widget !== null);
                const search_terms = Filter.parse(search_string);
                search_pill.set_search_bar_contents(
                    search_terms,
                    search_pill_widget,
                    search_typeahead.shown,
                    set_search_bar_text,
                );
                narrow_to_search_contents_with_search_bar_open();
                focus_search_input_at_end();
            }
            return get_search_bar_text();
        },
        // We do this ourselves in `search_pill.set_search_bar_contents`
        updateElementContent: false,
        sorter(items: string[]): string[] {
            return items;
        },
        // Turns off `stopPropagation` in the typeahead code so that
        // we can manage those events for search pills.
        advanceKeys: ["Backspace", "Enter", "ArrowLeft", "ArrowRight"],

        // Use our custom typeahead `on_escape` hook to exit
        // the search bar as soon as the user hits Esc.
        on_escape() {
            exit_search({keep_search_narrow_open: false});
        },
        tabIsEnter: true,
        openInputFieldOnKeyUp(): void {
            if ($(".navbar-search.expanded").length === 0) {
                open_search_bar_and_close_narrow_description();
            }
        },
        // This is here so that we can close the search bar
        // when a user opens it and immediately changes their
        // mind and clicks away.
        closeInputFieldOnHide(): void {
            if (!search_input_has_changed) {
                const filter = narrow_state.filter();
                if (!filter || filter.is_common_narrow()) {
                    close_search_bar_and_open_narrow_description();
                }
            }
        },
    });

    $searchbox_form.on("compositionend", (): void => {
        // Set `is_using_input_method` to true if Enter is pressed to exit
        // the input tool popover and get the text in the search bar. Then
        // we suppress searching triggered by this Enter key by checking
        // `is_using_input_method` before searching.
        // More details in the commit message that added this line.
        is_using_input_method = true;
    });

    let typeahead_was_open_on_enter = false;
    $searchbox_form
        .on("keydown", (e: JQuery.KeyDownEvent): void => {
            if (keydown_util.is_enter_event(e) && $search_query_box.is(":focus")) {
                // Don't submit the form so that the typeahead can instead
                // handle our Enter keypress. Any searching that needs
                // to be done will be handled in the keyup.
                e.preventDefault();
            }

            // Record this on keydown before the typeahead code closes the
            // typeahead, so we can use this information on keyup.
            typeahead_was_open_on_enter = keydown_util.is_enter_event(e) && search_typeahead.shown;
        })
        .on("keyup", (e: JQuery.KeyUpEvent): void => {
            if (is_using_input_method) {
                is_using_input_method = false;
                return;
            }

            if (e.key === "Escape" && $search_query_box.is(":focus")) {
                exit_search({keep_search_narrow_open: false});
            } else if (
                keydown_util.is_enter_event(e) &&
                $search_query_box.is(":focus") &&
                !typeahead_was_open_on_enter
            ) {
                // If the typeahead was just open, the Enter event was selecting an item
                // from the typeahead. When that's the case, we don't want to call
                // narrow_or_search_for_term which exits the search bar, since the user
                // might have more terms to add still.
                if (!validate_text_terms()) {
                    return;
                }
                narrow_or_search_for_term({on_narrow_search});
            }
        });

    $("#searchbox-input-container").on("click", (): void => {
        // We don't want to put this in a focus handler because selecting the
        // typehead seems to trigger this (and we don't want to open search
        // when an option is selected and we're closing search).
        // Instead we explicitly initiate search on click and on specific keyboard
        // shortcuts.
        if ($("#searchbox .navbar-search.expanded").length === 0) {
            initiate_search();
        }
    });

    $(".search_icon").on("mousedown", (e: JQuery.MouseDownEvent): void => {
        e.preventDefault();
        // Clicking on the collapsed search box's icon opens search, but
        // clicking on the expanded search box's search icon does nothing.
        if ($(e.target).parents(".navbar-search.expanded").length === 0) {
            initiate_search();
        }
    });

    // Firefox leaves a <br> child element when the user enters search
    // input and then removes it, which breaks the :empty placeholder
    // text, so we need to manually remove it.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1513303
    $("#search_query").on("input", () => {
        if (get_search_bar_text() === "") {
            $("#search_query").empty();
        }
        search_input_has_changed = true;
    });

    // register searchbar click handler
    $("#search_exit").on("click", (e: JQuery.ClickEvent): void => {
        exit_search({keep_search_narrow_open: false});
        e.preventDefault();
        e.stopPropagation();
    });
    $("#search_exit").on("blur", (e: JQuery.BlurEvent): void => {
        // Blurs that move focus to elsewhere within the search input shouldn't
        // close search.
        const related_target = e.relatedTarget;
        if (related_target && $(related_target).parents("#searchbox-input-container").length > 0) {
            return;
        }
        // But otherwise, it should behave like the input blurring.
        $("#search_query").trigger("blur");
    });
    // This prevents a bug where tab shows a visual change before the blur handler kicks in
    $("#search_exit").on("keydown", (e: JQuery.KeyDownEvent): void => {
        if (e.key === "tab") {
            popovers.hide_all();
            exit_search({keep_search_narrow_open: false});
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

export function initiate_search(): void {
    open_search_bar_and_close_narrow_description(true);
    focus_search_input_at_end();

    // Open the typeahead after opening the search bar, so that we don't
    // get a weird visual jump where the typeahead results are narrow
    // before the search bar expands and then wider it expands.
    search_typeahead.lookup(false);
}

// we rely entirely on this function to ensure
// the searchbar has the right text/pills.
function reset_searchbox(clear = false): void {
    assert(search_pill_widget !== null);
    search_pill_widget.clear(true);
    search_input_has_changed = false;
    if (!clear) {
        search_pill.set_search_bar_contents(
            narrow_state.search_terms(),
            search_pill_widget,
            search_typeahead.shown,
            set_search_bar_text,
        );
    }
}

// Exported for tests
export let exit_search = (opts: {keep_search_narrow_open: boolean}): void => {
    const filter = narrow_state.filter();
    if (!filter || filter.is_common_narrow()) {
        // for common narrows, we change the UI (and don't redirect)
        close_search_bar_and_open_narrow_description();
    } else if (opts.keep_search_narrow_open) {
        // If the user is in a search narrow and we don't want to redirect,
        // we just keep the search bar open and don't do anything.
        return;
    } else {
        window.location.href = filter.generate_redirect_url();
    }
    $("#search_query").trigger("blur");
    $(".app").trigger("focus");
};

export function rewire_exit_search(value: typeof exit_search): void {
    exit_search = value;
}

export let open_search_bar_and_close_narrow_description = (clear = false): void => {
    reset_searchbox(clear);
    $(".navbar-search").addClass("expanded");
    $("#message_view_header").addClass("hidden");
    popovers.hide_all();
};

export function rewire_open_search_bar_and_close_narrow_description(
    value: typeof open_search_bar_and_close_narrow_description,
): void {
    open_search_bar_and_close_narrow_description = value;
}

export function close_search_bar_and_open_narrow_description(): void {
    // Hide the dropdown before closing the search bar. We do this
    // to avoid being in a situation where the typeahead gets narrow
    // in width as the search bar closes, which doesn't look great.
    $("#searchbox_form .dropdown-menu").hide();

    if (search_pill_widget !== null) {
        search_pill_widget.clear(true);
    }

    $(".navbar-search").removeClass("expanded");
    $("#message_view_header").removeClass("hidden");

    if ($("#search_query").is(":focus")) {
        $("#search_query").trigger("blur");
        $(".app").trigger("focus");
    }
}
```

--------------------------------------------------------------------------------

````
