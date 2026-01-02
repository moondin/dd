---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 755
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 755 of 933)

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

---[FILE: check_saved_episodes.ts]---
Location: sim-main/apps/sim/tools/spotify/check_saved_episodes.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyCheckSavedEpisodesParams {
  accessToken: string
  episodeIds: string
}

interface SpotifyCheckSavedEpisodesResponse extends ToolResponse {
  output: { results: boolean[] }
}

export const spotifyCheckSavedEpisodesTool: ToolConfig<
  SpotifyCheckSavedEpisodesParams,
  SpotifyCheckSavedEpisodesResponse
> = {
  id: 'spotify_check_saved_episodes',
  name: 'Spotify Check Saved Episodes',
  description: 'Check if episodes are saved in library.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-read'],
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
      return `https://api.spotify.com/v1/me/episodes/contains?ids=${ids}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyCheckSavedEpisodesResponse> => {
    const results = await response.json()
    return { success: true, output: { results } }
  },

  outputs: {
    results: { type: 'json', description: 'Array of booleans for each episode' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: check_saved_shows.ts]---
Location: sim-main/apps/sim/tools/spotify/check_saved_shows.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyCheckSavedShowsParams {
  accessToken: string
  showIds: string
}

interface SpotifyCheckSavedShowsResponse extends ToolResponse {
  output: { results: boolean[] }
}

export const spotifyCheckSavedShowsTool: ToolConfig<
  SpotifyCheckSavedShowsParams,
  SpotifyCheckSavedShowsResponse
> = {
  id: 'spotify_check_saved_shows',
  name: 'Spotify Check Saved Shows',
  description: 'Check if shows are saved in library.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-read'],
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
      return `https://api.spotify.com/v1/me/shows/contains?ids=${ids}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyCheckSavedShowsResponse> => {
    const results = await response.json()
    return { success: true, output: { results } }
  },

  outputs: {
    results: { type: 'json', description: 'Array of booleans for each show' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: check_saved_tracks.ts]---
Location: sim-main/apps/sim/tools/spotify/check_saved_tracks.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyCheckSavedTracksParams, SpotifyCheckSavedTracksResponse } from './types'

export const spotifyCheckSavedTracksTool: ToolConfig<
  SpotifyCheckSavedTracksParams,
  SpotifyCheckSavedTracksResponse
