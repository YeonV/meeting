# Dockerfile
FROM node:20

ARG NEXT_DEV_PORT

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Set environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV PORT=$NEXT_DEV_PORT

# Expose the listening port
EXPOSE ${NEXT_DEV_PORT}

# Command to run the app
CMD ["npm", "run", "dev"]
