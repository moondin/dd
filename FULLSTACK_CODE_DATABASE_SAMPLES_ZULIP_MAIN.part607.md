---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 607
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 607 of 1290)

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

---[FILE: custom_profile_fields_ui.ts]---
Location: zulip-main/web/src/custom_profile_fields_ui.ts
Signals: Zod

```typescript
import flatpickr from "flatpickr";
import $ from "jquery";
import * as z from "zod/mini";

import render_settings_custom_user_profile_field from "../templates/settings/custom_user_profile_field.hbs";
import render_user_display_only_pill from "../templates/user_display_only_pill.hbs";

import {Typeahead} from "./bootstrap_typeahead.ts";
import * as bootstrap_typeahead from "./bootstrap_typeahead.ts";
import * as channel from "./channel.ts";
import {$t} from "./i18n.ts";
import * as people from "./people.ts";
import * as pill_typeahead from "./pill_typeahead.ts";
import * as settings_components from "./settings_components.ts";
import * as settings_ui from "./settings_ui.ts";
import {current_user, realm} from "./state_data.ts";
import * as typeahead_helper from "./typeahead_helper.ts";
import * as ui_report from "./ui_report.ts";
import type {UserPillWidget} from "./user_pill.ts";
import * as user_pill from "./user_pill.ts";

const user_value_schema = z.array(z.number());

export function append_custom_profile_fields(element_id: string, user_id: number): void {
    const person = people.get_by_user_id(user_id);
    if (person.is_bot) {
        return;
    }
    const all_custom_fields = realm.custom_profile_fields;
    const all_field_types = realm.custom_profile_field_types;

    const all_field_template_types = new Map([
        [all_field_types.LONG_TEXT.id, "text"],
        [all_field_types.SHORT_TEXT.id, "text"],
        [all_field_types.SELECT.id, "select"],
        [all_field_types.USER.id, "user"],
        [all_field_types.DATE.id, "date"],
        [all_field_types.EXTERNAL_ACCOUNT.id, "text"],
        [all_field_types.URL.id, "url"],
        [all_field_types.PRONOUNS.id, "text"],
    ]);

    for (const field of all_custom_fields) {
        const field_value = people.get_custom_profile_data(user_id, field.id) ?? {
            value: "",
            rendered_value: "",
        };
        const editable_by_user = current_user.is_admin || field.editable_by_user;
        const is_select_field = field.type === all_field_types.SELECT.id;
        const field_choices = [];

        if (is_select_field) {
            const field_choice_dict = settings_components.select_field_data_schema.parse(
                JSON.parse(field.field_data),
            );
            for (const [value, {order, text}] of Object.entries(field_choice_dict)) {
                field_choices[Number(order)] = {
                    value,
                    text,
                    selected: value === field_value.value,
                };
            }
        }

        const html = render_settings_custom_user_profile_field({
            field,
            field_type: all_field_template_types.get(field.type),
            field_value,
            is_long_text_field: field.type === all_field_types.LONG_TEXT.id,
            is_user_field: field.type === all_field_types.USER.id,
            is_date_field: field.type === all_field_types.DATE.id,
            is_url_field: field.type === all_field_types.URL.id,
            is_pronouns_field: field.type === all_field_types.PRONOUNS.id,
            is_select_field,
            field_choices,
            for_manage_user_modal: element_id === "#edit-user-form .custom-profile-field-form",
            is_empty_required_field: field.required && !field_value.value,
            editable_by_user,
        });
        $(element_id).append($(html));
    }
}

export type CustomProfileFieldData = {
    id: number;
    value?: number[] | string;
};

function update_custom_profile_field(
    field: CustomProfileFieldData,
    method: channel.AjaxRequestHandler,
): void {
    let data;
    if (method === channel.del) {
        data = JSON.stringify([field.id]);
    } else {
        data = JSON.stringify([field]);
    }

    const $spinner_element = $(
        `.custom_user_field[data-field-id="${CSS.escape(field.id.toString())}"] .custom-field-status`,
    ).expectOne();
    settings_ui.do_settings_change(method, "/json/users/me/profile_data", {data}, $spinner_element);
}

export function update_user_custom_profile_fields(
    fields: CustomProfileFieldData[],
    method: channel.AjaxRequestHandler,
): void {
    for (const field of fields) {
        update_custom_profile_field(field, method);
    }
}

export type PillUpdateField = {
    type: number;
    field_data: string;
    hint: string;
    id: number;
    name: string;
    order: number;
    required: boolean;
    display_in_profile_summary?: boolean | undefined;
};

export function initialize_custom_user_type_fields(
    element_id: string,
    user_id: number,
    is_target_element_editable: boolean,
    pill_update_handler?: (field: PillUpdateField, pills: UserPillWidget) => void,
): Map<number, UserPillWidget> {
    const field_types = realm.custom_profile_field_types;
    const user_pills = new Map<number, UserPillWidget>();

    const person = people.get_by_user_id(user_id);
    if (person.is_bot) {
        return user_pills;
    }

    for (const field of realm.custom_profile_fields) {
        const field_value_raw = people.get_custom_profile_data(user_id, field.id)?.value;

        // If we are not editing the field and field value is null, we don't expect
        // pill container for that field and proceed further
        if (
            field.type === field_types.USER.id &&
            (field_value_raw !== undefined || is_target_element_editable)
        ) {
            const $pill_container = $(element_id)
                .find(
                    `.custom_user_field[data-field-id="${CSS.escape(`${field.id}`)}"] .pill-container`,
                )
                .expectOne();
            const pill_config = {
                exclude_inaccessible_users: is_target_element_editable,
            };
            const pills = user_pill.create_pills($pill_container, pill_config);

            if (field_value_raw !== undefined) {
                const field_value = user_value_schema.parse(JSON.parse(field_value_raw));
                for (const pill_user_id of field_value) {
                    const user = people.get_user_by_id_assert_valid(pill_user_id);
                    user_pill.append_user(user, pills);
                }
            }

            // We check and disable fields that this user doesn't have permission to edit.
            const is_disabled = $pill_container.hasClass("disabled");

            if (is_target_element_editable && !is_disabled) {
                const $input = $pill_container.children(".input");
                if (pill_update_handler) {
                    const update_func = (): void => {
                        pill_update_handler(field, pills);
                    };
                    const opts = {
                        update_func,
                        exclude_bots: true,
                    };
                    pill_typeahead.set_up_user($input, pills, opts);
                    pills.onPillRemove(() => {
                        pill_update_handler(field, pills);
                    });
                } else {
                    pill_typeahead.set_up_user($input, pills, {exclude_bots: true});
                }
            }
            user_pills.set(field.id, pills);
        }
    }

    // Enable the label associated to this field to focus on the input when clicked.
    $(element_id)
        .find(".custom_user_field label.settings-field-label")
        .on("click", function () {
            const $input_element = $(this)
                .closest(".custom_user_field")
                .find(".person_picker.pill-container .input");
            $input_element.trigger("focus");
        });

    return user_pills;
}

export function initialize_profile_user_type_pills(user_id: number): void {
    const field_types = realm.custom_profile_field_types;

    for (const field of realm.custom_profile_fields) {
        if (field.type !== field_types.USER.id) {
            continue;
        }
        const raw_field_value = people.get_custom_profile_data(user_id, field.id)?.value;
        if (!raw_field_value) {
            continue;
        }
        const field_value = user_value_schema.parse(JSON.parse(raw_field_value));

        const selector = `.custom_user_field[data-field-id="${field.id}"] .user-type-custom-field-pill-container`;
        const $pill_container = $("#user-profile-modal #content").find(selector).expectOne();
        $pill_container.empty();

        for (const user_id of field_value) {
            const user = people.get_user_by_id_assert_valid(user_id);
            const pill_html = render_user_display_only_pill({
                display_value: user.full_name,
                user_id: user.user_id,
                img_src: people.small_avatar_url_for_person(user),
                is_active: people.is_person_active(user.user_id),
                is_current_user: people.is_my_user_id(user.user_id),
                is_bot: user.is_bot,
            });

            $pill_container.append($(pill_html));
        }
    }
}

export function format_date(date: Date | undefined, format: string): string {
    if (date === undefined || date.toString() === "Invalid Date") {
        return "Invalid Date";
    }

    return flatpickr.formatDate(date, format);
}

export function initialize_custom_date_type_fields(
    element_id: string,
    user_id: number,
    for_profile_settings_panel = false,
): void {
    const $date_picker_elements = $(element_id).find(".custom_user_field .datepicker");
    if ($date_picker_elements.length === 0) {
        return;
    }

    function update_date(instance: flatpickr.Instance, date_str: string): void {
        const $input_elem = $(instance.element);
        const field_id = Number.parseInt($input_elem.attr("data-field-id")!, 10);

        if (date_str === "Invalid Date") {
            // Date parses empty string to an invalid value but in
            // our case it is a valid value when user does not want
            // to set any value for the custom profile field.
            if ($input_elem.parent().find(".date-field-alt-input").val() === "") {
                if (!for_profile_settings_panel) {
                    // For "Manage user" modal, API request is made after
                    // clicking on "Save changes" button.
                    return;
                }
                update_user_custom_profile_fields([{id: field_id}], channel.del);
                return;
            }

            // Show "Invalid date value" message briefly and set
            // the input to original value.
            const $spinner_element = $input_elem
                .closest(".custom_user_field")
                .find(".custom-field-status");
            ui_report.error(
                $t({defaultMessage: "Invalid date value"}),
                undefined,
                $spinner_element,
                1200,
            );
            const original_value = people.get_custom_profile_data(user_id, field_id)?.value ?? "";
            instance.setDate(original_value);
            if (!for_profile_settings_panel) {
                // Trigger "input" event so that save button state can
                // be toggled in "Manage user" modal.
                $input_elem
                    .closest(".custom_user_field")
                    .find(".date-field-alt-input")
                    .trigger("input");
            }
            return;
        }

        if (!for_profile_settings_panel) {
            // For "Manage user" modal, API request is made after
            // clicking on "Save changes" button.
            return;
        }

        const fields = [];
        if (date_str) {
            fields.push({id: field_id, value: date_str});
            update_user_custom_profile_fields(fields, channel.patch);
        } else {
            fields.push({id: field_id});
            update_user_custom_profile_fields(fields, channel.del);
        }
    }

    let common_class_name = "modal_text_input";
    if (for_profile_settings_panel) {
        common_class_name = "settings_text_input";
    }

    flatpickr($date_picker_elements, {
        altInput: true,
        // We would need to handle the altInput separately
        // than ".custom_user_field_value" elements to handle
        // invalid values typed in the input.
        altInputClass: "date-field-alt-input " + common_class_name,
        altFormat: "F j, Y",
        allowInput: true,
        static: true,
        // This helps us in accepting inputs in other formats
        // like MM/DD/YYYY and basically any other format
        // which is accepted by Date.
        parseDate: (date_str) => new Date(date_str),
        // We pass allowInvalidPreload as true because we handle
        // invalid values typed in the input ourselves. Also,
        // formatDate function is customized to handle "undefined"
        // values, which are returned by parseDate for invalid
        // values.
        formatDate: format_date,
        allowInvalidPreload: true,
        onChange(_selected_dates, date_str, instance) {
            update_date(instance, date_str);
        },
    });

    // This "change" event handler is needed to make sure that
    // the date is successfully changed when typing a new value
    // in the input and blurring the input by clicking outside
    // while the calendar popover is opened, because onChange
    // callback is not executed in such a scenario.
    //
    // https://github.com/flatpickr/flatpickr/issues/1551#issuecomment-1601830680
    // has explanation on why that happens.
    //
    // However, this leads to a problem in a couple of cases
    // where both onChange callback and this "change" handlers
    // are executed when changing the date by typing in the
    // input. This occurs when pressing Enter while the input
    // is focused, and also when blurring the input by clicking
    // outside while the calendar popover is closed.
    $(element_id)
        .find<HTMLInputElement>("input.date-field-alt-input")
        .on("change", function (this: HTMLInputElement) {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const $datepicker = $(this).parent().find(".datepicker")[0] as HTMLInputElement & {
                _flatpickr: flatpickr.Instance;
            };
            const instance = $datepicker._flatpickr;
            const date = new Date($(this).val()!);
            const date_str = format_date(date, "Y-m-d");
            update_date(instance, date_str);
        });

    // Enable the label associated to this field to open the datepicker when clicked.
    $(element_id)
        .find(".custom_user_field label.settings-field-label")
        .on("click", function () {
            $(this).closest(".custom_user_field").find("input.datepicker").trigger("click");
        });

    $(element_id)
        .find<HTMLInputElement>(".custom_user_field input.datepicker")
        .on("mouseenter", function () {
            if ($(this).val()!.length <= 0) {
                $(this).parent().find(".remove_date").hide();
            } else {
                $(this).parent().find(".remove_date").show();
            }
        });

    $(element_id)
        .find(".custom_user_field .remove_date")
        .on("click", function () {
            const $custom_user_field = $(this).parent().find(".custom_user_field_value");
            const $displayed_input = $(this).parent().find(".date-field-alt-input");
            $displayed_input.val("");
            $custom_user_field.val("");
            $custom_user_field.trigger("input");
        });
}

export function initialize_custom_pronouns_type_fields(element_id: string): void {
    $(element_id)
        .find<HTMLInputElement>(".pronouns_type_field")
        .each((_index, pronoun_field) => {
            const commonly_used_pronouns = [
                $t({defaultMessage: "he/him"}),
                $t({defaultMessage: "she/her"}),
                $t({defaultMessage: "they/them"}),
            ];
            const bootstrap_typeahead_input = {
                $element: $(pronoun_field),
                type: "input" as const,
            };
            new Typeahead(bootstrap_typeahead_input, {
                helpOnEmptyStrings: true,
                source() {
                    return commonly_used_pronouns;
                },
                sorter(items, query) {
                    return bootstrap_typeahead.defaultSorter(items, query);
                },
                item_html(item) {
                    return typeahead_helper.render_typeahead_item({primary: item});
                },
            });
        });
}
```

