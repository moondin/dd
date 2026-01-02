---
source_txt: fullstack_samples/kord-master
converted_utc: 2025-12-18T10:45:21Z
part: 1
parts_total: 2
---

# FULLSTACK CODE DATABASE SAMPLES kord-master

## Extracted Reusable Patterns (Non-verbatim) (Part 1 of 2)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - kord-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/kord-master
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: server.ts]---
Location: kord-master/server.ts
Signals: Express
Excerpt (<=80 chars): import { Request, Response } from "express";

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: App.js]---
Location: kord-master/client/src/App.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import React, { useState } from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: App.test.js]---
Location: kord-master/client/src/App.test.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: kord-master/client/src/index.tsx
Signals: Redux/RTK
Excerpt (<=80 chars): import "./index.css";

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: serviceWorker.js]---
Location: kord-master/client/src/serviceWorker.js
Signals: N/A
Excerpt (<=80 chars):  export function register(config) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- register
- unregister
```

--------------------------------------------------------------------------------

---[FILE: active-image-overlay.js]---
Location: kord-master/client/src/components/active-image-overlay.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: add-to-playlist-form.js]---
Location: kord-master/client/src/components/add-to-playlist-form.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { useAlert } from "react-alert";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: artist-item.js]---
Location: kord-master/client/src/components/artist-item.js
Signals: React
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: artist-list.js]---
Location: kord-master/client/src/components/artist-list.js
Signals: React
Excerpt (<=80 chars): import PropTypes from "prop-types";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: artist-page.js]---
Location: kord-master/client/src/components/artist-page.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { forceCheck } from "react-lazyload";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: backdrop.js]---
Location: kord-master/client/src/components/backdrop.js
Signals: React
Excerpt (<=80 chars): import { CSSTransition } from "react-transition-group";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: buttons.js]---
Location: kord-master/client/src/components/buttons.js
Signals: React
Excerpt (<=80 chars):  export const Button = props => (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Button
- SubmitButton
- CancelButton
- DangerousButton
- SourceSearchButton
- SettingsTabButton
- ShowMoreResultsButton
- IconButton
- LargeIconButton
- PlayPauseButton
- LargePlayPauseButton
- ClearQueueButton
```

--------------------------------------------------------------------------------

---[FILE: connected-source-button.js]---
Location: kord-master/client/src/components/connected-source-button.js
Signals: React
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: controls-modal.js]---
Location: kord-master/client/src/components/controls-modal.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { useDispatch, useSelector } from "react-redux";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: delete-track-form.js]---
Location: kord-master/client/src/components/delete-track-form.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: expanded-player.js]---
Location: kord-master/client/src/components/expanded-player.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: fallback-component.js]---
Location: kord-master/client/src/components/fallback-component.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: form-checkbox.js]---
Location: kord-master/client/src/components/form-checkbox.js
Signals: React
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: image.js]---
Location: kord-master/client/src/components/image.js
Signals: React
Excerpt (<=80 chars): import PropTypes from "prop-types";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: kord-settings.js]---
Location: kord-master/client/src/components/kord-settings.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { useDispatch, useSelector } from "react-redux";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: library-router.js]---
Location: kord-master/client/src/components/library-router.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: library-view-page.js]---
Location: kord-master/client/src/components/library-view-page.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { useSelector } from "react-redux";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: loading-overlay.js]---
Location: kord-master/client/src/components/loading-overlay.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: loading-spinner.js]---
Location: kord-master/client/src/components/loading-spinner.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: minified-player.js]---
Location: kord-master/client/src/components/minified-player.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: modal.js]---
Location: kord-master/client/src/components/modal.js
Signals: React
Excerpt (<=80 chars): import { CSSTransition } from "react-transition-group";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: nav-history.js]---
Location: kord-master/client/src/components/nav-history.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { useDispatch, useSelector } from "react-redux";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: new-playlist-form.js]---
Location: kord-master/client/src/components/new-playlist-form.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: page-header.js]---
Location: kord-master/client/src/components/page-header.js
Signals: React
Excerpt (<=80 chars): import {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: player.js]---
Location: kord-master/client/src/components/player.js
Signals: React, Redux/RTK
Excerpt (<=80 chars):  export const Player = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Player
```

--------------------------------------------------------------------------------

---[FILE: playlist-item.js]---
Location: kord-master/client/src/components/playlist-item.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { faStar, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: playlist-list.js]---
Location: kord-master/client/src/components/playlist-list.js
Signals: React
Excerpt (<=80 chars): import PropTypes from "prop-types";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: playlist-page.js]---
Location: kord-master/client/src/components/playlist-page.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { forceCheck } from "react-lazyload";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: playlist-settings.js]---
Location: kord-master/client/src/components/playlist-settings.js
Signals: React
Excerpt (<=80 chars):  export const PlaylistSettings = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PlaylistSettings
```

