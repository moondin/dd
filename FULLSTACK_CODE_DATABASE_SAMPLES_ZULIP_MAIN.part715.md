---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 715
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 715 of 1290)

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

---[FILE: user_search.ts]---
Location: zulip-main/web/src/user_search.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as buddy_data from "./buddy_data.ts";
import * as popovers from "./popovers.ts";
import * as sidebar_ui from "./sidebar_ui.ts";

export class UserSearch {
    // This is mostly view code to manage the user search widget
    // above the buddy list.  We rely on other code to manage the
    // details of populating the list when we change.

    $widget = $("#userlist-header-search").expectOne();
    $input = $<HTMLInputElement>("input.user-list-filter").expectOne();
    _reset_items: () => void;
    _update_list: () => void;
    _on_focus: () => void;
    _set_is_highlight_visible: (value: boolean) => void;

    constructor(opts: {
        reset_items: () => void;
        update_list: () => void;
        on_focus: () => void;
        set_is_highlight_visible: (value: boolean) => void;
    }) {
        this._reset_items = opts.reset_items;
        this._update_list = opts.update_list;
        this._on_focus = opts.on_focus;
        this._set_is_highlight_visible = opts.set_is_highlight_visible;

        $("#userlist-header-search .input-close-filter-button").on("click", () => {
            this.clear_search();
        });

        this.$input.on("input", () => {
            const input_is_empty = this.$input.val() === "";
            buddy_data.set_is_searching_users(!input_is_empty);
            this._set_is_highlight_visible(!input_is_empty);
            opts.update_list();
        });
        this.$input.on("focus", (e) => {
            this.on_focus(e);
        });
    }

    input_field(): JQuery {
        return this.$input;
    }

    text(): string {
        const input_val = this.$input.val();
        assert(input_val !== undefined);
        return input_val.trim();
    }

    searching(): boolean {
        return this.$input.is(":focus");
    }

    // This clears search input but doesn't close
    // the search widget unless it was already empty.
    clear_search(): void {
        buddy_data.set_is_searching_users(false);

        this._set_is_highlight_visible(false);
        this.$input.val("");
        this.$input.trigger("blur");
        this._reset_items();
    }

    expand_column(): void {
        const $column = this.$input.closest(".app-main [class^='column-']");
        if (!$column.hasClass("expanded")) {
            popovers.hide_all();
            if ($column.hasClass("column-left")) {
                sidebar_ui.show_streamlist_sidebar();
            } else if ($column.hasClass("column-right")) {
                sidebar_ui.show_userlist_sidebar();
            }
        }
    }

    initiate_search(): void {
        this.expand_column();
        // Needs to be called when input is visible after fix_invite_user_button_flicker.
        setTimeout(() => {
            this.$input.trigger("focus");
        }, 0);
    }

