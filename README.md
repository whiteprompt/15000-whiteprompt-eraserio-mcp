# Eraser MCP Server

An MCP (Model Context Protocol) server that provides tools for creating diagrams on Eraser.io.

## Features

- Create diagrams on Eraser.io using their API
- Support for multiple diagram types (sequence-diagram, flowchart-diagram, cloud-architecture-diagram, entity-relationship-diagram)
- Returns direct links to view and edit diagrams
- Validate diagram syntax before creating
- Automatically fix common syntax errors
- Simple Docker-based integration with Claude Desktop

## Quick Setup

### 1. Get an Eraser.io API Key

Sign up at [Eraser.io](https://app.eraser.io) and get your API key from your account settings.

### 2. Build the Docker Image

Clone this repository and build the Docker image:

```bash
git clone <repository-url>
cd eraser-mcp
./scripts/build-claude-docker.sh
```

### 3. Configure Claude Desktop

Add this configuration to your Claude Desktop settings file:

**Configuration File Location:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Configuration:**
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

### 4. Restart Claude Desktop

After saving the configuration file, completely quit and restart Claude Desktop.

### 5. Test the Integration

In Claude Desktop, try asking:
- "Create a sequence diagram showing a login process"
- "Can you validate this flowchart syntax?"

### 6. Create a Claude Desktop Project (Optional)

For better organization and persistent access to diagram syntax references, create a dedicated project:

1. **Create a new project** in Claude Desktop by clicking the "+" icon in the sidebar
2. **Name your project** (e.g., "Eraser Diagrams" or "System Architecture")
3. **Add the syntax guide** by uploading or copying the [diagram syntax documentation](CLAUDE_DESKTOP_PROJECT_INSTRUCTIONS.md) to your project knowledge base
4. **Set a custom instruction** for your project to automatically use the Eraser MCP tools:

```
You have access to Eraser.io diagram tools for creating professional diagrams. When I ask for diagrams:
1. Use create_diagram to generate diagrams on Eraser.io
2. Always validate syntax with validate_diagram first if unsure
3. Use fix_diagram to automatically correct common syntax errors
4. Support these diagram types: sequence-diagram, flowchart-diagram, cloud-architecture-diagram, entity-relationship-diagram
5. Refer to the Eraser syntax guide in this project's knowledge for proper formatting

Default to dark theme and include background in rendered images.
```

**Benefits of using a project:**
- Persistent access to diagram syntax documentation
- Context-aware assistance for diagram creation
- Organized workspace for all your architecture diagrams
- Custom instructions ensure consistent diagram formatting

Now you can chat with Claude in this project and it will automatically use the Eraser MCP tools with full knowledge of the proper syntax for all diagram types.

## Available Tools

### create_diagram
Creates a new diagram on Eraser.io and returns links to view and edit it.

**Parameters:**
- `content` (required): Diagram content in Eraser DSL format
- `diagramType` (optional): Type of diagram (sequence-diagram, cloud-architecture-diagram, entity-relationship-diagram, flowchart-diagram). Default: sequence-diagram
- `theme` (optional): Theme for the diagram (light, dark). Default: dark
- `background` (optional): Whether to include background in the rendered image. Default: true

**Returns:**
- Image URL: Direct link to view/download the rendered diagram image
- Edit URL: Link to open and edit the diagram in Eraser

### validate_diagram
Validates Eraser diagram syntax and returns any errors found.

**Parameters:**
- `content` (required): Diagram content in Eraser DSL format to validate
- `diagramType` (optional): Type of diagram to validate. Default: sequence-diagram

**Returns:**
- Validation result indicating if the diagram syntax is valid
- List of errors and warnings found (if any)

### fix_diagram
Validates and attempts to fix common syntax errors in Eraser diagrams.

**Parameters:**
- `content` (required): Diagram content in Eraser DSL format to fix
- `diagramType` (optional): Type of diagram to fix. Default: sequence-diagram

**Returns:**
- List of applied fixes
- Fixed diagram content
- Validation status after fixes

## Examples

### Creating a Sequence Diagram
```
Create a sequence diagram with this content:
Client > Server: Request
Server > Database: Query
Database --> Server: Results
Server --> Client: Response
```

### Creating a Flowchart
```
Create a flowchart:
Start [shape: oval]
Start > Process
Process > Decision [shape: diamond]
Decision > End [shape: oval]
```

## Validation Features

The server includes built-in validation for all supported diagram types:

- **Sequence Diagrams**: Validates message formats, activation blocks, and control structures
- **Flowcharts**: Validates node definitions, connections, shapes, and groups
- **Entity Relationship Diagrams**: Validates entity definitions, attributes, and relationships
- **Cloud Architecture Diagrams**: Validates service definitions, icons, and connections

**Common fixes applied automatically:**
- Arrow syntax corrections (e.g., `=>` to `>`)
- Missing brackets and quotes
- Trailing whitespace removal
- Missing colons in sequence messages
- Shape name corrections (e.g., `circle` to `oval`)

## Troubleshooting

### Docker Image Not Found
**Error**: `Unable to find image 'eraser-mcp:claude'`  
**Solution**: Run the build script: `./scripts/build-claude-docker.sh`

### API Key Issues
**Error**: Server reports API key errors  
**Solution**: Check that your API key is correct in the configuration

### Permission Issues
**Error**: Docker permission denied  
**Solution**: Ensure Docker is running and your user has Docker permissions

## Development

For development, you can use the included Dev Container:

1. Open in VS Code with Dev Containers extension
2. Make changes to the code
3. Rebuild the Docker image: `./scripts/build-claude-docker.sh`

### Development Commands
- `npm install` - Install dependencies
- `npm run dev` - Run with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Testing
```bash
cd tests
./run-tests.sh
```

## Diagram Syntax Documentation

For detailed syntax information for each diagram type, visit:
- [Sequence Diagrams](https://docs.eraser.io/docs/syntax-2)
- [Flowcharts](https://docs.eraser.io/docs/syntax-3)
- [Entity Relationship Diagrams](https://docs.eraser.io/docs/syntax-1)
- [Cloud Infrastructure](https://docs.eraser.io/docs/syntax)

## License

MIT
