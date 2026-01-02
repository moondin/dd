---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 586
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 586 of 1290)

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

---[FILE: assets.d.ts]---
Location: zulip-main/web/src/assets.d.ts

```typescript
declare module "*.svg" {
    const url: string;
    export default url;
}

declare module "*.ttf" {
    const url: string;
    export default url;
}

declare module "*.png" {
    const url: string;
    export default url;
}

declare module "*.webp" {
    const url: string;
    export default url;
}

// Declare the style loader for CSS files.  This is used in the
// `import` statements in the `emojisets.ts` file.
declare module "!style-loader?*" {
    const css: {use: () => void; unuse: () => void};
    export default css;
}
```

--------------------------------------------------------------------------------

---[FILE: attachments.ts]---
Location: zulip-main/web/src/attachments.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

export const attachment_schema = z.object({
    id: z.number(),
    name: z.string(),
    path_id: z.string(),
    size: z.number(),
    create_time: z.number(),
    messages: z.array(
        z.object({
            id: z.number(),
            date_sent: z.number(),
        }),
    ),
});

const attachments_schema = z.array(attachment_schema);

export const attachment_api_response_schema = z.object({
    attachments: attachments_schema,
    upload_space_used: z.number(),
});

export const detached_uploads_api_response_schema = z.object({
    detached_uploads: attachments_schema,
});
```

--------------------------------------------------------------------------------

---[FILE: attachments_ui.ts]---
Location: zulip-main/web/src/attachments_ui.ts
Signals: Zod

```typescript
import $ from "jquery";
import type * as z from "zod/mini";

import render_confirm_delete_attachment from "../templates/confirm_dialog/confirm_delete_attachment.hbs";
import render_confirm_delete_detached_attachments_modal from "../templates/confirm_dialog/confirm_delete_detached_attachments.hbs";
import render_uploaded_files_list from "../templates/settings/uploaded_files_list.hbs";

import {attachment_api_response_schema} from "./attachments.ts";
import * as banners from "./banners.ts";
import type {ActionButton} from "./buttons.ts";
import * as channel from "./channel.ts";
import * as dialog_widget from "./dialog_widget.ts";
import {$t, $t_html} from "./i18n.ts";
import * as ListWidget from "./list_widget.ts";
import * as loading from "./loading.ts";
import * as scroll_util from "./scroll_util.ts";
import {message_edit_history_visibility_policy_values} from "./settings_config.ts";
import * as settings_config from "./settings_config.ts";
import {current_user, realm} from "./state_data.ts";
import * as timerender from "./timerender.ts";
import * as ui_report from "./ui_report.ts";

type ServerAttachment = z.infer<typeof attachment_api_response_schema>["attachments"][number];

type Attachment = ServerAttachment & {
    create_time_str: string;
    size_str: string;
};

type AttachmentEvent =
    | {
          op: "add" | "update";
          attachment: ServerAttachment;
          upload_space_used: number;
      }
    | {
          op: "remove";
          attachment: {id: number};
          upload_space_used: number;
      };

let attachments: Attachment[];
let upload_space_used: z.infer<typeof attachment_api_response_schema>["upload_space_used"];

export function bytes_to_size(bytes: number, kb_with_1024_bytes = false): string {
    const kb_size = kb_with_1024_bytes ? 1024 : 1000;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) {
        return "0 B";
    }
    const i = Math.trunc(Math.log(bytes) / Math.log(kb_size));
    let size = Math.round(bytes / Math.pow(kb_size, i));
    if (i > 0 && size < 10) {
        size = Math.round((bytes / Math.pow(kb_size, i)) * 10) / 10;
    }
    return size + " " + sizes[i];
}

export function mib_to_bytes(mib: number): number {
    return mib * 1024 * 1024;
}

export function percentage_used_space(uploads_size: number): string | null {
    if (realm.realm_upload_quota_mib === null) {
        return null;
    }
    return ((100 * uploads_size) / mib_to_bytes(realm.realm_upload_quota_mib)).toFixed(1);
}

