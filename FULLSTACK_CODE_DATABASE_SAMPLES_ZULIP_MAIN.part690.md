---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 690
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 690 of 1290)

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

---[FILE: stream_settings_api.ts]---
Location: zulip-main/web/src/stream_settings_api.ts

```typescript
import assert from "minimalistic-assert";

import * as channel from "./channel.ts";
import * as settings_ui from "./settings_ui.ts";
import type {StreamProperties, StreamSubscription} from "./sub_store.ts";
import * as sub_store from "./sub_store.ts";

export type SubData = {
    [Property in keyof StreamProperties]: {
        stream_id: number;
        property: Property;
        value: StreamProperties[Property];
    };
}[keyof StreamProperties][];

export function bulk_set_stream_property(sub_data: SubData, $status_element?: JQuery): void {
    const url = "/json/users/me/subscriptions/properties";
    const data = {subscription_data: JSON.stringify(sub_data)};
    if (!$status_element) {
        return void channel.post({
            url,
            data,
            timeout: 10 * 1000,
        });
    }

    settings_ui.do_settings_change(channel.post, url, data, $status_element);
    return undefined;
}

export function set_stream_property(
    sub: StreamSubscription,
    data: {
        [Property in keyof StreamProperties]: {
            property: Property;
            value: StreamProperties[Property];
        };
    }[keyof StreamProperties],
    $status_element?: JQuery,
): void {
    const sub_data = {stream_id: sub.stream_id, ...data};
    bulk_set_stream_property([sub_data], $status_element);
}

export function set_color(stream_id: number, color: string): void {
    const sub = sub_store.get(stream_id);
    assert(sub !== undefined);
    set_stream_property(sub, {property: "color", value: color});
}
```

--------------------------------------------------------------------------------

---[FILE: stream_settings_components.ts]---
Location: zulip-main/web/src/stream_settings_components.ts
Signals: Zod

