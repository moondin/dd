---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 718
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 718 of 1290)

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

---[FILE: billing.ts]---
Location: zulip-main/web/src/billing/billing.ts
Signals: Zod

```typescript
import $ from "jquery";
import * as z from "zod/mini";

import * as portico_modals from "../portico/portico_modals.ts";

import * as helpers from "./helpers.ts";

const billing_frequency_schema = z.enum(["Monthly", "Annual"]);
const billing_base_url = $("#billing-page").attr("data-billing-base-url")!;

// Matches the CustomerPlan model in the backend.
const BillingFrequency = {
    BILLING_SCHEDULE_ANNUAL: 1,
    BILLING_SCHEDULE_MONTHLY: 2,
} as const;
type BillingFrequency = (typeof BillingFrequency)[keyof typeof BillingFrequency];

const CustomerPlanStatus = {
    ACTIVE: 1,
    DOWNGRADE_AT_END_OF_CYCLE: 2,
    FREE_TRIAL: 3,
    SWITCH_TO_ANNUAL_AT_END_OF_CYCLE: 4,
    SWITCH_TO_MONTHLY_AT_END_OF_CYCLE: 6,
} as const;
type CustomerPlanStatus = (typeof CustomerPlanStatus)[keyof typeof CustomerPlanStatus];

export function create_update_current_cycle_license_request(): void {
    $("#current-manual-license-count-update-button .billing-button-text").text("");
    $("#current-manual-license-count-update-button .loader").show();
    helpers.create_ajax_request(
        `/json${billing_base_url}/billing/plan`,
        "current-license-change",
        [],
        "PATCH",
        () => {
            window.location.replace(
                `${billing_base_url}/billing/?success_message=` +
                    encodeURIComponent(
                        "Updated number of licenses for the current billing period.",
                    ),
            );
            $("#current-manual-license-count-update-button .loader").hide();
            $("#current-manual-license-count-update-button .billing-button-text").text("Update");
        },
        () => {
            $("#current-manual-license-count-update-button .loader").hide();
            $("#current-manual-license-count-update-button .billing-button-text").text("Update");
        },
    );
}

export function create_update_next_cycle_license_request(): void {
    $("#next-manual-license-count-update-button .loader").show();
    $("#next-manual-license-count-update-button .billing-button-text").text("");
    helpers.create_ajax_request(
        `/json${billing_base_url}/billing/plan`,
        "next-license-change",
        [],
        "PATCH",
        () => {
            window.location.replace(
                `${billing_base_url}/billing/?success_message=` +
                    encodeURIComponent("Updated number of licenses for the next billing period."),
            );
            $("#next-manual-license-count-update-button .loader").hide();
            $("#next-manual-license-count-update-button .billing-button-text").text("Update");
        },
        () => {
            $("#next-manual-license-count-update-button .loader").hide();
            $("#next-manual-license-count-update-button .billing-button-text").text("Update");
        },
    );
}

function remove_unused_get_parameters(): void {
    // Remove `success_message` as get parameter from URL to avoid
    // it being displayed repeatedly on reloads.
    const url = new URL(window.location.href);
    url.searchParams.delete("success_message");
    window.history.replaceState(null, "", url.toString());
}

export function initialize(): void {
    remove_unused_get_parameters();

    $("#update-card-button").on("click", (e) => {
        $("#update-card-button .billing-button-text").text("");
        $("#update-card-button .loader").show();
        helpers.create_ajax_request(
            `/json${billing_base_url}/billing/session/start_card_update_session`,
            "cardchange",
            [],
            "POST",
            (response) => {
                const response_data = helpers.stripe_session_url_schema.parse(response);
                window.location.replace(response_data.stripe_session_url);
            },
            () => {
                $("#update-card-button .loader").hide();
                $("#update-card-button .billing-button-text").text("Update card");
            },
        );
        e.preventDefault();
    });

    function get_license_counts_for_current_cycle(): {
        new_current_manual_license_count: number;
        old_current_manual_license_count: number;
        min_current_manual_license_count: number;
    } {
        const new_current_manual_license_count: number = Number.parseInt(
            $<HTMLInputElement>("input#current-manual-license-count").val()!,
            10,
        );
        const old_current_manual_license_count: number = Number.parseInt(
            $<HTMLInputElement>("input#current-manual-license-count").attr("data-original-value")!,
            10,
        );
        let min_current_manual_license_count: number = Number.parseInt(
            $<HTMLInputElement>("input#current-manual-license-count").attr("min")!,
            10,
        );
        if (Number.isNaN(min_current_manual_license_count)) {
            // Customer is exempt from license number checks.
            min_current_manual_license_count = 0;
        }
        return {
            new_current_manual_license_count,
            old_current_manual_license_count,
            min_current_manual_license_count,
        };
    }

    function get_license_counts_for_next_cycle(): {
        new_next_manual_license_count: number;
        old_next_manual_license_count: number;
        min_next_manual_license_count: number;
    } {
        const new_next_manual_license_count: number = Number.parseInt(
            $<HTMLInputElement>("input#next-manual-license-count").val()!,
            10,
        );
        const old_next_manual_license_count: number = Number.parseInt(
            $<HTMLInputElement>("input#next-manual-license-count").attr("data-original-value")!,
            10,
        );
        let min_next_manual_license_count: number = Number.parseInt(
            $<HTMLInputElement>("input#next-manual-license-count").attr("min")!,
            10,
        );
        if (Number.isNaN(min_next_manual_license_count)) {
            // Customer is exempt from license number checks.
            min_next_manual_license_count = 0;
        }
        return {
            new_next_manual_license_count,
            old_next_manual_license_count,
            min_next_manual_license_count,
        };
    }

    function check_for_manual_billing_errors(): void {
        const {old_next_manual_license_count, min_next_manual_license_count} =
            get_license_counts_for_next_cycle();
        if (old_next_manual_license_count < min_next_manual_license_count) {
            $("#next-license-change-error").text(
                "Number of licenses for next billing period less than licenses in use.",
            );
        } else {
            $("#next-license-change-error").text("");
        }

        const {old_current_manual_license_count, min_current_manual_license_count} =
            get_license_counts_for_current_cycle();
        if (old_current_manual_license_count < min_current_manual_license_count) {
            $("#current-license-change-error").text(
                "Number of licenses for current billing period less than licenses in use.",
            );
        } else {
            $("#current-license-change-error").text("");
        }
    }

    $("#current-license-change-form, #next-license-change-form").on("submit", (e) => {
        // We don't want user to accidentally update the license count on pressing enter.
        e.preventDefault();
        e.stopPropagation();
    });

    $("#current-manual-license-count-update-button").on("click", (e) => {
        if (!helpers.is_valid_input($("#current-license-change-form"))) {
            return;
        }
        e.preventDefault();
        const {new_current_manual_license_count, old_current_manual_license_count} =
            get_license_counts_for_current_cycle();
        const $modal = $("#confirm-licenses-modal-increase");
        $modal.find(".new_license_count_holder").text(new_current_manual_license_count);
        $modal.find(".current_license_count_holder").text(old_current_manual_license_count);
        $modal
            .find(".difference_license_count_holder")
            .text(new_current_manual_license_count - old_current_manual_license_count);
        $modal.find(".dialog_submit_button").attr("data-cycle", "current");
        portico_modals.open("confirm-licenses-modal-increase");
    });

    $("#next-manual-license-count-update-button").on("click", (e) => {
        if (!helpers.is_valid_input($("#next-license-change-form"))) {
            return;
        }
        e.preventDefault();
        const {new_next_manual_license_count, old_next_manual_license_count} =
            get_license_counts_for_next_cycle();
        let $modal;
        if (new_next_manual_license_count > old_next_manual_license_count) {
            $modal = $("#confirm-licenses-modal-increase");
        } else {
            $modal = $("#confirm-licenses-modal-decrease");
        }

        $modal.find(".new_license_count_holder").text(new_next_manual_license_count);
        $modal.find(".current_license_count_holder").text(old_next_manual_license_count);
        $modal
            .find(".difference_license_count_holder")
            .text(new_next_manual_license_count - old_next_manual_license_count);
        $modal.find(".dialog_submit_button").attr("data-cycle", "next");
        portico_modals.open($modal.attr("id")!);
    });

    $("#cancel-complimentary-access-upgrade").on("click", (e) => {
        e.preventDefault();
        portico_modals.open("confirm-cancel-complimentary-access-upgrade-modal");
    });

    $("#confirm-cancel-complimentary-access-upgrade-modal .dialog_submit_button").on(
        "click",
        (e) => {
            helpers.create_ajax_request(
                `/json${billing_base_url}/billing/plan`,
                "planchange",
                [],
                "PATCH",
                () => {
                    window.location.replace(
                        `${billing_base_url}/upgrade/?success_message=` +
                            encodeURIComponent("Your plan is no longer scheduled for an upgrade."),
                    );
                },
            );
            e.preventDefault();
        },
    );

    $("#confirm-licenses-modal-increase, #confirm-licenses-modal-decrease").on(
        "click",
        ".dialog_submit_button",
        (e) => {
            portico_modals.close_active();
            const is_current_cycle = $(e.currentTarget).attr("data-cycle") === "current";

            if (is_current_cycle) {
                create_update_current_cycle_license_request();
            } else {
                create_update_next_cycle_license_request();
            }
        },
    );

    $(
        "#confirm-cancel-self-hosted-subscription-modal .dialog_submit_button, #confirm-cancel-cloud-subscription-modal .dialog_submit_button",
    ).on("click", (e) => {
        helpers.create_ajax_request(
            `/json${billing_base_url}/billing/plan`,
            "planchange",
            [],
            "PATCH",
            () => {
                window.location.replace(
                    `${billing_base_url}/billing/?success_message=` +
                        encodeURIComponent("Your plan has been canceled and will not renew."),
                );
            },
        );
        e.preventDefault();
    });

    $("#reactivate-subscription .reactivate-current-plan-button").on("click", (e) => {
        helpers.create_ajax_request(
            `/json${billing_base_url}/billing/plan`,
            "planchange",
            [],
            "PATCH",
            () => {
                window.location.replace(
                    `${billing_base_url}/billing/?success_message=` +
                        encodeURIComponent(
                            "Your plan has been reactivated and will renew automatically.",
                        ),
                );
            },
        );
        e.preventDefault();
    });

    $("#confirm-end-free-trial .dialog_submit_button").on("click", (e) => {
        helpers.create_ajax_request(
            `/json${billing_base_url}/billing/plan`,
            "planchange",
            [],
            "PATCH",
            () => {
                window.location.replace(
                    `${billing_base_url}/billing/?success_message=` +
                        encodeURIComponent(
                            "Your plan will be canceled at the end of the trial. Your card will not be charged.",
                        ),
                );
            },
        );
        e.preventDefault();
    });

    $("#cancel-subscription .cancel-current-cloud-plan-button").on("click", (e) => {
        e.preventDefault();
        portico_modals.open("confirm-cancel-cloud-subscription-modal");
    });

    $("#cancel-subscription .cancel-current-self-hosted-plan-button").on("click", (e) => {
        e.preventDefault();
        portico_modals.open("confirm-cancel-self-hosted-subscription-modal");
    });

    $("#end-free-trial .end-free-trial-button").on("click", (e) => {
        e.preventDefault();
        portico_modals.open("confirm-end-free-trial");
    });

    let timeout: ReturnType<typeof setTimeout> | null = null;

    check_for_manual_billing_errors();

    $("#current-manual-license-count").on("keyup", () => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            const {
                new_current_manual_license_count,
                old_current_manual_license_count,
                min_current_manual_license_count,
            } = get_license_counts_for_current_cycle();
            if (
                new_current_manual_license_count > old_current_manual_license_count &&
                new_current_manual_license_count > min_current_manual_license_count
            ) {
                $("#current-manual-license-count-update-button").toggleClass("hide", false);
                $("#current-license-change-error").text("");
            } else if (new_current_manual_license_count < old_current_manual_license_count) {
                $("#current-license-change-error").text(
                    "You can only increase the number of licenses for the current billing period.",
                );
                $("#current-manual-license-count-update-button").toggleClass("hide", true);
            } else {
                $("#current-manual-license-count-update-button").toggleClass("hide", true);
                check_for_manual_billing_errors();
            }
        }, 300); // Wait for 300ms after the user stops typing
    });

    $("#next-manual-license-count").on("keyup", () => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            const {
                new_next_manual_license_count,
                old_next_manual_license_count,
                min_next_manual_license_count,
            } = get_license_counts_for_next_cycle();
            if (
                !new_next_manual_license_count ||
                new_next_manual_license_count < 0 ||
                new_next_manual_license_count === old_next_manual_license_count
            ) {
                $("#next-manual-license-count-update-button").toggleClass("hide", true);
                check_for_manual_billing_errors();
            } else if (new_next_manual_license_count < min_next_manual_license_count) {
                $("#next-manual-license-count-update-button").toggleClass("hide", true);
                $("#next-license-change-error").text(
                    "Cannot be less than the number of licenses currently in use.",
                );
            } else {
                $("#next-manual-license-count-update-button").toggleClass("hide", false);
                $("#next-license-change-error").text("");
            }
        }, 300); // Wait for 300ms after the user stops typing
    });

    $<HTMLSelectElement>("select.billing-frequency-select").on("change", function () {
        const $wrapper = $(".org-billing-frequency-wrapper");
        const switch_to_annual_eoc = $wrapper.attr("data-switch-to-annual-eoc") === "true";
        const switch_to_monthly_eoc = $wrapper.attr("data-switch-to-monthly-eoc") === "true";
        const free_trial = $wrapper.attr("data-free-trial") === "true";
        const downgrade_at_end_of_cycle = $wrapper.attr("data-downgrade-eoc") === "true";
        const current_billing_frequency = $wrapper.attr("data-current-billing-frequency");
        const billing_frequency_selected = billing_frequency_schema.parse(this.value);

        if (
            (switch_to_annual_eoc && billing_frequency_selected === "Monthly") ||
            (switch_to_monthly_eoc && billing_frequency_selected === "Annual")
        ) {
            $("#org-billing-frequency-confirm-button").toggleClass("hide", false);
            let new_status: CustomerPlanStatus = CustomerPlanStatus.ACTIVE;
            if (downgrade_at_end_of_cycle) {
                new_status = CustomerPlanStatus.DOWNGRADE_AT_END_OF_CYCLE;
            } else if (free_trial) {
                new_status = CustomerPlanStatus.FREE_TRIAL;
            }
            $("#org-billing-frequency-confirm-button").attr("data-status", new_status);
        } else if (current_billing_frequency !== billing_frequency_selected) {
            $("#org-billing-frequency-confirm-button").toggleClass("hide", false);
            let new_status: CustomerPlanStatus = free_trial
                ? CustomerPlanStatus.FREE_TRIAL
                : CustomerPlanStatus.SWITCH_TO_ANNUAL_AT_END_OF_CYCLE;
            let new_schedule: BillingFrequency = BillingFrequency.BILLING_SCHEDULE_ANNUAL;
            if (billing_frequency_selected === "Monthly") {
                new_status = free_trial
                    ? CustomerPlanStatus.FREE_TRIAL
                    : CustomerPlanStatus.SWITCH_TO_MONTHLY_AT_END_OF_CYCLE;
                new_schedule = BillingFrequency.BILLING_SCHEDULE_MONTHLY;
            }
            $("#org-billing-frequency-confirm-button").attr("data-status", new_status);
            if (free_trial) {
                // Only set schedule for free trial since it is a different process to update the frequency immediately.
                $("#org-billing-frequency-confirm-button").attr("data-schedule", new_schedule);
            }
        } else {
            $("#org-billing-frequency-confirm-button").toggleClass("hide", true);
        }
    });

    $("#org-billing-frequency-confirm-button").on("click", (e) => {
        const data = {
            status: $("#org-billing-frequency-confirm-button").attr("data-status"),
            schedule: $("#org-billing-frequency-confirm-button").attr("data-schedule"),
        };
        e.preventDefault();
        void $.ajax({
            type: "PATCH",
            url: `/json${billing_base_url}/billing/plan`,
            data,
            success() {
                window.location.replace(
                    `${billing_base_url}/billing/?success_message=` +
                        encodeURIComponent("Billing frequency has been updated."),
                );
            },
            error(xhr) {
                const parsed = z.object({msg: z.string()}).safeParse(xhr.responseJSON);
                if (parsed.success) {
                    $("#org-billing-frequency-change-error").text(parsed.data.msg);
                }
            },
        });
    });

    $(".toggle-license-management").on("click", (e) => {
        e.preventDefault();
        portico_modals.open("confirm-toggle-license-management-modal");
    });

    $("#confirm-toggle-license-management-modal").on("click", ".dialog_submit_button", (e) => {
        helpers.create_ajax_request(
            `/json${billing_base_url}/billing/plan`,
            "toggle-license-management",
            [],
            "PATCH",
            () => {
                window.location.replace(`${billing_base_url}/billing/`);
            },
        );
        e.preventDefault();
    });
}

$(() => {
    initialize();
});
```

