---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 455
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 455 of 1290)

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

---[FILE: .remarkrc.js]---
Location: zulip-main/starlight_help/src/.remarkrc.js

```javascript
// @ts-check

// We are using remarkLintRulesLintRecommended and
// remarkPresentLintMarkdownStyleGuide as our starting set of rules.
// None of the rules were giving an error on the starting set, but some
// rules were giving lots of warnings on the generated mdx. They are
// set to false in this file, we can add them back later as and when
// required.

/**
 * @import {Root} from "mdast"
 * @import {Preset, Processor} from "unified"
 */

import {toMarkdown} from "mdast-util-to-markdown";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkLintFencedCodeFlag from "remark-lint-fenced-code-flag";
import remarkLintFileExtension from "remark-lint-file-extension";
import remarkLintFinalDefinition from "remark-lint-final-definition";
import remarkLintHeadingIncrement from "remark-lint-heading-increment";
import remarkLintListItemSpacing from "remark-lint-list-item-spacing";
import remarkLintMaximumHeadingLength from "remark-lint-maximum-heading-length";
import remarkLintMaximumLineLength from "remark-lint-maximum-line-length";
import remarkLintNoDuplicateHeadings from "remark-lint-no-duplicate-headings";
import remarkLintNoFileNameIrregularCharacters from "remark-lint-no-file-name-irregular-characters";
import remarkLintNoFileNameMixedCase from "remark-lint-no-file-name-mixed-case";
import remarkLintNoUnusedDefinitions from "remark-lint-no-unused-definitions";
import remarkLintUnorderedListMarkerStyle from "remark-lint-unordered-list-marker-style";
import remarkMdx from "remark-mdx";
import remarkPresetLintMarkdownStyleGuide from "remark-preset-lint-markdown-style-guide";
import remarkPresetLintRecommended from "remark-preset-lint-recommended";
import remarkStringify from "remark-stringify";
import {lintRule} from "unified-lint-rule";

const stringifyOptions = {
    // Number all list items as 1, for compatibility with
    // remark-lint-ordered-list-marker-value.
    incrementListMarker: false,
};

/**
 * Make sure the linter fails if files need to be reformatted.  (The other rules
 * catch some but not all formatting issues, so this is needed to be sure we
 * don't silently ignore changes that would be made with --fix.)
 *
 * @this {Processor}
 * @param {...unknown} args
 */
function remarkLintNeedsReformatting(...args) {
    const settings = this.data("settings");
    if (
        settings === undefined ||
        !("checkReformatting" in settings) ||
        !settings.checkReformatting
    ) {
        return undefined;
    }
    return lintRule(
        "needs-reformatting",
        /** @param {Root} tree */
        (tree, file) => {
            const formatted = toMarkdown(tree, {
                ...settings,
                ...stringifyOptions,
                extensions: this.data("toMarkdownExtensions") || [],
            });
            if (formatted !== file.value) {
                file.message("Would be reformatted");
            }
        },
    )(...args);
}

/** @type {Preset} */
const remarkLintRules = {
    plugins: [
        remarkPresetLintMarkdownStyleGuide,
        remarkPresetLintRecommended,
        [remarkLintFinalDefinition, false],
        [remarkLintListItemSpacing, false],
        [remarkLintFileExtension, ["mdx"]],
        [remarkLintNoUnusedDefinitions, false],
        [remarkLintMaximumLineLength, false],
        [remarkLintFencedCodeFlag, false],
        [remarkLintNoFileNameIrregularCharacters, false],
        [remarkLintNoFileNameMixedCase, false],
        [remarkLintMaximumHeadingLength, false],
        [remarkLintNoDuplicateHeadings, false],
        [remarkLintHeadingIncrement, false],
        [remarkLintUnorderedListMarkerStyle, "*"],
        remarkLintNeedsReformatting,
    ],
};

/** @type {Preset} */
const config = {
    plugins: [
        remarkGfm,
        remarkMdx,
        [remarkFrontmatter, ["yaml"]],
        remarkLintRules,
        [remarkStringify, stringifyOptions],
    ],
};

export default config;
```

--------------------------------------------------------------------------------

---[FILE: content.config.ts]---
Location: zulip-main/starlight_help/src/content.config.ts

