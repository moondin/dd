---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 537
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 537 of 1290)

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

---[FILE: saml.html]---
Location: zulip-main/templates/zerver/config_error/saml.html

```text
{% extends "zerver/config_error/container.html" %}

{% block error_content %}
    <p>
        SAML authentication is either not enabled or misconfigured. Have a look at
        our <a href="https://zulip.readthedocs.io/en/latest/production/authentication-methods.html#SAML">setup guide</a>.
    </p>
    {% if development_environment %}
        <p>
            See also the
            <a href="https://zulip.readthedocs.io/en/latest/development/authentication.html#saml">SAML guide</a>
            for the development environment.
        </p>
    {% endif %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: smtp.html]---
Location: zulip-main/templates/zerver/config_error/smtp.html

```text
{% extends "zerver/config_error/container.html" %}

{% block error_content %}
    <p>
        It appears there are problems with the
        email configuration.
    </p>
    {% if not development_environment %}
        <p>
            See <code>/var/log/zulip/errors.log</code> for more
            details on the error.
        </p>
        <p>
            You may also want to test your email configuration,
            as described in the
            <a href="https://zulip.readthedocs.io/en/latest/production/email.html">Production installation docs</a>.
        </p>
    {% else %}
        <p>
            Please have a look at our
            <a target="_blank" rel="noopener noreferrer" href="https://zulip.readthedocs.io/en/latest/subsystems/email.html#development-and-testing"> setup guide</a>
            for forwarding emails sent in development
            environment to an email account.
        </p>
    {% endif %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: social-container.html]---
Location: zulip-main/templates/zerver/config_error/social-container.html

```text
{% extends "zerver/config_error/container.html" %}

{% block error_content %}
    {% if development  %}
        <p>
            For more information, have a look at the
            <a href="https://zulip.readthedocs.io/en/latest/development/authentication.html#{{ social_backend_name }}">authentication setup guide</a>
            for the development environment.
        </p>
    {% else %}
        <p>
            For more information, have a look at our
            <a href="https://zulip.readthedocs.io/en/latest/production/authentication-methods.html">authentication setup guide</a>
            and the comments in <code>{{ settings_comments_path }}</code>.
        </p>
    {% endif %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: create_demo_realm.html]---
Location: zulip-main/templates/zerver/create_realm/create_demo_realm.html

```text
{% extends "zerver/portico_signup.html" %}

