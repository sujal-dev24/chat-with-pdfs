FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy rest of the app
COPY . .

# Railway HTTP default port
EXPOSE 8080

# Start server
CMD ["npm", "start"]