--------------------------------------------------------------------------------

---[FILE: deactivate_server.ts]---
Location: zulip-main/web/src/billing/deactivate_server.ts

```typescript
import $ from "jquery";

export function initialize(): void {
    $("#server-deactivate-form").validate({
        submitHandler(form) {
            $("#server-deactivate-form").find(".loader").css("display", "inline-block");
            $("#server-deactivate-button .server-deactivate-button-text").hide();

            form.submit();
        },
    });
}

$(() => {
    initialize();
});
```

--------------------------------------------------------------------------------

---[FILE: event_status.ts]---
Location: zulip-main/web/src/billing/event_status.ts
Signals: Zod

```typescript
import $ from "jquery";
import * as z from "zod/mini";

import * as loading from "../loading.ts";

import * as helpers from "./helpers.ts";

const billing_base_url = $("#data").attr("data-billing-base-url")!;

const stripe_response_schema = z.object({
    session: z.object({
        type: z.string(),
        status: z.string(),
        is_manual_license_management_upgrade_session: z.optional(z.boolean()),
        tier: z.optional(z.nullable(z.number())),
        event_handler: z.optional(
            z.object({
                status: z.string(),
                error: z.optional(
                    z.object({
                        message: z.string(),
                    }),
                ),
            }),
        ),
    }),
});

type StripeSession = z.infer<typeof stripe_response_schema>["session"];

function update_status_and_redirect(redirect_to: string): void {
    window.location.replace(redirect_to);
}

function show_error_message(message: string): void {
    $("#webhook-loading").hide();
    $("#webhook-error").show();
    $("#webhook-error").text(message);
}

function handle_session_complete_event(session: StripeSession): void {
    let redirect_to = "";
    switch (session.type) {
        case "card_update_from_billing_page":
            redirect_to = billing_base_url + "/billing/";
            break;
        case "card_update_from_upgrade_page":
            redirect_to = helpers.get_upgrade_page_url(
                session.is_manual_license_management_upgrade_session,
                session.tier!,
                billing_base_url,
            );
            break;
    }
    update_status_and_redirect(redirect_to);
}

async function stripe_checkout_session_status_check(stripe_session_id: string): Promise<boolean> {
    const response: unknown = await $.get(`/json${billing_base_url}/billing/event/status`, {
        stripe_session_id,
    });
    const response_data = stripe_response_schema.parse(response);

    if (response_data.session.status === "created") {
        return false;
    }
    if (response_data.session.event_handler!.status === "started") {
        return false;
    }
    if (response_data.session.event_handler!.status === "succeeded") {
        handle_session_complete_event(response_data.session);
        return true;
    }
    if (response_data.session.event_handler!.status === "failed") {
        show_error_message(response_data.session.event_handler!.error!.message);
        return true;
    }

    return false;
}

export async function stripe_invoice_status_check(stripe_invoice_id: string): Promise<boolean> {
    const response: unknown = await $.get(`/json${billing_base_url}/billing/event/status`, {
        stripe_invoice_id,
    });

    const response_schema = z.object({
        stripe_invoice: z.object({
            status: z.string(),
            event_handler: z.optional(
                z.object({
                    status: z.string(),
                    error: z.optional(
                        z.object({
                            message: z.string(),
                        }),
                    ),
                }),
            ),
        }),
    });
    const response_data = response_schema.parse(response);

    switch (response_data.stripe_invoice.status) {
        case "paid":
            if (response_data.stripe_invoice.event_handler!.status === "succeeded") {
                helpers.redirect_to_billing_with_successful_upgrade(billing_base_url);
                return true;
            }
            return false;
        default:
            return false;
    }
}

export async function check_status(): Promise<boolean> {
    if ($("#data").attr("data-stripe-session-id")) {
        return await stripe_checkout_session_status_check(
            $("#data").attr("data-stripe-session-id")!,
        );
    }
    return await stripe_invoice_status_check($("#data").attr("data-stripe-invoice-id")!);
}

async function start_status_polling(): Promise<void> {
    let completed = false;
    try {
        completed = await check_status();
    } catch {
        setTimeout(() => void start_status_polling(), 5000);
        return;
    }
    if (!completed) {
        setTimeout(() => void start_status_polling(), 5000);
    }
}

async function initialize(): Promise<void> {
    const form_loading = "#webhook-loading";
    const form_loading_indicator = "#webhook_loading_indicator";

    loading.make_indicator($(form_loading_indicator), {
        text: "Processing ...",
        abs_positioned: true,
    });
    $(form_loading).show();
    await start_status_polling();
}

$(() => {
    void initialize();
});
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: zulip-main/web/src/billing/helpers.ts
Signals: Zod

```typescript
import $ from "jquery";
import * as z from "zod/mini";

