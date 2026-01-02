---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 538
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 538 of 1290)

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

---[FILE: dev_help.html]---
Location: zulip-main/templates/zerver/development/dev_help.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "dev-help" %}

{% block title %}
<title>Help center server not running | Zulip Dev</title>
{% endblock %}

{% block portico_content %}

<div class="dev-help-page flex">
    <div class="white-box markdown">
        {% if mdx_file_exists %}
            <h2 class="dev-help-header">Help center server not running</h2>
            <p>
                To minimize resource requirements for the development
                environment, the help center's development server does
                not run by default. Below are our recommendations for
                accessing this help center page:
            </p>
            <ul>
                <li>
                    <b>Quick reference</b>: If you aren't planning to modify the help center, you can
                    <a target="_blank" rel="noopener noreferrer"
                      href="https://zulip.com/help/{{ subpath }}">view it on
                    zulip.com</a>. Pages may be slightly behind the version
                    currently in <code>main</code>.
                </li>
                <li>
                    <b>Up-to-date reference</b>: You can
                    <a target="_blank" rel="noopener noreferrer" href="{{
                      raw_url }}">view the current raw MDX file</a>, which is recommended for documentation
                    that touches brand new or recently modified features.
                </li>
                <li>
                    <b>Modifying the help center</b>:
                    {% include "zerver/development/help_center_instructions_macro.html" %}
                </li>
            </ul>
        {% else %}
            <p class="invalid-path-error">
                This is not a valid help path and not a valid MDX file. Please re-check the URL subpath you have provided.
            </p>
        {% endif %}

        <div class="dev-help-actions">
            {% if mdx_file_exists %}
                <a target="_blank" rel="noopener noreferrer" href="https://zulip.com/help/{{ subpath }}" class="dev-help-action-button">
                    View page on zulip.com
                </a>
                <a target="_blank" rel="noopener noreferrer" href="{{ raw_url }}" class="dev-help-action-button">
                    View page source
                </a>
            {% endif %}
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: dev_login.html]---
Location: zulip-main/templates/zerver/development/dev_login.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "dev-login" %}

{% block title %}
<title>Log in | Zulip Dev</title>
{% endblock %}

