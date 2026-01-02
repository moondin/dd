---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 566
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 566 of 1290)

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

---[FILE: test_pretty_print.py]---
Location: zulip-main/tools/tests/test_pretty_print.py
Signals: Django

```python
import unittest

from tools.lib.pretty_print import pretty_print_html
from tools.lib.template_parser import validate

# Note that GOOD_HTML isn't necessarily beautiful HTML.  Apart
# from adjusting indentation, we mostly leave things alone to
# respect whatever line-wrapping styles were in place before.

BAD_HTML = """
<!-- test -->
<!DOCTYPE html>

<html>
    <!-- test -->
    <head>
        <title>Test</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="style.css" />
    </head>
    <body>
        <div><p>Hello<br />world!</p></div>
            <p>Goodbye<!-- test -->world!</p>
            <table>
                <tr>
                        <td>5</td>
                </tr>
            </table>
    <pre>
            print 'hello world'
    </pre>
            <div class = "foo"
              id = "bar"
              role = "whatever">{{ bla }}
            </div>
    </body>
</html>
<!-- test -->
"""

GOOD_HTML = """
<!-- test -->
<!DOCTYPE html>

<html>
    <!-- test -->
    <head>
        <title>Test</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="style.css" />
    </head>
    <body>
        <div><p>Hello<br />world!</p></div>
        <p>Goodbye<!-- test -->world!</p>
        <table>
            <tr>
                <td>5</td>
            </tr>
        </table>
    <pre>
            print 'hello world'
    </pre>
        <div class = "foo"
          id = "bar"
          role = "whatever">{{ bla }}
        </div>
    </body>
</html>
<!-- test -->
"""

BAD_HTML1 = """
<html>
        <body>
            foobarfoobarfoo<b>bar</b>
        </body>
</html>
"""

GOOD_HTML1 = """
<html>
    <body>
        foobarfoobarfoo<b>bar</b>
    </body>
</html>
"""

BAD_HTML2 = """
<html>
        <body>
    {{# foobar area}}
    foobarfoobarfoo<b>bar</b>
    {{/ foobar}}
        </body>
</html>
"""

GOOD_HTML2 = """
<html>
    <body>
        {{# foobar area}}
        foobarfoobarfoo<b>bar</b>
        {{/ foobar}}
    </body>
</html>
"""

# The old GOOD_HTML3 test was flawed.

BAD_HTML4 = """
<div>
        foo
        <p>hello</p>
        bar
</div>
"""

GOOD_HTML4 = """
<div>
    foo
    <p>hello</p>
    bar
</div>
"""

BAD_HTML5 = """
<div>
        foo
        {{#if foobar}}
        hello
        {{else}}
        bye
        {{/if}}
        bar
</div>
"""

GOOD_HTML5 = """
<div>
    foo
    {{#if foobar}}
    hello
    {{else}}
    bye
    {{/if}}
    bar
</div>
"""

BAD_HTML6 = """
<div>
        <p> <strong> <span class = "whatever">foobar </span> </strong></p>
</div>
"""

GOOD_HTML6 = """
<div>
    <p> <strong> <span class = "whatever">foobar </span> </strong></p>
</div>
"""

BAD_HTML7 = """
<div class="foobar">
<input type="foobar" name="temp" value="{{dyn_name}}"
       {{#unless invite_only}}checked="checked"{{/unless}} /> {{dyn_name}}
{{#if invite_only}}<i class="zulip-icon zulip-icon-lock"></i>{{/if}}
</div>
"""

GOOD_HTML7 = """
<div class="foobar">
    <input type="foobar" name="temp" value="{{dyn_name}}"
      {{#unless invite_only}}checked="checked"{{/unless}} /> {{dyn_name}}
    {{#if invite_only}}<i class="zulip-icon zulip-icon-lock"></i>{{/if}}
</div>
"""

BAD_HTML8 = """
{{#each test}}
            {{#with this}}
            {{#if foobar}}
                <div class="anything">{{{test_html}}}</div>
            {{/if}}
            {{#if foobar2}}
            {{> teststuff}}
            {{/if}}
            {{/with}}
{{/each}}
"""

GOOD_HTML8 = """
{{#each test}}
    {{#with this}}
    {{#if foobar}}
        <div class="anything">{{{test_html}}}</div>
    {{/if}}
    {{#if foobar2}}
    {{> teststuff}}
    {{/if}}
    {{/with}}
{{/each}}
"""

BAD_HTML9 = """
<form id="foobar" class="whatever">
    {{!        <div class="anothertest"> }}
    <input value="test" />
    <button type="button"><i class="test"></i></button>
    <button type="button"><i class="test"></i></button>
    {{!        </div> }}
    <div class="test"></div>
</form>
"""

GOOD_HTML9 = """
<form id="foobar" class="whatever">
    {{!        <div class="anothertest"> }}
    <input value="test" />
    <button type="button"><i class="test"></i></button>
    <button type="button"><i class="test"></i></button>
    {{!        </div> }}
    <div class="test"></div>
</form>
"""

BAD_HTML10 = """
{% block portico_content %}
<div class="test">
<i class='test'></i> foobar
</div>
<div class="test1">
{% for row in data %}
<div class="test2">
    {% for group in (row[0:2], row[2:4]) %}
    <div class="test2">
    </div>
    {% endfor %}
</div>
{% endfor %}
</div>
{% endblock %}
"""

GOOD_HTML10 = """
{% block portico_content %}
<div class="test">
    <i class='test'></i> foobar
</div>
<div class="test1">
    {% for row in data %}
    <div class="test2">
        {% for group in (row[0:2], row[2:4]) %}
        <div class="test2">
        </div>
        {% endfor %}
    </div>
    {% endfor %}
</div>
{% endblock %}
"""

BAD_HTML11 = """
<div class="test1">
        <div class="test2">
    foobar
        <div class="test2">
        </div>
        </div>
</div>
"""

GOOD_HTML11 = """
<div class="test1">
    <div class="test2">
        foobar
        <div class="test2">
        </div>
    </div>
</div>
"""


def pretty_print(html: str, template_format: str | None = None) -> str:
    fn = "<test str>"
    tokens = validate(fn=fn, text=html, template_format=template_format)
    return pretty_print_html(tokens, fn=fn)


class TestPrettyPrinter(unittest.TestCase):
    def compare(self, a: str, b: str) -> None:
        self.assertEqual(a.split("\n"), b.split("\n"))

    def test_pretty_print(self) -> None:
        self.compare(pretty_print(GOOD_HTML), GOOD_HTML)
        self.compare(pretty_print(BAD_HTML), GOOD_HTML)
        self.compare(pretty_print(BAD_HTML1), GOOD_HTML1)
        self.compare(pretty_print(BAD_HTML2, template_format="handlebars"), GOOD_HTML2)
        self.compare(pretty_print(BAD_HTML4), GOOD_HTML4)
        self.compare(pretty_print(BAD_HTML5, template_format="handlebars"), GOOD_HTML5)
        self.compare(pretty_print(BAD_HTML6), GOOD_HTML6)
        self.compare(pretty_print(BAD_HTML7, template_format="handlebars"), GOOD_HTML7)
        self.compare(pretty_print(BAD_HTML8, template_format="handlebars"), GOOD_HTML8)
        self.compare(pretty_print(BAD_HTML9, template_format="handlebars"), GOOD_HTML9)
        self.compare(pretty_print(BAD_HTML10, template_format="django"), GOOD_HTML10)
        self.compare(pretty_print(BAD_HTML11), GOOD_HTML11)
```

