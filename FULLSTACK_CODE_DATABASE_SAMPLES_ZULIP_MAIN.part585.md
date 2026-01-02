---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 585
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 585 of 1290)

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

---[FILE: add_subscribers_pill.ts]---
Location: zulip-main/web/src/add_subscribers_pill.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as blueslip from "./blueslip.ts";
import * as input_pill from "./input_pill.ts";
import * as keydown_util from "./keydown_util.ts";
import * as loading from "./loading.ts";
import type {User} from "./people.ts";
import * as pill_typeahead from "./pill_typeahead.ts";
import * as stream_pill from "./stream_pill.ts";
import type {CombinedPill, CombinedPillContainer} from "./typeahead_helper.ts";
import * as user_group_pill from "./user_group_pill.ts";
import * as user_groups from "./user_groups.ts";
import type {UserGroup} from "./user_groups.ts";
import * as user_pill from "./user_pill.ts";

export function create_item_from_text(
    text: string,
    current_items: CombinedPill[],
): CombinedPill | undefined {
    const funcs = [
        stream_pill.create_item_from_stream_name,
        user_group_pill.create_item_from_group_name,
        user_pill.create_item_from_user_id,
    ];
    for (const func of funcs) {
        const item = func(text, current_items);
        if (item) {
            return item;
        }
    }
    return undefined;
}

export function get_text_from_item(item: CombinedPill): string {
    let text: string;
    switch (item.type) {
        case "stream":
            text = stream_pill.get_stream_name_from_item(item);
            break;
        case "user_group":
            text = user_group_pill.get_group_name_from_item(item);
            break;
        case "user":
            text = user_pill.get_unique_full_name_from_item(item);
            break;
    }
    return text;
}

export function set_up_pill_typeahead({
    pill_widget,
    $pill_container,
    get_users,
    get_user_groups,
    for_stream_subscribers,
}: {
    pill_widget: CombinedPillContainer;
    $pill_container: JQuery;
    get_users: () => User[];
    get_user_groups?: () => UserGroup[];
    for_stream_subscribers: boolean;
}): void {
    const opts: {
        user_source: () => User[];
        stream: boolean;
        user_group: boolean;
        user: boolean;
        user_group_source?: () => UserGroup[];
        for_stream_subscribers: boolean;
    } = {
        user_source: get_users,
        stream: true,
        user_group: true,
        user: true,
        for_stream_subscribers,
    };
    if (get_user_groups !== undefined) {
        opts.user_group_source = get_user_groups;
    }
    pill_typeahead.set_up_combined($pill_container.find(".input"), pill_widget, opts);
}

export function get_display_value_from_item(item: CombinedPill): string {
    if (item.type === "user_group") {
        const group = user_groups.get_user_group_from_id(item.group_id);
        return user_groups.get_display_group_name(group.name);
    } else if (item.type === "stream") {
        return stream_pill.get_display_value_from_item(item);
    }
    assert(item.type === "user");
    return user_pill.get_display_value_from_item(item);
}

export function generate_pill_html(item: CombinedPill): string {
    if (item.type === "user_group") {
        return user_group_pill.generate_pill_html(item);
    } else if (item.type === "user") {
        return user_pill.generate_pill_html(item);
    }
    assert(item.type === "stream");
    return stream_pill.generate_pill_html(item);
}

export function set_up_handlers_for_add_button_state(
    pill_widget: CombinedPillContainer | user_group_pill.UserGroupPillWidget,
    $pill_container: JQuery,
    pill_update_callback?: () => void,
): void {
    const $pill_widget_input = $pill_container.find(".input");
    const $pill_widget_button = $pill_container.closest(".add-button-container").find("button");
    // Disable the add button first time the pill container is created.
    $pill_widget_button.prop("disabled", true);

    // If all the pills are removed, disable the add button.
    pill_widget.onPillRemove(() => {
        $pill_widget_button.prop("disabled", pill_widget.items().length === 0);
        if (pill_update_callback) {
            pill_update_callback();
        }
    });
    // If a pill is added, enable the add button.
    pill_widget.onPillCreate(() => {
        $pill_widget_button.prop("disabled", false);
        if (pill_update_callback) {
            pill_update_callback();
        }
    });
    // Disable the add button when there is no pending text that can be converted
    // into a pill and the number of existing pills is zero.
    $pill_widget_input.on("input", () =>
        $pill_widget_button.prop(
            "disabled",
            !pill_widget.is_pending() && pill_widget.items().length === 0,
        ),
    );
}

