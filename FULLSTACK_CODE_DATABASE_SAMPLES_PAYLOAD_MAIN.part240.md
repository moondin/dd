---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 240
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 240 of 695)

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

---[FILE: sendEmail.ts]---
Location: payload-main/packages/plugin-form-builder/src/collections/FormSubmissions/hooks/sendEmail.ts

```typescript
import type { CollectionAfterChangeHook } from 'payload'

import type { Email, FormattedEmail, FormBuilderPluginConfig } from '../../../types.js'

import { serializeLexical } from '../../../utilities/lexical/serializeLexical.js'
import { replaceDoubleCurlys } from '../../../utilities/replaceDoubleCurlys.js'
import { serializeSlate } from '../../../utilities/slate/serializeSlate.js'

type AfterChangeParams = Parameters<CollectionAfterChangeHook>[0]

export const sendEmail = async (
  afterChangeParameters: AfterChangeParams,
  formConfig: FormBuilderPluginConfig,
) => {
  if (afterChangeParameters.operation === 'create') {
    const {
      data,
      doc: { id: formSubmissionID },
      req: { locale, payload },
      req,
    } = afterChangeParameters

    const { form: formID, submissionData: submissionDataFromProps } = data || {}
    const { beforeEmail, defaultToEmail, formOverrides } = formConfig || {}

    try {
      const form = await payload.findByID({
        id: formID,
        collection: formOverrides?.slug || 'forms',
        locale,
        req,
      })

      const emails = form.emails as Email[]

      const submissionData = [
        ...submissionDataFromProps,
        {
          field: 'formSubmissionID',
          value: String(formSubmissionID),
        },
      ]

      if (emails && emails.length) {
        const formattedEmails: FormattedEmail[] = await Promise.all(
          emails.map(async (email: Email): Promise<FormattedEmail> => {
            const {
              bcc: emailBCC,
              cc: emailCC,
              emailFrom,
              emailTo: emailToFromConfig,
              message,
              replyTo: emailReplyTo,
              subject,
            } = email

            const emailTo = emailToFromConfig || defaultToEmail || payload.email.defaultFromAddress

            const to = replaceDoubleCurlys(emailTo, submissionData)
            const cc = emailCC ? replaceDoubleCurlys(emailCC, submissionData) : ''
            const bcc = emailBCC ? replaceDoubleCurlys(emailBCC, submissionData) : ''
            const from = replaceDoubleCurlys(emailFrom, submissionData)
            const replyTo = replaceDoubleCurlys(emailReplyTo || emailFrom, submissionData)

            const isLexical = message && !Array.isArray(message) && 'root' in message

            const serializedMessage = isLexical
              ? await serializeLexical(message, submissionData)
              : serializeSlate(message, submissionData)

            return {
              bcc,
              cc,
              from,
              html: `<div>${serializedMessage}</div>`,
              replyTo,
              subject: replaceDoubleCurlys(subject, submissionData),
              to,
            }
          }),
        )

        let emailsToSend = formattedEmails

        if (typeof beforeEmail === 'function') {
          emailsToSend = await beforeEmail(formattedEmails, afterChangeParameters)
        }

        await Promise.all(
          emailsToSend.map(async (email) => {
            const { to } = email
            try {
              const emailPromise = await payload.sendEmail(email)
              return emailPromise
            } catch (err: unknown) {
              payload.logger.error({
                err,
                msg: `Error while sending email to address: ${to}. Email not sent.`,
              })
            }
          }),
        )
      } else {
        payload.logger.info({ msg: 'No emails to send.' })
      }
    } catch (err: unknown) {
      const msg = `Error while sending one or more emails in form submission id: ${formSubmissionID}.`
      payload.logger.error({ err, msg })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/plugin-form-builder/src/exports/client.ts

```typescript
export { DynamicFieldSelector } from '../collections/Forms/DynamicFieldSelector.js'
export { DynamicPriceSelector } from '../collections/Forms/DynamicPriceSelector.js'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-form-builder/src/exports/types.ts

