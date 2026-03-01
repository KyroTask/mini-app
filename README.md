# KyroTask — Mini App (Frontend)

> Vue 3 Telegram Mini App frontend for [KyroTask](https://github.com/KyroTask/KyroTask) — a premium productivity ecosystem and habit tracker.

[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Telegram](https://img.shields.io/badge/Telegram%20Mini%20App-2CA5E0?style=flat-square&logo=telegram&logoColor=white)](https://core.telegram.org/bots/webapps)

---

## Overview

This is the frontend application for KyroTask, built as a **Telegram Mini App** using Vue 3. It communicates with the [KyroTask backend](https://github.com/KyroTask/internal) via REST API and WebSocket.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Vue 3](https://vuejs.org) | 3.x | UI framework (Composition API) |
| [Vite](https://vitejs.dev) | 7.x | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 3.x | Utility-first styling |
| [Pinia](https://pinia.vuejs.org) | 3.x | State management |
| [Vue Router](https://router.vuejs.org) | 4.x | Client-side routing |
| [Axios](https://axios-http.com) | 1.x | HTTP client |
| [@telegram-apps/sdk](https://docs.telegram-mini-apps.com) | 3.x | Telegram WebApp integration |
| [Firebase](https://firebase.google.com) | 12.x | Google auth |

---

## Project Structure

```text
mini-app/
├── src/
│   ├── pages/               # Route-level page components
│   │   ├── Dashboard.vue    # Main dashboard
│   │   ├── Tasks.vue        # Task list & management
│   │   ├── TaskDetail.vue   # Single task view
│   │   ├── Projects.vue     # Projects list
│   │   ├── ProjectDetail.vue
│   │   ├── Goals.vue        # Goal tracking
│   │   ├── GoalDetail.vue
│   │   ├── Habits.vue       # Habit tracker
│   │   ├── Pomodoro.vue     # Focus timer
│   │   ├── Analytics.vue    # Reports & insights
│   │   ├── Calendar.vue     # Calendar view
│   │   ├── Activity.vue     # Activity feed
│   │   ├── Settings.vue     # User settings
│   │   └── Login.vue        # Auth page
│   ├── components/          # Reusable UI components
│   ├── layouts/             # Layout wrappers (MainLayout)
│   ├── stores/              # Pinia stores (tasks, projects, goals...)
│   ├── router/              # Vue Router config
│   ├── services/
│   │   └── api.js           # Axios API client
│   └── utils/
│       └── firebase.js      # Firebase config
├── public/
│   └── logo.png
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- KyroTask backend running on `http://localhost:3001`

### Installation

```bash
git clone https://github.com/KyroTask/mini-app.git
cd mini-app
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Development

```bash
npm run dev
```

Dev server starts at `http://localhost:5173`. API requests to `/api` are proxied to `http://localhost:3001`.

### Build for Production

```bash
npm run build
```

Output is in `dist/`. The Go backend serves these static files in production.

### Preview Production Build

```bash
npm run preview
```

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Overview of tasks, habits, and focus stats |
| `/tasks` | Tasks | Full task list with filters |
| `/tasks/:id` | Task Detail | Subtasks, comments, metadata |
| `/projects` | Projects | Projects with progress tracking |
| `/projects/:id` | Project Detail | Project tasks and milestones |
| `/goals` | Goals | Goal progress overview |
| `/goals/:id` | Goal Detail | Individual goal tracking |
| `/habits` | Habits | Daily habits and streaks |
| `/pomodoro` | Pomodoro | Focus timer with XP leveling |
| `/analytics` | Analytics | Productivity reports and charts |
| `/calendar` | Calendar | Tasks by due date |
| `/activity` | Activity | Recent activity feed |
| `/settings` | Settings | User preferences |

---

## Related

- [KyroTask/KyroTask](https://github.com/KyroTask/KyroTask) — Main monorepo
- [KyroTask/internal](https://github.com/KyroTask/internal) — Go backend API

---

## License

MIT © [KyroTask](https://github.com/KyroTask)
