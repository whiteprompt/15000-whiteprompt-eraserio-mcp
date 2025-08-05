---
inclusion: always
---

# Eraser MCP Server - Project Context

## Project Overview
This is an MCP (Model Context Protocol) server that provides tools for creating diagrams on Eraser.io. The server integrates with Eraser's API to create, validate, and fix diagrams in various formats.

## Core Architecture

### Main Components
- **MCP Server**: Built using `@modelcontextprotocol/sdk` for protocol compliance
- **Eraser API Integration**: Uses axios to communicate with Eraser.io API
- **Validation Engine**: Built-in syntax validation for all supported diagram types
- **Auto-Fix System**: Automatically corrects common syntax errors

### Supported Diagram Types
1. **Sequence Diagrams**: Actor interactions and message flows
2. **Flowcharts**: Process flows with shapes and connections
3. **Entity Relationship Diagrams**: Database schema representations
4. **Cloud Architecture Diagrams**: Infrastructure and service connections

## Development Environment

### DevContainer Setup
- **Base Image**: Node.js 20 Alpine
- **Global Tools**: TypeScript, tsx, ESLint pre-installed
- **VS Code Extensions**: ESLint, Prettier, TypeScript, Claude Dev
- **Environment Variables**: Automatically loads from host `.env` file

### Build Process
- **TypeScript Compilation**: `npm run build` compiles to `dist/`
- **Development Mode**: `npm run dev` with hot reload using tsx
- **Production Mode**: `npm start` runs compiled JavaScript

## MCP Tools Available

### 1. create_diagram
**Purpose**: Creates and renders diagrams on Eraser.io
- **Input**: Diagram content in Eraser DSL format
- **Output**: Image URL and edit link
- **Use When**: User wants to visualize/render a diagram

### 2. validate_diagram  
**Purpose**: Checks diagram syntax for errors
- **Input**: Diagram content to validate
- **Output**: Validation status and error list
- **Use When**: User wants to check syntax correctness

### 3. fix_diagram
**Purpose**: Automatically fixes common syntax errors
- **Input**: Diagram content with potential errors
- **Output**: Fixed content and list of applied fixes
- **Use When**: User has broken diagram syntax

## Common Workflow Patterns

### Pattern 1: Validate → Fix → Create
For diagrams with uncertain syntax:
1. `validate_diagram` - Check for errors
2. `fix_diagram` - Apply corrections if needed
3. `create_diagram` - Generate final visual

### Pattern 2: Direct Creation
For confident, correct syntax:
1. `create_diagram` - Directly render diagram

### Pattern 3: Fix-First
For obviously broken syntax:
1. `fix_diagram` - Correct errors
2. Optionally `create_diagram` - Render result

## API Integration Details

### Eraser API Endpoint
- **Base URL**: `https://app.eraser.io/api`
- **Endpoint**: `/render/elements`
- **Authentication**: Bearer token via `ERASER_API_KEY`

### Request Format
```json
{
  "theme": "dark|light",
  "background": true|false,
  "elements": [{
    "type": "diagram",
    "diagramType": "sequence-diagram|flowchart-diagram|...",
    "code": "diagram content in Eraser DSL"
  }]
}
```

### Response Format
```json
{
  "imageUrl": "https://...",
  "createEraserFileUrl": "https://..."
}
```

## Environment Configuration

### Required Environment Variables
- `ERASER_API_KEY`: API key for Eraser.io service

### Configuration Loading Priority
1. `.env` file in project root
2. `.env` file in src directory
3. `.env` file in parent directory
4. Environment variables from system

## Claude Desktop Integration

### Configuration Challenges
- **DevContainer Issue**: Claude Desktop can't directly access containers
- **Solution Options**: 
  1. Wrapper scripts to forward to container
  2. Build in container, run on host
  3. Direct host execution

### Recommended Setup
1. Develop in devcontainer for consistency
2. Build inside container: `npm run build`
3. Run on host for Claude Desktop: `./scripts/run-on-host.sh`

## Testing Infrastructure

### Available Tests
- **Image Download Test**: Full API workflow validation
- **MCP Format Test**: Response format compliance
- **Size Validation**: Claude Desktop 1MB limit checking

### Test Execution
```bash
cd tests
./run-tests.sh  # Run all tests
npx tsx test-image-download.ts  # Individual test
```

## Common Issues & Solutions

### API Key Problems
- **Symptom**: "ERASER_API_KEY environment variable is required"
- **Solution**: Ensure `.env` file exists with valid API key

### DevContainer Integration
- **Symptom**: Claude Desktop can't find MCP server
- **Solution**: Use wrapper scripts or run on host after building

### Image Size Limits
- **Symptom**: Images too large for Claude Desktop
- **Solution**: Reduce diagram complexity or use light theme

## Code Quality Standards

### TypeScript Configuration
- **Strict Mode**: Enabled for type safety
- **ES Modules**: Using modern import/export syntax
- **Target**: ES2022 for Node.js 20 compatibility

### Linting Rules
- **ESLint**: TypeScript-specific rules enabled
- **Style**: Consistent formatting with Prettier integration
- **Error Handling**: Comprehensive try-catch blocks

## File Structure Significance

```
src/index.ts          # Main MCP server implementation
tests/               # Validation and integration tests
scripts/             # DevContainer integration helpers
.devcontainer/       # Development environment config
dist/                # Compiled JavaScript output
```

This context helps understand the project's architecture, development workflow, and integration patterns for effective development and troubleshooting.