# FitFuel

A modern, full-stack fitness tracker app built with the MERN stack.

## Features
- User authentication (JWT)
- Log meals and workouts
- Nutrition and workout analytics
- Responsive, modern UI (dark mode)
- Data visualizations (charts, pie charts)
- Calendar view for daily logs
- Streak tracking

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend:** Node.js, Express, MongoDB (Atlas), JWT, bcrypt

## Setup

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd FitFuel
```

### 2. Install dependencies
- Frontend:
  ```bash
  cd client
  npm install
  ```
- Backend:
  ```bash
  cd ../server
  npm install
  ```

### 3. Environment Variables
- Create a `.env` file in `server/`:
  ```env
  MONGO_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```
- (Optional) Set `VITE_API_URL` in `client/.env` if deploying backend separately.

### 4. Run Locally
- Backend:
  ```bash
  cd server
  npm run dev
  ```
- Frontend:
  ```bash
  cd client
  npm run dev
  ```

### 5. Build for Production
- Frontend:
  ```bash
  cd client
  npm run build
  ```
- Backend: Deploy to Render/Heroku/Railway with `.env` set.

## Deployment
- Deploy frontend (`client/dist`) to Vercel/Netlify.
- Deploy backend (`server/`) to Render/Heroku/Railway.
- Set environment variables in your host dashboard.

## Folder Structure
```
FitFuel/
  client/      # React frontend
  server/      # Node.js/Express backend
```

## License
MIT 