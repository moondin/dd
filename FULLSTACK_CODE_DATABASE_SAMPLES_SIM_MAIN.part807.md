---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 807
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 807 of 933)

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

---[FILE: 0043_silent_the_anarchist.sql]---
Location: sim-main/packages/db/migrations/0043_silent_the_anarchist.sql

```sql
CREATE TABLE "workflow_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"position_x" integer NOT NULL,
	"position_y" integer NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"horizontal_handles" boolean DEFAULT true NOT NULL,
	"is_wide" boolean DEFAULT false NOT NULL,
	"height" integer DEFAULT 0 NOT NULL,
	"sub_blocks" jsonb DEFAULT '{}' NOT NULL,
	"outputs" jsonb DEFAULT '{}' NOT NULL,
	"data" jsonb DEFAULT '{}',
	"parent_id" text,
	"extent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_edges" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"source_block_id" text NOT NULL,
	"target_block_id" text NOT NULL,
	"source_handle" text,
	"target_handle" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_subflows" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"type" text NOT NULL,
	"config" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow_blocks" ADD CONSTRAINT "workflow_blocks_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_blocks" ADD CONSTRAINT "workflow_blocks_parent_id_workflow_blocks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."workflow_blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_edges" ADD CONSTRAINT "workflow_edges_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_edges" ADD CONSTRAINT "workflow_edges_source_block_id_workflow_blocks_id_fk" FOREIGN KEY ("source_block_id") REFERENCES "public"."workflow_blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_edges" ADD CONSTRAINT "workflow_edges_target_block_id_workflow_blocks_id_fk" FOREIGN KEY ("target_block_id") REFERENCES "public"."workflow_blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_subflows" ADD CONSTRAINT "workflow_subflows_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workflow_blocks_workflow_id_idx" ON "workflow_blocks" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_blocks_parent_id_idx" ON "workflow_blocks" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "workflow_blocks_workflow_parent_idx" ON "workflow_blocks" USING btree ("workflow_id","parent_id");--> statement-breakpoint
CREATE INDEX "workflow_blocks_workflow_type_idx" ON "workflow_blocks" USING btree ("workflow_id","type");--> statement-breakpoint
CREATE INDEX "workflow_edges_workflow_id_idx" ON "workflow_edges" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_edges_source_block_idx" ON "workflow_edges" USING btree ("source_block_id");--> statement-breakpoint
CREATE INDEX "workflow_edges_target_block_idx" ON "workflow_edges" USING btree ("target_block_id");--> statement-breakpoint
CREATE INDEX "workflow_edges_workflow_source_idx" ON "workflow_edges" USING btree ("workflow_id","source_block_id");--> statement-breakpoint
CREATE INDEX "workflow_edges_workflow_target_idx" ON "workflow_edges" USING btree ("workflow_id","target_block_id");--> statement-breakpoint
CREATE INDEX "workflow_edges_source_block_fk_idx" ON "workflow_edges" USING btree ("source_block_id");--> statement-breakpoint
CREATE INDEX "workflow_edges_target_block_fk_idx" ON "workflow_edges" USING btree ("target_block_id");--> statement-breakpoint
CREATE INDEX "workflow_subflows_workflow_id_idx" ON "workflow_subflows" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_subflows_workflow_type_idx" ON "workflow_subflows" USING btree ("workflow_id","type");
```

--------------------------------------------------------------------------------

---[FILE: 0044_uneven_killer_shrike.sql]---
Location: sim-main/packages/db/migrations/0044_uneven_killer_shrike.sql

```sql
ALTER TABLE "workflow_blocks" ALTER COLUMN "position_x" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "workflow_blocks" ALTER COLUMN "position_y" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "workflow_blocks" ALTER COLUMN "height" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "workflow_blocks" ALTER COLUMN "height" SET DEFAULT '0';
```

--------------------------------------------------------------------------------

---[FILE: 0045_sour_chameleon.sql]---
Location: sim-main/packages/db/migrations/0045_sour_chameleon.sql

