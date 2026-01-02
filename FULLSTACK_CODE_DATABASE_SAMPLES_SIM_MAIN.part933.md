---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:37Z
part: 933
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 933 of 933)

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

---[FILE: package.json]---
Location: sim-main/scripts/package.json
Signals: React

```json
{
  "name": "sim-doc-generator",
  "version": "1.0.0",
  "description": "Documentation generator for Sim blocks",
  "type": "module",
  "private": true,
  "dependencies": {
    "@types/node": "^24.5.1",
    "@types/react": "^19.1.13",
    "glob": "^11.0.3",
    "ts-node": "^10.9.2",
    "tsx": "^4.20.5",
    "typescript": "^5.9.2",
    "yaml": "^2.8.1"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: sim-main/scripts/README.md

```text
# Block Documentation Generator

This directory contains scripts to automatically generate documentation for all blocks in the Sim platform.

## Available Scripts

- `generate-docs.sh`: Generates documentation for all blocks
- `setup-doc-generator.sh`: Installs dependencies required for the documentation generator

## How It Works

The documentation generator:

1. Scans the `apps/sim/blocks/blocks/` directory for all block definition files
2. Extracts metadata from each block including:
   - Name, description, and category
   - Input and output specifications
   - Configuration parameters
3. Generates standardized Markdown documentation for each block
4. Updates the navigation metadata in `meta.json`

## Running the Generator

To generate documentation manually:

```bash
# From the project root
./scripts/generate-docs.sh
```

## Troubleshooting TypeScript Errors

If you encounter TypeScript errors when running the documentation generator, run the setup script to install the necessary dependencies:

```bash
./scripts/setup-doc-generator.sh
```

This will:

1. Install TypeScript, ts-node, and necessary type definitions
2. Create a proper tsconfig.json for the scripts directory
3. Configure the scripts directory to use ES modules

### Common Issues

1. **Missing Type Declarations**: Run the setup script to install @types/node and @types/react
2. **JSX Errors in block-info-card.tsx**: These don't affect functionality and can be ignored if you've run the setup script
3. **Module Resolution**: The setup script configures proper ES module support

## CI Integration

The documentation generator runs automatically as part of the CI/CD pipeline whenever changes are pushed to the main branch. The updated documentation is committed back to the repository.

## Adding Support for New Block Properties

If you add new properties to block definitions that should be included in the documentation, update the `generateMarkdownForBlock` function in `scripts/generate-docs.ts`.

## Preserving Manual Content

The documentation generator now supports preserving manually added content when regenerating docs. This allows you to enhance the auto-generated documentation with custom examples, additional context, or any other content without losing your changes when the docs are regenerated.

### How It Works

1. The generator creates clean documentation without any placeholders or markers
2. If you add manual content to a file using special comment markers, that content will be preserved during regeneration
3. The manual content is intelligently inserted at the appropriate section when docs are regenerated

### Using Manual Content Markers

To add custom content to any tool's documentation, insert MDX comment blocks with section markers:

```markdown
{/_ MANUAL-CONTENT-START:sectionName _/}
Your custom content here (Markdown formatting supported)
{/_ MANUAL-CONTENT-END _/}
```

Replace `sectionName` with one of the supported section names:

- `intro` - Content at the top of the document after the BlockInfoCard
- `usage` - Additional usage instructions and examples
- `configuration` - Custom configuration details
- `outputs` - Additional output information or examples
- `notes` - Extra notes at the end of the document

### Example

To add custom examples to a tool doc:

````markdown
{/_ MANUAL-CONTENT-START:usage _/}

## Examples

### Basic Usage

```json
{
  "parameter": "value",
  "anotherParameter": "anotherValue"
}
```
 ````

### Advanced Configuration

Here's how to use this tool for a specific use case...
{/_ MANUAL-CONTENT-END _/}

```

When the documentation is regenerated, your manual content will be preserved in the appropriate section automatically. The script will not add any placeholders or markers to files by default.
```
```

--------------------------------------------------------------------------------

---[FILE: setup-doc-generator.sh]---
Location: sim-main/scripts/setup-doc-generator.sh

```bash
#!/bin/bash

# Get the scripts directory path
SCRIPTS_DIR=$(dirname "$0")
cd "$SCRIPTS_DIR"
echo "Working in scripts directory: $(pwd)"

echo "Setting up documentation generator..."

# Create package.json for scripts directory
cat > package.json << EOF
{
  "name": "sim-doc-generator",
  "version": "1.0.0",
  "description": "Documentation generator for Sim blocks",
  "type": "module",
  "private": true
}
EOF

# Install dependencies local to scripts directory
bun install --save-dev typescript @types/node @types/react ts-node tsx glob

# Setup tsconfig.json
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "ts-node": {
    "esm": true,
    "experimentalSpecifierResolution": "node"
  },
  "include": ["./**/*.ts"]
}
EOF

echo "Dependencies installed successfully!"
echo "You can now run './scripts/generate-docs.sh' to generate the documentation."
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: sim-main/scripts/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "ts-node": {
    "esm": true,
    "experimentalSpecifierResolution": "node"
  },
  "include": ["./**/*.ts"]
}
```

--------------------------------------------------------------------------------

````
