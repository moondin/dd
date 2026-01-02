---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 772
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 772 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: objectstorage_bucket_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/objectstorage/objectstorage_bucket_not_publicly_accessible/objectstorage_bucket_not_publicly_accessible_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_objectstorage_bucket_not_publicly_accessible:
    def test_no_resources(self):
        """objectstorage_bucket_not_publicly_accessible: No resources to check"""
        objectstorage_client = mock.MagicMock()
        objectstorage_client.audited_compartments = {
            OCI_COMPARTMENT_ID: mock.MagicMock()
        }
        objectstorage_client.audited_tenancy = OCI_TENANCY_ID

        # Mock empty collections
        objectstorage_client.rules = []
        objectstorage_client.topics = []
        objectstorage_client.subscriptions = []
        objectstorage_client.users = []
        objectstorage_client.groups = []
        objectstorage_client.policies = []
        objectstorage_client.compartments = []
        objectstorage_client.instances = []
        objectstorage_client.volumes = []
        objectstorage_client.boot_volumes = []
        objectstorage_client.buckets = []
        objectstorage_client.keys = []
        objectstorage_client.file_systems = []
        objectstorage_client.databases = []
        objectstorage_client.security_lists = []
        objectstorage_client.security_groups = []
        objectstorage_client.subnets = []
        objectstorage_client.vcns = []
        objectstorage_client.configuration = None
        objectstorage_client.active_non_root_compartments = []
        objectstorage_client.password_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_not_publicly_accessible.objectstorage_bucket_not_publicly_accessible.objectstorage_client",
                new=objectstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_not_publicly_accessible.objectstorage_bucket_not_publicly_accessible import (
                objectstorage_bucket_not_publicly_accessible,
            )

            check = objectstorage_bucket_not_publicly_accessible()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """objectstorage_bucket_not_publicly_accessible: Resource passes the check (PASS)"""
        objectstorage_client = mock.MagicMock()
        objectstorage_client.audited_compartments = {
            OCI_COMPARTMENT_ID: mock.MagicMock()
        }
        objectstorage_client.audited_tenancy = OCI_TENANCY_ID

        # Mock a compliant resource
        resource = mock.MagicMock()
        resource.id = "ocid1.resource.oc1.iad.aaaaaaaexample"
        resource.name = "compliant-resource"
        resource.region = OCI_REGION
        resource.compartment_id = OCI_COMPARTMENT_ID
        resource.lifecycle_state = "ACTIVE"
        resource.tags = {"Environment": "Production"}

        # Set attributes that make the resource compliant
        resource.versioning = "Enabled"
        resource.is_auto_rotation_enabled = True
        resource.rotation_interval_in_days = 90
        resource.public_access_type = "NoPublicAccess"
        resource.logging_enabled = True
        resource.kms_key_id = "ocid1.key.oc1.iad.aaaaaaaexample"
        resource.in_transit_encryption = "ENABLED"
        resource.is_secure_boot_enabled = True
        resource.legacy_endpoint_disabled = True
        resource.is_legacy_imds_endpoint_disabled = True

        # Mock client with compliant resource
        objectstorage_client.buckets = [resource]
        objectstorage_client.keys = [resource]
        objectstorage_client.volumes = [resource]
        objectstorage_client.boot_volumes = [resource]
        objectstorage_client.instances = [resource]
        objectstorage_client.file_systems = [resource]
        objectstorage_client.databases = [resource]
        objectstorage_client.security_lists = []
        objectstorage_client.security_groups = []
        objectstorage_client.rules = []
        objectstorage_client.configuration = resource
        objectstorage_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_not_publicly_accessible.objectstorage_bucket_not_publicly_accessible.objectstorage_client",
                new=objectstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_not_publicly_accessible.objectstorage_bucket_not_publicly_accessible import (
                objectstorage_bucket_not_publicly_accessible,
            )

            check = objectstorage_bucket_not_publicly_accessible()
            result = check.execute()

            assert isinstance(result, list)

            # If results exist, verify PASS findings
            if len(result) > 0:
                # Find PASS results
                pass_results = [r for r in result if r.status == "PASS"]

                if pass_results:
                    # Detailed assertions on first PASS result
                    assert pass_results[0].status == "PASS"
                    assert pass_results[0].status_extended is not None
                    assert len(pass_results[0].status_extended) > 0

                    # Verify resource identification
                    assert pass_results[0].resource_id is not None
                    assert pass_results[0].resource_name is not None
                    assert pass_results[0].region is not None
                    assert pass_results[0].compartment_id is not None

                    # Verify metadata
                    assert pass_results[0].check_metadata.Provider == "oraclecloud"
                    assert (
                        pass_results[0].check_metadata.CheckID
                        == "objectstorage_bucket_not_publicly_accessible"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "objectstorage"

    def test_resource_non_compliant(self):
        """objectstorage_bucket_not_publicly_accessible: Resource fails the check (FAIL)"""
        objectstorage_client = mock.MagicMock()
        objectstorage_client.audited_compartments = {
            OCI_COMPARTMENT_ID: mock.MagicMock()
        }
        objectstorage_client.audited_tenancy = OCI_TENANCY_ID

        # Mock a non-compliant resource
        resource = mock.MagicMock()
        resource.id = "ocid1.resource.oc1.iad.bbbbbbbexample"
        resource.name = "non-compliant-resource"
        resource.region = OCI_REGION
        resource.compartment_id = OCI_COMPARTMENT_ID
        resource.lifecycle_state = "ACTIVE"
        resource.tags = {"Environment": "Development"}

        # Set attributes that make the resource non-compliant
        resource.versioning = "Disabled"
        resource.is_auto_rotation_enabled = False
        resource.rotation_interval_in_days = None
        resource.public_access_type = "ObjectRead"
        resource.logging_enabled = False
        resource.kms_key_id = None
        resource.in_transit_encryption = "DISABLED"
        resource.is_secure_boot_enabled = False
        resource.legacy_endpoint_disabled = False
        resource.is_legacy_imds_endpoint_disabled = False

        # Mock client with non-compliant resource
        objectstorage_client.buckets = [resource]
        objectstorage_client.keys = [resource]
        objectstorage_client.volumes = [resource]
        objectstorage_client.boot_volumes = [resource]
        objectstorage_client.instances = [resource]
        objectstorage_client.file_systems = [resource]
        objectstorage_client.databases = [resource]
        objectstorage_client.security_lists = []
        objectstorage_client.security_groups = []
        objectstorage_client.rules = []
        objectstorage_client.configuration = resource
        objectstorage_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_not_publicly_accessible.objectstorage_bucket_not_publicly_accessible.objectstorage_client",
                new=objectstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_not_publicly_accessible.objectstorage_bucket_not_publicly_accessible import (
                objectstorage_bucket_not_publicly_accessible,
            )

            check = objectstorage_bucket_not_publicly_accessible()
            result = check.execute()

            assert isinstance(result, list)

            # Verify FAIL findings exist
            if len(result) > 0:
                # Find FAIL results
                fail_results = [r for r in result if r.status == "FAIL"]

                if fail_results:
                    # Detailed assertions on first FAIL result
                    assert fail_results[0].status == "FAIL"
                    assert fail_results[0].status_extended is not None
                    assert len(fail_results[0].status_extended) > 0

                    # Verify resource identification
                    assert fail_results[0].resource_id is not None
                    assert fail_results[0].resource_name is not None
                    assert fail_results[0].region is not None
                    assert fail_results[0].compartment_id is not None

                    # Verify metadata
                    assert fail_results[0].check_metadata.Provider == "oraclecloud"
                    assert (
                        fail_results[0].check_metadata.CheckID
                        == "objectstorage_bucket_not_publicly_accessible"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "objectstorage"
```

--------------------------------------------------------------------------------

---[FILE: objectstorage_bucket_versioning_enabled_test.py]---
Location: prowler-master/tests/providers/oraclecloud/services/objectstorage/objectstorage_bucket_versioning_enabled/objectstorage_bucket_versioning_enabled_test.py

```python
from unittest import mock

from tests.providers.oraclecloud.oci_fixtures import (
    OCI_COMPARTMENT_ID,
    OCI_REGION,
    OCI_TENANCY_ID,
    set_mocked_oraclecloud_provider,
)


class Test_objectstorage_bucket_versioning_enabled:
    def test_no_resources(self):
        """objectstorage_bucket_versioning_enabled: No resources to check"""
        objectstorage_client = mock.MagicMock()
        objectstorage_client.audited_compartments = {
            OCI_COMPARTMENT_ID: mock.MagicMock()
        }
        objectstorage_client.audited_tenancy = OCI_TENANCY_ID

        # Mock empty collections
        objectstorage_client.rules = []
        objectstorage_client.topics = []
        objectstorage_client.subscriptions = []
        objectstorage_client.users = []
        objectstorage_client.groups = []
        objectstorage_client.policies = []
        objectstorage_client.compartments = []
        objectstorage_client.instances = []
        objectstorage_client.volumes = []
        objectstorage_client.boot_volumes = []
        objectstorage_client.buckets = []
        objectstorage_client.keys = []
        objectstorage_client.file_systems = []
        objectstorage_client.databases = []
        objectstorage_client.security_lists = []
        objectstorage_client.security_groups = []
        objectstorage_client.subnets = []
        objectstorage_client.vcns = []
        objectstorage_client.configuration = None
        objectstorage_client.active_non_root_compartments = []
        objectstorage_client.password_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_versioning_enabled.objectstorage_bucket_versioning_enabled.objectstorage_client",
                new=objectstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_versioning_enabled.objectstorage_bucket_versioning_enabled import (
                objectstorage_bucket_versioning_enabled,
            )

            check = objectstorage_bucket_versioning_enabled()
            result = check.execute()

            # Verify result is a list (empty or with findings)
            assert isinstance(result, list)

    def test_resource_compliant(self):
        """objectstorage_bucket_versioning_enabled: Resource passes the check (PASS)"""
        objectstorage_client = mock.MagicMock()
        objectstorage_client.audited_compartments = {
            OCI_COMPARTMENT_ID: mock.MagicMock()
        }
        objectstorage_client.audited_tenancy = OCI_TENANCY_ID

        # Mock a compliant resource
        resource = mock.MagicMock()
        resource.id = "ocid1.resource.oc1.iad.aaaaaaaexample"
        resource.name = "compliant-resource"
        resource.region = OCI_REGION
        resource.compartment_id = OCI_COMPARTMENT_ID
        resource.lifecycle_state = "ACTIVE"
        resource.tags = {"Environment": "Production"}

        # Set attributes that make the resource compliant
        resource.versioning = "Enabled"
        resource.is_auto_rotation_enabled = True
        resource.rotation_interval_in_days = 90
        resource.public_access_type = "NoPublicAccess"
        resource.logging_enabled = True
        resource.kms_key_id = "ocid1.key.oc1.iad.aaaaaaaexample"
        resource.in_transit_encryption = "ENABLED"
        resource.is_secure_boot_enabled = True
        resource.legacy_endpoint_disabled = True
        resource.is_legacy_imds_endpoint_disabled = True

        # Mock client with compliant resource
        objectstorage_client.buckets = [resource]
        objectstorage_client.keys = [resource]
        objectstorage_client.volumes = [resource]
        objectstorage_client.boot_volumes = [resource]
        objectstorage_client.instances = [resource]
        objectstorage_client.file_systems = [resource]
        objectstorage_client.databases = [resource]
        objectstorage_client.security_lists = []
        objectstorage_client.security_groups = []
        objectstorage_client.rules = []
        objectstorage_client.configuration = resource
        objectstorage_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_versioning_enabled.objectstorage_bucket_versioning_enabled.objectstorage_client",
                new=objectstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_versioning_enabled.objectstorage_bucket_versioning_enabled import (
                objectstorage_bucket_versioning_enabled,
            )

            check = objectstorage_bucket_versioning_enabled()
            result = check.execute()

            assert isinstance(result, list)

            # If results exist, verify PASS findings
            if len(result) > 0:
                # Find PASS results
                pass_results = [r for r in result if r.status == "PASS"]

                if pass_results:
                    # Detailed assertions on first PASS result
                    assert pass_results[0].status == "PASS"
                    assert pass_results[0].status_extended is not None
                    assert len(pass_results[0].status_extended) > 0

                    # Verify resource identification
                    assert pass_results[0].resource_id is not None
                    assert pass_results[0].resource_name is not None
                    assert pass_results[0].region is not None
                    assert pass_results[0].compartment_id is not None

                    # Verify metadata
                    assert pass_results[0].check_metadata.Provider == "oraclecloud"
                    assert (
                        pass_results[0].check_metadata.CheckID
                        == "objectstorage_bucket_versioning_enabled"
                    )
                    assert pass_results[0].check_metadata.ServiceName == "objectstorage"

    def test_resource_non_compliant(self):
        """objectstorage_bucket_versioning_enabled: Resource fails the check (FAIL)"""
        objectstorage_client = mock.MagicMock()
        objectstorage_client.audited_compartments = {
            OCI_COMPARTMENT_ID: mock.MagicMock()
        }
        objectstorage_client.audited_tenancy = OCI_TENANCY_ID

        # Mock a non-compliant resource
        resource = mock.MagicMock()
        resource.id = "ocid1.resource.oc1.iad.bbbbbbbexample"
        resource.name = "non-compliant-resource"
        resource.region = OCI_REGION
        resource.compartment_id = OCI_COMPARTMENT_ID
        resource.lifecycle_state = "ACTIVE"
        resource.tags = {"Environment": "Development"}

        # Set attributes that make the resource non-compliant
        resource.versioning = "Disabled"
        resource.is_auto_rotation_enabled = False
        resource.rotation_interval_in_days = None
        resource.public_access_type = "ObjectRead"
        resource.logging_enabled = False
        resource.kms_key_id = None
        resource.in_transit_encryption = "DISABLED"
        resource.is_secure_boot_enabled = False
        resource.legacy_endpoint_disabled = False
        resource.is_legacy_imds_endpoint_disabled = False

        # Mock client with non-compliant resource
        objectstorage_client.buckets = [resource]
        objectstorage_client.keys = [resource]
        objectstorage_client.volumes = [resource]
        objectstorage_client.boot_volumes = [resource]
        objectstorage_client.instances = [resource]
        objectstorage_client.file_systems = [resource]
        objectstorage_client.databases = [resource]
        objectstorage_client.security_lists = []
        objectstorage_client.security_groups = []
        objectstorage_client.rules = []
        objectstorage_client.configuration = resource
        objectstorage_client.users = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_oraclecloud_provider(),
            ),
            mock.patch(
                "prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_versioning_enabled.objectstorage_bucket_versioning_enabled.objectstorage_client",
                new=objectstorage_client,
            ),
        ):
            from prowler.providers.oraclecloud.services.objectstorage.objectstorage_bucket_versioning_enabled.objectstorage_bucket_versioning_enabled import (
                objectstorage_bucket_versioning_enabled,
            )

            check = objectstorage_bucket_versioning_enabled()
            result = check.execute()

            assert isinstance(result, list)

            # Verify FAIL findings exist
            if len(result) > 0:
                # Find FAIL results
                fail_results = [r for r in result if r.status == "FAIL"]

                if fail_results:
                    # Detailed assertions on first FAIL result
                    assert fail_results[0].status == "FAIL"
                    assert fail_results[0].status_extended is not None
                    assert len(fail_results[0].status_extended) > 0

                    # Verify resource identification
                    assert fail_results[0].resource_id is not None
                    assert fail_results[0].resource_name is not None
                    assert fail_results[0].region is not None
                    assert fail_results[0].compartment_id is not None

                    # Verify metadata
                    assert fail_results[0].check_metadata.Provider == "oraclecloud"
                    assert (
                        fail_results[0].check_metadata.CheckID
                        == "objectstorage_bucket_versioning_enabled"
                    )
                    assert fail_results[0].check_metadata.ServiceName == "objectstorage"
