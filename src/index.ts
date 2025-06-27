import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple locations for .env file
const possiblePaths = [
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '../.env'),
  path.join(__dirname, '../../.env'),
  '.env'
];

let envLoaded = false;
for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath, override: true });
    if (!result.error) {
      envLoaded = true;
      // Manually set the environment variable to handle edge cases
      if (result.parsed && result.parsed.ERASER_API_KEY) {
        process.env.ERASER_API_KEY = result.parsed.ERASER_API_KEY;
      }
      break;
    }
  }
}

if (!envLoaded) {
  console.error('Warning: Could not find .env file in any of the expected locations');
  console.error('Searched in:', possiblePaths);
}

let ERASER_API_KEY = process.env.ERASER_API_KEY;
const ERASER_API_BASE_URL = 'https://app.eraser.io/api';

// Only validate API key if not in config-only mode
function validateApiKey() {
  if (!ERASER_API_KEY) {
    console.error('Error: ERASER_API_KEY environment variable is required');
    console.error('Please ensure you have a .env file with ERASER_API_KEY=your_api_key');
    console.error('Or set the environment variable directly: export ERASER_API_KEY=your_api_key');
    process.exit(1);
  }
}

const server = new Server(
  {
    name: 'eraser-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Create axios instance after API key is loaded
let eraserApi: any;

const TOOLS: Tool[] = [
  {
    name: 'create_diagram',
    description: `<tool>
  <purpose>Create and render diagrams on Eraser.io, returning URLs for viewing and editing</purpose>
  
  <when-to-use>
    - User asks to "create", "make", "generate", "draw", or "render" a diagram
    - User provides complete diagram content ready for rendering
    - User wants to share, save, or get a visual output of their diagram
    - After successfully validating and/or fixing diagram syntax
    - User asks for a diagram to be "turned into an image" or "visualized"
  </when-to-use>
  
  <when-not-to-use>
    - User only wants to check if syntax is correct (use validate_diagram instead)
    - Diagram content has known syntax errors (use fix_diagram first)
    - User is still drafting or asking questions about diagram structure
    - User only wants text-based feedback about their diagram
  </when-not-to-use>
  
  <examples>
    <example>
      <user>Create a sequence diagram showing login flow: User > Server: Login Request</user>
      <action>Use create_diagram with content and diagramType='sequence-diagram'</action>
      <result>Returns image URL and edit link for the diagram</result>
    </example>
    <example>
      <user>Make this into a flowchart: Start > Process Data > End</user>
      <action>Use create_diagram with content and diagramType='flowchart-diagram'</action>
    </example>
    <example>
      <user>I need a cloud architecture diagram for my AWS setup</user>
      <action>First help user define the content, then use create_diagram</action>
    </example>
  </examples>
  
  <parameters>
    <content>Complete diagram code in Eraser DSL format - must be syntactically valid</content>
    <diagramType>Type of diagram matching the content structure (sequence-diagram/flowchart-diagram/cloud-architecture-diagram/entity-relationship-diagram)</diagramType>
    <theme>Visual theme - 'dark' works well for most cases, 'light' for print/documents</theme>
    <background>Include background in image - usually true unless user needs transparency</background>
  </parameters>
  
  <output-format>
    - Success message with diagram URLs
    - Image URL: Direct link to view/download the rendered diagram
    - Edit URL: Link to open and edit the diagram in Eraser
  </output-format>
  
  <workflow-position>
    Typically the final step after validate_diagram and/or fix_diagram
  </workflow-position>
</tool>`,
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Diagram content in Eraser DSL format',
        },
        diagramType: {
          type: 'string',
          enum: ['sequence-diagram', 'cloud-architecture-diagram', 'entity-relationship-diagram', 'flowchart-diagram'],
          description: 'Type of diagram to create',
          default: 'sequence-diagram',
        },
        theme: {
          type: 'string',
          enum: ['light', 'dark'],
          description: 'Theme for the diagram',
          default: 'dark',
        },
        background: {
          type: 'boolean',
          description: 'Whether to include background in the rendered image',
          default: true,
        },
      },
      required: ['content'],
    },
  },
  {
    name: 'validate_diagram',
    description: `<tool>
  <purpose>Check Eraser diagram syntax for errors and provide detailed feedback about validity</purpose>
  
  <when-to-use>
    - User asks "is this valid?", "check this", "validate", or "verify" about diagram syntax
    - Before creating a diagram when syntax correctness is uncertain
    - User provides diagram code and wants feedback on its correctness
    - As a first step when user shares diagram code without explicit instructions
    - User mentions they're having "syntax issues" or "errors"
  </when-to-use>
  
  <when-not-to-use>
    - User explicitly asks to create/render a diagram (use create_diagram)
    - User asks to "fix" or "correct" errors (use fix_diagram)
    - User is asking about diagram design/structure, not syntax
    - Diagram is obviously incomplete or user is still composing it
  </when-not-to-use>
  
  <examples>
    <example>
      <user>Can you check if this sequence diagram is valid? User > Server Request</user>
      <action>Use validate_diagram to check syntax</action>
      <result>Reports missing colon after 'Request'</result>
    </example>
    <example>
      <user>Is this ERD syntax correct? users { id string pk }</user>
      <action>Use validate_diagram with diagramType='entity-relationship-diagram'</action>
      <result>Confirms syntax is valid</result>
    </example>
    <example>
      <user>I wrote this flowchart but I'm not sure if it's right</user>
      <action>Use validate_diagram to analyze the provided code</action>
    </example>
  </examples>
  
  <parameters>
    <content>The diagram code to validate - can be partial or complete</content>
    <diagramType>Must match the actual diagram type for accurate validation</diagramType>
  </parameters>
  
  <output-types>
    - Success: Confirmation that syntax is valid
    - Errors: Line-specific issues (unclosed brackets, missing elements)
    - Warnings: Valid but potentially problematic patterns
  </output-types>
  
  <workflow-position>
    Usually the first tool in the validate→fix→create workflow
  </workflow-position>
</tool>`,
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Diagram content in Eraser DSL format to validate',
        },
        diagramType: {
          type: 'string',
          enum: ['sequence-diagram', 'cloud-architecture-diagram', 'entity-relationship-diagram', 'flowchart-diagram'],
          description: 'Type of diagram to validate',
          default: 'sequence-diagram',
        },
      },
      required: ['content'],
    },
  },
  {
    name: 'fix_diagram',
    description: `<tool>
  <purpose>Automatically fix common syntax errors in Eraser diagrams and return corrected version</purpose>
  
  <when-to-use>
    - User asks to "fix", "correct", "repair", or "clean up" diagram syntax
    - After validate_diagram finds errors that can be auto-corrected
    - User mentions their diagram is "broken" or "not working"
    - Diagram has obvious syntax issues like missing brackets or wrong arrow syntax
    - User says "can you make this work?" about diagram code
  </when-to-use>
  
  <when-not-to-use>
    - User only wants to know what's wrong (use validate_diagram)
    - Diagram is already valid (use create_diagram directly)
    - User is asking for design/structural changes, not syntax fixes
    - Issues are semantic rather than syntactic
  </when-not-to-use>
  
  <examples>
    <example>
      <user>Fix this sequence diagram: User => Server Request</user>
      <action>Use fix_diagram to correct arrow syntax and missing colon</action>
      <result>Returns: User > Server: Request</result>
    </example>
    <example>
      <user>This flowchart is broken: Start [shape: circle</user>
      <action>Use fix_diagram to add missing bracket</action>
      <result>Returns: Start [shape: circle]</result>
    </example>
    <example>
      <user>Clean up my ERD: users {id string pk</user>
      <action>Use fix_diagram to close the entity definition</action>
      <result>Returns: users {id string pk}</result>
    </example>
  </examples>
  
  <fixes-applied>
    - Arrow syntax: => to >, <= to <, ... to --
    - Missing closing brackets, braces, and quotes
    - Missing colons in sequence messages
    - Shape name corrections (circle→oval, box→rectangle)
    - Trailing whitespace and excessive empty lines
    - Missing newline at end of file
  </fixes-applied>
  
  <parameters>
    <content>The diagram code to fix - will be analyzed and corrected</content>
    <diagramType>Must match the diagram type for appropriate fixes</diagramType>
  </parameters>
  
  <output-format>
    - List of fixes applied with before/after examples
    - Complete corrected diagram code
    - Validation status after fixes
    - Any remaining issues that couldn't be auto-fixed
  </output-format>
  
  <workflow-position>
    Middle step between validate_diagram and create_diagram
  </workflow-position>
</tool>`,
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Diagram content in Eraser DSL format to fix',
        },
        diagramType: {
          type: 'string',
          enum: ['sequence-diagram', 'cloud-architecture-diagram', 'entity-relationship-diagram', 'flowchart-diagram'],
          description: 'Type of diagram to fix',
          default: 'sequence-diagram',
        },
      },
      required: ['content'],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Validation rules for different diagram types
