---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 757
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 757 of 933)

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

---[FILE: get_saved_albums.ts]---
Location: sim-main/apps/sim/tools/spotify/get_saved_albums.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetSavedAlbumsParams {
  accessToken: string
  limit?: number
  offset?: number
  market?: string
}

interface SpotifyGetSavedAlbumsResponse extends ToolResponse {
  output: {
    albums: Array<{
      added_at: string
      album: {
        id: string
        name: string
        artists: Array<{ id: string; name: string }>
        total_tracks: number
        release_date: string
        image_url: string | null
        external_url: string
      }
    }>
    total: number
    next: string | null
  }
}

export const spotifyGetSavedAlbumsTool: ToolConfig<
  SpotifyGetSavedAlbumsParams,
  SpotifyGetSavedAlbumsResponse
> = {
  id: 'spotify_get_saved_albums',
  name: 'Spotify Get Saved Albums',
  description: "Get the user's saved albums.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-read'],
  },

  params: {
    limit: {
      type: 'number',
      required: false,
      default: 20,
      description: 'Number of albums to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      default: 0,
      description: 'Index of first album to return',
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
      let url = `https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}`
      if (params.market) url += `&market=${params.market}`
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetSavedAlbumsResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: {
        albums: (data.items || []).map((item: any) => ({
          added_at: item.added_at,
          album: {
            id: item.album.id,
            name: item.album.name,
            artists: item.album.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
            total_tracks: item.album.total_tracks,
            release_date: item.album.release_date,
            image_url: item.album.images?.[0]?.url || null,
            external_url: item.album.external_urls?.spotify || '',
          },
        })),
        total: data.total || 0,
        next: data.next || null,
      },
    }
  },

  outputs: {
    albums: { type: 'json', description: 'List of saved albums' },
    total: { type: 'number', description: 'Total saved albums' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_saved_audiobooks.ts]---
Location: sim-main/apps/sim/tools/spotify/get_saved_audiobooks.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetSavedAudiobooksParams {
  accessToken: string
  limit?: number
  offset?: number
}

interface SpotifyGetSavedAudiobooksResponse extends ToolResponse {
  output: {
    audiobooks: Array<{
      added_at: string
      audiobook: {
        id: string
        name: string
        authors: Array<{ name: string }>
        total_chapters: number
        image_url: string | null
        external_url: string
      }
    }>
    total: number
    next: string | null
  }
}

export const spotifyGetSavedAudiobooksTool: ToolConfig<
  SpotifyGetSavedAudiobooksParams,
  SpotifyGetSavedAudiobooksResponse
> = {
  id: 'spotify_get_saved_audiobooks',
  name: 'Spotify Get Saved Audiobooks',
  description: "Get the user's saved audiobooks.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-read'],
  },

  params: {
    limit: {
      type: 'number',
      required: false,
      default: 20,
      description: 'Number of audiobooks to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      default: 0,
      description: 'Index of first audiobook to return',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      const offset = params.offset || 0
      return `https://api.spotify.com/v1/me/audiobooks?limit=${limit}&offset=${offset}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetSavedAudiobooksResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: {
        audiobooks: (data.items || []).map((item: any) => ({
          added_at: item.added_at,
          audiobook: {
            id: item.audiobook?.id || item.id,
            name: item.audiobook?.name || item.name,
            authors: item.audiobook?.authors || item.authors || [],
            total_chapters: item.audiobook?.total_chapters || item.total_chapters || 0,
            image_url: item.audiobook?.images?.[0]?.url || item.images?.[0]?.url || null,
            external_url:
              item.audiobook?.external_urls?.spotify || item.external_urls?.spotify || '',
          },
        })),
        total: data.total || 0,
        next: data.next || null,
      },
    }
  },

  outputs: {
    audiobooks: { type: 'json', description: 'List of saved audiobooks' },
    total: { type: 'number', description: 'Total saved audiobooks' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_saved_episodes.ts]---
Location: sim-main/apps/sim/tools/spotify/get_saved_episodes.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetSavedEpisodesParams {
  accessToken: string
  limit?: number
  offset?: number
  market?: string
}

interface SpotifyGetSavedEpisodesResponse extends ToolResponse {
  output: {
    episodes: Array<{
      added_at: string
      episode: {
        id: string
        name: string
        duration_ms: number
        release_date: string
        show: { id: string; name: string }
        image_url: string | null
        external_url: string
      }
    }>
    total: number
    next: string | null
  }
}

export const spotifyGetSavedEpisodesTool: ToolConfig<
  SpotifyGetSavedEpisodesParams,
  SpotifyGetSavedEpisodesResponse
> = {
  id: 'spotify_get_saved_episodes',
  name: 'Spotify Get Saved Episodes',
  description: "Get the user's saved podcast episodes.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-read', 'user-read-playback-position'],
  },

  params: {
    limit: {
      type: 'number',
      required: false,
      default: 20,
      description: 'Number of episodes to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      default: 0,
      description: 'Index of first episode to return',
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
      let url = `https://api.spotify.com/v1/me/episodes?limit=${limit}&offset=${offset}`
      if (params.market) url += `&market=${params.market}`
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetSavedEpisodesResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: {
        episodes: (data.items || []).map((item: any) => ({
          added_at: item.added_at,
          episode: {
            id: item.episode.id,
            name: item.episode.name,
            duration_ms: item.episode.duration_ms || 0,
            release_date: item.episode.release_date || '',
            show: { id: item.episode.show?.id || '', name: item.episode.show?.name || '' },
            image_url: item.episode.images?.[0]?.url || null,
            external_url: item.episode.external_urls?.spotify || '',
          },
        })),
        total: data.total || 0,
        next: data.next || null,
      },
    }
  },

  outputs: {
    episodes: { type: 'json', description: 'List of saved episodes' },
    total: { type: 'number', description: 'Total saved episodes' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_saved_shows.ts]---
Location: sim-main/apps/sim/tools/spotify/get_saved_shows.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetSavedShowsParams {
  accessToken: string
  limit?: number
  offset?: number
}

interface SpotifyGetSavedShowsResponse extends ToolResponse {
  output: {
    shows: Array<{
      added_at: string
      show: {
        id: string
        name: string
        publisher: string
        total_episodes: number
        image_url: string | null
        external_url: string
      }
    }>
    total: number
    next: string | null
  }
}

export const spotifyGetSavedShowsTool: ToolConfig<
  SpotifyGetSavedShowsParams,
  SpotifyGetSavedShowsResponse
> = {
  id: 'spotify_get_saved_shows',
  name: 'Spotify Get Saved Shows',
  description: "Get the user's saved podcast shows.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-read'],
  },

  params: {
    limit: {
      type: 'number',
      required: false,
      default: 20,
      description: 'Number of shows to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      default: 0,
      description: 'Index of first show to return',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      const offset = params.offset || 0
      return `https://api.spotify.com/v1/me/shows?limit=${limit}&offset=${offset}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetSavedShowsResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: {
        shows: (data.items || []).map((item: any) => ({
          added_at: item.added_at,
          show: {
            id: item.show.id,
            name: item.show.name,
            publisher: item.show.publisher || '',
            total_episodes: item.show.total_episodes || 0,
            image_url: item.show.images?.[0]?.url || null,
            external_url: item.show.external_urls?.spotify || '',
          },
        })),
        total: data.total || 0,
        next: data.next || null,
      },
    }
  },

  outputs: {
    shows: { type: 'json', description: 'List of saved shows' },
    total: { type: 'number', description: 'Total saved shows' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_saved_tracks.ts]---
Location: sim-main/apps/sim/tools/spotify/get_saved_tracks.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetSavedTracksParams, SpotifyGetSavedTracksResponse } from './types'

export const spotifyGetSavedTracksTool: ToolConfig<
  SpotifyGetSavedTracksParams,
  SpotifyGetSavedTracksResponse
> = {
  id: 'spotify_get_saved_tracks',
  name: 'Spotify Get Saved Tracks',
  description: "Get the current user's saved/liked tracks from their library.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-read'],
  },

  params: {
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
      description: 'Index of the first track to return',
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
      let url = `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`
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

  transformResponse: async (response): Promise<SpotifyGetSavedTracksResponse> => {
    const data = await response.json()

    const tracks = (data.items || []).map((item: any) => ({
      added_at: item.added_at,
      track: {
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
        album: {
          id: item.track.album?.id || '',
          name: item.track.album?.name || '',
          image_url: item.track.album?.images?.[0]?.url || null,
        },
        duration_ms: item.track.duration_ms,
        popularity: item.track.popularity,
        external_url: item.track.external_urls?.spotify || '',
      },
    }))

    return {
      success: true,
      output: {
        tracks,
        total: data.total || tracks.length,
        next: data.next || null,
      },
    }
  },

  outputs: {
    tracks: {
      type: 'array',
      description: "User's saved tracks",
      items: {
        type: 'object',
        properties: {
          added_at: { type: 'string', description: 'When the track was saved' },
          track: { type: 'object', description: 'Track information' },
        },
      },
    },
    total: { type: 'number', description: 'Total number of saved tracks' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_show.ts]---
Location: sim-main/apps/sim/tools/spotify/get_show.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetShowParams {
  accessToken: string
  showId: string
  market?: string
}

interface SpotifyGetShowResponse extends ToolResponse {
  output: {
    id: string
    name: string
    description: string
    publisher: string
    total_episodes: number
    explicit: boolean
    languages: string[]
    image_url: string | null
    external_url: string
  }
}

export const spotifyGetShowTool: ToolConfig<SpotifyGetShowParams, SpotifyGetShowResponse> = {
  id: 'spotify_get_show',
  name: 'Spotify Get Show',
  description: 'Get details for a podcast show.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-playback-position'],
  },

  params: {
    showId: {
      type: 'string',
      required: true,
      description: 'The Spotify show ID',
    },
    market: {
      type: 'string',
      required: false,
      description: 'ISO country code for market',
    },
  },

  request: {
    url: (params) => {
      let url = `https://api.spotify.com/v1/shows/${params.showId}`
      if (params.market) url += `?market=${params.market}`
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetShowResponse> => {
    const show = await response.json()
    return {
      success: true,
      output: {
        id: show.id,
        name: show.name,
        description: show.description || '',
        publisher: show.publisher || '',
        total_episodes: show.total_episodes || 0,
        explicit: show.explicit || false,
        languages: show.languages || [],
        image_url: show.images?.[0]?.url || null,
        external_url: show.external_urls?.spotify || '',
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Show ID' },
    name: { type: 'string', description: 'Show name' },
    description: { type: 'string', description: 'Show description' },
    publisher: { type: 'string', description: 'Publisher name' },
    total_episodes: { type: 'number', description: 'Total episodes' },
    explicit: { type: 'boolean', description: 'Contains explicit content' },
    languages: { type: 'json', description: 'Languages' },
    image_url: { type: 'string', description: 'Cover image URL' },
    external_url: { type: 'string', description: 'Spotify URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_shows.ts]---
Location: sim-main/apps/sim/tools/spotify/get_shows.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetShowsParams {
  accessToken: string
  showIds: string
  market?: string
}

interface SpotifyGetShowsResponse extends ToolResponse {
  output: {
    shows: Array<{
      id: string
      name: string
      publisher: string
      total_episodes: number
      image_url: string | null
      external_url: string
    }>
  }
}

export const spotifyGetShowsTool: ToolConfig<SpotifyGetShowsParams, SpotifyGetShowsResponse> = {
  id: 'spotify_get_shows',
  name: 'Spotify Get Multiple Shows',
  description: 'Get details for multiple podcast shows.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-playback-position'],
  },

  params: {
    showIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated show IDs (max 50)',
    },
    market: {
      type: 'string',
      required: false,
      description: 'ISO country code for market',
    },
  },

  request: {
    url: (params) => {
      const ids = params.showIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      let url = `https://api.spotify.com/v1/shows?ids=${ids}`
      if (params.market) url += `&market=${params.market}`
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetShowsResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: {
        shows: (data.shows || []).map((show: any) => ({
          id: show.id,
          name: show.name,
          publisher: show.publisher || '',
          total_episodes: show.total_episodes || 0,
          image_url: show.images?.[0]?.url || null,
          external_url: show.external_urls?.spotify || '',
        })),
      },
    }
  },

  outputs: {
    shows: { type: 'json', description: 'List of shows' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_show_episodes.ts]---
Location: sim-main/apps/sim/tools/spotify/get_show_episodes.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetShowEpisodesParams {
  accessToken: string
  showId: string
  limit?: number
  offset?: number
  market?: string
}

interface SpotifyGetShowEpisodesResponse extends ToolResponse {
  output: {
    episodes: Array<{
      id: string
      name: string
      description: string
      duration_ms: number
      release_date: string
      image_url: string | null
      external_url: string
    }>
    total: number
    next: string | null
  }
}

export const spotifyGetShowEpisodesTool: ToolConfig<
  SpotifyGetShowEpisodesParams,
  SpotifyGetShowEpisodesResponse
> = {
  id: 'spotify_get_show_episodes',
  name: 'Spotify Get Show Episodes',
  description: 'Get episodes from a podcast show.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-playback-position'],
  },

  params: {
    showId: {
      type: 'string',
      required: true,
      description: 'The Spotify show ID',
    },
    limit: {
      type: 'number',
      required: false,
      default: 20,
      description: 'Number of episodes to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      default: 0,
      description: 'Index of first episode to return',
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
      let url = `https://api.spotify.com/v1/shows/${params.showId}/episodes?limit=${limit}&offset=${offset}`
      if (params.market) url += `&market=${params.market}`
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetShowEpisodesResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: {
        episodes: (data.items || []).map((ep: any) => ({
          id: ep.id,
          name: ep.name,
          description: ep.description || '',
          duration_ms: ep.duration_ms || 0,
          release_date: ep.release_date || '',
          image_url: ep.images?.[0]?.url || null,
          external_url: ep.external_urls?.spotify || '',
        })),
        total: data.total || 0,
        next: data.next || null,
      },
    }
  },

  outputs: {
    episodes: { type: 'json', description: 'List of episodes' },
    total: { type: 'number', description: 'Total episodes' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_top_artists.ts]---
Location: sim-main/apps/sim/tools/spotify/get_top_artists.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetTopArtistsResponse, SpotifyGetTopItemsParams } from './types'

export const spotifyGetTopArtistsTool: ToolConfig<
  SpotifyGetTopItemsParams,
  SpotifyGetTopArtistsResponse
> = {
  id: 'spotify_get_top_artists',
  name: 'Spotify Get Top Artists',
  description: "Get the current user's top artists based on listening history.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-top-read'],
  },

  params: {
    time_range: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      default: 'medium_term',
      description: 'Time range: short_term (~4 weeks), medium_term (~6 months), long_term (years)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 20,
      description: 'Number of artists to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 0,
      description: 'Index of the first artist to return',
    },
  },

  request: {
    url: (params) => {
      const timeRange = params.time_range || 'medium_term'
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      const offset = params.offset || 0
      return `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}&offset=${offset}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetTopArtistsResponse> => {
    const data = await response.json()

    const artists = (data.items || []).map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres || [],
      popularity: artist.popularity,
      followers: artist.followers?.total || 0,
      image_url: artist.images?.[0]?.url || null,
      external_url: artist.external_urls?.spotify || '',
    }))

    return {
      success: true,
      output: {
        artists,
        total: data.total || artists.length,
        next: data.next || null,
      },
    }
  },

  outputs: {
    artists: {
      type: 'array',
      description: "User's top artists",
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Spotify artist ID' },
          name: { type: 'string', description: 'Artist name' },
          genres: { type: 'array', description: 'List of genres' },
          popularity: { type: 'number', description: 'Popularity score' },
          followers: { type: 'number', description: 'Number of followers' },
          image_url: { type: 'string', description: 'Artist image URL' },
          external_url: { type: 'string', description: 'Spotify URL' },
        },
      },
    },
    total: { type: 'number', description: 'Total number of top artists' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_top_tracks.ts]---
Location: sim-main/apps/sim/tools/spotify/get_top_tracks.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetTopItemsParams, SpotifyGetTopTracksResponse } from './types'

export const spotifyGetTopTracksTool: ToolConfig<
  SpotifyGetTopItemsParams,
  SpotifyGetTopTracksResponse
> = {
  id: 'spotify_get_top_tracks',
  name: 'Spotify Get Top Tracks',
  description: "Get the current user's top tracks based on listening history.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-top-read'],
  },

  params: {
    time_range: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      default: 'medium_term',
      description: 'Time range: short_term (~4 weeks), medium_term (~6 months), long_term (years)',
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
      description: 'Index of the first track to return',
    },
  },

  request: {
    url: (params) => {
      const timeRange = params.time_range || 'medium_term'
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      const offset = params.offset || 0
      return `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}&offset=${offset}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetTopTracksResponse> => {
    const data = await response.json()

    const tracks = (data.items || []).map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
      album: {
        id: track.album?.id || '',
        name: track.album?.name || '',
        image_url: track.album?.images?.[0]?.url || null,
      },
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      external_url: track.external_urls?.spotify || '',
    }))

    return {
      success: true,
      output: {
        tracks,
        total: data.total || tracks.length,
        next: data.next || null,
      },
    }
  },

  outputs: {
    tracks: {
      type: 'array',
      description: "User's top tracks",
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Spotify track ID' },
          name: { type: 'string', description: 'Track name' },
          artists: { type: 'array', description: 'List of artists' },
          album: { type: 'object', description: 'Album information' },
          duration_ms: { type: 'number', description: 'Duration in milliseconds' },
          popularity: { type: 'number', description: 'Popularity score' },
          external_url: { type: 'string', description: 'Spotify URL' },
        },
      },
    },
    total: { type: 'number', description: 'Total number of top tracks' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_track.ts]---
Location: sim-main/apps/sim/tools/spotify/get_track.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetTrackParams, SpotifyGetTrackResponse } from './types'

export const spotifyGetTrackTool: ToolConfig<SpotifyGetTrackParams, SpotifyGetTrackResponse> = {
  id: 'spotify_get_track',
  name: 'Spotify Get Track',
  description: 'Get detailed information about a specific track on Spotify by its ID.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
  },

  params: {
    trackId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The Spotify ID of the track',
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
      let url = `https://api.spotify.com/v1/tracks/${params.trackId}`
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

  transformResponse: async (response): Promise<SpotifyGetTrackResponse> => {
    const track = await response.json()

    return {
      success: true,
      output: {
        id: track.id,
        name: track.name,
        artists: track.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
        album: {
          id: track.album?.id || '',
          name: track.album?.name || '',
          image_url: track.album?.images?.[0]?.url || null,
        },
        duration_ms: track.duration_ms,
        explicit: track.explicit,
        popularity: track.popularity,
        preview_url: track.preview_url,
        external_url: track.external_urls?.spotify || '',
        uri: track.uri,
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Spotify track ID' },
    name: { type: 'string', description: 'Track name' },
    artists: { type: 'array', description: 'List of artists' },
    album: { type: 'object', description: 'Album information' },
    duration_ms: { type: 'number', description: 'Track duration in milliseconds' },
    explicit: { type: 'boolean', description: 'Whether the track has explicit content' },
    popularity: { type: 'number', description: 'Popularity score (0-100)' },
    preview_url: { type: 'string', description: 'URL to 30-second preview', optional: true },
    external_url: { type: 'string', description: 'Spotify URL' },
    uri: { type: 'string', description: 'Spotify URI for the track' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_tracks.ts]---
Location: sim-main/apps/sim/tools/spotify/get_tracks.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetTracksParams, SpotifyGetTracksResponse } from './types'

export const spotifyGetTracksTool: ToolConfig<SpotifyGetTracksParams, SpotifyGetTracksResponse> = {
  id: 'spotify_get_tracks',
  name: 'Spotify Get Multiple Tracks',
  description: 'Get detailed information about multiple tracks on Spotify by their IDs (up to 50).',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
  },

  params: {
    trackIds: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of Spotify track IDs (max 50)',
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
      let url = `https://api.spotify.com/v1/tracks?ids=${encodeURIComponent(params.trackIds)}`
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

  transformResponse: async (response): Promise<SpotifyGetTracksResponse> => {
    const data = await response.json()

    const tracks = (data.tracks || [])
      .filter((t: any) => t !== null)
      .map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
        album: {
          id: track.album?.id || '',
          name: track.album?.name || '',
          image_url: track.album?.images?.[0]?.url || null,
        },
        duration_ms: track.duration_ms,
        explicit: track.explicit,
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
      description: 'List of tracks',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Spotify track ID' },
          name: { type: 'string', description: 'Track name' },
          artists: { type: 'array', description: 'List of artists' },
          album: { type: 'object', description: 'Album information' },
          duration_ms: { type: 'number', description: 'Track duration in milliseconds' },
          explicit: { type: 'boolean', description: 'Whether the track has explicit content' },
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

---[FILE: get_user_playlists.ts]---
Location: sim-main/apps/sim/tools/spotify/get_user_playlists.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetUserPlaylistsParams, SpotifyGetUserPlaylistsResponse } from './types'

export const spotifyGetUserPlaylistsTool: ToolConfig<
  SpotifyGetUserPlaylistsParams,
  SpotifyGetUserPlaylistsResponse
> = {
  id: 'spotify_get_user_playlists',
  name: 'Spotify Get User Playlists',
  description: "Get the current user's playlists on Spotify.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['playlist-read-private', 'playlist-read-collaborative'],
  },

  params: {
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 20,
      description: 'Maximum number of playlists to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 0,
      description: 'Index of the first playlist to return',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      const offset = params.offset || 0
      return `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetUserPlaylistsResponse> => {
    const data = await response.json()

    const playlists = (data.items || []).map((playlist: any) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      public: playlist.public,
      collaborative: playlist.collaborative,
      owner: playlist.owner?.display_name || '',
      total_tracks: playlist.tracks?.total || 0,
      image_url: playlist.images?.[0]?.url || null,
      external_url: playlist.external_urls?.spotify || '',
    }))

    return {
      success: true,
      output: {
        playlists,
        total: data.total || playlists.length,
        next: data.next || null,
      },
    }
  },

  outputs: {
    playlists: {
      type: 'array',
      description: "User's playlists",
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Spotify playlist ID' },
          name: { type: 'string', description: 'Playlist name' },
          description: { type: 'string', description: 'Playlist description' },
          public: { type: 'boolean', description: 'Whether public' },
          collaborative: { type: 'boolean', description: 'Whether collaborative' },
          owner: { type: 'string', description: 'Owner display name' },
          total_tracks: { type: 'number', description: 'Number of tracks' },
          image_url: { type: 'string', description: 'Cover image URL' },
          external_url: { type: 'string', description: 'Spotify URL' },
        },
      },
    },
    total: { type: 'number', description: 'Total number of playlists' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_user_profile.ts]---
Location: sim-main/apps/sim/tools/spotify/get_user_profile.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetUserProfileParams {
  accessToken: string
  userId: string
}

interface SpotifyGetUserProfileResponse extends ToolResponse {
  output: {
    id: string
    display_name: string | null
    followers: number
    image_url: string | null
    external_url: string
  }
}

export const spotifyGetUserProfileTool: ToolConfig<
  SpotifyGetUserProfileParams,
  SpotifyGetUserProfileResponse
> = {
  id: 'spotify_get_user_profile',
  name: 'Spotify Get User Profile',
  description: "Get a user's public profile.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-private'],
  },

  params: {
    userId: {
      type: 'string',
      required: true,
      description: 'The Spotify user ID',
    },
  },

  request: {
    url: (params) => `https://api.spotify.com/v1/users/${params.userId}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetUserProfileResponse> => {
    const user = await response.json()
    return {
      success: true,
      output: {
        id: user.id,
        display_name: user.display_name || null,
        followers: user.followers?.total || 0,
        image_url: user.images?.[0]?.url || null,
        external_url: user.external_urls?.spotify || '',
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'User ID' },
    display_name: { type: 'string', description: 'Display name' },
    followers: { type: 'number', description: 'Number of followers' },
    image_url: { type: 'string', description: 'Profile image URL' },
    external_url: { type: 'string', description: 'Spotify URL' },
  },
}
```

--------------------------------------------------------------------------------

````
