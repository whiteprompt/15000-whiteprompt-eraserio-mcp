# Claude Desktop Configuration: Direct vs Wrapper

## Without Wrapper (Direct Execution)

When running the MCP server directly on your host machine:

```json
{
  "mcpServers": {
    "eraser": {
      "command": "node",
      "args": ["/absolute/path/to/EraserMCP/dist/index.js"]
    }
  }
}
```

## With Docker Wrapper

When using the wrapper script to run inside devcontainer:

```json
{
  "mcpServers": {
    "eraser": {
      "command": "/absolute/path/to/claude-wrapper.sh"
    }
  }
}
```

## Key Differences

| Aspect | Direct | Wrapper |
|--------|--------|---------|
| Command | `node` | Path to wrapper script |
| Args | Path to `index.js` | None (handled by wrapper) |
| Environment | Can include `env` section | Set in wrapper or container |

## Environment Variables

### Direct with .env file:
```json
{
  "mcpServers": {
    "eraser": {
      "command": "node",
      "args": ["/path/to/dist/index.js"]
    }
  }
}
```

### Direct without .env file:
```json
{
  "mcpServers": {
    "eraser": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "ERASER_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Wrapper (API key handled inside container):
```json
{
  "mcpServers": {
    "eraser": {
      "command": "/path/to/claude-wrapper.sh"
    }
  }
}
```

## Complete Examples

### Example 1: Local Node.js Installation
```json
{
  "mcpServers": {
    "eraser": {
      "command": "node",
      "args": ["/Users/yourname/projects/EraserMCP/dist/index.js"]
    }
  }
}
```

### Example 2: Using run-on-host.sh Script
```json
{
  "mcpServers": {
    "eraser": {
      "command": "/Users/yourname/projects/EraserMCP/scripts/run-on-host.sh"
    }
  }
}
```

### Example 3: Using Docker Wrapper
```json
{
  "mcpServers": {
    "eraser": {
      "command": "/Users/yourname/scripts/claude-wrapper.sh"
    }
  }
}
```

## Testing Your Configuration

After setting up, test by asking Claude Desktop:
- "Can you use the eraser tools?"
- "Show me what Eraser diagram tools you have available"

If the server is properly configured, Claude will have access to:
- `create_diagram`
- `validate_diagram`
- `fix_diagram`