--------------------------------------------------------------------------------

---[FILE: test_template_parser.py]---
Location: zulip-main/tools/tests/test_template_parser.py
Signals: Django

```python
import sys
import unittest

try:
    from tools.lib.template_parser import (
        TemplateParserError,
        is_django_block_tag,
        tokenize,
        validate,
    )
except ImportError:
    print("ERROR!!! You need to run this via tools/test-tools.")
    sys.exit(1)


class ParserTest(unittest.TestCase):
    def _assert_validate_error(
        self,
        error: str,
        fn: str | None = None,
        text: str | None = None,
        template_format: str | None = None,
    ) -> None:
        with self.assertRaisesRegex(TemplateParserError, error):
            validate(fn=fn, text=text, template_format=template_format)

    def test_is_django_block_tag(self) -> None:
        self.assertTrue(is_django_block_tag("block"))
        self.assertFalse(is_django_block_tag("not a django tag"))

    def test_validate_vanilla_html(self) -> None:
        """
        Verify that validate() does not raise errors for
        well-formed HTML.
        """
        my_html = """
            <table>
                <tr>
                <td>foo</td>
                </tr>
            </table>"""
        validate(text=my_html)

    def test_validate_handlebars(self) -> None:
        my_html = """
            {{#with stream}}
                <p>{{stream}}</p>
            {{/with}}
            """
        validate(text=my_html, template_format="handlebars")

    def test_validate_handlebars_partial_block(self) -> None:
        my_html = """
            {{#> generic_thing }}
                <p>hello!</p>
            {{/generic_thing}}
            """
        validate(text=my_html, template_format="handlebars")

    def test_validate_bad_handlebars_partial_block(self) -> None:
        my_html = """
            {{#> generic_thing }}
                <p>hello!</p>
            {{# generic_thing}}
            """
        self._assert_validate_error(
            "Missing end tag for the token at row 4 13!", text=my_html, template_format="handlebars"
        )

    def test_validate_comment(self) -> None:
        my_html = """
            <!---
                <h1>foo</h1>
            -->"""
        validate(text=my_html)

    def test_validate_django(self) -> None:
        my_html = """
            {% include "some_other.html" %}
            {% if foo %}
                <p>bar</p>
            {% endif %}
            """
        validate(text=my_html, template_format="django")

        my_html = """
            {% block "content" %}
                {% with className="class" %}
                {% include 'foobar' %}
                {% endwith %}
            {% endblock %}
            """
        validate(text=my_html)

    def test_validate_no_start_tag(self) -> None:
        my_html = """
            foo</p>
        """
        self._assert_validate_error("No start tag", text=my_html)

    def test_validate_mismatched_tag(self) -> None:
        my_html = """
            <b>foo</i>
        """
        self._assert_validate_error(r"Mismatched tags: \(b != i\)", text=my_html)

    def test_validate_bad_indentation(self) -> None:
        my_html = """
            <p>
                foo
                </p>
        """
        self._assert_validate_error("Indentation for start/end tags does not match.", text=my_html)

    def test_validate_state_depth(self) -> None:
        my_html = """
            <b>
        """
        self._assert_validate_error("Missing end tag", text=my_html)

    def test_validate_incomplete_handlebars_tag_1(self) -> None:
        my_html = """
            {{# foo
        """
        self._assert_validate_error(
            '''Tag missing "}}" at line 2 col 13:"{{# foo
        "''',
            text=my_html,
            template_format="handlebars",
        )

    def test_validate_incomplete_handlebars_tag_2(self) -> None:
        my_html = """
            {{# foo }
        """
        self._assert_validate_error(
            'Tag missing "}}" at line 2 col 13:"{{# foo }\n"',
            text=my_html,
            template_format="handlebars",
        )

    def test_validate_incomplete_handlebars_tag_3(self) -> None:
        my_html = "{{# foo}"
        self._assert_validate_error(
            'Tag missing "}}" at line 1 col 1:"{{# foo}"',
            text=my_html,
            template_format="handlebars",
        )

    def test_validate_triple_stache_var_1(self) -> None:
        my_html = """
            {{{ foo}}
        """
        self._assert_validate_error(
            'Tag missing "}}}" at line 2 col 13:"{{{ foo}}\n"',
            text=my_html,
            template_format="handlebars",
        )

    def test_validate_triple_stache_var_2(self) -> None:
        my_html = """
            {{{ foo}~}
        """
        self._assert_validate_error(
            'Tag missing "}}}" at line 2 col 13:"{{{ foo}~}"',
            text=my_html,
            template_format="handlebars",
        )

    def test_validate_triple_stache_var_3(self) -> None:
        my_html = """
            {{{ foo }}}
        """
        self._assert_validate_error(
            "Unescaped variables in triple staches {{{ }}} must be suffixed with `_html`",
            text=my_html,
            template_format="handlebars",
        )

    def test_validate_triple_stache_var_4(self) -> None:
        my_html = """
            {{{ foo_html }~}}
        """
        validate(text=my_html, template_format="handlebars")

    def test_validate_triple_stache_var_5(self) -> None:
        my_html = "{{{ foo_html}}}"
        validate(text=my_html, template_format="handlebars")

    def test_validate_triple_stache_var_6(self) -> None:
        my_html = "{{~{ bar_html}}}"
        validate(text=my_html, template_format="handlebars")

    def test_validate_triple_stache_var_7(self) -> None:
        my_html = "{{~{ bar_html}~}}"
        validate(text=my_html, template_format="handlebars")

    def test_validate_incomplete_django_tag_1(self) -> None:
        my_html = """
            {% foo
        """
        self._assert_validate_error(
            '''Tag missing "%}" at line 2 col 13:"{% foo
        "''',
            text=my_html,
            template_format="django",
        )

    def test_validate_incomplete_django_tag_2(self) -> None:
        my_html = """
            {% foo %
        """
        self._assert_validate_error(
            'Tag missing "%}" at line 2 col 13:"{% foo %\n"',
            text=my_html,
            template_format="django",
        )

    def test_validate_incomplete_html_tag_1(self) -> None:
        my_html = """
            <b
        """
        self._assert_validate_error(
            '''Tag missing ">" at line 2 col 13:"<b
        "''',
            text=my_html,
        )

    def test_validate_incomplete_html_tag_2(self) -> None:
        my_html = """
            <a href="
        """
        my_html1 = """
            <a href=""
        """
        self._assert_validate_error(
            '''Tag missing ">" at line 2 col 13:"<a href=""
        "''',
            text=my_html1,
        )
        self._assert_validate_error(
            '''Unbalanced quotes at line 2 col 13:"<a href="
        "''',
            text=my_html,
        )

    def test_validate_empty_html_tag(self) -> None:
        my_html = """
            < >
        """
        self._assert_validate_error("Tag name missing", text=my_html)

    def test_code_blocks(self) -> None:
        # This is fine.
        my_html = """
            <code>
                x = 5
                y = x + 1
            </code>"""
        validate(text=my_html)

        # This is also fine.
        my_html = "<code>process_widgets()</code>"
        validate(text=my_html)

        # This is illegal.
        my_html = """
            <code>x =
            5</code>
            """
        self._assert_validate_error("Code tag is split across two lines.", text=my_html)

    def test_anchor_blocks(self) -> None:
        # This is allowed, although strange.
        my_html = """
            <a href="/some/url">
            Click here
            for more info.
            </a>"""
        validate(text=my_html)

        # This is fine.
        my_html = '<a href="/some/url">click here</a>'
        validate(text=my_html)

        # Even this is fine.
        my_html = """
            <a class="twitter-timeline" href="https://twitter.com/ZulipStatus"
                data-widget-id="443457763394334720"
                data-screen-name="ZulipStatus"
                >@ZulipStatus on Twitter</a>.
            """
        validate(text=my_html)

    def test_validate_jinja2_whitespace_markers_1(self) -> None:
        my_html = """
        {% if foo -%}
        this is foo
        {% endif %}
        """
        validate(
            text=my_html,
            template_format="django",
        )

    def test_validate_jinja2_whitespace_markers_2(self) -> None:
        my_html = """
        {% if foo %}
        this is foo
        {%- endif %}
        """
        validate(
            text=my_html,
            template_format="django",
        )

    def test_validate_jinja2_whitespace_markers_3(self) -> None:
        my_html = """
        {% if foo %}
        this is foo
        {% endif -%}
        """
        validate(
            text=my_html,
            template_format="django",
        )

    def test_validate_jinja2_whitespace_markers_4(self) -> None:
        my_html = """
        {%- if foo %}
        this is foo
        {% endif %}
        """
        validate(
            text=my_html,
            template_format="django",
        )

    def test_validate_mismatch_jinja2_whitespace_markers_1(self) -> None:
        my_html = """
        {% if foo %}
        this is foo
        {%- if bar %}
        """
        self._assert_validate_error(
            "Missing end tag",
            text=my_html,
            template_format="django",
        )

    def test_validate_jinja2_whitespace_type2_markers(self) -> None:
        my_html = """
        {%- if foo -%}
        this is foo
        {% endif %}
        """
        validate(
            text=my_html,
            template_format="django",
        )

    def test_tokenize(self) -> None:
        tag = "<!DOCTYPE html>"
        token = tokenize(tag)[0]
        self.assertEqual(token.kind, "html_doctype")

        tag = "<a>bla"
        token = tokenize(tag)[0]
        self.assertEqual(token.kind, "html_start")
        self.assertEqual(token.tag, "a")

        tag = "<br />bla"
        token = tokenize(tag)[0]
        self.assertEqual(token.kind, "html_singleton")
        self.assertEqual(token.tag, "br")

        tag = "<input>bla"
        token = tokenize(tag)[0]
        self.assertEqual(token.kind, "html_start")  # We later mark this an error.
        self.assertEqual(token.tag, "input")

        tag = "<input />bla"
        token = tokenize(tag)[0]
        self.assertEqual(token.kind, "html_singleton")
        self.assertEqual(token.tag, "input")

        tag = "</a>bla"
        token = tokenize(tag)[0]
        self.assertEqual(token.kind, "html_end")
        self.assertEqual(token.tag, "a")

        tag = "{{#with foo}}bla"
        token = tokenize(tag, template_format="handlebars")[0]
        self.assertEqual(token.kind, "handlebars_start")
        self.assertEqual(token.tag, "with")

        tag = "{{/with}}bla"
        token = tokenize(tag, template_format="handlebars")[0]
        self.assertEqual(token.kind, "handlebars_end")
        self.assertEqual(token.tag, "with")

        tag = "{{#> compose_banner }}bla"
        token = tokenize(tag, template_format="handlebars")[0]
        self.assertEqual(token.kind, "handlebars_partial_block")
        self.assertEqual(token.tag, "compose_banner")

        tag = "{% if foo %}bla"
        token = tokenize(tag, template_format="django")[0]
        self.assertEqual(token.kind, "django_start")
        self.assertEqual(token.tag, "if")

        tag = "{% endif %}bla"
        token = tokenize(tag, template_format="django")[0]
        self.assertEqual(token.kind, "django_end")
        self.assertEqual(token.tag, "if")

        tag = "{% if foo -%}bla"
        token = tokenize(tag, template_format="django")[0]
        self.assertEqual(token.kind, "jinja2_whitespace_stripped_start")
        self.assertEqual(token.tag, "if")

        tag = "{%- endif %}bla"
        token = tokenize(tag, template_format="django")[0]
        self.assertEqual(token.kind, "jinja2_whitespace_stripped_end")
        self.assertEqual(token.tag, "if")

        tag = "{%- if foo -%}bla"
        token = tokenize(tag, template_format="django")[0]
        self.assertEqual(token.kind, "jinja2_whitespace_stripped_type2_start")
        self.assertEqual(token.tag, "if")
```

