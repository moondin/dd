---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 3
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 3 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: bunfig.toml]---
Location: sim-main/bunfig.toml

```toml
# Bun Configuration File

[install]
# Recommend using exact versions for better reproducibility
exact = true
# Auto-detect lockfile and registry changes
registry = "https://registry.npmjs.org/"
# Cache binaries for faster install
cache = true
# Strict mode for more reliable dependency resolution
strict = false
# Enables frozen lockfile by default to prevent accidental changes
frozen = false

# Configure workspaces for monorepo
workspaces = ["apps/*", "packages/*"]

[test]
# Test configuration
preload = "./apps/sim/test/setup.ts"
extensions = [".test.ts", ".test.tsx"]
timeout = 10000

[run]
# Environment setting for running scripts
env = { NEXT_PUBLIC_APP_URL = "http://localhost:3000" }

[build]
# Build configuration
minify = true

[debug]
# Configure debug mode
inject-preload = true
```

--------------------------------------------------------------------------------

---[FILE: CLAUDE.md]---
Location: sim-main/CLAUDE.md

```text
# Expert Programming Standards

**You are tasked with implementing solutions that follow best practices. You MUST be accurate, elegant, and efficient as an expert programmer.**

---

# Role

You are a professional software engineer. All code you write MUST follow best practices, ensuring accuracy, quality, readability, and cleanliness. You MUST make FOCUSED EDITS that are EFFICIENT and ELEGANT.

## Logs

ENSURE that you use the logger.info and logger.warn and logger.error instead of the console.log whenever you want to display logs.

## Comments

You must use TSDOC for comments. Do not use ==== for comments to separate sections. Do not leave any comments that are not TSDOC.

## Global Styles

You should not update the global styles unless it is absolutely necessary. Keep all styling local to components and files.

## Bun

Use bun and bunx not npm and npx.

## Code Quality

- Write clean, maintainable code that follows the project's existing patterns
- Prefer composition over inheritance
- Keep functions small and focused on a single responsibility
- Use meaningful variable and function names
- Handle errors gracefully and provide useful error messages
- Write type-safe code with proper TypeScript types

## Testing

- Write tests for new functionality when appropriate
- Ensure existing tests pass before completing work
- Follow the project's testing conventions

## Performance

- Consider performance implications of your code
- Avoid unnecessary re-renders in React components
- Use appropriate data structures and algorithms
- Profile and optimize when necessary
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.local.yml]---
Location: sim-main/docker-compose.local.yml
Signals: Docker

```yaml
services:
  simstudio:
    build:
      context: .
      dockerfile: docker/app.Dockerfile
    ports:
      - '3000:3000'
    deploy:
      resources:
        limits:
          memory: 8G
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-simstudio}
      - BETTER_AUTH_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-your_auth_secret_here}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY:-your_encryption_key_here}
      - COPILOT_API_KEY=${COPILOT_API_KEY}
      - SIM_AGENT_API_URL=${SIM_AGENT_API_URL}
      - OLLAMA_URL=${OLLAMA_URL:-http://localhost:11434}
      - NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL:-http://localhost:3002}
    depends_on:
      db:
        condition: service_healthy
      migrations:
        condition: service_completed_successfully
      realtime:
        condition: service_healthy
    healthcheck:
      test: ['CMD', 'wget', '--spider', '--quiet', 'http://127.0.0.1:3000']
      interval: 90s
      timeout: 5s
      retries: 3
      start_period: 10s

  realtime:
    build:
      context: .
      dockerfile: docker/realtime.Dockerfile
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-simstudio}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL:-http://localhost:3000}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-your_auth_secret_here}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    ports:
      - '3002:3002'
    deploy:
      resources:
        limits:
          memory: 8G
    healthcheck:
      test: ['CMD', 'wget', '--spider', '--quiet', 'http://127.0.0.1:3002/health']
      interval: 90s
      timeout: 5s
      retries: 3
      start_period: 10s

  migrations:
    build:
      context: .
      dockerfile: docker/db.Dockerfile
    working_dir: /app/packages/db
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-simstudio}
    depends_on:
      db:
        condition: service_healthy
    command: ['bun', 'run', 'db:migrate']
    restart: 'no'

  db:
    image: pgvector/pgvector:pg17
    restart: always
    ports:
      - '${POSTGRES_PORT:-5432}:5432'
    environment:
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
      - POSTGRES_DB=${POSTGRES_DB:-simstudio}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.ollama.yml]---
Location: sim-main/docker-compose.ollama.yml
Signals: Docker

