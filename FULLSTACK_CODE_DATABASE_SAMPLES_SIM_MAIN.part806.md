---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 806
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 806 of 933)

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

---[FILE: tsconfig.json]---
Location: sim-main/packages/db/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "lib": ["es2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@sim/db": ["./index.ts"],
      "@sim/db/*": ["./*"]
    },
    "resolveJsonModule": true,
    "noEmit": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

--------------------------------------------------------------------------------

---[FILE: 0000_careless_black_knight.sql]---
Location: sim-main/packages/db/migrations/0000_careless_black_knight.sql

```sql
-- Current sql file was generated after introspecting the database

CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0001_foamy_dakota_north.sql]---
Location: sim-main/packages/db/migrations/0001_foamy_dakota_north.sql

```sql
CREATE TABLE "workflow" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"state" text NOT NULL,
	"last_synced" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0002_previous_xavin.sql]---
Location: sim-main/packages/db/migrations/0002_previous_xavin.sql

```sql
CREATE TABLE "waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
```

--------------------------------------------------------------------------------

---[FILE: 0003_smiling_hammerhead.sql]---
Location: sim-main/packages/db/migrations/0003_smiling_hammerhead.sql

```sql
CREATE TABLE "logs" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"execution_id" text,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_environment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"variables" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_environment_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"is_auto_connect_enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_environment" ADD CONSTRAINT "user_environment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0004_nasty_mesmero.sql]---
Location: sim-main/packages/db/migrations/0004_nasty_mesmero.sql

```sql
ALTER TABLE "user_settings" ADD COLUMN "is_debug_mode_enabled" boolean DEFAULT false NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0005_shocking_domino.sql]---
Location: sim-main/packages/db/migrations/0005_shocking_domino.sql

```sql
CREATE TABLE "workflow_schedule" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"cron_expression" text,
	"next_run_at" timestamp,
	"last_ran_at" timestamp,
	"trigger_type" text NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow_schedule" ADD CONSTRAINT "workflow_schedule_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0006_plain_zzzax.sql]---
Location: sim-main/packages/db/migrations/0006_plain_zzzax.sql

```sql
CREATE TABLE "workflow_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"execution_id" text,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"general" json NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "environment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"variables" json NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "environment_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "logs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_environment" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "logs" CASCADE;--> statement-breakpoint
DROP TABLE "user_environment" CASCADE;--> statement-breakpoint
DROP TABLE "user_settings" CASCADE;--> statement-breakpoint
ALTER TABLE "workflow" ALTER COLUMN "state" SET DATA TYPE json USING state::json;--> statement-breakpoint
ALTER TABLE "workflow_logs" ADD CONSTRAINT "workflow_logs_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "environment" ADD CONSTRAINT "environment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0007_mute_stepford_cuckoos.sql]---
Location: sim-main/packages/db/migrations/0007_mute_stepford_cuckoos.sql

```sql
ALTER TABLE "workflow_schedule" ADD CONSTRAINT "workflow_schedule_workflow_id_unique" UNIQUE("workflow_id");
```

--------------------------------------------------------------------------------

---[FILE: 0008_quick_paladin.sql]---
Location: sim-main/packages/db/migrations/0008_quick_paladin.sql

```sql
ALTER TABLE "workflow_logs" ADD COLUMN "duration" text;
```

--------------------------------------------------------------------------------

---[FILE: 0009_cynical_bullseye.sql]---
Location: sim-main/packages/db/migrations/0009_cynical_bullseye.sql

```sql
ALTER TABLE "workflow" ADD COLUMN "is_deployed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow" ADD COLUMN "deployed_at" timestamp;--> statement-breakpoint
ALTER TABLE "workflow" ADD COLUMN "api_key" text;
```

--------------------------------------------------------------------------------

---[FILE: 0010_flashy_nebula.sql]---
Location: sim-main/packages/db/migrations/0010_flashy_nebula.sql

```sql
ALTER TABLE "workflow_logs" ADD COLUMN "trigger" text NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0011_youthful_iron_lad.sql]---
Location: sim-main/packages/db/migrations/0011_youthful_iron_lad.sql

```sql
ALTER TABLE "workflow_logs" ALTER COLUMN "trigger" DROP NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0012_minor_dexter_bennett.sql]---
Location: sim-main/packages/db/migrations/0012_minor_dexter_bennett.sql

```sql
ALTER TABLE "workflow" ADD COLUMN "color" text DEFAULT '#3972F6' NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0013_dusty_aaron_stack.sql]---
Location: sim-main/packages/db/migrations/0013_dusty_aaron_stack.sql

```sql
CREATE TABLE "webhook" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"path" text NOT NULL,
	"secret" text,
	"provider" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "path_idx" ON "webhook" USING btree ("path");
