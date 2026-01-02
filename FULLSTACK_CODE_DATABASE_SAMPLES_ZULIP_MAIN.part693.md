---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 693
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 693 of 1290)

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

---[FILE: stream_ui_updates.ts]---
Location: zulip-main/web/src/stream_ui_updates.ts

```typescript
import $ from "jquery";
import type * as tippy from "tippy.js";

import render_announce_stream_checkbox from "../templates/stream_settings/announce_stream_checkbox.hbs";
import render_stream_can_subscribe_group_label from "../templates/stream_settings/stream_can_subscribe_group_label.hbs";
import render_stream_privacy_icon from "../templates/stream_settings/stream_privacy_icon.hbs";
import render_stream_settings_tip from "../templates/stream_settings/stream_settings_tip.hbs";

import * as channel_folders from "./channel_folders.ts";
import * as hash_parser from "./hash_parser.ts";
import {$t} from "./i18n.ts";
import * as overlays from "./overlays.ts";
import * as settings_banner from "./settings_banner.ts";
import * as settings_components from "./settings_components.ts";
import * as settings_config from "./settings_config.ts";
import * as settings_data from "./settings_data.ts";
import * as settings_org from "./settings_org.ts";
import {current_user, realm} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import * as stream_edit_toggler from "./stream_edit_toggler.ts";
import * as stream_settings_components from "./stream_settings_components.ts";
import * as stream_settings_containers from "./stream_settings_containers.ts";
import type {SettingsSubscription} from "./stream_settings_data.ts";
import * as sub_store from "./sub_store.ts";
import type {StreamSubscription} from "./sub_store.ts";
import * as user_groups from "./user_groups.ts";
import * as util from "./util.ts";

export function row_for_stream_id(stream_id: number): JQuery {
    return $(`.stream-row[data-stream-id='${CSS.escape(stream_id.toString())}']`);
}

function settings_button_for_sub(sub: StreamSubscription): JQuery {
    // We don't do expectOne() here, because this button is only
    // visible if the user has that stream selected in the streams UI.
    return $(
        `.stream_settings_header[data-stream-id='${CSS.escape(sub.stream_id.toString())}'] .subscribe-button`,
    );
}

export let show_subscribed = true;
export let show_available = false;

export function is_subscribed_stream_tab_active(): boolean {
    // Returns true if "Subscribed" tab in stream settings is open
    // otherwise false.
    return show_subscribed;
}

export function is_available_stream_tab_active(): boolean {
    // Returns true if "available" tab in stream settings is open
    // otherwise false.
    return show_available;
}

export function set_show_subscribed(value: boolean): void {
    show_subscribed = value;
}

export function set_show_available(value: boolean): void {
    show_available = value;
}

export function update_history_public_to_subscribers_state(
    $container: JQuery,
    sub?: StreamSubscription,
): void {
    const is_stream_creation = $container.attr("id") === "stream-creation";
    if (!is_stream_creation && sub !== undefined && !hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    let stream_privacy_widget;
    let can_create_topic_group_widget;
    if (is_stream_creation) {
        stream_privacy_widget = stream_settings_components.channel_creation_privacy_widget!;
        can_create_topic_group_widget =
            stream_settings_components.get_group_setting_widget_for_new_stream(
                "can_create_topic_group",
            )!;
    } else {
        stream_privacy_widget =
            settings_components.get_widget_for_dropdown_list_settings("channel_privacy")!;
        can_create_topic_group_widget =
            settings_components.get_group_setting_widget("can_create_topic_group")!;
    }

    const is_invite_only = stream_privacy_widget.value() === "invite-only";

    const everyone_group = user_groups.get_user_group_from_name("role:everyone")!;
    const everyone_can_create_topics =
        settings_components.get_group_setting_widget_value(can_create_topic_group_widget) ===
        everyone_group.id;

    const $history_public_to_subscribers_container = $container.find(
        ".history-public-to-subscribers",
    );
    $history_public_to_subscribers_container
        .find("input")
        .prop("disabled", !is_invite_only || !everyone_can_create_topics);
    $history_public_to_subscribers_container.toggleClass(
        "control-label-disabled",
        !is_invite_only || !everyone_can_create_topics,
    );

    // Tooltip is shown only if the checkbox is disabled due to topic creation permission
    // and not when it is disabled because channel privacy is not set to private.
    $history_public_to_subscribers_container.toggleClass(
        "protected_history_with_new_topics_permission_tooltip",
        is_invite_only && !everyone_can_create_topics,
    );

    if (!is_invite_only) {
        // For public and web-public streams, history_public_to_subscribers should
        // always be true.
        $history_public_to_subscribers_container.find("input").prop("checked", true);
    }
}

export function update_history_public_to_subscribers_on_can_create_topic_group_change(
    sub: StreamSubscription,
): void {
    // This function is only used to enable/disable the history_public_to_subscribers
    // checkbox when can_create_topic_group setting element is changed for an existing
    // channel.
    // This is different from update_history_public_to_subscribers_state above because
    // the history_public_to_subscribers checkbox is enabled only if sub.can_create_topic_group
    // is set to everyone, i.e. we do not enable the checkbox immediately after the
    // can_create_topic_group setting element is set to everyone group for a channel
    // where everyone could not create new topics originally.

    const stream_privacy_widget =
        settings_components.get_widget_for_dropdown_list_settings("channel_privacy")!;
    if (stream_privacy_widget.value() !== "invite-only") {
        // If the history_public_to_subscribers checkbox is already disabled
        // due to stream not being private, we just return.
        return;
    }

    const can_create_topic_group_widget =
        settings_components.get_group_setting_widget("can_create_topic_group")!;
    const everyone_group = user_groups.get_user_group_from_name("role:everyone")!;
    const everyone_can_create_topics =
        settings_components.get_group_setting_widget_value(can_create_topic_group_widget) ===
        everyone_group.id;

    const $history_public_to_subscribers_container = $("#stream_settings").find(
        ".history-public-to-subscribers",
    );

    if (!everyone_can_create_topics) {
        $history_public_to_subscribers_container.find("input").prop("disabled", true);
        $history_public_to_subscribers_container.addClass("control-label-disabled");
        $history_public_to_subscribers_container.addClass(
            "protected_history_with_new_topics_permission_tooltip",
        );
        return;
    }

    if (sub.can_create_topic_group === everyone_group.id) {
        $history_public_to_subscribers_container.find("input").prop("disabled", false);
        $history_public_to_subscribers_container.removeClass("control-label-disabled");
        $history_public_to_subscribers_container.removeClass(
            "protected_history_with_new_topics_permission_tooltip",
        );
    }
}

export function initialize_cant_subscribe_popover(): void {
    const $button_wrapper = $(".settings .stream_settings_header .sub_unsub_button_wrapper");
    settings_components.initialize_disable_button_hint_popover($button_wrapper, undefined);
}

export function set_up_right_panel_section(sub: StreamSubscription): void {
    if (sub.subscribed && !sub.is_archived) {
        stream_edit_toggler.toggler.enable_tab("personal");
        stream_edit_toggler.toggler.goto(stream_edit_toggler.select_tab);
    } else {
        if (stream_edit_toggler.select_tab === "personal") {
            // Go to the general settings tab, if the user is not
            // subscribed. Also preserve the previous selected tab,
            // to render next time a stream row is selected.
            stream_edit_toggler.toggler.goto("general");
        } else {
            stream_edit_toggler.toggler.goto(stream_edit_toggler.select_tab);
        }
        stream_edit_toggler.toggler.disable_tab("personal");
    }
    enable_or_disable_subscribers_tab(sub);
}

export function update_toggler_for_sub(sub: StreamSubscription): void {
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    set_up_right_panel_section(sub);
}

export function enable_or_disable_subscribers_tab(sub: StreamSubscription): void {
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    if (!stream_data.can_view_subscribers(sub)) {
        stream_edit_toggler.toggler.disable_tab("subscribers");
        if (stream_edit_toggler.select_tab === "subscribers") {
            stream_edit_toggler.toggler.goto("general");
        }
        return;
    }

    stream_edit_toggler.toggler.enable_tab("subscribers");
}

export function update_settings_button_for_sub(sub: StreamSubscription): void {
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    // This is for the Subscribe/Unsubscribe button in the right panel.
    const $settings_button = settings_button_for_sub(sub);

    if ($settings_button.length === 0) {
        // `subscribe` button hasn't been rendered yet while we are processing the event.
        return;
    }

    if (sub.subscribed) {
        $settings_button
            .text($t({defaultMessage: "Unsubscribe"}))
            .removeClass("unsubscribed action-button-quiet-brand")
            .addClass("action-button-quiet-neutral");
    } else {
        $settings_button
            .text($t({defaultMessage: "Subscribe"}))
            .addClass("unsubscribed action-button-quiet-brand")
            .removeClass("action-button-quiet-neutral");
    }
    if (stream_data.can_toggle_subscription(sub)) {
        $settings_button.prop("disabled", false);
        const $parent_element: tippy.ReferenceElement & HTMLElement = util.the(
            $settings_button.parent(),
        );
        $parent_element._tippy?.destroy();
        $settings_button.css("pointer-events", "");
        $settings_button.addClass("toggle-subscription-tooltip");
    } else {
        $settings_button.attr("title", "");
        initialize_cant_subscribe_popover();
        $settings_button.prop("disabled", true);
        $settings_button.removeClass("toggle-subscription-tooltip");
    }
}

export function update_settings_button_for_archive_and_unarchive(sub: StreamSubscription): void {
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    // This is for the Archive/Unarchive button in the right panel.
    const $archive_button = $(
        `.stream_settings_header[data-stream-id='${CSS.escape(sub.stream_id.toString())}'] .deactivate`,
    );
    const $unarchive_button = $(
        `.stream_settings_header[data-stream-id='${CSS.escape(sub.stream_id.toString())}'] .reactivate`,
    );

    if (!stream_data.can_administer_channel(sub)) {
        $archive_button.hide();
        $unarchive_button.hide();
        return;
    }

    if (sub.is_archived) {
        $archive_button.hide();
        $unarchive_button.show();
    } else {
        $unarchive_button.hide();
        $archive_button.show();
    }
}

export function update_regular_sub_settings(sub: StreamSubscription): void {
    // These are in the right panel.
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }
    const $settings = $(
        `.subscription_settings[data-stream-id='${CSS.escape(sub.stream_id.toString())}']`,
    );
    if (stream_data.can_access_stream_email(sub)) {
        $settings.find(".stream-email-box").show();
    } else {
        $settings.find(".stream-email-box").hide();
    }
}

export function enable_or_disable_generate_email_button(sub: StreamSubscription): void {
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    const $settings = $(
        `.subscription_settings[data-stream-id='${CSS.escape(sub.stream_id.toString())}']`,
    );
    const $generate_email_button_container = $settings.find(
        ".generate-channel-email-button-container",
    );
    const $generate_email_button = $generate_email_button_container.find(".copy_email_button");

    if (stream_data.can_access_stream_email(sub)) {
        $generate_email_button.prop("disabled", false);
        $generate_email_button_container.removeClass("disabled_setting_tooltip");
    } else {
        $generate_email_button.prop("disabled", true);
        $generate_email_button_container.addClass("disabled_setting_tooltip");
    }
}

export function update_default_stream_option_state($container: JQuery): void {
    const $default_stream = $container.find(".default-stream");
    const is_stream_creation = $container.attr("id") === "stream-creation";

    // Only admins are allowed to change default status for a stream.
    // In the stream creation UI, if the user is a non-admin just hide
    // the "Default stream for new users" widget.
    if (!current_user.is_admin) {
        if (is_stream_creation) {
            $default_stream.hide();
        } else {
            $default_stream.find("input").prop("disabled", true);
            $default_stream.addClass("control-label-disabled");
        }
        return;
    }

    let stream_privacy_widget;
    if (is_stream_creation) {
        stream_privacy_widget = stream_settings_components.channel_creation_privacy_widget!;
    } else {
        stream_privacy_widget =
            settings_components.get_widget_for_dropdown_list_settings("channel_privacy")!;
    }

    const is_invite_only = stream_privacy_widget.value() === "invite-only";

    // If a private stream option is selected, the default stream option is disabled.
    $default_stream.find("input").prop("disabled", is_invite_only);
    $default_stream.toggleClass(
        "control-label-disabled default_stream_private_tooltip",
        is_invite_only,
    );
    if (is_invite_only) {
        // Private streams cannot be set as default streams so uncheck the checkbox.
        $default_stream.find("input").prop("checked", false);
    }
}

export function handle_channel_privacy_update($container: JQuery): void {
    update_can_subscribe_group_label($container);
    update_history_public_to_subscribers_state($container);
    update_default_stream_option_state($container);
}

export function update_can_subscribe_group_label($container: JQuery): void {
    const is_stream_creation = $container.attr("id") === "stream-creation";

    let stream_privacy_widget;
    if (is_stream_creation) {
        stream_privacy_widget = stream_settings_components.channel_creation_privacy_widget!;
    } else {
        stream_privacy_widget =
            settings_components.get_widget_for_dropdown_list_settings("channel_privacy")!;
    }
    const is_invite_only = stream_privacy_widget.value() === "invite-only";

    const $can_subscribe_group_label = $container.find(".can_subscribe_group_label");
    $can_subscribe_group_label.html(render_stream_can_subscribe_group_label({is_invite_only}));
}

export function enable_or_disable_permission_settings_in_edit_panel(
    sub: SettingsSubscription,
): void {
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    const $stream_settings = stream_settings_containers.get_edit_container(sub);

    const $permissions_container = $stream_settings.find($(".channel-permissions"));
    $permissions_container
        .find("input, select")
        .prop("disabled", !sub.can_change_stream_permissions_requiring_metadata_access);

    $("#channel_privacy_widget_container")
        .find("button")
        .prop("disabled", !sub.can_change_stream_permissions_requiring_metadata_access);

    const $permission_pill_container_elements = $permissions_container.find(".pill-container");

    $stream_settings
        .find(".channel-folder-widget-container button")
        .prop("disabled", !sub.can_change_stream_permissions_requiring_metadata_access);

    if (!sub.can_change_stream_permissions_requiring_metadata_access) {
        settings_components.disable_group_permission_setting($permission_pill_container_elements);
        return;
    }

    settings_components.enable_group_permission_setting($permission_pill_container_elements);

    update_default_stream_option_state($("#stream_settings"));
    update_history_public_to_subscribers_state($("#stream_settings"));
    update_can_create_topic_group_setting_state($("#stream_settings"));

    const disable_message_retention_setting =
        !realm.zulip_plan_is_not_limited || !current_user.is_owner;
    $stream_settings
        .find(".stream_message_retention_setting")
        .prop("disabled", disable_message_retention_setting);
    $stream_settings
        .find(".message-retention-setting-custom-input")
        .prop("disabled", disable_message_retention_setting);

    if (!sub.can_change_stream_permissions_requiring_content_access) {
        $("#channel_privacy_widget_container").find("button").prop("disabled", true);

        for (const setting_name of settings_config.stream_group_permission_settings_requiring_content_access) {
            const $setting_element = $permissions_container.find("#id_" + setting_name);
            settings_components.disable_group_permission_setting($setting_element);
        }
    }
    settings_banner.set_up_upgrade_banners();

    if (!stream_data.user_can_set_topics_policy(sub)) {
        $stream_settings.find("#id_topics_policy").prop("disabled", true);
    }

    if (!stream_data.user_can_set_delete_message_policy()) {
        settings_components.disable_group_permission_setting($("#id_can_delete_any_message_group"));
        settings_components.disable_group_permission_setting($("#id_can_delete_own_message_group"));
    }
}

export function update_announce_stream_option(): void {
    if (!hash_parser.is_create_new_stream_narrow()) {
        return;
    }
    if (stream_data.get_new_stream_announcements_stream() === "") {
        $("#announce-new-stream").hide();
        return;
    }
    $("#announce-new-stream").show();

    const new_stream_announcements_stream = stream_data.get_new_stream_announcements_stream();
    const new_stream_announcements_stream_sub = stream_data.get_sub_by_name(
        new_stream_announcements_stream,
    );
    const rendered_announce_stream = render_announce_stream_checkbox({
        new_stream_announcements_stream_sub,
    });
    $("#announce-new-stream").expectOne().html(rendered_announce_stream);
}

export function update_stream_privacy_icon_in_settings(sub: StreamSubscription): void {
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    const $stream_settings = stream_settings_containers.get_edit_container(sub);

    $stream_settings.find(".stream_section[data-stream-section='general'] .large-icon").replaceWith(
        $(
            render_stream_privacy_icon({
                invite_only: sub.invite_only,
                color: sub.color,
                is_web_public: sub.is_web_public,
                is_archived: sub.is_archived,
            }),
        ),
    );
}

export function update_permissions_banner(sub: StreamSubscription): void {
    const $settings = $(
        `.subscription_settings[data-stream-id='${CSS.escape(sub.stream_id.toString())}']`,
    );

    const rendered_tip = render_stream_settings_tip(sub);
    $settings.find(".stream-settings-tip-container").html(rendered_tip);
}

export function update_notification_setting_checkbox(
    notification_name: keyof sub_store.StreamSpecificNotificationSettings,
): void {
    // This is in the right panel (Personal settings).
    const $stream_row = $("#channels_overlay_container .stream-row.active");
    if ($stream_row.length === 0) {
        return;
    }
    const stream_id = Number($stream_row.attr("data-stream-id"));
    $(`#${CSS.escape(notification_name)}_${CSS.escape(stream_id.toString())}`).prop(
        "checked",
        stream_data.receives_notifications(stream_id, notification_name),
    );
}

