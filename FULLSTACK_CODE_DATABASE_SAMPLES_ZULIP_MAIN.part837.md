---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 837
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 837 of 1290)

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

---[FILE: zjquery_element.cjs]---
Location: zulip-main/web/tests/lib/zjquery_element.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const FakeEvent = require("./zjquery_event.cjs");

const noop = function () {};

// TODO: convert this to a true class
function FakeElement(selector, opts) {
    let html = "never-been-set";
    let text = "never-been-set";
    let value;
    let shown = false;
    let height;

    const find_results = new Map();
    let $my_parent;
    const parents_result = new Map();
    const properties = new Map();
    const attrs = new Map();
    const classes = new Map();
    const event_store = make_event_store(selector);

    const $self = {
        length: 1,
        [0]: {textContent: text},
        [Symbol.iterator]: Array.prototype.values,
        addClass(class_name) {
            classes.set(class_name, true);
            return $self;
        },
        append(arg) {
            html = html + arg;
            return $self;
        },
        attr(name, val) {
            if (val === undefined) {
                return attrs.get(name);
            }
            attrs.set(name, val);
            return $self;
        },
        data(name, val) {
            if (val === undefined) {
                return attrs.get("data-" + name);
            }
            attrs.set("data-" + name, val);
            return $self;
        },
        delay() {
            return $self;
        },
        /* istanbul ignore next */
        debug() {
            return {
                value,
                shown,
                selector,
            };
        },
        empty(arg) {
            if (arg === undefined) {
                find_results.clear();
                html = "";
            }
            return $self;
        },
        expectOne() {
            // silently do nothing
            return $self;
        },
        fadeTo: noop,
        find(child_selector) {
            const $child = find_results.get(child_selector);
            if ($child) {
                return $child;
            }
            if ($child === false) {
                // This is deliberately set to simulate missing find results.
                // Return an empty array, the most common check is
                // if ($.find().length) { //success }
                return [];
            }
            /* istanbul ignore next */
            throw new Error(`
                We need you to simulate the results of $(...).find(...)
                by using set_find_results. You want something like this:

                    const $container = ...;
                    const $child = ...;
                    $container.set_find_results("${child_selector}", $child);

                Then calling $container.find("${child_selector}") will return
                the "$child" zjquery element.

                `);
        },
        get_on_handler(name, child_selector) {
            return event_store.get_on_handler(name, child_selector);
        },
        hasClass(class_name) {
            return classes.has(class_name);
        },
        height() {
            assert.notEqual(height, undefined, `Please call $("${selector}").set_height`);
            return height;
        },
        hide() {
            shown = false;
            return $self;
        },
        html(arg) {
            if (arg !== undefined) {
                html = arg;
                return $self;
            }
            return html;
        },
        is(arg) {
            switch (arg) {
                case ":visible":
                    return shown;
                case ":focus":
                    return $self.is_focused();
                /* istanbul ignore next */
                default:
                    throw new Error("zjquery does not support this is() call");
            }
        },
        is_focused() {
            // is_focused is not a jQuery thing; this is
            // for our testing
            return event_store.is_focused();
        },
        off(...args) {
            event_store.off(...args);
            return $self;
        },
        offset() {
            return {
                top: 0,
                left: 0,
            };
        },
        on(...args) {
            event_store.on(...args);
            return $self;
        },
        /* istanbul ignore next */
        one(...args) {
            event_store.one(...args);
            return $self;
        },
        parent() {
            return $my_parent;
        },
        parents(parents_selector) {
            const $result = parents_result.get(parents_selector);
            assert.ok(
                $result,
                "You need to call set_parents_result for " + parents_selector + " in " + selector,
            );
            return $result;
        },
        prepend(arg) {
            html = arg + html;
            return $self;
        },
        prop(name, val) {
            if (val === undefined) {
                return properties.get(name);
            }
            properties.set(name, val);
            return $self;
        },
        removeAttr(name) {
            attrs.delete(name);
            return $self;
        },
        removeClass(class_names) {
            class_names = class_names.split(" ");
            for (const class_name of class_names) {
                classes.delete(class_name);
            }
            return $self;
        },
        /* istanbul ignore next */
        remove() {
            throw new Error(`
                We don't support remove in zjquery.

                You can do $(...).remove = ... if necessary.

                But you are probably writing too deep a test
                for node testing.
            `);
        },
        removeData: noop,
        set_find_results(find_selector, $jquery_object) {
            assert.notEqual(
                $jquery_object,
                undefined,
                "Please make the 'find result' be something like $.create('unused')",
            );
            find_results.set(find_selector, $jquery_object);
        },
        set_height(fake_height) {
            height = fake_height;
        },
        set_parent($parent_elem) {
            $my_parent = $parent_elem;
        },
        set_parents_result(selector, $result) {
            parents_result.set(selector, $result);
        },
        show() {
            shown = true;
            return $self;
        },
        text(...args) {
            if (args.length > 0) {
                if (args[0] !== undefined) {
                    text = args[0].toString();
                }
                return $self;
            }
            return text;
        },
        toggle(show) {
            assert.ok([true, false].includes(show));
            shown = show;
            return $self;
        },
        toggleClass(class_name, add) {
            if (add) {
                classes.set(class_name, true);
            } else {
                classes.delete(class_name);
            }
            return $self;
        },
        trigger(ev) {
            event_store.trigger($self, ev);
            return $self;
        },
        val(...args) {
            if (args.length === 0) {
                return value || "";
            }
            [value] = args;
            return $self;
        },
        visible() {
            return shown;
        },
    };

    if (opts.children) {
        $self.map = (f) => opts.children.map((i, elem) => f(elem, i));
        $self.each = (f) => {
            for (const child of opts.children) {
                f.call(child);
            }
        };
        $self[Symbol.iterator] = () => opts.children.values();

        for (const [i, child] of opts.children.entries()) {
            $self[i] = child;
        }

        $self.length = opts.children.length;
    }

    if (selector[0] === "<") {
        $self.html(selector);
    }

    $self.selector = selector;

    $self.__zjquery = true;

    return $self;
}

