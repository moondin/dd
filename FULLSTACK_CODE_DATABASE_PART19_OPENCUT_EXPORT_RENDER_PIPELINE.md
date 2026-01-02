---
source_txt: FULLSTACK_CODE_DATABASE_PART19_OPENCUT_EXPORT_RENDER_PIPELINE.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART19 OPENCUT EXPORT RENDER PIPELINE

## Verbatim Content

```text
FULLSTACK CODE DATABASE — PART 19 (OPENCUT)
EXPORT + RENDER PIPELINE (CANVAS RENDERING + MEDIA DECODE + AUDIO MIX)

SOURCE APP
- OpenCut monorepo: apps/web
- Key files referenced:
  - apps/web/src/lib/export.ts
  - apps/web/src/lib/timeline-renderer.ts
  - apps/web/src/lib/video-cache.ts
  - apps/web/src/lib/mediabunny-utils.ts

GOAL / REUSABLE TAKEAWAY
This is a pragmatic browser export pipeline for a timeline editor:
- Render frames on a canvas at $fps$ using the timeline model
- Encode video with mediabunny’s `Output + CanvasSource`
- Optionally mix audio either:
  - in pure WebAudio (simple resampling + mixing)
  - or with ffmpeg.wasm (complex trims/delays/amix filter)


1) HIGH-LEVEL EXPORT FLOW (MEDIABUNNY)

Entry point: `exportProject(options)`
- Reads stores:
  - `useTimelineStore.getState()` (tracks + duration)
  - `useMediaStore.getState()` (mediaFiles)
  - `useProjectStore.getState()` (fps, canvas size, background settings)

- Validates:
  - active project exists
  - duration > 0

- Configures mediabunny output:
  - `Output({ format: Mp4OutputFormat | WebMOutputFormat, target: BufferTarget })`
  - `CanvasSource(canvas, { codec: 'avc'|'vp9', bitrate: QUALITY_* })`
  - `output.addVideoTrack(videoSource, { frameRate: exportFps })`

- Audio (optional):
  - Builds timeline-mixed AudioBuffer
  - Adds `AudioBufferSource({ codec: 'aac'|'opus', bitrate })`
  - Adds audio track BEFORE start
  - Calls `output.start()`
  - Then `.add(audioBuffer)` and `.close()` audioSource

- Video frames:
  - For each frame index:
    - time = frameIndex / fps
    - `renderTimelineFrame({ ctx, time, tracks, mediaFiles, ...projectSettings })`
    - `await videoSource.add(time, 1/fps)`
    - progress callback, cancel checks

- Finalize:
  - `videoSource.close()`
  - `await output.finalize()`
  - return `output.target.buffer`

Reusable pattern: “Store-driven batch export”
- Grab consistent snapshot at start
- Generate deterministic output from pure renderer function


2) CANVAS RENDERER (TIMELINE → PIXELS)

`renderTimelineFrame(ctx, time, ...)`:
- Clears background
- Supports:
  - solid color background
  - CSS gradient string background via helper (`drawCssBackground`)
  - background blur mode (“cover blurred media behind”) for a modern look

Active element selection logic:
- For each element:
  - compute effective window:
    - start = element.startTime
    - end = element.startTime + (duration - trimStart - trimEnd)
  - if time within window and not hidden → render

Background blur mode:
- Picks a suitable active media element (video/image)
- Draws it scaled-to-cover with `ctx.filter = blur(Npx)`
- Ignores blur failures and continues (resilience)

Media drawing:
- Video: fetches decoded frame canvas via `videoCache.getFrameAt(mediaId, file, localTime)`
  - localTime = time - element.startTime + element.trimStart
  - draw scaled-to-contain
- Image:
  - loads HTMLImageElement and draws scaled-to-contain

Text drawing:
- Uses transform-based rendering:
  - translate to center + scaled offsets
  - rotate
  - set opacity
  - draw optional background rectangle
  - draw text with `fillText`

Reusable pattern: “Renderer as pure-ish function”
- Renderer takes timeline + media + time + canvas sizing parameters
- Can be reused for:
  - preview canvas
  - export frames
  - thumbnails


3) VIDEO DECODE + FRAME CACHE (MEDIABUNNY CANVASSINK)

`VideoCache` provides efficient “scrub + sequential playback” behavior:
- Initializes per-media decode sink lazily:
  - `Input({ source: BlobSource(file), formats: ALL_FORMATS })`
  - `videoTrack = await input.getPrimaryVideoTrack()`
  - `await videoTrack.canDecode()`
  - `sink = new CanvasSink(videoTrack, { poolSize: 3, fit: 'contain' })`

Frame retrieval strategy:
- If current cached frame covers the requested time → return it
- If we’re moving forward a little (time >= lastTime && time < lastTime + 2s):
  - iterate forward using async generator `sink.canvases(time)`
- Otherwise:
  - seek by restarting generator at target time

This yields a reusable pattern for timeline editors:
- fast sequential iteration when scrubbing forward
- robust seek fallback when jumping around
- `initPromises` map prevents duplicate sink initialization

Memory management:
- `clearVideo(mediaId)` stops iterator + deletes sink entry
- `clearAll()` clears everything


4) AUDIO MIXING OPTIONS

A) WebAudio mixer used by `export.ts`
- Collects audio-only media elements from timeline
- Decodes each audio file to AudioBuffer
- Creates output AudioBuffer length = ceil(duration * sampleRate)
- Mixes buffers into output at the correct start sample
- Applies trimming and element mute flags
- Uses simple resampling by index scaling

This is reusable as a “quick and good-enough” mixer for many editors.

B) ffmpeg.wasm mixer used by `mediabunny-utils.ts` (timeline audio extraction)
- Writes each input file into ffmpeg FS
- Builds filter graph per element:
  - `atrim=start=...:duration=...`
  - `asetpts=PTS-STARTPTS`
  - `adelay=startMs|startMs`
- Mixes with:
  - `amix=inputs=N:duration=longest:dropout_transition=2`
- Normalizes output:
  - `aresample=44100`
  - `aformat=sample_fmts=s16:channel_layouts=stereo`
- Writes WAV output

Why this is reusable:
- handles heterogeneous audio formats robustly
- respects precise trims + offsets
- easier to reason about than hand-mixing when complexity grows


5) REUSABLE TEMPLATES / CHECKLIST

Export checklist (browser):
- Decide render source: CanvasSource vs WebCodecs vs ffmpeg
- Implement deterministic renderer: (timeline, time) -> pixels
- Add frame caching for decode-heavy sources
- Add audio mixing strategy (WebAudio or ffmpeg)
- Provide cancel + progress callbacks


6) QUICK INDEX (WHERE TO LOOK)
- Export orchestrator: apps/web/src/lib/export.ts
- Frame renderer: apps/web/src/lib/timeline-renderer.ts
- Video decode cache: apps/web/src/lib/video-cache.ts
- Thumbnail + audio extraction helpers: apps/web/src/lib/mediabunny-utils.ts

END PART 19

```