--------------------------------------------------------------------------------

---[FILE: test_zulint_custom_rules.py]---
Location: zulip-main/tools/tests/test_zulint_custom_rules.py

```python
import os
from io import StringIO
from unittest import TestCase
from unittest.mock import patch

from typing_extensions import override
from zulint.custom_rules import RuleList

from tools.linter_lib.custom_check import non_py_rules, python_rules

ROOT_DIR = os.path.abspath(os.path.join(__file__, "..", "..", ".."))
CHECK_MESSAGE = "Fix the corresponding rule in `tools/linter_lib/custom_check.py`."


class TestRuleList(TestCase):
    @override
    def setUp(self) -> None:
        all_rules = list(python_rules.rules)
        for rule in non_py_rules:
            all_rules.extend(rule.rules)
        self.all_rules = all_rules

    def test_paths_in_rules(self) -> None:
        """Verifies that the paths mentioned in linter rules actually exist"""
        for rule in self.all_rules:
            for path in rule.get("exclude", {}):
                abs_path = os.path.abspath(os.path.join(ROOT_DIR, path))
                self.assertTrue(
                    os.path.exists(abs_path),
                    f"'{path}' is neither an existing file, nor a directory. {CHECK_MESSAGE}",
                )

            for line_tuple in rule.get("exclude_line", {}):
                path = line_tuple[0]
                abs_path = os.path.abspath(os.path.join(ROOT_DIR, path))
                self.assertTrue(
                    os.path.isfile(abs_path), f"The file '{path}' doesn't exist. {CHECK_MESSAGE}"
                )

            for path in rule.get("include_only", {}):
                if not os.path.splitext(path)[1]:
                    self.assertTrue(
                        path.endswith("/"),
                        f"The path '{path}' should end with '/'. {CHECK_MESSAGE}",
                    )

    def test_rule_patterns(self) -> None:
        """Verifies that the search regex specified in a custom rule actually matches
        the expectation and doesn't throw false positives."""
        for rule in self.all_rules:
            pattern = rule["pattern"]
            for line in rule.get("good_lines", []):
                with patch("builtins.open", return_value=StringIO(line + "\n\n"), autospec=True):
                    self.assertFalse(
                        RuleList([], [rule]).custom_check_file("foo.bar", "baz", ""),
                        f"The pattern '{pattern}' matched the line '{line}' while it shouldn't.",
                    )

            for line in rule.get("bad_lines", []):
                for filename in rule.get("include_only", {"foo.bar"}):
                    with (
                        patch("builtins.open", return_value=StringIO(line + "\n\n"), autospec=True),
                        patch("builtins.print"),
                    ):
                        self.assertTrue(
                            RuleList([], [rule]).custom_check_file(filename, "baz", ""),
                            f"The pattern '{pattern}' didn't match the line '{line}' while it should.",
                        )
```