```typescript
import {docsLoader} from "@astrojs/starlight/loaders";
import {docsSchema} from "@astrojs/starlight/schema";
import {defineCollection} from "astro:content";

export const collections = {
    docs: defineCollection({loader: docsLoader(), schema: docsSchema()}),
};
```

--------------------------------------------------------------------------------

---[FILE: env.d.ts]---
Location: zulip-main/starlight_help/src/env.d.ts

```typescript
/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

--------------------------------------------------------------------------------

---[FILE: route_data.ts]---
Location: zulip-main/starlight_help/src/route_data.ts

```typescript
import assert from "node:assert";

import {defineRouteMiddleware} from "@astrojs/starlight/route-data";
import type {Paragraph} from "mdast";
import {toString} from "mdast-util-to-string";
import {remark} from "remark";
import remarkMdx from "remark-mdx";
import {visit} from "unist-util-visit";

function extractFirstParagraph(content: string): string | undefined {
    const tree = remark().use(remarkMdx).parse(content);

    let firstParagraph: string | undefined;

    visit(tree, "paragraph", (node: Paragraph) => {
        if (!firstParagraph) {
            // We need to convert the node to string so that links, emphasis, etc.
            // are converted to plain text.
            firstParagraph = toString(node);
            firstParagraph = firstParagraph.replaceAll(/\s+/g, " ").trim();
        }
    });

    return firstParagraph;
}

export const onRequest = defineRouteMiddleware((context) => {
    assert.ok(typeof context.locals.starlightRoute.entry.body === "string");
    context.locals.starlightRoute.head.push({
        tag: "meta",
        attrs: {
            name: "description",
            content: extractFirstParagraph(context.locals.starlightRoute.entry.body),
        },
    });

    const canonicalUrl = `https://zulip.com/help/${context.locals.starlightRoute.id}`;
    const existingCanonicalTag = context.locals.starlightRoute.head.find(
        (item) => item.tag === "link" && item.attrs?.rel === "canonical",
    );

    if (existingCanonicalTag) {
        existingCanonicalTag.attrs!.href = canonicalUrl;
    } else {
        // Starlight already has the canonical tag by default and this might
        // never get executed in practice. But it feels like a nice-to-have
        // if any upstream changes happen in starlight and that behaviour
        // changes.
        context.locals.starlightRoute.head.push({
            tag: "link",
            attrs: {
                rel: "canonical",
                href: canonicalUrl,
            },
        });
    }
});
```

--------------------------------------------------------------------------------

---[FILE: EmoticonTranslations.astro]---
Location: zulip-main/starlight_help/src/components/EmoticonTranslations.astro

```text
---
import EmojiCodes from "../../../static/generated/emoji/emoji_codes.json";

const nameToCodePoint: Record<string, string> = EmojiCodes.name_to_codepoint;
const rowHTML = (emoticon: string, codepoint: string, name: string) => `
<tr>
    <td><code>${emoticon}</code></td>
    <td>
        <img
            src="/static/generated/emoji/images-google-64/${codepoint}.png"
            alt="${name}"
            class="emoji-big">
    </td>
</tr>
`;

let body = "";
const emoticonConversions: Record<string, string> =
    EmojiCodes.emoticon_conversions;
for (const name of Object.keys(emoticonConversions)) {
    const emoticon: string = emoticonConversions[name]!;
    body += rowHTML(name, nameToCodePoint[emoticon.slice(1, -1)]!, emoticon);
}
---

<table>
    <thead>
        <tr>
            <th>Emoticon</th>
            <th>Emoji</th>
        </tr>
    </thead>
    <tbody>
        <Fragment set:html={body} />
    </tbody>
</table>
```

--------------------------------------------------------------------------------

---[FILE: FlattenedList.astro]---
Location: zulip-main/starlight_help/src/components/FlattenedList.astro

```text
---
import assert from "node:assert/strict";

import {fromHtml} from "hast-util-from-html";
import {toHtml} from "hast-util-to-html";

const tree = fromHtml(await Astro.slots.render("default"), {fragment: true});

