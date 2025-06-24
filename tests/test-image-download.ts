import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple locations for .env file
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
      // Manually set the environment variable to handle edge cases
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
  console.error('Error: ERASER_API_KEY not found in .env file');
  process.exit(1);
}

async function testCreateDiagram() {
  console.log('Testing Eraser API with image download...\n');

  // Simple test diagram
  const testContent = `User > Server: Login Request
Server > Database: Query User
Database --> Server: User Data
Server --> User: Login Response`;

  try {
    // Step 1: Create diagram via Eraser API
    console.log('Step 1: Creating diagram via Eraser API...');
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
          diagramType: 'sequence-diagram',
          code: testContent,
        },
      ],
    });

    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    const { imageUrl, createEraserFileUrl } = response.data;
    console.log('\nImage URL:', imageUrl);
    console.log('Edit URL:', createEraserFileUrl);

    // Step 2: Try to download the image
    console.log('\nStep 2: Attempting to download image...');
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      maxContentLength: 10 * 1024 * 1024,
      headers: {
        'Accept': 'image/png, image/jpeg, image/*',
      },
    });

    console.log('Image download response:', {
      status: imageResponse.status,
      headers: imageResponse.headers,
      contentLength: imageResponse.data.length,
    });

    // Step 3: Convert to base64
    console.log('\nStep 3: Converting to base64...');
    const buffer = Buffer.from(imageResponse.data);
    const contentType = imageResponse.headers['content-type'] || 'image/png';
    const base64Image = `data:${contentType};base64,${buffer.toString('base64')}`;

    console.log('Base64 data URI info:', {
      contentType,
      bufferLength: buffer.length,
      base64Length: base64Image.length,
      base64Preview: base64Image.substring(0, 100) + '...',
    });

    // Step 4: Save image to file for inspection
    const testImagePath = path.join(__dirname, 'test-diagram.png');
    fs.writeFileSync(testImagePath, buffer);
    console.log(`\nStep 4: Image saved to: ${testImagePath}`);

    // Step 5: Test the MCP response format
    console.log('\nStep 5: Testing MCP response format...');
    const mcpResponse = {
      content: [
        {
          type: 'text',
          text: `Diagram created successfully!\n\nImage URL: ${imageUrl}\n\nEdit in Eraser: ${createEraserFileUrl}`,
        },
        {
          type: 'image',
          data: base64Image,
        },
      ],
    };

    console.log('MCP Response structure:', {
      contentCount: mcpResponse.content.length,
      contentTypes: mcpResponse.content.map(c => c.type),
      textContent: mcpResponse.content[0],
      imageContentPreview: {
        type: mcpResponse.content[1].type,
        dataLength: mcpResponse.content[1].data.length,
        dataPreview: mcpResponse.content[1].data.substring(0, 100) + '...',
      },
    });

    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:');
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    } else {
      console.error('General error:', error);
    }
  }
}

// Run the test
testCreateDiagram();