    on_focus(e: JQuery.FocusEvent): void {
        this._on_focus();
        e.stopPropagation();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: user_settings.ts]---
Location: zulip-main/web/src/user_settings.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import type {StateData} from "./state_data.ts";

export const stream_notification_settings_schema = z.object({
    enable_stream_audible_notifications: z.boolean(),
    enable_stream_desktop_notifications: z.boolean(),
    enable_stream_email_notifications: z.boolean(),
    enable_stream_push_notifications: z.boolean(),
    wildcard_mentions_notify: z.boolean(),
});
export type StreamNotificationSettings = z.infer<typeof stream_notification_settings_schema>;

export const pm_notification_settings_schema = z.object({
    enable_desktop_notifications: z.boolean(),
    enable_offline_email_notifications: z.boolean(),
    enable_offline_push_notifications: z.boolean(),
    enable_sounds: z.boolean(),
});
export type PmNotificationSettings = z.infer<typeof pm_notification_settings_schema>;

export const followed_topic_notification_settings_schema = z.object({
    enable_followed_topic_audible_notifications: z.boolean(),
    enable_followed_topic_desktop_notifications: z.boolean(),
    enable_followed_topic_email_notifications: z.boolean(),
    enable_followed_topic_push_notifications: z.boolean(),
    enable_followed_topic_wildcard_mentions_notify: z.boolean(),
});
export type FollowedTopicNotificationSettings = z.infer<
    typeof followed_topic_notification_settings_schema
>;

export const user_settings_schema = z.object({
    ...stream_notification_settings_schema.shape,
    ...pm_notification_settings_schema.shape,
    ...followed_topic_notification_settings_schema.shape,
    allow_private_data_export: z.boolean(),
    automatically_follow_topics_policy: z.number(),
    automatically_follow_topics_where_mentioned: z.boolean(),
    automatically_unmute_topics_in_muted_streams_policy: z.number(),
    available_notification_sounds: z.array(z.string()),
    color_scheme: z.number(),
    default_language: z.string(),
    demote_inactive_streams: z.number(),
    desktop_icon_count_display: z.number(),
    display_emoji_reaction_users: z.boolean(),
    email_address_visibility: z.number(),
    email_notifications_batching_period_seconds: z.number(),
    emojiset: z.string(),
    emojiset_choices: z.array(z.object({key: z.string(), text: z.string()})),
    enable_digest_emails: z.boolean(),
    enable_drafts_synchronization: z.boolean(),
    enable_login_emails: z.boolean(),
    enable_marketing_emails: z.boolean(),
    enable_online_push_notifications: z.boolean(),
    enter_sends: z.boolean(),
    fluid_layout_width: z.boolean(),
    hide_ai_features: z.boolean(),
    high_contrast_mode: z.boolean(),
    left_side_userlist: z.boolean(),
    message_content_in_email_notifications: z.boolean(),
    notification_sound: z.string(),
    pm_content_in_desktop_notifications: z.boolean(),
    presence_enabled: z.boolean(),
    realm_name_in_email_notifications_policy: z.number(),
    receives_typing_notifications: z.boolean(),
    resolved_topic_notice_auto_read_policy: z.enum(["always", "except_followed", "never"]),
    send_private_typing_notifications: z.boolean(),
    send_read_receipts: z.boolean(),
    send_stream_typing_notifications: z.boolean(),
    starred_message_counts: z.boolean(),
    timezone: z.string(),
    translate_emoticons: z.boolean(),
    twenty_four_hour_time: z.boolean(),
    user_list_style: z.number(),
    web_animate_image_previews: z.enum(["always", "on_hover", "never"]),
    web_channel_default_view: z.number(),
    web_escape_navigates_to_home_view: z.boolean(),
    web_font_size_px: z.number(),
    web_home_view: z.enum(["inbox", "recent_topics", "all_messages"]),
    web_inbox_show_channel_folders: z.boolean(),
    web_left_sidebar_show_channel_folders: z.boolean(),
    web_left_sidebar_unreads_count_summary: z.boolean(),
    web_line_height_percent: z.number(),
    web_mark_read_on_scroll_policy: z.number(),
    web_navigate_to_sent_message: z.boolean(),
    web_stream_unreads_count_display_policy: z.number(),
    web_suggest_update_timezone: z.boolean(),
});
export type UserSettings = z.infer<typeof user_settings_schema>;

export let user_settings: UserSettings;

export function initialize_user_settings(params: StateData["user_settings"]): void {
    user_settings = params.user_settings;
}
```

--------------------------------------------------------------------------------

---[FILE: user_sort.ts]---
Location: zulip-main/web/src/user_sort.ts

```typescript
import type {User} from "./people.ts";
import {compare_a_b} from "./util.ts";

export function sort_email(a: User, b: User): number {
    const email_a = a.delivery_email;
    const email_b = b.delivery_email;

    if (email_a === null && email_b === null) {
        // If both the emails are hidden, we sort the list by name.
        return compare_a_b(a.full_name.toLowerCase(), b.full_name.toLowerCase());
    }

    if (email_a === null) {
        // User with hidden should be at last.
        return 1;
    }
    if (email_b === null) {
        // User with hidden should be at last.
        return -1;
    }
    return compare_a_b(email_a.toLowerCase(), email_b.toLowerCase());
}

export function sort_role<T extends {role: number}>(a: T, b: T): number {
    return compare_a_b(a.role, b.role);
}

export function sort_user_id(a: User, b: User): number {
    return compare_a_b(a.user_id, b.user_id);
}
```

--------------------------------------------------------------------------------

---[FILE: user_status.ts]---
Location: zulip-main/web/src/user_status.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import * as channel from "./channel.ts";
import * as emoji from "./emoji.ts";
import type {EmojiRenderingDetails} from "./emoji.ts";
import type {StateData} from "./state_data.ts";
import {user_settings} from "./user_settings.ts";
import {user_status_schema} from "./user_status_types.ts";

export type UserStatus = z.infer<typeof user_status_schema>;
export type UserStatusEmojiInfo = EmojiRenderingDetails & {
    emoji_alt_code?: boolean;
};

const user_status_event_schema = z.intersection(
    z.object({
        id: z.number(),
        type: z.literal("user_status"),
        user_id: z.number(),
    }),
    user_status_schema,
);

export type UserStatusEvent = z.infer<typeof user_status_event_schema>;

const user_info = new Map<number, string>();
const user_status_emoji_info = new Map<number, UserStatusEmojiInfo>();

export function server_update_status(opts: {
    status_text: string;
    emoji_name: string;
    emoji_code: string;
    reaction_type?: string;
    success?: () => void;
}): void {
    void channel.post({
        url: "/json/users/me/status",
        data: {
            status_text: opts.status_text,
            emoji_name: opts.emoji_name,
            emoji_code: opts.emoji_code,
            reaction_type: opts.reaction_type,
        },
        success() {
            if (opts.success) {
                opts.success();
            }
        },
    });
}

export function server_invisible_mode_on(): void {
    void channel.patch({
        url: "/json/settings",
        data: {
            presence_enabled: false,
        },
    });
}

export function server_invisible_mode_off(): void {
    void channel.patch({
        url: "/json/settings",
        data: {
            presence_enabled: true,
        },
    });
}

export function get_status_text(user_id: number): string | undefined {
    return user_info.get(user_id);
}

export function set_status_text(opts: {user_id: number; status_text: string}): void {
    if (!opts.status_text) {
        user_info.delete(opts.user_id);
        return;
    }

    user_info.set(opts.user_id, opts.status_text);
}

export function get_status_emoji(user_id: number): UserStatusEmojiInfo | undefined {
    return user_status_emoji_info.get(user_id);
}

export function set_status_emoji(event: UserStatusEvent): void {
    // TODO/typescript: Move validation to the caller when
    // server_events_dispatch.js is converted to TypeScript.
    const opts = user_status_event_schema.parse(event);

    if (!opts.emoji_name) {
        user_status_emoji_info.delete(opts.user_id);
        return;
    }

    user_status_emoji_info.set(opts.user_id, {
        emoji_alt_code: user_settings.emojiset === "text",
        ...emoji.get_emoji_details_for_rendering({
            emoji_name: opts.emoji_name,
            emoji_code: opts.emoji_code,
            reaction_type: opts.reaction_type,
        }),
    });
}

export function initialize(params: StateData["user_status"]): void {
    user_info.clear();

    for (const [str_user_id, dct] of Object.entries(params.user_status)) {
        // JSON does not allow integer keys, so we
        // convert them here.
        const user_id = Number.parseInt(str_user_id, 10);

        if (dct.status_text) {
            user_info.set(user_id, dct.status_text);
        }

        if (dct.emoji_name) {
            user_status_emoji_info.set(user_id, {
                ...emoji.get_emoji_details_for_rendering(dct),
            });
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: user_status_types.ts]---
Location: zulip-main/web/src/user_status_types.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

export const user_status_schema = z.intersection(
    z.object({
        status_text: z.optional(z.string()),
        away: z.optional(z.boolean()),
    }),
    z.union([
        z.object({
            emoji_name: z.string(),
            emoji_code: z.string(),
            reaction_type: z.enum(["zulip_extra_emoji", "realm_emoji", "unicode_emoji"]),
        }),
        z.object({
            emoji_name: z.undefined(),
        }),
    ]),
);
```

--------------------------------------------------------------------------------

---[FILE: user_status_ui.ts]---
Location: zulip-main/web/src/user_status_ui.ts

```typescript
import $ from "jquery";

import render_set_status_overlay from "../templates/set_status_overlay.hbs";
import render_status_emoji_selector from "../templates/status_emoji_selector.hbs";

import * as dialog_widget from "./dialog_widget.ts";
import * as emoji from "./emoji.ts";
import type {EmojiRenderingDetails} from "./emoji.ts";
import {$t, $t_html} from "./i18n.ts";
import * as keydown_util from "./keydown_util.ts";
import * as people from "./people.ts";
import * as user_status from "./user_status.ts";
import type {UserStatusEmojiInfo} from "./user_status.ts";

let selected_emoji_info: Partial<UserStatusEmojiInfo> = {};
let default_status_messages_and_emoji_info: {status_text: string; emoji: EmojiRenderingDetails}[];

export function set_selected_emoji_info(emoji_info: Partial<UserStatusEmojiInfo>): void {
    selected_emoji_info = {...emoji_info};
    rebuild_status_emoji_selector_ui(selected_emoji_info);
    toggle_clear_status_button();
}
export function input_field(): JQuery<HTMLInputElement> {
    return $<HTMLInputElement>("#set-user-status-modal input.user-status");
}

export function submit_button(): JQuery {
    return $("#set-user-status-modal .dialog_submit_button");
}

export function open_user_status_modal(): void {
    const user_id = people.my_current_user_id();
    const selected_emoji_info = user_status.get_status_emoji(user_id) ?? {};
    const rendered_set_status_overlay = render_set_status_overlay({
        default_status_messages_and_emoji_info,
        selected_emoji_info,
    });

    dialog_widget.launch({
        html_heading: $t_html({defaultMessage: "Set status"}),
        html_body: rendered_set_status_overlay,
        html_submit_button: $t_html({defaultMessage: "Save"}),
        id: "set-user-status-modal",
        loading_spinner: true,
        on_click: submit_new_status,
        post_render: user_status_post_render,
        on_shown() {
            input_field().trigger("focus");
        },
    });
}

export function submit_new_status(): void {
    const user_id = people.my_current_user_id();
    let old_status_text = user_status.get_status_text(user_id) ?? "";
    old_status_text = old_status_text.trim();
    const old_emoji_info = user_status.get_status_emoji(user_id);
    const new_status_text = input_field().val()?.trim() ?? "";

    if (
        old_status_text === new_status_text &&
        !emoji_status_fields_changed(selected_emoji_info, old_emoji_info)
    ) {
        dialog_widget.close();
        return;
    }

    user_status.server_update_status({
        status_text: new_status_text,
        emoji_name: selected_emoji_info.emoji_name ?? "",
        emoji_code: selected_emoji_info.emoji_code ?? "",
        reaction_type: selected_emoji_info.reaction_type ?? "",
        success() {
            dialog_widget.close();
        },
    });
}

export function update_button(): void {
    const user_id = people.my_current_user_id();
    let old_status_text = user_status.get_status_text(user_id) ?? "";
    old_status_text = old_status_text.trim();
    const old_emoji_info = user_status.get_status_emoji(user_id);
    const new_status_text = input_field().val()?.trim() ?? "";
    const $button = submit_button();

    if (
        old_status_text === new_status_text &&
        !emoji_status_fields_changed(selected_emoji_info, old_emoji_info)
    ) {
        $button.prop("disabled", true);
    } else {
        $button.prop("disabled", false);
    }
}

export function clear_message(): void {
    const $field = input_field();
    $field.val("");
    toggle_clear_status_button();
}

export function user_status_picker_open(): boolean {
    return $("#set-user-status-modal").length > 0;
}

export function toggle_clear_status_button(): void {
    if (input_field().val() === "" && !selected_emoji_info.emoji_name) {
        $("#clear_status_message_button").hide();
    } else {
        $("#clear_status_message_button").show();
    }
}

function emoji_status_fields_changed(
    selected_emoji_info: Partial<UserStatusEmojiInfo>,
    old_emoji_info?: UserStatusEmojiInfo,
): boolean {
    if (old_emoji_info === undefined && Object.keys(selected_emoji_info).length === 0) {
        return false;
    } else if (
        old_emoji_info !== undefined &&
        old_emoji_info.emoji_name === selected_emoji_info.emoji_name &&
        old_emoji_info.reaction_type === selected_emoji_info.reaction_type &&
        old_emoji_info.emoji_code === selected_emoji_info.emoji_code
    ) {
        return false;
    }

    return true;
}

function rebuild_status_emoji_selector_ui(selected_emoji_info: Partial<UserStatusEmojiInfo>): void {
    let selected_emoji = null;
    if (selected_emoji_info && Object.keys(selected_emoji_info).length > 0) {
        selected_emoji = selected_emoji_info;
    }
    const rendered_status_emoji_selector = render_status_emoji_selector({selected_emoji});
    $("#set-user-status-modal .status-emoji-wrapper").html(rendered_status_emoji_selector);
}

function user_status_post_render(): void {
    const user_id = people.my_current_user_id();
    const old_status_text = user_status.get_status_text(user_id) ?? "";
    const old_emoji_info = user_status.get_status_emoji(user_id) ?? {};
    set_selected_emoji_info(old_emoji_info);
    const $field = input_field();
    $field.val(old_status_text);
    toggle_clear_status_button();

    const $button = submit_button();
    $button.prop("disabled", true);

    $("#set-user-status-modal .user-status-value").on("click", (event) => {
        event.stopPropagation();
        const user_status_value = $(event.currentTarget).text().trim();
        $("input.user-status").val(user_status_value);

        const emoji_info =
            default_status_messages_and_emoji_info.find(
                (status) => status.status_text === user_status_value,
            )?.emoji ?? {};
        set_selected_emoji_info(emoji_info);
        toggle_clear_status_button();
        update_button();
    });

    input_field().on("keydown", (event) => {
        if (keydown_util.is_enter_event(event)) {
            event.preventDefault();

            submit_new_status();
        }
    });

    input_field().on("keyup", () => {
        update_button();
        toggle_clear_status_button();
    });

    $("#clear_status_message_button").on("click", () => {
        clear_message();
        set_selected_emoji_info({});
        update_button();
    });
}

export function initialize(): void {
    default_status_messages_and_emoji_info = [
        {
            status_text: $t({defaultMessage: "Busy"}),
            emoji: emoji.get_emoji_details_by_name("working_on_it"),
        },
        {
            status_text: $t({defaultMessage: "In a meeting"}),
            emoji: emoji.get_emoji_details_by_name("calendar"),
        },
        {
            status_text: $t({defaultMessage: "Commuting"}),
            emoji: emoji.get_emoji_details_by_name("bus"),
        },
        {
            status_text: $t({defaultMessage: "Out sick"}),
            emoji: emoji.get_emoji_details_by_name("hurt"),
        },
        {
            status_text: $t({defaultMessage: "Vacationing"}),
            emoji: emoji.get_emoji_details_by_name("palm_tree"),
        },
        {
            status_text: $t({defaultMessage: "Working remotely"}),
            emoji: emoji.get_emoji_details_by_name("house"),
        },
        {
            status_text: $t({defaultMessage: "At the office"}),
            emoji: emoji.get_emoji_details_by_name("office"),
        },
    ];
}
```

--------------------------------------------------------------------------------

---[FILE: user_topics.ts]---
Location: zulip-main/web/src/user_topics.ts
Signals: Zod

```typescript
import type * as z from "zod/mini";

import render_topic_muted from "../templates/topic_muted.hbs";

import * as blueslip from "./blueslip.ts";
import * as channel from "./channel.ts";
import * as compose_banner from "./compose_banner.ts";
import * as feedback_widget from "./feedback_widget.ts";
import {FoldDict} from "./fold_dict.ts";
import {$t} from "./i18n.ts";
import * as loading from "./loading.ts";
import * as settings_ui from "./settings_ui.ts";
import type {StateData, user_topic_schema} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import * as sub_store from "./sub_store.ts";
import * as timerender from "./timerender.ts";
import * as ui_report from "./ui_report.ts";
import {get_time_from_date_muted} from "./util.ts";

export type ServerUserTopic = z.infer<typeof user_topic_schema>;

export type UserTopic = {
    stream_id: number;
    stream: string;
    topic: string;
    date_updated: number;
    date_updated_str: string;
    visibility_policy: number;
};

const all_user_topics = new Map<
    number,
    FoldDict<{
        stream_name: string;
        date_updated: number;
        visibility_policy: number;
    }>
>();

export type AllVisibilityPolicies = {
    INHERIT: 0;
    MUTED: 1;
    UNMUTED: 2;
    FOLLOWED: 3;
};

export const all_visibility_policies = {
    INHERIT: 0,
    MUTED: 1,
    UNMUTED: 2,
    FOLLOWED: 3,
} as const;

export function update_user_topics(
    stream_id: number,
    stream_name: string,
    topic: string,
    visibility_policy: number,
    date_updated: number,
): void {
    let sub_dict = all_user_topics.get(stream_id);
    if (visibility_policy === all_visibility_policies.INHERIT && sub_dict) {
        sub_dict.delete(topic);
    } else {
        if (!sub_dict) {
            sub_dict = new FoldDict();
            all_user_topics.set(stream_id, sub_dict);
        }
        const time = get_time_from_date_muted(date_updated);
        sub_dict.set(topic, {date_updated: time, visibility_policy, stream_name});
    }
}

export function get_topic_visibility_policy(stream_id: number, topic: string): number | false {
    if (stream_id === undefined) {
        return false;
    }
    const sub_dict = all_user_topics.get(stream_id);
    return sub_dict?.get(topic)?.visibility_policy ?? all_visibility_policies.INHERIT;
}

export function is_topic_followed(stream_id: number, topic: string): boolean {
    return get_topic_visibility_policy(stream_id, topic) === all_visibility_policies.FOLLOWED;
}

export function is_topic_unmuted(stream_id: number, topic: string): boolean {
    return get_topic_visibility_policy(stream_id, topic) === all_visibility_policies.UNMUTED;
}

export function is_topic_muted(stream_id: number, topic: string): boolean {
    return get_topic_visibility_policy(stream_id, topic) === all_visibility_policies.MUTED;
}

export function is_topic_unmuted_or_followed(stream_id: number, topic: string): boolean {
    return is_topic_unmuted(stream_id, topic) || is_topic_followed(stream_id, topic);
}

export function get_user_topics_for_visibility_policy(visibility_policy: number): UserTopic[] {
    const topics: UserTopic[] = [];
    for (const [stream_id, sub_dict] of all_user_topics) {
        for (const topic of sub_dict.keys()) {
            if (sub_dict.get(topic)!.visibility_policy === visibility_policy) {
                const topic_dict = sub_dict.get(topic)!;
                const date_updated = topic_dict.date_updated;
                const date_updated_str = timerender.render_now(new Date(date_updated)).time_str;
                topics.push({
                    stream_id,
                    stream: topic_dict.stream_name,
                    topic,
                    date_updated,
                    date_updated_str,
                    visibility_policy,
                });
            }
        }
    }
    return topics;
}

export let set_user_topic_visibility_policy = (
    stream_id: number,
    topic: string,
    visibility_policy: number,
    from_hotkey?: boolean,
    from_banner?: boolean,
    $status_element?: JQuery,
    success_cb?: () => void,
    error_cb?: () => void,
): void => {
    const data = {
        stream_id,
        topic,
        visibility_policy,
    };

    let $spinner: JQuery;
    if ($status_element) {
        $spinner = $status_element.expectOne();
        $spinner.fadeTo(0, 1);
        loading.make_indicator($spinner, {text: settings_ui.strings.saving});
    }

    void channel.post({
        url: "/json/user_topics",
        data,
        success() {
            if (success_cb) {
                success_cb();
            }

            if ($status_element) {
                const remove_after = 1000;
                const appear_after = 500;
                setTimeout(() => {
                    ui_report.success(settings_ui.strings.success_html, $spinner, remove_after);
                    settings_ui.display_checkmark($spinner);
                }, appear_after);
                return;
            }

            if (visibility_policy === all_visibility_policies.INHERIT) {
                feedback_widget.dismiss();
                return;
            }
            if (from_banner) {
                compose_banner.clear_unmute_topic_notifications();
                return;
            }
            if (!from_hotkey) {
                return;
            }

            // The following feedback_widget notice helps avoid
            // confusion when a user who is not familiar with Zulip's
            // keyboard UI hits "M" in the wrong context and has a
            // bunch of messages suddenly disappear. This notice is
            // only useful when muting from the keyboard, since you
            // know what you did if you triggered muting with the
            // mouse.
            if (visibility_policy === all_visibility_policies.MUTED) {
                const stream_name = sub_store.maybe_get_stream_name(stream_id);
                feedback_widget.show({
                    populate($container) {
                        const rendered_html = render_topic_muted({});
                        $container.html(rendered_html);
                        $container.find(".stream").text(stream_name ?? "");
                        $container.find(".topic").text(topic);
                    },
                    on_undo() {
                        set_user_topic_visibility_policy(
                            stream_id,
                            topic,
                            all_visibility_policies.INHERIT,
                        );
                    },
                    title_text: $t({defaultMessage: "Topic muted"}),
                    undo_button_text: $t({defaultMessage: "Undo mute"}),
                });
            }
        },
        error() {
            if (error_cb) {
                error_cb();
            }
        },
    });
};

export function rewire_set_user_topic_visibility_policy(
    value: typeof set_user_topic_visibility_policy,
): void {
    set_user_topic_visibility_policy = value;
}

export function set_visibility_policy_for_element($elt: JQuery, visibility_policy: number): void {
    const stream_id = Number.parseInt($elt.attr("data-stream-id")!, 10);
    const topic = $elt.attr("data-topic-name")!;
    set_user_topic_visibility_policy(stream_id, topic, visibility_policy);
}

export function set_user_topic(user_topic: ServerUserTopic): void {
    const stream_id = user_topic.stream_id;
    const topic = user_topic.topic_name;
    const date_updated = user_topic.last_updated;

    const stream_name = sub_store.maybe_get_stream_name(stream_id);

    if (!stream_name) {
        blueslip.warn("Unknown stream ID in set_user_topic: " + stream_id);
        return;
    }

    update_user_topics(stream_id, stream_name, topic, user_topic.visibility_policy, date_updated);
}

export function set_user_topics(user_topics: ServerUserTopic[]): void {
    all_user_topics.clear();

    for (const user_topic of user_topics) {
        set_user_topic(user_topic);
    }
}

export function is_topic_visible_in_home(stream_id: number, topic: string): boolean {
    // This determines if topic will be visible in combined feed just based
    // on topic visibility policy and stream properties.
    if (is_topic_muted(stream_id, topic)) {
        // If topic is muted, we don't show the message.
        return false;
    }

    return (
        // If channel is muted, we show the message if topic is unmuted or followed.
        !stream_data.is_muted(stream_id) || is_topic_unmuted_or_followed(stream_id, topic)
    );
}

export function initialize(params: StateData["user_topics"]): void {
    set_user_topics(params.user_topics);
}
```

--------------------------------------------------------------------------------

---[FILE: user_topics_ui.ts]---
Location: zulip-main/web/src/user_topics_ui.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as inbox_util from "./inbox_util.ts";
import type {MessageList} from "./message_list.ts";
import * as message_lists from "./message_lists.ts";
import type {Message} from "./message_store.ts";
import * as narrow_state from "./narrow_state.ts";
import * as overlays from "./overlays.ts";
import * as popover_menus from "./popover_menus.ts";
import * as recent_view_ui from "./recent_view_ui.ts";
import * as settings_user_topics from "./settings_user_topics.ts";
import * as stream_data from "./stream_data.ts";
import * as stream_list from "./stream_list.ts";
import * as sub_store from "./sub_store.ts";
import * as unread_ui from "./unread_ui.ts";
import * as user_topics from "./user_topics.ts";
import type {ServerUserTopic} from "./user_topics.ts";

function should_add_topic_update_delay(visibility_policy: number): boolean {
    // If topic visibility related popovers are active, add a delay to all methods that
    // hide the topic on mute. This allows the switching animations to complete before the
    // popover is force closed due to the reference element being removed from view.
    const is_topic_muted = visibility_policy === user_topics.all_visibility_policies.MUTED;
    const is_relevant_popover_open =
        popover_menus.is_topic_menu_popover_displayed() ||
        popover_menus.is_visibility_policy_popover_displayed();

    // Don't add delay if the user is in inbox view or topics narrow, since
    // the popover's reference element is always visible in these cases.
    const is_inbox_view = inbox_util.is_visible();
    const is_topic_narrow = narrow_state.narrowed_by_topic_reply();

    return is_topic_muted && is_relevant_popover_open && !is_inbox_view && !is_topic_narrow;
}

export function handle_topic_updates(
    user_topic_event: ServerUserTopic,
    refreshed_current_narrow = false,
    rerender_combined_feed_callback?: (combined_feed_msg_list: MessageList) => void,
): void {
    const was_topic_visible_in_home = user_topics.is_topic_visible_in_home(
        user_topic_event.stream_id,
        user_topic_event.topic_name,
    );
    // Update the UI after changes in topic visibility policies.
    user_topics.set_user_topic(user_topic_event);

    setTimeout(
        () => {
            stream_list.update_streams_sidebar();
            unread_ui.update_unread_counts();
            recent_view_ui.update_topic_visibility_policy(
                user_topic_event.stream_id,
                user_topic_event.topic_name,
            );

            if (!refreshed_current_narrow) {
                if (message_lists.current?.data.filter.is_in_home()) {
                    const is_topic_visible_in_home = user_topics.is_topic_visible_in_home(
                        user_topic_event.stream_id,
                        user_topic_event.topic_name,
                    );
                    if (
                        rerender_combined_feed_callback &&
                        !was_topic_visible_in_home &&
                        is_topic_visible_in_home
                    ) {
                        rerender_combined_feed_callback(message_lists.current);
                    } else {
                        message_lists.current.update_muting_and_rerender();
                    }
                } else {
                    message_lists.current?.update_muting_and_rerender();
                }
            }
        },
        should_add_topic_update_delay(user_topic_event.visibility_policy) ? 500 : 0,
    );

    if (overlays.settings_open() && settings_user_topics.loaded) {
        const stream_id = user_topic_event.stream_id;
        const topic_name = user_topic_event.topic_name;
        const visibility_policy = user_topic_event.visibility_policy;

        // Find the row with the specified stream_id and topic_name
        const $row = $('tr[data-stream-id="' + stream_id + '"][data-topic="' + topic_name + '"]');

        if ($row.length > 0) {
            // If the row exists, update the status only.
            // We don't call 'populate_list' in this case as it re-creates the panel (re-sorts by date updated +
            // removes topics with status set to 'Default for channel'), making it hard to review the changes
            // and undo if needed.
            const $status = $row.find("select.settings_user_topic_visibility_policy");
            $status.val(visibility_policy);
        } else {
            // If the row doesn't exist, the user must have set the visibility policy
            // via another tab. We call 'populate_list' to re-create the panel, hence
            // including the new row.
            settings_user_topics.populate_list();
        }
    }

    setTimeout(() => {
        // Defer updates for any background-rendered messages lists until the visible one has been updated.
        for (const list of message_lists.all_rendered_message_lists()) {
            if (message_lists.current !== list) {
                if (list.data.filter.is_in_home()) {
                    const is_topic_visible_in_home = user_topics.is_topic_visible_in_home(
                        user_topic_event.stream_id,
                        user_topic_event.topic_name,
                    );
                    if (!was_topic_visible_in_home && is_topic_visible_in_home) {
                        message_lists.delete_message_list(list);
                    } else {
                        list.update_muting_and_rerender();
                    }
                } else {
                    list.update_muting_and_rerender();
                }
            }
        }
    }, 0);
}

export function toggle_topic_visibility_policy(
    message:
        | Message
        | {
              type: Message["type"];
              stream_id: number;
              topic: string;
          },
): void {
    if (message.type !== "stream") {
        return;
    }

    const stream_id = message.stream_id;
    const topic = message.topic;

    if (!stream_data.is_subscribed(stream_id)) {
        return;
    }

    const sub = sub_store.get(stream_id);
    assert(sub !== undefined);

    if (sub.is_muted) {
        if (user_topics.is_topic_unmuted_or_followed(stream_id, topic)) {
            user_topics.set_user_topic_visibility_policy(
                stream_id,
                topic,
                user_topics.all_visibility_policies.INHERIT,
                true,
            );
        } else {
            user_topics.set_user_topic_visibility_policy(
                stream_id,
                topic,
                user_topics.all_visibility_policies.UNMUTED,
                true,
            );
        }
    } else {
        if (user_topics.is_topic_muted(stream_id, topic)) {
            user_topics.set_user_topic_visibility_policy(
                stream_id,
                topic,
                user_topics.all_visibility_policies.INHERIT,
                true,
            );
        } else {
            user_topics.set_user_topic_visibility_policy(
                stream_id,
                topic,
                user_topics.all_visibility_policies.MUTED,
                true,
            );
        }
    }
}
```

--------------------------------------------------------------------------------

````
