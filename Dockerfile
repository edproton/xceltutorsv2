# Base image using the latest Node.js version
FROM node:20-alpine AS base

# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage for installing dependencies
FROM base AS deps

# Copy package manager files for caching
COPY package.json pnpm-lock.yaml* yarn.lock* package-lock.json* ./

# Enable corepack and install dependencies using the appropriate package manager
RUN corepack enable && \
    if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Build the application
FROM base AS builder
WORKDIR /app

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the project using the appropriate package manager
RUN corepack enable && \
    if [ -f pnpm-lock.yaml ]; then pnpm run build; \
    elif [ -f yarn.lock ]; then yarn run build; \
    elif [ -f package-lock.json ]; then npm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Final stage for running the application
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system nodejs && adduser --system nextjs

# Copy the build output from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions for the Next.js cache directory
RUN chown -R nextjs:nodejs .next

# Switch to the non-root user
USER nextjs

# Expose the application port
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js server
CMD ["node", "server.js"]
