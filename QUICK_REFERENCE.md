# ⚡ Quick Reference Guide

## 🚀 Quick Start Commands

### Start Both Servers (Recommended)
```powershell
.\start.ps1
```

### Start Backend Only
```bash
cd backend
npm run dev
```

### Start Frontend Only
```bash
cd frontend
npm run dev
```

---

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health | http://localhost:5000/api/health |

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-clone
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🗂️ Project Structure

```
CHAT APP/
├── backend/          # Node.js backend
├── frontend/         # React frontend
├── README.md         # Overview
├── SETUP_GUIDE.md    # Setup instructions
├── DOCUMENTATION.md  # Technical docs
├── PROJECT_SUMMARY.md # Complete summary
└── start.ps1         # Quick start script
```

---

## 🔑 Key Features Checklist

- [x] User Authentication (Signup/Login)
- [x] Real-time Messaging
- [x] Online/Offline Status
- [x] Typing Indicators
- [x] Read Receipts
- [x] Emoji Support
- [x] Media Sharing (Images/Videos/Docs)
- [x] Video Calling (WebRTC)
- [x] Dark/Light Mode
- [x] Responsive Design

---

## 🛠️ Common Commands

### Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Build for Production
```bash
# Frontend
cd frontend && npm run build
```

### Check MongoDB Status
```bash
# Windows
net start MongoDB

# Check if running
mongo --eval "db.stats()"
```

---

## 🐛 Troubleshooting

### MongoDB Not Running
```bash
# Windows
net start MongoDB

# Or use MongoDB Atlas
```

### Port Already in Use
- Change PORT in backend/.env
- Update frontend/.env URLs

### Cloudinary Errors
- Verify credentials in backend/.env
- Check Cloudinary dashboard

### Socket Connection Failed
- Ensure backend is running
- Check CORS settings
- Verify Socket URL in frontend/.env

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Project overview |
| SETUP_GUIDE.md | Detailed setup steps |
| DOCUMENTATION.md | Technical documentation |
| PROJECT_SUMMARY.md | Complete feature list |
| QUICK_REFERENCE.md | This file |

---

## 🎯 Testing Checklist

### Basic Flow
1. [ ] Start MongoDB
2. [ ] Start backend server
3. [ ] Start frontend server
4. [ ] Create account
5. [ ] Login
6. [ ] Search for users
7. [ ] Send messages
8. [ ] Upload media
9. [ ] Make video call
10. [ ] Toggle dark mode

### Two-User Testing
1. [ ] Open in two browsers
2. [ ] Create two accounts
3. [ ] Start chat
4. [ ] Test real-time messaging
5. [ ] Test typing indicators
6. [ ] Test read receipts
7. [ ] Test video calling

---

## 🔐 Default Ports

| Service | Port |
|---------|------|
| Frontend | 5173 |
| Backend | 5000 |
| MongoDB | 27017 |

---

## 📦 Tech Stack Summary

**Backend**: Node.js + Express + MongoDB + Socket.IO  
**Frontend**: React + Vite + Tailwind CSS  
**Real-time**: Socket.IO  
**Video**: WebRTC  
**Storage**: Cloudinary  
**Auth**: JWT + Bcrypt  

---

## 🚀 Deployment Checklist

### Frontend (Vercel)
- [ ] Build project (`npm run build`)
- [ ] Deploy dist folder
- [ ] Set environment variables
- [ ] Test deployment

### Backend (Render)
- [ ] Push to GitHub
- [ ] Connect repository
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test API endpoints

### Database (MongoDB Atlas)
- [ ] Create cluster
- [ ] Whitelist IPs
- [ ] Create user
- [ ] Update connection string

---

## 💡 Pro Tips

1. **Use two browsers** for testing real-time features
2. **Check browser console** for errors
3. **Monitor terminal logs** for backend issues
4. **Test on mobile** for responsive design
5. **Use dark mode** for better experience

---

## 📞 Support

If stuck, check:
1. Terminal error logs
2. Browser console
3. Environment variables
4. MongoDB connection
5. Cloudinary credentials

---

## ⚡ Quick Commands Reference

```bash
# Start everything
.\start.ps1

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Install all
cd backend && npm install && cd ../frontend && npm install

# Build frontend
cd frontend && npm run build
```

---

**Happy Coding! 🎉**