```yaml
name: sim-with-ollama

services:
  # Main Sim Studio Application
  simstudio:
    build:
      context: .
      dockerfile: docker/app.Dockerfile
    ports:
      - '3000:3000'
    deploy:
      resources:
        limits:
          memory: 8G
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-simstudio}
      - BETTER_AUTH_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-sim_auth_secret_$(openssl rand -hex 16)}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY:-$(openssl rand -hex 32)}
      - COPILOT_API_KEY=${COPILOT_API_KEY}
      - SIM_AGENT_API_URL=${SIM_AGENT_API_URL}
      - OLLAMA_URL=http://ollama:11434
      - NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL:-http://localhost:3002}
    depends_on:
      db:
        condition: service_healthy
      migrations:
        condition: service_completed_successfully
      realtime:
        condition: service_healthy
    healthcheck:
      test: ['CMD', 'wget', '--spider', '--quiet', 'http://127.0.0.1:3000']
      interval: 90s
      timeout: 5s
      retries: 3
      start_period: 10s
    restart: unless-stopped

  # Realtime Socket Server
  realtime:
    build:
      context: .
      dockerfile: docker/realtime.Dockerfile
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-simstudio}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL:-http://localhost:3000}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-sim_auth_secret_$(openssl rand -hex 16)}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    ports:
      - '3002:3002'
    deploy:
      resources:
        limits:
          memory: 8G
    healthcheck:
      test: ['CMD', 'wget', '--spider', '--quiet', 'http://127.0.0.1:3002/health']
      interval: 90s
      timeout: 5s
      retries: 3
      start_period: 10s

  # Database Migrations
  migrations:
    build:
      context: .
      dockerfile: docker/db.Dockerfile
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-simstudio}
    depends_on:
      db:
        condition: service_healthy
    command: ['bun', 'run', 'db:migrate']
    restart: 'no'

  # PostgreSQL Database with Vector Extension
  db:
    image: pgvector/pgvector:pg17
    restart: always
    ports:
      - '${POSTGRES_PORT:-5432}:5432'
    environment:
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
      - POSTGRES_DB=${POSTGRES_DB:-simstudio}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5

  # Ollama with GPU support (default)
  ollama:
    profiles:
      - gpu
    image: ollama/ollama:latest
    pull_policy: always
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - '11434:11434'
    environment:
      - NVIDIA_DRIVER_CAPABILITIES=all
      - OLLAMA_LOAD_TIMEOUT=-1
      - OLLAMA_KEEP_ALIVE=-1
      - OLLAMA_DEBUG=1
      - OLLAMA_HOST=0.0.0.0:11434
    command: 'serve'
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    healthcheck:
      test: ['CMD', 'ollama', 'list']
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped

  # Ollama CPU-only version (use with --profile cpu profile)
  ollama-cpu:
    profiles:
      - cpu
    image: ollama/ollama:latest
    pull_policy: always
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - '11434:11434'
    environment:
      - OLLAMA_LOAD_TIMEOUT=-1
      - OLLAMA_KEEP_ALIVE=-1
      - OLLAMA_DEBUG=1
      - OLLAMA_HOST=0.0.0.0:11434
    command: 'serve'
    healthcheck:
      test: ['CMD', 'ollama', 'list']
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    networks:
      default:
        aliases:
          - ollama

  # Helper container to pull models automatically
  model-setup:
    image: ollama/ollama:latest
    profiles:
      - setup
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_HOST=ollama:11434
    entrypoint: ["/bin/sh", "-lc"]
    command: >
      sh -c "
        echo 'Waiting for Ollama to be ready...' &&
        until ollama list >/dev/null 2>&1; do echo 'Waiting for Ollama...'; sleep 2; done &&
        echo 'Pulling gemma3:4b model (recommended starter model)...' &&
        ollama pull gemma3:4b &&
        echo 'Model setup complete! You can now use gemma3:4b in Sim.' &&
        echo 'To add more models, run: docker compose -f docker-compose.ollama.yml exec ollama ollama pull <model-name>'
      "
    restart: 'no'

volumes:
  postgres_data:
  ollama_data:
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.prod.yml]---
Location: sim-main/docker-compose.prod.yml

```yaml
services:
  simstudio:
    image: ghcr.io/simstudioai/simstudio:latest
    restart: unless-stopped
    ports:
      - '3000:3000'
    deploy:
      resources:
        limits:
          memory: 8G
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-simstudio}
      - BETTER_AUTH_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-your_auth_secret_here}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY:-your_encryption_key_here}
      - COPILOT_API_KEY=${COPILOT_API_KEY}
      - SIM_AGENT_API_URL=${SIM_AGENT_API_URL}
      - OLLAMA_URL=${OLLAMA_URL:-http://localhost:11434}
      - SOCKET_SERVER_URL=${SOCKET_SERVER_URL:-http://localhost:3002}
      - NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL:-http://localhost:3002}
    depends_on:
      db:
        condition: service_healthy
      migrations:
        condition: service_completed_successfully
      realtime:
        condition: service_healthy
    healthcheck:
      test: ['CMD', 'wget', '--spider', '--quiet', 'http://127.0.0.1:3000']
      interval: 90s
      timeout: 5s
      retries: 3
      start_period: 10s

  realtime:
    image: ghcr.io/simstudioai/realtime:latest
    restart: unless-stopped
    ports:
      - '3002:3002'
    deploy:
      resources:
        limits:
          memory: 4G
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-simstudio}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL:-http://localhost:3000}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-your_auth_secret_here}
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ['CMD', 'wget', '--spider', '--quiet', 'http://127.0.0.1:3002/health']
      interval: 90s
      timeout: 5s
      retries: 3
      start_period: 10s

  migrations:
    image: ghcr.io/simstudioai/migrations:latest
    working_dir: /app/packages/db
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-simstudio}
    depends_on:
      db:
        condition: service_healthy
    command: ['bun', 'run', 'db:migrate']
    restart: 'no'

  db:
    image: pgvector/pgvector:pg17
    restart: unless-stopped
    ports:
      - '${POSTGRES_PORT:-5432}:5432'
    environment:
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
      - POSTGRES_DB=${POSTGRES_DB:-simstudio}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: sim-main/LICENSE

