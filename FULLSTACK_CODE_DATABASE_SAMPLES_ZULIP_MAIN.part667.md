---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 667
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 667 of 1290)

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

---[FILE: server_events_state.ts]---
Location: zulip-main/web/src/server_events_state.ts

```typescript
import type {StateData} from "./state_data";

export let queue_id: string | null;
export let assert_get_events_running: (error_message: string) => void;
export let restart_get_events: () => void;

export function initialize(
    params: StateData["server_events_state"] & {
        assert_get_events_running: (error_message: string) => void;
        restart_get_events: () => void;
    },
): void {
    queue_id = params.queue_id;
    assert_get_events_running = params.assert_get_events_running;
    restart_get_events = params.restart_get_events;
}
```

--------------------------------------------------------------------------------

---[FILE: server_event_types.ts]---
Location: zulip-main/web/src/server_event_types.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import {group_setting_value_schema, topic_link_schema} from "./types.ts";

export const user_group_update_event_schema = z.object({
    id: z.number(),
    type: z.literal("user_group"),
    op: z.literal("update"),
    group_id: z.number(),
    data: z.object({
        name: z.optional(z.string()),
        description: z.optional(z.string()),
        can_add_members_group: z.optional(group_setting_value_schema),
        can_join_group: z.optional(group_setting_value_schema),
        can_leave_group: z.optional(group_setting_value_schema),
        can_manage_group: z.optional(group_setting_value_schema),
        can_mention_group: z.optional(group_setting_value_schema),
        can_remove_members_group: z.optional(group_setting_value_schema),
        deactivated: z.optional(z.boolean()),
    }),
});
export type UserGroupUpdateEvent = z.output<typeof user_group_update_event_schema>;

export const update_message_event_schema = z.object({
    id: z.number(),
    type: z.literal("update_message"),
    user_id: z.nullable(z.number()),
    rendering_only: z.boolean(),
    message_id: z.number(),
    message_ids: z.array(z.number()),
    flags: z.array(z.string()),
    edit_timestamp: z.number(),
    stream_name: z.optional(z.string()),
    stream_id: z.optional(z.number()),
    new_stream_id: z.optional(z.number()),
    propagate_mode: z.optional(z.string()),
    orig_subject: z.optional(z.string()),
    subject: z.optional(z.string()),
    topic_links: z.optional(z.array(topic_link_schema)),
    orig_content: z.optional(z.string()),
    orig_rendered_content: z.optional(z.string()),
    content: z.optional(z.string()),
    rendered_content: z.optional(z.string()),
    is_me_message: z.optional(z.boolean()),
    // The server is still using subject.
    // This will not be set until it gets fixed.
    topic: z.optional(z.string()),
});
export type UpdateMessageEvent = z.output<typeof update_message_event_schema>;

export const message_details_schema = z.record(
    z.coerce.number<string>(),
    z.intersection(
        z.object({mentioned: z.optional(z.boolean())}),
        z.discriminatedUnion("type", [
            z.object({type: z.literal("private"), user_ids: z.array(z.number())}),
            z.object({
                type: z.literal("stream"),
                stream_id: z.number(),
                topic: z.string(),
                unmuted_stream_msg: z.boolean(),
            }),
        ]),
    ),
);
export type MessageDetails = z.output<typeof message_details_schema>;

export const channel_folder_update_event_schema = z.object({
    id: z.number(),
    type: z.literal("channel_folder"),
    op: z.literal("update"),
    channel_folder_id: z.number(),
    data: z.object({
        name: z.optional(z.string()),
        description: z.optional(z.string()),
        rendered_description: z.optional(z.string()),
        is_archived: z.optional(z.boolean()),
    }),
});
export type ChannelFolderUpdateEvent = z.output<typeof channel_folder_update_event_schema>;
```

--------------------------------------------------------------------------------

---[FILE: server_message.ts]---
Location: zulip-main/web/src/server_message.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

const display_recipient_users_schema = z.object({
    id: z.number(),
    email: z.string(),
    full_name: z.string(),
});

export const message_edit_history_schema = z.array(
    z.object({
        prev_content: z.optional(z.string()),
        prev_rendered_content: z.optional(z.string()),
        prev_stream: z.optional(z.number()),
        prev_topic: z.optional(z.string()),
        stream: z.optional(z.number()),
        timestamp: z.number(),
        topic: z.optional(z.string()),
        user_id: z.nullable(z.number()),
    }),
);

const message_reaction_schema = z.array(
    z.object({
        emoji_name: z.string(),
        emoji_code: z.string(),
        reaction_type: z.enum(["unicode_emoji", "realm_emoji", "zulip_extra_emoji"]),
        user_id: z.number(),
    }),
);

const submessage_schema = z.array(
    z.object({
        msg_type: z.string(),
        content: z.string(),
        message_id: z.number(),
        sender_id: z.number(),
        id: z.number(),
    }),
);

export const server_message_schema = z.intersection(
    z.object({
        avatar_url: z.nullish(z.string()),
        client: z.string(),
        content: z.string(),
        content_type: z.enum(["text/html", "text/x-markdown"]),
        display_recipient: z.union([z.string(), z.array(display_recipient_users_schema)]),
        edit_history: z.optional(message_edit_history_schema),
        id: z.number(),
        is_me_message: z.boolean(),
        last_edit_timestamp: z.optional(z.number()),
        last_moved_timestamp: z.optional(z.number()),
        reactions: message_reaction_schema,
        sender_email: z.string(),
        sender_full_name: z.string(),
        sender_id: z.number(),
        // The web app doesn't use sender_realm_str; ignore.
        // sender_realm_str: z.string(),
        submessages: submessage_schema,
        timestamp: z.number(),
    }),
    z.discriminatedUnion("type", [
        z.object({
            type: z.literal("stream"),
            subject: z.string(),
            stream_id: z.number(),
            topic_links: z.array(
                z.object({
                    text: z.string(),
                    url: z.string(),
                }),
            ),
        }),
        z.object({
            type: z.literal("private"),
            subject: z.literal(""),
            topic_links: z.array(z.never()),
        }),
    ]),
);
```

