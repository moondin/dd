---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 13
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 13 of 37)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - create-react-app-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/create-react-app-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: integrating-with-an-api-backend.md]---
Location: create-react-app-main/docusaurus/docs/integrating-with-an-api-backend.md

```text
---
id: integrating-with-an-api-backend
title: Integrating with an API Backend
sidebar_label: Integrating with an API
---

These tutorials will help you to integrate your app with an API backend running on another port,
using `fetch()` to access it.

## Node

Check out [this tutorial](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/).
You can find the companion GitHub repository [here](https://github.com/fullstackreact/food-lookup-demo).

## Ruby on Rails

Check out [this tutorial](https://www.fullstackreact.com/articles/how-to-get-create-react-app-to-work-with-your-rails-api/).
You can find the companion GitHub repository [here](https://github.com/fullstackreact/food-lookup-demo-rails).

## API Platform (PHP and Symfony)

[API Platform](https://api-platform.com) is a framework designed to build API-driven projects.
It allows creating hypermedia and GraphQL APIs in minutes.
It is shipped with an official Progressive Web App generator as well as a dynamic administration interface, both built for Create React App.
Check out [this tutorial](https://api-platform.com/docs/distribution).

## C# (ASP.NET Core)

ASP.NET Core has a React project template that uses Create React App. Check out [their documentation](https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react).
```

--------------------------------------------------------------------------------

---[FILE: loading-graphql-files.md]---
Location: create-react-app-main/docusaurus/docs/loading-graphql-files.md

```text
---
id: loading-graphql-files
title: Loading .graphql Files
sidebar_label: Loading .graphql Files
---

To load `.gql` and `.graphql` files, first install the [`graphql`](https://www.npmjs.com/package/graphql) and [`graphql.macro`](https://www.npmjs.com/package/graphql.macro) packages by running:

```sh
npm install --save graphql graphql.macro
```

Alternatively you may use `yarn`:

```sh
yarn add graphql graphql.macro
```

Then, whenever you want to load `.gql` or `.graphql` files, import the `loader` from the macro package:

```js
import { loader } from 'graphql.macro';

const query = loader('./foo.graphql');
```

And your results get automatically inlined! This means that if the file above, `foo.graphql`, contains the following:

```graphql
query {
  hello {
    world
  }
}
```

The previous example turns into:

```javascript
const query = {
  'kind': 'Document',
  'definitions': [{
    ...
  }],
  'loc': {
    ...
    'source': {
      'body': '\\\\n  query {\\\\n    hello {\\\\n      world\\\\n    }\\\\n  }\\\\n',
      'name': 'GraphQL request',
      ...
    }
  }
};
```

You can also use the `gql` template tag the same way you would use the non-macro version from `graphql-tag` package with the added benefit of inlined parsing results.

```js
import { gql } from 'graphql.macro';

const query = gql`
  query User {
    user(id: 5) {
      lastName
      ...UserEntry1
    }
  }
`;
```
```

--------------------------------------------------------------------------------

---[FILE: making-a-progressive-web-app.md]---
Location: create-react-app-main/docusaurus/docs/making-a-progressive-web-app.md