export function create({
    $pill_container,
    get_potential_subscribers,
    get_user_groups,
    with_add_button,
    onPillCreateAction,
    onPillRemoveAction,
    add_button_pill_update_callback,
}: {
    $pill_container: JQuery;
    get_potential_subscribers: () => User[];
    get_user_groups: () => UserGroup[];
    with_add_button: boolean;
    onPillCreateAction?: (pill_user_ids: number[]) => void;
    onPillRemoveAction?: (pill_user_ids: number[]) => void;
    add_button_pill_update_callback?: () => void;
}): CombinedPillContainer {
    const pill_widget = input_pill.create<CombinedPill>({
        $container: $pill_container,
        create_item_from_text,
        get_text_from_item,
        get_display_value_from_item,
        generate_pill_html,
        show_outline_on_invalid_input: true,
    });

    if (onPillCreateAction) {
        pill_widget.onPillCreate(() => {
            void (async () => {
                loading.make_indicator($(".add-subscriber-loading-spinner"), {
                    height: 56, // 4em at 14px / 1em
                });
                const user_ids = await get_pill_user_ids(pill_widget);
                onPillCreateAction(user_ids);
                loading.destroy_indicator($(".add-subscriber-loading-spinner"));
            })();
        });
    }

    if (onPillRemoveAction) {
        pill_widget.onPillRemove(() => {
            void (async () => {
                const user_ids = await get_pill_user_ids(pill_widget);
                onPillRemoveAction(user_ids);
            })();
        });
    }

    function get_users(): User[] {
        const potential_subscribers = get_potential_subscribers();
        return user_pill.filter_taken_users(potential_subscribers, pill_widget);
    }

    function get_groups(): UserGroup[] {
        let groups = get_user_groups();
        groups = groups.filter((item) => item.name !== "role:nobody");
        return user_group_pill.filter_taken_groups(groups, pill_widget);
    }

    set_up_pill_typeahead({
        pill_widget,
        $pill_container,
        get_users,
        get_user_groups: get_groups,
        for_stream_subscribers: true,
    });

    if (with_add_button) {
        set_up_handlers_for_add_button_state(
            pill_widget,
            $pill_container,
            add_button_pill_update_callback,
        );
    }

    return pill_widget;
}

export function append_user_group_from_name(
    user_group_name: string,
    pill_widget: CombinedPillContainer,
): void {
    const user_group = user_groups.get_user_group_from_name(user_group_name);
    if (user_group === undefined) {
        // This shouldn't happen, but we'll give a warning for now if it
        // does.
        blueslip.error("User group with the given name does not exist.");
        return;
    }

    user_group_pill.append_user_group(user_group, pill_widget);
}

export async function get_pill_user_ids(pill_widget: CombinedPillContainer): Promise<number[]> {
    const user_ids = user_pill.get_user_ids(pill_widget);
    const stream_user_ids = await stream_pill.get_user_ids(pill_widget);
    const group_user_ids = user_group_pill.get_user_ids(pill_widget);
    return [...user_ids, ...stream_user_ids, ...group_user_ids];
}

export function set_up_handlers({
    get_pill_widget,
    $parent_container,
    pill_selector,
    button_selector,
    action,
}: {
    get_pill_widget: () => CombinedPillContainer;
    $parent_container: JQuery;
    pill_selector: string;
    button_selector: string;
    action: ({pill_user_ids}: {pill_user_ids: number[]}) => void;
}): void {
    /*
        This function handles events for any UI that looks like
        this:

            [pill-enabled input box for subscribers] [Add button]

        In an ideal world the above two widgets would be enclosed in
        a <form>...</form> section and we would have a single submit
        handler, but our current implementation of input pills has
        some magic that prevents the pills from playing nice with
        the vanilla HTML form/submit mechanism.

        So, instead, we provide this helper function to manage
        the two events needed to make it look like the widgets
        are inside an actual HTML <form> tag.

        This abstraction also automatically retrieves the user_ids
        from the input pill and sends them back to the `action`
        function passed in.

        The subscriber input-pill widgets lets you provide
        user_ids by creating pills for either:

            * single user
            * user group
            * stream (i.e. subscribed users for the stream)
    */
    function callback(): void {
        const pill_widget = get_pill_widget();
        void (async () => {
            loading.make_indicator($(".add-subscriber-loading-spinner"), {
                height: 56, // 4em at 14px / 1em
            });
            const pill_user_ids = await get_pill_user_ids(pill_widget);
            // If we're no longer in the same view after fetching
            // subscriber data, don't update the UI. We don't need
            // to destroy the loading spinner because the tab re-renders
            // every time it opens, and also there might be a new tab
            // with a current loading spinner.
            if (get_pill_widget() !== pill_widget) {
                return;
            }
            loading.destroy_indicator($(".add-subscriber-loading-spinner"));
            action({pill_user_ids});
        })();
    }

    $parent_container.on("keyup", pill_selector, (e) => {
        const pill_widget = get_pill_widget();
        if (!pill_widget.is_pending() && keydown_util.is_enter_event(e)) {
            e.preventDefault();
            callback();
        }
    });

    $parent_container.on("click", button_selector, (e) => {
        const pill_widget = get_pill_widget();
        if (!pill_widget.is_pending()) {
            e.preventDefault();
            callback();
        } else {
            // We are not appending any value here, but instead this is
            // a proxy to invoke the error state for a pill widget
            // that would usually get triggered on pressing enter.
            pill_widget.appendValue(pill_widget.getCurrentText()!);
        }
    });
}
```

--------------------------------------------------------------------------------

---[FILE: admin.ts]---
Location: zulip-main/web/src/admin.ts

```typescript
import $ from "jquery";
import * as tippy from "tippy.js";

