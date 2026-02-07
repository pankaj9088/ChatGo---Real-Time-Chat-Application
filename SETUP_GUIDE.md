# WhatsApp Clone - Setup Guide

## 🚀 Quick Start Guide

This guide will help you set up and run the WhatsApp Clone application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **Cloudinary Account** (for media storage) - [Sign up](https://cloudinary.com/)

## Step 1: Install Dependencies

### Backend Setup

1. Open a terminal and navigate to the backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

## Step 2: Configure Environment Variables

### Backend Configuration

1. The `.env` file is already created in the `backend` directory
2. Update the following values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-clone
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Important:** Replace the Cloudinary credentials with your actual values from your Cloudinary dashboard.

### Frontend Configuration

The frontend `.env` file is already configured with default values:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Step 3: Start MongoDB

### Option 1: Local MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas
If using MongoDB Atlas, update the `MONGODB_URI` in backend `.env` with your Atlas connection string.

## Step 4: Run the Application

### Start Backend Server

In the backend terminal:
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 WhatsApp Clone Server is running!
📡 Server: http://localhost:5000
```

### Start Frontend Development Server

In the frontend terminal:
```bash
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

## Step 5: Access the Application

1. Open your browser and go to: **http://localhost:5173**
2. Create a new account using the signup page
3. Login and start chatting!

## 🎯 Testing the Application

### Test Real-time Chat
1. Open the app in two different browsers (or incognito mode)
2. Create two different accounts
3. Search for the other user and start a chat
4. Send messages and see them appear in real-time

### Test Video Calling
1. In an active chat, click the video call icon
2. Accept the call in the other browser
3. Test mute/unmute and video on/off features

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the connection string in `.env`
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the PORT in backend `.env`
- Update VITE_API_URL and VITE_SOCKET_URL in frontend `.env`

### Cloudinary Upload Errors
- Verify your Cloudinary credentials
- Check your Cloudinary dashboard for API limits

### Socket Connection Issues
- Ensure backend server is running
- Check browser console for errors
- Verify CORS settings in backend

## 📱 Features to Test

- ✅ User Authentication (Signup/Login)
- ✅ Real-time Messaging
- ✅ Online/Offline Status
- ✅ Typing Indicators
- ✅ Message Read Receipts
- ✅ Emoji Support
- ✅ Media Sharing (Images, Videos, Documents)
- ✅ Video Calling (WebRTC)
- ✅ Dark/Light Mode
- ✅ Responsive Design

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to Vercel
```

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

## 📝 Default Test Accounts

You can create test accounts with these sample credentials:

**User 1:**
- Name: John Doe
- Email: john@example.com
- Password: password123

**User 2:**
- Name: Jane Smith
- Email: jane@example.com
- Password: password123

## 🆘 Need Help?

If you encounter any issues:
1. Check the terminal logs for errors
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check MongoDB connection
5. Verify Cloudinary credentials

## 🎉 You're All Set!

Enjoy using your WhatsApp Clone application!
