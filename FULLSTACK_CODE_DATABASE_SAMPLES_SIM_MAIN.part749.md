---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 749
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 749 of 933)

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

---[FILE: create_page.ts]---
Location: sim-main/apps/sim/tools/sharepoint/create_page.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  SharepointCreatePageResponse,
  SharepointPage,
  SharepointToolParams,
} from '@/tools/sharepoint/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SharePointCreatePage')

export const createPageTool: ToolConfig<SharepointToolParams, SharepointCreatePageResponse> = {
  id: 'sharepoint_create_page',
  name: 'Create SharePoint Page',
  description: 'Create a new page in a SharePoint site',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'sharepoint',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the SharePoint API',
    },
    siteId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the SharePoint site (internal use)',
    },
    siteSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the SharePoint site',
    },
    pageName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The name of the page to create',
    },
    pageTitle: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The title of the page (defaults to page name if not provided)',
    },
    pageContent: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The content of the page',
    },
  },

  request: {
    url: (params) => {
      // Use specific site if provided, otherwise use root site
      const siteId = params.siteSelector || params.siteId || 'root'
      return `https://graph.microsoft.com/v1.0/sites/${siteId}/pages`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: (params) => {
      if (!params.pageName) {
        throw new Error('Page name is required')
      }

      const pageTitle = params.pageTitle || params.pageName

      // Basic page structure required by Microsoft Graph API
      const pageData: SharepointPage = {
        '@odata.type': '#microsoft.graph.sitePage',
        name: params.pageName,
        title: pageTitle,
        publishingState: {
          level: 'draft',
        },
        pageLayout: 'article',
      }

      // Add content if provided using the simple innerHtml approach from the documentation
      if (params.pageContent) {
        pageData.canvasLayout = {
          horizontalSections: [
            {
              layout: 'oneColumn',
              id: '1',
              emphasis: 'none',
              columns: [
                {
                  id: '1',
                  width: 12,
                  webparts: [
                    {
                      id: '6f9230af-2a98-4952-b205-9ede4f9ef548',
                      innerHtml: `<p>${params.pageContent.replace(/"/g, '&quot;').replace(/'/g, '&#39;')}</p>`,
                    },
                  ],
                },
              ],
            },
          ],
        }
      }

      return pageData
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    logger.info('SharePoint page created successfully', {
      pageId: data.id,
      pageName: data.name,
      pageTitle: data.title,
    })

    return {
      success: true,
      output: {
        page: {
          id: data.id,
          name: data.name,
          title: data.title || data.name,
          webUrl: data.webUrl,
          pageLayout: data.pageLayout,
          createdDateTime: data.createdDateTime,
          lastModifiedDateTime: data.lastModifiedDateTime,
        },
      },
    }
  },

  outputs: {
    page: {
      type: 'object',
      description: 'Created SharePoint page information',
      properties: {
        id: { type: 'string', description: 'The unique ID of the created page' },
        name: { type: 'string', description: 'The name of the created page' },
        title: { type: 'string', description: 'The title of the created page' },
        webUrl: { type: 'string', description: 'The URL to access the page' },
        pageLayout: { type: 'string', description: 'The layout type of the page' },
        createdDateTime: { type: 'string', description: 'When the page was created' },
        lastModifiedDateTime: { type: 'string', description: 'When the page was last modified' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_list.ts]---
Location: sim-main/apps/sim/tools/sharepoint/get_list.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  SharepointGetListResponse,
  SharepointList,
  SharepointToolParams,
} from '@/tools/sharepoint/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SharePointGetList')

export const getListTool: ToolConfig<SharepointToolParams, SharepointGetListResponse> = {
  id: 'sharepoint_get_list',
  name: 'Get SharePoint List',
  description: 'Get metadata (and optionally columns/items) for a SharePoint list',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'sharepoint',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the SharePoint API',
    },
    siteSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the SharePoint site',
    },
    siteId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the SharePoint site (internal use)',
    },
    listId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the list to retrieve',
    },
  },

  request: {
    url: (params) => {
      const siteId = params.siteId || params.siteSelector || 'root'

      // If neither listId nor listTitle provided, list all lists in the site
      if (!params.listId) {
        const baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists`
        const url = new URL(baseUrl)
        const finalUrl = url.toString()
        logger.info('SharePoint List All Lists URL', { finalUrl, siteId })
        return finalUrl
      }

      const listSegment = params.listId
      // Default to returning items when targeting a specific list unless explicitly disabled
      const wantsItems = typeof params.includeItems === 'boolean' ? params.includeItems : true

      // If caller wants items for a specific list, prefer the items endpoint (no columns)
      if (wantsItems && !params.includeColumns) {
        const itemsUrl = new URL(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listSegment}/items`
        )
        itemsUrl.searchParams.set('$expand', 'fields')
        const finalItemsUrl = itemsUrl.toString()
        logger.info('SharePoint Get List Items URL', {
          finalUrl: finalItemsUrl,
          siteId,
          listId: params.listId,
        })
        return finalItemsUrl
      }

      // Otherwise, fetch list metadata (optionally with columns/items via $expand)
      const baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listSegment}`
      const url = new URL(baseUrl)
      const expandParts: string[] = []
      if (params.includeColumns) expandParts.push('columns')
      if (wantsItems) expandParts.push('items($expand=fields)')
      if (expandParts.length > 0) url.searchParams.append('$expand', expandParts.join(','))

      const finalUrl = url.toString()
      logger.info('SharePoint Get List URL', {
        finalUrl,
        siteId,
        listId: params.listId,
        includeColumns: !!params.includeColumns,
        includeItems: wantsItems,
      })
      return finalUrl
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      Accept: 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // If the response is a collection of items (from the items endpoint)
    if (
      Array.isArray((data as any).value) &&
      (data as any).value.length > 0 &&
      (data as any).value[0] &&
      'fields' in (data as any).value[0]
    ) {
      const items = (data as any).value.map((i: any) => ({
        id: i.id,
        fields: i.fields as Record<string, unknown>,
      }))

      const nextLink: string | undefined = (data as any)['@odata.nextLink']
      const nextPageToken = nextLink
        ? (() => {
            try {
              const u = new URL(nextLink)
              return u.searchParams.get('$skiptoken') || u.searchParams.get('$skip') || undefined
            } catch {
              return undefined
            }
          })()
        : undefined

      return {
        success: true,
        output: { list: { items } as SharepointList, nextPageToken },
      }
    }

    // If this is a collection of lists (site-level)
    if (Array.isArray((data as any).value)) {
      const lists: SharepointList[] = (data as any).value.map((l: any) => ({
        id: l.id,
        displayName: l.displayName ?? l.name,
        name: l.name,
        webUrl: l.webUrl,
        createdDateTime: l.createdDateTime,
        lastModifiedDateTime: l.lastModifiedDateTime,
        list: l.list,
      }))

      const nextLink: string | undefined = (data as any)['@odata.nextLink']
      const nextPageToken = nextLink
        ? (() => {
            try {
              const u = new URL(nextLink)
              return u.searchParams.get('$skiptoken') || u.searchParams.get('$skip') || undefined
            } catch {
              return undefined
            }
          })()
        : undefined

      return {
        success: true,
        output: { lists, nextPageToken },
      }
    }

    // Single list response (with optional expands)
    const list: SharepointList = {
      id: data.id,
      displayName: data.displayName ?? data.name,
      name: data.name,
      webUrl: data.webUrl,
      createdDateTime: data.createdDateTime,
      lastModifiedDateTime: data.lastModifiedDateTime,
      list: data.list,
      columns: Array.isArray(data.columns)
        ? data.columns.map((c: any) => ({
            id: c.id,
            name: c.name,
            displayName: c.displayName,
            description: c.description,
            indexed: c.indexed,
            enforcedUniqueValues: c.enforcedUniqueValues,
            hidden: c.hidden,
            readOnly: c.readOnly,
            required: c.required,
            columnGroup: c.columnGroup,
          }))
        : undefined,
      items: Array.isArray(data.items)
        ? data.items.map((i: any) => ({ id: i.id, fields: i.fields as Record<string, unknown> }))
        : undefined,
    }

    return {
      success: true,
      output: { list },
    }
  },

  outputs: {
    list: {
      type: 'object',
      description: 'Information about the SharePoint list',
      properties: {
        id: { type: 'string', description: 'The unique ID of the list' },
        displayName: { type: 'string', description: 'The display name of the list' },
        name: { type: 'string', description: 'The internal name of the list' },
        webUrl: { type: 'string', description: 'The web URL of the list' },
        createdDateTime: { type: 'string', description: 'When the list was created' },
        lastModifiedDateTime: {
          type: 'string',
          description: 'When the list was last modified',
        },
        list: { type: 'object', description: 'List properties (e.g., template)' },
        columns: {
          type: 'array',
          description: 'List column definitions',
          items: { type: 'object' },
        },
        items: {
          type: 'array',
          description: 'List items (with fields when expanded)',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Item ID' },
              fields: { type: 'object', description: 'Field values for the item' },
            },
          },
        },
      },
    },
    lists: {
      type: 'array',
      description: 'All lists in the site when no listId/title provided',
      items: { type: 'object' },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/sharepoint/index.ts

```typescript
import { addListItemTool } from '@/tools/sharepoint/add_list_items'
import { createListTool } from '@/tools/sharepoint/create_list'
import { createPageTool } from '@/tools/sharepoint/create_page'
import { getListTool } from '@/tools/sharepoint/get_list'
import { listSitesTool } from '@/tools/sharepoint/list_sites'
import { readPageTool } from '@/tools/sharepoint/read_page'
import { updateListItemTool } from '@/tools/sharepoint/update_list'
import { uploadFileTool } from '@/tools/sharepoint/upload_file'

