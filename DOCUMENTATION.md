# WhatsApp Clone - Technical Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Features](#features)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Socket Events](#socket-events)
8. [WebRTC Implementation](#webrtc-implementation)
9. [Security](#security)
10. [Deployment](#deployment)

---

## 🎯 Project Overview

A production-ready WhatsApp clone featuring real-time messaging, video calling, and modern UI/UX. Built with the MERN stack and Socket.IO for real-time communication.

### Key Highlights
- **Real-time messaging** with Socket.IO
- **Video/Voice calling** with WebRTC
- **Media sharing** (images, videos, documents)
- **Online status** tracking
- **Typing indicators** and read receipts
- **Dark/Light mode** toggle
- **Responsive design** (mobile + desktop)

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │ ◄─────► │   Backend   │ ◄─────► │   MongoDB   │
│  (React)    │  HTTP   │  (Express)  │  Mongoose│             │
│             │ WebSocket│  Socket.IO  │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
       │                       │
       │                       │
       ▼                       ▼
┌─────────────┐         ┌─────────────┐
│  Cloudinary │         │   WebRTC    │
│   (Media)   │         │  Signaling  │
└─────────────┘         └─────────────┘
```

### Component Architecture

#### Backend
- **Server Layer**: Express.js HTTP server + Socket.IO
- **Controller Layer**: Business logic handlers
- **Service Layer**: Database operations
- **Model Layer**: Mongoose schemas
- **Middleware**: Authentication, file upload, error handling

#### Frontend
- **Presentation Layer**: React components
- **State Management**: Context API (Auth, Socket, Theme)
- **Service Layer**: API calls, WebRTC logic
- **Routing**: React Router

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| Socket.IO | Real-time communication |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Multer | File uploads |
| Cloudinary | Media storage |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Socket.IO Client | Real-time client |
| Axios | HTTP client |
| React Router | Routing |
| Emoji Picker React | Emoji support |
| date-fns | Date formatting |

---

## ✨ Features

### 1. Authentication
- **Signup**: Email/phone registration
- **Login**: JWT-based authentication
- **Logout**: Session termination
- **Password Security**: Bcrypt hashing

### 2. Real-time Messaging
- **One-to-one chat**: Private conversations
- **Message delivery**: Instant via Socket.IO
- **Read receipts**: Single/double check marks
- **Typing indicators**: Real-time typing status
- **Message timestamps**: Formatted display

### 3. Media Sharing
- **Image uploads**: JPEG, PNG, GIF
- **Video uploads**: MP4, MOV, AVI
- **Document uploads**: PDF, DOC, TXT
- **File validation**: Size and type checks
- **Cloud storage**: Cloudinary integration

### 4. Video Calling
- **WebRTC**: Peer-to-peer connection
- **Video controls**: Camera on/off
- **Audio controls**: Mute/unmute
- **Call management**: Initiate, answer, reject, end
- **Connection status**: Visual indicators

### 5. User Experience
- **Online status**: Green dot indicator
- **Last seen**: Timestamp display
- **Dark mode**: Toggle theme
- **Responsive**: Mobile + desktop
- **Smooth animations**: Tailwind transitions

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String (unique, optional),
  password: String (hashed),
  avatar: String (URL),
  status: String (max 150 chars),
  lastSeen: Date,
  isOnline: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Collection
```javascript
{
  _id: ObjectId,
  members: [ObjectId] (ref: User),
  isGroup: Boolean,
  groupName: String (optional),
  groupAvatar: String (optional),
  groupAdmin: ObjectId (ref: User, optional),
  lastMessage: ObjectId (ref: Message),
  createdAt: Date,
  updatedAt: Date
}
```

### Message Collection
```javascript
{
  _id: ObjectId,
  chatId: ObjectId (ref: Chat),
  senderId: ObjectId (ref: User),
  content: String,
  mediaUrl: String (optional),
  mediaType: String (image/video/document/audio),
  seen: Boolean,
  seenAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout user (protected)
```

### Users
```
GET    /api/users/profile    - Get current user profile (protected)
PUT    /api/users/profile    - Update user profile (protected)
GET    /api/users/search     - Search users (protected)
GET    /api/users            - Get all users (protected)
```

### Chats
```
GET    /api/chats            - Get all chats (protected)
POST   /api/chats            - Create one-to-one chat (protected)
POST   /api/chats/group      - Create group chat (protected)
GET    /api/chats/:id        - Get chat by ID (protected)
```

### Messages
```
GET    /api/messages/:chatId           - Get messages for chat (protected)
POST   /api/messages                   - Send message (protected)
PUT    /api/messages/:id/seen          - Mark message as seen (protected)
PUT    /api/messages/chat/:chatId/seen - Mark all messages as seen (protected)
```

---

## 🔄 Socket Events

### Connection Events
```javascript
// Client → Server
'user:join'              - User connects with userId
'chat:join'              - Join specific chat room
'chat:leave'             - Leave chat room

// Server → Client
'user:online'            - User came online
'user:offline'           - User went offline
```

### Messaging Events
```javascript
// Client → Server
'message:send'           - Send message to chat
'typing:start'           - User started typing
'typing:stop'            - User stopped typing

// Server → Client
'message:receive'        - New message received
'message:seen'           - Message marked as seen
'typing:start'           - Someone is typing
'typing:stop'            - Someone stopped typing
```

### Call Events (WebRTC Signaling)
```javascript
// Client → Server
'call:initiate'          - Initiate call with offer
'call:answer'            - Answer call with answer
'call:ice-candidate'     - Send ICE candidate
'call:end'               - End call
'call:reject'            - Reject incoming call

// Server → Client
'call:incoming'          - Incoming call notification
'call:answered'          - Call was answered
'call:ice-candidate'     - Receive ICE candidate
'call:ended'             - Call ended by peer
'call:rejected'          - Call was rejected
```

---

## 📹 WebRTC Implementation

### Call Flow

1. **Initiating Call**
   ```
   Caller → Create PeerConnection
   Caller → Get local media stream
   Caller → Create offer
   Caller → Send offer via Socket.IO
   ```

2. **Receiving Call**
   ```
   Callee → Receive offer
   Callee → Create PeerConnection
   Callee → Get local media stream
   Callee → Create answer
   Callee → Send answer via Socket.IO
   ```

3. **ICE Candidate Exchange**
   ```
   Both peers exchange ICE candidates
   Connection established
   Media streams flowing
   ```

### STUN Servers
```javascript
{
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}
```

---

## 🔒 Security

### Authentication
- **JWT tokens**: Secure, stateless authentication
- **Password hashing**: Bcrypt with salt rounds
- **Token expiry**: 30-day expiration
- **Protected routes**: Middleware verification

### Data Validation
- **Input sanitization**: Prevent injection attacks
- **File validation**: Type and size checks
- **Email validation**: Regex pattern matching
- **Password requirements**: Minimum 6 characters

### CORS Configuration
```javascript
cors({
  origin: process.env.CLIENT_URL,
  credentials: true
})
```

### Best Practices
- Environment variables for secrets
- HTTPS in production
- Rate limiting (recommended)
- Input validation on both client and server

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist folder
```

**Environment Variables:**
- `VITE_API_URL`: Backend API URL
- `VITE_SOCKET_URL`: Socket.IO server URL

### Backend (Render/Railway)
**Environment Variables:**
- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `CLIENT_URL`: Frontend URL
- `NODE_ENV`: production

### Database (MongoDB Atlas)
1. Create cluster
2. Whitelist IP addresses
3. Create database user
4. Get connection string
5. Update MONGODB_URI

### Media Storage (Cloudinary)
1. Create account
2. Get credentials from dashboard
3. Update environment variables

---

## 📊 Performance Considerations

### Optimization Strategies
- **Message pagination**: Load 50 messages at a time
- **Image compression**: Cloudinary transformations
- **Lazy loading**: Load chats on demand
- **WebSocket efficiency**: Room-based broadcasting
- **Database indexing**: Optimized queries

### Scalability
- **Horizontal scaling**: Multiple server instances
- **Load balancing**: Distribute traffic
- **Database sharding**: Partition data
- **CDN**: Serve static assets
- **Caching**: Redis for session management

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Real-time message delivery
- [ ] Online/offline status updates
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Media uploads
- [ ] Video calling
- [ ] Dark/light mode toggle
- [ ] Responsive design

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

---

## 📝 Future Enhancements

### Planned Features
- [ ] Group chats
- [ ] Voice messages
- [ ] Message deletion
- [ ] Message forwarding
- [ ] User blocking
- [ ] Push notifications
- [ ] Message search
- [ ] Profile customization
- [ ] Status updates
- [ ] End-to-end encryption

---

## 🤝 Contributing

This is a learning project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 📄 License

MIT License - Feel free to use this project for learning purposes.

---

## 👨‍💻 Developer Notes

### Project Structure Philosophy
- **Separation of concerns**: Clear layer boundaries
- **Reusability**: Component-based architecture
- **Maintainability**: Clean, documented code
- **Scalability**: Designed for growth

### Code Style
- ES6+ JavaScript
- Functional components (React)
- Async/await for promises
- Descriptive variable names
- Comments for complex logic

---

**Built with ❤️ for learning and demonstration purposes**
