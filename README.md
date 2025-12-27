# Note Sharing App

A secure REST API for collaborative note-taking built with **Node.js**, **Express**, **Sequelize**, and **MySQL**. Features include authentication, note versioning, and secure sharing.

---

## ✨ Features

- 🔐 **JWT Authentication** with refresh tokens
- 📝 **Full Note Management** (CRUD operations)
- 🕒 **Version History** tracking
- 🤝 **Secure Note Sharing** between users
- 🐳 **Docker-Ready** for easy deployment
- 📚 **Interactive API Docs** with Swagger ,Technical Analysis Document.docx

---

## 🛠 Tech Stack

**Backend:** Node.js, Express.js  
**Database:** MySQL with Sequelize ORM  
**Auth:** JWT (Access + Refresh Tokens)  
**DevOps:** Docker, Docker Compose  
**Docs:** OpenAPI (Swagger) , Technical Analysis Document.docx

---

## 📁 Project Structure
```
note-sharing-app/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   ├── middlewares/      # Auth & validation
│   └── utils/            # Helper functions
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── Technical Analysis Document.docx
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone & Configure
```bash
# Clone repository
git clone git@github.com:Iqrarijaz/note-sharing-app-node-js-with-sql.git
cd note-sharing-app-node-js-with-sql

# Create environment file
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env`:
```env
# Application
NODE_ENV=development
DEBUG = false
PORT=5000

DB_HOST=mysql
DB_PORT=3306
DB_NAME=notes_db
DB_USER=notes_user
DB_PASSWORD=notes_pass

REDIS_HOST=redis
REDIS_PORT=6379

JWT_ACCESS_SECRET=supersecretaccess
JWT_REFRESH_SECRET=supersecretrefresh
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

> **⚠️ Security:** Generate strong secrets for production using `openssl rand -base64 32`

### 3. Launch with Docker
```bash
docker compose up
```

**What happens:**
- Builds Node.js application
- Starts MySQL database
- Configures networking automatically
- Runs database migrations

---

## 🌐 Access Points

| Service | URL |
|---------|-----|
| **API Base** | http://localhost:5000 |
| **Swagger Docs** | http://localhost:5000/docs |

---

## 🔐 Authentication Flow
```
1. Register    → POST /auth/register
2. Login       → POST /auth/login (returns accessToken & refreshToken)
3. Authenticate → Add header: Authorization: Bearer <accessToken>
4. Refresh     → POST /auth/refresh-token (when token expires)
```

**Example Request:**
```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:5000/notes
```

---

## 📝 Core API Endpoints

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Get tokens
- `POST /auth/refresh-token` - Refresh access token

### Notes
- `POST /notes` - Create note
- `GET /notes` - List your notes
- `GET /notes/:id` - Get specific note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

### Sharing
- `POST /notes/:id/share` - Share note with user
- `GET /notes/shared` - View notes shared with you

### Versions
- `GET /notes/:id/versions` - View note history

> **💡 Tip:** Explore all endpoints interactively at `/docs`

---

## 🐳 Docker Commands
```bash
# Start services
docker compose up

# Start in background
docker compose up -d

# Stop services
docker compose down

# Rebuild after changes
docker compose up --build

# View logs
docker compose logs -f

# Execute commands in container
docker compose exec app sh
```

---

## 🧪 Testing the API

### Using Swagger UI
1. Navigate to http://localhost:5000/docs
2. Click **"Authorize"** button
3. Enter JWT token: `Bearer <your_token>`
4. Test endpoints directly in browser

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123"}'

# Create Note
curl -X POST http://localhost:5000/notes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Hello World"}'
```

---

## 📦 Development Setup (Without Docker)
```bash
# Install dependencies
npm install

# Set up database
mysql -u root -p
CREATE DATABASE notes_db;

# Update .env with local DB settings
DB_HOST=localhost

# Run migrations
npm run migrate

# Start development server
npm run dev
```

---

## 🔒 Security Notes

- **Never commit `.env`** to version control
- **Rotate JWT secrets** regularly in production
- Use **strong passwords** for database
- Enable **HTTPS** in production
- Implement **rate limiting** for auth endpoints

---

## 💬 Support

- 📖 **Documentation:** http://localhost:5000/docs
  
---





