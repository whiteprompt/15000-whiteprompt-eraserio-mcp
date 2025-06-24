FROM node:20-alpine

# Install basic tools
RUN apk add --no-cache git bash

# Create workspace directory
WORKDIR /workspace

# Install global tools
RUN npm install -g typescript tsx @typescript-eslint/eslint-plugin @typescript-eslint/parser

# User creation is handled by common-utils feature in devcontainer.json

# Set bash as default shell
SHELL ["/bin/bash", "-c"]