```text
---
id: making-a-progressive-web-app
title: Making a Progressive Web App
---

The production build has all the tools necessary to generate a first-class
[Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps),
but **the offline/cache-first behavior is opt-in only**.

Starting with Create React App 4, you can add a `src/service-worker.js` file to
your project to use the built-in support for
[Workbox](https://developers.google.com/web/tools/workbox/)'s
[`InjectManifest`](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest)
plugin, which will
[compile](https://developers.google.com/web/tools/workbox/guides/using-bundlers)
your service worker and inject into it a list of URLs to
[precache](https://developers.google.com/web/tools/workbox/guides/precache-files).

If you start a new project using one of the PWA [custom
templates](https://create-react-app.dev/docs/custom-templates/), you'll get a
`src/service-worker.js` file that serves as a good starting point for an
offline-first service worker:

```sh
npx create-react-app my-app --template cra-template-pwa
```

The TypeScript equivalent is:

```sh
npx create-react-app my-app --template cra-template-pwa-typescript
```

If you know that you won't be using service workers, or if you'd prefer to use a
different approach to creating your service worker, don't create a
`src/service-worker.js` file. The `InjectManifest` plugin won't be run in that
case.

In addition to creating your local `src/service-worker.js` file, it needs to be
registered before it will be used. In order to opt-in to the offline-first
behavior, developers should look for the following in their
[`src/index.js`](https://github.com/cra-template/pwa/blob/master/packages/cra-template-pwa/template/src/index.js)
file:

```js
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();
```

As the comment states, switching `serviceWorker.unregister()` to
`serviceWorker.register()` will opt you in to using the service worker.

## Why Opt-in?

Offline-first Progressive Web Apps are faster and more reliable than traditional
web pages, and provide an engaging mobile experience:

- All static site assets that are a part of your `webpack` build are cached so
  that your page loads fast on subsequent visits, regardless of network
  connectivity (such as 2G or 3G). Updates are downloaded in the background.
- Your app will work regardless of network state, even if offline. This means
  your users will be able to use your app at 10,000 feet and on the subway.
- On mobile devices, your app can be added directly to the user's home screen,
  app icon and all. This eliminates the need for the app store.

However, they [can make debugging deployments more
challenging](https://github.com/facebook/create-react-app/issues/2398).

The
[`workbox-webpack-plugin`](https://developer.chrome.com/docs/workbox/modules/workbox-webpack-plugin/)
is integrated into production configuration, and it will take care of compiling
a service worker file that will automatically precache all of your
`webpack`-generated assets and keep them up to date as you deploy updates. The
service worker will use a [cache-first
strategy](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network)
for handling all requests for `webpack`-generated assets, including [navigation
requests](https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests)
for your HTML, ensuring that your web app is consistently fast, even on a slow
or unreliable network.

Note: Resources that are not generated by `webpack`, such as static files that are
copied over from your local
[`public/` directory](https://github.com/cra-template/pwa/tree/master/packages/cra-template-pwa/template/public/)
or third-party resources, will not be precached. You can optionally set up Workbox
[routes](https://developers.google.com/web/tools/workbox/guides/route-requests)
to apply the runtime caching strategy of your choice to those resources.

## Customization

Starting with Create React App 4, you have full control over customizing the
logic in this service worker, by creating your own `src/service-worker.js` file,
or customizing the one added by the `cra-template-pwa` (or
`cra-template-pwa-typescript`) template. You can use [additional
modules](https://developers.google.com/web/tools/workbox/modules) from the
Workbox project, add in a push notification library, or remove some of the
default caching logic. The one requirement is that you keep `self.__WB_MANIFEST`
somewhere in your file, as the Workbox compilation plugin checks for this value
when generating a manifest of URLs to precache. If you would prefer not to use
precaching, you can assign `self.__WB_MANIFEST` to a variable that will be
ignored, like:

```js
// eslint-disable-next-line no-restricted-globals
const ignored = self.__WB_MANIFEST;

// Your custom service worker code goes here.
```

## Offline-First Considerations

If you do decide to opt-in to service worker registration, please take the
following into account:

1. After the initial caching is done, the [service worker lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle)
   controls when updated content ends up being shown to users. In order to guard against
   [race conditions with lazy-loaded content](https://github.com/facebook/create-react-app/issues/3613#issuecomment-353467430),
   the default behavior is to conservatively keep the updated service worker in the "[waiting](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#waiting)"
   state. This means that users will end up seeing older content until they close (reloading is not
   enough) their existing, open tabs. See [this blog post](https://jeffy.info/2018/10/10/sw-in-c-r-a.html)
   for more details about this behavior.

1. Users aren't always familiar with offline-first web apps. It can be useful to
   [let the user know](https://developers.google.com/web/fundamentals/instant-and-offline/offline-ux#inform_the_user_when_the_app_is_ready_for_offline_consumption)
   when the service worker has finished populating your caches (showing a "This web
   app works offline!" message) and also let them know when the service worker has
   fetched the latest updates that will be available the next time they load the
   page (showing a "New content is available once existing tabs are closed." message). Showing
   these messages is currently left as an exercise to the developer, but as a
   starting point, you can make use of the logic included in [`src/serviceWorkerRegistration.js`](https://github.com/cra-template/pwa/blob/master/packages/cra-template-pwa/template/src/serviceWorkerRegistration.js), which
   demonstrates which service worker lifecycle events to listen for to detect each
   scenario, and which as a default, only logs appropriate messages to the
   JavaScript console.

1. Service workers [require HTTPS](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers#you_need_https),
   although to facilitate local testing, that policy
   [does not apply to `localhost`](https://stackoverflow.com/questions/34160509/options-for-testing-service-workers-via-http/34161385#34161385).
   If your production web server does not support HTTPS, then the service worker
   registration will fail, but the rest of your web app will remain functional.

1. The service worker is only enabled in the [production environment](deployment.md),
   e.g. the output of `npm run build`. It's recommended that you do not enable an
   offline-first service worker in a development environment, as it can lead to
   frustration when previously cached assets are used and do not include the latest
   changes you've made locally.

1. If you _need_ to test your offline-first service worker locally, build
   the application (using `npm run build`) and run a standard http server from your
   build directory. After running the build script, `create-react-app` will give
   instructions for one way to test your production build locally and the [deployment instructions](deployment.md) have
   instructions for using other methods. _Be sure to always use an
   incognito window to avoid complications with your browser cache._

1. By default, the generated service worker file will not intercept or cache any
   cross-origin traffic, like HTTP [API requests](integrating-with-an-api-backend.md),
   images, or embeds loaded from a different domain. Starting with Create
   React App 4, this can be customized, as explained above.

## Progressive Web App Metadata

The default configuration includes a web app manifest located at
[`public/manifest.json`](https://github.com/cra-template/pwa/blob/master/packages/cra-template-pwa/template/public/manifest.json), that you can customize with
details specific to your web application.

When a user adds a web app to their homescreen using Chrome or Firefox on
Android, the metadata in [`manifest.json`](https://github.com/cra-template/pwa/blob/master/packages/cra-template-pwa/template/public/manifest.json) determines what
icons, names, and branding colors to use when the web app is displayed.
[The Web App Manifest guide](https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/)
provides more context about what each field means, and how your customizations
will affect your users' experience.

Progressive web apps that have been added to the homescreen will load faster and
work offline when there's an active service worker. That being said, the
metadata from the web app manifest will still be used regardless of whether or
not you opt-in to service worker registration.
```

