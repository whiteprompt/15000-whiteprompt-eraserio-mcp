import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Load environment variables (same as main script)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possiblePaths = [
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '.env'),
  '.env'
];

let envLoaded = false;
for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath, override: true });
    if (!result.error) {
      envLoaded = true;
      console.log(`Loaded .env from: ${envPath}`);
      if (result.parsed && result.parsed.ERASER_API_KEY) {
        process.env.ERASER_API_KEY = result.parsed.ERASER_API_KEY;
      }
      break;
    }
  }
}

const ERASER_API_KEY = process.env.ERASER_API_KEY;
const ERASER_API_BASE_URL = 'https://app.eraser.io/api';

if (!ERASER_API_KEY) {
  console.error('Error: ERASER_API_KEY not found');
  process.exit(1);
}

async function testMCPFormat() {
  console.log('Testing MCP-compliant image format...\n');

  const testContent = `Start [shape: oval]
Start > Process: Begin
Process > Decision [shape: diamond]: Check
Decision > End [shape: oval]: Success`;

  try {
    // Create diagram
    const eraserApi = axios.create({
      baseURL: ERASER_API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${ERASER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const response = await eraserApi.post('/render/elements', {
      theme: 'dark',
      background: true,
      elements: [
        {
          type: 'diagram',
          diagramType: 'flowchart-diagram',
          code: testContent,
        },
      ],
    });

    const { imageUrl } = response.data;
    console.log('Created diagram, downloading image...');

    // Download image
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      maxContentLength: 10 * 1024 * 1024,
      headers: {
        'Accept': 'image/png, image/jpeg, image/*',
      },
    });

    // Convert to base64 (without data URI prefix)
    const buffer = Buffer.from(imageResponse.data);
    const base64Image = buffer.toString('base64');
    const mimeType = imageResponse.headers['content-type'] || 'image/png';

    // Create MCP-compliant response
    const mcpResponse = {
      content: [
        {
          type: 'text',
          text: 'Diagram created successfully!',
        },
        {
          type: 'image',
          data: base64Image,
          mimeType: mimeType,
        },
      ],
    };

    console.log('\nMCP Response Format:');
    console.log('- Content items:', mcpResponse.content.length);
    console.log('- Text content:', mcpResponse.content[0]);
    console.log('- Image content:');
    console.log('  - type:', mcpResponse.content[1].type);
    console.log('  - mimeType:', mcpResponse.content[1].mimeType);
    console.log('  - data length:', mcpResponse.content[1].data.length);
    console.log('  - data preview:', mcpResponse.content[1].data.substring(0, 50) + '...');
    console.log('  - data is pure base64 (no prefix):', !mcpResponse.content[1].data.startsWith('data:'));

    // Check size (Claude Desktop has 1MB limit)
    const sizeInBytes = Buffer.from(base64Image, 'base64').length;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    console.log(`\nImage size: ${sizeInBytes} bytes (${sizeInMB.toFixed(2)} MB)`);
    console.log(`Within Claude Desktop 1MB limit: ${sizeInMB < 1 ? '✅' : '❌'}`);

    console.log('\n✅ MCP format test completed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

testMCPFormat();