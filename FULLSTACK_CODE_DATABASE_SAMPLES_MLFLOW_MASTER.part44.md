---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 44
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 44 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: side_nav.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/side_nav.html

```text
<div class="wy-side-scroll">
  <div class="wy-side-nav-search">
    {% block sidebartitle %}

    {% if theme_display_version %}
      {%- set nav_version = version %}
      {% if READTHEDOCS and current_version %}
        {%- set nav_version = current_version %}
      {% endif %}
      {% if nav_version %}
        <div class="version">
          {{ nav_version }}
        </div>
      {% endif %}
    {% endif %}

    {% include "searchbox.html" %}

    {% endblock %}
  </div>

  <div class="wy-menu wy-menu-vertical" data-spy="affix" role="navigation" aria-label="main navigation">
    {% if not (logo and theme_logo_only) %}
      <a href="{{ pathto(master_doc) }}">Home</a>
    {% endif %}

    {% block menu %}
      {% set toctree = toctree(maxdepth=4, collapse=theme_collapse_navigation, includehidden=True) %}

      {% if toctree %}
        {{ toctree }}
      {% else %}
        <!-- Local TOC -->
        <div class="local-toc">{{ toc }}</div>
      {% endif %}
    {% endblock %}
  </div>

  <div role="contentinfo">
    {% include "build_info.html" %}

    <p>
      <a id='feedbacklink' href="https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md" target="_blank">Contribute</a>
    </p>
  </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: theme.conf]---
Location: mlflow-master/docs/api_reference/theme/mlflow/theme.conf

```text
[theme]
inherit = basic
stylesheet = css/theme.css

