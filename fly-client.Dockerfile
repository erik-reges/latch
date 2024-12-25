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
COPY packages/client packages/client

# Set the Vite API URL env var
# ENV VITE_API_URL=https://latch-cold-cloud-2771.fly.dev

# Install dependencies
RUN bun install

# Set working directory to API package
WORKDIR /app/packages/client

# Build the client
RUN bun run build

# Expose the port your app runs on
EXPOSE 3000

# Start the application in serve mode
CMD ["bun", "run", "serve"]
