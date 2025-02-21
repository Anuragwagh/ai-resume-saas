# frontend/ai-resume-frontend/Dockerfile

FROM node:16-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
