---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 629
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 629 of 1290)

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

---[FILE: list_util.ts]---
Location: zulip-main/web/src/list_util.ts

```typescript
import $ from "jquery";

const list_selectors = [
    "#stream_filters",
    "#left-sidebar-navigation-list",
    "#buddy-list-users-matching-view",
    "#buddy-list-other-users",
    "#buddy-list-participants",
];

export function inside_list(e: JQuery.KeyDownEvent): boolean {
    const $target = $(e.target);
    const in_list = $target.closest(list_selectors.join(", ")).length > 0;
    return in_list;
}

export function go_down(e: JQuery.KeyDownEvent): void {
    const $target = $(e.target);
    $target.closest("li").next().find("a").trigger("focus");
}

export function go_up(e: JQuery.KeyDownEvent): void {
    const $target = $(e.target);
    $target.closest("li").prev().find("a").trigger("focus");
}
```

--------------------------------------------------------------------------------

---[FILE: list_widget.ts]---
Location: zulip-main/web/src/list_widget.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import render_empty_list_widget_for_list from "../templates/empty_list_widget_for_list.hbs";
import render_empty_list_widget_for_table from "../templates/empty_list_widget_for_table.hbs";

import * as blueslip from "./blueslip.ts";
import * as scroll_util from "./scroll_util.ts";

type SortingFunction<T> = (a: T, b: T) => number;

type ListWidgetMeta<Key, Item = Key> = {
    sorting_function: SortingFunction<Item> | null;
    applied_sorting_functions: [SortingFunction<Item>, boolean][]; // This is used to keep track of the sorting functions applied.
    sorting_functions: Map<string, SortingFunction<Item>>;
    filter_value: string;
    has_active_filters: boolean;
    offset: number;
    list: Key[];
    filtered_list: Item[];
    reverse_mode: boolean;
    $scroll_container: JQuery;
    $scroll_listening_element: JQuery<HTMLElement | Window>;
};

// This type ensures the mutually exclusive nature of the predicate and filterer options.
type ListWidgetFilterOpts<Item> = {
    $element?: JQuery<HTMLInputElement>;
    onupdate?: () => void;
    is_active?: () => boolean;
} & (
    | {
          predicate: (item: Item, value: string) => boolean;
          filterer?: never;
      }
    | {
          predicate?: never;
          filterer: (list: Item[], value: string) => Item[];
      }
);

type ListWidgetOpts<Key, Item = Key> = {
    name?: string;
    get_item: (key: Key) => Item;
    modifier_html: (item: Item, filter_value: string) => string;
    init_sort?: string | string[] | SortingFunction<Item>;
    initially_descending_sort?: boolean;
    html_selector?: (item: Item) => JQuery;
    callback_after_render?: () => void;
    post_scroll__pre_render_callback?: () => void;
    get_min_load_count?: (rendered_count: number, load_count: number) => number;
    is_scroll_position_for_render?: () => boolean;
    filter?: ListWidgetFilterOpts<Item>;
    multiselect?: {
        selected_items: Key[];
    };
    sort_fields?: Record<string, SortingFunction<Item>>;
    $simplebar_container: JQuery;
    $parent_container?: JQuery;
};

type BaseListWidget = {
    clear_event_handlers: () => void;
};

export type ListWidget<Key, Item = Key> = BaseListWidget & {
    get_current_list: () => Item[];
    get_rendered_list: () => Item[];
    filter_and_sort: () => void;
    retain_selected_items: () => void;
    all_rendered: () => boolean;
    render: (how_many?: number) => void;
    render_item: (item: Item) => void;
    clear: () => void;
    set_filter_value: (value: string) => void;
    set_reverse_mode: (reverse_mode: boolean) => void;
    set_sorting_function: (sorting_function: string | string[] | SortingFunction<Item>) => void;
    set_up_event_handlers: () => void;
    increase_rendered_offset: () => void;
    reduce_rendered_offset: () => void;
    remove_rendered_row: (row: JQuery) => void;
    clean_redraw: () => void;
    hard_redraw: () => void;
    insert_rendered_row: (
        item: Item,
        get_insert_index: (list: Item[], item: Item) => number,
    ) => void;
    sort: (sorting_function: string, prop?: string) => void;
    replace_list_data: (list: Key[], should_redraw?: boolean) => void;
};