import render_admin_tab from "../templates/settings/admin_tab.hbs";
import render_settings_organization_settings_tip from "../templates/settings/organization_settings_tip.hbs";

import * as bot_data from "./bot_data.ts";
import * as demo_organizations_ui from "./demo_organizations_ui.ts";
import {$t, language_list} from "./i18n.ts";
import * as information_density from "./information_density.ts";
import {page_params} from "./page_params.ts";
import * as people from "./people.ts";
import {postprocess_content} from "./postprocess_content.ts";
import {realm_user_settings_defaults} from "./realm_user_settings_defaults.ts";
import * as settings from "./settings.ts";
import * as settings_bots from "./settings_bots.ts";
import * as settings_components from "./settings_components.ts";
import type {AllNotifications} from "./settings_config.ts";
import * as settings_config from "./settings_config.ts";
import * as settings_data from "./settings_data.ts";
import * as settings_invites from "./settings_invites.ts";
import * as settings_org from "./settings_org.ts";
import * as settings_panel_menu from "./settings_panel_menu.ts";
import * as settings_sections from "./settings_sections.ts";
import * as settings_toggle from "./settings_toggle.ts";
import * as settings_users from "./settings_users.ts";
import {current_user, realm} from "./state_data.ts";
import {the} from "./util.ts";
import * as util from "./util.ts";

const admin_settings_label = {
    // Organization profile
    realm_want_advertise_in_communities_directory: $t({
        defaultMessage: "Advertise organization in the Zulip communities directory",
    }),
    // Organization settings
    realm_new_stream_announcements_stream: $t({defaultMessage: "New channel announcements"}),
    realm_signup_announcements_stream: $t({defaultMessage: "New user announcements"}),
    realm_zulip_update_announcements_stream: $t({defaultMessage: "Zulip update announcements"}),
    realm_moderation_request_channel: $t({defaultMessage: "Moderation requests"}),
    realm_inline_image_preview: $t({
        defaultMessage: "Show previews of uploaded and linked images and videos",
    }),
    realm_inline_url_embed_preview: $t({defaultMessage: "Show previews of linked websites"}),
    realm_send_welcome_emails: $t({defaultMessage: "Send emails introducing Zulip to new users"}),
    realm_require_e2ee_push_notifications: $t({
        defaultMessage: "Require end-to-end encryption for push notification content",
    }),
    realm_message_content_allowed_in_email_notifications: $t({
        defaultMessage: "Allow message content in message notification emails",
    }),
    realm_enable_spectator_access: $t({
        defaultMessage: "Allow creating web-public channels (visible to anyone on the Internet)",
    }),
    realm_send_channel_events_messages: $t({
        defaultMessage: "Send automated messages for channel events",
    }),
    realm_digest_emails_enabled: $t({
        defaultMessage: "Send weekly digest emails to inactive users",
    }),
    realm_default_code_block_language: $t({defaultMessage: "Default language for code blocks"}),
    realm_enable_welcome_message_custom_text: $t({
        defaultMessage: "Send a custom Welcome Bot message to new users",
    }),

    // Organization permissions
    realm_require_unique_names: $t({defaultMessage: "Require unique names"}),
    realm_name_changes_disabled: $t({defaultMessage: "Prevent users from changing their name"}),
    realm_email_changes_disabled: $t({
        defaultMessage: "Prevent users from changing their email address",
    }),
    realm_avatar_changes_disabled: $t({defaultMessage: "Prevent users from changing their avatar"}),
    realm_invite_required: $t({
        defaultMessage: "Invitations are required for joining this organization",
    }),
    realm_default_language: $t({
        defaultMessage: "Language for automated messages and invitation emails",
    }),
    realm_allow_message_editing: $t({defaultMessage: "Allow message editing"}),
    realm_enable_read_receipts: $t({defaultMessage: "Enable read receipts"}),
    realm_enable_read_receipts_parens_text: $t({
        defaultMessage: "Users can always disable their personal read receipts.",
    }),
    realm_enable_guest_user_indicator: $t({
        defaultMessage: "Display “(guest)” after names of guest users",
    }),
    realm_enable_guest_user_dm_warning: $t({
        defaultMessage: "Warn when composing a DM to a guest",
    }),
};