> = {
  id: 'spotify_check_saved_tracks',
  name: 'Spotify Check Saved Tracks',
  description: "Check if one or more tracks are saved in the user's library.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-read'],
  },

  params: {
    trackIds: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated track IDs to check (max 50)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.trackIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      return `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response, params): Promise<SpotifyCheckSavedTracksResponse> => {
    const data = await response.json()
    const ids = (params?.trackIds || '')
      .split(',')
      .map((id) => id.trim())
      .slice(0, 50)

    const results = ids.map((id, index) => ({
      id,
      saved: data[index] || false,
    }))

    return {
      success: true,
      output: {
        results,
        all_saved: data.every((saved: boolean) => saved),
        none_saved: data.every((saved: boolean) => !saved),
      },
    }
  },

  outputs: {
    results: { type: 'json', description: 'Array of track IDs with saved status' },
    all_saved: { type: 'boolean', description: 'Whether all tracks are saved' },
    none_saved: { type: 'boolean', description: 'Whether no tracks are saved' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_playlist.ts]---
Location: sim-main/apps/sim/tools/spotify/create_playlist.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyCreatePlaylistParams, SpotifyCreatePlaylistResponse } from './types'

export const spotifyCreatePlaylistTool: ToolConfig<
  SpotifyCreatePlaylistParams,
  SpotifyCreatePlaylistResponse
> = {
  id: 'spotify_create_playlist',
  name: 'Spotify Create Playlist',
  description: 'Create a new playlist for the current user on Spotify.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['playlist-modify-public', 'playlist-modify-private'],
  },

  params: {
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name for the new playlist',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description for the playlist',
    },
    public: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      default: true,
      description: 'Whether the playlist should be public',
    },
    collaborative: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      default: false,
      description: 'Whether the playlist should be collaborative (requires public to be false)',
    },
  },

  request: {
    url: () => 'https://api.spotify.com/v1/me/playlists',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      name: params.name,
      description: params.description || '',
      public: params.public !== false,
      collaborative: params.collaborative === true,
    }),
  },

  transformResponse: async (response): Promise<SpotifyCreatePlaylistResponse> => {
    const playlist = await response.json()

    return {
      success: true,
      output: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        public: playlist.public,
        collaborative: playlist.collaborative,
        snapshot_id: playlist.snapshot_id,
        external_url: playlist.external_urls?.spotify || '',
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Spotify playlist ID' },
    name: { type: 'string', description: 'Playlist name' },
    description: { type: 'string', description: 'Playlist description', optional: true },
    public: { type: 'boolean', description: 'Whether the playlist is public' },
    collaborative: { type: 'boolean', description: 'Whether collaborative' },
    snapshot_id: { type: 'string', description: 'Playlist snapshot ID' },
    external_url: { type: 'string', description: 'Spotify URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: follow_artists.ts]---
Location: sim-main/apps/sim/tools/spotify/follow_artists.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyFollowArtistsParams {
  accessToken: string
  artistIds: string
}

interface SpotifyFollowArtistsResponse extends ToolResponse {
  output: {
    success: boolean
  }
}

export const spotifyFollowArtistsTool: ToolConfig<
  SpotifyFollowArtistsParams,
  SpotifyFollowArtistsResponse
> = {
  id: 'spotify_follow_artists',
  name: 'Spotify Follow Artists',
  description: 'Follow one or more artists.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-follow-modify'],
  },

  params: {
    artistIds: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated artist IDs to follow (max 50)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.artistIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      return `https://api.spotify.com/v1/me/following?type=artist&ids=${ids}`
    },
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (): Promise<SpotifyFollowArtistsResponse> => {
    return {
      success: true,
      output: { success: true },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether artists were followed successfully' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: follow_playlist.ts]---
Location: sim-main/apps/sim/tools/spotify/follow_playlist.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyFollowPlaylistParams {
  accessToken: string
  playlistId: string
  public?: boolean
}

interface SpotifyFollowPlaylistResponse extends ToolResponse {
  output: { success: boolean }
}

export const spotifyFollowPlaylistTool: ToolConfig<
  SpotifyFollowPlaylistParams,
  SpotifyFollowPlaylistResponse
> = {
  id: 'spotify_follow_playlist',
  name: 'Spotify Follow Playlist',
  description: 'Follow (save) a playlist.',
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
    public: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the playlist will be in public playlists',
    },
  },

  request: {
    url: (params) => `https://api.spotify.com/v1/playlists/${params.playlistId}/followers`,
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      public: params.public ?? true,
    }),
  },

  transformResponse: async (): Promise<SpotifyFollowPlaylistResponse> => {
    return { success: true, output: { success: true } }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether follow succeeded' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_album.ts]---
Location: sim-main/apps/sim/tools/spotify/get_album.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetAlbumParams, SpotifyGetAlbumResponse } from './types'