```

--------------------------------------------------------------------------------

---[FILE: 0014_nice_dragon_lord.sql]---
Location: sim-main/packages/db/migrations/0014_nice_dragon_lord.sql

```sql
ALTER TABLE "webhook" ADD COLUMN "provider_config" json;--> statement-breakpoint
ALTER TABLE "webhook" DROP COLUMN "secret";
```

--------------------------------------------------------------------------------

---[FILE: 0015_brief_martin_li.sql]---
Location: sim-main/packages/db/migrations/0015_brief_martin_li.sql

```sql
ALTER TABLE "workflow_logs" ADD COLUMN "metadata" json;
```

--------------------------------------------------------------------------------

---[FILE: 0016_cultured_butterfly.sql]---
Location: sim-main/packages/db/migrations/0016_cultured_butterfly.sql

```sql
ALTER TABLE "workflow" ADD COLUMN "collaborators" json DEFAULT '[]' NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0017_curious_ink.sql]---
Location: sim-main/packages/db/migrations/0017_curious_ink.sql

```sql
CREATE TABLE "api_key" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"last_used" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "api_key_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0018_sleepy_champions.sql]---
Location: sim-main/packages/db/migrations/0018_sleepy_champions.sql

```sql
CREATE TABLE "marketplace" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"state" json NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"stars" integer DEFAULT 0 NOT NULL,
	"executions" integer DEFAULT 0 NOT NULL,
	"category" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_execution" (
	"id" text PRIMARY KEY NOT NULL,
	"marketplace_id" text NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_star" (
	"id" text PRIMARY KEY NOT NULL,
	"marketplace_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "marketplace" ADD CONSTRAINT "marketplace_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace" ADD CONSTRAINT "marketplace_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_execution" ADD CONSTRAINT "marketplace_execution_marketplace_id_marketplace_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_execution" ADD CONSTRAINT "marketplace_execution_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_star" ADD CONSTRAINT "marketplace_star_marketplace_id_marketplace_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_star" ADD CONSTRAINT "marketplace_star_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_marketplace_idx" ON "marketplace_star" USING btree ("user_id","marketplace_id");
```

--------------------------------------------------------------------------------

---[FILE: 0019_even_lorna_dane.sql]---
Location: sim-main/packages/db/migrations/0019_even_lorna_dane.sql

```sql
DROP TABLE "marketplace_execution" CASCADE;--> statement-breakpoint
ALTER TABLE "marketplace" RENAME COLUMN "executions" TO "views";
```

--------------------------------------------------------------------------------

---[FILE: 0020_clear_skreet.sql]---
Location: sim-main/packages/db/migrations/0020_clear_skreet.sql

```sql
ALTER TABLE "workflow" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0021_shocking_korath.sql]---
Location: sim-main/packages/db/migrations/0021_shocking_korath.sql

```sql
CREATE TABLE "user_stats" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"total_manual_executions" integer DEFAULT 0 NOT NULL,
	"total_api_calls" integer DEFAULT 0 NOT NULL,
	"total_webhook_triggers" integer DEFAULT 0 NOT NULL,
	"total_scheduled_executions" integer DEFAULT 0 NOT NULL,
	"total_tokens_used" integer DEFAULT 0 NOT NULL,
	"total_cost" numeric DEFAULT '0' NOT NULL,
	"last_active" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "workflow" ADD COLUMN "run_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow" ADD COLUMN "last_run_at" timestamp;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0022_gray_galactus.sql]---
Location: sim-main/packages/db/migrations/0022_gray_galactus.sql

```sql
ALTER TABLE "workflow" ADD COLUMN "variables" json DEFAULT '{}';
```

--------------------------------------------------------------------------------

---[FILE: 0023_nervous_tyger_tiger.sql]---
Location: sim-main/packages/db/migrations/0023_nervous_tyger_tiger.sql

```sql
ALTER TABLE "workflow" DROP COLUMN "api_key";
```

--------------------------------------------------------------------------------

---[FILE: 0024_next_whizzer.sql]---
Location: sim-main/packages/db/migrations/0024_next_whizzer.sql

```sql
ALTER TABLE "workflow" ADD COLUMN "marketplace_data" json DEFAULT 'null'::json;
```

--------------------------------------------------------------------------------

---[FILE: 0025_curved_jubilee.sql]---
Location: sim-main/packages/db/migrations/0025_curved_jubilee.sql

```sql
ALTER TABLE "workflow" ALTER COLUMN "marketplace_data" DROP DEFAULT;
```

--------------------------------------------------------------------------------

---[FILE: 0026_daily_killraven.sql]---
Location: sim-main/packages/db/migrations/0026_daily_killraven.sql

```sql
ALTER TABLE "workflow" ADD COLUMN "deployed_state" json;
```

--------------------------------------------------------------------------------

---[FILE: 0027_careless_gamora.sql]---
Location: sim-main/packages/db/migrations/0027_careless_gamora.sql

```sql
DROP TABLE "marketplace_star" CASCADE;--> statement-breakpoint
ALTER TABLE "marketplace" DROP COLUMN "stars";
```

--------------------------------------------------------------------------------

---[FILE: 0028_absent_triton.sql]---
Location: sim-main/packages/db/migrations/0028_absent_triton.sql

```sql
CREATE TABLE "custom_tools" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"schema" json NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "custom_tools" ADD CONSTRAINT "custom_tools_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0030_happy_joseph.sql]---
Location: sim-main/packages/db/migrations/0030_happy_joseph.sql