{# Login page. #}
{% block portico_content %}
<!-- The following empty tag has unique data-page-id so that this
page can be easily identified in it's respective JavaScript file -->
<div data-page-id="dev-login"></div>
<div class="app login-page flex full-page">
    <div class="app-main login-page-container dev-login white-box">
        {% if current_realm %}
        <h4 class="login-page-header">Click on a user to log in to {{ current_realm.name }}!</h4>
        {% else %}
        <h4 class="login-page-header">Click on a user to log in!</h4>
        {% endif %}
        <p class="devlogin_subheader">(Browse the <a href="/devtools">developer tools</a> or visit the <a href="/login/">normal login page</a>.)</p>
        <form name="direct_login_form" id="direct_login_form" method="post" class="login-form">
            <input type="hidden" name="next" value="{{ next }}" />
            <div class="controls">
                <div class="group">
                    {% if realm_web_public_access_enabled %}
                    <h2>{{_('Anonymous user') }}</h2>
                    <p>
                        <input type="submit" formaction="{{ current_realm.url }}{{ url('login-local') }}"
                          name="prefers_web_public_view" class="dev-button dev-login-button" value="Anonymous login" />
                    </p>
                    {% endif %}
                    <h2>{{_('Owners') }}</h2>
                    {% if direct_owners %}
                        {% for direct_owner in direct_owners %}
                        <p>
                            <button type="submit" formaction="{{ direct_owner.realm.url }}{{ url('login-local') }}"
                              name="direct_email" class="dev-button dev-login-button" value="{{ direct_owner.delivery_email }}">
                                {% if direct_owner.realm.demo_organization_scheduled_deletion_date %}
                                    {{ direct_owner.full_name }}
                                {% else %}
                                    {{ direct_owner.delivery_email }}
                                {% endif %}
                            </button>
                        </p>
                        {% endfor %}
                    {% else %}
                        <p>No owners found in this realm</p>
                    {% endif %}
                    <h2>{{ _('Administrators') }}</h2>
                    {% if direct_admins %}
                        {% for direct_admin in direct_admins %}
                        <p>
                            <input type="submit" formaction="{{ direct_admin.realm.url }}{{ url('login-local') }}"
                              name="direct_email" class="dev-button dev-login-button" value="{{ direct_admin.delivery_email }}" />
                        </p>
                        {% endfor %}
                    {% else %}
                        <p>No administrators found in this realm</p>
                    {% endif %}
                    <h2>{{ _('Moderators') }}</h2>
                    {% if direct_moderators %}
                        {% for direct_moderator in direct_moderators %}
                        <p>
                            <input type="submit" formaction="{{ direct_moderator.realm.url }}{{ url('login-local') }}"
                              name="direct_email" class="dev-button dev-login-button" value="{{ direct_moderator.delivery_email }}" />
                        </p>
                        {% endfor %}
                    {% else %}
                        <p>No moderators found in this realm</p>
                    {% endif %}
                    <h2>{{ _('Guest users') }}</h2>
                    {% if guest_users %}
                        {% for guest_user in guest_users %}
                        <p>
                            <input type="submit" formaction="{{ guest_user.realm.url }}{{ url('login-local') }}"
                              name="direct_email" class="dev-button dev-login-button" value="{{ guest_user.delivery_email }}" />
                        </p>
                        {% endfor %}
                    {% else %}
                        <p>No guest users found in this realm</p>
                    {% endif %}
                </div>

                <div class="group">
                    <h2>{{ _('Normal users') }}</h2>
                    {% if direct_users %}
                        {% for direct_user in direct_users %}
                        <p>
                            <input type="submit" formaction="{{ direct_user.realm.url }}{{ url('login-local') }}"
                              name="direct_email" class="dev-button dev-login-button" value="{{ direct_user.delivery_email }}" />
                        </p>
                        {% endfor %}
                    {% else %}
                        <p>No normal users found in this realm</p>
                    {% endif %}
                </div>
            </div>
        </form>
        <form name="change_realm" action="{{ url('login_page') }}" method="post">
            {{ csrf_input }}
            <h2>Realm</h2>
            <select class="bootstrap-focus-style" name="new_realm" onchange="this.form.submit()">
                <option value="all_realms" {% if not current_realm %}selected="selected"{% endif %}>All realms</option>
                {% for realm in all_realms %}
                <option value="{{realm.string_id}}" {% if current_realm == realm %}selected="selected"{% endif %}>{{realm.name}}</option>
                {% endfor %}
            </select>
        </form>
        <div id="devtools-wrapper">
            <div id="devtools-registration">
                <form name="register_dev_user" action="{{ url('register_dev_user') }}" method="POST">
                    <input type="submit" class="dev-button dev-create-button" value="Create new user" />
                </form>
                <form name="register_dev_realm" action="{{ url('register_dev_realm') }}" method="POST">
                    <input type="submit" class="dev-button dev-create-button" value="Create new realm" />
                </form>
                <form name="register_demo_dev_realm" action="{{ url('register_demo_dev_realm') }}" method="POST">
                    <input type="submit" class="dev-button dev-create-button" value="Create demo organization" />
                </form>
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: dev_tools.html]---
Location: zulip-main/templates/zerver/development/dev_tools.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>Development tools | Zulip Dev</title>
{% endblock %}

