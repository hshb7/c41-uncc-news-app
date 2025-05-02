#!/bin/bash

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null
then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Stop any existing instance
pm2 stop c41-backend || true

# Start backend with PM2 to keep it running
pm2 start index.js --name "c41-backend" --time

# Save PM2 process list to resurrect after reboot
pm2 save

# Setup PM2 to start on system boot (might require sudo)
echo "To make the app start on boot, run: 'pm2 startup' and follow instructions"

echo "Backend deployed successfully!"
