# ChatGo - Real-time Chat & Video Calling App

A production-ready WhatsApp-like web application with real-time messaging and video calling capabilities.

## 🚀 Features

### Authentication
- User signup & login (email/phone)
- JWT-based authentication
- Secure password hashing (bcrypt)
- User profiles with avatar and status

### Chat System
- One-to-one real-time messaging
- Message timestamps
- Online/offline status tracking
- Typing indicators
- Message read receipts
- Emoji support

### Media Sharing
- Send images, videos, and documents
- File upload handling
- Media preview in chat

### Voice & Video Calling
- One-to-one voice and video calls (WebRTC)
- Mute/unmute microphone
- Camera on/off toggle
- Call connect & disconnect handling

### UI Features
- WhatsApp-style modern UI
- Chat list with last message preview
- Dark mode toggle
- Fully responsive (mobile + desktop)

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Socket.io Client
- WebRTC
- Axios
- React Router
- Emoji Picker React

### Backend
- Node.js
- Express.js
- Socket.io
- JWT Authentication
- Multer (file uploads)
- Bcrypt (password hashing)

### Database
- MongoDB with Mongoose

### Storage
- Cloudinary (media storage)

## 📁 Project Structure

```
CHAT APP/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── chatController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Chat.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── chatRoutes.js
│   │   └── messageRoutes.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── Chat/
│   │   │   │   ├── ChatList.jsx
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageInput.jsx
│   │   │   │   ├── Message.jsx
│   │   │   │   └── TypingIndicator.jsx
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── UserProfile.jsx
│   │   │   ├── VideoCall/
│   │   │   │   ├── VideoCall.jsx
│   │   │   │   └── CallControls.jsx
│   │   │   ├── Common/
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── EmojiPicker.jsx
│   │   │   │   └── MediaPreview.jsx
│   │   │   └── Layout/
│   │   │       └── MainLayout.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useSocket.js
│   │   │   └── useWebRTC.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── chatService.js
│   │   │   └── messageService.js
│   │   ├── utils/
│   │   │   ├── formatTime.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  avatar: String (URL),
  status: String,
  lastSeen: Date,
  isOnline: Boolean
}
```

### Chat Model
```javascript
{
  members: [ObjectId],
  isGroup: Boolean,
  groupName: String,
  groupAvatar: String,
  lastMessage: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  chatId: ObjectId,
  senderId: ObjectId,
  content: String,
  mediaUrl: String,
  mediaType: String,
  seen: Boolean,
  seenAt: Date,
  createdAt: Date
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for media storage)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

## 🌐 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment settings

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

## 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration
- File upload validation

## 📱 Features Breakdown

### Real-time Communication
- Socket.io for instant messaging
- Online/offline status updates
- Typing indicators
- Message delivery status

### WebRTC Video Calling
- Peer-to-peer video calls
- Audio/video controls
- Call notifications
- Connection status handling

### Media Handling
- Image/video/document uploads
- Cloudinary integration
- Media preview
- File size validation

## 🎨 UI/UX
- WhatsApp-inspired design
- Dark/light mode
- Smooth animations
- Mobile-first responsive design
- Loading states
- Error handling

## 🔄 API Endpoints

### Auth
- POST `/api/auth/signup` - Register user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update profile
- GET `/api/users/search` - Search users

### Chats
- GET `/api/chats` - Get all chats
- POST `/api/chats` - Create new chat
- GET `/api/chats/:id` - Get chat by ID

### Messages
- GET `/api/messages/:chatId` - Get messages
- POST `/api/messages` - Send message
- PUT `/api/messages/:id/seen` - Mark as seen

## 📝 License
MIT

## 👨‍💻 Author
Built with ❤️ for learning purposes
