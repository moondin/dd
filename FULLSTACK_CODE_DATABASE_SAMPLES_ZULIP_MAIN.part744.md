---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 744
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 744 of 1290)

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

---[FILE: activity.css]---
Location: zulip-main/web/styles/portico/activity.css

```text
.activity-page {
    margin: 10px;
}

.activity-head {
    background-color: hsl(208deg 100% 97%);
    position: sticky;
    top: 0;

    & th {
        border-bottom: 1px solid hsl(0deg 0% 87%);
    }
}

.activity-foot {
    background-color: hsl(208deg 100% 97%);
    font-weight: 700;
    position: sticky;
    bottom: 0;
}

.table-striped {
    & tr.recently_active {
        & td {
            background-color: hsl(120deg 97% 83%);
        }

        &:nth-child(odd) td {
            background-color: hsl(120deg 70% 76%);
        }
    }
}

.summary-table,
.analytics-table {
    border: 1px solid hsl(0deg 0% 87%);
    border-collapse: separate;
    border-left: 0;
    border-radius: 4px;
    border-spacing: 0;
    margin: 0 10px;

    & th,
    td {
        border-left: 1px solid hsl(0deg 0% 87%);
        text-align: left;

        &.number {
            text-align: right;
        }
    }

    th {
        vertical-align: bottom;
        padding: 8px;
    }

    td {
        border-top: 1px solid hsl(0deg 0% 87%);
        white-space: nowrap;
        padding: 2px 8px;
        max-width: 320px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    tbody > tr:nth-child(odd) > td {
        background-color: hsl(0deg 0% 98%);
    }

    tbody tr:first-child td {
        border-top: 0;
    }

    thead tr:first-child > th:first-child {
        border-top-left-radius: 4px;
    }

    thead tr:first-child > th:last-child {
        border-top-right-radius: 4px;
    }

    tbody tr:last-child > td:first-child {
        border-bottom-left-radius: 4px;
    }

    tbody tr:last-child > td:last-child {
        border-bottom-right-radius: 4px;
    }

    thead tr:first-child th {
        border-top: 0;
    }
}

tr.admin td:first-child {
    font-weight: bold;
    color: hsl(240deg 100% 50%);
    font-size: 110%;
}

.good {
    font-weight: bold;
    color: hsl(120deg 100% 33%);
}

.bad {
    font-weight: bold;
    color: hsl(0deg 100% 39%);
}

.support-query-result,
.remote-support-query-result {
    background-color: hsl(60deg 12% 94%);
    padding: 10px;
    border-radius: 7px;
    box-shadow: 0 10px 7px -6px hsl(0deg 2% 45%);
    margin-bottom: 10px;

    & select {
        height: 30px;
        width: 220px;
        padding: 0 6px;
        font-size: 14px;
        color: hsl(0deg 0% 33%);
        border-radius: 4px;
        border: 1px solid hsl(0deg 0% 80%);
        cursor: pointer;
        background-color: hsl(0deg 0% 100%);
        vertical-align: text-bottom;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

        &:focus {
            outline: 1px dotted hsl(0deg 0% 20%);
            outline: 5px auto -webkit-focus-ring-color;
            outline-offset: -2px;
        }
    }

    & input {
        width: 206px;
        padding: 4px 6px;
        border-radius: 4px;
        border: 1px solid hsl(0deg 0% 80%);
        color: hsl(0deg 0% 33%);
        vertical-align: text-bottom;
        transition:
            border-color linear 0.2s,
            box-shadow linear 0.2s;
        box-shadow: inset 0 1px 1px hsl(0deg 0% 0% / 7.5%);

        &:focus {
            border-color: hsl(206deg 80% 62% / 80%);
            outline: 0;
            box-shadow:
                inset 0 1px 1px hsl(0deg 0% 0% / 7.5%),
                0 0 8px hsl(206.494deg 80% 62% / 60%);
        }
    }

    .cloud-label,
    .deactivated-label,
    .remote-label {
        padding: 2px 8px;
        font-size: 0.9em;
        font-weight: bold;
        color: hsl(0deg 0% 100%);
        text-shadow: 0 -1px 0 hsl(0deg 0% 0% / 25%);
        border-radius: 3px;
    }

    .cloud-label {
        background-color: hsl(280deg 100% 40%);
    }

    .deactivated-label {
        background-color: hsl(2deg 64% 53%);
    }

    .remote-label {
        background-color: hsl(186deg 76% 36%);
    }

    .current-audit-log {
        color: hsl(123deg 46% 34%);
    }

    .current-plan-data-missing,
    .stale-audit-log {
        color: hsl(2deg 64% 53%);
    }
}

.reactivate-remote-server-button,
.deactivate-remote-server-button,
.delete-next-fixed-price-plan-button,
.approve-sponsorship-button,
.support-search-button,
.support-submit-button,
.delete-user-button,
.scrub-realm-button {
    padding: 6px 12px;
    display: inline-block;
    margin-bottom: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.4286;
    text-align: center;
    white-space: nowrap;
    vertical-align: text-bottom;
    cursor: pointer;
    user-select: none;
    background-image: none;

    &:hover,
    &:focus {
        text-decoration: none;
    }

    &:focus {
        outline: 5px auto -webkit-focus-ring-color;
        outline-offset: -2px;
    }

    &:active {
        background-image: none;
        outline: 0;
    }

    &[disabled] {
        pointer-events: none;
        cursor: not-allowed;
        opacity: 0.65;
    }
}

.support-search-form {
    margin: 10px;
}

.support-search-button {
    vertical-align: middle;
    margin: 10px;
}

.approve-sponsorship-button {
    vertical-align: middle;
    color: hsl(123deg 46% 34%);
    background-color: hsl(114deg 25% 85%);
    border: 1px solid hsl(123deg 46% 34%);
    border-radius: 2px;

    &:hover,
    &:focus,
    &:active {
        color: hsl(123deg 50% 30%);
        background-color: hsl(114deg 28% 82%);
        border: 1px solid hsl(123deg 50% 30%);
    }
}

.support-search-button,
.support-submit-button {
    color: hsl(0deg 0% 20%);
    background-color: hsl(0deg 0% 100%);
    border: 1px solid hsl(0deg 0% 83%);
    border-radius: 2px;

    &:hover,
    &:focus,
    &:active {
        color: hsl(0deg 0% 20%);
        background-color: hsl(0deg 0% 92%);
        border: 1px solid hsl(0deg 0% 68%);
    }
}

.deactivate-remote-server-button,
.delete-next-fixed-price-plan-button,
.delete-user-button,
.scrub-realm-button {
    color: hsl(0deg 0% 100%);
    background-color: hsl(2deg 64% 58%);
    border: 1px solid hsl(2deg 64% 53%);
    border-radius: 2px;

    &:hover,
    &:focus,
    &:active {
        color: hsl(0deg 0% 100%);
        background-color: hsl(2deg 65% 50%);
        border: 1px solid hsl(2deg 65% 41%);
    }
}

.reactivate-remote-server-button {
    color: hsl(0deg 0% 100%);
    background-color: hsl(35deg 70% 56%);
    border: 1px solid hsl(35deg 70% 50%);
    border-radius: 2px;

    &:hover,
    &:focus,
    &:active {
        color: hsl(0deg 0% 100%);
        background-color: hsl(35deg 82% 40%);
        border: 1px solid hsl(35deg 82% 30%);
    }
}

.reactivate-remote-server-button,
.deactivate-remote-server-button {
    font-size: 15px;
    line-height: 1.8;
    max-width: 550px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.remote-support-query-result.remote-server-deactivated {
    background-color: hsl(2deg 64% 58%);

    .remote-server-section {
        background-color: hsl(22deg 100% 92%);
    }

    .remote-realms-section {
        background-color: hsl(23deg 100% 95%);
    }
}

.delete-next-fixed-price-plan-form,
.delete-user-form {
    margin: 8px 0;
}

.installation-activity-header {
    text-align: center;
}

.support-section-header {
    font-size: 1.2em;
    font-weight: bold;
    line-height: 20px;
    margin: 0 0 8px;
}

.support-realm-icon {
    max-width: 25px;
    position: relative;
    vertical-align: middle;
    top: -2px;
}

.reactivate-remote-server-form,
.deactivate-remote-server-form,
.realm-support-information,
.remote-server-information,
.remote-realm-information,
.remote-sponsorship-details,
.support-form,
.next-plan-information,
.current-plan-information {
    margin-bottom: 10px;
}

.scrub-realm-form {
    padding-bottom: 10px;
}

.search-query.input-xxlarge {
    width: 530px;
    padding: 4px 14px;
    margin-bottom: 0;
    border-radius: 8px;
    border: 1px solid hsl(0deg 0% 80%);
    box-shadow: inset 0 1px 1px hsl(0deg 0% 0% / 7.5%);
    transition:
        border-color linear 0.2s,
        box-shadow linear 0.2s;
    color: hsl(0deg 0% 33%);

    &:focus {
        border-color: hsl(206deg 80% 62% / 80%);
        outline: 0;
        box-shadow:
            inset 0 1px 1px hsl(0deg 0% 0% / 7.5%),
            0 0 8px hsl(206.494deg 80% 62% / 60%);
    }
}

@media (width <= 767px) {
    .search-query.input-xxlarge {
        width: 100%;
    }
}

.remote-support-query-result {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(100px, auto);
    grid-template-areas: "server realms";
}

.remote-server-section {
    grid-area: server;
}

.remote-realms-section {
    grid-area: realms;
}

.user-support-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(100px, auto);
    grid-template-areas: "realm user";
}

.user-information-section {
    grid-area: user;
}

.user-realm-information-section {
    grid-area: realm;
}

.confirmation-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(100px, auto);
    grid-template-areas: "confirmation-realm confirmation";
}

.confirmation-information-section {
    grid-area: confirmation;
}

.confirmation-realm-section {
    grid-area: confirmation-realm;
}

.confirmation-information-section,
.confirmation-realm-section,
.user-information-section,
.user-realm-information-section,
.remote-realms-section,
.remote-server-section {
    border: 2px solid hsl(330deg 3% 40%);
    border-radius: 4px;
    padding: 10px;
}

.confirmation-realm-section,
.user-realm-information-section,
.remote-server-section {
    background-color: hsl(60deg 11% 86%);
}

.confirmation-information-section,
.user-information-section,
.remote-realms-section {
    background-color: hsl(60deg 12% 90%);
}

.remote-realm-container {
    padding-bottom: 25px;
}

.activity-header-information,
.push-notification-status,
.realm-management-actions,
.next-plan-container,
.current-plan-container,
.support-sponsorship-container {
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
}

.activity-header-information {
    border: 2px solid hsl(330deg 3% 40%);
    background-color: hsl(60deg 12% 90%);
    width: fit-content;
}

.activity-header-entry {
    margin: 0;
    padding: 2px 0;
}

.push-notification-status,
.realm-management-actions {
    border: 2px solid hsl(186deg 76% 36%);
    background-color: hsl(188deg 35% 87%);
}

.next-plan-container,
.current-plan-container,
.support-sponsorship-container {
    border: 2px solid hsl(33deg 99% 60%);
}

.support-sponsorship-container {
    background-color: hsl(30deg 100% 96%);
}

.next-plan-container {
    background-color: hsl(31deg 100% 91%);
}

.current-plan-container {
    background-color: hsl(31deg 100% 83%);
}

.discounted-price-form {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;

    .support-submit-button {
        margin-top: 5px;
    }
}

.container {
    width: 940px;
    margin-right: auto;
    margin-left: auto;

    @media (width <= 767px) {
        width: auto;
    }

    @media (767px < width <= 979px) {
        width: 724px;
    }

    @media (width >= 1180px) {
        width: 1170px;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: billing.css]---
Location: zulip-main/web/styles/portico/billing.css

```text
:root {
    --color-background-modal: hsl(0deg 0% 98%);
}

