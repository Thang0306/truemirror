# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TrueMirror is an AI-powered interview practice platform that uses AR and AI to simulate realistic interview experiences. The application is built as a monorepo with a Flask backend and React frontend.

**Tech Stack:**
- **Backend**: Flask (Python) with Azure OpenAI integration, SQLAlchemy, Flask-CORS
- **Frontend**: React 19 + Vite + React Router + Tailwind CSS v4
- **Database**: SQLite (configurable via environment)
- **AI/ML**: Azure OpenAI API

## Development Setup

### Backend (Flask)

**Navigate to backend directory:**
```bash
cd backend
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Run the backend server:**
```bash
python app.py
# Server runs on http://localhost:5000
```

**Environment Variables:**
The backend requires a `.env` file in the root directory with:
- `AZURE_OPENAI_BASE_URL` - Azure OpenAI endpoint URL
- `AZURE_OPENAI_KEY` - Azure OpenAI API key
- `SECRET_KEY` - Flask secret key
- `FLASK_DEBUG` - Debug mode (True/False)
- `DATABASE_URL` - Database connection string (defaults to SQLite)

### Frontend (React + Vite)

**Navigate to frontend directory:**
```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Run development server:**
```bash
npm run dev
# Server runs on http://localhost:5173
```

**Build for production:**
```bash
npm run build
```

**Lint code:**
```bash
npm run lint
```

**Preview production build:**
```bash
npm run preview
```

## Architecture

### Backend Structure

The Flask backend follows an **application factory pattern** with clear separation of concerns:

- **`app.py`** - Application factory (`create_app()`) and entry point. Initializes CORS, registers blueprints
- **`config.py`** - Centralized configuration using environment variables via `dotenv`
- **`routes/`** - Flask blueprints for API endpoints
  - `main_routes.py` - Core routes (health check, app info)
  - Routes are registered to the app via blueprint pattern
- **`services/`** - Business logic layer
  - `azure_gpt_service.py` - Azure OpenAI integration service
- **`models/`** - SQLAlchemy database models
  - Currently contains placeholder `db` instance
  - Database models to be added as features develop

**CORS Configuration:**
- Allows origins: `http://localhost:5173` (Vite dev server), `http://localhost:3000`
- Allows methods: GET, POST, PUT, DELETE, OPTIONS
- Allows headers: Content-Type, Authorization

### Frontend Structure

The React frontend uses **component-based architecture** with React Router for navigation:

- **`src/main.jsx`** - Application entry point, renders `<App />` with React.StrictMode
- **`src/App.jsx`** - Root component with Router setup, layout structure (Header/Main/Footer)
- **`src/pages/`** - Page components (route-level components)
  - `Home.jsx` - Landing page with hero section, value propositions, and CTAs
- **`src/components/`** - Reusable UI components
  - `Header.jsx` - Navigation with mobile menu toggle
  - `Footer.jsx` - Footer component
- **`src/index.css`** - Global styles with Tailwind CSS v4 import and custom brand utilities

**Routing:**
- Uses `react-router-dom` v7
- Routes defined in `App.jsx`
- Currently only `/` route is active

**Styling System:**
- Tailwind CSS v4 (via Vite plugin)
- Custom brand colors defined in `index.css`:
  - Navy: `#0F2854`
  - Blue: `#1C4D8D`
  - Light Blue: `#4988C4`
- Custom component classes: `.btn-primary`, `.btn-secondary`, `.section-title`, `.section-subtitle`
- Responsive design with mobile-first approach

**API Integration:**
- Vite proxy configured to forward `/api/*` requests to backend (`http://localhost:5000`)
- Uses `axios` for HTTP requests

## Key Architectural Patterns

### Backend

1. **Application Factory Pattern**: `create_app()` function allows for flexible configuration and easier testing
2. **Blueprint Registration**: Routes are organized as blueprints and registered to the app
3. **Configuration Management**: All config pulled from environment via `Config` class
4. **Service Layer**: Business logic separated from route handlers (see `services/`)

### Frontend

1. **Component Composition**: App built from composable, reusable components
2. **Layout Wrapper Pattern**: Common layout (Header/Footer) wraps all pages via `App.jsx`
3. **CSS-in-Tailwind**: Utility-first CSS with custom brand utilities for consistency
4. **Proxy Pattern**: Vite dev server proxies API requests to avoid CORS issues in development

## Important Notes

- **Database**: Currently using SQLAlchemy but models are placeholder. Database integration is incomplete
- **Azure OpenAI**: Service file exists (`azure_gpt_service.py`) but is empty - AI integration is planned
- **Routing**: Frontend has navigation links for `/about`, `/services`, `/news` but routes are not implemented yet
- **Language**: UI is in Vietnamese (targeting Vietnamese market)
- **Git**: Repository is not yet initialized as a git repository

## Common Workflows

### Adding a new API endpoint:
1. Define route in `backend/routes/main_routes.py` (or create new blueprint file)
2. If creating new blueprint, register it in `backend/app.py`
3. Implement business logic in `backend/services/` if needed
4. Test endpoint at `http://localhost:5000/your-route`

### Adding a new page:
1. Create page component in `frontend/src/pages/`
2. Add route to `<Routes>` in `frontend/src/App.jsx`
3. Add navigation link in `frontend/src/components/Header.jsx` if needed

### Working with Azure OpenAI:
- Configuration is loaded from `.env` via `backend/config.py`
- Access credentials via `Config.AZURE_OPENAI_KEY` and `Config.AZURE_OPENAI_BASE_URL`
- Implement service logic in `backend/services/azure_gpt_service.py`
