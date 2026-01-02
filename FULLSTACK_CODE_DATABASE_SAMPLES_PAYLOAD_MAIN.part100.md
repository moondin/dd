---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 100
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 100 of 695)

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

---[FILE: contact-form.ts]---
Location: payload-main/examples/localization/src/endpoints/seed/contact-form.ts

```typescript
import type { Form } from '@/payload-types'

export const contactForm = (locale: 'en' | 'es'): Partial<Form> => ({
  confirmationMessage: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text:
                locale === 'en'
                  ? 'The contact form has been submitted successfully.'
                  : 'El formulario de contacto ha sido enviado con éxito.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  confirmationType: 'message',
  createdAt: '2023-01-12T21:47:41.374Z',
  emails: [
    {
      emailFrom: '"Payload" \u003Cdemo@payloadcms.com\u003E',
      emailTo: '{{email}}',
      message: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text:
                    locale === 'en'
                      ? 'Your contact form submission was successfully received.'
                      : 'Su envío de formulario de contacto se recibió con éxito.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      subject: locale === 'en' ? "You've received a new message." : 'Ha recibido un nuevo mensaje.',
    },
  ],
  fields: [
    {
      name: 'full-name',
      blockName: 'full-name',
      blockType: 'text',
      label: locale === 'en' ? 'Full Name' : 'Nombre completo',
      required: true,
      width: 100,
    },
    {
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      required: true,
      width: 100,
    },
    {
      name: 'phone',
      blockName: 'phone',
      blockType: 'number',
      label: locale === 'en' ? 'Phone' : 'Teléfono',
      required: false,
      width: 100,
    },
    {
      name: 'message',
      blockName: 'message',
      blockType: 'textarea',
      label: locale === 'en' ? 'Message' : 'Mensaje',
      required: true,
      width: 100,
    },
  ],
  redirect: undefined,
  submitButtonLabel: locale === 'en' ? 'Submit' : 'Enviar',
  title: locale === 'en' ? 'Contact Form' : 'Formulario de contacto',
  updatedAt: '2023-01-12T21:47:41.374Z',
})
```

--------------------------------------------------------------------------------

---[FILE: contact-page.ts]---
Location: payload-main/examples/localization/src/endpoints/seed/contact-page.ts

```typescript
import type { Page } from '@/payload-types'

export const contact = (locale: 'en' | 'es'): Partial<Page> => ({
  slug: 'contact',
  slugLock: false,
  _status: 'published',
  hero: {
    type: 'none',
  },
  layout: [
    {
      blockType: 'formBlock',
      enableIntro: true,
      // @ts-ignore
      form: '{{CONTACT_FORM_ID}}',
      introContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text:
                    locale === 'en'
                      ? 'Example contact form:'
                      : 'Formulario de contacto de ejemplo:',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h3',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  title: locale === 'en' ? 'Contact' : 'Contacto',
})
```

--------------------------------------------------------------------------------

---[FILE: home-static.ts]---
Location: payload-main/examples/localization/src/endpoints/seed/home-static.ts

```typescript
import type { Page } from '@/payload-types'

// Used for pre-seeded content so that the homepage is not empty
// @ts-expect-error
export const homeStatic: Page = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Payload Website Template',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'link',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Visit the admin dashboard',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                fields: {
                  linkType: 'custom',
                  newTab: false,
                  url: '/admin',
                },
                format: '',
                indent: 0,
                version: 2,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' to make your account and seed content for your website.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  meta: {
    description: 'An open-source website built with Payload and Next.js.',
    title: 'Payload Website Template',
  },
  title: 'Home',
}
```

--------------------------------------------------------------------------------

---[FILE: home.ts]---
Location: payload-main/examples/localization/src/endpoints/seed/home.ts