.billing-upgrade-page {
    font-family: "Source Sans 3 VF", sans-serif;
    background-color: hsl(0deg 0% 98%);
    height: 100vh;

    .page-content {
        padding: 100px 0 30px;
    }

    .main {
        width: 800px;
        max-width: 90%;
        margin: 0 auto;
    }

    & h1 {
        margin: 30px 0;
        font-weight: bold;
    }

    .nav {
        margin-bottom: 0;
    }

    .support-link {
        margin: 10px 20px;

        & a,
        a:hover,
        a:visited {
            color: hsl(170deg 47% 33%);
            font-weight: 400;
        }
    }

    .license-management,
    .payment-schedule {
        & label {
            display: inline-block;
        }

        & input[type="radio"] {
            display: none;

            &:checked {
                + .box {
                    background-color: hsl(153deg 32% 55%);
                    color: hsl(0deg 0% 100%);
                    border-color: hsl(152deg 33% 39%);
                }
            }
        }

        .box {
            width: 120px;
            height: 70px;
            background-color: hsl(0deg 0% 94%);
            transition: 0.2s ease;
            transition-property: background-color, border-color;
            display: inline-block;
            text-align: center;
            cursor: pointer;
            position: relative;
            border: 1px solid hsl(0deg 0% 91%);
            border-radius: 8px;
            margin: 0 10px 5px 0;
            padding: 30px 20px;
            vertical-align: top;

            &:hover {
                background-color: hsl(0deg 0% 91%);
                border-color: hsl(0deg 0% 80%);
            }

            .schedule-time {
                font-weight: bold;
                font-size: 1.2em;
                margin-top: 10px;
            }

            .schedule-amount {
                margin-top: 5px;
                font-size: 1.1em;
                height: 50px;
            }

            .schedule-amount-2 {
                font-size: 0.9em;
            }

            .management-type {
                font-weight: bold;
                font-size: 1.2em;
                margin-top: 10px;
            }

            .management-type-text {
                font-size: 1.1em;
                margin-top: 5px;
            }
        }
    }

    .stripe-button-el {
        padding: 11px 25px;
        font-weight: 400;
        color: hsl(0deg 0% 100%);
        background: linear-gradient(
            145deg,
            hsl(191deg 56% 55%),
            hsl(169deg 65% 42%)
        );
        box-shadow: 0 3px 10px hsl(0deg 0% 0% / 20%);
        border: 0;
        height: 40px;
        margin: 5px 0 0;

        & span {
            background: 0;
            box-shadow: none;
            font-family: "Source Sans 3 VF", sans-serif;
            line-height: 20px;
        }
    }

    .stripe-button-el:hover {
        background-color: hsl(169deg 65% 42%);
        box-shadow: 0 3px 10px hsl(0deg 0% 0% / 30%);
    }

    .stripe-button-el:active,
    .stripe-button-el:enabled:active {
        background-color: hsl(169deg 70% 32%);

        & span {
            background: 0;
            box-shadow: none;
        }
    }

    .stripe-button-el:disabled {
        & span {
            background: none;
        }
    }

    .stripe-button-el:hover:disabled {
        box-shadow: none;
        background-color: hsl(0deg 0% 78%);
        pointer-events: none;
    }

    .invoice-button {
        font-size: 19px;

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;

            &:hover {
                pointer-events: all;
            }
        }
    }

    .upgrade-button-container {
        display: inline-block;
    }

    #manual_license_count,
    #invoiced_licenses {
        width: 50px;
    }

    #licenses_at_next_renewal_input,
    #new_licenses_input {
        width: 206px;
    }

    #error-message-box {
        margin-top: 10px;
        font-weight: 600;
        display: none;
    }

    #restartsession-loading,
    #webhook-loading,
    #sponsorship-loading,
    #planchange-loading,
    #licensechange-loading,
    #cardchange-loading,
    #invoice-loading,
    #autopay-loading {
        display: none;
        min-height: 55px;
        text-align: center;
    }

    #restartsession-success,
    #webhook-success,
    #sponsorship-success,
    #planchange-success,
    #licensechange-success,
    #cardchange-success,
    #invoice-success,
    #autopay-success {
        text-align: center;
        display: none;
    }

    #restartsession-error,
    #webhook-error,
    #sponsorship-error,
    #planchange-error,
    #licensechange-error,
    #cardchange-error,
    #invoice-error,
    #autopay-error {
        text-align: center;
        display: none;
    }

    .zulip-loading-logo {
        margin: 0 auto;
        width: 30px;
        /* Adjusting height moves the loading spinner vertically.
           Manually adjusted to align spinner and z-logo. */
        height: 23px;
    }

    .zulip-loading-logo svg circle {
        fill: hsl(0deg 0% 27%);
        stroke: hsl(0deg 0% 27%);
    }

    .zulip-loading-logo svg path {
        fill: hsl(0deg 0% 100%);
        stroke: hsl(0deg 0% 100%);
    }

    #restartsession_loading_indicator,
    #webhook_loading_indicator,
    #sponsorship_loading_indicator,
    #planchange_loading_indicator,
    #licensechange_loading_indicator,
    #cardchange_loading_indicator,
    #invoice_loading_indicator,
    #autopay_loading_indicator {
        margin: 10px auto;
    }

    #restartsession_loading_indicator_box_container,
    #webhook_loading_indicator_box_container,
    #sponsorship_loading_indicator_box_container,
    #planchange_loading_indicator_box_container,
    #licensechange_loading_indicator_box_container,
    #cardchange_loading_indicator_box_container,
    #invoice_loading_indicator_box_container,
    #autopay_loading_indicator_box_container {
        position: absolute;
        left: 50%;
    }

    #restartsession_loading_indicator_box,
    #webhook_loading_indicator_box,
    #sponsorship_loading_indicator_box,
    #planchange_loading_indicator_box,
    #licensechange_loading_indicator_box,
    #cardchange_loading_indicator_box,
    #invoice_loading_indicator_box,
    #autopay_loading_indicator_box {
        position: relative;
        left: -50%;
        top: -41px;
        z-index: 10;
        border-radius: 6px;
    }

    #restartsession_loading_indicator .loading_indicator_text,
    #webhook_loading_indicator .loading_indicator_text,
    #sponsorship_loading_indicator .loading_indicator_text,
    #planchange_loading_indicator .loading_indicator_text,
    #licensechange_loading_indicator .loading_indicator_text,
    #cardchange_loading_indicator .loading_indicator_text,
    #invoice_loading_indicator .loading_indicator_text,
    #autopay_loading_indicator .loading_indicator_text {
        margin-left: -25px;
    }

    & select,
    input,
    textarea {
        font-family: inherit;
    }
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
}

