---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 717
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 717 of 1290)

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

---[FILE: views_util.ts]---
Location: zulip-main/web/src/views_util.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import * as activity_ui from "./activity_ui.ts";
import * as compose_actions from "./compose_actions.ts";
import * as compose_recipient from "./compose_recipient.ts";
import * as compose_state from "./compose_state.ts";
import type * as dropdown_widget from "./dropdown_widget.ts";
import {$t} from "./i18n.ts";
import * as message_lists from "./message_lists.ts";
import * as message_view_header from "./message_view_header.ts";
import * as message_viewport from "./message_viewport.ts";
import * as modals from "./modals.ts";
import * as narrow_state from "./narrow_state.ts";
import * as narrow_title from "./narrow_title.ts";
import * as overlays from "./overlays.ts";
import * as pm_list from "./pm_list.ts";
import * as popovers from "./popovers.ts";
import * as popup_banners from "./popup_banners.ts";
import * as resize from "./resize.ts";
import * as sidebar_ui from "./sidebar_ui.ts";
import * as stream_list from "./stream_list.ts";
import * as unread_ui from "./unread_ui.ts";

export const FILTERS = {
    ALL_TOPICS: "all_topics",
    UNMUTED_TOPICS: "unmuted_topics",
    FOLLOWED_TOPICS: "followed_topics",
};

const TIPPY_PROPS: Partial<tippy.Props> = {
    offset: [0, 2],
};

export const COMMON_DROPDOWN_WIDGET_PARAMS = {
    get_options: filters_dropdown_options,
    tippy_props: TIPPY_PROPS,
    unique_id_type: "string",
    hide_search_box: true,
    disable_for_spectators: true,
} satisfies Partial<dropdown_widget.DropdownWidgetOptions>;

const ALL_TOPICS_OPTION_DESCRIPTION = $t({
    defaultMessage: "Includes muted channels and topics",
});

const ALL_TOPICS_OPTION_DESCRIPTION_FOR_CHANNEL_VIEW = $t({
    defaultMessage: "Includes muted topics",
});

export function filters_dropdown_options(
    current_value: string | number | undefined,
    channel_view = false,
): dropdown_widget.Option[] {
    return [
        {
            unique_id: FILTERS.FOLLOWED_TOPICS,
            name: $t({defaultMessage: "Followed topics"}),
            description: $t({defaultMessage: "Only topics you follow"}),
            bold_current_selection: current_value === FILTERS.FOLLOWED_TOPICS,
        },
        {
            unique_id: FILTERS.UNMUTED_TOPICS,
            name: $t({defaultMessage: "Standard view"}),
            description: $t({defaultMessage: "All unmuted topics"}),
            bold_current_selection: current_value === FILTERS.UNMUTED_TOPICS,
        },
        {
            unique_id: FILTERS.ALL_TOPICS,
            name: $t({defaultMessage: "All topics"}),
            description: channel_view
                ? ALL_TOPICS_OPTION_DESCRIPTION_FOR_CHANNEL_VIEW
                : ALL_TOPICS_OPTION_DESCRIPTION,
            bold_current_selection: current_value === FILTERS.ALL_TOPICS,
        },
    ];
}

export function handle_message_view_deactivated(highlight_current_view: () => void): void {
    highlight_current_view();
    stream_list.handle_message_view_deactivated();
    pm_list.handle_message_view_deactivated();
}

export function show(opts: {
    highlight_view_in_left_sidebar: () => void;
    $view: JQuery;
    update_compose: () => void;
    is_visible: () => boolean;
    set_visible: (value: boolean) => void;
    complete_rerender: (coming_from_other_views?: boolean) => void;
    is_recent_view?: boolean;
}): void {
    if (opts.is_visible()) {
        // If we're already visible, E.g. because the user hit Esc
        // while already in the view, do nothing.
        return;
    }

    // Hide "middle-column" which has html for rendering
    // a messages narrow. We hide it and show the view.
    $("#message_feed_container").hide();
    opts.$view.show();
    message_lists.update_current_message_list(undefined);
    opts.set_visible(true);

    // Hide selected elements in the left sidebar.
    opts.highlight_view_in_left_sidebar();

    unread_ui.hide_unread_banner();
    opts.update_compose();
    narrow_title.update_narrow_title(narrow_state.filter());
    message_view_header.render_title_area();
    compose_recipient.handle_middle_pane_transition();
    opts.complete_rerender(true);
    compose_actions.on_show_navigation_view();
    popup_banners.close_found_missing_unreads_banner();

    // This has to happen after resetting the current narrow filter, so
    // that the buddy list is rendered with the correct narrow state.
    activity_ui.build_user_sidebar();

    // Misc.
    if (opts.is_recent_view) {
        resize.update_recent_view();
    }
}

