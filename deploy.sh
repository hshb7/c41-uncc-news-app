#!/bin/bash

echo "=== C41 - UNCC News App Deployment ==="
echo "This script will deploy both frontend and backend components."

# Check if running as root (needed for NGINX config)
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo for NGINX configuration."
  exit 1
fi

# Deploy backend
echo ""
echo "=== Deploying backend ==="
bash ./deploy-backend.sh

# Deploy frontend
echo ""
echo "=== Deploying frontend ==="
bash ./deploy-frontend.sh

# Configure NGINX
echo ""
echo "=== Configuring NGINX ==="

# Create directory for frontend if needed
mkdir -p /var/www/c41-app/frontend/dist

# Copy built frontend files
cp -r frontend/dist/browser /var/www/c41-app/frontend/dist/

# Setup NGINX config
cp nginx.conf /etc/nginx/sites-available/c41-app
ln -sf /etc/nginx/sites-available/c41-app /etc/nginx/sites-enabled/

# Check NGINX config for errors
nginx -t

if [ $? -eq 0 ]; then
  # Restart NGINX
  systemctl restart nginx
  echo "NGINX configured and restarted successfully!"
else
  echo "Error in NGINX configuration. Please check and fix before continuing."
  exit 1
fi

echo ""
echo "=== Deployment Complete! ==="
echo "Frontend: http://159.223.115.55"
echo "Backend API: http://159.223.115.55/api"
echo ""
echo "Remember to:"
echo "1. Update MongoDB connection string in backend if needed"
echo "2. Set up firewall rules to allow traffic on ports 80 and 3000"
echo "3. Consider setting up HTTPS for extra credit"
