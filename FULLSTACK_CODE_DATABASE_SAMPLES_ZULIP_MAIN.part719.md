---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 719
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 719 of 1290)

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

---[FILE: sponsorship.ts]---
Location: zulip-main/web/src/billing/sponsorship.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import {the} from "../util.ts";

import * as helpers from "./helpers.ts";

const is_remotely_hosted = $("#sponsorship-form").attr("data-is-remotely-hosted") === "True";

function show_submit_loading_indicator(): void {
    $("#sponsorship-button .sponsorship-button-loader").css("display", "inline-block");
    $("#sponsorship-button").prop("disabled", true);
    $("#sponsorship-button .sponsorship-button-text").hide();
}

function hide_submit_loading_indicator(): void {
    $("#sponsorship-button .sponsorship-button-loader").css("display", "none");
    $("#sponsorship-button").prop("disabled", false);
    $("#sponsorship-button .sponsorship-button-text").show();
}

function validate_data(data: helpers.FormDataObject): boolean {
    let found_error = false;
    assert(data["description"] !== undefined);
    if (data["description"].trim() === "") {
        $("#sponsorship-description-error").text("Organization description cannot be blank.");
        hide_submit_loading_indicator();
        found_error = true;
    }

    assert(data["paid_users_count"] !== undefined);
    if (data["paid_users_count"].trim() === "") {
        $("#sponsorship-paid-users-count-error").text("Number of paid staff cannot be blank.");
        hide_submit_loading_indicator();
        found_error = true;
    }

    assert(data["expected_total_users"] !== undefined);
    if (data["expected_total_users"].trim() === "") {
        $("#sponsorship-expected-total-users-error").text(
            "Expected number of users cannot be blank.",
        );
        hide_submit_loading_indicator();
        found_error = true;
    }

    assert(data["plan_to_use_zulip"] !== undefined);
    if (data["plan_to_use_zulip"].trim() === "") {
        $("#sponsorship-plan-to-use-zulip-error").text(
            "Description of how you plan to use Zulip cannot be blank.",
        );
        hide_submit_loading_indicator();
        found_error = true;
    }
    return !found_error;
}

function create_ajax_request(): void {
    show_submit_loading_indicator();
    const $form = $("#sponsorship-form");
    const data: helpers.FormDataObject = {};

    for (const item of $form.serializeArray()) {
        data[item.name] = item.value;
    }

    // Clear any previous error messages.
    $(".sponsorship-field-error").text("");
    if (!validate_data(data)) {
        return;
    }

    const billing_base_url = $form.attr("data-billing-base-url") ?? "";
    void $.ajax({
        type: "post",
        url: `/json${billing_base_url}/billing/sponsorship`,
        data,
        success() {
            window.location.reload();
        },
        error(xhr) {
            hide_submit_loading_indicator();
            const parsed = z.object({msg: z.string()}).safeParse(xhr.responseJSON);
            if (parsed.success) {
                if (parsed.data.msg === "Enter a valid URL.") {
                    $("#sponsorship-org-website-error").text(parsed.data.msg);
                    return;
                }
                $("#sponsorship-error").show().text(parsed.data.msg);
            }
        },
    });
}

export function initialize(): void {
    if ($(".sponsorship-status-page").length > 0) {
        // Sponsorship form is not present on sponsorship status page.
        return;
    }

    $("#sponsorship-button").on("click", (e) => {
        if (!helpers.is_valid_input($("#sponsorship-form"))) {
            return;
        }
        e.preventDefault();
        create_ajax_request();
    });

    function update_discount_details(): void {
        const selected_org_type =
            the($<HTMLSelectElement>("select#organization-type")).selectedOptions[0]?.getAttribute(
                "data-string-value",
            ) ?? "";
        helpers.update_discount_details(selected_org_type, is_remotely_hosted);
    }

    update_discount_details();
    $<HTMLSelectElement>("select#organization-type").on("change", () => {
        update_discount_details();
    });
}

$(() => {
    // Don't preserve scroll position on reload. This allows us to
    // show the sponsorship pending message after user submits the
    // form otherwise the sponsorship pending message is partially
    // hidden due to browser preserving scroll position.
    // https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration
    if (window.history.scrollRestoration) {
        window.history.scrollRestoration = "manual";
    }

    initialize();
});
```

--------------------------------------------------------------------------------

---[FILE: upgrade.ts]---
Location: zulip-main/web/src/billing/upgrade.ts
Signals: Zod

```typescript
import $ from "jquery";
import * as z from "zod/mini";

import {localstorage} from "../localstorage.ts";
import * as portico_modals from "../portico/portico_modals.ts";