input[name="licenses"] {
    appearance: textfield;
}

#confirm-licenses-modal .dialog_submit_button:active {
    /* This is needed to avoid button background changing
    when clicking on it due to "button:active" CSS in
    legacy_landing_page.css. */
    background-color: hsl(240deg 96% 68%);
}

#account-deactivated-success-page .white-box,
#server-deactivate-page .white-box,
#remote-billing-confirm-login-page .white-box,
#remote-billing-confirm-email .white-box,
#server-login-page .white-box,
#upgrade-page .white-box,
#billing-page .white-box,
.sponsorship-page .white-box {
    margin: 30px;
}

#account-deactivated-success-page #account-deactivated-success-page-details,
#server-deactivate-page #server-deactivate-details,
#server-login-page #server-login-page-details,
#upgrade-page #upgrade-page-details,
#billing-page #billing-page-details,
.sponsorship-page #sponsorship-form {
    margin: 0;
}

#sponsorship-discount-details {
    font-weight: normal;
    margin: 2px 14px;
    padding-top: 0;
    text-align: left;
    overflow-wrap: break-word;
    width: 450px;
}

@media (width < 600px) {
    #server-login-page,
    #billing-page,
    .sponsorship-page {
        transform: scale(0.8);
        margin: -50px;
    }

    .sponsorship-status-page {
        transform: scale(0.8);
        margin: -10px -50px -50px;
    }

    #upgrade-page {
        transform: scale(0.8);
        margin: -50px 0;
    }
}

