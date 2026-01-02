---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 534
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 534 of 1290)

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

---[FILE: footer.html]---
Location: zulip-main/templates/zerver/footer.html

```text
<footer id="footer">
    {% if corporate_enabled %}
    <div class='footer__container'>
        <div class="footer__section">
            <h3 class="footer__section-title">
                {{ _("Product") }}
            </h3>
            <ul>
                <li><a href="/why-zulip/">{{ _("Why Zulip") }}</a></li>
                <li><a href="/features/">{{ _("Features") }}</a></li>
                <li><a href="/plans/">{{ _("Plans & pricing") }}</a></li>
                <li><a href="/zulip-cloud/">{{ _("Zulip Cloud") }}</a></li>
                <li><a href="/self-hosting/">{{ _("Self-hosting") }}</a></li>
                <li><a href="/security/">{{ _("Security") }}</a></li>
                <li><a href="/integrations/">{{ _("Integrations") }}</a></li>
                <li class="extra_margin"><a href="/apps/">{{ _("Desktop & mobile apps") }}</a></li>
                <li><a href="/new/">{{ _("New organization") }}</a></li>
                <li><a href="/accounts/go/">{{ _("Log in") }}</a></li>
                <li><a href="/accounts/find/">{{ _("Find accounts") }}</a></li>
            </ul>
        </div>
        <div class="footer__section">
            <h3 class="footer__section-title">
                {{ _("Solutions") }}
            </h3>
            <ul>
                <li><a href="/for/business/">{{ _("Business") }}</a></li>
                <li><a href="/for/education/">{{ _("Education") }}</a></li>
                <li><a href="/for/research/">{{ _("Research") }}</a></li>
                <li><a href="/for/events/">{{ _("Events & conferences") }}</a></li>
                <li><a href="/for/open-source/">{{ _("Open source projects") }}</a></li>
                <li class="extra_margin"><a href="/for/communities/">{{ _("Communities") }}</a></li>
                <li><a href="/use-cases/">{{ _("Customer stories") }}</a></li>
                <li><a href="/communities/">{{ _("Open communities") }}</a></li>
            </ul>
        </div>
        <div class="footer__section">
            <h3 class="footer__section-title">
                {{ _("Resources") }}
            </h3>
            <ul>
                <li><a href="/help/getting-started-with-zulip">{{ _("Getting started") }}</a></li>
                <li><a href="/help/">{{ _("Help center") }}</a></li>
                <li><a href="/development-community/" target="_blank">{{ _("Community chat") }}</a></li>
                <li><a href="/help/contact-support">{{ _("Contact support") }}</a></li>
                <li><a href="/request-demo/">{{ _("Get a demo") }}</a></li>
                <li><a href="/partners/">{{ _("Partners") }}</a></li>
                <li class="extra_margin"><a href="https://status.zulip.com/">{{ _("Zulip Cloud status") }}</a></li>
                <li>
                    <a href="/help/moving-to-zulip">
                        {{ _("Moving to Zulip") }}
                    </a>
                </li>
                <li>
                    <a href="https://zulip.readthedocs.io/en/stable/production/install.html">
                        {{ _("Installing a Zulip server") }}
                    </a>
                </li>
                <li>
                    <a href="https://zulip.readthedocs.io/en/stable/production/upgrade.html">
                        {{ _("Upgrading a Zulip server") }}
                    </a>
                </li>
            </ul>
        </div>
        <div class="footer__section">
            <h3 class="footer__section-title">
                {{ _("Contributing") }}
            </h3>
            <ul>
                <li>
                    <a href="https://zulip.readthedocs.io/en/latest/contributing/contributing.html">
                        {{ _("Contributing guide") }}
                    </a>
                </li>
                <li><a href="/development-community/">{{ _("Development community") }}</a></li>
                <li>
                    <a href="https://zulip.readthedocs.io/en/latest/translating/translating.html">
                        {{ _("Translation") }}
                    </a>
                </li>
                <li><a href="/api/">API</a></li>
                <li><a href="https://github.com/zulip/zulip/">{{ _("GitHub") }}</a></li>
            </ul>
        </div>
        <div class="footer__section">
            <h3 class="footer__section-title">
                {{ _("About us") }}
            </h3>
            <ul>
                <li>
                    <a href="/team/">{{ _("Team") }}</a>
                    &
                    <a href="/history/">{{ _("History") }}</a>
                </li>
                <li><a href="/values/">{{ _("Values") }}</a></li>
                <li><a href="/jobs/">{{ _("Jobs") }}</a></li>
                <li><a href="https://blog.zulip.com/"  target="_blank">{{ _("Blog") }}</a></li>
                <li><a href="https://zulip.com/help/support-zulip-project">{{ _("Support Zulip") }}</a></li>
            </ul>
            <div class="footer-social-links">
                <a class="footer-social-icon footer-social-icon-x" title="{{ _('X (Twitter)') }}" href="https://twitter.com/zulip" target="_blank" rel="noopener noreferrer"></a>
                <a class="footer-social-icon footer-social-icon-mastodon" title="{{ _('Mastodon') }}" href="https://fosstodon.org/@zulip" target="_blank" rel="noopener noreferrer"></a>
                <a class="footer-social-icon footer-social-icon-linkedin" title="{{ _('LinkedIn') }}" href="https://www.linkedin.com/company/zulip-by-kandra-labs/" target="_blank" rel="noopener noreferrer"></a>
            </div>
        </div>
    </div>
    {% endif %}
    <div class="footer__legal {% if not corporate_enabled %}footer__legal_not_corporate{% endif %}">
        <div class="footer__legal-container">
            {% if corporate_enabled %}
            <div class="copyright">© Kandra Labs, Inc. (“Zulip”)</div>
            {% else %}
            <div class="copyright">{% trans %}Powered by <a href="https://zulip.com">Zulip</a>{% endtrans %}</div>
            {% endif %}
            <div class="footer__legal-spacer"></div>
            {% if not corporate_enabled %}
            <a href="/help/">{{ _("Help center") }}</a>
            {% endif %}
            <a href="{{ root_domain_url }}/policies/terms">{{ _("Terms of Service") }}</a>
            <a href="{{ root_domain_url }}/policies/privacy">{{ _("Privacy policy") }}</a>
            {% if corporate_enabled %}
            <a href="https://zulip.com/attribution/">{{ _("Website attributions") }}</a>
            {% endif %}
        </div>
    </div>
</footer>
```

