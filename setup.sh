#!/bin/bash

# Brutalist AI Trainer - Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Brutalist AI Trainer - Setup Script"
echo "========================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo ""
    echo "Please install Node.js first:"
    echo ""
    echo "Option 1: Download from https://nodejs.org/ (recommended)"
    echo "  - Download the LTS version"
    echo "  - Run the installer"
    echo ""
    echo "Option 2: Using Homebrew (if installed)"
    echo "  brew install node"
    echo ""
    echo "Option 3: Using nvm (Node Version Manager)"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  nvm install 20"
    echo "  nvm use 20"
    echo ""
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js version 18+ is recommended. Current version: $(node --version)"
    echo ""
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open your browser to: http://localhost:5000"
echo ""

