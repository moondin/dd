---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 808
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 808 of 933)

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

---[FILE: 0076_damp_vector.sql]---
Location: sim-main/packages/db/migrations/0076_damp_vector.sql

```sql
-- One-shot data migration to create/populate execution_data & cost, then drop legacy columns
-- Safe on reruns and across differing prior schemas
-- Note: Depending on runner timeouts, might have to be run manually
-- 1) Ensure execution_data exists (prefer rename if only metadata exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'workflow_execution_logs' AND column_name = 'metadata'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'workflow_execution_logs' AND column_name = 'execution_data'
  ) THEN
    EXECUTE 'ALTER TABLE workflow_execution_logs RENAME COLUMN metadata TO execution_data';
  END IF;
END $$;--> statement-breakpoint

ALTER TABLE "workflow_execution_logs"
  ADD COLUMN IF NOT EXISTS "execution_data" jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS "cost" jsonb;--> statement-breakpoint

-- Process the backfill in batches to avoid large temporary files on big datasets
DO $$
DECLARE
  v_batch_size integer := 500; -- keep batches small to avoid timeouts/spills
  v_rows_updated integer := 0;
  v_rows_selected integer := 0;
  v_last_id text := '';
  v_last_created_at timestamp := '1970-01-01 00:00:00';
BEGIN
  -- modest per-statement timeout; adjust based on observed per-batch runtime
  PERFORM set_config('statement_timeout', '180s', true);
  LOOP
    CREATE TEMP TABLE IF NOT EXISTS _tmp_candidate_ids(id text, created_at timestamp) ON COMMIT DROP;
    TRUNCATE _tmp_candidate_ids;
    INSERT INTO _tmp_candidate_ids(id, created_at)
    SELECT id, created_at
    FROM workflow_execution_logs
    WHERE (created_at, id) > (v_last_created_at, v_last_id) AND cost IS NULL
    ORDER BY created_at, id
    LIMIT v_batch_size;

    SELECT COUNT(*) INTO v_rows_selected FROM _tmp_candidate_ids;
    EXIT WHEN v_rows_selected = 0;
    SELECT created_at, id
    INTO v_last_created_at, v_last_id
    FROM _tmp_candidate_ids
    ORDER BY created_at DESC, id DESC
    LIMIT 1;

    WITH RECURSIVE
    spans AS (
      SELECT l.id, s.span
      FROM workflow_execution_logs l
      JOIN _tmp_candidate_ids c ON c.id = l.id
      LEFT JOIN LATERAL jsonb_array_elements(
        COALESCE(
          CASE
            WHEN jsonb_typeof(l.execution_data->'traceSpans') = 'array' THEN l.execution_data->'traceSpans'
            ELSE '[]'::jsonb
          END
        )
      ) s(span) ON true
      UNION ALL
      SELECT spans.id, c.span
      FROM spans
      JOIN LATERAL jsonb_array_elements(COALESCE(spans.span->'children','[]'::jsonb)) c(span) ON true
    ),
    agg AS (
      SELECT id,
             SUM(COALESCE((span->'cost'->>'input')::numeric,0)) AS agg_input,
             SUM(COALESCE((span->'cost'->>'output')::numeric,0)) AS agg_output,
             SUM(COALESCE((span->'cost'->>'total')::numeric,0)) AS agg_total,
             SUM(COALESCE((span->'cost'->'tokens'->>'prompt')::numeric, COALESCE((span->'tokens'->>'prompt')::numeric,0))) AS agg_tokens_prompt,
             SUM(COALESCE((span->'cost'->'tokens'->>'completion')::numeric, COALESCE((span->'tokens'->>'completion')::numeric,0))) AS agg_tokens_completion,
             SUM(COALESCE((span->'cost'->'tokens'->>'total')::numeric, COALESCE((span->'tokens'->>'total')::numeric,0))) AS agg_tokens_total
      FROM spans
      GROUP BY id
    ),
    model_rows AS (
      SELECT id,
             (span->'cost'->>'model') AS model,
             COALESCE((span->'cost'->>'input')::numeric,0) AS input,
             COALESCE((span->'cost'->>'output')::numeric,0) AS output,
             COALESCE((span->'cost'->>'total')::numeric,0) AS total,
             COALESCE((span->'cost'->'tokens'->>'prompt')::numeric,0) AS tokens_prompt,
             COALESCE((span->'cost'->'tokens'->>'completion')::numeric,0) AS tokens_completion,
             COALESCE((span->'cost'->'tokens'->>'total')::numeric,0) AS tokens_total
      FROM spans
      WHERE span ? 'cost' AND (span->'cost'->>'model') IS NOT NULL
    ),
    model_sums AS (
      SELECT id,
             model,
             SUM(input) AS input,
             SUM(output) AS output,
             SUM(total) AS total,
             SUM(tokens_prompt) AS tokens_prompt,
             SUM(tokens_completion) AS tokens_completion,
             SUM(tokens_total) AS tokens_total
      FROM model_rows
      GROUP BY id, model
    ),
    models AS (
      SELECT id,
             jsonb_object_agg(model, jsonb_build_object(
               'input', input,
               'output', output,
               'total', total,
               'tokens', jsonb_build_object(
                 'prompt', tokens_prompt,
                 'completion', tokens_completion,
                 'total', tokens_total
               )
             )) AS models
      FROM model_sums
      GROUP BY id
    ),
    tb AS (
      SELECT l.id,
             NULLIF((l.execution_data->'tokenBreakdown'->>'prompt')::numeric, 0) AS prompt,
             NULLIF((l.execution_data->'tokenBreakdown'->>'completion')::numeric, 0) AS completion
      FROM workflow_execution_logs l
      JOIN _tmp_candidate_ids c ON c.id = l.id
    )
    UPDATE workflow_execution_logs AS l
    SET cost = jsonb_strip_nulls(
      jsonb_build_object(
        'total', COALESCE((to_jsonb(l)->>'total_cost')::numeric, NULLIF(agg.agg_total,0)),
        'input', COALESCE((to_jsonb(l)->>'total_input_cost')::numeric, NULLIF(agg.agg_input,0)),
        'output', COALESCE((to_jsonb(l)->>'total_output_cost')::numeric, NULLIF(agg.agg_output,0)),
        'tokens', CASE
          WHEN (to_jsonb(l) ? 'total_tokens') OR tb.prompt IS NOT NULL OR tb.completion IS NOT NULL OR NULLIF(agg.agg_tokens_total,0) IS NOT NULL THEN
            jsonb_strip_nulls(
              jsonb_build_object(
                'total', COALESCE((to_jsonb(l)->>'total_tokens')::numeric, NULLIF(agg.agg_tokens_total,0)),
                'prompt', COALESCE(tb.prompt, NULLIF(agg.agg_tokens_prompt,0)),
                'completion', COALESCE(tb.completion, NULLIF(agg.agg_tokens_completion,0))
              )
            )
          ELSE NULL
        END,
        'models', models.models
      )
    )
    FROM agg
    LEFT JOIN models ON models.id = agg.id
    LEFT JOIN tb ON tb.id = agg.id
    WHERE l.id = agg.id;

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    -- continue advancing by id until no more rows are selected
  END LOOP;
END $$;--> statement-breakpoint

-- 3) Drop legacy columns now that backfill is complete
ALTER TABLE "workflow_execution_logs"
  DROP COLUMN IF EXISTS "message",
  DROP COLUMN IF EXISTS "block_count",
  DROP COLUMN IF EXISTS "success_count",
  DROP COLUMN IF EXISTS "error_count",
  DROP COLUMN IF EXISTS "skipped_count",
  DROP COLUMN IF EXISTS "total_cost",
  DROP COLUMN IF EXISTS "total_input_cost",
  DROP COLUMN IF EXISTS "total_output_cost",
  DROP COLUMN IF EXISTS "total_tokens",
  DROP COLUMN IF EXISTS "metadata";
```

