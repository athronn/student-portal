# 🚀 QUICK REFERENCE GUIDE

Fast lookup for common operations.

## Commands Cheat Sheet

### Start the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm install    # First time only
npm start
```

**Terminal 2 - Frontend:**

```bash
cd frontend
python -m http.server 8000    # Windows/Mac
# OR
npx http-server
```

Visit: `http://localhost:8000`

### Initialize Database

```bash
cd backend
node seed-data.js
```

**Default Credentials:**

- Email: `admin@icc.edu`
- Password: `admin123456`

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Setup

```bash
cd backend
# Create .env file with:
# MONGODB_URI=...
# JWT_SECRET=...
# PORT=5000
# NODE_ENV=development
```

---

## API Endpoint Quick Reference

### Authentication

```bash
POST   /api/auth/login
POST   /api/auth/change-password
GET    /api/auth/me
PUT    /api/auth/profile
```

### User Management (Admin)

```bash
POST   /api/admin/create-student
POST   /api/admin/create-teacher
GET    /api/admin/students
GET    /api/admin/teachers
PUT    /api/admin/deactivate/:id
PUT    /api/admin/activate/:id
POST   /api/admin/reset-password/:id
POST   /api/admin/enroll-student
```

### Subjects

```bash
GET    /api/subjects
GET    /api/subjects/:id
POST   /api/subjects
PUT    /api/subjects/:id
POST   /api/subjects/assign-teacher
```

### Grades

```bash
GET    /api/grades/student/:id
GET    /api/grades/subject/:id
POST   /api/grades/encode
```

### Announcements

```bash
GET    /api/announcements
GET    /api/announcements/:id
POST   /api/announcements
PUT    /api/announcements/:id
DELETE /api/announcements/:id
```

### Payments

```bash
GET    /api/payments
GET    /api/payments/records/:id
GET    /api/payments/balance/:id
POST   /api/payments/create
PUT    /api/payments/:id
```

---

## Example API Calls

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@icc.edu",
    "password": "admin123456"
  }'
```

### Create Student

```bash
curl -X POST http://localhost:5000/api/admin/create-student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "email": "student@icc.edu",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Create Subject

```bash
curl -X POST http://localhost:5000/api/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "code": "IT101",
    "name": "Introduction to IT",
    "units": 3,
    "semester": 1
  }'
```

### Encode Grades

```bash
curl -X POST http://localhost:5000/api/grades/encode \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "studentId": "STUDENT_ID_HERE",
    "subjectId": "SUBJECT_ID_HERE",
    "midterm": 85,
    "finals": 90,
    "projects": 88,
    "participation": 92
  }'
```

---

## File Structure Reference

```
Student Portal/
├── README.md                    ← Start here
├── QUICKSTART.md                ← 15 min setup
├── DEPLOYMENT.md                ← Go live guide
├── CONFIGURATION.md             ← Advanced setup
├── PROJECT_SUMMARY.md           ← Project overview
├── QUICK_REFERENCE.md           ← This file
│
├── backend/
│   ├── server.js                ← Main server
│   ├── package.json             ← Dependencies
│   ├── .env.example             ← Template
│   ├── seed-data.js             ← Init database
│   ├── models/                  ← Database schemas
│   ├── controllers/             ← Business logic
│   ├── routes/                  ← API endpoints
│   └── middleware/              ← Auth, etc.
│
└── frontend/
    ├── index.html               ← Main HTML
    ├── styles.css               ← All styling
    ├── app.js                   ← Main logic
    ├── config.js                ← Settings
    ├── api.js                   ← API calls
    ├── auth.js                  ← Auth logic
    ├── utils.js                 ← Helper utils
    └── pages/                   ← Page scripts
```

---

## Troubleshooting Quick Fixes

### Backend won't start

```bash
# Check Node.js installed
node --version

# Check dependencies
npm install

# Check port 5000 free
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### Frontend can't reach backend

```javascript
// Check in frontend/config.js
API_BASE_URL: "http://localhost:5000/api";

// Clear browser cache: Ctrl+Shift+Del
// Restart both servers
// Check browser console: F12
```

### Can't login

```bash
# 1. Verify backend running
# 2. Check MongoDB connected
# 3. Create default account
node seed-data.js

# 4. Try credentials
# Email: admin@icc.edu
# Password: admin123456
```

### MongoDB connection fails

```bash
# 1. Check .env file exists
# 2. Verify MONGODB_URI correct
# 3. Check IP whitelist (0.0.0.0/0 for testing)
# 4. Verify password URL-encoded if special chars
# 5. Check database name in connection string
```

---

## Common Tasks

### Change JWT Secret

```bash
# In backend/.env, change:
JWT_SECRET=new_secure_random_string_here