const DEFAULTS = {
    INITIAL_RENDER_COUNT: 80,
    LOAD_COUNT: 20,
    instances: new Map<string, BaseListWidget>(),
};

// ----------------------------------------------------
// This function describes (programmatically) how to use the ListWidget.
// ----------------------------------------------------

export function get_filtered_items<Key, Item>(
    value: string,
    list: Key[],
    opts: ListWidgetOpts<Key, Item>,
): Item[] {
    /*
        This is used by the main object (see `create`),
        but we split it out to make it a bit easier
        to test.
    */
    const get_item = opts.get_item;

    if (!opts.filter) {
        return list.map((key) => get_item(key));
    }

    if (opts.filter.filterer) {
        return opts.filter.filterer(
            list.map((key) => get_item(key)),
            value,
        );
    }

    const predicate = (item: Item): boolean => opts.filter!.predicate!(item, value);

    const result = [];

    for (const key of list) {
        const item = get_item(key);
        if (predicate(item)) {
            result.push(item);
        }
    }

    return result;
}

export function alphabetic_sort<Prop extends string>(
    prop: Prop,
): SortingFunction<Record<Prop, string>> {
    return (a, b) => {
        // The conversion to uppercase helps make the sorting case insensitive.
        const str1 = a[prop].toUpperCase();
        const str2 = b[prop].toUpperCase();

        if (str1 === str2) {
            return 0;
        } else if (str1 > str2) {
            return 1;
        }

        return -1;
    };
}

export function numeric_sort<Prop extends string>(
    prop: Prop,
): SortingFunction<Record<Prop, number>> {
    return (a, b) => {
        const a_prop = a[prop];
        const b_prop = b[prop];

        if (a_prop > b_prop) {
            return 1;
        } else if (a_prop === b_prop) {
            return 0;
        }

        return -1;
    };
}

type GenericSortKeys = {
    alphabetic: string;
    numeric: number;
};

const generic_sorts: {
    [GenericFunc in keyof GenericSortKeys]: <Prop extends string>(
        prop: Prop,
    ) => SortingFunction<Record<Prop, GenericSortKeys[GenericFunc]>>;
} = {
    alphabetic: alphabetic_sort,
    numeric: numeric_sort,
};

export function generic_sort_functions<
    GenericFunc extends keyof GenericSortKeys,
    Prop extends string,
>(
    generic_func: GenericFunc,
    props: Prop[],
): Record<string, SortingFunction<Record<Prop, GenericSortKeys[GenericFunc]>>> {
    return Object.fromEntries(
        props.map((prop) => [`${prop}_${generic_func}`, generic_sorts[generic_func](prop)]),
    );
}

function is_scroll_position_for_render(scroll_container: HTMLElement): boolean {
    return (
        scroll_container.scrollHeight -
            (scroll_container.scrollTop + scroll_container.clientHeight) <
        10
    );
}

function get_column_count_for_table($table: JQuery): number {
    let column_count = 0;
    const $thead = $table.find("thead");
    if ($thead.length > 0) {
        column_count = $thead.find("tr").children().length;
    }
    return column_count;
}

export function render_empty_list_message_if_needed(
    $container: JQuery,
    has_active_filters?: boolean,
): void {
    let empty_list_message = $container.attr("data-empty");

    const empty_search_results_message = $container.attr("data-search-results-empty");
    if (has_active_filters && empty_search_results_message) {
        empty_list_message = empty_search_results_message;
    }

    if (!empty_list_message || $container.children().length > 0) {
        return;
    }

    let empty_list_widget_html;

    if ($container.is("table, tbody")) {
        let $table = $container;
        if ($container.is("tbody")) {
            $table = $container.closest("table");
        }

        const column_count = get_column_count_for_table($table);
        empty_list_widget_html = render_empty_list_widget_for_table({
            empty_list_message,
            column_count,
        });
    } else {
        empty_list_widget_html = render_empty_list_widget_for_list({
            empty_list_message,
        });
    }

    $container.append($(empty_list_widget_html));
}