import * as helpers from "./helpers.ts";
import type {Prices} from "./helpers.ts";
import {page_params} from "./page_params.ts";

const prices: Prices = {
    annual: page_params.annual_price,
    monthly: page_params.monthly_price,
};

const ls = localstorage();
const ls_selected_schedule = ls.get("selected_schedule");
const ls_remote_server_plan_start_date = ls.get("remote_server_plan_start_date");
// The special value "billing_cycle_end_date" is used internally; it
// should not appear in the UI.
let remote_server_plan_start_date: string =
    typeof ls_remote_server_plan_start_date === "string"
        ? ls_remote_server_plan_start_date
        : "billing_cycle_end_date";

let selected_schedule: string =
    typeof ls_selected_schedule === "string" ? ls_selected_schedule : "monthly";
if ($("input[type=hidden][name=schedule]").length === 1) {
    // If we want to force a particular schedule, like "monthly" for free trials,
    // we need to override schedule from localstorage if it was set.
    selected_schedule = $<HTMLInputElement>("input[type=hidden][name=schedule]").val()!;
}
if (page_params.fixed_price !== null) {
    // By default, we show annual schedule (and price) for a fixed-price plan.
    selected_schedule = "annual";
}

let current_license_count = page_params.seat_count;

const upgrade_response_schema = z.object({
    // Returned if we charged the user and need to verify.
    stripe_invoice_id: z.optional(z.string()),
    // Returned if we directly upgraded the org (for free trial or invoice payments).
    organization_upgrade_successful: z.optional(z.boolean()),
});

function update_due_today(schedule: string): void {
    let num_months = 12;
    if (schedule === "monthly") {
        num_months = 1;
    }

    if (page_params.fixed_price !== null) {
        let due_today = page_params.fixed_price;
        if (schedule === "monthly") {
            due_today = page_params.fixed_price / 12;
        }
        $(".due-today-price").text(helpers.format_money(due_today));
        return;
    }

    $("#due-today .due-today-duration").text(num_months === 1 ? "1 month" : "12 months");
    const schedule_typed = helpers.schedule_schema.parse(schedule);
    const pre_flat_discount_price = prices[schedule_typed] * current_license_count;
    $("#pre-discount-renewal-cents").text(helpers.format_money(pre_flat_discount_price));
    const flat_discounted_months = Math.min(num_months, page_params.flat_discounted_months);
    const total_flat_discount = page_params.flat_discount * flat_discounted_months;
    const due_today = Math.max(0, pre_flat_discount_price - total_flat_discount);
    $(".flat-discounted-price").text(helpers.format_money(page_params.flat_discount));
    $(".due-today-price").text(helpers.format_money(due_today));

    const unit_price = prices[schedule_typed] / num_months;
    $("#due-today .due-today-unit-price").text(helpers.format_money(unit_price));
    $(".billing-page-discount").hide();
    if (schedule === "annual" && page_params.percent_off_annual_price) {
        $(".billing-page-selected-schedule-discount").text(page_params.percent_off_annual_price);
        $(".billing-page-discount").show();
    }

    if (schedule === "monthly" && page_params.percent_off_monthly_price) {
        $(".billing-page-selected-schedule-discount").text(page_params.percent_off_monthly_price);
        $(".billing-page-discount").show();
    }
}

function update_due_today_for_remote_server(start_date: string): void {
    const $due_today_for_future_update_wrapper = $("#due-today-for-future-update-wrapper");
    if ($due_today_for_future_update_wrapper.length === 0) {
        // Only present legacy remote server page.
        return;
    }
    if (start_date === "billing_cycle_end_date") {
        $due_today_for_future_update_wrapper.show();
        $("#due-today-title").hide();
        $("#due-today-remote-server-title").show();
        $("#org-future-upgrade-button-text-remote-server").show();
        $("#org-today-upgrade-button-text").hide();
    } else {
        $due_today_for_future_update_wrapper.hide();
        $("#due-today-title").show();
        $("#due-today-remote-server-title").hide();
        $("#org-future-upgrade-button-text-remote-server").hide();
        $("#org-today-upgrade-button-text").show();
    }
}

function update_license_count(license_count: number): void {
    $("#upgrade-licenses-change-error").text("");
    if (!license_count || license_count < page_params.seat_count) {
        $("#upgrade-licenses-change-error").text(
            `You must purchase licenses for all active users in your organization (minimum ${page_params.seat_count}).`,
        );
        return;
    }
    $("#due-today .due-today-license-count").text(license_count);
    const $user_plural = $("#due-today .due-today-license-count-user-plural");
    if (license_count === 1) {
        $user_plural.text("user");
    } else {
        $user_plural.text("users");
    }

    current_license_count = license_count;
    ls.set("manual_license_count", license_count);
    update_due_today(selected_schedule);
}

