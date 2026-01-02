---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 809
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 809 of 933)

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

---[FILE: 0112_tired_blink.sql]---
Location: sim-main/packages/db/migrations/0112_tired_blink.sql

```sql
DROP INDEX "doc_kb_uploaded_at_idx";--> statement-breakpoint
DROP INDEX "workflow_blocks_workflow_type_idx";--> statement-breakpoint
DROP INDEX "workflow_deployment_version_workflow_id_idx";--> statement-breakpoint
DROP INDEX "workflow_execution_logs_execution_id_idx";--> statement-breakpoint
ALTER TABLE "webhook" ADD COLUMN "failed_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "webhook" ADD COLUMN "last_failed_at" timestamp;--> statement-breakpoint
CREATE INDEX "idx_account_on_account_id_provider_id" ON "account" USING btree ("account_id","provider_id");--> statement-breakpoint
CREATE INDEX "idx_webhook_on_workflow_id_block_id" ON "webhook" USING btree ("workflow_id","block_id");
```

--------------------------------------------------------------------------------

---[FILE: 0113_calm_tiger_shark.sql]---
Location: sim-main/packages/db/migrations/0113_calm_tiger_shark.sql

```sql
-- Step 1: Convert non-UUID IDs to UUIDs (preserve existing UUIDs)
-- This allows same title in different workspaces by removing function-name-based IDs
UPDATE "custom_tools"
SET "id" = gen_random_uuid()::text
WHERE workspace_id IS NOT NULL  -- Only update workspace-scoped tools
  AND "id" !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';  -- Skip if already UUID

-- Step 2: Add composite unique constraint on (workspace_id, title)
-- This enforces uniqueness per workspace, not globally
CREATE UNIQUE INDEX "custom_tools_workspace_title_unique" ON "custom_tools" USING btree ("workspace_id","title");
```

--------------------------------------------------------------------------------

---[FILE: 0114_wise_sunfire.sql]---
Location: sim-main/packages/db/migrations/0114_wise_sunfire.sql

```sql
ALTER TABLE "organization" ADD COLUMN "departed_member_usage" numeric DEFAULT '0' NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0115_redundant_cerebro.sql]---
Location: sim-main/packages/db/migrations/0115_redundant_cerebro.sql

```sql
ALTER TABLE "template_creators" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0116_flimsy_shape.sql]---
Location: sim-main/packages/db/migrations/0116_flimsy_shape.sql

```sql
CREATE TYPE "public"."notification_delivery_status" AS ENUM('pending', 'in_progress', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('webhook', 'email', 'slack');--> statement-breakpoint
CREATE TABLE "workspace_notification_delivery" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"workflow_id" text NOT NULL,
	"execution_id" text NOT NULL,
	"status" "notification_delivery_status" DEFAULT 'pending' NOT NULL,
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
CREATE TABLE "workspace_notification_subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"notification_type" "notification_type" NOT NULL,
	"workflow_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"all_workflows" boolean DEFAULT false NOT NULL,
	"level_filter" text[] DEFAULT ARRAY['info', 'error']::text[] NOT NULL,
	"trigger_filter" text[] DEFAULT ARRAY['api', 'webhook', 'schedule', 'manual', 'chat']::text[] NOT NULL,
	"include_final_output" boolean DEFAULT false NOT NULL,
	"include_trace_spans" boolean DEFAULT false NOT NULL,
	"include_rate_limits" boolean DEFAULT false NOT NULL,
	"include_usage_data" boolean DEFAULT false NOT NULL,
	"webhook_config" jsonb,
	"email_recipients" text[],
	"slack_config" jsonb,
	"alert_config" jsonb,
	"last_alert_at" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "workspace_notification_subscription" (
	"id",
	"workspace_id",
	"notification_type",
	"workflow_ids",
	"all_workflows",
	"level_filter",
	"trigger_filter",
	"include_final_output",
	"include_trace_spans",
	"include_rate_limits",
	"include_usage_data",
	"webhook_config",
	"active",
	"created_by",
	"created_at",
	"updated_at"
)
SELECT
	wlw.id,
	w.workspace_id,
	'webhook'::"notification_type",
	ARRAY[wlw.workflow_id],
	false,
	wlw.level_filter,
	wlw.trigger_filter,
	wlw.include_final_output,
	wlw.include_trace_spans,
	wlw.include_rate_limits,
	wlw.include_usage_data,
	jsonb_build_object('url', wlw.url, 'secret', wlw.secret),
	wlw.active,
	w.user_id,
	wlw.created_at,
	wlw.updated_at
FROM workflow_log_webhook wlw
JOIN workflow w ON w.id = wlw.workflow_id
WHERE w.workspace_id IS NOT NULL;--> statement-breakpoint
DROP TABLE "workflow_log_webhook_delivery" CASCADE;--> statement-breakpoint
DROP TABLE "workflow_log_webhook" CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_notification_delivery" ADD CONSTRAINT "workspace_notification_delivery_subscription_id_workspace_notification_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."workspace_notification_subscription"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_notification_delivery" ADD CONSTRAINT "workspace_notification_delivery_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_notification_subscription" ADD CONSTRAINT "workspace_notification_subscription_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_notification_subscription" ADD CONSTRAINT "workspace_notification_subscription_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workspace_notification_delivery_subscription_id_idx" ON "workspace_notification_delivery" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "workspace_notification_delivery_execution_id_idx" ON "workspace_notification_delivery" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "workspace_notification_delivery_status_idx" ON "workspace_notification_delivery" USING btree ("status");--> statement-breakpoint
CREATE INDEX "workspace_notification_delivery_next_attempt_idx" ON "workspace_notification_delivery" USING btree ("next_attempt_at");--> statement-breakpoint
CREATE INDEX "workspace_notification_workspace_id_idx" ON "workspace_notification_subscription" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_notification_active_idx" ON "workspace_notification_subscription" USING btree ("active");--> statement-breakpoint
CREATE INDEX "workspace_notification_type_idx" ON "workspace_notification_subscription" USING btree ("notification_type");--> statement-breakpoint
ALTER TABLE "settings" DROP COLUMN "auto_pan";--> statement-breakpoint
ALTER TABLE "settings" DROP COLUMN "console_expanded_by_default";--> statement-breakpoint
ALTER TABLE "settings" DROP COLUMN "show_floating_controls";--> statement-breakpoint
DROP TYPE "public"."webhook_delivery_status";
```