export const spotifyGetAlbumTool: ToolConfig<SpotifyGetAlbumParams, SpotifyGetAlbumResponse> = {
  id: 'spotify_get_album',
  name: 'Spotify Get Album',
  description:
    'Get detailed information about an album on Spotify by its ID, including track listing.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
  },

  params: {
    albumId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The Spotify ID of the album',
    },
    market: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ISO 3166-1 alpha-2 country code for track availability',
    },
  },

  request: {
    url: (params) => {
      let url = `https://api.spotify.com/v1/albums/${params.albumId}`
      if (params.market) {
        url += `?market=${params.market}`
      }
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetAlbumResponse> => {
    const album = await response.json()

    return {
      success: true,
      output: {
        id: album.id,
        name: album.name,
        artists: album.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
        album_type: album.album_type,
        total_tracks: album.total_tracks,
        release_date: album.release_date,
        label: album.label || '',
        popularity: album.popularity,
        genres: album.genres || [],
        image_url: album.images?.[0]?.url || null,
        tracks: (album.tracks?.items || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          duration_ms: t.duration_ms,
          track_number: t.track_number,
        })),
        external_url: album.external_urls?.spotify || '',
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Spotify album ID' },
    name: { type: 'string', description: 'Album name' },
    artists: { type: 'array', description: 'List of artists' },
    album_type: { type: 'string', description: 'Type of album (album, single, compilation)' },
    total_tracks: { type: 'number', description: 'Total number of tracks' },
    release_date: { type: 'string', description: 'Release date' },
    label: { type: 'string', description: 'Record label' },
    popularity: { type: 'number', description: 'Popularity score (0-100)' },
    genres: { type: 'array', description: 'List of genres' },
    image_url: { type: 'string', description: 'Album cover image URL', optional: true },
    tracks: { type: 'array', description: 'List of tracks on the album' },
    external_url: { type: 'string', description: 'Spotify URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_albums.ts]---
Location: sim-main/apps/sim/tools/spotify/get_albums.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetAlbumsParams {
  accessToken: string
  albumIds: string
  market?: string
}

interface SpotifyGetAlbumsResponse extends ToolResponse {
  output: {
    albums: Array<{
      id: string
      name: string
      artists: Array<{ id: string; name: string }>
      album_type: string
      total_tracks: number
      release_date: string
      image_url: string | null
      external_url: string
    }>
  }
}

export const spotifyGetAlbumsTool: ToolConfig<SpotifyGetAlbumsParams, SpotifyGetAlbumsResponse> = {
  id: 'spotify_get_albums',
  name: 'Spotify Get Multiple Albums',
  description: 'Get details for multiple albums by their IDs.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-private'],
  },

  params: {
    albumIds: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated album IDs (max 20)',
    },
    market: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ISO country code for market',
    },
  },

  request: {
    url: (params) => {
      const ids = params.albumIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 20)
        .join(',')
      let url = `https://api.spotify.com/v1/albums?ids=${ids}`
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

  transformResponse: async (response): Promise<SpotifyGetAlbumsResponse> => {
    const data = await response.json()

    const albums = (data.albums || []).map((album: any) => ({
      id: album.id,
      name: album.name,
      artists: album.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
      album_type: album.album_type,
      total_tracks: album.total_tracks,
      release_date: album.release_date,
      image_url: album.images?.[0]?.url || null,
      external_url: album.external_urls?.spotify || '',
    }))

    return {
      success: true,
      output: { albums },
    }
  },

  outputs: {
    albums: { type: 'json', description: 'List of albums' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_album_tracks.ts]---
Location: sim-main/apps/sim/tools/spotify/get_album_tracks.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetAlbumTracksParams {
  accessToken: string
  albumId: string
  limit?: number
  offset?: number
  market?: string
}

interface SpotifyGetAlbumTracksResponse extends ToolResponse {
  output: {
    tracks: Array<{
      id: string
      name: string
      artists: Array<{ id: string; name: string }>
      duration_ms: number
      track_number: number
      disc_number: number
      explicit: boolean
      preview_url: string | null
    }>
    total: number
    next: string | null
  }
}

export const spotifyGetAlbumTracksTool: ToolConfig<
  SpotifyGetAlbumTracksParams,
  SpotifyGetAlbumTracksResponse
> = {
  id: 'spotify_get_album_tracks',
  name: 'Spotify Get Album Tracks',
  description: 'Get the tracks from an album.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-private'],
  },

  params: {
    albumId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The Spotify album ID',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 20,
      description: 'Number of tracks to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 0,
      description: 'Index of first track to return',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      const offset = params.offset || 0
      let url = `https://api.spotify.com/v1/albums/${params.albumId}/tracks?limit=${limit}&offset=${offset}`
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

  transformResponse: async (response): Promise<SpotifyGetAlbumTracksResponse> => {
    const data = await response.json()

    const tracks = (data.items || []).map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
      duration_ms: track.duration_ms,
      track_number: track.track_number,
      disc_number: track.disc_number,
      explicit: track.explicit || false,
      preview_url: track.preview_url || null,
    }))

    return {
      success: true,
      output: {
        tracks,
        total: data.total || 0,
        next: data.next || null,
      },
    }
  },

  outputs: {
    tracks: { type: 'json', description: 'List of tracks' },
    total: { type: 'number', description: 'Total number of tracks' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_artist.ts]---
Location: sim-main/apps/sim/tools/spotify/get_artist.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetArtistParams, SpotifyGetArtistResponse } from './types'

