# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that provides tools for creating diagrams on Eraser.io through their API.

## Quick Setup for Claude Desktop

The simplest way to use this with Claude Desktop:

1. Build the Docker image: `./scripts/build-claude-docker.sh`
2. Add the Docker configuration to Claude Desktop settings
3. Restart Claude Desktop

See `README.md` for complete setup instructions.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Run the server in development mode with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Run the built server
- `npm run lint` - Run ESLint on the codebase
- `npm run typecheck` - Run TypeScript type checking without emitting files

## Development Environment

This project includes a Dev Container configuration. When working in VS Code:
1. Use "Dev Containers: Reopen in Container" to start the development environment
2. All dependencies will be installed automatically
3. The container includes Node.js 20, TypeScript, and development tools
4. After making changes, rebuild the Docker image with `./scripts/build-claude-docker.sh`

## Architecture

The MCP server exposes three tools:
1. `create_diagram` - Creates and renders diagrams, returns viewing/editing URLs
2. `validate_diagram` - Validates diagram syntax before creation
3. `fix_diagram` - Automatically fixes common syntax errors

The create_diagram tool:
1. Accepts diagram content (in Eraser DSL format), type, theme, and background options
2. Makes authenticated API calls to Eraser.io
3. Returns URLs for viewing and editing the generated diagram

Key files:
- `src/index.ts` - Main server implementation with tool handlers (all logic is here)
- `Dockerfile.claude` - Docker configuration for Claude Desktop integration
- `scripts/build-claude-docker.sh` - Build script for Docker image
- Uses MCP SDK (@modelcontextprotocol/sdk) for server setup and tool registration
- Uses axios for HTTP requests to Eraser API
- Built-in validation and fix rules for all four diagram types

## Code Structure

The entire server is implemented in a single file (`src/index.ts`) with:
- Tool definitions with detailed descriptions
- Validation rules by diagram type
- Validation function
- Fix function with common corrections  
- Request handlers for each tool
- Configuration generation for Claude Desktop

## Environment Setup

Required environment variable:
- `ERASER_API_KEY` - Your Eraser.io API key

For development, copy `.env.example` to `.env` and add your API key.
For production with Claude Desktop, the API key is provided via Docker environment variables.

## Testing

To test the MCP server:
1. Build the Docker image: `./scripts/build-claude-docker.sh`
2. Configure Claude Desktop to use the Docker image
3. Test in Claude Desktop with diagram creation requests

For development testing:
```bash
cd tests
./run-tests.sh
```

## Docker Integration

The project uses Docker for Claude Desktop integration:
- `Dockerfile.claude` - Optimized for Claude Desktop stdio communication
- `scripts/build-claude-docker.sh` - Builds the `eraser-mcp:claude` image
- Configuration uses direct Docker execution without wrapper scripts

## Eraser API Integration

The server communicates with Eraser.io API:
- Base URL: `https://app.eraser.io/api`
- Authentication: Bearer token in Authorization header
- Endpoint: POST `/render/elements` to create and render diagrams

The API returns:
- `imageUrl`: Direct link to the rendered diagram image
- `createEraserFileUrl`: Link to open and edit the diagram in Eraser

Supported diagram types:
- sequence-diagram
- cloud-architecture-diagram  
- entity-relationship-diagram
- flowchart-diagram

## Development Notes

- All server logic is contained in a single TypeScript file for simplicity  
- The server includes robust validation and auto-fixing capabilities
- Error handling includes detailed API error messages and status codes
- Environment variable loading tries multiple .env file locations
- Docker-first approach eliminates complex wrapper scripts
- Server detects MCP mode vs manual running to avoid stdout pollution