export function update_stream_row_in_settings_tab(sub: StreamSubscription): void {
    // This is in the left panel.
    // This function is used to display immediate effect of add/removal subscription
    // event.
    // If user is subscribed or unsubscribed to stream, the stream row is kept in
    // the tab view if user can toggle the state again, otherwise the stream row
    // is removed.

    if (is_subscribed_stream_tab_active() || is_available_stream_tab_active()) {
        const $row = row_for_stream_id(sub.stream_id);

        if (
            (is_subscribed_stream_tab_active() && sub.subscribed) ||
            (is_available_stream_tab_active() &&
                !sub.subscribed &&
                stream_data.can_toggle_subscription(sub))
        ) {
            if (stream_settings_components.archived_status_filter_includes_channel(sub)) {
                $row.removeClass("notdisplayed");
            }
        } else if (current_user.is_guest || !stream_data.can_toggle_subscription(sub)) {
            $row.addClass("notdisplayed");
        }
    }
}

export function update_add_subscriptions_elements(sub: SettingsSubscription): void {
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    // We are only concerned with the Subscribers tab for editing streams.
    const $add_subscribers_container = $(".edit_subscribers_for_stream .subscriber_list_settings");

    if (current_user.is_guest) {
        // For guest users, we just hide the add_subscribers feature.
        $add_subscribers_container.hide();
        return;
    }

    // Otherwise, we adjust whether the widgets are disabled based on
    // whether this user is authorized to add subscribers.
    const allow_user_to_add_subs = sub.can_add_subscribers;

    enable_or_disable_add_subscribers_elements($add_subscribers_container, allow_user_to_add_subs);

    if (!allow_user_to_add_subs) {
        let tooltip_message;
        if (!settings_data.can_subscribe_others_to_all_accessible_streams()) {
            tooltip_message = $t({
                defaultMessage:
                    "You do not have permission to add other users to channels in this organization.",
            });
        } else {
            tooltip_message = $t({
                defaultMessage: "You do not have permission to add other users to this channel.",
            });
        }
        settings_components.initialize_disable_button_hint_popover(
            $add_subscribers_container,
            tooltip_message,
        );
    }
}