{% block title %}
<title>{{ _("Try Zulip in a demo organization") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="register-account flex full-page">
    <div class="center-block new-style" id="demo-realm-creation">
        <div class="pitch">
            <h1>{{ _("Try Zulip in a demo organization") }}</h1>
            <p>{{ _("No email required.") }}</p>
        </div>
        <form class="white-box" id="create_demo_realm" action="{{ current_url() }}" method="post">
            {{ csrf_input }}
            <input type='hidden' name='timezone' id='demo-creator-timezone'/>
            {% include 'zerver/create_realm/realm_creation_base_form_fields.html' %}
            {% include 'zerver/create_realm/found_zulip_form_field.html' %}
            {% if terms_of_service %}
            {% include 'zerver/create_user/terms_of_service_form_field.html' %}
            {% endif %}
            <div class="input-box" id="demo-submit-button-container">
                <button type="submit" class="new-organization-button register-button">{{ _("Try Zulip") }}</button>
                {% if has_captcha %}
                    {% if form.captcha.errors %}
                        {% for error in form.captcha.errors %}
                        <p class="help-inline text-error">{{ error }}</p>
                        {% endfor %}
                    {% endif %}
                    {{ form.captcha }}
                {% endif %}
            </div>
        </form>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: create_realm.html]---
Location: zulip-main/templates/zerver/create_realm/create_realm.html

```text
{% extends "zerver/portico_signup.html" %}
{# Home page for not logged-in users. #}

{% block title %}
<title>{{ _("Create a new organization") }} | Zulip</title>
{% endblock %}

{# This is where we pitch the app and solicit signups. #}

{% block portico_content %}
<div class="app register-page">
    <div class="app-main register-page-container new-style flex full-page">

        <div class="register-form" id="new-realm-creation">
            <div class="lead">
                <h1 class="get-started">{{ _("Create a new Zulip organization") }}</h1>
            </div>
            <div class="white-box">
                <form class="form-inline" id="create_realm" name="email_form"
                  action="{{ current_url() }}" method="post">
                    {{ csrf_input }}

                    {% include 'zerver/create_realm/realm_creation_base_form_fields.html' %}
                    {% include 'zerver/create_realm/realm_creation_subdomain_form_field.html' %}
                    {% if is_realm_import_enabled %}
                    {% include 'zerver/create_realm/realm_creation_import_form_field.html' %}
                    {% endif %}

                    <div class="input-box horizontal">
                        <div class="inline-block relative">
                            <input type="text" class="email required" placeholder="{{ _("Enter your email address") }}"
                              id="email" name="email" required />
                            <label for="email">{{ _('Your email') }}</label>
                        </div>
                        {% if form.email.errors %}
                        {% for error in form.email.errors %}
                            <div class="alert alert-error">{{ error }}</div>
                        {% endfor %}
                        {% endif %}
                    </div>
                    <div class="input-box" id="altcha-submit-button-container">
                        <button type="submit" class="new-organization-button register-button">{{ _("Create organization") }}</button>
                        {% if has_captcha %}
                            {% if form.captcha.errors %}
                                {% for error in form.captcha.errors %}
                                <p class="help-inline text-error">{{ error }}</p>
                                {% endfor %}
                            {% endif %}
                            {{ form.captcha }}
                        {% endif %}
                    </div>
                </form>
            </div>
            {% if not is_realm_import_enabled %}
            <div class="bottom-text">
                {% trans %}
                Or import
                from <a href="/help/import-from-slack">Slack</a>, <a href="/help/import-from-mattermost">Mattermost</a>,
                or <a href="/help/import-from-rocketchat">Rocket.Chat</a>.
                {% endtrans %}
            </div>
            {% endif %}
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: found_zulip_form_field.html]---
Location: zulip-main/templates/zerver/create_realm/found_zulip_form_field.html

```text
<div class="input-group input-box" id="how-realm-creator-found-zulip">
    <label for="how_realm_creator_found_zulip">
        {{ _('How did you first hear about Zulip?') }}
        {% if not corporate_enabled %}
        <i class="fa fa-question-circle-o" aria-hidden="true" data-tippy-content="{% trans %}This value is used only if you sign up for a plan, in which case it will be sent to the Zulip team.{% endtrans %}"></i>
        {% endif %}
    </label>
    <select name="how_realm_creator_found_zulip" class="required" required>
        <option value="" selected disabled>{{ _('Select an option') }}</option>
        {% for option_id, option_name in how_realm_creator_found_zulip_options %}
        <option value="{{ option_id }}">{{ option_name }}</option>
        {% endfor %}
    </select>
    <input id="how-realm-creator-found-zulip-other" class="how-found-zulip-extra-data-input" type="text" placeholder="{{ _('Please describe') }}" name="how_realm_creator_found_zulip_other_text" maxlength="100"/>
    <input id="how-realm-creator-found-zulip-where-ad" class="how-found-zulip-extra-data-input" type="text" placeholder="{{ _('Where did you see the ad?') }}" name="how_realm_creator_found_zulip_where_ad" maxlength="100"/>
    <input id="how-realm-creator-found-zulip-which-organization" class="how-found-zulip-extra-data-input" type="text" placeholder="{{ _('Which organization?') }}" name="how_realm_creator_found_zulip_which_organization" maxlength="100"/>
    <input id="how-realm-creator-found-zulip-review-site" class="how-found-zulip-extra-data-input" type="text" placeholder="{{ _('Which one?') }}" name="how_realm_creator_found_zulip_review_site" maxlength="100"/>
    <input id="how-realm-creator-found-zulip-which-ai-chatbot" class="how-found-zulip-extra-data-input" type="text" placeholder="{{ _('Which one?') }}" name="how_realm_creator_found_zulip_which_ai_chatbot" maxlength="100"/>
    {% if form.how_realm_creator_found_zulip.errors %}
        {% for error in form.how_realm_creator_found_zulip.errors %}
        <p class="error help-inline alert alert-error">{{ error }}</p>
        {% endfor %}
    {% endif %}
</div>
```

--------------------------------------------------------------------------------

---[FILE: realm_creation_base_form_fields.html]---
Location: zulip-main/templates/zerver/create_realm/realm_creation_base_form_fields.html

```text
<div class="realm-creation-editable-inputs {% if user_registration_form and not form.realm_subdomain.errors %}hide{% endif %}">
    <div class="input-box">
        <div class="inline-block relative">
            <input id="id_team_name" class="required" type="text"
              value="{% if form.realm_name.value() %}{{ form.realm_name.value() }}{% endif %}"
              name="realm_name" maxlength="{{ MAX_REALM_NAME_LENGTH }}" required {% if not user_registration_form %}autofocus{% endif %} />
        </div>
        <label for="id_team_name" class="inline-block label-title">
            {{ _('Organization name') }}
            <a href="/help/create-your-organization-profile" target="_blank" rel="noopener noreferrer">
                <i class="fa fa-question-circle-o" aria-hidden="true"></i>
            </a>
        </label>
        {% if form.realm_name.errors %}
            {% for error in form.realm_name.errors %}
            <p class="help-inline text-error">{{ error }}</p>
            {% endfor %}
        {% endif %}
    </div>

    <div class="input-box">
        <div class="inline-block relative">
            <select name="realm_type" id="realm_type" required>
                <option disabled selected value>-- {{ _("Select one") }} --</option>
                {% for realm_type in sorted_realm_types %}
                    {% if not realm_type.hidden %}
                    <option value="{{ realm_type.id }}" {% if form.realm_type.value() == realm_type.id %}selected{% endif %} >{{ _(realm_type.name) }}</option>
                    {% endif %}
                {% endfor %}
            </select>
        </div>

        <label for="realm_type" class="inline-block label-title">{{ _('Organization type') }}
            <a href="/help/organization-type" target="_blank" rel="noopener noreferrer">
                <i class="fa fa-question-circle-o" aria-hidden="true"></i>
            </a>
        </label>
    </div>

    <div class="input-box">
        <div class="inline-block relative">
            <select name="realm_default_language" id="realm_default_language">
                {% for language in language_list %}
                    <option value="{{ language.code }}" {% if form.realm_default_language.value() == language.code %}selected{% endif %} >{{ _(language.name) }}</option>
                {% endfor %}
            </select>
        </div>

        <label for="realm_default_language" class="inline-block label-title">
            {{ _('Organization language') }}
            <a href="/help/configure-organization-language" target="_blank" rel="noopener noreferrer">
                <i class="fa fa-question-circle-o" aria-hidden="true"></i>
            </a>
        </label>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: realm_creation_import_form_field.html]---