function restore_manual_license_count(): void {
    const $manual_license_count_input = $("#manual_license_count");
    // Only present on the manual license management page.
    if ($manual_license_count_input.length > 0) {
        const ls_manual_license_count = ls.get("manual_license_count");
        if (typeof ls_manual_license_count === "number") {
            $manual_license_count_input.val(ls_manual_license_count);
            update_license_count(ls_manual_license_count);
        }
    }
}

export const initialize = (): void => {
    restore_manual_license_count();

    $("#org-upgrade-button, #confirm-send-invoice-modal .dialog_submit_button").on("click", (e) => {
        e.preventDefault();

        if (page_params.setup_payment_by_invoice) {
            if ($(e.currentTarget).parents("#confirm-send-invoice-modal").length === 0) {
                // Open confirm send invoice model if not open.
                portico_modals.open("confirm-send-invoice-modal");
                return;
            }

            // Close modal so that we can show errors on the send invoice button.
            portico_modals.close_active();
        }

        // Clear the error box in case this is a repeat request.
        const $error_box = $("#autopay-error");
        $error_box.text("");
        $error_box.hide();

        $("#org-upgrade-button-text").hide();
        $("#org-upgrade-button .upgrade-button-loader").show();
        helpers.create_ajax_request(
            `/json${page_params.billing_base_url}/billing/upgrade`,
            "autopay",
            [],
            "POST",
            (response) => {
                if (page_params.setup_payment_by_invoice && !page_params.free_trial_days) {
                    window.location.replace(`${page_params.billing_base_url}/upgrade/`);
                    return;
                }

                const response_data = upgrade_response_schema.parse(response);
                if (response_data.stripe_invoice_id) {
                    window.location.replace(
                        `${page_params.billing_base_url}/billing/event_status/?stripe_invoice_id=${response_data.stripe_invoice_id}`,
                    );
                } else if (response_data.organization_upgrade_successful) {
                    helpers.redirect_to_billing_with_successful_upgrade(
                        page_params.billing_base_url,
                    );
                }
            },
            (xhr) => {
                $("#org-upgrade-button-text").show();
                $("#org-upgrade-button .upgrade-button-loader").hide();
                // Add a generic help text for card errors.
                if (
                    z
                        .object({error_description: z.literal("card error")})
                        .safeParse(xhr.responseJSON).success
                ) {
                    const error_text = $error_box.text();
                    $error_box.text(`${error_text} Please fix this issue or use a different card.`);
                }
            },
        );
    });

    update_due_today(selected_schedule);
    $("#payment-schedule-select").val(selected_schedule);
    $<HTMLSelectElement>("select#payment-schedule-select").on("change", function () {
        selected_schedule = this.value;
        ls.set("selected_schedule", selected_schedule);
        update_due_today(selected_schedule);
    });

    update_due_today_for_remote_server(remote_server_plan_start_date);
    $("#remote-server-plan-start-date-select").val(remote_server_plan_start_date);
    $<HTMLSelectElement>("select#remote-server-plan-start-date-select").on("change", function () {
        remote_server_plan_start_date = this.value;
        ls.set("remote_server_plan_start_date", remote_server_plan_start_date);
        update_due_today_for_remote_server(remote_server_plan_start_date);
    });

    $("#autopay_annual_price_per_month").text(
        `Pay annually ($${helpers.format_money(prices.annual / 12)}/user/month)`,
    );
    $("#autopay_monthly_price").text(
        `Pay monthly ($${helpers.format_money(prices.monthly)}/user/month)`,
    );

    $<HTMLInputElement>("input#manual_license_count").on("keyup", function () {
        const license_count = Number.parseInt(this.value, 10);
        update_license_count(license_count);
    });

    $("#upgrade-add-card-button").on("click", (e) => {
        e.preventDefault();
        if (e.currentTarget.classList.contains("update-billing-information-button")) {
            const redirect_url = `${page_params.billing_base_url}/customer_portal/?manual_license_management=true&tier=${page_params.tier}&setup_payment_by_invoice=true`;
            window.open(redirect_url, "_blank");
            return;
        }

        $("#upgrade-add-card-button #upgrade-add-card-button-text").hide();
        $("#upgrade-add-card-button .loader").show();
        helpers.create_ajax_request(
            `/json${page_params.billing_base_url}/upgrade/session/start_card_update_session`,
            "upgrade-cardchange",
            [],
            "POST",
            (response) => {
                const response_data = helpers.stripe_session_url_schema.parse(response);
                window.location.replace(response_data.stripe_session_url);
            },
            () => {
                $("#upgrade-add-card-button .loader").hide();
                $("#upgrade-add-card-button #upgrade-add-card-button-text").show();
            },
        );
    });
};

