---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 654
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 654 of 1290)

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

---[FILE: popover_menus_data.ts]---
Location: zulip-main/web/src/popover_menus_data.ts

```typescript
/* This module provides relevant data to render popovers that require multiple args.
   This helps keep the popovers code small and keep it focused on rendering side of things. */

import assert from "minimalistic-assert";

import * as buddy_data from "./buddy_data.ts";
import * as gear_menu_util from "./gear_menu_util.ts";
import * as hash_util from "./hash_util.ts";
import {$t} from "./i18n.ts";
import * as message_delete from "./message_delete.ts";
import * as message_edit from "./message_edit.ts";
import * as message_lists from "./message_lists.ts";
import * as narrow_state from "./narrow_state.ts";
import {page_params} from "./page_params.ts";
import * as people from "./people.ts";
import * as resolved_topic from "./resolved_topic.ts";
import * as settings_config from "./settings_config.ts";
import type {ColorSchemeValues} from "./settings_config.ts";
import * as settings_data from "./settings_data.ts";
import * as starred_messages from "./starred_messages.ts";
import {current_user, realm, realm_billing} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import * as sub_store from "./sub_store.ts";
import {num_unread_for_topic} from "./unread.ts";
import {user_settings} from "./user_settings.ts";
import * as user_status from "./user_status.ts";
import type {UserStatusEmojiInfo} from "./user_status.ts";
import * as user_topics from "./user_topics.ts";
import type {AllVisibilityPolicies} from "./user_topics.ts";
import * as util from "./util.ts";

type ActionPopoverContext = {
    message_id: number;
    stream_id: number | undefined;
    editability_menu_item: string | undefined;
    move_message_menu_item: string | undefined;
    view_source_menu_item: string | undefined;
    should_display_mark_as_unread: boolean;
    should_display_remind_me_option: boolean;
    should_display_collapse: boolean;
    should_display_uncollapse: boolean;
    should_display_quote_message: boolean;
    conversation_time_url: string;
    should_display_delete_option: boolean;
    should_display_read_receipts_option: boolean;
    should_display_add_reaction_option: boolean;
    should_display_message_report_option: boolean;
};

type TopicPopoverContext = {
    stream_name: string;
    stream_id: number;
    stream_muted: boolean;
    stream_archived: boolean;
    topic_display_name: string;
    is_empty_string_topic: boolean;
    topic_unmuted: boolean;
    is_spectator: boolean;
    is_topic_empty: boolean;
    can_move_topic: boolean;
    can_rename_topic: boolean;
    can_resolve_topic: boolean;
    is_realm_admin: boolean;
    topic_is_resolved: boolean;
    has_starred_messages: boolean;
    has_unread_messages: boolean;
    url: string;
    visibility_policy: number | false;
    all_visibility_policies: AllVisibilityPolicies;
    can_summarize_topics: boolean;
    show_ai_features: boolean;
};

type VisibilityChangePopoverContext = {
    stream_id: number;
    topic_name: string;
    visibility_policy: number | false;
    stream_muted: boolean;
    topic_unmuted: boolean;
    all_visibility_policies: AllVisibilityPolicies;
};

type PersonalMenuContext = {
    user_id: number;
    invisible_mode: boolean;
    user_is_guest: boolean;
    spectator_view: boolean;
    user_avatar?: string | undefined | null;
    is_active: boolean;
    user_circle_class: string;
    user_last_seen_time_status: string;
    user_full_name: string;
    user_type: string | undefined;
    status_content_available: boolean;
    show_placeholder_for_status_text: boolean;
    status_text: string | undefined;
    status_emoji_info: UserStatusEmojiInfo | undefined;
    user_color_scheme: number;
    color_scheme_values: ColorSchemeValues;
    web_font_size_px: number;
    web_line_height_percent: number;
};

type GearMenuContext = {
    realm_name: string;
    realm_url: string;
    is_owner: boolean;
    is_admin: boolean;
    is_spectator: boolean;
    is_self_hosted: boolean;
    is_development_environment: boolean;
    is_demo_organization: boolean;
    is_plan_limited: boolean;
    is_plan_standard: boolean;
    is_plan_standard_sponsored_for_free: boolean;
    is_plan_plus: boolean;
    is_org_on_paid_plan: boolean;
    is_business_org: boolean;
    is_education_org: boolean;
    standard_plan_name: string;
    server_needs_upgrade: boolean;
    version_display_string: string;
    apps_page_url: string;
    can_create_multiuse_invite: boolean;
    can_invite_users_by_email: boolean;
    is_guest: boolean;
    login_link: string;
    promote_sponsoring_zulip: boolean;
    show_billing: boolean;
    show_remote_billing: boolean;
    show_plans: boolean;
    sponsorship_pending: boolean;
    user_has_billing_access: boolean;
    user_color_scheme: number;
    color_scheme_values: ColorSchemeValues;
    web_font_size_px: number;
    web_line_height_percent: number;
};

type BillingInfo = {
    show_billing: boolean;
    show_remote_billing: boolean;
    show_plans: boolean;
};

export function get_actions_popover_content_context(message_id: number): ActionPopoverContext {
    assert(message_lists.current !== undefined);
    const message = message_lists.current.get(message_id);
    assert(message !== undefined);
    const not_spectator = !page_params.is_spectator;
    const is_content_editable = message_edit.is_content_editable(message);
    const can_move_message = message_edit.can_move_message(message);

    let editability_menu_item;
    let move_message_menu_item;
    let view_source_menu_item;

    if (is_content_editable) {
        editability_menu_item = $t({defaultMessage: "Edit message"});
    } else {
        view_source_menu_item = $t({defaultMessage: "View original message"});
    }

    if (can_move_message) {
        move_message_menu_item = $t({defaultMessage: "Move messages"});
    }

    // We do not offer "Mark as unread" on messages in streams
    // that the user is not currently subscribed to. Zulip has an
    // invariant that all unread messages must be in streams the
    // user is subscribed to, and so the server will ignore any
    // messages in such streams; it's better to hint this is not
    // useful by not offering the option.
    //
    // We also require that the message is currently marked as
    // read. Theoretically, it could be useful to offer this even
    // for a message that is already unread, so you can mark those
    // below it as unread; but that's an unlikely situation, and
    // showing it can be a confusing source of clutter. We may
    // want to revise this algorithm specifically in the context
    // of interleaved views.
    //
    // To work around #22893, we also only offer the option if the
    // fetch_status data structure means we'll be able to mark
    // everything below the current message as read correctly.
    const not_stream_message = message.type !== "stream";
    const subscribed_to_stream =
        message.type === "stream" && stream_data.is_subscribed(message.stream_id);
    const should_display_mark_as_unread =
        !message.unread && not_spectator && (not_stream_message || subscribed_to_stream);

    let stream_id;
    if (!not_stream_message) {
        stream_id = message.stream_id;
    }

    // Disabling this for /me messages is a temporary workaround
    // for the fact that we don't have a styling for how that
    // should look.  See also condense.js.
    const should_display_collapse =
        !message.locally_echoed && !message.is_me_message && !message.collapsed && not_spectator;
    const should_display_uncollapse =
        !message.locally_echoed && !message.is_me_message && message.collapsed;

    const should_display_quote_message = not_spectator;

    const conversation_time_url = hash_util.by_conversation_and_time_url(message);

    const should_display_delete_option = message_delete.get_deletability(message);
    const should_display_read_receipts_option = realm.realm_enable_read_receipts && not_spectator;
    const should_display_remind_me_option = not_spectator;

    const should_display_message_report_option = (): boolean => {
        if (page_params.is_spectator) {
            return false;
        }
        if (realm.realm_moderation_request_channel_id === -1) {
            return false;
        }

        // You can report any message you can access
        return true;
    };

    function is_add_reaction_icon_visible(): boolean {
        assert(message_lists.current !== undefined);
        const $message_row = message_lists.current.get_row(message_id);
        const $reaction_button = $message_row.find(".message_controls .reaction_button");
        return $reaction_button.length === 1 && $reaction_button.css("display") !== "none";
    }

    // Since we only display msg actions and star icons on windows smaller than
    // `media_breakpoints.sm_min`, we need to include the reaction button in the
    // popover if it is not displayed.
    const should_display_add_reaction_option =
        !message.is_me_message &&
        !is_add_reaction_icon_visible() &&
        not_spectator &&
        !(stream_id && stream_data.is_stream_archived_by_id(stream_id));

    return {
        message_id: message.id,
        stream_id,
        editability_menu_item,
        move_message_menu_item,
        should_display_mark_as_unread,
        should_display_remind_me_option,
        view_source_menu_item,
        should_display_collapse,
        should_display_uncollapse,
        should_display_add_reaction_option,
        conversation_time_url,
        should_display_delete_option,
        should_display_read_receipts_option,
        should_display_quote_message,
        should_display_message_report_option: should_display_message_report_option(),
    };
}

export function get_topic_popover_content_context({
    stream_id,
    topic_name,
    url,
}: {
    stream_id: number;
    topic_name: string;
    url: string;
}): TopicPopoverContext {
    const sub = sub_store.get(stream_id);
    assert(sub !== undefined);
    const topic_unmuted = user_topics.is_topic_unmuted(sub.stream_id, topic_name);
    const has_starred_messages = starred_messages.get_count_in_topic(sub.stream_id, topic_name) > 0;
    const has_unread_messages = num_unread_for_topic(sub.stream_id, topic_name) > 0;
    const can_move_topic = stream_data.user_can_move_messages_out_of_channel(sub);
    const can_rename_topic =
        stream_data.user_can_move_messages_within_channel(sub) &&
        !stream_data.is_empty_topic_only_channel(sub.stream_id);
    const can_resolve_topic = !sub.is_archived && stream_data.can_resolve_topics(sub);

    const visibility_policy = user_topics.get_topic_visibility_policy(sub.stream_id, topic_name);
    const all_visibility_policies = user_topics.all_visibility_policies;
    const is_spectator = page_params.is_spectator;
    const is_topic_empty = is_topic_definitely_empty(stream_id, topic_name);
    return {
        stream_name: sub.name,
        stream_id: sub.stream_id,
        stream_muted: sub.is_muted,
        stream_archived: sub.is_archived,
        topic_display_name: util.get_final_topic_display_name(topic_name),
        is_empty_string_topic: topic_name === "",
        topic_unmuted,
        is_spectator,
        is_topic_empty,
        can_move_topic,
        can_rename_topic,
        can_resolve_topic,
        is_realm_admin: current_user.is_admin,
        topic_is_resolved: resolved_topic.is_resolved(topic_name),
        has_starred_messages,
        has_unread_messages,
        url,
        visibility_policy,
        all_visibility_policies,
        can_summarize_topics: settings_data.user_can_summarize_topics(),
        show_ai_features: !user_settings.hide_ai_features,
    };
}

export function get_change_visibility_policy_popover_content_context(
    stream_id: number,
    topic_name: string,
): VisibilityChangePopoverContext {
    const visibility_policy = user_topics.get_topic_visibility_policy(stream_id, topic_name);
    const sub = sub_store.get(stream_id);
    assert(sub !== undefined);
    const all_visibility_policies = user_topics.all_visibility_policies;
    const topic_unmuted = visibility_policy === all_visibility_policies.UNMUTED;
    return {
        stream_id,
        topic_name,
        visibility_policy,
        stream_muted: sub.is_muted,
        topic_unmuted,
        all_visibility_policies,
    };
}

export function get_personal_menu_content_context(): PersonalMenuContext {
    const my_user_id = current_user.user_id;
    const invisible_mode = !user_settings.presence_enabled;
    const status_text = user_status.get_status_text(my_user_id);
    const status_emoji_info = user_status.get_status_emoji(my_user_id);
    return {
        user_id: my_user_id,
        invisible_mode,
        user_is_guest: current_user.is_guest,
        spectator_view: page_params.is_spectator,

        // user information
        user_avatar: current_user.avatar_url_medium,
        is_active: people.is_active_user_for_popover(my_user_id),
        user_circle_class: buddy_data.get_user_circle_class(my_user_id),
        user_last_seen_time_status: buddy_data.user_last_seen_time_status(my_user_id),
        user_full_name: current_user.full_name,
        user_type: people.get_user_type(my_user_id),

        // user status
        status_content_available: Boolean(status_text ?? status_emoji_info),
        show_placeholder_for_status_text: !status_text && status_emoji_info !== undefined,
        status_text,
        status_emoji_info,

        // user color scheme
        user_color_scheme: user_settings.color_scheme,
        color_scheme_values: settings_config.color_scheme_values,

        // info density values
        web_font_size_px: user_settings.web_font_size_px,
        web_line_height_percent: user_settings.web_line_height_percent,
    };
}

function get_billing_info(): BillingInfo {
    const billing_info = {
        show_remote_billing: false,
        show_billing: false,
        show_plans: false,
    };
    if (!settings_data.user_has_billing_access()) {
        return billing_info;
    }

    const is_plan_standard =
        realm.realm_plan_type === settings_config.realm_plan_types.standard.code;
    const is_plan_plus = realm.realm_plan_type === settings_config.realm_plan_types.plus.code;
    const is_org_on_paid_plan = is_plan_standard || is_plan_plus;

    billing_info.show_remote_billing = !page_params.corporate_enabled;
    billing_info.show_plans = !realm.zulip_plan_is_not_limited;
    billing_info.show_billing = is_org_on_paid_plan;

    return billing_info;
}

export function get_gear_menu_content_context(): GearMenuContext {
    const user_has_billing_access = settings_data.user_has_billing_access();
    const is_plan_standard =
        realm.realm_plan_type === settings_config.realm_plan_types.standard.code;
    const is_plan_plus = realm.realm_plan_type === settings_config.realm_plan_types.plus.code;
    const is_org_on_paid_plan = is_plan_standard || is_plan_plus;
    const billing_info = get_billing_info();
    return {
        realm_name: realm.realm_name,
        realm_url: new URL(realm.realm_url).hostname,
        is_owner: current_user.is_owner,
        is_admin: current_user.is_admin,
        is_spectator: page_params.is_spectator,
        is_self_hosted: realm.realm_plan_type === settings_config.realm_plan_types.self_hosted.code,
        is_development_environment: page_params.development_environment,
        is_demo_organization: realm.demo_organization_scheduled_deletion_date !== undefined,
        is_plan_limited: realm.realm_plan_type === settings_config.realm_plan_types.limited.code,
        is_plan_standard,
        is_plan_standard_sponsored_for_free:
            realm.realm_plan_type === settings_config.realm_plan_types.standard_free.code,
        is_plan_plus,
        is_org_on_paid_plan,
        is_business_org: realm.realm_org_type === settings_config.all_org_type_values.business.code,
        is_education_org:
            realm.realm_org_type === settings_config.all_org_type_values.education_nonprofit.code ||
            realm.realm_org_type === settings_config.all_org_type_values.education.code,
        standard_plan_name: "Zulip Cloud Standard",
        server_needs_upgrade: realm.server_needs_upgrade,
        version_display_string: gear_menu_util.version_display_string(),
        apps_page_url: page_params.apps_page_url,
        can_create_multiuse_invite: settings_data.user_can_create_multiuse_invite(),
        can_invite_users_by_email: settings_data.user_can_invite_users_by_email(),
        is_guest: current_user.is_guest,
        login_link: page_params.development_environment ? "/devlogin/" : "/login/",
        promote_sponsoring_zulip: page_params.promote_sponsoring_zulip,
        show_billing: billing_info.show_billing,
        show_remote_billing: billing_info.show_remote_billing,
        show_plans: billing_info.show_plans,
        sponsorship_pending: realm_billing.has_pending_sponsorship_request,
        user_has_billing_access,
        // user color scheme
        user_color_scheme: user_settings.color_scheme,
        color_scheme_values: settings_config.color_scheme_values,
        // information density settings
        web_font_size_px: user_settings.web_font_size_px,
        web_line_height_percent: user_settings.web_line_height_percent,
    };
}

function is_topic_definitely_empty(stream_id: number, topic: string): boolean {
    const current_narrow_stream_id = narrow_state.stream_id();
    const current_narrow_topic = narrow_state.topic();

    if (
        current_narrow_stream_id === undefined ||
        current_narrow_topic === undefined ||
        current_narrow_stream_id !== stream_id ||
        current_narrow_topic !== topic
    ) {
        return false;
    }

    const is_current_message_list_empty = message_lists.current?.data.empty();
    if (!is_current_message_list_empty) {
        return false;
    }

    const is_oldest_message_found = message_lists.current?.data.fetch_status.has_found_oldest();
    if (!is_oldest_message_found) {
        return false;
    }

    return true;
}
```

