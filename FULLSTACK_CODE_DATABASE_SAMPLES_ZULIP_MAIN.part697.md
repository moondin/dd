---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 697
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 697 of 1290)

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

---[FILE: todo_widget.ts]---
Location: zulip-main/web/src/todo_widget.ts
Signals: Zod

```typescript
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import render_message_hidden_dialog from "../templates/message_hidden_dialog.hbs";
import render_widgets_todo_widget from "../templates/widgets/todo_widget.hbs";
import render_widgets_todo_widget_tasks from "../templates/widgets/todo_widget_tasks.hbs";

import * as blueslip from "./blueslip.ts";
import {$t} from "./i18n.ts";
import * as message_lists from "./message_lists.ts";
import type {Message} from "./message_store.ts";
import {page_params} from "./page_params.ts";
import * as people from "./people.ts";
import type {Event} from "./poll_widget.ts";

// Any single user should send add a finite number of tasks
// to a todo list. We arbitrarily pick this value.
const MAX_IDX = 1000;

export const todo_widget_extra_data_schema = z.object({
    task_list_title: z.optional(z.string()),
    tasks: z.optional(z.array(z.object({task: z.string(), desc: z.string()}))),
});

export type TodoWidgetExtraData = z.infer<typeof todo_widget_extra_data_schema>;

const todo_widget_inbound_data = z.intersection(
    z.object({
        type: z.enum(["new_task", "new_task_list_title", "strike"]),
    }),
    z.record(z.string(), z.unknown()),
);

// TODO: This schema is being used to parse two completely
// different types of things (inbound and outbound data),
// which should be refactored so that the code here is
// clearer and less confusing.
const new_task_inbound_data_schema = z.object({
    type: z.optional(z.literal("new_task")),
    key: z.int().check(z.nonnegative(), z.lte(MAX_IDX)),
    task: z.string(),
    desc: z.string(),
    completed: z.boolean(),
});

type NewTaskOutboundData = z.output<typeof new_task_inbound_data_schema>;

type NewTaskTitleOutboundData = {
    type: "new_task_list_title";
    title: string;
};

type TaskStrikeOutboundData = {
    type: "strike";
    key: string;
};

type TodoTask = {
    task: string;
    desc: string;
};

type Task = {
    task: string;
    desc: string;
    idx: number;
    key: string;
    completed: boolean;
};

export type TodoWidgetOutboundData =
    | NewTaskTitleOutboundData
    | NewTaskOutboundData
    | TaskStrikeOutboundData;

export class TaskData {
    message_sender_id: number;
    me: number;
    is_my_task_list: boolean;
    input_mode: boolean;
    report_error_function: (msg: string, more_info?: Record<string, unknown>) => void;
    task_list_title: string;
    task_map = new Map<string, Task>();
    my_idx = 1;

    handle = {
        new_task_list_title: {
            outbound: (title: string): NewTaskTitleOutboundData | undefined => {
                const event = {
                    type: "new_task_list_title" as const,
                    title,
                };
                if (this.is_my_task_list) {
                    return event;
                }
                return undefined;
            },

            inbound: (sender_id: number, raw_data: unknown): void => {
                // Only the message author can edit questions.
                const new_task_title_inbound_data = z.object({
                    type: z.literal("new_task_list_title"),
                    title: z.string(),
                });
                const parsed = new_task_title_inbound_data.safeParse(raw_data);

                if (!parsed.success) {
                    this.report_error_function(
                        "todo widget: bad type for inbound task list title",
                        {error: parsed.error},
                    );
                    return;
                }
                const data = parsed.data;
                if (sender_id !== this.message_sender_id) {
                    this.report_error_function(
                        `user ${sender_id} is not allowed to edit the task list title`,
                    );
                    return;
                }

                this.set_task_list_title(data.title);
            },
        },

        new_task: {
            outbound: (task: string, desc: string): NewTaskOutboundData | undefined => {
                this.my_idx += 1;
                const event = {
                    type: "new_task" as const,
                    key: this.my_idx,
                    task,
                    desc,
                    completed: false,
                };

                if (!this.name_in_use(task)) {
                    return event;
                }
                return undefined;
            },

            inbound: (sender_id: number | string, raw_data: unknown): void => {
                // All readers may add tasks. For legacy reasons, the
                // inbound idx is called key in the event.

                const parsed = new_task_inbound_data_schema.safeParse(raw_data);
                if (!parsed.success) {
                    blueslip.warn("todo widget: bad type for inbound task data", {
                        error: parsed.error,
                    });
                    return;
                }

                const data = parsed.data;
                const idx = data.key;
                const task = data.task;
                const desc = data.desc;

                const key = idx + "," + sender_id;
                const completed = data.completed;

                const task_data = {
                    task,
                    desc,
                    idx,
                    key,
                    completed,
                };

                if (!this.name_in_use(task)) {
                    this.task_map.set(key, task_data);
                }

                // I may have added a task from another device.
                if (sender_id === this.me && this.my_idx <= idx) {
                    this.my_idx = idx + 1;
                }
            },
        },

        strike: {
            outbound(key: string): TaskStrikeOutboundData {
                const event = {
                    type: "strike" as const,
                    key,
                };

                return event;
            },

            inbound: (_sender_id: number, raw_data: unknown): void => {
                const task_strike_inbound_data_schema = z.object({
                    type: z.literal("strike"),
                    key: z.string(),
                });
                const parsed = task_strike_inbound_data_schema.safeParse(raw_data);
                if (!parsed.success) {
                    blueslip.warn("todo widget: bad type for inbound strike key", {
                        error: parsed.error,
                    });
                    return;
                }
                // All message readers may strike/unstrike todo tasks.
                const data = parsed.data;
                const key = data.key;
                const item = this.task_map.get(key);

                if (item === undefined) {
                    blueslip.warn("Do we have legacy data? unknown key for tasks: " + key);
                    return;
                }

                item.completed = !item.completed;
            },
        },
    };

    constructor({
        message_sender_id,
        current_user_id,
        is_my_task_list,
        task_list_title,
        tasks,
        report_error_function,
    }: {
        message_sender_id: number;
        current_user_id: number;
        is_my_task_list: boolean;
        task_list_title: string;
        tasks: TodoTask[];
        report_error_function: (msg: string, more_info?: Record<string, unknown>) => void;
    }) {
        this.message_sender_id = message_sender_id;
        this.me = current_user_id;
        this.is_my_task_list = is_my_task_list;
        // input_mode indicates if the task list title is being input currently
        this.input_mode = is_my_task_list; // for now
        this.report_error_function = report_error_function;
        this.task_list_title = "";
        if (task_list_title) {
            this.set_task_list_title(task_list_title);
        } else {
            this.set_task_list_title($t({defaultMessage: "Task list"}));
        }

        for (const [i, data] of tasks.entries()) {
            this.handle.new_task.inbound("canned", {
                key: i,
                task: data.task,
                desc: data.desc,
                completed: false,
            });
        }
    }

    set_task_list_title(new_title: string): void {
        this.input_mode = false;
        this.task_list_title = new_title;
    }

    get_task_list_title(): string {
        return this.task_list_title;
    }

    set_input_mode(): void {
        this.input_mode = true;
    }

    clear_input_mode(): void {
        this.input_mode = false;
    }

    get_input_mode(): boolean {
        return this.input_mode;
    }

    get_widget_data(): {
        all_tasks: Task[];
    } {
        const all_tasks = [...this.task_map.values()];

        const widget_data = {
            all_tasks,
        };

        return widget_data;
    }

    name_in_use(name: string): boolean {
        for (const item of this.task_map.values()) {
            if (item.task === name) {
                return true;
            }
        }

        return false;
    }

    handle_event(sender_id: number, raw_data: unknown): void {
        const parsed = todo_widget_inbound_data.safeParse(raw_data);
        if (!parsed.success) {
            return;
        }

        const {data} = parsed;
        const type = data.type;
        if (this.handle[type]) {
            this.handle[type].inbound(sender_id, data);
        } else {
            blueslip.warn(`todo widget: unknown inbound type: ${type}`);
        }
    }
}

export function activate({
    $elem,
    callback,
    extra_data,
    message,
}: {
    $elem: JQuery;
    callback: (data: TodoWidgetOutboundData) => void;
    extra_data: unknown;
    message: Message;
}): (events: Event[]) => void {
    const parse_result = z.nullable(todo_widget_extra_data_schema).safeParse(extra_data);
    if (!parse_result.success) {
        blueslip.warn("invalid todo extra data", {issues: parse_result.error.issues});
        return () => {
            /* we send a dummy function when extra data is invalid */
        };
    }
    const {data} = parse_result;
    const {task_list_title = "", tasks = []} = data ?? {};
    const is_my_task_list = people.is_my_user_id(message.sender_id);
    const task_data = new TaskData({
        message_sender_id: message.sender_id,
        current_user_id: people.my_current_user_id(),
        is_my_task_list,
        task_list_title,
        tasks,
        report_error_function: blueslip.warn,
    });
    const message_container = message_lists.current?.view.message_containers.get(message.id);

    function update_edit_controls(): void {
        const has_title =
            $elem.find<HTMLInputElement>("input.todo-task-list-title").val()?.trim() !== "";
        $elem.find("button.todo-task-list-title-check").toggle(has_title);
    }

    function render_task_list_title(): void {
        const task_list_title = task_data.get_task_list_title();
        const input_mode = task_data.get_input_mode();
        const can_edit = is_my_task_list && !input_mode;

        $elem.find(".todo-task-list-title-header").toggle(!input_mode);
        $elem.find(".todo-task-list-title-header").text(task_list_title);
        $elem.find(".todo-edit-task-list-title").toggle(can_edit);
        update_edit_controls();

        $elem.find(".todo-task-list-title-bar").toggle(input_mode);
    }

    function start_editing(): void {
        task_data.set_input_mode();

        const task_list_title = task_data.get_task_list_title();
        $elem.find("input.todo-task-list-title").val(task_list_title);
        render_task_list_title();
        $elem.find("input.todo-task-list-title").trigger("focus");
    }

    function abort_edit(): void {
        task_data.clear_input_mode();
        render_task_list_title();
    }

    function submit_task_list_title(): void {
        const $task_list_title_input = $elem.find<HTMLInputElement>("input.todo-task-list-title");
        let new_task_list_title = $task_list_title_input.val()?.trim() ?? "";
        const old_task_list_title = task_data.get_task_list_title();

        // We should disable the button for blank task list title,
        // so this is just defensive code.
        if (new_task_list_title.trim() === "") {
            new_task_list_title = old_task_list_title;
        }

        // Optimistically set the task list title locally.
        task_data.set_task_list_title(new_task_list_title);
        render_task_list_title();

        // If there were no actual edits, we can exit now.
        if (new_task_list_title === old_task_list_title) {
            return;
        }

        // Broadcast the new task list title to our peers.
        const data = task_data.handle.new_task_list_title.outbound(new_task_list_title);
        if (data) {
            callback(data);
        }
    }

    function add_task(): void {
        $elem.find(".widget-error").text("");
        const task = $elem.find<HTMLInputElement>("input.add-task").val()?.trim() ?? "";
        const desc = $elem.find<HTMLInputElement>("input.add-desc").val()?.trim() ?? "";
        if (task === "") {
            return;
        }

        $elem.find("input.add-task").val("").trigger("focus");
        $elem.find("input.add-desc").val("");

        // This case should not generally occur.
        const task_exists = task_data.name_in_use(task);
        if (task_exists) {
            $elem.find(".widget-error").text($t({defaultMessage: "Task already exists"}));
            return;
        }

        const data = task_data.handle.new_task.outbound(task, desc);
        if (data) {
            callback(data);
        }
    }

    function build_widget(): void {
        const html = render_widgets_todo_widget();
        $elem.html(html);

        // This throttling ensures that the function runs only after the user stops typing.
        const throttled_update_add_task_button = _.throttle(update_add_task_button, 300);
        $elem.find("input.add-task").on("keyup", (e) => {
            e.stopPropagation();
            throttled_update_add_task_button();
        });

        $elem.find("input.todo-task-list-title").on("keyup", (e) => {
            e.stopPropagation();
            update_edit_controls();
        });

        $elem.find("input.todo-task-list-title").on("keydown", (e) => {
            e.stopPropagation();

            if (e.key === "Enter") {
                submit_task_list_title();
                return;
            }

            if (e.key === "Escape") {
                abort_edit();
                return;
            }
        });

        $elem.find(".todo-edit-task-list-title").on("click", (e) => {
            e.stopPropagation();
            start_editing();
        });

        $elem.find("button.todo-task-list-title-check").on("click", (e) => {
            e.stopPropagation();
            submit_task_list_title();
        });

        $elem.find("button.todo-task-list-title-remove").on("click", (e) => {
            e.stopPropagation();
            abort_edit();
        });

        $elem.find("button.add-task").on("click", (e) => {
            e.stopPropagation();
            add_task();
        });

        $elem.find("input.add-task, input.add-desc").on("keydown", (e) => {
            if (e.key === "Enter") {
                e.stopPropagation();
                e.preventDefault();
                add_task();
            }
        });
    }

    function update_add_task_button(): void {
        const task = $elem.find<HTMLInputElement>("input.add-task").val()?.trim() ?? "";
        const task_exists = task_data.name_in_use(task);
        const $add_task_wrapper = $elem.find(".add-task-wrapper");
        const $add_task_button = $elem.find("button.add-task");

        if (task === "") {
            $add_task_wrapper.attr(
                "data-tippy-content",
                $t({defaultMessage: "Name the task before adding."}),
            );
            $add_task_button.prop("disabled", true);
        } else if (task_exists) {
            $add_task_wrapper.attr(
                "data-tippy-content",
                $t({defaultMessage: "Cannot add duplicate task."}),
            );
            $add_task_button.prop("disabled", true);
        } else {
            $add_task_wrapper.removeAttr("data-tippy-content");
            $add_task_button.prop("disabled", false);
        }
    }

    function render_results(): void {
        const widget_data = task_data.get_widget_data();
        const html = render_widgets_todo_widget_tasks(widget_data);
        $elem.find("ul.todo-widget").html(html);
        $elem.find(".widget-error").text("");

        $elem.find("input.task").on("click", (e) => {
            e.stopPropagation();

            if (page_params.is_spectator) {
                // Logically, spectators should not be able to toggle
                // TODO checkboxes. However, the browser changes the
                // checkbox's state before calling handlers like this,
                // so we need to just toggle the checkbox back to its
                // previous state.
                $(e.target).prop("checked", !$(e.target).is(":checked"));
                $(e.target).trigger("blur");
                return;
            }
            const key = $(e.target).attr("data-key");
            assert(key !== undefined);

            const data = task_data.handle.strike.outbound(key);
            callback(data);
        });

        update_add_task_button();
    }

    const handle_events = function (events: Event[]): void {
        // We don't have to handle events now since we go through
        // handle_event loop again when we unmute the message.
        if (message_container?.is_hidden) {
            return;
        }

        for (const event of events) {
            task_data.handle_event(event.sender_id, event.data);
        }

        render_task_list_title();
        render_results();
    };

    if (message_container?.is_hidden) {
        const html = render_message_hidden_dialog();
        $elem.html(html);
    } else {
        build_widget();
        render_task_list_title();
        render_results();
    }

    return handle_events;
}
```

