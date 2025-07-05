# Task Master MCP Server 🤖✨

A TypeScript-based Model Context Protocol (MCP) server that provides **AI-enhanced task management** capabilities for AI agents. This server enables natural language interactions for task creation, filtering, and progress reporting, **powered by Google Gemini AI** for intelligent task enhancement and analysis.

## Features

- **🤖 AI-Enhanced Task Management**: Powered by Google Gemini AI
- **✨ Smart Task Creation**: Automatic task enhancement, categorization, and priority suggestions
- **🧠 Intelligent Analysis**: AI-powered task analysis with insights and recommendations
- **🎯 Smart Recommendations**: AI suggests next actions based on your task context
- **📋 Task Breakdown**: Complex tasks automatically broken down into subtasks
- **CRUD Operations**: Create, read, update, and delete tasks
- **Natural Language Interface**: Interact with tasks using natural language through AI agents
- **Dual Mode Support**: Both STDIO (for CLI/AI integration) and HTTP+SSE (for web clients)
- **Task Filtering**: Filter tasks by status, category, and priority
- **Real-time Updates**: Server-Sent Events for web clients
- **Statistics Endpoint**: Get task statistics and insights

## Prerequisites

- Node.js 16.x or higher
- Bun package manager (preferred) or npm/pnpm

## Installation

1. **Clone/Setup the repository**:
   ```bash
   # The project is already set up in your current directory
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Configure environment variables**:
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your Google Gemini API key
   # Get your API key from: https://makersuite.google.com/app/apikey
   ```

4. **Build the project**:
   ```bash
   bun run build
   ```

## Configuration

Create a `.env` file in the project root with the following variables:

```env
# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# HTTP Server Configuration
TASK_MANAGER_HTTP_PORT=3000

# Development Settings
NODE_ENV=development
```

## Running the Server

### STDIO Mode (for CLI/AI integration)

```bash
bun run start
```

or

```bash
node dist/index.js
```

### HTTP Mode (for web access)

```bash
bun run start:http
```

or

```bash
node dist/http-server.js
```

By default, the HTTP server runs on port 3000. You can change this by setting the `TASK_MANAGER_HTTP_PORT` environment variable.

## Available Tools

### listTasks ✨

Lists all available tasks with optional filtering. Enhanced with AI insights.

**Parameters:**
- `status` (optional): Filter by status (`pending`, `started`, `done`)
- `category` (optional): Filter by category
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)

### createTask 🤖

Creates a new task with AI enhancement. Automatically improves task descriptions, suggests categories, and recommends priorities.

**Parameters:**
- `task` (required): Task description (will be enhanced by AI)
- `category` (optional): Task category (AI will suggest if not provided)
- `priority` (optional): Task priority (AI will suggest if not provided)

**AI Features:**
- **Smart Enhancement**: Task descriptions are automatically improved for clarity
- **Category Suggestion**: AI suggests the most appropriate category
- **Priority Recommendation**: AI analyzes urgency and importance
- **Task Breakdown**: Complex tasks are broken down into subtasks

### updateTask

Updates an existing task.

**Parameters:**
- `taskId` (required): ID of the task to update
- `task` (optional): New task description
- `status` (optional): New status (`pending`, `started`, `done`)
- `category` (optional): New category
- `priority` (optional): New priority (`low`, `medium`, `high`)

### deleteTask

Deletes a task.

**Parameters:**
- `taskId` (required): ID of the task to delete

### getTaskAnalysis 🧠

Get comprehensive AI-powered analysis of all tasks with insights and recommendations.

**Returns:**
- **Summary**: Overview of task status, priorities, and focus areas
- **Next Actions**: AI-recommended actions to take next
- **Insights**: Analysis of task patterns and productivity recommendations

### getTaskRecommendations 🎯

Get AI-powered recommendations for next actions based on current task context.

**Returns:**
- **Action Items**: Specific recommendations for what to focus on next
- **Priority Guidance**: Which tasks to tackle first
- **Productivity Tips**: AI suggestions for better task management

## Integration Examples

### With Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "task-master-mcp": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/your/task-master-mcp"
    }
  }
}
```

### With Cursor

Add this to your `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project-specific):

```json
{
  "mcpServers": {
    "task-master-mcp": {
      "command": "node",
      "args": ["dist/index.js"]
    }
  }
}
```

### HTTP Client (Web Integration)

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

// Create transport
const transport = new SSEClientTransport('http://localhost:3000/mcp');

// Initialize client
const client = new Client({
  name: "task-client",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// Connect and use
await client.connect(transport);

// List tasks
const tasks = await client.callTool({
  name: "listTasks",
  arguments: { status: "pending" }
});

// Create a task
const newTask = await client.callTool({
  name: "createTask",
  arguments: {
    task: "Review pull request",
    category: "Development",
    priority: "high"
  }
});
```

## Development

### Scripts

- `bun run build` - Build the TypeScript code
- `bun run start` - Start the STDIO server
- `bun run start:http` - Start the HTTP server
- `bun run dev` - Watch mode for development
- `bun run clean` - Clean build artifacts

### Project Structure

```
├── src/
│   ├── index.ts          # STDIO MCP server
│   ├── http-server.ts    # HTTP MCP server
│   └── task-manager.ts   # Task management logic
├── dist/                 # Built JavaScript files
├── package.json
├── tsconfig.json
├── env.example          # Environment configuration template
└── README.md
```

## API Endpoints (HTTP Mode)

- `GET /` - Server information and documentation
- `GET /health` - Health check
- `GET /stats` - Task statistics
- `GET /analysis` - 🧠 AI-powered task analysis
- `GET /recommendations` - 🎯 AI-powered task recommendations
- `GET /mcp` - MCP Server-Sent Events endpoint

## Sample Tasks

The server comes with sample tasks for demonstration:

1. **Set up development environment** (Done, Development, High priority)
2. **Write documentation** (Started, Documentation, Medium priority)
3. **Review code changes** (Pending, Development, High priority)

## AI Features in Action

🤖 **When you create a task like "build marketing website"**, the AI will:
- ✨ Enhance it to: "Design and develop a comprehensive marketing website with responsive layout, SEO optimization, and conversion-focused landing pages"
- 🏷️ Suggest category: "Marketing" or "Development"
- ⚡ Recommend priority: "High" (if it's business-critical)
- 📋 Break it down into subtasks like:
  - Research target audience and competitors
  - Design wireframes and mockups
  - Develop responsive website structure
  - Implement SEO best practices
  - Set up analytics and tracking

🧠 **Task Analysis provides insights like:**
- "You have 2 high-priority development tasks that should be tackled first"
- "Consider focusing on the pending code review to unblock other team members"
- "Documentation task is in progress - allocate time to complete it this week"

🎯 **Smart Recommendations suggest:**
- "Start with the code review task as it may be blocking other team members"
- "Schedule focused time for the documentation task to complete it"
- "Consider breaking down the marketing website task into smaller milestones"

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test
5. Submit a pull request

## Support

For issues and questions, please create an issue in the repository or contact the maintainers. 