---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 510
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 510 of 1290)

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

---[FILE: apps.html]---
Location: zulip-main/templates/corporate/apps.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Download the Zulip app for your device" %}

{% set PAGE_DESCRIPTION = "Zulip has apps for every platform. Download the Zulip
  app for macOS, Windows, Linux, Android, iOS or Terminal." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style media="screen">
    .app.portico-page { padding-bottom: 0px; }
</style>
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing apps">
    <div class="hero">
        <div id="waves"></div>
        <div class="inner-content">
            <div class="info">
                <div class="flex">
                    <div class="cta">
                        <h1>Zulip for <span class="platform"></span></h1>
                        <p class="description"></p>
                        <a class="button desktop-download-link no-action" hidden href=""><span class="button green">Download Zulip for <span class="platform"></span></span></a>
                        <a class="button download-from-google-play-store" hidden href=""><img src="{{ static('images/store-badges/google-play-badge.png') }}" alt=""/></a>
                        <a class="button download-from-apple-app-store" hidden href=""><img src="{{ static('images/store-badges/app-store-badge.svg') }}" alt=""/></a>
                        <span id="download-from-microsoft-store" hidden>or <a href="https://apps.microsoft.com/store/detail/XP8HN41S4PLGZ3">download from the Microsoft Store</a></span>
                        <span id="download-android-apk" hidden>or manually download APK for the <a class="android-apk-current" href="">current</a> or <a class="android-apk-legacy" href="">legacy</a> app</span>
                        <span id="download-mac-intel" hidden>or <a href="">download <strong>Intel</strong> processor build <i>(some older Macs)</i></a></span>
                        <p class="download-instructions"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="other-apps">
        <h2>Apps for every platform.</h2>

        <div class="apps">
            <a class="app-option" href="/apps/mac">
                <i class="icon fa fa-apple" data-label="macOS"></i>
            </a>
            <a class="app-option" href="/apps/windows">
                <i class="icon fa fa-windows" data-label="Windows"></i>
            </a>
            <a class="app-option" href="/apps/linux">
                <i class="icon fa fa-linux" data-label="Linux"></i>
            </a>
            <a class="app-option" href="/apps/android">
                <i class="icon fa fa-android" data-label="Android"></i>
            </a>
            <a class="app-option" href="/apps/ios">
                <i class="icon fa fa-mobile-phone" data-label="iOS"></i>
            </a>
            <a class="app-option" href="https://github.com/zulip/zulip-terminal#readme">
                <i class="icon fa fa-terminal" data-label="Terminal (beta)"></i>
            </a>
        </div>
        <div id="third-party-apps">
            Zulip also works great in pinned
            <a href="/help/supported-browsers">browser tabs</a>
            and multi-protocol desktop chat apps
            like <a href="https://rambox.pro">Rambox</a>
            and <a href="https://ferdium.org/">Ferdium</a>.
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: attribution.html]---
Location: zulip-main/templates/corporate/attribution.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Website attributions | Zulip" %}
{% set PAGE_DESCRIPTION = "Attributions for the Zulip website." %}
{% set allow_search_engine_indexing = False %} <!-- Page is not indexed by search engines. -->

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page">
    <div class="hero empty-hero"></div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content">
                <h1>Website attributions</h1>
                <ul>
                    <li>
                        <b>On <a href="/for/business/">/for/business/</a> page:</b>
                        <img alt="" src="{{ static('images/landing-page/companies/software-engineer.svg') }}" />
                        <p>"<a href="https://iconscout.com/illustration/software-engineer-2043023">Software engineer Illustration</a>" By <a href="https://iconscout.com/contributors/delesign/illustrations">Delesign Graphic</a> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
                    </li>
                    <li>
                        <b>On <a href="/zulip-cloud/">/zulip-cloud/</a> page:</b>
                        <img alt="" src="{{ static('images/landing-page/zulip-cloud/support.svg') }}" />
                        <p><a href="https://storyset.com/work">Work illustrations by Storyset</a></p>
                    </li>
                    <li>
                        <b>On <a href="/role/engineers/">/role/engineers/</a> page:</b>
                        <img alt="" src="{{ static('images/landing-page/zulip-cloud/support.svg') }}" />
                        <p><a href="https://storyset.com/work">Work illustrations by Storyset</a></p>
                    </li>
                    <li>
                        <b>On <a href="/role/engineers/">/role/engineers/</a> page:</b>
                        <img alt="" src="{{ static('images/landing-page/zulip-cloud/support.svg') }}" />
                        <p><a href="https://storyset.com/work">Work illustrations by Storyset</a></p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: communities.html]---
Location: zulip-main/templates/corporate/communities.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "communities" %}