export function update_setting_element(sub: StreamSubscription, setting_name: string): void {
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    const $elem = $(`#id_${CSS.escape(setting_name)}`);
    const $subsection = $elem.closest(".settings-subsection-parent");
    if ($subsection.find(".save-button-controls").hasClass("hide")) {
        settings_org.discard_stream_property_element_changes(util.the($elem), sub);
    } else {
        settings_org.discard_stream_settings_subsection_changes($subsection, sub);
    }
}

export function enable_or_disable_add_subscribers_elements(
    $container_elem: JQuery,
    enable_elem: boolean,
    stream_creation = false,
): void {
    const $input_element = $container_elem.find(".input").expectOne();
    const $add_subscribers_container = $<tippy.PopperElement>(
        ".edit_subscribers_for_stream .subscriber_list_settings",
    );

    $input_element.prop("contenteditable", enable_elem);

    if (enable_elem) {
        $add_subscribers_container[0]?._tippy?.destroy();
        $container_elem.find(".add_subscribers_container").removeClass("add_subscribers_disabled");
    } else {
        $container_elem.find(".add_subscribers_container").addClass("add_subscribers_disabled");
    }

    if (!stream_creation) {
        const $add_subscribers_button = $container_elem.find(".add-subscriber-button").expectOne();
        const input_empty =
            $container_elem.find(".pill").length === 0 && $input_element.text().length === 0;
        $add_subscribers_button.prop("disabled", !enable_elem || input_empty);
        if (enable_elem) {
            $add_subscribers_button.css("pointer-events", "");
        }
    }
}

