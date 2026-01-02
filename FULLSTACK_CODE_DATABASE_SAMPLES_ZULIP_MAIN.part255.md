---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 255
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 255 of 1290)

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

---[FILE: helpcenter.md]---
Location: zulip-main/docs/documentation/helpcenter.md

```text
# Writing help center articles

Our goal is for Zulip to have complete, high-quality
documentation about Zulip's features and how to perform certain tasks, such
as setting up an organization.

There are two types of help center documents: articles about specific features,
and a handful of longer guides. The feature articles serve a few different purposes:

- Feature discovery, for someone browsing the help center, and looking at
  the set of articles and guides.

- Public documentation of our feature set, for someone googling "can zulip do ..."

- Quick responses to support questions; if someone emails a Zulip admin
  asking "How do I change my name?", they can reply with a link to the doc.

- Feature explanations for new Zulip users and admins, especially for
  organization settings.

The help center is built with [@astro/starlight](https://starlight.astro.build/).
Starlight is a full-featured documentation theme built on top of the
[Astro](https://astro.build/) framework. Astro is a web framework designed
for content driven websites. The content for the help center articles are
[MDX](https://mdxjs.com/) files, which live at `starlight_help/src/content/docs`
in the [main Zulip server repository](https://github.com/zulip/zulip).
Images are usually linked from `starlight_help/src/images`.

Zulip help center documentation is available under `/help/` on any Zulip server;
(e.g., <https://zulip.com/help/> or `http://localhost:9991/help/` in
the Zulip development environment). The help center documentation is not hosted
on ReadTheDocs, since Zulip supports running a server completely disconnected
from the Internet, and we'd like the documentation to be available in that
environment.

This means that you can contribute to the Zulip help center documentation
by just adding to or editing the collection of MDX files under
`starlight_help/src/content/docs`. If you have the Zulip development
environment set up, you simply need to reload your browser on
`http://localhost:9991/help/foo` to see the latest version of `foo.mdx`
rendered.

This system is designed to make writing and maintaining such documentation
highly efficient. We link to the docs extensively from the landing pages and
in-product, so it's important to keep the docs up to date.

## Guide to writing help center articles

Writing documentation is a different form of writing than most people have
experience with.

### Getting started