--------------------------------------------------------------------------------

---[FILE: search-bar.js]---
Location: kord-master/client/src/components/search-bar.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { SubmitButton } from "./buttons";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: search-history-page.js]---
Location: kord-master/client/src/components/search-history-page.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: search-results-page.js]---
Location: kord-master/client/src/components/search-results-page.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: search-router.js]---
Location: kord-master/client/src/components/search-router.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: search-track-list.js]---
Location: kord-master/client/src/components/search-track-list.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: seek-bar.js]---
Location: kord-master/client/src/components/seek-bar.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { useSelector } from "react-redux";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: select-menu.js]---
Location: kord-master/client/src/components/select-menu.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: settings-form.js]---
Location: kord-master/client/src/components/settings-form.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: sidebar.js]---
Location: kord-master/client/src/components/sidebar.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: soundcloud-player.tsx]---
Location: kord-master/client/src/components/soundcloud-player.tsx
Signals: React
Excerpt (<=80 chars): import { MutableRefObject, ReactElement } from "react";

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: spotify-player.js]---
Location: kord-master/client/src/components/spotify-player.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import PropTypes from "prop-types";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: toggle-switch.js]---
Location: kord-master/client/src/components/toggle-switch.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: track-dropdown.js]---
Location: kord-master/client/src/components/track-dropdown.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: track-info.js]---
Location: kord-master/client/src/components/track-info.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { Link } from "react-router-dom";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: track-item.js]---
Location: kord-master/client/src/components/track-item.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: track-list.js]---
Location: kord-master/client/src/components/track-list.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { useSelector } from "react-redux";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: unsupported-browser-modal.js]---
Location: kord-master/client/src/components/unsupported-browser-modal.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: user-queue.js]---
Location: kord-master/client/src/components/user-queue.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import { CSSTransition } from "react-transition-group";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: volume-controls.js]---
Location: kord-master/client/src/components/volume-controls.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: youtube-player.tsx]---
Location: kord-master/client/src/components/youtube-player.tsx
Signals: React, Redux/RTK
Excerpt (<=80 chars): import * as Sentry from "@sentry/react";

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: footer.js]---
Location: kord-master/client/src/components/layout/footer.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: header.js]---
Location: kord-master/client/src/components/layout/header.js
Signals: React, Redux/RTK
Excerpt (<=80 chars): import {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: store.js]---
Location: kord-master/client/src/redux/store.js
Signals: Redux/RTK
Excerpt (<=80 chars): import { applyMiddleware, createStore, compose } from "redux";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: sync.js]---
Location: kord-master/client/src/redux/sync.js
Signals: Redux/RTK
Excerpt (<=80 chars):  export function synchronizeDataStore(store) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- synchronizeDataStore
- tabSyncMiddleware
- channel
```

--------------------------------------------------------------------------------

---[FILE: types.d.ts]---
Location: kord-master/client/src/redux/types.d.ts
Signals: N/A
Excerpt (<=80 chars):  export interface PlayerState {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchState
- PlayerState
- LibraryState
- UserState
- RootState
```

--------------------------------------------------------------------------------