{# Login page. #}
{% block portico_content %}

<div class="app flex full-page">
    <div id="devtools-page" class="markdown">
        <h1>Development tools</h1>
        <p>
            This page describes development-specific URLs and commands that may
            come in handy. Make sure your development server is running when you
            visit the pages linked below.
        </p>
        <h2>General</h2>
        <table class="table table-striped table-rounded table-bordered">
            <thead>
                <tr>
                    <th>URL</th>
                    <th>Command</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><a href="/devtools/integrations">/devtools/integrations</a></td>
                    <td>None needed</td>
                    <td>Test incoming webhook integrations</td>
                </tr>
                <tr>
                    <td><a href="/emails">/emails</a></td>
                    <td>None needed</td>
                    <td>View outgoing and example emails.</td>
                </tr>
                <tr>
                    <td><a href="/digest">/digest</a></td>
                    <td>None needed</td>
                    <td>View sample digest email.</td>
                </tr>
                <tr>
                    <td><a href="/docs/index.html">/docs/index.html</a></td>
                    <td><code>./tools/build-docs</code></td>
                    <td>Developer and production documentation (ReadTheDocs) built locally</td>
                </tr>
                <tr>
                    <td><a href="/stats/realm/analytics/">/stats/realm/analytics/</a></td>
                    <td><code>./manage.py populate_analytics_db</code><br />
                        Run the command after changing analytics data population logic.
                    </td>
                    <td>View the /stats page with some pre-populated data</td>
                </tr>

            </tbody>
        </table>
        <h2>Design system</h2>
        <table class="table table-striped table-rounded table-bordered">
            <thead>
                <tr>
                    <th>URL</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><a href="/devtools/buttons">/devtools/buttons</a></td>
                    <td>Test button styles</td>
                </tr>
                <tr>
                    <td><a href="/devtools/banners">/devtools/banners</a></td>
                    <td>Test banner styles</td>
                </tr>
                <tr>
                    <td><a href="/devtools/inputs">/devtools/inputs</a></td>
                    <td>Test input styles</td>
                </tr>
            </tbody>
        </table>
        <h2>Test coverage</h2>
        <table class="table table-striped table-rounded table-bordered">
            <thead>
                <tr>
                    <th>URL</th>
                    <th>Command</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><a href="/coverage/index.html">/coverage/index.html</a></td>
                    <td><code>./tools/test-backend --coverage</code></td>
                    <td>Backend (Django) test coverage report</td>
                </tr>
                <tr>
                    <td><a href="/node-coverage/index.html">/node-coverage/index.html</a></td>
                    <td><code>./tools/test-js-with-node --coverage</code></td>
                    <td>Frontend (node) test coverage report</td>
                </tr>
            </tbody>
        </table>
        <h2>Useful management commands</h2>
        <p>Development-specific <a href="https://zulip.readthedocs.io/en/latest/production/management-commands.html">management commands</a> live in <code>zilencer/management/commands</code>.  Highlights include:</p>
        <ul>
            <li><code>./manage.py populate_db</code>: Rebuilds database. Has options to, for example, create 3K users for testing.</li>
            <li><code>./manage.py mark_all_messages_unread</code>: Useful for testing reading messages.</li>
            <li><code>./manage.py send_zulip_update_announcements</code>: Send <a href="https://zulip.com/help/configure-automated-notices#zulip-update-announcements">Zulip
                update notices</a> drafted in <code>zerver/lib/zulip_update_announcements.py</code>.</li>
            <li><code>./manage.py add_mock_conversation</code>: Add test messages, streams, images, emoji, etc.
                into the dev environment. First edit <code>zilencer/management/commands/add_mock_conversation.py</code>
                to add the data you're testing.
            </li>
        </ul>
        <p>We also have
            <a href="https://zulip.readthedocs.io/en/latest/development/authentication.html">documentation on testing LDAP, Google &amp; GitHub authentication</a> in the development environment.
        </p>
        <h2>Modifying and running the help center</h2>
        {% include "zerver/development/help_center_instructions_macro.html" %}
        <h2>Viewing error pages</h2>
        <table class="table table-striped table-rounded table-bordered">
            <thead>
                <tr>
                    <th>URL</th>
                    <th>Command</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><a href="/webpack/5xx.html">/webpack/5xx.html</a></td>
                    <td>None needed</td>
                    <td>Error 5xx page served by nginx (used when Django is totally broken)</td>
                </tr>
                <tr>
                    <td><a href="/errors/404">/errors/404</a></td>
                    <td>None needed</td>
                    <td>Error 404 page served by Django</td>
                </tr>
                <tr>
                    <td><a href="/errors/5xx">/errors/5xx</a></td>
                    <td>None needed</td>
                    <td>Error 5xx page served by Django</td>
                </tr>
                <tr>
                    <td><a href="/accounts/do_confirm/invalid">/accounts/do_confirm/invalid</a></td>
                    <td>None needed</td>
                    <td>Invalid confirmation link page</td>
                </tr>
            </tbody>
        </table>
        <h2>Connecting to the local PostgreSQL database</h2>
        <ul>
            <li>
                <code>./manage.py dbshell</code>: Connect to
                PostgreSQL database via your terminal.
            </li>
            <li>
                <code>provision</code> creates a <code>~/.pgpass</code> file,
                so <code>psql -U zulip -h localhost</code> works too.
            </li>
            <li>
                <p>
                    To connect using a graphical PostgreSQL client
                    like <a href="https://www.pgadmin.org/">pgAdmin</a>,
                    use the following credentials:
                </p>
                <ul>
                    <li>Host: 127.0.0.1 (don't use localhost)</li>
                    <li>Maintenance database: zulip</li>
                    <li>Username: zulip</li>
                    <li>password: stored as <code>local_database_password</code> in <code>zulip/zproject/dev-secrets.conf</code></li>
                </ul>
            </li>
        </ul>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: email_log.html]---
Location: zulip-main/templates/zerver/development/email_log.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "dev-email-log" %}