```sql
DROP INDEX "doc_file_hash_idx";--> statement-breakpoint
DROP INDEX "emb_chunk_hash_idx";--> statement-breakpoint
DROP INDEX "emb_kb_access_idx";--> statement-breakpoint
DROP INDEX "emb_kb_rank_idx";--> statement-breakpoint
ALTER TABLE "document" DROP COLUMN "file_hash";--> statement-breakpoint
ALTER TABLE "embedding" DROP COLUMN "overlap_tokens";--> statement-breakpoint
ALTER TABLE "embedding" DROP COLUMN "search_rank";--> statement-breakpoint
ALTER TABLE "embedding" DROP COLUMN "access_count";--> statement-breakpoint
ALTER TABLE "embedding" DROP COLUMN "last_accessed_at";--> statement-breakpoint
ALTER TABLE "embedding" DROP COLUMN "quality_score";
```

--------------------------------------------------------------------------------

---[FILE: 0046_loose_blizzard.sql]---
Location: sim-main/packages/db/migrations/0046_loose_blizzard.sql

```sql
CREATE TYPE "public"."permission_type" AS ENUM('admin', 'write', 'read');--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"permission_type" "permission_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspace_invitation" ADD COLUMN "permissions" "permission_type" DEFAULT 'admin' NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "permissions_user_id_idx" ON "permissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "permissions_entity_idx" ON "permissions" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "permissions_user_entity_type_idx" ON "permissions" USING btree ("user_id","entity_type");--> statement-breakpoint
CREATE INDEX "permissions_user_entity_permission_idx" ON "permissions" USING btree ("user_id","entity_type","permission_type");--> statement-breakpoint
CREATE INDEX "permissions_user_entity_idx" ON "permissions" USING btree ("user_id","entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "permissions_unique_constraint" ON "permissions" USING btree ("user_id","entity_type","entity_id");
```

--------------------------------------------------------------------------------

---[FILE: 0047_new_triathlon.sql]---
Location: sim-main/packages/db/migrations/0047_new_triathlon.sql

```sql
ALTER TABLE "workflow_blocks" ADD COLUMN "advanced_mode" boolean DEFAULT false NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0048_flawless_ultron.sql]---
Location: sim-main/packages/db/migrations/0048_flawless_ultron.sql

```sql
ALTER TABLE "user_stats" ADD COLUMN "current_usage_limit" numeric DEFAULT '5' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "usage_limit_set_by" text;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "usage_limit_updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "current_period_cost" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "billing_period_start" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "billing_period_end" timestamp;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "last_period_cost" numeric DEFAULT '0';--> statement-breakpoint
CREATE INDEX "subscription_reference_status_idx" ON "subscription" USING btree ("reference_id","status");--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "check_enterprise_metadata" CHECK (plan != 'enterprise' OR (metadata IS NOT NULL AND (metadata->>'perSeatAllowance' IS NOT NULL OR metadata->>'totalAllowance' IS NOT NULL)));
```

--------------------------------------------------------------------------------

---[FILE: 0049_fancy_cardiac.sql]---
Location: sim-main/packages/db/migrations/0049_fancy_cardiac.sql

```sql
CREATE TABLE "workflow_execution_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"execution_id" text NOT NULL,
	"workflow_id" text NOT NULL,
	"block_id" text NOT NULL,
	"block_name" text,
	"block_type" text NOT NULL,
	"started_at" timestamp NOT NULL,
	"ended_at" timestamp,
	"duration_ms" integer,
	"status" text NOT NULL,
	"error_message" text,
	"error_stack_trace" text,
	"input_data" jsonb,
	"output_data" jsonb,
	"cost_input" numeric(10, 6),
	"cost_output" numeric(10, 6),
	"cost_total" numeric(10, 6),
	"tokens_prompt" integer,
	"tokens_completion" integer,
	"tokens_total" integer,
	"model_used" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_execution_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"execution_id" text NOT NULL,
	"state_snapshot_id" text NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"trigger" text NOT NULL,
	"started_at" timestamp NOT NULL,
	"ended_at" timestamp,
	"total_duration_ms" integer,
	"block_count" integer DEFAULT 0 NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"skipped_count" integer DEFAULT 0 NOT NULL,
	"total_cost" numeric(10, 6),
	"total_input_cost" numeric(10, 6),
	"total_output_cost" numeric(10, 6),
	"total_tokens" integer,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_execution_snapshots" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"state_hash" text NOT NULL,
	"state_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow_execution_blocks" ADD CONSTRAINT "workflow_execution_blocks_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_execution_logs" ADD CONSTRAINT "workflow_execution_logs_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_execution_logs" ADD CONSTRAINT "workflow_execution_logs_state_snapshot_id_workflow_execution_snapshots_id_fk" FOREIGN KEY ("state_snapshot_id") REFERENCES "public"."workflow_execution_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_execution_snapshots" ADD CONSTRAINT "workflow_execution_snapshots_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "execution_blocks_execution_id_idx" ON "workflow_execution_blocks" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "execution_blocks_workflow_id_idx" ON "workflow_execution_blocks" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "execution_blocks_block_id_idx" ON "workflow_execution_blocks" USING btree ("block_id");--> statement-breakpoint
