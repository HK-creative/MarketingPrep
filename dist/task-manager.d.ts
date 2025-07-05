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
export declare class TaskManager {
    private client;
    private tasks;
    private geminiService;
    constructor(baseURL: string, apiKey: string);
    private initializeSampleTasks;
    listTasks(filters?: TaskFilters): Promise<Task[]>;
    createTask(request: CreateTaskRequest): Promise<Task>;
    updateTask(request: UpdateTaskRequest): Promise<Task>;
    deleteTask(taskId: number): Promise<void>;
    getTaskStats(): Promise<{
        total: number;
        pending: number;
        started: number;
        done: number;
    }>;
    getTaskAnalysis(): Promise<{
        summary: string;
        nextActions: string[];
    }>;
    getTaskRecommendations(): Promise<string[]>;
}
//# sourceMappingURL=task-manager.d.ts.map