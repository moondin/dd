---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 745
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 745 of 1290)

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

---[FILE: comparison_table.css]---
Location: zulip-main/web/styles/portico/comparison_table.css

```text
.showing-cloud .self-hosted-comparison,
.showing-self-hosted .cloud-comparison {
    display: none;
}

.zulip-plans-comparison {
    --color-heading-text: hsl(0deg 0% 100%);
    --color-table-text: hsl(223deg 40% 25%);
    --color-table-background: hsl(0deg 0% 100% / 80%);
    --color-table-link: hsl(210deg 94% 30%);
    --color-table-link-hover: hsl(210deg 100% 45%);
    --color-table-link-active: hsl(210deg 100% 40%);
    --color-table-link-decoration: hsl(210deg 94% 30% / 20%);
    --color-table-link-decoration-hover: hsl(210deg 100% 45% / 70%);
    --color-table-link-decoration-active: hsl(210deg 100% 40%);
    --border-radius-table: 11px;

    .icon-cloud {
        --icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3e%3cpath fill='%23313F68' d='M4.333 13.333c-1.01 0-1.875-.35-2.591-1.05-.717-.7-1.075-1.555-1.075-2.566 0-.867.26-1.64.783-2.317A3.465 3.465 0 0 1 3.5 6.1a4.525 4.525 0 0 1 1.667-2.483A4.561 4.561 0 0 1 8 2.667c1.3 0 2.403.452 3.308 1.358.906.906 1.359 2.008 1.359 3.308a2.91 2.91 0 0 1 1.908.992c.506.572.758 1.242.758 2.008 0 .834-.291 1.542-.875 2.125a2.893 2.893 0 0 1-2.125.875h-8Z' opacity='.5'/%3e%3c/svg%3e");
    }

    .icon-self-hosted {
        --icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3e%3cpath fill='%23313F68' fill-opacity='.5' d='M11.333 10.667a.98.98 0 0 0 .709-.284.957.957 0 0 0 .291-.716.964.964 0 0 0-.291-.709.965.965 0 0 0-.709-.291.957.957 0 0 0-.716.291.979.979 0 0 0-.284.709.971.971 0 0 0 1 1ZM1.333 6 3.6 3.733c.122-.122.264-.22.425-.291.161-.073.336-.109.525-.109h6.883c.19 0 .364.036.525.109.161.072.303.17.425.291L14.667 6H1.333Zm1.334 6.667a1.29 1.29 0 0 1-.95-.384 1.29 1.29 0 0 1-.384-.95v-4h13.334v4c0 .378-.13.695-.392.95a1.298 1.298 0 0 1-.942.384H2.667Z'/%3e%3c/svg%3e");
    }

    .icon-infinity {
        --icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='black' fill-rule='evenodd' d='M2.464 8.464A5 5 0 0 1 6 7c2.16 0 4.155 1.251 6 3.4C13.845 8.251 15.84 7 18 7a5 5 0 1 1 0 10c-2.16 0-4.155-1.251-6-3.4-1.845 2.149-3.84 3.4-6 3.4a5 5 0 0 1-3.536-8.536ZM10.731 12C8.983 9.857 7.4 9 6 9a3 3 0 1 0 0 6c1.4 0 2.983-.857 4.731-3Zm2.538 0c1.748 2.143 3.331 3 4.731 3a3 3 0 0 0 0-6c-1.4 0-2.983.857-4.731 3Z' clip-rule='evenodd'/%3e%3c/svg%3e");
    }

    .icon-check {
        --icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='black' fill-rule='evenodd' d='M20.707 5.793a1 1 0 0 1 0 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L9 16.086 19.293 5.793a1 1 0 0 1 1.414 0Z' clip-rule='evenodd'/%3e%3c/svg%3e");
    }

    .icon-x {
        --icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='black' d='M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293Z'/%3e%3c/svg%3e");
    }

    .icon-wrench {
        --icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='black' fill-rule='evenodd' d='M16.578 3.36a5.25 5.25 0 0 0-5.866 7.302.75.75 0 0 1-.153.84l-6.91 6.91a1.371 1.371 0 0 0 1.94 1.94l6.91-6.91a.75.75 0 0 1 .839-.154 5.25 5.25 0 0 0 7.301-5.866l-2.915 2.915a1.75 1.75 0 0 1-2.45 0l-.006-.005-1.605-1.606a1.75 1.75 0 0 1 0-2.45l.005-.005 2.91-2.91Zm-2.293-1.503a6.75 6.75 0 0 1 3.993.491.75.75 0 0 1 .22 1.214l-3.766 3.766a.25.25 0 0 0 0 .347l1.593 1.593a.25.25 0 0 0 .347 0L20.438 5.5a.75.75 0 0 1 1.214.221 6.75 6.75 0 0 1-8.445 9.131l-6.557 6.56a2.871 2.871 0 1 1-4.06-4.06l6.558-6.56a6.75 6.75 0 0 1 5.138-8.935Z' clip-rule='evenodd'/%3e%3c/svg%3e");
    }

    .icon {
        vertical-align: middle;
        display: inline-block;
        flex-shrink: 0;
        background-color: currentcolor;
        mask-position: center;
        mask-repeat: no-repeat;
        mask-image: var(--icon);
        width: 24px;
        height: 24px;
    }

    .icon-plan {
        /* Smaller icons within the table headings. */
        width: 16px;
        height: 16px;
    }

    .icon-with-copy {
        /* Treat copy and a nearby icon as
           a unit when reflowing text for narrower
           viewports. */
        display: inline-block;
    }

    .grouped-icons {
        display: flex;
        justify-content: center;
        gap: 4px;
    }

    h2 {
        font-family: var(--font-ss3);
        font-weight: 450;
        font-size: 44px;
        line-height: 120%;
        text-align: center;
        margin: 64px 0 10px;
        color: var(--color-heading-text);
    }

    .h2-subheader {
        font-family: var(--font-ops);
        font-weight: 400;
        font-size: 16px;
        line-height: 145%;
        text-align: center;
        color: var(--color-heading-text);
        /* Let subheader text fill the same area as
           text in the comparison table below. */
        padding: 0 14px;

        a {
            color: inherit;
            text-decoration: none;
            border-bottom: 1px solid hsl(0deg 0% 100% / 50%) !important;
            transition: border 0.4s ease-out; /* stylelint-disable-line plugin/no-low-performance-animation-properties */

            &:hover {
                border-bottom: 2px solid hsl(0deg 0% 100%) !important;
                transition: none;
            }
        }
    }

    .comparison-tabs {
        width: max-content;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        gap: 3px;
        background-color: hsl(0deg 0% 100% / 70%);
        padding: 3px;
        border-radius: 6px;
    }

    .comparison-tab {
        font-family: var(--font-ops);
        font-size: 14px;
        padding: 4px 16px;
        color: hsl(223deg 40% 30%);
        font-weight: 600;
        border: none;
        background-color: hsl(0deg 0% 100% / 0%);
        display: flex;
        flex-direction: column;
        justify-content: center;

        align-items: center;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 120ms ease-out;
    }

    .comparison-tab:hover {
        transition: none;
        background-color: hsl(0deg 0% 100% / 40%);
    }

    .comparison-tab:active {
        background-color: hsl(0deg 0% 100% / 70%);
    }

    .comparison-tab._selected {
        background-color: hsl(0deg 0% 100% / 80%);
        cursor: default;
    }

    .comparison-table {
        font-family: var(--font-ss3);
        font-size: 16px;
        line-height: 18px;
        text-align: center;
        border-collapse: collapse;
        margin: 24px auto 48px;
        border-radius: var(--border-radius-table);
        color: var(--color-table-text);
        background: var(--color-table-background);
    }

    .comparison-table a {
        color: var(--color-table-link);
        text-underline-offset: 4px;
        text-decoration-thickness: 1px;
        text-decoration-color: var(--color-table-link-decoration);
    }

    .comparison-table a:hover {
        color: var(--color-table-link-hover);
        text-decoration-color: var(--color-table-link-decoration-hover);
    }

    .comparison-table a:active {
        color: var(--color-table-link-active);
        text-decoration-color: var(--color-table-link-decoration-active);
    }

    .comparison-table tr {
        transition: background-color 200ms ease-out;
    }

    .comparison-table tbody tr:hover {
        background-color: hsl(0deg 0% 100% / 30%);
    }

    .comparison-table th:first-child {
        border-top-left-radius: var(--border-radius-table);
    }

    .comparison-table th:last-child {
        border-top-right-radius: var(--border-radius-table);
    }

    .comparison-table th,
    .comparison-table .subheader {
        position: sticky;
        font-weight: 700;
        color: hsl(223deg 40% 30% / 100%);
        background: hsl(209deg 41% 94%);
    }

    .comparison-table th .icon {
        display: none;
    }

    .subheader-filler {
        background: hsl(209deg 41% 94%);
    }

    .comparison-table th {
        padding: 12px 2px 10px;
        top: 60px;
        z-index: 1;
    }

    .comparison-table td.subheader.comparison-table-feature {
        font-weight: 600;
        color: hsl(223deg 40% 30% / 80%);
        top: 64px;
        z-index: 2;
        padding-top: 8px;
        padding-bottom: 8px;
        text-transform: uppercase;
        font-size: 15px;
        letter-spacing: 0.1ch;
    }

    .comparison-table td {
        padding: 8px;
        border-top: 1px solid hsl(209deg 40% 40% / 30%);
        line-height: 18px;
    }

    .comparison-table colgroup col:first-child {
        width: 340px;
    }

    .comparison-table colgroup col {
        width: 112px;
    }

    .comparison-table th.comparison-table-feature,
    .comparison-table td.comparison-table-feature {
        text-align: left;
        padding-left: 14px;
    }

    .comparison-table td.comparison-table-feature {
        color: hsl(223deg 40% 16%);
    }

    .comparison-table-feature-desc {
        font-size: 14px;
        opacity: 0.7;
        margin-top: 4px;
    }

    .comparison-value-positive {
        color: hsl(147deg 80% 29% / 100%);
    }

    .comparison-value-warning {
        color: hsl(42deg 85% 35% / 100%);
    }

    .comparison-value-negative {
        color: hsl(224deg 8% 50% / 100%);
    }

    .comparison-value-positive,
    .comparison-value-warning,
    .comparison-value-negative {
        /* Set positioning context for use
           with tooltip hovers on icons. */
        position: relative;
        /* Make non-icon text (e.g., "Billed hourly")
           less prominent than other text in the table's
           rows or columns. */
        font-size: 0.9em;
    }

    .comparison-value-positive::after,
    .comparison-value-warning::after,
    .comparison-value-negative::after {
        content: attr(data-title);
        white-space: nowrap;
        font-size: 14px;
        line-height: 14px;
        font-weight: 400;
        display: block;
        padding: 2px 4px;
        border-radius: 5px;
        background-color: hsl(208deg 43% 93%);
        /* the color of mixed hover row with bg */
        position: absolute;
        top: calc(50% + 11px);
        left: 50%;
        /* Keep tooltips over top of other elements,
           including the headers within the table. */
        z-index: 3;
        transform: translateX(-50%);
        visibility: hidden;
        opacity: 0;
        transition:
            visibility 301s linear,
            opacity 250ms ease-out;
    }

    .comparison-value-positive:hover::after,
    .comparison-value-warning:hover::after,
    .comparison-value-negative:hover::after {
        transition:
            visibility 0s linear,
            opacity 250ms ease-out;
        transition-delay: 200ms;
        visibility: visible;
        opacity: 1;
    }

    @media (width <= 940px) {
        h1 {
            font-size: 40px;
        }

        .h1-subheader {
            font-size: 16px;
        }

        h2 {
            font-size: 32px;
            margin-bottom: 4px;
        }

        .h2-subheader {
            font-size: 14px;
        }
    }

    @media (width <= 730px) {
        .comparison-table th {
            font-size: 14px;
            line-height: 18px;
            box-sizing: border-box;
            height: 44px;
            padding: 4px 2px;
        }

        .comparison-table td {
            font-size: 14px;
            line-height: 18px;
        }

        .comparison-table td.subheader.comparison-table-feature {
            font-size: 13px;
            line-height: 16px;
            box-sizing: border-box;
            padding-top: 10px;
            padding-bottom: 8px;
        }

        .comparison-table td.comparison-table-feature {
            font-size: 14px;
        }

        .comparison-table-feature-desc {
            font-size: 12px;
            line-height: 14px;
        }
    }

    @media (width <= 500px) {
        .comparison-table th {
            font-size: 13px;
            line-height: 14px;
        }

        .comparison-table th.comparison-table-feature,
        .comparison-table td.comparison-table-feature {
            padding-left: 8px;
        }

        .comparison-table td {
            padding: 4px 2px;
            border-top: 1px solid hsl(209deg 40% 40% / 30%);
            line-height: 18px;
        }

        .comparison-table td.comparison-value-positive,
        .comparison-table td.comparison-value-warning,
        .comparison-table td.comparison-value-negative {
            font-size: 13px;
            line-height: 14px;
        }

        .comparison-value-positive::after,
        .comparison-value-warning::after,
        .comparison-value-negative::after {
            display: none;
        }
    }
}

/* No header to accommodate on self-hosted realms,
   so keep sticky headers at the top of the viewport. */
.zulip-plans-comparison.is-self-hosted-realm {
    .comparison-table {
        th,
        td.subheader.comparison-table-feature {
            top: 0;
        }
    }
}

/* Change comparison-table visibility on /plans
   based on active plan tab. */

#showing-tab-cloud,
#showing-tab-hosted,
#showing-tab-all {
    .comparison-tab-cloud,
    .comparison-tab-self-hosted,
    .comparison-tab-all {
        background-color: hsl(0deg 0% 100% / 0%);
        cursor: pointer;

        &:hover {
            background-color: hsl(0deg 0% 100% / 40%);
        }
    }
}

.showing-cloud:not(:has(div[id^="showing-tab"])),
#showing-tab-cloud {
    .comparison-tab-cloud {
        background-color: hsl(0deg 0% 100%);
        cursor: default;

        &:hover {
            background-color: hsl(0deg 0% 100%);
        }
    }

    #self-hosted-plan-comparison,
    #all-plan-comparison,
    .subheader-open-source,
    .subheader-self-hosted-legend,
    .self-hosted-feature-only,
    .self-hosted-cell {
        display: none;
    }

    #cloud-plan-comparison,
    .cloud-cell {
        display: revert;
    }

    /* When only Cloud plans appear in the comparison table,
       we need to set the border-radius here that is otherwise
       displayed on the table itself.

       TODO: Unset this property when the header row is stuck,
       so that the little flutter of feature-table lines cannot
       be seen by eagle-eyed users. */
    th.last-cloud-th {
        border-top-right-radius: var(--border-radius-table);
    }
}

.showing-self-hosted:not(:has(div[id^="showing-tab"])),
#showing-tab-hosted {
    .comparison-tab-self-hosted {
        background-color: hsl(0deg 0% 100%);
        cursor: default;

        &:hover {
            background-color: hsl(0deg 0% 100%);
        }
    }

    #cloud-plan-comparison,
    #all-plan-comparison,
    .cloud-cell {
        display: none;
    }

    #self-hosted-plan-comparison,
    .subheader-open-source,
    .subheader-self-hosted-legend,
    .self-hosted-feature-only,
    .self-hosted-cell {
        display: revert;
    }

    th.last-cloud-th {
        border-top-right-radius: unset;
    }
}

#showing-tab-all {
    .comparison-tab-all {
        background-color: hsl(0deg 0% 100%);
        cursor: default;

        &:hover {
            background-color: hsl(0deg 0% 100%);
        }
    }

    #cloud-plan-comparison,
    #self-hosted-plan-comparison {
        display: none;
    }

    .subheader-open-source,
    .subheader-self-hosted-legend,
    #all-plan-comparison,
    .cloud-cell,
    .self-hosted-cell,
    .self-hosted-feature-only {
        display: revert;
    }

    th.last-cloud-th {
        border-top-right-radius: unset;
    }

    .comparison-table th .icon {
        display: revert;
    }

    .comparison-table th {
        vertical-align: top;
    }

    .comparison-table th.comparison-table-feature {
        padding-top: 28px;
    }

    .comparison-table td.stuck {
        padding-top: 24px;
    }

    @media (width <= 730px) {
        .comparison-table th {
            padding: 8px 2px;
        }

        .comparison-table th.comparison-table-feature {
            padding-top: 24px;
            padding-left: 14px;
        }

        .comparison-table td.subheader.comparison-table-feature {
            /* Line up features with plan titles. */
            line-height: 18px;
        }

        .comparison-table td.stuck {
            padding-top: 20px;
            padding-bottom: 6px;
            vertical-align: top;
        }
    }

    @media (width <= 684px) {
        .comparison-table td.stuck {
            height: 60px;
        }
    }

    @media (width <= 500px) {
        .comparison-table td.subheader.comparison-table-feature {
            /* Line up features with plan titles. */
            line-height: 14px;
            min-width: auto;
        }

        .comparison-table td.stuck {
            top: 64px;
            height: 55px;
        }
    }

    @media (width <= 405px) {
        /* For very tiny views, we get rid of the luxury
           of any horizontal padding that's left. */
        .comparison-table-feature,
        .cloud-cell,
        .self-hosted-cell {
            padding-left: 0;
            padding-right: 0;
        }

        /* Keep the comparison-table features from
           colliding with the left screen edge, though. */
        .comparison-table-feature {
            padding-left: 2px;
        }
    }
}

@media (width <= 500px) {
    .comparison-table td.subheader.comparison-table-feature {
        min-width: max-content;
    }
}

@media (width <= 460px) {
    .zulip-plans-comparison .comparison-tab-all {
        display: none;
    }
}

@media (width <= 356px) {
    .zulip-plans-comparison
        .comparison-table
        td.subheader.comparison-table-feature {
        height: 51px;
        top: 60px;
    }

    .zulip-plans-comparison .comparison-table th {
        height: 51px;
    }
}

.features-page {
    /* Always suppress subheadings on /features */
    #cloud-plan-comparison,
    #self-hosted-plan-comparison,
    #all-plan-comparison {
        display: none !important;
    }
    /* Maintain the margin-top ordinarily set on
       the subheadings. */
    .comparison-tabs {
        margin-top: 64px;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: dev_help.css]---
Location: zulip-main/web/styles/portico/dev_help.css

```text
.dev-help-page {
    .white-box {
        width: 40%;
        margin: 0 auto;
    }

    .dev-help-header {
        text-align: center;
        margin-bottom: 1em;
    }

    .invalid-path-error {
        color: hsl(1.1deg 44.7% 50.4%);
        font-weight: 400;
        display: block;
        text-align: center;
        margin-top: 1em;
    }

    .dev-help-actions {
        margin-top: 1.5em;
        display: flex;
        justify-content: center;
        gap: 5px;

        .dev-help-action-button {
            display: inline-block;
            font-weight: 400;
            color: hsl(170deg 41% 52%);
            border: 1px solid hsl(170deg 41% 52%);
            border-radius: 4px;
            padding: 6px 12px;

            transition:
                color 0.3s ease,
                border-color 0.3s ease;

            &:hover {
                color: hsl(156deg 62% 61%);
                border-color: hsl(156deg 62% 61%);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: email_log.css]---
Location: zulip-main/web/styles/portico/email_log.css

```text
:root {
    --color-background-modal: hsl(0deg 0% 98%);
}

#dev-email-log-container {
    .dev-email-log-header {
        position: fixed;
        font-family: sans-serif;
        font-size: 14px;
    }

    .dev-email-log-header,
    .dev-forward-email-alert {
        padding: 10px;
        border: 1px solid hsl(190deg 65% 84%);
        border-radius: 4px;
        background-color: hsl(200deg 65% 91%);
        color: hsl(200deg 50% 45%);
    }

    .dev-email-log-actions,
    .dev-forward-email-alert {
        & a {
            color: hsl(200deg 50% 45%);

            &:hover {
                color: hsl(200deg 56% 33%);
            }
        }
    }

    .dev-email-log-actions {
        padding-bottom: 5px;
    }

    .dev-email-log-text-only {
        text-align: right;
    }

    .dev-email-log-content {
        padding-top: 100px;
        max-width: 1000px;

        & h4 {
            color: hsl(0deg 0% 20%);
            margin: 2px 10px;
        }

        .email-text,
        .email-html {
            margin: 10px;
        }

        .email-text pre {
            font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
            color: hsl(0deg 0% 20%);
            display: block;
            padding: 9.5px;
            margin: 0 0 10px;
            font-size: 13px;
            line-height: 20px;
            word-break: break-all;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            background-color: hsl(0deg 0% 96%);
            border: 1px solid hsl(0deg 0% 75%);
            border-radius: 4px;
        }
    }

    #smtp_form_status,
    .hide {
        display: none;
    }

    #forward_email_modal {
        .modal__content label {
            font-size: 1rem;
            display: block;
            margin-bottom: 5px;
            cursor: pointer;
        }

        #forward_address_sections,
        .dev-forward-email-alert {
            margin: 5px 0;
        }

        & label.radio {
            padding-left: 20px;
        }

        & input[type="radio"] {
            float: left;
            width: auto;
            cursor: pointer;
            margin: 4px 0 0 -20px;
            line-height: normal;

            &:focus {
                outline: 1px dotted hsl(0deg 0% 20%);
                outline: 5px auto -webkit-focus-ring-color;
                outline-offset: -2px;
            }
        }

        & input[type="text"] {
            padding: 4px 6px;
            color: hsl(0deg 0% 33%);
            border-radius: 4px;
            border: 1px solid hsl(0deg 0% 80%);
            box-shadow: inset 0 1px 1px hsl(0deg 0% 0% / 7.5%);
            transition:
                border-color linear 0.2s,
                box-shadow linear 0.2s;
            margin-bottom: 10px;
            width: 206px;

            &:focus {
                border-color: hsl(206deg 80% 62% / 80%);
                outline: 0;
                box-shadow:
                    inset 0 1px 1px hsl(0deg 0% 0% / 7.5%),
                    0 0 8px hsl(206deg 80% 62% / 60%);
            }
        }
    }

    & input[type="checkbox"] {
        width: auto;
        cursor: pointer;

        &:focus {
            outline: 1px dotted hsl(0deg 0% 20%);
            outline: 5px auto -webkit-focus-ring-color;
            outline-offset: -2px;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: footer.css]---
Location: zulip-main/web/styles/portico/footer.css

```text
:root {
    --color-footer-background: hsl(238deg 28% 27%);
    --color-links: hsl(238deg 100% 82%);

    @media (prefers-color-scheme: dark) {
        --color-footer-background: hsl(238deg 28% 21%);
    }
}

/* These need to be here so that other pages don't need to import a different library for these icons to work */
.footer-social-icon-mastodon {
    --footer-social-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='none' viewBox='0 0 28 28'%3e%3cg fill='%23A3A5F8'%3e%3cpath d='M18.42 16.43h2.38v-6.02c0-1.23-.3-2.2-.94-2.93a3.27 3.27 0 0 0-2.55-1.1c-1.22 0-2.15.47-2.76 1.41l-.6 1-.58-1a3.07 3.07 0 0 0-2.76-1.4c-1.05 0-1.9.37-2.55 1.1a4.3 4.3 0 0 0-.94 2.92v6.02H9.5v-5.84c0-1.23.52-1.86 1.55-1.86 1.15 0 1.72.74 1.72 2.2v3.2h2.38v-3.2c0-1.46.57-2.2 1.71-2.2 1.04 0 1.56.63 1.56 1.86v5.84Z'/%3e%3cpath fill-rule='evenodd' d='M3 0a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3Zm18.39 3.6s3.26 1.45 3.26 6.43c0 0 .04 3.66-.46 6.2-.31 1.63-2.81 3.4-5.69 3.74-1.5.18-2.97.34-4.54.27-2.57-.12-4.6-.62-4.6-.62 0 .24.02.48.05.72.33 2.53 2.51 2.68 4.58 2.76 2.09.07 3.94-.52 3.94-.52l.09 1.89s-1.46.78-4.06.92c-1.43.08-3.21-.03-5.28-.58-4.5-1.19-5.27-5.98-5.39-10.84a100.6 100.6 0 0 1-.02-3v-.94c0-4.97 3.27-6.43 3.27-6.43 1.64-.76 4.46-1.07 7.39-1.1H14c2.93.03 5.75.34 7.39 1.1Z' clip-rule='evenodd'/%3e%3c/g%3e%3c/svg%3e");
}

.footer-social-icon-x {
    --footer-social-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='none' viewBox='0 0 28 28'%3e%3cg fill='%23A3A5F8' clip-path='url(%23a)'%3e%3cpath d='M18.87 23.69h2.71L9.11 5.36H6.4L18.87 23.7Z'/%3e%3cpath fill-rule='evenodd' d='M3.04.04a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3v-22a3 3 0 0 0-3-3h-22ZM23.34 4l-7.44 8.89 8.1 12.1h-5.96l-5.45-8.15-6.83 8.15H4l7.8-9.32L4 4h5.96l5.16 7.72L21.58 4h1.77Z' clip-rule='evenodd'/%3e%3c/g%3e%3cdefs%3e%3cclipPath id='a'%3e%3crect width='28' height='28' fill='white' rx='3'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e");
}

.footer-social-icon-linkedin {
    --footer-social-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='none' viewBox='0 0 28 28'%3e%3cg clip-path='url(%23a)'%3e%3cpath fill='%23A3A5F8' d='M28 3a3 3 0 0 0-3-3H3a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V3ZM8.27 23.9H4.19V10.5h4.18v13.4h-.1ZM6.17 8.7A2.42 2.42 0 0 1 3.8 6.3c0-1.3 1.1-2.4 2.39-2.4 1.3 0 2.39 1.1 2.39 2.4 0 1.3-1 2.4-2.4 2.4Zm17.65 15.2h-4.09v-6.5c0-1.5 0-3.5-2.2-3.5-2.18 0-2.48 1.7-2.48 3.4v6.6h-4.09V10.5h3.99v1.8h.1c.6-1 1.89-2.2 3.88-2.2 4.19 0 4.98 2.8 4.98 6.4v7.4h-.1Z'/%3e%3c/g%3e%3cdefs%3e%3cclipPath id='a'%3e%3cpath fill='white' d='M0 0h28v28H0z'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e");
}

#footer {
    background: var(--color-footer-background);
    box-sizing: border-box;

    & ul {
        /* Override bootstrap defaults */
        list-style: none;
        margin: 0;
    }

    .footer__container {
        max-width: 1132px;
        padding: 52px 52px 0;
        display: flex;
        justify-content: space-between;
        gap: 40px;
        flex-flow: row wrap;
        margin: 0 auto;
    }

    .footer__section {
        flex-shrink: 0;
    }

    .footer__section-title {
        display: block;
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        line-height: 133%;
        letter-spacing: 0.1em;
        color: hsl(0deg 0% 100%);
        opacity: 0.8;
        text-transform: uppercase;
        border-bottom: 0;
        margin-bottom: 0;
        margin-block: 0;
    }

    .footer__section ul {
        margin: 20px 0 28px;
        padding-left: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        & li {
            margin-bottom: 10px;
        }
    }

    & li {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: var(--color-links);
        border-bottom: 1px solid var(--color-footer-background);
    }

    & a,
    a:visited {
        font-weight: 400;
        font-size: 16px;
        color: var(--color-links);
        text-decoration: none;
    }

    & a:hover,
    a:focus {
        color: var(--color-links);
        border-bottom: 1px solid var(--color-links);
        transition: none;
        text-decoration: none;
        outline: none;
    }

    .footer__legal {
        margin: 12px 0 0;
        padding: 0 52px;
        border-top: 1px solid hsl(0deg 0% 100% / 10%);

        & a {
            border-bottom: 1px solid var(--color-footer-background);

            &:hover {
                border-bottom: 1px solid var(--color-links);
            }
        }

        &.footer__legal_not_corporate {
            margin-top: 0;
        }
    }

    .footer__legal-container {
        max-width: 1132px;
        padding: 15px 0;
        display: flex;
        place-content: center space-between;
        flex-flow: row wrap;
        margin: 0 auto;

        box-sizing: border-box;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
    }

    .footer__legal-spacer {
        flex-grow: 1;
    }

    .footer__legal-container .copyright {
        color: hsl(0deg 0% 100% / 50%);

        @media screen and (width <= 600px) {
            /* Maintain space between copyright
               and legal links when flex-wrapping
               at narrower viewports. */
            margin-bottom: 8px;
        }
    }

    .footer__legal-container a {
        font-size: 14px;
        line-height: 18px;
    }

    .footer__legal-container a:not(:last-child) {
        margin-right: 2em;
    }

    .footer__section .extra_margin {
        margin-bottom: 40px;
    }

    .footer-social-links {
        margin: -25px 0 20px;
        display: flex;
        gap: 8px;
    }

    .footer-social-icon {
        width: 28px;
        height: 28px;
        display: inline-block;
        flex-shrink: 0;
        background-color: hsl(238.59deg 85.86% 80.59%);
        mask-position: center;
        mask-repeat: no-repeat;
        mask-image: var(--footer-social-icon);
        transition: background-color 150ms ease-out;

        &:hover {
            background-color: hsl(238.6deg 84.31% 90%);
        }

        &:active {
            background-color: hsl(240deg 86.67% 97.06%);
        }
    }

    /* #footer responsivity and global fixes */
    @media (width <= 1280px) {
        .footer__container {
            justify-content: flex-start;
            row-gap: 0;
        }

        .footer__legal-container {
            justify-content: flex-end;
        }
    }

    @media (width <= 600px) {
        .footer__legal {
            padding: 0 10px;
        }

        .footer__legal-spacer {
            width: 100%;
        }

        .footer__legal-container {
            column-gap: 20px;
            justify-content: center;

            & a:not(:last-child) {
                margin-right: 0;
            }
        }
    }

    @media (width <= 400px) {
        .footer__container {
            gap: 0;
            flex-direction: column;
        }

        .footer__section .extra_margin {
            margin-bottom: 36px;
        }
    }
}
```

--------------------------------------------------------------------------------

````