export function update_channel_folder_dropdown(sub: StreamSubscription): void {
    if (!hash_parser.is_editing_stream(sub.stream_id)) {
        return;
    }

    settings_components.set_channel_folder_dropdown_value(sub);
}

export function maybe_reset_channel_folder_dropdown(archived_folder_id: number): void {
    const $elem = $("#id_folder_id");
    const selected_value = settings_components.get_channel_folder_value_from_dropdown_widget($elem);
    if (selected_value === archived_folder_id) {
        const active_stream_id = stream_settings_components.get_active_data().id;
        const sub = sub_store.get(active_stream_id)!;
        update_setting_element(sub, "folder_id");
    }
}

export function set_folder_dropdown_visibility($container: JQuery): void {
    if (current_user.is_admin) {
        $container.find(".channel-folder-container").show();
        $container.find(".no-folders-configured-message").hide();
        return;
    }

    const realm_has_channel_folders = channel_folders.get_active_folder_ids().size > 0;
    if (realm_has_channel_folders) {
        $container.find(".channel-folder-container").show();
        $container.find(".no-folders-configured-message").hide();
    } else {
        $container.find(".channel-folder-container").hide();
        $container.find(".no-folders-configured-message").show();
    }
}

export function update_folder_dropdown_visibility(): void {
    if (!overlays.streams_open()) {
        return;
    }

    set_folder_dropdown_visibility($("#stream-creation"));

    const active_stream_id = stream_settings_components.get_active_data().id;
    if (active_stream_id) {
        set_folder_dropdown_visibility($("#stream_settings"));
    }
}