function insert_tip_box(): void {
    if (current_user.is_admin) {
        return;
    }
    const tip_box_html = render_settings_organization_settings_tip({
        is_admin: current_user.is_admin,
    });
    $(".organization-box")
        .find(".settings-section, .user-settings-section")
        .not("#emoji-settings")
        .not("#organization-auth-settings")
        .not("#admin-bot-list")
        .not("#admin-invites-list")
        .not("#admin-user-list")
        .not("#admin-active-users-list")
        .not("#admin-deactivated-users-list")
        .prepend($(tip_box_html));
}

function get_realm_level_notification_settings(): {
    general_settings: AllNotifications["general_settings"];
    notification_settings: AllNotifications["settings"];
    disabled_notification_settings: AllNotifications["disabled_notification_settings"];
} {
    const all_notifications_settings = settings_config.all_notifications(
        realm_user_settings_defaults,
    );

    // We remove enable_marketing_emails and enable_login_emails
    // setting from all_notification_settings, since there are no
    // realm-level defaults for these setting.
    all_notifications_settings.settings.other_email_settings = ["enable_digest_emails"];

    return {
        general_settings: all_notifications_settings.general_settings,
        notification_settings: all_notifications_settings.settings,
        disabled_notification_settings: all_notifications_settings.disabled_notification_settings,
    };
}