Location: zulip-main/templates/zerver/create_realm/realm_creation_import_form_field.html

```text
<div class="realm-creation-editable-inputs {% if user_registration_form and not form.realm_subdomain.errors %}hide{% endif %}">
    <div class="input-box">
        <div class="inline-block" id="realm-creation-import-from-wrapper">
            <select id="import_from" name="import_from"
              {% if user_registration_form %}
              disabled
              {% endif %}
              >
                {% for key, choice in import_from_choices %}
                    <option value="{{ key }}" {% if key == "none" %}selected{% endif %}>{{ _(choice) }}</option>
                {% endfor %}
            </select>
            {% if not user_registration_form %}
            <p class="extra-info-realm-creation-import-from registration-form-hint">
                {% trans %}
                Learn how to import from
                <a href="/help/import-from-mattermost">Mattermost</a> or
                <a href="/help/import-from-rocketchat">Rocket.Chat</a>.
                {% endtrans %}
            </p>
            {% endif %}
        </div>
        <label for="import_from" class="inline-block">
            {{ _('Import chat history?') }}
        </label>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: realm_creation_subdomain_form_field.html]---
Location: zulip-main/templates/zerver/create_realm/realm_creation_subdomain_form_field.html

```text
<div class="realm-creation-editable-inputs {% if user_registration_form and not form.realm_subdomain.errors %}hide{% endif %}">
    <div class="input-box">
        <label class="static org-url">
            {{ _('Organization URL') }}
        </label>
        {% if root_domain_available %}
        <label class="checkbox static" for="realm_in_root_domain">
            <input type="checkbox" name="realm_in_root_domain" id="realm_in_root_domain"
              {% if not form.realm_subdomain.value() and not form.realm_subdomain.errors %}checked="checked"{% endif %}/>
            <span class="rendered-checkbox"></span>
            {% trans %}Use {{ external_host }}{% endtrans %}
        </label>
        {% endif %}

        <div id="subdomain_section" {% if root_domain_available and
          not form.realm_subdomain.errors and not form.realm_subdomain.value() %}style="display: none;"{% endif %}>
            <div class="or"><span>{{ _('OR') }}</span></div>
            <div class="inline-block relative">
                <input id="id_team_subdomain"
                  class="{% if root_domain_landing_page %}required{% endif %} subdomain" type="text"
                  placeholder="acme"
                  value="{% if form.realm_subdomain.value() %}{{ form.realm_subdomain.value() }}{% endif %}"
                  name="realm_subdomain" maxlength="{{ MAX_REALM_SUBDOMAIN_LENGTH }}"
                  {% if root_domain_landing_page %}required{% endif %} />
                <label for="id_team_subdomain" class="realm_subdomain_label">.{{ external_host }}</label>
                <p id="id_team_subdomain_error_client" class="error help-inline text-error"></p>
            </div>
            {% if form.realm_subdomain.errors %}
                {% for error in form.realm_subdomain.errors %}
                <p class="error help-inline text-error team_subdomain_error_server">{{ error }}</p>
                {% endfor %}
            {% endif %}
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: accounts_home.html]---
Location: zulip-main/templates/zerver/create_user/accounts_home.html