```text

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright 2025 Sim Studio, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

--------------------------------------------------------------------------------

---[FILE: NOTICE]---
Location: sim-main/NOTICE

```text
Sim Studio
Copyright 2025 Sim Studio

This product includes software developed for the Sim project.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: sim-main/package.json
Signals: React, Next.js

```json
{
  "name": "simstudio",
  "packageManager": "bun@1.3.3",
  "version": "0.0.0",
  "private": true,
  "license": "Apache-2.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "dev:sockets": "cd apps/sim && bun run dev:sockets",
    "dev:full": "cd apps/sim && bun run dev:full",
    "test": "turbo run test",
    "format": "bunx biome format --write .",
    "format:check": "bunx biome format .",
    "lint": "bunx biome check --write --unsafe .",
    "lint:check": "bunx biome check --unsafe .",
    "lint:helm": "helm lint ./helm/sim --strict --values ./helm/sim/test/values-lint.yaml",
    "lint:all": "bun run lint && bun run lint:helm",
    "check": "bunx biome check --files-ignore-unknown=true",
    "prepare": "bun husky",
    "type-check": "turbo run type-check",
    "release": "bun run scripts/create-single-release.ts"
  },
  "overrides": {
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "next": "16.1.0-canary.21",
    "@next/env": "16.1.0-canary.21",
    "drizzle-orm": "^0.44.5",
    "postgres": "^3.4.5"
  },
  "dependencies": {
    "@linear/sdk": "40.0.0",
    "next-runtime-env": "3.3.0",
    "@modelcontextprotocol/sdk": "1.20.2",
    "@t3-oss/env-nextjs": "0.13.4",
    "zod": "^3.24.2",
    "@tanstack/react-query": "5.90.8",
    "@tanstack/react-query-devtools": "5.90.2",
    "@types/fluent-ffmpeg": "2.1.28",
    "cronstrue": "3.3.0",
    "drizzle-orm": "^0.44.5",
    "ffmpeg-static": "5.3.0",
    "fluent-ffmpeg": "2.1.3",
    "isolated-vm": "6.0.2",
    "mongodb": "6.19.0",
    "neo4j-driver": "6.0.1",
    "nodemailer": "7.0.11",
    "onedollarstats": "0.0.10",
    "postgres": "^3.4.5",
    "remark-gfm": "4.0.1",
    "rss-parser": "3.13.0",
    "socket.io-client": "4.8.1",
    "twilio": "5.9.0"
  },
  "devDependencies": {
    "@biomejs/biome": "2.0.0-beta.5",
    "@next/env": "16.1.0-canary.21",
    "@octokit/rest": "^21.0.0",
    "@tailwindcss/typography": "0.5.19",
    "@types/nodemailer": "7.0.4",
    "drizzle-kit": "^0.31.4",
    "husky": "9.1.7",
    "lint-staged": "16.0.0",
    "turbo": "2.6.3"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,scss}": [
      "biome check --write --no-errors-on-unmatched --files-ignore-unknown=true"
    ]
  },
  "trustedDependencies": [
    "ffmpeg-static",
    "isolated-vm",
    "sharp"
  ]
}
```

--------------------------------------------------------------------------------

````