--------------------------------------------------------------------------------

---[FILE: test_template1.html]---
Location: zulip-main/tools/tests/test_template_data/test_template1.html

```text
<!-- test -->
      <!DOCTYPE html>
      <html>
      <head>
          <title>Test</title>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <div id="intro">
          <p id="intro">
            <span id="hello_{{ message }}">Hello world!!</span>
            This is a test file for checking correct working of duplicate id detection module.
          </p>
        </div>
      </body>
      </html>
```

--------------------------------------------------------------------------------

---[FILE: test_template2.html]---
Location: zulip-main/tools/tests/test_template_data/test_template2.html

```text
<!-- test -->
      <!DOCTYPE html>
      <html>
      <head>
          <title>Test</title>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <div id="below_navbar">
          <p id="intro">
            <span id="hello_{{ message }}">Hello world!!</span>
            This is a test file for checking correct working of duplicate id detection module.
          </p>
        </div>
      </body>
      </html>
```

--------------------------------------------------------------------------------

---[FILE: zulip-export]---
Location: zulip-main/tools/zulip-export/zulip-export

```text
#!/usr/bin/env python3

# Copyright © 2014 Dropbox, Inc.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
import argparse
import json
import os
import sys

usage = """Export all messages on a given stream to a JSON dump.

zulip-export --user=<your email address> --api-key=<your API key> --stream=<stream name>

(You can find your API key on your Settings page.)

Example: zulip-export --user=wdaher@zulip.com --api-key=a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5 --stream=social

You can omit --user and --api-key arguments if you have a properly set up ~/.zuliprc
This script requires the Zulip API bindings to be installed."""
sys.path.append(os.path.join(os.path.dirname(__file__), "../../api"))
import zulip

parser = zulip.add_default_arguments(argparse.ArgumentParser(usage=usage))
parser.add_argument("--stream", required=True)
options = parser.parse_args()

client = zulip.init_from_options(options)

client.add_subscriptions([{"name": options.stream}])
queue = client.register(event_types=["message"])
max_id = queue["max_message_id"]
messages = []
request = {
    "anchor": 0,
    "num_before": 0,
    "num_after": max_id,
    "narrow": [{"operator": "stream", "operand": options.stream}],
    "apply_markdown": False,
}

print("Fetching messages...")
result = client.call_endpoint(
    url="messages",
    method="GET",
    request=request,
)

if result["result"] != "success":
    print("Unfortunately, there was an error fetching some old messages.")
    print(result)
    sys.exit(1)
for msg in result["messages"]:
    if msg["type"] != "stream":
        continue
    # Remove extraneous metadata
    for k in [
        "flags",
        "edit_history",
        "topic_links",
        "avatar_url",
        "content_type",
        "client",
        "sender_realm_str",
        "id",
        "type",
    ]:
        msg.pop(k, None)
    messages.append(msg)

filename = f"zulip-{options.stream}.json"
with open(filename, "w") as f:
    json.dump(messages, f, indent=0, sort_keys=False)
print(f"{len(messages)} messages exported to {filename}")
sys.exit(0)
```