{% block title %}
<title>Email log | Zulip Dev</title>
{% endblock %}

{% block content %}
<div class="container" id="dev-email-log-container">
    <div class="dev-email-log-header">
        <div class="dev-email-log-actions">
            All emails sent in the Zulip development environment are logged here. <a href="/emails/clear">Clear this log</a>
            | <a href="/emails/generate">Manually generate most emails</a>
            | <a href="#" class="open-forward-email-modal">Forward emails to an email account</a>
        </div>
        <div class="dev-email-log-text-only">
            <label>
                <input type="checkbox" autocomplete="off" id="toggle"/>
                <strong>Show text only version</strong>
            </label>
        </div>
    </div>
    <div class="dev-email-log-content">
        {{ log |safe }}
    </div>
    <div id="forward_email_modal" class="micromodal" aria-hidden="true">
        <div class="modal__overlay" tabindex="-1">
            <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="dialog_title">
                <header class="modal__header">
                    <h1 class="modal__title dialog_heading">
                        {{ _('Forward emails to an email account') }}
                    </h1>
                    <button class="modal__close" aria-label="{{ _('Close modal') }}" data-micromodal-close></button>
                </header>
                <main class="modal__content">
                    <div class="input-group">
                        <form id="smtp_form">
                            {{ csrf_input }}
                            <div class="dev-forward-email-alert" id="smtp_form_status">
                                Updated successfully.
                            </div>
                            <label for="forward">
                                Forwards all emails sent in the development environment to an external mail account.
                            </label>
                            <label class="radio">
                                <input name="forward" type="radio" value="enabled" {% if forward_address %}checked{% endif %}/>Yes
                            </label>
                            <label class="radio">
                                <input name="forward" type="radio" value="disabled" {% if not forward_address %}checked{% endif %}/>No
                            </label>
                            <div id="forward_address_sections" {% if not forward_address %}class="hide"{% endif %} >
                                <label for="forward_address"><strong>Address to which emails should be forwarded</strong></label>
                                <input type="text" id="address" name="forward_address" placeholder="eg: your-email@example.com" value="{{forward_address}}"/>
                            </div>
                            <div class="dev-forward-email-alert">
                                You must set up SMTP as described
                                <a target="_blank" rel="noopener noreferrer" href="https://zulip.readthedocs.io/en/latest/subsystems/email.html#development-and-testing"> here</a>
                                first before enabling this.
                            </div>
                        </form>
                    </div>
                </main>
                <footer class="modal__footer">
                    <button class="modal__button dialog_exit_button" aria-label="{{ '(Close this dialog window)' }}" data-micromodal-close>{{ _('Close') }}</button>
                    <button class="modal__button dialog_submit_button">
                        <span>{{ _('Update') }}</span>
                    </button>
                </footer>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: help_center_instructions_macro.html]---
Location: zulip-main/templates/zerver/development/help_center_instructions_macro.html

```text
If you're making changes to the help center files, be sure to <b>test</b> and
provide screenshots in your pull request description. As with other code,
untested documentation is often buggy.

<ul>
    <li>
        To run just the help center dev server without
        running the rest of the Zulip app, use
        <code>./tools/run-dev --only-help-center</code>.
    </li>
    <li>
        To run the help center dev server alongside the
        Zulip app, use
        <code>./tools/run-dev --help-center-dev-server</code> (requires more resources).
    </li>
    <li>
        To test help center search, run <code>./tools/build-help-center</code> followed by
        <code>./tools/run-dev --help-center-static-build</code>. Hot reloads won't
        work: rerun <code>./tools/build-help-center</code>
        and reload your browser to see updates. Search will not
        work with other methods of running the help center.
    </li>
</ul>
```

--------------------------------------------------------------------------------

---[FILE: integrations_dev_panel.html]---
Location: zulip-main/templates/zerver/development/integrations_dev_panel.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "dev-integrations-panel" %}

{% block title %}
<title>Integrations developer panel | Zulip Dev</title>
{% endblock %}

{% block customhead %}

<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}