export function hide(opts: {$view: JQuery; set_visible: (value: boolean) => void}): void {
    const active_element = document.activeElement;
    if (active_element !== null && opts.$view.has(active_element)) {
        $(active_element).trigger("blur");
    }

    $("#message_feed_container").show();
    opts.$view.hide();
    opts.set_visible(false);

    // This solves a bug with message_view_header
    // being broken sometimes when we narrow
    // to a filter and back to view
    // before it completely re-rerenders.
    message_view_header.render_title_area();

    // Fire our custom event
    $("#message_feed_container").trigger("message_feed_shown");

    // This makes sure user lands on the selected message
    // and not always at the top of the narrow.
    message_viewport.plan_scroll_to_selected();
}

export function is_in_focus(): boolean {
    let can_current_view_steal_focus = true;
    const focused_element = document.activeElement;
    if (
        focused_element instanceof HTMLElement &&
        // Pill input elements.
        (focused_element.isContentEditable ||
            // `<input>` elements.
            focused_element.classList.contains("input-element")) &&
        // The input element is outside the current view.
        // We already check for compose box via compose_state.composing().
        focused_element.closest(".app .column-middle") === null
    ) {
        // If the user is focused on an input element
        // and it is not handled by current view,
        // then we should not steal focus from them.
        can_current_view_steal_focus = false;
    }

    return (
        !compose_state.composing() &&
        !popovers.any_active() &&
        !sidebar_ui.any_sidebar_expanded_as_overlay() &&
        !overlays.any_active() &&
        !modals.any_active_or_animating() &&
        can_current_view_steal_focus &&
        !$(".navbar-item").is(":focus")
    );
}

export function is_scroll_position_for_render(): boolean {
    const scroll_position = window.scrollY;
    const window_height = window.innerHeight;
    // We allocate `--max-unmaximized-compose-height` in empty space
    // below the last rendered row in recent view.
    //
    // We don't want user to see this empty space until there are no
    // new rows to render when the user is scrolling to the bottom of
    // the view. So, we render new rows when user has scrolled 2 / 3
    // of (the total scrollable height - the empty space).
    const compose_max_height = $(":root").css("--max-unmaximized-compose-height");
    assert(typeof compose_max_height === "string");
    const scroll_max = document.body.scrollHeight - Number.parseInt(compose_max_height, 10);
    return scroll_position + window_height >= (2 / 3) * scroll_max;
}
```

--------------------------------------------------------------------------------

---[FILE: watchdog.ts]---
Location: zulip-main/web/src/watchdog.ts

```typescript
import * as blueslip from "./blueslip.ts";

const unsuspend_callbacks: (() => void)[] = [];
let watchdog_time = Date.now();

// This field keeps track of whether we are attempting to
// force-reconnect to the events server due to suspecting we are
// offline.  It is important for avoiding races with the presence
// system when coming back from unsuspend.
let suspect_offline = false;

export function set_suspect_offline(suspected: boolean): void {
    suspect_offline = suspected;
}

export function suspects_user_is_offline(): boolean {
    return suspect_offline;
}

/*
There are two ways for us to detect that the web app had been on a
suspended device. The first is the `resume` event on Document, which
is not yet available on Safari. See
https://caniuse.com/mdn-api_document_resume_event.

So we instead use a timer, and check if more time passed than would be
possible if we were running the whole time. This logic has to be
careful to avoid mishandling the Chrome intensive throttling feature:
https://developer.chrome.com/blog/timer-throttling-in-chrome-88#intensive_throttling

Essentially, for an idle tab, Chromium will eventually start batching
timer events to only run once per minute. We don't want this watchdog
code to trigger every minute in this situation, it's important for
MINIMUM_SUSPEND_MILLISECONDS to be longer than that.

We need CHECK_FREQUENCY_MILLISECONDS to be fairly short, because that
controls how long after unsuspend (and potentially the user focusing
the app) that we might fail to discover that the device has
unsuspended.
*/

