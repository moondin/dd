# FULLSTACK WEBSITE TYPES - PART 04: CONTENT & MEDIA PLATFORMS

**Category:** Content & Media  
**Total Types:** 8  
**Complexity:** Medium to Very High  
**Database References:** PART5, PART14-19 (OpenCut), ShareX (650 parts), SIM (933 parts)

---

## 📋 WEBSITE TYPES

1. **Blog/CMS Platform** - WordPress-like content management
2. **Video Streaming Platform** - YouTube-like with transcoding
3. **Podcast Hosting Platform** - RSS feeds, analytics, distribution
4. **Web-based Video Editor** - OpenCut-style browser editor
5. **Photo Gallery/Portfolio** - Photographer showcase
6. **Music Streaming Service** - Spotify-like player
7. **Document Collaboration** - Google Docs-like real-time editing
8. **Screen Recording/Sharing** - Loom-like recording

---

## 1. BLOG/CMS PLATFORM

### Tech Stack
- **Framework:** Next.js 14+ + TypeScript
- **Database:** PostgreSQL + Drizzle
- **Editor:** TipTap or Novel
- **Search:** PostgreSQL full-text or Algolia
- **Build Time:** 4-6 weeks

### Schema
```typescript
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  status: text("status").default("draft"), // draft, published, scheduled
  publishedAt: timestamp("published_at"),
  viewCount: integer("view_count").default(0),
  seo: json("seo").$type<{title: string, description: string, keywords: string[]}>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
})

export const postCategories = pgTable("post_categories", {
  postId: uuid("post_id").references(() => posts.id).notNull(),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
})
```

**DB Parts:** PART1, PART2, PART7

---

## 2. VIDEO STREAMING PLATFORM

### Tech Stack
- **Framework:** Next.js + Node.js
- **Storage:** S3 + CloudFront CDN
- **Transcoding:** AWS MediaConvert or FFmpeg
- **Player:** Video.js or Plyr
- **Build Time:** 12-16 weeks

### Schema
```typescript
export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  uploaderId: uuid("uploader_id").references(() => users.id).notNull(),
  
  // Video files
  sourceUrl: text("source_url"), // Original upload
  manifestUrl: text("manifest_url"), // HLS/DASH manifest
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // seconds
  
  // Status
  status: text("status").default("processing"), // processing, ready, failed
  visibility: text("visibility").default("public"), // public, unlisted, private
  
  // Engagement
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const videoTranscodes = pgTable("video_transcodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: uuid("video_id").references(() => videos.id).notNull(),
  quality: text("quality").notNull(), // 1080p, 720p, 480p, 360p
  url: text("url").notNull(),
  fileSize: integer("file_size"),
  bitrate: integer("bitrate"),
})
```

**DB Parts:** PART5 (uploads), PART2, SIM samples (933 parts for media management)

---

## 4. WEB-BASED VIDEO EDITOR (OpenCut)

### Tech Stack (from PART14-19)
- **Framework:** Next.js 15 + TypeScript
- **State:** Zustand (PART17)
- **Storage:** IndexedDB + OPFS (PART18)
- **Rendering:** FFmpeg.wasm (PART19)
- **Transcription:** Whisper AI (PART16)
- **Build Time:** 16-24 weeks

### Project Structure (from OpenCut)
```
video-editor/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── stores/          # Zustand stores
│   │   │   │   ├── timeline.ts
│   │   │   │   ├── media.ts
│   │   │   │   ├── playback.ts
│   │   │   │   └── project.ts
│   │   │   ├── lib/
│   │   │   │   ├── rendering/   # Export pipeline
│   │   │   │   ├── storage/     # IDB + OPFS
│   │   │   │   └── editor/
│   │   │   └── components/
│   │   │       ├── timeline/
│   │   │       ├── preview/
│   │   │       └── effects/
│   └── transcription/       # Python microservice
│       └── main.py           # Modal + Whisper
├── packages/
│   ├── db/
│   └── auth/
└── docker-compose.yml
```

### Core Stores (PART17)
```typescript
// stores/timeline.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimelineStore {
  tracks: Track[]
  selectedClipIds: string[]
  playheadPosition: number
  zoom: number
  addClip: (clip: Clip) => void
  removeClip: (clipId: string) => void
  updateClip: (clipId: string, updates: Partial<Clip>) => void
}

export const useTimeline = create<TimelineStore>()(persist(
  (set) => ({
    tracks: [],
    selectedClipIds: [],
    playheadPosition: 0,
    zoom: 1,
    addClip: (clip) => set((state) => ({
      tracks: addClipToTrack(state.tracks, clip)
    })),
    // ... more actions
  }),
  { name: 'timeline-storage' }
))
```

**DB Parts:** PART14-19 (Complete OpenCut implementation), PART17 (Zustand), PART18 (Storage)

---

## 8. SCREEN RECORDING/SHARING

### Tech Stack
- **Framework:** Electron + React or Web API
- **Recording:** MediaRecorder API / Electron desktopCapturer
- **Upload:** S3 with presigned URLs
- **Build Time:** 8-12 weeks

### Recording Implementation
```typescript
// lib/recorder.ts
export class ScreenRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private chunks: Blob[] = []

  async start() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: 'screen' },
      audio: true
    })

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    })

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data)
      }
    }

    this.mediaRecorder.start(1000) // Chunk every second
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'video/webm' })
        resolve(blob)
      }
      this.mediaRecorder!.stop()
    })
  }
}
```

**DB Parts:** ShareX samples (650 parts), PART5 (uploads)

---

**Quick Reference:**
- Blog/CMS: 4-6 weeks (PART1, PART2, PART7)
- Video Platform: 12-16 weeks (PART5, SIM samples)
- Video Editor: 16-24 weeks (PART14-19)
- Screen Recorder: 8-12 weeks (ShareX samples, PART5)

---

**Next:** [PART 05 - Developer & Technical Tools →](FULLSTACK_WEBSITE_TYPES_PART05_DEVELOPER_TOOLS.md)