```sql
CREATE TABLE "chat" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text NOT NULL,
	"user_id" text NOT NULL,
	"subdomain" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"customizations" json DEFAULT '{}',
	"auth_type" text DEFAULT 'public' NOT NULL,
	"password" text,
	"allowed_emails" json DEFAULT '[]',
	"output_block_id" text,
	"output_path" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"plan" text NOT NULL,
	"reference_id" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"status" text,
	"period_start" timestamp,
	"period_end" timestamp,
	"cancel_at_period_end" boolean,
	"seats" integer
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "subdomain_idx" ON "chat" USING btree ("subdomain");
```

--------------------------------------------------------------------------------

---[FILE: 0031_lively_nico_minoru.sql]---
Location: sim-main/packages/db/migrations/0031_lively_nico_minoru.sql

```sql
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"inviter_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"role" text NOT NULL,
	"status" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "active_organization_id" text;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "trial_start" timestamp;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "trial_end" timestamp;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_active_organization_id_organization_id_fk" FOREIGN KEY ("active_organization_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0032_rare_nico_minoru.sql]---
Location: sim-main/packages/db/migrations/0032_rare_nico_minoru.sql

```sql
ALTER TABLE "chat" ADD COLUMN "output_configs" json DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "chat" DROP COLUMN "output_block_id";--> statement-breakpoint
ALTER TABLE "chat" DROP COLUMN "output_path";
```

--------------------------------------------------------------------------------

---[FILE: 0033_solid_stellaris.sql]---
Location: sim-main/packages/db/migrations/0033_solid_stellaris.sql

```sql
ALTER TABLE "settings" ALTER COLUMN "general" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "theme" text DEFAULT 'system' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "debug_mode" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "auto_connect" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "auto_fill_env_vars" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "telemetry_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "telemetry_notified_user" boolean DEFAULT false NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0034_brainy_revanche.sql]---
Location: sim-main/packages/db/migrations/0034_brainy_revanche.sql

```sql
CREATE TABLE "workspace" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_member" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow" ADD COLUMN "workspace_id" text;--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_member" ADD CONSTRAINT "workspace_member_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_member" ADD CONSTRAINT "workspace_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_workspace_idx" ON "workspace_member" USING btree ("user_id","workspace_id");--> statement-breakpoint
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0035_slim_energizer.sql]---
Location: sim-main/packages/db/migrations/0035_slim_energizer.sql

```sql
CREATE TABLE "workspace_invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"email" text NOT NULL,
	"inviter_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_invitation_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "workspace_invitation" ADD CONSTRAINT "workspace_invitation_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_invitation" ADD CONSTRAINT "workspace_invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
```

--------------------------------------------------------------------------------

---[FILE: 0036_married_skreet.sql]---
Location: sim-main/packages/db/migrations/0036_married_skreet.sql

```sql
ALTER TABLE "organization" ALTER COLUMN "metadata" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "metadata" json;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "total_chat_executions" integer DEFAULT 0 NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0037_outgoing_madame_hydra.sql]---
Location: sim-main/packages/db/migrations/0037_outgoing_madame_hydra.sql

```sql
ALTER TABLE "workflow_schedule" ADD COLUMN "failed_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_schedule" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_schedule" ADD COLUMN "last_failed_at" timestamp;
```

--------------------------------------------------------------------------------

---[FILE: 0038_shocking_thor.sql]---
Location: sim-main/packages/db/migrations/0038_shocking_thor.sql