import * as loading from "../loading.ts";
import * as util from "../util.ts";

export type FormDataObject = Record<string, string>;

export const schedule_schema = z.enum(["monthly", "annual"]);
export type Prices = Record<z.infer<typeof schedule_schema>, number>;

export const organization_type_schema = z.enum([
    "opensource",
    "research",
    "nonprofit",
    "event",
    "education",
    "education_nonprofit",
]);
export type DiscountDetails = Record<z.infer<typeof organization_type_schema>, string>;

export const stripe_session_url_schema = z.object({
    stripe_session_url: z.string(),
});

const cloud_discount_details: DiscountDetails = {
    opensource: "Zulip Cloud Standard is free for open-source projects.",
    research: "Zulip Cloud Standard is free for academic research.",
    nonprofit: "Zulip Cloud Standard is discounted 85%+ for registered non-profits.",
    event: "Zulip Cloud Standard is free for academic conferences and most non-profit events.",
    education: "Zulip Cloud Standard is discounted 85% for education.",
    education_nonprofit:
        "Zulip Cloud Standard is discounted 90% for education non-profits with online purchase.",
};

const remote_discount_details: DiscountDetails = {
    opensource: "The Community plan is free for open-source projects.",
    research: "The Community plan is free for academic research.",
    nonprofit:
        "The Community plan is free for registered non-profits with up to 100 users. For larger organizations, paid plans are discounted by 85+%.",
    event: "The Community plan is free for academic conferences and most non-profit events.",
    education:
        "The Community plan is free for education organizations with up to 100 users. For larger organizations, paid plans are discounted by 85%.",
    education_nonprofit:
        "The Community plan is free for education non-profits with up to 100 users. For larger organizations, paid plans are discounted by 90% with online purchase.",
};

