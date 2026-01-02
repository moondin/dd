---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 772
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 772 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/typeform/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface TypeformFilesParams {
  formId: string
  responseId: string
  fieldId: string
  filename: string
  inline?: boolean
  apiKey: string
}

export interface TypeformFilesResponse extends ToolResponse {
  output: {
    fileUrl: string
    contentType: string
    filename: string
  }
}

export interface TypeformInsightsParams {
  formId: string
  apiKey: string
}

// This is the actual output data structure from the API
export interface TypeformInsightsData {
  fields: Array<{
    dropoffs: number
    id: string
    label: string
    ref: string
    title: string
    type: string
    views: number
  }>
  form: {
    platforms: Array<{
      average_time: number
      completion_rate: number
      platform: string
      responses_count: number
      total_visits: number
      unique_visits: number
    }>
    summary: {
      average_time: number
      completion_rate: number
      responses_count: number
      total_visits: number
      unique_visits: number
    }
  }
}

// The ToolResponse uses a union type to allow either successful data or empty object in error case
export interface TypeformInsightsResponse extends ToolResponse {
  output: TypeformInsightsData | Record<string, never>
}

export interface TypeformResponsesParams {
  formId: string
  apiKey: string
  pageSize?: number
  since?: string
  until?: string
  completed?: string
}

export interface TypeformResponsesResponse extends ToolResponse {
  output: {
    total_items: number
    page_count: number
    items: Array<{
      landing_id: string
      token: string
      landed_at: string
      submitted_at: string
      metadata: {
        user_agent: string
        platform: string
        referer: string
        network_id: string
        browser: string
      }
      answers: Array<{
        field: {
          id: string
          type: string
          ref: string
        }
        type: string
        [key: string]: any
      }>
      hidden: Record<string, any>
      calculated: {
        score: number
      }
      variables: Array<{
        key: string
        type: string
        [key: string]: any
      }>
    }>
  }
}

export interface TypeformListFormsParams {
  apiKey: string
  search?: string
  page?: number
  pageSize?: number
  workspaceId?: string
}

export interface TypeformListFormsResponse extends ToolResponse {
  output: {
    total_items: number
    page_count: number
    items: Array<{
      id: string
      title: string
      created_at: string
      last_updated_at: string
      settings: {
        is_public: boolean
        [key: string]: any
      }
      theme: {
        href: string
      }
      _links: {
        display: string
        responses: string
      }
      [key: string]: any
    }>
  }
}

export interface TypeformGetFormParams {
  apiKey: string
  formId: string
}

export interface TypeformGetFormResponse extends ToolResponse {
  output: {
    id: string
    title: string
    type: string
    created_at: string
    last_updated_at: string
    settings: Record<string, any>
    theme: Record<string, any>
    workspace: {
      href: string
    }
    fields: Array<{
      id: string
      title: string
      type: string
      ref: string
      properties?: Record<string, any>
      validations?: Record<string, any>
      [key: string]: any
    }>
    thankyou_screens?: Array<{
      id: string
      title: string
      ref: string
      properties?: Record<string, any>
      [key: string]: any
    }>
    _links: {
      display: string
      responses: string
    }
    [key: string]: any
  }
}

export interface TypeformCreateFormParams {
  apiKey: string
  title: string
  type?: string
  workspaceId?: string
  fields?: Array<Record<string, any>>
  settings?: Record<string, any>
  themeId?: string
}

export interface TypeformCreateFormResponse extends ToolResponse {
  output: {
    id: string
    title: string
    type: string
    created_at: string
    last_updated_at: string
    settings: Record<string, any>
    theme: Record<string, any>
    workspace?: {
      href: string
    }
    fields: Array<Record<string, any>>
    _links: {
      display: string
      responses: string
    }
    [key: string]: any
  }
}

export interface TypeformUpdateFormParams {
  apiKey: string
  formId: string
  operations: Array<{
    op: 'add' | 'remove' | 'replace'
    path: string
    value?: any
  }>
}