```typescript
import type { RequiredDataFromCollectionSlug } from 'payload'

export const home = (locale: 'en' | 'es' | 'ja'): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'home',
  slugLock: false,
  _status: 'published',
  hero: {
    type: 'highImpact',
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: locale === 'en' ? 'All posts' : 'Ver publicaciones',
          url: '/posts',
        },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: locale === 'en' ? 'Contact' : 'Contacto',
          url: '/contact',
        },
      },
    ],
    // @ts-ignore
    media: '{{IMAGE_1}}',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text:
                  locale === 'en'
                    ? 'Payload Website Template'
                    : 'Plantilla de sitio web de Payload',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'link',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text:
                      locale === 'en'
                        ? 'Visit the admin dashboard'
                        : 'Visita el panel de administración',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                fields: {
                  linkType: 'custom',
                  newTab: false,
                  url: '/admin',
                },
                format: '',
                indent: 0,
                version: 3,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text:
                  locale === 'en'
                    ? " to begin managing this site's content. The code for this template is completely open-source and can be found "
                    : ' para comenzar a administrar el contenido de este sitio. El código de esta plantilla es completamente de código abierto y se puede encontrar ',
                version: 1,
              },
              {
                type: 'link',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: locale === 'en' ? 'here' : 'aquí',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                fields: {
                  linkType: 'custom',
                  newTab: true,
                  url: 'https://github.com/payloadcms/payload/tree/beta/templates/website',
                },
                format: '',
                indent: 0,
                version: 3,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: '. ',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  layout: [
    {
      blockName: 'Content Block',
      blockType: 'content',
      columns: [
        {
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: locale === 'en' ? 'Core features' : 'Características principales',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h2',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          size: 'full',
        },
        {
          enableLink: false,
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: locale === 'en' ? 'Admin Dashboard' : 'Panel de administración',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h3',
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text:
                        locale === 'en'
                          ? "Manage this site's pages and posts from the "
                          : 'Administre las páginas y publicaciones de este sitio desde el ',
                      version: 1,
                    },
                    {
                      type: 'link',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: locale === 'en' ? 'admin dashboard' : 'panel de administración',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      fields: {
                        linkType: 'custom',
                        newTab: false,
                        url: '/admin',
                      },
                      format: '',
                      indent: 0,
                      version: 2,
                    },
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: '.',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          size: 'oneThird',
        },
        {
          enableLink: false,
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: locale === 'en' ? 'Preview' : 'Vista previa',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h3',
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text:
                        locale === 'en'
                          ? 'Using versions, drafts, and preview, editors can review and share their changes before publishing them.'
                          : 'Utilizando versiones, borradores y vista previa, los editores pueden revisar y compartir sus cambios antes de publicarlos.',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          size: 'oneThird',
        },
        {
          enableLink: false,
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: locale === 'en' ? 'Page Builder' : 'Constructor de páginas',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h3',
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text:
                        locale === 'en'
                          ? 'Custom page builder allows you to create unique page, post, and project layouts for any type of content.'
                          : 'El constructor de páginas personalizado le permite crear diseños de página, publicación y proyecto únicos para cualquier tipo de contenido.',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          size: 'oneThird',
        },
        {
          enableLink: false,
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'SEO',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h3',
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text:
                        locale === 'en'
                          ? 'Editors have complete control over SEO data and site content directly from the '
                          : 'Los editores tienen control total sobre los datos de SEO y el contenido del sitio directamente desde el ',
                      version: 1,
                    },
                    {
                      type: 'link',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: locale === 'en' ? 'admin dashboard' : 'panel de administración',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      fields: {
                        linkType: 'custom',
                        newTab: false,
                        url: '/admin',
                      },
                      format: '',
                      indent: 0,
                      version: 2,
                    },
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: '.',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          size: 'oneThird',
        },
        {
          enableLink: false,
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: locale === 'en' ? 'Dark Mode' : 'Modo oscuro',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h3',
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text:
                        locale === 'en'
                          ? 'Users will experience this site in their preferred color scheme and each block can be inverted.'
                          : 'Los usuarios experimentarán este sitio en su esquema de color preferido y cada bloque puede ser invertido.',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          size: 'oneThird',
        },
      ],
    },
    {
      blockName: 'Media Block',
      blockType: 'mediaBlock',
      // @ts-ignore
      media: '{{IMAGE_2}}',
      position: 'default',
    },
    {
      blockName: 'Archive Block',
      blockType: 'archive',
      categories: [],
      introContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: locale === 'en' ? 'Recent posts' : 'Publicaciones recientes',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h3',
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text:
                    locale === 'en'
                      ? 'The posts below are displayed in an "Archive" layout building block which is an extremely powerful way to display documents on a page. It can be auto-populated by collection or by category, or posts can be individually selected. Pagination controls will automatically appear if the number of results exceeds the number of items per page.'
                      : 'Las publicaciones que aparecen a continuación se muestran en un bloque de diseño de "Archivo", que es una forma muy eficaz de mostrar documentos en una página. Se puede mostrar automáticamente por colección o por categoría, o se pueden seleccionar publicaciones individualmente. Los controles de paginación aparecerán automáticamente si la cantidad de resultados supera la cantidad de elementos por página.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      populateBy: 'collection',
      relationTo: 'posts',
    },
    {
      blockName: 'CTA',
      blockType: 'cta',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: locale === 'en' ? 'All posts' : 'Ver publicaciones',
            url: '/posts',
          },
        },
      ],
      richText: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text:
                    locale === 'en' ? 'This is a call to action' : 'Esta es una llamada a acción',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h3',
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text:
                    locale === 'en'
                      ? 'This is a custom layout building block '
                      : 'Este es un bloque de construcción de diseño personalizado ',
                  version: 1,
                },
                {
                  type: 'link',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text:
                        locale === 'en'
                          ? 'configured in the admin dashboard'
                          : 'configurado en el panel de administración',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  fields: {
                    linkType: 'custom',
                    newTab: false,
                    url: '/admin',
                  },
                  format: '',
                  indent: 0,
                  version: 2,
                },
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: '.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  meta: {
    description:
      locale === 'en'
        ? 'An open-source website built with Payload and Next.js.'
        : 'Un sitio web open source construido con Payload y Next.js',
    // @ts-ignore
    image: '{{IMAGE_1}}',
    title: locale === 'en' ? 'Payload Website Template' : 'Plantilla de sitio web de Payload',
  },
  title: locale === 'en' ? 'Home' : 'Inicio',
})
```

