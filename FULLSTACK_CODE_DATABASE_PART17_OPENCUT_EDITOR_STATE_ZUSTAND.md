---
source_txt: FULLSTACK_CODE_DATABASE_PART17_OPENCUT_EDITOR_STATE_ZUSTAND.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART17 OPENCUT EDITOR STATE ZUSTAND

## Verbatim Content

````text
FULLSTACK CODE DATABASE — PART 17 (OPENCUT)
EDITOR STATE / ZUSTAND ARCHITECTURE (OFFLINE-FIRST EDITOR)

SOURCE APP
- OpenCut monorepo: apps/web (Next.js)
- Key files referenced:
  - apps/web/src/stores/timeline-store.ts
  - apps/web/src/stores/media-store.ts
  - apps/web/src/stores/project-store.ts
  - apps/web/src/stores/playback-store.ts
  - apps/web/src/stores/keybindings-store.ts
  - apps/web/src/constants/actions.ts (typed action map + emitter system, extracted earlier)

GOAL / REUSABLE TAKEAWAY
This is a practical “desktop-app style” state architecture for a browser-based video editor:
- Split state by domain store (project / media / timeline / playback / keybindings).
- Use "fast UI, slow persistence": update UI synchronously, persist in background.
- Cascade operations across stores via `store.getState()` (no React hooks needed).
- Keep timeline changes reversible (history/redo stacks) while still autosaving in background.


1) DOMAIN STORES (WHAT LIVES WHERE)

A) `useProjectStore` — project lifecycle + multi-scene + metadata
- Responsibilities:
  - Create/duplicate/rename/delete projects
  - Track `activeProject`, `savedProjects` list
  - Maintain settings: fps, canvasSize, canvasMode, background type/color, blur intensity
  - Bookmark feature: frame-snapped bookmarks
  - Store initialization & invalid id tracking
- Cross-store coordination:
  - On create/load: clears media + timeline + scenes to avoid flicker and stale state.

Pattern: “Store-Orchestrated Load Pipeline”
- Clear dependent stores first
- Load project from persistence
- Initialize scene store from project data
- Then parallel-load timeline + media

Representative excerpt (simplified):
```ts
loadProject: async (id) => {
  mediaStore.clearAllMedia();
  timelineStore.clearTimeline();
  sceneStore.clearScenes();

  const project = await storageService.loadProject({ id });
  set({ activeProject: project });

  sceneStore.initializeScenes({ scenes: project.scenes, currentSceneId: project.currentSceneId });

  await Promise.all([
    mediaStore.loadProjectMedia(id),
    timelineStore.loadProjectTimeline({ projectId: id, sceneId: currentScene?.id }),
  ]);
}
```

B) `useMediaStore` — media catalog + file typing/metadata + cascade deletion
- Responsibilities:
  - Keep `mediaFiles` array for the current project
  - Add/remove/load/clear media
  - Generate thumbnails and dimensions
  - Clean up object URLs; clear video cache
- Important UX pattern: optimistic update then persist
  - Add to UI immediately
  - Persist to storage
  - Rollback if persistence fails

Representative excerpt (simplified):
```ts
addMediaFile: async (projectId, file) => {
  const newItem = { ...file, id: generateUUID() };
  set(s => ({ mediaFiles: [...s.mediaFiles, newItem] }));
  try {
    await storageService.saveMediaFile({ projectId, mediaItem: newItem });
  } catch {
    set(s => ({ mediaFiles: s.mediaFiles.filter(m => m.id !== newItem.id) }));
  }
}
```

Cascade delete pattern (media → timeline):
- Removing a media asset should remove all timeline elements referencing it.
- Flow:
  1) Remove from media store state.
  2) Find all timeline elements that reference this mediaId.
  3) Select them + use timeline’s unified delete.
  4) Delete from persistent storage.

C) `useTimelineStore` — the editor’s “source of truth” (tracks/elements)
Key design choices:
- Keeps `_tracks` (internal) + computed `tracks` (sorted + ensures main track)
- Adds a “main track always exists” invariant via `ensureMainTrack()`
- Maintains `history` and `redoStack` for undo/redo
- Implements selection model: `selectedElements: {trackId, elementId}[]`
- Implements clipboard: copy elements without ids, paste with relative offsets
- Implements ripple editing as a mode that swaps deletion/movement logic
- Autosaves timeline to IndexedDB on updates (scene-aware) using a small delay

