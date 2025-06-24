#!/bin/bash
# Script to run the MCP server on the host machine after building in devcontainer
#
# Usage:
# 1. Build inside devcontainer: npm run build
# 2. Run this script on your host machine

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Check if Node.js is installed on host
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed on your host machine"
    echo "Please install Node.js to run the MCP server locally"
    exit 1
fi

# Check if dist directory exists
if [ ! -d "$PROJECT_DIR/dist" ]; then
    echo "Error: dist directory not found"
    echo "Please run 'npm run build' inside the devcontainer first"
    exit 1
fi

# Run the server
cd "$PROJECT_DIR"
node dist/index.js "$@"