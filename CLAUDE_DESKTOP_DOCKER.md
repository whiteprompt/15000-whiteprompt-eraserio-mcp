# Claude Desktop Docker Configuration

This guide shows how to run the Eraser MCP server directly through Docker from Claude Desktop, eliminating the need for wrapper scripts or local Node.js installation.

## Quick Setup

### 1. Build the Docker Image

```bash
./scripts/build-claude-docker.sh
```

This creates a Docker image named `eraser-mcp:claude` optimized for Claude Desktop integration.

### 2. Configure Claude Desktop

Add this configuration to your Claude Desktop settings:

#### Option A: With API Key in Configuration
```json
{
  "mcpServers": {
    "eraser": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "ERASER_API_KEY=your_actual_api_key_here",
        "eraser-mcp:claude"
      ]
    }
  }
}
```

#### Option B: Using .env File (Recommended)
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

## Configuration Details

### Docker Arguments Explained

- `run`: Start a new container
- `-i`: Interactive mode (required for MCP stdio communication)
- `--rm`: Automatically remove container when it exits
- `-e ERASER_API_KEY=...`: Set environment variable directly
- `--env-file /path/to/.env`: Load environment variables from file

### Environment Variables

The container needs the `ERASER_API_KEY` environment variable. You can provide it either:

1. **Directly in configuration**: Replace `your_actual_api_key_here` with your API key
2. **Via .env file**: Create a `.env` file with `ERASER_API_KEY=your_key` and reference it

## Advantages of Docker Approach

✅ **No Local Dependencies**: No need for Node.js installation on host  
✅ **Consistent Environment**: Same runtime environment every time  
✅ **Easy Updates**: Rebuild image to update the server  
✅ **Isolation**: Server runs in isolated container  
✅ **No Wrapper Scripts**: Direct Docker execution from Claude Desktop  

## Building and Updating

### Initial Build
```bash
./scripts/build-claude-docker.sh
```

### Rebuilding After Changes
```bash
# After making code changes
./scripts/build-claude-docker.sh
```

### Manual Build (if needed)
```bash
docker build -f Dockerfile.claude -t eraser-mcp:claude .
```

## Troubleshooting

### Container Not Found
**Error**: `Unable to find image 'eraser-mcp:claude'`  
**Solution**: Run the build script first: `./scripts/build-claude-docker.sh`

### API Key Issues
**Error**: `ERASER_API_KEY environment variable is required`  
**Solution**: 
- Check your `.env` file exists and contains the API key
- Verify the path to `.env` file is absolute in the configuration
- Or use the direct environment variable approach

### Permission Issues
**Error**: Docker permission denied  
**Solution**: Ensure Docker is running and your user has Docker permissions

### Testing the Configuration

Before adding to Claude Desktop, test manually:

```bash
# Test with direct API key
echo '{"method":"tools/list"}' | docker run -i --rm -e ERASER_API_KEY=your_key eraser-mcp:claude

# Test with .env file
echo '{"method":"tools/list"}' | docker run -i --rm --env-file .env eraser-mcp:claude
```

Both should return a JSON response listing the available MCP tools.

## Claude Desktop Configuration File Locations

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## Example Complete Configuration

```json
{
  "mcpServers": {
    "eraser": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--env-file", "/Users/yourname/projects/EraserMCP/.env",
        "eraser-mcp:claude"
      ]
    }
  }
}
```

After adding this configuration, restart Claude Desktop to load the MCP server.