# Configuration & Setup Guide

Complete guide for configuring the ICC Student Portal for your institution.

## 📋 Initial Configuration

### 1. Backend Configuration

#### Environment Variables (.env file)

Create `backend/.env` with these variables:

```env
# MongoDB Cloud Database
# Get from MongoDB Atlas → Connect → Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/icc-student-portal?retryWrites=true&w=majority

# JWT Token Secret
# Use: https://randomkeygen.com/ to generate a secure string
JWT_SECRET=YourSuperSecretKeyHere12345ChangeThis

# Server Port (default: 5000)
PORT=5000

# Environment Mode
NODE_ENV=development
```

#### MongoDB Atlas Setup

1. **Create Account:**
   - Go to https://mongodb.com/cloud/atlas
   - Sign up for free
   - Verify email

2. **Create Cluster:**
   - Click "Create" cluster
   - Select "Free" tier
   - Choose AWS and nearest region
   - Click "Create Cluster" (wait 5 minutes)

3. **Get Connection String:**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Add database name: `.../icc-student-portal?...`

4. **IP Whitelist:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For testing: `0.0.0.0/0` (allows all IPs)
   - For production: Only add specific IPs

5. **Create Database User:**
   - Go to "Database Access"
   - Create a user with password
   - Remember the credentials for connection string

### 2. Frontend Configuration

#### API Endpoint

Edit `frontend/config.js`:

```javascript
const Config = {
  // Local Development
  API_BASE_URL: "http://localhost:5000/api",

  // For Production - Update with your live backend URL
  // API_BASE_URL: 'https://your-backend-url.com/api',

  APP_NAME: "ICC Student Portal",

  STORAGE_KEYS: {
    TOKEN: "icc_token",
    USER: "icc_user",
    THEME: "icc_theme",
  },
};
```

#### Customize Branding

Edit `frontend/index.html`:

1. **Page Title:**

   ```html
   <title>Your College Name - Student Portal</title>
   ```

2. **Header Text:**

   ```html
   <h1>Your College Name</h1>
   <p>Student Portal</p>
   ```

3. **Browser Title:**
   - In login page template
   - In dashboard header

Edit `frontend/styles.css`:

1. **Brand Colors:**

   ```css
   :root {
     --color-light-green: #90ee90; /* Light color */
     --color-green: #2e8b57; /* Main color */
     --color-dark-green: #1b5a3e; /* Dark accent */
     --color-black: #1a1a1a;
     --color-white: #ffffff;
   }
   ```

2. **Add Logo:**
   ```html
   <!-- In sidebar -->
   <div class="logo">
     <img src="path-to-logo.png" alt="College Logo" />
     <h3>Your College</h3>
   </div>
   ```

---

## 🔧 Production Setup

### Backend Deployment Environment

Update `backend/.env` for production:

```env
MONGODB_URI=mongodb+srv://prod_user:prod_password@prodcluster.mongodb.net/icc-student-portal?retryWrites=true&w=majority

JWT_SECRET=GenerateVerySecureRandomString_ChangeMe_ToBeSafeFromHacking123456

PORT=5000

NODE_ENV=production
```

### Frontend Deployment Configuration

Update `frontend/config.js` for production:

```javascript
const Config = {
  // Change to your production backend URL
  API_BASE_URL: "https://icc-portal-backend.onrender.com/api",
  // OR
  // API_BASE_URL: 'https://icc-portal.up.railway.app/api',

  APP_NAME: "ICC Student Portal",

  STORAGE_KEYS: {
    TOKEN: "icc_token",
    USER: "icc_user",
    THEME: "icc_theme",
  },
};
```

---

## 👥 User Management

### Create Admin Account

Run seed script:

```bash
cd backend
node seed-data.js
```

**Default Credentials:**

- Email: admin@icc.edu
- Password: admin123456

### Create Additional Admins

1. Login as admin at portal
2. Go to "Manage Users"
3. Click "Create New Student" or "Create New Teacher"
4. Manually change role in database (advanced)

Or via API:

```bash
curl -X POST http://localhost:5000/api/admin/create-student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "email": "newadmin@icc.edu",
    "firstName": "New",
    "lastName": "Admin"
  }'
```

---

## 📊 Database Structure

### Collections Created

1. **users** - Student, teacher, admin accounts
2. **subjects** - Courses/classes
3. **grades** - Student grades per subject
4. **announcements** - News and updates
5. **materials** - Learning resources
6. **payments** - Tuition tracking

### Sample Data Import

Create `backend/sample-data.js`:

