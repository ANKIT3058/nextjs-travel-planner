# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Build the production version of the app
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Run Prisma generate + db push + start app
CMD npx prisma generate && npx prisma db push && npm start