--------------------------------------------------------------------------------

---[FILE: .browserslistrc]---
Location: zulip-main/web/.browserslistrc

```text
> 0.15%
> 0.15% in US
last 2 versions
Firefox ESR
not dead and fully supports css-logical-props

[test]
current Node
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: zulip-main/web/.gitignore

```text
# From emoji
/generated/emoji
/generated/emoji-styles
# From passing pygments data to the frontend
/generated/pygments_data.json
# From passing time zone data to the frontend
/generated/timezones.json
```

--------------------------------------------------------------------------------

---[FILE: babel.config.js]---
Location: zulip-main/web/babel.config.js

```javascript
// @ts-check

/** @type {import("babel-plugin-formatjs/types").Options} */
const formatJsOptions = {
    additionalFunctionNames: ["$t", "$t_html"],
    overrideIdFn: (_id, defaultMessage) => defaultMessage ?? "",
};

/** @type {import("@babel/preset-env").Options} */
const presetEnvOptions = {
    corejs: "3.46",
    shippedProposals: true,
    useBuiltIns: "usage",
};

/** @type {import("@babel/core").TransformOptions} */
export default {
    plugins: [["formatjs", formatJsOptions]],
    presets: [["@babel/preset-env", presetEnvOptions], "@babel/typescript"],
};
```

--------------------------------------------------------------------------------

---[FILE: debug-require-webpack-plugin.ts]---
Location: zulip-main/web/debug-require-webpack-plugin.ts

```typescript
// This plugin exposes a version of require() to the browser console to assist
// debugging.  It also exposes the list of modules it knows about as the keys
// of the require.ids object.