--------------------------------------------------------------------------------

---[FILE: 0117_silly_purifiers.sql]---
Location: sim-main/packages/db/migrations/0117_silly_purifiers.sql

```sql
ALTER TABLE "settings" ADD COLUMN "copilot_auto_allowed_tools" jsonb DEFAULT '[]' NOT NULL;
```

--------------------------------------------------------------------------------

---[FILE: 0118_tiresome_landau.sql]---
Location: sim-main/packages/db/migrations/0118_tiresome_landau.sql

```sql
CREATE TYPE "public"."billing_blocked_reason" AS ENUM('payment_failed', 'dispute');--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "credit_balance" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "credit_balance" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "billing_blocked_reason" "billing_blocked_reason";
```

--------------------------------------------------------------------------------

---[FILE: 0119_far_lethal_legion.sql]---
Location: sim-main/packages/db/migrations/0119_far_lethal_legion.sql

```sql
CREATE TABLE "rate_limit_bucket" (
	"key" text PRIMARY KEY NOT NULL,
	"tokens" numeric NOT NULL,
	"last_refill_at" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "user_rate_limits" CASCADE;
```

--------------------------------------------------------------------------------

---[FILE: 0120_illegal_moon_knight.sql]---
Location: sim-main/packages/db/migrations/0120_illegal_moon_knight.sql

```sql
DELETE FROM account a
USING account b
WHERE a.user_id = b.user_id
  AND a.provider_id = b.provider_id
  AND a.account_id = b.account_id
  AND a.id <> b.id
  AND a.updated_at < b.updated_at;
--> statement-breakpoint
CREATE UNIQUE INDEX "account_user_provider_account_unique" ON "account" USING btree ("user_id","provider_id","account_id");
```

--------------------------------------------------------------------------------

---[FILE: 0121_new_mantis.sql]---
Location: sim-main/packages/db/migrations/0121_new_mantis.sql

```sql
ALTER TABLE "workflow_execution_logs" ADD COLUMN "deployment_version_id" text;--> statement-breakpoint
ALTER TABLE "workflow_execution_logs" ADD CONSTRAINT "workflow_execution_logs_deployment_version_id_workflow_deployment_version_id_fk" FOREIGN KEY ("deployment_version_id") REFERENCES "public"."workflow_deployment_version"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workflow_execution_logs_deployment_version_id_idx" ON "workflow_execution_logs" USING btree ("deployment_version_id");
```

--------------------------------------------------------------------------------

---[FILE: 0122_pale_absorbing_man.sql]---
Location: sim-main/packages/db/migrations/0122_pale_absorbing_man.sql

