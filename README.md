# Chat App - Ứng dụng Chat Real-time

Ứng dụng Chat Real-time được xây dựng với React (Frontend) và Node.js/Express (Backend), hỗ trợ chat 1-1, group chat, quản lý bạn bè và các tính năng real-time communication.

## 📋 Yêu cầu hệ thống

- **Node.js**: v16 trở lên
- **npm**: v7 trở lên
- **MongoDB**: MongoDB Atlas (https://www.mongodb.com/cloud/atlas) 

## 🚀 Quick Start

### 1. Clone repository

```bash
git clone <repository-url>
cd Nhom89_ChatApp_demo
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```env
# MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secret Key (nên sử dụng chuỗi ngẫu nhiên mạnh)
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# JWT Expiration (milliseconds, mặc định: 86400000 = 24 giờ)
JWT_EXPIRE=86400000

# Server Port (mặc định: 8000)
PORT=8000

# Frontend URL (cho CORS)
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

Chạy backend:

```bash
npm run dev
```

Backend chạy tại: `http://localhost:8000`
WebSocket server tại: `ws://localhost:8000/ws`

### 3. Cài đặt Frontend

Mở terminal mới:

```bash
cd frontend
npm install
```

Tạo file `.env` trong thư mục `frontend/` (tùy chọn):

```env
VITE_API_URL=http://localhost:8000/api
```

Chạy frontend:

```bash
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

## ✨ Tính năng chính

### 🔐 Authentication

- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập với email/password
- ✅ Xác thực OTP qua email (development: OTP in console)
- ✅ JWT Authentication
- ✅ Protected routes

### 💬 Chat

- ✅ Chat real-time với WebSocket
- ✅ Chat 1-1 với users
- ✅ Group chat (room chat)
- ✅ Gửi/nhận tin nhắn text
- ✅ Danh sách conversations
- ✅ Lịch sử tin nhắn (pagination)
- ✅ Real-time message updates

### 👥 User Management

- ✅ Quản lý profile (cập nhật thông tin)
- ✅ Quản lý bạn bè (friends)
- ✅ Gửi/nhận friend requests
- ✅ Tìm kiếm users
- ✅ Online/Offline status

### 📞 Call (Notifications)

- ✅ Audio call notifications
- ✅ Video call notifications
- ✅ Call logs

## 🔌 API Overview

### Authentication Endpoints

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/verify` - Xác thực OTP
- `POST /api/auth/send-otp` - Gửi lại OTP

### User Endpoints (Protected)

- `GET /api/user/get-me` - Lấy thông tin user hiện tại
- `PATCH /api/user/update-me` - Cập nhật profile
- `GET /api/user/get-users` - Lấy danh sách users
- `GET /api/user/get-all-verified-users` - Lấy tất cả users đã verified
- `GET /api/user/get-friends` - Lấy danh sách bạn bè
- `GET /api/user/get-requests` - Lấy friend requests
- `POST /api/user/start-audio-call` - Bắt đầu audio call
- `POST /api/user/start-video-call` - Bắt đầu video call
- `GET /api/user/get-call-logs` - Lấy lịch sử cuộc gọi

### Message Endpoints (Protected)

- `POST /api/message/conversation` - Tạo/lấy conversation
- `GET /api/message/conversations` - Lấy tất cả conversations
- `GET /api/message/messages/:conversationId` - Lấy messages
- `POST /api/message/send` - Gửi message

**📚 Xem chi tiết API documentation tại:** [backend/README.md](./backend/README.md)

## 🔌 WebSocket Events

WebSocket server chạy tại `ws://localhost:8000/ws` với format:

```json
{
  "action": "onchat",
  "data": {
    "event": "EVENT_NAME",
    "data": {
      /* event data */
    }
  }
}
```

### Events chính:

- `REGISTER`, `LOGIN`, `RE_LOGIN`, `LOGOUT` - Authentication
- `CREATE_ROOM`, `JOIN_ROOM` - Room management
- `GET_ROOM_CHAT_MES`, `GET_PEOPLE_CHAT_MES` - Lấy messages
- `SEND_CHAT` - Gửi tin nhắn
- `GET_USER_LIST` - Lấy danh sách users

**📚 Xem chi tiết WebSocket events tại:** [backend/README.md](./backend/README.md#-websocket-events)

## 🛠️ Công nghệ sử dụng

### Backend

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **WebSocket (ws)** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **otp-generator** - OTP generation

### Frontend

- **React 18** - UI library
- **Vite** - Build tool và dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **WebSocket (ws)** - Real-time communication

## 📝 Environment Variables

### Backend (.env)

```env
# MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secret Key (nên sử dụng chuỗi ngẫu nhiên mạnh)
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# JWT Expiration (milliseconds, mặc định: 86400000 = 24 giờ)
JWT_EXPIRE=86400000

# Server Port (mặc định: 8000)
PORT=8000

# Frontend URL (cho CORS)
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

### Frontend (.env) - Tùy chọn

```env
VITE_API_URL=http://localhost:8000/api
```

## 🔒 Security Features

- ✅ Password hashing với bcrypt (12 rounds)
- ✅ JWT authentication
- ✅ CORS protection
- ✅ Rate limiting (100 requests/15 minutes)
- ✅ MongoDB injection protection
- ✅ XSS protection
- ✅ Helmet.js security headers
- ✅ Input validation và sanitization

## 🐛 Troubleshooting

### Backend không kết nối được MongoDB

- ✅ Kiểm tra MongoDB đang chạy (local) hoặc connection string (Atlas)
- ✅ Kiểm tra `DATABASE_URL` trong `.env` đúng format
- ✅ Kiểm tra network/firewall nếu dùng MongoDB Atlas

### Frontend không gọi được API

- ✅ Kiểm tra backend đang chạy tại `http://localhost:8000`
- ✅ Kiểm tra proxy settings trong `vite.config.js`
- ✅ Kiểm tra CORS settings trong backend `app.js`
- ✅ Kiểm tra `VITE_API_URL` trong `.env` (nếu có)

### WebSocket không kết nối

- ✅ Kiểm tra WebSocket URL: `ws://localhost:8000/ws`
- ✅ Kiểm tra backend WebSocket server đang chạy
- ✅ Kiểm tra CORS settings
- ✅ Kiểm tra firewall/network blocking WebSocket

### Authentication errors

- ✅ Kiểm tra JWT token có trong localStorage
- ✅ Kiểm tra token chưa hết hạn
- ✅ Kiểm tra `JWT_SECRET` trong backend `.env`

**📚 Xem thêm troubleshooting tại:**

- [backend/README.md](./backend/README.md#-troubleshooting)
- [frontend/README.md](./frontend/README.md#-troubleshooting)

## 📚 Documentation

- **[Backend Documentation](./backend/README.md)** - Chi tiết về API, WebSocket, Models, Security
- **[Frontend Documentation](./frontend/README.md)** - Chi tiết về Pages, Routing, State Management, Styling

## 🚀 Development Workflow

1. **Start MongoDB** (nếu dùng local)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd frontend && npm run dev` (terminal mới)
4. Truy cập ứng dụng tại `http://localhost:5173`

## 📦 Build cho Production

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

Build files sẽ được tạo trong `dist/` folder, có thể deploy lên bất kỳ static hosting nào (Vercel, Netlify, etc.)

## 📄 License

ISC

## 👥 Authors

Nhom89_ChatApp

---

**Lưu ý**: Trong development mode, OTP sẽ được in ra console backend. Trong production, nên implement email sending thực sự.
