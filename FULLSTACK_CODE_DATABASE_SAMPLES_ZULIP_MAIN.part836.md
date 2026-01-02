---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 836
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 836 of 1290)

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

---[FILE: mdiff.cjs]---
Location: zulip-main/web/tests/lib/mdiff.cjs

```text
"use strict";

/**
 * mdiff.js
 *
 * Used to produce colorful and informative diffs for comparison of generated
 * Markdown.  Unlike the built-in diffs used in python or node.js assert libraries,
 * is actually designed to be effective for long, single-line comparisons.
 *
 * Based on diffing library difflib, a js port of the python library.
 *
 * The sole exported function diff_strings(string_0, string_1) returns a pretty-printed
 * Unicode string containing their diff.
 */

const difflib = require("difflib");

function apply_color(input_string, changes) {
    let previous_index = 0;
    let processed_string = input_string.slice(0, 2);
    input_string = input_string.slice(2);

    const formatter = new Map([
        ["delete", (string) => "\u001B[31m" + string + "\u001B[0m"],
        ["insert", (string) => "\u001B[32m" + string + "\u001B[0m"],
        ["replace", (string) => "\u001B[33m" + string + "\u001B[0m"],
    ]);
    for (const change of changes) {
        if (formatter.has(change.tag)) {
            processed_string += input_string.slice(previous_index, change.beginning_index);
            processed_string += formatter.get(change.tag)(
                input_string.slice(change.beginning_index, change.ending_index),
            );
            previous_index = change.ending_index;
        }
    }

    processed_string += input_string.slice(previous_index);
    return processed_string;
}

/**
 * The library difflib produces diffs that look as follows:
 *
 * - <p>upgrade! yes</p>
 * ?    ^^     -
 * + <p>downgrade yes.</p>
 * ?    ^^^^         +
 *
 * The purpose of this function is to facilitate converting these diffs into
 * colored versions, where the question-mark lines are removed, replaced with
 * directions to add appropriate color to the lines that they annotate.
 */
function parse_questionmark_line(questionmark_line) {
    let current_sequence = ""; // Either "^", "-", "+", or ""
    let beginning_index = 0;
    let index = 0;

    const changes_list = [];
    const aliases = new Map([
        ["^", "replace"],
        ["+", "insert"],
        ["-", "delete"],
    ]);
    const add_change = () => {
        if (current_sequence) {
            changes_list.push({
                tag: aliases.get(current_sequence),
                beginning_index,
                ending_index: index,
            });
            current_sequence = "";
        }
    };

    questionmark_line = questionmark_line.slice(2).trimRight("\n");

    for (const character of questionmark_line) {
        if (aliases.has(character)) {
            if (current_sequence !== character) {
                add_change();
                current_sequence = character;
                beginning_index = index;
            }
        } else {
            add_change();
        }
        index += 1;
    }

    // In case we have a "change" involving the last character on a line
    // e.g. a string such as "? ^^  -- ++++"
    add_change();

    return changes_list;
}

function diff_strings(string_0, string_1) {
    let output_lines = [];
    let ndiff_output = "";
    let changes_list = [];

    ndiff_output = difflib.ndiff(string_0.split("\n"), string_1.split("\n"));

    for (const line of ndiff_output) {
        if (line.startsWith("+")) {
            output_lines.push(line);
        } else if (line.startsWith("-")) {
            output_lines.push(line);
        } else if (line.startsWith("?")) {
            changes_list = parse_questionmark_line(line);
            output_lines.push(apply_color(output_lines.pop(), changes_list));
        } else {
            output_lines.push(line);
        }
    }

    output_lines = output_lines.map(
        (string) => "\u001B[34m" + string.slice(0, 1) + "\u001B[0m" + string.slice(1),
    );

    return output_lines.join("\n");
}

module.exports = {diff_strings};

// Simple CLI for this module
// Only run this code if called as a command-line utility
if (require.main === module) {
    const {parseArgs} = require("node:util");

    const usage =
        "Usage: mdiff <string_0> <string_1>\nWhere <string_0> and <string_1> are the strings to be diffed";
    const {
        values: {help},
        positionals: [string_0, string_1],
    } = parseArgs({options: {help: {type: "boolean"}}, allowPositionals: true});

    if (help) {
        console.log(usage);
        process.exit(0);
    }
    if (string_1 === undefined) {
        console.error(usage);
        process.exit(1);
    }

    const output = diff_strings(string_0, string_1);
    console.log(output);
}
```