$(() => {
    initialize();
});
```

--------------------------------------------------------------------------------

---[FILE: app.ts]---
Location: zulip-main/web/src/bundles/app.ts

```typescript
import "./common.ts";

// Import third party jQuery plugins
import "jquery-caret-plugin/dist/jquery.caret";
import "../../third/jquery-idle/jquery.idle.js";
import "jquery-validation";

// Import app JS
import "../setup.ts";
import "../reload.ts";
import "../templates.ts";
import "../zulip_test.ts";
import "../inputs.ts";

// Import styles
import "tippy.js/dist/tippy.css";
// Adds color inheritance to the borders when using the default CSS Arrow.
// https://atomiks.github.io/tippyjs/v6/themes/#arrow-border
import "tippy.js/dist/border.css";
import "katex/dist/katex.css";
import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/plugins/confirmDate/confirmDate.css";
import "../../third/bootstrap/css/bootstrap.app.css";
import "../../third/bootstrap/css/bootstrap-btn.css";
import "../../styles/typeahead.css";
import "../../styles/app_variables.css";
import "../../styles/tooltips.css";
import "../../styles/buttons.css";
import "../../styles/inputs.css";
import "../../styles/banners.css";
import "../../styles/components.css";
import "../../styles/app_components.css";
import "../../styles/rendered_markdown.css";
import "../../styles/zulip.css";
import "../../styles/message_view_header.css";
import "../../styles/message_header.css";
import "../../styles/message_row.css";
import "../../styles/modal.css";
import "../../styles/settings.css";
import "../../styles/image_upload_widget.css";
import "../../styles/subscriptions.css";
import "../../styles/scheduled_messages.css";
import "../../styles/drafts.css";
import "../../styles/input_pill.css";
import "../../styles/informational_overlays.css";
import "../../styles/compose.css";
import "../../styles/message_edit_history.css";
import "../../styles/reactions.css";
import "../../styles/search.css";
import "../../styles/user_circles.css";
import "../../styles/left_sidebar.css";
import "../../styles/right_sidebar.css";
import "../../styles/lightbox.css";
import "../../styles/popovers.css";
import "../../styles/recent_view.css";
import "../../styles/typing_notifications.css";
import "../../styles/dark_theme.css";
import "../../styles/user_status.css";
import "../../styles/widgets.css";
import "../../styles/print.css";
import "../../styles/inbox.css";
import "../../styles/color_picker.css";
import "@uppy/core/css/style.min.css";
import "@uppy/image-editor/css/style.min.css";

// This should be last.
import "../ui_init.js";
```

--------------------------------------------------------------------------------

---[FILE: common.ts]---
Location: zulip-main/web/src/bundles/common.ts

```typescript
import "../sentry.ts";
import "../../debug-require.cjs";
import "../csrf.ts";
import "../blueslip.ts";
import "simplebar/dist/simplebar.css";
import "font-awesome/css/font-awesome.css";
import "../../icons/zulip-icons.font.cjs";
import "source-sans/source-sans-3VF.css";
import "source-code-pro/source-code-pro.css";
import "@fontsource-variable/open-sans";
import "../../styles/alerts.css";
import "../../styles/blueslip.css";
import "../../styles/modal.css";
import "../../styles/progress_bar.css";
import "../../styles/pygments.css";
```

--------------------------------------------------------------------------------

---[FILE: hello.ts]---
Location: zulip-main/web/src/bundles/hello.ts

```typescript
// TODO: Use `common.ts` directly in hello page when `bootstrap` is
// removed from it.

import "source-sans/source-sans-3VF.css";
import "source-code-pro/source-code-pro.css";
import "@fontsource-variable/open-sans";
import "../portico/google-analytics.ts";
```

--------------------------------------------------------------------------------

---[FILE: legacy_portico_bundle.ts]---
Location: zulip-main/web/src/bundles/legacy_portico_bundle.ts

```typescript
import "./common.ts";
import "../portico/header.ts";
import "../portico/google-analytics.ts";
import "../portico/portico_modals.ts";
import "../portico/tippyjs.ts";
import "../../third/bootstrap/css/bootstrap.portico.css";
import "../../styles/portico/legacy_portico_styles_bundle.css";
import "tippy.js/dist/tippy.css";
```

--------------------------------------------------------------------------------

---[FILE: marketing_page_bundle.ts]---
Location: zulip-main/web/src/bundles/marketing_page_bundle.ts

```typescript
import "./common.ts";
import "../portico/header.ts";
import "../portico/google-analytics.ts";
// These are select stylesheets loaded in legacy areas
// by the legacy_portico_styles_bundle.css file
import "../../styles/portico/markdown.css";
import "../../styles/portico/navbar.css";
import "../../styles/portico/footer.css";
```

--------------------------------------------------------------------------------

---[FILE: showroom.ts]---
Location: zulip-main/web/src/bundles/showroom.ts

```typescript
import "./legacy_portico_bundle.ts";
import "../templates.ts";
import "../inputs.ts";
import "../portico/showroom.ts";

