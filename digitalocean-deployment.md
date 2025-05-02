# Deploying C41 UNCC News App to Your DigitalOcean Droplet

## Your Droplet Information
- IP Address: 159.223.115.55
- Full URL: http://159.223.115.55

## Prerequisites
Before deploying, make sure your DigitalOcean droplet has:
- Ubuntu 20.04 or newer
- SSH access configured
- Basic security setup (firewall, etc.)

## Step 1: Connect to Your Droplet

```bash
ssh root@159.223.115.55
```

## Step 2: Install Required Software

```bash
# Update package lists
apt update

# Install Node.js and npm (v14 or higher recommended)
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs

# Verify Node.js installation
node -v  # Should be v16.x.x
npm -v   # Should be 8.x.x

# Install NGINX
apt install -y nginx

# Start NGINX and enable it to run at boot
systemctl start nginx
systemctl enable nginx

# Install MongoDB
apt install -y mongodb

# Start MongoDB and enable it to run at boot
systemctl start mongodb
systemctl enable mongodb

# Install Git
apt install -y git

# Install PM2 globally (process manager for Node.js)
npm install -g pm2
```

## Step 3: Create Project Directory

```bash
# Create directory for the app
mkdir -p /var/www
cd /var/www
```

## Step 4: Deploy the Application

### Option A: Clone from GitHub (recommended)

If you've set up a GitHub repository:

```bash
# Clone your repository
git clone https://github.com/hshb7/c41-uncc-news-app.git c41-app
cd c41-app

# Make deployment scripts executable
chmod +x deploy*.sh

# Run the main deployment script
sudo ./deploy.sh
```

### Option B: Manual File Transfer

If you haven't set up a GitHub repository yet:

```bash
# On your local machine, open a new PowerShell window and navigate to your project
cd C:\Users\Chin\finalproject\c41-app

# Create a ZIP archive of your project (Windows PowerShell)
Compress-Archive -Path * -DestinationPath c41-app.zip

# Use SCP to transfer the ZIP file to your DigitalOcean droplet
scp c41-app.zip root@159.223.115.55:/var/www/

# Back on your DigitalOcean droplet:
cd /var/www
apt install -y unzip
unzip c41-app.zip -d c41-app
cd c41-app

# Make deployment scripts executable
chmod +x deploy*.sh

# Run the main deployment script
sudo ./deploy.sh
```

## Step 5: Configure the Application for Production

### Update Frontend API URL
Make sure the frontend points to your production API:

1. Edit frontend API URLs to use your droplet's IP address
2. Rebuild the frontend with:
   ```bash
   cd /var/www/c41-app/frontend
   ng build --configuration production
   ```

### MongoDB Configuration
Make sure MongoDB is running and properly configured:

```bash
# Check MongoDB status
systemctl status mongodb

# If needed, create/restore database
mongorestore --db c41-app /path/to/mongodb/dump
```

## Step 6: Test Your Deployment

1. Visit http://159.223.115.55 in your browser
2. Test the login functionality (username/password: your first name)
3. Verify charts are loading correctly from the backend API

## Troubleshooting

### If the Frontend Doesn't Load
Check NGINX configuration and logs:
```bash
nginx -t
cat /var/log/nginx/error.log
```

### If the Backend API Isn't Working
Check Node.js application logs:
```bash
pm2 logs c41-backend
```

### Useful Commands
```bash
# Restart NGINX
sudo systemctl restart nginx

# Restart your Node.js backend
pm2 restart c41-backend

# View running Node.js processes
pm2 list

# View real-time logs
pm2 logs
```

## Final Assignment Checklist
- [ ] Application runs on DigitalOcean droplet
- [ ] Frontend accessible on port 80 (standard HTTP)
- [ ] Backend running on port 3000
- [ ] MongoDB properly configured
- [ ] JWT authentication working
- [ ] Charts loading data from backend
- [ ] Application remains running after SSH disconnection
- [ ] GitHub repository is up to date