export function update_can_create_topic_group_setting_state($container: JQuery): void {
    const is_history_public = $container.find(".history_public_to_subscribers").is(":checked");

    let $setting_element = $("#id_can_create_topic_group");
    if (hash_parser.is_create_new_stream_narrow()) {
        $setting_element = $("#id_new_can_create_topic_group");
    }
    if (is_history_public) {
        settings_components.enable_group_permission_setting($setting_element);
    } else {
        settings_components.disable_group_permission_setting($setting_element);
    }
    $setting_element
        .closest(".input-group")
        .toggleClass("can_create_topic_group_disabled_tooltip", !is_history_public);
}

export function update_can_create_topic_group_on_history_public_to_subscribers_change(
    sub: StreamSubscription,
): void {
    // This function is only used to enable/disable the can_create_topic_group setting
    // element when history_public_to_subscribers checkbox is changed for an existing
    // channel.
    // This is different from update_can_create_topic_group_setting_state above because
    // the can_create_topic_group setting element is enabled only if
    // sub.history_public_to_subscribers is true, i.e. we do not enable the element
    // immediately after the input is checked for a channel whose history is private
    // originally.

    const is_history_public = $("#stream_settings")
        .find(".history_public_to_subscribers")
        .is(":checked");
    const $can_create_topic_group_elem = $("#id_can_create_topic_group");

    if (!is_history_public) {
        settings_components.disable_group_permission_setting($can_create_topic_group_elem);
        $can_create_topic_group_elem
            .closest(".input-group")
            .addClass("can_create_topic_group_disabled_tooltip");
        return;
    }

    if (sub.history_public_to_subscribers) {
        settings_components.enable_group_permission_setting($can_create_topic_group_elem);
        $can_create_topic_group_elem
            .closest(".input-group")
            .removeClass("can_create_topic_group_disabled_tooltip");
    }
}
```

--------------------------------------------------------------------------------

---[FILE: submessage.ts]---
Location: zulip-main/web/src/submessage.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import * as channel from "./channel.ts";
import type {MessageList} from "./message_list.ts";
import * as message_store from "./message_store.ts";
import type {Message} from "./message_store.ts";
import type {PollWidgetOutboundData} from "./poll_widget.ts";
import {todo_widget_extra_data_schema} from "./todo_widget.ts";
import type {TodoWidgetOutboundData} from "./todo_widget.ts";
import * as widgetize from "./widgetize.ts";

export type Submessage = z.infer<typeof message_store.submessage_schema>;

export const zform_widget_extra_data_schema = z.object({
    choices: z.array(
        z.object({
            type: z.string(),
            long_name: z.string(),
            reply: z.string(),
            short_name: z.string(),
        }),
    ),
    heading: z.string(),
    type: z.literal("choices"),
});

const poll_widget_extra_data_schema = z.nullable(
    z.object({
        question: z.optional(z.string()),
        options: z.optional(z.array(z.string())),
    }),
);

const widget_data_event_schema = z.object({
    sender_id: z.number(),
    data: z.discriminatedUnion("widget_type", [
        z.object({widget_type: z.literal("poll"), extra_data: poll_widget_extra_data_schema}),
        z.object({
            widget_type: z.literal("zform"),
            extra_data: z.nullable(zform_widget_extra_data_schema),
        }),
        z.object({
            widget_type: z.literal("todo"),
            extra_data: z.nullable(todo_widget_extra_data_schema),
        }),
    ]),
});

const inbound_data_event_schema = z.object({
    sender_id: z.number(),
    data: z.intersection(
        z.object({
            type: z.string(),
        }),
        z.record(z.string(), z.unknown()),
    ),
});

const submessages_event_schema = z.tuple([widget_data_event_schema], inbound_data_event_schema);

type SubmessageEvents = z.infer<typeof submessages_event_schema>;

export function get_message_events(message: Message): SubmessageEvents | undefined {
    if (message.locally_echoed) {
        return undefined;
    }

    if (message.submessages.length === 0) {
        return undefined;
    }

    message.submessages.sort((m1, m2) => m1.id - m2.id);

    const events = message.submessages.map((obj): {sender_id: number; data: unknown} => ({
        sender_id: obj.sender_id,
        data: JSON.parse(obj.content),
    }));
    const clean_events = submessages_event_schema.parse(events);
    return clean_events;
}

export function process_widget_rows_in_list(list: MessageList | undefined): void {
    for (const message_id of widgetize.widget_event_handlers.keys()) {
        const $row = list?.get_row(message_id);
        if ($row && $row.length > 0) {
            process_submessages({message_id, $row});
        }
    }
}

export function process_submessages(in_opts: {$row: JQuery; message_id: number}): void {
    // This happens in our rendering path, so we try to limit any
    // damage that may be triggered by one rogue message.
    try {
        do_process_submessages(in_opts);
        return;
    } catch (error) {
        blueslip.error("Failed to do_process_submessages", undefined, error);
        return;
    }
}

export function do_process_submessages(in_opts: {$row: JQuery; message_id: number}): void {
    const message_id = in_opts.message_id;
    const message = message_store.get(message_id);

    if (!message) {
        return;
    }

    const events = get_message_events(message);

    if (!events) {
        return;
    }
    const [widget_event, ...inbound_events] = events;

    if (widget_event.sender_id !== message.sender_id) {
        blueslip.warn(`User ${widget_event.sender_id} tried to hijack message ${message.id}`);
        return;
    }

    const $row = in_opts.$row;

    // Right now, our only use of submessages is widgets.

    const data = widget_event.data;

    if (data === undefined) {
        return;
    }

    const widget_type = data.widget_type;

    if (widget_type === undefined) {
        return;
    }

    const post_to_server = make_server_callback(message_id);

    widgetize.activate({
        widget_type,
        extra_data: data.extra_data,
        events: inbound_events,
        $row,
        message,
        post_to_server,
    });
}

export function update_message(submsg: Submessage): void {
    const message = message_store.get(submsg.message_id);

    if (message === undefined) {
        // This is generally not a problem--the server
        // can send us events without us having received
        // the original message, since the server doesn't
        // track that.
        return;
    }

    const existing = message.submessages.find((sm) => sm.id === submsg.id);

    if (existing !== undefined) {
        blueslip.warn("Got submessage multiple times: " + submsg.id);
        return;
    }

    message.submessages.push(submsg);
}

export function handle_event(submsg: Submessage): void {
    // Update message.submessages in case we haven't actually
    // activated the widget yet, so that when the message does
    // come in view, the data will be complete.
    update_message(submsg);

    // Right now, our only use of submessages is widgets.
    const msg_type = submsg.msg_type;

    if (msg_type !== "widget") {
        blueslip.warn("unknown msg_type: " + msg_type);
        return;
    }

    let data: unknown;

    try {
        data = JSON.parse(submsg.content);
    } catch {
        blueslip.warn("server sent us invalid json in handle_event: " + submsg.content);
        return;
    }

    widgetize.handle_event({
        sender_id: submsg.sender_id,
        message_id: submsg.message_id,
        data,
    });
}

export function make_server_callback(
    message_id: number,
): (opts: {
    msg_type: string;
    data: string | PollWidgetOutboundData | TodoWidgetOutboundData;
}) => void {
    return function (opts: {
        msg_type: string;
        data: string | PollWidgetOutboundData | TodoWidgetOutboundData;
    }) {
        const url = "/json/submessage";

        void channel.post({
            url,
            data: {
                message_id,
                msg_type: opts.msg_type,
                content: JSON.stringify(opts.data),
            },
        });
    };
}
```

