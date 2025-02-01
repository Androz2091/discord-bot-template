# Base image: Node LTS
FROM node:22-alpine3.20

# Install pnpm
RUN corepack enable

# Create application directory and move there
WORKDIR /app

# Copy package.json and yarn.lock from the host to the container
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the app
RUN pnpm run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["pnpm", "start"]
