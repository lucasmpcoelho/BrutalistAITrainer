# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json only (not package-lock.json to avoid platform mismatch)
COPY package.json ./

# Fresh install for Linux Alpine (resolves correct platform-specific binaries like @rollup/rollup-linux-x64-musl)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build arguments for Vite (client-side env vars)
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Set environment variables for build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package.json and install production dependencies fresh
COPY package.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Set production environment
ENV NODE_ENV=production

# Expose port (Railway sets PORT automatically)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]