// @params
// $container: jQuery object to append to.
// list: The list of items to progressively append.
// opts: An object of random preferences.
export function create<Key, Item = Key>(
    $container: JQuery,
    list: Key[],
    opts: ListWidgetOpts<Key, Item>,
): ListWidget<Key, Item> {
    if (opts.name && DEFAULTS.instances.get(opts.name)) {
        // Clear event handlers for prior widget.
        const old_widget = DEFAULTS.instances.get(opts.name)!;
        old_widget.clear_event_handlers();
    }

    let $scroll_listening_element: JQuery<HTMLElement | Window> = opts.$simplebar_container;
    if ($scroll_listening_element.is("html")) {
        // When `$scroll_container` is the entire page (`html`),
        // scroll events are fired on `window/document`, so we need to
        // listen for scrolling events on that.
        //
        // We still keep `html` as `$scroll_container` to use
        // its various methods as `HTMLElement`.
        $scroll_listening_element = $(window);
    } else {
        // When `$scroll_container` is a specific element, we listen
        // for scroll events on that element.
        $scroll_listening_element = scroll_util.get_scroll_element(opts.$simplebar_container);
    }

    const meta: ListWidgetMeta<Key, Item> = {
        sorting_function: null,
        applied_sorting_functions: [],
        sorting_functions: new Map(),
        offset: 0,
        list,
        filtered_list: [],
        reverse_mode: false,
        filter_value: "",
        has_active_filters: opts.filter?.is_active?.() ?? false,
        $scroll_container: scroll_util.get_scroll_element(opts.$simplebar_container),
        $scroll_listening_element,
    };

    const widget: ListWidget<Key, Item> = {
        get_current_list() {
            return meta.filtered_list;
        },

        get_rendered_list() {
            return meta.filtered_list.slice(0, meta.offset);
        },

        filter_and_sort() {
            meta.filtered_list = get_filtered_items(meta.filter_value, meta.list, opts);

            if (meta.sorting_function) {
                // If the sorting function is already applied, remove it to avoid duplicate sorting.
                const existing_sorting_function_index = meta.applied_sorting_functions.findIndex(
                    ([sorting_function, _]) => sorting_function === meta.sorting_function,
                );
                if (existing_sorting_function_index !== -1) {
                    meta.applied_sorting_functions.splice(existing_sorting_function_index, 1);
                }

                meta.applied_sorting_functions.push([meta.sorting_function, meta.reverse_mode]);
                meta.filtered_list.sort((a, b) => {
                    for (let i = meta.applied_sorting_functions.length - 1; i >= 0; i -= 1) {
                        const sorting_function = meta.applied_sorting_functions[i]![0];
                        const is_reverse = meta.applied_sorting_functions[i]![1];
                        const result = sorting_function(a, b);
                        if (result !== 0) {
                            return is_reverse ? -result : result;
                        }
                    }
                    return 0;
                });
            }
        },

        // Used in case of Multiselect DropdownListWidget to retain
        // previously checked items even after widget redraws.
        retain_selected_items() {
            const items = opts.multiselect;

            if (items?.selected_items) {
                const data = items.selected_items;
                for (const value of data) {
                    const $list_item = $container.find(
                        `li[data-value="${CSS.escape(String(value))}"]`,
                    );
                    if ($list_item.length > 0) {
                        const $link_elem = $list_item.find("a").expectOne();
                        $list_item.addClass("checked");
                        $link_elem.prepend($("<i>").addClass(["fa", "fa-check"]));
                    }
                }
            }
        },

        // Returns if all available items are rendered.
        all_rendered() {
            return meta.offset >= meta.filtered_list.length;
        },

        // Reads the provided list (in the scope directly above)
        // and renders the next block of messages automatically
        // into the specified container.
        render(how_many) {
            let load_count = how_many ?? DEFAULTS.LOAD_COUNT;
            if (opts.get_min_load_count) {
                load_count = opts.get_min_load_count(meta.offset, load_count);
            }

            // Stop once the offset reaches the length of the original list.
            if (this.all_rendered()) {
                meta.has_active_filters = opts.filter?.is_active?.() ?? Boolean(meta.filter_value);
                render_empty_list_message_if_needed($container, meta.has_active_filters);
                if (opts.callback_after_render) {
                    opts.callback_after_render();
                }
                return;
            }

            const slice = meta.filtered_list.slice(meta.offset, meta.offset + load_count);

            let html = "";
            for (const item of slice) {
                const item_html = opts.modifier_html(item, meta.filter_value);

                if (typeof item_html !== "string") {
                    blueslip.error("List item is not a string", {item_html});
                    continue;
                }

                // append the HTML or nothing if corrupt (null, undef, etc.).
                if (item_html) {
                    html += item_html;
                }
            }

            $container.append($(html));
            meta.offset += load_count;

            if (opts.multiselect) {
                widget.retain_selected_items();
            }

            if (opts.callback_after_render) {
                opts.callback_after_render();
            }
        },

        render_item(item) {
            if (!opts.html_selector) {
                // We don't have any way to find the existing item.
                return;
            }
            const $html_item = meta.$scroll_container.find(opts.html_selector(item));
            if ($html_item.length === 0) {
                // We don't have the item in the current scroll container; it'll be
                // rendered with updated data when it is scrolled to.
                return;
            }

            const html = opts.modifier_html(item, meta.filter_value);
            if (typeof html !== "string") {
                blueslip.error("List item is not a string", {item: html});
                return;
            }

            // At this point, we have asserted we have all the information to replace
            // the html now.
            $html_item.replaceWith($(html));
        },

        clear() {
            $container.empty();
            meta.offset = 0;
        },

        set_filter_value(filter_value) {
            meta.filter_value = filter_value;
        },

        set_reverse_mode(reverse_mode) {
            meta.reverse_mode = reverse_mode;
        },

        // the sorting function is either the function or a string which will be a key
        // for the sorting_functions map to get the function. In case of generic sort
        // functions like numeric and alphabetic, we pass the string in the given format -
        // "{property}_{numeric|alphabetic}" - e.g. "email_alphabetic" or "age_numeric".
        set_sorting_function(sorting_function) {
            if (typeof sorting_function === "function") {
                meta.sorting_function = sorting_function;
            } else if (typeof sorting_function === "string") {
                if (!meta.sorting_functions.has(sorting_function)) {
                    blueslip.error("Sorting function not found: " + sorting_function);
                    return;
                }

                meta.sorting_function = meta.sorting_functions.get(sorting_function)!;
            }
        },

        set_up_event_handlers() {
            // on scroll of the nearest scrolling container, if it hits the bottom
            // of the container then fetch a new block of items and render them.
            meta.$scroll_listening_element.on("scroll.list_widget_container", function () {
                if (opts.post_scroll__pre_render_callback) {
                    opts.post_scroll__pre_render_callback();
                }

                let should_render;
                if (opts.is_scroll_position_for_render === undefined) {
                    assert(!(this instanceof Window));
                    should_render = is_scroll_position_for_render(this);
                } else {
                    should_render = opts.is_scroll_position_for_render();
                }

                if (should_render) {
                    widget.render();
                }
            });

            if (opts.$parent_container) {
                opts.$parent_container.on(
                    "click.list_widget_sort",
                    "[data-sort]",
                    function (this: HTMLElement) {
                        handle_sort($(this), widget);
                    },
                );
            }

            opts.filter?.$element?.on("input.list_widget_filter", function () {
                const value = this.value.toLocaleLowerCase();
                widget.set_filter_value(value);
                widget.hard_redraw();
            });

            opts.filter?.$element?.siblings(".clear-filter").on("click", () => {
                assert(opts.filter?.$element !== undefined);
                const $filter = opts.filter?.$element;
                $filter.val("");
                widget.set_filter_value("");
                widget.clean_redraw();
            });
        },

        clear_event_handlers() {
            meta.$scroll_listening_element.off("scroll.list_widget_container");

            if (opts.$parent_container) {
                opts.$parent_container.off("click.list_widget_sort", "[data-sort]");
                opts.filter?.$element?.siblings(".clear-filter").off("click");
            }

            opts.filter?.$element?.off("input.list_widget_filter");
        },

        increase_rendered_offset() {
            meta.offset = Math.min(meta.offset + 1, meta.filtered_list.length);
        },

        reduce_rendered_offset() {
            meta.offset = Math.max(meta.offset - 1, 0);
        },

        remove_rendered_row(rendered_row) {
            rendered_row.remove();
            // We removed a rendered row, so we need to reduce one offset.
            widget.reduce_rendered_offset();
        },

        clean_redraw() {
            widget.filter_and_sort();
            widget.clear();
            widget.render(DEFAULTS.INITIAL_RENDER_COUNT);
        },

        hard_redraw() {
            widget.clean_redraw();
            if (opts.filter?.onupdate) {
                opts.filter.onupdate();
            }
        },

        insert_rendered_row(item, get_insert_index) {
            // NOTE: Caller should call `filter_and_sort` before calling this function
            // so that `meta.filtered_list` already has the `item`.
            if (meta.filtered_list.length <= 2) {
                // Avoids edge cases for us and could be faster too.
                widget.clean_redraw();
                return;
            }

            assert(
                opts.filter?.predicate,
                "filter.predicate should be defined for insert_rendered_row",
            );
            if (!opts.filter.predicate(item, meta.filter_value)) {
                return;
            }

            // We need to insert the row for it to be displayed at the
            // correct position. filtered_list must contain the new item
            // since we know it is not hidden from the above check.
            const insert_index = get_insert_index(meta.filtered_list, item);

            // Rows greater than `offset` are not rendered in the DOM by list_widget;
            // for those, there's nothing to update.
            if (insert_index <= meta.offset) {
                if (!opts.html_selector) {
                    blueslip.error(
                        "Please specify modifier and html_selector when creating the widget.",
                    );
                }
                const rendered_row = opts.modifier_html(item, meta.filter_value);
                if (insert_index === meta.filtered_list.length - 1) {
                    const $target_row = opts.html_selector!(meta.filtered_list[insert_index - 1]!);
                    $target_row.after($(rendered_row));
                } else {
                    let $target_row = opts.html_selector!(meta.filtered_list[insert_index + 1]!);
                    if ($target_row.length > 0) {
                        $target_row.before($(rendered_row));
                    } else if (insert_index > 0) {
                        // We don't have a row rendered after row we are trying to insert at.
                        // So, try looking for the row before current row.
                        $target_row = opts.html_selector!(meta.filtered_list[insert_index - 1]!);
                        if ($target_row.length > 0) {
                            $target_row.after($(rendered_row));
                        }
                    }

                    // If we failed at inserting the row due rows around the row
                    // not being rendered yet, just do a clean redraw.
                    if ($target_row.length === 0) {
                        widget.clean_redraw();
                    }
                }
                widget.increase_rendered_offset();
            }
        },

        sort(sorting_function, prop) {
            const key = prop ? `${prop}_${sorting_function}` : sorting_function;
            widget.set_sorting_function(key);
            widget.hard_redraw();
        },

        replace_list_data(list, should_redraw = true) {
            /*
                We mostly use this widget for lists where you are
                not adding or removing rows, so when you do modify
                the list, we have a brute force solution.
            */
            meta.list = list;
            if (should_redraw) {
                widget.hard_redraw();
            }
        },
    };

    widget.set_up_event_handlers();

    if (opts.sort_fields) {
        for (const [name, sorting_function] of Object.entries(opts.sort_fields)) {
            meta.sorting_functions.set(name, sorting_function);
        }
    }

    if (opts.init_sort) {
        widget.set_sorting_function(opts.init_sort);
    }

    if (opts.initially_descending_sort) {
        widget.set_reverse_mode(true);
        opts.$simplebar_container.find(".active").addClass("descend");
    }

    widget.clean_redraw();

    // Save the instance for potential future retrieval if a name is provided.
    if (opts.name) {
        DEFAULTS.instances.set(opts.name, widget);
    }

    return widget;
}