Autosave pattern (debounced-ish):
```ts
const autoSaveTimeline = async () => {
  const activeProject = useProjectStore.getState().activeProject;
  const currentScene = useSceneStore.getState().currentScene;
  if (activeProject && currentScene) {
    await storageService.saveTimeline({ projectId: activeProject.id, tracks: get()._tracks, sceneId: currentScene.id });
  }
};
const updateTracksAndSave = (newTracks) => {
  updateTracks(newTracks);
  setTimeout(autoSaveTimeline, 100);
};
```

Undo/redo snapshot approach:
- Uses deep clone via `JSON.parse(JSON.stringify(_tracks))` to store immutable history snapshots.
- Clears redo stack whenever a new change is pushed.

Unified selection-aware actions:
- `deleteSelected(trackId?, elementId?)`: operates on explicit arg OR selection array
- `splitSelected(splitTime, trackId?, elementId?)`: validates splitTime inside each element’s effective window
- `toggleSelectedHidden`, `toggleSelectedMuted`: batch operations across selection

Clipboard design:
- Copy saves creation-friendly element shapes (strip id)
- Paste:
  - anchors at min start time
  - preserves relative offsets
  - nudges forward by 0.01s until no overlap (safety loop)

D) `usePlaybackStore` — playback engine (timer + event bus)
- Uses `requestAnimationFrame` for smooth time updates.
- Avoids relying on a fixed timeline duration by clamping to actual content end:
  - reads `useTimelineStore.getState().getTotalDuration()`
  - stops 1 frame before end (fps-aware)
- Broadcasts playback to video elements via DOM events:
  - `playback-update`, `playback-seek`, `playback-speed`

This is a good reusable approach when media elements are decoupled from state:
- state store updates time
- view layer listens to events and syncs media elements

E) `useKeybindingsStore` — persisted shortcut mapping
- Uses Zustand `persist()` to store user customization in local storage
- Provides:
  - default mapping (`space`, `j/k/l`, arrows, ctrl+z, ctrl+shift+z, delete, etc.)
  - `validateKeybinding()` conflict check
  - `getKeybindingString(ev)` which:
    - normalizes keys (space/arrows/home/end/delete/backspace)
    - uses physical digits for AZERTY support (`ev.code`)
    - blocks non-modifier keys while typing in inputs


2) REUSABLE EDITOR PATTERNS (COPY/PASTE READY)

Pattern: “Optimistic UI + background persistence + rollback”
- Use when local persistence can fail and you want responsive UI.

Pattern: “Cascade delete across domain stores”
- Media store removes timeline elements referencing removed asset.
- Prevents orphaned references.

Pattern: “Scene-aware timeline persistence”
- Save timelines per project + per scene.
- Avoids collisions and enables multi-scene projects.

Pattern: “Selection-first command design”
- Implement a command once (delete/split/mute/hide), then drive it from either:
  - explicit target (context menu)
  - or selection array (keyboard shortcut)

Pattern: “Playback via requestAnimationFrame + DOM events”
- Cleanly decouples playback time from actual DOM media elements.


3) IMPLEMENTATION NOTES / CAVEATS
- `JSON.parse(JSON.stringify())` for history snapshots is simple, but:
  - strips functions / special types
  - can be memory-heavy for large timelines
  - still fine as a reusable baseline pattern
- Autosave uses `setTimeout(100)` rather than real debouncing; good enough, but can be tuned.
- Cross-store calls via `.getState()` are pragmatic but can create implicit coupling.


4) QUICK INDEX (WHERE TO LOOK)
- Timeline core state/actions: apps/web/src/stores/timeline-store.ts
- Media ingestion + thumbnailing + cascade delete: apps/web/src/stores/media-store.ts
- Project lifecycle + orchestration: apps/web/src/stores/project-store.ts
- Playback loop + events: apps/web/src/stores/playback-store.ts
- Persisted keyboard shortcuts: apps/web/src/stores/keybindings-store.ts

END PART 17

````