--------------------------------------------------------------------------------

---[FILE: gradients.html]---
Location: zulip-main/templates/zerver/gradients.html

```text
<div class="gradients">
    <div class="gradient pattern"></div>
    <div class="gradient sunburst"></div>
    <div class="gradient dark-blue"></div>
    <div class="gradient green"></div>
    <div class="gradient blue"></div>
    <div class="gradient white-fade"></div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: invalid_email.html]---
Location: zulip-main/templates/zerver/invalid_email.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>{{ _("Invalid email") }} | Zulip</title>
{% endblock %}

{% block portico_content %}
<div class="app portico-page">
    <div class="app-main portico-page-container center-block flex full-page account-creation new-style">
        <div class="inline-block">
            <div class="get-started">
                {% if invalid_email %}
                <h1>{{ _("Invalid email") }}</h1>
                {% else %}
                <h1>{{ _("Email not allowed") }}</h1>
                {% endif %}
            </div>
            <div class="white-box">
                <p>
                    {% if invalid_email %}
                        {{ _("The email address you are trying to sign up with is not valid.") }}
                    {% endif %}
                    {% if closed_domain %}
                        {% trans %}The organization you are trying to join, <a href="{{ realm_url }}">{{ realm_name }}</a>, does not allow signups using emails with your email domain.{% endtrans %}
                    {% endif %}
                    {% if disposable_emails_not_allowed %}
                        {% trans %}The organization you are trying to join, <a href="{{ realm_url }}">{{ realm_name }}</a>, does not allow signups using disposable email addresses.{% endtrans %}
                    {% endif %}
                    {% if email_contains_plus %}
                        {% trans %}The organization you are trying to join, <a href="{{ realm_url }}">{{ realm_name }}</a>, does not allow signups using emails that contain "+".{% endtrans %}
                    {% endif %}
                    {% if invalid_email %}
                    {{ _("Please sign up using a valid email address.") }}
                    {% else %}
                    {{ _("Please sign up using an allowed email address.") }}
                    {% endif %}
                </p>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: invalid_realm.html]---
Location: zulip-main/templates/zerver/invalid_realm.html

```text
{% extends "zerver/portico.html" %}

