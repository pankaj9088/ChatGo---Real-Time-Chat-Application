# 👥 How to Add New Users - ChatGo

## 🎯 Method 1: Through the Application (Easiest)

### Step-by-Step Guide:

1. **Open the Application in Browser**
   ```
   http://localhost:5173
   ```

2. **Go to Sign Up Page**
   - If you see the Login page, click on **"Sign Up"** or **"Create Account"** link

3. **Fill in the Details**
   - **Name**: Your full name (e.g., Pankaj Kumar)
   - **Email**: Your email address (e.g., pankaj@example.com)
   - **Phone**: Your phone number (e.g., 9876543210)
   - **Password**: A strong password (minimum 6 characters)

4. **Click the Sign Up Button**
   - Your account will be created and you'll be automatically logged in!

---

## 🧪 Method 2: Multiple Users for Testing

### To Test Chat with Two Users:

#### Create User 1:
1. Open `http://localhost:5173` in a normal browser
2. Sign up with:
   - Name: User One
   - Email: user1@test.com
   - Phone: 1111111111
   - Password: password123

#### Create User 2:
1. Open an **Incognito/Private Window** (Ctrl+Shift+N in Chrome)
2. Navigate to `http://localhost:5173`
3. Sign up with:
   - Name: User Two
   - Email: user2@test.com
   - Phone: 2222222222
   - Password: password123

#### Now Start Chatting:
1. In User 1's window: Search for "User Two" in the search box
2. Click on User Two
3. Send a message!
4. The message will appear instantly in User 2's window! 🎉

---

## 🛠️ Method 3: Via Command Line (Advanced)

If you want to quickly create multiple test users:

### Create a Single User:
```bash
cd backend
node scripts/createUser.js "John Doe" john@example.com 9876543210 password123
```

### Create Multiple Users:
```bash
# User 1
node scripts/createUser.js "Alice Smith" alice@test.com 1111111111 test123

# User 2
node scripts/createUser.js "Bob Johnson" bob@test.com 2222222222 test123

# User 3
node scripts/createUser.js "Charlie Brown" charlie@test.com 3333333333 test123
```

### Script Usage:
```bash
node scripts/createUser.js <name> <email> <phone> <password>
```

---

## 📋 Quick Test Users (Copy-Paste Ready)

Here are some ready-to-use commands:

```bash
cd backend

# Test User 1
node scripts/createUser.js "Rahul Sharma" rahul@test.com 9876543210 test123

# Test User 2
node scripts/createUser.js "Priya Patel" priya@test.com 9876543211 test123

# Test User 3
node scripts/createUser.js "Amit Kumar" amit@test.com 9876543212 test123

# Test User 4
node scripts/createUser.js "Sneha Singh" sneha@test.com 9876543213 test123
```

---

## 🔍 How to Search for Users

Once users are created:

1. **Login** to the ChatGo application
2. **Type** the user's name or email in the search box
3. **Select the user** from search results
4. **Start chatting!** 💬

---

## ✅ Verification

### Check if User was Created:

#### Method 1: In the Application
1. Login to the app
2. Search for the user's name in the search box
3. If it appears, the user was successfully created!

#### Method 2: In MongoDB (Advanced)
```bash
# Open MongoDB Shell
mongosh

# Select the database
use whatsapp-clone

# View all users
db.users.find().pretty()

# Search for a specific user
db.users.find({ email: "user1@test.com" }).pretty()
```

---

## 🎨 Avatar Customization

Users automatically get an avatar generated from their name. If you want a custom avatar:

1. Go to **Profile Settings**
2. Click on **Avatar**
3. **Upload a new image**

---

## 🚨 Common Issues and Solutions

### Issue 1: "User already exists"
**Solution**: Use a different email and phone number

### Issue 2: "Password too short"
**Solution**: Use a password with minimum 6 characters

### Issue 3: User not showing in search
**Solution**: 
- Type the exact name or email
- Refresh the page
- Check that both users are logged in

---

## 💡 Pro Tips

1. **For Testing**: Use simple passwords (e.g., test123)
2. **Email Pattern**: user1@test.com, user2@test.com, etc.
3. **Phone Pattern**: 1111111111, 2222222222, etc.
4. **Multiple Browsers**: Login with different users in Chrome, Firefox, Edge

---

## 📞 Need Help?

If you encounter any problems:
1. Check that both backend and frontend are running
2. Verify MongoDB is running
3. Check browser console for errors (press F12)

---

**Happy Chatting! 💬✨**
