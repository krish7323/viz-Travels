# TourTravels Admin Panel

A secure, full-featured MongoDB admin panel for your TourTravels project.

---

## 📁 Project Structure

```
admin-panel/
├── .env                    ← Your environment variables (pre-configured)
├── README.md
└── server/
    ├── index.js            ← Express backend (all CRUD + auth)
    ├── package.json
    └── public/
        └── index.html      ← Complete React frontend (self-contained)
```

---

## ⚙️ Setup & Run

### Step 1 — Install Server Dependencies

```bash
cd admin-panel/server
npm install
```

### Step 2 — Start the Server

```bash
node index.js
# or with auto-restart:
npx nodemon index.js
```

### Step 3 — Open the Admin Panel

Visit: **http://localhost:5001**

---

## 🔐 Login Credentials

| Field    | Value        |
|----------|--------------|
| Username | `admin`      |
| Password | `Admin@1234` |

> To change credentials, edit `.env`:
> ```
> ADMIN_USERNAME=your_username
> ADMIN_PASSWORD=your_password
> ```

---

## 🌟 Features

### Authentication
- Single-admin login with JWT tokens (8h session)
- Password hashed with bcrypt
- Auto-redirect on token expiry
- Show/hide password toggle

### Database Browser
- View **all databases** in your MongoDB cluster
- View **all collections** with document counts
- Sidebar navigation between databases and collections

### Data Management (Full CRUD)
| Operation | Description |
|-----------|-------------|
| **View** | Browse paginated documents (20/page) |
| **Search** | Full-text search across string fields |
| **Create** | Add new documents via JSON editor |
| **Edit** | Modify documents in a JSON editor |
| **Delete** | Delete single documents |
| **Bulk Delete** | Select multiple and delete at once |
| **View Raw** | Full JSON view with syntax highlighting |
| **Copy** | Copy document JSON to clipboard |

### UI/UX
- Dark theme with Tailwind CSS
- Pagination with page jump
- Live connection indicator
- Toast notifications for all actions
- Confirmation dialogs for destructive actions
- Collapsible sidebar

---

## 🛣️ API Endpoints

All endpoints (except `/api/auth/login`) require `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login → returns JWT |
| `GET`  | `/api/auth/verify` | Verify token |

### Databases & Collections
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/databases` | List all databases |
| `GET` | `/api/collections/:dbName` | List collections with counts |

### Documents (CRUD)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/data/:db/:col` | List docs (pagination + search) |
| `GET` | `/api/data/:db/:col/:id` | Get single document |
| `POST` | `/api/data/:db/:col` | Create new document |
| `PUT` | `/api/data/:db/:col/:id` | Update document (partial) |
| `DELETE` | `/api/data/:db/:col/:id` | Delete single document |
| `DELETE` | `/api/data/:db/:col` | Bulk delete (body: `{ ids: [...] }`) |

### Query Params for GET `/api/data/:db/:col`
| Param | Default | Description |
|-------|---------|-------------|
| `page` | 1 | Page number |
| `limit` | 20 | Items per page |
| `search` | "" | Search string (regex on string fields) |

---

## 🔒 Security Notes

- Only **one admin account** — no user registration
- JWT expires in **8 hours**
- Passwords are **bcrypt-hashed** at startup
- All data routes protected by auth middleware
- CORS restricted to localhost in development

---

## 🚀 Environment Variables (`.env`)

```env
PORT=5001
MONGODB_URI="mongodb+srv://..."   ← Your MongoDB connection string
JWT_SECRET="..."                  ← Secret for signing JWT tokens
ADMIN_USERNAME=admin              ← Admin login username
ADMIN_PASSWORD=Admin@1234         ← Admin login password
```
