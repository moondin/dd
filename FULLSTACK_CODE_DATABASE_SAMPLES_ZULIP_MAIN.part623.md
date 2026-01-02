---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 623
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 623 of 1290)

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

---[FILE: inbox_util.ts]---
Location: zulip-main/web/src/inbox_util.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import type {Filter} from "./filter";
import * as stream_color from "./stream_color.ts";
import * as stream_data from "./stream_data.ts";

export let filter: Filter | undefined;
let is_inbox_visible = false;

export function set_filter(new_filter: Filter | undefined): void {
    if (new_filter !== undefined) {
        assert(new_filter.is_channel_view());
    }
    filter = new_filter;
}

export function is_channel_view(): boolean {
    // We may support other filters in the future, but for now,
    // we filtering by a single channel.
    return filter !== undefined;
}

export function current_filter(): Filter | undefined {
    return filter;
}

export function get_channel_id(): number {
    assert(filter !== undefined);
    const narrow_channel_stream_id_string = filter.terms_with_operator("channel")[0]!.operand;
    return Number.parseInt(narrow_channel_stream_id_string, 10);
}

export function set_visible(value: boolean): void {
    is_inbox_visible = value;
}

export function is_visible(): boolean {
    return is_inbox_visible;
}

export function update_stream_colors(): void {
    if (!is_visible()) {
        return;
    }

    const $stream_headers = $(".inbox-streams-container .inbox-header");
    $stream_headers.each((_index, stream_header) => {
        const $stream_header = $(stream_header);
        const stream_id = Number.parseInt($stream_header.attr("data-stream-id")!, 10);
        if (!stream_id) {
            return;
        }
        const color = stream_data.get_color(stream_id);
        const background_color = stream_color.get_recipient_bar_color(color);

        const $stream_privacy_icon = $stream_header.find(".stream-privacy");
        if ($stream_privacy_icon.length > 0) {
            $stream_privacy_icon.css("color", stream_color.get_stream_privacy_icon_color(color));
        }

        $stream_header.css("background", background_color);
    });
}
```

--------------------------------------------------------------------------------

---[FILE: information_density.ts]---
Location: zulip-main/web/src/information_density.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import {$t} from "./i18n.ts";
import * as resize from "./resize.ts";
import {stringify_time} from "./timerender.ts";
import {user_settings} from "./user_settings.ts";

// These are all relative-unit values for Source Sans Pro VF,
// as opened and inspected in FontForge.
// Source Sans Prof VF reports an em size of 1000, which is
// necessary to know to calculate proper em units.
const BODY_FONT_EM_SIZE = 1000;
// The Typo Ascent Value is reported as 1024, but both Chrome
// and Firefox act as though it is 1025, so that value is used
// here. It represents the portion of the content box above the
// baseline.
const BODY_FONT_ASCENT = 1025;
// The Typo Descent Value is reported as 400. It is the portion
// of the content box below the baseline.
const BODY_FONT_DESCENT = 400;
// The BODY_FONT_CONTENT_BOX size is calculated by adding the
// Typo Ascent and Typo Descent values. The content box for
// Source Sans Pro VF exceeds the size of its em box, meaning
// that the `font-size` value will render text that is smaller
// than the size of the content area. For example, setting
// `font-size: 100px` on Source Sans Prof VF produces a content
// area of 142.5px.
// Note also that the content box is therefore clipped when the
// line-height (in ems or as a unitless value) is less than the
// MAXIMUM_BLOCK_HEIGHT_IN_EMS as calculated below.
const BODY_FONT_CONTENT_BOX = BODY_FONT_ASCENT + BODY_FONT_DESCENT;
// The maximum block height is derived from the content area
// made by an anonymous text node in Source Sans Pro VF.
// This ensures that even as line heights scale above 1.425,
// text-adjacent elements can be sized in scale to the text's
// content area. This is necessary to know, because an element
// such as a checkbox or emoji looks nice occupying the full
// line-height, but only when the text's content area is less
// than the line-height.
const MAXIMUM_BLOCK_HEIGHT_IN_EMS = BODY_FONT_CONTENT_BOX / BODY_FONT_EM_SIZE;

export const NON_COMPACT_MODE_FONT_SIZE_PX = 16;
export const NON_COMPACT_MODE_LINE_HEIGHT_PERCENT = 140;

export const INFO_DENSITY_VALUES_DICT = {
    web_font_size_px: {
        default: NON_COMPACT_MODE_FONT_SIZE_PX,
        minimum: 12,
        maximum: 20,
        // by how much the value will be changed on clicking +/- buttons.
        step_value: 1,
    },
    web_line_height_percent: {
        default: NON_COMPACT_MODE_LINE_HEIGHT_PERCENT,
        minimum: 122,
        maximum: 158,
        // by how much the value will be changed on clicking +/- buttons.
        step_value: 9,
    },
};

// TODO: Compute these from INFO_DENSITY_VALUES_DICT, rather than repeating it.
const line_height_supported_values = [122, 131, 140, 149, 158];

export const MIN_VALUES = {
    web_font_size_px: 12,
    web_line_height_percent: 122,
};
export const MAX_VALUES = {
    web_font_size_px: 20,
    web_line_height_percent: 158,
};

function set_vertical_alignment_values(line_height_unitless: number): void {
    // We work in ems to keep this agnostic to the font size.
    const line_height_in_ems = line_height_unitless;
    const text_content_box_height_in_ems = MAXIMUM_BLOCK_HEIGHT_IN_EMS;
    // We calculate the descent area according to the BODY_FONT values. However,
    // to make that em value relative to the size of the content box, we need
    // to multiply that by the maximum block height, which is the content
    // box's em square (versus the em square of the value set on `font-size`).
    const descent_area_in_ems =
        (BODY_FONT_DESCENT / BODY_FONT_CONTENT_BOX) * MAXIMUM_BLOCK_HEIGHT_IN_EMS;

    // The height of line-fitted elements, such as inline emoji, is the
    // lesser of either the line height or the height of the adjacent
    // text content box.
    const line_fitted_height_in_ems = Math.min(line_height_in_ems, text_content_box_height_in_ems);

    // We obtain the correct vertical offset by taking the negative value
    // of the descent area, and adding it to half any non-zero difference
    // between the content box and the fitted line height.
    const line_fitted_vertical_align_offset_in_ems =
        -descent_area_in_ems + (text_content_box_height_in_ems - line_fitted_height_in_ems) / 2;

    $(":root").css("--base-maximum-block-height-em", `${MAXIMUM_BLOCK_HEIGHT_IN_EMS}em`);
    $(":root").css(
        "--line-fitted-vertical-align-offset-em",
        `${line_fitted_vertical_align_offset_in_ems}em`,
    );
}

export function set_base_typography_css_variables(): void {
    const font_size_px = user_settings.web_font_size_px;
    const line_height_percent = user_settings.web_line_height_percent;
    const line_height_unitless = line_height_percent / 100;
    const line_height_px = line_height_unitless * font_size_px;
    /* This percentage is a legacy value, rounding up from .294;
       additional logic might be useful to make this adjustable;
       likewise with the doubled value. */
    const markdown_interelement_space_fraction = 0.3;
    const markdown_interelement_space_px = line_height_px * markdown_interelement_space_fraction;

    $(":root").css("--base-line-height-unitless", line_height_unitless);
    $(":root").css("--base-font-size-px", `${font_size_px}px`);
    $(":root").css("--markdown-interelement-space-px", `${markdown_interelement_space_px}px`);
    $(":root").css(
        "--markdown-interelement-doubled-space-px",
        `${markdown_interelement_space_px * 2}px`,
    );

    set_vertical_alignment_values(line_height_unitless);
    resize.resize_page_components();
}

export function calculate_timestamp_widths(): void {
    const base_font_size_px = user_settings.web_font_size_px;
    const $temp_time_div = $("<div>");
    $temp_time_div.attr("id", "calculated-timestamp-widths");
    // Size the div to the width of the largest timestamp,
    // but the div out of the document flow with absolute
    // positioning.
    // We set the base font-size ordinarily on body so that
    // the correct em-size timestamps can be calculated along
    // with all the other information density values.
    $temp_time_div.css({
        "font-size": base_font_size_px,
        width: "max-content",
        visibility: "hidden",
        position: "absolute",
        top: "-100vh",
    });
    // We should get a reasonable max-width by looking only at
    // the first and last minutes of AM and PM
    const candidate_times = ["00:00", "11:59", "12:00", "23:59"];

    for (const time of candidate_times) {
        const $temp_time_element = $("<a>");
        $temp_time_element.attr("class", "message-time");
        // stringify_time only returns the time, so the date here is
        // arbitrary and only required for creating a Date object
        const candidate_timestamp = stringify_time(Date.parse(`1999-07-01T${time}`));
        $temp_time_element.text(candidate_timestamp);
        $temp_time_div.append($temp_time_element);
    }

    // Append the <div> element to calculate the maximum rendered width
    $("body").append($temp_time_div);
    const max_timestamp_width = $temp_time_div.width();
    // Set the width as a CSS variable
    $(":root").css("--message-box-timestamp-column-width", `${max_timestamp_width}px`);
    // Clean up by removing the temporary <div> element
    $temp_time_div.remove();
}

function determine_container_query_support(): void {
    const body = document.querySelector("body");
    const test_container = document.createElement("div");
    const test_child = document.createElement("div");
    test_container.classList.add("container-query-test");
    test_child.classList.add("container-query-test-child");
    test_container.append(test_child);

    body?.append(test_container);

    if (test_child?.getClientRects()[0]?.y === 0) {
        /* Conforming browsers will place the child element
           at the very top of the viewport. */
        body?.classList.add("with-container-query-support");
    } else {
        body?.classList.add("without-container-query-support");
    }

    test_container?.remove();
}

export function initialize(): void {
    set_base_typography_css_variables();
    // We calculate the widths of a candidate set of timestamps,
    // and use the largest to set `--message-box-timestamp-column-width`
    calculate_timestamp_widths();
    determine_container_query_support();
}

export const information_density_properties_schema = z.enum([
    "web_font_size_px",
    "web_line_height_percent",
]);

export function enable_or_disable_control_buttons($container: JQuery): void {
    const info_density_properties = z
        .array(information_density_properties_schema)
        .parse(["web_font_size_px", "web_line_height_percent"]);
    for (const property of info_density_properties) {
        const $button_group = $container.find(`[data-property='${CSS.escape(property)}']`);
        const $current_elem = $button_group.find<HTMLInputElement>(".current-value");
        const current_value = Number.parseInt($current_elem.val()!, 10);

        $button_group
            .find(".default-button")
            .prop("disabled", current_value === INFO_DENSITY_VALUES_DICT[property].default);
        $button_group
            .find(".increase-button")
            .prop("disabled", current_value >= INFO_DENSITY_VALUES_DICT[property].maximum);
        $button_group
            .find(".decrease-button")
            .prop("disabled", current_value <= INFO_DENSITY_VALUES_DICT[property].minimum);
    }
}

export function find_new_supported_value_for_setting(
    $elem: JQuery,
    property: "web_font_size_px" | "web_line_height_percent",
    current_value: number,
): number {
    if (current_value > INFO_DENSITY_VALUES_DICT[property].maximum) {
        return INFO_DENSITY_VALUES_DICT[property].maximum;
    }

    if (current_value < INFO_DENSITY_VALUES_DICT[property].minimum) {
        return INFO_DENSITY_VALUES_DICT[property].minimum;
    }

    // We know the value is inside the range of valid values, but not
    // a recommended value. This is only possible with line height,
    // where we allow any integer in the database, but only offer
    // certain steps in the UI.
    assert(property === "web_line_height_percent");

    if ($elem.hasClass("increase-button")) {
        return line_height_supported_values.find((valid_value) => valid_value > current_value)!;
    }

    return line_height_supported_values.findLast((valid_value) => valid_value < current_value)!;
}

export function check_setting_has_recommended_value(
    property: "web_font_size_px" | "web_line_height_percent",
    current_value: number,
): boolean {
    if (current_value > INFO_DENSITY_VALUES_DICT[property].maximum) {
        return false;
    }

    if (current_value < INFO_DENSITY_VALUES_DICT[property].minimum) {
        return false;
    }

    if (property === "web_font_size_px") {
        return true;
    }

    return line_height_supported_values.includes(current_value);
}

export function get_new_value_for_information_density_settings(
    $elem: JQuery,
    changed_property: "web_font_size_px" | "web_line_height_percent",
): number {
    const $current_elem = $elem.closest(".button-group").find<HTMLInputElement>(".current-value");
    const current_value = Number.parseInt($current_elem.val()!, 10);

    if ($elem.hasClass("default-button")) {
        return INFO_DENSITY_VALUES_DICT[changed_property].default;
    }

    if (!check_setting_has_recommended_value(changed_property, current_value)) {
        return find_new_supported_value_for_setting($elem, changed_property, current_value);
    }

    if ($elem.hasClass("increase-button")) {
        return current_value + INFO_DENSITY_VALUES_DICT[changed_property].step_value;
    }

    return current_value - INFO_DENSITY_VALUES_DICT[changed_property].step_value;
}

export function update_information_density_settings(
    $elem: JQuery,
    changed_property: "web_font_size_px" | "web_line_height_percent",
    for_settings_ui = false,
    new_value: number = get_new_value_for_information_density_settings($elem, changed_property),
): number {
    user_settings[changed_property] = new_value;
    $elem.closest(".button-group").find(".current-value").val(new_value);
    if (for_settings_ui) {
        let display_value = new_value.toString();
        if (changed_property === "web_line_height_percent") {
            display_value = get_string_display_value_for_line_height(new_value);
        }
        $elem.closest(".button-group").find(".display-value").text(display_value);
    }
    set_base_typography_css_variables();
    calculate_timestamp_widths();

    return new_value;
}

export function get_string_display_value_for_line_height(setting_value: number): string {
    const step_count =
        (setting_value - NON_COMPACT_MODE_LINE_HEIGHT_PERCENT) /
        INFO_DENSITY_VALUES_DICT.web_line_height_percent.step_value;
    let display_value;

    if (step_count % 1 === 0) {
        // If value is an integer, we just return here to avoid showing
        // 1.0 for 1.
        display_value = step_count.toString();
    } else {
        display_value = step_count.toFixed(1);
    }

    if (step_count > 0) {
        // We want to show "1" as "+1".
        return "+" + display_value;
    }
    return display_value;
}

export function get_tooltip_context_for_info_density_buttons(
    $elem: JQuery,
): Record<string, string | boolean> {
    const property = information_density_properties_schema.parse(
        $elem.closest(".button-group").attr("data-property"),
    );

    const is_default_button = $elem.hasClass("default-button");
    const new_value = get_new_value_for_information_density_settings($elem, property);
    const default_value = INFO_DENSITY_VALUES_DICT[property].default;
    const current_value = Number.parseInt(
        $elem.closest(".button-group").find<HTMLInputElement>(".current-value").val()!,
        10,
    );
    const is_current_value_default = current_value === default_value;

    let tooltip_first_line = "";
    let tooltip_second_line = "";
    if (property === "web_font_size_px") {
        if (is_default_button) {
            if (is_current_value_default) {
                tooltip_first_line = $t(
                    {defaultMessage: "Already at default font size ({default_value})"},
                    {default_value},
                );
            } else {
                tooltip_first_line = $t(
                    {defaultMessage: "Reset to default font size ({default_value})"},
                    {default_value},
                );
                tooltip_second_line = $t(
                    {defaultMessage: "Current font size: {current_value}"},
                    {current_value},
                );
            }
        } else if (!$elem.prop("disabled")) {
            tooltip_first_line = $t(
                {defaultMessage: "Change to font size {new_value}"},
                {new_value},
            );
        } else {
            if ($elem.hasClass("increase-button")) {
                const maximum_value = INFO_DENSITY_VALUES_DICT[property].maximum;
                if (current_value === maximum_value) {
                    tooltip_first_line = $t(
                        {defaultMessage: "Already at maximum font size ({maximum_value})"},
                        {maximum_value},
                    );
                } else {
                    tooltip_first_line = $t(
                        {
                            defaultMessage:
                                "Already above recommended maximum font size ({maximum_value})",
                        },
                        {maximum_value},
                    );
                }
            } else {
                const minimum_value = INFO_DENSITY_VALUES_DICT[property].minimum;
                if (current_value === minimum_value) {
                    tooltip_first_line = $t(
                        {defaultMessage: "Already at minimum font size ({minimum_value})"},
                        {minimum_value},
                    );
                } else {
                    tooltip_first_line = $t(
                        {
                            defaultMessage:
                                "Already below recommended minimum font size ({minimum_value})",
                        },
                        {minimum_value},
                    );
                }
            }
        }
    }

    if (property === "web_line_height_percent") {
        if (is_default_button) {
            if (is_current_value_default) {
                tooltip_first_line = $t({defaultMessage: "Already at default line spacing"});
            } else {
                const current_value_string =
                    get_string_display_value_for_line_height(current_value);
                tooltip_first_line = $t({defaultMessage: "Reset to default line spacing"});
                tooltip_second_line = $t(
                    {defaultMessage: "Current line spacing: {current_value_string}"},
                    {current_value_string},
                );
            }
        } else {
            if (!$elem.prop("disabled")) {
                if (new_value === default_value) {
                    tooltip_first_line = $t({defaultMessage: "Change to default line spacing"});
                } else {
                    const new_value_string = get_string_display_value_for_line_height(new_value);
                    tooltip_first_line = $t(
                        {defaultMessage: "Change to {new_value_string} line spacing"},
                        {new_value_string},
                    );
                }
            } else {
                if ($elem.hasClass("increase-button")) {
                    const maximum_value = INFO_DENSITY_VALUES_DICT[property].maximum;
                    if (current_value === maximum_value) {
                        tooltip_first_line = $t({
                            defaultMessage: "Already at maximum line spacing",
                        });
                    } else {
                        tooltip_first_line = $t({
                            defaultMessage: "Already above recommended maximum line spacing",
                        });
                    }
                } else {
                    const minimum_value = INFO_DENSITY_VALUES_DICT[property].minimum;
                    if (current_value === minimum_value) {
                        tooltip_first_line = $t({
                            defaultMessage: "Already at minimum line spacing",
                        });
                    } else {
                        tooltip_first_line = $t({
                            defaultMessage: "Already below recommended minimum line spacing",
                        });
                    }
                }
            }
        }
    }

    return {
        tooltip_first_line,
        tooltip_second_line,
    };
}
```

