# FROM node:22-slim

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --omit=dev

# COPY . .

# EXPOSE 8080

# CMD ["npm", "start"]



FROM node:22-slim

WORKDIR /app

ENV PORT=8080

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