--------------------------------------------------------------------------------

---[FILE: topic_filter_pill.ts]---
Location: zulip-main/web/src/topic_filter_pill.ts

```typescript
import render_input_pill from "../templates/input_pill.hbs";

import {$t} from "./i18n.ts";
import type {InputPillConfig, InputPillContainer} from "./input_pill.ts";
import * as input_pill from "./input_pill.ts";

export type TopicFilterPill = {
    type: "topic_filter";
    label: string;
    syntax: string;
};

export type TopicFilterPillWidget = InputPillContainer<TopicFilterPill>;

export const filter_options: TopicFilterPill[] = [
    {
        type: "topic_filter",
        label: $t({defaultMessage: "unresolved"}),
        syntax: "-is:resolved",
    },
    {
        type: "topic_filter",
        label: $t({defaultMessage: "resolved"}),
        syntax: "is:resolved",
    },
];

export function create_item_from_syntax(
    syntax: string,
    current_items: TopicFilterPill[],
): TopicFilterPill | undefined {
    const existing_syntaxes = current_items.map((item) => item.syntax);
    if (existing_syntaxes.includes(syntax)) {
        return undefined;
    }

    // Find the matching filter option
    const filter_option = filter_options.find((option) => option.syntax === syntax);
    if (!filter_option) {
        return undefined;
    }
    return filter_option;
}

export function get_syntax_from_item(item: TopicFilterPill): string {
    return item.syntax;
}

export function create_pills(
    $pill_container: JQuery,
    pill_config?: InputPillConfig,
): TopicFilterPillWidget {
    const pill_container = input_pill.create({
        $container: $pill_container,
        pill_config,
        create_item_from_text: create_item_from_syntax,
        get_text_from_item: get_syntax_from_item,
        get_display_value_from_item: get_syntax_from_item,
        generate_pill_html(item: TopicFilterPill, disabled?: boolean) {
            return render_input_pill({
                display_value: item.label,
                disabled,
            });
        },
    });
    pill_container.createPillonPaste(() => false);
    return pill_container;
}
```