```sql
DROP TABLE "marketplace" CASCADE;
```

--------------------------------------------------------------------------------

---[FILE: 0123_windy_lockheed.sql]---
Location: sim-main/packages/db/migrations/0123_windy_lockheed.sql

```sql
ALTER TABLE "mcp_servers" ADD COLUMN "status_config" jsonb DEFAULT '{}';
```

--------------------------------------------------------------------------------

---[FILE: 0000_snapshot.json]---
Location: sim-main/packages/db/migrations/meta/0000_snapshot.json

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "prevId": "",
  "version": "7",
  "dialect": "postgresql",
  "tables": {
    "public.verification": {
      "name": "verification",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "identifier": {
          "name": "identifier",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "value": {
          "name": "value",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "expires_at": {
          "name": "expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "checkConstraints": {},
      "policies": {},
      "isRLSEnabled": false
    },
    "public.user": {
      "name": "user",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "name": {
          "name": "name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "email": {
          "name": "email",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "email_verified": {
          "name": "email_verified",
          "type": "boolean",
          "primaryKey": false,
          "notNull": true
        },
        "image": {
          "name": "image",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "user_email_unique": {
          "columns": ["email"],
          "nullsNotDistinct": false,
          "name": "user_email_unique"
        }
      },
      "checkConstraints": {},
      "policies": {},
      "isRLSEnabled": false
    },
    "public.account": {
      "name": "account",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "account_id": {
          "name": "account_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "provider_id": {
          "name": "provider_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "user_id": {
          "name": "user_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "access_token": {
          "name": "access_token",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "refresh_token": {
          "name": "refresh_token",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "id_token": {
          "name": "id_token",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "access_token_expires_at": {
          "name": "access_token_expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        },
        "refresh_token_expires_at": {
          "name": "refresh_token_expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        },
        "scope": {
          "name": "scope",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "password": {
          "name": "password",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {
        "account_user_id_user_id_fk": {
          "name": "account_user_id_user_id_fk",
          "tableFrom": "account",
          "tableTo": "user",
          "schemaTo": "public",
          "columnsFrom": ["user_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "checkConstraints": {},
      "policies": {},
      "isRLSEnabled": false
    },
    "public.session": {
      "name": "session",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "expires_at": {
          "name": "expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "token": {
          "name": "token",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "ip_address": {
          "name": "ip_address",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "user_agent": {
          "name": "user_agent",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "user_id": {
          "name": "user_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {
        "session_user_id_user_id_fk": {
          "name": "session_user_id_user_id_fk",
          "tableFrom": "session",
          "tableTo": "user",
          "schemaTo": "public",
          "columnsFrom": ["user_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "session_token_unique": {
          "columns": ["token"],
          "nullsNotDistinct": false,
          "name": "session_token_unique"
        }
      },
      "checkConstraints": {},
      "policies": {},
      "isRLSEnabled": false
    }
  },
  "enums": {},
  "schemas": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "views": {},
  "_meta": {
    "schemas": {},
    "tables": {},
    "columns": {}
  },
  "internal": {
    "tables": {}
  }
}
```

--------------------------------------------------------------------------------

---[FILE: 0001_snapshot.json]---
Location: sim-main/packages/db/migrations/meta/0001_snapshot.json

```json
{
  "id": "a17085d8-94da-40fe-b71c-e143059e3f80",
  "prevId": "00000000-0000-0000-0000-000000000000",
  "version": "7",
  "dialect": "postgresql",
  "tables": {
    "public.account": {
      "name": "account",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "account_id": {
          "name": "account_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "provider_id": {
          "name": "provider_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "user_id": {
          "name": "user_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "access_token": {
          "name": "access_token",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "refresh_token": {
          "name": "refresh_token",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "id_token": {
          "name": "id_token",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "access_token_expires_at": {
          "name": "access_token_expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        },
        "refresh_token_expires_at": {
          "name": "refresh_token_expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        },
        "scope": {
          "name": "scope",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "password": {
          "name": "password",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {
        "account_user_id_user_id_fk": {
          "name": "account_user_id_user_id_fk",
          "tableFrom": "account",
          "tableTo": "user",
          "columnsFrom": ["user_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.session": {
      "name": "session",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "expires_at": {
          "name": "expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "token": {
          "name": "token",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "ip_address": {
          "name": "ip_address",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "user_agent": {
          "name": "user_agent",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "user_id": {
          "name": "user_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {
        "session_user_id_user_id_fk": {
          "name": "session_user_id_user_id_fk",
          "tableFrom": "session",
          "tableTo": "user",
          "columnsFrom": ["user_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "session_token_unique": {
          "name": "session_token_unique",
          "nullsNotDistinct": false,
          "columns": ["token"]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.user": {
      "name": "user",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "name": {
          "name": "name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "email": {
          "name": "email",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "email_verified": {
          "name": "email_verified",
          "type": "boolean",
          "primaryKey": false,
          "notNull": true
        },
        "image": {
          "name": "image",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "user_email_unique": {
          "name": "user_email_unique",
          "nullsNotDistinct": false,
          "columns": ["email"]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.verification": {
      "name": "verification",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "identifier": {
          "name": "identifier",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "value": {
          "name": "value",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "expires_at": {
          "name": "expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.workflow": {
      "name": "workflow",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "user_id": {
          "name": "user_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "name": {
          "name": "name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "description": {
          "name": "description",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "state": {
          "name": "state",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "last_synced": {
          "name": "last_synced",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {
        "workflow_user_id_user_id_fk": {
          "name": "workflow_user_id_user_id_fk",
          "tableFrom": "workflow",
          "tableTo": "user",
          "columnsFrom": ["user_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    }
  },
  "enums": {},
  "schemas": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "views": {},
  "_meta": {
    "columns": {},
    "schemas": {},
    "tables": {}
  }
}
```

--------------------------------------------------------------------------------

---[FILE: 0002_snapshot.json]---
Location: sim-main/packages/db/migrations/meta/0002_snapshot.json

```json
{
  "id": "80542c3c-48a3-41e5-b911-fe51152efccc",
  "prevId": "a17085d8-94da-40fe-b71c-e143059e3f80",
  "version": "7",
  "dialect": "postgresql",
  "tables": {
    "public.account": {
      "name": "account",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "account_id": {
          "name": "account_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "provider_id": {
          "name": "provider_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "user_id": {
          "name": "user_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "access_token": {
          "name": "access_token",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "refresh_token": {
          "name": "refresh_token",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "id_token": {
          "name": "id_token",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "access_token_expires_at": {
          "name": "access_token_expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        },
        "refresh_token_expires_at": {
          "name": "refresh_token_expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        },
        "scope": {
          "name": "scope",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "password": {
          "name": "password",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {
        "account_user_id_user_id_fk": {
          "name": "account_user_id_user_id_fk",
          "tableFrom": "account",
          "tableTo": "user",
          "columnsFrom": ["user_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.session": {
      "name": "session",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "expires_at": {
          "name": "expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "token": {
          "name": "token",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "ip_address": {
          "name": "ip_address",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "user_agent": {
          "name": "user_agent",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "user_id": {
          "name": "user_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {
        "session_user_id_user_id_fk": {
          "name": "session_user_id_user_id_fk",
          "tableFrom": "session",
          "tableTo": "user",
          "columnsFrom": ["user_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "session_token_unique": {
          "name": "session_token_unique",
          "nullsNotDistinct": false,
          "columns": ["token"]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.user": {
      "name": "user",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "name": {
          "name": "name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "email": {
          "name": "email",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "email_verified": {
          "name": "email_verified",
          "type": "boolean",
          "primaryKey": false,
          "notNull": true
        },
        "image": {
          "name": "image",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "user_email_unique": {
          "name": "user_email_unique",
          "nullsNotDistinct": false,
          "columns": ["email"]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.verification": {
      "name": "verification",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "identifier": {
          "name": "identifier",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "value": {
          "name": "value",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "expires_at": {
          "name": "expires_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": false
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.waitlist": {
      "name": "waitlist",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "email": {
          "name": "email",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "status": {
          "name": "status",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "default": "'pending'"
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "waitlist_email_unique": {
          "name": "waitlist_email_unique",
          "nullsNotDistinct": false,
          "columns": ["email"]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.workflow": {
      "name": "workflow",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true
        },
        "user_id": {
          "name": "user_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "name": {
          "name": "name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "description": {
          "name": "description",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "state": {
          "name": "state",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "last_synced": {
          "name": "last_synced",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {
        "workflow_user_id_user_id_fk": {
          "name": "workflow_user_id_user_id_fk",
          "tableFrom": "workflow",
          "tableTo": "user",
          "columnsFrom": ["user_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    }
  },
  "enums": {},
  "schemas": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "views": {},
  "_meta": {
    "columns": {},
    "schemas": {},
    "tables": {}
  }
}
```

--------------------------------------------------------------------------------

````
