---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 480
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 480 of 1290)

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

---[FILE: _UserSubgroupsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_UserSubgroupsIntro.mdx

```text
You can add a group to another user group, making it easy to express your
organization's structure in Zulip's permissions system. A user who belongs to a
subgroup of a group is treated as a member of that group. For example:

* The “engineering” group could be made up of “engineering-managers” and
  “engineering-staff”.
* The “managers” group could be made up of “engineering-managers”,
  “design-managers”, etc.

Updating the members of a group automatically updates the members of all the
groups that contain it. In the above example, adding a new team member to
“engineering-managers” automatically adds them to “engineering” and “managers”
as well. Removing a team member who transferred automatically removes them.
```

--------------------------------------------------------------------------------

---[FILE: _ViewDmsLeftSidebar.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ViewDmsLeftSidebar.mdx

```text
1. If the **direct messages** section in the left sidebar is collapsed, click on
   the **direct messages** heading to expand it.
1. Click on a recent DM conversation to view it, or click **more
   conversations**. If you don't see this link, then you are already viewing all
   of your direct message conversations.
```

--------------------------------------------------------------------------------

---[FILE: _ViewEmojiReactions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ViewEmojiReactions.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import ZulipTip from "../../components/ZulipTip.astro";

import MoreVerticalIcon from "~icons/zulip-icon/more-vertical";
import SmileIcon from "~icons/zulip-icon/smile";

The reactions view lets you see all of your messages that have received at least
one [emoji reaction](/help/emoji-reactions). You can see what resonated with
others, or confirm that key stakeholders have seen and responded to a message.

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click on <SmileIcon /> **Reactions** in the left
         sidebar. If the **views** section is collapsed, click on
         the **ellipsis** (<MoreVerticalIcon />),
         and select <SmileIcon /> **Reactions**.
      1. Browse your reactions. You can click on a message recipient bar to go
         to the [conversation](/help/reading-conversations) where you sent the message.
    </Steps>

    <ZulipTip>
      You can also [search all messages with reactions](/help/search-for-messages) using the
      `has:reaction` filter.
    </ZulipTip>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _ViewMentions.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ViewMentions.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MobileMenu from "../include/_MobileMenu.mdx";

import AtSignIcon from "~icons/zulip-icon/at-sign";

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click on <AtSignIcon /> **Mentions**
         (or <AtSignIcon /> if the **views**
         section is collapsed) in the left sidebar.
      1. Browse your mentions. You can click on a message recipient bar to go
         to the [conversation](/help/reading-conversations) where you were mentioned.
    </Steps>

    <ZulipTip>
      You can also [search your mentions](/help/search-for-messages) using the
      `is:mentioned` filter.
    </ZulipTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileMenu />

      1. Tap <AtSignIcon /> **Mentions**.
      1. Browse your mentions. You can tap on a message recipient bar to go
         to the conversation where you were mentioned.
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _ViewStarredMessages.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ViewStarredMessages.mdx

```text
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";
import KeyboardTip from "../../components/KeyboardTip.astro";
import ZulipTip from "../../components/ZulipTip.astro";
import MobileMenu from "../include/_MobileMenu.mdx";

import StarIcon from "~icons/zulip-icon/star";

<Tabs>
  <TabItem label="Desktop/Web">
    <Steps>
      1. Click on <StarIcon /> **Starred messages**
         (or <StarIcon /> if the **views**
         section is collapsed) in the left sidebar.
    </Steps>

    <ZulipTip>
      You can also [search your starred messages](/help/search-for-messages)
      using the `is:starred` filter.
    </ZulipTip>

    <KeyboardTip>
      Use <kbd>\*</kbd> to view your starred messages.
    </KeyboardTip>
  </TabItem>

  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileMenu />

      1. Tap <StarIcon /> **Starred messages**.
    </FlattenedSteps>
  </TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: _ViewUsersByRole.mdx]---
Location: zulip-main/starlight_help/src/content/include/_ViewUsersByRole.mdx

```text
import FlattenedSteps from "../../components/FlattenedSteps.astro";
import NavigationSteps from "../../components/NavigationSteps.astro";

<FlattenedSteps>
  <NavigationSteps target="settings/users" />

  1. Select the desired role from the dropdown above the **Users** table.
</FlattenedSteps>
```

--------------------------------------------------------------------------------

---[FILE: _WebPublicChannelsIntro.mdx]---
Location: zulip-main/starlight_help/src/content/include/_WebPublicChannelsIntro.mdx

```text
import GlobeIcon from "~icons/zulip-icon/globe";

The public access option lets administrators configure selected channels to be
**web-public**. Web-public channels (indicated by a <GlobeIcon />) can be viewed by anyone on the Internet without creating
an account in your organization.

For example, you can [link to a Zulip
topic](/help/link-to-a-message-or-conversation) in a web-public channel
from a GitHub issue, a social media post, or a forum thread, and
anyone will be able to click the link and view the discussion in the
Zulip web application without needing to create an account.

To see this feature in action, you can [view web-public channels in the Zulip
development community](https://chat.zulip.org/?show_try_zulip_modal) without
logging in.

Users who wish to post content will need to create an account in order
to do so.
```

--------------------------------------------------------------------------------

---[FILE: _WhenToStartANewTopic.mdx]---
Location: zulip-main/starlight_help/src/content/include/_WhenToStartANewTopic.mdx

```text
To get the full benefits of Zulip's topic model, when starting a new
conversation, you should start a new topic!

Starting a topic is like a lighter weight version of giving your email a subject.
Topic names should be brief but specific, for example:

* **Good topic names:** "question about topics", "welcome Anna Smith!", "issue #1234"
* **Not so good topic names:** "question", "hi", "help", "this topic is about
  a question I have about topics"

Don't stress about making it perfect! The first 2-3 words that
come to mind are probably fine, and you can always [change it
later](/help/rename-a-topic).

With time, there will be lots of topics in your organization, which is just how
it's supposed to be. Zulip's UI is designed to make it easy to see what's new
(in your [inbox](/help/inbox), [recent
conversations](/help/recent-conversations), and the [left
sidebar](/help/left-sidebar)), while still helping you
[find](/help/search-for-messages) prior discussions.
```

--------------------------------------------------------------------------------

---[FILE: adjust_mac_kbd_tags.ts]---
Location: zulip-main/starlight_help/src/scripts/client/adjust_mac_kbd_tags.ts

```typescript
// Any changes to this file should be followed by a check for changes
// needed to make to adjust_mac_kbd_tags of web/src/common.ts.

const keys_map = new Map<string, string>([
    ["Backspace", "Delete"],
    ["Enter", "Return"],
    ["Ctrl", "⌘"],
    ["Alt", "⌥"],
]);

function has_mac_keyboard(): boolean {
    "use strict";

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    return /mac/i.test(navigator.platform);
}

// We convert the <kbd> tags used for keyboard shortcuts to mac equivalent
// key combinations, when we detect that the user is using a mac-style keyboard.
function adjust_mac_kbd_tags(): void {
    "use strict";

    if (!has_mac_keyboard()) {
        return;
    }

    const elements = document.querySelectorAll<HTMLElement>("kbd");

    for (const element of elements) {
        let key_text: string = element.textContent ?? "";

        // We use data-mac-key attribute to override the default key in case
        // of exceptions:
        // - There are 2 shortcuts (for navigating back and forth in browser
        //   history) which need "⌘" instead of the expected mapping ("Opt")
        //   for the "Alt" key, so we use this attribute to override "Opt"
        //   with "⌘".
        // - The "Ctrl" + "[" shortcuts (which match the Vim keybinding behavior
        //   of mapping to "Esc") need to display "Ctrl" for all users, so we
        //   use this attribute to override "⌘" with "Ctrl".
        const replace_key = element.getAttribute("data-mac-key") ?? keys_map.get(key_text);
        if (replace_key !== undefined) {
            key_text = replace_key;
        }

        element.textContent = key_text;

        // In case of shortcuts, the Mac equivalent of which involves extra keys,
        // we use data-mac-following-key attribute to append the extra key to the
        // previous key. Currently, this is used to append Opt to Cmd for the Paste
        // as plain text shortcut.
        const following_key = element.getAttribute("data-mac-following-key");
        if (following_key !== null) {
            const kbd_elem: HTMLElement = document.createElement("kbd");
            kbd_elem.textContent = following_key;
            element.after(kbd_elem);
            element.after(" + ");
        }

        // In web/src/common.ts, we use zulip icon for ⌘ due to centering
        // problems, we don't have that problem in the new help center and
        // thus don't do that transformation here.
    }
}

adjust_mac_kbd_tags();
```

--------------------------------------------------------------------------------

---[FILE: main.css]---
Location: zulip-main/starlight_help/src/styles/main.css

```text
:root {
    /* Starlight base style headings are huge and distract from reading the text.
       This is OK for some sites, but we are sparing with text and really want to
       encourage users to read it. */
    --sl-text-h1: 2rem;
    --sl-text-h2: 1.4rem;
    --sl-text-h3: 1.2rem;
    --sl-text-h4: 1rem;
    --sl-text-h5: 1rem;

    /* Changed from 1.2 to 1 */
    --sl-line-height-headings: 1;

    /* Changed from 1.75 to make text easier to read. */
    --sl-line-height: 1.5;

    /* User circles */
    /* stylelint-disable color-no-hex */
    --color-user-circle-active: light-dark(#43a35e, #4cdc75);
    --color-user-circle-idle: light-dark(#f5b266, #ae640a);
    --color-user-circle-offline: light-dark(#c1c6d7, #454854);
    --color-user-circle-deactivated: hsl(0deg 0% 50%);
    /* stylelint-enable color-no-hex */

    /* NOTE: These colors are also used in zulip web app for banner
       colors. Do grep for these variables when changing them and
       confirm on CZO on whether the colors there need to change as
       well. */
    /* Banners - Neutral Variant */
    --color-text-neutral-banner: light-dark(
        hsl(229deg 12% 25%),
        hsl(231deg 11% 76%)
    );
    --color-border-neutral-banner: light-dark(
        color-mix(in oklch, hsl(240deg 2% 30%) 40%, transparent),
        color-mix(in oklch, hsl(240deg 7% 66%) 40%, transparent)
    );
    --color-background-neutral-banner: light-dark(
        hsl(240deg 7% 93%),
        hsl(240deg 7% 17%)
    );
    /* Banners - Brand Variant */
    --color-text-brand-banner: light-dark(
        hsl(264deg 95% 34%),
        hsl(244deg 96% 82%)
    );
    --color-border-brand-banner: light-dark(
        color-mix(in oklch, hsl(254deg 60% 50%) 40%, transparent),
        color-mix(in oklch, hsl(253deg 70% 89%) 40%, transparent)
    );
    --color-background-brand-banner: light-dark(
        hsl(254deg 42% 94%),
        hsl(253deg 49% 16%)
    );
    /* Banners - Info Variant */
    --color-text-info-banner: light-dark(
        hsl(241deg 95% 25%),
        hsl(221deg 93% 89%)
    );
    --color-border-info-banner: light-dark(
        color-mix(in oklch, hsl(204deg 49% 29%) 40%, transparent),
        color-mix(in oklch, hsl(205deg 58% 69%) 40%, transparent)
    );
    --color-background-info-banner: light-dark(
        hsl(204deg 58% 92%),
        hsl(204deg 100% 12%)
    );

    /* Keyboard shortcuts */
    --color-keyboard-shortcuts: light-dark(
        hsl(225deg 57.09% 42.9%),
        hsl(225deg 100% 84%)
    );
}

.non-clickable-sidebar-heading {
    font-size: 1.15rem;
    pointer-events: none;
    cursor: default;
}

/* Eliminate the border inserted between the title and the rest of
   the content. */
.content-panel + .content-panel {
    border-top: 0;
}

/* Decrease padding for the content panel from 1.5rem to 1rem since
   the padding looked too big after removing the content panel border. */
.content-panel {
    padding: 1rem var(--sl-content-pad-x);
}

.zulip-unplugin-icon {
    /* Make sure the icon does not occupy it's own row. */
    display: inline;
    vertical-align: text-bottom;

    /* unplugin-icons sets height and width by itself.
       It was setting the height to 1024 and 960 for some
       icons. It is better to set the height explicitly. */
    height: 1em;
    width: 1em;

    /* Some css rules in starlight insert these margins to tags
       that fit certain criteria, e.g. if it's a first child of
       an li item and similar cases, and the icon disturbs the
       spacing of everything around it just because it was an
       svg tag. We set this explicitly to zero to avoid those
       issues. */
    margin-bottom: 0;
    margin-top: 0;

    /* We need to specify this for dark mode. */
    fill: currentcolor;
}

.navigation-step-relative-type .zulip-unplugin-icon {
    /* There's no space between the icon and text for navigation
    step labels because of any text decoration rules when these
    steps have a relative link. So we add a right margin to the
    icon to add the white space without any text decoration. */
    margin-right: 4px;
}

.starlight-aside--tip {
    --sl-color-asides-text-accent: var(--color-text-brand-banner);
    --sl-color-asides-border: var(--color-border-brand-banner);
    background-color: var(--color-background-brand-banner);
}

.starlight-aside--note {
    --sl-color-asides-text-accent: var(--color-text-neutral-banner);
    --sl-color-asides-border: var(--color-border-neutral-banner);
    background-color: var(--color-background-neutral-banner);
}

.keyboard-tip {
    --sl-color-asides-text-accent: var(--color-text-info-banner);
    --sl-color-asides-border: var(--color-border-info-banner);
    background-color: var(--color-background-info-banner);
}

.aside-icon-lightbulb {
    /* We need to make the fill transparent for the bulb to look hollow
       and the default vertical-align of text-bottom was not looking
       good beside the `Tip` text. */
    vertical-align: text-top;
    fill: transparent;
    stroke: currentcolor;
    /* In cases where content spanned across multiple lines, the
       icon and the content just below it did not look aligned. */
    margin-left: -3px;
    /* Using any of the default vertical-align did not give desired
       results, text-top + this margin looked the best. */
    margin-top: 2px;
}

.user-circle {
    font-size: 0.7em;
    display: inline-block;
    vertical-align: middle;
}

.user-circle-active {
    color: var(--color-user-circle-active);
}

.user-circle-idle {
    color: var(--color-user-circle-idle);
}

.user-circle-offline {
    color: var(--color-user-circle-offline);
}

.user-circle-deactivated {
    color: var(--color-user-circle-deactivated);
}

.subscriber-check-icon {
    /* This color is borrowed from subscriptions.css to make it look
       the same as the web app. */
    fill: hsl(240deg 96% 68%);
}

.subscriber-plus-icon {
    /* This color is borrowed from subscriptions.css to make it look
       the same as the web app. */
    fill: hsl(0deg 0% 72%);
}

.sl-markdown-content {
    img {
        vertical-align: top;
        box-shadow: 0 0 4px hsl(0deg 0% 0% / 5%);
        border: 1px solid hsl(0deg 0% 87%);
        border-radius: 4px;
        margin-top: 0;

        &.emoji-small {
            display: inline-block;
            width: 1.25em;
            box-shadow: none;
            border: none;
            vertical-align: text-top;
        }

        &.emoji-big {
            display: inline-block;
            width: 1.5em;
            box-shadow: none;
            border: none;
            vertical-align: text-top;
        }

        &.help-center-icon {
            display: inline-block;
            width: 1.25em;
            box-shadow: none;
            border: none;
            vertical-align: text-top;
        }
    }

    li > ul,
    li > ol {
        margin-top: 0.25rem;
    }

    & .sl-heading-wrapper:has(> :first-child:target) {
        /* Increase the highlighted space around the text... */
        /* We are trying to recreate `padding: 6px 0 6px 8px` below
           using box-shadow since we don't want padding to affect the
           layout. A spread of 6px will make sure of the 6px part of
           the padding, and -2px will ensure a padding of 8px is
           recreated on the left side.  */
        box-shadow: -2px 0 0 6px var(--sl-color-accent-low);
        background-color: var(--sl-color-accent-low);
    }

    & kbd {
        font-size: 1.2em;
        padding: 0.15em 0.4em 0.05em;
        border: 1px solid var(--color-keyboard-shortcuts);
        border-radius: 3px;
        color: var(--color-keyboard-shortcuts);
        text-align: center;
        white-space: nowrap;
    }
}

footer {
    font-size: 0.85em;
}

.external-icon-sidebar {
    display: inline-flex;
    align-items: center;
}

.external-icon-sidebar::after {
    content: "";
    width: 1em;
    height: 1em;
    margin-left: 0.4em;
    background: currentcolor;
    mask: url("../../../web/icons/external-link.svg") no-repeat center / contain;
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: zulip-main/static/.gitignore

```text
# Code
/webpack-bundles

# Generated static files

# Copied zulip_bots package
/generated/bots/
# Copied integrations package
/generated/integrations/
# From emoji
/generated/emoji
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: zulip-main/static/generated/README.md

```text
This directory is for generated static assets such as emoji.
```

--------------------------------------------------------------------------------

---[FILE: favicon.svg]---
Location: zulip-main/static/images/favicon.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" viewBox="49.99 49.99 673.14 673.14"><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#50adff"/><stop offset="1" stop-color="#7877fc"/></linearGradient><path d="M688.52 150.67c0 33.91-15.23 64.04-38.44 82.31L424.79 434.17c-4.18 3.59-9.62-2.19-6.61-7.03l82.64-165.46c2.31-4.63-.69-10.33-5.44-10.33H174.86c-49.64 0-90.26-45.31-90.26-100.68 0-55.37 40.62-100.68 90.26-100.68h423.39c49.65 0 90.27 45.31 90.27 100.68zM174.86 723.13h423.39c49.64 0 90.26-45.31 90.26-100.68 0-55.37-40.62-100.68-90.26-100.68H277.73c-4.75 0-7.76-5.7-5.44-10.33l82.64-165.46c3.01-4.83-2.42-10.62-6.61-7.03L123.04 540.14c-23.21 18.27-38.44 48.4-38.44 82.31 0 55.37 40.62 100.68 90.26 100.68z" fill="url(#a)"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: coral.svg]---
Location: zulip-main/static/images/characters/coral.svg

```text
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="55.315559mm"
   height="55.315559mm"
   viewBox="0 0 196.00001 196.00001"
   id="svg4289"
   version="1.1"
   inkscape:version="0.91 r13725"
   sodipodi:docname="coral2.svg">
  <defs
     id="defs4291" />
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0.0"
     inkscape:pageshadow="2"
     inkscape:zoom="0.35"
     inkscape:cx="-245.57143"
     inkscape:cy="32.285719"
     inkscape:document-units="px"
     inkscape:current-layer="layer1"
     showgrid="false"
     fit-margin-top="0"
     fit-margin-left="0"
     fit-margin-right="0"
     fit-margin-bottom="0"
     inkscape:window-width="1855"
     inkscape:window-height="1056"
     inkscape:window-x="65"
     inkscape:window-y="24"
     inkscape:window-maximized="1" />
  <metadata
     id="metadata4294">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1"
     transform="translate(-136.28572,-368.64791)">
    <g
       style="display:inline"
       id="g4565-5"
       transform="matrix(0.45006706,0,0,0.38342213,139.39967,363.50349)"
       inkscape:export-xdpi="600"
       inkscape:export-ydpi="600">
      <path
         inkscape:connector-curvature="0"
         id="path4467-6"
         d="m 236.37569,85.646226 5.05077,27.274114 -5.55584,23.23351 -2.02031,13.13199"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4469-2"
         d="m 253.54829,96.757904 -8.08122,32.324876 -8.5863,19.69798"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4471-9"
         d="m 192.93913,98.273133 5.05077,38.385797 -1.51523,12.62691 4.54569,21.71828"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4473-1"
         d="m 162.12948,144.74015 10.10153,16.66752 24.24366,20.70812"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4475-2"
         d="m 80.307127,227.57266 21.718283,22.22335 23.73858,11.11168 9.09137,10.6066"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4477-7"
         d="m 68.690373,243.23002 12.626906,8.08122 14.647212,4.54569 22.728429,12.12183"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4479-0"
         d="m 207.08127,258.88739 10.10153,41.92133"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4481-9"
         d="m 227.28432,322.02192 9.59645,48.48732"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4483-3"
         d="m 163.64471,97.768056 20.70813,45.456864 13.13198,33.84011"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4485-6"
         d="m 134.85536,215.45083 18.18275,50.50762"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4487-0"
         d="m 89.3985,182.11579 23.23351,30.80966 17.17259,26.76904"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4489-6"
         d="m 261.12443,120.49649 0.50508,35.35534 6.56599,22.72843"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:12.03629398;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4492-2"
         d="m 81.822356,263.43307 20.203054,-1.01015 25.75889,11.61675"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:16.85081291;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4494-6"
         d="m 163.64471,249.29094 13.63706,33.33503"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:16.85081291;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4496-1"
         d="m 178.29192,197.26808 -7.07106,28.28427 6.56599,28.28427 2.0203,30.30458"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:16.85081291;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4498-8"
         d="m 244.45691,218.48128 -3.03045,34.85027 -5.05077,36.36549"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:16.85081291;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4500-7"
         d="m 339.91633,250.80617 -21.71828,28.78934 -8.08122,10.6066 -22.22336,23.23351 -4.04061,8.08122"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:16.85081291;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4502-9"
         d="m 285.87317,100.29344 -12.12183,38.38579 -2.02031,38.3858 -5.05076,15.65736"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:16.85081291;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4504-2"
         d="m 150.00765,326.06253 27.7792,25.25381 9.09137,11.61676 20.70813,41.92133"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:16.85081291;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4506-0"
         d="m 240.4163,160.39751 -14.14213,27.27412"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:16.85081291;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4508-2"
         d="m 350.52293,281.11074 -27.77919,15.65737 -15.15229,9.59645 -23.23351,18.68782"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:16.85081291;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4510-3"
         d="m 306.07622,187.67163 -16.16244,25.25382 -13.63706,30.30457 -16.66752,23.73859"
         style="display:inline;fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:16.85081291;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4513-7"
         d="m 116.16754,177.57011 3.53554,36.87056 22.22335,50.50763 20.20305,18.18275 9.59645,35.86041 32.82996,54.04316 11.11168,73.23606"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4515-5"
         d="m 133.84521,275.5549 21.71828,18.68782 48.9924,71.72084 -0.50508,50.00255"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4517-9"
         d="m 154.04826,194.23762 5.05076,79.80205 45.96195,68.69038 18.18274,101.52033"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4519-2"
         d="m 206.07112,215.9559 -25.75889,82.83251"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4521-2"
         d="m 195.46452,172.01427 21.71828,77.27667 9.09137,192.43406"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4523-8"
         d="m 229.8097,257.87723 18.68782,57.07362 -14.14213,125.76399"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4525-9"
         d="m 272.74119,290.20211 0.50507,20.20306"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4527-7"
         d="m 307.08637,251.81632 -24.24366,48.9924 -18.18275,26.26396 -25.25381,111.62186"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4529-3"
         d="m 282.33763,324.04222 -15.65736,33.84011"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4531-6"
         d="m 259.6092,266.46353 -13.13198,31.31473"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4533-1"
         d="m 259.6092,185.14625 -4.04061,27.7792 2.02031,40.91117"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4535-2"
         d="m 217.68787,103.3239 1.01015,19.69797 10.60661,27.27412 -6.06092,61.11423 -8.08122,42.93148"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4537-9"
         d="m 311.63206,136.15385 -29.7995,73.74114 -3.53554,21.2132"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4539-3"
         d="m 193.94929,295.75795 15.65736,30.30458 -0.50507,48.48732"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path4541-1"
         d="m 231.32493,295.75795 6.56599,35.35534 -12.12183,95.45942"
         style="fill:none;fill-rule:evenodd;stroke:#a35697;stroke-width:24.07258797;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    </g>
    <g
       transform="matrix(1.1648078,0,0,1.1851983,-130.33953,-277.31714)"
       style="display:inline"
       id="g4604-3-9"
       inkscape:export-xdpi="600"
       inkscape:export-ydpi="600">
      <path
         style="opacity:1;fill:#543b0f;fill-opacity:1;stroke:#543b0f;stroke-width:3.4043746;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
         d="m 339.94666,693.30949 c -10.47103,-0.78752 -15.90991,-3.73447 -15.90991,-8.62047 0,-0.69129 0.0593,-0.84764 0.7801,-2.05771 3.30815,-5.55353 8.14694,-9.48011 14.11965,-11.45779 6.52783,-2.16149 13.41284,-1.7261 19.52076,1.23446 6.31675,3.06177 10.82978,8.48277 12.82378,15.4038 0.41903,1.45442 0.35979,1.98863 -0.28027,2.5272 -0.50389,0.424 -0.92632,0.52798 -3.40119,0.8372 -1.14589,0.14317 -4.21423,0.53844 -6.81853,0.87838 -5.32335,0.69484 -8.92683,1.0739 -11.99556,1.26183 -2.36694,0.14496 -6.86649,0.14144 -8.83883,-0.007 l 0,-10e-6 z"
         id="path8426-6-4"
         inkscape:connector-curvature="0" />
      <path
         style="opacity:1;fill:#543b0f;fill-opacity:1;stroke:#543b0f;stroke-width:3.4043746;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
         d="m 282.96851,687.72885 c -3.92041,-0.94844 -4.33625,-1.3586 -4.33625,-4.27694 0,-2.25322 0.20883,-2.66031 2.80091,-5.46007 1.54051,-1.66393 3.77147,-3.49516 4.95769,-4.0694 6.36125,-3.07943 13.38581,0.82481 15.73859,8.74746 0.99881,3.36335 0.94044,4.71632 -0.23048,5.34298 -1.46877,0.78606 -15.36931,0.5775 -18.93046,-0.28403 z m 12.97315,-2.55373 c 3.8508,-0.36367 3.81908,-0.28037 1.7678,-4.6437 -1.33322,-2.8359 -3.42913,-4.1132 -6.75332,-4.11564 -2.03251,-0.001 -2.99521,0.30188 -4.5638,1.43816 -2.35483,1.70583 -4.72963,4.41571 -4.72963,5.39696 0,1.61993 7.21119,2.5917 14.27895,1.92422 z"
         id="path8443-7-7"
         inkscape:connector-curvature="0" />
      <path
         style="opacity:1;fill:#543b0f;fill-opacity:1;stroke:#543b0f;stroke-width:3.4043746;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
         d="m 285.28621,682.53986 c -0.49647,-0.31476 -0.10983,-0.86791 1.49497,-2.13884 1.74549,-1.38234 2.58636,-1.70485 4.3426,-1.66559 2.31501,0.0518 4.35685,1.43485 4.83875,3.27766 0.23689,0.90584 -0.0706,0.96631 -4.87692,0.95906 -2.82136,-0.004 -5.43109,-0.19878 -5.7994,-0.43229 z"
         id="path8445-5-8"
         inkscape:connector-curvature="0" />
    </g>
    <rect
       style="display:inline;opacity:1;fill:none;fill-opacity:1;stroke:#45a98d;stroke-width:0;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
       id="rect8473-3-4"
       width="196"
       height="196"
       x="136.28572"
       y="368.64792"
       inkscape:export-xdpi="600"
       inkscape:export-ydpi="600" />
  </g>
</svg>
```

--------------------------------------------------------------------------------

````
