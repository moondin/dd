---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 147
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 147 of 991)

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

---[FILE: custom.css]---
Location: mlflow-master/docs/src/css/custom.css

```text
@import 'tailwindcss';

/**
 * MLflow Documentation Styling
 * Organized by section and functionality
 *
 * Any CSS included here will be global. The classic template
 * bundles Infima by default. Infima is a CSS framework designed to
 * work well for content-centric websites.
 */
:root {
  --color-brand-red: #eb1700;
}

/* --------------------------------
 * 0. Override tailwinds reset of li and ul elements styling
 * --------------------------------*/
.markdown ul,
.theme-doc-markdown ul,
article ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.markdown ol,
.theme-doc-markdown ol,
article ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.markdown li,
.theme-doc-markdown li,
article li {
  margin-bottom: 0.25rem;
}

/* Nested lists */
.markdown ul ul,
.theme-doc-markdown ul ul,
article ul ul {
  list-style-type: circle;
  margin-bottom: 0.5rem;
}

.markdown ul ul ul,
.theme-doc-markdown ul ul ul,
article ul ul ul {
  list-style-type: square;
}

/* --------------------------------
 * 1. Font Imports and Typography
 * -------------------------------- */
/* Import DM Sans for body text and DM Mono for code */
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

:root[data-theme='light'] {
  --background-color: var(--background-color-light);
}

/* Apply fonts */
:root {
  --background-color-light: white;
  --background-color-dark: rgb(14, 20, 22);
  --background-color: var(--background-color-dark);
  background-color: var(--background-color);

  /* Font family variables */
  --ifm-font-family-base:
    'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  --ifm-font-family-monospace:
    'DM Mono', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  --ifm-navbar-background-color: var(--background-color);

  /* Font weight variables - per designer specs */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Typography scale based on designer specs */
  /* the font variables are overwritten by Docusaurus */
  /* https://github.com/facebook/docusaurus/issues/6934 */
  --font-size-h1: 3rem;
  --font-size-h2: 2rem;
  --font-size-h3: 1.5rem;
  --font-size-h4: 1.3rem;
  --font-size-h5: 1.2rem;
  --font-size-body-l: 18px;
  --font-size-body-m: 16px;
  --font-size-body-s: 14px;
  --font-size-label-l: 14px;
  --font-size-label-s: 12px;

  /* Line heights per designer specs */
  --line-height-h1: 100%;
  --line-height-h2: 120%;
  --line-height-h3: 120%;
  --line-height-h4: 120%;
  --line-height-h5: 120%;
  --line-height-body: 140%;
  --line-height-label: 120%;

  /* Letter spacing per designer specs */
  --letter-spacing-h1: -3%;
  --letter-spacing-h2: -1%;
  --letter-spacing-h3: -1%;
  --letter-spacing-h4: 0;
  --letter-spacing-h5: 0;
  --letter-spacing-body: 0;
  --letter-spacing-label: 8%;

  /* Map to Docusaurus variables */
  --ifm-font-size-base: var(--font-size-body-s);
  --ifm-line-height-base: 1.4;
  --ifm-h1-font-size: var(--font-size-h1);
  --ifm-h2-font-size: var(--font-size-h2);
  --ifm-h3-font-size: var(--font-size-h3);
  --ifm-h4-font-size: var(--font-size-h4);
  --ifm-h5-font-size: var(--font-size-h5);

  /* Common layout variables */
  --card-border-radius: 4px;
  --card-shadow1: rgba(50, 50, 93, 0.05);
  --card-shadow2: rgba(50, 50, 93, 0.08);
  --card-shadow3: rgba(0, 0, 0, 0.05);
  --card-hover-shadow:
    0 0 0 1px var(--card-shadow1), 0 0 14px 5px var(--card-shadow2), 0 0 10px 3px var(--card-shadow3);
  --padding-xs: 4px;
  --padding-sm: 8px;
  --padding-md: 16px;
  --padding-lg: 24px;
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);

  /* Color system */
  /* Light mode colors */
  --ifm-border-color: #6b7280;
  --ifm-color-emphasis-hover: #000000;
  --ifm-link-color: #0194e2;

  /* Site-wide shadow colors */
  --ifm-shadow-light: rgba(0, 0, 0, 0.1);
  --ifm-shadow-medium: rgba(0, 0, 0, 0.15);
  --ifm-shadow-heavy: rgba(0, 0, 0, 0.25);
  --ifm-shadow-tile-hover: 0 10px 30px var(--ifm-shadow-light);

  /* Dynamic Coloring based on theme selection */
  --ifm-color-primary: #0194e2;
  --ifm-color-primary-dark: #0086cf;
  --ifm-color-primary-darker: #0072b0;
  --ifm-color-primary-darkest: #02659c;
  --ifm-color-primary-light: #43c9ed;
  --ifm-color-primary-lighter: #4accf0;
  --ifm-color-primary-lightest: #54cef0;

  /* ML - Blue theme */
  --ml-color-primary: #0194e2;

  /* GenAI - Red theme */
  --genai-color-primary: #eb1700;
  --genai-color-primary-dark: #d21400;
  --genai-color-primary-darker: #b91100;
  --genai-color-primary-darkest: #9f0f00;
  --genai-color-primary-light: #ff3a23;
  --genai-color-primary-lighter: #ff6c59;
  --genai-color-primary-lightest: #ff9d8f;

  /* Secondary colors */
  --ifm-color-secondary: #85552e;
  --ifm-color-secondary-dark: #784c29;
  --ifm-color-secondary-darker: #714827;
  --ifm-color-secondary-darkest: #5d3b20;
  --ifm-color-secondary-light: #925d33;
  --ifm-color-secondary-lighter: #996235;
  --ifm-color-secondary-lightest: #ad6e3c;

  /* Danger colors */
  --ifm-color-danger: #852e5e;
  --ifm-color-danger-dark: #782955;
  --ifm-color-danger-darker: #712750;
  --ifm-color-danger-darkest: #5d2042;
  --ifm-color-danger-light: #923368;
  --ifm-color-danger-lighter: #99356c;
  --ifm-color-danger-lightest: #ad3c7b;

  /* Info colors */
  --ifm-color-info: #2e8581;
  --ifm-color-info-dark: #297873;
  --ifm-color-info-darker: #27716d;
  --ifm-color-info-darkest: #205d5a;
  --ifm-color-info-light: #33928c;
  --ifm-color-info-lighter: #359994;
  --ifm-color-info-lightest: #3cada7;

  /* Footer colors */
  --ifm-footer-background-color: #303846;
  --ifm-footer-color: #ebedf0;
  --ifm-footer-link-color: #ebedf0;
}

body {
  font-family: var(--ifm-font-family-base);
  font-size: var(--font-size-body-s);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-body);
  letter-spacing: var(--letter-spacing-body);
}

/* Unified link styling for both Classic ML and GenAI modes */
a {
  color: var(--ifm-link-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--ifm-color-emphasis-hover);
  text-decoration: none;
}

/* Exception for sidebar links which have their own styling */
.menu__link {
  color: var(--ifm-border-color);
}

.menu__link:hover {
  color: var(--ifm-color-emphasis-hover);
}

h1 {
  font-family: var(--ifm-font-family-base);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-h1);
  letter-spacing: -0.03em; /* -3% */
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

h2 {
  font-family: var(--ifm-font-family-base);
  font-size: var(--ifm-h2-font-size) !important;
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-h2);
  letter-spacing: -0.01em; /* -1% */
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

h3 {
  font-family: var(--ifm-font-family-base);
  font-size: var(--ifm-h3-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-h3);
  letter-spacing: -0.01em; /* -1% */
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

h4 {
  font-family: var(--ifm-font-family-base);
  font-size: var(--ifm-h4-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-h4);
  letter-spacing: 0; /* 0% */
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

h5 {
  font-family: var(--ifm-font-family-base);
  font-size: var(--ifm-h5-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-h5);
  letter-spacing: 0; /* 0% */
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

/* Body text classes */
.body-large {
  font-size: var(--font-size-body-l);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-body);
  letter-spacing: var(--letter-spacing-body);
}

.body-medium {
  font-size: var(--font-size-body-m);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-body);
  letter-spacing: var(--letter-spacing-body);
}

.body-small {
  font-size: var(--font-size-body-s);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-body);
  letter-spacing: var(--letter-spacing-body);
}

/* Label classes */
.label-large {
  font-size: var(--font-size-label-l);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-label);
  letter-spacing: 0.08em; /* 8% */
  text-transform: uppercase;
}

.label-small {
  font-size: var(--font-size-label-s);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-label);
  letter-spacing: 0.08em; /* 8% */
  text-transform: uppercase;
}

code,
pre,
kbd {
  font-family: var(--ifm-font-family-monospace);
}

/* Dark mode overrides */
[data-theme='dark'] {
  --ifm-color-primary: #0194e2;
  --ifm-color-primary-dark: #0086cf;
  --ifm-color-primary-darker: #0072b0;
  --ifm-color-primary-darkest: #02659c;
  --ifm-color-primary-light: #43c9ed;
  --ifm-color-primary-lighter: #4accf0;
  --ifm-color-primary-lightest: #54cef0;

  /* Dark mode colors */
  --ifm-border-color: #9ca3af;
  --ifm-color-emphasis-hover: #ffffff;
  --ifm-link-color: #43c9ed;

  /* Dark mode shadow colors */
  --ifm-shadow-light: rgba(255, 255, 255, 0.1);
  --ifm-shadow-medium: rgba(255, 255, 255, 0.15);
  --ifm-shadow-heavy: rgba(255, 255, 255, 0.25);
  --ifm-shadow-tile-hover: 0 10px 30px var(--ifm-shadow-light);

  /* Inverted shadows */
  --card-shadow1: rgba(162, 162, 162, 0.5);
  --card-shadow2: rgba(162, 162, 162, 0.5);
  --card-shadow3: rgba(255, 255, 255, 0.3);

  /* Secondary colors */
  --ifm-color-secondary: #c2a025;
  --ifm-color-secondary-dark: #af9021;
  --ifm-color-secondary-darker: #a5881f;
  --ifm-color-secondary-darkest: #88701a;
  --ifm-color-secondary-light: #d5b029;
  --ifm-color-secondary-lighter: #d8b432;
  --ifm-color-secondary-lightest: #ddbf4f;

  /* Danger colors */
  --ifm-color-danger: #c22547;
  --ifm-color-danger-dark: #af2140;
  --ifm-color-danger-darker: #a51f3c;
  --ifm-color-danger-darkest: #881a32;
  --ifm-color-danger-light: #d5294e;
  --ifm-color-danger-lighter: #d83256;
  --ifm-color-danger-lightest: #dd4f6d;

  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);

  /* Info colors */
  --ifm-color-info: #2595c2;
  --ifm-color-info-dark: #2187af;
  --ifm-color-info-darker: #1f7fa5;
  --ifm-color-info-darkest: #1a6988;
  --ifm-color-info-light: #29a4d5;
  --ifm-color-info-lighter: #32a9d8;
  --ifm-color-info-lightest: #4fb4dd;
}

/* --------------------------------
 * 2. Theme Switching
 * -------------------------------- */

/* GenAI theme activation */
html[data-genai-theme='true'] {
  --ifm-color-primary: var(--genai-color-primary);
  --ifm-color-primary-dark: var(--genai-color-primary-dark);
  --ifm-color-primary-darker: var(--genai-color-primary-darker);
  --ifm-color-primary-darkest: var(--genai-color-primary-darkest);
  --ifm-color-primary-light: var(--genai-color-primary-light);
  --ifm-color-primary-lighter: var(--genai-color-primary-lighter);
  --ifm-color-primary-lightest: var(--genai-color-primary-lightest);
}

/* --------------------------------
 * 3. Navigation Bar Styling
 * -------------------------------- */

/* Base styling for all navbar links */
.navbar__link {
  color: var(--ifm-border-color);
  position: relative;
  transition: color 0.2s ease;
}

/* Hover state for navbar links */
.navbar__link:not(.navbar__link--active):hover {
  color: var(--ifm-color-emphasis-hover);
  background-color: transparent;
}

.navbar__item:hover::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--ifm-border-color);
  opacity: 0.5;
}

.github-link {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

/* --------------------------------
 * 4. Sidebar Styling
 * -------------------------------- */

/* Sidebar background color and spacing */
.theme-doc-sidebar-container {
  background-color: transparent;
  border-right: none !important;
  padding-top: 1rem;
  margin-right: 2rem;
}

/* Common sidebar styles for both themes */
.menu__list {
  padding-left: 0.5rem;
}

.sidebar-top-level-category > .menu__link,
.sidebar-top-level-category > .menu__list-item-collapsible > .menu__link {
  font-size: var(--font-size-body-s);
  font-weight: var(--font-weight-medium);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1.5rem;
}

.menu__list-item:not(.sidebar-top-level-category) > .menu__link,
.menu__list-item:not(.sidebar-top-level-category) > .menu__list-item-collapsible > .menu__link {
  font-size: var(--font-size-body-s);
  padding-left: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

/* Regular menu links */
.menu__link {
  color: var(--ifm-border-color);
  transition: color 0.2s ease;
}

/* Active link styling for light and dark modes */
.menu__link--active {
  position: relative;
}

/* Light mode */
html[data-theme='light'] .menu__link--active {
  color: #000000; /* Pure black text */
  background-color: transparent; /* No background color */
  font-weight: var(--font-weight-medium);
}

/* Dark mode */
html[data-theme='dark'] .menu__link--active {
  color: #ffffff; /* Pure white text */
  background-color: transparent; /* No background color */
  font-weight: var(--font-weight-medium);
}

/* Make the collapse button smaller */
.menu__caret:before,
.menu__link--sublist-caret:after {
  background: var(--ifm-menu-link-sublist-icon) 50% / 1.5rem 1.5rem;
}

/* Hover states */
.menu__link:hover:not(.menu__link--active) {
  color: var(--ifm-color-emphasis-hover); /* Use hover variable */
  background-color: transparent;
}

/* External link icon in sidebar - make existing icon smaller */
.menu__link--external svg,
.menu__link[href^='http'] svg,
.menu__link[href^='https'] svg,
.menu a[target='_blank'] svg,
.menu a[rel*='noopener'] svg {
  width: 10px;
  height: 10px;
  vertical-align: middle;
  margin-left: 0.2em;
}

/* --------------------------------
 * 5. Content Navigation
 * -------------------------------- */

/* Align breadcrumb items */
.breadcrumbs {
  display: flex;
}

.breadcrumbs__item {
  display: inline-flex;
  align-items: center;
}

/* Breadcrumbs - make uniform with the link color scheme */
.breadcrumbs__link {
  color: var(--ifm-border-color);
}

.breadcrumbs__link:hover {
  color: var(--ifm-color-emphasis-hover);
}

/* Active breadcrumb - consistent with active sidebar styling */
.breadcrumbs__link--active {
  color: var(--ifm-color-emphasis-hover); /* Black in light mode, White in dark mode */
}

/* Breadcrumb separator */
.breadcrumbs__item--active .breadcrumbs__link {
  background: none;
  color: var(--ifm-color-emphasis-hover);
}

.pagination-nav {
  gap: 0;
}

/* Make pagination consistent with the link colors */
.pagination-nav__link {
  color: var(--ifm-border-color);
  border-radius: 0;
  padding-block: 2rem;
  position: relative;
}

.pagination-nav__link:hover {
  background-color: var(--ifm-background-color);
  border-color: var(--ifm-color-emphasis-300);
}

.pagination-nav__link .pagination-nav__sublabel {
  font-size: var(--font-size-base);
  color: var(--ifm-border-color);
  padding-top: 0.5rem;
}

.pagination-nav__link .pagination-nav__label {
  font-size: var(--font-size-h5);
  color: var(--ifm-color-emphasis-hover);
}

.pagination-nav__link--next {
  padding-right: 3rem;
}

.pagination-nav__link--prev {
  padding-left: 3rem;
}

/* Pagination arrows now use the same color scheme instead of theme colors */
.pagination-nav__link--next .pagination-nav__label::after {
  content: '';
}
.pagination-nav__link--prev .pagination-nav__label::before {
  content: '';
}

.pagination-nav__link--next::after {
  content: '>';
  color: var(--ifm-border-color);
  font-size: 2rem;
  position: absolute;
  right: 1rem;
  top: 33%;
}

.pagination-nav__link--prev::before {
  content: '<';
  color: var(--ifm-border-color);
  font-size: 2rem;
  position: absolute;
  left: 1rem;
  top: 33%;
}

/* Hover state for pagination arrows */
.pagination-nav__link:hover .pagination-nav__label::after,
.pagination-nav__link:hover .pagination-nav__label::before {
  color: var(--ifm-color-emphasis-hover);
}

/* --------------------------------
 * 6. Layout Utilities
 * -------------------------------- */

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-item {
  box-sizing: border-box;
  flex: 1;
}

.padding-md {
  padding: var(--padding-md);
}

.center-div {
  margin-inline: auto;
}

/* --------------------------------
 * 6.1. Modern Landing Page Components
 * -------------------------------- */

/* Hero Section */
.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 4rem;
  min-height: 400px;
}

.hero-text {
  flex: 1;
  max-width: 600px;
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: var(--ifm-color-emphasis-hover);
}

.hero-text p {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--ifm-border-color);
  margin-bottom: 2.5rem;
}

.hero-image {
  flex: 1;
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: var(--ifm-shadow-tile-hover);
}

/* Tiles Grid */
.tiles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Responsive Design */
@media (max-width: 996px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }

  .hero-text h1 {
    font-size: 2.5rem;
  }

  .tiles-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .why-content {
    flex-direction: column;
    gap: 2rem;
  }

  .value-prop-badge {
    justify-content: center;
  }

  .feature-highlights {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
  }

  .hero-text h1 {
    font-size: 2rem;
  }

  .tiles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .tile-card {
    padding: 1.5rem;
  }
}

/* --------------------------------
 * 7. Image Styling
 * -------------------------------- */

/* Most of our images are PNGs with transparent
backgrounds so they look bad in dark mode */
main img {
  background-color: white;
}

/* We need to this class to limit image size using max-height. The class
must be applied to the wrapping div along with the desired max-height */
.max-height-img-container {
  display: flex;
}

.max-height-img-container > * {
  display: flex;
  justify-content: center;
}

.max-height-img-container img {
  max-height: 100%;
  width: auto;
}

/* --------------------------------
 * 7.1. Video Styling
 * -------------------------------- */

video {
  border-radius: 12px;
  border: 1px solid var(--ifm-color-gray-300);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* --------------------------------
 * 8. Accessibility
 * -------------------------------- */

/* This class is to be used in non-heading elements that contain a hash link reference.
In headlines Docusaurus adds this for us. */
.anchor-with-sticky-navbar {
  scroll-margin-top: calc(var(--ifm-navbar-height) + 0.5rem);
}

/* --------------------------------
 * 9. Landing Page Specific Styles
 * -------------------------------- */
.homepage .megaHeading {
  font-family: var(--ifm-font-family-base);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-h1);
  letter-spacing: -0.03em; /* -3% */
}

/* --------------------------------
 * 10. Code Blocks & Syntax Highlighting
 * -------------------------------- */

/* Code blocks */
.codeBlockContainer {
  margin-bottom: 1.5rem;
}

.theme-code-block {
  max-width: 100%;
  min-width: 0;
}

/* Inline code */
:not(pre) > code {
  border-radius: 4px;
  padding: 0.2em 0.4em;
  font-size: 85%;
}

/* --------------------------------
 * 11. Table Styles
 * -------------------------------- */

table {
  width: 100%;
  margin-bottom: 1.5rem;
  display: table;
  border-collapse: separate;
  border-spacing: 0;
}

th,
td {
  padding: var(--padding-sm) var(--padding-md);
  border: 1px solid var(--ifm-border-color);
}

th {
  font-weight: var(--font-weight-semibold);
  text-align: left;
}

/* --------------------------------
 * 12. Tabs Component
 * -------------------------------- */

.tabs {
  margin-bottom: 1.5rem;
}

.tabs__item {
  padding: var(--padding-sm) var(--padding-md);
  border-radius: 0;
  color: var(--ifm-border-color);
}

.tabs__item:hover {
  color: var(--ifm-color-emphasis-hover);
  background-color: transparent;
}

.tabs__item--active {
  color: var(--ifm-color-emphasis-hover);
  border-bottom: 2px solid var(--ifm-color-emphasis-hover);
}

[role='tabpanel'] {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  margin-left: 0.5rem;
}

/* --------------------------------
 * 13. Admonitions (Callouts)
 * -------------------------------- */

.admonition {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border-left: 8px solid;
  box-shadow: var(--card-hover-shadow);
}

.admonition-heading {
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.admonition-content {
  color: inherit;
}

/* Style admonition links to match main content */
.admonition a {
  color: var(--ifm-border-color);
}

.admonition a:hover {
  color: var(--ifm-color-emphasis-hover);
}

/* --------------------------------
 * 14. Footer
 * -------------------------------- */

.footer {
  padding: 3rem 1rem;
}

.footer__title {
  font-weight: var(--font-weight-medium);
  margin-bottom: 1rem;
}

.footer__link-item {
  color: var(--ifm-footer-link-color);
}

.footer__link-item:hover {
  color: #ffffff;
  text-decoration: none;
}

.footer__copyright {
  margin-top: 2rem;
  font-size: var(--font-size-body-s);
}

/* --------------------------------
 * 15. Documentation body
 * -------------------------------- */
[class*='docItemCol'] {
  padding-inline: 2rem;
}

.col--3 {
  padding-left: 0;
}

.theme-layout-main {
  margin-left: auto;
  margin-right: auto;
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.css]---
Location: mlflow-master/docs/src/pages/index.module.css

```text
/* Main layout container */
.homeContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1600px;
  margin: 0 auto;
  padding: 8rem 1rem 4rem;
}