// Import styles in the required order
import "../../styles/portico/showroom.css";
import "../../styles/app_variables.css";
import "../../styles/buttons.css";
import "../../styles/inputs.css";
import "../../styles/banners.css";
import "../../styles/app_components.css";
```

--------------------------------------------------------------------------------

---[FILE: communities.ts]---
Location: zulip-main/web/src/portico/communities.ts

```typescript
import $ from "jquery";

function sync_open_organizations_page_with_current_hash(): void {
    const hash = window.location.hash;
    if (!hash || hash === "#all" || hash === "#undefined") {
        $(".eligible_realm").show();
        $(".realm-category").removeClass("selected");
        $(`[data-category="all"]`).addClass("selected");
    } else {
        $(".eligible_realm").hide();
        $(`.eligible_realm[data-org-type="${CSS.escape(hash.slice(1))}"]`).show();
        $(".realm-category").removeClass("selected");
        $(`[data-category="${CSS.escape(hash.slice(1))}"]`).addClass("selected");
    }
}

function toggle_categories_dropdown(): void {
    const $dropdown_list = $(".integration-categories-dropdown .dropdown-list");
    $dropdown_list.slideToggle(250);
}

// init
$(() => {
    sync_open_organizations_page_with_current_hash();
    $(window).on("hashchange", () => {
        sync_open_organizations_page_with_current_hash();
    });

    $(".integration-categories-dropdown .integration-toggle-categories-dropdown").on(
        "click",
        () => {
            toggle_categories_dropdown();
        },
    );
});
```

--------------------------------------------------------------------------------

---[FILE: desktop-login.ts]---
Location: zulip-main/web/src/portico/desktop-login.ts

```typescript
import {electron_bridge} from "../electron_bridge.ts";

document.querySelector<HTMLFormElement>("form#form")!.addEventListener("submit", () => {
    document.querySelector<HTMLParagraphElement>("p#bad-token")!.hidden = false;
});
document.querySelector<HTMLInputElement>("input#token")!.focus();

async function decrypt_manual(): Promise<{key: Uint8Array; pasted: Promise<string>}> {
    const key = await crypto.subtle.generateKey({name: "AES-GCM", length: 256}, true, ["decrypt"]);
    return {
        key: new Uint8Array(await crypto.subtle.exportKey("raw", key)),
        pasted: new Promise((resolve) => {
            const tokenElement = document.querySelector<HTMLInputElement>("input#token")!;
            tokenElement.addEventListener("input", () => {
                void (async () => {
                    document.querySelector<HTMLParagraphElement>("p#bad-token")!.hidden = true;
                    document.querySelector<HTMLButtonElement>("button#submit")!.disabled =
                        tokenElement.value === "";
                    try {
                        const data = new Uint8Array(
                            tokenElement.value.match(/../g)?.map((b) => Number.parseInt(b, 16)) ??
                                [],
                        );
                        const iv = data.slice(0, 12);
                        const ciphertext = data.slice(12);
                        const plaintext = await crypto.subtle.decrypt(
                            {name: "AES-GCM", iv},
                            key,
                            ciphertext,
                        );
                        resolve(new TextDecoder().decode(plaintext));
                    } catch {
                        // Ignore all parsing and decryption failures.
                    }
                })();
            });
        }),
    };
}

void (async () => {
    // Sufficiently new versions of the desktop app provide the
    // electron_bridge.decrypt_clipboard API, which returns AES-GCM encryption
    // key and a promise; as soon as something encrypted to that key is copied
    // to the clipboard, the app decrypts it and resolves the promise to the
    // plaintext.  This lets us skip the manual paste step.
    const {key, pasted} = electron_bridge?.decrypt_clipboard
        ? electron_bridge.decrypt_clipboard(1)
        : await decrypt_manual();

    const keyHex = [...key].map((b) => b.toString(16).padStart(2, "0")).join("");
    window.open(
        (window.location.search ? window.location.search + "&" : "?") +
            "desktop_flow_otp=" +
            encodeURIComponent(keyHex),
        "_blank",
    );

    const token = await pasted;
    document.querySelector<HTMLFormElement>("form#form")!.hidden = true;
    document.querySelector<HTMLParagraphElement>("p#done")!.hidden = false;
    window.location.href = "/accounts/login/subdomain/" + encodeURIComponent(token);
})();
```

--------------------------------------------------------------------------------

---[FILE: desktop-redirect.ts]---
Location: zulip-main/web/src/portico/desktop-redirect.ts

```typescript
import ClipboardJS from "clipboard";