--------------------------------------------------------------------------------

---[FILE: 0077_rapid_chimera.sql]---
Location: sim-main/packages/db/migrations/0077_rapid_chimera.sql

```sql
ALTER TABLE "templates" ALTER COLUMN "workflow_id" DROP NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0078_supreme_madrox.sql]---
Location: sim-main/packages/db/migrations/0078_supreme_madrox.sql

```sql
DROP TABLE "copilot_api_keys" CASCADE;
```

--------------------------------------------------------------------------------

---[FILE: 0079_shocking_shriek.sql]---
Location: sim-main/packages/db/migrations/0079_shocking_shriek.sql

```sql
ALTER TABLE "subscription" DROP CONSTRAINT IF EXISTS "check_enterprise_metadata";--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "org_usage_limit" numeric;--> statement-breakpoint
ALTER TABLE "user_stats" ALTER COLUMN "current_usage_limit" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN IF NOT EXISTS "billing_blocked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_stats" DROP COLUMN IF EXISTS "usage_limit_set_by";--> statement-breakpoint
ALTER TABLE "user_stats" DROP COLUMN IF EXISTS "billing_period_start";--> statement-breakpoint
ALTER TABLE "user_stats" DROP COLUMN IF EXISTS "billing_period_end";--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "check_enterprise_metadata" CHECK (plan != 'enterprise' OR metadata IS NOT NULL);
```

--------------------------------------------------------------------------------

---[FILE: 0080_left_riptide.sql]---
Location: sim-main/packages/db/migrations/0080_left_riptide.sql

```sql
CREATE TABLE "workspace_environment" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"variables" json DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspace_environment" ADD CONSTRAINT "workspace_environment_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_environment_workspace_unique" ON "workspace_environment" USING btree ("workspace_id");
```

--------------------------------------------------------------------------------

---[FILE: 0081_yellow_shadow_king.sql]---
Location: sim-main/packages/db/migrations/0081_yellow_shadow_king.sql

```sql
ALTER TABLE "workspace_invitation" ADD COLUMN "org_invitation_id" text;
```

--------------------------------------------------------------------------------

---[FILE: 0082_light_blockbuster.sql]---
Location: sim-main/packages/db/migrations/0082_light_blockbuster.sql

```sql
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "invitation_organization_id_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "member_user_id_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_organization_id_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");
```

--------------------------------------------------------------------------------

---[FILE: 0083_ambiguous_dreadnoughts.sql]---
Location: sim-main/packages/db/migrations/0083_ambiguous_dreadnoughts.sql

```sql
CREATE TYPE "public"."workspace_invitation_status" AS ENUM('pending', 'accepted', 'rejected', 'cancelled');--> statement-breakpoint
ALTER TABLE "workspace_invitation" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."workspace_invitation_status";--> statement-breakpoint
ALTER TABLE "workspace_invitation" ALTER COLUMN "status" SET DATA TYPE "public"."workspace_invitation_status" USING "status"::"public"."workspace_invitation_status";
```

--------------------------------------------------------------------------------

---[FILE: 0084_even_lockheed.sql]---
Location: sim-main/packages/db/migrations/0084_even_lockheed.sql

```sql
ALTER TABLE "user_rate_limits" RENAME COLUMN "user_id" TO "reference_id";--> statement-breakpoint
ALTER TABLE "user_rate_limits" DROP CONSTRAINT "user_rate_limits_user_id_user_id_fk";
```

--------------------------------------------------------------------------------

---[FILE: 0085_daffy_blacklash.sql]---
Location: sim-main/packages/db/migrations/0085_daffy_blacklash.sql

```sql
ALTER TABLE "settings" ADD COLUMN "billing_usage_notifications_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" DROP COLUMN "general";
```

--------------------------------------------------------------------------------

---[FILE: 0086_breezy_sister_grimm.sql]---
Location: sim-main/packages/db/migrations/0086_breezy_sister_grimm.sql

```sql
CREATE TYPE "public"."webhook_delivery_status" AS ENUM('pending', 'in_progress', 'success', 'failed');--> statement-breakpoint
CREATE TABLE "workflow_log_webhook" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"url" text NOT NULL,
	"secret" text,
	"include_final_output" boolean DEFAULT false NOT NULL,
	"include_trace_spans" boolean DEFAULT false NOT NULL,
	"include_rate_limits" boolean DEFAULT false NOT NULL,
	"include_usage_data" boolean DEFAULT false NOT NULL,
	"level_filter" text[] DEFAULT ARRAY['info', 'error']::text[] NOT NULL,
	"trigger_filter" text[] DEFAULT ARRAY['api', 'webhook', 'schedule', 'manual', 'chat']::text[] NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_log_webhook_delivery" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"workflow_id" text NOT NULL,
	"execution_id" text NOT NULL,
	"status" "webhook_delivery_status" DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_attempt_at" timestamp,
	"next_attempt_at" timestamp,
	"response_status" integer,
	"response_body" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_rate_limits" ADD COLUMN "api_endpoint_requests" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_log_webhook" ADD CONSTRAINT "workflow_log_webhook_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_log_webhook_delivery" ADD CONSTRAINT "workflow_log_webhook_delivery_subscription_id_workflow_log_webhook_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."workflow_log_webhook"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_log_webhook_delivery" ADD CONSTRAINT "workflow_log_webhook_delivery_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workflow_log_webhook_workflow_id_idx" ON "workflow_log_webhook" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_log_webhook_active_idx" ON "workflow_log_webhook" USING btree ("active");--> statement-breakpoint