--------------------------------------------------------------------------------

---[FILE: subscriber_api.ts]---
Location: zulip-main/web/src/subscriber_api.ts

```typescript
import * as channel from "./channel.ts";
import * as people from "./people.ts";
import type {StreamSubscription} from "./sub_store.ts";

/*
    This module simply encapsulates our legacy API for subscribing
    or unsubscribing users from streams. Callers don't need to
    know the strange names of "subscriptions" and "principals",
    nor how to JSON.stringify things, nor the URL scheme.
*/

export function add_user_ids_to_stream(
    user_ids: number[],
    sub: StreamSubscription,
    send_new_subscription_messages: boolean,
    success: (data: unknown) => void,
    failure: (xhr: JQuery.jqXHR<unknown>) => void,
): void {
    // TODO: use stream_id when backend supports it
    const stream_name = sub.name;
    if (user_ids.length === 1 && people.is_my_user_id(Number(user_ids[0]))) {
        // Self subscribe
        const color = sub.color;
        void channel.post({
            url: "/json/users/me/subscriptions",
            data: {
                subscriptions: JSON.stringify([{name: stream_name, color}]),
                send_new_subscription_messages,
            },
            success,
            error: failure,
        });
        return;
    }
    void channel.post({
        url: "/json/users/me/subscriptions",
        data: {
            subscriptions: JSON.stringify([{name: stream_name}]),
            principals: JSON.stringify(user_ids),
            send_new_subscription_messages,
        },
        success,
        error: failure,
    });
}

export function remove_user_id_from_stream(
    user_id: number,
    sub: StreamSubscription,
    success: (data: unknown) => void,
    failure: (xhr: JQuery.jqXHR<unknown>) => void,
): void {
    // TODO: use stream_id when backend supports it
    const stream_name = sub.name;
    void channel.del({
        url: "/json/users/me/subscriptions",
        data: {subscriptions: JSON.stringify([stream_name]), principals: JSON.stringify([user_id])},
        success,
        error: failure,
    });
}
```