CREATE INDEX "execution_blocks_status_idx" ON "workflow_execution_blocks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "execution_blocks_duration_idx" ON "workflow_execution_blocks" USING btree ("duration_ms");--> statement-breakpoint
CREATE INDEX "execution_blocks_cost_idx" ON "workflow_execution_blocks" USING btree ("cost_total");--> statement-breakpoint
CREATE INDEX "execution_blocks_workflow_execution_idx" ON "workflow_execution_blocks" USING btree ("workflow_id","execution_id");--> statement-breakpoint
CREATE INDEX "execution_blocks_execution_status_idx" ON "workflow_execution_blocks" USING btree ("execution_id","status");--> statement-breakpoint
CREATE INDEX "execution_blocks_started_at_idx" ON "workflow_execution_blocks" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "workflow_execution_logs_workflow_id_idx" ON "workflow_execution_logs" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_execution_logs_execution_id_idx" ON "workflow_execution_logs" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "workflow_execution_logs_trigger_idx" ON "workflow_execution_logs" USING btree ("trigger");--> statement-breakpoint
CREATE INDEX "workflow_execution_logs_level_idx" ON "workflow_execution_logs" USING btree ("level");--> statement-breakpoint
CREATE INDEX "workflow_execution_logs_started_at_idx" ON "workflow_execution_logs" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "workflow_execution_logs_cost_idx" ON "workflow_execution_logs" USING btree ("total_cost");--> statement-breakpoint
CREATE INDEX "workflow_execution_logs_duration_idx" ON "workflow_execution_logs" USING btree ("total_duration_ms");--> statement-breakpoint
CREATE UNIQUE INDEX "workflow_execution_logs_execution_id_unique" ON "workflow_execution_logs" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "workflow_snapshots_workflow_id_idx" ON "workflow_execution_snapshots" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_snapshots_hash_idx" ON "workflow_execution_snapshots" USING btree ("state_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "workflow_snapshots_workflow_hash_idx" ON "workflow_execution_snapshots" USING btree ("workflow_id","state_hash");--> statement-breakpoint
CREATE INDEX "workflow_snapshots_created_at_idx" ON "workflow_execution_snapshots" USING btree ("created_at");
```

--------------------------------------------------------------------------------

---[FILE: 0050_big_mattie_franklin.sql]---
Location: sim-main/packages/db/migrations/0050_big_mattie_franklin.sql

```sql
ALTER TABLE "settings" ADD COLUMN "auto_pan" boolean DEFAULT true NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0051_typical_expediter.sql]---
Location: sim-main/packages/db/migrations/0051_typical_expediter.sql
Signals: PostgreSQL