# Restart server:
npm start
```

### Change API Endpoint

```javascript
// In frontend/config.js, change:
API_BASE_URL: "https://your-new-backend-url/api";
```

### Reset Database

```bash
# MongoDB Atlas → Cluster → Collections
# Delete all collections manually
# OR run seed-data.js again
node seed-data.js
```

### Debug Mode

```bash
# Backend
NODE_ENV=development npm start

# Frontend - Open developer tools
F12 → Console tab → Look for errors
```

### Check Server Status

```bash
# Terminal request
curl http://localhost:5000/api/health

# Should return:
# {"status":"Server is running", "timestamp":"..."}
```

---

## User Roles & Permissions

### Student

- ✅ View own profile
- ✅ View enrolled subjects
- ✅ View own grades
- ✅ View announcements
- ✅ View tuition balance
- ✅ View payment history

### Teacher

- ✅ View students in class
- ✅ Post announcements
- ✅ Upload materials
- ✅ Encode student grades
- ✅ View class grades

### Admin (Full Access)

- ✅ Create/manage all users
- ✅ Create/manage subjects
- ✅ Manage enrollments
- ✅ Create/update payments
- ✅ Post student announcements
- ✅ Deactivate accounts
- ✅ Reset passwords

---

## Important Files

| File           | Purpose           | Edit?               |
| -------------- | ----------------- | ------------------- |
| `.env`         | Secrets/Config    | ✅ Yes (never push) |
| `config.js`    | Frontend settings | ✅ Yes              |
| `styles.css`   | Styling           | ✅ Yes              |
| `index.html`   | HTML templates    | ✅ Yes (with care)  |
| `server.js`    | Express setup     | ⚠️ Advanced         |
| `models/*.js`  | Database schema   | ⚠️ Very carefully   |
| `package.json` | Dependencies      | ⚠️ Use npm instead  |

---

## Port Reference

| Service      | Port  | URL                   |
| ------------ | ----- | --------------------- |
| Backend API  | 5000  | http://localhost:5000 |
| Frontend Dev | 8000  | http://localhost:8000 |
| Frontend Alt | 3000  | http://localhost:3000 |
| MongoDB      | 27017 | (Cloud only)          |

---

## Deployment URLs

### After Deployment

```javascript
// Update frontend/config.js to:
API_BASE_URL: "https://your-backend-url.com/api";

// Frontend will be at:
// https://your-site.netlify.app
// OR
// https://your-username.github.io/icc-student-portal
```

---

## Development Workflow

### Daily Workflow

1. Open 2 terminals
2. Terminal 1: `npm start` (backend)
3. Terminal 2: `python -m http.server 8000` (frontend)
4. Edit code (auto-reloads)
5. Test in browser (http://localhost:8000)

### Adding New Feature

1. Backend: Add route/controller
2. Frontend: Add API call in api.js
3. Frontend: Add UI in index.html
4. Frontend: Add logic in pages/
5. Test locally
6. Deploy

### Debugging

1. Backend errors: Check console
2. Frontend errors: F12 console tab
3. API errors: Network tab in DevTools
4. Database errors: MongoDB Atlas logs

---

## Performance Tips

- Use `npm start` not `nodemon` in production
- Clear browser cache when updating frontend
- Use HTTP/2 for production (automatic with HTTPS)
- Monitor database indexes
- Archive old data regularly
- Use CDN for static files
- Enable gzip compression

---

## Security Reminders

✅ Never commit `.env` to GitHub
✅ Use HTTPS on production
✅ Change all default passwords
✅ Use strong JWT secret
✅ Keep npm packages updated
✅ Review database IP whitelist
✅ Enable backups
✅ Don't expose API keys
✅ Validate all inputs
✅ Use environment variables

---

## Help & Resources

### Local Errors

Check:

- Browser console (F12)
- Backend console
- .env file is set correct
- Both servers running
- Port not in use

### MongoDB Help

- Status: https://status.mongodb.com
- Docs: https://docs.mongodb.com
- Atlas: https://atlas.mongodb.com

### Deployment Help

- Render: https://render.com/docs
- Railway: https://docs.railway.app
- Netlify: https://docs.netlify.com

---

## Quick Facts

- **Setup Time:** 15 minutes
- **Deployment Time:** 20 minutes
- **Default User:** admin@icc.edu / admin123456
- **Free Tier:** Yes, completely free
- **HTTPS:** Yes, automatic
- **Mobile Responsive:** Yes
- **Security:** Production-grade
- **Scalable:** Yes, MongoDB Atlas scales free

---

**Last Updated:** February 2025
**Version:** 1.0.0

For detailed help, see README.md or QUICKSTART.md
