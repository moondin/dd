---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 758
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 758 of 933)

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

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/spotify/index.ts

```typescript
// Search & Discovery

export { spotifyAddPlaylistCoverTool } from './add_playlist_cover'
// Player Controls
export { spotifyAddToQueueTool } from './add_to_queue'
export { spotifyAddTracksToPlaylistTool } from './add_tracks_to_playlist'
export { spotifyCheckFollowingTool } from './check_following'
export { spotifyCheckPlaylistFollowersTool } from './check_playlist_followers'
export { spotifyCheckSavedAlbumsTool } from './check_saved_albums'
export { spotifyCheckSavedAudiobooksTool } from './check_saved_audiobooks'
export { spotifyCheckSavedEpisodesTool } from './check_saved_episodes'
export { spotifyCheckSavedShowsTool } from './check_saved_shows'
export { spotifyCheckSavedTracksTool } from './check_saved_tracks'
export { spotifyCreatePlaylistTool } from './create_playlist'
export { spotifyFollowArtistsTool } from './follow_artists'
export { spotifyFollowPlaylistTool } from './follow_playlist'
// Albums
export { spotifyGetAlbumTool } from './get_album'
export { spotifyGetAlbumTracksTool } from './get_album_tracks'
export { spotifyGetAlbumsTool } from './get_albums'
// Artists
export { spotifyGetArtistTool } from './get_artist'
export { spotifyGetArtistAlbumsTool } from './get_artist_albums'
export { spotifyGetArtistTopTracksTool } from './get_artist_top_tracks'
export { spotifyGetArtistsTool } from './get_artists'
// Audiobooks
export { spotifyGetAudiobookTool } from './get_audiobook'
export { spotifyGetAudiobookChaptersTool } from './get_audiobook_chapters'
export { spotifyGetAudiobooksTool } from './get_audiobooks'
export { spotifyGetCategoriesTool } from './get_categories'
// User Profile & Library
export { spotifyGetCurrentUserTool } from './get_current_user'
export { spotifyGetCurrentlyPlayingTool } from './get_currently_playing'
export { spotifyGetDevicesTool } from './get_devices'
// Episodes
export { spotifyGetEpisodeTool } from './get_episode'
export { spotifyGetEpisodesTool } from './get_episodes'
export { spotifyGetFollowedArtistsTool } from './get_followed_artists'
export { spotifyGetMarketsTool } from './get_markets'
// Browse
export { spotifyGetNewReleasesTool } from './get_new_releases'
// Player Controls
export { spotifyGetPlaybackStateTool } from './get_playback_state'
// Playlists
export { spotifyGetPlaylistTool } from './get_playlist'
export { spotifyGetPlaylistCoverTool } from './get_playlist_cover'
export { spotifyGetPlaylistTracksTool } from './get_playlist_tracks'
export { spotifyGetQueueTool } from './get_queue'
export { spotifyGetRecentlyPlayedTool } from './get_recently_played'
export { spotifyGetSavedAlbumsTool } from './get_saved_albums'
export { spotifyGetSavedAudiobooksTool } from './get_saved_audiobooks'
export { spotifyGetSavedEpisodesTool } from './get_saved_episodes'
export { spotifyGetSavedShowsTool } from './get_saved_shows'
export { spotifyGetSavedTracksTool } from './get_saved_tracks'
// Shows (Podcasts)
export { spotifyGetShowTool } from './get_show'
export { spotifyGetShowEpisodesTool } from './get_show_episodes'
export { spotifyGetShowsTool } from './get_shows'
export { spotifyGetTopArtistsTool } from './get_top_artists'
export { spotifyGetTopTracksTool } from './get_top_tracks'
// Tracks
export { spotifyGetTrackTool } from './get_track'
export { spotifyGetTracksTool } from './get_tracks'
export { spotifyGetUserPlaylistsTool } from './get_user_playlists'
export { spotifyGetUserProfileTool } from './get_user_profile'
export { spotifyPauseTool } from './pause'
export { spotifyPlayTool } from './play'
// Library Management
export { spotifyRemoveSavedAlbumsTool } from './remove_saved_albums'
export { spotifyRemoveSavedAudiobooksTool } from './remove_saved_audiobooks'
export { spotifyRemoveSavedEpisodesTool } from './remove_saved_episodes'
export { spotifyRemoveSavedShowsTool } from './remove_saved_shows'
export { spotifyRemoveSavedTracksTool } from './remove_saved_tracks'
export { spotifyRemoveTracksFromPlaylistTool } from './remove_tracks_from_playlist'
export { spotifyReorderPlaylistItemsTool } from './reorder_playlist_items'
export { spotifyReplacePlaylistItemsTool } from './replace_playlist_items'
export { spotifySaveAlbumsTool } from './save_albums'
export { spotifySaveAudiobooksTool } from './save_audiobooks'
export { spotifySaveEpisodesTool } from './save_episodes'
export { spotifySaveShowsTool } from './save_shows'
export { spotifySaveTracksTool } from './save_tracks'
export { spotifySearchTool } from './search'
export { spotifySeekTool } from './seek'
export { spotifySetRepeatTool } from './set_repeat'
export { spotifySetShuffleTool } from './set_shuffle'
export { spotifySetVolumeTool } from './set_volume'
export { spotifySkipNextTool } from './skip_next'
export { spotifySkipPreviousTool } from './skip_previous'
export { spotifyTransferPlaybackTool } from './transfer_playback'
export { spotifyUnfollowArtistsTool } from './unfollow_artists'
export { spotifyUnfollowPlaylistTool } from './unfollow_playlist'
export { spotifyUpdatePlaylistTool } from './update_playlist'
```

