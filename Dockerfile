FROM oven/bun:latest

WORKDIR /app

# Install dependencies first (for faster caching)
COPY package.json bun.lockb ./
RUN bun install && bun install -D @sveltejs/adapter-bun

# Copy all source files and build
COPY . .
RUN bun run prepare
RUN bun run build

# Start the built bun app using the adapter-bun output
EXPOSE 3000
CMD ["bun", "run", "build/index.js"]