export function handle_sort<Key, Item>($th: JQuery, list: ListWidget<Key, Item>): void {
    /*
        one would specify sort parameters like this:
            - name => sort alphabetic.
            - age  => sort numeric.
            - status => look up `status` in sort_fields
                        to find custom sort function

        <thead>
            <tr>
                <th data-sort="alphabetic" data-sort-prop="name"></th>
                <th data-sort="numeric" data-sort-prop="age"></th>
                <th data-sort="status"></th>
            </tr>
        </thead>
        */
    const sort_type = $th.attr("data-sort");
    const prop_name = $th.attr("data-sort-prop");
    assert(sort_type !== undefined);

    if ($th.hasClass("active")) {
        if (!$th.hasClass("descend")) {
            $th.addClass("descend");
        } else {
            $th.removeClass("descend");
        }
    } else {
        $th.siblings(".active").removeClass("active");
        $th.addClass("active");
    }

    list.set_reverse_mode($th.hasClass("descend"));

    // if `prop_name` is defined, it will trigger the generic sort functions,
    // and not if it is undefined.
    list.sort(sort_type, prop_name);
}

export const default_get_item = <T>(item: T): T => item;
```

--------------------------------------------------------------------------------

---[FILE: loading.ts]---
Location: zulip-main/web/src/loading.ts

```typescript
import $ from "jquery";