--------------------------------------------------------------------------------

---[FILE: pause.ts]---
Location: sim-main/apps/sim/tools/spotify/pause.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyPauseParams, SpotifyPauseResponse } from './types'

export const spotifyPauseTool: ToolConfig<SpotifyPauseParams, SpotifyPauseResponse> = {
  id: 'spotify_pause',
  name: 'Spotify Pause',
  description: 'Pause playback on Spotify.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-modify-playback-state'],
  },

  params: {
    device_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Device ID to pause. If not provided, pauses active device.',
    },
  },

  request: {
    url: (params) => {
      let url = 'https://api.spotify.com/v1/me/player/pause'
      if (params.device_id) {
        url += `?device_id=${params.device_id}`
      }
      return url
    },
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (): Promise<SpotifyPauseResponse> => {
    return {
      success: true,
      output: {
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether playback was paused' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: play.ts]---
Location: sim-main/apps/sim/tools/spotify/play.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyPlayParams, SpotifyPlayResponse } from './types'

export const spotifyPlayTool: ToolConfig<SpotifyPlayParams, SpotifyPlayResponse> = {
  id: 'spotify_play',
  name: 'Spotify Play',
  description:
    'Start or resume playback on Spotify. Can play specific tracks, albums, or playlists.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-modify-playback-state'],
  },

  params: {
    device_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Device ID to play on. If not provided, plays on active device.',
    },
    context_uri: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Spotify URI of album, artist, or playlist to play (e.g., "spotify:album:xxx")',
    },
    uris: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Comma-separated track URIs to play (e.g., "spotify:track:xxx,spotify:track:yyy")',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Position in context to start playing (0-based index)',
    },
    position_ms: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Position in track to start from (in milliseconds)',
    },
  },

  request: {
    url: (params) => {
      let url = 'https://api.spotify.com/v1/me/player/play'
      if (params.device_id) {
        url += `?device_id=${params.device_id}`
      }
      return url
    },
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: any = {}
      if (params.context_uri) {
        body.context_uri = params.context_uri
      }
      if (params.uris) {
        body.uris = params.uris.split(',').map((uri) => uri.trim())
      }
      if (params.offset !== undefined) {
        body.offset = { position: params.offset }
      }
      if (params.position_ms !== undefined) {
        body.position_ms = params.position_ms
      }
      return Object.keys(body).length > 0 ? body : undefined
    },
  },

  transformResponse: async (): Promise<SpotifyPlayResponse> => {
    return {
      success: true,
      output: {
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether playback started successfully' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_saved_albums.ts]---
Location: sim-main/apps/sim/tools/spotify/remove_saved_albums.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyRemoveSavedAlbumsParams {
  accessToken: string
  albumIds: string
}

interface SpotifyRemoveSavedAlbumsResponse extends ToolResponse {
  output: { success: boolean }
}

export const spotifyRemoveSavedAlbumsTool: ToolConfig<
  SpotifyRemoveSavedAlbumsParams,
  SpotifyRemoveSavedAlbumsResponse
> = {
  id: 'spotify_remove_saved_albums',
  name: 'Spotify Remove Saved Albums',
  description: "Remove albums from the user's library.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-modify'],
  },

  params: {
    albumIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated album IDs (max 20)',
    },
  },

  request: {
    url: () => 'https://api.spotify.com/v1/me/albums',
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      ids: params.albumIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 20),
    }),
  },

  transformResponse: async (): Promise<SpotifyRemoveSavedAlbumsResponse> => {
    return { success: true, output: { success: true } }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether albums were removed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_saved_audiobooks.ts]---