{% block title %}
<title>{{ _("No organization found") }} | Zulip</title>
{% endblock %}

{% block portico_content %}

<div class="app find-account-page flex full-page account-creation">
    <div class="inline-block new-style">
        <div class="lead">
            <h1 class="get-started">{{ _('No organization found') }}</h1>
        </div>

        <div class="app-main find-account-page-container white-box">
            <p>
                {% trans %}There is no Zulip organization at <b>{{ current_url }}</b>.{% endtrans %}
            </p>
            <p>
                {% if corporate_enabled %}
                    {% trans %}Please try a different URL, <a href="{{ root_domain_url }}/accounts/find/">get a list of your Zulip Cloud accounts</a>, or <a href="mailto:{{ support_email }}">contact Zulip support</a>.{% endtrans %}
                {% else %}
                    {% trans %}Please try a different URL, <a href="{{ root_domain_url }}/accounts/find/">get a list of your accounts</a> on this server, or <a href="mailto:{{ support_email }}">contact this Zulip server's administrators</a>.{% endtrans %}
                {% endif %}
            </p>
            {% if is_selfhosting_management_error_page %}
            <p>
                {% trans %}<a href="{{ current_url }}/serverlogin/">Click here</a> to access plan management for your Zulip server.{% endtrans %}
            </p>
            {% endif %}
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: landing_nav.html]---
Location: zulip-main/templates/zerver/landing_nav.html

