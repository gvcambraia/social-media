# Social Media Platform

A social media platform built with Next.js, featuring posts, reposts, infinite scroll, and a modern dark UI.

## Features

### Core Functionality

- **Create Posts**: Create text posts up to 777 characters
- **Repost System**: Repost other users' posts (original posts only, no re-reposting)
- **User Management**: Switch between users with persistent localStorage selection
- **Feed Display**: View all posts and reposts in a unified feed

### Smart Limitations

- **Daily Post Limit**: Maximum 5 posts per day per user (includes both posts and reposts)
- **Duplicate Prevention**: Cannot repost the same post twice
- **Confirmation Dialogs**: User confirmation required before reposting or switching users

### Feed Features

- **Sorting Options**:
  - **Latest**: Sort by most recent posts
  - **Trending**: Sort by number of reposts (most reposted first)
- **Search**: Exact match search that filters original posts only
- **Infinite Scroll**: Initial load of 15 posts, then 20 more posts per scroll

### UI/UX

- **Modern Dark Theme**: Clean, minimalist dark interface
- **Responsive Layout**: Organized layout with sidebar and main feed
- **User Avatars**: Automatic avatar generation with user initials
- **Relative Timestamps**: "42 minutes ago" style timestamps using dayjs
- **Repost Indicators**: Visual indicators showing who reposted content

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Database**: PostgreSQL with Prisma ORM 7.4.0
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: React Context API + localStorage
- **Date Handling**: dayjs with relative time plugin
- **UI Components**: shadcn/ui (Card, Dialog, Button, Select, Input, Textarea)

## Prerequisites

- Node.js 20+ (or compatible version)
- PostgreSQL database (local or remote)
- npm, yarn, pnpm, or bun package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd social-media
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Database

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/social_media?schema=public"
```

Replace `user`, `password`, `localhost:5432`, and `social_media` with your PostgreSQL credentials.

### 4. Setup Database

Run Prisma migrations to create the database schema:

```bash
npm run prisma:migrate
```

### 5. (Optional) Seed the Database

To populate the database with sample users and posts:

```bash
npm run prisma:seed
```

## Running the Project

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Database Management

- **Prisma Studio** (visual database editor):

  ```bash
  npm run prisma:studio
  ```

- **Generate Prisma Client**:

  ```bash
  npm run prisma:generate
  ```

- **Create Migration**:
  ```bash
  npm run prisma:migrate
  ```

## Usage Guide

### Getting Started

1. **Select a User**: Click the user selector in the bottom-left sidebar to choose which user you want to post as
2. **Create Posts**: Type in the "O que está acontecendo?" text area and click "Postar"
3. **Browse Feed**: Scroll through posts in the center feed
4. **Switch Views**: Toggle between "Recentes" (Latest) and "Em alta" (Trending)
5. **Search Posts**: Use the search bar to find posts with exact keyword matches
6. **Repost**: Click the repost button (circular arrows) on posts from other users

### Post Limits

- Maximum **777 characters** per post
- Maximum **5 posts per day** (combined posts and reposts)
- Cannot repost the same post multiple times
- Cannot repost content that is already a repost

### User Interface

- **Left Sidebar**: User selector (stays visible when scrolling)
- **Center Feed**: Main content area with post creation and feed
- **Right Sidebar**: Reserved for future features

## Database Schema

### User Model

```prisma
model User {
  id       Int    @id @default(autoincrement())
  username String @unique
  posts    Post[]
}
```

### Post Model

```prisma
model Post {
  id               Int      @id @default(autoincrement())
  content          String   @db.VarChar(777)
  author_id        Int
  author           User     @relation(...)
  original_post_id Int?     // For reposts
  original_post    Post?    @relation("Reposts", ...)
  reposts          Post[]   @relation("Reposts")
  created_at       DateTime @default(now())
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add your `DATABASE_URL` environment variable
4. Deploy

### Other Platforms

This Next.js app can be deployed to any platform supporting Node.js:

- **Railway**: Includes PostgreSQL database
- **Render**: Supports Next.js and PostgreSQL
- **AWS/GCP/Azure**: Use their respective Node.js hosting services
- **Docker**: Create a Dockerfile for containerized deployment

### Environment Variables

Ensure these variables are set in your deployment environment:

```env
DATABASE_URL=<your-postgresql-connection-string>
NODE_ENV=production
```

## Project Structure

```
social-media/
├── app/
│   ├── generated/prisma/    # Generated Prisma client
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── feed/                # Feed components & actions
│   ├── post/                # Post creation components
│   ├── ui/                  # shadcn/ui components
│   └── user-selector/       # User selection components
├── lib/
│   ├── context/             # React context providers
│   ├── prisma.ts            # Prisma client instance
│   └── utils.ts             # Utility functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Database seeding script
│   └── migrations/          # Database migrations
└── package.json
```

## Development Notes

- **Server Components**: Feed and UserSelector are server components for optimal data fetching
- **Client Components**: Interactive components use `'use client'` directive
- **Server Actions**: Post creation and reposting use Next.js server actions
- **Hydration Fix**: User selection uses useEffect to prevent SSR mismatches
- **Infinite Scroll**: IntersectionObserver API for pagination trigger

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
