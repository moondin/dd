---
source_txt: FULLSTACK_CODE_DATABASE_PART18_OPENCUT_LOCAL_PERSISTENCE_IDB_OPFS.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART18 OPENCUT LOCAL PERSISTENCE IDB OPFS

## Verbatim Content

````text
FULLSTACK CODE DATABASE — PART 18 (OPENCUT)
LOCAL PERSISTENCE: INDEXEDDB + OPFS (OFFLINE-FIRST PROJECT STORAGE)

SOURCE APP
- OpenCut monorepo: apps/web
- Key files referenced:
  - apps/web/src/lib/storage/storage-service.ts
  - apps/web/src/lib/storage/indexeddb-adapter.ts
  - apps/web/src/lib/storage/opfs-adapter.ts
  - apps/web/src/stores/media-store.ts (URL revoke + cascade deletion)

GOAL / REUSABLE TAKEAWAY
This is a clean, reusable persistence architecture for apps that need:
- Structured data (projects, metadata, timelines) stored in IndexedDB
- Large binary blobs (media files) stored in OPFS
- Per-project isolation, easy cleanup, and browser-support checks


1) STORAGE LAYOUT

A) Structured data (IndexedDB)
- Projects DB: `video-editor-projects` / store: `projects`
- Timelines DB: `video-editor-timelines-${projectId}-${sceneId?}` / store: `timeline`
- Media metadata DB: `video-editor-media-${projectId}` / store: `media-metadata`
- Saved sounds DB: `video-editor-saved-sounds` / store: `saved-sounds`

B) Blob storage (OPFS)
- Directory per project: `media-files-${projectId}`
- Key: mediaItem.id → File content

This split is the key design idea:
- IndexedDB handles JSON-ish state + lists + fast queries
- OPFS handles large files with better performance characteristics


2) GENERIC INDEXEDDB ADAPTER (REUSABLE UTILITY)

`IndexedDBAdapter<T>` provides:
- `get(key)`
- `set(key, value)` (stored as `{ id: key, ...value }`)
- `remove(key)`
- `list()` (getAllKeys)
- `clear()`
- automatic object store creation on upgrade (`keyPath: 'id'`)

Representative excerpt:
```ts
const request = indexedDB.open(dbName, version);
request.onupgradeneeded = () => {
  if (!db.objectStoreNames.contains(storeName)) {
    db.createObjectStore(storeName, { keyPath: 'id' });
  }
};

await store.put({ id: key, ...value });
```

Reusability notes:
- This adapter is intentionally minimal. For larger apps you can layer:
  - secondary indexes
  - cursor-based pagination
  - migrations


3) OPFS ADAPTER (REUSABLE UTILITY)

`OPFSAdapter` provides:
- `get(key)` → File | null (returns null on NotFoundError)
- `set(key, file)` using `createWritable()`
- `remove(key)` ignoring NotFoundError
- `list()` via `for await (directory.keys())`
- `clear()` iterating directory entries
- `static isSupported()` check

Representative excerpt:
```ts
const opfsRoot = await navigator.storage.getDirectory();
const dir = await opfsRoot.getDirectoryHandle(directoryName, { create: true });

const fileHandle = await dir.getFileHandle(key, { create: true });
const writable = await fileHandle.createWritable();
await writable.write(file);
await writable.close();
```


4) STORAGE SERVICE (PROJECT-CENTRIC API)

`StorageService` orchestrates the adapters and owns the naming scheme.
Core patterns:

A) Per-project adapter factory
```ts
private getProjectMediaAdapters({ projectId }) {
  const mediaMetadataAdapter = new IndexedDBAdapter(`${mediaDb}-${projectId}`, 'media-metadata');
  const mediaFilesAdapter = new OPFSAdapter(`media-files-${projectId}`);
  return { mediaMetadataAdapter, mediaFilesAdapter };
}
```

B) Scene-aware timeline DB names
```ts
const dbName = sceneId
  ? `${timelineDb}-${projectId}-${sceneId}`
  : `${timelineDb}-${projectId}`;
return new IndexedDBAdapter(dbName, 'timeline');
```

C) Date serialization boundary
- Projects contain Date objects; store converts them to ISO strings.
- Load converts back to Date.

Representative excerpt:
```ts
createdAt: project.createdAt.toISOString()
...
createdAt: new Date(serializedProject.createdAt)
```

D) Media save/load split: OPFS + metadata
- Save:
  1) OPFS stores the actual file
  2) IDB stores metadata (name/type/size/lastModified/dimensions/duration)
- Load:
  - reads both file + metadata
  - creates `URL.createObjectURL(file)` for UI consumption
  - special-cases SVG images where file.type may be empty

SVG handling pattern (robustness for weird MIME cases):
- If `metadata.type === 'image'` and file.type missing:
  - read file as text
  - if starts with `<svg`, wrap as `Blob(type: image/svg+xml)`

E) Cleanup and capability checks
- `getStorageInfo()` exposes whether IndexedDB/OPFS are supported.
- `isFullySupported()` is a single boolean gate.


5) UI-LEVEL MEMORY HYGIENE (IMPORTANT WHEN USING OBJECT URLs)

When you `URL.createObjectURL(file)` you should revoke it when no longer needed.
OpenCut does this on media removal and clears thumbnails too.

Representative excerpt:
```ts
if (item?.url) URL.revokeObjectURL(item.url);
if (item?.thumbnailUrl) URL.revokeObjectURL(item.thumbnailUrl);
```

Also clears video decoding resources:
- `videoCache.clearVideo(id)`


6) EXTRA: SAVED SOUNDS (USER LIBRARY)

The same storage pattern is used for user “saved sounds”:
- stored as a single record `key = 'user-sounds'` in `saved-sounds` store
- provides add/remove/check/clear methods

This is a reusable idea for “small user lists”:
- store as one document
- avoid building indexes until needed


7) WHAT TO COPY INTO OTHER PROJECTS
- `IndexedDBAdapter<T>`: minimal typed IDB adapter
- `OPFSAdapter`: file persistence for large blobs
- `StorageService`: project-scoped adapter factories + naming scheme + Date serialization
- The “metadata-in-IDB, blob-in-OPFS” split is the most valuable architecture idea

END PART 18

````
