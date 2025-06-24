# Claude Desktop MCP Server Setup

## Important: MCP Servers vs Integrations

MCP servers are **NOT** added through the regular "Integrations" section in Claude Desktop. They require manual configuration file editing.

## How to Add the Eraser MCP Server

### 1. Find Your Claude Desktop Configuration File

The location depends on your operating system:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### 2. Edit the Configuration File

1. Open the configuration file in a text editor
2. If the file doesn't exist, create it
3. Add or modify the configuration to include your MCP server

### 3. Get Your Server Configuration

Run this command in your EraserMCP directory:
```bash
npm start -- --config
```

This will output something like:
```json
{
  "mcpServers": {
    "eraser": {
      "command": "node",
      "args": [
        "/path/to/your/EraserMCP/dist/index.js"
      ]
    }
  }
}
```

### 4. Add to Claude Desktop Config

Your complete `claude_desktop_config.json` should look like:

```json
{
  "mcpServers": {
    "eraser": {
      "command": "node",
      "args": [
        "/path/to/your/EraserMCP/dist/index.js"
      ]
    }
  }
}
```

If you already have other MCP servers, add the eraser server to the existing mcpServers object:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    },
    "eraser": {
      "command": "node",
      "args": [
        "/path/to/your/EraserMCP/dist/index.js"
      ]
    }
  }
}
```

### 5. Restart Claude Desktop

After saving the configuration file, completely quit and restart Claude Desktop for the changes to take effect.

### 6. Verify the Server is Working

In a new Claude Desktop conversation, you should be able to use the Eraser tools. Try asking:
- "Can you validate this sequence diagram syntax?"
- "Create a flowchart showing a login process"

## Troubleshooting

### Server Not Appearing
- Make sure you edited the correct config file location
- Ensure the JSON syntax is valid (no trailing commas, proper quotes)
- Check that the path to index.js is absolute, not relative
- Restart Claude Desktop completely (not just close the window)

### Permission Errors
- On macOS/Linux, ensure the dist/index.js file has execute permissions
- Make sure Node.js is in your system PATH

### API Key Issues
- If you have a .env file in your project, it will be used automatically
- If not, add the env section to your config as shown in the README

## Note About Integrations UI

The "Integrations" section in Claude Desktop settings (where you see "Integration name" and "Integration URL") is for:
- Web-based integrations
- OAuth connections
- API integrations

MCP servers are local programs that Claude Desktop runs directly, so they must be configured manually in the configuration file.