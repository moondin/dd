---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 101
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 101 of 695)

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

---[FILE: index.ts]---
Location: payload-main/examples/localization/src/endpoints/seed/index.ts

```typescript
import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { post1, post1_es } from './post-1'
import { post2, post2_es } from './post-2'
import { post3, post3_es } from './post-3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  // 'search', TO-DO: enable again!
]
const globals: GlobalSlug[] = ['header', 'footer']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not

  // #region Clearing database
  payload.logger.info(`— Clearing media...`)

  const mediaDir = path.resolve(dirname, '../../public/media')
  if (fs.existsSync(mediaDir)) {
    fs.rmdirSync(mediaDir, { recursive: true })
  }

  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  for (const global of globals) {
    await payload.updateGlobal({
      slug: global,
      data: {
        navItems: [],
      },
      req,
    })
  }

  for (const collection of collections) {
    await payload.delete({
      collection: collection,
      where: {
        id: {
          exists: true,
        },
      },
      req,
    })
  }

  await payload.delete({
    collection: 'pages',
    where: {},
    req,
  })
  // #endregion

  // #region Users
  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: 'demo-author@payloadcms.com',
      },
    },
    req,
  })

  const demoAuthor = await payload.create({
    collection: 'users',
    data: {
      name: 'Demo Author',
      email: 'demo-author@payloadcms.com',
      password: 'password',
    },
    req,
  })

  let demoAuthorID: number | string = demoAuthor.id
  // #endregion

  // #region Media
  payload.logger.info(`— Seeding media...`)
  const image1Doc = await payload.create({
    collection: 'media',
    data: image1('en'),
    locale: 'en',
    filePath: path.resolve(dirname, 'image-post1.webp'),
    req,
  })
  await payload.update({
    collection: 'media',
    id: image1Doc.id,
    data: image1('es'),
    locale: 'es',
    filePath: path.resolve(dirname, 'image-post1.webp'),
    req,
  })

  const image2Doc = await payload.create({
    collection: 'media',
    locale: 'en',
    data: image2('en'),
    filePath: path.resolve(dirname, 'image-post2.webp'),
    req,
  })
  await payload.update({
    collection: 'media',
    id: image2Doc.id,
    data: image2('es'),
    locale: 'es',
    filePath: path.resolve(dirname, 'image-post2.webp'),
    req,
  })

  const image3Doc = await payload.create({
    collection: 'media',
    locale: 'en',
    data: image2('en'),
    filePath: path.resolve(dirname, 'image-post3.webp'),
    req,
  })
  await payload.update({
    collection: 'media',
    id: image3Doc.id,
    data: image2('es'),
    locale: 'es',
    filePath: path.resolve(dirname, 'image-post3.webp'),
    req,
  })

  const imageHomeDoc = await payload.create({
    collection: 'media',
    locale: 'en',
    data: image2('en'),
    filePath: path.resolve(dirname, 'image-hero1.webp'),
    req,
  })
  await payload.update({
    collection: 'media',
    id: imageHomeDoc.id,
    data: image2('es'),
    locale: 'es',
    filePath: path.resolve(dirname, 'image-hero1.webp'),
    req,
  })

  let image1ID: number | string = image1Doc.id
  let image2ID: number | string = image2Doc.id
  let image3ID: number | string = image3Doc.id
  let imageHomeID: number | string = imageHomeDoc.id

  if (payload.db.defaultIDType === 'text') {
    image1ID = `"${image1Doc.id}"`
    image2ID = `"${image2Doc.id}"`
    image3ID = `"${image3Doc.id}"`
    imageHomeID = `"${imageHomeDoc.id}"`
    demoAuthorID = `"${demoAuthorID}"`
  }
  // #endregion

  // #region Categories
  payload.logger.info(`— Seeding categories...`)
  const technologyCategory = await payload.create({
    collection: 'categories',
    locale: 'en',
    data: {
      title: 'Technology',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: technologyCategory.id,
    locale: 'es',
    data: {
      title: 'Tecnología',
    },
    req,
  })

  const newsCategory = await payload.create({
    collection: 'categories',
    locale: 'en',
    data: {
      title: 'News',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: newsCategory.id,
    locale: 'es',
    data: {
      title: 'Noticias',
    },
    req,
  })

  const financeCategory = await payload.create({
    collection: 'categories',
    locale: 'en',
    data: {
      title: 'Finance',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: financeCategory.id,
    locale: 'es',
    data: {
      title: 'Finanzas',
    },
    req,
  })

  const designCategory = await payload.create({
    collection: 'categories',
    locale: 'en',
    data: {
      title: 'Design',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: designCategory.id,
    locale: 'es',
    data: {
      title: 'Diseño',
    },
    req,
  })

  const softwareCategory = await payload.create({
    collection: 'categories',
    locale: 'en',
    data: {
      title: 'Software',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: softwareCategory.id,
    locale: 'es',
    data: {
      title: 'Software',
    },
    req,
  })

  const engineeringCategory = await payload.create({
    collection: 'categories',
    locale: 'en',
    data: {
      title: 'Engineering',
    },
    req,
  })
  await payload.update({
    collection: 'categories',
    id: engineeringCategory.id,
    locale: 'es',
    data: {
      title: 'Ingeniería',
    },
    req,
  })
  // #endregion

  // #region Posts
  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post1, categories: [technologyCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image1ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'en',
    req,
  })
  await payload.update({
    collection: 'posts',
    id: post1Doc.id,
    data: JSON.parse(
      JSON.stringify({ ...post1_es, categories: [technologyCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image1ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'es',
    req,
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post2, categories: [newsCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image2ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image3ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'en',
    req,
  })
  await payload.update({
    collection: 'posts',
    id: post2Doc.id,
    data: JSON.parse(
      JSON.stringify({ ...post2_es, categories: [newsCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image2ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image3ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'es',
    req,
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post3, categories: [financeCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image3ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image1ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'en',
    req,
  })
  await payload.update({
    collection: 'posts',
    id: post3Doc.id,
    data: JSON.parse(
      JSON.stringify({ ...post3_es, categories: [financeCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image3ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image1ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
    locale: 'es',
    req,
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
    req,
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
    req,
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
    req,
  })
  // #endregion

  // #region Pages
  payload.logger.info(`— Seeding home page...`)

  const homePage = await payload.create({
    collection: 'pages',
    locale: 'en',
    data: JSON.parse(
      JSON.stringify(home('en'))
        .replace(/"\{\{IMAGE_1\}\}"/g, String(imageHomeID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID)),
    ),
    req,
  })
  await payload.update({
    collection: 'pages',
    id: homePage.id,
    locale: 'es',
    data: JSON.parse(
      JSON.stringify(home('es'))
        .replace(/"\{\{IMAGE_1\}\}"/g, String(imageHomeID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID)),
    ),
    req,
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    locale: 'en',
    data: JSON.parse(JSON.stringify(contactFormData('en'))),
    req,
  })

  const contactFormData_es = JSON.parse(JSON.stringify(contactFormData('es')))
  await payload.update({
    collection: 'forms',
    id: contactForm.id,
    locale: 'es',
    data: {
      redirect: contactFormData_es.redirect,
      title: contactFormData_es.title,
      id: contactForm.id,
      submitButtonLabel: contactFormData_es.submitButtonLabel,
      confirmationType: contactFormData_es.confirmationType,
      createdAt: contactFormData_es.createdAt,
      updatedAt: contactFormData_es.updatedAt,
      confirmationMessage: contactFormData_es.confirmationMessage,
      fields: contactFormData_es.fields?.map((field, index) => ({
        id: contactForm.fields![index].id,
        ...field,
      })),
      emails: contactFormData_es.emails?.map((email, index) => ({
        id: contactForm.emails![index].id,
        ...email,
      })),
    },
    req,
  })

  let contactFormID: number | string = contactForm.id

  if (payload.db.defaultIDType === 'text') {
    contactFormID = `"${contactFormID}"`
  }

  payload.logger.info(`— Seeding contact page...`)

  const contactPage = await payload.create({
    collection: 'pages',
    locale: 'en',
    data: JSON.parse(
      JSON.stringify(contactPageData('en')).replace(
        /"\{\{CONTACT_FORM_ID\}\}"/g,
        String(contactFormID),
      ),
    ),
    req,
  })
  await payload.update({
    collection: 'pages',
    id: contactPage.id,
    locale: 'es',
    data: JSON.parse(
      JSON.stringify(contactPageData('es')).replace(
        /"\{\{CONTACT_FORM_ID\}\}"/g,
        String(contactFormID),
      ),
    ),
    req,
  })
  // #endregion

  // #region Globals
  payload.logger.info(`— Seeding header...`)

  const header = await payload.updateGlobal({
    slug: 'header',
    locale: 'en',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            label: 'Home',
            url: '/',
          },
        },
        {
          link: {
            type: 'reference',
            label: 'Contact',
            reference: {
              relationTo: 'pages',
              value: contactPage.id,
            },
          },
        },
      ],
    },
    req,
  })

  await payload.updateGlobal({
    slug: 'header',
    locale: 'es',
    data: {
      navItems: [
        {
          id: header.navItems![0].id,
          link: {
            type: 'custom',
            url: '/',
            label: 'Inicio',
          },
        },
        {
          id: header.navItems![1].id,
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: contactPage.id,
            },
            label: 'Contacto',
          },
        },
      ],
    },
    req,
  })

  payload.logger.info(`— Seeding footer...`)

  const footer = await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            label: 'Admin',
            url: '/admin',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Source Code',
            newTab: true,
            url: 'https://github.com/payloadcms/payload/tree/beta/templates/website',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Payload',
            newTab: true,
            url: 'https://payloadcms.com/',
          },
        },
      ],
    },
    req,
  })
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'es',
    data: {
      navItems: [
        {
          id: footer.navItems![0].id,
          link: {
            type: 'custom',
            url: '/admin',
            label: 'Panel',
          },
        },
        {
          id: footer.navItems![1].id,
          link: {
            type: 'custom',
            url: 'https://github.com/payloadcms/payload/tree/beta/templates/website',
            label: 'Código fuente',
          },
        },
        {
          id: footer.navItems![2].id,
          link: {
            type: 'custom',
            url: 'https://payloadcms.com/',
            label: 'Payload',
          },
        },
      ],
    },
    req,
  })
  // #endregion

  payload.logger.info('Seeded database successfully!')
}
```