@media (width < 460px) {
    #upgrade-page,
    #billing-page,
    .sponsorship-page {
        transform: scale(0.6);
        margin: -150px -100px;
    }

    #server-login-page,
    .sponsorship-status-page {
        transform: scale(0.6);
        margin: -50px -150px -100px;
    }

    #upgrade-page {
        transform: scale(0.6);
        margin: -150px 0;
    }
}

#billing-page .billing-status-page .pitch {
    width: 100%;
}

.billing-status-page {
    font-weight: 400;
}

.sponsorship-status-page .white-box {
    font-weight: 400;
    margin: 30px;
    padding: 0;
}

.billing-status-page p:last-child,
.sponsorship-status-page p:last-child {
    margin-bottom: 0;
}

.remote-billing-confirm-login-form-field-error,
.server-login-form-field-error,
.upgrade-page-error,
.sponsorship-field-error,
.billing-page-error,
.billing-page-success {
    text-align: left;
    margin-left: 2px;
    margin-top: 5px;
}

.header.portico-header {
    display: block;
}

#upgrade-page #upgrade-manual-license-count-wrapper,
#billing-page .input-box-number {
    text-align: left;
}

#account-deactivated-success-page .pitch,
#server-deactivate-details .pitch,
#remote-billing-confirm-login-page .pitch,
#server-login-page .pitch,
.sponsorship-page .pitch,
.sponsorship-status-page .pitch,
#upgrade-page .pitch,
#billing-page .pitch {
    width: 600px;
}

