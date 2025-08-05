# Claude Desktop Setup with Docker

This guide shows how to set up the Eraser MCP server with Claude Desktop using Docker.

## Quick Setup

### 1. Build the Docker Image

```bash
./scripts/build-claude-docker.sh
```

This creates a Docker image named `eraser-mcp:claude`.

### 2. Configure Claude Desktop

Add this configuration to your Claude Desktop settings file:

#### Configuration File Location
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Configuration with API Key
```json
{
  "mcpServers": {
    "eraser": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "ERASER_API_KEY=yourapikey",
        "eraser-mcp:claude"
      ]
    }
  }
}
```

#### Alternative: Using .env File
If you have a `.env` file with your API key:

```json
{
  "mcpServers": {
    "eraser": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--env-file", "/absolute/path/to/your/project/.env",
        "eraser-mcp:claude"
      ]
    }
  }
}
```

### 3. Restart Claude Desktop

After saving the configuration file, completely quit and restart Claude Desktop.

## Testing Your Setup

Test the configuration by asking Claude Desktop:
- "Can you create a sequence diagram?"
- "Show me what Eraser diagram tools you have available"

If working correctly, Claude will have access to:
- `create_diagram` - Creates and renders diagrams
- `validate_diagram` - Validates diagram syntax
- `fix_diagram` - Fixes common syntax errors

## Troubleshooting

### Docker Image Not Found
**Error**: `Unable to find image 'eraser-mcp:claude'`  
**Solution**: Run the build script: `./scripts/build-claude-docker.sh`

### API Key Issues
**Error**: `ERASER_API_KEY environment variable is required`  
**Solution**: 
- Check your API key is correct in the configuration
- For .env file approach, verify the path is absolute and file exists

### Permission Issues
**Error**: Docker permission denied  
**Solution**: Ensure Docker is running and your user has Docker permissions

### Manual Testing
Before adding to Claude Desktop, test manually:

```bash
# Test with direct API key
echo '{"method":"tools/list"}' | docker run -i --rm -e ERASER_API_KEY=your_key eraser-mcp:claude

# Test with .env file
echo '{"method":"tools/list"}' | docker run -i --rm --env-file .env eraser-mcp:claude
```

Both should return a JSON response listing the available MCP tools.

## Updating

To update after making code changes:

```bash
./scripts/build-claude-docker.sh
```

This rebuilds the Docker image with your latest changes.