FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port (Vite default)
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]