Location: sim-main/apps/sim/tools/spotify/remove_saved_audiobooks.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyRemoveSavedAudiobooksParams {
  accessToken: string
  audiobookIds: string
}

interface SpotifyRemoveSavedAudiobooksResponse extends ToolResponse {
  output: { success: boolean }
}

export const spotifyRemoveSavedAudiobooksTool: ToolConfig<
  SpotifyRemoveSavedAudiobooksParams,
  SpotifyRemoveSavedAudiobooksResponse
> = {
  id: 'spotify_remove_saved_audiobooks',
  name: 'Spotify Remove Saved Audiobooks',
  description: "Remove audiobooks from the user's library.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-modify'],
  },

  params: {
    audiobookIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated audiobook IDs (max 50)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.audiobookIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      return `https://api.spotify.com/v1/me/audiobooks?ids=${ids}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (): Promise<SpotifyRemoveSavedAudiobooksResponse> => {
    return { success: true, output: { success: true } }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether audiobooks were removed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_saved_episodes.ts]---
Location: sim-main/apps/sim/tools/spotify/remove_saved_episodes.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyRemoveSavedEpisodesParams {
  accessToken: string
  episodeIds: string
}

interface SpotifyRemoveSavedEpisodesResponse extends ToolResponse {
  output: { success: boolean }
}

export const spotifyRemoveSavedEpisodesTool: ToolConfig<
  SpotifyRemoveSavedEpisodesParams,
  SpotifyRemoveSavedEpisodesResponse
> = {
  id: 'spotify_remove_saved_episodes',
  name: 'Spotify Remove Saved Episodes',
  description: "Remove podcast episodes from the user's library.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-modify'],
  },

  params: {
    episodeIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated episode IDs (max 50)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.episodeIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      return `https://api.spotify.com/v1/me/episodes?ids=${ids}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (): Promise<SpotifyRemoveSavedEpisodesResponse> => {
    return { success: true, output: { success: true } }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether episodes were removed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_saved_shows.ts]---
Location: sim-main/apps/sim/tools/spotify/remove_saved_shows.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyRemoveSavedShowsParams {
  accessToken: string
  showIds: string
}

interface SpotifyRemoveSavedShowsResponse extends ToolResponse {
  output: { success: boolean }
}

export const spotifyRemoveSavedShowsTool: ToolConfig<
  SpotifyRemoveSavedShowsParams,
  SpotifyRemoveSavedShowsResponse