export function create_ajax_request(
    url: string,
    form_name: string,
    ignored_inputs: string[] = [],
    type = "POST",
    success_callback: (response: unknown) => void,
    error_callback: (xhr: JQuery.jqXHR) => void = () => {
        // Ignore errors by default
    },
): void {
    const $form = $(`#${CSS.escape(form_name)}-form`);
    const form_loading_indicator = `#${CSS.escape(form_name)}_loading_indicator`;
    const form_input_section = `#${CSS.escape(form_name)}-input-section`;
    const form_success = `#${CSS.escape(form_name)}-success`;
    const form_error = `#${CSS.escape(form_name)}-error`;
    const form_loading = `#${CSS.escape(form_name)}-loading`;

    loading.make_indicator($(form_loading_indicator), {
        text: "Processing ...",
        abs_positioned: true,
    });
    $(form_input_section).hide();
    $(form_error).hide();
    $(form_loading).show();

    const data: FormDataObject = {};

    for (const item of $form.serializeArray()) {
        if (ignored_inputs.includes(item.name)) {
            continue;
        }
        data[item.name] = item.value;
    }

    void $.ajax({
        type,
        url,
        data,
        success(response: unknown) {
            $(form_loading).hide();
            $(form_error).hide();
            $(form_success).show();
            if (["autopay", "invoice"].includes(form_name)) {
                if ("pushState" in window.history) {
                    window.history.pushState(
                        "",
                        document.title,
                        window.location.pathname + window.location.search,
                    );
                } else {
                    window.location.hash = "";
                }
            }
            success_callback(response);
        },
        error(xhr) {
            $(form_loading).hide();
            const parsed = z.object({msg: z.string()}).safeParse(xhr.responseJSON);
            if (parsed.success) {
                $(form_error).show().text(parsed.data.msg);
            }
            $(form_input_section).show();
            error_callback(xhr);

            if (xhr.status === 401) {
                // User session timed out, we need to login again.
                const parsed = z.object({login_url: z.string()}).safeParse(xhr.responseJSON);
                if (parsed.success) {
                    window.location.href = parsed.data.login_url;
                }
            }
        },
    });
}

