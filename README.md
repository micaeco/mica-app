# 💧 MICA APP

**MICA APP** is a fullstack web application built by [mica.eco](https://mica.eco) to help households and communities **track water consumption** and **track where the consumption happens** (e.g. shower, dishwasher, toilet, etc.).

> Built with ❤️ by [mica.eco](https://mica.eco) — technology for sustainable living.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Fullstack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Global State**: Zustand

## 🧱 Folder Overview

The folder structure is designed to follow 'some' of the principles of Clean Architecture, separating concerns and promoting maintainability. Here's a brief overview of the main src folder:

- **domain**: Contains all of the entities for the domain, as well as the interfaces for both the repositories and services.
- **infrastructure**: Implementations of all of the repositories and services interfaces defined in the domain.
- **presentation**: Contains all of the presentation related components, like react components, react hooks, stores and more.
- **app**: This directory is the entrypoint of the application. In this case, since we are using nextjs, this represents the app router root directory.

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

## 👥 Contributing

We welcome contributions from sustainability-focused developers!
Please check out our CONTRIBUTING.md and open an issue or PR.

## 📄 License

MIT