--------------------------------------------------------------------------------

---[FILE: topic_generator.ts]---
Location: zulip-main/web/src/topic_generator.ts

```typescript
import _ from "lodash";

import * as narrow_state from "./narrow_state.ts";
import * as pm_conversations from "./pm_conversations.ts";
import * as stream_data from "./stream_data.ts";
import * as stream_list_sort from "./stream_list_sort.ts";
import * as stream_topic_history from "./stream_topic_history.ts";
import * as unread from "./unread.ts";
import * as user_topics from "./user_topics.ts";

export function next_topic(
    sorted_channels_info: {
        channel_id: number;
        is_collapsed: boolean;
    }[],
    get_topics: (stream_id: number) => string[],
    has_unread_messages: (stream_id: number, topic: string) => boolean,
    curr_stream_id: number | undefined,
    curr_topic: string | undefined,
): {stream_id: number; topic: string} | undefined {
    const curr_stream_index = curr_stream_id
        ? sorted_channels_info.findIndex(({channel_id}) => channel_id === curr_stream_id)
        : -1;

    // 1. Find any unreads in the current channel after the current topic.
    if (curr_stream_index >= 0) {
        const {channel_id} = sorted_channels_info[curr_stream_index]!;
        const topics = get_topics(channel_id);
        const curr_topic_index = curr_topic !== undefined ? topics.indexOf(curr_topic) : -1; // -1 if not found

        for (let i = curr_topic_index + 1; i < topics.length; i += 1) {
            const topic = topics[i]!;
            if (has_unread_messages(channel_id, topic)) {
                return {stream_id: channel_id, topic};
            }
        }
    }

    // 2. Find any unreads after the current channel in uncollapsed folders.
    for (let i = curr_stream_index + 1; i < sorted_channels_info.length; i += 1) {
        const channel_info = sorted_channels_info[i]!;
        if (channel_info.is_collapsed) {
            continue;
        }
        for (const topic of get_topics(channel_info.channel_id)) {
            if (has_unread_messages(channel_info.channel_id, topic)) {
                return {stream_id: channel_info.channel_id, topic};
            }
        }
    }

    // `sorted_channels_info`: First has uncollapsed channels,
    //                         then collapsed ones.
    // 3. Find any unreads before the current channel:topic.
    // 4. Find any unreads in collapsed channels.
    let reached_current_narrow_state = false;
    for (const channel_info of sorted_channels_info) {
        if (reached_current_narrow_state && !channel_info.is_collapsed) {
            // We have already processed uncollapsed channels
            // after the current channel in step 2.
            continue;
        }

        for (const topic of get_topics(channel_info.channel_id)) {
            // Skip over to the next channel after reaching the current topic.
            if (
                !reached_current_narrow_state &&
                curr_stream_id !== undefined &&
                channel_info.channel_id === curr_stream_id
            ) {
                reached_current_narrow_state = curr_topic === undefined || curr_topic === topic;

                if (reached_current_narrow_state) {
                    // We already processed topic in the current channel above.
                    break;
                }
            }

            if (has_unread_messages(channel_info.channel_id, topic)) {
                return {stream_id: channel_info.channel_id, topic};
            }
        }
    }

    // 5. No unread topic found.
    return undefined;
}

export function get_next_topic(
    curr_stream_id: number | undefined,
    curr_topic: string | undefined,
    only_followed_topics: boolean,
    sorted_channels_info: {
        channel_id: number;
        is_collapsed: boolean;
    }[],
): {stream_id: number; topic: string} | undefined {
    sorted_channels_info = sorted_channels_info.filter(({channel_id}) => {
        if (!stream_data.is_muted(channel_id)) {
            return true;
        }
        if (only_followed_topics) {
            // We can use Shift + N to go to unread followed topic in muted stream.
            const topics = stream_topic_history.get_recent_topic_names(channel_id);
            return topics.some((topic) => user_topics.is_topic_followed(channel_id, topic));
        }
        if (channel_id === curr_stream_id) {
            // We can use n within a muted stream if we are
            // currently narrowed to it.
            return true;
        }
        // We can use N to go to next unread unmuted/followed topic in a muted stream .
        const topics = stream_topic_history.get_recent_topic_names(channel_id);
        return topics.some((topic) => user_topics.is_topic_unmuted_or_followed(channel_id, topic));
    });

    function get_unmuted_topics(stream_id: number): string[] {
        const narrowed_steam_id = narrow_state.stream_id();
        const topics = stream_topic_history.get_recent_topic_names(stream_id);
        const narrowed_topic = narrow_state.topic();
        if (
            narrowed_steam_id !== undefined &&
            narrowed_topic !== undefined &&
            narrowed_steam_id === stream_id &&
            _.isEqual(narrow_state.filter()?.sorted_term_types(), ["stream", "topic"]) &&
            !user_topics.is_topic_unmuted_or_followed(stream_id, narrowed_topic)
        ) {
            // Here we're using N within a muted stream starting from
            // a muted topic; advance to the next not-explicitly-muted
            // unread topic in the stream, to allow using N within
            // muted streams. We'll jump back into the normal mode if
            // we land in a followed/unmuted topic, but that's OK.

            /* istanbul ignore next */
            return topics.filter((topic) => !user_topics.is_topic_muted(stream_id, topic));
        } else if (stream_data.is_muted(stream_id)) {
            return topics.filter((topic) =>
                user_topics.is_topic_unmuted_or_followed(stream_id, topic),
            );
        }
        return topics.filter((topic) => !user_topics.is_topic_muted(stream_id, topic));
    }

    function get_followed_topics(stream_id: number): string[] {
        let topics = stream_topic_history.get_recent_topic_names(stream_id);
        topics = topics.filter((topic) => user_topics.is_topic_followed(stream_id, topic));
        return topics;
    }

    if (only_followed_topics) {
        return next_topic(
            sorted_channels_info,
            get_followed_topics,
            unread.topic_has_any_unread,
            curr_stream_id,
            curr_topic,
        );
    }

    return next_topic(
        sorted_channels_info,
        get_unmuted_topics,
        unread.topic_has_any_unread,
        curr_stream_id,
        curr_topic,
    );
}

export function get_next_unread_pm_string(curr_pm: string | undefined): string | undefined {
    const my_pm_strings = pm_conversations.recent.get_strings();
    // undefined translates to "not found".
    let curr_pm_index = -1;
    if (curr_pm !== undefined) {
        curr_pm_index = my_pm_strings.indexOf(curr_pm);
    }

    for (let i = curr_pm_index + 1; i < my_pm_strings.length; i += 1) {
        if (unread.num_unread_for_user_ids_string(my_pm_strings[i]!) > 0) {
            return my_pm_strings[i];
        }
    }

    for (let i = 0; i < curr_pm_index; i += 1) {
        if (unread.num_unread_for_user_ids_string(my_pm_strings[i]!) > 0) {
            return my_pm_strings[i];
        }
    }

    return undefined;
}

export function get_next_stream(curr_stream_id: number): number | undefined {
    const my_streams = stream_list_sort.get_stream_ids();
    const curr_stream_index = my_streams.indexOf(curr_stream_id);
    return my_streams[
        curr_stream_index === -1 || curr_stream_index === my_streams.length - 1
            ? 0
            : curr_stream_index + 1
    ];
}

export function get_prev_stream(curr_stream_id: number): number | undefined {
    const my_streams = stream_list_sort.get_stream_ids();
    const curr_stream_index = my_streams.indexOf(curr_stream_id);
    return my_streams[curr_stream_index <= 0 ? my_streams.length - 1 : curr_stream_index - 1];
}
```

