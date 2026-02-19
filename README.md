# Legal Document Timeline Extraction System – Frontend

## Overview

This is the Next.js frontend for the Legal Document Timeline Extraction System.

The frontend provides a modern user interface for authentication, document upload, document management, and timeline visualization.

It connects to the FastAPI backend using REST APIs and uses Supabase for authentication.

---

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui
- Zustand (state management)
- Axios (API requests)
- Supabase Auth

---

## Features

- User signup and login
- JWT-based authentication using Supabase
- Upload PDF documents
- View uploaded documents
- Document status display:
  - pending
  - processing
  - completed
  - failed
- Timeline visualization
- Responsive modern UI
- Loading and error handling states

---

## Project Structure


## Pages Description

### /login
User login page using Supabase authentication.

### /signup
User registration page.

### /dashboard
Main dashboard where users can:
- Upload documents
- View uploaded documents
- Check document status

### /timeline/[documentId]
Displays extracted timeline events for selected document.

---

## State Management

Uses Zustand for managing global state.

Stores:

authStore.ts
- User authentication
- JWT token
- Login/logout

documentStore.ts
- Upload document
- Fetch documents
- Document status

timelineStore.ts
- Fetch timeline
- Store timeline events

---

## API Integration

Frontend connects to FastAPI backend using Axios.

Example configuration:

lib/api.ts

Base URL:
http://localhost:8000

Endpoints used:

POST /auth/sync-user

POST /documents/upload

GET /documents

GET /timeline/{document_id}

---

## Environment Variables

Create `.env.local` file in frontend folder:




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
