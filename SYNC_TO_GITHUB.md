# Syncing BrutalistAITrainer with GitHub

## Step 1: Install Xcode Command Line Tools

Run this command in your terminal:
```bash
xcode-select --install
```

This will open a dialog - click "Install" and wait for it to complete.

## Step 2: Check Git Status

Once command line tools are installed, check your current git status:
```bash
cd /Users/lucasmpcoelho/BrutalistAITrainer
git status
```

## Step 3: Add and Commit Any Changes

If you have uncommitted changes, add and commit them:
```bash
# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Initial commit: Brutalist AI Trainer app"
```

## Step 4: Check Current Branch

Check what branch you're on:
```bash
git branch
```

If you're not on `main` or `master`, you may want to rename it:
```bash
# If you're on a different branch (e.g., 'master'), rename it to 'main'
git branch -M main
```

## Step 5: Push to GitHub

Push your code to GitHub:
```bash
# First push - set upstream tracking
git push -u origin main
```

(If your default branch is `master` instead of `main`, use `master` in the command above)

## Step 6: Verify

Check that everything synced correctly:
```bash
git remote -v
git log --oneline -5
```

## Troubleshooting

### If the GitHub repo doesn't exist yet:
1. Go to https://github.com/new
2. Create a new repository named `BrutalistAITrainer`
3. **Don't** initialize it with a README, .gitignore, or license (since you already have code)
4. Then run Step 5 above

### If you get authentication errors:
- For HTTPS: You may need to use a Personal Access Token instead of password
- For SSH: Make sure your SSH key is added to GitHub
- GitHub guide: https://docs.github.com/en/authentication

### If you need to change the remote URL:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

## Current Configuration

- **GitHub Remote**: `origin` → `https://github.com/lucasmpcoelho/BrutalistAITrainer.git`
- **Backup Remote**: `gitsafe-backup` → `git://gitsafe:5418/backup.git`








