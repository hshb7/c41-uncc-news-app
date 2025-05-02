# C41 - UNCC Latest News SPA

## Overview
This project is a Single Page Application (SPA) for displaying the latest news from UNC Charlotte (UNCC), built with Angular (frontend) and NodeJS/Express with MongoDB (backend). The app uses JWT authentication and features dynamic charts based on recent UNCC news.

## Features
- Login page (username/password: Chinedu/Chinedu)
- Dashboard with 200-word news summary and source link
- Summary and Reports pages, each with a dynamic chart
- JWT authentication and route protection
- ADA/WCAG accessibility features
- Tech stack explanation on dashboard
- All code in one repo, with .gitignore

## Tech Stack
- Frontend: Angular (ng2-charts/Chart.js for charts)
- Backend: NodeJS, Express, MongoDB, JWT
- Deployment: NGINX (serves Angular on port 80, proxies API to backend on port 3000)

## Setup Instructions

### Prerequisites
- Node.js and npm
- MongoDB (local or remote)
- Angular CLI (`npm install -g @angular/cli`)

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file (see `.env.example`)
4. `node index.js` (runs on port 3000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `ng build --configuration production`
4. Serve the `dist/` folder via NGINX

### NGINX Example Config
```
server {
    listen 80;
    server_name your_domain_or_ip;

    root /path/to/frontend/dist/frontend;
    index index.html;

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Credentials
- Username: Chinedu
- Password: Chinedu

## Article Source
[UNC Charlotte launches new AI research center to drive innovation](https://inside.charlotte.edu/news-features/2025-04-10/unc-charlotte-launches-new-ai-research-center-drive-innovation)

---

Do not commit sensitive files (e.g., `.env`, `node_modules`).