const CHECK_FREQUENCY_MILLISECONDS = 5000;
const MINIMUM_SUSPEND_MILLISECONDS = 75000;

export function check_for_unsuspend(): void {
    const new_time = Date.now();
    if (new_time - watchdog_time > MINIMUM_SUSPEND_MILLISECONDS) {
        // Defensively reset watchdog_time here in case there's an
        // exception in one of the event handlers
        watchdog_time = new_time;
        // Our app's JS wasn't running, which probably means the machine was
        // asleep.
        for (const callback of unsuspend_callbacks) {
            try {
                callback();
            } catch (error) {
                blueslip.error(
                    `Error while executing callback '${
                        callback.name || "Anonymous function"
                    }' from unsuspend_callbacks.`,
                    undefined,
                    error,
                );
            }
        }
    }
    watchdog_time = new_time;
}

export function on_unsuspend(f: () => void): void {
    unsuspend_callbacks.push(f);
}

setInterval(check_for_unsuspend, CHECK_FREQUENCY_MILLISECONDS);
```

--------------------------------------------------------------------------------

---[FILE: widgetize.ts]---
Location: zulip-main/web/src/widgetize.ts

```typescript
import $ from "jquery";

import * as blueslip from "./blueslip.ts";
import * as message_lists from "./message_lists.ts";
import type {Message} from "./message_store.ts";
import type {Event, PollWidgetExtraData, PollWidgetOutboundData} from "./poll_widget.ts";
import type {TodoWidgetExtraData, TodoWidgetOutboundData} from "./todo_widget.ts";
import type {ZFormExtraData} from "./zform.ts";

export type WidgetExtraData = PollWidgetExtraData | TodoWidgetExtraData | ZFormExtraData | null;

type WidgetOptions = {
    widget_type: string;
    extra_data: WidgetExtraData;
    events: Event[];
    $row: JQuery;
    message: Message;
    post_to_server: (data: {
        msg_type: string;
        data: string | PollWidgetOutboundData | TodoWidgetOutboundData;
    }) => void;
};

export type WidgetValue = Record<string, unknown> & {
    activate: (data: {
        $elem: JQuery;
        callback: (data: string | PollWidgetOutboundData | TodoWidgetOutboundData) => void;
        message: Message;
        extra_data: WidgetExtraData;
    }) => (events: Event[]) => void;
};

export const widgets = new Map<string, WidgetValue>();
export const widget_event_handlers = new Map<number, (events: Event[]) => void>();

export function clear_for_testing(): void {
    widget_event_handlers.clear();
}

function set_widget_in_message($row: JQuery, $widget_elem: JQuery): void {
    const $content_holder = $row.find(".message_content");
    $content_holder.empty().append($widget_elem);
}

export function activate(in_opts: WidgetOptions): void {
    const widget_type = in_opts.widget_type;
    const extra_data = in_opts.extra_data;
    const events = in_opts.events;
    const $row = in_opts.$row;
    const message = in_opts.message;
    const post_to_server = in_opts.post_to_server;

    if (!widgets.has(widget_type)) {
        if (widget_type === "tictactoe") {
            return; // don't warn for deleted legacy widget
        }
        blueslip.warn("unknown widget_type", {widget_type});
        return;
    }

    const callback = function (
        data: string | PollWidgetOutboundData | TodoWidgetOutboundData,
    ): void {
        post_to_server({
            msg_type: "widget",
            data,
        });
    };

    const is_message_preview = $row.parent()?.attr("id") === "report-message-preview-container";

    if (
        !$row.attr("id")!.startsWith(`message-row-${message_lists.current?.id}-`) &&
        !is_message_preview
    ) {
        // Don't activate widgets for messages that are not in the current view or
        // in message report modal.
        return;
    }

    // We depend on our widgets to use templates to build
    // the HTML that will eventually go in this div.
    const $widget_elem = $("<div>").addClass("widget-content");

    const event_handler = widgets.get(widget_type)!.activate({
        $elem: $widget_elem,
        callback,
        message,
        extra_data,
    });

    if (!is_message_preview) {
        // Don't re-register the original message's widget event
        // handler.
        widget_event_handlers.set(message.id, event_handler);
    }

    set_widget_in_message($row, $widget_elem);

    // Replay any events that already happened.  (This is common
    // when you narrow to a message after other users have already
    // interacted with it.)
    if (events.length > 0) {
        event_handler(events);
    }
}

