---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 278
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 278 of 1290)

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

---[FILE: html-css.md]---
Location: zulip-main/docs/subsystems/html-css.md

```text
# HTML and CSS

## Zulip CSS organization

There are two high-level sections of CSS: the "portico" (logged-out
pages like `/help/`, `/login/`, etc.), and the app. The Zulip
application's CSS can be found in the `web/styles/` directory, while
the portico CSS lives under the `web/styles/portico/` subdirectory.

To generate its CSS files, Zulip uses [PostCSS](https://postcss.org/)
and a number of PostCSS plugins, including
[postcss-nesting](https://github.com/csstools/postcss-nesting#readme),
whose rules are derived from the [CSS Nesting](https://drafts.csswg.org/css-nesting-1/)
specification.

## Editing Zulip CSS

If you aren't experienced with doing web development and want to make
CSS changes, we recommend reading the excellent [Chrome developer tools
guide to the Elements panel and CSS](https://developer.chrome.com/docs/devtools/overview/#elements),
as well as the [section on viewing and editing CSS](https://developer.chrome.com/docs/devtools/css/)
to learn about all the great tools that you can use to modify and test
changes to CSS interactively in-browser (without even having the
reload the page!).

Our CSS is formatted with [Prettier](https://prettier.io/). You can
ask Prettier to reformat all code via our [linter
tool](../testing/linters.md) with `tools/lint --only=prettier --fix`.
You can also [integrate it with your
editor](https://prettier.io/docs/en/editors.html).

Zulip's development environment has hot code-reloading configured, so
changes made in source files will immediately take effect in open
browser windows, either by live-updating the CSS or reloading the
browser window (following backend changes).

## CSS style guidelines

### Avoid duplicated code

Without care, it's easy for a web application to end up with thousands
of lines of duplicated CSS code, which can make it very difficult to
understand the current styling or modify it. We would very much like
to avoid such a fate. So please make an effort to reuse existing
styling, clean up now-unused CSS, etc., to keep things maintainable.

Opt to write CSS in CSS files. Avoid using the `style=` attribute in
HTML except for styles that are set dynamically. For example, we set
the colors for specific channels (`{{stream_color}}`) on different
elements dynamically, in files like `user_stream_list_item.hbs`:

```html
<span
  class="stream-privacy-original-color-{{stream_id}} stream-privacy filter-icon"
  style="color: {{stream_color}}">