#billing-page .number-input-with-label {
    display: flex;
    align-items: flex-end;
}

#upgrade-page #manual_license_count,
#billing-page
    .white-box
    .input-box-number
    .number-input-with-label
    .short-width-number-input {
    width: 100px;
}

#billing-page .number-input-with-label .licence-count-in-use {
    padding-left: 10px;
    vertical-align: bottom;
    position: relative;
    bottom: 15px;
}

#billing-page #org-billing-frequency-confirm-button,
#billing-page .license-count-update-button {
    margin: 0 auto;
    font-size: 1.1rem;
    margin-right: 0;
    width: 100px;
}

#billing-page #org-billing-frequency-confirm-button.hide,
#billing-page .license-count-update-button.hide {
    display: none;
}

#billing-page #org-billing-frequency-confirm-button {
    margin: 0;
    display: block;
    position: absolute;
    top: 25px;
    right: 0;
}

#billing-page #current-license-change-form,
#billing-page #next-license-change-form {
    margin-bottom: 0;
}

.billing-page-success {
    display: none;
}

#billing-page-details .input-box.billing-page-field.plan-toggle-action,
#billing-page-details .input-box.billing-page-field.user-stripe-card-update {
    margin-top: 10px;
    text-align: left;
}

#billing-page-details .plan-toggle-action .plan-toggle-action-button {
    margin: 20px auto 0;
    background-color: hsl(0deg 70% 40%);
}