const tree_with_removed_newlines = {
    type: "root",
    children: tree.children.filter((child) => {
        if (child.type === "text" && child.value === "\n") {
            return false;
        }
        return true;
    }),
};
const first_element = tree_with_removed_newlines.children[0];
assert.ok(
    first_element?.type === "element" &&
        ["ol", "ul"].includes(first_element.tagName),
);
const flattened = {
    ...first_element,
    children: tree_with_removed_newlines.children.flatMap((other) => {
        if (other.type === "comment") {
            return [];
        }
        assert.ok(other.type === "element");
        // Flatten only in case of matching tagName, for the rest, we
        // return the elements without flattening since asides, code
        // blocks and other elements can be part of a single list item
        // and we do not want to flatten them.
        if (other.tagName === first_element.tagName) {
            return other.children;
        }
        return [other];
    }),
};
---

<Fragment set:html={toHtml(flattened)} />
```

--------------------------------------------------------------------------------

---[FILE: FlattenedSteps.astro]---
Location: zulip-main/starlight_help/src/components/FlattenedSteps.astro

```text
---
import {Steps} from "@astrojs/starlight/components";

import FlattenedList from "./FlattenedList.astro";
---

<Steps><FlattenedList><slot /></FlattenedList></Steps>
```

--------------------------------------------------------------------------------

---[FILE: Footer.astro]---
Location: zulip-main/starlight_help/src/components/Footer.astro

```text
---
import {CORPORATE_ENABLED, SUPPORT_EMAIL} from "astro:env/client";

let footer_html = `<p>Don't see an answer to your question? <a href="mailto:${SUPPORT_EMAIL}">Contact this Zulip server's administrators</a> for support.</p>`;
if (CORPORATE_ENABLED) {
    footer_html = `<p>Your feedback helps us make Zulip better for everyone! Please <a href="/help/contact-support">contact us</a> with questions, suggestions, and feature requests.</p>`;
}
---

<footer class="sl-flex">
    <hr />
    <Fragment set:html={footer_html} />
</footer>

<style>
    @layer starlight.core {
        footer {
            flex-direction: column;
            gap: 1.5rem;
        }
    }
</style>
```

--------------------------------------------------------------------------------

---[FILE: Head.astro]---
Location: zulip-main/starlight_help/src/components/Head.astro

```text
---
import Default from "@astrojs/starlight/components/Head.astro";
---

<script src="../scripts/client/adjust_mac_kbd_tags.ts"></script>
<Default><slot /></Default>
```

--------------------------------------------------------------------------------

---[FILE: KeyboardTip.astro]---
Location: zulip-main/starlight_help/src/components/KeyboardTip.astro

```text
---
import assert from "node:assert/strict";

import type {Element} from "hast";
import {fromHtml} from "hast-util-from-html";
import {toHtml} from "hast-util-to-html";

import keyboard_svg from "../../../web/icons/keyboard.svg?raw";

const keyboard_icon_fragment = fromHtml(keyboard_svg, {fragment: true});
const keyboard_icon_first_child = keyboard_icon_fragment.children[0]!;
assert.ok(
    keyboard_icon_first_child.type === "element" &&
        keyboard_icon_first_child.tagName === "svg",
);
keyboard_icon_first_child.properties.class = "zulip-unplugin-icon";

// We want to add the `Keyboard tip: ` prefix without a line break or
// wrapping it in a paragraph. If we write `Keyboard tip: <slot />`,
// slot will be wrapped in it's own paragraph and thus will be placed on
// the next line as `Keyboard tip:`. We have to edit slot HTML tree
// directly instead to solve this. Same case applies for the keyboard
// icon we are inserting. We just inject the icon as raw svg.
const prefix_text_element: Element = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: [{type: "text", value: " Keyboard tip: "}],
};
const prefix_element_list = [keyboard_icon_first_child, prefix_text_element];

const tree = fromHtml(await Astro.slots.render("default"), {fragment: true});
const first_element = tree.children[0];
assert.ok(first_element?.type === "element");

first_element.children = [...prefix_element_list, ...first_element.children];
tree.children[0] = first_element;
---

<aside
    aria-label="Keyboard tip"
    class=`starlight-aside starlight-aside--tip keyboard-tip`
>
    <div class="starlight-aside__content">
        <Fragment set:html={toHtml(tree)} />
    </div>
</aside>
```

--------------------------------------------------------------------------------

---[FILE: NavigationSteps.astro]---
Location: zulip-main/starlight_help/src/components/NavigationSteps.astro

```text
---
import assert from "node:assert";

import {CORPORATE_ENABLED, SHOW_RELATIVE_LINKS} from "astro:env/client";