```text
{% extends "zerver/portico_signup.html" %}
{# Home page for not logged-in users. #}

{% block title %}
<title>{{ _("Sign up") }} | Zulip</title>
{% endblock %}

{# This is where we pitch the app and solicit signups. #}

{% block portico_content %}

<!-- The following empty tag has unique data-page-id so that this
page can be easily identified in it's respective JavaScript file -->
<div data-page-id="accounts-home"></div>
<div class="app register-page split-view flex full-page new-style">
    <div class="inline-block">
        <div class="lead">
            <h1 class="get-started">{{ _("Sign up for Zulip") }}</h1>
        </div>
        <div class="app-main register-page-container white-box {% if realm_invite_required and not from_multiuse_invite %}closed-realm{% endif %}">
            <div class="register-form new-style">
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

                    <div class="invite-required">
                        <hr />
                        <i class="fa fa-lock"></i>{{ _("You need an invitation to join this organization.") }}
                    </div>
                </div>
                {% endif %}

                <div class="right-side">
                    {% if no_auth_enabled %}
                        <div class="alert">
                            <p>No authentication backends are enabled on this
                            server yet, so it is impossible to register!</p>

                            <p>
                                See
                                the <a href="https://zulip.readthedocs.io/en/latest/production/install.html#step-3-configure-zulip">Zulip
                                authentication documentation</a> to learn how to
                                configure authentication backends.
                            </p>
                        </div>
                    {% else %}
                        {% if password_auth_enabled %}
                            <form class="form-inline" id="send_confirm" name="email_form"
                              action="{{ current_url() }}" method="post">
                                {{ csrf_input }}

                                <div class="input-box no-validate">
                                    <input type="email" id="email" class="email" name="email" value="" autofocus required />
                                    <label for="email">{{ _('Email') }}</label>
                                    <div class="alert alert-error email-frontend-error"></div>
                                    {% if form.email.errors %}
                                        {% for error in form.email.errors %}
                                        <div class="email-backend-error alert alert-error">{{ error }}</div>
                                        {% endfor %}
                                    {% endif %}
                                </div>

                                <button class="full-width" type="submit">{{ _('Sign up') }}</button>
                            </form>

                            {% if external_authentication_methods|length > 0 %}
                            <div class="or"><span>{{ _('OR') }}</span></div>
                            {% endif %}
                        {% endif %}

                        {% for backend in external_authentication_methods %}
                        <div class="login-social">
                            <form class="form-inline" action="{{ backend.signup_url }}" method="get">
                                <input type='hidden' name='multiuse_object_key' value='{{ multiuse_object_key }}' />
                                <button id="register_auth_button_{{ backend.name }}" class="login-social-button full-width"
                                  {% if backend.display_icon %} style="background-image:url({{ backend.display_icon }})"  {% endif %}>
                                    {{ _('Sign up with %(identity_provider)s', identity_provider=backend.display_name) }}
                                </button>
                            </form>
                        </div>
                        {% endfor %}
                        <div class="register-form-login-redirect actions">
                            {{ _('Already have an account?') }}<a class="register-link" href="/login/"> {{ _('Log in') }}</a>
                        </div>
                    {% endif %}
                </div>
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: change_email_address_visibility_modal.html]---
Location: zulip-main/templates/zerver/create_user/change_email_address_visibility_modal.html

```text
<div class="micromodal" id="change-email-address-visibility-modal" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1">
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="dialog_title">
            <header class="modal__header">
                <h1 class="modal__title dialog_heading">
                    {{ _('Configure email address privacy') }}
                </h1>
                <button class="modal__close" aria-label="{{ _('Close modal') }}" data-micromodal-close></button>
            </header>
            <main class="modal__content">
                <p>
                    {{ _('Zulip lets you control which roles in the organization can view your email address.') }}
                    {{ _('Do you want to change the privacy setting for your email from the default configuration for this organization?') }}
                </p>
                <label for="new_user_email_address_visibility">{{ _('Who can access your email address') }}</label>
                <select id="new_user_email_address_visibility" class="modal_select">
                    {% for value, name in email_address_visibility_options_dict.items() %}
                        <option value="{{ value }}" {% if value == default_email_address_visibility %}selected{% endif %}>{{name}}</option>
                    {% endfor %}
                </select>
                <p>
                    {% trans %}You can also change this setting <a href="{{ root_domain_url }}/help/configure-email-visibility" target="_blank" rel="noopener noreferrer">after you join</a>.{% endtrans %}
                </p>
            </main>
            <footer class="modal__footer">
                <button class="modal__button dialog_exit_button" aria-label="{{ '(Close this dialog window)' }}" data-micromodal-close>{{ _('Cancel') }}</button>
                <button class="modal__button dialog_submit_button">
                    <span>{{ _('Confirm') }}</span>
                </button>
            </footer>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: new_user_email_address_visibility.html]---