```sql
CREATE TABLE "memory" (
	"id" text PRIMARY KEY NOT NULL,
	"workflow_id" text,
	"key" text NOT NULL,
	"type" text NOT NULL,
	"data" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "memory" ADD CONSTRAINT "memory_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "memory_key_idx" ON "memory" USING btree ("key");--> statement-breakpoint
CREATE INDEX "memory_workflow_idx" ON "memory" USING btree ("workflow_id");--> statement-breakpoint
CREATE UNIQUE INDEX "memory_workflow_key_idx" ON "memory" USING btree ("workflow_id","key");
```

--------------------------------------------------------------------------------

---[FILE: 0039_tranquil_speed.sql]---
Location: sim-main/packages/db/migrations/0039_tranquil_speed.sql

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS "knowledge_base" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"workspace_id" text,
	"name" text NOT NULL,
	"description" text,
	"token_count" integer DEFAULT 0 NOT NULL,
	"embedding_model" text DEFAULT 'text-embedding-3-small' NOT NULL,
	"embedding_dimension" integer DEFAULT 1536 NOT NULL,
	"chunking_config" json DEFAULT '{"maxSize": 1024, "minSize": 100, "overlap": 200}' NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create document table
CREATE TABLE IF NOT EXISTS "document" (
	"id" text PRIMARY KEY NOT NULL,
	"knowledge_base_id" text NOT NULL,
	"filename" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" text NOT NULL,
	"file_hash" text,
	"chunk_count" integer DEFAULT 0 NOT NULL,
	"token_count" integer DEFAULT 0 NOT NULL,
	"character_count" integer DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);

-- Create embedding table with optimized vector type
CREATE TABLE IF NOT EXISTS "embedding" (
	"id" text PRIMARY KEY NOT NULL,
	"knowledge_base_id" text NOT NULL,
	"document_id" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"chunk_hash" text NOT NULL,
	"content" text NOT NULL,
	"content_length" integer NOT NULL,
	"token_count" integer NOT NULL,
	"embedding" vector(1536) NOT NULL, -- Optimized for text-embedding-3-small with HNSW support
	"embedding_model" text DEFAULT 'text-embedding-3-small' NOT NULL,
	"start_offset" integer NOT NULL,
	"end_offset" integer NOT NULL,
	"overlap_tokens" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"search_rank" numeric DEFAULT '1.0',
	"access_count" integer DEFAULT 0 NOT NULL,
	"last_accessed_at" timestamp,
	"quality_score" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	
	-- Ensure embedding exists (simplified constraint)
	CONSTRAINT "embedding_not_null_check" CHECK ("embedding" IS NOT NULL)
);

-- Add foreign key constraints
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "document" ADD CONSTRAINT "document_knowledge_base_id_knowledge_base_id_fk" FOREIGN KEY ("knowledge_base_id") REFERENCES "knowledge_base"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "embedding" ADD CONSTRAINT "embedding_knowledge_base_id_knowledge_base_id_fk" FOREIGN KEY ("knowledge_base_id") REFERENCES "knowledge_base"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "embedding" ADD CONSTRAINT "embedding_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE cascade ON UPDATE no action;

-- Create indexes for knowledge_base table
CREATE INDEX IF NOT EXISTS "kb_user_id_idx" ON "knowledge_base" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "kb_workspace_id_idx" ON "knowledge_base" USING btree ("workspace_id");
CREATE INDEX IF NOT EXISTS "kb_user_workspace_idx" ON "knowledge_base" USING btree ("user_id","workspace_id");
CREATE INDEX IF NOT EXISTS "kb_deleted_at_idx" ON "knowledge_base" USING btree ("deleted_at");

-- Create indexes for document table
CREATE INDEX IF NOT EXISTS "doc_kb_id_idx" ON "document" USING btree ("knowledge_base_id");
CREATE INDEX IF NOT EXISTS "doc_file_hash_idx" ON "document" USING btree ("file_hash");
CREATE INDEX IF NOT EXISTS "doc_filename_idx" ON "document" USING btree ("filename");
CREATE INDEX IF NOT EXISTS "doc_kb_uploaded_at_idx" ON "document" USING btree ("knowledge_base_id","uploaded_at");

