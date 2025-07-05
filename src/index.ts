#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
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

class TaskMasterMCPServer {
  private server: Server;
  private taskManager: TaskManager;

  constructor() {
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

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "listTasks",
            description: "List all tasks with optional filtering by status, category, or priority. Enhanced with AI analysis.",
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
            description: "Create a new task with AI-enhanced description, category suggestion, and priority recommendation",
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
          {
            name: "getTaskAnalysis",
            description: "Get AI-powered analysis of all tasks with summary and next action recommendations",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "getTaskRecommendations",
            description: "Get AI-powered recommendations for next actions based on current tasks",
            inputSchema: {
              type: "object",
              properties: {},
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
          case "getTaskAnalysis":
            return await this.handleGetTaskAnalysis(args);
          case "getTaskRecommendations":
            return await this.handleGetTaskRecommendations(args);
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

  private async handleGetTaskAnalysis(args: any) {
    const analysis = await this.taskManager.getTaskAnalysis();
    return {
      content: [
        {
          type: "text",
          text: `Task Analysis:\n\n${analysis.summary}\n\nRecommended Next Actions:\n${analysis.nextActions.map(action => `• ${action}`).join('\n')}`,
        },
      ],
    };
  }

  private async handleGetTaskRecommendations(args: any) {
    const recommendations = await this.taskManager.getTaskRecommendations();
    return {
      content: [
        {
          type: "text",
          text: `AI-Powered Task Recommendations:\n\n${recommendations.map(rec => `• ${rec}`).join('\n')}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Task Master MCP server running on stdio");
  }
}

const server = new TaskMasterMCPServer();
server.run().catch(console.error); 