--------------------------------------------------------------------------------

---[FILE: sub_store.ts]---
Location: zulip-main/web/src/sub_store.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import type {
    never_subscribed_stream_schema,
    stream_properties_schema,
    stream_schema,
    stream_specific_notification_settings_schema,
} from "./stream_types.ts";
import {api_stream_subscription_schema} from "./stream_types.ts";

export type Stream = z.infer<typeof stream_schema>;
export type StreamSpecificNotificationSettings = z.infer<
    typeof stream_specific_notification_settings_schema
>;
export type NeverSubscribedStream = z.infer<typeof never_subscribed_stream_schema>;
export type StreamProperties = z.infer<typeof stream_properties_schema>;
export type ApiStreamSubscription = z.infer<typeof api_stream_subscription_schema>;

// This is the actual type of subscription objects we use in the app.
export const stream_subscription_schema = z.object({
    ...z.omit(api_stream_subscription_schema, {
        subscribers: true,
        subscriber_count: true,
    }).shape,
    // These properties are added in `stream_data` when hydrating the streams and are not present in the data we get from the server.
    newly_subscribed: z.boolean(),
    subscribed: z.boolean(),
    previously_subscribed: z.boolean(),
});
export type StreamSubscription = z.infer<typeof stream_subscription_schema>;

