#!/bin/bash
# Build Docker image for Claude Desktop integration

set -e

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "Building Eraser MCP Docker image for Claude Desktop..."

# Build the Docker image
docker build -f Dockerfile.claude -t eraser-mcp:claude .

echo "✅ Docker image 'eraser-mcp:claude' built successfully!"
echo ""
echo "Now you can use this Claude Desktop configuration:"
echo ""
cat << 'EOF'
{
  "mcpServers": {
    "eraser": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "ERASER_API_KEY=your_api_key_here",
        "eraser-mcp:claude"
      ]
    }
  }
}
EOF
echo ""
echo "Or if you have a .env file, mount it:"
echo ""
cat << 'EOF'
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
EOF