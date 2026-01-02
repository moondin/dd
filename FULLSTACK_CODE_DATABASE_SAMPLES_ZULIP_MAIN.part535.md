---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 535
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 535 of 1290)

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

---[FILE: login.html]---
Location: zulip-main/templates/zerver/login.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "signup" %}

{% block title %}
<title>{{ _("Log in") }} | Zulip</title>
{% endblock %}

{# Login page. #}

{% block portico_content %}

<!-- The following empty tag has unique data-page-id so that this
page can be easily identified in it's respective JavaScript file. -->
<div data-page-id="login-page"></div>
<div class="app login-page split-view new-style flex full-page">
    <div class="inline-block">
        <div class="lead">
            <h1 class="get-started">{{ _("Log in to Zulip") }}</h1>
        </div>

        <div class="app-main login-page-container white-box inline-block">
            {% if realm_name %}
            <div class="left-side">
                <div class="org-header">
                    <img class="avatar" src="{{ realm_icon }}" alt="" />
                    <div class="info-box">
                        <div class="organization-name">{{ realm_name }}</div>
                        <div class="organization-path">{{ realm_url }}</div>
                    </div>
                </div>
                <div class="description">
                    {{ realm_description|safe }}
                </div>
            </div>
            {% endif %}

            <div class="right-side">
                {% if realm_web_public_access_enabled %}
                    <div class="login-social">
                        <form class="anonymous_access_form form-inline" action="/" method="post">
                            {{ csrf_input }}
                            <input type="hidden" name="next" value="{{ next }}" />
                            <button class="full-width">
                                {{ _('View without an account') }}
                            </button>
                        </form>
                    </div>
                    {% if no_auth_enabled %}
                    {% else %}
                    <div class="or"><span>{{ _('OR') }}</span></div>
                    {% endif %}
                {% endif %}
                {% if no_auth_enabled %}
                    <div class="alert">
                        <p>
                            No authentication backends are enabled on this
                            server yet, so it is impossible to log in!
                        </p>

                        <p>
                            See the <a href="https://zulip.readthedocs.io/en/latest/production/install.html#step-3-configure-zulip">
                            Zulip authentication documentation</a> to learn how to configure authentication backends.
                        </p>
                    </div>
                {% else %}

                    {% if already_registered %}
                    <div class="alert">
                        {{ _("You've already registered with this email address. Please log in below.") }}
                    </div>
                    {% endif %}

                    {% if deactivated_account_error %}
                    <div class="alert">
                        {{ deactivated_account_error }}
                    </div>
                    {% endif %}

                    {% if password_auth_enabled %}
                        <form name="login_form" id="login_form" method="post" class="login-form"
                          action="{{ url('login') }}">
                            <input type="hidden" name="next" value="{{ next }}" />

                            {% if two_factor_authentication_enabled %}
                            {{ wizard.management_form }}
                            {% endif %}
                            {{ csrf_input }}

                            {% if not two_factor_authentication_enabled or wizard.steps.current == 'auth' %}
                            <div class="input-box">
                                <input id="id_username" type="{% if not require_email_format_usernames %}text{% else %}email{% endif %}"
                                  name="username" class="{% if require_email_format_usernames %}email {% endif %}required"
                                  {% if email %} value="{{ email }}" {% else %} value="" autofocus {% endif %}
                                  maxlength="72" required />
                                <label for="id_username">
                                    {% if not require_email_format_usernames and email_auth_enabled %}
                                    {{ _('Email or username') }}
                                    {% elif not require_email_format_usernames %}
                                    {{ _('Username') }}
                                    {% else %}
                                    {{ _('Email') }}
                                    {% endif %}
                                </label>
                            </div>

                            <div class="input-box password-div">
                                <input id="id_password" name="password" class="required" type="password" autocomplete="off"
                                  {% if email %} autofocus {% endif %}
                                  required />
                                <label for="id_password">{{ _('Password') }}</label>
                                <i class="fa fa-eye-slash password_visibility_toggle" role="button" tabindex="0"></i>
                            </div>

                            <div class="actions forgot-password-container">
                                {% if email_auth_enabled %}
                                <a class="forgot-password" href="/accounts/password/reset/">{{ _('Forgot your password?') }}</a>
                                {% endif %}
                            </div>

                            {% else %}
                            {% include "two_factor/_wizard_forms.html" %}
                            {% endif %}

                            {% if form.errors %}
                            <div class="alert alert-error">
                                {% for error in form.errors.values() %}
                                <div>{{ error | striptags }}</div>
                                {% endfor %}
                            </div>
                            {% endif %}

                            <button type="submit" name="button" class="full-width">
                                <img class="loader" src="{{ static('images/loading/loader-white.svg') }}" alt="" />
                                <span class="text">{{ _("Log in") }}</span>
                            </button>
                        </form>

                        {% if external_authentication_methods|length > 0 %}
                        <div class="or"><span>{{ _('OR') }}</span></div>
                        {% endif %}

                    {% endif %} <!-- if password_auth_enabled -->

                    {% for backend in external_authentication_methods %}
                    <div class="login-social">
                        <form class="social_login_form form-inline" action="{{ backend.login_url }}" method="get">
                            <input type="hidden" name="next" value="{{ next }}" />
                            <button id="login_auth_button_{{ backend.name }}" class="login-social-button"
                              {% if backend.display_icon %} style="background-image:url({{ backend.display_icon }})"  {% endif %}> {{ _('Log in with %(identity_provider)s', identity_provider=backend.display_name) }}
                            </button>
                        </form>
                    </div>
                    {% endfor %}

                    <div class="actions signup-link-wrapper">
                        {{ _("Don't have an account?")}}
                        {% if not register_link_disabled %}
                        <a class="register-link float-right" href="/register/">{{ _('Sign up') }}</a>
                        {% endif %}
                    </div>
                {% endif %}
            </div>
        </div>

        {% if realm_invite_required %}
        <div class="contact-admin">
            <p class="invite-hint">{{ _("Don't have an account yet? You need to be invited to join this organization.") }}</p>
        </div>
        {% endif %}
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: log_into_subdomain_token_invalid.html]---
Location: zulip-main/templates/zerver/log_into_subdomain_token_invalid.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("Invalid or expired login session") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation new-style">
        <div class="inline-block">
            <div class="app-main white-box">
                <h1>{{ _("Invalid or expired login session.") }}</h1>
                <a href="{{ login_url }}">{{ _("Log in") }}</a>.
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: meta_tags.html]---
Location: zulip-main/templates/zerver/meta_tags.html