--------------------------------------------------------------------------------

---[FILE: info_overlay.ts]---
Location: zulip-main/web/src/info_overlay.ts

```typescript
import $ from "jquery";

import render_keyboard_shortcut from "../templates/keyboard_shortcuts.hbs";
import render_markdown_help from "../templates/markdown_help.hbs";
import render_search_operator from "../templates/search_operators.hbs";

import * as browser_history from "./browser_history.ts";
import * as common from "./common.ts";
import * as components from "./components.ts";
import type {Toggle} from "./components.ts";
import {$t, $t_html} from "./i18n.ts";
import * as keydown_util from "./keydown_util.ts";
import * as markdown from "./markdown.ts";
import * as overlays from "./overlays.ts";
import {page_params} from "./page_params.ts";
import {postprocess_content} from "./postprocess_content.ts";
import * as rendered_markdown from "./rendered_markdown.ts";
import * as scroll_util from "./scroll_util.ts";
import {current_user} from "./state_data.ts";
import {user_settings} from "./user_settings.ts";

// Make it explicit that our toggler is undefined until
// set_up_toggler is called.
export let toggler: Toggle | undefined;

function format_usage_html(...keys: string[]): string {
    return $t_html(
        {
            defaultMessage: "(or <key-html></key-html>)",
        },
        {
            "key-html": () => keys.map((key) => `<kbd>${key}</kbd>`).join("+"),
        },
    );
}

const markdown_help_rows = [
    {
        markdown: `**${$t({defaultMessage: "bold"})}**`,
        usage_html: format_usage_html("Ctrl", "B"),
    },
    {
        markdown: `*${$t({defaultMessage: "italic"})}*`,
        usage_html: format_usage_html("Ctrl", "I"),
    },
    {
        markdown: `~~${$t({defaultMessage: "strikethrough"})}~~`,
    },
    {
        markdown: ":heart:",
    },
    {
        markdown: `[${$t({defaultMessage: "Zulip website"})}](https://zulip.org)`,
        usage_html: format_usage_html("Ctrl", "Shift", "L"),
    },
    {
        markdown: `#**${$t({defaultMessage: "channel name"})}**`,
        effect_html: $t({defaultMessage: "(links to a channel)"}),
    },
    {
        markdown: `#**${$t({defaultMessage: "channel name"})}>${$t({defaultMessage: "topic name"})}**`,
        effect_html: $t({defaultMessage: "(links to topic)"}),
    },
    {
        markdown: `@**${$t({defaultMessage: "Joe Smith"})}**`,
        effect_html: $t(
            {defaultMessage: "(notifies {user})"},
            {user: $t({defaultMessage: "Joe Smith"})},
        ),
    },
    {
        markdown: `@_**${$t({defaultMessage: "Joe Smith"})}**`,
        effect_html: $t(
            {defaultMessage: "(links to profile but doesn't notify {user})"},
            {user: $t({defaultMessage: "Joe Smith"})},
        ),
    },
    {
        markdown: `@*${$t({defaultMessage: "support team"})}*`,
        effect_html: $t_html(
            {defaultMessage: "(notifies <z-user-group></z-user-group> group)"},
            {"z-user-group": () => `<b>${$t_html({defaultMessage: "support team"})}</b>`},
        ),
    },
    {
        markdown: "@**all**",
        effect_html: $t({defaultMessage: "(notifies all recipients)"}),
    },
    {
        markdown: `\
* ${$t({defaultMessage: "Milk"})}
* ${$t({defaultMessage: "Tea"})}
  * ${$t({defaultMessage: "Green tea"})}
  * ${$t({defaultMessage: "Black tea"})}
* ${$t({defaultMessage: "Coffee"})}`,
    },
    {
        markdown: `\
1. ${$t({defaultMessage: "Milk"})}
1. ${$t({defaultMessage: "Tea"})}
1. ${$t({defaultMessage: "Coffee"})}`,
    },
    {
        markdown: `> ${$t({defaultMessage: "Quoted"})}`,
    },
    {
        markdown: `\
\`\`\`quote
${$t({defaultMessage: "Quoted block"})}
\`\`\``,
    },
    {
        markdown: `\
\`\`\`spoiler ${$t({defaultMessage: "Always visible heading"})}
${$t({defaultMessage: "This text won't be visible until the user clicks."})}
\`\`\``,
    },
    {
        markdown: $t({defaultMessage: "Some inline `code`"}),
    },
    // These code block examples are chosen to include no strings needing translation.
    {
        markdown: `\
\`\`\`
def f():
    print("Zulip")
\`\`\``,
        usage_html: format_usage_html("Ctrl", "Shift", "C"),
    },
    {
        markdown: `\
\`\`\`python
def f():
    print("Zulip")
\`\`\``,
        // output_html required because we don't have pygments in the web app processor.
        output_html: `\
<div class="codehilite zulip-code-block" data-code-language="Python"><pre><div class="code-buttons-container">
    </span></div><span></span><code><span class="k">def</span><span class="w"> </span><span class="nf">f</span><span class="p">():</span>
    <span class="nb">print</span><span class="p">(</span><span class="s2">"Zulip"</span><span class="p">)</span>
</code></pre></div>`,
    },
    {
        markdown: $t(
            {defaultMessage: "Some inline math {math}"},
            {math: "$$ e^{i \\pi} + 1 = 0 $$"},
        ),
    },
    {
        markdown: `\
\`\`\`math
\\int_{0}^{1} f(x) dx
\`\`\``,
    },
    {
        markdown: `/me ${$t({defaultMessage: "is busy working"})}`,
        // output_html required since /me rendering is not done in Markdown processor.
        output_html: `<p><span class="sender_name">Iago</span> <span class="status-message">${$t({defaultMessage: "is busy working"})}</span></p>`,
    },
    {
        markdown: "<time:2023-05-28T13:30:00+05:30>",
    },
    {
        markdown: `/poll ${$t({defaultMessage: "What did you drink this morning?"})}
${$t({defaultMessage: "Milk"})}
${$t({defaultMessage: "Tea"})}
${$t({defaultMessage: "Coffee"})}`,
        // output_html required since poll rendering is done outside Markdown.
        output_html: `\
<div class="poll-widget">
    <h4 class="poll-question-header">${$t({defaultMessage: "What did you drink this morning?"})}</h4>
    <i class="fa fa-pencil poll-edit-question"></i>
    <ul class="poll-widget">
    <li>
        <button class="poll-vote">
            0
        </button>
        <span>${$t({defaultMessage: "Milk"})}</span>
    </li>
    <li>
        <button class="poll-vote">
            0
        </button>
        <span>${$t({defaultMessage: "Tea"})}</span>
    </li>
    <li>
        <button class="poll-vote">
            0
        </button>
        <span>${$t({defaultMessage: "Coffee"})}</span>
    </li>
    </ul>
</div>
`,
    },
    {
        markdown: `/todo ${$t({defaultMessage: "Today's tasks"})}
${$t({defaultMessage: "Task 1"})}: ${$t({defaultMessage: "This is the first task."})}
${$t({defaultMessage: "Task 2"})}: ${$t({defaultMessage: "This is the second task."})}
${$t({defaultMessage: "Last task"})}`,
        // output_html required since todo rendering is done outside Markdown.
        output_html: `\
<div class="message_content rendered_markdown">
    <div class="widget-content">
        <div class="todo-widget">
            <h4>${$t({defaultMessage: "Today's tasks"})}</h4>
            <ul class="todo-widget">
                <li>
                    <label class="checkbox">
                        <div>
                            <input type="checkbox" class="task" checked="checked">
                            <span class="rendered-checkbox"></span>
                        </div>
                        <div>
                            <s><strong>${$t({defaultMessage: "Task 1"})}:</strong> ${$t({defaultMessage: "This is the first task."})}</s>
                        </div>
                    </label>
                </li>
                <li>
                    <label class="checkbox">
                        <div>
                            <input type="checkbox" class="task">
                            <span class="rendered-checkbox"></span>
                        </div>
                        <div>
                            <strong>${$t({defaultMessage: "Task 2"})}:</strong> ${$t({defaultMessage: "This is the second task."})}
                        </div>
                    </label>
                </li>
                <li>
                    <label class="checkbox">
                        <div>
                            <input type="checkbox" class="task">
                            <span class="rendered-checkbox"></span>
                        </div>
                        <div>
                            <strong>${$t({defaultMessage: "Last task"})}</strong>
                        </div>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</div>
`,
    },
    {
        markdown: "---",
    },
    {
        note_html: $t_html(
            {
                defaultMessage:
                    "You can also make <z-link>tables</z-link> with this <z-link>Markdown-ish table syntax</z-link>.",
            },
            {
                "z-link": (content_html) =>
                    `<a target="_blank" rel="noopener noreferrer" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#wiki-tables">${content_html.join(
                        "",
                    )}</a>`,
            },
        ),
    },
];