```typescript
import $ from "jquery";
import * as z from "zod/mini";

import render_unsubscribe_private_stream_modal from "../templates/confirm_dialog/confirm_unsubscribe_private_stream.hbs";
import render_inline_decorated_channel_name from "../templates/inline_decorated_channel_name.hbs";
import render_selected_stream_title from "../templates/stream_settings/selected_stream_title.hbs";

import * as blueslip from "./blueslip.ts";
import * as channel from "./channel.ts";
import * as channel_folders from "./channel_folders.ts";
import * as channel_folders_ui from "./channel_folders_ui.ts";
import * as confirm_dialog from "./confirm_dialog.ts";
import type {DropdownWidget} from "./dropdown_widget.ts";
import * as dropdown_widget from "./dropdown_widget.ts";
import * as hash_util from "./hash_util.ts";
import {$t, $t_html} from "./i18n.ts";
import * as loading from "./loading.ts";
import * as overlays from "./overlays.ts";
import * as peer_data from "./peer_data.ts";
import * as resize from "./resize.ts";
import * as settings_components from "./settings_components.ts";
import * as settings_config from "./settings_config.ts";
import * as settings_data from "./settings_data.ts";
import {current_user} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import * as stream_settings_containers from "./stream_settings_containers.ts";
import * as stream_settings_data from "./stream_settings_data.ts";
import type {StreamSubscription} from "./sub_store.ts";
import type {GroupSettingPillContainer} from "./typeahead_helper.ts";
import * as ui_report from "./ui_report.ts";
import * as user_groups from "./user_groups.ts";

export let archived_status_filter_dropdown_widget: DropdownWidget;
export let channel_creation_privacy_widget: DropdownWidget;

export function set_right_panel_title(sub: StreamSubscription): void {
    let title_icon_color = "#333333";
    if (settings_data.using_dark_theme()) {
        title_icon_color = "#dddeee";
    }

    const preview_url = hash_util.channel_url_by_user_setting(sub.stream_id);
    $("#subscription_overlay .stream-info-title").html(
        render_selected_stream_title({sub, title_icon_color, preview_url}),
    );
}

export const show_subs_pane = {
    nothing_selected(): void {
        $(".settings, #stream-creation").hide();
        $(".nothing-selected").show();
        $("#subscription_overlay .stream-info-title").text(
            $t({defaultMessage: "Channel settings"}),
        );
        resize.resize_settings_overlay($("#channels_overlay_container"));
    },
    settings(sub: StreamSubscription): void {
        $(".settings, #stream-creation").hide();
        $(".settings").show();
        set_right_panel_title(sub);
        resize.resize_settings_overlay($("#channels_overlay_container"));
    },
    create_stream(
        container_name = "configure_channel_settings",
        sub?: {
            name: string;
            invite_only: boolean;
            is_web_public: boolean;
        },
    ): void {
        $(".stream_creation_container").hide();
        if (container_name === "configure_channel_settings") {
            $("#subscription_overlay .stream-info-title").text(
                $t({defaultMessage: "Configure new channel settings"}),
            );
        } else {
            $("#subscription_overlay .stream-info-title").html(
                render_selected_stream_title({
                    sub: sub ?? {
                        name: "",
                        invite_only: false,
                        is_web_public: false,
                    },
                }),
            );
        }
        update_footer_buttons(container_name);
        $(`.${CSS.escape(container_name)}`).show();
        $(".nothing-selected, .settings, #stream-creation").hide();
        $("#stream-creation").show();
        resize.resize_settings_overlay($("#channels_overlay_container"));
        resize.resize_settings_creation_overlay($("#channels_overlay_container"));
    },
};

export function update_footer_buttons(container_name: string): void {
    if (container_name === "subscribers_container") {
        // Hide stream creation containers and show add subscriber container
        $(".finalize_create_stream").show();
        $("#stream_creation_go_to_subscribers").hide();
        $("#stream_creation_go_to_configure_channel_settings").show();
    } else {
        // Hide add subscriber container and show stream creation containers
        $(".finalize_create_stream").hide();
        $("#stream_creation_go_to_subscribers").show();
        $("#stream_creation_go_to_configure_channel_settings").hide();
    }
}

export function get_active_data(): {
    $row: JQuery;
    id: number;
    $tabs: JQuery;
} {
    const $active_row = $("div.stream-row.active");
    const valid_active_id = Number.parseInt($active_row.attr("data-stream-id")!, 10);
    const $active_tabs = $("#subscription_overlay .two-pane-settings-container").find(
        "div.ind-tab.selected",
    );
    return {
        $row: $active_row,
        id: valid_active_id,
        $tabs: $active_tabs,
    };
}

/* For the given stream_row, remove the tick and replace by a spinner. */
function display_subscribe_toggle_spinner($stream_row: JQuery): void {
    /* Prevent sending multiple requests by removing the button class. */
    $stream_row.find(".check").removeClass("sub_unsub_button");

    /* Hide the tick. */
    const $tick = $stream_row.find(".sub-unsub-icon");
    $tick.addClass("hide");

    /* Add a spinner to show the request is in process. */
    const $spinner = $stream_row.find(".sub_unsub_status").expectOne();
    $spinner.show();
    loading.make_indicator($spinner);
}

/* For the given stream_row, add the tick and delete the spinner. */
function hide_subscribe_toggle_spinner($stream_row: JQuery): void {
    /* Re-enable the button to handle requests. */
    $stream_row.find(".check").addClass("sub_unsub_button");

    /* Show the tick. */
    const $tick = $stream_row.find(".sub-unsub-icon");
    $tick.removeClass("hide");

    /* Destroy the spinner. */
    const $spinner = $stream_row.find(".sub_unsub_status").expectOne();
    loading.destroy_indicator($spinner);
}

export function ajaxSubscribe(
    stream: string,
    color: string | undefined = undefined,
    $stream_row: JQuery | undefined = undefined,
): void {
    // Subscribe yourself to a single stream.
    let true_stream_name;

    if ($stream_row !== undefined) {
        display_subscribe_toggle_spinner($stream_row);
    }
    void channel.post({
        url: "/json/users/me/subscriptions",
        data: {subscriptions: JSON.stringify([{name: stream, color}])},
        success(_resp, _statusText, xhr) {
            if (overlays.streams_open()) {
                $("#create_stream_name").val("");
            }

            const res = z
                .object({
                    already_subscribed: z.record(z.string(), z.array(z.string())),
                })
                .parse(xhr.responseJSON);
            if (Object.keys(res.already_subscribed).length > 0) {
                // Display the canonical stream capitalization.
                true_stream_name = res.already_subscribed[current_user.user_id]![0];
                ui_report.success(
                    $t_html(
                        {defaultMessage: "Already subscribed to {channel}"},
                        {channel: true_stream_name},
                    ),
                    $(".stream_change_property_info"),
                );
            }
            // The rest of the work is done via the subscribe event we will get

            if ($stream_row !== undefined) {
                hide_subscribe_toggle_spinner($stream_row);
            }
        },
        error(xhr) {
            if ($stream_row !== undefined) {
                hide_subscribe_toggle_spinner($stream_row);
            }
            ui_report.error(
                $t_html({defaultMessage: "Error adding subscription"}),
                xhr,
                $(".stream_change_property_info"),
            );
        },
    });
}

function ajaxUnsubscribe(sub: StreamSubscription, $stream_row: JQuery | undefined): void {
    // TODO: use stream_id when backend supports it
    if ($stream_row !== undefined) {
        display_subscribe_toggle_spinner($stream_row);
    }
    void channel.del({
        url: "/json/users/me/subscriptions",
        data: {subscriptions: JSON.stringify([sub.name])},
        success() {
            $(".stream_change_property_info").hide();
            // The rest of the work is done via the unsubscribe event we will get

            if ($stream_row !== undefined) {
                hide_subscribe_toggle_spinner($stream_row);
            }
        },
        error(xhr) {
            if ($stream_row !== undefined) {
                hide_subscribe_toggle_spinner($stream_row);
            }
            ui_report.error(
                $t_html({defaultMessage: "Error removing subscription"}),
                xhr,
                $(".stream_change_property_info"),
            );
        },
    });
}

export function unsubscribe_from_private_stream(sub: StreamSubscription): void {
    const invite_only = sub.invite_only;
    const sub_count = peer_data.get_subscriber_count(sub.stream_id);
    const stream_name_with_privacy_symbol_html = render_inline_decorated_channel_name({
        stream: sub,
    });

    const html_body = render_unsubscribe_private_stream_modal({
        unsubscribing_other_user: false,
        organization_will_lose_content_access:
            sub_count === 1 &&
            invite_only &&
            user_groups.is_setting_group_set_to_nobody_group(sub.can_subscribe_group) &&
            user_groups.is_setting_group_set_to_nobody_group(sub.can_add_subscribers_group),
    });

    function unsubscribe_from_stream(): void {
        let $stream_row;
        if (overlays.streams_open()) {
            $stream_row = $(
                "#channels_overlay_container div.stream-row[data-stream-id='" +
                    sub.stream_id +
                    "']",
            );
        }

        ajaxUnsubscribe(sub, $stream_row);
    }

    confirm_dialog.launch({
        html_heading: $t_html(
            {defaultMessage: "Unsubscribe from <z-link></z-link>?"},
            {"z-link": () => stream_name_with_privacy_symbol_html},
        ),
        html_body,
        on_click: unsubscribe_from_stream,
    });
}

export function sub_or_unsub(
    sub: StreamSubscription,
    $stream_row: JQuery | undefined = undefined,
): void {
    if (sub.subscribed) {
        // TODO: This next line should allow guests to access web-public streams.
        if (
            (sub.invite_only && !stream_data.has_content_access_via_group_permissions(sub)) ||
            current_user.is_guest
        ) {
            unsubscribe_from_private_stream(sub);
            return;
        }
        ajaxUnsubscribe(sub, $stream_row);
    } else {
        ajaxSubscribe(sub.name, sub.color, $stream_row);
    }
}

export function set_archived_status_filter_dropdown_widget(widget: DropdownWidget): void {
    archived_status_filter_dropdown_widget = widget;
}

export function get_archived_status_filter_dropdown_value(): string {
    return z.string().parse(archived_status_filter_dropdown_widget.value());
}

export function set_archived_status_filter_dropdown_value(value: string): void {
    archived_status_filter_dropdown_widget.render(value);
}

export function set_archived_status_filters_for_tests(filter_widget: DropdownWidget): void {
    archived_status_filter_dropdown_widget = filter_widget;
}

export function archived_status_filter_includes_channel(sub: StreamSubscription): boolean {
    const filter_value = get_archived_status_filter_dropdown_value();
    const FILTERS = stream_settings_data.ARCHIVED_STATUS_FILTERS;
    if (
        (filter_value === FILTERS.NON_ARCHIVED_CHANNELS && sub.is_archived) ||
        (filter_value === FILTERS.ARCHIVED_CHANNELS && !sub.is_archived)
    ) {
        return false;
    }
    return true;
}

export function set_up_folder_dropdown_widget(sub?: StreamSubscription): DropdownWidget {
    const folder_options = (): dropdown_widget.Option[] => {
        const folders = channel_folders.get_channel_folders();
        const options: dropdown_widget.Option[] = folders.map((folder) => ({
            name: folder.name,
            unique_id: folder.id,
            has_delete_icon: true,
            has_manage_folder_icon: true,
            delete_icon_label: $t({defaultMessage: "Delete folder"}),
            manage_folder_icon_label: $t({defaultMessage: "Manage folder"}),
        }));

        const disabled_option = {
            is_setting_disabled: true,
            show_disabled_icon: false,
            show_disabled_option_name: true,
            unique_id: settings_config.no_folder_selected,
            name: $t({defaultMessage: "None"}),
        };

        options.unshift(disabled_option);
        return options;
    };

    const default_id = sub?.folder_id ?? settings_config.no_folder_selected;

    let widget_name = "folder_id";
    if (sub === undefined) {
        widget_name = "new_channel_folder_id";
    }

    let $events_container = $("#stream_settings .subscription_settings");
    if (sub === undefined) {
        $events_container = $("#stream_creation_form");
    }

    const folder_widget = new dropdown_widget.DropdownWidget({
        widget_name,
        get_options: folder_options,
        $events_container,
        item_click_callback(event, dropdown, this_widget) {
            dropdown.hide();
            event.preventDefault();
            event.stopPropagation();
            this_widget.render();
            if (sub !== undefined) {
                const $edit_container = stream_settings_containers.get_edit_container(sub);
                settings_components.save_discard_stream_settings_widget_status_handler(
                    $edit_container.find(".stream-settings-subsection"),
                    stream_data.get_sub_by_id(sub.stream_id),
                );
            }
        },
        item_button_click_callback(event) {
            event.preventDefault();
            event.stopPropagation();

            if (
                $(event.target).closest(
                    `.${CSS.escape(widget_name)}-dropdown-list-container .dropdown-list-delete`,
                ).length > 0
            ) {
                const folder_id = Number.parseInt(
                    $(event.target).closest(".list-item").attr("data-unique-id")!,
                    10,
                );
                channel_folders_ui.handle_archiving_channel_folder(folder_id);
                return;
            }

            if (
                $(event.target).closest(
                    `.${CSS.escape(widget_name)}-dropdown-list-container .dropdown-list-manage-folder`,
                ).length > 0
            ) {
                const folder_id = Number.parseInt(
                    $(event.target).closest(".list-item").attr("data-unique-id")!,
                    10,
                );
                channel_folders_ui.handle_editing_channel_folder(folder_id);

                return;
            }
        },
        default_id,
        unique_id_type: "number",
    });
    if (sub !== undefined) {
        settings_components.set_dropdown_setting_widget("folder_id", folder_widget);
    }
    folder_widget.setup();
    return folder_widget;
}

export function set_channel_creation_privacy_widget(widget: DropdownWidget): void {
    channel_creation_privacy_widget = widget;
}

const new_stream_group_setting_widget_map = new Map<string, GroupSettingPillContainer | null>([
    ["can_add_subscribers_group", null],
    ["can_administer_channel_group", null],
    ["can_create_topic_group", null],
    ["can_delete_any_message_group", null],
    ["can_delete_own_message_group", null],
    ["can_move_messages_out_of_channel_group", null],
    ["can_move_messages_within_channel_group", null],
    ["can_remove_subscribers_group", null],
    ["can_resolve_topics_group", null],
    ["can_send_message_group", null],
]);

export function get_group_setting_widget_for_new_stream(
    setting_name: string,
): GroupSettingPillContainer | null {
    const pill_widget = new_stream_group_setting_widget_map.get(setting_name);

    if (pill_widget === undefined) {
        blueslip.error("No group setting pill widget for property", {setting_name});
        return null;
    }

    return pill_widget;
}

export function set_group_setting_widget_for_new_stream(
    setting_name: string,
    widget: GroupSettingPillContainer,
): void {
    new_stream_group_setting_widget_map.set(setting_name, widget);
}
```