interface ValidationRule {
  pattern: RegExp;
  message: string;
  fix?: (match: string) => string;
}

interface DiagramValidator {
  [key: string]: ValidationRule[];
}

// Validation rules based on Eraser syntax documentation
const validators: DiagramValidator = {
  'sequence-diagram': [
    {
      pattern: /^.+\s*(?:>|<|<>|->|<-|-->|<--)\s*.+:/gm,
      message: 'Sequence diagram messages should follow format: Actor1 > Actor2: Message',
      fix: (match: string) => {
        // Fix common arrow mistakes
        return match.replace(/=>/g, '>').replace(/<=/g, '<').replace(/--->/g, '-->');
      }
    },
    {
      pattern: /^(activate|deactivate)\s+\S+/gm,
      message: 'Activation commands should be: activate ActorName or deactivate ActorName',
    },
    {
      pattern: /^(loop|alt|opt|par|break)(\s|$)/gm,
      message: 'Control blocks should start with: loop, alt, opt, par, or break',
    },
  ],
  'cloud-architecture-diagram': [
    {
      pattern: /\[icon:\s*[\w\-]+\]/g,
      message: 'Cloud services should specify icon: [icon: provider-service]',
    },
    {
      pattern: /^.+\s*(?:>|<|<>|->|<-|-->|<--|--)\s*.+/gm,
      message: 'Connections should use valid arrow syntax: >, <, <>, -, --, -->',
      fix: (match: string) => {
        // Fix common arrow mistakes
        return match.replace(/=>/g, '>').replace(/<=/g, '<').replace(/\.\.\./g, '--');
      }
    },
    {
      pattern: /^\s*direction\s+(right|left|up|down)/gm,
      message: 'Direction should be: direction right/left/up/down',
      fix: (match: string) => {
        // Fix common direction mistakes
        return match.toLowerCase().replace(/horizontal/g, 'right').replace(/vertical/g, 'down');
      }
    },
  ],
  'entity-relationship-diagram': [
    {
      pattern: /^\s*\w+\s*\{[\s\S]*?\}/gm,
      message: 'Entities should follow format: entityName { attributes }',
      fix: (match: string) => {
        // Ensure proper spacing around braces
        return match.replace(/\s*{\s*/g, ' { ').replace(/\s*}\s*/g, ' }');
      }
    },
    {
      pattern: /^\s+\w+\s+\w+(\s+(pk|fk))?/gm,
      message: 'Attributes should follow format: attributeName type [pk|fk]',
    },
    {
      pattern: /\w+\.\w+\s*(?:>|<|<>|-)\s*\w+\.\w+/g,
      message: 'Relationships should follow format: entity1.attribute > entity2.attribute',
      fix: (match: string) => {
        // Fix common relationship arrow mistakes
        return match.replace(/=>/g, '>').replace(/<=/g, '<').replace(/--/g, '-');
      }
    },
  ],
  'flowchart-diagram': [
    {
      pattern: /^\s*\w+\s*\[.*?\]/gm,
      message: 'Nodes should have properties: NodeName [shape: rectangle]',
    },
    {
      pattern: /\[shape:\s*(rectangle|oval|diamond|cylinder|document|ellipse|hexagon|parallelogram|star|trapezoid|triangle)\]/g,
      message: 'Valid shapes: rectangle, oval, diamond, cylinder, document, ellipse, hexagon, parallelogram, star, trapezoid, triangle',
      fix: (match: string) => {
        // Fix common shape typos
        return match.replace(/circle/g, 'oval').replace(/box/g, 'rectangle').replace(/rhombus/g, 'diamond');
      }
    },
    {
      pattern: /^\s*\w+\s*(?:>|<|<>|->|<-|-->|<--|--|-)\s*\w+/gm,
      message: 'Connections should follow format: Node1 > Node2 or Node1 > Node2: Label',
      fix: (match: string) => {
        // Fix common arrow mistakes
        return match.replace(/=>/g, '>').replace(/<=/g, '<').replace(/\.\.\./g, '--');
      }
    },
    {
      pattern: /^\s*\w+\s*\{[\s\S]*?\}/gm,
      message: 'Groups should follow format: GroupName { Node1, Node2 }',
    },
  ],
};