CREATE INDEX "workflow_log_webhook_delivery_subscription_id_idx" ON "workflow_log_webhook_delivery" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "workflow_log_webhook_delivery_execution_id_idx" ON "workflow_log_webhook_delivery" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "workflow_log_webhook_delivery_status_idx" ON "workflow_log_webhook_delivery" USING btree ("status");--> statement-breakpoint
CREATE INDEX "workflow_log_webhook_delivery_next_attempt_idx" ON "workflow_log_webhook_delivery" USING btree ("next_attempt_at");
```

--------------------------------------------------------------------------------

---[FILE: 0087_wealthy_landau.sql]---
Location: sim-main/packages/db/migrations/0087_wealthy_landau.sql

```sql
CREATE TABLE "mcp_servers" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"created_by" text,
	"name" text NOT NULL,
	"description" text,
	"transport" text NOT NULL,
	"url" text,
	"headers" json DEFAULT '{}',
	"timeout" integer DEFAULT 30000,
	"retries" integer DEFAULT 3,
	"enabled" boolean DEFAULT true NOT NULL,
	"last_connected" timestamp,
	"connection_status" text DEFAULT 'disconnected',
	"last_error" text,
	"tool_count" integer DEFAULT 0,
	"last_tools_refresh" timestamp,
	"total_requests" integer DEFAULT 0,
	"last_used" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mcp_servers" ADD CONSTRAINT "mcp_servers_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcp_servers" ADD CONSTRAINT "mcp_servers_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mcp_servers_workspace_enabled_idx" ON "mcp_servers" USING btree ("workspace_id","enabled");--> statement-breakpoint
