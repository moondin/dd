---
source_txt: fullstack_samples/VERT-main
converted_utc: 2025-12-18T11:26:37Z
part: 4
parts_total: 18
---

# FULLSTACK CODE DATABASE SAMPLES VERT-main

## Verbatim Content (Part 4 of 18)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - VERT-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/VERT-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: package.json]---
Location: VERT-main/package.json

```json
{
	"name": "vert",
	"version": "0.0.1",
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide && vite build",
		"preview": "vite preview",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"format": "prettier --write .",
		"lint": "prettier --check . && eslint ."
	},
	"devDependencies": {
		"@inlang/paraglide-js": "^2.5.0",
		"@poppanator/sveltekit-svg": "^5.0.1",
		"@sveltejs/adapter-static": "^3.0.10",
		"@sveltejs/kit": "^2.49.0",
		"@sveltejs/vite-plugin-svelte": "^4.0.4",
		"@types/eslint": "^9.6.1",
		"@types/sanitize-html": "^2.16.0",
		"autoprefixer": "^10.4.22",
		"css-select": "5.1.0",
		"eslint": "^9.39.1",
		"eslint-config-prettier": "^10.1.8",
		"eslint-plugin-svelte": "^2.46.1",
		"globals": "^15.15.0",
		"prettier": "^3.6.2",
		"prettier-plugin-svelte": "^3.4.0",
		"prettier-plugin-tailwindcss": "^0.6.14",
		"sass": "^1.94.2",
		"svelte": "^5.43.14",
		"svelte-check": "^4.3.4",
		"tailwindcss": "^3.4.18",
		"typescript": "^5.9.3",
		"typescript-eslint": "^8.47.0",
		"vite": "^5.4.21",
		"vite-plugin-top-level-await": "^1.6.0"
	},
	"dependencies": {
		"@bjorn3/browser_wasi_shim": "^0.4.2",
		"@ffmpeg/ffmpeg": "^0.12.15",
		"@ffmpeg/util": "^0.12.2",
		"@fontsource/azeret-mono": "^5.2.11",
		"@fontsource/lexend": "^5.2.11",
		"@fontsource/radio-canada-big": "^5.2.7",
		"@imagemagick/magick-wasm": "^0.0.37",
		"@stripe/stripe-js": "^8.5.2",
		"byte-data": "^19.0.1",
		"client-zip": "^2.5.0",
		"clsx": "^2.1.1",
		"fflate": "^0.8.2",
		"lucide-svelte": "^0.554.0",
		"music-metadata": "^11.10.3",
		"overlayscrollbars": "^2.12.0",
		"overlayscrollbars-svelte": "^0.5.5",
		"p-queue": "^9.0.1",
		"riff-file": "^1.0.3",
		"sanitize-html": "^2.17.0",
		"svelte-stripe": "^1.4.0",
		"vert-wasm": "^0.0.2",
		"vite-plugin-wasm": "^3.5.0"
	},
	"trustedDependencies": [
		"@parcel/watcher",
		"@swc/core"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: postcss.config.js]---
Location: VERT-main/postcss.config.js

```javascript
export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {}
	}
};
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: VERT-main/README.md

```text
<p align="center">
  <img src="https://github.com/user-attachments/assets/bf441748-0ec5-4c8a-b3e5-11301ee3f0bd" alt="VERT's logo" height="100">
</p>
<h1 align="center"><a href="https://vert.sh">VERT.sh</a></h1>

VERT is a file conversion utility that uses WebAssembly to convert files on your device instead of a cloud. Check out the live instance at [vert.sh](https://vert.sh).

VERT is built in Svelte and TypeScript.

## Screenshots

|                     Upload page                      |                     Conversion page                      |
| :--------------------------------------------------: | :------------------------------------------------------: |
| ![VERT upload page](docs/images/screenshot-home.png) | ![VERT convert page](docs/images/screenshot-convert.png) |

## Features

- Convert files directly on your device using WebAssembly\*
- No file or file size limits
- Convert images, audio, documents, and video\*
- Supports over **250+** file formats
- Conversion settings
- User-friendly interface built with Svelte

<sup>\* Non-local video conversion is available with our official instance, but the [daemon](https://github.com/VERT-sh/vertd) is easily self-hostable to maintain privacy and fully local functionality.</sup>

## Documentation

- [FAQ](./docs/FAQ.md)
- [Getting Started](./docs/GETTING_STARTED.md)
- [Using Docker](./docs/DOCKER.md)
- [Video Conversion](./docs/VIDEO_CONVERSION.md)

## License

This project is licensed under the AGPL-3.0 License, please see the [LICENSE](LICENSE) file for details.

## Star History

<a href="https://www.star-history.com/#VERT-sh/VERT&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=VERT-sh/VERT&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=VERT-sh/VERT&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=VERT-sh/VERT&type=Date" />
 </picture>
</a>
```

--------------------------------------------------------------------------------

---[FILE: svelte.config.js]---
Location: VERT-main/svelte.config.js

```javascript
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		paths: {
			relative: false,
		},
		env: {
			publicPrefix: "PUB_",
			privatePrefix: "PRI_",
		},
	},
};

export default config;
```