import loading_black_image from "../../static/images/loading/loader-black.svg";
import loading_white_image from "../../static/images/loading/loader-white.svg";
import render_loader from "../templates/loader.hbs";

export function make_indicator(
    $outer_container: JQuery,
    {
        abs_positioned = false,
        text,
        width,
        height,
    }: {
        abs_positioned?: boolean;
        text?: string;
        width?: number | undefined;
        height?: number | undefined;
    } = {},
): void {
    let $container = $outer_container;
    // The pixel values here were established under a 14px
    // font-size, so we convert the values to ems using
    // this value
    const legacy_em_in_px = 14;

    // TODO: We set white-space to 'nowrap' because under some
    // unknown circumstances (it happens on Keegan's laptop) the text
    // width calculation, above, returns a result that's a few pixels
    // too small.  The container's div will be slightly too small,
    // but that's probably OK for our purposes.
    $outer_container.css({"white-space": "nowrap"});

    $container.empty();

    if (abs_positioned) {
        // Create some additional containers to facilitate absolutely
        // positioned spinners.
        const container_id = $container.attr("id")!;
        let $inner_container = $("<div>").attr("id", `${container_id}_box_container`);
        $container.append($inner_container);
        $container = $inner_container;
        $inner_container = $("<div>").attr("id", `${container_id}_box`);
        $container.append($inner_container);
        $container = $inner_container;
    }

    const $spinner_elem = $("<div>")
        .addClass("loading_indicator_spinner")
        .attr("aria-hidden", "true");
    $spinner_elem.html(render_loader({container_id: $outer_container.attr("id")}));
    $container.append($spinner_elem);
    let text_width = 0;

    if (text !== undefined) {
        const $text_elem = $("<span>").addClass("loading_indicator_text");
        $text_elem.text(text);
        $container.append($text_elem);
        // See note, below
        if (!abs_positioned) {
            text_width = 20 + ($text_elem.width() ?? 0);
        }
    }

    // These width calculations are tied to the spinner width and
    // margins defined via CSS
    if (width !== undefined) {
        $container.css({width: `${(width + text_width) / legacy_em_in_px}em`});
    } else {
        $container.css({width: `${(38 + text_width) / legacy_em_in_px}em`});
    }
    if (height !== undefined) {
        $container.css({height});
    } else {
        $container.css({height: 0});
    }

    $outer_container.data("destroying", false);
}

