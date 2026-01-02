---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 95
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 95 of 933)

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

---[FILE: twilio_voice.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/twilio_voice.mdx

```text
---
title: Twilio Voice
description: Make and manage phone calls
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_voice"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio Voice](https://www.twilio.com/en-us/voice) is a powerful cloud communications platform that enables businesses to make, receive, and manage phone calls programmatically through a simple API.

Twilio Voice provides a robust API for building sophisticated voice applications with global reach. With coverage in over 100 countries, carrier-grade reliability, and a 99.95% uptime SLA, Twilio has established itself as the industry leader in programmable voice communications.

Key features of Twilio Voice include:

- **Global Voice Network**: Make and receive calls worldwide with local phone numbers in multiple countries
- **Programmable Call Control**: Use TwiML to control call flow, record conversations, gather DTMF input, and implement IVR systems
- **Advanced Capabilities**: Speech recognition, text-to-speech, call forwarding, conferencing, and answering machine detection
- **Real-time Analytics**: Track call quality, duration, costs, and optimize your voice applications

In Sim, the Twilio Voice integration enables your agents to leverage these powerful voice capabilities as part of their workflows. This creates opportunities for sophisticated customer engagement scenarios like appointment reminders, verification calls, automated support lines, and interactive voice response systems. The integration bridges the gap between your AI workflows and voice communication channels, enabling your agents to deliver timely, relevant information directly through phone calls. By connecting Sim with Twilio Voice, you can create intelligent agents that engage customers through their preferred communication channel, enhancing the user experience while automating routine calling tasks.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Twilio Voice into the workflow. Make outbound calls and retrieve call recordings.



## Tools

### `twilio_voice_make_call`

Make an outbound phone call using Twilio Voice API.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `to` | string | Yes | Phone number to call \(E.164 format, e.g., +14155551234\) |
| `from` | string | Yes | Your Twilio phone number to call from \(E.164 format\) |
| `url` | string | No | URL that returns TwiML instructions for the call |
| `twiml` | string | No | TwiML instructions to execute \(alternative to URL\). Use square brackets instead of angle brackets, e.g., \[Response\]\[Say\]Hello\[/Say\]\[/Response\] |
| `statusCallback` | string | No | Webhook URL for call status updates |
| `statusCallbackMethod` | string | No | HTTP method for status callback \(GET or POST\) |
| `accountSid` | string | Yes | Twilio Account SID |
| `authToken` | string | Yes | Twilio Auth Token |
| `record` | boolean | No | Whether to record the call |
| `recordingStatusCallback` | string | No | Webhook URL for recording status updates |
| `timeout` | number | No | Time to wait for answer before giving up \(seconds, default: 60\) |
| `machineDetection` | string | No | Answering machine detection: Enable or DetectMessageEnd |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the call was successfully initiated |
| `callSid` | string | Unique identifier for the call |
| `status` | string | Call status \(queued, ringing, in-progress, completed, etc.\) |
| `direction` | string | Call direction \(outbound-api\) |
| `from` | string | Phone number the call is from |
| `to` | string | Phone number the call is to |
| `duration` | number | Call duration in seconds |
| `price` | string | Cost of the call |
| `priceUnit` | string | Currency of the price |
| `error` | string | Error message if call failed |

### `twilio_voice_list_calls`

Retrieve a list of calls made to and from an account.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `accountSid` | string | Yes | Twilio Account SID |
| `authToken` | string | Yes | Twilio Auth Token |
| `to` | string | No | Filter by calls to this phone number |
| `from` | string | No | Filter by calls from this phone number |
| `status` | string | No | Filter by call status \(queued, ringing, in-progress, completed, etc.\) |
| `startTimeAfter` | string | No | Filter calls that started on or after this date \(YYYY-MM-DD\) |
| `startTimeBefore` | string | No | Filter calls that started on or before this date \(YYYY-MM-DD\) |
| `pageSize` | number | No | Number of records to return \(max 1000, default 50\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the calls were successfully retrieved |
| `calls` | array | Array of call objects |
| `total` | number | Total number of calls returned |
| `page` | number | Current page number |
| `pageSize` | number | Number of calls per page |
| `error` | string | Error message if retrieval failed |

### `twilio_voice_get_recording`

Retrieve call recording information and transcription (if enabled via TwiML).

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `recordingSid` | string | Yes | Recording SID to retrieve |
| `accountSid` | string | Yes | Twilio Account SID |
| `authToken` | string | Yes | Twilio Auth Token |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the recording was successfully retrieved |
| `recordingSid` | string | Unique identifier for the recording |
| `callSid` | string | Call SID this recording belongs to |
| `duration` | number | Duration of the recording in seconds |
| `status` | string | Recording status \(completed, processing, etc.\) |
| `channels` | number | Number of channels \(1 for mono, 2 for dual\) |
| `source` | string | How the recording was created |
| `mediaUrl` | string | URL to download the recording media file |
| `price` | string | Cost of the recording |
| `priceUnit` | string | Currency of the price |
| `uri` | string | Relative URI of the recording resource |
| `transcriptionText` | string | Transcribed text from the recording \(if available\) |
| `transcriptionStatus` | string | Transcription status \(completed, in-progress, failed\) |
| `transcriptionPrice` | string | Cost of the transcription |
| `transcriptionPriceUnit` | string | Currency of the transcription price |
| `error` | string | Error message if retrieval failed |



## Notes

- Category: `tools`
- Type: `twilio_voice`
```

--------------------------------------------------------------------------------

---[FILE: typeform.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/typeform.mdx

```text
---
title: Typeform
description: Interact with Typeform
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="typeform"
  color="#262627"
/>

{/* MANUAL-CONTENT-START:intro */}
[Typeform](https://www.typeform.com/) is a user-friendly platform for creating conversational forms, surveys, and quizzes with a focus on engaging user experience.

With Typeform, you can:

- **Create interactive forms**: Design beautiful, conversational forms that engage respondents with a unique one-question-at-a-time interface
- **Customize your experience**: Use conditional logic, hidden fields, and custom themes to create personalized user journeys
- **Integrate with other tools**: Connect with 1000+ apps through native integrations and APIs
- **Analyze response data**: Get actionable insights through comprehensive analytics and reporting tools

In Sim, the Typeform integration enables your agents to programmatically interact with your Typeform data as part of their workflows. Agents can retrieve form responses, process submission data, and incorporate user feedback directly into decision-making processes. This integration is particularly valuable for scenarios like lead qualification, customer feedback analysis, and data-driven personalization. By connecting Sim with Typeform, you can create intelligent automation workflows that transform form responses into actionable insights - analyzing sentiment, categorizing feedback, generating summaries, and even triggering follow-up actions based on specific response patterns.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Typeform into the workflow. Can retrieve responses, download files, and get form insights. Can be used in trigger mode to trigger a workflow when a form is submitted. Requires API Key.



## Tools

### `typeform_responses`

Retrieve form responses from Typeform

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `formId` | string | Yes | Typeform form ID |
| `apiKey` | string | Yes | Typeform Personal Access Token |
| `pageSize` | number | No | Number of responses to retrieve \(default: 25\) |
| `since` | string | No | Retrieve responses submitted after this date \(ISO 8601 format\) |
| `until` | string | No | Retrieve responses submitted before this date \(ISO 8601 format\) |
| `completed` | string | No | Filter by completion status \(true/false\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `total_items` | number | Total number of responses |
| `page_count` | number | Total number of pages available |
| `items` | array | Array of response objects with response_id, submitted_at, answers, and metadata |

### `typeform_files`

Download files uploaded in Typeform responses

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `formId` | string | Yes | Typeform form ID |
| `responseId` | string | Yes | Response ID containing the files |
| `fieldId` | string | Yes | Unique ID of the file upload field |
| `filename` | string | Yes | Filename of the uploaded file |
| `inline` | boolean | No | Whether to request the file with inline Content-Disposition |
| `apiKey` | string | Yes | Typeform Personal Access Token |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `fileUrl` | string | Direct download URL for the uploaded file |
| `contentType` | string | MIME type of the uploaded file |
| `filename` | string | Original filename of the uploaded file |

### `typeform_insights`

Retrieve insights and analytics for Typeform forms

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `formId` | string | Yes | Typeform form ID |
| `apiKey` | string | Yes | Typeform Personal Access Token |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `fields` | array | Number of users who dropped off at this field |

### `typeform_list_forms`

Retrieve a list of all forms in your Typeform account

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Typeform Personal Access Token |
| `search` | string | No | Search query to filter forms by title |
| `page` | number | No | Page number \(default: 1\) |
| `pageSize` | number | No | Number of forms per page \(default: 10, max: 200\) |
| `workspaceId` | string | No | Filter forms by workspace ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `total_items` | number | Total number of forms in the account |
| `page_count` | number | Total number of pages available |
| `items` | array | Array of form objects with id, title, created_at, last_updated_at, settings, theme, and _links |

### `typeform_get_form`

Retrieve complete details and structure of a specific form

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Typeform Personal Access Token |
| `formId` | string | Yes | Form unique identifier |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | Form unique identifier |
| `title` | string | Form title |
| `type` | string | Form type \(form, quiz, etc.\) |
| `settings` | object | Form settings including language, progress bar, etc. |
| `theme` | object | Theme reference |
| `workspace` | object | Workspace reference |
| `fields` | array | Array of form fields/questions |
| `welcome_screens` | array | Array of welcome screens |
| `thankyou_screens` | array | Array of thank you screens |
| `_links` | object | Related resource links including public form URL |

### `typeform_create_form`

Create a new form with fields and settings

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Typeform Personal Access Token |
| `title` | string | Yes | Form title |
| `type` | string | No | Form type \(default: "form"\). Options: "form", "quiz" |
| `workspaceId` | string | No | Workspace ID to create the form in |
| `fields` | json | No | Array of field objects defining the form structure. Each field needs: type, title, and optional properties/validations |
| `settings` | json | No | Form settings object \(language, progress_bar, etc.\) |
| `themeId` | string | No | Theme ID to apply to the form |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | Created form unique identifier |
| `title` | string | Form title |
| `type` | string | Form type |
| `fields` | array | Array of created form fields |
| `_links` | object | Related resource links including public form URL |

### `typeform_update_form`

Update an existing form using JSON Patch operations

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Typeform Personal Access Token |
| `formId` | string | Yes | Form unique identifier to update |
| `operations` | json | Yes | Array of JSON Patch operations \(RFC 6902\). Each operation needs: op \(add/remove/replace\), path, and value \(for add/replace\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | Updated form unique identifier |
| `title` | string | Form title |
| `type` | string | Form type |
| `settings` | object | Form settings |
| `theme` | object | Theme reference |
| `workspace` | object | Workspace reference |
| `fields` | array | Array of form fields |
| `welcome_screens` | array | Array of welcome screens |
| `thankyou_screens` | array | Array of thank you screens |
| `_links` | object | Related resource links |

### `typeform_delete_form`

Permanently delete a form and all its responses

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Typeform Personal Access Token |
| `formId` | string | Yes | Form unique identifier to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Whether the form was successfully deleted |
| `message` | string | Deletion confirmation message |



## Notes

- Category: `tools`
- Type: `typeform`
```

--------------------------------------------------------------------------------

---[FILE: video_generator.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/video_generator.mdx

```text
---
title: Video Generator
description: Generate videos from text using AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="video_generator"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Create videos from text prompts using cutting-edge AI models from top providers. Sim's Video Generator brings powerful, creative video synthesis capabilities to your workflow—supporting diverse models, aspect ratios, resolutions, camera controls, native audio, and advanced style and consistency features.

**Supported Providers & Models:**

- **[Runway Gen-4](https://research.runwayml.com/gen2/)** (Runway ML):  
  Runway is a pioneer in text-to-video generation, known for powerful models like Gen-2, Gen-3, and Gen-4. The latest [Gen-4](https://research.runwayml.com/gen2/) model (and Gen-4 Turbo for faster results) supports more realistic motion, greater world consistency, and visual references for character, object, style, and location. Supports 16:9, 9:16, and 1:1 aspect ratios, 5–10 second durations, up to 4K resolution, style presets, and direct upload of reference images for consistent generations. Runway powers creative tools for filmmakers, studios, and content creators worldwide.

- **[Google Veo](https://deepmind.google/technologies/veo/)** (Google DeepMind):  
  [Veo](https://deepmind.google/technologies/veo/) is Google’s next-generation video generation model, offering high-quality, native-audio videos up to 1080p and 16 seconds. Supports advanced motion, cinematic effects, and nuanced text understanding. Veo can generate videos with built-in sound—activating native audio as well as silent clips. Options include 16:9 aspect, variable duration, different models (veo-3, veo-3.1), and prompt-based controls. Ideal for storytelling, advertising, research, and ideation.

- **[Luma Dream Machine](https://lumalabs.ai/dream-machine)** (Luma AI):  
  [Dream Machine](https://lumalabs.ai/dream-machine) delivers jaw-droppingly realistic and fluid video from text. It incorporates advanced camera control, cinematography prompts, and supports both ray-1 and ray-2 models. Dream Machine supports precise aspect ratios (16:9, 9:16, 1:1), variable durations, and the specification of camera paths for intricate visual direction. Luma is renowned for breakthrough visual fidelity and is backed by leading AI vision researchers.

- **[MiniMax Hailuo-02](https://minimax.chat/)** (via [Fal.ai](https://fal.ai/)):  
  [MiniMax Hailuo-02](https://minimax.chat/) is a sophisticated Chinese generative video model, available globally through [Fal.ai](https://fal.ai/). Generate videos up to 16 seconds in landscape or portrait format, with options for prompt optimization to improve clarity and creativity. Pro and standard endpoints available, supporting high resolutions (up to 1920×1080). Well-suited for creative projects needing prompt translation and optimization, commercial storytelling, and rapid prototyping of visual ideas.

**How to Choose:**  
Pick your provider and model based on your needs for quality, speed, duration, audio, cost, and unique features. Runway and Veo offer world-leading realism and cinematic capabilities; Luma excels in fluid motion and camera control; MiniMax is ideal for Chinese-language prompts and offers fast, affordable access. Consider reference support, style presets, audio requirements, and pricing when selecting your tool.

For more details on features, restrictions, pricing, and model advances, see each provider’s official documentation above.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Generate high-quality videos from text prompts using leading AI providers. Supports multiple models, aspect ratios, resolutions, and provider-specific features like world consistency, camera controls, and audio generation.



## Tools

### `video_runway`

Generate videos using Runway Gen-4 with world consistency and visual references

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Yes | Video provider \(runway\) |
| `apiKey` | string | Yes | Runway API key |
| `model` | string | No | Runway model: gen-4 \(default, higher quality\) or gen-4-turbo \(faster\) |
| `prompt` | string | Yes | Text prompt describing the video to generate |
| `duration` | number | No | Video duration in seconds \(5 or 10, default: 5\) |
| `aspectRatio` | string | No | Aspect ratio: 16:9 \(landscape\), 9:16 \(portrait\), or 1:1 \(square\) |
| `resolution` | string | No | Video resolution \(720p output\). Note: Gen-4 Turbo outputs at 720p natively |
| `visualReference` | json | Yes | Reference image REQUIRED for Gen-4 \(UserFile object\). Gen-4 only supports image-to-video, not text-only generation |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `videoUrl` | string | Generated video URL |
| `videoFile` | json | Video file object with metadata |
| `duration` | number | Video duration in seconds |
| `width` | number | Video width in pixels |
| `height` | number | Video height in pixels |
| `provider` | string | Provider used \(runway\) |
| `model` | string | Model used |
| `jobId` | string | Runway job ID |

### `video_veo`

Generate videos using Google Veo 3/3.1 with native audio generation

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Yes | Video provider \(veo\) |
| `apiKey` | string | Yes | Google Gemini API key |
| `model` | string | No | Veo model: veo-3 \(default, highest quality\), veo-3-fast \(faster\), or veo-3.1 \(latest\) |
| `prompt` | string | Yes | Text prompt describing the video to generate |
| `duration` | number | No | Video duration in seconds \(4, 6, or 8, default: 8\) |
| `aspectRatio` | string | No | Aspect ratio: 16:9 \(landscape\) or 9:16 \(portrait\) |
| `resolution` | string | No | Video resolution: 720p or 1080p \(default: 1080p\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `videoUrl` | string | Generated video URL |
| `videoFile` | json | Video file object with metadata |
| `duration` | number | Video duration in seconds |
| `width` | number | Video width in pixels |
| `height` | number | Video height in pixels |
| `provider` | string | Provider used \(veo\) |
| `model` | string | Model used |
| `jobId` | string | Veo job ID |

### `video_luma`

Generate videos using Luma Dream Machine with advanced camera controls

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Yes | Video provider \(luma\) |
| `apiKey` | string | Yes | Luma AI API key |
| `model` | string | No | Luma model: ray-2 \(default\) |
| `prompt` | string | Yes | Text prompt describing the video to generate |
| `duration` | number | No | Video duration in seconds \(5 or 9, default: 5\) |
| `aspectRatio` | string | No | Aspect ratio: 16:9 \(landscape\), 9:16 \(portrait\), or 1:1 \(square\) |
| `resolution` | string | No | Video resolution: 540p, 720p, or 1080p \(default: 1080p\) |
| `cameraControl` | json | No | Camera controls as array of concept objects. Format: \[\{ "key": "concept_name" \}\]. Valid keys: truck_left, truck_right, pan_left, pan_right, tilt_up, tilt_down, zoom_in, zoom_out, push_in, pull_out, orbit_left, orbit_right, crane_up, crane_down, static, handheld, and 20+ more predefined options |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `videoUrl` | string | Generated video URL |
| `videoFile` | json | Video file object with metadata |
| `duration` | number | Video duration in seconds |
| `width` | number | Video width in pixels |
| `height` | number | Video height in pixels |
| `provider` | string | Provider used \(luma\) |
| `model` | string | Model used |
| `jobId` | string | Luma job ID |

### `video_minimax`

Generate videos using MiniMax Hailuo through MiniMax Platform API with advanced realism and prompt optimization

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Yes | Video provider \(minimax\) |
| `apiKey` | string | Yes | MiniMax API key from platform.minimax.io |
| `model` | string | No | MiniMax model: hailuo-02 \(default\) |
| `prompt` | string | Yes | Text prompt describing the video to generate |
| `duration` | number | No | Video duration in seconds \(6 or 10, default: 6\) |
| `promptOptimizer` | boolean | No | Enable prompt optimization for better results \(default: true\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `videoUrl` | string | Generated video URL |
| `videoFile` | json | Video file object with metadata |
| `duration` | number | Video duration in seconds |
| `width` | number | Video width in pixels |
| `height` | number | Video height in pixels |
| `provider` | string | Provider used \(minimax\) |
| `model` | string | Model used |
| `jobId` | string | MiniMax job ID |

### `video_falai`

Generate videos using Fal.ai platform with access to multiple models including Veo 3.1, Sora 2, Kling 2.5, MiniMax Hailuo, and more

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Yes | Video provider \(falai\) |
| `apiKey` | string | Yes | Fal.ai API key |
| `model` | string | Yes | Fal.ai model: veo-3.1 \(Google Veo 3.1\), sora-2 \(OpenAI Sora 2\), kling-2.5-turbo-pro \(Kling 2.5 Turbo Pro\), kling-2.1-pro \(Kling 2.1 Master\), minimax-hailuo-2.3-pro \(MiniMax Hailuo Pro\), minimax-hailuo-2.3-standard \(MiniMax Hailuo Standard\), wan-2.1 \(WAN T2V\), ltxv-0.9.8 \(LTXV 13B\) |
| `prompt` | string | Yes | Text prompt describing the video to generate |
| `duration` | number | No | Video duration in seconds \(varies by model\) |
| `aspectRatio` | string | No | Aspect ratio \(varies by model\): 16:9, 9:16, 1:1 |
| `resolution` | string | No | Video resolution \(varies by model\): 540p, 720p, 1080p |
| `promptOptimizer` | boolean | No | Enable prompt optimization for MiniMax models \(default: true\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `videoUrl` | string | Generated video URL |
| `videoFile` | json | Video file object with metadata |
| `duration` | number | Video duration in seconds |
| `width` | number | Video width in pixels |
| `height` | number | Video height in pixels |
| `provider` | string | Provider used \(falai\) |
| `model` | string | Model used |
| `jobId` | string | Job ID |



## Notes

- Category: `tools`
- Type: `video_generator`
```

--------------------------------------------------------------------------------

---[FILE: vision.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/vision.mdx

```text
---
title: Vision
description: Analyze images with vision models
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="vision"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
Vision is a tool that allows you to analyze images with vision models.

With Vision, you can:

- **Analyze images**: Analyze images with vision models
- **Extract text**: Extract text from images
- **Identify objects**: Identify objects in images
- **Describe images**: Describe images in detail
- **Generate images**: Generate images from text

In Sim, the Vision integration enables your agents to analyze images with vision models as part of their workflows. This allows for powerful automation scenarios that require analyzing images with vision models. Your agents can analyze images with vision models, extract text from images, identify objects in images, describe images in detail, and generate images from text. This integration bridges the gap between your AI workflows and your image analysis needs, enabling more sophisticated and image-centric automations. By connecting Sim with Vision, you can create agents that stay current with the latest information, provide more accurate responses, and deliver more value to users - all without requiring manual intervention or custom code.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Vision into the workflow. Can analyze images with vision models.



## Tools

### `vision_tool`

Process and analyze images using advanced vision models. Capable of understanding image content, extracting text, identifying objects, and providing detailed visual descriptions.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | API key for the selected model provider |
| `imageUrl` | string | No | Publicly accessible image URL |
| `imageFile` | file | No | Image file to analyze |
| `model` | string | No | Vision model to use \(gpt-4o, claude-3-opus-20240229, etc\) |
| `prompt` | string | No | Custom prompt for image analysis |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | The analyzed content and description of the image |
| `model` | string | The vision model that was used for analysis |
| `tokens` | number | Total tokens used for the analysis |
| `usage` | object | Detailed token usage breakdown |



## Notes

- Category: `tools`
- Type: `vision`
```

--------------------------------------------------------------------------------

---[FILE: wealthbox.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/wealthbox.mdx

```text
---
title: Wealthbox
description: Interact with Wealthbox
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wealthbox"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wealthbox](https://www.wealthbox.com/) is a comprehensive CRM platform designed specifically for financial advisors and wealth management professionals. It provides a centralized system for managing client relationships, tracking interactions, and organizing business workflows in the financial services industry.

With Wealthbox, you can:

- **Manage client relationships**: Store detailed contact information, background data, and relationship histories for all your clients
- **Track interactions**: Create and maintain notes about meetings, calls, and other client touchpoints
- **Organize tasks**: Schedule and manage follow-up activities, deadlines, and important action items
- **Document workflows**: Keep comprehensive records of client communications and business processes
- **Access client data**: Retrieve information quickly with organized contact management and search capabilities
- **Automate follow-ups**: Set reminders and schedule tasks to ensure consistent client engagement

In Sim, the Wealthbox integration enables your agents to seamlessly interact with your CRM data through OAuth authentication. This allows for powerful automation scenarios such as automatically creating client notes from meeting transcripts, updating contact information, scheduling follow-up tasks, and retrieving client details for personalized communications. Your agents can read existing notes, contacts, and tasks to understand client history, while also creating new entries to maintain up-to-date records. This integration bridges the gap between your AI workflows and your client relationship management, enabling automated data entry, intelligent client insights, and streamlined administrative processes that free up time for more valuable client-facing activities.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Wealthbox into the workflow. Can read and write notes, read and write contacts, and read and write tasks.



## Tools

### `wealthbox_read_note`

Read content from a Wealthbox note

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `noteId` | string | No | The ID of the note to read |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Note data and metadata |

### `wealthbox_write_note`

Create or update a Wealthbox note

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `content` | string | Yes | The main body of the note |
| `contactId` | string | No | ID of contact to link to this note |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Created or updated note data and metadata |

### `wealthbox_read_contact`

Read content from a Wealthbox contact

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | No | The ID of the contact to read |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Contact data and metadata |

### `wealthbox_write_contact`

Create a new Wealthbox contact

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `firstName` | string | Yes | The first name of the contact |
| `lastName` | string | Yes | The last name of the contact |
| `emailAddress` | string | No | The email address of the contact |
| `backgroundInformation` | string | No | Background information about the contact |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Created or updated contact data and metadata |

### `wealthbox_read_task`

Read content from a Wealthbox task

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | No | The ID of the task to read |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Task data and metadata |

### `wealthbox_write_task`

Create or update a Wealthbox task

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string | Yes | The name/title of the task |
| `dueDate` | string | Yes | The due date and time of the task \(format: "YYYY-MM-DD HH:MM AM/PM -HHMM", e.g., "2015-05-24 11:00 AM -0400"\) |
| `contactId` | string | No | ID of contact to link to this task |
| `description` | string | No | Description or notes about the task |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Created or updated task data and metadata |



## Notes

- Category: `tools`
- Type: `wealthbox`
```

--------------------------------------------------------------------------------

---[FILE: webflow.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/webflow.mdx

```text
---
title: Webflow
description: Manage Webflow CMS collections
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webflow"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Webflow](https://webflow.com/) is a powerful visual web design platform that enables you to build responsive websites without writing code. It combines a visual design interface with a robust CMS (Content Management System) that allows you to create, manage, and publish dynamic content for your websites.

With Webflow, you can:

- **Design visually**: Create custom websites with a visual editor that generates clean, semantic HTML/CSS code
- **Manage content dynamically**: Use the CMS to create collections of structured content like blog posts, products, team members, or any custom data
- **Publish instantly**: Deploy your sites to Webflow's hosting or export the code for custom hosting
- **Create responsive designs**: Build sites that work seamlessly across desktop, tablet, and mobile devices
- **Customize collections**: Define custom fields and data structures for your content types
- **Automate content updates**: Programmatically manage your CMS content through APIs

In Sim, the Webflow integration enables your agents to seamlessly interact with your Webflow CMS collections through API authentication. This allows for powerful automation scenarios such as automatically creating blog posts from AI-generated content, updating product information, managing team member profiles, and retrieving CMS items for dynamic content generation. Your agents can list existing items to browse your content, retrieve specific items by ID, create new entries to add fresh content, update existing items to keep information current, and delete outdated content. This integration bridges the gap between your AI workflows and your Webflow CMS, enabling automated content management, dynamic website updates, and streamlined content workflows that keep your sites fresh and up-to-date without manual intervention.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrates Webflow CMS into the workflow. Can create, get, list, update, or delete items in Webflow CMS collections. Manage your Webflow content programmatically. Can be used in trigger mode to trigger workflows when collection items change or forms are submitted.



## Tools

### `webflow_list_items`

List all items from a Webflow CMS collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | ID of the Webflow site |
| `collectionId` | string | Yes | ID of the collection |
| `offset` | number | No | Offset for pagination \(optional\) |
| `limit` | number | No | Maximum number of items to return \(optional, default: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `items` | json | Array of collection items |
| `metadata` | json | Metadata about the query |

### `webflow_get_item`

Get a single item from a Webflow CMS collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | ID of the Webflow site |
| `collectionId` | string | Yes | ID of the collection |
| `itemId` | string | Yes | ID of the item to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `item` | json | The retrieved item object |
| `metadata` | json | Metadata about the retrieved item |

### `webflow_create_item`

Create a new item in a Webflow CMS collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | ID of the Webflow site |
| `collectionId` | string | Yes | ID of the collection |
| `fieldData` | json | Yes | Field data for the new item as a JSON object. Keys should match collection field names. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `item` | json | The created item object |
| `metadata` | json | Metadata about the created item |

### `webflow_update_item`

Update an existing item in a Webflow CMS collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | ID of the Webflow site |
| `collectionId` | string | Yes | ID of the collection |
| `itemId` | string | Yes | ID of the item to update |
| `fieldData` | json | Yes | Field data to update as a JSON object. Only include fields you want to change. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `item` | json | The updated item object |
| `metadata` | json | Metadata about the updated item |

### `webflow_delete_item`

Delete an item from a Webflow CMS collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | ID of the Webflow site |
| `collectionId` | string | Yes | ID of the collection |
| `itemId` | string | Yes | ID of the item to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the deletion was successful |
| `metadata` | json | Metadata about the deletion |



## Notes

- Category: `tools`
- Type: `webflow`
```

--------------------------------------------------------------------------------

````
