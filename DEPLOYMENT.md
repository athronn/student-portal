# 🚀 DEPLOYMENT GUIDE - Step by Step

Complete guide to deploy ICC Student Portal to a live website for free.

## 📋 Overview

This guide covers:

- Backend deployment (Render or Railway)
- Frontend deployment (Netlify or GitHub Pages)
- Connecting everything together
- Going live in production

## ⏱️ Time Required

- **Backend setup:** 10 minutes
- **Frontend setup:** 5 minutes
- **Configuration:** 5 minutes
- **Total:** ~20 minutes

---

## OPTION 1: Render + Netlify (RECOMMENDED)

Simple, free tier available, good performance.

### Backend Setup on Render.com

#### Step 1: Fork Repository

1. Go to GitHub: https://github.com
2. Sign up if you don't have account
3. Create a new repository:
   - Name: `icc-student-portal`
   - Make it public
   - Add README

#### Step 2: Upload Files to GitHub

Create these files in your repository:

**In root folder:**

```
.gitignore
package.json (in backend folder only)
.env.example (in backend folder only)
```

Sample `.gitignore`:

```
node_modules/
.env
.env.local
.DS_Store
*.log
```

#### Step 3: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your GitHub

#### Step 4: Deploy Backend

1. Click "New" → "Web Service"
2. Select "Public Git repository"
3. Paste your GitHub URL:
   ```
   https://github.com/your-username/icc-student-portal
   ```
4. Click "Continue"

5. Configure:
   - **Name:** `icc-student-portal-backend`
   - **Environment:** `Node`
   - **Build command:** `npm install`
   - **Start command:** `cd backend && node server.js`
   - **Branch:** `main`

6. Add Environment Variables (click "+ Add Environment Variable"):

   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/icc-student-portal
   JWT_SECRET = your-super-secret-key-12345
   NODE_ENV = production
   PORT = 5000
   ```

7. Click "Create Web Service"

8. Wait 3-5 minutes for deployment

9. Copy your deployment URL (e.g., `https://icc-student-portal-backend.onrender.com`)

### Frontend Setup on Netlify

#### Step 1: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

#### Step 2: Update Backend URL

In `frontend/config.js`, change:

```javascript
API_BASE_URL: "https://icc-student-portal-backend.onrender.com/api";
```

#### Step 3: Deploy Frontend

1. On Netlify: Click "New site from Git"
2. Select GitHub
3. Choose your repository
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** (leave empty)
   - **Publish directory:** `frontend`

5. Click "Deploy site"

6. Wait 1-2 minutes

7. You'll get a URL like: `https://your-site-name.netlify.app`

#### Step 4: Go Live

Your portal is now live! 🎉

**Access at:** `https://your-site-name.netlify.app`

---

## OPTION 2: Railway + GitHub Pages

Very easy setup, completely free.

### Backend Setup on Railway.app

#### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository
4. Choose backend folder

#### Step 3: Add MongoDB

1. Click "New" → "Database"
2. Select "MongoDB"
3. Accept default settings
4. It will auto-generate connection string

#### Step 4: Deploy

1. Railway auto-deploys from git
2. Get your backend URL from "Public Networking"
3. Copy the URL (e.g., `https://your-project.up.railway.app`)

### Frontend Setup on GitHub Pages

#### Step 1: Enable GitHub Pages

1. Go to your repository
2. Settings → Pages
3. Source: `Deploy from a branch`
4. Branch: `main`
5. Folder: `/frontend` (or root if frontend is in root)
6. Save

#### Step 2: Update Backend URL

In `frontend/config.js`:

```javascript
API_BASE_URL: "https://your-project.up.railway.app/api";
```

Commit and push:

```bash
git add .
git commit -m "Update backend URL"
git push
```

#### Step 3: Access

Your portal is now at:
`https://your-username.github.io/icc-student-portal`

---

## OPTION 3: Heroku + GitHub Pages (Free Tier Ending)

Note: Heroku free tier was discontinued. Use Render or Railway instead.

---

## 📱 Post-Deployment Checklist

After deployment, verify:

- [ ] Backend is running (check health endpoint)
- [ ] Frontend loads without errors
- [ ] Can login with admin account
- [ ] Can navigate between pages
- [ ] Database operations work (create, read, update)
- [ ] Images and styles load correctly
- [ ] Mobile responsive works
- [ ] No console errors (F12 to check)

### Test Backend Health