function set_upload_space_stats(): void {
    if (realm.realm_upload_quota_mib === null) {
        return;
    }
    if (current_user.is_guest) {
        return;
    }

    const show_upgrade_message =
        realm.realm_plan_type === settings_config.realm_plan_types.limited.code &&
        current_user.is_admin;
    const $container = $("#attachment-stats-holder");

    if (!$container) {
        return;
    }

    let buttons: ActionButton[] = [];
    if (show_upgrade_message) {
        buttons = [
            ...buttons,
            {
                label: $t({defaultMessage: "Upgrade"}),
                custom_classes: "request-upgrade",
                attention: "quiet",
            },
        ];
    }

    const UPLOAD_STATS_BANNER: banners.Banner = {
        intent: show_upgrade_message ? "info" : "neutral",
        label: $t(
            {
                defaultMessage:
                    "Your organization is using {percent_used}% of your {upload_quota} file storage quota. Upgrade for more space.",
            },
            {
                percent_used: percentage_used_space(upload_space_used),
                upload_quota: bytes_to_size(mib_to_bytes(realm.realm_upload_quota_mib), true),
            },
        ),
        buttons,
        close_button: false,
    };

    banners.open(UPLOAD_STATS_BANNER, $container);
}

function delete_attachments(attachment: string, file_name: string): void {
    const html_body = render_confirm_delete_attachment({file_name});

    dialog_widget.launch({
        html_heading: $t_html({defaultMessage: "Delete file?"}),
        html_body,
        html_submit_button: $t_html({defaultMessage: "Delete"}),
        focus_submit_on_open: true,
        on_click() {
            dialog_widget.submit_api_request(channel.del, "/json/attachments/" + attachment, {});
        },
        loading_spinner: true,
    });
}

function sort_mentioned_in(a: Attachment, b: Attachment): number {
    const a_m = a.messages[0];
    const b_m = b.messages[0];

    if (!a_m) {
        return 1;
    }
    if (!b_m) {
        return -1;
    }

    if (a_m.id > b_m.id) {
        return 1;
    } else if (a_m.id === b_m.id) {
        return 0;
    }

    return -1;
}

function render_attachments_ui(): void {
    set_upload_space_stats();

    const $uploaded_files_table = $("#uploaded_files_table").expectOne();
    const $search_input = $<HTMLInputElement>("input#upload_file_search");

    ListWidget.create<Attachment>($uploaded_files_table, attachments, {
        name: "uploaded-files-list",
        get_item: ListWidget.default_get_item,
        modifier_html(attachment) {
            return render_uploaded_files_list({attachment});
        },
        filter: {
            $element: $search_input,
            predicate(item, value) {
                return item.name.toLocaleLowerCase().includes(value);
            },
            onupdate() {
                scroll_util.reset_scrollbar(
                    $uploaded_files_table.closest(".progressive-table-wrapper"),
                );
            },
        },
        $parent_container: $("#attachments-settings").expectOne(),
        init_sort: "create_time_numeric",
        initially_descending_sort: true,
        sort_fields: {
            mentioned_in: sort_mentioned_in,
            ...ListWidget.generic_sort_functions("alphabetic", ["name"]),
            ...ListWidget.generic_sort_functions("numeric", ["create_time", "size"]),
        },
        $simplebar_container: $("#attachments-settings .progressive-table-wrapper"),
    });

    scroll_util.reset_scrollbar($uploaded_files_table.closest(".progressive-table-wrapper"));
}

function format_attachment_data(attachment: ServerAttachment): Attachment {
    return {
        ...attachment,
        create_time_str: timerender.render_now(new Date(attachment.create_time)).time_str,
        size_str: bytes_to_size(attachment.size),
    };
}

export function update_attachments(event: AttachmentEvent): void {
    if (attachments === undefined) {
        // If we haven't fetched attachment data yet, there's nothing to do.
        return;
    }
    if (event.op === "remove" || event.op === "update") {
        attachments = attachments.filter((a) => a.id !== event.attachment.id);
    }
    if (event.op === "add" || event.op === "update") {
        attachments.push(format_attachment_data(event.attachment));
    }
    upload_space_used = event.upload_space_used;
    // TODO: This is inefficient and we should be able to do some sort
    // of incremental ListWidget update instead.
    render_attachments_ui();
}