/* --------------------------------
 * 1. Two Column Layout
 * -------------------------------- */
.contentGrid {
  display: flex;
  flex-direction: row;
  gap: 8rem;
  width: 100%;
  margin-top: 2rem;
  align-items: flex-start;
  min-height: calc(100vh - 300px);
  padding-inline: 2rem;
}

.textColumn {
  flex: 1;
  max-width: 650px;
}

.cardsColumn {
  flex: 1;
  max-width: 650px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* --------------------------------
 * 2. Typography
 * -------------------------------- */
.megaHeading {
  font-size: 4rem;
  line-height: 1.1;
  font-weight: 200;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  color: var(--ifm-heading-color);
}

.introText {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--ifm-color-emphasis-800);
  margin-bottom: 2rem;
}

/* --------------------------------
 * 3. Glossy Card Component
 * -------------------------------- */
.glossyCard {
  border-radius: 12px;
  overflow: hidden;
  background: var(--ifm-card-background-color);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid var(--ifm-color-emphasis-600);
  margin-bottom: 2rem;
}

[data-theme='dark'] .glossyCard {
  border: 1px solid var(--ifm-color-emphasis-300);
}

.glossyCardblue:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(1, 148, 226, 0.2);
  border-color: rgba(1, 148, 226, 0.3);
  background-color: rgba(1, 148, 226, 0.03);
}

