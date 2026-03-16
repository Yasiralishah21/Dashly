export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
}

export interface AITaskSuggestion {
  id: string;
  title: string;
  reason: string;
  priority: "low" | "medium" | "high";
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
}

export interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt?: string;
}

export interface Quote {
  content: string;
  author: string;
}
