# Use the official Bun image as base
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Create workspace structure
RUN mkdir -p packages/api packages/db packages/client

# Copy workspace root files
COPY package.json .
COPY bun.lockb .
COPY tsconfig.json .

# Copy all packages
COPY packages/db packages/db
COPY packages/api packages/api

# Install dependencies
RUN bun install

# Set working directory to API package
WORKDIR /app/packages/api

# Expose she port your app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"]