export function build_page(): void {
    let realm_night_logo_url = realm.realm_night_logo_url;
    if (realm.realm_logo_source !== "D" && realm.realm_night_logo_source === "D") {
        // If no dark theme logo is specified but a light theme one is,
        // use the light theme one.  See also similar code in realm_logo.js.
        realm_night_logo_url = realm.realm_logo_url;
    }

    let gif_help_link = "/help/animated-gifs";
    if (realm.giphy_api_key === "" && realm.tenor_api_key === "") {
        gif_help_link =
            "https://zulip.readthedocs.io/en/latest/production/gif-picker-integrations.html";
    }

    const options = {
        custom_profile_field_types: realm.custom_profile_field_types,
        full_name: current_user.full_name,
        profile_picture: people.small_avatar_url_for_person(current_user),
        realm_name: realm.realm_name,
        realm_org_type: realm.realm_org_type,
        realm_available_video_chat_providers: realm.realm_available_video_chat_providers,
        server_jitsi_server_url: realm.server_jitsi_server_url,
        gif_rating_options: realm.gif_rating_options,
        gif_api_key_empty: realm.giphy_api_key === "" && realm.tenor_api_key === "",
        realm_description_text: realm.realm_description,
        realm_description_html: postprocess_content(page_params.realm_rendered_description),
        realm_inline_image_preview: realm.realm_inline_image_preview,
        server_inline_image_preview: realm.server_inline_image_preview,
        realm_inline_url_embed_preview: realm.realm_inline_url_embed_preview,
        server_inline_url_embed_preview: realm.server_inline_url_embed_preview,
        realm_authentication_methods: realm.realm_authentication_methods,
        realm_name_changes_disabled: realm.realm_name_changes_disabled,
        server_name_changes_disabled: realm.server_name_changes_disabled,
        realm_require_unique_names: realm.realm_require_unique_names,
        realm_email_changes_disabled: realm.realm_email_changes_disabled,
        realm_avatar_changes_disabled: realm.realm_avatar_changes_disabled,
        server_avatar_changes_disabled: realm.server_avatar_changes_disabled,
        can_add_emojis: settings_data.user_can_add_custom_emoji(),
        can_create_new_bots: settings_bots.can_create_incoming_webhooks(),
        realm_message_content_edit_limit_minutes:
            settings_components.get_realm_time_limits_in_minutes(
                "realm_message_content_edit_limit_seconds",
            ),
        realm_move_messages_between_streams_limit_minutes:
            settings_components.get_realm_time_limits_in_minutes(
                "realm_move_messages_between_streams_limit_seconds",
            ),
        realm_move_messages_within_stream_limit_minutes:
            settings_components.get_realm_time_limits_in_minutes(
                "realm_move_messages_within_stream_limit_seconds",
            ),
        realm_message_content_delete_limit_minutes:
            settings_components.get_realm_time_limits_in_minutes(
                "realm_message_content_delete_limit_seconds",
            ),
        realm_message_retention_days: realm.realm_message_retention_days,
        realm_message_edit_history_visibility_policy:
            realm.realm_message_edit_history_visibility_policy,
        realm_allow_message_editing: realm.realm_allow_message_editing,
        language_list,
        realm_default_language_code: realm.realm_default_language,
        realm_waiting_period_threshold: realm.realm_waiting_period_threshold,
        realm_moderation_request_channel_id: realm.realm_moderation_request_channel_id,
        realm_new_stream_announcements_stream_id: realm.realm_new_stream_announcements_stream_id,
        realm_signup_announcements_stream_id: realm.realm_signup_announcements_stream_id,
        realm_zulip_update_announcements_stream_id:
            realm.realm_zulip_update_announcements_stream_id,
        is_admin: current_user.is_admin,
        is_guest: current_user.is_guest,
        is_owner: current_user.is_owner,
        user_can_change_logo: settings_data.user_can_change_logo(),
        realm_icon_source: realm.realm_icon_source,
        realm_icon_url: realm.realm_icon_url,
        realm_logo_source: realm.realm_logo_source,
        realm_logo_url: realm.realm_logo_url,
        realm_night_logo_source: realm.realm_night_logo_source,
        realm_night_logo_url,
        realm_topics_policy: realm.realm_topics_policy,
        realm_topics_policy_values: settings_config.get_realm_topics_policy_values(),
        empty_string_topic_display_name: util.get_final_topic_display_name(""),
        realm_send_welcome_emails: realm.realm_send_welcome_emails,
        realm_enable_welcome_message_custom_text:
            realm.realm_welcome_message_custom_text.length > 0,
        realm_welcome_message_custom_text: realm.realm_welcome_message_custom_text,
        realm_require_e2ee_push_notifications: realm.realm_require_e2ee_push_notifications,
        realm_message_content_allowed_in_email_notifications:
            realm.realm_message_content_allowed_in_email_notifications,
        realm_enable_spectator_access: realm.realm_enable_spectator_access,
        settings_send_digest_emails: realm.settings_send_digest_emails,
        realm_send_channel_events_messages: realm.realm_send_channel_events_messages,
        realm_digest_emails_enabled: realm.realm_digest_emails_enabled,
        realm_digest_weekday: realm.realm_digest_weekday,
        development: page_params.development_environment,
        zulip_plan_is_not_limited: realm.zulip_plan_is_not_limited,
        upgrade_text_for_wide_organization_logo: realm.upgrade_text_for_wide_organization_logo,
        realm_default_external_accounts: realm.realm_default_external_accounts,
        admin_settings_label,
        msg_edit_limit_dropdown_values: settings_config.msg_edit_limit_dropdown_values,
        msg_delete_limit_dropdown_values: settings_config.msg_delete_limit_dropdown_values,
        msg_move_limit_dropdown_values: settings_config.msg_move_limit_dropdown_values,
        email_address_visibility_values: settings_config.email_address_visibility_values,
        waiting_period_threshold_dropdown_values:
            settings_config.waiting_period_threshold_dropdown_values,
        message_edit_history_visibility_policy_values:
            settings_config.message_edit_history_visibility_policy_values,
        can_create_multiuse_invite: settings_data.user_can_create_multiuse_invite(),
        can_invite_users_by_email: settings_data.user_can_invite_users_by_email(),
        realm_invite_required: realm.realm_invite_required,
        policy_values: settings_config.common_policy_values,
        ...settings_org.get_organization_settings_options(),
        demote_inactive_streams_values: settings_config.demote_inactive_streams_values,
        web_mark_read_on_scroll_policy_values:
            settings_config.web_mark_read_on_scroll_policy_values,
        web_channel_default_view_values: settings_config.web_channel_default_view_values,
        user_list_style_values: settings_config.user_list_style_values,
        web_stream_unreads_count_display_policy_values:
            settings_config.web_stream_unreads_count_display_policy_values,
        web_animate_image_previews_values: settings_config.web_animate_image_previews_values,
        resolved_topic_notice_auto_read_policy_values:
            settings_config.resolved_topic_notice_auto_read_policy_values,
        color_scheme_values: settings_config.color_scheme_values,
        web_home_view_values: settings_config.web_home_view_values,
        settings_object: realm_user_settings_defaults,
        information_density_settings: settings_config.get_information_density_preferences(),
        settings_render_only: settings_config.get_settings_render_only(),
        settings_label: settings_config.realm_user_settings_defaults_labels,
        desktop_icon_count_display_values: settings_config.desktop_icon_count_display_values,
        enable_sound_select:
            realm_user_settings_defaults.enable_sounds ||
            realm_user_settings_defaults.enable_stream_audible_notifications,
        email_notifications_batching_period_values:
            settings_config.email_notifications_batching_period_values,
        realm_name_in_email_notifications_policy_values:
            settings_config.realm_name_in_email_notifications_policy_values,
        twenty_four_hour_time_values: settings_config.twenty_four_hour_time_values,
        disable_enable_spectator_access_setting:
            !realm.server_web_public_streams_enabled || !realm.zulip_plan_is_not_limited,
        realm_push_notifications_enabled: realm.realm_push_notifications_enabled,
        realm_org_type_values: settings_org.get_org_type_dropdown_options(),
        realm_want_advertise_in_communities_directory:
            realm.realm_want_advertise_in_communities_directory,
        disable_want_advertise_in_communities_directory: !realm.realm_push_notifications_enabled,
        is_business_type_org:
            realm.realm_org_type === settings_config.all_org_type_values.business.code,
        realm_enable_read_receipts: realm.realm_enable_read_receipts,
        allow_sorting_deactivated_users_list_by_email:
            settings_users.allow_sorting_deactivated_users_list_by_email(),
        has_bots: bot_data.get_all_bots_for_current_user().length > 0,
        user_has_email_set: !settings_data.user_email_not_configured(),
        automatically_follow_topics_policy_values:
            settings_config.automatically_follow_or_unmute_topics_policy_values,
        automatically_unmute_topics_in_muted_streams_policy_values:
            settings_config.automatically_follow_or_unmute_topics_policy_values,
        realm_enable_guest_user_indicator: realm.realm_enable_guest_user_indicator,
        realm_enable_guest_user_dm_warning: realm.realm_enable_guest_user_dm_warning,
        active_user_list_dropdown_widget_name: settings_users.active_user_list_dropdown_widget_name,
        deactivated_user_list_dropdown_widget_name:
            settings_users.deactivated_user_list_dropdown_widget_name,
        gif_help_link,
        ...get_realm_level_notification_settings(),
        all_bots_list_dropdown_widget_name: settings_bots.all_bots_list_dropdown_widget_name,
        your_bots_list_dropdown_widget_name: settings_bots.your_bots_list_dropdown_widget_name,
        group_setting_labels: settings_config.all_group_setting_labels.realm,
        server_can_summarize_topics: realm.server_can_summarize_topics,
        is_plan_self_hosted:
            realm.realm_plan_type === settings_config.realm_plan_types.self_hosted.code,
        has_billing_access: settings_data.user_has_billing_access(),
        web_line_height_percent_display_value:
            information_density.get_string_display_value_for_line_height(
                realm_user_settings_defaults.web_line_height_percent,
            ),
    };

    const rendered_admin_tab = render_admin_tab(options);
    $("#settings_content .organization-box").html(rendered_admin_tab);
    $("#settings_content .alert").removeClass("show");

    settings_bots.update_bot_settings_tip($("#admin-bot-settings-tip"));
    settings_invites.update_invite_user_panel();
    insert_tip_box();

    if (realm.demo_organization_scheduled_deletion_date && current_user.is_admin) {
        demo_organizations_ui.insert_demo_organization_warning();
        demo_organizations_ui.handle_demo_organization_conversion();
    }

    $("#id_realm_digest_weekday").val(realm.realm_digest_weekday);

    const is_plan_plus = realm.realm_plan_type === settings_config.realm_plan_types.plus.code;
    const is_plan_self_hosted =
        realm.realm_plan_type === settings_config.realm_plan_types.self_hosted.code;
    if (current_user.is_admin && !(is_plan_plus || is_plan_self_hosted)) {
        $("#realm_can_access_all_users_group_widget").prop("disabled", true);

        const opts: {content?: string} = {};
        if (settings_data.user_has_billing_access()) {
            opts.content = $t({
                defaultMessage: "This feature is available on Zulip Cloud Plus. Upgrade to access.",
            });
        } else {
            opts.content = $t({
                defaultMessage: "This feature is available on Zulip Cloud Plus.",
            });
        }

        tippy.default(the($("#realm_can_access_all_users_group_widget_container")), opts);
    }
}