[options]
typekit_id = hiw1hhg
sticky_navigation = False
logo_only =
collapse_navigation = False
nav_version = False
```

--------------------------------------------------------------------------------

---[FILE: versions.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/versions.html

```text
{% if READTHEDOCS %}
{# Add rst-badge after rst-versions for small badge style. #}
  <div class="rst-versions" data-toggle="rst-versions" role="note" aria-label="versions">
    <span class="rst-current-version" data-toggle="rst-current-version">
      <span class="fa fa-book"> Read the Docs</span>
      v: {{ current_version }}
      <span class="fa fa-caret-down"></span>
    </span>
    <div class="rst-other-versions">
      <dl>
        <dt>Versions</dt>
        {% for slug, url in versions %}
          <dd><a href="{{ url }}">{{ slug }}</a></dd>
        {% endfor %}
      </dl>
      <dl>
        <dt>Downloads</dt>
        {% for type, url in downloads %}
          <dd><a href="{{ url }}">{{ type }}</a></dd>
        {% endfor %}
      </dl>
      <dl>
        <dt>On Read the Docs</dt>
          <dd>
            <a href="//{{ PRODUCTION_DOMAIN }}/projects/{{ slug }}/?fromdocs={{ slug }}">Project Home</a>
          </dd>
          <dd>
            <a href="//{{ PRODUCTION_DOMAIN }}/builds/{{ slug }}/?fromdocs={{ slug }}">Builds</a>
          </dd>
      </dl>
      <hr/>
      Free document hosting provided by <a href="http://www.readthedocs.org">Read the Docs</a>.

    </div>
  </div>
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/docs/api_reference/theme/mlflow/__init__.py

```python
"""Sphinx ReadTheDocs theme.

From https://github.com/ryan-roemer/sphinx-bootstrap-theme.

"""

import os

VERSION = (0, 1, 9)

__version__ = ".".join(str(v) for v in VERSION)
__version_full__ = __version__


def get_html_theme_path():
    """Return list of HTML theme paths."""
    return os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
```

--------------------------------------------------------------------------------

---[FILE: badge_only.css]---
Location: mlflow-master/docs/api_reference/theme/mlflow/static/css/badge_only.css

```text
.fa:before{-webkit-font-smoothing:antialiased}.clearfix{*zoom:1}.clearfix:before,.clearfix:after{display:table;content:""}.clearfix:after{clear:both}@font-face{font-family:FontAwesome;font-weight:normal;font-style:normal;src:url("../font/fontawesome_webfont.eot");src:url("../font/fontawesome_webfont.eot?#iefix") format("embedded-opentype"),url("../font/fontawesome_webfont.woff") format("woff"),url("../font/fontawesome_webfont.ttf") format("truetype"),url("../font/fontawesome_webfont.svg#FontAwesome") format("svg")}.fa:before{display:inline-block;font-family:FontAwesome;font-style:normal;font-weight:normal;line-height:1;text-decoration:inherit}a .fa{display:inline-block;text-decoration:inherit}li .fa{display:inline-block}li .fa-large:before,li .fa-large:before{width:1.875em}ul.fas{list-style-type:none;margin-left:2em;text-indent:-0.8em}ul.fas li .fa{width:0.8em}ul.fas li .fa-large:before,ul.fas li .fa-large:before{vertical-align:baseline}.fa-book:before{content:""}.icon-book:before{content:""}.fa-caret-down:before{content:""}.icon-caret-down:before{content:""}.fa-caret-up:before{content:""}.icon-caret-up:before{content:""}.fa-caret-left:before{content:""}.icon-caret-left:before{content:""}.fa-caret-right:before{content:""}.icon-caret-right:before{content:""}.rst-versions{position:fixed;bottom:0;left:0;width:300px;color:#fcfcfc;background:#1f1d1d;border-top:solid 10px #343131;font-family:"Lato","proxima-nova","Helvetica Neue",Arial,sans-serif;z-index:400}.rst-versions a{color:#2980B9;text-decoration:none}.rst-versions .rst-badge-small{display:none}.rst-versions .rst-current-version{padding:12px;background-color:#272525;display:block;text-align:right;font-size:90%;cursor:pointer;color:#27AE60;*zoom:1}.rst-versions .rst-current-version:before,.rst-versions .rst-current-version:after{display:table;content:""}.rst-versions .rst-current-version:after{clear:both}.rst-versions .rst-current-version .fa{color:#fcfcfc}.rst-versions .rst-current-version .fa-book{float:left}.rst-versions .rst-current-version .icon-book{float:left}.rst-versions .rst-current-version.rst-out-of-date{background-color:#E74C3C;color:#fff}.rst-versions .rst-current-version.rst-active-old-version{background-color:#F1C40F;color:#000}.rst-versions.shift-up .rst-other-versions{display:block}.rst-versions .rst-other-versions{font-size:90%;padding:12px;color:gray;display:none}.rst-versions .rst-other-versions hr{display:block;height:1px;border:0;margin:20px 0;padding:0;border-top:solid 1px #413d3d}.rst-versions .rst-other-versions dd{display:inline-block;margin:0}.rst-versions .rst-other-versions dd a{display:inline-block;padding:6px;color:#fcfcfc}.rst-versions.rst-badge{width:auto;bottom:20px;right:20px;left:auto;border:none;max-width:300px}.rst-versions.rst-badge .icon-book{float:none}.rst-versions.rst-badge .fa-book{float:none}.rst-versions.rst-badge.shift-up .rst-current-version{text-align:right}.rst-versions.rst-badge.shift-up .rst-current-version .fa-book{float:left}.rst-versions.rst-badge.shift-up .rst-current-version .icon-book{float:left}.rst-versions.rst-badge .rst-current-version{width:auto;height:30px;line-height:30px;padding:0 6px;display:block;text-align:center}@media screen and (max-width: 768px){.rst-versions{width:85%;display:none}.rst-versions.shift{display:block}img{width:100%;height:auto}}
/*# sourceMappingURL=badge_only.css.map */
```

--------------------------------------------------------------------------------

---[FILE: cards.css]---
Location: mlflow-master/docs/api_reference/theme/mlflow/static/css/cards.css

```text
/**
  * Card list navigation
  */

.card-list {
    display: flex;
    padding: 4rem;
    overflow-x: scroll;
}

.card {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-between;
    height: 500px;
    width: 400px;
    min-width: 375px;
    padding: 2rem;
    border-radius: 16px;
    background: white;
    box-shadow: -1rem 0 2rem slategray;
    transition: .4s;
    flex-wrap: wrap;
}

.card:hover {
    transform: translateY(-1rem);
    box-shadow: -1rem 0 2rem #003b5a;
}

.card:hover~.card {
    transform: translateX(50px);
}

.card:not(:first-child) {
    margin-left: -50px;
}

.card-header h1 {
    padding-bottom: 1rem;
    font-size: 1rem;
}

.card-header h2 {
    padding-bottom: 1rem;
    height: 6rem;
    overflow: hidden;
    font-size: 1.5rem;
}

.card-header p {
    font-size: 1rem;
}

.card-header .card-link {
    text-decoration: none;
    color: inherit;
}

.card-header .card-link:hover {
    background: #0194E2;
    text-shadow: none;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.card-header ul {
    font-size: 0.9rem;
    max-height: 200px;
    overflow-y: auto;
    position: relative;
}

.card-header li {
    padding-bottom: 0.5rem;
}

.card-header h1, .card-header h2, .card-header p, .card-header ul {
    margin-bottom: 1rem;
}

.card-header h1:hover {
    background: #0194E2;
    text-shadow: none;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.card-header a {
    text-decoration: none;
    color: inherit;
    position: relative;
}

.card-header-image {
    position: absolute;
    top: 0;
    right: 1.5rem;
    padding-left: 1rem;
    max-height: 3.5rem;
    padding-top: 1.5rem;
}

.card-list::-webkit-scrollbar{
    width: 10px;
    height: 10px;

}

.card-list::-webkit-scrollbar-thumb {
    background: #0194E2;
    border-radius: 8px;
    box-shadow: inset 2px 2px 2px hsla(0,0%,100%,.25), inset -2px -2px -2px rgba(0,0,0,.25);
}

.card-list::-webkit-scrollbar-track {
    background: linear-gradient(90deg, #c5e0e8, #c5e0e8 1px, #c5e0e8 0, #43c9ed);
}

.tags {
    margin: 1rem 0 2rem;
    padding: .5rem 0 1rem;
    line-height: 2;
    margin-bottom: 0;
}

.tags a {
    font-style: normal;
    font-weight: 700;
    font-size: .5rem;
    color: darkslategray;
    text-transform: uppercase;
    font-size: .66rem;
    border: 3px solid lightskyblue;
    border-radius: 2rem;
    padding: .2rem .85rem .25rem;
    position: relative;
    margin-bottom: .25rem;
    width: fit-content;
}

.tags a::before {
    font-family: "Font Awesome 5 Free"; 
    font-weight: 900;
    color: #0194E2; 
    padding-right: 8px;
}

.tags a.download::before {
    content: "\f019"; /* download icon */
}

.tags a.view::before {
    content: "\f06e"; /* view icon */
}

.tags a.github::before {
    content: ""; 
    display: inline-block; 
    width: 1rem; 
    height: 1rem;
    background: url("../../../../source/_static/images/intro/github-mark.svg") no-repeat center center; 
    background-size: contain; 
    margin-right: 3px; 
    vertical-align: middle;
}

.tags a:hover {
    background: black;
    text-shadow: none;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-box-decoration-break: clone;
    background-clip: text;
    border-color: darkblue;
}


/* Common styles for icons */
.icon::before {
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    color: #0194E2;
    vertical-align: middle;
    margin-right: 3px;
    line-height: 1;
}

/* Unique styles for each icon */
.teacher::before {
    content: "\f51c";
    margin-right: 6px;
}

.bell::before {
    content: "\f0f3";
}

.bulb::before {
    content: "\f0eb";
}

.notebook::before {
    content: "\f328";
}
```

--------------------------------------------------------------------------------

---[FILE: custom.css]---
Location: mlflow-master/docs/api_reference/theme/mlflow/static/css/custom.css

```text
/*******************************************************************************
 * DB Icon set
 */

@font-face {
  font-family: "db-icon";
  src: url("../fonts/db-icon.ttf?wc7cqx") format("truetype"),
    url("../fonts/db-icon.woff?wc7cqx") format("woff"),
    url("../fonts/db-icon.svg?wc7cqx#db-icon") format("svg");
  font-weight: normal;
  font-style: normal;
}

.db-icon {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: "db-icon" !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Set max-width for docs... */
.wy-nav-content {
  max-width: 1440px !important;
}

.db-icon-arrow-down-circle:before {
  content: "\e900";
}

.db-icon-arrow-down:before {
  content: "\e901";
}

.db-icon-arrow-left-circle:before {
  content: "\e902";
}

.db-icon-arrow-left:before {
  content: "\e903";
}

.db-icon-arrow-right-circle:before {
  content: "\e904";
}

.db-icon-arrow-right:before {
  content: "\e905";
}

.db-icon-arrow-up-circle:before {
  content: "\e906";
}

.db-icon-arrow-up:before {
  content: "\e907";
}

.db-icon-checkmark:before {
  content: "\e908";
}

.db-icon-chevron-down:before {
  content: "\e909";
}

.db-icon-chevron-left:before {
  content: "\e90a";
}

.db-icon-chevron-right:before {
  content: "\e90b";
}

.db-icon-chevron-up:before {
  content: "\e90c";
}

.db-icon-close:before {
  content: "\e90d";
}

.db-icon-dbce:before {
  content: "\e90e";
}

.db-icon-facebook:before {
  content: "\e90f";
}

.db-icon-linkedin:before {
  content: "\e910";
}

.db-icon-menu:before {
  content: "\e911";
}

.db-icon-newsletter:before {
  content: "\e912";
}

.db-icon-pdf:before {
  content: "\e913";
}

.db-icon-play-large:before {
  content: "\e914";
}

.db-icon-play:before {
  content: "\e915";
}

.db-icon-plus-circle-filled:before {
  content: "\e916";
}

.db-icon-rss:before {
  content: "\e917";
}

.db-icon-search:before {
  content: "\e918";
}

.db-icon-share:before {
  content: "\e919";
}

.db-icon-slideshow-left:before {
  content: "\e91a";
}

.db-icon-slideshow-right:before {
  content: "\e91b";
}

.db-icon-twitter-bird:before {
  content: "\e91c";
}

.db-icon-twitter:before {
  content: "\e91d";
}

.db-icon-webinar:before {
  content: "\e91e";
}

/*******************************************************************************
 * Scaffolding
 */

body,
body.wy-body-for-nav {
  background: #fff;
  background-image: none;
}

* {
  box-sizing: border-box;
}

a,
a:visited,
a:hover {
  color: #0194e2;
}

.rst-content tt.xref,
a .rst-content tt,
.rst-content tt.xref,
.rst-content code.xref,
a .rst-content tt,
a .rst-content code {
  font-weight: 500;
}

.rst-content dl:not(.docutils) dt {
  background-color: #f6f7f8;
  border: 0.1rem solid #0000001a !important;
  border-radius: 0.4rem;
  padding: 0.1rem;
}

/* Use semibold weight in favor of bold */
h1,
h2,
h3,
h4,
h5,
b,
strong,
mark,
.wy-alert-title,
.rst-content .admonition-title,
.wy-table thead th,
.rst-content table.docutils thead th,
.rst-content table.field-list thead th,
.wy-menu-vertical header,
.wy-menu-vertical p.caption,
.wy-side-nav-search > a,
.wy-side-nav-search .wy-dropdown > a,
.rst-content .topic-title,
.rst-content .sidebar .sidebar-title,
.rst-content .highlighted,
.rst-content dl dt,
.rst-content dl:not(.docutils) tt,
.rst-content dl:not(.docutils) tt,
.rst-content dl:not(.docutils) code,
.rst-content dl:not(.docutils) tt.descname,
.rst-content dl:not(.docutils) tt.descname,
.rst-content dl:not(.docutils) code.descname,
.rst-content dl:not(.docutils) .optional,
.rst-content p.rubric {
  font-weight: 600;
}

/**
 * Forms
 */

input[type="text"],
input[type="password"],
input[type="email"],
input[type="url"],
input[type="date"],
input[type="month"],
input[type="time"],
input[type="datetime"],
input[type="datetime-local"],
input[type="week"],
input[type="number"],
input[type="search"],
input[type="tel"],
input[type="color"] {
  color: #000;
  background-color: #fff;
  border: 1px solid #ddd;
}

/**
 * Tables
 */

table {
  width: 100%;
  background-color: #fff;
}

table > colgroup:first-child {
  display: none;
}

@media (min-width: 769px) {
  .wy-table-responsive {
    max-width: none;
    overflow: visible;
  }

  .wy-table-responsive table td,
  .wy-table-responsive table th {
    white-space: normal;
  }
}

/**
 * Images
 */

@media screen and (max-width: 768px) {
  img {
    width: auto;
  }
}

/*******************************************************************************
 * Header area
 */

/**
 * HIGH-LEVEL PAGE LAYOUT CODE ONLY
 * Header bar
 * Layout is a 1x2.
 *  <Nav>
 *  <Page>
 *
 * Top-level nav is the header bar. It is 55px and above page content.
 * Page contains sidebar Nav and Main.
 * <Page> is a 2x1:
 *    <Nav><Main>
 *
 * HIGH-LEVEL PAGE LAYOUT CODE ONLY
 */

.wy-nav-top {
  display: block;
  /* Overriding the theme which sets it to none(since it use to only be mobile. */
  border: none !important;
  position: fixed;
}

.wy-nav-top.header {
  top: 0;
  left: 0;
  width: 100%;
  /*
    Above page content. 10 to give some room. .clippy is 2, so this really only needs to be 2, but I am doing 10
      to reduce the chance that someone someone adds something else to the body and overflows it.
    @TODO: Cleanup the overall stacking/positioning so we can just push the main content always below the header as
      one group.
  */
  z-index: 10;
}

/**
  Fix for anchor tags scrolling under the header.
 */
.section:before {
  content: "";
  display: block;
  position: relative;
  width: 0;
  height: 55px;
  margin-top: -55px;
}

@media screen and (max-width: 768px) {
  .wy-nav-content-wrap.shift {
    top: 55px;
  }
}

.wy-grid-for-nav {
  top: 55px;
}

/**
* End "HIGH-LEVEL PAGE LAYOUT CODE ONLY" section
*/

.wy-nav-top {
  padding: 0;
  color: rgb(28, 30, 33);
}

.wy-nav-top a {
  color: #0194e2 !important;
}

.wy-nav-top .header-link {
  color: #1c1e21;
  font-size: 16px;
  font-weight: 500;
}

.wy-nav-top.header ul {
  height: 55px;
  /* Important for item sizing */
}

.wy-nav-top.header li {
  width: 33%;
  display: inline;
}

/* Spacing based on Azure doc logo and change cloud link. */
@media screen and (max-width: 670px) {
  .wy-nav-top.header .change-cloud-link a.long {
    display: none;
  }
}

/* Spacing based on Azure doc logo and change cloud link. */
@media screen and (min-width: 671px) {
  .wy-nav-top.header .change-cloud-link a.short {
    display: none;
  }
}

.wy-nav-top-menu-button {
  display: none;
}

@media screen and (max-width: 768px) {
  .wy-nav-top-menu-button {
    display: block;
  }
}

.wy-nav-top .change-cloud-link a {
  color: #2980b9;
  margin-right: 14px;
  line-height: 62px;
  /* For aligning the bottom of this text with the menu toggle and logo */
}

.wy-nave-shift {
  border-right: 1px solid #c9c9c9;
}

.build_info {
  font-size: 12px;
}

.wy-nav-top .wy-nav-top-menu-button {
  font-size: 16px;
  width: 16px;
  text-align: center;
  z-index: 2;
  background-color: #efefef;
}

.wy-nav-top-logo {
  flex-shrink: 0;
  line-height: 54px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wy-nav-top-logo img {
  border-radius: 0;
  max-width: 100%;
  margin: 0 auto;
  max-height: 30px;
  width: auto;
  padding: 0;
  background-color: transparent;
}

@media screen and (max-width: 768px) {
  .wy-nav-top-logo img {
    max-height: 25px;
  }
}

/**
 * Sidebar Header area
 */

.wy-nav-side {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  color: #000;
  border-right: 1px solid #dadde1;
  min-height: calc(100vh - 70px);
  position: fixed !important;
  top: 70px;
}

@media screen and (max-width: 768px) {
  .wy-nav-side.shift {
    width: 300px;
  }
}

.wy-nav-side [role="contentinfo"] {
  padding: 24px 16px;
  width: 300px;
  border-top: 1px solid #c9c9c9;
}

.wy-nav-side [role="contentinfo"] p {
  margin-bottom: 0;
}

/* Logo */
.wy-side-nav-search > a.header-logo {
  /* Unfortunately, we have to use a pretty specific selector */
  display: block;
  padding: 0;
  margin-bottom: 40px;
}

@media screen and (max-width: 768px) {
  .wy-side-nav-search > a.header-logo {
    display: none;
  }
}

.wy-side-nav-search > a.header-logo:hover {
  background-color: transparent;
}

.header-logo img {
  border-radius: 0;
  max-width: 100%;
  margin: 0 auto;
  width: 199px;
  height: 31px;
  padding: 0;
  background-color: transparent;
}

/* Search box */
.wy-side-nav-search input[type="text"] {
  color: rgb(28, 30, 33);
  background-color: #ebedf0;
  border: none;
  padding: 0 8px;
  height: 36px;
  border-radius: 40px;
  font-size: 16px;
}

.wy-side-nav-search input[type="text"]:focus {
  background-color: #e5e5e5;
  border-color: #eee;
}

.wy-side-nav-search input[type="text"]::-webkit-input-placeholder {
  color: #555;
}

.wy-side-nav-search input[type="text"]::-moz-placeholder {
  color: #555;
}

.wy-side-nav-search input[type="text"]:-ms-input-placeholder {
  color: #555;
}

.wy-side-nav-search input[type="text"]::placeholder {
  color: #555;
}

/**
 * Navigation
 */

.wy-menu-vertical {
  font-size: 15px;
}

.wy-menu-vertical li {
  font-size: 1em !important;
}

.wy-menu-vertical a,
.wy-menu-vertical li.on a,
.wy-menu-vertical li.current a,
.wy-menu-vertical li.current > a {
  width: 100%;
  color: #606770;
  padding: 6px 30px !important;
  font-size: 14px;
  line-height: 1.25em;
  background-color: transparent !important;
  border: 0;
  -webkit-font-smoothing: auto !important;
}

.wy-menu-vertical a:hover,
.wy-menu-vertical li.on a:hover,
.wy-menu-vertical li.current a:hover,
.wy-menu-vertical li.current > a:hover {
  background-color: #f0f0f0 !important;
}

.wy-menu-vertical > ul.current > li.current > ul.current > li.current > a,
.wy-menu-vertical > ul.current > li.current > a {
  padding-bottom: 6px;
  background-color: #0000000d !important;
  color: #0194e2;
  line-height: 1.25;
  border-radius: 0.25rem;
}

.wy-menu-vertical > ul.current:not(:first-of-type) > li.current {
  padding-top: 6px;
  margin-top: 6px;
}

.wy-menu-vertical li.current {
  background: transparent;
}

.wy-menu-vertical li.current li a {
  padding-left: calc(30px + 1.5em) !important;
}

.wy-menu-vertical li.current li li a {
  padding-left: calc(30px + 3em) !important;
}

.wy-menu-vertical li.current li li li a {
  padding-left: calc(30px + 4.5em) !important;
}

.wy-menu-vertical li.current li li li li a {
  padding-left: calc(30px + 6em) !important;
}

.wy-menu-vertical li.current li li li li li a {
  padding-left: calc(30px + 7.5em) !important;
}

.wy-menu-vertical li span.toctree-expand {
  color: #1cb1c2 !important;
}

.wy-menu-vertical li span.toctree-expand:before {
  vertical-align: middle;
  line-height: 1em !important;
  position: relative;
  top: -0.33em;
}

.wy-menu-vertical li.on a span.toctree-expand:before,
.wy-menu-vertical li.current > a span.toctree-expand:before {
  content: "–";
  font-weight: bold;
}

.wy-menu-vertical li span.toctree-expand:before {
  content: "+";
  font-weight: bold;
}

.wy-menu-vertical a.main-navigation-home img {
  position: absolute;
  bottom: calc(6px + 0.25em);
  left: 30px;
  margin-left: -1.2em;
  width: 1em;
  vertical-align: baseline;
}

.wy-menu-vertical a.main-navigation-home:hover {
  background-color: transparent;
}

/*******************************************************************************
 * Main content area
 */

.wy-nav-content-wrap,
.wy-nav-content {
  background: transparent !important;
}

@media screen and (max-width: 768px) {
  .wy-nav-content-wrap.shift {
    left: 300px;
  }
}

@media screen and (max-width: 768px) {
  .wy-nav-content-wrap .wy-nav-content {
    padding: 30px 15px;
  }
}

/* Overridding theme */
@media screen and (max-width: 768px) {
  .wy-nav-content-wrap.shift {
    overflow: scroll;
  }
}

.wy-nav-content-wrap {
  font-size: 17px;
}

.wy-nav-content-wrap p,
.wy-nav-content-wrap ol,
.wy-nav-content-wrap ul,
.wy-nav-content-wrap blockquote {
  font-size: 16px;
  line-height: 1.41em;
  margin-bottom: 1em;
}

.wy-nav-content-wrap ul ol,
.wy-nav-content-wrap ol ol,
.wy-nav-content-wrap ul ul,
.wy-nav-content-wrap ol ul {
  margin-bottom: 0 !important;
  /* Ugh... */
}

.wy-nav-content-wrap a:hover {
  text-decoration: underline;
}

.wy-nav-content-wrap h1,
.wy-nav-content-wrap h2,
.wy-nav-content-wrap h3,
.wy-nav-content-wrap h4,
.wy-nav-content-wrap h5 {
  color: rgb(28, 30, 33) !important;
}

.wy-nav-content-wrap h1 {
  font-size: 48px;
  font-weight: 400;
  margin-top: 0;
  margin-bottom: 0.25em;
}

.wy-nav-content-wrap h2 {
  font-weight: 400;
  font-size: 34px;
  margin-top: 1.2em;
  /* Was 1.5 but decreased to 1.2 to account for .section:before scroll fix. */
  margin-bottom: 0.5em;
}

.wy-nav-content-wrap h3 {
  font-weight: 400;
  font-size: 28px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.wy-nav-content-wrap h4 {
  font-weight: 400;
  font-size: 24px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.wy-nav-content-wrap h5 {
  font-weight: 400;
  font-size: 20px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

/**
 * Buttons
 */

.btn,
.btn:focus,
.btn:active {
  padding: 0.5em 1.5em;
  border-radius: 4px;
  font-size: 17px;
  line-height: 1em;
  text-transform: uppercase;
  text-rendering: geometricPrecision;
  box-shadow: none;
  font-weight: 600;
  transition: none;
}

a.btn,
a.btn:hover,
a.btn:focus,
a.btn:active {
  text-decoration: none !important;
}

.btn .db-icon {
  vertical-align: baseline;
  font-size: 0.6em;
  font-weight: bold;
  position: relative;
  top: -0.1em;
}

.btn-neutral,
.btn-neutral:visited {
  color: #fff !important;
  background: #1cb1c2 !important;
  border-color: #1cb1c2 !important;
}

.btn-neutral:hover,
.btn-neutral:active,
.btn-neutral:focus {
  background: #1fc5d8 !important;
  border-color: #1fc5d8 !important;
}

/**
 * Footer section
 */

.rst-content footer {
  font-size: 13px;
  color: #888;
}

.rst-content footer a {
  color: #888;
  text-decoration: underline;
}

.rst-content footer p {
  margin-bottom: 0.75em;
}

.rst-content footer hr {
  margin-top: 100px;
}

@media screen and (max-width: 768px) {
  .rst-content footer hr {
    margin-top: 30px;
  }
}

/* Next/prev buttons */
.rst-footer-buttons {
  margin-top: 30px;
}

.rst-footer-buttons .btn {
  padding: 6px 24px;
  text-align: center;
  color: #fff !important;
  background: #0194e2 !important;
  border: 1px solid #0086cf !important;
  font-size: 0.875rem;
  text-transform: unset !important;
}

.rst-footer-buttons .btn + .btn {
  margin-left: 1em;
}

@media screen and (max-width: 375px) {
  .rst-footer-buttons {
    display: flex;
  }

  .rst-footer-buttons .btn {
    flex: 1 1 50%;
  }
}

/**
 * Alert boxes
 */

.rst-content .admonition-title {
  text-transform: capitalize;
  font-weight: 600;
  line-height: 1em;
  padding: 0.35em 0.5em;
}

.rst-content .admonition-title:before {
  content: " ";
  display: inline-block;
  margin-right: 0.4em;
  width: 1em;
  height: 1em;
  line-height: 1em;
  vertical-align: bottom;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1em;
  position: relative;
  top: -0.1em;
}

.admonition {
  background-color: #fdfdfe !important;
  border-radius: 0.4rem;
  border: 0;
  border-left-width: 5px !important;
  border-style: solid !important;
  box-shadow: 0 1px 2px 0 #0000001a;
  padding: 1rem;
}

.admonition.note {
  border-color: #784c29;
}

.admonition.tip {
  background-color: #009400;
  background-color: #e6f6e6 !important;
}

.admonition.warning {
  border-color: #e6a700;
  background-color: #fff8e6 !important;
}

.admonition.important {
  border-color: #e6a700;
}

/* Tables in alert boxes */
.admonition table,
.rst-content .admonition table {
  border: 1px solid #e1e4e5 !important;
}

.rst-content .admonition table td,
.rst-content .admonition table th {
  border-color: #e1e4e5 !important;
}

.rst-content .admonition-title {
  color: rgb(28, 30, 33) !important;
  background: transparent !important;
  margin: 0 !important;
  margin-bottom: 16px !important;
  padding: 0 !important;
}

.rst-content .admonition-title:before {
  display: none !important;
}

/**
 * Code samples
 */

.code .highlight {
  position: relative;
  z-index: 1;
}

div[class^="highlight"] pre {
  box-shadow: 0 1px 2px 0 #0000001a;
  background-color: #f6f8fa;
  border-radius: 0.4rem;
}

/**
 * Notebook embeds
 */

.embedded-notebook p {
  font-size: small;
  margin-bottom: 0px;
}

.embedded-notebook .embedded-notebook-container {
  margin: -2px -14px -2px -8px;
}

.embedded-notebook .embedded-notebook-container .loading-spinner,
.embedded-notebook iframe,
.embedded-notebook .embedded-notebook-container:before {
  transition: opacity 0.5s linear;
}

.embedded-notebook iframe {
  opacity: 0;
  border-style: none;
  border-width: 0px;
  transition-delay: 0.5s;
}

.embedded-notebook.loaded iframe {
  opacity: 1;
}

.embedded-notebook .embedded-notebook-container {
  position: relative;
}

.embedded-notebook .embedded-notebook-container .loading-spinner {
  position: absolute;
  top: 30px;
  left: 50%;
  font-size: 80px;
  margin-left: -0.5em;
  z-index: -1;
}

.embedded-notebook .embedded-notebook-container:before {
  content: "Loading Notebook...";
  position: absolute;
  top: 130px;
  /* 30px (spinner's margin top) + 80px (spinner) + 20px */
  left: 50%;
  margin-left: -100px;
  width: 200px;
  text-align: center;
  font-size: 17px;
  z-index: -1;
}

.embedded-notebook.loaded .embedded-notebook-container .loading-spinner,
.embedded-notebook.loaded .embedded-notebook-container:before {
  opacity: 0;
  pointer-events: none;
}

/**
 * Breadcrumbs
 */

.wy-breadcrumbs {
  font-size: 15px !important;
  margin-bottom: 60px !important;
  margin-top: 0.5rem !important;
}

.wy-breadcrumbs li {
  font-size: 13px !important;
  color: rgb(28, 30, 33);
}

.wy-breadcrumbs li a {
  padding: 6px 12px;
  border-radius: 24px;
  font-size: 13px !important;
  color: rgb(28, 30, 33);
}

.wy-breadcrumbs li a:hover {
  background-color: #0000000d;
  color: #0194e2;
  text-decoration: none;
}

.wy-breadcrumbs .db-icon {
  margin-left: 0.5em;
  margin-right: 0.5em;
  font-size: 0.6em;
  font-weight: bold;
  display: inline-block;
  margin-top: -0.25em;
}

@media screen and (max-width: 375px) {
  .wy-breadcrumbs {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .wy-breadcrumbs {
    margin-bottom: 30px !important;
  }
}

/*******************************************************************************
 * Misc utilities
 */

/**
 * Loading spinners
 */

.loading-spinner {
  font-size: 100px;
  position: relative;
  text-indent: -9999em;
  border-top: 0.1em solid rgba(0, 0, 0, 0.2);
  border-right: 0.1em solid rgba(0, 0, 0, 0.2);
  border-bottom: 0.1em solid rgba(0, 0, 0, 0.2);
  border-left: 0.1em solid #333;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: spin 1.1s infinite linear;
  animation: spin 1.1s infinite linear;
}

.loading-spinner,
.loading-spinner:after {
  border-radius: 50%;
  width: 1em;
  height: 1em;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.version {
  line-height: 26px;
  vertical-align: bottom;
  text-align: left;
  font-size: 18px;
  padding: 0;
  margin: 0;
  font-weight: bold;
}

/**
 * Language Sections
 */

.code-section ul.section-selector,
.plain-section ul.section-selector {
  display: inline-block;
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-bottom: 14px;
}

.code-section ul.section-selector li,
.plain-section ul.section-selector li {
  display: block;
  cursor: pointer;
  margin: 0 5px 0 0;
  float: left;
  background-color: #4bd6e6;
  color: #fff;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -khtml-border-radius: 5px;
  padding: 2px 10px 2px 10px;
}

.code-section ul.section-selector li:hover,
.plain-section ul.section-selector li:hover {
  background-color: #777;
}

.code-section ul.section-selector li.selected,
.plain-section ul.section-selector li.selected {
  background-color: #1cb1c2;
}

.code-section ul.section-selector li.selected:hover,
.plain-section ul.section-selector li.selected:hover {
  background-color: #333;
}

/**
 * Display boxes for text breakout list structures
 */

.boxes-wrapper {
  display: flex;
  /* This makes children flex items */
  justify-content: space-between;
  /* Creates space between the boxes */
}

.left-box,
.right-box {
  flex: 1;
  /* This ensures that both boxes try to take up equal width */
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 15px;
  background-color: #f9f9f9;
  margin: 0 5px;
  /* Gives some space between the boxes */
  box-sizing: border-box;
  /* Ensures padding and border are included in the element's total width and height */
  text-align: left;
}

.right-box {
  margin-right: 0;
  /* Resetting any margin for the right-most box */
}

/**
 * Hierarchical relationships diagram
 */

.hierarchy-container {
  font-family: Arial, sans-serif;
  margin: 7.5px;
  position: relative;
}

.hierarchy-item {
  display: block;
  /* Start each element on a new line */
  width: fit-content;
  /* Adjust box width to the text */
  border-radius: 10px;
  background-color: #f0f0f0;
  padding: 4px 8px;
  /* Vertical and horizontal padding */
  margin: 4px 0;
  /* Vertical margin */
  border: 2px solid #0194e2;
  position: relative;
}

.level-1 {
  margin-left: 40px;
}

.level-2 {
  margin-left: 80px;
}

.level-3 {
  margin-left: 120px;
}

.level-4 {
  margin-left: 160px;
}

/**
 * Overrides to the nbsphinx modifications to the .highlight class that strips the clippy implementation (copy of code)
 */

/** disable nbsphinx copy buttons */
.nbinput .highlight .fa-copy,
.nboutput .highlight .fa-copy {
  display: none !important;
}

.nbinput .highlight button {
  pointer-events: none;
  cursor: default;
}

.nbinput .highlight button:hover {
  background-color: inherit;
  color: inherit;
}

.highlight {
  position: relative;
}

.copy-icon {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  opacity: 0.5;
  color: rgb(129, 129, 131);
  /* default color */
  transition: color 0.3s ease, opacity 0.3s ease;
  /* smooth transition for color and opacity changes */
}

.copy-icon:hover {
  color: #0194e2;
  /* color when hovered over */
  opacity: 1;
}

.copy-message {
  position: absolute;
  top: 0;
  left: 100%;
  margin-left: -5rem;
  background-color: transparent !important;
  font-size: 1rem;
  padding: 0;
  border-radius: 0;
  white-space: nowrap;
  font-weight: 400;
  color: darkslategrey;
  transform: translateY(-10%);
}

/**
 * Display boxes for text breakout list structures
 */

.boxes-wrapper {
  display: flex;
  /* This makes children flex items */
  justify-content: space-between;
  /* Creates space between the boxes */
}

.left-box,
.right-box {
  flex: 1;
  /* This ensures that both boxes try to take up equal width */
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 15px;
  background-color: #f9f9f9;
  margin: 0 5px;
  /* Gives some space between the boxes */
  box-sizing: border-box;
  /* Ensures padding and border are included in the element's total width and height */
  text-align: left;
}

.right-box {
  margin-right: 0;
  /* Resetting any margin for the right-most box */
}

/**
 * Hierarchical relationships diagram
 */

.hierarchy-container {
  font-family: Arial, sans-serif;
  margin: 7.5px;
  position: relative;
}

.hierarchy-item {
  display: block;
  /* Start each element on a new line */
  width: fit-content;
  /* Adjust box width to the text */
  border-radius: 10px;
  background-color: #f0f0f0;
  padding: 4px 8px;
  /* Vertical and horizontal padding */
  margin: 4px 0;
  /* Vertical margin */
  border: 2px solid #0194e2;
  position: relative;
}

.level-1 {
  margin-left: 40px;
}

.level-2 {
  margin-left: 80px;
}

.level-3 {
  margin-left: 120px;
}

.level-4 {
  margin-left: 160px;
}

/**
 * Download button
 */
a.download-btn {
  display: inline-block;
  padding: 8px 12px;
  border: 1px solid #007acc;
  background-color: #007acc;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 10px;
}

a.download-btn i.fas {
  margin-right: 5px;
  /* Add some space between the icon and the text */
}

/**
 * Download button specifically for notebooks
 */
a.notebook-download-btn {
  display: inline-block;
  padding: 8px 12px;
  border: 1px solid #007acc;
  background-color: #007acc;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

a.notebook-download-btn:hover {
  background-color: #005fa3;
}

a.notebook-download-btn i.fas {
  margin-right: 5px;
}

/**
 * Logo cards
 */

.logo-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  margin-right: 2rem;
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.logo-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  font-size: 1rem;
  height: 100%;
  width: 100%;
  border-radius: 15px;
  transition: all 500ms;
  overflow: hidden;
  padding: 0.5rem;
  margin: 1rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
}

.logo-card:hover {
  box-shadow: rgba(2, 8, 20, 0.3) 0px 2.5rem 5rem,
    rgba(2, 8, 20, 0.24) 0.5px 1.5rem 1.65rem;
}

.logo-card img {
  max-width: 150px;
  max-height: 80px;
}

.logo-link {
  display: block;
  text-decoration: none;
}

/**
 * Overrides for notebook dataframe display header rendering 
 * This change helps to prevent long column names from compressing and overwriting one another
 */

/* Adjust table layout within notebook render */
.nboutput .output_area.rendered_html table {
  table-layout: auto !important;
  width: 100% !important;
}

/* Adjust table cell padding within notebook render */
.nboutput .output_area.rendered_html table th,
.nboutput .output_area.rendered_html table td {
  padding: 8px 12px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  /* Adjust as needed */
  white-space: nowrap;
}

/**
 * Override the stderr output coloring for notebook rendering
 */

.nboutput .output_area.stderr .highlight {
  background-color: hsl(120, 65%, 90%) !important;
}
```

--------------------------------------------------------------------------------

````