Location: zulip-main/templates/zerver/create_user/new_user_email_address_visibility.html

```text
<p id="new-user-email-address-visibility" class="registration-form-hint">
    <input type="hidden" name="email_address_visibility" value="{{ default_email_address_visibility }}" id="email_address_visibility"/>
    <span class="current-selected-option">
        {% if default_email_address_visibility == email_address_visibility_admins_only %}
            {% trans %}Administrators of this Zulip organization will be able to see this email address.
            {% endtrans %}
        {% elif default_email_address_visibility == email_address_visibility_moderators %}
            {% trans %}Administrators and moderators of this Zulip organization will be able to see this email address.
            {% endtrans %}
        {% elif default_email_address_visibility == email_address_visibility_nobody %}
            {% trans %}Nobody in this Zulip organization will be able to see this email address.
            {% endtrans %}
        {% else %}
            {% trans %}Other users in this Zulip organization will be able to see this email address.
            {% endtrans %}
        {% endif %}
    </span>
    <a target="_blank" class="change_email_address_visibility" rel="noopener noreferrer">{{ _('Change') }}</a>
</p>
```

--------------------------------------------------------------------------------

---[FILE: register.html]---
Location: zulip-main/templates/zerver/create_user/register.html

```text
{% extends "zerver/portico_signup.html" %}
{% set entrypoint = "register" %}

{% block title %}
<title>{{ _("Registration") }} | Zulip</title>
{% endblock %}

{#
Gather other user information, after having confirmed
their email address.

Form is validated both client-side using jquery-validation (see signup.js) and server-side.
#}

{% block portico_content %}
<div class="register-account flex full-page">
    <div class="center-block new-style" id="create-account">

        <div class="pitch">
            {% if creating_new_realm %}
            <h1>{{ _('Create your organization') }}</h1>
            {% else %}
            <h1>{{ _('Create your account') }}</h1>
            {% endif %}

            {% trans %}
            <p>Enter your account details to complete registration.</p>
            {% endtrans %}
        </div>

        <form method="post" class="white-box" id="registration" action="{{ url('accounts_register') }}">
            {{ csrf_input }}

            <fieldset class="org-registration">
                {% if creating_new_realm %}
                <legend>{{ _('Your organization') }}
                    {% if not form.realm_subdomain.errors %}
                    <span class="edit-realm-details" role="button" tabindex="0"><i class="fa fa-pencil"></i></span>
                    {% endif %}
                </legend>
                {% with %}
                    {% set user_registration_form = "true" %}
                    {% include 'zerver/create_realm/realm_creation_base_form_fields.html' %}
                    {% include 'zerver/create_realm/realm_creation_subdomain_form_field.html' %}
                    {% if is_realm_import_enabled %}
                    {% include 'zerver/create_realm/realm_creation_import_form_field.html' %}
                    {% endif %}
                {% endwith %}
                {% if not form.realm_subdomain.errors %}
                <div class="not-editable-realm-details">
                    <div class="input-box">
                        <label for="id_realm_name" class="inline-block label-title">{{ _('Organization name') }}</label>
                        <div id="id_realm_name" class="not-editable-realm-field">{{ form.realm_name.value() }}</div>
                    </div>
                    <div class="input-box">
                        <label for="id_realm_type" class="inline-block label-title">{{ _('Organization type') }}</label>
                        <div id="id_realm_type" class="not-editable-realm-field">{{ selected_realm_type_name }}</div>
                    </div>
                    <div class="input-box">
                        <label for="id_realm_default_language" class="inline-block label-title">{{ _('Organization language') }}</label>
                        <div id="id_realm_default_language" class="not-editable-realm-field">{{ selected_realm_default_language_name }}</div>
                    </div>
                    <div class="input-box">
                        <label for="id_realm_subdomain" class="inline-block label-title">{{ _('Organization URL') }}</label>
                        <div id="id_realm_subdomain" class="not-editable-realm-field">{% if form.realm_subdomain.value() %}{{ form.realm_subdomain.value() }}.{% endif %}{{external_host}}</div>
                    </div>
                </div>
                {% endif %}
                {% endif %}
            </fieldset>

            <fieldset class="user-registration">
                {% if creating_new_realm %}
                <legend>{{ _('Your account') }}</legend>
                {% endif %}
                {% if realm_name and not creating_new_realm %}
                <img class="avatar inline-block" src="{{ realm_icon }}" alt="" />
                <div class="info-box inline-block">
                    <div class="organization-name organization-name-delayed-tooltip">{{ realm_name }}</div>
                    <div class="organization-path">{{ realm_url }}</div>
                </div>
                {% endif %}

                <div class="input-box">
                    <input type='hidden' name='key' value='{{ key }}' />
                    <input type='hidden' name='timezone' id='timezone'/>
                    <label for="id_email" class="inline-block label-title">{{ _('Email') }}</label>
                    <div id="id_email">{{ email }}</div>
                    {% if not creating_new_realm %}
                    {% include 'zerver/create_user/new_user_email_address_visibility.html' %}
                    {% endif %}
                </div>

                {% if accounts %}
                <div class="input-box">
                    <div class="inline-block relative">
                        <select class="select" name="source_realm_id" id="source_realm_select">
                            <option value=""
                              {% if "source_realm_id" in form.data and form.data["source_realm_id"] == "" %}selected {% endif %}>
                                {{ _('Don&rsquo;t import settings') }}
                            </option>
                            {% for account in accounts %}
                            <option value="{{ account.realm_id }}" data-full-name="{{account.full_name}}" data-avatar="{{account.avatar}}"
                              {% if ("source_realm_id" in form.data and account.realm_id == form.data["source_realm_id"]|int)
                              or ("source_realm_id" not in form.data and loop.index0 == 0) %} selected {% endif %}>
                                {{ account.realm_name }}
                            </option>
                            {% endfor %}
                        </select>
                    </div>
                    <label for="source_realm_id" class="inline-block">{{ _('Import settings from existing Zulip account') }}
                        <a href="{{ root_domain_url }}/help/import-your-settings"><i class="fa fa-question-circle"></i></a>
                    </label>
                </div>
                {% endif %}

                <div class="input-box" id="full_name_input_section">
                    {% if lock_name %}
                        <p class="fakecontrol">{{ full_name }}</p>
                    {% else %}
                        <input id="id_full_name" class="required" type="text" name="full_name"
                          value="{% if full_name %}{{ full_name }}{% elif form.full_name.value() %}{{ form.full_name.value() }}{% endif %}"
                          maxlength="{{ MAX_NAME_LENGTH }}" placeholder="{% trans %}Your full name{% endtrans %}" required />
                        <label for="id_full_name" class="inline-block label-title">{{ _('Name') }}</label>
                        {% if form.full_name.errors %}
                            {% for error in form.full_name.errors %}
                            <p class="help-inline text-error">{{ error }}</p>
                            {% endfor %}
                        {% endif %}
                    {% endif %}
                    <p class="registration-form-hint">{{ _('This is how your account is displayed in Zulip.') }}</p>
                </div>

                <div class="input-box" id="profile_info_section" style="display:none;">
                    <img id="profile_avatar" />
                    <div id="profile_full_name"></div>
                </div>

                {% if require_ldap_password %}
                <div class="input-box password-div">
                    <input id="ldap-password" class="required" type="password" name="password" autocomplete="off" required />
                    <label for="ldap-password" class="inline-block">{{ _('Password') }}</label>
                    <i class="fa fa-eye-slash password_visibility_toggle" role="button" tabindex="0"></i>
                    <span class="help-inline">
                        {{ _('Enter your LDAP/Active Directory password.') }}
                    </span>
                </div>
                {% elif password_required %}
                <div class="input-box password-div">
                    <input id="id_password" class="required" type="password" name="password" autocomplete="new-password"
                      value="{% if form.password.value() %}{{ form.password.value() }}{% endif %}"
                      data-min-length="{{password_min_length}}"
                      data-max-length="{{ password_max_length }}"
                      data-min-guesses="{{password_min_guesses}}" required />
                    <label for="id_password" class="inline-block">{{ _('Password') }}</label>
                    <i class="fa fa-eye-slash password_visibility_toggle" role="button" tabindex="0"></i>
                    {% if full_name %}
                    <span class="help-inline">
                        {{ _('This is used for mobile applications and other tools that require a password.') }}
                    </span>
                    {% endif %}
                    {% if form.password.errors %}
                        {% for error in form.password.errors %}
                        <p class="help-inline text-error">{{ error }}</p>
                        {% endfor %}
                    {% endif %}
                    <div class="progress" id="pw_strength" title="{{ _('Password strength') }}">
                        <div class="bar bar-danger" style="width: 10%;"></div>
                    </div>
                </div>
                {% endif %}
            </fieldset>
            {% if default_stream_groups %}
            <hr />
            <div class="default-stream-groups">
                <p>{{ _('What are you interested in?') }}</p>
                {% for default_stream_group in default_stream_groups %}
                <div class="input-group">
                    <label for="id_default_stream_group__{{ default_stream_group.id }}"
                      class="inline-block checkbox">
                        <input class="inline-block" type="checkbox"
                          name="default_stream_group"
                          id="id_default_stream_group__{{ default_stream_group.id }}" value="{{ default_stream_group.name }}"
                          {% if "default_stream_group" in form.data and default_stream_group.id in form.data.getlist('default_stream_group') %} checked {% endif %} />
                        <span class="rendered-checkbox"></span>
                        {% set comma = joiner(", ") %}
                        <span class="default_stream_group_name inline-block"
                          title="{{ default_stream_group.description }}">
                            {{ default_stream_group.name }}
                        </span>
                        (
                        {%- for stream in default_stream_group.streams.all() -%}
                            {{- comma() -}} <span class="stream_name inline-block">#{{ stream.name }}</span>
                        {%- endfor -%}
                        )
                    </label>
                </div>
                {% endfor %}
            </div>
            <hr />
            {% endif %}

            {% if creating_new_realm %}
            {% include 'zerver/create_realm/found_zulip_form_field.html' %}
            {% endif %}

            <div class="input-group">
                {% if terms_of_service %}
                {% include 'zerver/create_user/terms_of_service_form_field.html' %}
                {% endif %}
                {% if corporate_enabled %}
                <div class="input-group marketing-emails">
                    <label for="id_enable_marketing_emails" class="inline-block checkbox marketing_emails_checkbox">
                        <input id="id_enable_marketing_emails" type="checkbox" name="enable_marketing_emails"
                          checked="checked" />
                        <span class="rendered-checkbox"></span>
                        {% trans %}Subscribe me to Zulip's low-traffic newsletter (a few emails a year).{% endtrans %}
                    </label>
                </div>
                {% endif %}
                <div class="register-button-box">
                    <button class="register-button" type="submit">
                        <span>{{ _('Sign up') }}</span>
                        <object class="loader" type="image/svg+xml" data="{{ static('images/loading/loader-white.svg') }}"></object>
                    </button>
                    <input type="hidden" name="next" value="{{ next }}" />
                </div>
            </div>
        </form>

    </div>
</div>

{% if not creating_new_realm %}
{% include 'zerver/create_user/change_email_address_visibility_modal.html' %}
{% endif %}

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: terms_of_service_form_field.html]---
Location: zulip-main/templates/zerver/create_user/terms_of_service_form_field.html

```text
<div class="input-group terms-of-service">
    {#
    This is somewhat subtle.
    Checkboxes have a name and value, and when the checkbox is ticked, the form posts
    with name=value. If the checkbox is unticked, the field just isn't present at all.

    This is distinct from 'checked', which determines whether the checkbox appears
    at all. (So, it's not symmetric to the code above.)
    #}
    <label for="id_terms" class="inline-block checkbox">
        <input id="id_terms" class="required" type="checkbox" name="terms"
          {% if form.terms.value() %}checked="checked"{% endif %} />
        <span class="rendered-checkbox"></span>
        {% trans %}I agree to the <a href="{{ root_domain_url }}/policies/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>.{% endtrans %}
    </label>
    {% if form.terms.errors %}
        {% for error in form.terms.errors %}
        <p class="error help-inline alert alert-error">{{ error }}</p>
        {% endfor %}
    {% endif %}
</div>
```

--------------------------------------------------------------------------------

````
