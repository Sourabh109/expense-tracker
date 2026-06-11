# MERN Expense Tracker

A full-stack expense tracker built with MongoDB, Express, React, and Node.js.

## Features

- **User Authentication** — Register, login, JWT-protected routes
- **Dashboard** — Balance overview, income vs expense bar chart, expenses by category doughnut chart
- **Transactions** — Full CRUD, filter by type/category/search, pagination
- **Profile** — Update name/email, change password, delete account
- **Responsive** — Works on mobile and desktop

## Project Structure

```
expense-tracker/
├── backend/          # Node.js + Express + MongoDB API
│   ├── config/       # DB connection
│   ├── controllers/  # Route handlers
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # Mongoose models (User, Transaction)
│   ├── routes/       # Express routers
│   └── server.js     # Entry point
└── frontend/         # React app
    └── src/
        ├── components/  # Navbar, TransactionRow
        ├── context/     # AuthContext, TransactionContext
        ├── pages/       # Login, Register, Dashboard, Transactions, AddTransaction, Profile
        └── utils/       # Axios API client
```

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Quick Start

### 1. Clone / unzip and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

```bash
# In backend/
cp .env.example .env
# Edit .env and set:
#   MONGO_URI=mongodb://localhost:27017/expense-tracker
#   JWT_SECRET=your_secret_key_here
```

```bash
# In frontend/
cp .env.example .env
# Edit if your backend runs on a different port
#   REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run the app

```bash
# Terminal 1 — start backend
cd backend
npm run dev

# Terminal 2 — start frontend
cd frontend
npm start
```

App will be at **http://localhost:3000**  
API will be at **http://localhost:5000/api**

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/update | Update profile |
| PUT | /api/auth/updatepassword | Change password |
| DELETE | /api/auth/delete | Delete account |

### Transactions (all require Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | List transactions (filterable) |
| POST | /api/transactions | Create transaction |
| GET | /api/transactions/summary | Stats + charts data |
| GET | /api/transactions/:id | Get single |
| PUT | /api/transactions/:id | Update |
| DELETE | /api/transactions/:id | Delete |

### Query params for GET /api/transactions
- `type` — income or expense
- `category` — Food, Transport, etc.
- `search` — text search on description
- `startDate` / `endDate` — date range (ISO format)
- `page` / `limit` — pagination (default limit: 20)

## Deployment

### Backend (Railway / Render)
1. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`
2. Start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Publish directory: `build`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Chart.js, Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Styling | Pure CSS (no framework) |