```

But for most other cases, its preferable to define logical classes and
put your styles in external CSS files such as `zulip.css` or a more
specific CSS file, if one exists. See the contents of the `web/styles/`
directory.

### Be consistent with existing similar UI

Ideally, do this by reusing existing CSS declarations, so that any
improvements we make to the styling can improve all similar UI
elements.

### Use clear, unique names for classes and object IDs

This makes it much easier to read the code and use `git grep` to find
where a particular class is used.

Don't use the tag name in a selector unless you have to. In other words,
use `.foo` instead of `span.foo`. We shouldn't have to care if the tag
type changes in the future.

Additionally, multi-word class and ID values should be hyphenated,
also known as _kebab case_. In HTML, opt for `class="my-multiword-class"`,
with its corresponding CSS selector as `.my-multiword-class`.

## Validating CSS

When changing any part of the Zulip CSS, it's important to check that
the new CSS looks good at a wide range of screen widths, from very
wide screen (e.g., 1920px) all the way down to narrow phone screens
(e.g., 480px).

For complex changes, it's definitely worth testing in a few different
browsers to make sure things look the same.

## HTML templates

### Behavior

- Templates are automatically recompiled in development when the file
  is saved; a refresh of the page should be enough to display the latest
  version. You might need to do a hard refresh, as some browsers cache
  webpages.

- Variables can be used in templates. The variables available to the
  template are called the **context**. Passing the context to the HTML
  template sets the values of those variables to the value they were
  given in the context. The sections below contain specifics on how the
  context is defined and where it can be found.

### Backend templates

For text generated in the backend, including logged-out ("portico")
pages and the web app's base content, we use the [Jinja2][] template
engine (files in `templates/zerver`).

The syntax for using conditionals and other common structures can be
found [here][jconditionals].

The context for Jinja2 templates is assembled from a couple places:

- `zulip_default_context` in `zerver/context_processors.py`. This is
  the default context available to all Jinja2 templates.

- As an argument in the `render` call in the relevant function that
  renders the template. For example, if you want to find the context
  passed to `index.html`, you can do:

```console
$ git grep zerver/app/index.html '*.py'
zerver/views/home.py:    response = render(request, 'zerver/app/index.html',
```

The next line in the code being the context definition.

### Frontend templates

For text generated in the frontend, live-rendering HTML from
JavaScript for things like the main message feed, we use the
[Handlebars][] template engine (files in `web/templates/`) and
sometimes work directly from JavaScript code (though as a policy
matter, we try to avoid generating HTML directly in JavaScript
wherever possible).

The syntax for using conditionals and other common structures can be
found [here][hconditionals].

There's no equivalent of `zulip_default_context` for the Handlebars
templates.

### Toolchain

Handlebars is in our `package.json` and thus ends up in `node_modules`; We use
handlebars-loader to load and compile templates during the webpack bundling
stage. In the development environment, webpack will trigger a browser reload
whenever a template is changed.

### Translation

All user-facing strings (excluding pages only visible to sysadmins or
developers) should be tagged for [translation][trans].

### Tooltips

Zulip uses [TippyJS](https://atomiks.github.io/tippyjs/) for its tooltips.

## Static asset pipeline

This section documents additional information that may be useful when
developing new features for Zulip that require front-end changes,
especially those that involve adding new files. For a more general
overview, see the [new feature tutorial](../tutorials/new-feature-tutorial.md).

Our [dependencies documentation](dependencies.md) has useful
relevant background as well.

### Primary build process

Zulip's frontend is primarily JavaScript in the `web/src` directory;
we are working on migrating these to TypeScript modules. Stylesheets
are written in CSS extended by various PostCSS plugins; they are
converted from plain CSS, and we have yet to take full advantage of
the features PostCSS offers. We use Webpack to transpile and build JS
and CSS bundles that the browser can understand, one for each entry
points specified in `web/webpack.*assets.json`; source maps are
generated in the process for better debugging experience.

In development mode, bundles are built and served on the fly using
webpack-dev-server with live reloading. In production mode (and when creating a
release tarball using `tools/build-release-tarball`), the
`tools/update-prod-static` tool (called by both `tools/build-release-tarball`
and `tools/upgrade-zulip-from-git`) is responsible for orchestrating the
webpack build, JS minification and a host of other steps for getting the assets
ready for deployment.

You can trace which source files are included in which HTML templates
by comparing the `entrypoint` variables in the HTML templates under
`templates/` with the bundles declared in `web/webpack.*assets.json`.

### Adding static files

To add a static file to the app (JavaScript, TypeScript, CSS, images, etc),
first add it to the appropriate place under `static/`.

- Third-party packages from the NPM repository should be added to
  `package.json` for management by pnpm, this allows them to be upgraded easily
  and not bloat our codebase. Run `./tools/provision` for pnpm to install the
  new packages and update its lock file. You should also update
  `PROVISION_VERSION` in `version.py` in the same commit.
- Third-party files that we have patched should all go in
  `web/third/`. Tag the commit with "[third]" when adding or
  modifying a third-party package. Our goal is to the extent possible
  to eliminate patched third-party code from the project.
- Our own JavaScript and TypeScript files live under `web/src`. Ideally,
  new modules should be written in TypeScript (details on this policy below).
- CSS files live under `web/styles`.
- Portico JavaScript ("portico" means for logged-out pages) lives under
  `web/src/portico`.
- Custom SVG graphics living under `web/icons` are compiled into
  custom icon webfonts by webfont-loader according to the
  `web/icons/template.hbs` template. See
  [icons](../subsystems/icons.md) for more details on adding icons.

For your asset to be included in a development/production bundle, it
needs to be accessible from one of the entry points defined either in
`web/webpack.assets.json` or `web/webpack.dev-assets.json`.

- If you plan to only use the file within the app proper, and not on the login
  page or other standalone pages, put it in the `app` bundle by importing it
  in `web/src/bundles/app.ts`.
- If it needs to be available both in the app and all
  logged-out/portico pages, import it to
  `web/src/bundles/common.ts` which itself is imported to the
  `app` and `common` bundles.
- If it's just used on a single standalone page which is only used in
  a development environment (e.g., `/devlogin`) create a new entry
  point in `web/webpack.dev-assets.json` or it's used in both
  production and development (e.g., `/stats`) create a new entry point
  in `web/webpack.assets.json`. Use the `bundle` macro (defined in
  `templates/zerver/base.html`) in the relevant Jinja2 template to
  inject the compiled JS and CSS.

If you want to test minified files in development, look for the
`DEBUG =` line in `zproject/default_settings.py` and set it to `False`.

### How it works in production

A few useful notes are:

- Zulip installs static assets in production in
  `/home/zulip/prod-static`. When a new version is deployed, before the
  server is restarted, files are copied into that directory.
- We use the VFL (versioned file layout) strategy, where each file in
  the codebase (e.g., `favicon.ico`) gets a new name
  (e.g., `favicon.c55d45ae8c58.ico`) that contains a hash in it. Each
  deployment, has a manifest file
  (e.g., `/home/zulip/deployments/current/staticfiles.json`) that maps
  codebase filenames to serving filenames for that deployment. The
  benefit of this VFL approach is that all the static files for past
  deployments can coexist, which in turn eliminates most classes of
  race condition bugs where browser windows opened just before a
  deployment can't find their static assets. It also is necessary for
  any incremental rollout strategy where different clients get
  different versions of the site.
- Some paths for files (e.g., emoji) are stored in the
  `rendered_content` of past messages, and thus cannot be removed
  without breaking the rendering of old messages (or doing a
  mass-rerender of old messages).

### ES6/TypeScript modules

JavaScript modules in the frontend are [ES6
modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
that are [transpiled by
webpack](https://webpack.js.org/api/module-methods/#es6-recommended).
Any variable, function, etc. can be made public by adding the
[`export`
keyword](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export),
and consumed from another module using the [`import`
statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

New modules should ideally be written in TypeScript (though in cases
where one is moving code from an existing JavaScript module, the new
commit should just move the code, not translate it to TypeScript).
TypeScript provides more accurate information to development tools,
allowing for better refactoring, auto-completion and static analysis.
TypeScript also uses the ES6 module system. See our documentation on
[TypeScript static types](../testing/typescript).

Webpack does not ordinarily allow modules to be accessed directly from
the browser console, but for debugging convenience, we have a custom
webpack plugin (`web/debug-require-webpack-plugin.ts`) that exposes
a version of the `require()` function to the development environment
browser console for this purpose. For example, you can access our
`people` module by evaluating
`people = require("./src/people")`, or the third-party `lodash`
module with `_ = require("lodash")`. This mechanism is **not** a
stable API and should not be used for any purpose other than
interactive debugging.

We have one module, `zulip_test`, that’s exposed as a global variable
using `expose-loader` for direct use in Puppeteer tests and in the
production browser console. If you need to access a variable or
function in those scenarios, add it to `zulip_test`. This is also
**not** a stable API.

[jinja2]: http://jinja.pocoo.org/
[handlebars]: https://handlebarsjs.com/
[trans]: https://jinja.palletsprojects.com/en/3.0.x/extensions/#i18n-extension
[jconditionals]: http://jinja.pocoo.org/docs/2.9/templates/#list-of-control-structures
[hconditionals]: https://handlebarsjs.com/guide/block-helpers.html#block-helpers
[translation]: ../translating/translating.md
```

--------------------------------------------------------------------------------

---[FILE: icons.md]---
Location: zulip-main/docs/subsystems/icons.md

```text
# Icons

Zulip makes extensive use of icons to decorate elements in the UI as
well as for compact buttons and other small interactive elements.

## Using icons

- Modern Zulip icons are implemented using a class-based combination
  like `<i class="zulip-icon zulip-icon-smile"></i>`, which is rendered
  using generated CSS that maps that class name (`zulip-icon-smile`)
  to the SVG file located at `web/icons/smile.svg`.

- Older icons use [Font Awesome 4.7](https://fontawesome.com/),
  declared in our HTML via `<i class="fa fa-paperclip"></i>`. We are
  migrating away from Font Awesome both for design and licensing
  reasons (Font Awesome 5.0+ is no longer fully open source).

Always consider [accessibility](../subsystems/accessibility.md) when
using icons. Typically, this means:

- Icons that are used **purely as a decoration** immediately adjacent a
  textual label (for example, in our popover menus) should use `aria-hidden`,
  so that screenreaders ignore them in favor of reading the label.

- Buttons whose **entire label** is an icon should have a
  [tooltip](../subsystems/html-css.md#tooltips) as well as an
  `aria-label` declaration, so that screenreaders will explain the
  button. Generally, the tooltip text should be identical to the
  `aria-label` text.

## Adding a new icon

A new feature, such as a new menu option, may require a new icon to represent
it. The issue you're working on may not have an icon specified upfront. In that
case, you should:

1. Prototype using a [Lucide icon](https://lucide.dev/icons/), which is the
   preferred source for icons in Zulip. New SVG files must be placed in the
   `web/icons/` directory to be used (don't forget to `git add` new
   icons along with your other changes).

1. **When your feature is nearing completion**, post in the [appropriate
   channel](https://zulip.com/development-community/#where-do-i-send-my-message)
   in the Zulip development community to discuss what icon should be used (e.g.,
   #design for web app icons). You can use the discussion thread linked from the
   issue you're working on if there is one.

1. Once there is general consensus on the icon to be used, be sure to
   [prepare the icon's SVG file](#preparing-icons-for-use-with-zulip)
   so that it displays correctly in Zulip.

1. Follow the [attribution guidelines](../contributing/licensing.md)
   to document the icon's source in `docs/THIRDPARTY/`.

## Preparing icons for use with Zulip

You may discover that your chosen icon looks terribly broken when displayed
in Zulip. There are two common issues with SVG files that must be manually
corrected:

1. [Icons that rely on strokes](#correcting-icons-that-include-strokes),
   rather than paths
2. [Icons that have an `evenodd` value](#correcting-icons-with-an-evenodd-fill-rule)
   on the `fill-rule` attribute

Each of those problems requires a different fix, followed by some
[cleanup of the resulting SVG file](#cleaning-up-the-svg-code).

### Correcting icons that include strokes

For example, the unaltered [Lucide expand icon](https://lucide.dev/icons/expand)
illustrates what we'd expect to see versus what we actually see after the icon
goes through Zulip's automated SVG-to-font conversion:

| Expected icon (SVG)                                                               | Broken appearance (SVG to font)                                                      |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| ![Expected icon with four arrows](../images/icon-prep-stroke-correct-preview.png) | ![Broken icon with four triangles](../images/icon-prep-stroke-broken-conversion.png) |

What happened there is that the icon uses strokes, which do not properly convert
to font outlines in Zulip's automated conversion system.

To properly prepare an SVG icon for use with Zulip, you need to make sure that
all stroke components are converted to paths:

1. Open the SVG file in [Inkscape](https://inkscape.org/), a free and open-source
   visual editor for vector images, including SVG.

1. Use `Ctrl + A` or otherwise select all components of the icon.

1. Locate Inkscape's Path menu, and choose the Stroke to Path item. You'll
   immediately see your icon appear to balloon up: this is expected, because
   the previous stroke in use has now been applied to your icon's converted paths.

1. Examine the Stroke style applied to your paths on the Fill and Stroke tab of
   Inkscape's object panel. Be sure to reduce the Stroke to 0:

| Stroke incorrectly still applied                                             | Stroke set to zero                                                                       |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ![Ballooned-out icon shapes](../images/icon-prep-stroke-to-path-initial.png) | ![Expected icon shapes without stroke](../images/icon-prep-stroke-to-path-completed.png) |

At this point, you can save your file in the `web/icons/` directory and
close Inkscape before [cleaning up the SVG file](#cleaning-up-the-svg-code).

### Correcting icons with an `evenodd` fill rule

Certain icons may include a `fill-rule="evenodd"` attribute-value pairing. Those are
often found on icons where one path appears inside of another. That is the case with
the custom eye icon here, which turns solid black after going through Zulip's automated
SVG-to-font conversion:

| Expected icon (SVG)                                                              | Broken appearance (SVG to font)                                                    |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| ![Expected icon with eye shape](../images/icon-prep-evenodd-correct-preview.png) | ![Broken icon with solid shape](../images/icon-prep-evenodd-broken-conversion.png) |

Should you encounter an icon that includes a `fill-rule` (easily spotted in the SVG file's
code), you'll need to bring it into Inkscape to rework its paths.

1. Open the SVG file in [Inkscape](https://inkscape.org/), a free and open-source
   visual editor for vector images, including SVG.

1. Use `Ctrl + A` or otherwise select all components of the icon.

1. Locate Inkscape's Path menu, and choose Object to Path. This converts circles
   and other SVG shapes to paths.

1. Use `Ctrl + A` again to make sure all paths are still selected. From the Path menu,
   choose Flatten. This typically makes a reasonable combination of the visible areas
   of multiple paths.

1. Finally, again with `Ctrl + A` to ensure the flattened paths are selected, return to
   the Path menu and choose Combine. That joins all paths into a single, complex path.

At this point, you can save your file in the `web/icons/` directory and
close Inkscape before [cleaning up the SVG file](#cleaning-up-the-svg-code).

### Cleaning up the SVG code

While Inkscape does a fine job with altering SVG files for proper SVG-to-font
conversion, it also leaves a lot of crufty markup behind. So next, open your
icon's SVG file in your editor of choice.

Once opened in your editor, the file's Inkscape source will look something like this
(the example here shows only the first 25 lines or so):

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   width="24"
   height="24"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   stroke-width="2"
   stroke-linecap="round"
   stroke-linejoin="round"
   class="lucide lucide-expand-icon lucide-expand"
   version="1.1"
   id="svg8"
   sodipodi:docname="expand.svg"
   inkscape:version="1.4 (e7c3feb1, 2024-10-09)"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs8" />
  <sodipodi:namedview
     id="namedview8"
     pagecolor="#ffffff" />

<!-- ...and so on. -->
```

Your last task is to clean up the SVG's XML so that only its essential components
remain:

1. Consider using Git to add and temporarily commit the icon as output by Inkscape.
   If you make a mistake while cleaning up the icon, you can use `git restore` to
   return to that point.

1. Strip back the opening of the file to include only the `<svg>` tag and its `xmlns`,
   `width`, `height`, and `viewBox` attributes and their values as set by
   Inkscape. (There is no need to preserve the `fill` attribute, as it defaults to
   black for its [initial value](https://www.w3.org/TR/SVG2/painting.html#SpecifyingFillPaint).)

1. Remove all other tags in the file except for the `<path>` tags, which should be
   cleaned up until they have only a `d` attribute and its value as output by Inkscape.

1. When you are finished, your SVG file's source code should look something like this:

```xml
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m 15,14 a 1,1 0 0 0 -0.707031,0.292969 1,1 0 0 0 0,1.414062 l 6,6 a 1,1 0 0 0 1.414062,0 1,1 0 0 0 0,-1.414062 l -6,-6 A 1,1 0 0 0 15,14 Z"/>
  <path d="m 20.292969,2.2929688 -6,6 a 1,1 0 0 0 0,1.4140625 1,1 0 0 0 1.414062,0 l 6,-6 a 1,1 0 0 0 0,-1.4140625 1,1 0 0 0 -1.414062,0 z"/>
  <path d="m 21,15.199219 a 1,1 0 0 0 -1,1 V 20 h -3.800781 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 H 21 a 1.0001,1.0001 0 0 0 1,-1 v -4.800781 a 1,1 0 0 0 -1,-1 z"/>
  <path d="m 16.199219,2 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 H 20 v 3.8007812 a 1,1 0 0 0 1,1.0000001 1,1 0 0 0 1,-1.0000001 V 3 A 1.0001,1.0001 0 0 0 21,2 Z"/>
  <path d="m 3,15.199219 a 1,1 0 0 0 -1,1 V 21 a 1.0001,1.0001 0 0 0 1,1 H 7.8007812 A 1,1 0 0 0 8.8007813,21 1,1 0 0 0 7.8007812,20 H 4 v -3.800781 a 1,1 0 0 0 -1,-1 z"/>
  <path d="m 9,14 a 1,1 0 0 0 -0.7070312,0.292969 l -6,6 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140625,0 l 6,-6 a 1,1 0 0 0 0,-1.414062 A 1,1 0 0 0 9,14 Z"/>
  <path d="M 3,2 A 1.0001,1.0001 0 0 0 2,3 V 7.8007812 A 1,1 0 0 0 3,8.8007813 1,1 0 0 0 4,7.8007812 V 4 H 7.8007812 A 1,1 0 0 0 8.8007813,3 1,1 0 0 0 7.8007812,2 Z"/>
  <path d="m 3,2 a 1,1 0 0 0 -0.7070312,0.2929688 1,1 0 0 0 0,1.4140625 l 6,6 a 1,1 0 0 0 1.4140625,0 1,1 0 0 0 0,-1.4140625 l -6,-6 A 1,1 0 0 0 3,2 Z"/>
</svg>
```

With the source code tided up, take a moment to preview your cleaned-up file in your
browser or operating system. If you're satisfied with how it looks, you can run
`git add` and `git commit --amend` to commit your cleaned up icon--overwriting the
output from Inkscape that you committed above.

Your commit should also follow the [attribution guidelines](../contributing/licensing.md)
and document the icon's original source in `docs/THIRDPARTY/`.

## Updating UI icons in the help center

When changing an icon for an existing feature, be sure to [update the help
center](../documentation/helpcenter.md#icons) accordingly (`git grep` is your
friend for finding instances of icons to be replaced).
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/docs/subsystems/index.md

```text
# Subsystems documentation

```{toctree}
---
maxdepth: 3
---

dependencies
settings
html-css
icons
accessibility
events-system
sending-messages
notifications
queuing
pointer
markdown
caching
performance
realms
management-commands
schema-migrations
hashchange-system
emoji
onboarding-steps
full-text-search
email
analytics
client
logging
typing-indicators
django-upgrades
release-checklist
api-release-checklist
input-pills
unread_messages
billing
widgets
slash-commands
thumbnailing
```
```

--------------------------------------------------------------------------------

---[FILE: input-pills.md]---
Location: zulip-main/docs/subsystems/input-pills.md

```text
# UI: input pills

This is a high level and API explanation of the input pill interface in the
frontend of the Zulip web application.

## Setup

A pill container should have the following markup:

```html
<div class="pill-container">
    <div class="input" contenteditable="true"></div>
</div>
```

The pills will automatically be inserted in before the ".input" in order.

## Basic usage

```js
var $pill_container = $("#input_container");
var pills = input_pill.create({
    $container: $pill_container,
    create_item_from_text: user_pill.create_item_from_email,
    get_text_from_item: user_pill.get_email_from_item,
    get_display_value_from_item: user_pill.get_display_value_from_item,
});
```

You can look at `web/src/user_pill.ts` to see how the above
methods are implemented. Essentially you just need to convert
from raw data (like an email) to structured data (like an object
with display_value, email, and user_id for a user), and vice
versa.

## Typeahead

Pills almost always work in conjunction with typeahead, and
you will want to provide a `source` function to typeahead
that can exclude items from the prior pills. Here is an
example snippet from our user group settings code.

```js
source: function () {
    return user_pill.typeahead_source(pills);
},
```

And then in `user_pill.ts`...

```js
export function typeahead_source(pill_widget) {
    const persons = people.get_realm_users();
    return filter_taken_users(persons, pill_widget);
}

export function filter_taken_users(items, pill_widget) {
    const taken_user_ids = get_user_ids(pill_widget);
    items = items.filter((item) => !taken_user_ids.includes(item.user_id));
    return items;
}
```

### `onPillCreate` and `onPillRemove` methods

You can get notifications from the pill code that pills have been
created/remove.

```js
pills.onPillCreate(function () {
    update_save_state();
});

pills.onPillRemove(function () {
    update_save_state();
});
```
```

--------------------------------------------------------------------------------

````
