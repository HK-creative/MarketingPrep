import axios, { AxiosInstance } from "axios";
import { GeminiService } from "./gemini-service.js";

export interface Task {
  id: number;
  task: string;
  status: "pending" | "started" | "done";
  category?: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  enhancedDescription?: string;
  aiSuggestions?: string[];
}

export interface TaskFilters {
  status?: "pending" | "started" | "done";
  category?: string;
  priority?: "low" | "medium" | "high";
}

export interface CreateTaskRequest {
  task: string;
  category?: string;
  priority?: "low" | "medium" | "high";
}

export interface UpdateTaskRequest {
  taskId: number;
  task?: string;
  status?: "pending" | "started" | "done";
  category?: string;
  priority?: "low" | "medium" | "high";
}

export class TaskManager {
  private client: AxiosInstance;
  private tasks: Task[] = []; // In-memory storage for demo purposes
  private geminiService: GeminiService;

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    // Initialize Gemini service
    this.geminiService = new GeminiService(apiKey);

    // Initialize with some sample tasks
    this.initializeSampleTasks();
  }

  private initializeSampleTasks() {
    this.tasks = [
      {
        id: 1,
        task: "Set up development environment",
        status: "done",
        category: "Development",
        priority: "high",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        task: "Write documentation",
        status: "started",
        category: "Documentation",
        priority: "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        task: "Review code changes",
        status: "pending",
        category: "Development",
        priority: "high",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  async listTasks(filters: TaskFilters = {}): Promise<Task[]> {
    try {
      // For demo purposes, using in-memory tasks
      // In production, this would make an API call to the external service
      let filteredTasks = [...this.tasks];

      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }

      if (filters.category) {
        filteredTasks = filteredTasks.filter(task => task.category === filters.category);
      }

      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }

      return filteredTasks;
    } catch (error) {
      console.error("Error listing tasks:", error);
      throw new Error("Failed to list tasks");
    }
  }

  async createTask(request: CreateTaskRequest): Promise<Task> {
    try {
      // Use AI to enhance task creation if not provided
      const enhancedDescription = await this.geminiService.enhanceTaskDescription(request.task);
      const suggestedCategory = request.category || await this.geminiService.suggestTaskCategory(request.task);
      const suggestedPriority = request.priority || await this.geminiService.suggestTaskPriority(request.task);
      
      // Break down complex tasks into subtasks
      const subtasks = await this.geminiService.breakDownComplexTask(request.task);
      
      const newTask: Task = {
        id: Math.max(...this.tasks.map(t => t.id), 0) + 1,
        task: request.task,
        status: "pending",
        category: suggestedCategory,
        priority: suggestedPriority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enhancedDescription,
        aiSuggestions: subtasks.length > 1 ? subtasks : undefined,
      };

      this.tasks.push(newTask);
      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      // Fallback to basic task creation if AI enhancement fails
      const basicTask: Task = {
        id: Math.max(...this.tasks.map(t => t.id), 0) + 1,
        task: request.task,
        status: "pending",
        category: request.category,
        priority: request.priority || "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.tasks.push(basicTask);
      return basicTask;
    }
  }

  async updateTask(request: UpdateTaskRequest): Promise<Task> {
    try {
      const taskIndex = this.tasks.findIndex(t => t.id === request.taskId);
      
      if (taskIndex === -1) {
        throw new Error(`Task with ID ${request.taskId} not found`);
      }

      const updatedTask: Task = {
        ...this.tasks[taskIndex],
        ...request,
        id: request.taskId, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
      };

      this.tasks[taskIndex] = updatedTask;
      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  }

  async deleteTask(taskId: number): Promise<void> {
    try {
      const taskIndex = this.tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      this.tasks.splice(taskIndex, 1);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  }

  // Method to get task statistics
  async getTaskStats(): Promise<{ total: number; pending: number; started: number; done: number }> {
    const stats = {
      total: this.tasks.length,
      pending: this.tasks.filter(t => t.status === "pending").length,
      started: this.tasks.filter(t => t.status === "started").length,
      done: this.tasks.filter(t => t.status === "done").length,
    };

    return stats;
  }

  // AI-powered task analysis
  async getTaskAnalysis(): Promise<{ summary: string; nextActions: string[] }> {
    try {
      const summary = await this.geminiService.generateTaskSummary(this.tasks);
      const nextActions = await this.geminiService.suggestNextActions(this.tasks);
      
      return {
        summary,
        nextActions,
      };
    } catch (error) {
      console.error("Error generating task analysis:", error);
      return {
        summary: "Unable to generate task analysis at this time.",
        nextActions: ["Review current tasks", "Prioritize high-impact items"],
      };
    }
  }

  // Get AI-powered task recommendations
  async getTaskRecommendations(): Promise<string[]> {
    try {
      return await this.geminiService.suggestNextActions(this.tasks);
    } catch (error) {
      console.error("Error getting task recommendations:", error);
      return ["Focus on high-priority tasks", "Review pending items"];
    }
  }
} 