new ClipboardJS("#copy");
document.querySelector<HTMLElement>("#copy")!.focus();
```

--------------------------------------------------------------------------------

---[FILE: dev-login.ts]---
Location: zulip-main/web/src/portico/dev-login.ts

```typescript
import $ from "jquery";

$(() => {
    // This code will be executed when the user visits /login and
    // dev_login.html is rendered.
    if ($("[data-page-id='dev-login']").length > 0 && window.location.hash.startsWith("#")) {
        /* We append the window.location.hash to the input field with name next so that URL can be
            preserved after user is logged in. See this:
            https://stackoverflow.com/questions/5283395/url-hash-is-persisting-between-redirects */
        $("input[name='next']").each(function () {
            const new_value = $(this).attr("value")! + window.location.hash;
            $(this).attr("value", new_value);
        });
    }
});
```

--------------------------------------------------------------------------------

---[FILE: email_log.ts]---
Location: zulip-main/web/src/portico/email_log.ts

```typescript
import $ from "jquery";

import * as channel from "../channel.ts";

import * as portico_modals from "./portico_modals.ts";

$(() => {
    // This code will be executed when the user visits /emails in
    // development mode and email_log.html is rendered.
    $("#toggle").on("change", () => {
        if ($(".email-text").css("display") === "none") {
            $(".email-text").each(function () {
                $(this).css("display", "block");
            });
            $(".email-html").each(function () {
                $(this).css("display", "none");
            });
        } else {
            $(".email-text").each(function () {
                $(this).css("display", "none");
            });
            $(".email-html").each(function () {
                $(this).css("display", "block");
            });
        }
    });
    $("input[type=radio][name=forward]").on("change", function () {
        if ($(this).val() === "enabled") {
            $("#forward_address_sections").show();
        } else {
            $("#forward_address_sections").hide();
        }
    });
    $("#forward_email_modal .dialog_submit_button").on("click", () => {
        const address =
            $("input[name=forward]:checked").val() === "enabled" ? $("#address").val() : "";
        const csrf_token = $('input[name="csrfmiddlewaretoken"]').attr("value");
        const data = {forward_address: address, csrfmiddlewaretoken: csrf_token};

        void channel.post({
            url: "/emails/",
            data,
            success() {
                $("#smtp_form_status").show();
                setTimeout(() => {
                    $("#smtp_form_status").hide();
                }, 3000);
            },
        });
    });
    $(".open-forward-email-modal").on("click", (e) => {
        e.preventDefault();
        portico_modals.open("forward_email_modal");
    });
});
```

--------------------------------------------------------------------------------

---[FILE: ga-gtag.d.ts]---
Location: zulip-main/web/src/portico/ga-gtag.d.ts

```typescript
/// <reference types="gtag.js" />

/* global Gtag */

/** * npm module name: "ga-gtag"
 * version:  "1.2.0"
 */

declare module "ga-gtag" {
    export type ConfigParams = Gtag.GtagCommands["config"][1];

    // Type reference: https://github.com/idmadj/ga-gtag/blob/eb7a97d153cbfedbc81344fd59123f737b8a5cb8/src/index.js
    export const install: (trackingId: string, additionalConfigInfo?: ConfigParams) => void;

    export const gtag: Gtag.Gtag;
}
```

--------------------------------------------------------------------------------

---[FILE: google-analytics.ts]---
Location: zulip-main/web/src/portico/google-analytics.ts

```typescript
import {gtag, install} from "ga-gtag";
import type {ConfigParams} from "ga-gtag";

import {page_params} from "../base_page_params.ts";

export let config: (info: ConfigParams) => void;

if (page_params.google_analytics_id !== undefined) {
    install(page_params.google_analytics_id);
    config = (info) => {
        gtag("config", page_params.google_analytics_id!, info);
    };
} else {
    config = () => {
        // No Google Analytics tracking configured.
    };
}
```

--------------------------------------------------------------------------------

---[FILE: header.ts]---
Location: zulip-main/web/src/portico/header.ts

```typescript
import $ from "jquery";

const EXTRA_SUBMENU_BOTTOM_PADDING = 16;

