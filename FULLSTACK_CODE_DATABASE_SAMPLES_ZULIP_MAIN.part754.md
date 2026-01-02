---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 754
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 754 of 1290)

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

---[FILE: pricing_plans.css]---
Location: zulip-main/web/styles/portico/pricing_plans.css

```text
.portico-pricing {
    --icon-left-outward-tab-curve: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3e%3cpath fill='white' d='M0 16h16V0c0 8.837-7.163 16-16 16Z'/%3e%3c/svg%3e");
    --icon-right-outward-tab-curve: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3e%3cpath fill='white' d='M16 16H0V0c0 8.837 7.163 16 16 16Z'/%3e%3c/svg%3e");
    --icon-question-header-swoosh: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='33' height='56' fill='none' viewBox='0 0 33 56'%3e%3cpath fill='%23E2EBF4' d='M33 37 1 56C1 35-3.5 0 33 0 7.5 3 7.776 37 33 37Z'/%3e%3c/svg%3e");
    --icon-current-plan-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='none' viewBox='0 0 22 22'%3e%3cg fill='%230F8544'%3e%3cpath d='M14.396 9.813a.914.914 0 1 0-1.293-1.293l-3.02 3.02-1.186-1.186a.914.914 0 1 0-1.294 1.293l1.834 1.833a.914.914 0 0 0 1.293 0l3.666-3.667Z'/%3e%3cpath fill-rule='evenodd' d='M11 .923a4.58 4.58 0 0 0-3.495 1.62 4.581 4.581 0 0 0-4.961 4.949 4.58 4.58 0 0 0 0 7.016 4.58 4.58 0 0 0 4.96 4.949 4.583 4.583 0 0 0 7.003-.001 4.582 4.582 0 0 0 4.95-4.96 4.583 4.583 0 0 0 0-6.991 4.58 4.58 0 0 0-4.962-4.962A4.581 4.581 0 0 0 11 .923ZM9.678 3.09a2.752 2.752 0 0 1 3.64.932.914.914 0 0 0 .972.4 2.752 2.752 0 0 1 3.289 3.288.914.914 0 0 0 .4.971 2.753 2.753 0 0 1 0 4.638.914.914 0 0 0-.4.97 2.752 2.752 0 0 1-3.283 3.29.914.914 0 0 0-.97.401 2.75 2.75 0 0 1-4.644 0 .914.914 0 0 0-.971-.401 2.752 2.752 0 0 1-3.29-3.283.914.914 0 0 0-.403-.97 2.753 2.753 0 0 1 0-4.652.914.914 0 0 0 .404-.97A2.752 2.752 0 0 1 7.71 4.42a.914.914 0 0 0 .97-.4c.25-.389.592-.709.997-.93Z' clip-rule='evenodd'/%3e%3c/g%3e%3c/svg%3e");
    --icon-discount-tooltip-curve: url("data:image/svg+xml,%3Csvg width='35' height='14' viewBox='0 0 35 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M17.4814 14C16.3229 6.40469 8.98604 0 0.5 0L34.5 0C26.0153 0 18.4853 6.40469 17.4814 14Z' fill='%23F4F9FE'/%3E%3C/svg%3E");
    --width-price-box-min: 240px;
    --width-price-box-max: 355px;
    --height-discounted-price-box: 98px;
    --height-price-details-min: 53px;

    padding: 102px 0 58px;
    background: linear-gradient(
        180deg,
        var(--color-background-gradient-start) 0%,
        var(--color-background-gradient-end) 100%
    );

    @media (prefers-color-scheme: dark) {
        --color-background-box: hsl(221deg 35% 89%);

        background: linear-gradient(
            180deg,
            var(--color-background-gradient-start) 30%,
            var(--color-background-gradient-end) 100%
        );
    }

    ul {
        padding: 0;
        margin: 0;
    }

    h1 {
        font-weight: 500;
        font-size: 58px;
        line-height: 110%;
        text-align: center;
        color: hsl(0deg 0% 100%);
        margin: 10px;
    }

    .h1-subheader {
        font-family: var(--font-ops);
        font-weight: 400;
        font-size: 20px;
        line-height: 145%;
        text-align: center;
        font-feature-settings:
            "pnum" on,
            "lnum" on;
        color: hsl(0deg 0% 100%);
        max-width: 560px;
        padding: 0 10px;
        margin: 0 auto;

        /* There's never a button instance here, but we need
           this to correct for specificity against the overall
           marketing-page link styles.
           TODO: Integrate this link style so as to not add a
           :not() selector here. */
        & a:not(.button) {
            color: inherit;
            text-decoration: none;
            border-bottom: 1px solid hsl(0deg 0% 100% / 50%);
            transition: border 0.4s ease-out; /* stylelint-disable-line plugin/no-low-performance-animation-properties */

            &:hover {
                text-decoration: none;
                color: inherit;
                border-bottom: 2px solid hsl(0deg 0% 100%);
                transition: none;
            }
        }
    }

    li {
        list-style-type: none;
        display: flex;
        align-items: flex-start;
        /* Prevent flexbox from collapsing
           whitespace around links and other
           inline elements. */
        gap: 0.3em;

        &::before {
            content: "";
            height: 6px;
            width: 6px;
            border-radius: 16px;
            /* 0.5333em, roughly 8px given the
               15px font-size on list items, will
               keep the bullet vertically centered
               with the first line of a list item
               as the page's text scales. */
            margin: 0.5333em 4px 0 0;
            /* Prevent "bullets" from being distorted
               on a multiline bullet point. */
            flex: 0 0 auto;
            background: currentcolor;
            opacity: 0.3;
        }
    }

    .unlimited-push-notifications {
        padding-bottom: 21px;
    }

    .support-note {
        margin-top: 15px;
        font-size: 17px;
        font-weight: 550;

        &::before {
            /* Hide the bullet on the support note,
               but still keep its width to maintain
               lefthand alignment. */
            background: transparent;
        }
    }

    a {
        color: var(--color-link);
        text-decoration: underline;
        text-decoration-color: var(--color-link-underline);
        text-underline-offset: 4px;

        &:hover {
            color: var(--color-link-hover);
            text-decoration: underline;
            text-decoration-color: var(--color-link-underline-hover);
        }
    }

    /* Remove padding introduced in legacy_landing_page.css */
    .padded-content {
        padding: 0;
    }

    @media (width <= 768px) {
        .pricing-model .padded-content {
            padding: 0;
        }
    }

    .pricing-container {
        display: grid;
        grid-template:
            ".       .       cloud-title  self-hosted-title .       .      " auto
            "pricing pricing pricing      pricing           pricing pricing" auto / 56px 1fr minmax(
                0,
                420px
            )
            minmax(0, 420px) 1fr 56px;
        column-gap: 2px;
        margin: 50px auto 38px;
        /* We use the plan count on the respective `.showing-` class
           to determine a maximum width, beyond which the plans will
           grow no wider. */
        max-width: calc(
            (var(--count-plans) * var(--width-price-box-max)) + 40px
        );

        @media screen and (width <= 700px) {
            grid-template-columns:
                40px 1fr minmax(0, 420px)
                minmax(0, 420px) 1fr 40px;
        }
    }

    .request-sponsorship {
        margin-bottom: 10px;
    }

    .pricing-pane-scroll-container {
        grid-area: pricing;
        overflow-x: auto;
        scrollbar-width: none;
    }

    .cloud-plan-title {
        grid-area: cloud-title;
    }

    .self-hosted-plan-title {
        grid-area: self-hosted-title;
    }

    .pricing-tab,
    .inactive-pricing-tab {
        cursor: pointer;
        background: var(--color-background-box);
        padding: 12px 12px 0;
        border-radius: 16px 16px 0 0;
        min-height: 40px;

        h2 {
            color: var(--color-plan-tab-header);
            font-family: var(--font-ops);
            font-weight: 550;
            font-size: 30px;
            line-height: 32px;
            margin: 0;
            margin-bottom: 8px;
            text-align: center;
        }

        p {
            color: var(--color-plan-tab-copy);
            font-weight: 400;
            font-size: 16px;
            line-height: 125%;
            margin: 0;
            text-align: center;
            padding-bottom: 14px;

            @media screen and (width <= 700px) {
                display: none;
            }
        }

        /* Shared styles to handle tab curvature. */
        &::before {
            display: none;
            width: 16px;
            height: 16px;
            content: "";
            position: absolute;
            bottom: 0;
            left: -16px;
            background-color: var(--color-background-box);
            mask-position: center;
            mask-repeat: no-repeat;
            mask-image: var(--icon-left-outward-tab-curve);
        }

        &::after {
            display: none;
            width: 16px;
            height: 16px;
            content: "";
            position: absolute;
            bottom: 0;
            right: -16px;
            background-color: var(--color-background-box);
            mask-position: center;
            mask-repeat: no-repeat;
            mask-image: var(--icon-right-outward-tab-curve);
        }
    }

    .inactive-pricing-tab {
        cursor: default;
    }

    .pricing-pane {
        display: grid;
        grid-template-columns: repeat(
            auto-fit,
            minmax(var(--width-price-box-min), 1fr)
        );
        grid-template-rows: auto;
        /* We use the plan count on the respective `.showing-` class
           to determine a minimum width, at which point the plans scroll. */
        min-width: calc(var(--count-plans) * var(--width-price-box-min));
        padding: 20px 5px;
        border-radius: 16px;
        color: var(--color-box-copy);
        background: var(--color-background-box);
        margin: 0 16px;

        @media screen and (width <= 700px) {
            margin: 0 8px;
        }

        h2 {
            font-weight: 550;
            font-size: 28px;
            line-height: 28px;
            padding-left: 14px;
            margin: 8px 0 16px;

            &.with-fine-print {
                display: flex;
                /* Keep fine-print to same distance from
                   the dashed border to the right as the
                   heading text is to the left. */
                padding: 0 14px;

                small {
                    flex: 0 1 min-content;
                    margin-left: auto;
                    font-weight: 350;
                    font-size: 14px;
                    line-height: 14px;
                    text-align: right;
                    color: var(--color-box-copy-fine-print);
                }
            }
        }

        ul {
            font-family: var(--font-ops);
            font-weight: 400;
            font-size: 15px;
        }

        li {
            margin-bottom: 10px;
            line-height: 21px;
        }

        .price-box {
            height: 100%;
            display: flex;
            flex-direction: column;
            border-right: 1px dashed hsl(223deg 40% 25% / 20%);

            &:last-child {
                border-right: 0;
            }

            /* Make sure flexing text-content boxes
               occupy their full with, but account
               for padding with border-box sizing. */
            .text-content {
                box-sizing: border-box;
                width: 100%;
                margin: 0 auto;
            }

            /* Set right and left padding on the
               bottom box so that buttons align
               to the text column above. */
            .bottom {
                padding: 0 16px;

                .text-content {
                    /* But allow buttons and price info
                       a bit more breathing room. */
                    padding: 0;
                }
            }
        }

        .text-content {
            padding: 0 16px;
        }

        .bottom {
            /* Push to the bottom of the price box. */
            margin-top: auto;
        }

        .standard-price-box {
            display: flex;
            /* Handle a discount line, when
               needed. */
            flex-wrap: wrap;
            align-items: flex-start;
            gap: 4px;
            margin: 24px 0 6px;
            font-weight: 400;

            /* For supporting browsers, constrain the height
               of the standard price box when it includes a
               discount. This keeps discount tooltips on the
               same horizontal line, while also maintaining
               alignment of non-discounted price box prices. */
            &:has(.discount) {
                height: var(--height-discounted-price-box);
            }

            .price {
                font-size: 38px;
                font-weight: 400;
                line-height: 1;
                letter-spacing: -1px;
            }

            .currency-symbol {
                opacity: 0.5;
            }

            .details {
                flex: 1 0 0;

                p {
                    margin: 2px 0 0;
                    font-size: 15px;
                    line-height: 17px;
                }
            }

            .discount {
                /* Keep the discount to its own
                   line in the wrapping flexbox. */
                flex: 0 0 100%;
                /* But move it to the top of the
                   flex area. */
                order: -1;
                text-align: center;
                padding: 9px 0 10px;
                margin-bottom: 9px;
                border-radius: 30px;
                background-color: hsl(210deg 83% 98%);
                position: relative;
                font-family: var(--font-ops);
                font-size: 15px;
                /* Use padding to better position
                   text within its single line. */
                line-height: 1;

                @media screen and (width <= 1240px) {
                    /* Pad the discount balloon... */
                    padding: 8px 5px 9px;
                    /* But pull out the margins an equal
                       amount so it can breathe. */
                    margin: 0 -5px 9px;
                }

                & b {
                    font-weight: 650;
                }

                &::after {
                    content: "";
                    background-image: var(--icon-discount-tooltip-curve);
                    display: block;
                    width: 35px;
                    height: 14px;
                    bottom: -14px;
                    left: calc(50% - 17.5px);
                    position: absolute;
                }
            }

            .price,
            .details {
                /* Preserve a height for allowing
                   price details to wrap as many
                   as three lines. */
                min-height: var(--height-price-details-min);
            }
        }
    }

    .additional-pricing-information {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: auto;
        column-gap: 32px;
        max-width: 912px;
        margin: 0 auto;

        @media screen and (width <= 810px) {
            grid-template-columns: minmax(0, 456px);
            justify-content: center;
            row-gap: 32px;
        }

        header {
            position: relative;
            padding: 0 16px 0 32px;

            &::before {
                display: block;
                content: "";
                width: 32px;
                height: 56px;
                position: absolute;
                background-color: var(--color-background-box);
                top: 30px;
                left: -0.5px;
                mask-position: center;
                mask-repeat: no-repeat;
                mask-image: var(--icon-question-header-swoosh);
            }

            h2 {
                font-family: var(--font-ops);
                font-weight: 500;
                font-size: 30px;
                line-height: 38px;
                margin: 0;
            }

            p {
                font-weight: 400;
                font-size: 16px;
                margin: 0;
                margin-bottom: 6px;
            }

            a {
                color: inherit;
                text-decoration-color: var(--color-link-underline-alternate);

                &:hover {
                    text-decoration: underline;
                    text-decoration-color: var(
                        --color-link-underline-alternate-hover
                    );
                }
            }
        }

        .text-content {
            color: var(--color-box-copy);
            background: var(--color-background-box);
            padding: 20px 32px;
            border-radius: 16px;

            b {
                font-weight: 600;
            }
        }

        h3 {
            margin: 0 0 6px;
            font-weight: 500;
            font-size: 22px;
            line-height: 28px;
        }

        ul {
            margin-bottom: 12px;
        }

        li {
            font-size: 15px;
            margin-bottom: 4px;
        }

        p {
            margin: 0;
        }

        .sponsorship-button {
            display: block;
            font-weight: 550;
            font-size: 15px;
            line-height: 20px;
            text-align: center;
            padding: 8px 10px;
            margin-bottom: 6px;
        }

        .contact-note {
            font-weight: 400;
            font-size: 14px;
        }
    }

    @media screen and (width <= 500px) {
        .additional-pricing-information {
            margin: 0 8px;

            header {
                padding-bottom: 29px;
            }

            p {
                display: none;
            }
        }
    }

    .button {
        display: block;
        font-family: var(--font-ss3);
        font-weight: 550;
        font-size: 15px;
        text-align: center;
        text-decoration: none;
        letter-spacing: 0.06ch;
        padding: 8px 10px;
        border-radius: 4px;
        /* Position relatively for discount tab */
        position: relative;
        z-index: 5;
    }

    .button-placeholder {
        /* Empty element for maintaining the
           layout on plans that otherwise have
           no button. */
        height: 37.5px;
        visibility: hidden;
    }

    .get-started-button {
        color: hsl(0deg 0% 100%);
        background-color: hsl(146deg 92% 26%);

        &:hover {
            text-decoration: none;
            color: hsl(0deg 0% 100%);
            background-color: hsl(146deg 92% 24%);
        }
    }

    .upgrade-button {
        color: hsl(0deg 0% 100%);
        background-color: hsl(219deg 62% 54%);

        &:hover {
            text-decoration: none;
            color: hsl(0deg 0% 100%);
            background-color: hsl(219deg 62% 50%);
        }
    }

    .current-plan-button,
    .current-plan-descriptor {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5ch;
        color: hsl(147deg 57% 25%);
        background-color: hsl(152deg 79% 24% / 5%);

        .current-plan-icon {
            width: 22px;
            height: 22px;
            display: block;
            background-color: currentcolor;
            mask-position: center;
            mask-repeat: no-repeat;
            mask-image: var(--icon-current-plan-icon);
        }
    }

    .current-plan-descriptor {
        /* Pad and lead the descriptor
           to better match other buttons */
        padding: 1.75px 0;
        line-height: 16px;
        background-color: transparent;
        border: 1px solid hsl(152deg 79% 24% / 10%);
        font-weight: normal;
    }

    .current-plan-button:hover {
        text-decoration: none;
        color: hsl(147deg 57% 25%);
        background-color: hsl(152deg 79% 24% / 14%);
    }

    .sponsorship-button {
        color: hsl(147deg 57% 25%);
        background-color: hsl(152deg 79% 24% / 10%);

        &:hover {
            text-decoration: none;
            color: hsl(147deg 57% 25%);
            background-color: hsl(146deg 92% 24% / 15%);
        }
    }

    &.showing-cloud {
        --count-plans: 3;

        .self-hosted-scroll,
        .self-hosted-plan-pricing,
        .self-hosted-additional-pricing {
            display: none;
        }

        .cloud-plan-title {
            position: relative;

            /* Show curvature on cloud tab. */
            &::before {
                display: block;
            }

            &::after {
                display: block;
            }

            p {
                border-bottom: 1px dashed hsl(223deg 40% 25% / 20%);
                margin: 0 10px;
            }

            @media screen and (width <= 700px) {
                h2 {
                    border-bottom: 1px dashed hsl(223deg 40% 25% / 20%);
                    height: 100%;
                    margin: 0 10px;
                }
            }

            @media screen and (width <= 500px) {
                h2 {
                    margin: 0;
                }
            }
        }

        .self-hosted-plan-title {
            border-radius: 16px 16px 0 14px;
            margin-bottom: 2px;
            background-color: var(--color-background-box-muted);

            &:hover {
                background-color: var(--color-background-box-muted-hover);
            }
        }
    }

    &.showing-self-hosted {
        --count-plans: 4;

        .cloud-scroll,
        .cloud-plan-pricing,
        .cloud-additional-pricing {
            display: none;
        }

        .cloud-plan-title {
            border-radius: 16px 16px 14px 0;
            margin-bottom: 2px;
            background-color: var(--color-background-box-muted);

            &:hover {
                background-color: var(--color-background-box-muted-hover);
            }
        }

        .self-hosted-plan-title {
            position: relative;

            /* Show curvature on self-hosted tab. */
            &::before {
                display: block;
            }

            &::after {
                display: block;
            }

            p {
                border-bottom: 1px dashed hsl(223deg 40% 25% / 20%);
                margin: 0 10px;
            }

            @media screen and (width <= 700px) {
                h2 {
                    border-bottom: 1px dashed hsl(223deg 40% 25% / 20%);
                    height: 100%;
                    margin: 0 10px;
                }
            }

            @media screen and (width <= 500px) {
                h2 {
                    margin: 0;
                }
            }
        }
    }

    .is-self-hosted-realm {
        /* Don't display buttons on cloud plans
           when viewed by self-hosters. */
        .cloud-plan-pricing .bottom .text-content {
            display: none;
        }
    }

    @media screen and (width <= 1140px) {
        .self-hosted-plan-pricing {
            ul {
                font-size: 14px;
            }

            .standard-price-box {
                --height-price-details-min: 48px;
                --height-discounted-price-box: 91px;

                .price {
                    font-size: 32px;
                }

                .details {
                    p {
                        font-size: 13px;
                        line-height: 16px;
                    }
                }

                .discount {
                    font-size: 13px;
                }
            }
        }
    }

    @media screen and (width <= 940px) {
        /* This block of styles duplicates the adjustments
           to .self-hosted-plan-pricing above; because of the
           fewer number of Cloud plans, we don't need these
           adjustments until this breakpoint. */
        .cloud-plan-pricing {
            ul {
                font-size: 14px;
            }

            .standard-price-box {
                --height-price-details-min: 48px;
                --height-discounted-price-box: 91px;

                .price {
                    font-size: 32px;
                }

                .details {
                    p {
                        font-size: 13px;
                        line-height: 16px;
                    }
                }

                .discount {
                    font-size: 13px;
                }
            }
        }

        h1 {
            font-size: 40px;
        }

        .h1-subheader {
            font-size: 16px;
        }

        .pricing-tab {
            h2 {
                font-size: 24px;
                line-height: 26px;
                margin-bottom: 5px;
            }

            p {
                font-size: 14px;
                padding-bottom: 10px;
            }
        }

        .pricing-pane {
            h2 {
                font-size: 22px;
                margin: 4px 0 12px;
            }
        }
    }

    @media screen and (width <= 920px) {
        .additional-pricing-information header h2 {
            font-size: 24px;
        }
    }

    @media screen and (width <= 500px) {
        .pricing-tab h2 {
            font-size: 20px;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: showroom.css]---
Location: zulip-main/web/styles/portico/showroom.css

```text
:root.dark-theme {
    color-scheme: dark;
}

