# Architecture Overview

The **Smart Incident Tracker** follows a **Clean Architecture** and **Domain-Driven Design (DDD)** approach to ensure scalability, testability, and a clear separation of concerns.

## 📂 Folder Structure

```text
src/
├── app/            # Application-wide setup (Providers, Routes)
├── components/     # Reusable UI components
│   ├── layout/     # Page layouts, headers, tabs
│   ├── incidents/  # Incident-specific components (Cards, Badges)
│   └── ui/         # Base UI primitives (Loaders, Empty states)
├── hooks/          # Custom React hooks (React Query, Geolocation)
├── models/         # TypeScript interfaces and domain types
├── pages/          # Full page components
├── services/       # External API & Supabase logic (Infrastructure layer)
├── styles/         # Global styles and Tailwind configuration
└── utils/          # Pure utility functions and constants
```

## 🏗 Key Patterns

### 1. Service Layer
All external communication (Supabase, Auth) is encapsulated in the `services/` directory. UI components never call Supabase directly; they use hooks that consume these services.

### 2. Hook-Based Data Fetching
We use **React Query** for all server-state management. This provides caching, loading states, and automatic synchronization without the complexity of Redux.

### 3. Styled with Utility-First CSS
Tailwind CSS is used for custom layouts and micro-spacing, while Ionic CSS variables manage the overall theme (colors, fonts) for a native mobile feel.

### 4. Hybrid Data Strategy
Services are designed to work in two modes:
- **Supabase Mode**: When valid credentials are found in `.env`.
- **Mock Mode**: Falls back to local memory storage for rapid prototyping or if the backend is unavailable.