--------------------------------------------------------------------------------

---[FILE: message_list.cjs]---
Location: zulip-main/web/tests/lib/message_list.cjs

```text
"use strict";

const {zrequire} = require("./namespace.cjs");

const {Filter} = zrequire("filter");
const {MessageList} = zrequire("message_list");
const {MessageListData} = zrequire("message_list_data");

exports.make_message_list = (filter_terms, opts = {}) => {
    const filter = new Filter(filter_terms);
    const default_message_list = new MessageList({
        data: new MessageListData({
            filter,
        }),
        is_node_test: true,
    });
    default_message_list.data.participants.humans = new Set(opts.visible_participants);
    return default_message_list;
};
```

--------------------------------------------------------------------------------

---[FILE: namespace.cjs]---
Location: zulip-main/web/tests/lib/namespace.cjs

```text
"use strict";

const assert = require("node:assert/strict");
const Module = require("node:module");
const path = require("node:path");

const {default: callsites} = require("callsites");

const $ = require("./zjquery.cjs");

const new_globals = new Set();
let old_globals = {};

let actual_load;
const module_mocks = new Map();
const template_mocks = new Map();
const used_module_mocks = new Set();
const used_templates = new Set();

const jquery_path = require.resolve("jquery");
const real_jquery_path = require.resolve("./real_jquery.cjs");

let in_mid_render = false;
let jquery_function;

const template_path = path.resolve(__dirname, "../../templates");

function load(request, parent, isMain) {
    const filename = Module._resolveFilename(request, parent, isMain);
    if (module_mocks.has(filename)) {
        used_module_mocks.add(filename);
        return module_mocks.get(filename);
    } else if (filename.endsWith(".hbs") && filename.startsWith(template_path + path.sep)) {
        const actual_render = actual_load(request, parent, isMain);
        return template_stub({filename, actual_render});
    } else if (filename === jquery_path && parent.filename !== real_jquery_path) {
        return jquery_function || $;
    }

    const module = actual_load(request, parent, isMain);
    if ((typeof module === "object" || typeof module === "function") && "__esModule" in module) {
        /* istanbul ignore next */
        function error_immutable() {
            throw new Error(`${filename} is an immutable ES module`);
        }
        return new Proxy(module, {
            defineProperty: error_immutable,
            deleteProperty: error_immutable,
            preventExtensions: error_immutable,
            set: error_immutable,
            setPrototypeOf: error_immutable,
        });
    }

    return module;
}

function template_stub({filename, actual_render}) {
    return function render(...args) {
        // If our template was not mocked or is being rendered as a
        // partial, use the actual implementation.
        if (!template_mocks.has(filename) || in_mid_render) {
            return actual_render(...args);
        }

        used_templates.add(filename);

        const {exercise_template, f} = template_mocks.get(filename);

        const data = args[0];

        if (exercise_template) {
            // If our dev wants to exercise the actual template, then do so.
            // We set the in_mid_render bool so that included (i.e. partial)
            // templates get rendered.
            in_mid_render = true;
            const html = actual_render(...args);
            in_mid_render = false;

            return f(data, html);
        }

        return f(data);
    };
}

exports.start = () => {
    assert.equal(actual_load, undefined, "namespace.start was called twice in a row.");
    actual_load = Module._load;
    Module._load = load;
};

// We provide `mock_cjs` for mocking a CommonJS module, and `mock_esm` for
// mocking an ES6 module.
//
// A CommonJS module:
// - loads other modules using `require()`,
// - assigns its public contents to the `exports` object or `module.exports`,
// - consists of a single JavaScript value, typically an object or function,
// - when imported by an ES6 module:
//   * is shallow-copied to a collection of immutable bindings, if it's an
//     object,
//   * is converted to a single default binding, if not.
//
// An ES6 module:
// - loads other modules using `import`,
// - declares its public contents using `export` statements,
// - consists of a collection of live bindings that may be mutated from inside
//   but not outside the module,
// - may have a default binding (that's just syntactic sugar for a binding
//   named `default`),
// - when required by a CommonJS module, always appears as an object.
//
// Most of our own modules are ES6 modules.
//
// For a third party module available in both formats that might present two
// incompatible APIs (especially if the CommonJS module is a function),
// Webpack will prefer the ES6 module if its availability is indicated by the
// "module" field of package.json, while Node.js will not; we need to mock the
// format preferred by Webpack.

exports.mock_cjs = (module_path, obj, {callsite = callsites()[1]} = {}) => {
    assert.notEqual(
        module_path,
        "jquery",
        "We automatically mock jquery to zjquery. Grep for mock_jquery if you want more control.",
    );

    const filename = Module._resolveFilename(
        module_path,
        require.cache[callsite.getFileName()],
        false,
    );

    assert.ok(!module_mocks.has(filename), `You already set up a mock for ${filename}`);

    assert.ok(
        !(filename in require.cache),
        `It is too late to mock ${filename}; call this earlier.`,
    );

    module_mocks.set(filename, obj);
    return obj;
};

exports.mock_jquery = ($) => {
    jquery_function = $; // eslint-disable-line no-jquery/variable-pattern
    return $;
};

exports._start_template_mocking = () => {
    template_mocks.clear();
    used_templates.clear();
};

exports._finish_template_mocking = () => {
    for (const filename of template_mocks.keys()) {
        assert.ok(
            used_templates.has(filename),
            `You called mock_template with ${filename} but we never saw it get used.`,
        );
    }
    template_mocks.clear();
    used_templates.clear();
};

exports._mock_template = (fn, exercise_template, f) => {
    template_mocks.set(path.join(template_path, fn), {exercise_template, f});
};

exports.mock_esm = (module_path, obj = {}, {callsite = callsites()[1]} = {}) => {
    assert.equal(typeof obj, "object", "An ES module must be mocked with an object");
    return exports.mock_cjs(module_path, {...obj, __esModule: true}, {callsite});
};

exports.unmock_module = (module_path, {callsite = callsites()[1]} = {}) => {
    const filename = Module._resolveFilename(
        module_path,
        require.cache[callsite.getFileName()],
        false,
    );

    assert.ok(module_mocks.has(filename), `Cannot unmock ${filename}, which was not mocked`);

    assert.ok(
        used_module_mocks.has(filename),
        `You asked to mock ${filename} but we never saw it during compilation.`,
    );

    module_mocks.delete(filename);
    used_module_mocks.delete(filename);
};

exports.set_global = function (name, val) {
    assert.notEqual(val, null, `We try to avoid using null in our codebase.`);

    if (!(name in old_globals)) {
        if (!(name in global)) {
            new_globals.add(name);
        }
        old_globals[name] = global[name];
    }
    global[name] = val;
    return val;
};

exports.zrequire = function (short_fn) {
    assert.notEqual(
        short_fn,
        "templates",
        `
            There is no need to zrequire templates.ts.

            The test runner automatically registers the
            Handlebars extensions.
        `,
    );

    return require(`../../src/${short_fn}`);
};

const webPath = path.resolve(__dirname, "../..") + path.sep;
const testsLibPath = __dirname + path.sep;

exports.complain_about_unused_mocks = function () {
    for (const filename of module_mocks.keys()) {
        /* istanbul ignore if */
        if (!used_module_mocks.has(filename)) {
            console.error(`You asked to mock ${filename} but we never saw it during compilation.`);
        }
    }
};

exports.finish = function () {
    /*
        Handle cleanup tasks after we've run one module.

        Note that we currently do lazy compilation of modules,
        so we need to wait till the module tests finish
        running to do things like detecting pointless mocks
        and resetting our _load hook.
    */
    jquery_function = undefined;

    assert.notEqual(actual_load, undefined, "namespace.finish was called without namespace.start.");
    Module._load = actual_load;
    actual_load = undefined;

    module_mocks.clear();
    used_module_mocks.clear();

    for (const path of Object.keys(require.cache)) {
        if (path.startsWith(webPath) && !path.startsWith(testsLibPath)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete require.cache[path];
        }
    }
    Object.assign(global, old_globals);
    old_globals = {};
    for (const name of new_globals) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete global[name];
    }
    new_globals.clear();
};

exports.with_overrides = function (test_function) {
    // This function calls test_function() and passes in
    // a way to override the namespace temporarily.

    const restore_callbacks = [];
    let ok = false;

    const override = function (obj, prop, value, {unused = true} = {}) {
        // Given an object `obj` (which is usually a module object),
        // we re-map `obj[prop]` to the `value` passed in by the caller.
        // Then the outer function here (`with_overrides`) automatically
        // restores the original value of `obj[prop]` as its last
        // step.  Generally our code calls `run_test`, which wraps
        // `with_overrides`.

        assert.ok(
            typeof obj === "object" || typeof obj === "function",
            `We cannot override a function for ${typeof obj} objects`,
        );

        const had_value = Object.hasOwn(obj, prop);
        const old_value = obj[prop];
        let new_value = value;

        if (typeof value === "function") {
            assert.ok(
                old_value === undefined || typeof old_value === "function",
                `
                    You are overriding a non-function with a function.
                    This is almost certainly an error.
                `,
            );

            new_value = function (...args) {
                unused = false;
                return value.apply(this, args);
            };

            // Let zjquery know this function was patched with override,
            // so it doesn't complain about us modifying it.  (Other
            // code can also use this, as needed.)
            new_value._patched_with_override = true;
        } else {
            unused = false;
        }

        obj[prop] = new_value;
        restore_callbacks.push(() => {
            if (ok) {
                assert.ok(!unused, `${prop} never got invoked!`);
            }
            if (had_value) {
                obj[prop] = old_value;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete obj[prop];
            }
        });
    };

    const disallow = function (obj, prop) {
        override(
            obj,
            prop,
            // istanbul ignore next
            () => {
                throw new Error(`unexpected call to ${prop}`);
            },
            {unused: false},
        );
    };

    const override_rewire = function (obj, prop, value, {unused = true} = {}) {
        assert.ok(
            typeof obj === "object" || typeof obj === "function",
            `We cannot override a function for ${typeof obj} objects`,
        );

        assert.ok(Object.hasOwn(obj, prop));
        const old_value = obj[prop];
        let new_value = value;

        if (typeof value === "function") {
            assert.ok(
                typeof old_value === "function",
                `
                    You are overriding a non-function with a function.
                    This is almost certainly an error.
                `,
            );

            new_value = function (...args) {
                unused = false;
                return value.apply(this, args);
            };
        } else {
            unused = false;
        }

        const rewire_prop = `rewire_${prop}`;
        /* istanbul ignore if */
        if (!(rewire_prop in obj)) {
            assert.fail(`You must define ${rewire_prop} to use override_rewire on ${prop}.`);
        }
        obj[rewire_prop](new_value);
        restore_callbacks.push(() => {
            if (ok) {
                assert.ok(!unused, `${prop} never got invoked!`);
            }
            obj[rewire_prop](old_value);
        });
    };

    const disallow_rewire = function (obj, prop) {
        override_rewire(
            obj,
            prop,
            // istanbul ignore next
            () => {
                throw new Error(`unexpected call to ${prop}`);
            },
            {unused: false},
        );
    };

    let ret;
    let is_promise = false;
    try {
        ret = test_function({override, override_rewire, disallow, disallow_rewire});
        is_promise = typeof ret?.then === "function";
        ok = !is_promise;
    } finally {
        if (!is_promise) {
            restore_callbacks.reverse();
            for (const restore_callback of restore_callbacks) {
                restore_callback();
            }
        }
    }

    if (!is_promise) {
        return ret;
    }

    return (async () => {
        try {
            ret = await ret;
            ok = true;
            return ret;
        } finally {
            restore_callbacks.reverse();
            for (const restore_callback of restore_callbacks) {
                restore_callback();
            }
        }
    })();
};
```