--------------------------------------------------------------------------------

---[FILE: settings.ts]---
Location: zulip-main/web/src/settings.ts

```typescript
import {parseISO} from "date-fns";
import $ from "jquery";

import timezones from "../generated/timezones.json";
import render_settings_overlay from "../templates/settings_overlay.hbs";
import render_settings_tab from "../templates/settings_tab.hbs";

import * as browser_history from "./browser_history.ts";
import * as common from "./common.ts";
import * as flatpickr from "./flatpickr.ts";
import {$t} from "./i18n.ts";
import * as information_density from "./information_density.ts";
import * as overlays from "./overlays.ts";
import {page_params} from "./page_params.ts";
import * as people from "./people.ts";
import * as settings_bots from "./settings_bots.ts";
import * as settings_config from "./settings_config.ts";
import * as settings_data from "./settings_data.ts";
import * as settings_org from "./settings_org.ts";
import * as settings_panel_menu from "./settings_panel_menu.ts";
import * as settings_sections from "./settings_sections.ts";
import * as settings_toggle from "./settings_toggle.ts";
import {current_user, realm} from "./state_data.ts";
import * as timerender from "./timerender.ts";
import {user_settings} from "./user_settings.ts";

function get_parsed_date_of_joining(): string {
    const user_date_joined = people.get_by_user_id(current_user.user_id).date_joined;
    return timerender.get_localized_date_or_time_for_format(
        parseISO(user_date_joined),
        "dayofyear_year",
    );
}

function user_can_change_password(): boolean {
    if (settings_data.user_email_not_configured()) {
        return false;
    }
    return realm.realm_email_auth_enabled;
}

export function update_lock_icon_in_sidebar(): void {
    if (current_user.is_owner) {
        $(".org-settings-list .locked").hide();
        return;
    }
    if (current_user.is_admin) {
        $(".org-settings-list .locked").hide();
        $(".org-settings-list li[data-section='auth-methods'] .locked").show();
        return;
    }

    $(".org-settings-list .locked").show();

    if (settings_bots.can_create_incoming_webhooks()) {
        $(".org-settings-list li[data-section='bots'] .locked").hide();
    }

    if (settings_data.user_can_add_custom_emoji()) {
        $(".org-settings-list li[data-section='emoji-settings'] .locked").hide();
    }
}

export function build_page(): void {
    const settings_label = {
        // settings_notification
        allow_private_data_export: $t({
            defaultMessage: "Let administrators export my private data",
        }),
        presence_enabled: $t({
            defaultMessage: "Display my availability to other users",
        }),
        presence_enabled_parens_text: $t({defaultMessage: "invisible mode off"}),
        send_stream_typing_notifications: $t({
            defaultMessage: "Let recipients see when I'm typing messages in channels",
        }),
        send_private_typing_notifications: $t({
            defaultMessage: "Let recipients see when I'm typing direct messages",
        }),
        send_read_receipts: $t({
            defaultMessage: "Let others see when I've read messages",
        }),

        ...settings_config.notification_settings_labels,
        ...settings_config.preferences_settings_labels,
    };

    const is_export_without_consent_enabled = realm.realm_owner_full_content_access;
    const private_data_export_tooltip_text = is_export_without_consent_enabled
        ? $t({
              defaultMessage:
                  "Administrators of this organization are allowed to export private data for all users.",
          })
        : undefined;

    const rendered_settings_tab = render_settings_tab({
        full_name: people.my_full_name(),
        profile_picture: people.small_avatar_url_for_person(
            people.get_by_user_id(people.my_current_user_id()),
        ),
        date_joined_text: get_parsed_date_of_joining(),
        current_user,
        page_params,
        realm,
        enable_sound_select:
            user_settings.enable_sounds || user_settings.enable_stream_audible_notifications,
        zuliprc: "zuliprc",
        botserverrc: "botserverrc",
        timezones: timezones.timezones,
        can_create_new_bots: settings_bots.can_create_incoming_webhooks(),
        settings_label,
        demote_inactive_streams_values: settings_config.demote_inactive_streams_values,
        web_mark_read_on_scroll_policy_values:
            settings_config.web_mark_read_on_scroll_policy_values,
        web_channel_default_view_values: settings_config.web_channel_default_view_values,
        user_list_style_values: settings_config.user_list_style_values,
        web_animate_image_previews_values: settings_config.web_animate_image_previews_values,
        resolved_topic_notice_auto_read_policy_values:
            settings_config.resolved_topic_notice_auto_read_policy_values,
        web_stream_unreads_count_display_policy_values:
            settings_config.web_stream_unreads_count_display_policy_values,
        color_scheme_values: settings_config.color_scheme_values,
        web_home_view_values: settings_config.web_home_view_values,
        twenty_four_hour_time_values: settings_config.twenty_four_hour_time_values,
        general_settings: settings_config.all_notifications(user_settings).general_settings,
        notification_settings: settings_config.all_notifications(user_settings).settings,
        custom_stream_specific_notification_settings:
            settings_config.get_custom_stream_specific_notifications_table_row_data(),
        email_notifications_batching_period_values:
            settings_config.email_notifications_batching_period_values,
        realm_name_in_email_notifications_policy_values:
            settings_config.realm_name_in_email_notifications_policy_values,
        desktop_icon_count_display_values: settings_config.desktop_icon_count_display_values,
        disabled_notification_settings:
            settings_config.all_notifications(user_settings).disabled_notification_settings,
        information_density_settings: settings_config.get_information_density_preferences(),
        settings_render_only: settings_config.get_settings_render_only(),
        user_can_change_name: settings_data.user_can_change_name(),
        user_can_change_avatar: settings_data.user_can_change_avatar(),
        user_can_change_email: settings_data.user_can_change_email(),
        user_role_text: people.get_user_type(current_user.user_id),
        default_language: user_settings.default_language,
        realm_push_notifications_enabled: realm.realm_push_notifications_enabled,
        settings_object: user_settings,
        send_read_receipts_tooltip: $t({
            defaultMessage: "Read receipts are currently disabled in this organization.",
        }),
        user_is_only_organization_owner: people.is_current_user_only_owner(),
        email_address_visibility_values: settings_config.email_address_visibility_values,
        owner_is_only_user_in_organization: people.get_active_human_count() === 1,
        user_can_change_password: user_can_change_password(),
        user_role_values: settings_config.user_role_values,
        user_has_email_set: !settings_data.user_email_not_configured(),
        automatically_follow_topics_policy_values:
            settings_config.automatically_follow_or_unmute_topics_policy_values,
        automatically_unmute_topics_in_muted_streams_policy_values:
            settings_config.automatically_follow_or_unmute_topics_policy_values,
        web_line_height_percent_display_value:
            information_density.get_string_display_value_for_line_height(
                user_settings.web_line_height_percent,
            ),
        max_user_name_length: people.MAX_USER_NAME_LENGTH,
        private_data_export_is_checked:
            user_settings.allow_private_data_export || is_export_without_consent_enabled,
        private_data_export_is_disabled: is_export_without_consent_enabled,
        private_data_export_tooltip_text,
    });

    $(".settings-box").html(rendered_settings_tab);
    common.adjust_mac_kbd_tags("#user_enter_sends_label kbd");
}

export function open_settings_overlay(): void {
    overlays.open_overlay({
        name: "settings",
        $overlay: $("#settings_overlay_container"),
        on_close() {
            browser_history.exit_overlay();
            flatpickr.close_all();
            settings_panel_menu.mobile_deactivate_section();
            settings_org.maybe_store_unsaved_welcome_message_custom_text();
        },
    });
}

export function launch(section: string): void {
    settings_sections.reset_sections();

    open_settings_overlay();
    if (section !== "") {
        settings_panel_menu.normal_settings.set_current_tab(section);
    }
    settings_toggle.goto("settings");
}

export function initialize(): void {
    const rendered_settings_overlay = render_settings_overlay({
        is_owner: current_user.is_owner,
        is_admin: current_user.is_admin,
        is_guest: current_user.is_guest,
        show_uploaded_files_section: realm.max_file_upload_size_mib > 0,
        show_emoji_settings_lock: !settings_data.user_can_add_custom_emoji(),
        can_create_new_bots: settings_bots.can_create_incoming_webhooks(),
        can_edit_user_panel:
            current_user.is_admin ||
            settings_data.user_can_create_multiuse_invite() ||
            settings_data.user_can_invite_users_by_email(),
    });
    $("#settings_overlay_container").append($(rendered_settings_overlay));
}
```

--------------------------------------------------------------------------------

````
