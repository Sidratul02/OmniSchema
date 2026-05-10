# OmniSchema

A universal schema engine that lets you visually design database entities and relations, then generate code for multiple targets — PostgreSQL, MySQL, SQLite, Mongoose, Prisma, Drizzle, Sequelize, and TypeScript interfaces.

## Project Structure

```
OmniSchema/
├── backend/   # Express + TypeScript REST API
└── frontend/  # Next.js + ReactFlow visual canvas
```

## Features

- Visual schema canvas with drag-and-drop nodes
- Define entities and fields
- Define relations (one-to-one, one-to-many, many-to-many)
- Generate SQL (PostgreSQL, MySQL, SQLite)
- Generate ORM schemas (Prisma, Drizzle, Sequelize)
- Generate Mongoose schemas
- Generate TypeScript interfaces

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/entity` | Create an entity |
| GET | `/entity` | Get all entities |
| GET | `/entity/:id` | Get entity by ID |
| DELETE | `/entity/:id` | Delete entity |
| POST | `/relation` | Create a relation |
| GET | `/relation` | Get all relations |
| GET | `/generate/:type` | Generate schema (`postgres`, `mysql`, `sqlite`, `mongoose`, `prisma`, `drizzle`, `sequelize`, `typescript`) |

## Tech Stack

**Backend:** Node.js, Express, TypeScript

**Frontend:** Next.js 15, ReactFlow, Zustand, Axios, Tailwind CSS