export const spotifyGetArtistTool: ToolConfig<SpotifyGetArtistParams, SpotifyGetArtistResponse> = {
  id: 'spotify_get_artist',
  name: 'Spotify Get Artist',
  description: 'Get detailed information about an artist on Spotify by their ID.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
  },

  params: {
    artistId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The Spotify ID of the artist',
    },
  },

  request: {
    url: (params) => `https://api.spotify.com/v1/artists/${params.artistId}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetArtistResponse> => {
    const artist = await response.json()

    return {
      success: true,
      output: {
        id: artist.id,
        name: artist.name,
        genres: artist.genres || [],
        popularity: artist.popularity,
        followers: artist.followers?.total || 0,
        image_url: artist.images?.[0]?.url || null,
        external_url: artist.external_urls?.spotify || '',
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Spotify artist ID' },
    name: { type: 'string', description: 'Artist name' },
    genres: { type: 'array', description: 'List of genres associated with the artist' },
    popularity: { type: 'number', description: 'Popularity score (0-100)' },
    followers: { type: 'number', description: 'Number of followers' },
    image_url: { type: 'string', description: 'Artist image URL', optional: true },
    external_url: { type: 'string', description: 'Spotify URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_artists.ts]---
Location: sim-main/apps/sim/tools/spotify/get_artists.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetArtistsParams {
  accessToken: string
  artistIds: string
}

interface SpotifyGetArtistsResponse extends ToolResponse {
  output: {
    artists: Array<{
      id: string
      name: string
      genres: string[]
      popularity: number
      followers: number
      image_url: string | null
      external_url: string
    }>
  }
}

export const spotifyGetArtistsTool: ToolConfig<SpotifyGetArtistsParams, SpotifyGetArtistsResponse> =
  {
    id: 'spotify_get_artists',
    name: 'Spotify Get Multiple Artists',
    description: 'Get details for multiple artists by their IDs.',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'spotify',
      requiredScopes: ['user-read-private'],
    },

    params: {
      artistIds: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Comma-separated artist IDs (max 50)',
      },
    },

    request: {
      url: (params) => {
        const ids = params.artistIds
          .split(',')
          .map((id) => id.trim())
          .slice(0, 50)
          .join(',')
        return `https://api.spotify.com/v1/artists?ids=${ids}`
      },
      method: 'GET',
      headers: (params) => ({
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }),
    },

    transformResponse: async (response): Promise<SpotifyGetArtistsResponse> => {
      const data = await response.json()

      const artists = (data.artists || []).map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres || [],
        popularity: artist.popularity || 0,
        followers: artist.followers?.total || 0,
        image_url: artist.images?.[0]?.url || null,
        external_url: artist.external_urls?.spotify || '',
      }))

      return {
        success: true,
        output: { artists },
      }
    },

    outputs: {
      artists: { type: 'json', description: 'List of artists' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_artist_albums.ts]---
Location: sim-main/apps/sim/tools/spotify/get_artist_albums.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetArtistAlbumsParams, SpotifyGetArtistAlbumsResponse } from './types'

export const spotifyGetArtistAlbumsTool: ToolConfig<
  SpotifyGetArtistAlbumsParams,
  SpotifyGetArtistAlbumsResponse
> = {
  id: 'spotify_get_artist_albums',
  name: 'Spotify Get Artist Albums',
  description: 'Get albums by an artist on Spotify. Can filter by album type.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
  },

  params: {
    artistId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The Spotify ID of the artist',
    },
    include_groups: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by album type: album, single, appears_on, compilation (comma-separated)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 20,
      description: 'Maximum number of albums to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 0,
      description: 'Index of the first album to return',
    },
    market: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ISO 3166-1 alpha-2 country code',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      const offset = params.offset || 0
      let url = `https://api.spotify.com/v1/artists/${params.artistId}/albums?limit=${limit}&offset=${offset}`
      if (params.include_groups) {
        url += `&include_groups=${encodeURIComponent(params.include_groups)}`
      }
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

  transformResponse: async (response): Promise<SpotifyGetArtistAlbumsResponse> => {
    const data = await response.json()

    const albums = (data.items || []).map((album: any) => ({
      id: album.id,
      name: album.name,
      album_type: album.album_type,
      total_tracks: album.total_tracks,
      release_date: album.release_date,
      image_url: album.images?.[0]?.url || null,
      external_url: album.external_urls?.spotify || '',
    }))

    return {
      success: true,
      output: {
        albums,
        total: data.total || albums.length,
        next: data.next || null,
      },
    }
  },

  outputs: {
    albums: {
      type: 'array',
      description: "Artist's albums",
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Spotify album ID' },
          name: { type: 'string', description: 'Album name' },
          album_type: { type: 'string', description: 'Type (album, single, compilation)' },
          total_tracks: { type: 'number', description: 'Number of tracks' },
          release_date: { type: 'string', description: 'Release date' },
          image_url: { type: 'string', description: 'Album cover URL' },
          external_url: { type: 'string', description: 'Spotify URL' },
        },
      },
    },
    total: { type: 'number', description: 'Total number of albums available' },
    next: { type: 'string', description: 'URL for next page of results', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_artist_top_tracks.ts]---
