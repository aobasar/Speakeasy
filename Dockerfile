# Use a lightweight Node.js image https://hub.docker.com/_/node 
FROM node:24-alpine

# Set working directory
WORKDIR /src

# Set environment variables
ENV NODE_ENV="production"

# Copy package*.json and .env dependencies
COPY package*.json ./
COPY .env.template ./.env

# Rename config.template.js to config.js
COPY ./app/src/config.template.js ./app/src/config.js

# Install necessary system packages
RUN apk add --no-cache bash vim

# Install Node.js dependencies (fail the build immediately if install fails,
# so a broken arm64 image is never published)
RUN npm ci --omit=dev --silent \
    && npm cache clean --force \
    && rm -rf /tmp/* /var/tmp/* /usr/share/doc/*

# Copy the application code
COPY app app
COPY public public

# AOB Speakeasy branding: swap MiroTalk's footer for ours at build time.
# The view files above are kept byte-identical to upstream on purpose — that is
# what stops the daily upstream-sync merge from conflicting in six HTML files
# every release. See aob-brand/README.md.
COPY aob-brand aob-brand
RUN node aob-brand/apply.js

# Run as the non-root "node" user (uid/gid 1000) shipped with the base image
RUN chown -R node:node /src
USER node

# Health check: app is healthy when /brand (no-auth config endpoint) responds 200.
# Lets Coolify keep the old container running if a new deploy never becomes healthy.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- "http://127.0.0.1:${PORT:-3000}/brand" >/dev/null 2>&1 || exit 1

# Set default command to start the application
CMD ["npm", "start"]