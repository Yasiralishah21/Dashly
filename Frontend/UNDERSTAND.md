# UNDERSTAND – AI Productivity Dashboard

This file documents **every file** in the project, **which file shows what UI**, and **how files connect** (flow). Use it to understand the codebase.

---

## Table of Contents

1. [Project Structure – Every File](#1-project-structure--every-file)
2. [Which File Shows What UI](#2-which-file-shows-what-ui)
3. [Flow: How Files Relate to Each Other](#3-flow-how-files-relate-to-each-other)

---

## 1. Project Structure – Every File

```
ai-dashboard/
├── app/                              # Next.js App Router (routes + API)
│   ├── layout.tsx                    # Root layout: providers, sidebar, main area
│   ├── page.tsx                      # Home route (/) – renders Home component
│   ├── globals.css                   # Global styles, Tailwind, button classes, marquee
│   │
│   ├── tasks/
│   │   ├── page.tsx                  # Full tasks list page (/tasks)
│   │   └── [id]/
│   │       ├── layout.tsx           # Layout for task detail (metadata only)
│   │       └── page.tsx              # Single task detail/edit page (/tasks/123)
│   │
│   ├── stats/
│   │   └── page.tsx                  # Statistics page (/stats) – chart + summary
│   │
│   └── api/                          # Backend API routes
│       ├── ai-tasks/route.ts         # GET – mock AI task suggestions
│       ├── news/route.js             # GET – news by city (NewsAPI)
│       ├── quote/route.js            # GET – random quote (Quotable)
│       ├── stats/route.ts            # GET – task stats
│       ├── tasks/route.ts            # GET/POST – list/create tasks
│       ├── tasks/[id]/route.ts       # GET/PATCH/DELETE – one task
│       └── weather/route.js          # GET – weather by city (OpenWeatherMap)
│
├── components/                       # React UI components
│   ├── Home.tsx                      # Main flow: prompt → task input → dashboard
│   ├── Dashboard.tsx                 # Dashboard grid: tasks, weather, stats, news
│   ├── LoginPage.tsx                 # Login/signup form (demo credentials)
│   ├── QuickAddMarquee.tsx           # Scrolling quick-add task chips
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx               # Left nav: logo, Dashboard/Tasks/Stats + task list
│   │   ├── Header.tsx                # Top bar: title, theme toggle, user, logout
│   │   ├── HeaderWrapper.tsx         # Shows Header only on route "/"
│   │   ├── DashboardLayout.tsx      # Wrapper: Header + padding for /tasks, /stats, /tasks/[id]
│   │   └── AuthLayout.tsx            # If not logged in → LoginPage; else → children
│   │
│   ├── widgets/
│   │   ├── TaskWidget.tsx            # Tasks card on dashboard (filter, sort, add, list)
│   │   ├── WeatherWidget.tsx         # Weather card (city, temp, condition)
│   │   ├── NewsWidget.tsx            # Headlines card (expandable list)
│   │   ├── StatsWidget.tsx           # Completed/total tasks card
│   │   └── AISuggestionWidget.tsx    # Short AI-style tip based on tasks
│   │
│   └── stats/
│       └── TasksChart.tsx            # Chart: completed vs pending tasks
│
├── context/                          # React Context (global state)
│   ├── AuthContext.tsx               # user, login(), logout() – demo auth
│   ├── ThemeContext.tsx               # theme, setTheme, resolvedTheme – light/dark
│   ├── TasksContext.tsx               # phase, tasks, setTasks, toggleTask, selectedCity
│   └── SidebarContext.tsx             # open, setOpen, toggle – mobile sidebar
│
├── lib/                              # Utilities and helpers
│   ├── dateUtils.ts                  # formatDueDate, todayISO, getDueCategory
│   ├── taskFilterSort.ts             # getFilteredAndSortedTasks, filter/sort types
│   ├── categories.ts                 # TASK_CATEGORIES, getCategoryById
│   ├── suggestedTasks.ts             # SUGGESTED_DAILY_TASKS (quick-add list)
│   ├── tasksStore.ts                 # In-memory task store for API routes
│   └── mockData.ts                   # Mock data (e.g. mockTasks for tasksStore)
│
├── types/
│   ├── dashboard.ts                  # Task, TaskPriority, SetTasksAction, DashboardPhase
│   └── index.ts                      # Task, AITaskSuggestion, WeatherData, NewsArticle, Quote
│
├── next.config.ts                    # Next.js config (e.g. images)
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript config
├── README.md                         # Main project readme
└── UNDERSTAND.md                     # This file – full file list, UI map, flow
```

---

## 2. Which File Shows What UI

| What you see on screen | File(s) that render it |
|------------------------|-------------------------|
| **Login / Sign up form** (username, password, Gmail button) | `components/LoginPage.tsx` |
| **Left sidebar** (logo, Dashboard, Add a task, Stats, “My tasks” list) | `components/layout/Sidebar.tsx` |
| **Top bar** (title, theme toggle, user name, Log out) | `components/layout/Header.tsx` (used by `HeaderWrapper.tsx` on `/` and by `DashboardLayout.tsx` on other routes) |
| **First screen after login** – “Do you want AI task suggestions?” (Yes/No) + city input | `components/Home.tsx` (phase `"prompt"`) |
| **Task input screen** – “Enter your daily tasks” + inputs + quick-add chips + list | `components/Home.tsx` (phase `"input"`) |
| **Main dashboard** – “Dashboard” title + AI suggestion + Tasks card + Weather + Stats + News | `components/Dashboard.tsx` (from `Home.tsx` when phase is `"dashboard"`) |
| **Tasks card on dashboard** – title, Add task, filter/sort, Overdue / Due today / Upcoming / No deadline | `components/widgets/TaskWidget.tsx` |
| **Weather card** – city, temperature, condition | `components/widgets/WeatherWidget.tsx` |
| **Task stats card** – “X / Y completed” or empty state | `components/widgets/StatsWidget.tsx` |
| **News / Headlines card** – list of headlines, Show more/less | `components/widgets/NewsWidget.tsx` |
| **AI Suggestion card** – short tip based on tasks | `components/widgets/AISuggestionWidget.tsx` |
| **Scrolling quick-add chips** (Check emails, Exercise, …) | `components/QuickAddMarquee.tsx` (used inside `Home.tsx` and `app/tasks/page.tsx`) |
| **Full Tasks page** (/tasks) – Add task, quick-add, filter/sort, grouped task list | `app/tasks/page.tsx` + `components/layout/DashboardLayout.tsx` |
| **Single task page** (/tasks/[id]) – title, description, Edit/Save/Cancel, Mark complete, Delete | `app/tasks/[id]/page.tsx` + `DashboardLayout.tsx` |
| **Stats page** (/stats) – chart + productivity summary | `app/stats/page.tsx` (loads `components/stats/TasksChart.tsx`) + `DashboardLayout.tsx` |
| **Root layout** – sidebar + main area (and who gets header) | `app/layout.tsx` + `HeaderWrapper.tsx` |
| **Global styles** – Tailwind, dark mode, buttons, marquee animation | `app/globals.css` |

### Route → main UI

| Route | Main content |
|-------|--------------|
| `/` | `app/page.tsx` → `Home.tsx` (prompt / task input / **Dashboard**) |
| `/tasks` | `app/tasks/page.tsx` (full task list) |
| `/tasks/[id]` | `app/tasks/[id]/page.tsx` (task detail) |
| `/stats` | `app/stats/page.tsx` (chart + summary) |

---

## 3. Flow: How Files Relate to Each Other

### 3.1 App entry and layout

```
app/layout.tsx
  ├── ThemeProvider (context/ThemeContext.tsx)
  ├── SidebarProvider (context/SidebarContext.tsx)
  ├── TasksProvider (context/TasksContext.tsx)
  ├── AuthProvider (context/AuthContext.tsx)
  └── AuthLayout (components/layout/AuthLayout.tsx)
        ├── if !user → LoginPage (components/LoginPage.tsx)
        └── if user →
              ├── Sidebar (components/layout/Sidebar.tsx)  ← uses useTasks(), useSidebar()
              └── <main>
                    ├── HeaderWrapper (components/layout/HeaderWrapper.tsx)
                    │     └── if pathname === "/" → Header (components/layout/Header.tsx)
                    └── {children}  ← current route page
```

### 3.2 Home route (/)

```
app/page.tsx
  └── Home (components/Home.tsx)  ← uses useTasks()
        ├── if phase === "prompt"   → UI: Yes/No + city input
        ├── if phase === "input"    → UI: task form + QuickAddMarquee + task list + Done
        └── if phase === "dashboard" → Dashboard (components/Dashboard.tsx)
              ├── AISuggestionWidget (components/widgets/AISuggestionWidget.tsx)
              ├── TaskWidget (components/widgets/TaskWidget.tsx)     ← tasks, setTasks, toggleTask
              ├── WeatherWidget (components/widgets/WeatherWidget.tsx) ← selectedCity
              ├── StatsWidget (components/widgets/StatsWidget.tsx)   ← tasks
              └── NewsWidget (components/widgets/NewsWidget.tsx)     ← selectedCity
```

### 3.3 Tasks route (/tasks)

```
app/tasks/page.tsx
  └── DashboardLayout (components/layout/DashboardLayout.tsx)
        ├── Header (title "Tasks", subtitle)
        └── Tasks page UI
              ├── Add task button + form
              ├── QuickAddMarquee (lib/suggestedTasks.ts)
              └── Filter/sort + grouped list (uses getFilteredAndSortedTasks from lib/taskFilterSort.ts)
```

- **Data:** `useTasks()` from `context/TasksContext.tsx` (same `tasks` as Dashboard and Sidebar).

### 3.4 Task detail route (/tasks/[id])

```
app/tasks/[id]/layout.tsx  → metadata only
app/tasks/[id]/page.tsx
  └── DashboardLayout
        └── Task detail: from TasksContext or fetch app/api/tasks/[id]/route.ts
```

- **Data:** Task from `tasks.find(id)` (TasksContext) or from API `app/api/tasks/[id]/route.ts`.

### 3.5 Stats route (/stats)

```
app/stats/page.tsx
  └── DashboardLayout
        └── TasksChart (components/stats/TasksChart.tsx) + summary text
```

- **Data:** `useTasks()` for chart data.

### 3.6 Sidebar

```
components/layout/Sidebar.tsx
  ├── usePathname() → active link
  ├── useSidebar()  → open/toggle (mobile)
  └── useTasks()    → phase, tasks, toggleTask → "My tasks" list + checkboxes
```

### 3.7 API routes used by the UI

| API route | Used by |
|-----------|--------|
| `GET /api/weather?city=` | Home (city submit), WeatherWidget |
| `GET /api/news?city=` | NewsWidget |
| `GET /api/quote` | (Optional) QuoteWidget |
| `GET /api/ai-tasks` | (Optional) AITaskSuggestions |
| `GET/POST /api/tasks` | (Optional) tasks API |
| `GET/PATCH/DELETE /api/tasks/[id]` | Task detail page (when task not in context) |
| `GET /api/stats` | (Optional) stats |

### 3.8 Shared types and lib – who uses what

| File | Used by |
|------|--------|
| `types/dashboard.ts` | Task, phase, priority – Home, Dashboard, TaskWidget, Tasks page, Task detail, TasksContext |
| `lib/dateUtils.ts` | formatDueDate, getDueCategory – TaskWidget, tasks page, task detail, Sidebar |
| `lib/taskFilterSort.ts` | getFilteredAndSortedTasks – TaskWidget, tasks page |
| `lib/categories.ts` | TASK_CATEGORIES, getCategoryById – Home, TaskWidget, tasks page, task detail, Sidebar |
| `lib/suggestedTasks.ts` | SUGGESTED_DAILY_TASKS – Home, QuickAddMarquee, tasks page |

### 3.9 Summary diagram

```
User opens app
    → layout.tsx (providers + AuthLayout)
        → Not logged in? → LoginPage.tsx
        → Logged in?    → Sidebar + HeaderWrapper + children

children = route:
    /         → page.tsx → Home.tsx (prompt → input → Dashboard)
    /tasks    → tasks/page.tsx (full list + DashboardLayout)
    /tasks/id → tasks/[id]/page.tsx (detail + DashboardLayout)
    /stats    → stats/page.tsx (chart + DashboardLayout)

Dashboard.tsx = TaskWidget + WeatherWidget + StatsWidget + NewsWidget + AISuggestionWidget
All task data flows from TasksContext (phase, tasks, selectedCity, setTasks, toggleTask).
```

---

*This document is for understanding the project. For running the app, see README.md.*