function make_event_store(selector) {
    /*

       This function returns an event_store object that
       simulates the behavior of .on and .off from jQuery.

       It also has methods to retrieve handlers that have
       been set via .on (or similar methods), which can
       be useful for tests that want to test the actual
       handlers.

    */
    const on_functions = new Map();
    const child_on_functions = new Map();
    let focused = false;

    const self = {
        get_on_handler(name, child_selector) {
            let handler;

            if (child_selector === undefined) {
                handler = on_functions.get(name);
                assert.ok(handler, `no ${name} handler for ${selector}`);
                return handler;
            }

            const child_on = child_on_functions.get(child_selector);
            if (child_on) {
                handler = child_on.get(name);
            }

            assert.ok(handler, `no ${name} handler for ${selector} ${child_selector}`);

            return handler;
        },

        off(event_name, ...args) {
            if (args.length === 0) {
                on_functions.delete(event_name);
                return;
            }

            // In the Zulip codebase we never use this form of
            // .off in code that we test: $(...).off('click', child_sel);
            //
            // So we don't support this for now.
            /* istanbul ignore next */
            throw new Error("zjquery does not support this call sequence");
        },

        on(event_name, ...args) {
            // parameters will either be
            //    (event_name, handler) or
            //    (event_name, sel, handler)
            if (args.length === 1) {
                const [handler] = args;
                /* istanbul ignore if */
                if (on_functions.has(event_name)) {
                    console.info("\nEither the app or the test can be at fault here..");
                    console.info("(sometimes you just want to call $.clear_all_elements();)\n");
                    throw new Error("dup " + event_name + " handler for " + selector);
                }

                on_functions.set(event_name, handler);
                return;
            }

            assert.equal(args.length, 2, "wrong number of arguments passed in");

            const [sel, handler] = args;
            assert.equal(typeof sel, "string", "String selectors expected here.");
            assert.equal(typeof handler, "function", "An handler function expected here.");

            if (!child_on_functions.has(sel)) {
                child_on_functions.set(sel, new Map());
            }

            const child_on = child_on_functions.get(sel);

            assert.ok(
                !child_on.has(event_name),
                `dup ${event_name} handler for ${selector} ${sel}`,
            );

            child_on.set(event_name, handler);
        },

        /* istanbul ignore next */
        one(event_name, handler) {
            self.on(event_name, function (ev) {
                self.off(event_name);
                return handler.call(this, ev);
            });
        },

        trigger($element, ev, data) {
            if (typeof ev === "string") {
                ev = new FakeEvent(ev);
            }
            if (!ev.target) {
                // FIXME: event.target should not be a jQuery object
                ev.target = $element; // eslint-disable-line no-jquery/variable-pattern
            }
            const func = on_functions.get(ev.type);

            if (func) {
                // It's possible that test code will trigger events
                // that haven't been set up yet, but we are trying to
                // eventually deprecate trigger in our codebase, so for
                // now we just let calls to trigger silently do nothing.
                // (And I think actual jQuery would do the same thing.)
                func.call($element, ev, data);
            }

            if (ev.type === "focus" || ev.type === "focusin") {
                focused = true;
            } else if (ev.type === "blur" || ev.type === "focusout") {
                focused = false;
            }
        },

        is_focused() {
            return focused;
        },
    };

    return self;
}