```sql
CREATE TABLE "docs_embeddings" (
	"chunk_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chunk_text" text NOT NULL,
	"source_document" text NOT NULL,
	"source_link" text NOT NULL,
	"header_text" text NOT NULL,
	"header_level" integer NOT NULL,
	"token_count" integer NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"embedding_model" text DEFAULT 'text-embedding-3-small' NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"chunk_text_tsv" "tsvector" GENERATED ALWAYS AS (to_tsvector('english', "docs_embeddings"."chunk_text")) STORED,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "docs_embedding_not_null_check" CHECK ("embedding" IS NOT NULL),
	CONSTRAINT "docs_header_level_check" CHECK ("header_level" >= 1 AND "header_level" <= 6)
);
--> statement-breakpoint
CREATE INDEX "docs_emb_source_document_idx" ON "docs_embeddings" USING btree ("source_document");--> statement-breakpoint
CREATE INDEX "docs_emb_header_level_idx" ON "docs_embeddings" USING btree ("header_level");--> statement-breakpoint
CREATE INDEX "docs_emb_source_header_idx" ON "docs_embeddings" USING btree ("source_document","header_level");--> statement-breakpoint
CREATE INDEX "docs_emb_model_idx" ON "docs_embeddings" USING btree ("embedding_model");--> statement-breakpoint
CREATE INDEX "docs_emb_created_at_idx" ON "docs_embeddings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "docs_embedding_vector_hnsw_idx" ON "docs_embeddings" USING hnsw ("embedding" vector_cosine_ops) WITH (m=16,ef_construction=64);--> statement-breakpoint
CREATE INDEX "docs_emb_metadata_gin_idx" ON "docs_embeddings" USING gin ("metadata");--> statement-breakpoint
CREATE INDEX "docs_emb_chunk_text_fts_idx" ON "docs_embeddings" USING gin ("chunk_text_tsv");--> statement-breakpoint
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE TRIGGER set_updated_at
	BEFORE UPDATE ON docs_embeddings
	FOR EACH ROW
	EXECUTE FUNCTION trigger_set_timestamp();
```

--------------------------------------------------------------------------------

---[FILE: 0052_fluffy_shinobi_shaw.sql]---
Location: sim-main/packages/db/migrations/0052_fluffy_shinobi_shaw.sql

```sql
CREATE TABLE "copilot_chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"workflow_id" text NOT NULL,
	"title" text,
	"messages" jsonb DEFAULT '[]' NOT NULL,
	"model" text DEFAULT 'claude-3-7-sonnet-latest' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "copilot_chats" ADD CONSTRAINT "copilot_chats_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "copilot_chats" ADD CONSTRAINT "copilot_chats_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "copilot_chats_user_id_idx" ON "copilot_chats" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "copilot_chats_workflow_id_idx" ON "copilot_chats" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "copilot_chats_user_workflow_idx" ON "copilot_chats" USING btree ("user_id","workflow_id");--> statement-breakpoint
CREATE INDEX "copilot_chats_created_at_idx" ON "copilot_chats" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "copilot_chats_updated_at_idx" ON "copilot_chats" USING btree ("updated_at");
```

--------------------------------------------------------------------------------

---[FILE: 0053_gigantic_gabe_jones.sql]---
Location: sim-main/packages/db/migrations/0053_gigantic_gabe_jones.sql

