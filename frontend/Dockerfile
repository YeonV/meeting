# Dockerfile
FROM node:20


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
# COPY ./.next/ .
COPY ./ .
RUN npx next-ws-cli@latest patch --yes

# Set environment variables
ARG NEXT_PORT
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_PORT=$NEXT_PORT
ENV PORT=$NEXT_PORT

# Build and export the app
RUN npm run build
RUN cp -r .next/static .next/standalone/.next/static
RUN cp -r public .next/standalone/public

# Expose the listening port
EXPOSE ${NEXT_PORT}

# Command to run the app
CMD [ "node", ".next/standalone/server.js"]