body {
    --base-font-size-px: 16px;
    width: 100%;
    margin: 0;
    padding: 0;
    font-size: var(--base-font-size-px);
    /* The line-height used in most of the UI should be at least
       its legacy value, but should expand with larger base
       line-height values. */
    line-height: max(
        var(--legacy-body-line-height-unitless),
        var(--base-line-height-unitless)
    );
    font-family: "Source Sans 3 VF", sans-serif;
    font-weight: unset; /* override value in legacy_portico.css */
    color: var(--color-text-default);
    background-color: var(--color-background);
}

.showroom-wrapper {
    display: flex;
    flex-flow: column;
    gap: 20px;
    padding: 40px 20px;
}

.showroom-controls-section {
    display: grid;
    grid-template-columns: [control-name-start] max-content [control-name-end control-input-start] 1fr [control-input-end];
    gap: 10px;
    margin-top: 50px;
    width: min(100%, 500px);
}

.showroom-controls {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: control-name-start / control-input-end;
    grid-auto-rows: 1fr;
    gap: 10px;
    background-color: var(--color-background);
    border: solid 1px;
    padding: 10px;
    width: 100%;
}

.showroom-control {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: control-name-start / control-input-end;
    gap: 10px;
}

.showroom-control-element {
    font-size: inherit;
    font-family: inherit;
}