```sql
DROP INDEX "emb_metadata_gin_idx";--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "tag1" text;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "tag2" text;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "tag3" text;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "tag4" text;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "tag5" text;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "tag6" text;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "tag7" text;--> statement-breakpoint
ALTER TABLE "embedding" ADD COLUMN "tag1" text;--> statement-breakpoint
ALTER TABLE "embedding" ADD COLUMN "tag2" text;--> statement-breakpoint
ALTER TABLE "embedding" ADD COLUMN "tag3" text;--> statement-breakpoint
ALTER TABLE "embedding" ADD COLUMN "tag4" text;--> statement-breakpoint
ALTER TABLE "embedding" ADD COLUMN "tag5" text;--> statement-breakpoint
ALTER TABLE "embedding" ADD COLUMN "tag6" text;--> statement-breakpoint
ALTER TABLE "embedding" ADD COLUMN "tag7" text;--> statement-breakpoint
CREATE INDEX "doc_tag1_idx" ON "document" USING btree ("tag1");--> statement-breakpoint
CREATE INDEX "doc_tag2_idx" ON "document" USING btree ("tag2");--> statement-breakpoint
CREATE INDEX "doc_tag3_idx" ON "document" USING btree ("tag3");--> statement-breakpoint
CREATE INDEX "doc_tag4_idx" ON "document" USING btree ("tag4");--> statement-breakpoint
CREATE INDEX "doc_tag5_idx" ON "document" USING btree ("tag5");--> statement-breakpoint
CREATE INDEX "doc_tag6_idx" ON "document" USING btree ("tag6");--> statement-breakpoint
CREATE INDEX "doc_tag7_idx" ON "document" USING btree ("tag7");--> statement-breakpoint
CREATE INDEX "emb_tag1_idx" ON "embedding" USING btree ("tag1");--> statement-breakpoint
CREATE INDEX "emb_tag2_idx" ON "embedding" USING btree ("tag2");--> statement-breakpoint
CREATE INDEX "emb_tag3_idx" ON "embedding" USING btree ("tag3");--> statement-breakpoint
CREATE INDEX "emb_tag4_idx" ON "embedding" USING btree ("tag4");--> statement-breakpoint
CREATE INDEX "emb_tag5_idx" ON "embedding" USING btree ("tag5");--> statement-breakpoint
CREATE INDEX "emb_tag6_idx" ON "embedding" USING btree ("tag6");--> statement-breakpoint
CREATE INDEX "emb_tag7_idx" ON "embedding" USING btree ("tag7");--> statement-breakpoint
ALTER TABLE "embedding" DROP COLUMN "metadata";
```

--------------------------------------------------------------------------------

---[FILE: 0054_naive_raider.sql]---
Location: sim-main/packages/db/migrations/0054_naive_raider.sql

```sql
CREATE TABLE "template_stars" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"template_id" text NOT NULL,
	"starred_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"author" text NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"stars" integer DEFAULT 0 NOT NULL,
	"color" text DEFAULT '#3972F6' NOT NULL,
	"icon" text DEFAULT 'FileText' NOT NULL,
	"category" text NOT NULL,
	"state" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "workspace_member" CASCADE;--> statement-breakpoint
ALTER TABLE "template_stars" ADD CONSTRAINT "template_stars_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_stars" ADD CONSTRAINT "template_stars_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "template_stars_user_id_idx" ON "template_stars" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "template_stars_template_id_idx" ON "template_stars" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "template_stars_user_template_idx" ON "template_stars" USING btree ("user_id","template_id");--> statement-breakpoint
CREATE INDEX "template_stars_template_user_idx" ON "template_stars" USING btree ("template_id","user_id");--> statement-breakpoint
CREATE INDEX "template_stars_starred_at_idx" ON "template_stars" USING btree ("starred_at");--> statement-breakpoint
CREATE INDEX "template_stars_template_starred_at_idx" ON "template_stars" USING btree ("template_id","starred_at");--> statement-breakpoint
CREATE UNIQUE INDEX "template_stars_user_template_unique" ON "template_stars" USING btree ("user_id","template_id");--> statement-breakpoint
CREATE INDEX "templates_workflow_id_idx" ON "templates" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "templates_user_id_idx" ON "templates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "templates_category_idx" ON "templates" USING btree ("category");--> statement-breakpoint
CREATE INDEX "templates_views_idx" ON "templates" USING btree ("views");--> statement-breakpoint
CREATE INDEX "templates_stars_idx" ON "templates" USING btree ("stars");--> statement-breakpoint
CREATE INDEX "templates_category_views_idx" ON "templates" USING btree ("category","views");--> statement-breakpoint
CREATE INDEX "templates_category_stars_idx" ON "templates" USING btree ("category","stars");--> statement-breakpoint
CREATE INDEX "templates_user_category_idx" ON "templates" USING btree ("user_id","category");--> statement-breakpoint
CREATE INDEX "templates_created_at_idx" ON "templates" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "templates_updated_at_idx" ON "templates" USING btree ("updated_at");
```

--------------------------------------------------------------------------------

---[FILE: 0055_amused_ender_wiggin.sql]---
Location: sim-main/packages/db/migrations/0055_amused_ender_wiggin.sql