--------------------------------------------------------------------------------

---[FILE: real_jquery.cjs]---
Location: zulip-main/web/tests/lib/real_jquery.cjs

```text
"use strict";

const jquery = require("jquery");

// so the tests can mock jQuery
// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
delete require.cache[require.resolve("jquery")];

module.exports = jquery;
```

--------------------------------------------------------------------------------

---[FILE: stub.cjs]---
Location: zulip-main/web/tests/lib/stub.cjs

```text
"use strict";

const assert = require("node:assert/strict");

// Stubs don't do any magical modifications to your namespace.  They
// just provide you a function that records what arguments get passed
// to it.  To use stubs as something more like "spies," use something
// like set_global() to override your namespace.

exports.make_stub = function () {
    const self = {num_calls: 0};

    self.f = function (...args) {
        self.last_call_args = args;
        self.num_calls += 1;
        return true;
    };

    self.get_args = function (...param_names) {
        const result = {};

        for (const [i, name] of param_names.entries()) {
            result[name] = self.last_call_args[i];
        }

        return result;
    };

    return self;
};

(function test_ourselves() {
    const stub = exports.make_stub();
    stub.f("blue", 42);
    assert.equal(stub.num_calls, 1);
    const args = stub.get_args("color", "n");
    assert.equal(args.color, "blue");
    assert.equal(args.n, 42);
})();
```

