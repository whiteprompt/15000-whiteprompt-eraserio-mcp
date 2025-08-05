#!/bin/bash

echo "Running Eraser MCP Tests"
echo "========================"
echo ""

# Check if .env file exists
if [ ! -f "../.env" ]; then
    echo "❌ Error: .env file not found in parent directory"
    echo "Please create a .env file with ERASER_API_KEY=yourapikey"
    exit 1
fi

# Test 1: Basic image download
echo "Test 1: Image Download and Base64 Conversion"
echo "--------------------------------------------"
npx tsx test-image-download.ts
echo ""

# Test 2: MCP format compliance
echo "Test 2: MCP Format Compliance"
echo "-----------------------------"
npx tsx test-mcp-format.ts
echo ""

echo "Test suite completed!"