--------------------------------------------------------------------------------

---[FILE: post-1.ts]---
Location: payload-main/examples/localization/src/endpoints/seed/post-1.ts

```typescript
import type { Post } from '@/payload-types'

export const post1: Partial<Post> = {
  slug: 'digital-horizons',
  slugLock: false,
  _status: 'published',
  // @ts-ignore
  authors: ['{{AUTHOR}}'],
  content: {
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
              text: 'Dive into the marvels of modern innovation, where the only constant is change. A journey where pixels and data converge to craft the future.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
        {
          type: 'block',
          fields: {
            blockName: 'Disclaimer',
            blockType: 'banner',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 1,
                        mode: 'normal',
                        style: '',
                        text: 'Disclaimer:',
                        version: 1,
                      },
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: ' This content is fabricated and for demonstration purposes only. To edit this post, ',
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
                            text: 'navigate to the admin dashboard',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        fields: {
                          linkType: 'custom',
                          newTab: true,
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
            style: 'info',
          },
          format: '',
          version: 2,
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'The Rise of AI and Machine Learning',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
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
              text: 'We find ourselves in a transformative era where artificial intelligence (AI) stands at the forefront of technological evolution. The ripple effects of its advancements are reshaping industries at an unprecedented pace. No longer are businesses bound by the limitations of tedious, manual processes. Instead, sophisticated machines, fueled by vast amounts of historical data, are now capable of making decisions previously left to human intuition. These intelligent systems are not only optimizing operations but also pioneering innovative approaches, heralding a new age of business transformation worldwide. ',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'To demonstrate basic AI functionality, here is a javascript snippet that makes a POST request to a generic AI API in order to generate text based on a prompt. ',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h4',
          version: 1,
        },
        {
          type: 'block',
          fields: {
            blockName: 'Generate Text',
            blockType: 'code',
            code: "async function generateText(prompt) {\n    const apiKey = 'your-api-key';\n    const apiUrl = 'https://api.example.com/generate-text';\n\n    const response = await fetch(apiUrl, {\n        method: 'POST',\n        headers: {\n            'Content-Type': 'application/json',\n            'Authorization': `Bearer ${apiKey}`\n        },\n        body: JSON.stringify({\n            model: 'text-generation-model',\n            prompt: prompt,\n            max_tokens: 50\n        })\n    });\n\n    const data = await response.json();\n    console.log(data.choices[0].text.trim());\n}\n\n// Example usage\ngenerateText(\"Once upon a time in a faraway land,\");\n",
            language: 'javascript',
          },
          format: '',
          version: 2,
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'IoT: Connecting the World Around Us',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
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
              text: "In today's rapidly evolving technological landscape, the Internet of Things (IoT) stands out as a revolutionary force. From transforming our residences with smart home systems to redefining transportation through connected cars, IoT's influence is palpable in nearly every facet of our daily lives.",
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
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
              text: "This technology hinges on the seamless integration of devices and systems, allowing them to communicate and collaborate effortlessly. With each connected device, we move a step closer to a world where convenience and efficiency are embedded in the very fabric of our existence. As a result, we're transitioning into an era where our surroundings intuitively respond to our needs, heralding a smarter and more interconnected global community.",
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
        {
          type: 'block',
          fields: {
            blockName: '',
            blockType: 'mediaBlock',
            media: '{{IMAGE_2}}',
            position: 'default',
          },
          format: '',
          version: 2,
        },
        {
          type: 'block',
          fields: {
            blockName: 'Dynamic Components',
            blockType: 'banner',
            content: {
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
                        text: "This content above is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
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
            style: 'info',
          },
          format: '',
          version: 2,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },

  meta: {
    description:
      'Dive into the marvels of modern innovation, where the only constant is change. A journey where pixels and data converge to craft the future.',
    // @ts-ignore
    image: '{{IMAGE_1}}',
    title: 'Digital Horizons: A Glimpse into Tomorrow',
  },
  relatedPosts: [], // this is populated by the seed script
  title: 'Digital Horizons: A Glimpse into Tomorrow',
}

export const post1_es: Partial<Post> = {
  slug: 'digital-horizons',
  slugLock: false,
  _status: 'published',
  // @ts-ignore
  authors: ['{{AUTHOR}}'],
  content: {
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
              text: 'Sumérgete en las maravillas de la innovación moderna, donde la única constante es el cambio. Un viaje donde los píxeles y los datos convergen para crear el futuro.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
        {
          type: 'block',
          fields: {
            blockName: 'Aviso Legal',
            blockType: 'banner',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 1,
                        mode: 'normal',
                        style: '',
                        text: 'Aviso legal:',
                        version: 1,
                      },
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: ' Este contenido es ficticio y solo para fines de demostración. Para editar esta publicación, ',
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
                            text: 'navega al panel de administración',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        fields: {
                          linkType: 'custom',
                          newTab: true,
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
            style: 'info',
          },
          format: '',
          version: 2,
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'El auge de la IA y el aprendizaje automático',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
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
              text: 'Nos encontramos en una era transformadora donde la inteligencia artificial (IA) está a la vanguardia de la evolución tecnológica. Los efectos de sus avances están remodelando las industrias a un ritmo sin precedentes. Las empresas ya no están limitadas por los tediosos procesos manuales. Ahora, sofisticadas máquinas, impulsadas por vastas cantidades de datos históricos, son capaces de tomar decisiones que antes dependían de la intuición humana. Estos sistemas inteligentes no solo optimizan las operaciones, sino que también están abriendo nuevas vías innovadoras, anunciando una nueva era de transformación empresarial en todo el mundo.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Para demostrar la funcionalidad básica de la IA, aquí hay un fragmento de código JavaScript que realiza una solicitud POST a una API genérica de IA para generar texto basado en un prompt.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h4',
          version: 1,
        },
        {
          type: 'block',
          fields: {
            blockName: 'Generar Texto',
            blockType: 'code',
            code: "async function generateText(prompt) {\n    const apiKey = 'your-api-key';\n    const apiUrl = 'https://api.example.com/generate-text';\n\n    const response = await fetch(apiUrl, {\n        method: 'POST',\n        headers: {\n            'Content-Type': 'application/json',\n            'Authorization': `Bearer ${apiKey}`\n        },\n        body: JSON.stringify({\n            model: 'text-generation-model',\n            prompt: prompt,\n            max_tokens: 50\n        })\n    });\n\n    const data = await response.json();\n    console.log(data.choices[0].text.trim());\n}\n\n// Ejemplo de uso\ngenerateText(\"Había una vez en una tierra lejana,\");\n",
            language: 'javascript',
          },
          format: '',
          version: 2,
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'IoT: Conectando el mundo que nos rodea',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
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
              text: 'En el panorama tecnológico de rápida evolución actual, el Internet de las cosas (IoT) se destaca como una fuerza revolucionaria. Desde transformar nuestras residencias con sistemas de hogares inteligentes hasta redefinir el transporte a través de vehículos conectados, la influencia del IoT es palpable en casi todos los aspectos de nuestra vida diaria.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
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
              text: 'Esta tecnología se basa en la integración fluida de dispositivos y sistemas, permitiendo que se comuniquen y colaboren sin esfuerzo. Con cada dispositivo conectado, nos acercamos un paso más a un mundo donde la comodidad y la eficiencia están integradas en la propia esencia de nuestra existencia. Como resultado, estamos entrando en una era en la que nuestro entorno responde intuitivamente a nuestras necesidades, anunciando una comunidad global más inteligente e interconectada.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
        {
          type: 'block',
          fields: {
            blockName: '',
            blockType: 'mediaBlock',
            media: '{{IMAGE_2}}',
            position: 'default',
          },
          format: '',
          version: 2,
        },
        {
          type: 'block',
          fields: {
            blockName: 'Componentes Dinámicos',
            blockType: 'banner',
            content: {
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
                        text: 'El contenido anterior es completamente dinámico utilizando bloques de construcción personalizados configurados en el CMS. Esto puede ser lo que desees, desde texto enriquecido e imágenes, hasta componentes complejos y altamente diseñados.',
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
            style: 'info',
          },
          format: '',
          version: 2,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },

  meta: {
    description:
      'Sumérgete en las maravillas de la innovación moderna, donde la única constante es el cambio.',
    image: '{{IMAGE_1}}',
    title: 'Horizontes Digitales: Un Vistazo al Mañana',
  },
  relatedPosts: [], // this is populated by the seed script
  title: 'Horizontes Digitales: Un Vistazo al Mañana',
}
```

--------------------------------------------------------------------------------

````