--------------------------------------------------------------------------------

---[FILE: test.cjs]---
Location: zulip-main/web/tests/lib/test.cjs

```text
"use strict";

const namespace = require("./namespace.cjs");
const zblueslip = require("./zblueslip.cjs");
const $ = require("./zjquery.cjs");
const zpage_billing_params = require("./zpage_billing_params.cjs");
const zpage_params = require("./zpage_params.cjs");

let current_file_name;
let verbose = false;

exports.set_current_file_name = (value) => {
    current_file_name = value;
};

exports.set_verbose = (value) => {
    verbose = value;
};

exports.noop = () => {};

exports.suite = [];

async function execute_test(label, f) {
    /* istanbul ignore if */
    if (verbose) {
        console.info("        test: " + label);
    }

    $.clear_all_elements();
    zpage_billing_params.reset();
    zpage_params.reset();

    try {
        namespace._start_template_mocking();
        await namespace.with_overrides(async (helpers) => {
            await f({
                ...helpers,
                mock_template: namespace._mock_template,
            });
        });
        namespace._finish_template_mocking();
    } catch (error) /* istanbul ignore next */ {
        console.info("-".repeat(50));
        console.info(`test failed: ${current_file_name} > ${label}`);
        console.info();
        throw error;
    }
    // defensively reset blueslip after each test.
    zblueslip.reset();
}

exports.run_test = (label, f, opts) => {
    exports.suite.push(() => execute_test(label, f, opts));
};
```