/* eslint-disable import/extensions */
import RawBarChartIcon from "~icons/zulip-icon/bar-chart?raw";
import RawBuildingIcon from "~icons/zulip-icon/building?raw";
import RawCreditCardIcon from "~icons/zulip-icon/credit-card?raw";
import RawEditIcon from "~icons/zulip-icon/edit?raw";
import RawGearIcon from "~icons/zulip-icon/gear?raw";
import RawGitPullRequestIcon from "~icons/zulip-icon/git-pull-request?raw";
import RawHashIcon from "~icons/zulip-icon/hash?raw";
import RawHelpIcon from "~icons/zulip-icon/help?raw";
import RawInfoIcon from "~icons/zulip-icon/info?raw";
import RawKeyboardIcon from "~icons/zulip-icon/keyboard?raw";
import RawManageSearchIcon from "~icons/zulip-icon/manage-search?raw";
import RawRocketIcon from "~icons/zulip-icon/rocket?raw";
import RawToolIcon from "~icons/zulip-icon/tool?raw";
import RawUserGroupCogIcon from "~icons/zulip-icon/user-group-cog?raw";
/* eslint-enable import/extensions */

const PERSONAL_SETTINGS_TYPE = "Personal settings";
const ORGANIZATION_SETTINGS_TYPE = "Organization settings";
const SHOW_BILLING_HELP_LINKS = CORPORATE_ENABLED;

// This list has been transformed one-off from `help_settings_links.py`, we
// have added a comment in that file to update this list in case of any
// changes.
const setting_link_mapping: Record<
    string,
    {
        setting_type: string;
        setting_name: string;
        setting_link: string;
    }
> = {
    // a mapping from the setting target that is the same as the final URL
    // breadcrumb to that setting to the name of its setting type, the setting
    // name as it appears in the user interface, and a relative link that can
    // be used to get to that setting
    profile: {
        setting_type: PERSONAL_SETTINGS_TYPE,
        setting_name: "Profile",
        setting_link: "/#settings/profile",
    },
    "account-and-privacy": {
        setting_type: PERSONAL_SETTINGS_TYPE,
        setting_name: "Account & privacy",
        setting_link: "/#settings/account-and-privacy",
    },
    preferences: {
        setting_type: PERSONAL_SETTINGS_TYPE,
        setting_name: "Preferences",
        setting_link: "/#settings/preferences",
    },
    notifications: {
        setting_type: PERSONAL_SETTINGS_TYPE,
        setting_name: "Notifications",
        setting_link: "/#settings/notifications",
    },
    "your-bots": {
        setting_type: PERSONAL_SETTINGS_TYPE,
        setting_name: "Bots",
        setting_link: "/#settings/your-bots",
    },
    "alert-words": {
        setting_type: PERSONAL_SETTINGS_TYPE,
        setting_name: "Alert words",
        setting_link: "/#settings/alert-words",
    },
    "uploaded-files": {
        setting_type: PERSONAL_SETTINGS_TYPE,
        setting_name: "Uploaded files",
        setting_link: "/#settings/uploaded-files",
    },
    topics: {
        setting_type: PERSONAL_SETTINGS_TYPE,
        setting_name: "Topics",
        setting_link: "/#settings/topics",
    },
    "muted-users": {
        setting_type: PERSONAL_SETTINGS_TYPE,
        setting_name: "Muted users",
        setting_link: "/#settings/muted-users",
    },
    "organization-profile": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Organization profile",
        setting_link: "/#organization/organization-profile",
    },
    "organization-settings": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Organization settings",
        setting_link: "/#organization/organization-settings",
    },
    "organization-permissions": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Organization permissions",
        setting_link: "/#organization/organization-permissions",
    },
    "default-user-settings": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Default user settings",
        setting_link: "/#organization/organization-level-user-defaults",
    },
    "emoji-settings": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Custom emoji",
        setting_link: "/#organization/emoji-settings",
    },
    "auth-methods": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Authentication methods",
        setting_link: "/#organization/auth-methods",
    },
    users: {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Users",
        setting_link: "/#organization/users/active",
    },
    deactivated: {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Users",
        setting_link: "/#organization/users/deactivated",
    },
    invitations: {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Users",
        setting_link: "/#organization/users/invitations",
    },
    bots: {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Bots",
        setting_link: "/#organization/bots",
    },
    "default-channels-list": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Default channels",
        setting_link: "/#organization/default-channels-list",
    },
    "linkifier-settings": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Linkifiers",
        setting_link: "/#organization/linkifier-settings",
    },
    "playground-settings": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Code playgrounds",
        setting_link: "/#organization/playground-settings",
    },
    "profile-field-settings": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Custom profile fields",
        setting_link: "/#organization/profile-field-settings",
    },
    "channel-folder-settings": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Channel folders",
        setting_link: "/#organization/channel-folders",
    },
    "data-exports-admin": {
        setting_type: ORGANIZATION_SETTINGS_TYPE,
        setting_name: "Data exports",
        setting_link: "/#organization/data-exports-admin",
    },
};

