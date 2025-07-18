# MICA APP

**MICA APP** is a fullstack web application built by [mica.eco](https://mica.eco) to help households and communities **track water consumption** and **track where the consumption happens** (e.g. shower, dishwasher, toilet, etc.).

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Fullstack)
- **Language**: TypeScript
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Forms**: React Hook Form
- **Validation**: Zod
- **Global State**: Zustand
- **Data Fetching**: React Query
- **Typesafe API**: tRPC
- **Email**: AWS SES
- **Cloud Services**: AWS
- **Internationalization**: next-intl

## 🧱 Architecture & Folder Structure

The folder structure follows Clean Architecture principles, separating concerns and promoting maintainability:

```
src/
├── adapters/          # External interfaces (tRPC routers, auth adapters)
├── app/              # Next.js app router (pages, layouts, components)
├── di/               # Dependency injection container
├── domain/           # Business logic & entities
│   ├── entities/     # Domain entities (User, Household, Event, etc.)
│   ├── repositories/ # Repository interfaces
│   └── services/     # Service interfaces
├── infrastructure/   # External implementations
│   ├── db/          # Database schema, migrations, connection
│   ├── repositories/ # Repository implementations
│   └── services/     # Service implementations (email, etc.)
└── env.ts           # Environment variable validation
```

### Key architectural principles:

- **Domain layer**: Contains pure business logic, independent of frameworks
- **Infrastructure layer**: Implements domain interfaces with external dependencies
- **Application layer**: Orchestrates use cases via tRPC routers
- **Presentation layer**: Next.js app router with React components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or use Docker Compose)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/micaeco/mica-app.git
cd mica-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.development.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mica_db"
DATABASE_URL_UNPOOLED="postgresql://username:password@localhost:5432/mica_db"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS (for production features)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_API_GATEWAY_URL="your-api-gateway-url"
AWS_API_GATEWAY_TOKEN="your-api-gateway-token"

# App URL
NEXT_PUBLIC_URL="http://localhost:3000"
```

4. **Start the database**

Using Docker Compose (recommended for development):

```bash
# Make sure to set your database environment variables in .env.development.local first
docker-compose up -d
```

Or set up your own PostgreSQL instance and update the DATABASE_URL accordingly.

5. **Run database migrations**

```bash
npm run db:migrate
```

6. **Start the development server**

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## ⚙️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Build and start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format:check # Check code formatting with Prettier
npm run format:write # Format code with Prettier
npm run typecheck    # Run TypeScript type checking
npm run check        # Run both lint and typecheck

# Database
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 🗄️ Database Management

This project uses PostgreSQL with Drizzle ORM. The database schema is defined in `src/infrastructure/db/schema/`.

### Key commands:

- `npm run db:studio` - Opens a web-based database browser
- `npm run db:generate` - Creates migration files after schema changes
- `npm run db:migrate` - Applies pending migrations to the database
- `npm run db:push` - Pushes schema changes directly (development only)

## 🔧 Troubleshooting

### Common Issues

**Database connection errors:**

- Ensure PostgreSQL is running (`docker-compose up -d`)
- Check that DATABASE_URL in `.env.development.local` is correct
- Run `npm run db:migrate` to ensure schema is up to date

**Build/TypeScript errors:**

- Run `npm run typecheck` to see specific type errors
- Ensure all environment variables are properly set

**Authentication issues:**

- Make sure BETTER_AUTH_SECRET is set in your environment variables
- Check that BETTER_AUTH_URL matches your development URL

**Missing dependencies:**

- Delete `node_modules` and `package-lock.json`, then run `npm install`

## 🚢 Deployment

The application is designed to be deployed on platforms like Vercel, but can be deployed anywhere that supports Node.js applications.

### Environment Variables for Production

Ensure all required environment variables from the Getting Started section are configured in your deployment platform.

### Database Migrations

Remember to run database migrations in your production environment:

```bash
npm run db:migrate
```

## 👥 Contributing

We welcome contributions from sustainability-focused developers!
Please check out our CONTRIBUTING.md and open an issue or PR.

## 📄 License

MIT