export function destroy_indicator($container: JQuery): void {
    if ($container.data("destroying")) {
        return;
    }
    $container.data("destroying", true);
    $container.empty();
    $container.css({width: 0, height: 0});
}

export function show_button_spinner($elt: JQuery, using_dark_theme: boolean): void {
    if (!using_dark_theme) {
        $elt.attr("src", loading_black_image);
    } else {
        $elt.attr("src", loading_white_image);
    }
    $elt.css("display", "inline-block");
}

export function show_spinner($button_element: JQuery, $spinner: JQuery): void {
    const span_width = $button_element.find(".submit-button-text").width();
    const span_height = $button_element.find(".submit-button-text").height();

    // Hide the submit button after computing its height, since submit
    // buttons with long text might affect the size of the button.
    $button_element.find(".submit-button-text").hide();

    // Create the loading indicator
    make_indicator($spinner, {
        width: span_width,
        height: span_height,
    });
}

export function hide_spinner($button_element: JQuery, $spinner: JQuery): void {
    // Show the span
    $button_element.find(".submit-button-text").show();

    // Destroy the loading indicator
    destroy_indicator($spinner);
}
```

--------------------------------------------------------------------------------

---[FILE: localstorage.ts]---
Location: zulip-main/web/src/localstorage.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";

const formDataSchema = z.object({
    data: z.unknown(),
    __valid: z.literal(true),
});

type FormData = z.infer<typeof formDataSchema>;

export type LocalStorage = {
    get: (name: string) => unknown;
    set: (name: string, data: unknown) => boolean;
    remove: (name: string) => void;
    removeDataRegexWithCondition: (
        name: string,
        condition_checker: (value: unknown) => boolean,
    ) => void;
    migrate: <T = unknown>(
        name: string,
        v1: number,
        v2: number,
        callback: (data: unknown) => T,
    ) => T | undefined;
};

const ls = {
    // return the localStorage key that is bound to a version of a key.
    formGetter(version: number, name: string): string {
        return `ls__${version}__${name}`;
    },

    // create a formData object to put in the data and a signature that it was
    // created with this library.
    formData(data: unknown): FormData {
        return {
            data,
            __valid: true,
        };
    },

    getData(version: number, name: string): FormData | undefined {
        const key = this.formGetter(version, name);
        try {
            const raw_data = localStorage.getItem(key);
            if (raw_data === null) {
                return undefined;
            }
            return formDataSchema.parse(JSON.parse(raw_data));
        } catch {
            return undefined;
        }
    },

    // set the wrapped version of the data into localStorage.
    setData(version: number, name: string, data: unknown): void {
        const key = this.formGetter(version, name);
        const val = this.formData(data);

        localStorage.setItem(key, JSON.stringify(val));
    },

    // remove the key from localStorage and from memory.
    removeData(version: number, name: string): void {
        const key = this.formGetter(version, name);

        localStorage.removeItem(key);
    },

    // Remove keys which (1) map to a value that satisfies a
    // property tested by `condition_checker` and (2) which match
    // the pattern given by `name`.
    removeDataRegexWithCondition(
        version: number,
        regex: string,
        condition_checker: (value: unknown) => boolean,
    ): void {
        const key_regex = new RegExp(this.formGetter(version, regex));
        let keys: string[] = [];
        try {
            keys = Object.keys(localStorage);
        } catch {
            // Do nothing if we fail to fetch the local storage
        }

        keys = keys.filter((key) => key_regex.test(key));

        for (const key of keys) {
            let raw_data;
            try {
                raw_data = localStorage.getItem(key);
            } catch {
                continue;
            }
            if (raw_data === null) {
                continue;
            }
            const data = formDataSchema.parse(JSON.parse(raw_data));
            if (condition_checker(data.data)) {
                try {
                    localStorage.removeItem(key);
                } catch {
                    // Do nothing if deletion fails
                }
            }
        }
    },

    // migrate from an older version of a data src to a newer one with a
    // specified callback function.
    migrate<T = unknown>(
        name: string,
        v1: number,
        v2: number,
        callback: (oldData: unknown) => T,
    ): T | undefined {
        const old = this.getData(v1, name);
        this.removeData(v1, name);

        if (old?.__valid) {
            const data = callback(old.data);
            this.setData(v2, name, data);

            return data;
        }

        return undefined;
    },
};

// return a new function instance that has instance-scoped variables.
export const localstorage = function (): LocalStorage {
    const _data = {
        VERSION: 1,
    };

    const prototype = {
        get(name: string): unknown {
            const data = ls.getData(_data.VERSION, name);

            if (data) {
                return data.data;
            }

            return undefined;
        },

        set(name: string, data: unknown): boolean {
            if (_data.VERSION !== undefined) {
                ls.setData(_data.VERSION, name, data);
                return true;
            }

            return false;
        },

        // remove a key with a given version.
        remove(name: string): void {
            ls.removeData(_data.VERSION, name);
        },

        // Remove keys which (1) map to a value that satisfies a
        // property tested by `condition_checker` AND (2) which
        // match the pattern given by `name`.
        removeDataRegexWithCondition(
            name: string,
            condition_checker: (value: unknown) => boolean,
        ): void {
            ls.removeDataRegexWithCondition(_data.VERSION, name, condition_checker);
        },

        migrate<T = unknown>(
            name: string,
            v1: number,
            v2: number,
            callback: (data: unknown) => T,
        ): T | undefined {
            return ls.migrate(name, v1, v2, callback);
        },

        // set a new master version for the LocalStorage instance.
        get version() {
            return _data.VERSION;
        },
        set version(version) {
            _data.VERSION = version;
        },
    };

    return prototype;
};

let warned_of_localstorage = false;

localstorage.supported = function supports_localstorage(): boolean {
    try {
        return window.localStorage !== undefined && window.localStorage !== null;
    } catch {
        if (!warned_of_localstorage) {
            blueslip.error(
                "Client browser does not support local storage, will lose socket message on reload",
            );
            warned_of_localstorage = true;
        }
        return false;
    }
};
```