CREATE INDEX "mcp_servers_workspace_deleted_idx" ON "mcp_servers" USING btree ("workspace_id","deleted_at");
```

--------------------------------------------------------------------------------

---[FILE: 0088_serious_firestar.sql]---
Location: sim-main/packages/db/migrations/0088_serious_firestar.sql

```sql
CREATE TABLE "workflow_deployment_version" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"version" integer NOT NULL,
	"state" json NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text
);
--> statement-breakpoint
ALTER TABLE "workflow_deployment_version" ADD CONSTRAINT "workflow_deployment_version_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workflow_deployment_version_workflow_id_idx" ON "workflow_deployment_version" USING btree ("workflow_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workflow_deployment_version_workflow_version_unique" ON "workflow_deployment_version" USING btree ("workflow_id","version");--> statement-breakpoint
CREATE INDEX "workflow_deployment_version_workflow_active_idx" ON "workflow_deployment_version" USING btree ("workflow_id","is_active");--> statement-breakpoint
CREATE INDEX "workflow_deployment_version_created_at_idx" ON "workflow_deployment_version" USING btree ("created_at");
```

--------------------------------------------------------------------------------

---[FILE: 0089_amused_pete_wisdom.sql]---
Location: sim-main/packages/db/migrations/0089_amused_pete_wisdom.sql

```sql
-- Step 1: Add new columns to api_key table
ALTER TABLE "api_key" ADD COLUMN "workspace_id" text;--> statement-breakpoint
ALTER TABLE "api_key" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "api_key" ADD COLUMN "type" text DEFAULT 'personal' NOT NULL;--> statement-breakpoint

-- Step 2: Add pinned_api_key_id column to workflow table
ALTER TABLE "workflow" ADD COLUMN "pinned_api_key_id" text;--> statement-breakpoint

-- Step 3: Migrate pinned API key references from text key to foreign key ID
UPDATE "workflow" 
SET "pinned_api_key_id" = ak."id"
FROM "api_key" ak
WHERE "workflow"."pinned_api_key" IS NOT NULL 
  AND ak."key" = "workflow"."pinned_api_key";--> statement-breakpoint

-- Step 4: Add foreign key constraints
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_pinned_api_key_id_api_key_id_fk" FOREIGN KEY ("pinned_api_key_id") REFERENCES "public"."api_key"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint

-- Step 5: Add check constraint to ensure data integrity
ALTER TABLE "api_key" ADD CONSTRAINT "workspace_type_check" CHECK ((type = 'workspace' AND workspace_id IS NOT NULL) OR (type = 'personal' AND workspace_id IS NULL));--> statement-breakpoint

-- Step 6: Drop old columns
ALTER TABLE "workflow" DROP COLUMN "pinned_api_key";
```

--------------------------------------------------------------------------------

---[FILE: 0090_fearless_zaladane.sql]---
Location: sim-main/packages/db/migrations/0090_fearless_zaladane.sql

```sql
CREATE TABLE "idempotency_key" (
	"key" text NOT NULL,
	"namespace" text DEFAULT 'default' NOT NULL,
	"result" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idempotency_key_namespace_unique" ON "idempotency_key" USING btree ("key","namespace");--> statement-breakpoint
CREATE INDEX "idempotency_key_created_at_idx" ON "idempotency_key" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idempotency_key_namespace_idx" ON "idempotency_key" USING btree ("namespace");
```

--------------------------------------------------------------------------------

---[FILE: 0091_amusing_iron_lad.sql]---
Location: sim-main/packages/db/migrations/0091_amusing_iron_lad.sql

```sql
ALTER TABLE "user_stats" ADD COLUMN "pro_period_cost_snapshot" numeric DEFAULT '0';
```

--------------------------------------------------------------------------------

---[FILE: 0091_backfill_user_stats.sql]---
Location: sim-main/packages/db/migrations/0091_backfill_user_stats.sql

```sql
-- Backfill user_stats for any users missing a stats row
-- Uses defaults from schema for limits and counters

INSERT INTO "user_stats" (
  "id",
  "user_id",
  "current_usage_limit",
  "usage_limit_updated_at",
  "total_manual_executions",
  "total_api_calls",
  "total_webhook_triggers",
  "total_scheduled_executions",
  "total_chat_executions",
  "total_tokens_used",
  "total_cost",
  "current_period_cost",
  "last_period_cost",
  "total_copilot_cost",
  "total_copilot_tokens",
  "total_copilot_calls",
  "last_active",
  "billing_blocked"
)
SELECT
  u."id" AS id,
  u."id" AS user_id,
  NULL::decimal AS current_usage_limit,
  NOW() AS usage_limit_updated_at,
  0 AS total_manual_executions,
  0 AS total_api_calls,
  0 AS total_webhook_triggers,
  0 AS total_scheduled_executions,
  0 AS total_chat_executions,
  0 AS total_tokens_used,
  '0'::decimal AS total_cost,
  '0'::decimal AS current_period_cost,
  '0'::decimal AS last_period_cost,
  '0'::decimal AS total_copilot_cost,
  0 AS total_copilot_tokens,
  0 AS total_copilot_calls,
  NOW() AS last_active,
  FALSE AS billing_blocked
FROM "user" u
LEFT JOIN "user_stats" s ON s."user_id" = u."id"
WHERE s."user_id" IS NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0092_mighty_kinsey_walden.sql]---
Location: sim-main/packages/db/migrations/0092_mighty_kinsey_walden.sql

```sql
ALTER TABLE "settings" ADD COLUMN "show_floating_controls" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "show_training_controls" boolean DEFAULT false NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0093_medical_sentinel.sql]---
Location: sim-main/packages/db/migrations/0093_medical_sentinel.sql

```sql
DROP INDEX "workflow_blocks_parent_id_idx";--> statement-breakpoint
DROP INDEX "workflow_blocks_workflow_parent_idx";--> statement-breakpoint
ALTER TABLE "workflow_blocks" DROP COLUMN "parent_id";--> statement-breakpoint
ALTER TABLE "workflow_blocks" DROP COLUMN "extent";
```

--------------------------------------------------------------------------------

---[FILE: 0094_perpetual_the_watchers.sql]---
Location: sim-main/packages/db/migrations/0094_perpetual_the_watchers.sql

```sql
ALTER TABLE "chat" RENAME COLUMN "subdomain" TO "identifier";--> statement-breakpoint
DROP INDEX "subdomain_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "identifier_idx" ON "chat" USING btree ("identifier");
```

--------------------------------------------------------------------------------

---[FILE: 0095_cheerful_albert_cleary.sql]---
Location: sim-main/packages/db/migrations/0095_cheerful_albert_cleary.sql

```sql
CREATE TABLE IF NOT EXISTS "sso_provider" (
	"id" text PRIMARY KEY NOT NULL,
	"issuer" text NOT NULL,
	"domain" text NOT NULL,
	"oidc_config" text,
	"saml_config" text,
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"organization_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sso_provider" ADD CONSTRAINT "sso_provider_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sso_provider" ADD CONSTRAINT "sso_provider_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sso_provider_provider_id_idx" ON "sso_provider" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sso_provider_domain_idx" ON "sso_provider" USING btree ("domain");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sso_provider_user_id_idx" ON "sso_provider" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sso_provider_organization_id_idx" ON "sso_provider" USING btree ("organization_id");
```

--------------------------------------------------------------------------------

---[FILE: 0096_tranquil_arachne.sql]---
Location: sim-main/packages/db/migrations/0096_tranquil_arachne.sql

```sql
ALTER TABLE "settings" ADD COLUMN "copilot_enabled_models" jsonb DEFAULT '{}' NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0097_dazzling_mephisto.sql]---
Location: sim-main/packages/db/migrations/0097_dazzling_mephisto.sql

```sql
ALTER TABLE "user_stats" ADD COLUMN "billed_overage_this_period" numeric DEFAULT '0' NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0098_thick_prima.sql]---
Location: sim-main/packages/db/migrations/0098_thick_prima.sql

```sql
DROP INDEX "workflow_edges_source_block_idx";--> statement-breakpoint
DROP INDEX "workflow_edges_target_block_idx";--> statement-breakpoint
CREATE INDEX "workflow_execution_logs_state_snapshot_id_idx" ON "workflow_execution_logs" USING btree ("state_snapshot_id");
```

--------------------------------------------------------------------------------

---[FILE: 0099_deep_sir_ram.sql]---
Location: sim-main/packages/db/migrations/0099_deep_sir_ram.sql

```sql
ALTER TABLE "workflow_deployment_version" ADD COLUMN "name" text;
```

--------------------------------------------------------------------------------

---[FILE: 0100_public_black_cat.sql]---
Location: sim-main/packages/db/migrations/0100_public_black_cat.sql

```sql
CREATE TABLE "workspace_file" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"size" integer NOT NULL,
	"type" text NOT NULL,
	"uploaded_by" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_file_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "storage_used_bytes" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "storage_used_bytes" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace_file" ADD CONSTRAINT "workspace_file_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_file" ADD CONSTRAINT "workspace_file_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workspace_file_workspace_id_idx" ON "workspace_file" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_file_key_idx" ON "workspace_file" USING btree ("key");
```

--------------------------------------------------------------------------------

---[FILE: 0101_missing_doc_processing.sql]---
Location: sim-main/packages/db/migrations/0101_missing_doc_processing.sql

```sql
ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "processing_status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "processing_started_at" timestamp;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "processing_completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "processing_error" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "doc_processing_status_idx" ON "document" USING btree ("knowledge_base_id","processing_status");
```

--------------------------------------------------------------------------------

---[FILE: 0102_eminent_amphibian.sql]---
Location: sim-main/packages/db/migrations/0102_eminent_amphibian.sql

```sql
CREATE TABLE "workspace_files" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"user_id" text NOT NULL,
	"workspace_id" text,
	"context" text NOT NULL,
	"original_name" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_files_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "workspace_files" ADD CONSTRAINT "workspace_files_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_files" ADD CONSTRAINT "workspace_files_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workspace_files_key_idx" ON "workspace_files" USING btree ("key");--> statement-breakpoint
CREATE INDEX "workspace_files_user_id_idx" ON "workspace_files" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "workspace_files_workspace_id_idx" ON "workspace_files" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_files_context_idx" ON "workspace_files" USING btree ("context");
```

--------------------------------------------------------------------------------

---[FILE: 0103_careful_harpoon.sql]---
Location: sim-main/packages/db/migrations/0103_careful_harpoon.sql

```sql
ALTER TABLE "user_stats" ADD COLUMN "current_period_copilot_cost" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "last_period_copilot_cost" numeric DEFAULT '0';
```

--------------------------------------------------------------------------------

---[FILE: 0104_orange_shinobi_shaw.sql]---
Location: sim-main/packages/db/migrations/0104_orange_shinobi_shaw.sql

```sql
ALTER TABLE "workflow" DROP CONSTRAINT "workflow_pinned_api_key_id_api_key_id_fk";
--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "billed_account_user_id" text;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "allow_personal_api_keys" boolean DEFAULT true NOT NULL;--> statement-breakpoint
UPDATE "workspace" SET "billed_account_user_id" = "owner_id" WHERE "billed_account_user_id" IS NULL;--> statement-breakpoint
ALTER TABLE "workspace" ALTER COLUMN "billed_account_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_billed_account_user_id_user_id_fk" FOREIGN KEY ("billed_account_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow" DROP COLUMN "deployed_state";--> statement-breakpoint
ALTER TABLE "workflow" DROP COLUMN "pinned_api_key_id";--> statement-breakpoint
ALTER TABLE "workflow" DROP COLUMN "collaborators";--> statement-breakpoint
ALTER TABLE "workflow" DROP COLUMN "is_published";--> statement-breakpoint
ALTER TABLE "workflow" DROP COLUMN "marketplace_data";
```

--------------------------------------------------------------------------------

---[FILE: 0105_glamorous_wrecking_crew.sql]---
Location: sim-main/packages/db/migrations/0105_glamorous_wrecking_crew.sql

```sql
ALTER TABLE "custom_tools" DROP CONSTRAINT "custom_tools_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_tools" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
-- Add workspace_id as nullable (existing tools will have null, new tools will be workspace-scoped)
ALTER TABLE "custom_tools" ADD COLUMN "workspace_id" text;--> statement-breakpoint
ALTER TABLE "custom_tools" ADD CONSTRAINT "custom_tools_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_tools" ADD CONSTRAINT "custom_tools_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "custom_tools_workspace_id_idx" ON "custom_tools" USING btree ("workspace_id");
```

--------------------------------------------------------------------------------

---[FILE: 0106_bitter_captain_midlands.sql]---
Location: sim-main/packages/db/migrations/0106_bitter_captain_midlands.sql

```sql
CREATE TABLE "paused_executions" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"execution_id" text NOT NULL,
	"execution_snapshot" jsonb NOT NULL,
	"pause_points" jsonb NOT NULL,
	"total_pause_count" integer NOT NULL,
	"resumed_count" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'paused' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"paused_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "resume_queue" (
	"id" text PRIMARY KEY NOT NULL,
	"paused_execution_id" text NOT NULL,
	"parent_execution_id" text NOT NULL,
	"new_execution_id" text NOT NULL,
	"context_id" text NOT NULL,
	"resume_input" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"queued_at" timestamp DEFAULT now() NOT NULL,
	"claimed_at" timestamp,
	"completed_at" timestamp,
	"failure_reason" text
);
--> statement-breakpoint
ALTER TABLE "custom_tools" ALTER COLUMN "workspace_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "paused_executions" ADD CONSTRAINT "paused_executions_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_queue" ADD CONSTRAINT "resume_queue_paused_execution_id_paused_executions_id_fk" FOREIGN KEY ("paused_execution_id") REFERENCES "public"."paused_executions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "paused_executions_workflow_id_idx" ON "paused_executions" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "paused_executions_status_idx" ON "paused_executions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "paused_executions_execution_id_unique" ON "paused_executions" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "resume_queue_parent_status_idx" ON "resume_queue" USING btree ("parent_execution_id","status","queued_at");--> statement-breakpoint
CREATE INDEX "resume_queue_new_execution_idx" ON "resume_queue" USING btree ("new_execution_id");
```

--------------------------------------------------------------------------------

---[FILE: 0107_silky_agent_brand.sql]---
Location: sim-main/packages/db/migrations/0107_silky_agent_brand.sql

```sql
CREATE TYPE "public"."template_creator_type" AS ENUM('user', 'organization');--> statement-breakpoint
CREATE TYPE "public"."template_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "template_creators" (
	"id" text PRIMARY KEY NOT NULL,
	"reference_type" "template_creator_type" NOT NULL,
	"reference_id" text NOT NULL,
	"name" text NOT NULL,
	"profile_image_url" text,
	"details" jsonb,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "templates" DROP CONSTRAINT "templates_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "templates" DROP CONSTRAINT "templates_workflow_id_workflow_id_fk";
--> statement-breakpoint
DROP INDEX "templates_workflow_id_idx";--> statement-breakpoint
DROP INDEX "templates_user_id_idx";--> statement-breakpoint
DROP INDEX "templates_category_idx";--> statement-breakpoint
DROP INDEX "templates_category_views_idx";--> statement-breakpoint
DROP INDEX "templates_category_stars_idx";--> statement-breakpoint
DROP INDEX "templates_user_category_idx";--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "super_user_mode_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "details" jsonb;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "creator_id" text;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "status" "template_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "tags" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "required_credentials" jsonb DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_super_user" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "template_creators" ADD CONSTRAINT "template_creators_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "template_creators_reference_idx" ON "template_creators" USING btree ("reference_type","reference_id");--> statement-breakpoint
CREATE INDEX "template_creators_reference_id_idx" ON "template_creators" USING btree ("reference_id");--> statement-breakpoint
CREATE INDEX "template_creators_created_by_idx" ON "template_creators" USING btree ("created_by");--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_creator_id_template_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."template_creators"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "templates_status_idx" ON "templates" USING btree ("status");--> statement-breakpoint
CREATE INDEX "templates_creator_id_idx" ON "templates" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "templates_status_views_idx" ON "templates" USING btree ("status","views");--> statement-breakpoint
CREATE INDEX "templates_status_stars_idx" ON "templates" USING btree ("status","stars");--> statement-breakpoint
ALTER TABLE "templates" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "templates" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "templates" DROP COLUMN "author";--> statement-breakpoint
ALTER TABLE "templates" DROP COLUMN "color";--> statement-breakpoint
ALTER TABLE "templates" DROP COLUMN "icon";--> statement-breakpoint
ALTER TABLE "templates" DROP COLUMN "category";
```

--------------------------------------------------------------------------------

---[FILE: 0108_cuddly_scream.sql]---
Location: sim-main/packages/db/migrations/0108_cuddly_scream.sql

```sql
ALTER TABLE "workflow_schedule" ADD COLUMN "last_queued_at" timestamp;
```

--------------------------------------------------------------------------------

---[FILE: 0109_bumpy_earthquake.sql]---
Location: sim-main/packages/db/migrations/0109_bumpy_earthquake.sql

```sql
ALTER TABLE "memory" ALTER COLUMN "data" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "memory" DROP COLUMN "type";
```

--------------------------------------------------------------------------------

---[FILE: 0110_broken_paladin.sql]---
Location: sim-main/packages/db/migrations/0110_broken_paladin.sql

```sql
ALTER TABLE "settings" ADD COLUMN "error_notifications_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" DROP COLUMN "auto_fill_env_vars";
```

--------------------------------------------------------------------------------

---[FILE: 0111_solid_dreadnoughts.sql]---
Location: sim-main/packages/db/migrations/0111_solid_dreadnoughts.sql

```sql
ALTER TABLE "copilot_chats" ADD COLUMN "plan_artifact" text;--> statement-breakpoint
ALTER TABLE "copilot_chats" ADD COLUMN "config" jsonb;
```

--------------------------------------------------------------------------------

````