.showroom-control-label {
    cursor: pointer;
    grid-column: control-name-start / control-name-end;
    align-self: center;
}

.showroom-control-setting {
    grid-column: control-input-start / control-input-end;
}

.showroom-control-setting-multiple {
    display: flex;
    align-items: center;
    gap: 10px;
}

.hidden {
    display: none !important;
}

.showroom-controls-label {
    grid-column: control-name-start / control-input-end;
    margin-top: 10px;
    font-size: 1.4em;
    font-weight: 600;
}

.showroom-button-grid {
    display: grid;
    grid-template-areas: "showroom-component-button-intent-label showroom-component-action-button-group showroom-component-icon-button-group";
    grid-template-columns: repeat(3, max-content);
    gap: 15px 30px;
}

.showroom-component-button-intent-group {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    place-items: center start;
}

.showroom-component-button-intent-label {
    grid-area: showroom-component-button-intent-label;
}

.showroom-component-action-button-group,
.showroom-component-action-button-label {
    grid-area: showroom-component-action-button-group;
}

.showroom-component-icon-button-group,
.showroom-component-icon-button-label {
    grid-area: showroom-component-icon-button-group;
}

.showroom-component-action-button-group,
.showroom-component-icon-button-group {
    display: flex;
    flex-flow: row wrap;
    gap: 15px;
}