export function set_up_toggler(): void {
    const helper_config: markdown.MarkdownHelpers = {
        ...markdown.web_app_helpers!,
        get_actual_name_from_user_id() {
            return $t({defaultMessage: "Joe Smith"});
        },
        get_user_id_from_name() {
            return 0;
        },
        get_user_group_from_name(name) {
            return {id: 0, name};
        },
        is_member_of_user_group() {
            return true;
        },
        stream_hash() {
            return "";
        },
        get_stream_by_name(stream_name) {
            return {stream_id: 0, name: stream_name};
        },
    };
    for (const row of markdown_help_rows) {
        if (row.markdown && !row.output_html) {
            const message = {
                raw_content: row.markdown,
                ...markdown.render(row.markdown, helper_config),
            };
            const rendered_content = new DOMParser().parseFromString(message.content, "text/html");
            // We remove all attributes from stream links in the markdown content since
            // we just want to display a mock template.
            for (const elt of rendered_content.querySelectorAll("a[data-stream-id]")) {
                const anchor_element = document.createElement("a");
                anchor_element.innerHTML = elt.innerHTML;
                elt.replaceWith(anchor_element);
            }
            message.content = rendered_content.body.innerHTML;
            row.output_html = postprocess_content(message.content);
        }
    }

    const $markdown_help = $(render_markdown_help({markdown_help_rows}));
    $markdown_help.find(".rendered_markdown").each(function () {
        rendered_markdown.update_elements($(this));
    });
    $(".informational-overlays .overlay-body").append($markdown_help);

    const $search_operators = $(
        render_search_operator({
            can_access_all_public_channels: !page_params.is_spectator && !current_user.is_guest,
        }),
    );
    $(".informational-overlays .overlay-body").append($search_operators);

    const $keyboard_shortcuts = $(render_keyboard_shortcut());
    $(".informational-overlays .overlay-body").append($keyboard_shortcuts);

    const opts = {
        selected: 0,
        child_wants_focus: true,
        values: [
            {label: $t({defaultMessage: "Keyboard shortcuts"}), key: "keyboard-shortcuts"},
            {label: $t({defaultMessage: "Message formatting"}), key: "message-formatting"},
            {label: $t({defaultMessage: "Search filters"}), key: "search-operators"},
        ],
        callback(_name: string | undefined, key: string) {
            $(".overlay-modal").hide();
            $(`#${CSS.escape(key)}`).show();
            scroll_util
                .get_scroll_element($(`#${CSS.escape(key)}`).find(".overlay-scroll-container"))
                .trigger("focus");
        },
    };

    toggler = components.toggle(opts);
    const $elem = toggler.get();
    $elem.addClass("large allow-overflow");

    const modals = opts.values.map((item) => {
        const key = item.key; // e.g. message-formatting
        const $modal = $(`#${CSS.escape(key)}`).find(".overlay-scroll-container");
        return $modal;
    });

    for (const $modal of modals) {
        scroll_util.get_scroll_element($modal).prop("tabindex", 0);
        keydown_util.handle({
            $elem: $modal,
            handlers: {
                ArrowLeft: toggler.maybe_go_left,
                ArrowRight: toggler.maybe_go_right,
            },
        });
    }

    $(".informational-overlays .overlay-tabs").append($elem);

    $("#keyboard-shortcuts .go-to-home-view-hotkey-help").toggleClass(
        "notdisplayed",
        !user_settings.web_escape_navigates_to_home_view,
    );
    common.adjust_mac_kbd_tags(".hotkeys_table .hotkey kbd");
    common.adjust_mac_kbd_tags("#markdown-instructions kbd");
}

export function show(target: string | undefined): void {
    const $overlay = $(".informational-overlays");

    if (!$overlay.hasClass("show")) {
        overlays.open_overlay({
            name: "informationalOverlays",
            $overlay,
            on_close() {
                browser_history.exit_overlay();
            },
        });
    }

    if (!toggler) {
        set_up_toggler();
    }

    if (target) {
        toggler!.goto(target);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: inputs.ts]---
Location: zulip-main/web/src/inputs.ts

```typescript
import $ from "jquery";

$("body").on(
    "click",
    ".filter-input .input-close-filter-button",
    function (this: HTMLElement, _e: JQuery.Event) {
        const $input = $(this).prev(".input-element");
        $input.val("").trigger("input");
        $input.trigger("blur");
    },
);
```

--------------------------------------------------------------------------------

````