```text
<!-- Google / search engine tags -->
{% if REL_CANONICAL_LINK %}
<link rel="canonical" href="{{ REL_CANONICAL_LINK }}" />
{% endif %}
{% if allow_search_engine_indexing %}
    {% if PAGE_DESCRIPTION %}
    <meta name="description" content="{{ PAGE_DESCRIPTION }}" />
    {% endif %}
{% else %}
    <meta name="robots" content="noindex,nofollow" />
{% endif %}

<!-- Open Graph / Facebook / Twitter meta tags -->
<meta property="og:url" content="{{ PAGE_METADATA_URL }}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Zulip" />
{% if PAGE_TITLE %}
<meta property="og:title" content="{{ PAGE_TITLE }}" />
{% endif %}
{% if PAGE_DESCRIPTION %}
<meta property="og:description" content="{{ PAGE_DESCRIPTION }}" />
{% endif %}
{% if PAGE_METADATA_IMAGE %}
<meta property="og:image" content="{{ PAGE_METADATA_IMAGE }}" />
{% else %}
<meta property="og:image" content="{{ static('images/logo/zulip-icon-128x128.png') }}" />
{% endif %}
<meta name="twitter:card" content="summary" />
```

--------------------------------------------------------------------------------

---[FILE: no_spare_licenses.html]---
Location: zulip-main/templates/zerver/no_spare_licenses.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>{{ _("No licenses available") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation new-style">
        <div class="inline-block">
            <div class="get-started">
                <h1>{{ _("Organization cannot accept new members right now") }}</h1>
            </div>
            <div class="white-box">
                <p>
                    {% trans %}New members cannot currently join <a href="{{ realm_url }}">{{ realm_name }}</a> because all Zulip Cloud licenses are in use.{% endtrans %}
                </p>
                <p>
                    {{ _("Please contact the person who invited you and ask them to increase the number of licenses, then try again.") }}
                </p>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: portico-header-dropdown.html]---
Location: zulip-main/templates/zerver/portico-header-dropdown.html

```text
<div class="portico-header-dropdown">
    <div class="portico-header-dropdown-pill">
        <img class="header-realm-icon" src="{{ realm_icon }}" alt="{{ _('Go to Zulip') }}"/>
        <div class="realm-name">{{ realm_name }}<i class="fa fa-chevron-down"></i></div>
    </div>
    <ul>
        <li>
            <a href="/">
                <i class="fa fa-home"></i>
                Go to app
            </a>
        </li>
        <li class="logout">
            <div class="hidden">
                <form id="logout_form" action="/accounts/logout/" method="POST">{{ csrf_input }}
                </form>
            </div>
            <a href="#logout">
                <i class="fa fa-sign-out"></i>
                Log out
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: portico-header.html]---
Location: zulip-main/templates/zerver/portico-header.html

```text
<div class="header portico-header">
    <div class="header-main" id="top_navbar">
        {% if page_is_api_center %}
        <a id="skip-navigation" href="#main-content">{{ _('Skip to main content') }}</a>
        {% endif %}
        <div class="float-left">
            {% if custom_logo_url %}
            <a class="brand logo" href="{{ root_domain_url }}/"><img draggable="false" src="{{ custom_logo_url }}" class="portico-logo" alt="{{ _('Zulip') }}" content="Zulip" /></a>
            {% else %}
            <div class="brand logo">
                <a href="{% if is_self_hosting_management_page %}https://zulip.com/{% else %}{{ root_domain_url }}/{% endif %}">
                    <svg class="brand-logo" role="img" aria-label="{{ _('Zulip') }}" xmlns="http://www.w3.org/2000/svg" viewBox="68.96 55.62 1742.12 450.43" height="25">
                        <path fill="hsl(0, 0%, 27%)" d="M473.09 122.97c0 22.69-10.19 42.85-25.72 55.08L296.61 312.69c-2.8 2.4-6.44-1.47-4.42-4.7l55.3-110.72c1.55-3.1-.46-6.91-3.64-6.91H129.36c-33.22 0-60.4-30.32-60.4-67.37 0-37.06 27.18-67.37 60.4-67.37h283.33c33.22-.02 60.4 30.3 60.4 67.35zM129.36 506.05h283.33c33.22 0 60.4-30.32 60.4-67.37 0-37.06-27.18-67.37-60.4-67.37H198.2c-3.18 0-5.19-3.81-3.64-6.91l55.3-110.72c2.02-3.23-1.62-7.1-4.42-4.7L94.68 383.6c-15.53 12.22-25.72 32.39-25.72 55.08 0 37.05 27.18 67.37 60.4 67.37zm522.5-124.15l124.78-179.6v-1.56H663.52v-48.98h190.09v34.21L731.55 363.24v1.56h124.01v48.98h-203.7V381.9zm338.98-230.14V302.6c0 45.09 17.1 68.03 47.43 68.03 31.1 0 48.2-21.77 48.2-68.03V151.76h59.09V298.7c0 80.86-40.82 119.34-109.24 119.34-66.09 0-104.96-36.54-104.96-120.12V151.76h59.48zm244.91 0h59.48v212.25h104.18v49.76h-163.66V151.76zm297 0v262.01h-59.48V151.76h59.48zm90.18 3.5c18.27-3.11 43.93-5.44 80.08-5.44 36.54 0 62.59 7 80.08 20.99 16.72 13.22 27.99 34.99 27.99 60.64 0 25.66-8.55 47.43-24.1 62.2-20.21 19.05-50.15 27.6-85.13 27.6-7.77 0-14.77-.39-20.21-1.17v93.69h-58.7V155.26zm58.7 118.96c5.05 1.17 11.27 1.55 19.83 1.55 31.49 0 50.92-15.94 50.92-42.76 0-24.1-16.72-38.49-46.26-38.49-12.05 0-20.21 1.17-24.49 2.33v77.37z"/>
                    </svg>
                </a>

                {% if page_is_api_center %}
                <span class="light portico-header-text"> | <a href="{{ root_domain_url }}/api/">{{ doc_root_title }}</a></span>
                {% endif %}
                {% if page_is_policy_center %}
                <span class="light portico-header-text"> | <a href="{{ root_domain_url }}/policies/">{{ doc_root_title }}</a></span>
                {% endif %}
                {% if page_is_showroom %}
                <span class="light portico-header-text"> | <a href="{{ root_domain_url }}/devtools/{{ showroom_component }}">{{ doc_root_title }}</a></span>
                {% endif %}
            </div>
            {% endif %}
        </div>

        <div class="float-right top-links">
            {% if user_is_authenticated %}
                {% include 'zerver/portico-header-dropdown.html' %}
            {% else %}
                {% if not only_sso %}
                {% if is_self_hosting_management_page %}
                {% else %}
                <a href="{{login_url}}">{{ _('Log in') }}</a>
                {% endif %}
                {% endif %}
            {% endif %}

            {% if register_link_disabled %}
            {% elif only_sso %}
                <a href="{{ url('login-sso') }}">{{ _('Log in') }}</a>
            {% else %}
                {% if user_is_authenticated %}
                {% else %}
                <a href="{{ url('register') }}">{{ _('Sign up') }}</a>
                {% endif %}
            {% endif %}

            {% if not is_self_hosting_management_page and non_realm_specific_page %}
            <a href="{{ root_domain_url }}/new/">{{ _('New organization') }}</a>
            {% endif %}
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: portico-help.html]---
Location: zulip-main/templates/zerver/portico-help.html

