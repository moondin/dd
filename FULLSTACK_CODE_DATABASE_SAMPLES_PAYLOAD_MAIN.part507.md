---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 507
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 507 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/a11y/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/a11y/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: types.d.ts]---
Location: payload-main/test/a11y/types.d.ts

```typescript
import type { RequestContext as OriginalRequestContext } from 'payload'

declare module 'payload' {
  // Create a new interface that merges your additional fields with the original one
  export interface RequestContext extends OriginalRequestContext {
    myObject?: string
    // ...
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/a11y/collections/Media/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const mediaSlug = 'media'

export const MediaCollection: CollectionConfig = {
  slug: mediaSlug,
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [],
  upload: {
    crop: true,
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        height: 200,
        width: 200,
      },
      {
        name: 'medium',
        height: 800,
        width: 800,
      },
      {
        name: 'large',
        height: 1200,
        width: 1200,
      },
    ],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/a11y/collections/Posts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'title',
    enableListViewSelectAPI: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description:
          'A subtitle field to test focus indicators in the admin UI, helps us detect exiting out of rich text editor properly.',
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: FocusIndicatorsView.tsx]---
Location: payload-main/test/a11y/components/FocusIndicatorsView.tsx
Signals: React

```typescript
'use client'

import { Button } from '@payloadcms/ui'
import React from 'react'

import './styles.css'