--------------------------------------------------------------------------------

---[FILE: stream_settings_containers.ts]---
Location: zulip-main/web/src/stream_settings_containers.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import type {StreamSubscription} from "./sub_store.ts";

export function get_edit_container(sub: StreamSubscription): JQuery {
    assert(sub !== undefined, "Stream subscription is undefined.");
    return $(
        `#subscription_overlay .subscription_settings[data-stream-id='${CSS.escape(
            sub.stream_id.toString(),
        )}']`,
    );
}
```

--------------------------------------------------------------------------------

---[FILE: stream_settings_data.ts]---
Location: zulip-main/web/src/stream_settings_data.ts

```typescript
import * as hash_util from "./hash_util.ts";
import * as peer_data from "./peer_data.ts";
import type {User} from "./people.ts";
import * as settings_config from "./settings_config.ts";
import {current_user} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import type {StreamSpecificNotificationSettings, StreamSubscription} from "./sub_store.ts";
import * as sub_store from "./sub_store.ts";
import * as timerender from "./timerender.ts";
import {user_settings} from "./user_settings.ts";
import * as util from "./util.ts";

export type SettingsSubscription = StreamSubscription & {
    date_created_string: string;
    is_realm_admin: boolean;
    creator: User | undefined;
    is_creator: boolean;
    can_change_name_description: boolean;
    should_display_subscription_button: boolean;
    should_display_preview_button: boolean;
    can_change_stream_permissions_requiring_content_access: boolean;
    can_change_stream_permissions_requiring_metadata_access: boolean;
    can_access_subscribers: boolean;
    can_add_subscribers: boolean;
    can_remove_subscribers: boolean;
    can_archive_stream: boolean;
    preview_url: string;
    is_old_stream: boolean;
    subscriber_count: number;
};