There are over 100 feature articles and longer guides in the
[Zulip help center](https://zulip.com/help/), so make the most of
the current documentation as a resource and guide as you begin.

- Use the left sidebar in the help center documentation to find the
  section of the docs (e.g., Preferences, Sending messages, Reading
  messages, etc.) that relates to the new feature you're documenting.

- Read through the existing articles in that section and pay attention
  to the [writing style](#writing-style) used, as well as any
  [features and components](#mdx-features-and-custom-zulip-components)
  used to enhance the readability of the documentation.

- Should the feature you're documenting be added or merged into an
  existing article?

  - If so, you can locate that article in `starlight_help/src/content/docs`
    and start working on updating it with content about the new feature.

  - If not, choose an existing article to use as a template for your
    new article and make a list of which articles (or guides) would be
    good to link to in your new feature documentation.

Remember that real estate in the left sidebar is somewhat precious.
Minor features should rarely get their own article, and should instead
be merged into the existing help center documentation where appropriate.

If you are unsure about how and where to document the feature, you
can always ask in
[#documentation](https://chat.zulip.org/#narrow/channel/19-documentation)
on the [Zulip community server](https://zulip.com/development-community/).

### Updating an existing article

If the new feature you're documenting is a refinement on,
or related to, a feature that already has a dedicated help center
article, the information will be more useful and discoverable for
users as an addition to the existing article.

Here are some things to keep in mind when expanding and updating
existing help center articles:

- Maintain the format and [writing style](#writing-style) of the
  current article.

- Review the [features and components](#mdx-features-and-custom-zulip-components)
  available and pay attention to the ones already utilized in the
  article.

- Think about where inline links to other help center documentation
  would be appropriate in the description of the feature. For example,
  your new feature might relate to general Zulip features like
  [keyboard shortcuts](https://zulip.com/help/keyboard-shortcuts)
  or [topics](https://zulip.com/help/introduction-to-topics).

- Make sure there is a **Related articles** section at the end
  of the article that again links to any help center documentation
  mentioned in the text or related to the feature.

If your updates to the existing article will change the name of the
markdown file, then see section below on [redirecting an existing
article](#redirecting-an-existing-article).

Creating robust and informative help center articles with good links
will allow users to navigate the help center much more effectively.

### Adding a new article

To add a help center article, create a new file in
`starlight_help/src/content/docs/`, and add a sidebar link to it in
`starlight_help/astro.config.mjs`. Don't forget to `git add` your new
file!

If the feature you're documenting needs a new article, here are some
things to keep in mind, in addition to the points made above for
updating existing documentation:

- Choose an existing article in the related section of the help
  documentation, and copy the format, wording, style, etc. as closely
  as you can.

- If the feature exists in other team chat products, check out their
  documentation for inspiration.

- Fewer words is better than more. Many Zulip users have English as a second
  language.

- Try to put yourself in the shoes of a new Zulip user. What would you want
  to know?

- Remember to explain the purpose of the feature and give context as well
  as instructions for how to use or enable it.

- The goal of user-facing documentation is not to be comprehensive. The goal
  is to give the right bits of information for the intended audience.

An anti-pattern is trying to make up for bad UX by adding help center
documentation. It's worth remembering that for most articles, almost 100% of
the users of the feature will never read the article. Instructions for
filling out forms, interacting with UI widgets (e.g., typeaheads), interacting
with modals, etc. should never go in the help center documentation.
In such cases, you may be able to fix the problem by adding text in-app,
where the user will see it as they are interacting with the feature.

### Redirecting an existing article

From time to time, we might want to rename an article in the help
center. This change will break incoming links, including links in
published Zulip blog posts, links in other branches of the repository
that haven't been rebased, and more importantly links from previous
versions of Zulip.

To fix these broken links, you can easily add a URL redirect in:
`starlight_help/astro.config.mjs`.

For help center article, once you've renamed the file in your
branch (e.g., `git mv path/to/foo.mdx path/to/bar.mdx`), go to
`astro.config.mjs` and add a new line to the `redirects` property:

```
    // Redirects in astro are just directories with index.html inside
    // them doing the redirect we define in the value. The base of
    // /help/ will apply to the keys in the list below but we will
    // have to prepend /help/ in the redirect URL.
    redirects: {
        "pm-mention-alert-notifications": "/help/dm-mention-alert-notifications",
    ...
```

Note that you will also need to add redirects when you're deleting
a help center article and adding its content to an existing article
as a section. In that case, the new URL will include the new section
header:

```
"add-an-alert-word": "/help/dm-mention-alert-notifications#alert-words"
```

You should still check for references to the old URL in your branch
and replace those with the new URL (e.g., `git grep "/help/foo"`).
One exception to this are links with the old URL that were included
in the content of `zulip_update_announcements`, which can be found
in `zerver/lib/zulip_update_announcements.py`. It's preferable to
have the source code accurately reflect what was sent to users in
those [Zulip update announcements][help-zulip-updates], so these
should not be replaced with the new URL.

Updating section headers in existing help center articles does not
require adding a URL redirect, but you will need to update any
existing links to that article's section in your branch.

If you have the Zulip development environment set up, you can manually
test your changes by loading the old URL in your browser (e.g.,
`http://localhost:9991/help/foo`), and confirming that it redirects to
the new url (e.g., `http://localhost:9991/help/bar`).

[help-zulip-updates]: https://zulip.com/help/configure-automated-notices#zulip-update-announcements

## Writing style

Below are some general style and writing conventions that should be used
as guidance when documenting Zulip's features.

### User interface

When you refer to the features in the Zulip UI, you should **bold** the
feature's name followed by the feature itself (e.g., **Settings** page,
**Change password** button, **Email** field). No quotation marks should be
used. Use **bold** for channel names, and quotation marks for topic names.

Keep in mind that the UI may change — don’t describe it in more detail than
is needed. In particular:

- Do not specify what the default configuration is. This might change in the
  future, or may even be different for different types of organizations.
- Do not list out the options the user is choosing from. Once the user finds the
  right menu in the UI, they'll be able to see the options. In some cases, we
  may describe the options in more detail outside of the instructions block.
- Never identify or refer to a button by its color. You _can_ describe its
  location.
- Use screenshots only when it's very difficult to get your point across without
  them.

### Voice

Do not use `we` to refer to Zulip or its creators; for example, "Zulip also
allows ...", rather than "we also allow ...". On the other hand, `you` is ok
and used liberally.

### Keyboard shortcuts

Surround each keyboard key in the shortcut with `<kbd>` HTML element start and
end tags (e.g., `<kbd>Enter</kbd>` or `<kbd>R</kbd>`).

For shortcuts with more than one key, add a plus sign (+) surrounded by spaces
in between the keys (e.g., `<kbd>Ctrl</kbd> + <kbd>K</kbd>`). Any shortcut for
an arrow key (↑, ↓, ←, →) will also need the `"arrow-key"` CSS class included
in the `<kbd>` start tag (e.g., ` <kbd class="arrow-key">↑</kbd>`).

Use the labels one sees on the actual keyboard rather than the letter they
produce when pressed (e.g., `R` and `Shift` + `R` rather than `r` and `R`).
For symbols, such as `?` or `@`, that are produced through key combinations that
change depending on the user's keyboard layout, you should use the symbol as it
appears on a keyboard instead of any specific combination of keys.

Use non-Mac keyboard keys; for example `Enter`, instead of `Return`. Zulip will
automatically translate non-Mac keys to the Mac versions for users with a Mac
user agent. If you want to confirm that your documentation is rendering Mac keys
correctly when writing documentation in Windows or Linux, you can temporarily
change `has_mac_keyboard` in `/web/src/common.ts` to always return `True`.
Then when you view your documentation changes in the development environment,
the keyboard shortcuts should be rendered with Mac keys where appropriate.

If you're adding a tip to an article about a keyboard shortcut, you should
use the more specific [keyboard tip](#asides) component. In general, all
keyboard shortcuts should be documented on the [keyboard
shortcuts](https://zulip.com/help/keyboard-shortcuts) help center
article.

### Images

Images and screenshots should be included in help center documentation
_only_ if they will help guide the user in how to do something (e.g., if
the image will make it much clearer which element on the page the user
should interact with). For instance, an image of an element should
not be included if the element the user needs to interact with is the
only thing on the page, but images can be included to show the end
result of an interaction with the UI.

Using too many screenshots creates maintainability problems (we have
to update them every time the UI is changed) and also can make the
instructions for something simple look long and complicated.

When taking screenshots, the image should never include the whole
Zulip browser window in a screenshot; instead, it should only show
relevant parts of the app. In addition, the screenshot should always
come _after_ the text that describes it, never before.

Images used in the help center can be found at `starlight_help/src/images`.

## MDX features and custom Zulip components

MDX supports standard markdown syntax. Some useful markdown features to
remember when writing help center documentation are:

- Since raw HTML is supported in Markdown, you can include arbitrary
  HTML/CSS in your documentation as needed.

- Code blocks allow you to highlight syntax, similar to
  [Zulip's own Markdown](https://zulip.com/help/format-your-message-using-markdown).

- Anchor tags can be used to link to headers in other documents.

Additionally, there are some useful MDX components implemented and used
throughout the help center documentation:

- [Icon](#icons) components allow documentation to use the exact icons
  for a button or link that is used in the Zulip UI.

- [Include files](#include-files) allow us to reuse repeated content
  in the documentation.

- Our custom [Aside](#asides) components create special highlighted
  information and warning blocks for tips, keyboard shortcuts, and the
  like.

- Instructions can be formatted with [Tab](#tabs),
  [Steps/FlattenSteps](#steps-and-flattenedsteps) and
  [NavigationSteps](#navigationsteps) components.

### Icons

See [icons documentation](../subsystems/icons.md). Icons should always be
referred to with their in-app tooltip or a brief action name, _not_ the
name of the icon in the code.

When using these icons in an MDX file, they act as any other component:

```
import SquarePlusIcon from "~icons/zulip-icon/square-plus"

Click the **new topic** (<SquarePlusIcon />) button next to the name of the channel.
```

For the import statement, the icon component should be named as the camel
case of the icon name, with any dashes removed, followed by `Icon`, e.g.,
in the example above `square-plus` is imported as `SquarePlusIcon`.

### Include files

You can include any file inside another MDX file as a regular import, which
helps to eliminate repeated content in our documentation.

All our include files live at `starlight_help/src/content/docs/include`,
and can be imported and used as a regular component:

```
import AdminOnly from "./include/_AdminOnly.mdx";

<AdminOnly />
```

If you're adding a new include file, make sure to have an underscore at the
beginning of the file name as that ensures the file won't be considered a
standalone article in the help center.

A lot of our include files are list macros, i.e., they are partial lists
that are part of bigger lists. When the partial list is an ordered list,
it needs to be wrapped in a [FlattenedSteps](#steps-and-flattenedsteps)
component.

We recommend avoiding having any h2 or h3 headers (`##`, `###`) in an
include file because, when the file is imported into a help center article,
those headings will not be rendered in the "On this page" outline in the
right sidebar.

If it is necessary to have headers in the include file content, then the
work around for having them rendered in the right sidebar is to insert the
same headers into any file where you are importing and using that include
file. In example below, we add the two h3 headers from the include file so
that they are rendered in the right sidebar:

```
import AutomaticallyFollowTopics from "./include/_AutomaticallyFollowTopics.mdx";

<AutomaticallyFollowTopics>
  ### Follow topics you start or participate in

  ### Follow topics where you are mentioned
</AutomaticallyFollowTopics>
```

### Asides

We have customized aside components that are used for tips, warnings and
keyboard tips in the help center.

A **tip** is any suggestion for the user that is not part of the main set
of instructions. For instance, it may address a common problem users may
encounter while following the instructions, or point to an option for power
users.

```
import ZulipTip from "../../components/ZulipTip.astro";

<ZulipTip>
  The app will update automatically to future versions.
</ZulipTip>
```

A **keyboard tip** is a note for users to let them know that the same action
can also be accomplished via a [keyboard shortcut](#keyboard-shortcuts).

```
import KeyboardTip from "../../components/KeyboardTip.astro";

<KeyboardTip>
  You can also use <kbd>?</kbd> to open the keyboard shortcuts reference.
</KeyboardTip>
```

A **warning** is a note on what happens when there is some kind of problem.
Tips are more common than warnings.

```
import ZulipNote from "../../components/ZulipNote.astro";

<ZulipNote>
  This feature is only available to organization owners and administrators.
</ZulipNote>
```

There should be only one tip/warning inside each component. They usually
should be formatted as a continuation of a numbered step, if they are in
an ordered list.

You can find the code for these custom aside components at
`starlight_help/src/components`.

### Tabs

There are built-in [starlight/astro `Tab` and `TabItem`
components](https://starlight.astro.build/components/tabs/) for creating
tabbed instructions:

```
import {Steps, TabItem, Tabs} from "@astrojs/starlight/components";

import FlattenedSteps from "../../components/FlattenedSteps.astro";

import MobileSwitchAccount from "./include/_MobileSwitchAccount.mdx";

<Tabs>
  <TabItem label="Mobile">
    <FlattenedSteps>
      <MobileSwitchAccount />

      1. Tap **Add new account**.
      1. Enter the Zulip URL of the organization, and tap **Continue**.
      1. Follow the on-screen instructions.
    </FlattenedSteps>
  </TabItem>

  <TabItem label="Web">
    <Steps>
      1. Go to the Zulip URL of the organization.
      1. Follow the on-screen instructions.
    </Steps>
  </TabItem>
</Tabs>
```

The above example has instructions for logging in for the mobile app
and the web app. Make sure you add a label for each `TabItem`.

#### Steps and FlattenedSteps

If you don't need multiple tabs, or a tabbed label, for your instructions,
then you can just wrap the ordered list of instructions in a [`Steps`
component](https://starlight.astro.build/components/steps/):

```
import {Steps} from "@astrojs/starlight/components";

<Steps>
  1. Go to the Zulip URL of the organization.
  1. Follow the on-screen instructions.
</Steps>
```

If you have an ordered list of instructions with a portion of the list in
an [include file](#include-files), then you need to wrap the instructions
in a `FlattenedSteps` component, so that the instructions are numbered
correctly when rendered (e.g., `1.`, `2.`, `3.`, `4.`, etc.):

```
import FlattenedSteps from "../../components/FlattenedSteps.astro";

import MobileSwitchAccount from "./include/_MobileSwitchAccount.mdx";

<FlattenedSteps>
  <MobileSwitchAccount />

  1. Tap **Add new account**.
  1. Enter the Zulip URL of the organization, and tap **Continue**.
  1. Follow the on-screen instructions.
</FlattenedSteps>
```

#### NavigationSteps

Many instructions begin with the same set of steps, some of which can have
relative links that directly go to the logged in session for the Zulip
organization of the user reading the documentation. For these partial
instruction lists, we use a custom `NavigationSteps` component, which needs
to be wrapped in a `FlattenedSteps` component ([see above](#steps-and-flattenedsteps)).

```
import NavigationSteps from "../../components/NavigationSteps.astro";

<FlattenedSteps>
  <NavigationSteps target="settings/organization-permissions" />

  1. Under **Joining the organization**, toggle **Invitations are required for
     joining this organization**.

  <SaveChanges />
</FlattenedSteps>
```

Each `NavigationStep` has a `target`, which can be one of two forms:

- Settings: `settings/{setting_key}`
- Relative: `relative/{link_type}/{key}`

The settings targets are for instructions that navigate to a section in
either the personal or organization settings overlay in the web app.

The relative targets are for instructions that navigate from the gear or
help menus to a particular location in the web app.

See `starlight_help/src/components/NavigationSteps.astro` for what values
for settings and relative targets are currently implemented.

You can find the code for any custom components used in the help center at:
`starlight_help/src/components`.
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/docs/documentation/index.md

```text
# Writing documentation

```{toctree}
---
maxdepth: 3
---

overview
helpcenter
integrations
api
openapi
```
```

--------------------------------------------------------------------------------

---[FILE: integrations.md]---
Location: zulip-main/docs/documentation/integrations.md

```text
# Documenting an integration

In order for a [Zulip
integration](https://zulip.com/api/integrations-overview) to be useful
to users, it must be documented. Zulip's common system for documenting
integrations involves writing Markdown files, either at
`zerver/webhooks/{webhook_name}/doc.md` (for webhook integrations) or
`templates/zerver/integrations/{integration_name}.md` (for other
integrations).

The [integrations][api-integrations] in
[zulip/python-zulip-api][api-repo] have their corresponding Markdown files
at `zulip/integrations/{integration_name}/doc.md`, which are imported into
[zulip/zulip][zulip-repo] at
`static/generated/integrations/{integration_name}/doc.md` using the
`tools/setup/generate_bots_integrations_static_files.py` script.

[api-repo]: https://github.com/zulip/python-zulip-api/
[api-integrations]: https://github.com/zulip/python-zulip-api/tree/main/zulip/integrations
[zulip-repo]: https://github.com/zulip/zulip

Typically, the documentation process involves the following steps:

- Add text explaining all of the steps required to set up the
  integration, including what URLs to use, etc. See
  [Writing guidelines](#writing-guidelines) for detailed writing guidelines.

  Zulip's pre-defined Markdown macros can be used for some of these steps.
  See [Markdown macros](#markdown-macros) for further details.

- Make sure you've added your integration to `zerver/lib/integrations.py` in
  the relevant `*_INTEGRATIONS` list, such as the
  `INCOMING_WEBHOOK_INTEGRATIONS` list for incoming webhook integrations.

  These lists get aggregated into the `INTEGRATIONS` registry which
  configures your integration to appear on the `/integrations` page, and
  makes it possible to automatically generate the screenshot of an example
  message, which is important so that these screenshots can be easily
  updated as Zulip's design changes.

- You'll need to add an SVG graphic of your integration's logo under the
  `static/images/integrations/logos/<name>.svg`, where `<name>` is the
  name of the integration, all in lower case; you can usually find them in the
  product branding or press page. Make sure to optimize the SVG graphic by
  running `tools/setup/optimize-svg`. This will also run
  `tools/setup/generate_integration_bots_avatars.py` automatically to generate
  a smaller version of the image you just added and optimized. This smaller
  image will be used as the bot avatar in the documentation screenshot that
  will be generated in the next step.

  If you cannot find an SVG graphic of the logo, please find and include a PNG
  image of the logo instead.

- Finally, you will need to generate a message sent by the integration, and
  generate a screenshot of the message to provide an example message in the
  integration's documentation.

  If your new integration is not an incoming webhook and does not have fixtures, add a
  message template and topic to `zerver/webhooks/fixtureless_integrations.py`.
  Then, add your integration's name to `FIXTURELESS_INTEGRATIONS_WITH_SCREENSHOTS`
  in `zerver/lib/integrations.py`. See [this commit][example-commit] for an
  example.

  Otherwise, you should have already added your integration along with its
  screenshot config to `INCOMING_WEBHOOK_INTEGRATIONS`.

  Generate the screenshot using `tools/screenshots/generate-integration-docs-screenshot`,
  where `integrationname` is the name of the integration:

  ```bash
  ./tools/screenshots/generate-integration-docs-screenshot --integration integrationname
  ```

  If you have trouble using this tool, you can also manually generate the
  screenshot using `manage.py send_webhook_fixture_message`. When generating the
  screenshot of a sample message using this method, give your test bot a nice
  name like "GitHub Bot", use the project's logo as the bot's avatar, and take
  the screenshot showing the channel/topic bar for the message, not just the
  message body.

[example-commit]: https://github.com/zulip/zulip/commit/f6e847d026013097ecdc484ec6675680ce76aa84

## Markdown macros

**Macros** are elements in the format of `{!macro.md!}` that insert common
phrases and steps at the location of the macros. Macros help eliminate
repeated content in our documentation.

The source for macros is the Markdown files under
`templates/zerver/integrations/include/` in the
[main Zulip server repository](https://github.com/zulip/zulip). If you find
multiple instances of particular content in the documentation, you can
always create a new macro by adding a new file to that folder.

Here are a few common macros used to document Zulip's integrations:

- `{!create-channel.md!}` macro - Recommends that users create a dedicated
  channel for a given integration. Usually the first step is setting up an
  integration or incoming webhook. For an example rendering, see **Step 1** of
  [the docs for Zulip's Zendesk integration][zendesk].

- `{!create-an-incoming-webhook.md!}` macro - Instructs users to create a bot
  for a given integration and select **Incoming webhook** as the **Bot type**.
  This macro is usually used right after `{!create-channel.md!}`. For an example
  rendering, see **Step 2** of [the docs for Zulip's Zendesk integration][zendesk].

- `{!create-a-generic-bot.md!}` macro - Instructs users to create a bot
  for a given integration and select **Generic bot** as the **Bot type**. For an
  example rendering, see [the docs for Zulip's Matrix integration][matrix].

- `{!generate-webhook-url-basic.md!}` - Instructs user how to get the URL for a
  bot for a given integration. Note that this macro should not be used with the
  `{!create-channel.md!}` macro. For an example rendering, see **Step 2** of
  [the docs for Zulip's GitHub integration][github-integration].

- `{!generate-integration-url.md!}` - Instructs user how to get the URL for a
  bot for a given integration. An example URL is generated automatically for
  every incoming webhook by using attributes in the `IncomingWebhookIntegration` class
  in [zerver/lib/integrations.py][integrations-file].

  **Note:** If special configuration is required to set up the URL and you can't
  use these macros, be sure to use the `{{ api_url }}` template variable, so
  that your integration documentation will provide the correct URL for whatever
  server it is deployed on.

- `{!congrats.md!}` macro - Inserts congratulatory lines signifying the
  successful setup of a given integration. This macro is usually used at
  the end of the documentation, right before the sample message screenshot.
  For an example rendering, see the end of
  [the docs for Zulip's GitHub integration][github-integration].

- `{!event-filtering-additional-feature.md!}` macro - If a webhook integration
  supports event filtering, then this adds a section with the specific
  events that can be filtered for the integration. Should be included in
  the documentation if `all_event_types` is set in the webhook integration
  view. For an example see, the **Filtering incoming events** section in
  [Zulip's GitLab integration][gitlab].

- `{!download-python-bindings.md!}` macro - Links to Zulip's
  [API page](https://zulip.com/api/) to download and install Zulip's
  API bindings. This macro is usually used in non-webhook integration docs under
  `templates/zerver/integrations/<integration_name>.md`. For an example
  rendering, see **Step 3** of
  [the docs for Zulip's Codebase integration][codebase].

- `{!change-zulip-config-file.md!}` macro - Instructs users to create a bot and
  specify said bot's credentials in the config file for a given non-webhook
  integration. This macro is usually used in non-webhook integration docs under
  `templates/zerver/integrations/<integration_name>.md`. For an example
  rendering, see **Step 4** of
  [the docs for Zulip's Codebase integration][codebase].

- `{!webhook-url-with-bot-email.md!}` - Used in certain non-webhook integrations
  to generate URLs of the form:

  ```text
  https://bot_email:bot_api_key@your-org.zulipchat.com/api/v1/external/beanstalk
  ```

  For an example rendering, see
  [Zulip's Beanstalk integration](https://zulip.com/integrations/beanstalk).

[github-integration]: https://zulip.com/integrations/github
[zendesk]: https://zulip.com/integrations/zendesk
[matrix]: https://zulip.com/integrations/matrix#configure-the-bridge
[codebase]: https://zulip.com/integrations/codebase
[beanstalk]: https://zulip.com/integrations/beanstalk
[front]: https://zulip.com/integrations/front
[gitlab]: https://zulip.com/integrations/gitlab
[integrations-file]: https://github.com/zulip/zulip/blob/main/zerver/lib/integrations.py

## Writing guidelines

For the vast majority of integrations, you should just copy the docs for a
similar integration and edit it. [Basecamp][basecamp] is a good one to copy.

[basecamp]: https://zulip.com/integrations/basecamp

### General writing guidelines

At a high level, the goals are for the instructions to feel simple, be easy to
follow, and be easy to maintain. Easier said than done, but here are a few
concrete guidelines.

##### Feel simple

- Use simple language.
- Use the imperative tense.
- Only describe things as much as necessary. For example: "Select **Project settings**."
  is better than "Select **Project settings** from the dropdown."
- Cut unnecessary words. For example, do not start steps with transition words
  like "Next", "First", "Now", etc. Each step should be structurally
  independent.

##### Be easy to follow

- Actions should appear in order, including implicit ones. So "Under
  **Webhooks**, click **Add Webhook**." not "Click **Add Webhook** in the
  **Webhooks** section." "Under **Webhooks**" is an action, since it’s basically
  the same as "Find the Webhooks section".
- UI elements in third-party websites should be **bolded**.
- Trailing punctuation can be stripped from bolded elements. For example,
  "**Enable this checkbox**" instead of "**Enable this checkbox?**".
  Starting punctuation such as the "**+**" in "**+ New Notification**" should
  be preserved.
- You can use a screenshot if a step is particularly complicated
  (see [Screenshots](#screenshots) below).

##### Be easy to maintain

- Follow the organization and wording of existing docs as much as possible.

### Guidelines for specific steps

Most doc files should start with a generic sentence about the
integration, for example, "Get `webhook name` notifications in Zulip!"
A typical doc will then have the following steps.

##### "Create the channel" step

- Use the `create-channel` macro. This step should be omitted if the
  integration only supports notifications via direct messages.

##### "Create the bot" step

- Typically, use the `create-an-incoming-webhook` and
  `generate-integration-url` macros.
- [Existing macros](#markdown-macros) should be used for this if they exist,
  but if the macro defaults don’t work, it may make sense to write something
  custom for the integration in question. This step is mandatory for all
  integrations.

##### "Navigate to this screen" step

- In general, this should be one step, even if it takes multiple clicks.
- Begin by mentioning the third-party service being documented with language
  such as "Go to your Taiga project", "Go to your GitHub repository",
  "On your X project", etc. Assume the user is already logged in to their
  account.
- If a UI element is difficult to spot, you can use additional cues like
  "Click on **Settings** in the top-right corner" or "On the left, click
  **Webhooks**.". Only do this if the element is actually difficult to spot.
- If this step includes more than 5 sentences, it may need to be split up
  into multiple steps.

##### "Fill out form and save" step

- Filling out a form and clicking **Save** should generally be one step, even if
  there are multiple fields to fill out.
- It’s fine to say things like "Follow the on-screen instructions to create an
  app" if they have a sequence of steps they guide you through that are pretty
  clear.

Lastly, end with the `congrats.md` macro and a screenshot of a sample message
within Zulip.

### Screenshots

Screenshots are hard to maintain, so we generally err on the side of not
including screenshots. That being said, screenshots may be used to aid the
process if the third-party UI is confusing or a specific UI element is hard
to find. A few things to keep in mind:

- Screenshots should be small and should mainly include the third-party UI that
  the text is referring to that is difficult to locate.
- Screenshots should never include the entirety of a third-party website’s page.
- Each screenshot should come after the step that refers to it.

## Markdown features

Zulip's Markdown processor allows you to include several special features in
your documentation to help improve its readability:

- Since raw HTML is supported in Markdown, you can include arbitrary
  HTML/CSS in your documentation as needed.

- Code blocks allow you to highlight syntax, similar to
  [Zulip's own Markdown](https://zulip.com/help/format-your-message-using-markdown).

- Anchor tags can be used to link to headers in other documents.

- Inline [icons](#icons) are used to refer to features in the Zulip UI.

- Utilize [macros](#markdown-macros) to limit repeated content in the documentation.

- Create special highlight warning blocks using
  [tips and warnings](#tips-and-warnings).

- Format instructions with tabs using
  [Markdown tab switcher](#tab-switcher).

### Icons

See [icons documentation](../subsystems/icons.md). Icons should always be
referred to with their in-app tooltip or a brief action name, _not_ the
name of the icon in the code.

### Tips and warnings

A **tip** is any suggestion for the user that is not part of the main set of
instructions. For instance, it may address a common problem users may
encounter while following the instructions, or point to an option for power
users.

```md
!!! tip ""

    If you want notifications for issues, as well as events, you can
    scroll down to **Webhooks** on the same page, and toggle the
    **issue** checkbox.
```

A **keyboard tip** is a note for users to let them know that the same action
can also be accomplished via a [keyboard shortcut](https://zulip.com/help/keyboard-shortcuts).

```md
!!! keyboard_tip ""

    Use <kbd>D</kbd> to bring up your list of drafts.
```

A **warning** is a note on what happens when there is some kind of problem.
Tips are more common than warnings.

```md
!!! warn ""

    **Note**: Zulip also supports configuring this integration as a
    webhook in Sentry.
```

All tips/warnings should appear inside tip/warning blocks. There
should be only one tip/warning inside each block, and they usually
should be formatted as a continuation of a numbered step.

### Tab switcher

Our Markdown processor supports easily creating a tab switcher widget
design to easily show the instructions for different languages in API
docs, etc. To create a tab switcher, write:

```md
{start_tabs}
{tab|python}
# First tab's content
{tab|js}
# Second tab's content
{tab|curl}
# Third tab's content
{end_tabs}
```

The tab identifiers (e.g., `python` above) and their mappings to
the tabs' labels are declared in
[zerver/lib/markdown/tabbed_sections.py][tabbed-sections-code].

This widget can also be used just to create a nice box around a set of
instructions
([example](https://zulip.com/help/deactivate-your-account)) by
only declaring a single tab, which is often used for the main set of
instructions for setting up an integration.

[tabbed-sections-code]: https://github.com/zulip/zulip/blob/main/zerver/lib/markdown/tabbed_sections.py
```

--------------------------------------------------------------------------------

````
