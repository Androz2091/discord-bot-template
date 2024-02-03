# Base image: Node LTS
FROM node:20.4.0-alpine

# Create application directory and move there
WORKDIR /app

# Copy package.json and yarn.lock from the host to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the app
RUN yarn run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["yarn", "start"]