```sql
ALTER TABLE "settings" ADD COLUMN "console_expanded_by_default" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" DROP COLUMN "debug_mode";
```

--------------------------------------------------------------------------------

---[FILE: 0056_adorable_franklin_richards.sql]---
Location: sim-main/packages/db/migrations/0056_adorable_franklin_richards.sql

```sql
CREATE TABLE "user_rate_limits" (
	"user_id" text PRIMARY KEY NOT NULL,
	"sync_api_requests" integer DEFAULT 0 NOT NULL,
	"async_api_requests" integer DEFAULT 0 NOT NULL,
	"window_start" timestamp DEFAULT now() NOT NULL,
	"last_request_at" timestamp DEFAULT now() NOT NULL,
	"is_rate_limited" boolean DEFAULT false NOT NULL,
	"rate_limit_reset_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user_rate_limits" ADD CONSTRAINT "user_rate_limits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0057_charming_star_brand.sql]---
Location: sim-main/packages/db/migrations/0057_charming_star_brand.sql

```sql
ALTER TABLE "workflow_schedule" DROP CONSTRAINT "workflow_schedule_workflow_id_unique";--> statement-breakpoint
ALTER TABLE "webhook" ADD COLUMN "block_id" text;--> statement-breakpoint
ALTER TABLE "workflow_schedule" ADD COLUMN "block_id" text;--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_block_id_workflow_blocks_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."workflow_blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_schedule" ADD CONSTRAINT "workflow_schedule_block_id_workflow_blocks_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."workflow_blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "workflow_schedule_workflow_block_unique" ON "workflow_schedule" USING btree ("workflow_id","block_id");
```

--------------------------------------------------------------------------------

---[FILE: 0058_clean_shiva.sql]---
Location: sim-main/packages/db/migrations/0058_clean_shiva.sql

```sql
CREATE TABLE "copilot_checkpoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"workflow_id" text NOT NULL,
	"chat_id" uuid NOT NULL,
	"yaml" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "copilot_checkpoints" ADD CONSTRAINT "copilot_checkpoints_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "copilot_checkpoints" ADD CONSTRAINT "copilot_checkpoints_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "copilot_checkpoints" ADD CONSTRAINT "copilot_checkpoints_chat_id_copilot_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."copilot_chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "copilot_checkpoints_user_id_idx" ON "copilot_checkpoints" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "copilot_checkpoints_workflow_id_idx" ON "copilot_checkpoints" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "copilot_checkpoints_chat_id_idx" ON "copilot_checkpoints" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "copilot_checkpoints_user_workflow_idx" ON "copilot_checkpoints" USING btree ("user_id","workflow_id");--> statement-breakpoint
CREATE INDEX "copilot_checkpoints_workflow_chat_idx" ON "copilot_checkpoints" USING btree ("workflow_id","chat_id");--> statement-breakpoint
CREATE INDEX "copilot_checkpoints_created_at_idx" ON "copilot_checkpoints" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "copilot_checkpoints_chat_created_at_idx" ON "copilot_checkpoints" USING btree ("chat_id","created_at");
```

--------------------------------------------------------------------------------

---[FILE: 0059_odd_may_parker.sql]---
Location: sim-main/packages/db/migrations/0059_odd_may_parker.sql

```sql
CREATE INDEX "workflow_user_id_idx" ON "workflow" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "workflow_workspace_id_idx" ON "workflow" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workflow_user_workspace_idx" ON "workflow" USING btree ("user_id","workspace_id");--> statement-breakpoint
CREATE INDEX "workflow_logs_workflow_id_idx" ON "workflow_logs" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_logs_workflow_created_idx" ON "workflow_logs" USING btree ("workflow_id","created_at");
```

--------------------------------------------------------------------------------

---[FILE: 0060_ordinary_nick_fury.sql]---
Location: sim-main/packages/db/migrations/0060_ordinary_nick_fury.sql

```sql
ALTER TABLE "knowledge_base" DROP CONSTRAINT "knowledge_base_workspace_id_workspace_id_fk";
--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0061_swift_doctor_spectrum.sql]---
Location: sim-main/packages/db/migrations/0061_swift_doctor_spectrum.sql