```text
{% if not isolated_page %}
    {% if landing_page_navbar_message %}
    <div id="navbar-custom-message">
        {{ landing_page_navbar_message |safe }}
    </div>
    {% endif %}
{% endif %}

{% if not isolated_page %}
<!-- We have separate copies of the navbar list for web and mobile. Please update both the versions when making changes. -->
<nav class="top-menu">
    <div class="top-menu-container">
        <a class="top-menu-logo nav-zulip-logo" href="https://zulip.com" tabindex="1"></a>
        <div class='top-menu-items-group-1'>
            <div class='top-menu-item top-menu-tab'>
                <div class="top-menu-tab-unselect"></div>
                <input type="radio" name="top-menu-tabs" class="top-menu-tab-input" id="top-menu-tab-product" />
                <label for="top-menu-tab-product" class="nav-menu-label" tabindex="0">Product</label>
                <div class="top-menu-submenu">
                    <div class="top-menu-submenu-column">
                        <span class="top-menu-submenu-section">OVERVIEW</span>
                        <ul class="top-menu-submenu-list">
                            <li class="top-menu-submenu-list-item"><a
                            href="https://blog.zulip.com/2024/11/04/choosing-a-team-chat-app/">Choosing a team chat app</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/why-zulip/">Why Zulip</a></li>
                            <li class="top-menu-submenu-list-item"><a href="{{ 'https://chat.zulip.org' if not development_environment}}/?show_try_zulip_modal">Try Zulip</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/help/moving-to-zulip">Moving to Zulip</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/zulip-cloud/">Zulip Cloud</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/self-hosting/">Self-hosting</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/security/">Security</a></li>
                        </ul>
                    </div>
                    <div class="top-menu-submenu-column">
                        <span class="top-menu-submenu-section">FEATURES</span>
                        <ul class="top-menu-submenu-list">
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/features/">Feature matrix</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/apps/">Desktop and mobile apps</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/integrations/">Integrations</a></li>
                            <li class="top-menu-submenu-list-item"><a href="/api/">API</a></li>
                            <li class="top-menu-submenu-list-item"><a href="/help/">Help center</a></li>
                        </ul>
                    </div>
                    <div class="top-menu-submenu-column">
                        <span class="top-menu-submenu-section">USE CASES</span>
                        <ul class="top-menu-submenu-list">
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/business/">Business</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/education/">Education</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/research/">Research</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/events/">Events and conferences</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/open-source/">Open source projects</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/communities/">Communities</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class='top-menu-item top-menu-tab'>
                <div class="top-menu-tab-unselect"></div>
                <input type="radio" name="top-menu-tabs" class="top-menu-tab-input" id="top-menu-tab-case-studies"/>
                <label for="top-menu-tab-case-studies" class="nav-menu-label" tabindex="0">Case studies</label>
                <div class="top-menu-submenu" id="case-studies-submenu">
                    <div class="top-menu-submenu-column">
                        <span class="top-menu-submenu-section">BUSINESS</span>
                        <ul class="top-menu-submenu-list">
                            <li class="top-menu-submenu-list-item">
                                <a href="https://zulip.com/case-studies/idrift/">
                                Efficient distributed team management at iDrift AS
                                </a>
                            </li>
                            <li class="top-menu-submenu-list-item">
                                <a href="https://zulip.com/case-studies/gut-contact/">
                                Easy communication for 1000 agents at GUT contact
                                </a>
                            </li>
                            <li class="top-menu-submenu-list-item">
                                <a href="https://zulip.com/case-studies/end-point/">
                                Managing hundreds of projects at End Point Dev
                                </a>
                            </li>
                            <li class="top-menu-submenu-list-item">
                                <a href="/case-studies/windborne/">
                                Worldwide operations and AI at WindBorne
                                </a>
                            </li>
                            <li class="top-menu-submenu-list-item">
                                <a href="https://zulip.com/case-studies/semsee/">
                                More efficient communication than Slack at Semsee
                                </a>
                            </li>
                            <li class="top-menu-submenu-list-item">
                                <a href="https://zulip.com/case-studies/atolio/">
                                Open distributed communication at Atolio
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="top-menu-submenu-column" id="education-and-research-submenu-column">
                        <span class="top-menu-submenu-section">EDUCATION and RESEARCH</span>
                        <ul class="top-menu-submenu-list">
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/tum/">Organized chat for 1000s of students at TUM</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/ucsd/">Communication hub across 6 continents at UCSD</a></li>
                            <li class="top-menu-submenu-list-item"><a href="/case-studies/university-of-cordoba/">Connecting across generations at the National University of Córdoba</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/lean/">Research collaboration at scale in the Lean mathematical community</a></li>
                        </ul>
                    </div>
                    <div class="top-menu-submenu-column" id="one-source-and-communities-submenu-column">
                        <span class="top-menu-submenu-section">OPEN SOURCE and COMMUNITIES</span>
                        <ul class="top-menu-submenu-list">
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/asciidoctor/">Inclusive discussion in the open-source Asciidoctor community</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/rust/">Faster decision-making in the Rust language community</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/recurse-center/">Platform for a worldwide community since 2013 at Recurse Center</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/rush-stack/">Professional community support at Rush Stack</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/communities/">Open communities directory</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class='top-menu-item top-menu-tab'>
                <div class="top-menu-tab-unselect"></div>
                <input type="radio" name="top-menu-tabs" class="top-menu-tab-input" id="top-menu-tab-resources" />
                <label for="top-menu-tab-resources" class="nav-menu-label" tabindex="0">Resources</label>
                <div class="top-menu-submenu">
                    <div class="top-menu-submenu-column">
                        <span class="top-menu-submenu-section">FOR USERS</span>
                        <ul class="top-menu-submenu-list">
                            <li class="top-menu-submenu-list-item"><a href="/help/getting-started-with-zulip">Getting started</a></li>
                            <li class="top-menu-submenu-list-item"><a href="/help/">Help center</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/development-community/" target="_blank" rel="noopener noreferrer">Community chat</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.com/help/contact-support">Contact support</a></li>
                        </ul>
                    </div>
                    <div class="top-menu-submenu-column">
                        <span class="top-menu-submenu-section">FOR ADMINISTRATORS</span>
                        <ul class="top-menu-submenu-list">
                            <li class="top-menu-submenu-list-item"><a href="/help/moving-to-zulip">Moving to Zulip</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.readthedocs.io/en/stable/production/install.html">Installing a Zulip server</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://zulip.readthedocs.io/en/stable/production/upgrade.html">Upgrading a Zulip server</a></li>
                            <li class="top-menu-submenu-list-item"><a href="https://github.com/zulip/zulip" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <a class='top-menu-item' href="https://zulip.com/plans/">Pricing</a>
            <a class='top-menu-item' href="https://zulip.com/apps/">Download</a>
        </div>
        <div class='top-menu-item-spacer'></div>
        <div class='top-menu-items-group-2'>
            <a class='top-menu-item' href="/new/">New organization</a>
            {% if user_is_authenticated %}
            <div class='top-menu-item top-menu-tab'>
                <div class="top-menu-tab-unselect"></div>
                <input type="radio" name="top-menu-tabs" class="top-menu-tab-input" id="top-menu-tab-user" />
                <label class="top-menu-tab-user-label nav-menu-label" for="top-menu-tab-user" tabindex="0">
                    <img class="top-menu-tab-user-img" src="{{ realm_icon }}" />
                    <span class="top-menu-tab-user-name">{{ realm_name }}</span>
                </label>
                <div class="top-menu-submenu signup-column">
                    <div class="top-menu-submenu-column">
                        <ul class="top-menu-submenu-list">
                            <li class="top-menu-submenu-list-item">
                                <a href="/">Go to app</a>
                            </li>
                            <li class="top-menu-submenu-list-item">
                                <a class="logout_button">
                                Log out
                                </a>
                            </li>
                        </ul>
                        <div class="hidden">
                            <form id="logout_form" action="/accounts/logout/" method="POST">{{ csrf_input }}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {% else %}
            <a class='top-menu-item' href="/login/">Log in</a>
            {% if register_link_disabled %}
            {% else %}
            <a class='top-menu-item' href="/register/">Sign up</a>
            {% endif %}
            {% endif %}
        </div>
    </div>
    <input type="radio" name="top-menu-tabs" class="top-menu-tab-input-unselect" id="top-menu-tab-close" checked />
    <div id='top-menu-submenu-backdrop' class="top-menu-submenu-backdrop"></div>
    <label class="top-menu-tab-label-unselect nav-menu-label" for="top-menu-tab-close" tabindex="0"></label>
</nav>
<!-- We have separate copies of the navbar list for web and mobile. Please update both the versions when making changes. -->
<details class="top-menu-mobile">
    <summary class="top-menu-mobile-summary">
        <a class="top-menu-logo nav-zulip-logo" href="https://zulip.com"></a>
    </summary>
    <div class="top-menu-mobile-items-group-1">
        <details>
            <summary class="top-menu-mobile-item-summary">Product</summary>
            <div class="top-menu-mobile-submenu">
                <span class="top-menu-mobile-submenu-section">OVERVIEW</span>
                <ul class="top-menu-submenu-list">
                    <li class="top-menu-submenu-list-item"><a href="https://blog.zulip.com/2024/11/04/choosing-a-team-chat-app/">Choosing a team chat app</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/why-zulip/">Why Zulip</a></li>
                    <li class="top-menu-submenu-list-item"><a href="{{ 'https://chat.zulip.org' if not development_environment}}/?show_try_zulip_modal">Try Zulip</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/help/moving-to-zulip">Moving to Zulip</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/self-hosting/">Self-hosting</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/security/">Security</a></li>
                </ul>
            </div>
            <div class="top-menu-mobile-submenu">
                <span class="top-menu-mobile-submenu-section">FEATURES</span>
                <ul class="top-menu-submenu-list">
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/features/">Feature matrix</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/apps/">Desktop and mobile apps</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/integrations/">Integrations</a></li>
                    <li class="top-menu-submenu-list-item"><a href="/api/">API</a></li>
                    <li class="top-menu-submenu-list-item"><a href="/help/">Help center</a></li>
                </ul>
            </div>
            <div class="top-menu-mobile-submenu">
                <span class="top-menu-mobile-submenu-section">USE CASES</span>
                <ul class="top-menu-submenu-list">
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/business/">Business</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/education/">Education</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/research/">Research</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/events/">Events and conferences</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/open-source/">Open source projects</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/for/communities/">Communities</a></li>
                </ul>
            </div>
        </details>
        <details>
            <summary class="top-menu-mobile-item-summary">Case Studies</summary>
            <div class="top-menu-mobile-submenu">
                <span class="top-menu-mobile-submenu-section">BUSINESS</span>
                <ul class="top-menu-submenu-list">
                    <li class="top-menu-submenu-list-item">
                        <a href="https://zulip.com/case-studies/idrift/">
                        Efficient distributed team management at iDrift AS
                        </a>
                    </li>
                    <li class="top-menu-submenu-list-item">
                        <a href="https://zulip.com/case-studies/gut-contact/">
                        Easy communication for 1000 agents at GUT contact
                        </a>
                    </li>
                    <li class="top-menu-submenu-list-item">
                        <a href="https://zulip.com/case-studies/end-point/">
                        Managing hundreds of projects at End Point Dev
                        </a>
                    </li>
                    <li class="top-menu-submenu-list-item">
                        <a href="/case-studies/windborne/">
                        Worldwide operations and AI at WindBorne
                        </a>
                    </li>
                    <li class="top-menu-submenu-list-item">
                        <a href="https://zulip.com/case-studies/semsee/">
                        More efficient communication than Slack at Semsee
                        </a>
                    </li>
                    <li class="top-menu-submenu-list-item">
                        <a href="https://zulip.com/case-studies/atolio/">
                        Open distributed communication at Atolio
                        </a>
                    </li>
                </ul>
                <span class="top-menu-mobile-submenu-section">EDUCATION and RESEARCH</span>
                <ul class="top-menu-submenu-list">
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/tum/">Organized chat for 1000s of students at TUM</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/ucsd/">Communication hub across 6 continents at UCSD</a></li>
                    <li class="top-menu-submenu-list-item"><a href="/case-studies/university-of-cordoba/">Connecting across generations at the National University of Córdoba</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/lean/">Research collaboration at scale in the Lean mathematical community</a></li>
                </ul>
                <span class="top-menu-mobile-submenu-section">OPEN SOURCE and COMMUNITIES</span>
                <ul class="top-menu-submenu-list">
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/asciidoctor/">Inclusive discussion in the open-source Asciidoctor community</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/rust/">Faster decision-making in the Rust language community</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/case-studies/recurse-center/">Platform for a worldwide community since 2013 at Recurse Center</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/communities/">Open communities directory</a></li>
                </ul>
            </div>
        </details>
        <details>
            <summary class="top-menu-mobile-item-summary">Resources</summary>
            <div class="top-menu-mobile-submenu">
                <span class="top-menu-mobile-submenu-section">FOR USERS</span>
                <ul class="top-menu-submenu-list">
                    <li class="top-menu-submenu-list-item"><a href="/help/getting-started-with-zulip">Getting started</a></li>
                    <li class="top-menu-submenu-list-item"><a href="/help">Help center</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/development-community/" target="_blank" rel="noopener noreferrer">Community chat</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.com/help/contact-support">Contact support</a></li>
                </ul>
                <span class="top-menu-mobile-submenu-section">FOR ADMINISTRATORS</span>
                <ul class="top-menu-submenu-list">
                    <li class="top-menu-submenu-list-item"><a href="/help/moving-to-zulip">Moving to Zulip</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.readthedocs.io/en/stable/production/install.html">Installing a Zulip server</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://zulip.readthedocs.io/en/stable/production/upgrade.html">Upgrading a Zulip server</a></li>
                    <li class="top-menu-submenu-list-item"><a href="https://github.com/zulip/zulip" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                </ul>
            </div>
        </details>
        <div class='top-menu-mobile-item'><a href="https://zulip.com/plans/">Pricing</a></div>
        <div class='top-menu-mobile-item'><a href="https://zulip.com/apps/">Download</a></div>
    </div>
    <div class="top-menu-mobile-items-group-2">
        <div class='top-menu-mobile-item'><a href="/new/">New organization</a></div>
        {% if user_is_authenticated %}
        <details>
            <summary class="top-menu-mobile-item-summary">
                <img class="top-menu-mobile-user-img"
                  src="{{ realm_icon }}" />
                {{ realm_name }}
            </summary>
            <div class="top-menu-mobile-submenu">
                <ul class="top-menu-submenu-list">
                    <li class="top-menu-submenu-list-item">
                        <a href="/">Go to app</a>
                    </li>
                    <li class="top-menu-submenu-list-item">
                        <a class="logout_button">
                        Log out
                        </a>
                    </li>
                </ul>
                <div class="hidden">
                    <form id="logout_form" action="/accounts/logout/" method="POST">{{ csrf_input }}
                    </form>
                </div>
            </div>
        </details>
        {% else %}
        <div class='top-menu-mobile-item'><a href="/login/">Log in</a></div>
        {% if register_link_disabled %}
        {% else %}
        <div class='top-menu-mobile-item'><a href="/register/">Sign up</a></div>
        {% endif %}
        {% endif %}
    </div>
</details>
{% endif %}
```

--------------------------------------------------------------------------------

````
