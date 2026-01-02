# FULLSTACK WEBSITE TYPES - PART 09: GAMING & ENTERTAINMENT

**Category:** Gaming & Entertainment  
**Total Types:** 10  
**Complexity:** High to Very High  
**Database References:** PART1-8, Real-time patterns, WebSocket implementations

---

## 📋 WEBSITE TYPES

1. **Game Server Platform** - Multiplayer game hosting/matchmaking
2. **Tournament/Esports Platform** - Tournament brackets, prizes, streaming
3. **Gaming Social Network** - Steam-like community
4. **Game Streaming Platform** - Twitch alternative
5. **Game Marketplace** - Buy/sell games and items
6. **Esports Betting Platform** - Betting on competitive gaming
7. **Game Analytics Dashboard** - Player stats and insights
8. **Clan/Guild Management** - Team organization tools
9. **Game Mod Repository** - Workshop-like mod sharing
10. **Achievement & Leaderboard System** - Cross-game achievements

---

## 1. GAME SERVER PLATFORM

### Tech Stack
- **Backend:** Node.js + Socket.io or Rust + WebSockets
- **Database:** PostgreSQL + Redis (for matchmaking queue)
- **Frontend:** Next.js + TypeScript
- **Game Servers:** Docker containers + Kubernetes
- **Build Time:** 16-24 weeks

### Schema
```typescript
export const games = pgTable("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  maxPlayers: integer("max_players").notNull(),
  minPlayers: integer("min_players").default(1),
  gameMode: text("game_mode").notNull(), // deathmatch, team, battle_royale
  version: text("version").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const gameServers = pgTable("game_servers", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").references(() => games.id).notNull(),
  name: text("name").notNull(),
  
  // Server details
  ipAddress: text("ip_address").notNull(),
  port: integer("port").notNull(),
  region: text("region").notNull(), // us-east, eu-west, asia
  
  // Status
  status: text("status").default("starting"), // starting, running, stopping, offline
  currentPlayers: integer("current_players").default(0),
  maxPlayers: integer("max_players").notNull(),
  
  // Configuration
  config: json("config").$type<ServerConfig>(),
  
  // Hosting
  ownerId: uuid("owner_id").references(() => users.id),
  isPublic: boolean("is_public").default(true),
  password: text("password"), // Encrypted
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastHeartbeat: timestamp("last_heartbeat"),
  
  @@index([gameId, status])
  @@index([region])
})

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  serverId: uuid("server_id").references(() => gameServers.id).notNull(),
  gameId: uuid("game_id").references(() => games.id).notNull(),
  
  status: text("status").default("waiting"), // waiting, in_progress, completed, cancelled
  
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  duration: integer("duration"), // seconds
  
  // Results
  winnerTeam: integer("winner_team"),
  finalScore: json("final_score"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const matchPlayers = pgTable("match_players", {
  id: uuid("id").defaultRandom().primaryKey(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  playerId: uuid("player_id").references(() => users.id).notNull(),
  
  team: integer("team"), // 1, 2, etc.
  character: text("character"),
  
  // Stats
  kills: integer("kills").default(0),
  deaths: integer("deaths").default(0),
  assists: integer("assists").default(0),
  score: integer("score").default(0),
  
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  leftAt: timestamp("left_at"),
  
  @@unique([matchId, playerId])
})

export const matchmakingQueue = pgTable("matchmaking_queue", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").references(() => games.id).notNull(),
  playerId: uuid("player_id").references(() => users.id).notNull(),
  
  skillRating: integer("skill_rating").notNull(),
  region: text("region").notNull(),
  gameMode: text("game_mode").notNull(),
  
  status: text("status").default("queued"), // queued, matched, cancelled
  matchedMatchId: uuid("matched_match_id").references(() => matches.id),
  
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  
  @@index([gameId, status, skillRating])
  @@index([playerId])
})

export const playerStats = pgTable("player_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  playerId: uuid("player_id").references(() => users.id).notNull(),
  gameId: uuid("game_id").references(() => games.id).notNull(),
  
  // Overall stats
  matchesPlayed: integer("matches_played").default(0),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  totalKills: integer("total_kills").default(0),
  totalDeaths: integer("total_deaths").default(0),
  totalAssists: integer("total_assists").default(0),
  
  // Rating
  skillRating: integer("skill_rating").default(1000),
  rank: text("rank"), // bronze, silver, gold, platinum, diamond
  
  lastPlayedAt: timestamp("last_played_at"),
  
  @@unique([playerId, gameId])
})
```