```text
{% extends "zerver/portico.html" %}

{% block content %}
<div class="portico-container help">
    <div class="portico-wrap">
        {% include 'zerver/portico-header.html' %}
        <div class="app portico-page">
            <div class="app-main portico-page-container{% block hello_page_container %}{% endblock %}">
                {% block portico_content %}
                {% endblock %}
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: portico.html]---
Location: zulip-main/templates/zerver/portico.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = entrypoint|default("portico") %}

{# A base template for stuff like login, register, etc.

Not inside the app itself, but covered by the same structure,
hence the name.
#}

{% block content %}
<div class="portico-container" data-platform="{{ platform }}">
    <div class="portico-wrap">
        {% if not isolated_page %}
        {% include 'zerver/portico-header.html' %}
        {% endif %}
        <div class="app portico-page {% block portico_class_name %}{% endblock %}">
            <div class="app-main portico-page-container{% block hello_page_container %}{% endblock %}">
                {% block portico_content %}
                {% endblock %}
            </div>
        </div>
    </div>
    <div class="blueslip-error-container"></div>
    {% if not isolated_page and not skip_footer %}
    {% include 'zerver/footer.html' %}
    {% endif %}
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: portico_signup.html]---
Location: zulip-main/templates/zerver/portico_signup.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = entrypoint|default("signup") %}

{# Portico page with signup code #}
```