--------------------------------------------------------------------------------

---[FILE: local_message.ts]---
Location: zulip-main/web/src/local_message.ts

```typescript
import {all_messages_data} from "./all_messages_data.ts";
import * as blueslip from "./blueslip.ts";
import type {StateData} from "./state_data.ts";

let max_message_id: number;

function truncate_precision(float: number): number {
    return Number.parseFloat(float.toFixed(3));
}

export const get_next_id_float = (function () {
    const already_used = new Set();

    return function (): number | undefined {
        const local_id_increment = 0.01;
        let latest = all_messages_data.last()?.id ?? max_message_id;
        latest = Math.max(0, latest);
        const local_id_float = truncate_precision(latest + local_id_increment);

        if (already_used.has(local_id_float)) {
            // If our id is already used, it is probably an edge case like we had
            // to abort a very recent message.
            blueslip.warn("We don't reuse ids for local echo.");
            return undefined;
        }

        if (local_id_float % 1 > local_id_increment * 5) {
            blueslip.warn("Turning off local echo for this message to let host catch up");
            return undefined;
        }

        if (local_id_float % 1 === 0) {
            // The logic to stop at 0.05 should prevent us from ever wrapping around
            // to the next integer.
            blueslip.error("Programming error");
            return undefined;
        }

        already_used.add(local_id_float);

        return local_id_float;
    };
})();

export function initialize(params: StateData["local_message"]): void {
    max_message_id = params.max_message_id;
}
```

--------------------------------------------------------------------------------

````