Visit: `https://your-backend-url/api/health`

Should see:

```json
{
  "status": "Server is running",
  "timestamp": "2024-02-16T10:30:00.000Z"
}
```

### Test Login

Use these credentials:

- Email: `admin@icc.edu`
- Password: `admin123456`

Note: Must change password on first login.

---

## 🔧 Environment Variables Explained

### JWT_SECRET

- Secret key for token signing
- Generate secure string: [randomkeygen.com](https://randomkeygen.com/)
- Example format:
  ```
  nB4fmR@2xK#9pL$mQ8vJ%wZ3cD7yT1sU
  ```

### MONGODB_URI

- Connection string to MongoDB Atlas
- Format:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
  ```
- Find in MongoDB Atlas → Cluster → Connect → Connect your Application

### NODE_ENV

- Set to `production` for live deployment
- Set to `development` for local testing

---

## 🚨 Common Issues

### 1. Backend won't deploy

**Check:**

- package.json exists in backend folder
- All dependencies listed
- No syntax errors

**Fix:**

```bash
cd backend
npm install
node server.js
```

### 2. Frontend can't reach backend

**Symptoms:** Login button doesn't work, CORS error

**Fix:**

- Update `frontend/config.js` with correct backend URL
- Clear browser cache (Ctrl+Shift+Del)
- Check Network tab in DevTools

### 3. Database connection fails

**Check:**

- MongoDB URI is correct
- Password doesn't have special characters (or URL encoded)
- IP whitelist includes deployment server IP
- Database exists

**In MongoDB Atlas:**

1. Click cluster name
2. Go to "Database Access"
3. Check username/password
4. Go to "Network Access"
5. Add IP (or 0.0.0.0/0 for testing only)

### 4. Login not working

**Check:**

- Backend is running
- Database is connected
- Environment variables are set
- Default admin account created:
  ```bash
  cd backend
  node seed-data.js
  ```

### 5. Page shows "No subjects enrolled yet"

This is normal! Admin needs to:

1. Create subjects
2. Create students
3. Enroll students in subjects

---

## 📊 Database Backup (Important!)

### Backup MongoDB Atlas Database

1. Go to MongoDB Atlas
2. Click cluster name
3. Click "Backup" tab
4. Click "Create a Backup"
5. Download when ready

Keep regular backups!

---

## 🔐 Production Security Checklist

Before going fully live:

- [ ] Change all default passwords
- [ ] Update JWT_SECRET to strong random string
- [ ] Set MONGODB_URI environment variable
- [ ] Enable HTTPS (automatic on Render/Railway/Netlify)
- [ ] Set NODE_ENV=production
- [ ] Review CORS settings
- [ ] Database backups enabled
- [ ] Monitor error logs
- [ ] Test all user roles
- [ ] Clear sensitive data from code
- [ ] Review security in code comments

---

## 📈 Monitoring & Maintenance

### Monitor Backend

1. **Render:** Dashboard → Logs tab
2. **Railway:** Deployments → View logs
3. **Check:** No errors, clean exits

### Monitor Database

1. MongoDB Atlas Dashboard
2. Check connection count
3. Monitor storage usage
4. Review logs

### Regular Tasks

- Weekly: Check error logs
- Monthly: Review security
- Quarterly: Test backups
- Annually: Update dependencies

---

## 🎓 Next Steps

1. **Customize branding:**
   - Update app name in config.js
   - Change colors in styles.css
   - Add college logo

2. **Add features:**
   - Email notifications
   - File uploads
   - Messaging system
   - Attendance tracking

3. **Performance:**
   - Enable caching
   - Optimize images
   - Minify CSS/JS
   - Use CDN for assets

4. **Analytics:**
   - Track user behavior
   - Monitor performance
   - Analyze usage patterns

---

## 📞 Deployment Support

### Render Support

- Docs: https://render.com/docs
- Status: https://status.render.com
- Email: support@render.com

### Netlify Support

- Docs: https://docs.netlify.com
- Status: https://www.netlify.com/status
- Chat: Available in dashboard

### Railway Support

- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### MongoDB Support

- Docs: https://docs.mongodb.com
- Community: https://www.mongodb.com/community

---

## ✅ Success!

Your Student Portal is now live and ready for students! 🎓

**Share the link with:**

- Students: To access their portal
- Teachers: To manage grades
- Administrators: To manage the system

---

**Last Updated:** February 2024
**Version:** 1.0.0