--------------------------------------------------------------------------------

---[FILE: realm_import_post_process.html]---
Location: zulip-main/templates/zerver/realm_import_post_process.html

```text
{% extends "zerver/portico_signup.html" %}
{% set entrypoint = "register" %}

{% block title %}
<title>{{ _("Finalize organization import") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app register-page">
    <div class="app-main register-page-container new-style flex full-page center">
        <div class="register-form left" id="realm-import-post-process">
            <div class="lead">
                <h1 class="get-started">{{ _("Organization import completed!") }}</h1>
            </div>
            <div class="white-box">
                <form method="post" class="form-inline" action="{{ url('realm_import_post_process', args=[key]) }}">
                    {{ csrf_input }}
                    <div class="input-box no-validation">
                        <input type='hidden' name='key' value='{{ key }}' />
                    </div>
                    <div class="input-box slack-import-extra-info">
                        <div class="not-editable-realm-field">
                            {% trans %}
                            No account in the imported data matched the email address you've verified with Zulip
                            (<strong>{{ verified_email }}</strong>).
                            Select an account to associate your email address with.
                            {% endtrans %}
                        </div>
                    </div>
                    <div class="input-box">
                        <label for="email" class="inline-block label-title">{{ _("Select your account") }}</label>
                        <select id="realm-import-owner" name="user_id" class="required">
                            <option selected value="">
                                {{ _("Create new account") }}
                            </option>
                            {% for user in users %}
                                <option value="{{ user.id }}">
                                    {{ user.full_name }} ({{user.delivery_email}})
                                </option>
                            {% endfor %}
                        </select>
                    </div>
                    <div class="input-box">
                        <button type="submit" class="register-button">
                            {{ _("Confirm") }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: realm_reactivation.html]---
Location: zulip-main/templates/zerver/realm_reactivation.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("Organization successfully reactivated") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation new-style">
        <div class="inline-block">

            <div class="get-started">
                <h1>{{ _("Your organization has been successfully reactivated.") }}</h1>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: realm_reactivation_link_error.html]---
Location: zulip-main/templates/zerver/realm_reactivation_link_error.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("Organization reactivation link expired or invalid") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation new-style">
        <div class="inline-block">

            <div class="get-started">
                <h1>{{ _("The organization reactivation link has expired or is not valid.") }}</h1>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: realm_redirect.html]---
Location: zulip-main/templates/zerver/realm_redirect.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>{{ _("Log in to your organization") }} | Zulip</title>
{% endblock %}

{% block portico_content %}

<div class="app goto-account-page flex full-page">
    <div class="inline-block new-style">
        <div class="lead">
            <h1 class="get-started">{{ _("Log in to your organization") }}</h1>
        </div>

        <div class="app-main goto-account-page-container white-box">
            <div class="realm-redirect-form">
                <form class="form-inline" name="realm_redirect_form"
                  action="/accounts/go/{% if request.GET %}?{{ request.GET.urlencode() }}{% endif %}" method="post">
                    {{ csrf_input }}
                    <div class="input-box horizontal">
                        <div class="inline-block relative">
                            <p id="realm_redirect_description">{{ _("Organization URL") }}</p>
                            <input
                              type="text" value="{% if form.subdomain.value() %}{{ form.subdomain.value() }}{% endif %}"
                              placeholder="{{ _('your-organization') }}" autofocus id="realm_redirect_subdomain" name="subdomain"
                              autocomplete="off"/>
                            <span id="realm_redirect_external_host">.{{external_host}}</span>
                        </div>
                        <div id="errors">
                            {% if form.subdomain.errors %}
                                {% for error in form.subdomain.errors %}
                                <div class="alert alert-error">{{ error }}</div>
                                {% endfor %}
                            {% endif %}
                        </div>
                        <p class="bottom-text left-text">
                            {{ _("Don't know your organization URL?") }}
                            <a target="_blank" rel="noopener noreferrer" href="/accounts/find/">{{ _("Find your organization.") }}</a>
                        </p>
                        <button id="enter-realm-button" type="submit">{{ _('Next') }}</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="bottom-text">
            {% trans org_creation_link="/new/" %}
            <a target="_blank" rel="noopener noreferrer" href="{{ org_creation_link }}">Create a new organization</a> if you don't have one yet.
            {% endtrans %}
        </div>
        <div class="bottom-text self-hosting-login-help-text">
            {{ _("Self-hosting Zulip?") }}
            {% trans self_hosted_login_help="https://zulip.com/help/self-hosted-billing#log-in-to-billing-management" %}
            You can <a target="_blank" rel="noopener noreferrer" href="{{ self_hosted_login_help }}">log in to manage plans and billing.</a>
            {% endtrans %}
        </div>
    </div>

</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: reset.html]---
Location: zulip-main/templates/zerver/reset.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("Reset your password") }} | Zulip</title>
{% endblock %}

{% block portico_content %}

<div class="flex new-style app portico-page">
    <div class="inline-block">
        <div class="lead">
            <h1 class="get-started">{{ _('Reset your password') }}</h1>
        </div>

        <div class="app-main forgot-password-container white-box new-style">

            <p>{{ _("Forgot your password? No problem, we'll send a link to reset your password to the email you signed up with.") }}</p>

            <form method="post" action="{{ url('password_reset') }}">
                {{ csrf_input }}
                <div class="new-style">
                    <div class="input-box horizontal">
                        <div class="inline-block relative">
                            <label for="id_email" class="">{{ _('Email') }}</label>
                            <input id="id_email" class="required" type="text" name="email"
                              value="{% if form.email.value() %}{{ form.email.value() }}{% endif %}"
                              maxlength="100" placeholder="{{ _("Enter your email address") }}" autofocus required />
                            {% if form.email.errors %}
                                {% for error in form.email.errors %}
                                <div class="alert alert-error">{{ error }}</div>
                                {% endfor %}
                            {% endif %}
                        </div>
                        <button type="submit">{{ _('Send reset link') }}</button>

                    </div>
                </div>
            </form>
            {% include 'zerver/include/back_to_login_component.html' %}
        </div>
    </div>
</div>


{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: reset_confirm.html]---
Location: zulip-main/templates/zerver/reset_confirm.html

```text
{% extends "zerver/portico_signup.html" %}
{% set entrypoint = "register" %}

