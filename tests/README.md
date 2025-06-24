# Eraser MCP Tests

This directory contains test scripts for debugging and validating the Eraser MCP server functionality.

## Available Tests

### 1. Image Download Test (`test-image-download.ts`)
Tests the complete flow of creating a diagram and downloading the image:
- Creates a diagram via Eraser API
- Downloads the generated image
- Converts to base64
- Saves a test image locally
- Validates the response format

### 2. MCP Format Test (`test-mcp-format.ts`)
Specifically tests MCP-compliant response format:
- Creates a flowchart diagram
- Downloads and converts image to proper MCP format
- Validates the response structure
- Checks image size against Claude Desktop's 1MB limit

## Running Tests

### Run all tests:
```bash
cd tests
./run-tests.sh
```

### Run individual tests:
```bash
cd tests
npx tsx test-image-download.ts
npx tsx test-mcp-format.ts
```

## Prerequisites
- Node.js 18+
- `.env` file in the parent directory with `ERASER_API_KEY`
- All project dependencies installed (`npm install`)

## Test Output
- Test results are printed to console
- `test-diagram.png` file is created when running the image download test
- Both tests validate the complete workflow from API call to MCP response

## Troubleshooting

### Common Issues:
1. **ERASER_API_KEY not found**: Ensure `.env` file exists in parent directory
2. **Image download fails**: Check network connectivity and API key validity
3. **Large image warning**: If images exceed 1MB, consider reducing diagram complexity

### Debug Output:
Tests provide detailed output including:
- API response details
- Image download headers
- Base64 conversion results
- MCP format validation