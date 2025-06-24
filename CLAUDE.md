# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that provides tools for creating diagrams on Eraser.io through their API.

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
- `src/index.ts` - Main server implementation with tool handlers
- Uses MCP SDK for server setup and tool registration
- Uses axios for HTTP requests to Eraser API

## Environment Setup

Required environment variable:
- `ERASER_API_KEY` - Your Eraser.io API key

Copy `.env.example` to `.env` and add your API key.

## Testing

To test the MCP server:
1. Build the project: `npm run build`
2. Configure the MCP client to use this server
3. The server communicates via stdio

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
- flowchart