export function launch(section: string, settings_tab: string | undefined): void {
    settings_sections.reset_sections();

    settings.open_settings_overlay();
    if (section !== "") {
        settings_panel_menu.org_settings.set_current_tab(section);
    }
    if (section === "users") {
        settings_panel_menu.org_settings.set_user_settings_tab(settings_tab);
    }
    if (section === "bots") {
        settings_panel_menu.org_settings.set_bot_settings_tab(settings_tab);
    }
    settings_toggle.goto("organization");
}
```

--------------------------------------------------------------------------------

---[FILE: alert_popup.ts]---
Location: zulip-main/web/src/alert_popup.ts

```typescript
import $ from "jquery";

// this will hide the alerts that you click "x" on.
$("body").on("click", ".alert-box .exit", function () {
    const $stack_trace = $(this).closest(".stacktrace");
    $stack_trace.addClass("fade-out");
    setTimeout(() => {
        $stack_trace.removeClass("fade-out show");
    }, 300);
});
```

--------------------------------------------------------------------------------

---[FILE: alert_words.ts]---
Location: zulip-main/web/src/alert_words.ts

```typescript
import _ from "lodash";

import type {Message} from "./message_store.ts";
import * as message_store from "./message_store.ts";
import * as people from "./people.ts";
import type {StateData} from "./state_data.ts";