export function handle_event(widget_event: Event & {message_id: number}): void {
    const event_handler = widget_event_handlers.get(widget_event.message_id);

    if (!event_handler || message_lists.current?.get_row(widget_event.message_id).length === 0) {
        // It is common for submessage events to arrive on
        // messages that we don't yet have in view. We
        // just ignore them completely here.
        return;
    }

    const events = [widget_event];

    event_handler(events);
}
```

--------------------------------------------------------------------------------

---[FILE: widgets.ts]---
Location: zulip-main/web/src/widgets.ts

```typescript
import * as poll_widget from "./poll_widget.ts";
import * as todo_widget from "./todo_widget.ts";
import * as widgetize from "./widgetize.ts";
import * as zform from "./zform.ts";

export function initialize(): void {
    widgetize.widgets.set("poll", poll_widget);
    widgetize.widgets.set("todo", todo_widget);
    widgetize.widgets.set("zform", zform);
}
```

--------------------------------------------------------------------------------

---[FILE: widget_modal.ts]---
Location: zulip-main/web/src/widget_modal.ts

```typescript
import $ from "jquery";
import SortableJS from "sortablejs";

import render_poll_modal_option from "../templates/poll_modal_option.hbs";
import render_todo_modal_task from "../templates/todo_modal_task.hbs";

import * as util from "./util.ts";

function create_option_row(
    $last_option_row_input: JQuery,
    template: (context?: unknown) => string,
): void {
    const row_html = template();
    const $row_container = $last_option_row_input.closest(".simplebar-content");
    $row_container.append($(row_html));
}

function add_option_row(this: HTMLElement, widget_type: string): void {
    // if the option triggering the input event e is not the last,
    // that is, its next sibling has the class `option-row`, we
    // do not add a new option row and return from this function
    // This handles a case when the next empty input row is already
    // added and user is updating the above row(s).
    if ($(this).closest(".option-row").next().hasClass("option-row")) {
        return;
    }
    const template = widget_type === "POLL" ? render_poll_modal_option : render_todo_modal_task;
    create_option_row($(this), template);
}

function delete_option_row(this: HTMLElement): void {
    const $row = $(this).closest(".option-row");
    $row.remove();
}

function setup_sortable_list(selector: string): void {
    // setTimeout is needed to here to give time for simplebar to initialise
    setTimeout(() => {
        SortableJS.create(util.the($($(selector + " .simplebar-content"))), {
            onUpdate() {
                // Do nothing on drag; the order is only processed on submission.
            },
            // We don't want the last (empty) row to be draggable, as a new row
            // is added on input event of the last row.
            filter: "input, .option-row:last-child",
            preventOnFilter: false,
        });
    }, 0);
}

export function poll_options_setup(): void {
    const $poll_options_list = $("#add-poll-form .poll-options-list");
    const $submit_button = $("#add-poll-modal .dialog_submit_button");
    const $question_input = $<HTMLInputElement>("#add-poll-form input#poll-question-input");

    // Disable the submit button if the question is empty.
    $submit_button.prop("disabled", true);
    $question_input.on("input", () => {
        if ($question_input.val()!.trim() !== "") {
            $submit_button.prop("disabled", false);
        } else {
            $submit_button.prop("disabled", true);
        }
    });

    $poll_options_list.on("input", "input.poll-option-input", function (this: HTMLElement) {
        add_option_row.call(this, "POLL");
    });
    $poll_options_list.on("click", "button.delete-option", delete_option_row);

    setup_sortable_list("#add-poll-form .poll-options-list");
}

export function todo_list_tasks_setup(): void {
    const $todo_options_list = $("#add-todo-form .todo-options-list");
    $todo_options_list.on("input", "input.todo-input", function (this: HTMLElement) {
        add_option_row.call(this, "TODO");
    });
    $todo_options_list.on("click", "button.delete-option", delete_option_row);

    setup_sortable_list("#add-todo-form .todo-options-list");
}