import path from "node:path";

import type {ResolveRequest} from "enhanced-resolve";
import webpack from "webpack";

export default class DebugRequirePlugin implements webpack.WebpackPluginInstance {
    apply(compiler: webpack.Compiler): void {
        const resolved = new Map<string, Set<string>>();
        const nameSymbol = Symbol("DebugRequirePluginName");
        type NamedRequest = ResolveRequest & {
            [nameSymbol]?: string | undefined;
        };
        let debugRequirePath: string | false = false;

        compiler.resolverFactory.hooks.resolver
            .for("normal")
            .tap("DebugRequirePlugin", (resolver) => {
                resolver.getHook("beforeRawModule").tap("DebugRequirePlugin", (req) => {
                    if (!(nameSymbol in req)) {
                        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                        (req as NamedRequest)[nameSymbol] = req.request;
                    }
                    return undefined!;
                });

                resolver.getHook("beforeRelative").tap("DebugRequirePlugin", (req) => {
                    if (req.path !== false) {
                        const inPath = path.relative(compiler.context, req.path);
                        if (!inPath.startsWith("../") && !(nameSymbol in req)) {
                            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                            (req as NamedRequest)[nameSymbol] = "./" + inPath;
                        }
                    }
                    return undefined!;
                });

                resolver
                    .getHook("beforeResolved")
                    .tap("DebugRequirePlugin", (req: ResolveRequest) => {
                        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                        const name = (req as NamedRequest)[nameSymbol];
                        if (name !== undefined && req.path !== false) {
                            const names = resolved.get(req.path);
                            if (names) {
                                names.add(name);
                            } else {
                                resolved.set(req.path, new Set([name]));
                            }
                        }
                        return undefined!;
                    });
            });

        compiler.hooks.beforeCompile.tapPromise(
            "DebugRequirePlugin",
            async ({normalModuleFactory}) => {
                const resolver = normalModuleFactory.getResolver("normal");
                debugRequirePath = await new Promise((resolve) => {
                    resolver.resolve(
                        {},
                        import.meta.dirname,
                        "./debug-require.cjs",
                        {},
                        (err?: Error | null, result?: string | false) => {
                            resolve(err ? false : result!);
                        },
                    );
                });
            },
        );

        compiler.hooks.compilation.tap("DebugRequirePlugin", (compilation) => {
            compilation.mainTemplate.hooks.bootstrap.tap(
                "DebugRequirePlugin",
                (source: string, chunk: webpack.Chunk) => {
                    if (compilation.chunkGraph === undefined) {
                        return source;
                    }

                    const ids: [string, string | number][] = [];
                    let hasDebugRequire = false;
                    compilation.chunkGraph.hasModuleInGraph(
                        chunk,
                        (m) => {
                            if (m instanceof webpack.NormalModule) {
                                const id = compilation.chunkGraph.getModuleId(m);
                                if (id === null) {
                                    return false;
                                }
                                if (m.resource === debugRequirePath) {
                                    hasDebugRequire = true;
                                }
                                for (const name of resolved.get(m.resource) ?? []) {
                                    ids.push([
                                        m.rawRequest.slice(0, m.rawRequest.lastIndexOf("!") + 1) +
                                            name,
                                        id,
                                    ]);
                                }
                            }
                            return false;
                        },
                        () => true,
                    );

                    if (!hasDebugRequire) {
                        return source;
                    }

                    ids.sort();
                    return webpack.Template.asString([
                        source,
                        `__webpack_require__.debugRequireIds = ${JSON.stringify(
                            Object.fromEntries(ids),
                            null,
                            "\t",
                        )};`,
                    ]);
                },
            );
        });
    }
}
```

--------------------------------------------------------------------------------

---[FILE: debug-require.cjs]---
Location: zulip-main/web/debug-require.cjs

```text
"use strict";