--------------------------------------------------------------------------------

---[FILE: debug.ts]---
Location: zulip-main/web/src/debug.ts

```typescript
/* eslint-disable no-console */

// This module is included from webpack in development mode.  To access it from
// the browser console, run:
//   var debug = require("./src/debug");

type Collision = {
    id: string;
    count: number;
    node: string;
};

export function check_duplicate_ids(): {collisions: Collision[]; total_collisions: number} {
    const ids = new Set<string>();
    const collisions: Collision[] = [];
    let total_collisions = 0;

    for (const o of document.querySelectorAll("*")) {
        if (o.id && ids.has(o.id)) {
            const el = collisions.find((c) => c.id === o.id);

            ids.add(o.id);
            total_collisions += 1;

            if (!el) {
                const tag = o.tagName.toLowerCase();
                collisions.push({
                    id: o.id,
                    count: 1,
                    node: `<${tag} class="${o.className}" id="${o.id}"></${tag}>`,
                });
            } else {
                el.count += 1;
            }
        } else if (o.id) {
            ids.add(o.id);
        }
    }

    return {
        collisions,
        total_collisions,
    };
}

/* An IterationProfiler is used for profiling parts of looping
 * constructs (like a for loop or _.each).  You mark sections of the
 * iteration body and the IterationProfiler will sum the costs of those
 * sections over all iterations.
 *
 * Example:
 *
 *     let ip = new debug.IterationProfiler();
 *     _.each(myarray, function (elem) {
 *         ip.iteration_start();
 *
 *         cheap_op(elem);
 *         ip.section("a");
 *         expensive_op(elem);
 *         ip.section("b");
 *         another_expensive_op(elem);
 *
 *         ip.iteration_stop();
 *     });
 *     ip.done();
 *
 * The console output will look something like:
 *     _iteration_overhead 0.8950002520577982
 *     _rest_of_iteration 153.415000159293413
 *     a 2.361999897402711
 *     b 132.625999901327305
 *
 * The _rest_of_iteration section is the region of the iteration body
 * after section b.
 */
export class IterationProfiler {
    sections = new Map<string, number>();
    last_time = window.performance.now();

    iteration_start(): void {
        this.section("_iteration_overhead");
    }

    iteration_stop(): void {
        const now = window.performance.now();
        const diff = now - this.last_time;
        if (diff > 1) {
            this.sections.set(
                "_rest_of_iteration",
                (this.sections.get("_rest_of_iteration") ?? 0) + diff,
            );
        }
        this.last_time = now;
    }

    section(label: string): void {
        const now = window.performance.now();
        this.sections.set(label, (this.sections.get(label) ?? 0) + (now - this.last_time));
        this.last_time = now;
    }

    done(): void {
        this.section("_iteration_overhead");

        for (const [prop, cost] of this.sections) {
            console.log(prop, cost);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: demo_organizations_ui.ts]---
Location: zulip-main/web/src/demo_organizations_ui.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import render_convert_demo_organization_form from "../templates/settings/convert_demo_organization_form.hbs";
import render_demo_organization_warning_container from "../templates/settings/demo_organization_warning.hbs";

import * as banners from "./banners.ts";
import type {ActionButton} from "./buttons.ts";
import * as channel from "./channel.ts";
import * as dialog_widget from "./dialog_widget.ts";
import {$t} from "./i18n.ts";
import * as settings_data from "./settings_data.ts";
import type {RequestOpts} from "./settings_ui.ts";
import {current_user, realm} from "./state_data.ts";

export function get_demo_organization_deadline_days_remaining(): number {
    const now = Date.now();
    assert(realm.demo_organization_scheduled_deletion_date !== undefined);
    const deadline = realm.demo_organization_scheduled_deletion_date * 1000;
    const day = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const days_remaining = Math.round(Math.abs(deadline - now) / day);
    return days_remaining;
}

export function insert_demo_organization_warning(): void {
    const demo_organization_warning_container = render_demo_organization_warning_container({
        is_demo_organization: true,
    });
    $(".organization-box")
        .find(".settings-section")
        .prepend($(demo_organization_warning_container));
    const days_remaining = get_demo_organization_deadline_days_remaining();
    let buttons: ActionButton[] = [
        {
            attention: "borderless",
            label: $t({defaultMessage: "Learn more"}),
            custom_classes: "demo-organizations-help",
        },
    ];
    if (current_user.is_owner) {
        buttons = [
            ...buttons,
            {
                attention: "quiet",
                label: $t({defaultMessage: "Convert"}),
                custom_classes: "convert-demo-organization",
            },
        ];
    }
    const demo_organization_warning_banner: banners.Banner = {
        intent: days_remaining <= 7 ? "danger" : "info",
        label: $t(
            {
                defaultMessage:
                    "This demo organization will be automatically deleted in {days_remaining} days, unless it's converted into a permanent organization.",
            },
            {
                days_remaining,
            },
        ),
        buttons,
        close_button: false,
        custom_classes: "organization-settings-banner",
    };
    banners.append(demo_organization_warning_banner, $(".demo-organization-warning"));
}

export function show_configure_email_banner(): void {
    const $configure_email_banner_container = $(".demo-organization-add-email-banner");
    if ($configure_email_banner_container.length > 0) {
        const CONFIGURE_EMAIL_BANNER: banners.Banner = {
            intent: "warning",
            label: $t({defaultMessage: "Add your email to access this feature."}),
            buttons: [
                {
                    attention: "primary",
                    label: $t({defaultMessage: "Add"}),
                    custom_classes: "demo-organization-add-email",
                },
            ],
            close_button: false,
        };
        banners.open(CONFIGURE_EMAIL_BANNER, $configure_email_banner_container);
    }

    $configure_email_banner_container.on("click", ".demo-organization-add-email", (e) => {
        e.preventDefault();
        window.location.href = "/#settings/account-and-privacy";
    });
}

export function show_convert_demo_organization_modal(): void {
    if (!current_user.is_owner) {
        return;
    }

    const email_set = !settings_data.user_email_not_configured();
    const parts = new URL(realm.realm_url).hostname.split(".");
    parts.shift();
    const domain = parts.join(".");
    const html_body = render_convert_demo_organization_form({
        realm_domain: domain,
        user_has_email_set: email_set,
    });

    function demo_organization_conversion_post_render(): void {
        const $convert_submit_button = $(
            "#demo-organization-conversion-modal .dialog_submit_button",
        );
        $convert_submit_button.prop("disabled", true);

        if (!email_set) {
            // Disable form field if demo organization owner email not set.
            $("#new_subdomain").prop("disabled", true);
            // Show banner for adding email to account.
            show_configure_email_banner();
        } else {
            // Disable submit button if new subdomain field blank.
            $("#convert-demo-organization-form").on("input change", () => {
                const string_id = $<HTMLInputElement>("input#new_subdomain").val()!.trim();
                $convert_submit_button.prop("disabled", string_id === "");
            });
        }
    }

    function submit_subdomain(): void {
        const $string_id = $("#new_subdomain");
        const data = {
            string_id: $string_id.val(),
        };
        const opts: RequestOpts = {
            success_continuation(raw_data) {
                const data = z.object({realm_url: z.string()}).parse(raw_data);
                window.location.href = data.realm_url;
            },
        };
        dialog_widget.submit_api_request(channel.patch, "/json/realm", data, opts);
    }

    dialog_widget.launch({
        html_heading: $t({defaultMessage: "Make organization permanent"}),
        html_body,
        on_click: submit_subdomain,
        post_render: demo_organization_conversion_post_render,
        html_submit_button: $t({defaultMessage: "Convert"}),
        id: "demo-organization-conversion-modal",
        loading_spinner: true,
        help_link:
            "/help/demo-organizations#convert-a-demo-organization-to-a-permanent-organization",
    });
}

export function handle_demo_organization_conversion(): void {
    $(".demo-organization-warning").on("click", ".convert-demo-organization", (e) => {
        e.stopPropagation();
        e.preventDefault();
        show_convert_demo_organization_modal();
    });

    $(".demo-organization-warning").on("click", ".demo-organizations-help", () => {
        window.open("https://zulip.com/help/demo-organizations", "_blank", "noopener,noreferrer");
    });
}
```

