---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 306
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 306 of 933)

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
Location: sim-main/apps/sim/app/api/tools/jira/projects/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getJiraCloudId } from '@/tools/jira/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('JiraProjectsAPI')

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const domain = url.searchParams.get('domain')?.trim()
    const accessToken = url.searchParams.get('accessToken')
    const providedCloudId = url.searchParams.get('cloudId')
    const query = url.searchParams.get('query') || ''

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getJiraCloudId(domain, accessToken))
    logger.info(`Using cloud ID: ${cloudId}`)

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const apiUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/search`

    const queryParams = new URLSearchParams()
    if (query) {
      queryParams.append('query', query)
    }
    queryParams.append('orderBy', 'name')
    queryParams.append('expand', 'description,lead,url,projectKeys')

    const finalUrl = `${apiUrl}?${queryParams.toString()}`
    logger.info(`Fetching Jira projects from: ${finalUrl}`)

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    logger.info(`Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      logger.error(`Jira API error: ${response.status} ${response.statusText}`)
      let errorMessage
      try {
        const errorData = await response.json()
        logger.error('Error details:', errorData)
        errorMessage = errorData.message || `Failed to fetch projects (${response.status})`
      } catch (_e) {
        errorMessage = `Failed to fetch projects: ${response.status} ${response.statusText}`
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()

    logger.info(`Jira API Response Status: ${response.status}`)
    logger.info(`Found projects: ${data.values?.length || 0}`)

    const projects =
      data.values?.map((project: any) => ({
        id: project.id,
        key: project.key,
        name: project.name,
        url: project.self,
        avatarUrl: project.avatarUrls?.['48x48'],
        description: project.description,
        projectTypeKey: project.projectTypeKey,
        simplified: project.simplified,
        style: project.style,
        isPrivate: project.isPrivate,
      })) || []

    return NextResponse.json({
      projects,
      cloudId,
    })
  } catch (error) {
    logger.error('Error fetching Jira projects:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { domain, accessToken, projectId, cloudId: providedCloudId } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getJiraCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const projectIdValidation = validateAlphanumericId(projectId, 'projectId', 100)
    if (!projectIdValidation.isValid) {
      return NextResponse.json({ error: projectIdValidation.error }, { status: 400 })
    }

    const apiUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/${projectId}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      logger.error('Error details:', errorData)
      return NextResponse.json(
        { error: errorData.message || `Failed to fetch project (${response.status})` },
        { status: response.status }
      )
    }

    const project = await response.json()

    return NextResponse.json({
      project: {
        id: project.id,
        key: project.key,
        name: project.name,
        url: project.self,
        avatarUrl: project.avatarUrls?.['48x48'],
        description: project.description,
        projectTypeKey: project.projectTypeKey,
        simplified: project.simplified,
        style: project.style,
        isPrivate: project.isPrivate,
      },
      cloudId,
    })
  } catch (error) {
    logger.error('Error fetching Jira project:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/jira/update/route.ts
Signals: Next.js, Zod

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { validateJiraCloudId, validateJiraIssueKey } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getJiraCloudId } from '@/tools/jira/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('JiraUpdateAPI')

const jiraUpdateSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  accessToken: z.string().min(1, 'Access token is required'),
  issueKey: z.string().min(1, 'Issue key is required'),
  summary: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignee: z.string().optional(),
  cloudId: z.string().optional(),
})

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const validation = jiraUpdateSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.errors[0]
      logger.error('Validation error:', firstError)
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const {
      domain,
      accessToken,
      issueKey,
      summary,
      title,
      description,
      status,
      priority,
      assignee,
      cloudId: providedCloudId,
    } = validation.data

    const cloudId = providedCloudId || (await getJiraCloudId(domain, accessToken))
    logger.info('Using cloud ID:', cloudId)

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const issueKeyValidation = validateJiraIssueKey(issueKey, 'issueKey')
    if (!issueKeyValidation.isValid) {
      return NextResponse.json({ error: issueKeyValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${issueKey}`

    logger.info('Updating Jira issue at:', url)

    const summaryValue = summary || title
    const fields: Record<string, any> = {}

    if (summaryValue !== undefined && summaryValue !== null && summaryValue !== '') {
      fields.summary = summaryValue
    }

    if (description !== undefined && description !== null && description !== '') {
      fields.description = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: description,
              },
            ],
          },
        ],
      }
    }

    if (status !== undefined && status !== null && status !== '') {
      fields.status = {
        name: status,
      }
    }

    if (priority !== undefined && priority !== null && priority !== '') {
      fields.priority = {
        name: priority,
      }
    }

    if (assignee !== undefined && assignee !== null && assignee !== '') {
      fields.assignee = {
        id: assignee,
      }
    }

    const requestBody = { fields }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('Jira API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })

      return NextResponse.json(
        { error: `Jira API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const responseData = response.status === 204 ? {} : await response.json()
    logger.info('Successfully updated Jira issue:', issueKey)

    return NextResponse.json({
      success: true,
      output: {
        ts: new Date().toISOString(),
        issueKey: responseData.key || issueKey,
        summary: responseData.fields?.summary || 'Issue updated',
        success: true,
      },
    })
  } catch (error: any) {
    logger.error('Error updating Jira issue:', {
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
Location: sim-main/apps/sim/app/api/tools/jira/write/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getJiraCloudId } from '@/tools/jira/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('JiraWriteAPI')

export async function POST(request: Request) {
  try {
    const {
      domain,
      accessToken,
      projectId,
      summary,
      description,
      priority,
      assignee,
      cloudId: providedCloudId,
      issueType,
      parent,
    } = await request.json()

    if (!domain) {
      logger.error('Missing domain in request')
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      logger.error('Missing access token in request')
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!projectId) {
      logger.error('Missing project ID in request')
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    if (!summary) {
      logger.error('Missing summary in request')
      return NextResponse.json({ error: 'Summary is required' }, { status: 400 })
    }

    const normalizedIssueType = issueType || 'Task'

    const cloudId = providedCloudId || (await getJiraCloudId(domain, accessToken))
    logger.info('Using cloud ID:', cloudId)

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const projectIdValidation = validateAlphanumericId(projectId, 'projectId', 100)
    if (!projectIdValidation.isValid) {
      return NextResponse.json({ error: projectIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue`

    logger.info('Creating Jira issue at:', url)

    const fields: Record<string, any> = {
      project: {
        id: projectId,
      },
      issuetype: {
        name: normalizedIssueType,
      },
      summary: summary,
    }

    if (description !== undefined && description !== null && description !== '') {
      fields.description = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: description,
              },
            ],
          },
        ],
      }
    }

    if (parent !== undefined && parent !== null && parent !== '') {
      fields.parent = parent
    }

    if (priority !== undefined && priority !== null && priority !== '') {
      fields.priority = {
        name: priority,
      }
    }

    if (assignee !== undefined && assignee !== null && assignee !== '') {
      fields.assignee = {
        id: assignee,
      }
    }

    const body = { fields }

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
      logger.error('Jira API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })

      return NextResponse.json(
        { error: `Jira API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const responseData = await response.json()
    logger.info('Successfully created Jira issue:', responseData.key)

    return NextResponse.json({
      success: true,
      output: {
        ts: new Date().toISOString(),
        issueKey: responseData.key || 'unknown',
        summary: responseData.fields?.summary || 'Issue created',
        success: true,
        url: `https://${domain}/browse/${responseData.key}`,
      },
    })
  } catch (error: any) {
    logger.error('Error creating Jira issue:', {
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
Location: sim-main/apps/sim/app/api/tools/linear/projects/route.ts
Signals: Next.js

```typescript
import type { Project } from '@linear/sdk'
import { LinearClient } from '@linear/sdk'
import { NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('LinearProjectsAPI')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { credential, teamId, workflowId } = body

    if (!credential || !teamId) {
      logger.error('Missing credential or teamId in request')
      return NextResponse.json({ error: 'Credential and teamId are required' }, { status: 400 })
    }

    const requestId = generateRequestId()
    const authz = await authorizeCredentialUse(request as any, {
      credentialId: credential,
      workflowId,
    })
    if (!authz.ok || !authz.credentialOwnerUserId) {
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(
      credential,
      authz.credentialOwnerUserId,
      requestId
    )
    if (!accessToken) {
      logger.error('Failed to get access token', {
        credentialId: credential,
        userId: authz.credentialOwnerUserId,
      })
      return NextResponse.json(
        {
          error: 'Could not retrieve access token',
          authRequired: true,
        },
        { status: 401 }
      )
    }

    const linearClient = new LinearClient({ accessToken })
    let projects = []

    const team = await linearClient.team(teamId)
    const projectsResult = await team.projects()
    projects = projectsResult.nodes.map((project: Project) => ({
      id: project.id,
      name: project.name,
    }))

    if (projects.length === 0) {
      logger.info('No projects found for team', { teamId })
    }

    return NextResponse.json({ projects })
  } catch (error) {
    logger.error('Error processing Linear projects request:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve Linear projects', details: (error as Error).message },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/linear/teams/route.ts
Signals: Next.js

```typescript
import type { Team } from '@linear/sdk'
import { LinearClient } from '@linear/sdk'
import { NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('LinearTeamsAPI')

export async function POST(request: Request) {
  try {
    const requestId = generateRequestId()
    const body = await request.json()
    const { credential, workflowId } = body

    if (!credential) {
      logger.error('Missing credential in request')
      return NextResponse.json({ error: 'Credential is required' }, { status: 400 })
    }

    const authz = await authorizeCredentialUse(request as any, {
      credentialId: credential,
      workflowId,
    })
    if (!authz.ok || !authz.credentialOwnerUserId) {
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(
      credential,
      authz.credentialOwnerUserId,
      requestId
    )
    if (!accessToken) {
      logger.error('Failed to get access token', {
        credentialId: credential,
        userId: authz.credentialOwnerUserId,
      })
      return NextResponse.json(
        {
          error: 'Could not retrieve access token',
          authRequired: true,
        },
        { status: 401 }
      )
    }

    const linearClient = new LinearClient({ accessToken })
    const teamsResult = await linearClient.teams()
    const teams = teamsResult.nodes.map((team: Team) => ({
      id: team.id,
      name: team.name,
    }))

    return NextResponse.json({ teams })
  } catch (error) {
    logger.error('Error processing Linear teams request:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve Linear teams', details: (error as Error).message },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/mail/send/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('MailSendAPI')

const MailSendSchema = z.object({
  fromAddress: z.string().email('Invalid from email address').min(1, 'From address is required'),
  to: z.string().email('Invalid email address').min(1, 'To email is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
  contentType: z.enum(['text', 'html']).optional().nullable(),
  resendApiKey: z.string().min(1, 'Resend API key is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized mail send attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          message: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated mail request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = MailSendSchema.parse(body)

    logger.info(`[${requestId}] Sending email with user-provided Resend API key`, {
      to: validatedData.to,
      subject: validatedData.subject,
      bodyLength: validatedData.body.length,
      from: validatedData.fromAddress,
    })

    const resend = new Resend(validatedData.resendApiKey)

    const contentType = validatedData.contentType || 'text'
    const emailData =
      contentType === 'html'
        ? {
            from: validatedData.fromAddress,
            to: validatedData.to,
            subject: validatedData.subject,
            html: validatedData.body,
            text: validatedData.body.replace(/<[^>]*>/g, ''), // Strip HTML for text version
          }
        : {
            from: validatedData.fromAddress,
            to: validatedData.to,
            subject: validatedData.subject,
            text: validatedData.body,
          }

    const { data, error } = await resend.emails.send(emailData)

    if (error) {
      logger.error(`[${requestId}] Email sending failed:`, error)
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send email: ${error.message || 'Unknown error'}`,
        },
        { status: 500 }
      )
    }

    const result = {
      success: true,
      message: 'Email sent successfully via Resend',
      data,
    }

    logger.info(`[${requestId}] Email send result`, {
      success: result.success,
      message: result.message,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error sending email via API:`, error)

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while sending email',
        data: {},
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/microsoft-teams/channels/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('TeamsChannelsAPI')

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { credential, teamId, workflowId } = body

    if (!credential) {
      logger.error('Missing credential in request')
      return NextResponse.json({ error: 'Credential is required' }, { status: 400 })
    }

    if (!teamId) {
      logger.error('Missing team ID in request')
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 })
    }

    try {
      const authz = await authorizeCredentialUse(request as any, {
        credentialId: credential,
        workflowId,
      })
      if (!authz.ok || !authz.credentialOwnerUserId) {
        return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
      }
      const accessToken = await refreshAccessTokenIfNeeded(
        credential,
        authz.credentialOwnerUserId,
        'TeamsChannelsAPI'
      )

      if (!accessToken) {
        logger.error('Failed to get access token', {
          credentialId: credential,
          userId: authz.credentialOwnerUserId,
        })
        return NextResponse.json(
          {
            error: 'Could not retrieve access token',
            authRequired: true,
          },
          { status: 401 }
        )
      }

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/channels`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        logger.error('Microsoft Graph API error getting channels', {
          status: response.status,
          error: errorData,
          endpoint: `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`,
        })

        // Check for auth errors specifically
        if (response.status === 401) {
          return NextResponse.json(
            {
              error: 'Authentication failed. Please reconnect your Microsoft Teams account.',
              authRequired: true,
            },
            { status: 401 }
          )
        }

        throw new Error(`Microsoft Graph API error: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      const channels = data.value

      return NextResponse.json({
        channels: channels,
      })
    } catch (innerError) {
      logger.error('Error during API requests:', innerError)

      // Check if it's an authentication error
      const errorMessage = innerError instanceof Error ? innerError.message : String(innerError)
      if (
        errorMessage.includes('auth') ||
        errorMessage.includes('token') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('unauthenticated')
      ) {
        return NextResponse.json(
          {
            error: 'Authentication failed. Please reconnect your Microsoft Teams account.',
            authRequired: true,
            details: errorMessage,
          },
          { status: 401 }
        )
      }

      throw innerError
    }
  } catch (error) {
    logger.error('Error processing Channels request:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve Microsoft Teams channels',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/microsoft-teams/chats/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('TeamsChatsAPI')

// Helper function to get chat members and create a meaningful name
const getChatDisplayName = async (
  chatId: string,
  accessToken: string,
  chatTopic?: string
): Promise<string> => {
  try {
    // If the chat already has a topic, use it
    if (chatTopic?.trim() && chatTopic !== 'null') {
      return chatTopic
    }

    // Fetch chat members to create a meaningful name
    const membersResponse = await fetch(
      `https://graph.microsoft.com/v1.0/chats/${chatId}/members`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (membersResponse.ok) {
      const membersData = await membersResponse.json()
      const members = membersData.value || []

      // Filter out the current user and get display names
      const memberNames = members
        .filter((member: any) => member.displayName && member.displayName !== 'Unknown')
        .map((member: any) => member.displayName)
        .slice(0, 3) // Limit to first 3 names to avoid very long names

      if (memberNames.length > 0) {
        if (memberNames.length === 1) {
          return memberNames[0] // 1:1 chat
        }
        if (memberNames.length === 2) {
          return memberNames.join(' & ') // 2-person group
        }
        return `${memberNames.slice(0, 2).join(', ')} & ${memberNames.length - 2} more` // Larger group
      }
    }

    // Fallback: try to get a better name from recent messages
    try {
      const messagesResponse = await fetch(
        `https://graph.microsoft.com/v1.0/chats/${chatId}/messages?$top=10&$orderby=createdDateTime desc`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json()
        const messages = messagesData.value || []

        // Look for chat rename events
        for (const message of messages) {
          if (message.eventDetail?.chatDisplayName) {
            return message.eventDetail.chatDisplayName
          }
        }

        // Get unique sender names from recent messages as last resort
        const senderNames = [
          ...new Set(
            messages
              .filter(
                (msg: any) => msg.from?.user?.displayName && msg.from.user.displayName !== 'Unknown'
              )
              .map((msg: any) => msg.from.user.displayName)
          ),
        ].slice(0, 3)

        if (senderNames.length > 0) {
          if (senderNames.length === 1) {
            return senderNames[0] as string
          }
          if (senderNames.length === 2) {
            return senderNames.join(' & ')
          }
          return `${senderNames.slice(0, 2).join(', ')} & ${senderNames.length - 2} more`
        }
      }
    } catch (error) {
      logger.warn(
        `Failed to get better name from messages for chat ${chatId}: ${error instanceof Error ? error.message : String(error)}`
      )
    }

    // Final fallback
    return `Chat ${chatId.split(':')[0] || chatId.substring(0, 8)}...`
  } catch (error) {
    logger.warn(
      `Failed to get display name for chat ${chatId}: ${error instanceof Error ? error.message : String(error)}`
    )
    return `Chat ${chatId.split(':')[0] || chatId.substring(0, 8)}...`
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { credential, workflowId } = body

    if (!credential) {
      logger.error('Missing credential in request')
      return NextResponse.json({ error: 'Credential is required' }, { status: 400 })
    }

    try {
      const authz = await authorizeCredentialUse(request as any, {
        credentialId: credential,
        workflowId,
      })
      if (!authz.ok || !authz.credentialOwnerUserId) {
        return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
      }
      const accessToken = await refreshAccessTokenIfNeeded(
        credential,
        authz.credentialOwnerUserId,
        'TeamsChatsAPI'
      )

      if (!accessToken) {
        logger.error('Failed to get access token', {
          credentialId: credential,
          userId: authz.credentialOwnerUserId,
        })
        return NextResponse.json({ error: 'Could not retrieve access token' }, { status: 401 })
      }

      // Now try to fetch the chats
      const response = await fetch('https://graph.microsoft.com/v1.0/me/chats', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        logger.error('Microsoft Graph API error getting chats', {
          status: response.status,
          error: errorData,
          endpoint: 'https://graph.microsoft.com/v1.0/me/chats',
        })

        // Check for auth errors specifically
        if (response.status === 401) {
          return NextResponse.json(
            {
              error: 'Authentication failed. Please reconnect your Microsoft Teams account.',
              authRequired: true,
            },
            { status: 401 }
          )
        }

        throw new Error(`Microsoft Graph API error: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()

      // Process chats with enhanced display names
      const chats = await Promise.all(
        data.value.map(async (chat: any) => ({
          id: chat.id,
          displayName: await getChatDisplayName(chat.id, accessToken, chat.topic),
        }))
      )

      return NextResponse.json({
        chats: chats,
      })
    } catch (innerError) {
      logger.error('Error during API requests:', innerError)

      // Check if it's an authentication error
      const errorMessage = innerError instanceof Error ? innerError.message : String(innerError)
      if (
        errorMessage.includes('auth') ||
        errorMessage.includes('token') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('unauthenticated')
      ) {
        return NextResponse.json(
          {
            error: 'Authentication failed. Please reconnect your Microsoft Teams account.',
            authRequired: true,
            details: errorMessage,
          },
          { status: 401 }
        )
      }

      throw innerError
    }
  } catch (error) {
    logger.error('Error processing Chats request:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve Microsoft Teams chats',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/microsoft-teams/teams/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('TeamsTeamsAPI')

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { credential, workflowId } = body

    if (!credential) {
      logger.error('Missing credential in request')
      return NextResponse.json({ error: 'Credential is required' }, { status: 400 })
    }

    try {
      const requestId = generateRequestId()
      const authz = await authorizeCredentialUse(request as any, {
        credentialId: credential,
        workflowId,
      })
      if (!authz.ok || !authz.credentialOwnerUserId) {
        return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
      }

      const accessToken = await refreshAccessTokenIfNeeded(
        credential,
        authz.credentialOwnerUserId,
        'TeamsTeamsAPI'
      )

      if (!accessToken) {
        logger.error('Failed to get access token', {
          credentialId: credential,
          userId: authz.credentialOwnerUserId,
        })
        return NextResponse.json(
          {
            error: 'Could not retrieve access token',
            authRequired: true,
          },
          { status: 401 }
        )
      }

      const response = await fetch('https://graph.microsoft.com/v1.0/me/joinedTeams', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        logger.error('Microsoft Graph API error getting teams', {
          status: response.status,
          error: errorData,
          endpoint: 'https://graph.microsoft.com/v1.0/me/joinedTeams',
        })

        // Check for auth errors specifically
        if (response.status === 401) {
          return NextResponse.json(
            {
              error: 'Authentication failed. Please reconnect your Microsoft Teams account.',
              authRequired: true,
            },
            { status: 401 }
          )
        }

        throw new Error(`Microsoft Graph API error: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      const teams = data.value

      return NextResponse.json({
        teams: teams,
      })
    } catch (innerError) {
      logger.error('Error during API requests:', innerError)

      // Check if it's an authentication error
      const errorMessage = innerError instanceof Error ? innerError.message : String(innerError)
      if (
        errorMessage.includes('auth') ||
        errorMessage.includes('token') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('unauthenticated')
      ) {
        return NextResponse.json(
          {
            error: 'Authentication failed. Please reconnect your Microsoft Teams account.',
            authRequired: true,
            details: errorMessage,
          },
          { status: 401 }
        )
      }

      throw innerError
    }
  } catch (error) {
    logger.error('Error processing Teams request:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve Microsoft Teams teams',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