export interface TypeformUpdateFormResponse extends ToolResponse {
  output: {
    id: string
    title: string
    type: string
    created_at: string
    last_updated_at: string
    settings: Record<string, any>
    theme: Record<string, any>
    workspace?: {
      href: string
    }
    fields: Array<Record<string, any>>
    thankyou_screens?: Array<Record<string, any>>
    _links: Record<string, any>
    [key: string]: any
  }
}

export interface TypeformDeleteFormParams {
  apiKey: string
  formId: string
}

export interface TypeformDeleteFormResponse extends ToolResponse {
  output: {
    deleted: boolean
    message: string
  }
}

export interface TypeformResponse extends ToolResponse {
  output:
    | TypeformResponsesResponse['output']
    | TypeformFilesResponse['output']
    | TypeformInsightsData
}
```

--------------------------------------------------------------------------------

---[FILE: update_form.ts]---
Location: sim-main/apps/sim/tools/typeform/update_form.ts

```typescript
import type { TypeformUpdateFormParams, TypeformUpdateFormResponse } from '@/tools/typeform/types'
import type { ToolConfig } from '@/tools/types'

export const updateFormTool: ToolConfig<TypeformUpdateFormParams, TypeformUpdateFormResponse> = {
  id: 'typeform_update_form',
  name: 'Typeform Update Form',
  description: 'Update an existing form using JSON Patch operations',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform Personal Access Token',
    },
    formId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Form unique identifier to update',
    },
    operations: {
      type: 'json',
      required: true,
      visibility: 'user-only',
      description:
        'Array of JSON Patch operations (RFC 6902). Each operation needs: op (add/remove/replace), path, and value (for add/replace)',
    },
  },

  request: {
    url: (params: TypeformUpdateFormParams) => {
      return `https://api.typeform.com/forms/${params.formId}`
    },
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params: TypeformUpdateFormParams) => {
      return params.operations
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    id: {
      type: 'string',
      description: 'Updated form unique identifier',
    },
    title: {
      type: 'string',
      description: 'Form title',
    },
    type: {
      type: 'string',
      description: 'Form type',
    },
    settings: {
      type: 'object',
      description: 'Form settings',
    },
    theme: {
      type: 'object',
      description: 'Theme reference',
    },
    workspace: {
      type: 'object',
      description: 'Workspace reference',
    },
    fields: {
      type: 'array',
      description: 'Array of form fields',
    },
    welcome_screens: {
      type: 'array',
      description: 'Array of welcome screens',
    },
    thankyou_screens: {
      type: 'array',
      description: 'Array of thank you screens',
    },
    _links: {
      type: 'object',
      description: 'Related resource links',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: falai.ts]---
Location: sim-main/apps/sim/tools/video/falai.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { VideoParams, VideoResponse } from '@/tools/video/types'

export const falaiVideoTool: ToolConfig<VideoParams, VideoResponse> = {
  id: 'video_falai',
  name: 'Fal.ai Video Generation',
  description:
    'Generate videos using Fal.ai platform with access to multiple models including Veo 3.1, Sora 2, Kling 2.5, MiniMax Hailuo, and more',
  version: '1.0.0',

  params: {
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Video provider (falai)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Fal.ai API key',
    },
    model: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Fal.ai model: veo-3.1 (Google Veo 3.1), sora-2 (OpenAI Sora 2), kling-2.5-turbo-pro (Kling 2.5 Turbo Pro), kling-2.1-pro (Kling 2.1 Master), minimax-hailuo-2.3-pro (MiniMax Hailuo Pro), minimax-hailuo-2.3-standard (MiniMax Hailuo Standard), wan-2.1 (WAN T2V), ltxv-0.9.8 (LTXV 13B)',
    },
    prompt: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Text prompt describing the video to generate',
    },
    duration: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Video duration in seconds (varies by model)',
    },
    aspectRatio: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Aspect ratio (varies by model): 16:9, 9:16, 1:1',
    },
    resolution: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Video resolution (varies by model): 540p, 720p, 1080p',
    },
    promptOptimizer: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Enable prompt optimization for MiniMax models (default: true)',
    },
  },

  request: {
    url: '/api/proxy/video',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: VideoParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'falai',
      apiKey: params.apiKey,
      model: params.model,
      prompt: params.prompt,
      duration: params.duration,
      aspectRatio: params.aspectRatio,
      resolution: params.resolution,
      promptOptimizer: params.promptOptimizer !== false, // Default true for MiniMax
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Video generation failed',
        output: {
          videoUrl: '',
        },
      }
    }

    if (!data.videoUrl) {
      return {
        success: false,
        error: 'Missing videoUrl in response',
        output: {
          videoUrl: '',
        },
      }
    }

    return {
      success: true,
      output: {
        videoUrl: data.videoUrl,
        videoFile: data.videoFile,
        duration: data.duration,
        width: data.width,
        height: data.height,
        provider: 'falai',
        model: data.model,
        jobId: data.jobId,
      },
    }
  },

  outputs: {
    videoUrl: { type: 'string', description: 'Generated video URL' },
    videoFile: { type: 'json', description: 'Video file object with metadata' },
    duration: { type: 'number', description: 'Video duration in seconds' },
    width: { type: 'number', description: 'Video width in pixels' },
    height: { type: 'number', description: 'Video height in pixels' },
    provider: { type: 'string', description: 'Provider used (falai)' },
    model: { type: 'string', description: 'Model used' },
    jobId: { type: 'string', description: 'Job ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/video/index.ts

```typescript
import { falaiVideoTool } from '@/tools/video/falai'
import { lumaVideoTool } from '@/tools/video/luma'
import { minimaxVideoTool } from '@/tools/video/minimax'
import { runwayVideoTool } from '@/tools/video/runway'
import { veoVideoTool } from '@/tools/video/veo'

export { runwayVideoTool, veoVideoTool, lumaVideoTool, minimaxVideoTool, falaiVideoTool }
```

--------------------------------------------------------------------------------

---[FILE: luma.ts]---
Location: sim-main/apps/sim/tools/video/luma.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { VideoParams, VideoResponse } from '@/tools/video/types'

export const lumaVideoTool: ToolConfig<VideoParams, VideoResponse> = {
  id: 'video_luma',
  name: 'Luma Dream Machine Video',
  description: 'Generate videos using Luma Dream Machine with advanced camera controls',
  version: '1.0.0',

  params: {
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Video provider (luma)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Luma AI API key',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Luma model: ray-2 (default)',
    },
    prompt: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Text prompt describing the video to generate',
    },
    duration: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Video duration in seconds (5 or 9, default: 5)',
    },
    aspectRatio: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Aspect ratio: 16:9 (landscape), 9:16 (portrait), or 1:1 (square)',
    },
    resolution: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Video resolution: 540p, 720p, or 1080p (default: 1080p)',
    },
    cameraControl: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Camera controls as array of concept objects. Format: [{ "key": "concept_name" }]. Valid keys: truck_left, truck_right, pan_left, pan_right, tilt_up, tilt_down, zoom_in, zoom_out, push_in, pull_out, orbit_left, orbit_right, crane_up, crane_down, static, handheld, and 20+ more predefined options',
    },
  },

  request: {
    url: '/api/proxy/video',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: VideoParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'luma',
      apiKey: params.apiKey,
      model: params.model || 'ray-2',
      prompt: params.prompt,
      duration: params.duration || 5,
      aspectRatio: params.aspectRatio || '16:9',
      resolution: params.resolution || '1080p',
      cameraControl: params.cameraControl,
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Video generation failed',
        output: {
          videoUrl: '',
        },
      }
    }

    if (!data.videoUrl) {
      return {
        success: false,
        error: 'Missing videoUrl in response',
        output: {
          videoUrl: '',
        },
      }
    }

    return {
      success: true,
      output: {
        videoUrl: data.videoUrl,
        videoFile: data.videoFile,
        duration: data.duration,
        width: data.width,
        height: data.height,
        provider: 'luma',
        model: data.model,
        jobId: data.jobId,
      },
    }
  },

  outputs: {
    videoUrl: { type: 'string', description: 'Generated video URL' },
    videoFile: { type: 'json', description: 'Video file object with metadata' },
    duration: { type: 'number', description: 'Video duration in seconds' },
    width: { type: 'number', description: 'Video width in pixels' },
    height: { type: 'number', description: 'Video height in pixels' },
    provider: { type: 'string', description: 'Provider used (luma)' },
    model: { type: 'string', description: 'Model used' },
    jobId: { type: 'string', description: 'Luma job ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: minimax.ts]---
Location: sim-main/apps/sim/tools/video/minimax.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { VideoParams, VideoResponse } from '@/tools/video/types'

export const minimaxVideoTool: ToolConfig<VideoParams, VideoResponse> = {
  id: 'video_minimax',
  name: 'MiniMax Hailuo Video',
  description:
    'Generate videos using MiniMax Hailuo through MiniMax Platform API with advanced realism and prompt optimization',
  version: '1.0.0',

  params: {
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Video provider (minimax)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'MiniMax API key from platform.minimax.io',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'MiniMax model: hailuo-02 (default)',
    },
    prompt: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Text prompt describing the video to generate',
    },
    duration: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Video duration in seconds (6 or 10, default: 6)',
    },
    promptOptimizer: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Enable prompt optimization for better results (default: true)',
    },
  },

  request: {
    url: '/api/proxy/video',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: VideoParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'minimax',
      apiKey: params.apiKey,
      model: params.model || 'hailuo-02',
      prompt: params.prompt,
      duration: params.duration || 6,
      promptOptimizer: params.promptOptimizer !== false, // Default true
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Video generation failed',
        output: {
          videoUrl: '',
        },
      }
    }

    if (!data.videoUrl) {
      return {
        success: false,
        error: 'Missing videoUrl in response',
        output: {
          videoUrl: '',
        },
      }
    }

    return {
      success: true,
      output: {
        videoUrl: data.videoUrl,
        videoFile: data.videoFile,
        duration: data.duration,
        width: data.width,
        height: data.height,
        provider: 'minimax',
        model: data.model,
        jobId: data.jobId,
      },
    }
  },

  outputs: {
    videoUrl: { type: 'string', description: 'Generated video URL' },
    videoFile: { type: 'json', description: 'Video file object with metadata' },
    duration: { type: 'number', description: 'Video duration in seconds' },
    width: { type: 'number', description: 'Video width in pixels' },
    height: { type: 'number', description: 'Video height in pixels' },
    provider: { type: 'string', description: 'Provider used (minimax)' },
    model: { type: 'string', description: 'Model used' },
    jobId: { type: 'string', description: 'MiniMax job ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: runway.ts]---
Location: sim-main/apps/sim/tools/video/runway.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { VideoParams, VideoResponse } from '@/tools/video/types'

export const runwayVideoTool: ToolConfig<VideoParams, VideoResponse> = {
  id: 'video_runway',
  name: 'Runway Gen-4 Video',
  description: 'Generate videos using Runway Gen-4 with world consistency and visual references',
  version: '1.0.0',

  params: {
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Video provider (runway)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Runway API key',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Runway model: gen-4 (default, higher quality) or gen-4-turbo (faster)',
    },
    prompt: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Text prompt describing the video to generate',
    },
    duration: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Video duration in seconds (5 or 10, default: 5)',
    },
    aspectRatio: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Aspect ratio: 16:9 (landscape), 9:16 (portrait), or 1:1 (square)',
    },
    resolution: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Video resolution (720p output). Note: Gen-4 Turbo outputs at 720p natively',
    },
    visualReference: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Reference image REQUIRED for Gen-4 (UserFile object). Gen-4 only supports image-to-video, not text-only generation',
    },
  },

  request: {
    url: '/api/proxy/video',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: VideoParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'runway',
      apiKey: params.apiKey,
      model: 'gen-4-turbo', // Only gen4_turbo model is supported
      prompt: params.prompt,
      duration: params.duration || 5,
      aspectRatio: params.aspectRatio || '16:9',
      resolution: params.resolution || '720p',
      visualReference: params.visualReference,
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Video generation failed',
        output: {
          videoUrl: '',
        },
      }
    }

    if (!data.videoUrl) {
      return {
        success: false,
        error: 'Missing videoUrl in response',
        output: {
          videoUrl: '',
        },
      }
    }

    return {
      success: true,
      output: {
        videoUrl: data.videoUrl,
        videoFile: data.videoFile,
        duration: data.duration,
        width: data.width,
        height: data.height,
        provider: 'runway',
        model: data.model,
        jobId: data.jobId,
      },
    }
  },

  outputs: {
    videoUrl: { type: 'string', description: 'Generated video URL' },
    videoFile: { type: 'json', description: 'Video file object with metadata' },
    duration: { type: 'number', description: 'Video duration in seconds' },
    width: { type: 'number', description: 'Video width in pixels' },
    height: { type: 'number', description: 'Video height in pixels' },
    provider: { type: 'string', description: 'Provider used (runway)' },
    model: { type: 'string', description: 'Model used' },
    jobId: { type: 'string', description: 'Runway job ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/video/types.ts

```typescript
import type { UserFile } from '@/executor/types'
import type { ToolResponse } from '@/tools/types'

export interface VideoParams {
  provider: 'runway' | 'veo' | 'luma' | 'minimax' | 'falai'
  apiKey: string
  model?: string
  prompt: string
  duration?: number
  aspectRatio?: string
  resolution?: string
  // Provider-specific features
  visualReference?: UserFile // Runway only (required for Runway)
  cameraControl?: {
    // Luma only
    pan?: number
    zoom?: number
    tilt?: number
    truck?: number
    tracking?: boolean
  }
  endpoint?: string // MiniMax: 'pro' | 'standard'
  promptOptimizer?: boolean // MiniMax and Fal.ai MiniMax models
}

export interface VideoResponse extends ToolResponse {
  output: {
    videoUrl: string
    videoFile?: UserFile
    duration?: number
    width?: number
    height?: number
    provider?: string
    model?: string
    jobId?: string
  }
}

export interface VideoBlockResponse extends ToolResponse {
  output: {
    videoUrl: string
    videoFile?: UserFile
    duration?: number
    width?: number
    height?: number
    provider?: string
    model?: string
  }
}

export interface RunwayParams extends Omit<VideoParams, 'provider'> {
  model?: 'gen-4-turbo' // Only gen4_turbo supports image-to-video
  visualReference: UserFile // REQUIRED for Gen-4
  resolution?: '720p' // Gen-4 Turbo outputs at 720p
  duration?: 5 | 10
}

export interface VeoParams extends Omit<VideoParams, 'provider'> {
  model?: 'veo-3' | 'veo-3-fast' | 'veo-3.1'
  aspectRatio?: '16:9' | '9:16'
  resolution?: '720p' | '1080p'
  duration?: 4 | 6 | 8
}

export interface LumaParams extends Omit<VideoParams, 'provider'> {
  model?: 'ray3'
  cameraControl?: {
    pan?: number
    zoom?: number
    tilt?: number
    truck?: number
    tracking?: boolean
  }
  aspectRatio?: '16:9' | '9:16' | '1:1'
  resolution?: '540p' | '720p' | '1080p'
  duration?: 5 | 10
}

export interface MinimaxParams extends Omit<VideoParams, 'provider'> {
  model?: 'hailuo-02'
  endpoint?: 'pro' | 'standard'
  promptOptimizer?: boolean
  duration?: 6 | 10
}

export interface VideoRequestBody extends VideoParams {
  workspaceId?: string
  workflowId?: string
  executionId?: string
  userId?: string
}

export interface RunwayJobResponse {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  progress?: number
  error?: string
}

export interface VeoJobResponse {
  name: string
  done: boolean
  response?: {
    generatedVideo: {
      uri: string
      mimeType: string
    }
  }
  error?: {
    message: string
  }
}

export interface LumaJobResponse {
  id: string
  state: 'queued' | 'processing' | 'completed' | 'failed'
  video?: {
    url: string
    width: number
    height: number
    duration: number
  }
  failure_reason?: string
}

export interface MinimaxJobResponse {
  request_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  video_url?: string
  error?: string
}
```

--------------------------------------------------------------------------------

---[FILE: veo.ts]---
Location: sim-main/apps/sim/tools/video/veo.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { VideoParams, VideoResponse } from '@/tools/video/types'

export const veoVideoTool: ToolConfig<VideoParams, VideoResponse> = {
  id: 'video_veo',
  name: 'Google Veo 3 Video',
  description: 'Generate videos using Google Veo 3/3.1 with native audio generation',
  version: '1.0.0',

  params: {
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Video provider (veo)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Google Gemini API key',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Veo model: veo-3 (default, highest quality), veo-3-fast (faster), or veo-3.1 (latest)',
    },
    prompt: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Text prompt describing the video to generate',
    },
    duration: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Video duration in seconds (4, 6, or 8, default: 8)',
    },
    aspectRatio: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Aspect ratio: 16:9 (landscape) or 9:16 (portrait)',
    },
    resolution: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Video resolution: 720p or 1080p (default: 1080p)',
    },
  },

  request: {
    url: '/api/proxy/video',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: VideoParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'veo',
      apiKey: params.apiKey,
      model: params.model || 'veo-3',
      prompt: params.prompt,
      duration: params.duration || 8, // Default 8 seconds (valid: 4, 6, or 8)
      aspectRatio: params.aspectRatio || '16:9',
      resolution: params.resolution || '1080p',
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Video generation failed',
        output: {
          videoUrl: '',
        },
      }
    }

    if (!data.videoUrl) {
      return {
        success: false,
        error: 'Missing videoUrl in response',
        output: {
          videoUrl: '',
        },
      }
    }

    return {
      success: true,
      output: {
        videoUrl: data.videoUrl,
        videoFile: data.videoFile,
        duration: data.duration,
        width: data.width,
        height: data.height,
        provider: 'veo',
        model: data.model,
        jobId: data.jobId,
      },
    }
  },

  outputs: {
    videoUrl: { type: 'string', description: 'Generated video URL' },
    videoFile: { type: 'json', description: 'Video file object with metadata' },
    duration: { type: 'number', description: 'Video duration in seconds' },
    width: { type: 'number', description: 'Video width in pixels' },
    height: { type: 'number', description: 'Video height in pixels' },
    provider: { type: 'string', description: 'Provider used (veo)' },
    model: { type: 'string', description: 'Model used' },
    jobId: { type: 'string', description: 'Veo job ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/vision/index.ts

```typescript
import { visionTool } from '@/tools/vision/tool'

export { visionTool }
```

--------------------------------------------------------------------------------

---[FILE: tool.ts]---
Location: sim-main/apps/sim/tools/vision/tool.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { VisionParams, VisionResponse } from '@/tools/vision/types'

export const visionTool: ToolConfig<VisionParams, VisionResponse> = {
  id: 'vision_tool',
  name: 'Vision Tool',
  description:
    'Process and analyze images using advanced vision models. Capable of understanding image content, extracting text, identifying objects, and providing detailed visual descriptions.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'API key for the selected model provider',
    },
    imageUrl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Publicly accessible image URL',
    },
    imageFile: {
      type: 'file',
      required: false,
      visibility: 'user-only',
      description: 'Image file to analyze',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Vision model to use (gpt-4o, claude-3-opus-20240229, etc)',
    },
    prompt: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Custom prompt for image analysis',
    },
  },

  request: {
    method: 'POST',
    url: '/api/tools/vision/analyze',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      return {
        apiKey: params.apiKey,
        imageUrl: params.imageUrl || null,
        imageFile: params.imageFile || null,
        model: params.model || 'gpt-4o',
        prompt: params.prompt || null,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to analyze image')
    }
    return {
      success: true,
      output: data.output,
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'The analyzed content and description of the image',
    },
    model: {
      type: 'string',
      description: 'The vision model that was used for analysis',
      optional: true,
    },
    tokens: {
      type: 'number',
      description: 'Total tokens used for the analysis',
      optional: true,
    },
    usage: {
      type: 'object',
      description: 'Detailed token usage breakdown',
      optional: true,
      properties: {
        input_tokens: { type: 'number', description: 'Tokens used for input processing' },
        output_tokens: { type: 'number', description: 'Tokens used for response generation' },
        total_tokens: { type: 'number', description: 'Total tokens consumed' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/vision/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface VisionParams {
  apiKey: string
  imageUrl?: string
  imageFile?: any
  model?: string
  prompt?: string
}

export interface VisionResponse extends ToolResponse {
  output: {
    content: string
    model?: string
    tokens?: number
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/wealthbox/index.ts

```typescript
import { wealthboxReadContactTool } from '@/tools/wealthbox/read_contact'
import { wealthboxReadNoteTool } from '@/tools/wealthbox/read_note'
import { wealthboxReadTaskTool } from '@/tools/wealthbox/read_task'
import { wealthboxWriteContactTool } from '@/tools/wealthbox/write_contact'
import { wealthboxWriteNoteTool } from '@/tools/wealthbox/write_note'
import { wealthboxWriteTaskTool } from '@/tools/wealthbox/write_task'

export { wealthboxReadNoteTool }
export { wealthboxWriteNoteTool }
export { wealthboxReadContactTool }
export { wealthboxWriteContactTool }
export { wealthboxReadTaskTool }
export { wealthboxWriteTaskTool }
```

--------------------------------------------------------------------------------

---[FILE: read_contact.ts]---
Location: sim-main/apps/sim/tools/wealthbox/read_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { WealthboxReadParams, WealthboxReadResponse } from '@/tools/wealthbox/types'

const logger = createLogger('WealthboxReadContact')

export const wealthboxReadContactTool: ToolConfig<WealthboxReadParams, WealthboxReadResponse> = {
  id: 'wealthbox_read_contact',
  name: 'Read Wealthbox Contact',
  description: 'Read content from a Wealthbox contact',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Wealthbox API',
    },
    contactId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the contact to read',
    },
  },

  request: {
    url: (params) => {
      const contactId = params.contactId?.trim()
      let url = 'https://api.crmworkspace.com/v1/contacts'
      if (contactId) {
        url = `https://api.crmworkspace.com/v1/contacts/${contactId}`
      }
      return url
    },
    method: 'GET',
    headers: (params) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: WealthboxReadParams) => {
    const data = await response.json()

    // Format contact information into readable content
    const contact = data
    let content = `Contact: ${contact.first_name || ''} ${contact.last_name || ''}`.trim()

    if (contact.company_name) {
      content += `\nCompany: ${contact.company_name}`
    }

    if (contact.background_information) {
      content += `\nBackground: ${contact.background_information}`
    }

    if (contact.email_addresses && contact.email_addresses.length > 0) {
      content += '\nEmail Addresses:'
      contact.email_addresses.forEach((email: any) => {
        content += `\n  - ${email.address}${email.principal ? ' (Primary)' : ''} (${email.kind})`
      })
    }

    if (contact.phone_numbers && contact.phone_numbers.length > 0) {
      content += '\nPhone Numbers:'
      contact.phone_numbers.forEach((phone: any) => {
        content += `\n  - ${phone.address}${phone.extension ? ` ext. ${phone.extension}` : ''}${phone.principal ? ' (Primary)' : ''} (${phone.kind})`
      })
    }

    return {
      success: true,
      output: {
        content,
        contact,
        metadata: {
          operation: 'read_contact' as const,
          contactId: params?.contactId || contact.id?.toString() || '',
          itemType: 'contact' as const,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Contact data and metadata',
      properties: {
        content: { type: 'string', description: 'Formatted contact information' },
        contact: { type: 'object', description: 'Raw contact data from Wealthbox' },
        metadata: {
          type: 'object',
          description: 'Operation metadata',
          properties: {
            operation: { type: 'string', description: 'The operation performed' },
            contactId: { type: 'string', description: 'ID of the contact' },
            itemType: { type: 'string', description: 'Type of item (contact)' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