type RelativeLinkInfo = {
    label: string;
    relative_link: string;
    icon?: string | undefined;
};

const default_template_for_relative_links = `
<ol>
  <li>Click on the <strong>gear</strong> (${RawGearIcon}) icon in the upper right corner of the web or desktop app.</li>
  <li class="navigation-step-relative-type">Select {item}.</li>
</ol>
`;

const relative_link_mapping: Record<
    string,
    {
        data: Record<string, RelativeLinkInfo>;
        template: string;
        is_link_relative: () => boolean;
    }
> = {
    gear: {
        data: {
            "channel-settings": {
                label: "Channel settings",
                relative_link: "/#channels/subscribed",
                icon: `${RawHashIcon}`,
            },
            settings: {
                label: "Personal Settings",
                relative_link: "/#settings/profile",
                icon: `${RawToolIcon}`,
            },
            "organization-settings": {
                label: "Organization settings",
                relative_link: "/#organization/organization-profile",
                icon: `${RawBuildingIcon}`,
            },
            "group-settings": {
                label: "Group settings",
                relative_link: "/#groups/your",
                icon: `${RawUserGroupCogIcon}`,
            },
            stats: {
                label: "Usage statistics",
                relative_link: "/stats",
                icon: `${RawBarChartIcon}`,
            },
            integrations: {
                label: "Integrations",
                relative_link: "/integrations/",
                icon: `${RawGitPullRequestIcon}`,
            },
            "about-zulip": {
                label: "About Zulip",
                relative_link: "/#about-zulip",
            },
        },
        template: default_template_for_relative_links,
        is_link_relative: () => SHOW_RELATIVE_LINKS,
    },
    "gear-billing": {
        data: {
            plans: {
                label: "Plans and pricing",
                relative_link: "/plans/",
                icon: `${RawRocketIcon}`,
            },
            billing: {
                label: "Billing",
                relative_link: "/billing/",
                icon: `${RawCreditCardIcon}`,
            },
        },
        template: default_template_for_relative_links,
        is_link_relative: () => SHOW_RELATIVE_LINKS && SHOW_BILLING_HELP_LINKS,
    },
    help: {
        data: {
            "keyboard-shortcuts": {
                label: "Keyboard shortcuts",
                relative_link: "/#keyboard-shortcuts",
                icon: `${RawKeyboardIcon}`,
            },
            "message-formatting": {
                label: "Message formatting",
                relative_link: "/#message-formatting",
                icon: `${RawEditIcon}`,
            },
            "search-filters": {
                label: "Search filters",
                relative_link: "/#search-operators",
                icon: `${RawManageSearchIcon}`,
            },
            "about-zulip": {
                label: "About Zulip",
                relative_link: "/#about-zulip",
                icon: `${RawInfoIcon}`,
            },
        },
        template: `
<ol>
  <li>Click on the <strong>Help menu</strong> (${RawHelpIcon}) icon in the upper right corner of the app.</li>
  <li class="navigation-step-relative-type">Select {item}.</li>
</ol>
`,
        is_link_relative: () => SHOW_RELATIVE_LINKS,
    },
    channel: {
        data: {
            all: {
                label: "All",
                relative_link: "/#channels/all",
            },
            available: {
                label: "Available",
                relative_link: "/#channels/available",
            },
        },
        template: `
<ol>
  <li>Click on the <strong>gear</strong> (${RawGearIcon}) icon in the upper right corner of the web or desktop app.</li>
  <li>Select ${RawHashIcon} <strong>Channel settings</strong>.</li>
  <li>Click {item} in the upper left.</li>
</ol>
`,
        is_link_relative: () => SHOW_RELATIVE_LINKS,
    },
    group: {
        data: {
            all: {
                label: "All groups",
                relative_link: "/#groups/all",
            },
        },
        template: `
<ol>
  <li>Click on the <strong>gear</strong> (${RawGearIcon}) icon in the upper right corner of the web or desktop app.</li>
  <li>Select ${RawUserGroupCogIcon} <strong>Group settings</strong>.</li>
  <li>Click {item} in the upper left.</li>
</ol>
`,
        is_link_relative: () => SHOW_RELATIVE_LINKS,
    },
};

