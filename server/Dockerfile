# Use the official Node.js Alpine image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (change to your app's port)
EXPOSE 8676

# Command to run your app
CMD ["node", "server-start.js"]
