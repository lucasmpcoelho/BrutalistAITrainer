# Quick Start Guide

## Starting the Development Server

To start the app in future sessions, you need to add Node.js to your PATH first:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

Then start the server:
```bash
npm run dev
```

## Permanent PATH Setup (Optional)

To make Node.js available in all terminal sessions, add this to your `~/.zshrc`:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

Then reload your shell:
```bash
source ~/.zshrc
```

## Access the Application

Once the server is running, open your browser to:
- **http://localhost:5000**

## Server Status

The development server is currently running in the background. To stop it, find the process:
```bash
lsof -ti:5000 | xargs kill
```

Or use:
```bash
pkill -f "npm run dev"
```