const getSettingsMarkdown = (
    setting_type: string,
    setting_type_icon: string,
    setting_name: string,
) => `
<ol>
    <li>
        Click on the <b>gear</b> (${RawGearIcon}) icon in the upper
        right corner of the web or desktop app.
    </li>
    <li>
        Select <b>${setting_type_icon} ${setting_type}</b>.
    </li>
    <li>
        On the left, click <b>${setting_name}</b>.
    </li>
</ol>
`;

const getSettingsHTML = (setting_key: string): string => {
    const {setting_type, setting_name, setting_link} =
        setting_link_mapping[setting_key]!;

    if (!SHOW_RELATIVE_LINKS) {
        const setting_type_icon =
            setting_type === ORGANIZATION_SETTINGS_TYPE
                ? `${RawBuildingIcon}`.trim()
                : `${RawToolIcon}`.trim();
        return getSettingsMarkdown(
            setting_type,
            setting_type_icon,
            setting_name,
        );
    }

    const relativeLink = `<a href="${setting_link}">${setting_name}</a>`;

    // The "Bots" label appears in both Personal and
    // Organization settings in the user interface, so we need special
    // text for this setting.
    // As for the the case of "Users", it refers to the Users tab in
    // organization settings. Since the users tab has multiple sub tabs
    // like active, deactivated etc., we need a way to point to them.
    const label =
        setting_name === "Bots" || setting_name === "Users"
            ? `Navigate to the ${relativeLink} tab of the <b>${setting_type}</b> menu.`
            : `Go to ${relativeLink}.`;

    return `<ol>
                <li>${label}</li>
            </ol>`;
};

const RELATIVE_NAVIGATION_HANDLERS_BY_TYPE: Record<
    string,
    (key: string) => string
> = {};

for (const type of Object.keys(relative_link_mapping)) {
    const {data, template, is_link_relative} = relative_link_mapping[type]!;

    RELATIVE_NAVIGATION_HANDLERS_BY_TYPE[type] = (key: string) => {
        const {label, relative_link, icon} = data[key]!;
        let formattedLabel = label;
        if (icon !== undefined) {
            const trimmedIcon = `${icon}`.trim();
            formattedLabel = trimmedIcon + label;
        }
        const formattedItem = is_link_relative()
            ? `<a href="${relative_link}">${formattedLabel}</a>`
            : `<strong>${formattedLabel}</strong>`;
        return template.replace("{item}", formattedItem);
    };
}

const {target} = Astro.props;
const navigation_link_type = target.split("/")[0];

if (
    navigation_link_type !== "settings" &&
    navigation_link_type !== "relative"
) {
    throw new Error(
        "Invalid navigation link type. Only `settings` or `relative` is allowed.",
    );
}

let resultHTML: string | undefined;
if (navigation_link_type === "settings") {
    resultHTML = getSettingsHTML(target.split("/")[1]);
} else {
    const link_type = target.split("/")[1];
    const key = target.split("/")[2];
    resultHTML = RELATIVE_NAVIGATION_HANDLERS_BY_TYPE[link_type]!(key);
}
assert.ok(resultHTML !== undefined);
---

<Fragment set:html={resultHTML} />
```

--------------------------------------------------------------------------------

---[FILE: ZulipNote.astro]---
Location: zulip-main/starlight_help/src/components/ZulipNote.astro

```text
<!-- 
We wanted to have our note without a header that is the ⓘ followed by a title.
We can make the title disappear by making the title a single space: " ".
The default aside component provided by starlight will always have an icon however.
That is why we needed this custom components.
-->
<aside aria-label="Note" class={`starlight-aside starlight-aside--note`}>
    <div class="starlight-aside__content">
        <slot />
    </div>
