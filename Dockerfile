# Use the official Node.js 20 image
FROM node:20

# Create and set the working directory
WORKDIR /app

# Build arguments to accept environment variables during build
ARG VITE_API_URL

# Set environment variables within the container
ENV VITE_API_URL=${VITE_API_URL}

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Print the environment variables to verify they are set correctly
RUN echo "VITE_API_URL=$VITE_API_URL"

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]