export interface GeminiRequest {
    contents: Array<{
        parts: Array<{
            text: string;
        }>;
    }>;
    generationConfig?: {
        temperature?: number;
        topK?: number;
        topP?: number;
        maxOutputTokens?: number;
    };
}
export interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
        finishReason: string;
    }>;
}
export declare class GeminiService {
    private client;
    private apiKey;
    constructor(apiKey: string);
    generateContent(prompt: string, temperature?: number): Promise<string>;
    enhanceTaskDescription(taskDescription: string): Promise<string>;
    suggestTaskCategory(taskDescription: string): Promise<string>;
    suggestTaskPriority(taskDescription: string): Promise<"low" | "medium" | "high">;
    generateTaskSummary(tasks: Array<{
        task: string;
        status: string;
        priority: string;
        category?: string;
    }>): Promise<string>;
    suggestNextActions(tasks: Array<{
        task: string;
        status: string;
        priority: string;
        category?: string;
    }>): Promise<string[]>;
    breakDownComplexTask(taskDescription: string): Promise<string[]>;
}
//# sourceMappingURL=gemini-service.d.ts.map