$(() => {
    function on_tab_menu_selection_change(changed_element?: HTMLElement): void {
        // Pass event to open menu and if it is undefined, we close the menu.
        if (!changed_element) {
            $("#top-menu-submenu-backdrop").css("height", "0px");
            return;
        }
        const el = changed_element.parentElement!.querySelector<HTMLElement>(".top-menu-submenu");
        if (el) {
            $("#top-menu-submenu-backdrop").css(
                "height",
                el.offsetHeight + EXTRA_SUBMENU_BOTTOM_PADDING,
            );
        } else {
            $("#top-menu-submenu-backdrop").css("height", 0);
        }
    }

    function on_top_menu_tab_unselect_click(): void {
        // Close the menu.
        $("#top-menu-tab-close").prop("checked", true);
        on_tab_menu_selection_change();
    }

    function update_submenu_height_if_visible(): void {
        if ($(".top-menu-tab-input:checked").length === 1) {
            const sub_menu_height =
                $(".top-menu-tab-input:checked ~ .top-menu-submenu").height() ?? 0;
            $("#top-menu-submenu-backdrop").css(
                "height",
                sub_menu_height + EXTRA_SUBMENU_BOTTOM_PADDING,
            );
        }
    }

    // In case user presses `back` with menu open.
    // See https://github.com/zulip/zulip/pull/24301#issuecomment-1418547337.
    update_submenu_height_if_visible();

    // Update the height again if window is resized.
    $(window).on("resize", () => {
        update_submenu_height_if_visible();
    });

    // Close navbar if already open when user clicks outside the navbar.
    $("body").on("click", (e) => {
        const is_navbar_expanded = $(".top-menu-tab-input:checked").length === 1;
        const is_click_outside_navbar = $(".top-menu").find(e.target).length === 0;
        if (is_navbar_expanded && is_click_outside_navbar) {
            on_top_menu_tab_unselect_click();
        }
    });

    $(".logout_button").on("click", () => {
        $("#logout_form").trigger("submit");
    });

    $(".top-menu-tab-input").on("click", function () {
        on_tab_menu_selection_change(this);
    });

    $(".top-menu-tab-unselect").on("click", () => {
        on_top_menu_tab_unselect_click();
    });

    $("#top-menu-tab-close").on("change", () => {
        on_tab_menu_selection_change();
    });

    // Helps make the keyboard navigation work.
    $("body").on("keydown", ".nav-menu-label, .top-menu-tab-label-unselect", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            const labelID = $(e.currentTarget).attr("for");
            if (labelID === undefined) {
                throw new Error("Current target of this event must have for attribute defined.");
            }
            $(`#${CSS.escape(labelID)}`).trigger("click");
        }
    });

    /* Used by navbar of non-corporate URLs. */
    $(".portico-header li.logout").on("click", () => {
        $("#logout_form").trigger("submit");
        return false;
    });

    $(".portico-header .portico-header-dropdown").on("click", (e) => {
        const $user_dropdown = $(e.target).closest(".portico-header-dropdown");
        const dropdown_is_shown = $user_dropdown.hasClass("show");

        if (!dropdown_is_shown) {
            $user_dropdown.addClass("show");
        } else if (dropdown_is_shown) {
            $user_dropdown.removeClass("show");
        }
    });
});
```

--------------------------------------------------------------------------------

---[FILE: hello.ts]---
Location: zulip-main/web/src/portico/hello.ts

```typescript
import assert from "minimalistic-assert";

function get_new_rand(old_random_int: number, max: number): number {
    assert(max >= 2);
    const random_int = Math.floor(Math.random() * max);
    return random_int === old_random_int ? get_new_rand(random_int, max) : random_int;
}

function get_random_item_from_array<T>(array: T[]): T {
    assert(array.length > 0);
    return array[Math.floor(Math.random() * array.length)]!;
}

const current_client_logo_class_names = new Set([
    "client-logos-div client-logos__logo_akamai",
    "client-logos-div client-logos__logo_linux_foundation",
    "client-logos-div client-logos__logo_tum",
    "client-logos-div client-logos__logo_wikimedia",
    "client-logos-div client-logos__logo_rust",
    "client-logos-div client-logos__logo_dr_on_demand",
]);
const future_client_logo_class_names = new Set([
    "client-logos-div client-logos__logo_pilot",
    "client-logos-div client-logos__logo_recurse",
    "client-logos-div client-logos__logo_maria",

    "client-logos-div client-logos__logo_layershift",
    "client-logos-div client-logos__logo_julia",
    "client-logos-div client-logos__logo_ucsd",
    "client-logos-div client-logos__logo_lean",
    "client-logos-div client-logos__logo_asciidoc",
]);
let current_client_logo_class_names_index = 0;
function update_client_logo(): void {
    if (document.hidden) {
        return;
    }
    const client_logos = [
        ...document.querySelectorAll("[class^='client-logos-div client-logos__']"),
    ];
    current_client_logo_class_names_index = get_new_rand(
        current_client_logo_class_names_index,
        client_logos.length,
    );
    const client_logo_elt = client_logos[current_client_logo_class_names_index]!;

    const current_logo_class = client_logo_elt.className;
    current_client_logo_class_names.delete(current_logo_class);

    const next_logo_class = get_random_item_from_array([
        ...future_client_logo_class_names.values(),
    ]);
    future_client_logo_class_names.delete(next_logo_class);
    client_logo_elt.className = next_logo_class;
    current_client_logo_class_names.add(next_logo_class);
    future_client_logo_class_names.add(current_logo_class);
}