> = {
  id: 'spotify_remove_saved_shows',
  name: 'Spotify Remove Saved Shows',
  description: "Remove podcast shows from the user's library.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-modify'],
  },

  params: {
    showIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated show IDs (max 50)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.showIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      return `https://api.spotify.com/v1/me/shows?ids=${ids}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (): Promise<SpotifyRemoveSavedShowsResponse> => {
    return { success: true, output: { success: true } }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether shows were removed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_saved_tracks.ts]---
Location: sim-main/apps/sim/tools/spotify/remove_saved_tracks.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyRemoveSavedTracksParams {
  accessToken: string
  trackIds: string
}

interface SpotifyRemoveSavedTracksResponse extends ToolResponse {
  output: {
    success: boolean
  }
}

export const spotifyRemoveSavedTracksTool: ToolConfig<
  SpotifyRemoveSavedTracksParams,
  SpotifyRemoveSavedTracksResponse
> = {
  id: 'spotify_remove_saved_tracks',
  name: 'Spotify Remove Saved Tracks',
  description: "Remove tracks from the user's library.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-modify'],
  },

  params: {
    trackIds: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated track IDs to remove (max 50)',
    },
  },

  request: {
    url: () => 'https://api.spotify.com/v1/me/tracks',
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      ids: params.trackIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50),
    }),
  },

  transformResponse: async (): Promise<SpotifyRemoveSavedTracksResponse> => {
    return {
      success: true,
      output: { success: true },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether tracks were removed successfully' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_tracks_from_playlist.ts]---
Location: sim-main/apps/sim/tools/spotify/remove_tracks_from_playlist.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  SpotifyRemoveTracksFromPlaylistParams,
  SpotifyRemoveTracksFromPlaylistResponse,
} from './types'

export const spotifyRemoveTracksFromPlaylistTool: ToolConfig<
  SpotifyRemoveTracksFromPlaylistParams,
  SpotifyRemoveTracksFromPlaylistResponse
> = {
  id: 'spotify_remove_tracks_from_playlist',
  name: 'Spotify Remove Tracks from Playlist',
  description: 'Remove one or more tracks from a Spotify playlist.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['playlist-modify-public', 'playlist-modify-private'],
  },

  params: {
    playlistId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The Spotify ID of the playlist',
    },
    uris: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Comma-separated Spotify URIs to remove (e.g., "spotify:track:xxx,spotify:track:yyy")',
    },
  },

  request: {
    url: (params) => `https://api.spotify.com/v1/playlists/${params.playlistId}/tracks`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const uris = params.uris.split(',').map((uri) => ({ uri: uri.trim() }))
      return { tracks: uris }
    },
  },

  transformResponse: async (response): Promise<SpotifyRemoveTracksFromPlaylistResponse> => {
    const data = await response.json()

    return {
      success: true,
      output: {
        snapshot_id: data.snapshot_id,
      },
    }
  },

  outputs: {
    snapshot_id: { type: 'string', description: 'New playlist snapshot ID after modification' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: reorder_playlist_items.ts]---
Location: sim-main/apps/sim/tools/spotify/reorder_playlist_items.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyReorderPlaylistItemsParams {
  accessToken: string
  playlistId: string
  range_start: number
  insert_before: number
  range_length?: number
  snapshot_id?: string
}

interface SpotifyReorderPlaylistItemsResponse extends ToolResponse {
  output: {
    snapshot_id: string
  }
}

export const spotifyReorderPlaylistItemsTool: ToolConfig<
  SpotifyReorderPlaylistItemsParams,
  SpotifyReorderPlaylistItemsResponse
> = {
  id: 'spotify_reorder_playlist_items',
  name: 'Spotify Reorder Playlist Items',
  description: 'Move tracks to a different position in a playlist.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['playlist-modify-public', 'playlist-modify-private'],
  },

  params: {
    playlistId: {
      type: 'string',
      required: true,
      description: 'The Spotify playlist ID',
    },
    range_start: {
      type: 'number',
      required: true,
      description: 'Start index of items to reorder',
    },
    insert_before: {
      type: 'number',
      required: true,
      description: 'Index to insert items before',
    },
    range_length: {
      type: 'number',
      required: false,
      default: 1,
      description: 'Number of items to reorder',
    },
    snapshot_id: {
      type: 'string',
      required: false,
      description: 'Playlist snapshot ID for concurrency control',
    },
  },

  request: {
    url: (params) => `https://api.spotify.com/v1/playlists/${params.playlistId}/tracks`,
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        range_start: params.range_start,
        insert_before: params.insert_before,
        range_length: params.range_length || 1,
      }
      if (params.snapshot_id) body.snapshot_id = params.snapshot_id
      return body
    },
  },

  transformResponse: async (response): Promise<SpotifyReorderPlaylistItemsResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: { snapshot_id: data.snapshot_id || '' },
    }
  },

  outputs: {
    snapshot_id: { type: 'string', description: 'New playlist snapshot ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: replace_playlist_items.ts]---
Location: sim-main/apps/sim/tools/spotify/replace_playlist_items.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyReplacePlaylistItemsParams {
  accessToken: string
  playlistId: string
  uris: string
}

interface SpotifyReplacePlaylistItemsResponse extends ToolResponse {
  output: {
    snapshot_id: string
  }
}

export const spotifyReplacePlaylistItemsTool: ToolConfig<
  SpotifyReplacePlaylistItemsParams,
  SpotifyReplacePlaylistItemsResponse
> = {
  id: 'spotify_replace_playlist_items',
  name: 'Spotify Replace Playlist Items',
  description: 'Replace all items in a playlist with new tracks.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['playlist-modify-public', 'playlist-modify-private'],
  },

  params: {
    playlistId: {
      type: 'string',
      required: true,
      description: 'The Spotify playlist ID',
    },
    uris: {
      type: 'string',
      required: true,
      description: 'Comma-separated Spotify URIs (max 100)',
    },
  },

  request: {
    url: (params) => `https://api.spotify.com/v1/playlists/${params.playlistId}/tracks`,
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      uris: params.uris
        .split(',')
        .map((uri) => uri.trim())
        .slice(0, 100),
    }),
  },

  transformResponse: async (response): Promise<SpotifyReplacePlaylistItemsResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: { snapshot_id: data.snapshot_id || '' },
    }
  },

  outputs: {
    snapshot_id: { type: 'string', description: 'New playlist snapshot ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: save_albums.ts]---
Location: sim-main/apps/sim/tools/spotify/save_albums.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifySaveAlbumsParams {
  accessToken: string
  albumIds: string
}

interface SpotifySaveAlbumsResponse extends ToolResponse {
  output: { success: boolean }
}

export const spotifySaveAlbumsTool: ToolConfig<SpotifySaveAlbumsParams, SpotifySaveAlbumsResponse> =
  {
    id: 'spotify_save_albums',
    name: 'Spotify Save Albums',
    description: "Save albums to the user's library.",
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'spotify',
      requiredScopes: ['user-library-modify'],
    },

    params: {
      albumIds: {
        type: 'string',
        required: true,
        description: 'Comma-separated album IDs (max 20)',
      },
    },

    request: {
      url: () => 'https://api.spotify.com/v1/me/albums',
      method: 'PUT',
      headers: (params) => ({
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: (params) => ({
        ids: params.albumIds
          .split(',')
          .map((id) => id.trim())
          .slice(0, 20),
      }),
    },

    transformResponse: async (): Promise<SpotifySaveAlbumsResponse> => {
      return { success: true, output: { success: true } }
    },

    outputs: {
      success: { type: 'boolean', description: 'Whether albums were saved' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: save_audiobooks.ts]---
Location: sim-main/apps/sim/tools/spotify/save_audiobooks.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifySaveAudiobooksParams {
  accessToken: string
  audiobookIds: string
}

interface SpotifySaveAudiobooksResponse extends ToolResponse {
  output: { success: boolean }
}

export const spotifySaveAudiobooksTool: ToolConfig<
  SpotifySaveAudiobooksParams,
  SpotifySaveAudiobooksResponse
> = {
  id: 'spotify_save_audiobooks',
  name: 'Spotify Save Audiobooks',
  description: "Save audiobooks to the user's library.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-modify'],
  },

  params: {
    audiobookIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated audiobook IDs (max 50)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.audiobookIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      return `https://api.spotify.com/v1/me/audiobooks?ids=${ids}`
    },
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (): Promise<SpotifySaveAudiobooksResponse> => {
    return { success: true, output: { success: true } }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether audiobooks were saved' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: save_episodes.ts]---
Location: sim-main/apps/sim/tools/spotify/save_episodes.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifySaveEpisodesParams {
  accessToken: string
  episodeIds: string
}

interface SpotifySaveEpisodesResponse extends ToolResponse {
  output: { success: boolean }
}

export const spotifySaveEpisodesTool: ToolConfig<
  SpotifySaveEpisodesParams,
  SpotifySaveEpisodesResponse
> = {
  id: 'spotify_save_episodes',
  name: 'Spotify Save Episodes',
  description: "Save podcast episodes to the user's library.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-modify'],
  },

  params: {
    episodeIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated episode IDs (max 50)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.episodeIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      return `https://api.spotify.com/v1/me/episodes?ids=${ids}`
    },
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (): Promise<SpotifySaveEpisodesResponse> => {
    return { success: true, output: { success: true } }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether episodes were saved' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: save_shows.ts]---
Location: sim-main/apps/sim/tools/spotify/save_shows.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifySaveShowsParams {
  accessToken: string
  showIds: string
}

interface SpotifySaveShowsResponse extends ToolResponse {
  output: { success: boolean }
}

export const spotifySaveShowsTool: ToolConfig<SpotifySaveShowsParams, SpotifySaveShowsResponse> = {
  id: 'spotify_save_shows',
  name: 'Spotify Save Shows',
  description: "Save podcast shows to the user's library.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-modify'],
  },

  params: {
    showIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated show IDs (max 50)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.showIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      return `https://api.spotify.com/v1/me/shows?ids=${ids}`
    },
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (): Promise<SpotifySaveShowsResponse> => {
    return { success: true, output: { success: true } }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether shows were saved' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: save_tracks.ts]---
Location: sim-main/apps/sim/tools/spotify/save_tracks.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifySaveTracksParams, SpotifySaveTracksResponse } from './types'

export const spotifySaveTracksTool: ToolConfig<SpotifySaveTracksParams, SpotifySaveTracksResponse> =
  {
    id: 'spotify_save_tracks',
    name: 'Spotify Save Tracks',
    description: "Save tracks to the current user's library (like tracks).",
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'spotify',
      requiredScopes: ['user-library-modify'],
    },

    params: {
      trackIds: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Comma-separated Spotify track IDs to save (max 50)',
      },
    },

    request: {
      url: (params) =>
        `https://api.spotify.com/v1/me/tracks?ids=${encodeURIComponent(params.trackIds)}`,
      method: 'PUT',
      headers: (params) => ({
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }),
    },

    transformResponse: async (): Promise<SpotifySaveTracksResponse> => {
      return {
        success: true,
        output: {
          success: true,
        },
      }
    },

    outputs: {
      success: { type: 'boolean', description: 'Whether the tracks were saved successfully' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/spotify/search.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifySearchParams, SpotifySearchResponse } from './types'

export const spotifySearchTool: ToolConfig<SpotifySearchParams, SpotifySearchResponse> = {
  id: 'spotify_search',
  name: 'Spotify Search',
  description:
    'Search for tracks, albums, artists, or playlists on Spotify. Returns matching results based on the query.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
  },

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query (e.g., "Bohemian Rhapsody", "artist:Queen", "genre:rock")',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      default: 'track',
      description:
        'Type of results: track, album, artist, playlist, or comma-separated (e.g., "track,artist")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 20,
      description: 'Maximum number of results to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 0,
      description: 'Index of the first result to return for pagination',
    },
    market: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ISO 3166-1 alpha-2 country code to filter results (e.g., "US", "GB")',
    },
  },

  request: {
    url: (params) => {
      const type = params.type || 'track'
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      const offset = params.offset || 0
      let url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(params.query)}&type=${encodeURIComponent(type)}&limit=${limit}&offset=${offset}`
      if (params.market) {
        url += `&market=${params.market}`
      }
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifySearchResponse> => {
    const data = await response.json()

    const tracks = (data.tracks?.items || []).map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists?.map((a: any) => a.name) || [],
      album: track.album?.name || '',
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      preview_url: track.preview_url,
      external_url: track.external_urls?.spotify || '',
    }))

    const artists = (data.artists?.items || []).map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres || [],
      popularity: artist.popularity,
      followers: artist.followers?.total || 0,
      image_url: artist.images?.[0]?.url || null,
      external_url: artist.external_urls?.spotify || '',
    }))

    const albums = (data.albums?.items || []).map((album: any) => ({
      id: album.id,
      name: album.name,
      artists: album.artists?.map((a: any) => a.name) || [],
      total_tracks: album.total_tracks,
      release_date: album.release_date,
      image_url: album.images?.[0]?.url || null,
      external_url: album.external_urls?.spotify || '',
    }))

    const playlists = (data.playlists?.items || []).map((playlist: any) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      owner: playlist.owner?.display_name || '',
      total_tracks: playlist.tracks?.total || 0,
      image_url: playlist.images?.[0]?.url || null,
      external_url: playlist.external_urls?.spotify || '',
    }))

    return {
      success: true,
      output: {
        tracks,
        artists,
        albums,
        playlists,
      },
    }
  },

  outputs: {
    tracks: {
      type: 'array',
      description: 'List of matching tracks',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Spotify track ID' },
          name: { type: 'string', description: 'Track name' },
          artists: { type: 'array', description: 'List of artist names' },
          album: { type: 'string', description: 'Album name' },
          duration_ms: { type: 'number', description: 'Track duration in milliseconds' },
          popularity: { type: 'number', description: 'Popularity score (0-100)' },
          preview_url: { type: 'string', description: 'URL to 30-second preview' },
          external_url: { type: 'string', description: 'Spotify URL' },
        },
      },
    },
    artists: {
      type: 'array',
      description: 'List of matching artists',
    },
    albums: {
      type: 'array',
      description: 'List of matching albums',
    },
    playlists: {
      type: 'array',
      description: 'List of matching playlists',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: seek.ts]---
Location: sim-main/apps/sim/tools/spotify/seek.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifySeekParams {
  accessToken: string
  position_ms: number
  device_id?: string
}

interface SpotifySeekResponse extends ToolResponse {
  output: {
    success: boolean
  }
}

export const spotifySeekTool: ToolConfig<SpotifySeekParams, SpotifySeekResponse> = {
  id: 'spotify_seek',
  name: 'Spotify Seek',
  description: 'Seek to a position in the currently playing track.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-modify-playback-state'],
  },

  params: {
    position_ms: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Position in milliseconds to seek to',
    },
    device_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Device ID to target',
    },
  },

  request: {
    url: (params) => {
      let url = `https://api.spotify.com/v1/me/player/seek?position_ms=${params.position_ms}`
      if (params.device_id) {
        url += `&device_id=${params.device_id}`
      }
      return url
    },
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (): Promise<SpotifySeekResponse> => {
    return {
      success: true,
      output: { success: true },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether seek was successful' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: set_repeat.ts]---
Location: sim-main/apps/sim/tools/spotify/set_repeat.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifySetRepeatParams {
  accessToken: string
  state: string
  device_id?: string
}

interface SpotifySetRepeatResponse extends ToolResponse {
  output: {
    success: boolean
  }
}

export const spotifySetRepeatTool: ToolConfig<SpotifySetRepeatParams, SpotifySetRepeatResponse> = {
  id: 'spotify_set_repeat',
  name: 'Spotify Set Repeat',
  description: 'Set the repeat mode for playback.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-modify-playback-state'],
  },

  params: {
    state: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repeat mode: "off", "track", or "context"',
    },
    device_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Device ID to target',
    },
  },

  request: {
    url: (params) => {
      let url = `https://api.spotify.com/v1/me/player/repeat?state=${params.state}`
      if (params.device_id) {
        url += `&device_id=${params.device_id}`
      }
      return url
    },
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (): Promise<SpotifySetRepeatResponse> => {
    return {
      success: true,
      output: { success: true },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether repeat mode was set successfully' },
  },
}
```

--------------------------------------------------------------------------------

````