export const ARCHIVED_STATUS_FILTERS = {
    ALL_CHANNELS: "all_channels",
    NON_ARCHIVED_CHANNELS: "non_archived_channels",
    ARCHIVED_CHANNELS: "archived_channels",
};

export function get_sub_for_settings(sub: StreamSubscription): SettingsSubscription {
    return {
        ...sub,

        // We get timestamp in seconds from the API but timerender needs milliseconds.
        date_created_string: timerender.get_localized_date_or_time_for_format(
            new Date(sub.date_created * 1000),
            "dayofyear_year",
        ),
        creator: stream_data.maybe_get_creator_details(sub.creator_id),

        is_creator: sub.creator_id === current_user.user_id,
        is_realm_admin: current_user.is_admin,
        can_change_name_description:
            stream_data.can_change_permissions_requiring_metadata_access(sub),

        should_display_subscription_button: stream_data.can_toggle_subscription(sub),
        should_display_preview_button: stream_data.can_preview(sub),
        can_change_stream_permissions_requiring_content_access:
            stream_data.can_change_permissions_requiring_content_access(sub),
        can_change_stream_permissions_requiring_metadata_access:
            stream_data.can_change_permissions_requiring_metadata_access(sub),
        can_access_subscribers: stream_data.can_view_subscribers(sub),
        can_add_subscribers: stream_data.can_subscribe_others(sub),
        can_remove_subscribers: stream_data.can_unsubscribe_others(sub),
        can_archive_stream: stream_data.can_archive_stream(sub),

        preview_url: hash_util.channel_url_by_user_setting(sub.stream_id),
        is_old_stream: sub.stream_weekly_traffic !== null,

        subscriber_count: peer_data.get_subscriber_count(sub.stream_id),
    };
}