module.exports = FakeElement;
```

--------------------------------------------------------------------------------

---[FILE: zjquery_event.cjs]---
Location: zulip-main/web/tests/lib/zjquery_event.cjs

```text
"use strict";

class FakeEvent {
    constructor(type, props) {
        this.type = type;
        Object.assign(this, props);
    }
    preventDefault() {}
    stopPropagation() {}
}

module.exports = FakeEvent;
```

--------------------------------------------------------------------------------

---[FILE: zpage_billing_params.cjs]---
Location: zulip-main/web/tests/lib/zpage_billing_params.cjs

```text
"use strict";

exports.page_params = {};

exports.reset = () => {
    for (const field in exports.page_params) {
        if (Object.hasOwn(exports.page_params, field)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete exports.page_params[field];
        }
    }
};
```

--------------------------------------------------------------------------------

---[FILE: zpage_params.cjs]---
Location: zulip-main/web/tests/lib/zpage_params.cjs

```text
"use strict";

exports.page_params = {};

exports.reset = () => {
    for (const field in exports.page_params) {
        if (Object.hasOwn(exports.page_params, field)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete exports.page_params[field];
        }
    }
};
```

--------------------------------------------------------------------------------

---[FILE: and.hbs]---
Location: zulip-main/web/tests/templates/and.hbs

```text
{{#if (and)}}<p>empty and</p>{{/if}}
{{#if (and true last)}}<p>last and</p>{{/if}}
{{#if (and false true)}}<p>false and</p>{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: numberFormat.hbs]---
Location: zulip-main/web/tests/templates/numberFormat.hbs

```text
{{numberFormat number}}
```

--------------------------------------------------------------------------------

---[FILE: or.hbs]---
Location: zulip-main/web/tests/templates/or.hbs

```text
{{#if (or)}}<p>empty or</p>{{/if}}
{{#if (or false last)}}<p>last or</p>{{/if}}
{{#if (or true false)}}<p>true or</p>{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: popover_hotkey_hints.hbs]---
Location: zulip-main/web/tests/templates/popover_hotkey_hints.hbs

```text
{{popover_hotkey_hints hotkey_one hotkey_two}}
```

--------------------------------------------------------------------------------

---[FILE: rendered_markdown.hbs]---
Location: zulip-main/web/tests/templates/rendered_markdown.hbs

```text
{{rendered_markdown "<a href='http://example.com'>good</a>"}}
```

--------------------------------------------------------------------------------

---[FILE: tooltip_hotkey_hints.hbs]---
Location: zulip-main/web/tests/templates/tooltip_hotkey_hints.hbs

```text
{{tooltip_hotkey_hints hotkey_one hotkey_two}}
```

--------------------------------------------------------------------------------

---[FILE: bootstrap-btn.css]---
Location: zulip-main/web/third/bootstrap/css/bootstrap-btn.css

```text
/*!
 Software from "Bootstrap" is Copyright (c) 2011-2014 Twitter, Inc. and is provided
 under the following license (the Bootstrap software has been modified):
 --
The MIT License (MIT)

Copyright (c) 2011-2014 Twitter, Inc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

.bootstrap-btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 0px;
}
.bootstrap-btn:focus,
.bootstrap-btn:active:focus,
.bootstrap-btn.active:focus {
  outline: thin dotted;
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px;
}
.bootstrap-btn:hover,
.bootstrap-btn:focus {
  color: #333;
  text-decoration: none;
}
.bootstrap-btn:active,
.bootstrap-btn.active {
  background-image: none;
  outline: 0;
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
          box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
}
.bootstrap-btn.disabled,
.bootstrap-btn[disabled] {
  pointer-events: none;
  cursor: not-allowed;
  -webkit-box-shadow: none;
          box-shadow: none;
  opacity: .65;
}
```

--------------------------------------------------------------------------------

---[FILE: bootstrap.app.css]---
Location: zulip-main/web/third/bootstrap/css/bootstrap.app.css

```text
/*!
 * Bootstrap v2.3.2
 *
 * Copyright 2012 Twitter, Inc
 * Licensed under the Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Designed and built with all the love in the world @twitter by @mdo and @fat.
 */
a:focus {
  outline: thin dotted #333;
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px;
}
a:hover,
a:active {
  outline: 0;
}
img {
  /* Responsive images (ensure images don't scale beyond their parents) */

  max-width: 100%;
  /* Part 1: Set a maximum relative to the parent */

  height: auto;
  /* Part 2: Scale the height according to the width, otherwise you get stretching */

  vertical-align: middle;
  border: 0;
}
button {
  -webkit-appearance: button;
}
p {
  margin: 0 0 10px;
}
h1,
h2,
h3,
h4 {
  margin: 10px 0;
  font-family: inherit;
  font-weight: bold;
  line-height: 20px;
  color: inherit;
  text-rendering: optimizelegibility;
}
h1,
h2,
h3 {
  line-height: var(--header-line-height);
}
h1 {
  font-size: 38.5px;
}
h2 {
  font-size: 31.5px;
}
h3 {
  font-size: 24.5px;
}
h4 {
  font-size: 17.5px;
}
ul,
ol {
  padding: 0;
  margin: 0 0 10px 25px;
}
ul ul,
ul ol,
ol ol,
ol ul {
  margin-bottom: 0;
}
hr {
  margin: 20px 0;
  border: 0;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #ffffff;
}
form {
  margin: 0 0 20px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input[disabled],
input[readonly] {
  cursor: not-allowed;
  background-color: #eeeeee;
}
input:focus:invalid {
  color: #b94a48;
  border-color: #ee5f5b;
}
input:focus:invalid:focus {
  border-color: #e9322d;
  -webkit-box-shadow: 0 0 6px #f8b9b7;
  -moz-box-shadow: 0 0 6px #f8b9b7;
  box-shadow: 0 0 6px #f8b9b7;
}

/* Bootstrap alert CSS rules that have not been replaced with our own
   designs. */

.alert {
  padding: 8px 35px 8px 14px;
  margin-bottom: 20px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  background-color: #fcf8e3;
  border: 1px solid #fbeed5;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
.alert.alert-error {
  background-color: #f2dede;
  border-color: #eed3d7;
  color: #b94a48;
}
.alert.alert-success {
  background-color: #dff0d8;
  border-color: #d6e9c6;
  color: #468847;
}
.alert.alert-success h4 {
  color: #468847;
}
.alert,
.alert h4 {
  color: #c09853;
}
.alert h4 {
  margin: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: bootstrap.portico.css]---
Location: zulip-main/web/third/bootstrap/css/bootstrap.portico.css

```text
/*!
 * Bootstrap v2.3.2
 *
 * Copyright 2012 Twitter, Inc
 * Licensed under the Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Designed and built with all the love in the world @twitter by @mdo and @fat.
 */
footer,
header,
nav,
section {
  display: block;
}
html {
  font-size: 100%;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}
a:focus {
  outline: thin dotted #333;
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px;
}
a:hover,
a:active {
  outline: 0;
}
img {
  /* Responsive images (ensure images don't scale beyond their parents) */

  max-width: 100%;
  /* Part 1: Set a maximum relative to the parent */

  height: auto;
  /* Part 2: Scale the height according to the width, otherwise you get stretching */

  vertical-align: middle;
  border: 0;
}
button,
input {
  margin: 0;
  font-size: 100%;
  vertical-align: middle;
}
button,
input {
  line-height: normal;
}
button::-moz-focus-inner,
input::-moz-focus-inner {
  padding: 0;
  border: 0;
}
button {
  -webkit-appearance: button;
  cursor: pointer;
}
label,
button {
  cursor: pointer;
}
body {
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #333333;
  background-color: #ffffff;
}
a {
  color: #0088cc;
  text-decoration: none;
}
a:hover,
a:focus {
  color: #005580;
  text-decoration: underline;
}
p {
  margin: 0 0 10px;
}
.lead {
  margin-bottom: 20px;
  font-size: 21px;
  font-weight: 200;
  line-height: 30px;
}
.text-error {
  color: #b94a48;
}
a.text-error:hover,
a.text-error:focus {
  color: #953b39;
}
.text-success {
  color: #468847;
}
a.text-success:hover,
a.text-success:focus {
  color: #356635;
}
h1,
h2,
h3,
h4 {
  margin: 10px 0;
  font-family: inherit;
  font-weight: bold;
  line-height: 20px;
  color: inherit;
  text-rendering: optimizelegibility;
}
h1,
h2,
h3 {
  line-height: 40px;
}
h1 {
  font-size: 38.5px;
}
h2 {
  font-size: 31.5px;
}
h3 {
  font-size: 24.5px;
}
h4 {
  font-size: 17.5px;
}
ul,
ol {
  padding: 0;
  margin: 0 0 10px 25px;
}
ul ul,
ul ol,
ol ol,
ol ul {
  margin-bottom: 0;
}
li {
  line-height: 20px;
}
hr {
  margin: 20px 0;
  border: 0;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #ffffff;
}
q:before,
q:after {
  content: "";
}
pre {
  padding: 0 3px 2px;
  font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
  font-size: 12px;
  color: #333333;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
pre {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 20px;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre;
  white-space: pre-wrap;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border: 1px solid rgba(0, 0, 0, 0.15);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
form {
  margin: 0 0 20px;
}
label,
input,
button {
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
}
input,
button {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
label {
  display: block;
  margin-bottom: 5px;
}
input:-moz-placeholder {
  color: #999999;
}
input:-ms-input-placeholder {
  color: #999999;
}
input::-webkit-input-placeholder {
  color: #999999;
}
input {
  margin-left: 0;
}
input[disabled],
input[readonly] {
  cursor: not-allowed;
  background-color: #eeeeee;
}
input:focus:invalid {
  color: #b94a48;
  border-color: #ee5f5b;
}
input:focus:invalid:focus {
  border-color: #e9322d;
  -webkit-box-shadow: 0 0 6px #f8b9b7;
  -moz-box-shadow: 0 0 6px #f8b9b7;
  box-shadow: 0 0 6px #f8b9b7;
}
.help-inline {
  color: #595959;
}
.help-inline {
  display: inline-block;
  vertical-align: middle;
  padding-left: 5px;
}
.form-inline input,
.form-inline .help-inline {
  display: inline-block;
  margin-bottom: 0;
  vertical-align: middle;
}
.form-inline .hide {
  display: none;
}
.form-inline label {
  display: inline-block;
}
.dropdown {
  position: relative;
}
.hide {
  display: none;
}
.show {
  display: block;
}
@-ms-viewport {
  width: device-width;
}
.hidden {
  display: none;
  visibility: hidden;
}
@media (max-width: 767px) {
  body {
    padding-left: 20px;
    padding-right: 20px;
  }
  .row {
    margin-left: 0;
  }
}
@media (min-width: 768px) and (max-width: 979px) {
  .row {
    margin-left: -20px;
  }
  .row:before,
  .row:after {
    display: table;
    content: "";
    line-height: 0;
  }
  .row:after {
    clear: both;
  }
  input {
    margin-left: 0;
  }
}
@media (min-width: 1180px) {
  .row {
    margin-left: -30px;
  }
  .row:before,
  .row:after {
    display: table;
    content: "";
    line-height: 0;
  }
  .row:after {
    clear: both;
  }
  input {
    margin-left: 0;
  }
}
@media (max-width: 979px) {
  body {
    padding-top: 0;
  }
}

/* Bootstrap alert CSS rules that have not been replaced with our own
   designs. */

.alert {
  padding: 8px 35px 8px 14px;
  margin-bottom: 20px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  background-color: #fcf8e3;
  border: 1px solid #fbeed5;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
.alert,
.alert h4 {
  color: #c09853;
}
.alert h4 {
  margin: 0;
}
.alert-success {
  background-color: #dff0d8;
  border-color: #d6e9c6;
  color: #468847;
}
.alert-success h4 {
  color: #468847;
}
.alert-danger,
.alert-error {
  background-color: #f2dede;
  border-color: #eed3d7;
  color: #b94a48;
}
.alert-danger h4,
.alert-error h4 {
  color: #b94a48;
}
.alert-info {
  background-color: #d9edf7;
  border-color: #bce8f1;
  color: #3a87ad;
}
.alert-info h4 {
  color: #3a87ad;
}
```

--------------------------------------------------------------------------------

---[FILE: jquery.idle.js]---
Location: zulip-main/web/third/jquery-idle/jquery.idle.js

```javascript
/**
 *  Modified by Zulip, Inc.
 */

/** @preserve
 Software from "jQuery Idle", a jQuery plugin that executes a callback function
 if the user is idle, is Copyright (c) 2011-2013 Henrique Boaventura and is
 provided under the following license (the jQuery Idle software has been modified):
 --
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 --
*/

/**
 *  File: jquery.idle.js
 *  Title:  JQuery Idle.
 *  A dead simple jQuery plugin that executes a callback function if the user is idle.
 *  About: Author
 *  Henrique Boaventura (hboaventura@gmail.com).
 *  About: Version
 *  1.0.0
 *  About: License
 *  Copyright (C) 2012, Henrique Boaventura (hboaventura@gmail.com).
 *  MIT License:
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *  - The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *  - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

(function( $ ){
  $.fn.idle = function(options) {

    var defaults = {
      idle: 60000, //idle time in ms
      events: 'mousemove keydown DOMMouseScroll mousedown touchstart touchmove wheel', //events that will trigger the idle resetter
      onIdle: function(){}, //callback function to be executed after idle time
      onActive: function(){}, //callback function to be executed after back from idleness
      keepTracking: false //if you want to keep tracking user even after the first time, set this to true
    };

    var idle = false;

    var settings = $.extend( {}, defaults, options );
    var timerId;
    var elem = $(this);

    // We need this variable so that if the timer is canceled during
    // an event handler we're also listening to.  Otherwise, our
    // handler for that event might run even though we're supposed to
    // be canceled
    var canceled = false;

    var handler = function(e){
        if (canceled) {
            return;
        }
        if(idle){
            settings.onActive.call();
            idle = false;
        }

        resetTimeout();
    };

    var cancel = function() {
      elem.off(settings.events, handler);
      clearTimeout(timerId);
      canceled = true;
    }

    var resetTimeout = function() {
      idle = false;
      clearTimeout(timerId);
      createTimeout();
    }

    var createTimeout = function() {
      timerId = setTimeout(function(){
        idle = true;
        cancel();
        settings.onIdle.call();
        if(settings.keepTracking) {
            // We want the reset to occur after this event has been
            // completely handled
            setTimeout(function () {
                elem.on(settings.events, handler);
                canceled = false;
                createTimeout(settings);
            }, 0);
        }
      }, settings.idle);
      control.timerId = timerId;
    }

    var control = {
        'cancel': cancel,
        'reset': resetTimeout,
    };

    createTimeout(settings);
    elem.on(settings.events, handler);

    return control;
  };
})( jQuery );
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: zulip-main/web/third/marked/LICENSE

```text
Copyright (c) 2011-2014, Christopher Jeffrey (https://github.com/chjj/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

--------------------------------------------------------------------------------

````