/* global __webpack_require__ */

function debugRequire(request) {
    if (!Object.prototype.hasOwnProperty.call(debugRequire.ids, request)) {
        throw new Error("Cannot find module '" + request + "'");
    }
    var moduleId = debugRequire.ids[request];
    if (!Object.prototype.hasOwnProperty.call(__webpack_require__.m, moduleId)) {
        throw new Error("Module '" + request + "' has not been loaded yet");
    }
    return __webpack_require__(moduleId);
}

debugRequire.r = __webpack_require__;
debugRequire.ids = __webpack_require__.debugRequireIds;

module.exports = debugRequire;
```

--------------------------------------------------------------------------------

---[FILE: postcss.config.js]---
Location: zulip-main/web/postcss.config.js

```javascript
// @ts-check

import path from "node:path";

import postcssExtendRule from "postcss-extend-rule";
import postcssImport from "postcss-import";
import postcssPrefixWrap from "postcss-prefixwrap";
import postcssPresetEnv from "postcss-preset-env";
import postcssSimpleVars from "postcss-simple-vars";

import {container_breakpoints, media_breakpoints} from "./src/css_variables.ts";

/**
 * @param {object} ctx
 * @returns {import("postcss-load-config").Config}
 * @satisfies {import("postcss-load-config").ConfigFn & import("postcss-loader/dist/config").PostCSSLoaderOptions}
 */
const config = (ctx) => ({
    plugins: [
        "file" in ctx &&
            (typeof ctx.file === "string"
                ? path.basename(ctx.file)
                : typeof ctx.file === "object" && ctx.file !== null && "basename" in ctx.file
                  ? ctx.file.basename
                  : undefined) === "dark_theme.css" &&
            // Add postcss-import plugin with postcss-prefixwrap to handle
            // the flatpickr dark theme. We do this because flatpickr themes
            // are not scoped. See https://github.com/flatpickr/flatpickr/issues/2168.
            postcssImport({
                plugins: [postcssPrefixWrap("%dark-theme")],
            }),
        postcssExtendRule,
        postcssSimpleVars({variables: {...container_breakpoints, ...media_breakpoints}}),
        postcssPresetEnv({
            features: {
                "is-pseudo-class": true, // Needed for postcss-extend-rule
                "nesting-rules": true,
            },
        }),
    ],
});
export default config;
```

--------------------------------------------------------------------------------

````