--------------------------------------------------------------------------------

---[FILE: tailwind.config.ts]---
Location: VERT-main/tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			backgroundColor: {
				panel: "var(--bg-panel)",
				"panel-highlight": "var(--bg-panel-highlight)",
				separator: "var(--bg-separator)",
				button: "var(--bg-button)",
				"panel-alt": "var(--bg-button)",
				badge: "var(--bg-badge)",
			},
			borderColor: {
				separator: "var(--bg-separator)",
				button: "var(--bg-button)",
			},
			textColor: {
				foreground: "var(--fg)",
				muted: "var(--fg-muted)",
				accent: "var(--fg-accent)",
				failure: "var(--fg-failure)",
				"on-accent": "var(--fg-on-accent)",
				"on-badge": "var(--fg-on-badge)",
			},
			colors: {
				accent: "var(--accent)",
				"accent-alt": "var(--accent-alt)",
				"accent-pink": "var(--accent-pink)",
				"accent-pink-alt": "var(--accent-pink-alt)",
				"accent-red": "var(--accent-red)",
				"accent-red-alt": "var(--accent-red-alt)",
				"accent-purple-alt": "var(--accent-purple-alt)",
				"accent-purple": "var(--accent-purple)",
				"accent-blue": "var(--accent-blue)",
				"accent-blue-alt": "var(--accent-blue-alt)",
				"accent-green": "var(--accent-green)",
				"accent-green-alt": "var(--accent-green-alt)",
			},
			boxShadow: {
				panel: "var(--shadow-panel)",
			},
			fontFamily: {
				display: "var(--font-display)",
				body: "var(--font-body)",
			},
			blur: {
				xs: "2px",
			},
			borderRadius: {
				"2.5xl": "1.25rem",
			},
		},
	},

	plugins: [
		plugin(function ({ addVariant }) {
			addVariant("dynadark", [
				":root:not(.light).dark &",
				"@media (prefers-color-scheme: dark) { :root:not(.light) &",
			]);
		}),
	],
} satisfies Config;
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: VERT-main/tsconfig.json

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
	// Path aliases are handled by https://svelte.dev/docs/kit/configuration#alias
	// except $lib which is handled by https://svelte.dev/docs/kit/configuration#files
	//
	// If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes
	// from the referenced tsconfig.json - TypeScript does not merge them in
}
```

--------------------------------------------------------------------------------

---[FILE: vite.config.ts]---
Location: VERT-main/vite.config.ts

```typescript
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type PluginOption } from "vite";
import svg from "@poppanator/sveltekit-svg";
import wasm from "vite-plugin-wasm";
import { execSync } from "child_process";

let commitHash = "unknown";
try {
	commitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (e) {
	console.warn("Could not determine Git commit hash:", e);
}

export default defineConfig(({ command }) => {
	const plugins: PluginOption[] = [
		sveltekit(),
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/lib/paraglide",
			strategy: ["localStorage", "preferredLanguage", "baseLocale"],
		}),
		svg({
			includePaths: ["./src/lib/assets"],
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: "preset-default",
						params: { overrides: { removeViewBox: false } },
					},
					{ name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
				],
			},
		}),
	];

	if (command === "serve") {
		plugins.unshift(wasm());
	}

	return {
		plugins,
		worker: {
			plugins: () => [wasm()],
			format: "es",
		},
		optimizeDeps: {
			exclude: ["@ffmpeg/core-mt", "@ffmpeg/ffmpeg", "@ffmpeg/util"],
		},
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern",
				},
			},
		},
		build: {
			target: "esnext",
		},
		define: {
			__COMMIT_HASH__: JSON.stringify(commitHash),
		},
	};
});
```

--------------------------------------------------------------------------------

---[FILE: docker.yml]---
Location: VERT-main/.github/workflows/docker.yml
Signals: Docker

```yaml
name: Docker Image CI

on:
    push:
        branches: ["main"]
        tags: ["v*"]
        paths:
            - "src/**"
            - "static/**"
            - "Dockerfile"
            - ".dockerignore"
    pull_request:
        branches: ["main"]
        paths:
            - "src/**"
            - "static/**"
            - "Dockerfile"
            - ".dockerignore"
    workflow_dispatch:

jobs:
    build-and-push:
        runs-on: ubuntu-latest
        permissions:
            contents: read
            packages: write

        steps:
            - uses: actions/checkout@v4

            - name: Set up Docker Buildx
              uses: docker/setup-buildx-action@v3

            - name: Login to GitHub Container Registry
              if: github.event_name != 'pull_request'
              uses: docker/login-action@v3
              with:
                  registry: ghcr.io
                  username: ${{ github.actor }}
                  password: ${{ secrets.GITHUB_TOKEN }}

            - name: Extract metadata
              id: meta
              uses: docker/metadata-action@v5
              with:
                  images: ghcr.io/${{ github.repository }}
                  tags: |
                      type=ref,event=branch
                      type=ref,event=pr
                      type=semver,pattern={{version}}
                      type=semver,pattern={{major}}.{{minor}}
                      type=sha,format=short
                      type=raw,value=latest,enable=${{ github.ref == format('refs/heads/{0}', github.event.repository.default_branch) }}

            - name: Build and push
              uses: docker/build-push-action@v5
              with:
                  context: .
                  push: ${{ github.event_name != 'pull_request' }}
                  platforms: linux/amd64,linux/arm64
                  tags: ${{ steps.meta.outputs.tags }}
                  labels: ${{ steps.meta.outputs.labels }}
                  cache-from: type=gha
                  cache-to: type=gha,mode=max
                  build-args: |
                      PUB_ENV=production
                      PUB_HOSTNAME=${{ vars.PUB_HOSTNAME || '' }}
                      PUB_PLAUSIBLE_URL=${{ vars.PUB_PLAUSIBLE_URL || '' }}
                      PUB_VERTD_URL=https://vertd.vert.sh
                      PUB_DISABLE_ALL_EXTERNAL_REQUESTS=false
                      PUB_DONATION_URL=https://donations.vert.sh
                      PUB_STRIPE_KEY=pk_live_51RDVmAGSxPVad6bQwzVNnbc28nlmzA30krLWk1fefCMpUPiSRPkavMMbGqa8A3lUaOCMlsUEVy2CWDYg0ip3aPpL00ZJlsMkf2
