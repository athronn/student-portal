# ICC Student Portal - Complete System

Welcome to the Interface Computer College Student Portal! This is a complete, production-ready system for managing students, teachers, and administrators.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## ✨ Features

### For Students

- ✅ View and update profile
- ✅ Enroll in subjects
- ✅ View grades
- ✅ Read announcements
- ✅ Download learning materials
- ✅ Track tuition payments

### For Teachers

- ✅ Post announcements
- ✅ Upload course materials
- ✅ Encode student grades
- ✅ View class roster

### For Admins

- ✅ Create student and teacher accounts
- ✅ Manage user accounts
- ✅ Create and assign subjects
- ✅ Track tuition payments
- ✅ Manage announcements

### Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Force password change on first login
- ✅ Session management

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- MongoDB Atlas Account (free) - [SignUp](https://www.mongodb.com/cloud/atlas)
- Git (optional)

### 1. Setup Backend (5 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB Atlas connection
# Get your connection string from MongoDB Atlas
```

**Edit `.backend/.env`:**

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/icc-student-portal
JWT_SECRET=your-super-secret-key-change-this-to-something-secure
PORT=5000
NODE_ENV=development
```

**Run Backend:**

```bash
npm start
```

You should see:

```
✓ MongoDB connected successfully
╔════════════════════════════════════════════════════════════╗
║  ICC Student Portal Backend - Server Running               ║
║  Port: 5000                                                │
║  API Base URL: http://localhost:5000                       ║
╚════════════════════════════════════════════════════════════╝
```

### 2. Setup Frontend (2 minutes)

Open `frontend/index.html` in your browser or serve it locally:

```bash
# If you have Python 3
cd frontend
python -m http.server 8000

# OR use Node.js http-server
npm install -g http-server
cd frontend
http-server
```

Visit: `http://localhost:8000` (or port shown in terminal)

### 3. Default Admin Account

After starting the backend, seed the database with a default admin account.

**In a new terminal, run:**

```bash
cd backend
node seed-data.js
```

#### Default Credentials:

- **Email:** admin@icc.edu
- **Password:** admin123456
- **Must change password on first login**

## 📁 Project Structure

```
Student Portal/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema (Student/Teacher/Admin)
│   │   ├── Subject.js        # Course/Subject schema
│   │   ├── Grade.js          # Student grades schema
│   │   ├── Announcement.js   # Announcements schema
│   │   ├── Material.js       # Learning materials schema
│   │   └── Payment.js        # Tuition payment schema
│   │
│   ├── controllers/
│   │   ├── authController.js      # Login, password change
│   │   ├── adminController.js     # User management
│   │   ├── subjectController.js   # Subject management
│   │   ├── gradeController.js     # Grade management
│   │   ├── announcementController.js
│   │   └── paymentController.js   # Payment tracking
│   │
│   ├── middleware/
│   │   └── auth.js           # JWT verification, role checking
│   │
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── admin.js          # Admin management endpoints
│   │   ├── subject.js        # Subject endpoints
│   │   ├── grade.js          # Grade endpoints
│   │   ├── announcement.js   # Announcement endpoints
│   │   └── payment.js        # Payment endpoints
│   │
│   ├── server.js             # Express server setup
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── index.html            # Main HTML file with templates
│   ├── styles.css            # All styling
│   ├── config.js             # Configuration
│   ├── api.js                # API wrapper functions
│   ├── utils.js              # Utility functions
│   ├── auth.js               # Authentication helper
│   ├── app.js                # Main app logic
│   │
│   └── pages/
│       ├── student-dashboard.js   # Student UI logic
│       └── admin-dashboard.js     # Admin UI logic
│
└── README.md                 # This file
```

## 🔧 Local Setup - Detailed Steps

### Step 1: Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download LTS version
3. Install and verify:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a cluster (free tier available)
4. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

### Step 3: Setup Backend

```bash
# Copy the entire backend folder

# Go to backend folder
cd backend

# Install dependencies (this may take 2-3 minutes)
npm install

# Create .env file
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env

# Edit .env file with your MongoDB URI
# Use notepad (Windows) or nano (Mac/Linux)
```

**Sample .env file:**

```
MONGODB_URI=mongodb+srv://myusername:mypassword@cluster0.mongodb.net/icc-student-portal?retryWrites=true&w=majority
JWT_SECRET=this-is-a-very-secret-key-change-this-to-something-else-12345
PORT=5000
NODE_ENV=development
```

### Step 4: Run Backend

```bash
# In backend folder
npm start

# Expected output:
# ✓ MongoDB connected successfully
# ╔════════════════════════════════════════════════════════════╗
# ║  ICC Student Portal Backend - Server Running               ║
# ║  Port: 5000                                                │
# ║  API Base URL: http://localhost:5000                       ║
# ╚════════════════════════════════════════════════════════════╝
```

**Keep this terminal open!**

### Step 5: Setup Frontend

In a new terminal:

```bash
# Navigate to frontend
cd frontend

# For Windows (using Python):
python -m http.server 8000

# For Mac/Linux (using Python):
python3 -m http.server 8000

# Alternative (using Node.js):
npm install -g http-server
http-server

# Then open browser and go to:
# http://localhost:8000
```

### Step 6: Seed Default Data (Optional)

Create a file `backend/seed-data.js`:

```javascript
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create admin user
    const adminExists = await User.findOne({ email: "admin@icc.edu" });
    if (!adminExists) {
      const admin = new User({
        studentID: "ADMIN-001",
        email: "admin@icc.edu",
        password: "admin123456",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        isActive: true,
        mustChangePassword: true,
      });
      await admin.save();
      console.log("✓ Admin user created");
      console.log("  Email: admin@icc.edu");
      console.log("  Password: admin123456");
      console.log("  (Must change on first login)");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedData();
```

Run it:

```bash
node seed-data.js
```

## 🌐 Free Deployment Guide

### Option A: Deploy Backend to Render.com

1. **Create Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub or email

2. **Create New Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repo (fork this project first)
   - Or select "Public Git Repository"
   - Enter your repository URL

3. **Configure:**
   - Name: `icc-portal-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`

4. **Add Environment Variables:**
   - Click "Environment"
   - Add:
     ```
     MONGODB_URI=your_mongodb_atlas_uri
     JWT_SECRET=your-super-secret-key
     NODE_ENV=production
     PORT=5000
     ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Copy the URL (e.g., https://icc-portal-backend.onrender.com)

### Option B: Deploy Backend to Railway.app

1. **Create Account:**
   - Go to [railway.app](https://railway.app)
   - Sign up

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Connect repository

3. **Add Plugins:**
   - Add MongoDB plugin (free tier available)

4. **Deploy:**
   - Variables automatically set
   - Get your backend URL from "Public Networking"

### Deploy Frontend to Netlify (FREE)

1. **Build Frontend:**
   - Your frontend is already built (HTML/CSS/JS)

2. **Create Netlify Account:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

3. **Deploy:**
   - Drag and drop your `frontend` folder
   - OR connect GitHub repository
   - Netlify will automatically host it

4. **Update Backend URL:**
   - In `frontend/config.js`, change:
     ```javascript
     API_BASE_URL: "https://icc-portal-backend.onrender.com/api";
     ```
   - Commit and push to GitHub
   - Netlify will auto-redeploy

### Deploy Frontend to GitHub Pages (Most Free!)

1. **Create GitHub Account** (if not already)

2. **Fork or Create Repository:**
   - Create repo: `your-username/icc-student-portal`

3. **Push Frontend to GitHub:**

   ```bash
   # In frontend folder
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/icc-student-portal.git
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Select branch: `main`
   - Select folder: `/root` (or `/docs` if frontend is in docs folder)
   - Save

5. **Your frontend is now at:**
   - `https://your-username.github.io/icc-student-portal`

### Update Frontend to Use Live Backend

After deploying backend, update `frontend/config.js`:

```javascript
const Config = {
  API_BASE_URL: "https://your-deployed-backend-url/api",
  // rest of config...
};
```

Then redeploy frontend.

## 🔐 Security Best Practices

### ✅ DO:

1. **Change JWT Secret:**

   ```
   JWT_SECRET=generate-a-random-secure-string-here
   ```

   Generate one: Use [randomkeygen.com](https://randomkeygen.com/)

2. **Never Commit .env:**
   - Keep `.env` file locally only
   - Add to `.gitignore` (already done)

3. **Use HTTPS:**
   - All production URLs should be HTTPS
   - Render and Railway provide free HTTPS

4. **Validate Input:**
   - All inputs are validated both client and server side

5. **Secure Password:**
   - Passwords hashed with bcrypt (10 rounds)
   - Never store plain text passwords

6. **JWT Best Practices:**
   - Tokens stored in localStorage (auto-cleared on logout)
   - Token expires in 7 days
   - Verified on each API request

### ❌ DON'T:

1. Don't upload `.env` to GitHub
2. Don't share JWT_SECRET publicly
3. Don't use default/weak passwords
4. Don't disable authentication checks
5. Don't store tokens in URL parameters

## 🐛 Troubleshooting

### Backend won't start

**Error: `Cannot find module 'express'`**

```bash
cd backend
npm install
```

**Error: `MongoDB connection failed`**

- Check MONGODB_URI in .env
- Verify MongoDB Atlas cluster is active
- Check IP whitelist (allow 0.0.0.0/0 for testing only)

**Error: `Port 5000 already in use`**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Frontend can't connect to backend

**Error: `API_BASE_URL is not correct`**

- Update `frontend/config.js`
- Clear browser cache (Ctrl+Shift+Del)
- Restart frontend server

**CORS Error:**

- Backend CORS is already configured for local development
- For production, update backend `server.js` with your frontend URL:
  ```javascript
  app.use(
    cors({
      origin: "https://your-frontend-url.com",
    }),
  );
  ```

### Login not working

1. Verify backend is running
2. Check MongoDB connection
3. Clear localStorage and try again
4. Check browser console for errors (F12)

### MongoDB Atlas connection issues

1. Check connection string includes database name
2. Verify username/password (URL encode special characters)
3. Check whitelist includes your IP
4. Network tab in Atlas dashboard

## 📞 Support

For issues:

1. Check Troubleshooting section above
2. Check backend console for error messages
3. Check browser console (F12 → Console tab)
4. Verify all environment variables are set correctly

## 📝 Default Test Credentials

After seeding data:

- **Admin Email:** admin@icc.edu
- **Admin Password:** admin123456
- _(Must change password on first login)_

## 🎓 Next Steps

1. Customize app branding in HTML and CSS
2. Add your college logo
3. Create additional admin accounts
4. Configure payment methods
5. Set up email notifications (advanced)
6. Add profile picture uploads (advanced)

## 📄 License

This project is provided as-is for Interface Computer College, Inc.

---

**Happy Learning! 🚀**