### Matchmaking Algorithm
```typescript
// lib/matchmaking.ts
export async function findMatch(playerId: string, gameId: string, region: string) {
  // Get player skill rating
  const [playerStats] = await db
    .select()
    .from(playerStats)
    .where(and(
      eq(playerStats.playerId, playerId),
      eq(playerStats.gameId, gameId)
    ))
  
  const skillRating = playerStats?.skillRating || 1000
  
  // Add to queue
  await db.insert(matchmakingQueue).values({
    playerId,
    gameId,
    region,
    skillRating,
    gameMode: "ranked",
  })
  
  // Try to match with similar skill players
  const potentialMatches = await db
    .select()
    .from(matchmakingQueue)
    .where(and(
      eq(matchmakingQueue.gameId, gameId),
      eq(matchmakingQueue.region, region),
      eq(matchmakingQueue.status, "queued"),
      between(matchmakingQueue.skillRating, skillRating - 100, skillRating + 100)
    ))
    .limit(10)
  
  if (potentialMatches.length >= 10) {
    // Create match
    return await createMatch(potentialMatches)
  }
  
  // Continue waiting in queue
  return null
}
```

**DB Parts:** PART1, PART2 (WebSockets), Redis for queues

---

## 2. TOURNAMENT/ESPORTS PLATFORM

### Tech Stack
- **Framework:** Next.js + TypeScript
- **Database:** PostgreSQL + Drizzle
- **Streaming:** Embed Twitch/YouTube
- **Payments:** Stripe (for entry fees/prizes)
- **Build Time:** 12-16 weeks

### Schema
```typescript
export const tournaments = pgTable("tournaments", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").references(() => games.id).notNull(),
  
  name: text("name").notNull(),
  description: text("description"),
  rules: text("rules"),
  
  // Format
  format: text("format").notNull(), // single_elimination, double_elimination, round_robin, swiss
  maxTeams: integer("max_teams").notNull(),
  teamSize: integer("team_size").default(1), // 1 for solo, 5 for team, etc.
  
  // Schedule
  registrationStart: timestamp("registration_start").notNull(),
  registrationEnd: timestamp("registration_end").notNull(),
  tournamentStart: timestamp("tournament_start").notNull(),
  tournamentEnd: timestamp("tournament_end"),
  
  // Prize
  prizePool: integer("prize_pool").default(0), // in cents
  entryFee: integer("entry_fee").default(0),
  prizeDistribution: json("prize_distribution").$type<{place: number, amount: number}[]>(),
  
  // Status
  status: text("status").default("upcoming"), // upcoming, registration_open, in_progress, completed, cancelled
  
  // Organization
  organizerId: uuid("organizer_id").references(() => users.id).notNull(),
  
  // Streaming
  streamUrl: text("stream_url"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([gameId, status])
})

export const tournamentTeams = pgTable("tournament_teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id).notNull(),
  
  name: text("name").notNull(),
  tag: text("tag"), // Team tag/abbreviation
  logo: text("logo"),
  
  captainId: uuid("captain_id").references(() => users.id).notNull(),
  
  seed: integer("seed"), // Seeding for bracket
  status: text("status").default("registered"), // registered, checked_in, eliminated, winner
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([tournamentId])
})

export const tournamentTeamMembers = pgTable("tournament_team_members", {
  teamId: uuid("team_id").references(() => tournamentTeams.id).notNull(),
  playerId: uuid("player_id").references(() => users.id).notNull(),
  role: text("role"), // captain, player, substitute
  
  @@unique([teamId, playerId])
})

export const tournamentMatches = pgTable("tournament_matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id).notNull(),
  
  round: integer("round").notNull(), // 1, 2, 3 (finals)
  matchNumber: integer("match_number").notNull(),
  
  team1Id: uuid("team1_id").references(() => tournamentTeams.id),
  team2Id: uuid("team2_id").references(() => tournamentTeams.id),
  
  winnerId: uuid("winner_id").references(() => tournamentTeams.id),
  
  // Scores
  team1Score: integer("team1_score").default(0),
  team2Score: integer("team2_score").default(0),
  
  // Scheduling
  scheduledAt: timestamp("scheduled_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  
  status: text("status").default("pending"), // pending, in_progress, completed, disputed
  
  // Streaming/VOD
  streamUrl: text("stream_url"),
  vodUrl: text("vod_url"),
  
  @@index([tournamentId, round])
})

export const brackets = pgTable("brackets", {
  id: uuid("id").defaultRandom().primaryKey(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id).notNull().unique(),
  
  structure: json("structure").$type<BracketStructure>(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
```

