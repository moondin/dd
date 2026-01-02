---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 756
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 756 of 933)

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

---[FILE: get_categories.ts]---
Location: sim-main/apps/sim/tools/spotify/get_categories.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetCategoriesParams, SpotifyGetCategoriesResponse } from './types'

export const spotifyGetCategoriesTool: ToolConfig<
  SpotifyGetCategoriesParams,
  SpotifyGetCategoriesResponse
> = {
  id: 'spotify_get_categories',
  name: 'Spotify Get Categories',
  description: 'Get a list of browse categories used to tag items in Spotify.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-private'],
  },

  params: {
    country: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ISO 3166-1 alpha-2 country code (e.g., "US", "GB")',
    },
    locale: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Locale code (e.g., "en_US", "es_MX")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 20,
      description: 'Number of categories to return (1-50)',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      let url = `https://api.spotify.com/v1/browse/categories?limit=${limit}`
      if (params.country) {
        url += `&country=${params.country}`
      }
      if (params.locale) {
        url += `&locale=${params.locale}`
      }
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetCategoriesResponse> => {
    const data = await response.json()

    const categories = (data.categories?.items || []).map((category: any) => ({
      id: category.id,
      name: category.name,
      icon_url: category.icons?.[0]?.url || null,
    }))

    return {
      success: true,
      output: {
        categories,
        total: data.categories?.total || 0,
      },
    }
  },

  outputs: {
    categories: { type: 'json', description: 'List of browse categories' },
    total: { type: 'number', description: 'Total number of categories' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_currently_playing.ts]---
Location: sim-main/apps/sim/tools/spotify/get_currently_playing.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetCurrentlyPlayingParams {
  accessToken: string
  market?: string
}

interface SpotifyGetCurrentlyPlayingResponse extends ToolResponse {
  output: {
    is_playing: boolean
    progress_ms: number | null
    track: {
      id: string
      name: string
      artists: Array<{ id: string; name: string }>
      album: {
        id: string
        name: string
        image_url: string | null
      }
      duration_ms: number
      external_url: string
    } | null
  }
}

export const spotifyGetCurrentlyPlayingTool: ToolConfig<
  SpotifyGetCurrentlyPlayingParams,
  SpotifyGetCurrentlyPlayingResponse
> = {
  id: 'spotify_get_currently_playing',
  name: 'Spotify Get Currently Playing',
  description: "Get the user's currently playing track.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-currently-playing'],
  },

  params: {
    market: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ISO country code for market',
    },
  },

  request: {
    url: (params) => {
      let url = 'https://api.spotify.com/v1/me/player/currently-playing'
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

  transformResponse: async (response): Promise<SpotifyGetCurrentlyPlayingResponse> => {
    if (response.status === 204) {
      return {
        success: true,
        output: {
          is_playing: false,
          progress_ms: null,
          track: null,
        },
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        is_playing: data.is_playing || false,
        progress_ms: data.progress_ms || null,
        track: data.item
          ? {
              id: data.item.id,
              name: data.item.name,
              artists: data.item.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
              album: {
                id: data.item.album?.id || '',
                name: data.item.album?.name || '',
                image_url: data.item.album?.images?.[0]?.url || null,
              },
              duration_ms: data.item.duration_ms,
              external_url: data.item.external_urls?.spotify || '',
            }
          : null,
      },
    }
  },

  outputs: {
    is_playing: { type: 'boolean', description: 'Whether playback is active' },
    progress_ms: { type: 'number', description: 'Current position in track (ms)', optional: true },
    track: { type: 'json', description: 'Currently playing track', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_current_user.ts]---
Location: sim-main/apps/sim/tools/spotify/get_current_user.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetCurrentUserParams, SpotifyGetCurrentUserResponse } from './types'

export const spotifyGetCurrentUserTool: ToolConfig<
  SpotifyGetCurrentUserParams,
  SpotifyGetCurrentUserResponse
> = {
  id: 'spotify_get_current_user',
  name: 'Spotify Get Current User',
  description: "Get the current user's Spotify profile information.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-private', 'user-read-email'],
  },

  params: {},

  request: {
    url: () => 'https://api.spotify.com/v1/me',
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetCurrentUserResponse> => {
    const user = await response.json()

    return {
      success: true,
      output: {
        id: user.id,
        display_name: user.display_name || '',
        email: user.email || null,
        country: user.country || null,
        product: user.product || null,
        followers: user.followers?.total || 0,
        image_url: user.images?.[0]?.url || null,
        external_url: user.external_urls?.spotify || '',
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Spotify user ID' },
    display_name: { type: 'string', description: 'Display name' },
    email: { type: 'string', description: 'Email address', optional: true },
    country: { type: 'string', description: 'Country code', optional: true },
    product: { type: 'string', description: 'Subscription level (free, premium)', optional: true },
    followers: { type: 'number', description: 'Number of followers' },
    image_url: { type: 'string', description: 'Profile image URL', optional: true },
    external_url: { type: 'string', description: 'Spotify profile URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_devices.ts]---
Location: sim-main/apps/sim/tools/spotify/get_devices.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetDevicesParams, SpotifyGetDevicesResponse } from './types'

export const spotifyGetDevicesTool: ToolConfig<SpotifyGetDevicesParams, SpotifyGetDevicesResponse> =
  {
    id: 'spotify_get_devices',
    name: 'Spotify Get Devices',
    description: "Get the user's available Spotify playback devices.",
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'spotify',
      requiredScopes: ['user-read-playback-state'],
    },

    params: {},

    request: {
      url: () => 'https://api.spotify.com/v1/me/player/devices',
      method: 'GET',
      headers: (params) => ({
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }),
    },

    transformResponse: async (response): Promise<SpotifyGetDevicesResponse> => {
      const data = await response.json()

      const devices = (data.devices || []).map((device: any) => ({
        id: device.id,
        is_active: device.is_active,
        is_private_session: device.is_private_session,
        is_restricted: device.is_restricted,
        name: device.name,
        type: device.type,
        volume_percent: device.volume_percent,
      }))

      return {
        success: true,
        output: {
          devices,
        },
      }
    },

    outputs: {
      devices: {
        type: 'array',
        description: 'Available playback devices',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Device ID' },
            is_active: { type: 'boolean', description: 'Whether device is active' },
            is_private_session: { type: 'boolean', description: 'Whether in private session' },
            is_restricted: { type: 'boolean', description: 'Whether device is restricted' },
            name: { type: 'string', description: 'Device name' },
            type: { type: 'string', description: 'Device type (Computer, Smartphone, etc.)' },
            volume_percent: { type: 'number', description: 'Current volume (0-100)' },
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_episode.ts]---
Location: sim-main/apps/sim/tools/spotify/get_episode.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetEpisodeParams {
  accessToken: string
  episodeId: string
  market?: string
}

interface SpotifyGetEpisodeResponse extends ToolResponse {
  output: {
    id: string
    name: string
    description: string
    duration_ms: number
    release_date: string
    explicit: boolean
    show: { id: string; name: string; publisher: string }
    image_url: string | null
    external_url: string
  }
}

export const spotifyGetEpisodeTool: ToolConfig<SpotifyGetEpisodeParams, SpotifyGetEpisodeResponse> =
  {
    id: 'spotify_get_episode',
    name: 'Spotify Get Episode',
    description: 'Get details for a podcast episode.',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'spotify',
      requiredScopes: ['user-read-playback-position'],
    },

    params: {
      episodeId: {
        type: 'string',
        required: true,
        description: 'The Spotify episode ID',
      },
      market: {
        type: 'string',
        required: false,
        description: 'ISO country code for market',
      },
    },

    request: {
      url: (params) => {
        let url = `https://api.spotify.com/v1/episodes/${params.episodeId}`
        if (params.market) url += `?market=${params.market}`
        return url
      },
      method: 'GET',
      headers: (params) => ({
        Authorization: `Bearer ${params.accessToken}`,
      }),
    },

    transformResponse: async (response): Promise<SpotifyGetEpisodeResponse> => {
      const ep = await response.json()
      return {
        success: true,
        output: {
          id: ep.id,
          name: ep.name,
          description: ep.description || '',
          duration_ms: ep.duration_ms || 0,
          release_date: ep.release_date || '',
          explicit: ep.explicit || false,
          show: {
            id: ep.show?.id || '',
            name: ep.show?.name || '',
            publisher: ep.show?.publisher || '',
          },
          image_url: ep.images?.[0]?.url || null,
          external_url: ep.external_urls?.spotify || '',
        },
      }
    },

    outputs: {
      id: { type: 'string', description: 'Episode ID' },
      name: { type: 'string', description: 'Episode name' },
      description: { type: 'string', description: 'Episode description' },
      duration_ms: { type: 'number', description: 'Duration in ms' },
      release_date: { type: 'string', description: 'Release date' },
      explicit: { type: 'boolean', description: 'Contains explicit content' },
      show: { type: 'json', description: 'Parent show info' },
      image_url: { type: 'string', description: 'Cover image URL' },
      external_url: { type: 'string', description: 'Spotify URL' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_episodes.ts]---
Location: sim-main/apps/sim/tools/spotify/get_episodes.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetEpisodesParams {
  accessToken: string
  episodeIds: string
  market?: string
}

interface SpotifyGetEpisodesResponse extends ToolResponse {
  output: {
    episodes: Array<{
      id: string
      name: string
      description: string
      duration_ms: number
      release_date: string
      show: { id: string; name: string }
      image_url: string | null
      external_url: string
    }>
  }
}

export const spotifyGetEpisodesTool: ToolConfig<
  SpotifyGetEpisodesParams,
  SpotifyGetEpisodesResponse
> = {
  id: 'spotify_get_episodes',
  name: 'Spotify Get Multiple Episodes',
  description: 'Get details for multiple podcast episodes.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-playback-position'],
  },

  params: {
    episodeIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated episode IDs (max 50)',
    },
    market: {
      type: 'string',
      required: false,
      description: 'ISO country code for market',
    },
  },

  request: {
    url: (params) => {
      const ids = params.episodeIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      let url = `https://api.spotify.com/v1/episodes?ids=${ids}`
      if (params.market) url += `&market=${params.market}`
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetEpisodesResponse> => {
    const data = await response.json()
    return {
      success: true,
      output: {
        episodes: (data.episodes || []).map((ep: any) => ({
          id: ep.id,
          name: ep.name,
          description: ep.description || '',
          duration_ms: ep.duration_ms || 0,
          release_date: ep.release_date || '',
          show: { id: ep.show?.id || '', name: ep.show?.name || '' },
          image_url: ep.images?.[0]?.url || null,
          external_url: ep.external_urls?.spotify || '',
        })),
      },
    }
  },

  outputs: {
    episodes: { type: 'json', description: 'List of episodes' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_followed_artists.ts]---
Location: sim-main/apps/sim/tools/spotify/get_followed_artists.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetFollowedArtistsParams {
  accessToken: string
  limit?: number
  after?: string
}

interface SpotifyGetFollowedArtistsResponse extends ToolResponse {
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
    total: number
    next: string | null
  }
}

export const spotifyGetFollowedArtistsTool: ToolConfig<
  SpotifyGetFollowedArtistsParams,
  SpotifyGetFollowedArtistsResponse
> = {
  id: 'spotify_get_followed_artists',
  name: 'Spotify Get Followed Artists',
  description: "Get the user's followed artists.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-follow-read'],
  },

  params: {
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 20,
      description: 'Number of artists to return (1-50)',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Cursor for pagination (last artist ID from previous request)',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      let url = `https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`
      if (params.after) {
        url += `&after=${params.after}`
      }
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetFollowedArtistsResponse> => {
    const data = await response.json()

    const artists = (data.artists?.items || []).map((artist: any) => ({
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
      output: {
        artists,
        total: data.artists?.total || 0,
        next: data.artists?.cursors?.after || null,
      },
    }
  },

  outputs: {
    artists: { type: 'json', description: 'List of followed artists' },
    total: { type: 'number', description: 'Total number of followed artists' },
    next: { type: 'string', description: 'Cursor for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_markets.ts]---
Location: sim-main/apps/sim/tools/spotify/get_markets.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetMarketsParams {
  accessToken: string
}

interface SpotifyGetMarketsResponse extends ToolResponse {
  output: {
    markets: string[]
  }
}

export const spotifyGetMarketsTool: ToolConfig<SpotifyGetMarketsParams, SpotifyGetMarketsResponse> =
  {
    id: 'spotify_get_markets',
    name: 'Spotify Get Available Markets',
    description: 'Get the list of markets where Spotify is available.',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'spotify',
      requiredScopes: ['user-read-private'],
    },

    params: {},

    request: {
      url: () => 'https://api.spotify.com/v1/markets',
      method: 'GET',
      headers: (params) => ({
        Authorization: `Bearer ${params.accessToken}`,
      }),
    },

    transformResponse: async (response): Promise<SpotifyGetMarketsResponse> => {
      const data = await response.json()
      return {
        success: true,
        output: { markets: data.markets || [] },
      }
    },

    outputs: {
      markets: { type: 'json', description: 'List of ISO country codes' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_new_releases.ts]---
Location: sim-main/apps/sim/tools/spotify/get_new_releases.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetNewReleasesParams, SpotifyGetNewReleasesResponse } from './types'

export const spotifyGetNewReleasesTool: ToolConfig<
  SpotifyGetNewReleasesParams,
  SpotifyGetNewReleasesResponse
> = {
  id: 'spotify_get_new_releases',
  name: 'Spotify Get New Releases',
  description: 'Get a list of new album releases featured in Spotify.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-private'],
  },

  params: {
    country: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ISO 3166-1 alpha-2 country code (e.g., "US", "GB")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 20,
      description: 'Number of releases to return (1-50)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 0,
      description: 'Index of first release to return',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      const offset = params.offset || 0
      let url = `https://api.spotify.com/v1/browse/new-releases?limit=${limit}&offset=${offset}`
      if (params.country) {
        url += `&country=${params.country}`
      }
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetNewReleasesResponse> => {
    const data = await response.json()

    const albums = (data.albums?.items || []).map((album: any) => ({
      id: album.id,
      name: album.name,
      artists: album.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
      release_date: album.release_date,
      total_tracks: album.total_tracks,
      album_type: album.album_type,
      image_url: album.images?.[0]?.url || null,
      external_url: album.external_urls?.spotify || '',
    }))

    return {
      success: true,
      output: {
        albums,
        total: data.albums?.total || 0,
        next: data.albums?.next || null,
      },
    }
  },

  outputs: {
    albums: { type: 'json', description: 'List of new releases' },
    total: { type: 'number', description: 'Total number of new releases' },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_playback_state.ts]---
Location: sim-main/apps/sim/tools/spotify/get_playback_state.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetPlaybackStateParams, SpotifyGetPlaybackStateResponse } from './types'

export const spotifyGetPlaybackStateTool: ToolConfig<
  SpotifyGetPlaybackStateParams,
  SpotifyGetPlaybackStateResponse
> = {
  id: 'spotify_get_playback_state',
  name: 'Spotify Get Playback State',
  description: 'Get the current playback state including device, track, and progress.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-playback-state'],
  },

  params: {
    market: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ISO 3166-1 alpha-2 country code',
    },
  },

  request: {
    url: (params) => {
      let url = 'https://api.spotify.com/v1/me/player'
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

  transformResponse: async (response): Promise<SpotifyGetPlaybackStateResponse> => {
    if (response.status === 204) {
      return {
        success: true,
        output: {
          is_playing: false,
          device: null,
          progress_ms: null,
          currently_playing_type: 'unknown',
          shuffle_state: false,
          repeat_state: 'off',
          track: null,
        },
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        is_playing: data.is_playing || false,
        device: data.device
          ? {
              id: data.device.id,
              name: data.device.name,
              type: data.device.type,
              volume_percent: data.device.volume_percent,
            }
          : null,
        progress_ms: data.progress_ms,
        currently_playing_type: data.currently_playing_type || 'unknown',
        shuffle_state: data.shuffle_state || false,
        repeat_state: data.repeat_state || 'off',
        track: data.item
          ? {
              id: data.item.id,
              name: data.item.name,
              artists: data.item.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
              album: {
                id: data.item.album?.id || '',
                name: data.item.album?.name || '',
                image_url: data.item.album?.images?.[0]?.url || null,
              },
              duration_ms: data.item.duration_ms,
            }
          : null,
      },
    }
  },

  outputs: {
    is_playing: { type: 'boolean', description: 'Whether playback is active' },
    device: { type: 'object', description: 'Active device information', optional: true },
    progress_ms: { type: 'number', description: 'Progress in milliseconds', optional: true },
    currently_playing_type: { type: 'string', description: 'Type of content playing' },
    shuffle_state: { type: 'boolean', description: 'Whether shuffle is enabled' },
    repeat_state: { type: 'string', description: 'Repeat mode (off, track, context)' },
    track: { type: 'object', description: 'Currently playing track', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_playlist.ts]---
Location: sim-main/apps/sim/tools/spotify/get_playlist.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetPlaylistParams, SpotifyGetPlaylistResponse } from './types'

export const spotifyGetPlaylistTool: ToolConfig<
  SpotifyGetPlaylistParams,
  SpotifyGetPlaylistResponse
> = {
  id: 'spotify_get_playlist',
  name: 'Spotify Get Playlist',
  description: 'Get detailed information about a playlist on Spotify by its ID.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
  },

  params: {
    playlistId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The Spotify ID of the playlist',
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
      let url = `https://api.spotify.com/v1/playlists/${params.playlistId}`
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

  transformResponse: async (response): Promise<SpotifyGetPlaylistResponse> => {
    const playlist = await response.json()

    return {
      success: true,
      output: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        public: playlist.public,
        collaborative: playlist.collaborative,
        owner: {
          id: playlist.owner?.id || '',
          display_name: playlist.owner?.display_name || '',
        },
        image_url: playlist.images?.[0]?.url || null,
        total_tracks: playlist.tracks?.total || 0,
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
    collaborative: { type: 'boolean', description: 'Whether the playlist is collaborative' },
    owner: { type: 'object', description: 'Playlist owner information' },
    image_url: { type: 'string', description: 'Playlist cover image URL', optional: true },
    total_tracks: { type: 'number', description: 'Total number of tracks' },
    snapshot_id: { type: 'string', description: 'Playlist snapshot ID for versioning' },
    external_url: { type: 'string', description: 'Spotify URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_playlist_cover.ts]---
Location: sim-main/apps/sim/tools/spotify/get_playlist_cover.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetPlaylistCoverParams {
  accessToken: string
  playlistId: string
}

interface SpotifyGetPlaylistCoverResponse extends ToolResponse {
  output: {
    images: Array<{
      url: string
      width: number | null
      height: number | null
    }>
  }
}

export const spotifyGetPlaylistCoverTool: ToolConfig<
  SpotifyGetPlaylistCoverParams,
  SpotifyGetPlaylistCoverResponse
> = {
  id: 'spotify_get_playlist_cover',
  name: 'Spotify Get Playlist Cover',
  description: "Get a playlist's cover image.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['playlist-read-private'],
  },

  params: {
    playlistId: {
      type: 'string',
      required: true,
      description: 'The Spotify playlist ID',
    },
  },

  request: {
    url: (params) => `https://api.spotify.com/v1/playlists/${params.playlistId}/images`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetPlaylistCoverResponse> => {
    const images = await response.json()
    return {
      success: true,
      output: {
        images: (images || []).map((img: any) => ({
          url: img.url,
          width: img.width || null,
          height: img.height || null,
        })),
      },
    }
  },

  outputs: {
    images: { type: 'json', description: 'List of cover images' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_playlist_tracks.ts]---
Location: sim-main/apps/sim/tools/spotify/get_playlist_tracks.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetPlaylistTracksParams, SpotifyGetPlaylistTracksResponse } from './types'

export const spotifyGetPlaylistTracksTool: ToolConfig<
  SpotifyGetPlaylistTracksParams,
  SpotifyGetPlaylistTracksResponse
> = {
  id: 'spotify_get_playlist_tracks',
  name: 'Spotify Get Playlist Tracks',
  description: 'Get the tracks in a Spotify playlist.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
  },

  params: {
    playlistId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The Spotify ID of the playlist',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 50,
      description: 'Maximum number of tracks to return (1-100)',
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
      description: 'ISO 3166-1 alpha-2 country code for track availability',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 50, 1), 100)
      const offset = params.offset || 0
      let url = `https://api.spotify.com/v1/playlists/${params.playlistId}/tracks?limit=${limit}&offset=${offset}`
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

  transformResponse: async (response): Promise<SpotifyGetPlaylistTracksResponse> => {
    const data = await response.json()

    const tracks = (data.items || [])
      .filter((item: any) => item.track !== null)
      .map((item: any) => ({
        added_at: item.added_at,
        added_by: item.added_by?.id || '',
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
      description: 'List of tracks in the playlist',
      items: {
        type: 'object',
        properties: {
          added_at: { type: 'string', description: 'When the track was added' },
          added_by: { type: 'string', description: 'User ID who added the track' },
          track: { type: 'object', description: 'Track information' },
        },
      },
    },
    total: { type: 'number', description: 'Total number of tracks in playlist' },
    next: { type: 'string', description: 'URL for next page of results', optional: true },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_queue.ts]---
Location: sim-main/apps/sim/tools/spotify/get_queue.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyGetQueueParams {
  accessToken: string
}

interface SpotifyGetQueueResponse extends ToolResponse {
  output: {
    currently_playing: {
      id: string
      name: string
      artists: Array<{ id: string; name: string }>
      album: {
        id: string
        name: string
        image_url: string | null
      }
      duration_ms: number
    } | null
    queue: Array<{
      id: string
      name: string
      artists: Array<{ id: string; name: string }>
      album: {
        id: string
        name: string
        image_url: string | null
      }
      duration_ms: number
    }>
  }
}

export const spotifyGetQueueTool: ToolConfig<SpotifyGetQueueParams, SpotifyGetQueueResponse> = {
  id: 'spotify_get_queue',
  name: 'Spotify Get Queue',
  description: "Get the user's playback queue.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-playback-state'],
  },

  params: {},

  request: {
    url: () => 'https://api.spotify.com/v1/me/player/queue',
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetQueueResponse> => {
    const data = await response.json()

    const formatTrack = (track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
      album: {
        id: track.album?.id || '',
        name: track.album?.name || '',
        image_url: track.album?.images?.[0]?.url || null,
      },
      duration_ms: track.duration_ms,
    })

    return {
      success: true,
      output: {
        currently_playing: data.currently_playing ? formatTrack(data.currently_playing) : null,
        queue: (data.queue || []).map(formatTrack),
      },
    }
  },

  outputs: {
    currently_playing: { type: 'json', description: 'Currently playing track', optional: true },
    queue: { type: 'json', description: 'Upcoming tracks in queue' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_recently_played.ts]---
Location: sim-main/apps/sim/tools/spotify/get_recently_played.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyGetRecentlyPlayedParams, SpotifyGetRecentlyPlayedResponse } from './types'

export const spotifyGetRecentlyPlayedTool: ToolConfig<
  SpotifyGetRecentlyPlayedParams,
  SpotifyGetRecentlyPlayedResponse
> = {
  id: 'spotify_get_recently_played',
  name: 'Spotify Get Recently Played',
  description: "Get the user's recently played tracks.",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-read-recently-played'],
  },

  params: {
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 20,
      description: 'Number of tracks to return (1-50)',
    },
    after: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Unix timestamp in milliseconds. Returns items after this cursor.',
    },
    before: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Unix timestamp in milliseconds. Returns items before this cursor.',
    },
  },

  request: {
    url: (params) => {
      const limit = Math.min(Math.max(params.limit || 20, 1), 50)
      let url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`
      if (params.after) {
        url += `&after=${params.after}`
      }
      if (params.before) {
        url += `&before=${params.before}`
      }
      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<SpotifyGetRecentlyPlayedResponse> => {
    const data = await response.json()

    const items = (data.items || []).map((item: any) => ({
      played_at: item.played_at,
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
        external_url: item.track.external_urls?.spotify || '',
      },
    }))

    return {
      success: true,
      output: {
        items,
        next: data.next || null,
      },
    }
  },

  outputs: {
    items: {
      type: 'array',
      description: 'Recently played tracks',
      items: {
        type: 'object',
        properties: {
          played_at: { type: 'string', description: 'When the track was played' },
          track: { type: 'object', description: 'Track information' },
        },
      },
    },
    next: { type: 'string', description: 'URL for next page', optional: true },
  },
}
```

--------------------------------------------------------------------------------

````
