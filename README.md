# MICA Web App

A web application made using nextjs for monitoring water usage in private households in Barcelona.

## Overview

This project follows a simplified Clean Architecture:

- **Core:** Contains domain entities, repositories, services, and use cases.
- **Infrastructure:** Manages data access, external APIs, and persistence.
- **Interface (src):** The presentation layer built with Next.js (App Router).

_Note: While our presentation layer is in the `src` folder (to conform with Next.js conventions), it represents our "interface" layer._

## Tech Stack

- **Next.js 14.2.4 (App Router):** Modern routing with server and client-side rendering.
- **Tailwind CSS:** Styling.
- **Shadcn:** UI components.
- **next-intl:** Internationalization support.
- **zod:** Schema validation.
- **zustand:** Global state management.
- **Prettier & ESLint:** Code formatting and linting.

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Run the development server:**

```bash
npm run dev
```