**DB Parts:** PART1, PART2, PART3 (payments)

---

## 3. GAMING SOCIAL NETWORK

### Schema
```typescript
export const gamingProfiles = pgTable("gaming_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  
  gamertag: text("gamertag").notNull().unique(),
  bio: text("bio"),
  avatar: text("avatar"),
  banner: text("banner"),
  
  // Platforms
  steamId: text("steam_id"),
  xboxGamertag: text("xbox_gamertag"),
  psnId: text("psn_id"),
  nintendoFriendCode: text("nintendo_friend_code"),
  
  // Privacy
  profileVisibility: text("profile_visibility").default("public"), // public, friends, private
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const gameLibrary = pgTable("game_library", {
  userId: uuid("user_id").references(() => users.id).notNull(),
  gameId: uuid("game_id").references(() => games.id).notNull(),
  
  hoursPlayed: integer("hours_played").default(0),
  achievementsUnlocked: integer("achievements_unlocked").default(0),
  lastPlayedAt: timestamp("last_played_at"),
  
  addedAt: timestamp("added_at").defaultNow().notNull(),
  
  @@unique([userId, gameId])
})

export const friendships = pgTable("friendships", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  friendId: uuid("friend_id").references(() => users.id).notNull(),
  
  status: text("status").default("pending"), // pending, accepted, blocked
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
  
  @@unique([userId, friendId])
})

export const gameReviews = pgTable("game_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").references(() => games.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  rating: integer("rating").notNull(), // 1-10
  recommended: boolean("recommended").notNull(),
  review: text("review"),
  
  helpful: integer("helpful").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@unique([gameId, userId])
})
```

**DB Parts:** PART1, PART4 (social features)

---

## 4-10. ADDITIONAL GAMING TYPES (Quick Reference)

### 4. Game Streaming Platform (Twitch Alternative)
- **Stack:** Next.js + RTMP server + CDN + PostgreSQL
- **Build Time:** 20-28 weeks
- **Key:** Live streaming, chat, subscriptions, VODs
- **DB Parts:** PART1-5, Video streaming patterns

### 5. Game Marketplace
- **Stack:** Next.js + Stripe + PostgreSQL
- **Build Time:** 10-14 weeks
- **Key:** Digital game sales, DLC, in-game items
- **DB Parts:** PART1, PART3 (e-commerce)

### 6. Esports Betting Platform
- **Stack:** Next.js + Stripe + Real-time odds + PostgreSQL
- **Build Time:** 16-24 weeks
- **Key:** Match betting, odds calculation, compliance
- **DB Parts:** PART1, PART3, Real-time data

### 7. Game Analytics Dashboard
- **Stack:** Next.js + TimescaleDB + Chart.js
- **Build Time:** 8-12 weeks
- **Key:** Player behavior, retention, monetization metrics
- **DB Parts:** PART1, PART7 (dashboards), Analytics

### 8. Clan/Guild Management
- **Stack:** Next.js + PostgreSQL + Discord integration
- **Build Time:** 8-10 weeks
- **Key:** Member management, events, communications
- **DB Parts:** PART1, PART2, PART4

### 9. Game Mod Repository
- **Stack:** Next.js + S3 + PostgreSQL + Git integration
- **Build Time:** 10-12 weeks
- **Key:** Mod uploads, versioning, ratings, comments
- **DB Parts:** PART1, PART5 (uploads), PART4 (community)

### 10. Achievement & Leaderboard System
- **Stack:** Next.js + Redis + PostgreSQL
- **Build Time:** 6-8 weeks
- **Key:** Cross-game achievements, global leaderboards
- **DB Parts:** PART1, PART2, Redis patterns

---

**Next:** [PART 10 - IoT & Smart Home →](FULLSTACK_WEBSITE_TYPES_PART10_IOT_SMARTHOME.md)
