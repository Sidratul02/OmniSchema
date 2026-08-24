# OmniSchema

A full-stack visual database schema builder. Design your database visually on a canvas, define entities and relations, then export production-ready code in 8 formats — or describe your app in plain English and let AI generate the schema for you.

![Status](https://img.shields.io/badge/status-live-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748) ![Deployed on Vercel](https://img.shields.io/badge/frontend-Vercel-black) ![Deployed on Render](https://img.shields.io/badge/backend-Render-46E3B7)

**Live Demo:** [https://omni-schema.vercel.app](https://omni-schema.vercel.app)

<img width="1366" height="595" alt="Screenshot (331)" src="https://github.com/user-attachments/assets/7a6ad2d2-ee6f-462d-92f8-bf90fa708990" />
<img width="1366" height="592" alt="Screenshot (333)" src="https://github.com/user-attachments/assets/ab6fde75-bc4f-476b-9311-7d62218a72bc" />

---

## Features

- **Visual Canvas** — drag-and-drop schema designer powered by ReactFlow
- **Entity & Field Builder** — create tables with typed fields (uuid, string, number, boolean, date, text, json), primary key, unique, and nullable constraints
- **Relation Mapping** — define one-to-one, one-to-many, and many-to-many relations between entities with animated edges on the canvas
- **8 Export Formats** — generate production-ready code for PostgreSQL, MySQL, SQLite, Prisma, Drizzle, Sequelize, Mongoose, and TypeScript interfaces
- **AI Schema Generation** — describe your app in plain English, OpenAI generates the full schema and inserts it directly into your project
- **Multi-Project Support** — create, rename, and delete multiple projects per account
- **JWT Authentication** — secure signup/login with bcrypt password hashing and 7-day tokens
- **Real-time Code Preview** — generated code updates live in the right panel as you build

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | v5 | REST API server |
| TypeScript | v6 | Type safety |
| Prisma | v7 | ORM + migrations |
| Neon PostgreSQL | serverless | Database |
| OpenAI SDK | v6 | AI schema generation |
| bcryptjs | v3 | Password hashing |
| jsonwebtoken | v9 | JWT auth |
| Zod | v4 | Request validation |
| Helmet | v8 | Security headers |
| express-rate-limit | v8 | Auth rate limiting |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | v15 | React framework |
| React | v19 | UI |
| ReactFlow | v11 | Visual canvas |
| Zustand | v5 | State management |
| Axios | v1 | HTTP client |
| Tailwind CSS | v4 | Styling |
| react-hot-toast | v2 | Notifications |

---

## Project Structure

```
OmniSchema/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # DB models: User, Project, Entity, Field, Relation
│   ├── src/
│   │   ├── lib/
│   │   │   ├── prisma.ts          # Prisma client singleton (Neon adapter)
│   │   │   ├── jwt.ts             # JWT secret export
│   │   │   └── project.ts        # getUserProject helper
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts # JWT Bearer auth, token expiry handling
│   │   ├── parsers/
│   │   │   ├── sql/               # postgres, mysql, sqlite parsers
│   │   │   ├── orm/               # prisma, drizzle, sequelize parsers
│   │   │   ├── nosql/             # mongoose parser
│   │   │   ├── typescript/        # TypeScript interface parser
│   │   │   └── parser.factory.ts  # Dispatches to correct parser by type
│   │   ├── routes/
│   │   │   ├── auth.route.ts      # POST /auth/signup, POST /auth/login, GET /auth/me
│   │   │   ├── project.route.ts   # GET/POST/PATCH/DELETE /project
│   │   │   ├── entity.route.ts    # GET/POST/PUT/DELETE /entity
│   │   │   ├── relation.route.ts  # GET/POST/DELETE /relation
│   │   │   ├── generator.route.ts # GET /generate, GET /generate/:type
│   │   │   └── ai.route.ts        # POST /ai/generate
│   │   ├── types/
│   │   │   └── express.d.ts       # Express Request augmentation (req.userId)
│   │   ├── validators/
│   │   │   └── schemas.ts         # Zod schemas for all request bodies
│   │   ├── app.ts                 # Express app setup (helmet, CORS, routes)
│   │   └── server.ts              # HTTP server + graceful shutdown
│   ├── prisma.config.ts           # Prisma v7 datasource config
│   ├── .env.example               # Environment variable template
│   └── tsconfig.json
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx           # Landing page
        │   ├── login/page.tsx     # Login page
        │   ├── signup/page.tsx    # Signup page
        │   └── dashboard/page.tsx # Main schema builder UI
        ├── components/
        │   └── SchemaNode.tsx     # ReactFlow custom node (table card)
        ├── services/
        │   ├── api.ts             # Axios instance + 401 interceptor
        │   ├── auth.service.ts    # login, signup, logout, getMe
        │   └── schema.service.ts  # entity, relation, generate, AI, project APIs
        ├── store/
        │   └── schema.store.ts    # Zustand store
        └── types/
            └── schema.ts          # Entity, Field, Relation TypeScript types
```

---

## REST API Reference

**Base URL (production):** `https://omnischema.onrender.com`

All protected routes require `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | ❌ | Register a new user (rate limited: 10/15min) |
| `POST` | `/auth/login` | ❌ | Login and receive JWT (rate limited: 10/15min) |
| `GET` | `/auth/me` | ✅ | Get current authenticated user |

### Projects
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/project` | ✅ | List all projects for the user |
| `POST` | `/project` | ✅ | Create a new project |
| `PATCH` | `/project/:id` | ✅ | Rename a project |
| `DELETE` | `/project/:id` | ✅ | Delete a project (cannot delete last project) |

### Entities
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/entity` | ✅ | List all entities in the active project |
| `POST` | `/entity` | ✅ | Create a new entity with fields |
| `PUT` | `/entity/:id` | ✅ | Update entity name and fields (atomic transaction) |
| `DELETE` | `/entity/:id` | ✅ | Delete entity, its fields, and related relations |

### Relations
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/relation` | ✅ | List all relations in the active project |
| `POST` | `/relation` | ✅ | Create a relation between two entities |
| `DELETE` | `/relation/:id` | ✅ | Delete a relation |

### Generator
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/generate` | ✅ | List all supported export formats |
| `GET` | `/generate/:type` | ✅ | Generate schema code for a specific format |

### AI
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/ai/generate` | ✅ | Generate schema from a natural language prompt |

**Supported generator types:** `postgres`, `mysql`, `sqlite`, `prisma`, `drizzle`, `sequelize`, `mongoose`, `typescript`

---

## Database Schema

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  name      String
  createdAt DateTime  @default(now())
  projects  Project[]
}

model Project {
  id        String     @id @default(cuid())
  name      String
  userId    String
  entities  Entity[]
  relations Relation[]
}

model Entity {
  id        String  @id        // snake_case, user-defined
  name      String
  projectId String
  fields    Field[]
}

model Field {
  id       String  @id @default(cuid())
  name     String
  datatype String  // uuid | string | number | boolean | date | text | json
  primary  Boolean @default(false)
  unique   Boolean @default(false)
  nullable Boolean @default(true)
  entityId String
}

model Relation {
  id        String @id @default(cuid())
  from      String // entity id
  to        String // entity id
  type      String // one-to-one | one-to-many | many-to-many
  projectId String
}
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- An [OpenAI API key](https://platform.openai.com/api-keys) (optional — only needed for AI generation)

### 1. Clone the repository

```bash
git clone https://github.com/Sidratul02/OmniSchema.git
cd OmniSchema
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
OPENAI_API_KEY="sk-your-api-key-here"
OPENAI_MODEL="gpt-3.5-turbo"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

Push the database schema and start:

```bash
npm run db:generate
npm run db:push
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

> **Note:** Both terminals must stay open simultaneously — one for the backend, one for the frontend.

---

## Deployment

The project is deployed using:

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [https://omni-schema.vercel.app](https://omni-schema.vercel.app) |
| Backend | Render | [https://omnischema.onrender.com](https://omnischema.onrender.com) |
| Database | Neon PostgreSQL | serverless |

### Deploy your own

**Backend on Render:**
1. New Web Service → connect `Sidratul02/OmniSchema`
2. Root Directory: `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `node dist/server.js`
5. Add environment variables (see table below)

**Frontend on Vercel:**
1. New Project → import `Sidratul02/OmniSchema`
2. Root Directory: `frontend`
3. Add `NEXT_PUBLIC_API_URL` = your Render backend URL
4. Deploy

---

## Export Format Examples

Given a `users` entity with a `one-to-many` relation to `posts`:

**PostgreSQL**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id)
);
```

**Prisma**
```prisma
model Users {
  id    String  @id @default(uuid())
  name  String
  posts Posts[]
}

model Posts {
  id      String @id @default(uuid())
  userId  String
  users   Users  @relation(fields: [userId], references: [id])
}
```

**TypeScript**
```typescript
export interface Users {
  id: string;
  name: string;
}

export interface Posts {
  id: string;
  userId: string;
}
```

All 8 formats handle `one-to-one` (FK + UNIQUE constraint), `one-to-many` (FK), and `many-to-many` (junction table) relations correctly.

---

## AI Schema Generation

Click **✨ Generate with AI** on the dashboard, describe your application, and OmniSchema will:

1. Send your prompt to OpenAI GPT with a strict system prompt
2. Parse and validate the returned JSON schema
3. Sanitize all entity IDs and field names
4. Insert entities, fields, and relations directly into your project
5. Refresh the canvas automatically

Example prompts:
- *"Create an ecommerce database with users, products, orders and reviews"*
- *"Build a school management system with students, teachers, courses and grades"*
- *"Design a social media app with users, posts, comments and likes"*

> **Note:** AI generation requires a valid `OPENAI_API_KEY` in your backend `.env`. See `backend/AI_SETUP.md` for details.

---

## Security

- **Helmet** — sets 11 security-related HTTP response headers
- **CORS** — restricted to `FRONTEND_URL` only, no wildcard origins
- **Rate limiting** — auth endpoints limited to 10 requests per 15 minutes
- **JWT** — Bearer token auth with expiry distinction (expired vs invalid)
- **Body size limit** — requests capped at 50kb to prevent payload attacks
- **Zod validation** — all request bodies validated before any DB operation
- **Prompt sanitization** — AI prompts stripped of HTML, control characters, and injection keywords
- **Atomic transactions** — entity updates and deletes use `$transaction` to prevent partial writes
- **Password hashing** — bcrypt with salt rounds of 10
- **Graceful shutdown** — SIGTERM/SIGINT handlers disconnect Prisma cleanly

---

## Scripts

### Backend
```bash
npm run dev          # Start with ts-node-dev (hot reload)
npm run build        # Generate Prisma client + compile TypeScript to dist/
npm run start        # Run compiled dist/server.js
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
```

### Frontend
```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs (min 32 chars) |
| `OPENAI_API_KEY` | ⚠️ | OpenAI API key (required for AI generation) |
| `OPENAI_MODEL` | ❌ | OpenAI model to use (default: `gpt-3.5-turbo`) |
| `PORT` | ❌ | Server port (default: `5000`) |
| `NODE_ENV` | ❌ | Environment (`development` or `production`) |
| `FRONTEND_URL` | ❌ | Allowed CORS origin (default: `http://localhost:3000`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ❌ | Backend API URL (default: `http://localhost:5000`) |

---

## License

MIT