--------------------------------------------------------------------------------

---[FILE: topic_link_util.ts]---
Location: zulip-main/web/src/topic_link_util.ts

```typescript
// See the Zulip URL spec at https://zulip.com/api/zulip-urls
//
// Keep this synchronized with zerver/lib/topic_link_util.py

import assert from "minimalistic-assert";

import * as hash_util from "./hash_util.ts";
import * as stream_data from "./stream_data.ts";
import type {StreamSubscription} from "./sub_store.ts";
import * as util from "./util.ts";

const invalid_stream_topic_regex = /[`>*&[\]]|(\$\$)/g;

export function will_produce_broken_stream_topic_link(word: string): boolean {
    return invalid_stream_topic_regex.test(word);
}

export function escape_invalid_stream_topic_characters(text: string): string {
    switch (text) {
        case "`":
            return "&#96;";
        case ">":
            return "&gt;";
        case "*":
            return "&#42;";
        case "&":
            return "&amp;";
        case "$$":
            return "&#36;&#36;";
        case "[":
            return "&#91;";
        case "]":
            return "&#93;";
        default:
            return text;
    }
}

// This record should be kept in sync with the
// escape_invalid_stream_topic_characters function.
const escaped_to_original_mapping: Record<string, string> = {
    "&#96;": "`",
    "&gt;": ">",
    "&#42;": "*",
    "&amp;": "&",
    "&#36;&#36;": "$$",
    "&#91;": "[",
    "&#93;": "]",
};