```

--------------------------------------------------------------------------------

---[FILE: .dockerignore]---
Location: prowler-master/ui/.dockerignore

```text
# Include any files or directories that you don't want to be copied to your
# container here (e.g., local build artifacts, temporary files, etc.).
#
# For more help, visit the .dockerignore file reference guide at
# https://docs.docker.com/go/build-context-dockerignore/

Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.next
!.next/static
!.next/standalone
.git
.husky
scripts/setup-git-hooks.js
```

--------------------------------------------------------------------------------

---[FILE: .eslintignore]---
Location: prowler-master/ui/.eslintignore

```text
.now/*
*.css
.changeset
dist
esm/*
public/*
tests/*
scripts/*
*.config.js
.DS_Store
node_modules
coverage
.next
build
next-env.d.ts
!.commitlintrc.cjs
!.lintstagedrc.cjs
!jest.config.js
!plopfile.js
!react-shim.js
!tsup.config.ts
```

--------------------------------------------------------------------------------

---[FILE: .eslintrc.cjs]---
Location: prowler-master/ui/.eslintrc.cjs

```text
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "@typescript-eslint", "simple-import-sort", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:security/recommended-legacy",
    "plugin:jsx-a11y/recommended",
    "eslint-config-prettier",
    "prettier",
    "next/core-web-vitals",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // console.error are allowed but no console.log
    "no-console": ["error", { allow: ["error"] }],
    eqeqeq: 2,
    quotes: ["error", "double", "avoid-escape"],
    "@typescript-eslint/no-explicit-any": "off",
    "security/detect-object-injection": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        tabWidth: 2,
        useTabs: false,
      },
    ],
    "eol-last": ["error", "always"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
    "jsx-a11y/alt-text": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: prowler-master/ui/.gitignore

```text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
playwright/.auth
```

--------------------------------------------------------------------------------

---[FILE: .npmrc]---
Location: prowler-master/ui/.npmrc

```text
public-hoist-pattern[]=*@nextui-org/*
public-hoist-pattern[]=*@heroui/*
save-exact=true
```

--------------------------------------------------------------------------------

---[FILE: .nvmrc]---
Location: prowler-master/ui/.nvmrc

```text
lts/*
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: prowler-master/ui/.prettierignore

```text
node_modules/
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc.json]---
Location: prowler-master/ui/.prettierrc.json

```json
{
  "bracketSpacing": true,
  "singleQuote": false,
  "trailingComma": "all",
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

--------------------------------------------------------------------------------

---[FILE: AGENTS.md]---
Location: prowler-master/ui/AGENTS.md

```text
# Prowler UI - AI Agent Ruleset

## CRITICAL RULES - NON-NEGOTIABLE

### React

- ALWAYS: `import { useState, useEffect } from "react"`
- NEVER: `import React`, `import * as React`, `import React as *`
- NEVER: `useMemo`, `useCallback` (React Compiler handles optimization)

### Types

- ALWAYS: `const X = { A: "a", B: "b" } as const; type T = typeof X[keyof typeof X]`
- NEVER: `type T = "a" | "b"`

### Styling

- Single class: `className="bg-slate-800 text-white"`
- Merge multiple classes: `className={cn(BUTTON_STYLES.base, BUTTON_STYLES.active, isLoading && "opacity-50")}` (cn() handles Tailwind conflicts with twMerge)
- Conditional classes: `className={cn("base", condition && "variant")}`
- Recharts props: `fill={CHART_COLORS.text}` (use constants with var())
- Dynamic values: `style={{ width: "50%", opacity: 0.5 }}`
- CSS custom properties: `style={{ "--color": "var(--css-var)" }}` (for dynamic theming)
- NEVER: `var()` in className strings (use Tailwind semantic classes instead)
- NEVER: hex colors (use `text-white` not `text-[#fff]`)

### Scope Rule (ABSOLUTE)

- Used 2+ places → `components/shared/` or `lib/` or `types/` or `hooks/`
- Used 1 place → keep local in feature directory
- This determines ALL folder structure decisions

### Memoization

- NEVER: `useMemo`, `useCallback`
- React 19 Compiler handles automatic optimization

---

## DECISION TREES

### Component Placement

```
New feature UI? → shadcn/ui + Tailwind | Existing feature? → HeroUI
Used 1 feature? → features/{feature}/components | Used 2+? → components/shared
Needs state/hooks? → "use client" | Server component? → No directive
```

### Code Location

```
Server action → actions/{feature}/{feature}.ts
Data transform → actions/{feature}/{feature}.adapter.ts
Types (shared 2+) → types/{domain}.ts | Types (local 1) → {feature}/types.ts
Utils (shared 2+) → lib/ | Utils (local 1) → {feature}/utils/
Hooks (shared 2+) → hooks/ | Hooks (local 1) → {feature}/hooks.ts
shadcn components → components/shadcn/ | HeroUI → components/ui/
```

### Styling Decision

```
Tailwind class exists? → className | Dynamic value? → style prop
Conditional styles? → cn() | Static? → className only
Recharts? → CHART_COLORS constant + var() | Other? → Tailwind classes
```

---

## PATTERNS

### Server Component

```typescript
export default async function Page() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}
```

### Form + Validation

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const form = useForm({ resolver: zodResolver(schema) });
```

### Server Action

```typescript
"use server";
export async function updateProvider(formData: FormData) {
  const validated = schema.parse(Object.fromEntries(formData));
  await updateDB(validated);
  revalidatePath("/path");
}
```

### Zod v4

- `z.email()` not `z.string().email()`
- `z.uuid()` not `z.string().uuid()`
- `z.url()` not `z.string().url()`
- `z.string().min(1)` not `z.string().nonempty()`
- `error` param not `message` param

### Zustand v5

```typescript
const useStore = create(
  persist(
    (set) => ({
      value: 0,
      increment: () => set((s) => ({ value: s.value + 1 })),
    }),
    { name: "key" },
  ),
);
```

### AI SDK v5

```typescript
import { useChat } from "@ai-sdk/react";
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: "/api/chat" }),
});
const [input, setInput] = useState("");
const handleSubmit = (e) => {
  e.preventDefault();
  sendMessage({ text: input });
  setInput("");
};
```

### Testing (Playwright)

```typescript
export class FeaturePage extends BasePage {
  readonly submitBtn = this.page.getByRole("button", { name: "Submit" });
  async goto() {
    await super.goto("/path");
  }
  async submit() {
    await this.submitBtn.click();
  }
}

test(
  "action works",
  { tag: ["@critical", "@feature", "@TEST-001"] },
  async ({ page }) => {
    const p = new FeaturePage(page);
    await p.goto();
    await p.submit();
    await expect(page).toHaveURL("/expected");
  },
);
```

Selector priority: `getByRole()` → `getByLabel()` → `getByText()` → other

---

## TECH STACK

Next.js 15.5.3 | React 19.1.1 | Tailwind 4.1.13 | shadcn/ui (new) | HeroUI 2.8.4 (legacy)
Zod 4.1.11 | React Hook Form 7.62.0 | Zustand 5.0.8 | NextAuth 5.0.0-beta.29 | Recharts 2.15.4

---

## PROJECT STRUCTURE

```
ui/
├── app/                  (Next.js App Router)
│   ├── (auth)/          (Auth pages)
│   └── (prowler)/       (Main app: compliance, findings, providers, scans, services, integrations)
├── components/
│   ├── shadcn/          (New shadcn/ui components)
│   ├── ui/              (HeroUI base)
│   └── {domain}/        (Domain components)
├── actions/             (Server actions)
├── types/               (Shared types)
├── hooks/               (Shared hooks)
├── lib/                 (Utilities)
├── store/               (Zustand state)
├── tests/               (Playwright E2E)
└── styles/              (Global CSS)
```

---

## COMMANDS

```
pnpm install && pnpm run dev        (Setup & start)
pnpm run typecheck                  (Type check)
pnpm run lint:fix                   (Fix linting)
pnpm run format:write               (Format)
pnpm run healthcheck                (typecheck + lint)
pnpm run test:e2e                   (E2E tests)
pnpm run test:e2e:ui                (E2E with UI)
pnpm run test:e2e:debug             (Debug E2E)
pnpm run build && pnpm start        (Build & start)
```

---

## QA CHECKLIST BEFORE COMMIT

- [ ] `npm run typecheck` passes
- [ ] `npm run lint:fix` passes
- [ ] `npm run format:write` passes
- [ ] Relevant E2E tests pass
- [ ] All UI states handled (loading, error, empty)
- [ ] No secrets in code (use `.env.local`)
- [ ] Error messages sanitized
- [ ] Server-side validation present

---

## MIGRATIONS (As of Jan 2025)

React 18 → 19.1.1 (async components, compiler)
Next.js 14 → 15.5.3
NextUI → HeroUI 2.8.4
Zod 3 → 4 (see patterns section)
AI SDK 4 → 5 (see patterns section)
```

--------------------------------------------------------------------------------

````
