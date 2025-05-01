# 💧 MICA APP

**MICA APP** is a fullstack web application built by [mica.eco](https://mica.eco) to help households and communities **track water consumption** and **categorize usage** across different activities (e.g. shower, dishwasher, toilet, etc.).

> Built with ❤️ by [mica.eco](https://mica.eco) — technology for sustainable living.

## 🌱 What is MICA?

MICA is a smart water tracking ecosystem that empowers people to reduce water waste by:

- Monitoring real-time and historical water usage
- Categorizing consumption (e.g. shower vs. dishwasher)
- Linking events with tags and sensors
- Providing actionable insights for more sustainable habits

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Fullstack)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle or Prisma (plug-and-play via repository interfaces)
- **Architecture**: Clean Architecture (Entities, Repositories, Use Cases)
- **UI**: Tailwind CSS

## 🧱 Folder Overview

The folder structure is designed to follow 'some' of the principles of Clean Architecture, separating concerns and promoting maintainability. Here's a brief overview of the main folders:

- **src**: Contains all of the code for the presentation layer of the application:
- **core**: Contains the core business logic, including entities, use cases, repositories and services.
- **infrastructure**: Contains the implementation of the repositories and services, as well as the database connection and migrations.

## ✅ Features

- Track individual water usage events (start, end, volume)
- Tag events by category (shower, kitchen, etc.)
- View usage history and trends
- Clean, modular architecture
- Ready to plug into MICA hardware sensors

## 🚀 Getting Started

Clone the repo

```bash
git clone https://github.com/micaeco/mica-app.git
cd mica-app
```

Install dependencies

```bash
npm install
```

Set up environment variables

```bash
cp .env.example .env
```

Run the app locally

```bash
npm run dev
```

## ⚙️ Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Run linter
```

## 📦 Deployment

MICA APP can be deployed to:

- Vercel (recommended for Next.js)
- Docker
- Your own server

Configure environment variables and database access accordingly.

## 👥 Contributing

We welcome contributions from sustainability-focused developers!
Please check out our CONTRIBUTING.md and open an issue or PR.

## 📄 License

MIT
