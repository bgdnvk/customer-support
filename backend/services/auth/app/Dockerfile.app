# Use the official Node.js image as the base image
FROM node:20-alpine

# Create the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the app files to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Start the app when the container starts
CMD [ "npm", "start" ]
