# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock first for caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the app files
COPY . .

# Build the project
RUN yarn build

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["sh", "-c", "node dist/database/setup.js && node dist/index.js"]
