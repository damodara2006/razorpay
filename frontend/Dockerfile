# Development Dockerfile for React/Vite frontend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]