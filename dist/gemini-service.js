"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const axios_1 = __importDefault(require("axios"));
class GeminiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.client = axios_1.default.create({
            baseURL: "https://generativelanguage.googleapis.com/v1beta",
            timeout: 30000,
        });
    }
    async generateContent(prompt, temperature = 0.7) {
        try {
            const request = {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            };
            const response = await this.client.post(`/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`, request);
            if (response.data.candidates && response.data.candidates.length > 0) {
                return response.data.candidates[0].content.parts[0].text;
            }
            throw new Error("No response generated from Gemini API");
        }
        catch (error) {
            console.error("Error calling Gemini API:", error);
            throw new Error("Failed to generate content with Gemini API");
        }
    }
    async enhanceTaskDescription(taskDescription) {
        const prompt = `
As a task management assistant, enhance the following task description to make it more clear, actionable, and specific. 
Keep it concise but comprehensive. Only return the enhanced task description, nothing else.

Original task: "${taskDescription}"

Enhanced task:`;
        try {
            const enhanced = await this.generateContent(prompt, 0.3);
            return enhanced.trim();
        }
        catch (error) {
            console.error("Error enhancing task description:", error);
            return taskDescription; // Return original if enhancement fails
        }
    }
    async suggestTaskCategory(taskDescription) {
        const prompt = `
Based on the following task description, suggest the most appropriate category from these options:
- Development
- Documentation
- Testing
- Design
- Marketing
- Planning
- Research
- Bug Fix
- Feature
- Maintenance
- Other

Task: "${taskDescription}"

Category (respond with only one word):`;
        try {
            const category = await this.generateContent(prompt, 0.1);
            return category.trim();
        }
        catch (error) {
            console.error("Error suggesting task category:", error);
            return "Other";
        }
    }
    async suggestTaskPriority(taskDescription) {
        const prompt = `
Based on the following task description, suggest the priority level:
- high: Critical, urgent, blocking other work
- medium: Important but not urgent
- low: Nice to have, can be delayed

Task: "${taskDescription}"

Priority (respond with only: low, medium, or high):`;
        try {
            const priority = await this.generateContent(prompt, 0.1);
            const normalizedPriority = priority.trim().toLowerCase();
            if (["low", "medium", "high"].includes(normalizedPriority)) {
                return normalizedPriority;
            }
            return "medium"; // Default fallback
        }
        catch (error) {
            console.error("Error suggesting task priority:", error);
            return "medium";
        }
    }
    async generateTaskSummary(tasks) {
        const taskList = tasks.map(t => `- ${t.task} (${t.status}, ${t.priority} priority, ${t.category || 'No category'})`).join('\n');
        const prompt = `
Analyze the following task list and provide a brief summary including:
1. Total number of tasks
2. Status breakdown
3. Priority insights
4. Key focus areas
5. Recommendations

Tasks:
${taskList}

Summary:`;
        try {
            const summary = await this.generateContent(prompt, 0.5);
            return summary.trim();
        }
        catch (error) {
            console.error("Error generating task summary:", error);
            return "Unable to generate task summary at this time.";
        }
    }
    async suggestNextActions(tasks) {
        const taskList = tasks.map(t => `- ${t.task} (${t.status}, ${t.priority} priority, ${t.category || 'No category'})`).join('\n');
        const prompt = `
Based on the following task list, suggest 3-5 specific next actions that would be most valuable to focus on.
Consider task priorities, dependencies, and overall project flow.

Tasks:
${taskList}

Suggest next actions (one per line, start each with "- "):`;
        try {
            const suggestions = await this.generateContent(prompt, 0.6);
            return suggestions.trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim());
        }
        catch (error) {
            console.error("Error suggesting next actions:", error);
            return ["Review current task priorities", "Focus on high-priority items", "Check for any blockers"];
        }
    }
    async breakDownComplexTask(taskDescription) {
        const prompt = `
Break down the following complex task into smaller, actionable subtasks.
Each subtask should be specific and achievable.

Task: "${taskDescription}"

Subtasks (one per line, start each with "- "):`;
        try {
            const breakdown = await this.generateContent(prompt, 0.4);
            return breakdown.trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim());
        }
        catch (error) {
            console.error("Error breaking down task:", error);
            return [taskDescription]; // Return original task if breakdown fails
        }
    }
}
exports.GeminiService = GeminiService;
//# sourceMappingURL=gemini-service.js.map