#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const dotenv_1 = __importDefault(require("dotenv"));
const task_manager_js_1 = require("./task-manager.js");
// Load environment variables
dotenv_1.default.config();
// Validate required environment variables
const requiredEnvVars = ["GEMINI_API_KEY"];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}
class TaskMasterMCPServer {
    constructor() {
        this.server = new index_js_1.Server({
            name: "task-master-mcp",
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.taskManager = new task_manager_js_1.TaskManager(process.env.TASK_MANAGER_API_BASE_URL || "https://generativelanguage.googleapis.com/v1beta", process.env.GEMINI_API_KEY);
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
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
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
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
                        throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
                }
            }
            catch (error) {
                if (error instanceof types_js_1.McpError) {
                    throw error;
                }
                throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    async handleListTasks(args) {
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
    async handleCreateTask(args) {
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
    async handleUpdateTask(args) {
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
    async handleDeleteTask(args) {
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
    async handleGetTaskAnalysis(args) {
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
    async handleGetTaskRecommendations(args) {
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
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error("Task Master MCP server running on stdio");
    }
}
const server = new TaskMasterMCPServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map