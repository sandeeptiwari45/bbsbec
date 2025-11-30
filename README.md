<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BBSBEC Digital Notice Board

Vite + React frontend with a new Node.js/Express API backed by MongoDB Atlas. Use the frontend for the student/faculty/admin portal and the backend to persist data in real time.

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas (or compatible) connection string

## Frontend

```bash
npm install          # install deps
npm run dev          # start Vite dev server (http://localhost:5173)
```

Required env vars in `.env.local`:

- `GEMINI_API_KEY`
- `VITE_API_URL=http://localhost:4000/api`

## Backend (`server/`)

```bash
cd server
npm install
```

Create `server/.env`:

```
MONGO_URI=<your Mongo connection string>
PORT=4000
```

Start the API:

```bash
npm run dev   # nodemon
# or
npm start
```

The API seeds default admin/faculty/student users, notices, codes, and events if the collections are empty.

## REST API

Base URL: `http://localhost:4000/api`

- `POST /auth/login`
- `POST /auth/register`
- `GET /notices`
- `POST /notices`
- `DELETE /notices/:id`
- `GET /students?includePending=true|false`
- `PATCH /students/:id`
- `GET /students/pending/list`
- `POST /students/:id/approve`
- `PATCH /students/:id/favourites`
- `GET /codes`
- `POST /codes`
- `GET /events`
- `POST /events`
- `PATCH /events/:id`
- `DELETE /events/:id`

Next step: update `services/mockService.ts` to call these endpoints so the UI reads/writes from MongoDB instead of `localStorage`.