{% block title %}
<title>{{ _("Set a new password") }} | Zulip</title>
{% endblock %}

{% block portico_content %}

<div class="password-container flex full-page new-style">

    <!-- wrapper for flex content -->
    <div>
        <div class="get-started">
            <h1>{{ _('Set a new password.') }}</h1>
        </div>
        <div class="password-reset white-box">
            <!-- TODO: Ask about meta viewport 1:1 scaling -->

            {% if validlink %}
            <form method="post" id="password_reset" autocomplete="off">
                {{ csrf_input }}
                <div class="input-box" id="email-section">
                    <label for="id_email">{{ _("Email") }}</label>
                    <div>
                        <input type="text" name="name" placeholder='{{ form.user.delivery_email }}' disabled />
                    </div>
                </div>

                <div class="input-box password-div">
                    <label for="id_new_password1" class="">{{ _('Password') }}</label>
                    <input id="id_new_password1" class="required" type="password" name="new_password1" autocomplete="new-password"
                      value="{% if form.new_password1.value() %}{{ form.new_password1.value() }}{% endif %}"
                      data-max-length="{{ password_max_length }}"
                      data-min-length="{{password_min_length}}"
                      data-min-guesses="{{password_min_guesses}}" autofocus required />
                    <i class="fa fa-eye-slash password_visibility_toggle" role="button" tabindex="0"></i>
                    {% if form.new_password1.errors %}
                        {% for error in form.new_password1.errors %}
                        <div class="alert alert-error">{{ error }}</div>
                        {% endfor %}
                    {% endif %}
                </div>
                <div class="input-box">
                    <div class="">
                        <div class="progress" id="pw_strength">
                            <div class="bar bar-danger" style="width: 10%;"></div>
                        </div>
                    </div>
                </div>
                <div class="input-box password-div">
                    <label for="id_new_password2" class="">{{ _('Confirm password') }}</label>
                    <input id="id_new_password2" class="required" type="password" name="new_password2" autocomplete="off"
                      value="{% if form.new_password2.value() %}{{ form.new_password2.value() }}{% endif %}"
                      maxlength="100" required />
                    <i class="fa fa-eye-slash password_visibility_toggle" role="button" tabindex="0"></i>
                    {% if form.new_password2.errors %}
                        {% for error in form.new_password2.errors %}
                        <div class="alert alert-error">{{ error }}</div>
                        {% endfor %}
                    {% endif %}
                </div>

                <div class="input-box m-t-30">
                    <div class="centered-button">
                        <button type="submit" class="" value="Submit">Submit</button>
                    </div>
                </div>
            </form>

            {% else %}
            <p>{{ _('Sorry, the link you provided is invalid or has already been used.') }}</p>
            {% endif %}
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: reset_done.html]---
Location: zulip-main/templates/zerver/reset_done.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("New password successfully set") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation new-style">
        <div class="inline-block">

            <div class="get-started">
                <h1>{{ _("You've set a new password!") }}</h1>
            </div>

            <div class="white-box">
                <p>{% trans login_url=url('login') %}Please <a href="{{ login_url }}">log in</a> with your new password.{% endtrans %}</p>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: reset_emailed.html]---
Location: zulip-main/templates/zerver/reset_emailed.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("Password reset email sent") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation new-style">
        <div class="inline-block">

            <div class="get-started">
                <h1>{{ _("Password reset sent!") }}</h1>
            </div>

            <div class="white-box">
                <p>{{ _('Check your email in a few minutes to finish the process.') }}</p>
                {% include 'zerver/dev_env_email_access_details.html' %}
                {% include 'zerver/include/back_to_login_component.html' %}
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

````