setInterval(update_client_logo, 2500);
```

--------------------------------------------------------------------------------

---[FILE: help.ts]---
Location: zulip-main/web/src/portico/help.ts

```typescript
import ClipboardJS from "clipboard";
import $ from "jquery";
import assert from "minimalistic-assert";
import SimpleBar from "simplebar";
import * as tippy from "tippy.js";

import zulip_copy_icon from "../../templates/zulip_copy_icon.hbs";
import * as common from "../common.ts";
import {show_copied_confirmation} from "../copied_tooltip.ts";
import * as util from "../util.ts";

function register_tabbed_section($tabbed_section: JQuery): void {
    const $li = $tabbed_section.find("ul.nav li");
    const $blocks = $tabbed_section.find(".blocks div");

    $li.on("click", function () {
        const tab_key = this.getAttribute("data-tab-key");

        $li.removeClass("active");
        $li.filter("[data-tab-key=" + tab_key + "]").addClass("active");

        $blocks.removeClass("active");
        $blocks.filter("[data-tab-key=" + tab_key + "]").addClass("active");
    });

    $li.on("keydown", (e) => {
        if (e.key === "Enter") {
            e.target.click();
        }
    });
}

// Display the copy-to-clipboard button inside the .codehilite element
// within the API and help center docs using clipboard.js
function add_copy_to_clipboard_element($codehilite: JQuery): void {
    const $copy_button = $("<span>").addClass("copy-button copy-codeblock");
    $copy_button.html(zulip_copy_icon());

    $($codehilite).append($copy_button);

    const clipboard = new ClipboardJS(util.the($copy_button), {
        text(copy_element) {
            // trim to remove trailing whitespace introduced
            // by additional elements inside <pre>
            return $(copy_element).siblings("pre").text().trim();
        },
    });

    // Show a tippy tooltip when the button is hovered
    tippy.default(util.the($copy_button), {
        content: "Copy code",
        trigger: "mouseenter",
        placement: "top",
    });

    // Show "Copied!" tooltip when code is successfully copied
    clipboard.on("success", (e) => {
        assert(e.trigger instanceof HTMLElement);
        show_copied_confirmation(e.trigger, {
            show_check_icon: true,
        });
    });
}

function render_tabbed_sections(): void {
    $(".tabbed-section").each(function () {
        register_tabbed_section($(this));
    });

    // Add a copy-to-clipboard button for each .codehilite element
    $(".markdown .codehilite").each(function () {
        add_copy_to_clipboard_element($(this));
    });

    common.adjust_mac_kbd_tags(".markdown kbd");

    $("table").each(function () {
        $(this).addClass("table table-striped");
    });
}

if ($(".sidebar").length > 0) {
    new SimpleBar(util.the($(".sidebar")), {tabIndex: -1});
}

// Scroll to anchor link when clicked. Note that landing-page.js has a
// similar function; this file and landing-page.js are never included
// on the same page.
$(document).on(
    "click",
    ".markdown .content h1, .markdown .content h2, .markdown .content h3",
    function () {
        window.location.hash = $(this).attr("id")!;
    },
);

$(".hamburger").on("click", () => {
    $(".sidebar").toggleClass("show");
    $(".sidebar .simplebar-content-wrapper").css("overflow", "hidden scroll");
    $(".sidebar .simplebar-vertical").css("visibility", "visible");
});

$(".markdown").on("click", () => {
    if ($(".sidebar.show").length > 0) {
        $(".sidebar.show").toggleClass("show");
    }
});

render_tabbed_sections();

if ($(window).width()! > 800) {
    $(".highlighted").eq(0).trigger("focus");
    $(".highlighted")
        .eq(0)
        .on("keydown", (e) => {
            if (e.key === "Tab" && !e.shiftKey && !$("#skip-navigation").hasClass("tabbed")) {
                e.preventDefault();
                $("#skip-navigation").trigger("focus");
            }
        });
    $("#skip-navigation").on("keydown", function (e) {
        if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            $(".highlighted").eq(0).trigger("focus");
            $(this).addClass("tabbed");
        }
    });
}
```

--------------------------------------------------------------------------------

````