export function html_unescape_invalid_stream_topic_characters(text: string): string {
    const unescape_regex = new RegExp(Object.keys(escaped_to_original_mapping).join("|"), "g");
    return text.replaceAll(unescape_regex, (match) => escaped_to_original_mapping[match] ?? match);
}

export function html_escape_markdown_syntax_characters(text: string): string {
    return text.replaceAll(invalid_stream_topic_regex, escape_invalid_stream_topic_characters);
}

export function get_topic_link_content_with_stream_name(opts: {
    stream_name: string;
    topic_name: string | undefined;
    message_id: string | undefined;
}): {text: string; url: string} {
    const stream = stream_data.get_sub(opts.stream_name);
    assert(stream !== undefined);
    return _get_topic_link_content({stream, ...opts});
}

export function get_topic_link_content_with_stream_id(opts: {
    stream_id: number;
    topic_name: string | undefined;
    message_id: string | undefined;
}): {text: string; url: string} {
    const stream = stream_data.get_sub_by_id(opts.stream_id);
    assert(stream !== undefined);
    return _get_topic_link_content({stream, ...opts});
}

function _get_topic_link_content(opts: {
    stream: StreamSubscription;
    topic_name: string | undefined;
    message_id: string | undefined;
}): {text: string; url: string} {
    const {stream, topic_name, message_id} = opts;
    const stream_name = stream.name;
    const stream_id = stream.stream_id;
    const escape = html_escape_markdown_syntax_characters;
    if (topic_name !== undefined) {
        const stream_topic_url = hash_util.by_stream_topic_url(stream_id, topic_name);
        const topic_display_name = util.get_final_topic_display_name(topic_name);
        if (message_id !== undefined) {
            return {
                text: `#${escape(stream_name)} > ${escape(topic_display_name)} @ 💬`,
                url: `${stream_topic_url}/near/${message_id}`,
            };
        }
        return {
            text: `#${escape(stream_name)} > ${escape(topic_display_name)}`,
            url: stream_topic_url,
        };
    }
    return {
        text: `#${escape(stream_name)}`,
        url: hash_util.channel_url_by_user_setting(stream_id),
    };
}