</aside>
```

--------------------------------------------------------------------------------

---[FILE: ZulipTip.astro]---
Location: zulip-main/starlight_help/src/components/ZulipTip.astro

```text
---
import assert from "node:assert/strict";

import type {Element} from "hast";
import {fromHtml} from "hast-util-from-html";
import {toHtml} from "hast-util-to-html";

import lightbulb_svg from "../../../web/icons/lightbulb.svg?raw";

const lightbulb_icon_fragment = fromHtml(lightbulb_svg, {fragment: true});
const lightbulb_icon_first_child = lightbulb_icon_fragment.children[0]!;
assert.ok(
    lightbulb_icon_first_child.type === "element" &&
        lightbulb_icon_first_child.tagName === "svg",
);
lightbulb_icon_first_child.properties.class =
    "zulip-unplugin-icon aside-icon-lightbulb";

// We want to add the `Tip: ` prefix without a line break or wrapping
// it in a paragraph. If we write `Tip: <slot />`, slot will be wrapped
// in it's own paragraph and thus will be placed on the next line as
// `Tip:`. We have to edit slot HTML tree directly instead to solve this.
// Same case applies for the ligthbulb icon we are inserting. We just
// inject the icon as raw svg.
const prefix_text_element: Element = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: [
        {
            type: "text",
            // Whitespace before the text to ensure space between
            // this text and the preceding icon.
            value: " Tip: ",
        },
    ],
};
let prefix_element_list = [lightbulb_icon_first_child, prefix_text_element];

const tree = fromHtml(await Astro.slots.render("default"), {fragment: true});
const first_element = tree.children[0];
assert.ok(first_element?.type === "element");

// This is currently happening only in one case, for _ImportSelfHostedServerTips.mdx
// where the tip contains an unordered list. Just placing the element as is without
// a paragraph does not look good in that case.
if (first_element.tagName !== "p") {
    const paragraph_wrapping_element: Element = {
        type: "element",
        tagName: "p",
        properties: {},
        children: [...prefix_element_list],
    };
    prefix_element_list = [paragraph_wrapping_element];
}

first_element.children = [...prefix_element_list, ...first_element.children];
tree.children[0] = first_element;
---

<aside aria-label="Tip" class=`starlight-aside starlight-aside--tip`>
    <div class="starlight-aside__content">
        <Fragment set:html={toHtml(tree)} />
    </div>
</aside>
```

--------------------------------------------------------------------------------

---[FILE: add-a-bot-or-integration.mdx]---
Location: zulip-main/starlight_help/src/content/docs/add-a-bot-or-integration.mdx

```text
---
title: Add a bot or integration
---

import {TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";
import ZulipNote from "../../components/ZulipNote.astro";

By default, anyone other than guests can add a bot to a Zulip organization.
A bot that sends content to or from another product is often called an
[integration](/help/integrations-overview).

Organization administrators can also
[restrict bot creation](/help/restrict-bot-creation). Any bot that is added
is visible and available for anyone to use.

## Add a bot or integration

<Tabs>
  <TabItem label="Your bots">
    <FlattenedSteps>
      <NavigationSteps target="settings/your-bots" />

      1. Click **Add a new bot**.
      1. Fill out the fields, and click **Add**.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="All bots">
    <FlattenedSteps>
      <NavigationSteps target="settings/bots" />

      1. Click **Add a new bot**.
      1. Fill out the fields, and click **Add**.
    </FlattenedSteps>
  </TabItem>
</Tabs>

<ZulipNote>
  See [bots overview](/help/bots-overview) for more information about
  the various fields.
  Nearly all third-party integrations should use **Incoming webhook**
  as the **bot type**.
</ZulipNote>

Depending on the type of bot you're creating, you may need to download its
[`zuliprc` configuration file](/help/manage-a-bot#download-zuliprc-configuration-file).

## Related articles

* [Bots overview](/help/bots-overview)
* [Integrations overview](/help/integrations-overview)
* [Manage a bot](/help/manage-a-bot)
* [Deactivate or reactivate a bot](/help/deactivate-or-reactivate-a-bot)
* [Restrict bot creation](/help/restrict-bot-creation)
* [View all bots in your organization](/help/view-all-bots-in-your-organization)
* [Generate URL for an integration](/help/generate-integration-url)
```

--------------------------------------------------------------------------------

````