// This function imitates the behavior of the format_money in views/billing_page.py
export function format_money(cents: number): string {
    // allow for small floating point errors
    cents = Math.ceil(cents - 0.001);
    let precision;
    if (cents % 100 === 0) {
        precision = 0;
    } else {
        precision = 2;
    }
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    }).format(Number.parseFloat((cents / 100).toFixed(precision)));
}

export function update_discount_details(
    organization_type: string,
    is_remotely_hosted: boolean,
): void {
    let discount_notice = is_remotely_hosted
        ? "Your organization may be eligible for a free Community plan, or a discounted Business plan."
        : "Your organization may be eligible for a discount on Zulip Cloud Standard. Organizations whose members are not employees are generally eligible.";

    try {
        const parsed_organization_type = organization_type_schema.parse(organization_type);
        discount_notice = is_remotely_hosted
            ? remote_discount_details[parsed_organization_type]
            : cloud_discount_details[parsed_organization_type];
    } catch {
        // This will likely fail if organization_type is not in organization_type_schema or
        // parsed_organization_type is not preset in discount_details. In either case, we will
        // fallback to the default discount_notice.
        //
        // Why use try / catch?
        // Because organization_type_schema.options.includes wants organization_type to be of type
        // opensource | research | ... and defining a type like that is not useful.
    }

    $("#sponsorship-discount-details").text(discount_notice);
}

