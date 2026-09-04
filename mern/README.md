# MainCrafts Technology — MERN Stack

Full migration of the static 5-page MainCrafts site into a MERN application:
**M**ongoDB + **E**xpress + **R**eact (Vite) + **N**ode.

```
maincrafts-mern/
├── backend/     Express REST API + Mongoose models (MongoDB)
├── frontend/    React (Vite) single-page app, React Router
└── README.md
```

## What changed from the static site

| Feature | Before (Task 3/4) | Now |
|---|---|---|
| Contact form | Validated in JS, saved to `localStorage` | Validated client + server, saved to MongoDB via `POST /api/contacts` |
| Submissions page | Read from `localStorage` | Fetched from `GET /api/contacts`, deletes hit the API |
| Task dashboard | Full CRUD against `localStorage` | Full CRUD against `/api/tasks` (add, edit, delete, toggle, clear-completed), with server-side search/filter/pagination |
| Submissions page | Rendered every item at once | Paginated (6/12/24/48 per page) via `GET /api/contacts?page=&limit=` |
| Pages | 5 separate `.html` files | Single React app, routed with `react-router-dom` |
| Navigation / dropdown / mobile menu | Vanilla JS in `script.js` | Ported to React hooks in `Header.jsx` |

Visual design, copy, and layout are unchanged — same `style.css`, same fonts (Google Fonts: Syne/DM Sans) and Font Awesome icons.

---

## 1. Backend setup

```bash
cd backend
cp .env.example .env     # then edit MONGO_URI if needed
npm install
npm run dev               # nodemon, http://localhost:5000
```

`.env` values:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/maincrafts
CLIENT_ORIGIN=http://localhost:5173
```

- **Local MongoDB**: install MongoDB Community Server and run `mongod`, or use Docker:
  ```bash
  docker run -d -p 27017:27017 --name maincrafts-mongo mongo:7
  ```
- **MongoDB Atlas** (cloud, free tier): create a cluster, get the connection string, and paste it into `MONGO_URI`.

Optional demo data:
```bash
npm run seed     # inserts a couple of sample contacts + tasks
```

### API reference

**Contacts**
| Method | Route | Description |
|---|---|---|
| GET | `/api/contacts?page=&limit=` | List submissions, newest first, paginated (default `limit=10`, max `100`) |
| GET | `/api/contacts/:id` | Get one submission |
| POST | `/api/contacts` | Create a submission — body: `{ name, email, message }` |
| DELETE | `/api/contacts/:id` | Delete one submission |
| DELETE | `/api/contacts` | Delete all submissions |

**Tasks**
| Method | Route | Description |
|---|---|---|
| GET | `/api/tasks?search=&status=&page=&limit=` | List tasks (optional search + `all/pending/completed` filter), paginated + stats |
| POST | `/api/tasks` | Create a task — body: `{ name }` |
| PUT | `/api/tasks/:id` | Update a task — body: `{ name?, completed? }` |
| PATCH | `/api/tasks/:id/toggle` | Toggle completed state |
| DELETE | `/api/tasks/:id` | Delete one task |
| DELETE | `/api/tasks/completed/all` | Delete all completed tasks |

All paginated list endpoints return a `pagination` object alongside `data`:
```json
{
  "success": true,
  "data": [ /* items for this page */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 47,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```
For tasks, `stats` (`total`/`pending`/`completed`) always reflects the *full* task set, independent of the current page or search/filter — so the stat bar doesn't jump around as you page through results.

**Misc**
| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Health check |

All list/mutation endpoints return `{ success, data, ... }`. Validation errors return `400` with a `message`; not-found returns `404`.

---

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:5173
```

Pages (all client-side routed):

- `/` — Home
- `/about` — About
- `/contact` — Contact form (POSTs to the API)
- `/submissions` — Submissions list (GET/DELETE against the API)
- `/dashboard` — Task manager (full CRUD against the API)

### Build for production

```bash
npm run build       # outputs to frontend/dist
npm run preview      # serve the production build locally
```

Deploy `frontend/dist` to any static host (Vercel, Netlify, S3+CloudFront, etc.), and set `VITE_API_URL` to point at your deployed backend before building.

---

## 3. Running both together (dev)

Open two terminals:

```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

Visit `http://localhost:5173`. The backend must be reachable at the URL in `frontend/.env` (`VITE_API_URL`), and the frontend origin must be listed in `backend/.env` (`CLIENT_ORIGIN`) for CORS to allow it.

---

## 4. Notes / production hardening already included

- **Validation**: both client-side (matches original UX) and server-side (Mongoose schema + controller checks) — never trust the client alone.
- **Security**: `helmet` for HTTP headers, `express-rate-limit` on `/api/*`, strict CORS allow-list.
- **Error handling**: centralized error middleware normalizes Mongoose validation/cast/duplicate-key errors into consistent JSON.
- **Logging**: `morgan` request logging in development.

### Suggested next steps
- Add authentication (JWT) if the dashboard should be private per-user.
- Add automated tests (Jest + Supertest for the API, React Testing Library for the frontend).
- Containerize with Docker Compose (mongo + backend + frontend) for one-command startup.