--------------------------------------------------------------------------------

---[FILE: zblueslip.cjs]---
Location: zulip-main/web/tests/lib/zblueslip.cjs

```text
"use strict";

const assert = require("node:assert/strict");

function make_zblueslip() {
    const lib = {};

    const opts = {
        // Silently swallow all debug, log and info calls.
        debug: false,
        log: false,
        info: false,
        // Check against expected error values for the following.
        warn: true,
        error: true,
    };
    const names = Object.keys(opts);

    // For fatal messages, we should use assert.throws
    /* istanbul ignore next */
    lib.fatal = (msg) => {
        throw new Error(msg);
    };

    // Store valid test data for options.
    lib.test_data = {};
    lib.test_logs = {};

    for (const name of names) {
        lib.test_data[name] = [];
        lib.test_logs[name] = [];
    }

    lib.expect = (name, message, expected_count = 1) => {
        assert.notEqual(opts[name], undefined, `unexpected arg for expect: ${name}`);
        assert.ok(
            expected_count > 0 && Number.isInteger(expected_count),
            "expected count should be a positive integer",
        );
        const obj = {message, count: 0, expected_count};
        lib.test_data[name].push(obj);
    };

    const check_seen_messages = () => {
        for (const name of names) {
            for (const obj of lib.test_logs[name]) {
                const message = obj.message;
                const i = lib.test_data[name].findIndex((x) => x.message === message);
                if (i === -1) {
                    // Only throw this for message types we want to explicitly track.
                    // For example, we do not want to throw here for debug messages.
                    if (opts[name]) {
                        throw new Error(`Unexpected '${name}' message: ${message}`);
                    }
                    continue;
                }
                lib.test_data[name][i].count += 1;
            }

            for (const obj of lib.test_data[name]) {
                const message = obj.message;
                assert.equal(
                    obj.count,
                    obj.expected_count,
                    `Expected ${obj.expected_count} of '${name}': ${message}`,
                );
            }
        }
    };

    lib.reset = (skip_checks = false) => {
        if (!skip_checks) {
            check_seen_messages();
        }

        for (const name of names) {
            lib.test_data[name] = [];
            lib.test_logs[name] = [];
        }
    };

    lib.get_test_logs = (name) => lib.test_logs[name];

    // Create logging functions
    for (const name of names) {
        if (!opts[name]) {
            // should just log the message.
            lib[name] = function (message, more_info, cause) {
                lib.test_logs[name].push({message, more_info, cause});
            };
            continue;
        }
        lib[name] = function (message, more_info, cause) {
            /* istanbul ignore if */
            if (typeof message !== "string") {
                // We may catch exceptions in blueslip, and if
                // so our stub should include that.
                if (message.toString().includes("exception")) {
                    message = message.toString();
                } else {
                    throw new Error("message should be string: " + message);
                }
            }
            lib.test_logs[name].push({message, more_info, cause});
            const matched_error_message = lib.test_data[name].find((x) => x.message === message);
            const exact_match_fail = !matched_error_message;
            if (exact_match_fail) {
                const error = new Error(`Invalid ${name} message: "${message}".`);
                error.blueslip = true;
                /* istanbul ignore if */
                if (cause !== undefined) {
                    error.cause = cause;
                }
                throw error;
            }
        };
    }

    return lib;
}

module.exports = make_zblueslip();
```

