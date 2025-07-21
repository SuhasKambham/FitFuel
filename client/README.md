# FitFuel Frontend (client)

This is the React + TypeScript frontend for the FitFuel fitness tracker app.

## Features
- Modern, responsive UI (dark mode)
- Log meals and workouts
- Dashboard with analytics and charts
- Calendar view for daily logs
- Authentication and protected routes

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Recharts (charts)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
- Create a `.env` file in this folder (see `.env.example`):
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```
  - Set this to your backend API URL if deploying separately.

### 3. Run in Development
```bash
npm run dev
```
- App will be available at `http://localhost:5173` by default.

### 4. Build for Production
```bash
npm run build
```
- Output will be in the `dist/` folder. Deploy this to Vercel, Netlify, or your preferred static host.

## Available Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally

## Deployment
- Deploy the `dist/` folder to Vercel, Netlify, or any static host.
- Set `VITE_API_URL` to your backend API endpoint in production.

## Notes
- This frontend requires the FitFuel backend to be running and accessible at the API URL you set.
- For full-stack setup, see the main [README](../README.md).

## License
MIT 