```typescript
export type {
  BeforeEmail,
  BlockConfig,
  CheckboxField,
  CountryField,
  DateField,
  Email,
  EmailField,
  FieldConfig,
  FieldsConfig,
  FieldValues,
  Form,
  FormattedEmail,
  FormBuilderPluginConfig as PluginConfig,
  FormFieldBlock,
  FormSubmission,
  HandlePayment,
  isValidBlockConfig,
  MessageField,
  PaymentField,
  PaymentFieldConfig,
  PriceCondition,
  RadioField,
  Redirect,
  SelectField,
  SelectFieldOption,
  StateField,
  SubmissionValue,
  TextAreaField,
  TextField,
} from '../types.js'
```

--------------------------------------------------------------------------------

---[FILE: serverModule.js]---
Location: payload-main/packages/plugin-form-builder/src/mocks/serverModule.js

```javascript
export default {}
```

--------------------------------------------------------------------------------

---[FILE: getPaymentTotal.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/getPaymentTotal.ts

```typescript
import type { FieldValues, PaymentField, PriceCondition } from '../types.js'

export const getPaymentTotal = (
  args: {
    fieldValues: FieldValues
  } & Partial<PaymentField>,
): number => {
  const { basePrice = 0, fieldValues, priceConditions } = args

  let total = basePrice

  if (Array.isArray(priceConditions) && priceConditions.length > 0) {
    priceConditions.forEach((priceCondition: PriceCondition) => {
      const { condition, fieldToUse, operator, valueForCondition, valueForOperator, valueType } =
        priceCondition

      const valueOfField = fieldValues?.[fieldToUse]

      if (valueOfField) {
        if (
          condition === 'hasValue' ||
          (condition === 'equals' && valueOfField === valueForCondition) ||
          (condition === 'notEquals' && valueOfField !== valueForCondition)
        ) {
          const valueToUse = Number(valueType === 'valueOfField' ? valueOfField : valueForOperator)
          switch (operator) {
            case 'add': {
              total += valueToUse
              break
            }
            case 'divide': {
              total /= valueToUse
              break
            }
            case 'multiply': {
              total *= valueToUse
              break
            }
            case 'subtract': {
              total -= valueToUse
              break
            }
            default: {
              break
            }
          }
        }
      }
    })
  }

  return total
}
```

--------------------------------------------------------------------------------

---[FILE: keyValuePairToHtmlTable.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/keyValuePairToHtmlTable.ts

```typescript
export function keyValuePairToHtmlTable(obj: { [key: string]: string }): string {
  let htmlTable = '<table>'

  for (const [key, value] of Object.entries(obj)) {
    htmlTable += `<tr><td>${key}</td><td>${value}</td></tr>`
  }

  htmlTable += '</table>'
  return htmlTable
}
```

--------------------------------------------------------------------------------

---[FILE: replaceDoubleCurlys.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/replaceDoubleCurlys.ts

```typescript
import { keyValuePairToHtmlTable } from './keyValuePairToHtmlTable.js'

interface EmailVariable {
  field: string
  value: string
}

type EmailVariables = EmailVariable[]

export const replaceDoubleCurlys = (str: string, variables?: EmailVariables): string => {
  const regex = /\{\{(.+?)\}\}/g
  if (str && variables) {
    return str.replace(regex, (_, variable: string) => {
      if (variable.includes('*')) {
        if (variable === '*') {
          return variables.map(({ field, value }) => `${field} : ${value}`).join(' <br /> ')
        } else if (variable === '*:table') {
          return keyValuePairToHtmlTable(
            variables.reduce<Record<string, string>>((acc, { field, value }) => {
              acc[field] = value
              return acc
            }, {}),
          )
        }
      } else {
        const foundVariable = variables.find(({ field: fieldName }) => {
          return variable === fieldName
        })
        if (foundVariable) {
          return foundVariable.value
        }
      }

      return variable
    })
  }
  return str
}
```

--------------------------------------------------------------------------------

---[FILE: defaultConverters.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/defaultConverters.ts

```typescript
import type { HTMLConverter } from './types.js'

import { HeadingHTMLConverter } from './converters/heading.js'
import { LinebreakHTMLConverter } from './converters/linebreak.js'
import { LinkHTMLConverter } from './converters/link.js'
import { ListHTMLConverter, ListItemHTMLConverter } from './converters/list.js'
import { ParagraphHTMLConverter } from './converters/paragraph.js'
import { QuoteHTMLConverter } from './converters/quote.js'
import { TextHTMLConverter } from './converters/text.js'

export const defaultHTMLConverters: HTMLConverter[] = [
  ParagraphHTMLConverter,
  TextHTMLConverter,
  LinebreakHTMLConverter,
  LinkHTMLConverter,
  HeadingHTMLConverter,
  QuoteHTMLConverter,
  ListHTMLConverter,
  ListItemHTMLConverter,
]
```

--------------------------------------------------------------------------------

---[FILE: nodeFormat.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/nodeFormat.ts

```typescript
/* eslint-disable perfectionist/sort-objects */
/* eslint-disable regexp/no-obscure-range */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
//This copy-and-pasted from lexical here: https://github.com/facebook/lexical/blob/c2ceee223f46543d12c574e62155e619f9a18a5d/packages/lexical/src/LexicalConstants.ts

// DOM
export const NodeFormat = {
  DOM_ELEMENT_TYPE: 1,
  DOM_TEXT_TYPE: 3,
  // Reconciling
  NO_DIRTY_NODES: 0,
  HAS_DIRTY_NODES: 1,
  FULL_RECONCILE: 2,
  // Text node modes
  IS_NORMAL: 0,
  IS_TOKEN: 1,
  IS_SEGMENTED: 2,
  IS_INERT: 3,
  // Text node formatting
  IS_BOLD: 1,
  IS_ITALIC: 1 << 1,
  IS_STRIKETHROUGH: 1 << 2,
  IS_UNDERLINE: 1 << 3,
  IS_CODE: 1 << 4,
  IS_SUBSCRIPT: 1 << 5,
  IS_SUPERSCRIPT: 1 << 6,
  IS_HIGHLIGHT: 1 << 7,
  // Text node details
  IS_DIRECTIONLESS: 1,
  IS_UNMERGEABLE: 1 << 1,
  // Element node formatting
  IS_ALIGN_LEFT: 1,
  IS_ALIGN_CENTER: 2,
  IS_ALIGN_RIGHT: 3,
  IS_ALIGN_JUSTIFY: 4,
  IS_ALIGN_START: 5,
  IS_ALIGN_END: 6,
} as const

export const IS_ALL_FORMATTING =
  NodeFormat.IS_BOLD |
  NodeFormat.IS_ITALIC |
  NodeFormat.IS_STRIKETHROUGH |
  NodeFormat.IS_UNDERLINE |
  NodeFormat.IS_CODE |
  NodeFormat.IS_SUBSCRIPT |
  NodeFormat.IS_SUPERSCRIPT |
  NodeFormat.IS_HIGHLIGHT

// Reconciliation
export const NON_BREAKING_SPACE = '\u00A0'

export const DOUBLE_LINE_BREAK = '\n\n'

// For FF, we need to use a non-breaking space, or it gets composition
// in a stuck state.

const RTL = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC'
const LTR =
  'A-Za-z\u00C0-\u00D6\u00D8-\u00F6' +
  '\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C' +
  '\uFE00-\uFE6F\uFEFD-\uFFFF'

// eslint-disable-next-line no-misleading-character-class,regexp/no-misleading-unicode-character
export const RTL_REGEX = new RegExp('^[^' + LTR + ']*[' + RTL + ']')
// eslint-disable-next-line no-misleading-character-class,regexp/no-misleading-unicode-character
export const LTR_REGEX = new RegExp('^[^' + RTL + ']*[' + LTR + ']')

export const TEXT_TYPE_TO_FORMAT: Record<any | string, number> = {
  bold: NodeFormat.IS_BOLD,
  code: NodeFormat.IS_CODE,
  highlight: NodeFormat.IS_HIGHLIGHT,
  italic: NodeFormat.IS_ITALIC,
  strikethrough: NodeFormat.IS_STRIKETHROUGH,
  subscript: NodeFormat.IS_SUBSCRIPT,
  superscript: NodeFormat.IS_SUPERSCRIPT,
  underline: NodeFormat.IS_UNDERLINE,
}

export const DETAIL_TYPE_TO_DETAIL: Record<any | string, number> = {
  directionless: NodeFormat.IS_DIRECTIONLESS,
  unmergeable: NodeFormat.IS_UNMERGEABLE,
}

export const ELEMENT_TYPE_TO_FORMAT: Record<Exclude<any, ''>, number> = {
  center: NodeFormat.IS_ALIGN_CENTER,
  end: NodeFormat.IS_ALIGN_END,
  justify: NodeFormat.IS_ALIGN_JUSTIFY,
  left: NodeFormat.IS_ALIGN_LEFT,
  right: NodeFormat.IS_ALIGN_RIGHT,
  start: NodeFormat.IS_ALIGN_START,
}

export const ELEMENT_FORMAT_TO_TYPE: Record<number, any> = {
  [NodeFormat.IS_ALIGN_CENTER]: 'center',
  [NodeFormat.IS_ALIGN_END]: 'end',
  [NodeFormat.IS_ALIGN_JUSTIFY]: 'justify',
  [NodeFormat.IS_ALIGN_LEFT]: 'left',
  [NodeFormat.IS_ALIGN_RIGHT]: 'right',
  [NodeFormat.IS_ALIGN_START]: 'start',
}

export const TEXT_MODE_TO_TYPE: Record<any, 0 | 1 | 2> = {
  normal: NodeFormat.IS_NORMAL,
  segmented: NodeFormat.IS_SEGMENTED,
  token: NodeFormat.IS_TOKEN,
}

export const TEXT_TYPE_TO_MODE: Record<number, any> = {
  [NodeFormat.IS_NORMAL]: 'normal',
  [NodeFormat.IS_SEGMENTED]: 'segmented',
  [NodeFormat.IS_TOKEN]: 'token',
}
```

--------------------------------------------------------------------------------

---[FILE: serializeLexical.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/serializeLexical.ts

```typescript
import type { HTMLConverter, SerializedLexicalNodeWithParent } from './types.js'

import { defaultHTMLConverters } from './defaultConverters.js'

export async function serializeLexical(data?: any, submissionData?: any): Promise<string> {
  const converters: HTMLConverter[] = defaultHTMLConverters

  if (data?.root?.children?.length) {
    return await convertLexicalNodesToHTML({
      converters,
      lexicalNodes: data?.root?.children,
      parent: data?.root,
      submissionData,
    })
  }
  return ''
}

export async function convertLexicalNodesToHTML({
  converters,
  lexicalNodes,
  parent,
  submissionData,
}: {
  converters: HTMLConverter[]
  lexicalNodes: any[]
  parent: SerializedLexicalNodeWithParent
  submissionData?: any
}): Promise<string> {
  const unknownConverter = converters.find((converter) => converter.nodeTypes.includes('unknown'))

  const htmlArray = await Promise.all(
    lexicalNodes.map(async (node, i) => {
      const converterForNode = converters.find((converter) =>
        converter.nodeTypes.includes(node.type),
      )
      if (!converterForNode) {
        if (unknownConverter) {
          return unknownConverter.converter({
            childIndex: i,
            converters,
            node,
            parent,
            submissionData,
          })
        }
        return '<span>unknown node</span>'
      }

      return converterForNode.converter({
        childIndex: i,
        converters,
        node,
        parent,
        submissionData,
      })
    }),
  )

  return htmlArray.join('') || ''
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/types.ts

```typescript
export type HTMLConverter<T = any> = {
  converter: ({
    childIndex,
    converters,
    node,
    parent,
    submissionData,
  }: {
    childIndex: number
    converters: HTMLConverter[]
    node: T
    parent: SerializedLexicalNodeWithParent
    submissionData?: any
  }) => Promise<string> | string
  nodeTypes: string[]
}

export type SerializedLexicalNodeWithParent = {
  parent?: any
} & any
```

--------------------------------------------------------------------------------

---[FILE: heading.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/converters/heading.ts

```typescript
import type { HTMLConverter } from '../types.js'

import { convertLexicalNodesToHTML } from '../serializeLexical.js'

export const HeadingHTMLConverter: HTMLConverter<any> = {
  async converter({ converters, node, parent, submissionData }) {
    const childrenText = await convertLexicalNodesToHTML({
      converters,
      lexicalNodes: node.children,
      parent: {
        ...node,
        parent,
      },
      submissionData,
    })
    const style = [
      node.format ? `text-align: ${node.format};` : '',
      node.indent > 0 ? `padding-inline-start: ${node.indent * 40}px;` : '',
    ]
      .filter(Boolean)
      .join(' ')
    return `<${node?.tag}${style ? ` style='${style}'` : ''}>${childrenText}</${node?.tag}>`
  },
  nodeTypes: ['heading'],
}
```

--------------------------------------------------------------------------------

---[FILE: linebreak.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/converters/linebreak.ts

```typescript
import type { HTMLConverter } from '../types.js'

export const LinebreakHTMLConverter: HTMLConverter<any> = {
  converter() {
    return `<br>`
  },
  nodeTypes: ['linebreak'],
}
```

--------------------------------------------------------------------------------

---[FILE: link.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/converters/link.ts

```typescript
import type { HTMLConverter } from '../types.js'

import { replaceDoubleCurlys } from '../../replaceDoubleCurlys.js'
import { convertLexicalNodesToHTML } from '../serializeLexical.js'

export const LinkHTMLConverter: HTMLConverter<any> = {
  async converter({ converters, node, parent, submissionData }) {
    const childrenText = await convertLexicalNodesToHTML({
      converters,
      lexicalNodes: node.children,
      parent: {
        ...node,
        parent,
      },
      submissionData,
    })

    let href: string =
      node.fields.linkType === 'custom' ? node.fields.url : node.fields.doc?.value?.id

    if (submissionData) {
      href = replaceDoubleCurlys(href, submissionData)
    }
    return `<a href="${href}"${node.fields.newTab ? ' rel="noopener noreferrer" target="_blank"' : ''}>${childrenText}</a>`
  },
  nodeTypes: ['link'],
}
```

--------------------------------------------------------------------------------

---[FILE: list.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/converters/list.ts

```typescript
import type { HTMLConverter } from '../types.js'

import { convertLexicalNodesToHTML } from '../serializeLexical.js'

export const ListHTMLConverter: HTMLConverter<any> = {
  converter: async ({ converters, node, parent, submissionData }) => {
    const childrenText = await convertLexicalNodesToHTML({
      converters,
      lexicalNodes: node.children,
      parent: {
        ...node,
        parent,
      },
      submissionData,
    })

    return `<${node?.tag} class="${node?.listType}">${childrenText}</${node?.tag}>`
  },
  nodeTypes: ['list'],
}

export const ListItemHTMLConverter: HTMLConverter<any> = {
  converter: async ({ converters, node, parent }) => {
    const childrenText = await convertLexicalNodesToHTML({
      converters,
      lexicalNodes: node.children,
      parent: {
        ...node,
        parent,
      },
    })

    if ('listType' in parent && parent?.listType === 'check') {
      return `<li aria-checked=${node.checked ? 'true' : 'false'} class="${
        'list-item-checkbox' + node.checked
          ? 'list-item-checkbox-checked'
          : 'list-item-checkbox-unchecked'
      }"
          role="checkbox"
          tabIndex=${-1}
          value=${node?.value}
      >
          ${childrenText}
          </li>`
    } else {
      return `<li value=${node?.value}>${childrenText}</li>`
    }
  },
  nodeTypes: ['listitem'],
}
```

--------------------------------------------------------------------------------

---[FILE: paragraph.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/converters/paragraph.ts

```typescript
import type { HTMLConverter } from '../types.js'

import { convertLexicalNodesToHTML } from '../serializeLexical.js'

export const ParagraphHTMLConverter: HTMLConverter<any> = {
  async converter({ converters, node, parent, submissionData }) {
    const childrenText = await convertLexicalNodesToHTML({
      converters,
      lexicalNodes: node.children,
      parent: {
        ...node,
        parent,
      },
      submissionData,
    })
    return `<p>${childrenText}</p>`
  },
  nodeTypes: ['paragraph'],
}
```

--------------------------------------------------------------------------------

---[FILE: quote.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/converters/quote.ts

```typescript
import type { HTMLConverter } from '../types.js'

import { convertLexicalNodesToHTML } from '../serializeLexical.js'

export const QuoteHTMLConverter: HTMLConverter<any> = {
  async converter({ converters, node, parent, submissionData }) {
    const childrenText = await convertLexicalNodesToHTML({
      converters,
      lexicalNodes: node.children,
      parent: {
        ...node,
        parent,
      },
      submissionData,
    })
    const style = [
      node.format ? `text-align: ${node.format};` : '',
      node.indent > 0 ? `padding-inline-start: ${node.indent * 40}px;` : '',
    ]
      .filter(Boolean)
      .join(' ')

    return `<blockquote${style ? ` style='${style}'` : ''}>${childrenText}</blockquote>`
  },
  nodeTypes: ['quote'],
}
```

--------------------------------------------------------------------------------

---[FILE: text.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/lexical/converters/text.ts

```typescript
import type { HTMLConverter } from '../types.js'

import { replaceDoubleCurlys } from '../../replaceDoubleCurlys.js'
import { NodeFormat } from '../nodeFormat.js'

export const TextHTMLConverter: HTMLConverter<any> = {
  converter({ node, submissionData }) {
    let text = node.text

    if (submissionData) {
      text = replaceDoubleCurlys(text, submissionData)
    }

    if (node.format & NodeFormat.IS_BOLD) {
      text = `<strong>${text}</strong>`
    }
    if (node.format & NodeFormat.IS_ITALIC) {
      text = `<em>${text}</em>`
    }
    if (node.format & NodeFormat.IS_STRIKETHROUGH) {
      text = `<span style="text-decoration: line-through">${text}</span>`
    }
    if (node.format & NodeFormat.IS_UNDERLINE) {
      text = `<span style="text-decoration: underline">${text}</span>`
    }
    if (node.format & NodeFormat.IS_CODE) {
      text = `<code>${text}</code>`
    }
    if (node.format & NodeFormat.IS_SUBSCRIPT) {
      text = `<sub>${text}</sub>`
    }
    if (node.format & NodeFormat.IS_SUPERSCRIPT) {
      text = `<sup>${text}</sup>`
    }

    return text
  },
  nodeTypes: ['text'],
}
```

--------------------------------------------------------------------------------

---[FILE: serializeSlate.ts]---
Location: payload-main/packages/plugin-form-builder/src/utilities/slate/serializeSlate.ts

```typescript
import escapeHTML from 'escape-html'

import { replaceDoubleCurlys } from '../replaceDoubleCurlys.js'

interface Node {
  bold?: boolean
  children?: Node[]
  code?: boolean
  italic?: boolean
  text?: string
  type?: string
  url?: string
}

const isTextNode = (node: Node): node is { text: string } & Node => {
  return 'text' in node
}

export const serializeSlate = (children?: Node[], submissionData?: any): string | undefined =>
  children
    ?.map((node: Node) => {
      if (isTextNode(node)) {
        let text = node.text.includes('{{*')
          ? replaceDoubleCurlys(node.text, submissionData)
          : `<span>${escapeHTML(replaceDoubleCurlys(node.text, submissionData))}</span>`

        if (node.bold) {
          text = `
        <strong>
          ${text}
        </strong>
      `
        }

        if (node.code) {
          text = `
        <code>
          ${text}
        </code>
      `
        }

        if (node.italic) {
          text = `
        <em >
          ${text}
        </em>
      `
        }

        return text
      }

      if (!node) {
        return null
      }

      switch (node.type) {
        case 'h1':
          return `
        <h1>
          ${serializeSlate(node.children, submissionData)}
        </h1>
      `
        case 'h2':
          return `
        <h2>
          ${serializeSlate(node.children, submissionData)}
        </h2>
      `
        case 'h3':
          return `
        <h3>
          ${serializeSlate(node.children, submissionData)}
        </h3>
      `
        case 'h4':
          return `
        <h4>
          ${serializeSlate(node.children, submissionData)}
        </h4>
      `
        case 'h5':
          return `
        <h5>
          ${serializeSlate(node.children, submissionData)}
        </h5>
      `
        case 'h6':
          return `
        <h6>
          ${serializeSlate(node.children, submissionData)}
        </h6>
      `
        case 'indent':
          return `
          <p style="padding-left: 20px">
            ${serializeSlate(node.children, submissionData)}
          </p>
        `
        case 'li':
          return `
        <li>
          ${serializeSlate(node.children, submissionData)}
        </li>
      `
        case 'link':
          return `
          <a href={${escapeHTML(replaceDoubleCurlys(node.url!, submissionData))}}>
          ${serializeSlate(node.children, submissionData)}
        </a>
      `
        case 'ol':
          return `
        <ol>
          ${serializeSlate(node.children, submissionData)}
        </ol>
      `
        case 'quote':
          return `
        <blockquote>
          ${serializeSlate(node.children, submissionData)}
        </blockquote>
      `
        case 'ul':
          return `
        <ul>
          ${serializeSlate(node.children, submissionData)}
        </ul>
      `

        default:
          return `
        <p>
          ${serializeSlate(node.children, submissionData)}
        </p>
      `
      }
    })
    .filter(Boolean)
    .join('')
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-import-export/.gitignore

```text
node_modules
.env
dist
demo/uploads
build
.DS_Store
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/plugin-import-export/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
**/docs/**
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/plugin-import-export/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: license.md]---
Location: payload-main/packages/plugin-import-export/license.md

```text
MIT License

Copyright (c) 2018-2024 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/plugin-import-export/package.json
Signals: React, Next.js

```json
{
  "name": "@payloadcms/plugin-import-export",
  "version": "3.68.5",
  "description": "Import-Export plugin for Payload",
  "keywords": [
    "payload",
    "cms",
    "plugin",
    "typescript",
    "react",
    "nextjs",
    "import",
    "export"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-import-export"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./types": {
      "import": "./src/exports/types.ts",
      "types": "./src/exports/types.ts",
      "default": "./src/exports/types.ts"
    },
    "./rsc": {
      "import": "./src/exports/rsc.ts",
      "types": "./src/exports/rsc.ts",
      "default": "./src/exports/rsc.ts"
    },
    "./translations/languages/all": {
      "import": "./src/translations/index.ts",
      "types": "./src/translations/index.ts",
      "default": "./src/translations/index.ts"
    },
    "./translations/languages/*": {
      "import": "./src/translations/languages/*.ts",
      "types": "./src/translations/languages/*.ts",
      "default": "./src/translations/languages/*.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@faceless-ui/modal": "3.0.0",
    "@payloadcms/translations": "workspace:*",
    "@payloadcms/ui": "workspace:*",
    "csv-parse": "^5.6.0",
    "csv-stringify": "^6.5.2",
    "qs-esm": "7.0.2"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@payloadcms/ui": "workspace:*",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "@payloadcms/ui": "workspace:*",
    "payload": "workspace:*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./types": {
        "import": "./dist/exports/types.js",
        "types": "./dist/exports/types.d.ts",
        "default": "./dist/exports/types.js"
      },
      "./rsc": {
        "import": "./dist/exports/rsc.js",
        "types": "./dist/exports/rsc.d.ts",
        "default": "./dist/exports/rsc.js"
      },
      "./translations/languages/all": {
        "import": "./dist/translations/index.js",
        "types": "./dist/translations/index.d.ts",
        "default": "./dist/translations/index.js"
      },
      "./translations/languages/*": {
        "import": "./dist/translations/languages/*.js",
        "types": "./dist/translations/languages/*.d.ts",
        "default": "./dist/translations/languages/*.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  },
  "homepage:": "https://payloadcms.com"
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/plugin-import-export/README.md

```text
# Payload Import/Export Plugin

A plugin for [Payload](https://github.com/payloadcms/payload) to easily import and export data.

- [Source code](https://github.com/payloadcms/payload/tree/main/packages/plugin-import-export)
- [Documentation](https://payloadcms.com/docs/plugins/import-export)
- [Documentation source](https://github.com/payloadcms/payload/tree/main/docs/plugins/import-export.mdx)
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-import-export/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true, // Make sure typescript knows that this module depends on their references
    "noEmit": false /* Do not emit outputs. */,
    "emitDeclarationOnly": true,
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    "rootDir": "./src" /* Specify the root folder within your source files. */
  },
  "exclude": [
    "dist",
    "build",
    "tests",
    "test",
    "node_modules",
    "eslint.config.js",
    "src/**/*.spec.js",
    "src/**/*.spec.jsx",
    "src/**/*.spec.ts",
    "src/**/*.spec.tsx"
  ],

  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/**/*.ts", "src/**/**/*.tsx", "src/**/*.d.ts", "src/**/*.json", ],
  "references": [{ "path": "../payload" },  { "path": "../ui"}]
}
```

--------------------------------------------------------------------------------

---[FILE: getExportCollection.ts]---
Location: payload-main/packages/plugin-import-export/src/getExportCollection.ts

```typescript
import type {
  CollectionAfterChangeHook,
  CollectionBeforeOperationHook,
  CollectionConfig,
  Config,
} from 'payload'

import type { CollectionOverride, ImportExportPluginConfig } from './types.js'

import { createExport } from './export/createExport.js'
import { download } from './export/download.js'
import { getFields } from './export/getFields.js'

export const getExportCollection = ({
  config,
  pluginConfig,
}: {
  config: Config
  pluginConfig: ImportExportPluginConfig
}): CollectionConfig => {
  const { overrideExportCollection } = pluginConfig

  const beforeOperation: CollectionBeforeOperationHook[] = []
  const afterChange: CollectionAfterChangeHook[] = []

  let collection: CollectionOverride = {
    slug: 'exports',
    access: {
      update: () => false,
    },
    admin: {
      components: {
        edit: {
          SaveButton: '@payloadcms/plugin-import-export/rsc#ExportSaveButton',
        },
      },
      custom: {
        disableDownload: pluginConfig.disableDownload ?? false,
        disableSave: pluginConfig.disableSave ?? false,
      },
      group: false,
      useAsTitle: 'name',
    },
    disableDuplicate: true,
    endpoints: [
      {
        handler: (req) => {
          return download(req, pluginConfig.debug)
        },
        method: 'post',
        path: '/download',
      },
    ],
    fields: getFields(config, pluginConfig),
    hooks: {
      afterChange,
      beforeOperation,
    },
    upload: {
      filesRequiredOnCreate: false,
      hideFileInputOnCreate: true,
      hideRemoveFile: true,
    },
  }

  if (typeof overrideExportCollection === 'function') {
    collection = overrideExportCollection(collection)
  }

  if (pluginConfig.disableJobsQueue) {
    beforeOperation.push(async ({ args, operation, req }) => {
      if (operation !== 'create') {
        return
      }
      const { user } = req
      const debug = pluginConfig.debug
      await createExport({ input: { ...args.data, debug } as any, req, user })
    })
  } else {
    afterChange.push(async ({ doc, operation, req }) => {
      if (operation !== 'create') {
        return
      }

      const input = {
        ...doc,
        exportsCollection: collection.slug,
        user: req?.user?.id || req?.user?.user?.id,
        userCollection: req.payload.config.admin.user,
      }
      await req.payload.jobs.queue({
        input,
        task: 'createCollectionExport',
      })
    })
  }

  return collection
}
```

--------------------------------------------------------------------------------

````