function validateDiagram(content: string, diagramType: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const rules = validators[diagramType] || [];
  
  // Basic validation - check if content is not empty
  if (!content.trim()) {
    errors.push('Diagram content cannot be empty');
    return { isValid: false, errors };
  }
  
  // Split content into lines for line-by-line validation
  const lines = content.split('\n');
  
  // Type-specific validation
  switch (diagramType) {
    case 'sequence-diagram':
      // Check for at least one message
      if (!content.match(/^.+\s*(?:>|<|<>|->|<-|-->|<--)\s*.+:/gm)) {
        warnings.push('No sequence messages found. Expected format: Actor1 > Actor2: Message');
      }
      break;
      
    case 'entity-relationship-diagram':
      // Check for at least one entity
      if (!content.match(/^\s*\w+\s*\{[\s\S]*?\}/gm)) {
        errors.push('No entities found. Expected format: entityName { attributes }');
      }
      break;
      
    case 'flowchart-diagram':
      // Check for at least one node or connection
      if (!content.match(/^\s*\w+(\s*\[.*?\])?/gm) && !content.match(/^\s*\w+\s*(?:>|<|<>|->|<-|-->|<--|--|-)\s*\w+/gm)) {
        errors.push('No nodes or connections found');
      }
      break;
      
    case 'cloud-architecture-diagram':
      // Check for at least one service or connection
      if (!content.match(/\w+\s*\[.*?\]/gm) && !content.match(/^\s*\w+\s*(?:>|<|<>|->|<-|-->|<--|--|-)\s*\w+/gm)) {
        warnings.push('No services or connections found');
      }
      break;
  }
  
  // Check for syntax errors
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('#')) {
      return;
    }
    
    // Check for unclosed brackets
    const openBrackets = (line.match(/[\[{]/g) || []).length;
    const closeBrackets = (line.match(/[\]}]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push(`Line ${lineNum}: Unclosed brackets`);
    }
    
    // Check for unclosed quotes
    const quotes = (line.match(/"/g) || []).length;
    if (quotes % 2 !== 0) {
      errors.push(`Line ${lineNum}: Unclosed quotes`);
    }
  });
  
  // Include warnings as informational messages
  if (warnings.length > 0) {
    errors.push(...warnings.map(w => `Warning: ${w}`));
  }
  
  return { isValid: errors.filter(e => !e.startsWith('Warning:')).length === 0, errors };
}