--------------------------------------------------------------------------------

---[FILE: measuring-performance.md]---
Location: create-react-app-main/docusaurus/docs/measuring-performance.md

```text
---
id: measuring-performance
title: Measuring Performance
---

By default, Create React App includes a performance relayer that allows you to measure and analyze
the performance of your application using different metrics.

To measure any of the supported metrics, you only need to pass a function into the `reportWebVitals`
function in `index.js`:

```js
reportWebVitals(console.log);
```

This function is fired when the final values for any of the metrics have finished calculating on the
page. You can use it to log any of the results to the console or send to a particular endpoint.

## Web Vitals

[Web Vitals](https://web.dev/vitals/) are a set of useful metrics that aim to capture the user
experience of a web page. In Create React App, a third-party library is used to measure these
metrics ([web-vitals](https://github.com/GoogleChrome/web-vitals)).

To understand more about the object returned to the function when a metric value is calculated,
refer to the [documentation](https://github.com/GoogleChrome/web-vitals/#types). The [Browser
Support](https://github.com/GoogleChrome/web-vitals/#browser-support) section also explains which browsers are supported.

## Sending results to analytics

With the `reportWebVitals` function, you can send any of results to an analytics endpoint to measure and track real user performance on your site. For example:

```js
function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  const url = 'https://example.com/analytics';

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

reportWebVitals(sendToAnalytics);
```

> **Note:** If you use Google Analytics, use the `id` value to make it easier to construct metric distributions manually (to calculate percentiles, etc…).
>
> ```js
> function sendToAnalytics({ id, name, value }) {
>   ga('send', 'event', {
>     eventCategory: 'Web Vitals',
>     eventAction: name,
>     eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
>     eventLabel: id, // id unique to current page load
>     nonInteraction: true, // avoids affecting bounce rate
>   });
> }
>
> reportWebVitals(sendToAnalytics);
> ```
>
> Read more about sending results to Google Analytics [here](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics).
```

--------------------------------------------------------------------------------

---[FILE: post-processing-css.md]---
Location: create-react-app-main/docusaurus/docs/post-processing-css.md

