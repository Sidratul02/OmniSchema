# AI Schema Generation Setup

## ✅ What's Configured

The AI schema generation endpoint is now fully set up and ready to use. Here's what's been done:

### Backend Changes
- ✅ **AI Route Registered** - Added `/ai/generate` endpoint to Express app
- ✅ **OpenAI Integration** - Route calls gpt-3.5-turbo to generate database schemas
- ✅ **Database Persistence** - Generated schemas automatically save entities and relations to PostgreSQL
- ✅ **Error Handling** - Handles API key errors, rate limits, and invalid JSON responses

### Frontend Changes  
- ✅ **Service Function Added** - `generateSchemaFromAI(prompt)` in schema.service.ts
- ✅ **Ready for Dashboard** - Dashboard component can now call AI generation

## 🚀 How to Use

### 1. Get Your OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it (you won't see it again!)

### 2. Add to .env
Edit `backend/.env` and replace `sk-` with your actual key:
```
OPENAI_API_KEY="sk-proj-..."
```

### 3. Start the Backend
```bash
cd backend
npm run dev
```

The server will start on port 5000.

## 🧪 Test It

### Using cURL
```bash
curl -X POST http://localhost:5000/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a blog database with posts, comments, and users"}'
```

### Using JavaScript (Frontend)
```javascript
import { generateSchemaFromAI } from "@/services/schema.service";

// In your component:
const result = await generateSchemaFromAI("Create a blog database with posts and comments");
console.log(result); // { success: true, schema: { entities, relations } }
```

## 📋 How It Works

1. **User enters prompt** → "Create an e-commerce database"
2. **Frontend calls** → `POST /ai/generate { prompt }`
3. **Backend calls OpenAI** → gpt-3.5-turbo with database schema instructions
4. **OpenAI returns JSON** → Structured schema with entities and relations
5. **Backend validates & saves** → Entities and relations saved to PostgreSQL
6. **Frontend receives** → Full schema to display in React Flow canvas

## 🎯 Example Prompts

Try these in the dashboard:

- "Create a social media database with users, posts, comments, and likes"
- "Build an inventory management system with products, warehouses, and stock levels"
- "Design a hotel booking system with hotels, rooms, bookings, and reviews"
- "Create a music streaming service with artists, albums, songs, and playlists"

## ⚙️ Environment Variables Reference

| Variable | Required | Example |
|----------|----------|---------|
| `OPENAI_API_KEY` | ✅ Yes | `sk-proj-...` |
| `DATABASE_URL` | ✅ Yes | `postgresql://...` |
| `JWT_SECRET` | ✅ Yes | Any secure string |
| `PORT` | ❌ No | `5000` (default) |
| `NODE_ENV` | ❌ No | `development` |

## 🔗 API Endpoint Details

**POST** `/ai/generate`

### Request Body
```json
{
  "prompt": "Create a database for a blogging platform with users, posts, comments, and tags"
}
```

### Success Response (200)
```json
{
  "success": true,
  "schema": {
    "entities": [
      {
        "id": "users",
        "name": "Users",
        "fields": [
          { "name": "id", "datatype": "uuid", "primary": true },
          { "name": "email", "datatype": "string", "unique": true, "nullable": false }
        ]
      }
    ],
    "relations": [
      { "from": "posts", "to": "users", "type": "one-to-many" }
    ]
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Prompt is required" | "Invalid OpenAI API key" | "AI returned invalid JSON"
}
```

## ⚡ Next Steps

1. ✅ Add OpenAI API key to `.env`
2. ✅ Start backend server
3. 🔄 Add "Generate with AI" button to dashboard
4. 🔄 Create modal for user to enter prompt
5. 🔄 Display generated schema in React Flow

---

**Note**: Each API call costs credits on your OpenAI account. gpt-3.5-turbo is the most affordable option (~$0.001 per request).
