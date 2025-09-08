Bomet Shooter backend

This is a minimal Express + MongoDB backend used to store player scores and provide a leaderboard for the web client.

Quick start:

1. Copy the example env: `cp .env.example .env` and edit `.env` to add your `MONGODB_URI`.
2. Install dependencies:
   npm install
3. Start the server:
   npm start

API endpoints:
- POST /api/scores
  Body: { playerName: string, score: number, date?: string, stats?: object }
  Returns: saved score object

- GET /api/leaderboard?limit=10
  Returns: array of top scores sorted by score desc

CORS is enabled so your frontend can call the API from `localhost`.

Notes:
- The server reads `MONGODB_URI` and `PORT` from environment variables.
- For local development, you can use a local MongoDB instance or a cloud MongoDB provider.

Serving the frontend via the backend:

Static files are served from the `public/` folder (Vercel-friendly). Start the backend (default port 3000) and then visit:

  http://localhost:3000/

This redirects to `/pages/welcome.html`. For deployment to Vercel, ensure the `public/` folder is included in the project root — the frontend will then be served as static files, while the backend can run separately as an API (or you can deploy the backend to a serverless function).

When developing locally with Live Server (port 5500), the frontend will default to calling the backend at http://localhost:3000.
