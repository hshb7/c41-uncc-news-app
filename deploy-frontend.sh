#!/bin/bash

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build production version
ng build --configuration production

# Output path reminder
echo "Frontend built successfully! Files are in the 'dist/browser' directory."