export function is_valid_input($elem: JQuery<HTMLFormElement>): boolean {
    return util.the($elem).checkValidity();
}

export function redirect_to_billing_with_successful_upgrade(billing_base_url: string): void {
    window.location.replace(
        billing_base_url +
            "/billing/?success_message=" +
            encodeURIComponent("Your organization has been upgraded to PLAN_NAME."),
    );
}

export function get_upgrade_page_url(
    is_manual_license_management_upgrade_session: boolean | undefined,
    tier: number,
    billing_base_url: string,
): string {
    const base_url = billing_base_url + "/upgrade/";
    let params = `tier=${String(tier)}`;
    if (is_manual_license_management_upgrade_session !== undefined) {
        params += `&manual_license_management=${String(
            is_manual_license_management_upgrade_session,
        )}`;
    }
    return base_url + "?" + params;
}
```

--------------------------------------------------------------------------------

---[FILE: page_params.ts]---
Location: zulip-main/web/src/billing/page_params.ts

```typescript
import assert from "minimalistic-assert";

import {page_params as base_page_params} from "../base_page_params.ts";

assert(base_page_params.page_type === "upgrade");

// We need to export with a narrowed TypeScript type
// eslint-disable-next-line unicorn/prefer-export-from
export const page_params = base_page_params;
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_auth.ts]---
Location: zulip-main/web/src/billing/remote_billing_auth.ts

