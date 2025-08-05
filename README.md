# Eraser MCP Server

An MCP (Model Context Protocol) server that provides tools for creating diagrams on Eraser.io.

## Features

- Create diagrams on Eraser.io using their API
- Support for multiple diagram types (sequence-diagram, flowchart-diagram, cloud-architecture-diagram, entity-relationship-diagram)
- Returns direct links to view and edit diagrams
- Validate diagram syntax before creating
- Automatically fix common syntax errors
- Simple integration with MCP-compatible clients

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- An Eraser.io API key
- Docker (if using Dev Container)
- VS Code with Dev Containers extension (optional)

## Installation

### Using DevContainer

If you're using the included devcontainer (recommended for development):

1. Open in VS Code with Dev Containers extension
2. The container will automatically install dependencies
3. Build inside the container: `npm run build`
4. See [DevContainer Usage](#devcontainer-usage) for running with Claude Desktop

### Local Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd EraserMCP
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Eraser.io API key:
```
ERASER_API_KEY=your_actual_api_key_here
```

## Building

Build the TypeScript code to JavaScript:
```bash
npm run build
```

## Running the Server

### Development Mode

Run with hot reload for development:
```bash
npm run dev
```

### Production Mode

First build, then run:
```bash
npm run build
npm run start
```

## Usage with MCP Clients

### Claude Desktop Configuration

**Important**: MCP servers are NOT added through Claude Desktop's UI. You need to manually edit the configuration file.

#### Configuration File Location
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Option 1: Docker Configuration (Recommended)

The easiest way to run with Claude Desktop is using Docker directly:

1. Build the Docker image:
```bash
./scripts/build-claude-docker.sh
```

2. Add this to your Claude Desktop configuration:
```json
{
  "mcpServers": {
    "eraser": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--env-file", "/absolute/path/to/your/.env",
        "eraser-mcp:claude"
      ]
    }
  }
}
```

See [CLAUDE_DESKTOP_DOCKER.md](CLAUDE_DESKTOP_DOCKER.md) for detailed Docker setup instructions.

#### Option 2: Local Node.js Configuration

If you prefer running locally:

1. Run `npm start -- --config` to get your configuration
2. Open your Claude Desktop configuration file (create it if it doesn't exist)
3. Add the configuration to the file
4. Save and restart Claude Desktop

**If you have a .env file**: The configuration will automatically use it, so you don't need to include the API key in the Claude Desktop settings.

**If you don't have a .env file**: The configuration will include an env section where you need to add your API key:

```json
{
  "mcpServers": {
    "eraser": {
      "command": "node",
      "args": ["/absolute/path/to/EraserMCP/dist/index.js"],
      "env": {
        "ERASER_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Available Tools

#### create_diagram

Creates a new diagram on Eraser.io and returns links to view and edit it.

Parameters:
- `content` (required): Diagram content in Eraser DSL format
- `diagramType` (optional): Type of diagram (sequence-diagram, cloud-architecture-diagram, entity-relationship-diagram, flowchart-diagram). Default: sequence-diagram
- `theme` (optional): Theme for the diagram (light, dark). Default: dark
- `background` (optional): Whether to include background in the rendered image. Default: true

Returns:
- Image URL: Direct link to view/download the rendered diagram image
- Edit URL: Link to open and edit the diagram in Eraser

Example usage in Claude:
```
Create a sequence diagram with the following content:
Client > Server: Request
Server > Database: Query
Database --> Server: Results
Server --> Client: Response
```

#### validate_diagram

Validates Eraser diagram syntax and returns any errors found.

Parameters:
- `content` (required): Diagram content in Eraser DSL format to validate
- `diagramType` (optional): Type of diagram to validate (sequence-diagram, cloud-architecture-diagram, entity-relationship-diagram, flowchart-diagram). Default: sequence-diagram

Returns:
- Validation result indicating if the diagram syntax is valid
- List of errors and warnings found (if any)

Example usage in Claude:
```
Validate this sequence diagram:
Client > Server Request
Server > Database: Query
```

#### fix_diagram

Validates and attempts to fix common syntax errors in Eraser diagrams.

Parameters:
- `content` (required): Diagram content in Eraser DSL format to fix
- `diagramType` (optional): Type of diagram to fix (sequence-diagram, cloud-architecture-diagram, entity-relationship-diagram, flowchart-diagram). Default: sequence-diagram

Returns:
- List of applied fixes
- Fixed diagram content
- Validation status after fixes

Example usage in Claude:
```
Fix this flowchart:
Start [shape: circle
Start > Process
Process > End [shape: oval
```

## Development

### Using Dev Container (Recommended)

This project includes a Dev Container configuration for a consistent development environment:

1. Open the project in VS Code
2. Install the "Dev Containers" extension if not already installed
3. Press `Ctrl/Cmd + Shift + P` and select "Dev Containers: Reopen in Container"
4. VS Code will build and start the container, then install dependencies automatically

The Dev Container includes:
- Node.js 20
- TypeScript and tsx pre-installed
- ESLint configuration
- Automatic npm install on container creation

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

### Type Checking

Run TypeScript type checking:
```bash
npm run typecheck
```

### Testing

Run test scripts to validate functionality:
```bash
cd tests
./run-tests.sh
```

See `tests/README.md` for more information about available tests.

## API Integration

This server integrates with Eraser.io API. The MCP uses the [Generate diagram from Eraser DSL](https://docs.eraser.io/reference/generate-diagram-from-eraser-dsl) endpoint to create diagrams.

### Validation Features

The server includes built-in validation for all supported diagram types based on official Eraser syntax documentation:

- **Sequence Diagrams**: Validates message formats, activation blocks, and control structures
- **Flowcharts**: Validates node definitions, connections, shapes, and groups
- **Entity Relationship Diagrams**: Validates entity definitions, attributes, and relationships
- **Cloud Architecture Diagrams**: Validates service definitions, icons, and connections

Common fixes applied automatically:
- Arrow syntax corrections (e.g., `=>` to `>`)
- Missing brackets and quotes
- Trailing whitespace removal
- Missing colons in sequence messages
- Shape name corrections (e.g., `circle` to `oval`)

For more information about:
- The Eraser DSL format and syntax
- Available diagram types and their specific syntax
- API authentication and rate limits

Visit the [Eraser API documentation](https://docs.eraser.io/reference/generate-diagram-from-eraser-dsl).

Syntax documentation for each diagram type:
- [Flowcharts](https://docs.eraser.io/docs/syntax-3)
- [Entity Relationship Diagrams](https://docs.eraser.io/docs/syntax-1)
- [Cloud Infrastructure](https://docs.eraser.io/docs/syntax)
- [Sequence Diagrams](https://docs.eraser.io/docs/syntax-2)

## DevContainer Usage

Since Claude Desktop needs to run MCP servers as local processes, you have two options when developing with devcontainers:

### Option 1: Build in Container, Run on Host (Recommended)

1. Develop and build inside the devcontainer:
   ```bash
   npm run build
   ```

2. On your host machine, use the provided script:
   ```bash
   ./scripts/run-on-host.sh --config
   ```

3. Use this path in your Claude Desktop config:
   ```json
   {
     "mcpServers": {
       "eraser": {
         "command": "/path/to/EraserMCP/scripts/run-on-host.sh"
       }
     }
   }
   ```

### Option 2: Use Docker Wrapper

1. Copy `scripts/claude-wrapper.sh` to your host machine
2. Edit the script to set your container name
3. Make it executable: `chmod +x claude-wrapper.sh`
4. Use it in your Claude Desktop config:
   ```json
   {
     "mcpServers": {
       "eraser": {
         "command": "/path/to/claude-wrapper.sh"
       }
     }
   }
   ```

**Note**: The devcontainer must be running for this approach to work.

See `MCP_DEVCONTAINER_GUIDE.md` for detailed instructions and troubleshooting.

## License

MIT