Location: sim-main/apps/sim/tools/spotify/get_artist_top_tracks.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetArtistTopTracksParams, SpotifyGetArtistTopTracksResponse } from './types'

export const spotifyGetArtistTopTracksTool: ToolConfig<
  SpotifyGetArtistTopTracksParams,
  SpotifyGetArtistTopTracksResponse
> = {
  id: 'spotify_get_artist_top_tracks',
  name: 'Spotify Get Artist Top Tracks',
  description: 'Get the top 10 most popular tracks by an artist on Spotify.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
  },

  params: {
    artistId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The Spotify ID of the artist',
    },
    market: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      default: 'US',
      description: 'ISO 3166-1 alpha-2 country code (required for this endpoint)',
    },
  },

  request: {
    url: (params) => {
      const market = params.market || 'US'
      return `https://api.spotify.com/v1/artists/${params.artistId}/top-tracks?market=${market}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetArtistTopTracksResponse> => {
    const data = await response.json()

    const tracks = (data.tracks || []).map((track: any) => ({
      id: track.id,
      name: track.name,
      album: {
        id: track.album?.id || '',
        name: track.album?.name || '',
        image_url: track.album?.images?.[0]?.url || null,
      },
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      preview_url: track.preview_url,
      external_url: track.external_urls?.spotify || '',
    }))

    return {
      success: true,
      output: {
        tracks,
      },
    }
  },

  outputs: {
    tracks: {
      type: 'array',
      description: "Artist's top tracks",
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Spotify track ID' },
          name: { type: 'string', description: 'Track name' },
          album: { type: 'object', description: 'Album information' },
          duration_ms: { type: 'number', description: 'Track duration in milliseconds' },
          popularity: { type: 'number', description: 'Popularity score (0-100)' },
          preview_url: { type: 'string', description: 'URL to 30-second preview' },
          external_url: { type: 'string', description: 'Spotify URL' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_audiobook.ts]---
Location: sim-main/apps/sim/tools/spotify/get_audiobook.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetAudiobookParams {
  accessToken: string
  audiobookId: string
  market?: string
}

interface SpotifyGetAudiobookResponse extends ToolResponse {
  output: {
    id: string
    name: string
    authors: Array<{ name: string }>
    narrators: Array<{ name: string }>
    publisher: string
    description: string
    total_chapters: number
    languages: string[]
    image_url: string | null
    external_url: string
  }
}

export const spotifyGetAudiobookTool: ToolConfig<
  SpotifyGetAudiobookParams,
  SpotifyGetAudiobookResponse
> = {
  id: 'spotify_get_audiobook',
  name: 'Spotify Get Audiobook',
  description: 'Get details for an audiobook.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-playback-position'],
  },

  params: {
    audiobookId: {
      type: 'string',
      required: true,
      description: 'The Spotify audiobook ID',
    },
    market: {
      type: 'string',
      required: false,
      description: 'ISO country code for market',
    },
  },

  request: {
    url: (params) => {
      let url = `https://api.spotify.com/v1/audiobooks/${params.audiobookId}`
      if (params.market) url += `?market=${params.market}`
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetAudiobookResponse> => {
    const book = await response.json()
    return {
      success: true,
      output: {
        id: book.id,
        name: book.name,
        authors: book.authors || [],
        narrators: book.narrators || [],
        publisher: book.publisher || '',
        description: book.description || '',
        total_chapters: book.total_chapters || 0,
        languages: book.languages || [],
        image_url: book.images?.[0]?.url || null,
        external_url: book.external_urls?.spotify || '',
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Audiobook ID' },
    name: { type: 'string', description: 'Audiobook name' },
    authors: { type: 'json', description: 'Authors' },
    narrators: { type: 'json', description: 'Narrators' },
    publisher: { type: 'string', description: 'Publisher' },
    description: { type: 'string', description: 'Description' },
    total_chapters: { type: 'number', description: 'Total chapters' },
    languages: { type: 'json', description: 'Languages' },
    image_url: { type: 'string', description: 'Cover image URL' },
    external_url: { type: 'string', description: 'Spotify URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_audiobooks.ts]---
Location: sim-main/apps/sim/tools/spotify/get_audiobooks.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetAudiobooksParams {
  accessToken: string
  audiobookIds: string
  market?: string
}

interface SpotifyGetAudiobooksResponse extends ToolResponse {
  output: {
    audiobooks: Array<{
      id: string
      name: string
      authors: Array<{ name: string }>
      total_chapters: number
      image_url: string | null
      external_url: string
    }>
  }
}

export const spotifyGetAudiobooksTool: ToolConfig<
  SpotifyGetAudiobooksParams,
  SpotifyGetAudiobooksResponse
> = {
  id: 'spotify_get_audiobooks',
  name: 'Spotify Get Multiple Audiobooks',
  description: 'Get details for multiple audiobooks.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-playback-position'],
  },

  params: {
    audiobookIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated audiobook IDs (max 50)',
    },
    market: {
      type: 'string',
      required: false,
      description: 'ISO country code for market',
    },
  },

  request: {
    url: (params) => {
      const ids = params.audiobookIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      let url = `https://api.spotify.com/v1/audiobooks?ids=${ids}`
      if (params.market) url += `&market=${params.market}`
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetAudiobooksResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: {
        audiobooks: (data.audiobooks || []).map((book: any) => ({
          id: book.id,
          name: book.name,
          authors: book.authors || [],
          total_chapters: book.total_chapters || 0,
          image_url: book.images?.[0]?.url || null,
          external_url: book.external_urls?.spotify || '',
        })),
      },
    }
  },

  outputs: {
    audiobooks: { type: 'json', description: 'List of audiobooks' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_audiobook_chapters.ts]---
Location: sim-main/apps/sim/tools/spotify/get_audiobook_chapters.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetAudiobookChaptersParams {
  accessToken: string
  audiobookId: string
  limit?: number
  offset?: number
  market?: string
}

interface SpotifyGetAudiobookChaptersResponse extends ToolResponse {
  output: {
    chapters: Array<{
      id: string
      name: string
      chapter_number: number
      duration_ms: number
      image_url: string | null
      external_url: string
    }>
    total: number
    next: string | null
  }
}

export const spotifyGetAudiobookChaptersTool: ToolConfig<
  SpotifyGetAudiobookChaptersParams,
  SpotifyGetAudiobookChaptersResponse
> = {
  id: 'spotify_get_audiobook_chapters',
  name: 'Spotify Get Audiobook Chapters',
  description: 'Get chapters from an audiobook.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-playback-position'],
  },

  params: {
    audiobookId: {
      type: 'string',
      required: true,
      description: 'The Spotify audiobook ID',
    },
    limit: {
      type: 'number',
      required: false,
      default: 20,
      description: 'Number of chapters to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      default: 0,
      description: 'Index of first chapter to return',
    },
    market: {
      type: 'string',
      required: false,
      description: 'ISO country code for market',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      const offset = params.offset || 0
      let url = `https://api.spotify.com/v1/audiobooks/${params.audiobookId}/chapters?limit=${limit}&offset=${offset}`
      if (params.market) url += `&market=${params.market}`
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetAudiobookChaptersResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: {
        chapters: (data.items || []).map((ch: any) => ({
          id: ch.id,
          name: ch.name,
          chapter_number: ch.chapter_number || 0,
          duration_ms: ch.duration_ms || 0,
          image_url: ch.images?.[0]?.url || null,
          external_url: ch.external_urls?.spotify || '',
        })),
        total: data.total || 0,
        next: data.next || null,
      },
    }
  },

  outputs: {
    chapters: { type: 'json', description: 'List of chapters' },
    total: { type: 'number', description: 'Total chapters' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

````