export function set_up_attachments(): void {
    // The settings page must be rendered before this function gets called.

    const $status = $("#delete-upload-status");
    loading.make_indicator($("#attachments_loading_indicator"), {
        text: $t({defaultMessage: "Loading…"}),
    });

    $("#uploaded_files_table").on("click", ".download-attachment", function () {
        $(this).siblings(".hidden-attachment-download")[0]?.click();
    });

    $("#uploaded_files_table").on("click", ".remove-attachment", (e) => {
        const file_name = $(e.target).closest(".uploaded_file_row").attr("data-attachment-name");
        delete_attachments(
            $(e.target).closest(".uploaded_file_row").attr("data-attachment-id")!,
            file_name!,
        );
    });

    void channel.get({
        url: "/json/attachments",
        success(raw_data) {
            const data = attachment_api_response_schema.parse(raw_data);
            loading.destroy_indicator($("#attachments_loading_indicator"));
            attachments = data.attachments.map((attachment) => format_attachment_data(attachment));
            upload_space_used = data.upload_space_used;
            render_attachments_ui();
        },
        error(xhr) {
            loading.destroy_indicator($("#attachments_loading_indicator"));
            ui_report.error($t_html({defaultMessage: "Failed"}), xhr, $status);
        },
    });
}

export function suggest_delete_detached_attachments(attachments_list: ServerAttachment[]): void {
    const html_body = render_confirm_delete_detached_attachments_modal({
        attachments_list,
        realm_message_edit_history_is_visible:
            realm.realm_message_edit_history_visibility_policy !==
            message_edit_history_visibility_policy_values.never.code,
    });

    // Since we want to delete multiple attachments, we want to be
    // able to keep track of attachments to delete and which ones to
    // retry if it fails.
    const attachments_map = new Map<number, ServerAttachment>();
    for (const attachment of attachments_list) {
        attachments_map.set(attachment.id, attachment);
    }

    function do_delete_attachments(): void {
        dialog_widget.show_dialog_spinner();
        for (const [id, attachment] of attachments_map.entries()) {
            void channel.del({
                url: "/json/attachments/" + attachment.id,
                success() {
                    attachments_map.delete(id);
                    if (attachments_map.size === 0) {
                        dialog_widget.hide_dialog_spinner();
                        dialog_widget.close();
                    }
                },
                error() {
                    dialog_widget.hide_dialog_spinner();
                    ui_report.error(
                        $t_html({defaultMessage: "One or more files could not be deleted."}),
                        undefined,
                        $("#dialog_error"),
                    );
                },
            });
        }
        // This is to open "Manage uploaded files" link.
        $("#confirm_delete_attachments_modal .uploaded_files_settings_link").on("click", (e) => {
            e.stopPropagation();
            dialog_widget.close();
        });
    }

    dialog_widget.launch({
        id: "confirm_delete_attachments_modal",
        html_heading: $t_html({defaultMessage: "Delete uploaded files?"}),
        html_body,
        html_submit_button: $t_html({defaultMessage: "Delete"}),
        html_exit_button: $t_html({defaultMessage: "Don't delete"}),
        loading_spinner: true,
        on_click: do_delete_attachments,
    });
}
```

--------------------------------------------------------------------------------

---[FILE: audible_notifications.ts]---
Location: zulip-main/web/src/audible_notifications.ts

```typescript
import $ from "jquery";

import {user_settings} from "./user_settings.ts";
import * as util from "./util.ts";

export function initialize(): void {
    update_notification_sound_source($("audio#user-notification-sound-audio"), user_settings);
}