--------------------------------------------------------------------------------

---[FILE: image-1.ts]---
Location: payload-main/examples/localization/src/endpoints/seed/image-1.ts

```typescript
import type { Media } from '@/payload-types'

export const image1 = (locale: 'en' | 'es'): Omit<Media, 'createdAt' | 'id' | 'updatedAt'> => ({
  alt:
    locale === 'en'
      ? 'Curving abstract shapes with an orange and blue gradient'
      : 'Formas abstractas curvas con un gradiente naranja y azul',
  caption: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: locale === 'en' ? 'Photo by ' : 'Fotografía por ',
              version: 1,
            },
            {
              type: 'link',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Andrew Kliatskyi',
                  version: 1,
                },
              ],
              direction: 'ltr',
              fields: {
                linkType: 'custom',
                newTab: true,
                url: 'https://unsplash.com/@kirp',
              },
              format: '',
              indent: 0,
              version: 2,
            },
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: locale === 'en' ? ' on Unsplash.' : ' en Unsplash.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
})
```

--------------------------------------------------------------------------------

---[FILE: image-2.ts]---
Location: payload-main/examples/localization/src/endpoints/seed/image-2.ts

```typescript
import type { Media } from '@/payload-types'

export const image2 = (locale: 'en' | 'es'): Omit<Media, 'createdAt' | 'id' | 'updatedAt'> => ({
  alt:
    locale === 'en'
      ? 'Curving abstract shapes with an orange and blue gradient'
      : 'Formas abstractas curvas con un gradiente naranja y azul',
  caption: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: locale === 'en' ? 'Photo by ' : 'Fotografía por ',
              version: 1,
            },
            {
              type: 'link',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Andrew Kliatskyi',
                  version: 1,
                },
              ],
              direction: 'ltr',
              fields: {
                linkType: 'custom',
                newTab: true,
                url: 'https://unsplash.com/@kirp',
              },
              format: '',
              indent: 0,
              version: 2,
            },
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: locale === 'en' ? ' on Unsplash.' : ' en Unsplash.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
})
```

--------------------------------------------------------------------------------

````