export function as_markdown_link_syntax(text: string, url: string): string {
    return `[${text}](${url})`;
}

export function as_html_link_syntax_unsafe(text: string, url: string): string {
    // The caller is responsible for making sure that the `text`
    // parameter is properly escaped.
    return `<a href="${url}">${text}</a>`;
}

export function get_fallback_markdown_link(
    stream_name: string,
    topic_name?: string,
    message_id?: string,
): string {
    // Helper that should only be called by other methods in this file.

    // Generates the vanilla markdown link syntax for a stream/topic/message link, as
    // a fallback for cases where the nicer Zulip link syntax would not
    // render properly due to special characters in the channel or topic name.
    const {text, url} = get_topic_link_content_with_stream_name({
        stream_name,
        topic_name,
        message_id,
    });
    return as_markdown_link_syntax(text, url);
}

export function get_stream_topic_link_syntax(stream_name: string, topic_name: string): string {
    // If the topic name is such that it will generate an invalid #**stream>topic** syntax,
    // we revert to generating the normal markdown syntax for a link.
    if (
        will_produce_broken_stream_topic_link(topic_name) ||
        will_produce_broken_stream_topic_link(stream_name)
    ) {
        return get_fallback_markdown_link(stream_name, topic_name);
    }
    return `#**${stream_name}>${topic_name}**`;
}

export function get_stream_link_syntax(stream_name: string): string {
    // If the topic name is such that it will generate an invalid #**stream>topic** syntax,
    // we revert to generating the normal markdown syntax for a link.
    if (will_produce_broken_stream_topic_link(stream_name)) {
        return get_fallback_markdown_link(stream_name);
    }
    return `#**${stream_name}**`;
}
```

--------------------------------------------------------------------------------

````
