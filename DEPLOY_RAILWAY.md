# Deploy to Railway - Step by Step Guide

## Why Railway?

✅ **Perfect for your app**: Handles full-stack Express + React apps seamlessly  
✅ **Zero configuration**: Auto-detects your setup  
✅ **Free tier**: $5/month credit (usually enough for small apps)  
✅ **Auto-deploy**: Deploys automatically when you push to GitHub  
✅ **Easy database**: One-click PostgreSQL if needed  

---

## Quick Deploy (5 minutes)

### Step 1: Sign Up
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (recommended for auto-deploy)

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `lucasmpcoelho/BrutalistAITrainer`
4. Railway will auto-detect your Node.js app

### Step 3: Configure (Usually Auto-Detected)
Railway should automatically detect:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Port**: Railway sets `PORT` environment variable automatically

If not detected, manually set:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Step 4: Deploy
1. Railway will start building automatically
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://your-app-name.up.railway.app`

### Step 5: Get Your Public URL
1. Click on your service
2. Go to "Settings" → "Networking"
3. Click "Generate Domain" to get a custom domain
4. Or use the default Railway domain

---

## Environment Variables (REQUIRED)

This app uses Firebase for authentication and data storage. You **MUST** configure these variables in Railway for the app to work.

1. Go to your service → "Variables"
2. Add ALL variables listed below
3. Railway will automatically restart your app

### Server-Side Variables (Firebase Admin SDK)

These credentials come from your Firebase Console → Project Settings → Service Accounts → Generate new private key:

| Variable | Description | Example |
|----------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | `iron-ai-trainer` |
| `FIREBASE_CLIENT_EMAIL` | Service account email | `firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Service account private key (include newlines as \n) | `-----BEGIN PRIVATE KEY-----\nMIIEv...` |
| `FIREBASE_STORAGE_BUCKET` | Storage bucket name | `iron-ai-trainer.appspot.com` |
| `USE_DATA_CONNECT` | Enable Firebase Data Connect | `true` |

### Client-Side Variables (Firebase Web SDK)

These credentials come from Firebase Console → Project Settings → General → Your apps → Web app:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Web API key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain | `iron-ai-trainer.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Project ID (same as server) | `iron-ai-trainer` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket (same as server) | `iron-ai-trainer.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | App ID | `1:123456789012:web:abc123...` |

### Auto-Set by Railway (No action needed)
- `NODE_ENV=production`
- `PORT` (automatically assigned)

### Important Notes

1. **FIREBASE_PRIVATE_KEY**: When pasting the private key, ensure newlines are preserved as `\n` characters. The key should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`.

2. **Data Connect**: The app uses Firebase Data Connect with Cloud SQL PostgreSQL. Make sure Data Connect is deployed in your Firebase project (it should already be if you've been developing locally with the emulator).

3. **Firestore**: The exercise database (868 exercises) is stored in Firestore. No additional setup needed if you've already run the import script locally.

4. **Google Sign-In**: For Google authentication to work, add your Railway domain to Firebase Console → Authentication → Settings → Authorized domains

---

## Adding a Database (Optional)

If you want to use PostgreSQL instead of in-memory storage:

1. In your Railway project, click "New" → "Database" → "Add PostgreSQL"
2. Railway will create a database and set `DATABASE_URL` automatically
3. Your app will automatically use it!

---

## Custom Domain (Optional)

1. Go to your service → "Settings" → "Networking"
2. Click "Custom Domain"
3. Add your domain (e.g., `brutalist-ai-trainer.com`)
4. Follow DNS instructions to point your domain to Railway

---

## Auto-Deploy from GitHub

Railway automatically deploys when you push to GitHub!

**To enable**:
1. Make sure you connected via GitHub when creating the project
2. Railway watches your `main` branch by default
3. Every `git push` triggers a new deployment

**To change branch**:
1. Go to Settings → "Source"
2. Change the branch if needed

---

## Monitoring & Logs

- **View logs**: Click on your service → "Deployments" → Click any deployment → "View Logs"
- **Metrics**: Railway shows CPU, memory, and network usage
- **Alerts**: Set up alerts for errors or downtime

---

## Troubleshooting

### Build Fails
- Check logs in Railway dashboard
- Make sure `package.json` has correct `build` and `start` scripts
- Verify Node.js version (Railway uses latest LTS by default)

### App Won't Start
- Check that `PORT` environment variable is being used (your app already does this ✅)
- Verify `npm start` command works locally
- Check logs for specific errors
- Seeing `Application failed to respond (502)`? Confirm the build step ran first. `npm start` now has a `prestart` hook that runs `npm run build`, so Railway must either keep the default `npm install && npm run build` build command or run `npm start` locally once to generate `dist/` before deploying.

### Database Connection Issues
- Make sure `DATABASE_URL` is set (Railway sets this automatically if you add a database)
- Check that your app code handles the database URL correctly

### Port Issues
- Railway sets `PORT` automatically - your app already reads this ✅
- No configuration needed!

---

## Cost Estimate

**Free Tier**:
- $5/month credit
- Usually enough for 1-2 small apps
- ~500 hours of runtime per month

**Paid Plans**:
- Start at $5/month for more resources
- Pay-as-you-go pricing

---

## Next Steps After Deploy

1. ✅ Test your deployed app
2. ✅ Share the Railway URL with others
3. ✅ Set up custom domain (optional)
4. ✅ Add database if needed (optional)
5. ✅ Set up monitoring/alerts

---

## Pro Tips

1. **Use Railway's GitHub integration** - Auto-deploys are amazing
2. **Check logs regularly** - Railway's log viewer is excellent
3. **Use environment variables** - Never commit secrets
4. **Monitor usage** - Keep an eye on your free tier usage
5. **Database backups** - Railway handles this automatically

---

## Your App is Already Configured! 🎉

Your app is already set up perfectly for Railway:
- ✅ Uses `PORT` environment variable
- ✅ Has `build` and `start` scripts
- ✅ Serves both frontend and backend together
- ✅ Firebase Data Connect deployed to Cloud SQL
- ✅ Exercise database synced (868 exercises in Firestore)

Just:
1. Connect Railway to your GitHub repo
2. Add all Firebase environment variables (see above)
3. Add Railway domain to Firebase authorized domains
4. Deploy! 🚀

---

## Quick Environment Variables Checklist

Copy-paste this list and fill in your values:

```
# Server-side (Firebase Admin)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
USE_DATA_CONNECT=true

# Client-side (Firebase Web)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123...
```