```

--------------------------------------------------------------------------------

---[FILE: extensions.json]---
Location: VERT-main/.vscode/extensions.json

```json
{
  "recommendations": [
    "inlang.vs-code-extension"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: settings.json]---
Location: VERT-main/.vscode/settings.json

```json
{
	"css.customData": [".vscode/tailwind.json"]
}
```

--------------------------------------------------------------------------------

---[FILE: tailwind.json]---
Location: VERT-main/.vscode/tailwind.json

```json
{
	"version": 1.1,
	"atDirectives": [
		{
			"name": "@tailwind",
			"description": "Use the `@tailwind` directive to insert Tailwind's `base`, `components`, `utilities` and `screens` styles into your CSS.",
			"references": [
				{
					"name": "Tailwind Documentation",
					"url": "https://tailwindcss.com/docs/functions-and-directives#tailwind"
				}
			]
		},
		{
			"name": "@apply",
			"description": "Use the `@apply` directive to inline any existing utility classes into your own custom CSS. This is useful when you find a common utility pattern in your HTML that you’d like to extract to a new component.",
			"references": [
				{
					"name": "Tailwind Documentation",
					"url": "https://tailwindcss.com/docs/functions-and-directives#apply"
				}
			]
		},
		{
			"name": "@responsive",
			"description": "You can generate responsive variants of your own classes by wrapping their definitions in the `@responsive` directive:\n```css\n@responsive {\n  .alert {\n    background-color: #E53E3E;\n  }\n}\n```\n",
			"references": [
				{
					"name": "Tailwind Documentation",
					"url": "https://tailwindcss.com/docs/functions-and-directives#responsive"
				}
			]
		},
		{
			"name": "@screen",
			"description": "The `@screen` directive allows you to create media queries that reference your breakpoints by **name** instead of duplicating their values in your own CSS:\n```css\n@screen sm {\n  /* ... */\n}\n```\n…gets transformed into this:\n```css\n@media (min-width: 640px) {\n  /* ... */\n}\n```\n",
			"references": [
				{
					"name": "Tailwind Documentation",
					"url": "https://tailwindcss.com/docs/functions-and-directives#screen"
				}
			]
		},
		{
			"name": "@variants",
			"description": "Generate `hover`, `focus`, `active` and other **variants** of your own utilities by wrapping their definitions in the `@variants` directive:\n```css\n@variants hover, focus {\n   .btn-brand {\n    background-color: #3182CE;\n  }\n}\n```\n",
			"references": [
				{
					"name": "Tailwind Documentation",
					"url": "https://tailwindcss.com/docs/functions-and-directives#variants"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: DOCKER.md]---
Location: VERT-main/docs/DOCKER.md

```text
## Using Docker

This file covers how to run VERT under a Docker container.

- [Manually building the image](#manually-building-the-image)
- [Using an image from the GitHub Container Registry](#using-an-image-from-the-github-container-registry)

### Manually building the image

First, clone the repository:

```shell
git clone https://github.com/VERT-sh/VERT
cd VERT/
```

Then build a Docker image with:

```shell
docker build -t vert-sh/vert \
    --build-arg PUB_ENV=production \
    --build-arg PUB_HOSTNAME=vert.sh \
    --build-arg PUB_PLAUSIBLE_URL=https://plausible.example.com \
    --build-arg PUB_VERTD_URL=https://vertd.vert.sh \
    --build-arg PUB_DONATION_URL=https://donations.vert.sh \
	--build-arg PUB_DISABLE_ALL_EXTERNAL_REQUESTS=false \
    --build-arg PUB_STRIPE_KEY="" .
```

You can then run it by using:

```shell
docker run -d \
    --restart unless-stopped \
    -p 3000:80 \
    --name "vert" \
    vert-sh/vert
```

This will do the following:

- Use the previously built image as the container `vert`, in detached mode
- Continuously restart the container until manually stopped
- Map `3000/tcp` (host) to `80/tcp` (container)

We also have a [`docker-compose.yml`](/docker-compose.yml) file available. Use `docker compose up` if you want to start the stack, or `docker compose down` to bring it down. You can pass `--build` to `docker compose up` to rebuild the Docker image (useful if you've changed any of the environment variables) as well as `-d` to start it in detached mode. You can read more about Docker Compose in general [here](https://docs.docker.com/compose/intro/compose-application-model/).

### Using an image from the GitHub Container Registry

While there's an image you can pull instead of cloning the repo and building the image yourself, you will not be able to update any of the environment variables (e.g. `PUB_PLAUSIBLE_URL`) as they're baked directly into the image and not obtained during runtime. If you're okay with this, you can simply run this command instead:

```shell
docker run -d \
    --restart unless-stopped \
    -p 3000:80 \
    --name "vert" \
    ghcr.io/vert-sh/vert:latest
```
```

--------------------------------------------------------------------------------

---[FILE: FAQ.md]---
Location: VERT-main/docs/FAQ.md

```text
## FAQ

This file covers frequently asked questions.

- [Why VERT?](#why-vert)
- [What happens with video files?](#what-happens-with-video-files)
- [Can I host my own video file converter?](#can-i-host-my-own-video-file-converter)
- [What about analytics?](#what-about-analytics)
- [What libraries does VERT use?](#what-libraries-does-vert-use)
- [Is it possible to fully prevent VERT from making requests to external services?](#is-it-possible-to-fully-prevent-vert-from-making-requests-to-external-services)

### Why VERT?

**File converters have always disappointed us.** They're ugly, riddled with ads, and most importantly; slow. We decided to solve this problem once and for all by making an alternative that solves all those problems, and more.

All non-video files are converted completely on-device; this means that there's no delay between sending and receiving the files from a server, and we never get to snoop on the files you convert.

### What happens with video files?

Video files get uploaded to our lightning-fast RTX 4000 Ada server. Your videos stay on there for an hour if you do not convert them. If you do convert the file, the video will stay on the server for an hour, or until it is downloaded. The file will then be deleted from our server.

### Can I host my own video file converter?

Yes. Check out the [Video Conversion](./VIDEO_CONVERSION.md) page.

### What about analytics?

We use [Plausible](https://plausible.io/privacy-focused-web-analytics), a privacy-focused analytics tool, to gather completely anonymous statistics. All data is anonymized and aggregated, and no identifiable information is ever sent or stored. You can view the analytics [here](https://ats.vert.sh/vert.sh) and choose to opt out in the [Settings](https://vert.sh/settings/) page.

### Is it possible to fully prevent VERT from making requests to external services?

Yes! If you would prefer VERT to not make any requests to external services (video conversion, analytics, among others), you can set the `PUB_DISABLE_ALL_EXTERNAL_REQUESTS` environment variable to `true` **during build time**.

The only external request VERT will make with this option is to `cdn.jsdelivr.net`, which is used to download FFmpeg's WebAssembly build.

### What libraries does VERT use?
VERT uses FFmpeg for audio and video conversion, imagemagick for images and Pandoc for documents. A big thanks to them for maintaining such excellent libraries for so many years.
```

--------------------------------------------------------------------------------

---[FILE: GETTING_STARTED.md]---
Location: VERT-main/docs/GETTING_STARTED.md

```text
## Getting Started

This file covers how to get started with VERT.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Building for Production](#building-for-production)
- [Using Docker](#using-docker)

### Prerequisites

Make sure you have the following installed:
- [Bun](https://bun.sh/)

### Installation

First, clone the repository:
```sh
git clone https://github.com/VERT-sh/VERT
cd VERT/
```

Install dependencies:
```sh
bun i
```

And finally, make sure you create a `.env` file in the root of the project. We've included a [`.env.example`](../.env.example) file which you can use to get started.

### Running Locally

To run the project locally, run `bun dev`.

This will start a development server. Open your browser and navigate to `http://localhost:5173` to see the application.

### Building for Production

To build the project for production, run `bun run build`.

This will build the site to the `build` folder. You should then use a web server like [nginx](https://nginx.org) to serve the files inside that folder.

### Using Docker

Check the dedicated [Docker](./DOCKER.md) page.
```

--------------------------------------------------------------------------------

---[FILE: VIDEO_CONVERSION.md]---
Location: VERT-main/docs/VIDEO_CONVERSION.md

```text
## Video conversion

This file covers how video conversion works when using VERT.

On VERT, video uploads to a server for processing by default. This is because video conversion is hard to do in a browser as it uses a lot of resources, and will end up running very slowly (if it even works at all).

Our answer to this is [`vertd`](https://github.com/VERT-sh/vertd), which is a simple FFmpeg wrapper built in Rust. If you don't understand all that technical jargon, it basically allows you to convert videos using the full capacity of your computer, which results in much faster conversion. It runs on your computer (or a server somewhere, if you know what you're doing), and the VERT web interface reaches out to it in order to convert your videos.

We host an official instance of [`vertd`](https://github.com/VERT-sh/vertd) so you do not have to host it yourself for convenience, but considering you're here, you probably want to host it for yourself. Essentially:

- Download the latest release of `vertd` for your machine [here](https://github.com/VERT-sh/vertd/releases)
- Run the server
- Connect the VERT UI to your local `vertd` instance by entering its IP & port
    - By default, `vertd` runs a HTTP server on port `24153`, so you would put `http://localhost:24153` in the "Instance URL" setting found in VERT's settings (assuming you are running it on your own PC)
```

--------------------------------------------------------------------------------

---[FILE: ba.json]---
Location: VERT-main/messages/ba.json
Signals: Docker

```json
{
  "$schema": "https://inlang.com/schema/inlang-message-format",
  "navbar": {
    "upload": "Učitaj",
    "convert": "Konvertuj",
    "settings": "Postavke",
    "about": "O nama",
    "toggle_theme": "Promijeni temu"
  },
  "footer": {
    "copyright": "© {year} VERT.",
    "source_code": "Izvorni kod",
    "discord_server": "Discord server",
    "privacy_policy": "Politika privatnosti"
  },
  "upload": {
    "title": "Konverter datoteka koji ćete voljeti.",
    "subtitle": "Sva obrada slika, zvuka i dokumenata obavlja se na vašem uređaju. Video zapisi se konvertuju na našim izuzetno brzim serverima. Bez ograničenja veličine, bez reklama i potpuno otvorenog koda.",
    "uploader": {
      "text": "Prevucite ili kliknite da {action}",
      "convert": "konvertujete"
    },
    "cards": {
      "title": "VERT podržava...",
      "images": "Slike",
      "audio": "Audio",
      "documents": "Dokumente",
      "video": "Video",
      "video_server_processing": "Server podržava",
      "local_supported": "Lokalno podržano",
      "status": {
        "text": "<b>Status:</b> {status}",
        "ready": "spreman",
        "not_ready": "nije spreman",
        "not_initialized": "nije inicijaliziran",
        "downloading": "preuzimam...",
        "initializing": "inicijaliziram...",
        "unknown": "nepoznat status"
      },
      "supported_formats": "Podržani formati:"
    },
    "tooltip": {
      "partial_support": "Ovaj format može biti konvertovan samo kao {direction}.",
      "direction_input": "ulazni (iz)",
      "direction_output": "izlazni (u)",
      "video_server_processing": "Video se podrazumijevano otprema na server radi obrade, ovdje možete naučiti kako to postaviti lokalno."
    }
  },
  "convert": {
    "archive_file": {
      "extract": "Raspakuj arhivu",
      "extracting": "Otkrivena arhiva: {filename}",
      "extracted": "Izvučeno {extract_count} datoteka iz {filename}. {ignore_count} stavki je ignorisano.",
      "detected": "Otkrivene {type} datoteke u {filename}.",
      "audio": "audio",
      "video": "video",
      "doc": "dokument",
      "image": "slika",
      "extract_error": "Greška pri raspakivanju {filename}: {error}"
    },
    "large_file_warning": "Zbog ograničenja preglednika/uređaja, konverzija videa u audio je onemogućena za ovu datoteku jer je veća od {limit}GB. Preporučujemo Firefox ili Safari za datoteke ove veličine jer imaju manje ograničenja.",
    "external_warning": {
      "title": "Upozorenje o vanjskom serveru",
      "text": "Ako odaberete konverziju u video format, te datoteke će biti otpremljene na vanjski server. Želite li nastaviti?",
      "yes": "Da",
      "no": "Ne"
    },
    "panel": {
      "convert_all": "Konvertuj sve",
      "download_all": "Preuzmi sve kao .zip",
      "remove_all": "Ukloni sve datoteke",
      "set_all_to": "Postavi sve na",
      "na": "N/A"
    },
    "dropdown": {
      "audio": "Audio",
      "video": "Video",
      "doc": "Dokument",
      "image": "Slika",
      "placeholder": "Pretraži format",
      "no_formats": "Nema dostupnih formata",
      "no_results": "Nema rezultata koji odgovaraju pretrazi"
    },
    "tooltips": {
      "unknown_file": "Nepoznat tip datoteke",
      "audio_file": "Audio datoteka",
      "video_file": "Video datoteka",
      "document_file": "Dokument",
      "image_file": "Slika",
      "convert_file": "Konvertuj ovu datoteku",
      "download_file": "Preuzmi ovu datoteku"
    },
    "errors": {
      "cant_convert": "Ne možemo konvertovati ovu datoteku.",
      "vertd_server": "šta to radiš..? treba da pokreneš vertd server!",
      "vertd_generic_view": "Prikaži detalje greške",
      "vertd_generic_body": "Došlo je do greške prilikom pokušaja konverzije videa. Želite li poslati svoj video programerima da pomognete u rješavanju problema? Samo će vaš video biti poslan. Nikakvi identifikatori neće biti otpremljeni.",
      "vertd_generic_title": "Greška pri konverziji videa",
      "vertd_generic_yes": "Pošalji video",
      "vertd_generic_no": "Ne šalji",
      "vertd_failed_to_keep": "Neuspjelo čuvanje videa na serveru: {error}",
      "vertd_details": "Prikaži detalje greške",
      "vertd_details_body": "Ako pritisnete pošalji, <b>vaš video će također biti priložen</b> uz log greške koji se uvijek automatski šalje nama na pregled. Sljedeće informacije su log koji automatski dobijamo:",
      "vertd_details_footer": "Ove informacije se koriste isključivo za rješavanje problema i nikada neće biti dijeljene. Pogledajte našu [privacy_link]politiku privatnosti[/privacy_link] za više detalja.",
      "vertd_details_job_id": "<b>ID zadatka:</b> {jobId}",
      "vertd_details_from": "<b>Iz formata:</b> {from}",
      "vertd_details_to": "<b>U format:</b> {to}",
      "vertd_details_error_message": "<b>Poruka greške:</b> [view_link]Pogledaj log[/view_link]",
      "vertd_details_close": "Zatvori",
      "vertd_ratelimit": "Vaš video '{filename}' nije uspio biti konvertovan nekoliko puta. Kako bismo spriječili preopterećenje servera, dalji pokušaji konverzije za ovu datoteku su privremeno blokirani.",
      "unsupported_format": "Podržane su samo slike, video, audio i dokumenti",
      "format_output_only": "Ovaj format se trenutno može koristiti samo kao izlaz, ne kao ulaz.",
      "vertd_not_found": "Nije moguće pronaći vertd instancu za pokretanje konverzije videa. Da li je URL ispravno postavljen?",
      "worker_downloading": "{type} konverter se trenutno inicijalizira, molimo sačekajte.",
      "worker_error": "{type} konverter je imao grešku tokom inicijalizacije, pokušajte kasnije ponovo.",
      "worker_timeout": "{type} konverteru treba duže nego očekivano da se inicijalizira, molimo sačekajte još malo ili osvježite stranicu.",
      "audio": "audio",
      "doc": "dokument",
      "image": "slika"
    }
  },
  "settings": {
    "title": "Postavke",
    "errors": {
      "save_failed": "Neuspješno spremanje postavki!"
    },
    "appearance": {
      "title": "Izgled",
      "brightness_theme": "Tema osvjetljenja",
      "brightness_description": "Želite li blještavi dan ili tihu, usamljenu noć?",
      "light": "Svijetla",
      "dark": "Tamna",
      "effect_settings": "Efekti",
      "effect_description": "Želite li zanimljive efekte ili mirnije iskustvo?",
      "enable": "Uključi",
      "disable": "Isključi"
    },
    "conversion": {
      "title": "Konverzija",
      "advanced_settings": "Napredne postavke",
      "filename_format": "Format imena datoteke",
      "filename_description": "Ovo određuje ime datoteke pri preuzimanju, <b>bez ekstenzije</b>. Možete koristiti sljedeće šablone: <b>%name%</b> originalno ime, <b>%extension%</b> originalna ekstenzija, <b>%date%</b> datum konverzije.",
      "placeholder": "VERT_%name%",
      "default_format": "Podrazumijevani format konverzije",
      "default_format_enable": "Uključi",
      "default_format_disable": "Isključi",
      "default_format_description": "Ovo mijenja podrazumijevani format koji se odabere kada učitate datoteku ovog tipa.",
      "default_format_image": "Slike",
      "default_format_video": "Video",
      "default_format_audio": "Audio",
      "default_format_document": "Dokumenti",
      "metadata": "Metadata",
      "metadata_description": "Određuje da li se podaci (EXIF, info o pjesmi itd.) čuvaju u konvertovanim datotekama.",
      "keep": "Zadrži",
      "remove": "Ukloni",
      "quality": "Kvalitet konverzije",
      "quality_description": "Mijenja podrazumijevani kvalitet izlazne datoteke. Veće vrijednosti znače duže vrijeme konverzije i veću veličinu.",
      "quality_video": "Mijenja izlazni kvalitet videa.",
      "quality_audio": "Audio (kbps)",
      "quality_images": "Slika (%)",
      "rate": "Sample rate (Hz)"
    },
    "vertd": {
      "title": "Konverzija videa",
      "status": "status:",
      "loading": "učitavam...",
      "available": "dostupan, commit id {commitId}",
      "unavailable": "nedostupan (da li je URL tačan?)",
      "description": "<code>vertd</code> je serverski omotač za FFmpeg, omogućava brzo konvertovanje videa koristeći vaš GPU putem VERT web interfejsa.",
      "hosting_info": "Imamo javnu instancu radi praktičnosti, ali možete lako hostati svoju. Preuzmite server [vertd_link]ovdje[/vertd_link].",
      "instance": "Instanca",
      "url_placeholder": "Primjer: http://localhost:24153",
      "conversion_speed": "Brzina konverzije",
      "speed_description": "Opisuje odnos između brzine i kvaliteta. Brže = niži kvalitet ali kraće vrijeme.",
      "speeds": {
        "very_slow": "Vrlo sporo",
        "slower": "Sporije",
        "slow": "Sporo",
        "medium": "Srednje",
        "fast": "Brzo",
        "ultra_fast": "Ultra brzo"
      },
      "auto_instance": "Auto (preporučeno)",
      "eu_instance": "Falkenstein, Njemačka",
      "us_instance": "Washington, SAD",
      "custom_instance": "Prilagođeno"
    },
    "privacy": {
      "title": "Privatnost i podaci",
      "plausible_title": "Plausible analitika",
      "plausible_description": "Koristimo [plausible_link]Plausible[/plausible_link], alat fokusiran na privatnost. Podaci su potpuno anonimni i agregirani. Analitiku možete vidjeti [analytics_link]ovdje[/analytics_link] i isključiti ispod.",
      "opt_in": "Uključi",
      "opt_out": "Isključi",
      "cache_title": "Upravljanje cacheom",
      "cache_description": "Konverter se kešira u vašem pregledniku radi boljih performansi.",
      "refresh_cache": "Osvježi cache",
      "clear_cache": "Obriši cache",
      "files_cached": "{size} ({count} datoteka)",
      "loading_cache": "Učitavam...",
      "total_size": "Ukupna veličina",
      "files_cached_label": "Keširane datoteke",
      "cache_cleared": "Cache uspješno obrisan!",
      "cache_clear_error": "Neuspješno brisanje cachea.",
      "site_data_title": "Upravljanje podacima stranice",
      "site_data_description": "Obriši sve podatke stranice uključujući postavke i cache i resetuj VERT.",
      "clear_all_data": "Obriši sve podatke",
      "clear_all_data_confirm_title": "Obrisati sve podatke stranice?",
      "clear_all_data_confirm": "Resetovat će sve postavke i cache i osvježiti stranicu. Ova akcija je nepovratna.",
      "clear_all_data_cancel": "Otkaži",
      "all_data_cleared": "Svi podaci obrisani! Osvježavam stranicu...",
      "all_data_clear_error": "Neuspješno brisanje svih podataka."
    },
    "language": {
      "title": "Jezik",
      "description": "Odaberite željeni jezik VERT interfejsa."
    }
  },
  "about": {
    "title": "O nama",
    "why": {
      "title": "Zašto VERT?",
      "description": "<b>Konverteri datoteka su nas uvijek razočaravali.</b> Ružni su, puni reklama i, najvažnije, spori. Odlučili smo to riješiti jednom zauvijek.<br/><br/>Sve ne-video datoteke se obrađuju lokalno, što znači da nema slanja datoteka na server — i mi nikad ne vidimo vaše podatke.<br/><br/>Video se otprema na naš brzi RTX 4000 Ada server. Vaši video snimci ostaju tamo sat vremena ako ih ne konvertujete. Ako ih konvertujete, ostaju sat ili dok ih preuzmete, nakon čega se brišu."
    },
    "sponsors": {
      "title": "Sponzori",
      "description": "Želite nas podržati? Kontaktirajte nekog od developera na [discord_link]Discordu[/discord_link] ili pošaljite email na",
      "email_copied": "Email kopiran!"
    },
    "resources": {
      "title": "Resursi",
      "discord": "Discord",
      "source": "Izvor",
      "email": "Email"
    },
    "donate": {
      "title": "Donirajte VERT-u",
      "description": "Vaša podrška pomaže da nastavimo razvijati i unapređivati VERT.",
      "one_time": "Jednokratno",
      "monthly": "Mjesečno",
      "custom": "Prilagođeno",
      "pay_now": "Plati sada",
      "donate_amount": "Doniraj ${amount} USD",
      "thank_you": "Hvala na donaciji!",
      "payment_failed": "Plaćanje nije uspjelo: {message}{period}. Novac nije skinut s vašeg računa.",
      "donation_error": "Došlo je do greške pri obradi donacije. Pokušajte ponovo kasnije.",
      "payment_error": "Greška pri dohvaćanju podataka o plaćanju. Pokušajte ponovo.",
      "donation_notice_official": "Donacije ovdje idu za zvaničnu VERT instancu (vert.sh) i pomažu razvoj projekta.",
      "donation_notice_unofficial": "Donacije ovdje idu operateru ove VERT instance. Ako želite podržati zvanične developere, posjetite [official_link]vert.sh[/official_link]."
    },
    "credits": {
      "title": "Zasluge",
      "contact_team": "Ako želite kontaktirati razvojni tim, koristite email iz kartice \"Resursi\".",
      "notable_contributors": "Istaknuti doprinosioci",
      "notable_description": "Želimo zahvaliti ovim osobama na velikim doprinosima VERT-u.",
      "github_contributors": "GitHub doprinosioci",
      "github_description": "Veliko hvala svima! [github_link]Želite pomoći i vi?[/github_link]",
      "no_contributors": "Izgleda da još niko nije doprinio... [contribute_link]budite prvi![/contribute_link]",
      "libraries": "Biblioteke",
      "libraries_description": "Veliko hvala FFmpeg-u (audio, video), ImageMagick-u (slike) i Pandoc-u (dokumenti). VERT se na njima temelji.",
      "roles": {
        "lead_developer": "Glavni developer; backend konverzije, UI implementacija",
        "developer": "Developer; UI implementacija",
        "designer": "Dizajner; UX, brending, marketing",
        "docker_ci": "Održavanje Docker & CI podrške",
        "former_cofounder": "Bivši suosnivač i dizajner"
      }
    },
    "errors": {
      "github_contributors": "Greška pri dohvaćanju GitHub doprinosilaca"
    }
  },
  "workers": {
    "errors": {
      "general": "Greška pri konverziji {file}: {message}",
      "cancel": "Greška pri otkazivanju konverzije za {file}: {message}",
      "magick": "Greška u Magick workeru, konverzija slika možda neće raditi ispravno.",
      "ffmpeg": "Greška pri učitavanju FFmpeg-a, neke funkcije možda neće raditi.",
      "pandoc": "Greška pri učitavanju Pandoc workera, dokumenti možda neće biti konvertovani.",
      "no_audio": "Nije pronađen audio zapis.",
      "invalid_rate": "Nevažeća sample rate vrijednost: {rate}Hz",
      "file_too_large": "Ova datoteka prelazi {limit}GB ograničenje preglednika/uređaja. Pokušajte u Firefoxu ili Safariju."
    }
  },
  "privacy": {
    "title": "Politika privatnosti",
    "summary": {
      "title": "Sažetak",
      "description": "VERT-ova politika privatnosti je vrlo jednostavna: ne prikupljamo niti pohranjujemo ikakve podatke o vama. Ne koristimo kolačiće ni trackere, analitika je potpuno privatna, a konverzije (osim videa) rade lokalno. Video se briše nakon preuzimanja ili nakon sat vremena, osim ako nam ne date dozvolu da ga čuvamo radi rješavanja problema. Koristimo Coolify za hosting i Plausible za anonimnu analitiku. Stripe obrađuje donacije i može prikupiti podatke za prevenciju prevara.<br/><br/>Ovo vrijedi za zvaničnu instancu [vert_link]vert.sh[/vert_link]; treće strane mogu raditi drugačije."
    },
    "conversions": {
      "title": "Konverzije",
      "description": "Većina konverzija (slike, dokumenti, audio) se obavlja lokalno putem WebAssembly alata (ImageMagick, Pandoc, FFmpeg). Vaše datoteke ne napuštaju uređaj.<br/><br/>Video konverzije se obavljaju na našim serverima jer zahtijevaju više snage. Video se briše nakon preuzimanja ili sat vremena, osim ako nam eksplicitno ne dozvolite duže čuvanje radi otklanjanja grešaka."
    },
    "donations": {
      "title": "Donacije",
      "description": "Koristimo Stripe na stranici [about_link]o nama[/about_link] za donacije. Stripe može prikupiti određene informacije radi prevencije prevara, opisano u [stripe_link]njihovoj dokumentaciji[/stripe_link]. Eksterni zahtjevi se šalju tek nakon vašeg klika."
    },
    "conversion_errors": {
      "title": "Greške pri konverziji",
      "description": "Kada konverzija videa ne uspije, možemo prikupiti anonimne informacije radi dijagnostike:",
      "list_job_id": "ID zadatka (anonimizirano ime datoteke)",
      "list_format_from": "Format iz kojeg se konvertuje",
      "list_format_to": "Format u koji se konvertuje",
      "list_stderr": "FFmpeg stderr (poruka greške)",
      "list_video": "Stvarni video zapis (samo uz vašu dozvolu)",
      "footer": "Ove informacije se koriste samo za dijagnostiku. Sam video se prikuplja samo uz vašu dozvolu."
    },
    "analytics": {
      "title": "Analitika",
      "description": "Koristimo vlastitu Plausible instancu za potpuno anonimnu analitiku. Plausible ne koristi kolačiće i usklađen je sa svim glavnim zakonima o privatnosti. Možete isključiti analitiku u sekciji \"Privatnost i podaci\" u [settings_link]postavkama[/settings_link] i pročitati više [plausible_link]ovdje[/plausible_link]."
    },
    "local_storage": {
      "title": "Lokalno skladištenje",
      "description": "Vaše postavke se čuvaju u local storage-u preglednika, a lista GitHub doprinosilaca u session storage-u. Nijedan lični podatak se ne skladišti.<br/><br/>WebAssembly alati (FFmpeg, ImageMagick, Pandoc) se također čuvaju lokalno. Možete ih vidjeti ili obrisati u sekciji \"Privatnost i podaci\" u [settings_link]postavkama[/settings_link]."
    },
    "contact": {
      "title": "Kontakt",
      "description": "Za pitanja, pišite nam na: [email_link]hello@vert.sh[/email_link]. Ako koristite treću stranu, kontaktirajte njihovog hostera."
    },
    "last_updated": "Posljednje ažuriranje: 2025-10-29"
  }
}
```

--------------------------------------------------------------------------------

````