const subs_by_stream_id = new Map<number, StreamSubscription>();

export function stream_ids(): number[] {
    return [...subs_by_stream_id.keys()];
}

export function get(stream_id: number): StreamSubscription | undefined {
    return subs_by_stream_id.get(stream_id);
}

export function validate_stream_ids(stream_ids: number[]): number[] {
    const good_ids = [];
    const bad_ids = [];

    for (const stream_id of stream_ids) {
        if (subs_by_stream_id.has(stream_id)) {
            good_ids.push(stream_id);
        } else {
            bad_ids.push(stream_id);
        }
    }

    if (bad_ids.length > 0) {
        blueslip.warn(`We have untracked stream_ids: ${bad_ids.toString()}`);
    }

    return good_ids;
}

export function clear(): void {
    subs_by_stream_id.clear();
}

export function delete_sub(stream_id: number): void {
    subs_by_stream_id.delete(stream_id);
}

export function add_hydrated_sub(stream_id: number, sub: StreamSubscription): void {
    // The only code that should call this directly is
    // in stream_data.js. Grep there to find callers.
    subs_by_stream_id.set(stream_id, sub);
}

export function maybe_get_stream_name(stream_id: number): string | undefined {
    if (!stream_id) {
        return undefined;
    }
    const stream = get(stream_id);

    if (!stream) {
        return undefined;
    }

    return stream.name;
}
```

--------------------------------------------------------------------------------

````