---[FILE: lastFmActions.js]---
Location: kord-master/client/src/redux/actions/lastFmActions.js
Signals: N/A
Excerpt (<=80 chars):  export function fetchArtistInfo(artistName) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fetchArtistInfo
```

--------------------------------------------------------------------------------

---[FILE: libraryActions.js]---
Location: kord-master/client/src/redux/actions/libraryActions.js
Signals: N/A
Excerpt (<=80 chars):  export function importLikes(source, likes) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- importLikes
- importPlaylists
- importPlaylistTracks
- removePlaylists
- setNextPlaylistHref
- movePlaylistsToTrash
- restorePlaylistsFromTrash
- clearTrash
- clearPlaylistTracks
- toggleStarPlaylist
- setPlaylistSettingsAction
- loadLikes
- loadPlaylistTracks
- setTrackUnstreamable
- addTrackToPlaylists
- removeFromPlaylist
- fetchUserPlaylists
```

--------------------------------------------------------------------------------

---[FILE: playerActions.js]---
Location: kord-master/client/src/redux/actions/playerActions.js
Signals: N/A
Excerpt (<=80 chars):  export const playTrack = (index, tracklist, nextHref, context) => (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- play
- pause
- seek
- setTrack
- setDuration
- setSeek
- prevTrack
- addTrackToUserQueue
- removeTrackFromQueue
- setQueue
- setQueueIndex
- setVolume
- setMuted
- playFromQueue
- clearRestOfQueue
- toggleExpandedPlayer
- collapsePlayer
- setAutoPlay
```

--------------------------------------------------------------------------------

---[FILE: searchActions.js]---
Location: kord-master/client/src/redux/actions/searchActions.js
Signals: N/A
Excerpt (<=80 chars):  export function setQuery(query) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setQuery
- setTrackResults
- setMoreTrackResults
- setArtistResults
- addToSearchHistory
- removeFromSearchHistory
- setAutoCompleteResults
- searchForMusic
- loadMoreTrackResults
- fetchAutoCompleteResults
- fetchArtist
- fetchArtistTracks
- fetchMoreArtistTracks
```

--------------------------------------------------------------------------------

---[FILE: soundcloudActions.js]---
Location: kord-master/client/src/redux/actions/soundcloudActions.js
Signals: N/A
Excerpt (<=80 chars):  export const fetchSoundcloudProfileAndPlaylists = (username) => (dispatch) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapCollectionToTracks
- mapToTrack
- fetchSoundcloudProfileAndPlaylists
- fetchSoundcloudProfile
- fetchSoundcloudLikes
- fetchSoundcloudPlaylists
- fetchSoundcloudPlaylistTracks
- searchSoundcloud
- searchSoundcloudTracks
- fetchMoreSoundcloudTrackResults
- searchSoundcloudArtists
- fetchRelatedSouncloudTracks
- fetchSoundcloudArtist
- fetchSoundcloudSpotlight
- fetchSoundcloudArtistTopTracks
- fetchSoundcloudArtistTracks
- fetchSoundcloudTracks
```

--------------------------------------------------------------------------------

---[FILE: spotifyActions.js]---
Location: kord-master/client/src/redux/actions/spotifyActions.js
Signals: N/A
Excerpt (<=80 chars): export const spotifyApi = new SpotifyWebApi();

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapJsonToTracks
- spotifyApi
- setSpotifyAccessToken
- refreshSpotifyToken
- fetchSpotifyProfileAndPlaylists
- fetchSpotifyProfile
- fetchSpotifyLikes
- fetchSpotifyPlaylists
- fetchSpotifyPlaylistTracks
- searchSpotify
- fetchMoreSpotifyTrackResults
- fetchRelatedSpotifyTracks
- addToSpotifyPlaylist
- removeFromSpotifyPlaylist
- fetchSpotifyArtist
- fetchSpotifyArtistTopTracks
- fetchSpotifyArtistTracks
- fetchSpotifyTracks
```

--------------------------------------------------------------------------------

---[FILE: stateActions.js]---
Location: kord-master/client/src/redux/actions/stateActions.js
Signals: N/A
Excerpt (<=80 chars):  export function clearState() {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- clearState
```

--------------------------------------------------------------------------------

---[FILE: types.js]---
Location: kord-master/client/src/redux/actions/types.js
Signals: N/A
Excerpt (<=80 chars): export const CLEAR_STATE = "CLEAR_STATE";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CLEAR_STATE
- IMPORT_LIKES
- IMPORT_PLAYLISTS
- IMPORT_PLAYLIST_TRACKS
- REMOVE_PLAYLISTS
- SET_NEXT_PLAYLIST_HREF
- SET_PLAYLIST_SETTINGS
- CLEAR_PLAYLIST_TRACKS
- MOVE_PLAYLISTS_TO_TRASH
- RESTORE_PLAYLISTS_FROM_TRASH
- CLEAR_TRASH
- SET_TRACK_UNSTREAMABLE
- ADD_TRACK_TO_PLAYLIST
- REMOVE_TRACK_FROM_PLAYLIST
- TOGGLE_STAR_PLAYLIST
- SET_KORD_ID
- SET_ACCESS_TOKEN
- SET_CONNECTION
```

--------------------------------------------------------------------------------

---[FILE: userActions.js]---
Location: kord-master/client/src/redux/actions/userActions.js
Signals: N/A
Excerpt (<=80 chars):  export const setKordId = userId => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setKordId
- setAccessToken
- setConnection
- setMainConnection
- setUserProfile
- fetchProfileAndPlaylists
- saveRoute
- dequeRoute
- openSettings
- closeSettings
- updateProfile
- toggleAddToPlaylistForm
- toggleDeleteTrackForm
- toggleUserQueue
- toggleKeyboardControlsMenu
- openAddToPlaylistForm
- openDeleteTrackForm
- removeUserProfile
```

--------------------------------------------------------------------------------

---[FILE: youtubeActions.js]---
Location: kord-master/client/src/redux/actions/youtubeActions.js
Signals: N/A
Excerpt (<=80 chars):  export const setYoutubeAccessToken = accessToken => dispatch => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setYoutubeAccessToken
- refreshYoutubeToken
- fetchYoutubeProfileAndPlaylists
- fetchYoutubeProfile
- fetchYoutubePlaylists
- fetchYoutubePlaylistTracks
- searchYoutube
- fetchRelatedYoutubeTracks
- fetchMoreYoutubeTrackResults
- addToYoutubePlaylist
- removeFromYoutubePlaylist
- fetchYoutubeArtist
- fetchYoutubeArtistTopTracks
- fetchYoutubeArtistTracks
- fetchYoutubeTracks
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: kord-master/client/src/redux/reducers/index.js
Signals: Redux/RTK
Excerpt (<=80 chars): import { combineReducers } from "redux";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: global.d.ts]---
Location: kord-master/client/src/types/global.d.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Track {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Track
- Playlist
```

--------------------------------------------------------------------------------

---[FILE: compareHelpers.js]---
Location: kord-master/client/src/utils/compareHelpers.js
Signals: N/A
Excerpt (<=80 chars):  export function compareSongs(song1, song2) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- compareSongs
- compareArtists
- compareGenres
- hasProfileChanges
- hasNewPlaylistOrHasChanges
- isEmptyObject
```

--------------------------------------------------------------------------------

---[FILE: constants.js]---
Location: kord-master/client/src/utils/constants.js
Signals: React
Excerpt (<=80 chars):  export const SOURCES = ["spotify", "soundcloud", "youtube"]; //, "mixcloud"

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SOURCES
- ICONS
- COLORS
```

--------------------------------------------------------------------------------

---[FILE: fetchGeneric.js]---
Location: kord-master/client/src/utils/fetchGeneric.js
Signals: N/A
Excerpt (<=80 chars): export function fetchGeneric(endpoint, opts) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fetchGeneric
```

--------------------------------------------------------------------------------

---[FILE: formattingHelpers.js]---
Location: kord-master/client/src/utils/formattingHelpers.js
Signals: N/A
Excerpt (<=80 chars):  export function formatArtistName(artist) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatArtistName
- msToDuration
- secondsToFormatted
- capitalizeWord
- generateProfilePayload
- generatePlaylistsPayload
- formatNumber
- keepWithinVolumeRange
- filterUnconnected
- getTitleFromPathname
- formatSourceName
- YTDurationToMilliseconds
- flattenPlaylistObject
- reorder
- timeSince
- getImgUrl
- mapListByIdAndIndex
```

--------------------------------------------------------------------------------

---[FILE: hooks.js]---
Location: kord-master/client/src/utils/hooks.js
Signals: React, Redux/RTK
Excerpt (<=80 chars):  export function useLoadUserDataOnMount(setIsLoadingUserData) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLoadUserDataOnMount
- useMobileDetection
- usePrevious
- useSetDurationOnTrackChange
- usePauseIfSdkNotReady
- useRenderSeekPosition
- useDetectMediaSession
- useKeepSessionAlive
- useKeyControls
- useSetDocumentTitle
- useClearSessionStorageOnRefresh
- usePortal
- useDetectWidevine
```

--------------------------------------------------------------------------------

---[FILE: libraryUtils.ts]---
Location: kord-master/client/src/utils/libraryUtils.ts
Signals: N/A
Excerpt (<=80 chars): export function getTrackExternalLink(track: any): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getTrackExternalLink
```

--------------------------------------------------------------------------------

---[FILE: localStorage.js]---
Location: kord-master/client/src/utils/localStorage.js
Signals: N/A
Excerpt (<=80 chars): export const loadState = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadState
- saveState
```

--------------------------------------------------------------------------------

---[FILE: queueHelpers.js]---
Location: kord-master/client/src/utils/queueHelpers.js
Signals: N/A
Excerpt (<=80 chars): export function hasTracksLeftInAnyQueue(playerState) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasTracksLeftInAnyQueue
- shuffleTracks
- unshuffleTracks
```

--------------------------------------------------------------------------------

---[FILE: sessionStorage.js]---
Location: kord-master/client/src/utils/sessionStorage.js
Signals: N/A
Excerpt (<=80 chars): export const loadCachedValue = key => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadCachedValue
- cacheValue
```

--------------------------------------------------------------------------------

---[FILE: passport-setup.ts]---
Location: kord-master/config/passport-setup.ts
Signals: Express
Excerpt (<=80 chars): import passport = require("passport");

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: api-controller.ts]---
Location: kord-master/controllers/api-controller.ts
Signals: Express
Excerpt (<=80 chars): import {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-controller.ts]---
Location: kord-master/controllers/auth-controller.ts
Signals: Express
Excerpt (<=80 chars): import jwt = require("jsonwebtoken");

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: user-controller.ts]---
Location: kord-master/controllers/user-controller.ts
Signals: Express
Excerpt (<=80 chars): import { Request, Response } from "express";

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: gatsby-browser.js]---
Location: kord-master/landing/gatsby-browser.js
Signals: N/A
Excerpt (<=80 chars):  export const wrapRootElement = AuthProvider;

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- wrapRootElement
```

--------------------------------------------------------------------------------

---[FILE: raw-terms-of-use.js]---
Location: kord-master/landing/src/assets/raw-terms-of-use.js
Signals: TypeORM
Excerpt (<=80 chars): export default {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: header.js]---
Location: kord-master/landing/src/components/header.js
Signals: React
Excerpt (<=80 chars): import "../styles/burger.css";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: login-panel.js]---
Location: kord-master/landing/src/components/login-panel.js
Signals: React
Excerpt (<=80 chars): import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: particles-container.js]---
Location: kord-master/landing/src/components/particles-container.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: seo.js]---
Location: kord-master/landing/src/components/seo.js
Signals: React
Excerpt (<=80 chars): /**

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: kord-master/landing/src/layouts/index.js
Signals: React
Excerpt (<=80 chars): import "aos/dist/aos.css";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: 404.js]---
Location: kord-master/landing/src/pages/404.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: kord-master/landing/src/pages/index.js
Signals: React
Excerpt (<=80 chars): import "../styles/button-3d-round.css";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: login.js]---
Location: kord-master/landing/src/pages/login.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: privacy.js]---
Location: kord-master/landing/src/pages/privacy.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: signup.js]---
Location: kord-master/landing/src/pages/signup.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: terms-of-use.js]---
Location: kord-master/landing/src/pages/terms-of-use.js
Signals: React
Excerpt (<=80 chars): import PropTypes from "prop-types";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-provider.js]---
Location: kord-master/landing/src/utils/auth-provider.js
Signals: React
Excerpt (<=80 chars):  export const authContext = React.createContext(defaultState);

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authContext
- useAuthDetection
```

--------------------------------------------------------------------------------

````
