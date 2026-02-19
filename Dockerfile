FROM oven/bun:latest

WORKDIR /app

# Install dependencies first (for faster caching)
COPY package.json bun.lockb ./
RUN bun install

# Copy all source files and build
COPY . .
RUN bun run build

# Start the built bun app using the adapter-bun output
EXPOSE 3000
CMD ["bun", "run", "build/index.js"]