```typescript
import $ from "jquery";

function handle_submit_for_server_login_form(form: HTMLFormElement): void {
    // Get value of zulip_org_id.
    const zulip_org_id = $<HTMLInputElement>("input#zulip-org-id").val();
    const $error_field = $(".zulip_org_id-error");
    if (zulip_org_id === undefined) {
        // Already handled by `validate` plugin.
        return;
    }

    // Check if zulip_org_id is in UUID4 format.
    // https://melvingeorge.me/blog/check-if-string-valid-uuid-regex-javascript
    // Regex was modified by linter after copying from above link according to this rule:
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/better-regex.md
    const is_valid_uuid = /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi;
    // Check if zulip_org_id is in UUID4 format.
    if (!is_valid_uuid.test(zulip_org_id)) {
        $error_field.text(
            "Wrong zulip_org_id format. Check to make sure zulip_org_id and zulip_org_key are not swapped.",
        );
        $error_field.show();
        return;
    }
    $("#server-login-form").find(".loader").css("display", "inline-block");
    $("#server-login-button .server-login-button-text").hide();
    form.submit();
}

export function initialize(): void {
    $(
        "#server-login-form, #remote-billing-confirm-email-form, #remote-billing-confirm-login-form",
    ).validate({
        errorClass: "text-error",
        wrapper: "div",
        submitHandler(form) {
            if (form.id === "server-login-form") {
                handle_submit_for_server_login_form(form);
                return;
            }

            $("#server-login-form").find(".loader").css("display", "inline-block");
            $("#server-login-button .server-login-button-text").hide();
            $("#remote-billing-confirm-email-form").find(".loader").css("display", "inline-block");
            $("#remote-billing-confirm-email-button .server-login-button-text").hide();
            $("#remote-billing-confirm-login-form").find(".loader").css("display", "inline-block");
            $(
                "#remote-billing-confirm-login-button .remote-billing-confirm-login-button-text",
            ).hide();

            form.submit();
        },
        invalidHandler() {
            $("*[class$='-error']").hide();
        },
        showErrors(error_map) {
            $("*[class$='-error']").hide();
            for (const [key, error] of Object.entries(error_map)) {
                const $error_element = $(`.${CSS.escape(key)}-error`);
                $error_element.text(error);
                $error_element.show();
            }
        },
    });

    $<HTMLInputElement>("input#enable-major-release-emails").on("change", function () {
        if (this.checked) {
            $(this).val("true");
        }
        $(this).val("false");
    });

    $<HTMLInputElement>("input#enable-maintenance-release-emails").on("change", function () {
        if (this.checked) {
            $(this).val("true");
        }
        $(this).val("false");
    });
}

$(() => {
    initialize();
});
```

--------------------------------------------------------------------------------

````
