# FitLog — Workout Library

FitLog is a dark, no-nonsense gym companion built with Next.js. Browse a library of 12 lifts, open any workout for full specs and instructions, and assemble a plan of up to five lifts for today. Track completed work and saved lifts across sessions.

## Technologies Used

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- lucide-react icons

## Features

- Responsive workout library with sorting by duration, calories, or rating
- Detailed workout pages with key specs, instructions, and actions
- Today's Plan and Saved tabs with live exercise/minute/calorie metrics
- localStorage persistence for plans, saved items, and completed lifts
- Toast notifications, 404 page, and mobile-friendly navigation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

Workout data is fetched from the FitLog API (`https://api.abcz.workers.dev/api/fitlog`).