--------------------------------------------------------------------------------

---[FILE: popup_banners.ts]---
Location: zulip-main/web/src/popup_banners.ts

```typescript
import $ from "jquery";

import * as banners from "./banners.ts";
import type {Banner} from "./banners.ts";
import * as buttons from "./buttons.ts";
import {$t} from "./i18n.ts";

export type ReloadingReason = "reload" | "update";

let retry_connection_interval: ReturnType<typeof setInterval> | undefined;
let original_retry_delay_secs = 0;

function fade_out_popup_banner($banner: JQuery): void {
    $banner.addClass("fade-out");
    // The delay is the same as the animation duration for fade-out.
    setTimeout(() => {
        banners.close($banner);
    }, 300);
}

const get_connection_error_label = (retry_delay_secs: number): string => {
    if (original_retry_delay_secs < 5) {
        // When the retry delay is less than 5 seconds, we don't show the retry
        // delay time in the banner, and instead just show "Trying to reconnect soon…"
        // to avoid constant flickering of the banner label for very short times.
        return $t({defaultMessage: "Unable to connect to Zulip. Trying to reconnect soon…"});
    }
    return $t(
        {
            defaultMessage:
                "Unable to connect to Zulip. {retry_delay_secs, plural, one {Trying to reconnect in {retry_delay_secs} second…} other {Trying to reconnect in {retry_delay_secs} seconds…}}",
        },
        {retry_delay_secs},
    );
};

const connection_error_popup_banner = (retry_seconds: number): Banner => ({
    intent: "danger",
    label: get_connection_error_label(retry_seconds),
    buttons: [
        {
            attention: "quiet",
            label: $t({defaultMessage: "Try now"}),
            custom_classes: "retry-connection",
        },
    ],
    close_button: true,
    custom_classes: "connection-error-banner popup-banner",
});

const update_connection_error_banner = ($banner: JQuery, retry_delay_secs: number): void => {
    original_retry_delay_secs = retry_delay_secs;
    if (retry_connection_interval !== undefined) {
        clearInterval(retry_connection_interval);
    }
    const $banner_label = $banner.find(".banner-label");
    retry_connection_interval = setInterval(() => {
        retry_delay_secs -= 1;
        if (retry_delay_secs <= 0) {
            // When the retry delay is over, stop the retry interval.
            clearInterval(retry_connection_interval);
            return;
        }
        if (retry_delay_secs <= 1) {
            // One second before the retry, show the loading indicator to
            // visually indicate that the retry sequence is being executed.
            const $retry_connection_button = $banner.find(".retry-connection");
            buttons.show_button_loading_indicator($retry_connection_button);
        }
        $banner_label.text(get_connection_error_label(retry_delay_secs));
    }, 1000);
};

// Show user a banner with a button to allow user to navigate
// to the first unread if required.
const FOUND_MISSING_UNREADS_IN_CURRENT_NARROW: Banner = {
    intent: "warning",
    label: $t({
        defaultMessage:
            "This conversation also has older unread messages. Jump to first unread message?",
    }),
    buttons: [
        {
            attention: "quiet",
            label: $t({defaultMessage: "Jump"}),
            custom_classes: "found-missing-unreads-jump-to-first-unread",
        },
    ],
    close_button: true,
    custom_classes: "found-missing-unreads popup-banner",
};

const reloading_application_banner = (reason: ReloadingReason): Banner => {
    let label = $t({defaultMessage: "Reloading…"});
    if (reason === "update") {
        label = $t({
            defaultMessage: "The application has been updated; Reloading…",
        });
    }
    return {
        intent: "info",
        label,
        buttons: [],
        close_button: false,
        custom_classes: "reloading-application popup-banner",
    };
};

export function open_found_missing_unreads_banner(on_jump_to_first_unread: () => void): void {
    banners.append(FOUND_MISSING_UNREADS_IN_CURRENT_NARROW, $("#popup_banners_wrapper"));

    $("#popup_banners_wrapper").on(
        "click",
        ".found-missing-unreads-jump-to-first-unread",
        function (this: HTMLElement, e) {
            e.preventDefault();
            e.stopPropagation();

            const $banner = $(this).closest(".banner");
            fade_out_popup_banner($banner);
            on_jump_to_first_unread();
        },
    );
}

export function close_found_missing_unreads_banner(): void {
    const $banner = $("#popup_banners_wrapper").find(".found-missing-unreads");
    if ($banner.length === 0) {
        return;
    }

    fade_out_popup_banner($banner);
}

function retry_connection_click_handler(e: JQuery.ClickEvent, on_retry_callback: () => void): void {
    e.preventDefault();
    e.stopPropagation();

    const $banner = $(e.currentTarget).closest(".banner");
    $banner
        .find(".banner-label")
        .text($t({defaultMessage: "Unable to connect to Zulip. Trying to reconnect soon…"}));

    const $button = $(e.currentTarget).closest(".retry-connection");

    // If the loading indicator is already being shown, this logic
    // allows us to visually indicate that the retry sequence was
    // executed again by showing the loading indicator on click.
    $button.removeClass("button-hide-loading-indicator-on-hover");
    $button.one("mouseleave", () => {
        $button.addClass("button-hide-loading-indicator-on-hover");
    });

    buttons.show_button_loading_indicator($button);
    on_retry_callback();
}

export function open_connection_error_popup_banner(opts: {
    caller: "server_events" | "message_fetch";
    retry_delay_secs: number;
    on_retry_callback: () => void;
}): void {
    opts.retry_delay_secs = Math.round(opts.retry_delay_secs);
    const retry_connection_attached_click_handler = (e: JQuery.ClickEvent): void => {
        retry_connection_click_handler(e, opts.on_retry_callback);
    };
    // If the banner is already open, don't open it again, and instead remove
    // the loading indicator on the retry button, if it was being shown.
    let $banner = $("#popup_banners_wrapper").find(".connection-error-banner");
    if ($banner.length > 0) {
        if ($banner.attr("data-caller") !== opts.caller) {
            // Only the original caller should be able to modify the banner.
            // This prevents the interference between the server errors from
            // get_events in web/src/server_events.js and the one from
            // load_messages in web/src/message_fetch.ts.
            return;
        }
        update_connection_error_banner($banner, opts.retry_delay_secs);
        const $retry_connection_button = $banner.find(".retry-connection");
        if ($retry_connection_button.find(".button-loading-indicator").length > 0) {
            // Add some delay before hiding the loading indicator, to visually
            // indicate that the retry sequence was executed again but failed.
            setTimeout(() => {
                buttons.hide_button_loading_indicator($retry_connection_button);
            }, 1000);
        }
        // Update the click handler to the new on_retry_callback.
        // Remove any click events on the button.
        $retry_connection_button.off("click");
        $retry_connection_button.on("click", retry_connection_attached_click_handler);
        return;
    }

    banners.append(
        connection_error_popup_banner(opts.retry_delay_secs),
        $("#popup_banners_wrapper"),
    );

    $banner = $("#popup_banners_wrapper").find(".connection-error-banner");
    if (opts.caller === "server_events") {
        $banner.attr("data-caller", "server_events");
    } else if (opts.caller === "message_fetch") {
        $banner.attr("data-caller", "message_fetch");
    }

    update_connection_error_banner($banner, opts.retry_delay_secs);

    $("#popup_banners_wrapper").on(
        "click",
        ".retry-connection",
        retry_connection_attached_click_handler,
    );
}

export function close_connection_error_popup_banner(
    caller: "server_events" | "message_fetch",
): void {
    const $banner = $("#popup_banners_wrapper").find(".connection-error-banner");
    if ($banner.length === 0) {
        return;
    }
    if ($banner.attr("data-caller") !== caller) {
        // Only the original caller should be able to modify the banner.
        return;
    }
    if (retry_connection_interval !== undefined) {
        clearInterval(retry_connection_interval);
    }
    fade_out_popup_banner($banner);
}

export function open_reloading_application_banner(reason: ReloadingReason): void {
    const $banner = $("#popup_banners_wrapper").find(".reloading-application");
    if ($banner.length > 0) {
        // If the banner is already open, don't open it again.
        return;
    }
    banners.append(reloading_application_banner(reason), $("#popup_banners_wrapper"));
}

export function initialize(): void {
    $("#popup_banners_wrapper").on(
        "click",
        ".banner-close-action",
        function (this: HTMLElement, e) {
            // Override the banner close event listener in web/src/banners.ts,
            // to add a fade-out animation when the banner is closed.
            e.preventDefault();
            e.stopPropagation();
            const $banner = $(this).closest(".banner");
            fade_out_popup_banner($banner);
        },
    );
}
```

--------------------------------------------------------------------------------

````