{% block portico_content %}
<div class="header portico-header">
    <div class="header-main top-navbar">
        <div>
            <a class="brand logo">
                <svg role="img" aria-label="{{ _('Zulip') }}" xmlns="http://www.w3.org/2000/svg" viewBox="68.96 55.62 1742.12 450.43" height="25">
                    <path fill="hsl(0, 0%, 27%)" d="M473.09 122.97c0 22.69-10.19 42.85-25.72 55.08L296.61 312.69c-2.8 2.4-6.44-1.47-4.42-4.7l55.3-110.72c1.55-3.1-.46-6.91-3.64-6.91H129.36c-33.22 0-60.4-30.32-60.4-67.37 0-37.06 27.18-67.37 60.4-67.37h283.33c33.22-.02 60.4 30.3 60.4 67.35zM129.36 506.05h283.33c33.22 0 60.4-30.32 60.4-67.37 0-37.06-27.18-67.37-60.4-67.37H198.2c-3.18 0-5.19-3.81-3.64-6.91l55.3-110.72c2.02-3.23-1.62-7.1-4.42-4.7L94.68 383.6c-15.53 12.22-25.72 32.39-25.72 55.08 0 37.05 27.18 67.37 60.4 67.37zm522.5-124.15l124.78-179.6v-1.56H663.52v-48.98h190.09v34.21L731.55 363.24v1.56h124.01v48.98h-203.7V381.9zm338.98-230.14V302.6c0 45.09 17.1 68.03 47.43 68.03 31.1 0 48.2-21.77 48.2-68.03V151.76h59.09V298.7c0 80.86-40.82 119.34-109.24 119.34-66.09 0-104.96-36.54-104.96-120.12V151.76h59.48zm244.91 0h59.48v212.25h104.18v49.76h-163.66V151.76zm297 0v262.01h-59.48V151.76h59.48zm90.18 3.5c18.27-3.11 43.93-5.44 80.08-5.44 36.54 0 62.59 7 80.08 20.99 16.72 13.22 27.99 34.99 27.99 60.64 0 25.66-8.55 47.43-24.1 62.2-20.21 19.05-50.15 27.6-85.13 27.6-7.77 0-14.77-.39-20.21-1.17v93.69h-58.7V155.26zm58.7 118.96c5.05 1.17 11.27 1.55 19.83 1.55 31.49 0 50.92-15.94 50.92-42.76 0-24.1-16.72-38.49-46.26-38.49-12.05 0-20.21 1.17-24.49 2.33v77.37z"/>
                </svg>
            </a>
        </div>

        <div class="centerpiece">Integrations developer panel</div>

        <div class="top-links">
            <a href="/">Go to Zulip</a>
        </div>

    </div>
</div>

<div class="pad-small"></div>

<div id="dev-panel">
    <div class="row1">
        <div>
            <label for="bot_name"><b>Bot</b></label>
            <select class="bootstrap-focus-style" id="bot_name">
                <option value=""></option>
                {% for bot in bots %}
                <option value="{{ bot.api_key }}"> {{ bot.full_name }} </option>
                {% endfor %}
            </select>
        </div>

        <div>
            <label><b>Integration</b></label>
            <select class="bootstrap-focus-style" id="integration_name">
                <option value=""></option>
                {% for integration in integrations %}
                <option value="{{ integration }}"> {{ integration }} </option>
                {% endfor %}
            </select>
        </div>

        <div>
            <label for="fixture_name"><b>Fixture</b></label>
            <select class="bootstrap-focus-style" id="fixture_name"></select>
        </div>

        <div>
            <label class="optional"><b>Stream</b></label>
            <input id="stream_name" type="text" />
        </div>

        <div>
            <label class="optional"><b>Topic</b></label>
            <input id="topic_name" type="text" />
        </div>
    </div>

    <br />

    <div class="row2">
        <label for="URL"><b>URL</b> (automatically generated)</label>
        <input id="URL" type="text" />
    </div>

    <br />

    <div class="row3">
        <label for="custom_http_headers"><b>Custom HTTP headers</b></label>
        <textarea id="custom_http_headers"></textarea>
    </div>

    <br />

    <div class="row4">
        <div class="col1">
            <div class="inline">
                <label for="fixture_body"><b>Fixture body</b></label>
                <span id="results_notice"></span>
            </div>
            <textarea id="fixture_body"></textarea>
            <div class="buttons">
                <button id="send_all_fixtures_button">Send all</button>
                <button id="send_fixture_button">Send!</button>
            </div>
        </div>
        <div class="col1">
            <label for="idp-results"><b>Results</b></label>
            <textarea id="idp-results" readonly></textarea>
        </div>
    </div>

</div>

<div class="pad-small"></div>
<input id="csrftoken" type="hidden" value="{{ csrf_token }}" />

{% endblock %}
```

--------------------------------------------------------------------------------

````