--------------------------------------------------------------------------------

---[FILE: zjquery.cjs]---
Location: zulip-main/web/tests/lib/zjquery.cjs

```text
"use strict";

const assert = require("node:assert/strict");

/*
    When using zjquery, the first call to $("#foo")
    returns a new instance of the FakeElement pseudoclass,
    and then subsequent calls to $("#foo") get the
    same instance.
*/
const FakeElement = require("./zjquery_element.cjs");
const FakeEvent = require("./zjquery_event.cjs");

function verify_selector_for_zulip(selector) {
    const is_valid =
        "<#.".includes(selector[0]) ||
        selector === "window-stub" ||
        selector === "document-stub" ||
        selector === "body" ||
        selector === "html" ||
        selector === ":root" ||
        selector.location ||
        selector.includes("#") ||
        selector.includes(".") ||
        (selector.includes("[") && selector.indexOf("]") >= selector.indexOf("["));

    assert.ok(
        is_valid,
        // Check if selector has only english alphabets and space.
        // Then, the user is probably trying to use a tag as a selector
        // like $('div a').
        /^[ A-Za-z]+$/.test(selector)
            ? "Selector too broad! Use id, class or attributes of target instead."
            : `Invalid selector: ${selector}. Use $.create() maybe?`,
    );
}

function make_zjquery() {
    const elems = new Map();

    // Our fn structure helps us simulate extending jQuery.
    // Use this with extreme caution.
    const fn = {};

    function new_elem(selector, create_opts) {
        const $elem = FakeElement(selector, {...create_opts});
        Object.assign($elem, fn);

        // Create a proxy handler to detect missing stubs.
        //
        // For context, zjquery doesn't implement every method/attribute
        // that you'd find on a "real" jQuery object.  Sometimes we
        // expects devs to create their own stubs.
        const handler = {
            get(target, key) {
                // Handle the special case of equality checks, which
                // we can infer by assert.equal trying to access the
                // "stack" key.
                assert.notEqual(
                    key,
                    "stack",
                    "\nInstead of doing equality checks on a full object, " +
                        'do `assert.equal($foo.selector, ".some_class")\n',
                );

                const val = target[key];

                /* istanbul ignore if */
                if (val === undefined && typeof key !== "symbol" && key !== "inspect") {
                    // For undefined values, we'll throw errors to devs saying
                    // they need to create stubs.  We ignore certain keys that
                    // are used for simply printing out the object.
                    throw new Error('You must create a stub for $("' + selector + '").' + key);
                }

                return val;
            },
        };

        const proxy = new Proxy($elem, handler);

        return proxy;
    }

    const zjquery = function (arg, arg2) {
        assert.ok(typeof arg !== "function", "zjquery does not support $(callback)");

        // If somebody is passing us an element, we return
        // the element itself if it's been created with
        // zjquery.
        // This may happen in cases like $(this).
        if (arg.selector && elems.has(arg.selector)) {
            return arg;
        }

        // We occasionally create stub objects that know
        // they want to be wrapped by jQuery (so they can
        // in turn return stubs).  The convention is that
        // they provide a to_$ attribute.
        if (arg.to_$) {
            assert.equal(typeof arg.to_$, "function");
            return arg.to_$();
        }

        assert.equal(
            arg2,
            undefined,
            "We only use one-argument variations of $(...) in Zulip code.",
        );

        const selector = arg;

        /* istanbul ignore if */
        if (typeof selector !== "string") {
            console.info(arg);
            throw new Error("zjquery does not know how to wrap this object yet");
        }

        verify_selector_for_zulip(selector);

        if (!elems.has(selector)) {
            const $elem = new_elem(selector);
            elems.set(selector, $elem);
        }
        return elems.get(selector);
    };

    zjquery.create = function (name, opts) {
        assert.ok(!elems.has(name), "You already created an object with this name!!");
        const $elem = new_elem(name, opts);
        elems.set(name, $elem);

        return $elem;
    };

    /* istanbul ignore next */
    zjquery.state = function () {
        // useful for debugging
        let res = [...elems.values()].map(($v) => $v.debug());

        res = res.map((v) => [v.selector, v.value, v.shown]);

        res.sort();

        return res;
    };

    zjquery.Event = FakeEvent;

    /* istanbul ignore next */
    fn.popover = () => {
        throw new Error(`
            Do not try to test $.fn.popover code unless
            you really know what you are doing.
        `);
    };

    zjquery.fn = new Proxy(fn, {
        set(_obj, _prop, _value) {
            /* istanbul ignore next */
            throw new Error(`
                Please don't use node tests to test code
                that extends $.fn unless you really know
                what you are doing.

                It's likely that you are better off testing
                end-to-end behavior with puppeteer tests.

                If you are trying to get coverage on a module
                that extends $.fn, and you just want to skip
                over that aspect of the module for the purpose
                of testing, see if you can wrap the code
                that extends $.fn and use override() to
                replace the wrapper with tests.lib.noop.
            `);
        },
    });

    zjquery.clear_all_elements = function () {
        elems.clear();
    };

    zjquery.validator = {
        /* istanbul ignore next */
        addMethod() {
            throw new Error("You must create your own $.validator.addMethod stub.");
        },
    };

    return zjquery;
}

const $ = new Proxy(make_zjquery(), {
    set(obj, prop, value) {
        if (obj[prop] && obj[prop]._patched_with_override) {
            obj[prop] = value;
            return true;
        }

        if (value._patched_with_override) {
            obj[prop] = value;
            return true;
        }

        /* istanbul ignore next */
        throw new Error(`
            Please don't modify $.${prop} if you are using zjquery.

            You can do this instead:

                override($, "${prop}", () => {...});

            Or you can do this if you don't actually
            need zjquery and just want to simulate one function.

                mock_cjs("jquery", {
                    ${prop}(...) {...},
                });

            It's also possible that you are testing code with
            node tests when it would be a better strategy to
            use puppeteer tests.
        `);
    },
});

module.exports = $; // eslint-disable-line no-jquery/variable-pattern
```

--------------------------------------------------------------------------------

````