export const FocusIndicatorsView = () => {
  return (
    <div className="focus-indicators-test-page">
      <h1>Focus Indicators Test Page</h1>
      <p>This page tests various interactive elements with different focus indicator states.</p>

      {/* Section 1: Good focus indicators (built-in Payload components) */}
      <section className="test-section" data-testid="section-good-payload">
        <h2>Good Focus Indicators (Payload Components)</h2>
        <div className="button-group">
          <Button id="payload-button-1">Payload Button 1</Button>
          <Button buttonStyle="secondary" id="payload-button-2">
            Payload Button 2
          </Button>
          <Button buttonStyle="icon-label" icon="plus" id="payload-button-3">
            Add Item
          </Button>
        </div>
      </section>

      {/* Section 2: Standard HTML with good focus indicators */}
      <section className="test-section" data-testid="section-good-html">
        <h2>Good Focus Indicators (Standard HTML)</h2>
        <div className="button-group">
          <button className="good-focus" id="good-button-1" type="button">
            Good Button 1
          </button>
          <button className="good-focus-outline" id="good-button-2" type="button">
            Good Button 2 (Outline)
          </button>
          <button className="good-focus-shadow" id="good-button-3" type="button">
            Good Button 3 (Shadow)
          </button>
        </div>
        <div className="link-group">
          <a className="good-focus" href="#section1" id="good-link-1">
            Good Link 1
          </a>
          <a className="good-focus-outline" href="#section2" id="good-link-2">
            Good Link 2
          </a>
        </div>
      </section>

      {/* Section 3: Elements with focus indicators on pseudo-elements */}
      <section className="test-section" data-testid="section-pseudo">
        <h2>Focus Indicators via Pseudo-elements</h2>
        <div className="button-group">
          <button className="focus-after-outline" id="pseudo-after-outline" type="button">
            After Outline
          </button>
          <button className="focus-before-border" id="pseudo-before-border" type="button">
            Before Border
          </button>
          <button className="focus-after-shadow" id="pseudo-after-shadow" type="button">
            After Shadow
          </button>
        </div>
      </section>

      {/* Section 4: BAD - No focus indicators */}
      <section className="test-section" data-testid="section-bad">
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <h2>⚠️ Bad Focus Indicators (Should Fail)</h2>
        <div className="button-group">
          <button className="no-focus" id="bad-button-1" type="button">
            No Focus 1
          </button>
          <button className="no-focus" id="bad-button-2" type="button">
            No Focus 2
          </button>
          <button className="transparent-focus" id="bad-button-3" type="button">
            Transparent Focus
          </button>
        </div>
        <div className="link-group">
          <a className="no-focus" href="#bad1" id="bad-link-1">
            Bad Link 1
          </a>
          <a className="no-focus" href="#bad2" id="bad-link-2">
            Bad Link 2
          </a>
        </div>
        <input
          className="no-focus"
          id="bad-input-1"
          placeholder="Input without focus indicator"
          type="text"
        />
      </section>

      {/* Section 5: Mixed - Some good, some bad */}
      <section className="test-section" data-testid="section-mixed">
        <h2>Mixed Focus Indicators</h2>
        <div className="form-group">
          <label htmlFor="good-input-1">
            Good Input:
            <input className="good-focus" id="good-input-1" placeholder="Good focus" type="text" />
          </label>
          <label htmlFor="bad-input-2">
            Bad Input:
            <input className="no-focus" id="bad-input-2" placeholder="No focus" type="text" />
          </label>
          <label htmlFor="good-select-1">
            Good Select:
            <select className="good-focus" id="good-select-1">
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </label>
          <label htmlFor="bad-select-1">
            Bad Select:
            <select className="no-focus" id="bad-select-1">
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </label>
        </div>
      </section>

      {/* Section 6: Edge cases */}
      <section className="test-section" data-testid="section-edge-cases">
        <h2>Edge Cases</h2>
        <div className="button-group">
          <button className="zero-width-border" id="zero-width-border" type="button">
            Zero Width Border
          </button>
          <button className="zero-opacity-shadow" id="zero-opacity-shadow" type="button">
            Zero Opacity Shadow
          </button>
          <button className="transparent-outline" id="transparent-outline" type="button">
            Transparent Outline
          </button>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <div className="good-focus" id="focusable-div" tabIndex={0}>
            Focusable Div
          </div>
        </div>
      </section>

      {/* Section 7: Disabled elements (should not be in tab order) */}
      <section className="test-section" data-testid="section-disabled">
        <h2>Disabled Elements (Not in Tab Order)</h2>
        <div className="button-group">
          <button disabled id="disabled-button" type="button">
            Disabled Button
          </button>
          <input disabled id="disabled-input" placeholder="Disabled input" type="text" />
        </div>
      </section>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: styles.css]---
Location: payload-main/test/a11y/components/styles.css

```text
.focus-indicators-test-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    margin-bottom: 1rem;
  }

  .test-section {
    margin: 2rem 0;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
    }
  }

  .button-group,
  .link-group,
  .form-group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1rem 0;
  }

  .form-group {
    flex-direction: column;

    label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
  }

  /* // Good focus indicators - Border style */
  .good-focus {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: 2px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    &:focus {
      border-color: #0066cc;
      background: #e6f2ff;
    }
  }

  /* // Good focus indicators - Outline style */
  .good-focus-outline {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;

    &:focus {
      outline: 3px solid #0066cc;
      outline-offset: 2px;
    }
  }

  /* // Good focus indicators - Box shadow style */
  .good-focus-shadow {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;

    &:focus {
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.5);
    }
  }

  /* // Pseudo-element focus indicators - ::after with outline */
  .focus-after-outline {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 6px;
      outline: 0px solid transparent;
      transition: outline 0.2s;
    }

    &:focus {
      outline: none;
    }

    &:focus::after {
      outline: 3px solid #ff6600;
    }
  }

  /* // Pseudo-element focus indicators - ::before with border */
  .focus-before-border {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 6px;
      border: 0px solid transparent;
      transition: border 0.2s;
    }

    &:focus {
      outline: none;
      border: none;
    }

    &:focus::before {
      border: 3px solid #00cc66;
    }
  }

  /* // Pseudo-element focus indicators - ::after with box-shadow */
  .focus-after-shadow {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 6px;
      box-shadow: 0 0 0 0 rgba(153, 0, 204, 0);
      transition: box-shadow 0.2s;
    }

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &:focus::after {
      box-shadow: 0 0 0 3px rgba(153, 0, 204, 0.5);
    }
  }

  /* // BAD - No focus indicators */
  .no-focus {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;

    &:focus {
      /* // Intentionally no visual change - no border, outline, or shadow */
      outline: none;
      border: none;
      box-shadow: none;
    }
  }

  /* // BAD - Transparent focus (technically has styles but not visible) */
  .transparent-focus {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;

    &:focus {
      outline: 2px solid transparent;
      border: 2px solid transparent;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0);
    }
  }

  /* // Edge case - Zero width border */
  .zero-width-border {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;

    &:focus {
      border-width: 0px;
      border-style: solid;
      border-color: #0066cc;
      outline: none;
      box-shadow: none;
    }
  }

  /* // Edge case - Zero opacity shadow */
  .zero-opacity-shadow {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;

    &:focus {
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0);
      outline: none;
      border: none;
    }
  }

  /* // Edge case - Transparent outline */
  .transparent-outline {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;

    &:focus {
      outline: 3px solid transparent;
      border: none;
      box-shadow: none;
    }
  }

  /* Focusable div with good focus */
  #focusable-div {
    padding: 1rem;
    background: #f0f0f0;
    border: 2px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    &:focus {
      border-color: #0066cc;
      background: #e6f2ff;
      outline: 2px solid #0066cc;
      outline-offset: 1px;
    }
  }

  /* // Links styling */
  a {
    text-decoration: none;
    color: #0066cc;
    padding: 0.5rem;

    &.good-focus,
    &.good-focus-outline,
    &.no-focus {
      display: inline-block;
    }
  }

  /* // Inputs and selects */
  input[type='text'],
  select {
    padding: 0.5rem;
    border-radius: 4px;
    min-width: 200px;
  }

  input[type='text'].good-focus,
  select.good-focus {
    border: 2px solid #ccc;
  }

  input[type='text'].good-focus:focus,
  select.good-focus:focus {
    border-color: #0066cc;
    outline: 2px solid #0066cc;
    outline-offset: 1px;
  }

  input[type='text'].no-focus,
  select.no-focus {
    border: none;
    background: #f0f0f0;
  }

  input[type='text'].no-focus:focus,
  select.no-focus:focus {
    outline: none;
    border: none;
    box-shadow: none;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/a11y/globals/Menu/index.ts

```typescript
import type { GlobalConfig } from 'payload'

export const menuSlug = 'menu'

export const MenuGlobal: GlobalConfig = {
  slug: menuSlug,
  fields: [
    {
      name: 'globalText',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: config.postgreslogs.ts]---
Location: payload-main/test/access-control/config.postgreslogs.ts

```typescript
/* eslint-disable no-restricted-exports */
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { getConfig } from './getConfig.js'

const config = getConfig()

import { postgresAdapter } from '@payloadcms/db-postgres'

export const databaseAdapter = postgresAdapter({
  pool: {
    connectionString: process.env.POSTGRES_URL || 'postgres://127.0.0.1:5432/payloadtests',
  },
  logger: true,
})

export default buildConfigWithDefaults(
  {
    ...config,
    db: databaseAdapter,
  },
  {
    disableAutoLogin: true,
  },
)
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/access-control/config.ts

```typescript
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { getConfig } from './getConfig.js'

export default buildConfigWithDefaults(getConfig(), {
  disableAutoLogin: true,
})
```

--------------------------------------------------------------------------------

````
