#!/bin/bash

# Script to start the app and create a public preview URL
# This uses localtunnel (no installation required - uses npx)

set -e

echo "🚀 Starting Brutalist AI Trainer Preview..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if app is already running
if lsof -ti:5000 &> /dev/null; then
    echo "⚠️  Port 5000 is already in use"
    echo "   Stopping existing process..."
    lsof -ti:5000 | xargs kill || true
    sleep 2
fi

# Start the app in the background
echo "📦 Starting development server..."
npm run dev > /tmp/brutalist-dev.log 2>&1 &
DEV_PID=$!

echo "   Development server started (PID: $DEV_PID)"
echo "   Waiting for server to be ready..."

# Wait for server to start
for i in {1..30}; do
    if curl -s http://localhost:5000 > /dev/null 2>&1; then
        echo "✅ Server is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Server failed to start. Check logs: /tmp/brutalist-dev.log"
        kill $DEV_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

echo ""
echo "🌐 Creating public tunnel..."
echo "   (This may take a few seconds...)"
echo ""

# Start localtunnel
npx --yes localtunnel --port 5000 > /tmp/brutalist-tunnel.log 2>&1 &
TUNNEL_PID=$!

# Wait a moment for tunnel to establish
sleep 5

# Try to extract the URL from the log
TUNNEL_URL=$(grep -o 'https://[^ ]*\.loca\.lt' /tmp/brutalist-tunnel.log 2>/dev/null | head -1 || echo "")

if [ -z "$TUNNEL_URL" ]; then
    echo "⚠️  Could not automatically extract tunnel URL"
    echo "   Check the output above for your public URL"
    echo "   Or check: /tmp/brutalist-tunnel.log"
else
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Your app is now publicly accessible!"
    echo ""
    echo "   🌍 Public URL: $TUNNEL_URL"
    echo "   🏠 Local URL:  http://localhost:5000"
    echo ""
    echo "   Share the public URL with anyone!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

echo ""
echo "📝 Logs:"
echo "   App:    /tmp/brutalist-dev.log"
echo "   Tunnel: /tmp/brutalist-tunnel.log"
echo ""
echo "🛑 To stop:"
echo "   Press Ctrl+C or run: kill $DEV_PID $TUNNEL_PID"
echo ""

# Keep script running
wait