```javascript
const Subject = require("./models/Subject");

// Sample subjects
const subjects = [
  {
    code: "IT101",
    name: "Introduction to IT",
    description: "Fundamentals of Information Technology",
    units: 3,
    semester: 1,
  },
  {
    code: "IT102",
    name: "Web Development",
    description: "Learn HTML, CSS, JavaScript",
    units: 3,
    semester: 1,
  },
  // Add more...
];

// Insert
Subject.insertMany(subjects);
```

Run:

```bash
node sample-data.js
```

---

## 🔐 Security Configuration

### Change Default Passwords

**Immediately after setup:**

1. Login as admin@icc.edu
2. Go to Profile
3. Change password to strong one
4. Remember new password!

### Generate Secure JWT Secret

1. Visit: https://randomkeygen.com/
2. Copy "CodeIgniter Encryption Keys" string
3. Use as JWT_SECRET in .env

Example secure keys:

```
nB4fmR@2xK#9pL$mQ8vJ%wZ3cD7yT1sU6eA5cG2hY
dX9wK3bM6fL@2pJ$nQ8vC5yT1sR4eW7hZ0mA3dF
```

### Enable HTTPS

**Local:** Not needed (localhost only)

**Production:**

- Render: Automatic (free SSL)
- Railway: Automatic (free SSL)
- Netlify: Automatic (free SSL)

### Rate Limiting (Advanced)

Add to `backend/server.js`:

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

---

## 📧 Email Notifications (Optional)

Add to `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@icc.edu
```

Add to `backend/server.js`:

```javascript
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Use for sending emails when accounts created, etc.
```

---

## 📱 Mobile Responsive Setup

Already configured in `frontend/styles.css`

Test on:

- Desktop: 1920x1080, 1024x768
- Tablet: iPad (768x1024)
- Mobile: iPhone (375x667), Android (360x640)

Responsive breakpoints:

```css
@media (max-width: 768px) {
  /* Tablets */
}
@media (max-width: 480px) {
  /* Mobile */
}
```

---

## 🌍 Localization (Optional)

Add language support:

1. Create `frontend/i18n/en.json`:

```json
{
  "sidebar": {
    "profile": "My Profile",
    "subjects": "My Subjects"
  }
}
```

2. Create `frontend/i18n/es.json` (español, etc.)

3. Update config:

```javascript
const Config = {
  LANGUAGE: "en", // or 'es', 'fr', etc.
  // ...
};
```

---

## 🎨 Custom Theme

Create `frontend/custom-theme.css`:

```css
:root {
  --color-primary: #0066cc;
  --color-secondary: #ff6600;
  --color-success: #00aa44;
  --color-danger: #ff0000;
}
```

Include in `index.html`:

```html
<link rel="stylesheet" href="custom-theme.css" />
<link rel="stylesheet" href="styles.css" />
```

---

## 📂 File Upload Setup

To enable file uploads:

1. Install multer:

```bash
npm install multer
```

2. Add to `backend/routes/material.js`:

```javascript
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), (req, res) => {
  // Handle file upload
});
```

3. Serve static files in `server.js`:

```javascript
app.use(express.static("uploads"));
```

---

## ✅ Configuration Checklist

Before going live:

- [ ] MongoDB Atlas account created
- [ ] MONGODB_URI tested and working
- [ ] JWT_SECRET generated and set
- [ ] Default admin account created
- [ ] Updated branding in HTML/CSS
- [ ] Tested login/logout flow
- [ ] Tested all user roles
- [ ] Configured email (if using)
- [ ] Set up file uploads (if using)
- [ ] Reviewed security settings
- [ ] Backup strategy in place
- [ ] Deployed to production server

---

## 📞 Configuration Support

### Common Issues

**"Cannot connect to MongoDB"**

- Check MONGODB_URI syntax
- Verify credentials
- Check IP whitelist

**"Port 5000 already in use"**

- Change PORT in .env
- Or kill process using port

**"CORS error from frontend"**

- Check API_BASE_URL in config.js
- Clear browser cache

---

## 🔄 Update Procedures

### Update Dependencies

```bash
cd backend
npm update
```

### Backup Database

```bash
# MongoDB Atlas autom atically backs up
# Or use CLI:
mongodump --uri="your_connection_string" --out=./backup
```

### Update Environment Variables

Edit `.env` and restart:

```bash
npm start
```

---

**Configuration Complete!** 🎉

Your ICC Student Portal is now ready for operation.

Next: See DEPLOYMENT.md to go live, or QUICKSTART.md to run locally.