export const sharepointCreatePageTool = createPageTool
export const sharepointCreateListTool = createListTool
export const sharepointGetListTool = getListTool
export const sharepointListSitesTool = listSitesTool
export const sharepointReadPageTool = readPageTool
export const sharepointUpdateListItemTool = updateListItemTool
export const sharepointAddListItemTool = addListItemTool
export const sharepointUploadFileTool = uploadFileTool
```

--------------------------------------------------------------------------------

---[FILE: list_sites.ts]---
Location: sim-main/apps/sim/tools/sharepoint/list_sites.ts

```typescript
import type {
  SharepointReadSiteResponse,
  SharepointSite,
  SharepointToolParams,
} from '@/tools/sharepoint/types'
import type { ToolConfig } from '@/tools/types'

export const listSitesTool: ToolConfig<SharepointToolParams, SharepointReadSiteResponse> = {
  id: 'sharepoint_list_sites',
  name: 'List SharePoint Sites',
  description: 'List details of all SharePoint sites',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'sharepoint',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the SharePoint API',
    },
    siteSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the SharePoint site',
    },
    groupId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The group ID for accessing a group team site',
    },
  },

  request: {
    url: (params) => {
      let baseUrl: string

      if (params.groupId) {
        // Access group team site
        baseUrl = `https://graph.microsoft.com/v1.0/groups/${params.groupId}/sites/root`
      } else if (params.siteId || params.siteSelector) {
        // Access specific site by ID
        const siteId = params.siteId || params.siteSelector
        baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}`
      } else {
        // get all sites
        baseUrl = 'https://graph.microsoft.com/v1.0/sites?search=*'
      }

      const url = new URL(baseUrl)

      // Use Microsoft Graph $select parameter to get site details
      url.searchParams.append(
        '$select',
        'id,name,displayName,webUrl,description,createdDateTime,lastModifiedDateTime,isPersonalSite,root,siteCollection'
      )

      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      Accept: 'application/json',
    }),
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    // Check if this is a search result (multiple sites) or single site
    if (data.value && Array.isArray(data.value)) {
      // Multiple sites from search
      return {
        success: true,
        output: {
          sites: data.value.map((site: SharepointSite) => ({
            id: site.id,
            name: site.name,
            displayName: site.displayName,
            webUrl: site.webUrl,
            description: site.description,
            createdDateTime: site.createdDateTime,
            lastModifiedDateTime: site.lastModifiedDateTime,
          })),
        },
      }
    }
    // Single site response
    return {
      success: true,
      output: {
        site: {
          id: data.id,
          name: data.name,
          displayName: data.displayName,
          webUrl: data.webUrl,
          description: data.description,
          createdDateTime: data.createdDateTime,
          lastModifiedDateTime: data.lastModifiedDateTime,
          isPersonalSite: data.isPersonalSite,
          root: data.root,
          siteCollection: data.siteCollection,
        },
      },
    }
  },

  outputs: {
    site: {
      type: 'object',
      description: 'Information about the current SharePoint site',
      properties: {
        id: { type: 'string', description: 'The unique ID of the site' },
        name: { type: 'string', description: 'The name of the site' },
        displayName: { type: 'string', description: 'The display name of the site' },
        webUrl: { type: 'string', description: 'The URL to access the site' },
        description: { type: 'string', description: 'The description of the site' },
        createdDateTime: { type: 'string', description: 'When the site was created' },
        lastModifiedDateTime: { type: 'string', description: 'When the site was last modified' },
        isPersonalSite: { type: 'boolean', description: 'Whether this is a personal site' },
        root: {
          type: 'object',
          properties: {
            serverRelativeUrl: { type: 'string', description: 'Server relative URL' },
          },
        },
        siteCollection: {
          type: 'object',
          properties: {
            hostname: { type: 'string', description: 'Site collection hostname' },
          },
        },
      },
    },
    sites: {
      type: 'array',
      description: 'List of all accessible SharePoint sites',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique ID of the site' },
          name: { type: 'string', description: 'The name of the site' },
          displayName: { type: 'string', description: 'The display name of the site' },
          webUrl: { type: 'string', description: 'The URL to access the site' },
          description: { type: 'string', description: 'The description of the site' },
          createdDateTime: { type: 'string', description: 'When the site was created' },
          lastModifiedDateTime: { type: 'string', description: 'When the site was last modified' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read_page.ts]---
Location: sim-main/apps/sim/tools/sharepoint/read_page.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  GraphApiResponse,
  SharepointPageContent,
  SharepointReadPageResponse,
  SharepointToolParams,
} from '@/tools/sharepoint/types'
import { cleanODataMetadata, extractTextFromCanvasLayout } from '@/tools/sharepoint/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SharePointReadPage')

export const readPageTool: ToolConfig<SharepointToolParams, SharepointReadPageResponse> = {
  id: 'sharepoint_read_page',
  name: 'Read SharePoint Page',
  description: 'Read a specific page from a SharePoint site',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'sharepoint',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the SharePoint API',
    },
    siteSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the SharePoint site',
    },
    siteId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the SharePoint site (internal use)',
    },
    pageId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the page to read',
    },
    pageName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The name of the page to read (alternative to pageId)',
    },
    maxPages: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description:
        'Maximum number of pages to return when listing all pages (default: 10, max: 50)',
    },
  },

  request: {
    url: (params) => {
      // Use specific site if provided, otherwise use root site
      const siteId = params.siteId || params.siteSelector || 'root'

      let baseUrl: string
      if (params.pageId) {
        // Read specific page by ID
        baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/pages/${params.pageId}`
      } else {
        // List all pages (with optional filtering by name)
        baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/pages`
      }

      const url = new URL(baseUrl)

      // Use Microsoft Graph $select parameter to get page details
      // Only include valid properties for SharePoint pages
      url.searchParams.append(
        '$select',
        'id,name,title,webUrl,pageLayout,createdDateTime,lastModifiedDateTime'
      )

      // If searching by name, add filter
      if (params.pageName && !params.pageId) {
        // Try to handle both with and without .aspx extension
        const pageName = params.pageName
        const pageNameWithAspx = pageName.endsWith('.aspx') ? pageName : `${pageName}.aspx`

        // Search for exact match first, then with .aspx if needed
        url.searchParams.append('$filter', `name eq '${pageName}' or name eq '${pageNameWithAspx}'`)
        url.searchParams.append('$top', '10') // Get more results to find matches
      } else if (!params.pageId && !params.pageName) {
        // When listing all pages, apply maxPages limit
        const maxPages = Math.min(params.maxPages || 10, 50) // Default 10, max 50
        url.searchParams.append('$top', maxPages.toString())
      }

      // Only expand content when getting a specific page by ID
      if (params.pageId) {
        url.searchParams.append('$expand', 'canvasLayout')
      }

      const finalUrl = url.toString()

      logger.info('SharePoint API URL', {
        finalUrl,
        siteId,
        pageId: params.pageId,
        pageName: params.pageName,
        searchParams: Object.fromEntries(url.searchParams),
      })

      return finalUrl
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      Accept: 'application/json',
    }),
  },

  transformResponse: async (response: Response, params) => {
    const data: GraphApiResponse = await response.json()

    logger.info('SharePoint API response', {
      pageId: params?.pageId,
      pageName: params?.pageName,
      resultsCount: data.value?.length || (data.id ? 1 : 0),
      hasDirectPage: !!data.id,
      hasSearchResults: !!data.value,
    })

    if (params?.pageId) {
      // Direct page access - return single page
      const pageData = data
      const contentData = {
        content: extractTextFromCanvasLayout(data.canvasLayout),
        canvasLayout: data.canvasLayout as any,
      }

      return {
        success: true,
        output: {
          page: {
            id: pageData.id!,
            name: pageData.name!,
            title: pageData.title || pageData.name!,
            webUrl: pageData.webUrl!,
            pageLayout: pageData.pageLayout,
            createdDateTime: pageData.createdDateTime,
            lastModifiedDateTime: pageData.lastModifiedDateTime,
          },
          content: contentData,
        },
      }
    }
    // Multiple pages or search by name
    if (!data.value || data.value.length === 0) {
      logger.info('No pages found', {
        searchName: params?.pageName,
        siteId: params?.siteId || params?.siteSelector || 'root',
        totalResults: data.value?.length || 0,
      })
      const message = params?.pageName
        ? `Page with name '${params?.pageName}' not found. Make sure the page exists and you have access to it. Note: SharePoint page names typically include the .aspx extension.`
        : 'No pages found on this SharePoint site.'
      return {
        success: true,
        output: {
          content: {
            content: message,
            canvasLayout: null,
          },
        },
      }
    }

    logger.info('Found pages', {
      searchName: params?.pageName,
      foundPages: data.value.map((p: any) => ({ id: p.id, name: p.name, title: p.title })),
      totalCount: data.value.length,
    })

    if (params?.pageName) {
      // Search by name - return single page (first match)
      const pageData = data.value[0]
      const siteId = params?.siteId || params?.siteSelector || 'root'
      const contentUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/pages/${pageData.id}/microsoft.graph.sitePage?$expand=canvasLayout`

      logger.info('Making API call to get page content for searched page', {
        pageId: pageData.id,
        contentUrl,
        siteId,
      })

      const contentResponse = await fetch(contentUrl, {
        headers: {
          Authorization: `Bearer ${params?.accessToken}`,
          Accept: 'application/json',
        },
      })

      let contentData: SharepointPageContent = { content: '' }
      if (contentResponse.ok) {
        const contentResult = await contentResponse.json()
        contentData = {
          content: extractTextFromCanvasLayout(contentResult.canvasLayout),
          canvasLayout: cleanODataMetadata(contentResult.canvasLayout),
        }
      } else {
        logger.error('Failed to fetch page content', {
          status: contentResponse.status,
          statusText: contentResponse.statusText,
        })
      }

      return {
        success: true,
        output: {
          page: {
            id: pageData.id,
            name: pageData.name,
            title: pageData.title || pageData.name,
            webUrl: pageData.webUrl,
            pageLayout: pageData.pageLayout,
            createdDateTime: pageData.createdDateTime,
            lastModifiedDateTime: pageData.lastModifiedDateTime,
          },
          content: contentData,
        },
      }
    }
    // List all pages - return multiple pages with content
    const siteId = params?.siteId || params?.siteSelector || 'root'
    const pagesWithContent = []

    logger.info('Fetching content for all pages', {
      totalPages: data.value.length,
      siteId,
    })

    // Fetch content for each page
    for (const pageInfo of data.value) {
      const contentUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/pages/${pageInfo.id}/microsoft.graph.sitePage?$expand=canvasLayout`

      try {
        const contentResponse = await fetch(contentUrl, {
          headers: {
            Authorization: `Bearer ${params?.accessToken}`,
            Accept: 'application/json',
          },
        })

        let contentData = { content: '', canvasLayout: null }
        if (contentResponse.ok) {
          const contentResult = await contentResponse.json()
          contentData = {
            content: extractTextFromCanvasLayout(contentResult.canvasLayout),
            canvasLayout: cleanODataMetadata(contentResult.canvasLayout),
          }
        } else {
          logger.error('Failed to fetch content for page', {
            pageId: pageInfo.id,
            pageName: pageInfo.name,
            status: contentResponse.status,
          })
        }

        pagesWithContent.push({
          page: {
            id: pageInfo.id,
            name: pageInfo.name,
            title: pageInfo.title || pageInfo.name,
            webUrl: pageInfo.webUrl,
            pageLayout: pageInfo.pageLayout,
            createdDateTime: pageInfo.createdDateTime,
            lastModifiedDateTime: pageInfo.lastModifiedDateTime,
          },
          content: contentData,
        })
      } catch (error) {
        logger.error('Error fetching content for page', {
          pageId: pageInfo.id,
          pageName: pageInfo.name,
          error: error instanceof Error ? error.message : String(error),
        })

        // Still add the page without content
        pagesWithContent.push({
          page: {
            id: pageInfo.id,
            name: pageInfo.name,
            title: pageInfo.title || pageInfo.name,
            webUrl: pageInfo.webUrl,
            pageLayout: pageInfo.pageLayout,
            createdDateTime: pageInfo.createdDateTime,
            lastModifiedDateTime: pageInfo.lastModifiedDateTime,
          },
          content: { content: 'Failed to fetch content', canvasLayout: null },
        })
      }
    }

    logger.info('Completed fetching content for all pages', {
      totalPages: pagesWithContent.length,
      successfulPages: pagesWithContent.filter(
        (p) => p.content.content !== 'Failed to fetch content'
      ).length,
    })

    return {
      success: true,
      output: {
        pages: pagesWithContent,
        totalPages: pagesWithContent.length,
      },
    }
  },

  outputs: {
    page: {
      type: 'object',
      description: 'Information about the SharePoint page',
      properties: {
        id: { type: 'string', description: 'The unique ID of the page' },
        name: { type: 'string', description: 'The name of the page' },
        title: { type: 'string', description: 'The title of the page' },
        webUrl: { type: 'string', description: 'The URL to access the page' },
        pageLayout: { type: 'string', description: 'The layout type of the page' },
        createdDateTime: { type: 'string', description: 'When the page was created' },
        lastModifiedDateTime: { type: 'string', description: 'When the page was last modified' },
      },
    },
    pages: {
      type: 'array',
      description: 'List of SharePoint pages',
      items: {
        type: 'object',
        properties: {
          page: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'The unique ID of the page' },
              name: { type: 'string', description: 'The name of the page' },
              title: { type: 'string', description: 'The title of the page' },
              webUrl: { type: 'string', description: 'The URL to access the page' },
              pageLayout: { type: 'string', description: 'The layout type of the page' },
              createdDateTime: { type: 'string', description: 'When the page was created' },
              lastModifiedDateTime: {
                type: 'string',
                description: 'When the page was last modified',
              },
            },
          },
          content: {
            type: 'object',
            properties: {
              content: { type: 'string', description: 'Extracted text content from the page' },
              canvasLayout: {
                type: 'object',
                description: 'Raw SharePoint canvas layout structure',
              },
            },
          },
        },
      },
    },
    content: {
      type: 'object',
      description: 'Content of the SharePoint page',
      properties: {
        content: { type: 'string', description: 'Extracted text content from the page' },
        canvasLayout: { type: 'object', description: 'Raw SharePoint canvas layout structure' },
      },
    },
    totalPages: { type: 'number', description: 'Total number of pages found' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/sharepoint/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface SharepointSite {
  id: string
  name: string
  displayName: string
  webUrl: string
  description?: string
  createdDateTime?: string
  lastModifiedDateTime?: string
}

export interface SharepointPage {
  '@odata.type'?: string
  id?: string
  name: string
  title: string
  webUrl?: string
  pageLayout?: string
  createdDateTime?: string
  lastModifiedDateTime?: string
  publishingState?: {
    level: string
  }
  canvasLayout?: {
    horizontalSections: Array<{
      layout: string
      id: string
      emphasis: string
      columns?: Array<{
        id: string
        width: number
        webparts: Array<{
          id: string
          innerHtml: string
        }>
      }>
      webparts?: Array<{
        id: string
        innerHtml: string
      }>
    }>
  }
}

export interface SharepointPageContent {
  content: string
  canvasLayout?: {
    horizontalSections: Array<{
      layout: string
      id: string
      emphasis: string
      webparts: Array<{
        id: string
        innerHtml: string
      }>
    }>
  } | null
}

export interface SharepointColumn {
  id?: string
  name?: string
  displayName?: string
  description?: string
  indexed?: boolean
  enforcedUniqueValues?: boolean
  hidden?: boolean
  readOnly?: boolean
  required?: boolean
  columnGroup?: string
  [key: string]: unknown
}

export interface SharepointListItem {
  id: string
  fields?: Record<string, unknown>
}

export interface SharepointList {
  id: string
  displayName?: string
  name?: string
  webUrl?: string
  createdDateTime?: string
  lastModifiedDateTime?: string
  list?: {
    template?: string
  }
  columns?: SharepointColumn[]
  items?: SharepointListItem[]
}

export interface SharepointListSitesResponse extends ToolResponse {
  output: {
    sites: SharepointSite[]
    nextPageToken?: string
  }
}

export interface SharepointCreatePageResponse extends ToolResponse {
  output: {
    page: SharepointPage
  }
}

export interface SharepointPageWithContent {
  page: SharepointPage
  content: SharepointPageContent
}

export interface SharepointReadPageResponse extends ToolResponse {
  output: {
    page?: SharepointPage
    pages?: SharepointPageWithContent[]
    content?: SharepointPageContent
    totalPages?: number
  }
}

export interface SharepointReadSiteResponse extends ToolResponse {
  output: {
    site?: {
      id: string
      name: string
      displayName: string
      webUrl: string
      description?: string
      createdDateTime?: string
      lastModifiedDateTime?: string
      isPersonalSite?: boolean
      root?: {
        serverRelativeUrl: string
      }
      siteCollection?: {
        hostname: string
      }
    }
    sites?: Array<{
      id: string
      name: string
      displayName: string
      webUrl: string
      description?: string
      createdDateTime?: string
      lastModifiedDateTime?: string
    }>
  }
}

export interface SharepointToolParams {
  accessToken: string
  siteId?: string
  siteSelector?: string
  pageId?: string
  pageName?: string
  pageContent?: string
  pageTitle?: string
  publishingState?: string
  query?: string
  pageSize?: number
  pageToken?: string
  hostname?: string
  serverRelativePath?: string
  groupId?: string
  maxPages?: number
  // Lists
  listId?: string
  listTitle?: string
  includeColumns?: boolean
  includeItems?: boolean
  // Create List
  listDisplayName?: string
  listDescription?: string
  listTemplate?: string
  // Update List Item
  itemId?: string
  listItemFields?: Record<string, unknown>
  // Upload File
  driveId?: string
  folderPath?: string
  fileName?: string
  files?: any[]
}

export interface GraphApiResponse {
  id?: string
  name?: string
  title?: string
  webUrl?: string
  pageLayout?: string
  createdDateTime?: string
  lastModifiedDateTime?: string
  canvasLayout?: CanvasLayout
  value?: GraphApiPageItem[]
  error?: {
    message: string
  }
}

export interface GraphApiPageItem {
  id: string
  name: string
  title?: string
  webUrl?: string
  pageLayout?: string
  createdDateTime?: string
  lastModifiedDateTime?: string
}

export interface CanvasLayout {
  horizontalSections?: Array<{
    layout?: string
    id?: string
    emphasis?: string
    columns?: Array<{
      webparts?: Array<{
        id?: string
        innerHtml?: string
      }>
    }>
    webparts?: Array<{
      id?: string
      innerHtml?: string
    }>
  }>
}

export interface SharepointReadSiteResponse extends ToolResponse {
  output: {
    site?: {
      id: string
      name: string
      displayName: string
      webUrl: string
      description?: string
      createdDateTime?: string
      lastModifiedDateTime?: string
      isPersonalSite?: boolean
      root?: {
        serverRelativeUrl: string
      }
      siteCollection?: {
        hostname: string
      }
    }
    sites?: Array<{
      id: string
      name: string
      displayName: string
      webUrl: string
      description?: string
      createdDateTime?: string
      lastModifiedDateTime?: string
    }>
  }
}

export type SharepointResponse =
  | SharepointListSitesResponse
  | SharepointCreatePageResponse
  | SharepointReadPageResponse
  | SharepointReadSiteResponse
  | SharepointGetListResponse
  | SharepointCreateListResponse
  | SharepointUpdateListItemResponse
  | SharepointAddListItemResponse
  | SharepointUploadFileResponse

export interface SharepointGetListResponse extends ToolResponse {
  output: {
    list?: SharepointList
    lists?: SharepointList[]
    nextPageToken?: string
  }
}

export interface SharepointCreateListResponse extends ToolResponse {
  output: {
    list: SharepointList
  }
}

export interface SharepointUpdateListItemResponse extends ToolResponse {
  output: {
    item: {
      id: string
      fields?: Record<string, unknown>
    }
  }
}

export interface SharepointAddListItemResponse extends ToolResponse {
  output: {
    item: {
      id: string
      fields?: Record<string, unknown>
    }
  }
}

export interface SharepointUploadedFile {
  id: string
  name: string
  webUrl: string
  size: number
  createdDateTime?: string
  lastModifiedDateTime?: string
}

export interface SharepointUploadFileResponse extends ToolResponse {
  output: {
    uploadedFiles: SharepointUploadedFile[]
    fileCount: number
  }
}
```

--------------------------------------------------------------------------------

````