export function frame_poll_message_content(): string {
    const question = $<HTMLInputElement>("input#poll-question-input").val()!.trim();
    const options = $<HTMLInputElement>("input.poll-option-input")
        .map(function () {
            return $(this).val()!.trim();
        })
        .toArray()
        .filter(Boolean);
    return "/poll " + question + "\n" + options.join("\n");
}

export function frame_todo_message_content(): string {
    let title = $<HTMLInputElement>("input#todo-title-input").val()?.trim();

    if (title === "") {
        title = "Task list";
    }
    const todo_str = `/todo ${title}\n`;

    const todos: string[] = [];

    $(".option-row").each(function () {
        const todo_name = $(this).find<HTMLInputElement>("input.todo-input").val()?.trim() ?? "";
        const todo_description =
            $(this).find<HTMLInputElement>("input.todo-description-input").val()?.trim() ?? "";

        if (todo_name) {
            let todo = "";

            if (todo_name && todo_description) {
                todo = `${todo_name}: ${todo_description}`;
            } else if (todo_name && !todo_description) {
                todo = todo_name;
            }
            todos.push(todo);
        }
    });

    return todo_str + todos.join("\n");
}
```

--------------------------------------------------------------------------------

---[FILE: zcommand.ts]---
Location: zulip-main/web/src/zcommand.ts
Signals: Zod

```typescript
import $ from "jquery";
import * as z from "zod/mini";

import * as channel from "./channel.ts";
import * as compose_banner from "./compose_banner.ts";
import * as feedback_widget from "./feedback_widget.ts";
import {$t} from "./i18n.ts";
import * as markdown from "./markdown.ts";
import * as settings_config from "./settings_config.ts";
import * as theme from "./theme.ts";

/*

What in the heck is a zcommand?

    A zcommand is basically a specific type of slash
    command where the client does almost no work and
    the server just does something pretty simple like
    flip a setting.

    The first zcommand we wrote is for "/ping", and
    the server just responds with a 200 for that.

    Not all slash commands use zcommand under the hood.
    For more exotic things like /poll see submessage.js
    and widgetize.ts

*/

const data_schema = z.object({
    msg: z.string(),
});

export function send(opts: {command: string; on_success?: (data: unknown) => void}): void {
    const command = opts.command;
    const on_success = opts.on_success;
    const data = {
        command,
    };

    void channel.post({
        url: "/json/zcommand",
        data,
        success(data) {
            if (on_success) {
                on_success(data);
            }
        },
        error() {
            tell_user("server did not respond");
        },
    });
}

export function tell_user(msg: string): void {
    // This is a bit hacky, but we don't have a super easy API now
    // for just telling users stuff.
    compose_banner.show_error_message(
        msg,
        compose_banner.CLASSNAMES.generic_compose_error,
        $("#compose_banners"),
    );
}

export function switch_to_light_theme(): void {
    send({
        command: "/light",
        on_success(raw_data) {
            const data = data_schema.parse(raw_data);
            requestAnimationFrame(() => {
                theme.set_theme_and_update(settings_config.color_scheme_values.light.code);
            });
            feedback_widget.show({
                populate($container) {
                    const rendered_msg = markdown.parse_non_message(data.msg);
                    $container.html(rendered_msg);
                },
                on_undo() {
                    send({
                        command: "/dark",
                    });
                },
                title_text: $t({defaultMessage: "Light theme"}),
                undo_button_text: $t({defaultMessage: "Dark theme"}),
            });
        },
    });
}

export function switch_to_dark_theme(): void {
    send({
        command: "/dark",
        on_success(raw_data) {
            const data = data_schema.parse(raw_data);
            requestAnimationFrame(() => {
                theme.set_theme_and_update(settings_config.color_scheme_values.dark.code);
            });
            feedback_widget.show({
                populate($container) {
                    const rendered_msg = markdown.parse_non_message(data.msg);
                    $container.html(rendered_msg);
                },
                on_undo() {
                    send({
                        command: "/light",
                    });
                },
                title_text: $t({defaultMessage: "Dark theme"}),
                undo_button_text: $t({defaultMessage: "Light theme"}),
            });
        },
    });
}