-- Create embedding table indexes
CREATE INDEX IF NOT EXISTS "emb_kb_id_idx" ON "embedding" USING btree ("knowledge_base_id");
CREATE INDEX IF NOT EXISTS "emb_doc_id_idx" ON "embedding" USING btree ("document_id");
CREATE UNIQUE INDEX IF NOT EXISTS "emb_doc_chunk_idx" ON "embedding" USING btree ("document_id","chunk_index");
CREATE INDEX IF NOT EXISTS "emb_kb_model_idx" ON "embedding" USING btree ("knowledge_base_id","embedding_model");
CREATE INDEX IF NOT EXISTS "emb_chunk_hash_idx" ON "embedding" USING btree ("chunk_hash");
CREATE INDEX IF NOT EXISTS "emb_kb_access_idx" ON "embedding" USING btree ("knowledge_base_id","last_accessed_at");
CREATE INDEX IF NOT EXISTS "emb_kb_rank_idx" ON "embedding" USING btree ("knowledge_base_id","search_rank");

-- Create optimized HNSW index for vector similarity search
CREATE INDEX IF NOT EXISTS "embedding_vector_hnsw_idx" ON "embedding" 
  USING hnsw ("embedding" vector_cosine_ops) 
  WITH (m = 16, ef_construction = 64);

-- GIN index for JSONB metadata queries
CREATE INDEX IF NOT EXISTS "emb_metadata_gin_idx" ON "embedding" USING gin ("metadata");

-- Full-text search support with generated tsvector column
ALTER TABLE "embedding" ADD COLUMN IF NOT EXISTS "content_tsv" tsvector GENERATED ALWAYS AS (to_tsvector('english', "content")) STORED;
CREATE INDEX IF NOT EXISTS "emb_content_fts_idx" ON "embedding" USING gin ("content_tsv");

-- Performance optimization: Set fillfactor for high-update tables
ALTER TABLE "embedding" SET (fillfactor = 85);
ALTER TABLE "document" SET (fillfactor = 90);

-- Add table comments for documentation
COMMENT ON TABLE "knowledge_base" IS 'Stores knowledge base configurations and settings';
COMMENT ON TABLE "document" IS 'Stores document metadata and processing status';
COMMENT ON TABLE "embedding" IS 'Stores vector embeddings optimized for text-embedding-3-small with HNSW similarity search';
COMMENT ON COLUMN "embedding"."embedding" IS 'Vector embedding using pgvector type optimized for HNSW similarity search';
COMMENT ON COLUMN "embedding"."metadata" IS 'JSONB metadata for flexible filtering (e.g., page numbers, sections, tags)';
COMMENT ON COLUMN "embedding"."search_rank" IS 'Boost factor for search results, higher values appear first';
```

--------------------------------------------------------------------------------

---[FILE: 0040_silky_monster_badoon.sql]---
Location: sim-main/packages/db/migrations/0040_silky_monster_badoon.sql

```sql
-- Add enabled field to embedding table
ALTER TABLE "embedding" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true NOT NULL;

-- Composite index for knowledge base + enabled chunks (for search optimization)
CREATE INDEX IF NOT EXISTS "emb_kb_enabled_idx" ON "embedding" USING btree ("knowledge_base_id", "enabled");

-- Composite index for document + enabled chunks (for document chunk listings)
CREATE INDEX IF NOT EXISTS "emb_doc_enabled_idx" ON "embedding" USING btree ("document_id", "enabled");
```

--------------------------------------------------------------------------------

---[FILE: 0041_sparkling_ma_gnuci.sql]---
Location: sim-main/packages/db/migrations/0041_sparkling_ma_gnuci.sql

```sql
ALTER TABLE "settings" ADD COLUMN "email_preferences" json DEFAULT '{}' NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0042_breezy_miracleman.sql]---
Location: sim-main/packages/db/migrations/0042_breezy_miracleman.sql

```sql
CREATE TABLE "workflow_folder" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"parent_id" text,
	"color" text DEFAULT '#6B7280',
	"is_expanded" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow" ADD COLUMN "folder_id" text;--> statement-breakpoint
ALTER TABLE "workflow_folder" ADD CONSTRAINT "workflow_folder_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_folder" ADD CONSTRAINT "workflow_folder_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_folder" ADD CONSTRAINT "workflow_folder_parent_id_workflow_folder_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."workflow_folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workflow_folder_workspace_parent_idx" ON "workflow_folder" USING btree ("workspace_id","parent_id");--> statement-breakpoint
CREATE INDEX "workflow_folder_user_idx" ON "workflow_folder" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "workflow_folder_parent_sort_idx" ON "workflow_folder" USING btree ("parent_id","sort_order");--> statement-breakpoint
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_folder_id_workflow_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."workflow_folder"("id") ON DELETE set null ON UPDATE no action;
```

--------------------------------------------------------------------------------

````
