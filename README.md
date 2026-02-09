# Smart Incident Tracker

A mobile-first incident management application built with **Ionic React**, **Capacitor**, and **Supabase**. Designed for field technicians to efficiently report and track incidents with real-time geolocation support.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+ 
- **Ionic CLI**: `npm install -g @ionic/cli`
- **Supabase Account**: A project for the backend.

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd smart-incident-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. **Run Development Server**:
   ```bash
   ionic serve
   ```

---

## 🛠 Tech Stack

- **Framework**: [Ionic React](https://ionicframework.com/docs/react)
- **Runtime**: [Capacitor](https://capacitorjs.com/) (Native Mobile APIs)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Ionic CSS Variables
- **State Management**: [React Query](https://tanstack.com/query/latest) (Server state)
- **Backend**: [Supabase](https://supabase.com/) (Auth, Postgres, RLS)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 📖 Documentation

For detailed information about the project structure and implementation details, refer to the following guides:

1. [**Architecture Overview**](./docs/architecture.md): Understanding the domain-driven design and folder structure.
2. [**Authentication & Security**](./docs/auth-security.md): How silent technical login and Supabase RLS policies work.
3. [**Geolocation System**](./docs/geolocation.md): Implementation details of the `useGeolocation` hook.
4. [**Data Models**](./docs/models.md): Overview of the incident and user schemas.

---

## 📱 Mobile Deployment

### Android
```bash
ionic cap add android
ionic cap run android
```

### iOS
```bash
ionic cap add ios
ionic cap run ios
```

---

## 📄 License
MIT