export function process(message_content: string): boolean {
    const content = message_content.trim();

    if (content === "/ping") {
        const start_time = new Date();

        send({
            command: content,
            on_success() {
                const end_time = new Date();
                let diff = end_time.getTime() - start_time.getTime();
                diff = Math.round(diff);
                const msg = "ping time: " + diff + "ms";
                tell_user(msg);
            },
        });
        return true;
    }

    const light_commands = ["/day", "/light"];
    if (light_commands.includes(content)) {
        switch_to_light_theme();
        return true;
    }

    const dark_commands = ["/night", "/dark"];
    if (dark_commands.includes(content)) {
        switch_to_dark_theme();
        return true;
    }

    // It is incredibly important here to return false
    // if we don't see an actual zcommand, so that compose.ts
    // knows this is a normal message.
    return false;
}
```

--------------------------------------------------------------------------------

---[FILE: zform.ts]---
Location: zulip-main/web/src/zform.ts
Signals: Zod

```typescript
import $ from "jquery";
import type * as z from "zod/mini";

import render_widgets_zform_choices from "../templates/widgets/zform_choices.hbs";

import * as blueslip from "./blueslip.ts";
import type {Message} from "./message_store.ts";
import type {Event} from "./poll_widget.ts";
import {zform_widget_extra_data_schema} from "./submessage.ts";
import * as transmit from "./transmit.ts";
import type {WidgetExtraData} from "./widgetize.ts";

export type ZFormExtraData = z.infer<typeof zform_widget_extra_data_schema>;

export function activate(opts: {
    $elem: JQuery;
    extra_data: WidgetExtraData;
    message: Message;
}): (events: Event[]) => void {
    const $outer_elem = opts.$elem;
    const parse_result = zform_widget_extra_data_schema.safeParse(opts.extra_data);
    if (!parse_result.success) {
        blueslip.error("invalid zform extra data", {issues: parse_result.error.issues});
        return (_events: Event[]): void => {
            /* noop */
        };
    }
    const {data} = parse_result;

    function make_choices(data: ZFormExtraData): JQuery {
        // Assign idx values to each of our choices so that
        // our template can create data-idx values for our
        // JS code to use later.
        const data_with_choices_with_idx = {
            ...data,
            choices: data.choices.map((choice, idx) => ({...choice, idx})),
        };

        const html = render_widgets_zform_choices(data_with_choices_with_idx);
        const $elem = $(html);

        $elem.find("button").on("click", (e) => {
            e.stopPropagation();

            // Grab our index from the markup.
            const idx = Number.parseInt($(e.target).attr("data-idx")!, 10);

            // Use the index from the markup to dereference our
            // data structure.
            const reply_content = data.choices[idx]!.reply;

            transmit.reply_message(opts.message, reply_content);
        });

        return $elem;
    }

    function render(): void {
        if (data.type === "choices") {
            $outer_elem.html(make_choices(data).html());
        }
    }

    const handle_events = function (events: Event[]): void {
        if (events) {
            blueslip.info("unexpected");
        }
        render();
    };

    render();

    return handle_events;
}
```

--------------------------------------------------------------------------------

---[FILE: zulip_test.ts]---
Location: zulip-main/web/src/zulip_test.ts

```typescript
// This module, exposed through the zulip_test global variable,
// re-exports certain internal functions so they can be used by the
// Puppeteer tests.  It should not be used in the code itself.

export {set_wildcard_mention_threshold, wildcard_mention_threshold} from "./compose_validate.ts";
export {private_message_recipient_emails} from "./compose_state.ts";
export {current as current_msg_list} from "./message_lists.ts";
export {get_stream_id, get_sub, get_subscriber_count} from "./stream_data.ts";
export {get_by_user_id as get_person_by_user_id, get_user_id_from_name} from "./people.ts";
export {last_visible as last_visible_row, id as row_id} from "./rows.ts";
export {cancel as cancel_compose} from "./compose_actions.ts";
export {page_params, page_params_parse_time} from "./base_page_params.ts";
export {initiate as initiate_reload} from "./reload.ts";
export {page_load_time} from "./setup.ts";
export {current_user, realm} from "./state_data.ts";
export {add_user_id_to_new_stream} from "./stream_create_subscribers.ts";
export {get as get_message} from "./message_store.ts";
```

--------------------------------------------------------------------------------

````