function get_subs_for_settings(subs: StreamSubscription[]): SettingsSubscription[] {
    // We may eventually add subscribers to the subs here, rather than
    // delegating, so that we can more efficiently compute subscriber counts
    // (in bulk).  If that plan appears to have been aborted, feel free to
    // inline this.
    return subs.map((sub) => get_sub_for_settings(sub));
}

export function get_updated_unsorted_subs(): SettingsSubscription[] {
    let all_subs = stream_data.get_unsorted_subs();

    // We don't display unsubscribed streams to guest users.
    if (current_user.is_guest) {
        all_subs = all_subs.filter((sub) => sub.subscribed);
    }

    return get_subs_for_settings(all_subs);
}

export function get_unmatched_streams_for_notification_settings(): ({
    [notification_name in keyof StreamSpecificNotificationSettings]: boolean;
} & {
    stream_name: string;
    stream_id: number;
    color: string;
    invite_only: boolean;
    is_web_public: boolean;
})[] {
    const subscribed_rows = stream_data.subscribed_subs().filter((sub) => !sub.is_archived);
    subscribed_rows.sort((a, b) => util.strcmp(a.name, b.name));

    const notification_settings = [];
    for (const row of subscribed_rows) {
        let make_table_row = false;
        function get_notification_setting(
            notification_name: keyof StreamSpecificNotificationSettings,
        ): boolean {
            const default_setting =
                user_settings[
                    settings_config.generalize_stream_notification_setting[notification_name]
                ];
            const stream_setting = stream_data.receives_notifications(
                row.stream_id,
                notification_name,
            );

            if (stream_setting !== default_setting) {
                make_table_row = true;
            }
            return stream_setting;
        }
        const settings_values = {
            desktop_notifications: get_notification_setting("desktop_notifications"),
            audible_notifications: get_notification_setting("audible_notifications"),
            push_notifications: get_notification_setting("push_notifications"),
            email_notifications: get_notification_setting("email_notifications"),
            wildcard_mentions_notify: get_notification_setting("wildcard_mentions_notify"),
        };
        // We do not need to display the streams whose settings
        // match with the global settings defined by the user.
        if (make_table_row) {
            notification_settings.push({
                ...settings_values,
                stream_name: row.name,
                stream_id: row.stream_id,
                color: row.color,
                invite_only: row.invite_only,
                is_web_public: row.is_web_public,
            });
        }
    }
    return notification_settings;
}