#reactivate-subscription
    .reactivate-current-plan-button.plan-toggle-action-button {
    background-color: hsl(146deg 92% 26%);
}

#server-deactivate-button,
#remote-billing-confirm-login-button,
#remote-billing-confirm-email-button,
#server-login-button,
#org-upgrade-button {
    margin: 0;
    width: 100%;

    &:disabled,
    .permanent-disabled {
        color: hsl(0deg 0% 80%);

        &:hover {
            cursor: not-allowed;
        }
    }
}

#upgrade-page-details #payment-schedule-select {
    &:disabled {
        &:hover {
            cursor: not-allowed;
        }
    }
}

#upgrade-page-details #upgrade-payment-by-invoice-container {
    padding-top: 0;
}

#upgrade-page-details #upgrade-payment-method-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

#upgrade-page-details #upgrade-add-card-button,
#billing-page-details .user-stripe-card-update .user-stripe-card-update-button {
    margin: 0;
    width: auto;
}

#upgrade-page-details #upgrade-cardchange-form {
    margin: 0;
}

#server-login-page-details #server-login-form-title .not-editable-realm-field {
    font-weight: 500;
    padding-top: 0;
}

#server-login-page-details #server-login-form-title,
#billing-page-details .stripe-customer-billing-portal,
#billing-page-details #complimentary-access-end-notice,
#billing-page-details .next-payment-info {
    width: 450px;
    padding-top: 0;
}

#sponsorship-status-page-details .input-box.sponsorship-form-field:first-child,
#billing-page-details .input-box.billing-page-field:first-child {
    margin-top: 10px;
}

.sponsorship-status-page .support-link,
#billing-page .support-link {
    text-align: center;
}

.micromodal {
    .modal__title {
        font-weight: 600;
    }

    .modal__content {
        font-weight: 400;
    }
}

#upgrade-page-details #free-trial-top-banner {
    margin-top: 10px;
}

#upgrade-page-details .support-link,
#account-deactivated-success-page-details .not-editable-realm-field,
#server-deactivate-details
    #server-deactivate-form-top-description
    .not-editable-realm-field,
