import type { Task, AITaskSuggestion, WeatherData, NewsArticle, Quote } from "@/types";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review project requirements",
    description: "Go through the spec and align with stakeholders",
    completed: true,
    priority: "high",
    dueDate: "2025-03-04",
    createdAt: "2025-03-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Implement API routes",
    description: "Create /api/tasks and /api/ai-tasks",
    completed: false,
    priority: "high",
    dueDate: "2025-03-06",
    createdAt: "2025-03-02T09:00:00Z",
  },
  {
    id: "3",
    title: "Add unit tests",
    description: "Cover critical paths with Jest",
    completed: false,
    priority: "medium",
    dueDate: "2025-03-08",
    createdAt: "2025-03-03T14:00:00Z",
  },
];

export const mockAITasks: AITaskSuggestion[] = [
  { id: "ai-1", title: "Block 2 hours for deep work", reason: "Your calendar has fewer meetings today", priority: "high" },
  { id: "ai-2", title: "Review pull requests", reason: "3 PRs are waiting for your review", priority: "medium" },
  { id: "ai-3", title: "Update documentation", reason: "Docs are 2 weeks behind code changes", priority: "medium" },
  { id: "ai-4", title: "Schedule 1:1 with team", reason: "No 1:1s in the last 2 weeks", priority: "low" },
  { id: "ai-5", title: "Backup and clean local branches", reason: "Improve repo hygiene", priority: "low" },
];

export const mockWeather: WeatherData = {
  city: "London",
  temp: 12,
  condition: "Partly cloudy",
  icon: "02d",
  humidity: 65,
  windSpeed: 4.2,
};

export const mockNews: NewsArticle[] = [
  { title: "Tech industry sees record growth in Q1", source: "Tech News", url: "#", publishedAt: "2025-03-05T10:00:00Z" },
  { title: "New AI tools for developers", source: "Dev Weekly", url: "#", publishedAt: "2025-03-05T09:00:00Z" },
  { title: "Remote work trends in 2025", source: "Workplace", url: "#", publishedAt: "2025-03-04T18:00:00Z" },
  { title: "Productivity hacks that actually work", source: "Lifehack", url: "#", publishedAt: "2025-03-04T12:00:00Z" },
  { title: "Open source contributions on the rise", source: "OSS Daily", url: "#", publishedAt: "2025-03-03T14:00:00Z" },
];

export const mockQuote: Quote = {
  content: "The only way to do great work is to love what you do.",
  author: "Steve Jobs",
};