--------------------------------------------------------------------------------

---[FILE: deprecated_feature_notice.ts]---
Location: zulip-main/web/src/deprecated_feature_notice.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import * as dialog_widget from "./dialog_widget.ts";
import {$t_html} from "./i18n.ts";
import {localstorage} from "./localstorage.ts";

export function get_hotkey_deprecation_notice(
    originalHotkey: string,
    replacementHotkey: string,
): string {
    return $t_html(
        {
            defaultMessage:
                'We\'ve replaced the "{originalHotkey}" hotkey with "{replacementHotkey}" to make this common shortcut easier to trigger.',
        },
        {originalHotkey, replacementHotkey},
    );
}

let shown_deprecation_notices: string[] = [];

export function maybe_show_deprecation_notice(key: string): void {
    let message;
    switch (key) {
        case "Shift + C":
            message = get_hotkey_deprecation_notice("Shift + C", "X");
            break;
        case "Shift + S":
            message = get_hotkey_deprecation_notice("Shift + S", "S");
            break;
        default:
            blueslip.error("Unexpected deprecation notice for hotkey:", {key});
            return;
    }

    // Here we handle the tracking for showing deprecation notices,
    // whether or not local storage is available.
    if (localstorage.supported()) {
        const notices_from_storage = localStorage.getItem("shown_deprecation_notices");
        if (notices_from_storage !== null) {
            const parsed_notices_from_storage = z
                .array(z.string())
                .parse(JSON.parse(notices_from_storage));

            shown_deprecation_notices = parsed_notices_from_storage;
        } else {
            shown_deprecation_notices = [];
        }
    }

    if (!shown_deprecation_notices.includes(key)) {
        dialog_widget.launch({
            html_heading: $t_html({defaultMessage: "Deprecation notice"}),
            html_body: message,
            html_submit_button: $t_html({defaultMessage: "Got it"}),
            on_click() {
                return;
            },
            close_on_submit: true,
            focus_submit_on_open: true,
            single_footer_button: true,
        });

        shown_deprecation_notices.push(key);
        if (localstorage.supported()) {
            localStorage.setItem(
                "shown_deprecation_notices",
                JSON.stringify(shown_deprecation_notices),
            );
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: desktop_integration.ts]---
Location: zulip-main/web/src/desktop_integration.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as browser_history from "./browser_history.ts";
import * as channel from "./channel.ts";
import {electron_bridge} from "./electron_bridge.ts";
import * as feedback_widget from "./feedback_widget.ts";
import {$t} from "./i18n.ts";
import * as message_store from "./message_store.ts";
import * as message_view from "./message_view.ts";
import * as stream_data from "./stream_data.ts";

export function initialize(): void {
    if (electron_bridge === undefined) {
        return;
    }

    electron_bridge.on_event("logout", () => {
        $("#logout_form").trigger("submit");
    });

    electron_bridge.on_event("show-keyboard-shortcuts", () => {
        browser_history.go_to_location("keyboard-shortcuts");
    });

    electron_bridge.on_event("show-notification-settings", () => {
        browser_history.go_to_location("settings/notifications");
    });

    // The code below is for sending a message received from notification reply which
    // is often referred to as inline reply feature. This is done so desktop app doesn't
    // have to depend on channel.post for setting crsf_token and message_view.narrow_by_topic
    // to narrow to the message being sent.
    electron_bridge.set_send_notification_reply_message_supported?.(true);
    electron_bridge.on_event("send_notification_reply_message", (message_id, reply) => {
        const message = message_store.get(message_id);
        assert(message !== undefined);
        const data = {
            type: message.type,
            content: reply,
            ...(message.type === "private"
                ? {
                      to: message.reply_to,
                  }
                : {
                      to: stream_data.get_stream_name_from_id(message.stream_id),
                      topic: message.topic,
                  }),
        };

        const success = (): void => {
            if (message.type === "stream") {
                message_view.narrow_by_topic(message_id, {trigger: "desktop_notification_reply"});
            } else {
                message_view.narrow_by_recipient(message_id, {
                    trigger: "desktop_notification_reply",
                });
            }
        };

        const error = (error: JQuery.jqXHR): void => {
            assert(electron_bridge !== undefined);
            electron_bridge.send_event("send_notification_reply_message_failed", {
                data,
                message_id,
                error,
            });
        };

        channel.post({
            url: "/json/messages",
            data,
            success,
            error,
        });
    });

    $(document).on("click", "#open-self-hosted-billing", (event) => {
        event.preventDefault();

        const url = "/json/self-hosted-billing";

        channel.get({
            url,
            success(raw_data) {
                const data = z
                    .object({result: z.literal("success"), billing_access_url: z.string()})
                    .parse(raw_data);
                window.open(data.billing_access_url, "_blank", "noopener,noreferrer");
            },
            error(xhr) {
                const parsed = z
                    .object({result: z.literal("error"), msg: z.string()})
                    .safeParse(xhr.responseJSON);
                if (parsed.success) {
                    feedback_widget.show({
                        populate($container) {
                            $container.text(parsed.data.msg);
                        },
                        title_text: $t({defaultMessage: "Error"}),
                    });
                }
            },
        });
    });
}
```

--------------------------------------------------------------------------------

---[FILE: desktop_notifications.ts]---
Location: zulip-main/web/src/desktop_notifications.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import {electron_bridge} from "./electron_bridge.ts";
import type {Message} from "./message_store.ts";

type NoticeMemory = Map<
    string,
    {
        obj: Notification | ElectronBridgeNotification;
        msg_count: number;
        message_id: number;
    }
>;

export const notice_memory: NoticeMemory = new Map();

export let NotificationAPI: typeof ElectronBridgeNotification | typeof Notification | undefined;

// Used for testing
export function set_notification_api(n: typeof NotificationAPI): void {
    NotificationAPI = n;
}

export class ElectronBridgeNotification extends EventTarget {
    title: string;
    dir: NotificationDirection;
    lang: string;
    body: string;
    tag: string;
    icon: string;
    data: unknown;
    close: () => void;

    constructor(title: string, options: NotificationOptions) {
        super();
        assert(electron_bridge?.new_notification !== undefined);
        const notification_data = electron_bridge.new_notification(
            title,
            options,
            (type, eventInit) => this.dispatchEvent(new Event(type, eventInit)),
        );
        this.title = notification_data.title;
        this.dir = notification_data.dir;
        this.lang = notification_data.lang;
        this.body = notification_data.body;
        this.tag = notification_data.tag;
        this.icon = notification_data.icon;
        this.data = notification_data.data;
        this.close = notification_data.close;
    }

    static get permission(): NotificationPermission {
        return Notification.permission;
    }

    static async requestPermission(
        callback?: (permission: NotificationPermission) => void,
    ): Promise<NotificationPermission> {
        if (callback) {
            callback(await Promise.resolve(Notification.permission));
        }
        return Notification.permission;
    }
}

if (electron_bridge?.new_notification) {
    NotificationAPI = ElectronBridgeNotification;
} else if (window.Notification) {
    NotificationAPI = window.Notification;
}

export function get_notifications(): NoticeMemory {
    return notice_memory;
}

export function initialize(): void {
    $(window).on("focus", () => {
        for (const notice_mem_entry of notice_memory.values()) {
            notice_mem_entry.obj.close();
        }
        notice_memory.clear();
    });
}

export function permission_state(): string {
    if (NotificationAPI === undefined) {
        // act like notifications are blocked if they do not have access to
        // the notification API.
        return "denied";
    }
    return NotificationAPI.permission;
}

export function close_notification(message: Message): void {
    for (const [key, notice_mem_entry] of notice_memory) {
        if (notice_mem_entry.message_id === message.id) {
            notice_mem_entry.obj.close();
            notice_memory.delete(key);
        }
    }
}

export function granted_desktop_notifications_permission(): boolean {
    return NotificationAPI?.permission === "granted";
}

export async function request_desktop_notifications_permission(): Promise<NotificationPermission> {
    if (NotificationAPI) {
        return await NotificationAPI.requestPermission();
    }
    // Act like notifications are blocked if they do not have access to
    // the notification API.
    return "denied";
}
```

--------------------------------------------------------------------------------

````