export function update_notification_sound_source(
    $container_elem: JQuery<HTMLAudioElement>,
    settings_object: {notification_sound: string},
): void {
    const notification_sound = settings_object.notification_sound;
    const audio_file_without_extension = "/static/audio/notification_sounds/" + notification_sound;
    $container_elem
        .find(".notification-sound-source-ogg")
        .attr("src", `${audio_file_without_extension}.ogg`);
    $container_elem
        .find(".notification-sound-source-mp3")
        .attr("src", `${audio_file_without_extension}.mp3`);

    if (notification_sound !== "none") {
        // Load it so that it is ready to be played; without this the old sound
        // is played.
        util.the($container_elem).load();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: avatar.ts]---
Location: zulip-main/web/src/avatar.ts

```typescript
import $ from "jquery";

import render_confirm_delete_user_avatar from "../templates/confirm_dialog/confirm_delete_user_avatar.hbs";

import * as channel from "./channel.ts";
import * as confirm_dialog from "./confirm_dialog.ts";
import {$t_html} from "./i18n.ts";
import * as settings_data from "./settings_data.ts";
import {current_user, realm} from "./state_data.ts";
import * as upload_widget from "./upload_widget.ts";
import type {UploadFunction, UploadWidget} from "./upload_widget.ts";

export function build_bot_create_widget(): UploadWidget {
    // We have to do strange gyrations with the file input to clear it,
    // where we replace it wholesale, so we generalize the file input with
    // a callback function.
    const get_file_input = function (): JQuery<HTMLInputElement> {
        return $("#bot_avatar_file_input");
    };

    const $file_name_field = $("#bot_avatar_file");
    const $input_error = $("#bot_avatar_file_input_error");
    const $clear_button = $("#bot_avatar_clear_button");
    const $upload_button = $("#bot_avatar_upload_button");
    const $preview_text = $("#add_bot_preview_text");
    const $preview_image = $("#add_bot_preview_image");
    return upload_widget.build_widget(
        get_file_input,
        $file_name_field,
        $input_error,
        $clear_button,
        $upload_button,
        $preview_text,
        $preview_image,
    );
}

export function build_bot_edit_widget($target: JQuery): UploadWidget {
    const get_file_input = function (): JQuery<HTMLInputElement> {
        return $target.find<HTMLInputElement>(".edit_bot_avatar_file_input");
    };

    const $file_name_field = $target.find(".edit_bot_avatar_file");
    const $input_error = $target.find(".edit_bot_avatar_error");
    const $clear_button = $target.find(".edit_bot_avatar_clear_button");
    const $upload_button = $target.find(".edit_bot_avatar_upload_button");
    const $preview_text = $target.find(".edit_bot_avatar_preview_text");
    const $preview_image = $target.find(".edit_bot_avatar_preview_image");

    return upload_widget.build_widget(
        get_file_input,
        $file_name_field,
        $input_error,
        $clear_button,
        $upload_button,
        $preview_text,
        $preview_image,
    );
}

function display_avatar_delete_complete(): void {
    $("#user-avatar-upload-widget .upload-spinner-background").css({visibility: "hidden"});
    $("#user-avatar-upload-widget .image-upload-text").show();
    $("#user-avatar-source").show();
}

function display_avatar_delete_started(): void {
    $("#user-avatar-upload-widget .upload-spinner-background").css({visibility: "visible"});
    $("#user-avatar-upload-widget .image-upload-text").hide();
    $("#user-avatar-upload-widget .image-delete-button").hide();
}

export function build_user_avatar_widget(upload_function: UploadFunction): void {
    const get_file_input = function (): JQuery<HTMLInputElement> {
        return $<HTMLInputElement>("#user-avatar-upload-widget input.image_file_input").expectOne();
    };

    if (current_user.avatar_source === "G") {
        $("#user-avatar-upload-widget .image-delete-button").hide();
        $("#user-avatar-source").show();
    } else {
        $("#user-avatar-source").hide();
    }

    if (!settings_data.user_can_change_avatar()) {
        return;
    }

    $("#user-avatar-upload-widget .image-delete-button").on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        function delete_user_avatar(): void {
            display_avatar_delete_started();
            void channel.del({
                url: "/json/users/me/avatar",
                success() {
                    display_avatar_delete_complete();

                    // Need to clear input because of a small edge case
                    // where you try to upload the same image you just deleted.
                    get_file_input().val("");
                    // Rest of the work is done via the user_events -> avatar_url event we will get
                },
                error() {
                    display_avatar_delete_complete();
                    $("#user-avatar-upload-widget .image-delete-button").show();
                },
            });
        }
        const html_body = render_confirm_delete_user_avatar({});

        confirm_dialog.launch({
            html_heading: $t_html({defaultMessage: "Delete profile picture"}),
            html_body,
            on_click: delete_user_avatar,
        });
    });

    upload_widget.build_direct_upload_widget(
        get_file_input,
        $("#user-avatar-upload-widget-error").expectOne(),
        $("#user-avatar-upload-widget .image_upload_button").expectOne(),
        upload_function,
        realm.max_avatar_file_size_mib,
        "user_avatar",
    );
}
```

--------------------------------------------------------------------------------

---[FILE: banners.ts]---
Location: zulip-main/web/src/banners.ts

```typescript
import type Handlebars from "handlebars/runtime.js";
import $ from "jquery";

import render_banner from "../templates/components/banner.hbs";

import type {ActionButton} from "./buttons.ts";
import type {ComponentIntent} from "./types.ts";

export type Banner = {
    intent: ComponentIntent;
    label: string | Handlebars.SafeString;
    buttons: ActionButton[];
    close_button: boolean;
    custom_classes?: string;
};

export type AlertBanner = Banner & {
    process: string;
};

export function open(
    banner: Banner | AlertBanner,
    $banner_container: JQuery,
    remove_after?: number,
): void {
    const banner_html = render_banner(banner);
    $banner_container.html(banner_html);

    if (remove_after !== undefined) {
        setTimeout(() => {
            close($banner_container.find(".banner"));
        }, remove_after);
    }
}

export function append(banner: Banner | AlertBanner, $banner_container: JQuery): void {
    const $banner_html = render_banner(banner);
    $banner_container.append($banner_html);
}

export function close($banner: JQuery): void {
    $banner.remove();
}

export function initialize(): void {
    $("body").on("click", ".banner .banner-close-action", function (this: HTMLElement, e) {
        e.preventDefault();
        e.stopPropagation();
        const $banner = $(this).closest(".banner");
        close($banner);
    });
}
```

--------------------------------------------------------------------------------

---[FILE: base_page_params.ts]---
Location: zulip-main/web/src/base_page_params.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import {narrow_term_schema, state_data_schema} from "./state_data.ts";

const t1 = performance.now();

// Sync this with zerver.context_processors.zulip_default_context.
const default_params_schema = z.object({
    page_type: z.literal("default"),
    development_environment: z.boolean(),
    google_analytics_id: z.optional(z.string()),
    request_language: z.string(),
});

// These parameters are sent in #page-params for both users and spectators.
//
// Sync this with zerver.lib.home.build_page_params_for_home_page_load.
//
// TODO/typescript: Replace z.looseObject with z.object when all consumers have
// been converted to TypeScript and the schema is complete.
const home_params_schema = z.looseObject({
    ...default_params_schema.shape,
    page_type: z.literal("home"),
    apps_page_url: z.string(),
    corporate_enabled: z.boolean(),
    embedded_bots_enabled: z.boolean(),
    furthest_read_time: z.nullable(z.number()),
    insecure_desktop_app: z.boolean(),
    is_node_test: z.optional(z.literal(true)),
    is_spectator: z.boolean(),
    // `language_cookie_name` is only sent for spectators.
    language_cookie_name: z.optional(z.string()),
    language_list: z.array(
        z.object({
            code: z.string(),
            locale: z.string(),
            name: z.string(),
            percent_translated: z.optional(z.number()),
        }),
    ),
    login_page: z.string(),
    narrow: z.optional(z.array(narrow_term_schema)),
    narrow_stream: z.optional(z.string()),
    narrow_topic: z.optional(z.string()),
    presence_history_limit_days_for_web_app: z.number(),
    promote_sponsoring_zulip: z.boolean(),
    realm_rendered_description: z.string(),
    show_try_zulip_modal: z.boolean(),
    state_data: z.nullable(state_data_schema),
    translation_data: z.record(z.string(), z.string()),
    warn_no_email: z.boolean(),
});

// Sync this with analytics.views.stats.render_stats.
const stats_params_schema = z.object({
    ...default_params_schema.shape,
    page_type: z.literal("stats"),
    data_url_suffix: z.string(),
    upload_space_used: z.nullable(z.number()),
    guest_users: z.nullable(z.number()),
    translation_data: z.record(z.string(), z.string()),
});

// Sync this with corporate.views.portico.team_view.
const team_params_schema = z.object({
    ...default_params_schema.shape,
    page_type: z.literal("team"),
    contributors: z.optional(
        z.array(
            z.catchall(
                z.object({
                    avatar: z.string(),
                    github_username: z.optional(z.string()),
                    email: z.optional(z.string()),
                    name: z.optional(z.string()),
                }),
                // Repository names may change or increase over time,
                // so we use this to parse the contributions of the user in
                // the given repository instead of typing every name.
                z.number(),
            ),
        ),
    ),
});

// Sync this with corporate.lib.stripe.UpgradePageParams.
const upgrade_params_schema = z.object({
    ...default_params_schema.shape,
    page_type: z.literal("upgrade"),
    annual_price: z.number(),
    monthly_price: z.number(),
    seat_count: z.number(),
    billing_base_url: z.string(),
    tier: z.number(),
    flat_discount: z.number(),
    flat_discounted_months: z.number(),
    fixed_price: z.nullable(z.number()),
    setup_payment_by_invoice: z.boolean(),
    free_trial_days: z.nullable(z.number()),
    percent_off_annual_price: z.nullable(z.string()),
    percent_off_monthly_price: z.nullable(z.string()),
});

const page_params_schema = z.discriminatedUnion("page_type", [
    default_params_schema,
    home_params_schema,
    stats_params_schema,
    team_params_schema,
    upgrade_params_schema,
]);

function take_params(): string {
    const page_params_div = document.querySelector<HTMLElement>("#page-params");
    if (page_params_div === null) {
        throw new Error("Missing #page-params");
    }
    const params = page_params_div.getAttribute("data-params");
    if (params === null) {
        throw new Error("Missing #page_params[data-params]");
    }
    page_params_div.remove();
    return params;
}

export const page_params = page_params_schema.parse(JSON.parse(take_params()));

const t2 = performance.now();
export const page_params_parse_time = t2 - t1;
```

--------------------------------------------------------------------------------

---[FILE: blueslip.ts]---
Location: zulip-main/web/src/blueslip.ts

```typescript
/* eslint-disable no-console */

// System documented in https://zulip.readthedocs.io/en/latest/subsystems/logging.html

// This must be included before the first call to $(document).ready
// in order to be able to report exceptions that occur during their
// execution.

import * as Sentry from "@sentry/browser";
import $ from "jquery";

import {BlueslipError, display_stacktrace} from "./blueslip_stacktrace.ts";

if (Error.stackTraceLimit !== undefined) {
    Error.stackTraceLimit = 100000;
}

function make_logger_func(name: "debug" | "log" | "info" | "warn" | "error") {
    return function Logger_func(this: Logger, ...args: unknown[]) {
        const date_str = new Date().toISOString();

        const str_args = args.map((x) => (typeof x === "string" ? x : JSON.stringify(x)));

        const log_entry = date_str + " " + name.toUpperCase() + ": " + str_args.join("");
        this._memory_log.push(log_entry);

        // Don't let the log grow without bound
        if (this._memory_log.length > 1000) {
            this._memory_log.shift();
        }

        if (console[name] !== undefined) {
            console[name](...args);
        }
    };
}

class Logger {
    debug = make_logger_func("debug");
    log = make_logger_func("log");
    info = make_logger_func("info");
    warn = make_logger_func("warn");
    error = make_logger_func("error");

    _memory_log: string[] = [];
    get_log(): string[] {
        return this._memory_log;
    }
}

const logger = new Logger();

export function get_log(): string[] {
    return logger.get_log();
}

function build_arg_list(
    msg: string,
    more_info?: Record<string, unknown>,
): [string, string?, unknown?] {
    const args: [string, string?, unknown?] = [msg];
    if (more_info !== undefined) {
        args.push("\nAdditional information: ", more_info);
    }
    return args;
}

export function debug(msg: string, more_info?: Record<string, unknown>): void {
    const args = build_arg_list(msg, more_info);
    logger.debug(...args);
}

export function log(msg: string, more_info?: Record<string, unknown>): void {
    const args = build_arg_list(msg, more_info);
    logger.log(...args);
}

export function info(msg: string, more_info?: Record<string, unknown>): void {
    const args = build_arg_list(msg, more_info);
    logger.info(...args);
}

export function warn(msg: string, more_info?: Record<string, unknown>): void {
    const args = build_arg_list(msg, more_info);
    logger.warn(...args);
    if (DEVELOPMENT) {
        console.trace();
    }
}

export function error(
    msg: string,
    more_info?: Record<string, unknown>,
    original_error?: unknown,
): void {
    // Log the Sentry error before the console warning, so we don't
    // end up with a doubled message in the Sentry logs.
    Sentry.setContext("more_info", more_info ?? null);

    // Note that original_error could be of any type, because you can "raise"
    // any type -- something we do see in practice with the error
    // object being "dead": https://github.com/zulip/zulip/issues/18374
    Sentry.captureException(new Error(msg, {cause: original_error}));

    const args = build_arg_list(msg, more_info);
    logger.error(...args);

    // Throw an error in development; this will show a dialog (see below).
    if (DEVELOPMENT) {
        throw new BlueslipError(msg, more_info, original_error);
    }
    // This function returns to its caller in production!  To raise a
    // fatal error even in production, use throw new Error(…) instead.
}

// Install a window-wide onerror handler in development to display the stacktraces, to make them
// hard to miss
if (DEVELOPMENT) {
    $(window).on("error", (event: JQuery.TriggeredEvent) => {
        const {originalEvent} = event;
        if (originalEvent instanceof ErrorEvent) {
            void display_stacktrace(originalEvent.error, originalEvent.message);
        }
    });
    $(window).on("unhandledrejection", (event: JQuery.TriggeredEvent) => {
        const {originalEvent} = event;
        if (originalEvent instanceof PromiseRejectionEvent) {
            void display_stacktrace(originalEvent.reason);
        }
    });
}

// Click handlers for the blueslip overlay.
$(".blueslip-error-container").on("click", ".stackframe", function () {
    $(this).siblings(".code-context").toggle("fast");
});

$(".blueslip-error-container").on("click", ".exit", function () {
    const $stacktrace = $(this).closest(".stacktrace");
    $stacktrace.addClass("fade-out");
    setTimeout(() => {
        $stacktrace.removeClass("fade-out show");
    }, 300);
});
```

--------------------------------------------------------------------------------

---[FILE: blueslip_stacktrace.ts]---
Location: zulip-main/web/src/blueslip_stacktrace.ts

```typescript
import ErrorStackParser from "error-stack-parser";
import $ from "jquery";
import type StackFrame from "stackframe";
import StackTraceGPS from "stacktrace-gps";

import render_blueslip_stacktrace from "../templates/blueslip_stacktrace.hbs";

export class BlueslipError extends Error {
    override name = "BlueslipError";
    more_info?: object;
    constructor(msg: string, more_info?: object, cause?: unknown) {
        super(msg, {cause});
        if (more_info !== undefined) {
            this.more_info = more_info;
        }
    }
}

type FunctionName = {
    scope: string;
    name: string;
};

type NumberedLine = {
    line_number: number;
    line: string;
    focus: boolean;
};

type CleanStackFrame = {
    full_path: string | undefined;
    show_path: string | undefined;
    function_name: FunctionName | undefined;
    line_number: number | undefined;
    context: NumberedLine[] | undefined;
};

export function exception_msg(
    ex: Error & {
        // Unsupported properties available on some browsers
        fileName?: string;
        lineNumber?: number;
    },
): string {
    let message = ex.message;
    if (ex.fileName !== undefined) {
        message += " at " + ex.fileName;
        if (ex.lineNumber !== undefined) {
            message += `:${ex.lineNumber}`;
        }
    }
    return message;
}

export function clean_path(full_path?: string): string | undefined {
    // If the file is local, just show the filename.
    // Otherwise, show the full path starting from node_modules.
    if (full_path === undefined) {
        return undefined;
    }
    const idx = full_path.indexOf("/node_modules/");
    if (idx !== -1) {
        return full_path.slice(idx + "/node_modules/".length);
    }
    if (full_path.startsWith("webpack://")) {
        return full_path.slice("webpack://".length);
    }
    return full_path;
}

export function clean_function_name(
    function_name: string | undefined,
): {scope: string; name: string} | undefined {
    if (function_name === undefined) {
        return undefined;
    }
    const idx = function_name.lastIndexOf(".");
    return {
        scope: function_name.slice(0, idx + 1),
        name: function_name.slice(idx + 1),
    };
}

const sourceCache: Record<string, string | Promise<string>> = {};

const stack_trace_gps = new StackTraceGPS({sourceCache});

async function get_context(location: StackFrame): Promise<NumberedLine[] | undefined> {
    const {fileName, lineNumber} = location;
    if (fileName === undefined || lineNumber === undefined) {
        return undefined;
    }
    let sourceContent: string | undefined;
    try {
        sourceContent = await sourceCache[fileName];
    } catch {
        return undefined;
    }
    if (sourceContent === undefined) {
        return undefined;
    }
    const lines = sourceContent.split("\n");
    const lo_line_num = Math.max(lineNumber - 5, 0);
    const hi_line_num = Math.min(lineNumber + 4, lines.length);
    return lines.slice(lo_line_num, hi_line_num).map((line: string, i: number) => ({
        line_number: lo_line_num + i + 1,
        line,
        focus: lo_line_num + i + 1 === lineNumber,
    }));
}

export async function display_stacktrace(ex: unknown, message?: string): Promise<void> {
    const errors = [];
    do {
        if (!(ex instanceof Error)) {
            let prototype: unknown;
            errors.push({
                name:
                    ex !== null &&
                    ex !== undefined &&
                    typeof (prototype = Object.getPrototypeOf(ex)) === "object" &&
                    prototype !== null &&
                    "constructor" in prototype
                        ? `thrown ${prototype.constructor.name}`
                        : "thrown",
                message: ex === undefined || ex === null ? message : JSON.stringify(ex),
                stackframes: [],
            });
            break;
        }
        const stackframes: CleanStackFrame[] =
            ex instanceof Error
                ? await Promise.all(
                      ErrorStackParser.parse(ex).map(async (location: StackFrame) => {
                          try {
                              location = await stack_trace_gps.getMappedLocation(location);
                          } catch {
                              // Use unmapped location
                          }
                          return {
                              full_path: location.getFileName(),
                              show_path: clean_path(location.getFileName()),
                              line_number: location.getLineNumber(),
                              function_name: clean_function_name(location.getFunctionName()),
                              context: await get_context(location),
                          };
                      }),
                  )
                : [];
        let more_info: string | undefined;
        if (ex instanceof BlueslipError) {
            more_info = JSON.stringify(ex.more_info, null, 4);
        }
        errors.push({
            name: ex.name,
            message: exception_msg(ex),
            more_info,
            stackframes,
        });
        ex = ex.cause;
    } while (ex !== undefined && ex !== null);

    const $alert = $("<div>").addClass("stacktrace").html(render_blueslip_stacktrace({errors}));
    $(".blueslip-error-container").append($alert);
    $alert.addClass("show");
    // Scroll to the latest stacktrace when it is added.
    $alert[0]?.scrollIntoView({behavior: "smooth"});
}
```

--------------------------------------------------------------------------------

````