```sql
DROP TABLE "workflow_execution_blocks" CASCADE;
```

--------------------------------------------------------------------------------

---[FILE: 0062_previous_phantom_reporter.sql]---
Location: sim-main/packages/db/migrations/0062_previous_phantom_reporter.sql

```sql
DROP TABLE "workflow_logs" CASCADE;
```

--------------------------------------------------------------------------------

---[FILE: 0063_lame_sandman.sql]---
Location: sim-main/packages/db/migrations/0063_lame_sandman.sql

```sql
CREATE TABLE "knowledge_base_tag_definitions" (
	"id" text PRIMARY KEY NOT NULL,
	"knowledge_base_id" text NOT NULL,
	"tag_slot" text NOT NULL,
	"display_name" text NOT NULL,
	"field_type" text DEFAULT 'text' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge_base_tag_definitions" ADD CONSTRAINT "knowledge_base_tag_definitions_knowledge_base_id_knowledge_base_id_fk" FOREIGN KEY ("knowledge_base_id") REFERENCES "public"."knowledge_base"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "kb_tag_definitions_kb_slot_idx" ON "knowledge_base_tag_definitions" USING btree ("knowledge_base_id","tag_slot");--> statement-breakpoint
CREATE INDEX "kb_tag_definitions_kb_id_idx" ON "knowledge_base_tag_definitions" USING btree ("knowledge_base_id");
```

--------------------------------------------------------------------------------

---[FILE: 0064_elite_hedge_knight.sql]---
Location: sim-main/packages/db/migrations/0064_elite_hedge_knight.sql

```sql
DROP INDEX "workflow_execution_logs_cost_idx";--> statement-breakpoint
DROP INDEX "workflow_execution_logs_duration_idx";--> statement-breakpoint
CREATE INDEX "workflow_execution_logs_workflow_started_at_idx" ON "workflow_execution_logs" USING btree ("workflow_id","started_at");
```

--------------------------------------------------------------------------------

---[FILE: 0065_solid_newton_destine.sql]---
Location: sim-main/packages/db/migrations/0065_solid_newton_destine.sql

```sql
CREATE TABLE "workflow_checkpoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"workflow_id" text NOT NULL,
	"chat_id" uuid NOT NULL,
	"message_id" text,
	"workflow_state" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "copilot_checkpoints" CASCADE;--> statement-breakpoint
ALTER TABLE "copilot_chats" ADD COLUMN "preview_yaml" text;--> statement-breakpoint
ALTER TABLE "workflow_checkpoints" ADD CONSTRAINT "workflow_checkpoints_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_checkpoints" ADD CONSTRAINT "workflow_checkpoints_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_checkpoints" ADD CONSTRAINT "workflow_checkpoints_chat_id_copilot_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."copilot_chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workflow_checkpoints_user_id_idx" ON "workflow_checkpoints" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "workflow_checkpoints_workflow_id_idx" ON "workflow_checkpoints" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_checkpoints_chat_id_idx" ON "workflow_checkpoints" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "workflow_checkpoints_message_id_idx" ON "workflow_checkpoints" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "workflow_checkpoints_user_workflow_idx" ON "workflow_checkpoints" USING btree ("user_id","workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_checkpoints_workflow_chat_idx" ON "workflow_checkpoints" USING btree ("workflow_id","chat_id");--> statement-breakpoint
CREATE INDEX "workflow_checkpoints_created_at_idx" ON "workflow_checkpoints" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "workflow_checkpoints_chat_created_at_idx" ON "workflow_checkpoints" USING btree ("chat_id","created_at");
```

--------------------------------------------------------------------------------

---[FILE: 0066_talented_mentor.sql]---
Location: sim-main/packages/db/migrations/0066_talented_mentor.sql

