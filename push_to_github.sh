#!/bin/bash

# Script to push BrutalistAITrainer to GitHub
# Run this after Xcode command line tools are installed

set -e  # Exit on error

echo "🚀 Pushing BrutalistAITrainer to GitHub..."
echo ""

# Check if git is working
if ! git --version > /dev/null 2>&1; then
    echo "❌ Error: Git is not working. Please install Xcode command line tools first:"
    echo "   Run: xcode-select --install"
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")"

# Check current status
echo "📊 Checking git status..."
git status

echo ""
echo "📦 Adding all files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✅ No changes to commit - repository is up to date"
else
    echo "💾 Committing changes..."
    git commit -m "Update: Brutalist AI Trainer - $(date +%Y-%m-%d)"
fi

# Ensure we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching to main branch..."
    git checkout main || git branch -M main
fi

echo ""
echo "🔗 Checking remote configuration..."
git remote -v

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "🌐 View your repo at: https://github.com/lucasmpcoelho/BrutalistAITrainer"







