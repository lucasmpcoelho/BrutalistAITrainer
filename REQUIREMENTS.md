# Brutalist AI Trainer - Requirements & Setup Guide

## System Requirements

### Required Software
1. **Node.js** (v20 or higher recommended)
   - The project uses ES modules and modern Node.js features
   - Check version: `node --version`
   - Install: https://nodejs.org/ or via Homebrew: `brew install node`

2. **npm** (comes with Node.js)
   - Check version: `npm --version`

### Optional Requirements
- **PostgreSQL Database** (only if you want to use database instead of in-memory storage)
  - Currently, the app uses in-memory storage (`MemStorage`) by default
  - To use PostgreSQL, set `DATABASE_URL` environment variable
  - Example: `DATABASE_URL=postgresql://user:password@localhost:5432/dbname`

## Project Structure

- **Client**: React + TypeScript + Vite frontend (in `client/` directory)
- **Server**: Express.js backend (in `server/` directory)
- **Shared**: Shared TypeScript schemas (in `shared/` directory)
- **Database**: Drizzle ORM with PostgreSQL schema (optional)

## Environment Variables

- `PORT` (optional): Server port, defaults to `5000`
- `DATABASE_URL` (optional): PostgreSQL connection string (only needed for database migrations)

## Available Scripts

- `npm run dev` - Start full-stack development server (server + client)
- `npm run dev:client` - Start only the Vite dev server (port 5000)
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run check` - Type check TypeScript
- `npm run db:push` - Push database schema changes (requires DATABASE_URL)

## Installation Steps

1. **Install Node.js** (if not already installed):
   ```bash
   # Using Homebrew (macOS)
   brew install node
   
   # Or download from https://nodejs.org/
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   - Open browser to: `http://localhost:5000`

## Current Configuration

- **Port**: 5000 (default)
- **Storage**: In-memory (`MemStorage`) - no database required for basic functionality
- **Frontend**: React 19 with Vite
- **Backend**: Express.js with TypeScript
- **UI Framework**: Radix UI components with Tailwind CSS

## Notes

- The app is configured to run on port 5000 by default
- Database is optional - the app works with in-memory storage out of the box
- The development server runs both frontend and backend together
- TypeScript is used throughout the project