```text
---
id: post-processing-css
title: Post-Processing CSS
---

This project setup minifies your CSS and adds vendor prefixes to it automatically through [Autoprefixer](https://github.com/postcss/autoprefixer) so you don’t need to worry about it.

Support for new CSS features like the [`all` property](https://developer.mozilla.org/en-US/docs/Web/CSS/all), [`break` properties](https://www.w3.org/TR/css-break-3/#breaking-controls), [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables), and [media query ranges](https://www.w3.org/TR/mediaqueries-4/#range-context) are automatically polyfilled to add support for older browsers.

You can customize your target support browsers by adjusting the `browserslist` key in `package.json` according to the [Browserslist specification](https://github.com/browserslist/browserslist#readme).

For example, this:

```css
.App {
  display: flex;
  flex-direction: row;
  align-items: center;
}
```

becomes this:

```css
.App {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
```

If you need to disable autoprefixing for some reason, [follow this section](https://github.com/postcss/autoprefixer#disabling).

[CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) prefixing is disabled by default, but it will **not** strip manual prefixing.
If you'd like to opt-in to CSS Grid prefixing, [first familiarize yourself about its limitations](https://github.com/postcss/autoprefixer#does-autoprefixer-polyfill-grid-layout-for-ie).

To enable CSS Grid prefixing, add `/* autoprefixer grid: autoplace */` to the top of your CSS file.
```

--------------------------------------------------------------------------------

---[FILE: pre-rendering-into-static-html-files.md]---
Location: create-react-app-main/docusaurus/docs/pre-rendering-into-static-html-files.md

```text
---
id: pre-rendering-into-static-html-files
title: Pre-Rendering into Static HTML Files
sidebar_label: Pre-Rendering Static HTML
---

If you’re hosting your `build` with a static hosting provider you can use [react-snapshot](https://www.npmjs.com/package/react-snapshot) or [react-snap](https://www.npmjs.com/package/react-snap) to generate HTML pages for each route, or relative link, in your application. These pages will then seamlessly become active, or “hydrated”, when the JavaScript bundle has loaded.

There are also opportunities to use this outside of static hosting, to take the pressure off the server when generating and caching routes.

The primary benefit of pre-rendering is that you get the core content of each page _with_ the HTML payload—regardless of whether or not your JavaScript bundle successfully downloads. It also increases the likelihood that each route of your application will be picked up by search engines.

You can read more about [zero-configuration pre-rendering (also called snapshotting) here](https://medium.com/superhighfives/an-almost-static-stack-6df0a2791319).
```

--------------------------------------------------------------------------------

---[FILE: production-build.md]---
Location: create-react-app-main/docusaurus/docs/production-build.md

```text
---
id: production-build
title: Creating a Production Build
---

`npm run build` creates a `build` directory with a production build of your app. Inside the `build/static` directory will be your JavaScript and CSS files. Each filename inside of `build/static` will contain a unique hash of the file contents. This hash in the file name enables [long term caching techniques](#static-file-caching).

When running a production build of freshly created Create React App application, there are a number of `.js` files (called _chunks_) that are generated and placed in the `build/static/js` directory:

`main.[hash].chunk.js`

- This is your _application_ code. `App.js`, etc.

`[number].[hash].chunk.js`

- These files can either be _vendor_ code, or [code splitting chunks](code-splitting.md). _Vendor_ code includes modules that you've imported from within `node_modules`. One of the potential advantages with splitting your _vendor_ and _application_ code is to enable [long term caching techniques](#static-file-caching) to improve application loading performance. Since _vendor_ code tends to change less often than the actual _application_ code, the browser will be able to cache them separately, and won't re-download them each time the app code changes.

`runtime-main.[hash].js`

- This is a small chunk of [webpack runtime](https://webpack.js.org/configuration/optimization/#optimization-runtimechunk) logic which is used to load and run your application. The contents of this will be embedded in your `build/index.html` file by default to save an additional network request. You can opt out of this by specifying `INLINE_RUNTIME_CHUNK=false` as documented in our [advanced configuration](advanced-configuration.md), which will load this chunk instead of embedding it in your `index.html`.

If you're using [code splitting](code-splitting.md) to split up your application, this will create additional chunks in the `build/static` folder as well.

## Static File Caching

Each file inside of the `build/static` directory will have a unique hash appended to the filename that is generated based on the contents of the file, which allows you to use [aggressive caching techniques](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#invalidating_and_updating_cached_responses) to avoid the browser re-downloading your assets if the file contents haven't changed. If the contents of a file changes in a subsequent build, the filename hash that is generated will be different.

To deliver the best performance to your users, it's best practice to specify a `Cache-Control` header for `index.html`, as well as the files within `build/static`. This header allows you to control the length of time that the browser as well as CDNs will cache your static assets. If you aren't familiar with what `Cache-Control` does, see [this article](https://jakearchibald.com/2016/caching-best-practices/) for a great introduction.

Using `Cache-Control: max-age=31536000` for your `build/static` assets, and `Cache-Control: no-cache` for everything else is a safe and effective starting point that ensures your user's browser will always check for an updated `index.html` file, and will cache all of the `build/static` files for one year. Note that you can use the one year expiration on `build/static` safely because the file contents hash is embedded into the filename.

## Profiling

ReactDOM automatically supports profiling in development mode for v16.5+, but since profiling adds some small
additional overhead it is opt-in for production mode. You can opt-in by using the `--profile` flag. Use `npm run build -- --profile` or `yarn build --profile` to enable profiling in the production build. See the [React docs](https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-devtools-profiler) for details about profiling
using the React DevTools.
```

--------------------------------------------------------------------------------

---[FILE: proxying-api-requests-in-development.md]---
Location: create-react-app-main/docusaurus/docs/proxying-api-requests-in-development.md

```text
---
id: proxying-api-requests-in-development
title: Proxying API Requests in Development
sidebar_label: Proxying in Development
---

> Note: this feature is available with `react-scripts@0.2.3` and higher.

People often serve the front-end React app from the same host and port as their backend implementation.

For example, a production setup might look like this after the app is deployed:

    /             - static server returns index.html with React app
    /todos        - static server returns index.html with React app
    /api/todos    - server handles any /api/* requests using the backend implementation

Such setup is **not** required. However, if you **do** have a setup like this, it is convenient to write requests like `fetch('/api/todos')` without worrying about redirecting them to another host or port during development.

To tell the development server to proxy any unknown requests to your API server in development, add a `proxy` field to your `package.json`, for example:

```json
  "proxy": "http://localhost:4000",
```

This way, when you `fetch('/api/todos')` in development, the development server will recognize that it’s not a static asset, and will proxy your request to `http://localhost:4000/api/todos` as a fallback. The development server will **only** attempt to send requests without `text/html` in its `Accept` header to the proxy.

Conveniently, this avoids [CORS issues](https://stackoverflow.com/questions/21854516/understanding-ajax-cors-and-security-considerations) and error messages like this in development:

```
Fetch API cannot load http://localhost:4000/api/todos. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

Keep in mind that `proxy` only has effect in development (with `npm start`), and it is up to you to ensure that URLs like `/api/todos` point to the right thing in production. You don’t have to use the `/api` prefix. Any unrecognized request without a `text/html` accept header will be redirected to the specified `proxy`.

The `proxy` option supports HTTP, HTTPS and WebSocket connections.

If the `proxy` option is **not** flexible enough for you, alternatively you can:

- [Configure the proxy yourself](#configuring-the-proxy-manually)
- Enable CORS on your server ([here’s how to do it for Express](https://enable-cors.org/server_expressjs.html)).
- Use [environment variables](adding-custom-environment-variables.md) to inject the right server host and port into your app.

## "Invalid Host Header" Errors After Configuring Proxy

When you enable the `proxy` option, you opt into a more strict set of host checks. This is necessary because leaving the backend open to remote hosts makes your computer vulnerable to DNS rebinding attacks. The issue is explained in [this article](https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a) and [this issue](https://github.com/webpack/webpack-dev-server/issues/887).

This shouldn’t affect you when developing on `localhost`, but if you develop remotely like [described here](https://github.com/facebook/create-react-app/issues/2271), you will see this error in the browser after enabling the `proxy` option:

> Invalid Host header

To work around it, you can specify your public development host in a file called `.env.development` in the root of your project:

```
HOST=mypublicdevhost.com
```

If you restart the development server now and load the app from the specified host, it should work.

If you are still having issues or if you’re using a more exotic environment like a cloud editor, you can bypass the host check completely by adding a line to `.env.development.local`. **Note that this is dangerous and exposes your machine to remote code execution from malicious websites:**

```
# NOTE: THIS IS DANGEROUS!
# It exposes your machine to attacks from the websites you visit.
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

We don’t recommend this approach.

## Configuring the Proxy Manually

> Note: this feature is available with `react-scripts@2.0.0` and higher.

If the `proxy` option is **not** flexible enough for you, you can get direct access to the Express app instance and hook up your own proxy middleware.

You can use this feature in conjunction with the `proxy` property in `package.json`, but it is recommended you consolidate all of your logic into `src/setupProxy.js`.

First, install `http-proxy-middleware` using npm or Yarn:

```sh
$ npm install http-proxy-middleware --save
$ # or
$ yarn add http-proxy-middleware
```

Next, create `src/setupProxy.js` and place the following contents in it:

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // ...
};
```

You can now register proxies as you wish! Here's an example using the above `http-proxy-middleware`:

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
```

> **Note:** You do not need to import this file anywhere. It is automatically registered when you start the development server.

> **Note:** This file only supports Node's JavaScript syntax. Be sure to only use supported language features (i.e. no support for Flow, ES Modules, etc).

> **Note:** Passing the path to the proxy function allows you to use globbing and/or pattern matching on the path, which is more flexible than the express route matching.
```

--------------------------------------------------------------------------------

````