```sql
CREATE TABLE "copilot_feedback" (
	"feedback_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"chat_id" uuid NOT NULL,
	"user_query" text NOT NULL,
	"agent_response" text NOT NULL,
	"is_positive" boolean NOT NULL,
	"feedback" text,
	"workflow_yaml" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_stats" ALTER COLUMN "current_usage_limit" SET DEFAULT '10';--> statement-breakpoint
ALTER TABLE "copilot_feedback" ADD CONSTRAINT "copilot_feedback_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "copilot_feedback" ADD CONSTRAINT "copilot_feedback_chat_id_copilot_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."copilot_chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "copilot_feedback_user_id_idx" ON "copilot_feedback" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "copilot_feedback_chat_id_idx" ON "copilot_feedback" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "copilot_feedback_user_chat_idx" ON "copilot_feedback" USING btree ("user_id","chat_id");--> statement-breakpoint
CREATE INDEX "copilot_feedback_is_positive_idx" ON "copilot_feedback" USING btree ("is_positive");--> statement-breakpoint
CREATE INDEX "copilot_feedback_created_at_idx" ON "copilot_feedback" USING btree ("created_at");
```

--------------------------------------------------------------------------------

---[FILE: 0067_safe_bushwacker.sql]---
Location: sim-main/packages/db/migrations/0067_safe_bushwacker.sql

```sql
CREATE UNIQUE INDEX "kb_tag_definitions_kb_display_name_idx" ON "knowledge_base_tag_definitions" USING btree ("knowledge_base_id","display_name");
```

--------------------------------------------------------------------------------

---[FILE: 0068_fine_hardball.sql]---
Location: sim-main/packages/db/migrations/0068_fine_hardball.sql

```sql
ALTER TABLE "workflow_execution_logs" ADD COLUMN "files" jsonb;
```

--------------------------------------------------------------------------------

---[FILE: 0069_lonely_spirit.sql]---
Location: sim-main/packages/db/migrations/0069_lonely_spirit.sql

```sql
ALTER TABLE "workflow_blocks" ADD COLUMN "trigger_mode" boolean DEFAULT false NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0070_charming_wrecking_crew.sql]---
Location: sim-main/packages/db/migrations/0070_charming_wrecking_crew.sql

```sql
ALTER TABLE "knowledge_base" ALTER COLUMN "chunking_config" SET DEFAULT '{"maxSize": 1024, "minSize": 1, "overlap": 200}';
```

--------------------------------------------------------------------------------

---[FILE: 0071_free_sharon_carter.sql]---
Location: sim-main/packages/db/migrations/0071_free_sharon_carter.sql

```sql
ALTER TABLE "workflow" ADD COLUMN "pinned_api_key" text;
```

--------------------------------------------------------------------------------

---[FILE: 0072_powerful_legion.sql]---
Location: sim-main/packages/db/migrations/0072_powerful_legion.sql

```sql
ALTER TABLE "copilot_chats" ADD COLUMN "conversation_id" text;
```

--------------------------------------------------------------------------------

---[FILE: 0073_hot_champions.sql]---
Location: sim-main/packages/db/migrations/0073_hot_champions.sql

```sql
ALTER TABLE "settings" DROP COLUMN "telemetry_notified_user";
```

--------------------------------------------------------------------------------

---[FILE: 0074_abnormal_dreadnoughts.sql]---
Location: sim-main/packages/db/migrations/0074_abnormal_dreadnoughts.sql

```sql
CREATE TABLE "copilot_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"api_key_encrypted" text NOT NULL,
	"api_key_lookup" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "total_copilot_cost" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "total_copilot_tokens" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "total_copilot_calls" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "copilot_api_keys" ADD CONSTRAINT "copilot_api_keys_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "copilot_api_keys_api_key_encrypted_hash_idx" ON "copilot_api_keys" USING hash ("api_key_encrypted");--> statement-breakpoint
CREATE INDEX "copilot_api_keys_lookup_hash_idx" ON "copilot_api_keys" USING hash ("api_key_lookup");
```

--------------------------------------------------------------------------------

---[FILE: 0075_lush_moonstone.sql]---
Location: sim-main/packages/db/migrations/0075_lush_moonstone.sql

```sql
ALTER TABLE "workflow" DROP COLUMN "state";
```

--------------------------------------------------------------------------------

````
