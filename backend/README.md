# Portfolio Backend API 🚀

REST API for the **Debanjan Das** portfolio website — built with **Node.js + Express + MongoDB Atlas**.

---

## Folder Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB Atlas connection
├── controllers/
│   └── contactController.js  # Route logic
├── middleware/
│   ├── errorHandler.js       # Global error handler
│   └── validate.js           # express-validator input rules
├── models/
│   └── Contact.js            # Mongoose schema
├── routes/
│   └── contactRoutes.js      # API route definitions
├── .env.example              # Environment variable template
├── .gitignore
├── package.json
├── README.md
└── server.js                 # Entry point
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/` | Health check |
| `POST` | `/api/contact` | Submit contact form |
| `GET`  | `/api/contact` | List all submissions |

### POST /api/contact — Request body

```json
{
  "name":    "John Doe",
  "email":   "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd love to work with you on my new app."
}
```

### Success Response (201)

```json
{
  "success": true,
  "message": "Message sent! I'll be in touch soon. 🚀",
  "data": {
    "id": "65f1a...",
    "name": "John Doe",
    "createdAt": "2026-03-08T09:00:00.000Z"
  }
}
```

### Validation Error Response (422)

```json
{
  "success": false,
  "message": "Validation failed. Please check your input.",
  "errors": [
    { "field": "email", "message": "Please enter a valid email address." }
  ]
}
```

---

## Run Locally

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+ installed
- A free [MongoDB Atlas](https://cloud.mongodb.com) account

### 2. Set Up MongoDB Atlas (free)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → **Create Free Account**
2. Create a **Free M0 cluster** (any region)
3. Under **Database Access** → Add a database user (username + password)
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all — for dev)
5. Click **Connect → Connect your application** → copy the connection string

### 3. Install Dependencies

```bash
cd d:\Portfolio\backend
npm install
```

### 4. Configure Environment Variables

```bash
# Copy the example file
copy .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
FRONTEND_URL=http://127.0.0.1:5500
```

### 5. Run the Dev Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000 [development]
```

### 6. Test the API

Open your browser console or a terminal and run:

```js
// Submit a contact form
fetch('http://localhost:5000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Hello',
    message: 'This is a test message from the portfolio form.'
  })
}).then(r => r.json()).then(console.log);
```

---

## Deploy to Render (Free)

### 1. Push to GitHub

```bash
cd d:\Portfolio\backend
git init
git add .
git commit -m "Initial backend"
```

Create a new repo on GitHub (e.g. `portfolio-backend`) and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio-backend.git
git push -u origin main
```

### 2. Deploy on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo (`portfolio-backend`)
3. Set the following:

| Field | Value |
|---|---|
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

4. Under **Environment Variables**, add:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URI` | *(your Atlas connection string)* |
| `FRONTEND_URL` | *(your deployed frontend URL, or `*` for now)* |

5. Click **Deploy** — Render will give you a URL like:  
   `https://portfolio-backend-xxxx.onrender.com`

> ⚠️ **Free tier note:** Render free instances spin down after 15 min of inactivity. The first request after idle may take ~30 seconds.

---

## Connect Frontend to Deployed API

Open `d:\Portfolio\Website\script.js` and update the `API_URL` constant:

```js
// Change this one line:
const API_URL = 'https://portfolio-backend-xxxx.onrender.com/api/contact';
```

Also update `FRONTEND_URL` in Render's environment variables to match your live frontend URL so CORS allows it.

---

## Security Features

| Feature | Details |
|---|---|
| **Helmet** | Sets secure HTTP headers (XSS protection, content sniffing, etc.) |
| **Rate Limiting** | 50 req / 15 min per IP on all `/api` routes |
| **Contact Limiter** | Max 5 form submissions / hour per IP (anti-spam) |
| **express-validator** | Server-side input validation on all fields |
| **Body size limit** | JSON payloads capped at 10kb |
| **CORS allowlist** | Only whitelisted origins can reach the API |

---

## Example fetch from Frontend

```js
const API_URL = 'http://localhost:5000/api/contact'; // or your Render URL

const response = await fetch(API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, subject, message }),
});
const data = await response.json();

if (data.success) {
  console.log('✅', data.message);
} else {
  console.error('❌', data.errors || data.message);
}
```
