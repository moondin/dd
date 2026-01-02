---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 300
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 300 of 933)

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

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/asana/create-task/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('AsanaCreateTaskAPI')

export async function POST(request: Request) {
  try {
    const { accessToken, workspace, name, notes, assignee, due_on } = await request.json()

    if (!accessToken) {
      logger.error('Missing access token in request')
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!name) {
      logger.error('Missing task name in request')
      return NextResponse.json({ error: 'Task name is required' }, { status: 400 })
    }

    if (!workspace) {
      logger.error('Missing workspace in request')
      return NextResponse.json({ error: 'Workspace GID is required' }, { status: 400 })
    }

    const workspaceValidation = validateAlphanumericId(workspace, 'workspace', 100)
    if (!workspaceValidation.isValid) {
      return NextResponse.json({ error: workspaceValidation.error }, { status: 400 })
    }

    const url = 'https://app.asana.com/api/1.0/tasks'

    const taskData: Record<string, any> = {
      name,
      workspace,
    }

    if (notes) {
      taskData.notes = notes
    }

    if (assignee) {
      taskData.assignee = assignee
    }

    if (due_on) {
      taskData.due_on = due_on
    }

    const body = { data: taskData }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Asana API error: ${response.status} ${response.statusText}`

      try {
        const errorData = JSON.parse(errorText)
        const asanaError = errorData.errors?.[0]
        if (asanaError) {
          errorMessage = `${asanaError.message || errorMessage} (${asanaError.help || ''})`
        }
        logger.error('Asana API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
      } catch (_e) {
        logger.error('Asana API error (unparsed):', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    const task = result.data

    return NextResponse.json({
      success: true,
      ts: new Date().toISOString(),
      gid: task.gid,
      name: task.name,
      notes: task.notes || '',
      completed: task.completed || false,
      created_at: task.created_at,
      permalink_url: task.permalink_url,
    })
  } catch (error: any) {
    logger.error('Error creating Asana task:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/asana/get-projects/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('AsanaGetProjectsAPI')

export async function POST(request: Request) {
  try {
    const { accessToken, workspace } = await request.json()

    if (!accessToken) {
      logger.error('Missing access token in request')
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!workspace) {
      logger.error('Missing workspace in request')
      return NextResponse.json({ error: 'Workspace is required' }, { status: 400 })
    }

    const workspaceValidation = validateAlphanumericId(workspace, 'workspace', 100)
    if (!workspaceValidation.isValid) {
      return NextResponse.json({ error: workspaceValidation.error }, { status: 400 })
    }

    const url = `https://app.asana.com/api/1.0/projects?workspace=${workspace}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Asana API error: ${response.status} ${response.statusText}`

      try {
        const errorData = JSON.parse(errorText)
        const asanaError = errorData.errors?.[0]
        if (asanaError) {
          errorMessage = `${asanaError.message || errorMessage} (${asanaError.help || ''})`
        }
        logger.error('Asana API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
      } catch (_e) {
        logger.error('Asana API error (unparsed):', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    const projects = result.data

    return NextResponse.json({
      success: true,
      ts: new Date().toISOString(),
      projects: projects.map((project: any) => ({
        gid: project.gid,
        name: project.name,
        resource_type: project.resource_type,
      })),
    })
  } catch (error) {
    logger.error('Error processing request:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve Asana projects',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/asana/get-task/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('AsanaGetTaskAPI')

export async function POST(request: Request) {
  try {
    const { accessToken, taskGid, workspace, project, limit } = await request.json()

    if (!accessToken) {
      logger.error('Missing access token in request')
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (taskGid) {
      const taskGidValidation = validateAlphanumericId(taskGid, 'taskGid', 100)
      if (!taskGidValidation.isValid) {
        return NextResponse.json({ error: taskGidValidation.error }, { status: 400 })
      }

      const url = `https://app.asana.com/api/1.0/tasks/${taskGid}?opt_fields=gid,name,notes,completed,assignee,assignee.name,due_on,created_at,modified_at,created_by,created_by.name,resource_type,resource_subtype`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `Asana API error: ${response.status} ${response.statusText}`

        try {
          const errorData = JSON.parse(errorText)
          const asanaError = errorData.errors?.[0]
          if (asanaError) {
            errorMessage = `${asanaError.message || errorMessage} (${asanaError.help || ''})`
          }
          logger.error('Asana API error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          })
        } catch (_e) {
          logger.error('Asana API error (unparsed):', {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
          })
        }

        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
            details: errorText,
          },
          { status: response.status }
        )
      }

      const result = await response.json()
      const task = result.data

      return NextResponse.json({
        success: true,
        ts: new Date().toISOString(),
        gid: task.gid,
        resource_type: task.resource_type,
        resource_subtype: task.resource_subtype,
        name: task.name,
        notes: task.notes || '',
        completed: task.completed || false,
        assignee: task.assignee
          ? {
              gid: task.assignee.gid,
              name: task.assignee.name,
            }
          : undefined,
        created_by: task.created_by
          ? {
              gid: task.created_by.gid,
              resource_type: task.created_by.resource_type,
              name: task.created_by.name,
            }
          : undefined,
        due_on: task.due_on || undefined,
        created_at: task.created_at,
        modified_at: task.modified_at,
      })
    }

    if (!workspace && !project) {
      logger.error('Either taskGid or workspace/project must be provided')
      return NextResponse.json(
        { error: 'Either taskGid or workspace/project must be provided' },
        { status: 400 }
      )
    }

    const params = new URLSearchParams()

    if (project) {
      const projectValidation = validateAlphanumericId(project, 'project', 100)
      if (!projectValidation.isValid) {
        return NextResponse.json({ error: projectValidation.error }, { status: 400 })
      }
      params.append('project', project)
    } else if (workspace) {
      const workspaceValidation = validateAlphanumericId(workspace, 'workspace', 100)
      if (!workspaceValidation.isValid) {
        return NextResponse.json({ error: workspaceValidation.error }, { status: 400 })
      }
      params.append('workspace', workspace)
    }

    if (limit) {
      params.append('limit', String(limit))
    } else {
      params.append('limit', '50')
    }

    params.append(
      'opt_fields',
      'gid,name,notes,completed,assignee,assignee.name,due_on,created_at,modified_at,created_by,created_by.name,resource_type,resource_subtype'
    )

    const url = `https://app.asana.com/api/1.0/tasks?${params.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Asana API error: ${response.status} ${response.statusText}`

      try {
        const errorData = JSON.parse(errorText)
        const asanaError = errorData.errors?.[0]
        if (asanaError) {
          errorMessage = `${asanaError.message || errorMessage} (${asanaError.help || ''})`
        }
        logger.error('Asana API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
      } catch (_e) {
        logger.error('Asana API error (unparsed):', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    const tasks = result.data

    return NextResponse.json({
      success: true,
      ts: new Date().toISOString(),
      tasks: tasks.map((task: any) => ({
        gid: task.gid,
        resource_type: task.resource_type,
        resource_subtype: task.resource_subtype,
        name: task.name,
        notes: task.notes || '',
        completed: task.completed || false,
        assignee: task.assignee
          ? {
              gid: task.assignee.gid,
              name: task.assignee.name,
            }
          : undefined,
        created_by: task.created_by
          ? {
              gid: task.created_by.gid,
              resource_type: task.created_by.resource_type,
              name: task.created_by.name,
            }
          : undefined,
        due_on: task.due_on || undefined,
        created_at: task.created_at,
        modified_at: task.modified_at,
      })),
      next_page: result.next_page,
    })
  } catch (error) {
    logger.error('Error processing request:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve Asana task(s)',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/asana/search-tasks/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('AsanaSearchTasksAPI')

export async function POST(request: Request) {
  try {
    const { accessToken, workspace, text, assignee, projects, completed } = await request.json()

    if (!accessToken) {
      logger.error('Missing access token in request')
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!workspace) {
      logger.error('Missing workspace in request')
      return NextResponse.json({ error: 'Workspace is required' }, { status: 400 })
    }

    const workspaceValidation = validateAlphanumericId(workspace, 'workspace', 100)
    if (!workspaceValidation.isValid) {
      return NextResponse.json({ error: workspaceValidation.error }, { status: 400 })
    }

    const params = new URLSearchParams()

    if (text) {
      params.append('text', text)
    }

    if (assignee) {
      params.append('assignee.any', assignee)
    }

    if (projects && Array.isArray(projects) && projects.length > 0) {
      params.append('projects.any', projects.join(','))
    }

    if (completed !== undefined) {
      params.append('completed', String(completed))
    }

    params.append(
      'opt_fields',
      'gid,name,notes,completed,assignee,assignee.name,due_on,created_at,modified_at,created_by,created_by.name,resource_type,resource_subtype'
    )

    const url = `https://app.asana.com/api/1.0/workspaces/${workspace}/tasks/search?${params.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Asana API error: ${response.status} ${response.statusText}`

      try {
        const errorData = JSON.parse(errorText)
        const asanaError = errorData.errors?.[0]
        if (asanaError) {
          errorMessage = `${asanaError.message || errorMessage} (${asanaError.help || ''})`
        }
        logger.error('Asana API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
      } catch (_e) {
        logger.error('Asana API error (unparsed):', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    const tasks = result.data

    return NextResponse.json({
      success: true,
      ts: new Date().toISOString(),
      tasks: tasks.map((task: any) => ({
        gid: task.gid,
        resource_type: task.resource_type,
        resource_subtype: task.resource_subtype,
        name: task.name,
        notes: task.notes || '',
        completed: task.completed || false,
        assignee: task.assignee
          ? {
              gid: task.assignee.gid,
              name: task.assignee.name,
            }
          : undefined,
        created_by: task.created_by
          ? {
              gid: task.created_by.gid,
              resource_type: task.created_by.resource_type,
              name: task.created_by.name,
            }
          : undefined,
        due_on: task.due_on || undefined,
        created_at: task.created_at,
        modified_at: task.modified_at,
      })),
      next_page: result.next_page,
    })
  } catch (error) {
    logger.error('Error processing request:', error)
    return NextResponse.json(
      {
        error: 'Failed to search Asana tasks',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/asana/update-task/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('AsanaUpdateTaskAPI')

export async function PUT(request: Request) {
  try {
    const { accessToken, taskGid, name, notes, assignee, completed, due_on } = await request.json()

    if (!accessToken) {
      logger.error('Missing access token in request')
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!taskGid) {
      logger.error('Missing task GID in request')
      return NextResponse.json({ error: 'Task GID is required' }, { status: 400 })
    }

    const taskGidValidation = validateAlphanumericId(taskGid, 'taskGid', 100)
    if (!taskGidValidation.isValid) {
      return NextResponse.json({ error: taskGidValidation.error }, { status: 400 })
    }

    const url = `https://app.asana.com/api/1.0/tasks/${taskGid}`

    const taskData: Record<string, any> = {}

    if (name !== undefined) {
      taskData.name = name
    }

    if (notes !== undefined) {
      taskData.notes = notes
    }

    if (assignee !== undefined) {
      taskData.assignee = assignee
    }

    if (completed !== undefined) {
      taskData.completed = completed
    }

    if (due_on !== undefined) {
      taskData.due_on = due_on
    }

    const body = { data: taskData }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Asana API error: ${response.status} ${response.statusText}`

      try {
        const errorData = JSON.parse(errorText)
        const asanaError = errorData.errors?.[0]
        if (asanaError) {
          errorMessage = `${asanaError.message || errorMessage} (${asanaError.help || ''})`
        }
        logger.error('Asana API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
      } catch (_e) {
        logger.error('Asana API error (unparsed):', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    const task = result.data

    return NextResponse.json({
      success: true,
      ts: new Date().toISOString(),
      gid: task.gid,
      name: task.name,
      notes: task.notes || '',
      completed: task.completed || false,
      modified_at: task.modified_at,
    })
  } catch (error: any) {
    logger.error('Error updating Asana task:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/attachment/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluenceAttachmentAPI')

export const dynamic = 'force-dynamic'

// Delete an attachment
export async function DELETE(request: Request) {
  try {
    const { domain, accessToken, cloudId: providedCloudId, attachmentId } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!attachmentId) {
      return NextResponse.json({ error: 'Attachment ID is required' }, { status: 400 })
    }

    const attachmentIdValidation = validateAlphanumericId(attachmentId, 'attachmentId', 255)
    if (!attachmentIdValidation.isValid) {
      return NextResponse.json({ error: attachmentIdValidation.error }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/attachments/${attachmentId}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to delete Confluence attachment (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    return NextResponse.json({ attachmentId, deleted: true })
  } catch (error) {
    logger.error('Error deleting Confluence attachment:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/attachments/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluenceAttachmentsAPI')

export const dynamic = 'force-dynamic'

// List attachments on a page
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    const accessToken = searchParams.get('accessToken')
    const pageId = searchParams.get('pageId')
    const providedCloudId = searchParams.get('cloudId')
    const limit = searchParams.get('limit') || '25'

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const pageIdValidation = validateAlphanumericId(pageId, 'pageId', 255)
    if (!pageIdValidation.isValid) {
      return NextResponse.json({ error: pageIdValidation.error }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/pages/${pageId}/attachments?limit=${limit}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to list Confluence attachments (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()

    const attachments = (data.results || []).map((attachment: any) => ({
      id: attachment.id,
      title: attachment.title,
      fileSize: attachment.fileSize || 0,
      mediaType: attachment.mediaType || '',
      downloadUrl: attachment.downloadLink || attachment._links?.download || '',
    }))

    return NextResponse.json({ attachments })
  } catch (error) {
    logger.error('Error listing Confluence attachments:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/comment/route.ts
Signals: Next.js, Zod

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluenceCommentAPI')

export const dynamic = 'force-dynamic'

const putCommentSchema = z
  .object({
    domain: z.string().min(1, 'Domain is required'),
    accessToken: z.string().min(1, 'Access token is required'),
    cloudId: z.string().optional(),
    commentId: z.string().min(1, 'Comment ID is required'),
    comment: z.string().min(1, 'Comment is required'),
  })
  .refine(
    (data) => {
      const validation = validateAlphanumericId(data.commentId, 'commentId', 255)
      return validation.isValid
    },
    (data) => {
      const validation = validateAlphanumericId(data.commentId, 'commentId', 255)
      return { message: validation.error || 'Invalid comment ID', path: ['commentId'] }
    }
  )

const deleteCommentSchema = z
  .object({
    domain: z.string().min(1, 'Domain is required'),
    accessToken: z.string().min(1, 'Access token is required'),
    cloudId: z.string().optional(),
    commentId: z.string().min(1, 'Comment ID is required'),
  })
  .refine(
    (data) => {
      const validation = validateAlphanumericId(data.commentId, 'commentId', 255)
      return validation.isValid
    },
    (data) => {
      const validation = validateAlphanumericId(data.commentId, 'commentId', 255)
      return { message: validation.error || 'Invalid comment ID', path: ['commentId'] }
    }
  )

// Update a comment
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const validation = putCommentSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { domain, accessToken, cloudId: providedCloudId, commentId, comment } = validation.data

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    // Get current comment version
    const getUrl = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/footer-comments/${commentId}`
    const getResponse = await fetch(getUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch current comment: ${getResponse.status}`)
    }

    const currentComment = await getResponse.json()
    const currentVersion = currentComment.version?.number || 1

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/footer-comments/${commentId}`

    const updateBody = {
      body: {
        representation: 'storage',
        value: comment,
      },
      version: {
        number: currentVersion + 1,
        message: 'Updated via Sim',
      },
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updateBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to update Confluence comment (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error updating Confluence comment:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete a comment
export async function DELETE(request: Request) {
  try {
    const body = await request.json()

    const validation = deleteCommentSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { domain, accessToken, cloudId: providedCloudId, commentId } = validation.data

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/footer-comments/${commentId}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to delete Confluence comment (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    return NextResponse.json({ commentId, deleted: true })
  } catch (error) {
    logger.error('Error deleting Confluence comment:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/comments/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluenceCommentsAPI')

export const dynamic = 'force-dynamic'

// Create a comment
export async function POST(request: Request) {
  try {
    const { domain, accessToken, cloudId: providedCloudId, pageId, comment } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    if (!comment) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
    }

    const pageIdValidation = validateAlphanumericId(pageId, 'pageId', 255)
    if (!pageIdValidation.isValid) {
      return NextResponse.json({ error: pageIdValidation.error }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/footer-comments`

    logger.info('Calling Confluence API', { url })

    const body = {
      pageId,
      body: {
        representation: 'storage',
        value: comment,
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to create Confluence comment (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ ...data, pageId })
  } catch (error) {
    logger.error('Error creating Confluence comment:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// List comments on a page
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    const accessToken = searchParams.get('accessToken')
    const pageId = searchParams.get('pageId')
    const providedCloudId = searchParams.get('cloudId')
    const limit = searchParams.get('limit') || '25'

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const pageIdValidation = validateAlphanumericId(pageId, 'pageId', 255)
    if (!pageIdValidation.isValid) {
      return NextResponse.json({ error: pageIdValidation.error }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/pages/${pageId}/footer-comments?limit=${limit}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to list Confluence comments (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()

    const comments = (data.results || []).map((comment: any) => ({
      id: comment.id,
      body: comment.body?.storage?.value || comment.body?.view?.value || '',
      createdAt: comment.createdAt || '',
      authorId: comment.authorId || '',
    }))

    return NextResponse.json({ comments })
  } catch (error) {
    logger.error('Error listing Confluence comments:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