.showroom-component-button-intent-label,
.showroom-component-action-button-label,
.showroom-component-icon-button-label {
    font-size: 1.1em;
    font-weight: 500;
}

#showroom_component_banner_select_intent {
    text-transform: capitalize;
}

#showroom_component_banner_default_wrapper {
    width: min(100%, 800px);
    margin: 0 auto;
}

.showroom-filter-input-container {
    width: clamp(200px, 100%, 400px);
}
```

--------------------------------------------------------------------------------

---[FILE: stats.css]---
Location: zulip-main/web/styles/portico/stats.css

```text
body {
    font-family: "Source Sans 3 VF", sans-serif !important;
    background-color: hsl(0deg 0% 98%);
}

p {
    margin-bottom: 0;
}

.app-main {
    padding: 0;
    width: auto;
    max-width: none;
}

.svg-container {
    margin: 20px;
}

.center-charts {
    margin: 30px;
}

.stats-page .alert,
.analytics-page-header {
    text-align: center;
}

.summary-stats {
    vertical-align: top;
    margin: 0 auto;
    padding: 20px;
    border: 2px solid hsl(0deg 0% 93%);
    background-color: hsl(0deg 0% 100%);
    width: 395px;

    & h1 {
        margin-top: 0;
        font-size: 1.5em;
    }
}