export function get_streams_for_settings_page(): SettingsSubscription[] {
    // Build up our list of non-archived subscribed and unsubscribed
    // streams from the data we already have.
    const subscribed_rows = stream_data.subscribed_subs().filter((stream) => !stream.is_archived);
    const unsubscribed_rows = stream_data
        .unsubscribed_subs()
        .filter((stream) => !stream.is_archived);

    // Sort and combine all our streams.
    function by_name(a: StreamSubscription, b: StreamSubscription): number {
        return util.strcmp(a.name, b.name);
    }
    subscribed_rows.sort(by_name);
    unsubscribed_rows.sort(by_name);
    const all_subs = [...unsubscribed_rows, ...subscribed_rows];

    return get_subs_for_settings(all_subs);
}

export function sort_for_stream_settings(stream_ids: number[], order: string): void {
    function name(stream_id: number): string {
        const sub = sub_store.get(stream_id);
        if (!sub) {
            return "";
        }
        return sub.name;
    }

    function weekly_traffic(stream_id: number): number {
        const sub = sub_store.get(stream_id);
        if (sub && sub.stream_weekly_traffic !== null) {
            return sub.stream_weekly_traffic;
        }
        // don't intersperse new streams with zero-traffic existing streams
        return -1;
    }

    function by_stream_name(id_a: number, id_b: number): number {
        const stream_a_name = name(id_a);
        const stream_b_name = name(id_b);
        return util.strcmp(stream_a_name, stream_b_name);
    }

    function by_subscriber_count(id_a: number, id_b: number): number {
        const out = peer_data.get_subscriber_count(id_b) - peer_data.get_subscriber_count(id_a);
        if (out === 0) {
            return by_stream_name(id_a, id_b);
        }
        return out;
    }

    function by_weekly_traffic(id_a: number, id_b: number): number {
        const out = weekly_traffic(id_b) - weekly_traffic(id_a);
        if (out === 0) {
            return by_stream_name(id_a, id_b);
        }
        return out;
    }

    const orders = new Map([
        ["by-stream-name", by_stream_name],
        ["by-subscriber-count", by_subscriber_count],
        ["by-weekly-traffic", by_weekly_traffic],
    ]);

    if (order === undefined || !orders.has(order)) {
        order = "by-stream-name";
    }

    stream_ids.sort(orders.get(order));
}
```

--------------------------------------------------------------------------------

````