{% set PAGE_TITLE = "Open communities directory | Zulip" %}

{% set PAGE_DESCRIPTION = "Zulip communities that are open to the public, and
  have opted in to be listed." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block hello_page_container %} hello-main{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}
{% include 'zerver/gradients.html' %}

<div class="portico-landing integrations communities">
    <div class="main">
        <div class="padded-content">
            <div class="inner-content">

                <div class="integration-main-text">
                    <header>
                        <h1 class="portico-page-heading">
                            {% trans %}Open communities directory{% endtrans %}
                        </h1>
                        <p class="portico-page-subheading">
                            These Zulip communities are open to the public, and have
                            <a href="/help/communities-directory">opted in to be listed</a>.
                        </p>
                    </header>
                </div>

                <div class="integration-categories-dropdown">
                    <div class="integration-toggle-categories-dropdown">
                        <h3 class="dropdown-category-label">{% trans %}Filter by category{% endtrans %}</h3>
                        <i class="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                    <div class="dropdown-list">
                        <a href="#all">
                            <h4 class="realm-category selected" data-category="all">All</h4>
                        </a>
                        {% for org_type in org_types.keys() %}
                        <a href="#{{ org_type }}">
                            <h4 class="realm-category" data-category="{{ org_type }}">
                                {{ org_types[org_type]["name"] }}
                            </h4>
                        </a>
                        {% endfor %}
                    </div>
                </div>

                <div class="catalog">
                    <div class="integration-categories-sidebar">
                        <h3>{% trans %}Categories{% endtrans %}</h3>
                        <a href="#all">
                            <h4 data-category="all" class="realm-category selected">{% trans %}All{% endtrans %}</h4>
                        </a>
                        {% for org_type in org_types.keys() %}
                        <a href="#{{ org_type }}">
                            <h4 data-category="{{ org_type }}" class="realm-category">
                                {{  org_types[org_type]["name"] }}
                            </h4>
                        </a>
                        {% endfor %}
                    </div>
                    <div class="eligible_realms">
                        {% for eligible_realm in eligible_realms %}
                            <a class="eligible_realm" data-org-type="{{ eligible_realm.org_type_key }}" href="{{ eligible_realm.realm_url }}">
                                <img class="eligible_realm_logo" src="{{ eligible_realm.logo_url }}" alt="{{ eligible_realm.name }} logo"/>
                                <div class="eligible_realm_details">
                                    <h3 class="eligible_realm_name">{{ eligible_realm.name }}</h3>
                                    <h4 class="eligible_realm_description">
                                        {{ eligible_realm.description  }}
                                    </h4>
                                </div>
                            </a>
                        {% endfor %}
                        <hr />
                        <div class="eligible_realm_end_notice">
                            <p>Learn how Zulip can be a <a href="/for/communities/">home for your community</a>.</p>
                        </div>
                    </div>
                </div>

            </div> <!-- .inner-content -->
        </div> <!-- .padded-content -->
    </div> <!-- .main -->
</div> <!-- .portico-landing -->

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: compare-education.html]---
Location: zulip-main/templates/corporate/compare-education.html

```text
<div class="compare-education">
    <div class="padded-content">
        <div class="text-header">
            <div class="text-content">
                <h1 class="center"><span>Zulip: The most complete communication hub for your class.</span></h1>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Feature</th>
                        <th >Zulip</th>
                        <th class="normal">Slack</th>
                        <th class="normal">Discord</th>
                        <th class="normal">Piazza</th>
                        <th class="normal">CampusWire</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Rich, modern chat</td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                    </tr>
                    <tr>
                        <td>Apps for every platform</td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                    </tr>
                    <tr>
                        <td>Self-hosting option for full control over data</td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                    </tr>
                    <tr>
                        <td>Dedicated account</td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                    </tr>
                    <tr>
                        <td>Topic-based threading</td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                    </tr>
                    <tr>
                        <td>Resolve topics/questions</td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                    </tr>
                    <tr>
                        <td>Move topics/questions</td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                    </tr>
                    <tr>
                        <td>Native LaTeX support</td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                    </tr>
                    <tr>
                        <td>Built-in spoilers</td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                    </tr>
                    <tr>
                        <td>Emoji reactions</td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                    </tr>
                    <tr>
                        <td>@-mention groups</td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                    </tr>
                    <tr>
                        <td>Scales to 10,000s of users</td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="yes"></td>
                        <td class="no"></td>
                        <td class="no"></td>
                    </tr>
                    <tr>
                        <td># supported languages</td>
                        <td class="number">23</td>
                        <td class="number">13</td>
                        <td class="number">30</td>
                        <td class="number one">1</td>
                        <td class="number one">1</td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

````