function fixDiagram(content: string, diagramType: string): { content: string; fixes: string[] } {
  const fixes: string[] = [];
  let fixedContent = content;
  const rules = validators[diagramType] || [];
  
  // Apply fixes for each rule that has a fix function
  for (const rule of rules) {
    if (rule.fix) {
      const matches = fixedContent.match(rule.pattern);
      if (matches) {
        matches.forEach(match => {
          const fixed = rule.fix!(match);
          if (fixed !== match) {
            const oldContent = fixedContent;
            fixedContent = fixedContent.replace(match, fixed);
            if (oldContent !== fixedContent) {
              fixes.push(`Fixed: "${match.trim()}" -> "${fixed.trim()}"`);
            }
          }
        });
      }
    }
  }
  
  // Common fixes for all diagram types
  const lines = fixedContent.split('\n');
  const fixedLines: string[] = [];
  
  lines.forEach((line, index) => {
    let fixedLine = line;
    
    // Fix unclosed quotes by adding a closing quote at the end
    const quotes = (line.match(/"/g) || []).length;
    if (quotes % 2 !== 0) {
      fixedLine += '"';
      fixes.push(`Line ${index + 1}: Added missing closing quote`);
    }
    
    // Fix common bracket issues
    const openSquare = (line.match(/\[/g) || []).length;
    const closeSquare = (line.match(/\]/g) || []).length;
    if (openSquare > closeSquare) {
      fixedLine += ']'.repeat(openSquare - closeSquare);
      fixes.push(`Line ${index + 1}: Added missing closing bracket(s)`);
    }
    
    const openCurly = (line.match(/\{/g) || []).length;
    const closeCurly = (line.match(/\}/g) || []).length;
    if (openCurly > closeCurly) {
      fixedLine += '}'.repeat(openCurly - closeCurly);
      fixes.push(`Line ${index + 1}: Added missing closing brace(s)`);
    }
    
    // Fix common spacing issues
    if (fixedLine !== fixedLine.trimEnd()) {
      fixedLine = fixedLine.trimEnd();
      fixes.push(`Line ${index + 1}: Removed trailing whitespace`);
    }
    
    fixedLines.push(fixedLine);
  });
  
  fixedContent = fixedLines.join('\n');
  
  // Type-specific fixes
  switch (diagramType) {
    case 'sequence-diagram':
      // Ensure messages have colons
      fixedContent = fixedContent.replace(/^(.+\s*(?:>|<|<>|->|<-|-->|<--)\s*.+)$/gm, (match) => {
        if (!match.includes(':')) {
          fixes.push('Added missing colon to sequence message');
          return match + ':';
        }
        return match;
      });
      break;
      
    case 'entity-relationship-diagram':
      // Fix entity definitions with missing braces
      fixedContent = fixedContent.replace(/^(\s*\w+)\s*$/gm, (match, entityName) => {
        if (!fixedContent.includes(entityName.trim() + ' {')) {
          fixes.push(`Added missing braces to entity: ${entityName.trim()}`);
          return `${entityName} { }`;
        }
        return match;
      });
      break;
  }
  
  // Final cleanup
  // Remove multiple consecutive empty lines
  const beforeEmptyLines = fixedContent;
  fixedContent = fixedContent.replace(/\n\n\n+/g, '\n\n');
  if (beforeEmptyLines !== fixedContent) {
    fixes.push('Removed excessive empty lines');
  }
  
  // Ensure newline at end
  if (!fixedContent.endsWith('\n')) {
    fixedContent += '\n';
    fixes.push('Added newline at end of file');
  }
  
  return { content: fixedContent, fixes };
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'create_diagram': {
      const { 
        content, 
        diagramType = 'sequence-diagram',
        theme = 'dark',
        background = true
      } = args as {
        content: string;
        diagramType?: string;
        theme?: string;
        background?: boolean;
      };

      try {
        const response = await eraserApi.post('/render/elements', {
          theme,
          background,
          elements: [
            {
              type: 'diagram',
              diagramType,
              code: content,
            },
          ],
        });

        const { imageUrl, createEraserFileUrl } = response.data;
        
        return {
          content: [
            {
              type: 'text',
              text: `Diagram created successfully!\n\nImage URL: ${imageUrl}\n\nEdit in Eraser: ${createEraserFileUrl}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorDetails = axios.isAxiosError(error) && error.response 
          ? `\nStatus: ${error.response.status}\nDetails: ${JSON.stringify(error.response.data)}`
          : '';
        
        return {
          content: [
            {
              type: 'text',
              text: `Failed to create diagram: ${errorMessage}${errorDetails}`,
            },
          ],
        };
      }
    }

    case 'validate_diagram': {
      const { 
        content, 
        diagramType = 'sequence-diagram'
      } = args as {
        content: string;
        diagramType?: string;
      };

      const validation = validateDiagram(content, diagramType);
      
      if (validation.isValid) {
        return {
          content: [
            {
              type: 'text',
              text: `✓ Diagram syntax is valid for ${diagramType}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `✗ Diagram validation failed for ${diagramType}:\n\n${validation.errors.map(e => `• ${e}`).join('\n')}`,
            },
          ],
        };
      }
    }

    case 'fix_diagram': {
      const { 
        content, 
        diagramType = 'sequence-diagram'
      } = args as {
        content: string;
        diagramType?: string;
      };

      // First validate
      const validation = validateDiagram(content, diagramType);
      
      // Then apply fixes
      const { content: fixedContent, fixes } = fixDiagram(content, diagramType);
      
      // Validate the fixed content
      const postValidation = validateDiagram(fixedContent, diagramType);
      
      let response = `Diagram fixing completed for ${diagramType}:\n\n`;
      
      if (fixes.length > 0) {
        response += `Applied fixes:\n${fixes.map(f => `• ${f}`).join('\n')}\n\n`;
      } else {
        response += `No automatic fixes were needed.\n\n`;
      }
      
      if (postValidation.isValid) {
        response += `✓ Fixed diagram is now valid!\n\n`;
      } else if (postValidation.errors.length < validation.errors.length) {
        response += `⚠ Some issues remain:\n${postValidation.errors.map(e => `• ${e}`).join('\n')}\n\n`;
      } else if (validation.errors.length > 0) {
        response += `⚠ Could not automatically fix these issues:\n${postValidation.errors.map(e => `• ${e}`).join('\n')}\n\n`;
      }
      
      response += `Fixed content:\n\`\`\`\n${fixedContent}\`\`\``;
      
      return {
        content: [
          {
            type: 'text',
            text: response,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

function getClaudeDesktopConfig() {
  const scriptPath = path.resolve(__dirname, 'index.js');
  
  // Check if running in devcontainer
  const isDevContainer = process.env.REMOTE_CONTAINERS || process.env.CODESPACES;
  
  const config: any = {
    mcpServers: {
      eraser: {
        command: "node",
        args: [scriptPath]
      }
    }
  };
  
  // If in devcontainer, show wrapper script instructions
  if (isDevContainer) {
    config.mcpServers.eraser = {
      command: "/path/to/claude-wrapper.sh",
      // Note: no args needed, wrapper script handles the path
    };
    config._comment = "Update the command path to where you placed the wrapper script on your host machine";
  }
  
  // Only include env if .env file was not loaded successfully
  if (!envLoaded && !isDevContainer) {
    config.mcpServers.eraser.env = {
      ERASER_API_KEY: "your_api_key_here"
    };
  }
  
  return config;
}

async function main() {
  // Check if user wants to see config only
  const args = process.argv.slice(2);
  const configOnly = args.includes('--config') || args.includes('-c');
  
  if (configOnly) {
    // Skip API key validation for config-only mode
    const config = getClaudeDesktopConfig();
    console.log(JSON.stringify(config, null, 2));
    process.exit(0);
  }

  // Validate API key for normal operation
  validateApiKey();
  
  // Initialize axios with the API key
  eraserApi = axios.create({
    baseURL: ERASER_API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${ERASER_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  // Output Claude Desktop configuration before connecting (only if not running via MCP)
  const config = getClaudeDesktopConfig();
  const isDevContainer = process.env.REMOTE_CONTAINERS || process.env.CODESPACES;
  
  // Only show config info if we're not running in MCP mode (detected by checking if stdout is a TTY)
  if (process.stdout.isTTY) {
    console.error('\n=== Claude Desktop Configuration ===');
    console.error('Add this to your Claude Desktop settings:\n');
    console.error(JSON.stringify(config, null, 2));
    
    if (isDevContainer) {
      console.error('\n⚠️  DevContainer Detected!');
      console.error('You are running inside a devcontainer. To use with Claude Desktop:');
      console.error('1. Copy scripts/claude-wrapper.sh to your host machine');
      console.error('2. Update the wrapper script with your container name');
      console.error('3. Use the wrapper script path in the configuration above');
      console.error('\nAlternatively, use scripts/run-on-host.sh to run on your host machine.');
    } else if (envLoaded) {
      console.error('\nNote: API key loaded from .env file');
      console.error('The .env file will be used automatically when the server starts');
    } else {
      console.error('\nNote: No .env file found');
      console.error('You need to add your ERASER_API_KEY to the env section above');
    }
    
    console.error('\n===================================\n');
    console.error('To show only the config, run: npm start -- --config');
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});