.flex-container {
    display: flex;
    flex-flow: wrap;
    justify-content: space-around;
}

.chart-container {
    vertical-align: top;
    margin: 10px 0;
    padding: 20px;
    border: 2px solid hsl(0deg 0% 93%);
    background-color: hsl(0deg 0% 100%);

    & button {
        position: relative;
        z-index: 1;
    }

    & h1 {
        margin-top: 0;
        font-size: 1.5em;
    }

    &:not(.pie-chart) .number-stat {
        position: relative;
        top: -30px;
    }

    .button-container {
        position: relative;
        z-index: 1;
        margin-bottom: 5px;
    }
}

.analytics-page-header {
    margin-left: 10px;
}

.rangeslider-container {
    user-select: none;
}

.rangeselector text {
    font-weight: 400;
}

.pie-chart {
    .number-stat {
        float: left;
        font-size: 0.8em;
        font-weight: 400;
    }
}

.buttons button {
    background-color: hsl(0deg 0% 94%);

    &.selected {
        background-color: hsl(0deg 0% 85%);
    }
}

.button {
    font-family: "Source Sans 3 VF", sans-serif !important;
    border: none;
    border-radius: 4px;
    outline: none;
    padding: 2px 6px;

    &:hover {
        background-color: hsl(0deg 0% 84%) !important;
    }
}