.glossyCardred:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(235, 23, 0, 0.2);
  border-color: rgba(235, 23, 0, 0.3);
  background-color: rgba(235, 23, 0, 0.03);
}

.cardContent {
  padding: 1.5rem;
}

.cardHeader {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.colorBlock {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  flex-shrink: 0;
}

.colorBlockblue {
  background-color: var(--ifm-color-primary);
}

.colorBlockred {
  background-color: var(--genai-color-primary);
}

.cardTitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

[data-theme='light'] .cardTitle {
  color: var(--ifm-color-emphasis-900);
}

[data-theme='dark'] .cardTitle {
  color: rgba(255, 255, 255, 0.9);
}

.cardDescription {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ifm-color-emphasis-700);
  margin: 0.75rem 0 1.5rem;
}

/* --------------------------------
 * 4. Card Actions & Buttons
 * -------------------------------- */
.cardActions {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: row;
  gap: 3rem;
}

.cardButton {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  background-color: #ffffff;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Light mode border color */
[data-theme='light'] .cardButton {
  border: 1px solid var(--ifm-border-color);
  color: var(--ifm-color-emphasis-900);
}

/* Dark mode styling */
[data-theme='dark'] .cardButton {
  border: 1px solid var(--ifm-color-emphasis-300);
  background-color: var(--ifm-color-emphasis-100);
  color: var(--ifm-color-emphasis-800);
}

.arrowIcon {
  margin-left: 0.5rem;
  transition: transform 0.2s ease;
}

/* Arrow hover styling */
.cardButton:hover .arrowIcon {
  transform: translateX(3px);
}

/* Button hover styling */
.cardButton:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

[data-theme='dark'] .cardButton:hover {
  background-color: var(--ifm-color-emphasis-200);
  color: rgba(0, 0, 0, 0.9);
  border-color: var(--ifm-color-emphasis-400);
}

/* --------------------------------
 * 5. Dark Mode Adjustments
 * -------------------------------- */
[data-theme='dark'] .glossyCardblue:hover {
  background-color: rgba(1, 148, 226, 0.1);
}

[data-theme='dark'] .glossyCardred:hover {
  background-color: rgba(235, 23, 0, 0.1);
}

/* --------------------------------
 * 6. Responsive Adjustments
 * -------------------------------- */
@media (max-width: 1600px) {
  .contentGrid {
    gap: 4rem;
  }
}

@media (max-width: 996px) {
  .contentGrid {
    flex-direction: column;
  }

  .textColumn,
  .cardsColumn {
    max-width: 100%;
  }

  .homeContainer {
    padding: 2rem 0 4rem;
  }
}

@media (max-width: 768px) {
  .megaHeading {
    font-size: 2.5rem;
  }

  .introText {
    font-size: 1rem;
  }

  .cardActions {
    flex-direction: column;
    gap: 1rem;
  }

  .homeContainer {
    padding: 0 0 2rem;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/pages/index.tsx
Signals: React

```typescript
import React, { useState, useEffect } from 'react';
import { Redirect } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface PathSelectorProps {
  title: string;
  description: string;
  color: 'blue' | 'red';
  buttons: {
    text: string;
    link: string;
  }[];
}

function PathSelector({ title, description, color, buttons }: PathSelectorProps): JSX.Element {
  return (
    <div className={clsx(styles.glossyCard, styles[`glossyCard${color}`])}>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={clsx(styles.colorBlock, styles[`colorBlock${color}`])}></div>
          <h2 className={styles.cardTitle}>{title}</h2>
        </div>
        <p className={styles.cardDescription}>{description}</p>
        <div className={styles.cardActions}>
          {buttons.map((button, index) => (
            <a
              key={index}
              href={button.link}
              className={styles.cardButton}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {button.text} <span className={styles.arrowIcon}>→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add('homepage');
    return () => {
      document.body.classList.remove('homepage');
    };
  }, []);

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <Layout
      title={siteConfig.title}
      description="MLflow Documentation - Machine Learning and GenAI lifecycle management"
    >
      <main className={styles.homeContainer}>
        <div className={styles.contentGrid}>
          <div className={styles.textColumn}>
            <h1 className={styles.megaHeading}>Documentation</h1>
            <p className={styles.introText}>
              Welcome to the MLflow Documentation. Our documentation is organized into two sections to help you find
              exactly what you need. Choose Model Training for traditional ML workflows, or select GenAI Apps & Agents
              for generative AI applications, tracing, and evaluation tools.
            </p>
          </div>

          <div className={styles.cardsColumn}>
            <PathSelector
              title="Model Training"
              description="Access comprehensive guides for experiment tracking, model packaging, registry management,
              and deployment. Get started with MLflow's core functionality for traditional machine
              learning workflows, hyperparameter tuning, and model lifecycle management."
              color="blue"
              buttons={[
                {
                  text: 'Open Source',
                  link: useBaseUrl('/ml/'),
                },
                {
                  text: 'MLflow on Databricks',
                  link: 'https://docs.databricks.com/aws/en/mlflow/',
                },
              ]}
            />

            <PathSelector
              title="GenAI Apps & Agents"
              description="Explore tools for GenAI tracing, prompt management, foundation model deployment,
              and evaluation frameworks. Learn how to track, evaluate, and optimize your generative
              AI applications and agent workflows with MLflow."
              color="red"
              buttons={[
                {
                  text: 'Open Source',
                  link: useBaseUrl('/genai/'),
                },
                {
                  text: 'MLflow on Databricks',
                  link: 'https://docs.databricks.com/aws/en/mlflow3/genai/',
                },
              ]}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: tailwind-config.cjs]---
Location: mlflow-master/docs/src/plugins/tailwind-config.cjs

```text
function tailwindPlugin(context, options) {
  return {
    name: "tailwind-plugin",
    configurePostCss(postcssOptions) {
      postcssOptions.plugins = [
        require("@tailwindcss/postcss"),
      ];
      return postcssOptions;
    },
  };
}

module.exports = tailwindPlugin;
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/theme/CodeBlock/ContentHeader/index.tsx
Signals: React

```typescript
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Buttons from '@theme/CodeBlock/Buttons';
import styles from './styles.module.css';

export interface ContentHeaderProps {
  language?: string;
}

export default function ContentHeader({ language }: ContentHeaderProps): ReactNode {
  return (
    <div
      className={clsx(styles.codeBlockHeader)}
      aria-label={`Code block header for ${language} code with copy and toggle buttons`}
    >
      <span className={styles.languageLabel}>{language}</span>
      <Buttons />
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/theme/CodeBlock/ContentHeader/styles.module.css

```text
.codeBlockHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: var(--prism-background-color);
  position: sticky;
  top: var(--ifm-navbar-height, 3.125rem); /* Stick below the Docusaurus navbar; fallback for safety */
}

.languageLabel {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ifm-color-emphasis-600);
  padding: 0.3125rem;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/theme/CodeBlock/Layout/index.tsx
Signals: React

```typescript
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { useCodeBlockContext } from '@docusaurus/theme-common/internal';
import Container from '@theme/CodeBlock/Container';
import Title from '@theme/CodeBlock/Title';
import Content from '@theme/CodeBlock/Content';
import type { Props } from '@theme/CodeBlock/Layout';
import ContentHeader from '../ContentHeader';

import styles from './styles.module.css';

export default function CodeBlockLayout({ className }: Props): ReactNode {
  const { metadata } = useCodeBlockContext();
  const language = metadata.language || 'text'; // Use 'text' as a fallback when metadata.language is undefined.
  return (
    <Container as="div" className={clsx(className, metadata.className)}>
      {metadata.title && (
        <div className={styles.codeBlockTitle}>
          <Title>{metadata.title}</Title>
        </div>
      )}
      <div className={styles.codeBlockContent}>
        <ContentHeader language={language} />
        <Content />
      </div>
    </Container>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: mlflow-master/docs/src/theme/CodeBlock/Layout/styles.module.css

```text
.codeBlockContent {
  position: relative;
  /* rtl:ignore */
  direction: ltr;
  border-radius: inherit;
}

.codeBlockTitle {
  border-bottom: 1px solid var(--ifm-color-emphasis-300);
  font-size: var(--ifm-code-font-size);
  font-weight: 500;
  padding: 0.75rem var(--ifm-pre-padding);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.codeBlockTitle + .codeBlockContent .codeBlock {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/docs/src/theme/Footer/index.tsx
Signals: React

```typescript
import { useLocation } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Footer } from '@site/src/components/Footer/Footer';
import React from 'react';

function getFooterVariant(pathname: string) {
  const genAI = useBaseUrl('/genai');
  const classicalML = useBaseUrl('/ml');

  if (pathname.startsWith(genAI)) {
    return 'red';
  } else if (pathname.startsWith(classicalML)) {
    return 'blue';
  } else {
    return 'colorful';
  }
}

function FooterWrapper() {
  const location = useLocation();
  const variant = getFooterVariant(location.pathname);
  return <Footer variant={variant} />;
}

export default React.memo(FooterWrapper);
```

--------------------------------------------------------------------------------

---[FILE: ComponentTypes.tsx]---
Location: mlflow-master/docs/src/theme/NavbarItem/ComponentTypes.tsx

```typescript
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import DocsDropdown from '@site/src/components/NavbarItems/DocsDropdown';
import VersionSelector from '@site/src/components/NavbarItems/VersionSelector';

export default {
  ...ComponentTypes,
  'custom-docsDropdown': DocsDropdown,
  'custom-versionSelector': VersionSelector,
};
```

--------------------------------------------------------------------------------

---[FILE: logo-dark.svg]---
Location: mlflow-master/docs/static/images/logo-dark.svg

```text
<svg width="109" height="40" viewBox="0 0 109 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 31.0316V15.5024H3.54258V17.4699C4.43636 15.8756 6.38278 15.045 8.13589 15.045C10.178 15.045 11.9636 15.9713 12.7943 17.7895C14.0096 15.7474 15.8278 15.045 17.8373 15.045C20.6469 15.045 23.3263 16.8325 23.3263 20.9493V31.0316H19.7531V21.5541C19.7531 19.7359 18.8268 18.3636 16.7522 18.3636C14.8057 18.3636 13.5292 19.8947 13.5292 21.8086V31.0297H9.89282V21.5541C9.89282 19.7684 8.99522 18.3732 6.88995 18.3732C4.91292 18.3732 3.66699 19.8412 3.66699 21.8182V31.0392Z" fill="white"/>
<path d="M27.8546 31.0316V7.92917H31.5579V31.0316Z" fill="white"/>
<path d="M30.0708 39.4871C30.9033 39.7187 31.6517 39.8699 33.2402 39.8699C36.1933 39.8699 39.6765 38.2048 40.5933 33.5311L44.3789 14.7923H50.0076L50.6947 11.6746H45.0086L45.7741 7.95023C46.3598 5.05837 47.9598 3.59234 50.5282 3.59234C51.1962 3.59234 51.0086 3.64975 51.6038 3.76267L52.4268 0.570327C51.6344 0.333006 50.9244 0.191379 49.378 0.191379C47.7454 0.166831 46.1514 0.688934 44.8497 1.67463C43.4086 2.78851 42.4574 4.42487 42.023 6.53779L40.9569 11.6746H35.9234L35.5119 14.7943H40.3349L36.8593 32.1206C36.4765 34.0861 35.3588 36.4364 32.1512 36.4364C31.4239 36.4364 31.688 36.3809 31.0297 36.2737Z" fill="#0194E2"/>
<path d="M53.3416 30.9053H49.6402L54.7139 7.59616H58.4153Z" fill="#0194E2"/>
<path d="M71.8067 16.4766C68.5762 14.2161 64.1778 14.6606 61.4649 17.5216C58.7519 20.3826 58.5416 24.7984 60.9703 27.9043L63.3952 26.1244C62.1915 24.6312 61.9471 22.5815 62.7658 20.8471C63.5845 19.1127 65.3224 17.9987 67.2402 17.979V19.8737Z" fill="#43C9ED"/>
<path d="M62.6179 29.4717C65.8484 31.7322 70.2468 31.2877 72.9597 28.4267C75.6727 25.5657 75.883 21.1499 73.4543 18.044L71.0294 19.8239C72.2331 21.3171 72.4775 23.3668 71.6588 25.1012C70.8401 26.8356 69.1022 27.9496 67.1844 27.9693V26.0746Z" fill="#0194E2"/>
<path d="M78.0919 15.4928H82.1359L82.9588 26.1053L88.7177 15.4928L92.5569 15.5483L94.0651 26.1053L99.1387 15.4928L102.84 15.5483L95.1617 31.0412H91.4603L89.6765 19.9349L83.7818 31.0412H79.9426Z" fill="#0194E2"/>
<path d="M105.072 15.7684H104.306V15.5024H106.151V15.7741H105.386V18.0172H105.072Z" fill="#0194E2"/>
<path d="M106.614 15.5024H106.997L107.479 16.8421C107.541 17.0143 107.598 17.1904 107.657 17.3665H107.675C107.734 17.1904 107.788 17.0143 107.847 16.8421L108.325 15.5024H108.708V18.0172H108.41V16.6297C108.41 16.4096 108.434 16.1072 108.45 15.8832H108.434L108.243 16.4574L107.768 17.7608H107.56L107.079 16.4593L106.888 15.8852H106.873C106.89 16.1091 106.915 16.4115 106.915 16.6316V18.0191H106.624Z" fill="#0194E2"/>
</svg>
```

--------------------------------------------------------------------------------

````
