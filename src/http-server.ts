#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { TaskManager } from "./task-manager.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["GEMINI_API_KEY"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

class TaskMasterHTTPServer {
  private server: Server;
  private taskManager: TaskManager;
  private app: express.Application;
  private port: number;

  constructor() {
    this.port = parseInt(process.env.TASK_MANAGER_HTTP_PORT || process.env.PORT || "3000");
    this.app = express();
    
    this.server = new Server(
      {
        name: "task-master-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.taskManager = new TaskManager(
      process.env.TASK_MANAGER_API_BASE_URL || "https://generativelanguage.googleapis.com/v1beta",
      process.env.GEMINI_API_KEY!
    );

    this.setupMiddleware();
    this.setupToolHandlers();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "listTasks",
            description: "List all tasks with optional filtering by status, category, or priority",
            inputSchema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["pending", "started", "done"],
                  description: "Filter tasks by status",
                },
                category: {
                  type: "string",
                  description: "Filter tasks by category",
                },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "Filter tasks by priority",
                },
              },
            },
          },
          {
            name: "createTask",
            description: "Create a new task",
            inputSchema: {
              type: "object",
              properties: {
                task: {
                  type: "string",
                  description: "Task description",
                },
                category: {
                  type: "string",
                  description: "Task category (optional)",
                },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "Task priority (optional, defaults to medium)",
                },
              },
              required: ["task"],
            },
          },
          {
            name: "updateTask",
            description: "Update an existing task",
            inputSchema: {
              type: "object",
              properties: {
                taskId: {
                  type: "number",
                  description: "ID of the task to update",
                },
                task: {
                  type: "string",
                  description: "New task description (optional)",
                },
                status: {
                  type: "string",
                  enum: ["pending", "started", "done"],
                  description: "New task status (optional)",
                },
                category: {
                  type: "string",
                  description: "New task category (optional)",
                },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "New task priority (optional)",
                },
              },
              required: ["taskId"],
            },
          },
          {
            name: "deleteTask",
            description: "Delete a task",
            inputSchema: {
              type: "object",
              properties: {
                taskId: {
                  type: "number",
                  description: "ID of the task to delete",
                },
              },
              required: ["taskId"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "listTasks":
            return await this.handleListTasks(args);
          case "createTask":
            return await this.handleCreateTask(args);
          case "updateTask":
            return await this.handleUpdateTask(args);
          case "deleteTask":
            return await this.handleDeleteTask(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async handleListTasks(args: any) {
    const tasks = await this.taskManager.listTasks(args);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tasks, null, 2),
        },
      ],
    };
  }

  private async handleCreateTask(args: any) {
    const task = await this.taskManager.createTask(args);
    return {
      content: [
        {
          type: "text",
          text: `Task created successfully: ${JSON.stringify(task, null, 2)}`,
        },
      ],
    };
  }

  private async handleUpdateTask(args: any) {
    const task = await this.taskManager.updateTask(args);
    return {
      content: [
        {
          type: "text",
          text: `Task updated successfully: ${JSON.stringify(task, null, 2)}`,
        },
      ],
    };
  }

  private async handleDeleteTask(args: any) {
    await this.taskManager.deleteTask(args.taskId);
    return {
      content: [
        {
          type: "text",
          text: `Task with ID ${args.taskId} deleted successfully`,
        },
      ],
    };
  }

  private setupRoutes() {
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.json({ status: "healthy", timestamp: new Date().toISOString() });
    });

    // Task statistics endpoint
    this.app.get("/stats", async (req, res) => {
      try {
        const stats = await this.taskManager.getTaskStats();
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: "Failed to get task statistics" });
      }
    });

    // AI-powered task analysis endpoint
    this.app.get("/analysis", async (req, res) => {
      try {
        const analysis = await this.taskManager.getTaskAnalysis();
        res.json(analysis);
      } catch (error) {
        res.status(500).json({ error: "Failed to get task analysis" });
      }
    });

    // AI-powered task recommendations endpoint
    this.app.get("/recommendations", async (req, res) => {
      try {
        const recommendations = await this.taskManager.getTaskRecommendations();
        res.json({ recommendations });
      } catch (error) {
        res.status(500).json({ error: "Failed to get task recommendations" });
      }
    });

    // MCP SSE endpoint
    this.app.get("/mcp", (req, res) => {
      const transport = new SSEServerTransport("/mcp", res);
      this.server.connect(transport);
    });

    // Serve simple HTML interface
    this.app.get("/", (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Task Master MCP Server</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .status { color: #28a745; }
            .method { color: #007bff; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Task Master MCP Server</h1>
            <p class="status">✅ Server is running on port ${this.port}</p>
            
            <h2>Available Endpoints</h2>
            
            <div class="endpoint">
              <span class="method">GET</span> <code>/health</code>
              <p>Health check endpoint</p>
            </div>
            
            <div class="endpoint">
              <span class="method">GET</span> <code>/stats</code>
              <p>Get task statistics</p>
            </div>
            
            <div class="endpoint">
              <span class="method">GET</span> <code>/analysis</code>
              <p>Get AI-powered task analysis with summary and recommendations</p>
            </div>
            
            <div class="endpoint">
              <span class="method">GET</span> <code>/recommendations</code>
              <p>Get AI-powered task recommendations</p>
            </div>
            
            <div class="endpoint">
              <span class="method">GET</span> <code>/mcp</code>
              <p>MCP Server-Sent Events endpoint for AI clients</p>
            </div>
            
            <h2>Available Tools</h2>
            <ul>
              <li><strong>listTasks</strong> - List all tasks with optional filtering (AI-enhanced)</li>
              <li><strong>createTask</strong> - Create a new task with AI enhancement</li>
              <li><strong>updateTask</strong> - Update an existing task</li>
              <li><strong>deleteTask</strong> - Delete a task</li>
              <li><strong>getTaskAnalysis</strong> - Get AI-powered task analysis and recommendations</li>
              <li><strong>getTaskRecommendations</strong> - Get AI-powered next action suggestions</li>
            </ul>
            
            <h2>Integration</h2>
            <p>To connect an AI client, use the MCP endpoint: <code>http://localhost:${this.port}/mcp</code></p>
            
            <h2>AI Features</h2>
            <p>✨ <strong>Powered by Google Gemini AI</strong></p>
            <ul>
              <li>Automatic task enhancement and categorization</li>
              <li>Smart priority suggestions</li>
              <li>Complex task breakdown into subtasks</li>
              <li>Intelligent task analysis and recommendations</li>
              <li>Natural language task management</li>
            </ul>
          </div>
        </body>
        </html>
      `);
    });
  }

  async run() {
    this.app.listen(this.port, () => {
      console.log(`Task Master MCP HTTP server running on port ${this.port}`);
      console.log(`Visit http://localhost:${this.port} for server info`);
      console.log(`MCP endpoint: http://localhost:${this.port}/mcp`);
    });
  }
}

const server = new TaskMasterHTTPServer();
server.run().catch(console.error); 