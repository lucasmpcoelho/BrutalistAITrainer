# Preview & Share Your App Guide

## Quick Start: Local Preview with Public Link

### Option 1: Using ngrok (Recommended - Most Reliable)

1. **Install ngrok** (if not already installed):
   ```bash
   # macOS
   brew install ngrok/ngrok/ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Sign up for free ngrok account** (optional but recommended):
   - Go to https://dashboard.ngrok.com/signup
   - Get your authtoken from the dashboard
   - Run: `ngrok config add-authtoken YOUR_TOKEN`

3. **Start your app**:
   ```bash
   npm run dev
   ```

4. **In a new terminal, expose port 5000**:
   ```bash
   ngrok http 5000
   ```

5. **Share the public URL**:
   - ngrok will give you a public URL like: `https://abc123.ngrok.io`
   - Share this URL with anyone - it will forward to your local app!

### Option 2: Using localtunnel (No Installation Required)

1. **Start your app**:
   ```bash
   npm run dev
   ```

2. **In a new terminal, expose port 5000**:
   ```bash
   npx localtunnel --port 5000
   ```

3. **Share the public URL**:
   - You'll get a URL like: `https://random-name.loca.lt`
   - Share this URL!

**Note**: localtunnel URLs expire when you close the terminal. ngrok URLs are more stable.

### Option 3: Using Cloudflare Tunnel (Free, No Limits)

1. **Install cloudflared**:
   ```bash
   brew install cloudflared
   ```

2. **Start your app**:
   ```bash
   npm run dev
   ```

3. **Expose port 5000**:
   ```bash
   cloudflared tunnel --url http://localhost:5000
   ```

---

## Permanent Solution: Deploy to Hosting

### Option A: Deploy to Railway (Easiest for Full-Stack Apps)

1. **Sign up**: https://railway.app
2. **Connect your GitHub repo**
3. **Railway will auto-detect** your Node.js app
4. **Set environment variables** if needed (DATABASE_URL, etc.)
5. **Deploy** - Railway gives you a permanent URL!

**Railway is great because**:
- Free tier available
- Auto-deploys from GitHub
- Handles both frontend and backend
- Easy database setup

### Option B: Deploy to Render

1. **Sign up**: https://render.com
2. **Create a new Web Service**
3. **Connect your GitHub repo**
4. **Configure**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`
5. **Deploy** - Get a permanent URL!

### Option C: Deploy to Vercel (Frontend) + Railway/Render (Backend)

Since you have a full-stack app, you might want to:
- Deploy frontend to Vercel (free, fast CDN)
- Deploy backend to Railway/Render
- Update frontend API URLs to point to backend

---

## Quick Scripts

I've created helper scripts for you:

### Start Preview Server
```bash
./start_preview.sh
```

This will:
1. Start your app on port 5000
2. Expose it via ngrok (if installed) or localtunnel
3. Give you a shareable URL

---

## Current Setup

- **Local URL**: http://localhost:5000
- **Port**: 5000 (configurable via `PORT` environment variable)
- **Stack**: Express backend + React frontend (both served together)

---

## Tips

1. **For quick demos**: Use ngrok or localtunnel
2. **For permanent sharing**: Deploy to Railway or Render
3. **For production**: Consider separating frontend/backend and using proper hosting
4. **Environment variables**: Make sure to set any required env vars in your hosting platform

---

## Troubleshooting

### Port already in use?
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill
```

### ngrok not working?
- Make sure you've authenticated: `ngrok config add-authtoken YOUR_TOKEN`
- Check ngrok status: `ngrok config check`

### App not loading?
- Make sure `npm run dev` is running
- Check that port 5000 is accessible: `curl http://localhost:5000`








