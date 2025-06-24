#!/bin/bash
# Wrapper script for Claude Desktop to run MCP server in devcontainer
#
# This script should be placed on your HOST machine (not in the container)
# Update CONTAINER_NAME to match your devcontainer name

# Try to find the devcontainer automatically
# VS Code typically names containers like: vscode-EraserMCP-<hash>
CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep -i erasermcp | head -1)

if [ -z "$CONTAINER_NAME" ]; then
    # Fallback to a specific name if auto-detection fails
    CONTAINER_NAME="strange_murdock"  # UPDATE THIS
fi

# Check if container is running
if ! docker ps --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "Error: Container '$CONTAINER_NAME' is not running" >&2
    echo "Please start your devcontainer in VS Code first" >&2
    exit 1
fi

# Forward all arguments to the container
# -i: interactive (required for stdio)
# No -t: no tty (MCP uses stdio, not terminal)
docker exec -i "$CONTAINER_NAME" node /workspace/dist/index.js "$@"