.docs_link a {
    font-weight: 300;
    color: inherit;
    text-decoration: none;
}

.last-update {
    margin: 0 0 30px;

    font-size: 0.8em;
    font-weight: 400;
    text-align: center;
    color: hsl(0deg 0% 67%);
}

#users_hover_humans,
#read_hover_everyone,
#hover_human {
    margin-left: 10px;
}

#id_messages_sent_by_client {
    min-height: 100px;
    width: 750px;
    position: relative;
}

#id_messages_sent_by_message_type {
    height: 300px;
    width: 750px;
    position: relative;
}

#id_messages_sent_over_time,
#id_messages_read_over_time {
    height: 400px;
    width: 750px;
    position: relative;

    &[last_value_is_partial="true"] .points path:last-of-type {
        opacity: 0.5;
    }
}

#id_number_of_users {
    height: 370px;
    width: 750px;
    position: relative;
}

#id_stats_errors {
    display: none;
}

#pie_messages_sent_by_type_total {
    float: right;
}

#users_hover_info,
#read_hover_info,
#hoverinfo {
    display: none;
    font-size: 0.8em;
    font-weight: 400;
    position: relative;
    float: right;
    height: 0;
    top: -25px;
}

.spinner::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    margin-top: -15px;
    margin-left: -15px;
    border-radius: 50%;
    border: 1px solid hsl(0deg 0% 80%);
    border-top-color: hsl(155deg 93% 42%);
    animation: spinner 1s linear infinite;
}

@keyframes spinner {
    to {
        transform: rotate(360deg);
    }
}
```

--------------------------------------------------------------------------------

````
