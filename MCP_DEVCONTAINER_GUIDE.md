# Running MCP Server in DevContainer

## The Challenge

Claude Desktop expects to run MCP servers as local processes using the command specified in the configuration. When your server is inside a devcontainer, Claude Desktop can't directly access it.

## Solutions

### Option 1: Local Wrapper Script (Recommended)

Create a local wrapper script that forwards commands to your devcontainer.

#### 1. Create a wrapper script on your host machine

**macOS/Linux** (`eraser-mcp-wrapper.sh`):
```bash
#!/bin/bash
# Adjust the container name/path as needed
docker exec -i your-devcontainer-name node /workspace/dist/index.js "$@"
```

**Windows** (`eraser-mcp-wrapper.bat`):
```batch
@echo off
docker exec -i your-devcontainer-name node /workspace/dist/index.js %*
```

#### 2. Make it executable (macOS/Linux)
```bash
chmod +x eraser-mcp-wrapper.sh
```

#### 3. Configure Claude Desktop
```json
{
  "mcpServers": {
    "eraser": {
      "command": "/path/to/eraser-mcp-wrapper.sh"
    }
  }
}
```

### Option 2: Docker Compose with Exposed stdio

Create a docker-compose setup that properly handles stdio:

```yaml
version: '3.8'
services:
  eraser-mcp:
    build: .
    environment:
      - ERASER_API_KEY=${ERASER_API_KEY}
    stdin_open: true
    tty: true
    command: node /workspace/dist/index.js
```

Then create a wrapper script:
```bash
#!/bin/bash
docker-compose run --rm eraser-mcp
```

### Option 3: VS Code Remote Extension

If you're using VS Code with the devcontainer:

1. Use VS Code's command palette to get the container name
2. Create a wrapper that uses the VS Code container:

```bash
#!/bin/bash
# VS Code typically names containers like: vscode-EraserMCP-<hash>
CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep -i erasermcp | head -1)
docker exec -i "$CONTAINER_NAME" node /workspace/dist/index.js "$@"
```

### Option 4: Build and Run Locally (Simplest)

Since the devcontainer is primarily for development, you could:

1. Build inside the devcontainer: `npm run build`
2. Copy the built files to your host
3. Run directly on host with local Node.js

```bash
# Inside devcontainer
npm run build

# On host
cp -r ./dist ./local-dist
node ./local-dist/index.js
```

## Environment Variables

For the wrapper approaches, ensure your API key is available:

### Using .env file mapping
```bash
#!/bin/bash
docker exec -i --env-file /path/to/.env your-container node /workspace/dist/index.js "$@"
```

### Or pass through from Claude config
```json
{
  "mcpServers": {
    "eraser": {
      "command": "/path/to/wrapper.sh",
      "env": {
        "ERASER_API_KEY": "your-key"
      }
    }
  }
}
```

## Recommended Approach

For development with devcontainers, I recommend:

1. **Develop in devcontainer** - Use the devcontainer for writing and testing code
2. **Build in devcontainer** - Run `npm run build` inside the container
3. **Run on host** - Execute the built server on your host machine for Claude Desktop

This gives you the best of both worlds:
- Consistent development environment
- Direct execution for Claude Desktop
- No wrapper complexity

## Testing Your Setup

Before configuring Claude Desktop:

1. Test your wrapper script manually:
```bash
./eraser-mcp-wrapper.sh --config
```

2. Ensure it outputs the configuration JSON correctly

3. Check that stdio is properly forwarded

## Troubleshooting

### Container not found
- Ensure the container is running
- Check the container name with `docker ps`

### Permission denied
- Make wrapper scripts executable
- Check Docker permissions

### Environment variables not passing
- Use `--env-file` or explicit `-e` flags
- Check if .env file is accessible from host

### stdio issues
- Ensure `-i` (interactive) flag is used
- Don't use `-t` (tty) for MCP servers
- Test with simple echo commands first