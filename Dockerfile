# Stage 1: Build stage
FROM node:20 AS build

WORKDIR /app

# Use build argument to inject VITE_API_URL during the build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . ./

# Build the application (production build)
RUN npm run build

# Stage 2: Production stage (Nginx to serve the app)
FROM nginx:alpine AS production

# Copy the build output from the build stage to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx to serve the app
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
