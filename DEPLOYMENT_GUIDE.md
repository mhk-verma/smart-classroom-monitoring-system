# PythonAnywhere Deployment Guide
## Smart Classroom Monitoring System

This guide will help you deploy your Smart Classroom Monitoring System to PythonAnywhere's free tier.

---

## 🚀 Prerequisites

- **PythonAnywhere Account** (Free tier is sufficient)
- **GitHub Account** (to store your code)
- **Basic knowledge of using terminal/command line**

---

## 📋 Step-by-Step Deployment

### Step 1: Create PythonAnywhere Account

1. Go to [https://www.pythonanywhere.com/](https://www.pythonanywhere.com/)
2. Click "Sign up" and create a free account
3. Verify your email address
4. Log in to your new account

### Step 2: Upload Your Code to GitHub

**Option A: Using GitHub Website (Easier)**
1. Go to [https://github.com/](https://github.com/) and sign in
2. Click "+" → "New repository"
3. Name it: `smart-classroom-monitoring`
4. Make it "Public" (free tier requires public repos)
5. Click "Create repository"
6. Upload your project files:
   - Click "uploading an existing file"
   - Upload all files from your project folder
   - Include: `app.py`, `config.py`, `requirements.txt`, `Procfile`, `wsgi.py`
   - Upload entire `static/` and `templates/` folders
   - Upload module folders: `hardware/`, `vision/`, `database/`, `services/`

**Option B: Using Git Command Line**
```bash
cd "C:\Users\Mahak\CascadeProjects\min pro"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-classroom-monitoring.git
git push -u origin main
```

### Step 3: Create Web App on PythonAnywhere

1. Log in to PythonAnywhere
2. Go to **"Web"** tab (top menu)
3. Click **"+ Add a new web app"**
4. Click **"Next"**
5. Select **"Flask"**
6. Click **"Next"**
7. Select **"Python 3.10"** (or latest available)
8. Click **"Next"**
9. Enter a name for your app: `smart-classroom`
10. Click **"Next"**

### Step 4: Configure Your Web App

**A. Upload Your Code**
1. In the "Web" tab, go to **"Code"** section
2. Click **"Upload a new project"**
3. Choose **"Git repository"**
4. Enter your GitHub URL: `https://github.com/YOUR_USERNAME/smart-classroom-monitoring.git`
5. Click **"Next"**
6. PythonAnywhere will clone your repository

**B. Install Dependencies**
1. In the "Web" tab, go to **"Virtualenv"** section
2. Click **"Start a new virtualenv"**
3. Select **"Python 3.10"** (same as your web app)
4. Click **"Next"**
5. Enter path: `/home/YOUR_USERNAME/smart-classroom-monitoring/venv`
6. Click **"Create"**
7. Once created, click **"Run pip install"**
8. Enter: `requirements.txt`
9. Click **"Run"**

**C. Configure WSGI File**
1. In the "Web" tab, go to **"WSGI configuration file"** section
2. Click **"Edit"**
3. Replace the entire content with:

```python
import sys
import os

# Add your project directory to Python path
project_home = '/home/YOUR_USERNAME/smart-classroom-monitoring'
if project_home not in sys.path:
    sys.path.append(project_home)

# Import your Flask app
from app import app as application

# Set environment variables
os.environ['DEMO_MODE'] = 'True'
os.environ['SECRET_KEY'] = 'your-secret-key-change-this'
```

4. Replace `YOUR_USERNAME` with your actual PythonAnywhere username
5. Click **"Save"**

**D. Configure Static Files**
1. In the "Web" tab, go to **"Static files"** section
2. Click **"Enter a new URL"**
3. URL: `/static/`
4. Directory: `/home/YOUR_USERNAME/smart-classroom-monitoring/static`
5. Click **"Add"**

**E. Configure Working Directory**
1. In the "Web" tab, go to **"Source code"** section
2. Working directory: `/home/YOUR_USERNAME/smart-classroom-monitoring`
3. Click **"Update"**

### Step 5: Set Up Automatic Deployment

**A. Configure Reload Mechanism**
1. In the "Web" tab, go to **"Reload"** section
2. Click **"Always restart"** (for development)
3. Or click **"Restart when files change"** (for production)

**B. Set Up Git Auto-Deploy**
1. In the "Web" tab, go to **"Git"** section
2. Click **"Add new git repo"**
3. Enter your GitHub URL
4. Click **"Add"**
5. Enable **"Automatic deployment"**

### Step 6: Test Your Deployment

1. In the "Web" tab, click **"Reload"** button
2. Wait for the reload to complete
3. Click the URL link: `https://YOUR_USERNAME.pythonanywhere.com/`
4. Your Smart Classroom Dashboard should now be live!

### Step 7: Configure Domain (Optional)

**Free Subdomain:**
- Your app will be available at: `https://YOUR_USERNAME.pythonanywhere.com/`

**Custom Domain (Paid):**
1. Go to the "Web" tab
2. Click **"Add a custom domain"**
3. Enter your domain name
4. Follow the DNS setup instructions

---

## 🔧 Troubleshooting

### Common Issues:

**1. "404 Not Found" Error**
- Check that your working directory is correct
- Verify the WSGI file path is correct
- Make sure static files are configured

**2. "500 Internal Server Error"**
- Check the error logs in the "Web" tab
- Verify all dependencies are installed
- Check that `app.py` and `config.py` are in the correct location

**3. Static Files Not Loading**
- Verify static files configuration in the "Web" tab
- Check that the `/static/` URL is mapped correctly
- Ensure CSS/JS files are in the `static/` folder

**4. App Not Reloading**
- Manually click the "Reload" button in the "Web" tab
- Check the error logs for specific issues
- Verify the Git auto-deploy is working

---

## 📊 Monitoring Your App

### Check App Status:
1. Go to the "Web" tab
2. View "CPU usage" and "Memory usage"
3. Check "Error logs" and "Server logs"

### View Logs:
- **Error log**: Shows application errors
- **Access log**: Shows visitor requests
- **Server log**: Shows server startup/shutdown

---

## 🔒 Security Best Practices

1. **Change Default Secret Key**
   - In your WSGI file, replace `your-secret-key-change-this` with a random string
   - Generate one using: `python -c "import secrets; print(secrets.token_hex(32))"`

2. **Keep Dependencies Updated**
   - Regularly update your `requirements.txt`
   - Run `pip install --upgrade` in your virtualenv

3. **Monitor Logs Regularly**
   - Check for suspicious activity
   - Review error logs for issues

---

## 🎯 Next Steps

After successful deployment:

1. **Test All Features**
   - Verify dashboard loads correctly
   - Test dark mode toggle
   - Check analytics page
   - Verify settings page

2. **Share Your App**
   - Share the URL with your project guide
   - Test on different devices
   - Get feedback from users

3. **Monitor Performance**
   - Check CPU and memory usage
   - Review error logs
   - Optimize if needed

---

## 📱 Alternative Deployment Options

If PythonAnywhere doesn't work for you, try:

### 1. **Render** (Free)
- Visit: https://render.com/
- Create a "Web Service"
- Connect your GitHub repository
- Automatically deploys

### 2. **Railway** (Free Tier)
- Visit: https://railway.app/
- Import from GitHub
- Easy configuration

### 3. **Glitch** (Free)
- Visit: https://glitch.com/
- Simple drag-and-drop deployment
- Good for small projects

---

## 🆘 Support

If you encounter issues:

1. **PythonAnywhere Documentation**: https://help.pythonanywhere.com/
2. **Flask Deployment Guide**: https://flask.palletsprojects.com/en/latest/deploying/
3. **Check Error Logs**: Always check the error logs first
4. **Test Locally**: Ensure your app works locally before deploying

---

## ✅ Deployment Checklist

- [ ] PythonAnywhere account created
- [ ] Code uploaded to GitHub
- [ ] Web app created on PythonAnywhere
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] WSGI file configured
- [ ] Static files configured
- [ ] Working directory set
- [ ] App reloaded successfully
- [ ] Dashboard accessible via URL
- [ ] All features tested
- [ ] Error logs checked

---

**Your Live URL:** `https://YOUR_USERNAME.pythonanywhere.com/`

**Local Testing:** `http://127.0.0.1:5000`

**Project Location:** `/home/YOUR_USERNAME/smart-classroom-monitoring/`

---

**Congratulations! Your Smart Classroom Monitoring System is now live! 🎉**
