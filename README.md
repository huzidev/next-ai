# Next-AI

A modern, full-featured AI chat application built with Next.js, featuring both user and admin interfaces with dark theme design.

## Features

- **Dual Interface**: Separate user and admin dashboards
- **AI Chat**: Powered by Google Generative AI
- **Authentication**: Complete auth flows with verification
- **Dark Theme**: Modern dark UI with grey shades
- **Image Upload**: Support for image uploads in chat
- **Admin Panel**: User management and system administration
- **Notifications**: Real-time notification system
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, ShadCN UI components
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Generative AI (Gemini)
- **Email**: Resend API
- **Authentication**: Custom JWT-based auth

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)
- Google Gemini API key
- Resend API key (for emails)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd next-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
# Resend API Key for email functionality
RESEND_API_KEY=your_resend_api_key_here

# Google Gemini API Key for AI functionality
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@localhost:5432/nextai_db?schema=public"
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed the database
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

### Database Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy

# View your data in Prisma Studio
npx prisma studio

# Reset the database (development only)
npx prisma migrate reset
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### User Interface
- Sign up at `/auth/user/signup`
- Sign in at `/auth/user/signin`
- Access dashboard at `/dashboard/user`

### Admin Interface
- Sign in at `/auth/admin/signin`
- Access admin panel at `/dashboard/admin`

## Project Structure

```
src/
├── components/ui/          # ShadCN UI components
├── pages/
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── auth/              # Authentication pages
│   │   ├── user/          # User auth flows
│   │   └── admin/         # Admin auth flows
│   └── dashboard/         # Dashboard pages
│       ├── user/          # User dashboard
│       └── admin/         # Admin dashboard
├── lib/                   # Utility functions
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
└── utils/                 # Helper utilities

prisma/
├── schema.prisma          # Database schema
├── migrations/            # Database migrations
└── seed.js               # Database seeding script
```

## API Routes

### Authentication
- `POST /api/auth/user/signup` - User registration
- `POST /api/auth/user/signin` - User login
- `POST /api/auth/user/verify` - Email verification
- `POST /api/auth/admin/signin` - Admin login

### User Management
- `GET /api/users` - List users (admin only)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Prisma Documentation](https://www.prisma.io/docs) - learn about Prisma ORM.
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework.
- [ShadCN UI](https://ui.shadcn.com/) - re-usable components built with Radix UI and Tailwind CSS.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Remember to:
1. Set up your PostgreSQL database
2. Configure environment variables in Vercel
3. Run database migrations after deployment

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
