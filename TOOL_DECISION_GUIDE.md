# Eraser MCP Tool Decision Guide

This guide helps LLMs choose the correct tool based on user intent and diagram state.

## Tool Selection Flowchart

```
User provides diagram-related request
│
├─ Contains keywords: "check", "validate", "verify", "is this correct?"
│  └─> Use `validate_diagram`
│
├─ Contains keywords: "fix", "correct", "repair", "broken", "not working"
│  └─> Use `fix_diagram`
│
├─ Contains keywords: "create", "make", "generate", "draw", "render", "visualize"
│  └─> Use `create_diagram`
│
└─ No clear keywords but provides diagram code
   └─> Start with `validate_diagram` to assess state
```

## Common Workflow Patterns

### Pattern 1: Validate → Fix → Create
**User**: "Here's my sequence diagram, can you help me get it working?"
1. `validate_diagram` - Check for syntax errors
2. `fix_diagram` - If errors found, fix them
3. `create_diagram` - Generate the final image

### Pattern 2: Direct Creation (Confident Syntax)
**User**: "Create a flowchart: Start > Process > End"
1. `create_diagram` - Directly create if syntax appears valid

### Pattern 3: Fix First
**User**: "Fix this broken diagram: User => Server"
1. `fix_diagram` - Apply corrections
2. Optionally `create_diagram` - If user wants visual output

## Decision Matrix

| User Intent | First Tool | Follow-up Tools |
|------------|------------|-----------------|
| "Is this valid?" | validate_diagram | fix_diagram (if errors) |
| "Fix this" | fix_diagram | create_diagram (optional) |
| "Create/Make this" | create_diagram | - |
| "Help with this diagram" | validate_diagram | fix_diagram → create_diagram |
| Shows broken syntax | fix_diagram | create_diagram |
| Shows correct syntax | create_diagram | - |

## Keywords by Tool

### validate_diagram Keywords
- check, validate, verify, test
- "is this correct/valid/right?"
- "does this look okay?"
- "syntax issues"
- "what's wrong with"

### fix_diagram Keywords
- fix, correct, repair, clean up
- "broken", "not working"
- "make this work"
- "has errors"
- "can you correct"

### create_diagram Keywords
- create, make, generate, draw, render
- "turn into diagram/image"
- "visualize this"
- "I need a diagram"
- "show me"

## Edge Cases

1. **Ambiguous Request**: "Here's my diagram code"
   - Default: Start with `validate_diagram`

2. **Multiple Actions**: "Check and fix my diagram, then create it"
   - Execute in order: validate → fix → create

3. **Design vs Syntax**: "Make this diagram better"
   - If about visual design: Not handled by these tools
   - If about syntax: Use validate → fix workflow

4. **Partial Diagrams**: User is still composing
   - Avoid validation until complete
   - Offer syntax guidance without tools

## Tool Chaining Examples

```yaml
# Example 1: Full workflow
User: "I have this ERD but it's not working properly"
Flow:
  1. validate_diagram → Finds unclosed braces
  2. fix_diagram → Adds missing braces
  3. create_diagram → Generates final diagram

# Example 2: Direct fix
User: "Fix: Start [shape: circle"
Flow:
  1. fix_diagram → Adds closing bracket
  
# Example 3: Validation only
User: "Is this sequence diagram syntax correct?"
Flow:
  1. validate_diagram → Reports valid or lists errors
```

## Best Practices for LLMs

1. **Always match diagramType** to the actual content type
2. **Preserve user content** - Don't modify beyond syntax fixes
3. **Explain tool choices** when workflow isn't obvious
4. **Batch operations** when possible rather than iterating
5. **Trust the tools** - They implement Eraser's official syntax rules