#remote-billing-confirm-email-intro .not-editable-realm-field,
#billing-page-details .billing-frequency-message.not-editable-realm-field,
#free-trial-top-banner .not-editable-realm-field,
#upgrade-page-details .license-management-section .not-editable-realm-field,
#upgrade-page-details #payment-by-invoice-setup .not-editable-realm-field,
#upgrade-page-details .top-of-page-notice .not-editable-realm-field {
    padding-top: 0;
}

#free-trial-alert-message,
#free-trial-top-banner {
    text-align: left;
}

#upgrade-page-sponsorship-pending-message-top,
#billing-sponsorship-pending-message-top,
#sponsorship-status-success-message-top,
#upgrade-success-message-top,
#billing-success-message-top {
    display: block;
    text-align: center;
    font-weight: 400;
    padding: 10px 20px;
    width: 600px;
}

.upgrade-page-success {
    display: none;
    padding: 8px 0;
    width: 450px;
    text-align: center;
    margin: auto;
}

#upgrade-payment-info {
    display: grid;
    grid-template: auto auto auto 1fr / 1fr auto;
    grid-template-areas:
        "payment-info add-card"
        "stripe-portal stripe-portal"
        "alert-message alert-message";
    width: 450px;
    margin: auto;
}

#update-invoice-billing-info {
    display: flex;
    flex-direction: column;
    width: 450px;
    margin: auto;
}

#upgrade-payment-info .alert {
    grid-area: alert-message;
}

#upgrade-page-details .stripe-billing-information {
    grid-area: stripe-portal;
    padding-top: 2px;
}

#upgrade-page-details #upgrade-payment-method-wrapper {
    margin-left: 0;
    grid-area: payment-info;
    width: 100%;
}

/* Used class twice to increase specificity */
#upgrade-payment-info .upgrade-add-card-container.upgrade-add-card-container {
    grid-area: add-card;
    width: auto;
    margin-right: 0;
}

#billing-page-details
    .org-billing-frequency-wrapper.input-box
    .billing-frequency-select {
    width: 150px;
}

#billing-page-details .org-billing-frequency-wrapper.billing-page-field,
#upgrade-page-details .upgrade-add-card-container {
    text-align: left;
}

#server-deactivate-error,
#server-login-error,
#autopay-error {
    font-weight: 400;
    margin-left: 0;
}

#sponsorship-status-page-details .input-box.sponsorship-form-field {
    margin: 20px;
}

#sponsorship-form #sponsorship-button {
    width: 100%;
}

.billing-page-discount {
    opacity: 0.8;
    font-weight: 400;
}

.remote-billing-button-loader {
    display: none;
    vertical-align: top;
    position: relative;
    height: 30px;
    margin-top: -10px;
    top: 5px;
}

#server-deactivate-error,
#server-login-error {
    text-align: left;
    margin: 0 auto;
    max-width: 400px;
    padding: 10px 25px;
}

#upgrade-page-details #due-today-for-future-update-wrapper {
    display: none;
}

#remote-billing-confirm-login-form .text-error {
    margin-bottom: 15px;
}

#server-deactivate-details .upgrade-button-container,
#server-login-page-button-container {
    width: 450px;
    margin: 30px auto 0;
}

#remote-billing-confirm-login-button,
#remote-billing-confirm-email-button,
#billing-page-details #complimentary-access-end-notice-wrapper {
    margin-top: 10px;
}

#remote-billing-confirm-email-form #remote-billing-confirm-email-intro {
    margin-top: -10px;
}

#remote-billing-confirm-login-form #remote-billing-confirm-login-tos-wrapper {
    margin: 0 auto 10px;
}

#account-deactivated-success-page-details
    #account-deactivated-success-page-top-message {
    margin-top: 10px;
}

.flat-discount-minus-sign {
    position: absolute;
    left: -10px;
}

.flat-discount-separator {
    border-bottom: 1px solid hsl(0deg 0% 0%);
}

.toggle-license-management {
    cursor: pointer;
}

#billing-page-details .billing-page-license-management-description {
    padding-top: 5px;
}
```

--------------------------------------------------------------------------------

````