// For simplicity, we use a list for our internal
// data, since that matches what the server sends us.
let my_alert_words: string[] = [];

export function set_words(words: string[]): void {
    // This module's highlighting algorithm of greedily created
    // highlight spans cannot correctly handle overlapping alert word
    // clauses, but processing in order from longest-to-shortest
    // reduces some symptoms of this. See #28415 for details.
    my_alert_words = words;
    my_alert_words.sort((a, b) => b.length - a.length);
}

export function get_word_list(): {word: string}[] {
    // Returns a array of objects
    // (with each alert_word as value and 'word' as key to the object.)
    const words = [];
    for (const word of my_alert_words) {
        words.push({word});
    }
    return words;
}

export function has_alert_word(word: string): boolean {
    return my_alert_words.includes(word);
}

const alert_regex_replacements = new Map<string, string>([
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    // Accept quotes with or without HTML escaping
    ['"', '(?:"|&quot;)'],
    ["'", "(?:'|&#39;)"],
]);

export function process_message(message: Message): void {
    // Parsing for alert words is expensive, so we rely on the host
    // to tell us there any alert words to even look for.
    if (!message.alerted) {
        return;
    }

    for (const word of my_alert_words) {
        const clean = _.escapeRegExp(word).replaceAll(
            /["&'<>]/g,
            (c) => alert_regex_replacements.get(c)!,
        );
        const before_punctuation = "\\s|^|>|[\\(\\\".,';\\[]";
        const after_punctuation = "(?=\\s)|$|<|[\\)\\\"\\?!:.,';\\]!]";

        const regex = new RegExp(`(${before_punctuation})(${clean})(${after_punctuation})`, "ig");
        const updated_content = message.content.replace(
            regex,
            (
                match: string,
                before: string,
                word: string,
                after: string,
                offset: number,
                content: string,
            ) => {
                // Logic for ensuring that we don't muck up rendered HTML.
                const pre_match = content.slice(0, offset);
                // We want to find the position of the `<` and `>` only in the
                // match and the string before it. So, don't include the last
                // character of match in `check_string`. This covers the corner
                // case when there is an alert word just before `<` or `>`.
                const check_string = pre_match + match.slice(0, -1);
                const in_tag = check_string.lastIndexOf("<") > check_string.lastIndexOf(">");
                // Matched word is inside an HTML tag so don't perform any highlighting.
                if (in_tag) {
                    return before + word + after;
                }
                return before + "<span class='alert-word'>" + word + "</span>" + after;
            },
        );
        message_store.update_message_content(message, updated_content);
    }
}

export function notifies(message: Message): boolean {
    // We exclude ourselves from notifications when we type one of our own
    // alert words into a message, just because that can be annoying for
    // certain types of workflows where everybody on your team, including
    // yourself, sets up an alert word to effectively mention the team.
    return !people.is_my_user_id(message.sender_id) && message.alerted;
}

export const initialize = (params: StateData["alert_words"]): void => {
    set_words(params.alert_words);
};
```

--------------------------------------------------------------------------------

---[FILE: alert_words_ui.ts]---
Location: zulip-main/web/src/alert_words_ui.ts

```typescript
import Handlebars from "handlebars";
import $ from "jquery";

import render_add_alert_word from "../templates/settings/add_alert_word.hbs";
import render_alert_word_settings_item from "../templates/settings/alert_word_settings_item.hbs";

import * as alert_words from "./alert_words.ts";
import * as banners from "./banners.ts";
import type {Banner} from "./banners.ts";
import * as channel from "./channel.ts";
import * as dialog_widget from "./dialog_widget.ts";
import {$t, $t_html} from "./i18n.ts";
import * as ListWidget from "./list_widget.ts";
import * as ui_report from "./ui_report.ts";

export let loaded = false;

export let rerender_alert_words_ui = (): void => {
    if (!loaded) {
        return;
    }

    const words = alert_words.get_word_list();
    words.sort();
    const $word_list = $("#alert-words-table");

    ListWidget.create($word_list, words, {
        name: "alert-words-list",
        get_item: ListWidget.default_get_item,
        modifier_html(alert_word) {
            return render_alert_word_settings_item({alert_word});
        },
        $parent_container: $("#alert-word-settings"),
        $simplebar_container: $("#alert-word-settings .progressive-table-wrapper"),
        sort_fields: {
            ...ListWidget.generic_sort_functions("alphabetic", ["word"]),
        },
    });
};

export function rewire_rerender_alert_words_ui(value: typeof rerender_alert_words_ui): void {
    rerender_alert_words_ui = value;
}

const open_alert_word_status_banner = (alert_word: string, is_error: boolean): void => {
    const alert_word_status_banner: Banner = {
        intent: "danger",
        label: "",
        buttons: [],
        close_button: true,
        custom_classes: "alert-word-status-banner",
    };
    if (is_error) {
        alert_word_status_banner.label = new Handlebars.SafeString(
            $t_html(
                {defaultMessage: "Error removing alert word <b>{alert_word}</b>!"},
                {alert_word},
            ),
        );
        alert_word_status_banner.intent = "danger";
    } else {
        alert_word_status_banner.label = new Handlebars.SafeString(
            $t_html(
                {defaultMessage: "Alert word <b>{alert_word}</b> removed successfully!"},
                {alert_word},
            ),
        );
        alert_word_status_banner.intent = "success";
    }
    banners.open(alert_word_status_banner, $("#alert_word_status"));
};

function add_alert_word(): void {
    const alert_word = $<HTMLInputElement>("input#add-alert-word-name").val()!.trim();

    if (alert_words.has_alert_word(alert_word)) {
        ui_report.client_error(
            $t({defaultMessage: "Alert word already exists!"}),
            $("#dialog_error"),
        );
        dialog_widget.hide_dialog_spinner();
        return;
    }

    const words_to_be_added = [alert_word];

    const data = {alert_words: JSON.stringify(words_to_be_added)};
    dialog_widget.submit_api_request(channel.post, "/json/users/me/alert_words", data);
}

function remove_alert_word(alert_word: string): void {
    const words_to_be_removed = [alert_word];
    void channel.del({
        url: "/json/users/me/alert_words",
        data: {alert_words: JSON.stringify(words_to_be_removed)},
        success() {
            open_alert_word_status_banner(alert_word, false);
        },
        error() {
            open_alert_word_status_banner(alert_word, true);
        },
    });
}

export function show_add_alert_word_modal(): void {
    const html_body = render_add_alert_word();

    function add_alert_word_post_render(): void {
        const $add_user_group_input_element = $<HTMLInputElement>("input#add-alert-word-name");
        const $add_user_group_submit_button = $("#add-alert-word .dialog_submit_button");
        $add_user_group_submit_button.prop("disabled", true);

        $add_user_group_input_element.on("input", () => {
            $add_user_group_submit_button.prop(
                "disabled",
                $add_user_group_input_element.val()!.trim() === "",
            );
        });
    }

    dialog_widget.launch({
        html_heading: $t_html({defaultMessage: "Add a new alert word"}),
        html_body,
        html_submit_button: $t_html({defaultMessage: "Add"}),
        help_link: "/help/dm-mention-alert-notifications#alert-words",
        form_id: "add-alert-word-form",
        id: "add-alert-word",
        loading_spinner: true,
        on_click: add_alert_word,
        on_shown: () => $("#add-alert-word-name").trigger("focus"),
        post_render: add_alert_word_post_render,
    });
}

export function set_up_alert_words(): void {
    // The settings page must be rendered before this function gets called.
    loaded = true;
    rerender_alert_words_ui();

    $("#open-add-alert-word-modal").on("click", () => {
        show_add_alert_word_modal();
    });

    $("#alert-words-table").on("click", ".remove-alert-word", (event) => {
        const word = $(event.currentTarget).parents("tr").find(".value").text().trim();
        remove_alert_word(word);
    });
}

export function reset(): void {
    loaded = false;
}
```

--------------------------------------------------------------------------------

---[FILE: all_messages_data.ts]---
Location: zulip-main/web/src/all_messages_data.ts

```typescript
import {Filter} from "./filter.ts";
import {MessageListData} from "./message_list_data.ts";

export let all_messages_data = new MessageListData({
    excludes_muted_topics: false,
    excludes_muted_users: false,
    filter: new Filter([]),
});

export function rewire_all_messages_data(value: typeof all_messages_data): void {
    all_messages_data = value;
}
```

--------------------------------------------------------------------------------

````
