# QUICK START GUIDE

Get the ICC Student Portal running in less than 15 minutes.

## What You Need

✅ Computer (Windows, Mac, or Linux)
✅ Internet connection
✅ 5 minutes
✅ That's it!

## Step 1: Download Node.js (2 minutes)

1. Go to https://nodejs.org/
2. Click the big green "LTS" button
3. Run the installer
4. Click "Next" through all screens
5. Check the box for "Add to PATH"
6. Click "Install"

**Verify installation:**

- Open Command Prompt (Windows) or Terminal (Mac/Linux)
- Type: `node --version`
- Should show version like `v18.x.x`

## Step 2: Setup MongoDB (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email/password
4. Create a cluster (free tier)
5. Click "Connect"
6. Choose "Connect your application"
7. **Copy the connection string** - you'll need it soon

Example: `mongodb+srv://username:password@cluster.mongodb.net/...`

## Step 3: Start Backend (3 minutes)

1. Navigate to Project:

   **Windows Steps:**
   - Press `Windows Key + R`
   - Type: `cmd` and press Enter (Command Prompt opens)
   - Type this command:

   ```
   cd C:\Users\cmcar\Desktop\Student Portal\backend
   ```

   - Press Enter

   **Mac/Linux Steps:**
   - Open Terminal (Applications → Utilities → Terminal)
   - Type this command:

   ```
   cd ~/Desktop/Student\ Portal/backend
   ```

   - Press Enter

   **Verify you're in the right place:**
   - You should see `backend` in your command line path
   - If lost, type: `pwd` (Mac/Linux) or `cd` (Windows) to see current location

2. Install packages:

   ```
   npm install
   ```

   (This takes 1-2 minutes)

3. Create `.env` file:

   **Windows:** Right-click → New File → `.env`

   **Mac/Linux:** Open Terminal, type `nano .env`

4. Add this to `.env` file:

   ```
   MONGODB_URI=your-mongodb-connection-string-here
   JWT_SECRET=mySecureSecret12345ChangeThis
   PORT=5000
   NODE_ENV=development
   ```

5. Replace `your-mongodb-connection-string-here` with your actual MongoDB URL

6. Start server:
   ```
   npm start
   ```

✅ You should see:

```
✓ MongoDB connected successfully
╔════════════════════════════════════════════════════════════╗
║  ICC Student Portal Backend - Server Running               ║
║  Port: 5000                                                │
╚════════════════════════════════════════════════════════════╝
```

**KEEP THIS WINDOW OPEN!** ← Important

## Step 4: Start Frontend (1 minute)

Open a NEW terminal/command prompt:

```bash
cd "Student Portal/frontend"
```

### Windows with Python:

```bash
python -m http.server 8000
```

### Mac with Python:

```bash
python3 -m http.server 8000
```

### With Node.js (any OS):

```bash
npx http-server
```

✅ You should see:

```
Starting up http-server, serving ./
Hit CTRL-C to stop the server
http://localhost:8000
```

## Step 5: Open the Portal

1. Open your browser (Chrome, Firefox, Safari, Edge)
2. Go to: **http://localhost:8000**
3. You should see the login page

## Step 6: Create Admin Account

1. Open another terminal (keep the two above open!)
2. Go to backend folder:

   ```bash
   cd "Student Portal/backend"
   ```

3. Create default admin:

   ```bash
   node seed-data.js
   ```

4. You should see:

   ```
   ✓ MongoDB connected successfully
   👤 Creating default admin account...
   ✓ Admin account created successfully

   📋 DEFAULT ADMIN CREDENTIALS:
   Email:    admin@icc.edu
   Password: admin123456
   ```

## Step 7: Login!

1. Go back to http://localhost:8000
2. Enter:
   - **Email:** admin@icc.edu
   - **Password:** admin123456
3. Click Login
4. **Must enter new password** (security requirement)
5. Enter any 6+ character password
6. ✅ You're in!

---

## 🎉 You're Done!

Your Student Portal is running locally!

### 3 Terminal Windows Should Be Open:

1. **Backend:** `npm start`
2. **Frontend:** `python -m http.server 8000` or `npx http-server`
3. (Optional) Used for `seed-data.js`

### Access Portal:

- Go to: **http://localhost:8000**
- Email: **admin@icc.edu**
- Password: (your new password)

---

## 🎓 What to Do Next

### Create a Student Account

1. Click "Manage Users" (if admin)
2. Click "Create New Student"
3. Fill in details
4. A password will be generated

### Login as Student

1. Use the student's email
2. Use the generated password
3. Must change password on first login

### Create Subjects

1. Click "Manage Subjects"
2. Click "Create New Subject"
3. Add course code, name, semester, units

### Assign Students to Subjects

1. Click "Manage Users" → Select student
2. Click "Enroll in Subject"
3. Choose subject

### Encode Grades (As Teacher)

1. Login as teacher
2. Go to "Encode Grades"
3. Select student and subject
4. Enter grades

### Track Tuition (As Admin)

1. Go to "Payment Management"
2. Create payment record for student
3. Update amounts paid

---

## 🆘 Troubleshooting

### MongoDB won't connect

**Error:** `failed to connect to mongodb atlas`

**Fix:**

- Check connection string in .env
- Verify username/password is correct
- Check IP whitelist in MongoDB Atlas (Security → Network Access → Add IP)
- Try adding this at the end of connection string:
  ```
  ?retryWrites=true&w=majority
  ```

### Backend starts but frontend can't reach it

**Error:** `CORS error` or `Failed to connect`

**Fix:** The problem is usually the .env file. Check:

1. Backend is running (`npm start`)
2. Port is 5000
3. MONGODB_URI is set
4. Try restarting both

### Forgot password

**Fix:** Run this to reset:

```bash
node seed-data.js
```

It creates new default accounts.

### Still stuck?

1. Check console (F12) for error messages
2. Make sure 3 terminals are open and running
3. Clear browser cache (Ctrl+Shift+Del)
4. Restart browser
5. Restart both npm commands

---

## 🔑 Important Passwords

After first login, you'll create your own password.

You should change these default credentials:

**admin@icc.edu / admin123456** → Your new admin password

**teacher1@icc.edu / teacher123456** → Create proper account

**student1@icc.edu / student123456** → Create proper account

---

## 📱 Ready to Deploy?

When you're ready to go live:

1. See the **DEPLOYMENT.md** file
2. 20 minutes to make it live on the internet
3. Free hosting options included

---

## 🎯 Test Checklist

Try these actions to verify all works:

- [ ] Can login as admin
- [ ] Can create a student account
- [ ] Can create a subject
- [ ] Can enroll student in subject
- [ ] Can login as student
- [ ] Student can see their profile
- [ ] Student can see their subjects
- [ ] Can encode grades (as teacher)
- [ ] Can track payments (as admin)
- [ ] Can post announcements

---

**Congratulations! You have a working Student Portal!** 🎓

Keep these 3 windows open:

1. Backend `npm start`
2. Frontend server
3. Any new commands

---

**Questions?** Check README.md for detailed info.
**Want to deploy?** See DEPLOYMENT.md for live hosting guide.

**Happy Learning!** 🚀
